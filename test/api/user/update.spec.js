import { random } from 'alfred/services/util';

function getPayload() {
  return {
    firstName: random(10),
    lastName: random(10),
    isSubscribedToPromotions: false,
    avatarURL: `https://${random(10)}.com/${random(10)}`,
    phone: random(10, false, true),
    address: `${random(3)} ${random(5, true, false)}`,
    city: random(10)
  };
}

// should require authorization
// should return status 404 (resource not found) if the user doesn't exist
// should return status 403 (forbidden) if a user tries to update another user's account
// should succeed on a valid request
// should update the user's full name
// should NOT update the user's email if sent

module.exports = [
  {
    description: 'should require authorization',
    $$url: '/v1/users/{{ user-0._id }}',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 401
  },
  {
    description:
      'should return status 404 (resource not found) if the user doesnt exist',
    $$url: '/v1/users/{{ randomObjectId }}',
    method: 'POST',
    $$auth: 'user-0',
    $$send: getPayload,
    expectStatus: 404
  },
  {
    description:
      'should return status 403 (forbidden) if a user tries to update another users account',
    $$url: '/v1/users/{{ user-1._id }}',
    method: 'POST',
    $$auth: 'user-0',
    $$send: getPayload,
    expectStatus: 200
  },
  {
    description: 'should succeed on a valid request',
    $$url: '/v1/users/{{ user-1._id }}',
    method: 'POST',
    $$auth: 'user-0',
    $$send: getPayload,
    expectStatus: 200,
    $$expectKeyValue: {
      firstName: '{{ payload.firstName }}',
      lastName: '{{ payload.lastName }}',
      isSubscribedToPromotions: false,
      avatarURL: '{{ payload.avatarURL }}',
      phone: '{{ payload.phone }}',
      address: '{{ payload.address }}',
      city: '{{ payload.city }}'
    }
  },
  {
    description: 'should update the users full name',
    $$url: '/v1/users/{{ user-1._id }}',
    method: 'POST',
    $$auth: 'user-0',
    $$send: getPayload,
    expectStatus: 200,
    $$expectKeyValue: {
      firstName:
        '<%"{{ payload.firstName }} {{ payload.lastName }}".toLowerCase()%>'
    }
  },
  {
    description: 'should update the users full name',
    $$url: '/v1/users/{{ user-1._id }}',
    method: 'POST',
    $$auth: 'user-0',
    $$send: getPayload,
    expectStatus: 200,
    $$expectKeyValue: {
      firstName:
        '<%"{{ payload.firstName }} {{ payload.lastName }}".toLowerCase()%>'
    }
  },
  {
    description: 'should NOT update the users email',
    $$url: '/v1/users/{{ user-1._id }}',
    method: 'POST',
    $$auth: 'user-0',
    $$send: {
      email: `${random(10)}@gmail.com`
    },
    expectStatus: 200,
    $$expectKeyValue: {
      email: '{{ user-0.email }}'
    }
  }
];
