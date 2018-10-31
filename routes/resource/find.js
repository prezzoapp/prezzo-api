// @flow
import type { $Request, $Response } from 'express';
import log from 'alfred/services/logger';

module.exports = {
  description: 'Finds a resource.',
  path: '/v1/resources/:id',
  method: 'GET',
  run(req: $Request, res: $Response) {
    log.debug('hit resource::find endpoint');
    return res.$end(req.data.resource);
  }
};
