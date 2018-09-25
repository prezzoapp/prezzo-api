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
        isDefault: true,
        token: data.paymentMethod.token
      };

      // get the card type
      if (data.creditCard) {
        params.type = `braintree-${(
          data.creditCard.cardType || 'card'
        ).toLowerCase()}`;
        params.readableIdentifier =
          data.creditCard.last4 ||
          data.creditCard.lastFour ||
          data.creditCard.maskedNumber;
      } else if (data.paypalAccount) {
        params.type = 'braintree-paypal';
        params.readableIdentifier = `braintree-${(
          data.paypalAccount.email ||
          data.paymentMethod.email ||
          req.user.email
        ).toLowerCase()}`;
      } else {
        throw new ServerError('Unknown card type.');
      }

      const paymentMethod = await createPaymentMethod(params);

      // make this card the default credit card
      // sets `isDefault` on all of the user's cards to false
      // sets `isDefault` to this card to true if set to false
      await paymentMethod.makeDefault();

      // return new payment method info to client
      res.$end(paymentMethod);
    } catch (e) {
      warn('Failed to create payment method.', e);
      res.$fail(new ServerError(e));
    }
  }
};
