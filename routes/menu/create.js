// @flow
import type { $Request, $Response } from 'express';
import { deferReject } from 'alfred/services/util';
import { ServerError, ForbiddenError } from 'alfred/core/errors';
import log from 'alfred/services/logger';
import $q from 'q';
import { createMenu, findMenuByVendor } from '../../models/menu';

module.exports = {
  description: 'Creates a menu.',
  path: '/v1/menus',
  method: 'POST',
  validate: [
    req => {
      const { user } = req;
      if (!user.vendor) {
        return deferReject(
          new ForbiddenError('You must be a vendor to create a menu.')
        );
      }
    },
    req => {
      const { promise, resolve, reject } = $q.defer();
      const { vendor } = req.user;

      findMenuByVendor(vendor._id || vendor)
        .then(() =>
          reject(new ForbiddenError('You have already created a menu.'))
        )
        .catch(resolve);

      return promise;
    }
  ],
  async run(req: $Request, res: $Response) {
    try {
      const { vendor } = req.user;
      const menu = await createMenu(vendor._id || vendor);
      res.$end(menu);
    } catch (e) {
      log.warn('Failed to create menu.', e);
      res.$fail(new ServerError(e));
    }
  }
};
