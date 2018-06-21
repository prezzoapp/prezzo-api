// @flow
import { debug } from 'alfred/services/logger';

module.exports = {
  name: 'validate',
  run(json) {
    debug('validating location', json);

    if (!json) {
      return false;
    } else if (!json.longitude || !json.latitude) {
      return false;
    } else if (!json.postalCode) {
      return false;
    } else if (!json.name && !json.address) {
      return false;
    }

    return true;
  }
};
