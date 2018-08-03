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
    categories: [categories[4]],
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
// should return status 403 (forbidden) if the user is not a vendor
// should return status 403 (forbidden) if the user is trying to update another vendor
// should update the vendor on success

module.exports = [
  {
    description: 'should require authorization',
    path: '/v1/vendors',
    method: 'PUT',
    $$send: getPayload,
    expectStatus: 401
  },
  {
    description:
      'should return status 403 (forbidden) if the user is not a vendor',
    $$url: '/v1/vendors/{{ user-0.vendor._id }}',
    method: 'PUT',
    $$basicAuth: 'user-2',
    $$send: getPayload,
    expectStatus: 403
  },
  {
    description:
      'should return status 403 (forbidden) if the user is trying to update another vendor',
    $$url: '/v1/vendors/{{ user-0.vendor._id }}',
    method: 'PUT',
    $$basicAuth: 'user-1',
    $$send: getPayload,
    expectStatus: 403
  },
  {
    description: 'should update the vendor on success',
    $$url: '/v1/vendors/{{ user-0.vendor._id }}',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 200,
    $$expectKeyValue: {
      name: '{{ payload.name }}',
      phone: '{{ payload.phone }}',
      website: '{{ payload.website }}',
      'categories[0]': '{{ payload.categories[0] }}',
      avatarURL: '{{ payload.avatarURL }}',
      'location.name': '{{ payload.location.name }}',
      'location.address': '{{ payload.location.address }}',
      'location.city': '{{ payload.location.city }}',
      'location.region': '{{ payload.location.region }}',
      'location.regionShort': '{{ payload.location.regionShort }}',
      'location.country': '{{ payload.location.country }}',
      'location.countryShort': '{{ payload.location.countryShort }}',
      'location.postalCode': '{{ payload.location.postalCode }}',
      'location.coordinates[0]': '{{ payload.location.longitude }}',
      'location.coordinates[1]': '{{ payload.location.latitude }}',
      'hours[0].dayOfWeek': '{{ payload.hours[0].dayOfWeek }}',
      'hours[0].openTimeHour': '{{ payload.hours[0].openTimeHour }}',
      'hours[0].openTimeMinutes': '{{ payload.hours[0].openTimeMinutes }}',
      'hours[0].closeTimeHour': '{{ payload.hours[0].closeTimeHour }}',
      'hours[0].closeTimeMinutes': '{{ payload.hours[0].closeTimeMinutes }}',
      'hours[1].dayOfWeek': '{{ payload.hours[1].dayOfWeek }}',
      'hours[1].openTimeHour': '{{ payload.hours[1].openTimeHour }}',
      'hours[1].openTimeMinutes': '{{ payload.hours[1].openTimeMinutes }}',
      'hours[1].closeTimeHour': '{{ payload.hours[1].closeTimeHour }}',
      'hours[1].closeTimeMinutes': '{{ payload.hours[1].closeTimeMinutes }}'
    },
    $$assertModel: [
      {
        $model: 'vendor',
        $_id: '{{ vendor-0._id }}',
        $values: {
          name: '{{ payload.name }}',
          phone: '{{ payload.phone }}',
          website: '{{ payload.website }}',
          'categories[0]': '{{ payload.categories[0] }}',
          avatarURL: '{{ payload.avatarURL }}',
          'location.name': '{{ payload.location.name }}',
          'location.address': '{{ payload.location.address }}',
          'location.city': '{{ payload.location.city }}',
          'location.region': '{{ payload.location.region }}',
          'location.regionShort': '{{ payload.location.regionShort }}',
          'location.country': '{{ payload.location.country }}',
          'location.countryShort': '{{ payload.location.countryShort }}',
          'location.postalCode': '{{ payload.location.postalCode }}',
          'location.coordinates[0]': '{{ payload.location.longitude }}',
          'location.coordinates[1]': '{{ payload.location.latitude }}',
          'hours[0].dayOfWeek': '{{ payload.hours[0].dayOfWeek }}',
          'hours[0].openTimeHour': '{{ payload.hours[0].openTimeHour }}',
          'hours[0].openTimeMinutes': '{{ payload.hours[0].openTimeMinutes }}',
          'hours[0].closeTimeHour': '{{ payload.hours[0].closeTimeHour }}',
          'hours[0].closeTimeMinutes': '{{ payload.hours[0].closeTimeMinutes }}',
          'hours[1].dayOfWeek': '{{ payload.hours[1].dayOfWeek }}',
          'hours[1].openTimeHour': '{{ payload.hours[1].openTimeHour }}',
          'hours[1].openTimeMinutes': '{{ payload.hours[1].openTimeMinutes }}',
          'hours[1].closeTimeHour': '{{ payload.hours[1].closeTimeHour }}',
          'hours[1].closeTimeMinutes': '{{ payload.hours[1].closeTimeMinutes }}'
        }
      }
    ]
  },
  {
    description: 'should retain the values of fields that werent sent',
    $$url: '/v1/vendors/{{ user-0.vendor._id }}',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: ctrllr => {
      const payload = getPayload(ctrllr);
      delete payload.name;
      delete payload.phone;
      delete payload.website;
      return payload;
    },
    expectStatus: 200,
    $$expectKeyValue: {
      name: '{{ vendor-0.name }}',
      phone: '{{ vendor-0.phone }}',
      website: '{{ vendor-0.website }}',
      'categories[0]': '{{ payload.categories[0] }}',
      avatarURL: '{{ payload.avatarURL }}',
      'location.name': '{{ payload.location.name }}',
      'location.address': '{{ payload.location.address }}',
      'location.city': '{{ payload.location.city }}',
      'location.region': '{{ payload.location.region }}',
      'location.regionShort': '{{ payload.location.regionShort }}',
      'location.country': '{{ payload.location.country }}',
      'location.countryShort': '{{ payload.location.countryShort }}',
      'location.postalCode': '{{ payload.location.postalCode }}',
      'location.coordinates[0]': '{{ payload.location.longitude }}',
      'location.coordinates[1]': '{{ payload.location.latitude }}',
      'hours[0].dayOfWeek': '{{ payload.hours[0].dayOfWeek }}',
      'hours[0].openTimeHour': '{{ payload.hours[0].openTimeHour }}',
      'hours[0].openTimeMinutes': '{{ payload.hours[0].openTimeMinutes }}',
      'hours[0].closeTimeHour': '{{ payload.hours[0].closeTimeHour }}',
      'hours[0].closeTimeMinutes': '{{ payload.hours[0].closeTimeMinutes }}',
      'hours[1].dayOfWeek': '{{ payload.hours[1].dayOfWeek }}',
      'hours[1].openTimeHour': '{{ payload.hours[1].openTimeHour }}',
      'hours[1].openTimeMinutes': '{{ payload.hours[1].openTimeMinutes }}',
      'hours[1].closeTimeHour': '{{ payload.hours[1].closeTimeHour }}',
      'hours[1].closeTimeMinutes': '{{ payload.hours[1].closeTimeMinutes }}'
    },
    $$assertModel: [
      {
        $model: 'vendor',
        $_id: '{{ vendor-0._id }}',
        $values: {
          name: '{{ vendor-0.name }}',
          phone: '{{ vendor-0.phone }}',
          website: '{{ vendor-0.website }}',
          'categories[0]': '{{ payload.categories[0] }}',
          avatarURL: '{{ payload.avatarURL }}',
          'location.name': '{{ payload.location.name }}',
          'location.address': '{{ payload.location.address }}',
          'location.city': '{{ payload.location.city }}',
          'location.region': '{{ payload.location.region }}',
          'location.regionShort': '{{ payload.location.regionShort }}',
          'location.country': '{{ payload.location.country }}',
          'location.countryShort': '{{ payload.location.countryShort }}',
          'location.postalCode': '{{ payload.location.postalCode }}',
          'location.coordinates[0]': '{{ payload.location.longitude }}',
          'location.coordinates[1]': '{{ payload.location.latitude }}',
          'hours[0].dayOfWeek': '{{ payload.hours[0].dayOfWeek }}',
          'hours[0].openTimeHour': '{{ payload.hours[0].openTimeHour }}',
          'hours[0].openTimeMinutes': '{{ payload.hours[0].openTimeMinutes }}',
          'hours[0].closeTimeHour': '{{ payload.hours[0].closeTimeHour }}',
          'hours[0].closeTimeMinutes': '{{ payload.hours[0].closeTimeMinutes }}',
          'hours[1].dayOfWeek': '{{ payload.hours[1].dayOfWeek }}',
          'hours[1].openTimeHour': '{{ payload.hours[1].openTimeHour }}',
          'hours[1].openTimeMinutes': '{{ payload.hours[1].openTimeMinutes }}',
          'hours[1].closeTimeHour': '{{ payload.hours[1].closeTimeHour }}',
          'hours[1].closeTimeMinutes': '{{ payload.hours[1].closeTimeMinutes }}'
        }
      }
    ]
  },
  {
    description: 'should NOT update other vendors',
    $$url: '/v1/vendors/{{ user-0.vendor._id }}',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    $$assertModel: [
      {
        $model: 'vendor',
        $_id: '{{ vendor-1._id }}',
        $values: {
          name: '{{ vendor-1.name }}',
          phone: '{{ vendor-1.phone }}',
          website: '{{ vendor-1.website }}',
          'categories[0]': '{{ vendor-1.categories[0] }}',
          avatarURL: '{{ vendor-1.avatarURL }}',
          'location.name': '{{ vendor-1.location.name }}',
          'location.address': '{{ vendor-1.location.address }}',
          'location.city': '{{ vendor-1.location.city }}',
          'location.region': '{{ vendor-1.location.region }}',
          'location.regionShort': '{{ vendor-1.location.regionShort }}',
          'location.country': '{{ vendor-1.location.country }}',
          'location.countryShort': '{{ vendor-1.location.countryShort }}',
          'location.postalCode': '{{ vendor-1.location.postalCode }}',
          'location.coordinates[0]': '{{ vendor-1.location.longitude }}',
          'location.coordinates[1]': '{{ vendor-1.location.latitude }}',
          'hours[0].dayOfWeek': '{{ vendor-1.hours[0].dayOfWeek }}',
          'hours[0].openTimeHour': '{{ vendor-1.hours[0].openTimeHour }}',
          'hours[0].openTimeMinutes': '{{ vendor-1.hours[0].openTimeMinutes }}',
          'hours[0].closeTimeHour': '{{ vendor-1.hours[0].closeTimeHour }}',
          'hours[0].closeTimeMinutes': '{{ vendor-1.hours[0].closeTimeMinutes }}',
          'hours[1].dayOfWeek': '{{ vendor-1.hours[1].dayOfWeek }}',
          'hours[1].openTimeHour': '{{ vendor-1.hours[1].openTimeHour }}',
          'hours[1].openTimeMinutes': '{{ vendor-1.hours[1].openTimeMinutes }}',
          'hours[1].closeTimeHour': '{{ vendor-1.hours[1].closeTimeHour }}',
          'hours[1].closeTimeMinutes': '{{ vendor-1.hours[1].closeTimeMinutes }}'
        }
      }
    ]
  }
];
