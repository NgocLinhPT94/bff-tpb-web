import { join } from 'node:path';
import {
  assertErrorEnvelope,
  assertSuccessEnvelope,
  BFF_BASE_URL,
  curlJson,
  Evidence,
  EVIDENCE_DIR,
  runCheck,
  withServices,
} from './lib.mjs';

const evidence = new Evidence(
  join(EVIDENCE_DIR, 'task-11-live-smoke.txt'),
  'Task 11 live BFF smoke checks',
);

const singletonRoutes = [
  { name: 'global', path: '/api/v1/global' },
  { name: 'about', path: '/api/v1/about' },
];

const collectionRoutes = [
  { name: 'articles', path: '/api/v1/articles' },
  { name: 'authors', path: '/api/v1/authors' },
  { name: 'categories', path: '/api/v1/categories' },
  { name: 'faqs', path: '/api/v1/faqs' },
  { name: 'navigations', path: '/api/v1/navigations' },
  { name: 'navigation-items', path: '/api/v1/navigation-items' },
  { name: 'pages', path: '/api/v1/pages' },
  { name: 'products', path: '/api/v1/products' },
  { name: 'promotions', path: '/api/v1/promotions' },
];

const missingDocumentId = 'zzzzzzzzzzzzzzzzzzzzzzzz';

async function checkSingleton(route) {
  const response = await curlJson(route.path);

  if (response.status === 200) {
    assertSuccessEnvelope(response.json, { objectData: true });
    return `${route.path} returned success envelope`;
  }

  if (response.status === 404) {
    assertErrorEnvelope(response.json, 'NOT_FOUND');
    return `${route.path} returned documented 404 for missing singleton content`;
  }

  throw new Error(`${route.path} returned ${response.status}`);
}

async function checkCollection(route) {
  const listResponse = await curlJson(`${route.path}?pageSize=1`);
  if (listResponse.status !== 200) {
    throw new Error(`${route.path} list returned ${listResponse.status}`);
  }

  assertSuccessEnvelope(listResponse.json, {
    arrayData: true,
    pagination: true,
  });

  const firstItem = listResponse.json.data[0];
  const documentId = firstItem?.documentId;

  if (firstItem && typeof documentId !== 'string') {
    throw new Error(`${route.path} first item is missing documentId`);
  }

  const detailPath = `${route.path}/${documentId ?? missingDocumentId}`;
  const detailResponse = await curlJson(detailPath);

  if (documentId) {
    if (detailResponse.status !== 200) {
      throw new Error(`${detailPath} returned ${detailResponse.status}`);
    }
    assertSuccessEnvelope(detailResponse.json, { objectData: true });
    return `${route.path} list envelope valid; ${detailPath} returned detail envelope`;
  }

  if (detailResponse.status !== 404) {
    throw new Error(
      `${detailPath} should return 404 for empty collection probe, got ${detailResponse.status}`,
    );
  }

  assertErrorEnvelope(detailResponse.json, 'NOT_FOUND');
  return `${route.path} empty list envelope valid; ${detailPath} returned documented 404`;
}

try {
  await withServices(evidence, async () => {
    evidence.info(`Running smoke checks against ${BFF_BASE_URL}`);

    for (const route of singletonRoutes) {
      await runCheck(evidence, `GET ${route.path}`, () => checkSingleton(route));
    }

    for (const route of collectionRoutes) {
      await runCheck(evidence, `GET ${route.path} and ${route.path}/:documentId`, () =>
        checkCollection(route),
      );
    }
  });
} catch (error) {
  evidence.fail('live smoke runner', error instanceof Error ? error.message : String(error));
} finally {
  await evidence.write();
}

evidence.assertClean();
