document.addEventListener('DOMContentLoaded', function() {

  // Menu Hamburger
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenu.classList.toggle('is-active'); // Pour l'animation du bouton lui-même
    });

    // Fermer le menu si on clique sur un lien (pour les one-page)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('is-active');
            }
        });
    });
  }


  // Active Nav Link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links .nav-item');

  function changeNavActiveState() {
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href').substring(item.getAttribute('href').indexOf('#') + 1) === currentSectionId) {
        item.classList.add('active');
      }
    });
    // Cas spécial pour la page d'accueil (index.html sans ancre)
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        if (!currentSectionId && window.pageYOffset < window.innerHeight / 2) { // Si en haut de la page
            navItems.forEach(item => item.classList.remove('active'));
            const homeLink = document.querySelector('.nav-links a[href="index.html"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }
  }
  // S'assurer que le lien "Accueil" est actif par défaut sur la page d'accueil
  if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
      const homeLink = document.querySelector('.nav-links a[href="index.html"]');
      if (homeLink && window.pageYOffset < 100) { // Si on est tout en haut
          navItems.forEach(item => item.classList.remove('active'));
          homeLink.classList.add('active');
      }
  }


  window.addEventListener('scroll', changeNavActiveState);
  changeNavActiveState(); // Appel initial pour l'état au chargement


  // Animation à l'apparition (Intersection Observer)
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionnel: arrêter d'observer une fois l'animation jouée
        // observer.unobserve(entry.target);
      } else {
        // Optionnel: retirer la classe si l'élément sort de la vue (pour ré-animer au scroll up)
        // entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.1 // Déclenche quand 10% de l'élément est visible
  });

  animatedElements.forEach(el => observer.observe(el));


  // Copyright année actuelle
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});