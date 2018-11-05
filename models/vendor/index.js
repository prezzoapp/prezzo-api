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

  const savedVendor = new Vendor(vendor);
  savedVendor.save(err => {
    if (err) {
      return reject(new ServerError(err));
    }

    User.findByIdAndUpdate(
      user._id,
      {
        vendor: savedVendor
      },
      {
        new: true
      },
      (err2, updatedUser) => {
        if (err) {
          return reject(new ServerError(err2));
        } else if (!updatedUser) {
          return reject(new ResourceNotFoundError('Failed to find user.'));
        }

        return resolve(savedVendor);
      }
    );
  });

  return promise;
};

export const findVendorById = vendorId => {
  const { promise, resolve, reject } = $q.defer();

  Vendor.findById(vendorId)
    .populate('menu')
    .exec((err, vendor) => {
      if (err) {
        return reject(new ServerError(err));
      } else if (!vendor) {
        return reject(new ResourceNotFoundError('Failed to find vendor.'));
      }

      return resolve(vendor);
    });

  return promise;
};

export const updateVendor = (vendorId, params) => {
  const { promise, resolve, reject } = $q.defer();

  Vendor.findByIdAndUpdate(
    vendorId,
    {
      $set: params
    },
    {
      new: true
    },
    (err, updatedVendor) => {
      if (err) {
        return reject(new ServerError(err));
      } else if (!updatedVendor) {
        return reject(new ResourceNotFoundError('Failed to find vendor.'));
      }

      return resolve(updatedVendor);
    }
  );

  return promise;
};

export const listVendors = (params: any) => {
  const { promise, resolve, reject } = $q.defer();

  console.log("Params: ");
  console.log(params);

  Vendor.find(params)
    .populate('menu')
    .exec((err, vendors) => {
      if (err) {
        return reject(new ServerError(err));
      }

      return resolve(vendors);
    });

  return promise;
};

export default Vendor;
