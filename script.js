/* ============================================================
   JOTHIK — PORTFOLIO SCRIPT
   ============================================================ */

'use strict';

/* ─── Loader ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('done');
        document.body.classList.remove('no-scroll');
        initAll();
    }, 2000);
});

/* ─── Master Init ─────────────────────────────────────────── */
function initAll() {
    initCursor();
    initParticles();
    initRoleCycle();
    initScrollReveal();
    initSkillBars();
    initCounters();
    initSideNav();
    initTopbar();
    initTheme();
    initTilt();
    initMagnetic();
    initLightbox();
    initContactForm();
}

/* ─── Theme ──────────────────────────────────────────────── */
function initTheme() {
    const html = document.documentElement;
    const btn  = document.getElementById('themeToggle');

    const saved = localStorage.getItem('jothik-theme') || 'dark';
    html.setAttribute('data-theme', saved);

    btn.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('jothik-theme', next);
    });
}

/* ─── Custom Cursor ──────────────────────────────────────── */
function initCursor() {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    });

    (function loopRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(loopRing);
    })();

    document.querySelectorAll('a, button, .tl-card, .skill-cat, .edu-card, .contact-link, .soc-btn').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
}

/* ─── Particle Canvas ────────────────────────────────────── */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
        constructor() { this.reset(true); }
        reset(random) {
            this.x  = random ? Math.random() * canvas.width  : (Math.random() > .5 ? 0 : canvas.width);
            this.y  = random ? Math.random() * canvas.height : Math.random() * canvas.height;
            this.vx = (Math.random() - .5) * .35;
            this.vy = (Math.random() - .5) * .35;
            this.r  = Math.random() * 1.8 + .4;
            this.a  = Math.random() * .5 + .1;
            this.hue = Math.random() > .5 ? '108,99,255' : '0,229,255';
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset(false);
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.a;
            ctx.fillStyle   = `rgb(${this.hue})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    const particles = Array.from({ length: 80 }, () => new Particle());
    const MAX_DIST  = 110;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);
                if (dist < MAX_DIST) {
                    ctx.save();
                    ctx.globalAlpha = (1 - dist / MAX_DIST) * .12;
                    ctx.strokeStyle = '#6c63ff';
                    ctx.lineWidth   = .6;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

/* ─── Role Cycler ────────────────────────────────────────── */
function initRoleCycle() {
    const words   = document.querySelectorAll('.role-word');
    if (!words.length) return;
    let current   = 0;

    setInterval(() => {
        words[current].classList.remove('active');
        words[current].classList.add('exiting');
        const prev = current;
        setTimeout(() => words[prev].classList.remove('exiting'), 520);

        current = (current + 1) % words.length;
        words[current].classList.add('active');
    }, 2600);
}

/* ─── Scroll Reveal ──────────────────────────────────────── */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el    = entry.target;
                const delay = parseFloat(el.dataset.delay || 0);
                setTimeout(() => el.classList.add('visible'), delay);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.14 });

    document.querySelectorAll('.reveal-up, .edu-card, .tl-item').forEach((el, i) => {
        el.dataset.delay = (i % 5) * 90;
        observer.observe(el);
    });
}

/* ─── Skill Bars ─────────────────────────────────────────── */
function initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
                    const pct = bar.dataset.pct || 80;
                    setTimeout(() => { bar.style.width = pct + '%'; }, i * 80 + 150);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    document.querySelectorAll('.skill-cat').forEach(cat => observer.observe(cat));
}

/* ─── Stat Counters ──────────────────────────────────────── */
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numEl  = entry.target;
                const target = parseInt(numEl.dataset.target, 10);
                let current  = 0;
                const step   = target / 55;

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    numEl.textContent = Math.floor(current);
                }, 16);

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.stat-num').forEach(el => observer.observe(el));
}

/* ─── Side Nav Active State ──────────────────────────────── */
function initSideNav() {
    const dots     = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                dots.forEach(d => d.classList.toggle('active', d.getAttribute('href') === '#' + id));
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));

    dots.forEach(dot => {
        dot.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(dot.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/* ─── Topbar Scroll Effect ───────────────────────────────── */
function initTopbar() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;
    const update = () => topbar.classList.toggle('scrolled', window.scrollY > 60);
    update();
    window.addEventListener('scroll', update, { passive: true });
}

/* ─── Card Tilt ──────────────────────────────────────────── */
function initTilt() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const x  = (e.clientX - r.left) / r.width  - .5;
            const y  = (e.clientY - r.top)  / r.height - .5;
            card.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateZ(8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ─── Magnetic Buttons ───────────────────────────────────── */
function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r  = el.getBoundingClientRect();
            const x  = e.clientX - r.left - r.width  / 2;
            const y  = e.clientY - r.top  - r.height / 2;
            el.style.transform = `translate(${x * .18}px, ${y * .18}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

/* ─── Lightbox ───────────────────────────────────────────── */
function initLightbox() {
    const lb       = document.getElementById('lightbox');
    const lbImg    = document.getElementById('lbImg');
    const closBtn  = lb.querySelector('.lb-close');
    const backdrop = lb.querySelector('.lb-backdrop');

    function closeLightbox() {
        lb.classList.remove('active');
        document.body.classList.remove('no-scroll');
        setTimeout(() => { lbImg.src = ''; }, 300);
    }

    closBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

/* ─── Contact Form (EmailJS) ─────────────────────────────── */
function initContactForm() {
    const form       = document.getElementById('contact-form');
    const submitBtn  = document.getElementById('submit-btn');
    const formMsg    = document.getElementById('form-message');

    if (!form || !submitBtn) return;

    // Initialize EmailJS
    // IMPORTANT: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS Public Key
    if (typeof emailjs !== 'undefined') {
        emailjs.init('YOUR_PUBLIC_KEY');
    }

    form.addEventListener('submit', e => {
        e.preventDefault();

        const name    = document.getElementById('from_name').value.trim();
        const email   = document.getElementById('from_email').value.trim();
        const phone   = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validation
        if (!name || !email || !phone || !subject || !message) {
            showFormMsg('Please fill in all fields!', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMsg('Please enter a valid email address!', 'error');
            return;
        }

        const phoneRegex = /^[0-9]{10,}$/;
        if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
            showFormMsg('Please enter a valid phone number!', 'error');
            return;
        }

        if (typeof emailjs === 'undefined') {
            showFormMsg('Email service unavailable. Please email vanamjothik@gmail.com directly.', 'error');
            return;
        }

        const origHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending…';
        submitBtn.disabled  = true;

        // IMPORTANT: Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            from_name: name,
            from_email: email,
            phone: phone,
            subject: subject,
            message: message
        })
        .then(() => {
            submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #00d67a, #00a855)';
            showFormMsg('Message sent successfully! I will get back to you soon.', 'success');
            form.reset();

            setTimeout(() => {
                submitBtn.innerHTML       = origHTML;
                submitBtn.style.background = '';
                submitBtn.disabled         = false;
            }, 3200);
        })
        .catch(() => {
            showFormMsg('Failed to send. Please email me at vanamjothik@gmail.com directly.', 'error');
            submitBtn.innerHTML = origHTML;
            submitBtn.disabled  = false;
        });
    });

    function showFormMsg(msg, type) {
        if (!formMsg) return;
        formMsg.textContent = msg;
        formMsg.style.color = type === 'success' ? '#00d67a' : '#ff4444';
        setTimeout(() => { formMsg.textContent = ''; }, 5000);
    }
}
