// @flow
import mongoose from 'mongoose';

const MenuItem = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
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
  price: {
    type: Number,
    required: true
  },
  imageURLs: {
    type: [String],
    default: []
  }
});

module.exports = MenuItem;
