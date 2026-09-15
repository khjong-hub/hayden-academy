/* HAYDEN ACADEMY · tracker.js
   개인 활용도(접속·퀴즈) 측정 엔진. 데이터는 이 브라우저의 localStorage에만 저장된다.
   (기기별 저장 — 다른 기기/브라우저와 동기화되지 않으며, 브라우저 데이터 삭제 시 초기화됨) */
(function () {
  var KEY = 'ha-metrics-v1';
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(m) { try { localStorage.setItem(KEY, JSON.stringify(m)); } catch (e) {} }
  function ensure(m) { m.visits = m.visits || {}; m.quizzes = m.quizzes || {}; return m; }

  var API = {
    /* 하루 접속(페이지 열람) 기록 — 같은 날 여러 번 열면 누적 */
    logVisit: function () {
      var m = ensure(load()), t = today();
      m.visits[t] = (m.visits[t] || 0) + 1;
      m.lastVisit = t;
      if (!m.since) m.since = t;
      save(m);
      return m.visits[t];
    },
    /* 섹션 퀴즈/학습 완료 기록. topic: 'english' | 'faith' | 'economy' 등 */
    logQuiz: function (topic) {
      var m = ensure(load()), t = today();
      m.quizzes[topic] = m.quizzes[topic] || {};
      m.quizzes[topic][t] = (m.quizzes[topic][t] || 0) + 1;
      save(m);
      return m.quizzes[topic][t];
    },
    get: load,
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} },
    /* 특정 월(YYYY-MM, 기본=이번 달) 요약 */
    monthSummary: function (ym) {
      var m = ensure(load());
      ym = ym || today().slice(0, 7);
      var days = {}, totalVisits = 0;
      Object.keys(m.visits).forEach(function (d) {
        if (d.slice(0, 7) === ym) { days[d] = 1; totalVisits += m.visits[d]; }
      });
      var quizzes = {};
      Object.keys(m.quizzes).forEach(function (topic) {
        var c = 0, days2 = m.quizzes[topic];
        Object.keys(days2).forEach(function (d) { if (d.slice(0, 7) === ym) c += days2[d]; });
        quizzes[topic] = c;
      });
      /* 오늘 기준 연속 접속일 */
      var streak = 0, dt = new Date();
      for (;;) {
        var ds = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
        if (m.visits[ds]) { streak++; dt.setDate(dt.getDate() - 1); } else break;
      }
      return {
        month: ym,
        daysAccessed: Object.keys(days).length,
        totalVisits: totalVisits,
        quizzes: quizzes,
        streak: streak,
        since: m.since || null
      };
    }
  };
  window.HA = API;
})();
