/* 문제 전용 자료. 설명 화면의 정답 이름·풀이 문장을 재사용하지 않는다. */
(function () {
  'use strict';
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text=(x,y,s,extra='')=>`<text x="${x}" y="${y}" ${extra}>${esc(s)}</text>`;
  const line=(d,color='#38545a',width=2,extra='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" ${extra}/>`;
  const land=d=>`<path d="${d}" fill="#e0dbc1" stroke="#717c61" stroke-width="2"/>`;
  const mark=(x,y,s)=>`<circle cx="${x}" cy="${y}" r="15" fill="#174f59"/>${text(x,y+5,s,'fill="white" text-anchor="middle" font-weight="700"')}`;
  const arrow=(x,y,tx,ty)=>line(`M${x} ${y}L${tx} ${ty}`,'#256f91',3,'marker-end="url(#examArrow)"');
  const figures={
    relief:{alt:'서해에서 동해로 이어지는 단면. 서쪽 A 사면은 길고 완만하며 동쪽 B 사면은 짧고 급하다.',
      body:`<rect x="14" y="175" width="492" height="28" fill="#cee7ed"/>${land('M35 175L90 164 158 151 227 137 302 110 389 55 438 150 481 175Z')}${mark(193,101,'A')}${mark(458,105,'B')}${text(25,225,'서해')}${text(453,225,'동해')}`,
      note:'높이·거리 비율을 과장한 모식도'},
    meander:{alt:'하천이 위에서 아래로 흐르며 오른쪽으로 굽는다. A는 굽이의 바깥쪽 물가, B는 안쪽 물가에 표시되어 있다.',
      body:`<rect x="18" y="18" width="484" height="235" fill="#eceddc"/>${line('M150 20C150 75 370 48 370 125S150 188 150 248','#95cddd',74)}${line('M150 20C150 75 370 48 370 125S150 188 150 248','#4d8fa4',1)}${arrow(170,49,223,67)}${arrow(284,193,230,201)}${mark(414,125,'A')}${mark(318,125,'B')}${line('M399 125H405')}${line('M333 125H335')}${text(29,33,'평면도')}`,
      note:'화살표는 하천의 흐름 방향'},
    floodplain:{alt:'범람원 단면. 중앙 하천 가까이 약간 높은 곳이 A, 그 바깥 낮은 곳이 B이다.',
      body:`${land('M15 158H150L222 112 254 132 267 191H307L320 132 350 112 416 158H505V227H15Z')}<path d="M259 153H315L307 191H267Z" fill="#9bd4e4"/>${mark(224,78,'A')}${mark(92,124,'B')}${text(266,248,'하천')}${arrow(339,84,437,131)}`,
      note:'화살표는 범람수의 이동 방향 · 높이 비율 과장'},
    coast:{alt:'A는 파도가 닿는 절벽과 그 앞 평탄면의 단면도. B는 모래 둑이 만 입구를 막고 하천이 흘러드는 평면도.',
      body:`${mark(39,31,'A')}${text(62,37,'단면도')}<rect x="18" y="156" width="220" height="70" fill="#c9e6ed"/>${land('M18 82H90L95 173H174L226 192V226H18Z')}${arrow(205,148,114,148)}${text(148,211,'바다')}${mark(294,31,'B')}${text(318,37,'평면도')}<rect x="276" y="58" width="226" height="168" fill="#c9e6ed"/>${land('M276 58H408L384 89 412 120 383 160 408 226H276Z')}<ellipse cx="359" cy="141" rx="29" ry="49" fill="#b3d9e4"/>${line('M394 82L394 201','#d1b679',12)}${line('M283 90Q312 96 334 123','#287fa0',4)}${arrow(296,95,329,118)}${text(447,146,'바다')}${text(287,248,'육지')}`,
      note:'A: 파랑 진행 방향 · B: 하천 유입 방향'},
    karst:{alt:'지표의 움푹 팬 A로 물이 스며들고, 층이 있는 기반암 속에 빈 공간 B가 나타나는 단면도.',
      body:`${land('M18 82H119Q154 145 193 82H502V230H18Z')}${[122,161,200].map(y=>line(`M20 ${y}H500`,'#c3b89c')).join('')}<path d="M47 211Q57 147 109 179T197 167T314 178T457 156L480 211Z" fill="#fffdf6" stroke="#7f877c"/>${mark(225,51,'A')}${line('M212 60L171 98')}${mark(285,189,'B')}${arrow(150,21,155,91)}${text(326,55,'물이 스며듦')}`,
      note:'층과 지하 공간의 크기를 단순화한 단면'},
    foehn:{alt:'해발 0m의 A는 20도. 1000m부터 응결하여 2000m 산정까지 상승한 뒤 해발 0m의 B로 하강한다.',
      body:`${land('M27 198L260 43 493 198Z')}${line('M34 123H210','#9faeac',1,'stroke-dasharray="5 4"')}${text(24,115,'1,000m')}${text(280,43,'2,000m')}${arrow(75,159,166,99)}${arrow(194,79,237,48)}${arrow(296,63,441,159)}${mark(44,202,'A')}${mark(480,202,'B')}${text(17,234,'0m · 20℃')}${text(452,234,'0m')}${text(173,257,'1,000m에서 응결 시작','text-anchor="middle"')}`,
      note:'상승: 응결 전 1℃/100m, 응결 후 0.5℃/100m 냉각. 하강: 1℃/100m 가열. 응결수는 강수로 제거된다고 가정.'},
    oldmap:{alt:'굽은 도로를 따라 방점 5개가 이어져 있고 양 끝 방점은 A와 B이다. 방점 간 도로 거리는 10리다.',
      body:`${line('M45 177Q99 176 140 122T256 108T360 154T471 89','#5b6967',4)}${[[45,177],[147,115],[261,110],[370,149],[471,89]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="#243d43"/>`).join('')}${text(32,208,'A')}${text(465,73,'B')}${text(111,50,'도로 위 방점 · 10리 간격')}`,
      note:'거리 비율을 재현한 원본 지도는 아닌 기호 판독 모형'},
    vegetation:{alt:'같은 산의 두 식생대 경계가 이전에는 1200m, 이후에는 1400m이다. 정상 고도는 1800m로 같다.',
      body:`${[0,260].map((dx,i)=>`<g transform="translate(${dx},0)">${land('M18 216L130 45 242 216Z')}${line(i?'M86 112H174':'M65 145H195','#a85032',3)}${text(131,28,i?'이후':'이전','text-anchor="middle"')}${text(i?86:65,i?103:136,i?'1,400m':'1,200m')}${text(133,65,'1,800m','font-size="13"')}</g>`).join('')}`,
      note:'붉은 선은 같은 두 식생대의 경계 · 실제 관측 자료가 아닌 비교 모형'}
  };
  function render(host,id){
    const f=figures[id];if(!f)throw new Error('Unknown exam figure: '+id);
    host.classList.remove('has-comparison-table');
    host.innerHTML=`<figure class="exam-figure"><svg viewBox="0 0 520 275" role="img" aria-label="${esc(f.alt)}"><defs><marker id="examArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0 0L7 3L0 6" fill="none" stroke="#256f91" stroke-width="1.5"/></marker></defs>${f.body}</svg><figcaption>${esc(f.note)}</figcaption></figure>`;
  }
  function visualKind(q){return q.figure?'figure':q.diagram?'diagram':q.graph?'graph':q.showMap===false?'none':'map';}
  window.KoreaExamFigures={render,visualKind,ids:Object.keys(figures)};
})();
