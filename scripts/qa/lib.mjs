import { spawn, execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const scriptRoot = dirname(fileURLToPath(import.meta.url));

export const BFF_ROOT = resolve(scriptRoot, '../..');
export const EVIDENCE_DIR = join(BFF_ROOT, 'qa-evidence');
export const BFF_BASE_URL = process.env.BFF_URL || 'http://localhost:3001';
export const CMS_BASE_URL = process.env.CMS_URL || 'http://localhost:1337';

const sleep = (milliseconds) =>
  new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds));

export class Evidence {
  constructor(filePath, title) {
    this.filePath = filePath;
    this.lines = [title, `Started: ${new Date().toISOString()}`];
    this.failures = 0;
  }

  info(message) { this.lines.push(`INFO ${message}`); }
  pass(name, detail) { this.lines.push(`PASS ${name}${detail ? ` - ${detail}` : ''}`); }
  fail(name, detail) {
    this.failures += 1;
    this.lines.push(`FAIL ${name}${detail ? ` - ${detail}` : ''}`);
  }

  async write() {
    this.lines.push(`Finished: ${new Date().toISOString()}`);
    this.lines.push(`Result: ${this.failures === 0 ? 'PASS' : 'FAIL'}`);
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, `${this.lines.join('\n')}\n`);
  }

  assertClean() {
    if (this.failures > 0) {
      throw new Error(`${this.failures} QA check(s) failed`);
    }
  }
}

export async function curlJson(pathOrUrl, options = {}) {
  const url = pathOrUrl.startsWith('http')
    ? pathOrUrl
    : `${BFF_BASE_URL}${pathOrUrl}`;
  const args = [
    '--silent', '--show-error',
    '--max-time', String(options.timeoutSeconds ?? 15),
    '--request', options.method ?? 'GET',
    '--write-out', '\n%{http_code}',
    url,
  ];

  const { stdout } = await execFileAsync('curl', args, { maxBuffer: 10 * 1024 * 1024 });
  const separator = stdout.lastIndexOf('\n');
  const body = separator === -1 ? '' : stdout.slice(0, separator);
  const status = Number(stdout.slice(separator + 1));
  let json = null;

  if (body.trim().length > 0) {
    try { json = JSON.parse(body); } catch (error) {
      if (!options.allowNonJson) throw error;
    }
  }

  return { status, json, body, url };
}

export function assertSuccessEnvelope(payload, options = {}) {
  if (!payload || typeof payload !== 'object') throw new Error('response is not an object');
  if (!Object.prototype.hasOwnProperty.call(payload, 'data')) throw new Error('missing data property');
  if (!payload.meta || typeof payload.meta.requestId !== 'string') throw new Error('missing meta.requestId');
  if (options.arrayData && !Array.isArray(payload.data)) throw new Error('data is not an array');
  if (options.objectData && (payload.data === null || typeof payload.data !== 'object')) throw new Error('data is not an object');
  if (options.pagination) {
    const pagination = payload.meta.pagination;
    if (!pagination || typeof pagination !== 'object') throw new Error('missing meta.pagination');
    for (const key of ['page', 'pageSize', 'pageCount', 'total']) {
      if (typeof pagination[key] !== 'number') throw new Error(`pagination.${key} is not numeric`);
    }
  }
}

export function assertErrorEnvelope(payload, expectedCode) {
  if (!payload?.error || typeof payload.error !== 'object') throw new Error('missing error envelope');
  if (expectedCode && payload.error.code !== expectedCode) throw new Error(`expected ${expectedCode}, got ${payload.error.code}`);
  if (typeof payload.error.message !== 'string') throw new Error('missing error.message');
  if (typeof payload.error.requestId !== 'string') throw new Error('missing error.requestId');
}

export async function runCheck(evidence, name, check) {
  try {
    const detail = await check();
    evidence.pass(name, detail);
  } catch (error) {
    evidence.fail(name, error instanceof Error ? error.message : String(error));
  }
}
