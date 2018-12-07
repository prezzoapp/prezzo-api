// @flow
import type { $Request, $Response } from 'express';
import { debug } from 'alfred/services/logger';
import { ServerError } from 'alfred/core/errors';
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
      },
      activeFilters: {
        type: 'string'
      },
      pricing: {
        type: 'string'
      }
    }
  },
  async run(req: $Request, res: $Response) {
    try {
      const params = {};
      const { name, distance, longitude, latitude, activeFilters, pricing } = req.query;

      if (name) {
        params.name = {
          $regex: new RegExp(name.toLowerCase()),
          $options: 'i'
        };
      }

      if (longitude && latitude) {
        const coordinates = [longitude, latitude];
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

      if(activeFilters && activeFilters !== '') {
        const array = activeFilters.split(',');
        for(let index in array) {
          if(array[index] === 'price' && pricing) {
            params.pricing = parseInt(pricing);
            break;
          }
        }
        params.filters = { $all: array };
      }

      debug('Params: ', params, '');

      const vendors = await listVendors(params);

      res.set({
        res_code: 200,
        res_message: 'List Vendors Success!'
      });
      res.$end(vendors);
    } catch (e) {
      return res.$fail(new ServerError(e));
    }
  }
};
