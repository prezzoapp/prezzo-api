function getModifyPayload() {
  return {
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $update: {
      phone: '8052424858',
    },
  };
}

module.exports = [{
  description: 'should require authorization',
  path: '/v1/self/resetPassword/phone',
  method: 'POST',
  expectStatus: 401,
}, {
  description: 'should return status 403 (forbidden) if no phone set on user account',
  path: '/v1/self/resetPassword/phone',
  method: 'POST',
  $$basicAuth: 'user-0',
  expectStatus: 403,
}, {
  description: 'should set a verification code on the user',
  path: '/v1/self/resetPassword/phone',
  method: 'POST',
  $$basicAuth: 'user-0',
  $$modifyModel: getModifyPayload(),
  expectStatus: 204,
  $$assertModel: [{
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $values: {
      verificationCode: function(value) {
        return typeof value !== 'undefined';
      },
    },
  }],
}];