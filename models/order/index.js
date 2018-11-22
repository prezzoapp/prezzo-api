// @flow
import { getNumberInRange } from 'alfred/services/util';

import $q from 'q';

import { debug } from 'alfred/services/logger';

import { ServerError, ResourceNotFoundError } from 'alfred/core/errors';

import OrderItem from '../../models/orderItem';

const Order = require('../../services/mongo').registerModel(__dirname, 'Order');

export default Order;

export const createOrder = params => {
  return new Order(
    Object.assign({}, params, {
      status: 'pending',
      readableIdentifier: getNumberInRange(1000, 9999),
      items: params.items.map(item => new OrderItem(item))
    })
  ).save();
};

export const checkPendingOrders = (user, orderStatus) => {
  if(orderStatus === 'denied' || orderStatus === 'complete') {
    return Promise.resolve(null);
  }

  return Order.findOne({
    $and: [
      {
        creator: user._id,
        $or: [
          { status: 'pending' },
          { status: 'active' },
          { status: 'preparing' }
        ]
      }
    ]
  });
};

export function changeOrderStatus(params, status, makeInnerChanges) {
  const { promise, resolve, reject } = $q.defer();

  Order.findOneAndUpdate(
    { $and: [params] },
    {
      $set: {
        status
      }
    },
    {
      new: true
    }, (err, updatedOrder) => {
      if (err) {
        return reject(new Error("error while updating!"));
      } else if (!updatedOrder) {
        return reject(new Error('no updated order found'));
      }

      if(makeInnerChanges) {
        updatedOrder.items.map(item => {
          if(item.status === 'pending') {
            item.status = 'denied';
          } else if(item.status !== 'pending' || item.status !== 'denied') {
            item.status = 'complete';
          }
        });

        updatedOrder.save();
      }

      return resolve(null);
    }
  );

  return promise;
}

export const listOrders = (params, page) => {
  const limit = 1;
  const { promise, resolve, reject } = $q.defer();

  Order.find(params).skip((page === 0) ? 0 : limit*(page-1)).limit((page === 0) ? 0 : limit).sort({ createdDate: -1 }).populate('creator').populate('paymentMethod').exec((err, orders) => {
    if(err) {
      return reject(new ServerError(err));
    }
    return resolve(orders);
  });

  return promise;
}

export const checkStatusAndCancelItem = params => {
  const { promise, resolve, reject } = $q.defer();
  debug("Params: ", params, '');

  Order.find({ $and: [params] }).populate('creator').populate('paymentMethod').exec((err, order) => {
    if(err) {
      return reject(new ServerError(err));
    }
    if(order.length !== 0) {
      const itemIndex = order[0].items.findIndex(item => item._id.toString() === params['items._id']);
      if(itemIndex !== -1) {
        order[0].items[itemIndex].status = 'denied';
        order[0].save();
      }
      return resolve({
        message: "Your item has been successfully deleted.",
        order: order
      });
    }
    delete params['items.status'];
    Order.find({ $and: [params] }, (err, result) => {
      if(err) {
        return reject(new ServerError(err))
      }
      return resolve({
        message: "You can't delete this item.",
        order: result
      });
    });
  });
  return promise;
};

export const checkOrderStatus = (params, status) => {
  const { promise, resolve, reject } = $q.defer();

  Order.find(params).populate('creator').populate('paymentMethod').exec((err, order) => {
    if(order.status === 'complete') {
      return resolve({
        message: "This order has been already completed.",
        order: order
      });
    } else {
      return resolve({
        message: 'Are you sure you want to process payment?',
        order: order
      });
    }
  });

  return promise;
}
