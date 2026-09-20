const {edit,replace,apply}=require('./science-scope-patch.cjs');
edit('scripts/audit-science-layout.cjs',s=>{
 s=replace(s,"   const outside=[],overlaps=[];",`   // Font boxes include line-leading that is not painted ink. Compare glyph bounds.
   const ctx=document.createElement('canvas').getContext('2d');
   const ink=t=>{const style=getComputedStyle(t);ctx.font=style.font;const m=ctx.measureText(t.textContent),b=t.getBBox(),base=t.getStartPositionOfChar(0).y,ctm=t.getScreenCTM();const pts=[[b.x,base-m.actualBoundingBoxAscent],[b.x+b.width,base-m.actualBoundingBoxAscent],[b.x,base+m.actualBoundingBoxDescent],[b.x+b.width,base+m.actualBoundingBoxDescent]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(ctm));return{left:Math.min(...pts.map(p=>p.x)),right:Math.max(...pts.map(p=>p.x)),top:Math.min(...pts.map(p=>p.y)),bottom:Math.max(...pts.map(p=>p.y))};};
   const outside=[],overlaps=[];`);
 s=replace(s,'const a=texts[i].getBoundingClientRect(),b=texts[j].getBoundingClientRect(),w=','const a=ink(texts[i]),b=ink(texts[j]),w=');
 return s;
});
apply();
