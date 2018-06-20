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
      'should have returned `user-0`': (value, ctrllr) => {
        debug('value', value);
        return (
          value &&
          value._id ===
            ctrllr
              .getStore()
              .get('user-0')
              ._id.toString()
        );
      }
    }
  },
  {
    description: 'should NOT return non-vendors',
    $$url: '/v1/vendors',
    method: 'GET',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    expectArray: true,
    $$expectNone: {
      'should NOT have returned `user-1`': (value, ctrllr) => {
        debug('value', value);
        return (
          value &&
          value._id ===
            ctrllr
              .getStore()
              .get('user-1')
              ._id.toString()
        );
      },
      'should NOT have returned `user-2`': (value, ctrllr) => {
        debug('value', value);
        return (
          value &&
          value._id ===
            ctrllr
              .getStore()
              .get('user-2')
              ._id.toString()
        );
      },
      'should NOT have returned `user-3`': (value, ctrllr) => {
        debug('value', value);
        return (
          value &&
          value._id ===
            ctrllr
              .getStore()
              .get('user-3')
              ._id.toString()
        );
      },
      'should NOT have returned `user-4`': (value, ctrllr) => {
        debug('value', value);
        return (
          value &&
          value._id ===
            ctrllr
              .getStore()
              .get('user-4')
              ._id.toString()
        );
      }
    }
  }
];
