(function(root){'use strict';
 const datasets={
  local:{name:'관측 자료 A',rows:[[111,19.3],[126,20.9],[189,33.9],[267,42.2],[309,48.5],[345,52.4],[389,59.6],[454,66.6]],origin:true,split:3,labels:'ABCDEFGH',sourceId:'d41737876b631070',page:42},
  stations:{name:'관측 자료 B',rows:[[105,16],[117,17.1],[181,27.9],[234,34.4],[262,39.6],[280,42.3],[309,45.7],[338,48.7],[380,54.9],[447,63.2]],origin:false,split:5,labels:['1','2','3','4','5','6','7','8','9','10'],sourceId:'cdbacd1f7e6522b8',page:44}
 };
 function fit(rows){if(rows.length<2)return null;const n=rows.length,x=rows.reduce((s,p)=>s+p[0],0)/n,y=rows.reduce((s,p)=>s+p[1],0)/n,den=rows.reduce((s,p)=>s+(p[0]-x)**2,0);if(!den)return null;const slope=rows.reduce((s,p)=>s+(p[0]-x)*(p[1]-y),0)/den,intercept=y-slope*x,residuals=rows.map(([x,y])=>y-(slope*x+intercept));return{slope,intercept,residuals,rmse:Math.sqrt(residuals.reduce((s,r)=>s+r*r,0)/n)};}
 function solve(key,split){const d=datasets[key];if(!d||!Number.isInteger(split)||split<2||split>d.rows.length-2)return{valid:false,reason:'두 구간에 각각 두 개 이상의 관측값이 필요합니다.'};
  const near=d.rows.slice(0,split),far=d.rows.slice(split);if(d.origin)near.unshift([0,0]);const direct=fit(near),refracted=fit(far),V1=1/direct.slope,V2=1/refracted.slope,crossing=(refracted.intercept-direct.intercept)/(direct.slope-refracted.slope);
  if(!(V1>0&&V2>V1&&crossing>0&&crossing<600))return{valid:false,direct,refracted,reason:'이 구간 나눔으로는 두 층의 속도와 교차 거리를 타당하게 구하기 어렵습니다. 점의 분포를 보고 구간을 다시 나누세요.'};
  const thickness=crossing/2*Math.sqrt((V2-V1)/(V2+V1));return{valid:true,direct,refracted,V1,V2,crossing,thickness,time:direct.slope*crossing+direct.intercept};
 }
 function depth(l,V1,V2){return Number.isFinite(l)&&l>0&&V1>0&&V2>V1?l/2*Math.sqrt((V2-V1)/(V2+V1)):null;}
 const api={datasets,fit,solve,depth};if(typeof module!=='undefined')module.exports=api;else root.scienceCrustThickness=api;
})(typeof window==='undefined'?globalThis:window);
