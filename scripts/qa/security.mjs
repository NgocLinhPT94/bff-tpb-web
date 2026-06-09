import { join } from 'node:path';
import {
  assertErrorEnvelope,
  curlJson,
  Evidence,
  EVIDENCE_DIR,
  runCheck,
} from './lib.mjs';

const evidence = new Evidence(
  join(EVIDENCE_DIR, 'security.txt'),
  'BFF security checks',
);

async function expectErrorStatus(name, path, status, code, options = {}) {
  await runCheck(evidence, name, async () => {
    const response = await curlJson(path, options);
    if (response.status !== status) {
      throw new Error(`${path} returned ${response.status}, expected ${status}`);
    }
    assertErrorEnvelope(response.json, code);
    return `${path} returned ${status} ${code}`;
  });
}

try {
  await expectErrorStatus(
    'POST /api/v1/articles rejects writes',
    '/api/v1/articles', 405, 'METHOD_NOT_ALLOWED', { method: 'POST' },
  );
  await expectErrorStatus(
    'GET /api/v1/articles?populate=* rejects unknown params',
    '/api/v1/articles?populate=*', 400, 'BAD_REQUEST',
  );
  await expectErrorStatus(
    'GET /api/v1/articles?pageSize=51 rejects overflow',
    '/api/v1/articles?pageSize=51', 400, 'BAD_REQUEST',
  );
} catch (error) {
  evidence.fail('security runner', error instanceof Error ? error.message : String(error));
} finally {
  await evidence.write();
}

evidence.assertClean();
