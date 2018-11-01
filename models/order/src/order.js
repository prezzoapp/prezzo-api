// @flow
import mongoose from 'mongoose';
import OrderItem from '../../../models/orderItem';

const { ObjectId } = mongoose.Schema.Types;
const STATUSES = ['pending', 'preparing', 'active', 'denied', 'complete'];
const Order = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  creator: {
    type: ObjectId,
    ref: 'User'
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
    enum: STATUSES,
    required: true
  },
  type: {
    type: String,
    enum: ['delivery', 'table'],
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
exports.STATUSES = STATUSES;
