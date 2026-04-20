/* ============================================================
   JOTHIK PORTFOLIO — SCRIPT
   ============================================================ */
'use strict';

/* ─── Init ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  try {
    initAll();
  } catch (e) {
    console.error('Initialization error:', e);
  }
});

/* ─── Master Init ─────────────────────────────────────────── */
function initAll() {
  initTheme();
  initCursor();
  initTopbar();
  initSideNav();
  initScrollReveal();
  initHeroOrbit();
  initCounters();
  initRoleCycle();
  initCmdPalette();
  initMobileMenu();
  initProjectFilter();
  initDemoTabs();
  initMagnetic();
  initBackTop();
  initContactForm();
  initChat();
}

/* ─── Theme ──────────────────────────────────────────────── */
function initTheme() {
  const html  = document.documentElement;
  const btn   = document.getElementById('themeToggle');
  const icon  = document.getElementById('themeIcon');

  const saved = localStorage.getItem('jothik-theme') || 'light';
  html.setAttribute('data-theme', saved);
  icon.className = saved === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('jothik-theme', next);
    icon.className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  });
}

/* ─── Custom Cursor ──────────────────────────────────────── */
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cur  = document.getElementById('ytx-cur');
  const dot  = document.getElementById('ytxCurDot');
  const spot = document.getElementById('ytx-spot');
  if (!cur || !dot || !spot) return;

  const hoverTargets = 'a, button, [role="button"], input, label, select, textarea, .bento-card, .filter-btn, .archive-card, .featured-card, .step-card';

  let firstMove = true;
  document.addEventListener('mousemove', e => {
    if (firstMove) {
      cur.style.opacity = '1';
      dot.style.opacity = '1';
      firstMove = false;
    }
    cur.style.transform  = `translate(${e.clientX}px, ${e.clientY}px)`;
    dot.style.transform  = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    spot.style.left = e.clientX + 'px';
    spot.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.classList.add('hovering');
      document.body.classList.add('hov');
    });
    el.addEventListener('mouseleave', () => {
      cur.classList.remove('hovering');
      document.body.classList.remove('hov');
    });
  });

  document.addEventListener('mousedown', () => cur.classList.add('clicking'));
  document.addEventListener('mouseup',   () => cur.classList.remove('clicking'));
  document.addEventListener('mouseleave', () => { cur.style.opacity = '0'; dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cur.style.opacity = '1'; dot.style.opacity = '1'; });
}

/* ─── Topbar scroll ──────────────────────────────────────── */
function initTopbar() {
  const bar = document.getElementById('topbar');
  const onScroll = () => bar.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── Side Nav ───────────────────────────────────────────── */
function initSideNav() {
  const dots     = document.querySelectorAll('.side-dot');
  const sections = [...document.querySelectorAll('section[id]')];

  function update() {
    const mid = window.scrollY + window.innerHeight * 0.4;
    let active = sections[0];
    for (const s of sections) {
      if (s.offsetTop <= mid) active = s;
    }
    dots.forEach(d => {
      const matches = d.getAttribute('href') === '#' + active.id;
      d.classList.toggle('active', matches);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();

  /* smooth-scroll on click */
  dots.forEach(d => {
    d.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(d.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ─── Smooth nav links ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      /* close mobile menu if open */
      document.getElementById('navLinks').classList.remove('mobile-open');
      document.getElementById('mobileMenuBtn').classList.remove('open');
    }
  });
});

/* ─── Hero Orbit (GSAP) ──────────────────────────────────── */
function initHeroOrbit() {
  // Use .profile-card-wrap which exists in index.html
  const target = document.querySelector('.profile-card-wrap');
  if (!target) return;

  gsap.to(target, {
    y: 'random(-20, 20)',
    x: 'random(-10, 10)',
    rotationZ: 'random(-2, 2)',
    duration: 'random(3, 5)',
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.orb-1', {
    x: 'random(-100, 100)',
    y: 'random(-100, 100)',
    duration: 10,
    repeat: -1,
    yoyo: true,
    ease: 'none'
  });
}

/* ─── Scroll Reveal (GSAP) ────────────────────────────────── */
function initScrollReveal() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const reveals = [
    { el: '.reveal-up', y: 40, x: 0 },
    { el: '.reveal-left', y: 0, x: -40 },
    { el: '.reveal-right', y: 0, x: 40 },
    { el: '.reveal-scale', y: 0, x: 0, scale: 0.95 },
    { el: '.reveal-fade', y: 0, x: 0 },
  ];

  reveals.forEach(rev => {
    const targets = gsap.utils.toArray(rev.el);
    if (!targets.length) return;

    targets.forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: rev.y || 0,
        x: rev.x || 0,
        scale: rev.scale || 1,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        clearProps: 'all' // Clear GSAP styles after animation finish
      });
    });
  });

  // Special animation for dashboard panes
  if (document.querySelector('.dashboard-wrapper')) {
    gsap.from('.dashboard-wrapper', {
      scrollTrigger: {
        trigger: '.dashboard-wrapper',
        start: 'top 80%',
      },
      y: 60,
      opacity: 0,
      duration: 1.5,
      ease: 'expo.out',
      clearProps: 'all'
    });
  }
}

