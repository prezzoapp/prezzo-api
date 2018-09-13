// @flow
module.exports = [
  {
    description: 'should NOT require authorization',
    $$url: '/v1/users/{{ user-0._id }}',
    method: 'GET',
    expectStatus: 200
  },
  {
    description: 'should return back the specified user',
    $$url: '/v1/users/{{ user-0._id }}',
    method: 'GET',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    $$expectKeyValue: {
      _id: '{{ user-0._id }}',
      email: '{{ user-0.email }}',
      firstName: '{{ user-0.firstName }}',
      lastName: '{{ user-0.lastName }}'
    }
  },
  {
    description: 'should be able to find a user by facebook id',
    $$url: '/v1/users/4',
    method: 'GET',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    $$expectKeyValue: {
      _id: '{{ user-1._id }}',
      email: '{{ user-1.email }}',
      firstName: '{{ user-1.firstName }}',
      lastName: '{{ user-1.lastName }}'
    }
  },
  {
    description: 'should be able to search by email',
    $$url: '/v1/users/{{ user-0.email }}',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    $$expectKeyValue: {
      _id: '{{ user-0._id }}',
      username: '{{ user-0.username }}',
      email: '{{ user-0.email }}',
      firstName: '{{ user-0.firstName }}',
      lastName: '{{ user-0.lastName }}',
      fullName: '{{ user-0.fullName }}'
    }
  },
  {
    description:
      'should be able to get the user by email even if the casing is off',
    $$url: '<% "/v1/users/{{ user-0.email }}".toUpperCase() %>',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    $$expectKeyValue: {
      _id: '{{ user-0._id }}',
      username: '{{ user-0.username }}',
      email: '{{ user-0.email }}',
      firstName: '{{ user-0.firstName }}',
      lastName: '{{ user-0.lastName }}',
      fullName: '{{ user-0.fullName }}'
    }
  }
];
