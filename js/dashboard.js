/* HAYDEN ACADEMY · dashboard.js
   월간호의 "개인 활용도" 장치. #ha-dashboard(data-month="YYYY-MM") 안에 렌더링한다.
   tracker.js(window.HA)가 먼저 로드되어 있어야 한다. */
(function () {
  var TOPICS = [
    { key: 'english', label: 'English 학습', target: 20 },
    { key: 'faith', label: '신학 묵상', target: 20 },
    { key: 'economy', label: '경제 브리핑', target: 20 }
  ];
  function daysInMonth(ym) {
    var p = ym.split('-'); return new Date(parseInt(p[0], 10), parseInt(p[1], 10), 0).getDate();
  }
  function feedback(s, dim) {
    var rate = dim ? Math.round((s.daysAccessed / dim) * 100) : 0;
    if (s.daysAccessed === 0)
      return '이번 달 기록이 아직 없습니다. 데일리를 한 번 열면 여기부터 측정이 시작됩니다. 작게 시작해도 충분합니다.';
    if (rate >= 66)
      return '접속 리듬이 강하게 유지되고 있습니다(' + rate + '%). 지금은 양보다 ‘깊이’를 한 단계 올릴 때 — 퀴즈 세 영역 중 가장 낮은 칸을 이번 주 목표로 삼아보세요.';
    if (rate >= 33)
      return '절반 가까운 날을 채우고 있습니다(' + rate + '%). 끊긴 날을 줄이는 것이 핵심 — 연속 접속 ' + s.streak + '일을 다음 주에 하루만 더 늘려보세요.';
    return '이번 달 접속 밀도가 낮습니다(' + rate + '%). 완벽한 하루보다 ‘매일 3분’이 낫습니다. 아침 알림에 데일리 링크를 걸어두는 것을 추천합니다.';
  }
  function bar(k, val, target) {
    var pct = Math.max(0, Math.min(100, target ? (val / target) * 100 : 0));
    return '<div class="bar-row"><div class="k">' + k + '</div>' +
      '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="v">' + val + '</div></div>';
  }
  function render() {
    var el = document.getElementById('ha-dashboard');
    if (!el || !window.HA) return;
    var ym = el.getAttribute('data-month') || (new Date()).toISOString().slice(0, 7);
    var s = HA.monthSummary(ym);
    var dim = daysInMonth(ym);
    var quizTotal = TOPICS.reduce(function (a, t) { return a + (s.quizzes[t.key] || 0); }, 0);

    var html = '';
    html += '<div class="dash-grid">';
    html += '<div class="metric"><div class="num">' + s.daysAccessed + '<span style="font-size:20px;color:var(--muted)">/' + dim + '</span></div><div class="lbl">접속한 날</div><div class="sub">이번 달 방문 일수</div></div>';
    html += '<div class="metric"><div class="num">' + s.totalVisits + '</div><div class="lbl">총 접속</div><div class="sub">누적 열람 횟수</div></div>';
    html += '<div class="metric"><div class="num">' + s.streak + '</div><div class="lbl">연속 접속</div><div class="sub">오늘 기준 연속 일</div></div>';
    html += '<div class="metric"><div class="num">' + quizTotal + '</div><div class="lbl">퀴즈/학습</div><div class="sub">3개 영역 합계</div></div>';
    html += '</div>';

    html += '<div class="bars">';
    TOPICS.forEach(function (t) { html += bar(t.label, s.quizzes[t.key] || 0, t.target); });
    html += '</div>';

    html += '<div class="dash-feedback"><strong>이번 달 피드백</strong><br>' + feedback(s, dim) + '</div>';
    html += '<div class="dash-note">* 이 수치는 <strong>이 기기의 브라우저</strong>에만 저장됩니다(localStorage). 다른 기기와 동기화되지 않으며, 브라우저 데이터를 지우면 초기화됩니다.' +
      (s.since ? ' 측정 시작: ' + s.since + '.' : '') + '</div>';

    el.innerHTML = html;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
