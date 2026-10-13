/* Jundee Molina — portfolio behaviour (no framework, no build step) */
(function () {
  'use strict';

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open') && !document.querySelector('dialog[open]')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // Project filters
  var filters = document.querySelectorAll('.filter');
  var cards = document.querySelectorAll('.projects-grid .card');
  filters.forEach(function (btn) {
    btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
    btn.addEventListener('click', function () {
      filters.forEach(function (b) {
        var selected = b === btn;
        b.classList.toggle('active', selected);
        b.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
      var f = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        var cats = (card.getAttribute('data-cat') || '').split(/\s+/);
        var show = f === 'all' || cats.indexOf(f) !== -1;
        card.classList.toggle('hidden', !show);
        if (show) card.classList.add('visible');
      });
    });
  });

  // Real project screenshots; normal image links remain usable without dialog support.
  var galleryLinks = Array.prototype.slice.call(document.querySelectorAll('.screenshot-link'));
  var dialog = document.getElementById('screenshot-dialog');
  var galleryImage = document.getElementById('screenshot-image');
  var galleryTitle = document.getElementById('screenshot-title');
  var galleryCaption = document.getElementById('screenshot-caption');
  var galleryCounter = document.getElementById('screenshot-counter');
  var galleryClose = document.getElementById('screenshot-close');
  var galleryPrev = document.getElementById('screenshot-prev');
  var galleryNext = document.getElementById('screenshot-next');
  var galleryOriginal = document.getElementById('screenshot-original');
  var galleryStatus = document.getElementById('screenshot-status');
  var galleryItems = [];
  var galleryIndex = 0;
  var galleryOpener = null;

  function renderScreenshot() {
    var item = galleryItems[galleryIndex];
    var preview = item.querySelector('img');
    var title = item.getAttribute('data-title') || (preview && preview.alt) || 'Project screenshot';
    var position = (galleryIndex + 1) + ' of ' + galleryItems.length;
    galleryTitle.textContent = title;
    galleryCaption.textContent = item.getAttribute('data-caption') || '';
    galleryCounter.textContent = position;
    galleryPrev.hidden = galleryItems.length < 2;
    galleryNext.hidden = galleryItems.length < 2;
    galleryImage.alt = (preview && preview.alt) || title;
    galleryOriginal.href = item.href;
    galleryStatus.textContent = 'Loading screenshot ' + position + '.';
    galleryImage.onload = function () {
      galleryStatus.textContent = 'Screenshot ' + position + ': ' + title;
    };
    galleryImage.onerror = function () {
      galleryStatus.textContent = 'This screenshot could not load. Use the original image link to open it separately.';
    };
    galleryImage.src = item.href;
  }

  function changeScreenshot(offset) {
    if (!galleryItems.length) return;
    galleryIndex = (galleryIndex + offset + galleryItems.length) % galleryItems.length;
    renderScreenshot();
  }

  if (dialog && typeof dialog.showModal === 'function' && galleryImage && galleryTitle &&
      galleryCaption && galleryCounter && galleryClose && galleryPrev && galleryNext &&
      galleryOriginal && galleryStatus) {
    galleryLinks.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        var group = anchor.getAttribute('data-gallery');
        galleryItems = group ? galleryLinks.filter(function (item) {
          return item.getAttribute('data-gallery') === group;
        }) : [anchor];
        galleryIndex = galleryItems.indexOf(anchor);
        galleryOpener = anchor;
        renderScreenshot();
        try {
          dialog.showModal();
        } catch (error) {
          galleryOpener = null;
          return;
        }
        e.preventDefault();
        document.body.classList.add('gallery-open');
        galleryClose.focus();
      });
    });
    galleryClose.addEventListener('click', function () { dialog.close(); });
    galleryPrev.addEventListener('click', function () { changeScreenshot(-1); });
    galleryNext.addEventListener('click', function () { changeScreenshot(1); });
    dialog.addEventListener('keydown', function (e) {
      if (!dialog.open || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        changeScreenshot(e.key === 'ArrowLeft' ? -1 : 1);
      }
    });
    dialog.addEventListener('click', function (e) {
      if (e.target !== dialog) return;
      var bounds = dialog.getBoundingClientRect();
      if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) {
        dialog.close();
      }
    });
    dialog.addEventListener('close', function () {
      document.body.classList.remove('gallery-open');
      galleryImage.onload = null;
      galleryImage.onerror = null;
      galleryStatus.textContent = '';
      var opener = galleryOpener;
      galleryOpener = null;
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    });
  }

  // Live public repos from GitHub
  var GH_USER = 'xdeelord24';
  var grid = document.getElementById('repo-grid');
  var statRepos = document.getElementById('stat-repos');
  var statReposLabel = document.getElementById('stat-repos-label');
  if (statRepos) {
    statRepos.textContent = '\u2014';
    statRepos.title = 'Public repository count is unavailable until GitHub responds.';
  }
  if (statReposLabel) statReposLabel.textContent = 'public repositories';
  var LANG_COLORS = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', Vue: '#41b883', PHP: '#4F5D95',
    HTML: '#e34c26', CSS: '#563d7c', Dart: '#00B4AB', 'C++': '#f34b7d', 'Jupyter Notebook': '#DA5B0B', Shell: '#89e051'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderRepos(repos) {
    if (!grid) return;
    var own = repos.filter(function (r) { return !r.fork && r.name.toLowerCase() !== GH_USER.toLowerCase(); });
    own.sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); });
    var top = own.slice(0, 12);
    if (!top.length) { grid.innerHTML = '<p class="muted">No public repositories to show right now.</p>'; return; }
    grid.innerHTML = top.map(function (r) {
      var color = LANG_COLORS[r.language] || '#a78bfa';
      return '<a class="repo" href="' + esc(r.html_url) + '" target="_blank" rel="noopener">' +
        '<h4>' + esc(r.name) + '</h4>' +
        '<p>' + esc(r.description || 'No description yet.') + '</p>' +
        '<div class="repo-meta">' +
          (r.language ? '<span><i class="lang-dot" style="background:' + color + '"></i>' + esc(r.language) + '</span>' : '') +
          '<span>★ ' + (r.stargazers_count || 0) + '</span>' +
          '<span>updated ' + esc(new Date(r.pushed_at).toISOString().slice(0, 10)) + '</span>' +
        '</div></a>';
    }).join('');
  }

  if (grid && window.fetch) {
    fetch('https://api.github.com/users/' + GH_USER + '/repos?per_page=100&sort=pushed&type=owner')
      .then(function (res) { if (!res.ok) throw new Error('GitHub API ' + res.status); return res.json(); })
      .then(function (repos) {
        renderRepos(repos);
        fetch('https://api.github.com/users/' + GH_USER)
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (u) {
            if (u && statRepos && typeof u.public_repos === 'number') {
              statRepos.textContent = String(u.public_repos);
              statRepos.title = u.public_repos + ' public repositories on GitHub';
            }
          })
          .catch(function () {});
      })
      .catch(function () {
        grid.innerHTML = '<p class="muted">Couldn\u2019t load repositories right now — see <a href="https://github.com/' + GH_USER + '?tab=repositories" target="_blank" rel="noopener">github.com/' + GH_USER + '</a>.</p>';
      });
  }
})();
