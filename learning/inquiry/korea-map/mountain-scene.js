(function () {
  "use strict";
  // Fixed west/east ground locations; wind direction never mirrors the terrain.
  const SECTION = {
    west: {name:"진부 · 영서", coordinates:[37.635,128.553]},
    east: {name:"강릉 · 영동", coordinates:[37.755,128.896]},
    samples:241
  };
  const SOURCES = {
    kma:"https://www.kma.go.kr/kma/servlet/NeoboardProcess?bid=press2&callback=&fno=1&k=ATC201106131057091_4cf0da9b-36da-4070-b5c8-fc957642c29d.pdf&mode=download&num=1416&ses=USER_SESSION",
    foehn:"https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/wind/foehn-effect"
  };
  function coordinatesAt(t) {
    return SECTION.west.coordinates.map((value,i)=>value+(SECTION.east.coordinates[i]-value)*t);
  }
  function sides(direction) {
    return direction === "east" ? {up:1,down:0} : {up:0,down:1};
  }
  function create(map, elevationAt) {
    const layer=L.layerGroup(), motion=matchMedia("(prefers-reduced-motion: reduce)");
    const state={active:false,direction:"east",moist:true,masked:false,suspended:false};
    let host=null, profile=null, pending=null, failure=false, resize=null, inView=true, chartInView=true;
    const pane=map.createPane("mountainWind");
    pane.style.zIndex="475";pane.style.pointerEvents="none";
    const renderer=L.svg({pane:"mountainWind"});
    const visibility=()=>syncMotion();
    document.addEventListener("visibilitychange",visibility);
    motion.addEventListener("change",visibility);
    const intersection=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.target===map.getContainer())inView=entry.isIntersecting;else if(entry.target===host)chartInView=entry.isIntersecting;});syncMotion();
    });
    intersection.observe(map.getContainer());
    function syncMotion() {
      const stopped=!state.active||state.suspended||document.hidden||motion.matches;
      pane.hidden=!state.active||state.suspended;
      pane.classList.toggle("mountain-stopped",stopped||!inView);
      if(host?.isConnected) host.classList.toggle("mountain-stopped",stopped||!chartInView);
    }
    async function load() {
      if(profile||pending)return pending;
      failure=false;
      pending=(async()=>{
        try {
          const points=Array.from({length:SECTION.samples},(_,i)=>coordinatesAt(i/(SECTION.samples-1)));
          const heights=await Promise.all(points.map(point=>elevationAt(point)));
          if(heights.some(value=>!Number.isFinite(value)))throw new Error("Missing elevation");
          const peak=heights.indexOf(Math.max(...heights));
          if(peak===0||peak===heights.length-1)throw new Error("Invalid mountain transect");
          const distance=L.latLng(points[0]).distanceTo(L.latLng(points.at(-1)))/1000;
          profile={points,heights,peak,distance};
        } catch (_) {failure=true;}
        finally {pending=null;}
        if(state.active&&host?.isConnected){draw();drawMap();}
      })();
      return pending;
    }
    function fit() {
      map.fitBounds([SECTION.west.coordinates,SECTION.east.coordinates],{paddingTopLeft:[60,75],paddingBottomRight:[60,100],maxZoom:10,animate:false});
    }
    function render(target,options={}) {
      resize?.disconnect();
      if(host)intersection.unobserve(host);
      host=target;state.masked=!!options.quiz;
      chartInView=true;intersection.observe(host);
      host.classList.add("mountain-scene");
      host.dataset.direction=state.direction;
      host.innerHTML=`<div class="mountain-controls"><div role="group" aria-label="산을 넘는 바람 방향"><button type="button" data-mountain-wind="east">동쪽에서 ←</button><button type="button" data-mountain-wind="west">서쪽에서 →</button></div><label><input id="mountainMoisture" type="checkbox"> 응결·강수 조건</label></div>
        <div class="mountain-chart" aria-busy="true"></div><div class="mountain-sides"></div>
        <p class="mountain-explanation" aria-live="polite"></p>
        <p class="mountain-note">지형은 지도 A–B 구간의 고도 자료, 바람은 원리를 설명하는 모형입니다. 실제 풍속·기온·강수량을 계산하지 않습니다.</p>
        <div class="mountain-source"><button type="button" id="mountainLocate">지도에서 A–B 보기</button><details><summary>자료·모형의 범위</summary><p>진부와 강릉을 잇는 직선 단면입니다. 도로 경로나 산봉우리의 공식 높이가 아닙니다. 고도는 저장된 Copernicus DEM 표본이며 세로 눈금은 가로보다 과장합니다.</p><p>응결·강수 조건을 켜면 습한 공기가 산을 넘는 교과 모형을 봅니다. 끄면 상승·하강만 비교합니다. 실제 푄은 강수가 없어도 다른 과정으로 나타날 수 있고, 모든 산 넘는 바람이 푄은 아닙니다.</p><a href="${SOURCES.kma}" target="_blank" rel="noopener">기상청 · 동풍과 영서 푄 사례</a><a href="${SOURCES.foehn}" target="_blank" rel="noopener">Met Office · 푄의 발생 과정</a></details></div>`;
      host.querySelectorAll("[data-mountain-wind]").forEach(button=>button.onclick=()=>{
        state.direction=button.dataset.mountainWind;draw();drawMap();
      });
      host.querySelector("#mountainMoisture").onchange=event=>{state.moist=event.target.checked;draw();};
      host.querySelector("#mountainLocate").onclick=()=>{
        fit();if(innerWidth<=1050)map.getContainer().scrollIntoView({block:"start",behavior:motion.matches?"instant":"smooth"});
      };
      resize=new ResizeObserver(()=>drawChart());resize.observe(host);
      draw();load();return true;
    }
    function draw() {
      if(!host?.isConnected)return;
      const side=sides(state.direction);
      host.dataset.direction=state.direction;host.dataset.masked=String(state.masked);
      host.dataset.status=profile?"ready":failure?"error":"loading";
      host.querySelectorAll("[data-mountain-wind]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.mountainWind===state.direction)));
      host.querySelector("#mountainMoisture").checked=state.moist;
      host.querySelector(".mountain-sides").innerHTML=[SECTION.west,SECTION.east].map((place,index)=>{
        const up=index===side.up;
        return `<div class="mountain-side ${up?"windward":"leeward"}"><h3>${index?"B":"A"} ${place.name}</h3><p>${state.masked?"이 사면에서는 어떤 변화가 일어날까?":up?"바람받이 · 상승하며 냉각":"바람그늘 · 하강하며 가열"}</p><small>${state.masked?"방향과 높이 변화를 보고 설명해 보세요.":up?(state.moist?"포화에 이르면 응결 · 구름과 강수 가능":"건조한 공기도 올라가면 식음"):(state.moist?"강수로 수분을 잃은 공기 · 상대 습도 감소":"내려오면 따뜻해짐 · 상대 습도 감소")}</small></div>`;
      }).join("");
      host.querySelector(".mountain-explanation").textContent=state.masked?"바람 방향을 바꾸어 A와 B의 역할이 어떻게 달라지는지 비교하세요.":!state.moist?"응결·강수를 가정하지 않은 장면입니다. 단열적으로 오르내린 같은 공기를 같은 높이에서 비교하면, 상승 중 냉각과 하강 중 가열만으로 순가열을 설명할 수는 없습니다.":state.direction==="east"?"동쪽에서 온 공기는 영동 쪽에서 올라가고 영서 쪽으로 내려옵니다. 북동쪽에서 태백산맥을 넘어 영서에 고온 건조한 바람이 부는 높새바람도 이 방향의 사례입니다.":"서쪽에서 온 공기는 영서 쪽에서 올라가고 영동 쪽으로 내려옵니다. 바람 방향이 바뀌면 바람받이와 바람그늘도 바뀝니다. 영동이 항상 바람그늘인 것은 아닙니다.";
      drawChart();syncMotion();
    }
    function drawChart() {
      const target=host?.querySelector(".mountain-chart");if(!target||!host.isConnected)return;
      target.setAttribute("aria-busy",String(!profile&&!failure));
      if(!profile) {
        target.innerHTML=failure?'<p role="status">고도 자료를 불러오지 못했습니다. 임의의 산 모양으로 대체하지 않습니다.</p><button type="button" id="mountainRetry">다시 불러오기</button>':'<p role="status">지도 A–B 구간의 고도를 읽는 중…</p>';
        target.querySelector("button")?.addEventListener("click",()=>{load();draw();});return;
      }
      const {heights,peak,distance}=profile;
      const width=Math.max(290,target.clientWidth),height=270,left=42,right=14,top=65,bottom=222;
      const maximum=Math.ceil((Math.max(...heights)+400)/500)*500;
      const x=i=>left+i/(heights.length-1)*(width-left-right),y=h=>bottom-Math.max(0,h)/maximum*(bottom-top);
      const ground=heights.map((h,i)=>`${x(i).toFixed(1)},${y(h).toFixed(1)}`).join(" ");
      // Monotone envelopes keep the illustrative air path above every sampled ridge.
      const envelope=heights.slice();
      for(let i=1;i<=peak;i++)envelope[i]=Math.max(envelope[i-1],envelope[i]);
      for(let i=heights.length-2;i>=peak;i--)envelope[i]=Math.max(envelope[i+1],envelope[i]);
      const halves=[Array.from({length:peak+1},(_,i)=>i),Array.from({length:heights.length-peak},(_,i)=>i+peak)];
      const fromEast=state.direction==="east";
      const path=(indices)=>{
        const ordered=fromEast?indices.slice().reverse():indices;
        return ordered.map((i,k)=>`${k?"L":"M"}${x(i).toFixed(1)} ${y(envelope[i]+280).toFixed(1)}`).join(" ");
      };
      const exaggeration=((bottom-top)/(maximum/1000))/((width-left-right)/distance);
      const windward=fromEast?1:0;
      target.innerHTML=`<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="A 진부에서 B 강릉까지의 실제 지형 단면. ${state.masked?"바람 방향을 보고 양쪽 사면을 비교합니다.":fromEast?"오른쪽 영동에서 왼쪽 영서로 부는 바람.":"왼쪽 영서에서 오른쪽 영동으로 부는 바람."}">
        <defs><marker id="mountainUpArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L9 5 1 9" fill="none" stroke="#16758f" stroke-width="1.7"/></marker><marker id="mountainDownArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L9 5 1 9" fill="none" stroke="#b85330" stroke-width="1.7"/></marker></defs>
        <text x="${left}" y="19">A 진부 · 서쪽</text><text x="${width-right}" y="19" text-anchor="end">B 강릉 · 동쪽</text>
        <text x="${width/2}" y="43" text-anchor="middle" class="mountain-direction">${fromEast?"← 동쪽에서 오는 바람":"서쪽에서 오는 바람 →"}</text>
        ${Array.from({length:maximum/500+1},(_,i)=>i*500).map(h=>`<path d="M${left} ${y(h)}H${width-right}" class="mountain-grid"/><text x="${left-7}" y="${y(h)+4}" text-anchor="end" class="mountain-axis">${h}</text>`).join("")}
        <text x="8" y="54" class="mountain-axis">m</text>
        <polygon class="mountain-ground" points="${left},${bottom} ${ground} ${width-right},${bottom}"/>
        ${halves.map((indices,i)=>`<path class="mountain-air-base ${i===windward?"windward":"leeward"}" d="${path(indices)}" marker-end="url(#${i===windward?"mountainUpArrow":"mountainDownArrow"})"/><path class="mountain-air" d="${path(indices)}"/>`).join("")}
        ${state.moist&&!state.masked?`<text x="${fromEast?width-right:left}" y="88" text-anchor="${fromEast?"end":"start"}" class="mountain-cloud-note">응결·강수 가능</text>`:""}
        <text x="${left}" y="244" class="mountain-axis">0</text><text x="${width-right}" y="244" text-anchor="end" class="mountain-axis">${distance.toFixed(1)} km</text><text x="${width/2}" y="263" text-anchor="middle" class="mountain-axis">지도 A–B 단면 · 세로 약 ${Math.round(exaggeration)}배 과장</text>
      </svg>`;
      host.dataset.peak=String(heights[peak]);host.dataset.samples=String(heights.length);
    }
    function drawMap() {
      layer.clearLayers();if(!state.active)return;
      if(!map.hasLayer(layer))layer.addTo(map);
      const side=sides(state.direction);
      [SECTION.west,SECTION.east].forEach((place,index)=>{
        L.circleMarker(place.coordinates,{renderer,pane:"mountainWind",radius:6,color:"#fff",weight:2,fillColor:index===side.up?"#16758f":"#b85330",fillOpacity:1,interactive:false})
          .bindTooltip(`${index?"B":"A"} ${place.name}`,{permanent:true,direction:"auto",offset:[0,0],className:"scene-map-label"}).addTo(layer);
      });
      const points=profile?.points||[SECTION.west.coordinates,SECTION.east.coordinates];
      L.polyline(points,{renderer,pane:"mountainWind",color:"#fff",weight:6,opacity:.9,interactive:false}).addTo(layer);
      const peak=profile?.peak||Math.floor((points.length-1)/2);
      [points.slice(0,peak+1),points.slice(peak)].forEach((section,index)=>{
        L.polyline(state.direction==="east"?section.slice().reverse():section,{renderer,pane:"mountainWind",color:index===side.up?"#16758f":"#b85330",weight:3,interactive:false,className:"mountain-map-air",lineCap:"butt"}).addTo(layer);
      });
      syncMotion();
    }
    function setActive(active) {
      const entering=active&&!state.active;state.active=active;
      if(active){drawMap();if(entering){fit();load();}}
      else {map.removeLayer(layer);pane.hidden=true;resize?.disconnect();if(host){host.classList.add("mountain-stopped");intersection.unobserve(host);}host=null;}
      syncMotion();
    }
    return {render,setActive,setSuspended(value){state.suspended=value;syncMotion();},destroy(){setActive(false);intersection.disconnect();document.removeEventListener("visibilitychange",visibility);motion.removeEventListener("change",visibility);renderer.remove();pane.remove();}};
  }
  window.KoreaMountainScene={create,section:SECTION,coordinatesAt,sides};
})();
