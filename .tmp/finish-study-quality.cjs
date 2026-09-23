const fs=require('node:fs'),path=require('node:path');const base=path.resolve(__dirname,'../learning/inquiry/age-of-exploration');
const additions={
 'meeting-of-waters':[
 ['두 강이 만나는 곳의 물빛은 어떻게 다른가요?','네그루강은 새까맣고 아마존강 본류는 누렇다.',['두 강 모두 맑고 푸르다.','네그루강은 누렇고 아마존강 본류는 새까맣다.','두 강 모두 붉은빛을 띤다.'],'새까만 네그루강 물과 누런 아마존강 본류 물이 만나는 자리입니다.'],
 ['두 강물이 한동안 섞이지 않는 까닭은?','색과 온도, 흐르는 빠르기가 달라서',['두 강 사이에 둑을 쌓아서','두 강의 바닥 높이가 완전히 같아서','두 강물이 모두 얼어 있어서'],'두 물은 색도 온도도 흐르는 빠르기도 달라서'],
 ['두 물이 나란히 흘러가는 거리는?','6킬로미터 넘게',['60미터 정도','600미터 정도','60킬로미터 넘게'],'한데 섞이지 않고 6킬로미터 넘게 나란히 흘러갑니다.']
 ],
 'lm-djenne-mosque':[
 ['건물의 벽은 어떤 재료로 쌓나요?','흙벽돌',['대리석','현무암','목재 판자'],'벽을 흙벽돌로 쌓고 겉에 진흙을 발라 만듭니다.'],
 ['벽에 꽂힌 나무 막대의 용도는?','흙을 다시 바를 때 쓰는 발판',['빗물을 모으는 홈통','지붕을 받치는 내부 기둥','바람의 방향을 재는 표지'],'벽에 꽂힌 나무 막대는 꾸밈이 아니라 해마다 온 마을이 함께 흙을 다시 바를 때 쓰는 발판입니다.'],
 ['건물을 계속 손질해야 하는 까닭은?','비가 벽의 흙을 씻어 가기 때문',['돌이 열을 받아 계속 부풀기 때문','나무가 물속에서 썩기 때문','금속이 바닷바람에 녹슬기 때문'],'비가 씻어 가면 다시 바르기를 되풀이하니, 건물이 사람 손을 떠나면 곧 녹아 없어집니다.']
 ],
 'lm-kinkakuji':[
 ['금박을 입힌 곳은?','위 두 층의 겉면',['아래층의 바닥만','모든 층의 기둥 안쪽','연못 바닥 전체'],'위 두 층 겉면에 금박을 입혀'],
 ['층별 건축 방식에 대한 설명은?','귀족·무사·절집의 모습이 층마다 다르다.',['모든 층이 같은 궁궐 모습이다.','아래층만 돌집이고 나머지는 성벽이다.','모든 층이 같은 무덤 모습이다.'],'층마다 지은 방식이 달라서 아래층은 귀족의 집, 가운데층은 무사의 집, 위층은 절집 모양입니다.'],
 ['절이 되기 전의 용도는?','쇼군의 별장',['상인들의 창고','군대의 요새','외국 사절의 여관'],'원래 쇼군의 별장이었다가 그가 죽은 뒤 절이 되었습니다.']
 ],
 original_city_021:[
 ['미틀라를 신성한 도시로 삼은 사람들은?','사포텍족',['마야족','잉카족','타이노족'],'사포텍족의 신성한 도시였습니다.'],
 ['벽을 꾸민 방식은?','잘게 다듬은 돌을 끼워 기하학 무늬를 만들었다.',['진흙 벽에 동물 그림을 그렸다.','나무판에 글자를 새겨 붙였다.','벽돌 위에 금박을 입혔다.'],'돌을 잘게 다듬어 끼워 맞춘 기하학 무늬로 벽을 꾸몄는데'],
 ['돌을 맞물리게 할 때 쓰지 않은 것은?','회반죽',['기하학 무늬','다듬은 돌','끼워 맞추는 방식'],'회반죽 없이 돌끼리만 맞물려 있습니다.']
 ]
};
const file=path.join(base,'lib/study-question-bank.js');let text=fs.readFileSync(file,'utf8');text=text.replace(/\n};\s*$/,',\n'+Object.entries(additions).map(([id,rows])=>'  '+JSON.stringify(id)+': '+JSON.stringify(rows)).join(',\n')+'\n};\n');fs.writeFileSync(file,text);
const pkgFile=path.join(base,'package.json'),pkg=fs.readFileSync(pkgFile,'utf8').replace('node tests/place-study-unit.js && node tests/place-study-recovery-ui.js && node tests/place-study-smoke.js','node tests/place-study-unit.js && node tests/study-question-quality-unit.js && node tests/discovery-regions-unit.js && node tests/caspian-discovery-unit.js && node tests/place-study-recovery-ui.js && node tests/place-study-smoke.js');fs.writeFileSync(pkgFile,pkg);
console.log('Focused questions added for four short or specialized readings.');
