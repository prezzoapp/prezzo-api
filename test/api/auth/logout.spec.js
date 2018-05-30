module.exports = [{
  description: 'should require authorization',
  path: '/v1/auth/logout',
  expectStatus: 401,
}, {
  description: 'should remove the session from the user',
  path: '/v1/auth/logout',
  $$basicAuth: 'user-0',
  expectStatus: 204,
  $$assertModel: {
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $then: function(user, ctrllr) {
      var
        expected,
        actual;

      expected = 1;
      actual = user.sessions.length;
      ctrllr.assert('should have 1 session left', function() {
        return expected === actual;
      }, expected, actual);
    },
  },
}, {
  description: 'should remove sessions with the same push token',
  path: '/v1/auth/logout',
  $$basicAuth: 'user-0',
  $$modifyModel: [{
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $update: {
      $set: {
        'sessions.0.pushToken': 'abcd',
      },
    },
  }, {
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $update: {
      $push: {
        sessions: {
          $each: [{
            type: 'android',
            pushToken: 'abcd',
          }],
        },
      },
    },
  }],
  expectStatus: 204,
  $$assertModel: {
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $then: function(user, ctrllr) {
      var
        expected,
        actual;

      expected = 1;
      actual = user.sessions.length;
      ctrllr.assert('should have 1 session left', function() {
        return expected === actual;
      }, expected, actual);
    },
  },
}];