// @flow
import { debug } from 'alfred/services/logger';
import { random } from 'alfred/services/util';

const getPayload = () => ({
  title: random(10)
});

module.exports = [
  {
    description:
      'should return status 401 (unauthorized) if the user isnt logged in',
    $$url: '/v1/menus/{{ menu-0._id }}/categories',
    method: 'POST',
    $$send: getPayload,
    expectStatus: 401
  },
  {
    description:
      'should return status 403 (forbidden) if the user is not a vendor',
    $$url: '/v1/menus/{{ menu-0._id }}/categories',
    method: 'POST',
    $$basicAuth: 'user-2',
    $$send: getPayload,
    expectStatus: 403
  },
  {
    description:
      'should return status 403 (forbidden) if the menu doesn’t belong to the vendor',
    $$url: '/v1/menus/{{ menu-0._id }}/categories',
    method: 'POST',
    $$basicAuth: 'user-1',
    $$send: getPayload,
    expectStatus: 403
  },
  {
    description:
      'should return status 400 (bad request) if a category exists in the menu with the same title',
    $$url: '/v1/menus/{{ menu-0._id }}/categories',
    method: 'POST',
    $$basicAuth: 'user-0',
    $$send: {
      title: '{{ menu-0.categories[1].title }}'
    },
    expectStatus: 400
  },
  {
    description:
      'should return status 400 (bad request) if `title` isnt sent in the request',
    $$url: '/v1/menus/{{ menu-0._id }}/categories',
    method: 'POST',
    $$basicAuth: 'user-0',
    expectStatus: 400
  },
  {
    description: 'should add the category to the menu on success',
    $$url: '/v1/menus/{{ menu-0._id }}/categories',
    method: 'POST',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 200,
    $$expectKeyValue: {
      'categories[3].title': '{{ payload.title }}',
      'categories[3]': (category, ctrllr) => {
        const assertion = () => category.items.length === 0;

        ctrllr.assert(
          'should have created a category with 0 items',
          assertion,
          0,
          category.items.length
        );

        return assertion();
      }
    },
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-0._id }}',
        $values: {
          'categories[0]': (category, ctrllr) => {
            const assertion = () => category.items.length === 0;

            ctrllr.assert(
              'should have 0 items',
              assertion,
              0,
              category.items.length
            );

            return assertion();
          },
          'categories[1].title': '{{ menu-0.categories[1].title }}',
          'categories[2].title': '{{ menu-0.categories[2].title }}',
          'categories[3].title': '{{ payload.title }}'
        }
      }
    ]
  },
  {
    description: 'should NOT have modified any other menus',
    $$url: '/v1/menus/{{ menu-0._id }}/categories',
    method: 'POST',
    $$basicAuth: 'user-0',
    $$send: getPayload,
    expectStatus: 200,
    $$expectKeyValue: {
      'categories[3].title': '{{ payload.title }}',
      'categories[3]': (category, ctrllr) => {
        const assertion = () => category.items.length === 0;

        ctrllr.assert(
          'should have created a category with 0 items',
          assertion,
          0,
          category.items.length
        );

        return assertion();
      }
    },
    $$assertModel: [
      {
        $model: 'menu',
        $_id: '{{ menu-1._id }}',
        $values: {
          'categories[0]': (category, ctrllr) => {
            const assertion = () => category.items.length === 0;

            ctrllr.assert(
              'should have 0 items',
              assertion,
              0,
              category.items.length
            );

            return assertion();
          },
          'categories[1]': (category, ctrllr) => {
            const assertion = () => category.items.length === 1;

            ctrllr.assert(
              'should have 1 items',
              assertion,
              1,
              category.items.length
            );

            return assertion();
          },
          'categories[2]': (category, ctrllr) => {
            const assertion = () => category.items.length === 2;

            ctrllr.assert(
              'should have 2 items',
              assertion,
              2,
              category.items.length
            );

            return assertion();
          },
          'categories[3]': (category, ctrllr) => {
            const assertion = () => typeof category === 'undefined';

            ctrllr.assert(
              'should not have a 4th category',
              assertion,
              'undefined',
              category
            );

            return assertion();
          }
        }
      }
    ]
  }
];
