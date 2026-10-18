// Shared by the responsive audit and live-animation audit.
module.exports=function inspect(){
 const visible=e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('[hidden],defs,clipPath,mask')&&e.getBoundingClientRect().width>0;
 const fonts=[],clipped=[],overlaps=[],canvas=[];
 const pictogram=s=>/^[\p{Extended_Pictographic}\uFE0F\u200D\s←→↑↓↔↕·•①②③④⑤⑥]+$/u.test(s);
 const add=(kind,e,px,text)=>{if(px<13.8||px>(kind==='svg'?16.2:24))fonts.push({kind,text:text.trim().slice(0,85),px:+px.toFixed(2),element:e.tagName,css:typeof e.className==='string'?e.className:e.className?.baseVal,computedFont:getComputedStyle(e).fontSize,inlineStyle:e.getAttribute('style'),...(kind==='svg'?{matrix:Array.from(['a','b','c','d'],k=>e.getScreenCTM()[k]),viewBox:e.closest('svg')?.getAttribute('viewBox')}:{} )});};
 for(const e of document.querySelectorAll('main *')){if(!visible(e)||e.closest('svg')||e.matches('script,style,h1,option,sub,sup')||e.closest('.sr-only,[aria-hidden=true]'))continue;
  if([...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))add('html',e,parseFloat(getComputedStyle(e).fontSize),e.textContent);
  if(e.matches('button,p,th,td')&&e.clientWidth>0&&e.scrollWidth>e.clientWidth+2)clipped.push(e.textContent.trim().slice(0,75));
  if(e.matches('button,select')&&e.getBoundingClientRect().height<43.5)clipped.push('터치 높이: '+e.textContent.trim().slice(0,50));
 }
 for(const svg of document.querySelectorAll('svg')){if(!visible(svg))continue;const box=svg.getBoundingClientRect(),texts=[];
  for(const e of svg.querySelectorAll('text')){if(!visible(e)||!e.textContent.trim()||pictogram(e.textContent.trim()))continue;const m=e.getScreenCTM();if(!m)continue;const px=parseFloat(getComputedStyle(e).fontSize)*Math.hypot(m.c,m.d);add('svg',e,px,e.textContent);const ink=window.scienceTextInkBox?.(e);const points=ink?[[ink.x,ink.y],[ink.x+ink.width,ink.y],[ink.x,ink.y+ink.height],[ink.x+ink.width,ink.y+ink.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(m)):null;const b=points?{left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),top:Math.min(...points.map(p=>p.y)),bottom:Math.max(...points.map(p=>p.y))}:e.getBoundingClientRect();
   if(b.left<box.left-3||b.right>box.right+3||b.top<box.top-3||b.bottom>box.bottom+3)clipped.push(e.textContent.trim().slice(0,75));
   texts.push({text:e.textContent.trim(),b});
  }
  for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){const a=texts[i],b=texts[j],w=Math.min(a.b.right,b.b.right)-Math.max(a.b.left,b.b.left),h=Math.min(a.b.bottom,b.b.bottom)-Math.max(a.b.top,b.b.top);if(w>4&&h>5)overlaps.push([a.text.slice(0,45),b.text.slice(0,45)]);}
 }
 for(const c of document.querySelectorAll('canvas')){if(!visible(c))continue;const b=c.getBoundingClientRect(),scale=getComputedStyle(c).objectFit==='contain'?Math.min(b.width/c.width,b.height/c.height):b.height/c.height;for(const row of c.__textAudit?.values()||[]){const px=row.px*scale;if(px<13.8||px>16.2)canvas.push({id:c.id,text:row.text,px:+px.toFixed(2)});}}
 return{overflow:document.documentElement.scrollWidth>innerWidth+1,fonts,clipped,overlaps,canvas};
};
