// @flow

import $q from 'q';
import braintree from 'braintree';
import { ServerError } from 'alfred/core/errors';
import { debug, error } from 'alfred/services/logger';
import { extend } from 'alfred/services/util';
import configLoader from 'alfred/services/configLoader';

const config = {};
let gateway;

const initialize = async () => {
  await configLoader.init();
  const braintreeConfig = configLoader.get('braintree');

  config.merchantAccountId = braintreeConfig.BT_MERCHANT_ACCOUNT_ID;
  config.merchantId = braintreeConfig.BT_MERCHANT_ID;
  config.publicKey = braintreeConfig.BT_PUBLIC_KEY;
  config.privateKey = braintreeConfig.BT_PRIVATE_KEY;
  config.CSEKey = braintreeConfig.BT_CSE_KEY;

  if (
    braintreeConfig.BT_IS_PRODUCTION &&
    braintreeConfig.BT_IS_PRODUCTION === 'true'
  ) {
    config.environment = braintree.Environment.Production;
  } else {
    config.environment = braintree.Environment.Sandbox;
  }

  gateway = braintree.connect(config);
};

/**
 * returns the braintree configuration
 * @return {Object}
 */
const getConfig = () => config;

/**
 * creates a braintree customer from a user, saves to user model
 * @param user {User} mongoose User instance
 */
// const createCustomer = user => {
//   const { promise, resolve, reject } = $q.defer();
//   const customerConfig = {};
//
//   if (user && (user.firstName || user.name)) {
//     customerConfig.firstName = user.firstName || user.name;
//   }
//   if (user && user.lastName) customerConfig.lastName = user.lastName;
//   if (user && user.email) customerConfig.email = user.email;
//   if (user && user.phone) customerConfig.phone = user.phone;
//
//   gateway.customer.create(customerConfig, (err, result) => {
//     if (err) {
//       return reject(new ServerError(err));
//     }
//
//     return resolve(result);
//   });
//
//   return promise;
// };

/**
 * creates a braintree customer from a user, saves to user model
 * @param user {User} mongoose User instance
 */
const createCustomer = user =>
  new Promise((resolve, reject) => {
    const customerConfig = {};

    if (user && (user.firstName || user.name)) {
      customerConfig.firstName = user.firstName || user.name;
    }
    if (user && user.lastName) customerConfig.lastName = user.lastName;
    if (user && user.email) customerConfig.email = user.email;
    if (user && user.phone) customerConfig.phone = user.phone;

    gateway.customer.create(customerConfig, (err, result) => {
      if (err) {
        return reject(new ServerError(err));
      }

      return resolve(result);
    });
  });

/**
 * generates a token for creating a payment method
 * @param customerId
 * @returns {$q.promise}
 */
const generateToken = customerId => {
  const { promise, resolve, reject } = $q.defer();
  const params = {};

  if (customerId) {
    params.customerId = customerId;
  }

  gateway.clientToken.generate(params, (err, response) => {
    if (err) {
      return reject(new ServerError(err));
    } else if (!response || !response.clientToken) {
      return reject(new ServerError('Error generating payment token.'));
    }

    return resolve(response.clientToken);
  });

  return promise;
};

/**
 * used to create a payment method from a nonce & register to a user
 * @param customerId {String} customer id that the payment method belongs to
 * @param paymentMethodNonce {String} token for the payment method
 */
const createPaymentMethod = async (customerId, paymentMethodNonce) =>
  new Promise((resolve, reject) => {
    const params = {
      customerId,
      paymentMethodNonce
    };

    gateway.paymentMethod.create(params, (err, result) => {
      if (err) {
        error('Error creating payment method.', err, '');
        return reject(new ServerError(err));
      } else if (!result.success) {
        error('Failed to create payment method.', result, '');
        return reject(new ServerError('Error creating payment method.'));
      }

      return resolve(result);
    });
  });

/**
 * used to find a payment method by its token
 * @param braintreeToken {String} token of the payment method to find
 */
const findPaymentMethod = braintreeToken => {
  const { promise, resolve, reject } = $q.defer();

  gateway.paymentMethod.find(braintreeToken, (err, result) => {
    if (err) {
      return reject(new ServerError(err));
    }

    return resolve(result);
  });

  return promise;
};

