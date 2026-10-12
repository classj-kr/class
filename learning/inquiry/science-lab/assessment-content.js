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
 const quality=typeof module!=='undefined'?require('./question-quality-content.js'):root.scienceQualityContent;
 if(quality){Object.assign(misconceptions,quality.misconceptions);for(const [slug,questions]of Object.entries(quality.followups)){const revised=new Map(questions.map(q=>[q.id,q]));for(const q of followups[slug]||[])if(!revised.has(q.id))revised.set(q.id,q);followups[slug]=[...revised.values()];}}
 // Collected MiraeN 2022 grade-6 unit assessment af6154f5a69b7385, item 03,
 // and workbook d544b624a4fe52c2 pp. 3–4, 9–10. Authored transfer questions.
 const plantQuestions=[
  {id:'microscope@root-result',topic:'뿌리 유무와 물의 감소',concept:'물 높이의 감소와 뿌리의 흡수',question:'같은 크기의 고추 모종 A는 뿌리를 잘랐고 B는 그대로 두었다. 처음 물 높이·빛·관찰 시간을 같게 했을 때 교과서 실험에서 예상되는 결과는?',choices:['A의 물이 B보다 많이 줄어든다','B의 물이 A보다 많이 줄어든다','A와 B의 물이 같은 만큼 줄어든다'],answer:1,why:'뿌리를 그대로 둔 B에서 물이 더 많이 줄어드는 결과를 뿌리의 물 흡수와 연결할 수 있습니다. 왼쪽·오른쪽의 위치 대신 뿌리 조건을 확인해야 합니다.',feedback:{0:'뿌리를 자른 쪽이 더 많이 흡수한다고 판단했습니다. 줄기 절단과 온전한 뿌리의 기능을 구별해 보세요.',2:'처음 물 높이가 같으면 나중에도 같다고 판단했습니다. 뿌리 유무라는 다른 조건이 있습니다.'}},
  {id:'microscope@root-baseline',topic:'처음 조건이 다른 실험',concept:'마지막 수면과 감소량의 구별',question:'뿌리가 있는 A는 처음부터 물이 적었고, 뿌리를 자른 B는 처음부터 물이 많았다. 3일 뒤 A의 수면이 더 낮았다. 이 기록만으로 타당한 판단은?',choices:['A의 뿌리가 물을 더 많이 흡수했다고 확정한다','B의 뿌리를 자르면 물 흡수가 멈춘다고 확정한다','처음 높이가 달라 마지막 높이만으로 비교하기 어렵다'],answer:2,why:'비교하려는 것은 물의 감소입니다. 처음 높이를 같게 하고 나머지 조건도 통제해야 마지막 수면 차이를 해석하기 쉽습니다.',checks:['microscope@root-result']},
  {id:'microscope@root-control',topic:'비교 조건 설계',concept:'뿌리 유무만 다르게 하기',question:'뿌리의 흡수 기능을 비교하려 한다. 크기와 잎 수가 비슷한 고추 모종 두 개를 준비했을 때 알맞은 비교 조건은?',choices:['물·빛·시간 같게, 뿌리 유무 다르게','뿌리·빛·시간 같게, 물의 양 다르게','뿌리·물·시간 같게, 빛의 양 다르게'],answer:0,why:'물·빛·시간은 같게 하고 알아보려는 뿌리 유무를 다르게 해야 그 영향을 비교할 수 있습니다.'},
  {id:'microscope@leaf-water',topic:'봉지 속 물방울 해석',concept:'증산과 응결의 연결',question:'같은 조건에서 잎이 있는 모종의 마른 봉지에 물방울이 맺혔고, 잎을 제거한 쪽에서는 거의 보이지 않았다. 이 차이를 설명하는 과정은?',choices:['뿌리의 물 → 잎에서 수증기로 배출 → 봉지에서 응결','뿌리의 물 → 잎에서 액체 방울로 배출 → 봉지에 붙음','플라스크의 물 → 물방울로 증발 → 봉지를 통과'],answer:0,why:'잎을 통해 수증기 상태로 빠져나온 물이 봉지 안쪽에서 응결하면 눈에 보이는 물방울이 됩니다. 수증기와 물방울은 상태가 다릅니다.',feedback:{1:'눈에 보이는 봉지의 물방울을 잎에서 처음 나올 때의 상태와 같다고 판단했습니다.',2:'증발을 액체 물방울의 이동으로 판단했습니다. 증발은 액체가 기체로 변하는 과정입니다.'}}
 ];
 plantQuestions.push({id:'microscope@leaf-indicator',topic:'검출 도구의 처음 상태',concept:'대조 전후와 검출의 유효성',question:'염화코발트 종이는 물이 닿으면 푸른색에서 붉은색으로 변한다. 잎에 붙이기 전부터 붉은 종이가 이틀 뒤에도 붉었다. 타당한 판단은?',choices:['잎에서 나온 물을 색 변화로 확인했다','종이의 전후 색만으로는 확인할 수 없다','잎에서 물이 나오지 않음을 확인했다'],answer:1,why:'처음부터 붉었으므로 이틀 동안의 색 변화가 확인되지 않았습니다. 마른 푸른색 종이로 시작해 전후를 비교해야 합니다.',checks:['microscope@leaf-water']});
 plantQuestions.push(
  {id:'microscope@stem-control',topic:'백합 물 이동의 대조 조건',concept:'색소 물과 맹물의 비교',question:'백합의 줄기를 통한 물 이동을 색소로 알아보려 한다. 두 백합의 크기와 관찰 시간을 같게 한다면 물 조건은 어떻게 정할까?',choices:['둘 다 색소 물에 두고 자르는 위치만 바꾼다','한쪽은 맹물, 다른 쪽은 색소 물에 둔다','한쪽은 색소 물, 다른 쪽은 물 없이 둔다'],answer:1,why:'맹물에 둔 백합은 대조 대상입니다. 물의 유무나 관찰 시간을 바꾸면 색소 물의 영향을 분리하기 어렵습니다.'},
  {id:'microscope@stem-section',topic:'줄기 단면의 색소 위치',concept:'줄기 속 물 이동 통로',question:'같은 시간 뒤 맹물에 둔 백합은 색이 유지되고, 붉은 물에 둔 백합의 줄기 가로 단면에는 작은 붉은 점이 여러 개 보였다. 이 관찰이 지지하는 것은?',choices:['붉은 물이 줄기 표면 전체를 따라 올라갔다','붉은 물이 줄기 속 일부 통로를 따라 올라갔다','붉은 물이 꽃잎에서 만들어져 줄기로 내려왔다'],answer:1,why:'가로 단면의 부분적인 붉은 점은 물이 이동한 줄기 속 통로와 관련됩니다. 줄기 전체가 균일하게 붉어진 것은 아닙니다.',checks:['microscope@stem-control']},
  {id:'microscope@stem-longitudinal',topic:'가로·세로 단면 연결',concept:'같은 이동 통로의 서로 다른 단면',question:'붉은 물에 둔 백합 줄기의 가로 단면에 붉은 점이 보였다. 같은 줄기를 세로로 길게 잘랐을 때 그 부분에 대응하는 관찰은?',choices:['붉은 선이 길이 방향으로 이어진다','붉은 점만 가로 방향으로 이어진다','줄기 밖에만 붉은 층이 생긴다'],answer:0,why:'길이 방향으로 이어지는 이동 통로는 가로로 자르면 점, 세로로 자르면 선처럼 관찰됩니다.',checks:['microscope@stem-section']},
  {id:'microscope@stem-interpret',topic:'꽃과 줄기 변화의 해석',concept:'줄기의 물 운반 기능',question:'약 4시간 뒤 색소 물에 둔 백합 꽃잎이 붉어지고 줄기 위쪽 단면에도 붉은 부분이 보였다. 관찰만으로 타당한 결론은?',choices:['뿌리가 없는 백합은 물을 이동시킬 수 없다','줄기가 색소 물을 꽃 쪽으로 이동시켰다','꽃잎이 붉은 물을 만들어 줄기로 보냈다'],answer:1,why:'꽃과 위쪽 줄기의 붉은 부분은 줄기를 통한 물의 이동을 뒷받침합니다. 이동 속도나 물의 양은 이 관찰로 측정하지 않았습니다.',checks:['microscope@stem-longitudinal']}
 );
 const plantIds=new Set(plantQuestions.map(q=>q.id));
 followups.microscope=[...(followups.microscope||[]).filter(q=>!plantIds.has(q.id)),...plantQuestions];
 // Stage-specific division diagnoses override the earlier generic choice labels.
 Object.assign(misconceptions,{
  "cell-division#q1": {
    "concept": "감수 I분열 뒤의 DNA와 염색체",
    "feedback": {
      "a": "3 pg은 II분열까지 끝난 딸세포의 양입니다. I분열 직후에는 자매 염색 분체가 함께 있습니다.",
      "b": "DNA 양은 맞지만 상동 염색체가 분리되어 염색체 수는 절반입니다.",
      "d": "염색체 수와 DNA 양이 줄어드는 시기를 반대로 적용했습니다."
    }
  },
  "cell-division#q2": {
    "concept": "DNA 복제와 염색체 수",
    "feedback": {
      "a": "DNA 복제를 곧 염색체 수 증가로 보았습니다. 분체가 붙어 있는 동안 염색체 수는 같습니다.",
      "c": "염색체 수는 맞지만 S기에 DNA가 복제된 것을 빠뜨렸습니다.",
      "d": "DNA 양은 복제 전으로 두고 염색체 수만 늘렸습니다."
    }
  },
  "cell-division#q3": {
    "concept": "분리 뒤 한 세포 전체의 염색체 수",
    "feedback": {
      "b": "체세포 분열을 감수 분열의 염색체 수 감소와 혼동했습니다.",
      "c": "분열 뒤 딸세포 하나의 수입니다. 지금은 양극에 있는 염색체를 한 세포 안에서 모두 셉니다.",
      "d": "S기의 복제와 후기의 분리를 각각 두 배로 세었습니다. 복제만으로 염색체 수가 늘지는 않습니다."
    }
  },
  "cell-division#q4": {
    "concept": "한 번의 분열과 가능한 모든 조합",
    "feedback": {
      "a": "딸세포 네 개를 서로 다른 조합 네 가지로 보았습니다. 교차가 없으면 자매 염색 분체의 조합은 같습니다.",
      "b": "세 쌍이 각각 두 방향으로 배열되므로 전체 가능성은 2×2×2입니다.",
      "c": "한 번의 딸세포 수와 여러 분열에서 가능한 조합 수를 모두 네 가지로 보았습니다."
    }
  }
});
 Object.assign(misconceptions,{
  "reflex-nerve#q1": {
    "concept": "감각 신경과 운동 신경의 기능",
    "feedback": {
      "b": "신호를 받아들이는 감각 경로와 근육에 명령을 보내는 운동 경로는 구별해야 합니다.",
      "c": "운동 신경의 차단이 감각 신호의 유입까지 막는다고 보았습니다.",
      "d": "감각 신호의 유입은 정상이고 근육으로 가는 출력이 차단되어 있습니다."
    }
  },
  "reflex-nerve#q2": {
    "concept": "반사 중추와 감각 정보의 전달",
    "feedback": {
      "a": "감각 신경은 자극 정보를 전달합니다. 근육으로 보내는 운동 신호와 구별하세요.",
      "c": "의식적 판단이 먼저 필요한 반응과 척수 반사를 혼동했습니다.",
      "d": "무릎 반사의 명령이 대뇌에서 먼저 나온다고 보았습니다."
    }
  },
  "reflex-nerve#q3": {
    "concept": "동공 반사의 중추와 반응 기관",
    "feedback": {
      "a": "홍채의 근육은 맞지만 동공 반사에 대뇌의 의식적 판단이 필요한 것은 아닙니다.",
      "b": "중추는 맞지만 동공의 크기를 바꾸는 것은 수정체가 아니라 홍채입니다.",
      "d": "밝기 조절을 의식적 판단 및 수정체의 초점 조절과 혼동했습니다."
    }
  },
  "reflex-nerve#q4": {
    "concept": "공통 시계에서 반응 시간 차이 읽기",
    "feedback": {
      "a": "두 자극을 준 시각의 차이는 각 자극 뒤 반응에 걸린 시간의 차이가 아닙니다.",
      "b": "시간 차이의 크기는 맞지만 0.06초인 무릎 반사가 더 짧습니다.",
      "c": "두 근전도 최고점의 절대 시각을 바로 빼면 자극 시각이 서로 다른 점을 놓치게 됩니다."
    }
  }
});
 Object.assign(misconceptions,{
  "diffusion#q1": {
    "concept": "거리와 확산 방향",
    "feedback": {
      "b": "퍼져 가야 할 거리가 긴 방울이 먼저 변한다고 예상했습니다.",
      "c": "입자 운동이 오른쪽 한 방향으로만 일어난다고 보았습니다.",
      "d": "입자 운동이 왼쪽 한 방향으로만 일어난다고 보았습니다."
    }
  },
  "diffusion#q2": {
    "concept": "증발과 확산의 구분",
    "feedback": {
      "a": "액체 방울이 서로 닿지 않았다는 조건을 놓쳤습니다. 바닥의 액체 흐름으로 설명할 수 없습니다.",
      "c": "증발을 반대 방향의 상태 변화로 보았고 퍼지는 방향도 뒤집었습니다.",
      "d": "빛이 옮겨 간 것이 아니라 아세트산 입자가 BTB 용액에 도달한 것입니다."
    }
  },
  "diffusion#q3": {
    "concept": "거시적 균일함과 입자 운동",
    "feedback": {
      "a": "고르게 퍼진 입자가 저절로 처음 위치에 다시 모인다고 보았습니다.",
      "b": "물질이 퍼지는 현상을 입자 자체가 커지는 변화로 보았습니다.",
      "d": "거시적으로 분포가 일정한 것과 개별 입자가 멈추는 것을 혼동했습니다."
    }
  },
  "diffusion#q4": {
    "concept": "대조 조건과 관찰로 뒷받침되는 해석",
    "feedback": {
      "a": "물 대조에서는 변색이 없었습니다. 모든 액체가 같은 변화를 만든다는 결론은 맞지 않습니다.",
      "b": "BTB의 변색은 모든 종류의 입자 운동을 검출하는 장치가 아닙니다. 물 입자도 움직입니다.",
      "c": "색 변화만으로 BTB 방울의 양이 늘었다고 판단할 수 없습니다."
    }
  }
});
 Object.assign(misconceptions,{
  "refraction#q1": {
    "concept": "법선을 기준으로 한 반사각",
    "feedback": {
      "a": "법선과 30°라는 조건을 수직 입사인 0°로 보았습니다.",
      "b": "반사각은 입사각을 반으로 나눈 값이 아닙니다.",
      "d": "거울 면과 이루는 각 60°를 법선 기준의 반사각과 혼동했습니다."
    }
  },
  "refraction#q2": {
    "concept": "굴절 방향과 매질의 순서",
    "feedback": {
      "b": "두 매질을 통과하는 순서에 따른 꺾임을 모두 반대로 보았습니다.",
      "c": "물에서 공기로 나오는 경우도 법선 쪽으로 꺾인다고 보았습니다.",
      "d": "공기에서 물로 들어가는 경우도 법선에서 멀어지는 쪽으로 꺾인다고 보았습니다."
    }
  },
  "refraction#q3": {
    "concept": "평면거울의 물체-상 간격",
    "feedback": {
      "a": "거울에서 물체까지의 거리만 구했습니다. 거울 뒤의 상까지 더해야 합니다.",
      "b": "처음과 비교하여 줄어든 간격 4 cm를 이동 뒤의 전체 간격으로 보았습니다.",
      "c": "물체가 2 cm 움직일 때 상도 대칭으로 2 cm 움직이는 점을 놓쳤습니다."
    }
  },
  "refraction#q4": {
    "concept": "거리 변화로 거울과 렌즈 구별",
    "feedback": {
      "a": "볼록거울은 도립상을 만들지 않으며 볼록렌즈도 언제나 축소 정립상을 만드는 것은 아닙니다.",
      "c": "B는 맞지만 볼록거울의 상은 거리에 관계없이 바로 서 있습니다.",
      "d": "A는 맞지만 볼록렌즈는 가까운 물체를 확대하고 충분히 먼 물체는 뒤집어 보입니다."
    }
  }
});
 const api={misconceptions,followups};if(typeof module!=='undefined')module.exports=api;else{root.scienceMisconceptions=misconceptions;root.scienceFollowups=followups;}
})(typeof window==='undefined'?globalThis:window);
