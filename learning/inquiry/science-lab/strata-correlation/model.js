(function(root){
 'use strict';
 const rocks={sand:'사암',lime:'석회암',tuff:'응회암',shale:'셰일',silty:'사질 셰일',conglomerate:'역암'};
 // Bottom to top; unit numbers are internal correlation keys, not measured ages.
 // Source diagram: 2022 동아 지구과학, printed p.84 (PDF p.8).
 const cases={
  key:{title:'건층으로 대비',units:['conglomerate','sand','lime','tuff','sand','shale','lime','silty'],regions:[{name:'Ⅰ',units:[1,2,3,4,5],gaps:[]},{name:'Ⅱ',units:[0,1,2,3,4],gaps:[0]},{name:'Ⅲ',units:[3,4,5,6,7],gaps:[]}],fossils:{},oldest:'Ⅱ',youngest:'Ⅲ'},
  fossil:{title:'화석으로 대비',units:['silty','sand','lime','shale','lime','conglomerate','silty','tuff','sand','lime','silty'],regions:[{name:'A',units:[0,1,2,5,6,9],gaps:[2,6]},{name:'B',units:[2,3,4,5,6,9,10],gaps:[6]},{name:'C',units:[1,2,5,6,7,8,9],gaps:[2]}],fossils:{2:'삼엽충',9:'암모나이트'},oldest:'A',youngest:'B'}
 };
 function layer(mode,region,index){const c=cases[mode],r=c?.regions[region];if(!r||!Number.isInteger(index)||index<0||index>=r.units.length)return null;const unit=r.units[index],rock=c.units[unit];return{region,index,unit,rock,name:rocks[rock],fossil:c.fossils[unit]||null,gapAbove:r.gaps.includes(unit),label:r.name+'-'+(r.units.length-index)};}
 function compare(mode,a,b){const left=layer(mode,a?.region,a?.index),right=layer(mode,b?.region,b?.index);if(!left||!right||left.region===right.region)return{valid:false,correct:false};return{valid:true,correct:left.unit===right.unit,sameRock:left.rock===right.rock,left,right};}
 const api={rocks,cases,layer,compare};if(typeof module!=='undefined')module.exports=api;else root.scienceStrataCorrelation=api;
 })(typeof window==='undefined'?globalThis:window);
