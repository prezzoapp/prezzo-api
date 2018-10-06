// @flow
import type { $Request, $Response } from 'express';
import { isObjectId } from 'alfred/services/util';
import { ServerError } from 'alfred/core/errors';
import { debug, warn } from 'alfred/services/logger';
import { createOrder } from '../../models/order';

module.exports = {
  description: 'Creates an order.',
  path: '/v1/orders',
  method: 'POST',
  config: {
    body: {
      items: {
        required: true,
        isArray: true,
        validate: items => {
          let item;
          for (let i = 0, len = items.length; i < len; i += 1) {
            item = items[i];
            if (!item.title || !item.price) {
              return false;
            }
          }

          return true;
        }
      },
      type: {
        type: 'string',
        required: true,
        enum: ['delivery', 'table']
      },
      paymentType: {
        type: 'string',
        required: true,
        enum: ['cash']
      },
      vendor: {
        type: 'string',
        required: true,
        validate: isObjectId
      },
      paymentMethod: {
        type: 'string',
        validate: isObjectId
      }
    }
  },
  async run(req: $Request, res: $Response) {
    try {
      debug('req.data', req.data, '');
      const order = await createOrder(
        Object.assign({}, req.body, {
          creator: req.user
        })
      );
      res.$end(order);
    } catch (e) {
      warn('Failed to create order.', e);
      res.$fail(new ServerError(e));
    }
  }
};
