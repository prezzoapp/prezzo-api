// @flow
import $q from 'q';
import { ServerError } from 'alfred/core/errors';

module.exports = {
  name: 'getUploadUrl',
  run() {
    const { promise, reject } = $q.defer();
    setTimeout(
      () =>
        reject(
          new ServerError("File::getUploadUrl hasn't been implemented yet.")
        ),
      0
    );
    return promise;
  }
};
