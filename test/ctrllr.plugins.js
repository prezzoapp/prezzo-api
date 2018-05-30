var

  /**
   * app base directory
   * @type {String}
   */
  baseDir = process.cwd(),

  /** async flow lib */
  $q = require('q'),

  /** file system module */
  fs = require('fs'),

  /** http request module */
  request = require('superagent'),

  /** logging service */
  log = require('alfred/services/logger'),

  /** server utilities */
  util = require('alfred/services/util'),

  /** configuration manager */
  configLoader = require('alfred/services/configLoader'),

  /** worker service */
  worker,

  /** mongoose models */
  models;

/* ==========================================================================
Initialization logic
 ========================================================================== */

configLoader.init().then(function() {
  worker = require(baseDir + '/services/worker');

  models = {};
  util.loadDirectorySync(baseDir + '/models').forEach(function(modelName) {
    models[modelName] = require(baseDir + '/models/' + modelName);
  });
});

/* ==========================================================================
 These are the ctrllr plugins that will be used in the tests.
 ========================================================================== */

/**
 * recursive interpolation of string from ctrllr data store
 * @param store {Store} ctrllr data store
 * @param str {String} string to interpolate
 * @returns {String}
 */
function interpolate(store, str) {
  if (typeof str !== 'string') {
    return str;
  }

  var
    regex = /{{([\w\s\-\d\.\[\]]+)}}/g,
    matches = str.match(regex),
    dump = store.dump(),
    map = {},
    keys;

  if (matches && matches.length) {
    matches.forEach(function(match) {
      var clean = match.match(/\{\{(.*?)\}\}/)[1].trim();
      map[match] = util.evalKeyValue(dump, clean);
    });

    if ((keys = Object.keys(map)).length === 1 && keys[0] === str) {
      return map[keys[0]];
    }

    var str = util.mapStrings(str, map);

    // if the string is surrounded by "<%" and "%>", evaluate it as javascript
    if (str.substr(0, 2) === '<%' && str.substr(str.length - 2, 2) === '%>') {
      str = str.substr(0, str.length - 2).substr(2);
      return eval(str);
    } else {
      return str;
    }
  }

  return str;
}

/**
 * recursively interpolates an object
 * @param store {Store}
 * @param obj {*} object to interpolate
 * @returns {*}
 */
function recursiveInterpolation(store, obj) {
  if (typeof obj === 'string') {
    return interpolate(store, obj);
  }

  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    } else if (obj instanceof RegExp) {
      continue;
    } else if (typeof obj[key] === 'boolean') {
      continue;
    } else if (typeof obj[key] === 'function') {
      continue;
    } else if (typeof obj[key] === 'string') {
      obj[key] = interpolate(store, obj[key]);
    } else if (typeof obj[key] === 'object' && obj[key] instanceof Array) {
      for (var i = 0, len = obj[key].length; i < len; i++) {
        if (typeof obj[key][i] === 'string') {
          obj[key][i] = interpolate(store, obj[key][i]);
        } else {
          obj[key][i] = recursiveInterpolation(store, obj[key][i]);
        }
      }
    } else if (typeof obj[key] === 'object') {
      obj[key] = recursiveInterpolation(store, obj[key]);
    } else {
      // do nothing
    }
  }

  return obj;
}

/**
 * asserts an object against a specification
 * @param ctrllr {CTRLLR|Interface} ctrllr instance
 * @param ref {*} object to check
 * @param specs {*} specification to check object against
 * @param logPrefix {String} additional prefix for log message
 */
