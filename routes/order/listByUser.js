// @flow
import type { $Request, $Response } from 'express';
import { ServerError } from 'alfred/core/errors';
import { warn, debug } from 'alfred/services/logger';
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
      },
      status: {
        type: 'string'
      }
    }
  },
  async run(req: $Request, res: $Response) {
    try {
      let params = { creator: req.user._id };

      if (req.query && req.query.type) {
        params.type = req.query.type;
      }

      if(req.query && req.query.status) {
        if(req.query.status === 'pending' || req.query.status === 'preparing' || req.query.status === 'active')
          params.status = {$in: ['pending', 'preparing', 'active']};
      }

      debug("Params: ", params, '');

      const orders = await listOrders(params);
      res.$end({ order: orders });
    } catch (e) {
      warn('Failed to create order.', e);
      res.$fail(new ServerError(e));
    }
  }
};
