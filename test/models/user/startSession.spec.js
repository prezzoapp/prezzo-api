var $q = require('q');

module.exports = [{
  description: 'should add a `session` to a user',
  run: function(ctrllr) {
    return ctrllr.getStore().get('user-0').startSession({
      pushToken: '123',
      type: 'android',
    });
  },
  $$assertModel: {
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $values: {
      sessions: function(value) { return value && value.length === 3; },
      'sessions[0].pushToken': '123',
      'sessions[0].type': 'android',
    },
  },
}, {
  description: 'should remove the oldest sessions',
  $$modifyModel: [{
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $update: {
      $push: {
        sessions: {
          $each: [{
            pushToken: '123',
            type: 'ios',
          }],
        },
      },
    },
  }, {
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $update: {
      $push: {
        sessions: {
          $each: [{
            pushToken: '456',
            type: 'android',
          }],
        },
      },
    },
  }],
  run: function(ctrllr) {
    return ctrllr.getStore().get('user-0').startSession({
      pushToken: '789',
      type: 'web',
    });
  },
  $$assertModel: {
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $values: {
      sessions: function(value) { return value && value.length === 3; },
      'sessions[0].pushToken': '789',
      'sessions[0].type': 'web',
      'sessions[1].pushToken': '456',
      'sessions[1].type': 'android',
      'sessions[2].pushToken': '123',
      'sessions[2].type': 'ios',
    },
  },
}];