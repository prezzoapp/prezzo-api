// @flow
import type { $Request, $Response } from 'express';
import { isValidEmail } from 'alfred/services/util';
import { createUser } from '../../models/user';

module.exports = {
  description: 'Creates a user.',
  path: '/v1/users',
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
    }
  },
  async run(req: $Request, res: $Response) {
    const user = await createUser(req.body);
    res.$end(user);
  }
};
