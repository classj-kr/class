(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.SunspotModel=api;})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 const rad=Math.PI/180,deg=180/Math.PI;
 // Perspective intersection with a unit solar sphere. x is solar west, y is north.
 function locate(px,py,frame){
  const x=(px-frame.cx)/frame.radius,y=(frame.cy-py)/frame.radius,r=Math.hypot(x,y);
  if(!Number.isFinite(r)||r>=1)return null;
  const D=frame.distanceSolarRadii,a=x/Math.sqrt(D*D-1),b=y/Math.sqrt(D*D-1);
  const t=(D*D-1)/(D+Math.sqrt(Math.max(0,1-(D*D-1)*(a*a+b*b))));
  const X=t*a,Y=t*b,Z=D-t,B=frame.b0*rad;
  return {lat:Math.asin(Math.max(-1,Math.min(1,Y*Math.cos(B)+Z*Math.sin(B))))*deg,lon:Math.atan2(X,Z*Math.cos(B)-Y*Math.sin(B))*deg,r,x:px,y:py};
 }
 function project(lat,lon,frame){
  const B=frame.b0*rad,p=lat*rad,l=lon*rad,D=frame.distanceSolarRadii;
  const x=Math.cos(p)*Math.sin(l),y=Math.sin(p)*Math.cos(B)-Math.cos(p)*Math.cos(l)*Math.sin(B),z=Math.sin(p)*Math.sin(B)+Math.cos(p)*Math.cos(l)*Math.cos(B);
  if(z<1/D)return null;
  const scale=Math.sqrt(D*D-1)/(D-z);
  return {x:frame.cx+x*scale*frame.radius,y:frame.cy-y*scale*frame.radius};
 }
 function compare(a,b,first,last){
  if(!a||!b)return {valid:false,reason:'두 날짜에서 같은 흑점의 위치를 선택하세요.'};
  const days=(Date.parse(last.date)-Date.parse(first.date))/86400000,angle=b.lon-a.lon,lat=(a.lat+b.lat)/2;
  if(days<=0)return {valid:false,reason:'관측 날짜의 순서를 확인하세요.'};
  if(a.r>.97||b.r>.97)return {valid:false,reason:'가장자리에서는 위치 오차가 커집니다. 원반 안쪽의 다른 흑점을 고르세요.'};
  if(Math.abs(a.lat-b.lat)>6)return {valid:false,reason:'두 위치의 위도 차이가 큽니다. 같은 흑점을 짚었는지 중간 날짜에서도 확인하세요.'};
  if(angle<=1)return {valid:false,reason:'서쪽으로 이동한 각거리가 확인되지 않습니다. 같은 흑점과 날짜 순서를 다시 확인하세요.'};
  return {valid:true,days,angle,lat,period:360*days/angle,warning:a.r>.85||b.r>.85?'원반 가장자리에 가까운 측정입니다. 다른 흑점의 결과와 함께 비교하세요.':''};
 }
 return {locate,project,compare};
});
