/* 매거진 · 더 씨드 · frontpage.js
   홈(1면)에서 data/issues.json을 읽어 최신 데일리를 리드로, 최신 주간·월간을 레일로 렌더링.
   issues.json이 자동 발행 때마다 갱신되므로 홈은 별도 편집 없이 최신 상태를 반영한다. */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function latest(items, type) {
    return items.filter(function (x) { return x.type === type; })
      .sort(function (a, b) { return a.date < b.date ? 1 : -1; })[0];
  }
  fetch('data/issues.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var items = data.issues || [];
      var d = latest(items, 'daily'), w = latest(items, 'weekly'), m = latest(items, 'monthly');

      var lead = document.getElementById('fp-lead');
      if (lead && d) {
        lead.innerHTML =
          '<div class="fp-kicker">TODAY’S LEAD · DAILY</div>' +
          '<h2><a href="' + esc(d.url) + '">' + esc(d.title) + '</a></h2>' +
          (d.summary ? '<p class="fp-dek">' + esc(d.summary) + '</p>' : '') +
          '<div class="fp-date">' + esc(d.date) + ' · 오늘의 브리핑 전문 읽기 →</div>';
      }

      var rail = document.getElementById('fp-rail');
      if (rail) {
        var html = '<div class="rail-head">THIS WEEK &amp; MONTH</div>';
        if (w) html += '<a class="rail-item" href="' + esc(w.url) + '">' +
          '<div class="r-kicker">Weekly · The Seed</div><h3>' + esc(w.title.replace(/^The Seed\s*·\s*/, '')) + '</h3>' +
          (w.summary ? '<p>' + esc(w.summary) + '</p>' : '') + '</a>';
        if (m) html += '<a class="rail-item" href="' + esc(m.url) + '">' +
          '<div class="r-kicker">Monthly · Review</div><h3>' + esc(m.title.replace(/^MONTHLY\s*·\s*/, '')) + '</h3>' +
          (m.summary ? '<p>' + esc(m.summary) + '</p>' : '') + '</a>';
        html += '<a class="rail-item" href="archive/index.html">' +
          '<div class="r-kicker">Archive</div><h3>지난 호 키워드 검색</h3>' +
          '<p>날짜가 기억나지 않아도 그 호의 단어로 다시 찾습니다.</p></a>';
        rail.innerHTML = html;
      }
    })
    .catch(function () {
      var lead = document.getElementById('fp-lead');
      if (lead) lead.innerHTML = '<div class="fp-kicker">TODAY’S LEAD</div><h2><a href="daily/index.html">오늘의 데일리 읽기 →</a></h2>';
    });
})();
