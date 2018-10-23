// @flow
import { debug } from 'alfred/services/logger';

module.exports = {
  description: 'Removes trailing slashes from the URL.',
  priority: 10,
  run(req, res, next) {
    debug('should I remove trailing slash?');

    if (req.url.substr(-1) === '/' && req.url.length > 1) {
      debug('stripping trailing slash');
      req.url = req.url.slice(0, -1);
      debug('stripped trailing slash', req.url, '');
      next();
    }
  }
};
