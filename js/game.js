// game.js

// Game state management and game loop
const gameState = {
  state: "start", // "start", "playing", "paused", "gameOver"
  score: 0,
};

function addScore(points) {
  gameState.score += points;
  updateHUD();
}

function updateGame(canvas, keys, ctx) {
  // Update player movement
  updatePlayer(keys, canvas);

  // Player shooting (spacebar)
  if (keys[" "]) {
    firePlayerBullet(player);
  }

  // Spawn enemies at intervals
  if (Date.now() - window.getLastEnemySpawn() > window.enemySpawnInterval) {
    spawnEnemy(canvas);
    window.setLastEnemySpawn(Date.now());
  }

  // Update bullets and enemy bullets
  updateBullets(canvas);

  // Update enemies. Pass addScore so enemy module can update score correctly.
  updateEnemies(canvas, player, bullets, enemyBullets, addScore);
}

function renderGame(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  renderPlayer(ctx);
  renderBullets(ctx);
  renderEnemies(ctx);
}

function gameLoop(canvas, ctx, keys) {
  if (gameState.state !== "playing") return;
  updateGame(canvas, keys, ctx);
  renderGame(ctx);

  // Check enemy bullets collision with player
  enemyBullets.forEach((bullet, index) => {
    if (isColliding(bullet, player)) {
      player.health -= bullet.damage;
      enemyBullets.splice(index, 1);
    }
  });

  if (player.health <= 0) {
    gameOver();
    return;
  }
  requestAnimationFrame(() => gameLoop(canvas, ctx, keys));
}

function resetGame(canvas) {
  gameState.score = 0;
  resetPlayer(canvas);
  resetBullets();
  resetEnemies();
  updateHUD();
}

function gameOver() {
  gameState.state = "gameOver";
  document.getElementById("gameOverMenu").classList.remove("hidden");
}

function updateHUD() {
  document.getElementById("scoreDisplay").textContent =
    "Score: " + gameState.score;
}

window.gameState = gameState;
window.updateGame = updateGame;
window.renderGame = renderGame;
window.gameLoop = gameLoop;
window.resetGame = resetGame;
window.gameOver = gameOver;
window.updateHUD = updateHUD;
