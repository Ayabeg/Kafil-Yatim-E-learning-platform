import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const port = 49100 + Math.floor(Math.random() * 500);
const tempDir = mkdtempSync(join(tmpdir(), 'kafil-api-'));
const databasePath = join(tempDir, 'smoke.sqlite');
const baseUrl = `http://localhost:${port}`;
const child = spawn(process.execPath, ['server/index.js'], {
  env: { ...process.env, NODE_ENV: 'test', PORT: String(port), APP_ORIGIN: baseUrl, KAFIL_DATABASE_PATH: databasePath, BETTER_AUTH_SECRET: 'smoke-test-secret' },
  stdio: ['ignore', 'pipe', 'pipe'],
});

async function waitForHealth() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('API did not become healthy in time.');
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers: { Origin: baseUrl, ...(options.headers ?? {}) } });
  const body = await response.json().catch(() => ({}));
  return { response, body };
}

try {
  await waitForHealth();
  const signup = await request('/api/auth/sign-up/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Smoke Learner', email: `smoke-${Date.now()}@example.com`, password: 'ChangeMe123!' }),
  });
  assert.equal(signup.response.status, 200);
  const cookie = signup.response.headers.getSetCookie()[0].split(';')[0];

  const me = await request('/api/me', { headers: { Cookie: cookie } });
  assert.equal(me.response.status, 200);
  assert.equal(me.body.user.role, 'learner');

  const completion = await request('/api/courses/confidence/lessons/1/complete', { method: 'POST', headers: { Cookie: cookie } });
  assert.equal(completion.response.status, 200);
  assert.equal(completion.body.progress, 13);

  const crossSiteMutation = await request('/api/courses/confidence/lessons/2/complete', { method: 'POST', headers: { Cookie: cookie, Origin: 'https://evil.example' } });
  assert.equal(crossSiteMutation.response.status, 403);

  const forbidden = await request('/api/admin/overview', { headers: { Cookie: cookie } });
  assert.equal(forbidden.response.status, 403);
  console.log('API smoke test passed: signup, session, progress persistence, and role isolation.');
} finally {
  child.kill('SIGTERM');
  rmSync(tempDir, { recursive: true, force: true });
}
