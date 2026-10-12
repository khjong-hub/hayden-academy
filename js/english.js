/* The Seed · english.js — 연속 영어 커리큘럼 렌더러
   data/english.json을 읽어:
   - #eng-today : 그 날짜(data-date 있으면 그 날, 없으면 오늘)의 오늘의 수업 + 어제 복습
   - #eng-curriculum : 전체 커리큘럼(테마별) + 이수 체크(localStorage) + 진행률
   날짜 기반 인덱스라 데일리 아카이브도 그 날짜의 수업을 정확히 보여준다(data-date 사용). */
(function () {
  function esc(s){return String(s==null?'':s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
  function parseDate(s){ if(!s) return new Date(); var p=s.split('-'); return new Date(Date.UTC(+p[0],+p[1]-1,+p[2])); }
  function dayIndex(date, epoch, n){
    var a=Date.UTC(date.getUTCFullYear?date.getUTCFullYear():date.getFullYear(), date.getUTCMonth?date.getUTCMonth():date.getMonth(), date.getUTCDate?date.getUTCDate():date.getDate());
    var e=parseDate(epoch); var eU=Date.UTC(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate());
    var d=Math.floor((a-eU)/86400000);
    return ((d % n)+n)%n;
  }
  function todayUTC(){ var d=new Date(); return new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())); }

  var path = (location.pathname.indexOf('/daily/')>-1 || location.pathname.indexOf('/english/')>-1 || location.pathname.indexOf('/weekly/')>-1 || location.pathname.indexOf('/monthly/')>-1) ? '../data/english.json' : 'data/english.json';

  fetch(path).then(function(r){return r.json();}).then(function(data){
    var L=data.lessons||[], N=L.length, epoch=data.epoch||'2026-10-13';

    /* ---- 오늘의 수업 ---- */
    var box=document.getElementById('eng-today');
    if(box && N){
      var dAttr=box.getAttribute('data-date');
      var dt=dAttr?parseDate(dAttr):todayUTC();
      var idx=dayIndex(dt, epoch, N);
      var t=L[idx], y=L[(idx-1+N)%N];
      box.innerHTML =
        '<div class="eng-seq">DAY '+t.n+' / '+N+' · <b>'+esc(t.theme)+'</b></div>'+
        '<div class="eng-expr">“'+esc(t.expr)+'”</div>'+
        '<div class="eng-kr">'+esc(t.kr)+'</div>'+
        '<div class="eng-line"><b>예문</b> '+esc(t.ex)+'</div>'+
        '<div class="eng-line"><b>내 문장</b> '+esc(t.mine)+'</div>'+
        '<div class="eng-line"><b>바꿔 말하기</b> '+esc(t.drill)+'</div>'+
        '<div class="eng-review"><b>어제 복습</b> “'+esc(y.expr)+'” — '+esc(y.kr)+'</div>'+
        (document.getElementById('eng-curriculum')?'':'<div class="eng-more"><a href="'+(location.pathname.indexOf('/english/')>-1?'':'../english/')+'index.html">전체 커리큘럼 '+N+'강 보기 →</a></div>');
    }

    /* ---- 전체 커리큘럼 ---- */
    var cur=document.getElementById('eng-curriculum');
    if(cur && N){
      var KEY='ha-eng-done';
      var done={}; try{done=JSON.parse(localStorage.getItem(KEY))||{};}catch(e){}
      var todayIdx=dayIndex(todayUTC(), epoch, N);
      var byTheme={}; (data.themes||[]).forEach(function(th){byTheme[th]=[];});
      L.forEach(function(l){ (byTheme[l.theme]=byTheme[l.theme]||[]).push(l); });

      function draw(){
        var doneCount=Object.keys(done).filter(function(k){return done[k];}).length;
        var pct=Math.round(doneCount/N*100);
        var html='<div class="progress"><div class="progress-track"><div class="progress-fill" style="width:'+pct+'%"></div></div><span class="progress-label">'+doneCount+' / '+N+' 이수 · '+pct+'%</span></div>';
        (data.themes||Object.keys(byTheme)).forEach(function(th){
          var items=byTheme[th]||[]; if(!items.length)return;
          html+='<div class="eng-theme"><div class="eng-theme-h">'+esc(th)+'</div>';
          items.forEach(function(l){
            var isToday=(l.n-1)===todayIdx;
            html+='<div class="eng-row'+(done[l.n]?' done':'')+(isToday?' today':'')+'" data-n="'+l.n+'">'+
              '<button class="eng-check" aria-label="이수"></button>'+
              '<div class="eng-row-main"><div class="eng-row-expr">“'+esc(l.expr)+'”'+(isToday?' <span class="eng-tag">오늘</span>':'')+'</div>'+
              '<div class="eng-row-kr">'+esc(l.kr)+' · <span class="eng-row-ex">'+esc(l.ex)+'</span></div></div></div>';
          });
          html+='</div>';
        });
        cur.innerHTML=html;
        cur.querySelectorAll('.eng-row').forEach(function(row){
          row.querySelector('.eng-check').addEventListener('click',function(){
            var n=row.getAttribute('data-n');
            if(done[n])delete done[n];else done[n]=1;
            try{localStorage.setItem(KEY,JSON.stringify(done));}catch(e){}
            draw();
          });
        });
      }
      draw();
    }
  }).catch(function(){
    var box=document.getElementById('eng-today');
    if(box)box.innerHTML='<div class="eng-line">오늘의 수업을 불러오지 못했습니다.</div>';
  });
})();
