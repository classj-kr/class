const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'lab-ui.js',s=>{
 s=replace(s,'  let notes=null,scheduled=false;','  let notes=null,scheduled=false;\n  const baseFonts=new WeakMap();');
 s=replace(s,"   const lines=[];\n   svg.querySelectorAll('text.note-text,text.verdict-text,text.front-note').forEach(text=>{",`   const lines=[];
   // Keep ordinary SVG labels legible on narrow screens; never shrink symbols.
   const scale=svg.getBoundingClientRect().width/box.width;
   svg.querySelectorAll('text').forEach(text=>{
    if(!baseFonts.has(text))baseFonts.set(text,parseFloat(getComputedStyle(text).fontSize)||14);
    const font=baseFonts.get(text);if(font<=18)text.style.fontSize=Math.max(font,12/scale)+'px';
   });
   svg.querySelectorAll('text.note-text,text.verdict-text,text.front-note,text.cmp-note').forEach(text=>{`);
 s=replace(s,'if(atEdge&&b.width>box.width*.67)','if((atEdge&&b.width>box.width*.67)||b.x<box.x||b.x+b.width>box.x+box.width||b.y<box.y||b.y+b.height>box.y+box.height)');
 return s;
});
apply();
