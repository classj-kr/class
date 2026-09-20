const {edit,replace,apply}=require('./science-scope-patch.cjs');
edit('scripts/audit-science-layout.cjs',s=>{
 s=replace(s,'const outside=[];document.querySelectorAll','const outside=[],overlaps=[];document.querySelectorAll');
 s=replace(s,"outside.push(t.textContent.trim().slice(0,85));});});","outside.push(t.textContent.trim().slice(0,85));});const texts=[...svg.querySelectorAll('text')].filter(t=>visible(t)&&t.textContent.trim()&&Number(getComputedStyle(t).opacity)>.05);for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){const a=texts[i].getBoundingClientRect(),b=texts[j].getBoundingClientRect(),w=Math.min(a.right,b.right)-Math.max(a.left,b.left),h=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);if(w>3&&h>3)overlaps.push([texts[i].textContent.trim().slice(0,45),texts[j].textContent.trim().slice(0,45)]);}});");
 s=replace(s,'return{overflow:document.documentElement.scrollWidth>innerWidth+1,typography,outside};','return{overflow:document.documentElement.scrollWidth>innerWidth+1,typography,outside,overlaps};');
 s=replace(s,'result.typography.length||result.outside.length','result.typography.length||result.outside.length||result.overlaps.length');
 return s;
});
apply();
