// @flow
import type { $Request, $Response } from 'express';
import { deferReject } from 'alfred/services/util';
import { ForbiddenError, BadRequestError } from 'alfred/core/errors';
import { debug } from 'alfred/services/logger';
import { addCategoryToMenu } from '../../models/menu';

const isSameString = (str1, str2) =>
  str1.toLowerCase().trim() === str2.toLowerCase().trim();

module.exports = {
  description: 'Adds a category to a menu.',
  path: '/v1/menus/:menuId/categories',
  method: 'POST',
  config: {
    body: {
      title: {
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
    },
    req => {
      debug('Checking if title is duplicate in menu.');
      const { categories } = req.data.menu;
      for (let i = 0, len = categories.length; i < len; i += 1) {
        if (isSameString(categories[i].title, req.body.title)) {
          return deferReject(
            new BadRequestError('You already have a category with this title.')
          );
        }
      }
    }
  ],
  async run(req: $Request, res: $Response) {
    try {
      debug('Creating category.');
      const menu = await addCategoryToMenu(req.data.menu, req.body);
      return res.$end(menu);
    } catch (e) {
      return res.$fail(e);
    }
  }
};
