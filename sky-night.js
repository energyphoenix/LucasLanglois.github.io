/* ═══════════════════════════════════════════
   sky-night.js — Animation ciel nuit en montagne
   Bleu nuit profond · lune · aurore subtile · flocons
   ═══════════════════════════════════════════ */

const NightSky = (() => {

  const sky  = document.getElementById('sky-canvas');
  const sCtx = sky.getContext('2d');

  /* ── Étoiles fixes (générées une fois) ── */
  let stars = null;
  function makeStars(W, H) {
    return Array.from({ length: 180 }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H * 0.65,
      r:     Math.random() * 1.4 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.9
    }));
  }

  function drawSky() {
    const W = sky.width, H = sky.height;
    sCtx.clearRect(0, 0, W, H);

    /* ── Ciel nuit : dégradé fixe bleu très sombre ── */
    const grad = sCtx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,    '#020a18');
    grad.addColorStop(0.3,  '#04102a');
    grad.addColorStop(0.65, '#071830');
    grad.addColorStop(1,    '#040c1e');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, W, H);

    /* ── Aurore subtile ── */
    const auroraX = W * 0.4;
    const aurora  = sCtx.createRadialGradient(auroraX, H * 0.12, 0, auroraX, H * 0.12, W * 0.55);
    aurora.addColorStop(0,   'rgba(0,198,255,0.055)');
    aurora.addColorStop(0.4, 'rgba(100,80,220,0.04)');
    aurora.addColorStop(1,   'rgba(0,0,0,0)');
    sCtx.fillStyle = aurora;
    sCtx.fillRect(0, 0, W, H);

    /* ── Lune ── */
    const moonX = W * 0.75, moonY = H * 0.12, moonR = 28;
    /* Halo lune */
    const moonHalo = sCtx.createRadialGradient(moonX, moonY, moonR * 0.5, moonX, moonY, moonR * 4);
    moonHalo.addColorStop(0,   'rgba(180,210,255,0.22)');
    moonHalo.addColorStop(0.4, 'rgba(140,180,255,0.08)');
    moonHalo.addColorStop(1,   'rgba(0,0,0,0)');
    sCtx.fillStyle = moonHalo;
    sCtx.beginPath();
    sCtx.arc(moonX, moonY, moonR * 4, 0, Math.PI * 2);
    sCtx.fill();
    /* Disque lunaire */
    const moonGrad = sCtx.createRadialGradient(moonX - moonR * 0.2, moonY - moonR * 0.2, 0, moonX, moonY, moonR);
    moonGrad.addColorStop(0,   'rgba(240,248,255,0.95)');
    moonGrad.addColorStop(0.7, 'rgba(200,222,255,0.9)');
    moonGrad.addColorStop(1,   'rgba(160,195,240,0.8)');
    sCtx.beginPath();
    sCtx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    sCtx.fillStyle = moonGrad;
    sCtx.fill();

    /* ── Étoiles scintillantes ── */
    if (stars) {
      const t = Date.now() * 0.001;
      stars.forEach(s => {
        const twinkle = 0.4 + 0.6 * Math.sin(s.phase + t * s.speed);
        sCtx.beginPath();
        sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        sCtx.fillStyle = `rgba(200,222,255,${twinkle * 0.75})`;
        sCtx.fill();
      });
    }
  }

  /* ── Canvas flocons ── */
  const pCanvas = document.getElementById('particle-canvas');
  const pCtx    = pCanvas.getContext('2d');
  let flakes     = [];

  function makeFlake() {
    return {
      x:     Math.random() * pCanvas.width,
      y:     -10,
      r:     Math.random() * 2.2 + 0.4,
      vy:    Math.random() * 0.7 + 0.25,
      vx:    Math.random() * 0.45 - 0.22,
      alpha: Math.random() * 0.55 + 0.15
    };
  }

  function initFlakes() {
    pCanvas.width  = window.innerWidth;
    pCanvas.height = window.innerHeight;
    flakes = Array.from({ length: 160 }, () => {
      const f = makeFlake();
      f.y = Math.random() * pCanvas.height;
      return f;
    });
  }

  function animFlakes() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    flakes.forEach(f => {
      pCtx.beginPath();
      pCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(200,222,255,${f.alpha})`;
      pCtx.fill();
      f.y += f.vy;
      f.x += f.vx;
      if (f.y > pCanvas.height + 10) Object.assign(f, makeFlake());
      if (f.x > pCanvas.width)  f.x = 0;
      if (f.x < 0) f.x = pCanvas.width;
    });
    if (NightSky.active) requestAnimationFrame(animFlakes);
  }

  /* ── Boucle sky ── */
  let rafId = null;
  function loop() {
    sky.width  = window.innerWidth;
    sky.height = window.innerHeight;
    if (!stars) stars = makeStars(sky.width, sky.height);
    drawSky();
    if (NightSky.active) rafId = requestAnimationFrame(loop);
  }

  /* ── API publique ── */
  return {
    active: false,

    start() {
      this.active = true;
      sky.style.opacity = '1';
      pCanvas.style.opacity = '0.55';
      stars = null; // recalcul au prochain loop
      initFlakes();
      loop();
      animFlakes();
      window.addEventListener('resize', this._onResize = () => {
        stars = null;
        initFlakes();
      });
    },

    stop() {
      this.active = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', this._onResize);
      sCtx.clearRect(0, 0, sky.width, sky.height);
      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    }
  };
})();