// @flow
import type { $Request, $Response } from 'express';
import { ForbiddenError } from 'alfred/core/errors';
import { debug, warn } from 'alfred/services/logger';
import { checkOrderStatus } from '../../models/order';

module.exports = {
  description: 'Change order status.',
  path: '/v1/order/:id',
  method: 'GET',
  config: {
    query: {
      status: {
        type: 'string',
        required: true,
        enum: ['pending', 'active', 'denied', 'complete']
      }
    }
  },
  async run(req: $Request, res: $Response) {
    const params = {};
    if(req.params && req.params.id) {
      params._id = req.params.id;
    }

    try {
      const order = await checkOrderStatus(params, req.query.status);

      res.$end(order);
    } catch (e) {
      warn('Failed to create order.', e);
      res.$fail(e);
    }
  }
};
