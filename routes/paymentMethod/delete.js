// @flow
import $q from 'q';
import type { $Request, $Response } from 'express';
import { ServerError, ForbiddenError } from 'alfred/core/errors';
import { debug, warn } from 'alfred/services/logger';
import { getValueForURLParam, deferReject } from 'alfred/services/util';
import { deletePaymentMethod } from '../../models/paymentMethod';

module.exports = {
  description: 'Deletes a payment method.',
  path: '/v1/payment-methods/:id',
  method: 'DELETE',
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
      await deletePaymentMethod(req.data.paymentMethod);
      res.$end();
    } catch (e) {
      warn('Failed to delete payment method.', e);
      res.$fail(new ServerError(e));
    }
  }
};
