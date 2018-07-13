// @flow
import type { $Request, $Response } from 'express';

module.exports = {
  description: 'Returns the currently authenticated user.',
  path: '/v1/self',
  method: 'GET',
  async run(req: $Request, res: $Response) {
    res.$end(req.user);
  }
};
