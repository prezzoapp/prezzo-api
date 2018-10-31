// @flow
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;
const PaymentMethod = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  creator: {
    type: ObjectId,
    ref: 'User'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    required: true,
    enum: [
      'braintree-paypal',
      'braintree-visa',
      'braintree-mastercard',
      'braintree-amex',
      'braintree-discover',
      'braintree-jcb',
      'braintree-diners',
      'braintree-maestro',
      'braintree-unionpay'
    ]
  },
  readableIdentifier: {
    type: String
  },
  token: {
    type: String,
    required: true
  }
});

module.exports = PaymentMethod;
