/* The Seed · course.js — 수료형 코스 엔진
   .course[data-ns] 안의 .lesson[data-i]을 펼쳐 학습하고, '이 과목 이수 완료'(.lesson-done) 버튼으로 수료 체크.
   진행률은 .progress-fill/.progress-label에, 스케줄표의 .sched-row[data-i]에도 반영. localStorage: ha-course-<ns> (기기별). */
(function () {
  function key(ns) { return 'ha-course-' + ns; }
  function load(ns) { try { return JSON.parse(localStorage.getItem(key(ns))) || {}; } catch (e) { return {}; } }
  function save(ns, s) { try { localStorage.setItem(key(ns), JSON.stringify(s)); } catch (e) {} }

  document.querySelectorAll('.course').forEach(function (c) {
    var ns = c.getAttribute('data-ns') || 'course';
    var lessons = Array.prototype.slice.call(c.querySelectorAll('.lesson'));
    var schedRows = Array.prototype.slice.call(c.querySelectorAll('.sched-row'));
    var fill = c.querySelector('.progress-fill');
    var label = c.querySelector('.progress-label');
    var state = load(ns);

    function update() {
      var done = 0;
      lessons.forEach(function (l) {
        var i = l.getAttribute('data-i');
        var btn = l.querySelector('.lesson-done');
        if (state[i]) {
          l.classList.add('done'); done++;
          if (btn) { btn.textContent = '이수 완료됨 ✓'; btn.classList.add('done'); }
        } else {
          l.classList.remove('done');
          if (btn) { btn.textContent = btn.getAttribute('data-label') || '이 과목 이수 완료'; btn.classList.remove('done'); }
        }
      });
      schedRows.forEach(function (r) { r.classList.toggle('done', !!state[r.getAttribute('data-i')]); });
      var pct = lessons.length ? Math.round(done / lessons.length * 100) : 0;
      if (fill) fill.style.width = pct + '%';
      if (label) label.textContent = done + ' / ' + lessons.length + ' 이수 · ' + pct + '%';
    }
    lessons.forEach(function (l) {
      var btn = l.querySelector('.lesson-done');
      if (btn) btn.addEventListener('click', function () {
        var i = l.getAttribute('data-i');
        if (state[i]) delete state[i]; else state[i] = 1;
        save(ns, state); update();
      });
    });
    update();
  });
})();
