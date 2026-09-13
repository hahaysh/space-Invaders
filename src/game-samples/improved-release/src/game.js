export const RULES = Object.freeze({
  width: 800,
  height: 600,
  playerWidth: 40,
  playerHeight: 20,
  playerY: 550,
  playerSpeed: 320,
  bulletWidth: 4,
  bulletHeight: 12,
  bulletSpeed: 600,
  shotInterval: 0.2,
  enemyWidth: 40,
  enemyHeight: 24,
  enemySpeed: 64,
  descent: 24,
  defenseY: 520,
  maxFrame: 0.1,
  maxStep: 1 / 240,
});

const EPSILON = 64 * Number.EPSILON;
const MOVE_CODES = new Set(['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'Space']);

export function createGame(status = 'title') {
  return {
    status,
    player: { x: 380, y: RULES.playerY, width: 40, height: 20 },
    enemies: Array.from({ length: 24 }, (_, id) => ({
      id,
      x: 112 + (id % 8) * 72,
      y: 72 + Math.floor(id / 8) * 48,
      width: RULES.enemyWidth,
      height: RULES.enemyHeight,
      alive: true,
    })),
    bullets: [],
    score: 0,
    direction: 1,
    keys: {},
    cooldown: 0,
    time: 0,
    nextBulletId: 0,
  };
}

export function command(game, action) {
  if ((action === 'start' && game.status === 'title')
    || (action === 'restart' && ['won', 'lost'].includes(game.status))) {
    return createGame('playing');
  }
  return game;
}

export function clearInput(game) {
  return { ...game, keys: {} };
}

export function keyInput(game, code, pressed, repeat = false) {
  if (pressed && repeat) return game;
  if (pressed && code === 'KeyP' && ['playing', 'paused'].includes(game.status)) {
    return { ...clearInput(game), status: game.status === 'playing' ? 'paused' : 'playing' };
  }
  if (pressed && code === 'Enter') return command(game, 'start');
  if (pressed && code === 'KeyR') return command(game, 'restart');
  if (game.status !== 'playing' || !MOVE_CODES.has(code)) return game;
  const keys = { ...game.keys };
  if (pressed) keys[code] = true;
  else delete keys[code];
  return { ...game, keys };
}

export function overlaps(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x
    && a.y < b.y + b.height && a.y + a.height > b.y;
}

function fire(game) {
  if (!game.keys.Space || game.cooldown > EPSILON) return;
  game.bullets.push({
    id: game.nextBulletId++,
    x: game.player.x + (game.player.width - RULES.bulletWidth) / 2,
    y: game.player.y - RULES.bulletHeight,
    width: RULES.bulletWidth,
    height: RULES.bulletHeight,
    bornAt: game.time,
  });
  game.cooldown = RULES.shotInterval;
}

function moveFormation(game, dt) {
  const alive = game.enemies.filter((enemy) => enemy.alive);
  if (!alive.length) return;
  let remaining = dt;
  while (remaining > 0) {
    const left = Math.min(...alive.map((enemy) => enemy.x));
    const right = Math.max(...alive.map((enemy) => enemy.x + enemy.width));
    const distance = Math.max(0, game.direction > 0 ? RULES.width - right : left);
    const edgeTime = distance / RULES.enemySpeed;
    const travelTime = Math.min(remaining, edgeTime);
    for (const enemy of alive) enemy.x += game.direction * RULES.enemySpeed * travelTime;
    remaining -= travelTime;
    if (edgeTime <= travelTime + EPSILON) {
      game.direction *= -1;
      for (const enemy of alive) enemy.y += RULES.descent;
    } else {
      break;
    }
  }
}

function collideAndFinish(game) {
  game.bullets = game.bullets.filter((bullet) => {
    const enemy = game.enemies.find((candidate) => candidate.alive && overlaps(bullet, candidate));
    if (enemy) {
      enemy.alive = false;
      game.score += 10;
      return false;
    }
    return bullet.y + bullet.height > 0;
  });
  const alive = game.enemies.filter((enemy) => enemy.alive);
  if (alive.some((enemy) => enemy.y + enemy.height >= RULES.defenseY)) game.status = 'lost';
  else if (!alive.length) game.status = 'won';
  if (game.status !== 'playing') game.keys = {};
}

export function step(game, dt) {
  if (!Number.isFinite(dt) || dt < 0) throw new RangeError('dt는 유한한 0 이상의 초여야 합니다.');
  if (game.status !== 'playing') return game;
  const next = structuredClone(game);
  let remaining = Math.min(dt, RULES.maxFrame);
  fire(next);
  if (remaining === 0) collideAndFinish(next);
  while (remaining > EPSILON && next.status === 'playing') {
    const untilShot = next.keys.Space && next.cooldown > EPSILON ? next.cooldown : Infinity;
    const delta = Math.min(remaining, RULES.maxStep, untilShot);
    const left = Boolean(next.keys.ArrowLeft || next.keys.KeyA);
    const right = Boolean(next.keys.ArrowRight || next.keys.KeyD);
    next.player.x = Math.max(0, Math.min(
      RULES.width - next.player.width,
      next.player.x + (Number(right) - Number(left)) * RULES.playerSpeed * delta,
    ));
    moveFormation(next, delta);
    for (const bullet of next.bullets) bullet.y -= RULES.bulletSpeed * delta;
    next.time += delta;
    next.cooldown = Math.max(0, next.cooldown - delta);
    remaining = Math.max(0, remaining - delta);
    collideAndFinish(next);
    if (next.status === 'playing') fire(next);
  }
  return next;
}
