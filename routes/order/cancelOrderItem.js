// @flow
import type { $Request, $Response } from 'express';
import { isObjectId, extend } from 'alfred/services/util';
import { ForbiddenError } from 'alfred/core/errors';
import { debug, warn } from 'alfred/services/logger';
import $q from 'q';
import { checkStatusAndCancelItem } from '../../models/order';

module.exports = {
  description: 'Change order status.',
  path: '/v1/order/:orderId/item/:itemId',
  method: 'POST',
  config: {
    query: {
      status: {
        type: 'string',
        required: false,
        enum: ['pending', 'preparing', 'active', 'denied', 'complete']
      }
    }
  },
  async run(req: $Request, res: $Response) {
    const params = {};
    debug('Req.Params: ', req.params, '');
    if(req.params && req.params.orderid) {
      params._id = req.params.orderid;
    }

    if(req.params && req.params.itemid) {
      params['items._id'] = req.params.itemid;
    }

    params['items.status'] = 'pending';

    try {
      const { message, order } = await checkStatusAndCancelItem(params);

      res.$end({ message: message, order: order });
    } catch (e) {
      warn('Failed to cancel order item.', e);
      res.$fail(e);
    }
  }
};
