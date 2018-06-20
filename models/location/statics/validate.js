// @flow

module.exports = {
  name: 'validate',
  run(json) {
    if (!json) {
      return false;
    } else if ((!json.longitude || !json.latitude) && !json.postalCode) {
      return false;
    } else if (!json.name && !json.address) {
      return false;
    }

    return true;
  }
};
