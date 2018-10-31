// @flow
import $q from 'q';

module.exports = {
  name: 'destroy',
  run() {
    const { promise, reject } = $q.defer();
    setTimeout(100, reject);
    return promise;
  }
};
