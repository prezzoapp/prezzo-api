// @flow
import $q from 'q';
import mongoose from 'mongoose';
import { debug, error } from 'alfred/services/logger';
import { random, uuid, getNumberInRange } from 'alfred/services/util';
import configLoader from 'alfred/services/configLoader';
import categories from '../models/vendor/config/categories';

const baseDir = process.cwd();
let User;
let Resource;
let File;
let Location;
let Vendor;
let HoursOfOperation;
let Menu;
let MenuCategory;
let MenuItem;
let PaymentMethod;
let Order;
let OrderItem;
let $braintree;

const initialize = async () => {
  await configLoader.init();
  User = require(baseDir + '/models/user').default;
  Resource = require(baseDir + '/models/resource').default;
  File = require(baseDir + '/models/file').default;
  Location = require(baseDir + '/models/location').default;
  Vendor = require(baseDir + '/models/vendor').default;
  HoursOfOperation = require(baseDir + '/models/hoursOfOperation').default;
  Menu = require(baseDir + '/models/menu').default;
  MenuCategory = require(baseDir + '/models/MenuCategory').default;
  MenuItem = require(baseDir + '/models/menuItem').default;
  PaymentMethod = require(baseDir + '/models/paymentMethod').default;
  Order = require(baseDir + '/models/order').default;
  OrderItem = require(baseDir + '/models/orderItem').default;

  $braintree = require(baseDir + '/services/braintree');
};

initialize();

/**
 * creates a generic User
 * @returns {User}
 */
