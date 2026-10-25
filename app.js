(() => {
  'use strict';

  const header = document.getElementById('siteHeader');
  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots = [...document.querySelectorAll('.hero-dot')];
  const slideNumber = document.getElementById('activeSlideNumber');
  const hero = document.querySelector('.hero');
  const scrollLabel = document.getElementById('heroScrollLabel');
  const prevArrow = document.getElementById('heroPrev');
  const nextArrow = document.getElementById('heroNext');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Independent, photographic ingredient sprites: every fruit travels on its
  // own path, arrives at its bowl/glass and then keeps drifting gently.
  const piece = (name, x, y, size, fromX, fromY, rotation, delay) =>
    ({ name, x, y, size, fromX, fromY, rotation, delay });
  const flavorScenes = [
    {
      pour: ['48%', '3%', 'min(32vw,430px)', 'none'],
      pieces: [
        piece('banana', '23%', '24%', 108, -360, -290, -140, .42),
        piece('strawberry', '64%', '15%', 100, 420, -340, 110, .68),
        piece('blueberry', '72%', '43%', 73, 350, -90, -95, .83),
        piece('granola', '31%', '68%', 87, -420, 310, 140, 1.04),
        piece('strawberry', '64%', '71%', 78, 360, 300, 190, 1.18),
        piece('banana', '46%', '11%', 72, -60, -350, -220, 1.32)
      ]
    },
    {
      pour: ['47%', '0%', 'min(29vw,380px)', 'hue-rotate(14deg) saturate(1.3) brightness(1.3)'],
      pieces: [
        piece('strawberry', '27%', '24%', 112, -440, -230, -135, .46),
        piece('blueberry', '69%', '20%', 77, 370, -320, 120, .69),
        piece('strawberry', '66%', '67%', 90, 380, 300, 170, .97),
        piece('banana', '31%', '72%', 80, -300, 320, -210, 1.12),
        piece('blueberry', '45%', '13%', 65, -70, -350, 90, 1.28)
      ]
    },
    {
      pour: ['52%', '0%', 'min(30vw,395px)', 'hue-rotate(70deg) saturate(2) brightness(1.4)'],
      pieces: [
        piece('orange', '26%', '20%', 114, -470, -310, -180, .44),
        piece('orange', '69%', '26%', 97, 410, -260, 165, .71),
        piece('pineapple', '34%', '72%', 81, -300, 330, -120, .94),
        piece('mint', '67%', '67%', 91, 350, 320, 160, 1.13),
        piece('orange', '46%', '10%', 66, -35, -350, 120, 1.31)
      ]
    },
    {
      pour: ['50%', '0%', 'min(30vw,395px)', 'hue-rotate(158deg) saturate(1.5) brightness(1.3)'],
      pieces: [
        piece('kiwi', '28%', '22%', 109, -460, -300, -170, .41),
        piece('mint', '67%', '19%', 108, 360, -350, 120, .65),
        piece('kiwi', '69%', '70%', 88, 430, 350, 150, .88),
        piece('pineapple', '31%', '70%', 70, -400, 350, -120, 1.08),
        piece('mint', '44%', '11%', 65, -90, -350, -100, 1.30)
      ]
    },
    {
      pour: ['50%', '0%', 'min(31vw,400px)', 'hue-rotate(65deg) saturate(2) brightness(1.5)'],
      pieces: [
        piece('pineapple', '27%', '24%', 94, -400, -300, -155, .42),
        piece('orange', '69%', '24%', 108, 430, -340, 175, .63),
        piece('strawberry', '30%', '68%', 105, -350, 320, -145, .89),
        piece('kiwi', '69%', '70%', 88, 380, 330, 145, 1.05),
        piece('blueberry', '48%', '12%', 66, -60, -370, 160, 1.28)
      ]
    },
    {
      pour: ['49%', '0%', 'min(32vw,430px)', 'grayscale(1) brightness(2.8) contrast(.6)'],
      pieces: [
        piece('banana', '26%', '24%', 108, -440, -320, -170, .39),
        piece('strawberry', '69%', '20%', 100, 390, -340, 140, .64),
        piece('granola', '30%', '66%', 98, -370, 350, -140, .85),
        piece('blueberry', '70%', '65%', 73, 400, 350, 160, 1.02),
        piece('kiwi', '45%', '11%', 88, -90, -380, -150, 1.18),
        piece('granola', '54%', '75%', 69, 90, 390, 180, 1.37)
      ]
    }
  ];

  flavorScenes.forEach((scene, index) => {
    const slide = slides[index];
    const vesselAssets = ['empty-acai.webp', 'empty-smoothie.webp', 'empty-juice.webp', 'empty-juice.webp', null, 'empty-muesli.webp'];
    if (index !== 0 && vesselAssets[index]) {
      slide.classList.add('is-cinematic');
      slide.dataset.recipe = ['acai', 'smoothie', 'orange', 'green', 'fruit', 'muesli'][index];
      const vessel = document.createElement('img');
      vessel.className = 'hero-vessel';
      vessel.src = `assets/${vesselAssets[index]}`;
      vessel.alt = '';
      vessel.setAttribute('aria-hidden', 'true');
      slide.querySelector('.hero-product').after(vessel);
    }
    const pour = document.createElement('div');
    pour.className = 'liquid-pour';
    pour.setAttribute('aria-hidden', 'true');
    pour.style.setProperty('--pour-x', scene.pour[0]);
    pour.style.setProperty('--pour-y', scene.pour[1]);
    pour.style.setProperty('--pour-width', scene.pour[2]);
    pour.style.setProperty('--pour-filter', scene.pour[3]);
    slide.appendChild(pour);

    const field = document.createElement('div');
    field.className = 'ingredient-field';
    field.setAttribute('aria-hidden', 'true');
    scene.pieces.forEach((fruit, i) => {
      const track = document.createElement('span');
      track.className = 'ingredient-track';
      track.dataset.ingredient = fruit.name;
      track.style.setProperty('--x', fruit.x);
      track.style.setProperty('--y', fruit.y);
      track.style.setProperty('--s', `${fruit.size}px`);
      track.style.setProperty('--from-x', `${fruit.fromX}px`);
      track.style.setProperty('--from-y', `${fruit.fromY}px`);
      track.style.setProperty('--from-rotation', `${fruit.rotation}deg`);
      track.style.setProperty('--to-center-x', `${50 - Number.parseFloat(fruit.x)}vw`);
      track.style.setProperty('--to-center-y', `${([46, 40, 40, 40, 46, 46][index]) - Number.parseFloat(fruit.y)}vh`);
      track.style.setProperty('--entry-delay', `${fruit.delay + (slide.classList.contains('is-cinematic') ? 1.55 : 0)}s`);
      track.style.setProperty('--float-delay', `${-(i * 1.3 + index * .7)}s`);
      track.style.setProperty('--float-duration', `${4.8 + (i % 3) * .9}s`);
      const visual = document.createElement('span');
      visual.className = `ingredient-sprite ingredient-${fruit.name}`;
      track.appendChild(visual);
      field.appendChild(track);
    });
    slide.appendChild(field);
  });

  // Mouse movement gives the floating ingredients a subtle depth/parallax cue.
  if (!prefersReducedMotion) {
    hero.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      const ingredientField = slides[activeIndex].querySelector('.ingredient-field');
      if (ingredientField) ingredientField.style.transform =
        `translate3d(${(x * 27).toFixed(1)}px,${(y * 20).toFixed(1)}px,0)`;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      slides.forEach(slide => { const field = slide.querySelector('.ingredient-field'); if (field) field.style.transform = ''; });
    });
  }

  let activeIndex = 0;
  let transitionCleanup = 0;
  let lastScrollStep = 0;
  let wheelDistance = 0;
  let wheelDirection = 0;
  let touchStart = null;
  const scrollStepCooldown = prefersReducedMotion ? 280 : 1080;

  function showSlide(nextIndex) {
    const index = Math.max(0, Math.min(slides.length - 1, nextIndex));
    if (index === activeIndex) return false;
    clearTimeout(transitionCleanup);
    const previousIndex = activeIndex;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('is-leaving', i === previousIndex && !prefersReducedMotion);
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
    });
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
    activeIndex = index;
    slideNumber.textContent = String(index + 1).padStart(2, '0');
    prevArrow.disabled = index === 0;
    nextArrow.disabled = index === slides.length - 1;
    scrollLabel.textContent = index === slides.length - 1 ? 'המשיכו לגלול ולגלות עוד' : 'גללו לגלות את הטעם הבא';
    document.body.classList.toggle('light-hero', index === 4 || index === 6);
    const themeColor = slides[index].style.getPropertyValue('--slide-bg');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);
    transitionCleanup = window.setTimeout(() => {
      slides.forEach(slide => slide.classList.remove('is-leaving'));
    }, prefersReducedMotion ? 0 : 1200);
    return true;
  }

  function canStep(direction) {
    return direction > 0 ? activeIndex < slides.length - 1 : activeIndex > 0;
  }

  function heroIsAtPageTop() {
    return window.scrollY <= 3 && Math.abs(hero.getBoundingClientRect().top) <= 3;
  }

  function stepFlavor(direction) {
    if (!canStep(direction)) return;
    if (showSlide(activeIndex + direction)) lastScrollStep = performance.now();
  }

  // Each mouse-wheel notch or trackpad gesture reveals one new full-screen flavor.
  // At either end, let the browser resume its normal page scroll.
  window.addEventListener('wheel', (event) => {
    if (event.ctrlKey || document.body.classList.contains('menu-open') || !heroIsAtPageTop()) return;
    const direction = Math.sign(event.deltaY);
    if (!direction) return;
    const now = performance.now();
    const coolingDown = now - lastScrollStep < scrollStepCooldown;

    if (!canStep(direction)) {
      if (coolingDown) event.preventDefault();
      return;
    }

    event.preventDefault();
    if (coolingDown) return;
    if (direction !== wheelDirection) { wheelDirection = direction; wheelDistance = 0; }
    wheelDistance += Math.abs(event.deltaY);
    if (wheelDistance >= 22) {
      wheelDistance = 0;
      stepFlavor(direction);
    }
  }, { passive: false });

  // Phone/tablet swipes follow the same flavor journey.
  hero.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) return;
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  hero.addEventListener('touchmove', event => {
    if (!touchStart || !heroIsAtPageTop() || event.touches.length !== 1) return;
    const dx = event.touches[0].clientX - touchStart.x;
    const dy = event.touches[0].clientY - touchStart.y;
    if (Math.abs(dy) > 9 && Math.abs(dy) > Math.abs(dx) && canStep(-Math.sign(dy))) {
      event.preventDefault();
    }
  }, { passive: false });
  hero.addEventListener('touchend', event => {
    if (!touchStart || !heroIsAtPageTop()) { touchStart = null; return; }
    const deltaY = event.changedTouches[0].clientY - touchStart.y;
    const deltaX = event.changedTouches[0].clientX - touchStart.x;
    touchStart = null;
    if (Math.abs(deltaY) < 48 || Math.abs(deltaY) < Math.abs(deltaX)) return;
    if (performance.now() - lastScrollStep < scrollStepCooldown) return;
    stepFlavor(-Math.sign(deltaY));
  }, { passive: true });
  hero.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });

  prevArrow.disabled = true;
  prevArrow.addEventListener('click', () => stepFlavor(-1));
  nextArrow.addEventListener('click', () => stepFlavor(1));
  dots.forEach((dot) => dot.addEventListener('click', () => showSlide(Number(dot.dataset.goto))));
  document.getElementById('replayAnimation').addEventListener('click', () => {
    const slide = slides[activeIndex];
    slide.classList.remove('is-active');
    void slide.offsetWidth; // Restart every independent ingredient's entrance timeline.
    slide.classList.add('is-active');
  });
  document.addEventListener('keydown', (event) => {
    if (!heroIsAtPageTop() || document.body.classList.contains('menu-open')) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
    let direction = 0;
    if (event.key === 'ArrowDown' || event.key === 'PageDown') direction = 1;
    if (event.key === 'ArrowUp' || event.key === 'PageUp') direction = -1;
    if (!direction && hero.contains(document.activeElement)) {
      if (event.key === 'ArrowLeft') direction = 1;
      if (event.key === 'ArrowRight') direction = -1;
    }
    if (direction && canStep(direction)) {
      event.preventDefault();
      stepFlavor(direction);
    }
  });

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
