/* ═══════════════════════════════════════════
   main.js — Logique principale + switcher de thème
   ═══════════════════════════════════════════ */

/* ══════════════════════════════════════
   THEME SWITCHER
   ══════════════════════════════════════ */
const ThemeManager = (() => {
  const root      = document.documentElement;
  const themeLink = document.getElementById('theme-css');
  const btnDay    = document.getElementById('btn-day');
  const btnSunset = document.getElementById('btn-sunset');
  const btnNight  = document.getElementById('btn-night');

  let current = localStorage.getItem('ll-theme') || 'sunset';

  function applyTheme(name, animate = false) {
    if (name === current && root.dataset.theme === name) return;

    if (animate) {
      document.body.style.transition = 'opacity .35s';
      document.body.style.opacity    = '0';
      setTimeout(() => {
        _setTheme(name);
        document.body.style.opacity = '1';
        setTimeout(() => { document.body.style.transition = ''; }, 400);
      }, 300);
    } else {
      _setTheme(name);
    }
  }

  function _setTheme(name) {
    current = name;
    root.dataset.theme = name;
    localStorage.setItem('ll-theme', name);

    themeLink.href = `css/theme-${name}.css`;

    btnDay.classList.toggle('active', name === 'day');
    btnSunset.classList.toggle('active', name === 'sunset');
    btnNight.classList.toggle('active',  name === 'night');

    if (typeof DaySky !== 'undefined') DaySky.stop();
    if (typeof SunsetSky !== 'undefined') SunsetSky.stop();
    if (typeof NightSky !== 'undefined') NightSky.stop();

    if (name === 'day' && typeof DaySky !== 'undefined') DaySky.start();
    else if (name === 'sunset' && typeof SunsetSky !== 'undefined') SunsetSky.start();
    else if (name === 'night' && typeof NightSky !== 'undefined') NightSky.start();
  }

  function init() {
    root.dataset.theme = current;
    themeLink.href = `css/theme-${current}.css`;

    btnDay.classList.toggle('active', current === 'day');
    btnSunset.classList.toggle('active', current === 'sunset');
    btnNight.classList.toggle('active',  current === 'night');

    if (current === 'day' && typeof DaySky !== 'undefined') DaySky.start();
    else if (current === 'sunset' && typeof SunsetSky !== 'undefined') SunsetSky.start();
    else if (current === 'night' && typeof NightSky !== 'undefined') NightSky.start();

    btnDay.addEventListener('click', () => applyTheme('day', true));
    btnSunset.addEventListener('click', () => applyTheme('sunset', true));
    btnNight.addEventListener('click',  () => applyTheme('night',  true));
  }

  return { init, applyTheme };
})();

/* ══════════════════════════════════════
   NAVBAR — fond au scroll
   ══════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 60);
});


/* ══════════════════════════════════════
   REVEAL ON SCROLL
   ══════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


/* ══════════════════════════════════════
   SKILLS CAROUSEL
   ══════════════════════════════════════ */
const skills = [
  { icon: 'fa-brands fa-python',       name: 'Python'     },
  { icon: 'fa-solid fa-cubes',          name: 'Django'     },
  { icon: 'fa-solid fa-flask',          name: 'Flask'      },
  { icon: 'fa-brands fa-symfony',       name: 'Symfony'    },
  { icon: 'fa-brands fa-android',       name: 'Android'    },
  { icon: 'fa-solid fa-code',           name: 'C++'        },
  { icon: 'fa-brands fa-java',          name: 'Java'       },
  { icon: 'fa-brands fa-html5',         name: 'HTML/CSS'   },
  { icon: 'fa-brands fa-js',            name: 'JavaScript' },
  { icon: 'fa-solid fa-database',       name: 'SQL'        },
  { icon: 'fa-brands fa-linux',         name: 'Linux'      },
  { icon: 'fa-brands fa-git-alt',       name: 'Git'        },
  { icon: 'fa-solid fa-network-wired',  name: 'Réseaux'    }
];

const track = document.getElementById('skills-track');
[...skills, ...skills].forEach(s => {
  const card = document.createElement('div');
  card.className = 'skill-card';
  card.innerHTML = `
    <div class="skill-icon"><i class="${s.icon}"></i></div>
    <div class="skill-name">${s.name}</div>`;
  track.appendChild(card);
});


/* ══════════════════════════════════════
   PROJECTS
   ══════════════════════════════════════ */
