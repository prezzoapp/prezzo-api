// @flow
import $q from 'q';
import { ServerError } from 'alfred/core/errors';
import { deleteObject } from 'alfred/services/s3';

module.exports = {
  name: 'destroy',
  run() {
    const alias = this;
    const deferred = $q.defer();

    // loop through files, remove each item from s3
    const promises = (alias.files || []).map(file => deleteObject(file.key));

    $q
      .allSettled(promises)
      .then(() => {
        const deferred2 = $q.defer();

        alias.model('Resource').findByIdAndRemove(alias._id, (err, result) => {
          if (err) {
            return deferred2.reject(new ServerError(err));
          }

          return deferred2.resolve(result);
        });

        return deferred2.promise;
      })
      .then(result => deferred.resolve(result))
      .fail(err => deferred.reject(new ServerError(err)));

    return deferred.promise;
  }
};
