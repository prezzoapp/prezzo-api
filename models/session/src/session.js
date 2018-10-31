// @flow
import mongoose from 'mongoose';

const Session = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    required: true,
    lowercase: true,
    enum: ['ios', 'android', 'web']
  },
  pushToken: {
    type: String
  }
});

module.exports = Session;
