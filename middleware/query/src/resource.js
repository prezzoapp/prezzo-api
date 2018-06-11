// @flow
import log from 'alfred/services/logger';
import { findById } from '../../../models/resource';

module.exports = {
  description:
    'Queries a resource from the database and loads it into the request object.',
  priority: 2,
  match: '/v1/resources/:id/',
  async run(req, res, next) {
    log.debug('hit resource query middleware');

    try {
      req.data.resource = await findById(req.params.id);
      next();
    } catch (e) {
      return res.$fail(e);
    }
  }
};
