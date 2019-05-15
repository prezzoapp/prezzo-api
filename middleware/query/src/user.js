// @flow
import { ServerError, ResourceNotFoundError } from 'alfred/core/errors';
import { isObjectId } from 'alfred/services/util';
import { debug } from 'alfred/services/logger';
import User from '../../../models/user';

module.exports = {
  description:
    'Queries a user from the database and loads it into the request object.',
  priority: 2,
  match: '/v1/users/:id/',
  run(req, res, next) {
    debug('hit user query middleware');
    const { id } = req.params;
    const query = isObjectId(id)
      ? { _id: id }
      : {
          $or: [{ facebookId: id }, { email: id.toLowerCase() }]
        };

    User.findOne(query, (err, user) => {
      if (err) {
        return res.$fail(new ServerError(err));
      }

      req.data.user = user;
      next();
    });
  }
};
