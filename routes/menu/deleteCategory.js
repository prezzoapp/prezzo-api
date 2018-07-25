// @flow
import type { $Request, $Response } from 'express';
import { deferReject } from 'alfred/services/util';
import { ForbiddenError } from 'alfred/core/errors';
import { debug } from 'alfred/services/logger';
import { deleteCategoryInMenu } from '../../models/menu';

module.exports = {
  description: 'Deletes a category in a menu.',
  path: '/v1/menus/:menuId/categories/:categoryId',
  method: 'DELETE',
  validate: [
    req => {
      debug('Checking if user is vendor.');
      const { user } = req;
      if (!user.vendor) {
        return deferReject(
          new ForbiddenError('You must be a vendor to modify a menu.')
        );
      }
    },
    req => {
      debug('Checking if vendor owns menu.');
      const { vendor } = req.user;
      const { menu } = req.data;
      const authenticatedVendor = (vendor._id || vendor).toString();
      const menuVendor = (menu.vendor._id || menu.vendor).toString();

      if (authenticatedVendor !== menuVendor) {
        return deferReject(
          new ForbiddenError(
            "You must be the menu's vendor to update the menu."
          )
        );
      }
    }
  ],
  async run(req: $Request, res: $Response) {
    try {
      debug('Deleting category.', req.params);
      const updatedMenu = await deleteCategoryInMenu(
        req.params.menuid,
        req.params.categoryid
      );
      return res.$end(updatedMenu);
    } catch (e) {
      return res.$fail(e);
    }
  }
};
