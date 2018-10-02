// @flow
import mongoose from 'mongoose';
import OrderItem from '../../../models/orderItem';

const { ObjectId } = mongoose.Schema.Types;
const Order = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  creator: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  vendor: {
    type: ObjectId,
    ref: 'Vendor',
    required: true
  },
  readableIdentifier: {
    type: String,
    unique: true,
    required: true
  },
  items: [OrderItem.schema],
  status: {
    type: String,
    enum: ['pending', 'preparing', 'active', 'denied', 'complete'],
    required: true
  },
  orderType: {
    type: String,
    enum: ['deliver', 'table'],
    required: true
  },
  paymentType: {
    type: String,
    enum: ['card', 'cash'],
    required: true
  },
  paymentMethod: {
    type: ObjectId,
    ref: 'PaymentMethod'
  }
});

module.exports = Order;
