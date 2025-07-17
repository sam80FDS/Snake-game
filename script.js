// script.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const bestDisplay = document.getElementById('best');
const gameOverText = document.getElementById('gameOverText');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let apple;
let velocity;
let direction;
let score;
let best = 0;
let gameInterval;
let paused = false;

function initGame() {
  snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }];
  placeApple();
  velocity = { x: 0, y: 0 };
  direction = 'RIGHT';
  score = 0;
  gameOverText.style.display = 'none';
  updateUI();
}

function gameLoop() {
  if (paused) return;

  const head = { ...snake[0] };
  head.x += velocity.x;
  head.y += velocity.y;
  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score++;
    if (score > best) best = score;
    placeApple();
  } else {
    snake.pop();
  }

  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    endGame();
    return;
  }

  drawGame();
  updateUI();
}

function drawGame() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'magenta';
  ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);

  ctx.fillStyle = '#00ff99';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });
}

function placeApple() {
  apple = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

function updateUI() {
  scoreDisplay.textContent = score;
  bestDisplay.textContent = best;
}

function resetGame() {
  clearInterval(gameInterval);
  initGame();
  gameInterval = setInterval(gameLoop, 150);
}

function endGame() {
  clearInterval(gameInterval);
  gameOverText.style.display = 'block';
  setTimeout(() => {
    resetGame();
  }, 1500);
}

function changeDirection(dir) {
  switch (dir) {
    case 'UP': if (direction !== 'DOWN') velocity = { x: 0, y: -1 }; break;
    case 'DOWN': if (direction !== 'UP') velocity = { x: 0, y: 1 }; break;
    case 'LEFT': if (direction !== 'RIGHT') velocity = { x: -1, y: 0 }; break;
    case 'RIGHT': if (direction !== 'LEFT') velocity = { x: 1, y: 0 }; break;
  }
  direction = dir;
}

function pauseGame() {
  paused = true;
}

function resumeGame() {
  paused = false;
}

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp': case 'w': changeDirection('UP'); break;
    case 'ArrowDown': case 's': changeDirection('DOWN'); break;
    case 'ArrowLeft': case 'a': changeDirection('LEFT'); break;
    case 'ArrowRight': case 'd': changeDirection('RIGHT'); break;
  }
});

initGame();
gameInterval = setInterval(gameLoop, 150);
