// @flow
import log from 'alfred/services/logger';
import { extend } from 'alfred/services/util';
import Resource from '../../models/resource';
import mime from '../../models/file/config/mime';

module.exports = {
  description: 'Creates a resource.',
  path: '/v1/resources',
  method: 'POST',
  config: {
    body: {
      name: {
        type: 'string'
      },
      type: {
        type: 'string',
        required: true,
        enum: ['userAvatar']
      },
      mime: {
        type: 'string',
        required: true,
        enum: mime
      },
      size: {
        type: 'number',
        required: true
      }
    },
    query: {
      acl: {
        enum: ['public-read', 'private']
      },
      addPolicy: {
        enum: ['true', 'false']
      }
    }
  },
  run(req, res) {
    log.debug('hit resource::create endpoint', req.body, req.path);

    const fileConfig = extend({}, req.body, {
      creator: req.user
    });

    Resource.create(fileConfig, req.query || {})
      .then(resource => res.$end(resource))
      .fail(err => res.$fail(err));
  }
};
