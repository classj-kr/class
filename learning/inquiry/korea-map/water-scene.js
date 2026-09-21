(function () {
  'use strict';
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const km=(a,b)=>{const r=Math.PI/180,dlat=(b[1]-a[1])*r,dlng=(b[0]-a[0])*r;return 12742*Math.asin(Math.min(1,Math.sqrt(Math.sin(dlat/2)**2+Math.cos(a[1]*r)*Math.cos(b[1]*r)*Math.sin(dlng/2)**2)));};
  function routeFor(tracks,name) {
    const lines=tracks.filter(t=>t.name===name).map(t=>t.coordinates);
    if(!lines.length)return [];
    // Disconnected source pieces remain separate. Never draw invented connecting segments.
    const result=lines.map(line=>line.slice());
    if(['남한강','북한강'].includes(name)) {
      const han=tracks.find(t=>t.name==='한강')?.coordinates;
      if(han&&km(result.at(-1).at(-1),han[0])<.1)result[result.length-1]=result.at(-1).concat(han.slice(1));
    }
    return result;
  }
  function create(map,api) {
    for(const [name,z] of [['watershed',430],['waterJourney',465],['waterPlaces',610]])if(!map.getPane(name)){const pane=map.createPane(name);pane.style.zIndex=z;pane.style.pointerEvents=name==='waterPlaces'?'auto':'none';}
    const basinLayer=L.layerGroup(),trace=L.layerGroup(),places=L.layerGroup();
    const renderer=L.svg({pane:'watershed'}),traceRenderer=L.svg({pane:'waterJourney'});
    let tracks=[],collection=null,loading=null,failed=false,active=false,name='all',host=null,showBasin=true,showPlaces=false,progress=0;
    const data=window.KOREA_GEOGRAPHY;
    function load() {
      if(collection||loading)return;
      failed=false;
      loading=fetch('data/watersheds.geojson?v=20260921-1',{signal:AbortSignal.timeout(12000)}).then(r=>{if(!r.ok)throw Error(r.status);return r.json();}).then(value=>{
        if(value.type!=='FeatureCollection'||!value.aliases||!value.features?.length)throw Error('유역 형식');collection=value;
      }).catch(()=>{failed=true;}).finally(()=>{loading=null;drawBasin();status();});
    }
    function basin(){return collection?.features.find(f=>f.properties.mainBas===collection.aliases[name]);}
    function status() {
      const text=host?.querySelector('.watershed-status');if(!text)return;
      text.textContent=failed?'유역 자료를 불러오지 못했습니다. 물길·주변 지점은 계속 볼 수 있습니다.':!collection?'유역 자료를 불러오는 중…':basin()?`${basin().properties.name} 내륙 유역 · 고도 자료로 구분한 물 모임 범위`:'이 강의 유역 자료는 준비되지 않았습니다.';
      const retry=host.querySelector('[data-water-retry]');retry.hidden=!failed;
      host.dataset.basin=basin()?.properties.name||'';
    }
    function drawBasin() {
      basinLayer.clearLayers();if(!active||!showBasin||!basin())return;
      if(!map.hasLayer(basinLayer))basinLayer.addTo(map);
      L.geoJSON(basin(),{pane:'watershed',renderer,interactive:false,style:{color:'#687538',weight:1.6,fillColor:'#d4c65a',fillOpacity:.15}}).addTo(basinLayer);
    }
    function routes(){return routeFor(tracks,name);}
    function drawTrace() {
      trace.clearLayers();if(!active||name==='all')return;
      if(!map.hasLayer(trace))trace.addTo(map);
      const lines=routes(),lengths=lines.map(line=>line.slice(1).reduce((sum,p,i)=>sum+km(line[i],p),0));
      const total=lengths.reduce((a,b)=>a+b,0),distance=total*progress/100;
      let remaining=distance,position=null,after=[],current=0;
      for(let j=0;j<lines.length;j++){
        const line=lines[j];if(position){after.push(line);continue;}
        if(remaining>lengths[j]){remaining-=lengths[j];continue;}
        for(let i=1;i<line.length;i++){
          const d=km(line[i-1],line[i]);if(remaining>d&&i<line.length-1){remaining-=d;continue;}
          const t=Math.min(1,remaining/(d||1));position=line[i-1].map((x,k)=>x+(line[i][k]-x)*t);after.push([position,...line.slice(i)]);current=j;break;
        }
      }
      if(!position)return;
      after.forEach(line=>L.polyline(line.map(([lng,lat])=>[lat,lng]),{pane:'waterJourney',renderer:traceRenderer,weight:7,color:'#e5b642',opacity:.85,interactive:false}).addTo(trace));
      L.circleMarker([position[1],position[0]],{pane:'waterJourney',renderer:traceRenderer,radius:7,color:'#fff',weight:2,fillColor:'#165e9d',fillOpacity:1,interactive:false}).addTo(trace);
      const out=host?.querySelector('.water-position');
      if(out)out.textContent=`선택한 물길의 ${progress}% 지점 · 표시된 끝까지 약 ${Math.max(0,total-distance).toFixed(0)}km${lines.length>1?' (분리 구간 사이 거리 제외)':''}`;
      if(host){host.dataset.routePieces=lines.length;host.dataset.position=position.join(',');host.dataset.routePart=current;}
    }
    function nearby() {
      const samples=routes().flatMap(line=>line.filter((_,i)=>i%12===0||i===line.length-1));
      const candidates=[
        ...(data.themes.population.circles||[]).map(p=>({...p,kind:'도시',note:'물길·평지와 도시 위치를 비교해 보세요.'})),
        ...(data.themes.industry.features||[]).map(p=>({...p,kind:'산업'})),
        ...(data.themes.transport.features||[]).map(p=>({...p,kind:'교통'})),
        ...(data.themes.transport.markers||[]).filter(p=>p.icon==='港').map(p=>({...p,kind:'교통'})),
        ...window.KOREA_TRAVEL.places.filter(p=>p.categories.some(c=>['nature','society','culture','science'].includes(c))).map(p=>({...p,kind:'답사',note:p.mission})),
        ...window.KOREA_HERITAGE.map(p=>({...p,name:p.location+' · '+p.title,kind:'유적',note:p.context}))
      ];
      const near=candidates.map(p=>({...p,distance:Math.min(...samples.map(s=>km(s,[p.lng,p.lat])))})).filter(p=>p.distance<=25).sort((a,b)=>a.distance-b.distance);
      return ['도시','산업','교통','답사','유적'].flatMap(kind=>near.filter(p=>p.kind===kind).slice(0,kind==='답사'?2:1));
    }
    let selectedPlaces=[];
    function focusPlace(place,open=false) {
      map.setView([place.lat,place.lng],10,{animate:false});
      if(open&&place.kind==='답사')window.KoreaTravel.open(place.id,map,api);
      else if(open&&place.kind==='유적')window.KoreaHeritage.open(place.id);
    }
    function drawPlaces() {
      places.clearLayers();if(!active||!showPlaces)return;
      if(!map.hasLayer(places))places.addTo(map);
      selectedPlaces.forEach((p,i)=>L.marker([p.lat,p.lng],{pane:'waterPlaces',keyboard:true,title:p.name,icon:L.divIcon({className:'water-place-pin',html:`<span>${i+1}</span>`,iconSize:[24,28],iconAnchor:[12,28]})}).bindTooltip(esc(p.name)).on('click',()=>focusPlace(p,true)).addTo(places));
    }
    function render(panel,river) {
      host=panel;name=river;selectedPlaces=nearby();
      const join=['남한강','북한강'].includes(name);
      panel.innerHTML+=`<div class="water-lab"><div class="water-options"><label><input type="checkbox" id="waterBasin" ${showBasin?'checked':''}> 비가 모이는 유역</label><button data-water-fit>유역 전체 보기</button></div><p class="watershed-status" role="status"></p><button data-water-retry hidden>유역 자료 다시 불러오기</button><p class="water-small">노란 면은 내륙 유역의 근사 범위입니다. 육지 쪽 경계는 분수계를 나타내지만 해안 쪽 경계는 다릅니다. 하구·연안과 작은 지류 일부는 빠져 있으며 한강과 임진강은 자료상 별도입니다.</p><label for="waterProgress">하천에 모인 빗물, 아래쪽으로 따라가기</label><input id="waterProgress" type="range" min="0" max="100" value="${progress}" step="1" aria-describedby="waterTraceNote"><output class="water-position" for="waterProgress"></output><p id="waterTraceNote">${join?'두물머리에서 두 강이 만나 한강으로 이어집니다.':'파란 점 아래로 이어지는 노란 물길을 따라가 보세요.'} 슬라이더는 표시된 하천 길이의 비율입니다. 빗물이 땅에서 강까지 이동하는 경로나 속도·도착 시간은 계산하지 않습니다.</p><details class="water-life"><summary>이 물길 주변에서 살아가기 · 답사</summary><label><input type="checkbox" id="waterPlaces" ${showPlaces?'checked':''}> 주변 지점을 지도에 함께 표시</label><p class="water-small">등록된 지점 중 표시 물길의 표본점에서 직선 약 25km 이내를 고릅니다. 같은 유역·도로 접근성·인과관계를 뜻하지 않습니다.</p><div class="water-place-list">${selectedPlaces.map((p,i)=>`<article><span>${i+1} · ${p.kind}</span><button data-water-place="${i}">${esc(p.name)}</button><p>${esc(p.note||'주변 지형과 입지를 비교해 보세요.')}</p>${['답사','유적'].includes(p.kind)?`<button data-water-open="${i}">사진·설명 열기 ↗</button>`:''}</article>`).join('')||'<p>이 물길 가까이에 등록된 지점이 없습니다.</p>'}</div><p>산지에서 하류로 내려가며 넓은 땅과 도시의 위치를 비교하세요. 산업·항만은 물뿐 아니라 시장·교통·정책의 영향도 받습니다.</p></details><p class="water-small"><a href="https://www.hydrosheds.org/products/hydrobasins" target="_blank" rel="noopener">유역: HydroBASINS v1.c</a> · <a href="data/watershed-notice.html" target="_blank" rel="noopener">출처·이용조건</a> · 물길: © OpenStreetMap 기여자. 공식 유역 고시·홍수 예측 자료가 아닙니다.</p></div>`;
      panel.querySelector('#waterBasin').onchange=e=>{showBasin=e.target.checked;drawBasin();};
      panel.querySelector('[data-water-fit]').onclick=()=>{if(basin())map.fitBounds(L.geoJSON(basin()).getBounds(),{padding:[40,80],animate:false});};
      panel.querySelector('[data-water-retry]').onclick=()=>{load();status();};
      panel.querySelector('#waterProgress').oninput=e=>{progress=Number(e.target.value);drawTrace();};
      panel.querySelector('#waterPlaces').onchange=e=>{showPlaces=e.target.checked;drawPlaces();};
      panel.querySelectorAll('[data-water-place]').forEach(b=>b.onclick=()=>focusPlace(selectedPlaces[Number(b.dataset.waterPlace)]));
      panel.querySelectorAll('[data-water-open]').forEach(b=>b.onclick=()=>focusPlace(selectedPlaces[Number(b.dataset.waterOpen)],true));
      load();status();drawTrace();drawBasin();drawPlaces();
    }
    function setContext(enabled,river) {
      if(name!==river)progress=0;
      active=enabled&&river!=='all';name=river;
      if(!active){[basinLayer,trace,places].forEach(layer=>map.removeLayer(layer));host=null;}
      else {drawBasin();drawTrace();drawPlaces();}
    }
    return {render,setContext,setTracks(value){tracks=value;},destroy(){setContext(false,'all');renderer.remove();traceRenderer.remove();}};
  }
  window.KoreaWaterScene={create,routeFor,km};
})();
