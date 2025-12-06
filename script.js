// Gate open transition
const enterBtn = document.getElementById('enterBtn');
const intro = document.getElementById('intro');
const site = document.getElementById('site');
const left = document.querySelector('.left');
const right = document.querySelector('.right');

function showSite(skipAnimation = false) {
  // show the main site and hide the intro; if skipAnimation, do it immediately
  try {
    if (skipAnimation) {
      left.style.transform = 'translateX(-100%)';
      right.style.transform = 'translateX(100%)';
      intro.classList.add('hidden');
      site.classList.remove('hidden');
      return;
    }
    
    // Fade out content first
    const introContent = document.querySelector('.intro-content');
    const introImage = document.querySelector('.intro-portrait');
    if (introContent) introContent.style.opacity = '0';
    if (introImage) introImage.style.opacity = '0';
    
    // Wait a bit, then slide split panels
    setTimeout(() => {
      left.style.transform = 'translateX(-100%)';
      right.style.transform = 'translateX(100%)';
    }, 300);
    
    // After split animation, show main site
    setTimeout(() => {
      intro.classList.add('hidden');
      site.classList.remove('hidden');
      site.style.opacity = '0';
      requestAnimationFrame(() => {
        site.style.transition = 'opacity 0.5s ease';
        site.style.opacity = '1';
      });
    }, 1300);
  } catch (e) {
    // if elements missing, fall back to showing site
    if (intro) intro.classList.add('hidden');
    if (site) site.classList.remove('hidden');
  }
}

if (enterBtn) {
  enterBtn.addEventListener('click', () => {
    // mark that user entered the site so returning from project pages skips the intro
    sessionStorage.setItem('entered', 'true');
    showSite(false);
  });
}

// If the user already entered previously (sessionStorage), skip the intro on load
if (sessionStorage.getItem('entered') === 'true') {
  // run after a microtask so DOM is ready
  setTimeout(() => showSite(true), 10);
}

// Scroll reveal
window.addEventListener('scroll', () => {
  document.querySelectorAll('.reveal').forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) el.classList.add('active');
  });
});

// Theme toggle
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
  themeBtn.addEventListener('click', () => document.body.classList.toggle('dark'));
}

// Mobile menu toggle
const menuBtn = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuBtn.classList.toggle('active');
    menuBtn.textContent = nav.classList.contains('active') ? '✕' : '☰';
    // Prevent body scroll when menu is open
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close menu when clicking a link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      menuBtn.classList.remove('active');
      menuBtn.textContent = '☰';
      document.body.style.overflow = '';
      
      // Smooth scroll to section
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuBtn.contains(e.target) && nav.classList.contains('active')) {
      nav.classList.remove('active');
      menuBtn.classList.remove('active');
      menuBtn.textContent = '☰';
      document.body.style.overflow = '';
    }
  });
}

// Footer year
const yearEl = document.getElementById('yearFoot');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Smooth page fade transitions
document.querySelectorAll('.page-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.getAttribute('href');
    document.body.classList.add('fade-out');
    setTimeout(() => (window.location.href = href), 400);
  });
});

// Back-link behavior on project detail pages: set entered flag so returning goes straight into main page
document.querySelectorAll('.back-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.getAttribute('href');
    // mark entered, then navigate with fade
    sessionStorage.setItem('entered', 'true');
    document.body.classList.add('fade-out');
    setTimeout(() => (window.location.href = href), 300);
  });
});

window.addEventListener('pageshow', () => {
  document.body.classList.remove('fade-out');
});
