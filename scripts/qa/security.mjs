import { join } from 'node:path';
import {
  assertErrorEnvelope,
  curlJson,
  Evidence,
  EVIDENCE_DIR,
  runCheck,
  withServices,
} from './lib.mjs';

const evidence = new Evidence(
  join(EVIDENCE_DIR, 'task-11-live-security.txt'),
  'Task 11 live BFF security checks',
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

async function checkSwaggerReadOnly() {
  const response = await curlJson('/api/docs-json');
  if (response.status !== 200) {
    throw new Error(`/api/docs-json returned ${response.status}`);
  }

  const forbiddenMethods = ['post', 'put', 'patch', 'delete'];
  const paths = response.json?.paths ?? {};
  const forbiddenOperations = [];

  for (const [path, operations] of Object.entries(paths)) {
    for (const method of forbiddenMethods) {
      if (operations?.[method]) {
        forbiddenOperations.push(`${method.toUpperCase()} ${path}`);
      }
    }
  }

  if (forbiddenOperations.length > 0) {
    throw new Error(`forbidden write operations: ${forbiddenOperations.join(', ')}`);
  }

  return `Swagger exposes ${Object.keys(paths).length} path(s) and no write operations`;
}

try {
  await withServices(
    evidence,
    async () => {
      await expectErrorStatus(
        'POST /api/v1/articles rejects writes',
        '/api/v1/articles',
        405,
        'METHOD_NOT_ALLOWED',
        { method: 'POST' },
      );
      await expectErrorStatus(
        'GET /api/v1/articles?populate=* rejects unknown params',
        '/api/v1/articles?populate=*',
        400,
        'BAD_REQUEST',
      );
      await expectErrorStatus(
        'GET /api/v1/articles?pageSize=51 rejects overflow',
        '/api/v1/articles?pageSize=51',
        400,
        'BAD_REQUEST',
      );
      await runCheck(evidence, 'Swagger JSON has no write operations', checkSwaggerReadOnly);
    },
    { cms: false },
  );
} catch (error) {
  evidence.fail('security runner', error instanceof Error ? error.message : String(error));
} finally {
  await evidence.write();
}

evidence.assertClean();
