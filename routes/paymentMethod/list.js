// @flow
import type { $Request, $Response } from 'express';
import { ServerError } from 'alfred/core/errors';
import { warn } from 'alfred/services/logger';
import { listPaymentMethods } from '../../models/paymentMethod';

module.exports = {
  description: 'Lists a users payment methods.',
  path: '/v1/payment-methods',
  method: 'GET',
  async run(req: $Request, res: $Response) {
    try {
      const paymentMethods = await listPaymentMethods({
        creator: req.user
      });
      
      res.$end(paymentMethods);
    } catch (e) {
      warn('Failed to create payment method.', e);
      res.$fail(new ServerError(e));
    }
  }
};
