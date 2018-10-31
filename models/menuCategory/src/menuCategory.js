// @flow
import mongoose from 'mongoose';
import MenuItem from '../../../models/menuItem';

const MenuCategory = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  items: {
    type: [MenuItem.schema],
    default: []
  }
});

module.exports = MenuCategory;
