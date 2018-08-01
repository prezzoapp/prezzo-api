// @flow
import { debug } from 'alfred/services/logger';
import { random } from 'alfred/services/util';

const getPayload = () => ({
  title: random(10),
  items: []
});

module.exports = [
  {
    description:
      'should return status 401 (unauthorized) if the user isnt logged in',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[1]._id }}',
    method: 'PUT',
    $$send: getPayload,
    expectStatus: 401
  },
  {
    description:
      'should return status 403 (forbidden) if the user is not a vendor',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[1]._id }}',
    method: 'PUT',
    $$basicAuth: 'user-2',
    $$send: getPayload,
    expectStatus: 403
  },
  {
    description:
      'should return status 403 (forbidden) if the menu doesn’t belong to the vendor',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[1]._id }}',
    method: 'PUT',
    $$basicAuth: 'user-1',
    $$send: getPayload,
    expectStatus: 403
  },
  {
    description:
      'should return status 404 (resource not found) if the menu doesn’t exist',
    $$url:
      '/v1/menus/{{ randomObjectId }}/categories/{{ menu-0.categories[1]._id }}',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 404
  },
  {
    description:
      'should return status 404 (resource not found) if the category doesn’t exist',
    $$url: '/v1/menus/{{ menu-0._id }}/categories/{{ randomObjectId }}',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 404
  },
  {
    description:
      "should return status 400 (bad request) if the user tries to update the title to another category's title in the menu",
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[2]._id }}',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: {
      title: '{{ menu-0.categories[1].title }}'
    },
    expectStatus: 400
  },
  {
    description: 'should update the category in the menu on success',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[2]._id }}',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 200,
    $$expectKeyValue: {
      'categories[2].title': '{{ payload.title }}'
    },
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-0._id}}',
        $values: {
          'categories[2].title': '{{ payload.title }}'
        }
      }
    ]
  },
  {
    description:
      'should succeed if the category title exists in another category in a different menuctontinue;',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[2]._id }}',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: {
      title: '{{ menu-1.categories[2].title }}'
    },
    expectStatus: 200,
    $$expectKeyValue: {
      'categories[2].title': '{{ payload.title }}'
    },
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-0._id}}',
        $values: {
          'categories[2].title': '{{ payload.title }}'
        }
      }
    ]
  },
  {
    description: "should succeed if the category doesn't change",
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[2]._id }}',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: {
      title: '{{ menu-0.categories[2].title }}'
    },
    expectStatus: 200,
    $$expectKeyValue: {
      'categories[2].title': '{{ menu-0.categories[2].title }}'
    },
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-0._id}}',
        $values: {
          'categories[2].title': '{{ menu-0.categories[2].title }}'
        }
      }
    ]
  },
  {
    description: 'should NOT modify any other menus',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[2]._id }}',
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
  },
  {
    description: 'should NOT modify any other categories in the menu',
    $$url:
      '/v1/menus/{{ menu-0._id }}/categories/{{ menu-0.categories[2]._id }}',
    method: 'PUT',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 200,
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-0._id}}',
        $values: {
          'categories[0].title': '{{ menu-0.categories[0].title }}',
          'categories[0].items': {
            $length: 0
          },
          'categories[1].title': '{{ menu-0.categories[1].title }}',
          'categories[1].items': {
            $length: 1
          },
          'categories[2].title': '{{ payload.title }}',
          'categories[2].items': {
            $length: 2
          }
        }
      }
    ]
  }
];
