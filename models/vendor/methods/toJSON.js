// @flow
import { debug } from 'alfred/services/logger';

module.exports = {
  name: 'toJSON',
  run() {
    const alias = this.toObject();

    return alias;
  }
};