function $$assert(ctrllr, ref, specs, logPrefix) {
  var
    store = ctrllr.getStore(),
    assertLogPrefix,
    valueExpected,
    valueActual;

  if (logPrefix) {
    assertLogPrefix = '$$assert (' + logPrefix + '): ';
  } else {
    assertLogPrefix = '$$assert: ';
  }

  specs = recursiveInterpolation(store, specs);

  for (var key in specs) {
    if (!specs.hasOwnProperty(key)) {
      continue;
    }

    if (typeof specs[key] === 'boolean' || typeof specs[key] === 'string' || typeof specs[key] === 'number') {
      valueExpected = specs[key];
      valueActual = util.evalKeyValue(ref, key);

      ctrllr.assert(assertLogPrefix + 'should have the property `' + key + '`' +
        ' with the value `' + specs[key] + '`', function() {

        return valueExpected === valueActual;
      }, valueExpected, valueActual, ctrllr);
    } else if (specs[key] instanceof RegExp) {
      valueActual = util.evalKeyValue(ref, key);

      ctrllr.assert('should match RegExp', function() {
        return specs[key].test(valueActual);
      });
    } else if (typeof specs[key] === 'function') {
      // valueExpected = util.evalKeyValue(ref, key);
      valueActual = util.evalKeyValue(ref, key);

      ctrllr.assert(assertLogPrefix + key + ' : running custom validator', function() {
        return specs[key](valueActual, ctrllr);
      });
    } else if (specs[key] && specs[key]._bsontype) {
      valueExpected = specs[key].toString();
      valueActual = util.evalKeyValue(ref, key);
      if (valueActual) valueActual = valueActual.toString();

      ctrllr.assert(assertLogPrefix + 'should have the property `' + key + '`' +
        ' with the value `' + specs[key] + '`', function() {

        return valueExpected === valueActual;
      }, valueExpected, valueActual, ctrllr);
    } else if (key === '$length') {
      valueActual = ref && typeof ref.length !== 'undefined' ?
        ref.length : null;

      if (typeof specs[key] === 'number') {
        valueExpected = specs[key];
        ctrllr.assert(assertLogPrefix + 'should have `' + specs[key] + ' items in the array', function() {
          return valueExpected !== valueActual;
        }, '$ne: ' + valueExpected, valueActual);
      } else {
        for (var key2 in specs[key]) {
          valueExpected = specs[key][key2];

          if (key2 === '$gt') {
            ctrllr.assert(assertLogPrefix + 'should have MORE THAN ' + valueExpected + ' items in the array', function() {
              return valueActual > valueExpected;
            }, '$gt: ' + valueExpected, valueActual);
          } else if (key2 === '$gte') {
            ctrllr.assert(assertLogPrefix + 'should have MORE THAN OR EQUAL TO ' + valueExpected + ' items in the array', function() {
              return valueActual >= valueExpected;
            }, '$gt: ' + valueExpected, valueActual);
          } else if (key2 === '$lt') {
            ctrllr.assert(assertLogPrefix + 'should have LESS THAN ' + valueExpected + ' items in the array', function() {
              return valueActual < valueExpected;
            }, '$lt: ' + valueExpected, valueActual);
          } else if (key2 === '$lte') {
            ctrllr.assert(assertLogPrefix + 'should have LESS THAN OR EQUAL TO ' + valueExpected + ' items in the array', function() {
              return valueActual <= valueExpected;
            }, '$lt: ' + valueExpected, valueActual);
          }
        }
      }
    } else if (typeof specs[key] === 'object' && !(specs[key] instanceof Array)) {

      for (var key2 in specs[key]) {
        if (!specs[key].hasOwnProperty(key2)) {
          continue;
        }

        if (key2 === '$ne') {
          valueExpected = specs[key][key2];
          valueActual = util.evalKeyValue(ref, key);

          ctrllr.assert(assertLogPrefix + 'should have the property `' + key + '`' +
            ' with a value NOT equal to `' + specs[key][key2] + '`', function() {
            // console.log('doc', docs[i], 'expected: ', valueExpected, 'actual: ', valueActual);

            return valueExpected !== valueActual;
          }, '$ne: ' + valueExpected, valueActual);
        } else if (key2 === '$length') {
          valueExpected = specs[key][key2];
          valueActual = util.evalKeyValue(ref, key);

          valueActual = valueActual && valueActual instanceof Array ? valueActual.length : null;

          ctrllr.assert(assertLogPrefix + 'should have the property `' + key + '`' +
            ' with a length equal to `' + specs[key][key2] + '`', function() {
            return valueExpected === valueActual;
          }, valueExpected, valueActual);
        } else {
          console.error(assertLogPrefix + 'Unknown specification passed to $$assert! ' + key + '.' + key2);
          console.log('evaluated:: ', util.evalKeyValue(ref, key));
          console.log('');
        }
      }
    }
  }
}

