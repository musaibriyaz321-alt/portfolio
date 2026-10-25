/* ===== Musaib Reyaz Portfolio: interactions ===== */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* Page loader */
  window.addEventListener('load', () => setTimeout(() => $('#loader').classList.add('hide'), 700));

  /* Typing effect (EDIT: change the roles) */
  const roles = ['AI Learner', 'Python Developer', 'Web Developer', 'B.Sc IT Student'];
  let r = 0, c = 0, del = false;
  const typing = $('#typing');
  (function type() {
    const word = roles[r];
    typing.textContent = word.slice(0, del ? c-- : c++);
    let speed = del ? 50 : 110;
    if (!del && c > word.length) { del = true; speed = 1400; }
    else if (del && c < 0) { del = false; r = (r + 1) % roles.length; c = 0; speed = 400; }
    setTimeout(type, speed);
  })();

  /* Sticky nav, scroll-to-top, hamburger */
  const nav = $('#nav'), toTop = $('#to-top'), burger = $('#burger'), menu = $('#menu');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 40);
    toTop.classList.toggle('show', scrollY > 500);
  }, { passive: true });
  toTop.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  burger.onclick = () => { burger.classList.toggle('open'); menu.classList.toggle('open'); };
  $$('#menu a').forEach(a => a.onclick = () => { burger.classList.remove('open'); menu.classList.remove('open'); });

  /* Active section highlight */
  const links = $$('#menu a');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('section[id]').forEach(s => spy.observe(s));

  /* Scroll reveal + counters + skill bars */
  const countUp = el => {
    const target = +el.dataset.count; let n = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const t = setInterval(() => { n = Math.min(n + step, target); el.textContent = n + (target >= 100 ? '+' : ''); if (n >= target) clearInterval(t); }, 25);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    $$('[data-count]', e.target).forEach(countUp);
    $$('[data-level]', e.target).forEach(b => b.style.width = b.dataset.level + '%');
    io.unobserve(e.target);
  }), { threshold: 0.15 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 0.08 + 's'; io.observe(el); });

  /* Button ripple */
  document.addEventListener('click', e => {
    const b = e.target.closest('.ripple'); if (!b) return;
    const d = Math.max(b.clientWidth, b.clientHeight), rect = b.getBoundingClientRect();
    const s = document.createElement('span'); s.className = 'rip';
    s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - d / 2}px;top:${e.clientY - rect.top - d / 2}px`;
    b.appendChild(s); setTimeout(() => s.remove(), 600);
  });

  /* Mouse glow */
  const glow = $('#mouse-glow');
  window.addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

  /* Floating glowing particles */
  const cv = $('#particles'), ctx = cv.getContext('2d');
  let W, H, ps = [];
  const colors = ['#3b82f6', '#8b5cf6', '#22d3ee'];
  const resize = () => {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    ps = Array.from({ length: Math.min(70, Math.floor(W / 18)) }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2 + .6,
      vx: (Math.random() - .5) * .3, vy: -Math.random() * .4 - .1, c: colors[Math.random() * 3 | 0]
    }));
  };
  resize(); window.addEventListener('resize', resize);
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    ps.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = 12; ctx.fill();
    });
    requestAnimationFrame(draw);
  })();

  /* Contact form: sends messages straight to your inbox via Web3Forms
     EDIT: paste your access key below (get it free at web3forms.com) */
  const ACCESS_KEY = 'e3bb2ce5-2d24-401b-816e-7474bdf303b7';
  const form = $('#contact-form'), note = $('#form-note');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    btn.disabled = true; note.textContent = 'Sending…';
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: $('#f-name').value,
          email: $('#f-email').value,
          subject: $('#f-sub').value || 'New message from portfolio',
          message: $('#f-msg').value
        })
      });
      const data = await res.json();
      if (data.success) { note.textContent = 'Message sent ✓ Thank you!'; form.reset(); }
      else note.textContent = 'Something went wrong. Please email me directly.';
    } catch (err) {
      note.textContent = 'Network error. Please email me directly.';
    }
    btn.disabled = false;
  });

  /* Footer year */
  $('#year').textContent = new Date().getFullYear();
})();