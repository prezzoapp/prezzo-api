module.exports = [
  {
    description: 'should require authorization',
    method: 'GET',
    path: '/v1/self/payment-token',
    expectStatus: 401
  },
  {
    description:
      'should return a valid Braintree token that can be used to create a payment method',
    method: 'GET',
    path: '/v1/self/payment-token',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    expectKeys: ['token']
  }
];
