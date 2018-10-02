// @flow
import { debug } from 'alfred/services/logger';
import { findPaymentMethodById } from '../../../models/paymentMethod';

module.exports = {
  description:
    'Queries a payment method from the database and loads it into the request object.',
  priority: 5,
  match: '/v1/payment-methods/:id/',
  async run(req, res, next) {
    debug('hit paymentMethod query middleware');

    try {
      const paymentMethod = await findPaymentMethodById(req.params.id);
      req.data.paymentMethod = paymentMethod;
      next();
    } catch (e) {
      return res.$fail(e);
    }
  }
};
