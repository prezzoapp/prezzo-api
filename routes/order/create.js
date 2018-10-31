// @flow
import type { $Request, $Response } from 'express';
import { isObjectId, extend } from 'alfred/services/util';
import { ForbiddenError } from 'alfred/core/errors';
import { debug, warn } from 'alfred/services/logger';
import $q from 'q';
import { createOrder, checkPendingOrders } from '../../models/order';

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
      status: {
        type: 'string',
        required: true
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
  validate: [
    req => {
      const { promise, resolve, reject } = $q.defer();
      const { user } = req;
      const { status } = req.body;

      checkPendingOrders(user, status).then(result => {
        if (result) {
          reject(new ForbiddenError('You already have an open order.'));
        }
        resolve();
      });

      return promise;
    }
  ],
  async run(req: $Request, res: $Response) {
    try {
      const order = await createOrder(
        extend({}, req.body, {
          creator: req.user
        })
      );

      debug('order: ', order, '');
      res.$end(order);
    } catch (e) {
      warn('Failed to create order.', e);
      res.$fail(e);
    }
  }
};
