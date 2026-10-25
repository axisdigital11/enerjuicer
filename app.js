(() => {
  'use strict';

  const header = document.getElementById('siteHeader');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 65);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  function closeMenu() {
    mobileNav.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'פתיחת תפריט');
    document.body.classList.remove('menu-open');
  }
  menuToggle.addEventListener('click', () => {
    const willOpen = mobileNav.hidden;
    mobileNav.hidden = !willOpen;
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    menuToggle.setAttribute('aria-label', willOpen ? 'סגירת תפריט' : 'פתיחת תפריט');
    document.body.classList.toggle('menu-open', willOpen);
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const revealNodes = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    revealNodes.forEach(el => revealObserver.observe(el));
  } else {
    revealNodes.forEach(el => el.classList.add('visible'));
  }

  const filterButtons = [...document.querySelectorAll('.filter-button')];
  const menuCards = [...document.querySelectorAll('.menu-card')];
  const menuGrid = document.getElementById('menuGrid');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      menuGrid.classList.toggle('is-filtered', filter !== 'all');
      filterButtons.forEach(other => {
        const selected = other === button;
        other.classList.toggle('active', selected);
        other.setAttribute('aria-pressed', String(selected));
      });
      menuCards.forEach(card => {
        const visible = filter === 'all' || card.dataset.category === filter;
        card.hidden = !visible;
      });
    });
  });

  const eventForm = document.getElementById('eventForm');
  const formResult = document.getElementById('formResult');
  const requestText = document.getElementById('requestText');
  const copyRequestButton = document.getElementById('copyRequest');
  eventForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!eventForm.reportValidity()) return;
    const data = new FormData(eventForm);
    const name = String(data.get('name') || '').trim();
    const company = String(data.get('company') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const guests = String(data.get('guests') || '').trim();
    const occasion = String(data.get('occasion') || '').trim();
    const notes = String(data.get('notes') || '').trim();
    requestText.value = [
      'היי אנרג\'וסר! נשמח לקבל הצעה לאירוע חברה 🌿',
      '',
      'שם: ' + name,
      'חברה: ' + company,
      'טלפון לחזרה: ' + phone,
      'כמות משתתפים: ' + guests,
      'סוג האירוע: ' + occasion,
      ...(notes ? ['פרטים נוספים: ' + notes] : []),
      '',
      'נשמח לשמוע מה אפשר להכין לנו 😊'
    ].join('\n');
    formResult.hidden = false;
    formResult.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
  });
  copyRequestButton.addEventListener('click', async () => {
    const originalText = copyRequestButton.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(requestText.value);
      } else {
        requestText.focus();
        requestText.select();
        document.execCommand('copy');
      }
      copyRequestButton.textContent = 'הועתק! ✓';
    } catch (error) {
      requestText.focus();
      requestText.select();
      copyRequestButton.textContent = 'סמנו והעתיקו את הטקסט';
    }
    window.setTimeout(() => { copyRequestButton.textContent = originalText; }, 2600);
  });
})();
