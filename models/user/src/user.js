// @flow
import mongoose from 'mongoose';

const Session = require('../../../models/session').schema;

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
  isSubscribedToPromotions: {
    type: Boolean,
    default: true
  },
  sessions: [Session]
});

module.exports = User;
