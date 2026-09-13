import { test, expect } from '@playwright/test';

async function shipX(page) {
  return page.locator('canvas').evaluate((canvas) => {
    const pixels = canvas.getContext('2d').getImageData(0, 568, 800, 1).data;
    for (let x = 0; x < 800; x++) {
      if (pixels[x * 4] === 117 && pixels[x * 4 + 1] === 245 && pixels[x * 4 + 2] === 208) return x;
    }
    return -1;
  });
}

async function bulletPixels(page) {
  return page.locator('canvas').evaluate((canvas) => {
    const pixels = canvas.getContext('2d').getImageData(0, 0, 800, 550).data;
    let count = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i] === 240 && pixels[i + 1] === 248 && pixels[i + 2] === 255) count++;
    }
    return count;
  });
}

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-13T12:00:00Z') });
  await page.clock.pauseAt(new Date('2026-09-13T12:00:01Z'));
  await page.goto('/');
});

test('TC-01 제목 입력 무시, 버튼 시작, 접근 가능한 초기 상태', async ({ page }, testInfo) => {
  await expect(page.getByRole('status', { name: '작전 상태' })).toHaveAttribute('data-state', 'title');
  await expect(page.getByLabel('점수', { exact: true })).toHaveText('0');
  await page.keyboard.press('r');
  await page.keyboard.down('ArrowLeft');
  await page.keyboard.down('Space');
  await page.clock.runFor(500);
  expect(await shipX(page)).toBe(380);
  expect(await bulletPixels(page)).toBe(0);
  await page.keyboard.up('ArrowLeft');
  await page.keyboard.up('Space');
  await page.screenshot({ path: testInfo.outputPath('title.png'), fullPage: true });
  await page.getByRole('button', { name: '게임 시작' }).click();
  await expect(page.getByRole('status', { name: '작전 상태' })).toHaveAttribute('data-state', 'playing');
  await expect(page.getByLabel('남은 적')).toHaveText('24');
  await expect(page.getByRole('button', { name: '게임 시작' })).toBeHidden();
  await expect(page.getByRole('button', { name: '다시 도전' })).toBeHidden();
});

test('TC-02 Enter 시작, 화살표와 A/D, 양방향 정지와 화면 경계', async ({ page }) => {
  await page.keyboard.press('Enter');
  await page.clock.runFor(32);
  await page.keyboard.down('ArrowRight');
  await page.clock.runFor(500);
  await page.keyboard.up('ArrowRight');
  expect(await shipX(page)).toBeGreaterThan(530);
  expect(await shipX(page)).toBeLessThan(550);
  await page.keyboard.down('a');
  await page.clock.runFor(250);
  await page.keyboard.up('a');
  expect(await shipX(page)).toBeGreaterThan(450);
  expect(await shipX(page)).toBeLessThan(470);
  await page.keyboard.down('ArrowLeft');
  await page.keyboard.down('d');
  const stopped = await shipX(page);
  await page.clock.runFor(500);
  expect(await shipX(page)).toBe(stopped);
  await page.keyboard.up('ArrowLeft');
  await page.clock.runFor(2000);
  expect(await shipX(page)).toBe(760);
  await page.keyboard.up('d');
  await page.keyboard.down('ArrowLeft');
  await page.clock.runFor(3000);
  await page.keyboard.up('ArrowLeft');
  expect(await shipX(page)).toBe(0);
});

test('TC-03 실제 발사는 Canvas를 바꾸고 적중 시 DOM 점수가 증가한다', async ({ page }, testInfo) => {
  await page.keyboard.press('Enter');
  await page.clock.runFor(32);
  const initial = await page.locator('canvas').screenshot();
  await page.keyboard.down('Space');
  await page.clock.runFor(96);
  expect(await bulletPixels(page)).toBeGreaterThan(0);
  expect((await page.locator('canvas').screenshot()).equals(initial)).toBe(false);
  await page.clock.runFor(4000);
  await page.keyboard.up('Space');
  const score = Number(await page.getByLabel('점수', { exact: true }).textContent());
  expect(score).toBeGreaterThanOrEqual(10);
  expect(score % 10).toBe(0);
  await expect(page.getByLabel('남은 적')).toHaveText(String(24 - score / 10));
  await page.screenshot({ path: testInfo.outputPath('playing.png'), fullPage: true });
});

test('TC-08 제목에서 유지한 Space와 반복 Enter가 새 판에 남지 않는다', async ({ page }) => {
  await page.keyboard.down('Space');
  await page.keyboard.down('Enter');
  await page.clock.runFor(300);
  await page.keyboard.down('Space');
  await page.keyboard.down('Enter');
  await page.clock.runFor(300);
  expect(await bulletPixels(page)).toBe(0);
  await expect(page.getByRole('status', { name: '작전 상태' })).toHaveAttribute('data-state', 'playing');
  await page.keyboard.up('Enter');
  await page.keyboard.up('Space');
  await page.keyboard.down('Space');
  await page.clock.runFor(32);
  expect(await bulletPixels(page)).toBeGreaterThan(0);
});

test('TC-08 blur와 복귀는 키·시각을 초기화하며 진행 중 Enter/R은 무시한다', async ({ page }) => {
  await page.keyboard.press('Enter');
  await page.clock.runFor(32);
  await page.keyboard.down('ArrowRight');
  await page.clock.runFor(300);
  const x = await shipX(page);
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await page.clock.fastForward(60_000);
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await page.keyboard.down('ArrowRight');
  await page.keyboard.press('Enter');
  await page.keyboard.press('r');
  await page.clock.runFor(500);
  expect(await shipX(page)).toBe(x);
  await expect(page.getByRole('status', { name: '작전 상태' })).toHaveAttribute('data-state', 'playing');
  await page.keyboard.up('ArrowRight');
  await page.keyboard.down('ArrowRight');
  await page.clock.runFor(200);
  expect(await shipX(page)).toBeGreaterThan(x + 50);
  expect(await shipX(page)).toBeLessThan(x + 70);
});

