(() => {
  'use strict';

  const artworkRoot = '../art-appreciation/museum/assets/artworks/';
  const lessons = [
    {
      id: 'color-perception', number: '01', track: '색을 이해하기', title: '색은 어떻게 보이는가',
      question: '빛·물체·눈 가운데 하나만 없어도 색을 볼 수 있을까?',
      concept: `
        <p class="lead">색은 물체에 영구적으로 각인된 고유 속성이 아닙니다. <strong>광원이 방출한 빛의 스펙트럼</strong>이 물체의 표면에 부딪혀 특정 파장만 선택적으로 반사되고, 그 반사광이 관람자의 눈과 뇌를 거치며 비로소 ‘색채’라는 시각 경험으로 합성됩니다.</p>
        <div class="term-table">
          <div class="term-row"><dt>광원</dt><dd>태양·전등·디스플레이처럼 스스로 빛을 방출하는 원천입니다. 광원의 색온도와 스펙트럼이 변하면 동일한 대상도 완전히 다른 색으로 지각됩니다.</dd></div>
          <div class="term-row"><dt>선택적 반사</dt><dd>모든 물질은 입사광 중 특정 파장을 흡수하고 나머지를 튕겨냅니다. 붉은 천은 붉은 대역의 파장을 지배적으로 반사하기 때문에 붉게 보입니다.</dd></div>
          <div class="term-row"><dt>시각적 지각</dt><dd>망막의 원추세포가 빛 신호를 수신하고, 시각 피질이 주변 조도·배경색·기억과 종합하여 색을 지각합니다.</dd></div>
          <div class="term-row"><dt>색 순응</dt><dd>조명 환경이 달라져도 대상의 본래 색을 일정하게 유지하려는 뇌의 보정 작용입니다. 예술가의 조색 작업에서는 조명 조건의 통제가 핵심적입니다.</dd></div>
        </div>
        <div class="claim"><strong>시각 문법의 핵심</strong> — “사과는 빨갛다”는 일상적 표현보다, “이 광원 환경에서 사과 표면이 붉은 파장을 가장 많이 반사하여 눈에 그렇게 지각된다”가 과학적·미술이론적으로 정확한 설명입니다.</div>`,
      visual: { type: 'image', src: 'p08.jpg', alt: '요하네스 페르메이르의 우유를 따르는 여인', title: '요하네스 페르메이르, 〈우유를 따르는 여인〉', meta: '1658–1660년경 · 캔버스에 유채', note: '북유럽의 은은한 자연광이 왼쪽 창에서 쏟아지며 회벽, 거친 빵, 청동 주전자, 옷감의 재질감에 따라 제각기 다른 반사광과 색채 밀도를 형성합니다.' },
      analysis: `
        <ol class="evidence-list">
          <li data-step="01"><strong>광원의 방향과 지배력:</strong> 좌측 격자창에서 유입되는 빛이 모든 인물과 정물에 명확한 명암 경계(키아로스쿠로)를 형성하며 공간의 깊이를 구축합니다.</li>
          <li data-step="02"><strong>재료별 선택적 반사:</strong> 빵의 오돌토돌한 표면 하이라이트, 청색 치마의 울트라마린 안료, 황토색 상의가 빛을 반사하는 물리적 차이를 정밀하게 관찰할 수 있습니다.</li>
          <li data-step="03"><strong>그림자 속 색채의 발견:</strong> 페르메이르는 그림자를 단순한 검정으로 칠하지 않고, 주변 벽과 바구니에서 튕겨 나온 반사광을 섬세한 톤으로 채색했습니다.</li>
          <li data-step="04"><strong>시각적 해석:</strong> 자연광의 치밀한 묘사는 평범한 일상의 부엌 작업을 성스럽고 고요한 시간의 응축으로 끌어올립니다.</li>
        </ol>`,
      study: { type: 'lighting' },
      quiz: { question: '같은 흰 종이가 노란 조명 아래에서 누렇게 보이는 가장 직접적인 까닭은?', choices: ['종이에 닿는 빛에 노란 성분이 많아서', '종이가 노란 파장을 골라 흡수해서', '눈이 조명에 순응해 흰색을 노랗게 바꿔서'], correct: 0, explanation: '흰 종이는 받은 빛을 고르게 반사하므로, 노란 성분이 많은 빛을 받으면 반사광도 누렇게 됩니다. 노란 파장을 흡수했다면 오히려 푸르스름해 보이고, 색 순응은 흰색을 흰색에 가깝게 되돌려 보이게 하는 보정입니다.' }
    },
    {
      id: 'color-properties', number: '02', track: '색을 이해하기', title: '색의 세 가지 속성',
      question: '같은 파랑도 왜 서로 다른 색으로 보일까?',
      concept: `
        <p class="lead">색을 학술적·조형적으로 정확히 구별하려면 “어떤 색상인가(Hue)”, “얼마나 밝은가(Value)”, “얼마나 순수하고 선명한가(Chroma)”라는 3차원 축으로 분해해야 합니다. 이것이 바로 <strong>색상·명도·채도</strong>의 3속성입니다.</p>
        <p class="lead">미국 화가이자 색채학자 앨버트 먼셀(Albert Munsell)이 체계화한 10색상환은 <strong>R–YR–Y–GY–G–BG–B–PB–P–RP</strong>의 정교한 10분할 순서로 이어집니다. 빨강(R)과 노랑(Y) 사이에 주황(YR)이 위치하듯, 기본색과 간색의 대칭적 관계를 파악하는 표준 척도입니다.</p>
        <div class="term-table">
          <div class="term-row"><dt>색상 Hue</dt><dd>빨강, 노랑, 파랑처럼 파장의 차이에 따라 구별되는 고유한 색의 종류입니다. 10색상환 위에서 이웃색(유사)과 반대편 색(보색)을 판별합니다.</dd></div>
          <div class="term-row"><dt>명도 Value</dt><dd>빛의 반사율에 따른 밝고 어두운 정도입니다. 흰색(10)에서 검정(0)까지의 명암 단계는 화면의 부피감과 형태의 가독성을 지배합니다.</dd></div>
          <div class="term-row"><dt>채도 Chroma</dt><dd>색의 맑고 탁함, 즉 순색에 포함된 무채색의 비율입니다. 채도가 낮아지면 회색조로 탁해지지만, 밝기(명도) 자체가 반드시 어두워지는 것은 아닙니다.</dd></div>
        </div>
        <div class="claim"><strong>흔한 착각의 교정</strong> — ‘밝은 색’이 곧 ‘선명한 색(고채도)’은 아닙니다. 파스텔톤은 명도는 매우 높지만 채도는 낮으며, 짙은 루비색은 명도는 낮지만 채도는 매우 높을 수 있습니다.</div>`,
      visual: { type: 'image', src: 'n02.jpg', alt: '클로드 모네의 수련', title: '클로드 모네, 〈수련〉', meta: '1916년 · 캔버스에 유채', note: '수면 위의 하늘 반사광과 연꽃의 색채를 윤곽선 없이, 미세한 명도와 채도 변화만으로 끝없이 진동하는 인상주의적 공간을 창조했습니다.' },
      analysis: `
        <ol class="evidence-list">
          <li data-step="01"><strong>색상의 연속성:</strong> 청록(BG), 파랑(B), 남보라(PB)의 인접 색상환 계열을 유기적으로 교차시켜 물의 깊이감을 조성합니다.</li>
          <li data-step="02"><strong>명도 대조의 통제:</strong> 강렬한 명도 대비를 피하고 중간 명도 영역을 넓게 유지함으로써 수면의 잔잔함과 평온한 명상적 정서를 유도합니다.</li>
          <li data-step="03"><strong>채도의 악센트:</strong> 전체적으로 탁하게 가라앉은 수면 위에 고채도의 꽃봉오리를 점묘하여 시각적 긴장감과 초점을 배치했습니다.</li>
          <li data-step="04"><strong>해석:</strong> 모네는 물체의 형태를 재현하는 대신, 빛과 공기에 의해 끊임없이 진동하는 색채의 3속성 자체를 회화의 주인공으로 삼았습니다.</li>
        </ol>`,
      study: { type: 'property' },
      quiz: { question: '회색을 섞어 색이 탁해졌지만 밝기는 거의 같다면, 가장 크게 달라진 속성은?', choices: ['색상', '명도', '채도'], correct: 2, explanation: '회색에 가까워져 선명함이 줄어든 변화이므로 채도가 낮아진 것입니다.' }
    },
    {
      id: 'color-mixing', number: '03', track: '색을 이해하기', title: '색의 혼합',
      question: '물감, 빛, 작은 색점은 왜 서로 다른 방식으로 섞일까?',
      concept: `
        <p class="lead">색의 혼합은 단일한 규칙으로 환원되지 않습니다. 혼합 대상이 <strong>빛을 흡수하는 안료인가, 빛을 방출하는 에너지인가, 관람자의 망막에서 일어나는 착시인가</strong>에 따라 감산 혼합, 가산 혼합, 병치 혼합의 세 메커니즘으로 나뉩니다.</p>
        <div class="term-table">
          <div class="term-row"><dt>감산 혼합</dt><dd>물감·염료·인쇄 잉크의 혼합입니다. 안료를 섞을수록 빛의 흡수 파장이 넓어져 반사광이 줄어들며 점차 어두운 암회색·검정으로 수렴합니다. 인쇄는 시안(C), 마젠타(M), 옐로(Y)를 기본으로 합니다.</dd></div>
          <div class="term-row"><dt>가산 혼합</dt><dd>모니터·스마트폰·무대 조명처럼 빛의 혼합입니다. 빨강(R), 초록(G), 파랑(B)의 빛을 더할수록 에너지 총량이 증가하여 점차 밝아지며, 세 빛이 고르게 겹치면 흰색 빛이 됩니다.</dd></div>
          <div class="term-row"><dt>병치 혼합</dt><dd>팔레트에서 섞지 않고 순수한 색의 작은 점들을 캔버스에 촘촘히 나란히 찍어, 일정한 거리에서 관람자의 시신경이 중간색으로 통합 지각하도록 유도하는 광학적 혼합입니다.</dd></div>
        </div>`,
      visual: { type: 'image', src: 'c06.jpg', alt: '조르주 쇠라의 그랑드 자트 섬의 일요일 오후', title: '조르주 쇠라, 〈그랑드 자트 섬의 일요일 오후〉', meta: '1884–1886년 · 캔버스에 유채', note: '신인상주의 창시자 쇠라는 물감을 섞을 때 발생하는 채도 저하(감산 혼합)를 극복하기 위해 순색의 작은 점을 캔버스에 병치하여 눈부신 대낮의 빛을 구현했습니다.' },
      analysis: `
        <ol class="evidence-list">
          <li data-step="01"><strong>초근접 관찰:</strong> 인물의 의복과 잔디밭은 단색 면이 아니라 주황, 초록, 파랑, 노랑 등 무수한 독립 색점들의 집합체입니다.</li>
          <li data-step="02"><strong>거리감에 따른 합성:</strong> 관람자가 뒤로 물러설 때 작은 점들의 경계가 시야에서 흐려지며 눈 안에서 환상적인 중간 톤과 찬란한 광휘로 합성됩니다.</li>
          <li data-step="03"><strong>감산 혼합과의 차별성:</strong> 팔레트에서 섞어 탁해진 물감 덩어리와 달리, 광학적 병치 혼합은 원색 특유의 높은 채도와 시각적 진동감을 유지합니다.</li>
          <li data-step="04"><strong>조형적 성과:</strong> 쇠라는 물리학과 광학 이론을 예술과 융합하여 인상주의의 즉흥성을 엄격하고 영구적인 고전적 조형 질서로 승화시켰습니다.</li>
        </ol>`,
      study: { type: 'mixing' },
      quiz: { question: '무대 조명에서 빨강 빛과 초록 빛을 한곳에 겹쳐 비추어 노랑 빛을 만드는 혼합은?', choices: ['감산 혼합', '가산 혼합', '병치 혼합'], correct: 1, explanation: '빛을 한곳에 겹쳐 더할수록 밝아지므로 가산 혼합입니다. 병치 혼합은 겹치지 않고 나란히 놓인 작은 색점이 눈에서 섞여 보이는 것입니다.' }
    },
    {
      id: 'color-harmony', number: '04', track: '색을 이해하기', title: '색의 관계와 배색',
      question: '색상환의 거리와 색의 비율은 화면의 긴장을 어떻게 바꿀까?',
      concept: `
        <p class="lead">배색(Color Scheme)은 고정된 ‘조화로운 색 공식’을 암기하는 작업이 아닙니다. 색상환에서의 거리, 명도·채도의 격차, 그리고 <strong>면적 비율(Area Proportion)</strong>을 치밀하게 설계하여 화면 전체의 긴장과 평형을 연출하는 조형적 전략입니다.</p>
        <div class="term-table">
          <div class="term-row"><dt>유사색</dt><dd>색상환에서 인접한 색상들입니다. 공통 파장을 지녀 부드러운 통일감과 안정을 주지만, 명도차가 부족하면 형태의 경계가 흐려질 위험이 있습니다.</dd></div>
          <div class="term-row"><dt>보색</dt><dd>색상환에서 마주 보는 정반대의 색상입니다. 서로의 채도를 극대화하여 강렬한 대비와 생명력을 형성하지만, 동일한 면적으로 대립하면 시각적 피로를 유발합니다.</dd></div>
          <div class="term-row"><dt>주조색</dt><dd>화면의 60~70% 이상을 점유하며 전체 분위기를 장악하는 기저 색채입니다. 보조색(20~30%)과 강조색(5~10%)의 위계적 비율이 완성도를 결정합니다.</dd></div>
        </div>
        <div class="claim"><strong>배색의 불문율</strong> — 색상의 어울림은 색 이름 자체가 아니라 사용된 ‘면적의 비율’과 ‘명도 차이’에서 최종 결정됩니다. 아무리 강렬한 보색도 면적을 5%의 악센트로 축소하면 세련된 시각적 초점이 됩니다.</div>`,
      visual: { type: 'image', src: 'c08.jpg', alt: '앙리 마티스의 춤', title: '앙리 마티스, 〈춤〉', meta: '1910년 · 캔버스에 유채', note: '코발트 블루 하늘, 에메랄드 그린 대지, 적갈색 인체라는 극도로 절제된 세 가지 색채와 과감한 면적 대비로 원초적인 생명력의 리듬을 폭발시킨 야수주의 걸작입니다.' },
      analysis: `
        <ol class="evidence-list">
          <li data-step="01"><strong>주조색의 지배력:</strong> 화면의 절반 이상을 차지하는 짙푸른 하늘이 장엄한 배경 공간을 형성하며 정서적 기저를 구축합니다.</li>
          <li data-step="02"><strong>보색적 긴장감:</strong> 푸른 하늘과 맞닿은 붉은 피부 톤, 초록 대지와 붉은 인체의 맞물림이 윤곽선에 극적인 텐션을 부여합니다.</li>
          <li data-step="03"><strong>면적의 황금비율:</strong> 하늘(주조색) 50%, 대지(보조색) 30%, 인물(강조색) 20%의 위계적 면적 분할이 화면의 혼란을 방지합니다.</li>
          <li data-step="04"><strong>동세와의 결합:</strong> 단순화된 색채의 면들이 둥글게 맞잡은 손과 원형 구도의 흐름을 타고 시선을 끝없이 순환시킵니다.</li>
        </ol>`,
      study: { type: 'harmony' },
      quiz: { question: '보색 두 가지가 서로 지나치게 경쟁할 때 가장 적절한 조절 방법은?', choices: ['두 색의 면적을 똑같이 맞춘다', '두 색의 채도를 함께 높인다', '한 색의 면적이나 채도를 줄인다'], correct: 2, explanation: '보색 관계는 유지하면서 면적이나 채도의 차이를 주면 시각적 위계가 생깁니다. 같은 면적으로 맞서거나 둘 다 선명해지면 경쟁이 더 심해집니다.' }
    },
    {
      id: 'obangsaek', number: '05', track: '색을 이해하기', title: '오방색',
      question: '다섯 색은 어떻게 방향·자연·생활의 의미 체계를 이루었을까?',
      concept: `
        <p class="lead">오방색(五方色)은 단순한 시각적 장식 색채가 아닙니다. 고대 동아시아의 우주관인 <strong>음양오행(陰陽五行) 사상</strong>에 뿌리를 두고, 방위·계절·자연 원소·인간의 길흉화복을 다섯 색채의 질서로 구조화한 심오한 문화적 상징 체계입니다.</p>
        <div class="term-table">
          <div class="term-row"><dt>청 · 동</dt><dd>목(木)의 기운, 봄, 생명과 청룡에 대응합니다. 동쪽을 수호하는 푸른 용이며, 전통 조형에서 ‘청’은 현대의 파랑뿐 아니라 깊은 청록을 포괄합니다.</dd></div>
          <div class="term-row"><dt>적 · 남</dt><dd>화(火)의 기운, 여름, 정열과 주작에 대응합니다. 남쪽을 수호하는 붉은 신조(神鳥)로, 긴 꼬리와 펼친 날개를 지닌 형상입니다.</dd></div>
          <div class="term-row"><dt>황 · 중앙</dt><dd>토(土)의 기운, 중심, 대지와 사방의 조화에 대응합니다. 중앙 동물 표상은 자료에 따라 황룡 또는 봉황 등으로 다르게 전승되므로 절대적 단일 표상으로 고정하지 않습니다.</dd></div>
          <div class="term-row"><dt>백 · 서</dt><dd>금(金)의 기운, 가을, 순결·정의와 백호에 대응합니다. 서쪽을 지키는 흰 호랑이로, 액운을 막는 강력한 수호신입니다.</dd></div>
          <div class="term-row"><dt>흑 · 북</dt><dd>수(水)의 기운, 겨울, 지혜와 현무에 대응합니다. 북쪽을 수호하며 거북과 뱀이 신비롭게 얽힌 복합 형상으로 표현됩니다.</dd></div>
        </div>`,
      visual: { type: 'obang' },
      analysis: `
        <ol class="evidence-list">
          <li data-step="01"><strong>궁궐 단청의 위계:</strong> 목조건축을 비바람과 부식으로부터 보호하는 실용적 기능과 더불어, 오행의 상징 배합으로 신성한 왕실의 질서를 장엄하게 시각화했습니다.</li>
          <li data-step="02"><strong>색동의 염원:</strong> 돌잔치나 명절 복식에 오방색의 띠를 반복 배치하여 액운을 물리치고 무병장수와 복을 기원하는 삶의 미학을 담았습니다.</li>
          <li data-step="03"><strong>오방간색(間色)의 확장:</strong> 기본 오방색 사이에 녹(청+황), 벽(청+백), 홍(적+백), 유황(황+흑), 자(적+흑) 등 간색이 유기적으로 파생되어 다채로운 조화를 이룹니다.</li>
          <li data-step="04"><strong>현대적 통찰:</strong> 전통 색채는 고정된 디지털 HEX 코드의 숫자가 아니라, 천연 안료의 숨결과 시대적 맥락 속에서 살아 숨 쉬는 문화적 기호입니다.</li>
        </ol>`,
      study: { type: 'tabs', options: [
        { label: '단청', title: '건축의 구조와 위계를 드러내는 색', swatches: ['#205e53','#a93b31','#d4a91f','#ece8da','#20201e'], body: '단청은 목재를 보호하는 기능과 장식 기능을 함께 지니며, 건축물의 격과 쓰임에 따라 색과 문양의 밀도가 달라집니다.' },
        { label: '색동', title: '색 띠의 반복과 생활 속 상징', swatches: ['#b53d32','#d6a91d','#27675b','#ede9de','#282828'], body: '색동은 서로 다른 색의 띠를 이어 붙여 반복과 대비를 만듭니다. 복식의 쓰임과 시대에 따라 배열과 색의 수가 달라집니다.' },
        { label: '현대 적용', title: '상징을 이해한 뒤 재구성하기', swatches: ['#173f86','#a3372b','#d0a51b','#f0eee8','#171717'], body: '오방색을 현대 작업에 쓸 때는 다섯 색을 그대로 늘어놓는 데 그치지 않고 방향, 중심, 균형 같은 관계를 어떤 방식으로 번역할지 결정해야 합니다.' }
      ] },
      quiz: { question: '오방색을 가장 정확하게 설명한 것은?', choices: ['다섯 색을 섞어 모든 색을 만들어 내는 혼합 체계', '다섯 색을 방위·계절·오행에 연결한 상징 체계', '색상환을 다섯으로 나눈 먼셀의 기본 색상 체계'], correct: 1, explanation: '오방색은 색 혼합 공식이 아니라 음양오행과 방향·자연의 의미가 연결된 문화적 색 체계입니다. 먼셀 색상환의 다섯 기본 색상(빨강·노랑·초록·파랑·보라)과도 다른 개념입니다.' }
    },
    {
      id: 'visual-elements', number: '06', track: '화면을 구성하기', title: '조형 요소',
      question: '작품에서 실제로 보고 지목할 수 있는 시각적 재료는 무엇인가?',
      concept: `
        <p class="lead">조형 요소는 예술가가 화면이라는 2차원 평면에 세계를 구축하기 위해 사용하는 <strong>가장 기초적이고 객관적인 시각적 어휘</strong>입니다. 주제나 느낌을 추측하기에 앞서 점, 선, 면, 형, 색, 명암, 질감, 공간을 정확히 포착하는 것이 미술 분석의 첫 단추입니다.</p>
        <div class="term-table">
          <div class="term-row"><dt>선</dt><dd>점이 이동한 궤적으로, 시선의 유도선이자 속도·방향·감정을 전달하는 윤곽입니다. 수평선의 안정, 수직선의 숭고, 사선의 격동, 곡선의 유연함을 만듭니다.</dd></div>
          <div class="term-row"><dt>형과 형태</dt><dd>선이 만나 닫힌 2차원 윤곽(Shape)과, 명암에 의해 양감과 부피를 갖춘 3차원 덩어리(Form)를 포괄합니다.</dd></div>
          <div class="term-row"><dt>명암과 색</dt><dd>빛과 그림자의 밸류 차이는 형태를 입체화하고, 색채의 온도와 채도는 화면에 심리적 파장을 불러일으킵니다.</dd></div>
          <div class="term-row"><dt>질감</dt><dd>실제로 만져지는 재료의 마티에르(촉각적 질감)와, 붓터치와 묘사를 통해 촉감을 상상하게 하는 시각적 질감으로 나뉩니다.</dd></div>
          <div class="term-row"><dt>공간</dt><dd>대상이 점유하는 형태(양의 공간)와, 그 대상을 감싸며 숨을 쉬게 하는 여백과 배경(음의 공간)의 상호작용입니다.</dd></div>
        </div>`,
      visual: { type: 'image', src: 'p05.jpg', alt: '에드바르 뭉크의 절규', title: '에드바르 뭉크, 〈절규〉', meta: '1893년 · 판지에 유채·템페라·파스텔', note: '불안과 공포라는 내면의 극단적 심리를 문학적 설명이 아닌, 격렬하게 요동치는 곡선과 핏빛 사선의 조형 요소만으로 완벽하게 번역해낸 표현주의의 기념비적 작품입니다.' },
      analysis: `
        <ol class="evidence-list">
          <li data-step="01"><strong>선의 정서적 충돌:</strong> 화면을 예리하게 찌르고 들어오는 난간의 직선 사선과, 하늘과 피오르를 뒤흔드는 물결 곡선이 격렬한 시각적 마찰을 일으킵니다.</li>
          <li data-step="02"><strong>색채의 비현실성:</strong> 사실적 하늘의 파랑을 배제하고 유황빛 노랑과 핏빛 주황을 과감히 배치하여 심리적 압박감을 극대화했습니다.</li>
          <li data-step="03"><strong>형태의 왜곡:</strong> 인물의 골격과 이목구비를 지우고 점액질처럼 길게 늘어뜨려 개인의 초상을 넘어 보편적 인류의 실존적 절규로 변모시켰습니다.</li>
          <li data-step="04"><strong>공간의 압축:</strong> 원근법적 소실점을 향해 급격히 빨려 들어가는 다리와, 관람자 바로 코앞을 막아선 인물의 대조가 피할 수 없는 폐소공포를 유발합니다.</li>
        </ol>`,
      study: { type: 'elements' },
      quiz: { question: '다음 중 조형 요소를 근거로 한 관찰에 가장 가까운 문장은?', choices: ['사선이 많아 보는 사람을 불안하게 만든다', '굵은 사선이 화면 왼쪽 위로 반복된다', '붉은 하늘은 작가가 본 노을을 그대로 옮긴 것이다'], correct: 1, explanation: '선의 굵기·방향·반복처럼 화면에서 확인할 수 있는 사실을 기술한 문장입니다. 불안하게 만든다는 것은 느낌을 풀이한 해석이고, 작가가 무엇을 보았는지는 화면만으로 확인할 수 없습니다.' }
    },
    {
      id: 'visual-principles', number: '07', track: '화면을 구성하기', title: '조형 원리',
      question: '조형 요소들은 어떤 관계를 맺을 때 화면의 질서가 되는가?',
      concept: `
        <p class="lead">조형 요소가 건물을 짓는 벽돌과 목재라면, <strong>조형 원리는 그 요소들을 조직하여 하나의 완결된 건축물로 엮어내는 문법이자 질서</strong>입니다. 관람자의 시선이 어디에 머물고 어떻게 이동할지를 설계하는 핵심 조형 법칙입니다.</p>
        <div class="term-table">
          <div class="term-row"><dt>균형</dt><dd>화면 양쪽에 분배된 시각적 무게감의 평형 상태입니다. 정적인 좌우 대칭뿐 아니라, 크기와 색채가 다른 요소들이 팽팽하게 맞서는 역동적인 비대칭 균형이 존재합니다.</dd></div>
          <div class="term-row"><dt>강조와 대비</dt><dd>명도, 크기, 색채, 질감의 격차를 만들어 관람자의 시선이 가장 먼저 도달하는 시각적 중심점(Focal Point)을 구축합니다.</dd></div>
          <div class="term-row"><dt>반복과 리듬</dt><dd>선, 형, 색의 규칙적이거나 변주된 되풀이를 통해 화면에 음악적인 율동감과 시선의 경쾌한 이동 속도를 부여합니다.</dd></div>
          <div class="term-row"><dt>통일과 변화</dt><dd>공통된 테마와 색조로 전체를 조화롭게 묶어주는 ‘통일’과, 단조로움과 지루함을 깨뜨리는 ‘변화’가 완벽한 긴장 관계를 유지해야 합니다.</dd></div>
        </div>`,
      visual: { type: 'image', src: 'c01.jpg', alt: '피트 몬드리안의 빨강 파랑 노랑의 구성 II', title: '피트 몬드리안, 〈빨강, 파랑, 노랑의 구성 II〉', meta: '1930년 · 캔버스에 유채', note: '구체적 자연 재현을 일체 배제하고, 수직·수평의 검은 격자와 삼원색(빨강, 파랑, 노랑)의 면적만으로 완벽한 시각적 평형을 증명한 신조형주의의 정점입니다.' },
      analysis: `
        <ol class="evidence-list">
          <li data-step="01"><strong>비대칭 균형의 표본:</strong> 우측 상단의 거대하고 강렬한 붉은 사각형 하나의 시각적 무게를, 좌측 하단의 작은 파랑·노랑 면과 여러 개의 백색 여백들이 정교하게 상쇄합니다.</li>
          <li data-step="02"><strong>비례와 분할:</strong> 모든 사각형은 동일하지 않은 황금비율적 변주를 지니며, 검은 선의 굵기 차이 또한 면들의 호흡을 조절합니다.</li>
          <li data-step="03"><strong>통일성의 유지:</strong> 오직 90도 직교선과 순수한 원색, 무채색만을 사용하여 화면 전체가 단 하나의 수학적 우주처럼 통일됩니다.</li>
          <li data-step="04"><strong>변화의 텐션:</strong> 기계적 바둑판 배열이 아닌 직관적 비대칭 분할을 통해 차가운 추상 속에서도 살아 움직이는 생동감을 불어넣었습니다.</li>
        </ol>`,
      study: { type: 'principles' },
      quiz: { question: '화면의 양쪽 모양은 다르지만 시각적 무게가 안정되어 보이는 구성은?', choices: ['비대칭 균형', '강조와 대비', '통일과 변화'], correct: 0, explanation: '서로 다른 요소가 시각적 무게를 맞춘 상태를 비대칭 균형이라고 합니다.' }
    },
    {
      id: 'space-composition', number: '08', track: '화면을 구성하기', title: '공간과 화면 구성',
      question: '평평한 화면은 어떻게 깊이와 시선의 이동 경로를 만드는가?',
      concept: `
        <p class="lead">회화의 공간은 3차원 현실의 물리적 복제가 아닙니다. 평평한 2차원 캔버스 위에 인류가 고안해낸 고도의 시각적 약속이자 환영(Illusion)입니다. 서양 르네상스의 단일 소실점 원근법부터 동양 전통 산수화의 자유로운 다시점과 여백까지, 문명마다 독창적인 공간 철학을 구축해왔습니다.</p>
        <div class="term-table">
          <div class="term-row"><dt>선 원근법</dt><dd>평행선들이 지평선 위의 한 점(소실점)으로 수렴하도록 기하학적으로 설계하여, 고정된 단일 시점에서 바라본 3차원 깊이감을 수학적으로 재현합니다.</dd></div>
          <div class="term-row"><dt>대기 원근법</dt><dd>원거리의 사물일수록 공기층에 의해 윤곽선이 흐려지고, 명암 대비가 감소하며, 푸르스름한 톤으로 물러나 보이게 하는 공간 표현 기법입니다.</dd></div>
          <div class="term-row"><dt>다시점과 여백</dt><dd>시점을 한자리에 고정하지 않고 위에서 내려다보거나(부감), 걸어가며 바라본 장면들을 파노라마처럼 펼쳐내며, 비어 있는 여백을 통해 무한한 시간과 상상의 호흡을 창출합니다.</dd></div>
          <div class="term-row"><dt>구도</dt><dd>삼각형 구도의 안정감, 대각선 구도의 역동성, 원형 구도의 순환감 등 화면의 뼈대를 이루는 골격 배치입니다.</dd></div>
        </div>
        <div class="claim"><strong>시각적 편견의 극복</strong> — 선 원근법만이 유일하게 ‘옳고 과학적인’ 공간 표현이 아닙니다. 대상과 교감하며 이동하는 시선을 담아낸 동양화의 다시점과 여백 역시 고도로 성숙한 공간 조형 체계입니다.</div>`,
      visual: { type: 'pair', images: [
        { src: 's04.jpg', alt: '레오나르도 다 빈치의 최후의 만찬', title: '레오나르도 다 빈치, 〈최후의 만찬〉', meta: '1495–1498년 · 벽화' },
        { src: 'd16.jpg', alt: '정선의 금강전도', title: '정선, 〈금강전도〉', meta: '1734년 · 종이에 수묵담채' }
      ], note: '한 작품은 단일 소실점으로 방을 연장하고, 다른 작품은 높은 시점과 이동하는 시선으로 산 전체를 펼칩니다.' },
      analysis: `
        <ol class="evidence-list">
          <li data-step="01"><strong>〈최후의 만찬〉의 1점 투시:</strong> 천장 격자와 벽면의 태피스트리 선들이 중앙 예수 그리스도의 이마 한 점으로 완벽히 수렴하여, 공간의 무한한 깊이와 종교적 절대성을 동시에 각인합니다.</li>
          <li data-step="02"><strong>〈금강전도〉의 원형 부감시:</strong> 비행기나 위성이 없던 조선 시대, 겸재 정선은 일만이천봉의 금강산을 하늘에서 굽어보는 장엄한 다시점의 원형 구도로 재구성했습니다.</li>
          <li data-step="03"><strong>공간 철학의 대비:</strong> 서양 회화가 고정된 관찰자의 눈높이에 세상을 종속시켰다면, 한국 회화는 자연의 총체적 기운을 품고 시선이 유람하듯 노니는 여백의 공간을 열었습니다.</li>
          <li data-step="04"><strong>시선 유도의 목적:</strong> 두 명작 모두 단순한 풍경 묘사를 넘어, 관람자의 시선이 머물고 감동을 느끼도록 정교한 시각 경로를 설계했습니다.</li>
        </ol>`,
      study: { type: 'space' },
      quiz: { question: '선 원근법을 사용한 화면에서 소실점과 가장 직접적으로 연결되는 것은?', choices: ['관람자의 눈높이', '화면의 한가운데', '먼 곳이 흐려지는 정도'], correct: 0, explanation: '소실점이 놓이는 수평선은 관람자의 눈높이와 대응합니다. 소실점이 늘 화면 한가운데 오는 것은 아니며, 먼 곳이 흐려 보이게 하는 것은 대기 원근법입니다.' }
    },
    {
      id: 'formal-analysis', number: '09', track: '작품에 적용하기', title: '작품 형식 분석',
      question: '보이는 사실에서 작품의 의미까지 어떻게 논리를 세울까?',
      concept: `
        <p class="lead">작품 형식 분석(Formal Analysis)은 주관적인 인상비평(“그냥 예쁘다”, “왠지 우울하다”)을 넘어, <strong>작품에 존재하는 객관적 시각 증거를 근거로 의미를 논리적으로 규명하는 미술 비평의 핵심 방법론</strong>입니다. 미국의 미술교육학자 에드먼드 펠드먼(Edmund Feldman)의 4단계 비평 프로세스가 대표적입니다.</p>
        <div class="term-table">
          <div class="term-row"><dt>1. 관찰</dt><dd>화면에 무엇이 묘사되어 있는가? 개인적 감상을 철저히 배제하고 인물, 사물, 색상, 선, 구도 등 눈에 보이는 순수 사실을 객관적으로 기록합니다.</dd></div>
          <div class="term-row"><dt>2. 분석</dt><dd>조형 요소들이 어떻게 상호작용하는가? 명도 대비, 균형, 강조점, 원근법 등 화면을 조직하는 조형 원리의 작동 메커니즘을 분석합니다.</dd></div>
          <div class="term-row"><dt>3. 해석</dt><dd>작품이 무엇을 말하고자 하는가? 1단계의 관찰 사실과 2단계의 조형 분석을 탄탄한 근거로 삼아, 작가의 의도와 시대적 함의를 도출합니다.</dd></div>
          <div class="term-row"><dt>4. 판단</dt><dd>작품이 조형적·역사적으로 얼마나 성공적인가? 정밀한 논거를 바탕으로 작품의 예술적 가치와 의의를 종합 평가합니다.</dd></div>
        </div>
        <div class="claim"><strong>비평 문장의 황금 공식</strong> — [시각적 사실 관찰] → [조형적 원리 규명] → [해석적 효과 연결]. 예: “배경 열린 문 너머의 강한 햇빛 명암 대비(사실)가 시선을 액자 깊숙이 끌어당김으로써(원리), 그림 안팎의 경계를 허무는 관람자의 위치를 각성시킨다(해석).”</div>`,
      visual: { type: 'image', src: 'd08.jpg', alt: '디에고 벨라스케스의 시녀들', title: '디에고 벨라스케스, 〈시녀들〉', meta: '1656년 · 캔버스에 유채', note: '스페인 궁정화가 벨라스케스는 캔버스 뒤의 화가 자신, 공주와 시녀들, 벽면 거울에 비친 국왕 부부, 열린 문틈의 관리를 한 화면에 교차시켜 ‘바라보는 행위’ 자체를 탐구한 미술사상 최고의 걸작입니다.' },
      analysis: `
        <ol class="evidence-list">
          <li data-step="01"><strong>시각적 사실 관찰:</strong> 중앙의 어린 마르가리타 공주, 이를 보필하는 시녀들, 거대한 캔버스 앞에 선 벨라스케스, 배경 거울 속 두 형체, 후방 문틈에 선 남성을 확인합니다.</li>
          <li data-step="02"><strong>조형적 빛과 시선의 분석:</strong> 우측 창문에서 쏟아지는 빛이 공주의 순백 드레스를 첫 번째 초점으로 비추고, 저 멀리 열린 문에서 새어 나오는 역광이 두 번째 심층 초점을 형성합니다.</li>
          <li data-step="03"><strong>공간의 전복과 해석:</strong> 벽면 거울에 비친 국왕 부부는 그림 ‘밖’, 즉 관람자가 서 있는 자리에 왕과 왕비가 존재함을 암시하며 회화 공간을 현실로 확장합니다.</li>
          <li data-step="04"><strong>궁극적 종합 판단:</strong> 단순한 왕실 가족 초상화를 뛰어넘어, 화가의 사회적 지위와 회화 예술의 철학적 깊이를 완벽한 형식미로 입증한 불멸의 걸작으로 평가받습니다.</li>
        </ol>`,
      study: { type: 'analysisWorkflow' },
      quiz: { question: '형식 분석 문장으로 가장 적절한 것은?', choices: ['뒤쪽 열린 문간에 한 남자가 서 있다', '문간의 남자는 궁정을 몰래 엿보는 사람일 것이다', '밝은 문과 어두운 방의 명도 대비가 시선을 안쪽으로 이끈다'], correct: 2, explanation: '화면에서 확인되는 명도 대비와 그로 인한 시선 이동을 근거로 연결한 문장입니다. 보이는 것만 적은 문장은 관찰 단계에 머물고, 근거 없이 짐작한 문장은 분석이 되지 못합니다.' }
    }
  ];

  const courseMenu = document.getElementById('courseMenu');
  const lessonView = document.getElementById('lessonView');
  const previousLesson = document.getElementById('previousLesson');
  const nextLesson = document.getElementById('nextLesson');
  let currentIndex = 0;

  function renderVisual(visual) {
    const figure = document.getElementById('artworkFigure');
    if (visual.type === 'obang') {
      const items = [
        { key:'east', color:'#22675b', label:'청', direction:'동', element:'목', season:'봄', guardian:'청룡', animal:'푸른 용', description:'동쪽 하늘과 봄의 생명력을 지키는 상상의 용입니다. 고분벽화와 의궤에서는 길게 휘어진 몸과 비늘, 뿔을 지닌 모습으로 나타납니다.' },
        { key:'south', color:'#b43b31', label:'적', direction:'남', element:'화', season:'여름', guardian:'주작', animal:'붉은 상상의 새', description:'남쪽과 불의 기운을 지키는 새입니다. 봉황과 닮은 긴 깃과 펼친 날개를 지닌 모습으로 표현됩니다.' },
        { key:'center', color:'#d5a91d', label:'황', direction:'중앙', element:'토', season:'중심·전환', guardian:'중앙 표상', animal:'황룡·봉황 등', description:'중앙은 흙과 네 방향의 중심에 대응합니다. 동물 표상은 문헌과 전승에 따라 황룡 또는 봉황 등으로 달라 하나로 단정하지 않습니다.' },
        { key:'west', color:'#f1efe8', label:'백', direction:'서', element:'금', season:'가을', guardian:'백호', animal:'흰 호랑이', description:'서쪽을 지키는 흰 호랑이입니다. 힘찬 발과 긴 꼬리로 사악한 기운을 막는 수호신의 성격을 드러냅니다.' },
        { key:'north', color:'#202124', label:'흑', direction:'북', element:'수', season:'겨울', guardian:'현무', animal:'거북과 뱀의 결합', description:'북쪽과 물을 지키는 신수입니다. 거북의 몸을 뱀이 휘감은 독특한 결합 형상으로 표현됩니다.' }
      ];
      figure.innerHTML = `
        <div class="obang-atlas" aria-label="오방색 상징 관계표">
          <div class="obang-table-head" aria-hidden="true"><span>색</span><span>방위</span><span>오행</span><span>계절</span><span>수호 상징</span></div>
          ${items.map((item) => `<button type="button" data-obang="${item.key}" class="${item.key === 'east' ? 'active' : ''}"><i style="--obang-color:${item.color}"></i><strong>${item.label}</strong><span>${item.direction}</span><span>${item.element}</span><span>${item.season}</span><span>${item.guardian}</span></button>`).join('')}
          <div class="guardian-detail" id="guardianDetail"></div>
        </div>
        <figcaption class="obang-caption">사신은 오방색과 동일한 개념은 아니지만 같은 오행·방위의 상징 체계 안에서 연결됩니다.<br><a class="source-link" href="https://www.museum.go.kr/uigwe/story/story" target="_blank" rel="noopener">국립중앙박물관 사수도 자료 ↗</a> <a class="source-link" href="https://www.heritage.go.kr/heri/html/HtmlPage.do?pageNo=5_5_1_0&pg=%2Fcul%2FcultureEasySub01_13.jsp" target="_blank" rel="noopener">국가유산청 단청 자료 ↗</a></figcaption>`;
      const showGuardian = (key) => {
        const item = items.find((entry) => entry.key === key);
        figure.querySelectorAll('[data-obang]').forEach((button) => button.classList.toggle('active', button.dataset.obang === key));
        document.getElementById('guardianDetail').innerHTML = `<p>${item.label} · ${item.direction} · ${item.element} · ${item.season}</p><h3>${item.guardian} <small>${item.animal}</small></h3><p>${item.description}</p>`;
      };
      figure.querySelectorAll('[data-obang]').forEach((button) => button.addEventListener('click', () => showGuardian(button.dataset.obang)));
      showGuardian('east');
      return;
    }

    if (visual.type === 'pair') {
      figure.innerHTML = `
        <div class="artwork-pair">
          ${visual.images.map((image) => `
            <div class="pair-card">
              <img src="${artworkRoot}${image.src}" alt="${image.alt}">
              <div class="artwork-caption">
                <strong>${image.title}</strong>
                <span class="artwork-meta-tag">${image.meta}</span>
              </div>
            </div>`).join('')}
        </div>
        <figcaption>${visual.note}</figcaption>`;
      return;
    }

    figure.innerHTML = `
      <div class="artwork-frame">
        <img class="artwork-image" id="primaryArtworkImg" src="${artworkRoot}${visual.src}" alt="${visual.alt}">
      </div>
      <figcaption>
        <strong>${visual.title}</strong>
        <span class="artwork-meta-tag">${visual.meta}</span>
        <div>${visual.note}</div>
      </figcaption>`;
  }

  function renderStudy(study) {
    const host = document.getElementById('studyContent');

    // 01. Light Simulator
    if (study.type === 'lighting') {
      host.innerHTML = `
        <div class="study-lab-container">
          <div class="light-sim-controls">
            <button type="button" class="light-btn active" data-light="daylight"><i style="background:#fefefe;box-shadow:0 0 8px #fff"></i> 자연광 (5500K)</button>
            <button type="button" class="light-btn" data-light="incandescent"><i style="background:#ff9d3b;box-shadow:0 0 8px #ff9d3b"></i> 백열등 (2700K)</button>
            <button type="button" class="light-btn" data-light="cool-led"><i style="background:#8bc4ff;box-shadow:0 0 8px #8bc4ff"></i> 차가운 LED (6500K)</button>
            <button type="button" class="light-btn" data-light="candle"><i style="background:#ff6122;box-shadow:0 0 8px #ff6122"></i> 촛불 (1900K)</button>
          </div>
          <div class="study-output" id="lightOutput">
            <h3>자연광 (5500K)</h3>
            <p>자연의 햇빛은 가시광선 전 영역을 고르게 포함하고 있어, 흰 벽의 청량함과 노란 옷감, 울트라마린 파랑이 왜곡 없이 각자의 본래 색채로 균형 있게 반사됩니다.</p>
          </div>
        </div>`;
      
      const lightData = {
        'daylight': { filter: 'none', title: '자연광 (5500K)', desc: '자연의 햇빛은 가시광선 전 영역을 고르게 포함하고 있어, 흰 벽의 청량함과 노란 옷감, 울트라마린 파랑이 왜곡 없이 각자의 본래 색채로 균형 있게 반사됩니다.' },
        'incandescent': { filter: 'sepia(0.35) saturate(1.4) hue-rotate(-15deg)', title: '백열등 (2700K)', desc: '붉고 노란 파장이 강한 조명입니다. 노란 상의와 빵의 갈색 표면은 더욱 따뜻하고 풍성하게 반사되지만, 파란 치마의 채도는 어둡게 가라앉아 보입니다.' },
        'cool-led': { filter: 'hue-rotate(18deg) saturate(1.1) brightness(1.05)', title: '차가운 LED (6500K)', desc: '푸른빛 성분이 많은 조명입니다. 울트라마린 치마와 창가 흰 벽의 차가운 반사광이 두드러지며, 노란색 계열은 채도가 다소 낮아져 차분하게 보입니다.' },
        'candle': { filter: 'sepia(0.6) brightness(0.85) contrast(1.2)', title: '촛불 (1900K)', desc: '붉은빛이 지배적이고 광량이 낮아 명암 대비가 극대화됩니다. 물체 고유의 색상보다는 빛과 그림자의 부피감이 공간을 지배합니다.' }
      };

      host.querySelectorAll('.light-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          host.querySelectorAll('.light-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const setting = lightData[btn.dataset.light];
          const img = document.getElementById('primaryArtworkImg');
          if (img) img.style.filter = setting.filter;
          host.querySelector('#lightOutput').innerHTML = `<h3>${setting.title}</h3><p>${setting.desc}</p>`;
        });
      });
      return;
    }

    // 02. Munsell Property Lab
    if (study.type === 'property') {
      const tenHues = [
        { code:'R', name:'빨강', hue:0, color:'#c83b37' }, { code:'YR', name:'주황', hue:28, color:'#d9782e' },
        { code:'Y', name:'노랑', hue:52, color:'#d7b51f' }, { code:'GY', name:'연두', hue:82, color:'#91a62e' },
        { code:'G', name:'초록', hue:135, color:'#328357' }, { code:'BG', name:'청록', hue:174, color:'#268b87' },
        { code:'B', name:'파랑', hue:215, color:'#326dad' }, { code:'PB', name:'남보라', hue:252, color:'#5c5ea8' },
        { code:'P', name:'보라', hue:286, color:'#8a4b96' }, { code:'RP', name:'자주', hue:327, color:'#b6426d' }
      ];
      host.innerHTML = `
        <div class="ten-hue-lab">
          <section class="hue-wheel-panel">
            <div class="ten-hue-wheel" aria-label="R, YR, Y, GY, G, BG, B, PB, P, RP 10색상환">
              <div class="hue-ring" aria-hidden="true"></div>
              ${tenHues.map((item, index) => `<button type="button" data-hue-index="${index}" style="--i:${index};--hue-color:${item.color}" class="${item.code === 'B' ? 'active' : ''}"><strong>${item.code}</strong><small>${item.name}</small></button>`).join('')}
              <div class="wheel-center"><span>선택한 색상</span><strong id="selectedHueName">B · 파랑</strong></div>
            </div>
          </section>
          <section class="attribute-panel">
            <div class="property-preview" id="propertyPreview"><span id="propertyNotation">B 5/8</span></div>
            <div class="scale-block"><header><h3>명도 Value</h3><output id="valueOutput">5</output></header><div class="value-scale" id="valueScale"></div><input id="valueControl" type="range" min="1" max="9" value="5" aria-label="명도"></div>
            <div class="scale-block"><header><h3>채도 Chroma</h3><output id="chromaOutput">8</output></header><div class="chroma-scale" id="chromaScale"></div><input id="chromaControl" type="range" min="0" max="12" step="2" value="8" aria-label="채도"></div>
          </section>
        </div>
        <div class="claim"><strong>먼셀 기호 읽기</strong> — 표기 <strong>B 5/8</strong>은 파랑(B), 명도 5, 채도 8을 뜻합니다. 색상은 각도가 아니라 색상환의 위치와 기호로 읽습니다.</div>`;
      
      let selectedHue = tenHues[6];
      const valueControl = host.querySelector('#valueControl');
      const chromaControl = host.querySelector('#chromaControl');
      const update = () => {
        const val = Number(valueControl.value);
        const chr = Number(chromaControl.value);
        const lightness = 8 + val * 8.4;
        const saturation = Math.min(92, chr * 7.5);
        host.querySelector('#propertyPreview').style.background = `hsl(${selectedHue.hue} ${saturation}% ${lightness}%)`;
        host.querySelector('#selectedHueName').textContent = `${selectedHue.code} · ${selectedHue.name}`;
        host.querySelector('#propertyNotation').textContent = `${selectedHue.code} ${val}/${chr}`;
        host.querySelector('#valueOutput').textContent = val;
        host.querySelector('#chromaOutput').textContent = chr;
        host.querySelector('#valueScale').innerHTML = Array.from({length:11}, (_, idx) => `<i style="background:hsl(${selectedHue.hue} ${saturation}% ${idx * 10}%)" title="명도 ${idx}"></i>`).join('');
        host.querySelector('#chromaScale').innerHTML = Array.from({length:7}, (_, idx) => `<i style="background:hsl(${selectedHue.hue} ${idx * 15}% 50%)" title="채도 ${idx * 2}"></i>`).join('');
      };
      host.querySelectorAll('[data-hue-index]').forEach((button) => button.addEventListener('click', () => {
        selectedHue = tenHues[Number(button.dataset.hueIndex)];
        host.querySelectorAll('[data-hue-index]').forEach((item) => item.classList.toggle('active', item === button));
        update();
      }));
      [valueControl, chromaControl].forEach((control) => control.addEventListener('input', update));
      update();
      return;
    }

    // 03. Mixing Lab
    if (study.type === 'mixing') {
      const mixOptions = [
        { label: '감산 혼합', title: '감산 혼합 · 안료와 인쇄의 원리', swatches: ['#00a8e8','#ec008c','#fff200','#000000'], body: '물감과 잉크는 특정 파장의 빛을 흡수하고 남은 빛만을 반사합니다. 안료를 섞을수록 빛의 흡수 대역이 합산되어 점점 어두운 검정에 가까워집니다. 인쇄 표준은 CMYK(시안, 마젠타, 옐로, 블랙)입니다.' },
        { label: '가산 혼합', title: '가산 혼합 · 빛과 디스플레이의 원리', swatches: ['#ff2a2a','#00e676','#2979ff','#ffffff'], body: '모니터와 조명처럼 발광하는 빛의 혼합입니다. 빛의 에너지를 더할수록 총 휘도가 증가하며, 빨강(R)과 초록(G)이 겹치면 노랑, 초록과 파랑(B)은 청록, 세 빛이 모두 더해지면 순수한 흰빛(White)이 됩니다.' },
        { label: '병치 혼합', title: '병치 혼합 · 망막에서 일어나는 광학적 합성', swatches: ['#2451a4','#f2a22c','#2451a4','#f2a22c','#8e724d'], body: '안료를 물리적으로 섞지 않고 캔버스 위에 독립된 순색의 미세한 점들을 교차 배치합니다. 관람자의 눈이 일정 거리 이상 떨어질 때, 망막 위에서 점들의 반사광이 자연스럽게 혼합되어 높은 채도와 광채를 유지합니다.' }
      ];
      host.innerHTML = `
        <div class="study-lab-container">
          <div class="study-tabs" role="tablist">
            ${mixOptions.map((opt, idx) => `<button type="button" role="tab" data-mix-index="${idx}" class="${idx === 0 ? 'active' : ''}">${opt.label}</button>`).join('')}
          </div>
          <div class="study-output" id="mixOutput"></div>
          <div class="pointillism-zoom-box" id="pointillismBox" hidden>
            <div class="pointillism-canvas" id="pointillismCanvas"></div>
            <input type="range" id="zoomSlider" min="4" max="32" value="16" aria-label="점묘 줌 크기">
          </div>
        </div>`;
      
      const mixOutput = host.querySelector('#mixOutput');
      const pointillismBox = host.querySelector('#pointillismBox');
      const zoomCanvas = host.querySelector('#pointillismCanvas');
      const zoomSlider = host.querySelector('#zoomSlider');

      const showMix = (idx) => {
        const opt = mixOptions[idx];
        mixOutput.innerHTML = `<h3>${opt.title}</h3><div class="swatch-strip">${opt.swatches.map((c) => `<i style="background:${c}"></i>`).join('')}</div><p>${opt.body}</p>`;
        host.querySelectorAll('[data-mix-index]').forEach((btn, i) => btn.classList.toggle('active', i === idx));
        pointillismBox.hidden = idx !== 2;
      };

      host.querySelectorAll('[data-mix-index]').forEach((btn) => btn.addEventListener('click', () => showMix(Number(btn.dataset.mixIndex))));
      if (zoomSlider) {
        zoomSlider.addEventListener('input', () => {
          const sz = zoomSlider.value;
          zoomCanvas.style.backgroundSize = `${sz}px ${sz}px`;
          zoomCanvas.style.backgroundPosition = `0 0, ${sz / 2}px ${sz / 2}px`;
        });
      }
      showMix(0);
      return;
    }

    // 04. Harmony Lab
    if (study.type === 'harmony') {
      const harmonyOptions = [
        { label: '유사색', title: '유사색 배색 · 인접 색상의 평온과 연속성', swatches: ['#1e3a8a','#2563eb','#38bdf8','#0284c7','#0369a1'], body: '색상환에서 이웃한 색들을 조합하여 평온하고 자연스러운 통일감을 창출합니다. 단조로움을 극복하기 위해 명도와 채도의 높낮이를 조절하는 것이 중요합니다.' },
        { label: '보색', title: '보색 배색 · 반대편 색채의 강렬한 생명력', swatches: ['#1e40af','#3b82f6','#f97316','#ea580c','#c2410c'], body: '색상환의 정반대 색상을 매칭하여 최대의 대비와 역동성을 발휘합니다. 두 색이 서로의 채도를 부각시켜 생생한 초점을 형성합니다.' },
        { label: '제한 배색', title: '면적비와 위계 배색 · 주조·보조·강조의 황금분할', swatches: ['#1e3a8a','#1e3a8a','#1e3a8a','#059669','#dc2626'], body: '주조색(60%), 보조색(30%), 강조색(10%)의 면적 비율을 설정하면 적은 수의 색채로도 압도적인 시각적 위계와 품격을 완성할 수 있습니다.' }
      ];
      host.innerHTML = `
        <div class="study-lab-container">
          <div class="study-tabs" role="tablist">
            ${harmonyOptions.map((opt, idx) => `<button type="button" role="tab" data-harmony-index="${idx}" class="${idx === 0 ? 'active' : ''}">${opt.label}</button>`).join('')}
          </div>
          <div class="study-output" id="harmonyOutput"></div>
        </div>`;
      const harmonyOutput = host.querySelector('#harmonyOutput');
      const showHarmony = (idx) => {
        const opt = harmonyOptions[idx];
        harmonyOutput.innerHTML = `<h3>${opt.title}</h3><div class="swatch-strip">${opt.swatches.map((c) => `<i style="background:${c}"></i>`).join('')}</div><p>${opt.body}</p>`;
        host.querySelectorAll('[data-harmony-index]').forEach((btn, i) => btn.classList.toggle('active', i === idx));
      };
      host.querySelectorAll('[data-harmony-index]').forEach((btn) => btn.addEventListener('click', () => showHarmony(Number(btn.dataset.harmonyIndex))));
      showHarmony(0);
      return;
    }

    // 06. Elements
    if (study.type === 'elements') {
      const elementOptions = [
        { label: '선', title: '방향과 속도의 시각화', body: '단순히 "선이 많다"에 그치지 않고, 뭉크의 〈절규〉처럼 사선의 급격한 원근감과 하늘의 소용돌이 곡선이 관람자의 시선을 어떻게 뒤흔드는지 선의 굵기, 속도, 방향을 정밀하게 기술합니다.' },
        { label: '형·공간', title: '양의 형태와 음의 여백', body: '인물의 길게 늘어진 비정형적 형태(양의 공간)와 그 뒤편의 피오르 만(음의 공간) 사이의 긴장감을 분석합니다. 여백 역시 화면의 호흡과 불안감을 조율하는 적극적 조형 요소입니다.' },
        { label: '질감·명암', title: '표면 질감과 심리적 명암', body: '파스텔과 템페라 물감이 긁히듯 지나간 판지 표면의 거친 질감(마티에르)과, 빛의 부재 속에서 요동치는 명암의 그라데이션이 전달하는 질식할 듯한 감정을 포착합니다.' }
      ];
      host.innerHTML = `
        <div class="study-lab-container">
          <div class="study-tabs" role="tablist">
            ${elementOptions.map((opt, idx) => `<button type="button" role="tab" data-elem-index="${idx}" class="${idx === 0 ? 'active' : ''}">${opt.label}</button>`).join('')}
          </div>
          <div class="study-output" id="elemOutput"></div>
        </div>`;
      const elemOutput = host.querySelector('#elemOutput');
      const showElem = (idx) => {
        const opt = elementOptions[idx];
        elemOutput.innerHTML = `<h3>${opt.title}</h3><p>${opt.body}</p>`;
        host.querySelectorAll('[data-elem-index]').forEach((btn, i) => btn.classList.toggle('active', i === idx));
      };
      host.querySelectorAll('[data-elem-index]').forEach((btn) => btn.addEventListener('click', () => showElem(Number(btn.dataset.elemIndex))));
      showElem(0);
      return;
    }

    // 07. Principles
    if (study.type === 'principles') {
      const principleOptions = [
        { label: '균형', title: '비대칭 균형 · 시각적 무게감의 역동적 평형', body: '동일한 형태의 기계적 대칭이 아닌, 몬드리안처럼 거대한 빨강 면과 작은 파랑·노랑의 면이 서로 다른 크기와 채도로 팽팽한 시각적 균형점을 형성하는 상태입니다.' },
        { label: '강조', title: '초점(Focal Point)의 구축', body: '주변의 무채색과 수직·수평선 속에서 홀로 순수한 삼원색을 발하는 지점이 시각적 초점이 됩니다. 모든 것을 강조하면 아무것도 강조되지 않는다는 것이 조형의 기본입니다.' },
        { label: '리듬', title: '선과 격자의 음악적 운율', body: '검은 직선들이 교차하며 만들어내는 사각형들의 크기 변화는 화면에 스타카토와 레가토 같은 시각적 박자감을 부여합니다.' }
      ];
      host.innerHTML = `
        <div class="study-lab-container">
          <div class="study-tabs" role="tablist">
            ${principleOptions.map((opt, idx) => `<button type="button" role="tab" data-princ-index="${idx}" class="${idx === 0 ? 'active' : ''}">${opt.label}</button>`).join('')}
          </div>
          <div class="study-output" id="princOutput"></div>
        </div>`;
      const princOutput = host.querySelector('#princOutput');
      const showPrinc = (idx) => {
        const opt = principleOptions[idx];
        princOutput.innerHTML = `<h3>${opt.title}</h3><p>${opt.body}</p>`;
        host.querySelectorAll('[data-princ-index]').forEach((btn, i) => btn.classList.toggle('active', i === idx));
      };
      host.querySelectorAll('[data-princ-index]').forEach((btn) => btn.addEventListener('click', () => showPrinc(Number(btn.dataset.princIndex))));
      showPrinc(0);
      return;
    }

    // 08. Space
    if (study.type === 'space') {
      const spaceOptions = [
        { label: '선 원근', title: '선 원근법 · 1점 투시로 구축한 기하학적 깊이', body: '다 빈치의 〈최후의 만찬〉처럼 모든 벽면과 천장선이 지평선 위 단 하나의 소실점(예수의 머리)으로 수렴하며 관람자를 정해진 관찰 위치에 몰입시킵니다.' },
        { label: '다시점', title: '다시점과 여백 · 이동하며 노니는 파노라마 공간', body: '정선의 〈금강전도〉처럼 한자리에 묶이지 않고 고원(아래서 위로), 심원(앞에서 뒤로), 평원(수평으로 펼쳐짐)을 복합적으로 운용하여 산의 총체적 영기를 담아냅니다.' },
        { label: '여백', title: '비어 있음의 조형적 숨결', body: '여백은 단순한 미완성이 아니라 구름, 안개, 시간의 흐름, 그리고 관람자의 마음이 머무는 사유의 공간으로서 평면에 깊은 호흡을 불어넣습니다.' }
      ];
      host.innerHTML = `
        <div class="study-lab-container">
          <div class="study-tabs" role="tablist">
            ${spaceOptions.map((opt, idx) => `<button type="button" role="tab" data-space-index="${idx}" class="${idx === 0 ? 'active' : ''}">${opt.label}</button>`).join('')}
          </div>
          <div class="study-output" id="spaceOutput"></div>
        </div>`;
      const spaceOutput = host.querySelector('#spaceOutput');
      const showSpace = (idx) => {
        const opt = spaceOptions[idx];
        spaceOutput.innerHTML = `<h3>${opt.title}</h3><p>${opt.body}</p>`;
        host.querySelectorAll('[data-space-index]').forEach((btn, i) => btn.classList.toggle('active', i === idx));
      };
      host.querySelectorAll('[data-space-index]').forEach((btn) => btn.addEventListener('click', () => showSpace(Number(btn.dataset.spaceIndex))));
      showSpace(0);
      return;
    }

    // 09. Formal Analysis Workflow
    if (study.type === 'analysisWorkflow') {
      const stepOptions = [
        { label: '1. 관찰', title: '감상과 객관적 사실의 분리', body: '“공주가 가련해 보인다”는 주관적 해석이지만, “흰 드레스를 입은 어린 공주 주변에 두 시녀가 몸을 숙이고 있다”는 객관적 관찰입니다. 누구나 화면에서 확인할 수 있는 물리적 사실을 먼저 분리해 기록합니다.' },
        { label: '2. 분석', title: '조형 요소와 원리의 인과관계 규명', body: '색, 선, 형태를 무의미하게 나열하는 대신 “배경의 어두운 실내와 중앙 인물의 명도 대비가 시선을 1차 초점으로 집중시킨다”처럼 조형적 원인과 시각적 효과를 결합합니다.' },
        { label: '3. 해석', title: '시대적 맥락과 상징의 논리적 도출', body: '작품 정보와 조형 증거를 종합하여 작품이 궁극적으로 관람자에게 전하는 심리적·철학적 메시지와 화가의 예술적 선언을 논리적으로 이끌어냅니다.' },
        { label: '4. 판단', title: '개인적 호불호와 예술적 성취의 구분', body: '“내 취향에 맞는다”와 “시대적 한계를 극복한 위대한 걸작이다”는 전혀 다른 평가입니다. 조형적 완결성과 미술사적 기여를 잣대로 합리적 평가를 내립니다.' }
      ];
      host.innerHTML = `
        <div class="study-lab-container">
          <div class="study-tabs" role="tablist">
            ${stepOptions.map((opt, idx) => `<button type="button" role="tab" data-step-index="${idx}" class="${idx === 0 ? 'active' : ''}">${opt.label}</button>`).join('')}
          </div>
          <div class="study-output" id="stepOutput"></div>
        </div>`;
      const stepOutput = host.querySelector('#stepOutput');
      const showStep = (idx) => {
        const opt = stepOptions[idx];
        stepOutput.innerHTML = `<h3>${opt.title}</h3><p>${opt.body}</p>`;
        host.querySelectorAll('[data-step-index]').forEach((btn, i) => btn.classList.toggle('active', i === idx));
      };
      host.querySelectorAll('[data-step-index]').forEach((btn) => btn.addEventListener('click', () => showStep(Number(btn.dataset.stepIndex))));
      showStep(0);
      return;
    }

    // Default fallback
    host.innerHTML = `<div class="study-tabs" role="tablist">${study.options.map((option, index) => `<button type="button" role="tab" data-study-index="${index}" aria-selected="${index === 0}" class="${index === 0 ? 'active' : ''}">${option.label}</button>`).join('')}</div><div class="study-output" role="tabpanel"></div>`;
    const output = host.querySelector('.study-output');
    const showOption = (index) => {
      const option = study.options[index];
      const swatches = option.swatches ? `<div class="swatch-strip" aria-label="${option.label} 색 조합">${option.swatches.map((color) => `<i style="background:${color}"></i>`).join('')}</div>` : '';
      output.innerHTML = `<h3>${option.title}</h3>${swatches}<p>${option.body}</p>${option.note ? `<p><strong>살펴볼 점:</strong> ${option.note}</p>` : ''}`;
      host.querySelectorAll('[data-study-index]').forEach((button, buttonIndex) => {
        const active = buttonIndex === index;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
      });
    };
    host.querySelectorAll('[data-study-index]').forEach((button) => button.addEventListener('click', () => showOption(Number(button.dataset.studyIndex))));
    showOption(0);
  }

  function renderQuiz(quiz) {
    const host = document.getElementById('checkContent');
    host.innerHTML = `
      <p class="check-question">${quiz.question}</p>
      <div class="answer-list">
        ${quiz.choices.map((choice, index) => `<button type="button" data-answer="${index}"><span class="choice-num">${index + 1}.</span> <span class="choice-text">${choice}</span></button>`).join('')}
      </div>
      <p class="check-feedback" aria-live="polite" hidden></p>`;
    
    const feedback = host.querySelector('.check-feedback');
    host.querySelectorAll('[data-answer]').forEach((button) => button.addEventListener('click', () => {
      const selected = Number(button.dataset.answer);
      host.querySelectorAll('[data-answer]').forEach((item) => item.classList.remove('correct', 'wrong'));
      button.classList.add(selected === quiz.correct ? 'correct' : 'wrong');
      host.querySelector(`[data-answer="${quiz.correct}"]`).classList.add('correct');
      feedback.hidden = false;
      feedback.innerHTML = `<strong>${selected === quiz.correct ? '정답입니다.' : '오답입니다.'}</strong> ${quiz.explanation}`;
    }));
  }

  const sectionTabs = [...document.querySelectorAll('[data-panel]')];
  function showPanel(id, focus = false) {
    sectionTabs.forEach((tab) => {
      const selected = tab.dataset.panel === id;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.dataset.panel).hidden = !selected;
      if (selected && focus) tab.focus();
    });
  }
  sectionTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showPanel(tab.dataset.panel));
    tab.addEventListener('keydown', (event) => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % sectionTabs.length;
      else if (event.key === 'ArrowLeft') next = (index + sectionTabs.length - 1) % sectionTabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = sectionTabs.length - 1;
      else return;
      event.preventDefault();
      showPanel(sectionTabs[next].dataset.panel, true);
    });
  });

  function showLesson(id) {
    const index = lessons.findIndex((lesson) => lesson.id === id);
    if (index < 0) return;
    const lesson = lessons[index];
    currentIndex = index;
    courseMenu.hidden = true;
    lessonView.hidden = false;
    document.getElementById('lessonKicker').textContent = `${lesson.number}차시 · ${lesson.track}`;
    document.getElementById('lessonTitle').textContent = lesson.title;
    document.getElementById('lessonQuestion').textContent = lesson.question;
    document.getElementById('conceptContent').innerHTML = lesson.concept;
    document.getElementById('analysisContent').innerHTML = lesson.analysis;
    renderVisual(lesson.visual);
    renderStudy(lesson.study);
    renderQuiz(lesson.quiz);
    showPanel('observePanel');
    document.querySelector('.concept-details').open = false;
    document.getElementById('lessonTitle').focus({ preventScroll: true });
    previousLesson.disabled = index === 0;
    nextLesson.disabled = index === lessons.length - 1;
    document.title = `${lesson.title} · 미술 이론`;
    window.scrollTo(0, 0);
  }

  function showCourseMenu() {
    lessonView.hidden = true;
    courseMenu.hidden = false;
    document.title = '미술 이론 · 색채와 조형';
    document.querySelector(`[data-open-lesson="${lessons[currentIndex].id}"]`).focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  document.querySelectorAll('[data-open-lesson]').forEach((button) => button.addEventListener('click', () => showLesson(button.dataset.openLesson)));
  document.getElementById('courseListButton').addEventListener('click', showCourseMenu);
  previousLesson.addEventListener('click', () => showLesson(lessons[currentIndex - 1].id));
  nextLesson.addEventListener('click', () => showLesson(lessons[currentIndex + 1].id));
  window.addEventListener('sitebackrequest', (event) => {
    if (lessonView.hidden) return;
    event.preventDefault();
    showCourseMenu();
  });
})();
