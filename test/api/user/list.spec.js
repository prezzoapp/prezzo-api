var

  /**
   * app base directory
   * @type {String}
   */
  baseDir = process.cwd();

  /** fields to return */
  // whitelistFields = require(baseDir + '/models/user/config/populate.json');

module.exports = [{
  description: 'should require authorization',
  method: 'GET',
  path: '/v1/users',
  expectStatus: 401,
}, {
  description: 'should return an array of users',
  method: 'GET',
  path: '/v1/users',
  $$basicAuth: 'user-0',
  expectStatus: 200,
  expectArray: true,
}, {
  description: 'shouldn\'t return sensitive data',
  method: 'GET',
  path: '/v1/users',
  $$basicAuth: 'user-0',
  expectStatus: 200,
  $$expectNone: {
    'should not return any sensitive fields': function(user) {
      var
        nonSensitiveFields = Object.keys({}),
        hasSensitiveField = false;

      Object.keys(user).forEach(function(key) {
        if (nonSensitiveFields.indexOf(key) === -1) {
          hasSensitiveField = true;
        }
      });

      return hasSensitiveField;
    },
  },
}, {
  description: 'should allow searching users by the first name',
  method: 'GET',
  $$basicAuth: 'user-0',
  before: function(ctrllr, request) {
    var
      store = ctrllr.getStore(),
      user = store.get('user-0'),
      query = user.firstName.substring(5, 10),
      url = '/v1/users?search=' + query;

    request.setUrl(url);
  },
  expectStatus: 200,
  expectArray: true,
  after: function(ctrllr, response) {
    var
      body = response.body,
      store = ctrllr.getStore(),
      user = store.get('user-0');

    ctrllr.assert('should have returned 1 user', function() {
      return body && body.length === 1;
    });

    ctrllr.assert('the user returned should be `user-0`', function() {
      return body && body[0] && body[0]._id === user._id.toString();
    });
  },
}, {
  description: 'should allow searching users by the last name',
  method: 'GET',
  $$basicAuth: 'user-0',
  before: function(ctrllr, request) {
    var
      store = ctrllr.getStore(),
      user = store.get('user-1'),
      query = user.lastName.substring(5, 10),
      url = '/v1/users?search=' + query;

    request.setUrl(url);
  },
  expectStatus: 200,
  expectArray: true,
  after: function(ctrllr, response) {
    var
      body = response.body,
      store = ctrllr.getStore(),
      user = store.get('user-1');

    ctrllr.assert('should have returned 1 user', function() {
      return body && body.length === 1;
    });

    ctrllr.assert('the user returned should be `user-1`', function() {
      return body && body[0] && body[0]._id === user._id.toString();
    });
  },
}, {
  description: 'should allow searching users by the full name',
  method: 'GET',
  $$basicAuth: 'user-0',
  before: function(ctrllr, request) {
    var
      store = ctrllr.getStore(),
      user = store.get('user-2'),
      query = user.firstName + ' ' + user.lastName,
      url = '/v1/users?search=' + query;

    request.setUrl(url);
  },
  expectStatus: 200,
  expectArray: true,
  after: function(ctrllr, response) {
    var
      body = response.body,
      store = ctrllr.getStore(),
      user = store.get('user-2');

    ctrllr.assert('should have returned 1 user', function() {
      return body && body.length === 1;
    });

    ctrllr.assert('the user returned should be `user-2`', function() {
      return body && body[0] && body[0]._id === user._id.toString();
    });
  },
}, {
  description: 'should allow searching users by their email',
  method: 'GET',
  $$basicAuth: 'user-0',
  before: function(ctrllr, request) {
    var
      store = ctrllr.getStore(),
      user = store.get('user-2'),
      query = user.email,
      url = '/v1/users?search=' + query;

    request.setUrl(url);
  },
  expectStatus: 200,
  expectArray: true,
  after: function(ctrllr, response) {
    var
      body = response.body,
      store = ctrllr.getStore(),
      user = store.get('user-2');

    ctrllr.assert('should have returned 1 user', function() {
      return body && body.length === 1;
    });

    ctrllr.assert('the user returned should be `user-2`', function() {
      return body && body[0] && body[0]._id === user._id.toString();
    });
  },
}];
