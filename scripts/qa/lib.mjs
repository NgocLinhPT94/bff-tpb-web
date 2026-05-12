import { spawn, execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const scriptRoot = dirname(fileURLToPath(import.meta.url));

export const BFF_ROOT = resolve(scriptRoot, '../..');
export const WORKSPACE_ROOT = resolve(BFF_ROOT, '..');
export const CMS_ROOT = join(WORKSPACE_ROOT, 'cms-tpb-web');
export const EVIDENCE_DIR = join(WORKSPACE_ROOT, '.sisyphus/evidence');
export const BFF_BASE_URL = 'http://localhost:3000';
export const CMS_BASE_URL = 'http://localhost:1337';

const sleep = (milliseconds) =>
  new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds));

export class Evidence {
  constructor(filePath, title) {
    this.filePath = filePath;
    this.lines = [title, `Started: ${new Date().toISOString()}`];
    this.failures = 0;
  }

  info(message) {
    this.lines.push(`INFO ${message}`);
  }

  pass(name, detail) {
    this.lines.push(`PASS ${name}${detail ? ` - ${detail}` : ''}`);
  }

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

export async function ensureBffEnv(evidence) {
  const envPath = join(BFF_ROOT, '.env');
  if (existsSync(envPath)) {
    evidence.info('BFF .env already exists; leaving it unchanged');
    return;
  }

  await copyFile(join(BFF_ROOT, '.env.example'), envPath);
  evidence.pass('BFF .env bootstrap', 'copied .env.example to .env');
}

async function readDotenv(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  const values = {};
  const contents = await readFile(filePath, 'utf8');

  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) {
      continue;
    }
    values[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }

  return values;
}

async function resolveStrapiApiToken(evidence) {
  if (process.env.STRAPI_API_TOKEN) {
    evidence.info('Using STRAPI_API_TOKEN from current process environment');
    return process.env.STRAPI_API_TOKEN;
  }

  const bffEnv = await readDotenv(join(BFF_ROOT, '.env'));
  if (bffEnv.STRAPI_API_TOKEN) {
    evidence.info('Using STRAPI_API_TOKEN from BFF .env');
    return bffEnv.STRAPI_API_TOKEN;
  }

  evidence.info('No STRAPI_API_TOKEN found; BFF will use public CMS access');
  return undefined;
}

export async function curlJson(pathOrUrl, options = {}) {
  const url = pathOrUrl.startsWith('http')
    ? pathOrUrl
    : `${BFF_BASE_URL}${pathOrUrl}`;
  const args = [
    '--silent',
    '--show-error',
    '--max-time',
    String(options.timeoutSeconds ?? 15),
    '--request',
    options.method ?? 'GET',
    '--write-out',
    '\n%{http_code}',
    url,
  ];

  const { stdout } = await execFileAsync('curl', args, {
    maxBuffer: 10 * 1024 * 1024,
  });
  const separator = stdout.lastIndexOf('\n');
  const body = separator === -1 ? '' : stdout.slice(0, separator);
  const status = Number(stdout.slice(separator + 1));
  let json = null;

  if (body.trim().length > 0) {
    try {
      json = JSON.parse(body);
    } catch (error) {
      if (!options.allowNonJson) {
        throw error;
      }
    }
  }

  return { status, json, body, url };
}

