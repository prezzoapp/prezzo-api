// @flow
import { extend } from 'alfred/services/util';

const getModifyModelQuery = () => ({
  $model: 'order',
  $_id: '{{ order-2._id }}',
  $update: {
    type: 'delivery',
    status: 'preparing'
  }
});

// should require authorization
// should return status 404 (resource not found) if the vendor doesn't exist
// should return the vendor's orders
// should NOT return other vendor' orders
// should only return orders of type `table` when specifying `type=table`
// should only return orders of type `delivery` when specifying `type=delivery`
// should only return orders of status `preparing` when specifying `status=preparing`
// should only return orders of status `active` when specifying `status=active`

module.exports = [
  {
    description: 'should require authorization',
    $$url: '/v1/vendors/{{ vendor-1._id }}/orders',
    method: 'GET',
    $$modifyModel: getModifyModelQuery(),
    expectStatus: 401
  },
  {
    description:
      "should return status 404 (resource not found) if the vendor doesn't exist",
    $$url: '/v1/vendors/{{ randomObjectId }}/orders',
    method: 'GET',
    $$basicAuth: 'user-0',
    $$modifyModel: getModifyModelQuery(),
    expectStatus: 404
  },
  {
    description: "should return the vendor's orders",
    $$url: '/v1/vendors/{{ vendor-1._id }}/orders',
    method: 'GET',
    $$basicAuth: 'user-0',
    $$modifyModel: getModifyModelQuery(),
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
      'should have returned `order-2`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-2')
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
    $$url: '/v1/vendors/{{ vendor-1._id }}/orders?type=table',
    method: 'GET',
    $$basicAuth: 'user-0',
    $$modifyModel: getModifyModelQuery(),
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
    $$url: '/v1/vendors/{{ vendor-1._id }}/orders?type=delivery',
    method: 'GET',
    $$basicAuth: 'user-0',
    $$modifyModel: getModifyModelQuery(),
    expectStatus: 200,
    expectArray: true,
    $$expectInArray: {
      'should have returned `order-2`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-2')
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
      'should NOT have returned `order-1`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-1')
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
      'should only return orders of status `preparing` when specifying `status=preparing`',
    $$url: '/v1/vendors/{{ vendor-1._id }}/orders?status=preparing',
    method: 'GET',
    $$basicAuth: 'user-0',
    $$modifyModel: getModifyModelQuery(),
    expectStatus: 200,
    expectArray: true,
    $$expectInArray: {
      'should have returned `order-2`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-2')
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
      'should NOT have returned `order-1`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-1')
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
      'should only return orders of status `active` when specifying `status=active`',
    $$url: '/v1/vendors/{{ vendor-1._id }}/orders?status=active',
    method: 'GET',
    $$basicAuth: 'user-0',
    $$modifyModel: extend(getModifyModelQuery(), {
      $update: {
        status: 'active'
      }
    }),
    expectStatus: 200,
    expectArray: true,
    $$expectAll: {
      'should have `status` set to `active`': value => value.status === 'active'
    },
    $$expectInArray: {
      'should have returned `order-2`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-2')
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
      'should NOT have returned `order-1`': (value, ctrllr) =>
        value &&
        value._id ===
          ctrllr
            .getStore()
            .get('order-1')
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
