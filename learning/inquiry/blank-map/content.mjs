// Coordinates are [longitude, latitude]. Pins locate representative sites, not territorial extents.
export const POINTS = {
  seoul:['서울',126.978,37.566], busan:['부산',129.075,35.18], daejeon:['대전',127.385,36.351], gwangju:['광주',126.852,35.16], jeju:['제주도',126.53,33.38],
  baekdu:['백두산',128.077,41.996], taebaek:['태백산맥',128.65,37.55], jirisan:['지리산',127.731,35.338], han:['한강',127.08,37.53], nakdong:['낙동강',128.47,35.7], geum:['금강',127.02,36.21], yeongsan:['영산강',126.65,34.98],
  gangneung:['강릉',128.876,37.751], pyeongchang:['대관령',128.718,37.686], gunsan:['군산',126.737,35.967], pohang:['포항',129.343,36.019], ulsan:['울산',129.311,35.539], gumi:['구미',128.345,36.119], yeosu:['여수',127.662,34.76],
  asia:['아시아',95,42], europe:['유럽',15,51], africa:['아프리카',20,4], northAmerica:['북아메리카',-105,43], southAmerica:['남아메리카',-60,-20], oceania:['오세아니아',135,-24], antarctica:['남극 대륙',10,-78],
  pacific:['태평양',-145,0], atlantic:['대서양',-32,5], indian:['인도양',72,-18],
  korea:['대한민국',127.5,36], china:['중국',106,34], japan:['일본',138,36], mongolia:['몽골',103,47],
  alps:['알프스산맥',10.94,46.79], himalayas:['히말라야산맥',81.5,30], rockies:['로키산맥',-112,45], andes:['안데스산맥',-70,-20],
  nile:['나일강',31,27], amazon:['아마존강',-60,-3], yangtze:['장강',113,30], yellow:['황허강',112,35], mekong:['메콩강',104,15],
  egypt:['이집트 문명',31.2,29], mesopotamia:['메소포타미아 문명',44.4,32.5], indus:['인더스 문명',68.1,27.3], huanghe:['중국 문명',113.5,35.5],
  gungnae:['국내성',126.19,41.14], pyeongyang:['평양',125.75,39.03], hanseong:['한성',127.12,37.53], ungjin:['웅진',127.12,36.46], sabi:['사비',126.91,36.28], gyeongju:['금성',129.22,35.84],
  singapore:['싱가포르',103.82,1.35], rome:['로마',12.5,41.9], london:['런던',-0.12,51.5], santiago:['산티아고',-70.67,-33.45], cairo:['카이로',31.24,30.04],
  suez:['수에즈 운하',32.4,30.5], panama:['파나마 운하',-79.7,9.1], malacca:['말라카 해협',100.5,3.5], gibraltar:['지브롤터 해협',-5.6,36], hormuz:['호르무즈 해협',56.5,26.5],
  lisbon:['리스본',-9.14,38.72], cape:['희망봉',18.5,-34.36], calicut:['캘리컷',75.78,11.25], caribbean:['서인도 제도',-74,22], magellan:['마젤란 해협',-70.8,-53.2], philippines:['필리핀',123,11],
};
const q=(id,prompt,points,answer,hint,explanation,extra={})=>({id,prompt,points,answer:Array.isArray(answer)?answer:[answer],hint,explanation,...extra});
const set=(id,level,area,title,band,source,questions,extra={})=>({id,level,area,title,band,source,questions,...extra});
const cities=['seoul','busan','daejeon','gwangju','jeju'];
const land=['baekdu','taebaek','jirisan','han','jeju'];
const continents=['asia','europe','africa','northAmerica','southAmerica','oceania','antarctica'];
const mountains=['alps','himalayas','rockies','andes'];
const rivers=['nile','amazon','yangtze','yellow','mekong'];
const krRivers=['han','nakdong','geum','yeongsan'];
const civ=['egypt','mesopotamia','indus','huanghe'];
const capitals=['gungnae','pyeongyang','hanseong','ungjin','sabi','gyeongju'];
const climatePoints=['singapore','rome','london','santiago','cairo'];
const ports=['suez','panama','malacca','gibraltar','hormuz'];
const voyages=['lisbon','cape','calicut','caribbean','magellan','philippines'];
const table=rows=>({table:rows});
export const SETS = [
 set('kr-cities','elementary','korea','주요 도시 찾기','3–4학년 · 사회','elementary-atlas',[
  q('city-seoul','우리나라의 수도 서울을 찾아보세요.',cities,'seoul','한반도 중서부, 한강이 흐르는 곳을 살펴보세요.','서울은 한강이 흐르는 수도권의 중심 도시예요.'),
  q('city-busan','우리나라 남동쪽의 항구 도시 부산을 찾아보세요.',cities,'busan','남쪽 해안과 동쪽 해안이 만나는 쪽을 살펴보세요.','부산은 우리나라 남동쪽 해안에 있는 항구 도시예요.'),
  q('city-daejeon','서울과 부산 사이, 내륙에 있는 대전을 찾아보세요.',cities,'daejeon','바다에 닿지 않는 중부 내륙의 지점을 찾아보세요.','대전은 중부 내륙에 있고 여러 교통로가 연결되는 도시예요.'),
  q('city-gwangju','우리나라 남서부의 도시 광주를 찾아보세요.',cities,'gwangju','제주도보다 북쪽에 있는 남서부 내륙을 보세요.','광주는 호남 지역의 중심 도시 중 하나예요.'),
  q('city-jeju','한반도 남쪽의 큰 섬, 제주도를 찾아보세요.',cities,'jeju','육지에서 떨어진 남쪽 섬을 살펴보세요.','제주도는 한반도 남쪽에 있어요. 지도에서 육지와 섬의 위치를 함께 기억해요.'),
 ]),
 set('kr-land','elementary','korea','산과 강의 위치','5–6학년 · 사회','elementary-atlas',[
  q('land-baekdu','백두산의 위치를 찾아보세요.',land,'baekdu','우리나라 북쪽 끝 부근을 살펴보세요.','백두산은 우리나라 북부에 있어요. 주변에서 압록강과 두만강이 시작돼요.'),
  q('land-taebaek','동쪽 해안을 따라 이어지는 태백산맥을 찾아보세요.',land,'taebaek','바다와 나란하게 이어지는 동쪽 산지에 주목하세요.','태백산맥은 우리나라 동쪽에 남북으로 길게 이어져 있어요.'),
  q('land-jiri','남부 내륙에 있는 지리산을 찾아보세요.',land,'jirisan','제주도와 한강 사이의 남부 산지를 보세요.','지리산은 전북·전남·경남에 걸쳐 있는 남부의 큰 산이에요.'),
  q('land-han','서울을 지나 황해로 흐르는 한강을 찾아보세요.',land,'han','우리나라 중부에서 서쪽 바다로 흐르는 강이에요.','한강은 우리나라 중부를 지나 서쪽의 황해로 흘러가요.'),
 ]),
 set('world-continents','elementary','world','대륙과 대양','5–6학년 · 사회','elementary-world',[
  ...[['asia','우리나라가 속한 아시아','세계지도의 동쪽, 큰 대륙을 보세요.'],['africa','적도가 가로지르는 아프리카','유럽 남쪽의 대륙이에요.'],['southAmerica','남아메리카','북아메리카와 좁은 육지로 이어져 있어요.'],['oceania','오세아니아','아시아 남동쪽의 오스트레일리아와 주변 섬들을 보세요.']].map(([id,title,hint])=>q('continent-'+id,title+'를 찾아보세요.',continents,id,hint,POINTS[id][0]+'의 위치를 주변 대륙과 비교해 보세요.')),
  q('ocean-atlantic','아메리카와 유럽·아프리카 사이의 대양을 찾아보세요.',['pacific','atlantic','indian'],'atlantic','두 대륙 사이의 바다를 찾아보세요.','대서양은 아메리카와 유럽·아프리카 사이에 있어요.'),
  q('ocean-indian','아프리카 동쪽, 아시아 남쪽의 대양을 찾아보세요.',['pacific','atlantic','indian'],'indian','아프리카와 오스트레일리아 사이를 보세요.','인도양은 아시아 남쪽, 아프리카와 오스트레일리아 사이에 있어요.'),
 ]),
 set('world-neighbors','elementary','world','우리나라와 이웃 나라','5–6학년 · 사회','elementary-world',[
  q('neighbor-korea','대한민국의 위치를 찾아보세요.',['korea','china','japan','mongolia'],'korea','아시아 동쪽의 한반도 남부를 보세요.','대한민국은 아시아 동쪽의 한반도 남부에 있어요.'),
  q('neighbor-japan','우리나라 동쪽 바다 건너의 섬나라를 찾아보세요.',['korea','china','japan','mongolia'],'japan','여러 큰 섬이 길게 이어져 있어요.','일본은 우리나라 동쪽 바다 건너에 있는 섬나라예요.'),
  q('neighbor-china','우리나라 서쪽, 황해 건너의 중국을 찾아보세요.',['korea','china','japan','mongolia'],'china','한반도 서쪽의 큰 육지를 보세요.','중국은 우리나라와 황해를 사이에 두고 마주하고 있어요.'),
 ],{bounds:[[15,85],[53,150]]}),
 set('kr-rivers','middle','korea','강과 바다 연결하기','중학교 · 지리','korea-workbook',[
  q('river-han','수도권을 지나 황해로 흐르는 하천을 고르세요.',krRivers,'han','중부에서 서쪽으로 흐르는 물길을 확인하세요.','한강은 수도권을 지나 황해로 흐릅니다.'),
  q('river-nakdong','영남 내륙을 지나 남해로 흐르는 하천을 고르세요.',krRivers,'nakdong','남동부의 긴 물길을 확인하세요.','낙동강은 영남 내륙을 남쪽으로 흐르며 하구가 부산 부근에 있습니다.'),
  q('river-geum','충청 지역을 지나 군산 부근에서 황해로 흐르는 하천을 고르세요.',krRivers,'geum','한강 남쪽, 영산강 북쪽에 있는 물길입니다.','금강은 충청 내륙을 지나 군산·서천 사이에서 황해로 흐릅니다.'),
  q('river-yeongsan','광주를 지나 목포 부근으로 흐르는 하천을 고르세요.',krRivers,'yeongsan','남서부의 물길을 따라가 보세요.','영산강은 호남 남서부를 흘러 목포 부근에 이릅니다.'),
 ],{rivers:['한강','남한강','북한강','낙동강','금강','영산강']}),
 set('world-mountains','middle','world','산맥의 위치와 형성','중학교 · 지리','middle-landforms',[
  q('mountain-himalaya','인도판과 유라시아판이 충돌하여 높아진 산맥을 고르세요.',mountains,'himalayas','인도 북쪽의 산지를 찾으세요.','히말라야산맥은 인도판과 유라시아판이 충돌하는 곳에 발달했습니다.'),
  q('mountain-andes','남아메리카 서쪽, 해양판이 대륙판 아래로 들어가는 곳의 산맥을 고르세요.',mountains,'andes','남아메리카의 태평양 쪽 해안을 보세요.','안데스산맥은 남아메리카 서부에 길게 이어집니다. 나스카판의 섭입과 관련됩니다.'),
  q('mountain-rockies','북아메리카 서부에 남북으로 이어지는 산맥을 고르세요.',mountains,'rockies','북아메리카의 대서양 쪽과 태평양 쪽을 구분하세요.','로키산맥은 북아메리카 서부에 있습니다.'),
  q('mountain-alps','유럽 남부에 있으며 빙하 지형과 산지 관광으로 알려진 산맥을 고르세요.',mountains,'alps','이탈리아반도 북쪽을 확인하세요.','알프스산맥은 유럽 남부에 걸쳐 있고 빙하가 만든 골짜기 등을 볼 수 있습니다.'),
 ],{mountains:true}),
 set('world-rivers','middle','world','세계의 큰 강','중학교 · 지리','middle-landforms',[
  q('world-river-nile','아프리카에서 북쪽의 지중해로 흐르는 강을 고르세요.',rivers,'nile','아프리카 북동부의 물길을 보세요.','나일강은 아프리카 북동부를 북쪽으로 흘러 지중해에 이릅니다.'),
  q('world-river-amazon','적도 부근의 넓은 열대 우림을 지나 대서양으로 흐르는 강을 고르세요.',rivers,'amazon','남아메리카 북부를 보세요.','아마존강은 남아메리카 북부를 지나 동쪽의 대서양으로 흐릅니다.'),
  q('world-river-yangtze','중국에서 황허강보다 남쪽에 흐르며 상하이 부근 바다로 나가는 강을 고르세요.',rivers,'yangtze','중국에 표시된 두 강의 남북 위치를 비교하세요.','장강은 황허강 남쪽에 있으며 하구가 상하이 부근에 있습니다.'),
  q('world-river-mekong','인도차이나반도를 흘러 베트남 남부에서 삼각주를 이루는 강을 고르세요.',rivers,'mekong','중국 남쪽, 동남아시아의 반도를 살펴보세요.','메콩강 하류의 삼각주에서는 벼농사가 활발합니다.'),
 ],{rivers:['나일강','아마존강','장강','양쯔강','황허강','황하','메콩강']}),
 set('kr-capitals','middle','korea','삼국의 수도 이동','중학교 · 역사','middle-history',[
  q('capital-pyeongyang','427년 장수왕이 천도한 곳을 고르세요.',capitals,'pyeongyang','국내성보다 남쪽, 대동강 유역을 살펴보세요.','장수왕은 국내성에서 평양으로 천도하여 남진 정책을 추진했습니다.'),
  q('capital-ungjin','475년 한성이 함락된 뒤 백제가 수도를 옮긴 곳을 고르세요.',capitals,'ungjin','한성 남쪽의 금강 중류를 보세요.','백제는 한성 함락 뒤 웅진(오늘날 공주)으로 수도를 옮겼습니다.'),
  q('capital-sabi','538년 성왕이 백제의 수도로 삼은 곳을 고르세요.',capitals,'sabi','웅진보다 금강 하류 쪽을 보세요.','성왕은 웅진에서 사비(오늘날 부여)로 천도했습니다.'),
  q('capital-route','백제의 수도를 이른 시기부터 차례로 세 곳 고르세요.',capitals,['hanseong','ungjin','sabi'],'한강 유역에서 금강 유역으로 옮겨 갔습니다.','백제의 수도는 한성 → 웅진 → 사비 순으로 바뀌었습니다.',{mode:'order'}),
 ],{historic:true,bounds:[[34.7,124.6],[42,130.1]]}),
 set('history-civilizations','middle','history','문명이 시작된 강 유역','중학교 · 역사','world-civilizations',[
  q('civil-egypt','나일강의 범람을 이용하고 피라미드를 세운 문명 지역을 고르세요.',civ,'egypt','아프리카 북동부를 보세요.','이집트 문명은 나일강 유역에서 발달했습니다.'),
  q('civil-mesopotamia','티그리스강과 유프라테스강 사이에서 도시 국가가 발달한 지역을 고르세요.',civ,'mesopotamia','지중해 동쪽과 페르시아만 사이를 보세요.','메소포타미아 문명은 두 강 사이의 평야에서 발달했습니다.'),
  q('civil-indus','하라파와 모헨조다로가 있었던 강 유역을 고르세요.',civ,'indus','인도 아대륙의 북서부를 보세요.','인더스 문명의 계획도시들은 인더스강 유역에 발달했습니다.'),
  q('civil-huanghe','황허강 유역에서 발달한 문명 지역을 고르세요.',civ,'huanghe','동아시아의 큰 강 유역을 보세요.','중국 문명은 황허강 유역 등을 중심으로 발달했습니다.'),
 ],{historic:true,bounds:[[8,18],[48,125]],rivers:['나일강','티그리스강','유프라테스강','인더스강','황허강','황하']}),
 set('kr-high-land','high','korea','지형 단서로 위치 추론','고등학교 · 한국지리','high-korea',[
  q('high-land-coast','자료에 해당하는 지역을 지도에서 고르세요.',['gangneung','gunsan','jeju','gumi'],'gangneung','동해안과 황해안의 조차·해안선 차이를 비교하세요.','강릉은 동해안에 있습니다. 동해안은 황해안보다 조차가 작고 해안선이 비교적 단조로우며 사빈이 발달한 곳이 많습니다.',table([['해안선','비교적 단조로움'],['조차','황해안보다 작음'],['해안 지형','사빈·석호가 나타남']])),
  q('high-land-tidal','다음 답사에 적합한 지역을 고르세요.',['gangneung','gunsan','jeju','gumi'],'gunsan','조수 간만의 차가 큰 서쪽 해안을 보세요.','군산은 금강 하구의 서해안 도시입니다. 조차가 큰 황해안에서는 갯벌과 하구 환경을 관찰할 수 있습니다.',table([['답사 대상','조차가 큰 해안의 갯벌'],['하천','금강 하구'],['관찰','조류의 퇴적 작용']])),
  q('high-land-volcano','다음 지형 조합이 나타나는 지역을 고르세요.',['gangneung','gunsan','jeju','gumi'],'jeju','한반도 남쪽의 화산섬을 보세요.','제주도에서는 현무암·기생 화산·용암 동굴 등 화산 활동과 관련된 지형을 볼 수 있습니다.',table([['암석','현무암'],['지형','기생 화산·용암 동굴'],['하천','투수성이 커 상시 흐르는 하천이 적음']])),
 ]),
 set('kr-high-industry','high','korea','공업 도시와 입지','고등학교 · 한국지리','high-korea',[
  q('industry-ulsan','산업 구성이 자료와 일치하는 도시를 고르세요.',['ulsan','pohang','gumi','yeosu'],'ulsan','원료 수입과 제품 수송에 유리한 남동 임해 지역을 보세요.','울산에는 자동차·조선·석유 화학 공업이 발달했습니다. 포항의 제철, 구미의 전자 공업과 구별합니다.',table([['주요 산업','자동차·조선·석유 화학'],['입지','동남부 해안의 항만']])),
  q('industry-pohang','원료 수입에 유리한 항만을 끼고 제철 공업이 발달한 도시를 고르세요.',['ulsan','pohang','gumi','yeosu'],'pohang','동해안에서 울산보다 북쪽에 있는 지점을 보세요.','포항은 동해안의 대표적인 제철 공업 도시입니다.',table([['생산','철강'],['원료','철광석·원료탄의 대량 수입'],['입지','동해안 항만']])),
  q('industry-gumi','자료와 같은 공업 도시를 고르세요.',['ulsan','pohang','gumi','yeosu'],'gumi','후보 중 항만에 직접 접하지 않는 내륙 도시를 찾으세요.','구미는 경북 내륙의 전자 공업 도시입니다. 임해 중화학 공업 도시들과 입지를 비교합니다.',table([['주요 산업','전자·정보 통신'],['입지','경부 교통축의 내륙']])),
  q('industry-yeosu','자료와 같은 산업 단지가 있는 도시를 고르세요.',['ulsan','pohang','gumi','yeosu'],'yeosu','호남 남동부 해안을 살펴보세요.','여수에는 항만을 이용하는 석유 화학 공업 단지가 발달했습니다.',table([['주요 산업','석유 화학'],['입지','호남 남동부 해안']])),
 ]),
 set('world-high-climate','high','world','기후 그래프와 위치','고등학교 · 세계지리','high-climate',[
  q('climate-equatorial','그래프의 기후가 나타나기 가장 적합한 지점을 고르세요.',climatePoints,'singapore','기온의 연교차와 강수의 계절 차이를 함께 읽으세요.','적도 가까운 싱가포르는 연중 덥고 강수가 많습니다. 기온의 연교차가 작은 점이 단서입니다.',{chart:{temperature:[26,27,27,28,28,28,27,27,27,27,26,26],rain:[240,170,180,190,180,160,170,180,180,210,270,280]}}),
  q('climate-med-north','그래프와 일치하는 지점을 고르세요.',climatePoints,'rome','더운 달과 비가 적은 달이 언제인지 확인하세요.','7–8월이 덥고 건조한 북반구 지중해성 기후입니다. 남반구의 산티아고와 계절이 반대입니다.',{chart:{temperature:[8,9,11,14,18,22,25,25,21,17,12,9],rain:[80,75,65,60,40,25,15,25,70,110,120,90]}}),
  q('climate-med-south','같은 지중해성 기후라도 계절이 반대입니다. 그래프에 해당하는 지점을 고르세요.',climatePoints,'santiago','1–2월의 기온과 강수량을 보세요.','1–2월이 덥고 건조하므로 남반구의 지중해성 기후입니다. 칠레 중부 산티아고가 해당합니다.',{chart:{temperature:[21,21,19,15,11,8,8,10,12,15,18,20],rain:[2,2,5,15,65,90,80,65,30,15,5,3]}}),
  q('climate-oceanic','그래프와 지리적 위치를 함께 고려해 지점을 고르세요.',climatePoints,'london','북반구 중위도 대륙 서안에서 연중 비가 오는 곳을 보세요.','런던은 서안 해양성 기후로, 연중 강수가 비교적 고르고 여름이 비교적 서늘합니다.',{chart:{temperature:[5,5,7,10,13,16,18,18,15,12,8,6],rain:[55,40,45,45,50,45,45,50,50,65,65,55]}}),
 ]),
 set('world-high-seaways','high','world','항로와 해협·운하','고등학교 · 세계지리','high-seaways',[
  q('seaway-suez','이 항로에서 통과하는 운하를 고르세요.',ports,'suez','지중해 동쪽과 홍해 북쪽이 만나는 곳입니다.','수에즈 운하는 지중해와 홍해를 연결하여 아프리카 남단을 도는 항로보다 거리를 줄입니다.',table([['출발','지중해 연안'],['도착','인도양 연안'],['경로','아프리카 남단을 우회하지 않음']])),
  q('seaway-panama','이 항로에서 통과하는 운하를 고르세요.',ports,'panama','북아메리카와 남아메리카 사이의 좁은 육지를 보세요.','파나마 운하는 대서양 쪽 카리브해와 태평양을 연결합니다.',table([['출발','미국 동해안'],['도착','미국 서해안'],['경로','남아메리카 남단을 우회하지 않음']])),
  q('seaway-oil','페르시아만에서 동아시아로 가는 배가 통과하는 두 해협을 순서대로 고르세요.',ports,['hormuz','malacca'],'페르시아만 출구를 먼저, 말레이반도 옆을 나중에 고르세요.','호르무즈 해협 → 인도양 → 말라카 해협의 순서입니다.',{mode:'order'}),
 ]),
 set('history-high-voyages','high','history','신항로의 경유지 추론','고등학교 · 세계사','world-voyages',[
  q('voyage-india','리스본에서 출발한 바스쿠 다 가마의 항로에서 경유지와 도착지를 순서대로 고르세요.',voyages,['cape','calicut'],'아프리카 남단을 돌아 인도 서해안에 도착했습니다.','희망봉을 돌아 인도양을 건너 캘리컷에 도착했습니다. 수에즈 운하 개통 이전의 항로입니다.',{mode:'order'}),
  q('voyage-columbus','자료의 항해가 도착한 지역을 고르세요.',voyages,'caribbean','서쪽으로 대서양을 건넜다는 점을 지도에 적용하세요.','콜럼버스는 1492년 대서양을 건너 서인도 제도에 도착했습니다. 인도 항로의 캘리컷과 구별합니다.',table([['후원','에스파냐'],['방향','대서양을 서쪽으로 횡단'],['시기','1492년']])),
  q('voyage-magellan','마젤란 일행이 대서양에서 태평양으로 나간 뒤 도착한 곳까지, 두 지점을 순서대로 고르세요.',voyages,['magellan','philippines'],'남아메리카 남단의 통로 다음에 태평양 서쪽의 제도를 고르세요.','마젤란 해협을 통과한 뒤 태평양을 건너 필리핀에 도착했습니다. 마젤란 사후 남은 일행이 세계 일주를 마쳤습니다.',{mode:'order'}),
 ],{historic:true}),
];
