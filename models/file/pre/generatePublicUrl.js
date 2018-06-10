// @flow
import configLoader from 'alfred/services/configLoader';

const config = configLoader.get('s3');

/* ==========================================================================
   Exports - middleware type & function
   ========================================================================== */

module.exports = {
  name: 'save',
  run(next) {
    if (!this.url && this.acl && this.acl.indexOf('public') > -1) {
      this.url = `http://${config.S3_BUCKET}.s3.amazonaws.com/${this.key}`;
    }

    next();
  }
};
