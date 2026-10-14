// Browser-side inspection of text cut by an ancestor's explicit SVG clip.
// Bounding rectangles catch definite clipping; arbitrary nonrectangular masks
// still require visual inspection. This is deliberately separate from overlap.
module.exports=function clippedSvgText(){
 const findings=[];
 const transformBox=(b,m)=>{const p=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(m));return{left:Math.min(...p.map(a=>a.x)),right:Math.max(...p.map(a=>a.x)),top:Math.min(...p.map(a=>a.y)),bottom:Math.max(...p.map(a=>a.y))};};
 for(const t of document.querySelectorAll('svg text')){
  if(!t.textContent.trim()||t.closest('[hidden],defs,clipPath,mask')||!t.getClientRects().length||getComputedStyle(t).visibility==='hidden')continue;
  const tm=t.getScreenCTM();if(!tm||!t.getBoundingClientRect().width)continue;
  const tb=transformBox(window.scienceTextInkBox?.(t)||t.getBBox(),tm);
  for(let g=t;g&&g!==t.ownerSVGElement;g=g.parentElement){
   const id=(g.getAttribute('clip-path')||'').match(/^url\(#([^)]+)\)$/)?.[1];if(!id)continue;
   const clip=document.getElementById(id);if(!clip||clip.getAttribute('clipPathUnits')==='objectBoundingBox')continue;
   const cm=g.getScreenCTM();if(!cm)continue;
   const children=[...clip.children].filter(e=>typeof e.getBBox==='function');if(!children.length)continue;
   const boxes=children.map(e=>{let m=cm;const own=e.transform?.baseVal?.consolidate();if(own)m=m.multiply(own.matrix);return transformBox(e.getBBox(),m);});
   const cb={left:Math.min(...boxes.map(b=>b.left)),right:Math.max(...boxes.map(b=>b.right)),top:Math.min(...boxes.map(b=>b.top)),bottom:Math.max(...boxes.map(b=>b.bottom))};
   // Fully outside labels (for example a microscope reticle continuing beyond
   // the eyepiece) are not displayed. Inspect partially visible text only.
   if(tb.right<=cb.left||tb.left>=cb.right||tb.bottom<=cb.top||tb.top>=cb.bottom)break;
   if(tb.left<cb.left-1.5||tb.right>cb.right+1.5||tb.top<cb.top-1.5||tb.bottom>cb.bottom+1.5)findings.push({text:t.textContent.trim(),clip:id,textBounds:tb,clipBounds:cb});
  }
 }
 return findings;
};
