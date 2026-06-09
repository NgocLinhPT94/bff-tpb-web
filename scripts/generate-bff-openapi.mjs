import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const BFF_URL = process.env.BFF_URL || 'http://localhost:3001';
const SPEC_ENDPOINT = `${BFF_URL}/api/docs-json`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(__dirname, '..', 'docs');

async function generate() {
  console.log(`Fetching OpenAPI spec from ${SPEC_ENDPOINT}...`);

  const response = await fetch(SPEC_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Failed to fetch spec: ${response.status} ${response.statusText}`);
  }

  const spec = await response.json();

  await mkdir(docsDir, { recursive: true });

  // Write JSON
  const jsonPath = path.join(docsDir, 'bff-api-spec.json');
  await writeFile(jsonPath, JSON.stringify(spec, null, 2), 'utf8');
  console.log(`Generated: ${jsonPath}`);

  // Write YAML
  const yamlPath = path.join(docsDir, 'bff-api-spec.yaml');
  const yaml = jsonToYaml(spec);
  await writeFile(yamlPath, yaml, 'utf8');
  console.log(`Generated: ${yamlPath}`);

  console.log('\nDone! You can import bff-api-spec.json into Postman.');
}

function jsonToYaml(obj, indent = 0) {
  const pad = '  '.repeat(indent);
  let result = '';

  if (obj === null || obj === undefined) return 'null\n';
  if (typeof obj === 'boolean') return `${obj}\n`;
  if (typeof obj === 'number') return `${obj}\n`;
  if (typeof obj === 'string') {
    if (obj.includes('\n') || obj.includes(':') || obj.includes('#') || obj.includes('"') || obj.includes("'") || obj.startsWith(' ') || obj.endsWith(' ')) {
      return `"${obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n`;
    }
    return `${obj}\n`;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]\n';
    for (const item of obj) {
      if (typeof item === 'object' && item !== null) {
        result += `${pad}- `;
        const inner = jsonToYaml(item, indent + 2).trimStart();
        result += inner;
      } else {
        result += `${pad}- ${jsonToYaml(item, 0).trim()}\n`;
      }
    }
    return result;
  }

  const entries = Object.entries(obj);
  if (entries.length === 0) return '{}\n';

  for (const [key, value] of entries) {
    const safeKey = key.includes(':') || key.includes(' ') ? `"${key}"` : key;
    if (value === null || value === undefined) {
      result += `${pad}${safeKey}: null\n`;
    } else if (typeof value === 'object') {
      result += `${pad}${safeKey}:\n`;
      result += jsonToYaml(value, indent + 1);
    } else {
      result += `${pad}${safeKey}: ${jsonToYaml(value, 0).trim()}\n`;
    }
  }

  return result;
}

generate().catch((error) => {
  console.error('Error:', error.message);
  console.error('\nMake sure BFF server is running: pnpm start:dev');
  process.exit(1);
});
