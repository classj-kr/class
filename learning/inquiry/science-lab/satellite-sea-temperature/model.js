(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ScienceSST=api;})(typeof window==='object'?window:globalThis,()=>{
 'use strict';
 function cell(region,lon,lat){const x=Math.max(0,Math.min(region.lon.length-1,Math.round((lon-region.lon[0])/.25))),y=Math.max(0,Math.min(region.lat.length-1,Math.round((lat-region.lat[0])/.25)));return{x,y,index:y*region.lon.length+x,lon:region.lon[x],lat:region.lat[y]};}
 function reading(region,date,point){return region.frames.find(f=>f.date===date).values[point.index];}
 function difference(a,b){return a===null||b===null?null:b-a;}
 const temperature=[[0,[25,53,120]],[.2,[22,111,171]],[.4,[45,175,179]],[.6,[220,225,151]],[.8,[245,161,76]],[1,[177,42,52]]];
 const delta=[[0,[34,86,155]],[.5,[247,248,244]],[1,[181,65,23]]];
 function color(v,diff=false){if(v===null)return'#e6ecee';const x=Math.max(0,Math.min(1,diff?(v+20)/40:(v+2)/34)),stops=diff?delta:temperature;const hi=stops.findIndex(s=>s[0]>=x);if(hi<=0)return`rgb(${stops[0][1].join(',')})`;const[a,b]=[stops[hi-1],stops[hi]],f=(x-a[0])/(b[0]-a[0]);return`rgb(${a[1].map((c,i)=>Math.round(c+(b[1][i]-c)*f)).join(',')})`;}
 function differenceLabel(v){return v===null?'비교 불가':(v>0?'+':'')+(v!==0&&Math.abs(v)<.005?v.toPrecision(2):v.toFixed(2))+' ℃';}
 return{cell,reading,difference,color,differenceLabel};
});
