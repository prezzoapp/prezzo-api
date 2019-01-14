// @flow
import mongoose from 'mongoose';
import Session from '../../../models/session';

const { ObjectId } = mongoose.Schema.Types;
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
  braintreeCustomerId: {
    type: String
  },
  isSubscribedToPromotions: {
    type: Boolean,
    default: true
  },
  sessions: [Session.schema],
  vendor: {
    type: ObjectId,
    ref: 'Vendor'
  },
  deviceId: {
    type: ['string'],
    default: []
  }
});

module.exports = User;
