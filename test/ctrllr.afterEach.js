/* ==========================================================================
 This script exports an array of functions to be called after each test
 ========================================================================== */

import $q from 'q';
import User from '../models/user';
import Resource from '../models/resource';
import Location from '../models/location';
import Vendor from '../models/vendor';

/* ==========================================================================
 Helper functions
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
    const deferred = $q.defer();

    User.remove(() => {
      deferred.resolve('resolved!');
    });

    return deferred.promise;
  },

  /**
   * clear all resources from database
   * @param ctrllr {CTRLLR} CTRLLR instance
   * @param response {Object} response object of request
   * @returns {*}
   */
  () => {
    const deferred = $q.defer();

    Resource.remove(() => {
      deferred.resolve('resolved!');
    });

    return deferred.promise;
  },

  /**
   * clear all locations from database
   * @param ctrllr {CTRLLR} CTRLLR instance
   * @param response {Object} response object of request
   * @returns {*}
   */
  () => {
    const deferred = $q.defer();

    Location.remove(() => {
      deferred.resolve('resolved!');
    });

    return deferred.promise;
  },

  /**
   * clear all vendors from database
   * @param ctrllr {CTRLLR} CTRLLR instance
   * @param response {Object} response object of request
   * @returns {*}
   */
  () => {
    const deferred = $q.defer();

    Vendor.remove(() => {
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
