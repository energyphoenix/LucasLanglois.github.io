/* ═══════════════════════════════════════════
   main.js — Logique principale + switcher de thème
   ═══════════════════════════════════════════ */

/* ══════════════════════════════════════
   THEME SWITCHER
   ══════════════════════════════════════ */
const ThemeManager = (() => {
  const root      = document.documentElement;
  const themeLink = document.getElementById('theme-css');
  const btnSunset = document.getElementById('btn-sunset');
  const btnNight  = document.getElementById('btn-night');

  let current = localStorage.getItem('ll-theme') || 'sunset';

  function applyTheme(name, animate = false) {
    if (name === current && root.dataset.theme === name) return;

    /* Transition douce */
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

    /* Swap CSS */
    themeLink.href = `css/theme-${name}.css`;

    /* Swap boutons actifs */
    btnSunset.classList.toggle('active', name === 'sunset');
    btnNight.classList.toggle('active',  name === 'night');

    /* Swap animations sky */
    if (name === 'sunset') {
      NightSky.stop();
      SunsetSky.start();
    } else {
      SunsetSky.stop();
      NightSky.start();
    }
  }

  function init() {
    /* Démarrage sans animation */
    root.dataset.theme = current;
    themeLink.href = `css/theme-${current}.css`;
    btnSunset.classList.toggle('active', current === 'sunset');
    btnNight.classList.toggle('active',  current === 'night');

    if (current === 'sunset') SunsetSky.start();
    else                      NightSky.start();

    /* Listeners boutons */
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
    id: 0,
    icon: 'fa-solid fa-people-arrows',
    name: "Entour'âge",
    bg: 'linear-gradient(135deg,#2a0838,#8b1a4a)',
    bgNight: 'linear-gradient(135deg,#07122b,#0d3060)',
    tags: ['Python', 'Flask', 'HTML', 'CSS'],
    desc: 'Application Web complète avec backend Python/Flask et frontend HTML/CSS.',
    details: "Dans le cadre de ma formation au Département Informatique de l'IUT2 (UGA), j'ai participé au développement d'une application Web nommée Entour'âge. J'ai travaillé sur la conception de l'architecture serveur en utilisant le framework Python Flask, ainsi que sur l'intégration de l'interface utilisateur en HTML et CSS pour offrir une navigation fluide.",
    features: ['Développement backend Python (Flask)', 'Intégration frontend (HTML/CSS)', 'Architecture MVC', 'Gestion du routage et des requêtes Web'],
    role: 'Développeur Full-stack',
    duration: '2025 – 2026',
    links: [{ label: 'GitHub', url: '#', type: 'primary' }]
  },
  {
    id: 1,
    icon: 'fa-solid fa-database',
    name: 'Projet Marianne',
    bg: 'linear-gradient(135deg,#1a0a3a,#5b2d8c)',
    bgNight: 'linear-gradient(135deg,#071235,#1a0a4a)',
    tags: ['Java', 'SQL', 'GitHub'],
    desc: 'Application de gestion en Java connectée à une base de données SQL.',
    details: "Création d'une application de gestion complète. Ma mission principale a consisté à concevoir et mettre en place la liaison robuste entre l'interface graphique et la base de données relationnelle. J'ai également joué un rôle central dans l'organisation du travail d'équipe et le suivi global du projet grâce aux outils de versioning.",
    features: ['Développement logique en Java', 'Liaison Interface / Base de données SQL', 'Gestion de projet en équipe', 'Versioning et suivi sur GitHub'],
    role: 'Développeur Java',
    duration: 'Févr. – Juin 2025',
    links: [{ label: 'GitHub', url: '#', type: 'primary' }]
  },
  {
    id: 2,
    icon: 'fa-solid fa-pen-nib',
    name: 'Refonte Sopra Steria',
    bg: 'linear-gradient(135deg,#1a0830,#a02060)',
    bgNight: 'linear-gradient(135deg,#0a1a20,#0a3040)',
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
  return document.documentElement.dataset.theme === 'night' ? p.bgNight : p.bg;
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


/* ── Modal ── */
function openModal(p) {
  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <div class="modal-header">
      <div class="modal-icon"><i class="${p.icon}"></i></div>
      <div class="modal-title">${p.name}</div>
      <div class="modal-meta">${p.role} · ${p.duration}</div>
      <div class="modal-tags">${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>
    </div>
    <div class="modal-body">
      <div class="modal-section"><h4>Description</h4><p>${p.details}</p></div>
      <div class="modal-section"><h4>Fonctionnalités</h4><ul>${p.features.map(f => `<li>${f}</li>`).join('')}</ul></div>
    </div>
    <div class="modal-links">${p.links.map(l => `<a href="${l.url}" class="modal-link ${l.type}">${l.label}</a>`).join('')}</div>`;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


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