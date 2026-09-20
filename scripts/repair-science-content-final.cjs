const {edit,replace,lab,apply}=require('./science-scope-patch.cjs');
edit(lab+'living-things/app.js',s=>{
 s=replace(s,"label: '포유류의 털이 있는가 (깃털 제외)', yes:","label: '포유류의 털이 있는가 (깃털 제외)', graphLabel: '몸털 (깃털 제외)', yes:");
 return replace(s,'>${r.label}</text>','>${r.graphLabel || r.label}</text>');
});
edit(lab+'rock-layers/index.html',s=>{
 s=replace(s,'그 층이 쌓일 때 그곳이 물속이었다.','그 지층이 물속 환경에서 쌓였을 가능성이 있다.');
 return replace(s,'조개는 물속에 살므로, 조개 화석이 든 층은 쌓일 당시 그곳이 물속이었음을 알려 줍니다.','조개 화석은 물속 환경을 추리하는 근거입니다. 화석이 옮겨져 다시 쌓였을 가능성도 있어 다른 화석과 퇴적물의 특징을 함께 살핍니다.');
});
apply();
