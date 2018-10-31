// @flow
import { ServerError, ResourceNotFoundError } from 'alfred/core/errors';
import { setPaymentMethodTypeAndIdentifier } from '../../services/braintree';

const PaymentMethod = require('../../services/mongo').registerModel(
  __dirname,
  'PaymentMethod'
);

export const createPaymentMethod = async (
  params,
  braintreePaymentMethod,
  user
) => {
  const paymentMethod = new PaymentMethod(params);
  await setPaymentMethodTypeAndIdentifier(
    paymentMethod,
    braintreePaymentMethod,
    user
  );
  return paymentMethod.save();
};

export const findPaymentMethodById = (id: string) =>
  new Promise((resolve, reject) => {
    PaymentMethod.findById(id, (err, paymentMethod) => {
      if (err) {
        return reject(new ServerError(err));
      } else if (!paymentMethod) {
        return reject(
          new ResourceNotFoundError(
            `Unable to find paynemt method with id: ${id}`
          )
        );
      }

      return resolve(paymentMethod);
    });
  });

export const deletePaymentMethod = paymentMethod =>
  new Promise((resolve, reject) => {
    const { _id } = paymentMethod;
    PaymentMethod.remove({ _id }, err => {
      if (err) {
        return reject(new ServerError(err));
      }

      return resolve();
    });
  });

export const makeDefault = () => {
  const alias = this;
  return new Promise((resolve, reject) => {
    new Promise((resolve2, reject2) => {
      PaymentMethod.update(
        {
          creator: alias.creator,
          _id: { $ne: alias._id },
          isDefault: true
        },
        { $set: { isDefault: false } },
        { multi: true },
        (err, result) => {
          if (err) {
            return reject2(new ServerError(err));
          }

          return resolve2(result);
        }
      );
    })
      .then(
        () =>
          new Promise((resolve2, reject2) => {
            if (alias.isDefault) {
              return resolve2(alias);
            }

            PaymentMethod.findByIdAndUpdate(
              alias._id,
              { $set: { isDefault: true } },
              { new: true },
              (err, result) => {
                if (err) {
                  return reject2(new ServerError(err));
                }

                return resolve2(result);
              }
            );
          })
      )
      .then(resolve)
      .catch(reject);
  });
};

export const listPaymentMethods = params =>
  new Promise((resolve, reject) => {
    PaymentMethod.find(params, (err, paymentMethods) => {
      if (err) {
        return reject(new ServerError(err));
      }

      return resolve(paymentMethods);
    });
  });

export default PaymentMethod;
