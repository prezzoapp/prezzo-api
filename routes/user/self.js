// @flow
import type { $Request, $Response } from 'express';
import { findVendorById } from '../../models/vendor';

module.exports = {
  description: 'Returns the currently authenticated user.',
  path: '/v1/self',
  method: 'GET',
  async run(req: $Request, res: $Response) {
    try {
      if (req.user.vendor) {
        req.user.vendor = await findVendorById(req.user.vendor);
      }

      res.$end(req.user);
    } catch (e) {
      return res.$fail(e);
    }
  }
};
