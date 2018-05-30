/* ==========================================================================
 This script is the configuration for the ctrllr tests
 ========================================================================== */

var

  /**
   * app base directory
   * @type {String}
   */
  baseDir = process.cwd(),

  /** file system helper module */
  path = require('path'),

  /** async flow lib */
  $q = require('q'),

  /** configuration manager */
  configLoader = require('alfred/services/configLoader'),

  /**
   * specifies the current environment is running in a testing one
   * @type {Boolean}
   */
  isTesting = false;

process.argv.forEach(function(val) {
  if (val.indexOf('test') > -1) {
    isTesting = true;
  }
});

if (isTesting) {
  process.env.NODE_ENV = 'test';
}

module.exports = {
  port: 3030,
  server: require('alfred/server.js'),
  timeout: 10000,
  plugins: require('./ctrllr.plugins'),
  setup: function() {
    console.log('running setup');
    return configLoader.init();
  },
  cleanup: function() {
    var deferred = $q.defer();

    setTimeout(function() {
      console.log('running cleanup');
      return deferred.resolve(true);
    }, 500);

    return deferred.promise;
  },
  beforeEach: require('./ctrllr.beforeEach'),
  afterEach: require('./ctrllr.afterEach'),
  transform: function(test, pathToFile) {
    if (!pathToFile) {
      return test;
    }

    var
      pathArray = pathToFile.split('/'),
      fileName = path.basename(pathToFile),
      tags = fileName.split('.'),
      folderName;

    // [ 'user', 'follow', 'spec', 'js' ] => [ 'user', 'user.follow', 'follow' ]
    tags.pop();
    tags.pop();

    // add the folder name to the tags, so `user` tests can be ran, `resources`, etc
    // also concat the test name + folder name so you can run `user.list`, `resource.create`, etc
    if (pathArray.length > 2) {
      folderName = pathArray[pathArray.length - 2];
      tags.push(folderName + '.' + tags[0]);
      tags.push(folderName);
    }

    // make sure test has a `tags` field
    if (!test.tags) {
      test.tags = [];
    }

    // iterate over tags, add to test
    tags.forEach(function(tag) {
      test.tags.push(tag);
    });

    return test;
  }
};
