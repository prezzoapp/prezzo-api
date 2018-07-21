// @flow
import { debug } from 'alfred/services/logger';
import { findMenuById } from '../../../models/menu';

module.exports = {
  description:
    'Queries a menu from the database and loads it into the request object.',
  priority: 2,
  match: '/v1/menus/:menuId/',
  async run(req, res, next) {
    debug('hit menu query middleware');

    try {
      req.data.menu = await findMenuById(req.params.menuId);
      next();
    } catch (e) {
      return res.$fail(e);
    }
  }
};
