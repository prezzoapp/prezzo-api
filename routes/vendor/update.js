// @flow
import type { $Request, $Response } from 'express';
import { debug, warn } from 'alfred/services/logger';
import { deferReject, getValueForURLParam, extend } from 'alfred/services/util';
import { ServerError, ForbiddenError } from 'alfred/core/errors';
import { updateVendor } from '../../models/vendor';
import categories from '../../models/vendor/config/categories';
import Location from '../../models/location';

module.exports = {
  description: 'Updates a vendor.',
  path: '/v1/vendors/:id',
  method: 'PUT',
  config: {
    body: {
      name: {
        type: 'string',
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
    const path = '/v1/vendors/:id';
    const vendorId = getValueForURLParam(path, req.path, ':id');

    if (!req.user.vendor) {
      return deferReject(new ForbiddenError('You are not a vendor.'));
    } else if (
      (req.user.vendor._id || req.user.vendor).toString() !== vendorId
    ) {
      return deferReject(
        new ForbiddenError('You can only update your own vendor account.')
      );
    }
  },
  async run(req: $Request, res: $Response) {
    debug('req.body', req.body);

    try {
      const params = extend({}, req.body, {
        location: await Location.fromJSON(req.body.location)
      });
      const vendor = await updateVendor(req.params.id, params);
      return res.$end(vendor);
    } catch (e) {
      warn('Failed to update vendor.', e);
      return res.$fail(new ServerError(e));
    }
  }
};
