// @flow
import type { $Request, $Response } from 'express';
import { deferReject, getValueForURLParam } from 'alfred/services/util';
import { ForbiddenError, BadRequestError } from 'alfred/core/errors';
import { debug } from 'alfred/services/logger';
import { updateCategoryInMenu } from '../../models/menu';

const isSameString = (str1, str2) =>
  str1.toLowerCase().trim() === str2.toLowerCase().trim();

module.exports = {
  description: 'Updates a category in a menu.',
  path: '/v1/menus/:menuId/categories/:categoryId',
  method: 'PUT',
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
          new ForbiddenError(
            "You must be the menu's vendor to update the menu."
          )
        );
      }
    },
    req => {
      debug('Checking if title is duplicate in menu.');
      const { categories } = req.data.menu;
      const path = '/v1/menus/:menuId/categories/:categoryId';
      const categoryId = getValueForURLParam(path, req.path, ':categoryId', '');

      for (let i = 0, len = categories.length; i < len; i += 1) {
        if (
          // if looking at another category in the menu
          // besides the one being updated
          // and the user wants to update the current category
          // to another category's in the menu,
          // return a bad request error
          categories[i]._id.toString() !== categoryId &&
          isSameString(categories[i].title, req.body.title)
        ) {
          return deferReject(
            new BadRequestError('You already have a category with this title.')
          );
        }
      }
    }
  ],
  async run(req: $Request, res: $Response) {
    try {
      debug('Updating category.', req.params);
      const updatedMenu = await updateCategoryInMenu(
        req.params.menuid,
        req.params.categoryid,
        req.body
      );
      return res.$end(updatedMenu);
    } catch (e) {
      return res.$fail(e);
    }
  }
};
