// @flow
import mongoose from 'mongoose';

import Session from '../../../models/session';
import Vendor from '../../../models/vendor';

const User = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    sparse: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true
  },
  facebookToken: {
    type: String
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  avatarURL: {
    type: String
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  zip: {
    type: String
  },
  city: {
    type: String
  },
  isSubscribedToPromotions: {
    type: Boolean,
    default: true
  },
  sessions: [Session.schema],
  vendor: Vendor.schema
});

module.exports = User;
