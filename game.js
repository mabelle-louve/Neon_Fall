const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = { x: 180, y: 550, width: 40, height:40, speed: 5 };
let blocks = [];
let score = 0;
let gameOver = false;

document.addEventListener("keydown", (e) => {
  if(e.key === "ArrowLeft") player.x -= player.speed;
  if(e.key === "ArrowRight") player.x += player.speed;
});

function createBlock() {
  const x = Math.random() * (canvas.width - 30);
  blocks.push({ x, y: 0, width: 30, height: 30, speed: 2 + Math.random() * 3 });
}

function update() {
if(gameOver) return;
ctx.clearRect(0, 0, canvas.width, canvas.height);

//Draw Player
ctx.fillStyle = "blue";
ctx.fillRect(player.x, player.y, player.width, player.height);

//Update blocks
blocks.forEach((block, i) => {
  block.y += block.speed;
  ctx.fillStyle = "red";
  ctx.fillRect(block.x, block.y, block.width, block.height);

//Collision detection
if (
  player.x < block.x + block.width &&
  player.x + player.width > block.x &&
  player.y < block.y +block.height &&
  player.y + player.height > block.y
  ) {
  gameover = true;
  alert(`Game Over! score: ${score}`);
}

//Remove Blocks Offscreen
if(block.y > canvas.height) blocks.splice(i, 1);
});

//Score
ctx.fillStyle = "black";
ctx.font = "20px Arial";
ctx.fillText(`Score: ${score}`, 10, 30);

score+= 1;
requestAnimationFrame(updtae);
}

//Generate blocks every 1 second
setInterval(() => {
  if(!gameOver) createBlock();
}, 1000);

update();
