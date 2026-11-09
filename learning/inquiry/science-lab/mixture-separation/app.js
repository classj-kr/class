document.addEventListener('DOMContentLoaded', () => {
    const magnetBtn = document.getElementById('magnetBtn');
    const waterBtn = document.getElementById('waterBtn');
    const sieveBtn = document.getElementById('sieveBtn');
    const meshRange = document.getElementById('meshRange');
    const graphGroup = document.getElementById('graphGroup');
    const meshOutput = document.getElementById('meshOutput');
    const resetBtn = document.getElementById('resetBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const resultLeft = document.getElementById('resultLeft');
    const resultDone = document.getElementById('resultDone');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const mixtureGroup = document.getElementById('mixtureGroup');
    const trayGroup = document.getElementById('trayGroup');
    const waterGroup = document.getElementById('waterGroup');
    const toolGroup = document.getElementById('toolGroup');
    const propertyTable = document.getElementById('propertyTable');

    // Real grain sizes in mm and densities in g/cm³. The sieve decision uses
    // these numbers, not the drawn radii — the drawing has to compress a 27x
    // size range to stay visible, and the page says so.
    const SUBSTANCES = [
        { id: 'iron', name: '철가루',      mm: 0.3, density: 7.9,  magnetic: true,  soluble: false, color: '#8a8f98' },
        { id: 'salt', name: '소금',        mm: 0.4, density: 2.2,  magnetic: false, soluble: true,  color: '#eef2f5' },
        { id: 'sand', name: '모래',        mm: 0.5, density: 2.6,  magnetic: false, soluble: false, color: '#c8a97a' },
        { id: 'foam', name: '스타이로폼',  mm: 6,   density: 0.05, magnetic: false, soluble: false, color: '#f2f4f6' },
        { id: 'bean', name: '콩',          mm: 8,   density: 1.3,  magnetic: false, soluble: false, color: '#d5b25e' },
    ];
    const GRAINS_PER = { iron: 7, salt: 7, sand: 7, foam: 3, bean: 3 };

    // 체 구멍은 실제 알갱이 크기(0.3 · 0.4 · 0.5 · 6 · 8 mm) 사이사이에 눈금을
    // 두어야 뜻이 있다. 예전에는 1 mm부터 시작해 가루 셋이 언제나 한꺼번에
    // 빠져나갔고, 그래서 구멍을 바꿔도 결과가 같았다.
    const MESH_STOPS = [0.2, 0.35, 0.45, 0.6, 1, 2, 4, 7, 9];
    const meshMm = () => MESH_STOPS[Number(meshRange.value)];

    const BOWL = { x0: 44, x1: 192, yTop: 96, yBottom: 252 };
    const TRAY = { x: 244, w: 200, yTop: 40, h: 52, gap: 8 };

    let batch=0,revision=0;
    const tried = new Set();   // tools already used: their column in the table is filled in
    let separated = [];     // [{id, method}] in the order they came out
    let grains = [];        // one entry per drawn grain

    // Korean particles agree with the final consonant of the preceding word:
    // 철가루가/콩이, 모래를/콩을, 소금은/모래는. Substance names are assembled
    // into sentences at runtime, so these can't be written inline. For a
    // comma-joined list the particle follows the last item.
    function hasBatchim(phrase) {
        const w = phrase.trim();
        const code = w.charCodeAt(w.length - 1);
        if (code < 0xac00 || code > 0xd7a3) return false;
        return (code - 0xac00) % 28 !== 0;
    }
    const subjectP = w => (hasBatchim(w) ? '이' : '가');   // 이/가
    const objectP  = w => (hasBatchim(w) ? '을' : '를');   // 을/를
    const topicP   = w => (hasBatchim(w) ? '은' : '는');   // 은/는

    const remaining = () => SUBSTANCES.filter(s => !separated.some(v => s.id === v.id));
    const isSeparated = id => separated.some(v => v.id === id);
    const drawRadius = mm => 3.4 + 3.2 * Math.sqrt(mm);

    function buildGrains() {
        grains = [];
        SUBSTANCES.forEach(s => {
            for (let i = 0; i < GRAINS_PER[s.id]; i += 1) {
                grains.push({ sub: s.id, key: `${s.id}-${i}`, i });
            }
        });
        // Deterministic pile on the beaker floor: each grain drops at a random x and comes to rest
        // on whatever is already below it, so the mixture forms a heap instead of floating in the air.
        let seed = 7;
        const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
        const order = grains.map(g => ({ g, k: rnd() })).sort((a, b) => a.k - b.k).map(o => o.g);
        const placed = [];
        const mid = (BOWL.x0 + BOWL.x1) / 2, half = (BOWL.x1 - BOWL.x0) / 2;
        order.forEach(g => {
            const s = SUBSTANCES.find(x => x.id === g.sub);
            const r = drawRadius(s.mm);
            const x = mid + (rnd() * 2 - 1) * (half - r - 2) * (0.55 + 0.45 * rnd());
            let y = BOWL.yBottom - r;
            placed.forEach(q => {
                const dx = Math.abs(q.x - x);
                if (dx < q.r + r) { const top = q.y - Math.sqrt((q.r + r) ** 2 - dx * dx); if (top < y) y = top; }
            });
            g.homeX = x; g.homeY = y; g.restX = x; g.restY = y; placed.push({ x, y, r });
        });
        mixtureGroup.innerHTML = grains.map(g => {
            const s = SUBSTANCES.find(x => x.id === g.sub);
            const r = drawRadius(s.mm);
            const shape = s.id === 'bean'
                ? `<ellipse class="grain" id="g-${g.key}" cx="${g.homeX.toFixed(1)}" cy="${g.homeY.toFixed(1)}" rx="${(r * 1.15).toFixed(1)}" ry="${(r * 0.85).toFixed(1)}" fill="${s.color}" stroke="#8a6a2a" stroke-width="1"/>`
                : s.id === 'salt'
                    ? `<rect class="grain" id="g-${g.key}" x="${(g.homeX - r * 0.85).toFixed(1)}" y="${(g.homeY - r * 0.85).toFixed(1)}" width="${(r * 1.7).toFixed(1)}" height="${(r * 1.7).toFixed(1)}" rx="1" fill="${s.color}" stroke="#94a3b8" stroke-width="1"/>`
                    : `<circle class="grain" id="g-${g.key}" cx="${g.homeX.toFixed(1)}" cy="${g.homeY.toFixed(1)}" r="${r.toFixed(1)}" fill="${s.color}" stroke="${s.id === 'foam' ? '#94a3b8' : 'rgba(0,0,0,.35)'}" stroke-width="1"/>`;
            return shape;
        }).join('');
    }


    // Gravity: grains still in the beaker drop straight down onto whatever is left beneath them,
    // so taking some substances out never leaves others hanging in mid-air.
    function settle() {
        const inBeaker = grains.filter(g => !isSeparated(g.sub)).sort((a, b) => b.homeY - a.homeY);
        const placed = [];
        inBeaker.forEach(g => {
            const r = drawRadius(SUBSTANCES.find(x => x.id === g.sub).mm);
            // a grain rolls a little sideways into the lowest nearby gap instead of balancing on a peak
            const restAt = x => { let y = BOWL.yBottom - r; placed.forEach(q => { const dx = Math.abs(q.x - x); if (dx < q.r + r) { const top = q.y - Math.sqrt((q.r + r) ** 2 - dx * dx); if (top < y) y = top; } }); return y; };
            let bestX = g.homeX, bestY = restAt(g.homeX);
            for (let k = 1; k <= 14; k += 1) for (const sgn of [-1, 1]) {
                const x = g.homeX + sgn * k * 2;
                if (x < BOWL.x0 + r || x > BOWL.x1 - r) continue;
                const y = restAt(x);
                if (y > bestY + 0.5) { bestX = x; bestY = y; }
            }
            g.restX = bestX; g.restY = bestY; placed.push({ x: bestX, y: bestY, r });
        });
    }

    /* --------------------------------------------- 도구가 하는 일을 보여 준다 */
    /* 자석은 내려와 철가루만 끌어 올리고, 물은 부어지며 차올라 소금을 녹이고
       스타이로폼을 띄우고, 체는 알갱이를 받아 흔들어 작은 것만 떨어뜨린다.
       동작이 끝난 뒤에야 물질이 그릇에서 접시로 옮겨 간다. */
    const SLOW = !window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let acting = false;

    const grainEls = id => grains.filter(g => g.sub === id).map(g => document.getElementById(`g-${g.key}`));
    const grainOf = el => grains.find(x => `g-${x.key}` === el.id);
    const setShift = (el, dx, dy, extra = '') => {
        el.setAttribute('transform', `translate(${dx.toFixed(1)} ${dy.toFixed(1)})`);
        if (extra) el.setAttribute('style', extra);
    };
    const still = el => { el.style.transition = 'none'; };

    function setBusy(on) {
        [magnetBtn, waterBtn, sieveBtn].forEach(b => { b.disabled = on || remaining().length === 0; });
        document.querySelectorAll('[data-open-group],[data-recover-group]').forEach(b=>b.disabled=on);
    }

    function clearApparatus() {
        waterGroup.innerHTML = '';
        toolGroup.innerHTML = '';
        const hidden = new Set(storedGroups().filter(g => g.dissolved).flatMap(g => g.ids));
        grains.forEach(g => {
            const el = document.getElementById(`g-${g.key}`);
            if (el) { el.removeAttribute('style'); if (hidden.has(g.sub)) el.style.opacity = '0'; }
        });
    }

    const MID_X = (BOWL.x0 + BOWL.x1) / 2;
    const ease = u => u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;

    const wait = ms => {const token=revision;return new Promise((resolve,reject)=>setTimeout(()=>token===revision?resolve():reject(new DOMException('Reset cancelled the old operation','AbortError')),SLOW?ms:0));};
    // Frame-by-frame motion; a reset cancels it like wait().
    const tween = (ms, fn) => { const token = revision; return new Promise((resolve, reject) => {
        if (!SLOW) { fn(1); resolve(); return; }
        const t0 = performance.now();
        const step = now => { if (token !== revision) { reject(new DOMException('Reset cancelled the old operation', 'AbortError')); return; }
            const u = Math.min(1, (now - t0) / ms); fn(u); if (u < 1) requestAnimationFrame(step); else resolve(); };
        requestAnimationFrame(step); }); };

    function drawMagnet(y) {
        // bar magnet held by a handle: red N end at the bottom does the picking up
        return `<g class="magnet-bar" transform="translate(${MID_X - 16} ${y.toFixed(1)})">` +
               `<rect x="12" y="-70" width="8" height="34" rx="3" fill="#a16207"/>` +
               `<rect x="0" y="-40" width="32" height="30" rx="3" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="1.4"/>` +
               `<rect x="0" y="-10" width="32" height="30" rx="3" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.4"/>` +
               `<text x="16" y="-20" text-anchor="middle" class="magnet-pole">S</text><text x="16" y="10" text-anchor="middle" class="magnet-pole">N</text></g>`;
    }

    async function playMagnet(picked) {
        toolGroup.innerHTML = drawMagnet(-30);
        const magnet = toolGroup.firstChild;
        const low = BOWL.yTop + 34;   // the magnet's bottom face hangs just above the heap
        await tween(700, u => magnet.setAttribute('transform', `translate(${MID_X - 16} ${(-30 + (low - -30) * ease(u)).toFixed(1)})`));
        // iron grains jump up one after another and cling to the N end
        const els = picked.flatMap(s => grainEls(s.id));
        els.forEach(still);
        const targets = els.map((el, i) => { const g = grainOf(el); return { el, g, tx: MID_X - 13 + (i % 5) * 6.5, ty: low + 24 + Math.floor(i / 5) * 5, delay: i * 0.07 }; });
        await tween(1100, u => targets.forEach(t => {
            const v = Math.max(0, Math.min(1, (u - t.delay) / 0.45)), e = v * v;
            const x = t.g.restX + (t.tx - t.g.restX) * e, y = t.g.restY + (t.ty - t.g.restY) * e - Math.sin(Math.PI * v) * 6;
            setShift(t.el, x - t.g.homeX, y - t.g.homeY);
        }));
        await wait(250);
        // lift the magnet with the iron stuck to it
        await tween(700, u => { const dy = -110 * ease(u);
            magnet.setAttribute('transform', `translate(${MID_X - 16} ${(low + dy).toFixed(1)})`);
            targets.forEach(t => setShift(t.el, t.tx - t.g.homeX, t.ty + dy - t.g.homeY)); });
        await wait(200);
    }

    async function playWater(dissolved, floated) {
        const surface = BOWL.yTop + 10, bottom = BOWL.yBottom;
        const L = BOWL.x0 - 4, W = BOWL.x1 - BOWL.x0 + 8;
        // a jug tips over the rim and pours; the stream feeds a rising water level
        waterGroup.innerHTML = `<rect class="water-body" x="${L}" y="${bottom}" width="${W}" height="0"/>` +
            `<g class="jug"><path d="M0,0 L44,0 L40,46 Q39,52 33,52 L11,52 Q5,52 4,46 Z M44,6 Q56,8 54,22" fill="rgba(186,224,238,.55)" stroke="#5b8fa3" stroke-width="2"/><rect x="5" y="20" width="35" height="30" fill="rgba(56,189,248,.4)"/></g>` +
            `<path class="stream" d="" fill="none" stroke="rgba(56,189,248,.65)" stroke-width="5" stroke-linecap="round"/>`;
        const body = waterGroup.querySelector('.water-body'), jug = waterGroup.querySelector('.jug'), stream = waterGroup.querySelector('.stream');
        const JX = BOWL.x1 + 6, JY = BOWL.yTop - 76;
        await tween(450, u => jug.setAttribute('transform', `translate(${JX} ${JY}) rotate(${(-62 * ease(u)).toFixed(1)} 0 52)`));
        const sinkers = remaining().filter(s => !s.soluble && s.density >= 1);
        const foamEls = floated.flatMap(s => grainEls(s.id)), saltEls = dissolved.flatMap(s => grainEls(s.id));
        [...foamEls, ...saltEls].forEach(still);
        const lipX = JX - 46, lipY = JY + 28;
        await tween(1500, u => {
            const level = bottom - (bottom - surface) * ease(u);
            body.setAttribute('y', level.toFixed(1)); body.setAttribute('height', (bottom - level).toFixed(1));
            stream.setAttribute('d', u < 0.96 ? `M${lipX},${lipY} Q${lipX - 14},${lipY + 20} ${lipX - 18},${level.toFixed(1)}` : '');
            // foam lifts off the heap as soon as the water reaches it and rides the surface
            foamEls.forEach((el, i) => { const g = grainOf(el), r = 7;
                const y = Math.min(g.restY, level - r * 0.4 + Math.sin(u * 9 + i) * 1.2);
                setShift(el, g.restX - g.homeX, y - g.homeY); });
            // salt crystals shrink and fade once they are under water
            saltEls.forEach(el => { const g = grainOf(el); const under = g.restY > level ? Math.min(1, (u - (bottom - g.restY) / (bottom - surface)) * 2.2) : 0;
                el.style.opacity = String(Math.max(0, 1 - Math.max(0, under)).toFixed(2)); });
        });
        stream.setAttribute('d', '');
        await tween(400, u => jug.setAttribute('transform', `translate(${JX} ${JY}) rotate(${(-62 * (1 - ease(u))).toFixed(1)} 0 52)`));
        // the water turns faintly cloudy-clear: salt is in it now, not gone
        await tween(700, u => foamEls.forEach((el, i) => { const g = grainOf(el); setShift(el, g.restX - g.homeX + (BOWL.x0 + 30 + i * 32 - g.restX) * ease(u), surface - 3 + Math.sin(u * 6 + i) * 1.5 - g.homeY); }));
        void sinkers;
        await wait(500);
    }

    function drawSieve(y, mesh) {
        // a round kitchen sieve seen from the side: rim, mesh and handle; mesh spacing follows the hole size (log scale)
        const gap = 4 + 9 * (Math.log(mesh / 0.2) / Math.log(9 / 0.2));
        const L = BOWL.x0 - 2, R = BOWL.x1 + 2;
        let net = '';
        for (let x = L + 6; x < R - 4; x += gap) net += `<line x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="22" stroke="#94a3b8" stroke-width="1"/>`;
        return `<g class="sieve-tool" transform="translate(0 ${y.toFixed(1)})">` +
               `<path d="M${L},0 Q${MID_X},40 ${R},0" fill="rgba(148,163,184,.15)" stroke="#64748b" stroke-width="1.5"/>` +
               `<clipPath id="sieveNetClip"><path d="M${L},0 Q${MID_X},40 ${R},0 Z"/></clipPath><g clip-path="url(#sieveNetClip)">${net}</g>` +
               `<rect x="${L - 4}" y="-6" width="${R - L + 8}" height="7" rx="3" fill="#475569"/>` +
               `<rect x="${R + 4}" y="-5" width="46" height="5" rx="2.5" fill="#334155"/></g>`;
    }

    async function playSieve(picked, mesh) {
        const y = BOWL.yTop - 6;
        toolGroup.innerHTML = drawSieve(-60, mesh);
        const sieve = toolGroup.firstChild;
        await tween(500, u => sieve.setAttribute('transform', `translate(0 ${(-60 + (y + 60) * ease(u)).toFixed(1)})`));
        // the whole mixture is poured onto the sieve
        const left = remaining(), all = left.flatMap(s => grainEls(s.id).map(el => ({ el, s })));
        all.forEach(o => still(o.el));
        const spots = all.map((o, i) => { const g = grainOf(o.el); return { ...o, g, sx: BOWL.x0 + 12 + ((i * 37) % 124), sy: y + 10 + ((i * 11) % 9) }; });
        await tween(800, u => spots.forEach(o => { const e = ease(u); setShift(o.el, o.g.restX - o.g.homeX + (o.sx - o.g.restX) * e, o.g.restY - o.g.homeY + (o.sy - o.g.restY) * e - Math.sin(Math.PI * u) * 24); }));
        // shake; grains smaller than the holes drop through to the beaker floor
        const falls = new Set(picked.map(s => s.id));
        await tween(1300, u => {
            const dx = Math.sin(u * Math.PI * 10) * 6 * (1 - u * 0.4);
            sieve.setAttribute('transform', `translate(${dx.toFixed(1)} ${y})`);
            spots.forEach((o, i) => {
                if (falls.has(o.s.id)) {
                    const v = Math.max(0, Math.min(1, (u - 0.15 - (i % 7) * 0.05) / 0.5));
                    const fy = o.sy + (o.g.restY - o.sy) * v * v;
                    setShift(o.el, o.sx + dx - o.g.homeX, fy - o.g.homeY);
                } else setShift(o.el, o.sx + dx - o.g.homeX, o.sy - o.g.homeY);
            });
        });
        await wait(450);
    }

    function trayRect(index) {
        return { x: TRAY.x, y: TRAY.yTop + index * (TRAY.h + TRAY.gap), w: TRAY.w, h: TRAY.h };
    }

    function storedGroups(){
        const groups=[];for(const entry of separated){let g=groups.find(g=>g.key===entry.group);if(!g){g={key:entry.group,method:entry.method,dissolved:!!entry.dissolved,ids:[]};groups.push(g);}g.ids.push(entry.id);}return groups;
    }
    function storeGroup(items,method,dissolved=false){if(!items.length)return;const group=++batch;items.forEach(s=>separated.push({id:s.id,method,group,dissolved}));}
    function complete(){return remaining().length<=1&&storedGroups().every(g=>g.ids.length===1&&!g.dissolved);}
    function selectGroup(key){
        if(acting)return;const group=storedGroups().find(g=>g.key===key);if(!group||group.dissolved)return;
        const current=remaining();separated=separated.filter(e=>e.group!==key);storeGroup(current,'다시 나눌 때 보관');
        stageCaption.textContent=group.ids.map(id=>SUBSTANCES.find(s=>s.id===id).name).join('·')+' 무리를 왼쪽 그릇으로 옮겼습니다. 다른 조건으로 다시 분리하세요.';render();
    }
    function handleCancellation(error){if(error.name!=='AbortError')throw error;}
    function render() {
        const groups=storedGroups();settle();
        trayGroup.innerHTML=groups.map((group,idx)=>{const r=trayRect(idx),name=group.dissolved?'소금물':group.ids.length>1?'섞인 무리 · '+group.ids.length+'가지':SUBSTANCES.find(s=>s.id===group.ids[0]).name;
            return '<rect class="tray-box" x="'+r.x+'" y="'+r.y+'" width="'+r.w+'" height="'+r.h+'" rx="8"/>'+
              (group.dissolved?'<rect x="'+(r.x+125)+'" y="'+(r.y+12)+'" width="62" height="32" rx="3" fill="#a7d4e8"/>':'')+
              '<text class="tray-label" x="'+(r.x+10)+'" y="'+(r.y+21)+'">'+name+'</text><text class="tray-method" x="'+(r.x+10)+'" y="'+(r.y+39)+'">'+(group.dissolved?'소금 회수 전':group.ids.length>1?'다시 분리 필요':'한 물질')+'</text>';
        }).join('');
        grains.forEach(g=>{
            const el=document.getElementById('g-'+g.key),idx=groups.findIndex(b=>b.ids.includes(g.sub));el.style.opacity='';
            if(idx===-1){el.setAttribute('transform','translate('+(g.restX-g.homeX).toFixed(1)+' '+(g.restY-g.homeY).toFixed(1)+')');return;}
            const group=groups[idx];if(group.dissolved){el.style.opacity='0';return;}
            const r=trayRect(idx),s=SUBSTANCES.find(x=>x.id===g.sub),rad=drawRadius(s.mm);
            const ordinal=grains.filter(x=>group.ids.includes(x.sub)).sort((a,b)=>a.i-b.i||a.sub.localeCompare(b.sub)).findIndex(x=>x.key===g.key),perRow=Math.max(1,Math.floor(76/(rad*2+3)));
            const tx=r.x+119+rad+(ordinal%perRow)*(rad*2+3),ty=r.y+12+Math.floor(ordinal/perRow)*(rad*2+3);
            el.setAttribute('transform','translate('+(tx-g.homeX).toFixed(1)+' '+(ty-g.homeY).toFixed(1)+')');
        });
        const left=remaining();
        stageBadge.textContent=complete()?'모든 물질 회수 완료':groups.some(g=>g.dissolved)?'소금 회수 단계가 남음':groups.some(g=>g.ids.length>1)?'다시 나눌 혼합물이 남음':left.length+'가지 섞여 있음';
        resultLeft.textContent=left.length+'가지';resultDone.textContent=groups.length+'무리';
        setBusy(acting);
        document.getElementById('groupControls').innerHTML=groups.map(g=>{const names=g.ids.map(id=>SUBSTANCES.find(s=>s.id===id).name).join(' · ');return '<div class="mixture-group-row"><span>'+names+(g.dissolved?' → 소금물':g.ids.length>1?' (아직 섞여 있음)':'')+'</span>'+
             (g.dissolved?'<button type="button" data-recover-group="'+g.key+'"'+(acting?' disabled':'')+'>물 증발 · 소금 회수</button>':g.ids.length>1?'<button type="button" data-open-group="'+g.key+'"'+(acting?' disabled':'')+'>이 무리 다시 분리</button>':'<span>한 물질로 나뉨</span>')+'</div>';}).join('');
        propertyTable.innerHTML='<div class="property-row head"><span>물질</span><span>크기</span><span>자석</span><span>물에서</span></div>'+SUBSTANCES.map(s=>'<div class="property-row"><span><i class="swatch" style="background:'+s.color+'"></i>'+s.name+'</span><span>'+s.mm+' mm</span><span>'+(tried.has('magnet')?(s.magnetic?'붙음':'안 붙음'):'?')+'</span><span>'+(tried.has('water')?(s.soluble?'녹음':s.density<1?'뜸':'가라앉음'):'?')+'</span></div>').join('');
        renderSizes();
    }
    document.getElementById('groupControls').addEventListener('click',e=>{
        const open=e.target.closest('[data-open-group]'),recover=e.target.closest('[data-recover-group]');if(acting)return;
        if(open)selectGroup(+open.dataset.openGroup);
        if(recover){for(const entry of separated)if(entry.group===+recover.dataset.recoverGroup){entry.dissolved=false;entry.method='물을 증발시켜 회수';}
            stageCaption.textContent='소금물에서 물을 증발시킨 뒤 소금이 남습니다. 교사의 안전 지도 아래 하는 실제 실험을 나타낸 단계 모형입니다.';render();}
    });

    /* ------------------------------- 알갱이 크기와 체 구멍을 견주는 그림 */
    /* 가장 작은 철가루(0.3 mm)와 가장 큰 콩(8 mm)은 27배 차이라, 곧이곧대로
       그리면 작은 것들이 점이 되어 버립니다. 그래서 가로축을 로그로 잡고 그
       사실을 아래에 적어 둡니다. 체 구멍 선은 슬라이더 값을 그대로 씁니다. */
    const SZ = { x0: 96, x1: 400, top: 34, h: 17, gap: 6 };
    const MM_MIN = 0.2, MM_MAX = 12;
    const sxOf = mm => SZ.x0 + (Math.log(mm / MM_MIN) / Math.log(MM_MAX / MM_MIN)) * (SZ.x1 - SZ.x0);

    function renderSizes() {
        const mesh = meshMm();
        let out = `<text class="size-title" x="20" y="18">알갱이 크기와 체 구멍</text>`;

        const bottom = SZ.top + SUBSTANCES.length * (SZ.h + SZ.gap);
        const mx = sxOf(mesh);
        out += `<line class="mesh-line" x1="${mx.toFixed(1)}" y1="${SZ.top - 8}" x2="${mx.toFixed(1)}" y2="${bottom}"/>`;
        SUBSTANCES.forEach((s, i) => {
            const y = SZ.top + i * (SZ.h + SZ.gap);
            const done = isSeparated(s.id);
            out += `<rect class="size-track" x="${SZ.x0}" y="${y}" width="${SZ.x1 - SZ.x0}" height="${SZ.h}" rx="5"/>`;
            out += `<rect class="size-bar" x="${SZ.x0}" y="${y + 3}" width="${(sxOf(s.mm) - SZ.x0).toFixed(1)}" height="${SZ.h - 6}" rx="4" fill="${s.color}" opacity="${done ? .45 : .95}"/>`;
            out += `<text class="size-name" x="${SZ.x0 - 8}" y="${y + 13}" text-anchor="end">${s.name}</text>`;
            out += `<text class="size-mm" x="${(sxOf(s.mm) + 6).toFixed(1)}" y="${y + 13}">${s.mm} mm</text>`;
            if (done) out += `<text class="size-done" x="${SZ.x1 + 6}" y="${y + 13}">옮겨짐</text>`;
        });

        out += `<line class="size-axis" x1="${SZ.x0}" y1="${bottom}" x2="${SZ.x1}" y2="${bottom}"/>`;
        for (const mm of [0.2, 1, 4, 12]) {
            out += `<text class="size-tick" x="${sxOf(mm).toFixed(1)}" y="${bottom + 12}" text-anchor="middle">${mm}</text>`;
        }
        out += `<text class="size-tick" x="${SZ.x1 + 6}" y="${bottom + 12}">mm</text>`;

        // where the sieve cuts: anything to the left of the line falls through
        const flip = mx > (SZ.x0 + SZ.x1) / 2;
        out += `<text class="mesh-text" x="${(mx + (flip ? -6 : 6)).toFixed(1)}" y="${SZ.top - 12}"${flip ? ' text-anchor="end"' : ''}>체 구멍 ${mesh} mm</text>`;
                window.scienceScene.render(graphGroup,out);
    }

    function showResult(text) {
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        explanation.textContent = text;
    }

    // Each tool splits whatever is still mixed into two groups by one real
    // property. If every remaining substance falls on the same side, nothing
    // has actually been separated — which is itself worth showing.
    async function applyTool(name, predicate, methodLabel, describe, play) {
        const left = remaining();
        if (left.length === 0 || acting) return;
        const picked = left.filter(predicate);
        acting = true;
        setBusy(true);
        clearApparatus();
        if (play) await play(picked);
        tried.add(name);
        if (picked.length === 0 || picked.length === left.length) {
            stageCaption.textContent = describe.none;
            showResult(describe.noneDetail);
            await wait(350);
            clearApparatus();
            render();
            acting = false;
            setBusy(false);
            return;
        }
        storeGroup(picked,methodLabel(picked[0]));
        const names = picked.map(s => s.name).join(', ');
        stageCaption.textContent = describe.ok(names);
        showResult(describe.okDetail(names));
        clearApparatus();
        render();
        acting = false;
        setBusy(false);
        if (complete()) {
            const last = remaining()[0];
            stageCaption.textContent = `${names}${objectP(names)} 분리했습니다. 모든 물질이 한 종류씩 나뉘었고 소금도 회수했습니다.`;
        }
    }

    magnetBtn.addEventListener('click', () => applyTool('magnet',
        s => s.magnetic,
        () => '자석에 붙음',
        {
            none: '자석에 붙는 물질이 따로 없어 분리되지 않았습니다.',
            noneDetail: '자석은 철로 된 물질만 끌어당깁니다. 남은 물질 중에는 자석에 붙는 것이 없습니다.',
            ok: n => `${n}${subjectP(n)} 자석에 붙어 분리되었습니다.`,
            okDetail: n => `${n}만 자석에 붙는 성질이 있어 다른 물질과 나눌 수 있었습니다.`,
        },
        playMagnet).catch(handleCancellation));

    async function applyWater() {
        const left = remaining();
        if (left.length === 0 || acting) return;
        // Water sorts by two properties at once: what dissolves and what floats.
        const dissolved = left.filter(s => s.soluble);
        const floated = left.filter(s => !s.soluble && s.density < 1);
        const picked = [...dissolved, ...floated];
        acting = true;
        setBusy(true);
        clearApparatus();
        await playWater(dissolved, floated);
        tried.add('water');
        if ([dissolved,floated,left.filter(s=>!picked.includes(s))].filter(g=>g.length).length < 2) {
            stageCaption.textContent = '물에 넣어도 남은 물질이 모두 같게 행동해 분리되지 않았습니다.';
            showResult('물로 나누려면 녹는 물질이나 뜨는 물질이 섞여 있어야 합니다.');
            await wait(350);
            clearApparatus();
            render();
            acting = false;
            setBusy(false);
            return;
        }
        storeGroup(dissolved,'소금물로 받음',true);
        storeGroup(floated,'물 위에서 건짐');
        const parts = [];
        if (dissolved.length) {
            const n = dissolved.map(s => s.name).join(', ');
            parts.push(`${n}${topicP(n)} 물에 녹고`);
        }
        if (floated.length) {
            const n = floated.map(s => s.name).join(', ');
            parts.push(`${n}${topicP(n)} 물에 떠서`);
        }
        stageCaption.textContent = `${parts.join(' ')} 나뉘었습니다.${dissolved.length ? ' 녹은 소금은 아직 소금물에 있으므로 물을 증발시켜 회수해야 합니다.' : ''}`;
        showResult(`물에 녹는 성질과 물에 뜨는 성질이 서로 달라 나눌 수 있었습니다. 가라앉은 물질은 그릇에 남습니다.`);
        clearApparatus();
        render();
        acting = false;
        setBusy(false);
    }
    waterBtn.addEventListener('click',()=>applyWater().catch(handleCancellation));

    sieveBtn.addEventListener('click', () => {
        const mesh = meshMm();
        applyTool('sieve',
            s => s.mm < mesh,                       // smaller than the opening falls through
            () => `체를 빠져나감 (${mesh} mm 구멍)`,
            {
                none: `구멍이 ${mesh} mm라 남은 물질이 모두 같은 쪽으로 가서 분리되지 않았습니다.`,
                noneDetail: `체로 나누려면 구멍 크기가 두 물질의 알갱이 크기 사이에 있어야 합니다. 지금은 모두 통과하거나 모두 남았습니다.`,
                ok: n => `${n}${subjectP(n)} ${mesh} mm 구멍을 빠져나가 분리되었습니다.`,
                okDetail: n => `${n}${topicP(n)} 구멍보다 작아 빠져나가고, 더 큰 알갱이는 체 위에 남았습니다.`,
            },
            picked => playSieve(picked, mesh)).catch(handleCancellation);
    });

    meshRange.addEventListener('input', () => { meshOutput.textContent = `${meshMm()} mm`; renderSizes(); });

    resetBtn.addEventListener('click', () => {
        revision++;batch=0;separated = [];tried.clear();
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        stageCaption.textContent = '자석·물·체 가운데 알맞은 도구를 골라 보세요.';
        acting = false;
        clearApparatus();
        render();
    });

    function shuffleQuizOptions(card) {
        const optionGroup = card.querySelector('.quiz-options');
        const options = Array.from(optionGroup.children);
        for (let index = options.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [options[index], options[randomIndex]] = [options[randomIndex], options[index]];
        }
        optionGroup.append(...options);
    }

    document.querySelectorAll('.quiz-card').forEach(card => {
        shuffleQuizOptions(card);
        const answerButton = card.querySelector('.answer-button');
        const answerResult = card.querySelector('.answer-result');
        const answerExplanation = card.querySelector('.answer-explanation');
        answerButton.addEventListener('click', () => {
            const selected = card.querySelector('input:checked');
            if (!selected) {
                delete card.dataset.state;
                answerResult.textContent = '답을 먼저 선택하세요.';
                return;
            }
            const correct = selected.value === card.dataset.answer;
            card.dataset.state = correct ? 'correct' : 'incorrect';
            answerResult.textContent = correct ? '맞았습니다.' : '다시 생각해 보세요.';
            answerExplanation.hidden = !correct;
            if (!correct) {
                selected.checked = false;
                selected.disabled = true;
                answerResult.textContent = '다시 생각하고 다른 답을 골라보세요.';
            }
        });
    });

    window.__mixtureModel = {
        SUBSTANCES, remaining, isActing:()=>acting, groups:storedGroups, complete, selectGroup, separated: () => separated.map(v => ({ ...v })),
        setMesh(v) {
            const i = MESH_STOPS.indexOf(v);
            meshRange.value = String(i === -1 ? 3 : i);
            meshOutput.textContent = `${meshMm()} mm`;
            renderSizes();
        },
        reset: () => resetBtn.click(),
        grainCount: () => grains.length,
    };

    buildGrains();
    resetBtn.click();
});

/* 그림 속 문장을 HTML로 내린다. 액자를 벗어나거나 서로 겹치는 글자만 옮기므로
   조건이 바뀌어도 스스로 맞는다. 그림에는 짧은 이름표만 남는다. */
(function () {
    const stageVerdict = document.getElementById('stageVerdict');
    const stageReadout = document.getElementById('stageReadout');
    const stageNote = document.getElementById('stageNote');
    if (!stageReadout) return;
    const pairs = [['mainGroup', '.main-svg'], ['graphGroup', '.graph-svg']]
        .map(([id, sel]) => [document.getElementById(id), document.querySelector(sel)])
        .filter(([g, s]) => g && s);
    if (!pairs.length) return;

    // 그림에서 쓰던 색이 흰 바탕에서는 너무 흐린 경우가 있어, 그런 색은 버리고 기본색을 쓴다.
    function readableOnWhite(c) {
        let r, g, b;
        if (c[0] === '#') {
            let h = c.slice(1);
            if (h.length === 3) h = h.split('').map(x => x + x).join('');
            if (h.length !== 6) return false;
            r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16);
        } else {
            const m = c.match(/[\d.]+/g);
            if (!m || m.length < 3) return false;
            r = +m[0]; g = +m[1]; b = +m[2];
            const a = m.length > 3 ? +m[3] : 1;
            r = a * r + (1 - a) * 255; g = a * g + (1 - a) * 255; b = a * b + (1 - a) * 255;
        }
        const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        const L = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        return 1.05 / (L + 0.05) >= 3.5;
    }

    function liftProse() {
        const rows = [], notes = [], verdicts = [];
        const takeOut = t => {
            const cls = t.getAttribute('class') || '';let txt = t.textContent.trim();
            if(t.matches('.stat-value')){
                const label=t.previousElementSibling;
                if(label?.matches('.stat-name')&&label.getAttribute('y')===t.getAttribute('y')){txt=label.textContent.trim()+': '+txt;label.remove();}
            }
            if (txt) {
                if (/verdict-text/.test(cls)) verdicts.push(txt);
                else if (/note-text/.test(cls)) notes.push(txt);
                else rows.push({ txt, fill: t.style.fill || '' });
            }
            t.remove();
        };
        pairs.forEach(([g, svg]) => {
            const vb = svg.viewBox.baseVal, W = vb.width, H = vb.height;
            const outside = b => b.x < -0.5 || b.x + b.width > W + 0.5 || b.y + b.height > H + 0.5 || b.y < -0.5;
            [...g.querySelectorAll('text')].forEach(t => {
                const cls = t.getAttribute('class') || '';
                const must = /verdict-text|note-text|prose/.test(cls);
                let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { return; }
                // 눈금 같은 짧은 이름표는 밖으로 내보내면 뜻을 잃는다. 액자 안으로 밀어 넣어 본다.
                if (!must && outside(b) && b.width < W * 0.6 && !t.getAttribute('transform')) {
                    const x = parseFloat(t.getAttribute('x')), y = parseFloat(t.getAttribute('y'));
                    if (!Number.isNaN(x)) {
                        const dx = b.x + b.width > W - 2 ? (W - 2) - (b.x + b.width) : (b.x < 2 ? 2 - b.x : 0);
                        if (dx) { t.setAttribute('x', (x + dx).toFixed(1)); b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); }
                    }
                    if (!Number.isNaN(y)) {
                        const dy = b.y + b.height > H - 1 ? (H - 1) - (b.y + b.height) : (b.y < 1 ? 1 - b.y : 0);
                        if (dy) { t.setAttribute('y', (y + dy).toFixed(1)); b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); }
                    }
                }
                if (must || outside(b)) takeOut(t);
            });
            const items = [...g.querySelectorAll('text')].map(t => {
                let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { b = null; }
                return { t, b, len: t.textContent.trim().length };
            }).filter(o => o.b);
            const drop = new Set();
            for (let i = 0; i < items.length; i += 1) for (let j = i + 1; j < items.length; j += 1) {
                if (drop.has(i) || drop.has(j)) continue;
                const a = items[i].b, c = items[j].b;
                if (Math.min(a.x + a.width, c.x + c.width) - Math.max(a.x, c.x) <= 3) continue;
                if (Math.min(a.y + a.height, c.y + c.height) - Math.max(a.y, c.y) <= 1.5) continue;
                const k = items[i].len >= items[j].len ? i : j;
                if (items[k].len < 8) continue;
                drop.add(k);
            }
            [...drop].sort((x, y) => x - y).forEach(k => takeOut(items[k].t));
        });
        // A new drawing may contain no lifted prose. Clear the previous
        // drawing's copy too; takeRecords below already consumes our own edits.
        if (stageVerdict) stageVerdict.textContent = verdicts.join(' ');
        stageReadout.textContent = '';
        rows.forEach(r => {
            const s = document.createElement('span');
            s.textContent = r.txt;
            if (r.fill && readableOnWhite(r.fill)) s.style.color = r.fill;
            stageReadout.appendChild(s);
        });
        if (stageNote) stageNote.textContent = notes.join(' ');
    }

    // 화면이 다시 그려지면 곧바로 돈다. 옮기는 동안 스스로를 깨우지 않도록 잠근다.
    let busy = false, obs;
    // 글자를 옮기는 것도 화면 변경이라 감시기가 다시 불린다. 그때는 기록이 비어 있으므로
    // 그냥 돌아가야 한다. 그러지 않으면 두 번째 실행이 방금 옮긴 결과를 지운다.
    const run = recs => {
        if (busy || (recs && recs.length === 0)) return;
        busy = true;
        try { liftProse(); } finally { obs.takeRecords(); busy = false; }
    };
    obs = new MutationObserver(run);
    pairs.forEach(([g]) => obs.observe(g, { childList: true, subtree: true }));
    run();
    // The observer sees the app's DOMContentLoaded render; do not run twice.
})();
