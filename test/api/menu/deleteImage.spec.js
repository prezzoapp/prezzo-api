// @flow
function getPayload(ctrllr) {
  return {
    // imageURL: '{{ menu-0.categories[2].items[1].imageURLs[1] }}'
    imageURL: ctrllr.getStore().get('menu-0').categories[2].items[1]
      .imageURLs[1]
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
    method: 'DEL',
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
    method: 'DEL',
    $$send: getPayload,
    expectStatus: 403
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
    method: 'DEL',
    $$send: getPayload,
    expectStatus: 403
  },
  {
    description: 'should remove the image from the menu item on success',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}' +
      '/photos',
    $$basicAuth: 'user-0',
    method: 'DEL',
    $$send: getPayload,
    expectStatus: 200,
    $$expectKeyValue: {
      'categories[2].items[1].imageURLs': { $length: 2 },
      'categories[2].items[1].imageURLs[0]': '{{ menu-0.categories[2].items[1].imageURLs[0] }}',
      'categories[2].items[1].imageURLs[1]': '{{ menu-0.categories[2].items[1].imageURLs[2] }}'
    },
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-0._id }}',
        $values: {
          'categories[2].items[1].imageURLs': { $length: 2 },
          'categories[2].items[1].imageURLs[0]': '{{ menu-0.categories[2].items[1].imageURLs[0] }}',
          'categories[2].items[1].imageURLs[1]': '{{ menu-0.categories[2].items[1].imageURLs[2] }}'
        }
      }
    ]
  },
  {
    description: 'should NOT remove any images from any other menus on success',
    $$url:
      '/v1/menus/{{ menu-0._id }}' +
      '/categories/{{ menu-0.categories[2]._id }}' +
      '/items/{{ menu-0.categories[2].items[1]._id }}' +
      '/photos',
    $$basicAuth: 'user-0',
    method: 'DEL',
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
