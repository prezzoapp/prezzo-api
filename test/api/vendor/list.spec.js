// @flow
import { debug } from 'alfred/services/logger';

module.exports = [
  {
    description: 'should require authorization',
    $$url: '/v1/vendors',
    method: 'GET',
    expectStatus: 401
  },
  {
    description: 'should return vendors',
    $$url: '/v1/vendors',
    method: 'GET',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    expectArray: true,
    $$expectInArray: {
      'should have returned `vendor-0`': (value, ctrllr) => {
        debug('value', value);
        return (
          value &&
          value._id ===
            ctrllr
              .getStore()
              .get('vendor-0')
              ._id.toString()
        );
      },
      'should have returned `vendor-1`': (value, ctrllr) => {
        debug('value', value);
        return (
          value &&
          value._id ===
            ctrllr
              .getStore()
              .get('vendor-1')
              ._id.toString()
        );
      },
      'should have returned `vendor-2`': (value, ctrllr) => {
        debug('value', value);
        return (
          value &&
          value._id ===
            ctrllr
              .getStore()
              .get('vendor-2')
              ._id.toString()
        );
      }
    }
  },
  {
    description: 'should allow filtering by vendor business name',
    $$url: '/v1/vendors?name={{ vendor-0.name }}',
    method: 'GET',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    expectArray: true,
    $$expectInArray: {
      'should have returned `vendor-0`': (value, ctrllr) => {
        debug('value', value);
        return (
          value &&
          value._id ===
            ctrllr
              .getStore()
              .get('vendor-0')
              ._id.toString()
        );
      }
    },
    $$expectNone: {
      'should NOT have returned `vendor-1`': (value, ctrllr) => {
        debug('value', value);
        return (
          value &&
          value._id ===
            ctrllr
              .getStore()
              .get('vendor-1')
              ._id.toString()
        );
      },
      'should NOT have returned `vendor-2`': (value, ctrllr) => {
        debug('value', value);
        return (
          value &&
          value._id ===
            ctrllr
              .getStore()
              .get('vendor-2')
              ._id.toString()
        );
      }
    }
  },
  {
    description: 'should allow filtering by vendor location',
    $$url:
      '/v1/vendors?' +
      'longitude={{ vendor-2.location.coordinates[0] }}' +
      '&latitude={{ vendor-2.location.coordinates[1] }}',
    method: 'GET',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    expectArray: true,
    $$expectInArray: {
      'should have returned `vendor-2`': (value, ctrllr) => {
        debug('value', value);
        return (
          value &&
          value._id ===
            ctrllr
              .getStore()
              .get('vendor-2')
              ._id.toString()
        );
      }
    },
    $$expectNone: {
      'should NOT have returned `vendor-0`': (value, ctrllr) => {
        debug('value', value);
        return (
          value &&
          value._id ===
            ctrllr
              .getStore()
              .get('vendor-0')
              ._id.toString()
        );
      },
      'should NOT have returned `vendor-1`': (value, ctrllr) => {
        debug('value', value);
        return (
          value &&
          value._id ===
            ctrllr
              .getStore()
              .get('vendor-1')
              ._id.toString()
        );
      }
    }
  },
  {
    description: 'should populate the menu',
    $$url:
      '/v1/vendors?' +
      'longitude={{ vendor-0.location.coordinates[0] }}' +
      '&latitude={{ vendor-0.location.coordinates[1] }}',
    method: 'GET',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    expectArray: true,
    $$expectInArray: {
      'should have returned a populated menu': (value, ctrllr) =>
        value &&
        value.menu &&
        value.menu._id &&
        value.menu._id ===
          ctrllr
            .getStore()
            .get('menu-0')
            ._id.toString()
    }
  }
];
