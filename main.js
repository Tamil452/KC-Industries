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
      td.textContent = c[0];
      if (c[1]) td.className = c[1];
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  document.getElementById('machine-total').textContent = total;

  // Mobile menu
  var btn = document.getElementById('menu-btn'), links = document.getElementById('nav-links');
  function setOpen(open) {
    links.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  btn.addEventListener('click', function () { setOpen(!links.classList.contains('open')); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });

  // Copy buttons
  document.querySelectorAll('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      function done() { b.classList.add('done'); setTimeout(function () { b.classList.remove('done'); }, 1600); }
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
})();
