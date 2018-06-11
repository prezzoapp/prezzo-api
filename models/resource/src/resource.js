// @flow
import mongoose from 'mongoose';
import File from '../../../models/file';

const { ObjectId } = mongoose.Schema.Types;

const Resource = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  creator: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String
  },
  type: {
    type: String,
    enum: ['userAvatar'],
    default: 'userAvatar',
    required: true
  },
  files: {
    type: [File.schema],
    default: []
  }
});

module.exports = Resource;
