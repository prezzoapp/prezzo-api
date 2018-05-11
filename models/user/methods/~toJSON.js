// @flow
import whitelistFields from '../config/populate.json';

module.exports = {
  name: 'toJSON',
  run() {
    const alias = this.toObject();
    const obj = {};

    Object.keys(whitelistFields).forEach(key => {
      obj[key] = alias[key];
    });

    return obj;
  }
};
