// @flow
import mongoose from 'mongoose';
import Location from '../../../models/location';
import HoursOfOperation from '../../../models/hoursOfOperation';
import categories from '../config/categories';

const Vendor = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  categories: [
    {
      type: String,
      enum: categories
    }
  ],
  avatarURL: {
    type: String,
    trim: true
  },
  hours: [HoursOfOperation.schema],
  location: Location.schema,
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    required: true
  }
});

module.exports = Vendor;
