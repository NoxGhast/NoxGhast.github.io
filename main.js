
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

/* ===== codec conversation script ===== */
(function(){
  // Replace selectors if your IDs/names differ
  const campbellPortrait = document.querySelector('.codec-portrait.left');
  const nexusPortrait = document.querySelector('.codec-portrait.right');
  const dialogueEl = document.getElementById('dialogue-line');

  // Conversation sequence (speaker: 'left' = Campbell, 'right' = Nexus)
  const sequence = [
    { speaker: 'left',  text: "Nexus, do you read me?" },
    { speaker: 'right', text: "Loud and clear, Campbell." },
    { speaker: 'left',  text: "I hear that you play a lot of video games. Lots of different kinds of video games." },
    { speaker: 'right', text: "Well, if you're that curious, go on down to my YouTube channel at nexus_ghoul. Feel free to check it out — all my cool and wacky games — and enjoy yourselves." }
  ];

  // timing controls
  const typingSpeed = 28;     // ms per character
  const holdAfter = 1200;     // ms to hold after finish before fade out
  const fadeOutTime = 350;    // fade-out duration (ms)
  const betweenLines = 220;   // time between finished fade and next start

  // WebAudio beep generator (short subtle beep)
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  function playBeep() {
    try {
      const now = audioCtx.currentTime;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      // chirp from 760 -> 1080Hz
      o.frequency.setValueAtTime(760, now);
      o.frequency.exponentialRampToValueAtTime(1080, now + 0.12);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start(now);
      o.stop(now + 0.18);
    } catch (e) {
      // AudioContext may be blocked by autoplay policies; fail silently
      // (No beep will play)
    }
  }

  function setSpeaking(speaker) {
    campbellPortrait.classList.remove('speaking');
    nexusPortrait.classList.remove('speaking');
    if (speaker === 'left') campbellPortrait.classList.add('speaking');
    if (speaker === 'right') nexusPortrait.classList.add('speaking');
  }

  async function typeText(text) {
    dialogueEl.style.opacity = 1;
    dialogueEl.innerHTML = ''; // clear
    const wrapper = document.createElement('span');
    wrapper.className = 'dialogue-text';
    dialogueEl.appendChild(wrapper);

    // letter by letter (no typing audio)
    for (let i = 0; i < text.length; i++) {
      wrapper.textContent += text[i];
      await new Promise(r => setTimeout(r, typingSpeed));
    }

    // add caret
    const caret = document.createElement('span');
    caret.className = 'caret';
    wrapper.appendChild(caret);
  }

  function fadeOut() {
    return new Promise((resolve) => {
      dialogueEl.style.transition = `opacity ${fadeOutTime}ms ease`;
      dialogueEl.style.opacity = 0;
      setTimeout(() => {
        dialogueEl.style.transition = '';
        dialogueEl.innerHTML = '';
        resolve();
      }, fadeOutTime + 10);
    });
  }

  // run the sequence in loop
  async function runLoop() {
    while (true) {
      for (let i = 0; i < sequence.length; i++) {
        const item = sequence[i];
        setSpeaking(item.speaker);
        // beep at start
        playBeep();
        // slight delay so the portrait twitch is visible before text
        await new Promise(r => setTimeout(r, 140));
        await typeText(item.text);
        // hold
        await new Promise(r => setTimeout(r, holdAfter));
        await fadeOut();
        setSpeaking(null);
        await new Promise(r => setTimeout(r, betweenLines));
      }
      // small extra pause before looping
      await new Promise(r => setTimeout(r, 600));
    }
  }

  // start when user interacts or page is visible (autoplay policies)
  let started = false;
  function tryStart() {
    if (started) return;
    // resume audio context if necessary
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(()=>{});
    }
    started = true;
    runLoop().catch(console.error);
  }

  // best-effort start: try after user first click or visibility
  window.addEventListener('click', tryStart, { once: true });
  window.addEventListener('keydown', tryStart, { once: true });
  document.addEventListener('visibilitychange', ()=> {
    if (!document.hidden) tryStart();
  });

  // also attempt a gentle delayed start (may be blocked until user interacts)
  setTimeout(tryStart, 800);
})();


