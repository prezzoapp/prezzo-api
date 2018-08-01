// @flow
module.exports = [
  {
    description:
      'should return status 401 (unauthorized) if the user isnt logged in',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}',
    method: 'DEL',
    expectStatus: 401
  },
  {
    description:
      'should return status 403 (forbidden) if the user is not a vendor',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}',
    method: 'DEL',
    $$basicAuth: 'user-2',
    expectStatus: 403
  },
  {
    description:
      'should return status 403 (forbidden) if the menu doesn’t belong to the vendor',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}',
    method: 'DEL',
    $$basicAuth: 'user-1',
    expectStatus: 403
  },
  {
    description:
      'should return status 404 (resource not found) if the menu doesn’t exist',
    $$url:
      '/v1/menus/{{ randomObjectId }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}',
    method: 'DEL',
    $$basicAuth: 'user-0',
    expectStatus: 404
  },
  {
    description:
      'should return status 404 (resource not found) if the category doesn’t exist',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ randomObjectId }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}',
    method: 'DEL',
    $$basicAuth: 'user-0',
    expectStatus: 404
  },
  {
    description:
      'should return status 404 (resource not found) if the item doesn’t exist',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ randomObjectId }}',
    method: 'DEL',
    $$basicAuth: 'user-0',
    expectStatus: 404
  },
  {
    description: 'should delete the item on success',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}',
    method: 'DEL',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    $$expectKeyValue: {
      'categories[2].items': { $length: 1 },

      'categories[2].items[0]._id': '{{ menu-0.categories[2].items[0]._id }}',
      'categories[2].items[0].title': '{{ menu-0.categories[2].items[0].title }}',
      'categories[2].items[0].description': '{{ menu-0.categories[2].items[0].description }}',
      'categories[2].items[0].price': '{{ menu-0.categories[2].items[0].price }}'
    },
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-0._id}}',
        $values: {
          'categories[2].items': { $length: 1 },

          'categories[2].items[0]._id': '{{ menu-0.categories[2].items[0]._id }}',
          'categories[2].items[0].title': '{{ menu-0.categories[2].items[0].title }}',
          'categories[2].items[0].description': '{{ menu-0.categories[2].items[0].description }}',
          'categories[2].items[0].price': '{{ menu-0.categories[2].items[0].price }}'
        }
      }
    ]
  },
  {
    description: 'should NOT delete any other items in other menus',
    $$url: '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}',
    method: 'DEL',
    $$basicAuth: 'user-0',
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-1._id}}',
        $values: {
          'categories[0].title': '{{ menu-1.categories[0].title }}',
          'categories[0].items': {
            $length: 0
          },
          'categories[1].title': '{{ menu-1.categories[1].title }}',
          'categories[1].items': {
            $length: 1
          },
          'categories[2].title': '{{ menu-1.categories[2].title }}',
          'categories[2].items': {
            $length: 2
          }
        }
      }
    ]
  }
];
