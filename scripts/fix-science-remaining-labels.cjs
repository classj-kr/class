const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'lab-ui.js',s=>{
 s=replace(s,"text.note-text,text.verdict-text,text.front-note,text.cmp-note'","text.note-text,text.verdict-text,text.front-note,text.cmp-note,text.figure-caption'");
 s=replace(s,'if((atEdge&&b.width>box.width*.67)','if(text.matches(\'.figure-caption\')||(atEdge&&b.width>box.width*.67)');
 return s;
});
edit(lab+'energy-conversion/app.js',s=>replace(s,'x="424" y="208" text-anchor="middle">기준','x="424" y="208" text-anchor="end">기준'));
edit(lab+'combustion/app.js',s=>replace(s,'class="note-text" x="${GRAPH.x0}" y="${GRAPH.y0 - 4}"','class="note-text figure-caption" x="${GRAPH.x0}" y="${GRAPH.y0 - 4}"'));
edit(lab+'senses/app.js',s=>replace(s,'if (cm > 0) fall.appendChild','if (cm > 0 && y > 12 && y < 208) fall.appendChild'));
edit(lab+'pea-genetics/app.js',s=>{
 s=replace(s,'const cell = n === 2 ? 36 : 27;','const cell = a.kind === \'two\' ? 44 : 36;');
 s=replace(s,'const TX = 196, TY = 44, TW = 244, TH = 132;','const TX = a.kind === \'two\' ? 290 : 196, TY = 58, TW = a.kind === \'two\' ? 350 : 244, TH = 132;');
 s=replace(s,'(i % 2) * 124, ly = a.phenos.length > 2 ? 190 + Math.floor(i / 2) * 15 : 197','(i % 2) * (a.kind === \'two\' ? 176 : 124), ly = a.phenos.length > 2 ? 216 + Math.floor(i / 2) * 24 : 214');
 s=replace(s,'function renderMain(a) {','function renderMain(a) {\n        mainGroup.closest(\'svg\').setAttribute(\'viewBox\',a.kind===\'two\'?\'0 0 660 290\':\'0 0 460 238\');');
 return s;
});
edit(lab+'natural-selection/app.js',s=>{
 s=replace(s,'class="axis-title" x="${X0}" y="18">옅은 막대','class="axis-title figure-caption" x="${X0}" y="18">옅은 막대');
 return replace(s,'class="axis-text" style="fill:#059669" x="${X1}" y="18"','class="axis-text figure-caption" style="fill:#059669" x="${X1}" y="18"');
});
edit(lab+'life-cycle/app.js',s=>replace(s,"{ x: 438, y: 150, 'text-anchor': 'end', class: 'tiny-label' }","{ x: 438, y: 222, 'text-anchor': 'end', class: 'tiny-label figure-caption' }"));
edit(lab+'volcano-model/app.js',s=>{
 s=replace(s,"{ x: 268, y: 200, 'text-anchor': 'middle', class: 'note-text' }","{ x: 268, y: 200, 'text-anchor': 'middle', class: 'note-text figure-caption' }");
 s=s.replaceAll("y: 172, class: 'legend-text'","y: 172, class: 'legend-text figure-caption'").replaceAll("y: 172, 'text-anchor': 'end', class: 'legend-text'","y: 172, 'text-anchor': 'end', class: 'legend-text figure-caption'");
 return s;
});
edit(lab+'ocean-circulation/app.js',s=>replace(s,"{ x: HODO.cx + HODO.r, y: HODO.cy + HODO.r + 14, 'text-anchor': 'end', class: 'tiny-label' }","{ x: HODO.cx + HODO.r, y: HODO.cy + HODO.r + 36, 'text-anchor': 'end', class: 'tiny-label' }"));
edit(lab+'stars-universe/app.js',s=>{
 s=s.replaceAll('class="note-text" style="fill:#cbd5e1"','class="note-text figure-caption" style="fill:#cbd5e1"');
 return s.replaceAll('class="mag-text" fill="#0f172a"','class="mag-text figure-caption" fill="#0f172a"');
});
apply();
