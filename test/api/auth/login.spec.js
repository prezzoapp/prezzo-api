module.exports = [{
  description: 'should NOT require authorization',
  url: '/v1/auth/login',
  method: 'POST',
  expectStatus: 400,
}, {
  description: 'should allow email / password login',
  url: '/v1/auth/login',
  method: 'POST',
  $$send: {
    email: '{{ user-0.email }}',
    password: 'password',
    type: 'ios'
  },
  expectStatus: 200,
  $$expectKeyValue: {
    _id: '{{ user-0._id }}',
    'sessions[0].type': 'ios',
  },
}, {
  description: 'should allow setting the `pushToken` on login',
  url: '/v1/auth/login',
  method: 'POST',
  $$send: {
    email: '{{ user-0.email }}',
    password: 'password',
    type: 'android',
    pushToken: '123'
  },
  expectStatus: 200,
  $$expectKeyValue: {
    _id: '{{ user-0._id }}',
    'sessions[0].type': 'android',
    'sessions[0].pushToken': '123'
  },
  /*
  after: function(ctrllr, response) {
    console.log('response.status', response.status);
    console.log('response.body', response.body);
  },
  */
}];