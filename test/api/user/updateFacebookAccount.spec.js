import { random } from 'alfred/services/util';

function getPayload() {
  return {
    facebookId: random(10),
    facebookToken: random(10)
  };
}

// should require authorization
// should return status 404 (resource not found) if the user doesn't exist
// should return status 403 (forbidden) if a user tries to update another user's account
// should succeed on a valid request

module.exports = [
  {
    description: 'should require authorization',
    $$url: '/v1/users/{{ user-0._id }}/facebook',
    method: 'PUT',
    $$send: getPayload,
    expectStatus: 401
  },
  {
    description:
      'should return status 404 (resource not found) if the user doesnt exist',
    $$url: '/v1/users/{{ randomObjectId }}/facebook',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 404
  },
  {
    description:
      'should return status 403 (forbidden) if a user tries to update another users account',
    $$url: '/v1/users/{{ user-1._id }}/facebook',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 403
  },
  {
    description: 'should succeed on a valid request',
    $$url: '/v1/users/{{ user-0._id }}/facebook',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 200,
    $$expectKeyValue: {
      facebookId: '{{ payload.facebookId }}',
      facebookToken: '{{ payload.facebookToken }}'
    }
  }
];
