module.exports = [{
  description: 'should require authorization',
  path: '/v1/self/verify',
  method: 'POST',
  expectStatus: 401,
}, {
  description: 'should require the `code` field',
  path: '/v1/self/verify',
  method: 'POST',
  $$basicAuth: 'user-0',
  expectStatus: 400,
}, {
  description: 'should verify the user\'s account',
  path: '/v1/self/verify',
  method: 'POST',
  $$basicAuth: 'user-0',
  $$modifyModel: {
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $update: {
      verificationCode: '1234',
    },
  },
  send: {
    code: '1234',
  },
  expectStatus: 200,
  $$assertModel: {
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $values: {
      badges: function(value) {
        return value.indexOf('verified') > -1;
      },
    },
  },
}];