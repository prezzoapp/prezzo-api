// @flow
import type { $Request, $Response } from 'express';
import { debug } from 'alfred/services/logger';
import { listVendors } from '../../models/vendor';

module.exports = {
  description: 'List all vendors.',
  path: '/v1/vendors',
  method: 'GET',
  config: {
    query: {
      name: {
        type: 'string'
      },
      distance: {
        type: 'string'
      },
      longitude: {
        type: 'string'
      },
      latitude: {
        type: 'string'
      }
    }
  },
  async run(req: $Request, res: $Response) {
    try {
      const params = {};
      const { name, distance, longitude, latitude } = req.query;

      if (name) {
        params.name = {
          $regex: new RegExp(name.toLowerCase()),
          $options: 'i'
        };
      }

      if (longitude && latitude) {
        const coordinates = [longitude, latitude];

        // 50 miles = 80.4672 kilometers; * 1000 = 160,934 meters
        const maxDistance = parseInt(distance || (50 * 1.60934 * 1000));

        params['location.coordinates'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates
            },
            $maxDistance: maxDistance
          }
        };
      }

      const vendors = await listVendors(params);
      debug('vendors', vendors);

      res.$end(vendors);
    } catch (e) {
      return res.$fail(e);
    }
  }
};
