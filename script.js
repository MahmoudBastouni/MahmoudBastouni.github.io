/* ============================================================
   Mahmoud Bastouni — Portfolio JS
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================
  // 1. THEME TOGGLE
  // ==========================================================
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel  = document.getElementById('themeLabel');
  const html = document.documentElement;

  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  themeLabel.textContent = savedTheme === 'dark' ? 'Light' : 'Dark';

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    // Show what you'll switch TO next click
    themeLabel.textContent = next === 'dark' ? 'Light' : 'Dark';
  });


  // ==========================================================
  // 2. NAVBAR SCROLL EFFECT
  // ==========================================================
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });


  // ==========================================================
  // 3. HAMBURGER MENU
  // ==========================================================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });


  // ==========================================================
  // 4. SCROLL REVEAL
  // ==========================================================
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.08}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));


  // ==========================================================
  // 5. ANIMATED COUNTERS
  // ==========================================================
  function animateCounter(el, target, duration = 1600) {
    const isYear = target > 999;
    let start = isYear ? target - 10 : 0;
    const range = target - start;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const value = Math.round(start + range * ease);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        statNums.forEach(el => {
          animateCounter(el, parseInt(el.dataset.target, 10));
        });
      }
    });
  }, { threshold: 0.5 });

  const aboutSection = document.getElementById('about');
  if (aboutSection) counterObserver.observe(aboutSection);


  // ==========================================================
  // 6. TYPEWRITER EFFECT
  // ==========================================================
  const typewriterEl = document.getElementById('typewriter');
  const words = ['Game Developer', 'CS Student', 'Full Stack Dev', 'Unity Creator'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeDelay = 120;

  function typeLoop() {
    const current = words[wordIndex];
    if (isDeleting) {
      typewriterEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typeDelay = 60;
    } else {
      typewriterEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typeDelay = 120;
    }

    if (!isDeleting && charIndex === current.length) {
      typeDelay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeDelay = 400;
    }

    setTimeout(typeLoop, typeDelay);
  }

  setTimeout(typeLoop, 1000);


  // ==========================================================
  // 7. COPY EMAIL
  // ==========================================================
  const emailCard = document.getElementById('emailCard');
  const copyToast = document.getElementById('copyToast');

  if (emailCard) {
    emailCard.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'mbastouni211205@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        copyToast.classList.add('show');
        setTimeout(() => copyToast.classList.remove('show'), 2500);
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  }


  // ==========================================================
  // 8. SEND MESSAGE BUTTON — opens mailto with form contents
  // ==========================================================
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const nameEl  = document.querySelector('.form-input[placeholder="John Doe"]');
      const emailEl = document.querySelector('.form-input[placeholder="john@example.com"]');
      const msgEl   = document.querySelector('.form-textarea');

      const name  = nameEl  ? nameEl.value.trim()  : '';
      const email = emailEl ? emailEl.value.trim()  : '';
      const msg   = msgEl   ? msgEl.value.trim()    : '';

      if (!name || !email || !msg) {
        sendBtn.textContent = '⚠ Please fill all fields';
        sendBtn.classList.add('sent');
        setTimeout(() => {
          sendBtn.textContent = 'SEND MESSAGE →';
          sendBtn.classList.remove('sent');
        }, 2500);
        return;
      }

      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body    = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${msg}`);
      window.location.href = `mailto:mbastouni211205@gmail.com?subject=${subject}&body=${body}`;

      sendBtn.textContent = '✓ Opening your mail app...';
      sendBtn.classList.add('sent');
      setTimeout(() => {
        sendBtn.textContent = 'SEND MESSAGE →';
        sendBtn.classList.remove('sent');
      }, 3500);
    });
  }


  // ==========================================================
  // 9. SCROLL SPY NAV
  // ==========================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link-item');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--accent)';
      }
    });
  });

});