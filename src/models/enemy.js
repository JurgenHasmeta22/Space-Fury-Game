// enemy.js

const enemies = [];
let enemySpawnInterval = 2000;
let lastEnemySpawn = Date.now();

function getCountByType(type) {
  return enemies.filter((enemy) => enemy.type === type).length;
}

function spawnEnemy(canvas) {
  const enemySize = 30;
  const typeRoll = Math.random();
  let enemy = null;

  if (typeRoll < 0.1) {
    // Boss enemy:
    // Check if already 2 bosses on-screen. If so, spawn a normal enemy instead.
    if (getCountByType("boss") >= 2) {
      enemy = {
        type: "normal",
        width: enemySize,
        height: enemySize,
        speed: 1 + Math.random(),
        x: Math.random() * (canvas.width - enemySize),
        y: -enemySize,
        health: 1,
        maxHealth: 1,
        shootTimer: Date.now(),
      };
    } else {
      enemy = {
        type: "boss",
        width: enemySize * 1.5,
        height: enemySize * 1.5,
        x: Math.random() * (canvas.width - enemySize * 1.5),
        // boss spawns in the upper half (not too close to player)
        y: Math.random() * (canvas.height / 2 - enemySize * 1.5),
        health: 50,
        maxHealth: 50,
        shootTimer: Date.now(),
        shootInterval: 800,
        // Set random velocities for x and y between 2 and 4
        dx: (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 2),
        dy: (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 2),
      };
    }
  } else if (typeRoll < 0.3) {
    // Mini-Boss: Check if more than 3 mini bosses exist.
    if (getCountByType("mini") >= 3) {
      enemy = {
        type: "normal",
        width: enemySize,
        height: enemySize,
        speed: 1 + Math.random(),
        x: Math.random() * (canvas.width - enemySize),
        y: -enemySize,
        health: 1,
        maxHealth: 1,
        shootTimer: Date.now(),
      };
    } else {
      enemy = {
        type: "mini",
        width: enemySize * 1.2,
        height: enemySize * 1.2,
        speed: 2.5,
        x: Math.random() * (canvas.width - enemySize * 1.2),
        y: -enemySize * 1.2,
        health: 7,
        maxHealth: 7,
        shootTimer: Date.now(),
        shootInterval: 1500,
      };
    }
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
    if (enemy.type === "boss") {
      // Boss moves in both x and y axes using dx and dy.
      enemy.x += enemy.dx;
      enemy.y += enemy.dy;
      // Bounce off left/right edges.
      if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
        enemy.dx = -enemy.dx;
      }
      // Keep boss in the upper half.
      if (enemy.y <= 0 || enemy.y + enemy.height >= canvas.height / 2) {
        enemy.dy = -enemy.dy;
      }
    } else if (enemy.type === "mini") {
      // Mini-Boss: adjust x slightly toward player.
      const enemyCenter = enemy.x + enemy.width / 2;
      const playerCenter = player.x + player.width / 2;
      if (playerCenter < enemyCenter) {
        enemy.x -= 0.5;
      } else {
        enemy.x += 0.5;
      }
      enemy.y += enemy.speed;
    } else {
      // Normal enemy falls downward.
      enemy.y += enemy.speed;
    }

    // Shooting for boss and mini boss.
    if (enemy.type === "boss" || enemy.type === "mini") {
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

    // For non-boss enemies, if they exit the bottom, damage the player.
    if (enemy.type !== "boss" && enemy.y + enemy.height >= canvas.height) {
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

    // Check collision for player's bullets.
    bullets.forEach((bullet, bulletIndex) => {
      if (isColliding(enemy, bullet)) {
        enemy.health--;
        bullets.splice(bulletIndex, 1);
        if (enemy.health <= 0) {
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
      ctx.fillStyle = "#800080"; // Purple for boss
    } else if (enemy.type === "mini") {
      ctx.fillStyle = "#8B0000"; // Dark red for mini-boss
    } else {
      ctx.fillStyle = "#f56565"; // Normal enemy red
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
