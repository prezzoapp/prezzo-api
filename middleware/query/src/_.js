// @flow
import log from 'alfred/services/logger';

module.exports = {
  description: 'Ensures that the req.data object isnt empty.',
  priority: 10,
  match: '/',
  async run(req, res, next) {
    log.debug('hit query initialization middleware');

    if (!req.data) {
      req.data = {};
    }

    next();
  }
};
