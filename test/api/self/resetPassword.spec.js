function getPayload() {
  return {
    code: '12345',
    password: 'abcde',
  }
}

module.exports = [{
  description: 'should require authorization',
  path: '/v1/self/resetPassword',
  method: 'POST',
  send: getPayload(),
  expectStatus: 401,
}, {
  description: 'should return status 403 (forbidden) if no verification code set on the user',
  path: '/v1/self/resetPassword',
  method: 'POST',
  $$basicAuth: 'user-0',
  send: getPayload(),
  expectStatus: 403,
}, {
  description: 'should return status 400 (bad request) if verification code doesn\'t match',
  path: '/v1/self/resetPassword',
  method: 'POST',
  $$basicAuth: 'user-0',
  $$modifyModel: {
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $update: {
      verificationCode: '54321',
    },
  },
  send: getPayload(),
  expectStatus: 400,
}, {
  description: 'should update the user\'s password on success',
  path: '/v1/self/resetPassword',
  method: 'POST',
  $$basicAuth: 'user-0',
  $$modifyModel: {
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $update: {
      verificationCode: '12345',
    },
  },
  send: getPayload(),
  expectStatus: 204,
  $$assertModel: {
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $then: function(user, ctrllr) {
      var deferred = require('q').defer();

      user.comparePassword(getPayload().password)
        .then(function(result) {
          console.log('user.password', user.password);
          ctrllr.assert('should have hashed the password', function() {
            return result === true;
          });
        })
        .fail(function(err) {
          ctrllr.assert('should have hashed the password', function() {
            return false; // an error occurred
          });
        })
        .finally(function() {
          return deferred.resolve(true);
        });

      return deferred.promise;
    },
  },
}];