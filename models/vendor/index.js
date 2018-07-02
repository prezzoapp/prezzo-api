// @flow
import $q from 'q';
import { extend } from 'alfred/services/util';
import { ServerError, ResourceNotFoundError } from 'alfred/core/errors';
import User from '../../models/user';

const Vendor = require('../../services/mongo').registerModel(
  __dirname,
  'Vendor'
);

export const createVendor = (user, vendor) => {
  const { promise, resolve, reject } = $q.defer();

  User.findByIdAndUpdate(
    user._id,
    {
      vendor: new Vendor(vendor)
    },
    {
      new: true
    },
    (err, updatedUser) => {
      if (err) {
        return reject(new ServerError(err));
      } else if (!updatedUser) {
        return reject(new ResourceNotFoundError('Failed to find user.'));
      }

      return resolve(updatedUser);
    }
  );

  return promise;
};

export const updateVendor = (user, vendor) => {
  const { promise, resolve, reject } = $q.defer();
  const updatedVendor = extend({}, user.vendor, vendor);
  const vendorToSave = new Vendor(updatedVendor);
  vendorToSave._id = user.vendor._id;

  User.findByIdAndUpdate(
    user._id,
    {
      vendor: vendorToSave
    },
    {
      new: true
    },
    (err, updatedUser) => {
      if (err) {
        return reject(new ServerError(err));
      } else if (!updatedUser) {
        return reject(new ResourceNotFoundError('Failed to find user.'));
      }

      return resolve(updatedUser);
    }
  );

  return promise;
};

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
