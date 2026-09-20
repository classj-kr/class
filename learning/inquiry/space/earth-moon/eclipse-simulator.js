(function () {
    'use strict';
    const G = window.EclipseGeometry;
    // Match the orange clothes and yellow hat used by createObserverMarker in app.js.
    // Local y=0 is the feet; rotate local up onto the surface normal.
    function observerMarkup(position, earth, scale = 1) {
        const rotation = Math.atan2(position.y-earth.y, position.x-earth.x)*180/Math.PI+90;
        return '<g class="ecl-person" transform="translate('+position.x+' '+position.y+') rotate('+rotation+') scale('+scale+')" aria-label="지표에 선 관측자">' +
            '<ellipse cx="0" cy="0" rx="10" ry="2.5" fill="#10b981" stroke="#6ee7b7" stroke-width="1"/>' +
            '<g stroke="#f97316" stroke-width="3.6" stroke-linecap="round"><path d="M -3 -12 L -4 -1 M 3 -12 L 4 -1 M -6 -23 L -10 -15 M 6 -23 L 10 -15"/></g>' +
            '<path d="M -5 -26 L 5 -26 L 7 -12 L -7 -12 Z" fill="#f97316" stroke="#ffad62" stroke-width="1"/>' +
            '<circle cx="0" cy="-31" r="5" fill="#ffb35c"/>' +
            '<path d="M -5 -36 L -4 -42 L 4 -42 L 5 -36 Z" fill="#facc15"/>' +
            '<path d="M -5 -36 L 5 -36" stroke="#7c2d12" stroke-width="2"/>' +
            '<path d="M -8 -35 L 8 -35" stroke="#facc15" stroke-width="3" stroke-linecap="round"/></g>';
    }
    const MOON_IMAGE = 'assets/images/moon-nearside-nasa.jpg';
    const PLANET_IMAGES = '../solar-system/assets/images/';
    const fmt = value => Number(value.toFixed(3));
    const svgCircle = (b, fill, more='') => `<circle cx="${b.x}" cy="${b.y}" r="${b.r}" fill="${fill}" ${more}/>`;
    const svgText = (x,y,value,more='') => `<text x="${x}" y="${y}" text-anchor="middle" ${more}>${value}</text>`;
    function shadowGeometry(source, body, endX) {
        const outer=[G.tangent(source,body,false,1),G.tangent(source,body,false,-1)];
        const inner=[G.tangent(source,body,true,-1),G.tangent(source,body,true,1)];
        const tip=source.x+(body.x-source.x)*source.r/(source.r-body.r);
        const polygon=(lines,end)=>[lines[0].b,{x:end,y:lines[0].at(end)},{x:end,y:lines[1].at(end)},lines[1].b].map(p=>`${fmt(p.x)},${fmt(p.y)}`).join(' ');
        return {pen:polygon(inner,endX),umb:polygon(outer,Math.min(endX,tip)),rays:[...outer,...inner].map(l=>`<line x1="${fmt(l.a.x)}" y1="${fmt(l.a.y)}" x2="${endX}" y2="${fmt(l.at(endX))}"/>`).join('')};
    }
    function mount(pane) {
        if(pane.eclipseCleanup) pane.eclipseCleanup();
        pane.classList.add('eclipse-lab');
        const presets={solar:[['개기',0],['부분',25],['식 없음',86]],lunar:[['개기',0],['부분',65],['반영',125],['식 없음',215]]};
        const titles={solar:{total:'개기일식',partial:'부분일식',annular:'금환일식',none:'일식 없음'},lunar:{total:'개기월식',partial:'부분월식',penumbral:'반영월식',none:'월식 없음'}};
        const reasons={solar:{total:'달의 본그림자 안 · 태양 전체가 가려짐',partial:'달의 반그림자 안 · 태양 일부가 가려짐',annular:'달이 작게 보여 태양 가장자리가 남음',none:'달의 그림자 밖 · 태양이 가려지지 않음'},lunar:{total:'달 전체가 지구의 본그림자 안 · 어두운 붉은 달',partial:'달의 일부가 지구의 본그림자 안',penumbral:'지구의 반그림자만 통과 · 약간 어두워짐',none:'지구의 그림자 밖 · 밝은 보름달'}};
        const card=mode=>`<section class="ecl-observation" data-ecl-card="${mode}" aria-label="${mode==='solar'?'일식':'월식'} 관측">
            <header class="ecl-card-heading"><h2>${mode==='solar'?'일식 <span>삭</span>':'월식 <span>보름</span>'}</h2><span>${mode==='solar'?'태양 → 달 → 지구':'태양 → 지구 → 달'}</span></header>
            <div class="ecl-sky"><canvas class="ecl-view" data-ecl-view="${mode}" width="720" height="360" role="img"></canvas><div class="ecl-sky-caption">${mode==='solar'?'낮인 지역의 관측자에게 보이는 태양':'밤인 지역에서 보이는 달'}</div></div>
            <div class="ecl-result" aria-live="polite"><strong data-ecl-result="${mode}"></strong><p data-ecl-reason="${mode}"></p></div>
            <div class="ecl-position"><button type="button" class="ecl-play" data-ecl-play="${mode}" aria-pressed="false" aria-label="${mode==='solar'?'일식':'월식'} 변화 재생">▶ 재생</button><label for="ecl-${mode}-position">${mode==='solar'?'관측 위치':'달 위치'}</label><input id="ecl-${mode}-position" type="range" data-ecl-slider="${mode}" min="0" max="${mode==='solar'?86:215}" value="0" step="1"><div class="ecl-presets" role="group" aria-label="${mode==='solar'?'일식':'월식'} 위치 예시">${presets[mode].map(([label,value])=>`<button type="button" data-ecl-preset="${mode}" data-value="${value}">${label}</button>`).join('')}</div></div>
        </section>`;
        pane.innerHTML=`<div class="ecl-content">
            <div class="ecl-controls"><span class="ecl-time-note">서로 다른 시점의 위치 비교</span><div class="ecl-options"><label><input type="checkbox" data-ecl-rays checked> 빛의 경로</label><label><input type="checkbox" data-ecl-labels checked> 명칭</label></div></div>
            <div class="ecl-diagram-panel"><svg class="ecl-diagram" viewBox="0 0 1120 400" role="img" data-ecl-diagram aria-label="태양은 왼쪽, 지구는 가운데. 지구 왼쪽의 달은 일식 때, 오른쪽의 달은 월식 때 위치이며 서로 다른 시점입니다."></svg></div>
            <div class="ecl-comparison">${card('solar')}${card('lunar')}</div>
            <details class="ecl-more"><summary>본그림자·반그림자와 모형 안내</summary><div class="ecl-info-grid"><p><b>본그림자</b> · 직접 오는 태양빛이 모두 가려지는 공간.<br><b>반그림자</b> · 태양빛의 일부만 가려지는 공간.</p><p>두 달은 서로 다른 시점의 위치입니다. 크기·거리·이동은 원리를 보여 주기 위한 모형이며 실제 비율이 아닙니다. 오른쪽 달의 이동은 그림자 통과를 비교하는 조작입니다.</p><p><b>매달 식이 생기지 않는 이유</b><br>달의 공전 궤도면이 지구의 공전 궤도면에 약 5° 기울어져 있어, 삭·보름이어도 대부분 그림자가 빗나갑니다.</p><p><b>금환일식과 반영월식</b><br>달이 작게 보이면 태양의 가장자리가 남는 금환일식이 생깁니다. 이 모형의 달 크기는 개기일식이 가능한 경우로 고정했습니다. 반영월식은 반그림자만 통과하며 부분월식과 다릅니다.</p></div></details>
        </div>`;
        const state={solar:0,lunar:0},playing={solar:false,lunar:false},direction={solar:1,lunar:1};
        const diagram=pane.querySelector('[data-ecl-diagram]'),rays=pane.querySelector('[data-ecl-rays]'),labels=pane.querySelector('[data-ecl-labels]');
        const refs=Object.fromEntries(['solar','lunar'].map(mode=>[mode,{card:pane.querySelector(`[data-ecl-card="${mode}"]`),canvas:pane.querySelector(`[data-ecl-view="${mode}"]`),slider:pane.querySelector(`[data-ecl-slider="${mode}"]`),result:pane.querySelector(`[data-ecl-result="${mode}"]`),reason:pane.querySelector(`[data-ecl-reason="${mode}"]`),play:pane.querySelector(`[data-ecl-play="${mode}"]`)}]));
        const moonImage=new Image();moonImage.onload=()=>draw();moonImage.src=MOON_IMAGE;
        const model=G.COMPARISON;
        const solarGeo=shadowGeometry(model.sun,model.newMoon,model.earth.x);
        const lunarGeo=shadowGeometry(model.sun,model.earth,1120);
        const cones=(geo,extra='')=>`<g ${extra}><polygon points="${geo.pen}" class="ecl-penumbra"/><polygon points="${geo.umb}" class="ecl-umbra"/></g>`;
        const texture=(body,file,id,crop)=>`<g clip-path="url(#${id})"><image href="${file}" x="${body.x-body.r*crop[0]}" y="${body.y-body.r*crop[1]}" width="${body.r*crop[2]}" height="${body.r*crop[2]}" preserveAspectRatio="none"/></g>`;
        const stars=Array.from({length:65},(_,i)=>{const x=(i*179.37+39)%1120,y=(i*97.71+18)%400;return `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${i%7===0?1:.5}" fill="#b8cbe4" opacity="${i%3===0?.32:.13}"/>`;}).join('');
        function drawModel(solar,lunar) {
            const fullMoon={...model.fullMoon,y:model.fullMoon.y+lunar.offset};
            const nightObserver={x:model.earth.x+model.earth.r,y:model.earth.y};
            const moonLabelY=fullMoon.y+46;
            diagram.innerHTML=`<defs>
                <clipPath id="eclEarthClip">${svgCircle(model.earth,'white')}</clipPath><clipPath id="eclNewMoonClip">${svgCircle(model.newMoon,'white')}</clipPath><clipPath id="eclFullMoonClip">${svgCircle(fullMoon,'white')}</clipPath><clipPath id="eclSourceClip">${svgCircle(model.sun,'white')}</clipPath>
                <radialGradient id="eclSourceHalo"><stop offset=".48" stop-color="#ffd179" stop-opacity=".2"/><stop offset="1" stop-color="#fda243" stop-opacity="0"/></radialGradient>
                <linearGradient id="eclNight"><stop offset="0" stop-color="#020611" stop-opacity="0"/><stop offset=".46" stop-color="#020611" stop-opacity="0"/><stop offset=".56" stop-color="#020611" stop-opacity=".72"/><stop offset="1" stop-color="#020611" stop-opacity=".93"/></linearGradient>
                <radialGradient id="eclSphere" cx="32%" cy="30%" r="72%"><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".65"/></radialGradient>
            </defs>${stars}
            <g class="ecl-world"><path d="M 178 250 H 1120" class="ecl-axis"/>
            ${cones(lunarGeo,'class="ecl-earth-shadow"')}${cones(solarGeo,'class="ecl-moon-shadow"')}
            <g class="ecl-rays" ${rays.checked?'':'visibility="hidden"'}>${lunarGeo.rays}${solarGeo.rays}</g>
            ${svgCircle({...model.sun,r:205},'url(#eclSourceHalo)')}${svgCircle(model.sun,'#ffba43')}${texture(model.sun,PLANET_IMAGES+'sun.jpg','eclSourceClip',[1.86,1.87,3.66])}
            ${svgCircle(model.earth,'#1676ad','stroke="#73caf9" stroke-opacity=".6" stroke-width="3"')}${texture(model.earth,PLANET_IMAGES+'earth.jpg','eclEarthClip',[1.46,1.47,2.94])}${svgCircle(model.earth,'url(#eclNight)')}
            <g clip-path="url(#eclEarthClip)">${cones(solarGeo)}</g>
            ${svgCircle(model.newMoon,'#adb6c1')}${texture(model.newMoon,MOON_IMAGE,'eclNewMoonClip',[1.025,1,2.05])}${svgCircle(model.newMoon,'url(#eclNight)')}
            ${svgCircle(fullMoon,'#cad0d7')}${texture(fullMoon,MOON_IMAGE,'eclFullMoonClip',[1.025,1,2.05])}<g clip-path="url(#eclFullMoonClip)"><polygon points="${lunarGeo.pen}" fill="#080b1d" opacity=".15"/><polygon points="${lunarGeo.umb}" fill="#87391e" opacity=".72"/></g>${svgCircle(fullMoon,'url(#eclSphere)')}
            ${observerMarkup(solar.observer,model.earth,.72)}${observerMarkup(nightObserver,model.earth,.72)}</g>
            ${labels.checked?`<g class="ecl-labels">${svgText(80,95,'태양','class="ecl-sun-label"')}${svgText(650,137,'지구')}${svgText(475,185,'일식 때 달','class="ecl-solar-label"')}${svgText(475,206,'삭','class="ecl-sub-label"')}${svgText(fullMoon.x,moonLabelY,'월식 때 달','class="ecl-lunar-label"')}${svgText(fullMoon.x,moonLabelY+21,'보름','class="ecl-sub-label"')}${svgText(620,369,'낮','class="ecl-observer-label"')}${svgText(690,369,'밤','class="ecl-observer-label"')}
            <path d="M 550 312 L 591 250 M 515 352 L 535 280 M 1025 249 L 990 260 M 1025 355 L 982 348" class="ecl-label-leader"/>
            ${svgText(548,332,'본그림자','class="ecl-shadow-name"')}${svgText(510,374,'반그림자','class="ecl-shadow-name"')}${svgText(1040,242,'본그림자','class="ecl-shadow-name"')}${svgText(1040,376,'반그림자','class="ecl-shadow-name"')}</g>`:''}`;
        }
        function paintSky(mode,result) {
            const canvas=refs[mode].canvas,ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
            const cx=w/2,cy=h/2,r=120;
            ctx.clearRect(0,0,w,h);ctx.fillStyle='#02050b';ctx.fillRect(0,0,w,h);
            const disc=(x,y,radius)=>{ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);};
            if(mode==='solar') {
                const total=result.type==='total';
                if(total) {
                    const halo=ctx.createRadialGradient(cx,cy,r*.94,cx,cy,r*2.15);
                    halo.addColorStop(0,'rgba(242,247,255,.85)');halo.addColorStop(.12,'rgba(207,225,255,.45)');halo.addColorStop(.5,'rgba(187,207,235,.09)');halo.addColorStop(1,'rgba(160,185,225,0)');
                    ctx.fillStyle=halo;disc(cx,cy,r*2.15);ctx.fill();
                    ctx.save();ctx.translate(cx,cy);ctx.globalCompositeOperation='screen';
                    for(let i=0;i<260;i++) {
                        const a=i*2.39996323,reach=r*(1.3+.48*(.5+.5*Math.sin(i*4.31))+.44*Math.abs(Math.cos(a*2)));
                        const inner=r*(1.01+.05*Math.sin(i)),bend=.035*Math.sin(i*2.7);
                        const ray=ctx.createLinearGradient(Math.cos(a)*inner,Math.sin(a)*inner,Math.cos(a+bend)*reach,Math.sin(a+bend)*reach);
                        ray.addColorStop(0,'rgba(234,244,255,.24)');ray.addColorStop(.36,'rgba(203,219,246,.07)');ray.addColorStop(1,'rgba(190,211,240,0)');
                        ctx.strokeStyle=ray;ctx.lineWidth=.7+(i%4)*.65;ctx.beginPath();ctx.moveTo(Math.cos(a)*inner,Math.sin(a)*inner);ctx.quadraticCurveTo(Math.cos(a+.018)*r*1.23,Math.sin(a+.018)*r*1.23,Math.cos(a+bend)*reach,Math.sin(a+bend)*reach);ctx.stroke();
                    }ctx.restore();
                }
                const face=ctx.createRadialGradient(cx-r*.23,cy-r*.23,r*.1,cx,cy,r);
                face.addColorStop(0,'#fff6cf');face.addColorStop(.72,'#ffe6a2');face.addColorStop(1,'#f3b855');
                ctx.fillStyle=face;disc(cx,cy,r);ctx.fill();
                ctx.save();disc(cx,cy,r);ctx.clip();
                for(let i=0;i<1800;i++){const a=i*2.39996323,rr=r*Math.sqrt(i/1800);ctx.fillStyle=i%3?'rgba(160,85,20,.045)':'rgba(255,255,255,.16)';ctx.fillRect(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,1.5,1.5);}ctx.restore();
                // Apparent angular sizes and separation come from the same geometry as the observer.
                if(result.type!=='none') {const scale=r/result.sunAngle,shift=result.separation*scale;ctx.fillStyle='#02040a';disc(cx,cy+shift,result.moonAngle*scale);ctx.fill();}
            } else {
                ctx.save();disc(cx,cy,r);ctx.clip();ctx.fillStyle='#c5cbd0';ctx.fillRect(cx-r,cy-r,r*2,r*2);
                if(moonImage.complete&&moonImage.naturalWidth)ctx.drawImage(moonImage,cx-r*1.025,cy-r,r*2.05,r*2);
                const scale=r/model.fullMoon.r,shadowY=cy-result.offset*scale;
                // Red light dims the surface; its texture remains visible, unlike a luminous ring.
                const pen=ctx.createRadialGradient(cx,shadowY,result.umbra*scale,cx,shadowY,result.penumbra*scale);
                pen.addColorStop(0,'rgba(5,9,24,.22)');pen.addColorStop(.7,'rgba(5,9,24,.13)');pen.addColorStop(1,'rgba(5,9,24,0)');
                ctx.fillStyle=pen;ctx.fillRect(cx-r,cy-r,r*2,r*2);
                ctx.save();disc(cx,shadowY,result.umbra*scale);ctx.clip();
                ctx.globalCompositeOperation='multiply';const red=ctx.createRadialGradient(cx,shadowY,0,cx,shadowY,result.umbra*scale);red.addColorStop(0,'#ad4827');red.addColorStop(.68,'#c56842');red.addColorStop(1,'#d98a59');ctx.fillStyle=red;ctx.fillRect(cx-r,cy-r,r*2,r*2);ctx.restore();
                const limb=ctx.createRadialGradient(cx-r*.12,cy-r*.12,r*.4,cx,cy,r);limb.addColorStop(0,'rgba(0,0,0,0)');limb.addColorStop(1,'rgba(0,0,0,.3)');ctx.fillStyle=limb;ctx.fillRect(cx-r,cy-r,r*2,r*2);ctx.restore();
            }
            canvas.setAttribute('aria-label',(mode==='solar'?'지구 관측자에게 보이는 태양: ':'지구에서 보이는 달: ')+titles[mode][result.type]);
        }
        function draw() {
            const results={solar:G.comparisonSolar(-state.solar),lunar:G.comparisonLunar(-state.lunar)};
            pane.dataset.eclipseSolarState=results.solar.type;pane.dataset.eclipseLunarState=results.lunar.type;
            drawModel(results.solar,results.lunar);
            for(const mode of ['solar','lunar']){
                const ref=refs[mode],result=results[mode];
                if(ref.result.textContent!==titles[mode][result.type]){ref.result.textContent=titles[mode][result.type];ref.reason.textContent=reasons[mode][result.type];}
                ref.card.dataset.state=result.type;ref.slider.value=state[mode];ref.slider.setAttribute('aria-valuetext',titles[mode][result.type]);
                ref.card.querySelectorAll('[data-ecl-preset]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.value)===Math.round(state[mode]))));
                paintSky(mode,result);
            }
        }
        let frame=0,lastTime=0;
        function setPlaying(mode,value) {playing[mode]=value;refs[mode].play.textContent=value?'Ⅱ 멈춤':'▶ 재생';refs[mode].play.setAttribute('aria-pressed',String(value));refs[mode].play.setAttribute('aria-label',(mode==='solar'?'일식':'월식')+' 변화 '+(value?'멈춤':'재생'));}
        function tick(now){frame=0;if(!playing.solar&&!playing.lunar)return;const dt=Math.min((now-lastTime)/1000,.1);if(now-lastTime>=40){lastTime=now;for(const mode of ['solar','lunar'])if(playing[mode]){const max=mode==='solar'?86:215;state[mode]+=direction[mode]*dt*(mode==='solar'?12:27);if(state[mode]>=max){state[mode]=max;direction[mode]=-1;}if(state[mode]<=0){state[mode]=0;direction[mode]=1;}}draw();}frame=requestAnimationFrame(tick);}
        pane.addEventListener('input',event=>{const mode=event.target.dataset.eclSlider;if(mode){state[mode]=Number(event.target.value);setPlaying(mode,false);draw();}});
        pane.addEventListener('click',event=>{const preset=event.target.closest('[data-ecl-preset]');if(preset){const mode=preset.dataset.eclPreset;state[mode]=Number(preset.dataset.value);setPlaying(mode,false);draw();}const play=event.target.closest('[data-ecl-play]');if(play){const mode=play.dataset.eclPlay;setPlaying(mode,!playing[mode]);if(!frame&&(playing.solar||playing.lunar)){lastTime=performance.now();frame=requestAnimationFrame(tick);}}});
        rays.addEventListener('change',draw);labels.addEventListener('change',draw);
        const pause=()=>{if(document.hidden||document.body.dataset.topicView!=='observe'){setPlaying('solar',false);setPlaying('lunar',false);cancelAnimationFrame(frame);frame=0;}};
        document.addEventListener('visibilitychange',pause);const visibility=new MutationObserver(pause);visibility.observe(document.body,{attributes:true,attributeFilter:['data-topic-view']});
        pane.eclipseCleanup=()=>{cancelAnimationFrame(frame);visibility.disconnect();document.removeEventListener('visibilitychange',pause);moonImage.onload=null;};
        draw();
    }
    function questionFigure(kind) {
        if (kind !== 'solar-observers') return null;
        const body = G.SOLAR_MOON, end = G.SOLAR_EARTH.x;
        const lines = [G.tangent(G.SUN,body,false,1),G.tangent(G.SUN,body,false,-1),G.tangent(G.SUN,body,true,-1),G.tangent(G.SUN,body,true,1)];
        const polygon = (a,b,color) => '<polygon points="'+a.b.x+','+a.b.y+' '+end+','+a.at(end)+' '+end+','+b.at(end)+' '+b.b.x+','+b.b.y+'" fill="'+color+'"/>';
        const cones = polygon(lines[2],lines[3],'#71819b')+polygon(lines[0],lines[1],'#233d69');
        const a=G.solar(0).observer,b=G.solar(38).observer;
        const figure = document.createElement('figure');
        figure.className='ecl-quiz-figure';
        figure.innerHTML='<svg viewBox="-20 130 980 265" role="img" aria-label="태양, 달, 지구가 나란히 있다. 지구의 A는 중앙의 좁고 짙은 그림자 안에, B는 그 바깥의 옅은 그림자 안에 있다."><defs><clipPath id="eclQuizEarth"><circle cx="800" cy="250" r="88"/></clipPath></defs>'+cones+lines.map(l=>'<line x1="'+l.a.x+'" y1="'+l.a.y+'" x2="800" y2="'+l.at(800)+'" stroke="#f6cd76" stroke-width="1.5"/>').join('')+'<circle cx="'+G.SUN.x+'" cy="'+G.SUN.y+'" r="'+G.SUN.r+'" fill="#fbbf24"/><circle cx="580" cy="250" r="26" fill="#cbd5e1"/><circle cx="800" cy="250" r="88" fill="#278bc7"/><g clip-path="url(#eclQuizEarth)">'+cones+'</g><g fill="#f1f5f9" font-size="28" text-anchor="middle"><text x="100" y="370">태양</text><text x="580" y="312">달</text><text x="800" y="370">지구</text></g><g fill="#6ee7b7" stroke="#6ee7b7">'+observerMarkup(a,G.SOLAR_EARTH,.85)+observerMarkup(b,G.SOLAR_EARTH,.85)+'<path d="M '+a.x+' '+a.y+' L 914 206 M '+b.x+' '+b.y+' L 914 302" fill="none" stroke-dasharray="4 4"/></g><g fill="#6ee7b7" font-size="30" font-weight="bold"><text x="922" y="214">A</text><text x="922" y="313">B</text></g></svg><figcaption>크기와 거리는 실제 비율이 아닙니다.</figcaption>';
        return figure;
    }
    window.EclipseLab={mount,questionFigure};
})();