const projects = [
  {
    id: 4,
    icon: 'fa-solid fa-server',
    name: 'CMDB STRESY — DSIM',
    bg:      'linear-gradient(135deg,#0a1428,#1a4a7a)',
    bgNight: 'linear-gradient(135deg,#040a18,#0a2a4a)',
    bgDay:   'linear-gradient(135deg,#1565c0,#42a5f5)',
    tags: ['Django', 'Python', 'Docker', 'JavaScript'],
    desc: "Application web CMDB centralisant en temps réel les inventaires de machines virtuelles et logiciels d'un service informatique universitaire.",
    details: "Stage de 10 semaines effectué au sein du service STRESY de la Direction des Systèmes d'Informations Mutualisés (DSIM) de l'UGA. La mission consistait à concevoir et déployer une application web de type CMDB (Configuration Management Database) agrégeant en temps réel, sans base de données locale, les inventaires de machines virtuelles et de logiciels de l'université à partir de plusieurs API REST distantes. J'ai développé le backend avec Django (Python) et l'interface interactive en HTML/CSS/JavaScript : recherche par mots-clés, filtres par colonne, tri et pagination dynamique, exports CSV/PDF/YAML. Une stratégie de cache applicatif et un script Python autonome de collecte des versions de noyaux Linux ont permis d'optimiser les performances, avant un déploiement conteneurisé avec Docker directement utilisé en production par l'équipe.",
    features: ['Agrégation temps réel de plusieurs API REST sans base de données locale', 'Tableau de bord interactif (recherche, filtres, tri, pagination)', 'Exports CSV / PDF / YAML et cache applicatif Django', 'Déploiement conteneurisé avec Docker'],
    role: 'Développeur Full-stack (stage)',
    duration: '20 avril – 26 juin 2026',
    links: []
  },
  {
    id: 3,
    icon: 'fa-brands fa-symfony',
    name: 'Refonte App. Recherche de Stages',
    bg:      'linear-gradient(135deg,#0a1f1a,#1a6b54)',
    bgNight: 'linear-gradient(135deg,#06140f,#0d3328)',
    bgDay:   'linear-gradient(135deg,#00838f,#26c6da)',
    tags: ['PHP', 'Symfony', 'SQL', 'Docker'],
    desc: "Amélioration qualité d'une application de recherche de stages (mobile Android + back-office Symfony), pilotée en tant que chef de projet.",
    details: "Projet réalisé en groupe de 6 dans le cadre de la SAE 4.01, visant à améliorer la qualité et l'optimisation d'une application existante de recherche de stages, composée d'une application mobile Android pour les étudiants et d'un back-office Web Symfony pour l'administration. En tant que chef de projet, j'ai assuré la coordination de l'équipe et le suivi global de l'avancement, tout en travaillant principalement sur l'application Web Symfony : renforcement de la sécurité (authentification, contrôle d'accès par rôle, rate limiting), alignement aux règles métier, optimisation des requêtes SQL et de l'architecture API Platform, ainsi que la mise en place de tests automatisés et de la documentation technique.",
    features: ['Pilotage de projet (planning, coordination, suivi d\'équipe)', 'Renforcement de la sécurité et du contrôle d\'accès par rôle', 'Optimisation des requêtes SQL et de l\'architecture API Platform', 'Tests automatisés (PHPUnit, Cypress) et documentation technique'],
    role: 'Chef de projet & Développeur Symfony',
    duration: 'Sept. 2025 – Avril 2026',
    links: []
  },
  {
    id: 0,
    icon: 'fa-solid fa-people-arrows',
    name: "Entour'âge",
    bg:      'linear-gradient(135deg,#2a0838,#8b1a4a)',
    bgNight: 'linear-gradient(135deg,#07122b,#0d3060)',
    bgDay:   'linear-gradient(135deg,#0077cc,#38bdf8)',
    tags: ['JavaScript', 'HTML/CSS', 'Flask', 'MariaDB'],
    desc: 'Coordination du suivi quotidien de personnes dépendantes entre aidants, aides à domicile et médecins.',
    details: "Entour'âge est une application Web de coordination entre aidants, aides à domicile et médecins pour le suivi quotidien de personnes dépendantes. Elle centralise la gestion des rendez-vous, la communication entre les différents acteurs du soin et le suivi médical et administratif, au sein d'une interface claire et accessible à tous les profils d'utilisateurs. Je me suis principalement concentré sur le frontend : intégration HTML/CSS/JavaScript et responsive design pour offrir une navigation fluide à tous les profils d'utilisateurs, en lien avec le backend Python/Flask et la base de données MariaDB.",
    features: ['Intégration frontend HTML/CSS/JavaScript', 'Interface responsive accessible à tous les profils', 'Gestion des rendez-vous et communication aidants/médecins', 'Liaison avec le backend Python/Flask et MariaDB'],
    role: 'Développeur Front-end',
    duration: '2025 – 2026',
    links: [{ label: 'Voir le site', url: 'https://nicolasgraver.alwaysdata.net/auth/login', type: 'primary' }]
  },
  {
    id: 1,
    icon: 'fa-solid fa-database',
    name: 'Projet Marianne',
    bg:      'linear-gradient(135deg,#1a0a3a,#5b2d8c)',
    bgNight: 'linear-gradient(135deg,#071235,#1a0a4a)',
    bgDay:   'linear-gradient(135deg,#1565c0,#0097a7)',
    tags: ['Java', 'SQL', 'GitHub'],
    desc: 'Application de gestion en Java connectée à une base de données SQL.',
    details: "Création d'une application de gestion complète. Ma mission principale a consisté à concevoir et mettre en place la liaison robuste entre l'interface graphique et la base de données relationnelle. J'ai également joué un rôle central dans l'organisation du travail d'équipe et le suivi global du projet grâce aux outils de versioning.",
    features: ['Développement logique en Java', 'Liaison Interface / Base de données SQL', 'Gestion de projet en équipe', 'Versioning et suivi sur GitHub'],
    role: 'Développeur Java',
    duration: 'Févr. – Juin 2025',
    links: []
  },
  {
    id: 2,
    icon: 'fa-solid fa-pen-nib',
    name: 'Refonte Sopra Steria',
    bg:      'linear-gradient(135deg,#1a0830,#a02060)',
    bgNight: 'linear-gradient(135deg,#0a1a20,#0a3040)',
    bgDay:   'linear-gradient(135deg,#0288d1,#26c6da)',
    tags: ['HTML', 'CSS', 'UI/UX'],
    desc: "Refonte front-end d'un site web pour faciliter la recherche de stages.",
    details: "Projet centré sur l'amélioration de l'expérience utilisateur. J'ai réalisé la refonte complète du front-end d'un site web lié à Sopra Steria. L'objectif était de moderniser l'ergonomie visuelle et structurelle pour rendre la recherche et la consultation d'offres de stages beaucoup plus intuitives et accessibles.",
    features: ['Intégration HTML/CSS', 'Refonte ergonomique et UI/UX', 'Design Responsive', "Optimisation du parcours utilisateur"],
    role: 'Développeur Front-end',
    duration: 'Novembre 2024',
    links: [{ label: 'Voir la maquette', url: '#', type: 'ghost' }]
  }
];

