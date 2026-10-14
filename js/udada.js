/* The Seed · udada.js — 주간 리서치 아이디어 레이더 렌더러
   data/udada-ideas.json을 읽어 #udada-ideas에 최신순 카드로 렌더. (주간 스케줄 작업이 json을 갱신) */
(function () {
  var el = document.getElementById('udada-ideas');
  if (!el) return;
  function esc(s){return String(s==null?'':s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
  var depth = location.pathname.replace(/\/[^/]*$/, '/').split('/').filter(Boolean).length; // 0=root, 1=한 폴더 깊이
  var base = el.getAttribute('data-src') || (depth >= 1 ? '../data/udada-ideas.json' : 'data/udada-ideas.json');
  fetch(base).then(function(r){return r.json();}).then(function(data){
    var items=(data.ideas||[]).slice().sort(function(a,b){return a.date<b.date?1:(a.date>b.date?-1:0);});
    if(!items.length){el.innerHTML='<div class="empty">아직 수집된 아이디어가 없습니다.</div>';return;}
    el.innerHTML='<div class="idea-grid">'+items.slice(0,12).map(function(it){
      return '<div class="idea">'+
        '<div class="src">'+esc(it.region)+' · '+esc(it.category)+'</div>'+
        '<h4>'+esc(it.title)+'</h4>'+
        '<p>'+esc(it.summary)+'</p>'+
        '<div class="facts"><b>'+esc(it.date)+'</b></div>'+
        (it.url?'<a class="idea-link" href="'+esc(it.url)+'" target="_blank" rel="noopener">원문 보기 →</a>':'')+
        '</div>';
    }).join('')+'</div>'+
    '<div class="dash-note" style="margin-top:12px">매주 유럽·미국 ESG·청년 캠페인·YouTube/IG 트렌드를 자동 검색해 갱신됩니다. 최종 갱신: '+esc(data.updated||'')+'.</div>';
  }).catch(function(){el.innerHTML='<div class="empty">아이디어를 불러오지 못했습니다.</div>';});
})();
