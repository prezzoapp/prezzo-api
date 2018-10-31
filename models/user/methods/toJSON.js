// @flow
module.exports = {
  name: 'toJSON',
  run() {
    const alias = this.toObject();
    return alias;
  }
};
