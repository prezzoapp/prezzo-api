// @flow
import mongoose from 'mongoose';

const HoursOfOperation = new mongoose.Schema({
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  openTimeHour: {
    type: Number,
    required: true,
    min: 0,
    max: 23
  },
  openTimeMinutes: {
    type: Number,
    required: true,
    min: 0,
    max: 59
  },
  closeTimeHour: {
    type: Number,
    required: true,
    min: 0,
    max: 23
  },
  closeTimeMinutes: {
    type: Number,
    required: true,
    min: 0,
    max: 59
  }
});

module.exports = HoursOfOperation;
