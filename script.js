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
      if (e.target.tagName === 'A') links.classList.remove('open');
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
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        var cats = (card.getAttribute('data-cat') || '').split(/\s+/);
        var show = f === 'all' || cats.indexOf(f) !== -1;
        card.classList.toggle('hidden', !show);
        if (show) card.classList.add('visible');
      });
    });
  });

  // Live public repos from GitHub
  var GH_USER = 'xdeelord24';
  var grid = document.getElementById('repo-grid');
  var statRepos = document.getElementById('stat-repos');
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
              statRepos.textContent = (u.public_repos + 52) + '+';
              statRepos.title = u.public_repos + ' public + 52 private repositories';
            }
          })
          .catch(function () {});
      })
      .catch(function () {
        grid.innerHTML = '<p class="muted">Couldn\u2019t load repositories right now — see <a href="https://github.com/' + GH_USER + '?tab=repositories" target="_blank" rel="noopener">github.com/' + GH_USER + '</a>.</p>';
      });
  }
})();
