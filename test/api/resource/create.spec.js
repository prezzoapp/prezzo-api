/* ==========================================================================
   internal & imported variables
   ========================================================================== */

import $q from 'q';
import fs from 'fs';
import log from 'alfred/services/logger';
import util from 'alfred/services/util';

/* ==========================================================================
   Exports - test configuration
   ========================================================================== */

module.exports = [
  {
    description: 'should require authorization',
    method: 'POST',
    path: '/v1/resources',
    expectStatus: 401
  },
  {
    description: 'should return 400 (bad request) if `mime` not sent',
    method: 'POST',
    path: '/v1/resources',
    $$basicAuth: 'user-0',
    expectStatus: 400,
    $$send: {
      size: 1024,
      type: 'userAvatar',
    }
  },
  {
    description: 'should return 400 (bad request) if `size` not sent',
    method: 'POST',
    path: '/v1/resources',
    $$basicAuth: 'user-0',
    expectStatus: 400,
    $$send: {
      mime: 'image/jpeg',
      type: 'userAvatar',
    }
  },
  {
    description: 'should return 400 (bad request) if `type` not sent',
    method: 'POST',
    path: '/v1/resources',
    $$basicAuth: 'user-0',
    expectStatus: 400,
    $$send: {
      size: 1024,
      mime: 'image/jpeg'
    }
  },
  {
    description: 'should return 400 (bad request) if `type` in not in enums',
    method: 'POST',
    path: '/v1/resources',
    $$basicAuth: 'user-0',
    expectStatus: 400,
    $$send: {
      size: 1024,
      mime: 'image/jpeg',
      type: 'asdf',
    }
  },
  {
    description: 'should succeed if `name` not sent',
    method: 'POST',
    path: '/v1/resources',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    $$send: {
      size: 1024,
      mime: 'image/jpeg',
      type: 'userAvatar',
    }
  },
  {
    description: 'should create a resource with the specified parameters',
    method: 'POST',
    path: '/v1/resources',
    $$basicAuth: 'user-0',
    $$send: {
      name: 'testing name',
      type: 'userAvatar',
      size: 2323,
      mime: 'image/jpeg'
    },
    expectStatus: 200,
    expectKeys: [
      '_id',
      'name',
      'files',
      'files[0]._id',
      'files[0].key',
      'files[0].status',
      'files[0].acl',
      'files[0].type',
      'files[0].size',
      'files[0].meta.uploadUrl'
    ],
    expectKeyValue: {
      name: 'testing name',
      type: 'userAvatar',
      'files[0].size': 1024,
      'files[0].mime': 'image/jpeg',
      'files[0].type': 'original',
    },
    after: function(ctrllr, response) {
      console.log('response.status', response.status);
      console.log('response.body', response.body);
    },
  },
  {
    description: 'should create a resource with a nested file object',
    method: 'POST',
    path: '/v1/resources',
    $$basicAuth: 'user-0',
    $$send: {
      size: 2323,
      mime: 'image/jpeg',
      type: 'userAvatar'
    },
    expectStatus: 200,
    expectKeys: [
      '_id',
      'files',
      'files[0]._id',
      'files[0].key',
      'files[0].status',
      'files[0].acl',
      'files[0].mime',
      'files[0].type',
      'files[0].size',
      'files[0].meta.uploadUrl'
    ]
  },
  {
    description: 'should return a nested file with an `uploadUrl` that can be uploaded to',
    method: 'POST',
    url: '/v1/resources',
    $$basicAuth: 'user-0',
    $$send: {
      size: 2323,
      mime: 'image/jpeg',
      type: 'userAvatar',
    },
    after: function(ctrllr, response) {
      var
        deferred = $q.defer(),
        req = require('request'),
        configLoader = require('alfred/services/configLoader'),
        stats = fs.statSync(__dirname + '/../../../bin/text-icon.png'),
        proxy = configLoader.get('proxy') || null,
        payload = {
          url: response.body.files[0].meta.uploadUrl,
          headers: {
            'Content-Type': 'image/jpeg',
            'Content-Length': 2323
          },
          formData: {
            file: fs.createReadStream(__dirname + '/../../../bin/text-icon.png')
          },
          // proxy: proxy
        };

      // log.info('prepared proxy', proxy);

      req.put(payload, function(err, httpResponse, body) {
        ctrllr.assert('should have uploaded without errors', function() {
          return err ? false : true;
        });

        if (err) {
          log.warn('got error uploading to amazon', err, '');
          return deferred.reject(err);
        }

        log.debug('got amazon response', httpResponse, '');

        ctrllr.assert('should return a proper status from amazon', function() {
          return httpResponse.statusCode >= 200 && httpResponse.statusCode < 400;
        }, 200, httpResponse.statusCode);

        return deferred.resolve(true);
      });

      return deferred.promise;
    }
  },
  {
    description: 'should provide an aws policy when specifying the `addPolicy` query parameter',
    method: 'POST',
    url: '/v1/resources?addPolicy=true',
    $$basicAuth: 'user-0',
    $$send: {
      size: 2323,
      mime: 'image/jpeg',
      type: 'userAvatar',
    },
    expectStatus: 200,
    expectKeys: [
      '_id',
      'files',
      'files[0]._id',
      'files[0].key',
      'files[0].status',
      'files[0].acl',
      'files[0].type',
      'files[0].size',
      'files[0].meta.policy',
      'files[0].meta.uploadUrl'
    ],
    after: function(ctrllr, response) {
      var
        deferred = $q.defer(),
        FormData = require('form-data'),
        policy = response.body.files[0].meta.policy || {},
        form = new FormData();

      for (var key in policy) {
        form.append(key, policy[key]);
      }

      form.append('file', fs.createReadStream(__dirname + '/../../../bin/text-icon.png'));
      form.submit(response.body.files[0].meta.uploadUrl, function(err, res) {
        ctrllr.assert('should have uploaded without errors', !err);
        ctrllr.assert('should return a proper status from amazon', function() {
          return res.statusCode >= 200 && res.statusCode < 400;
        }, 200, res.statusCode);

        deferred.resolve(true);
      });

      return deferred.promise;
    }
  },
  {
    description: 'should allow specifying the acl as a query parameter',
    method: 'POST',
    url: '/v1/resources?acl=' + encodeURIComponent('public-read'),
    $$basicAuth: 'user-0',
    $$send: {
      size: 2323,
      mime: 'image/jpeg',
      type: 'userAvatar',
    },
    expectStatus: 200,
    expectKeyValue: {
      'files[0].acl': 'public-read'
    },
    tags: [
      'resource.create'
    ],
    after: function(ctrllr, response) {
      var
        deferred = $q.defer(),
        req = require('request'),
        stats = fs.statSync(__dirname + '/../../../bin/text-icon.png'),
        payload = {
          url: response.body.files[0].meta.uploadUrl,
          headers: {
            'Content-Type': 'image/jpeg',
            'Content-Length': 2323
          },
          formData: {
            file: fs.createReadStream(__dirname + '/../../../bin/text-icon.png')
          }
        };

      req.put(payload, function(err, httpResponse, body) {
        ctrllr.assert('should have uploaded without errors', function() {
          return err ? false : true;
        });

        if (err) {
          return deferred.reject(err);
        }

        ctrllr.assert('should return a proper status from amazon', function() {
          return httpResponse.statusCode >= 200 && httpResponse.statusCode < 400;
        }, 200, httpResponse.statusCode);

        return deferred.resolve(true);
      });

      return deferred.promise;
    }
  },
  {
    description: 'should allow uploading zip files',
    method: 'POST',
    url: '/v1/resources?addPolicy=true',
    $$basicAuth: 'user-0',
    $$send: {
      size: 2131,
      mime: 'application/zip',
      type: 'userAvatar',
    },
    expectStatus: 200,
    expectKeys: [
      '_id',
      'files',
      'files[0]._id',
      'files[0].key',
      'files[0].status',
      'files[0].acl',
      'files[0].type',
      'files[0].size',
      'files[0].meta.policy',
      'files[0].meta.uploadUrl'
    ],
    after: function(ctrllr, response) {
      var
        deferred = $q.defer(),
        FormData = require('form-data'),
        policy = response.body.files[0].meta.policy || {},
        form = new FormData(),
        uploadUrl = response.body.files[0].meta.uploadUrl;

      for (var key in policy) {
        form.append(key, policy[key]);
      }

      form.append('file', fs.createReadStream(__dirname + '/../../../bin/text-icon.png'));

      log.debug('created form', form);

      form.submit(uploadUrl, function(err, res) {
        ctrllr.assert('should have uploaded without errors', function() {
          if (err) {
            console.log('error uploading', err);
            return false;
          }

          return true;
        });
        ctrllr.assert('should return a proper status from amazon', function() {
          return res && res.statusCode && res.statusCode >= 200 && res.statusCode < 400;
        }, 200, res.statusCode);

        deferred.resolve(true);
      });

      return deferred.promise;
    }
  },
  {
    description: 'should allow uploading mp4 files',
    method: 'POST',
    url: '/v1/resources?addPolicy=true',
    $$basicAuth: 'user-0',
    $$send: {
      size: 381927,
      mime: 'video/mp4',
      type: 'userAvatar',
    },
    expectStatus: 200,
    after: function(ctrllr, response) {
      var
        deferred = $q.defer(),
        FormData = require('form-data'),
        policy = response.body.files[0].meta.policy || {},
        form = new FormData(),
        uploadUrl = response.body.files[0].meta.uploadUrl;

      for (var key in policy) {
        form.append(key, policy[key]);
      }

      form.append('file', fs.createReadStream(__dirname + '/../../../bin/text-icon.png'));

      log.debug('created form', form);

      form.submit(uploadUrl, function(err, res) {
        ctrllr.assert('should have uploaded without errors', function() {
          if (err) {
            console.log('error uploading', err);
            return false;
          }

          return true;
        });

        ctrllr.assert('should return a proper status from amazon', function() {
          console.log('status code', res ? res.statusCode : null);
          return res && res.statusCode && res.statusCode >= 200 && res.statusCode < 400;
        }, 200, res.statusCode);

        deferred.resolve(true);
      });

      return deferred.promise;
    }
  }
];
