/* The Seed · nav.js — 현재 페이지에 해당하는 상단 메뉴탭을 활성 표시(.is-active) */
(function () {
  function dir(p) { p = p.replace(/\/index\.html$/, '/'); return p.substring(0, p.lastIndexOf('/') + 1); }
  var here = dir(location.pathname);
  var links = document.querySelectorAll('nav a');
  var matched = false;
  links.forEach(function (a) {
    if (dir(a.pathname) === here) { a.classList.add('is-active'); a.setAttribute('aria-current', 'page'); matched = true; }
  });
  /* 데일리 아카이브 등 하위 파일에서 폴더가 안 맞으면, 같은 섹션 폴더 첫 탭을 활성화 */
  if (!matched) {
    var seg = here.replace(/\/$/, '').split('/').pop();
    links.forEach(function (a) {
      if (!matched && a.getAttribute('href').indexOf(seg + '/') > -1) { a.classList.add('is-active'); a.setAttribute('aria-current', 'page'); matched = true; }
    });
  }
})();
