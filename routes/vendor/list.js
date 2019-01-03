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
        type: 'string',
        enum: ['1', '2', '3', '4']
      }
    }
  },
  async run(req: $Request, res: $Response) {
    try {
      const params = {};
      const currentDayAndHour = {};
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
          if(array[index] === 'openNow') {
            const date = new Date();
            params['hours'] = {
              $elemMatch: {
                dayOfWeek: date.getDay(),
                openTimeHour: { $lte: date.getHours() },
                closeTimeHour: { $gt: date.getHours() }
              }
            };
            const index = array.indexOf('openNow');
            console.log(index);
            if(index !== -1) {
              array.splice(index, 1);
            }
            console.log(array);
          }
          if(array[index] === 'price' && pricing) {
            params.pricing = parseInt(pricing);
          }
        }
        if(array.length !== 0) {
          params.filters = { $all: array };
        }
      }

      // debug('Params: ', JSON.stringify(params), '');

      const vendors = await listVendors(params, currentDayAndHour);

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
