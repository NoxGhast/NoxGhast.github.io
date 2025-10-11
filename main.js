// === Nexus Ghoul: Ethereal Energy Flames Background === //

// === Neon Crack Pulse Background ===
// Nexus Ghoul special - fixed cracks, pulsing neon energy

const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

let w = canvas.width = innerWidth;
let h = canvas.height = innerHeight;
window.addEventListener('resize', () => {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
  generateCracks();
});

// Utility
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max)); }

let cracks = [];

function generateCracks() {
  cracks = [];
  const count = 18; // number of main cracks
  for (let i = 0; i < count; i++) {
    let points = [];
    let x = rand(0, w);
    let y = rand(h * 0.65, h); // lower half of screen
    let len = rand(120, 380);
    let angle = rand(-Math.PI / 2.2, -Math.PI / 1.3); // mostly upward
    let jaggedness = rand(8, 16);
    let segs = Math.floor(len / 10);
    for (let j = 0; j < segs; j++) {
      x += Math.cos(angle) * 10;
      y += Math.sin(angle) * 10;
      angle += rand(-0.3, 0.3);
      points.push({ x, y });
    }
    cracks.push(points);
  }
}
generateCracks();

let pulse = 0;
function animate() {
  ctx.clearRect(0, 0, w, h);

  // dark cracked wall base
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, w, h);

  // pulse for brightness
  pulse += 0.03;
  const glowAlpha = 0.35 + Math.sin(pulse) * 0.15;
  const lineWidth = 1.5 + Math.sin(pulse * 1.2) * 0.6;

  // draw glow layer
  ctx.globalCompositeOperation = 'lighter';
  for (let path of cracks) {
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let p of path) ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = `rgba(0,255,120,${glowAlpha})`;
    ctx.lineWidth = lineWidth + 2.5;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ff80';
    ctx.stroke();
  }

  // draw sharp neon core
  for (let path of cracks) {
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let p of path) ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = '#00ff80';
    ctx.lineWidth = lineWidth;
    ctx.shadowBlur = 0;
    ctx.stroke();
  }

  ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(animate);
}
animate();

// Subtle parallax on hero section
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('mousemove', (e) => {
    const rx = (e.clientX - window.innerWidth / 2) / window.innerWidth;
    const ry = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    hero.style.transform = `translate3d(${rx * 8}px, ${ry * 6}px, 0)`;
  });
}

// Accessibility outlines
document.querySelectorAll('.btn').forEach((b) => {
  b.addEventListener('focus', () => b.style.outline = '2px dashed rgba(0,255,80,0.22)');
  b.addEventListener('blur', () => b.style.outline = 'none');
});

