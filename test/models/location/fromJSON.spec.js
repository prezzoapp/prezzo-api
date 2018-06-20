// @flow
import { debug } from 'alfred/services/logger';
import Location from '../../../models/location';

// should delete the `coordinates` property
// should add the `longitude` property
// should add the `latitude` property

module.exports = [
  {
    description: 'should delete the `coordinates` property',
    async run(ctrllr) {
      const json = {
        name: 'Some Place',
        address: '123 Main St',
        city: 'Beverly Hills',
        region: 'California',
        regionShort: 'CA',
        country: 'United States',
        countryShort: 'US',
        postalCode: '90210',
        latitude: 34.088808,
        longitude: -118.40612
      };
      const location = await Location.fromJSON(json);
      const assert = ctrllr.assert.bind(ctrllr);

      debug('location', location, '');

      assert(
        'should have set the `name` property',
        () => location.name === json.name,
        json.name,
        location.name
      );

      assert(
        'should have set the `address` property',
        () => location.address === json.address,
        json.address,
        location.address
      );

      assert(
        'should have set the `city` property',
        () => location.city === json.city,
        json.city,
        location.city
      );

      assert(
        'should have set the `region` property',
        () => location.region === json.region,
        json.region,
        location.region
      );

      assert(
        'should have set the `regionShort` property',
        () => location.regionShort === json.regionShort,
        json.regionShort,
        location.regionShort
      );

      assert(
        'should have set the `country` property',
        () => location.country === json.country,
        json.country,
        location.country
      );

      assert(
        'should have set the `countryShort` property',
        () => location.countryShort === json.countryShort,
        json.countryShort,
        location.countryShort
      );

      assert(
        'should have set the `postalCode` property',
        () => location.postalCode === json.postalCode,
        json.postalCode,
        location.postalCode
      );

      assert(
        'should have set the `longitude` property',
        () => location.coordinates[0] === json.longitude,
        json.longitude,
        location.coordinates[0]
      );

      assert(
        'should have set the `latitude` property',
        () => location.coordinates[1] === json.latitude,
        json.latitude,
        location.coordinates[1]
      );
    }
  }
];
