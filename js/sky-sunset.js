/* ═══════════════════════════════════════════
   sky-sunset.js — Animation ciel coucher de soleil
   Gradient orangé→rose→violet qui glisse au scroll
   Soleil qui se couche · étoiles qui apparaissent · particules-braises
   ═══════════════════════════════════════════ */

const SunsetSky = (() => {

  /* ── Utilitaire interpolation couleurs hex ── */
  function lerp(a, b, t) {
    const parse = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
    const [ar,ag,ab] = parse(a);
    const [br,bg,bb] = parse(b);
    return `rgb(${Math.round(ar+(br-ar)*t)},${Math.round(ag+(bg-ag)*t)},${Math.round(ab+(bb-ab)*t)})`;
  }

  /* ── Canvas sky ── */
  const sky  = document.getElementById('sky-canvas');
  const sCtx = sky.getContext('2d');
  let stars  = null;

  function scrollProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(window.scrollY / max, 1) : 0;
  }

  function drawSky(p) {
    const W = sky.width, H = sky.height;
    sCtx.clearRect(0, 0, W, H);

    /* ── Gradient fond ── */
    // Haut très sombre pour la lisibilité du texte hero
    const topColor = p < 0.5
      ? lerp('#08021a', '#130328', p * 2)
      : lerp('#130328', '#0a0215', (p - 0.5) * 2);

    // Couche intermédiaire violacée sombre
    const midColor = p < 0.35
      ? lerp('#1a0530', '#2a0645', p / 0.35)
      : lerp('#2a0645', '#1a0330', (p - 0.35) / 0.65);

    // Horizon chaud : orangé → rose → violet (inchangé)
    const horizColor = p < 0.4
      ? lerp('#ff6b35', '#e8347a', p / 0.4)
      : lerp('#e8347a', '#7c3aed', (p - 0.4) / 0.6);

    const botColor = lerp('#0d0118', '#080010', p);

    const grad = sCtx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,    topColor);   // très sombre en haut
    grad.addColorStop(0.28, midColor);   // transition douce
    grad.addColorStop(0.58, horizColor); // couleur chaude plus bas
    grad.addColorStop(1,    botColor);
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, W, H);

    /* ── Soleil ── */
    if (p < 0.65) {
      const alpha  = 1 - p / 0.65;
      // Soleil commence plus bas (0.55 au lieu de 0.32) pour rester hors de la zone hero
      const sunY   = H * (0.55 + p * 0.12);
      const sunX   = W * 0.62;
      const coreR  = 36 * (1 - p * 0.45);

      /* Halo large */
      const halo = sCtx.createRadialGradient(sunX, sunY, 0, sunX, sunY, coreR * 4.5);
      halo.addColorStop(0,   `rgba(255,230,120,${0.85 * alpha})`);
      halo.addColorStop(0.2, `rgba(255,130,40,${0.6 * alpha})`);
      halo.addColorStop(0.5, `rgba(232,52,122,${0.3 * alpha})`);
      halo.addColorStop(1,   'rgba(0,0,0,0)');
      sCtx.fillStyle = halo;
      sCtx.beginPath();
      sCtx.arc(sunX, sunY, coreR * 4.5, 0, Math.PI * 2);
      sCtx.fill();

      /* Disque solaire */
      sCtx.beginPath();
      sCtx.arc(sunX, sunY, coreR, 0, Math.PI * 2);
      sCtx.fillStyle = `rgba(255,248,200,${alpha})`;
      sCtx.fill();
    }

    /* ── Étoiles (apparaissent après coucher) ── */
    if (p > 0.25) {
      if (!stars) {
        stars = Array.from({ length: 130 }, () => ({
          x: Math.random(), y: Math.random() * 0.52,
          r: Math.random() * 1.3 + 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.8
        }));
      }
      const starAlpha = Math.min((p - 0.25) / 0.4, 1);
      const t = Date.now() * 0.001;
      stars.forEach(s => {
        const twinkle = 0.45 + 0.55 * Math.sin(s.phase + t * s.speed);
        sCtx.beginPath();
        sCtx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        sCtx.fillStyle = `rgba(255,235,210,${starAlpha * twinkle * 0.85})`;
        sCtx.fill();
      });
    }
  }

  /* ── Canvas particules-braises ── */
  const pCanvas = document.getElementById('particle-canvas');
  const pCtx    = pCanvas.getContext('2d');
  let particles  = [];

  function makeEmber() {
    return {
      x:     Math.random() * pCanvas.width,
      y:     pCanvas.height + 10,
      r:     Math.random() * 2 + 0.5,
      vy:    -(Math.random() * 0.6 + 0.25),
      vx:    Math.random() * 0.6 - 0.3,
      alpha: Math.random() * 0.45 + 0.15,
      warm:  Math.random() < 0.5
    };
  }

  function initParticles() {
    pCanvas.width  = window.innerWidth;
    pCanvas.height = window.innerHeight;
    particles = Array.from({ length: 55 }, () => {
      const e = makeEmber();
      e.y = Math.random() * pCanvas.height;
      return e;
    });
  }

  function animParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    particles.forEach(p => {
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fillStyle = p.warm
        ? `rgba(255,130,60,${p.alpha})`
        : `rgba(232,100,180,${p.alpha})`;
      pCtx.fill();
      p.y += p.vy;
      p.x += p.vx;
      p.alpha -= 0.0008;
      if (p.y < -10 || p.alpha <= 0) Object.assign(p, makeEmber());
      if (p.x > pCanvas.width)  p.x = 0;
      if (p.x < 0) p.x = pCanvas.width;
    });
    if (SunsetSky.active) requestAnimationFrame(animParticles);
  }

  /* ── Boucle principale ── */
  let rafId = null;
  function loop() {
    sky.width  = window.innerWidth;
    sky.height = window.innerHeight;
    drawSky(scrollProgress());
    if (SunsetSky.active) rafId = requestAnimationFrame(loop);
  }

  /* ── API publique ── */
  return {
    active: false,

    start() {
      this.active = true;
      sky.style.opacity = '1';
      pCanvas.style.opacity = '0.45';
      initParticles();
      loop();
      animParticles();
      window.addEventListener('scroll', this._onScroll = () => drawSky(scrollProgress()));
      window.addEventListener('resize', this._onResize = () => { initParticles(); });
    },

    stop() {
      this.active = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', this._onScroll);
      window.removeEventListener('resize', this._onResize);
      const ctx = sky.getContext('2d');
      ctx.clearRect(0, 0, sky.width, sky.height);
      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    }
  };
})();
