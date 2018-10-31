// @flow
import $q from 'q';
import bcrypt from 'bcrypt';
import { BadRequestError } from 'alfred/core/errors';

module.exports = {
  name: 'comparePassword',
  run(testPassword) {
    const { promise, resolve, reject } = $q.defer();

    bcrypt
      .compare(testPassword, this.password)
      .then(isMatch => {
        if (!isMatch) {
          throw BadRequestError('Invalid password.');
        }

        resolve();
      })
      .catch(reject);

    return promise;
  }
};
