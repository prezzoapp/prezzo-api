// @flow
import { debug } from 'alfred/services/logger';

// should delete the `coordinates` property
// should add the `longitude` property
// should add the `latitude` property

module.exports = [
  {
    description: 'should delete the `coordinates` property',
    run(ctrllr) {
      const store = ctrllr.getStore();
      const location = store.get('location-0');
      const json = location.toJSON();
      const { coordinates } = json;

      debug('coordinates', coordinates, '');

      ctrllr.assert(
        'should have an empty `coordinates` property',
        () => !coordinates,
        undefined,
        coordinates
      );
    }
  },
  {
    description: 'should add the `longitude` property',
    run(ctrllr) {
      const store = ctrllr.getStore();
      const location = store.get('location-0');
      const json = location.toJSON();
      const { longitude } = json;

      debug('longitude', longitude, '');

      ctrllr.assert(
        'should have the `longitude` property',
        () => longitude === -118.40612,
        -118.40612,
        longitude
      );
    }
  },
  {
    description: 'should add the `latitude` property',
    run(ctrllr) {
      const store = ctrllr.getStore();
      const location = store.get('location-0');
      const json = location.toJSON();
      const { latitude } = json;

      debug('latitude', latitude, '');

      ctrllr.assert(
        'should have the `latitude` property',
        () => latitude === 34.088808,
        34.088808,
        latitude
      );
    }
  }
];
