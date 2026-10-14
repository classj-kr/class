/* A directed relationship model, not a numerical population forecast. */
(function(root){
 'use strict';
 const cards=[
  {id:'rice',name:'벼',role:'producer',fact:'빛을 이용하여 스스로 양분을 만듭니다.',food:[],position:[1,7]},
  {id:'cabbage',name:'배추',role:'producer',fact:'빛을 이용하여 스스로 양분을 만듭니다.',food:[],position:[3,7]},
  {id:'grasshopper',name:'메뚜기',role:'consumer',fact:'벼와 배추를 먹습니다.',food:['rice','cabbage'],position:[1,5]},
  {id:'caterpillar',name:'나비 애벌레',role:'consumer',fact:'배추 잎을 먹습니다.',food:['cabbage'],position:[3,5]},
  {id:'frog',name:'개구리',role:'consumer',fact:'메뚜기와 나비 애벌레를 먹습니다.',food:['grasshopper','caterpillar'],position:[1,3]},
  {id:'sparrow',name:'참새',role:'consumer',fact:'벼의 낟알, 메뚜기와 나비 애벌레를 먹습니다.',food:['rice','grasshopper','caterpillar'],position:[3,3]},
  {id:'hawk',name:'매',role:'consumer',fact:'개구리와 참새를 먹습니다.',food:['frog','sparrow'],position:[2,1]},
  {id:'mushroom',name:'버섯',role:'decomposer',fact:'죽은 생물을 분해하여 양분을 얻습니다.',food:[]},
  {id:'mold',name:'곰팡이',role:'decomposer',fact:'죽은 생물이나 배출물을 분해하여 양분을 얻습니다.',food:[]}
 ];
 const byId=Object.fromEntries(cards.map(c=>[c.id,c])),edges=cards.flatMap(c=>c.food.map(food=>food+'>'+c.id));
 const roles={producer:'생산자',consumer:'소비자',decomposer:'분해자'};
 const create=()=>({mode:'roles',assignments:{},roleCheck:null,edges:[],edgeCheck:null,from:null,removed:'none',flow:false});
 function assign(s,id,role){if(!byId[id]||role!==''&&!roles[role])return false;if(role==='')delete s.assignments[id];else s.assignments[id]=role;s.roleCheck=null;return true;}
 function classify(s){const result={correct:[],wrong:[],missing:[]};for(const c of cards)result[!s.assignments[c.id]?'missing':s.assignments[c.id]===c.role?'correct':'wrong'].push(c.id);s.roleCheck=result;return result;}
 function connect(s,from,to){if(!byId[from]?.position||!byId[to]?.position||from===to)return false;const key=from+'>'+to;if(s.edges.includes(key))return false;s.edges.push(key);s.edgeCheck=null;s.removed='none';return true;}
 function disconnect(s,key){const at=s.edges.indexOf(key);if(at<0)return false;s.edges.splice(at,1);s.edgeCheck=null;s.removed='none';return true;}
 function check(s){const result={correct:s.edges.filter(e=>edges.includes(e)),wrong:s.edges.filter(e=>!edges.includes(e)),missing:edges.filter(e=>!s.edges.includes(e))};s.edgeCheck=result;return result;}
 function complete(s){return !!s.edgeCheck&&!s.edgeCheck.wrong.length&&!s.edgeCheck.missing.length;}
 function remove(s,id){if(!complete(s)||id!=='none'&&!byId[id]?.position)return false;s.removed=id;return true;}
 function activeEdges(s){return s.edges.filter(e=>!e.split('>').includes(s.removed));}
 function prey(s,id){return activeEdges(s).filter(e=>e.split('>')[1]===id).map(e=>e.split('>')[0]);}
 function paths(s,target){
  if(target===s.removed||!byId[target]?.position)return[];
  const walk=(id,visited)=>{if(visited.has(id))return[];if(byId[id].role==='producer')return[[id]];const next=new Set(visited).add(id);return prey(s,id).flatMap(p=>walk(p,next).map(route=>[...route,id]));};
  return walk(target,new Set());
 }
 const api={cards,byId,edges,roles,create,assign,classify,connect,disconnect,check,complete,remove,activeEdges,prey,paths};
 if(typeof module!=='undefined')module.exports=api;else root.scienceFoodWeb=api;
})(typeof window==='undefined'?globalThis:window);
