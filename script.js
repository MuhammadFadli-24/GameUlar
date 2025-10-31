// === mengambil canvas dari html === //
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameoverElement = document.getElementById("kata");
const click = document.getElementById("click");

// === AUDIO === //
const eatSound = new Audio("/assets/sounds/Eat.mp3");
const gameOverSound = new Audio("/assets/sounds/Hit.mp3");
const bgMusic = new Audio("/assets/sounds/cascade-breathe-future-garage-412839.mp3");
const bonusSound = new Audio("/assets/sounds/Bonus.mp3"); // suara bonus

// === BONUS FOOD === //
let bonusFood = null;
let bonusTime = 0;
const maxBonusTime = 100;
let bonusBarWidth = 100;
let applesEaten = 0;
const applesBeforeBonus = 5;

// === LOOP BACKGROUND MUSIC === //
bgMusic.loop = true;
bgMusic.volume = 0.3;
bgMusic.play();

// === ukuran grid untuk permainan ular === //
const gridSize = 20;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

// === variabel untuk menyimpan posisi ular, makanan, arah, dan skor === //
let snake = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }];
let food = { x: 5, y: 5 };
let direction = "right";
let score = 0;
let gameRunning = true;

// === fungsi untuk menggambar ular dan makanan === //
function drawSnake() {
  // Bersihkan layar
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Gambar Ular
  ctx.fillStyle = "darkgreen";
  snake.forEach((segment) => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });

  // Gambar Apel biasa 🍎
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Gambar Bonus Apel 🥇
  if (bonusFood) {
    ctx.fillStyle = "gold";
    ctx.beginPath();
    ctx.arc(
      bonusFood.x * gridSize + gridSize / 2,
      bonusFood.y * gridSize + gridSize / 2,
      gridSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Gambar progress bar di atas bonus
    const barX = bonusFood.x * gridSize;
    const barY = bonusFood.y * gridSize - 6;
    const barHeight = 4;
    const barLength = (bonusBarWidth / 100) * gridSize;

    ctx.fillStyle = "gray";
    ctx.fillRect(barX, barY, gridSize, barHeight);
    ctx.fillStyle = "lime";
    ctx.fillRect(barX, barY, barLength, barHeight);
  }
}

// === fungsi untuk membuat makanan biasa === //
function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight),
    };
  } while (isOccupied(newFood) || (bonusFood && newFood.x === bonusFood.x && newFood.y === bonusFood.y));
  food = newFood;
}

// === fungsi untuk membuat makanan bonus === //
function generateBonus() {
  let newBonus;
  do {
    newBonus = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight),
    };
  } while (isOccupied(newBonus) || (newBonus.x === food.x && newBonus.y === food.y));
  bonusFood = newBonus;
  bonusTime = maxBonusTime;
  bonusBarWidth = 100;
}

// === cek apakah posisi nabrak ular === //
function isOccupied(pos) {
  return snake.some((segment) => segment.x === pos.x && segment.y === pos.y);
}

// === fungsi utama update === //
function update() {
  if (!gameRunning) return;

  const head = { ...snake[0] };

  if (direction === "up") head.y--;
  if (direction === "down") head.y++;
  if (direction === "left") head.x--;
  if (direction === "right") head.x++;

  // Jika nabrak dinding
  if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
    endGame();
    return;
  }

  // Jika nabrak diri sendiri
  for (let segment of snake) {
    if (segment.x === head.x && segment.y === head.y) {
      endGame();
      return;
    }
  }

  snake.unshift(head);

  // === Jika makan apel biasa === //
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.innerHTML = score;
    eatSound.currentTime = 0;
    eatSound.play();
    generateFood();
    applesEaten++;

    // Setelah makan 5 apel → muncul bonus
    if (applesEaten >= applesBeforeBonus && !bonusFood) {
      generateBonus();
      applesEaten = 0;
    }
  } else {
    snake.pop();
  }

  // === Jika makan bonus === //
  if (bonusFood && head.x === bonusFood.x && head.y === bonusFood.y) {
    score += 50;
    scoreElement.innerHTML = score;
    bonusSound.currentTime = 0;
    bonusSound.play();
    bonusFood = null;
  }

  // === Kurangi waktu bonus === //
  if (bonusFood) {
    bonusTime--;
    bonusBarWidth = (bonusTime / maxBonusTime) * 100;
    if (bonusTime <= 0) {
      bonusFood = null; // bonus hilang kalau waktunya habis
    }
  }
}

// === fungsi game over === //
function endGame() {
  gameRunning = false;
  gameOverSound.play();
  bgMusic.pause();
  gameoverElement.style.display = "block";
  kata.innerHTML = "Game Over! Your Score : " + score;
  click.style.display = "block";
}

// === fungsi reset === //
function resetGame() {
  snake = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }];
  direction = "right";
  score = 0;
  scoreElement.innerHTML = score;
  gameRunning = true;
  generateFood();
  gameoverElement.style.display = "none";
  click.style.display = "none";

  bonusFood = null;
  applesEaten = 0;
  bonusTime = 0;

  bgMusic.currentTime = 0;
  bgMusic.play();
}

// === loop utama === //
function gameLoop() {
  update();
  drawSnake();
}

// === kontrol arah === //
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  if (e.key === "ArrowDown" && direction !== "up") direction = "down";
  if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});

// === mulai game === //
resetGame();
setInterval(gameLoop, 150);
