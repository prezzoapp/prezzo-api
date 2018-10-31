// @flow
import { ForbiddenError } from 'alfred/core/errors';
import { deferReject } from 'alfred/services/util';

module.exports = {
  description: 'Deletes a resource.',
  path: '/v1/resources/:id',
  method: 'DELETE',
  validate(req) {
    if (req.data.resource.creator.toString() !== req.user._id.toString()) {
      return deferReject(new ForbiddenError());
    }
  },
  async run(req, res) {
    try {
      await req.data.resource.destroy();
      return res.$end();
    } catch (e) {
      return res.$fail(e);
    }
  }
};
