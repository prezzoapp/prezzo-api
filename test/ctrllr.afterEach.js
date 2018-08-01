/* ==========================================================================
 This script exports an array of functions to be called after each test
 ========================================================================== */

import $q from 'q';
import { debug } from 'alfred/services/logger';
import User from '../models/user';
import Resource from '../models/resource';
import Location from '../models/location';
import Vendor from '../models/vendor';
import Menu from '../models/menu';

/* ==========================================================================
 Helper functions
 ========================================================================== */

// ...

/* ==========================================================================
 Export
 ========================================================================== */

module.exports = [
  (ctrllr, response) => {
    if (response && response.status) {
      debug('response.status', response.status);
    }

    if (response && response.body) {
      debug('response.body', response.body);
    }
  },

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
   * clear all menus from database
   * @param ctrllr {CTRLLR} CTRLLR instance
   * @param response {Object} response object of request
   * @returns {*}
   */
  () => {
    const deferred = $q.defer();

    Menu.remove(() => {
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
