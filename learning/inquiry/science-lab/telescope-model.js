/* Instrument practice with explicit synthetic sky conditions, not ephemerides. */
(function(root){
 'use strict';
 const targets={
  moon:{name:'상현달',diameter:.5,x:1.6,y:.9,altitude:40,feature:'밝은 부분의 표면에서 분화구와 어두운 평원을 구별할 수 있습니다.'},
  venus:{name:'금성',diameter:35/3600,x:-1.4,y:.7,altitude:25,feature:'금성의 밝은 부분이 초승 모양으로 보입니다. 모든 날에 같은 위상은 아닙니다.'},
  jupiter:{name:'목성',diameter:40/3600,x:1.2,y:-.8,altitude:45,feature:'목성의 줄무늬와 주변 위성을 관찰할 수 있습니다. 위성의 위치는 날짜에 따라 달라집니다.'},
  saturn:{name:'토성',diameter:18/3600,x:-1.1,y:-.6,altitude:35,feature:'행성 본체를 둘러싼 고리를 구별할 수 있습니다. 고리가 보이는 기울기는 시기에 따라 달라집니다.'}
 };
 const order=['tripod','mount','tube','optics'];
 const labels={tripod:'삼각대 세우기',mount:'가대·균형추 설치',tube:'경통 고정',optics:'파인더·접안렌즈 설치'};
 function initial(school='middle'){return{school,parts:[],target:school==='high-elective'?'saturn':'moon',sky:'clear',balance:2,x:0,y:0,finderOffset:.4,focus:4,eyepiece:20,view:'finder'};}
 function install(s,part){const next=order[s.parts.length];if(part!==next)return{state:s,message:s.parts.includes(part)?'이미 설치한 부품입니다.':labels[next]+'부터 해야 이 부품을 고정할 수 있습니다.'};return{state:{...s,parts:[...s.parts,part]},message:labels[part]+' 완료. '+(part==='optics'?'균형추 위치를 조절해 경통이 한쪽으로 쏠리지 않게 하세요.':labels[order[s.parts.length+1]]+'를 진행하세요.')};}
 function observe(s){
  const target=targets[s.target],assembled=order.every(p=>s.parts.includes(p)),balanced=Number(s.balance)===0;
  const altitude=s.sky==='below'?-5:s.sky==='roof'?10:target.altitude,obstruction=s.sky==='roof'?15:0;
  const available=s.sky!=='cloud'&&altitude>Math.max(0,obstruction),mag=600/Number(s.eyepiece),fov=50/mag;
  const dx=target.x-Number(s.x)-(s.view==='finder'?Number(s.finderOffset):0),dy=target.y-Number(s.y),distance=Math.hypot(dx,dy),inside=distance<fov/2;
  const visible=available&&(s.view==='eye'||assembled&&(s.view==='finder'?distance<3:distance<fov/2+target.diameter/2));
  const sharp=Math.abs(Number(s.focus))<=.5,details=visible&&s.view==='eyepiece'&&sharp&&balanced;
  const message=!available?(s.sky==='cloud'?'구름이 대상을 가립니다. 망원경 배율이나 초점을 바꾸어도 구름 뒤 천체가 드러나지는 않습니다.':s.sky==='below'?'대상이 지평선 아래에 있습니다. 관측 시기를 바꾸어야 합니다.':'대상의 고도보다 건물이 높아 가려졌습니다. 시야가 트인 장소나 다른 관측 시기를 고르세요.'):s.view==='eye'?'맨눈으로 먼저 대상의 위치와 밝은 부분을 확인합니다. 행성의 표면 무늬나 고리는 이 모습만으로 구별하기 어렵습니다.':!assembled?'삼각대부터 순서대로 망원경을 설치하세요.':!visible?'지금 시야에 대상이 없습니다. 파인더의 넓은 시야에서 대상을 찾고 십자 중심으로 옮겨 보세요.':!balanced?'대상은 보이지만 경통이 한쪽으로 쏠립니다. 균형추 위치를 조절해 안정적으로 관찰하세요.':s.view==='finder'?'넓은 파인더 시야에서 대상을 십자 중심으로 옮긴 뒤 접안렌즈로 전환하세요.':!sharp?'초점이 맞지 않아 모습이 퍼져 보입니다. 초점 조절을 조금씩 바꾸어 윤곽을 선명하게 만드세요.':target.feature;
  return{target,assembled,balanced,altitude,obstruction,available,mag,fov,dx,dy,distance,inside,visible,sharp,details,message};
 }
 const api={targets,order,labels,initial,install,observe};if(typeof module!=='undefined')module.exports=api;else root.scienceTelescope=api;
})(typeof window==='undefined'?globalThis:window);
