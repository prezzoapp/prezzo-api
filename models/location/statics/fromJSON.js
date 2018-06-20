// @flow
import $q from 'q';
import cities from 'cities';
import { BadRequestError } from 'alfred/core/errors';
import { deferReject } from 'alfred/services/util';

module.exports = {
  name: 'fromJSON',
  run(json) {
    if (!json) {
      return deferReject(new BadRequestError('Invalid location.'));
    }

    const Alias = this;
    const { promise, resolve } = $q.defer();
    const { latitude, longitude, creator, name, address } = json;
    const data = cities.gps_lookup(latitude, longitude);
    const city = json.city || data.city;
    const region = json.region || data.state || data.state_abbr;
    const regionShort = json.regionShort || data.state_abbr || null;
    const country = json.country || 'United States';
    const countryShort = json.countryShort || 'US';
    const postalCode = json.postalCode || data.zipcode || null;
    const validatedJSON = {
      coordinates: [longitude, latitude],
      address,
      city,
      region,
      country,
      countryShort
    };

    if (creator) {
      validatedJSON.creator = creator;
    }

    if (name) {
      validatedJSON.name = name;
    }

    if (regionShort) {
      validatedJSON.regionShort = regionShort;
    }

    if (postalCode) {
      validatedJSON.postalCode = postalCode;
    }

    delete validatedJSON.longitude;
    delete validatedJSON.latitude;

    resolve(new Alias(validatedJSON));
    return promise;
  }
};
