// === Nexus Ghoul: Ethereal Energy Flames Background === //

const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let w = canvas.width = innerWidth;
let h = canvas.height = innerHeight;

window.addEventListener('resize', () => {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
  initParticles();
});

const colors = [
  'rgba(0, 255, 80, 0.25)',
  'rgba(0, 255, 120, 0.18)',
  'rgba(100, 255, 150, 0.14)',
  'rgba(0, 180, 60, 0.18)',
  'rgba(80, 255, 180, 0.10)'
];

let particles = [];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

class Flame {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = rand(0, w);
    this.y = rand(h * 0.7, h + 50);
    this.size = rand(20, 80);
    this.speedY = rand(0.4, 1.8);
    this.alpha = rand(0.05, 0.18);
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.life = rand(150, 400);
    this.vx = rand(-0.3, 0.3);
  }
  update() {
    this.y -= this.speedY;
    this.x += this.vx * 0.3;
    this.life--;
    if (this.life <= 0 || this.y < -100) this.reset();
  }
  draw() {
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    g.addColorStop(0, this.color);
    g.addColorStop(0.4, 'rgba(0,255,80,0.05)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
}

function initParticles(count = 180) {
  particles = [];
  for (let i = 0; i < count; i++) particles.push(new Flame());
}

initParticles();

function animate() {
  ctx.clearRect(0, 0, w, h);

  // Slight smoky background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(0, 0, w, h);

  for (let f of particles) {
    f.update();
    f.draw();
  }

  // faint green glow at bottom
  const grad = ctx.createLinearGradient(0, h * 0.5, 0, h);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,255,80,0.08)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, h * 0.6, w, h * 0.4);

  requestAnimationFrame(animate);
}

animate();

// subtle parallax on hero
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('mousemove', (e) => {
    const rx = (e.clientX - window.innerWidth / 2) / window.innerWidth;
    const ry = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    hero.style.transform = `translate3d(${rx * 8}px, ${ry * 6}px, 0)`;
  });
}

// focus outlines for accessibility
document.querySelectorAll('.btn').forEach(b => {
  b.addEventListener('focus', () => b.style.outline = '2px dashed rgba(0,255,80,0.22)');
  b.addEventListener('blur', () => b.style.outline = 'none');
});
