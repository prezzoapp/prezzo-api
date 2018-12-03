// @flow
import type { $Request, $Response } from 'express';
import { isObjectId, extend } from 'alfred/services/util';
import { ForbiddenError } from 'alfred/core/errors';
import { debug, warn } from 'alfred/services/logger';
import $q from 'q';
import { changeOrderStatus } from '../../models/order';

module.exports = {
  description: 'Change order status.',
  path: '/v1/orders/:id',
  method: 'POST',
  config: {
    body: {
      status: {
        type: 'string',
        required: true,
        enum: ['pending', 'active', 'denied', 'complete']
      },
      makeInnerChanges: {
        type: 'boolean',
        default: false
      }
    }
  },
  // validate: [
  //   req => {
  //     const { promise, resolve, reject } = $q.defer();
  //     const { user } = req;
  //     const { status } = req.body;
  //
  //     checkPendingOrders(user, status).then(result => {
  //       if (result) {
  //         reject(new ForbiddenError('You already have an open order.'));
  //       }
  //       resolve();
  //     });
  //
  //     return promise;
  //   }
  // ],
  async run(req: $Request, res: $Response) {
    const params = {};
    if(req.params && req.params.id) {
      params._id = req.params.id;
    }
    if(req.user && req.user.vendor) {
      params.vendor = req.user.vendor;
    }

    try {
      const updatedOrder = await changeOrderStatus(params, req.body.status);

      res.$end(updatedOrder);
    } catch (e) {
      warn('Failed to create order.', e);
      res.$fail(e);
    }
  }
};
