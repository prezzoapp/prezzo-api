import { random } from 'alfred/services/util';

module.exports = [
  {
    description:
      'should return status 404 (resource not found)' +
      'if the email doesnt belong to a user',
    url: '/v1/auth/login',
    method: 'POST',
    $$send: {
      email: `${random(10).toLowerCase()}@gmail.com`,
      password: 'password',
      type: 'ios'
    },
    expectStatus: 404,
    after(ctrllr, response) {
      console.log('response.status', response.status);
      console.log('response.body', response.body);
    }
  },
  {
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
      'sessions[0].type': 'ios'
    },
    after(ctrllr, response) {
      console.log('response.status', response.status);
      console.log('response.body', response.body);
    }
  },
  {
    description: 'should succeed even if the emails letter casing is incorrect',
    url: '/v1/auth/login',
    method: 'POST',
    $$send: {
      email: '<%"{{ user-0.email }}".toUpperCase()%>',
      password: 'password',
      type: 'ios'
    },
    expectStatus: 200,
    $$expectKeyValue: {
      _id: '{{ user-0._id }}',
      'sessions[0].type': 'ios'
    },
    after(ctrllr, response) {
      console.log('response.status', response.status);
      console.log('response.body', response.body);
    }
  },
  {
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
    after(ctrllr, response) {
      console.log('response.status', response.status);
      console.log('response.body', response.body);
    }
  }
];
