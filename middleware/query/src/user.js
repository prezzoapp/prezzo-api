// @flow
import { ServerError, ResourceNotFoundError } from 'alfred/core/errors';
import User from '../../../models/user';

module.exports = {
  description:
    'Queries a user from the database and loads it into the request object.',
  priority: 2,
  match: '/v1/users/:id/',
  run(req, res, next) {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        return res.$fail(new ServerError(err));
      } else if (!user) {
        return res.$fail(new ResourceNotFoundError("That user doesn't exist."));
      }

      req.data.user = user;
      next();
    });
  }
};
