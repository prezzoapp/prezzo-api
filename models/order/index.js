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

export const checkPendingOrders = user => {
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

function changeOrderStatusCommon(status, order) {
  const { promise, resolve, reject } = $q.defer();
  if(
    (status === 'active' && order.status === 'active') ||
    (status === 'denied' && order.status === 'active')
  ) {
    return resolve({ res_code: 206, res_message: 'Already activated!', response: order });
  } else if(
      (status === 'active' && order.status === 'denied') ||
      (status === 'denied' && order.status === 'denied') ||
      (status === 'complete' && order.status === 'denied')
    ) {
    return resolve({ res_code: 206, res_message: 'Already denied!', response: order });
  } else if(
      (status === 'active' && order.status === 'complete') ||
      (status === 'denied' && order.status === 'complete') ||
      (status === 'complete' && order.status === 'complete')
    ) {
    return resolve({ res_code: 206, res_message: 'Already completed!', response: order });
  } else {
    order.status = status;
    order.save().then(() => {
      return resolve({ res_code: 200, res_message: 'Success!', response: order });
    })
    .catch(err => {
      return reject(new ServerError(err));
    });
  }

  return promise;
};

export function changeOrderStatus(params, status, changeInnerItemsStatus) {
  const { promise, resolve, reject } = $q.defer();

  Order.findOne({ $and: [params] }).populate('creator paymentMethod').exec((err, order) => {
    if(err) {
      reject(new ServerError(err));
    }

    if(!order) {
      resolve({ res_code: 204, res_message: 'Not found!', response: order });
    }

    if(changeInnerItemsStatus) {
      order.items.map(item => {
        if(item.status === 'pending') {
          item.status = 'denied';
        } else if(item.status !== 'pending' && item.status !== 'denied') {
          item.status = 'complete';
        }
      });

      order.save().then(() => {
        resolve(changeOrderStatusCommon(status, order));
      })
      .catch(err => {
        reject(new ServerError(err));
      });
    } else {
      resolve(changeOrderStatusCommon(status, order));
    }
  });
  return promise;
};

export const listOrders = (params) => {
  const limit = 10;
  const { promise, resolve, reject } = $q.defer();

  debug('Params: ', params);

  Order.find(params).limit(limit).sort({ createdDate: -1 }).populate('creator paymentMethod').exec((err, orders) => {
    if(err) {
      return reject(new ServerError(err));
    }

    if(orders.length === 0) {
      return resolve({ res_code: 204, res_message: 'No items found!', response: orders });
    }

    return resolve({ res_code: 200, res_message: '', response: orders });
  });

  return promise;
}

export const checkStatusAndCancelItem = params => {
  const { promise, resolve, reject } = $q.defer();

  Order.find(params).populate('creator paymentMethod').exec((err, order) => {
    if(err) {
      return reject(new ServerError(err));
    }
    if(order.length !== 0) {
      const itemIndex = order[0].items.findIndex(item => item._id.toString() === params['items._id']);
      if(itemIndex !== -1 && order[0].items[itemIndex].status === 'pending') {
        order[0].items[itemIndex].status = 'denied';
        order[0].save().then(() => {
          const isAllItemsCompleted = !order[0].items.some(el => el.status !== 'complete');
          const isAllItemsDenied = !order[0].items.some(el => el.status !== 'denied');

          debug('isAllItemsCompleted', isAllItemsCompleted, '');
          debug('isAllItemsDenied', isAllItemsDenied, '');

          if(isAllItemsCompleted || isAllItemsDenied) {
            order[0].status = 'complete';
            order[0].save().then(() => {
              return resolve(order);
            })
            .catch(err => {
              return reject(new ServerError(err));
            });
          } else {
            return resolve(order);
          }
        })
        .catch(err => {
          return reject(new ServerError(err));
        });
      } else {
        return resolve(order);
      }
    }
  });
  return promise;
};

export const checkOrderStatus = (params, status) => {
  const { promise, resolve, reject } = $q.defer();

  Order.find(params).populate('creator paymentMethod').exec((err, order) => {
    if(err) {
      return reject(new ServerError(err));
    }
    if(order.length === 0) {
      return resolve({ res_code: 204, res_message: 'No item found!', response: order });
    }
    if(status === 'complete' && order[0].status === 'complete') {
      return resolve({ res_code: 206, res_message: 'Already completed!', response: order });
    } else if(status === 'complete' && order[0].status === 'denied') {
      return resolve({ res_code: 206, res_message: 'Already denied!', response: order });
    } else {
      return resolve({ res_code: 200, res_message: '', response: order });
    }
  });

  return promise;
}
