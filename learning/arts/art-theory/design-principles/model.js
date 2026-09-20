(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CompositionStudio=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const colors=[{name:'초록',value:'#536b5b'},{name:'주황',value:'#b76e4d'},{name:'파랑',value:'#547896'},{name:'먹색',value:'#343a37'}];
const shapes={circle:'원',square:'사각형',triangle:'삼각형'};
const clone=value=>JSON.parse(JSON.stringify(value));
function initial(){return [{id:1,shape:'circle',x:150,y:130,size:70,color:colors[0].value},{id:2,shape:'circle',x:150,y:270,size:70,color:colors[0].value},{id:3,shape:'circle',x:390,y:130,size:70,color:colors[0].value},{id:4,shape:'circle',x:390,y:270,size:70,color:colors[0].value}];}
function constrain(item){const size=Math.max(24,Math.min(160,item.size)),half=size/2;return {...item,size,x:Math.max(half,Math.min(600-half,item.x)),y:Math.max(half,Math.min(400-half,item.y))};}
function change(items,id,patch){return items.map(item=>item.id===id?constrain({...item,...patch}):{...item});}
function valid(items){return Array.isArray(items)&&items.length<=40&&new Set(items.map(i=>i?.id)).size===items.length&&items.every(i=>i&&Number.isSafeInteger(i.id)&&i.id>0&&Object.hasOwn(shapes,i.shape)&&colors.some(c=>c.value===i.color)&&['x','y','size'].every(k=>Number.isFinite(i[k]))&&i.size>=24&&i.size<=160&&i.x>=i.size/2&&i.x<=600-i.size/2&&i.y>=i.size/2&&i.y<=400-i.size/2);}
function markup(item){const s=item.size/2,fill=`fill="${item.color}"`;if(item.shape==='circle')return `<circle r="${s}" ${fill}/>`;if(item.shape==='square')return `<rect x="${-s}" y="${-s}" width="${item.size}" height="${item.size}" ${fill}/>`;return `<polygon points="0,${-s} ${s},${s} ${-s},${s}" ${fill}/>`;}
function scene(items){return items.map(item=>`<g transform="translate(${item.x} ${item.y})">${markup(item)}</g>`).join('');}
function exportSvg(items){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="1200" height="800"><rect width="600" height="400" fill="#f1efe8"/>${scene(items)}</svg>`;}
return {colors,shapes,clone,initial,constrain,change,valid,markup,scene,exportSvg};
});
