import { readFile } from 'node:fs/promises';

const specPath = new URL('../../cms-tpb-web/docs/api-spec.json', import.meta.url);

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
  '/promotions',
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

const fail = (message) => {
  console.error(message);
  process.exitCode = 1;
};

const spec = JSON.parse(await readFile(specPath, 'utf8'));
const paths = spec.paths ?? {};
const pathNames = Object.keys(paths);
const bffRelevantPathPrefixes = requiredGetPaths.map((path) => `${path}/`);
const bffRelevantPaths = pathNames.filter(
  (path) => requiredGetPaths.includes(path) || bffRelevantPathPrefixes.some((prefix) => path.startsWith(prefix)),
);

for (const path of requiredGetPaths) {
  if (!paths[path]?.get) {
    fail(`Missing required CMS GET path: ${path}`);
  }
}

const forbiddenPaths = bffRelevantPaths.filter((path) =>
  forbiddenPathPatterns.some((pattern) => pattern.test(path)),
);

if (forbiddenPaths.length > 0) {
  fail(`Forbidden CMS OpenAPI paths found: ${forbiddenPaths.join(', ')}`);
}

if (process.exitCode) {
  process.exit();
}

console.log(
  `CMS OpenAPI verification passed: ${requiredGetPaths.length} required GET paths present and no forbidden plugin/admin/auth/upload paths found.`,
);
