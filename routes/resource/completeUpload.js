// @flow
import { ForbiddenError, ResourceNotFoundError } from 'alfred/core/errors';
import { find, deferReject, getValueForURLParam } from 'alfred/services/util';
import log from 'alfred/services/logger';

import { markUploadAsComplete } from '../../models/resource';

module.exports = {
  description:
    'Used to signify the completion of an upload of a file belonging to a resources',
  path: '/v1/resources/:id/files/:fileId/completeUpload',
  method: 'POST',
  validate(req) {
    log.debug('hit validate fn', req.data.resource, '');

    if (req.data.resource.creator.toString() !== req.user._id.toString()) {
      return deferReject(new ForbiddenError());
    }

    const path = '/v1/resources/:id/files/:fileId/completeUpload';
    const fileId = getValueForURLParam(path, req.path, ':fileId');
    const file = find(
      req.data.resource.files,
      file2 => file2 && file2._id.toString() === fileId
    );

    log.debug('got file', file, '');

    if (!file) {
      return deferReject(new ResourceNotFoundError("That file doesn't exist."));
    }
  },
  async run(req, res) {
    log.debug('hit fn');

    try {
      const resource = await markUploadAsComplete(
        req.params.id,
        req.params.fileid
      );

      res.$end(resource);
    } catch (e) {
      return res.$fail(e);
    }
  }
};
