/* Required observation gaps: local 2022 science standards + their explanations.
 * School models are schematic; rock media are documented specimen photographs.
 * No high-school elective extensions, clinical procedures or unsupervised reagents.
 */
function scienceCoreFactory({line,label,rect,jar,field},existing={}) {
 const result={};
 const circle=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
 const ellipse=(x,y,rx,ry,fill)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
 const stages=field('stage','관찰 시점',[['before','처음'],['after','변화 뒤']]);
 // Feedback is attached to the choice text before display-order rotation.
 const misconceptionByChoice={
 "물 50 g·용질 10 g과 20 g": "용질의 종류와 넣는 무게가 함께 달라집니다. 종류만 비교하려면 넣는 무게도 같아야 합니다.",
 "물 50 g과 100 g·용질 10 g씩": "물의 양도 달라져 용질 종류만의 영향을 구별하기 어렵습니다.",
 "B만": "물을 더 넣은 B는 묽어집니다. 설탕을 더 녹인 A와 물을 더 넣은 B를 구별하세요.",
 "A와 B 모두": "물과 설탕을 더하는 것은 같은 변화가 아닙니다. B에는 설탕이 늘지 않았습니다.",
 "염기성 용액": "달걀 껍데기의 탄산 칼슘과 반응해 이산화 탄소를 만드는 것은 이 비교의 산성 용액입니다.",
 "물": "물에 넣기만 한 대조 조건과 산성 용액에서 계속 기포가 생기는 조건을 구별하세요.",
 "탄산 칼슘에 대한 반응": "탄산 칼슘은 껍데기의 주성분입니다. 익힌 흰자의 주성분인 단백질과 구별하세요.",
 "금속에 대한 반응": "흰자는 금속 재료가 아닙니다. 사용하는 시료의 성분을 먼저 확인하세요.",
 "물의 표면과 내부에서 기포가 생긴다": "물속의 기포는 끓음의 특징입니다. 상온에서 마르는 빨래에서도 같은 기포가 생기는 것은 아닙니다.",
 "물의 온도가 끓는점까지 올라간다": "끓음은 끓는점에서 일어나지만 증발은 그보다 낮은 온도에서도 일어납니다.",
 "컵 안의 파란색 물": "새지 않는 컵의 벽을 안쪽 물이 통과한 것이 아닙니다. 바깥 물방울의 색과 위치도 살펴보세요.",
 "컵 속 얼음이 녹은 물": "얼음이 녹은 물은 컵 안에 있습니다. 컵 바깥의 물방울이 생기는 과정과 구별하세요.",
 "반사": "반사는 빛이 경계에서 되돌아오는 현상입니다. 여기서는 빛이 렌즈 안으로 통과했습니다.",
 "산란": "산란은 빛이 여러 방향으로 퍼지는 현상입니다. 여기서는 경계를 통과한 한 경로의 꺾임을 관찰했습니다.",
 "인형 → 광원 → 눈": "스스로 빛을 내지 않는 인형이 먼저 광원에 빛을 보내지는 않습니다.",
 "눈 → 인형 → 광원": "눈은 이 관찰에서 빛을 받는 곳입니다. 눈이 인형으로 빛을 내보내는 것이 아닙니다.",
 "볼록거울 · 오목렌즈": "두 도구는 물체보다 작은 바로 선 상을 만듭니다. 확대된 상이라는 조건을 함께 확인하세요.",
 "평면거울 · 오목렌즈": "평면거울의 상은 같은 크기이고 오목렌즈의 상은 더 작습니다. 바로 섰다는 것만으로 확대를 판단할 수 없습니다.",
 "모양은 같고 부피는 다르다": "용기를 바꾸면 물의 모양이 달라집니다. 물을 모두 옮겼다면 높이 차이를 부피 감소로 해석하지 않습니다.",
 "모양과 부피가 모두 다르다": "높이가 낮아져도 컵의 폭이 넓어졌습니다. 물이 새거나 증발하지 않았다면 부피는 유지됩니다.",
 "공기가 컵 안으로 들어와 그만큼 물도 들어왔다": "관찰한 거품은 컵 밖으로 나갑니다. 공기의 이동 방향을 반대로 해석했습니다.",
 "공기가 물에 모두 녹고 그 자리를 물이 채웠다": "위로 올라온 거품에서 컵 밖으로 빠져나가는 공기를 볼 수 있습니다. 모두 녹았다는 해석과 다릅니다.",
 "현무암에서 서로 맞물린 큰 알갱이가 더 뚜렷하게 보인다.": "이 두 사진에서는 화강암의 큰 알갱이가 더 뚜렷합니다. 두 표본의 관찰 결과를 바꾸어 연결했습니다.",
 "두 표본 모두 전체가 한 가지 색으로 고르게 보인다.": "화강암 사진에는 밝고 어두운 알갱이가 함께 보입니다. 표본 전체를 한 색으로 묶지 마세요.",
 "밀기: 오른쪽 · 당기기: 오른쪽": "두 번째 실험에서는 왼쪽으로 당겼습니다. 첫 실험의 이동 방향을 그대로 적용하지 마세요.",
 "밀기: 왼쪽 · 당기기: 오른쪽": "주어진 두 실험에서 힘을 가한 방향을 각각 반대로 연결했습니다.",
 "동쪽 → 북쪽 하늘 → 서쪽": "우리나라에서 한낮의 태양은 남쪽 하늘에 있습니다. 뜨고 지는 방향과 한낮의 방향을 함께 비교하세요.",
 "서쪽 → 남쪽 하늘 → 동쪽": "태양이 뜨는 동쪽과 지는 서쪽을 서로 바꾸었습니다.",
 "지구의 자전": "자전은 하루 동안 별이 움직여 보이는 현상과 관련됩니다. 같은 시각에 계절을 달리해 본 조건과 구별하세요.",
 "지구의 공전": "지구가 태양 주위를 한 바퀴 도는 데에는 약 1년이 걸립니다. 하루 주기의 낮과 밤과 구별하세요.",
 "달의 공전": "달의 공전은 달의 위치와 모양 변화에 관련됩니다. 관찰 장소가 태양을 향하는 방향을 바꾸는 지구의 운동과 구별하세요.",
 "입자 사이 거리와 배열": "거리와 배열은 상태 변화에서 달라질 수 있습니다. 입자 자체의 성질과 구별하세요.",
 "전체 물질의 모양": "전체 모양은 담긴 용기와 물질의 상태에 따라 달라질 수 있습니다.",
 "입자 하나의 크기": "압축할 때 줄어드는 것은 입자 사이의 공간입니다. 입자 자체가 같은 비율로 작아지는 것은 아닙니다.",
 "주사기 속 전체 입자 수": "기체가 새지 않는 조건이므로 전체 입자 수는 유지됩니다.",
 "기체의 양 · 온도": "온도는 바꾸어 보는 조건입니다. 온도를 고정하면 온도와 부피의 관계를 비교할 수 없습니다.",
 "기체의 온도 · 압력": "온도는 바꾸고 기체의 양을 고정해야 합니다. 기체의 양까지 바뀌면 부피 차이의 원인을 구별하기 어렵습니다.",
 "온도 상승 · 액체 양 감소": "압력이 일정한 순수한 물이 끓는 동안에는 공급된 열이 기화에 쓰여 온도가 일정합니다.",
 "온도 일정 · 액체 양 유지": "온도가 일정해도 액체가 계속 기체로 바뀝니다. 액체인 물의 양은 줄어듭니다.",
 "팽창 → 온도 상승 → 응결": "이 상승 과정에서 공기는 팽창하면서 냉각됩니다. 온도 변화의 방향을 반대로 연결했습니다.",
 "압축 → 온도 하강 → 응결": "공기가 올라가면 주변 기압이 낮아져 팽창합니다. 압축되는 상황과 구별하세요.",
 "100 g : 200 g = 1 : 2": "질량이 두 배여도 자유 낙하의 가속도가 두 배가 되지는 않습니다.",
 "100 g : 200 g = 2 : 1": "공기 저항이 없는 이 조건에서는 가벼운 물체의 낙하 속력이 더 커지지 않습니다.",
 "왼쪽 N극 · 오른쪽 S극": "전류 방향을 반대로 바꾸면 코일의 자기장 방향도 바뀝니다. 극이 그대로 남지 않습니다.",
 "양쪽 끝 모두 극이 없음": "전류 방향을 바꾸는 것과 전류를 끄는 것은 다릅니다. 전류는 계속 흐릅니다.",
 "양성자": "이 마찰 대전에서는 전자가 옮겨 갑니다. 원자핵 속 양성자의 이동과 구별하세요.",
 "원자핵 전체": "원자핵 전체가 옮겨 가서 대전되는 것은 아닙니다. 전자의 이동을 살펴보세요.",
 "가까운 쪽 음전하 · 먼 쪽 양전하": "음전하를 띤 막대는 금속구의 전자를 먼 쪽으로 밀어냅니다. 재배치 방향을 반대로 해석했습니다.",
 "가까운 쪽 음전하 · 먼 쪽 음전하": "접촉하거나 접지하지 않았으므로 금속구 전체 전하량은 그대로입니다. 전자가 한쪽으로 재배치되는 현상입니다.",
 "얼음이 녹음": "얼음이 녹아도 물이라는 물질의 종류는 유지됩니다. 상태 변화와 새 물질 생성을 구별하세요.",
 "종이를 가위로 자름": "자르면 종이의 크기와 모양이 바뀝니다. 타서 재와 기체가 생기는 변화와 구별하세요.",
 "세포막": "식물 세포와 동물 세포 모두 세포막이 있습니다. 식물 세포의 세포벽과 구별하세요.",
 "핵": "관찰하는 식물 세포와 동물 세포 모두 핵이 있습니다. 두 세포를 구별하는 구조가 아닙니다.",
 "다가갈 때 방향을 유지한다": "자석이 그 자리에 있어도 자기장이 더 이상 변하지 않으면 유도 전류가 계속 흐르지 않습니다.",
 "다가갈 때와 반대로 기운다": "반대 방향 전류는 자석을 반대 방향으로 움직이는 경우와 관련됩니다. 멈춘 경우와 구별하세요.",
 "1 : 1 : 1": "수소 분자와 산소 분자가 같은 수로 반응하지 않습니다. 반응식을 원자 수가 보존되도록 맞추세요.",
 "2 : 2 : 1": "반응 전후 수소와 산소의 원자 수가 맞지 않습니다. 같은 온도·압력의 기체 부피비를 반응식 계수와 비교하세요.",
 "딸세포 92개 · 생식세포 23개": "DNA가 복제되어도 체세포분열을 마친 딸세포 하나의 염색체 수가 두 배가 되지는 않습니다.",
 "딸세포 46개 · 생식세포 46개": "정상적인 생식세포 형성에서는 염색체 수가 절반으로 줄어듭니다.",
 "반응 시작 온도 · 미리 가열한 여부": "미리 가열한 여부는 두 실험에서 달리할 조건입니다. 감자의 양은 같게 맞추어야 합니다.",
 "감자의 양 · 미리 가열한 여부": "미리 가열한 여부를 달리하되 반응을 시작할 때의 온도는 같게 맞추어야 합니다.",
 "반응하는 데 걸린 시간이 다름": "시간의 차이는 서로 다른 점입니다. 비슷한 화학적 성질을 찾는 질문에서는 공통된 생성물을 살펴보세요.",
 "물과 반응하는 세기가 다름": "반응 세기의 차이는 서로 다른 점입니다. 같은 족의 공통된 반응과 세기의 차이를 구별하세요.",
 "염산 20 mL · 수산화 나트륨 30 mL": "전체 50 mL로 A의 40 mL와 다릅니다. 혼합비 이외에 전체 양도 바뀝니다.",
 "염산 10 mL · 수산화 나트륨 10 mL": "전체 20 mL로 A의 40 mL와 다릅니다. 전체 양을 유지한 비교가 아닙니다.",
 "녹는 온도 높아짐 · 시간 같음": "물질의 양이 늘어도 녹는점은 같고, 같은 가열 세기로 모두 녹이는 데 필요한 시간은 더 길어집니다.",
 "녹는 온도 높아짐 · 시간 길어짐": "시간이 더 걸리는 것과 녹는점이 높아지는 것은 다릅니다. 같은 순수한 물질의 녹는점은 같습니다."
};
 const check=(question,choices,answer,why)=>{const shift=[...question].reduce((n,c)=>n+c.charCodeAt(0),0)%choices.length,ordered=choices.slice(shift).concat(choices.slice(0,shift)),key=String((+answer-shift+choices.length)%choices.length);return{question,choices:ordered,answer:key,why,feedback:Object.fromEntries(ordered.flatMap((text,i)=>String(i)!==key&&misconceptionByChoice[text]?[[String(i),misconceptionByChoice[text]]]:[]))};};
 function add(slug,spec){
  const old=existing[slug];
  if(!old){result[slug]=spec;return;}
  const fields=(p,s)=>typeof p.fields==='function'?p.fields(s):p.fields;
  result[slug]={title:spec.title,codes:[...new Set([...old.codes,...spec.codes])],initial:{...old.initial,...spec.initial,pathway:'core'},
   fields:s=>[field('pathway','관찰 선택',[['core',spec.title],['previous',old.title]]),...fields(s.pathway==='core'?spec:old,s)],
   view:s=>s.pathway==='core'?spec.view(s):old.view(s)};
 }
 add('microbes',{
  title:'버섯·곰팡이·해캄·짚신벌레·세균 관찰',codes:['4과12-01'],initial:{sample:'mushroom',focus:'whole'},
  fields:[field('sample','준비된 표본',[['mushroom','버섯'],['mold','곰팡이'],['algae','해캄'],['paramecium','짚신벌레'],['bacteria','세균']]),field('focus','관찰 초점',[['whole','전체 보기'],['detail','특징 살피기']])],
  view(s){let svg='',text='',detail=s.focus==='detail';

   let media;
   const photo=(name,file,author,source,license,alt,caption,origin='50% 50%')=>({name,src:'assets/observations/'+file+'.webp',author,source,license,licenseUrl:license==='CC0'?'https://creativecommons.org/publicdomain/zero/1.0/':'https://creativecommons.org/licenses/by-sa/3.0/',collection:'',alt,caption,origin});
   if(s.sample==='mushroom'){
    media={items:[photo('버섯의 갓 아래','mushroom','sethonfire87','https://wordpress.org/photos/photo/6376536a28/','CC0','버섯의 자루 둘레에서 갓 가장자리까지 방사상으로 뻗은 촘촘한 주름 사진','자루에서 갓 가장자리로 뻗은 주름을 따라 보세요.','55% 40%')],enlarged:detail,zoom:1.7};
    text='버섯의 갓을 아래에서 본 사진입니다. 가운데 자루 주변에서 갓 가장자리까지 촘촘한 주름이 뻗어 있습니다. 버섯은 종류에 따라 갓 아래의 모습이 다릅니다.';
   }
   if(s.sample==='mold'){
    media={items:[detail?
     photo('곰팡이의 둥근 끝 부분','mold','Agong1','https://commons.wikimedia.org/wiki/File:Rhizopus_fungus.jpg','CC0','둥근 포자낭과 연결된 가느다란 자루가 보이는 빵곰팡이 현미경 사진','둥근 끝 부분과 그곳에 이어진 가느다란 부분을 구별하세요.'):
     photo('실처럼 얽힌 곰팡이','mold-whole','Curtis Clark','https://commons.wikimedia.org/wiki/File:Rhizopus_clonal_sporangia.jpg','CC BY-SA 3.0','여러 가닥의 실 같은 균사가 얽히고 둥근 포자낭이 보이는 염색 현미경 사진','실처럼 뻗은 부분들이 여러 방향으로 얽혀 있습니다.')],enlarged:false,modeLabel:detail?'현미경 사진 · 둥근 끝 부분':'현미경 사진 · 실 같은 구조'};
    text='빵곰팡이의 현미경 사진입니다. 가느다란 실 같은 부분과 둥근 끝 부분이 함께 보입니다. 특징 살피기를 누르면 다른 표본에서 둥근 부분을 더 자세히 관찰할 수 있습니다.';
   }
   if(s.sample==='algae'){
    media={items:[photo('해캄의 나선 모양 띠','spirogyra','Keisotyo · NEON(원본 보정)','https://commons.wikimedia.org/wiki/File:Spirogyra_sp.jpg','CC BY-SA 3.0','길게 이어진 해캄 세포 안에 여러 초록색 띠가 나선 모양으로 감겨 있는 현미경 사진','마디를 나누는 경계와 그 안의 초록색 나선 모양 띠를 찾아보세요.')],enlarged:detail,zoom:1.65,modeLabel:detail?'현미경 사진 · 부분 확대':'현미경 사진 · 전체 시야'};
    text='해캄은 초록색의 여러 마디가 실처럼 이어져 있습니다. 세포 안에서 띠처럼 감겨 있는 초록색 부분은 엽록체입니다. 이 사진에서는 여러 나선 모양 띠가 보입니다.';
   }
   if(media)media.info='사진마다 표본과 확대 정도가 다릅니다. 현미경 표본은 준비 방법에 따라 색이 다르게 보일 수 있습니다. 확대는 사진의 일부를 크게 보여 줍니다. 배포용 사진은 크기를 조정해 WebP로 저장했으며, 확대 시 화면에서 일부가 잘려 보입니다.';
   if(s.sample==='paramecium'){svg=ellipse(230,145,110,65,'#cbdcd9');for(let i=0;i<30;i++){const a=i*Math.PI/15;svg+=line(230+110*Math.cos(a),145+65*Math.sin(a),230+123*Math.cos(a),145+78*Math.sin(a),'#759793',2);}svg+=ellipse(215,140,17,24,'#90aaa9')+label(detail?'몸 둘레의 짧은 털':'길쭉한 몸',230,270);text='짚신벌레는 유기물이 있는 민물 등에서 볼 수 있습니다. 길쭉한 몸 둘레에 짧은 털이 많고, 이를 움직여 헤엄칩니다. 정지 그림에서는 실제 움직임을 관찰할 수 없습니다.';}
   if(s.sample==='bacteria'){for(let i=0;i<9;i++)svg+=rect(110+(i%3)*85,65+Math.floor(i/3)*65,40,18,'#90bab0');svg+=label('막대 모양 세균의 확대 그림',230,285);text='세균에는 막대 모양이나 둥근 모양 등 여러 모습이 있습니다. 흙과 물, 다른 생물의 몸 등 다양한 곳에 살며, 눈으로 하나하나 구별하기 어렵습니다.';}
   return{svg,media,text,note:'사진과 모형마다 확대 정도가 다릅니다. 곰팡이나 세균은 직접 만지거나 냄새 맡지 마세요.',check:check(...({mushroom:['사진에서 갓 아래 주름은 어떻게 배열되어 있나요?',['자루 둘레에서 갓 가장자리 쪽으로 뻗어 있다','갓 가장자리와 나란한 동심원으로 이어져 있다','자루의 길이 방향으로만 뻗어 있다'],'0','갓 아래 주름은 자루 주변에서 가장자리 쪽으로 뻗어 있습니다. 사진에서 주름 하나를 따라가 보세요.'],mold:['두 곰팡이 사진에서 공통으로 찾을 수 있는 구조는?',['가느다란 실 같은 부분과 둥근 끝 부분','마디 안에서 나선 모양으로 감긴 초록색 띠','자루 주변에서 갓 가장자리로 뻗은 주름'],'0','실 같은 구조와 그 끝의 둥근 구조가 보입니다. 갓의 주름이나 해캄의 초록색 띠와 구별합니다.'],algae:['해캄 사진에서 마디 안의 초록색 부분은 어떤 모습인가요?',['띠가 나선 모양으로 감겨 있다','작은 알갱이들이 서로 떨어져 흩어져 있다','마디의 바깥쪽에 짧은 털처럼 나 있다'],'0','해캄의 초록색 띠 모양 엽록체가 나선 모양으로 감겨 있습니다. 마디 경계와 안쪽의 띠를 구분해 보세요.'],paramecium:['이 짚신벌레 모형에서 짧은 털은 어디에 있나요?',['몸 둘레에 있다','몸 한쪽 끝에만 있다','몸 안쪽에 모여 있다'],'0','짚신벌레는 몸 둘레의 짧은 털을 움직여 헤엄칩니다. 정지 모형은 털의 위치를 보여 줍니다.'],bacteria:['이 모형에 그린 세균의 모양은?',['짧은 막대 모양','둥근 공 모양','긴 나선 모양'],'0','이 모형은 짧은 막대 모양 세균을 보여 줍니다. 실제 세균에는 다른 모양도 있습니다.']}[s.sample]))};}
 });
 add('solubility',{
  title:'용질 종류·용액 진하기 비교',codes:['6과03-01','6과03-02'],initial:{kind:'solute',dose:'small',amount:'more',water:'same'},
  fields:s=>[field('kind','비교 실험',[['solute','소금과 설탕'],['float','진하기와 뜨는 정도']]),...(s.kind==='solute'?[field('dose','같은 무게씩 넣기',[['small','적은 양'],['large','충분히 많은 양']])]:[field('amount','오른쪽 용액의 설탕 양',[['same','왼쪽과 같음'],['more','더 많음']]),field('water','오른쪽 용액의 물의 양',[['same','왼쪽과 같음'],['more','더 많음']])])],
  view(s){if(s.kind==='solute'){const large=s.dose==='large';return{svg:animB_solubility(s,1,0,null),text:large?'같은 온도·같은 양의 물에 같은 무게의 소금과 설탕을 충분히 많이 넣고 충분히 저었습니다. 이 모형에서는 설탕이 더 많이 녹아 소금보다 바닥에 남은 양이 적습니다. 용질 종류에 따라 녹는 양이 달라집니다.':'적은 양을 넣으면 둘 다 모두 녹을 수 있습니다. 이 결과만으로 두 용질이 최대로 녹는 양이 같다고 판단할 수 없습니다.',note:'물의 양과 온도, 넣는 무게, 젓는 조건을 같게 비교합니다. 녹는 빠르기와 최대로 녹는 양은 서로 다릅니다.',check:check("같은 온도의 물에 소금과 설탕을 넣어 녹는 정도를 비교합니다. 용질 종류의 영향만 비교할 조건은?",["물 50 g·용질 10 g씩","물 50 g·용질 10 g과 20 g","물 50 g과 100 g·용질 10 g씩"],"0","소금과 설탕의 종류만 달리하고 물의 양, 용질의 무게, 물의 온도와 젓는 조건을 같게 비교합니다.")};}
   const strength=(s.amount==='more'?2:1)/(s.water==='more'?2:1),higher=strength>1,lower=strength<1;return{svg:animB_solubility(s,1,0,null),text:higher?'물의 양은 같고 녹인 설탕의 양이 더 많으면 더 진합니다. 같은 물체가 더 높이 뜨는 모습을 비교할 수 있습니다.':lower?'녹인 설탕의 양은 같고 물을 더 넣으면 묽어집니다. 같은 물체가 덜 뜨는 모습을 비교할 수 있습니다.':'설탕과 물의 비율이 같으면 진하기가 같습니다. 전체 용액의 양이 많다는 이유만으로 더 진한 것은 아닙니다.',note:'설탕은 모두 녹았으며 두 용액의 온도는 같습니다. ‘더 많음’은 각각 두 배를 뜻합니다.',check:check("같은 설탕물을 두 컵에 나누었습니다. A에는 설탕을 더 넣어 모두 녹이고, B에는 물을 더 넣었습니다. 처음보다 진해진 것은?",["A만","B만","A와 B 모두"],"0","A는 같은 물에 녹아 있는 설탕이 늘어 진해집니다. B는 같은 설탕에 물이 늘어 묽어집니다.")};}
 });
 add('acid-base',{
  title:'산·염기와 물질의 반응',codes:['6과09-02'],initial:{material:'shell',stage:'before'},
  fields:[field('material','같은 크기의 물질',[['shell','달걀 껍데기'],['protein','익힌 흰자']]),stages],
  view(s){return animP_acidBase(s,this.base(s),{jar});},
  base(s){const after=s.stage==='after',shell=s.material==='shell';let svg=jar(65,135,'#cee5ed')+jar(285,135,'#cee5ed')+label('묽은 염산',120,35)+label('묽은 수산화 나트륨',340,35);
   svg+=ellipse(120,205,shell&&after?14:30,12,'#f7eee0')+ellipse(340,205,!shell&&after?14:30,12,'#f7eee0');
   if(after&&shell)for(let i=0;i<8;i++)svg+=circle(100+(i%3)*18,105+Math.floor(i/3)*27,4,'#88b9ce');
   if(after&&!shell)for(let i=0;i<5;i++)svg+=circle(310+i*13,195-(i%2)*20,4,'#faf6eb');
   return{svg,text:after?(shell?'탄산 칼슘이 들어 있는 달걀 껍데기는 산성 용액에서 기포가 생기고 점차 줄어듭니다. 비교한 염기성 용액에서는 같은 시간 동안 뚜렷한 변화가 거의 없습니다.':'단백질이 들어 있는 익힌 흰자는 염기성 용액에서 표면이 변하고 점차 풀어지는 모습을 비교할 수 있습니다. 산성 용액과의 차이를 관찰합니다.'):'같은 크기의 물질과 같은 양의 용액을 준비하고, 처음 모습을 기록합니다. 용액의 종류만 바꾸어 일정 시간이 지난 뒤와 비교합니다.',note:'반응은 용액의 농도와 조건에 따라 달라집니다. 실제 실험에서는 교사의 지도를 받고 보안경·장갑을 착용하세요. 시약을 만지거나 맛보지 마세요.',check:shell?check("묽은 산성 용액·묽은 염기성 용액·물에 달걀 껍데기를 넣어 비교합니다. 탄산 칼슘과 반응해 기포가 계속 생기는 것은?",["산성 용액","염기성 용액","물"],"0","달걀 껍데기의 주성분인 탄산 칼슘이 산성 용액과 반응하면 이산화 탄소 기포가 생깁니다."):check("용액의 성질을 비교할 때 달걀 껍데기와 익힌 흰자를 따로 사용합니다. 익힌 흰자로 알아보려는 성질은?",["단백질에 대한 반응","탄산 칼슘에 대한 반응","금속에 대한 반응"],"0","익힌 흰자는 주로 단백질로 이루어져 있어 단백질에 대한 용액의 작용을 관찰할 수 있습니다. 탄산 칼슘에 대한 반응을 보는 달걀 껍데기 실험과 구별합니다.")};}
 });
 add('state-change',{
  title:'증발·끓음·차가운 컵의 응결',codes:['4과10-02'],initial:{kind:'evaporation',stage:'before'},
  fields:[field('kind','관찰할 변화',[['evaporation','증발'],['boiling','끓음'],['condensation','컵 바깥의 물방울']]),stages],
  view(s){const after=s.stage==='after',boil=s.kind==='boiling',dew=s.kind==='condensation';const svg=animB_state(s,1,0,null);
   return{svg,text:!after?'물의 높이와 컵 안팎의 모습을 먼저 기록합니다. 시간이 지난 뒤와 비교합니다.':dew?'컵 바깥에 물방울이 맺힙니다. 공기 중의 수증기가 차가운 컵 표면에서 물로 변한 응결입니다. 컵 안의 색 물이 새어 나온 것이 아닙니다.':boil?'물속에서도 기포가 생기며 물이 수증기로 변합니다. 물의 양이 줄어듭니다. 끓음과 증발은 모두 물이 수증기로 변하는 현상입니다.':'끓지 않아도 물 표면에서 물이 수증기로 변하여 양이 줄어듭니다. 수증기는 눈에 보이지 않습니다.',note:'흰 김은 작은 물방울이고, 수증기는 눈에 보이지 않습니다. 가열 실험은 교사의 지도 아래 진행하세요.',check:dew?check("새지 않는 유리컵에 파란색 물과 얼음을 넣었더니 컵 바깥에 무색 물방울이 맺혔습니다. 바깥 물방울이 되기 전 물은 어디에 있었을까요?",["주변 공기 중 수증기","컵 안의 파란색 물","컵 속 얼음이 녹은 물"],"0","주변 공기 중 수증기가 차가운 컵 표면에서 액체로 응결했습니다. 컵 속 물이나 얼음이 유리벽을 통과해 나온 것이 아닙니다."):check("젖은 빨래가 마르는 증발과 냄비 속 물이 끓는 현상에 공통으로 일어나는 변화는?",["액체인 물이 기체로 바뀐다","물의 표면과 내부에서 기포가 생긴다","물의 온도가 끓는점까지 올라간다"],"0","증발은 끓는점보다 낮은 온도에서도 일어납니다. 증발과 끓음 모두 액체인 물이 수증기로 바뀌는 기화입니다.")};}
 });
 add('light-shadow',{
  title:'렌즈를 지나는 빛과 물체 보기',codes:['6과02-01','6과02-02'],initial:{kind:'lens',setting:'convex'},
  fields:s=>[field('kind','관찰 실험',[['lens','렌즈의 굴절'],['box','어둠상자 속 물체']]),field('setting','조건',s.kind==='lens'?[['none','렌즈 없음'],['convex','볼록 렌즈'],['concave','오목 렌즈']]:[['dark','빛이 들어오지 않음'],['lit','빛이 들어옴']])],
  view(s){return animP_lens(s,this.base(s));},
  base(s){if(s.kind==='box'){const lit=s.setting==='lit';return{svg:rect(50,55,320,200,'#243743')+(lit?circle(80,90,15,'#f6cf6e')+rect(210,150,45,45,'#eea272')+line(90,95,230,150,'#f5cc69',3)+line(245,160,410,120,'#f5cc69',3):'')+ellipse(420,120,18,10,'#c4ddd8')+label(lit?'물체에서 온 빛이 눈에 들어옴':'물체가 있어도 보이지 않음',230,285),text:lit?'광원에서 나온 빛이 물체에 닿고, 물체에서 반사된 빛이 눈에 들어와 물체를 볼 수 있습니다.':'빛이 물체에 닿지 않으면 물체에서 반사된 빛도 눈에 들어오지 않아 물체가 보이지 않습니다. 눈에서 빛이 나가서 보는 것이 아닙니다.',note:'레이저나 강한 광원을 직접 바라보지 마세요.',check:check("불을 켜자 어둠상자 속 인형이 보였습니다. 인형이 보일 때 눈에 들어오는 빛의 경로는?",["광원 → 인형 → 눈","눈 → 인형 → 광원","인형 → 광원 → 눈"],"0","광원의 빛이 인형에 닿고, 인형에서 반사된 빛이 눈에 들어옵니다. 눈이 인형으로 빛을 보내는 것은 아닙니다.")};}
   let svg='';if(s.setting==='convex')svg+=ellipse(220,150,22,100,'#bdddea');if(s.setting==='concave')svg+='<path d="M195 50 Q225 150 195 250 L245 250 Q215 150 245 50 Z" fill="#bdddea"/>';
   for(const y of [95,150,205]){svg+=line(35,y,220,y,'#d79c22',3);const end=s.setting==='convex'?150:s.setting==='concave'?150+(y-150)*1.8:y;svg+=line(220,y,405,end,'#d79c22',3);}
   return{svg:svg+label('평행하게 들어오는 빛',130,285),text:s.setting==='convex'?'볼록 렌즈를 지난 빛은 가운데 쪽으로 꺾여 모이는 모습을 볼 수 있습니다.':s.setting==='concave'?'오목 렌즈를 지난 빛은 바깥쪽으로 꺾여 퍼지는 모습을 볼 수 있습니다.':'렌즈가 없으면 같은 공기 속에서 빛이 곧게 나아갑니다.',note:'렌즈로 햇빛을 모으거나 광선을 직접 바라보지 마세요.',check:check("공기에서 렌즈 안으로 비스듬히 들어간 빛의 진행 방향이 경계에서 바뀌었습니다. 이 현상은?",["굴절","반사","산란"],"0","빛이 서로 다른 물질의 경계를 통과하며 진행 방향이 바뀌는 것은 굴절입니다. 되돌아오는 반사나 여러 방향으로 퍼지는 산란과 구별합니다.")};}
 });
 add('refraction',{
  title:'여러 거울·렌즈의 상 비교',codes:['9과10-02'],initial:{optic:'plane',distance:'near'},
  fields:[field('optic','거울 또는 렌즈',[['plane','평면거울'],['convexMirror','볼록거울'],['concaveMirror','오목거울'],['convexLens','볼록렌즈'],['concaveLens','오목렌즈']]),field('distance','물체 위치 비교',[['near','아주 가까이'],['middle','조금 떨어뜨림'],['far','충분히 멀리']])],
  view(s){const diagram=(typeof window!=='undefined'?window.scienceOpticsComparison:require('./optics-comparison.js'))(s.optic,s.distance);
   return{svg:animB_optics(s,1),text:diagram.text,note:'오목거울·볼록렌즈에서 가까운 예는 초점 안, 중간 예는 초점과 초점 거리 두 배 사이, 먼 예는 두 배보다 바깥입니다. 중심 가까이를 지나는 빛을 비교합니다.',check:check("물체를 초점보다 가까이 두었을 때, 크고 바로 선 상을 볼 수 있는 조합은?",["오목거울 · 볼록렌즈","볼록거울 · 오목렌즈","평면거울 · 오목렌즈"],"0","오목거울과 볼록렌즈는 물체가 초점 안에 있으면 확대된 정립 허상을 만듭니다. 볼록거울과 오목렌즈는 축소된 상, 평면거울은 같은 크기의 상을 만듭니다.")};}
 });
 add('weight-compare',{
  title:'고체·액체·기체의 모양과 공간',codes:['4과05-02'],initial:{kind:'liquid',container:'narrow',stage:'before'},
  fields:s=>[field('kind','관찰할 물질',[['solid','나무 도막'],['liquid','물'],['gas','컵 속 공기']]),...(s.kind==='gas'?[stages]:[field('container','담는 용기',[['narrow','좁은 용기'],['wide','넓은 용기']])])],
  view(s){if(s.kind==='gas'){const after=s.stage==='after';return{svg:animB_weight(s,1,0,null),text:after?'컵을 기울여 공기를 빼면 그 자리에 물이 들어갑니다. 공기가 차지하던 공간이 있었음을 알 수 있습니다.':'공기가 든 컵을 거꾸로 물속에 똑바로 넣으면 공기가 공간을 차지하여 물이 컵 안을 모두 채우지 못합니다.',note:'실제 실험에는 유리 대신 깨지지 않는 투명 용기를 사용하세요.',check:check("물속에 거꾸로 넣은 컵을 기울이자 거품이 올라오고 컵 안으로 물이 들어왔습니다. 거품과 물의 이동을 연결한 설명은?",["공기가 컵 밖으로 나가고 그 자리를 물이 채웠다","공기가 물에 모두 녹고 그 자리를 물이 채웠다","공기가 컵 안으로 들어와 그만큼 물도 들어왔다"],"0","거품은 컵 안의 공기가 밖으로 빠져나가는 모습입니다. 공기가 차지하던 공간에 물이 들어갑니다.")};}
   const solid=s.kind==='solid';return{svg:animB_weight(s,1,0,null),text:solid?'고체인 나무 도막은 다른 용기에 옮겨도 모양과 부피가 일정합니다.':'액체인 물은 용기에 따라 모양이 달라지지만 흘리거나 증발하지 않으면 부피는 같습니다. 높이가 낮아졌다고 양이 줄어든 것은 아닙니다.',note:'',check:check("물을 흘리지 않고 좁은 컵에서 넓은 컵으로 모두 옮겼습니다. 물의 높이가 낮아졌을 때 모양과 부피의 변화는?",["모양은 다르고 부피는 같다","모양은 같고 부피는 다르다","모양과 부피가 모두 다르다"],"0","물은 담긴 용기에 따라 모양이 달라집니다. 높이가 낮아져도 흘리거나 증발한 물이 없다면 부피는 같습니다.")};}
 });
 add('volcano-model',{
  title:'현무암과 화강암 관찰·분류',codes:['4과11-03'],initial:{rock:'compare',detail:'whole'},
  fields:[field('rock','관찰할 암석',[['compare','나란히 비교'],['basalt','현무암'],['granite','화강암']]),field('detail','관찰 초점',[['whole','전체 모습'],['grain','표면 확대']])],
  view(s){
   const samples={
    basalt:{name:'현무암',src:'assets/rocks/basalt.webp',alt:'어두운 갈색과 검은색을 띠는 현무암 표본. 잘린 면에서 작은 알갱이의 경계를 구별하기 어렵다.',author:'Nessa Eull',source:'https://commons.wikimedia.org/wiki/File:Basalt_(GeoDIL_number_-_455).jpg',caption:'작은 알갱이의 경계가 뚜렷하게 보이나요?'},
    granite:{name:'화강암',src:'assets/rocks/granite.webp',alt:'밝은 회색 화강암 표본에 흰색·회색·검은색 광물 알갱이가 맞물려 있는 모습.',author:'Dexter Perkins',source:'https://commons.wikimedia.org/wiki/File:Biotite_granite_(GeoDIL_number_-_18).jpg',caption:'서로 다른 색의 알갱이가 어디에서 맞닿나요?'}
   };
   return{media:{items:s.rock==='compare'?[samples.basalt,samples.granite]:[samples[s.rock]],enlarged:s.detail==='grain'},
    text:s.rock==='basalt'?'이 현무암은 전체적으로 어둡고, 알갱이가 작아 각각의 경계를 구별하기 어렵습니다. 표면을 확대해 화강암의 알갱이와 비교해 보세요. 현무암에는 구멍이 있는 표본도, 거의 없는 표본도 있습니다.':s.rock==='granite'?'이 화강암에는 흰색·회색·검은색 알갱이가 섞여 있습니다. 알갱이들이 서로 맞물린 경계를 눈으로 찾아보세요. 화강암은 현무암보다 보통 알갱이가 큽니다.':'먼저 전체 색을 비교하고, 표면을 확대해 알갱이의 경계를 찾아보세요. 이 현무암은 알갱이를 구별하기 어렵고, 화강암은 여러 색의 알갱이가 서로 맞물려 있습니다. 색과 알갱이의 크기를 함께 살펴보면 두 암석을 구분하는 데 도움이 됩니다.',
    note:'',
    check:check('사진 속 두 표본을 비교한 관찰 기록으로 알맞은 것은?',[
     '화강암에서 여러 색의 알갱이 경계가 더 뚜렷하게 보인다.',
     '현무암에서 서로 맞물린 큰 알갱이가 더 뚜렷하게 보인다.',
     '두 표본 모두 전체가 한 가지 색으로 고르게 보인다.'
    ],'0','사진의 화강암에서는 밝고 어두운 알갱이가 맞물린 경계를 확인할 수 있습니다. 현무암은 알갱이가 더 작아 각각 구별하기 어렵습니다.')};
  }
 });
 add('lever-balance',{
  title:'물체를 밀고 당길 때',codes:['4과01-01'],initial:{direction:'push',stage:'before'},fields:[field('direction','가하는 힘',[['push','밀기'],['pull','당기기']]),stages],
  view(s){return animP_push(s,this.base(s));},
  base(s){const after=s.stage==='after',push=s.direction==='push',x=after?(push?300:90):195;return{svg:line(40,235,420,235,'#657a83',5)+rect(x,160,70,70,'#cba57f')+label(after?(push?'→':'←'):'힘을 가하기 전',230,115,'#246874',35)+label('같은 바닥 위의 상자',230,285),text:after?'물체를 밀거나 당기면 움직이기 시작하거나 움직이는 방향이 달라질 수 있습니다. 힘의 방향을 바꾸어 결과를 비교합니다.':'멈춰 있는 상자의 위치를 기록합니다. 밀거나 당길 방향을 정한 뒤 변화를 관찰합니다.',note:'',check:check("멈춘 상자를 오른쪽으로 밀었더니 오른쪽으로 움직였습니다. 다시 멈춘 같은 상자를 왼쪽으로 당겨 움직였다면, 두 실험의 이동 방향은?",["밀기: 오른쪽 · 당기기: 왼쪽","밀기: 왼쪽 · 당기기: 오른쪽","밀기: 오른쪽 · 당기기: 오른쪽"],"0","이 비교에서는 미는 힘과 당기는 힘을 서로 반대 방향으로 가했습니다. 처음 멈춘 상자가 움직이기 시작하는 방향도 달라집니다.")};}
 });
 add('seasons',{
  title:'하루의 천체 위치·낮밤·계절 별자리',codes:['6과12-01','6과12-02','6과12-03'],initial:{kind:'daily',time:'morning',season:'spring',side:'day'},
  fields:s=>[field('kind','관찰할 주제',[['daily','하루 동안 위치'],['daynight','낮과 밤 모형'],['annual','계절별 밤하늘']]),s.kind==='daily'?field('time','관찰 시각',[['morning','아침'],['noon','한낮'],['evening','저녁'],['star1','별 관찰 첫 시각'],['star2','별 관찰 몇 시간 뒤']]):s.kind==='annual'?field('season','계절',[['spring','봄'],['summer','여름'],['autumn','가을'],['winter','겨울']]):field('side','관찰 지점',[['day','태양을 향한 쪽'],['night','태양의 반대쪽']])],
  view(s){if(s.kind==='daynight'){const day=s.side==='day';return{svg:animB_seasons(s,1,0,null),text:day?'태양빛을 받는 쪽은 낮입니다. 지구가 자전하면서 한 지점이 빛을 받는 쪽과 받지 않는 쪽을 번갈아 지나갑니다.':'태양빛을 받지 않는 쪽은 밤입니다. 태양이 지구 주위를 하루에 한 바퀴 도는 것이 아니라 지구의 자전으로 낮과 밤이 생깁니다.',note:'',check:check("같은 장소에서 낮과 밤이 하루를 주기로 반복되는 주된 까닭은?",["지구의 자전","지구의 공전","달의 공전"],"0","지구가 자전하여 한 장소가 태양빛을 받는 쪽과 받지 않는 쪽을 번갈아 지나갑니다.")};}
   if(s.kind==='annual'){const names={spring:'사자자리',summer:'백조자리',autumn:'페가수스자리',winter:'오리온자리'},points={spring:[[120,180],[175,150],[230,175],[285,110],[320,150],[280,185]],summer:[[230,55],[230,120],[230,185],[230,240],[145,145],[315,145]],autumn:[[155,85],[295,85],[295,220],[155,220]],winter:[[155,65],[295,65],[155,240],[295,240],[200,150],[225,145],[250,140]]},p=points[s.season];return{svg:animB_seasons(s,1,0,null),text:'우리나라에서 '+{spring:'봄',summer:'여름',autumn:'가을',winter:'겨울'}[s.season]+' 저녁에 관찰하기 좋은 대표 별자리의 예는 '+names[s.season]+'입니다. 같은 장소·비슷한 저녁 시각에 비교하면 계절에 따라 보이는 별자리가 달라집니다. 지구가 공전하여 밤에 바라보는 우주 방향이 달라지기 때문입니다.',note:'계절별 별자리는 그 계절에 관찰하기 좋은 별자리입니다. 다른 계절에는 전혀 보이지 않는다는 뜻은 아닙니다.',check:check("같은 장소에서 같은 저녁 시각에 관찰했는데 계절에 따라 보이는 별자리가 달랐습니다. 이 차이와 직접 관련된 운동은?",["지구의 공전","지구의 자전","달의 공전"],"0","지구가 태양 주위를 공전하면서 계절마다 밤에 바라보는 우주의 방향이 달라집니다. 하루 동안 별이 움직여 보이는 현상은 자전과 관련됩니다.")};}
   const positions={morning:[90,190],noon:[230,60],evening:[370,190],star1:[170,110],star2:[280,120]},p=positions[s.time],star=s.time.startsWith('star');return{svg:animB_seasons(s,1,0,null),text:star?'남쪽 하늘의 같은 별을 몇 시간 간격으로 비교하면 대체로 동쪽에서 서쪽으로 이동해 보입니다. 북극성 주변 별들은 북극성을 중심으로 도는 모습으로 관찰합니다.':'태양은 아침에 동쪽, 한낮에는 남쪽 높은 하늘, 저녁에는 서쪽에서 보입니다. 같은 장소에서 하루 동안 위치의 규칙성을 기록합니다.',note:'우리나라에서 남쪽을 바라본 태양의 경로입니다. 태양을 맨눈이나 렌즈로 직접 보지 마세요.',check:check("우리나라에서 아침부터 저녁까지 태양의 위치를 관찰했습니다. 대체적인 이동 경로는?",["동쪽 → 남쪽 하늘 → 서쪽","서쪽 → 남쪽 하늘 → 동쪽","동쪽 → 북쪽 하늘 → 서쪽"],"0","우리나라에서 태양은 대체로 동쪽에서 떠서 한낮에 남쪽 하늘을 지나 서쪽으로 집니다.")};}
 });
 add('diffusion',{
  title:'입자·상태 변화·기체 조건 비교',codes:['9과04-02','9과04-03','9과04-04','9과06-01','9과06-02','9과06-03'],initial:{kind:'phase',phase:'solid',gas:'pressure',setting:'normal',step:'0'},
  fields:s=>[field('kind','실험',[['phase','상태 변화와 입자'],['curve','순수한 물의 가열'],['gas','기체의 압력·온도와 부피']]),...(s.kind==='phase'?[field('phase','상태',[['solid','고체'],['liquid','액체'],['gas','기체']])]:s.kind==='curve'?[field('step','같은 세기로 가열한 순서',[['0','얼음 가열'],['1','녹는 동안'],['2','물 가열'],['3','끓는 동안']])]:[field('gas','바꾸는 변인',[['pressure','온도 일정: 바깥 압력'],['temperature','압력 일정: 온도']]),field('setting','조건',[['low','낮음'],['normal','중간'],['high','높음']])])],
  view(s){return animP_particles(s,this.base(s));},
  base(s){if(s.kind==='phase'){const gas=s.phase==='gas',solid=s.phase==='solid';let svg=rect(65,40,330,215,'#edf4f7');for(let i=0;i<20;i++){const x=gas?85+((i*67+i*i*17)%285):125+(i%5)*40+(solid?0:(i%2)*8),y=gas?60+((i*41+i*i*7)%170):solid?95+Math.floor(i/5)*37:130+Math.floor(i/5)*27;svg+=circle(x,y,7,'#508f9c');if(gas)svg+=line(x+9,y,x+17,y,'#c48b47',2);}return{svg:svg+label('입자 수·종류·크기는 같음',230,287),text:solid?'고체의 입자는 서로 가까이 규칙적으로 배열되어 제자리에서 진동합니다. 고체의 입자가 멈춰 있는 것은 아닙니다.':gas?'기체의 입자는 서로 멀리 떨어져 자유롭게 운동합니다. 상태가 바뀌어도 입자 자체의 크기가 커지거나 새로운 입자로 바뀌는 것은 아닙니다.':'액체의 입자는 가까이 있지만 불규칙하게 배열되어 서로 자리를 바꾸며 운동합니다. 상태가 변해도 밖으로 새지 않았다면 질량은 보존됩니다.',note:'물은 얼 때 부피가 늘어납니다. 모든 물질이 고체가 될 때 부피가 줄어드는 것은 아닙니다.',check:check('상태 변화에서 변하지 않는 것은?',['입자 자체의 종류와 크기','입자 사이 거리와 배열','전체 물질의 모양'],'0','입자 자체가 커지는 것이 아니라 배열·거리·운동 상태가 달라집니다.')};}
   if(s.kind==='curve'){const pts=[[70,240],[140,190],[220,190],[300,80],[385,80]],i=+s.step;let svg=line(55,260,415,260)+line(55,260,55,35);for(let j=0;j<4;j++)svg+=line(...pts[j],...pts[j+1],j===i?'#dc8a30':'#80a8b3',5);svg+=label('가열 시간 →',250,292)+label('0 ℃',28,195,'#173f50',12)+label('100 ℃',28,85,'#173f50',12);return{svg,text:['얼음의 온도가 올라갑니다.','얼음과 물이 함께 있는 동안 공급한 열은 녹는 데 쓰여 온도가 일정하게 유지됩니다.','모두 녹은 물의 온도가 올라갑니다.','물이 끓는 동안 공급한 열은 기화에 쓰여 온도가 일정하게 유지됩니다.'][i],note:'1기압에서 순수한 물을 가열한 경우입니다. 그래프의 구간 길이는 실제 걸린 시간의 비율이 아닙니다.',check:check("압력이 일정할 때 순수한 물이 끓기 시작했습니다. 같은 세기로 계속 가열하는 동안 온도와 액체인 물의 양은?",["온도 일정 · 액체 양 감소","온도 상승 · 액체 양 감소","온도 일정 · 액체 양 유지"],"0","끓는 동안 공급된 열은 액체가 기체로 바뀌는 데 쓰입니다. 압력이 일정하면 온도는 일정하게 유지되고 액체인 물의 양은 줄어듭니다.")};}
   const thermal=s.gas==='temperature',order={low:0,normal:1,high:2}[s.setting],height=thermal?[90,130,170][order]:[170,130,90][order],top=235-height;let svg=rect(145,45,170,195,'#edf4f7')+rect(150,top,160,8,'#607c88');for(let i=0;i<15;i++){const x=165+((i*43+i*i*11)%130),y=top+24+((i*29+i*i*7)%(height-35));svg+=circle(x,y,4,'#4d91a0')+line(x+6,y,x+(thermal?8+order*5:13),y,'#c48b47',2);}return{svg:svg+label(thermal?'압력 일정 · 온도 '+{low:'낮음',normal:'중간',high:'높음'}[s.setting]:'온도 일정 · 바깥 압력 '+{low:'낮음',normal:'중간',high:'높음'}[s.setting],230,285),text:thermal?'같은 양의 기체를 압력이 일정하게 유지되도록 하면 온도가 높을수록 입자 운동이 활발해지고 부피가 커집니다. 온도가 낮으면 부피가 작아집니다.':'같은 양의 기체에서 온도가 일정할 때 바깥 압력을 높이면 부피가 작아집니다. 입자 사이의 거리가 줄어들지만 입자 자체가 작아지지는 않습니다.',note:'기체가 새지 않아 입자 수는 같습니다. 피스톤과의 마찰은 무시합니다.',check:thermal?check("기체의 온도만 바꾸면서 부피가 어떻게 달라지는지 비교합니다. 일정하게 유지할 두 조건은?",["기체의 양 · 압력","기체의 양 · 온도","기체의 온도 · 압력"],"0","온도는 바꾸어 보는 조건입니다. 기체의 양과 압력을 일정하게 해야 온도 변화에 따른 부피 변화를 비교할 수 있습니다."):check("기체가 새지 않는 주사기의 온도를 일정하게 유지하며 부피를 줄였습니다. 입자 모형에서 달라지는 것은?",["입자 사이의 평균 거리","입자 하나의 크기","주사기 속 전체 입자 수"],"0","같은 수의 입자가 더 작은 부피에 있으므로 평균 거리가 줄어듭니다. 입자 자체의 크기가 줄거나 일부 입자가 사라지는 것은 아닙니다.")};}
 });
 add('weather-front',{
  title:'공기의 팽창과 구름 생성',codes:['9과17-03'],initial:{moisture:'moist',stage:'before'},
  fields:[field('moisture','공기의 수증기 조건',[['moist','수증기가 충분함'],['dry','매우 건조함']]),field('stage','부피 변화',[['before','팽창 전'],['after','빠르게 팽창시킨 뒤'],['compress','다시 압축한 뒤']])],
  view(s){const expanded=s.stage==='after',cloud=expanded&&s.moisture==='moist';return{svg:animB_air(s,1,0,null),text:expanded?(cloud?'빠르게 팽창한 공기의 온도가 내려가고 상대습도가 높아집니다. 충분히 냉각되어 이슬점에 도달하면 수증기가 작은 물방울로 응결하여 구름처럼 뿌옇게 보입니다.':'팽창하면 온도가 내려가지만, 이 모형처럼 수증기가 매우 적어 이슬점까지 냉각되지 않으면 눈에 보이는 구름이 생기지 않습니다.'):s.stage==='compress'?'다시 압축하면 공기의 온도가 올라가고 작은 물방울이 증발하여 뿌연 모습이 사라질 수 있습니다.':'수증기가 포함된 공기의 처음 부피·온도와 맑은 정도를 기록합니다. 수증기 자체는 눈에 보이지 않습니다.',note:'외부와 열을 거의 주고받지 않는 빠른 팽창을 비교합니다. 압력 용기를 직접 가압하지 마세요.',check:check("수증기를 포함한 공기가 상승하여 이슬점에 도달했습니다. 구름이 생기는 과정의 순서는?",["팽창 → 온도 하강 → 응결","압축 → 온도 하강 → 응결","팽창 → 온도 상승 → 응결"],"0","올라간 공기는 주변 기압이 낮아져 팽창하며 냉각됩니다. 이슬점에 도달하면 수증기가 응결하여 작은 물방울이 생깁니다.")};}
 });
 add('motion-energy',{
  title:'자유 낙하의 시간·속력·에너지',codes:['9과19-01','9과19-02','9과19-03','9과19-04'],initial:{mass:'1',time:'0'},
  fields:[field('mass','물체 질량',[['1','1 kg'],['2','2 kg']]),field('time','놓은 뒤 시간',[['0','0 s'],['1','1 s'],['2','2 s'],['3','3 s']])],
  view(s){const t=+s.time,m=+s.mass,speed=9.8*t,kin=.5*m*speed*speed,total=m*9.8*50,pot=total-kin;const svg=animB_fall(s,1,0,null);return{svg,text:`속력은 ${speed.toFixed(1)} m/s입니다. 같은 1초마다 9.8 m/s씩 증가합니다. 위치 에너지 ${pot.toFixed(1)} J, 운동 에너지 ${kin.toFixed(1)} J, 합 ${total.toFixed(1)} J입니다. 질량이 달라도 같은 시간의 속력은 같지만 에너지의 크기는 질량에 따라 달라집니다.`,note:'공기 저항을 무시하고 50 m 높이에서 놓은 경우입니다. 중력 가속도는 9.8 m/s²입니다.',check:check("공기 저항이 없는 곳에서 100 g과 200 g 물체를 같은 높이에서 동시에 가만히 놓았습니다. 바닥에 닿기 전 같은 시각의 속력비는?",["100 g : 200 g = 1 : 1","100 g : 200 g = 1 : 2","100 g : 200 g = 2 : 1"],"0","같은 중력장에서 자유 낙하의 가속도는 질량과 무관합니다. 두 물체가 모두 정지에서 출발하면 같은 시간 뒤 속력도 같습니다.")};}
 });
 add('ohms-law',{
  title:'정전기와 코일의 자기장',codes:['9과14-01','9과14-04'],initial:{kind:'coil',current:'forward',strength:'weak',pole:'N',stage:'before'},
  fields:s=>[field('kind','관찰 실험',[['coil','코일과 자석'],['static','정전기 유도'],['rub','마찰 전기']]),...(s.kind==='coil'?[field('current','전류 방향',[['off','전류 없음'],['forward','방향 1'],['reverse','방향 반대']]),field('strength','전류 세기',[['weak','약함'],['strong','강함']]),field('pole','마주 보는 자석의 극',[['N','N극'],['S','S극']])]:[stages])],
  view(s){if(s.kind==='rub'){const after=s.stage==='after';return{svg:animB_ohms(s,1,0,null),text:after?'이 모형에서는 마찰할 때 천에서 막대로 전자가 이동했습니다. 막대는 음전하, 천은 양전하를 띠며 두 물체를 합한 전체 전하량은 보존됩니다.':'처음에는 두 물체 모두 양전하와 음전하의 양이 같아 전체적으로 중성입니다. 마찰 전후 전자 분포를 비교합니다.',note:'이때 이동하는 것은 전자입니다. 양성자가 이동하거나 전하가 새로 생기는 것은 아닙니다.',check:check('마찰 전기가 생길 때 주로 이동하는 것은?',['전자','양성자','원자핵 전체'],'0','물체 사이에 전자가 이동하여 한쪽은 음전하, 다른 쪽은 양전하를 띱니다.')};}if(s.kind==='static'){const after=s.stage==='after';return{svg:animB_ohms(s,1,0,null),text:after?'음전하를 띤 막대를 접촉하지 않고 가까이하면 금속 도체의 전자가 밀려나 먼 쪽으로 이동합니다. 가까운 쪽은 양전하, 먼 쪽은 음전하를 띤 부분이 생깁니다. 도체 전체의 전하량은 변하지 않습니다.':'금속 도체 전체는 전기적으로 중성입니다. 외부의 대전체를 가까이하기 전후의 전하 분포를 비교합니다.',note:'도체 속 전자의 분포가 달라집니다. 양전하가 도체 안에서 이동하는 것은 아닙니다.',check:check("음전하를 띤 막대를 중성 금속구에 가까이 댔습니다. 접촉하거나 접지하지 않았을 때 금속구의 가까운 쪽과 먼 쪽은?",["가까운 쪽 양전하 · 먼 쪽 음전하","가까운 쪽 음전하 · 먼 쪽 양전하","가까운 쪽 음전하 · 먼 쪽 음전하"],"0","막대의 음전하가 금속구의 전자를 밀어내어 먼 쪽으로 재배치합니다. 가까운 쪽은 전자가 부족해 양전하를 띠며 금속구 전체 전하량은 그대로입니다.")};}
   const on=s.current!=='off',north=s.current==='forward',repel=(north?'N':'S')===s.pole;const svg=animB_ohms(s,1,0,null);return{svg,text:on?`전류의 방향을 바꾸면 코일의 자기장 방향과 양 끝의 극이 바뀝니다. 마주 보는 극이 ${repel?'같아 서로 밀어냅니다':'달라 서로 끌어당깁니다'}. 전류가 강할수록 코일의 자기장이 강해집니다.`:'전류가 흐르지 않는 공심 코일에는 전류에 의한 자기장이 생기지 않습니다. 전류를 흘린 조건과 비교합니다.',note:'전동기는 자기장 속에서 전류가 흐르는 코일이 힘을 받아 회전하는 원리를 이용합니다.',check:check("전류가 흐르는 코일의 왼쪽 끝은 N극, 오른쪽 끝은 S극입니다. 전류의 세기는 그대로 두고 방향만 반대로 바꾸면?",["왼쪽 S극 · 오른쪽 N극","왼쪽 N극 · 오른쪽 S극","양쪽 끝 모두 극이 없음"],"0","전류 방향을 반대로 바꾸면 코일의 자기장 방향도 반대가 되어 N극과 S극이 서로 바뀝니다. 전류를 끈 것과는 다릅니다.")};}
 });
 add('burning-conditions',{
  title:'물질의 성질이 달라지는 변화 비교',codes:['6과14-01'],initial:{kind:'paper',stage:'before'},fields:[field('kind','변화의 예',[['paper','종이 자르기'],['burn','종이 태운 결과'],['ice','얼음 녹이기']]),stages],
  view(s){return animP_burning(s,this.base(s));},
  base(s){const after=s.stage==='after',burn=s.kind==='burn',ice=s.kind==='ice';return{svg:rect(90,60,280,195,'#eef4f7')+(ice?(after?ellipse(230,220,90,15,'#90c6e3'):rect(190,130,80,80,'#b6dbed')):after&&burn?ellipse(230,220,75,15,'#626566'):after?rect(160,120,50,70,'#f0dbaf')+rect(250,150,50,70,'#f0dbaf'):rect(170,105,120,100,'#f0dbaf'))+label(after?'변화 뒤':'변화 전',230,285),text:!after?'처음 물질의 모양과 성질을 관찰합니다. 변화한 뒤에도 같은 물질인지 비교합니다.':burn?'종이를 태우면 재와 기체 등 성질이 다른 물질이 생깁니다. 단순히 모양만 작아진 변화와 구별합니다.':ice?'얼음이 녹아 물이 되어도 물이라는 물질 자체는 달라지지 않습니다. 상태가 달라진 변화입니다.':'종이를 잘라도 종이라는 물질의 성질은 그대로이고 크기와 모양이 달라집니다.',note:'실제 연소 실험에서는 교사의 지도를 받고 안전 장비를 사용하세요.',check:check('새로운 물질이 생기는 변화의 예는?',['종이가 타서 재와 기체가 생김','종이를 가위로 자름','얼음이 녹음'],'0','모양이나 상태만 달라지는 변화와 물질의 성질 자체가 달라지는 변화를 구분합니다.')};}
 });

 add('cell-structure',{
  title:'동물·식물 세포의 공통점과 차이',codes:['9과02-01'],initial:{sample:'onion',zoom:'low',stain:'before',focus:'whole'},
  fields:[field('sample','준비된 표본',[['onion','양파 비늘줄기 표피'],['cheek','입안 상피']]),field('zoom','관찰 배율',[['low','낮음'],['high','높음']]),field('stain','염색',[['before','염색 전'],['after','염색 후']]),field('focus','모형 구조 표시',[['whole','표시 없음'],['nucleus','핵'],['membrane','세포막'],['wall','세포벽']])],
  view(s){const plant=s.sample==='onion',high=s.zoom==='high',stained=s.stain==='after';let svg='<defs><clipPath id="coreCellView"><circle cx="230" cy="145" r="120"/></clipPath></defs>'+circle(230,145,123,'#b8ced7')+'<g clip-path="url(#coreCellView)">'+circle(230,145,120,'#f8fbfc');
   const positions=high?[[230,145]]:[[165,100],[240,95],[310,115],[170,180],[250,175],[315,185]],scale=high?1.8:.72;
   for(const [x,y]of positions){svg+='<g transform="translate('+x+' '+y+') scale('+scale+')">';if(plant)svg+=rect(-45,-32,90,64,s.focus==='wall'?'#75a77b':'#b6cab3')+rect(-41,-28,82,56,s.focus==='membrane'?'#d58f45':'#d2ded6')+rect(-38,-25,76,50,'#f2f0d8');else svg+=ellipse(0,0,43,31,s.focus==='membrane'?'#d58f45':'#c1d5d9')+ellipse(0,0,39,27,'#edf5f7');svg+=ellipse(plant?-24:0,plant?8:0,8,11,stained||s.focus==='nucleus'?'#7c729e':'#dddbe4')+'</g>';}
   svg+='</g>'+label(high?'높은 배율: 좁은 범위':'낮은 배율: 넓은 범위',230,287);
   const focus=s.focus==='wall'?(plant?'세포벽이 바깥쪽에서 형태를 지지합니다.':'동물 세포에는 세포벽이 없습니다.'):s.focus==='membrane'?'세포막은 세포 안팎을 구분하고 물질 출입에 관여합니다.':s.focus==='nucleus'?'핵에는 유전 정보가 있으며 세포의 생명 활동에 관여합니다.':'전체 모양과 배열을 비교합니다.';
   return{svg,text:(plant?'양파 표피 세포는 비교적 규칙적인 경계가 이어져 보입니다.':'입안 상피 세포는 납작하고 불규칙한 외곽을 볼 수 있습니다.')+' '+focus+(stained?' 염색하면 핵 등 구조가 더 뚜렷해집니다.':' 염색 전에는 핵 등의 구별이 어려울 수 있습니다.'),note:'식물 세포의 세포막은 세포벽에 붙어 있어 광학현미경으로 따로 구별하기 어렵습니다. 표본 채취와 염색은 교사의 지도를 받으세요.',check:check('동물 세포에는 없고 식물 세포에는 있는 구조는?',['세포벽','핵','세포막'],'0','여기서 비교하는 동물·식물 세포 모두 핵과 세포막이 있지만 세포벽은 식물 세포에 있습니다.')};}
 });
 add('energy-conversion',{
  title:'자석과 코일의 상대 운동과 발전',codes:['10통과2-02-05'],initial:{moving:'magnet',direction:'in',pole:'N',speed:'slow'},
  fields:[field('moving','움직이는 물체',[['magnet','자석'],['coil','코일'],['none','둘 다 멈춤']]),field('direction','상대 거리 변화',[['in','가까워짐'],['out','멀어짐']]),field('pole','코일을 향한 극',[['N','N극'],['S','S극']]),field('speed','움직임',[['slow','느리게'],['fast','빠르게']])],
  view(s){return animP_induction(s,this.base(s));},
  base(s){const moving=s.moving!=='none',positive=(s.direction==='in')===(s.pole==='N'),deflect=moving?(positive?1:-1)*(s.speed==='fast'?40:20):0;let svg=rect(50,95,80,65,s.pole==='N'?'#cc7673':'#6d92c1')+label(s.pole,90,135,'#fff',24);svg+='<path data-induction-wire d="M169 125 V270 H300 V235 M287 125 H405 V270 H380 V235" fill="none" stroke="#64818d" stroke-width="3"/>';for(let i=0;i<7;i++)svg+=ellipse(180+i*16,125,11,42,'none').replace('/>',' stroke="#b6874d" stroke-width="4"/>');svg+=circle(340,205,50,'#e7f1f5')+line(340,233,340+deflect,175,'#447e8a',4)+label('검류계',340,300)+label(moving?(s.direction==='in'?'서로 가까워짐':'서로 멀어짐'):'상대 운동 없음',230,40);return{svg,text:moving?'자석과 코일 중 어느 쪽을 움직여도 서로 가까워지거나 멀어지면 코일에 유도 전류가 흐릅니다. 상대 운동 방향 또는 자석의 극을 반대로 하면 검류계 바늘이 반대로 움직입니다. 같은 조건에서 더 빠르게 움직이면 더 크게 흔들립니다.':'자석이 코일 가까이에 있어도 둘 다 멈추어 코일을 지나는 자기장이 변하지 않으면 유도 전류가 흐르지 않습니다.',note:'같은 코일·자석·회로로 비교합니다. 검류계의 단자를 바꾸면 바늘이 움직이는 방향도 반대가 됩니다.',check:check("자석을 코일 안으로 밀어 넣다가 멈추었습니다. 자석과 코일을 모두 고정한 뒤 검류계 바늘의 최종 상태는?",["0으로 돌아온다","다가갈 때 방향을 유지한다","다가갈 때와 반대로 기운다"],"0","자석이 멈추어 코일을 지나는 자기장이 더 이상 변하지 않으면 유도 전류도 지속되지 않습니다. 반대로 기우는 것은 자석을 반대 방향으로 움직일 때와 구별해야 합니다.")};}
 });
 add('mass-ratio',{
  title:'기체 반응의 부피 관계 자료 해석',codes:['9과16-05'],initial:{trial:'one',stage:'before'},fields:[field('trial','같은 온도·압력의 반응 자료',[['one','수소 2 · 산소 1'],['double','수소 4 · 산소 2'],['excess','수소 3 · 산소 1']]),stages],
  view(s){return animP_gasVolume(s,this.base(s));},
  base(s){const after=s.stage==='after',scale=s.trial==='double'?2:1,excess=s.trial==='excess';const amounts=after?[excess?1:0,0,2*scale]:[excess?3:2*scale,scale,0];let svg='';['수소','산소','수증기'].forEach((name,i)=>{const x=70+i*150;svg+=rect(x,245-amounts[i]*40,65,amounts[i]*40,'#8cbccf')+label(name,x+32,280)+label(String(amounts[i]),x+32,230-amounts[i]*40);});return{svg,text:after?'같은 온도와 압력에서 반응에 참여한 수소 : 산소 : 생성된 수증기의 부피비는 2 : 1 : 2입니다.'+(excess?' 수소를 더 넣어도 산소가 부족하여 수소 1이 남습니다. 처음 넣은 전체 양과 실제 반응한 양을 구별합니다.':' 전체 양을 두 배로 해도 반응 부피비는 같습니다.'):'모두 같은 온도·압력에서 비교한 기체 부피 자료입니다. 숫자는 같은 단위의 상대적인 부피이며 물질별 부피를 비교합니다.',note:'물이 수증기로 존재하는 조건입니다. 질량이 보존되어도 기체의 전체 부피는 달라질 수 있습니다. 수소와 산소를 섞어 직접 점화하지 마세요.',check:check('같은 조건에서 완전히 반응한 수소·산소·생성 수증기의 부피비는?',['2 : 1 : 2','1 : 1 : 1','2 : 2 : 1'],'0','같은 온도·압력에서 반응에 참여한 기체와 생성된 기체 부피 사이에 간단한 정수비가 성립합니다.')};}
 });

 add('pea-genetics',{
  title:'세포분열과 염색체 관찰',codes:['9과21-01','9과21-02'],initial:{kind:'mitosis',step:'start'},
  fields:[field('kind','분열 종류',[['mitosis','체세포분열'],['meiosis','생식세포 형성']]),field('step','관찰 순서',[['start','염색체 복제 뒤'],['middle','염색체 나뉨'],['end','분열 결과']])],
  view(s){const mei=s.kind==='meiosis',end=s.step==='end',middle=s.step==='middle',cells=end?(mei?4:2):middle?2:1;let svg='';const centers=cells===4?[[130,90],[330,90],[130,220],[330,220]]:cells===2?[[125,150],[335,150]]:[[230,150]];for(const[x,y]of centers){svg+=ellipse(x,y,cells===1?145:85,cells===4?60:80,'#e1eff2');const n=(end||middle)&&mei?2:4;for(let i=0;i<n;i++){const xx=x-(n-1)*15+i*30,color=(middle&&mei?(x<230):end&&mei?(x<230):i%2===0)?'#b56f67':'#608abc',replicated=!end&&(!middle||mei);svg+=line(xx-6,y-15,xx+6,y+15,color,4);if(replicated)svg+=line(xx+6,y-15,xx-6,y+15,color,4);}}return{svg:svg+label(end?(mei?'염색체 수가 절반인 세포 4개':'염색체 수가 같은 세포 2개'):middle?(mei?'상동 염색체가 먼저 나뉨':'복제된 염색 분체가 나뉨'):'복제되어 두 가닥인 염색체',230,298),text:end?(mei?'생식세포 형성 과정에서는 두 번의 분열을 거쳐 염색체 수가 절반인 세포가 만들어집니다. 수정으로 두 생식세포가 합쳐지면 염색체 수가 회복됩니다.':'체세포분열로 만들어진 두 세포는 원래 세포와 염색체 수가 같습니다. 세포의 수가 늘어 개체가 자라거나 손상된 부분을 회복합니다.'):middle?(mei?'첫 분열에서 상동 염색체가 서로 나뉩니다. 그 뒤 복제된 염색 분체가 나뉘어 최종 세포가 만들어집니다.':'복제된 염색 분체가 양쪽으로 나뉘어 같은 염색체 구성이 전달됩니다.'):'염색체는 분열 전에 복제됩니다. 모형은 염색체 4개인 세포를 가정하고 염색체 행동을 비교합니다.',note:'염색체의 색은 어느 쪽에서 왔는지 구별하는 표시입니다.',check:check("사람의 체세포에는 염색체가 46개 있습니다. 정상적인 체세포분열 후 딸세포 하나와 감수분열로 형성된 생식세포 하나의 염색체 수는?",["딸세포 46개 · 생식세포 23개","딸세포 46개 · 생식세포 46개","딸세포 92개 · 생식세포 23개"],"0","체세포분열에서는 딸세포의 염색체 수가 유지되고, 감수분열을 거친 생식세포에서는 절반이 됩니다. DNA 복제와 세포 하나의 염색체 수를 구별합니다.")};}
 });
 add('cell-membrane',{
  title:'효소 유무·가열에 따른 작용 비교',codes:['10통과1-03-05'],initial:{sample:'fresh',stage:'before'},
  fields:[field('sample','과산화 수소에 넣을 시료',[['water','같은 양의 물'],['fresh','생감자'],['heated','충분히 가열한 감자']]),stages],
  view(s){return animP_enzyme(s,this.base(s),{jar});},
  base(s){const after=s.stage==='after',active=after&&s.sample==='fresh';let svg=jar(175,130,'#c4e0ec');if(s.sample!=='water')svg+=ellipse(230,205,30,15,'#dcc699');if(active)for(let i=0;i<12;i++)svg+=circle(195+(i%4)*23,115+Math.floor(i/4)*28,5,'#fff');return{svg:svg+label(active?'산소 기포가 많이 나타남':after?'기포가 적거나 거의 없음':'처음 모습',230,280),text:!after?'과산화 수소의 양·농도·온도와 시료의 양을 같게 하여 비교합니다. 가열한 감자는 식혀서 처음 온도를 맞춘 조건입니다.':active?'생감자 속 효소가 과산화 수소의 분해를 촉진하여 산소 기포가 많이 나타납니다. 효소는 생명 시스템의 화학 반응을 촉진합니다.':s.sample==='heated'?'충분히 가열하면 효소의 구조가 변하여 작용이 약해질 수 있습니다. 식혀 같은 온도에서 비교해도 생감자보다 기포가 적거나 거의 없습니다.':'같은 양의 물을 넣은 대조군과 비교하여 감자 속 효소가 반응을 촉진하는지 알아봅니다.',note:'과산화 수소를 피부에 바르거나 마시지 마세요. 실제 실험은 보안경을 착용하고 교사의 지도 아래 진행하세요.',check:check("감자를 미리 가열한 처리가 효소 작용에 미치는 영향을 비교합니다. 생감자 실험과 같게 맞출 조건의 짝은?",["반응 시작 온도 · 감자의 양","반응 시작 온도 · 미리 가열한 여부","감자의 양 · 미리 가열한 여부"],"0","미리 가열한 처리 여부가 비교할 조건입니다. 반응을 시작할 때는 두 시료의 온도, 감자의 양, 과산화 수소수의 농도와 양 등을 같게 맞춥니다.")};}
 });
 add('flame-ions',{
  title:'같은 족 원소의 성질 비교',codes:['9과11-03'],initial:{group:'alkali',stage:'before'},fields:[field('group','준비된 관찰 자료',[['alkali','1족: 나트륨·칼륨'],['noble','18족: 헬륨·네온']]),stages],
  view(s){return animP_group(s,this.base(s),{jar});},
  base(s){const alkali=s.group==='alkali',after=s.stage==='after';let svg=(alkali?jar(65,130,'#c0ddeb')+jar(285,130,'#c0ddeb'):rect(65,60,110,180,'#f2f7f9')+rect(285,60,110,180,'#f2f7f9')+label('기체 · 무색',120,265)+label('기체 · 무색',340,265))+label(alkali?'나트륨':'헬륨',120,35)+label(alkali?'칼륨':'네온',340,35);if(!alkali){for(const x of [65,285]){svg+=rect(x,55,110,7,'#7a939d');for(let i=0;i<9;i++)svg+=circle(x+15+(i*37+i*i*13)%80,80+(i*53+i*i*11)%135,3,'#91adb9');}svg+=label('점은 눈에 보이지 않는 입자 모형',230,295,'#526d79',12);}if(alkali){svg+=rect(105,105,25,12,'#b5bbc0')+rect(325,105,25,12,'#b5bbc0');if(after)for(let i=0;i<8;i++){svg+=circle(94+(i%3)*22,120+Math.floor(i/3)*20,4,'#fff')+circle(310+(i%3)*22,120+Math.floor(i/3)*20,5,'#fff');}}return{svg,text:alkali?(after?'준비된 시범 관찰 자료에서 나트륨과 칼륨은 모두 물과 반응합니다. 반응 정도는 같지 않아도 같은 족 원소에서 비슷한 성질을 찾을 수 있습니다.':'같은 족에 속한 나트륨과 칼륨의 물과의 반응 자료를 비교합니다.'):'헬륨과 네온은 18족 원소이며 일상적인 조건에서 다른 물질과 잘 반응하지 않는 비슷한 성질이 있습니다. 모든 원소가 물과 반응하는 것은 아닙니다.',note:'알칼리 금속과 물의 반응은 교사의 시범 자료로 관찰하세요. 직접 따라 하지 마세요.',check:check("리튬·나트륨·칼륨이 모두 물과 반응해 수소를 만들었지만 반응의 세기는 달랐습니다. 비슷한 화학적 성질을 뒷받침하는 관찰은?",["물과 반응하여 수소가 생김","물과 반응하는 세기가 다름","반응하는 데 걸린 시간이 다름"],"0","세 원소가 물과 반응하여 같은 종류의 기체를 만드는 것은 공통된 화학적 성질입니다. 같은 족이어도 반응의 세기와 속도가 모두 같지는 않습니다.")};}
 });
 add('neutralization-common',{
  title:'산·염기를 섞을 때 온도 비교',codes:['10통과2-01-04','10통과2-01-05'],initial:{acid:'50',stage:'before'},fields:[field('acid','전체 100 mL에서 산의 부피',[['20','산 20 + 염기 80'],['40','산 40 + 염기 60'],['50','산 50 + 염기 50'],['60','산 60 + 염기 40'],['80','산 80 + 염기 20']]),stages],
  view(s){const acid=+s.acid,base=100-acid,after=s.stage==='after',temp=a=>20+Math.min(a,100-a)*.01*13.7,t=after?temp(acid):20;let svg=jar(25,105,'#b1d9e7')+label(t.toFixed(1)+' ℃',80,270)+line(190,240,430,240)+line(190,240,190,55);const values=[20,40,50,60,80],point=a=>[190+(a-20)*3.8,230-(temp(a)-20)*22];for(let i=0;i<values.length;i++){const p=point(values[i]);if(i)svg+=line(...point(values[i-1]),...p,'#5394a2',3);svg+=circle(p[0],after&&values[i]===acid?p[1]:p[1],after&&values[i]===acid?7:3,after&&values[i]===acid?'#d18b37':'#5394a2');}for(const a of values)svg+=label(String(a),point(a)[0],258,'#173f50',11);for(const value of [20,24,28])svg+=label(String(value),176,234-(value-20)*22,'#173f50',11);svg+=label('산 부피 (mL) →',315,289)+label('혼합 뒤 온도 (℃)',310,35);return{svg,text:after?'산 '+acid+' mL와 염기 '+base+' mL를 섞은 가상 결과는 '+t.toFixed(1)+' ℃입니다. 중화 반응에서 열을 방출하여 온도가 올라갑니다. 같은 농도·같은 전체 부피에서는 반응하는 양이 가장 많은 50 + 50 조건의 온도 상승이 가장 큽니다.':'두 용액의 처음 온도는 모두 20.0 ℃입니다. 산과 염기를 섞은 뒤의 온도를 비교합니다. 오른쪽 그래프는 다섯 조건의 혼합 뒤 결과를 비교한 모형 자료입니다.',note:'처음 온도와 전체 부피를 같게 비교하며 열 손실은 무시합니다. 농도가 다르면 같은 부피를 섞어도 완전히 중화되지 않을 수 있습니다. 실제 실험에서는 교사의 지도를 받고 보안경·장갑을 착용하세요.',check:check("같은 농도·처음 온도의 두 용액을 섞습니다. A는 염산 10 mL와 수산화 나트륨 수용액 30 mL입니다. 전체 부피를 같게 두고 혼합비만 바꿀 B의 조합은?",["염산 20 mL · 수산화 나트륨 20 mL","염산 20 mL · 수산화 나트륨 30 mL","염산 10 mL · 수산화 나트륨 10 mL"],"0","A의 전체 부피는 40 mL입니다. B도 40 mL로 맞추면서 두 용액의 비율을 바꾸어야 혼합비에 따른 온도 변화를 비교할 수 있습니다.")};}
 });

 add('density-buoyancy',{
  title:'순수한 물질의 녹는점·끓는점 비교',codes:['9과08-01'],initial:{kind:'melt',sample:'A',amount:'one',step:'before'},
  fields:[field('kind','가열 관찰',[['melt','녹는점 비교'],['boil','끓는점 비교']]),field('sample','가상 순수 물질',[['A','물질 A'],['B','물질 B']]),field('amount','같은 물질의 양',[['one','기준 양'],['two','두 배의 양']]),field('step','관찰 구간',[['before','상태 변화 전'],['during','상태 변화 중'],['after','상태 변화 후']])],
  view(s){return animP_meltBoil(s,this.base(s));},
  base(s){const melt=s.kind==='melt',point=melt?(s.sample==='A'?20:40):(s.sample==='A'?80:100),stage={before:0,during:1,after:2}[s.step],temperature=point+[-20,0,20][stage];let svg=line(60,255,410,255)+line(60,255,60,35);const points=[[70,230],[170,155],[290,155],[395,60]];for(let i=0;i<3;i++)svg+=line(...points[i],...points[i+1],i===stage?'#d18b37':'#83abb5',5);svg+=label(point+' ℃',110,140)+label('가열 순서 →',280,290)+label('현재 '+temperature+' ℃',295,35);return{svg,text:s.step==='during'?'상태가 변하는 동안 온도가 '+point+' ℃로 일정한 구간이 나타납니다. 이 값은 모형 물질 '+s.sample+'의 '+(melt?'녹는점':'끓는점')+'입니다. 같은 압력에서 같은 순수 물질은 양이 달라도 이 온도가 같습니다.':s.step==='before'?'같은 압력에서 가상 순수 물질을 가열합니다. 물질 종류와 양을 바꿔 온도가 일정한 구간을 비교합니다.':'상태 변화가 끝나고 계속 가열하면 온도가 다시 올라갑니다. 물질 A와 B는 서로 다른 녹는점·끓는점을 가진 모형으로, 이런 특성을 물질 구별에 이용할 수 있습니다.',note:'물질의 양이 늘면 가열에 필요한 열량과 시간이 달라집니다. 가열 순서가 같다고 걸린 시간도 같은 것은 아닙니다.',check:check("같은 압력에서 같은 순수한 고체의 양만 늘려 같은 세기로 가열합니다. 녹는 온도와 완전히 녹는 데 걸리는 시간의 비교로 알맞은 것은?",["녹는 온도 같음 · 시간 길어짐","녹는 온도 높아짐 · 시간 같음","녹는 온도 높아짐 · 시간 길어짐"],"0","녹는점은 같은 조건에서 물질의 양에 따라 달라지지 않습니다. 같은 가열 조건에서 더 많은 양을 모두 녹이려면 더 많은 열이 필요하므로 시간이 더 걸립니다.")};}
 });
 return result;
}
/* ---- animB_: 움직이는 그림 — motion-energy, ohms-law, refraction, seasons, solubility,
   state-change, weather-front, weight-compare. view()는 마지막 장면(k=1)을 그리고,
   화면에서는 조건을 바꿀 때 앞 조건에서 새 조건까지 requestAnimationFrame으로 이어 그린다.
   그리는 동안 관찰 글은 흐리게 가렸다가 장면이 끝나면 보인다. ---- */
