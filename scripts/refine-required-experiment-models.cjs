const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit('scripts/sync-science-catalog.cjs',s=>replace(s,"[...additions['volcano-model'],'4과11-01']","[...(additions['volcano-model']||[]),'4과11-01']"));
edit(lab+'required-experiments.js',s=>{
 s=replace(s,"Q sixty 130 98 85 Q130 140 98 165Z\" fill=\"#efac43\"/>`.replace('sixty','70')","Q70 130 98 85 Q130 140 98 165Z\" fill=\"#efac43\"/>`");
 s=replace(s,"if(!+s.step)svg+=r(s.ice", "if(rise)svg+=r(315,163,35,32,'#9dcde4','opacity=\".65\"');\n+  if(!+s.step)svg+=r(s.ice".replace('\n+','\n'));
 s=replace(s,"initial:{eye:'right',gap:'140'}","initial:{eye:'right',gap:'140',seen:'unchecked'}");
 s=replace(s,"[[90,'좁게'],[140,'중간'],[190,'넓게']])],view(s)","[[90,'좁게'],[140,'중간'],[190,'넓게']]),f('seen','내가 관찰한 결과',[['unchecked','아직 확인 전'],['visible','점이 보임'],['hidden','점이 안 보임']])],view(s)");
 s=replace(s,"['관찰할 표시','옆의 검은 점']]","['관찰할 표시','옆의 검은 점'],['내 관찰',{unchecked:'아직 확인 전',visible:'점이 보임',hidden:'점이 안 보임'}[s.seen]]]");
 s=replace(s,'render();b.focus();','render();at(`[data-experiment="${v.id}"]`).focus({preventScroll:true});');
 return s;
});
apply();
