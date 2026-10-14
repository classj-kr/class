(function(root){'use strict';
 const rocks=[
  {id:'A',image:'sandstone',name:'사암',family:'sedimentary',acid:false,feature:'모래 크기의 알갱이가 모여 있습니다. 결정이 맞물린 표본과 비교하세요.'},
  {id:'B',image:'basalt',name:'현무암',family:'igneous',acid:false,feature:'어두운 바탕에서 개별 결정을 구별하기 어렵고 구멍이 보입니다. 구멍은 결정 자체가 아닙니다.'},
  {id:'C',image:'gneiss',name:'편마암',family:'metamorphic',acid:false,feature:'밝은 광물과 어두운 광물이 불규칙한 띠를 이루고 있습니다.'},
  {id:'D',image:'granite',name:'화강암',family:'igneous',acid:false,feature:'밝고 어두운 광물 결정이 서로 맞물려 있습니다. 하나하나 구별할 수 있습니다.'},
  {id:'E',image:'marble',name:'대리암',family:'metamorphic',acid:true,feature:'밝은 결정들이 모여 있습니다. 색뿐 아니라 묽은 염산 반응도 비교하세요.'},
  {id:'F',image:'conglomerate',name:'역암',family:'sedimentary',acid:false,feature:'큰 자갈과 더 작은 알갱이가 함께 있습니다. 전체 덩어리 크기와 알갱이 크기를 구분하세요.'}
 ];
 const families={igneous:'화성암',sedimentary:'퇴적암',metamorphic:'변성암'};
 const minerals=[{id:'quartz',name:'석영',streak:null,magnetic:false,acid:false},{id:'feldspar',name:'장석',streak:'흰색',magnetic:false,acid:false},{id:'biotite',name:'흑운모',streak:'흰색',magnetic:false,acid:false},{id:'calcite',name:'방해석',streak:'흰색',magnetic:false,acid:true},{id:'magnetite',name:'자철석',streak:'검은색',magnetic:true,acid:false}];
 function classify(id,name,family){const r=rocks.find(r=>r.id===id);if(!r||!rocks.some(r=>r.name===name)||!families[family])return{complete:false};return{complete:true,nameCorrect:r.name===name,familyCorrect:r.family===family,correct:r.name===name&&r.family===family};}
 function observe(id,tool){const m=minerals.find(m=>m.id===id);if(!m||!['streak','clip','acid'].includes(tool))return null;return tool==='streak'?(m.streak||'조흔판에 흠집'):tool==='clip'?(m.magnetic?'클립이 달라붙음':'클립이 붙지 않음'):(m.acid?'거품 발생':'거품 없음');}
 const api={rocks,families,minerals,classify,observe};if(typeof module!=='undefined')module.exports=api;else root.MiddleRockModel=api;
})(typeof window==='undefined'?globalThis:window);
