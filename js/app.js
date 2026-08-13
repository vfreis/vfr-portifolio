(() => {
  const body = document.body;
  const viewButtons = document.querySelectorAll('.view-btn');
  const stackTabs = document.querySelectorAll('.stack-tab');
  const stackPanels = document.querySelectorAll('.stack-panel');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const view = button.dataset.view;
      body.dataset.view = view;
      viewButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
    });
  });

  stackTabs.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.stack;
      stackTabs.forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      stackPanels.forEach((panel) => {
        const active = panel.dataset.panel === target;
        panel.classList.toggle('is-active', active);
        panel.hidden = !active;
      });
    });
  });

  const revealElements = [...document.querySelectorAll('.reveal')];
  revealElements.forEach((el) => {
    if (el.dataset.delay) el.style.setProperty('--delay', `${el.dataset.delay}ms`);
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -35px 0px' });
    revealElements.forEach((el) => revealObserver.observe(el));
  }

  const counters = [...document.querySelectorAll('.counter')];

  function animateCounter(element) {
    const target = Number(element.dataset.target || 0);
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const duration = 1100;
    const start = performance.now();

    function frame(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const current = Math.round(target * eased);
      element.textContent = `${prefix}${current}${suffix}`;
      if (elapsed < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  if (reducedMotion || !('IntersectionObserver' in window)) {
    counters.forEach((el) => {
      el.textContent = `${el.dataset.prefix || ''}${el.dataset.target || '0'}${el.dataset.suffix || ''}`;
    });
  } else {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.65 });
    counters.forEach((el) => counterObserver.observe(el));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
