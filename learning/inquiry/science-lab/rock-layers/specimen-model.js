(function(root){'use strict';
 const types={mud:'이암',sand:'사암',conglomerate:'역암'};
 const rocks=[
  {id:'A',image:'sand-a',detail:'sand-detail',type:'sand',hint:'표면에 모래 크기의 알갱이가 모여 있습니다. 암석 덩어리의 크기와 알갱이의 크기는 다릅니다.'},
  {id:'B',image:'mud-b',type:'mud',hint:'알갱이가 매우 작아 하나하나 구별하기 어렵습니다. 밝은 색이라는 이유만으로 분류하지 마세요.'},
  {id:'C',image:'conglomerate-a',detail:'conglomerate-detail',type:'conglomerate',hint:'작은 알갱이 사이에 크고 둥근 자갈이 섞여 있습니다. 자갈만 있는 암석은 아닙니다.'},
  {id:'D',image:'mud-a',detail:'mud-detail',type:'mud',hint:'전체 표면의 줄무늬와 표면을 이루는 작은 알갱이를 구별하세요. 모래 알갱이가 뚜렷한 표본과 비교해 보세요.'},
  {id:'E',image:'sand-b',type:'sand',hint:'작은 모래 알갱이가 모인 암석입니다. 밝은 선이나 짙은 색 자체가 퇴적암의 분류 기준은 아닙니다.'},
  {id:'F',image:'conglomerate-b',type:'conglomerate',hint:'여러 색의 큰 자갈이 작은 알갱이와 함께 섞여 있습니다. 색이 다른 자갈도 같은 분류 안에 들어갑니다.'}
 ];
 const fossils=[{id:'fish',name:'물고기 화석',type:'body',hint:'지느러미와 몸의 뼈처럼 생물 몸체의 모양이 남아 있습니다.'},{id:'leaf',name:'나뭇잎 화석',type:'body',hint:'잎의 윤곽과 잎맥처럼 식물 몸체의 모양이 남아 있습니다.'},{id:'footprint',name:'새 발자국 화석',type:'trace',hint:'발 자체가 아니라 생물이 움직이며 남긴 자국입니다.'}];
 const steps=['clay','press','lift','mix','pour','set','separate'];
 const create=()=>({view:'rocks',selected:'A',rockAnswers:{},rockFirst:null,rockChecked:false,fossilAnswers:{},fossilFirst:null,fossilChecked:false,phase:0,attempts:[]});
 function answer(s,kind,id,value){const rows=kind==='rock'?rocks:kind==='fossil'?fossils:null;if(!rows?.some(r=>r.id===id)||!(kind==='rock'?Object.keys(types):['body','trace']).includes(value))return false;s[kind+'Answers'][id]=value;s[kind+'Checked']=false;return true;}
 function check(s,kind){const rows=kind==='rock'?rocks:kind==='fossil'?fossils:null;if(!rows)return{complete:false,wrong:[]};const answers=s[kind+'Answers'];if(rows.some(r=>!answers[r.id]))return{complete:false,wrong:[]};const wrong=rows.filter(r=>answers[r.id]!==r.type).map(r=>r.id);s[kind+'First']??={answers:{...answers},wrong:[...wrong]};s[kind+'Checked']=true;return{complete:true,wrong};}
 function act(s,action){if(!steps.includes(action))return false;const ok=steps[s.phase]===action;s.attempts.push({action,phase:s.phase,ok});if(ok)s.phase++;return ok;}
 const api={types,rocks,fossils,steps,create,answer,check,act};if(typeof module!=='undefined')module.exports=api;else root.RockSpecimenModel=api;
})(typeof window==='undefined'?globalThis:window);
