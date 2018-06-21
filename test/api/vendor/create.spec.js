// @flow
import { random } from 'alfred/services/util';
import categories from '../../../models/vendor/config/categories';

function getLocation() {
  return {
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
}

function getPayload() {
  return {
    name: random(10),
    phone: random(10, false, true),
    website: `https://${random(10)}.com/`,
    categories,
    avatarURL: `https://${random(10)}.com/${random(10)}.jpg`,
    hours: [
      {
        dayOfWeek: 1,
        openTimeHour: 8,
        openTimeMinutes: 0,
        closeTimeHour: 18,
        closeTimeMinutes: 0
      },
      {
        dayOfWeek: 2,
        openTimeHour: 10,
        openTimeMinutes: 30,
        closeTimeHour: 20,
        closeTimeMinutes: 45
      }
    ],
    location: getLocation()
  };
}

// should require authorization
// should return status 400 (bad request) if missing name
// should return status 400 (bad request) if missing location
// should return status 400 (bad request) if location badly formatted
// should return status 403 (forbidden) if the user is already a vendor
// should create vendor on success

module.exports = [
  {
    description: 'should require authorization',
    path: '/v1/vendors',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 401
  },
  {
    description: 'should return status 400 (bad request) if missing name',
    path: '/v1/vendors',
    method: 'POST',
    $$basicAuth: 'user-1',
    $$send: () => {
      const payload = getPayload();
      delete payload.name;
      return payload;
    },
    expectStatus: 400
  },
  {
    description: 'should return status 400 (bad request) if missing location',
    path: '/v1/vendors',
    method: 'POST',
    $$basicAuth: 'user-1',
    $$send: () => {
      const payload = getPayload();
      delete payload.location;
      return payload;
    },
    expectStatus: 400
  },
  {
    description:
      'should return status 400 (bad request) if location badly formatted',
    path: '/v1/vendors',
    method: 'POST',
    $$basicAuth: 'user-1',
    $$send: () => {
      const payload = getPayload();
      delete payload.location.longitude;
      return payload;
    },
    expectStatus: 400
  },
  {
    description:
      'should return status 403 (forbidden) if the user is already a vendor',
    path: '/v1/vendors',
    method: 'POST',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 403
  },
  {
    description: 'should create vendor on success',
    path: '/v1/vendors',
    method: 'POST',
    $$basicAuth: 'user-1',
    $$send: getPayload,
    expectStatus: 200,
    $$expectKeyValue: {
      'vendor.name': '{{ payload.name }}',
      'vendor.phone': '{{ payload.phone }}',
      'vendor.website': '{{ payload.website }}',
      'vendor.categories[0]': '{{ payload.categories[0] }}',
      'vendor.categories[2]': '{{ payload.categories[2] }}',
      'vendor.avatarURL': '{{ payload.avatarURL }}',
      'vendor.location.name': '{{ payload.location.name }}',
      'vendor.location.address': '{{ payload.location.address }}',
      'vendor.location.city': '{{ payload.location.city }}',
      'vendor.location.region': '{{ payload.location.region }}',
      'vendor.location.regionShort': '{{ payload.location.regionShort }}',
      'vendor.location.country': '{{ payload.location.country }}',
      'vendor.location.countryShort': '{{ payload.location.countryShort }}',
      'vendor.location.postalCode': '{{ payload.location.postalCode }}',
      'vendor.location.coordinates[0]': '{{ payload.location.longitude }}',
      'vendor.location.coordinates[1]': '{{ payload.location.latitude }}',
      'vendor.hours[0].dayOfWeek': '{{ payload.hours[0].dayOfWeek }}',
      'vendor.hours[0].openTimeHour': '{{ payload.hours[0].openTimeHour }}',
      'vendor.hours[0].openTimeMinutes': '{{ payload.hours[0].openTimeMinutes }}',
      'vendor.hours[0].closeTimeHour': '{{ payload.hours[0].closeTimeHour }}',
      'vendor.hours[0].closeTimeMinutes': '{{ payload.hours[0].closeTimeMinutes }}',
      'vendor.hours[1].dayOfWeek': '{{ payload.hours[1].dayOfWeek }}',
      'vendor.hours[1].openTimeHour': '{{ payload.hours[1].openTimeHour }}',
      'vendor.hours[1].openTimeMinutes': '{{ payload.hours[1].openTimeMinutes }}',
      'vendor.hours[1].closeTimeHour': '{{ payload.hours[1].closeTimeHour }}',
      'vendor.hours[1].closeTimeMinutes': '{{ payload.hours[1].closeTimeMinutes }}'
    }
  }
];
