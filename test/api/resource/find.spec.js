module.exports = [{
  description: 'should require authorization',
  $$url: '/v1/resources/{{ resource-0._id }}',
  expectStatus: 401,
}, {
  description: 'should return status 404 (resource not found) if the resource doesn\'t exist',
  $$url: '/v1/resources/{{ randomObjectId }}',
  $$basicAuth: 'user-0',
  expectStatus: 404,
}, {
  description: 'should return the specified resource',
  $$url: '/v1/resources/{{ resource-0._id }}',
  $$basicAuth: 'user-0',
  expectStatus: 200,
  $$expectKeyValue: {
    _id: '{{ resource-0._id }}',
    type: '{{ resource-0.type }}',
  },
}];