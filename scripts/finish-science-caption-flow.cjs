const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'pea-genetics/app.js',s=>replace(s,'class="verdict-text" fill="#0f172a" x="26" y="210"','class="verdict-text figure-caption" fill="#0f172a" x="26" y="210"'));
edit(lab+'ocean-circulation/app.js',s=>replace(s,"y: HODO.cy + HODO.r + 36, 'text-anchor': 'end', class: 'tiny-label'","y: HODO.cy + HODO.r + 36, 'text-anchor': 'end', class: 'tiny-label figure-caption'"));
edit(lab+'lab-ui.js',s=>{
 s=replace(s,'   const box=svg.viewBox.baseVal;if(!box.width||!svg.getBoundingClientRect().width)return;\n   const lines=[];',`   const box=svg.viewBox.baseVal;
   const proseOnly=svg.matches('.graph-svg')&&svg.querySelector('text')&&![...svg.querySelectorAll('path,line,rect,circle,ellipse,polygon,polyline,image,use,foreignObject')].some(n=>!n.closest('defs'));
   viewport.hidden=!!proseOnly;
   if(!box.width||(!proseOnly&&!svg.getBoundingClientRect().width))return;
   const lines=proseOnly?[...svg.querySelectorAll('text')].map(t=>t.textContent.trim()).filter(Boolean):[];`);
 s=replace(s,'const scale=svg.getBoundingClientRect().width/box.width;','const scale=proseOnly?1:svg.getBoundingClientRect().width/box.width;');
 s=replace(s,"   svg.querySelectorAll('text.note-text", "   if(!proseOnly)svg.querySelectorAll('text.note-text");
 s=replace(s,"if(svg.matches('.graph-svg'))svg.querySelectorAll", "if(!proseOnly&&svg.matches('.graph-svg'))svg.querySelectorAll");
 return s;
});
apply();
