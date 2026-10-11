// Student-facing instructions are authored separately from the audit registry.
// Source IDs, completion verdicts and implementation boundaries stay in audit files.
const intros={
 'insulation-lab':'물의 처음 온도와 양을 같게 하고, 단열재와 두께를 바꾸며 온도 변화를 비교하세요.',
 'doppler-lab':'음원의 속력과 진동수를 바꾸며 파면 간격과 수신 진동수를 비교하세요.',
 'ride-acceleration':'센서의 부착 방향과 위치를 정하고, 놀이기구의 움직임을 시간 그래프와 비교하세요.',
 'dna-replication':'상보적인 뉴클레오타이드를 연결하며 선도 가닥과 지연 가닥이 만들어지는 과정을 비교하세요.',
 'protein-synthesis':'DNA에서 mRNA를 만들고, 코돈에 맞는 아미노산을 연결하세요. 염기서열이 바뀌면 사슬이 어떻게 달라지는지 비교해 보세요.',
 'karyotype-lab':'크기·동원체 위치·띠 무늬를 비교해 염색체의 짝을 찾고, 시료별 수와 배열을 비교하세요.',
 'antibiotic-disc':'같은 조건에서 대조군과 추출액을 비교하고, 디스크 주변의 억제 구역을 자로 측정하세요.',
 'water-wave-tank':'파장과 수심을 바꾸며 파의 속력, 부표와 물 입자의 움직임을 비교하세요.',
 'silver-mirror':'앙금의 생성과 용해를 관찰한 뒤, 포도당과 물을 넣은 두 바이알의 벽을 비교하세요.',
 'nylon-interface':'두 용액의 경계에서 생긴 막을 감아 올리고, 단위체를 연결하며 아마이드 결합을 확인하세요.',
 'habitable-orbits':'중심별의 온도·반지름과 행성의 궤도를 바꾸며 복사량과 생명가능 지대를 비교하세요.',
 'organic-builder':'탄소·수소·산소를 연결해 알코올·알데하이드·카복실산을 만들고, 분자식과 액성을 비교하세요.',
 'dna-structure':'두 가닥의 염기를 짝지어 DNA 나선을 만들고, 염기와 수소 결합의 수를 비교하세요.',
 'protein-folding':'아미노산을 연결하고 접어 두 사슬을 결합하세요. 접힘이 풀릴 때 달라지는 구조를 비교해 보세요.',
 'organelle-builder':'세포 소기관의 막과 ATP 합성효소를 배치하고, 수소 이온이 이동하는 경로를 확인하세요.',
 'hydride-boiling':'14·15족 수소 화합물의 분자량과 끓는점을 비교하고, 암모니아의 끓는점을 예측해 보세요.',
 'mcu-sampling':'센서와 읽기 핀을 맞추어 측정하고, 수집 간격과 차음 조건을 바꾸며 신호를 비교하세요.',
 'smart-pot':'수분 센서를 보정하고 자동 급수 장치를 연결하세요. 켜짐·꺼짐 기준을 바꾸며 작동을 확인해 보세요.',
 'fuel-comparison':'옥테인·에탄올·수소의 양을 같은 몰수·질량·부피로 맞추어 방출열과 이산화 탄소 발생량을 비교하세요.',
 'stellar-mass-data':'별을 골라 질량과 광도의 관계를 비교하고, 다른 별의 질량을 추정해 보세요.',
 'cluster-fitting':'두 성단의 별에 표준 주계열을 맞추어 성단까지의 거리를 구해 보세요.',
 'centrifuge-design':'용기의 균형을 맞춘 뒤 회전수와 시간을 바꾸어 입자가 분리되는 모습을 비교하세요.',
 'pedigree-lab':'부모와 자녀의 표현형을 비교해 가능한 유전자형을 찾아보세요.'
};
const notes={
 'stellar-mass-data':'선택한 별의 질량 범위를 바꾸면 추세선도 달라집니다.',
 'cluster-fitting':'이 비교에서는 성간 소광과 적색화를 보정하지 않습니다.',
 'centrifuge-design':'크기만 다른 구형 입자를 같은 액체에서 비교합니다.',
 'habitable-orbits':'생명가능 지대 안에 있다는 사실만으로 생명체의 존재를 판단할 수는 없습니다.',
 'insulation-lab':'같은 재료라도 두께·습도·채우는 방법에 따라 단열 효과가 달라집니다.',
 'dna-replication':'새 가닥이 자라는 방향과 두 가닥의 방향을 함께 확인하세요.',
 'pedigree-lab':'돌연변이 없이 X 염색체 열성 형질이 전달되는 경우를 비교합니다.',
 'mcu-sampling':'조건을 바꾼 가상 센서 신호를 비교합니다.',
 'smart-pot':'수분값은 건조·젖은 기준 사이의 상대 척도입니다.',
 'organelle-builder':'엽록체의 내막과 타이라코이드 막을 구별하세요.',
 'protein-folding':'접힘이 풀릴 때 사슬과 펩타이드 결합도 끊어지는지 비교하세요.'
};
module.exports={intro:r=>{if(!intros[r.slug])throw Error('Missing learner instructions: '+r.slug);return intros[r.slug];},note:r=>notes[r.slug]?`<p class="model-note">${notes[r.slug]}</p>`:''};
