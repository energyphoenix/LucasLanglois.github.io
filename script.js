const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');
let W, H, flakes = [];

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function makeFlake(){
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2.5 + .5,
    speed: Math.random() * .8 + .3,
    drift: Math.random() * .5 - .25,
    alpha: Math.random() * .6 + .2
  };
}

function initSnow(){
  resize();
  flakes = [];
  for(let i=0; i<180; i++){
    flakes.push(makeFlake());
  }
}

function animSnow(){
  ctx.clearRect(0,0,W,H);
  flakes.forEach(f=>{
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(200,222,255,${f.alpha})`;
    ctx.fill();
    f.y += f.speed;
    f.x += f.drift;
    if(f.y > H){
      f.y = 0;
      f.x = Math.random() * W;
    }
    if(f.x > W) f.x = 0;
    if(f.x < 0) f.x = W;
  });
  requestAnimationFrame(animSnow);
}

initSnow();
animSnow();
window.addEventListener('resize', initSnow);

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, {threshold:.15});

document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

const skills = [
  {icon:'fa-brands fa-python', name:'Python'},
  {icon:'fa-solid fa-cubes', name:'Django'},
  {icon:'fa-solid fa-flask', name:'Flask'},
  {icon:'fa-brands fa-symfony', name:'Symfony'},
  {icon:'fa-brands fa-android', name:'Android'},
  {icon:'fa-solid fa-code', name:'C++'},
  {icon:'fa-brands fa-java', name:'Java'},
  {icon:'fa-brands fa-html5', name:'HTML/CSS'},
  {icon:'fa-brands fa-js', name:'JavaScript'},
  {icon:'fa-solid fa-database', name:'SQL'},
  {icon:'fa-brands fa-linux', name:'Linux'},
  {icon:'fa-brands fa-git-alt', name:'Git'},
  {icon:'fa-solid fa-network-wired', name:'Réseaux'}
];

const projects = [
  {
    id: 0, 
    icon: 'fa-solid fa-people-arrows', 
    name: 'Entour’âge',
    color: 'linear-gradient(135deg,#07122b,#0d3060)',
    tags: ['Python', 'Flask', 'HTML', 'CSS'],
    desc: 'Application Web complète avec backend Python/Flask et frontend HTML/CSS.',
    details: 'Dans le cadre de ma formation au Département Informatique de l\'IUT2 (UGA), j\'ai participé au développement d\'une application Web nommée Entour’âge. J\'ai travaillé sur la conception de l\'architecture serveur en utilisant le framework Python Flask, ainsi que sur l\'intégration de l\'interface utilisateur en HTML et CSS pour offrir une navigation fluide.',
    features: ['Développement backend Python (Flask)', 'Intégration frontend (HTML/CSS)', 'Architecture MVC', 'Gestion du routage et des requêtes Web'],
    role: 'Développeur Full-stack',
    duration: '2025 – 2026',
    links: [{label: 'GitHub', url: '#', type: 'primary'}]
  },
  {
    id: 1, 
    icon: 'fa-solid fa-database', 
    name: 'Projet Marianne',
    color: 'linear-gradient(135deg,#071235,#1a0a4a)',
    tags: ['Java', 'SQL', 'GitHub'],
    desc: 'Application de gestion en Java connectée à une base de données SQL.',
    details: 'Création d\'une application de gestion complète. Ma mission principale a consisté à concevoir et mettre en place la liaison robuste entre l\'interface graphique et la base de données relationnelle. J\'ai également joué un rôle central dans l\'organisation du travail d\'équipe et le suivi global du projet grâce aux outils de versioning.',
    features: ['Développement logique en Java', 'Liaison Interface / Base de données SQL', 'Gestion de projet en équipe', 'Versioning et suivi sur GitHub'],
    role: 'Développeur Java',
    duration: 'Févr. – Juin 2025',
    links: [{label: 'GitHub', url: '#', type: 'primary'}]
  },
  {
    id: 2, 
    icon: 'fa-solid fa-pen-nib', 
    name: 'Refonte Sopra Steria',
    color: 'linear-gradient(135deg,#0a1a20,#0a3040)',
    tags: ['HTML', 'CSS', 'UI/UX'],
    desc: 'Refonte front-end d\'un site web pour faciliter la recherche de stages.',
    details: 'Projet centré sur l\'amélioration de l\'expérience utilisateur. J\'ai réalisé la refonte complète du front-end d\'un site web lié à Sopra Steria. L\'objectif était de moderniser l\'ergonomie visuelle et structurelle pour rendre la recherche et la consultation d\'offres de stages beaucoup plus intuitives et accessibles.',
    features: ['Intégration HTML/CSS', 'Refonte ergonomique et UI/UX', 'Design Responsive', 'Optimisation du parcours utilisateur'],
    role: 'Développeur Front-end',
    duration: 'Novembre 2024',
    links: [{label: 'Voir la maquette', url: '#', type: 'ghost'}]
  }
];


const skillsTrack = document.getElementById('skills-track');

function renderSkills(){
  const allSkills = [...skills, ...skills];
  allSkills.forEach(s => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `<div class="skill-icon"><i class="${s.icon}"></i></div><div class="skill-name">${s.name}</div>`;
    skillsTrack.appendChild(card);
  });
}

renderSkills();

const grid = document.getElementById('projects-grid');
projects.forEach(p => {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.innerHTML = `
    <div class="project-thumb">
      <div class="project-thumb-inner" style="background:${p.color}">
        <i class="${p.icon}" style="font-size:3.5rem; color:var(--snow);"></i>
      </div>
    </div>
    <div class="project-body">
      <div class="project-tags">${p.tags.map(t=>`<span class="project-tag">${t}</span>`).join('')}</div>
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

function openModal(p){
  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <div class="modal-header">
      <div class="modal-icon"><i class="${p.icon}"></i></div>
      <div class="modal-title">${p.name}</div>
      <div style="color:rgba(200,222,255,.5);font-size:.8rem;font-family:'Space Mono',monospace">${p.role} · ${p.duration}</div>
      <div class="modal-tags">${p.tags.map(t=>`<span class="project-tag">${t}</span>`).join('')}</div>
    </div>
    <div class="modal-body">
      <div class="modal-section">
        <h4>Description</h4>
        <p>${p.details}</p>
      </div>
      <div class="modal-section">
        <h4>Fonctionnalités</h4>
        <ul>${p.features.map(f=>`<li>${f}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="modal-links">${p.links.map(l=>`<a href="${l.url}" class="modal-link ${l.type}">${l.label}</a>`).join('')}</div>`;
  
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
  if(e.target === e.currentTarget) closeModal();
});
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeModal();
});


window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.background = window.scrollY > 60 ? 'rgba(7,18,43,0.95)' : 'rgba(7,18,43,0.7)';
});

