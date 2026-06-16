/* ═══════════════════════════════════════════
   sky-day.js — Animation ciel journée ensoleillée
   Ciel azur · soleil haut · nuages qui dérivent · oiseaux
   ═══════════════════════════════════════════ */

const DaySky = (() => {

  const sky  = document.getElementById('sky-canvas');
  const sCtx = sky.getContext('2d');

  /* ── Nuages ── */
  let clouds = [];

  function makeCloud(W, H, fromEdge = false) {
    const x = fromEdge ? W + 80 : Math.random() * W;
    return {
      x,
      y:      H * (0.05 + Math.random() * 0.38),
      speed:  0.12 + Math.random() * 0.22,
      scale:  0.6 + Math.random() * 0.9,
      alpha:  0.55 + Math.random() * 0.35
    };
  }

  function drawCloud(ctx, x, y, sc, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(100,160,220,0.25)';
    ctx.shadowBlur  = 10 * sc;

    const puffs = [
      [x,        y,        28 * sc],
      [x + 30*sc, y - 10*sc, 22 * sc],
      [x - 28*sc, y - 5*sc,  18 * sc],
      [x + 60*sc, y,          20 * sc],
      [x - 55*sc, y + 5*sc,   16 * sc],
      [x + 15*sc, y + 12*sc,  22 * sc],
      [x - 15*sc, y + 8*sc,   18 * sc],
    ];

    ctx.beginPath();
    puffs.forEach(([cx, cy, r]) => ctx.arc(cx, cy, r, 0, Math.PI * 2));
    ctx.fill();
    ctx.restore();
  }

  /* ── Oiseaux ── */
  let birds = [];

  function makeBird(W, H, fromEdge = false) {
    const x = fromEdge ? -30 : Math.random() * W;
    return {
      x,
      y:      H * (0.04 + Math.random() * 0.32),
      speed:  0.55 + Math.random() * 1.1,
      scale:  0.5 + Math.random() * 0.6,
      phase:  Math.random() * Math.PI * 2,
      flapSpeed: 2.5 + Math.random() * 2.5
    };
  }

  function drawBird(ctx, x, y, sc, phase) {
    const wingY = Math.sin(phase) * 5 * sc;
    ctx.save();
    ctx.strokeStyle = 'rgba(30,60,100,0.55)';
    ctx.lineWidth   = 1.2 * sc;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 10*sc, y + wingY);
    ctx.quadraticCurveTo(x - 5*sc,  y - 4*sc + wingY, x, y);
    ctx.quadraticCurveTo(x +  5*sc, y - 4*sc + wingY, x + 10*sc, y + wingY);
    ctx.stroke();
    ctx.restore();
  }

  /* ── Dessin du ciel ── */
  function drawSky() {
    const W = sky.width, H = sky.height;
    sCtx.clearRect(0, 0, W, H);

    /* Gradient ciel jour */
    const grad = sCtx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,    '#4fc3f7');
    grad.addColorStop(0.25, '#64d0f5');
    grad.addColorStop(0.55, '#b3e5fc');
    grad.addColorStop(0.8,  '#d0effc');
    grad.addColorStop(1,    '#ddeeff');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, W, H);

    /* ── Soleil ── */
    const sunX = W * 0.72, sunY = H * 0.10, sunR = 42;

    /* Halo extérieur doux */
    const outerHalo = sCtx.createRadialGradient(sunX, sunY, sunR, sunX, sunY, sunR * 5);
    outerHalo.addColorStop(0,   'rgba(255,248,180,0.28)');
    outerHalo.addColorStop(0.4, 'rgba(255,220,100,0.10)');
    outerHalo.addColorStop(1,   'rgba(255,255,255,0)');
    sCtx.fillStyle = outerHalo;
    sCtx.beginPath();
    sCtx.arc(sunX, sunY, sunR * 5, 0, Math.PI * 2);
    sCtx.fill();

    /* Halo intérieur chaud */
    const innerHalo = sCtx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 2.2);
    innerHalo.addColorStop(0,   'rgba(255,248,200,0.9)');
    innerHalo.addColorStop(0.35,'rgba(255,230,100,0.6)');
    innerHalo.addColorStop(1,   'rgba(255,220,80,0)');
    sCtx.fillStyle = innerHalo;
    sCtx.beginPath();
    sCtx.arc(sunX, sunY, sunR * 2.2, 0, Math.PI * 2);
    sCtx.fill();

    /* Disque solaire */
    const sunGrad = sCtx.createRadialGradient(sunX - sunR*0.2, sunY - sunR*0.2, 0, sunX, sunY, sunR);
    sunGrad.addColorStop(0,   '#fffef0');
    sunGrad.addColorStop(0.6, '#ffe87a');
    sunGrad.addColorStop(1,   '#ffd040');
    sCtx.beginPath();
    sCtx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
    sCtx.fillStyle = sunGrad;
    sCtx.fill();

    /* Rayons solaires */
    sCtx.save();
    sCtx.strokeStyle = 'rgba(255,230,80,0.22)';
    sCtx.lineWidth   = 2;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + Date.now() * 0.00008;
      const inner = sunR * 1.3;
      const outer = sunR * (1.9 + 0.4 * Math.sin(angle * 3 + Date.now() * 0.0006));
      sCtx.beginPath();
      sCtx.moveTo(sunX + Math.cos(angle) * inner, sunY + Math.sin(angle) * inner);
      sCtx.lineTo(sunX + Math.cos(angle) * outer, sunY + Math.sin(angle) * outer);
      sCtx.stroke();
    }
    sCtx.restore();

    /* ── Nuages ── */
    clouds.forEach(c => drawCloud(sCtx, c.x, c.y, c.scale, c.alpha));

    /* ── Oiseaux ── */
    const t = Date.now() * 0.001;
    birds.forEach(b => drawBird(sCtx, b.x, b.y, b.scale, b.phase + t * b.flapSpeed));
  }

  /* ── Canvas particules (poussières lumineuses) ── */
  const pCanvas = document.getElementById('particle-canvas');
  const pCtx    = pCanvas.getContext('2d');
  let motes      = [];

  function makeMote() {
    return {
      x:     Math.random() * pCanvas.width,
      y:     pCanvas.height * (0.05 + Math.random() * 0.55),
      r:     Math.random() * 1.5 + 0.3,
      vy:    -(Math.random() * 0.2 + 0.05),
      vx:    Math.random() * 0.3 - 0.15,
      alpha: Math.random() * 0.3 + 0.05,
      life:  Math.random()
    };
  }

  function initMotes() {
    pCanvas.width  = window.innerWidth;
    pCanvas.height = window.innerHeight;
    motes = Array.from({ length: 45 }, () => { const m = makeMote(); m.y = Math.random() * pCanvas.height; return m; });
  }

  function animMotes() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    motes.forEach(m => {
      const twinkle = 0.5 + 0.5 * Math.sin(m.life * 6 + Date.now() * 0.001);
      pCtx.beginPath();
      pCtx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(255,240,160,${m.alpha * twinkle})`;
      pCtx.fill();
      m.y    += m.vy;
      m.x    += m.vx;
      m.life += 0.005;
      if (m.y < -10) Object.assign(m, makeMote());
    });
    if (DaySky.active) requestAnimationFrame(animMotes);
  }

  /* ── Boucle principale ── */
  let rafId = null;

  function updateEntities() {
    const W = sky.width, H = sky.height;

    /* Déplacer nuages */
    clouds.forEach(c => { c.x -= c.speed; });
    clouds = clouds.filter(c => c.x > -200 * c.scale);
    if (Math.random() < 0.003) clouds.push(makeCloud(W, H, true));

    /* Déplacer oiseaux */
    birds.forEach(b => { b.x += b.speed; });
    birds = birds.filter(b => b.x < W + 40);
    if (Math.random() < 0.004) birds.push(makeBird(W, H, true));
  }

  function loop() {
    sky.width  = window.innerWidth;
    sky.height = window.innerHeight;
    updateEntities();
    drawSky();
    if (DaySky.active) rafId = requestAnimationFrame(loop);
  }

  function initEntities() {
    const W = sky.width  = window.innerWidth;
    const H = sky.height = window.innerHeight;

    clouds = Array.from({ length: 6 }, () => makeCloud(W, H, false));
    birds  = Array.from({ length: 5 }, () => makeBird(W, H, false));
  }

  /* ── API publique ── */
  return {
    active: false,

    start() {
      this.active = true;
      sky.style.opacity    = '1';
      pCanvas.style.opacity = '0.7';
      initEntities();
      initMotes();
      loop();
      animMotes();
      window.addEventListener('resize', this._onResize = () => {
        initEntities();
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
