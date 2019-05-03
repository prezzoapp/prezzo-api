// @flow
import $q from 'q';
import { ServerError, ResourceNotFoundError } from 'alfred/core/errors';
import log from 'alfred/services/logger';

const User = require('../../services/mongo').registerModel(__dirname, 'User');

export default User;

export const createUser = async (params: any = {}) => new User(params).save();

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
      return reject(new ResourceNotFoundError("That user doesn't exist."));
    }

    return resolve(user);
  });

  return promise;
};

export const listUsers = (query: any = {}) => User.find(query);