function getThumbBg(p) {
  /* localStorage en priorité : au moment où les cards sont créées, ThemeManager.init()
     n'a pas encore tourné, donc dataset.theme vaut encore "sunset" (valeur HTML par
     défaut), ce qui ignorerait le choix sauvegardé. On lit localStorage d'abord. */
  const theme = localStorage.getItem('ll-theme')
             || document.documentElement.dataset.theme
             || 'sunset';
  if (theme === 'night') return p.bgNight;
  if (theme === 'day')   return p.bgDay;
  return p.bg;
}

const grid = document.getElementById('projects-grid');
projects.forEach(p => {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.innerHTML = `
    <div class="project-thumb">
      <div class="project-thumb-inner" style="background:${getThumbBg(p)}" data-project-id="${p.id}">
        <i class="${p.icon}"></i>
      </div>
    </div>
    <div class="project-body">
      <div class="project-tags">${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>
      <div class="project-name">${p.name}</div>
      <div class="project-desc">${p.desc}</div>
    </div>
    <div class="project-footer">
      <span>${p.role}</span>
      <span class="project-arrow">→</span>
    </div>`;
  card.addEventListener('click', () => openModal(p));
  grid.appendChild(card);
});

/* Mise à jour des thumbs quand le thème change */
const themeBtns = document.querySelectorAll('.theme-btn');
themeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    setTimeout(() => {
      document.querySelectorAll('[data-project-id]').forEach(thumb => {
        const id = parseInt(thumb.dataset.projectId);
        const p  = projects.find(p => p.id === id);
        if (p) thumb.style.background = getThumbBg(p);
      });
    }, 350); // après la transition fade
  });
});


/* ══════════════════════════════════════
   SKIEUR WIPE — ouverture / fermeture projet
   ══════════════════════════════════════ */

const skierWipe  = document.getElementById('skier-wipe');
const skierSvg   = document.getElementById('skier-svg');
const projectPanel = document.getElementById('project-panel');
const panelContent = document.getElementById('panel-content');

/* Durées en ms */
const SKIER_DURATION = 1800;  // traversée (plus lent, on voit le skieur)
const WIPE_DELAY     = 750;   // moment où le rideau s'ouvre pendant la traversée

