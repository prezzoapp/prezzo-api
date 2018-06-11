/* ==========================================================================
   internal & imported variables
   ========================================================================== */

import $q from 'q';
import request from 'superagent';
import log from 'alfred/services/logger';
import util from 'alfred/services/util';
import s3 from 'alfred/services/s3';
import configLoader from 'alfred/services/configLoader';

/* ==========================================================================
   Exports - helper functions
   ========================================================================== */

function uploadResourceToS3(resource) {
  var
    deferred = $q.defer(),
    filePath =  process.cwd() + '/bin/text-icon.jpg';

  s3.uploadFileFromPath(filePath, {
    Key: resource.files[0].key,
  }).then(function() {
    return deferred.resolve();
  }).fail(function(err) {
    log.warn('Error uploading file to S3.', err);
    return deferred.reject(err);
  })

  return deferred.promise;
}

/* ==========================================================================
   Exports - test configuration
   ========================================================================== */

module.exports = [{
  description: 'should require authorization',
  $$url: '/v1/resources/{{ resource-0._id }}',
  method: 'DEL',
  expectStatus: 401,
}, {
  description: 'should return status 404 (resource not found) if the resource doesn\'t exist',
  $$url: '/v1/resources/{{ randomObjectId }}',
  method: 'DEL',
  $$basicAuth: 'user-0',
  expectStatus: 404,
}, {
  description: 'should return status 403 (forbidden) if the resource doesn\'t belong to the authenticated user',
  $$url: '/v1/resources/{{ resource-0._id }}',
  method: 'DEL',
  $$basicAuth: 'user-1',
  expectStatus: 403,
}, {
  description: 'should return remove the resource on success',
  $$url: '/v1/resources/{{ resource-0._id }}',
  method: 'DEL',
  $$basicAuth: 'user-0',
  expectStatus: 204,
  $$assertModel: {
    $model: 'resource',
    $_id: '{{ resource-0._id }}',
    $then: function(resource, ctrllr) {
      ctrllr.assert('should have removed the resource', function() {
        return resource ? false : true;
      });
    },
  },
}, {
  description: 'should remove the resource from s3',
  $$url: '/v1/resources/{{ resource-0._id }}',
  method: 'DEL',
  $$basicAuth: 'user-0',
  before: function(ctrllr, request) {
    var
      store = ctrllr.getStore(),
      resource = store.get('resource-0');

    return uploadResourceToS3(resource, {
      Key: resource.key,
    });
  },
  expectStatus: 204,
  after: function(ctrllr, response) {
    var
      deferred = $q.defer(),
      store = ctrllr.getStore(),
      resource = store.get('resource-0'),
      file = resource.files[0],
      url = file.url;

    request.get(url, function(err, res) {
      ctrllr.assert('should have deleted the object from s3', function() {
        return (err || (!res || !res.status || res.status !== 200)) ? true : false;
      });

      return deferred.resolve(true);
    });

    return deferred.promise;
  },
}];
