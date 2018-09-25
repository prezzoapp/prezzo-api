// @flow
import { ServerError } from 'alfred/core/errors';

const PaymentMethod = require('../../services/mongo').registerModel(
  __dirname,
  'PaymentMethod'
);

export const createPaymentMethod = params => new PaymentMethod(params).save();

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

export default PaymentMethod;
