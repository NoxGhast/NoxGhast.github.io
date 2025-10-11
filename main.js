// === Nexus Ghoul: Ethereal Energy Flames Background === //

const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let w = (canvas.width = innerWidth);
let h = (canvas.height = innerHeight);

window.addEventListener('resize', () => {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
  initFlames();
});

const colors = [
  'rgba(0,255,120,0.9)', // neon green
  'rgba(50,255,100,0.75)',
  'rgba(80,255,160,0.6)',
  'rgba(0,200,80,0.9)'
];

let flames = [];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

class Flame {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = rand(0, w);
    this.y = h + rand(0, 40); // start from bottom
    this.vx = rand(-0.2, 0.2);
    this.vy = rand(-0.6, -1.4); // slower rise
    this.size = rand(18, 42);
    this.alpha = rand(0.4, 1);
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.life = rand(120, 280);
    this.maxLife = this.life;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy * 0.8; // smooth rise
    this.life--;
    if (this.life <= 0 || this.y < h * 0.45) this.reset(); // contained at bottom
  }

  draw() {
    const t = 1 - this.life / this.maxLife;
    const s = this.size * (0.8 + 0.4 * Math.sin(t * Math.PI));

    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, s);
    g.addColorStop(0, this.color);
    g.addColorStop(0.4, this.color.replace('0.9', '0.4'));
    g.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, s, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
}

function initFlames(n = 260) {
  flames = [];
  for (let i = 0; i < n; i++) flames.push(new Flame());
}
initFlames();

function animate() {
  ctx.clearRect(0, 0, w, h);

  // base dark green gradient ground glow
  const grad = ctx.createLinearGradient(0, h * 0.65, 0, h);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,40,0,0.5)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, h * 0.65, w, h * 0.35);

  for (let f of flames) {
    f.update();
    f.draw();
  }

  requestAnimationFrame(animate);
}
animate();

// Parallax movement for hero
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('mousemove', (e) => {
    const rx = (e.clientX - window.innerWidth / 2) / window.innerWidth;
    const ry = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    hero.style.transform = `translate3d(${rx * 8}px, ${ry * 6}px, 0)`;
  });
}

// Accessibility for buttons
document.querySelectorAll('.btn').forEach((b) => {
  b.addEventListener('focus', () => (b.style.outline = '2px dashed rgba(0,255,80,0.22)'));
  b.addEventListener('blur', () => (b.style.outline = 'none'));
});