function animB_f(v){return (+v).toFixed(1);}
function animB_c(v,a,b){a=a===undefined?0:a;b=b===undefined?1:b;return Math.max(a,Math.min(b,v));}
function animB_seg(k,a,b){return animB_c((k-a)/(b-a));}
function animB_ease(u){u=animB_c(u);return u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;}
function animB_lerp(a,b,t){return a+(b-a)*t;}
function animB_t(s,x,y,o){
 o=o||{};
 return `<text x="${animB_f(x)}" y="${animB_f(y)}" fill="${o.c||'#24414d'}" font-size="${o.size||14}" text-anchor="${o.a||'middle'}"${o.w?` font-weight="${o.w}"`:''}${o.op!==undefined?` opacity="${(+o.op).toFixed(2)}"`:''}${o.halo?' stroke="#fff" stroke-width="4" paint-order="stroke" stroke-linejoin="round"':''}>${s}</text>`;
}
function animB_beaker(x,top,w,bottom,level,color){
 const f=animB_f;
 let back=`<ellipse cx="${x+w/2}" cy="${bottom+3}" rx="${w/2+8}" ry="5" fill="#254754" fill-opacity=".08"/>`;
 if(level!=null&&level<bottom-3)back+=`<path d="M${x+2} ${f(level)} H${x+w-2} V${bottom-8} Q${x+w-2} ${bottom-2} ${x+w-8} ${bottom-2} H${x+8} Q${x+2} ${bottom-2} ${x+2} ${bottom-8} Z" fill="${color}" fill-opacity=".82"/><path d="M${x+3} ${f(level)} H${x+w-3}" stroke="#fff" stroke-opacity=".75" stroke-width="1.8"/>`;
 let front=`<path d="M${x-6} ${top} Q${x} ${top} ${x} ${top+7} V${bottom-8} Q${x} ${bottom} ${x+8} ${bottom} H${x+w-8} Q${x+w} ${bottom} ${x+w} ${bottom-8} V${top+7} Q${x+w} ${top} ${x+w+6} ${top}" fill="#e7f2f6" fill-opacity=".22" stroke="#6f8f9d" stroke-width="2.2" stroke-linejoin="round"/>`;
 for(let i=1;i<=5;i++){const y=bottom-i*(bottom-top-16)/6;front+=`<path d="M${x+w-3} ${f(y)} h-${i%2?8:14}" stroke="#7d97a4" stroke-width="1.2" opacity=".75"/>`;}
 front+=`<path d="M${x+9} ${top+14} V${bottom-14}" stroke="#fff" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"/>`;
 return{back,front};
}
function animB_def(slug,def){(animB_def.map||(animB_def.map={}))[slug]=def;}

