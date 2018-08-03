module.exports = [
  {
    description: 'should require authorization',
    method: 'POST',
    $$url: '/v1/resources/{{ randomObjectId }}/files/{{ randomObjectId }}/completeUpload',
    expectStatus: 401
  }, {
    description: 'should return status 404 (resource not found) if the resource doesn\'t exit',
    method: 'POST',
    $$url: '/v1/resources/{{ randomObjectId }}/files/{{ randomObjectId }}/completeUpload',
    $$basicAuth: 'user-0',
    expectStatus: 404
  }, {
    description: 'should return status 404 (resource not found) if the file doesn\'t exit in the resource',
    method: 'POST',
    $$url: '/v1/resources/{{ resource-0._id }}/files/{{ randomObjectId }}/completeUpload',
    $$basicAuth: 'user-0',
    expectStatus: 404
  }, {
    description: 'should return status 403 (forbidden) if the resource doesn\'t belong to the authenticated user',
    method: 'POST',
    $$url: '/v1/resources/{{ resource-0._id }}/files/{{ resource-0.files[0]._id }}/completeUpload',
    $$basicAuth: 'user-1',
    expectStatus: 403
  }, {
    description: 'should return update the file status to `ready`',
    method: 'POST',
    $$url: '/v1/resources/{{ resource-0._id }}/files/{{ resource-0.files[0]._id }}/completeUpload',
    $$basicAuth: 'user-0',
    expectStatus: 200,
    $$expectKeyValue: {
      'files[0].status': 'ready'
    },
    $$assertModel: {
      $model: 'resource',
      $_id: '{{ resource-0._id }}',
      $values: {
        'files[0].status': 'ready'
      }
    }
  }
];
