import './styles.css';
import { RULES, createGame, command, keyInput, clearInput, step } from './game.js';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const status = document.querySelector('#status');
const score = document.querySelector('#score');
const remaining = document.querySelector('#remaining');
const overlay = document.querySelector('#overlay');
const message = document.querySelector('#message');
const detail = document.querySelector('#detail');
const badge = document.querySelector('#badge');
const shortcut = document.querySelector('#shortcut');
const start = document.querySelector('#start');
const restart = document.querySelector('#restart');
const labels = { title: '출격 대기', playing: '방어 중', won: '방어 성공', lost: '방어선 돌파' };
const controlled = new Set(['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'Space', 'Enter', 'KeyR']);
let game = createGame();
let previousTime = null;
let shownState = null;

function accept(next) {
  if (next.status !== game.status) {
    next = clearInput(next);
    previousTime = null;
    if (document.activeElement === start || document.activeElement === restart) {
      document.activeElement.blur();
    }
  }
  game = next;
  updateDom();
}

function updateDom() {
  const scoreText = String(game.score);
  const countText = String(game.enemies.filter((enemy) => enemy.alive).length);
  if (score.value !== scoreText) score.value = scoreText;
  if (remaining.value !== countText) remaining.value = countText;
  if (shownState === game.status) return;
  shownState = game.status;
  status.dataset.state = game.status;
  status.textContent = labels[game.status];
  overlay.hidden = game.status === 'playing';
  start.hidden = game.status !== 'title';
  restart.hidden = !['won', 'lost'].includes(game.status);
  if (game.status === 'won' || game.status === 'lost') {
    const won = game.status === 'won';
    badge.textContent = won ? '작전 완료 / 240점' : '작전 종료 / 다시 도전';
    message.textContent = won ? '궤도를 지켰어요!' : '방어선이 뚫렸어요';
    detail.textContent = won ? '모든 적을 제거했습니다. 멋진 비행이었어요.' : '다음 작전에서는 조금 더 빠르게 적을 막아 보세요.';
    shortcut.textContent = 'R 키로도 다시 시작할 수 있어요';
  }
}

start.addEventListener('click', () => accept(command(game, 'start')));
restart.addEventListener('click', () => accept(command(game, 'restart')));
document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || !controlled.has(event.code)) return;
  if (event.target instanceof HTMLButtonElement && ['Enter', 'Space'].includes(event.code)) {
    if (event.repeat) event.preventDefault();
    return;
  }
  event.preventDefault();
  accept(keyInput(game, event.code, true, event.repeat));
});
document.addEventListener('keyup', (event) => {
  accept(keyInput(game, event.code, false));
});

function resetInputClock() {
  game = clearInput(game);
  previousTime = null;
}
window.addEventListener('blur', resetInputClock);
window.addEventListener('focus', resetInputClock);
document.addEventListener('visibilitychange', resetInputClock);

function drawEnemy(enemy) {
  ctx.fillStyle = '#ffbd69';
  ctx.fillRect(enemy.x + 6, enemy.y, 28, 4);
  ctx.fillRect(enemy.x, enemy.y + 4, 40, 14);
  ctx.fillRect(enemy.x + 4, enemy.y + 18, 8, 6);
  ctx.fillRect(enemy.x + 28, enemy.y + 18, 8, 6);
  ctx.fillStyle = '#172338';
  ctx.fillRect(enemy.x + 9, enemy.y + 7, 6, 5);
  ctx.fillRect(enemy.x + 25, enemy.y + 7, 6, 5);
}

function draw() {
  ctx.fillStyle = '#0a1426';
  ctx.fillRect(0, 0, RULES.width, RULES.height);
  for (let i = 0; i < 72; i++) {
    ctx.fillStyle = i % 3 === 0 ? '#516481' : '#263953';
    const size = i % 5 === 0 ? 2 : 1;
    ctx.fillRect((i * 173 + 29) % 800, (i * 97 + 13) % 590, size, size);
  }
  ctx.strokeStyle = '#192a40';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 800; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 600);
    ctx.stroke();
  }
  ctx.setLineDash([5, 8]);
  ctx.strokeStyle = '#b47b5f';
  ctx.beginPath();
  ctx.moveTo(18, RULES.defenseY);
  ctx.lineTo(782, RULES.defenseY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = '11px system-ui';
  ctx.fillStyle = '#bcae9e';
  ctx.fillText('방어선', 20, RULES.defenseY - 9);
  for (const enemy of game.enemies) if (enemy.alive) drawEnemy(enemy);
  ctx.fillStyle = '#f0f8ff';
  for (const bullet of game.bullets) ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  const { x, y } = game.player;
  ctx.fillStyle = '#75f5d0';
  ctx.beginPath();
  ctx.moveTo(x + 20, y);
  ctx.lineTo(x + 28, y + 10);
  ctx.lineTo(x + 40, y + 14);
  ctx.lineTo(x + 40, y + 20);
  ctx.lineTo(x, y + 20);
  ctx.lineTo(x, y + 14);
  ctx.lineTo(x + 12, y + 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#173f47';
  ctx.fillRect(x + 17, y + 8, 6, 8);
}

function frame(timestamp) {
  const dt = previousTime === null ? 0 : (timestamp - previousTime) / 1000;
  previousTime = timestamp;
  accept(step(game, dt));
  draw();
  requestAnimationFrame(frame);
}

updateDom();
draw();
requestAnimationFrame(frame);
