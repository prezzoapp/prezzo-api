// @flow
import path from 'path';
import configLoader from 'alfred/services/configLoader';
import server from 'alfred/server';

import plugins from './ctrllr.plugins';
import beforeEach from './ctrllr.beforeEach';
import afterEach from './ctrllr.afterEach';

let isTesting = false;

process.argv.forEach(val => {
  if (val.indexOf('test') > -1) {
    isTesting = true;
  }
});

if (isTesting) {
  process.env.NODE_ENV = 'test';
}

module.exports = {
  server,
  plugins,
  afterEach,
  beforeEach: afterEach.concat(beforeEach), // run clean up functions
  port: 3030,
  timeout: 10000,
  setup: configLoader.init,
  cleanup() {},
  transform(test, pathToFile) {
    if (!pathToFile) {
      return test;
    }

    const pathArray = pathToFile.split('/');
    const fileName = path.basename(pathToFile);
    const tags = fileName.split('.');
    let folderName;

    // [ 'user', 'follow', 'spec', 'js' ] => [ 'user', 'user.follow', 'follow' ]
    tags.pop();
    tags.pop();

    // add the folder name to the tags, so `user` tests can be ran, `resources`, etc
    // also concat the test name + folder name so you can run `user.list`, `resource.create`, etc
    if (pathArray.length > 2) {
      folderName = pathArray[pathArray.length - 2];
      tags.push(`${folderName}.${tags[0]}`);
      tags.push(folderName);
    }

    // make sure test has a `tags` field
    if (!test.tags) {
      test.tags = [];
    }

    // iterate over tags, add to test
    tags.forEach(tag => {
      test.tags.push(tag);
    });

    return test;
  }
};
