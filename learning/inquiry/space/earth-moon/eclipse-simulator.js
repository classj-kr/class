(function () {
    'use strict';
    const G = window.EclipseGeometry;
    function mount(pane) {
        pane.classList.add('eclipse-lab');
        pane.innerHTML = `
            <div class="ecl-controls">
                <div class="ecl-modes" role="group" aria-label="식의 종류">
                    <button type="button" data-ecl-mode="solar" aria-pressed="true">일식</button>
                    <button type="button" data-ecl-mode="lunar" aria-pressed="false">월식</button>
                </div>
                <div class="ecl-options"><label><input type="checkbox" data-ecl-rays checked> 빛의 경로</label><label><input type="checkbox" data-ecl-labels checked> 명칭</label></div>
            </div>
            <div class="ecl-layout">
                <div class="ecl-diagram-panel">
                    <div class="ecl-arrangement" data-ecl-order></div>
                    <svg class="ecl-diagram" viewBox="0 0 960 500" role="img" aria-label="태양과 가리는 천체가 만드는 본그림자와 반그림자의 단면" data-ecl-diagram></svg>
                    <div class="ecl-legend"><span><i class="ecl-umbra-key"></i>본그림자 · 직접 오는 태양빛이 모두 가려짐</span><span><i class="ecl-penumbra-key"></i>반그림자 · 태양빛의 일부만 가려짐</span></div>
                </div>
                <aside class="ecl-observation">
                    <h2 data-ecl-view-title></h2>
                    <svg viewBox="0 0 280 260" class="ecl-view" role="img" data-ecl-view></svg>
                    <div class="ecl-result" aria-live="polite"><strong data-ecl-result></strong><p data-ecl-reason></p></div>
                </aside>
            </div>
            <div class="ecl-position">
                <label for="eclPosition" data-ecl-position-label></label>
                <input id="eclPosition" type="range" min="-86" max="86" value="0" step="1">
                <div class="ecl-presets" role="group" aria-label="위치 예시" data-ecl-presets></div>
            </div>
            <p class="ecl-note">크기·거리·이동은 원리를 보여 주기 위한 모형입니다. 본그림자·반그림자는 공간의 영역이며, 옆 그림은 그 단면입니다.</p>
            <details class="ecl-more"><summary>매달 식이 생기지 않는 이유</summary><p>달의 공전 궤도면은 지구의 공전 궤도면에 약 5° 기울어져 있습니다. 삭이나 보름이어도 달이 궤도면의 교점 부근에 있지 않으면 그림자가 빗나갑니다. 월식 모형에서 달을 그림자 밖으로 옮겨 비교하세요. 위치 조절값은 실제 궤도 경사각이 아닙니다.</p></details>
            <details class="ecl-more"><summary>금환일식과 반영월식</summary><p>달이 작게 보이면 태양을 전부 가리지 못해 금환일식이 일어날 수 있습니다. 이 일식 모형은 본그림자가 지구에 닿는 경우로 고정했습니다. 달이 지구의 반그림자만 통과하는 반영월식은 달이 조금 어두워지는 현상으로, 부분월식과 구분합니다.</p></details>`;
        let mode = 'solar';
        const slider = pane.querySelector('#eclPosition');
        const diagram = pane.querySelector('[data-ecl-diagram]');
        const view = pane.querySelector('[data-ecl-view]');
        const rays = pane.querySelector('[data-ecl-rays]');
        const labels = pane.querySelector('[data-ecl-labels]');
        const presetValues = { solar: [['본그림자', 0], ['반그림자', 38], ['그림자 밖', 86]], lunar: [['개기', 0], ['부분', 36], ['반영', 100], ['그림자 밖', 210]] };
        const f = value => Number(value.toFixed(3));
        const point = p => `${f(p.x)},${f(p.y)}`;
        const circle = (body, fill, extra = '') => `<circle cx="${body.x}" cy="${body.y}" r="${body.r}" fill="${fill}" ${extra}/>`;
        const text = (x, y, value, extra = '') => `<text x="${x}" y="${y}" text-anchor="middle" ${extra}>${value}</text>`;
        function geometry(body, endX) {
            const ou = G.tangent(G.SUN, body, false, 1), ol = G.tangent(G.SUN, body, false, -1);
            const pu = G.tangent(G.SUN, body, true, -1), pl = G.tangent(G.SUN, body, true, 1);
            const tip = G.SUN.x + (body.x - G.SUN.x) * G.SUN.r / (G.SUN.r - body.r);
            const umbraEnd = Math.min(endX, tip);
            const pen = [pu.b, {x:endX,y:pu.at(endX)}, {x:endX,y:pl.at(endX)}, pl.b].map(point).join(' ');
            const umb = [ou.b, {x:umbraEnd,y:ou.at(umbraEnd)}, {x:umbraEnd,y:ol.at(umbraEnd)}, ol.b].map(point).join(' ');
            return { pen, umb, rays: [ou,ol,pu,pl].map(ray => `<line x1="${f(ray.a.x)}" y1="${f(ray.a.y)}" x2="${endX}" y2="${f(ray.at(endX))}"/>`).join('') };
        }
        function draw() {
            const solarMode = mode === 'solar';
            const result = solarMode ? G.solar(slider.value) : G.lunar(slider.value);
            pane.dataset.eclipseMode = mode;
            pane.dataset.eclipseState = result.type;
            const blocker = solarMode ? G.SOLAR_MOON : G.LUNAR_EARTH;
            const receiver = solarMode ? G.SOLAR_EARTH : {...G.LUNAR_MOON, y:250+result.offset};
            const geo = geometry(blocker, solarMode ? G.SOLAR_EARTH.x : 920);
            const fills = `<polygon points="${geo.pen}" class="ecl-penumbra"/><polygon points="${geo.umb}" class="ecl-umbra"/>`;
            const nameLayer = labels.checked ? text(100,355,'태양') + text(blocker.x,solarMode?305:330,solarMode?'달':'지구') + text(receiver.x,solarMode?365:receiver.y+42,solarMode?'지구':'달') + text(solarMode?658:665,245,'본그림자','class="ecl-shadow-name"') + text(solarMode?665:665,solarMode?294:340,'반그림자','class="ecl-shadow-name"') : '';
            const marker = solarMode ? `<circle cx="${f(result.observer.x)}" cy="${f(result.observer.y)}" r="7" fill="#34d399" stroke="white" stroke-width="2"/><path d="M ${f(result.observer.x)} ${f(result.observer.y)} L 800 140" stroke="#34d399" stroke-dasharray="4 5" fill="none"/>${text(800,125,'관측자','class="ecl-observer-label"')}` : '';
            diagram.innerHTML = `<defs><clipPath id="eclReceiver">${circle(receiver,'white')}</clipPath><linearGradient id="eclEarth"><stop offset="0" stop-color="#38bdf8"/><stop offset=".48" stop-color="#177dc4"/><stop offset=".51" stop-color="#0d304f"/><stop offset="1" stop-color="#061727"/></linearGradient></defs>
                <line x1="190" y1="250" x2="915" y2="250" class="ecl-axis"/>
                ${fills}<g class="ecl-rays" ${rays.checked?'':'visibility="hidden"'}>${geo.rays}</g>
                ${circle(G.SUN,'#fbbf24')}${circle(blocker,solarMode?'#cbd5e1':'url(#eclEarth)')}${circle(receiver,solarMode?'url(#eclEarth)':'#e2e8f0')}
                <g clip-path="url(#eclReceiver)">${fills}</g>${marker}${nameLayer}`;
            let title, reason;
            if (solarMode) {
                title = {total:'개기일식',partial:'부분일식',annular:'금환일식',none:'이 위치에서는 일식 없음'}[result.type];
                reason = {total:'관측자가 달의 본그림자 안에 있어 태양 전체가 가려집니다.',partial:'관측자가 달의 반그림자 안에 있어 태양의 일부만 가려집니다.',annular:'달이 태양보다 작게 보여 태양 가장자리가 고리처럼 남습니다.',none:'관측자가 달의 그림자 밖에 있어 태양이 가려지지 않습니다.'}[result.type];
                const scale = 62 / result.sunAngle;
                const shift = (result.offset < 0 ? -1 : 1) * result.separation * scale;
                view.innerHTML = `<defs><clipPath id="eclSunView"><circle cx="140" cy="125" r="62"/></clipPath></defs><circle cx="140" cy="125" r="62" fill="#fbbf24"/><g clip-path="url(#eclSunView)"><circle cx="${f(140+shift)}" cy="125" r="${f(result.moonAngle*scale)}" fill="#030712"/></g><circle cx="140" cy="125" r="62" fill="none" stroke="#526078" stroke-width="1"/>${text(140,228,'관측 위치에 따라 다르게 보임')}`;
            } else {
                title = {total:'개기월식',partial:'부분월식',penumbral:'반영월식',none:'월식 없음'}[result.type];
                reason = {total:'달 전체가 지구의 본그림자 안에 들어갔습니다. 대기를 지난 붉은빛 때문에 붉게 보일 수 있습니다.',partial:'달의 일부만 지구의 본그림자 안에 들어갔습니다. 반그림자에만 들어간 경우와 다릅니다.',penumbral:'달이 지구의 반그림자만 지나 조금 어두워집니다. 본그림자에는 들어가지 않았습니다.',none:'달이 지구의 그림자를 벗어나 태양빛을 받습니다. 보름달이어도 월식이 일어나지 않을 수 있습니다.'}[result.type];
                const scale = 62/G.LUNAR_MOON.r;
                view.innerHTML = `<defs><clipPath id="eclMoonView"><circle cx="140" cy="125" r="62"/></clipPath></defs><circle cx="140" cy="125" r="62" fill="#e2e8f0"/><g clip-path="url(#eclMoonView)"><circle cx="140" cy="${f(125-result.offset*scale)}" r="${f(result.penumbra*scale)}" fill="#677180" opacity=".38"/><circle cx="140" cy="${f(125-result.offset*scale)}" r="${f(result.umbra*scale)}" fill="#703b30" opacity=".96"/></g>${text(140,228,'달이 보이는 밤인 지역에서 관측')}`;
            }
            pane.querySelector('[data-ecl-result]').textContent = title;
            pane.querySelector('[data-ecl-reason]').textContent = reason;
            view.setAttribute('aria-label', (solarMode?'지구 관측자에게 보이는 태양: ':'지구에서 보이는 달: ')+title);
            diagram.setAttribute('aria-label', `${solarMode?'태양–달–지구':'태양–지구–달'} 배열과 본그림자·반그림자. 현재 ${title}.`);
            slider.setAttribute('aria-valuetext', (solarMode?'관측자 위치: ':'달 위치: ')+title);
            pane.querySelectorAll('[data-ecl-position]').forEach(button => button.setAttribute('aria-pressed',String(Number(button.dataset.eclPosition)===Number(slider.value))));
        }
        function selectMode(next) {
            mode=next; slider.min=mode==='solar'?-86:-210; slider.max=mode==='solar'?86:210; slider.value=0;
            pane.querySelectorAll('[data-ecl-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.eclMode===mode)));
            pane.querySelector('[data-ecl-order]').textContent=mode==='solar'?'태양 → 달 → 지구 · 삭 무렵':'태양 → 지구 → 달 · 보름 무렵';
            pane.querySelector('[data-ecl-view-title]').textContent=mode==='solar'?'관측자에게 보이는 태양':'지구에서 보이는 달';
            pane.querySelector('[data-ecl-position-label]').textContent=mode==='solar'?'지구의 관측 위치':'달의 위치 · 그림자 중심에서 이동';
            pane.querySelector('[data-ecl-presets]').innerHTML=presetValues[mode].map(([label,value])=>`<button type="button" data-ecl-position="${value}">${label}</button>`).join('');
            draw();
        }
        pane.addEventListener('click',event=>{
            const modeButton=event.target.closest('[data-ecl-mode]');
            if(modeButton) selectMode(modeButton.dataset.eclMode);
            const positionButton=event.target.closest('[data-ecl-position]');
            if(positionButton){slider.value=positionButton.dataset.eclPosition;draw();}
        });
        slider.addEventListener('input',draw);rays.addEventListener('change',draw);labels.addEventListener('change',draw);
        selectMode('solar');
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
        figure.innerHTML='<svg viewBox="0 130 960 265" role="img" aria-label="태양, 달, 지구가 나란히 있다. 지구의 A는 중앙의 좁고 짙은 그림자 안에, B는 그 바깥의 옅은 그림자 안에 있다."><defs><clipPath id="eclQuizEarth"><circle cx="800" cy="250" r="88"/></clipPath></defs>'+cones+lines.map(l=>'<line x1="'+l.a.x+'" y1="'+l.a.y+'" x2="800" y2="'+l.at(800)+'" stroke="#f6cd76" stroke-width="1.5"/>').join('')+'<circle cx="100" cy="250" r="80" fill="#fbbf24"/><circle cx="580" cy="250" r="26" fill="#cbd5e1"/><circle cx="800" cy="250" r="88" fill="#278bc7"/><g clip-path="url(#eclQuizEarth)">'+cones+'</g><g fill="#f1f5f9" font-size="28" text-anchor="middle"><text x="100" y="370">태양</text><text x="580" y="312">달</text><text x="800" y="370">지구</text></g><g fill="#6ee7b7" stroke="#6ee7b7"><circle cx="'+a.x+'" cy="'+a.y+'" r="6"/><circle cx="'+b.x+'" cy="'+b.y+'" r="6"/><path d="M '+a.x+' '+a.y+' L 914 206 M '+b.x+' '+b.y+' L 914 302" fill="none" stroke-dasharray="4 4"/></g><g fill="#6ee7b7" font-size="30" font-weight="bold"><text x="922" y="214">A</text><text x="922" y="313">B</text></g></svg><figcaption>크기와 거리는 실제 비율이 아닙니다.</figcaption>';
        return figure;
    }
    window.EclipseLab={mount,questionFigure};
})();
