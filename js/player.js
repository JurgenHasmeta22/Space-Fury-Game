// player.js

const player = {
  x: 300 - 20,
  y: 600 - 40,
  width: 40,
  height: 20,
  speed: 5,
  health: 5,
  maxHealth: 5,
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
  ctx.fillStyle = "#48bb78"; // Tailwind green-400
  ctx.fillRect(player.x, player.y, player.width, player.height);
  // Draw health bar above player
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