/* ─── Animated Counters ──────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.target, 10);
      let start = 0;
      const dur = 1400;
      const step = Math.ceil(end / (dur / 16));
      const timer = setInterval(() => {
        start += step;
        if (start >= end) { el.textContent = end; clearInterval(timer); return; }
        el.textContent = start;
      }, 16);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ─── Hero Role Cycle ────────────────────────────────────── */
function initRoleCycle() {
  const el = document.querySelector('.hero-rotate-text');
  if (!el) return;
  const roles = [
    'Neural Networks',
    'Practical AI Systems',
    'Intelligent Models',
    'Edge AI Solutions',
    'Cognitive Workflows'
  ];
  let idx = 0;

  setInterval(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      idx = (idx + 1) % roles.length;
      el.textContent = roles[idx];
      el.style.transform = 'translateY(20px)';
      
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 500);
  }, 3500);
}

/* ─── Command Palette ────────────────────────────────────── */
function initCmdPalette() {
  const palette = document.getElementById('cmdPalette');
  const input   = document.getElementById('cmdInput');
  const list    = document.getElementById('cmdList');
  const overlay = document.getElementById('cmdOverlay');

  function open() {
    palette.classList.add('open');
    palette.setAttribute('aria-hidden', 'false');
    setTimeout(() => input.focus(), 50);
  }
  function close() {
    palette.classList.remove('open');
    palette.setAttribute('aria-hidden', 'true');
    input.value = '';
    filterItems('');
  }

  window.openCmdPalette  = open;
  window.closeCmdPalette = close;

  document.getElementById('cmdBtn').addEventListener('click', open);
  overlay.addEventListener('click', close);

  /* Keyboard shortcut */
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
    if (e.key === 'Escape') close();
  });

  /* Filter */
  function filterItems(query) {
    const q = query.toLowerCase().trim();
    list.querySelectorAll('.cmd-item').forEach(item => {
      const txt = item.textContent.toLowerCase();
      item.classList.toggle('hidden', q !== '' && !txt.includes(q));
    });
  }
  input.addEventListener('input', () => filterItems(input.value));

  /* Click to navigate */
  list.addEventListener('click', e => {
    const item = e.target.closest('.cmd-item');
    if (!item) return;
    const href = item.dataset.href;
    if (!href) return;
    if (href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(href, '_blank', 'noopener');
    }
    close();
  });
}

/* ─── Mobile Menu ────────────────────────────────────────── */
function initMobileMenu() {
  const btn   = document.getElementById('mobileMenuBtn');
  const links = document.getElementById('navLinks');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const open = links.classList.toggle('mobile-open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });
}

/* ─── Project Archive Filter ─────────────────────────────── */
function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards   = document.querySelectorAll('#archiveGrid .archive-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show / hide cards
      cards.forEach(card => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          const cats = card.dataset.category || '';
          card.classList.toggle('hidden', !cats.includes(filter));
        }
      });
    });
  });
}

/* ─── Demo Tabs ──────────────────────────────────────────── */
function initDemoTabs() {
  const tabs  = document.querySelectorAll('.dash-nav-item');
  const panes = document.querySelectorAll('.dash-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t  => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const pane = document.getElementById('pane-' + tab.dataset.tab);
      if (pane) pane.classList.add('active');
    });
  });
}

/* ─── Magnetic Buttons ───────────────────────────────────── */
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const dx   = (e.clientX - rect.left - rect.width  / 2) * 0.25;
      const dy   = (e.clientY - rect.top  - rect.height / 2) * 0.25;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ─── Back to Top ────────────────────────────────────────── */
