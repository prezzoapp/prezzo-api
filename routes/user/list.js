// @flow
import type { $Request, $Response } from 'express';
import { listUsers } from '../../models/user';

module.exports = {
  description: 'List all users.',
  path: '/v1/users',
  method: 'GET',
  async run(req: $Request, res: $Response) {
    const users = await listUsers();
    console.log('users', users);
    res.$end([]);
  }
};
