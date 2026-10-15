(function(root){'use strict';
 const cases={
  autumn:{title:'2023년 9월 20~21일',times:['9월 20일 09시','9월 20일 21시','9월 21일 09시'],iso:['2023-09-20T09:00:00+09:00','2023-09-20T21:00:00+09:00','2023-09-21T09:00:00+09:00'],
   observations:[['한반도 서쪽의 전선을 동반한 저기압을 찾으세요.','한반도와 주변의 밝은 구름 띠를 비교하세요.','황해에서 한반도로 이어지는 강수 구역을 찾으세요.'],['전선을 동반한 저기압이 남부 지방 부근으로 이동했습니다.','구름 띠가 남부 지방과 동쪽으로 이어집니다.','강수 구역이 동쪽으로 이동했습니다.'],['저기압이 동해 쪽으로 이동하고 서쪽에서 고기압이 접근합니다.','구름이 남아 있는 곳과 레이더의 강수 구역을 비교하세요.','전날보다 넓은 강수 구역이 줄고 동쪽에 일부 남아 있습니다.']]},
  summer:{title:'2021년 7월 3~4일',times:['7월 3일 06시','7월 3일 18시','7월 4일 06시'],iso:['2021-07-03T06:00:00+09:00','2021-07-03T18:00:00+09:00','2021-07-04T06:00:00+09:00'],
   observations:[['여러 저기압 중 한반도 서쪽의 전선을 동반한 저기압을 찾으세요.','한반도 서쪽의 구름과 그 동쪽 경계를 비교하세요.','강수 구역이 주로 한반도 서쪽에 분포합니다.'],['전선을 동반한 저기압이 한반도 쪽으로 이동했습니다.','구름 띠가 한반도와 동쪽으로 이어집니다.','강수 구역이 한반도에 넓게 분포합니다.'],['전선을 동반한 저기압이 동해 쪽으로 이동했습니다.','구름 띠가 동쪽으로 이동한 모습을 비교하세요.','강수 구역이 동쪽으로 이동했지만 일부 지역에 남아 있습니다.']]}
 };
 const kinds={chart:'지상 일기도',satellite:'적외 위성 영상',radar:'레이더 영상'};
 function snapshot(caseId,index,kind){if(!cases[caseId]||!kinds[kind])throw Error('Unknown weather series');index=Number.isFinite(+index)?Math.min(2,Math.max(0,Math.round(+index))):0;const c=cases[caseId];return{caseId,index,kind,title:c.title,time:c.times[index],iso:c.iso[index],file:'assets/'+caseId+'-'+kind+'-'+index+'.webp',observation:c.observations[index][Object.keys(kinds).indexOf(kind)],baseWidth:kind==='chart'?(caseId==='autumn'?320:index===0?480:385):480};}
 const api={cases,kinds,snapshot};if(typeof module!=='undefined')module.exports=api;else root.WeatherAnalysisModel=api;
})(typeof window==='undefined'?globalThis:window);
