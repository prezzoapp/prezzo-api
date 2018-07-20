// @flow
import mongoose from 'mongoose';
import MenuCategory from '../../../models/menuCategory';

const { ObjectId } = mongoose.Schema.Types;
const Menu = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  categories: [MenuCategory.schema],
  vendor: {
    type: ObjectId,
    ref: 'Menu',
    required: true
  }
});

module.exports = Menu;
