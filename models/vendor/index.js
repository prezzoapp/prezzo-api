// @flow
import $q from 'q';
import { ServerError } from 'alfred/core/errors';
import User from '../../models/user';

const Vendor = require('../../services/mongo').registerModel(
  __dirname,
  'Vendor'
);

export const listVendors = () => {
  const { promise, resolve, reject } = $q.defer();

  User.find({ vendor: { $exists: true }}, (err, users) => {
    if (err) {
      return reject(new ServerError(err));
    }

    return resolve(users);
  });

  return promise;
};

export default Vendor;
