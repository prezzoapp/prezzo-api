// @flow
import type { $Request, $Response } from 'express';
import { ServerError, ForbiddenError } from 'alfred/core/errors';
import log from 'alfred/services/logger';
import { deferReject, getValueForURLParam } from 'alfred/services/util';
import { validateToken } from 'alfred/services/facebook';
import { findAndUpdateUser } from '../../models/user';

module.exports = {
  description: 'Used to add a Facebook account to a users account.',
  path: '/v1/users/:id/facebook',
  method: 'PUT',
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
      }
    }
  },
  validate: [
    req => {
      const path = '/v1/users/:id';
      const userId = getValueForURLParam(path, req.path, ':id');
      if (userId !== req.user._id.toString()) {
        return deferReject(new ForbiddenError());
      }
    },
    req => validateToken(req.body.facebookId, req.body.facebookToken)
  ],
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