// =============================================
// EMAILJS — Configuration
// Remplace les valeurs ci-dessous par les tiennes
// sur https://dashboard.emailjs.com
// =============================================
const EMAILJS_PUBLIC_KEY  = 'jWxSERBCdNxD7BuYF';   // Account > API Keys
const EMAILJS_SERVICE_ID  = 'service_s3c4nip';   // Email Services
const EMAILJS_TEMPLATE_ID = 'template_9l25okb';  // Email Templates

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

const contactForm = document.getElementById('contact-form');
if(contactForm){
  contactForm.addEventListener('submit', async function(e){
    e.preventDefault();

    const btn      = document.getElementById('form-submit');
    const btnText  = btn.querySelector('.btn-text');
    const btnLoad  = btn.querySelector('.btn-loading');
    const feedback = document.getElementById('form-feedback');

    // Validation rapide
    const fields = ['cf-prenom','cf-nom','cf-email','cf-sujet','cf-message'];
    let valid = true;
    fields.forEach(id => {
      const el = document.getElementById(id);
      if(!el.value.trim()){ el.classList.add('input-error'); valid = false; }
      else el.classList.remove('input-error');
    });
    if(!valid){
      feedback.textContent = 'Merci de remplir tous les champs.';
      feedback.className = 'form-feedback error';
      return;
    }

    // État chargement
    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoad.style.display = 'inline-flex';
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    const templateParams = {
      prenom: document.getElementById('cf-prenom').value.trim(),
      nom: document.getElementById('cf-nom').value.trim(),
      email: document.getElementById('cf-email').value.trim(),
      sujet: document.getElementById('cf-sujet').value.trim(),
      message: document.getElementById('cf-message').value.trim(),
      time: new Date().toLocaleString('fr-FR')
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      feedback.textContent = '✓ Message envoyé ! Je vous réponds très vite.';
      feedback.className = 'form-feedback success';
      contactForm.reset();
    } catch(err) {
      console.error('EmailJS error:', err);
      feedback.textContent = '✕ Erreur lors de l\'envoi. Réessayez ou écrivez directement par e-mail.';
      feedback.className = 'form-feedback error';
    } finally {
      btn.disabled = false;
      btnText.style.display = 'inline-flex';
      btnLoad.style.display = 'none';
    }
  });
}
