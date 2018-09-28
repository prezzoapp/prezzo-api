import { debug } from 'alfred/services/logger';

// should require authorization
// should return a user's payment methods
// should NOT return other users' payment methods

module.exports = [
  {
    description: 'should require authorization',
    url: '/v1/payment-methods',
    method: 'GET',
    expectStatus: 401,
    after: (ctrllr, response) => {
      debug('response.status', response.status);
      debug('response.body', response.body);
    }
  },
  {
    description: "should return a user's payment methods",
    url: '/v1/payment-methods',
    method: 'GET',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    expectArray: true,
    after: (ctrllr, response) => {
      debug('response.status', response.status);
      debug('response.body', response.body);
    },
    $$expectInArray: {
      'should return `paymentMethod-0`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('paymentMethod-0')
            ._id.toString(),
      'should return `paymentMethod-1`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('paymentMethod-1')
            ._id.toString()
    }
  },
  {
    description: "should NOT return other users' payment methods",
    url: '/v1/payment-methods',
    method: 'GET',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    expectArray: true,
    after: (ctrllr, response) => {
      debug('response.status', response.status);
      debug('response.body', response.body);
    },
    $$expectNone: {
      'should NOT return `paymentMethod-2`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('paymentMethod-2')
            ._id.toString(),
      'should NOT return `paymentMethod-3`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('paymentMethod-3')
            ._id.toString()
    }
  }
];
