// @flow
import type { $Request, $Response } from 'express';
import { debug } from 'alfred/services/logger';
import { listVendors } from '../../models/vendor';

module.exports = {
  description: 'List all vendors.',
  path: '/v1/vendors',
  method: 'GET',
  async run(req: $Request, res: $Response) {
    const vendors = await listVendors();
    debug('vendors', vendors);

    res.$end(vendors);
  }
};
