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
  User, Resource, File;

/* ==========================================================================
 Initialization logic
 ========================================================================== */

const initialize = async () => {
  await configLoader.init();
  User = require(baseDir + '/models/user').default;
  Resource = require(baseDir + '/models/resource').default;
  File = require(baseDir + '/models/file').default;
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

/**
 * creates a generic Resource
 * @returns {Resource}
 */
function createResourceWithJPG() {
  const fileName = `${configLoader.get('NODE_ENV')}/${util.uuid()}.jpg`;

  return new Resource({
    name: util.random(10),
    description: 'userAvatar',
    files: [
      new File({
        key: fileName,
        size: 3017,
        mime: 'image/jpeg',
        acl: 'public-read',
        status: 'ready',
        type: 'original'
      })
    ]
  });
}

/**
 * creates a generic Resource
 * @returns {Resource}
 */
function createResource() {
  return createResourceWithJPG();
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

    user.facebookId = '4';
    user.facebookToken = util.random(20);

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
  },

  // create `resource-0`, set `user-0` as creator
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-0');
    const resource = createResource();

    resource.creator = user._id;
    resource.save((err, doc) => {
      if (err) {
        console.error(
          'Error creating `resource-0` in `ctrllr.beforeEach`!',
          err
        );
        return reject(err);
      }

      store.set('resource-0', doc);
      return resolve(doc);
    });

    return promise;
  },

  // create `resource-1`, set `user-0` as creator
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-0');
    const resource = createResource();

    resource.creator = user._id;
    resource.save((err, doc) => {
      if (err) {
        console.error(
          'Error creating `resource-1` in `ctrllr.beforeEach`!',
          err
        );
        return reject(err);
      }

      store.set('resource-1', doc);
      return resolve(doc);
    });

    return promise;
  },

  // create `resource-2`, set `user-0` as creator
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-0');
    const resource = createResource();

    resource.creator = user._id;
    resource.save((err, doc) => {
      if (err) {
        console.error(
          'Error creating `resource-2` in `ctrllr.beforeEach`!',
          err
        );
        return reject(err);
      }

      store.set('resource-2', doc);
      return resolve(doc);
    });

    return promise;
  },

  // create `resource-3`, set `user-1` as creator
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-1');
    const resource = createResource();

    resource.creator = user._id;
    resource.save((err, doc) => {
      if (err) {
        console.error(
          'Error creating `resource-3` in `ctrllr.beforeEach`!',
          err
        );
        return reject(err);
      }

      store.set('resource-3', doc);
      return resolve(doc);
    });

    return promise;
  },

  // create `resource-4`, set `user-1` as creator
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-1');
    const resource = createResource();

    resource.creator = user._id;
    resource.save((err, doc) => {
      if (err) {
        console.error(
          'Error creating `resource-4` in `ctrllr.beforeEach`!',
          err
        );
        return reject(err);
      }

      store.set('resource-4', doc);
      return resolve(doc);
    });

    return promise;
  }
];
