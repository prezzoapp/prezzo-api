// @flow
import type { $Request, $Response } from 'express';
import { ServerError, ForbiddenError } from 'alfred/core/errors';
import { debug, warn } from 'alfred/services/logger';
import { deferReject } from 'alfred/services/util';
import { makeDefault } from '../../models/paymentMethod';

module.exports = {
  description: 'Makes a payment method the default payment method for a user.',
  path: '/v1/payment-methods/:id/default',
  method: 'POST',
  validate(req) {
    const { paymentMethod } = req.data;
    const creator = (
      paymentMethod.creator._id || paymentMethod.creator
    ).toString();
    if (req.user._id.toString() !== creator) {
      return deferReject(
        new ForbiddenError(
          'You must be the creator of this payment method to access it.'
        )
      );
    }
  },
  async run(req: $Request, res: $Response) {
    try {
      debug('req.data', req.data, '');
      const paymentMethod = await req.data.paymentMethod.makeDefault();
      res.$end(paymentMethod);
    } catch (e) {
      warn('Failed to delete payment method.', e);
      res.$fail(new ServerError(e));
    }
  }
};
