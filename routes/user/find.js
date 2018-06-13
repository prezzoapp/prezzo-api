// @flow
import type { $Request, $Response } from 'express';

module.exports = {
  description: 'Finds a user.',
  path: '/v1/users/:id',
  method: 'GET',
  run(req: $Request, res: $Response) {
    return res.$end(req.data.user);
  }
};
