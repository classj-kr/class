/* Original diagnostic wording. Source concepts: MiraeN 2022 middle science 2,
 * III formative assessment 01–04, 09–14 (580dc048ed7074f8), unit assessment
 * 01, 04–06 (2f14f1ffc13a2b48). See audit evidence; no missing diagram inferred. */
(function(root){
 const misconceptions={
  'refraction#q1':{concept:'법선을 기준으로 입사각과 반사각 비교',feedback:{
   a:'0°는 빛이 법선을 따라 입사할 때입니다. 지금은 법선과 30°를 이루므로 반사각도 30°입니다. 실험에서 입사각을 0°와 30°로 바꿔 비교하세요.',
   b:'반사각을 입사각의 절반으로 계산했는지 확인하세요. 반사각은 입사각과 같으므로 30°입니다. 입사각을 30°와 60°로 바꾸어 두 각을 비교하세요.',
   d:'거울 면과 이루는 각과 법선 기준 각을 구별해야 합니다. 거울 면과는 60°지만 법선과는 30°이므로 반사각은 30°입니다.'}},
  'refraction#q2':{concept:'빛의 진행 방향에 따른 굴절',feedback:{
   b:'물에서 공기로 나오는 경우와 방향을 구별하세요. 공기에서 물로 비스듬히 들어갈 때는 법선 쪽으로 꺾여 굴절각이 더 작습니다. 실험의 진행 방향을 반대로 바꾸어 비교하세요.',
   c:'수직으로 입사하는 경우와 구별하세요. 이 문제는 비스듬히 들어가는 경우이므로 공기에서 물로 들어가면 법선 쪽으로 꺾입니다.',
   d:'90°가 되는 것은 일반적인 굴절의 결과가 아닙니다. 공기에서 물로 비스듬히 들어가면 굴절각이 입사각보다 작습니다.'}},
  'refraction#q3':{concept:'경계면과 법선 구별',feedback:{
   a:'각도를 재는 기준은 경계면이 아니라 경계면에 수직인 법선입니다. 그림에서 두 선이 이루는 90°를 확인하세요.',
   b:'빛의 색은 각도의 기준선이 아닙니다. 입사각·반사각·굴절각은 법선과 광선 사이의 각입니다.',
   c:'광원의 크기는 각도의 기준이 아닙니다. 경계면에 수직인 법선부터 찾은 뒤 광선과의 각을 재세요.'}},
  'refraction#q4':{concept:'수직 입사에서 진행 방향',feedback:{
   a:'매질이 바뀌면 항상 방향도 꺾인다고 생각했는지 확인하세요. 경계면에 수직으로 들어오면 진행 방향은 그대로입니다. 입사각 0°에서 관찰하세요.',
   c:'매질이 달라져도 빛이 없어지는 것은 아닙니다. 수직으로 들어온 빛은 꺾이지 않고 나아갑니다.',
   d:'수직 입사와 경계면을 따라 나가는 경우를 구별하세요. 이 문제에서는 법선을 따라 들어온 빛이 같은 방향으로 나아갑니다.'}},
  'lens-image#q1':{concept:'실상과 스크린에 맺히는 빛'},
  'lens-image#q2':{concept:'볼록 렌즈의 초점 안쪽 물체와 허상'},
  'lens-image#q3':{concept:'오목 렌즈의 축소된 바로 선 허상'},
  'lens-image#q4':{concept:'초점에 놓인 점광원과 평행 광선'}
 };
 const followups={refraction:[
  {id:'refraction@normal-transfer',topic:'각도의 기준 바꾸기',question:'입사 광선이 거울 면과 20°를 이룬다. 법선을 기준으로 잰 반사각은?',choices:['20°','70°','40°'],answer:1,why:'거울 면과 법선은 수직이므로 입사각은 90°−20°=70°입니다. 반사각은 입사각과 같습니다.',checks:['refraction#q1','refraction#q3'],feedback:{0:'거울 면과 이루는 각을 반사각으로 고른 응답입니다. 법선을 기준으로 바꾸면 70°가 됩니다.',2:'반사각은 거울 면과의 각을 두 배 한 값이 아닙니다. 법선 기준 입사각 70°와 같습니다.'}},
  {id:'refraction@direction-transfer',topic:'진행 방향 바꾸기',question:'빛이 물에서 공기로 나올 때 실제로 굴절해 나가는 광선을 관찰했다. 입사각이 0°보다 크다면 굴절각은?',choices:['입사각보다 작다','입사각과 항상 같다','입사각보다 크다'],answer:2,why:'물에서 공기로 비스듬히 나오는 굴절 광선은 법선에서 멀어지므로 굴절각이 더 큽니다. 문제는 전반사하지 않고 굴절한 경우입니다.',checks:['refraction#q2']},
  {id:'refraction@mirror-transfer',topic:'거울의 종류 비교',question:'물체를 거울 바로 앞에 놓았더니 바로 서고 확대된 상이 보였다. 이 결과에 해당하는 거울은?',choices:['평면거울','볼록거울','오목거울'],answer:2,why:'오목거울의 초점 안쪽에서는 바로 선 확대 허상이 보입니다. 평면거울은 같은 크기, 볼록거울은 축소된 바로 선 상입니다.'}
 ],'lens-image':[
  {id:'lens-image@screen-transfer',topic:'물체 위치와 스크린 관찰',question:'초점 거리가 10 cm인 얇은 볼록 렌즈에서 물체까지의 거리를 30 cm로 했다. 상에 대한 설명으로 옳은 것은?',choices:['바로 선 확대 허상이므로 스크린에 맺히지 않는다','거꾸로 선 축소 실상이므로 스크린에 맺힌다','물체가 멀어져 어떤 상도 생기지 않는다'],answer:1,why:'물체가 2f보다 바깥에 있으므로 f와 2f 사이에 거꾸로 선 축소 실상이 생깁니다. 렌즈 식으로 상거리는 15 cm이고 배율의 크기는 0.5입니다.',checks:['lens-image#q1','lens-image#q2']},
  {id:'lens-image@virtual-transfer',topic:'두 렌즈의 허상 비교',question:'가까운 물체가 바로 서 보였다. 볼록 렌즈의 초점 안쪽과 오목 렌즈를 구별할 관찰 결과는?',choices:['볼록 렌즈는 확대, 오목 렌즈는 축소되어 보인다','두 렌즈 모두 언제나 같은 크기로 보인다','볼록 렌즈는 축소, 오목 렌즈는 확대되어 보인다'],answer:0,why:'볼록 렌즈의 초점 안쪽에서는 확대된 바로 선 허상, 오목 렌즈에서는 축소된 바로 선 허상이 생깁니다.',checks:['lens-image#q2','lens-image#q3']}
 ]};
 const extra=typeof module!=='undefined'?require('./experiment-questions.js'):root.scienceExperimentQuestions;
 if(extra){Object.assign(misconceptions,extra.misconceptions);Object.assign(followups,extra.followups);}
 const api={misconceptions,followups};if(typeof module!=='undefined')module.exports=api;else{root.scienceMisconceptions=misconceptions;root.scienceFollowups=followups;}
})(typeof window==='undefined'?globalThis:window);
