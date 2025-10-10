const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let w = canvas.width = innerWidth;
let h = canvas.height = innerHeight;
window.addEventListener('resize', ()=>{ w = canvas.width = innerWidth; h = canvas.height = innerHeight; initParticles(); });

const colors = ['rgba(0,255,100,0.08)','rgba(0,255,80,0.12)','rgba(0,255,60,0.18)','rgba(20,255,100,0.06)'];

let particles = [];
let mouse = {x: w/2, y: h/2};

function rand(min,max){ return Math.random()*(max-min)+min; }

class Particle{
  constructor(){
    this.reset();
  }
  reset(){
    this.x = rand(0,w);
    this.y = h + rand(0,200);
    this.vx = rand(-0.2,0.2);
    this.vy = rand(-0.3,-1.4);
    this.size = rand(6,30);
    this.life = rand(80,240);
    this.maxLife = this.life;
    this.color = colors[Math.floor(Math.random()*colors.length)];
    this.alpha = rand(0.06,0.22);
  }
  update(){
    this.x += this.vx + (mouse.x - w/2)*0.0003;
    this.y += this.vy;
    this.life--;
    if(this.life<=0 || this.y < -80) this.reset();
  }
  draw(){
    const g = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.size*1.8);
    g.addColorStop(0, this.color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
}

function initParticles(n=80){
  particles = [];
  for(let i=0;i<n;i++) particles.push(new Particle());
}
initParticles(120);

function animate(){
  ctx.clearRect(0,0,w,h);
  // faint smoky overlay
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(0,0,w,h);

  for(let p of particles){
    p.update();
    p.draw();
  }

  // soft green flame underlay
  const lingrad = ctx.createLinearGradient(0,h*0.6,0,h);
  lingrad.addColorStop(0,'rgba(0,0,0,0)');
  lingrad.addColorStop(1,'rgba(0,20,0,0.55)');
  ctx.fillStyle = lingrad;
  ctx.fillRect(0,h*0.66,w,h*0.34);

  requestAnimationFrame(animate);
}
animate();

// subtle parallax on hero when moving mouse
const hero = document.querySelector('.hero');
if(hero){
  window.addEventListener('mousemove', (e)=>{
    const rx = (e.clientX - window.innerWidth/2) / window.innerWidth;
    const ry = (e.clientY - window.innerHeight/2) / window.innerHeight;
    hero.style.transform = `translate3d(${rx*8}px, ${ry*6}px, 0)`;
  });
}

// tiny accessibility: keyboard focus styles for buttons
document.querySelectorAll('.btn').forEach(b=>{
  b.addEventListener('focus', ()=> b.style.outline = '2px dashed rgba(0,255,80,0.22)');
  b.addEventListener('blur', ()=> b.style.outline = 'none');
});