/* ---------- 자유 낙하 ---------- */
function animB_fallFrom(s,prev){return prev&&prev.mass===s.mass&&+prev.time<+s.time?+prev.time:null;}
function animB_fall(s,k,ph,prev){
 const f=animB_f,T=+s.time,m=+s.mass,from=animB_fallFrom(s,prev),t=from===null?T:animB_lerp(from,T,k);
 const H=50,top=52,ground=272,sc=(ground-top)/H,yOf=h=>ground-h*sc,r=m===2?11:8.5,v=9.8*t;
 let o=`<rect x="64" y="${ground}" width="86" height="9" rx="2" fill="#cdbb9f" stroke="#a48f6e"/>`;
 o+=`<path d="M62 ${top} V${ground}" stroke="#7d97a4" stroke-width="2"/>`;
 for(let h=0;h<=50;h+=10){const y=yOf(h);o+=`<path d="M56 ${f(y)} H62" stroke="#7d97a4" stroke-width="2"/>`+animB_t(h+' m',52,y+5,{a:'end',size:13.5,c:'#476270'});}
 // 공을 붙잡고 있던 전자석
 const holdTop=top-2*r;
 o+=`<rect x="76" y="${f(holdTop-12)}" width="28" height="12" rx="2" fill="#7f8f99"/><path d="M90 ${f(holdTop-12)} V22 H124" fill="none" stroke="#9aa9b1" stroke-width="2"/>`;
 // 1초마다 남긴 공 자국
 for(let i=0;i<=3&&i<=t+1e-6;i++){if(Math.abs(i-t)<.06)continue;const yy=yOf(H-4.9*i*i)-r;o+=`<circle cx="90" cy="${f(yy)}" r="${r}" fill="#dc6b38" fill-opacity=".18" stroke="#dc6b38" stroke-opacity=".45" stroke-dasharray="3 2"/>`+animB_t(i+' s',112,yy+5,{size:13.5,c:'#8a5a3c',a:'start'});}
 const by=yOf(H-4.9*t*t)-r;
 o+=`<circle cx="90" cy="${f(by)}" r="${r}" fill="#dc6b38" stroke="#a9481d" stroke-width="1.2"/><circle cx="${f(90-r*.35)}" cy="${f(by-r*.35)}" r="${f(r*.32)}" fill="#f6c4a4"/>`;
 if(v>.5){const L=Math.min(v*1.5,ground-by-r-12);o+=`<path d="M90 ${f(by+r+2)} V${f(by+r+2+L)}" stroke="#c0392b" stroke-width="3"/><path d="M84 ${f(by+r+L-4)} L90 ${f(by+r+4+L)} L96 ${f(by+r+L-4)}" fill="none" stroke="#c0392b" stroke-width="3" stroke-linejoin="round"/>`;}
 // 속력-시간 그래프
 const gx=160,gy=250,px=44,py=5.8,gp=(tt)=>[gx+px*tt,gy-py*9.8*tt];
 o+=`<path d="M${gx} 66 V${gy} H302" fill="none" stroke="#475569" stroke-width="1.6"/>`;
 for(const vv of [10,20,30]){const y=gy-py*vv;o+=`<path d="M${gx} ${f(y)} H300" stroke="#e2e8f0"/>`+animB_t(String(vv),gx-6,y+5,{a:'end',size:13.5,c:'#475569'});}
 for(let i=0;i<=3;i++)o+=`<path d="M${gx+px*i} ${gy} v4" stroke="#475569"/>`+animB_t(String(i),gx+px*i,gy+20,{size:13.5,c:'#475569'});
 o+=animB_t('속력 (m/s)',gx-4,56,{a:'start',size:13.5,c:'#1e293b',w:700})+animB_t('시간 (s)',302,292,{a:'end',size:13.5,c:'#1e293b',w:700});
 const e=gp(t);if(t>0)o+=`<path d="M${gx} ${gy} L${f(e[0])} ${f(e[1])}" stroke="#2f7f8f" stroke-width="3" stroke-linecap="round"/>`;
 for(let i=1;i<=3&&i<=t+1e-6;i++){const p=gp(i);o+=`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="3.5" fill="#2f7f8f"/>`;}
 o+=`<circle cx="${f(e[0])}" cy="${f(e[1])}" r="5.5" fill="#dc6b38" stroke="#fff" stroke-width="2"/>`;
 o+=animB_t(`${t.toFixed(1)} s · ${v.toFixed(1)} m/s`,232,30,{size:15,w:700,c:'#1f4f5c'});
 // 에너지 막대
 const total=m*9.8*H,ep=m*9.8*(H-4.9*t*t),ek=.5*m*v*v,bs=180/980,base=250;
 o+=animB_t('에너지 (J)',388,30,{size:14,w:700,c:'#1e293b'});
 o+=`<path d="M332 ${base} H442" stroke="#475569" stroke-width="1.6"/>`;
 const bar=(x,val,col,name)=>{const h=val*bs;return `<rect x="${x}" y="${f(base-h)}" width="40" height="${f(h)}" fill="${col}" rx="2"/>`+animB_t(String(Math.round(val)),x+20,base-h-6,{size:13.5,c:'#1e293b',w:700})+animB_t(name,x+20,base+20,{size:14,c:'#334155'});};
 o+=bar(338,ep,'#5b8fd1','위치')+bar(394,ek,'#e08a3c','운동');
 o+=`<path d="M332 ${f(base-total*bs)} H440" stroke="#64748b" stroke-width="1.4" stroke-dasharray="5 4"/>`+animB_t('합',444,base-total*bs+5,{a:'start',size:13.5,c:'#475569'});
 o+=animB_t(m+' kg',30,30,{a:'start',size:14,c:'#8a5a3c',w:700});
 return o;
}
animB_def('motion-energy',{draw:animB_fall,dur:(s,p)=>{const a=animB_fallFrom(s,p);return a===null?0:(+s.time-a)*950;}});

