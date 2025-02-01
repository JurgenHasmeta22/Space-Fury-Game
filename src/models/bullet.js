// bullet.js

const bullets = [];
const enemyBullets = [];

function updateBullets(canvas) {
  // Update player bullets
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });

  // Update enemy bullets
  enemyBullets.forEach((bullet, index) => {
    bullet.y += bullet.speed;
    // Check if enemy bullet collides with player is done in game loop.
    if (bullet.y > canvas.height) {
      enemyBullets.splice(index, 1);
    }
  });
}

function renderBullets(ctx) {
  // Render player bullets
  ctx.fillStyle = "#edf2f7";
  bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Render enemy bullets
  ctx.fillStyle = "#ed8936";
  enemyBullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function firePlayerBullet(player) {
  const now = Date.now();
  if (now - player.lastShot > 300) {
    player.lastShot = now;
    bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 10,
      speed: 7,
    });
  }
}

function resetBullets() {
  bullets.length = 0;
  enemyBullets.length = 0;
}

window.bullets = bullets;
window.enemyBullets = enemyBullets;
window.updateBullets = updateBullets;
window.renderBullets = renderBullets;
window.firePlayerBullet = firePlayerBullet;
window.resetBullets = resetBullets;
