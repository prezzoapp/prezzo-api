// @flow
import $q from 'q';
import { ServerError, ResourceNotFoundError } from 'alfred/core/errors';

const Menu = require('../../services/mongo').registerModel(__dirname, 'Menu');

export default Menu;

export const createMenu = async (params: any) => new Menu(params).save();

export const findMenuByVendor = async (vendor: string) => {
  const { promise, resolve, reject } = $q.defer();

  Menu.findOne({ vendor }, (err, menu) => {
    if (err) {
      return reject(new ServerError(err));
    } else if (!menu) {
      return reject(
        new ResourceNotFoundError('That vendor doesnt have a menu.')
      );
    }

    return resolve(menu);
  });

  return promise;
};
