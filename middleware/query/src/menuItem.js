// @flow
import { ResourceNotFoundError } from 'alfred/core/errors';

module.exports = {
  description:
    'Queries the loaded menu and ensures theres an item inside the category',
  priority: 3,
  match: '/v1/menus/:menuId/categories/:categoryId/items/:itemId/',
  async run(req, res, next) {
    try {
      const { category } = req.data;
      let item;
      let len;
      let i;

      for (i = 0, len = category.items.length; i < len; i += 1) {
        if (category.items[i]._id.toString() === req.params.itemId) {
          item = category.items[i];
        }
      }

      if (item) {
        req.data.item = item;
        return next();
      }

      throw new ResourceNotFoundError("That item doesn't exist.");
    } catch (e) {
      return res.$fail(e);
    }
  }
};
