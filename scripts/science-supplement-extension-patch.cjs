const {edit,replace:r,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'exam-scope.js',s=>r(s," const supplement=document.createElement('script');supplement.src=new URL('supplement-labs.js?v=1',document.currentScript.src);document.body.append(supplement);"," const base=document.currentScript.src;const extra=document.createElement('script');extra.src=new URL('supplement-extra.js?v=1',base);\n const mount=()=>{const supplement=document.createElement('script');supplement.src=new URL('supplement-labs.js?v=2',base);document.body.append(supplement);};\n extra.onload=mount;extra.onerror=mount;document.body.append(extra);"));
edit(lab+'supplement-labs.js',s=>{
 s=r(s," const path=location.pathname", " Object.assign(specs,window.scienceSupplementExtensions?.({line,label,rect,jar,field})||{});\n const path=location.pathname");
 s=r(s,"':'얼음이 녹으면 물기둥", "':s.phase==='water'?'처음 물의 부피와 전체 무게를 기록합니다. 얼린 뒤, 다시 녹인 뒤와 비교합니다.':'얼음이 녹으면 물기둥");
 s=r(s,"jar(80,drained?50:130,mixed?'#a3c5a8':'#72bce6')+(!mixed?", "jar(80,drained?50:130,drained?'#f8d16d':mixed?'#a3c5a8':'#72bce6')+(!mixed&&!drained?");
 s=s.replaceAll("label('열 이동 →',230,145)","label(after?'같은 온도':'열 이동 →',230,145)");
 return s;
});
apply();