function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─── Contact Form (EmailJS) ─────────────────────────────── */
function initContactForm() {
  if (typeof emailjs === 'undefined') return;

  /* Replace these with your actual EmailJS credentials */
  emailjs.init('YOUR_PUBLIC_KEY');

  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  const error   = document.getElementById('formError');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const label   = btn.querySelector('.btn-label');
    const icon    = btn.querySelector('.btn-icon-right');
    const spinner = btn.querySelector('.btn-spinner');

    label.textContent = 'Sending…';
    if (icon)    icon.style.display    = 'none';
    if (spinner) spinner.style.display = 'inline-block';
    btn.disabled = true;
    success.style.display = 'none';
    error.style.display   = 'none';

    try {
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        from_name:    form.querySelector('#cf-name').value,
        from_email:   form.querySelector('#cf-email').value,
        subject:      form.querySelector('#cf-subject').value || 'Portfolio Contact',
        message:      form.querySelector('#cf-message').value,
        reply_to:     form.querySelector('#cf-email').value,
      });
      success.style.display = 'flex';
      form.reset();
    } catch {
      error.style.display = 'flex';
    } finally {
      label.textContent = 'Send Message';
      if (icon)    icon.style.display    = 'inline-block';
      if (spinner) spinner.style.display = 'none';
      btn.disabled = false;
    }
  });
}

/* ─── Floating Chat ──────────────────────────────────────── */
function initChat() {
  const fab        = document.getElementById('chatFab');
  const popup      = document.getElementById('chatPopup');
  const sendBtn    = document.getElementById('chatSendBtn');
  const chatInput  = document.getElementById('chatInput');
  const badge      = fab ? fab.querySelector('.chat-fab-badge') : null;
  const fabIcon    = fab ? fab.querySelector('.chat-fab-icon')  : null;
  const fabClose   = fab ? fab.querySelector('.chat-fab-close') : null;

  window.toggleChat = function() {
    const isOpen = popup.classList.toggle('open');
    if (badge) badge.style.opacity = isOpen ? '0' : '';
    if (fabIcon)  fabIcon.style.display  = isOpen ? 'none'         : 'inline-block';
    if (fabClose) fabClose.style.display = isOpen ? 'inline-block' : 'none';
  };

  if (sendBtn)   sendBtn.addEventListener('click', sendChatMessage);
  if (chatInput) chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage(); });

  /* Suggestion buttons */
  document.querySelectorAll('.chat-suggest-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      handleSuggestion(btn.dataset.msg);
      btn.closest('.chat-suggestions')?.remove();
    });
  });
}

const chatReplies = {
  'View projects':   'Jothik has built 6 impressive projects ranging from AI chatbots 🤖 and emotion detection 👁️ to data analytics dashboards 📊. Scroll down to the Projects section!',
  'Contact Jothik':  'You can reach Jothik at vanamjothik@gmail.com or fill out the contact form below. He typically responds within 24 hours!',
  'Skills overview': 'Jothik specialises in AI/ML 🧠, Python, and full-stack development. Key technologies include TensorFlow, PyTorch, React, FastAPI, and OpenAI API.',
};

const defaultReplies = [
  "That's a great question! Feel free to explore the portfolio or use the contact form to reach out directly.",
  "I'd recommend checking the Projects section for Jothik's work, or the Skills section for his technical capabilities.",
  "Jothik is open to AI development, full-stack projects, and data science collaborations. Use the Contact section to get in touch!",
];

function handleSuggestion(msg) {
  appendChatMsg(msg, 'user');
  setTimeout(() => {
    appendChatMsg(chatReplies[msg] || defaultReplies[0], 'bot');
  }, 600);
}

window.sendChatMessage = function() {
  const input = document.getElementById('chatInput');
  const text  = (input?.value || '').trim();
  if (!text) return;
  input.value = '';
  appendChatMsg(text, 'user');
  document.querySelectorAll('.chat-suggestions').forEach(el => el.remove());
  setTimeout(() => {
    const lower  = text.toLowerCase();
    let reply    = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    if (lower.includes('project'))   reply = chatReplies['View projects'];
    if (lower.includes('contact') || lower.includes('email') || lower.includes('hire'))
      reply = chatReplies['Contact Jothik'];
    if (lower.includes('skill') || lower.includes('tech') || lower.includes('language'))
      reply = chatReplies['Skills overview'];
    appendChatMsg(reply, 'bot');
  }, 700);
};

function appendChatMsg(text, type) {
  const msgs = document.getElementById('chatMsgs');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = `chat-msg chat-${type}`;
  div.innerHTML = `<div class="chat-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}
