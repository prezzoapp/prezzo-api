module.exports = [{
  description: 'should require authorization',
  path: '/v1/self',
  expectStatus: 401,
}, {
  description: 'should return the authenticated user\'s account',
  path: '/v1/self',
  $$basicAuth: 'user-0',
  expectStatus: 200,
  expectKeys: [
    'password',
  ],
  $$expectKeyValue: {
    _id: '{{ user-0._id }}',
    email: '{{ user-0._email }}',
  },
}];