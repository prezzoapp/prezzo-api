// @flow
import type { $Request, $Response } from 'express';
import { ServerError, ForbiddenError } from 'alfred/core/errors';
import log from 'alfred/services/logger';
import { deferReject, getValueForURLParam } from 'alfred/services/util';
import { findAndUpdateUser } from '../../models/user';

module.exports = {
  description: 'Updates a user.',
  path: '/v1/users/:id',
  method: 'POST',
  config: {
    body: {
      firstName: {
        type: 'string',
        trim: true
      },
      lastName: {
        type: 'string',
        trim: true
      },
      isSubscribedToPromotions: {
        type: 'boolean'
      },
      avatarURL: {
        type: 'string',
        trim: true
      },
      phone: {
        type: 'string',
        trim: true
      },
      address: {
        type: 'string',
        trim: true
      },
      zip: {
        type: 'string',
        trim: true
      },
      city: {
        type: 'string',
        trim: true
      }
    }
  },
  validate(req) {
    const path = '/v1/users/:id';
    const userId = getValueForURLParam(path, req.path, ':id');
    if (userId !== req.user._id.toString()) {
      return deferReject(new ForbiddenError());
    }
  },
  transform(req) {
    const firstName = req.body.firstName || req.user.firstName;
    const lastName = req.body.lastName || req.user.lastName;

    req.body.fullName = `${firstName.toLowerCase()} ${lastName.toLowerCase()}`;
  },
  async run(req: $Request, res: $Response) {
    try {
      const user = await findAndUpdateUser({ _id: req.params.id }, req.body);
      res.$end(user);
    } catch (e) {
      log.warn('Failed to update user.', e);
      res.$fail(new ServerError(e));
    }
  }
};
