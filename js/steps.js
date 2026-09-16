/* The Seed · steps.js — 섹션별 실행 진행률 트래커
   .steptrack[data-ns="..."] 안의 .step[data-i]를 클릭하면 완료 토글 + 진행률 저장(localStorage, 기기별).
   진행률은 .progress-fill(막대) / .progress-label(텍스트)에 반영. */
(function () {
  function key(ns) { return 'ha-steps-' + ns; }
  function load(ns) { try { return JSON.parse(localStorage.getItem(key(ns))) || {}; } catch (e) { return {}; } }
  function save(ns, s) { try { localStorage.setItem(key(ns), JSON.stringify(s)); } catch (e) {} }

  document.querySelectorAll('.steptrack').forEach(function (track) {
    var ns = track.getAttribute('data-ns') || 'default';
    var steps = Array.prototype.slice.call(track.querySelectorAll('.step'));
    var fill = track.querySelector('.progress-fill');
    var label = track.querySelector('.progress-label');
    var state = load(ns);

    function update() {
      var done = 0;
      steps.forEach(function (st) {
        var i = st.getAttribute('data-i');
        if (state[i]) { st.classList.add('done'); done++; } else { st.classList.remove('done'); }
      });
      var pct = steps.length ? Math.round(done / steps.length * 100) : 0;
      if (fill) fill.style.width = pct + '%';
      if (label) label.textContent = done + ' / ' + steps.length + ' 완료 · ' + pct + '%';
    }
    steps.forEach(function (st) {
      st.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        var i = st.getAttribute('data-i');
        if (state[i]) delete state[i]; else state[i] = 1;
        save(ns, state);
        update();
      });
    });
    update();
  });
})();
