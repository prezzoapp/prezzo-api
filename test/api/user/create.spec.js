const util = require('alfred/services/util');

function getPayload() {
  return {
    email: `${util.random(10)}@email.com`,
    password: util.random(10),
    firstName: util.random(10),
    lastName: util.random(10)
  };
}

module.exports = [
  {
    description: 'should NOT require authorization',
    path: '/v1/users',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 200
  },
  {
    description: 'should require the email field',
    path: '/v1/users',
    method: 'POST',
    $$send(ctrllr) {
      const payload = getPayload(ctrllr);
      delete payload.email;
      return payload;
    },
    expectStatus: 400
  },
  {
    description: 'should hash the password & set the `fullName` property',
    path: '/v1/users',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 200,
    $$expectKeyValue: {
      fullName: '<%"{{ payload.firstName }} {{ payload.lastName }}".toLowerCase()%>',
      password: {
        $ne: '{{ payload.password }}'
      }
    }
  }
];