for (const key of ['Enter', 'Space']) {
  test(`TC-08 시작 버튼의 ${key} 기본 활성화는 중복 없이 시작한다`, async ({ page }) => {
    await page.getByRole('button', { name: '게임 시작' }).focus();
    await page.keyboard.press(key);
    await page.clock.runFor(300);
    await expect(page.getByRole('status', { name: '작전 상태' })).toHaveAttribute('data-state', 'playing');
    await expect(page.getByLabel('점수', { exact: true })).toHaveText('0');
    expect(await shipX(page)).toBe(380);
    expect(await bulletPixels(page)).toBe(0);
  });
}

test('TC-10 반응형 Canvas와 로컬 리소스·실행 오류 검사', async ({ page }) => {
  const errors = [];
  const failed = [];
  const external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', (request) => failed.push(request.url()));
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:5173') external.push(request.url());
  });
  await page.reload();
  await page.setViewportSize({ width: 480, height: 850 });
  const box = await page.locator('canvas').boundingBox();
  expect(box.width).toBeLessThan(480);
  expect(box.width / box.height).toBeCloseTo(4 / 3, 2);
  await expect(page.getByRole('button', { name: '게임 시작' })).toBeInViewport();
  await page.getByRole('button', { name: '게임 시작' }).click();
  await page.clock.runFor(100);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
  expect(external).toEqual([]);
});

test('TC-12 자연 하강 패배·종료 동결·R과 버튼 재시작을 반복한다', async ({ page }) => {
  test.setTimeout(60_000);
  await page.keyboard.press('Enter');
  for (const mode of ['key', 'button']) {
    await page.clock.runFor(60_000);
    await expect(page.getByRole('status', { name: '작전 상태' })).toHaveAttribute('data-state', 'lost');
    const frozen = await page.locator('canvas').screenshot();
    await page.keyboard.down('ArrowLeft');
    await page.keyboard.down('Space');
    await page.clock.runFor(500);
    expect((await page.locator('canvas').screenshot()).equals(frozen)).toBe(true);
    if (mode === 'key') await page.keyboard.press('r');
    else await page.getByRole('button', { name: '다시 도전' }).click();
    await page.clock.runFor(250);
    await expect(page.getByRole('status', { name: '작전 상태' })).toHaveAttribute('data-state', 'playing');
    await expect(page.getByLabel('점수', { exact: true })).toHaveText('0');
    await expect(page.getByLabel('남은 적')).toHaveText('24');
    expect(await shipX(page)).toBe(380);
    expect(await bulletPixels(page)).toBe(0);
    await page.keyboard.up('ArrowLeft');
    await page.keyboard.up('Space');
  }
  await page.keyboard.down('ArrowRight');
  await page.clock.runFor(500);
  expect(await shipX(page)).toBeGreaterThan(530);
  expect(await shipX(page)).toBeLessThan(550);
  await page.keyboard.up('ArrowRight');
  await page.keyboard.down('Space');
  await page.clock.runFor(32);
  expect(await bulletPixels(page)).toBeGreaterThan(0);
});

test('TC-12 실제 키 조작으로 전멸·240점 승리와 버튼 키보드 재시작을 확인한다', async ({ page }, testInfo) => {
  test.setTimeout(60_000);
  await page.keyboard.press('Enter');
  await page.keyboard.down('Space');
  await page.keyboard.down('ArrowLeft');
  await page.clock.runFor(1200);
  await page.keyboard.up('ArrowLeft');
  for (let sweep = 0; sweep < 16; sweep++) {
    if (await page.locator('#status').getAttribute('data-state') !== 'playing') break;
    const direction = sweep % 2 === 0 ? 'ArrowRight' : 'ArrowLeft';
    await page.keyboard.down(direction);
    await page.clock.runFor(2400);
    await page.keyboard.up(direction);
  }
  await expect(page.getByRole('status', { name: '작전 상태' })).toHaveAttribute('data-state', 'won');
  await expect(page.getByLabel('점수', { exact: true })).toHaveText('240');
  await expect(page.getByLabel('남은 적')).toHaveText('0');
  const frozen = await page.locator('canvas').screenshot();
  await page.keyboard.press('Enter');
  await page.keyboard.down('ArrowRight');
  await page.clock.runFor(500);
  expect((await page.locator('canvas').screenshot()).equals(frozen)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('won.png'), fullPage: true });
  await page.keyboard.up('ArrowRight');
  await page.keyboard.up('Space');
  await page.getByRole('button', { name: '다시 도전' }).focus();
  await page.keyboard.press('Enter');
  await page.clock.runFor(250);
  await expect(page.getByRole('status', { name: '작전 상태' })).toHaveAttribute('data-state', 'playing');
  await expect(page.getByLabel('점수', { exact: true })).toHaveText('0');
  await expect(page.getByLabel('남은 적')).toHaveText('24');
  expect(await shipX(page)).toBe(380);
  expect(await bulletPixels(page)).toBe(0);
  await page.keyboard.down('Space');
  await page.clock.runFor(32);
  expect(await bulletPixels(page)).toBeGreaterThan(0);
});
