import mongoose from 'mongoose';
import mime from '../config/mime';

const File = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  meta: {
    type: mongoose.Schema.Types.Mixed
  },
  key: {
    type: String,
    required: true
  },
  mime: {
    type: String,
    enum: mime,
    required: true
  },
  size: {
    type: Number,
    default: 0
  },
  acl: {
    type: String
    // default: s3.getConfig().acl || null
  },
  url: {
    type: String
  },
  status: {
    type: String,
    enum: ['uploading', 'processing', 'ready', 'error'],
    default: 'uploading'
  },
  type: {
    type: String,
    enum: ['original', 'thumbnail', 'optimized', 'mp4', 'webm', 'png', 'jpg'],
    default: 'original',
    required: true
  }
});

module.exports = File;
