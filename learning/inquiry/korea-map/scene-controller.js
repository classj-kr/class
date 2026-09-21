(function () {
  "use strict";
  const data = window.KoreaFlowData, climate = window.KoreaSceneClimate;
  const esc = text => String(text).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function create(map, api) {
    const flow = window.KoreaFlowLayer.create().addTo(map);
    const mountain = window.KoreaMountainScene.create(map,api.elevationAt);
    const water = window.KoreaWaterScene.create(map,api.themeApi);
    const coast = window.KoreaCoastScene.create(map);
    // Even non-interactive circleMarkers create a Canvas. Its entire pane must be passive,
    // otherwise that transparent Canvas intercepts the river Canvas below it after selection.
    if (!map.getPane("geographyAnnotations")) {
      map.createPane("geographyAnnotations");
      map.getPane("geographyAnnotations").style.zIndex = "600";
      map.getPane("geographyAnnotations").style.pointerEvents = "none";
    }
    const marks = L.layerGroup().addTo(map);
    const state = {theme:"",lesson:null,river:"all",season:"summer",pair:0,loaded:false,failed:false};
    let tracks = [];
    const toolbar = document.createElement("section");
    toolbar.className = "scene-toolbar"; toolbar.hidden = true;
    toolbar.setAttribute("aria-label","지도 흐름 조절");
    document.querySelector(".map-stage").append(toolbar);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    function syncSuspension() {
      const suspended=!!document.querySelector("dialog[open]") || map.getContainer().classList.contains("is-picking");
      flow.setSuspended(suspended);mountain.setSuspended(suspended);coast.setSuspended(suspended);
    }
    const observer = new MutationObserver(syncSuspension);
    document.querySelectorAll("dialog").forEach(dialog => observer.observe(dialog,{attributes:true,attributeFilter:["open"]}));
    observer.observe(map.getContainer(),{attributes:true,attributeFilter:["class"]});
    function mountainActive() { return state.theme === "climate" && state.lesson?.id === "foehn"; }
    function coastActive() { return state.theme === "terrain" && state.lesson?.id === "coast"; }
    function active() { return (state.theme === "terrain" && !coastActive()) || (state.theme === "climate" && !mountainActive()); }
    function updateFlow() {
      let visibleTracks = [];
      if (state.theme === "terrain") {
        const names = state.river === "all" ? null : data.rivers[state.river].related || [state.river];
        visibleTracks = tracks.filter(track => !names || names.includes(track.name)).map(track => ({...track,selected:track.name===state.river}));
      } else if (state.theme === "climate" && !mountainActive()) visibleTracks = data.windTracks(state.season);
      flow.setTracks(visibleTracks); flow.setVisible(active());
      water.setContext(state.theme === "terrain" && !coastActive(),state.river);
      syncSuspension();
    }
    function renderToolbar() {
      toolbar.hidden = !active();
      if (!active()) return;
      const terrain = state.theme === "terrain";
      toolbar.innerHTML = `<div class="scene-controls">${terrain ? `<label class="scene-river-picker"><span>물길</span><select id="sceneRiver" aria-label="따라갈 강" ${state.loaded?"":"disabled"}><option value="all">주요 하천 전체</option>${Object.keys(data.rivers).map(name=>`<option ${state.river===name?"selected":""}>${esc(name)}</option>`).join("")}</select></label>` : `<div class="scene-seasons" role="group" aria-label="계절 선택"><button data-season="summer" aria-pressed="${state.season==="summer"}">여름</button><button data-season="winter" aria-pressed="${state.season==="winter"}">겨울</button></div><button id="sceneCompare">지역 비교</button>`}</div><p class="scene-caption" role="status">${terrain ? state.failed?"하천 자료를 불러오지 못했습니다. 새로고침해 주세요.":!state.loaded?"하천 자료를 불러오는 중…":"물빛은 하류로 이동 · 속도는 모형" : (state.season==="summer"?"남서풍 ↗":"북서풍 ↘") + " · 대표적인 계절풍 모형, 실시간 날씨 아님"}</p>`;
      toolbar.querySelector("#sceneRiver")?.addEventListener("change",event=>selectRiver(event.target.value));
      toolbar.querySelectorAll("[data-season]").forEach(button=>button.addEventListener("click",()=>{
        state.season = button.dataset.season; updateFlow(); renderToolbar(); renderInsight(); renderMarks();
        toolbar.querySelector(`[data-season="${state.season}"]`).focus();
      }));
      toolbar.querySelector("#sceneCompare")?.addEventListener("click",()=>{
        focusPair(); const panel = document.querySelector("#sceneInsight");
        panel?.scrollIntoView({block:"nearest",behavior:reduced.matches?"instant":"smooth"}); panel?.focus({preventScroll:true});
      });
    }
    function marker(location, label, color, direction = "top") {
      return L.circleMarker(location,{pane:"geographyAnnotations",radius:6,color:"#fff",weight:2,fillColor:color,fillOpacity:1,interactive:false})
        .bindTooltip(label,{permanent:true,direction,offset:direction==="top"?[0,-7]:direction==="left"?[-7,0]:[7,0],className:"scene-map-label"}).addTo(marks);
    }
    function renderMarks() {
      marks.clearLayers();
      if(state.theme === "terrain" && state.river !== "all") {
        const river = data.rivers[state.river];
        marker([river.downstream[1],river.downstream[0]], ["남한강","북한강"].includes(state.river)?"두물머리 · 한강으로":"임진강"===state.river?"한강 하류로":"하류 방향", "#087eaf");
        if(state.river === "한강") marker([37.5248733,127.3105144],"두물머리 · 남한강 + 북한강","#b85b24");
      } else if(state.theme === "climate" && !mountainActive()) {
        climate.pairs[state.pair].names.forEach((name,index)=>{
          const station = climate.stations[name];
          marker(station.location, `${index?"B":"A"} ${name} · ${station[state.season].temp.toFixed(1)}℃`, index?"#b75b32":"#177481", state.pair===1?(index?"right":"left"):"top");
        });
      }
    }
    function renderInsight() {
      document.querySelector("#sceneInsight")?.remove();
      const diagram = document.querySelector("#lessonDiagram");
      if(coastActive() && diagram) { coast.render(diagram); return; }
      if(!active() || !diagram || (state.theme === "terrain" && state.river === "all")) return;
      const panel = document.createElement("section");
      panel.id = "sceneInsight"; panel.className = "scene-insight"; panel.tabIndex = -1;
      panel.setAttribute("aria-label",state.theme === "terrain"?"선택한 물길":"계절별 두 지역 비교");
      if(state.theme === "terrain") {
        const river = data.rivers[state.river];
        panel.innerHTML = `<p class="scene-route">${esc(river.route)}</p><p>${esc(river.note)}</p>`;
        water.render(panel,state.river);
      } else {
        const pair = climate.pairs[state.pair], season = state.season === "summer"?"여름 (6–8월)":"겨울 (12–2월)";
        panel.innerHTML = `<div class="scene-compare-head"><div class="scene-pairs" role="group" aria-label="비교 지역">${climate.pairs.map((pair,index)=>`<button data-pair="${index}" aria-pressed="${state.pair===index}">${pair.label}</button>`).join("")}</div><span>${season}</span></div><div class="scene-region-cards">${pair.names.map((name,index)=>{
          const station = climate.stations[name], values = station[state.season];
          // Both cards and seasons use identical scales. Negative temperatures extend left of zero.
          const zero = 10/45*100, temp = Math.abs(values.temp)/45*100;
          return `<div class="scene-region" style="--region-color:${index?"#b75b32":"#177481"}"><h3><span>${index?"B":"A"}</span> ${name}<small>${station.type}</small></h3><dl><div><dt>평균기온</dt><dd>${values.temp.toFixed(1)}<small> ℃</small></dd></div></dl><div class="scene-meter scene-temp" aria-hidden="true"><i style="left:${values.temp<0?zero-temp:zero}%;width:${temp}%"></i></div><dl><div><dt>강수량</dt><dd>${values.rain.toFixed(1)}<small> mm</small></dd></div></dl><div class="scene-meter" aria-hidden="true"><i style="width:${values.rain/1000*100}%"></i></div></div>`;
        }).join("")}</div><p class="scene-scale">공통 눈금: 기온 −10~35℃ · 강수량 0~1,000mm</p><p class="scene-observation">${pair[state.season]}</p><div class="scene-source"><button id="sceneFocusPair">지도에서 A·B 보기</button><a href="${climate.source}" target="_blank" rel="noopener">기상청 ${climate.period} 평년값 ↗</a></div>`;
        panel.querySelectorAll("[data-pair]").forEach(button=>button.addEventListener("click",()=>{
          state.pair = Number(button.dataset.pair); renderInsight(); renderMarks(); focusPair();
          document.querySelector(`[data-pair="${state.pair}"]`).focus({preventScroll:true});
        }));
        panel.querySelector("#sceneFocusPair").addEventListener("click",()=>{
          focusPair(); if(innerWidth<=1050) document.querySelector(".map-stage").scrollIntoView({block:"start",behavior:reduced.matches?"instant":"smooth"});
        });
      }
      diagram.after(panel);
    }
    function focusPair() {
      const points = climate.pairs[state.pair].names.map(name=>climate.stations[name].location);
      // Include enough surrounding land/sea for the wind direction to remain readable.
      map.fitBounds(L.latLngBounds(points).pad(.7),{paddingTopLeft:[70,100],paddingBottomRight:[70,160],maxZoom:8,animate:false});
    }
    function selectRiver(name) {
      if(state.theme !== "terrain" || !state.loaded || (name!=="all" && !data.rivers[name])) return;
      state.river = name; updateFlow(); renderToolbar(); renderInsight(); renderMarks();
      const selected = tracks.filter(track => name==="all" || (data.rivers[name].related || [name]).includes(track.name));
      if(selected.length) map.fitBounds(L.latLngBounds(selected.flatMap(track=>track.coordinates.map(([lng,lat])=>[lat,lng]))),{paddingTopLeft:[45,65],paddingBottomRight:[45,150],maxZoom:9,animate:false});
    }
    function setContext(theme,lesson) {
      if (theme === "terrain" && (state.theme !== theme || state.lesson?.id !== lesson?.id)) state.river = lesson?.id === "river" ? "남한강" : "all";
      state.theme = theme; state.lesson = lesson;
      mountain.setActive(mountainActive());
      coast.setActive(coastActive());
      updateFlow(); renderToolbar(); renderInsight(); renderMarks();
    }
    return {
      setContext, selectRiver, renderInsight,
      renderLesson(host,lesson,options) { return lesson.id === "foehn" && mountain.render(host,options); },
      setRivers(collection) { tracks = data.riverTracks(collection); water.setTracks(tracks); state.loaded = tracks.length>0; state.failed = !state.loaded; updateFlow(); renderToolbar(); renderInsight(); },
      failRivers() { state.failed = true; renderToolbar(); },
      destroy() { observer.disconnect(); mountain.destroy(); water.destroy(); coast.destroy(); flow.remove(); marks.remove(); toolbar.remove(); document.querySelector("#sceneInsight")?.remove(); }
    };
  }
  window.KoreaScene = {create};
})();
