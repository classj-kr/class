(function () {
  'use strict';
  if (!window.THREE || !window.MUSEUM_ROOMS) {
    document.body.innerHTML = '<p style="padding:30px;color:white">미술관 파일을 불러오지 못했습니다.</p>';
    return;
  }

  const canvas = document.getElementById('museum-canvas');
  const roomTabs = document.getElementById('room-tabs');
  const loading = document.getElementById('loading');
  const loadingBar = document.getElementById('loading-bar');
  const loadingText = document.getElementById('loading-text');
  const prompt = document.getElementById('art-prompt');
  const promptTitle = document.getElementById('prompt-title');
  const promptKicker = document.getElementById('prompt-kicker');
  const promptAction = document.getElementById('prompt-action');
  const progressEl = document.getElementById('room-progress');
  const modal = document.getElementById('art-modal');
  const finaleModal = document.getElementById('finale-modal');
  const finaleQuestionWrap = document.getElementById('finale-question-wrap');
  const finaleComplete = document.getElementById('finale-complete');
  const finaleOptions = document.getElementById('finale-options');
  const finaleFeedback = document.getElementById('finale-feedback');
  const finaleNext = document.getElementById('finale-next');
  const finaleArtwork = document.getElementById('finale-artwork');
  const finaleArtworkImage = document.getElementById('finale-artwork-image');
  const rooms = window.MUSEUM_ROOMS;
  const presenceEl = document.getElementById('class-presence');
  const bgm = document.getElementById('bgm');
  const ROOM_MUSIC = [
    '../assets/sound/museum/gallery-01-portrait.ogg',
    '../assets/sound/museum/gallery-02-nature.ogg',
    '../assets/sound/museum/gallery-03-story.ogg',
    '../assets/sound/museum/gallery-04-line-color-imagination.ogg',
    '../assets/sound/museum/gallery-05-form-space.ogg'
  ];

  function setRoomMusic(index) {
    if (!bgm || !ROOM_MUSIC[index]) return;
    const nextSrc = new URL(ROOM_MUSIC[index], document.baseURI).href;
    if (bgm.src === nextSrc) return;
    const wasPlaying = !bgm.paused;
    bgm.src = ROOM_MUSIC[index];
    bgm.load();
    if (wasPlaying) bgm.play().catch(() => {});
  }

  const ROOM_QUIZZES = {
    portrait:{
      questions:[
        {q:'〈진주 귀걸이를 한 소녀〉의 얼굴을 비추는 빛은 어느 쪽에서 들어올까요?',options:['화면 왼쪽 위','화면 오른쪽 위','소녀의 머리 바로 위'],answer:0,explain:'화면 왼쪽 위에서 들어온 빛이 이마와 뺨, 입술과 진주를 밝히고, 반대쪽 얼굴에는 부드러운 그림자가 져요.'},
        {q:'윤두서의 〈자화상〉에서 거의 그려지지 않은 부분은 어디일까요?',options:['귀와 몸통','수염 한 올 한 올','두 눈동자'],answer:0,explain:'수염은 한 올까지 세밀하게 그렸지만 귀와 몸통은 거의 보이지 않아요. 그래서 정면을 바라보는 얼굴과 눈빛에 눈길이 모여요.'},
        {q:'〈모나리자〉의 두 손은 어떤 모습일까요?',options:['오른손을 왼손 위에 가볍게 포갰다','두 손으로 작은 책을 펼쳐 들었다','한 손으로 턱을 괴었다'],answer:0,explain:'오른손을 왼손 위에 포개 의자 팔걸이에 얹었어요. 아래쪽 두 손에서 머리까지 이어지는 삼각형이 인물을 안정감 있게 받쳐 줘요.'},
        {q:'뭉크의 〈절규〉에서 곧은 직선으로 그려진 것은 무엇일까요?',options:['비스듬히 뻗은 다리와 난간','붉게 물든 하늘','바닷가와 언덕'],answer:0,explain:'다리와 난간만 곧은 대각선으로 뻗고, 하늘과 바다, 언덕은 구불구불 휘돌아요. 곧은 선과 휘도는 선이 부딪치며 불안한 느낌이 커져요.'},
        {q:'페르메이르의 〈우유를 따르는 여인〉에서 부엌을 밝히는 빛은 어디에서 들어올까요?',options:['왼쪽 벽의 창문','오른쪽 뒤의 열린 문','탁자 위의 촛불'],answer:0,explain:'왼쪽 창문으로 들어온 빛이 여인의 얼굴과 팔, 빵과 우유 항아리를 차례로 비춰요.'},
        {q:'마네의 〈피리 부는 소년〉 뒤의 배경은 어떤 모습일까요?',options:['바닥과 벽의 경계도 흐린 평평한 회색','커튼과 기둥이 있는 화려한 방','해 질 녘 들판이 펼쳐진 풍경'],answer:0,explain:'바닥과 벽의 경계조차 거의 없는 평평한 회색 배경이라, 검정·빨강·흰색 제복과 소년의 윤곽이 또렷하게 떠올라요.'},
        {q:'신윤복의 〈미인도〉 속 여인의 머리 모양은 어떤가요?',options:['땋은 머리를 크고 풍성하게 얹었다','뒤로 곱게 빗어 비녀를 꽂았다','길게 땋아 등 뒤로 늘였다'],answer:0,explain:'땋은 머리(가체)를 머리 위에 크고 풍성하게 얹었어요. 짧게 붙는 저고리, 넓게 부푼 치마와 함께 조선 후기에 유행한 차림이에요.'},
        {q:'고흐의 〈회색 펠트모자를 쓴 자화상〉에서 얼굴과 배경은 어떻게 칠했을까요?',options:['짧은 붓질을 여러 방향으로 쌓았다','물감을 얇게 펴 발라 붓자국을 지웠다','굵은 검은 윤곽선 안을 한 색으로 채웠다'],answer:0,explain:'짧은 붓질이 얼굴과 옷, 배경에서 서로 다른 방향으로 쌓여 떨리는 듯한 생동감을 만들어요.'},
        {q:'클림트의 〈키스〉에서 검고 흰 네모 무늬는 어디에 모여 있을까요?',options:['남자의 옷','여자의 옷','두 사람 발밑의 꽃밭'],answer:0,explain:'남자의 옷에는 곧은 네모 무늬가, 여자의 옷에는 동그란 꽃무늬가 모여 있어요. 서로 다른 무늬가 커다란 금빛 옷 안에서 하나로 포개져요.'},
        {q:'밀레의 〈이삭 줍는 사람들〉에서 세 사람 뒤 먼 곳에 보이는 것은?',options:['높이 쌓인 곡식 더미와 일꾼들','뾰족한 교회 탑이 선 마을','물레방아가 도는 냇가'],answer:0,explain:'멀리에는 거둬들인 곡식이 높이 쌓여 있고 일꾼들이 바쁘게 움직여요. 앞쪽 세 사람은 수확이 끝난 들판에서 남은 이삭을 줍고 있어요.'},
        {q:'드가의 〈흔들리는 무희〉가 사진으로 찍은 한순간처럼 느껴지는 까닭은?',options:['위에서 비스듬히 보며 가장자리 인물을 잘라서','객석 한가운데서 무대를 똑바로 봐서','인물 둘레를 굵은 선으로 또렷이 그려서'],answer:0,explain:'위에서 비스듬히 내려다본 시점과 화면 가장자리에서 잘린 무희들이 사진기로 막 찍은 듯한 순간을 만들어요.'},
        {q:'피카소의 〈우는 여인〉이 입가에 대고 움켜쥔 것은 무엇일까요?',options:['손수건','꽃 한 송이','편지 한 장'],answer:0,explain:'여인은 손수건을 입가에 대고 움켜쥐었어요. 뾰족하게 쪼개진 얼굴과 손가락, 손수건의 각진 선이 슬픔을 날카롭게 전해요.'}
      ]
    },
    nature:{
      questions:[
        {q:'반 고흐의 〈별이 빛나는 밤〉 왼쪽 앞에 불꽃처럼 하늘로 솟은 것은?',options:['사이프러스 나무','교회의 뾰족한 탑','마을의 풍차'],answer:0,explain:'왼쪽 앞의 사이프러스 나무가 불꽃처럼 솟아 조용한 마을과 소용돌이치는 하늘을 이어 줘요.'},
        {q:'모네의 〈수련〉 화면에서 찾을 수 없는 것은?',options:['하늘과 물이 만나는 수평선','물 위에 비친 하늘빛','물에 떠 있는 수련 잎'],answer:0,explain:'수평선도 연못가도 없이 물 위만 가득 그려, 물에 비친 하늘과 수련이 한데 어우러져요.'},
        {q:'정선의 〈인왕제색도〉는 어떤 날의 인왕산을 그렸을까요?',options:['비가 그치고 안개가 피어오르는 날','눈이 소복이 쌓인 겨울날','단풍이 붉게 물든 가을날'],answer:0,explain:'여름 장맛비가 그친 뒤의 인왕산이에요. 비에 젖은 바위는 짙은 먹으로, 피어오르는 안개는 비워 둔 종이로 나타냈어요.'},
        {q:'고흐의 〈해바라기〉 화병에는 어떤 꽃들이 꽂혀 있을까요?',options:['활짝 핀 꽃과 시들어 가는 꽃','아직 피지 않은 꽃봉오리들','노랑·빨강·흰색의 여러 가지 꽃'],answer:0,explain:'활짝 핀 해바라기부터 꽃잎이 말라 가는 해바라기까지 한 화병에 담아, 꽃이 피고 지는 시간을 보여 줘요.'},
        {q:'모네의 〈인상, 해돋이〉는 어떤 곳의 아침일까요?',options:['안개 낀 항구','눈 덮인 산골 마을','꽃이 핀 정원 연못'],answer:0,explain:'르아브르 항구의 아침 안개 속에 배와 굴뚝이 흐릿하게 보이고, 작은 주황빛 해가 물 위에 비쳐요.'},
        {q:'〈호작도〉의 호랑이는 어떤 모습으로 그려졌을까요?',options:['눈을 동그랗게 뜬 익살스러운 모습','먹이를 덮치는 사나운 모습','바위 위에 엎드려 잠든 모습'],answer:0,explain:'무서워야 할 호랑이를 동그란 눈의 익살스러운 모습으로, 까치는 당당하게 그렸어요. 나쁜 기운은 막고 반가운 소식은 부르려는 마음이 담겨 있어요.'},
        {q:'〈초충도(수박과 들쥐)〉에서 들쥐들은 무엇을 하고 있을까요?',options:['수박 속을 파먹고 있다','나비를 쫓아 뛰고 있다','풀숲에 숨어 잠들어 있다'],answer:0,explain:'들쥐 두 마리가 수박 속을 파먹고, 위로는 나비가 날고 옆에는 패랭이꽃이 피어 있어요. 작은 생명들이 한 화면에 어우러져요.'},
        {q:'이중섭의 〈흰 소〉에서 소는 어떤 자세일까요?',options:['머리를 낮추고 힘껏 한 발 내딛는 자세','다리를 접고 편히 엎드린 자세','고개를 쳐들고 크게 우는 자세'],answer:0,explain:'머리를 낮추고 한 발을 힘껏 내딛는 소를 굵고 거친 선으로 그려, 버티며 나아가려는 힘이 느껴져요.'},
        {q:'김홍도의 〈황묘농접도〉 속 고양이와 나비에 담긴 바람은 무엇일까요?',options:['오래오래 사는 것','과거 시험에 붙는 것','자식을 많이 두는 것'],answer:0,explain:'고양이와 나비를 가리키는 한자가 일흔 살·여든 살 노인을 뜻하는 한자와 소리가 비슷해요. 그래서 오래 살기를 바라는 마음을 담았어요.'},
        {q:'아르침볼도의 〈여름〉에서 사람의 코는 무엇으로 되어 있을까요?',options:['오이','가지','옥수수'],answer:0,explain:'코는 오이, 뺨은 복숭아, 턱은 배, 귀는 옥수수예요. 여름에 나는 열매와 채소로 사람의 옆얼굴을 만들었어요.'},
        {q:'모네의 〈양산을 든 여인〉은 여인을 어디에서 바라본 모습일까요?',options:['언덕 아래에서 올려다본 모습','높은 곳에서 내려다본 모습','바로 옆 같은 높이에서 본 모습'],answer:0,explain:'언덕 아래에서 올려다보아 여인이 하늘을 배경으로 서 있어요. 옷자락과 풀, 구름이 바람 따라 한쪽으로 흘러요.'},
        {q:'루소의 〈꿈〉에서 정글 속 여인은 어디에 있을까요?',options:['소파에 비스듬히 누워 있다','나무 위 오두막에 앉아 있다','작은 배를 타고 있다'],answer:0,explain:'실내에 있어야 할 소파가 울창한 정글 한가운데 놓여 있고, 여인이 그 위에 기대 누워 있어요. 현실과 꿈이 뒤섞인 낯선 장면이에요.'}
      ]
    },
    story:{
      questions:[
        {q:'신윤복의 〈단오풍정〉에 담긴 단옷날 풍습은 무엇일까요?',options:['그네 타기와 냇가에서 머리 감기','연날리기와 윷놀이','송편 빚기와 강강술래'],answer:0,explain:'단옷날에는 그네를 타고 창포 삶은 물에 머리를 감았어요. 그네 타는 여인과 냇가에서 머리 감는 여인들이 여러 무리로 나뉘어 담겨 있어요.'},
        {q:'〈아담의 창조〉는 원래 어디에 그려진 그림일까요?',options:['성당의 천장','성당 제단 뒤의 벽','궁전 연회장의 벽'],answer:0,explain:'시스티나 성당 천장에 그린 벽화예요. 미켈란젤로는 1508년부터 4년 동안 높은 발판에 올라 천장 전체를 그렸어요.'},
        {q:'김정희가 〈세한도〉를 그릴 때 어떤 처지였을까요?',options:['제주도에 유배되어 있었다','청나라에 사신으로 가 있었다','궁궐에서 그림 그리는 일을 맡고 있었다'],answer:0,explain:'제주도에 유배된 김정희에게 제자 이상적이 귀한 책을 보내 주었어요. 그 고마움을 겨울에도 푸른 소나무와 잣나무에 담아 그려 보냈어요.'},
        {q:'김홍도의 〈서당〉에서 훈장님 바로 앞에 앉은 아이는 무엇을 하고 있을까요?',options:['돌아앉아 눈물을 닦고 있다','무릎 꿇고 절을 올리고 있다','책을 펴 들고 소리 내어 읽고 있다'],answer:0,explain:'글을 외우지 못해 꾸중을 들은 아이가 돌아앉아 눈물을 닦고, 둘러앉은 친구들은 웃음을 참고 있어요.'},
        {q:'보티첼리의 〈봄〉은 어느 쪽에서 시작해 어느 쪽으로 이야기가 이어질까요?',options:['오른쪽의 바람에서 왼쪽으로','왼쪽의 수호신에서 오른쪽으로','가운데 여신에서 양쪽으로'],answer:0,explain:'오른쪽 끝의 서풍이 요정을 붙잡자 요정이 꽃의 여신으로 바뀌고, 가운데 비너스를 지나 왼쪽 끝의 수호신이 구름을 걷어 내며 봄의 이야기가 이어져요.'},
        {q:'밀레의 〈만종〉에서 두 농부가 일손을 멈추고 고개를 숙인 까닭은?',options:['저녁 기도를 알리는 종이 울려서','해가 져서 일을 더 할 수 없어서','바구니 속 감자를 세어 보려고'],answer:0,explain:'멀리 교회에서 저녁 기도 종이 울리자 부부가 감자 캐던 손을 멈추고 기도해요. 밝은 하늘 앞의 어두운 두 사람이 조용한 순간을 만들어요.'},
        {q:'르누아르의 〈물랭 드 라 갈레트의 무도회〉에서 사람들을 비추는 빛은?',options:['나뭇잎 사이로 얼룩덜룩 비치는 햇빛','무대 위를 비추는 밝은 조명','해 질 녘 붉게 물든 노을빛'],answer:0,explain:'나뭇잎 사이로 들어온 햇빛이 옷과 얼굴에 작은 얼룩처럼 흩어져, 북적이는 무도회에 즐거운 리듬을 만들어요.'},
        {q:'보티첼리의 〈비너스의 탄생〉에서 비너스를 해안으로 밀어 보내는 바람은 어디에서 불어올까요?',options:['왼쪽의 날개 달린 바람의 신','오른쪽 해안에 선 여신','비너스 뒤쪽 먼바다'],answer:0,explain:'왼쪽에서 날개 달린 바람의 신이 입김을 불어 비너스를 오른쪽 해안으로 보내고, 해안의 계절의 여신이 옷을 펼쳐 맞이해요.'},
        {q:'프라고나르의 〈그네〉에서 그네를 타던 여인에게서 공중으로 날아간 것은?',options:['분홍 신발 한 짝','챙 넓은 모자','작은 부채'],answer:0,explain:'여인이 발을 차올리는 순간 분홍 신발 한 짝이 공중으로 날아가요. 날아간 신발과 세 인물의 시선을 따라가면 장면의 앞뒤 이야기가 보여요.'},
        {q:'안견의 〈몽유도원도〉에서 꿈속 여행은 어느 방향으로 이어질까요?',options:['왼쪽 현실에서 오른쪽 도원으로','오른쪽 현실에서 왼쪽 도원으로','가운데 도원에서 양쪽 현실로'],answer:0,explain:'두루마리 그림은 보통 오른쪽에서 왼쪽으로 읽지만, 〈몽유도원도〉는 왼쪽 아래 현실의 낮은 언덕에서 시작해 오른쪽의 기이한 산과 복숭아꽃 마을로 이어져요.'},
        {q:'이중섭의 〈길 떠나는 가족〉에서 가족은 어떻게 길을 떠나고 있을까요?',options:['소가 끄는 달구지를 타고','돛단배를 타고 바다를 건너','모두 걸어서 산길을 넘어'],answer:0,explain:'아버지가 앞에서 소를 끌고, 달구지에는 어머니와 두 아이가 꽃과 새와 함께 타고 있어요. 헤어진 가족과 다시 함께 살고 싶었던 작가의 바람이 담겨 있어요.'},
        {q:'김홍도의 〈빨래터〉에서 바위 뒤에 숨어 빨래터를 엿보는 사람은?',options:['부채로 얼굴을 가린 선비','물동이를 인 아이','지게를 진 나무꾼'],answer:0,explain:'오른쪽 위 바위 뒤에서 갓 쓴 선비가 부채로 얼굴을 가리고 몰래 내려다봐요. 빨래하는 사람들의 일상에 익살스러운 작은 사건이 더해져요.'}
      ]
    },
    shape:{
      questions:[
        {q:'몬드리안의 〈빨강, 파랑, 노랑의 구성 II〉에서 가장 넓은 면을 차지한 색은?',options:['빨강','파랑','노랑'],answer:0,explain:'오른쪽 위의 커다란 빨간 사각형이 화면을 크게 차지하고, 왼쪽 아래 파랑과 오른쪽 아래의 아주 작은 노랑이 무게를 나눠 맞춰요.'},
        {q:'쇠라의 〈그랑드 자트 섬의 일요일 오후〉를 아주 가까이에서 보면 무엇이 보일까요?',options:['서로 다른 색의 작은 점들','여러 방향으로 휘도는 굵은 붓질','얇게 펴 바른 매끈한 색면'],answer:0,explain:'서로 다른 순수한 색점을 나란히 찍었어요. 멀리 물러나면 점들이 눈 안에서 섞여 하나의 색처럼 보여요.'},
        {q:'마그리트가 〈이미지의 배반〉에 “이것은 파이프가 아니다”라고 쓴 까닭은?',options:['그림 속 파이프는 쓸 수 없는 그림일 뿐이라서','사실은 파이프를 닮은 다른 물건이라서','일부러 틀린 말을 적어 웃음을 주려고'],answer:0,explain:'그림 속 파이프는 손에 쥐거나 쓸 수 없어요. 실제 물건이 아니라 파이프의 모습을 그린 이미지라는 점을 일깨워요.'},
        {q:'칸딘스키는 〈구성 VIII〉의 원과 선, 삼각형을 무엇처럼 여겼을까요?',options:['서로 어울리는 음악의 음','지도 위의 도시와 길','밤하늘의 별자리'],answer:0,explain:'크기와 방향이 다른 원·선·삼각형이 음악의 음처럼 서로 밀고 당기며 긴장과 리듬을 만들어요.'},
        {q:'말레비치의 〈검은 사각형〉을 가까이에서 보면 어떤 모습일까요?',options:['가장자리가 조금 삐뚤고 표면에 잔금이 갔다','자를 대고 그린 듯 완벽한 정사각형이다','반짝이는 검은 돌판을 붙여 만들었다'],answer:0,explain:'완벽한 정사각형처럼 보이지만 가장자리가 조금씩 기울고, 오래된 물감에는 잔금이 가 있어요. 대상을 그리지 않고 검은 면 하나로 새로운 그림을 선언했어요.'},
        {q:'달리의 〈기억의 지속〉은 실제로 얼마나 큰 그림일까요?',options:['공책을 펼친 정도','교실 칠판만 한 크기','건물 벽을 덮는 크기'],answer:0,explain:'가로 33cm, 세로 24cm의 아주 작은 그림이에요. 작은 화면 속에서 단단해야 할 시계가 천처럼 늘어져 시간에 대한 낯선 상상을 만들어요.'},
        {q:'세잔의 〈사과와 오렌지〉 속 접시와 탁자는 어떻게 그려졌을까요?',options:['여러 방향에서 본 모습을 한 화면에 섞었다','한 점에서 본 정확한 원근법을 따랐다','윤곽을 지우고 색을 흐리게 번지게 했다'],answer:0,explain:'접시와 탁자, 천을 여러 위치에서 본 모습으로 섞어 조금씩 기울어 보이지만, 과일과 천이 묵직한 덩어리로 쌓여 화면이 단단해져요.'},
        {q:'마티스의 〈춤〉에서 둥글게 춤추는 다섯 사람의 손은 어떻게 이어져 있을까요?',options:['앞쪽 두 사람의 손이 닿을 듯 떨어져 있다','다섯 손이 빈틈없이 한 바퀴로 이어져 있다','두 사람씩 짝을 지어 손을 잡았다'],answer:0,explain:'앞쪽 두 사람의 손이 닿을 듯 말 듯 떨어져 있어요. 이 작은 틈 때문에 원이 멈추지 않고 계속 돌아갈 것 같은 긴장이 생겨요.'},
        {q:'김홍도의 〈씨름〉에서 혼자 씨름판을 등지고 있는 사람은 누구일까요?',options:['엿을 파는 아이','부채를 든 선비','갓을 벗어 둔 구경꾼'],answer:0,explain:'모두가 가운데 씨름꾼을 바라보는데, 엿판을 멘 아이만 딴 곳을 보고 있어요. 둥글게 둘러앉은 구경꾼들 덕분에 시선이 가운데로 모여요.'},
        {q:'김홍도의 〈무동〉에서 둥글게 앉아 연주하는 악사는 몇 명일까요?',options:['여섯 명','네 명','여덟 명'],answer:0,explain:'북·장구·피리 둘·대금·해금을 든 악사 여섯이 둥글게 앉아 연주하고, 그 가운데서 아이가 소매를 휘날리며 춤춰요.'},
        {q:'고흐의 〈아를의 침실〉에서 침대는 어떤 색으로 칠했을까요?',options:['노란 나무틀에 빨간 이불','흰 쇠틀에 파란 이불','검은 나무틀에 초록 이불'],answer:0,explain:'노란 침대와 빨간 이불, 파란 벽처럼 넓고 선명한 색면으로 방을 채웠어요. 선이 한 점으로 모이지 않아 방이 조금 기울어 보여요.'},
        {q:'마그리트의 〈골콩드〉에서 도시 하늘에 줄지어 떠 있는 것은?',options:['중절모를 쓴 신사들','초록 사과들','하얀 비둘기 떼'],answer:0,explain:'중절모를 쓴 비슷한 신사들이 일정한 간격으로 하늘에 떠 있어, 익숙한 도시가 낯선 무늬처럼 바뀌어요.'}
      ]
    },
    space:{
      questions:[
        {q:'〈최후의 만찬〉에서 벽과 천장의 선을 이어 보면 어디에서 만날까요?',options:['가운데 앉은 예수의 머리','맨 왼쪽 제자의 손끝','식탁 아래 바닥 한가운데'],answer:0,explain:'벽과 천장의 선이 모두 예수의 머리로 모여요. 그래서 눈길이 자연스럽게 가운데 예수에게 머물고 깊이도 함께 생겨요.'},
        {q:'렘브란트의 〈야경〉은 원래 어떤 그림으로 주문받았을까요?',options:['민병대원들의 단체 초상화','왕의 전쟁 승리를 기록한 그림','성당에 걸 성경 이야기 그림'],answer:0,explain:'도시를 지키던 민병대원들이 함께 주문한 단체 초상화예요. 렘브란트는 모두를 나란히 세우지 않고 출발 직전의 소란한 장면으로 바꾸어, 빛으로 주인공을 골라냈어요.'},
        {q:'벨라스케스의 〈시녀들〉 뒤쪽 거울에 비친 사람들은 누구일까요?',options:['공주의 부모인 왕과 왕비','캔버스 앞에 선 화가 자신','문간에 선 궁정 신하'],answer:0,explain:'뒤쪽 거울에 공주의 부모인 왕과 왕비가 비쳐요. 두 사람은 그림 밖, 바로 우리가 서 있는 자리에 있는 셈이에요.'},
        {q:'베로네세의 〈가나의 혼인잔치〉 앞쪽 한가운데에 모여 있는 사람들은?',options:['악기를 연주하는 악사들','음식을 나르는 하인들','춤추는 신랑과 신부'],answer:0,explain:'앞쪽 한가운데에서 악사들이 연주하고, 그 뒤로 식탁과 하객, 위쪽 테라스와 하늘까지 층층이 이어져 무대 같은 깊이가 생겨요.'},
        {q:'피카소의 〈아비뇽의 아가씨들〉에서 오른쪽 두 인물의 얼굴은 어떻게 그려졌을까요?',options:['가면처럼 거칠고 각진 얼굴','부드럽게 웃는 둥근 얼굴','옆모습만 보이는 작은 얼굴'],answer:0,explain:'오른쪽 두 인물은 가면처럼 거칠게 깎은 얼굴이에요. 아래쪽 인물은 등을 보이고 앉았는데 얼굴은 우리를 향해, 여러 시점이 한 몸에 섞여 있어요.'},
        {q:'샤갈의 〈나와 마을〉 위쪽 마을에서 볼 수 있는 낯선 모습은?',options:['거꾸로 서 있는 집과 사람','하늘을 나는 기차','물 위에 떠 있는 교회'],answer:0,explain:'위쪽 마을에는 집 몇 채와 여인이 거꾸로 서 있어요. 크기와 방향을 자유롭게 바꾸어 고향의 기억을 한 화면에 모았어요.'},
        {q:'라파엘로의 〈아테네 학당〉 한가운데 두 철학자의 손짓은 어떤 모습일까요?',options:['한 사람은 하늘을, 한 사람은 땅을 가리킨다','두 사람이 마주 보며 악수한다','두 사람 모두 두 팔을 넓게 벌렸다'],answer:0,explain:'가운데 플라톤은 하늘을, 아리스토텔레스는 땅을 향해 손을 내밀어요. 바닥과 아치의 원근선이 두 사람에게 모여 웅장한 공간의 중심이 돼요.'},
        {q:'〈아르놀피니 부부의 초상〉 뒤 볼록거울에는 부부 말고 몇 사람이 더 비칠까요?',options:['두 사람','한 사람','세 사람'],answer:0,explain:'거울에는 부부의 뒷모습과 함께 문간에 들어선 두 사람이 비쳐요. 그중 한 명은 화가 자신으로 여겨지고, 거울 위 벽에는 “얀 반 에이크가 여기 있었다”라는 글이 쓰여 있어요.'},
        {q:'정선의 〈금강전도〉에서 왼쪽 흙산과 오른쪽 바위산은 어떻게 다르게 그렸을까요?',options:['흙산은 먹점으로 부드럽게, 바위산은 날카로운 선으로','흙산은 날카로운 선으로, 바위산은 먹점으로 부드럽게','둘 다 진한 먹을 넓게 칠해 똑같이'],answer:0,explain:'왼쪽 흙산은 둥근 먹점을 찍어 부드럽게, 오른쪽 바위산은 뾰족하게 내리긋는 선으로 그렸어요. 하늘 높이에서 내려다보듯 봉우리 전체를 한 화면에 담았어요.'},
        {q:'카날레토의 〈베네치아 대운하〉가 실제처럼 깊어 보이는 까닭은?',options:['건물 벽의 선들이 멀리 한 점으로 모여서','먼 건물일수록 더 크고 진하게 그려서','건물의 선을 모두 나란히 평행하게 그어서'],answer:0,explain:'창문과 다리 난간까지 자를 대고 그린 듯한 선들이 멀리 한 점으로 모여, 운하가 화면 안쪽으로 깊게 뻗어 나가요.'},
        {q:'카라바조의 〈엠마오의 저녁 식사〉에서 식탁 끝에 아슬아슬하게 걸쳐 있는 것은?',options:['과일 바구니','포도주 병','빵 한 덩이'],answer:0,explain:'과일 바구니가 식탁 끝에 걸쳐 금방이라도 떨어질 듯해요. 놀라 팔을 벌린 제자처럼, 그림이 우리 쪽으로 튀어나오는 느낌을 만들어요.'}
      ]
    }
  };

  const OBSERVATION_WORK_IDS = {
    portrait:['p03','p01','p02','p05','p08','p12','p04','p06','p07','p09','p10','p11'],
    nature:['n01','n02','n03','n04','n10','n05','n06','n07','n08','c12','n11','n12'],
    story:['s01','s09','s07','s03','d09','s12','c11','s05','c10','s08','s10','s11'],
    shape:['c01','c06','c09','c02','c03','c04','c07','c08','s02','s06','n09','c05'],
    space:['s04','d07','d08','d14','d10','d11','d12','d15','d16','d17','d18']
  };

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x191613);
  scene.fog = new THREE.FogExp2(0x211d19, 0.014);

  const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.08, 130);
  camera.rotation.order = 'YXZ';
  camera.position.set(0, 1.68, 6.5);

  // 크롬북(내장 GPU)이 주 대상이라 픽셀 배율을 낮추고 그림자 계산은 끈다.
  const MAX_PIXEL_RATIO = 1.25;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, powerPreference:'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, MAX_PIXEL_RATIO));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.shadowMap.enabled = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;

  const textureLoader = new THREE.TextureLoader();
  const gltfLoader = new THREE.GLTFLoader();
  const textureCache = new Map();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const centerPointer = new THREE.Vector2(0,0);
  const clock = new THREE.Clock();
  const keys = Object.create(null);
  const clickable = [];
  const sculptureObstacles = [];
  const remotePeople = new Map();
  const remoteLayer = new THREE.Group(); scene.add(remoteLayer);
  const selfAvatar = makeSelfAvatar(); scene.add(selfAvatar);
  let presenceSocket = null, presenceTimer = 0, localPresenceId = null, presenceScope = 'class';
  const tmpDirection = new THREE.Vector3();
  const tmpRight = new THREE.Vector3();
  const velocity = new THREE.Vector3();
  let gallery = null;
  let activeRoom = 0;
  let yaw = 0;
  let pitch = -0.015;
  let dragging = false;
  let pointerDown = null;
  let nearest = null;
  let finaleSurface = null;
  let finaleQuizRoom = null;
  let finaleQuizIndex = 0;
  let finaleQuizCorrect = 0;
  let finaleQuizQuestions = [];
  const finaleLastQuestionSet = {};
  let loadTotal = 12;
  let loadDone = 0;
  let roomLoadVersion = 0;

  const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
  const GALLERY_START = 8;
  const GALLERY_END = -30;
  const avatarColors=[0x547da6,0x9d5b4c,0x5a896a,0x886ca5];
  function avatarColor(value){const text=String(value||'');let hash=0;for(let i=0;i<text.length;i++)hash=(hash*31+text.charCodeAt(i))>>>0;return avatarColors[hash%avatarColors.length];}

  function personLabel(name){const c=document.createElement('canvas');c.width=300;c.height=64;const g=c.getContext('2d');g.fillStyle='rgba(9,7,5,.82)';g.fillRect(0,4,300,52);g.strokeStyle='#d6b66b';g.strokeRect(1,5,298,50);g.fillStyle='#fff0ca';g.textAlign='center';g.font='bold 25px sans-serif';g.fillText(name,150,39);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));}
  function makeSelfAvatar(){
    const group=new THREE.Group();
    const cloth=new THREE.MeshStandardMaterial({color:0x547da6,roughness:.72});
    const skin=new THREE.MeshStandardMaterial({color:0xe2ad88,roughness:.82});
    const hair=new THREE.MeshStandardMaterial({color:0x241a15,roughness:.92});
    const torso=new THREE.Mesh(new THREE.CylinderGeometry(.2,.27,.58,14),cloth);torso.position.y=.94;
    const shoulders=new THREE.Mesh(new THREE.BoxGeometry(.58,.16,.22),cloth);shoulders.position.set(0,1.17,0);
    const neck=new THREE.Mesh(new THREE.CylinderGeometry(.075,.085,.13,12),skin);neck.position.y=1.3;
    const head=new THREE.Mesh(new THREE.SphereGeometry(.19,18,14),skin);head.position.y=1.47;
    const hairCap=new THREE.Mesh(new THREE.SphereGeometry(.198,18,10,0,Math.PI*2,0,Math.PI*.58),hair);hairCap.position.set(0,1.5,.005);
    const leftArm=new THREE.Mesh(new THREE.CylinderGeometry(.065,.075,.48,10),cloth);leftArm.position.set(-.28,.92,0);leftArm.rotation.z=-.08;
    const rightArm=leftArm.clone();rightArm.position.x=.28;rightArm.rotation.z=.08;
    group.add(torso,shoulders,neck,head,hairCap,leftArm,rightArm);
    group.userData.cloth=cloth;
    group.scale.setScalar(.72);
    group.traverse(part=>{if(part.isMesh){part.castShadow=false;part.receiveShadow=false;part.renderOrder=3;}});
    return group;
  }
  function makePerson(visitor){const g=new THREE.Group(), cloth=new THREE.MeshStandardMaterial({color:avatarColor(visitor.userId),roughness:.7,transparent:true,opacity:.86});const skin=new THREE.MeshStandardMaterial({color:0xe4b18d,roughness:.8,transparent:true,opacity:.86});const head=new THREE.Mesh(new THREE.SphereGeometry(.17,16,12),skin);head.position.y=1.38;const body=new THREE.Mesh(new THREE.CylinderGeometry(.18,.24,.54,12),cloth);body.position.y=.93;const leg=new THREE.Mesh(new THREE.CylinderGeometry(.07,.08,.42,10),new THREE.MeshStandardMaterial({color:0x23252c,transparent:true,opacity:.86}));leg.position.set(-.09,.42,0);const leg2=leg.clone();leg2.position.x=.09;g.add(head,body,leg,leg2);const label=personLabel(visitor.name);label.position.y=1.78;label.scale.set(.9,.19,1);g.add(label);remoteLayer.add(g);return g;}
  function updatePeople(visitors){const visible=visitors.filter(v=>v.userId!==localPresenceId);const ids=new Set(visible.map(v=>v.userId));for(const [id,entry] of remotePeople){if(!ids.has(id)){remoteLayer.remove(entry.group);remotePeople.delete(id);}}for(const v of visible){let entry=remotePeople.get(v.userId);if(!entry){entry={group:makePerson(v)};remotePeople.set(v.userId,entry);}entry.room=v.room;entry.x=v.x;entry.z=v.z;entry.yaw=v.yaw;entry.group.position.set(v.x,0,v.z);entry.group.rotation.y=v.yaw;entry.group.visible=v.room===rooms[activeRoom].id;}}
  async function connectClassPresence(){try{const name=String(localStorage.getItem('classPlayerName')||'').trim();let clientId=localStorage.getItem('museumPresenceClientId');if(!clientId){clientId=crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`;localStorage.setItem('museumPresenceClientId',clientId);}const query=new URLSearchParams({name,clientId});const response=await fetch(`/api/museum/presence-ticket?${query}`);if(!response.ok)return;const payload=await response.json();presenceScope=payload.scope||'class';const proto=location.protocol==='https:'?'wss':'ws';presenceSocket=new WebSocket(`${proto}://${location.host}`);presenceSocket.addEventListener('open',()=>presenceSocket.send(JSON.stringify({type:'MUSEUM_JOIN',ticket:payload.ticket})));presenceSocket.addEventListener('message',event=>{const msg=JSON.parse(event.data);if(msg.type==='MUSEUM_JOINED'){localPresenceId=msg.userId;selfAvatar.userData.cloth.color.setHex(avatarColor(msg.userId));}if(msg.type==='MUSEUM_STATE'){updatePeople(msg.visitors);const here=msg.visitors.filter(v=>v.room===rooms[activeRoom].id).length;presenceEl.textContent=presenceScope==='open'?`함께 관람 중 ${here}명`:`우리 반 함께 관람 중 ${here}명`;presenceEl.hidden=false;}});}catch(_) {}}
  function sendPresence(){if(!presenceSocket||presenceSocket.readyState!==WebSocket.OPEN)return;const now=performance.now();if(now-presenceTimer<100)return;presenceTimer=now;presenceSocket.send(JSON.stringify({type:'MUSEUM_MOVE',room:rooms[activeRoom].id,x:camera.position.x,z:camera.position.z,yaw}));}

  function surfaceTexture(path,repeatX,repeatY,color=true) {
    const texture=textureLoader.load(path);
    texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
    texture.repeat.set(repeatX,repeatY);
    texture.anisotropy=Math.min(12,renderer.capabilities.getMaxAnisotropy());
    if(color)texture.encoding=THREE.sRGBEncoding;
    return texture;
  }

  const floorAlbedo=surfaceTexture('assets/textures/walnut-floor-albedo.webp?v=2',4,12.5);
  const floorBump=surfaceTexture('assets/textures/walnut-floor-bump.webp?v=2',4,12.5,false);
  const wallAlbedo=surfaceTexture('assets/textures/charcoal-fabric-albedo.webp?v=2',12,6);
  const wallBump=surfaceTexture('assets/textures/charcoal-fabric-bump.webp?v=2',12,6,false);
  const plasterAlbedo=surfaceTexture('assets/textures/warm-plaster-albedo.webp?v=2',2.4,7.2);
  const plasterBump=surfaceTexture('assets/textures/warm-plaster-bump.webp?v=2',2.4,7.2,false);
  const materials = {
    wall:new THREE.MeshStandardMaterial({map:wallAlbedo,bumpMap:wallBump,bumpScale:.004,color:0xf0ece8,roughness:.94,metalness:0}),
    wallInset:new THREE.MeshStandardMaterial({map:wallAlbedo,bumpMap:wallBump,bumpScale:.003,color:0xa19b95,roughness:.96,metalness:0}),
    walnut:new THREE.MeshStandardMaterial({map:floorAlbedo,bumpMap:floorBump,bumpScale:.022,color:0xf0e5d8,roughness:.59,metalness:.01,emissive:0x100a06,emissiveIntensity:.1}),
    ceiling:new THREE.MeshStandardMaterial({map:plasterAlbedo,bumpMap:plasterBump,bumpScale:.0025,color:0xa99b8c,roughness:.94,metalness:0,emissive:0x6f5d4a,emissiveMap:plasterAlbedo,emissiveIntensity:.48}),
    brass:new THREE.MeshStandardMaterial({color:0xa77b3e,roughness:.34,metalness:.68}),
    darkBrass:new THREE.MeshStandardMaterial({color:0x4b3928,roughness:.52,metalness:.42}),
    black:new THREE.MeshStandardMaterial({color:0x181512,roughness:.76}),
    stone:new THREE.MeshStandardMaterial({color:0x8a8176,roughness:.72,metalness:.025})
  };

  // 실제 조명은 픽셀마다 모든 광원을 계산해 무겁다. 실제 스포트라이트는 관람자 가까운
  // 작품 몇 곳에만 옮겨 달고, 나머지 빛 번짐은 가산 합성 텍스처로 흉내 낸다.
  function glowTexture(draw) {
    const c=document.createElement('canvas');c.width=c.height=256;draw(c.getContext('2d'));
    const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;
  }
  const radialGlow=glowTexture(g=>{
    const grad=g.createRadialGradient(128,128,0,128,128,128);
    grad.addColorStop(0,'rgba(255,255,255,1)');grad.addColorStop(.4,'rgba(255,255,255,.5)');grad.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle=grad;g.fillRect(0,0,256,256);
  });
  const coveGlow=glowTexture(g=>{
    const band=g.createLinearGradient(0,0,0,256);band.addColorStop(0,'rgba(255,255,255,.55)');band.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle=band;g.fillRect(0,0,256,256);
    g.save();g.translate(128,0);g.scale(1,2);
    const scallop=g.createRadialGradient(0,0,0,0,0,128);scallop.addColorStop(0,'rgba(255,255,255,.45)');scallop.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle=scallop;g.fillRect(-128,0,256,128);g.restore();
  });
  coveGlow.wrapS=THREE.RepeatWrapping;
  const glowMaterialOptions={transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false,fog:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2};
  function glowMaterial(map,color,opacity){return new THREE.MeshBasicMaterial({...glowMaterialOptions,map,color,opacity});}
  const glowMaterials = {
    floor:glowMaterial(radialGlow,0xffcf96,.16),
    cove:glowMaterial(coveGlow,0xffd4a0,.42),
    lamp:glowMaterial(radialGlow,0xffc56f,.3)
  };
  const ART_GLOW_OPACITY=.34;
  const sharedMaterials=new Set([...Object.values(materials),...Object.values(glowMaterials)]);

  const ART_LIGHT_POOL_SIZE=4;
  const artLightAnchors=[];
  const artLightPool=Array.from({length:ART_LIGHT_POOL_SIZE},()=>{
    const light=new THREE.SpotLight(0xffd29a,0,8,Math.PI*.18,.48,1.8);scene.add(light,light.target);
    return {light,anchor:null,level:0};
  });
  const artLightFocus=new THREE.Vector3();

  function resetArtLights() {
    artLightAnchors.length=0;
    for(const slot of artLightPool){slot.anchor=null;slot.level=0;slot.light.intensity=0;}
  }

  function assignArtLight(slot,anchor) {
    const light=slot.light;
    slot.anchor=anchor;slot.level=0;
    light.color.setHex(anchor.color);light.distance=anchor.distance;light.angle=anchor.angle;light.penumbra=anchor.penumbra;light.decay=anchor.decay;
    light.position.copy(anchor.position);light.target.position.copy(anchor.target);
  }

  function updateArtLights(dt) {
    // 시선 앞쪽 지점에서 가까운 작품에 조명을 몰아주고, 교체는 서서히 페이드한다.
    artLightFocus.set(camera.position.x-Math.sin(yaw)*2.5,0,camera.position.z-Math.cos(yaw)*2.5);
    const wanted=artLightAnchors
      .map(anchor=>({anchor,dist:Math.hypot(anchor.target.x-artLightFocus.x,anchor.target.z-artLightFocus.z)}))
      .sort((a,b)=>a.dist-b.dist).slice(0,ART_LIGHT_POOL_SIZE).map(item=>item.anchor);
    const step=Math.min(1,dt*3);
    for(const slot of artLightPool){
      if(!slot.anchor)continue;
      slot.level=wanted.includes(slot.anchor)?Math.min(1,slot.level+step):Math.max(0,slot.level-step);
    }
    for(const anchor of wanted){
      if(artLightPool.some(slot=>slot.anchor===anchor))continue;
      const free=artLightPool.find(slot=>!slot.anchor||slot.level===0&&!wanted.includes(slot.anchor));
      if(!free)break;
      if(free.anchor?.glow)free.anchor.glow.opacity=free.anchor.glowOpacity;
      assignArtLight(free,anchor);
    }
    for(const slot of artLightPool){
      const anchor=slot.anchor;
      slot.light.intensity=anchor?anchor.intensity*slot.level:0;
      if(anchor?.glow)anchor.glow.opacity=anchor.glowOpacity*(1-.7*slot.level);
    }
  }

  function mesh(box, mat, position, parent=gallery) {
    const m=new THREE.Mesh(new THREE.BoxGeometry(...box),mat);m.position.set(...position);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
  }

  function makeLabel(title, artist, width=2.4) {
    const c=document.createElement('canvas');c.width=768;c.height=168;const g=c.getContext('2d');
    g.fillStyle='#12100e';g.fillRect(0,0,c.width,c.height);g.strokeStyle='#9f7c3d';g.lineWidth=3;g.strokeRect(4,4,c.width-8,c.height-8);
    g.fillStyle='#f2e5c9';g.font='700 35px sans-serif';g.fillText(title.length>18?title.slice(0,17)+'…':title,34,65);
    g.fillStyle='#ad9871';g.font='24px sans-serif';g.fillText(artist,34,112);g.fillStyle='#c9a65a';g.fillRect(34,135,76,3);
    const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;
    const m=new THREE.Mesh(new THREE.PlaneGeometry(width,width*168/768),new THREE.MeshBasicMaterial({map:t,toneMapped:false}));
    return m;
  }

  const FINALE_PROGRESS_KEY = 'museumFinaleRoomsV2';
  const museumCompletionState = new Map();

  function readFinaleProgress() {
    try{return JSON.parse(localStorage.getItem(FINALE_PROGRESS_KEY)||'{}')||{};}catch(_){return {};}
  }

  function writeFinaleProgress(progress) {
    try{localStorage.setItem(FINALE_PROGRESS_KEY,JSON.stringify(progress));}catch(_){}
  }

  function setMuseumCompletionState(room,state) {
    museumCompletionState.set(room.id,state);
    if(finaleSurface?.userData?.finaleRoom?.id===room.id)refreshFinaleWall();
  }

  async function loadMuseumCompletions(room) {
    if(!museumCompletionState.has(room.id))setMuseumCompletionState(room,{status:'loading',records:[]});
    try{
      const response=await fetch(`/api/museum/completions?roomId=${encodeURIComponent(room.id)}`,{cache:'no-store',credentials:'same-origin'});
      if(response.status===401||response.status===403){setMuseumCompletionState(room,{status:'unavailable',records:[]});return;}
      if(!response.ok)throw new Error(`Museum completions ${response.status}`);
      const data=await response.json();
      const records=Array.isArray(data.records)?data.records.map(item=>({name:String(item.name||'').trim(),time:String(item.time||'').trim()})).filter(item=>item.name):[];
      setMuseumCompletionState(room,{status:'ready',records});
    }catch(error){
      console.warn('Museum completion list unavailable:',error);
      setMuseumCompletionState(room,{status:'error',records:[]});
    }
  }

  async function registerMuseumCompletion(room) {
    try{
      const response=await fetch('/api/museum/completions',{
        method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({roomId:room.id})
      });
      if(response.status===401||response.status===403){setMuseumCompletionState(room,{status:'unavailable',records:[]});return;}
      if(!response.ok)throw new Error(`Museum completion ${response.status}`);
      const data=await response.json();
      const records=Array.isArray(data.records)?data.records.map(item=>({name:String(item.name||'').trim(),time:String(item.time||'').trim()})).filter(item=>item.name):[];
      setMuseumCompletionState(room,{status:'ready',records});
    }catch(error){
      console.warn('Museum completion could not be recorded:',error);
      setMuseumCompletionState(room,{status:'error',records:[]});
    }
  }

  function finaleTexture(room) {
    const c=document.createElement('canvas');c.width=1400;c.height=860;const g=c.getContext('2d');
    const complete=Boolean(readFinaleProgress()[room.id]);
    const completion=museumCompletionState.get(room.id)||{status:'loading',records:[]};
    const grad=g.createRadialGradient(700,300,20,700,390,760);grad.addColorStop(0,complete?'#382b17':'#282017');grad.addColorStop(1,'#0c0b09');
    g.fillStyle=grad;g.fillRect(0,0,c.width,c.height);
    g.strokeStyle=complete?'#d5b565':'#806735';g.lineWidth=3;g.strokeRect(28,28,c.width-56,c.height-56);
    g.strokeStyle='rgba(211,177,101,.23)';g.lineWidth=1;g.strokeRect(48,48,c.width-96,c.height-96);
    g.textAlign='center';g.fillStyle='#b89954';g.font='700 19px Georgia';g.letterSpacing='7px';g.fillText('GALLERY CHECK',700,105);
    g.fillStyle='#eadcbf';g.font='700 64px serif';g.fillText(`${room.number}. ${room.title}`,700,192);
    g.fillStyle='#9f917e';g.font='27px sans-serif';g.fillText(room.subtitle,700,238);
    g.strokeStyle='rgba(211,177,101,.32)';g.lineWidth=1;g.beginPath();g.moveTo(120,278);g.lineTo(1280,278);g.stroke();
    g.fillStyle='#d0b577';g.font='700 28px sans-serif';g.fillText('오늘의 우리 반 완료',700,328);
    if(completion.status==='ready'){
      g.fillStyle='#8d806d';g.font='20px sans-serif';g.fillText(`${completion.records.length}명`,700,360);
      if(completion.records.length===0){
        g.fillStyle='#9f917e';g.font='25px sans-serif';g.fillText('아직 오늘 완료한 친구가 없습니다.',700,514);
      }else{
        const visible=completion.records.slice(0,30),columns=6,cardW=190,cardH=48,gapX=14,gapY=10;
        const totalW=columns*cardW+(columns-1)*gapX,startX=(c.width-totalW)/2;
        visible.forEach((record,index)=>{
          const col=index%columns,row=Math.floor(index/columns),x=startX+col*(cardW+gapX),y=392+row*(cardH+gapY);
          g.fillStyle='rgba(213,181,101,.075)';g.fillRect(x,y,cardW,cardH);
          g.strokeStyle='rgba(213,181,101,.22)';g.strokeRect(x+.5,y+.5,cardW-1,cardH-1);
          g.textAlign='left';g.fillStyle='#e8dbc0';g.font='700 22px sans-serif';g.fillText(record.name.slice(0,8),x+14,y+31);
          g.textAlign='right';g.fillStyle='#907f64';g.font='17px sans-serif';g.fillText(record.time.slice(0,5),x+cardW-12,y+30);
        });
        g.textAlign='center';
        if(completion.records.length>visible.length){g.fillStyle='#9f917e';g.font='18px sans-serif';g.fillText(`외 ${completion.records.length-visible.length}명`,700,704);}
      }
    }else{
      g.fillStyle='#9f917e';g.font='25px sans-serif';
      const message=completion.status==='unavailable'?'우리 반 로그인 후 명단이 표시됩니다.':completion.status==='error'?'명단을 잠시 불러올 수 없습니다.':'우리 반 명단을 불러오는 중…';
      g.fillText(message,700,514);
    }
    g.textAlign='center';g.fillStyle=complete?'#dbc27c':'#c6a55c';g.font='700 23px sans-serif';
    g.fillText(complete?'✓ 확인 문제 완료 · 클릭하면 다시 풀 수 있어요':'확인 문제 풀기 · 벽을 클릭하세요',700,784);
    const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());t.userData={finaleTexture:true};return t;
  }

  function addFinaleWall(room,shell) {
    // Match the other galleries' substantial final-board proportions, scaled
    // up to fill the spatial gallery's larger end wall. Venus may overlap it.
    const panelW=5.8,panelH=3.65,panelY=3.25,z=GALLERY_END+.38;
    const group=new THREE.Group();gallery.add(group);
    mesh([panelW+.62,panelH+.62,.18],materials.black,[0,panelY,z-.08],group);
    mesh([panelW+.76,.11,.24],materials.brass,[0,panelY+(panelH+.7)/2,z],group);
    mesh([panelW+.76,.11,.24],materials.brass,[0,panelY-(panelH+.7)/2,z],group);
    mesh([.11,panelH+.58,.24],materials.brass,[-(panelW+.64)/2,panelY,z],group);
    mesh([.11,panelH+.58,.24],materials.brass,[(panelW+.64)/2,panelY,z],group);
    const mat=new THREE.MeshBasicMaterial({map:finaleTexture(room),toneMapped:false});
    const panel=new THREE.Mesh(new THREE.PlaneGeometry(panelW,panelH),mat);panel.position.set(0,panelY,z+.13);panel.userData.finaleRoom=room;group.add(panel);clickable.push(panel);finaleSurface=panel;
    for(const side of [-1,1]){
      const lamp=mesh([.18,.28,.18],materials.darkBrass,[side*(panelW/2+.72),panelY+.45,z+.2],group);
      lamp.rotation.z=side*.12;
      const glow=new THREE.Mesh(new THREE.PlaneGeometry(1.7,2.3),glowMaterials.lamp);glow.position.set(side*(panelW/2+.72),panelY+.1,GALLERY_END+.17);group.add(glow);
    }
    artLightAnchors.push({position:new THREE.Vector3(0,Math.min(shell.height-.35,panelY+2.1),z+2.5),target:new THREE.Vector3(0,panelY,z),color:0xffce84,intensity:42,distance:8,angle:Math.PI*.25,penumbra:.75,decay:1.5});
  }

  function refreshFinaleWall() {
    if(!finaleSurface)return;
    const old=finaleSurface.material.map;
    finaleSurface.material.map=finaleTexture(finaleSurface.userData.finaleRoom);
    finaleSurface.material.needsUpdate=true;
    if(old?.userData?.finaleTexture)old.dispose();
  }

  function completedFinaleCount() {
    const progress=readFinaleProgress();return rooms.filter(room=>progress[room.id]).length;
  }

  function showFinaleCompletion(room,newlyCompleted=false) {
    const progress=readFinaleProgress();progress[room.id]=true;writeFinaleProgress(progress);refreshFinaleWall();
    if(newlyCompleted)void registerMuseumCompletion(room);
    finaleQuestionWrap.hidden=true;finaleComplete.hidden=false;
    document.querySelector('.curator-stamp').hidden=false;
    document.getElementById('finale-step').textContent='GALLERY COMPLETE';
    document.getElementById('finale-progress').style.width='100%';
    document.getElementById('finale-total').textContent=`${completedFinaleCount()} / ${rooms.length} ROOMS`;
    document.getElementById('finale-stamp-number').textContent=room.number;
    document.getElementById('finale-complete-title').textContent=newlyCompleted?'관찰의 눈을 얻었어요':'이미 획득한 큐레이터 도장이에요';
    document.getElementById('finale-complete-copy').textContent=completedFinaleCount()===rooms.length?'다섯 전시실의 관찰을 모두 마쳤어요. 이제 이 미술관의 어린이 큐레이터입니다.':`${room.title} 전시실의 작품을 세심하게 관찰했다는 표시예요.`;
  }

  function showFinaleRetry(room) {
    const total=finaleQuizQuestions.length;
    finaleQuestionWrap.hidden=true;finaleComplete.hidden=false;
    document.querySelector('.curator-stamp').hidden=true;
    document.getElementById('finale-step').textContent='TRY AGAIN';
    document.getElementById('finale-progress').style.width='100%';
    document.getElementById('finale-total').textContent=`${completedFinaleCount()} / ${rooms.length} ROOMS`;
    document.getElementById('finale-complete-title').textContent=`${finaleQuizCorrect} / ${total}개를 맞혔어요`;
    document.getElementById('finale-complete-copy').textContent='큐레이터 도장은 다섯 문제를 모두 맞혀야 받을 수 있어요. 작품을 다시 살펴보고 재도전해 보세요.';
  }

  function renderFinaleQuestion() {
    let missedThisQuestion=false;
    const item=finaleQuizQuestions[finaleQuizIndex];
    finaleQuestionWrap.hidden=false;finaleComplete.hidden=true;finaleNext.hidden=true;
    finaleArtwork.hidden=!item.image;
    if(item.image){finaleArtworkImage.src=item.image;}else{finaleArtworkImage.removeAttribute('src');}
    finaleNext.textContent=finaleQuizIndex===finaleQuizQuestions.length-1?'결과 보기':'다음 관찰로';
    finaleFeedback.textContent='';finaleFeedback.className='finale-feedback';
    document.getElementById('finale-step').textContent=`QUESTION ${String(finaleQuizIndex+1).padStart(2,'0')} / ${String(finaleQuizQuestions.length).padStart(2,'0')}`;
    document.getElementById('finale-progress').style.width=`${finaleQuizIndex/finaleQuizQuestions.length*100}%`;
    document.getElementById('finale-total').textContent=`${completedFinaleCount()} / ${rooms.length} ROOMS`;
    document.getElementById('finale-question').textContent=item.q;
    finaleOptions.replaceChildren(...item.options.map((label,index)=>{
      const button=document.createElement('button');button.type='button';button.className='finale-option';button.dataset.letter=String.fromCharCode(65+index);button.textContent=label;
      button.addEventListener('click',()=>{
        if(index!==item.answer){missedThisQuestion=true;button.classList.add('wrong');button.disabled=true;finaleFeedback.textContent='다시 생각하고 다른 답을 골라보세요.';return;}
        [...finaleOptions.children].forEach(option=>option.disabled=true);
        button.classList.add('correct');if(!missedThisQuestion){finaleQuizCorrect++;}finaleFeedback.textContent=item.explain;finaleFeedback.classList.add('correct');window.ClassGameSfx?.play('card');
        finaleNext.hidden=false;
      });return button;
    }));
  }

  function shuffledCopy(items) {
    const result=[...items];
    for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  }

  // 그림 보고 제목 맞히기: 제목이 그림 내용을 말해 주는 작품이 많아서, 보기를 딴 방 작품에서 뽑으면
  // 정답만 그림에 어울려 안 보고도 풀린다. 작품마다 그 그림에도 어울리는 제목(대개 같은 작가·같은 소재의
  // 실제 작품)을 따로 둔다.
  const TITLE_DECOYS={
    p01:['송시열 초상','강세황 자화상','이재 초상'],
    p02:['지네브라 데 벤치','라 벨 페로니에르','마달레나 도니의 초상'],
    p03:['진주 목걸이를 한 여인','어깨 너머로 돌아보는 소녀','노란 옷을 입은 소녀'],
    p04:['연당의 여인','여속도','노리개를 쥔 여인'],
    p05:['불안','절망','다리 위의 소녀들'],
    p06:['밀짚모자를 쓴 자화상','검은 펠트모자를 쓴 자화상','파란 옷을 입은 자화상'],
    p07:['포옹','성취','사랑'],
    p08:['물 주전자를 든 젊은 여인','빵을 자르는 여인','창가의 하녀'],
    p09:['감자 심는 사람들','추수하는 여인들','들판의 세 여인'],
    p10:['무대 위의 무희','파란 옷의 무희들','발레 수업'],
    p11:['도라 마르의 초상','모자를 쓴 여인','손수건을 든 여인'],
    p12:['비눗방울을 부는 소년','군악대 소년','빨간 바지를 입은 소년'],
    n01:['론강의 별이 빛나는 밤','사이프러스와 별이 있는 길','소용돌이치는 밤하늘'],
    n02:['녹색 반영','구름','아침의 연못'],
    n03:['청풍계도','만폭동도','인곡유거도'],
    n04:['꽃병의 해바라기 세 송이','잘린 해바라기 네 송이','노란 꽃다발'],
    n05:['맹호도','송하맹호도','영모도'],
    n06:['화조도','화훼도','영모도'],
    n07:['황소','싸우는 소','소와 어린이'],
    n08:['묘작도','화접도','야묘도추'],
    c12:['가을','봄','베르툼누스'],
    n10:['의회당, 해 질 녘','워털루 다리','안개 낀 항구의 아침'],
    n11:['양귀비 들판','정원의 여인들','언덕 위의 여인'],
    n12:['뱀을 부리는 여인','놀란 호랑이','적도의 정글'],
    s01:['계변가화','상춘야흥','연소답청'],
    c11:['뱃놀이 일행의 점심','부지발의 무도회','시골의 무도회'],
    s03:['서화감상','고누놀이','글 읽는 아이들'],
    d09:['삼미신','꽃의 여신','오렌지 숲의 잔치'],
    s05:['바다에서 나오는 비너스','비너스와 마르스','조개 위의 여신'],
    c10:['시소','눈먼 술래잡기','날아간 신발'],
    s07:['설송도','송하한거도','초옥도'],
    s08:['사시팔경도','소상팔경도','적벽도'],
    s09:['이브의 창조','해와 달의 창조','빛과 어둠의 분리'],
    s10:['서귀포의 환상','춤추는 가족','소달구지'],
    s11:['우물가','계변가화','고기잡이'],
    s12:['감자 심는 사람들','이삭 줍는 사람들','석양'],
    c01:['빨강, 노랑, 파랑, 검정의 구성','큰 빨간 면이 있는 구성','노랑과 파랑의 구성'],
    c02:['원 속의 원','노랑, 빨강, 파랑','여러 개의 원'],
    c03:['절대주의 구성','무제','어둠'],
    c07:['사과 바구니','커튼, 물병, 과일 그릇','사과와 비스킷'],
    c06:['아니에르의 물놀이','강가의 일요일','공원의 산책'],
    c08:['음악','삶의 기쁨','강가의 목욕하는 사람들'],
    s02:['대쾌도','활쏘기','고누놀이'],
    s06:['씨름','탈춤','사당패 놀이'],
    n09:['고갱의 의자','빈센트의 의자','밤의 카페'],
    c04:['잠','나르시스의 변형','불타는 기린'],
    c05:['사람의 아들','데칼코마니','빛의 제국'],
    c09:['두 개의 신비','꿈의 열쇠','말의 사용'],
    d14:['레위 가의 잔치','시몬의 집에서의 만찬','궁전의 연회'],
    d07:['포목상 조합의 이사들','튈프 박사의 해부학 강의','어둠 속의 행렬'],
    d08:['마르가리타 공주','베 짜는 여인들','궁정 화가의 작업실'],
    s04:['엠마오의 저녁 식사','가나의 혼인잔치','레위 가의 잔치'],
    d10:['세 여인','목욕하는 여인들','다섯 여인'],
    d11:['마을 위에서','바이올린 연주자','생일'],
    d12:['성체 논의','파르나소스','보르고의 화재'],
    d15:['대금업자와 그의 아내','롤랭 재상의 성모','거울 앞의 부부'],
    d16:['단발령망금강산도','만폭동도','인왕제색도'],
    d17:['석공의 작업장','산마르코 광장','템스 강'],
    d18:['성 마태오의 소명','카드 사기꾼','최후의 만찬']
  };
  // 작가 맞히기: 그림 느낌이 비슷한 시대·갈래의 작가끼리만 보기로 쓴다.
  const ARTIST_GROUPS=[
    ['윤두서','신윤복','정선','김홍도','김정희','안견','신사임당 전칭'],
    ['이중섭','박수근','김환기','장욱진'],
    ['레오나르도 다 빈치','요하네스 페르메이르','산드로 보티첼리','미켈란젤로','렘브란트 판 레인','디에고 벨라스케스','라파엘로','얀 반 에이크','파올로 베로네세','카날레토','미켈란젤로 메리시 다 카라바조','주세페 아르침볼도','장오노레 프라고나르'],
    ['장프랑수아 밀레','에두아르 마네','에드가 드가','클로드 모네','오귀스트 르누아르','빈센트 반 고흐','폴 세잔','조르주 쇠라','에드바르 뭉크','구스타프 클림트','앙리 루소'],
    ['파블로 피카소','피트 몬드리안','바실리 칸딘스키','카지미르 말레비치','앙리 마티스','살바도르 달리','르네 마그리트','마르크 샤갈']
  ];
  const optionTitle=title=>title.replace(/\s*\(.*\)$/,'');
  const optionArtist=name=>name.replace(/ 전칭$/,'');
  // 받침에 따라 조사를 고른다: 〈우는 여인〉을, 렘브란트 판 레인이에요.
  const josa=(word,withFinal,withoutFinal)=>{const last=[...String(word)].reverse().find(ch=>ch>='가'&&ch<='힣');return last&&(last.charCodeAt(0)-0xAC00)%28?withFinal:withoutFinal;};

  function buildImageQuestion(room,mode,target) {
    const config={
      title:{key:'title',question:'이 작품의 제목은 무엇일까요?'},
      artist:{key:'artist',question:'이 작품을 만든 작가는 누구일까요?'}
    }[mode];
    const correct=mode==='title'?optionTitle(target.title):optionArtist(target.artist);
    const pool=mode==='title'?TITLE_DECOYS[target.id]:ARTIST_GROUPS.find(group=>group.includes(target.artist)).filter(name=>name!==target.artist).map(optionArtist);
    const distractors=shuffledCopy(pool.filter(value=>value!==correct)).slice(0,3);
    const explanations={
      title:`이 작품은 ${target.artist}의 〈${target.title}〉${josa(target.title,'이에요','예요')}.`,
      artist:`〈${target.title}〉${josa(target.title,'을','를')} 만든 작가는 ${target.artist}${josa(target.artist,'이에요','예요')}.`
    };
    return {kind:`image-${mode}`,image:target.image,q:config.question,options:[correct,...distractors],answer:0,explain:explanations[mode]};
  }

  function startFinaleQuiz(room) {
    finaleQuizRoom=room;finaleQuizIndex=0;finaleQuizCorrect=0;
    const works=shuffledCopy(room.works);
    const imageWorks=works.slice(0,2);
    if(imageWorks[1].artist==='작자 미상')imageWorks.reverse();
    const imageWorkIds=new Set(imageWorks.map(work=>work.id));
    const observations=shuffledCopy(ROOM_QUIZZES[room.id].questions.map((question,index)=>({
      ...question,workId:OBSERVATION_WORK_IDS[room.id][index]
    })).filter(question=>!imageWorkIds.has(question.workId)));
    const imageModes=['title','artist'];
    const selected=[
      buildImageQuestion(room,imageModes[0],imageWorks[0]),
      buildImageQuestion(room,imageModes[1],imageWorks[1]),
      observations[0],
      observations[1],
      observations[2]
    ];
    let signature=selected.map(item=>`${item.kind||'observation'}:${item.image||''}:${item.q}`).sort().join('|');
    if(signature===finaleLastQuestionSet[room.id]&&observations[2]){selected[4]=observations[2];signature=selected.map(item=>`${item.kind||'observation'}:${item.image||''}:${item.q}`).sort().join('|');}
    finaleLastQuestionSet[room.id]=signature;
    finaleQuizQuestions=shuffledCopy(selected.map(item=>{
      const choices=item.options.map((label,index)=>({label,correct:index===item.answer}));
      const randomizedChoices=shuffledCopy(choices);
      return {...item,options:randomizedChoices.map(choice=>choice.label),answer:randomizedChoices.findIndex(choice=>choice.correct)};
    }));
    document.getElementById('finale-kicker').textContent=`GALLERY ${room.number} · GALLERY CHECK`;
    document.getElementById('finale-title').textContent=`${room.title} · 확인 문제`;
    renderFinaleQuestion();
  }

  function showFinale(room) {
    window.ClassGameSfx?.play('card');keysClear();
    document.getElementById('finale-kicker').textContent=`GALLERY ${room.number} · GALLERY CHECK`;
    document.getElementById('finale-title').textContent=`${room.title} · 확인 문제`;
    finaleQuizRoom=room;
    if(readFinaleProgress()[room.id])showFinaleCompletion(room);
    else startFinaleQuiz(room);
    finaleModal.showModal();
  }

  function getDisplaySize(work) {
    const w=work.size.w||60,h=work.size.h||90,aspect=w/h;
    // 원작 비율과 작품 간 크기 차이는 유지하되, 높은 전시 벽에서 너무 작아 보이지 않도록
    // 관람용 축척과 최소 전시 크기를 적용한다.
    let dw=w*.0215, dh=h*.0215;
    const minLong=1.35;
    if(Math.max(dw,dh)<minLong){const grow=minLong/Math.max(dw,dh);dw*=grow;dh*=grow;}
    const maxW=work.type==='mural'?4.7:4.35, maxH=3.65;
    const shrink=Math.min(1,maxW/dw,maxH/dh);dw*=shrink;dh*=shrink;
    return {w:Math.max(.32,dw),h:Math.max(.32,dh),aspect};
  }

  function placeholderTexture(title) {
    const c=document.createElement('canvas');c.width=512;c.height=640;const g=c.getContext('2d');
    const grad=g.createLinearGradient(0,0,512,640);grad.addColorStop(0,'#3b3023');grad.addColorStop(1,'#17130f');g.fillStyle=grad;g.fillRect(0,0,512,640);
    g.strokeStyle='#a58140';g.lineWidth=3;g.strokeRect(28,28,456,584);g.fillStyle='#d4bc83';g.textAlign='center';g.font='700 28px serif';
    const words=title.split(' ');words.forEach((x,i)=>g.fillText(x,256,286+i*40));g.font='18px sans-serif';g.fillStyle='#8c795a';g.fillText('이미지를 준비하고 있어요',256,520);
    const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;
  }

  function fitArtworkPlane(texture,plane,targetAspect) {
    const img=texture.image;if(!img)return;const imageAspect=img.width/img.height;
    texture.wrapS=texture.wrapT=THREE.ClampToEdgeWrapping;texture.repeat.set(1,1);texture.offset.set(0,0);
    plane.scale.set(1,1,1);
    if(imageAspect>targetAspect)plane.scale.y=targetAspect/imageAspect;
    else plane.scale.x=imageAspect/targetAspect;
    texture.encoding=THREE.sRGBEncoding;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());texture.needsUpdate=true;
  }

  function isCurrentRoomLoad(version,roomGallery) {
    return version===roomLoadVersion&&gallery===roomGallery;
  }

  function loadArtTexture(work,material,plane,aspect,version,roomGallery,transparent=false) {
    const cached=textureCache.get(work.image);
    if(cached){if(isCurrentRoomLoad(version,roomGallery)){fitArtworkPlane(cached,plane,aspect);material.map=cached;material.needsUpdate=true;markLoaded(version,roomGallery);}return;}
    textureLoader.load(work.image,(t)=>{
      textureCache.set(work.image,t);
      if(!isCurrentRoomLoad(version,roomGallery))return;
      fitArtworkPlane(t,plane,aspect);material.map=t;material.needsUpdate=true;markLoaded(version,roomGallery);
    },undefined,()=>{
      if(!isCurrentRoomLoad(version,roomGallery))return;
      material.map=placeholderTexture(work.title);material.needsUpdate=true;markLoaded(version,roomGallery);
    });
    material.transparent=transparent;
  }

  function markLoaded(version,roomGallery){
    if(!isCurrentRoomLoad(version,roomGallery))return;
    loadDone++;const pct=Math.round(loadDone/loadTotal*100);loadingBar.style.width=pct+'%';loadingText.textContent=pct+'%';
    if(loadDone>=loadTotal)setTimeout(()=>{if(isCurrentRoomLoad(version,roomGallery))loading.classList.add('done');},420);
  }

  function buildShell(room) {
    const width=11.6,length=GALLERY_START-GALLERY_END,height=6.4,centerZ=(GALLERY_START+GALLERY_END)/2;
    const wallCenterY=height/2-.1,wallSurfaceY=height/2+.05;
    mesh([width,.18,length],materials.walnut,[0,-.09,centerZ]);
    mesh([width,.18,length],materials.ceiling,[0,height+.1,centerZ]);
    mesh([.28,height,length],materials.wallInset,[-width/2,wallCenterY,centerZ]);
    mesh([.28,height,length],materials.wallInset,[width/2,wallCenterY,centerZ]);
    mesh([width,height,.3],materials.wallInset,[0,wallCenterY,GALLERY_END]);
    mesh([width,height,.22],materials.wallInset,[0,wallCenterY,7]);

    const leftFabric=new THREE.Mesh(new THREE.PlaneGeometry(length,height-1.05),materials.wall);
    leftFabric.position.set(-width/2+.145,wallSurfaceY,centerZ);leftFabric.rotation.y=Math.PI/2;leftFabric.receiveShadow=true;gallery.add(leftFabric);
    const rightFabric=leftFabric.clone();rightFabric.position.x=width/2-.145;rightFabric.rotation.y=-Math.PI/2;gallery.add(rightFabric);
    const endFabric=new THREE.Mesh(new THREE.PlaneGeometry(width-.55,height-1.05),materials.wall);
    endFabric.position.set(0,wallSurfaceY,GALLERY_END+.16);endFabric.receiveShadow=true;gallery.add(endFabric);

    for(const side of [-1,1]){
      const x=side*(width/2-.13);
      mesh([.1,.2,length],materials.darkBrass,[x,.34,centerZ]);
      mesh([.08,.08,length],materials.brass,[x-side*.025,.47,centerZ]);
      for(let z=4.9;z>GALLERY_END;z-=3.35){
        mesh([.035,height-.95,.055],materials.black,[x-side*.17,wallSurfaceY,z]);
      }
    }

    const coveDepth=1.15;
    const centerCeiling=mesh([width-coveDepth*2,.18,length],materials.ceiling,[0,height-.17,centerZ]);centerCeiling.castShadow=false;
    for(const side of [-1,1]){
      const soffitX=side*(width/2-.52);
      const soffit=mesh([1.04,.34,length],materials.ceiling,[soffitX,height-.49,centerZ]);soffit.castShadow=false;
      const bevelWidth=.82;
      const bevel=mesh([bevelWidth,.16,length],materials.ceiling,[side*(width/2-1.27),height-.32,centerZ]);bevel.rotation.z=side*.38;bevel.castShadow=false;
      const coveX=side*(width/2-1.48);
      const coveY=height-.46;
      const cove=mesh([.075,.055,length],new THREE.MeshBasicMaterial({color:0xffd49b,toneMapped:false}),[coveX,coveY,centerZ]);cove.castShadow=false;
      const washH=2.3,wash=new THREE.Mesh(new THREE.PlaneGeometry(length,washH),glowMaterials.cove);
      wash.position.set(side*(width/2-.15),wallSurfaceY+(height-1.05)/2-washH/2,centerZ);wash.rotation.y=-side*Math.PI/2;gallery.add(wash);
    }
    coveGlow.repeat.set(length/4.8,1);

    const downlightMat=new THREE.MeshStandardMaterial({color:0x24211e,roughness:.62,metalness:.3});
    const lampMat=new THREE.MeshBasicMaterial({color:0xfff1d7,toneMapped:false});
    for(let z=3.8;z>GALLERY_END;z-=4.5){
      for(const x of [-1.45,1.45]){
        const ring=new THREE.Mesh(new THREE.CylinderGeometry(.115,.115,.035,24),downlightMat);ring.position.set(x,height-.295,z);gallery.add(ring);
        const lens=new THREE.Mesh(new THREE.CircleGeometry(.072,20),lampMat);lens.position.set(x,height-.316,z);lens.rotation.x=Math.PI/2;gallery.add(lens);
        const pool=new THREE.Mesh(new THREE.PlaneGeometry(4.4,4.4),glowMaterials.floor);pool.rotation.x=-Math.PI/2;pool.position.set(x,.006,z);gallery.add(pool);
      }
    }
    const ambient=new THREE.HemisphereLight(0xe9dece,0x3a2a20,1.1);gallery.add(ambient);
    const fill=new THREE.DirectionalLight(0xffe2bd,.65);fill.position.set(0,height,centerZ+6);fill.target.position.set(0,0,centerZ);gallery.add(fill,fill.target);
    const entrance=new THREE.Group();gallery.add(entrance);
    const entryHeight=5;
    mesh([2.2,entryHeight,.5],materials.wallInset,[-(width/2-1.1),entryHeight/2,5.7],entrance);mesh([2.2,entryHeight,.5],materials.wallInset,[(width/2-1.1),entryHeight/2,5.7],entrance);mesh([width-4.4,1.15,.5],materials.wallInset,[0,entryHeight+.42,5.7],entrance);
    const sign=makeLabel(room.subtitle,`${room.works.length}점의 작품 · 원작 비율 전시`,4.2);sign.position.set(0,4.55,5.4);gallery.add(sign);
    return {width,length,height};
  }

  function frameMaterials(index,type) {
    const palettes=[0x6b421f,0x8a5b28,0x3b2718,0x75502d];
    if(type==='mural')return new THREE.MeshStandardMaterial({color:0x4d4032,roughness:.75,metalness:.08});
    return new THREE.MeshStandardMaterial({color:palettes[index%palettes.length],roughness:.32,metalness:.28});
  }

  function addSpotlight(x,y,z,side,glow) {
    artLightAnchors.push({position:new THREE.Vector3(x-side*.85,Math.min(5.7,y+1.7),z+.05),target:new THREE.Vector3(x,3.05,z),color:0xffd29a,intensity:62,distance:8.2,angle:Math.PI*.18,penumbra:.48,decay:1.8,glow,glowOpacity:ART_GLOW_OPACITY});
    const stem=mesh([.08,.08,.8],materials.brass,[x-side*.42,Math.min(5.78,y+1.82),z]);stem.rotation.z=side*Math.PI/2;
    const head=mesh([.24,.18,.34],materials.darkBrass,[x-side*.82,Math.min(5.68,y+1.75),z]);head.rotation.z=side*Math.PI/2;
  }

  function addFramedWork(work,index,side,z,width,version,roomGallery) {
    const display=getDisplaySize(work), group=new THREE.Group();
    const x=side*(width/2-.31);group.position.set(x,3.12,z);group.rotation.y=side<0?Math.PI/2:-Math.PI/2;gallery.add(group);
    const border=work.type==='mural'?.11:clamp(Math.min(display.w,display.h)*.09,.1,.2),depth=work.type==='mural'?.08:.2,mat=frameMaterials(index,work.type);
    const back=mesh([display.w+border*2,display.h+border*2,.09],materials.black,[0,0,-.04],group);back.castShadow=true;
    mesh([display.w+border*2,border,depth],mat,[0,(display.h+border)/2,.08],group);mesh([display.w+border*2,border,depth],mat,[0,-(display.h+border)/2,.08],group);
    mesh([border,display.h,depth],mat,[-(display.w+border)/2,0,.08],group);mesh([border,display.h,depth],mat,[(display.w+border)/2,0,.08],group);
    if(work.type!=='mural'){
      const inner=new THREE.MeshStandardMaterial({color:0xc3a875,roughness:.35,metalness:.35});
      const b=border*.23;mesh([display.w+b*2,b,.08],inner,[0,(display.h+b)/2,.2],group);mesh([display.w+b*2,b,.08],inner,[0,-(display.h+b)/2,.2],group);mesh([b,display.h,.08],inner,[-(display.w+b)/2,0,.2],group);mesh([b,display.h,.08],inner,[(display.w+b)/2,0,.2],group);
    }
    // 작품 이미지는 조명의 입사각 때문에 어두워지지 않도록 자체 색으로 표시한다.
    // 액자와 벽, 바닥에는 기존 스포트라이트가 그대로 반응한다.
    const artMat=new THREE.MeshBasicMaterial({color:0xffffff,map:placeholderTexture(work.title),side:THREE.DoubleSide,toneMapped:false});
    const plane=new THREE.Mesh(new THREE.PlaneGeometry(display.w,display.h),artMat);plane.position.z=.255;plane.userData.work=work;plane.userData.room=rooms[activeRoom];plane.castShadow=true;group.add(plane);clickable.push(plane);loadArtTexture(work,artMat,plane,display.w/display.h,version,roomGallery);
    const label=makeLabel(work.title,work.artist,Math.min(2.3,display.w+border*2));label.position.set(0,-display.h/2-.42,.24);group.add(label);
    const glowMat=glowMaterial(radialGlow,0xffd29a,ART_GLOW_OPACITY);
    const glow=new THREE.Mesh(new THREE.PlaneGeometry(display.w+1.6,display.h+2),glowMat);glow.position.set(0,.3,-.16);group.add(glow);
    addSpotlight(x,3.12+display.h/2,z,side,glowMat);
  }

  function setRoom(index,instant=false) {
    const version=++roomLoadVersion;
    setRoomMusic(index);
    activeRoom=index;clickable.length=0;sculptureObstacles.length=0;nearest=null;prompt.hidden=true;loadDone=0;loadTotal=rooms[index].works.length;
    loading.classList.remove('done');loadingBar.style.width='0';loadingText.textContent='0%';
    finaleSurface=null;resetArtLights();
    if(gallery){scene.remove(gallery);gallery.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&!Array.isArray(o.material)&&!sharedMaterials.has(o.material)){if(o.material.map?.userData?.finaleTexture)o.material.map.dispose();o.material.dispose();}});}
    gallery=new THREE.Group();scene.add(gallery);const roomGallery=gallery,shell=buildShell(rooms[index]);
    addFinaleWall(rooms[index],shell);
    void loadMuseumCompletions(rooms[index]);
    rooms[index].works.forEach((w,i)=>addFramedWork(w,i,i%2===0?-1:1,1-Math.floor(i/2)*5.15,shell.width,version,roomGallery));
    camera.position.set(0,1.68,6.35);yaw=0;pitch=-.015;velocity.set(0,0,0);camera.rotation.set(pitch,yaw,0);
    document.getElementById('room-kicker').textContent='GALLERY '+rooms[index].number;
    document.getElementById('room-title').textContent=rooms[index].title;
    document.getElementById('room-count').textContent=rooms[index].works.length+' WORKS';
    for(const entry of remotePeople.values())entry.group.visible=entry.room===rooms[index].id;
    [...roomTabs.children].forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-current',i===index?'page':'false');});
    if(instant)loading.classList.add('done');
  }

  function buildTabs(){rooms.forEach((room,i)=>{const b=document.createElement('button');b.type='button';b.className='room-tab';b.dataset.sfx='click';b.innerHTML=`<b>${room.number}. ${room.title}</b>`;b.addEventListener('click',()=>{if(i!==activeRoom)setRoom(i);});roomTabs.appendChild(b);});
    const parkTab=document.createElement('button');parkTab.type='button';parkTab.className='room-tab room-tab-park';parkTab.dataset.sfx='click';parkTab.innerHTML='<b>06. 입체·공간</b>';parkTab.addEventListener('click',()=>{location.href='../park/';});roomTabs.appendChild(parkTab);}

  function formatSize(work){if(work.size.label)return work.size.label;const parts=[];if(work.size.h)parts.push(`높이 ${work.size.h}cm`);if(work.size.w)parts.push(`너비 ${work.size.w}cm`);if(work.size.d)parts.push(`깊이 ${work.size.d}cm`);return parts.join(' × ');}
  const movementGuide={
    '르네상스':{title:'르네상스',description:'사람과 자연을 자세히 관찰하고, 원근법과 균형 잡힌 구도로 현실 같은 공간을 만들려 한 미술이에요.'},
    '초기 르네상스':{title:'초기 르네상스',description:'고대 그리스·로마 문화에 다시 관심을 두며, 자연스러운 인물과 이야기 장면을 새롭게 그리기 시작한 시기예요.'},
    '성기 르네상스':{title:'성기 르네상스',description:'이상적인 인체, 안정된 구도, 정확한 원근법을 조화롭게 발전시킨 르네상스의 전성기예요.'},
    '바로크':{title:'바로크',description:'강한 빛과 어둠, 깊은 공간, 극적인 순간을 사용해 그림이 눈앞에서 벌어지는 듯 보이게 한 미술이에요.'},
    '로코코':{title:'로코코',description:'밝은 색과 우아한 곡선, 놀이와 사랑 같은 사적인 장면으로 가볍고 경쾌한 분위기를 만든 18세기 미술이에요.'},
    '사실주의':{title:'사실주의',description:'영웅이나 신화보다 당대 사람들이 일하고 살아가는 현실을 진지하게 바라본 19세기 미술이에요.'},
    '인상주의':{title:'인상주의',description:'사물의 정확한 윤곽보다 빛·날씨·색이 만들어 내는 순간의 첫인상을 빠른 붓질로 포착한 미술이에요.'},
    '후기 인상주의':{title:'후기 인상주의',description:'인상주의 이후, 화가가 본 빛의 순간을 넘어 자신의 감정·색·붓질·화면 구조를 더 강하게 드러낸 여러 흐름을 말해요.'},
    '신인상주의':{title:'신인상주의',description:'색채 이론을 바탕으로 작은 순수 색점을 나란히 놓아, 멀리서 볼 때 눈에서 색이 섞여 보이도록 한 미술이에요.'},
    '상징주의':{title:'상징주의',description:'눈앞의 현실을 그대로 설명하기보다, 꿈·불안·소망처럼 보이지 않는 생각과 감정을 상징으로 나타낸 미술이에요.'},
    '입체주의':{title:'입체주의',description:'하나의 대상을 여러 방향에서 본 모습으로 나누고 다시 조합해, 한 화면에 시간과 시점을 함께 담으려 한 미술이에요.'},
    '원시 입체주의':{title:'원시 입체주의',description:'입체주의가 막 시작되던 시기로, 인물과 공간을 날카로운 면으로 단순화하며 기존 원근법을 흔들기 시작했어요.'},
    '야수파':{title:'야수파',description:'자연의 실제 색보다 강렬하고 단순한 색면, 대담한 윤곽선으로 감정과 에너지를 표현한 미술이에요.'},
    '초현실주의':{title:'초현실주의',description:'꿈과 무의식에서 떠오르는 낯선 장면을 사실적으로 그려, 우리가 익숙하다고 믿는 현실을 새롭게 보게 한 미술이에요.'},
    '신조형주의':{title:'신조형주의',description:'수직·수평선과 기본색처럼 아주 제한된 요소로, 누구에게나 통하는 균형과 질서를 찾으려 한 추상 미술이에요.'},
    '절대주의':{title:'절대주의',description:'현실의 사물을 재현하지 않고 단순한 도형과 색만으로 순수한 느낌을 표현하려 한 추상 미술이에요.'},
    '빈 분리파':{title:'빈 분리파',description:'19세기 말 빈에서 기존 미술 제도에서 벗어나, 회화·장식·디자인의 경계를 넘는 새 아름다움을 찾은 예술가 모임이에요.'},
    '매너리즘':{title:'매너리즘',description:'르네상스의 안정된 비례에서 벗어나 길어진 인체, 복잡한 구성, 낯선 아름다움으로 긴장감을 만든 16세기 미술이에요.'},
    '헬레니즘':{title:'헬레니즘',description:'고대 그리스 문화가 넓게 퍼진 시대의 미술로, 인체의 움직임·감정·공간감을 더 생생하게 표현했어요.'},
    '조선 후기':{title:'조선 후기 미술',description:'사람들의 일상, 실제 우리 산천, 생활 속 바람을 가까이 관찰하며 다양한 그림으로 펼쳐 낸 시기예요.'},
    '조선 민화':{title:'조선 민화',description:'생활 가까이에서 그려진 그림으로, 복·장수·좋은 소식 같은 바람을 친근한 상징에 담았어요.'},
    '한국 근대미술':{title:'한국 근대미술',description:'전통과 새로운 시대의 표현을 함께 고민하며, 개인의 감정과 삶을 자신만의 선·색·형태로 드러낸 미술이에요.'},
    '근대 회화':{title:'근대 회화',description:'19세기 후반 화가들이 전통적인 역사화와 사실 묘사에서 벗어나, 지금 살아가는 사람과 새로운 화면 방식을 탐색하며 연 미술이에요.'},
    '조선 시대':{title:'조선 시대 회화',description:'먹과 채색, 세밀한 관찰을 바탕으로 자연·사람·생활의 의미를 담아낸 우리 옛 그림의 흐름이에요.'},
    '소박파':{title:'소박파',description:'전문 미술 교육의 규칙보다 자신만의 선명한 형태와 풍부한 상상력을 따라 독특한 세계를 만든 미술이에요.'},
    '조선 전기':{title:'조선 전기 산수화',description:'산과 물을 따라 시선이 이동하도록 화면을 펼쳐, 현실의 경치와 이상적인 세계를 함께 보여 준 그림이에요.'},
    '기하학적 추상':{title:'기하학적 추상',description:'사물을 그대로 그리지 않고 원·선·삼각형 같은 도형과 색의 관계로 화면의 리듬과 균형을 만든 추상 미술이에요.'},
    '근대 조각':{title:'근대 조각',description:'고전 조각의 매끈한 이상미에서 벗어나, 거친 표면과 긴장된 몸을 통해 인물의 에너지와 내면을 드러낸 조각이에요.'},
    '근대 미술':{title:'근대 미술',description:'19세기 말부터 화가들이 현실을 그대로 재현하는 방식에서 벗어나, 개인의 시선과 새로운 형태를 실험한 미술이에요.'}
  };
  function getMovement(work){return (work.tags||[]).map(tag=>[tag,movementGuide[tag]]).find(([,guide])=>guide);}
  function getExtendedGuide(work){
    if(work.id==='p09')return{
      background:'밀레가 이 그림을 그린 19세기 프랑스에는 농사를 지어 살아가는 사람이 아주 많았어요. 당시 미술에서는 왕이나 영웅을 크게 그리는 일이 흔했지만, 밀레는 평범한 농민의 고된 노동도 중요한 이야기라고 생각했어요. 이런 태도를 사실주의라고 해요.'
    };
    return{
      background:work.styleNote||`${work.year} 무렵, ${work.artist}는 자신만의 눈으로 사람과 세상을 관찰해 이 작품을 만들었어요. 작품이 만들어진 시대와 화가의 생각을 함께 떠올리며 감상해 보세요.`
    };
  }
  function showWork(work,room){
    window.ClassGameSfx?.play('card');
    document.getElementById('modal-image').src=work.image;document.getElementById('modal-image').alt=work.title;
    document.getElementById('modal-room').textContent=`GALLERY ${room.number} · ${room.title}`;document.getElementById('modal-title').textContent=work.title;
    const englishTitle=document.getElementById('modal-title-en');englishTitle.textContent=work.englishTitle||'';englishTitle.hidden=!work.englishTitle;
    const tags=document.getElementById('modal-tags');tags.replaceChildren(...(work.tags||[]).map(label=>{const tag=document.createElement('span');tag.textContent=label;return tag;}));tags.hidden=!work.tags?.length;
    document.getElementById('modal-artist').textContent=work.artist;document.getElementById('modal-year').textContent=work.year;document.getElementById('modal-medium').textContent=work.medium;
    const extendedGuide=getExtendedGuide(work);
    document.getElementById('modal-size').textContent=formatSize(work);document.getElementById('modal-docent').textContent=work.docent;document.getElementById('modal-background').textContent=extendedGuide.background;document.getElementById('modal-point').textContent=work.point;
    const movement=getMovement(work),movementCard=document.getElementById('movement-card');
    movementCard.hidden=!movement;
    if(movement){const [tag,guide]=movement;document.getElementById('movement-title').textContent=guide.title;document.getElementById('movement-description').textContent=guide.description;document.getElementById('movement-connection').textContent=`이 작품에서는 ${tag}의 특징을 찾아볼 수 있어요.`;}
    const legal=document.getElementById('modal-legal'),rights=String(work.rights||''),needsCredit=/©|CC BY|공공누리|저작권자|출처 표시/.test(rights);
    legal.hidden=!needsCredit;legal.open=false;document.getElementById('modal-rights').textContent=needsCredit?rights:'';document.getElementById('modal-source').href=work.source;modal.showModal();keysClear();
  }

  function keysClear(){Object.keys(keys).forEach(k=>keys[k]=false);velocity.set(0,0,0);}

  function updateMovement(dt){
    if(modal.open||finaleModal.open)return;
    let f=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0),s=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);
    tmpDirection.set(-Math.sin(yaw),0,-Math.cos(yaw));tmpRight.set(Math.cos(yaw),0,-Math.sin(yaw));
    const wish=new THREE.Vector3().addScaledVector(tmpDirection,f).addScaledVector(tmpRight,s);if(wish.lengthSq()>0)wish.normalize();
    const accel=28,maxSpeed=(keys.ShiftLeft||keys.ShiftRight)?7.5:4.8;velocity.addScaledVector(wish,accel*dt);velocity.multiplyScalar(Math.pow(.03,dt));if(velocity.length()>maxSpeed)velocity.setLength(maxSpeed);
    const oldX=camera.position.x,oldZ=camera.position.z;camera.position.addScaledVector(velocity,dt);const half=4.85;
    camera.position.x=clamp(camera.position.x,-half,half);camera.position.z=clamp(camera.position.z,GALLERY_END+1.4,6.5);
    for(const o of sculptureObstacles){const dx=camera.position.x-o.x,dz=camera.position.z-o.z,dist=Math.hypot(dx,dz);if(dist<o.r){if(dist<.001){camera.position.x=oldX;camera.position.z=oldZ;}else{camera.position.x=o.x+dx/dist*o.r;camera.position.z=o.z+dz/dist*o.r;}}}
    camera.position.y=1.68+Math.sin(performance.now()*.009)*Math.min(velocity.length()*.012,.025);camera.rotation.set(pitch,yaw,0);
    progressEl.style.width=clamp((6.5-camera.position.z)/(6.5-(GALLERY_END+1.4))*100,0,100)+'%';
  }

  function updateFocus(){
    raycaster.setFromCamera(centerPointer,camera);const hits=raycaster.intersectObjects(clickable,false);const hit=hits.find(h=>h.distance<8.5);
    nearest=hit?hit.object:null;prompt.hidden=!nearest;
    if(nearest){
      const finaleRoom=nearest.userData.finaleRoom;
      promptKicker.textContent=finaleRoom?'전시실 확인':'작품 가까이';
      promptTitle.textContent=finaleRoom?`${finaleRoom.title} · 확인 문제`:nearest.userData.work.title;
      promptAction.textContent=finaleRoom?'클릭해서 확인 문제 풀기':'클릭해서 감상하기';
    }
    for(const entry of remotePeople.values())entry.group.visible=entry.room===rooms[activeRoom].id&&!nearest;
  }

  function updateSelfAvatar(){
    const forwardX=-Math.sin(yaw),forwardZ=-Math.cos(yaw);
    selfAvatar.position.set(camera.position.x+forwardX*1.05,-.12,camera.position.z+forwardZ*1.05);
    selfAvatar.rotation.y=yaw;
    selfAvatar.visible=!nearest&&!modal.open&&!finaleModal.open;
  }

  function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);updateMovement(dt);updateArtLights(dt);updateFocus();updateSelfAvatar();sendPresence();renderer.render(scene,camera);}

  addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowRight','ArrowLeft','Space'].includes(e.code))e.preventDefault();keys[e.code]=true;if(e.code==='Escape'){if(finaleModal.open){window.ClassGameSfx?.play('click');finaleModal.close();}else if(modal.open){window.ClassGameSfx?.play('click');modal.close();}}if(e.code==='Enter'&&nearest&&!modal.open&&!finaleModal.open){if(nearest.userData.finaleRoom)showFinale(nearest.userData.finaleRoom);else showWork(nearest.userData.work,nearest.userData.room);}});
  addEventListener('keyup',e=>{keys[e.code]=false;});
  canvas.addEventListener('pointerdown',e=>{dragging=true;pointerDown={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,time:performance.now()};canvas.classList.add('dragging');canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!dragging||!pointerDown)return;const dx=e.clientX-pointerDown.lastX,dy=e.clientY-pointerDown.lastY;pointerDown.lastX=e.clientX;pointerDown.lastY=e.clientY;yaw-=dx*.0032;pitch=clamp(pitch-dy*.0025,-1.15,1.15);});
  canvas.addEventListener('pointerup',e=>{dragging=false;canvas.classList.remove('dragging');if(!pointerDown)return;const moved=Math.hypot(e.clientX-pointerDown.x,e.clientY-pointerDown.y);if(moved<8&&performance.now()-pointerDown.time<550){pointer.x=e.clientX/innerWidth*2-1;pointer.y=-(e.clientY/innerHeight)*2+1;raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(clickable,false).find(x=>x.distance<10);if(hit){if(hit.object.userData.finaleRoom)showFinale(hit.object.userData.finaleRoom);else showWork(hit.object.userData.work,hit.object.userData.room);}}pointerDown=null;});
  canvas.addEventListener('pointercancel',()=>{dragging=false;pointerDown=null;canvas.classList.remove('dragging');});
  addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false);renderer.setPixelRatio(Math.min(devicePixelRatio,MAX_PIXEL_RATIO));});
  document.getElementById('modal-close').addEventListener('click',()=>modal.close());document.getElementById('finale-close').addEventListener('click',()=>finaleModal.close());
  finaleNext.addEventListener('click',()=>{finaleQuizIndex++;const total=finaleQuizQuestions.length;if(finaleQuizIndex>=total){if(finaleQuizCorrect===total)showFinaleCompletion(finaleQuizRoom,true);else showFinaleRetry(finaleQuizRoom);}else renderFinaleQuestion();});
  document.getElementById('finale-again').addEventListener('click',()=>startFinaleQuiz(finaleQuizRoom));
  for(const d of [modal,finaleModal])d.addEventListener('click',e=>{if(e.target===d){window.ClassGameSfx?.play('click');d.close();}});
  document.querySelectorAll('.touch-controls button').forEach(b=>{const k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true;});b.addEventListener('pointerup',()=>keys[k]=false);b.addEventListener('pointercancel',()=>keys[k]=false);});

  buildTabs();setRoom(0);connectClassPresence();animate();
  setInterval(()=>{if(document.visibilityState==='visible')void loadMuseumCompletions(rooms[activeRoom]);},30000);
})();
