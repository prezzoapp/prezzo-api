// @flow
import mongoose from 'mongoose';
import MenuItem from '../../../models/menuItem';

const OrderItem = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  item: MenuItem.schema,
  notes: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  imageURLs: {
    type: [String],
    default: []
  }
});

module.exports = OrderItem;