export async function waitForUrl(url, label, evidence, options = {}) {
  const deadline = Date.now() + (options.timeoutMs ?? 120_000);
  let lastError = '';

  while (Date.now() < deadline) {
    if (options.processRecord?.exited) {
      throw new Error(
        `${label} process exited before readiness with code ${options.processRecord.exitCode}`,
      );
    }

    try {
      const response = await curlJson(url, {
        allowNonJson: true,
        timeoutSeconds: 5,
      });
      if ((options.expectedStatuses ?? [200]).includes(response.status)) {
        evidence.pass(`${label} readiness`, `${url} returned ${response.status}`);
        return;
      }
      lastError = `status ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await sleep(options.intervalMs ?? 2_000);
  }

  throw new Error(`${label} did not become ready at ${url}: ${lastError}`);
}

export async function startProcess(name, command, args, cwd, evidence, env = {}) {
  const child = spawn(command, args, {
    cwd,
    detached: true,
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const logPath = join(EVIDENCE_DIR, `task-11-${name}.log`);
  const chunks = [];
  const record = { name, child, cwd, exited: false, exitCode: null, logPath };

  child.stdout.on('data', (data) => chunks.push(data));
  child.stderr.on('data', (data) => chunks.push(data));
  child.on('exit', (code) => {
    record.exited = true;
    record.exitCode = code;
  });

  evidence.info(`${name} PID ${child.pid} started with ${command} ${args.join(' ')}`);
  evidence.info(`${name} log path ${logPath}`);

  record.flushLog = async () => {
    await mkdir(dirname(logPath), { recursive: true });
    await writeFile(logPath, Buffer.concat(chunks).toString('utf8'));
  };

  return record;
}

async function getProcessRows() {
  const { stdout } = await execFileAsync('ps', ['-Ao', 'pid=,pgid=,command='], {
    maxBuffer: 5 * 1024 * 1024,
  });

  return stdout
    .split('\n')
    .map((line) => line.match(/^\s*(\d+)\s+(\d+)\s+(.+)$/))
    .filter(Boolean)
    .map((match) => ({
      pid: Number(match[1]),
      pgid: Number(match[2]),
      command: match[3],
    }));
}

async function getListeningPids(port) {
  try {
    const { stdout } = await execFileAsync('lsof', [
      '-nP',
      `-iTCP:${port}`,
      '-sTCP:LISTEN',
      '-Fp',
    ]);

    return stdout
      .split('\n')
      .filter((line) => line.startsWith('p'))
      .map((line) => Number(line.slice(1)))
      .filter(Number.isInteger);
  } catch (error) {
    if (error?.code === 1) {
      return [];
    }
    throw error;
  }
}

async function killProjectProcesses(projectRoot, name, evidence) {
  const rows = await getProcessRows();
  const matches = rows.filter(
    (row) => row.pid !== process.pid && row.command.includes(projectRoot),
  );
  const groups = [...new Set(matches.map((row) => row.pgid))];

  for (const pgid of groups) {
    try {
      process.kill(-pgid, 'SIGTERM');
      evidence.info(`${name} cleanup sent SIGTERM to process group ${pgid}`);
    } catch (error) {
      if (error?.code !== 'ESRCH') {
        evidence.fail(`${name} cleanup`, `project process SIGTERM failed: ${error.message}`);
      }
    }
  }

  if (groups.length > 0) {
    await sleep(3_000);
  }
}

async function assertPortAvailable(port, projectRoot, label, evidence) {
  const pids = await getListeningPids(port);
  if (pids.length === 0) {
    return;
  }

  const rows = await getProcessRows();
  const occupants = pids.map((pid) => rows.find((row) => row.pid === pid));
  const projectOwned = occupants.every((row) => row?.command.includes(projectRoot));

  if (!projectOwned) {
    throw new Error(
      `${label} port ${port} is already in use by non-project PID(s): ${pids.join(', ')}`,
    );
  }

  evidence.info(
    `${label} port ${port} had stale project PID(s) ${pids.join(', ')}; stopping before start`,
  );
  await killProjectProcesses(projectRoot, label, evidence);
}

export async function stopProcess(record, evidence) {
  if (record.exited) {
    evidence.pass(`${record.name} cleanup`, `process already exited with ${record.exitCode}`);
    await record.flushLog();
    return;
  }

  const closePromise = new Promise((resolveClose) => {
    record.child.once('close', resolveClose);
  });

  try {
    process.kill(-record.child.pid, 'SIGTERM');
  } catch (error) {
    if (error?.code !== 'ESRCH') {
      evidence.fail(`${record.name} cleanup`, `SIGTERM failed: ${error.message}`);
    }
  }

  const closed = await Promise.race([
    closePromise.then(() => true),
    sleep(10_000).then(() => false),
  ]);

  if (!closed) {
    try {
      process.kill(-record.child.pid, 'SIGKILL');
    } catch (error) {
      if (error?.code !== 'ESRCH') {
        evidence.fail(`${record.name} cleanup`, `SIGKILL failed: ${error.message}`);
      }
    }
    await Promise.race([closePromise, sleep(5_000)]);
  }

  await killProjectProcesses(record.cwd, record.name, evidence);

  evidence.pass(`${record.name} cleanup`, `stopped PID ${record.child.pid}`);
  await record.flushLog();
}

export async function withServices(evidence, callback, options = {}) {
  await ensureBffEnv(evidence);
  const records = [];

  try {
    if (options.cms !== false) {
      await assertPortAvailable(1337, CMS_ROOT, 'CMS', evidence);
      const cms = await startProcess('cms', 'npm', ['run', 'start'], CMS_ROOT, evidence);
      records.push(cms);
      await waitForUrl(`${CMS_BASE_URL}/admin`, 'CMS', evidence, {
        processRecord: cms,
        expectedStatuses: [200, 301, 302],
        timeoutMs: 180_000,
      });
    }

    await assertPortAvailable(3000, BFF_ROOT, 'BFF', evidence);
    const strapiApiToken = await resolveStrapiApiToken(evidence);
    const bffEnv = {
      PORT: '3000',
      NODE_ENV: 'development',
      STRAPI_BASE_URL: `${CMS_BASE_URL}/api`,
    };

    if (strapiApiToken) {
      bffEnv.STRAPI_API_TOKEN = strapiApiToken;
    } else {
      evidence.info('No STRAPI_API_TOKEN found; BFF will use public CMS access');
    }

    const bff = await startProcess('bff', 'npm', ['run', 'start'], BFF_ROOT, evidence, bffEnv);
    records.push(bff);
    await waitForUrl(`${BFF_BASE_URL}/api/docs-json`, 'BFF', evidence, {
      processRecord: bff,
      timeoutMs: 120_000,
    });

    await callback();
  } finally {
    for (const record of records.reverse()) {
      await stopProcess(record, evidence);
    }
  }
}

export function assertSuccessEnvelope(payload, options = {}) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('response is not an object');
  }
  if (!Object.prototype.hasOwnProperty.call(payload, 'data')) {
    throw new Error('missing data property');
  }
  if (!payload.meta || typeof payload.meta.requestId !== 'string') {
    throw new Error('missing meta.requestId');
  }
  if (options.arrayData && !Array.isArray(payload.data)) {
    throw new Error('data is not an array');
  }
  if (options.objectData && (payload.data === null || typeof payload.data !== 'object')) {
    throw new Error('data is not an object');
  }
  if (options.pagination) {
    const pagination = payload.meta.pagination;
    if (!pagination || typeof pagination !== 'object') {
      throw new Error('missing meta.pagination');
    }
    for (const key of ['page', 'pageSize', 'pageCount', 'total']) {
      if (typeof pagination[key] !== 'number') {
        throw new Error(`pagination.${key} is not numeric`);
      }
    }
  }
}

export function assertErrorEnvelope(payload, expectedCode) {
  if (!payload?.error || typeof payload.error !== 'object') {
    throw new Error('missing error envelope');
  }
  if (expectedCode && payload.error.code !== expectedCode) {
    throw new Error(`expected ${expectedCode}, got ${payload.error.code}`);
  }
  if (typeof payload.error.message !== 'string') {
    throw new Error('missing error.message');
  }
  if (typeof payload.error.requestId !== 'string') {
    throw new Error('missing error.requestId');
  }
}

export async function runCheck(evidence, name, check) {
  try {
    const detail = await check();
    evidence.pass(name, detail);
  } catch (error) {
    evidence.fail(name, error instanceof Error ? error.message : String(error));
  }
}