function createUser() {
  const firstName = random(10);
  const lastName = random(10);
  const fullName = `${firstName} ${lastName}`;
  const bucket = configLoader.get('s3:S3_BUCKET');

  return new User({
    firstName,
    lastName,
    fullName,
    email: `${random(10)}@gmail.com`,
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
  const fileName = `${configLoader.get('NODE_ENV')}/${uuid()}.jpg`;

  return new Resource({
    name: random(10),
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

/**
 * creates a generic location
 * @return {Location}
 */
function createLocation() {
  return new Location({
    address: '123 Main St',
    city: 'Beverly Hills',
    region: 'California',
    regionShort: 'CA',
    country: 'United States',
    countryShort: 'US',
    postalCode: '90210',
    coordinates: [
      -118.40612,
      34.088808,
    ],
  });
}

/**
 * creates a generic location
 * @return {Location}
 */
function createLocation2() {
  return new Location({
    address: '123 Main St',
    city: 'Omaha',
    region: 'Nebraska',
    regionShort: 'NE',
    country: 'United States',
    countryShort: 'US',
    postalCode: '68111',
    coordinates: [
      -95.96434,
      41.294547,
    ],
  });
}

/**
 * creates a generic location
 * @return {Location}
 */
function createLocation3() {
  return new Location({
    address: '123 Main St',
    city: 'Venice',
    region: 'California',
    regionShort: 'CA',
    country: 'United States',
    countryShort: 'US',
    postalCode: '90291',
    coordinates: [
      -118.46531,
      33.992411,
    ],
  });
}

/**
 * creates a generic location
 * @return {Location}
 */
function createLocation4() {
  return new Location({
    address: '350 Hope Ave',
    city: 'Salt Lake City',
    region: 'Utah',
    regionShort: 'UT',
    country: 'United States',
    countryShort: 'US',
    postalCode: '84115',
    coordinates: [
      -111.9712219,
      40.7407948,
    ],
  });
}

/**
 * creates a generic location
 * @return {Location}
 */
function createLocation5() {
  return new Location({
    address: '757 Westwood Plaza',
    city: 'Los Angeles',
    region: 'California',
    regionShort: 'CA',
    country: 'United States',
    countryShort: 'US',
    postalCode: '90095',
    coordinates: [-118.4473698, 34.068921]
  });
}

/**
 * creates a generic vendor
 * @return {Vendor}
 */
function createVendor() {
  return new Vendor({
    name: random(10),
    phone: random(10, false, true),
    website: `https://${random(10)}.com/`,
    categories: [categories[getNumberInRange(0, categories.length)]],
    avatarURL: `https://${random(10)}.com/${random(10)}.jpg`,
    location: createLocation(),
    hours: [
      new HoursOfOperation({
        dayOfWeek: 1,
        openTimeHour: 8,
        openTimeMinutes: 0,
        closeTimeHour: 10,
        closeTimeMinutes: 0
      }),
      new HoursOfOperation({
        dayOfWeek: 2,
        openTimeHour: 8,
        openTimeMinutes: 0,
        closeTimeHour: 10,
        closeTimeMinutes: 0
      })
    ],
    status: 'pending'
  });
}

/**
 * creates a generic menu
 * @return {Vendor}
 */
function createMenu() {
  // creates a menu with 3 categories
  // the first category has 0 items
  // the second category has 1 items
  // the third category has 2 items
  return new Menu({
    categories: [0, 1, 2].map(
      i =>
        new MenuCategory({
          title: random(10),
          items: Array.from({ length: i }, (v, i2) => i2).map(
            () =>
              new MenuItem({
                title: random(10),
                description: random(50),
                price: 10.5,
                imageURLs: [1, 2, 3].map(
                  () => `https://${random(10)}.com/${random(10)}.jpg`
                )
              })
          )
        })
    )
  });
}

/**
 * creates a generic PaymentMethod
 * @returns {PaymentMethod}
 */
function createPaymentMethod() {
  return new PaymentMethod();
}

/**
 * creates a generic menu
 * @return {PaymentMethod}
 */
function configAndSavePaymentMethod(paymentMethod, braintreeToken, user) {
  debug('configAndSavePaymentMethod()');
  return new Promise(async (resolve, reject) => {
    const result = await $braintree.createPaymentMethod(
      user.braintreeCustomerId,
      braintreeToken
    );

    paymentMethod.creator = user._id;
    paymentMethod.token = result.paymentMethod.token;
    $braintree.setPaymentMethodTypeAndIdentifier(
      paymentMethod,
      result,
      user
    );

    debug('saving payment method');
    paymentMethod.save((err, doc) => {
      if (err) {
        error('error saving payment method', err, '');
        return reject(err);
      }

      debug('resolving configAndSavePaymentMethod()');
      return resolve(doc);
    });
  });
}

/**
 * creates a generic Order
 * @returns {Order}
 */
function createOrder() {
  return new Order({
    status: 'pending',
    readableIdentifier: getNumberInRange(1000, 9999),
    type: 'table',
    paymentType: 'cash',
    items: [
      {
        title: random(10),
        description: random(50),
        price: parseFloat(
          `${getNumberInRange(0, 99)}.${getNumberInRange(11, 99)}`
        ),
        notes: random(50)
      },
      {
        title: random(10),
        description: random(50),
        price: parseFloat(
          `${getNumberInRange(0, 99)}.${getNumberInRange(11, 99)}`
        ),
        notes: random(50)
      },
      {
        title: random(10),
        description: random(50),
        price: parseFloat(
          `${getNumberInRange(0, 99)}.${getNumberInRange(11, 99)}`
        ),
        notes: random(50)
      }
    ].map(item => new OrderItem(item))
  });
}

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
    user.facebookToken = random(20);

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
  },

  // create `location-0`,
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const location = createLocation();

    location.save((err, doc) => {
      if (err) {
        console.error(
          'Error creating `location-0` in `ctrllr.beforeEach`!',
          err
        );
        return reject(err);
      }

      store.set('location-0', doc);
      return resolve(doc);
    });

    return promise;
  },

  // create `location-1`,
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const location = createLocation2();

    location.save((err, doc) => {
      if (err) {
        console.error(
          'Error creating `location-1` in `ctrllr.beforeEach`!',
          err
        );
        return reject(err);
      }

      store.set('location-1', doc);
      return resolve(doc);
    });

    return promise;
  },

  // create `location-2`,
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const location = createLocation3();

    location.save((err, doc) => {
      if (err) {
        console.error(
          'Error creating `location-2` in `ctrllr.beforeEach`!',
          err
        );
        return reject(err);
      }

      store.set('location-2', doc);
      return resolve(doc);
    });

    return promise;
  },

  // create `location-3`,
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const location = createLocation3();

    location.save((err, doc) => {
      if (err) {
        console.error(
          'Error creating `location-3` in `ctrllr.beforeEach`!',
          err
        );
        return reject(err);
      }

      store.set('location-3', doc);
      return resolve(doc);
    });

    return promise;
  },

  // create `location-4`,
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const location = createLocation4();

    location.save((err, doc) => {
      if (err) {
        console.error(
          'Error creating `location-4` in `ctrllr.beforeEach`!',
          err
        );
        return reject(err);
      }

      store.set('location-4', doc);
      return resolve(doc);
    });

    return promise;
  },

  // create `location-5`,
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const location = createLocation5();

    location.save((err, doc) => {
      if (err) {
        console.error(
          'Error creating `location-5` in `ctrllr.beforeEach`!',
          err
        );
        return reject(err);
      }

      store.set('location-5', doc);
      return resolve(doc);
    });

    return promise;
  },

  // create `vendor-0`,
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-0');
    const vendor = createVendor();

    vendor.save(err => {
      if (err) {
        console.error('Error creating `vendor-0` in `ctrllr.beforeEach`!', err);
        return reject(err);
      }

      user.vendor = vendor._id;
      user.save((err2, doc) => {
        if (err) {
          console.error(
            'Error creating `vendor-0` in `ctrllr.beforeEach`!',
            err2
          );
          return reject(err2);
        }

        store.set('user-0', doc);
        store.set('vendor-0', vendor);
        return resolve(doc);
      });
    });

    return promise;
  },

  // create `vendor-1`,
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-1');
    const vendor = createVendor();

    vendor.location = createLocation2();
    vendor.save(err => {
      if (err) {
        console.error('Error creating `vendor-1` in `ctrllr.beforeEach`!', err);
        return reject(err);
      }

      user.vendor = vendor._id;
      user.save((err2, doc) => {
        if (err) {
          console.error(
            'Error creating `vendor-1` in `ctrllr.beforeEach`!',
            err2
          );
          return reject(err2);
        }

        store.set('user-1', doc);
        store.set('vendor-1', vendor);
        return resolve(doc);
      });
    });

    return promise;
  },

  // create `vendor-2`,
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-2');
    const vendor = createVendor();

    vendor.location = createLocation4();
    vendor.save(err => {
      if (err) {
        console.error('Error creating `vendor-2` in `ctrllr.beforeEach`!', err);
        return reject(err);
      }

      user.vendor = vendor._id;
      user.save((err2, doc) => {
        if (err) {
          console.error(
            'Error creating `user-2` in `ctrllr.beforeEach`!',
            err2
          );
          return reject(err2);
        }

        store.set('user-2', doc);
        store.set('vendor-2', vendor);
        return resolve(doc);
      });
    });

    return promise;
  },

  // create `menu-0`,
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const vendor = store.get('vendor-0');
    const menu = createMenu();

    menu.vendor = vendor._id;
    menu.save((err, doc) => {
      if (err) {
        console.error('Error creating `menu-0` in `ctrllr.beforeEach`!', err);
        return reject(err);
      }

      vendor.menu = menu._id;
      vendor.save((err2, updatedVendor) => {
        if (err) {
          console.error(
            'Error creating `menu-0` in `ctrllr.beforeEach`!',
            err2
          );
          return reject(err2);
        }

        store.set('menu-0', doc);
        store.set('vendor-0', updatedVendor);
        return resolve(doc);
      });
    });

    return promise;
  },

  // create `menu-1`,
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const vendor = store.get('vendor-1');
    const menu = createMenu();

    menu.vendor = vendor;
    menu.save((err, doc) => {
      if (err) {
        console.error('Error creating `menu-1` in `ctrllr.beforeEach`!', err);
        return reject(err);
      }

      vendor.menu = menu._id;
      vendor.save((err2, updatedVendor) => {
        if (err) {
          console.error(
            'Error creating `menu-1` in `ctrllr.beforeEach`!',
            err2
          );
          return reject(err2);
        }

        store.set('menu-1', doc);
        store.set('vendor-1', updatedVendor);
        return resolve(doc);
      });
    });

    return promise;
  },

  // set `braintreeCustomerId` on `user-0`
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-0');

    user
      .generateBraintreeCustomerId()
      .then(updatedUser => {
        store.set('user-0', updatedUser);
        return resolve();
      })
      .catch(err => {
        console.error(
          'Error generating braintreeCustomerId for `user-0` in `ctrllr.beforeEach`!',
          err
        );

        return reject(err);
      });

    return promise;
  },

  // set `braintreeCustomerId` on `user-1`
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-1');

    user
      .generateBraintreeCustomerId()
      .then(updatedUser => {
        store.set('user-1', updatedUser);
        return resolve();
      })
      .catch(err => {
        console.error(
          'Error generating braintreeCustomerId for `user-1` in `ctrllr.beforeEach`!',
          err
        );

        return reject(err);
      });

    return promise;
  },

  // set `braintreeCustomerId` on `user-1`
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-1');

    user
      .generateBraintreeCustomerId()
      .then(updatedUser => {
        store.set('user-1', updatedUser);
        return resolve();
      })
      .catch(err => {
        console.error(
          'Error generating braintreeCustomerId for `user-1` in `ctrllr.beforeEach`!',
          err
        );

        return reject(err);
      });

    return promise;
  },

  // create `paymentMethod-0`, set `user-0` as creator, set as default
  ctrllr => {
    debug('creating `paymentMethod-0`');
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-0');
    const paymentMethod = createPaymentMethod();
    const token = $braintree.braintree.Test.Nonces.Transactable;

    paymentMethod.isDefault = true;
    configAndSavePaymentMethod(paymentMethod, token, user)
      .then(doc => {
        // save to data store, resolved async function
        store.set('paymentMethod-0', doc);
        return resolve(doc);
      })
      .catch(err => {
        error('Error creating `paymentMethod-0` in `ctrllr.beforeEach`!', err);
        return reject(err);
      });

    return promise;
  },

  // create `paymentMethod-1`, set `user-0` as creator
  ctrllr => {
    debug('creating `paymentMethod-1`');
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-0');
    const paymentMethod = createPaymentMethod();
    const token = $braintree.braintree.Test.Nonces.Transactable;

    configAndSavePaymentMethod(paymentMethod, token, user)
      .then(doc => {
        // save to data store, resolved async function
        store.set('paymentMethod-1', doc);
        return resolve(doc);
      })
      .catch(err => {
        error('Error creating `paymentMethod-1` in `ctrllr.beforeEach`!', err);
        return reject(err);
      });

    return promise;
  },

  // create `paymentMethod-2`, set `user-1` as creator, set as default
  ctrllr => {
    debug('creating `paymentMethod-2`');
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-1');
    const paymentMethod = createPaymentMethod();
    const token = $braintree.braintree.Test.Nonces.Transactable;

    paymentMethod.isDefault = true;
    configAndSavePaymentMethod(paymentMethod, token, user)
      .then(doc => {
        // save to data store, resolved async function
        store.set('paymentMethod-2', doc);
        return resolve(doc);
      })
      .catch(err => {
        error('Error creating `paymentMethod-2` in `ctrllr.beforeEach`!', err);
        return reject(err);
      });

    return promise;
  },

  // create `paymentMethod-3`, set `user-1` as creator
  ctrllr => {
    debug('creating `paymentMethod-3`');
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-1');
    const paymentMethod = createPaymentMethod();
    const token = $braintree.braintree.Test.Nonces.Transactable;

    configAndSavePaymentMethod(paymentMethod, token, user)
      .then(doc => {
        // save to data store, resolved async function
        store.set('paymentMethod-3', doc);
        return resolve(doc);
      })
      .catch(err => {
        error('Error creating `paymentMethod-3` in `ctrllr.beforeEach`!', err);
        return reject(err);
      });

    return promise;
  },

  // create `order-0`,
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-0');
    const vendor = store.get('vendor-1');
    const order = createOrder();

    order.creator = user;
    order.vendor = vendor;
    order.save((err, doc) => {
      if (err) {
        console.error(
          'Error creating `order-0` in `ctrllr.beforeEach`!',
          err
        );
        return reject(err);
      }

      store.set('order-0', doc);
      return resolve(doc);
    });

    return promise;
  },

  // create `order-1`,
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-0');
    const vendor = store.get('vendor-2');
    const order = createOrder();

    order.creator = user;
    order.vendor = vendor;
    order.type = 'delivery';
    order.save((err, doc) => {
      if (err) {
        console.error(
          'Error creating `order-1` in `ctrllr.beforeEach`!',
          err
        );
        return reject(err);
      }

      store.set('order-1', doc);
      return resolve(doc);
    });

    return promise;
  },

  // create `order-2`,
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-1');
    const vendor = store.get('vendor-1');
    const order = createOrder();

    order.creator = user;
    order.vendor = vendor;
    order.save((err, doc) => {
      if (err) {
        console.error(
          'Error creating `order-2` in `ctrllr.beforeEach`!',
          err
        );
        return reject(err);
      }

      store.set('order-2', doc);
      return resolve(doc);
    });

    return promise;
  },

  // create `order-3`,
  ctrllr => {
    const { promise, resolve, reject } = $q.defer();
    const store = ctrllr.getStore();
    const user = store.get('user-1');
    const vendor = store.get('vendor-2');
    const order = createOrder();

    order.creator = user;
    order.vendor = vendor;
    order.type = 'delivery';
    order.save((err, doc) => {
      if (err) {
        console.error(
          'Error creating `order-3` in `ctrllr.beforeEach`!',
          err
        );
        return reject(err);
      }

      store.set('order-3', doc);
      return resolve(doc);
    });

    return promise;
  }
];
