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
      changeInnerItemsStatus: {
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
      const result = await changeOrderStatus(params, req.body.status, req.body.changeInnerItemsStatus);

      const picked = (({ res_code, res_message }) => ({ res_code, res_message }))(result);
      res.set(picked);
      res.$end(result.response);
    } catch (e) {
      warn('Failed to Change Order Status.', e);
      res.$fail(e);
    }
  }
};
