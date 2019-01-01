// @flow
import type { $Request, $Response } from 'express';
import { isValidEmail } from 'alfred/services/util';
import { ServerError } from 'alfred/core/errors';
import { debug, log } from 'alfred/services/logger';
import { findUserByEmail } from '../../models/user';

module.exports = {
  description: 'Used to login to a user account.',
  path: '/v1/auth/login',
  method: 'POST',
  authorize: false,
  config: {
    body: {
      email: {
        type: 'string',
        required: true,
        lowercase: true,
        trim: true,
        validate: isValidEmail
      },
      password: {
        type: 'string',
        required: true,
        trim: true
      },
      type: {
        type: 'string',
        required: true,
        enum: ['ios', 'android', 'web']
      },
      pushToken: {
        type: 'string'
      }
    }
  },
  validate: [
    req =>
      findUserByEmail(req.body.email).then(user => {
        req.data.user = user;
      }),
    req => req.data.user.comparePassword(req.body.password)
  ],
  async run(req: $Request, res: $Response) {
    try {
      const { type, pushToken } = req.body;
      const user = await req.data.user.startSession(type, pushToken);

      res.set({
          res_code: 200,
          res_message: 'Success'
      });
      res.$end(user.toObject());
    } catch (e) {
      log.warn('Failed to login.', e);
      res.$fail(new ServerError(e));
    }
  }
};
