// @flow
import type { $Request, $Response } from 'express';
import { ServerError } from 'alfred/core/errors';
import log from 'alfred/services/logger';

module.exports = {
  description: 'Logs a user out.',
  path: '/v1/auth/logout',
  method: 'GET',
  async run(req: $Request, res: $Response) {
    try {
      await req.user.endSession(req.sessionId);
      res.$end();
    } catch (e) {
      log.warn('Failed to logout.', e);
      res.$fail(new ServerError(e));
    }
  }
};
