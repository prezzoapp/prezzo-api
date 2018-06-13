// @flow
import type { $Request, $Response } from 'express';
import { ServerError } from 'alfred/core/errors';
import log from 'alfred/services/logger';
import { validateToken } from 'alfred/services/facebook';
import { findUserByFacebookId } from '../../models/user';

module.exports = {
  description: 'Used to login to a user account.',
  path: '/v1/auth/facebook',
  method: 'POST',
  authorize: false,
  config: {
    body: {
      facebookId: {
        type: 'string',
        required: true,
        trim: true
      },
      facebookToken: {
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
    req => findUserByFacebookId(req.body.facebookId).then(user => {
        if (!req.data) req.data = {};
        req.data.user = user;
      }),
    req =>
      validateToken(req.body.facebookId, req.body.facebookToken).then(user => {
        if (!req.data) req.data = {};
        req.data.user = user;
      })
  ],
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
