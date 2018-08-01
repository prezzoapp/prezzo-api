// @flow
import { debug } from 'alfred/services/logger';
import { getNumberInRange, random } from 'alfred/services/util';

const getPayload = () => ({
  title: random(10),
  description: random(10),
  price: parseFloat(`${getNumberInRange(1, 100)}.${getNumberInRange(1, 99)}`)
});

module.exports = [
  {
    description:
      'should return status 401 (unauthorized) if the user isnt logged in',
    $$url: '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}',
    method: 'PUT',
    $$send: getPayload,
    expectStatus: 401
  },
  {
    description:
      'should return status 403 (forbidden) if the user is not a vendor',
    $$url: '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}',
    method: 'PUT',
    $$basicAuth: 'user-2',
    $$send: getPayload,
    expectStatus: 403
  },
  {
    description:
      'should return status 403 (forbidden) if the menu doesn’t belong to the vendor',
    $$url: '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}',
    method: 'PUT',
    $$basicAuth: 'user-1',
    $$send: getPayload,
    expectStatus: 403
  },
  {
    description:
      'should return status 404 (resouce not found) if the menu doesnt exist',
    $$url:
      '/v1/menus/{{ randomObjectId }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 404
  },
  {
    description:
      'should return status 404 (resouce not found) if the category doesnt exist',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ randomObjectId }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 404
  },
  {
    description:
      'should return status 404 (resouce not found) if the item doesnt exist',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ randomObjectId }}',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 404
  },
  {
    description: 'should update the item in the menu on success',
    $$url: '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 200,
    $$expectKeyValue: {
      'categories[2].items[0]._id': '{{ menu-0.categories[2].items[0]._id }}',
      'categories[2].items[0].title': '{{ menu-0.categories[2].items[0].title }}',
      'categories[2].items[0].description': '{{ menu-0.categories[2].items[0].description }}',
      'categories[2].items[0].price': '{{ menu-0.categories[2].items[0].price }}',

      'categories[2].items[1]._id': '{{ menu-0.categories[2].items[1]._id }}',
      'categories[2].items[1].title': '{{ payload.title }}',
      'categories[2].items[1].description': '{{ payload.description }}',
      'categories[2].items[1].price': '{{ payload.price }}',

      'categories[2].items[2]._id': '{{ menu-0.categories[2].items[2]._id }}',
      'categories[2].items[2].title': '{{ menu-0.categories[2].items[2].title }}',
      'categories[2].items[2].description': '{{ menu-0.categories[2].items[2].description }}',
      'categories[2].items[2].price': '{{ menu-0.categories[2].items[2].price }}'
    },
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-0._id}}',
        $values: {
          'categories[2].items[0]._id': '{{ menu-0.categories[2].items[0]._id }}',
          'categories[2].items[0].title': '{{ menu-0.categories[2].items[0].title }}',
          'categories[2].items[0].description': '{{ menu-0.categories[2].items[0].description }}',
          'categories[2].items[0].price': '{{ menu-0.categories[2].items[0].price }}',

          'categories[2].items[1]._id': '{{ menu-0.categories[2].items[1]._id }}',
          'categories[2].items[1].title': '{{ payload.title }}',
          'categories[2].items[1].description': '{{ payload.description }}',
          'categories[2].items[1].price': '{{ payload.price }}',

          'categories[2].items[2]._id': '{{ menu-0.categories[2].items[2]._id }}',
          'categories[2].items[2].title': '{{ menu-0.categories[2].items[2].title }}',
          'categories[2].items[2].description': '{{ menu-0.categories[2].items[2].description }}',
          'categories[2].items[2].price': '{{ menu-0.categories[2].items[2].price }}'
        }
      }
    ]
  },
  {
    description: "should succeed if the item doesn't change",
    $$url: '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: {},
    expectStatus: 200,
    $$expectKeyValue: {
      'categories[2].items[0]._id': '{{ menu-0.categories[2].items[0]._id }}',
      'categories[2].items[0].title': '{{ menu-0.categories[2].items[0].title }}',
      'categories[2].items[0].description': '{{ menu-0.categories[2].items[0].description }}',
      'categories[2].items[0].price': '{{ menu-0.categories[2].items[0].price }}',

      'categories[2].items[1]._id': '{{ menu-0.categories[2].items[1]._id }}',
      'categories[2].items[1].title': '{{ menu-0.categories[2].items[1].title }}',
      'categories[2].items[1].description': '{{ menu-0.categories[2].items[1].description }}',
      'categories[2].items[1].price': '{{ menu-0.categories[2].items[1].price }}',

      'categories[2].items[2]._id': '{{ menu-0.categories[2].items[2]._id }}',
      'categories[2].items[2].title': '{{ menu-0.categories[2].items[2].title }}',
      'categories[2].items[2].description': '{{ menu-0.categories[2].items[2].description }}',
      'categories[2].items[2].price': '{{ menu-0.categories[2].items[2].price }}'
    },
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-0._id}}',
        $values: {
          'categories[2].items[0]._id': '{{ menu-0.categories[2].items[0]._id }}',
          'categories[2].items[0].title': '{{ menu-0.categories[2].items[0].title }}',
          'categories[2].items[0].description': '{{ menu-0.categories[2].items[0].description }}',
          'categories[2].items[0].price': '{{ menu-0.categories[2].items[0].price }}',

          'categories[2].items[1]._id': '{{ menu-0.categories[2].items[1]._id }}',
          'categories[2].items[1].title': '{{ menu-0.categories[2].items[1].title }}',
          'categories[2].items[1].description': '{{ menu-0.categories[2].items[1].description }}',
          'categories[2].items[1].price': '{{ menu-0.categories[2].items[1].price }}',

          'categories[2].items[2]._id': '{{ menu-0.categories[2].items[2]._id }}',
          'categories[2].items[2].title': '{{ menu-0.categories[2].items[2].title }}',
          'categories[2].items[2].description': '{{ menu-0.categories[2].items[2].description }}',
          'categories[2].items[2].price': '{{ menu-0.categories[2].items[2].price }}'
        }
      }
    ]
  },
  {
    description: 'should NOT modify any other menus',
    $$url: '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 200,
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-1._id}}',
        $values: {
          'categories[0].title': '{{ menu-1.categories[0].title }}',
          'categories[0].items': { $length: 0 },

          'categories[1].title': '{{ menu-1.categories[1].title }}',
          'categories[1].items': { $length: 1 },
          'categories[1].items[0]._id': '{{ menu-1.categories[1].items[0]._id }}',
          'categories[1].items[0].title': '{{ menu-1.categories[1].items[0].title }}',
          'categories[1].items[0].description': '{{ menu-1.categories[1].items[0].description }}',
          'categories[1].items[0].price': '{{ menu-1.categories[1].items[0].price }}',

          'categories[2].title': '{{ menu-1.categories[2].title }}',
          'categories[2].items': { $length: 2 },
          'categories[2].items[0]._id': '{{ menu-1.categories[2].items[0]._id }}',
          'categories[2].items[0].title': '{{ menu-1.categories[2].items[0].title }}',
          'categories[2].items[0].description': '{{ menu-1.categories[2].items[0].description }}',
          'categories[2].items[0].price': '{{ menu-1.categories[2].items[0].price }}',
          'categories[2].items[1]._id': '{{ menu-1.categories[2].items[1]._id }}',
          'categories[2].items[1].title': '{{ menu-1.categories[2].items[1].title }}',
          'categories[2].items[1].description': '{{ menu-1.categories[2].items[1].description }}',
          'categories[2].items[1].price': '{{ menu-1.categories[2].items[1].price }}',
          'categories[2].items[2]._id': '{{ menu-1.categories[2].items[2]._id }}',
          'categories[2].items[2].title': '{{ menu-1.categories[2].items[2].title }}',
          'categories[2].items[2].description': '{{ menu-1.categories[2].items[2].description }}',
          'categories[2].items[2].price': '{{ menu-1.categories[2].items[2].price }}'
        }
      }
    ]
  }
];
