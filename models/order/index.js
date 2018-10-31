// @flow
import { getNumberInRange } from 'alfred/services/util';

import $q from 'q';

import { debug } from 'alfred/services/logger';

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

export function approveDenyOrder(orderId, vendorId, status) {
  const { promise, resolve, reject } = $q.defer();

  Order.findOneAndUpdate(
    { $and: [{ _id: orderId, vendor: vendorId }] },
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
      return resolve(Order.find({ vendor: vendorId }));
    }
  );

  return promise;
}

export const listOrders = params => Order.find(params);
