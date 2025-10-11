
// === Nexus Ghoul Realistic Neon Crack Wall ===
// Version A: realistic cracked surface + pulsing neon glow

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let w = (canvas.width = innerWidth);
let h = (canvas.height = innerHeight);

window.addEventListener("resize", () => {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
  drawBackground();
});

let pulse = 0;

// Create a noise texture for the wall
function drawNoise() {
  const imageData = ctx.createImageData(w, h);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const val = Math.random() * 25;
    imageData.data[i] = val;
    imageData.data[i + 1] = val;
    imageData.data[i + 2] = val;
    imageData.data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}

// Generate cracks with glow
function drawCracks() {
  pulse += 0.04;
  const glowIntensity = 0.4 + Math.sin(pulse) * 0.2;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const crackCount = 12;
  for (let i = 0; i < crackCount; i++) {
    let x = Math.random() * w;
    let y = h * 0.65 + Math.random() * (h * 0.35);
    const len = 150 + Math.random() * 250;
    const angle = (-Math.PI / 2.2) + Math.random() * 0.6;
    const segs = Math.floor(len / 8);
    const path = [];

    for (let j = 0; j < segs; j++) {
      x += Math.cos(angle + Math.random() * 0.3 - 0.15) * 8;
      y += Math.sin(angle + Math.random() * 0.3 - 0.15) * 8;
      path.push({ x, y });
    }

    // Outer glow
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (const p of path) ctx.lineTo(p.x, p.y);
    ctx.shadowBlur = 25;
    ctx.shadowColor = "#00ff88";
    ctx.strokeStyle = `rgba(0,255,120,${glowIntensity})`;
    ctx.lineWidth = 5;
    ctx.stroke();

    // Core crack line
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (const p of path) ctx.lineTo(p.x, p.y);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#00ff99";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Master draw
function drawBackground() {
  // Base wall with slight texture
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, w, h);
  drawNoise();
  drawCracks();
}

function animate() {
  drawBackground();
  requestAnimationFrame(animate);
}
animate();

// Subtle parallax
const hero = document.querySelector(".hero");
if (hero) {
  window.addEventListener("mousemove", (e) => {
    const rx = (e.clientX - window.innerWidth / 2) / window.innerWidth;
    const ry = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    hero.style.transform = `translate3d(${rx * 8}px, ${ry * 6}px, 0)`;
  });
}

// Button focus
document.querySelectorAll(".btn").forEach((b) => {
  b.addEventListener(
    "focus",
    () => (b.style.outline = "2px dashed rgba(0,255,80,0.22)")
  );
  b.addEventListener("blur", () => (b.style.outline = "none"));
});


