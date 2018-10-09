// @flow
import { debug } from 'alfred/services/logger';
import { findVendorById } from '../../../models/vendor';

module.exports = {
  description:
    'Queries a vendor from the database and loads it into the request object.',
  priority: 2,
  match: '/v1/vendors/:id/',
  async run(req, res, next) {
    debug('hit vendor query middleware');

    try {
      req.data.vendor = await findVendorById(req.params.id);
      next();
    } catch (e) {
      return res.$fail(e);
    }
  }
};
