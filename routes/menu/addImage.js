// @flow
import type { $Request, $Response } from 'express';
import { deferReject } from 'alfred/services/util';
import { ForbiddenError } from 'alfred/core/errors';
import { debug } from 'alfred/services/logger';
import { addPhotoToMenuCategoryItem } from '../../models/menu';

module.exports = {
  description: 'Adds a photo to an item in a menu category.',
  path: '/v1/menus/:menuId/categories/:categoryId/items/:itemId/photos',
  method: 'POST',
  config: {
    body: {
      imageURL: {
        type: 'string',
        required: true
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
      debug('Adding item to category.');
      const menu = await addPhotoToMenuCategoryItem(
        req.params.menuid,
        req.params.categoryid,
        req.params.itemid,
        req.data.menu,
        req.body.imageURL
      );

      return res.$end(menu);
    } catch (e) {
      return res.$fail(e);
    }
  }
};
