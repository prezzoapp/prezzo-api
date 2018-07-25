// @flow
module.exports = [
  {
    description:
      'should return status 401 (unauthorized) if the user isnt logged in',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[1]._id }}',
    method: 'DEL',
    expectStatus: 401
  },
  {
    description:
      'should return status 403 (forbidden) if the user is not a vendor',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[1]._id }}',
    method: 'DEL',
    $$basicAuth: 'user-2',
    expectStatus: 403
  },
  {
    description:
      'should return status 403 (forbidden) if the menu doesn’t belong to the vendor',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[1]._id }}',
    method: 'DEL',
    $$basicAuth: 'user-1',
    expectStatus: 403
  },
  {
    description: 'should delete the category on success',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[1]._id }}',
    method: 'DEL',
    $$basicAuth: 'user-0',
    expectStatus: 200
  },
  {
    description: 'should NOT delete any other categories in the menu',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[1]._id }}',
    method: 'DEL',
    $$basicAuth: 'user-0',
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-0._id}}',
        $values: {
          'categories[0].title': '{{ menu-0.categories[0].title }}',
          'categories[0].items': {
            $length: 0
          },
          'categories[1].title': '{{ menu-0.categories[2].title }}',
          'categories[1].items': {
            $length: 2
          }
        }
      }
    ]
  },
  {
    description: 'should NOT delete any other categories in other menus',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[1]._id }}',
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