/* ---------- 코일·정전기 ---------- */
function animB_coilDisp(s){if(s.current==='off')return 0;const north=s.current==='forward',repel=(north?'N':'S')===s.pole;return(repel?1:-1)*(s.strength==='strong'?30:16);}
function animB_coil(s,k,ph,prev){
 const f=animB_f,on=s.current!=='off',north=s.current==='forward',repel=(north?'N':'S')===s.pole;
 const pOn=prev&&prev.kind==='coil'&&prev.current!=='off',same=pOn&&prev.current===s.current;
 let field;if(on)field=same?1:animB_seg(k,.05,.35);else field=pOn?1-animB_seg(k,0,.25):0;
 const fieldDir=on?north:(pOn?prev.current==='forward':true),strong=on?s.strength==='strong':(pOn&&prev.strength==='strong');
 const target=animB_coilDisp(s),from=prev&&prev.kind==='coil'?animB_coilDisp(prev):target;
 let disp=target;if(k<1&&from!==target){const u=animB_seg(k,on?.25:.1,1);disp=target+(from-target)*Math.exp(-4.5*u)*Math.cos(8*u)*(1-animB_seg(u,.9,1));}
 let o=`<rect x="20" y="262" width="420" height="8" rx="2" fill="#cdbb9f" stroke="#a48f6e"/>`;
 // 전선과 전원
 o+=`<path data-coil-wire d="M102 124 H76 V240 H162 M218 240 H286 V124 H262" fill="none" stroke="#64818d" stroke-width="3" stroke-linejoin="round"/>`;
 if(on){const dir=north?1:-1,off=k<1?(-ph*40*dir)%32:0;o+=`<path d="M162 240 H76 V124 H102" fill="none" stroke="#f2b84b" stroke-width="3" stroke-dasharray="6 10" stroke-dashoffset="${f(off)}"/><path d="M262 124 H286 V240 H218" fill="none" stroke="#f2b84b" stroke-width="3" stroke-dasharray="6 10" stroke-dashoffset="${f(off)}"/>`;
  const ay=182,ad=north?-1:1;o+=`<path d="M70 ${ay-6*ad} L76 ${ay} L82 ${ay-6*ad}" fill="none" stroke="#c2410c" stroke-width="2.6"/><path d="M280 ${ay+6*ad} L286 ${ay} L292 ${ay+6*ad}" fill="none" stroke="#c2410c" stroke-width="2.6"/>`;}
 o+=`<rect x="160" y="222" width="60" height="38" rx="5" fill="#e9eef3" stroke="#7d97a4" stroke-width="1.6"/>`+animB_t('전원',190,246,{size:14,c:'#334155',w:700});
 o+=animB_t(on?(north?'+':'−'):'+',150,236,{size:18,c:'#b23b3b',w:700})+animB_t(on?(north?'−':'+'):'−',230,236,{size:18,c:'#2c5c9a',w:700});
 o+=animB_t(on?(s.strength==='strong'?'강한 전류':'약한 전류'):'꺼짐',190,290,{size:14,c:'#276975',w:700});
 // 코일 뒤쪽 가닥, 관, 앞쪽 가닥
 let backS='',frontS='';for(let i=0;i<9;i++){const x=104+i*17;backS+=`<path d="M${x+8.5} 176 L${x+17} 124" stroke="#c99a5b" stroke-opacity=".55" stroke-width="3"/>`;frontS+=`<path d="M${x} 124 L${x+8.5} 176" stroke="#b7742f" stroke-width="4" stroke-linecap="round"/>`;}
 o+=backS+`<rect x="98" y="128" width="168" height="44" rx="6" fill="#eaf3f6" fill-opacity=".55" stroke="#a9bfc8"/>`;
 // 자기장
 if(field>.01){const op=(field*.9).toFixed(2),d=fieldDir?1:-1,w=strong?2.4:1.6;
  const arrow=(x,y,dx)=>`<path d="M${x-5*dx} ${y-4} L${x} ${y} L${x-5*dx} ${y+4}" fill="none" stroke="#2f6f9f" stroke-width="${w}"/>`;
  let fl='';for(const y of strong?[138,150,162]:[144,156])fl+=`<path d="M108 ${y} H256" stroke="#2f6f9f" stroke-width="${w}"/>`+arrow(182+12*d,y,d);
  const loops=strong?[[50,74],[20,40]]:[[50,74]];
  for(const [cy,cy2] of loops){fl+=`<path d="M262 140 C${290+ (74-cy2)} ${cy}, ${70-(74-cy2)} ${cy}, 100 140" fill="none" stroke="#2f6f9f" stroke-width="${w}"/>`+arrow(182-12*d,35+.75*cy,-d);}
  o+=`<g opacity="${op}">${fl}</g>`;
  const nR=fieldDir?'N':'S',nL=fieldDir?'S':'N';
  o+=`<g opacity="${op}"><circle cx="276" cy="104" r="12" fill="${nR==='N'?'#dc7774':'#6d99cf'}"/>${animB_t(nR,276,109,{size:15,c:'#fff',w:700})}<circle cx="88" cy="104" r="12" fill="${nL==='N'?'#dc7774':'#6d99cf'}"/>${animB_t(nL,88,109,{size:15,c:'#fff',w:700})}</g>`;
 }else o+=animB_t('자기장 없음',182,100,{size:14,c:'#64748b'});
 o+=frontS;
 // 실에 매단 막대자석
 const L=96,mx=335+disp,lift=L-Math.sqrt(L*L-disp*disp),my=140-lift;
 o+=`<path d="M432 262 V36 H330" fill="none" stroke="#8c9aa3" stroke-width="5" stroke-linecap="round"/><rect x="414" y="256" width="36" height="8" rx="2" fill="#8c9aa3"/>`;
 o+=`<path d="M346 40 L${f(mx+11)} ${f(my)} M394 40 L${f(mx+59)} ${f(my)}" stroke="#5f6b72" stroke-width="1.3"/>`;
 const near=s.pole,far=near==='N'?'S':'N',col=p=>p==='N'?'#dc7774':'#6d99cf';
 o+=`<rect x="${f(mx)}" y="${f(my)}" width="35" height="22" fill="${col(near)}"/><rect x="${f(mx+35)}" y="${f(my)}" width="35" height="22" fill="${col(far)}"/><rect x="${f(mx)}" y="${f(my)}" width="70" height="22" fill="none" stroke="#5f6b72" stroke-width="1.2"/>`;
 o+=animB_t(near,mx+17.5,my+16.5,{size:15,c:'#fff',w:700})+animB_t(far,mx+52.5,my+16.5,{size:15,c:'#fff',w:700});
 const show=on?animB_seg(k,.75,.95):0;
 if(on&&show>0){const ax=370,ay=200,d=repel?1:-1;o+=`<g opacity="${show.toFixed(2)}"><path d="M${ax-22*d} ${ay} H${ax+22*d}" stroke="#276975" stroke-width="3"/><path d="M${ax+14*d} ${ay-6} L${ax+22*d} ${ay} L${ax+14*d} ${ay+6}" fill="none" stroke="#276975" stroke-width="3"/></g>`+animB_t(repel?'밀어냄':'끌어당김',ax,ay+24,{size:14,c:'#276975',w:700,op:show});}
 return o;
}
function animB_induce(s,k,ph,prev){
 const f=animB_f,after=s.stage==='after',pa=prev&&prev.kind==='static'?prev.stage==='after':after,u=animB_ease(pa===after?1:k),a=pa+(after-pa)*u;
 const rodX=20+75*a;
 const lab=(t,x,y,c)=>`<text x="${x}" y="${y}" fill="${c}" font-size="24" font-weight="700" text-anchor="middle">${t}</text>`;
 let o=`<rect x="20" y="268" width="420" height="8" rx="2" fill="#cdbb9f" stroke="#a48f6e"/>`;
 o+=`<rect x="272" y="214" width="16" height="50" rx="3" fill="#d9c9a3" stroke="#a89770"/><rect x="246" y="260" width="68" height="8" rx="2" fill="#b8a77f"/>`;
 o+=`<defs><radialGradient id="animBMetal" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#f4f8fa"/><stop offset=".6" stop-color="#c9d7de"/><stop offset="1" stop-color="#93a9b4"/></radialGradient></defs>`;
 o+=`<ellipse cx="280" cy="150" rx="95" ry="70" fill="url(#animBMetal)" stroke="#7f97a3" stroke-width="2"/>`;
 // 대전된 막대(옆에서 들고 다가감)
 o+=`<rect x="${f(rodX-150)}" y="138" width="200" height="24" rx="12" fill="#b98fcf" stroke="#8a62a1" stroke-width="1.5"/><rect x="${f(rodX-150)}" y="141" width="200" height="6" rx="3" fill="#fff" fill-opacity=".3"/>`;
 for(let i=0;i<4;i++){const x=rodX+36-i*30;if(x>14)o+=lab('−',f(x),158,'#4b2a66');}
 o+=animB_t('음전하 막대',85,124,{size:14,c:'#5b3777',w:700});
 const ions=[[225,125],[225,175],[310,125],[310,175]];
 for(let i=0;i<4;i++){o+='<g data-charge="ion">'+lab('+',ions[i][0],ions[i][1],'#c64b49')+'</g>';
  const x0=ions[i][0]+16,y0=ions[i][1]+10,x1=335,y1=108+i*28;
  o+='<g data-charge="electron">'+lab('−',f(animB_lerp(x0,x1,a)),f(animB_lerp(y0,y1,a)),'#437ec1')+'</g>';}
 o+=animB_t('고정된 양이온 · 움직이는 전자',280,66,{size:14,c:'#526d79'});
 o+=animB_t(after?'음전하 막대를 가까이 둠':'중성 금속 도체',230,296,{size:15,c:'#173f50',op:pa===after?1:animB_seg(k,.8,1)});
 return o;
}
function animB_rub(s,k,ph,prev){
 const f=animB_f,after=s.stage==='after',play=after&&prev&&prev.kind==='rub'&&prev.stage!=='after'&&k<1;
 let dx=0,move=0;
 if(play){if(k<.15)dx=150*animB_ease(k/.15);else if(k<.6)dx=150+22*Math.sin((k-.15)/.45*Math.PI*6);else dx=150*(1-animB_ease((k-.6)/.2));move=animB_seg(k,.22,.55);}
 else if(after)move=1;
 const lab=(t,x,y,c)=>`<text x="${f(x)}" y="${f(y)}" fill="${c}" font-size="24" font-weight="700" text-anchor="middle">${t}</text>`;
 let o='';
 // 천
 o+=`<path d="M262 92 Q300 84 340 92 T418 92 L422 200 Q380 208 342 200 T258 200 Z" fill="#dfe3c7" stroke="#a9ad86" stroke-width="1.5"/>`;
 for(let i=0;i<9;i++)o+=`<path d="M${266+i*18} 202 v8" stroke="#b9bd96" stroke-width="2"/>`;
 for(let i=0;i<4;i++)o+=lab('+',285+i*32,128,'#ba5752');
 const clothE=[0,1,2,3].map(i=>[285+i*32,168]);
 // 막대
 const rx=40+dx;
 o+=`<rect x="${f(rx)}" y="100" width="190" height="62" rx="16" fill="#c4a3d8" fill-opacity=".95" stroke="#8a62a1" stroke-width="1.5"/><rect x="${f(rx+8)}" y="105" width="174" height="8" rx="4" fill="#fff" fill-opacity=".35"/>`;
 for(let i=0;i<4;i++)o+=lab('+',rx+18+i*28,128,'#ba5752');
 for(let i=0;i<4;i++)o+=lab('−',rx+18+i*28,154,'#426eac');
 for(let i=2;i<4;i++){const c=clothE[i],r=[rx+18+(i+2)*28,154];if(move<=0)o+=lab('−',c[0],c[1],'#426eac');else o+=lab('−',animB_lerp(c[0],r[0],animB_ease(move)),animB_lerp(c[1],r[1],animB_ease(move))-Math.sin(move*Math.PI)*24,'#426eac');}
 for(let i=0;i<2;i++)o+=lab('−',clothE[i][0],clothE[i][1],'#426eac');
 o+=animB_t('플라스틱 막대',135,190,{size:14,c:'#334155',w:700})+animB_t('천',340,232,{size:14,c:'#334155',w:700});
 const res=after?(play?animB_seg(k,.82,1):1):1;
 o+=animB_t(after?'음전하':'중성',135,258,{size:15,c:after?'#2c5c9a':'#475569',w:700,op:res})+animB_t(after?'양전하':'중성',340,258,{size:15,c:after?'#b23b3b':'#475569',w:700,op:res});
 return o;
}
function animB_ohms(s,k,ph,prev){return s.kind==='rub'?animB_rub(s,k,ph,prev):s.kind==='static'?animB_induce(s,k,ph,prev):animB_coil(s,k,ph,prev);}
animB_def('ohms-law',{draw:animB_ohms,dur:(s,p)=>{if(p.kind!==s.kind)return 0;if(s.kind==='rub')return s.stage==='after'&&p.stage!=='after'?2800:0;if(s.kind==='static')return p.stage!==s.stage?1500:0;return animB_coilDisp(s)!==animB_coilDisp(p)||s.current!==p.current||s.strength!==p.strength?1900:0;}});

