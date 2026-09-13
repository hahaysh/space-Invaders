import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, relative, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const prefix = '/improved-release/';
const assets = new Map();
for (const file of await readdir(root, { recursive: true, withFileTypes: true })) {
  if (!file.isFile()) continue;
  const path = resolve(file.parentPath, file.name);
  assets.set(prefix + relative(root, path).split(sep).join('/'), await readFile(path));
}
const html = assets.get(`${prefix}index.html`).toString();
assert.match(html, /src="\.\/assets\//);
assert.match(html, /href="\.\/assets\//);
assert.equal(assets.size, 3);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' };
const server = createServer((request, response) => {
  const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
  const path = pathname === prefix ? `${prefix}index.html` : pathname;
  const content = assets.get(path);
  response.writeHead(content ? 200 : 404, { 'Content-Type': mime[extname(path)] ?? 'text/plain' });
  response.end(content ?? '찾을 수 없습니다.');
});
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage();
  const failures = [];
  const requests = [];
  const origin = `http://127.0.0.1:${server.address().port}`;
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('requestfailed', (request) => failures.push(request.url()));
  page.on('response', (response) => { if (response.status() >= 400) failures.push(response.url()); });
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(`${origin}${prefix}`);
  assert.equal(await page.locator('#status').getAttribute('data-state'), 'title');
  await page.getByRole('button', { name: '게임 시작' }).click();
  assert.equal(await page.locator('#status').getAttribute('data-state'), 'playing');
  assert.equal(await page.getByLabel('점수', { exact: true }).textContent(), '0');
  await page.keyboard.press('p');
  assert.equal(await page.locator('#status').getAttribute('data-state'), 'paused');
  assert.match(await page.locator('#shortcut').textContent(), /P 키로 재개/);
  assert.equal(await page.getByRole('button').count(), 0);
  await page.keyboard.press('p');
  assert.equal(await page.locator('#status').getAttribute('data-state'), 'playing');
  assert.equal(await page.locator('#overlay').isVisible(), false);
  assert.deepEqual(failures, []);
  assert.ok(requests.every((url) => url.startsWith(`${origin}${prefix}`)));
  assert.equal(requests.length, 3);
  console.log(`TC-11 통과: 하위 경로 ${prefix}, 로컬 요청 ${requests.length}개, 오류 0개, 시작 playing·0점, P 정지·재개, 빌드 파일 ${assets.size}개.`);
  console.log(`Chromium ${browser.version()}`);
} finally {
  if (browser) await browser.close();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
