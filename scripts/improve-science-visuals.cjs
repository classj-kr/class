const fs=require('node:fs');
const {edit,replace,cut,apply,lab}=require('./science-scope-patch.cjs');
const map=require('../'+lab+'curriculum-map.js');
for(const slug of Object.keys(map))edit(lab+slug+'/index.html',s=>replace(replace(s,'</head>','    <link rel="stylesheet" href="../lab-ui.css?v=1">\n</head>'),'</body>','    <script src="../lab-ui.js"></script>\n</body>'));
edit(lab+'index.html',s=>replace(s,'</head>','    <link rel="stylesheet" href="lab-ui.css?v=1">\n</head>'));
edit(lab+'sound-vibration/app.js',s=>replace(s,'resultPitch.textContent = `${data.hz} Hz (${data.note})`;','resultPitch.innerHTML = `<span class="metric-number">${data.hz} Hz</span><span class="metric-context">${data.note}</span>`;'));
edit(lab+'magnets/app.js',s=>{
 s=replace(s,'const CX = 210, CY = 118;','const CX = 230, CY = 146;');
 s=replace(s,'Math.min(68, distPx * 0.44)','Math.min(80, 54 + (distPx - 58) * 0.23)');
 s=cut(s,/        \/\/ the label goes above a compass[\s\S]*?        \/\/ north marker/,'        // Keep descriptive text outside the compass/magnet geometry.\n        // north marker');
 s=replace(s,'x="428" y="36"','x="424" y="42"');
 s=replace(s,'x="428" y="52"','x="424" y="62" text-length="0"');
 s=replace(s,'x="20" y="206">작은 나침반','x="20" y="278">작은 나침반');
 s=replace(s,"        mainGroup.innerHTML = a.kind === 'force' ? renderForce(a, state.progress) : renderCompass(a, state.progress);","        mainGroup.closest('svg').setAttribute('viewBox', a.kind === 'force' ? '0 0 460 214' : '0 0 460 294');\n        mainGroup.innerHTML = a.kind === 'force' ? renderForce(a, state.progress) : renderCompass(a, state.progress);");
 return s;
});
edit(lab+'seasons/app.js',s=>{
 s=cut(s,/    function renderPath\(a, p\) \{[\s\S]*?\n    function renderOrbit/,`    function renderPath(a, p) {
        const hour=pathHour(a,p),q=sunAt(hour,a.season.dec),HY=236;
        // Direction is monotonic from east to west; sin(azimuth) folds summer paths.
        const pos=(alt,az)=>({x:230+196*az/135,y:HY-140*Math.sin(alt*D2R)});
        let out='<rect class="sky day" x="24" y="72" width="412" height="164"/><rect class="ground" x="24" y="236" width="412" height="27"/>';
        out+='<line class="horizon-line" x1="24" y1="236" x2="436" y2="236"/>';
        [99,230,361].forEach((x,i)=>out+='<text class="dir-text" x="'+x+'" y="255" text-anchor="middle">'+['동','남','서'][i]+'</text>');
        Object.entries(SEASONS).forEach(([k,se],i)=>{
            const pts=[];
            for(let h=3;h<=21;h+=.1){const sun=sunAt(h,se.dec);if(sun.alt>=0){const r=pos(sun.alt,sun.az);pts.push(r.x.toFixed(1)+','+r.y.toFixed(1));}}
            if(pts.length>1)out+='<path class="sun-path'+(k===state.season?'':' other')+'" style="stroke:'+se.colour+'" d="M'+pts.join('L')+'"/>';
            const x=36+i*140;
            out+='<line x1="'+x+'" y1="47" x2="'+(x+16)+'" y2="47" stroke="'+se.colour+'" stroke-width="3"/><text class="axis-text" x="'+(x+23)+'" y="52" style="fill:'+se.ink+'">'+se.label+' '+Math.round(noonAlt(se.dec))+'°</text>';
        });
        if(q.alt>0){const r=pos(q.alt,q.az);out+='<circle class="sun-glow" cx="'+r.x.toFixed(1)+'" cy="'+r.y.toFixed(1)+'" r="15"/><circle class="sun" cx="'+r.x.toFixed(1)+'" cy="'+r.y.toFixed(1)+'" r="8"/>';}
        out+='<text class="sky-text" x="24" y="289">'+hourText(hour)+' · '+(q.alt>0?'태양 높이 '+Math.round(q.alt)+'°':hour<12?'해 뜨기 전':'해 진 뒤')+'</text>';
        if(q.alt>0){const ratio=1/Math.tan(q.alt*D2R);out+='<text class="alt-text" x="436" y="289" text-anchor="end">그림자 '+(ratio>100?'100배 이상':ratio.toFixed(1)+'배')+'</text>';}
        out+='<text class="verdict-text" x="20" y="18">'+a.season.label+' · 남중 고도 '+Math.round(a.noon)+'° · 낮 '+a.len.toFixed(1)+'시간 ('+hourText(a.rise)+' ~ '+hourText(a.set)+')</text>';
        out+='<text class="note-text" x="20" y="319">1 m 막대의 정오 그림자: '+a.shadow.toFixed(2)+' m · 태양이 높을수록 그림자가 짧습니다</text>';
        return out;
    }

    function renderOrbit`);
 s=replace(s,"        mainGroup.innerHTML = a.kind === 'path' ? renderPath(a, state.progress) : renderOrbit(a, state.progress);","        mainGroup.closest('svg').setAttribute('viewBox', a.kind === 'path' ? '0 0 460 334' : '0 0 460 240');\n        mainGroup.innerHTML = a.kind === 'path' ? renderPath(a, state.progress) : renderOrbit(a, state.progress);");
 return s;
});
apply();
