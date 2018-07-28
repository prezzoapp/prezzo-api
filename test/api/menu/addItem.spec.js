import { getNumberInRange, random } from 'alfred/services/util';

function getPayload() {
  return {
    title: random(10),
    description: random(10),
    price: parseFloat(`${getNumberInRange(1, 100)}.${getNumberInRange(1, 99)}`)
  };
}

module.exports = [
  {
    description:
      'should return status 401 (unauthorized) if the user isnt logged in',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[1]._id }}/items',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 401
  },
  {
    description:
      'should return status 404 (resource not found) if the menu doesnt exist',
    $$url:
      '/v1/menus/{{ randomObjectId }}/categories/{{ menu-0.categories[1]._id }}/items',
    method: 'POST',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 404
  },
  {
    description:
      'should return status 404 (resource not found) if the category doesnt exist',
    $$url: '/v1/menus/{{ menu-0._id }}/categories/{{ randomObjectId }}/items',
    method: 'POST',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 404
  },
  {
    description:
      'should return status 403 (forbidden) if the user is not a vendor',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[1]._id }}/items',
    method: 'POST',
    $$basicAuth: 'user-2',
    $$send: getPayload,
    expectStatus: 403
  },
  {
    description:
      'should return status 403 (forbidden) if the menu doesn’t belong to the vendor',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[1]._id }}/items',
    method: 'POST',
    $$basicAuth: 'user-1',
    $$send: getPayload,
    expectStatus: 403
  },
  {
    description: 'should add an item to the menu on success',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[1]._id }}/items',
    method: 'POST',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 200,
    $$expectKeyValue: {
      'categories[0].items': {
        $length: 0
      },
      'categories[1].items': {
        $length: 2
      },
      'categories[2].items': {
        $length: 2
      },
      'categories[1].items[1].title': '{{ payload.title }}',
      'categories[1].items[1].description': '{{ payload.description }}',
      'categories[1].items[1].price': '{{ payload.price }}'
    },
    $$reloadStore: true,
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-0._id }}',
        $values: {
          'categories[1].items[0].title':
            '{{ menu-0.categories[1].items[0].title }}',
          'categories[1].items[0].description':
            '{{ menu-0.categories[1].items[0].description }}',
          'categories[1].items[0].price':
            '{{ menu-0.categories[1].items[0].price }}',
          'categories[0].items': {
            $length: 0
          },
          'categories[1].items': {
            $length: 2
          },
          'categories[2].items': {
            $length: 2
          }
        }
      }
    ]
  },
  {
    description: 'shouldn’t add the item to any other menus on success',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[1]._id }}/items',
    method: 'POST',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 200,
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-1._id }}',
        $values: {
          'categories[0].items': {
            $length: 0
          },
          'categories[1].items': {
            $length: 1
          },
          'categories[2].items': {
            $length: 2
          }
        }
      },
      {
        $model: 'menu',
        $_id: '{{ menu-2._id }}',
        $values: {
          'categories[0].items': {
            $length: 0
          },
          'categories[1].items': {
            $length: 1
          },
          'categories[2].items': {
            $length: 2
          }
        }
      }
    ]
  }
];