/**
 * used to delete a payment method token
 * @param braintreeToken {String} token of the payment method to remove
 */
const deletePaymentMethod = braintreeToken => {
  const { promise, resolve, reject } = $q.defer();

  gateway.paymentMethod.delete(braintreeToken, err => {
    if (err) {
      error('Error deleting payment method.', err);
      return reject(new ServerError(err));
    }

    return resolve(true);
  });

  return promise;
};

/**
 * bills a payment method (card, paypal, etc) by the select amount
 * @param paymentMethodToken {String} the token of the payment method to bill
 * @param amount {Number} the amount to bill
 */
const createTransaction = (paymentMethodToken, amount, options) => {
  const { promise, resolve, reject } = $q.defer();
  const defaults = {
    paymentMethodToken,
    amount,
    options: {
      submitForSettlement: true
    }
  };
  const params = extend(defaults, options);

  gateway.transaction.sale(params, (err, result) => {
    if (err) {
      return reject(new ServerError(err));
    } else if (!result.success) {
      return reject(new ServerError(result));
    }

    return resolve(result.transaction);
  });

  return promise;
};

/**
 * creates a merchant account
 * @param user {User} mongoose user to make a merchant
 * @param options {Object} configuration for the merchant account
 * @return {$q.promise}
 */
const createMerchant = (user, options) => {
  const { promise, resolve, reject } = $q.defer();
  const defaults = {
    // id: user._id,
    tosAccepted: true,
    masterMerchantAccountId: config.merchantAccountId
  };
  const params = extend(defaults, options);

  gateway.merchantAccount.create(params, (err, response) => {
    if (err) {
      return reject(new ServerError(err));
    } else if (response.errors) {
      return reject(
        new ServerError(response.message || response.errors || response)
      );
    } else if (!response.success || !response.merchantAccount) {
      return reject(new ServerError(response));
    }

    return resolve(response);
  });

  return promise;
};

/**
 * releases funds from escrow
 * @param transactionId {String} id of the transaction
 * @return {$q.promise}
 */
const releaseEscrow = transactionId => {
  debug('releasing funds from escrow', transactionId);
  const { promise, resolve, reject } = $q.defer();

  gateway.transaction.releaseFromEscrow(transactionId, (err, result) => {
    if (err) {
      return reject(new ServerError(err));
    } else if (result.errors) {
      return reject(new ServerError(result.message || result.errors || result));
    } else if (!result.success || !result.merchantAccount) {
      return reject(new ServerError(result));
    }

    return resolve(result);
  });

  return promise;
};

/**
 * gets the status of a transaction
 * @param transactionId {String}
 * @return {$q.promise}
 */
const getTransactionStatus = transactionId => {
  const { promise, resolve, reject } = $q.defer();

  gateway.transaction.find(transactionId, (err, transaction) => {
    if (err) {
      return reject(new ServerError(err));
    }

    return resolve(transaction.escrowStatus);
  });

  return promise;
};

/**
 * used to verify ownership of a domain via an inbound webhook from Braintree
 * @param challenge {String}
 * @return {*}
 */
const verifyWebhook = challenge => {
  debug('verifying webhook', challenge);
  return gateway.webhookNotification.verify(challenge);
};

/**
 * used to parse an incoming webhook from Braintree
 * @param signature
 * @param payload
 */
const parseWebhook = (signature, payload) => {
  const { promise, resolve, reject } = $q.defer();

  gateway.webhookNotification.parse(
    signature,
    payload,
    (err, webhookNotification) => {
      if (err) {
        return reject(new ServerError(err));
      }

      return resolve(webhookNotification);
    }
  );

  return promise;
};

/**
 * creates a sample webhook for testing purposes
 * @param kind {String} the type of webhook
 * @param id {String} the id of the target object
 * @return {WebhookNotification}
 */
const createSampleWebhook = (kind, id) =>
  gateway.webhookTesting.sampleNotification(kind, id);

initialize();

export {
  braintree,
  getConfig,
  createCustomer,
  generateToken,
  createPaymentMethod,
  findPaymentMethod,
  deletePaymentMethod,
  createTransaction,
  createMerchant,
  releaseEscrow,
  getTransactionStatus,
  verifyWebhook,
  parseWebhook,
  createSampleWebhook
};
