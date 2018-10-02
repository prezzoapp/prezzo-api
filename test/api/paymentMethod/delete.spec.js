// should require authorization
// should return status 404 (resource not found) if the payment method doesn't exist
// should return status 403 (forbidden) if user doesn't own the payment method
// should delete the payment method on success
// should NOT delete other payment methods belonging to the user
// should NOT delete other payment methods NOT belonging to the user

module.exports = [
  {
    description: 'should require authorization',
    $$url: '/v1/payment-methods/{{ paymentMethod-0._id }}',
    method: 'DEL',
    expectStatus: 401
  },
  {
    description:
      "should return status 404 (resource not found) if the payment method doesn't exist",
    $$url: '/v1/payment-methods/{{ randomObjectId }}',
    method: 'DEL',
    $$basicAuth: 'user-0',
    expectStatus: 404
  },
  {
    description:
      "should return status 403 (forbidden) if user doesn't own the payment method",
    $$url: '/v1/payment-methods/{{ paymentMethod-0._id }}',
    method: 'DEL',
    $$basicAuth: 'user-1',
    expectStatus: 403
  },
  {
    description: 'should delete the payment method on success',
    $$url: '/v1/payment-methods/{{ paymentMethod-0._id }}',
    method: 'DEL',
    $$basicAuth: 'user-0',
    expectStatus: 204,
    $$assertModel: [
      {
        $model: 'paymentMethod',
        $_id: '{{ paymentMethod-0._id }}',
        $then: (value, ctrllr) =>
          ctrllr.assert('should return no objects', () => !(value && value))
      }
    ]
  },
  {
    description:
      'should NOT delete other payment methods belonging to the user',
    $$url: '/v1/payment-methods/{{ paymentMethod-0._id }}',
    method: 'DEL',
    $$basicAuth: 'user-0',
    expectStatus: 204,
    $$assertModel: [
      {
        $model: 'paymentMethod',
        $query: { _id: '{{ paymentMethod-1._id }}' },
        $then: (value, ctrllr) =>
          ctrllr.assert(
            'should return 1 object',
            () => value && value.length === 1
          )
      }
    ]
  },
  {
    description:
      'should NOT delete other payment methods NOT belonging to the user',
    $$url: '/v1/payment-methods/{{ paymentMethod-0._id }}',
    method: 'DEL',
    $$basicAuth: 'user-0',
    expectStatus: 204,
    $$assertModel: [
      {
        $model: 'paymentMethod',
        $query: { _id: '{{ paymentMethod-2._id }}' },
        $then: (value, ctrllr) =>
          ctrllr.assert(
            'should return 1 object',
            () => value && value.length === 1
          )
      },
      {
        $model: 'paymentMethod',
        $query: { _id: '{{ paymentMethod-3._id }}' },
        $then: (value, ctrllr) =>
          ctrllr.assert(
            'should return 1 object',
            () => value && value.length === 1
          )
      }
    ]
  }
];
