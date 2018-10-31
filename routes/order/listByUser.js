// @flow
import type { $Request, $Response } from 'express';
import { ServerError } from 'alfred/core/errors';
import { warn } from 'alfred/services/logger';
import { listOrders } from '../../models/order';

module.exports = {
  description: 'Returns a users orders.',
  path: '/v1/users/:id/orders',
  method: 'GET',
  config: {
    query: {
      type: {
        type: 'string',
        enum: ['delivery', 'table']
      }
    }
  },
  async run(req: $Request, res: $Response) {
    try {
      const params = { creator: req.user };

      if (req.query && req.query.type) {
        params.type = req.query.type;
      }

      const orders = await listOrders(params);
      res.$end(orders);
    } catch (e) {
      warn('Failed to create order.', e);
      res.$fail(new ServerError(e));
    }
  }
};
