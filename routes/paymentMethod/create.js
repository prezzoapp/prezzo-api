// @flow
import $q from 'q';
import type { $Request, $Response } from 'express';
import { ServerError } from 'alfred/core/errors';
import { debug, warn } from 'alfred/services/logger';
import { deferResolve, deferReject } from 'alfred/services/util';
import { createPaymentMethod as createBraintreePaymentMethod } from '../../services/braintree';
import { createPaymentMethod, makeDefault } from '../../models/paymentMethod';

module.exports = {
  description: 'Creates a payment method.',
  path: '/v1/payment-methods',
  method: 'POST',
  config: {
    body: {
      isDefault: {
        type: 'boolean'
      },
      nonce: {
        type: 'string',
        required: true
      }
    }
  },
  transform(req) {
    debug('transform', req.data, '');

    const { promise, resolve, reject } = $q.defer();
    const user = req.user;
    if (user.braintreeCustomerId) {
      req.data.braintreeCustomerId = user.braintreeCustomerId;
      resolve();
      return promise;
    }

    debug('about to generate braintree customer id');

    user
      .generateBraintreeCustomerId()
      .then(updatedUser => {
        debug(
          'updated req.user',
          updatedUser.braintreeCustomerId,
          req.data,
          ''
        );
        req.data.braintreeCustomerId = updatedUser.braintreeCustomerId;
        resolve(null);
      })
      .catch(reject);

    return promise;
  },
  async run(req: $Request, res: $Response) {
    try {
      debug('req.data', req.data, '');

      // create payment method on braintree's server
      const { braintreeCustomerId } = req.data;
      const { nonce } = req.body;

      debug(
        'creating braintree payment method',
        braintreeCustomerId,
        nonce,
        ''
      );

      const data = await createBraintreePaymentMethod(
        braintreeCustomerId,
        nonce
      );

      debug('got braintree payment method', data, '');

      // save data in database
      const creator = req.user._id;
      const params = {
        creator,
        isDefault: req.body.isDefault === true,
        token: data.paymentMethod.token
      };

      const paymentMethod = await createPaymentMethod(params, data, req.user);

      // make this card the default credit card
      // sets `isDefault` on all of the user's cards to false
      // sets `isDefault` to this card to true if set to false
      if (req.body && req.body.isDefault === true) {
        await paymentMethod.makeDefault();
      }

      // return new payment method info to client
      res.$end(paymentMethod);
    } catch (e) {
      warn('Failed to create payment method.', e);
      res.$fail(new ServerError(e));
    }
  }
};
