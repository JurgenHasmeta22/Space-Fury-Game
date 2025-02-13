// main.js

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// UI Elements
const startMenu = document.getElementById("startMenu");
const pauseMenu = document.getElementById("pauseMenu");
const gameOverMenu = document.getElementById("gameOverMenu");
const startButton = document.getElementById("startButton");
const resumeButton = document.getElementById("resumeButton");
const restartButton = document.getElementById("restartButton");

// Global keys object
const keys = {};

// Keyboard listeners
document.addEventListener("keydown", (e) => {
  // Toggle pause/resume with ESC
  if (e.key === "Escape") {
    if (gameState.state === "playing") {
      gameState.state = "paused";
      pauseMenu.classList.remove("hidden");
    } else if (gameState.state === "paused") {
      pauseMenu.classList.add("hidden");
      gameState.state = "playing";
      gameLoop(canvas, ctx, keys);
    }
    return;
  }

  // For space bar, allow one shot per key press.
  if (e.key === " ") {
    if (!keys[" "]) {
      keys[" "] = true;
      // Fire one shot immediately
      firePlayerBullet(player);
    }
    return;
  }

  // Record key if playing.
  if (gameState.state === "playing") {
    keys[e.key] = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (gameState.state === "playing") {
    keys[e.key] = false;
  }
});

// Menu button event handlers
startButton.addEventListener("click", () => {
  startMenu.classList.add("hidden");
  gameState.state = "playing";
  resetGame(canvas);
  gameLoop(canvas, ctx, keys);
});

resumeButton.addEventListener("click", () => {
  pauseMenu.classList.add("hidden");
  gameState.state = "playing";
  gameLoop(canvas, ctx, keys);
});

restartButton.addEventListener("click", () => {
  gameOverMenu.classList.add("hidden");
  resetGame(canvas);
  gameState.state = "playing";
  gameLoop(canvas, ctx, keys);
});
