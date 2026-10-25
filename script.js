const toggle = document.getElementById('menuToggle');
const menu = document.getElementById('mobileNav');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    menu.hidden = !open;
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.hidden = true; toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open navigation menu');
  }));
}
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());


// Minimal animation layer: native browser APIs, no third-party libraries.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const progress = document.getElementById('scrollProgress');
  let scrollPending = false;
  function updateScrollUI() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const position = Math.min(1, Math.max(0, window.scrollY / max));
    if (progress) progress.style.transform = `scaleX(${position})`;
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
    scrollPending = false;
  }
  updateScrollUI();
  window.addEventListener('scroll', () => {
    if (!scrollPending) {
      scrollPending = true;
      window.requestAnimationFrame(updateScrollUI);
    }
  }, { passive: true });
  window.addEventListener('resize', updateScrollUI, { passive: true });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const groups = [
      '.section-heading', '.cap-card', '.role', '.more-roles', '.project-card',
      '.collab-inner > div', '.toolkit-group', '.education', '.contact-inner',
      '.proof-inner', '.section-link'
    ];
    const elements = document.querySelectorAll(groups.join(','));
    elements.forEach((element, index) => {
      element.classList.add('reveal-ready');
      const sibling = element.previousElementSibling;
      if (sibling && element.parentElement === sibling.parentElement && element.matches('.cap-card,.project-card,.toolkit-group')) {
        const siblings = Array.from(element.parentElement.children);
        element.style.setProperty('--reveal-delay', `${(siblings.indexOf(element) % 3) * 90}ms`);
      }
    });
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
    elements.forEach(element => observer.observe(element));
  }

  if ('IntersectionObserver' in window) {
    const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
    const sections = document.querySelectorAll('#expertise, #experience, #projects, #toolkit');
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('is-active', isCurrent);
            if (isCurrent) link.setAttribute('aria-current','location');
            else link.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin:'-28% 0px -60% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  if (!reduceMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const hero = document.querySelector('.hero');
    const visual = document.querySelector('.hero-visual');
    if (hero && visual) {
      let frame = null;
      hero.addEventListener('pointermove', e => {
        if (frame !== null) return;
        const px = e.clientX;
        const py = e.clientY;
        frame = window.requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          const x = ((px-rect.left)/rect.width-.5)*16;
          const y = ((py-rect.top)/rect.height-.5)*12;
          visual.style.setProperty('--mx', `${x.toFixed(1)}px`);
          visual.style.setProperty('--my', `${y.toFixed(1)}px`);
          frame = null;
        });
      }, { passive: true });
      hero.addEventListener('pointerleave', () => {
        visual.style.setProperty('--mx','0px');
        visual.style.setProperty('--my','0px');
      });
    }
    document.querySelectorAll('.cap-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const box = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', `${e.clientX-box.left}px`);
        card.style.setProperty('--pointer-y', `${e.clientY-box.top}px`);
      }, { passive: true });
    });
  }
})();
