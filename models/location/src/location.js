// @flow
import mongoose from 'mongoose';

const Location = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  coordinates: {
    type: [Number], // [<longitude>,<latitude>]
    index: '2dsphere',
    required: true
  },
  name: {
    type: String
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  region: {
    type: String
  },
  regionShort: {
    type: String
  },
  postalCode: {
    type: String
  },
  country: {
    type: String
  },
  countryShort: {
    type: String
  }
});

module.exports = Location;
