// @flow
import $q from 'q';
import type { $Request, $Response } from 'express';
import { ServerError } from 'alfred/core/errors';
import { debug, warn } from 'alfred/services/logger';
import { deferResolve, deferReject } from 'alfred/services/util';
import { createTransaction } from '../../services/braintree';

module.exports = {
  description: 'Creates transaction.',
  path: '/v1/transaction',
  method: 'POST',
  config: {
    body: {
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
      debug('req.data', req.data, '');

      const result = await createTransaction(
        req.body.token,
        req.body.amount
      );

      debug("Transaction Result: ", result, '');

      res.$end(result);
    } catch (e) {
      warn('Failed to make transaction.', e);
      res.$fail(new ServerError(e));
    }
  }
};
