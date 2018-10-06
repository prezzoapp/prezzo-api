// @flow
import { getNumberInRange } from 'alfred/services/util';

import OrderItem from '../../models/orderItem';

const Order = require('../../services/mongo').registerModel(__dirname, 'Order');

export default Order;

export const createOrder = params =>
  new Order(
    Object.assign({}, params, {
      status: 'pending',
      readableIdentifier: getNumberInRange(1000, 9999),
      items: params.items.map(item => new OrderItem(item))
    })
  ).save();

export const listOrders = params => Order.find(params);
