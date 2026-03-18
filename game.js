const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");

// ---------------- Player ----------------
class Player {
  constructor () {
    this.width = 40;
    this.height = 20;
    this.x = (canvas.width - this.width) / 2;
    this.y = canvas.height - this.height - 10;
    this.speed = 5;
    this.color = "white";
  }

  draw() {
    ctx.shadowBlur = 10;
  ctx.shadowColor = this.color;

  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.width, this.height);

  ctx.shadowBlur = 0; // reset so it doesn't affect everything else
  }

  move(direction) {
    if(direction === "left") this.x -= this.speed;
    if(direction === "right") this.x += this.speed;
    // Keep Inside Canvas
    if(this.x < 0) this.x = 0;
    if(this.x + this.width > canvas.width) { this.x = canvas.width - this.width;
    }
  }
}

// ---------------- Block ----------------
class Block {
  constructor(speed) {
    this.width = 30 + Math.random() * 20;
    this.height = 30;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = -this.height;
    this.speed = speed;
    this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
    this.pulse = Math.random() * Math.PI * 2; // random starting phase
this.pulseSpeed = 0.05 + Math.random() * 0.05;
  }
  draw() {
    // Pulse effect (value between 0 and 1)
  const glow = (Math.sin(this.pulse) + 1) / 2;

  // Apply pulsing glow strength
  ctx.shadowBlur = 10 + glow * 20;
  ctx.shadowColor = this.color;

  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.width, this.height);

  ctx.shadowBlur = 0;
}

  update() {
  this.y += this.speed;
  this.pulse += this.pulseSpeed; // ✅ this makes the glow animate
  }
}

// ---------------- Game State ----------------
let player = new Player();
let blocks = [];
let score = 0;
let gameOver = false;
let keys = {};
let blockSpeed = 2;
let spawnRate = 1000; // Milliseconds

// ---------------- Controls ----------------
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// ---------------- Game Functions ----------------
function spawnBlock() {
  if(!gameOver) { blocks.push(new Block(blockSpeed));
}
}

function resetGame() {
  player = new Player();
  blocks = [];
  score = 0;
  gameOver = false;
  blockSpeed = 2;
  overlay.innerHTML = "";
  update(); // restart loop
}

function draw() {
  // trailing effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Player Movement
  if(keys["ArrowLeft"]) player.move("left");
  if(keys["ArrowRight"]) player.move("right");

  player.draw();

  // Draw and Update Blocks
  blocks.forEach((block, i) => {
    block.update();
    block.draw();

    // Collision
    if (
      player.x < block.x + block.width &&
      player.x + player.width > block.x &&
      player.y < block.y + block.height &&
      player.y + player.height > block.y
      ) {
      gameOver = true;
      overlay.innerHTML = `<div>Game Over! Score: ${score}</div>
      <button onclick="resetGame()">Play Again</button>`;
      }

      // Remove Offscreen
      if(block.y > canvas.height) { blocks.splice(i, 1);
      }
  });

// Score
  ctx.shadowBlur = 0;
ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function update() {
  if(!gameOver) {
    draw();
    score++;
    if(score % 500 === 0) blockSpeed += 0.5; // gradually increase difficulty
    requestAnimationFrame(update);
      }
}

// Start spawning blocks
setInterval(spawnBlock, spawnRate);

// Start game
update();
overlay.innerHTML = `<div>Use Arrow Keys to Move</div>
<button onclick="resetGame()">Start Game</button>`;
