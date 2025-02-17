// @flow

// should require authorization
// should return status 404 (resource not found) if the user doesn't exist
// should return the user's orders
// should NOT return other users' orders
// should only return orders of type `table` when specifying `type=table`
// should only return orders of type `delivery` when specifying `type=delivery`

module.exports = [
  {
    description: 'should require authorization',
    $$url: '/v1/users/{{ user-0._id }}/orders',
    method: 'GET',
    expectStatus: 401
  },
  {
    description:
      "should return status 404 (resource not found) if the user doesn't exist",
    $$url: '/v1/users/{{ randomObjectId }}/orders',
    method: 'GET',
    $$basicAuth: 'user-0',
    expectStatus: 404
  },
  {
    description: "should return the user's orders",
    $$url: '/v1/users/{{ user-0._id }}/orders',
    method: 'GET',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    expectArray: true,
    $$expectInArray: {
      'should have returned `order-0`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-0')
            ._id.toString(),
      'should have returned `order-1`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-1')
            ._id.toString()
    },
    $$expectNone: {
      'should NOT have returned `order-2`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-2')
            ._id.toString(),
      'should NOT have returned `order-3`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-3')
            ._id.toString()
    }
  },
  {
    description:
      'should only return orders of type `table` when specifying `type=table`',
    $$url: '/v1/users/{{ user-0._id }}/orders?type=table',
    method: 'GET',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    expectArray: true,
    $$expectInArray: {
      'should have returned `order-0`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-0')
            ._id.toString()
    },
    $$expectNone: {
      'should NOT have returned `order-1`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-1')
            ._id.toString(),
      'should NOT have returned `order-2`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-2')
            ._id.toString(),
      'should NOT have returned `order-3`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-3')
            ._id.toString()
    }
  },
  {
    description:
      'should only return orders of type `delivery` when specifying `type=delivery`',
    $$url: '/v1/users/{{ user-0._id }}/orders?type=delivery',
    method: 'GET',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    expectArray: true,
    $$expectInArray: {
      'should have returned `order-1`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-1')
            ._id.toString()
    },
    $$expectNone: {
      'should NOT have returned `order-0`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-0')
            ._id.toString(),
      'should NOT have returned `order-2`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-2')
            ._id.toString(),
      'should NOT have returned `order-3`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-3')
            ._id.toString()
    }
  }
];
