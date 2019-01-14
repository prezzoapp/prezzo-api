// @flow
import $q from 'q';
import { ServerError, ResourceNotFoundError } from 'alfred/core/errors';
import log from 'alfred/services/logger';

const User = require('../../services/mongo').registerModel(__dirname, 'User');

export default User;

export const createUser = async (params: any = {}) => new User(params).save();
/**
 * Returns an Array of distinct values of the field passed.
 * @param  {String} field -The field whose distinct values are to be find.
 * @param  {Object={}} filter -Filter for the query on whose distinct value is to be find.
 */
export const getDistinctUserFields = async (
  field: string,
  filter: object = {}
) => {
  const { promise, resolve, reject } = $q.defer();
  User.distinct(field, filter, (err, res) => {
    if (err) {
      return reject(new ServerError(err));
    } else if (!res.length) {
      return reject(
        new ResourceNotFoundError('No value exists for the field.')
      );
    }

    return resolve(res);
  });

  return promise;
};

export const findUserByEmail = (email: string) => {
  const { promise, resolve, reject } = $q.defer();

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

export const findUserByFacebookId = (facebookId: string) => {
  const { promise, resolve, reject } = $q.defer();

  User.findOne({ facebookId }, (err, user) => {
    if (err) {
      return reject(new ServerError(err));
    } else if (!user) {
      return reject(
        new ResourceNotFoundError('No user exists with that facebook account.')
      );
    }

    return resolve(user);
  });

  return promise;
};

export const findAndUpdateUser = (query: any = {}, update: any = {}) => {
  const { promise, resolve, reject } = $q.defer();

  User.findOneAndUpdate(query, update, { new: true }, (err, user) => {
    if (err) {
      console.log(err);
      return reject(new ServerError(err));
    } else if (!user) {
      return reject(new ResourceNotFoundError('That user doesnt exist.'));
    }

    return resolve(user);
  });

  return promise;
};

export const listUsers = (query: any = {}) => User.find(query);
