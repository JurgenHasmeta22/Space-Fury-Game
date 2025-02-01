// player.js

const player = {
  x: 300 - 20,
  y: 600 - 40,
  width: 40,
  height: 20,
  speed: 5,
  health: 10, // increased starting health
  maxHealth: 10,
  lastShot: 0,
};

function updatePlayer(keys, canvas) {
  if (keys["ArrowLeft"] && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys["ArrowRight"] && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
}

function renderPlayer(ctx) {
  ctx.fillStyle = "#4299E1"; // blue for the player
  ctx.fillRect(player.x, player.y, player.width, player.height);
  drawHealthBar(
    ctx,
    player.x,
    player.y - 10,
    player.width,
    5,
    player.health,
    player.maxHealth
  );
}

function resetPlayer(canvas) {
  player.x = canvas.width / 2 - 20;
  player.health = player.maxHealth;
}

window.player = player;
window.updatePlayer = updatePlayer;
window.renderPlayer = renderPlayer;
window.resetPlayer = resetPlayer;
