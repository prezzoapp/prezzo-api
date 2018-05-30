/* ==========================================================================
 This script exports an array of functions to be called after each test
 ========================================================================== */

import $q from 'q';
import User from '../models/user';

/* ==========================================================================
 Helper functions
 ========================================================================== */

// ...

/* ==========================================================================
 Export
 ========================================================================== */

// ...

 /* ==========================================================================
  Export
  ========================================================================== */

module.exports = [
  /**
   * clear all users from database
   * @param ctrllr {CTRLLR} CTRLLR instance
   * @param response {Object} response object of request
   * @returns {*}
   */
  () => {
    // const User = require('../models/user').default;
    const deferred = $q.defer();

    User.remove(() => {
      deferred.resolve('resolved!');
    });

    return deferred.promise;
  },

  /**
   * empties data store
   * @param ctrllr {CTRLLR} CTRLLR instance
   * @param response {Object} response object of request
   * @returns {*}
   */
  ctrllr => {
    // empty data store
    ctrllr.getStore().clear();
  }
];
