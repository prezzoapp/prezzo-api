// @flow
import type { $Request, $Response } from 'express';
import { debug, warn } from 'alfred/services/logger';
import { deferReject, extend } from 'alfred/services/util';
import { ServerError, ForbiddenError } from 'alfred/core/errors';
import { createVendor } from '../../models/vendor';
import categories from '../../models/vendor/config/categories';
import Location from '../../models/location';

module.exports = {
  description: 'Creates a vendor.',
  path: '/v1/vendors',
  method: 'POST',
  config: {
    body: {
      name: {
        type: 'string',
        required: true,
        trim: true
      },
      phone: {
        type: 'string',
        trim: true
      },
      website: {
        type: 'string',
        trim: true
      },
      categories: {
        isArray: true,
        required: true,
        enum: categories
      },
      avatarURL: {
        type: 'string',
        trim: true
      },
      hours: {},
      location: {
        required: true,
        validate: Location.validate
      }
    }
  },
  validate(req) {
    if (req.user.vendor) {
      return deferReject(new ForbiddenError('You are already a vendor.'));
    }
  },
  async run(req: $Request, res: $Response) {
    debug('req.body', req.body);

    try {
      const vendor = extend({}, req.body, {
        location: await Location.fromJSON(req.body.location)
      });
      const user = await createVendor(req.user, vendor);
      return res.$end(user.toObject());
    } catch (e) {
      warn('Failed to create vendor.', e);
      return res.$fail(new ServerError(e));
    }
  }
};
