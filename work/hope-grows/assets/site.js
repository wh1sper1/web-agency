// Hope Grows: gentle interactivity
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // year
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // light / dark theme toggle
  function syncTheme() {
    var dark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.theme-btn').forEach(function (b) {
      var on = (b.getAttribute('data-theme') === 'dark') === dark;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  syncTheme();
  document.querySelectorAll('.theme-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var dark = b.getAttribute('data-theme') === 'dark';
      document.documentElement.classList.toggle('dark', dark);
      try { localStorage.setItem('hg-theme', dark ? 'dark' : 'light'); } catch (e) {}
      syncTheme();
    });
  });

  // reveal on scroll (subtle, fails safe)
  var els = document.querySelectorAll('.reveal');
  function showVisible() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    els.forEach(function (el) {
      if (el.classList.contains('visible')) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.94) el.classList.add('visible');
    });
  }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(showVisible, 900);
    window.addEventListener('load', showVisible);
  } else {
    els.forEach(function (el) { el.classList.add('visible'); });
  }

  // AFB-style leaf bursts on click: canvas-drawn leaves (bezier body, midrib,
  // side veins), 3-7 per burst. Click-only by owner's choice (no ambient drift).
  (function () {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
    var cv = document.createElement('canvas');
    cv.id = 'leafs';
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    var ctx = cv.getContext('2d'), W = 0, H = 0, leaves = [], raf = 0;
    function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
    resize();
    addEventListener('resize', resize);
    // deep forest greens + ochres that read on cream (AFB light-mode hues)
    var HUES = [[10, 127, 70], [17, 94, 58], [46, 140, 90], [61, 124, 74],
                [143, 94, 18], [176, 120, 30]];
    function pickHue() { return HUES[Math.random() * HUES.length | 0]; }
    function spawn(x, y, power) {
      var n = 3 + (Math.random() * 4 | 0);
      for (var i = 0; i < n; i++) {
        var a = Math.random() * Math.PI * 2, sp = (0.6 + Math.random() * 1.8) * power;
        leaves.push({
          x: x + (Math.random() - 0.5) * 10, y: y + (Math.random() - 0.5) * 10,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.2,
          rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.22,
          size: 7 + Math.random() * 9, hue: pickHue(),
          sway: 0.6 + Math.random() * 1.4, ph: Math.random() * Math.PI * 2,
          life: 1, decay: 0.008 + Math.random() * 0.01, drag: 0.985
        });
      }
      if (leaves.length > 90) { leaves.splice(0, leaves.length - 90); }
      if (!raf) { raf = requestAnimationFrame(frame); }
    }
    function drawLeaf(l) {
      var s = l.size, c = l.hue;
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rot);
      ctx.globalAlpha = Math.max(0, Math.min(1, l.life)) * 0.92;
      ctx.fillStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.9, -s * 0.4, s * 0.7, s * 0.6, 0, s);
      ctx.bezierCurveTo(-s * 0.7, s * 0.6, -s * 0.9, -s * 0.4, 0, -s);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.55)';
      ctx.lineWidth = Math.max(0.7, s * 0.09);
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.85);
      ctx.lineTo(0, s * 0.85);
      ctx.stroke();
      ctx.globalAlpha *= 0.45;
      for (var i = -2; i <= 2; i++) {
        if (!i) { continue; }
        ctx.beginPath();
        ctx.moveTo(0, i * s * 0.3);
        ctx.lineTo((i > 0 ? 1 : -1) * s * 0.5, i * s * 0.3 + s * 0.28);
        ctx.stroke();
      }
      ctx.restore();
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = leaves.length - 1; i >= 0; i--) {
        var l = leaves[i];
        l.ph += 0.04;
        l.vx *= l.drag;
        l.vy = l.vy * l.drag + 0.055 + Math.sin(l.ph) * 0.03;
        l.x += l.vx + Math.sin(l.ph) * l.sway * 0.5;
        l.y += l.vy;
        l.rot += l.vr + Math.sin(l.ph) * 0.01;
        l.life -= l.decay;
        if (l.life <= 0 || l.y > H + 30) { leaves.splice(i, 1); continue; }
        drawLeaf(l);
      }
      if (leaves.length) { raf = requestAnimationFrame(frame); }
      else { raf = 0; ctx.clearRect(0, 0, W, H); }
    }
    document.addEventListener('pointerdown', function (e) {
      spawn(e.clientX, e.clientY, 1);
    });
    window.HG_LEAF_BURST = spawn; // deterministic test hook (mirrors AFB)
  })();
})();
