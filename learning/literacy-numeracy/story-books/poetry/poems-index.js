(() => {
    "use strict";
    // 책장·소재 화면이 쓰는 칸만 모은 차례표. 본문과 문제는 시를 열 때 poems/<아이디>.js로 따로 받는다.
    // 문제 수와 현대어 유무는 tools/rebuild-index.mjs가 다시 적는다.
    window.POETRY_POEM_INDEX = [
        {
            "id": "jiyong-hosu",
            "title": "호수",
            "poet": "정지용",
            "poetDied": 1950,
            "rights": "public",
            "basis": "expired",
            "grade": 3,
            "topics": [
                "그리움"
            ],
            "point": "짧은 일곱 줄에 장면 하나와 마음 하나가 다 들어 있어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jiyong-byeoltong",
            "title": "별똥",
            "poet": "정지용",
            "poetDied": 1950,
            "rights": "public",
            "basis": "expired",
            "grade": 3,
            "topics": [
                "밤과 달"
            ],
            "point": "짧은 시 한 편에 어린 날부터 다 자랄 때까지가 담겼어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jiyong-hongsi",
            "title": "홍시",
            "poet": "정지용",
            "poetDied": 1950,
            "rights": "public",
            "basis": "expired",
            "grade": 3,
            "topics": [
                "가을",
                "가족"
            ],
            "point": "감나무 아래 한 장면에 기다리는 마음과 쫓는 소리가 함께 있어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "taeeung-gamjakkot",
            "title": "감자꽃",
            "poet": "권태응",
            "poetDied": 1951,
            "rights": "public",
            "basis": "expired",
            "grade": 3,
            "topics": [
                "여름"
            ],
            "point": "같은 짜임을 두 번 되풀이해서 규칙 하나를 못 박아요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "sowol-eommaya",
            "title": "엄마야 누나야",
            "poet": "김소월",
            "poetDied": 1934,
            "rights": "public",
            "basis": "expired",
            "grade": 3,
            "topics": [
                "가족"
            ],
            "point": "첫 줄과 마지막 줄이 똑같아서 바라는 마음이 더 또렷해져요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "sowol-geumjandi",
            "title": "금잔디",
            "poet": "김소월",
            "poetDied": 1934,
            "rights": "public",
            "basis": "expired",
            "grade": 3,
            "topics": [
                "봄"
            ],
            "point": "한 낱말을 거듭하며 시작하고, 비슷한 줄을 짝지어 되풀이해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "deokchul-bompyeonji",
            "title": "봄편지",
            "poet": "서덕출",
            "poetDied": 1940,
            "rights": "public",
            "basis": "expired",
            "grade": 3,
            "topics": [
                "봄"
            ],
            "point": "소식을 물건 하나에 담아 보내는 생각이 시 전체를 이끌어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-haetbi",
            "title": "햇비",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 3,
            "topics": [
                "여름"
            ],
            "point": "흉내내는 말이 줄마다 놓여서 소리 내어 읽으면 더 신이 나요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-chamsae",
            "title": "참새",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 3,
            "topics": [
                "동물",
                "가을"
            ],
            "point": "참새 소리가 그대로 참새가 쓰는 글자가 되는 재미난 생각이에요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-nun",
            "title": "눈",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 3,
            "topics": [
                "겨울"
            ],
            "point": "'인가 봐'라는 짐작으로 시를 맺어요. 답을 못 박지 않아 더 정답게 느껴져요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-banditbul",
            "title": "반딧불",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 3,
            "topics": [
                "밤과 달",
                "여름"
            ],
            "point": "처음과 끝을 똑같은 묶음으로 감싸서 노래처럼 들려요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "folk-saeya",
            "title": "새야 새야 파랑새야",
            "poet": "전래동요",
            "poetDied": null,
            "rights": "public",
            "basis": "oral",
            "grade": 3,
            "topics": [
                "동물"
            ],
            "point": "새를 부르며 부탁하는 노래예요. 부름말이 첫 줄을 이끌어요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "folk-dara",
            "title": "달아 달아 밝은 달아",
            "poet": "전래동요",
            "poetDied": null,
            "rights": "public",
            "basis": "oral",
            "grade": 3,
            "topics": [
                "밤과 달",
                "가족"
            ],
            "point": "달을 부르는 것으로 시작해 바라는 일을 차례차례 늘어놓아요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "folk-dukkeobi",
            "title": "두껍아 두껍아",
            "poet": "전래동요",
            "poetDied": null,
            "rights": "public",
            "basis": "oral",
            "grade": 3,
            "topics": [
                "동물",
                "놀이"
            ],
            "point": "세 줄뿐인데도 부름과 주고받기가 다 들어 있어요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "folk-eodikkaji",
            "title": "어디까지 왔니",
            "poet": "전래동요",
            "poetDied": null,
            "rights": "public",
            "basis": "oral",
            "grade": 3,
            "topics": [
                "놀이"
            ],
            "point": "묻고 답하기를 번갈아 하면서 거리가 점점 가까워져요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "rossetti-baram",
            "title": "누가 바람을 보았나요",
            "poet": "크리스티나 로세티",
            "poetDied": 1894,
            "rights": "public",
            "basis": "own-translation",
            "grade": 3,
            "topics": [
                "자연"
            ],
            "point": "물음으로 시작해 물음으로 다시 시작해요. 보이지 않는 것을 어떻게 아는지 함께 생각하게 해요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "stevenson-geurimja",
            "title": "나의 그림자",
            "poet": "로버트 루이스 스티븐슨",
            "poetDied": 1894,
            "rights": "public",
            "basis": "own-translation",
            "grade": 4,
            "topics": [
                "놀이"
            ],
            "point": "'~처럼', '~닮았고' 같은 말로 그림자를 눈에 보이게 그려요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "stevenson-bi",
            "title": "비",
            "poet": "로버트 루이스 스티븐슨",
            "poetDied": 1894,
            "rights": "public",
            "basis": "own-translation",
            "grade": 4,
            "topics": [
                "자연"
            ],
            "point": "가까운 곳에서 먼 곳으로 눈길을 옮기며 내리는 비를 그려요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "stevenson-geune",
            "title": "그네",
            "poet": "로버트 루이스 스티븐슨",
            "poetDied": 1894,
            "rights": "public",
            "basis": "own-translation",
            "grade": 4,
            "topics": [
                "놀이"
            ],
            "point": "몸이 오르내리는 느낌과 눈에 들어오는 풍경을 함께 그려요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "rossetti-bunhong",
            "title": "분홍은 무엇일까요",
            "poet": "크리스티나 로세티",
            "poetDied": 1894,
            "rights": "public",
            "basis": "own-translation",
            "grade": 4,
            "topics": [
                "자연"
            ],
            "point": "빛깔마다 묻고 답하기를 되풀이하면서 눈으로 보는 것만으로 시 한 편을 채워요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "leejanghee-bomeun",
            "title": "봄은 고양이로다",
            "poet": "이장희",
            "poetDied": 1929,
            "rights": "public",
            "basis": "expired",
            "grade": 4,
            "topics": [
                "봄",
                "동물"
            ],
            "point": "고양이의 털·눈·입술·수염을 봄의 네 가지에 하나씩 견주어 놓았어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-bom",
            "title": "봄",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 4,
            "topics": [
                "봄",
                "가족"
            ],
            "point": "바람은 애기가 되고 해님은 아저씨가 돼요. 온 봄이 한 식구처럼 늘어앉아요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-jogaekkeopjil",
            "title": "조개껍질",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 4,
            "topics": [
                "그리움",
                "가족"
            ],
            "point": "조개껍데기가 짝을 그리워하고, 말하는 이도 바다를 그리워해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-gulttuk",
            "title": "굴뚝",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 4,
            "topics": [
                "겨울",
                "놀이"
            ],
            "point": "말하는 이는 집 밖에서 굴뚝만 보고 안에서 벌어지는 일을 그려 냈어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-ojumssagae",
            "title": "오줌싸개 지도",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 4,
            "topics": [
                "가족"
            ],
            "point": "웃음이 나는 제목인데, 읽고 나면 엄마 아빠가 곁에 없다는 사정이 남아요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-geojitburi",
            "title": "거짓부리",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 4,
            "topics": [
                "동물",
                "놀이"
            ],
            "point": "두 번 다 속고 두 번 다 헛걸음이에요. 같은 짜임을 겹쳐서 웃음을 만들어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "kimyeongrang-omae",
            "title": "오매 단풍 들것네",
            "poet": "김영랑",
            "poetDied": 1950,
            "rights": "public",
            "basis": "expired",
            "grade": 4,
            "topics": [
                "가을",
                "가족"
            ],
            "point": "누이가 한 말을 그대로 옮겨 놓고, 그 곁에서 누이를 바라보는 사람이 말해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "leebaek-jeongyasa",
            "title": "고요한 밤의 생각",
            "poet": "이백",
            "poetDied": 762,
            "rights": "public",
            "basis": "own-translation",
            "grade": 4,
            "topics": [
                "밤과 달",
                "그리움"
            ],
            "point": "고개를 들었다 숙이는 두 몸짓만으로 그리움을 다 말해요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "dubo-chunyahuiu",
            "title": "봄밤에 내리는 반가운 비",
            "poet": "두보",
            "poetDied": 770,
            "rights": "public",
            "basis": "own-translation",
            "grade": 4,
            "topics": [
                "봄",
                "자연"
            ],
            "point": "비를 눈치 빠른 손님처럼 그렸어요. 소리 없이 든다는 말이 밤을 조용하게 만들어요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "manhae-narutbae",
            "title": "나룻배와 행인",
            "poet": "한용운",
            "poetDied": 1944,
            "rights": "public",
            "basis": "expired",
            "grade": 5,
            "topics": [
                "기다림"
            ],
            "point": "'~같이'를 쓰지 않고 '나는 나룻배'라고 곧장 말해요. 빗댄 말을 감추면 힘이 세져요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-sonyeon",
            "title": "소년",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 5,
            "topics": [
                "가을",
                "그리움"
            ],
            "point": "줄을 나누지 않고 이어 쓴 시예요. 하늘빛이 눈썹에 들고 손금이 강물이 돼요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "yeongrang-doldam",
            "title": "돌담에 속삭이는 햇발",
            "poet": "김영랑",
            "poetDied": 1950,
            "rights": "public",
            "basis": "expired",
            "grade": 5,
            "topics": [
                "봄"
            ],
            "point": "ㄹ과 ㅅ 소리가 이어져서 읽기만 해도 부드러운 느낌이 나요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "wangbangyeon-cheonmalli",
            "title": "천만 리 머나먼 길에",
            "poet": "왕방연",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 5,
            "topics": [
                "이별"
            ],
            "point": "우는 것은 냇물이 아니라 앉아 있는 사람이에요. 제 마음을 물에 옮겨 놓았어요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "leegae-chokbul",
            "title": "방 안에 혓는 촉불",
            "poet": "이개",
            "poetDied": 1456,
            "rights": "public",
            "basis": "classic",
            "grade": 5,
            "topics": [
                "이별"
            ],
            "point": "촛농을 눈물로, 심지가 타는 것을 속이 타는 것으로 보았어요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "sowol-sanyuhwa",
            "title": "산유화",
            "poet": "김소월",
            "poetDied": 1934,
            "rights": "public",
            "basis": "expired",
            "grade": 5,
            "topics": [
                "자연"
            ],
            "point": "첫 묶음은 '피네', 마지막 묶음은 '지네'예요. 한 글자만 바꾸어 처음과 끝을 맞세웠어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "sowol-gaeyeoul",
            "title": "개여울",
            "poet": "김소월",
            "poetDied": 1934,
            "rights": "public",
            "basis": "expired",
            "grade": 5,
            "topics": [
                "기다림",
                "봄"
            ],
            "point": "물음으로 시작해서 물음으로 끝나요. 그 사이에 지난 약속이 떠올라요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-saeroun-gil",
            "title": "새로운 길",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 5,
            "topics": [
                "다짐"
            ],
            "point": "처음과 끝이 똑같은 두 줄이에요. 같은 길인데 가운데에서 날마다 다른 일이 벌어져요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "yunseondo-ouga",
            "title": "오우가",
            "poet": "윤선도",
            "poetDied": 1671,
            "rights": "public",
            "basis": "classic",
            "grade": 5,
            "topics": [
                "자연"
            ],
            "point": "세 수를 이어 놓았어요. 수마다 세 줄이고, 마지막 줄은 '두어라·아마도'처럼 감탄으로 시작해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "leesunsin-hansanseom",
            "title": "한산섬 달 밝은 밤에",
            "poet": "이순신",
            "poetDied": 1598,
            "rights": "public",
            "basis": "classic",
            "grade": 5,
            "topics": [
                "밤과 달"
            ],
            "point": "달밤·수루·큰 칼로 자리를 잡아 놓고, 마지막 줄에서 피리 소리 하나로 마음을 흔들어요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "hwanghui-daechu",
            "title": "대추 볼 붉은 골에",
            "poet": "황희",
            "poetDied": 1452,
            "rights": "public",
            "basis": "classic",
            "grade": 5,
            "topics": [
                "가을"
            ],
            "point": "가을에 저절로 갖추어진 것들을 늘어놓다가, 마지막 줄에서 술까지 익었다며 웃어요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "leejeongbo-gukhwa",
            "title": "국화야 너는 어이",
            "poet": "이정보",
            "poetDied": 1766,
            "rights": "public",
            "basis": "classic",
            "grade": 5,
            "topics": [
                "가을"
            ],
            "point": "국화를 부르며 묻고, 마지막 줄에서 스스로 답해요. 시조가 자주 쓰는 짜임이에요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "sowol-jindallae",
            "title": "진달래꽃",
            "poet": "김소월",
            "poetDied": 1934,
            "rights": "public",
            "basis": "expired",
            "grade": 6,
            "topics": [
                "이별",
                "봄"
            ],
            "point": "곱게 보내 드리겠다는 말과 꽃까지 뿌리겠다는 말이, 실은 가지 말라는 말이에요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "sowol-meonhuil",
            "title": "먼 후일",
            "poet": "김소월",
            "poetDied": 1934,
            "rights": "public",
            "basis": "expired",
            "grade": 6,
            "topics": [
                "이별",
                "그리움"
            ],
            "point": "네 번이나 “잊었노라”라고 하는데, 마지막 묶음에서 아직 잊지 않았다고 스스로 밝혀요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "sasol-dukkeobi",
            "title": "두꺼비 파리를 물고",
            "poet": "사설시조",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 6,
            "topics": [
                "동물",
                "웃음"
            ],
            "point": "자빠져 놓고도 제가 날래서 다행이라고 뽐내요. 웃음으로 힘센 척하는 이를 비꼬는 노래예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "manhae-bokjong",
            "title": "복종",
            "poet": "한용운",
            "poetDied": 1944,
            "rights": "public",
            "basis": "expired",
            "grade": 6,
            "topics": [
                "사랑"
            ],
            "point": "복종이 자유보다 달콤하다는 말은 앞뒤가 안 맞아요. 그런데 읽고 나면 뜻이 통해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "manhae-alsu",
            "title": "알 수 없어요",
            "poet": "한용운",
            "poetDied": 1944,
            "rights": "public",
            "basis": "expired",
            "grade": 6,
            "topics": [
                "자연"
            ],
            "point": "다 타 버린 재가 다시 기름이 된다는 말은 말이 안 되지만, 끝나지 않는 마음을 그렇게 말해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-seosi",
            "title": "서시",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 6,
            "topics": [
                "다짐",
                "밤과 달"
            ],
            "point": "별은 밤하늘의 별이면서, 부끄럼 없이 살고 싶은 마음이기도 해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "yuksa-cheongpodo",
            "title": "청포도",
            "poet": "이육사",
            "poetDied": 1944,
            "rights": "public",
            "basis": "expired",
            "grade": 6,
            "topics": [
                "여름",
                "기다림"
            ],
            "point": "푸른 것들 사이에 흰 돛단배·은쟁반·하얀 모시 수건이 놓여요. 손님은 끝까지 오지 않아요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "nocheonmyeong-saseum",
            "title": "사슴",
            "poet": "노천명",
            "poetDied": 1957,
            "rights": "public",
            "basis": "expired",
            "grade": 6,
            "topics": [
                "동물",
                "그리움"
            ],
            "point": "사슴을 그렸지만 물속을 들여다보는 것은 사람이에요. 사슴이 곧 말하는 이의 모습이에요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-jahwasang",
            "title": "자화상",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 6,
            "topics": [
                "가을"
            ],
            "point": "미워졌다가 가엾어졌다가 다시 미워졌다가 그리워져요. 우물에 비친 사나이는 자기 자신이에요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "leebangwon-hayeoga",
            "title": "하여가",
            "poet": "이방원",
            "poetDied": 1422,
            "rights": "public",
            "basis": "classic",
            "grade": 6,
            "topics": [
                "설득"
            ],
            "point": "얽힌 칡덩굴을 들어 “우리도 이렇게 어울려 살자”고 꾑니다. 대답을 요구하는 노래예요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "jeongmongju-dansimga",
            "title": "단심가",
            "poet": "정몽주",
            "poetDied": 1392,
            "rights": "public",
            "basis": "classic",
            "grade": 6,
            "topics": [
                "다짐"
            ],
            "point": "「하여가」에 대한 대답이에요. 같은 세 줄 틀에 정반대의 뜻을 담았어요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "goryeo-gasiri",
            "title": "가시리",
            "poet": "고려가요",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 6,
            "topics": [
                "이별"
            ],
            "point": "네 묶음마다 똑같은 후렴이 붙어요. 슬픈 내용에 흥겨운 후렴이 얹혀 있어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "goryeo-cheongsan",
            "title": "청산별곡",
            "poet": "고려가요",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 6,
            "topics": [
                "자연"
            ],
            "point": "후렴에는 뜻이 없어요. 그런데 그 소리 덕분에 노래가 굴러가고 슬픔이 견딜 만해져요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "gojia-guji",
            "title": "구지가",
            "poet": "옛 노래",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 6,
            "topics": [
                "옛이야기"
            ],
            "point": "부르고, 시키고, 안 하면 어쩌겠다고 으릅니다. 네 줄 안에 세 걸음이 다 들어 있어요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "jiyong-hyangsu",
            "title": "향수",
            "poet": "정지용",
            "poetDied": 1950,
            "rights": "public",
            "basis": "expired",
            "grade": 6,
            "topics": [
                "그리움",
                "가족"
            ],
            "point": "다섯 묶음마다 똑같은 한 줄이 돌아와요. 옛 노래의 후렴이 현대시에도 그대로 살아 있어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jiyong-yurichang",
            "title": "유리창 1",
            "poet": "정지용",
            "poetDied": 1950,
            "rights": "public",
            "basis": "expired",
            "grade": 7,
            "topics": [
                "이별",
                "밤과 달"
            ],
            "point": "울부짖는 말이 하나도 없어요. 유리를 닦는 손과 별 하나로 아이 잃은 마음을 눌러 놓았어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "sowol-ganeungil",
            "title": "가는 길",
            "poet": "김소월",
            "poetDied": 1934,
            "rights": "public",
            "basis": "expired",
            "grade": 7,
            "topics": [
                "이별",
                "그리움"
            ],
            "point": "앞 두 묶음은 머뭇거리고, 뒤 두 묶음은 까마귀와 강물이 어서 가라고 재촉해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "sowol-jeopdongsae",
            "title": "접동새",
            "poet": "김소월",
            "poetDied": 1934,
            "rights": "public",
            "basis": "expired",
            "grade": 7,
            "topics": [
                "가족",
                "옛이야기"
            ],
            "point": "전해 오는 옛이야기를 시로 옮겼어요. 새 울음소리가 곧 누나가 동생들을 부르는 소리예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "sanghwa-ppaeatgin",
            "title": "빼앗긴 들에도 봄은 오는가",
            "poet": "이상화",
            "poetDied": 1943,
            "rights": "public",
            "basis": "expired",
            "grade": 7,
            "topics": [
                "봄",
                "시대"
            ],
            "point": "봄 들판은 살아 움직이며 반기는데, 첫 줄과 마지막 줄이 그 봄을 남의 땅에 가둬요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "hyangga-jemangmaega",
            "title": "제망매가",
            "poet": "월명사",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 7,
            "topics": [
                "가족",
                "이별"
            ],
            "point": "신라 때 향가를 오늘 말로 옮겼어요. 죽은 누이를 한 가지에서 난 잎에 견주었어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "hyangga-seodongyo",
            "title": "서동요",
            "poet": "서동",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 7,
            "topics": [
                "옛이야기"
            ],
            "point": "아이들에게 부르게 해서 소문을 퍼뜨린 노래예요. 노래가 이야기를 움직였어요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "hyangga-heonhwaga",
            "title": "헌화가",
            "poet": "이름 모를 노인",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 7,
            "topics": [
                "옛이야기"
            ],
            "point": "아무도 오르지 못하는 바위의 꽃을 노인이 꺾어 바치며 부른 노래예요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "gihyeongdo-eomma",
            "title": "엄마 걱정",
            "poet": "기형도",
            "poetDied": 1989,
            "rights": "public",
            "basis": "included",
            "grade": 7,
            "topics": [
                "가족",
                "그리움"
            ],
            "point": "시장에 간 엄마를 빈방에서 기다리던 어린 날을, 어른이 된 지금 돌아보는 시예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "kimjonggil-seongtanje",
            "title": "성탄제",
            "poet": "김종길",
            "poetDied": 2017,
            "rights": "public",
            "basis": "included",
            "grade": 7,
            "topics": [
                "가족",
                "겨울"
            ],
            "point": "앓는 아이를 위해 아버지가 눈 속에서 구해 온 붉은 열매를, 어른이 되어 눈 오는 날 떠올려요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "sinseokjeong-meonnara",
            "title": "그 먼 나라를 알으십니까",
            "poet": "신석정",
            "poetDied": 1974,
            "rights": "public",
            "basis": "included",
            "grade": 7,
            "topics": [
                "가족",
                "자연"
            ],
            "point": "어머니에게 다툼 없는 먼 나라로 함께 가자고 거듭 묻는 시예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "manhae-nim",
            "title": "님의 침묵",
            "poet": "한용운",
            "poetDied": 1944,
            "rights": "public",
            "basis": "expired",
            "grade": 8,
            "topics": [
                "이별",
                "사랑"
            ],
            "point": "님은 갔는데 보내지 않았다고 해요. 슬픔의 힘을 희망 쪽으로 옮겨 붓는 시예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "yuksa-jeoljeong",
            "title": "절정",
            "poet": "이육사",
            "poetDied": 1944,
            "rights": "public",
            "basis": "expired",
            "grade": 8,
            "topics": [
                "겨울",
                "시대"
            ],
            "point": "더 물러설 곳 없는 자리에서 눈을 감고, 겨울을 강철로 된 무지개라 불러요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "yuksa-kkot",
            "title": "꽃",
            "poet": "이육사",
            "poetDied": 1944,
            "rights": "public",
            "basis": "expired",
            "grade": 8,
            "topics": [
                "다짐",
                "시대"
            ],
            "point": "비 한 방울 없는 땅, 얼어붙은 땅, 바다 한복판. 꽃이 필 수 없는 곳마다 꽃을 놓았어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "yeongrang-moran",
            "title": "모란이 피기까지는",
            "poet": "김영랑",
            "poetDied": 1950,
            "rights": "public",
            "basis": "expired",
            "grade": 8,
            "topics": [
                "봄",
                "기다림"
            ],
            "point": "피는 날은 며칠, 기다리는 날은 삼백예순 날. 그래서 봄이 찬란하면서 슬퍼요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-ttodareun",
            "title": "또 다른 고향",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 8,
            "topics": [
                "다짐",
                "밤과 달"
            ],
            "point": "돌아온 고향에 안주하려는 나(백골)와 그것을 깨우는 개, 그리고 떠나려는 나가 한 방에 있어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "ojanghwan-gohyang",
            "title": "고향 앞에서",
            "poet": "오장환",
            "poetDied": 1951,
            "rights": "public",
            "basis": "expired",
            "grade": 8,
            "topics": [
                "고향",
                "봄"
            ],
            "point": "고향 코앞 나루와 주막에서 하루를 서성여요. 들어가지 못하고 장꾼에게 고향을 물어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "yongcheol-tteonaganeun",
            "title": "떠나가는 배",
            "poet": "박용철",
            "poetDied": 1938,
            "rights": "public",
            "basis": "expired",
            "grade": 8,
            "topics": [
                "이별",
                "다짐"
            ],
            "point": "'나 두 야 간다'를 띄어 써서 한 글자씩 짚듯 읽게 해요. 떠나는 다짐과 남는 미련이 한 줄에 있어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "leehwang-dosan",
            "title": "도산십이곡",
            "poet": "이황",
            "poetDied": 1570,
            "rights": "public",
            "basis": "classic",
            "grade": 8,
            "topics": [
                "자연",
                "배움"
            ],
            "point": "열두 수 가운데 세 수예요. 자연을 벗 삼는 마음에서 배움을 그치지 않겠다는 다짐으로 나아가요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "goryeo-dongdong",
            "title": "동동",
            "poet": "고려가요",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 8,
            "topics": [
                "기다림"
            ],
            "point": "열세 묶음 가운데 앞 세 묶음이에요. 달마다 한 묶음씩 이어 가며 님을 그리워해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "goryeo-jeongseokga",
            "title": "정석가",
            "poet": "고려가요",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 8,
            "topics": [
                "사랑"
            ],
            "point": "구운 밤에서 싹이 나야 헤어지겠대요. 될 수 없는 조건을 걸어 절대로 헤어지지 않겠다고 말해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "yuksa-gwangya",
            "title": "광야",
            "poet": "이육사",
            "poetDied": 1944,
            "rights": "public",
            "basis": "expired",
            "grade": 9,
            "topics": [
                "다짐",
                "시대"
            ],
            "point": "하늘이 열리던 날부터 천고 뒤까지, 시간을 크게 펼쳐 놓고 지금 여기에 씨를 뿌려요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "yuksa-gyomok",
            "title": "교목",
            "poet": "이육사",
            "poetDied": 1944,
            "rights": "public",
            "basis": "expired",
            "grade": 9,
            "topics": [
                "다짐"
            ],
            "point": "꽃도 피우지 말라, 거꾸러져도 흔들리지 말라. 한 그루 나무에 굽히지 않는 뜻을 세웠어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-chamhoerok",
            "title": "참회록",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 9,
            "topics": [
                "다짐",
                "시대"
            ],
            "point": "녹슨 거울에 비친 얼굴을 왕조의 유물이라 불러요. 부끄러움을 닦고 또 닦는 시예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-sipjaga",
            "title": "십자가",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 9,
            "topics": [
                "다짐"
            ],
            "point": "높은 첨탑 밑에서 서성이다가, 허락된다면 조용히 자기를 바치겠다고 해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-swipge",
            "title": "쉽게 씌어진 시",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 9,
            "topics": [
                "다짐",
                "시대"
            ],
            "point": "남의 나라 방에서 시가 쉽게 써지는 것을 부끄러워하다가, 끝에서 나와 내가 손을 잡아요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "sowol-chohon",
            "title": "초혼",
            "poet": "김소월",
            "poetDied": 1934,
            "rights": "public",
            "basis": "expired",
            "grade": 9,
            "topics": [
                "이별",
                "그리움"
            ],
            "point": "「진달래꽃」이 눌러 참는 시라면 이 시는 목놓아 부르는 시예요. 느낌표가 시를 이끌어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "sowol-sakju",
            "title": "삭주구성",
            "poet": "김소월",
            "poetDied": 1934,
            "rights": "public",
            "basis": "expired",
            "grade": 9,
            "topics": [
                "그리움",
                "고향"
            ],
            "point": "육천 리, 삼천 리, 사오천 리. 숫자를 늘였다 줄였다 하며 갈 수 없는 거리를 재요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "leesang-geoul",
            "title": "거울",
            "poet": "이상",
            "poetDied": 1937,
            "rights": "public",
            "basis": "expired",
            "grade": 9,
            "topics": [
                "나"
            ],
            "point": "띄어쓰기를 없애 읽는 사람을 멈춰 세워요. 거울 속 나와 악수도 못 하는 갈라진 나를 그렸어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jiyong-gohyang",
            "title": "고향",
            "poet": "정지용",
            "poetDied": 1950,
            "rights": "public",
            "basis": "expired",
            "grade": 9,
            "topics": [
                "고향",
                "그리움"
            ],
            "point": "산꿩도 뻐꾸기도 꽃도 그대로인데 고향이 아니래요. 변한 것은 고향이 아니라 나예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "inhwan-sewol",
            "title": "세월이 가면",
            "poet": "박인환",
            "poetDied": 1956,
            "rights": "public",
            "basis": "expired",
            "grade": 9,
            "topics": [
                "사랑",
                "그리움"
            ],
            "point": "이름은 잊었는데 눈동자와 입술은 남았어요. 노래 가사가 된 시라 처음과 끝이 후렴처럼 돌아와요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "yeongro-nongae",
            "title": "논개",
            "poet": "변영로",
            "poetDied": 1961,
            "rights": "public",
            "basis": "expired",
            "grade": 9,
            "topics": [
                "시대"
            ],
            "point": "푸른 물결과 붉은 마음을 묶음마다 되풀이해요. 빛깔 둘로 한 사람의 뜻을 새겼어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jisang-songin",
            "title": "님을 보내며",
            "poet": "정지상",
            "poetDied": 1135,
            "rights": "public",
            "basis": "own-translation",
            "grade": 9,
            "topics": [
                "이별"
            ],
            "point": "고려 때 한시를 오늘 말로 옮겼어요. 이별 눈물이 강물을 보탠다는 과장이 천 년을 살아남았어요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "geugin-sangchun",
            "title": "상춘곡",
            "poet": "정극인",
            "poetDied": 1481,
            "rights": "public",
            "basis": "classic",
            "grade": 9,
            "topics": [
                "봄",
                "자연"
            ],
            "point": "가사의 앞부분이에요. 네 마디 가락이 끊기지 않고 이어지며 봄 산의 즐거움을 늘어놓아요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "seondo-eobu",
            "title": "어부사시사",
            "poet": "윤선도",
            "poetDied": 1671,
            "rights": "public",
            "basis": "classic",
            "grade": 9,
            "topics": [
                "봄",
                "자연"
            ],
            "point": "봄 노래 마흔 수 가운데 앞 두 수예요. 배 떠라, 닻 들어라 하는 후렴이 수마다 바뀌며 하루를 이끌어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jeongcheol-gwandong",
            "title": "관동별곡",
            "poet": "정철",
            "poetDied": 1593,
            "rights": "public",
            "basis": "classic",
            "grade": 9,
            "topics": [
                "여행",
                "자연"
            ],
            "point": "가사의 첫머리예요. 임금의 명을 받고 길을 떠나 지나는 곳을 하나하나 적어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jiyong-bi",
            "title": "비",
            "poet": "정지용",
            "poetDied": 1950,
            "rights": "public",
            "basis": "expired",
            "grade": 10,
            "topics": [
                "자연",
                "가을"
            ],
            "point": "비가 온다는 말이 한 번도 없어요. 바람, 산새 걸음, 흰 물살, 빗방울로 비 오는 산을 그려요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jiyong-indongcha",
            "title": "인동차",
            "poet": "정지용",
            "poetDied": 1950,
            "rights": "public",
            "basis": "expired",
            "grade": 10,
            "topics": [
                "겨울"
            ],
            "point": "차를 마시는 늙은 주인, 붉은 불, 파릇한 무 순. 바깥은 눈보라인데 방 안은 고요히 따뜻해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jiyong-jangsusan",
            "title": "장수산 1",
            "poet": "정지용",
            "poetDied": 1950,
            "rights": "public",
            "basis": "expired",
            "grade": 10,
            "topics": [
                "겨울",
                "자연"
            ],
            "point": "줄을 나누지 않은 산문시예요. 나무 베는 소리조차 없는 고요 속에서 견디겠다고 해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "yeongrang-dok",
            "title": "독을 차고",
            "poet": "김영랑",
            "poetDied": 1950,
            "rights": "public",
            "basis": "expired",
            "grade": 10,
            "topics": [
                "다짐",
                "시대"
            ],
            "point": "봄을 노래하던 시인이 독을 찼어요. 허무하다는 벗의 말에 맞서 마음을 지키겠다고 해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "yeongrang-buk",
            "title": "북",
            "poet": "김영랑",
            "poetDied": 1950,
            "rights": "public",
            "basis": "expired",
            "grade": 10,
            "topics": [
                "소리"
            ],
            "point": "소리꾼과 고수가 숨결을 맞추는 자리를 노래해요. 북은 소리를 떠나면 가죽일 뿐이래요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "yuksa-jayagok",
            "title": "자야곡",
            "poet": "이육사",
            "poetDied": 1944,
            "rights": "public",
            "basis": "expired",
            "grade": 10,
            "topics": [
                "고향",
                "밤과 달"
            ],
            "point": "수만 집의 불빛이어야 할 고향이 무덤 위 이끼예요. 같은 두 줄이 앞뒤를 감싸요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-gil",
            "title": "길",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 10,
            "topics": [
                "다짐",
                "나"
            ],
            "point": "무엇을 잃었는지도 모른 채 걷는데, 걷는 까닭은 담 저쪽에 내가 남아 있어서예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongju-gan",
            "title": "간",
            "poet": "윤동주",
            "poetDied": 1945,
            "rights": "public",
            "basis": "expired",
            "grade": 10,
            "topics": [
                "다짐",
                "옛이야기"
            ],
            "point": "토끼전의 토끼와 프로메테우스를 한자리에 놓았어요. 간은 지켜야 할 양심이에요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "leesang-ogamdo",
            "title": "오감도 시제1호",
            "poet": "이상",
            "poetDied": 1937,
            "rights": "public",
            "basis": "expired",
            "grade": 10,
            "topics": [
                "나",
                "시대"
            ],
            "point": "열세 아이가 무섭다며 막다른 골목을 달려요. 무서운 아이와 무서워하는 아이뿐인 세상이에요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "hyangga-changiparang",
            "title": "찬기파랑가",
            "poet": "충담사",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 10,
            "topics": [
                "그리움"
            ],
            "point": "달, 물가, 잣나무에 기파랑의 높은 인격을 실어 기려요. 열 줄 향가의 아홉째 줄은 '아아'로 시작해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "hyangga-anminga",
            "title": "안민가",
            "poet": "충담사",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 10,
            "topics": [
                "나라"
            ],
            "point": "나라를 한 집안에 견주었어요. 임금이 지어 달라 해서 지은 노래라 가르치는 말투예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "joseon-yongbi",
            "title": "용비어천가",
            "poet": "정인지 등",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 10,
            "topics": [
                "나라"
            ],
            "point": "훈민정음으로 지은 첫 노래예요. 첫째 장과 둘째 장을 오늘 말로 옮겼어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jeongcheol-samiin",
            "title": "사미인곡",
            "poet": "정철",
            "poetDied": 1593,
            "rights": "public",
            "basis": "classic",
            "grade": 10,
            "topics": [
                "그리움",
                "봄"
            ],
            "point": "임금을 그리는 신하의 마음을 님을 그리는 여인의 말로 바꿔 놓았어요. 앞부분과 봄 노래예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "baekseok-yeoseung",
            "title": "여승",
            "poet": "백석",
            "poetDied": 1996,
            "rights": "public",
            "basis": "included",
            "grade": 10,
            "topics": [
                "시대"
            ],
            "point": "가족을 잃고 여승이 된 한 여인의 삶을, 지금 모습에서 지난날로 거슬러 올라가며 보여 줘요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "hyeonseung-platanus",
            "title": "플라타너스",
            "poet": "김현승",
            "poetDied": 1975,
            "rights": "public",
            "basis": "included",
            "grade": 10,
            "topics": [
                "자연"
            ],
            "point": "한 그루 나무를 길을 함께 가는 벗으로 삼되, 영혼만은 나눠 줄 수 없다고 말하는 시예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "gwangseop-bidulgi",
            "title": "성북동 비둘기",
            "poet": "김광섭",
            "poetDied": 1977,
            "rights": "public",
            "basis": "included",
            "grade": 10,
            "topics": [
                "자연",
                "도시"
            ],
            "point": "산이 파헤쳐지며 보금자리를 잃은 비둘기를 통해 사라져 가는 자연과 평화를 말하는 시예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "hyeonggi-nakhwa",
            "title": "낙화",
            "poet": "이형기",
            "poetDied": 2005,
            "rights": "public",
            "basis": "included",
            "grade": 10,
            "topics": [
                "이별",
                "봄"
            ],
            "point": "가야 할 때를 알고 떠나는 이의 뒷모습처럼, 꽃이 지는 일에서 헤어짐의 축복을 읽는 시예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jeongcheol-gwandong-2",
            "title": "관동별곡 — 금강산과 동해, 그리고 꿈",
            "poet": "정철",
            "poetDied": 1593,
            "rights": "public",
            "basis": "classic",
            "grade": 11,
            "topics": [
                "여행",
                "자연",
                "나라"
            ],
            "point": "금강산 봉우리를 충신에, 파도를 고래에 빗대다가, 꿈에서 술을 백성과 먼저 나누겠다고 해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jeongcheol-songmiin",
            "title": "속미인곡",
            "poet": "정철",
            "poetDied": 1593,
            "rights": "public",
            "basis": "classic",
            "grade": 11,
            "topics": [
                "그리움",
                "나라"
            ],
            "point": "두 여인이 주고받는 말로 짜여 있어요. 묻는 이가 셋째 줄까지, 답하는 이가 긴 사연을, 끝에서 묻는 이가 한 줄 보태요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "heo-gyuwonga",
            "title": "규원가",
            "poet": "허난설헌",
            "poetDied": 1589,
            "rights": "public",
            "basis": "classic",
            "grade": 11,
            "topics": [
                "그리움",
                "여인"
            ],
            "point": "여인이 여인의 목소리로 쓴 가사예요. 앞부분과 끝부분을 실었어요. 견우직녀도 일 년에 한 번은 만나는데 나는 소식조차 없대요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "bakinro-nuhangsa",
            "title": "누항사",
            "poet": "박인로",
            "poetDied": 1642,
            "rights": "public",
            "basis": "classic",
            "grade": 11,
            "topics": [
                "가난",
                "다짐"
            ],
            "point": "가난한 선비의 노래 앞부분과 끝부분이에요. 가난을 감추지 않으면서 충효와 우애를 뜻으로 삼아요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "bakinro-seonsangtan",
            "title": "선상탄",
            "poet": "박인로",
            "poetDied": 1642,
            "rights": "public",
            "basis": "classic",
            "grade": 11,
            "topics": [
                "나라",
                "바다"
            ],
            "point": "임진왜란을 겪은 무인이 다시 수군으로 나가 배 위에서 지은 가사의 첫머리예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jeonghakyu-nongga",
            "title": "농가월령가",
            "poet": "정학유",
            "poetDied": 1859,
            "rights": "public",
            "basis": "classic",
            "grade": 11,
            "topics": [
                "농사",
                "봄"
            ],
            "point": "열두 달 농사일을 달마다 노래한 가사예요. 하늘의 법도를 말하는 첫머리와 정월 앞부분을 실었어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "leei-gosan",
            "title": "고산구곡가",
            "poet": "이이",
            "poetDied": 1584,
            "rights": "public",
            "basis": "classic",
            "grade": 11,
            "topics": [
                "자연",
                "배움"
            ],
            "point": "서시와 첫 굽이, 아홉째 굽이예요. 굽이마다 한 수씩, 자연을 즐기며 학문을 본받겠다고 해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "seondo-manheung",
            "title": "만흥",
            "poet": "윤선도",
            "poetDied": 1671,
            "rights": "public",
            "basis": "classic",
            "grade": 11,
            "topics": [
                "자연",
                "나라"
            ],
            "point": "여섯 수 가운데 세 수예요. 산에 사는 즐거움을 노래하다가 그것도 임금 은혜라고 매듭지어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "seondo-gyeonhoeyo",
            "title": "견회요",
            "poet": "윤선도",
            "poetDied": 1671,
            "rights": "public",
            "basis": "classic",
            "grade": 11,
            "topics": [
                "나라",
                "가족"
            ],
            "point": "젊어서 귀양 가 지은 다섯 수 가운데 셋이에요. 임금을 향한 마음과 어버이 그리움이 나란히 있어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "minyeong-maehwasa",
            "title": "매화사",
            "poet": "안민영",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 11,
            "topics": [
                "겨울",
                "자연"
            ],
            "point": "여덟 수 가운데 두 수예요. 눈 속에 핀 매화를 믿음직한 벗처럼 대해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "goryeo-seogyeong",
            "title": "서경별곡",
            "poet": "고려가요",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 11,
            "topics": [
                "이별",
                "사랑"
            ],
            "point": "이별 앞에서 매달리다가, 끊어지지 않는 믿음을 말하다가, 끝에서 사공을 원망해요. 세 마음이 한 노래에 있어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "goryeo-manjeonchun",
            "title": "만전춘별사",
            "poet": "고려가요",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 11,
            "topics": [
                "사랑",
                "밤과 달"
            ],
            "point": "여섯 묶음 가운데 앞 둘이에요. 얼어 죽어도 좋으니 밤이 더디 새라는 말이 사랑의 세기를 보여 줘요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jeongseo-jeonggwajeong",
            "title": "정과정",
            "poet": "정서",
            "poetDied": null,
            "rights": "public",
            "basis": "classic",
            "grade": 11,
            "topics": [
                "나라",
                "그리움"
            ],
            "point": "귀양 간 신하가 임금께 결백을 호소하는 노래예요. 향가처럼 열 줄 남짓에 '아으'가 들어가요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jehyeon-sarihwa",
            "title": "사리화",
            "poet": "이제현",
            "poetDied": 1367,
            "rights": "public",
            "basis": "own-translation",
            "grade": 11,
            "topics": [
                "농사",
                "시대"
            ],
            "point": "참새는 백성의 곡식을 빼앗는 벼슬아치예요. 새 한 마리에 세상 원망을 실었어요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "leesaek-bubyeongnu",
            "title": "부벽루",
            "poet": "이색",
            "poetDied": 1396,
            "rights": "public",
            "basis": "own-translation",
            "grade": 11,
            "topics": [
                "역사",
                "자연"
            ],
            "point": "텅 빈 성과 천 년 구름, 사라진 영웅과 그대로인 산과 강. 사람의 일과 자연을 맞세웠어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "hwanghyeon-jeolmyeong",
            "title": "절명시",
            "poet": "황현",
            "poetDied": 1910,
            "rights": "public",
            "basis": "own-translation",
            "grade": 11,
            "topics": [
                "시대",
                "나라"
            ],
            "point": "나라가 망하던 1910년, 선비가 마지막으로 남긴 넉 줄이에요. 네 수 가운데 셋째 수예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dasan-tamjin",
            "title": "탐진촌요",
            "poet": "정약용",
            "poetDied": 1836,
            "rights": "public",
            "basis": "own-translation",
            "grade": 11,
            "topics": [
                "농사",
                "시대"
            ],
            "point": "귀양살이하며 본 농촌의 세금 수탈을 넉 줄에 담았어요. 「사리화」의 참새가 여기서는 황두예요.",
            "questionCount": 3,
            "hasModern": false
        },
        {
            "id": "folk-sijipsari",
            "title": "시집살이 노래",
            "poet": "민요",
            "poetDied": null,
            "rights": "public",
            "basis": "oral",
            "grade": 11,
            "topics": [
                "여인",
                "가족"
            ],
            "point": "사촌 동생이 묻고 형님이 답하는 노래예요. 식구를 새에 견주고, 고운 것이 거친 것으로 바뀐 것을 늘어놓아요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "japga-yusanga",
            "title": "유산가",
            "poet": "잡가",
            "poetDied": null,
            "rights": "public",
            "basis": "oral",
            "grade": 11,
            "topics": [
                "봄",
                "자연"
            ],
            "point": "서울 사람들이 부르던 긴 노래의 첫머리예요. 한자말과 우리말이 섞인 채 봄 산을 늘어놓아요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "baekseok-yeounangol",
            "title": "여우난골족",
            "poet": "백석",
            "poetDied": 1996,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "가족",
                "명절"
            ],
            "point": "명절날 큰집에 모인 친척들을 아이의 눈으로 하나하나 늘어놓아요. 음식 냄새와 놀이로 흥성한 공동체를 그려요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "baekseok-namsinuiju",
            "title": "남신의주 유동 박시봉방",
            "poet": "백석",
            "poetDied": 1996,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "나",
                "겨울"
            ],
            "point": "가족과 떨어져 남의 집 방에 세 들어 지내며 자책하다가, 끝에서 눈 속에 굳고 정하게 선 나무를 떠올리며 마음을 다잡아요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "baekseok-huinbaram",
            "title": "흰 바람벽이 있어",
            "poet": "백석",
            "poetDied": 1996,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "나",
                "그리움"
            ],
            "point": "좁은 방 흰 벽에 어머니와 사랑하던 사람의 모습이 지나가고, 외롭고 높고 쓸쓸한 제 운명을 받아들이는 시예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "yongak-nalgeunjip",
            "title": "낡은 집",
            "poet": "이용악",
            "poetDied": 1971,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "시대",
                "고향"
            ],
            "point": "살 수 없어 북쪽으로 떠난 털보네의 빈집을 통해, 나라 잃은 때 무너져 간 농촌을 이야기처럼 들려줘요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "gwanggyun-wasadeung",
            "title": "와사등",
            "poet": "김광균",
            "poetDied": 1993,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "도시",
                "밤과 달"
            ],
            "point": "도시의 밤, 가스등 아래에서 갈 곳을 모르는 사람의 외로움을 그림처럼 그린 시예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "gwanggyun-chuil",
            "title": "추일서정",
            "poet": "김광균",
            "poetDied": 1993,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "가을",
                "도시"
            ],
            "point": "가을 풍경을 낯선 나라의 돈, 공장 굴뚝, 급행열차 같은 도시의 사물에 빗대고, 끝에서 돌을 던지며 외로움을 드러내요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "chihwan-gitbal",
            "title": "깃발",
            "poet": "유치환",
            "poetDied": 1967,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "다짐",
                "바다"
            ],
            "point": "깃발을 소리 없는 외침으로 보고, 닿을 수 없는 곳을 향한 동경과 그 좌절을 물음으로 닫아요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "chihwan-saengmyeong",
            "title": "생명의 서",
            "poet": "유치환",
            "poetDied": 1967,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "다짐",
                "나"
            ],
            "point": "사막으로 가서 본래의 나를 찾겠다는 시예요. 찾지 못하면 그곳에서 죽어도 좋다고 해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "mogwol-nageune",
            "title": "나그네",
            "poet": "박목월",
            "poetDied": 1978,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "자연",
                "여행"
            ],
            "point": "강나루 건너 밀밭 길을 구름에 달 가듯 걷는 나그네. 술 익는 마을을 지나는 느긋한 걸음이에요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jihun-seungmu",
            "title": "승무",
            "poet": "조지훈",
            "poetDied": 1968,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "춤",
                "밤과 달"
            ],
            "point": "여승의 춤을 따라가며 번뇌가 춤으로 승화되는 순간을 그려요. 고깔, 나빌레라 같은 말이 유명해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dujin-hae",
            "title": "해",
            "poet": "박두진",
            "poetDied": 1998,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "다짐",
                "자연"
            ],
            "point": "해야 솟아라 하고 부르며, 사슴과 칡범이 함께 노는 밝고 화합하는 세상을 바라는 시예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jeongju-gukhwa",
            "title": "국화 옆에서",
            "poet": "서정주",
            "poetDied": 2000,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "가을",
                "삶"
            ],
            "point": "소쩍새 울음과 천둥과 무서리를 거쳐 핀 국화를, 젊음을 지나 거울 앞에 선 누님에 견주어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jeongju-chucheonsa",
            "title": "추천사",
            "poet": "서정주",
            "poetDied": 2000,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "옛이야기",
                "다짐"
            ],
            "point": "춘향이 향단에게 그네를 밀어 달라고 해요. 벗어나고 싶지만 그네는 다시 땅으로 내려와요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "suyeong-pul",
            "title": "풀",
            "poet": "김수영",
            "poetDied": 1968,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "시대",
                "자연"
            ],
            "point": "바람에 눕는 풀이 바람보다 먼저 일어나요. 짓눌려도 다시 서는 민중을 풀에 실었어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "suyeong-nun",
            "title": "눈",
            "poet": "김수영",
            "poetDied": 1968,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "겨울",
                "다짐"
            ],
            "point": "눈은 살아 있다고 되풀이하며, 젊은 시인에게 기침을 하고 가래를 뱉자고 해요. 더러운 것을 뱉어 내자는 말이에요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "suyeong-pokpo",
            "title": "폭포",
            "poet": "김수영",
            "poetDied": 1968,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "자연",
                "다짐"
            ],
            "point": "곧은 소리를 내며 떨어지는 폭포에, 게으름과 안일을 뒤집는 곧은 정신을 실었어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "suyeong-gogung",
            "title": "어느 날 고궁을 나오면서",
            "poet": "김수영",
            "poetDied": 1968,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "나",
                "시대"
            ],
            "point": "큰 불의에는 입 다물고 설렁탕집 주인 같은 작은 일에만 화내는 자기를 스스로 비웃는 시예요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "dongyeop-kkeopdegi",
            "title": "껍데기는 가라",
            "poet": "신동엽",
            "poetDied": 1969,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "시대",
                "나라"
            ],
            "point": "사월과 동학의 알맹이만 남고 껍데기는 가라고 외쳐요. 아사달 아사녀로 순수한 우리 겨레를 그렸어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "chunsu-kkot",
            "title": "꽃",
            "poet": "김춘수",
            "poetDied": 2004,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "나",
                "사랑"
            ],
            "point": "이름을 불러 주기 전에는 몸짓이었다가 불러 주니 꽃이 돼요. 이름 부르기가 곧 뜻을 주는 일이에요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "chunsu-seosi",
            "title": "꽃을 위한 서시",
            "poet": "김춘수",
            "poetDied": 2004,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "나"
            ],
            "point": "꽃의 참모습에 닿으려 하지만 손대면 사라져요. 얼굴을 가린 신부처럼 본질은 끝내 감춰져 있어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "sangbyeong-gwicheon",
            "title": "귀천",
            "poet": "천상병",
            "poetDied": 1993,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "삶",
                "하늘"
            ],
            "point": "삶을 소풍에 견주고, 이슬처럼 하늘로 돌아가 아름다웠다고 말하겠대요. 죽음을 담담히 받아들여요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "donggyu-pyeonji",
            "title": "즐거운 편지",
            "poet": "황동규",
            "poetDied": null,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "사랑",
                "기다림"
            ],
            "point": "내 사랑이 사소하다고 말하지만 반대예요. 눈이 그치듯 사랑도 언젠가 그칠 줄 알면서 기다리겠다고 해요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "gyeongnim-nongmu",
            "title": "농무",
            "poet": "신경림",
            "poetDied": 2024,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "농사",
                "시대"
            ],
            "point": "장터에서 농악을 치는 농민들의 울분을 신명으로 풀어내요. 산업화에 밀려난 농촌의 한이에요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jaesam-chueok",
            "title": "추억에서",
            "poet": "박재삼",
            "poetDied": 1997,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "가족",
                "가난"
            ],
            "point": "진주 장터 어물전에서 장사하던 어머니의 가난한 삶과 한을, 별빛과 눈물로 그려요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jaesam-gaeulgang",
            "title": "울음이 타는 가을 강",
            "poet": "박재삼",
            "poetDied": 1997,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "가을",
                "이별"
            ],
            "point": "노을에 붉게 물든 가을 강을 울음이 타는 것으로 보고, 첫사랑부터 끝난 사랑까지의 한을 실어요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "jaegu-sapyeong",
            "title": "사평역에서",
            "poet": "곽재구",
            "poetDied": null,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "겨울",
                "삶"
            ],
            "point": "눈 오는 겨울밤 간이역 대합실, 톱밥 난로 곁에서 막차를 기다리는 가난하고 지친 사람들을 그려요.",
            "questionCount": 4,
            "hasModern": false
        },
        {
            "id": "gihyeongdo-binjip",
            "title": "빈집",
            "poet": "기형도",
            "poetDied": 1989,
            "rights": "public",
            "basis": "included",
            "grade": 11,
            "topics": [
                "이별",
                "사랑"
            ],
            "point": "사랑을 잃고 쓰는 시예요. 함께했던 것들에 작별하고 문을 잠그니, 사랑이 떠난 자리가 빈집이 돼요.",
            "questionCount": 4,
            "hasModern": false
        }
    ];
})();
