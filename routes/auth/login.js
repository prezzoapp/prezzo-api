// @flow
import type { $Request, $Response } from 'express';
import $q from 'q';
import { isValidEmail } from 'alfred/services/util';
import { ServerError } from 'alfred/core/errors';
import log from 'alfred/services/logger';
import { findUserByEmail } from '../../models/user';

module.exports = {
  description: 'Creates a user.',
  path: '/v1/auth/login',
  method: 'POST',
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
  validate(req) {
    return findUserByEmail(req.body.email).then(user => {
      if (!req.data) req.data = {};
      req.data.user = user;
    });
  },
  async run(req: $Request, res: $Response) {
    try {
      const { type, pushToken } = req.body;
      const user = await req.data.user.startSession(type, pushToken);

      res.$end(user.toObject());
    } catch (e) {
      log.warn('Failed to login.', e);
      res.$fail(new ServerError(e));
    }
  }
};
