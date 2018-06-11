// @flow
import $q from 'q';
import { ServerError, ResourceNotFoundError } from 'alfred/core/errors';

const Resource = require('../../services/mongo').registerModel(
  __dirname,
  'Resource'
);

export default Resource;

export const findById = (id: string) => {
  const { promise, resolve, reject } = $q.defer();

  Resource.findById(id, (err, resource) => {
    if (err) {
      return reject(new ServerError(err));
    } else if (!resource) {
      return reject(new ResourceNotFoundError());
    }

    resolve(resource);
  });

  return promise;
};

export const findOneAndUpdate = (query: any, update: any, options: any) => {
  const { promise, resolve, reject } = $q.defer();

  Resource.findOneAndUpdate(query, update, options, (err, resource) => {
    if (err) {
      return reject(new ServerError(err));
    } else if (!resource) {
      return reject(new ResourceNotFoundError());
    }

    return resolve(resource);
  });

  return promise;
};

export const markUploadAsComplete = (resourceId: string, fileId: string) => {
  const { promise, resolve, reject } = $q.defer();

  Resource.findOneAndUpdate(
    {
      _id: resourceId,
      'files._id': fileId
    },
    {
      $set: {
        'files.$.status': 'ready'
      }
    },
    {
      new: true
    },
    (err, resource) => {
      if (err) {
        return reject(new ServerError(err));
      } else if (!resource) {
        return reject(new ResourceNotFoundError());
      }

      return resolve(resource);
    }
  );

  return promise;
};
