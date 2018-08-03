module.exports = [
  {
    description:
      'should return status 401 (unauthorized) if the user isnt logged in',
    path: '/v1/menus',
    method: 'POST',
    expectStatus: 401
  },
  {
    description:
      'should return status 403 (forbidden) if the user isnt a vendor',
    path: '/v1/menus',
    method: 'POST',
    $$basicAuth: 'user-3',
    expectStatus: 403
  },
  {
    description:
      'should return status 403 (forbidden) if the vendor already has a menu',
    path: '/v1/menus',
    method: 'POST',
    $$basicAuth: 'user-0',
    expectStatus: 403
  },
  {
    description: 'should create a menu on success',
    path: '/v1/menus',
    method: 'POST',
    $$basicAuth: 'user-2',
    expectStatus: 200,
    $$expectKeyValue: {
      vendor: '{{ vendor-2._id }}'
    }
  }
];
