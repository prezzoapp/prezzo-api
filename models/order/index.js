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

export function changeOrderStatus(params, status) {
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
      return resolve(null);
    }
  );
}

export const listOrders = params => {
  const { promise, resolve, reject } = $q.defer();

  Order.find(params).populate('creator').populate('paymentMethod').exec((err, orders) => {
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
      return resolve(order);
    }
    delete params['items.status'];
    return resolve(Order.find({ $and: [params] }));
  });
  return promise;
};