/* ---------- 거울·렌즈 ---------- */
function animB_optics(s,k){
 const d=(typeof window!=='undefined'&&window.scienceOpticsComparison?window.scienceOpticsComparison:require('./optics-comparison.js'))(s.optic,s.distance);
 let svg=d.svg.replace(/font-size="12"/g,'font-size="13.5"');
 if(k>=1)return svg;
 const f=animB_f;
 svg=svg.replace(/<line data-ray="(light|extension)" x1="([-\d.e]+)" y1="([-\d.e]+)" x2="([-\d.e]+)" y2="([-\d.e]+)"([^>]*)\/>(<path data-ray-direction="light"[^>]*\/>)?/g,(all,kind,x1,y1,x2,y2,rest,arrow)=>{
  x1=+x1;y1=+y1;x2=+x2;y2=+y2;
  const incoming=kind==='light'&&Math.abs(x1-230)>.01,span=kind==='extension'?[.62,.8]:incoming?[0,.34]:[.32,.64],p=animB_seg(k,span[0],span[1]);
  if(p<=0)return '';
  const ex=x1+(x2-x1)*p,ey=y1+(y2-y1)*p;
  let out=`<line data-ray="${kind}" x1="${x1}" y1="${y1}" x2="${f(ex)}" y2="${f(ey)}"${rest}/>`;
  if(arrow&&p>.5)out+=arrow;
  if(kind==='light'&&p<1)out+=`<circle cx="${f(ex)}" cy="${f(ey)}" r="5" fill="#fff3b0" stroke="#e0a526" stroke-width="1.5"/>`;
  return out;
 });
 const op=animB_seg(k,.78,1).toFixed(2);
 svg=svg.replace('<g data-optics-part="image"',`<g data-optics-part="image" opacity="${op}"`).replace(/(<text [^>]*)>상<\/text>/,`$1 opacity="${op}">상</text>`);
 return svg;
}
animB_def('refraction',{draw:animB_optics,dur:(s,p)=>p.optic!==s.optic||p.distance!==s.distance?2000:0});

/* ---------- 하루·낮밤·계절 ---------- */
const animB_skyAngle={morning:.42,noon:Math.PI/2,evening:Math.PI-.42,star1:1.05,star2:2.05};
function animB_mix(c1,c2,t){const a=[1,3,5].map(i=>parseInt(c1.substr(i,2),16)),b=[1,3,5].map(i=>parseInt(c2.substr(i,2),16));return '#'+a.map((v,i)=>Math.round(v+(b[i]-v)*animB_c(t)).toString(16).padStart(2,'0')).join('');}
function animB_daily(s,k,prev){
 const f=animB_f,star=s.time.startsWith('star'),th1=animB_skyAngle[s.time];
 let th=th1;if(prev&&prev.kind==='daily'&&prev.time.startsWith('star')===star&&animB_skyAngle[prev.time]<th1)th=animB_lerp(animB_skyAngle[prev.time],th1,animB_ease(k));
 const cx=230,cy=236,rx=168,ry=172,pos=(a,r=1)=>[cx-rx*r*Math.cos(a),cy-ry*r*Math.sin(a)];
 const h=Math.sin(th),sky=star?'#1f3350':animB_mix('#f6d9b8','#cde8f6',h/.75);
 let o=`<rect x="20" y="24" width="420" height="214" rx="10" fill="${sky}"/>`;
 o+=`<path d="M${cx-rx} ${cy} A${rx} ${ry} 0 0 1 ${cx+rx} ${cy}" fill="none" stroke="${star?'#8ea6c4':'#e7a94b'}" stroke-width="2" stroke-dasharray="6 6" opacity=".8"/>`;
 if(star){const stars=[[0,1,5.5],[-.16,.9,3.4],[.13,.95,3.8],[.07,.8,3],[-.6,.7,2.6],[.55,.75,2.8],[-.9,.5,2.4],[.9,.55,2.4],[.35,.45,2.2]],d=th-1.05;
  for(const [da,rr,sz] of stars){const p=pos(1.05+da+d,rr);if(p[1]>cy-4)continue;o+=`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${sz}" fill="${sz>5?'#fff1bb':'#e9eefc'}"${sz>5?' stroke="#ffd36b" stroke-width="2"':''}/>`;}
  const p=pos(th);o+=animB_t('관찰한 별',p[0],p[1]-14,{size:14,c:'#fff1bb',w:700});}
 else{const p=pos(th);o+=`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="32" fill="#fff6d2" opacity=".7"/><circle cx="${f(p[0])}" cy="${f(p[1])}" r="20" fill="#f6b93b" stroke="#e58e1a" stroke-width="2"/>`;}
 // 땅과 나무·집
 const g=star?'#2e4a3a':'#8fbf72';
 o+=`<path d="M20 ${cy} H440 V256 Q440 262 434 262 H26 Q20 262 20 256 Z" fill="${g}"/>`;
 o+=`<path d="M70 ${cy} v-14 M62 ${cy-12} a10 12 0 1 1 16 0 z" stroke="${star?'#3d2f24':'#7a5232'}" stroke-width="3" fill="${star?'#24402f':'#4f8a3c'}"/>`;
 o+=`<path d="M372 ${cy} v-22 h30 v22 z M368 ${cy-22} l19 -14 l19 14 z" fill="${star?'#3b4656':'#e8d8bf'}" stroke="${star?'#2b3442':'#9b7f5d'}" stroke-width="1.5"/>`;
 o+=`<path d="M226 ${cy+20} v-12 M230 ${cy+20} v-12 M222 ${cy+9} h12 v-10 h-12 z" stroke="#3e5563" stroke-width="2.4" fill="#e07a5f"/><circle cx="228" cy="${cy-6}" r="4.5" fill="#3e5563"/>`;
 o+=animB_t('동쪽',58,288,{size:15,c:'#173f50',w:700})+animB_t('남쪽 하늘',230,288,{size:15,c:'#173f50',w:700})+animB_t('서쪽',402,288,{size:15,c:'#173f50',w:700});
 return o;
}
function animB_daynight(s,k,prev){
 const f=animB_f,day=s.side==='day',pd=prev&&prev.kind==='daynight'?prev.side==='day':day;
 let phi=day?Math.PI:0;if(pd!==day)phi=day?Math.PI*animB_ease(k):Math.PI+Math.PI*animB_ease(k);
 const cx=300,cy=150,R=80,rho=phi-Math.PI;
 let o=`<circle cx="58" cy="150" r="46" fill="#ffd96a" opacity=".35"/><circle cx="58" cy="150" r="32" fill="#f6b93b" stroke="#e58e1a" stroke-width="2"/>`+animB_t('태양',58,214,{size:15,c:'#7a4a10',w:700});
 for(const y of [100,125,150,175,200])o+=`<path d="M104 ${y} H${f(cx-Math.sqrt(Math.max(0,R*R-(y-cy)*(y-cy)))-6)}" stroke="#e8b84a" stroke-width="2" opacity=".8"/>`;
 o+=`<defs><clipPath id="animBEarth"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath></defs>`;
 o+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="#5b93c7"/><g clip-path="url(#animBEarth)">`;
 for(const [a,r,w,hh] of [[.4,.55,26,18],[2.2,.5,30,20],[3.7,.6,22,16],[5.1,.45,24,22],[1.2,.2,14,10]]){const x=cx+R*r*Math.cos(a+rho),y=cy-R*r*Math.sin(a+rho);o+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${w}" ry="${hh}" fill="#7fb069" transform="rotate(${f(-(a+rho)*57.3)} ${f(x)} ${f(y)})"/>`;}
 o+=`<rect x="${cx}" y="${cy-R}" width="${R}" height="${2*R}" fill="#0f1c33" opacity=".62"/></g>`;
 o+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#2f4a6b" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="3" fill="#fff"/>`;
 o+=`<path d="M${cx-34} ${cy-R-14} A${R+14} ${R+14} 0 0 0 ${cx+34} ${cy-R-14}" fill="none" stroke="#64748b" stroke-width="2"/><path d="M${cx-40} ${cy-R-6} L${cx-34} ${cy-R-14} L${cx-26} ${cy-R-10}" fill="none" stroke="#64748b" stroke-width="2"/>`;
 const ox=cx+R*Math.cos(phi),oy=cy-R*Math.sin(phi),nx=Math.cos(phi),ny=-Math.sin(phi);
 o+=`<path d="M${f(ox)} ${f(oy)} L${f(ox+nx*14)} ${f(oy+ny*14)}" stroke="#ed684b" stroke-width="3"/><circle cx="${f(ox+nx*18)}" cy="${f(oy+ny*18)}" r="4.5" fill="#ed684b"/><circle cx="${f(ox)}" cy="${f(oy)}" r="5" fill="#ed684b" stroke="#fff" stroke-width="1.5"/>`;
 o+=animB_t('낮',250,40,{size:15,c:'#7a4a10',w:700})+animB_t('밤',352,40,{size:15,c:'#1f3350',w:700});
 o+=animB_t('북극 위에서 본 지구',cx,256,{size:14,c:'#526d79'});
 o+=animB_t(day?'관찰 지점: 낮':'관찰 지점: 밤',cx,286,{size:15,c:'#173f50',w:700,op:pd===day?1:animB_seg(k,.85,1)});
 return o;
}
const animB_seasonAngle={spring:-90,summer:0,autumn:90,winter:180};
function animB_annual(s,k,prev){
 const f=animB_f,names={spring:'사자자리',summer:'백조자리',autumn:'페가수스자리',winter:'오리온자리'};
 const points={spring:[[120,180],[175,150],[230,175],[285,110],[320,150],[280,185]],summer:[[230,55],[230,120],[230,185],[230,240],[145,145],[315,145]],autumn:[[155,85],[295,85],[295,220],[155,220]],winter:[[155,65],[295,65],[155,240],[295,240],[200,150],[225,145],[250,140]]};
 const links={spring:[[0,1],[1,2],[2,5],[5,4],[4,3],[3,1]],summer:[[0,1],[1,2],[2,3],[4,5]],autumn:[[0,1],[1,2],[2,3],[3,0]],winter:[[0,4],[1,6],[4,5],[5,6],[4,2],[6,3]]};
 const fromSeason=prev&&prev.kind==='annual'&&prev.season!==s.season?prev.season:null,moving=!!fromSeason&&k<1;
 let a1=animB_seasonAngle[s.season],a=a1;
 if(fromSeason){const a0=animB_seasonAngle[fromSeason],d=((a1-a0)%360+360)%360;a=a0+d*animB_ease(animB_seg(k,0,.55));}
 const ocx=125,ocy=152,R=78,rad=a*Math.PI/180,ex=ocx+R*Math.cos(rad),ey=ocy-R*Math.sin(rad);
 let o=`<circle cx="${ocx}" cy="${ocy}" r="${R}" fill="none" stroke="#9fb3bf" stroke-width="1.6"/>`;
 {const q=Math.PI/4,px=ocx+R*Math.cos(q),py=ocy-R*Math.sin(q),tx=-Math.sin(q),ty=-Math.cos(q);o+=`<path d="M${f(px-tx*5+ty*5)} ${f(py-ty*5-tx*5)} L${f(px+tx*5)} ${f(py+ty*5)} L${f(px-tx*5-ty*5)} ${f(py-ty*5+tx*5)}" fill="none" stroke="#7f97a6" stroke-width="2"/>`;}
 o+=`<circle cx="${ocx}" cy="${ocy}" r="26" fill="#ffd96a" opacity=".35"/><circle cx="${ocx}" cy="${ocy}" r="17" fill="#f6b93b" stroke="#e58e1a" stroke-width="2"/>`+animB_t('태양',ocx,ocy+5,{size:13.5,c:'#7a4a10',w:700});
 o+=animB_t('봄',ocx,ocy+R-20,{size:14,c:'#475569'})+animB_t('여름',ocx+R-30,ocy+5,{size:14,c:'#475569'})+animB_t('가을',ocx,ocy-R+30,{size:14,c:'#475569'})+animB_t('겨울',ocx-R+30,ocy+5,{size:14,c:'#475569'});
 o+=`<path d="M${f(ex+Math.cos(rad)*13)} ${f(ey-Math.sin(rad)*13)} L${f(ex+Math.cos(rad)*42)} ${f(ey-Math.sin(rad)*42)}" stroke="#1f3350" stroke-width="2" stroke-dasharray="4 3"/>`;
 o+=`<circle cx="${f(ex)}" cy="${f(ey)}" r="10" fill="#5b93c7" stroke="#2f4a6b" stroke-width="1.5"/><path d="M0 -10 A10 10 0 0 1 0 10 Z" fill="#0f1c33" opacity=".7" transform="translate(${f(ex)} ${f(ey)}) rotate(${f(-a)})"/>`;
 o+=animB_t('점선: 밤에 보는 쪽',ocx,296,{size:13.5,c:'#526d79'});
 // 밤하늘
 o+=`<rect x="245" y="38" width="195" height="212" rx="10" fill="#1f3350"/>`;
 const map=([x,y])=>[252+(x-120)*.9,52+(y-55)*.96];
 const sk=moving||(!fromSeason&&prev&&prev.kind!=='annual'&&k<1);
 const starOp=sk?animB_seg(k,fromSeason?.5:0,fromSeason?.72:.3):1,lineP=sk?animB_seg(k,fromSeason?.68:.25,fromSeason?.9:.7):1,nameOp=sk?animB_seg(k,.85,1):1;
 if(fromSeason&&k<.35){const op=1-animB_seg(k,0,.3);for(const p of points[fromSeason]){const q=map(p);o+=`<circle cx="${f(q[0])}" cy="${f(q[1])}" r="4" fill="#f6edcb" opacity="${op.toFixed(2)}"/>`;}}
 const pts=points[s.season].map(map);
 links[s.season].forEach(([i,j],n,arr)=>{const p=animB_seg(lineP,n/arr.length,(n+1)/arr.length);if(p<=0)return;const A=pts[i],B=pts[j];o+=`<path d="M${f(A[0])} ${f(A[1])} L${f(A[0]+(B[0]-A[0])*p)} ${f(A[1]+(B[1]-A[1])*p)}" stroke="#8fb3d9" stroke-width="1.6" opacity=".85"/>`;});
 if(starOp>0)for(const q of pts)o+=`<circle cx="${f(q[0])}" cy="${f(q[1])}" r="4.5" fill="#f6edcb" opacity="${starOp.toFixed(2)}"/><circle cx="${f(q[0])}" cy="${f(q[1])}" r="8" fill="#f6edcb" opacity="${(starOp*.18).toFixed(2)}"/>`;
 o+=animB_t(names[s.season],342,274,{size:15,c:'#173f50',w:700,op:nameOp});
 return o;
}
function animB_seasons(s,k,ph,prev){return s.kind==='daynight'?animB_daynight(s,k,prev):s.kind==='annual'?animB_annual(s,k,prev):animB_daily(s,k,prev);}
animB_def('seasons',{draw:animB_seasons,dur:(s,p)=>{
 if(s.kind==='daily'){if(p.kind!=='daily'||p.time===s.time)return 0;const st=s.time.startsWith('star');return p.time.startsWith('star')===st&&animB_skyAngle[p.time]<animB_skyAngle[s.time]?600+1400*(animB_skyAngle[s.time]-animB_skyAngle[p.time])/Math.PI:0;}
 if(s.kind==='daynight')return p.kind==='daynight'&&p.side!==s.side?2000:0;
 return p.kind!=='annual'?1400:p.season!==s.season?2400:0;}});

/* ---------- 용질 종류·진하기 ---------- */
function animB_salt(x,y,sz){const f=animB_f,h=sz/2;return `<path d="M${f(x)} ${f(y-h)} l${sz} ${-h*.6} l${sz} ${h*.6} l${-sz} ${h*.6} z" fill="#ffffff" stroke="#a8b3b8" stroke-width=".6"/><path d="M${f(x)} ${f(y-h)} l${sz} ${h*.6} v${sz} l${-sz} ${-h*.6} z" fill="#e3e9ec" stroke="#a8b3b8" stroke-width=".6"/><path d="M${f(x+sz)} ${f(y-h+h*.6)} l${sz} ${-h*.6} v${sz} l${-sz} ${h*.6} z" fill="#c9d3d8" stroke="#a8b3b8" stroke-width=".6"/>`;}
function animB_sugar(x,y,sz){const f=animB_f;return `<path d="M${f(x)} ${f(y)} l${sz*1.1} ${-sz*.7} l${sz*.9} ${sz*.5} l${-sz*.4} ${sz*.9} l${-sz*1.2} ${sz*.1} z" fill="#fffdf6" stroke="#b8b09b" stroke-width=".7"/>`;}
function animB_solute(s,k,ph,prev){
 const f=animB_f,large=s.dose==='large',play=k<1;
 let o='';const B=[60,270],W=130,top=70,bottom=236,level=120;
 const fall=animB_seg(k,0,.3),stir=animB_seg(k,.3,.86),res=play?animB_seg(k,.88,1):1;
 B.forEach((bx,j)=>{
  const g=animB_beaker(bx,top,W,bottom,level,'#cfe6f1');o+=g.back;
  const keep=large?(j===0?12:4):0,n=large?22:12,draw=j===0?animB_salt:animB_sugar,cxm=bx+W/2;
  for(let i=0;i<n;i++){
   const fixed=i<keep,del=(i%7)/7*.45,u=animB_seg(fall,del,del+.55);
   if(play&&u<=0)continue;
   const restX=cxm-26+(i*13)%52+(Math.floor(i/4)%2)*5,restY=bottom-6-Math.floor(i/5)*4;
   let x=restX,y=restY,op=1;
   if(play&&u<1){x=cxm-6+(i%5)*3;y=u<.35?78+(level-78)*(u/.35)**2:level+(restY-level)*animB_ease((u-.35)/.65);}
   else if(play&&stir>0&&!fixed){const sp=stir*Math.PI*4+i;x=cxm+Math.cos(sp)*(18+i%3*8);y=restY-14-Math.sin(sp)*8-stir*30;op=1-animB_seg(stir,(i%6)/10,(i%6)/10+.4);}
   else if(!play&&!fixed)continue;
   if(op<=0)continue;
   o+=`<g opacity="${op.toFixed(2)}">${draw(x,y,j===0?5.4:5)}</g>`;
  }
  if(play&&k<.32){const sx=cxm-30+40*animB_seg(k,0,.08);o+=`<path d="M${f(sx-60)} 52 L${f(sx-4)} 64" stroke="#8d98a0" stroke-width="5" stroke-linecap="round"/><ellipse cx="${f(sx+4)}" cy="66" rx="13" ry="6" fill="#c9d1d6" stroke="#8d98a0" stroke-width="1.5" transform="rotate(${f(30*animB_seg(k,.05,.12))} ${f(sx+4)} 66)"/>`;}
  if(play&&stir>0&&stir<1){const sw=Math.sin(stir*Math.PI*8)*20;o+=`<path d="M${f(cxm+sw+14)} 62 L${f(cxm-sw*.4)} ${bottom-14}" stroke="#9fb7c0" stroke-width="5" stroke-linecap="round"/><path d="M${f(cxm+sw+12)} 64 L${f(cxm-sw*.4-1)} ${bottom-18}" stroke="#eef6f8" stroke-width="1.6"/>`;}
  o+=g.front;
 });
 o+=animB_t('소금',125,52,{size:15,w:700})+animB_t('설탕',335,52,{size:15,w:700});
 o+=animB_t(large?'남은 양이 더 많음':'모두 녹음',125,268,{size:15,c:'#1f4f5c',w:700,op:res})+animB_t(large?'남은 양이 더 적음':'모두 녹음',335,268,{size:15,c:'#1f4f5c',w:700,op:res});
 return o;
}
function animB_floatLevel(s){return s.water==='more'?84:120;}
function animB_floatY(s){const strength=(s.amount==='more'?2:1)/(s.water==='more'?2:1),lv=animB_floatLevel(s);return strength>1?lv-6:strength<1?lv+17:lv+9;}
function animB_float(s,k,ph,prev){
 const f=animB_f,strength=(s.amount==='more'?2:1)/(s.water==='more'?2:1),higher=strength>1,lower=strength<1,play=k<1;
 const top=56,bottom=236,W=130;
 const pl=prev&&prev.kind==='float'?animB_floatLevel(prev):animB_floatLevel(s),rl=play?animB_lerp(pl,animB_floatLevel(s),animB_ease(animB_seg(k,0,.2))):animB_floatLevel(s);
 const egg=(x,y)=>`<ellipse cx="${f(x)}" cy="${f(y)}" rx="15" ry="19" fill="#f1dfbd" stroke="#bd9e6c" stroke-width="1.4"/><ellipse cx="${f(x-5)}" cy="${f(y-7)}" rx="4" ry="6" fill="#fff" opacity=".55"/><circle cx="${f(x+5)}" cy="${f(y+4)}" r="1.6" fill="#9b7b55"/><circle cx="${f(x-3)}" cy="${f(y+8)}" r="1.2" fill="#9b7b55"/><circle cx="${f(x+7)}" cy="${f(y-5)}" r="1.1" fill="#9b7b55"/>`;
 const yAt=(lv,fin)=>{if(!play)return fin;const u=animB_seg(k,.15,1);if(u<=0)return -25;if(u<.22)return -25+(lv+25)*(u/.22)**2;const v=(u-.22)/.78;return fin+(lv-fin)*Math.exp(-4*v)*Math.cos(9*v)*(1-animB_seg(v,.9,1));};
 const ripple=(x,lv)=>{if(!play)return '';const u=animB_seg(k,.32,.7);if(u<=0||u>=1)return '';return `<ellipse cx="${f(x)}" cy="${f(lv)}" rx="${f(16+u*36)}" ry="${f(3+u*4)}" fill="none" stroke="#fff" stroke-width="2" opacity="${(1-u).toFixed(2)}"/>`;};
 let o='';
 const L=animB_beaker(60,top,W,bottom,120,'#d6eaf2'),R=animB_beaker(270,top,W,bottom,rl,'#d6eaf2');
 o+=L.back+egg(125,yAt(120,129))+ripple(125,120)+L.front;
 o+=R.back+egg(335,yAt(rl,animB_floatY({...s})))+ripple(335,rl)+R.front;
 o+=animB_t('기준 설탕물',125,38,{size:15,w:700})+animB_t('비교 설탕물',335,38,{size:15,w:700});
 o+=animB_t(higher?'더 높이 뜸':lower?'더 아래에 놓임':'뜨는 정도 같음',335,272,{size:15,c:'#1f4f5c',w:700,op:play?animB_seg(k,.86,1):1});
 return o;
}
function animB_solubility(s,k,ph,prev){return s.kind==='solute'?animB_solute(s,k,ph,prev):animB_float(s,k,ph,prev);}
animB_def('solubility',{draw:animB_solubility,dur:(s,p)=>{if(s.kind==='solute')return p.kind!=='solute'||p.dose!==s.dose?2800:0;return p.kind!=='float'||p.amount!==s.amount||p.water!==s.water?2300:0;}});

/* ---------- 증발·끓음·응결 ---------- */
function animB_state(s,k,ph,prev){
 const f=animB_f,after=s.stage==='after',boil=s.kind==='boiling',dew=s.kind==='condensation';
 const play=after&&prev&&prev.kind===s.kind&&prev.stage!=='after'&&k<1,u=after?(play?k:1):0;
 let o='';const x=160,W=140,top=70;
 const title=dew?'색 물과 얼음이 든 컵':boil?'가열하여 끓이는 물':'상온에서 가만히 둔 물';
 if(!dew){
  const bottom=boil?234:244,lv0=bottom-122,lv1=bottom-92,drop=boil?animB_seg(u,.3,1):animB_ease(u),lv=lv0+(lv1-lv0)*drop;
  o+=`<rect x="20" y="${boil?262:244}" width="420" height="8" rx="2" fill="#cdbb9f" stroke="#a48f6e"/>`;
  if(boil){const heat=animB_seg(u,0,.2);
   o+=`<rect x="134" y="236" width="192" height="26" rx="5" fill="#e3e7ea" stroke="#8c9aa3" stroke-width="1.6"/><rect x="150" y="234" width="160" height="4" rx="2" fill="${animB_mix('#9aa5ab','#e2552f',heat)}"/>`;
   if(heat>0)o+=`<rect x="146" y="226" width="168" height="10" rx="5" fill="#ff8a4c" opacity="${(heat*.35).toFixed(2)}"/>`;
   o+=`<circle cx="306" cy="249" r="6" fill="#64748b"/><circle cx="150" cy="249" r="3" fill="${heat>0?'#ef4444':'#94a3b8'}"/>`;}
  const g=animB_beaker(x,top,W,bottom,lv,'#bfe1f0');o+=g.back;
  if(boil&&u>.15){const n=Math.round(4+14*animB_seg(u,.15,.6)),t=play?ph:2.3;
   for(let i=0;i<n;i++){const r=((t*(.55+(i%4)*.12))+i*.137)%1,bx=x+18+(i*29)%(W-36)+Math.sin(r*9+i)*3,by=bottom-8-r*(bottom-8-lv-6),sz=1.8+r*4.2;o+=`<circle cx="${f(bx)}" cy="${f(by)}" r="${f(sz)}" fill="#fff" fill-opacity=".55" stroke="#8fb7cb" stroke-width="1"/>`;}
   const so=animB_seg(u,.35,.6);for(let i=0;i<4;i++){const r=((play?ph:1.7)*.35+i/4)%1,sx=x+30+i*27;o+=`<path d="M${sx} ${f(lv-26-r*40)} q-7 -8 0 -16 q7 -8 0 -16" fill="none" stroke="#c6d3da" stroke-width="5" stroke-linecap="round" opacity="${(so*(1-r)*.9).toFixed(2)}"/>`;}
   const lo=play?animB_seg(k,.6,.8):1;o+=animB_t('김',x+W+26,lv-50,{size:14,c:'#475569',w:700,op:lo})+`<path d="M${x+W+14} ${f(lv-54)} H${x+W-18}" stroke="#94a3b8" opacity="${lo.toFixed(2)}"/>`+animB_t('기포',x+W+30,bottom-30,{size:14,c:'#475569',w:700,op:lo})+`<path d="M${x+W+14} ${bottom-34} H${x+W-22}" stroke="#94a3b8" opacity="${lo.toFixed(2)}"/>`;}
  o+=g.front;
  // 처음 물 높이 표시
  o+=`<path d="M${x-8} ${lv0} H${x+16}" stroke="#e39b4b" stroke-width="3"/>`+animB_t('처음 높이',x-12,lv0+5,{a:'end',size:14,c:'#a1601f'});
  if(!boil){const ang=u*Math.PI*2*6,cx=372,cy=132;o+=`<circle cx="${cx}" cy="${cy}" r="34" fill="#fff" stroke="#7d97a4" stroke-width="3"/>`;for(let i=0;i<12;i++){const a=i*Math.PI/6;o+=`<path d="M${f(cx+28*Math.sin(a))} ${f(cy-28*Math.cos(a))} L${f(cx+31*Math.sin(a))} ${f(cy-31*Math.cos(a))}" stroke="#7d97a4" stroke-width="2"/>`;}
   o+=`<path d="M${cx} ${cy} L${f(cx+16*Math.sin(ang/12))} ${f(cy-16*Math.cos(ang/12))}" stroke="#334155" stroke-width="4" stroke-linecap="round"/><path d="M${cx} ${cy} L${f(cx+24*Math.sin(ang))} ${f(cy-24*Math.cos(ang))}" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="3" fill="#334155"/>`;
   if(after)o+=animB_t('시간이 지남',cx,190,{size:14,c:'#475569',w:700,op:play?animB_seg(k,.3,.6):1});}
 }else{
  const bottom=244,lv=128;
  o+=`<rect x="20" y="244" width="420" height="8" rx="2" fill="#cdbb9f" stroke="#a48f6e"/>`;
  const cup=`M172 78 L184 ${bottom} H276 L288 78`;
  o+=`<ellipse cx="230" cy="${bottom+3}" rx="62" ry="5" fill="#254754" fill-opacity=".08"/>`;
  o+=`<path d="M${172+12*(lv-78)/(bottom-78)} ${lv} L184 ${bottom-2} H276 L${288-12*(lv-78)/(bottom-78)} ${lv} Z" fill="#4f8fd0" fill-opacity=".8"/>`;
  for(const [ix,iy,a] of [[196,122,-8],[232,118,10],[256,126,-4]])o+=`<g transform="rotate(${a} ${ix+13} ${iy+11})"><rect x="${ix}" y="${iy}" width="26" height="22" rx="4" fill="#eef7fc" fill-opacity=".85" stroke="#a9c9da"/><path d="M${ix+4} ${iy+5} h10" stroke="#fff" stroke-width="2.5"/></g>`;
  o+=`<path d="${cup}" fill="#e7f2f6" fill-opacity=".2" stroke="#6f8f9d" stroke-width="2.4" stroke-linejoin="round"/><path d="M182 92 L192 230" stroke="#fff" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"/>`;
  const wallX=(y,side)=>side?288-12*(y-78)/166:172+12*(y-78)/166,drops=[];for(let i=0;i<8;i++){const y=124+i*14;drops.push([wallX(y,i%2),y+(i%3)*3]);}for(let i=0;i<22;i++){const y=118+(i*37)%116,l=wallX(y,0)+8,r=wallX(y,1)-8;drops.push([l+((i*53)%100)/100*(r-l),y]);}
  drops.forEach(([dx0,dy0],i)=>{const g=animB_seg(u,.04+(i%15)*.04,.42+(i%15)*.04);if(g<=0)return;let dy=dy0;const run=i===9||i===14;if(run)dy+=(bottom-14-dy0)*animB_ease(animB_seg(u,.78,1));const r=(3+(i%4)*1.2)*g;
   o+=`<g data-dew-drop><ellipse cx="${dx0}" cy="${f(dy)}" rx="${f(r)}" ry="${f(r*1.15)}" fill="#ffffff" fill-opacity=".5" stroke="#7f9fb0" stroke-width="1"/><circle cx="${f(dx0-r*.35)}" cy="${f(dy-r*.4)}" r="${f(r*.3)}" fill="#fff"/></g>`;
   if(run&&u>.8)o+=`<path d="M${dx0} ${dy0} V${f(dy)}" stroke="#9fb9c6" stroke-width="1.6" opacity=".6"/>`;});
  if(u>.85)o+=`<ellipse cx="230" cy="${bottom+2}" rx="${f(50*animB_seg(u,.85,1))}" ry="4" fill="#cfe3ec" opacity=".8"/>`;
  const lo=after?(play?animB_seg(k,.7,.9):1):0;
  o+=animB_t('물방울',330,150,{size:14,c:'#475569',w:700,op:lo})+`<path d="M306 146 H290" stroke="#94a3b8" opacity="${lo.toFixed(2)}"/>`;
  o+=animB_t('얼음',116,124,{size:14,c:'#475569'})+`<path d="M134 120 H192" stroke="#94a3b8"/>`;
 }
 o+=animB_t(title,230,36,{size:15,w:700})+animB_t(after?'변화 뒤':'처음',230,288,{size:15,c:'#1f4f5c',w:700});
 return o;
}
animB_def('state-change',{draw:animB_state,dur:(s,p)=>p.kind===s.kind&&s.stage==='after'&&p.stage!=='after'?(s.kind==='evaporation'?2600:3000):0});

