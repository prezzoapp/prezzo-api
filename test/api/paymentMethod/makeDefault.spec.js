// should require authorization
// should return status 404 (resource not found) if the payment method doesn't exist
// should return status 403 (forbidden) if user doesn't own the payment method
// should make the payment method the default payment method
// should NOT update other payment methods belonging to other users

module.exports = [
  {
    description: 'should require authorization',
    $$url: '/v1/payment-methods/{{ paymentMethod-0._id }}/default',
    method: 'POST',
    expectStatus: 401
  },
  {
    description:
      "should return status 404 (resource not found) if the payment method doesn't exist",
    $$url: '/v1/payment-methods/{{ randomObjectId }}/default',
    method: 'POST',
    $$basicAuth: 'user-0',
    expectStatus: 404
  },
  {
    description:
      "should return status 403 (forbidden) if user doesn't own the payment method",
    $$url: '/v1/payment-methods/{{ paymentMethod-0._id }}/default',
    method: 'POST',
    $$basicAuth: 'user-1',
    expectStatus: 403
  },
  {
    description: 'should make the payment method the default payment method',
    $$url: '/v1/payment-methods/{{ paymentMethod-1._id }}/default',
    method: 'POST',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    $$assertModel: [
      {
        $model: 'paymentMethod',
        $_id: '{{ paymentMethod-0._id }}',
        $values: {
          _id: '{{ paymentMethod-0._id }}',
          isDefault: false
        }
      },
      {
        $model: 'paymentMethod',
        $_id: '{{ paymentMethod-1._id }}',
        $values: {
          _id: '{{ paymentMethod-1._id }}',
          isDefault: true
        }
      }
    ]
  },
  {
    description:
      'should NOT update other payment methods belonging to other users',
    $$url: '/v1/payment-methods/{{ paymentMethod-1._id }}/default',
    method: 'POST',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    $$assertModel: [
      {
        $model: 'paymentMethod',
        $_id: '{{ paymentMethod-2._id }}',
        $values: {
          _id: '{{ paymentMethod-2._id }}',
          isDefault: true
        }
      },
      {
        $model: 'paymentMethod',
        $_id: '{{ paymentMethod-3._id }}',
        $values: {
          _id: '{{ paymentMethod-3._id }}',
          isDefault: false
        }
      }
    ]
  }
];
