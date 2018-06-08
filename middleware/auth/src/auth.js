// @flow
import { PermissionDeniedError, ServerError } from 'alfred/core/errors';
import {
  loadDirectorySync,
  loadDirectoryModulesSync
} from 'alfred/services/util';
import User from '../../../models/user';

const pathToRoutes = `../../../routes`;
const whitelist = [];
const routes = [];

/**
 * finds all the whitelisted routes on the server and adds 'em to the `whitelist` array
 */
function loadWhitelist() {
  routes.forEach(route => {
    if (route.authorize === false) {
      whitelist.push(route);
    }
  });
}

/**
 * checks if two urls match (one may have placeholder variables)
 * @param ref {String}
 * @param val {String}
 * @return {Boolean}
 */
function isUrlMatch(ref, val) {
  const refParts = ref.split('/');
  const valParts = val.split('/');

  if (refParts.length !== valParts.length) {
    return false;
  }

  for (let i = 0, len = refParts.length; i < len; i += 1) {
    if (refParts[i].charAt(0) === ':') {
      continue;
    } else if (refParts[i].toLowerCase() !== valParts[i].toLowerCase()) {
      return false;
    }
  }

  return true;
}

/* ==========================================================================
   Initialization logic
   ========================================================================== */

// load all the routes
loadDirectorySync(pathToRoutes).forEach(moduleName => {
  loadDirectoryModulesSync(`${pathToRoutes}/${moduleName}`).forEach(route => {
    routes.push(route);
  });
});

loadWhitelist();

/* ==========================================================================
   Exports
   ========================================================================== */

module.exports = {
  description: 'Prevents unauthenticated requests to the server.',
  priority: 2,
  run(req, res, next) {
    if (req.authorize === false) {
      return next();
    }

    let i;
    let ii;
    let len;
    let len2;
    let methods;

    for (i = 0, len = whitelist.length; i < len; i += 1) {
      methods = whitelist[i].method;
      if (!(methods instanceof Array)) {
        methods = [methods];
      }

      for (ii = 0, len2 = methods.length; ii < len2; ii += 1) {
        if (
          methods[ii].toLowerCase() === req.method.toLowerCase() &&
          isUrlMatch(whitelist[i].path, req.path)
        ) {
          return next && next();
        }
      }
    }

    let buffer;
    let keys;
    let auth = req.headers.authorization;

    if (auth) { // jshint ignore:line
      auth = auth.split(' ');

      if (auth.length !== 2 || auth[0] !== 'Basic' || !auth[1]) {
        return res.$end(new PermissionDeniedError('Bad authorization schema.'));
      }

      buffer = new Buffer(auth[1], 'base64').toString();
      keys = buffer.split(':');
    } else if (auth = req.query.token) { // jshint ignore:line
      buffer = new Buffer(auth, 'base64').toString();
      keys = buffer.split(':');
    } else {
      return res.$end(new PermissionDeniedError('Authorization required.'));
    }

    if (keys.length !== 2) {
      return res.$end(new PermissionDeniedError('Bad authorization schema (2)'));
    }

    User.findById(keys[0], (err, user) => {
      if (err) {
        return res.$end(new ServerError(err));
      } else if (!user) {
        return res.$end(new PermissionDeniedError('User not found in auth layer.'));
      }

      let sessionId = null;
      (user.sessions || []).forEach(session => {
        if ((session._id || session).toString() === keys[1]) {
          sessionId = (session._id || session).toString();
        }
      });

      if (!sessionId) {
        return res.$end(new PermissionDeniedError('User session not valid.'));
      }

      // attach user to request
      req.user = user;

      // attach session id to request
      req.sessionId = sessionId;

      // call next function in chain
      next();
    });
  }
};
