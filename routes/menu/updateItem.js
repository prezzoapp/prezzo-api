// @flow
import type { $Request, $Response } from 'express';
import { deferReject } from 'alfred/services/util';
import { ForbiddenError } from 'alfred/core/errors';
import { debug, warn } from 'alfred/services/logger';
import { updateItemInMenuCategory } from '../../models/menu';

module.exports = {
  description: 'Adds an item to a category in a menu.',
  path: '/v1/menus/:menuId/categories/:categoryId/items/:itemId',
  method: 'PUT',
  config: {
    body: {
      title: {
        type: 'string'
      },
      description: {
        type: 'string'
      },
      price: {
        type: 'number'
      }
    }
  },
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
          new ForbiddenError('You must be the vendor to update the menu.')
        );
      }
    }
  ],
  async run(req: $Request, res: $Response) {
    try {
      debug('Updating item in category.');
      const menu = await updateItemInMenuCategory(
        req.params.menuid,
        req.params.categoryid,
        req.params.itemid,
        req.data.menu,
        req.body
      );

      return res.$end(menu);
    } catch (e) {
      warn('error updating item', e);
      return res.$fail(e);
    }
  }
};
