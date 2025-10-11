
// === Nexus Ghoul Realistic Neon Crack Wall ===
// Version A: realistic cracked surface + pulsing neon glow

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let w = (canvas.width = innerWidth);
let h = (canvas.height = innerHeight);

window.addEventListener("resize", () => {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
  drawCracks();
});

function drawCracks() {
  ctx.clearRect(0, 0, w, h);

  // Base dark wall texture
  ctx.fillStyle = "#020202";
  ctx.fillRect(0, 0, w, h);

  // Randomized crack paths
  const cracks = 60;
  for (let i = 0; i < cracks; i++) {
    const startX = Math.random() * w;
    const startY = Math.random() * h;
    let len = 80 + Math.random() * 220;
    let angle = Math.random() * Math.PI * 2;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    for (let j = 0; j < len; j++) {
      const x = startX + Math.cos(angle) * j;
      const y = startY + Math.sin(angle) * j;
      if (x < 0 || x > w || y < 0 || y > h) break;
      const flicker = Math.random() * 2;
      ctx.lineTo(x + Math.sin(j / 3) * flicker, y + Math.cos(j / 2) * flicker);
      if (Math.random() > 0.97) angle += (Math.random() - 0.5) * 0.5;
    }

    ctx.strokeStyle = "rgba(0, 255, 80, 0.6)";
    ctx.lineWidth = Math.random() * 2.4 + 1.2;
    ctx.shadowColor = "#00FF66";
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

let pulse = 0;
function animate() {
  pulse += 0.01;
  const glow = Math.sin(pulse) * 0.2 + 0.8; // soft pulse intensity

  ctx.globalCompositeOperation = "source-over";
  drawCracks();

  // Green glow overlay
  const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w);
  gradient.addColorStop(0, `rgba(0,255,100,${0.05 * glow})`);
  gradient.addColorStop(1, "rgba(0,0,0,0.85)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  requestAnimationFrame(animate);
}

drawCracks();
animate();



