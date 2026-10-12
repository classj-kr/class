(function(root){
 'use strict';
 const nearest=(profile,depth)=>profile.points.filter(row=>row&&(row.t!==null||row.s!==null)).reduce((best,row)=>!best||Math.abs(row.depth-depth)<Math.abs(best.depth-depth)?row:best,null);
 function segments(points,x,y){const out=[];let line=[];for(const row of points){const a=row&&x(row),b=row&&y(row);if(a==null||b==null||!Number.isFinite(a)||!Number.isFinite(b)){if(line.length)out.push(line);line=[];}else line.push([a,b]);}if(line.length)out.push(line);return out;}
 const api={nearest,segments};if(typeof module!=='undefined')module.exports=api;else root.ScienceArgo=api;
})(typeof window==='undefined'?globalThis:window);
