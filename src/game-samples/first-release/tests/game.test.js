import test from 'node:test';
import assert from 'node:assert/strict';
import { RULES, createGame, command, clearInput, keyInput, overlaps, step } from '../src/game.js';

const playing = () => command(createGame(), 'start');
const press = (game, code) => keyInput(game, code, true);
const release = (game, code) => keyInput(game, code, false);
const close = (actual, expected, tolerance = 1e-8) => assert.ok(
  Math.abs(actual - expected) < tolerance, `${actual} ≈ ${expected}`,
);
function advance(game, seconds, frame = 0.01) {
  const count = Math.floor(seconds / frame);
  for (let i = 0; i < count; i++) game = step(game, frame);
  const tail = seconds - count * frame;
  return tail > 1e-12 ? step(game, tail) : game;
}
function target(x = 100, y = 100, id = 0) {
  return { id, x, y, width: 40, height: 24, alive: true };
}
function bullet(x = 110, y = 105, id = 0) {
  return { id, x, y, width: 4, height: 12, bornAt: 0 };
}

test('TC-01 제목은 정지하고 버튼 명령과 Enter 각각 0점으로 시작한다', () => {
  const title = createGame();
  assert.equal(title.status, 'title');
  for (const code of ['ArrowLeft', 'KeyD', 'Space', 'KeyR']) {
    assert.deepEqual(keyInput(title, code, true), title);
  }
  assert.strictEqual(step(title, 0.1), title);
  assert.deepEqual(command(title, 'start'), createGame('playing'));
  assert.deepEqual(press(title, 'Enter'), createGame('playing'));
});

test('TC-01 새 판끼리 배열·객체를 공유하지 않는다', () => {
  const first = createGame();
  const second = createGame();
  first.enemies[0].alive = false;
  first.player.x = 0;
  assert.equal(second.enemies[0].alive, true);
  assert.equal(second.player.x, 380);
});

for (const [code, direction] of [['ArrowLeft', -1], ['KeyA', -1], ['ArrowRight', 1], ['KeyD', 1]]) {
  test(`TC-02 ${code}는 초당 320 이동하고 y를 유지한다`, () => {
    const game = advance(press(playing(), code), 0.5);
    close(game.player.x, 380 + 160 * direction);
    assert.deepEqual([game.player.y, game.player.width, game.player.height], [550, 40, 20]);
  });
}

test('TC-02 좌우 경계는 x 0과 760이다', () => {
  assert.equal(advance(press(playing(), 'ArrowLeft'), 3).player.x, 0);
  assert.equal(advance(press(playing(), 'ArrowRight'), 3).player.x, 760);
});

test('TC-02 양방향은 정지하고 같은 방향 키 하나를 놓아도 유지한다', () => {
  let game = press(press(playing(), 'ArrowLeft'), 'KeyD');
  assert.equal(step(game, 0.1).player.x, 380);
  game = press(press(playing(), 'ArrowLeft'), 'KeyA');
  game = release(game, 'KeyA');
  close(step(game, 0.1).player.x, 348);
});

test('TC-03 첫 발은 즉시, 0.2초 미만은 금지하고 정확한 경계에 발사한다', () => {
  let game = step(press(playing(), 'Space'), 0);
  assert.equal(game.bullets.length, 1);
  assert.equal(game.bullets[0].bornAt, 0);
  assert.deepEqual([game.bullets[0].x, game.bullets[0].y], [398, 538]);
  game = advance(game, 0.2 - 1e-10);
  assert.equal(game.nextBulletId, 1);
  game = step(game, 1e-10);
  assert.equal(game.nextBulletId, 2);
  close(game.bullets.at(-1).bornAt, 0.2, 1e-12);
});

test('TC-03 유지 발사는 시뮬레이션 시간의 0.2초 배수다', () => {
  let game = press(playing(), 'Space');
  const births = new Map();
  for (let i = 0; i < 101; i++) {
    game = step(game, i === 0 ? 0 : 0.01);
    for (const shot of game.bullets) births.set(shot.id, shot.bornAt);
  }
  assert.equal(game.nextBulletId, 6);
  assert.equal(births.size, 6);
  [...births.values()].forEach((time, id) => close(time, id * 0.2, 1e-12));
});

test('TC-03 발사 해제·재입력은 남은 대기시간을 없애지 않는다', () => {
  let game = step(press(playing(), 'Space'), 0);
  game = step(release(game, 'Space'), 0.1);
  game = step(press(game, 'Space'), 0.09);
  assert.equal(game.nextBulletId, 1);
  game = step(game, 0.01);
  assert.equal(game.nextBulletId, 2);
});

test('TC-03 탄환 하단이 0에 닿으면 제거하고 아직 화면에 있으면 유지한다', () => {
  let game = playing();
  game.bullets = [bullet(0, -12, 0), bullet(0, -11.999, 1)];
  game = step(game, 0);
  assert.deepEqual(game.bullets.map((shot) => shot.id), [1]);
  assert.equal(step(game, 0.01).bullets.length, 0);
});

