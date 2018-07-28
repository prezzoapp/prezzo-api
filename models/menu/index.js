// @flow
import $q from 'q';
import { ServerError, ResourceNotFoundError } from 'alfred/core/errors';
import { debug } from 'alfred/services/logger';
import MenuCategory from '../../models/menuCategory';

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

export const findMenuById = (menuId: string) => {
  debug('finding menu by id', menuId);
  const { promise, resolve, reject } = $q.defer();

  Menu.findById(menuId, (err, menu) => {
    if (err) {
      return reject(new ServerError(err));
    } else if (!menu) {
      return reject(new ResourceNotFoundError('No menu exists with that id.'));
    }

    return resolve(menu);
  });

  return promise;
};

export const addCategoryToMenu = (menu: any, category: any) => {
  debug('adding category to menu');
  const { promise, resolve, reject } = $q.defer();

  Menu.findOneAndUpdate(
    {
      _id: menu._id || menu
    },
    {
      $push: {
        categories: new MenuCategory(category)
      }
    },
    {
      new: true
    },
    (err, updatedMenu) => {
      if (err) {
        return reject(new ServerError(err));
      } else if (!updatedMenu) {
        return reject(new ResourceNotFoundError('Unable to find menu.'));
      }

      return resolve(updatedMenu);
    }
  );

  return promise;
};

export const updateCategoryInMenu = (
  menuId: string,
  categoryId: string,
  category: any
) => {
  debug('updating category in menu');
  const { promise, resolve, reject } = $q.defer();
  const update = {};
  Object.keys(category).forEach(key => {
    update[`categories.$.${key}`] = category[key];
  });

  debug('finding menu and category', menuId, categoryId);
  debug('built `update` query', update);

  Menu.findOneAndUpdate(
    {
      _id: menuId,
      'categories._id': categoryId
    },
    {
      $set: update
    },
    {
      new: true
    },
    (err, updatedMenu) => {
      if (err) {
        return reject(new ServerError(err));
      } else if (!updatedMenu) {
        return reject(new ResourceNotFoundError('Unable to find menu.'));
      }

      return resolve(updatedMenu);
    }
  );

  return promise;
};

export const deleteCategoryInMenu = (menuId: string, categoryId: string) => {
  debug('deleting category in menu');
  const { promise, resolve, reject } = $q.defer();

  Menu.findOneAndUpdate(
    {
      _id: menuId
    },
    'categories.$.items': {
      $push: {
        items: item
      }
    },
    {
      new: true
    },
    (err, updatedMenu) => {
      if (err) {
        return reject(new ServerError(err));
      } else if (!updatedMenu) {
        return reject(new ResourceNotFoundError('Unable to find menu.'));
      }

      return resolve(updatedMenu);
    }
  );

  return promise;
};

export const addItemToMenuCategory = (
  menuId: string,
  categoryId: string,
  item: any
) => {
  debug('finding menu and category', menuId, categoryId);
  const { promise, resolve, reject } = $q.defer();

  Menu.findOneAndUpdate(
    {
      _id: menuId,
      'categories._id': categoryId
    },
    {
      $push: {
        'categories.$.items': item
      }
    },
    {
      new: true
    },
    (err, updatedMenu) => {
      if (err) {
        return reject(new ServerError(err));
      } else if (!updatedMenu) {
        return reject(new ResourceNotFoundError('Unable to find menu.'));
      }

      return resolve(updatedMenu);
    }
  );

  return promise;
};