/* ---------- 공기의 팽창과 구름 ---------- */
function animB_air(s,k,ph,prev){
 const f=animB_f,moist=s.moisture==='moist',st=s.stage,ps=prev&&prev.moisture===s.moisture?prev.stage:st,play=k<1&&ps!==st;
 const Pof=x=>x==='after'?80:150,Tof=x=>x==='after'?.32:.66,Cof=x=>x==='after'&&moist?1:0;
 let P=Pof(st),T=Tof(st),C=Cof(st),moveDir=0;
 if(play){
  if(st==='compress'&&ps==='before'){if(k<.5){const u=animB_ease(k/.5);P=animB_lerp(150,80,u);T=animB_lerp(.66,.32,animB_seg(k,.05,.35));C=moist?animB_seg(k,.2,.45):0;moveDir=-1;}else{const u=animB_ease((k-.5)/.5);P=animB_lerp(80,150,u);T=animB_lerp(.32,.7,animB_seg(k,.55,.85));C=moist?1-animB_seg(k,.6,.9):0;moveDir=1;}}
  else{const u=animB_ease(animB_seg(k,0,.38));P=animB_lerp(Pof(ps),P,u);T=animB_lerp(Tof(ps),st==='compress'?.7:T,animB_seg(k,.08,.55));C=animB_lerp(Cof(ps),C,animB_seg(k,.3,.9));moveDir=Pof(st)<Pof(ps)?-1:1;}
 }else if(st==='compress')T=.7;
 let o=`<rect x="20" y="262" width="420" height="8" rx="2" fill="#cdbb9f" stroke="#a48f6e"/>`;
 o+=`<rect x="146" y="252" width="168" height="10" rx="2" fill="#8c9aa3"/>`;
 // 공기와 구름
 o+=`<rect x="162" y="${f(P+10)}" width="136" height="${f(242-P)}" fill="${animB_mix('#dcebf2','#c9dfeb',1-T)}"/>`;
 if(moist)o+=`<path d="M164 252 Q200 246 230 250 T296 248 V252 Z" fill="#9ccbe2"/>`;
 if(C>0){o+=`<rect x="162" y="${f(P+10)}" width="136" height="${f(242-P)}" fill="#f8fafb" opacity="${(C*.78).toFixed(2)}"/>`;for(let i=0;i<46;i++){const x=168+(i*37)%124,y=P+16+((i*53)%100)/100*(226-P);o+=`<circle cx="${f(x)}" cy="${f(y)}" r="${3+i%3}" fill="#fff" stroke="#c5d5dd" stroke-width=".8" opacity="${(C*.9).toFixed(2)}"/>`;}}
 // 실린더 벽
 o+=`<path d="M160 40 V252 M300 40 V252" stroke="#6f8f9d" stroke-width="4"/><path d="M166 50 V244" stroke="#fff" stroke-opacity=".6" stroke-width="3"/>`;
 // 피스톤과 손잡이
 o+=`<rect x="226" y="${f(P-58)}" width="8" height="58" fill="#8c9aa3"/><rect x="196" y="${f(P-66)}" width="68" height="10" rx="4" fill="#64748b"/>`;
 o+=`<rect x="162" y="${f(P)}" width="136" height="12" rx="2" fill="#708b99"/><rect x="162" y="${f(P+4)}" width="136" height="3" fill="#3e5563"/>`;
 o+=animB_t('피스톤',150,P+11,{a:'end',size:14,c:'#334155',w:700});
 if(play&&moveDir){const y=P-30,d=moveDir;o+=`<path d="M282 ${f(y-12*d)} V${f(y+12*d)}" stroke="#c2410c" stroke-width="3"/><path d="M276 ${f(y+6*d)} L282 ${f(y+14*d)} L288 ${f(y+6*d)}" fill="none" stroke="#c2410c" stroke-width="3"/>`;}
 // 온도계
 const tb=240,tt=168,col=tb-6-T*(tb-tt-14);
 o+=`<rect x="280" y="${tt}" width="9" height="${tb-tt}" rx="4.5" fill="#fff" stroke="#7d97a4" stroke-width="1.2"/><rect x="282.6" y="${f(col)}" width="3.8" height="${f(tb-col)}" fill="#d43c3c"/><circle cx="284.5" cy="${tb}" r="5.5" fill="#d43c3c"/>`;
 o+=animB_t('온도계',310,206,{a:'start',size:14,c:'#334155',w:700})+`<path d="M306 202 H292" stroke="#94a3b8"/>`;
 if(moist)o+=animB_t('물',312,246,{a:'start',size:14,c:'#334155'});
 if(C>.3)o+=animB_t('뿌옇게 흐려짐',230,P+40,{size:14,c:'#334155',w:700,halo:true,op:animB_seg(C,.3,.8)});
 const expanded=st==='after';
 o+=animB_t(expanded?'부피 증가 · 온도 하강':'작은 부피 · 비교적 높은 온도',230,292,{size:15,c:'#1f4f5c',w:700,op:play?animB_seg(k,.85,1):1});
 return o;
}
animB_def('weather-front',{draw:animB_air,dur:(s,p)=>p.moisture!==s.moisture||p.stage===s.stage?0:s.stage==='compress'&&p.stage==='before'?2800:s.stage==='before'?0:1900});

/* ---------- 고체·액체·기체 ---------- */
function animB_poly(pts){let a=0;for(let i=0;i<pts.length;i++){const p=pts[i],q=pts[(i+1)%pts.length];a+=p[0]*q[1]-q[0]*p[1];}return Math.abs(a)/2;}
function animB_clipBelow(pts,c){const out=[];for(let i=0;i<pts.length;i++){const p=pts[i],q=pts[(i+1)%pts.length],pi=p[1]>=c,qi=q[1]>=c;if(pi)out.push(p);if(pi!==qi){const t=(c-p[1])/(q[1]-p[1]);out.push([p[0]+(q[0]-p[0])*t,c]);}}return out;}
const animB_box={wide:{x:60,w:144},narrow:{x:296,w:74}},animB_rim=160,animB_floor=258,animB_vol=70*84;
function animB_container(k2,dx,dy,ang,pivot){
 const b=animB_box[k2],f=animB_f;const tr=pivot?` transform="translate(${f(dx)} ${f(dy)}) rotate(${f(ang)} ${f(pivot[0])} ${f(pivot[1])})"`:'';
 return `<g${tr}><path d="M${b.x} ${animB_rim} V${animB_floor} Q${b.x} 262 ${b.x+4} 262 H${b.x+b.w-4} Q${b.x+b.w} 262 ${b.x+b.w} ${animB_floor} V${animB_rim}" fill="#e7f2f6" fill-opacity=".25" stroke="#6f8f9d" stroke-width="2.4" stroke-linejoin="round"/><path d="M${b.x+7} ${animB_rim+10} V${animB_floor-8}" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/></g>`;
}
function animB_block(x,y){const f=animB_f;return `<rect x="${f(x)}" y="${f(y)}" width="50" height="35" rx="2" fill="#b98557" stroke="#7d5634" stroke-width="1.4"/><path d="M${f(x+4)} ${f(y+10)} q20 -5 42 2 M${f(x+4)} ${f(y+22)} q18 4 42 -1" fill="none" stroke="#8e6038" stroke-width="1.2"/>`;}
function animB_solidLiquid(s,k,ph,prev){
 const f=animB_f,solid=s.kind==='solid',dest=s.container,src=prev&&prev.kind===s.kind&&prev.container!==dest?prev.container:null,play=!!src&&k<1;
 let o=`<rect x="20" y="262" width="420" height="8" rx="2" fill="#cdbb9f" stroke="#a48f6e"/>`;
 const inner=c=>({x:animB_box[c].x+2,w:animB_box[c].w-4}),levelOf=(c,v)=>animB_floor-v/inner(c).w;
 o+=animB_t('넓은 용기',132,290,{size:14,c:'#334155',w:700})+animB_t('좁은 용기',333,290,{size:14,c:'#334155',w:700});
 if(solid){
  const at=c=>[animB_box[c].x+animB_box[c].w/2-25,animB_floor-35];
  for(const c of ['wide','narrow'])o+=animB_container(c);
  let p=at(dest);if(play){const a=at(src),up=animB_ease(animB_seg(k,0,.3)),mv=animB_ease(animB_seg(k,.3,.7)),dn=animB_ease(animB_seg(k,.7,1));p=[animB_lerp(a[0],p[0],mv),a[1]-110*up+110*dn];}
  o+=animB_block(p[0],p[1]);
 }else{
  const water='#7ab8dd';
  if(!play){for(const c of ['wide','narrow']){if(c===dest){const lv=levelOf(c,animB_vol),b=inner(c);o+=`<rect x="${b.x}" y="${f(lv)}" width="${b.w}" height="${f(animB_floor+2-lv)}" fill="${water}" fill-opacity=".8"/><path d="M${b.x} ${f(lv)} H${b.x+b.w}" stroke="#fff" stroke-opacity=".8" stroke-width="1.8"/>`;}o+=animB_container(c);}}
  else{
   const left=src==='narrow',b=animB_box[src],pivot=left?[b.x,animB_rim]:[b.x+b.w,animB_rim];
   const targetLip=left?[animB_box.wide.x+animB_box.wide.w-8,animB_rim-12]:[animB_box.narrow.x+8,animB_rim-12];
   const lift=animB_ease(animB_seg(k,0,.25))*(1-animB_ease(animB_seg(k,.82,1)));
   const maxA=left?-100:88,ang=maxA*(animB_seg(k,0,.25)*.42+animB_seg(k,.25,.75)*.58)*(1-animB_ease(animB_seg(k,.8,1)));
   const dx=(targetLip[0]-pivot[0])*lift,dy=(targetLip[1]-pivot[1])*lift,poured=animB_ease(animB_seg(k,.28,.78)),remain=animB_vol*(1-poured);
   // 받는 용기 물
   const di=inner(dest),dl=levelOf(dest,animB_vol*poured);
   if(poured>0)o+=`<rect x="${di.x}" y="${f(dl)}" width="${di.w}" height="${f(animB_floor+2-dl)}" fill="${water}" fill-opacity=".8"/><path d="M${di.x} ${f(dl)} H${di.x+di.w}" stroke="#fff" stroke-opacity=".8" stroke-width="1.8"/>`;
   o+=animB_container(dest);
   // 기울어진 용기 속 물: 물면은 늘 수평
   const rad=ang*Math.PI/180,cs=Math.cos(rad),sn=Math.sin(rad),bi=inner(src);
   const wp=([x,y])=>{const X=x-pivot[0],Y=y-pivot[1];return[pivot[0]+dx+X*cs-Y*sn,pivot[1]+dy+X*sn+Y*cs];};
   const quad=[[bi.x,animB_rim],[bi.x+bi.w,animB_rim],[bi.x+bi.w,animB_floor+2],[bi.x,animB_floor+2]].map(wp);
   if(remain>1){const lip=wp(left?[bi.x,animB_rim]:[bi.x+bi.w,animB_rim]);let lo=Math.min(...quad.map(p=>p[1])),hi=Math.max(...quad.map(p=>p[1]));const cap=animB_poly(animB_clipBelow(quad,lip[1]));let c;
    if(cap<=remain)c=lip[1];else{for(let i=0;i<40;i++){const m=(lo+hi)/2;if(animB_poly(animB_clipBelow(quad,m))>remain)lo=m;else hi=m;}c=(lo+hi)/2;}
    const poly=animB_clipBelow(quad,c);if(poly.length>2)o+=`<path d="M${poly.map(p=>f(p[0])+' '+f(p[1])).join(' L')} Z" fill="${water}" fill-opacity=".8"/>`;
    if(k>.27&&k<.79){const L=wp(left?[b.x,animB_rim]:[b.x+b.w,animB_rim]);o+=`<path d="M${f(L[0])} ${f(L[1])} Q${f(L[0]+(left?-6:6))} ${f((L[1]+dl)/2)} ${f(L[0]+(left?-8:8))} ${f(dl)}" fill="none" stroke="${water}" stroke-width="${f(3+4*Math.sin(animB_seg(k,.27,.79)*Math.PI))}" stroke-linecap="round" opacity=".9"/>`;}}
   o+=animB_container(src,dx,dy,ang,pivot);
  }
 }
 const res=play?animB_seg(k,.86,1):1;
 o+=animB_t(solid?'나무 도막의 모양과 부피는 같음':'물의 모양은 달라져도 부피는 같음',230,36,{size:15,c:'#1f4f5c',w:700,op:res});
 return o;
}
function animB_gas(s,k,ph,prev){
 const f=animB_f,after=s.stage==='after',play=k<1&&prev&&prev.kind==='gas'?prev.stage!==s.stage:k<1&&!!prev&&!after;
 let push=1,tilt=0,inLv=after?166:211,WL=after?107:104;
 if(play&&!after){push=animB_ease(k);}
 if(play&&after){tilt=Math.sin(animB_seg(k,.08,.85)*Math.PI)*22;inLv=animB_lerp(211,166,animB_ease(animB_seg(k,.25,.8)));WL=animB_lerp(104,107,animB_seg(k,.25,.8));}
 const cupDy=-(1-push)*120,rim=220+cupDy;
 if(!after&&play){WL=animB_lerp(107,104,push);inLv=rim>WL?rim:rim-9*animB_c((rim-WL)/(220-104));}
 let o=`<rect x="20" y="262" width="420" height="8" rx="2" fill="#cdbb9f" stroke="#a48f6e"/>`;
 o+=`<path d="M62 92 V256 Q62 262 68 262 H392 Q398 262 398 256 V92" fill="#e7f2f6" fill-opacity=".2" stroke="#6f8f9d" stroke-width="2.4"/>`;
 // 컵 바깥 물(컵 자리는 비움)
 const pivot=[230,rim],rad=tilt*Math.PI/180,cs=Math.cos(rad),sn=Math.sin(rad),wp=([x,y])=>[pivot[0]+(x-pivot[0])*cs-(y-pivot[1])*sn,pivot[1]+(x-pivot[0])*sn+(y-pivot[1])*cs];
 const outerCup=[[180,72+cupDy],[280,72+cupDy],[280,rim],[180,rim]].map(wp),innerCup=[[183,74+cupDy],[277,74+cupDy],[277,rim],[183,rim]].map(wp);
 o+=`<defs><clipPath id="animBCupIn"><path d="M${innerCup.map(p=>f(p[0])+' '+f(p[1])).join(' L')} Z"/></clipPath><mask id="animBCupOut"><rect x="0" y="0" width="460" height="310" fill="#fff"/><path d="M${outerCup.map(p=>f(p[0])+' '+f(p[1])).join(' L')} Z" fill="#000"/></mask></defs>`;
 o+=`<rect x="64" y="${f(WL)}" width="332" height="${f(260-WL)}" fill="#8cc5e3" fill-opacity=".85" mask="url(#animBCupOut)"/><path d="M64 ${f(WL)} H396" stroke="#fff" stroke-opacity=".7" stroke-width="1.8" mask="url(#animBCupOut)"/>`;
 // 컵 안: 공기와 들어온 물
 o+=`<g clip-path="url(#animBCupIn)"><rect x="150" y="${f(70+cupDy-60)}" width="160" height="320" fill="#f6fbfd"/><rect x="150" y="${f(inLv)}" width="160" height="${f(300-inLv)}" fill="#8cc5e3" fill-opacity=".85"/></g>`;
 o+=`<path d="M${f(innerCup[3][0])} ${f(innerCup[3][1])} L${f(innerCup[0][0])} ${f(innerCup[0][1])} L${f(innerCup[1][0])} ${f(innerCup[1][1])} L${f(innerCup[2][0])} ${f(innerCup[2][1])}" fill="none" stroke="#5f7f8d" stroke-width="5" stroke-linejoin="round"/>`;
 // 거품: 기울어 올라간 컵 입구 쪽에서 나와 위로 올라감
 if(play&&after){const lip=wp([182,rim]);for(let i=0;i<7;i++){const u=animB_seg(k,.22+i*.07,.5+i*.07);if(u<=0||u>=1)continue;const y=animB_lerp(lip[1],WL+4,u),x=lip[0]-6-Math.sin(u*9+i)*5-u*10;o+=`<circle cx="${f(x)}" cy="${f(y)}" r="${f(4+i%3+u*2)}" fill="#fff" fill-opacity=".7" stroke="#6ea6c4" stroke-width="1.2"/>`;}}
 o+=animB_t('공기',230,128+cupDy,{size:15,c:'#334155',w:700});
 o+=animB_t('물',96,240,{size:14,c:'#1f4f5c',w:700});
 o+=animB_t(after?'컵을 기울여 공기를 뺀 뒤':'거꾸로 세워 넣은 컵',230,36,{size:15,w:700});
 return o;
}
function animB_weight(s,k,ph,prev){return s.kind==='gas'?animB_gas(s,k,ph,prev):animB_solidLiquid(s,k,ph,prev);}
animB_def('weight-compare',{draw:animB_weight,dur:(s,p)=>{if(s.kind==='gas')return p.kind==='gas'&&p.stage!==s.stage?(s.stage==='after'?2600:1500):p.kind!=='gas'?1500:0;return p.kind===s.kind&&p.container!==s.container?(s.kind==='solid'?1600:3000):0;}});

/* ---------- 화면에서 이어 그리기 ---------- */
function animB_install(){
 if(typeof document==='undefined'||typeof window==='undefined'||animB_install.done)return;
 animB_install.done=true;
 const reduce=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let sec=null,svg=null,last=null,frame=0,busy=false;
 const hide=on=>{const o=sec&&sec.querySelector('.supplement-observation');if(!o)return;o.style.transition='opacity .35s';o.style.opacity=on?'0':'';};
 const finish=()=>{cancelAnimationFrame(frame);frame=0;busy=false;if(svg)svg.removeAttribute('data-animb-busy');hide(false);};
 const paint=(def,st,k,ph,prev)=>{svg.innerHTML=`<g data-animb="1">${def.draw(st,k,ph,prev)}</g>`;};
 function onRender(){
  const s2=sec.querySelector('.supplement-visual>svg');if(!s2||s2.querySelector('[data-animb]'))return;
  const api=window.__scienceSupplement,def=animB_def.map&&animB_def.map[api&&api.slug],st=api&&api.getState&&api.getState();
  if(!def||!st)return;
  svg=s2;
  if(st.pathway&&st.pathway!=='core'){finish();last=null;return;}
  const key=JSON.stringify(st);
  if(last&&last.key===key&&busy)return;
  const prev=last?last.st:null;last={key,st};
  finish();
  const dur=prev&&JSON.stringify(prev)!==key&&!reduce()?def.dur(st,prev):0;
  if(!dur){paint(def,st,1,0,prev);return;}
  busy=true;svg.setAttribute('data-animb-busy','1');hide(true);
  const start=performance.now(),target=svg;
  const step=now=>{if(!target.isConnected){finish();return;}const t=animB_c((now-start)/dur);paint(def,st,t,now/1000,prev);if(t<1)frame=requestAnimationFrame(step);else finish();};
  paint(def,st,0,start/1000,prev);frame=requestAnimationFrame(step);
 }
 const look=()=>{const s=document.querySelector('section.curriculum-supplement'),api=window.__scienceSupplement;if(!s||!api)return false;if(animB_def.map&&animB_def.map[api.slug]){sec=s;new MutationObserver(onRender).observe(s.querySelector('.supplement-visual'),{childList:true,subtree:true});onRender();}return true;};
 const go=()=>{if(!look()){const w=new MutationObserver(()=>{if(look())w.disconnect();});w.observe(document.body,{childList:true,subtree:true});}};
 if(document.body)go();else document.addEventListener('DOMContentLoaded',go);
}
if(typeof document!=='undefined')animB_install();
/* animP_: motion for ten core panels (acid-base, burning-conditions, cell-membrane,
 * density-buoyancy, diffusion, energy-conversion, flame-ions, lever-balance,
 * light-shadow, mass-ratio). view() still returns the settled last frame; once
 * the shared renderer has put it in the panel svg, the step is replayed frame by
 * frame inside that svg only, and the written observation fades in afterwards. */
