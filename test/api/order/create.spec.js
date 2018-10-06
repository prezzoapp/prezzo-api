// @flow
import { random, getNumberInRange } from 'alfred/services/util';

const getPayload = ctrllr => ({
  type: 'delivery',
  paymentType: 'cash',
  vendor: ctrllr.getStore().get('vendor-0')._id,
  items: [
    {
      title: random(10),
      description: random(50),
      price: parseFloat(
        `${getNumberInRange(0, 99)}.${getNumberInRange(11, 99)}`
      ),
      notes: random(50)
    },
    {
      title: random(10),
      description: random(50),
      price: parseFloat(
        `${getNumberInRange(0, 99)}.${getNumberInRange(11, 99)}`
      ),
      notes: random(50)
    },
    {
      title: random(10),
      description: random(50),
      price: parseFloat(
        `${getNumberInRange(0, 99)}.${getNumberInRange(11, 99)}`
      ),
      notes: random(50)
    }
  ]
});

// should require authorization
// should return status 400 (bad request) if `type` isn't set to `delivery` or `table`
// should return status 400 (bad request) if `vendor` is empty
// should return status 404 (resource not found) if `vendor` isn't a valid vendor
// should return status 400 (bad request) if `items` is missing
// should return status 400 (bad request) if `items` isn't an array
// should return status 400 (bad request) if an item in `items` doesn't have a price
// should create the order on success
// should set custom notes on the `items` if provided

// future specs
  // should return status 400 (bad request) if `paymentType` isn't set to `cash`
  // should return status 400 (bad request) if `paymentMethod` is an invalid payment method
  // should return status 404 (resource not found) if `paymentMethod` doesn't exist
  // should return status 403 (forbidden) if `paymentMethod` doesn't belong to the user

module.exports = [
  {
    description: 'should require authorization',
    url: '/v1/orders',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 401
  },
  {
    description:
      "should return status 400 (bad request) if `type` isn't set to `delivery` or `table`",
    url: '/v1/orders',
    method: 'POST',
    $$basicAuth: 'user-1',
    $$send: ctrllr => {
      const payload = getPayload(ctrllr);
      payload.type = 'asdf';
      return payload;
    },
    expectStatus: 400
  },
  {
    description: 'should return status 400 (bad request) if `vendor` is empty',
    url: '/v1/orders',
    method: 'POST',
    $$basicAuth: 'user-1',
    $$send: ctrllr => {
      const payload = getPayload(ctrllr);
      delete payload.vendor;
      return payload;
    },
    expectStatus: 400
  },
  {
    description:
      "should return status 404 (resource not found) if `vendor` isn't a valid vendor",
    url: '/v1/orders',
    method: 'POST',
    $$basicAuth: 'user-1',
    $$send: ctrllr => {
      const payload = getPayload(ctrllr);
      payload.vendor = '123';
      return payload;
    },
    expectStatus: 400
  },
  {
    description: 'should return status 400 (bad request) if `items` is missing',
    url: '/v1/orders',
    method: 'POST',
    $$basicAuth: 'user-1',
    $$send: ctrllr => {
      const payload = getPayload(ctrllr);
      delete payload.items;
      return payload;
    },
    expectStatus: 400
  },
  {
    description:
      "should return status 400 (bad request) if `items` isn't an array",
    url: '/v1/orders',
    method: 'POST',
    $$basicAuth: 'user-1',
    $$send: ctrllr => {
      const payload = getPayload(ctrllr);
      [payload.items] = payload.items;
      return payload;
    },
    expectStatus: 400
  },
  {
    description:
      "should return status 400 (bad request) if an item in `items` doesn't have a price",
    url: '/v1/orders',
    method: 'POST',
    $$basicAuth: 'user-1',
    $$send: ctrllr => {
      const payload = getPayload(ctrllr);
      delete payload.items[1].price;
      return payload;
    },
    expectStatus: 400
  },
  {
    description: 'should create the order on success',
    url: '/v1/orders',
    method: 'POST',
    $$basicAuth: 'user-1',
    $$send: getPayload,
    expectStatus: 200,
    $$expectKeyValue: {
      type: '{{ payload.type }}',
      paymentType: '{{ payload.paymentType }}',
      vendor: '{{ payload.vendor }}',

      'items[0].title': '{{ payload.items[0].title }}',
      'items[0].price': '{{ payload.items[0].price }}',
      'items[0].description': '{{ payload.items[0].description }}',
      'items[0].notes': '{{ payload.items[0].notes }}',

      'items[1].title': '{{ payload.items[1].title }}',
      'items[1].price': '{{ payload.items[1].price }}',
      'items[1].description': '{{ payload.items[1].description }}',
      'items[1].notes': '{{ payload.items[1].notes }}',

      'items[2].title': '{{ payload.items[2].title }}',
      'items[2].price': '{{ payload.items[2].price }}',
      'items[2].description': '{{ payload.items[2].description }}',
      'items[2].notes': '{{ payload.items[2].notes }}'
    }
  }
];