module.exports = [
  {
    name: '$$basicAuth',

    /**
     * pulls a user from the data store ans sets a basic-auth header using the user's id and one of its devices
     * @param ctrllr
     * @param request
     * @param value
     */
    before: function(ctrllr, request, value) {
      var
        store = ctrllr.getStore(),
        user = store.get(value),
        authToken = util.getAuthToken(user);

      request.setHeader('Authorization', authToken);
    }
  },


  {
    name: '$$url',

    /**
     * builds a dynamic url;
     * uses handlebar notation to specify data to be pulled from the data store
     * @param ctrllr
     * @param request
     * @param value
     */
    before: function(ctrllr, request, value) {
      var
        store = ctrllr.getStore(),
        url = interpolate(store, value);

      request.setUrl(url);
    }
  },


  {
    name: '$$send',

    /**
     * pulls a value from the data store, sends it in the request body
     * @param ctrllr
     * @param request
     * @param value
     */
    before: function(ctrllr, request, value) {
      var
        store = ctrllr.getStore(),
        data = store.dump(),
        payload = {};

      if (typeof value === 'function') {
        payload = value(ctrllr);
      } else {
        for (var key in value) {
          if (value.hasOwnProperty(key)) {
            if (typeof value[key] === 'function') {
              payload[key] = value[key](ctrllr);
            } else {
              payload[key] = recursiveInterpolation(store, value[key]);
            }
          }
        }
      }

      store.set('payload', payload);
      request.send(payload);
    }
  },


  {
    name: '$$expectKeyValue',

    /**
     * makes sure data returned in the response matches the expected values;
     * builds the expected vales from the data store
     * @param ctrllr
     * @param response
     * @param value
     */
    after: function(ctrllr, response, value) {
      var ref = response.body instanceof Array ? response.body : [response.body];

      for (var i = 0, len = ref.length; i < len; i++) {
        $$assert(ctrllr, ref[i], value, '$$expectKeyValue');
      }
    }
  },


  {
    name: '$$expectArray',

    /**
     * makes sure the returned response is an array;
     * additionally, it checks other properties like length
     * @param ctrllr
     * @param response
     * @param value
     */
    after: function(ctrllr, response, value) {
      if (typeof value === 'boolean') {
        ctrllr.assert('$$expectArray: response should ' + (value ? '' : 'NOT') +
          ' be an array', function() {
          return response.body instanceof Array === value;
        });
      } else if (typeof value === 'number') {
        ctrllr.assert('$$expectArray: response should be an array with ' + value + ' items', function() {
          return response.body instanceof Array && response.body.length === value;
        });
      }
    }
  },


  {
    name: '$$expectInArray',

    /**
     * makes sure the returned response is an array;
     * additionally, it checks other properties like length
     * @param ctrllr
     * @param response
     * @param value
     */
    after: function(ctrllr, response, value) {
      var results = response.body instanceof Array ? response.body : [response.body];
      for (var key in value) {
        ctrllr.assert(key, function() {
          for (var i = 0, len = results.length; i < len; i++) {
            if (value[key](results[i], ctrllr, response)) {
              return true;
            }
          }

          return false;
        });
      }
    }
  },


  {
    name: '$$expectNone',

    /**
     * makes sure none of the results match the criteria
     * additionally, it checks other properties like length
     * @param ctrllr
     * @param response
     * @param value
     */
    after: function(ctrllr, response, value) {
      var results = response.body instanceof Array ? response.body : [response.body];
      for (var key in value) {
        ctrllr.assert(key, function() {
          for (var i = 0, len = results.length; i < len; i++) {
            if (value[key](results[i], ctrllr, response)) {
              return false;
            }
          }

          return true;
        });
      }
    }
  },


  {
    name: '$$expectAll',

    /**
     * makes sure every item matches the criteria
     * @param ctrllr
     * @param response
     * @param value
     */
    after: function(ctrllr, response, value) {
      var results = response.body instanceof Array ? response.body : [response.body];
      for (var key in value) {
        ctrllr.assert(key, function() {
          for (var i = 0, len = results.length; i < len; i++) {
            if (!value[key](results[i], ctrllr, response)) {
              return false;
            }
          }

          return true;
        });
      }
    }
  },


  {
    name: '$$each',

    /**
     * iterate over specified properties run assertions
     * additionally, it checks other properties like length
     * @param ctrllr
     * @param response
     * @param value
     */
    after: function(ctrllr, response, value) {
      var results = response.body instanceof Array ? response.body : [response.body];

      // iterate over all items returned
      for (var i = 0, len = results.length, ref; i < len; i++) {
        // ref = util.evalKeyValue(results[i]);

        // iterate over all key / value assertions
        for (var key in value) {
          ref = util.evalKeyValue(results[i], key);

          // make sure `ref` is array
          if (!(ref instanceof Array)) {
            ref = [ref];
          }

          // iterate over all spec / function pairs
          for (var spec in value[key]) {
            // iterate over all items in `ref` and run assertions
            ref.forEach(function(item, index) {
              // run assertion function
              ctrllr.assert(spec, function() {
                return value[key][spec](item, ctrllr, response);
              });
            });
          }
        }
      }
    }
  },


  {
    name: '$$expectCount',

    /**
     * makes sure the expected number of results are returned
     * additionally, it checks other properties like length
     * @param ctrllr
     * @param response
     * @param value
     */
    after: function(ctrllr, response, value) {
      if (typeof value === 'number') {
        ctrllr.assert('$$expectCount: ' + value, function() {
          return response.body && response.body.length === value;
        });

        return;
      }

      var specs = { $length: value };

      /*
      for (var key in value) {
        if (typeof value[key] === 'number') {
          value[key] = { $length: value[key] };
        }
      }
      */

      $$assert(ctrllr, response.body, specs, '$$expectCount');
    }
  },


  {
    name: '$$expectHeaders',

    /**
     * makes sure a
     * @param ctrllr
     * @param response
     * @param value
     */
    after: function(ctrllr, response, value) {
      for (var key in value) {
        $$assert(ctrllr, response.header, value, '$$expectHeaders');
      }
    }
  },


  {
    name: '$$flushKueBefore',

    /**
     * flushes the kue redis instance before a test
     * @param ctrllr
     * @param response
     * @param value
     */
    before: function(ctrllr, response, value) {
      if (!value) {
        return false;
      }

      console.log('$$flushKueBefore flushing redis');
      var deferred = $q.defer();
      worker.queue.client.flushdb(function(err) {
        if (err) {
          return deferred.reject('Error flushing kue redis instance', err);
        }

        return deferred.resolve(true);
      });

      return deferred.promise;
    }
  },


  {
    name: '$$flushKueAfter',

    /**
     * flushes the kue redis after a test
     * @param ctrllr
     * @param response
     * @param value
     */
    after: function(ctrllr, response, value) {
      if (!value) {
        return false;
      }

      console.log('$$flushKueAfter flushing redis');
      var deferred = $q.defer();
      worker.queue.client.flushdb(function(err) {
        if (err) {
          return deferred.reject('Error flushing kue redis instance', err);
        }

        return deferred.resolve(true);
      });

      return deferred.promise;
    }
  },


  {
    name: '$$assertJob',

    /**
     * makes sure a kue job was created
     * @param ctrllr
     * @param response
     * @param value
     */
    after: function(ctrllr, response, value) {
      var
        deferred = $q.defer(),
        taskName = value.$type;

      if (!taskName) {
        var message = '`$$assertJob` missing `$type`';
        console.error(message);
        deferred.reject(message);
        return deferred.promise;
      }

      // worker.kue.Job.rangeByType(taskName, 'active', 0, -1, 'asc', function(err, jobs) {
      worker.kue.Job.range(0, -1, 'asc', function(err, jobs) {
        if (err) {
          console.error('$$assertJob: error querying task: ' + taskName, err);
          return deferred.reject(err);
        }

        jobs = jobs.reduce(function(queue, val) {
          if (val.type === taskName) {
            queue.push(val);
          }

          return queue;
        }, []);

        $$assert(ctrllr, jobs, value.$values, '$$assertJob');

        util.safeAsync(value.$then, 5000, [
          jobs,
          ctrllr,
          response
        ]).then(function() {
          return deferred.resolve(jobs);
        }).fail(function(err) {
          return deferred.reject(err);
        });

      });

      return deferred.promise;
    }
  },


  {
    name: '$queue',

    /**
     * adds tasks, with data, to kue and executes them
     * @param ctrllr
     * @param response
     * @param value
     */
    before: function(ctrllr, before, value) {
      var
        store = ctrllr.getStore(),
        deferred = $q.defer(),
        promises = Object.keys(value).map(function(key) {
          var
            deferred2 = $q.defer(),
            data = recursiveInterpolation(store, value[key]),
            options = value.$options || {},
            job = worker.add(key, data, options),
            callback = function() {
              deferred2.resolve(true);
            };

          job.on('failed', callback);
          job.on('complete', callback);

          worker.processTasks(function(task) {
            return task.name === key;
          });

          return deferred2.promise;
        });

      $q.all(promises)
        .then(function() {
          return deferred.resolve(true);
        })
        .fail(function(err) {
          return deferred.reject(err);
        });

      return deferred.promise;
    }
  },


  {
    name: '$$assertModel',

    /**
     * queries a model, verifies a query, or multiple queries, against the results
     * @param ctrllr
     * @param response
     * @param value
     */
    after: function(ctrllr, response, value) {
      var
        deferred = $q.defer(),
        store = ctrllr.getStore(),
        operations = value instanceof Array ? value : [value],
        promises = operations.map(function(operation) {
          var
            deferred2 = $q.defer(),
            model = models[operation.$model],
            query = {};

          if (!model) {
            console.error('Error! $$assertModel couldn\'t find model: ' + operation.$model);
            deferred.reject('You must specify a valid `$model` property for the `$$assertModel` plugin.');
            return deferred.promise;
          }

          if (operation.$_id) {
            query._id = interpolate(store, operation.$_id);
          } else if (operation.$query) {
            query = recursiveInterpolation(store, operation.$query);
          } else {
            console.error('Error! $$assertModel wasn\'t provided `$_id` or `$query`.');
            deferred.reject('You must specify either an `$_id` or `$query` for the `$$assertModel` plugin.');
            return deferred.promise;
          }

          model.find(query, function(err, docs) {
            if (err) {
              console.error('Error! $$assertModel encountered error during query.', err);
              return deferred2.reject(err);
            }

            if (operation.$values) {
              for (var i = 0, len = docs.length; i < len; i++) {
                $$assert(ctrllr, docs[i], operation.$values, '$$assertModel[' + operation.$model + ']');
              }
            }

            // TODO: use test options timeout
            util.safeAsync(operation.$then, 5000, [
              operation.$_id ? (docs && docs.length ? docs[0] : null) : docs,
              ctrllr,
              response
            ]).then(function() {
              return deferred2.resolve(docs);
            }).fail(function(err) {
              return deferred2.reject(err);
            });
          });

          return deferred2.promise;
        });

      $q.all(promises)
        .then(function() {
          return deferred.resolve(true);
        })
        .fail(function(err) {
          return deferred.reject(err);
        });

      return deferred.promise;
    }
  },


  {
    name: '$$modifyModel',

    /**
     * queries & modifies model data before a request
     * @param ctrllr
     * @param request
     * @param value
     */
    before: function(ctrllr, request, value) {
      log.debug('$$modifyModel');

      var
        deferred = $q.defer(),
        store = ctrllr.getStore(),
        operations = value instanceof Array ? value : [value],
        promises = operations.map(function(operation) {
          var
            deferred2 = $q.defer(),
            model = models[operation.$model],
            query = {},
            update;

          if (!model) {
            console.error('Error! $$modifyModel couldn\'t find model: ' + operation.$model);
            deferred2.reject('You must specify a valid `$model` property for the `$$modifyModel` plugin.');
            return deferred2.promise;
          }

          if (operation.$_id) {
            query._id = interpolate(store, operation.$_id);
          } else if (operation.$query) {
            query = recursiveInterpolation(store, operation.$query);
          } else {
            console.error('Error! $$modifyModel wasn\'t provided `$_id` or `$query`.');
            deferred2.reject('You must specify either an `$_id` or `$query` for the `$$modifyModel` plugin.');
            return deferred2.promise;
          }

          if (!operation.$update) {
            console.error('Error! $$modifyModel wasn\'t provided `$update`.');
            deferred2.reject('You must provid an `$update` property for the `$$modifyModel` plugin.');
            return deferred2.promise;
          }

          update = recursiveInterpolation(store, operation.$update);

          model.update(query, update, operation.$options || {}, function(err, docs) {
            if (err) {
              console.error('Error! $$modifyModel encountered error during query.', err);
              return deferred2.reject(err);
            }

            // find and update items in store
            model.find(query, function(err, docs) {
              var keys = Object.keys(store.dump());

              docs.forEach(function(doc) {
                keys.forEach(function(key) {
                  var item = store.get(key);
                  if (item && item._id && item._id.toString() === doc._id.toString()) {
                    store.set(key, doc);
                  }
                });
              });

              // TODO: use test options timeout
              util.safeAsync(operation.$then, 5000, [
                docs,
                ctrllr,
                request
              ])
                .then(function() {
                  return deferred2.resolve(docs);
                }).fail(function(err) {
                  return deferred2.reject(err);
                });
            });
          });

          return deferred2.promise;
        });

      $q.all(promises)
        .then(function() {
          return deferred.resolve(true);
        })
        .fail(function(err) {
          return deferred.reject(err);
        });

      return deferred.promise;
    }
  },


  /**
   * reloads all the models saved in the store
   */
  {
    name: '$$reloadStore',

    /**
     * queries the db for all items in the store, saves updated versions
     * @param ctrllr
     * @param response
     * @param value
     */
    after: function(ctrllr, response, value) {
      log.debug('$$reloadStore');

      var
        deferred = $q.defer(),
        store = ctrllr.getStore(),
        promises = Object.keys(models).map(function(model) {

          var
            deferred2 = $q.defer(),
            dump = store.dump(),
            keys = Object.keys(dump),
            morePromises = keys.map(function(key) {
              if (typeof dump[key] === 'undefined' || !dump[key]._id || !(dump[key] instanceof models[model])) {
                return util.deferResolve();
              };

              var deferred3 = $q.defer();
              models[model].findById(dump[key]._id, function(err, doc) {
                if (err) {
                  return deferred3.reject(err);
                } else if (!doc) {
                  store.remove(key);
                  return deferred.resolve(null);
                }

                store.set(key, doc);
                return deferred3.resolve(doc);
              });

              return deferred3.promise;
            });

          $q.all(morePromises)
            .then(deferred2.resolve)
            .fail(deferred2.reject);

          return deferred2.promise;
        });

      $q.all(promises)
        .then(deferred.resolve)
        .fail(deferred.reject);

      return deferred.promise;
    },
  },


  {
    name: '$$ajax',

    /**
     * makes a request to a url
     * @param ctrllr
     * @param response
     * @param value
     */
    after: function(ctrllr, response, value) {
      var
        deferred = $q.defer(),
        store = ctrllr.getStore(),
        operations = value instanceof Array ? value : [value],
        promises = operations.map(function(operation) {
          var
            deferred2 = $q.defer(),
            method = (operation.method || 'get').toLowerCase(),
            data = recursiveInterpolation(store, operation.data || {}),
            url = interpolate(store, operation.url);

          if (!url) {
            deferred2.reject(new Error('No `url` provided to $$ajax.'));
            return deferred2.promise;
          }

          var r = request[method](url);
          if (data && method !== 'get') {
            r.send(data);
          }

          r.end(function(err, response) {
            if (err) {
              console.log('$$ajax error', err);
              return deferred2.reject(new Error(err));
            }

            if (operation.assert) {
              console.log('asserting operation', operation.assert);
              $$assert(ctrllr, response, operation.assert, '$$ajax');
            }

            return deferred2.resolve(true);
          });

          return deferred2.promise;
        });

      $q.all(promises)
        .then(deferred.resolve)
        .fail(deferred.reject);

      return deferred.promise;
    },
  },
];
