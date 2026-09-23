const fs=require('node:fs'),path=require('node:path');const base=path.resolve(__dirname,'../learning/inquiry/age-of-exploration');
function edit(file,changes){const p=path.join(base,file),original=fs.readFileSync(p,'utf8');let s=original.replace(/\r\n/g,'\n');for(const[a,b]of changes){if(!s.includes(a))throw Error('Missing edit '+file+': '+a);s=s.replace(a,b);}fs.writeFileSync(p,original.includes('\r\n')?s.replace(/\n/g,'\r\n'):s);}
edit('lib/study-question-builder.js',[
 ['|[은는이가을를에의와과도만로입였인일으들])','|까지|부터|처럼|보다|마저|조차|밖에|마다|[은는이가을를에의와과도만로입였인일으들])'],
 ["      if(alternatives.length<3)continue;\n      result.push({prompt:'읽은 설명의 빈칸에 들어갈 말은?',passage:masked(line,word),answer:word,","      const passage=masked(line,word);\n      if(alternatives.length<3||passage.includes(word))continue;\n      result.push({prompt:'읽은 설명의 빈칸에 들어갈 말은?',passage,answer:word,"],
 ["      result.push({prompt:'읽은 설명의 빈칸에 들어갈 값은?',passage:line.slice(0,match.index)+'(          )'+line.slice(match.index+answer.length),answer,choices,explanation:line,priority:1000});","      const passage=line.slice(0,match.index)+'(          )'+line.slice(match.index+answer.length);\n      if(passage.includes(answer)||item.name.includes(answer))continue;\n      result.push({prompt:'읽은 설명의 빈칸에 들어갈 값은?',passage,answer,choices,explanation:line,priority:1000});"]
]);
edit('lib/study-concepts.js',[
 ["  ['담수','염수','민물','바닷물','온천수'],\n",''],
 ["  ['높아','낮아','넓어','좁아','깊어','얕아'],\n",''],
 ["  ['흘러','불어','쌓여','녹아','솟아','깎여'],\n",''],
 ["  ['쌓아','파서','깎아','엮어','그려','녹여'],\n",'']
]);
edit('lib/study-question-bank.js',[
 ["'강이 조개를 산 위로 운반했기 때문','화산재가 조개 모양으로 굳었기 때문','빙하가 조개를 새로 만들어 냈기 때문'","'옛 호수의 퇴적층이 남았기 때문','강이 운반한 퇴적물이 쌓였기 때문','화산이 바다에서 솟아올랐기 때문'"],
 ["'해안의 갯벌에서 벼만 길렀다.','바다 위 뗏목에서 밀을 길렀다.','빙하 위 온실에서 사탕수수를 길렀다.'","'평평한 밭에서 벼와 보리를 길렀다.','강가의 밭에서 밀과 콩을 길렀다.','넓은 밭에서 목화와 사탕수수를 길렀다.'"],
 ["'도시를 둘러싼 빙하','도시 앞의 산호초','도시 안의 거대한 화산'","'항구의 옛 선박들','도시의 성벽과 성문만','시칠리아의 모든 도시'"],
 ["'바닷물을 농지로 끌어오기 쉬웠다.','빙하를 이용해 식량을 보관할 수 있었다.','넓은 모래밭에서 낙타를 기르기 좋았다.'","'강의 범람을 이용해 농사짓기 좋았다.','바다와 바로 맞닿아 배를 대기 좋았다.','넓고 평평해서 도시를 늘리기 좋았다.'"]
]);
console.log('Question wording and answer masking refined.');
