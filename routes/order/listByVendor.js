// @flow
import type { $Request, $Response } from 'express';
import { ServerError } from 'alfred/core/errors';
import { warn } from 'alfred/services/logger';
import { listOrders } from '../../models/order';
import { STATUSES } from '../../models/order/src/order';

module.exports = {
  description: 'Returns a vendors orders.',
  path: '/v1/vendors/:id/orders',
  method: 'GET',
  config: {
    query: {
      type: {
        type: 'string',
        enum: ['delivery', 'table']
      },
      status: {
        type: 'string',
        enum: STATUSES
      }
    }
  },
  async run(req: $Request, res: $Response) {
    try {
      const params = { vendor: req.params.id };

      if (req.query && req.query.type) {
        params.type = req.query.type;
      }

      if (req.query && req.query.status) {
        params.status = req.query.status;
      }

      const orders = await listOrders(params);
      res.$end(orders);
    } catch (e) {
      warn('Failed to create order.', e);
      res.$fail(new ServerError(e));
    }
  }
};
