// @flow
import $q from 'q';
import type { $Request, $Response } from 'express';
import { ServerError } from 'alfred/core/errors';
import { debug, warn } from 'alfred/services/logger';
import { generateClientToken } from '../../services/braintree';

module.exports = {
  description: 'Generates a token for creating a payment method.',
  path: '/v1/self/payment-token',
  method: 'GET',
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

      // get the user's braintree customer id to create a nonce
      const { braintreeCustomerId } = req.data;
      const token = await generateClientToken(braintreeCustomerId);

      res.$end({ token });
    } catch (e) {
      warn('Failed to create payment method.', e);
      res.$fail(new ServerError(e));
    }
  }
};
