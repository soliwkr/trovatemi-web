import assert from 'node:assert/strict';
import test from 'node:test';

import { safeLogPath } from '../src/domain/request-log.ts';

test('redacts private tokens from request log paths', () => {
  assert.equal(safeLogPath('/preview/pilot-token-7f3a'), '/preview/:token');
  assert.equal(safeLogPath('/attiva/pilot-token-7f3a'), '/attiva/:token');
  assert.equal(safeLogPath('/r/report-token-99'), '/r/:token');
  assert.equal(safeLogPath('/api/health'), '/api/health');
});
