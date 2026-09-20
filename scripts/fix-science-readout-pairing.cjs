const fs=require('node:fs');
const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'lab-ui.js',s=>replace(s,"(() => {",`(() => {
 const inkCanvas=document.createElement('canvas').getContext('2d');
 window.scienceTextInkBox=text=>{
  const b=text.getBBox(),style=getComputedStyle(text);
  inkCanvas.font=style.fontWeight+' '+style.fontSize+' '+style.fontFamily;
  const m=inkCanvas.measureText(text.textContent),y=text.getStartPositionOfChar(0).y;
  return{x:b.x,y:y-m.actualBoundingBoxAscent,width:b.width,height:m.actualBoundingBoxAscent+m.actualBoundingBoxDescent};
 };`));
for(const slug of fs.readdirSync(lab)){
 const file=lab+slug+'/app.js';if(!fs.existsSync(file))continue;
 const source=fs.readFileSync(file,'utf8');if(!source.includes('const drop = new Set'))continue;
 edit(file,s=>{
  // Keep the established sentence-caption flow, but measure actual painted glyphs.
  s=s.replaceAll('b = t.getBBox();','b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox();');
  s=s.replaceAll("const cls = t.getAttribute('class') || '', txt = t.textContent.trim();",`const cls = t.getAttribute('class') || '';let txt = t.textContent.trim();
            if(t.matches('.stat-value')){
                const label=t.previousElementSibling;
                if(label?.matches('.stat-name')&&label.getAttribute('y')===t.getAttribute('y')){txt=label.textContent.trim()+': '+txt;label.remove();}
            }`);
  return s;
 });
}
edit('scripts/audit-science-layout.cjs',s=>replace(s,'ctx.font=style.font;','ctx.font=style.fontWeight+\' \'+style.fontSize+\' \'+style.fontFamily;'));
edit(lab+'body-systems/app.js',s=>replace(s,'class="organ-label" x="190" y="132"','class="organ-label" x="190" y="149"'));
apply();
