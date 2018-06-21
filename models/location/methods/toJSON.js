// @flow
import { debug } from 'alfred/services/logger';

module.exports = {
  name: 'toJSON',
  run() {
    const alias = this.toObject();
    const obj = {};

    debug('location.toJSON', alias);

    Object.keys(alias).forEach(key => {
      obj[key] = alias[key];
    });

    [obj.longitude] = obj.coordinates;
    [, obj.latitude] = obj.coordinates;
    delete obj.coordinates;

    return obj;
  }
};
