// @flow
import type, {
  $Request,
  $Response
} from 'express';
import {
  debug
} from 'alfred/services/logger';
import {
  ServerError
} from 'alfred/core/errors';
import {
  listVendors
} from '../../models/vendor';

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
      const {
        name,
        distance,
        longitude,
        latitude,
        activeFilters,
        pricing
      } = req.query;
      const aggQuery = [];

      if (latitude && longitude) {
        const geo = {
          $geoNear: {
            near: {
              type: 'point',
              coordinates: [parseFloat(latitude), parseFloat(longitude)]
            },
            maxDistance: distance || 50 * 1.60934 * 1000,
            spherical: true
          }
        };
        aggQuery.push(geo);
      }

      const lookUp = {
        $lookup: {
          from: 'menus',
          localField: 'menu',
          foreignField: '_id',
          as: 'menu'
        }
      };
      aggQuery.push(lookUp);
     const matchQuery = {
        $match: {}
      };
      if (name) {
        matchQuery.$match.name = {
          $regex: name,
          $options: 'i'
        };
      }
      const activeFiltersArray =
        activeFilters === '' || !activeFilters
          ? false
          : activeFilters.split(',');
      if (activeFiltersArray && activeFiltersArray.indexOf('openNow') !== -1) {
        matchQuery.$match.hours = {
          $elemMatch: {
            dayOfWeek: {
              $eq: new Date().getDay()
            },
            $or: [
              {
                openTimeHour: {
                  $lte: new Date().getHours()
                }
              },
              {
                $and: [
                  {
                    openTimeHour: {
                      $eq: new Date().getHours()
                    }
                  },
                  {
                    openTimeMinutes: {
                      $gt: new Date().getMinutes()
                    }
                  }
                ]
              }
            ],
            $or: [
              {
                closeTimeHour: {
                  $gt: new Date().getHours()
                }
              },
              {
                $and: [
                  {
                    closeTimeHour: {
                      $eq: new Date().getHours()
                    }
                  },
                  {
                    closeTimeMinutes: {
                      $gt: new Date().getMinutes()
                    }
                  }
                ]
              }
            ]
          }
        };
      }

      if (
        activeFiltersArray &&
        activeFiltersArray.indexOf('price') !== -1 &&
        pricing
      ) {
        matchQuery.$match.pricing = parseInt(pricing, 10);
      }
      aggQuery.push(matchQuery);
      aggQuery.push({
        $unwind: '$menu'
      });
      // if (longitude && latitude) {
      //   const coordinates = [longitude, latitude];
      //   const maxDistance = parseInt(distance || (50 * 1.60934 * 1000));

      //   params['location.coordinates'] = {
      //     $near: {
      //       $geometry: {
      //         type: 'Point',
      //         coordinates
      //       },
      //       $maxDistance: maxDistance
      //     }
      //   };
      // }

      // if (activeFilters && activeFilters !== '') {
      //   // need more clarity
      //   // if (array.length !== 0) {
      //   //   params.filters = {
      //   //     $all: array
      //   //   };
      //   // }
      // }
      const vendors = await listVendors(aggQuery);

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
