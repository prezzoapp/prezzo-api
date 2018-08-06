import { random } from 'alfred/services/util';

module.exports = [
  {
    description:
      'should return status 404 (resource not found)' +
      'if the email doesnt belong to a user',
    url: '/v1/auth/login',
    method: 'POST',
    $$send: {
      email: `${random(10).toLowerCase()}@gmail.com`,
      password: 'password',
      type: 'ios'
    },
    expectStatus: 404
  },
  {
    description: 'should allow email / password login',
    url: '/v1/auth/login',
    method: 'POST',
    $$send: {
      email: '{{ user-3.email }}',
      password: 'password',
      type: 'ios'
    },
    expectStatus: 200,
    $$expectKeyValue: {
      _id: '{{ user-3._id }}',
      'sessions[0].type': 'ios'
    }
  },
  {
    description: 'should succeed even if the emails letter casing is incorrect',
    url: '/v1/auth/login',
    method: 'POST',
    $$send: {
      email: '<%"{{ user-3.email }}".toUpperCase()%>',
      password: 'password',
      type: 'ios'
    },
    expectStatus: 200,
    $$expectKeyValue: {
      _id: '{{ user-3._id }}',
      'sessions[0].type': 'ios'
    }
  },
  {
    description: 'should allow setting the `pushToken` on login',
    url: '/v1/auth/login',
    method: 'POST',
    $$send: {
      email: '{{ user-3.email }}',
      password: 'password',
      type: 'android',
      pushToken: '123'
    },
    expectStatus: 200,
    $$expectKeyValue: {
      _id: '{{ user-3._id }}',
      'sessions[0].type': 'android',
      'sessions[0].pushToken': '123'
    }
  },
  {
    description: 'should return vendor and menu information on login',
    url: '/v1/auth/login',
    method: 'POST',
    $$send: {
      email: '{{ user-0.email }}',
      password: 'password',
      type: 'android',
      pushToken: '123'
    },
    expectStatus: 200,
    $$expectKeyValue: {
      _id: '{{ user-0._id }}',
      firstName: '{{ user-0.firstName }}',
      lastName: '{{ user-0.lastName }}',

      'sessions[0].type': 'android',
      'sessions[0].pushToken': '123',
      'vendor.name': '{{ vendor-0.name }}',
      'vendor.phone': '{{ vendor-0.phone }}',
      'vendor.website': '{{ vendor-0.website }}',
      'vendor.categories[0]': '{{ vendor-0.categories[0] }}',
      'vendor.avatarURL': '{{ vendor-0.avatarURL }}',
      'vendor.location.name': '{{ vendor-0.location.name }}',
      'vendor.location.address': '{{ vendor-0.location.address }}',
      'vendor.location.city': '{{ vendor-0.location.city }}',
      'vendor.location.region': '{{ vendor-0.location.region }}',
      'vendor.location.regionShort': '{{ vendor-0.location.regionShort }}',
      'vendor.location.country': '{{ vendor-0.location.country }}',
      'vendor.location.countryShort': '{{ vendor-0.location.countryShort }}',
      'vendor.location.postalCode': '{{ vendor-0.location.postalCode }}',
      'vendor.location.coordinates[0]': '{{ vendor-0.location.longitude }}',
      'vendor.location.coordinates[1]': '{{ vendor-0.location.latitude }}',
      'vendor.hours[0].dayOfWeek': '{{ vendor-0.hours[0].dayOfWeek }}',
      'vendor.hours[0].openTimeHour': '{{ vendor-0.hours[0].openTimeHour }}',
      'vendor.hours[0].openTimeMinutes': '{{ vendor-0.hours[0].openTimeMinutes }}',
      'vendor.hours[0].closeTimeHour': '{{ vendor-0.hours[0].closeTimeHour }}',
      'vendor.hours[0].closeTimeMinutes': '{{ vendor-0.hours[0].closeTimeMinutes }}',
      'vendor.hours[1].dayOfWeek': '{{ vendor-0.hours[1].dayOfWeek }}',
      'vendor.hours[1].openTimeHour': '{{ vendor-0.hours[1].openTimeHour }}',
      'vendor.hours[1].openTimeMinutes': '{{ vendor-0.hours[1].openTimeMinutes }}',
      'vendor.hours[1].closeTimeHour': '{{ vendor-0.hours[1].closeTimeHour }}',
      'vendor.hours[1].closeTimeMinutes': '{{ vendor-0.hours[1].closeTimeMinutes }}',

      'vendor.menu.categories[2].items[0]._id': '{{ menu-0.categories[2].items[0]._id }}',
      'vendor.menu.categories[2].items[0].title': '{{ menu-0.categories[2].items[0].title }}',
      'vendor.menu.categories[2].items[0].description': '{{ menu-0.categories[2].items[0].description }}',
      'vendor.menu.categories[2].items[0].price': '{{ menu-0.categories[2].items[0].price }}'

    }
  }
];
