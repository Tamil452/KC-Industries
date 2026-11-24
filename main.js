(function () {
  var rows = [
    ['Swiss machine — sliding head CNC','B0205-III','Tsugami',1],
    ['CNC lathe','165 mm','Jothi',1],
    ['CNC lathe','165 mm','Geedee Weiler',1],
    ['CNC lathe','A2-4','Geedee Weiler',1],
    ['CNC lathe','A2-4','Jothi',4],
    ['Bar feeder','1.2 m','FAR',3],
    ['Traub auto lathe','A25','PMT, Arrow',7],
    ['Traub auto lathe','A32','SGS',2],
    ['Centreless grinding','CG75','Swemag',1],
    ['Thread rolling','10 ton','TFM',1],
    ['Horizontal milling','No. 1','Pioneer',1],
    ['Drilling machine','1.25 in','Local',2],
    ['Tapping machine','M16','Local',2],
    ['Lathe machine','4.5 ft','Local',2],
    ['Barrelling machine','Small','Local',1],
    ['Slitting machine','Small','Local',1],
    ['Bench grinding','Small','Local',2],
    ['Arc welding','Small','Local',2]
  ];
  var tbody = document.getElementById('machine-rows');
  var total = 0;
  rows.forEach(function (r, i) {
    total += r[3];
    var tr = document.createElement('tr');
    [[String(i + 1).padStart(2, '0'), 'no'], [r[0], ''], [r[1], 'cap'], [r[2], 'make'], [String(r[3]), 'qty']].forEach(function (c) {
      var td = document.createElement('td');
      if (c[1] === 'qty') { var sp = document.createElement('span'); sp.textContent = c[0]; td.appendChild(sp); }
      else td.textContent = c[0];
      if (c[1]) td.className = c[1];
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  document.getElementById('machine-total').textContent = total;

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile menu
  var btn = document.getElementById('menu-btn'), links = document.getElementById('nav-links');
  function setOpen(open) {
    links.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  btn.addEventListener('click', function () { setOpen(!links.classList.contains('open')); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && links.classList.contains('open')) { setOpen(false); btn.focus(); }
  });

  // Copy buttons
  var status = document.getElementById('copy-status');
  document.querySelectorAll('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      function done() {
        b.classList.add('done');
        if (status) status.textContent = 'Copied ' + text;
        setTimeout(function () { b.classList.remove('done'); }, 1600);
      }
      function fallback() {
        var a = b.parentNode.querySelector('.val');
        var range = document.createRange(); range.selectNodeContents(a);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
    });
  });

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header shadow on scroll
  var header = document.getElementById('site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight the nav link for the section in view
  var navMap = {};
  links.querySelectorAll('a[href^="#"]:not(.btn)').forEach(function (a) { navMap[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Object.keys(navMap).forEach(function (k) { navMap[k].classList.toggle('active', k === e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(navMap).forEach(function (id) { var el = document.getElementById(id); if (el) secObs.observe(el); });
  }

  // Reveal on scroll, staggered within a group
  var revealEls = document.querySelectorAll('.reveal');
  function settle(el) {
    // Drop the reveal classes once shown so hover transitions use the element's own timing
    el.addEventListener('transitionend', function h(ev) {
      if (ev.target !== el || ev.propertyName !== 'opacity') return;
      el.removeEventListener('transitionend', h);
      el.classList.remove('reveal', 'in');
      el.style.transitionDelay = '';
    });
  }
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.remove('reveal'); });
  } else {
    var revObs = new IntersectionObserver(function (entries) {
      var i = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = Math.min(i++ * 70, 420) + 'ms';
        settle(e.target);
        e.target.classList.add('in');
        revObs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { revObs.observe(el); });
  }

  // Count-up for the headline numbers
  var counters = document.querySelectorAll('[data-count]');
  function fmt(el, v) {
    var n = el.getAttribute('data-format') === 'comma' ? Math.round(v).toLocaleString('en-US') : String(Math.round(v));
    return n + (el.getAttribute('data-suffix') || '');
  }
  function run(el) {
    var target = +el.getAttribute('data-count'), t0 = null, dur = 1400;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(el, target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (!reduce && 'IntersectionObserver' in window) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); cObs.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { if (+el.getAttribute('data-count') >= 10) cObs.observe(el); });
  }
})();
