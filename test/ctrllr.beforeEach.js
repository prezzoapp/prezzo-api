/* ==========================================================================
 This script exports an array of functions to be called before each test
 ========================================================================== */

var

  /**
   * app base directory
   * @type {String}
   */
  baseDir = process.cwd(),

  /** async flow lib */
  $q = require('q'),

  /** logging service */
  log = require('alfred/services/logger'),

  /** server utilities */
  util = require('alfred/services/util'),

  /** configuration manager */
  configLoader = require('alfred/services/configLoader'),

  /** mongo ORM */
  mongoose = require('mongoose'),

  /** mongoose models */
  User;

/* ==========================================================================
 Initialization logic
 ========================================================================== */

const initialize = async () => {
  await configLoader.init();
  User = require(baseDir + '/models/user').default;
};

initialize();

/* ==========================================================================
 Helper Functions
 ========================================================================== */

/**
 * creates a generic User
 * @returns {User}
 */
function createUser() {
  const firstName = util.random(10);
  const lastName = util.random(10);
  const fullName = `${firstName} ${lastName}`;
  const bucket = configLoader.get('s3:S3_BUCKET');

  return new User({
    firstName,
    lastName,
    fullName,
    email: `${util.random(10)}@gmail.com`,
    password: 'password',
    sessions: [
      {
        type: 'web'
      },
      {
        type: 'ios'
      }
    ],
    avatarURL: `http://${bucket}.s3.amazonaws.com/assets/test/text-icon.png`
  });
}

/* ==========================================================================
 Export
 ========================================================================== */

module.exports = [
  // create random object id
  ctrllr => {
    const store = ctrllr.getStore();
    store.set('randomObjectId', mongoose.Types.ObjectId().toString());
  },

  // create `user-0`
  ctrllr => {
    const deferred = $q.defer();
    const store = ctrllr.getStore();
    const user = createUser();

    user.save((err, doc) => {
      if (err) {
        console.error('Error creating `user-0` in `ctrllr.beforeEach`!', err);
        return deferred.reject(err);
      }

      store.set('user-0', doc);
      return deferred.resolve(doc);
    });

    return deferred.promise;
  },

  // create `user-1`
  ctrllr => {
    const deferred = $q.defer();
    const store = ctrllr.getStore();
    const user = createUser();

    user.save((err, doc) => {
      if (err) {
        console.error('Error creating `user-1` in `ctrllr.beforeEach`!', err);
        return deferred.reject(err);
      }

      store.set('user-1', doc);
      return deferred.resolve(doc);
    });

    return deferred.promise;
  },

  // create `user-2`
  ctrllr => {
    const deferred = $q.defer();
    const store = ctrllr.getStore();
    const user = createUser();

    user.save((err, doc) => {
      if (err) {
        console.error('Error creating `user-2` in `ctrllr.beforeEach`!', err);
        return deferred.reject(err);
      }

      store.set('user-2', doc);
      return deferred.resolve(doc);
    });

    return deferred.promise;
  },

  // create `user-3`
  ctrllr => {
    const deferred = $q.defer();
    const store = ctrllr.getStore();
    const user = createUser();

    user.save((err, doc) => {
      if (err) {
        console.error('Error creating `user-3` in `ctrllr.beforeEach`!', err);
        return deferred.reject(err);
      }

      store.set('user-3', doc);
      return deferred.resolve(doc);
    });

    return deferred.promise;
  },

  // create `user-4`
  ctrllr => {
    const deferred = $q.defer();
    const store = ctrllr.getStore();
    const user = createUser();

    user.save((err, doc) => {
      if (err) {
        console.error('Error creating `user-4` in `ctrllr.beforeEach`!', err);
        return deferred.reject(err);
      }

      store.set('user-4', doc);
      return deferred.resolve(doc);
    });

    return deferred.promise;
  }
];
