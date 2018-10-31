// @flow
import type { $Request, $Response } from 'express';
import { isValidEmail } from 'alfred/services/util';
import { ServerError } from 'alfred/core/errors';
import log from 'alfred/services/logger';
import { createUser } from '../../models/user';

module.exports = {
  description: 'Creates a user.',
  path: '/v1/users',
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
      firstName: {
        type: 'string',
        required: true,
        trim: true
      },
      lastName: {
        type: 'string',
        required: true,
        trim: true
      },
      password: {
        type: 'string',
        required: true,
        trim: true
      },
      isSubscribedToPromotions: {
        type: 'boolean'
      },
      avatarURL: {
        type: 'string'
      },
      facebookId: {
        type: 'string'
      },
      facebookToken: {
        type: 'string'
      }
    },
    query: {
      login: {
        type: 'string',
        enum: ['ios', 'android', 'web']
      }
    }
  },
  transform(req) {
    const { firstName, lastName } = req.body;
    req.body.fullName = `${firstName.toLowerCase()} ${lastName.toLowerCase()}`;
  },
  async run(req: $Request, res: $Response) {
    try {
      const user = await createUser(req.body);

      if (req.query.login) {
        const authenticatedUser = await user.startSession(req.query.login);

        return res.$end(authenticatedUser);
      }

      res.$end(user);
    } catch (e) {
      log.warn('Failed to create user.', e);
      res.$fail(new ServerError(e));
    }
  }
};
