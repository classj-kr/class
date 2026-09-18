(function () {
  'use strict';

  // 100% Authentic Local Real Photographs Mapping
  const REAL_RELIC_IMAGES = {
    p01: 'assets/relics/p01.jpg', p02: 'assets/relics/p02.jpg', p03: 'assets/relics/p03.jpg', p04: 'assets/relics/p04.jpg',
    p05: 'assets/relics/p05.jpg', p06: 'assets/relics/p06.jpg', p07: 'assets/relics/p07.jpg', p08: 'assets/relics/p08.jpg',
    p09: 'assets/relics/p09.jpg', p10: 'assets/relics/p10.jpg', p11: 'assets/relics/p11.jpg',

    g01: 'assets/relics/g01.jpg', g02: 'assets/relics/g02.jpg', g03: 'assets/relics/g03.jpg', g04: 'assets/relics/g04.jpg', g05: 'assets/relics/g05.jpg',
    g06: 'assets/relics/g06.jpg',

    b01: 'assets/relics/b01.jpg', b02: 'assets/relics/b02.jpg', b03: 'assets/relics/b03.jpg', b04: 'assets/relics/b04.jpg',
    b05: 'assets/relics/b05.jpg',
    a01: 'assets/relics/a01.jpg',

    s01: 'assets/relics/s01.jpg', s02: 'assets/relics/s02.jpg', s03: 'assets/relics/s03.jpg', s04: 'assets/relics/s04.jpg',
    s05: 'assets/relics/s05.jpg', s06: 'assets/relics/s06.jpg', s07: 'assets/relics/s07.jpg', s08: 'assets/relics/s08.jpg',
    s09: 'assets/relics/s09.jpg', s10: 'assets/relics/s10.jpg', s11: 'assets/relics/s11.jpg', s12: 'assets/relics/s12.jpg',
    s13: 'assets/relics/s13.jpg', s14: 'assets/relics/s14.jpg', s15: 'assets/relics/s15.jpg',
    s16: 'assets/relics/s16.jpg', s17: 'assets/relics/s17.jpg',

    k01: 'assets/relics/k01.jpg', k02: 'assets/relics/k02.jpg', k03: 'assets/relics/k03.jpg', k04: 'assets/relics/k04.jpg',
    k05: 'assets/relics/k05.jpg', k06: 'assets/relics/k06.jpg', k07: 'assets/relics/k07.jpg', k08: 'assets/relics/k08.jpg',

    j01: 'assets/relics/j01.jpg', j02: 'assets/relics/j02.jpg', j03: 'assets/relics/j03.jpg', j04: 'assets/relics/j04.jpg',
    j05: 'assets/relics/j05.jpg', j06: 'assets/relics/j06.jpg', j07: 'assets/relics/j07.jpg', j08: 'assets/relics/j08.jpg',
    j09: 'assets/relics/j09.jpg', j10: 'assets/relics/j10.jpg', j11: 'assets/relics/j11.jpg', j12: 'assets/relics/j12.jpg',
    j13: 'assets/relics/j13.jpg', j15: 'assets/relics/j15.jpg', j16: 'assets/relics/j16.jpg', j17: 'assets/relics/j17.jpg',
    j18: 'assets/relics/j18.jpg', j19: 'assets/relics/j19.jpg', j20: 'assets/relics/j20.jpg',

    l01: 'assets/relics/l01.jpg', l02: 'assets/relics/l02.jpg', l03: 'assets/relics/l03.jpg', l04: 'assets/relics/l04.jpg',

    m01: 'assets/relics/m01.jpg', m02: 'assets/relics/m02.jpg', m03: 'assets/relics/m03.jpg', m04: 'assets/relics/m04.jpg',
    m05: 'assets/relics/m05.jpg', m06: 'assets/relics/m06.jpg', m07: 'assets/relics/m07.gif'
  };

  function getArtifactImageURL(id) {
    const imagePath = REAL_RELIC_IMAGES[id] || `assets/relics/${id}.jpg`;
    return `${imagePath}?v=20260731-3`;
  }

  const RELIC_CONTEXT = {
    p01: '바닥이 뾰족하거나 둥근 형태와 표면의 빗살무늬가 특징입니다. 강가와 바닷가의 신석기 유적에서 자주 발견되어 정착 생활과 음식 저장·조리 방식을 보여 줍니다.',
    p02: '고인돌은 지배층의 무덤이자 공동체의 노동력을 동원할 수 있었던 권력의 증거입니다. 한반도에 특히 밀집해 있어 청동기 사회의 규모와 계층 분화를 이해하는 핵심 자료입니다.',
    p03: '검몸 가운데가 불룩해 비파를 닮았으며 손잡이를 따로 끼우는 조립식 구조입니다. 중국 동북 지역과 한반도 북부에 걸친 분포는 고조선 문화권을 살피는 중요한 단서로 활용됩니다.',
    p04: '팔주령은 여덟 갈래 끝에 방울이 달린 청동 의식구입니다. 무기보다 제사와 권위를 드러내는 데 사용되어 청동기 지배자가 정치와 제사를 함께 주관했음을 보여 줍니다.',
    p05: '양쪽 면을 떼어 내 끝을 뾰족하게 만든 다목적 석기로 자르기·찍기·파기 등에 사용했습니다. 전곡리 발견은 동아시아 구석기 문화를 단순하게 구분하던 기존 학설을 재검토하는 계기가 되었습니다.',
    p06: '양쪽에 손잡이가 달린 독특한 항아리로 중국 랴오닝 지역과 한반도 서북부에서 확인됩니다. 출토 범위는 고조선의 문화적 교류권을 추정하는 자료로 사용됩니다.',
    p07: '구멍에 끈을 꿰어 손에 고정하고 곡식의 이삭을 잘라 수확했습니다. 청동기 시대에 벼농사가 확대되고 농경 도구가 전문화되었음을 보여 줍니다.',
    p08: '거울 뒷면에 삼각형과 동심원 무늬를 매우 가는 선으로 새기고 두 개의 꼭지를 달았습니다. 정교한 주조 기술과 함께 청동 거울이 지배층의 권위·의례와 연결되었음을 보여 줍니다.',
    p09: '비파형 동검보다 검몸이 가늘고 곧은 한국식 청동검입니다. 한반도에서 독자적인 청동기 문화가 발전하고 철기 문화로 이행하던 모습을 보여 줍니다.',
    p10: '참성단은 단군이 하늘에 제사를 올렸다는 전승과 연결된 제단입니다. 현재의 석축은 여러 시기에 걸쳐 보수되어 전승과 실제 건축 역사를 구분해 이해할 필요가 있습니다.',
    p11: '땅을 파서 바닥을 낮추고 지붕을 씌운 움집은 온도를 유지하기에 유리했습니다. 화덕·저장 구덩이·기둥 자리를 통해 신석기 가족의 정착 생활을 구체적으로 알 수 있습니다.',
    g01: '말을 탄 인물들이 활로 사냥하는 장면은 고구려인의 역동적인 생활과 기마 문화를 보여 줍니다. 무덤 벽화는 글로 남지 않은 복식·무기·신앙을 복원하는 중요한 시각 자료입니다.',
    g02: '장수왕이 414년에 세운 비로 광개토대왕의 정복 활동과 왕권을 장문의 한문으로 기록했습니다. 고구려의 대외 관계와 영역을 연구할 때 가장 중요한 1차 사료 가운데 하나입니다.',
    g03: '세 발 달린 까마귀 삼족오는 태양을 상징하는 동아시아의 신화적 존재입니다. 고구려 고분 벽화의 해와 달 표현은 왕실의 우주관과 사후 세계에 대한 믿음을 보여 줍니다.',
    g04: '5세기 무렵 세워진 것으로 보이는 비석으로 한반도에 남은 유일한 고구려 비입니다. 고구려 세력이 충주 일대까지 내려왔으며 신라와 관계를 맺었음을 비문을 통해 확인할 수 있습니다.',
    g05: '큰 돌을 계단처럼 쌓아 만든 돌무지무덤으로 고구려 지배층의 장례 문화를 보여 줍니다. 견고한 축조 방식과 거대한 규모에서 당시의 동원력과 건축 기술을 읽을 수 있습니다.',
    b01: '용과 봉황, 연꽃, 산봉우리, 인물과 동물이 한 향로 안에 정교하게 표현되어 있습니다. 백제의 금속 공예 기술뿐 아니라 불교·도교적 세계관이 어우러진 모습을 보여 줍니다.',
    b02: '1971년 배수로 공사 중 발견된 무령왕릉은 도굴되지 않은 채 왕과 왕비의 지석과 부장품이 남아 있었습니다. 지석 덕분에 무덤의 주인과 사망 연대를 정확히 알 수 있는 드문 왕릉입니다.',
    b03: '목탑의 비례를 돌로 옮긴 백제계 석탑으로, 좁고 높은 1층 탑신과 부드러운 체감이 특징입니다. 백제 석탑 양식이 이후 한국 석탑에 미친 영향을 보여 줍니다.',
    s01: '나뭇가지 모양 세움 장식과 곡옥은 왕의 권위와 신성성을 상징합니다. 얇은 금판과 금실을 사용한 세공은 신라 지배층의 화려한 장례 문화와 국제 교류를 보여 줍니다.',
    s02: '불국사 석가탑에서 발견된 불교 주문집으로 8세기 초 목판 인쇄물입니다. 통일신라의 불교 신앙과 높은 인쇄 기술을 함께 보여 주는 자료입니다.',
    s03: '자연 동굴이 아니라 화강암을 다듬어 인공적으로 만든 석굴 사원입니다. 본존불을 중심으로 보살과 제자상을 배치한 공간 구성은 통일신라 불교 조각의 절정을 보여 줍니다.',
    s04: '자작나무 껍질로 만든 말다래에 흰 말을 그린 그림으로 천마총에서 출토되었습니다. 실제 회화가 드문 신라 미술에서 당시의 선묘와 말 장식을 알려 주는 귀중한 자료입니다.',
    s05: '돌을 층층이 쌓은 원통형 천문 시설로 선덕여왕 때 조성된 것으로 봅니다. 천체 관측과 농사 시기 판단을 중시한 신라의 과학 활동을 상징합니다.',
    s06: '선덕여왕 때 자장의 건의로 세웠다고 전하는 거대한 목탑으로 고려 몽골 침입 때 소실되었습니다. 발굴된 기단과 초석은 신라 왕경의 규모와 호국 불교의 성격을 보여 줍니다.',
    s07: '벽돌처럼 다듬은 안산암을 쌓아 만든 신라 초기 석탑입니다. 중국 전탑의 모습을 신라식 석재 건축으로 바꾼 사례로 이후 모전석탑 양식의 출발점이 되었습니다.',
    s08: '진흥왕이 새 영토를 직접 순행한 사실과 수행 인물을 비문에 새긴 순수비입니다. 신라의 한강 유역 진출과 중앙 집권 강화를 확인할 수 있는 핵심 금석문입니다.',
    s09: '두 청년이 유교 경전과 도덕을 공부하겠다고 맹세한 내용을 돌에 새겼습니다. 신라 청년층에 한문과 유교 윤리가 수용되던 모습을 보여 주는 생활사 자료입니다.',
    s10: '불교 공인을 위해 순교한 이차돈의 이야기를 여섯 면에 새긴 비석입니다. 신라 왕권이 불교를 받아들여 사상적 통합을 추진한 과정을 상징합니다.',
    s11: '성덕왕의 공덕을 기리기 위해 시작해 혜공왕 때인 771년에 완성한 대형 범종입니다. 비천상과 명문, 깊고 긴 울림은 통일신라 주조 기술과 불교 미술의 수준을 보여 줍니다.',
    s12: '열네 면에 벌칙과 놀이 동작을 적은 주사위로 동궁과 월지에서 발견되었습니다. 통일신라 귀족의 연회와 놀이 문화를 생생하게 보여 주는 생활 유물입니다.',
    s13: '높은 받침과 간결한 비례를 갖춘 거대한 석등으로 발해의 수도 상경 용천부 불교 문화를 대표합니다. 고구려 계승 의식과 당 문화의 영향을 함께 살필 수 있습니다.',
    s14: '석가불과 다보불이 한 대좌에 나란히 앉은 모습은 법화경의 장면을 형상화한 것입니다. 발해에서 불교가 널리 유행했고 주변 국가와 조각 양식을 교류했음을 보여 줍니다.',
    k01: '표면을 파낸 뒤 흰색과 검은색 흙을 채워 학과 구름을 표현한 상감 기법이 특징입니다. 비색 유약과 정교한 무늬는 고려 귀족 문화와 도자 기술의 높은 수준을 보여 줍니다.',
    k02: '몽골 침입을 불교의 힘으로 극복하려는 염원에서 13세기에 다시 새긴 대장경판입니다. 정확한 교정과 일정한 글씨, 보존 기술 때문에 불교 경전 연구의 세계적 자료가 되었습니다.',
    k03: '1377년 청주 흥덕사에서 금속 활자로 찍은 불교 서적으로 현존하는 세계 최고 금속활자본입니다. 인쇄 기술의 발전과 고려 불교 지식의 유통을 보여 줍니다.',
    k04: '백제 왕이 왜왕에게 보낸 것으로 해석되는 일곱 갈래 철제 칼이며 일본 이소노카미 신궁에 전해집니다. 칼에 새긴 명문은 백제와 왜의 외교 관계를 연구하는 중요한 자료입니다.',
    k05: '팔각 평면과 여러 층의 처마, 풍경 장식이 특징인 고려 전기 석탑입니다. 신라 석탑과 다른 고려 지역 양식과 불교 조형의 다양성을 보여 줍니다.',
    k06: '대리석으로 만든 10층 석탑으로 원나라 계통의 라마교적 조각과 복잡한 건축 표현이 나타납니다. 일제강점기에 반출되었다가 돌아와 복원된 과정도 문화재 보존사의 중요한 사례입니다.',
    k07: '968년에 완성된 높이 약 18미터의 거대한 석불로 머리 위 높은 보관과 길게 늘어진 신체가 특징입니다. 지역적 미감이 강한 고려 초기 불교 조각의 대표작입니다.',
    k08: '배흘림기둥과 주심포 구조를 갖춘 고려시대 목조건축입니다. 건물과 아미타불의 방향, 공간 구성을 통해 고려 불교 건축과 신앙을 함께 이해할 수 있습니다.',
    j01: '1446년에 반포된 해설서로 새 문자의 자음·모음 제작 원리와 사용 예를 설명합니다. 문자를 만든 원리와 목적을 창제자가 직접 남긴 세계적으로 드문 기록입니다.',
    j02: '물의 흐름으로 시간을 측정하고 정해진 시각에 종·북·징이 자동으로 울리도록 만든 장치입니다. 천문 관측과 국가 표준 시간을 연결한 세종대 과학 기술을 보여 줍니다.',
    j03: '안평대군의 꿈을 안견이 1447년에 그린 산수화로 현실에서 이상향으로 이동하는 장면을 긴 두루마리에 담았습니다. 조선 전기 회화와 지식인 문화의 수준을 보여 줍니다.',
    j04: '한양도성의 남쪽 정문으로 1398년에 세우고 세종 때 크게 고쳐 지었습니다. 도성의 교통·의례 질서와 조선 초기 목조건축을 대표합니다.',
    j05: '한양도성 동쪽 정문으로 현재 건물은 1869년에 다시 지었습니다. 성문 바깥을 반달 모양 옹성이 감싸 방어 기능을 강화한 점이 특징입니다.',
    j06: '1395년에 창건한 조선의 법궁으로 임진왜란 때 소실된 뒤 고종 때 흥선대원군이 중건했습니다. 근정전·경회루 등은 왕실 의례와 통치 공간의 질서를 보여 줍니다.',
    j07: '1402년에 제작된 세계지도로 조선과 중국을 크게 그리고 유럽·아프리카까지 표현했습니다. 동아시아 지리 지식과 이슬람권 세계지도가 결합된 조선 초기의 국제적 시야를 보여 줍니다.',
    j08: '별자리와 하늘의 구역을 돌에 새긴 천문도로 태조 때 제작되었습니다. 왕조가 하늘의 질서를 관측하고 통치의 정당성과 연결했던 전통을 보여 줍니다.',
    j09: '백 리를 일정한 길이로 표시하는 백리척을 사용해 실제 거리를 비교할 수 있게 했습니다. 조선 후기 실학적 지리 인식과 지도 제작의 정밀화를 보여 줍니다.',
    j10: '마테오 리치가 1602년 중국에서 제작한 한문 세계지도로 조선 지식인에게 새로운 대륙과 바다 정보를 전했습니다. 전통적 중화 세계관이 확장되는 계기가 되었습니다.',
    j11: '송이영이 1669년에 만든 기계식 천문 시계로 혼천의와 서양식 시계 장치를 결합했습니다. 천체의 움직임과 시간을 하나의 장치로 보여 주는 조선 후기 과학 유물입니다.',
    j12: '세종대에는 측우기를 전국 관청에 보급하고 같은 규격으로 강우량을 보고하게 했습니다. 현재 남아 있는 1837년 공주 충청감영 측우기는 조선의 체계적인 기상 관측 전통을 증명합니다.',
    j13: '오목한 솥 모양의 해시계로 그림자 위치를 통해 시각과 절기를 읽었습니다. 글을 모르는 백성도 시간을 알 수 있도록 동물 그림을 사용한 공공 과학 기구였습니다.',
    j14: '1444년에 완성한 역법서로 중국의 수시력과 이슬람 천문학을 조선의 한양 위치에 맞게 계산했습니다. 조선이 독자적인 천문·달력 계산 체계를 갖추었음을 보여 줍니다.',
    j15: '정선이 1751년 비가 갠 뒤 인왕산의 실제 모습을 강한 먹의 농담으로 표현했습니다. 중국의 관념적 산수에서 벗어나 우리 산천을 그린 진경산수화의 대표작입니다.',
    j16: '세조 때 원각사에 세운 대리석 10층 석탑으로 고려 경천사지 십층석탑의 양식을 계승했습니다. 탑면의 세밀한 불교 조각과 다층 건축 표현이 특징입니다.',
    j17: '정조가 1794~1796년에 축성한 계획도시 성곽으로 정약용의 설계와 거중기 등 새 기술이 활용되었습니다. 공사 전 과정을 기록한 화성성역의궤 덕분에 복원과 연구가 가능합니다.',
    l01: '씨름판을 원형 구도로 배치하고 주변 인물의 시선과 표정을 생동감 있게 묘사했습니다. 조선 후기 서민의 놀이·복식·생활상을 기록한 풍속화입니다.',
    l02: '큰 그릇 두 개를 따로 만든 뒤 이어 붙여 둥근 달 모양을 완성했습니다. 완벽하게 대칭적이지 않은 형태와 담백한 흰빛은 조선 후기 백자의 미감을 보여 줍니다.',
    l03: '김정호가 1861년에 간행한 22첩 목판 지도로 산줄기·물길·도로·역참을 체계적으로 표시했습니다. 10리마다 점을 찍어 이동 거리를 가늠할 수 있게 한 실용 지도입니다.',
    m01: '독립협회가 청의 사신을 맞던 영은문 자리에 1897년 세운 석조문입니다. 사대 관계에서 벗어나 자주독립 국가를 지향한 대한제국기 개혁 의식을 상징합니다.',
    m02: '안중근이 뤼순 감옥에서 남긴 글씨에는 단지동맹으로 잘린 왼손 약지의 손도장이 찍혀 있습니다. 하얼빈 의거와 동양 평화론을 함께 기억하게 하는 독립운동 자료입니다.',
    m03: '한국광복군 대원과 관계자들이 조국 광복을 염원하는 문구와 이름을 태극기 위에 적었습니다. 망명지에서 이어진 독립전쟁의 의지와 공동체의 흔적을 보여 주는 기록 유산입니다.',
    m04: '흥선대원군이 1871년 신미양요 뒤 서양과의 통상을 거부한다는 글을 새겨 전국에 세웠습니다. 병인양요·신미양요 이후 강화된 통상 수교 거부 정책을 상징합니다.',
    m05: '서재필이 1896년에 창간한 최초의 민간 신문으로 한글판과 영문판을 함께 발행했습니다. 대중에게 근대적 정치·사회 정보를 전하고 독립협회 활동을 알리는 역할을 했습니다.',
    m06: '대한제국 황실이 사용하기 위해 서양 신고전주의 양식으로 지은 궁전입니다. 해방 뒤 미소공동위원회가 열린 장소로 대한제국과 현대사가 겹치는 공간입니다.'
  };

  // Master Korean History Relics & Monuments Dataset
  const RELICS_MASTER = [
    // --- 1. 선사 시대 & 고조선 ---
    { id: 'p01', title: '빗살무늬토기', titleEn: 'Comb-pattern Pottery', eraCategory: 'prehistoric', era: '신석기 시대 (B.C. 4000년경)', route: '경부선', lat: 37.5583, lng: 127.1306, location: '서울 암사동 선사 유적지', museum: '국립중앙박물관 (보물 제1544호)', designation: '보물 제1544호', docent: '신석기 시대 농경과 정착을 상징하는 대표 토기입니다.', examTip: '📌 [내신/수능 핵심] 신석기 = 농경, 정착, 빗살무늬토기, 가락바퀴, 움집!', quiz: { question: '신석기 시대 곡식을 저장했던 토기는?', options: ['빗살무늬토기', '미송리식 토기', '민무늬 토기', '붉은 간 토기'], answer: 0, explanation: '신석기 대표 토기입니다.' } },
    { id: 'p02', title: '강화 탁자식 고인돌', titleEn: 'Table-type Dolmen', eraCategory: 'prehistoric', era: '청동기 시대 / 고조선', route: '서해안선', lat: 37.7712, lng: 126.4523, location: '인천 강화 고인돌 유적', museum: '유네스코 세계문화유산', designation: '유네스코 세계유산', docent: '청동기 시대 족장의 강력한 권력과 고조선 세력 범위를 보여줍니다.', examTip: '📌 [내신/수능 핵심] 고조선 세력 범위 = 탁자식 고인돌 + 비파형 동검!', quiz: { question: '청동기 족장 권력과 고조선 세력 범위를 상징하는 유적은?', options: ['강화 탁자식 고인돌', '마니산 참성단', '서울 암사동 움집', '연천 전곡리 유적'], answer: 0, explanation: '고조선 세력 범위 대표 유적입니다.' } },
    { id: 'p03', title: '비파형 동검', titleEn: 'Lute-shaped Bronze Dagger', eraCategory: 'prehistoric', era: '청동기 시대 / 고조선', route: '경부선', lat: 37.5239, lng: 126.9804, location: '만주 요령 ~ 한반도 전역', museum: '국립중앙박물관', designation: '청동기 대표 유물', docent: '실제 무기로 사용할 수 있었지만, 청동기 시대 수장의 권위와 지위를 드러내는 상징물로도 쓰였습니다.', examTip: '비파형 동검은 고조선의 문화 범위와 지배층의 권위를 보여 줍니다.', quiz: { question: '고조선의 문화 범위와 지배층의 권위를 보여 주는 청동검은?', options: ['비파형 동검', '세형 동검', '중국식 동검', '칠지도'], answer: 0, explanation: '비파형 동검은 무기이면서 수장의 권위를 나타내는 상징물이었습니다.' } },
    { id: 'p04', title: '팔주령 (8가지 청동 방울)', titleEn: 'Eight-pointed Bronze Bell', eraCategory: 'prehistoric', era: '청동기 시대', route: '서해안선', lat: 35.0642, lng: 126.9855, location: '전남 화순 대곡리 유적', museum: '국립중앙박물관 (국보 제143호)', designation: '국보 제143호', docent: '제정일치 사회의 지배자가 사용하던 의식 도구입니다.', examTip: '📌 [내신/수능 핵심] 청동 방울 = 제정일치 제사장(천군) 도구!', quiz: { question: '제정일치 사회 제사장 의식 도구는?', options: ['팔주령', '자격루', '혼천의', '성덕대왕신종'], answer: 0, explanation: '제정일치 의식 도구입니다.' } },
    { id: 'p05', title: '연천 전곡리 주먹도끼', titleEn: 'Acheulean Handaxe', eraCategory: 'prehistoric', era: '구석기 시대', route: '영동선', lat: 38.0583, lng: 127.0569, location: '경기 연천 전곡리 유적', museum: '국립중앙박물관·전곡선사박물관', designation: '전곡리 출토 구석기 유물', docent: '전곡리에서 발견된 양면 가공 주먹도끼로 동아시아 구석기 문화의 다양성을 보여 줍니다.', examTip: '📌 [내신/수능 핵심] 연천 전곡리 = 구석기 시대 주먹도끼, 기존 모비우스 학설 재검토!', quiz: { question: '연천 전곡리에서 발견되어 동아시아 구석기 문화를 재평가하게 한 뗀석기는?', options: ['주먹도끼', '찍개', '슴베찌르개', '간돌도끼'], answer: 0, explanation: '전곡리 주먹도끼 발견은 동아시아 구석기 문화를 재평가하는 계기가 되었습니다.' } },
    { id: 'p06', title: '미송리식 토기', titleEn: 'Misong-ri Style Pottery', eraCategory: 'prehistoric', era: '청동기 시대 / 고조선', route: '영동선', lat: 40.0520, lng: 124.4500, location: '평북 의주 미송리 동굴', museum: '국사편찬위원회 공식 도판', designation: '청동기 대표 유물', mediaLabel: '공식 도판', docent: '양쪽에 손잡이가 달린 토기로 고조선의 문화적 범위를 보여줍니다.', examTip: '📌 [내신/수능 핵심] 미송리식 토기 = 고조선 세력 범위!', quiz: { question: '손잡이가 달린 고조선 세력 범위 토기는?', options: ['미송리식 토기', '빗살무늬토기', '민무늬 토기', '붉은 간 토기'], answer: 0, explanation: '고조선 세력 범위 토기입니다.' } },
    { id: 'p07', title: '반달 돌칼', titleEn: 'Semilunar Stone Knife', eraCategory: 'prehistoric', era: '청동기 시대', route: '서해안선', lat: 36.2750, lng: 126.9100, location: '부여 송국리 유적', museum: '국립부여박물관', designation: '청동기 농기구', docent: '벼농사 수확 시 곡식 이삭을 자르던 청동기 시대 농기구입니다.', examTip: '📌 [내신/수능 핵심] 반달 돌칼 = 청동기 벼농사 수확 도구!', quiz: { question: '청동기 시대 벼농사 이삭 수확 도구는?', options: ['반달 돌칼', '주먹도끼', '가락바퀴', '갈돌과 갈판'], answer: 0, explanation: '청동기 벼농사 수확 도구입니다.' } },
    { id: 'p08', title: '다뉴세문경 (잔무늬 거울)', titleEn: 'Bronze Mirror with Fine Linear Design', eraCategory: 'prehistoric', era: '청동기 후기~초기 철기', route: '경부선', lat: 36.1872, lng: 127.0987, location: '충남 논산 일대 출토 추정', museum: '숭실대학교 한국기독교박물관', designation: '국보 다뉴세문경', docent: '두 개의 꼭지와 수많은 가는 기하학 무늬를 갖춘 청동 거울로 당시의 정밀 주조 기술을 보여 줍니다.', examTip: '📌 [내신/수능 핵심] 다뉴세문경 = 잔무늬·여러 꼭지·정교한 청동 주조 기술!', quiz: { question: '가는 기하학 무늬와 여러 꼭지가 특징인 청동 거울은?', options: ['다뉴세문경', '다뉴조문경', '무령왕릉 청동 거울', '고려 청동 거울'], answer: 0, explanation: '다뉴세문경은 뒷면의 정교한 잔무늬와 여러 꼭지가 특징입니다.' } },
    { id: 'p09', title: '세형 동검 (한반도 자성 동검)', titleEn: 'Slender Bronze Dagger', eraCategory: 'prehistoric', era: '철기 시대', route: '경부선', lat: 35.8700, lng: 128.6000, location: '한반도 전역 출토', museum: '국립중앙박물관', designation: '철기 시대 대표 유물', docent: '한반도 독자적 청동기 제작(거푸집)을 증명하는 동검입니다.', examTip: '📌 [내신/수능 핵심] 세형 동검 + 거푸집 = 한반도 독자 청동기!', quiz: { question: '한반도 독자 청동기 제작을 증명하는 동검은?', options: ['세형 동검', '비파형 동검', '중국식 동검', '칠지도'], answer: 0, explanation: '한반도 독자 동검입니다.' } },
    { id: 'p10', title: '강화 마니산 참성단', titleEn: 'Chamseongdan Altar', eraCategory: 'prehistoric', era: '고조선 단군 신화', route: '서해안선', lat: 37.6186, lng: 126.4312, location: '인천 강화도 마니산', museum: '사적 제136호', designation: '사적 제136호', docent: '단군왕검이 하늘에 제사를 지내던 천원지방 제단입니다.', examTip: '📌 [내신/수능 핵심] 강화 마니산 참성단 = 단군 제단!', quiz: { question: '단군왕검의 마니산 제단은?', options: ['마니산 참성단', '첨성대', '독립문', '수원 화성'], answer: 0, explanation: '강화 마니산 제단입니다.' } },
    { id: 'p11', title: '서울 암사동 신석기 움집', titleEn: 'Neolithic Pit-house at Amsa-dong', eraCategory: 'prehistoric', era: '신석기 시대 (B.C. 4000년경)', route: '경부선', lat: 37.5586, lng: 127.1300, location: '서울 강동구 암사동 유적', museum: '서울 암사동 선사유적박물관', designation: '사적 제267호', docent: '신석기 시대 농경과 정착 생활을 대표하는 움집 주거 유적입니다.', examTip: '📌 [내신/수능 핵심] 신석기 시대 = 농경과 정착 생활, 움집, 빗살무늬토기!', quiz: { question: '신석기 시대 농경과 정착 생활을 상징하는 주거 유적은?', options: ['서울 암사동 유적', '연천 전곡리 유적', '부여 송국리 유적', '강화 고인돌 유적'], answer: 0, explanation: '신석기 시대 주거 유적입니다.' } },

    // --- 2. 고구려 & 삼국 시대 ---
    { id: 'g01', title: '무용총 수렵도 벽화', titleEn: 'Hunting Scene in Muyongchong', eraCategory: 'three_kingdoms', era: '고구려 (5세기)', route: '해외선', lat: 41.1352, lng: 126.1825, location: '중국 길림성 집안시', museum: '유네스코 세계유산', designation: '유네스코 세계유산', docent: '말 위에서 뒤돌아 활을 쏘는 고구려 무사 벽화입니다.', examTip: '📌 [내신/수능 핵심] 고구려 굴식 돌방무덤 = 수렵도, 무용도, 사신도 벽화!', quiz: { question: '고구려 무사 활쏘기 벽화는?', options: ['무용총 수렵도', '무용총 무용도', '강서대묘 사신도', '각저총 씨름도'], answer: 0, explanation: '고구려 무사 벽화입니다.' } },
    { id: 'g02', title: '광개토대왕릉비 비문', titleEn: 'Gwanggaeto Stele', eraCategory: 'three_kingdoms', era: '고구려 장수왕 (414년)', route: '해외선', lat: 41.1421, lng: 126.1788, location: '중국 길림성 집안시', museum: '고구려 금석문 유적', designation: '고구려 금석문', docent: '장수왕이 부왕 영토 확장과 왜구 격퇴(400년)를 기록한 거대 비석입니다.', examTip: '📌 [내신/수능 핵심] 광개토대왕 = 영락 연호, 신라 구원(왜 격퇴)!', quiz: { question: '장수왕이 부왕의 정복 활동과 왜군 격퇴를 기록해 세운 비석은?', options: ['광개토대왕릉비', '충주 고구려비', '북한산 순수비', '단양 적성비'], answer: 0, explanation: '광개토대왕 업적 기념비입니다.' } },
    { id: 'g03', title: '삼족오 붉은 문양', titleEn: 'Three-legged Crow', eraCategory: 'three_kingdoms', era: '고구려', route: '해외선', lat: 41.1300, lng: 126.1800, location: '고구려 덕화리 고분', museum: '고구려 태양 상징', designation: '태양 상징', docent: '고구려 천손 사상과 태양을 상징하는 세 발 달린 새입니다.', examTip: '📌 [내신/수능 핵심] 삼족오 = 고구려 천손 사상!', quiz: { question: '고구려 태양 상징 세 발 새는?', options: ['삼족오', '봉황', '주작', '해태'], answer: 0, explanation: '고구려 태양 상징 새입니다.' } },
    { id: 'g04', title: '충주 고구려비 (중원 고구려비)', titleEn: 'Chungju Goguryeo Stele', eraCategory: 'three_kingdoms', era: '고구려 장수왕 (5세기)', route: '경부선', lat: 37.0215, lng: 127.8741, location: '충북 충주시', museum: '국립중원문화재연구소 (국보 제205호)', designation: '국보 제205호', docent: '장수왕이 한강 유역 차지 후 세운 한반도 유일의 고구려 비석입니다. 신라 왕을 신라매금이라 기록했습니다.', examTip: '📌 [내신/수능 핵심] 장수왕 = 한강 차지, 충주 고구려비(신라매금 기록)!', quiz: { question: '장수왕 때 세워진 것으로 보이며 신라 왕을 매금이라 적은 비석은?', options: ['충주 고구려비', '광개토대왕비', '북한산 순수비', '단양 적성비'], answer: 0, explanation: '장수왕 영토 확장 비석입니다.' } },
    { id: 'g05', title: '고구려 장군총 (돌무지무덤)', titleEn: 'Janggunchong Tomb', eraCategory: 'three_kingdoms', era: '고구려 (5세기)', route: '해외선', lat: 41.1560, lng: 126.2270, location: '중국 길림성 집안시', museum: '유네스코 세계유산', designation: '유네스코 세계유산', docent: '동양의 피라미드로 불리는 7단 계단식 돌무지무덤입니다.', examTip: '📌 [내신/수능 핵심] 고구려 장군총 ➔ 백제 서울 석촌동 돌무지무덤 계승!', quiz: { question: '동양의 피라미드로 불리는 고구려 7단 돌무지무덤은?', options: ['장군총', '무령왕릉', '황남대총', '천마총'], answer: 0, explanation: '고구려 대표 돌무지무덤입니다.' } },

    { id: 'b01', title: '백제 금동대향로', titleEn: 'Great Gilt-bronze Incense Burner', eraCategory: 'three_kingdoms', era: '백제 사비 시대 (6세기)', route: '서해안선', lat: 36.2758, lng: 126.9242, location: '충남 부여 능산리 절터', museum: '국립부여박물관 (국보 제287호)', designation: '국보 제287호', docent: '부여 능산리 절터 발굴 도교와 불교 사상 융합 최고 공예품입니다.', examTip: '📌 [내신/수능 핵심] 백제 금동대향로 = 부여 능산리 절터 발굴, 도교+불교 사상!', quiz: { question: '부여 능산리 절터 발굴 도교·불교 융합 공예품은?', options: ['금동대향로', '무령왕 금제관식', '황남대총 금관', '산수무늬 벽돌'], answer: 0, explanation: '부여 능산리 절터 발굴 공예품입니다.' } },
    { id: 'b02', title: '공주 송산리 무령왕릉', titleEn: "King Muryeong's Tomb", eraCategory: 'three_kingdoms', era: '백제 웅진 시대 (521년)', route: '서해안선', lat: 36.4623, lng: 127.1147, location: '충남 공주 송산리 고분군', museum: '국립공주박물관 (국보 제154호)', designation: '국보 제154호', docent: '중국 양나라 양식 벽돌무덤으로 묘지석이 발굴되어 무덤 주인이 확정된 왕릉입니다.', examTip: '📌 [내신/수능 핵심] 무령왕릉 = 백제 웅진 / 벽돌무덤, 묘지석, 22담로, 양나라·일본 교류!', quiz: { question: '중국 양나라 양식 벽돌무덤으로 묘지석이 발견된 백제 웅진 시기 무덤은?', options: ['무령왕릉', '석촌동 고분', '정효공주묘', '천마총'], answer: 0, explanation: '묘지석 발굴 백제 웅진 왕릉입니다.' } },
    { id: 'b03', title: '부여 정림사지 5층석탑', titleEn: 'Five-story Stone Pagoda', eraCategory: 'three_kingdoms', era: '백제 사비 시대', route: '서해안선', lat: 36.2790, lng: 126.9135, location: '충남 부여 정림사지', museum: '부여 정림사지 (국보 제9호)', designation: '국보 제9호', docent: '백제 사비 시대를 대표하는 석탑입니다.', examTip: '📌 [내신/수능 핵심] 백제 석탑 = 미륵사지 석탑, 정림사지 5층석탑!', quiz: { question: '사비 도성이 있던 부여에 남아 있는 백제 대표 석탑은?', options: ['정림사지 5층석탑', '미륵사지 석탑', '분황사 모전석탑', '감은사지 3층석탑'], answer: 0, explanation: '백제 사비 대표 석탑입니다.' } },

    { id: 's01', title: '황남대총 신라 금관', titleEn: 'Gold Crown from Hwangnamdaechong', eraCategory: 'three_kingdoms', era: '신라 (5세기)', route: '경부선', lat: 35.8347, lng: 129.2181, location: '경북 경주 황남대총', museum: '국립경주박물관 (국보 제191호)', designation: '국보 제191호', docent: '신라 돌무지덧널무덤에서 발굴된 순금 관입니다.', examTip: '📌 [내신/수능 핵심] 신라 돌무지덧널무덤 = 입구가 없어 도굴이 어려움!', quiz: { question: '황남대총처럼 신라 금관이 도굴되지 않고 남을 수 있었던 무덤 양식은?', options: ['돌무지덧널무덤', '굴식 돌방무덤', '벽돌무덤', '돌무지무덤'], answer: 0, explanation: '돌무지덧널무덤은 입구가 없고 두꺼운 돌무지로 덮여 도굴이 어려웠습니다.' } },
    { id: 's04', title: '천마도 말다래', titleEn: 'Cheonmado Painting', eraCategory: 'three_kingdoms', era: '신라 (6세기)', route: '경부선', lat: 35.8385, lng: 129.2140, location: '경북 경주 천마총', museum: '국립경주박물관 (국보 제207호)', designation: '국보 제207호', docent: '경주 천마총에서 발견된 백마 회화 유물입니다.', examTip: '📌 [내신/수능 핵심] 천마총 = 신라 돌무지덧널무덤!', quiz: { question: '경주의 신라 무덤에서 나온, 자작나무 껍질 말다래에 그린 그림은?', options: ['천마도', '수렵도', '사신도', '씨름도'], answer: 0, explanation: '신라 천마총 발굴 회화입니다.' } },
    { id: 's05', title: '경주 첨성대', titleEn: 'Cheomseongdae', eraCategory: 'three_kingdoms', era: '신라 선덕여왕 (7세기)', route: '경부선', lat: 35.8347, lng: 129.2190, location: '경북 경주시 인왕동', museum: '국보 제31호', designation: '국보 제31호', docent: '신라 선덕여왕 때 건립된 동양 최초의 천문관측대입니다.', examTip: '📌 [내신/수능 핵심] 선덕여왕 = 첨성대, 황룡사 9층목탑, 분황사 모전석탑!', quiz: { question: '신라 선덕여왕 때 세워진 것으로 보는 천문 관측 시설은?', options: ['경주 첨성대', '개성 첨성대', '창경궁 관천대', '강화 참성단'], answer: 0, explanation: '경주 첨성대는 현존하는 동양에서 가장 오래된 천문대로 꼽힙니다.' } },
    { id: 's06', title: '경주 황룡사지 9층 목탑 터', titleEn: 'Hwangnyongsa 9-story Pagoda Site', eraCategory: 'three_kingdoms', era: '신라 선덕여왕 (645년)', route: '경부선', lat: 35.8375, lng: 129.2315, location: '경북 경주 황룡사지', museum: '사적 제6호', designation: '사적 제6호', docent: '자장율사 건의로 세운 80m 거대 목탑 터로 몽골 침입 때 소실되었습니다.', examTip: '📌 [내신/수능 핵심] 자장율사 건의 = 황룡사 9층목탑 (몽골 침입 소실)!', quiz: { question: '자장율사 건의로 선덕여왕 때 세웠으나 몽골 침입 때 불타 없어진 탑은?', options: ['황룡사 9층 목탑', '분황사 모전석탑', '감은사지 3층석탑', '미륵사지 석탑'], answer: 0, explanation: '신라 자장율사 건의 거대 목탑 터입니다.' } },
    { id: 's07', title: '경주 분황사 모전석탑', titleEn: 'Bunhwangsa Stone Pagoda', eraCategory: 'three_kingdoms', era: '신라 선덕여왕 (634년)', route: '경부선', lat: 35.8405, lng: 129.2338, location: '경북 경주 분황사', museum: '국보 제30호', designation: '국보 제30호', docent: '돌을 안산암 벽돌 모양으로 깎아 쌓은 선덕여왕 대 석탑입니다.', examTip: '📌 [내신/수능 핵심] 분황사 모전석탑 = 돌을 벽돌 모양으로 깎아 제작!', quiz: { question: '돌을 벽돌 모양으로 깎아 쌓은 선덕여왕 대 석탑은?', options: ['분황사 모전석탑', '감은사지 3층석탑', '정림사지 5층석탑', '미륵사지 석탑'], answer: 0, explanation: '선덕여왕 대 모전석탑입니다.' } },
    { id: 's08', title: '서울 북한산 진흥왕 순수비', titleEn: 'Bukhansan Monument', eraCategory: 'three_kingdoms', era: '신라 진흥왕 (6세기)', route: '경부선', lat: 37.6608, lng: 126.9664, location: '서울 북한산 비봉 ➔ 국립중앙박물관', museum: '국립중앙박물관 (국보 제3호)', designation: '국보 제3호', docent: '진흥왕이 한강 유역 정복 후 세운 순수비로 추사 김정희가 고증했습니다.', examTip: '📌 [내신/수능 핵심] 진흥왕 = 한강 차지, 북한산 순수비, 김정희 고증!', quiz: { question: '신라가 한강 유역을 차지한 뒤 세웠고 김정희가 고증한 비석은?', options: ['북한산 순수비', '단양 적성비', '충주 고구려비', '창녕 척경비'], answer: 0, explanation: '진흥왕 한강 정복 순수비입니다.' } },
    { id: 's09', title: '경주 임신서기석', titleEn: 'Imsin Seogiseok', eraCategory: 'three_kingdoms', era: '신라 (6~7세기)', route: '경부선', lat: 35.8500, lng: 129.2100, location: '경북 경주 출토', museum: '국립경주박물관 (보물 제1415호)', designation: '보물 제1415호', docent: '신라 청년 2명이 유교 경전을 공부하고 화랑 정신을 맹세한 돌입니다.', examTip: '📌 [내신/수능 핵심] 임신서기석 = 신라 유교 공부 맹세!', quiz: { question: '신라 청년 2명이 유교 경전 공부를 맹세한 돌은?', options: ['임신서기석', '이차돈 순교비', '북한산 순수비', '광개토대왕비'], answer: 0, explanation: '신라 청년 유교 맹세 돌입니다.' } },
    { id: 's10', title: '경주 이차돈 순교비', titleEn: 'Ichadon Martyrdom Monument', eraCategory: 'three_kingdoms', era: '신라 법흥왕 (527년)', route: '경부선', lat: 35.8300, lng: 129.2200, location: '경북 경주 출토', museum: '국립경주박물관', designation: '신라 불교 문화재', docent: '신라 법흥왕 대 불교 공인을 위해 이차돈이 순교한 장면을 기린 비석입니다.', examTip: '📌 [내신/수능 핵심] 법흥왕 = 불교 공인(이차돈 순교), 율령 반포!', quiz: { question: '법흥왕 때 불교 공인을 위해 이차돈이 순교한 장면을 기린 비석은?', options: ['이차돈 순교비', '임신서기석', '북한산 순수비', '충주 고구려비'], answer: 0, explanation: '법흥왕 불교 공인 순교비입니다.' } },

    // --- 3. 통일신라 & 발해 ---
    { id: 's02', title: '무구정광대다라니경', titleEn: 'Mugujeonggwang Daedaranigyeong', eraCategory: 'unified_silla', era: '통일신라 (8세기 초)', route: '경부선', lat: 35.7903, lng: 129.3321, location: '경북 경주 불국사 석가탑 발굴', museum: '국립중앙박물관 (국보 제126호)', designation: '국보 제126호', docent: '세계에서 가장 오래된 통일신라 목판 인쇄물입니다.', examTip: '📌 [내신/수능 핵심] 무구정광대다라니경 = 통일신라 / 목판 (세계 최초)!', quiz: { question: '불국사 석가탑 사리함 발견 세계 최초 목판 인쇄물은?', options: ['무구정광대다라니경', '팔만대장경판', '직지심체요절', '훈민정음 해례본'], answer: 0, explanation: '통일신라 세계 최초 목판 인쇄물입니다.' } },
    { id: 's03', title: '석굴암 본존불상', titleEn: 'Seokguram Grotto Buddha', eraCategory: 'unified_silla', era: '통일신라 경덕왕 (8세기)', route: '경부선', lat: 35.7950, lng: 129.3492, location: '경북 경주 석굴암', museum: '국보 제24호 / 유네스코 세계유산', designation: '국보 제24호', docent: '김대성이 창건한 돔 형태 인공 석굴 불상입니다.', examTip: '📌 [내신/수능 핵심] 통일신라 경덕왕 = 김대성 창건 불국사·석굴암!', quiz: { question: '김대성이 창건했으며 화강암을 쌓아 돔 모양 천장을 만든 사원에 모신 불상은?', options: ['석굴암 본존불상', '서산 마애삼존불', '은진미륵', '이불병좌상'], answer: 0, explanation: '통일신라 석굴암 불상입니다.' } },
    { id: 's11', title: '성덕대왕신종 (에밀레종)', titleEn: 'Seongdeok Divine Bell', eraCategory: 'unified_silla', era: '통일신라 혜공왕 (771년)', route: '경부선', lat: 35.8335, lng: 129.2285, location: '경북 경주 봉덕사 ➔ 국립경주박물관', museum: '국립경주박물관 (국보 제29호)', designation: '국보 제29호', docent: '웅장하고 여운이 긴 통일신라 청동 범종의 결정체입니다.', examTip: '📌 [내신/수능 핵심] 성덕대왕신종 = 통일신라 혜공왕 완성!', quiz: { question: '통일신라 혜공왕 때 완성된 대표 청동 범종은?', options: ['성덕대왕신종', '상원사 동종', '천흥사 동종', '보신각종'], answer: 0, explanation: '통일신라 대표 청동 범종입니다.' } },
    { id: 's12', title: '경주 동궁과 월지 주령구', titleEn: 'Juryeonggu (14-sided Die)', eraCategory: 'unified_silla', era: '통일신라', route: '경부선', lat: 35.8340, lng: 129.2260, location: '경북 경주 안압지(동궁과 월지)', museum: '국립경주박물관', designation: '통일신라 왕실 유물', docent: '안압지 연회장에서 사용하던 14면체 나무 주사위 유물입니다.', examTip: '📌 [내신/수능 핵심] 안압지(동궁과 월지) = 14면체 주령구 발굴!', quiz: { question: '동궁과 월지 연회장에서 사용한 14면체 주사위는?', options: ['주령구', '팔주령', '자격루', '앙부일구'], answer: 0, explanation: '통일신라 14면체 주사위 유물입니다.' } },
    { id: 's13', title: '발해 상경 용천부 석등', titleEn: 'Balhae Stone Lantern', eraCategory: 'unified_silla', era: '발해 (8세기)', route: '해외선', lat: 44.1500, lng: 129.1000, location: '중국 헤이룽장성 닝안 상경성 제2절터', museum: '상경성 유적 현지 보존', designation: '발해 대표 석조 유물', docent: '상경성 제2절터에 남아 있는 높이 약 6m의 현무암 석등으로, 발해 문화의 웅장하고 건실한 기풍을 보여 줍니다.', examTip: '📌 [내신/수능 핵심] 발해 석등 = 상경 용천부, 웅장하고 건실한 발해 문화!', quiz: { question: '발해 상경 용천부 절터에 남아 웅장한 기풍을 보여 주는 현무암 석조물은?', options: ['석등', '석탑', '당간지주', '승탑'], answer: 0, explanation: '상경성 제2절터에는 높이 약 6m의 발해 석등이 남아 있습니다.' } },
    { id: 's14', title: '발해 이불병좌상', titleEn: 'Balhae Twin Buddhas', eraCategory: 'unified_silla', era: '발해', route: '해외선', lat: 42.8700, lng: 130.3600, location: '중국 지린성 훈춘 팔련성 출토', museum: '국립중앙박물관 복제품 전시', designation: '발해 불교 유물', mediaLabel: '공식 복제품', docent: '석가불과 다보불이 한 대좌에 나란히 앉은 불상으로, 광배와 옷 표현에서 고구려 불교 조각의 전통이 드러납니다.', examTip: '📌 [내신/수능 핵심] 발해 이불병좌상 = 고구려 불교 양식 계승!', quiz: { question: '고구려 불교 양식을 계승해 두 부처님이 나란히 앉은 발해 불상은?', options: ['이불병좌상', '석굴암 본존불', '은진미륵', '마애삼존불'], answer: 0, explanation: '발해 이불병좌상은 고구려 불교 조각의 전통을 계승했습니다.' } },

    // --- 4. 고려 시대 ---
    { id: 'k01', title: '고려청자 상감운학문 매병', titleEn: 'Celadon Prunus Vase', eraCategory: 'goryeo', era: '고려 (12세기)', route: '호남선', lat: 37.5891, lng: 126.9980, location: '전남 강진 / 전북 부안 가마터', museum: '간송미술관 (국보 제68호)', designation: '국보 제68호', docent: '고려인이 세계 최초 개발한 상감 기법 명작입니다.', examTip: '📌 [내신/수능 핵심] 고려 = 12세기 상감청자 개발!', quiz: { question: '흰 흙과 검은 흙을 메워 넣어 학과 구름무늬를 나타낸 고려청자는?', options: ['청자 상감운학문 매병', '청자 참외 모양 병', '분청사기 철화 물고기무늬 병', '백자 달항아리'], answer: 0, explanation: '12세기 고려 상감청자 국보입니다.' } },
    { id: 'k02', title: '합천 해인사 팔만대장경판', titleEn: 'Tripitaka Koreana', eraCategory: 'goryeo', era: '고려 고종 (1236~1251년)', route: '호남선', lat: 35.8014, lng: 128.0984, location: '강화도 제작 ➔ 합천 해인사', museum: '합천 해인사 장경판전 (국보 제32호)', designation: '국보 제32호 / 유네스코 세계기록유산', docent: '고려 고종 때 몽골 침입 퇴치를 기원하며 제작한 대장경입니다.', examTip: '📌 [내신/수능 핵심] 팔만대장경 = 고려 / 목판 (몽골 퇴치 기원)!', quiz: { question: '몽골의 침입을 부처의 힘으로 물리치려는 뜻에서 고려가 새긴 경판은?', options: ['팔만대장경판', '초조대장경판', '교장', '무구정광대다라니경'], answer: 0, explanation: '고려 몽골 퇴치 기원 목판입니다.' } },
    { id: 'k03', title: '직지심체요절 (금속활자본)', titleEn: 'Jikji', eraCategory: 'goryeo', era: '고려 우왕 (1377년)', route: '해외선', lat: 48.8383, lng: 2.3785, location: '충북 청주 흥덕사지 인쇄 ➔ 파리', museum: '프랑스 국립도서관 (파리, BnF)', designation: '유네스코 세계기록유산', docent: '서양 구텐베르크보다 78년 앞선 세계 최초 금속활자본입니다.', examTip: '📌 [내신/수능 핵심] 직지심체요절 = 고려 / 금속활자 (세계 최초, 프랑스 국립도서관)!', quiz: { question: '1377년 청주 흥덕사에서 찍은, 현존하는 가장 오래된 금속활자본은?', options: ['직지심체요절', '상정고금예문', '무구정광대다라니경', '팔만대장경판'], answer: 0, explanation: '현존하는 세계에서 가장 오래된 고려 금속활자본입니다.' } },
    { id: 'k04', title: '백제 칠지도 (七支刀)', titleEn: 'Chiljido', eraCategory: 'three_kingdoms', era: '백제 근초고왕 (4세기 369년)', route: '해외선', lat: 34.5986, lng: 135.8450, location: '백제 제작 ➔ 일본 이소노카미 신궁', museum: '일본 이소노카미 신궁 소장', designation: '백제-왜 관계 최고 사료', docent: '칼 몸통에 뻗어 나온 가지가 총 7개라는 뜻을 지닌 백제 철제 칼입니다. 근초고왕 대 왜왕에게 하사한 유물입니다.', examTip: '📌 [내신/수능 핵심] 근초고왕 = 백제-왜 교류 칠지도 하사!', quiz: { question: '백제가 왜왕에게 보낸 것으로 보이며 칼몸 양쪽으로 가지가 뻗은 철제 칼은?', options: ['칠지도', '환두대도', '비파형 동검', '세형 동검'], answer: 0, explanation: '백제-왜 교류 상징 칠지도입니다.' } },
    { id: 'k05', title: '평창 월정사 팔각 9층석탑', titleEn: 'Woljeongsa Octagonal 9-story Pagoda', eraCategory: 'goryeo', era: '고려 전기', route: '영동선', lat: 37.7314, lng: 128.5916, location: '강원 평창 월정사', museum: '평창 월정사 (국보 제48호)', designation: '국보 제48호', docent: '송나라 영향을 받은 고려 전기의 대표적 다각형 다층 석탑입니다.', examTip: '📌 [내신/수능 핵심] 평창 월정사 팔각 9층석탑 = 고려 전기 송나라 영향!', quiz: { question: '송나라 영향을 받은 고려 전기의 대표 다각 다층 석탑은?', options: ['월정사 팔각 9층석탑', '경천사지 10층석탑', '원각사지 10층석탑', '불국사 3층석탑'], answer: 0, explanation: '고려 전기 송나라 영향 석탑입니다.' } },
    { id: 'k06', title: '개경 경천사지 십층석탑', titleEn: 'Gyeongcheonsa 10-story Pagoda', eraCategory: 'goryeo', era: '고려 후기 (1348년)', route: '경부선', lat: 37.5239, lng: 126.9800, location: '개성 경천사지 ➔ 국립중앙박물관', museum: '국립중앙박물관 로비 전시 (국보 제86호)', designation: '국보 제86호', docent: '원나라(몽골) 영향을 받은 고려 후기 대리석 석탑으로 조선 세조 원각사지 십층석탑에 영향을 주었습니다.', examTip: '📌 [내신/수능 핵심] 고려 후기 경천사지 10층석탑(원나라 영향) ➔ 조선 세조 원각사지 10층석탑 계승!', quiz: { question: '원나라 영향을 받았으며 국립중앙박물관 로비에 전시된 고려 후기 대리석 탑은?', options: ['경천사지 십층석탑', '월정사 팔각 구층석탑', '원각사지 십층석탑', '불국사 삼층석탑'], answer: 0, explanation: '원나라 영향 고려 후기 대리석 탑입니다.' } },
    { id: 'k07', title: '관촉사 석조미륵보살입상 (은진미륵)', titleEn: 'Eunjin Mireuk', eraCategory: 'goryeo', era: '고려 광종 (10세기)', route: '호남선', lat: 36.1866, lng: 127.1006, location: '충남 논산 관촉사', museum: '논산 관촉사 (국보 제323호)', designation: '국보 제323호', docent: '고려 광종 대 제작된 높이 18m의 거대하고 파격적인 고려 지방 불상입니다.', examTip: '📌 [내신/수능 핵심] 관촉사 은진미륵 = 고려 지방 불상의 파격미!', quiz: { question: '고려 광종 대 제작된 18m 거대 파격 고려 불상은?', options: ['관촉사 은진미륵', '석굴암 본존불', '서산 마애삼존불', '이불병좌상'], answer: 0, explanation: '고려 광종 대 18m 거대 불상입니다.' } },
    { id: 'k08', title: '부석사 무량수전', titleEn: 'Buseoksa Muryangsujeon', eraCategory: 'goryeo', era: '고려 고려시대 목조건축', route: '영동선', lat: 36.9980, lng: 128.6870, location: '경북 영주 부석사', museum: '부석사 (국보 제18호)', designation: '국보 제18호', docent: '배흘림기둥과 주심포 양식으로 유명한 우리나라에서 가장 오래된 고려 목조건축물 중 하나입니다.', examTip: '📌 [내신/수능 핵심] 부석사 무량수전 = 배흘림기둥, 주심포 양식, 고려 목조건축!', quiz: { question: '배흘림기둥과 주심포 양식으로 대표되는 고려 시대 대표 목조건축물은?', options: ['부석사 무량수전', '경복궁 근정전', '창덕궁 인정전', '법주사 팔상전'], answer: 0, explanation: '고려 시대 배흘림기둥 주심포 건물입니다.' } },

    // --- 5. 조선 시대 ---
    { id: 'j01', title: '훈민정음 해례본', titleEn: 'Hunminjeongeum Haeryebon', eraCategory: 'joseon', era: '조선 세종 (1446년)', route: '영동선', lat: 36.5684, lng: 128.7294, location: '경북 안동 가문 소장 발굴', museum: '간송미술관 (국보 제70호)', designation: '국보 제70호 / 유네스코 세계기록유산', docent: '세종대왕이 한글 창제 원리와 사용법을 밝힌 해설서입니다.', examTip: '📌 [내신/수능 핵심] 세종대왕 = 훈민정음 해례본!', quiz: { question: '세종 때 새 문자를 만든 원리와 쓰는 법을 풀이한 책은?', options: ['훈민정음 해례본', '용비어천가', '석보상절', '동국정운'], answer: 0, explanation: '세종대왕 한글 해설서입니다.' } },
    { id: 'j02', title: '장영실 자격루 (자동 물시계)', titleEn: 'Jagyeongru', eraCategory: 'joseon', era: '조선 세종 (1434년)', route: '경부선', lat: 37.5786, lng: 126.9770, location: '서울 경복궁 보루각', museum: '국립고궁박물관 (국보 제229호)', designation: '국보 제229호', docent: '장영실이 제작한 우리나라 최초 자동 물시계입니다.', examTip: '📌 [내신/수능 핵심] 장영실 & 세종 = 자격루, 앙부일구, 측우기, 혼천의!', quiz: { question: '장영실 제작 최초 자동 물시계는?', options: ['자격루', '앙부일구', '혼천의', '측우기'], answer: 0, explanation: '장영실 제작 자동 물시계입니다.' } },
    { id: 'j03', title: '안견 몽유도원도', titleEn: 'Mongyudowondo', eraCategory: 'joseon', era: '조선 세종 (1447년)', route: '해외선', lat: 34.6045, lng: 135.8327, location: '조선 도화서 ➔ 일본 텐리', museum: '일본 텐리대학 도서관 소장', designation: '조선 전기 대표 회화', docent: '안평대군의 꿈 이야기를 듣고 화원 안견이 3일 만에 그린 조선 전기 대표 산수화입니다.', examTip: '📌 [내신/수능 핵심] 조선 전기 회화 = 안견의 몽유도원도, 강희안의 고사관수도!', quiz: { question: '안평대군의 꿈을 안견이 그린 조선 전기 대표 산수화는?', options: ['몽유도원도', '인왕제색도', '씨름도', '고사관수도'], answer: 0, explanation: '조선 전기 안견 대표 그림입니다.' } },
    { id: 'j04', title: '숭례문 (남대문)', titleEn: 'Sungnyemun Gate', eraCategory: 'joseon', era: '조선 태조 (1398년)', route: '경부선', lat: 37.5599, lng: 126.9753, location: '서울 중구 남대문로', museum: '국보 제1호', designation: '국보 제1호', docent: '조선 왕조 수도 한양의 남쪽 정문으로 대한민국 국보 제1호 건축물입니다.', examTip: '📌 [내신/수능 핵심] 숭례문 = 국보 제1호, 한양 도성 남쪽 정문!', quiz: { question: '대한민국 국보 제1호이자 한양 도성의 남쪽 정문 성문은?', options: ['숭례문 (남대문)', '흥인지문 (동대문)', '독립문', '영은문'], answer: 0, explanation: '국보 제1호 숭례문입니다.' } },
    { id: 'j05', title: '흥인지문 (동대문)', titleEn: 'Heunginjimun Gate', eraCategory: 'joseon', era: '조선 태조/고종 중건', route: '경부선', lat: 37.5711, lng: 127.0096, location: '서울 종로구 종로6가', museum: '보물 제171호', designation: '보물 제171호', docent: '한양 도성 성문 중 유일하게 적의 공격을 막기 위한 반원형 옹성 구조를 갖추고 있습니다.', examTip: '📌 [내신/수능 핵심] 흥인지문 = 보물 제171호, 유일한 반원형 옹성 구조!', quiz: { question: '한양 성문 중 유일하게 반원형 옹성을 갖춘 동쪽 정문은?', options: ['흥인지문 (동대문)', '숭례문 (남대문)', '독립문', '광화문'], answer: 0, explanation: '옹성 구조를 갖춘 흥인지문입니다.' } },
    { id: 'j06', title: '경복궁 (근정전 & 경회루)', titleEn: 'Gyeongbokgung Palace', eraCategory: 'joseon', era: '조선 태조 (1395년) / 흥선대원군 중건', route: '경부선', lat: 37.5796, lng: 126.9770, location: '서울 종로구 사직로 161', museum: '사적 제117호 (조선 법궁)', designation: '사적 제117호', docent: '태조 이성계와 정도전이 창건하고 흥선대원군이 당백전을 발행하여 중건한 조선 법궁입니다.', examTip: '📌 [내신/수능 핵심] 경복궁 중건 = 흥선대원군 (당백전, 원납전)!', quiz: { question: '흥선대원군이 당백전을 발행하며 대대적으로 중건한 궁궐은?', options: ['경복궁', '창덕궁', '덕수궁', '창경궁'], answer: 0, explanation: '흥선대원군 중건 궁궐입니다.' } },
    { id: 'j07', title: '혼일강리역대국도지도 (태종)', titleEn: 'Kangnido Map', eraCategory: 'joseon', era: '조선 태종 (1402년)', route: '해외선', lat: 34.9540, lng: 135.7580, location: '조선 제작 ➔ 일본 류코쿠대학', museum: '일본 류코쿠대학 도서관 소장', designation: '동양 최오래 세계지도', docent: '조선 태종 2년 제작된 동양에서 가장 오래된 세계 지도입니다.', examTip: '📌 [내신/수능 핵심] 혼일강리역대국도지도 = 조선 태종 (1402), 동양 최오래 세계지도, 일본 소장!', quiz: { question: '조선 태종 때 만든, 현존하는 동양에서 가장 오래된 세계지도는?', options: ['혼일강리역대국도지도', '천하도', '대동여지도', '곤여만국전도'], answer: 0, explanation: '조선 태종 대 동양 최오래 세계지도입니다.' } },
    { id: 'j08', title: '천상열차분야지도 (각석)', titleEn: 'Cheonsang Yeolcha Bunyajido', eraCategory: 'joseon', era: '조선 태조 (1395년)', route: '경부선', lat: 37.5785, lng: 126.9768, location: '서울 경복궁 ➔ 국립고궁박물관', museum: '국립고궁박물관 (국보 제228호)', designation: '국보 제228호', docent: '태조 4년 돌에 새긴 세계에서 2번째로 오래된 전천 천문도 비석입니다.', examTip: '📌 [내신/수능 핵심] 천상열차분야지도 = 조선 태조, 세계 2번째 천문도 돌 비석!', quiz: { question: '조선 태조 때 돌에 새긴 세계 2번째 전천 천문도 비석은?', options: ['천상열차분야지도', '신법천문도', '혼천의', '칠정산'], answer: 0, explanation: '조선 태조 대 천문도 돌 비석입니다.' } },
    { id: 'j09', title: '정상기 동국지도 (백리척 축척)', titleEn: 'Donggukjido by Jeong Sang-gi', eraCategory: 'joseon', era: '조선 영조 (18세기)', route: '경부선', lat: 37.5242, lng: 126.9808, location: '조선 제작', museum: '국립중앙박물관 소장', designation: '조선 실학 지도', docent: '우리나라 지도 최초로 백리척(축척)을 도입하여 실제 국토를 정확히 축소해 그린 지도입니다.', examTip: '📌 [내신/수능 핵심] 정상기 동국지도 = 최초 백리척(축척) 사용!', quiz: { question: '조선 지도 최초로 백리척(축척)을 도입하여 제작된 지도는?', options: ['동국지도', '대동여지도', '혼일강리역대국도지도', '곤여만국전도'], answer: 0, explanation: '최초 백리척 축척 도입 지도입니다.' } },
    { id: 'j10', title: '곤여만국전도 (마테오 리치)', titleEn: 'Kunyu Wanguo Quantu', eraCategory: 'joseon', era: '조선 후기 (17세기 이광정 도입)', route: '경부선', lat: 37.5241, lng: 126.9807, location: '중국 제작 ➔ 조선 도입', museum: '국립중앙박물관 / 숭실대 박물관', designation: '조선 실학 서양 지도', docent: '서양 신부 마테오 리치가 중국에서 제작한 세계 지도를 조선에 들여와 성리학 세계관을 탈피하게 했습니다.', examTip: '📌 [내신/수능 핵심] 곤여만국전도 = 마테오 리치, 성리학 세계관 탈피!', quiz: { question: '마테오 리치가 제작하고 조선 후기 들여와 성리학 세계관 탈피에 영향을 준 지도는?', options: ['곤여만국전도', '동국지도', '대동여지도', '혼일강리역대국도지도'], answer: 0, explanation: '성리학 세계관 탈피 수입 지도입니다.' } },
    { id: 'j11', title: '혼천시계 & 혼천의', titleEn: 'Armillary Clock', eraCategory: 'joseon', era: '조선 현종 (1669년)', route: '경부선', lat: 37.5894, lng: 127.0323, location: '서울 성북구 안암동', museum: '고려대학교 박물관 (국보 제230호)', designation: '국보 제230호 (만원권 지폐 뒷면)', docent: '만원권 지폐 뒷면에 인쇄된 과학 유물로 서양 자격 시계 장치와 동양 혼천의를 결합한 기계 시계입니다.', examTip: '📌 [내신/수능 핵심] 혼천시계 = 고려대 박물관 소장, 만원권 지폐 뒷면!', quiz: { question: '고려대 박물관 소장 만원권 지폐 뒷면 과학 유물은?', options: ['혼천시계', '자격루', '측우기', '앙부일구'], answer: 0, explanation: '고려대 박물관 소장 만원권 지폐 뒷면 국보입니다.' } },
    { id: 'j12', title: '조선의 측우기', titleEn: 'Cheugugi Rain Gauge', eraCategory: 'joseon', era: '조선 세종대 제도화 / 1837년 현존품', route: '경부선', lat: 37.5742, lng: 126.9667, location: '조선 각 관청에서 규격화해 사용', museum: '국립기상박물관 (공주 충청감영 측우기)', designation: '국보 공주 충청감영 측우기', docent: '세종대에 강우량 측정 제도를 마련했고, 사진의 현존 유일 측우기는 1837년 공주 충청감영에서 제작되었습니다.', examTip: '📌 [내신/수능 핵심] 세종대 측우 제도 확립 / 현존 측우기는 1837년 제작!', quiz: { question: '조선에서 빗물의 깊이를 일정한 기준으로 측정한 기구는?', options: ['측우기', '수표', '자격루', '앙부일구'], answer: 0, explanation: '측우기는 조선의 체계적인 강우량 관측 제도를 보여 줍니다.' } },
    { id: 'j13', title: '앙부일구 (오목 해시계)', titleEn: 'Angbu-ilgu', eraCategory: 'joseon', era: '조선 세종 (1434년)', route: '경부선', lat: 37.5787, lng: 126.9772, location: '서울 경복궁 / 종묘 앞', museum: '국립고궁박물관', designation: '세종대왕 해시계', docent: '글 모르는 백성을 위해 12지신 동물 그림으로 시반을 표현한 오목한 해시계입니다.', examTip: '📌 [내신/수능 핵심] 앙부일구 = 백성 위한 12지신 그림 해시계!', quiz: { question: '글 모르는 백성을 위해 12지신 그림을 넣은 세종 대 해시계는?', options: ['앙부일구', '현주일구', '천평일구', '일성정시의'], answer: 0, explanation: '백성을 위한 12지신 그림 해시계입니다.' } },
    { id: 'j14', title: '칠정산 내편 (세종 한양 중심 역법)', titleEn: 'Chiljeongsan Naepyeon', eraCategory: 'joseon', era: '조선 세종 (1444년)', route: '경부선', lat: 37.5784, lng: 126.9766, location: '조선 한양을 기준으로 편찬', museum: '서울대학교 규장각한국학연구원', designation: '조선 최초 한양 기준 역법서', mediaLabel: '서책 자료', docent: '이순지와 김담 등이 한양을 기준으로 해와 달, 오행성의 운행을 계산하도록 편찬한 조선의 역법서입니다.', examTip: '📌 [내신/수능 핵심] 칠정산 내편 = 세종대, 한양 기준 / 칠정산 외편 = 회회력 연구!', quiz: { question: '세종 때 한양을 기준으로 천체 운행을 계산하도록 편찬한 역법서는?', options: ['칠정산 내편', '수시력', '시헌력', '농사직설'], answer: 0, explanation: '칠정산 내편은 한양을 기준으로 정리한 조선의 역법서입니다.' } },
    { id: 'j15', title: '정선 인왕제색도 (진경산수화)', titleEn: 'Inwang Jesaekdo', eraCategory: 'joseon', era: '조선 후기 영조 (1751년)', route: '경부선', lat: 37.5239, lng: 126.9806, location: '서울 인왕산', museum: '국립중앙박물관 (국보 제216호)', designation: '국보 제216호', docent: '겸재 정선이 비 온 뒤 인왕산 모습을 직접 보고 그려낸 조선 후기 진경산수화의 명작입니다.', examTip: '📌 [내신/수능 핵심] 겸재 정선 = 진경산수화 (인왕제색도)!', quiz: { question: '겸재 정선이 비가 갠 뒤 서울의 바위산을 직접 보고 그린 진경산수화는?', options: ['인왕제색도', '금강전도', '몽유도원도', '고사관수도'], answer: 0, explanation: '조선 후기 정선 대표 진경산수화입니다.' } },
    { id: 'j16', title: '서울 원각사지 십층석탑', titleEn: 'Wongaksa 10-story Pagoda', eraCategory: 'joseon', era: '조선 세조 (1467년)', route: '경부선', lat: 37.5714, lng: 126.9883, location: '서울 종로구 탑골공원', museum: '서울 탑골공원 (국보 제2호)', designation: '국보 제2호', docent: '고려 후기 개경 경천사지 십층석탑의 양식을 그대로 계승하여 만든 조선 세조 대 대리석 탑입니다.', examTip: '📌 [내신/수능 핵심] 고려 경천사지 10층석탑 ➔ 조선 세조 원각사지 10층석탑 계승!', quiz: { question: '고려 경천사지 석탑의 양식을 이어 조선 세조 때 한양 도성 안에 세운 대리석 탑은?', options: ['원각사지 십층석탑', '월정사 팔각 구층석탑', '정림사지 오층석탑', '불국사 삼층석탑'], answer: 0, explanation: '조선 세조 대 대리석 석탑입니다.' } },
    { id: 'j17', title: '수원 화성 & 거중기', titleEn: 'Suwon Hwaseong Fortress', eraCategory: 'joseon', era: '조선 정조 (1796년)', route: '경부선', lat: 37.2851, lng: 127.0142, location: '경기 수원시 팔달구', museum: '유네스코 세계문화유산', designation: '유네스코 세계유산', docent: '정조 임금이 정약용과 함께 거중기를 고안하여 축조한 유네스코 세계문화유산 성곽입니다.', examTip: '📌 [내신/수능 핵심] 수원 화성 = 정조 & 정약용 거중기, 《화성성역의궤》!', quiz: { question: '정조 때 정약용이 거중기를 활용해 축조한 유네스코 세계문화유산은?', options: ['수원 화성', '남한산성', '북한산성', '행주산성'], answer: 0, explanation: '정조 대 정약용 거중기 축조 성곽입니다.' } },

    { id: 'l01', title: '김홍도 씨름도 (풍속화)', titleEn: 'Ssireum by Kim Hong-do', eraCategory: 'joseon', era: '조선 후기 정조 (18세기)', route: '경부선', lat: 37.5892, lng: 126.9981, location: '조선 도화서', museum: '간송미술관 (보물 제527호)', designation: '보물 제527호', docent: '조선 후기 서민들의 생동감 넘치는 씨름 경기를 그린 단원 김홍도의 대표 풍속화입니다.', examTip: '📌 [내신/수능 핵심] 조선 후기 풍속화 = 김홍도, 신윤복!', quiz: { question: '구경꾼이 둥글게 둘러앉은 씨름판을 그린 조선 후기 풍속화의 화가는?', options: ['김홍도', '신윤복', '정선', '강희안'], answer: 0, explanation: '씨름도는 단원 김홍도의 대표 풍속화입니다.' } },
    { id: 'l02', title: '백자 달항아리', titleEn: 'White Porcelain Moon Jar', eraCategory: 'joseon', era: '조선 후기 (18세기)', route: '경부선', lat: 37.5238, lng: 126.9805, location: '조선 광주 관요 가마터', museum: '국립중앙박물관 (국보 제310호)', designation: '국보 제310호', docent: '보름달을 닮은 순백의 둥근 조선 백자로 조선 선비의 청렴하고 담백한 미학을 보여줍니다.', examTip: '📌 [내신/수능 핵심] 조선 후기 도자기 = 백자 달항아리, 청화백자!', quiz: { question: '백자 달항아리가 주로 만들어진 시기는?', options: ['조선 후기', '조선 전기', '고려 중기', '고려 후기'], answer: 0, explanation: '백자 달항아리는 18세기 무렵 조선 후기에 주로 만들어졌습니다.' } },
    { id: 'l03', title: '김정호 대동여지도', titleEn: 'Daedongyeojido', eraCategory: 'joseon', era: '조선 후기 철종 (1861년)', route: '경부선', lat: 37.5240, lng: 126.9806, location: '조선 전 국토를 22층으로 나누어 제작', museum: '국립중앙박물관 (보물 제850호)', designation: '보물 제850호', mediaLabel: '공식 전시 포스터 · 22첩 연결본', docent: '김정호가 기존 지도와 지리 정보를 집대성하여 국토를 22층으로 나누고, 도로에 10리마다 점을 표시해 목판으로 간행한 전국 지도입니다.', examTip: '📌 [내신/수능 핵심] 김정호 대동여지도 = 10리 점 표기, 22첩 분첩 목판 지도!', quiz: { question: '김정호가 제작하였으며 10리마다 점을 찍은 22첩 절첩식 목판 지도는?', options: ['대동여지도', '혼일강리역대국도지도', '동국지도', '곤여만국전도'], answer: 0, explanation: '김정호 제작 10리 눈금 표시 목판 지도입니다.' } },

    // --- 6. 근현대 ---
    { id: 'm01', title: '독립문과 서재필', titleEn: 'Dongnibmum', eraCategory: 'modern', era: '대한제국 / 근대 (1897년)', route: '경부선', lat: 37.5724, lng: 126.9595, location: '서울 서대문구 현저동', museum: '서울 서대문 독립공원', designation: '사적 제32호', docent: '독립협회가 영은문을 헐고 건립한 자주독립 석조문입니다.', examTip: '📌 [내신/수능 핵심] 독립협회 = 영은문 헐고 독립문 건립!', quiz: { question: '1897년 독립협회가 청의 사신을 맞던 영은문 자리에 세운 석조 건축물은?', options: ['독립문', '독립관', '환구단', '석조전'], answer: 0, explanation: '독립협회가 건립한 자주독립 석조문입니다.' } },
    { id: 'm02', title: '안중근 의사 유묵 (단지 수인)', titleEn: 'Calligraphy by Patriot An Jung-geun', eraCategory: 'modern', era: '일제강점기 (1910년)', route: '해외선', lat: 38.8035, lng: 121.2618, location: '중국 뤼순 감옥 친필', museum: '안중근의사기념관 (보물 제569호)', designation: '보물 제569호', docent: '안중근 의사가 하얼빈 의거 후 뤼순 감옥에서 찍어 남긴 단지 수인 친필 유묵입니다.', examTip: '📌 [내신/수능 핵심] 안중근 = 1909년 하얼빈 의거!', quiz: { question: '1909년 하얼빈 의거 후 뤼순 감옥에서 단지 수인을 찍어 남긴 안중근의 유묵은?', options: ['안중근 의사 유묵', '척화비', '대동여지도', '훈민정음 해례본'], answer: 0, explanation: '안중근 의사 친필 보물 유묵입니다.' } },
    { id: 'm03', title: '한국광복군 서명문 태극기', titleEn: 'Signed Taegeukgi of the Korean Liberation Army', eraCategory: 'modern', era: '일제강점기 (1941년)', route: '서해안선', lat: 29.5630, lng: 106.5516, location: '중국 충칭 한국광복군 활동지', museum: '독립기념관', designation: '국가등록문화유산', docent: '한국광복군 대원과 관계자들이 광복을 염원하는 글과 이름을 태극기 위에 남긴 독립운동 자료입니다.', examTip: '📌 [내신/수능 핵심] 한국광복군 = 대한민국 임시정부의 군대, 1940년 충칭에서 창설!', quiz: { question: '대한민국 임시정부가 충칭에서 창설한 군대는?', options: ['한국광복군', '별기군', '훈련도감', '장용영'], answer: 0, explanation: '한국광복군은 대한민국 임시정부가 1940년 충칭에서 창설한 군대입니다.' } },
    { id: 'm04', title: '흥선대원군 척화비', titleEn: 'Cheokhwabi Stele', eraCategory: 'modern', era: '조선 고종 (1871년)', route: '경부선', lat: 37.5239, lng: 126.9805, location: '전국 주요 도로 / 국립중앙박물관', museum: '국립중앙박물관 외', designation: '근대 시기 주요 석조 비석', docent: '흥선대원군이 신미양요(1871) 직후 통상 수교 거부 정책을 위해 세운 비석입니다.', examTip: '📌 [내신/수능 핵심] 척화비 = 신미양요(1871) 직후 건립, 통상 수교 거부!', quiz: { question: '신미양요(1871) 직후 흥선대원군이 통상 수교 거부 정책을 위해 세운 비석은?', options: ['척화비', '탕평비', '삼전도비', '북한산 순수비'], answer: 0, explanation: '신미양요 직후 세운 통상 수교 거부 비석입니다.' } },
    { id: 'm05', title: '서재필 독립신문', titleEn: 'The Independent Newspaper', eraCategory: 'modern', era: '근대 (1896년)', route: '경부선', lat: 37.5722, lng: 126.9590, location: '서울 정동 독립신문사', museum: '국립중앙박물관 (등록문화재 제364호)', designation: '등록문화재 제364호', docent: '1896년 서재필이 창간한 우리나라 최초의 민간 신문입니다. 한글판과 영문판으로 제작되었습니다.', examTip: '📌 [내신/수능 핵심] 독립신문 = 최초의 민간 신문, 순한글판 및 영문판(The Independent) 발간!', quiz: { question: '1896년 서재필이 창간하였으며 순한글과 영문으로 인쇄된 최초의 민간 신문은?', options: ['독립신문', '한성순보', '황성신문', '제국신문'], answer: 0, explanation: '서재필이 창간한 최초 민간 신문 독립신문입니다.' } },
    { id: 'm06', title: '대한제국 덕수궁 석조전', titleEn: 'Deoksugung Seokjojeon', eraCategory: 'modern', era: '대한제국 (1910년)', route: '경부선', lat: 37.5658, lng: 126.9751, location: '서울 중구 덕수궁', museum: '덕수궁 석조전 대한제국역사관', designation: '사적 제124호', docent: '1910년 완성된 대한제국 고종 황제의 양식 궁전으로 광복 후 미·소 공동위원회가 개최되었습니다.', examTip: '📌 [내신/수능 핵심] 덕수궁 석조전 = 대한제국 대표 서양식 석조 궁전, 미·소 공동위원회 개최 장소!', quiz: { question: '대한제국 고종 황제의 대표 서양식 궁전으로 광복 후 미·소 공동위원회가 개최된 건물은?', options: ['덕수궁 석조전', '덕수궁 중명전', '덕수궁 정관헌', '경복궁 근정전'], answer: 0, explanation: '대한제국 대표 서양식 궁전 덕수궁 석조전입니다.' } }
  ];

  const relicById = id => RELICS_MASTER.find(relic => relic.id === id);

  Object.assign(relicById('p09'), {
    title: '세형 동검 (한국식 동검)'
  });

  Object.assign(relicById('b02'), {
    title: '공주 무령왕릉과 왕릉원',
    titleEn: 'Tomb of King Muryeong and Royal Tombs, Gongju',
    era: '백제 웅진 시기 (6세기)',
    location: '충남 공주시 금성동 무령왕릉과 왕릉원',
    museum: '공주 무령왕릉과 왕릉원 / 국립공주박물관',
    designation: '사적·유네스코 세계유산',
    docent: '1971년 배수로 공사 중 발견된 무령왕과 왕비의 벽돌무덤입니다. 지석이 함께 출토되어 무덤의 주인과 매장 연대를 정확히 알 수 있습니다.',
    examTip: '무령왕릉 = 웅진 시기 / 벽돌무덤 / 지석 / 중국 남조와 일본 교류',
    context: '왕릉 자체와 출토품은 구분해야 합니다. 금제 관식은 무령왕릉에서 나온 부장품이고, 왕릉은 공주 왕릉원 안에 자리한 벽돌무덤입니다.'
  });

  Object.assign(relicById('k04'), {
    eraCategory: 'three_kingdoms',
    era: '백제 근초고왕 무렵 (4세기)',
    docent: '백제가 왜왕에게 보낸 것으로 해석되는 일곱 갈래 철제 칼입니다. 칼에 새긴 명문은 백제와 왜의 외교 관계를 보여 줍니다.',
    examTip: '칠지도 = 백제와 왜의 교류를 보여 주는 금석문 자료'
  });

  Object.assign(relicById('m03'), {
    title: '대한민국 임시정부 상하이 청사',
    titleEn: 'Provisional Government of the Republic of Korea in Shanghai',
    era: '일제강점기 (1919년 수립)',
    lat: 31.2172,
    lng: 121.4746,
    location: '중국 상하이시 황푸구 마당로 306농 4호',
    museum: '대한민국 임시정부 상하이 청사 유적지',
    designation: '국외 독립운동 사적지',
    docent: '3·1 운동을 계기로 수립된 대한민국 임시정부가 상하이에서 활동한 사실을 보여 주는 청사 유적입니다.',
    examTip: '대한민국 임시정부 = 3·1 운동 계기 / 상하이 / 민주 공화제 / 임시헌장',
    context: '현재 보존된 마당로 청사는 임시정부가 1926년부터 1932년까지 사용한 곳입니다. 지도 표시는 독립기념관이 아니라 실제 상하이 청사 위치입니다.',
    quiz: {
      question: '3·1 운동을 계기로 상하이에서 수립된 정부는?',
      options: ['대한민국 임시정부', '대한 국민 의회', '한성 정부', '대한광복회'],
      answer: 0,
      explanation: '대한민국 임시정부는 1919년 상하이에서 수립되었습니다.'
    }
  });

  Object.assign(relicById('k03'), {
    location: '충북 청주 흥덕사 인쇄 → 프랑스 반출',
    museum: '프랑스 국립도서관(BnF) — 앙리 베베르가 1950년 유증',
    docent: '1377년 청주 흥덕사에서 금속활자로 인쇄한 현존 세계 최고(最古)의 금속활자본입니다. 현재 남아 있는 하권 1책은 프랑스 국립도서관이 소장하고 있습니다.',
    context: '구한말 주한 프랑스 외교관 빅토르 콜랭 드 플랑시가 서울에서 직지를 입수해 프랑스로 가져갔습니다. 1911년 경매에서 프랑스 수집가 앙리 베베르가 구입했고, 베베르가 1950년 프랑스 국립도서관에 유증하여 오늘날 파리 BnF에 보관되어 있습니다.'
  });

  Object.assign(relicById('j03'), {
    location: '조선 제작 → 일본 반출(정확한 경위 미상)',
    museum: '일본 덴리대학교 부속 덴리도서관',
    docent: '안평대군이 꿈에서 본 도원을 설명하자 화원 안견이 1447년 사흘 만에 그린 조선 전기 대표 산수화입니다. 그림과 안평대군의 발문, 당대 문인들의 찬문이 한 두루마리에 함께 실려 있습니다.',
    context: '이 작품이 언제, 누구를 통해 일본으로 건너갔는지는 확인되는 기록이 없어 반출 경위를 단정할 수 없습니다. 현재 일본 덴리대학교 부속 덴리도서관이 소장하고 있으므로, 임진왜란 약탈이나 일제강점기 반출이라고 확정해서 설명하면 안 됩니다.'
  });

  const EXAM_RELIC_ADDITIONS = [
    {
      id: 'a01', title: '가야 철제 갑옷과 투구', titleEn: 'Gaya Iron Armor and Helmet',
      eraCategory: 'three_kingdoms', era: '가야 (4~5세기)', lat: 35.2061, lng: 129.0900,
      location: '부산 복천동 고분군 등 가야권', museum: '국립중앙박물관·복천박물관',
      designation: '가야 대표 철기 유물',
      docent: '판 모양의 철을 이어 만든 갑옷과 투구로, 철 생산과 교역을 바탕으로 성장한 가야의 모습을 보여 줍니다.',
      context: '둥근 철 투구와 목을 감싸는 가리개, 철판을 이어 몸통을 두른 갑옷이 한 벌을 이룹니다. 가야는 낙동강 유역의 풍부한 철을 생산해 한반도와 왜에 수출했습니다. 시험에서는 철제 갑옷·덩이쇠와 함께 가야의 철기 문화를 연결해 묻습니다.',
      examTip: '가야 = 낙동강 유역 / 철 생산·수출 / 철제 갑옷과 덩이쇠',
      quiz: { question: '철제 갑옷과 덩이쇠가 대표하는 연맹 왕국은?', options: ['가야', '부여', '옥저', '동예'], answer: 0, explanation: '가야는 풍부한 철을 생산하고 수출했습니다.' }
    },
    {
      id: 'b04', title: '익산 미륵사지 석탑', titleEn: 'Iksan Mireuksaji Stone Pagoda',
      eraCategory: 'three_kingdoms', era: '백제 무왕 (7세기)', lat: 36.0123, lng: 127.0295,
      location: '전북 익산 미륵사지', museum: '익산 미륵사지',
      designation: '국보·백제역사유적지구',
      docent: '목탑의 구조를 돌로 옮긴 백제 최대 규모의 석탑으로, 백제 석탑 양식의 전개를 보여 줍니다.',
      context: '탑을 해체·수리하는 과정에서 사리장엄구와 금제 사리봉영기가 발견되어 미륵사 창건과 백제 왕실 불교를 이해하는 핵심 자료가 되었습니다.',
      examTip: '미륵사지 석탑 = 백제 무왕 / 목탑 양식 계승 / 익산',
      quiz: { question: '백제 무왕 때 익산에 세워진 목탑 계통의 석탑은?', options: ['미륵사지 석탑', '정림사지 5층석탑', '석가탑', '분황사 모전석탑'], answer: 0, explanation: '익산 미륵사지 석탑은 백제의 대표 석탑입니다.' }
    },
    {
      id: 's15', title: '불국사 다보탑과 석가탑', titleEn: 'Dabotap and Seokgatap at Bulguksa',
      eraCategory: 'unified_silla', era: '통일신라 (8세기)', lat: 35.7898, lng: 129.3321,
      location: '경북 경주 불국사', museum: '경주 불국사',
      designation: '국보·유네스코 세계유산',
      docent: '화려하고 독창적인 다보탑과 간결하고 균형 잡힌 석가탑은 통일신라 석탑 예술을 대표합니다.',
      context: '두 탑은 법화경의 다보여래와 석가여래가 나란히 앉은 장면을 건축으로 표현했습니다. 석가탑에서는 무구정광대다라니경이 발견되었습니다.',
      examTip: '불국사 = 통일신라 불교 미술 / 다보탑·석가탑 / 석가탑에서 무구정광대다라니경 발견',
      quiz: { question: '무구정광대다라니경이 발견된 탑은?', options: ['불국사 석가탑', '불국사 다보탑', '미륵사지 석탑', '정림사지 오층석탑'], answer: 0, explanation: '무구정광대다라니경은 불국사 석가탑에서 발견되었습니다.' }
    },
    {
      id: 'j18', title: '분청사기 철화 물고기무늬 병', titleEn: 'Buncheong Bottle with Fish Design',
      eraCategory: 'joseon', era: '조선 전기 (15~16세기)', lat: 36.3500, lng: 127.2000,
      location: '충남 공주 계룡산 일대 가마', museum: '국립중앙박물관',
      designation: '조선 전기 대표 도자기',
      docent: '회청색 그릇 표면에 백토를 입히고 철화 안료로 물고기와 연꽃을 힘차게 그린 분청사기입니다.',
      context: '분청사기는 고려청자의 전통을 이으면서도 자유롭고 소박한 무늬를 발전시켰습니다. 시험에서는 고려청자·조선 전기 분청사기·조선 백자를 시대순으로 구분합니다.',
      examTip: '조선 전기 = 분청사기 / 회청색 바탕에 백토 분장 / 자유롭고 소박한 무늬',
      quiz: { question: '회청색 바탕에 백토를 입혀 다양한 무늬를 낸 조선 전기 도자기는?', options: ['분청사기', '상감청자', '순청자', '청화백자'], answer: 0, explanation: '분청사기는 조선 전기의 대표 도자기입니다.' }
    },
    {
      id: 'j19', title: '조선왕조실록', titleEn: 'Veritable Records of the Joseon Dynasty',
      eraCategory: 'joseon', era: '조선 시대', lat: 37.4620, lng: 126.9510,
      location: '춘추관 편찬·사고 분산 보관', museum: '규장각한국학연구원·국가기록유산 보관기관',
      designation: '국보·유네스코 세계기록유산',
      docent: '태조부터 철종까지 역대 왕의 정치와 사회를 편년체로 기록한 조선의 공식 역사서입니다.',
      context: '왕이 죽은 뒤 실록청에서 사초와 시정기 등을 바탕으로 편찬했으며, 왕조차 함부로 열람할 수 없었습니다. 여러 사고에 나누어 보관해 전쟁과 화재에 대비했습니다.',
      examTip: '조선왕조실록 = 편년체 / 사관의 독립성 / 사고에 분산 보관',
      quiz: { question: '임금이 세상을 떠난 뒤 사초 등을 모아 편년체로 편찬하고 왕도 함부로 볼 수 없었던 기록은?', options: ['조선왕조실록', '승정원일기', '일성록', '동국통감'], answer: 0, explanation: '조선왕조실록은 태조부터 철종까지의 공식 기록입니다.' }
    },
    {
      id: 'm07', title: '3·1 독립선언서', titleEn: 'Korean Declaration of Independence',
      eraCategory: 'modern', era: '일제강점기 (1919년)', lat: 37.5710, lng: 126.9880,
      location: '서울 태화관·탑골공원', museum: '독립기념관 등',
      designation: '3·1 운동 핵심 기록',
      docent: '민족 대표들이 조선의 독립국임과 자주민임을 선언한 문서로 3·1 운동의 전국적 확산을 이끌었습니다.',
      context: '민족 대표는 태화관에서 선언식을 열었고, 탑골공원에서는 학생과 시민이 독립선언서를 낭독하고 만세 시위를 시작했습니다. 이후 대한민국 임시정부 수립에 영향을 주었습니다.',
      examTip: '3·1 운동 = 독립선언서 / 비폭력 만세 시위 / 대한민국 임시정부 수립의 계기',
      quiz: { question: '대한민국 임시정부 수립의 직접적 계기가 된 운동은?', options: ['3·1 운동', '6·10 만세 운동', '광주 학생 항일 운동', '물산 장려 운동'], answer: 0, explanation: '3·1 운동을 계기로 대한민국 임시정부가 수립되었습니다.' }
    },
    {
      id: 'g06', title: '강서대묘 사신도 (현무)', titleEn: 'Four Guardian Mural (Black Tortoise)',
      eraCategory: 'three_kingdoms', era: '고구려 후기 (6~7세기)', lat: 38.8670, lng: 125.4500,
      location: '평남 강서군 강서대묘', museum: '고구려 고분군 현지 보존',
      designation: '유네스코 세계유산 고구려 고분군',
      docent: '강서대묘 널방 북벽에 그린 현무입니다. 거북과 뱀이 얽힌 형상은 북쪽을 지키는 수호신을 뜻합니다.',
      context: '고구려 후기에는 무덤 주인의 생활 장면보다 청룡·백호·주작·현무의 사신도가 중심이 되었습니다. 강서대묘 벽화는 힘찬 선과 선명한 색으로 고구려 고분 벽화의 높은 수준을 보여 줍니다.',
      examTip: '강서대묘 = 고구려 후기 / 굴식 돌방무덤 / 사신도 / 도교·방위 수호',
      quiz: { question: '거북과 뱀이 얽힌 모습으로 북쪽을 지키는 사신은?', options: ['현무', '청룡', '백호', '주작'], answer: 0, explanation: '현무는 북쪽을 지키는 사신입니다.' }
    },
    {
      id: 'b05', title: '부여 외리 산수무늬 벽돌', titleEn: 'Landscape-design Brick from Buyeo',
      eraCategory: 'three_kingdoms', era: '백제 사비기 (7세기)', lat: 36.2790, lng: 126.9140,
      location: '충남 부여 외리 유적 출토', museum: '국립부여박물관',
      designation: '보물 부여 외리 문양전 일괄',
      docent: '산과 구름, 나무와 건물을 한 폭의 풍경처럼 새긴 백제의 벽돌입니다.',
      context: '도교적 신선 세계를 연상시키는 산수 표현과 부드러운 선은 백제 미술의 세련미를 보여 줍니다. 시험에서는 백제 사비기 문화와 산수무늬 벽돌을 연결해 묻습니다.',
      examTip: '산수무늬 벽돌 = 백제 사비기 / 부여 외리 / 도교적 신선 세계',
      quiz: { question: '부여 외리에서 출토되었으며 도교의 신선 세계를 떠올리게 하는 풍경을 새긴 벽돌은?', options: ['산수무늬 벽돌', '연꽃무늬 벽돌', '도깨비무늬 벽돌', '봉황무늬 벽돌'], answer: 0, explanation: '산수무늬 벽돌은 백제 사비기 미술을 대표합니다.' }
    },
    {
      id: 's16', title: '호우명 그릇', titleEn: 'Bronze Bowl with the Inscription Hou',
      eraCategory: 'three_kingdoms', era: '신라 (5세기)', lat: 35.8418, lng: 129.2110,
      location: '경북 경주 호우총 출토', museum: '국립중앙박물관',
      designation: '보물 호우총 출토 청동 그릇',
      docent: '그릇 바닥에 광개토 대왕을 가리키는 명문이 새겨진 고구려계 청동 그릇입니다.',
      context: '신라 무덤인 호우총에서 고구려 광개토 대왕 관련 명문이 발견된 사실은 5세기 고구려와 신라의 밀접한 관계를 보여 줍니다. 유물의 제작 문화와 출토 장소를 구분하는 것이 핵심입니다.',
      examTip: '호우명 그릇 = 경주 호우총 출토 / 광개토 대왕 명문 / 고구려와 신라의 관계',
      quiz: { question: '경주의 신라 무덤에서 출토되어 5세기 고구려와 신라의 관계를 보여 주는 유물은?', options: ['호우명 그릇', '칠지도', '금관총 금관', '충주 고구려비'], answer: 0, explanation: '호우명 그릇에는 광개토 대왕 관련 명문이 있습니다.' }
    },
    {
      id: 's17', title: '발해 정효공주묘 벽화', titleEn: 'Murals of Princess Jeonghyo’s Tomb',
      eraCategory: 'unified_silla', era: '발해 문왕 (792년)', lat: 42.5600, lng: 129.0000,
      location: '중국 지린성 허룽 용두산 고분군', museum: '정효공주묘 현지 보존',
      designation: '발해 왕실 고분 벽화',
      docent: '발해 문왕의 딸 정효공주 무덤에 그려진 인물 벽화로 발해 왕실의 생활과 복식을 보여 줍니다.',
      context: '무덤은 당의 영향을 받은 벽돌무덤이지만 천장에는 고구려 계통의 모줄임 구조가 나타납니다. 벽화와 묘지석을 통해 발해가 고구려 문화를 계승하면서 당 문화를 받아들였음을 확인할 수 있습니다.',
      examTip: '정효공주묘 = 발해 / 벽돌무덤·인물 벽화 / 고구려 계승과 당 문화 수용',
      quiz: { question: '벽돌무덤과 인물 벽화로 발해 문화의 국제성을 보여 주는 무덤은?', options: ['정효공주묘', '정혜공주묘', '무령왕릉', '장군총'], answer: 0, explanation: '정효공주묘는 발해 왕실 문화의 핵심 자료입니다.' }
    },
    {
      id: 'j20', title: '강희안 고사관수도', titleEn: 'Scholar Contemplating Water',
      eraCategory: 'joseon', era: '조선 전기 (15세기)', lat: 37.5239, lng: 126.9804,
      location: '조선 전기 제작', museum: '국립중앙박물관',
      designation: '보물 고사관수도',
      docent: '선비가 물을 바라보며 사색하는 모습을 간결하고 힘찬 먹선으로 표현한 강희안의 그림입니다.',
      context: '인물을 화면 한쪽에 두고 넓은 여백을 살린 구도는 조선 전기 문인화의 특징을 보여 줍니다. 시험에서는 안견의 몽유도원도와 함께 조선 전기 회화로 자주 비교됩니다.',
      examTip: '고사관수도 = 강희안 / 조선 전기 문인화 / 사색하는 선비·여백',
      quiz: { question: '물가에서 사색하는 선비를 그린 강희안의 조선 전기 회화는?', options: ['고사관수도', '몽유도원도', '인왕제색도', '단오풍정'], answer: 0, explanation: '고사관수도는 강희안의 대표 문인화입니다.' }
    },
    {
      id: 'l04', title: '신윤복 단오풍정', titleEn: 'Dano Day by Shin Yun-bok',
      eraCategory: 'joseon', era: '조선 후기 (18세기 말~19세기 초)', lat: 37.5920, lng: 126.9980,
      location: '조선 후기 한양 풍속', museum: '간송미술문화재단',
      designation: '국보 혜원전신첩 수록',
      docent: '단옷날 그네를 타고 머리를 감는 여성들의 모습을 밝은 색채와 섬세한 선으로 그린 풍속화입니다.',
      context: '신윤복은 양반과 여성의 생활, 남녀의 정취를 감각적으로 묘사했습니다. 서민의 생업과 공동체 생활을 익살스럽게 그린 김홍도의 풍속화와 비교하면 작가의 특징이 선명해집니다.',
      examTip: '단오풍정 = 신윤복 / 조선 후기 풍속화 / 여성 생활·섬세한 색채',
      quiz: { question: '단옷날 여성들의 생활을 섬세한 색채로 그린 화가는?', options: ['신윤복', '김홍도', '정선', '강희안'], answer: 0, explanation: '단오풍정은 신윤복의 혜원전신첩에 실린 작품입니다.' }
    }
  ];

  RELICS_MASTER.push(...EXAM_RELIC_ADDITIONS);

  const EXAM_CORE_IDS = [
    'p01', 'p02', 'p03', 'p05', 'p06', 'p07', 'p08', 'p09', 'p11',
    'g01', 'g02', 'g04', 'g05', 'g06',
    'b01', 'b02', 'b03', 'b04', 'b05', 'k04', 'a01',
    's01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's11', 's13', 's14', 's15', 's16', 's17',
    'k01', 'k02', 'k03', 'k05', 'k06', 'k07', 'k08',
    'j01', 'j02', 'j03', 'j06', 'j07', 'j08', 'j12', 'j13', 'j14', 'j15', 'j16', 'j17', 'j18', 'j19', 'j20',
    'l01', 'l02', 'l03', 'l04',
    'm01', 'm03', 'm04', 'm05', 'm06', 'm07'
  ];

  const EXAM_RELICS = EXAM_CORE_IDS
    .map(id => RELICS_MASTER.find(relic => relic.id === id))
    .filter(Boolean);

  EXAM_RELICS.forEach(relic => {
    relic.context = relic.context || RELIC_CONTEXT[relic.id] || '';
  });

  window.KOREAN_MUSEUM_DATA = {
    rooms: [
      { id: 'prehistoric', kicker: 'GALLERY 01', title: '선사시대 & 고조선관', subtitle: '한반도 인류의 시작과 단군왕검의 고조선 건국', themeColor: '#78350f', wallColor: 0x1e1b18, floorColor: 0x2e241c, works: EXAM_RELICS.filter(r => r.eraCategory === 'prehistoric') },
      { id: 'three_kingdoms', kicker: 'GALLERY 02', title: '삼국 & 가야관', subtitle: '고구려·백제·신라·가야의 성장과 문화 교류', themeColor: '#991b1b', wallColor: 0x241010, floorColor: 0x1a0b0b, works: EXAM_RELICS.filter(r => r.eraCategory === 'three_kingdoms') },
      { id: 'unified_silla', kicker: 'GALLERY 03', title: '통일신라 & 발해관', subtitle: '남북국의 발전과 불교 문화', themeColor: '#b45309', wallColor: 0x2b1a09, floorColor: 0x1c1106, works: EXAM_RELICS.filter(r => r.eraCategory === 'unified_silla') },
      { id: 'goryeo', kicker: 'GALLERY 04', title: '고려시대관', subtitle: '고려청자와 대장경, 금속활자', themeColor: '#0f766e', wallColor: 0x092623, floorColor: 0x051a18, works: EXAM_RELICS.filter(r => r.eraCategory === 'goryeo') },
      { id: 'joseon', kicker: 'GALLERY 05', title: '조선시대관', subtitle: '유교 통치와 과학·문화의 발달', themeColor: '#1e3a8a', wallColor: 0x0f182e, floorColor: 0x090f1f, works: EXAM_RELICS.filter(r => r.eraCategory === 'joseon') },
      { id: 'modern', kicker: 'GALLERY 06', title: '근현대관', subtitle: '근대 국가 수립과 독립운동', themeColor: '#0369a1', wallColor: 0x091b29, floorColor: 0x05111c, works: EXAM_RELICS.filter(r => r.eraCategory === 'modern') }
    ],
    relicsMaster: EXAM_RELICS,
    makeArtifactTextureSVG: getArtifactImageURL
  };
})();
