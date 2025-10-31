// === mengambil canvas dari html === //
const canvas = document.getElementById("gameCanvas");
// === ctx ini adalah untuk membuat apakah ia 2d atau 3d === //
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameoverElement = document.getElementById("kata");
const click = document.getElementById("click");

// === AUDIO === //
const eatSound = new Audio("/assets/sounds/Eat.mp3");
const gameOverSound = new Audio("/assets/sounds/Hit.mp3");
const bgMusic = new Audio("/assets/sounds/cascade-breathe-future-garage-412839.mp3");

// Loop background music
bgMusic.loop = true;
bgMusic.volume = 0.3; // volumenya jangan terlalu keras
bgMusic.play();

// === ukuran grid untuk permainan ular === //
// === grid adalah tata letak dari map ular === //
const gridSize = 20;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

// === variabel untuk menyimpan posisi ular, makanan, arah, dan skor === //
let snake = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }]; // posisi awal ular di tengah canvas
let food = { x: 5, y: 5 }; // posisi awal makanan
let direction = "right"; // arah awal ular
let score = 0; // skor awal
let gameRunning = true;

// === fungsi untuk menggambar ular === //

function drawSnake() {
  // Bersihkan Canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Gambar Ular
  ctx.fillStyle = "darkgreen";
  snake.forEach((segment) => {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
  // Gambar Makanan
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// === fungsi untuk memperbarui posisi ular === //
function update() {
  if (!gameRunning) return;

  const head = { ...snake[0] };
  // Update head position based on direction
  if (direction === "up") head.y--;
  if (direction === "down") head.y++;
  if (direction === "left") head.x--;
  if (direction === "right") head.x++;

  // jika ular menabrak dinding //
  if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
    endGame();
    return;
  }

  // Jika Ular menabrak Dirinya Sendiri //
  for (let segment of snake) {
    if (segment.x === head.x && segment.y === head.y) {
      endGame();
      return;
    }
  }

  snake.unshift(head);

  // jika ular makan apel //

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.innerHTML = score;
    eatSound.currentTime = 0; 
    eatSound.play();
    generateFood();
  } else {
    snake.pop();
  }
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight),
  };
}

function endGame() {
    gameRunning = false;
    gameOverSound.play();  
    bgMusic.pause();      
    gameoverElement.style.display = 'block';
    kata.innerHTML = "Game Over! Your Score : " + score;
    click.style.display = 'block';
}

function resetGame() {
    snake = [{x: Math.floor (gridWidth / 2), y: Math.floor(gridHeight / 2)}];
    direction = 'right';
    score = 0;
    scoreElement.innerHTML = score;
    gameRunning = true;
    generateFood();
    gameoverElement.style.display = 'none';
    click.style.display = 'none';
    
    bgMusic.currentTime = 0; 
    bgMusic.play();
}

function gameLoop() {
  update();
  drawSnake();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  if (e.key === "ArrowDown" && direction !== "up") direction = "down";
  if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});

resetGame();
setInterval(gameLoop, 150);