function animP_store(){return animP_store.s||(animP_store.s={ids:new Map(),entries:[],current:null,gen:0,queued:false});}
function animP_wrap(slug,s,r,draw,ms){
 const S=animP_store(),key=slug+'|'+JSON.stringify(s);let id=S.ids.get(key);
 if(id===undefined){id=S.entries.length;S.ids.set(key,id);S.entries.push(null);}
 S.entries[id]={s:{...s},draw,ms};
 if(typeof document!=='undefined'&&typeof queueMicrotask==='function'&&!S.queued){S.queued=true;queueMicrotask(animP_check);}
 return{...r,svg:animP_frame(id,1,null)};
}
function animP_frame(id,p,prev){return `<g data-animp="${id}">${animP_store().entries[id].draw(p,prev)}</g>`;}
function animP_check(){
 const S=animP_store();S.queued=false;
 const svg=document.querySelector('.curriculum-supplement .supplement-visual > svg'),obs=svg?.closest('.curriculum-supplement')?.querySelector('.supplement-observation');
 const show=()=>{if(obs){obs.style.transition='opacity .4s';obs.style.opacity='';}};
 const g=svg?.querySelector(':scope > g[data-animp]');
 if(!g){S.current=null;S.gen++;show();return;}
 const id=+g.getAttribute('data-animp');if(id===S.current)return;
 const prevId=S.current,gen=++S.gen,e=S.entries[id],prev=prevId==null?null:S.entries[prevId].s;S.current=id;
 const ms=prevId==null?0:+(typeof e.ms==='function'?e.ms(prev):e.ms)||0;
 if(!ms||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){show();return;}
 if(obs){obs.style.transition='none';obs.style.opacity='0';}
 svg.innerHTML=animP_frame(id,0,prev);const start=performance.now();
 const step=now=>{if(gen!==S.gen)return;const p=Math.min(1,(now-start)/ms);svg.innerHTML=animP_frame(id,p,prev);if(p<1)requestAnimationFrame(step);else show();};
 requestAnimationFrame(step);
}
function animP_seg(p,a,b){return Math.max(0,Math.min(1,(p-a)/(b-a)));}
function animP_ease(t){return t<.5?2*t*t:1-(-2*t+2)**2/2;}
function animP_lerp(a,b,t){return a+(b-a)*t;}
function animP_n(v){return Math.round(v*10)/10;}
function animP_rnd(n){const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function animP_fold(v,lo,hi){const w=hi-lo;let m=((v-lo)%(2*w)+2*w)%(2*w);return lo+(m>w?2*w-m:m);}
function animP_t(text,x,y,size=15,fill='#173f50',anchor='middle',weight=''){return `<text x="${animP_n(x)}" y="${animP_n(y)}" fill="${fill}" font-size="${size}" text-anchor="${anchor}"${weight?` font-weight="${weight}"`:''}>${text}</text>`;}
function animP_bubble(x,y,r,stroke='#7fb3c8'){return `<circle cx="${animP_n(x)}" cy="${animP_n(y)}" r="${animP_n(r)}" fill="#fff" fill-opacity=".6" stroke="${stroke}" stroke-width="1.2"/>`;}
function animP_arrow(x1,y1,x2,y2,color='#246874',w=4){const a=Math.atan2(y2-y1,x2-x1),h=11,n=animP_n;return `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2-Math.cos(a)*h*.6)}" y2="${n(y2-Math.sin(a)*h*.6)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/><path d="M${n(x2)} ${n(y2)} L${n(x2-h*Math.cos(a-.45))} ${n(y2-h*Math.sin(a-.45))} L${n(x2-h*Math.cos(a+.45))} ${n(y2-h*Math.sin(a+.45))} Z" fill="${color}"/>`;}
function animP_flame(x,y,h,w,outer='#f59e0b',inner='#fde68a'){const n=animP_n;return `<path d="M${n(x)} ${n(y)} Q${n(x-w)} ${n(y-h*.35)} ${n(x)} ${n(y-h)} Q${n(x+w)} ${n(y-h*.35)} ${n(x)} ${n(y)} Z" fill="${outer}"/><path d="M${n(x)} ${n(y)} Q${n(x-w*.5)} ${n(y-h*.3)} ${n(x)} ${n(y-h*.6)} Q${n(x+w*.5)} ${n(y-h*.3)} ${n(x)} ${n(y)} Z" fill="${inner}"/>`;}

// 산·염기와 물질의 반응: pieces rest on the beaker floors; acid fizzes on eggshell, base frays egg white.
function animP_acidBase(s,r,{jar}){
 const after=s.stage==='after',shell=s.material==='shell',n=animP_n;
 const draw=p=>{
  const k=after?p:0,tt=k*2.6;
  let svg=jar(65,135,'#cee5ed')+jar(285,135,'#cee5ed')+animP_t('묽은 염산',120,35,16)+animP_t('묽은 수산화 나트륨',340,35,16);
  const shellPiece=(cx,sc)=>{const w=58*sc,h=14*sc;return `<path d="M${n(cx-w/2)} ${n(229-h)} Q${n(cx)} ${n(229+h*.6)} ${n(cx+w/2)} ${n(229-h)} Q${n(cx)} ${n(229-h*.15)} ${n(cx-w/2)} ${n(229-h)} Z" fill="#f6eddc" stroke="#c9b48e" stroke-width="1.5"/>`;};
  const white=(cx,f)=>{const w=46*(1-.25*f),h=30*(1-.2*f);let g=`<rect x="${n(cx-w/2)}" y="${n(230-h)}" width="${n(w)}" height="${n(h)}" rx="${n(6+6*f)}" fill="#fdfcf6" fill-opacity="${n(1-.25*f)}" stroke="#d8d1bd" stroke-width="1.5"/>`;
   for(let i=0;i<7&&f>0;i++){const a=animP_rnd(i+3),b=animP_rnd(i+17);g+=`<ellipse cx="${n(cx+(a-.5)*w*1.3)}" cy="${n(226-h-f*(6+b*22))}" rx="${n(3+b*3)}" ry="2.4" fill="#fbf8ec" fill-opacity="${n(.85*f)}"/>`;}return g;};
  svg+=shell?shellPiece(120,1-.45*k)+shellPiece(340,1):white(120,0)+white(340,k);
  if(shell&&k>0){const sc=1-.45*k;for(let j=0;j<15;j++){const born=j*.16;if(tt<born)continue;const f=((tt-born)/1.15)%1,x=120+(animP_rnd(j)-.5)*40*sc+Math.sin(f*9+j)*3,y=222-f*120;svg+=animP_bubble(x,y,(2.2+animP_rnd(j+9)*2.4)*(.7+.5*f));}
   for(let j=0;j<5;j++)svg+=animP_bubble(120+(j-2)*9*sc,224-14*sc,2.2);}
  // clock between the beakers: the shaded part is the time that has passed
  const a=k*Math.PI,cx=230,cy=148;svg+=`<circle cx="${cx}" cy="${cy}" r="25" fill="#fff" stroke="#7896a5" stroke-width="2"/>`;
  if(k>0)svg+=`<path d="M${cx} ${cy} L${cx} ${cy-25} A25 25 0 0 1 ${n(cx+25*Math.sin(a))} ${n(cy-25*Math.cos(a))} Z" fill="#f6d9a2"/>`;
  for(let i=0;i<12;i++){const b=i*Math.PI/6;svg+=`<line x1="${n(cx+20*Math.sin(b))}" y1="${n(cy-20*Math.cos(b))}" x2="${n(cx+24*Math.sin(b))}" y2="${n(cy-24*Math.cos(b))}" stroke="#7896a5" stroke-width="1.5"/>`;}
  svg+=`<line x1="${cx}" y1="${cy}" x2="${n(cx+19*Math.sin(a))}" y2="${n(cy-19*Math.cos(a))}" stroke="#244b5a" stroke-width="3" stroke-linecap="round"/>`+animP_t(after?'시간 지남':'처음',cx,cy+45,14,'#526d79');
  return svg;};
 return animP_wrap('acid-base',s,r,draw,after?2600:0);
}

// 물질의 성질이 달라지는 변화: cutting, burning on a heat-proof tile, ice melting in a dish.
function animP_burning(s,r){
 const after=s.stage==='after',kind=s.kind,n=animP_n;
 const sheet=(x,y,w,h,rot=0,dx=0,dy=0)=>`<g transform="translate(${n(dx)} ${n(dy)}) rotate(${n(rot)} ${n(x+w/2)} ${n(y+h/2)})"><rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="#fbf3df" stroke="#d6c193" stroke-width="1.5"/>${[.3,.5,.7].map(f=>`<line x1="${n(x+6)}" y1="${n(y+h*f)}" x2="${n(x+w-6)}" y2="${n(y+h*f)}" stroke="#e3d3ad" stroke-width="1.2"/>`).join('')}</g>`;
 const draw=p=>{
  const k=after?p:0;let svg=`<rect x="90" y="60" width="280" height="195" rx="10" fill="#eef4f7"/>`;
  if(kind==='paper'){
   const c=animP_seg(k,0,.6),sep=animP_ease(animP_seg(k,.6,1)),tip=105+100*c;
   if(sep>0)svg+=sheet(170,105,60,100,-6*sep,-22*sep,4*sep)+sheet(230,105,60,100,7*sep,22*sep,12*sep);
   else{svg+=sheet(170,105,120,100);if(c>0)svg+=`<line x1="230" y1="105" x2="230" y2="${n(tip)}" stroke="#8a7a5a" stroke-width="1.6"/>`;}
   if(k>0&&sep<1){const o=1-sep,open=.35+.3*Math.abs(Math.sin(k*38)),y=tip;svg+=`<g opacity="${n(o)}"><line x1="230" y1="${n(y-24)}" x2="${n(230-9*open)}" y2="${n(y+2)}" stroke="#8b9aa1" stroke-width="4" stroke-linecap="round"/><line x1="230" y1="${n(y-24)}" x2="${n(230+9*open)}" y2="${n(y+2)}" stroke="#a3b1b7" stroke-width="4" stroke-linecap="round"/><line x1="230" y1="${n(y-24)}" x2="222" y2="${n(y-40)}" stroke="#8b9aa1" stroke-width="3"/><line x1="230" y1="${n(y-24)}" x2="238" y2="${n(y-40)}" stroke="#8b9aa1" stroke-width="3"/><ellipse cx="218" cy="${n(y-50)}" rx="7" ry="9" fill="none" stroke="#e0793b" stroke-width="4"/><ellipse cx="242" cy="${n(y-50)}" rx="7" ry="9" fill="none" stroke="#e0793b" stroke-width="4"/></g>`;}
  }else if(kind==='burn'){
   svg+=`<rect x="130" y="88" width="200" height="155" rx="8" fill="#d9dfe2" stroke="#a9b6bc" stroke-width="2"/>`;
   for(let i=1;i<4;i++)svg+=`<line x1="${130+i*50}" y1="90" x2="${130+i*50}" y2="241" stroke="#c7cfd3" stroke-width="1"/>`;
   const b=animP_seg(k,0,.82),edge=290-120*b,fade=1-animP_seg(k,.8,.95),settle=animP_ease(animP_seg(k,.8,1));
   for(let j=0;j<16;j++){const x0=174+animP_rnd(j)*112,y0=120+animP_rnd(j+40)*88;if(x0<edge)continue;const x=animP_lerp(x0,230,.22*settle),y=animP_lerp(y0,175,.18*settle)+6*settle,sz=7+animP_rnd(j+7)*9;svg+=`<path d="M${n(x-sz)} ${n(y)} L${n(x-sz*.2)} ${n(y-sz*.7)} L${n(x+sz)} ${n(y-sz*.2)} L${n(x+sz*.4)} ${n(y+sz*.6)} Z" fill="${j%3?'#4b5053':'#6b7073'}"/>`;}
   if(edge>172){svg+=sheet(170,115,edge-170,100);if(k>0)svg+=`<rect x="${n(edge-5)}" y="115" width="7" height="100" fill="#3d2f24"/><line x1="${n(edge+2)}" y1="115" x2="${n(edge+2)}" y2="215" stroke="#f97316" stroke-width="2"/>`;}
   if(k>0&&fade>0)for(let i=0;i<4;i++){const h=(20+9*Math.sin(k*45+i*1.7))*fade;svg+=animP_flame(edge+1,128+i*27,h,8*fade);}
   for(let j=0;j<5&&k>0;j++){const f=(k*2.6+j*.2)%1,o=(1-f)*(k<.85?.5:.5*(1-animP_seg(k,.85,1))+.18);svg+=`<ellipse cx="${n(edge-10+j*6+Math.sin(f*6+j)*8)}" cy="${n(110-f*45)}" rx="${n(6+10*f)}" ry="${n(4+6*f)}" fill="#9aa3a8" fill-opacity="${n(o)}"/>`;}
   if(k>=.95)svg+=animP_t('재',230,236,15,'#173f50','middle','600');
  }else{
   const m=animP_ease(k),sz=80*(1-m);svg+=`<ellipse cx="230" cy="214" rx="104" ry="20" fill="#e3eef3" stroke="#9fb6c1" stroke-width="2"/>`;
   if(m>0)svg+=`<ellipse cx="230" cy="216" rx="${n(26+64*m)}" ry="${n(5+10*m)}" fill="#90c6e3" fill-opacity=".9"/><ellipse cx="${n(215-20*m)}" cy="${n(212+2*m)}" rx="${n(10+18*m)}" ry="2.5" fill="#fff" fill-opacity=".45"/>`;
   if(sz>3){const x0=230-sz/2,y0=214-sz,d=sz*.22,rr=4+(80-sz)/8;svg+=`<path d="M${n(x0)} ${n(y0)} L${n(x0+d)} ${n(y0-d*.6)} L${n(x0+sz+d)} ${n(y0-d*.6)} L${n(x0+sz)} ${n(y0)} Z" fill="#d8eef8"/><path d="M${n(x0+sz)} ${n(y0)} L${n(x0+sz+d)} ${n(y0-d*.6)} L${n(x0+sz+d)} ${n(y0+sz-d*.6)} L${n(x0+sz)} ${n(y0+sz)} Z" fill="#9fcfe5"/><rect x="${n(x0)}" y="${n(y0)}" width="${n(sz)}" height="${n(sz)}" rx="${n(rr)}" fill="#b6dbed" stroke="#8fc3db" stroke-width="1.5"/><line x1="${n(x0+sz*.18)}" y1="${n(y0+sz*.2)}" x2="${n(x0+sz*.18)}" y2="${n(y0+sz*.6)}" stroke="#fff" stroke-opacity=".8" stroke-width="3" stroke-linecap="round"/>`;
    if(k>0)for(let i=0;i<2;i++){const f=(k*3+i*.5)%1;svg+=`<ellipse cx="${n(x0+(i?sz+2:-2))}" cy="${n(y0+sz*.3+f*sz*.7)}" rx="2.5" ry="3.5" fill="#7fb9d6"/>`;}}
  }
  return svg+animP_t(after?'변화 뒤':'변화 전',230,285,16);};
 return animP_wrap('burning-conditions',s,r,draw,after?{paper:2200,burn:3000,ice:2600}[kind]:0);
}

// 효소 유무·가열: the sample (or water) goes into hydrogen peroxide, then bubbles and foam.
function animP_enzyme(s,r,{jar}){
 const after=s.stage==='after',sample=s.sample,fresh=sample==='fresh',water=sample==='water',n=animP_n;
 const piece=(x,y)=>`<rect x="${n(x-20)}" y="${n(y-13)}" width="40" height="26" rx="6" fill="${fresh?'#ecdca4':'#d3ad66'}" stroke="${fresh?'#c8b173':'#9c7537'}" stroke-width="1.5"/>`+(fresh?'':`<ellipse cx="${n(x-7)}" cy="${n(y-3)}" rx="5" ry="3" fill="#a67c3d" fill-opacity=".55"/><ellipse cx="${n(x+9)}" cy="${n(y+4)}" rx="4" ry="2.5" fill="#a67c3d" fill-opacity=".5"/>`);
 const draw=p=>{
  const k=after?p:0,move=animP_seg(k,0,.32),react=animP_seg(k,.32,1),pour=animP_ease(animP_seg(k,0,.22));
  const level=130+(water?9*animP_seg(k,.3,.5):0),top=230-level;let svg=jar(175,level,'#c4e0ec')+animP_t('과산화 수소수',230,38,15);
  svg+=`<ellipse cx="385" cy="232" rx="46" ry="9" fill="#e7eef1" stroke="#9db3bd" stroke-width="1.5"/>`+animP_t(water?'물':fresh?'생감자':'가열한 감자',385,262,15);
  if(water){
   const back=animP_ease(animP_seg(k,.6,.92)),t=pour*(1-back),lipX=animP_lerp(365,262,t),lipY=animP_lerp(192,52,t),ang=-80*animP_seg(k,.18,.3)*(1-back),fill=1-animP_seg(k,.28,.5);
   svg+=`<g transform="translate(${n(lipX)} ${n(lipY)}) rotate(${n(ang)})"><path d="M0 0 L3 38 Q3 40 6 40 H38 Q41 40 41 38 L44 0" fill="#eef6f9" fill-opacity=".7" stroke="#7896a5" stroke-width="1.6"/>${fill>0?`<rect x="3.5" y="${n(40-30*fill)}" width="37" height="${n(30*fill-1)}" fill="#bfe0ee"/>`:''}</g>`;
   if(k>.28&&k<.5)svg+=`<path d="M262 54 Q256 ${n((54+top)/2)} 258 ${n(top)}" fill="none" stroke="#9fd0e6" stroke-width="5" stroke-linecap="round"/>`;
  }else{
   const lift=animP_ease(animP_seg(move,0,.6)),fall=animP_seg(move,.6,1);let x=385,y=215;
   if(move>0){x=animP_lerp(385,230,lift);y=animP_lerp(215,70,lift)-Math.sin(Math.PI*lift)*28;if(fall>0)y=70+146*fall*fall;}
   svg+=piece(x,y);
   if(k>.28&&k<.5){const q=animP_seg(k,.28,.5);svg+=`<ellipse cx="230" cy="${top}" rx="${n(10+40*q)}" ry="${n(3+3*q)}" fill="none" stroke="#fff" stroke-opacity="${n(1-q)}" stroke-width="2"/>`;}
  }
  if(react>0&&!water){const tt=react*2,count=fresh?20:2,period=fresh?.9:2.4;
   for(let j=0;j<count;j++){const born=j*(fresh?.1:.9);if(tt<born)continue;const f=((tt-born)/period)%1,y=208-f*(208-top-6),x=230+(animP_rnd(j)-.5)*(fresh?36:16)+Math.sin(f*8+j)*3;svg+=animP_bubble(x,y,(fresh?2.4+animP_rnd(j+5)*2.6:2)*(.7+.5*f));}
   if(fresh){const foam=Math.floor(react*16);for(let j=0;j<foam;j++){const x=188+animP_rnd(j+30)*84,y=top-2-animP_rnd(j+60)*(4+react*10);svg+=`<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(5+animP_rnd(j)*4)}" ry="${n(4+animP_rnd(j+2)*2)}" fill="#fff" stroke="#bcd8e4" stroke-width="1"/>`;}}}
  const lab=!after?'처음 모습':k>=.999?(fresh?'산소 기포가 많이 나타남':'기포가 적거나 거의 없음'):'';
  return svg+(lab?animP_t(lab,230,288,16):'');};
 return animP_wrap('cell-membrane',s,r,draw,after?(fresh?3000:2600):0);
}

// 녹는점·끓는점: the heating curve is drawn up to the chosen part while the beaker and thermometer change.
function animP_meltBoil(s,r){
 const melt=s.kind==='melt',point=melt?(s.sample==='A'?20:40):(s.sample==='A'?80:100),stage={before:0,during:1,after:2}[s.step],m=s.amount==='two'?2:1,n=animP_n;
 const bounds=[[0,1],[1,4],[4,5]][stage].map(v=>v*m),T=t=>{const u=t/m;return u<=2?point-40+20*u:u<=4?point:point+20*(u-4);};
 const X=t=>160+t*27,Y=v=>238-(v+20)*1.2,yp=Y(point);
 const draw=p=>{
  const tip=animP_lerp(bounds[0],bounds[1],p),temp=T(tip);
  let svg=`<line x1="150" y1="242" x2="445" y2="242" stroke="#64748b" stroke-width="3"/><line x1="150" y1="242" x2="150" y2="52" stroke="#64748b" stroke-width="3"/>`+animP_t('온도',150,44,15)+animP_t('가열 시간 →',300,292,15);
  svg+=`<line x1="150" y1="${n(yp)}" x2="440" y2="${n(yp)}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5 5"/>`+animP_t(point+' ℃',156,yp-8,15,'#173f50','start');
  const knots=[0,2,4,5].map(v=>v*m).filter(t=>t<tip);
  const path=(a,b,color)=>{const pts=[a,...knots.filter(t=>t>a&&t<b),b].map(t=>n(X(t))+','+n(Y(T(t)))).join(' ');return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`;};
  if(bounds[0]>0)svg+=path(0,bounds[0],'#83abb5');if(tip>bounds[0])svg+=path(bounds[0],tip,'#d18b37');
  svg+=`<circle cx="${n(X(tip))}" cy="${n(Y(temp))}" r="6" fill="#d18b37" stroke="#fff" stroke-width="2"/>`+animP_t('현재 '+Math.round(temp)+' ℃',345,40,16);
  // beaker on a hot plate with a thermometer
  const u=tip/m,during=Math.max(0,Math.min(1,(u-2)/2)),glow=['#f2b07c','#ee8f55'][p<1?1:0];
  svg+=`<rect x="14" y="246" width="100" height="12" rx="4" fill="#8a98a0"/><rect x="24" y="242" width="80" height="5" rx="2" fill="${glow}"/>`;
  const bx=26,bw=76,bt=120,bb=240;let inside='';
  if(melt){const liquidH=u<2?0:u<4?during*46:46,solid=u<2?1:u<4?1-during:0;
   if(liquidH>0)inside+=`<rect x="${bx+3}" y="${n(bb-3-liquidH)}" width="${bw-6}" height="${n(liquidH)}" fill="#cfe4ee"/>`;
   if(solid>0){const w=46*Math.sqrt(solid)+4,h=40*Math.sqrt(solid)+4;inside+=`<path d="M${n(64-w/2)} ${n(bb-3)} L${n(64-w/2+3)} ${n(bb-3-h)} L${n(64+w/2-4)} ${n(bb-3-h-3)} L${n(64+w/2)} ${n(bb-3)} Z" fill="#e9eef2" stroke="#a7b6bf" stroke-width="1.5"/><line x1="${n(64-w/4)}" y1="${n(bb-6)}" x2="${n(64-w/6)}" y2="${n(bb-h)}" stroke="#c4d0d6" stroke-width="1.2"/>`;}
  }else{const lev=u<2?60:u<4?60-during*42:0;
   if(lev>0)inside+=`<rect x="${bx+3}" y="${n(bb-3-lev)}" width="${bw-6}" height="${n(lev)}" fill="#cfe4ee"/>`;
   if(u>2&&u<4)for(let j=0;j<8;j++){const f=((p*4+j*.13)%1);inside+=animP_bubble(36+animP_rnd(j)*50,bb-6-f*(lev-6),2+animP_rnd(j+4)*2);}
   if(u>2)for(let j=0;j<(u<4?4:9);j++){const f=(p*2+j*.21)%1;inside+=`<ellipse cx="${n(34+animP_rnd(j+8)*60)}" cy="${n((u<4?bb-lev-8:bb-12)-f*(u<4?50:100))}" rx="2.4" ry="2.4" fill="#9fb7c4" fill-opacity="${n(.9-.6*f)}"/>`;}
  }
  svg+=`<path d="M${bx} ${bt} L${bx+2} ${bb-4} Q${bx+2} ${bb} ${bx+8} ${bb} H${bx+bw-8} Q${bx+bw-2} ${bb} ${bx+bw-2} ${bb-4} L${bx+bw} ${bt}" fill="#f4f9fb" fill-opacity=".5" stroke="#7896a5" stroke-width="2"/>`+inside;
  const col=Math.max(4,(temp+20)/140*130);svg+=`<rect x="80" y="70" width="10" height="164" rx="5" fill="#fff" stroke="#7896a5" stroke-width="1.5"/><rect x="82.5" y="${n(230-col)}" width="5" height="${n(col)}" rx="2" fill="#d9534f"/><ellipse cx="85" cy="233" rx="7" ry="7" fill="#d9534f"/>`;
  svg+=animP_t(melt?(u<2?'고체':u<4?'고체+액체':'액체'):(u<2?'액체':u<4?'끓는 중':'기체'),64,282,15);
  return svg;};
 // The lab page redraws and animates this picture itself (density-buoyancy/phase-heating.js),
 // so no frame loop here: this static picture is only a fallback.
 return animP_wrap('density-buoyancy',s,r,draw,0);
}

// 입자·상태 변화·기체 조건: particles move (20 / 15 circles kept), the heating curve grows, the piston slides.
function animP_particles(s,r){
 const n=animP_n;
 if(s.kind==='phase'){
  const pos=(ph,i)=>{const gas=ph==='gas',solid=ph==='solid';return gas?[85+((i*67+i*i*17)%285),60+((i*41+i*i*7)%170)]:[125+(i%5)*40+(solid?0:(i%2)*8),solid?95+Math.floor(i/5)*37:130+Math.floor(i/5)*27];};
  const draw=(p,prev)=>{
   const from=prev&&prev.kind==='phase'&&prev.phase!==s.phase?prev.phase:null,e=from?animP_ease(animP_seg(p,0,.6)):1;
   let svg=`<rect x="65" y="40" width="330" height="215" rx="8" fill="#edf4f7" stroke="#9fb6c1" stroke-width="2"/>`;
   for(let i=0;i<20;i++){const [fx,fy]=pos(s.phase,i);let x=fx,y=fy,vx=0,vy=0;
    if(s.phase==='gas'){const a=animP_rnd(i)*Math.PI*2,sp=120;vx=Math.cos(a);vy=Math.sin(a);x=animP_fold(fx-vx*sp*2.4*(1-p),78,382);y=animP_fold(fy-vy*sp*2.4*(1-p),53,242);}
    else if(s.phase==='liquid'){const w=Math.sin(Math.PI*p)*7;x+=w*Math.sin(2*Math.PI*(3+i%3)*p+i);y+=w*.6*Math.cos(2*Math.PI*(2+i%2)*p+i*1.3);}
    else{const a=animP_rnd(i+5)*Math.PI*2,w=2.6*Math.sin(2*Math.PI*(6+i%4)*p);x+=w*Math.cos(a);y+=w*Math.sin(a);}
    if(from){const [ox,oy]=pos(from,i);x=animP_lerp(ox,x,e);y=animP_lerp(oy,y,e);}
    if(s.phase==='gas'){const a=animP_rnd(i)*Math.PI*2;svg+=`<line x1="${n(x-Math.cos(a)*9)}" y1="${n(y-Math.sin(a)*9)}" x2="${n(x-Math.cos(a)*18)}" y2="${n(y-Math.sin(a)*18)}" stroke="#c48b47" stroke-width="2" stroke-linecap="round"/>`;}
    svg+=`<circle cx="${n(x)}" cy="${n(y)}" r="7" fill="#508f9c"/>`;}
   return svg+animP_t({solid:'고체',liquid:'액체',gas:'기체'}[s.phase],230,30,16,'#173f50','middle','600')+animP_t('입자 수·종류·크기는 같음',230,287,16);};
  return animP_wrap('diffusion',s,r,draw,2400);
 }
 if(s.kind==='curve'){
  const pts=[[70,240],[125,190],[185,190],[245,80],[305,80]],i=+s.step;
  const draw=p=>{
   let svg=`<line x1="55" y1="260" x2="320" y2="260" stroke="#64748b" stroke-width="3"/><line x1="55" y1="260" x2="55" y2="35" stroke="#64748b" stroke-width="3"/>`;
   for(const [y,t] of [[190,'0 ℃'],[80,'100 ℃']])svg+=`<line x1="55" y1="${y}" x2="315" y2="${y}" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="4 5"/>`+animP_t(t,28,y+5,14);
   for(let j=0;j<i;j++)svg+=`<line x1="${pts[j][0]}" y1="${pts[j][1]}" x2="${pts[j+1][0]}" y2="${pts[j+1][1]}" stroke="#80a8b3" stroke-width="5" stroke-linecap="round"/>`;
   const tx=animP_lerp(pts[i][0],pts[i+1][0],p),ty=animP_lerp(pts[i][1],pts[i+1][1],p);
   svg+=`<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${n(tx)}" y2="${n(ty)}" stroke="#dc8a30" stroke-width="5" stroke-linecap="round"/><circle cx="${n(tx)}" cy="${n(ty)}" r="6" fill="#dc8a30" stroke="#fff" stroke-width="2"/>`+animP_t('가열 시간 →',190,292,15);
   // beaker with ice / water on a hot plate
   const temp=(190-ty)/110*100,bx=345,bw=90,bb=240;svg+=`<rect x="335" y="246" width="110" height="12" rx="4" fill="#8a98a0"/><rect x="347" y="242" width="86" height="5" rx="2" fill="#f2a46b"/>`;
   const melted=i===0?0:i===1?p:1,lev=i<3?14+44*melted:58-24*p;
   if(melted>0)svg+=`<rect x="${bx+3}" y="${n(bb-3-lev)}" width="${bw-6}" height="${n(lev)}" fill="#cfe4ee"/>`;
   if(i<=1){const sz=24*(1-.85*melted);if(sz>3)for(let j=0;j<3;j++){const x=bx+12+j*24,y=bb-3-sz-(j===1?sz*.9:0);svg+=`<rect x="${n(x)}" y="${n(y)}" width="${n(sz)}" height="${n(sz)}" rx="${n(3+(1-sz/24)*5)}" fill="#e3f3fb" stroke="#8fc3db" stroke-width="1.5"/>`;}}
   if(i===3){for(let j=0;j<8;j++){const f=(p*4+j*.13)%1;svg+=animP_bubble(bx+10+animP_rnd(j)*70,bb-6-f*(lev-8),2+animP_rnd(j+3)*2);}for(let j=0;j<4;j++){const f=(p*2+j*.25)%1;svg+=`<path d="M${n(bx+20+j*16)} ${n(bb-lev-10-f*40)} q6 -8 0 -16" fill="none" stroke="#9fb7c4" stroke-opacity="${n(.9-.7*f)}" stroke-width="2.5" stroke-linecap="round"/>`;}}
   svg+=`<path d="M${bx} 130 L${bx+2} ${bb-4} Q${bx+2} ${bb} ${bx+8} ${bb} H${bx+bw-8} Q${bx+bw-2} ${bb} ${bx+bw-2} ${bb-4} L${bx+bw} 130" fill="#f4f9fb" fill-opacity=".45" stroke="#7896a5" stroke-width="2"/>`;
   const col=Math.max(4,(temp+20)/140*120);svg+=`<rect x="417" y="85" width="9" height="145" rx="4.5" fill="#fff" stroke="#7896a5" stroke-width="1.5"/><rect x="419.2" y="${n(226-col)}" width="4.6" height="${n(col)}" rx="2" fill="#d9534f"/>`;
   return svg;};
  return animP_wrap('diffusion',s,r,draw,1800);
 }
 const thermal=s.gas==='temperature',order={low:0,normal:1,high:2}[s.setting],hOf=st=>(st.gas==='temperature'?[90,130,170]:[170,130,90])[{low:0,normal:1,high:2}[st.setting]],height=hOf(s),top=235-height;
 const draw=(p,prev)=>{
  const from=prev&&prev.kind==='gas'&&prev.gas===s.gas?hOf(prev):height,h=animP_lerp(from,height,animP_ease(animP_seg(p,0,.6))),tp=235-h;
  let svg=`<rect x="145" y="45" width="170" height="195" rx="4" fill="#edf4f7" stroke="#8aa3ae" stroke-width="3"/>`;
  svg+=`<rect x="140" y="242" width="180" height="12" rx="4" fill="#8a98a0"/><rect x="152" y="238" width="156" height="5" rx="2" fill="${thermal?['#8cc4dd','#f2b07c','#ea6a3c'][order]:'#b9c4c9'}"/>`;
  svg+=`<rect x="150" y="${n(tp)}" width="160" height="8" rx="2" fill="#607c88"/>`;
  const weights=thermal?1:order+1;for(let w=0;w<weights;w++)svg+=`<rect x="${200}" y="${n(tp-14*(w+1))}" width="60" height="13" rx="3" fill="#8b6f4e" stroke="#6e573c" stroke-width="1"/>`;
  const sp=thermal?[.25,.4,.58][order]:.4;
  for(let i=0;i<15;i++){const fx=165+((i*43+i*i*11)%130),fy=top+24+((i*29+i*i*7)%(height-35)),nx=(fx-160)/140,ny=(fy-(top+12))/(232-top-12),a=animP_rnd(i+11)*Math.PI*2,vx=Math.cos(a),vy=Math.sin(a);
   const ux=animP_fold(nx-vx*sp*2.2*(1-p),0,1),uy=animP_fold(ny-vy*sp*2.2*(1-p),0,1),x=160+ux*140,y=tp+12+uy*(232-tp-12),len=thermal?6+order*5:10;
   svg+=`<line x1="${n(x-vx*6)}" y1="${n(y-vy*6)}" x2="${n(x-vx*(6+len))}" y2="${n(y-vy*(6+len))}" stroke="#c48b47" stroke-width="2" stroke-linecap="round"/><circle cx="${n(x)}" cy="${n(y)}" r="4" fill="#4d91a0"/>`;}
  return svg+animP_t(thermal?'압력 일정 · 온도 '+{low:'낮음',normal:'중간',high:'높음'}[s.setting]:'온도 일정 · 바깥 압력 '+{low:'낮음',normal:'중간',high:'높음'}[s.setting],230,285,16);};
 return animP_wrap('diffusion',s,r,draw,2200);
}

// 자석과 코일의 상대 운동: the magnet or coil slides; the needle swings only while it moves.
function animP_induction(s,r){
 const moving=s.moving!=='none',inward=s.direction==='in',fast=s.speed==='fast',N=s.pole==='N',n=animP_n;
 const maxA=moving?((inward===N)?1:-1)*(fast?50:25):0,moveFrac=fast?.6:.82;
 const draw=p=>{
  const u=moving?animP_seg(p,0,moveFrac):1,d=moving?(inward?1-u:u):0;
  const mx=s.moving==='magnet'?40+(1-d)*100:140,dx=s.moving==='coil'?d*60:0;
  let svg=animP_t(moving?(inward?'서로 가까워짐':'서로 멀어짐'):'상대 운동 없음',230,40,16);
  svg+=`<path data-induction-wire d="M${n(200+dx)} 165 V290 H352 V274 M${n(296+dx)} 165 V178 H442 V290 H388 V274" fill="none" stroke="#64818d" stroke-width="3"/>`;
  for(let i=0;i<7;i++){const cx=n(200+i*16+dx);svg+=`<path d="M${cx} 85 A9 40 0 0 0 ${cx} 165" fill="none" stroke="#9a6e3a" stroke-width="4"/>`;}
  const near=N?'#cc4f4b':'#3f74b5',far=N?'#3f74b5':'#cc4f4b';
  svg+=`<rect x="${n(mx)}" y="105" width="45" height="40" fill="${far}"/><rect x="${n(mx+45)}" y="105" width="45" height="40" fill="${near}"/><rect x="${n(mx)}" y="105" width="90" height="40" fill="none" stroke="#3b4a52" stroke-width="1.5"/>`;
  for(let i=0;i<7;i++){const cx=n(200+i*16+dx);svg+=`<path d="M${cx} 85 A9 40 0 0 1 ${cx} 165" fill="none" stroke="#c88b45" stroke-width="4"/>`;}
  svg+=animP_t(N?'S':'N',mx+22,132,18,'#fff','middle','700')+`<text x="${n(mx+67)}" y="132" fill="#fff" font-size="18" text-anchor="middle" font-weight="700" stroke="${near}" stroke-width="3" paint-order="stroke">${s.pole}</text>`;
  if(moving){const dir=(s.moving==='magnet')===inward?1:-1,ax=s.moving==='magnet'?mx+45:248+dx;svg+=animP_arrow(ax-dir*28,72,ax+dir*28,72,'#246874',4);}
  const a=moving&&u>0&&u<1?maxA*Math.sqrt(Math.sin(Math.PI*u)):0,px=370,py=262,R=44;
  svg+=`<circle cx="370" cy="232" r="42" fill="#f4f8fa" stroke="#64818d" stroke-width="3"/><path d="M${n(px-46*Math.sin(.87))} ${n(py-46*Math.cos(.87))} A46 46 0 0 1 ${n(px+46*Math.sin(.87))} ${n(py-46*Math.cos(.87))}" fill="none" stroke="#9fb3bc" stroke-width="1.5"/>`;
  for(const t of [-50,-25,0,25,50]){const b=t*Math.PI/180;svg+=`<line x1="${n(px+42*Math.sin(b))}" y1="${n(py-42*Math.cos(b))}" x2="${n(px+49*Math.sin(b))}" y2="${n(py-49*Math.cos(b))}" stroke="#64818d" stroke-width="${t?1.5:2.5}"/>`;}
  if(moving&&(u>=.5||p>=1)){const b=maxA*Math.PI/180;svg+=`<line x1="${px}" y1="${py}" x2="${n(px+R*Math.sin(b))}" y2="${n(py-R*Math.cos(b))}" stroke="#d97706" stroke-width="2" stroke-dasharray="4 3" stroke-opacity=".8"/>`;}
  const b=a*Math.PI/180;svg+=`<line x1="${px}" y1="${py}" x2="${n(px+R*Math.sin(b))}" y2="${n(py-R*Math.cos(b))}" stroke="#b42318" stroke-width="3" stroke-linecap="round"/><circle cx="${px}" cy="${py}" r="4" fill="#3b4a52"/><rect x="346" y="270" width="10" height="7" fill="#3b4a52"/><rect x="384" y="270" width="10" height="7" fill="#3b4a52"/>`;
  return svg+animP_t('검류계',300,238,15);};
 return animP_wrap('energy-conversion',s,r,draw,moving?(fast?1600:2800):0);
}

// 같은 족 원소: sodium and potassium dart about on water (potassium faster, lilac flame); noble gas particles drift.
function animP_group(s,r,{jar}){
 const alkali=s.group==='alkali',after=s.stage==='after',n=animP_n;
 const draw=p=>{
  let svg='';
  if(alkali){
   svg+=jar(65,130,'#c0ddeb')+jar(285,130,'#c0ddeb')+animP_t('나트륨',120,35,16)+animP_t('칼륨',340,35,16)+animP_t('물',120,262,15)+animP_t('물',340,262,15);
   for(const [cx,K] of [[120,0],[340,1]]){
    if(!after){const drop=animP_ease(p),y=animP_lerp(40,100,drop);svg+=`<rect x="${cx-12}" y="${n(y-6)}" width="24" height="12" rx="2" fill="#b5bbc0" stroke="#8a9399" stroke-width="1"/>`;if(p>.8&&p<1){const q=animP_seg(p,.8,1);svg+=`<ellipse cx="${cx}" cy="100" rx="${n(14+26*q)}" ry="${n(2+2*q)}" fill="none" stroke="#fff" stroke-opacity="${n(1-q)}" stroke-width="2"/>`;}continue;}
    const t=p*3,x=cx+(K?30:20)*Math.sin(t*(K?6.3:3.4)+K)*Math.min(1,t*1.5),sz=(1-(K?.7:.5)*p)*9;
    for(let j=0;j<(K?7:4);j++){const f=(t*(K?1.8:1.2)+j/(K?7:4))%1;svg+=`<ellipse cx="${n(x+(animP_rnd(j)-.5)*28*f)}" cy="100" rx="${n(4+18*f)}" ry="${n(1+2*f)}" fill="none" stroke="#fff" stroke-opacity="${n(.8*(1-f))}" stroke-width="1.5"/>`;}
    for(let j=0;j<(K?12:8);j++){const f=(t*(K?2.2:1.5)+j*.17)%1;svg+=animP_bubble(x+(animP_rnd(j+K*20)-.5)*24,106+sz-f*12,1.6+animP_rnd(j+3)*1.6);}
    svg+=`<ellipse cx="${n(x)}" cy="${n(100-sz*.4)}" rx="${n(sz)}" ry="${n(sz*.8)}" fill="#c3c9ce" stroke="#8a9399" stroke-width="1"/><ellipse cx="${n(x-sz*.35)}" cy="${n(100-sz*.7)}" rx="${n(sz*.3)}" ry="${n(sz*.2)}" fill="#fff" fill-opacity=".8"/>`;
    if(K)svg+=animP_flame(x,100-sz*1.1,22+6*Math.sin(t*25),8,'#b98ae6','#ead9fb');
    else for(let j=0;j<3;j++){const f=(t*1.4+j/3)%1;svg+=`<ellipse cx="${n(x+(j-1)*8*f)}" cy="${n(92-f*20)}" rx="1.8" ry="1.8" fill="#9ccde3" fill-opacity="${n(1-f)}"/>`;}
   }
  }else{
   for(const x of [65,285]){svg+=`<rect x="${x}" y="60" width="110" height="180" rx="6" fill="#f2f7f9" stroke="#90a9b4" stroke-width="2"/><rect x="${x-4}" y="54" width="118" height="8" rx="3" fill="#7a939d"/><line x1="${x+12}" y1="72" x2="${x+12}" y2="226" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-opacity=".9"/>`;
    for(let i=0;i<9;i++){const fx=x+15+(i*37+i*i*13)%80,fy=80+(i*53+i*i*11)%135,a=animP_rnd(i+x)*Math.PI*2,sp=110*2.2*(1-p);svg+=`<circle cx="${n(animP_fold(fx-Math.cos(a)*sp,x+8,x+102))}" cy="${n(animP_fold(fy-Math.sin(a)*sp,68,232))}" r="3.5" fill="#91adb9"/>`;}}
   svg+=animP_t('기체 · 무색',120,265,15)+animP_t('기체 · 무색',340,265,15)+animP_t('헬륨',120,35,16)+animP_t('네온',340,35,16)+animP_t('점은 눈에 보이지 않는 입자 모형',230,296,14,'#526d79');
  }
  return svg;};
 return animP_wrap('flame-ions',s,r,draw,alkali?(after?3000:900):2200);
}

// 물체를 밀고 당길 때: a child pushes or pulls the box along the floor; the start spot stays marked.
function animP_push(s,r){
 const after=s.stage==='after',push=s.direction==='push',n=animP_n,end=push?300:90;
 const person=(px,lean,hand,stride)=>{const hx=px+lean,sw=Math.sin(stride)*7;return `<line x1="${n(px)}" y1="203" x2="${n(px-6+sw)}" y2="233" stroke="#344a5e" stroke-width="6" stroke-linecap="round"/><line x1="${n(px)}" y1="203" x2="${n(px+6-sw)}" y2="233" stroke="#344a5e" stroke-width="6" stroke-linecap="round"/><line x1="${n(px)}" y1="203" x2="${n(hx)}" y2="174" stroke="#3b82a6" stroke-width="9" stroke-linecap="round"/><line x1="${n(hx)}" y1="180" x2="${n(hand[0])}" y2="${n(hand[1])}" stroke="#f2c9a0" stroke-width="5" stroke-linecap="round"/><circle cx="${n(hx+lean*.3)}" cy="160" r="11" fill="#f2c9a0" stroke="#d9a877" stroke-width="1.5"/><path d="M${n(hx+lean*.3-11)} 157 Q${n(hx+lean*.3)} 143 ${n(hx+lean*.3+11)} 157" fill="#5b4636"/>`;};
 const draw=p=>{
  const k=after?p:0,go=animP_ease(animP_seg(k,.3,1)),bx=animP_lerp(195,end,go),walk=k*26;
  let svg=`<line x1="20" y1="235" x2="440" y2="235" stroke="#657a83" stroke-width="5"/>`;for(let x=30;x<440;x+=22)svg+=`<line x1="${x}" y1="238" x2="${x-8}" y2="246" stroke="#a5b4bb" stroke-width="2"/>`;
  if(k>.3)svg+=`<rect x="195" y="160" width="70" height="70" rx="4" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6 5"/>`+animP_t('처음 자리',230,264,14,'#526d79');
  if(k>.3&&k<1)for(let i=0;i<3;i++){const sx=push?bx-14-i*3:bx+84+i*3;svg+=`<line x1="${n(sx)}" y1="${172+i*20}" x2="${n(sx+(push?-24:24))}" y2="${172+i*20}" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" stroke-opacity=".8"/>`;}
  svg+=`<rect x="${n(bx)}" y="160" width="70" height="70" rx="4" fill="#cba57f" stroke="#9c7a55" stroke-width="2"/><line x1="${n(bx)}" y1="183" x2="${n(bx+70)}" y2="183" stroke="#a9845d" stroke-width="2"/><line x1="${n(bx)}" y1="207" x2="${n(bx+70)}" y2="207" stroke="#a9845d" stroke-width="2"/>`;
  if(push){const reach=animP_ease(animP_seg(k,0,.3)),px=k<=.3?animP_lerp(145,bx-24,reach):bx-24;svg+=person(px,k>0?7:0,[k>0?animP_lerp(px+14,bx,reach):px+12,k>0?188:200],k>0&&k<1?walk:0);}
  else{const tight=animP_ease(animP_seg(k,0,.3)),px=k<=.3?animP_lerp(150,135,tight):bx-60,hand=[px+18,190];
   svg+=`<path d="M${n(hand[0])} ${hand[1]} Q${n((hand[0]+bx)/2)} ${n(196+14*(1-tight))} ${n(bx)} 196" fill="none" stroke="#8b6f4e" stroke-width="3"/>`+person(px,k>0?-6:0,hand,k>0&&k<1?walk:0);}
  svg+=k>.3?animP_arrow(push?bx+5:bx+65,135,push?bx+65:bx+5,135,'#246874',6):animP_t('힘을 가하기 전',230,115,18,'#246874');
  return svg+animP_t('같은 바닥 위의 상자',230,290,16);};
 return animP_wrap('lever-balance',s,r,draw,after?2400:0);
}

// 렌즈를 지나는 빛과 물체 보기: rays travel and bend; in the dark box the lamp lights the doll, then light reaches the eye.
function animP_lens(s,r){
 const n=animP_n;
 if(s.kind==='box'){
  const lit=s.setting==='lit';
  const draw=(p,prev)=>{
   const on=lit?animP_seg(p,0,.15):(prev&&prev.kind==='box'&&prev.setting==='lit'?1-p:0),ray1=lit?animP_seg(p,.15,.45):0,seen=lit?animP_seg(p,.42,.52):on,ray2=lit?animP_seg(p,.55,.88):0;
   let svg=`<rect x="50" y="55" width="320" height="200" rx="6" fill="#243743"/><rect x="364" y="111" width="12" height="24" fill="#f4f8fa"/>`;
   svg+=`<rect x="72" y="62" width="16" height="12" fill="#56636a"/>${on>0?`<circle cx="80" cy="90" r="32" fill="#f6cf6e" fill-opacity="${n(.22*on)}"/>`:''}<circle cx="80" cy="90" r="14" fill="${on>.5?'#f6cf6e':'#5f6b72'}" stroke="#8a969c" stroke-width="1.5"/>`;
   svg+=`<g><rect x="210" y="160" width="45" height="38" rx="10" fill="#33495a"/><circle cx="232" cy="146" r="15" fill="#33495a"/>`;
   if(seen>0)svg+=`<g opacity="${n(seen)}"><rect x="210" y="160" width="45" height="38" rx="10" fill="#eea272"/><circle cx="232" cy="146" r="15" fill="#f3b98c"/><circle cx="227" cy="144" r="2" fill="#3b2a20"/><circle cx="237" cy="144" r="2" fill="#3b2a20"/><path d="M227 151 Q232 155 237 151" fill="none" stroke="#3b2a20" stroke-width="1.5"/></g>`;
   else svg+=`<rect x="210" y="160" width="45" height="38" rx="10" fill="none" stroke="#4d6676" stroke-width="1.5" stroke-dasharray="4 4"/>`;
   svg+=`</g>`;
   if(ray1>0)svg+=ray1<1?`<line x1="92" y1="96" x2="${n(animP_lerp(92,222,ray1))}" y2="${n(animP_lerp(96,152,ray1))}" stroke="#f5cc69" stroke-width="3" stroke-linecap="round"/>`:animP_arrow(92,96,222,152,'#f5cc69',3);
   if(ray2>0)svg+=ray2<1?`<line x1="258" y1="158" x2="${n(animP_lerp(258,404,ray2))}" y2="${n(animP_lerp(158,121,ray2))}" stroke="#f5cc69" stroke-width="3" stroke-linecap="round"/>`:animP_arrow(258,158,404,121,'#f5cc69',3);
   svg+=`<path d="M402 120 Q420 104 440 120 Q420 136 402 120 Z" fill="#fff" stroke="#5b7480" stroke-width="2"/><circle cx="419" cy="120" r="7" fill="#4b7f8c"/><circle cx="419" cy="120" r="3" fill="#13232b"/>`;
   svg+=animP_t('광원',80,128,14,'#e8f0f3')+animP_t('물체',232,220,14,'#e8f0f3')+animP_t('눈',421,155,14);
   const lab=lit?(p>=.95?'물체에서 온 빛이 눈에 들어옴':''):'물체가 있어도 보이지 않음';
   return svg+(lab?animP_t(lab,230,285,16):'');};
  return animP_wrap('light-shadow',s,r,draw,lit?2600:700);
 }
 const setting=s.setting;
 const draw=p=>{
  const X=animP_lerp(40,405,p);
  let svg=`<line x1="20" y1="150" x2="445" y2="150" stroke="#b6c4cb" stroke-width="1.5" stroke-dasharray="6 6"/><rect x="14" y="78" width="22" height="144" rx="4" fill="#4a5a63"/>`;
  for(const y of [95,150,205])svg+=`<rect x="33" y="${y-4}" width="5" height="8" fill="#ffe7a3"/>`;
  if(setting==='convex')svg+=`<ellipse cx="220" cy="150" rx="22" ry="100" fill="#bdddea" fill-opacity=".85" stroke="#7fb2c6" stroke-width="2"/><path d="M212 80 Q206 150 212 220" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3"/>`;
  if(setting==='concave')svg+=`<path d="M195 50 Q225 150 195 250 L245 250 Q215 150 245 50 Z" fill="#bdddea" fill-opacity=".85" stroke="#7fb2c6" stroke-width="2"/>`;
  for(const y of [95,150,205]){const end=setting==='convex'?150:setting==='concave'?150+(y-150)*1.8:y,x1=Math.min(X,220);
   svg+=`<line x1="40" y1="${y}" x2="${n(x1)}" y2="${y}" stroke="#d79c22" stroke-width="3" stroke-linecap="round"/>`;
   if(X<=220)svg+=animP_arrow(x1-1,y,x1+8,y,'#d79c22',3);
   else if(X<405){const ex=X,ey=y+(end-y)*(ex-220)/185,L=Math.hypot(185,end-y),ux=185/L,uy=(end-y)/L;svg+=`<line x1="220" y1="${y}" x2="${n(ex)}" y2="${n(ey)}" stroke="#d79c22" stroke-width="3" stroke-linecap="round"/>`+animP_arrow(ex-ux*2,ey-uy*2,ex+ux*8,ey+uy*8,'#d79c22',3);}else svg+=animP_arrow(220,y,405,end,'#d79c22',3);}
  if(setting==='convex'&&p>=1)svg+=`<circle cx="405" cy="150" r="5" fill="#c2410c"/>`+animP_t('초점',405,178,14,'#9a3412');
  return svg+animP_t('평행하게 들어오는 빛',130,285,16);};
 return animP_wrap('light-shadow',s,r,draw,1800);
}

// 기체 반응의 부피 관계: bars shrink and grow with molecule pictures; numbers appear when it settles.
function animP_gasVolume(s,r){
 const after=s.stage==='after',scale=s.trial==='double'?2:1,excess=s.trial==='excess',n=animP_n;
 const start=[excess?3:2*scale,scale,0],end=after?[excess?1:0,0,2*scale]:start;
 const molecule=(i,x,y)=>i===0?`<circle cx="${x-5}" cy="${y}" r="7" fill="#fff" stroke="#7b8f99" stroke-width="1.3"/><circle cx="${x+5}" cy="${y}" r="7" fill="#fff" stroke="#7b8f99" stroke-width="1.3"/>`:i===1?`<circle cx="${x-6}" cy="${y}" r="8" fill="#e0675c" stroke="#a8433a" stroke-width="1.3"/><circle cx="${x+6}" cy="${y}" r="8" fill="#e0675c" stroke="#a8433a" stroke-width="1.3"/>`:`<circle cx="${x-9}" cy="${y+5}" r="5" fill="#fff" stroke="#7b8f99" stroke-width="1.3"/><circle cx="${x+9}" cy="${y+5}" r="5" fill="#fff" stroke="#7b8f99" stroke-width="1.3"/><circle cx="${x}" cy="${y-1}" r="8" fill="#e0675c" stroke="#a8433a" stroke-width="1.3"/>`;
 const draw=p=>{
  const e=animP_ease(p);let svg=`<line x1="45" y1="245" x2="430" y2="245" stroke="#64748b" stroke-width="3"/>`+animP_t('상대 부피',48,40,14,'#526d79','start');
  ['수소','산소','수증기'].forEach((name,i)=>{const x=70+i*150,amt=after?animP_lerp(start[i],end[i],e):start[i]*e,h=amt*40;
   if(h>.5)svg+=`<rect x="${x}" y="${n(245-h)}" width="65" height="${n(h)}" rx="4" fill="${['#cfe9f2','#f8d5cf','#d6e2f5'][i]}" stroke="${['#7fb3c8','#d08c82','#8ea5cf'][i]}" stroke-width="1.5"/>`;
   for(let j=0;j<4;j++)if(h>=40*j+30)svg+=molecule(i,x+32,245-20-40*j);
   svg+=animP_t(name,x+32,280,16);if(p>=1)svg+=animP_t(String(end[i]),x+32,230-end[i]*40,16,'#173f50','middle','600');});
  return svg;};
 return animP_wrap('mass-ratio',s,r,draw,1800);
}
if(typeof window!=='undefined')window.scienceCoreExtensions=scienceCoreFactory;
if(typeof module!=='undefined')module.exports=scienceCoreFactory;
