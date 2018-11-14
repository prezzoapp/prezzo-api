// @flow
import $q from 'q';
import type { $Request, $Response } from 'express';
import { ServerError } from 'alfred/core/errors';
import { debug, warn } from 'alfred/services/logger';
import { deferResolve, deferReject } from 'alfred/services/util';
import { createTransaction } from '../../services/braintree';
import { changeOrderStatus } from '../../models/order';

module.exports = {
  description: 'Creates transaction.',
  path: '/v1/transaction',
  method: 'POST',
  config: {
    body: {
      order: {
        type: 'string',
        required: true
      },
      token: {
        type: 'string',
        required: true
      },
      amount: {
        type: 'number',
        required: true
      }
    }
  },
  async run(req: $Request, res: $Response) {
    try {
      const params = {};
      if(req.body && req.body.order) {
        params._id = req.body.order;
      }
      if(req.user && req.user.vendor) {
        params.vendor = req.user.vendor;
      }

      const result = await createTransaction(
        req.body.token,
        req.body.amount
      );

      debug("Req.Body", req.body, '');
      debug("Req.User", req.user, '');

      await changeOrderStatus(params, 'complete');

      res.$end(result);
    } catch (e) {
      warn('Failed to make transaction.', e);
      res.$fail(new ServerError(e));
    }
  }
};
