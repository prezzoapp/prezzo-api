function getPayload() {
  return {
    phone: '8052424858',
  };
}

module.exports = [{
  description: 'should require authorization',
  path: '/v1/self/verify/phone',
  method: 'POST',
  send: getPayload(),
  expectStatus: 401,
}, {
  description: 'should set a verification code and phone on the user',
  path: '/v1/self/verify/phone',
  method: 'POST',
  $$basicAuth: 'user-0',
  send: getPayload(),
  expectStatus: 204,
  $$assertModel: {
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $values: {
      phone: getPayload().phone,
      verificationCode: function(value) {
        return typeof value !== 'undefined';
      },
    },
  },
}];