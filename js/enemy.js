// enemy.js

const enemies = [];
let enemySpawnInterval = 2000;
let lastEnemySpawn = Date.now();

// To ensure the boss appears alone, if a boss is spawned clear other enemies.
function spawnEnemy(canvas) {
  const enemySize = 30;
  const typeRoll = Math.random();
  let enemy = null;
  // A rare chance to spawn a boss that appears alone and is much larger, stronger,
  // and very fast.
  if (typeRoll < 0.1) {
    // Boss: much bigger, high health, fast speed
    enemy = {
      type: "boss",
      width: enemySize * 2.5,
      height: enemySize * 2.5,
      speed: 3, // very fast
      x: Math.random() * (canvas.width - enemySize * 2.5),
      y: -enemySize * 2.5,
      health: 20,
      maxHealth: 20,
      shootTimer: Date.now(),
      shootInterval: 1000,
    };
    // Remove any existing enemy so the boss is alone.
    enemies.length = 0;
  } else if (typeRoll < 0.3) {
    // Mini-Boss: tougher than normal enemies
    enemy = {
      type: "mini",
      width: enemySize * 1.2,
      height: enemySize * 1.2,
      speed: 2.5, // faster than normal
      x: Math.random() * (canvas.width - enemySize * 1.2),
      y: -enemySize * 1.2,
      health: 7,
      maxHealth: 7,
      shootTimer: Date.now(),
      shootInterval: 1500,
    };
  } else {
    // Normal enemy
    enemy = {
      type: "normal",
      width: enemySize,
      height: enemySize,
      speed: 1 + Math.random(),
      x: Math.random() * (canvas.width - enemySize),
      y: -enemySize,
      health: 1,
      maxHealth: 1,
      shootTimer: Date.now(), // not used
    };
  }
  enemies.push(enemy);
}

function updateEnemies(canvas, player, bullets, enemyBullets, addScore) {
  enemies.forEach((enemy, enemyIndex) => {
    // If enemy is mini or boss, adjust x towards player's center for some "intelligence"
    if (enemy.type === "mini" || enemy.type === "boss") {
      const enemyCenter = enemy.x + enemy.width / 2;
      const playerCenter = player.x + player.width / 2;
      if (playerCenter < enemyCenter) {
        enemy.x -= 0.5;
      } else {
        enemy.x += 0.5;
      }
    }

    enemy.y += enemy.speed;

    // Shooting for mini and boss enemies.
    if (enemy.type === "mini" || enemy.type === "boss") {
      if (Date.now() - enemy.shootTimer > enemy.shootInterval) {
        enemy.shootTimer = Date.now();
        enemyBullets.push({
          x: enemy.x + enemy.width / 2 - 2,
          y: enemy.y + enemy.height,
          width: 4,
          height: 10,
          speed: enemy.type === "boss" ? 5 : 4,
          damage: enemy.type === "boss" ? 2 : 1,
        });
      }
    }

    // If enemy reaches the bottom, damage the player and remove enemy.
    if (enemy.y + enemy.height >= canvas.height) {
      player.health--;
      enemies.splice(enemyIndex, 1);
      return;
    }

    // Check collision between enemy and player.
    if (isColliding(enemy, player)) {
      player.health--;
      enemies.splice(enemyIndex, 1);
      return;
    }

    // Check collision of enemy with player's bullets.
    bullets.forEach((bullet, bulletIndex) => {
      if (isColliding(enemy, bullet)) {
        enemy.health--;
        bullets.splice(bulletIndex, 1);
        if (enemy.health <= 0) {
          // Increase score based on enemy type.
          if (enemy.type === "boss") {
            addScore(50);
          } else if (enemy.type === "mini") {
            addScore(30);
          } else {
            addScore(10);
          }
          enemies.splice(enemyIndex, 1);
        }
      }
    });
  });
}

function renderEnemies(ctx) {
  enemies.forEach((enemy) => {
    if (enemy.type === "boss") {
      ctx.fillStyle = "#c53030";
    } else if (enemy.type === "mini") {
      ctx.fillStyle = "#e53e3e";
    } else {
      ctx.fillStyle = "#f56565";
    }
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    drawHealthBar(
      ctx,
      enemy.x,
      enemy.y - 8,
      enemy.width,
      4,
      enemy.health,
      enemy.maxHealth
    );
  });
}

function resetEnemies() {
  enemies.length = 0;
  lastEnemySpawn = Date.now();
}

function getLastEnemySpawn() {
  return lastEnemySpawn;
}

function setLastEnemySpawn(time) {
  lastEnemySpawn = time;
}

window.enemies = enemies;
window.spawnEnemy = spawnEnemy;
window.updateEnemies = updateEnemies;
window.renderEnemies = renderEnemies;
window.resetEnemies = resetEnemies;
window.enemySpawnInterval = enemySpawnInterval;
window.getLastEnemySpawn = getLastEnemySpawn;
window.setLastEnemySpawn = setLastEnemySpawn;
