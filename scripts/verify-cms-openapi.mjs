import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const specPath = process.argv[2] || path.resolve(__dirname, '../docs/cms-api-spec.json');

const requiredGetPaths = [
  '/about',
  '/global',
  '/articles',
  '/authors',
  '/categories',
  '/faqs',
  '/navigations',
  '/navigation-items',
  '/pages',
  '/products',
  '/product-categories',
  '/promotions',
  '/customer-segments',
];

const forbiddenPathPatterns = [
  /^\/admin(?:\/|$)/,
  /^\/content-manager(?:\/|$)/,
  /^\/content-type-builder(?:\/|$)/,
  /^\/email(?:\/|$)/,
  /^\/i18n(?:\/|$)/,
  /^\/upload(?:\/|$)/,
  /^\/users-permissions(?:\/|$)/,
  /^\/auth(?:\/|$)/,
  /^\/users(?:\/|$)/,
  /^\/connect(?:\/|$)/,
];

let exitCode = 0;
const fail = (message) => {
  console.error(`FAIL: ${message}`);
  exitCode = 1;
};

try {
  const spec = JSON.parse(await readFile(specPath, 'utf8'));
  const paths = spec.paths ?? {};
  const pathNames = Object.keys(paths);

  for (const requiredPath of requiredGetPaths) {
    if (!paths[requiredPath]?.get) {
      fail(`Missing required CMS GET path: ${requiredPath}`);
    }
  }

  const forbiddenPaths = pathNames.filter((p) =>
    forbiddenPathPatterns.some((pattern) => pattern.test(p)),
  );

  if (forbiddenPaths.length > 0) {
    fail(`Forbidden CMS OpenAPI paths found: ${forbiddenPaths.join(', ')}`);
  }

  if (exitCode === 0) {
    console.log(
      `CMS OpenAPI verification passed: ${requiredGetPaths.length} required GET paths present, no forbidden paths found.`,
    );
  }
} catch (error) {
  fail(`Could not read spec file at ${specPath}: ${error.message}`);
}

process.exit(exitCode);
