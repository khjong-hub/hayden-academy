/* HAYDEN ACADEMY · search.js
   지난 호 검색. data/issues.json을 불러와 날짜 + 키워드(제목/요약/키워드)로 필터한다.
   archive/index.html 에서 사용. 기대 DOM: #ha-search, #ha-type, #ha-results */
(function () {
  var box = document.getElementById('ha-search');
  var typeSel = document.getElementById('ha-type');
  var out = document.getElementById('ha-results');
  if (!out) return;
  var BASE = '../'; // archive/ 기준 루트

  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  function row(it) {
    var kw = (it.keywords || []).slice(0, 8).map(function (k) { return '<span>' + esc(k) + '</span>'; }).join('');
    var badge = it.type === 'weekly' ? '<span class="badge weekly">Weekly</span>'
      : it.type === 'monthly' ? '<span class="badge monthly">Monthly</span>'
        : '<span class="badge">Daily</span>';
    return '<a class="issue-row" href="' + BASE + esc(it.url) + '">' +
      '<div><div class="d">' + esc(it.date) + '</div>' + badge + '</div>' +
      '<div><h3>' + esc(it.title) + '</h3>' +
      (it.summary ? '<p>' + esc(it.summary) + '</p>' : '') +
      (kw ? '<div class="kw">' + kw + '</div>' : '') +
      '</div></a>';
  }

  function draw(list) {
    if (!list.length) { out.innerHTML = '<div class="empty">검색 결과가 없습니다. 다른 키워드(예: 코스피, 사랑, 유가, 청년)로 시도해 보세요.</div>'; return; }
    out.innerHTML = list.map(row).join('');
  }

  fetch(BASE + 'data/issues.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var items = (data.issues || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      function filter() {
        var q = (box ? box.value : '').trim().toLowerCase();
        var t = typeSel ? typeSel.value : 'all';
        var res = items.filter(function (it) {
          if (t !== 'all' && it.type !== t) return false;
          if (!q) return true;
          var hay = (it.date + ' ' + it.title + ' ' + (it.summary || '') + ' ' + (it.keywords || []).join(' ')).toLowerCase();
          return q.split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; });
        });
        draw(res);
      }
      if (box) box.addEventListener('input', filter);
      if (typeSel) typeSel.addEventListener('change', filter);
      draw(items);
    })
    .catch(function () { out.innerHTML = '<div class="empty">색인을 불러오지 못했습니다.</div>'; });
})();
