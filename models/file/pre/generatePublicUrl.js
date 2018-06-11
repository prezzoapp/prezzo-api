// @flow
import configLoader from 'alfred/services/configLoader';

/* ==========================================================================
   Exports - middleware type & function
   ========================================================================== */

module.exports = {
  name: 'save',
  run(next) {
    const { S3_BUCKET } = configLoader.get('s3');

    if (!this.url && this.acl && this.acl.indexOf('public') > -1) {
      this.url = `http://${S3_BUCKET}.s3.amazonaws.com/${this.key}`;
    }

    next();
  }
};
