(function () {
  'use strict';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const colors = ['#176c78','#bb5934','#7153a2'];
  const text = (x,y,s,extra='') => `<text x="${x}" y="${y}" ${extra}>${esc(s)}</text>`;
  const badge = (x,y,s,i=0) => `<circle cx="${x}" cy="${y}" r="17" fill="${colors[i]}"/><text x="${x}" y="${y+6}" text-anchor="middle" fill="white" font-weight="800">${s}</text>`;
  const arrow = (x,y,tx,ty,c='#176c78') => {
    const a = Math.atan2(ty-y,tx-x), dx=Math.cos(a),dy=Math.sin(a);
    return `<path d="M${x} ${y}L${tx} ${ty}" fill="none" stroke="${c}" stroke-width="4"/><path d="M${tx-12*dx+6*dy} ${ty-12*dy-6*dx}L${tx} ${ty}L${tx-12*dx-6*dy} ${ty-12*dy+6*dx}" fill="none" stroke="${c}" stroke-width="3"/>`;
  };
  const path = (d,fill='#c9d5b1',stroke='#6f8666') => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
  const box = (x,y,w,h,fill='#e3eef0') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}"/>`;
  const house = (x,y) => `${path(`M${x} ${y}h20v20h-20z`,'#fff8e5','#916a4d')}${path(`M${x-4} ${y}l14 -12 14 12z`,'#b66f51','#916a4d')}`;
  // 비교 항목과 근거를 직접 읽는 자료. 사물의 축약 그림으로 개념을 대신하지 않는다.
  const comparisonTables = {
    transport: { title: '국내 육상 교통수단', rows: [
      ['연결하는 곳', '창고·상점 등 다양한 목적지', '정해진 역·화물 터미널'],
      ['이동 경로', '도로망에서 경로 선택', '철도 노선 이용'],
      ['주요 특징', '문 앞까지 직접 연결', '많은 사람·화물 수송']
    ] },
    port: { title: '산업별 입지 조건', rows: [
      ['주요 투입 요소', '철광석·원유', '전문 인력·정보'],
      ['연결되는 시설', '항만·수입 원료', '기업 본사·고객'],
      ['입지의 이점', '대량 운송비 절감', '대면 접촉·정보 교류']
    ] },
    farming: { title: '농업 지역의 생산·출하 조건', rows: [
      ['입지', '높은 해발 고도', '대도시 주변'],
      ['활용하는 조건', '여름의 서늘한 기온', '소비 시장 접근성'],
      ['생산·출하', '여름철 채소 출하', '신선한 농산물 공급']
    ] },
    energy: { title: '공업·발전 시설의 입지 조건', rows: [
      ['시설', '시멘트 공장', '원자력 발전소'],
      ['입지', '석회석 산지 주변', '해안'],
      ['필요한 조건', '무거운 원료 확보', '풍부한 냉각수']
    ] },
    regions: { title: '권역별 산업 분포', rows: [
      ['농업 지역', '호남평야·나주평야', '낙동강 유역 평야'],
      ['해안 공업', '광양 제철·여수 석유화학', '포항 제철·울산 자동차'],
      ['내륙 산업', '광주 자동차', '구미 전자·대구 섬유']
    ] },
    compare: { title: '고지도와 지리지의 자료 특징', rows: [
      ['표현 방식', '지도', '글로 쓴 지리지'],
      ['제작·구성', '목판 인쇄·분첩', '살기 좋은 곳의 조건'],
      ['자료의 단서', '10리마다 방점', '지리·생리·인심·산수']
    ] }
  };
  function comparisonTable(kind, highlight) {
    const data = comparisonTables[kind];
    const cellClass = index => index === highlight ? ' class="table-evidence"' : '';
    return `<table class="concept-table"><caption>${esc(data.title)}</caption><colgroup><col class="criteria"><col><col></colgroup><thead><tr><th scope="col">비교 기준</th><th scope="col">A</th><th scope="col">B</th></tr></thead><tbody>${data.rows.map(row=>`<tr><th scope="row">${esc(row[0])}</th><td${cellClass(1)}>${esc(row[1])}</td><td${cellClass(2)}>${esc(row[2])}</td></tr>`).join('')}</tbody></table>`;
  }
  function art(kind) {

    switch (kind) {
      case 'hazards': return `${box(15,57,225,126)}${box(280,57,225,126,'#f3e5d8')}${text(40,88,'하천 주변 저지대')}${path('M30 144Q76 114 125 148T225 142','none','#388daf')}${house(120,111)}${text(317,88,'해안 · 태풍 진로')}${arrow(327,165,427,115,colors[1])}${badge(130,27,'A')}${badge(391,27,'B',1)}${text(50,220,'침수 · 범람')}${text(308,220,'강풍 · 호우 · 해일')}`;
      case 'warming': return `${box(30,56,210,157)}${text(70,85,'더 높은 위도')}${arrow(135,180,135,111)}${text(67,240,'수평적인 이동')}${path('M275 213L395 57 510 213Z')}${path('M320 155H463','none','#176c78')}${path('M348 119H438','none','#b65a35')}${arrow(484,163,461,112,colors[1])}${text(315,240,'식생 경계의 상승')}`;
      case 'vegetation': return `${path('M33 209L252 29 488 209Z','#c0cbb4')}${path('M33 209L119 138H395L488 209Z','#789d61')}${path('M119 138L194 77H315L395 138Z','#9eb47a')}${text(215,187,'난대림')}${text(218,125,'온대림')}${text(219,69,'냉대림')}${arrow(43,137,43,49)}${text(13,27,'고도 ↑')}${text(100,241,'한라산의 수직 분포를 단순화한 모형')}`;
      case 'services': return `<circle cx="142" cy="130" r="88" fill="#d4e8e9" stroke="#176c78" stroke-width="3"/><circle cx="142" cy="130" r="48" fill="#edcbb4" stroke="#b65a35" stroke-width="3"/>${badge(142,130,'●')}${text(260,96,'안쪽: 최소 요구 범위')}${text(260,145,'바깥: 재화 도달 범위')}${text(261,198,'수요 충족 → 기능 유지')}`;
      case 'renewal': return `${box(15,55,224,150)}${box(281,55,224,150,'#f0e7d9')}${[45,95,145,195].map(x=>box(x,100,27,85,'#8ba3aa')).join('')}${[315,365,415,465].map(x=>house(x,158)).join('')}${badge(127,27,'A')}${badge(393,27,'B',1)}${text(53,237,'새로운 건물로 정비')}${text(318,237,'기존 건물 보완')}`;
      case 'seafloor': return `${box(12,65,230,155,'#cae6ed')}${box(276,65,232,155,'#559ac4')}${path('M12 85L65 108 150 121 242 124V220H12Z','#ddd3b2')}${path('M276 80L300 96 331 192 425 203 508 192V220H276Z','#ddd3b2')}${text(19,47,'황해: 넓은 대륙붕')}${text(282,47,'동해: 깊은 분지')}${badge(119,168,'A')}${badge(402,142,'B',1)}${text(31,240,'수심·거리 비율을 과장한 단면 모형')}`;
      case 'glacial': return `${box(10,70,235,140,'#f3f3ea')}${box(275,70,235,140,'#f3f3ea')}${path('M10 78L65 100 106 132 167 164 245 187V210H10Z','#c8d4b0')}${path('M275 78L330 100 371 132 432 164 510 187V210H275Z','#c8d4b0')}${path('M167 164H245V187Z','#8fc5db','#3e8aaa')}${path('M330 100H510V187L432 164 371 132Z','#8fc5db','#3e8aaa')}${text(18,35,'빙기: 낮은 해수면')}${text(280,35,'후빙기: 해수면 상승')}${badge(118,73,'A')}${badge(449,73,'B',1)}${text(20,238,'육지 확대 · 하류 침식')}${text(276,238,'골짜기 침수 · 하류 퇴적')}`;
      case 'rocks': return `${box(15,55,220,150,'#d8d7cf')}${box(285,55,220,150,'#e2d8be')}${[85,115,145,175].map(y=>path(`M285 ${y}h220`,'none','#a69879')).join('')}${[45,95,145,195].map(x=>path(`M${x} 67l14 125`,'none','#a3a39d')).join('')}${badge(125,30,'A')}${badge(395,30,'B',1)}${text(53,237,'관입 · 절리와 풍화')}${text(331,237,'퇴적 · 층리와 용식')}`;
      case 'soils': return `${box(24,50,206,52,'#b46e4b')}${box(24,102,206,94,'#d5cebd')}${box(290,50,206,52,'#55413a')}${box(290,102,206,94,'#aaa49b')}${badge(125,26,'A')}${badge(393,26,'B',1)}${text(80,154,'석회암')}${text(344,154,'화산 물질')}${text(47,233,'모암이 풍화된 토양')}${text(316,233,'화산 물질의 영향')}`;
      case 'development': return `${box(15,80,125,72)}${box(370,80,135,72,'#efe5d4')}${text(37,120,'주변 지역')}${text(391,120,'성장 거점')}${arrow(155,95,351,95,colors[1])}${arrow(351,151,155,151)}${text(198,68,'인구·자본 유출')}${text(179,191,'수요·기술·고용 확산')}${text(181,225,'흐름과 결과를 비교')}`;
      case 'migration': return `${box(164,72,190,100)}${text(208,129,'지역 인구')}${arrow(20,108,143,108)}${arrow(373,108,495,108,colors[1])}${text(45,79,'전입')}${text(407,79,'전출')}${text(126,220,'순이동 = 전입 인구 − 전출 인구')}`;
      case 'relief': return `${box(12,173,496,44,'#cce6ee')}${path('M40 173L90 166 150 149 215 145 275 119 332 106 390 51 434 147 465 173Z')}${text(24,228,'서해')}${text(455,228,'동해')}${text(344,28,'산맥·분수계')}${arrow(345,122,150,164)}${arrow(412,93,455,161,colors[1])}${badge(185,107,'A')}${badge(455,99,'B',1)}`;
      case 'river': return `${path('M20 196L86 39 147 106 196 78 266 148 350 190 490 205Z')}${path('M91 83Q129 93 128 128T199 151T248 165T321 187L390 211','none','#2586b1')}${box(352,195,156,43,'#cce6ee')}${path('M328 184L439 231 367 231Z','#e1c98e','#c1a671')}${arrow(188,103,315,160)}${badge(142,80,'A')}${badge(403,171,'B',1)}${text(22,232,'산지')}${text(454,223,'바다')}`;
      case 'floodplain': return `${path('M12 155L155 155 226 113 260 133 270 191 310 191 320 133 352 113 416 155 508 155V218H12Z','#ddcd9f','#a89468')}${path('M263 151H317L310 191H270Z','#91cedf','#4c9eb9')}${house(213,95)}${path('M67 143h64m-64 -7h64m-64 -7h64','none','#77955e')}${badge(232,57,'A')}${badge(97,85,'B',1)}${text(266,233,'하천')}${text(178,34,'상대적으로 높음')}${text(35,57,'낮은 땅')}${text(355,200,'범람 방향')}${arrow(325,95,413,124,'#3d87aa')}`;
      case 'coast': return `${box(12,45,155,165,'#cce6ee')}${box(182,45,155,165,'#cce6ee')}${box(352,45,155,165,'#cce6ee')}${path('M12 45H85Q106 95 86 148L105 210H12Z')}${path('M78 95Q101 121 79 146Q57 120 78 95','#cce6ee','#87b3bd')}${path('M182 45H237L269 88 247 120 282 163 250 210H182Z')}${path('M242 62L293 91 274 124 312 167 270 210H250L282 163 247 120 269 88Z','#dec991','#bcad81')}${path('M352 45H437L405 77 452 91 411 123 454 150 399 174 431 210H352Z')}${[[470,70],[467,121],[480,181],[443,192]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="#a9bb93"/>`).join('')}${badge(88,23,'A')}${badge(259,23,'B',1)}${badge(430,23,'C',2)}${text(55,236,'단조로움')}${text(218,236,'넓은 갯벌')}${text(390,236,'많은 섬')}`;
      case 'volcano': return `${path('M18 189Q100 175 144 129Q192 177 247 189Z')}${path('M277 189L372 68 391 93 413 68 503 189Z','#d6c7ae','#8e7a62')}${badge(130,78,'A')}${badge(391,30,'B',1)}`;
      case 'karst': return `${path('M15 77H125Q159 143 195 77H505V218H15Z','#e3d9bd','#b3a582')}${[40,80,120,200,240,280,320,360,400,440,480].map(x=>`<path d="M${x} 88v35m-20 0h40m-20 0v30" stroke="#c2b79c" fill="none"/>`).join('')}${path('M67 198Q78 138 128 172T207 158T317 173T452 149L475 198Z','#f6fafb','#8b9182')}${arrow(166,25,166,88,'#398bad')}${badge(224,40,'A')}${badge(287,183,'B',1)}${text(335,66,'물이 스며듦')}`;
      case 'basin': return `${path('M13 206L62 74 104 171H172L217 65 250 206Z')}${path('M277 206L321 139H417L449 80 505 206Z')}${badge(137,130,'A')}${badge(369,90,'B',1)}${text(58,233,'산으로 둘러싸인 바닥')}${text(300,233,'높은 곳의 완만한 땅')}`;
      case 'temperature': {
        const a=[-5,-2,5,12,18,23,26,27,21,14,6,-2],b=[2,3,7,12,17,21,24,25,21,16,10,5];
        const x=i=>48+i*39,y=t=>202-(t+10)*4.5;
        return `${[-10,0,10,20,30].map(t=>`<path d="M48 ${y(t)}H480" stroke="#d7e0dd"/>${text(15,y(t)+5,String(t))}`).join('')}${text(488,24,'℃')}${[a,b].map((v,i)=>`<polyline points="${v.map((t,n)=>`${x(n)},${y(t)}`).join(' ')}" fill="none" stroke="${colors[i]}" stroke-width="4" ${i?'stroke-dasharray="7 4"':''}/>`).join('')}${[0,3,6,9,11].map(i=>text(x(i)-9,231,`${i+1}월`)).join('')}${badge(88,74,'A')}${badge(310,166,'B',1)}${text(112,80,'실선')}${text(334,172,'점선')}`;
      }
      case 'monsoon': return `${box(20,56,190,132,'#d9dec4')}${box(310,56,190,132,'#cce6ee')}${text(70,90,'대륙')}${text(377,90,'바다')}${arrow(180,115,343,115)}${arrow(343,163,180,163,colors[1])}${badge(260,70,'A')}${badge(260,208,'B',1)}`;
      case 'foehn': return `${path('M28 217L260 80 492 217Z')}${arrow(63,144,210,54)}${arrow(293,54,457,145,colors[1])}${box(105,29,100,38,'#d7e5ea')}${text(129,55,'구름')}${[120,141,162,183].map(x=>path(`M${x} 75l-9 16`,'none','#368bb2')).join('')}${badge(91,194,'A')}${badge(429,194,'B',1)}${text(28,109,'상승·냉각')}${text(374,81,'하강·가열')}`;
      case 'heat': return `${[45,83,123,167,203,240,276,316,359,402,444].map((x,i)=>box(x,210-[22,26,40,68,82,98,83,72,44,28,22][i],24,[22,26,40,68,82,98,83,72,44,28,22][i],'#bacbd0')).join('')}${path('M26 126Q101 132 160 83T262 50Q326 49 374 92T498 126','none','#b65a35')}${badge(263,27,'A')}${badge(67,82,'B',1)}${text(28,235,'교외')}${text(226,235,'도시 중심')}${text(457,235,'교외')}`;
      case 'waters': return `${box(15,53,85,139,'#d7dec0')}${box(100,53,125,139,'#a1d3df')}${box(225,53,280,139,'#daedf1')}${text(30,128,'육지')}${badge(163,114,'A')}${badge(365,114,'B',1)}${text(81,30,'기선')}${text(179,224,'12해리')}${text(388,224,'200해리 이내')}${arrow(100,40,490,40)}${path('M100 45V200','none','#344f56')}`;
      case 'longitude': return `${box(20,40,480,165)}${path('M140 40V205M366 40V205','none','#698e98')}${badge(140,95,'A')}${badge(366,95,'B',1)}${text(88,158,'동경 127.5°')}${text(321,158,'동경 135°')}${text(151,231,'360° ÷ 24시간 = 15°/시간')}`;
      case 'statmaps': return `${[0,1,2,3].map(i=>box(35+i%2*80,50+Math.floor(i/2)*70,70,60,['#d9eeeb','#a8d2cb','#6dadab','#246d78'][i])).join('')}${badge(215,115,'A')}${[[322,65],[460,70],[385,180]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="16" fill="#b5c8c6"/>`).join('')}${arrow(335,70,440,70)}${arrow(453,86,399,164,colors[1])}${path('M330 80L377 165','none','#176c78')}${badge(475,180,'B',1)}${text(33,225,'옅음 → 진함')}${text(317,225,'방향 + 굵기')}`;
      case 'flow': return `${box(20,65,174,130)}${box(326,65,174,130,'#f4e6d9')}${badge(107,40,'A')}${badge(413,40,'B',1)}${text(53,116,'일자리·교육')}${text(55,151,'기회 집중')}${text(362,116,'청장년층')}${text(366,151,'순유출')}${arrow(319,128,207,128)}${text(200,197,'인구 이동')}`;
      case 'pyramid': {
        // Each sex's bars are percentages of the whole population; each model sums to 100%.
        const vals=[[16,29,5],[6,29,15]],centers=[125,395],scale=2.6;
        return vals.map((v,i)=>`${badge(centers[i],25,String.fromCharCode(65+i),i)}${v.map((n,j)=>`<rect x="${centers[i]-n*scale}" y="${169-j*51}" width="${n*scale}" height="30" fill="${colors[i]}"/><rect x="${centers[i]+2}" y="${169-j*51}" width="${n*scale}" height="30" fill="${colors[i]}" opacity=".65"/>`).join('')}${path(`M${centers[i]} 60V206`,'none','#82969b')}${[-30,0,30].map(n=>text(centers[i]+n*scale,228,`${Math.abs(n)}%`,'text-anchor="middle"')).join('')}`).join('')+`${text(260,90,'65세+','text-anchor="middle"')}${text(260,141,'15~64','text-anchor="middle"')}${text(260,192,'0~14','text-anchor="middle"')}`;
      }
      case 'city': return `${box(30,76,160,135)}${[55,92,129].map((x,i)=>box(x,144-i*16,28,67+i*16,'#7e9da4')).join('')}${house(358,145)}${house(401,145)}${house(444,145)}${arrow(338,115,206,115)}${badge(110,38,'A')}${badge(403,38,'B',1)}${text(214,90,'낮의 통근')}${text(73,236,'업무·상업')}${text(378,205,'주거')}`;
      case 'village': return `${path('M15 153L75 50 143 153Z')}${path('M110 153L150 85 200 153Z')}${path('M20 219Q140 174 239 216','none','#3186aa')}${house(93,161)}${house(132,164)}${[0,1,2,3,4].map(i=>house(321+i%3*40,113+Math.floor(i/3)*45)).join('')}${badge(235,83,'A')}${badge(405,50,'B',1)}${text(30,239,'산·마을·하천')}${text(336,220,'가옥 분포')}`;
      case 'network': return `${[[82,75],[190,75],[135,177]].map(([x,y],i)=>`${box(x-47,y-23,94,46)}${text(x,y+5,['대학','연구소','기업'][i],'text-anchor="middle"')}`).join('')}${arrow(104,111,120,145)}${arrow(174,111,150,145)}${badge(30,30,'A')}${box(318,60,165,55)}${text(345,94,'수도권 공장')}${arrow(399,122,399,168,colors[1])}${text(363,204,'충청권')}${badge(485,30,'B',1)}`;
      case 'route': return `${path('M125 52V110L55 211M125 110L224 211','none','#a8465c')}${text(103,30,'서울')}${badge(125,110,'A')}${text(22,244,'목포')}${text(209,244,'부산')}${text(15,167,'호남')}${text(200,159,'경부')}${badge(410,27,'B',1)}${box(300,50,213,166)}${text(315,80,'두 지역 사이 이동 시간')}${text(329,120,'개선 전 80분')}${arrow(410,133,410,157)}${text(329,190,'개선 후 40분')}${text(312,246,'학습용 가상 자료')}`;
      case 'division': return `${box(25,65,145,140)}${box(187,65,145,140,'#efe5d4')}${box(349,65,145,140,'#e6dff1')}${text(70,116,'서울')}${text(232,116,'인천')}${text(396,116,'경기')}${arrow(320,159,80,159,colors[1])}${arrow(379,184,139,184,colors[1])}${path('M25 58V48H494V58','none',colors[0])}${badge(260,25,'A')}${badge(165,228,'B',1)}${text(193,237,'경계를 넘는 통근')}`;
      case 'north': return `${box(25,60,205,150)}${path('M200 90Q145 103 161 141T50 184','none','#3487a8')}${arrow(127,164,70,182)}${box(287,60,205,150,'#eae4d5')}${path('M303 179L350 82 376 134 415 80 480 179Z','#c1c9ac','#829070')}${badge(126,30,'A')}${badge(389,30,'B',1)}${text(45,235,'서해로 흐르는 하천')}${text(321,235,'북동부 산지·고원')}`;
      default: throw new Error(`Unknown study visual: ${kind}`);
    }
  }
  const chartNotes = {
    route: '고속 철도 연결도 · 거리 비율과 이동 시간은 학습용 모형',
    temperature: '월평균 기온 모형 · 두 선은 같은 ℃ 눈금 · 실제 관측값 아님',
    pyramid: '연령 3구간 비교 모형 · 왼쪽 남자 / 오른쪽 여자 · 전체 인구 중 비율(%) · 실제 통계 아님',
    heat: '밤의 상대적인 기온 분포 모형 · 높이·거리·기온의 실측값 아님',

  };
  const evidenceAreas = {"relief":[435,135,47,55],"river":[392,213,63,24],"floodplain":[228,123,46,40],"coast":[259,131,69,83],"volcano":[133,164,110,40],"karst":[282,177,195,28],"basin":[369,141,57,22],"temperature":[477,113,20,87],"monsoon":[261,164,94,22],"foehn":[387,102,85,64],"heat":[262,60,90,28],"waters":[355,125,124,61],"longitude":[366,124,87,62],"statmaps":[395,117,93,77],"flow":[265,129,70,27],"pyramid":[396,83,51,25],"city":[268,115,79,27],"village":[372,139,74,63],"port":[127,154,111,42],"network":[136,124,110,84],"farming":[355,181,61,53],"energy":[438,169,60,53],"transport":[130,160,108,48],"route":[125,110,23,23],"regions":[157,170,47,41],"division":[260,172,193,28],"north":[130,135,91,67],"compare":[126,130,91,80]};
  function render(host, lesson, options={}) {
    const hidden = options.quiz && !options.revealed;
    const note = chartNotes[lesson.kind] || '';
    const table = comparisonTables[lesson.kind];
    const requestedArea = options.area === null ? null : options.area || evidenceAreas[lesson.kind];
    const area = requestedArea;
    const emphasis = options.revealed && area ? `<ellipse cx="${area[0]}" cy="${area[1]}" rx="${area[2]}" ry="${area[3]}" fill="none" stroke="#24844c" stroke-width="3" stroke-dasharray="7 5"/>` : "";
    const caption = note || emphasis ? `<figcaption>${note}${note && emphasis ? " · " : ""}${emphasis ? "녹색 점선: 핵심 관찰 부분" : ""}</figcaption>` : "";
    host.classList.toggle("has-comparison-table", !!table);
    const figure = table ? comparisonTable(lesson.kind, options.revealed && area ? (area[0] < 260 ? 1 : 2) : 0) : `<svg viewBox="0 0 520 250" role="img" aria-label="${hidden?'A·B 비교 자료':esc(lesson.title)}"><title>${hidden?'A·B의 모양과 화살표, 아래 자료를 비교하세요.':esc(lesson.title)}</title>${art(lesson.kind)}${emphasis}</svg>${caption}`;
    host.innerHTML = `<figure class="concept-visual ${options.revealed?'is-revealed':''}">${figure}</figure>${hidden && table ? '' : `<div class="visual-comparison">${lesson.slots.map((s,i)=>`<div class="comparison-cell" style="--slot-color:${colors[i]}"><span class="comparison-letter">${String.fromCharCode(65+i)}</span><div><strong>${esc(hidden?s.clue:s.name)}</strong><p>${esc(hidden?'':s.clue)}</p>${hidden?'':`<small>${esc(s.detail)}</small>`}</div></div>`).join('')}</div>`}${options.revealed?`<div class="visual-evidence"><strong>${table?'자료에서 찾은 근거':'그림에서 찾은 근거'}</strong><p>${esc(options.evidence || lesson.evidence)}</p></div>`:''}`;
  }
  window.KoreaVisuals = { render, art, esc };
})();
