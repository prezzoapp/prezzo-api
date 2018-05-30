module.exports = [{
  description: 'should require authorization',
  $$url: '/v1/self/sessions/{{ randomObjectId }}',
  method: 'PUT',
  send: { pushToken: '12345' },
  expectStatus: 401
}, {
  description: 'should return status 404 (resource not found) if the session id doesn\'t exist',
  $$url: '/v1/self/sessions/{{ randomObjectId }}',
  method: 'PUT',
  $$basicAuth: 'user-0',
  send: { pushToken: '12345' },
  expectStatus: 404,
  after: function(ctrllr, response) {
    console.log('response.status', response.status);
  },
}, {
  description: 'should return status 404 (resource not found) if the session id doesn\'t belong to the user',
  $$url: '/v1/self/sessions/{{ user-1.sessions[0]._id }}',
  method: 'PUT',
  $$basicAuth: 'user-0',
  send: { pushToken: '12345' },
  expectStatus: 404
}, {
  description: 'should update the session\'s push token on success',
  $$url: '/v1/self/sessions/{{ user-0.sessions[0]._id }}',
  method: 'PUT',
  $$basicAuth: 'user-0',
  send: { pushToken: '12345' },
  expectStatus: 204,
  $$assertModel: {
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $values: {
      'sessions[0].pushToken': '12345'
    }
  }
}, {
  description: 'should NOT update any other session push tokens on the user',
  $$url: '/v1/self/sessions/{{ user-0.sessions[0]._id }}',
  method: 'PUT',
  $$basicAuth: 'user-0',
  send: { pushToken: '12345' },
  expectStatus: 204,
  $$assertModel: {
    $model: 'user',
    $_id: '{{ user-0._id }}',
    $values: {
      'sessions[1].pushToken': function(value) {
        return value !== '12345';
      }
    }
  }
}];