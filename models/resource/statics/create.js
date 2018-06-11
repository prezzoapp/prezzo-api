/* ==========================================================================
   Local variables, module dependencies
   ========================================================================== */

import $q from 'q';
import log from 'alfred/services/logger';
import { getUploadUrl } from 'alfred/services/s3';
import { uuid, extend } from 'alfred/services/util';
import configLoader from 'alfred/services/configLoader';

/* ==========================================================================
   Exports - function
   ========================================================================== */

module.exports = {
  name: 'create',
  run(data, config) {
    log.debug('hit resource::create model', arguments);

    const alias = this;
    const deferred = $q.defer();
    const split = data.mime.split('/');
    const { S3_DEFAULT_ACL } = configLoader.get('s3');

    // get the file extension from the file config
    const fileExt = split[1] ? `.${split[1]}` : '';

    // build the key that will be used to access the bucket,
    // composed of a folder name (the environment),
    // a uuid, and the extension of the original file
    // EX: cdb78630-7824-11e4-bd89-1b444c1e8211 + '.jpg'
    const key = `${configLoader.get('NODE_ENV')}/${uuid()}${fileExt}`;

    log.debug('resource::create keys', fileExt, key);

    // base for new file in resource
    const fileConfig = extend({}, data, {
      key,
      mime: data.mime,
      size: data.size,
      acl: config.acl || S3_DEFAULT_ACL,
      type: 'original'
    });

    // base for new resource
    const resourceConfig = {
      creator: data.creator._id || data.creator,
      name: data.name || '',
      type: data.type || null,
      files: [fileConfig]
    };

    // the new mongoose Resource instance
    const resource = new alias(resourceConfig);

    // holds async requests
    const promises = [];

    // make async requests to save resource and generate s3 upload url for new file
    promises.push(resource.save());
    promises.push(getUploadUrl(resource.files[0], config));

    log.debug('resource::create prepared promises');

    $q
      .all(promises)
      .then(results => {
        const savedResource = results[0];
        const uploadData = results[1];

        if (!savedResource.files[0].meta) {
          savedResource.files[0].meta = {};
        }

        // Merge url data into file's meta
        extend(savedResource.files[0].meta, uploadData);

        return deferred.resolve(savedResource);
      })
      .fail(err => deferred.reject(err));

    return deferred.promise;
  }
};
