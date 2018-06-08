// @flow
import $q from 'q';
import { ServerError, ResourceNotFoundError } from 'alfred/core/errors';
import log from 'alfred/services/logger';

const User = require('../../services/mongo').registerModel(__dirname, 'User');

export default User;

export const createUser = async (params: any = {}) => new User(params).save();

export const findUserByEmail = (email: string) => {
  const deferred = $q.defer();
  const { promise, resolve, reject } = deferred;

  User.findOne({ email }, (err, user) => {
    if (err) {
      return reject(new ServerError(err));
    } else if (!user) {
      return reject(
        new ResourceNotFoundError('No user exists with that email.')
      );
    }

    return resolve(user);
  });

  return promise;
};

export const listUsers = (query: any = {}) => User.find(query);
