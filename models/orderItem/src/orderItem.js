// @flow
import mongoose from 'mongoose';
import MenuItem from '../../../models/menuItem';

const OrderItem = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  item: MenuItem.schema,
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'active', 'denied', 'complete'],
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  imageURLs: {
    type: [String],
    default: []
  }
});

module.exports = OrderItem;