function skierReveal(onMidpoint) {
  /* 1 — Skieur visible, démarre hors écran à gauche */
  skierWipe.classList.add('running');
  skierSvg.style.transition = 'none';
  skierSvg.style.left = '-260px';

  /* 2 — Lance la traversée */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      skierSvg.style.transition = `left ${SKIER_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      skierSvg.style.left = 'calc(100% + 260px)';
    });
  });

  /* 3 — À mi-parcours : rideau, puis callback */
  skierWipe.classList.add('wipe-in');
  setTimeout(() => {
    onMidpoint();
  }, WIPE_DELAY);

  /* 4 — Rideau s'efface, skieur disparaît */
  setTimeout(() => {
    skierWipe.classList.remove('wipe-in');
    skierWipe.classList.add('wipe-out');
    setTimeout(() => {
      skierWipe.classList.remove('running', 'wipe-out');
    }, 500);
  }, WIPE_DELAY + 120);
}

function buildPanelContent(p) {
  panelContent.innerHTML = `
    <div class="panel-hero">
      <div class="panel-left">
        <div class="panel-icon-wrap"><i class="${p.icon}"></i></div>
        <div class="panel-title"><span>${p.name}</span></div>
        <div class="panel-meta">${p.role} &middot; ${p.duration}</div>
        <div class="panel-tags">${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>
        <p class="panel-desc">${p.details}</p>
      </div>
      <div class="panel-aside">
        <div class="panel-aside-item">
          <div class="panel-aside-label">Rôle</div>
          <div class="panel-aside-value">${p.role}</div>
        </div>
        <div class="panel-aside-item">
          <div class="panel-aside-label">Durée</div>
          <div class="panel-aside-value">${p.duration}</div>
        </div>
        <div class="panel-aside-item">
          <div class="panel-aside-label">Stack</div>
          <div class="panel-aside-value">${p.tags.join(' · ')}</div>
        </div>
      </div>
    </div>
    <div class="panel-body">
      <div>
        <div class="panel-section-title">Fonctionnalités</div>
        <ul class="panel-features">
          ${p.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
    </div>
    <div class="panel-links">
      ${p.links.map(l => `<a href="${l.url}" class="btn ${l.type === 'primary' ? 'btn-primary' : 'btn-ghost'}">${l.label}</a>`).join('')}
    </div>`;
}

function openModal(p) {
  skierReveal(() => {
    buildPanelContent(p);
    projectPanel.scrollTop = 0;
    projectPanel.classList.add('visible');
    document.body.style.overflow = 'hidden';
  });
}

function closeModal() {
  skierReveal(() => {
    projectPanel.classList.remove('visible');
    document.body.style.overflow = '';
  });
}

document.getElementById('panel-close').addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && projectPanel.classList.contains('visible')) closeModal(); });


/* ══════════════════════════════════════
   EMAILJS — Formulaire de contact
   ══════════════════════════════════════ */
const EMAILJS_PUBLIC_KEY  = 'jWxSERBCdNxD7BuYF';
const EMAILJS_SERVICE_ID  = 'service_s3c4nip';
const EMAILJS_TEMPLATE_ID = 'template_9l25okb';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn      = document.getElementById('form-submit');
    const btnText  = btn.querySelector('.btn-text');
    const btnLoad  = btn.querySelector('.btn-loading');
    const feedback = document.getElementById('form-feedback');
    const fieldIds = ['cf-prenom', 'cf-nom', 'cf-email', 'cf-sujet', 'cf-message'];

    let valid = true;
    fieldIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) { el.classList.add('error'); valid = false; }
      else el.classList.remove('error');
    });

    if (!valid) {
      feedback.textContent = 'Merci de remplir tous les champs.';
      feedback.className = 'form-feedback error';
      return;
    }

    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoad.style.display = 'inline-flex';
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    const templateParams = {
      prenom:  document.getElementById('cf-prenom').value.trim(),
      nom:     document.getElementById('cf-nom').value.trim(),
      email:   document.getElementById('cf-email').value.trim(),
      sujet:   document.getElementById('cf-sujet').value.trim(),
      message: document.getElementById('cf-message').value.trim(),
      time:    new Date().toLocaleString('fr-FR')
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      feedback.textContent = '✓ Message envoyé ! Je vous réponds très vite.';
      feedback.className = 'form-feedback success';
      contactForm.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      feedback.textContent = "✕ Erreur lors de l'envoi. Réessayez ou écrivez directement par e-mail.";
      feedback.className = 'form-feedback error';
    } finally {
      btn.disabled = false;
      btnText.style.display = 'inline-flex';
      btnLoad.style.display = 'none';
    }
  });
}


/* ══════════════════════════════════════
   INIT
   ══════════════════════════════════════ */
ThemeManager.init();