test('TC-04 적은 정확히 3행 8열이고 초기 방향과 수평 속도를 따른다', () => {
  const initial = playing();
  assert.equal(initial.enemies.length, 24);
  assert.equal(new Set(initial.enemies.map((enemy) => enemy.id)).size, 24);
  initial.enemies.forEach((enemy, id) => {
    assert.deepEqual([enemy.x, enemy.y, enemy.width, enemy.height], [112 + (id % 8) * 72, 72 + Math.floor(id / 8) * 48, 40, 24]);
  });
  const next = step(initial, 0.1);
  close(next.enemies[0].x, 118.4);
  assert.equal(next.enemies[0].y, 72);
  assert.equal(next.direction, 1);
});

for (const direction of [-1, 1]) {
  test(`TC-04 방향 ${direction} 경계 도달당 한 번만 하강하고 남은 시간을 이동한다`, () => {
    let game = playing();
    game.direction = direction;
    game.enemies = [target(direction > 0 ? 759 : 1)];
    game = step(game, 0.1);
    assert.equal(game.direction, -direction);
    assert.equal(game.enemies[0].y, 124);
    close(game.enemies[0].x, direction > 0 ? 754.6 : 5.4);
    game = step(game, 0.1);
    assert.equal(game.enemies[0].y, 124);
  });
}

test('TC-04 죽은 적은 편대 경계를 결정하지 않는다', () => {
  const game = playing();
  game.enemies = [target(), { ...target(760, 100, 1), alive: false }];
  const next = step(game, 0.1);
  assert.equal(next.direction, 1);
  assert.equal(next.enemies[0].y, 100);
  close(next.enemies[0].x, 106.4);
});

test('TC-04 경계 위에서 바깥쪽으로 이동하면 한 번만 반전한다', () => {
  const game = playing();
  game.enemies = [target(760)];
  const next = step(game, 0.1);
  assert.equal(next.enemies[0].y, 124);
  assert.equal(next.direction, -1);
  close(next.enemies[0].x, 753.6);
});

test('TC-05 AABB는 양의 면적만 인정하며 모서리·변 접촉은 제외한다', () => {
  const a = target();
  assert.ok(overlaps(a, bullet(110, 110)));
  assert.ok(!overlaps(a, bullet(140, 100)));
  assert.ok(!overlaps(a, bullet(96, 100)));
  assert.ok(!overlaps(a, bullet(100, 124)));
  assert.ok(!overlaps(a, bullet(100, 88)));
  assert.ok(!overlaps(a, bullet(140, 124)));
});

test('TC-05 한 탄환은 겹친 두 적 중 하나만 제거한다', () => {
  const game = playing();
  game.enemies = [target(), target(100, 100, 1)];
  game.bullets = [bullet()];
  const next = step(game, 0);
  assert.equal(next.score, 10);
  assert.equal(next.bullets.length, 0);
  assert.equal(next.enemies.filter((enemy) => enemy.alive).length, 1);
  assert.equal(next.status, 'playing');
});

test('TC-05 두 탄환은 같은 적에서 중복 득점하지 않는다', () => {
  const game = playing();
  game.enemies = [target(), target(400, 100, 1)];
  game.bullets = [bullet(), bullet(110, 105, 1)];
  const next = step(game, 0);
  assert.equal(next.score, 10);
  assert.equal(next.bullets.length, 1);
  assert.equal(step(next, 0).score, 10);
});

test('TC-05 비충돌·접촉은 탄환과 점수를 유지한다', () => {
  const game = playing();
  game.enemies = [target()];
  game.bullets = [bullet(140), bullet(200, 200, 1)];
  const next = step(game, 0);
  assert.equal(next.score, 0);
  assert.equal(next.bullets.length, 2);
  assert.equal(next.enemies[0].alive, true);
});

test('TC-06 전멸은 중복 없이 240점 승리다', () => {
  const game = playing();
  game.bullets = game.enemies.map((enemy) => bullet(enemy.x + 10, enemy.y + 2, enemy.id));
  const next = step(game, 0);
  assert.equal(next.status, 'won');
  assert.equal(next.score, 240);
  assert.equal(next.bullets.length, 0);
  assert.equal(next.enemies.filter((enemy) => enemy.alive).length, 0);
});

test('TC-06 마지막 적 제거와 기존 점수의 합은 240이다', () => {
  const game = playing();
  game.enemies = [target()];
  game.score = 230;
  game.bullets = [bullet()];
  const next = step(game, 0);
  assert.equal(next.status, 'won');
  assert.equal(next.score, 240);
});

test('TC-06 적 하단 520 직전은 계속하고 정확히 도달하면 패배다', () => {
  const game = playing();
  game.enemies = [target(100, 496 - 1e-8)];
  assert.equal(step(game, 0).status, 'playing');
  game.enemies[0].y = 496;
  assert.equal(step(game, 0).status, 'lost');
});

