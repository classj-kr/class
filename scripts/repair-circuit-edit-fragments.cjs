const {edit,apply}=require('./science-scope-patch.cjs');
edit('scripts/circuit-diagram-fragments.cjs',s=>{
 const parts=[...s.matchAll(/^exports\.(\w+)=String\.raw\x60([\s\S]*?)^\x60;$/gm)];if(parts.length!==3)throw Error('Expected three apparatus fragments');
 return parts.map(m=>'exports.'+m[1]+'='+JSON.stringify(m[2])+';').join('\n')+'\n';
});
edit('scripts/fix-circuit-prediction-and-apparatus.cjs',s=>{
 const begin=s.indexOf(" s=replace(s,'            renderCircuit();'"),end=s.indexOf(" s=replace(s,'            renderMagnet();'",begin);
 if(begin<0||end<0)throw Error('Render insertion markers');
 const code=" s=replace(s,'            renderCircuit();',`            renderCircuit();\n            predictionLegend.textContent=state.closed?'이어진 회로에서 전지를 1개에서 2개로 늘리면?':'전지 1개의 이어진 회로와 비교하면, 끊어진 회로의 밝기는?';\n            stageCaption.textContent=!state.closed?'회로가 끊어져 전지 수와 관계없이 전구가 꺼집니다.':state.batteries===1?'전지 1개가 비교 기준입니다. 예상한 뒤 전지를 2개로 바꾸어 확인하세요.':'전지 두 개를 같은 방향으로 직렬연결한 결과입니다. 한 개일 때보다 밝습니다.';`);\n";
 return s.slice(0,begin)+code+s.slice(end);
});apply();
