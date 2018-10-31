// @flow
/* ==========================================================================
   Local variables, module dependencies
   ========================================================================== */

import type { $Request, $Response } from 'express';

/* ==========================================================================
   Exports - route configuration
   ========================================================================== */
module.exports = {
  description: 'Default route.',
  path: '/',
  method: 'GET',
  run(req: $Request, res: $Response) {
    res.$end('Hello, World!!');
  }
};
