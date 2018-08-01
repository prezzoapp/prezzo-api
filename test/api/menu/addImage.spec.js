// @flow
import { random } from 'alfred/services/util';

function getPayload() {
  return {
    imageURL: `https://${random(10)}.com/${random(10)}.jpg`
  };
}

module.exports = [
  {
    description:
      'should return status 401 (unauthorized) if the user isnt logged in',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}' +
      '/photos',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 401
  },
  {
    description:
      'should return status 403 (forbidden) if the user is not a vendor',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}' +
      '/photos',
    $$basicAuth: 'user-2',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 403
  },
  {
    description:
      'should return status 404 (resource not found) if the menu doesnt exist',
    $$url:
      '/v1/menus/{{ randomObjectId }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}' +
      '/photos',
    $$basicAuth: 'user-0',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 404
  },
  {
    description:
      'should return status 404 (resource not found) if the menu doesnt exist',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ randomObjectId }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}' +
      '/photos',
    $$basicAuth: 'user-0',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 404
  },
  {
    description:
      'should return status 404 (resource not found) if the menu doesnt exist',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ randomObjectId }}' +
      '/photos',
    $$basicAuth: 'user-0',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 404
  },
  {
    description:
      'should return status 403 (forbidden) if the menu doesn’t belong to the vendor',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}' +
      '/photos',
    $$basicAuth: 'user-1',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 403
  },
  {
    description: 'should add the image to the menu item on success',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}' +
      '/photos',
    $$basicAuth: 'user-0',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 200,
    $$expectKeyValue: {
      'categories[2].items[1].imageURLs': { $length: 4 },
      'categories[2].items[1].imageURLs[3]': '{{ payload.imageURL }}'
    },
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-0._id }}',
        $values: {
          'categories[2].items[1].imageURLs': { $length: 4 },
          'categories[2].items[1].imageURLs[0]': '{{ menu-0.categories[2].items[1].imageURLs[0] }}',
          'categories[2].items[1].imageURLs[1]': '{{ menu-0.categories[2].items[1].imageURLs[1] }}',
          'categories[2].items[1].imageURLs[2]': '{{ menu-0.categories[2].items[1].imageURLs[2] }}',
          'categories[2].items[1].imageURLs[3]': '{{ payload.imageURL }}'
        }
      }
    ]
  },
  {
    description:
      'should NOT add the image to any other items in the menu on success',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}' +
      '/photos',
    $$basicAuth: 'user-0',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 200,
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-1._id }}',
        $values: {
          'categories[2].items[1].imageURLs': { $length: 3 },
          'categories[2].items[1].imageURLs[0]': '{{ menu-1.categories[2].items[1].imageURLs[0] }}',
          'categories[2].items[1].imageURLs[1]': '{{ menu-1.categories[2].items[1].imageURLs[1] }}',
          'categories[2].items[1].imageURLs[2]': '{{ menu-1.categories[2].items[1].imageURLs[2] }}'
        }
      }
    ]
  }
];
