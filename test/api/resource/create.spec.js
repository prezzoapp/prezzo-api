/* ==========================================================================
   internal & imported variables
   ========================================================================== */

import { argv } from 'optimist';
import enableProxy from '../../../scripts/enableProxy';
const proxy = argv.proxy || null;

if (proxy) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  process.env.HTTPS_PROXY = proxy;
  process.env.HTTP_PROXY = proxy;
  // enableProxy(proxy);
}

import $q from 'q';
import fs from 'fs';
import req from 'request';
import FormData from 'form-data';
import fetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';
import log from 'alfred/services/logger';
import configLoader from 'alfred/services/configLoader';

log.info('got proxy', proxy);

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
      type: 'userAvatar'
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
      type: 'userAvatar'
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
      type: 'asdf'
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
      type: 'userAvatar'
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
      'files[0].type': 'original'
    },
    after: (ctrllr, response) => {
      console.log('response.status', response.status);
      console.log('response.body', response.body);
    }
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
    description:
      'should return a nested file with an `uploadUrl` that can be uploaded to',
    method: 'POST',
    url: '/v1/resources',
    $$basicAuth: 'user-0',
    $$send: {
      size: 2343,
      mime: 'image/jpeg',
      type: 'userAvatar'
    },
    after(ctrllr, response) {
      const deferred = $q.defer();
      const stats = fs.statSync(__dirname + '/../../../bin/text-icon.png');
      const payload = {
        url: response.body.files[0].meta.uploadUrl,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Content-Length': stats.size
        },
        formData: {
          file: fs.createReadStream(`${__dirname}/../../../bin/text-icon.png`)
        }
        // proxy: proxy
      };

      // log.info('prepared proxy', proxy);

      req.put(payload, (err, httpResponse) => {
        ctrllr.assert(
          'should have uploaded without errors',
          () => err ? false : true
        );

        if (err) {
          log.warn('got error uploading to amazon', err, '');
          return deferred.reject(err);
        }

        log.debug('got amazon response', httpResponse, '');

        ctrllr.assert(
          'should return a proper status from amazon',
          () => httpResponse.statusCode >= 200 && httpResponse.statusCode < 400,
          200,
          httpResponse.statusCode
        );

        return deferred.resolve(true);
      });

      return deferred.promise;
    }
  },
  {
    description:
      'should provide an aws policy when specifying the `addPolicy` query parameter',
    method: 'POST',
    url: '/v1/resources?addPolicy=true',
    $$basicAuth: 'user-0',
    $$send: {
      size: 2343,
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
      'files[0].type',
      'files[0].size',
      'files[0].meta.policy',
      'files[0].meta.uploadUrl'
    ],
    after(ctrllr, response) {
      const deferred = $q.defer();
      const form = new FormData();
      const stats = fs.statSync(`${__dirname}/../../../bin/text-icon.png`);
      const policy = response.body.files[0].meta.policy || {};
      const uploadUrl = response.body.files[0].meta.uploadUrl;

      for (let key in policy) {
        form.append(key, policy[key]);
      }

      form.append(
        'file',
        fs.createReadStream(`${__dirname}/../../../bin/text-icon.png`)
      );

      fetch(uploadUrl, {
        method: 'POST',
        body: form,
        agent: proxy ? new HttpsProxyAgent(proxy) : null,
        headers: {
          'Content-Length': stats.size,
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => {
          ctrllr.assert(
            'should return a proper status from amazon',
            () => res && res.status && res.status >= 200 && res.status < 400,
            200,
            res.status
          );

          deferred.resolve(true);
        })
        .catch(err => {
          log.error('error', err, '');
          ctrllr.assert('should have executed without any errors', false);
          return deferred.reject();
        });

      return deferred.promise;
    }
  },
  {
    description: 'should allow specifying the acl as a query parameter',
    method: 'POST',
    url: `/v1/resources?acl=${encodeURIComponent('public-read')}`,
    $$basicAuth: 'user-0',
    $$send: {
      size: 2343,
      mime: 'image/png',
      type: 'userAvatar'
    },
    expectStatus: 200,
    expectKeyValue: {
      'files[0].acl': 'public-read'
    },
    after(ctrllr, response) {
      const deferred = $q.defer();
      const stats = fs.statSync(`${__dirname}/../../../bin/text-icon.png`);
      const payload = {
        url: response.body.files[0].meta.uploadUrl,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Content-Length': stats.size
        },
        formData: {
          file: fs.createReadStream(`${__dirname}/../../../bin/text-icon.png`)
        }
      };

      req.put(payload, (err, httpResponse) => {
        ctrllr.assert(
          'should have uploaded without errors',
          () => err ? false : true
        );

        if (err) {
          return deferred.reject(err);
        }

        ctrllr.assert(
          'should return a proper status from amazon',
          () => httpResponse.statusCode >= 200 && httpResponse.statusCode < 400,
          200,
          httpResponse.statusCode
        );

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
      'files[0].type',
      'files[0].size',
      'files[0].meta.policy',
      'files[0].meta.uploadUrl'
    ],
    after(ctrllr, response) {
      const deferred = $q.defer();
      const FormData = require('form-data');
      const policy = response.body.files[0].meta.policy || {};
      const form = new FormData();
      const uploadUrl = response.body.files[0].meta.uploadUrl;

      for (var key in policy) {
        form.append(key, policy[key]);
      }

      form.append('file', fs.createReadStream(__dirname + '/../../../bin/text-icon.png'));

      form.submit(uploadUrl, (err, res) => {
        ctrllr.assert('should have uploaded without errors', () => {
          if (err) {
            console.log('error uploading', err);
            return false;
          }

          return true;
        });

        ctrllr.assert(
          'should return a proper status from amazon',
          () =>
            res &&
            res.statusCode &&
            res.statusCode >= 200 &&
            res.statusCode < 400,
          200,
          res.statusCode
        );

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
      type: 'userAvatar'
    },
    expectStatus: 200,
    after(ctrllr, response) {
      const deferred = $q.defer();
      const FormData = require('form-data');
      const policy = response.body.files[0].meta.policy || {};
      const form = new FormData();
      const uploadUrl = response.body.files[0].meta.uploadUrl;

      for (let key in policy) {
        form.append(key, policy[key]);
      }

      form.append(
        'file',
        fs.createReadStream(`${__dirname}/../../../bin/text-icon.png`)
      );

      log.debug('created form', form);

      form.submit(uploadUrl, (err, res) => {
        ctrllr.assert('should have uploaded without errors', () => {
          if (err) {
            console.log('error uploading', err);
            return false;
          }

          return true;
        });

        ctrllr.assert(
          'should return a proper status from amazon',
          () =>
            res &&
            res.statusCode &&
            res.statusCode >= 200 &&
            res.statusCode < 400,
          200,
          res.statusCode
        );

        deferred.resolve(true);
      });

      return deferred.promise;
    }
  }
];