test('TC-06 충돌 뒤 살아 있는 적으로 패배 우선 판정한다', () => {
  const game = playing();
  game.enemies = [target(100, 496), target(300, 496, 1)];
  game.bullets = [bullet(110, 500)];
  assert.equal(step(game, 0).status, 'lost');
  game.enemies = [target(100, 496)];
  assert.equal(step(game, 0).status, 'won');
});

for (const status of ['won', 'lost']) {
  test(`TC-06 ${status} 이후 전체 상태·시간·점수를 동결한다`, () => {
    const game = { ...playing(), status, score: 110, cooldown: 0.12, time: 10 };
    for (const code of ['ArrowLeft', 'KeyD', 'Space', 'Enter']) {
      assert.strictEqual(keyInput(game, code, true), game);
    }
    assert.strictEqual(step(game, 0.1), game);
  });
  test(`TC-07 ${status}에서 R과 버튼 명령은 모든 판 속성을 초기화한다`, () => {
    const game = {
      ...playing(), status, score: 100, time: 13, cooldown: 0.14,
      direction: -1, nextBulletId: 99, keys: { Space: true, ArrowLeft: true },
      enemies: [], bullets: [bullet()], player: { x: 0, y: 550, width: 40, height: 20 },
    };
    for (const next of [command(game, 'restart'), press(game, 'KeyR')]) {
      assert.deepEqual(next, createGame('playing'));
      assert.equal(step(press(next, 'Space'), 0).bullets.length, 1);
    }
  });
}

test('TC-07 진행 중 Enter·R·버튼 명령과 제목의 R을 무시한다', () => {
  const game = step(press(playing(), 'ArrowLeft'), 0.1);
  for (const code of ['Enter', 'KeyR']) assert.strictEqual(press(game, code), game);
  for (const action of ['start', 'restart']) assert.strictEqual(command(game, action), game);
  const title = createGame();
  assert.strictEqual(command(title, 'restart'), title);
});

test('TC-08 전환·blur 입력 초기화와 반복 키 차단을 지킨다', () => {
  let game = press(createGame(), 'Space');
  game = press(game, 'Enter');
  assert.deepEqual(game.keys, {});
  game = keyInput(game, 'Space', true, true);
  assert.equal(step(game, 0).bullets.length, 0);
  game = press(press(game, 'Space'), 'ArrowLeft');
  game = clearInput(game);
  const next = step(game, 0.1);
  assert.equal(next.player.x, 380);
  assert.equal(next.bullets.length, 0);
  assert.equal(keyInput(createGame(), 'Enter', true, true).status, 'title');
  assert.equal(keyInput(createGame('lost'), 'KeyR', true, true).status, 'lost');
});

test('TC-09 긴 프레임은 0.1초로 제한하며 탄환이 정상 크기 적을 관통하지 않는다', () => {
  const moving = press(playing(), 'ArrowRight');
  const next = step(moving, 60);
  close(next.time, 0.1);
  close(next.player.x, 412);
  const game = playing();
  game.enemies = [target(100, 460)];
  game.bullets = [bullet(110, 510)];
  const hit = step(game, 0.1);
  assert.equal(hit.score, 10);
  assert.equal(hit.status, 'won');
});

test('TC-09 프레임 분할을 달리해도 이동·편대·발사가 일관된다', () => {
  const game = press(press(playing(), 'ArrowRight'), 'Space');
  const a = advance(game, 3, 0.1);
  const b = advance(game, 3, 0.01);
  close(a.player.x, b.player.x);
  close(a.enemies[0].x, b.enemies[0].x);
  assert.equal(a.enemies[0].y, b.enemies[0].y);
  assert.equal(a.nextBulletId, b.nextBulletId);
  assert.equal(a.score, b.score);
  close(a.cooldown, b.cooldown);
});

test('TC-09 잘못된 dt를 거부하고 모든 공개 API는 입력 상태를 변경하지 않는다', () => {
  const game = press(playing(), 'Space');
  const before = structuredClone(game);
  step(game, 0.1);
  keyInput(game, 'ArrowLeft', true);
  clearInput(game);
  command(game, 'restart');
  assert.deepEqual(game, before);
  for (const dt of [-1, NaN, Infinity, undefined]) assert.throws(() => step(game, dt), RangeError);
  assert.equal(RULES.maxFrame, 0.1);
});

test('TC-06 정상 시작·이동·발사 입력만으로 한 판을 승리할 수 있다', () => {
  let game = press(press(createGame(), 'Enter'), 'Space');
  let direction = 'ArrowLeft';
  game = press(game, direction);
  for (let frame = 0; frame < 1800 && game.status === 'playing'; frame++) {
    if ((direction === 'ArrowLeft' && game.player.x <= 5)
      || (direction === 'ArrowRight' && game.player.x >= 755)) {
      game = release(game, direction);
      direction = direction === 'ArrowLeft' ? 'ArrowRight' : 'ArrowLeft';
      game = press(game, direction);
    }
    game = step(game, 1 / 60);
  }
  assert.equal(game.status, 'won');
  assert.equal(game.score, 240);
  assert.ok(game.time < 30);
});
