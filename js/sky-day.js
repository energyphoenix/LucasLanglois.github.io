/* ═══════════════════════════════════════════
   sky-day.js — Animation ciel de jour en montagne
   Bleu azur · soleil · nuages qui dérivent · pollen/brume
   ═══════════════════════════════════════════ */

const DaySky = (() => {

  const sky  = document.getElementById('sky-canvas');
  const sCtx = sky.getContext('2d');

  /* ── Nuages (générés une fois) ── */
  let clouds = null;

  function makeClouds(W, H) {
    return Array.from({ length: 7 }, (_, i) => ({
      x:     Math.random() * W * 1.4 - W * 0.2,
      y:     H * (0.06 + Math.random() * 0.28),
      w:     120 + Math.random() * 200,
      h:     40  + Math.random() * 50,
      speed: 0.12 + Math.random() * 0.18,
      alpha: 0.55 + Math.random() * 0.35,
      puffs: Math.floor(3 + Math.random() * 3)
    }));
  }

  function drawCloud(ctx, x, y, w, h, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const puffs = Math.ceil(w / 55);
    for (let i = 0; i < puffs; i++) {
      const px = x + (i / (puffs - 1 || 1)) * w;
      const py = y + h * 0.5 - Math.sin((i / (puffs - 1 || 1)) * Math.PI) * h * 0.5;
      const r  = h * (0.4 + 0.3 * Math.sin((i / puffs) * Math.PI));
      const cg = ctx.createRadialGradient(px, py - r * 0.2, 0, px, py, r);
      cg.addColorStop(0,   'rgba(255,255,255,0.98)');
      cg.addColorStop(0.6, 'rgba(240,246,255,0.85)');
      cg.addColorStop(1,   'rgba(200,220,255,0)');
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawSky() {
    const W = sky.width, H = sky.height;
    sCtx.clearRect(0, 0, W, H);

    /* ── Gradient ciel azur ── */
    const grad = sCtx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,    '#3a8fd4');   // bleu profond en haut
    grad.addColorStop(0.35, '#5aabee');   // bleu azur
    grad.addColorStop(0.7,  '#8ecff5');   // ciel pâle
    grad.addColorStop(1,    '#c8e8fa');   // brume horizon
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, W, H);

    /* ── Voile atmosphérique (brume de montagne) ── */
    const haze = sCtx.createLinearGradient(0, H * 0.55, 0, H);
    haze.addColorStop(0,   'rgba(220,240,255,0)');
    haze.addColorStop(1,   'rgba(220,240,255,0.22)');
    sCtx.fillStyle = haze;
    sCtx.fillRect(0, H * 0.55, W, H);

    /* ── Soleil ── */
    const sunX = W * 0.72, sunY = H * 0.14, sunR = 38;
    /* Halo atmosphérique large */
    const halo2 = sCtx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 7);
    halo2.addColorStop(0,   'rgba(255,245,180,0.55)');
    halo2.addColorStop(0.15,'rgba(255,230,100,0.28)');
    halo2.addColorStop(0.4, 'rgba(255,200,80,0.10)');
    halo2.addColorStop(1,   'rgba(255,200,80,0)');
    sCtx.fillStyle = halo2;
    sCtx.beginPath();
    sCtx.arc(sunX, sunY, sunR * 7, 0, Math.PI * 2);
    sCtx.fill();
    /* Disque solaire blanc-jaune */
    const sunGrad = sCtx.createRadialGradient(sunX - sunR*0.2, sunY - sunR*0.2, 0, sunX, sunY, sunR);
    sunGrad.addColorStop(0,   'rgba(255,255,240,1)');
    sunGrad.addColorStop(0.6, 'rgba(255,240,160,0.95)');
    sunGrad.addColorStop(1,   'rgba(255,210,80,0.85)');
    sCtx.beginPath();
    sCtx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
    sCtx.fillStyle = sunGrad;
    sCtx.fill();

    /* ── Nuages ── */
    if (clouds) {
      const t = Date.now() * 0.001;
      clouds.forEach(c => {
        // dérive lente
        c.x += c.speed * 0.4;
        if (c.x > W + c.w) c.x = -c.w;
        drawCloud(sCtx, c.x, c.y, c.w, c.h, c.alpha);
      });
    }
  }

  /* ── Canvas particules — pollen & brume ── */
  const pCanvas = document.getElementById('particle-canvas');
  const pCtx    = pCanvas.getContext('2d');
  let motes      = [];

  function makeMote() {
    const warm = Math.random() < 0.6;
    return {
      x:     Math.random() * pCanvas.width,
      y:     pCanvas.height * (0.3 + Math.random() * 0.7),
      r:     Math.random() * 1.8 + 0.3,
      vy:    -(Math.random() * 0.3 + 0.08),
      vx:    Math.random() * 0.5 - 0.25,
      alpha: Math.random() * 0.35 + 0.08,
      warm
    };
  }

  function initMotes() {
    pCanvas.width  = window.innerWidth;
    pCanvas.height = window.innerHeight;
    motes = Array.from({ length: 80 }, () => {
      const m = makeMote();
      m.y = Math.random() * pCanvas.height;
      return m;
    });
  }

  function animMotes() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    motes.forEach(m => {
      pCtx.beginPath();
      pCtx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      pCtx.fillStyle = m.warm
        ? `rgba(255,210,80,${m.alpha})`    // pollen doré
        : `rgba(180,220,255,${m.alpha})`;  // brume bleue
      pCtx.fill();
      m.y += m.vy;
      m.x += m.vx;
      m.alpha -= 0.0004;
      if (m.y < -10 || m.alpha <= 0) Object.assign(m, makeMote());
      if (m.x > pCanvas.width)  m.x = 0;
      if (m.x < 0) m.x = pCanvas.width;
    });
    if (DaySky.active) requestAnimationFrame(animMotes);
  }

  /* ── Boucle principale ── */
  let rafId = null;
  function loop() {
    sky.width  = window.innerWidth;
    sky.height = window.innerHeight;
    if (!clouds) clouds = makeClouds(sky.width, sky.height);
    drawSky();
    if (DaySky.active) rafId = requestAnimationFrame(loop);
  }

  /* ── API publique ── */
  return {
    active: false,

    start() {
      this.active = true;
      sky.style.opacity = '1';
      pCanvas.style.opacity = '0.6';
      clouds = null;
      initMotes();
      loop();
      animMotes();
      window.addEventListener('resize', this._onResize = () => {
        clouds = null;
        initMotes();
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