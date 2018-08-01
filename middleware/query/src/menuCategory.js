// @flow
import { ResourceNotFoundError } from 'alfred/core/errors';
import { debug } from 'alfred/services/logger';

module.exports = {
  description:
    'Queries a menu from the database and loads it into the request object.',
  priority: 4,
  match: '/v1/menus/:menuId/categories/:categoryId/',
  async run(req, res, next) {
    try {
      const { menu } = req.data;
      let category;
      let len;
      let i;

      for (i = 0, len = menu.categories.length; i < len; i += 1) {
        if (menu.categories[i]._id.toString() === req.params.categoryId) {
          category = menu.categories[i];
        }
      }

      if (category) {
        req.data.category = category;
        return next();
      }

      throw new ResourceNotFoundError("That category doesn't exist.");
    } catch (e) {
      return res.$fail(e);
    }
  }
};
