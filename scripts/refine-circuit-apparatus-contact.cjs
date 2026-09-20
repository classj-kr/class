const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'circuit-bulbs/app.js',s=>{
 s=replace(s,'poleLabel(344,100,state.rightPole,state.power)','poleLabel(344,60,state.rightPole,state.power)');
 s=replace(s,"const loose=6,number=state.power?state.clips:loose;","const number=Math.min(12,Math.round(state.batteries*state.turns/50));");
 s=replace(s,"const x=369+(i%3)*12,y=(state.power?86:169)+Math.floor(i/3)*11;","const x=state.power?320+i*7:337+(i%4)*12,y=state.power?98+(i%2)*2:166+Math.floor(i/4)*11;");
 s=s.replaceAll("'영구자석 숨기기' : '영구자석과 비교'","'비교 끝내기' : '영구자석 비교'");
 return s;
});
edit(lab+'circuit-bulbs/index.html',s=>replace(s,'id="compareBtn">영구자석과 비교','id="compareBtn">영구자석 비교'));
apply();
