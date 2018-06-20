// @flow
import $q from 'q';
import geocoder from 'geocoder';
import { BadRequestError } from 'alfred/core/errors';
import { deferReject } from 'alfred/services/util';

/**
 * takes a set of coordinates and returns the google reuslts
 * @param longitude {Number}
 * @param latitude {Number}
 * @return {$q.promise}
 */
function reverseGeocode(longitude, latitude) {
  const { promise, resolve, reject } = $q.defer();

  geocoder.reverseGeocode(latitude, longitude, (err, data) => {
    if (err) {
      return reject(err);
    }

    return resolve(data);
  });

  return promise;
}

/**
 * parses the google reverse geocoding results into a Location object
 * @param results {[Object]}
 * @param longitude {Number}
 * @param latitude {Number}
 * @param Location {Location}
 * @return {$q.promise}
 */
function parseGoogleResults(results, longitude, latitude, Location) {
  if (!results || !results.results || !results.results.length) {
    return deferReject(new BadRequestError('No results for location.'));
  } else if (
    !results.results[0].address_components ||
    !results.results[0].address_components.length
  ) {
    return deferReject(
      new BadRequestError('Unable to reverse geocode address.')
    );
  }

  const { promise, resolve } = $q.defer();
  const [result] = results.results;
  const location = new Location({
    coordinates: [longitude, latitude]
  });
  let streetName;
  let streetNumber;

  for (let i = 0, len = result.address_components.length; i < len; i += 1) {
    if (
      result.address_components[i].long_name &&
      result.address_components[i].short_name &&
      result.address_components[i].types &&
      result.address_components[i].types.indexOf('name') > -1
    ) {
      location.name = result.address_components[i].long_name;
    } else if (
      result.address_components[i].long_name &&
      result.address_components[i].short_name &&
      result.address_components[i].types &&
      result.address_components[i].types.indexOf('street_number') > -1
    ) {
      streetNumber = result.address_components[i].long_name;
    } else if (
      result.address_components[i].long_name &&
      result.address_components[i].short_name &&
      result.address_components[i].types &&
      result.address_components[i].types.indexOf('route') > -1
    ) {
      streetName = result.address_components[i].long_name;
    } else if (
      result.address_components[i].long_name &&
      result.address_components[i].short_name &&
      result.address_components[i].types &&
      result.address_components[i].types.indexOf('postal_code') > -1
    ) {
      location.postalCode = result.address_components[i].long_name;
    } else if (
      result.address_components[i].long_name &&
      result.address_components[i].short_name &&
      result.address_components[i].types &&
      result.address_components[i].types.indexOf('locality') > -1
    ) {
      location.city = result.address_components[i].long_name;
    } else if (
      result.address_components[i].long_name &&
      result.address_components[i].short_name &&
      result.address_components[i].types &&
      result.address_components[i].types.indexOf('sublocality') > -1
    ) {
      location.region = result.address_components[i].long_name;
    }

    if (
      result.address_components[i].long_name &&
      result.address_components[i].types &&
      result.address_components[i].types.indexOf(
        'administrative_area_level_1'
      ) > -1
    ) {
      location.region = result.address_components[i].long_name;
    }

    if (
      result.address_components[i].short_name &&
      result.address_components[i].types &&
      result.address_components[i].types.indexOf(
        'administrative_area_level_1'
      ) > -1
    ) {
      location.regionShort = result.address_components[i].short_name;
    }

    if (
      result.address_components[i].long_name &&
      result.address_components[i].types &&
      result.address_components[i].types.indexOf('country') > -1
    ) {
      location.country = result.address_components[i].long_name;
    }

    if (
      result.address_components[i].short_name &&
      result.address_components[i].types &&
      result.address_components[i].types.indexOf('country') > -1
    ) {
      location.countryShort = result.address_components[i].short_name;
    }
  }

  if (streetNumber || streetName) {
    location.address = `${streetNumber || ''} ${streetName || ''}`.trim();
  }

  resolve(location);
  return promise;
}

/* ==========================================================================
   Exports - function
   ========================================================================== */

module.exports = {
  name: 'reverseGeocode',

  /**
   * takes a set of coordinates and creates a location object
   * @param longitude {Number}
   * @param latitude {Number}
   * @return {$q.promise}
   */
  run(longitude, latitude) {
    if (!longitude || !latitude) {
      return deferReject(new BadRequestError('Invalid coordinates provided.'));
    }

    const alias = this;
    return reverseGeocode(longitude, latitude).then(results =>
      parseGoogleResults(results, longitude, latitude, alias)
    );
  }
};
