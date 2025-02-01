// utils.js

// Collision detection helper
function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// Draw a health bar at (x, y) with a given width, height, and current/max values.
function drawHealthBar(ctx, x, y, width, height, current, max) {
  // Background
  ctx.fillStyle = "#2d3748";
  ctx.fillRect(x, y, width, height);

  // Fill based on ratio
  const fillWidth = (current / max) * width;
  const ratio = current / max;
  if (ratio > 0.66) {
    ctx.fillStyle = "#48bb78"; // green
  } else if (ratio > 0.33) {
    ctx.fillStyle = "#ecc94b"; // yellow
  } else {
    ctx.fillStyle = "#f56565"; // red
  }
  ctx.fillRect(x, y, fillWidth, height);

  // Optional border
  ctx.strokeStyle = "#1a202c";
  ctx.strokeRect(x, y, width, height);
}

// Expose functions globally
window.isColliding = isColliding;
window.drawHealthBar = drawHealthBar;
