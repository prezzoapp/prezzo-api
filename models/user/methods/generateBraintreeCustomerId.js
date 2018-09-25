// @flow
import { ServerError } from 'alfred/core/errors';
import { debug } from 'alfred/services/logger';
import { createCustomer } from '../../../services/braintree';

module.exports = {
  name: 'generateBraintreeCustomerId',
  run() {
    const user = this;

    return new Promise(async (resolve, reject) => {
      if (user.braintreeCustomerId) {
        debug('user has braintreeCustomerId', user.braintreeCustomerId, '');
        return resolve(user);
      }

      debug('about to create customer');

      // create customer on braintree's server
      const customer = await createCustomer(user);
      debug('customer', customer);
      user.braintreeCustomerId = customer.customer.id;

      // save reference to customer id in database
      user.save((err, updatedUser) => {
        if (err) {
          return reject(new ServerError(err));
        }

        resolve(updatedUser);
      });
    });
  }
};
