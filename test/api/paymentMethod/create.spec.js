const getPayload = () => ({
  nonce: 'fake-valid-visa-nonce'
});

// should require authorization
// should return status 400 (bad request) if the nonce isn't sent
// should succeed if the user doesn't have a braintree customer id
// should set a braintree customer id on the user if they don't have one
// should NOT update the user's braintree customer id if they have one
// should make the payment method the user's default payment method

module.exports = [
  {
    description: 'should require authorization',
    url: '/v1/payment-methods',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 401
  },
  {
    description:
      "should return status 400 (bad request) if the nonce isn't sent",
    url: '/v1/payment-methods',
    $$basicAuth: 'user-2',
    method: 'POST',
    $$send: {},
    expectStatus: 400
  },
  {
    description:
      "should set a braintree customer id on the user if they don't have one",
    url: '/v1/payment-methods',
    $$basicAuth: 'user-2',
    method: 'POST',
    $$send: getPayload,
    $$reloadStore: true,
    expectStatus: 200,
    expectKeys: [
      '_id',
      'createdDate',
      'creator',
      'isDefault',
      'readableIdentifier',
      'type',
      'token'
    ],
    $$expectKeyValue: {
      creator: '{{ user-2._id }}',
      isDefault: true,
      type: /braintree-[a-z]+/,
      readableIdentifier: value => value && value.length === 4
    },
    $$assertModel: {
      $model: 'user',
      $_id: '{{ user-2._id }}',
      $values: {
        braintreeCustomerId: value => value && value.length
      }
    }
  },
  {
    description:
      "should NOT update the user's braintree customer id if they have one",
    url: '/v1/payment-methods',
    $$basicAuth: 'user-0',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 200,
    expectKeys: [
      '_id',
      'createdDate',
      'creator',
      'isDefault',
      'readableIdentifier',
      'type',
      'token'
    ],
    $$expectKeyValue: {
      creator: '{{ user-0._id }}',
      isDefault: true,
      type: /braintree-[a-z]+/,
      readableIdentifier: value => value && value.length === 4
    },
    $$reloadStore: true,
    $$assertModel: {
      $model: 'user',
      $_id: '{{ user-0._id }}',
      $values: {
        braintreeCustomerId: '{{ user-0.braintreeCustomerId }}'
      }
    }
  },
  {
    description:
      "should make the payment method the user's default payment method",
    url: '/v1/payment-methods',
    $$basicAuth: 'user-0',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 200,
    expectKeys: [
      '_id',
      'createdDate',
      'creator',
      'isDefault',
      'readableIdentifier',
      'type',
      'token'
    ],
    $$expectKeyValue: {
      creator: '{{ user-0._id }}',
      isDefault: true,
      type: /braintree-[a-z]+/,
      readableIdentifier: value => value && value.length === 4
    },
    $$reloadStore: true,
    $$assertModel: [
      {
        $model: 'paymentMethod',
        $_id: '{{ __RESPONSE__.body._id }}',
        $values: {
          isDefault: true
        }
      },
      {
        $model: 'paymentMethod',
        $_id: '{{ paymentMethod-0 }}',
        $values: {
          isDefault: false
        }
      },
      {
        $model: 'paymentMethod',
        $_id: '{{ paymentMethod-1 }}',
        $values: {
          isDefault: false
        }
      }
    ]
  }
];
