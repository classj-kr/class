const BOOK_TITLE = "옹고집전";

const CHAPTER_LABEL = n => (LANG === 'en' ? `Chapter ${n} · ` : `${n}장 · `);

const CHAPTERS = [
    {
        num: 1,
        title: "옹당촌 옹고집",
        art: ["story-01-a.webp", "story-01-b.webp", "story-01-c.webp"],
        artAt: ["곳간이 여섯 채나 되었습니다", "몇 되나 보내려는가", "한겨울에도 불을 때지 않았습니다"],
        paras: [
            "옛날 옹진골 옹당촌이라는 마을에 옹고집이라는 사람이 살았습니다. 이 고을에서 그만한 부자가 없었습니다. 대문에서 곳간까지 걸어가는 데만 한참이 걸렸습니다. 논이 백 마지기요 밭이 그 곱절이요, 곳간이 여섯 채나 되었습니다.",
            "그런데 사람됨이 재물만 못했습니다. 아니, 재물이 늘어날수록 사람됨은 줄어들었습니다. 돈을 세는 손은 빨라졌는데 사람을 보는 눈은 흐려졌습니다.",
            "옹고집은 남에게 무엇 하나 내주는 법이 없었습니다. 곳간에 쌀이 썩어 나가도 굶는 이웃에게 한 되를 꾸어 주지 않았습니다. 오히려 쌀이 상하면 개천에 내다 버렸습니다. 개천에 쌀알이 하얗게 떠내려가는 것을 보고도 눈 하나 깜짝하지 않았습니다.<br>\"남 주느니 버리는 게 낫지. 한 번 주면 자꾸 얻으러 온다.\"",
            "종들에게는 새벽부터 밤까지 일을 시켰습니다. 그러면서 새참 한 그릇이 아까워 물만 떠다 주었습니다. 종들의 손등은 사철 갈라져 있었습니다. 누가 앓아누우면 약을 지어 주기는커녕 밥부터 끊었습니다.<br>\"일 안 하는 입에 밥이 왜 들어가느냐.\" 밥때가 되면 종들은 서로 눈치를 보며 물그릇만 들었습니다.",
            "지나가는 나그네가 하룻밤 재워 달라 하면 몽둥이를 들고 나섰습니다. 거지가 문 앞에 서면 개를 풀었습니다. 옹당촌 개들은 사람을 물도록 길러져 있었습니다. 나그네들 사이에서 옹당촌은 그냥 지나쳐야 하는 마을로 통했습니다.",
            "마을 사람들은 옹고집 집 앞을 지날 때면 일부러 먼 길로 돌아갔습니다.<br>\"저 집 담 밑을 지나면 재수가 없대.\"<br>\"쌀 한 톨 나오지 않는 부잣집이 다 무슨 소용이야.\" 아이들에게는 그 집 앞에서 놀지도 말라고 일렀습니다.",
            "그렇다고 옹고집이 부끄러워한 것은 아닙니다. 남들이 흉을 볼수록 제가 잘하고 있다는 증거로 여겼습니다. 오히려 그 소문을 은근히 자랑스러워했습니다.<br>\"내가 저놈들처럼 물러 터졌으면 이만큼 모았겠느냐.\"",
            "옹고집에게는 아내와 아들딸이 있었습니다. 그러나 집 안에도 웃음소리가 없었습니다. 아이들은 아버지가 마당에 들어서는 기척만 나도 하던 말을 뚝 그쳤습니다. 밥상에서 반찬 하나를 더 집어도 눈총을 받았기 때문입니다.",
            "아내가 어쩌다 친정에 쌀을 보내려 하면 저울부터 가져왔습니다.<br>\"몇 되나 보내려는가. 세어 보고 보내게.\"",
            "아들이 서당에 다니고 싶다 하면 코웃음을 쳤습니다.<br>\"글 읽어 봐야 밥이 나오느냐 떡이 나오느냐. 그 시간에 논에 물이나 대라.\" 아들은 그 뒤로 다시는 서당 이야기를 꺼내지 않았습니다.",
            "그렇게 옹고집의 곳간은 해마다 불어났습니다. 그리고 그 집 담장은 해마다 높아졌습니다. 담이 높아질수록 그 안은 더 조용해졌습니다.",
            "그런데 그 높은 담장 안, 안채에서도 가장 구석진 방 하나에 옹고집의 늙은 어머니가 누워 있었습니다. 햇빛이 하루에 한 뼘도 들지 않는 방이었습니다.",
            "옹고집의 어머니는 여든이 넘었습니다. 몇 해 전부터 다리를 쓰지 못해 누워만 지냈습니다. 젊었을 적에는 삯바느질<span class=\"gloss\">(남의 바느질을 해 주고 삯을 받는 일)</span>로 옹고집을 키운 어머니였습니다.",
            "그런데 그 방에는 한겨울에도 불을 때지 않았습니다.<br>\"누워만 계신 분이 무슨 땔감이 필요하냐. 이불을 덮으면 될 것을.\" 종들도 그 방 앞을 지날 때면 걸음을 빨리했습니다.",
            "밥상은 하루에 두 번 들어갔습니다. 식은 밥에 간장 한 종지가 전부였습니다. 종이 밥을 들여놓고 나오면 그것으로 끝이었습니다. 국은 없었습니다. 여름에는 쉰 밥이 그대로 들어가기도 했습니다.",
            "어느 날 밤, 어머니가 기침을 심하게 했습니다. 며느리가 조심스레 옹고집에게 말했습니다.<br>\"어머님께서 밤새 기침을 하십니다. 의원을 부를까요?\"",
            "옹고집은 장부에서 눈도 떼지 않았습니다.<br>\"의원 값이 얼만 줄 아느냐. 늙으면 다 그런 것이다.\" 장부에는 그날 쓴 돈이 한 푼까지 적혀 있었습니다.",
            "\"그러면 방에 불이라도…….\"<br>\"이 사람이 오늘따라 말이 많구먼.\"",
            "이튿날 아침, 어머니가 아들을 불렀습니다. 옹고집은 마지못해 방에 들어섰습니다. 입김이 하얗게 서렸습니다. 방 안 공기가 바깥보다 차가웠습니다.",
            "\"아범아.\"<br>\"무슨 일이십니까.\"<br>\"내가 오래 살아 미안하구나.\" 목소리가 바람처럼 가늘었습니다.",
            "옹고집이 잠깐 말문이 막혔습니다. 그러나 곧 퉁명스럽게 대답했습니다.<br>\"별말씀을 다 하십니다.\" 그러고는 얼른 화제를 돌렸습니다.",
            "\"다만 한 가지만 부탁하마. 문 앞에 온 사람은 그냥 돌려보내지 마라. 물 한 그릇이라도 주어 보내라. 네 아버지가 그렇게 사셨다.\" 말을 마치고 어머니는 한참 동안 숨을 골랐습니다.",
            "옹고집은 대답하지 않고 방을 나왔습니다. 방문을 닫는 손이 저도 모르게 조금 늦었습니다. 그러고는 마당에서 종을 불러 야단을 쳤습니다.<br>\"어머니 방에 누가 군불을 땠느냐! 아까워서 못 살겠구나.\"",
            "종이 우물쭈물했습니다.<br>\"아무도 안 땠습니다요.\"<br>\"그럼 왜 아침에 굴뚝이 미지근하냐.\"<br>\"그건 부엌 것이 옆으로 스민 것입지요.\"<br>옹고집은 그 부엌 아궁이마저 반으로 줄이라고 일렀습니다. 그날 밤 어머니 방은 전날보다 더 추웠습니다."
        ]
    },
    {
        num: 2,
        title: "문전박대와 취암사의 밤",
        art: ["story-02-a.webp", "story-02-b.webp", "story-02-c.webp"],
        artAt: ["몽둥이가 스님의 어깨를 후려쳤습니다", "밤새 짚을 엮기 시작했습니다", "가짜 옹고집이 고개를 숙이고 산을 내려갔습니다"],
        paras: [
            "그해 가을이었습니다. 월출봉 취암사에서 스님 하나가 시주<span class=\"gloss\">(절에 쌀이나 돈을 보태는 일)</span>를 받으러 옹당촌에 내려왔습니다. 산에는 벌써 서리가 내려 있었습니다.",
            "스님은 마을을 돌며 목탁을 두드렸습니다. 사람들은 형편대로 쌀을 한 줌씩 내주었습니다. 가난한 집에서는 보리를 한 움큼 내주며 미안해했습니다. 스님은 받은 것이 많든 적든 똑같이 허리를 굽혔습니다.",
            "마지막으로 스님이 옹고집의 집 앞에 섰습니다. 담이 어찌나 높은지 지붕이 보이지 않을 지경이었습니다. 스님이 목탁을 두드렸습니다. 안에서는 아무 기척도 없었습니다.",
            "한참 만에 대문이 열리고 옹고집이 나왔습니다. 스님을 위아래로 훑어보더니 대뜸 물었습니다.<br>\"무슨 일이오.\" 목소리에 반가운 기색이라고는 하나도 없었습니다.<br>\"소승은 월출봉 취암사에서 왔습니다. 절이 낡아 지붕을 고치려 하니 시주를 좀 하십시오.\"",
            "옹고집이 코웃음을 쳤습니다.<br>\"절이 낡았으면 중들이 고치면 될 것을, 왜 남의 집 쌀을 얻으러 다니시오?\" 대문 안에서 개 짖는 소리가 났습니다.",
            "\"소승들도 손수 나무를 나르고 있습니다. 다만 기와를 살 돈이 없어…….\"<br>\"그럼 기와를 얹지 마시오. 짚으로 덮으면 될 것 아니오.\" 옹고집은 벌써 대문을 닫으려 하고 있었습니다.",
            "스님은 화를 내지 않았습니다.<br>\"댁의 곳간이 여섯 채라 들었습니다. 쌀 한 되면 소승이 그저 물러가겠습니다.\" 스님의 목소리는 여전히 낮고 고요했습니다.",
            "그 말에 옹고집의 얼굴이 붉어졌습니다.<br>\"내 곳간을 세고 다녔단 말이냐! 이놈이 도둑질하러 온 것이 분명하다!\" 말끝마다 침이 튀었습니다.",
            "옹고집은 마당에서 몽둥이를 집어 들었습니다. 종들이 말릴 새도 없었습니다. 종들도 감히 앞을 막아서지 못했습니다.",
            "\"에이, 이 중놈아!\"<br>몽둥이가 스님의 어깨를 후려쳤습니다. 스님이 비틀거리며 물러섰습니다. 둔탁한 소리가 담을 넘어 골목까지 퍼졌습니다. 목탁이 땅에 떨어져 데굴데굴 굴렀습니다.",
            "옹고집은 그 목탁을 발로 밟아 부수고, 스님의 바랑<span class=\"gloss\">(스님이 등에 지는 자루 모양의 짐)</span>을 빼앗아 담 밖으로 던져 버렸습니다.<br>\"다시 오면 개를 풀 것이다!\" 바랑 속에서 시주 쌀이 쏟아져 흙에 섞였습니다.",
            "스님은 흙투성이가 된 채로 한참을 서 있었습니다. 그러고는 부서진 목탁 조각을 하나하나 주워 담고, 옹고집을 향해 조용히 합장했습니다.<br>\"댁의 집에 곧 손님이 하나 들 것입니다.\"<br>그 말만 남기고 스님은 산으로 올라갔습니다. 조각을 줍는 손이 잘게 떨렸습니다.",
            "그날 밤 취암사에서는 스님들이 모여 앉았습니다. 매를 맞고 돌아온 스님의 어깨에 시퍼런 자국이 나 있었습니다. 숨을 쉴 때마다 어깨가 결리는지 얼굴을 찡그렸습니다.",
            "\"관가에 알립시다.\"<br>\"알려 봐야 소용없습니다. 그 사람이 원님과 술을 나누는 사이랍니다.\" 절 안이 무겁게 가라앉았습니다.",
            "젊은 스님들이 목소리를 높였습니다.<br>\"그런 자는 혼쭐이 나야 합니다.\"<br>\"곳간에 불이라도 놓아야…….\" 절 안이 오랜만에 시끄러워졌습니다.",
            "그때 절에서 가장 나이 많은 노승이 눈을 떴습니다. 오랫동안 아무 말 없이 앉아 있던 노승이었습니다.<br>\"불을 놓으면 그 집 종들이 먼저 탄다.\"",
            "스님들이 입을 다물었습니다. 노승이 말을 이었습니다.<br>\"그리고 재물을 태워 봐야 그 사람은 재물이 아까울 뿐 제 잘못은 끝내 모른다.\" 젊은 스님들이 서로 얼굴을 쳐다보았습니다.",
            "\"그러면 어찌합니까.\"<br>\"제가 남에게 한 짓을 제가 그대로 겪게 해 주면 된다.\" 노승의 목소리는 조금도 높아지지 않았습니다.",
            "노승은 마당으로 내려가 짚단을 한 아름 안고 왔습니다. 그러고는 밤새 짚을 엮기 시작했습니다. 아무도 그 뜻을 묻지 못하고 지켜보기만 했습니다.",
            "팔이 생기고 다리가 생기고 몸통이 생겼습니다. 마지막으로 짚을 둥글게 말아 머리를 얹으니, 사람 크기의 허수아비 하나가 되었습니다. 손놀림이 어찌나 빠른지 짚이 저절로 엮이는 것 같았습니다.",
            "노승은 붓을 들어 누런 종이에 글씨를 썼습니다. 그러고는 그 부적을 허수아비의 이마에 붙였습니다. 글씨가 마르기도 전이었습니다.",
            "노승이 낮은 소리로 무어라 읊조리자, 허수아비의 짚이 스르르 살갗이 되고 눈이 열렸습니다. 이마에 붙은 부적은 스며들 듯 사라졌습니다. 방 안의 등잔불이 한 번 크게 흔들렸습니다.",
            "짚으로 만든 것이 자리에서 일어나 앉았습니다. 그 얼굴이 옹고집과 털끝 하나 다르지 않았습니다. 젊은 스님 하나가 저도 모르게 뒷걸음질을 쳤습니다. 숨소리까지 옹고집과 같았습니다.",
            "\"내려가거라.\" 노승이 말했습니다. 목소리가 낮았지만 방 안에 또렷하게 울렸습니다. \"다만 사람을 해치지는 마라. 집을 다스리고, 곳간을 열고, 그 집 노인을 잘 모셔라. 그것이 네가 할 일이다.\"<br>가짜 옹고집이 고개를 숙이고 산을 내려갔습니다."
        ]
    },
    {
        num: 3,
        title: "또 하나의 옹고집",
        art: ["story-03-a.webp", "story-03-b.webp", "story-03-c.webp"],
        artAt: ["제 옷을 입고 제 걸음으로 걸어 들어오는 사람이 있었습니다", "아내가 달려 나왔습니다", "고을 원님은 두 사람을 보고"],
        paras: [
            "이튿날 낮이었습니다. 옹고집은 사랑방에서 장부를 들여다보고 있었습니다. 그때 마당이 소란스러워졌습니다. 종들이 마당을 가로질러 뛰어다니는 소리가 났습니다.",
            "\"주인어른께서 들어오십니다!\"<br>옹고집이 고개를 들었습니다. 무슨 소리인가 싶었습니다. 자기는 아침부터 이 방에 앉아 있었기 때문입니다. 장부에 적던 붓끝이 멈추었습니다.",
            "문을 열고 마당을 내다본 순간, 옹고집은 그 자리에 얼어붙었습니다. 손에 들고 있던 붓이 방바닥에 떨어졌습니다.",
            "제 옷을 입고 제 걸음으로 걸어 들어오는 사람이 있었습니다. 얼굴도 키도 목소리도 저와 똑같았습니다. 왼쪽 눈썹 끝의 점까지 같았습니다. 걸음걸이까지 제 것이었습니다.",
            "\"네, 네 이놈! 너는 누구냐!\"<br>옹고집이 버선발로 뛰어나갔습니다. 신도 제대로 신지 못했습니다.",
            "가짜 옹고집이 천천히 돌아보았습니다. 그러고는 아주 태연하게 되물었습니다.<br>\"그 말은 내가 물어야겠구나. 남의 집에 들어와 남의 옷을 입고 있는 네가 누구냐.\" 조금도 놀라거나 당황하는 기색이 없었습니다.",
            "\"뭐라고! 이 집이 내 집이다!\"<br>\"이 집은 내 집이다.\" 두 목소리가 겹쳐 어느 쪽인지 알 수 없었습니다.",
            "종들이 하나둘 모여들었습니다. 그러고는 두 사람을 번갈아 보며 어쩔 줄을 몰랐습니다.<br>\"어느 분이 우리 어른이신가…….\"<br>\"이쪽인 것 같기도 하고, 저쪽인 것 같기도 하고.\" 아무도 선뜻 한쪽으로 가지 못했습니다.",
            "아내가 달려 나왔습니다. 옹고집이 반색을 했습니다.<br>\"여보! 어느 쪽이 나요! 말해 보시오!\" 아내의 손이 앞치마를 꽉 쥐고 있었습니다.",
            "아내는 두 사람 사이에 서서 한참을 살폈습니다. 얼굴을 보고, 손을 보고, 목소리를 들었습니다. 그러고는 새파랗게 질려 뒷걸음질을 쳤습니다.<br>\"…모르겠습니다.\" 아내는 그 자리에 주저앉을 뻔했습니다.",
            "아들이 왔습니다. 딸이 왔습니다. 아무도 가리지 못했습니다. 삼십 년을 한집에 산 식구들이었습니다.",
            "옹고집이 발을 굴렀습니다.<br>\"내 얼굴을 보아라! 삼십 년을 한집에 산 사람 얼굴을 못 알아본단 말이냐!\"<br>가짜 옹고집이 조용히 말했습니다.<br>\"얼굴을 알아보지 못하는 것이 아니라, 얼굴 말고는 아는 것이 없어서 그렇겠지.\" 그 말에 진짜 옹고집이 할 말을 잃었습니다.",
            "집안에서 결판이 나지 않자 두 옹고집은 관가로 갔습니다. 온 마을 사람이 구경하러 따라나섰습니다. 관가 마당이 발 디딜 틈 없이 찼습니다.",
            "고을 원님은 두 사람을 보고 눈을 몇 번이나 비볐습니다.<br>\"허, 이런 일은 내 평생 처음이로다.\" 두 사람을 번갈아 보다가 부채로 이마를 짚었습니다.",
            "원님이 물었습니다.<br>\"네가 옹고집이냐?\"<br>\"그러하옵니다.\" 두 사람이 동시에 대답했습니다. 목소리마저 같았습니다. 원님이 헛기침을 했습니다.",
            "원님은 한참을 궁리하다가 무릎을 쳤습니다.<br>\"좋다. 얼굴로는 못 가리니 살림으로 가려 보자. 제 집 일을 아는 자가 그 집 주인이다.\" 구경꾼들이 숨을 죽였습니다.",
            "원님이 먼저 물었습니다.<br>\"곳간이 몇 채이며 그 안에 무엇이 얼마나 들어 있느냐.\" 붓을 든 아전이 종이를 펴고 기다렸습니다.",
            "진짜 옹고집이 얼른 대답했습니다.<br>\"곳간은 여섯 채이옵고, 쌀이 삼백 석, 보리가 백 석이옵니다.\"<br>가짜 옹고집이 고개를 저었습니다.<br>\"곳간은 여섯 채가 맞으나 다섯째 곳간은 지난여름 비가 새어 반이 상했습니다. 지금 쌀은 이백사십 석이고, 상한 것을 골라내어 스무 석은 마을에 내주었습니다.\"",
            "구경하던 사람들이 웅성거렸습니다. 마을 사람 하나가 소리쳤습니다.<br>\"맞습니다요! 지난달에 저희가 쌀을 얻어 갔습니다!\" 여기저기서 고개를 끄덕이는 소리가 났습니다.",
            "진짜 옹고집의 얼굴이 하얘졌습니다. 저는 그런 일을 시킨 적이 없었습니다. 곳간이 상한 것도, 쌀을 내준 것도 처음 듣는 이야기였습니다.",
            "원님이 다시 물었습니다.<br>\"네 집 종이 몇이며 그 이름을 대어라.\"<br>진짜 옹고집이 우물거렸습니다.<br>\"열둘, 아니 열넷쯤 되옵고, 이름은…… 돌쇠와 삼월이와…….\"<br>거기서 말이 막혔습니다. 이마에 땀이 맺혔습니다.",
            "가짜 옹고집이 열넷의 이름을 하나도 빠짐없이 댔습니다. 나이와 고향과 병까지 덧붙였습니다.<br>\"막동이는 왼쪽 어깨를 다쳐 무거운 것을 지지 못하니 부엌일로 돌렸사옵니다.\" 누구도 그렇게 소상히 알 수는 없었습니다.",
            "마지막으로 원님이 물었습니다.<br>\"네 어머니께서는 무엇을 잡숫고 계시냐.\" 마당이 물을 끼얹은 듯 조용해졌습니다.",
            "진짜 옹고집이 입을 열지 못했습니다. 그는 어머니 밥상에 무엇이 오르는지 한 번도 본 적이 없었습니다.<br>가짜 옹고집이 대답했습니다.<br>\"이가 성치 않으셔서 무른 죽을 올리고 있사옵니다. 사흘 전부터 방에 군불을 넣었사옵니다.\" 원님이 천천히 고개를 끄덕였습니다."
        ]
    },
    {
        num: 4,
        title: "쫓겨나 빌어먹다",
        art: ["story-04-a.webp", "story-04-b.webp", "story-04-c.webp"],
        artAt: ["고을 어귀까지 끌고 가 길바닥에 던졌습니다", "헛간 처마 밑에서 웅크리고 잤습니다", "제 집을 내려다보았습니다"],
        paras: [
            "원님이 판결을 내렸습니다.<br>\"이쪽이 진짜 옹고집이다. 저쪽은 남의 집을 빼앗으려 든 자이니 곤장<span class=\"gloss\">(죄인의 볼기를 치던 긴 몽둥이)</span>을 쳐서 고을 밖으로 내쫓아라.\" 원님의 목소리에 조금도 망설임이 없었습니다.",
            "\"안 됩니다! 제가 옹고집입니다! 제가!\"<br>진짜 옹고집이 발버둥을 쳤습니다. 그러나 사령들이 양팔을 붙들었습니다. 소리를 지를수록 사람들은 더 딱하게 여겼습니다.",
            "옹고집은 관가 마당에서 곤장을 맞았습니다. 평생 남에게 매를 들기만 했지 맞아 본 적은 없었습니다. 몇 대를 맞았는지 세지도 못했습니다.",
            "매질이 끝나자 사령들이 그를 고을 어귀까지 끌고 가 길바닥에 던졌습니다.<br>\"다시 이 고을에 발을 들이면 그때는 옥에 가둘 것이다.\" 사령들은 뒤도 돌아보지 않고 돌아갔습니다.",
            "옹고집은 한참을 일어나지 못했습니다. 지나가는 사람들이 힐끔거리며 지나갔습니다. 평소 그의 곳간 앞에서 굽신거리던 얼굴들이었습니다. 그 가운데는 낯익은 마을 사람도 있었지만 아무도 부축해 주지 않았습니다.",
            "해가 지자 추워졌습니다. 옹고집은 다리를 절며 걸었습니다. 갈 데가 없었습니다. 바람이 옷 사이로 그대로 들어왔습니다.",
            "첫 번째 집 문을 두드렸습니다.<br>\"하룻밤만 재워 주십시오.\"<br>안에서 대답이 돌아왔습니다.<br>\"우리도 방이 없소.\" 문틈으로 불빛이 새어 나오는데도 그랬습니다.",
            "두 번째 집에서는 문도 열어 주지 않았습니다. 세 번째 집에서는 개를 풀었습니다. 옹고집은 개에 쫓겨 논두렁으로 굴러떨어졌습니다. 옷이 흙투성이가 되었습니다.",
            "그날 밤 옹고집은 남의 집 헛간 처마 밑에서 웅크리고 잤습니다. 밤새 이가 딱딱 부딪쳤습니다. 짚 한 오라기가 그렇게 따뜻한 줄 처음 알았습니다.",
            "새벽에 눈을 뜨니 온몸이 얼어붙어 있었습니다. 손끝에 감각이 없었습니다. 일어서려 했지만 다리가 말을 듣지 않았습니다.",
            "그 순간 문득 어머니 방이 떠올랐습니다. 한겨울에도 불을 때지 않던 그 방. 이불 한 채로 여러 해를 나던 여든 넘은 노인.",
            "옹고집은 처마 밑에서 몸을 웅크린 채로 오래도록 움직이지 못했습니다. 그 방에 누운 어머니가 어떤 밤을 보냈을지 그제야 알 것 같았습니다.",
            "그때부터 옹고집은 이 마을 저 마을을 떠돌았습니다. 옷은 해지고 신은 떨어져 발이 다 드러났습니다. 이름을 대면 아무도 믿어 주지 않았습니다.",
            "배가 고파 견딜 수 없으면 남의 집 문 앞에 서서 손을 내밀었습니다. 처음에는 그 짓이 죽기보다 싫었습니다. 사흘을 굶고 나서야 손이 저절로 나갔습니다. 손을 내밀면서 그는 늘 고개를 숙였습니다.",
            "어떤 집에서는 밥을 한 덩이 싸 주었습니다. 어떤 집에서는 문을 쾅 닫았습니다. 어떤 집에서는 물을 끼얹었습니다. 그는 그 셋을 다 겪었습니다.",
            "옹고집은 물벼락을 맞고 돌아서면서 처음으로 그 생각을 했습니다.<br>'내가 저 짓을 했구나.' 옷에서 물이 뚝뚝 떨어졌습니다.",
            "그는 문 앞에 온 사람에게 물 한 그릇 준 적이 없었습니다. 개를 풀었고, 몽둥이를 들었습니다. 그때 그 사람들도 지금의 저처럼 사흘을 굶었을 것입니다. 그때는 그 사람들에게도 어머니가 있었을 것입니다.",
            "겨울이 왔습니다. 옹고집은 다리를 절며 눈길을 걸었습니다. 발가락이 얼어 감각이 없어졌습니다. 짚신 대신 천을 감고 걸었습니다.",
            "한번은 어느 마을 잔칫집 담 밖에서 음식 냄새를 맡으며 서 있다가, 그 집 종에게 쫓겨났습니다. 그 종이 그를 밀치며 말했습니다.<br>\"저리 가시오. 잔칫날 재수 없게!\" 담 안에서는 웃음소리가 그치지 않았습니다.",
            "옹고집은 그 말에 대꾸도 못 하고 물러섰습니다. 예전 같으면 몽둥이를 들었을 것입니다. 이제는 몽둥이도 없고 기운도 없었습니다. 그날 밤 그는 담 밖에서 잔칫집 웃음소리를 밤새 들었습니다.",
            "그러던 어느 날, 옹고집은 제 고을 쪽으로 발길이 갔습니다. 들어가면 옥에 갇힐 줄 알면서도 그랬습니다. 어머니가 살아 계신지 그것만은 알고 싶었습니다.",
            "그는 밤중에 마을 뒷산으로 올라가 제 집을 내려다보았습니다. 담장 안이 환했습니다. 멀리서 보니 제 집이 참 컸습니다.",
            "놀랍게도 안채 구석방에서 불빛이 새어 나오고 있었습니다. 굴뚝에서는 연기가 곧게 올라갔습니다. 어머니 방이었습니다. 그 방에 불이 든 것을 그는 본 적이 없었습니다.",
            "옹고집은 그 자리에 주저앉았습니다. 저 방에 불을 넣어 준 것은 짚으로 만든 것이었고, 불을 끊은 것은 아들이었습니다. 옹고집은 소매로 얼굴을 감쌌습니다. 그러고는 밤새 그 자리에 앉아 있었습니다."
        ]
    },
    {
        num: 5,
        title: "눈 위의 노승",
        art: ["story-05-a.webp", "story-05-b.webp", "story-05-c.webp"],
        artAt: ["눈 덮인 산길을 넘다가 그만 쓰러지고", "품에서 주먹밥 하나를 꺼내", "제 집 대문 앞에 섰습니다"],
        paras: [
            "그해 겨울은 유난히 길었습니다. 옹고집은 눈 덮인 산길을 넘다가 그만 쓰러지고 말았습니다. 눈이 무릎까지 쌓여 한 걸음도 떼기가 힘들었습니다.",
            "며칠을 굶은 데다 발이 얼어 더는 걸을 수가 없었습니다. 눈발이 얼굴 위로 내려앉았습니다. 몸이 점점 따뜻해지는 것 같았습니다. 그것이 더 위험한 것인 줄은 몰랐습니다.",
            "'이대로 끝나는구나.'<br>옹고집은 눈을 감았습니다. 이상하게도 억울하다는 생각이 들지 않았습니다. 재물도 집도 하나도 아쉽지 않았습니다. 다만 한 가지가 마음에 걸렸습니다.",
            "어머니께 끝내 한 번도 죄송하다는 말을 하지 못했다는 것이었습니다. 그 한 가지가 자꾸 눈앞에 어른거렸습니다.",
            "얼마나 지났을까요. 누군가 어깨를 흔들었습니다.<br>\"일어나시오.\"",
            "옹고집이 겨우 눈을 떴습니다. 흰 눈 위에 잿빛 승복을 입은 노승이 서 있었습니다. 손에는 지팡이가 들려 있었습니다. 눈발 사이로 지팡이 짚는 소리만 또렷하게 들렸습니다.",
            "노승은 품에서 주먹밥 하나를 꺼내 옹고집의 손에 쥐여 주었습니다. 옹고집은 그것을 허겁지겁 먹었습니다. 따뜻한 것이 목을 넘어가자 눈물이 났습니다. 다 먹고 나서야 목이 메었습니다.",
            "\"스님……. 어찌하여 저 같은 것에게…….\"<br>\"길에 쓰러진 사람에게 밥을 주는 데 까닭이 필요하오?\" 노승은 옹고집 옆에 나란히 앉았습니다.",
            "옹고집은 그 말에 고개를 들지 못했습니다. 저는 평생 까닭을 따졌습니다. 남에게 무엇을 주기 전에 그것이 돌아올지부터 셈했습니다. 돌아올 것이 없으면 주지 않았습니다.",
            "\"스님, 저는 벌을 받아 마땅한 사람입니다. 절에서 오신 스님을 몽둥이로 때려 내쫓은 일이 있습니다.\" 말하고 나니 오히려 속이 후련했습니다.<br>\"알고 있소.\"",
            "옹고집이 놀라 노승을 올려다보았습니다. 노승의 얼굴은 조금도 성난 기색이 없었습니다. 오히려 오래 기다린 사람의 얼굴이었습니다.",
            "\"그대가 그 일을 스스로 입에 올리기까지 겨울 하나가 걸렸구려.\"<br>노승은 품에서 누런 종이 한 장을 꺼냈습니다. 부적이었습니다.<br>\"집으로 가시오. 그리고 이것을 그자에게 던지시오.\" 종이가 눈발에 젖지 않도록 손으로 감쌌습니다.",
            "\"스님, 그 사람은 대체 누구입니까.\"<br>노승이 담담하게 말했습니다.<br>\"짚으로 엮은 것이오. 부적 한 장으로 사람 노릇을 하고 있을 뿐이오.\"",
            "옹고집이 눈을 크게 떴습니다.<br>\"짚이라고요? 그것이 제 집을 다스리고 제 식구를 돌보고…….\"<br>\"그렇소. 짚으로 엮은 것도 하는 일을, 그대는 삼십 년을 하지 않았소.\" 옹고집은 고개를 들 수가 없었습니다.",
            "그 말이 몽둥이보다 아팠습니다. 옹고집은 부적을 두 손으로 받쳐 들었습니다. 종이 한 장이 그렇게 무거울 수가 없었습니다.",
            "\"스님, 한 가지만 여쭙겠습니다. 제가 집에 돌아가면 다시 예전으로 돌아갈까 봐 두렵습니다. 사람이 그렇게 쉽게 바뀌겠습니까?\"",
            "노승이 처음으로 웃었습니다.<br>\"그것을 두려워할 줄 알게 된 것이 바뀐 것이오.\" 그러고는 지팡이를 짚고 일어섰습니다.",
            "옹고집이 고개를 들었을 때 노승은 이미 없었습니다. 눈 위에 지팡이 자국만 몇 개 나 있었습니다. 그 자국마저 눈에 덮여 이내 사라졌습니다.",
            "옹고집은 산을 내려갔습니다. 발이 부르텄지만 걸음이 전보다 빨랐습니다. 가야 할 데가 생겼기 때문입니다.",
            "고을 어귀에 이르렀을 때 그는 잠시 걸음을 멈추었습니다. 사령에게 붙들리면 옥에 갇힐 것이었습니다. 그래도 발길을 돌리지 않았습니다.",
            "옹고집은 큰길로 걸어 들어갔습니다. 숨어 들어가고 싶지 않았습니다. 고개를 들고 걸었습니다.",
            "마을 사람들이 그를 알아보고 수군거렸습니다. 그런데 이상하게도 아무도 사령을 부르지 않았습니다. 옹고집이 오히려 놀랐습니다. 한 노인이 다가와 물었습니다.<br>\"거지 노릇 하느라 고생 많았소?\"<br>옹고집이 고개를 끄덕였습니다.<br>\"예. 많았습니다.\"",
            "노인이 혀를 찼습니다.<br>\"그래도 요새 그 댁이 사람 사는 집이 됐소. 곳간을 열어 겨울을 나게 해 주었지. 우리 손주가 그 댁 쌀로 살았소.\" 노인의 눈가가 젖어 있었습니다.",
            "옹고집은 그 말에 아무 대꾸도 하지 못했습니다. 그러고는 제 집 대문 앞에 섰습니다. 담장이 여전히 높았습니다. 그러나 대문은 열려 있었습니다."
        ]
    },
    {
        num: 6,
        title: "짚으로 돌아가다",
        art: ["story-06-a.webp", "story-06-b.webp", "story-06-c.webp"],
        artAt: ["마당에서 종들이 일하고 있었습니다", "그러고는 부적을 던졌습니다", "어머니 앞에 무릎을 꿇었습니다"],
        paras: [
            "예전에는 늘 빗장이 걸려 있던 대문이었습니다. 빗장은 아예 빼서 담 옆에 세워 두었습니다.",
            "마당에서 종들이 일하고 있었습니다. 그런데 새참 그릇이 놓여 있었고, 웃음소리가 났습니다. 예전 같으면 있을 수 없는 일이었습니다.",
            "누군가 옹고집을 알아보고 소리쳤습니다.<br>\"어, 어른이 또 오셨다!\" 종들이 하던 일을 놓고 몰려나왔습니다.",
            "안채에서 가짜 옹고집이 걸어 나왔습니다. 두 사람이 마당 한가운데에서 마주 섰습니다. 옷차림만 달랐지 얼굴은 여전히 하나였습니다.",
            "식구들이 몰려나왔습니다. 아내도, 아들도, 딸도 나왔습니다. 이번에도 아무도 어느 쪽이 진짜인지 알지 못했습니다. 다만 한쪽은 비단옷이고 한쪽은 누더기였습니다.",
            "그러나 이번에는 옹고집도 그것을 따지지 않았습니다. 그는 품에서 부적을 꺼냈습니다. 따질 마음이 조금도 없었습니다.",
            "\"내가 이 집 주인이라고 우기러 온 것이 아니오.\"<br>가짜 옹고집이 조용히 그를 바라보았습니다.<br>\"그러면 무엇 하러 오셨소.\" 목소리에 노여움도 반가움도 없었습니다.",
            "\"고맙다는 말을 하러 왔소.\"<br>마당이 조용해졌습니다. 가짜 옹고집의 눈이 잠깐 흔들렸습니다.",
            "\"내가 삼십 년을 하지 않은 일을 그대가 반년 만에 다 했소. 어머니 방에 불을 넣어 준 것도, 곳간을 연 것도 그대요. 나는 그 값을 갚을 길이 없소.\" 말하는 동안 목이 자꾸 메었습니다.",
            "옹고집은 부적을 두 손으로 들었습니다. 손이 떨렸습니다.<br>\"다만 이제부터는 내가 하겠소.\" 아내가 무어라 말하려다 입을 다물었습니다.",
            "그러고는 부적을 던졌습니다. 부적이 가짜 옹고집의 가슴에 닿는 순간, 사람의 몸이 스르르 무너져 내렸습니다. 가짜 옹고집은 피하지 않았습니다.",
            "옷이 힘없이 주저앉고, 그 안에서 마른 짚이 우수수 쏟아졌습니다. 바람이 한 번 지나가자 짚 몇 오라기가 마당 위로 날아올랐습니다. 방금까지 사람이던 것이 한 줌 짚이 되었습니다.",
            "식구들이 비명을 지르며 물러섰습니다. 옹고집만이 그 짚 더미 앞에 무릎을 꿇고 앉았습니다. 그러고는 짚을 한 움큼 쥐어 가슴에 안았습니다. 짚에서 아직 사람의 온기가 남아 있는 것 같았습니다.",
            "옹고집이 자리에서 일어났습니다. 식구들이 그를 둘러싸고 어쩔 줄을 몰라 했습니다. 아무도 먼저 입을 열지 못했습니다.",
            "그런데 옹고집은 곳간으로도, 사랑방으로도 가지 않았습니다. 그는 뒤꼍으로 가서 장작을 한 아름 안고 나왔습니다. 장작이 무거워 몇 번이나 고쳐 안았습니다.",
            "\"어른, 그건 종에게 시키시지요.\"<br>\"내가 하겠다.\"",
            "옹고집은 어머니 방 아궁이 앞에 쪼그리고 앉아 불을 지폈습니다. 평생 처음 해 보는 일이라 연기만 매캐하게 났습니다. 눈이 시려 눈물이 났습니다. 옹고집은 소매로 눈을 닦으며 계속 불을 밀어 넣었습니다. 종들이 멀찍이서 그 모습을 지켜보았습니다.",
            "이윽고 불길이 잡히고 굴뚝에서 연기가 곧게 올라갔습니다. 방바닥이 조금씩 데워지기 시작했습니다.",
            "옹고집은 방문을 열고 들어가 어머니 앞에 무릎을 꿇었습니다. 어머니는 눈이 어두워 아들의 얼굴을 알아보지 못했습니다. 방 안이 오랜만에 훈훈했습니다.",
            "\"아범이냐.\"<br>\"예, 어머니.\"<br>\"오늘은 목소리가 다르구나.\" 어머니가 손을 더듬어 아들의 얼굴을 만졌습니다.",
            "옹고집이 어머니의 마른 손을 잡았습니다. 그러고는 오랫동안 아무 말도 하지 못했습니다. 손이 나뭇가지처럼 말라 있었습니다.",
            "\"어머니, 제가 잘못했습니다.\"<br>어머니는 그 말에 놀라지도 않았습니다. 다만 아들의 손등을 천천히 쓰다듬었습니다.<br>\"그 말을 하는 데 오래 걸렸구나.\"",
            "그 뒤로 옹고집은 사람이 달라졌습니다. 곳간 문에는 빗장 대신 쌀 되는 됫박을 걸어 두었고, 문 앞에 온 사람은 누구든 물 한 그릇이라도 대접해 보냈습니다. 담장도 어깨높이까지 낮추었습니다.",
            "종들에게는 새참을 내주었고, 앓는 이가 있으면 사흘씩 쉬게 했습니다. 아들은 서당에 다니게 되었습니다. 곳간 문은 사철 열려 있었습니다.",
            "그런데 옹고집은 딱 한 가지, 남들이 이상하게 여기는 버릇이 생겼습니다. 마당 한쪽에 짚단을 한 단 세워 두고 아무도 손대지 못하게 한 것입니다. 비가 오면 손수 거적을 덮어 주었습니다.",
            "누가 까닭을 물으면 옹고집은 그저 이렇게 대답했습니다.<br>\"내 스승이오.\" 그러고는 더 묻지 못하게 화제를 돌렸습니다.",
            "그리고 월출봉 취암사 지붕에는 그해 가을 새 기와가 얹혔습니다. 누가 시주했는지는 절에서도 끝내 말하지 않았다고 합니다. 다만 그해부터 취암사 마당에 쌀가마가 끊이지 않았다고 합니다."
        ]
    }
];

function makeProbe() {
    const book = document.getElementById('book');
    const holder = document.createElement('div');
    holder.style.cssText = 'position:absolute;inset:10px;visibility:hidden;pointer-events:none;z-index:-1;';
    holder.innerHTML = '<div class="page page-story"><div class="story-page-left"></div><div class="story-page-right"></div></div>';
    book.appendChild(holder);

    // 따로 만든 상자에 재면 실제 쪽과 미묘하게 어긋난다.
    // 그래서 진짜 쪽과 똑같은 칸을 하나 숨겨 두고 거기에 넣어 잰다.
    // 칸이 넘치면 scrollHeight가 칸 높이에서 잘리므로, 안에 든 것들의 높이를 직접 더한다.
    const col = holder.querySelector('.story-page-left');
    const cs = getComputedStyle(col);
    const measured = col.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);

    // 그림처럼 위쪽 여백이 음수인 것도 있으므로 위아래 여백을 다 셈한다.
    const contentHeight = () => [...col.children].reduce((h, el) => {
        const s = getComputedStyle(el);
        return h + el.getBoundingClientRect().height
            + (parseFloat(s.marginTop) || 0) + (parseFloat(s.marginBottom) || 0);
    }, 0);

    col.innerHTML = '<h2>제목</h2>';
    const headHeight = contentHeight();

    // 그림이 얹힌 쪽은 그림 높이만큼 글이 적게 들어간다. 그 높이를 미리 재 둔다.
    // 그림 파일이 없어도 자리는 같으므로, 파일이 뒤에 들어와도 쪽이 밀리지 않는다.
    col.innerHTML = '<div class="story-art-top"><div class="art-frame"></div></div>';
    const artHeight = contentHeight();
    col.innerHTML = '';

    return {
        // 창이 아직 크기를 갖지 못한 채 열리면 잰 값이 0이 된다. 그때는 어림값으로 버틴다.
        usable: measured > 40 ? measured : 620,
        headHeight: headHeight > 0 ? headHeight : 45,
        artHeight: artHeight > 40 ? artHeight : 300,
        measure(html) {
            col.innerHTML = html;
            return contentHeight();
        },
        close() { book.removeChild(holder); }
    };
}

let PROBE = null;   // 쪽을 나눌 때마다 새로 만든다

// 문단을 쪽 넘길 수 있는 조각으로 나눈다. 문장 끝과 대사 줄바꿈이 자를 수 있는 자리다.
// 낱말 뜻풀이처럼 태그로 묶인 부분 안에서는 자르지 않는다.
function splitSegments(html) {
    const tokens = html.split(/(<[^>]+>)/).filter(t => t !== '');
    const segs = [];
    let buf = '';
    let depth = 0;
    for (const tok of tokens) {
        if (tok.startsWith('<')) {
            buf += tok;
            if (/^<br\s*\/?>$/i.test(tok)) {
                if (depth === 0) { segs.push(buf); buf = ''; }
            } else if (tok.startsWith('</')) {
                depth = Math.max(0, depth - 1);
            } else if (!tok.endsWith('/>')) {
                depth++;
            }
            continue;
        }
        if (depth > 0) { buf += tok; continue; }
        // 문장이 끝나고 빈칸이 오는 자리에서 자른다
        const parts = tok.split(/(?<=[.!?"”][\s])/);
        for (let i = 0; i < parts.length; i++) {
            buf += parts[i];
            if (i < parts.length - 1) { segs.push(buf); buf = ''; }
        }
    }
    if (buf.trim() !== '') segs.push(buf);
    return segs.length ? segs : [html];
}

// 말을 바꾸면 글이 통째로 갈리므로 조각도 다시 나눈다.
function segsOf(paras) {
    const segs = [];
    paras.forEach((html, paraIdx) => {
        splitSegments(html).forEach((piece, k) => {
            segs.push({ paraIdx, html: piece, start: k === 0 });
        });
    });
    return segs;
}

let CHAPTER_SEGS = [];

// 조각 묶음을 문단 단위로 다시 묶어 화면에 그릴 모양으로 만든다.
// 앞 쪽에서 이어진 문단은 첫 줄을 들여쓰지 않는다.
function runHtml(segs, a, b) {
    let out = '';
    let i = a;
    while (i < b) {
        const pi = segs[i].paraIdx;
        let inner = '';
        const contd = !segs[i].start;
        let j = i;
        while (j < b && segs[j].paraIdx === pi) { inner += segs[j].html; j++; }
        // 대화는 줄을 바꿀 때마다 한 칸 들여 쓴다. 국어 표기 규칙이다.
        // 첫 줄만 들여쓰는 text-indent로는 안 되므로 줄 앞에 한 칸짜리 자리를 넣는다.
        // 쪽 끝에 걸린 <br>는 빈 줄만 만드니 떼어 낸다.
        inner = inner.replace(/(<br\s*\/?>)+\s*$/i, '')
            .replace(/<br\s*\/?>/gi, '<br><span class="ln"></span>');
        out += `<p${contd ? ' class="cont"' : ''} data-say="${pi}">${inner}</p>`;
        i = j;
    }
    return out;
}

// 그림은 제가 그린 장면보다 **앞에 나오면 안 된다.** 앞에 나오면 아직 읽지도
// 않은 일을 먼저 보여 주는 셈이라 김이 새고 헷갈린다. 실제로 흥부전 5장에서
// 사당패 그림이 사당패가 나오기 열일곱 쪽 전에 붙어 있었다.
// 그래서 장마다 그림 옆에 「이 장면이다」 하는 문구(artAt)를 달아 두고,
// 그 문구가 든 펼침면에 그림을 얹는다. 두 그림이 같은 쪽으로 몰리면 뒤로 민다.
function anchorSlots(segs, ranges, count, anchors, total) {
    // 1) 문구가 든 펼침면을 찾는다. 못 찾으면 예전처럼 고르게 나눈 자리.
    const at = [];
    const want = [];
    for (let k = 0; k < count; k++) {
        let found = -1;
        const a = anchors[k];
        if (a) {
            const segIdx = segs.findIndex(g => g.html.indexOf(a) >= 0);
            if (segIdx >= 0) {
                for (let p = 0; p < ranges.length; p++) {
                    if (segIdx >= ranges[p][0] && segIdx < ranges[p][1]) { found = p >> 1; break; }
                }
            }
        }
        at.push(found);
        want.push(found < 0 ? Math.min(Math.round((k * total) / count), total - 1) : found);
    }
    // 2) 앞으로 훑으며 겹치면 뒤로 민다.
    for (let k = 1; k < count; k++) {
        if (want[k] <= want[k - 1]) want[k] = want[k - 1] + 1;
    }
    // 3) 뒤로 훑으며 끝을 넘은 것을 앞으로 당긴다.
    //    이 두 번으로 자리가 반드시 서로 다르고 순서도 범위도 지켜진다.
    for (let k = count - 1; k >= 0; k--) {
        const cap = total - 1 - (count - 1 - k);
        if (want[k] > cap) want[k] = cap;
        if (k > 0 && want[k - 1] >= want[k]) want[k - 1] = want[k] - 1;
    }
    const slots = new Array(total).fill('text');
    for (let k = 0; k < count; k++) {
        if (want[k] >= 0 && want[k] < total) slots[want[k]] = 'img';
    }
    // 3)에서 앞으로 당겨진 그림이 몇인지 센다. 뒤로 밀린 것(늦음)은 괜찮지만
    // 앞으로 당겨진 것은 아직 읽지도 않은 일을 먼저 보여 주는 셈이라 안 된다.
    let early = 0;
    for (let k = 0; k < count; k++) {
        if (at[k] >= 0 && want[k] < at[k]) early++;
    }
    return { slots, early };
}

// 지금 나눠진 대로 배치가 얼마나 좋은지 점수를 매긴다. 낮을수록 좋다.
// 그림이 장면보다 **앞서는 것**이 가장 나쁘다. 그 다음이 장면에서 먼 것이다.
function anchorScore(segs, ranges, count, anchors, slots) {
    const spreadOfSeg = si => {
        for (let p = 0; p < ranges.length; p++) {
            if (si >= ranges[p][0] && si < ranges[p][1]) return p >> 1;
        }
        return -1;
    };
    const imgAt = [];
    slots.forEach((kind, s) => { if (kind === 'img') imgAt.push(s); });
    let early = 0, dist = 0;
    for (let k = 0; k < count; k++) {
        const a = anchors[k];
        const si = a ? segs.findIndex(g => g.html.indexOf(a) >= 0) : -1;
        const at = si >= 0 ? spreadOfSeg(si) : -1;
        if (at < 0 || imgAt[k] === undefined) continue;
        if (imgAt[k] < at) early++;
        dist += Math.abs(imgAt[k] - at);
    }
    return { early, dist, score: early * 1000 + dist };
}

function slotPlan(imgCount, textCount) {
    const total = imgCount + textCount;
    const slots = new Array(total).fill('text');
    for (let k = 0; k < imgCount; k++) {
        let pos = Math.min(Math.round((k * total) / imgCount), total - 1);
        while (slots[pos] === 'img') pos = (pos + 1) % total;
        slots[pos] = 'img';
    }
    return slots;
}

// 글을 쪽마다 같은 높이만큼 나눠 담는다. 마지막 쪽만 남은 만큼 담는다.
// 장 제목이 붙는 첫 쪽은 제목까지 함께 얹어서 재야 한다.
// 제목 높이를 따로 빼서 계산하면 실제로 나란히 놓였을 때의 높이와 조금씩 어긋난다.
function fillPages(segs, caps, headHtml) {
    const pageHeight = (a, b, first) => PROBE.measure((first ? headHtml : '') + runHtml(segs, a, b));
    const ranges = [];
    let i = 0;
    for (let p = 0; p < caps.length; p++) {
        const rest = caps.length - p - 1;
        if (rest === 0) { ranges.push([i, segs.length]); break; }
        // 남은 글을 남은 쪽들의 크기에 비례해 나눈다. 그래야 쪽마다 고르게 찬다.
        // 꽉꽉 채워 넘기면 장의 마지막 펼침면이 거의 비어 버린다.
        // 그림이 얹힌 쪽은 담을 수 있는 높이가 작으므로 그만큼 적게 가져간다.
        const remainingH = pageHeight(i, segs.length, p === 0);
        let capSum = 0, capRest = 0;
        for (let q = p; q < caps.length; q++) capSum += caps[q];
        for (let q = p + 1; q < caps.length; q++) capRest += caps[q];
        // 뒤쪽 쪽들에 남은 글이 다 안 들어가면 이번 쪽이 그만큼 더 가져가야 한다.
        const share = remainingH * caps[p] / capSum;
        const room = Math.min(caps[p], Math.max(remainingH - capRest, share));
        const maxTake = Math.max(1, segs.length - i - rest);
        let take = 1;
        let lo = 1, hi = maxTake;
        while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (pageHeight(i, i + mid, p === 0) <= room) { take = mid; lo = mid + 1; }
            else { hi = mid - 1; }
        }
        ranges.push([i, i + take]);
        i += take;
    }

    // 조각 단위로 끊다 보면 마지막 쪽에 넘치는 만큼이 남을 수 있다.
    // 뒤에서부터 훑어, 넘치는 쪽의 앞머리를 한 조각씩 앞 쪽으로 밀어 준다.
    for (let p = caps.length - 1; p > 0; p--) {
        while (ranges[p][1] - ranges[p][0] > 1 &&
               pageHeight(ranges[p][0], ranges[p][1], false) > caps[p]) {
            const prev = ranges[p - 1];
            if (pageHeight(prev[0], prev[1] + 1, p - 1 === 0) > caps[p - 1]) break;
            prev[1]++;
            ranges[p][0]++;
        }
    }
    return ranges;
}

// 그림 자리가 안 맞을 때 펼침면을 몇 장까지 늘려 볼지. 늘리면 책이 성겨진다.
const GROW_LIMIT = 1;

function paginateChapter(ch, chIndex) {
    const segs = CHAPTER_SEGS[chIndex];
    const arts = (ch.art && ch.art.length) ? ch.art : [];
    const { usable, headHeight, artHeight } = PROBE;
    const headHtml = `<h2>${CHAPTER_LABEL(ch.num)}${ch.title}</h2>`;
    const totalH = PROBE.measure(runHtml(segs, 0, segs.length));

    // 그림이 얹힌 쪽에도 그 아래에 글이 들어간다. 그래서 담을 수 있는 높이가 쪽마다 다르다.
    const underArt = Math.max(60, usable - artHeight);
    const capsOf = slots => {
        const caps = [];
        slots.forEach(kind => { caps.push(usable); caps.push(kind === 'img' ? underArt : usable); });
        return caps;
    };

    // 그림 한 장이 펼침면 하나를 쓴다. 거기서 시작해 글이 다 들어갈 때까지 펼침면을 늘린다.
    // 쪽 수는 조각 수를 넘을 수 없다 — 빈 쪽이 생기면 안 되기 때문이다.
    const minSpreads = Math.max(arts.length, 1);
    const maxSpreads = Math.max(minSpreads, Math.floor(segs.length / 2));
    let spreadCount = minSpreads;
    while (spreadCount < maxSpreads) {
        const caps = capsOf(slotPlan(arts.length, spreadCount - arts.length));
        if (caps.reduce((a, b) => a + b, 0) >= totalH + headHeight) break;
        spreadCount++;
    }

    const anchors = (ch.artAt && ch.artAt.length === arts.length) ? ch.artAt : null;
    let tries = 0;
    let slots = slotPlan(arts.length, Math.max(0, spreadCount - arts.length));
    let caps = capsOf(slots);
    let ranges = fillPages(segs, caps, headHtml);
    let grows = 0;
    let best = null;
    for (let guard = 0; guard < 40; guard++) {
        // 한 쪽이라도 넘치면 펼침면을 늘려 다시 나눈다.
        // 마지막 쪽만 보면 안 된다 — 첫 쪽에는 장 제목이 얹히므로 그쪽이 먼저 넘칠 수 있다.
        // 여유를 1px이나 두면 안 된다. 0.8px만 넘쳐도 그 칸에 스크롤 막대가 생기고,
        // 막대가 칸을 15px 좁히면 글이 다시 길어져 넘침이 32px로 불어난다.
        const over = ranges.some(([a, b], n) =>
            PROBE.measure((n === 0 ? headHtml : '') + runHtml(segs, a, b)) > caps[n] + 0.25);

        // 넘치지 않는 배치는 점수를 매겨 둔다. 되풀이가 두 자리를 오갈 때
        // 하필 나쁜 쪽에서 멈추는 일이 있어서, 끝나면 가장 좋았던 것으로 돌아간다.
        if (!over && anchors) {
            const sc = anchorScore(segs, ranges, arts.length, anchors, slots);
            if (!best || sc.score < best.score) {
                best = {
                    score: sc.score, slots: slots.slice(), caps: caps.slice(),
                    ranges: ranges.map(r => r.slice()), spreadCount
                };
            }
        }

        // 그림을 제 장면이 있는 쪽으로 옮긴다. 옮기면 글 나눔이 달라지므로
        // 자리가 더 안 움직일 때까지 되풀이한다.
        if (anchors && tries < 10) {
            const plan = anchorSlots(segs, ranges, arts.length, anchors, spreadCount);
            // 닻 둘이 같은 펼침면을 원하는데 뒤에 자리가 없으면 앞엣것이
            // 앞으로 당겨진다. 당기는 대신 펼침면을 한 장 늘려 자리를 만든다.
            // 그러면 글이 조금 성겨지지만, 그림이 장면보다 먼저 나오지는 않는다.
            if (plan.early > 0 && grows < GROW_LIMIT && spreadCount < maxSpreads) {
                grows++;
                spreadCount++;
                tries = 0;
                slots = slotPlan(arts.length, Math.max(0, spreadCount - arts.length));
                caps = capsOf(slots);
                ranges = fillPages(segs, caps, headHtml);
                continue;
            }
            if (plan.slots.join() !== slots.join()) {
                tries++;
                slots = plan.slots;
                caps = capsOf(slots);
                ranges = fillPages(segs, caps, headHtml);
                continue;
            }
        }
        if (!over || spreadCount >= maxSpreads) break;
        spreadCount++;
        tries = 0;
        slots = slotPlan(arts.length, Math.max(0, spreadCount - arts.length));
        caps = capsOf(slots);
        ranges = fillPages(segs, caps, headHtml);
    }

    // 오가는 동안 가장 좋았던 배치로 돌아간다.
    if (best) {
        slots = best.slots;
        caps = best.caps;
        ranges = best.ranges;
        spreadCount = best.spreadCount;
    }

    const spreads = [];
    let pageIdx = 0;
    let artIdx = 0;
    slots.forEach((kind, s) => {
        const left = ranges[pageIdx++];
        const right = ranges[pageIdx++];
        spreads.push({
            kind: 'chapter', ch, chIndex, first: s === 0,
            art: kind === 'img' ? arts[artIdx++] : null, left, right
        });
    });
    return spreads;
}
const COVER = {
    emoji: '🌾',
    title: '옹고집전',
    intro: [
        "옹고집전은 지은이가 알려지지 않은 조선 후기 소설이에요. 원래는 판소리로 불리던 것이 글로 옮겨진 것이랍니다.",
        "판소리 열두 마당 가운데 하나였지만 노래로 부르는 법은 끊기고 글만 남았어요. 이렇게 사설만 남은 판소리를 실전 판소리라고 부른답니다.",
        "고집이 세고 남의 말을 듣지 않는 사람을 옹고집이라 부르는 말이 여기서 나왔어요. 사람 이름이 그대로 낱말이 된 드문 경우지요.",
        "어느 날 옹고집 앞에 얼굴도 목소리도 똑같은 옹고집이 하나 더 나타나요. 둘 가운데 누가 진짜일까요? 그리고 또 하나의 옹고집은 어디서 왔을까요?"
    ]
};

/* ── 그리기 ───────────────────────────────────────── */

function artFrame(src, emoji) {
    return `
        <div class="art-frame">
            <img src="images/${src}" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="art-fallback" style="display:none">${emoji}</div>
        </div>`;
}

function coverPage() {
    const c = CV();
    return `
        <div class="page page-cover">
            <div class="story-page-left story-page-left-full">
                ${artFrame('cover.webp', c.emoji)}
            </div>
            <div class="story-page-right">
                <h1 data-say="0">${c.title}</h1>
                ${c.intro.map((p, i) => `<p data-say="${i + 1}">${p}</p>`).join('')}
            </div>
        </div>`;
}

function tocPage(part) {
    // 한 편으로 이어지는 이야기라 차례는 장 번호와 제목만 둔다.
    // 줄거리 한 줄을 붙이면 차례가 두 펼침면으로 늘어나고, 앞으로 읽을 대목을 미리 알려 주는 셈도 된다.
    // 쪽수는 화면 아래에 뜨는 그 번호(FOLIOS)를 그대로 가져다 쓴다.
    const folioOf = idx => (idx >= 0 ? FOLIOS[idx].start : '');
    const pageOfChapter = num => folioOf(PAGES.findIndex(p => p.kind === 'chapter' && p.first && p.ch.num === num));
    const pageOfKind = kind => folioOf(PAGES.findIndex(p => p.kind === kind && p.first !== false));
    const rowHtml = (attr, mark, title, page) => `
        <li>
            <button type="button" ${attr}>
                <span class="toc-num">${mark}</span>
                <span>
                    <strong>${title}</strong>
                    <small>${page}${T().folio}</small>
                </span>
            </button>
        </li>`;
    const itemHtml = ch => rowHtml(`data-goto="${ch.num}"`, ch.num, ch.title, pageOfChapter(ch.num));
    const extraItems = [
        rowHtml('data-goto-kind="quiz"', '❓', T().quiz, pageOfKind('quiz')),
        rowHtml('data-goto-kind="after"', '📖', T().after, pageOfKind('after')),
    ];
    const group = TOC_GROUPS[part];
    const last = part === TOC_GROUPS.length - 1;
    const items = group.map(itemHtml).concat(last ? extraItems : []);
    const half = Math.ceil(items.length / 2);
    return `
        <div class="page page-toc">
            <div class="story-page-left">
                ${part === 0 ? `<h2>${T().toc}</h2>` : ''}
                <ul class="toc-list">${items.slice(0, half).join('')}</ul>
            </div>
            <div class="story-page-right">
                ${part === 0 ? `<h2 class="toc-h2-ghost" aria-hidden="true">${T().toc}</h2>` : ''}
                <ul class="toc-list">${items.slice(half).join('')}</ul>
            </div>
        </div>`;
}

// 한 펼침면에 담을 수 있는 차례 항목은 여덟 개까지다. 그보다 많으면 차례도 여러 쪽이 된다.
const TOC_PER_SPREAD = 16;
let TOC_GROUPS = [];

function chapterSpreadPage(spread) {
    const ch = spread.ch;
    const segs = CHAPTER_SEGS[spread.chIndex];
    const head = spread.first ? `<h2>${CHAPTER_LABEL(ch.num)}${ch.title}</h2>` : '';

    if (spread.art) {
        return `
            <div class="page page-story">
                <div class="story-page-left">
                    ${head}
                    ${runHtml(segs, spread.left[0], spread.left[1])}
                </div>
                <div class="story-page-right story-page-right-image">
                    <div class="story-art-top">${artFrame(spread.art, ch.emoji)}</div>
                    ${runHtml(segs, spread.right[0], spread.right[1])}
                </div>
            </div>`;
    }

    return `
        <div class="page page-story">
            <div class="story-page-left">
                ${head}
                ${runHtml(segs, spread.left[0], spread.left[1])}
            </div>
            <div class="story-page-right story-page-right-text">
                ${runHtml(segs, spread.right[0], spread.right[1])}
            </div>
        </div>`;
}

const QUIZ = [
    { q: "옹고집은 어떤 사람이었습니까?", choices: ["가난한데 마음이 넉넉한 사람", "재물이 많은데 몹시 인색한 사람", "글은 많이 읽었으나 겁이 많은 사람"], answer: 1 },
    { q: "옹고집이 어머니를 어떻게 모셨습니까?", choices: ["불도 안 땐 방에 두었다", "의원을 불러 돌보게 했다", "날마다 문안을 드렸다"], answer: 0 },
    { q: "시주를 청하러 온 스님에게 옹고집은 무엇을 했습니까?", choices: ["매질하여 내쫓았다", "쌀 한 되를 주었다", "그냥 못 본 척했다"], answer: 0 },
    { q: "취암사 노승은 무엇으로 가짜 옹고집을 만들었습니까?", choices: ["나무를 깎은 인형", "흙으로 빚은 사람", "짚으로 엮은 허수아비"], answer: 2 },
    { q: "식구들이 두 옹고집을 가리지 못한 까닭은 무엇입니까?", choices: ["생김새가 털끝 하나까지 같아서", "둘 다 얼굴을 가리고 있어서", "날이 너무 어두워서"], answer: 0 },
    { q: "고을 원님은 무엇으로 진짜를 가리려 했습니까?", choices: ["글씨를 똑같이 써 보게 해서", "집안 살림을 물어서", "서로 힘을 겨루어 보게 해서"], answer: 1 },
    { q: "재판에서 진짜 옹고집이 진 까닭은 무엇입니까?", choices: ["제 살림을 도무지 몰라서", "겁이 나서 말을 더듬어서", "편들어 줄 증인이 없어서"], answer: 0 },
    { q: "집에서 쫓겨난 옹고집은 어떻게 되었습니까?", choices: ["관가에 붙들려 갇혔다", "산속 절로 들어갔다", "빌어먹으며 떠돌았다"], answer: 2 },
    { q: "옹고집이 남의 집 문간에서 깨달은 것은 무엇입니까?", choices: ["제가 스님을 그렇게 내쫓았다는 것", "제 집이 세상에서 제일 좋다는 것", "재물이 다 헛된 것이라는 것"], answer: 0 },
    { q: "노승이 옹고집에게 준 것은 무엇입니까?", choices: ["쌀 한 자루", "지팡이 하나", "부적 한 장"], answer: 2 },
    { q: "부적을 던지자 가짜 옹고집은 어떻게 되었습니까?", choices: ["짚단으로 변해 흩어졌다", "빗장을 걸고 달아났다", "곳간으로 몸을 숨겼다"], answer: 0 },
    { q: "집에 돌아온 옹고집이 가장 먼저 한 일은 무엇입니까?", choices: ["곳간부터 열어 살펴보았다", "뒤꼍에서 장작을 안고 왔다", "종들을 마당에 불러 모았다"], answer: 1 },
    {
        q: "이 책을 읽고 난 반응으로 알맞지 않은 것은 무엇인가요?",
        wide: true,
        choices: [
            "제 살림을 몰라 재판에서 진 것을 보면, 가진 것이 많아도 아는 것이 없으면 제 것이 아니구나.",
            "쫓겨나 빌어먹으며 떠돌고서야 스님 생각이 난 것을 보면, 겪어 봐야 아는 일이 있네.",
            "짚으로 엮은 허수아비가 사람 노릇을 그대로 한 것을 보면, 남이 보는 나는 껍데기로도 되는 거야.",
            "돌아온 옹고집이 곳간부터 열어 살펴본 것을 보면, 그래도 살림 걱정이 먼저였겠다."
        ],
        answer: 3
    }
];

// 선지를 세로로 쌓으니 한 쪽에 열여섯 문항이 다 들어가지 않는다. 몇 개씩 나눠 싣는다.
// 문제는 한 쪽에 다 넣고 스크롤해서 푼다.
// 쪽을 쪼개 놓으면 쪽마다 절반이 비고, 답을 고르려고 여러 번 넘겨야 한다.
const QUIZ_GROUPS = [{ from: 0 }];

// 쪽을 넘겼다 돌아와도 이미 푼 문항은 풀린 채로 있어야 한다.
const QUIZ_PICKED = new Array(QUIZ.length).fill(null);
/* 여태 골라 본 틀린 보기. 쪽을 오가도 빨갛게 남는다. */
const QUIZ_WRONG = QUIZ.map(() => new Set());

/* 보기는 책을 열 때마다 자리를 바꾼다. 답의 자리를 외워 버리면 문제가 아니게 된다.
   섞는 것은 그리는 차례뿐이고, 채점은 data-choice 에 담긴 원래 번호로 한다.
   한 번 정한 차례는 책을 닫을 때까지 그대로다. 쪽을 오갈 때마다 바뀌면 헷갈린다. */
function shuffledOrder(n) {
    const a = [...Array(n).keys()];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/* 보기 차례는 한글 문항 수로 정한다. 영어판도 보기 개수가 같고,
   QZ 는 이 줄보다 아래에서 만들어져 여기서 부르면 책이 열리지 않는다. */
const QUIZ_ORDER = QUIZ.map(q => shuffledOrder(q.choices.length));

function quizPage(part) {
    const group = { from: QUIZ_GROUPS[part].from, items: QZ() };
    const done = QUIZ_PICKED.filter(v => v !== null).length;
    const items = group.items.map((item, k) => {
        const i = group.from + k;
        const picked = QUIZ_PICKED[i];
        const graded = picked !== null;
        const cls = ci => (graded && ci === item.answer) ? ' correct'
            : (QUIZ_WRONG[i].has(ci) ? ' incorrect' : '');
        return `
        <div class="quiz-item${graded ? ' graded' : ''}" data-qindex="${i}">
            <p class="quiz-question">${i + 1}. ${item.q}</p>
            <div class="quiz-choices${item.wide ? ' quiz-choices-stack' : ''}">
                ${QUIZ_ORDER[i].map(ci => `<button type="button" class="quiz-choice${cls(ci)}" data-choice="${ci}">${item.choices[ci]}</button>`).join('')}
            </div>
        </div>`;
    }).join('');
    return `
        <div class="page page-quiz">
            ${part === 0 ? `<h2>${T().quiz}</h2>` : ''}
            <p class="quiz-intro-text" id="quizProgress">${T().done(done, QZ().length)}</p>
            <div class="quiz-list">${items}</div>
        </div>`;
}

/* 읽고 나서 — 장과 같은 방식으로 쪽을 나눈다. 그림은 오른쪽 위에 얹힌다. */
const AFTERWORD = {
    title: '읽고 나서',
    emoji: '🌾',
    art: ['end.webp'],
    paras: [
        `이 이야기는 조금 특별한 자리에 있습니다. 판소리로 부르던 이야기였는데 지금은 소리가 전하지 않습니다.`,
        `판소리는 원래 열두 마당이었다고 합니다. 그 가운데 지금까지 소리로 남은 것은 다섯입니다. 춘향가, 심청가, 흥보가, 수궁가, 적벽가. 나머지 일곱은 부르는 사람이 끊겨 가락이 사라졌습니다. 「옹고집타령」이 그 일곱 가운데 하나입니다.`,
        `그래서 우리는 이 이야기를 노래로는 들을 수 없고 글로만 읽습니다. 어느 대목에서 소리꾼이 목청을 높였는지, 어느 대목에서 사람들이 웃었는지는 이제 알 수 없습니다.`,
        `진짜와 가짜가 나타나 서로 자기가 진짜라고 다투는 이야기는 우리나라에 여럿 있습니다. 손톱을 아무 데나 버렸더니 쥐가 그것을 먹고 사람으로 변해 주인 자리를 차지했다는 이야기가 가장 널리 알려져 있습니다. 옹고집 이야기는 그 틀에 절과 스님을 얹은 것입니다.`,
        `짚 인형은 원래 액운을 대신 지고 가는 것이었습니다. 정월에 만들어 길에 버렸지요. 그러니 이 이야기를 듣던 사람들에게 짚으로 만든 사람은 낯선 것이 아니었습니다. 낯선 것은 그것이 하는 일이었습니다.`,
        `그런데 이 이야기는 그 짚 인형을 아주 다르게 씁니다. 액운을 대신 지고 가는 것이 아니라 주인 자리를 대신 차지합니다. 그리고 더 놀라운 것은, 그 가짜가 진짜보다 살림을 잘하고 사람 대접도 잘한다는 것입니다.`,
        `거기가 이 이야기의 핵심입니다. 가짜가 더 나았습니다. 식구들이 가짜를 고른 것은 눈이 어두워서가 아닙니다. 그편이 함께 살기에 나았기 때문입니다. 옹고집이 쫓겨난 진짜 까닭은 얼굴이 같은 자가 나타나서가 아니라, 그가 없어도 되는 사람이었기 때문입니다.`,
        `관가에서 진짜를 가려내는 대목도 다시 볼 만합니다. 곳간 살림과 종의 이름과 어머니 밥상을 묻습니다. 그런데 짚으로 만든 쪽이 다 압니다. 나를 나이게 하는 것이 무엇인지 묻는 대목입니다. 아는 것으로도, 생김새로도 가려지지 않았습니다.`,
        `옹고집이 저지른 일 가운데 이야기가 가장 무겁게 다룬 것은 재물을 아낀 것이 아닙니다. 문 앞에 온 사람을 그냥 돌려보낸 것입니다. 노모를 찬 방에 둔 것이고, 종에게 새참을 주지 않은 것입니다. 인색함이 아니라 남을 사람으로 여기지 않은 것을 벌한 이야기입니다.`,
        `이 이야기가 불교 이야기의 옷을 입고 있는 것도 그래서입니다. 절에서 온 스님을 문전박대하는 데서 일이 시작되고, 절의 스님이 벌을 거두는 데서 끝납니다. 조선 시대에 절은 스님을 낮추어 보는 세상에서 겨우 버티고 있었습니다. 이런 이야기는 그런 자리에서 나옵니다.`,
        `벌을 주는 방식도 눈여겨보십시오. 때리지 않았습니다. 가두지도 않았습니다. 제 집에서 제 발로 걸어 나가게 만들고, 밖에서 남의 문 앞에 서 보게 했습니다. 제가 남에게 한 일을 그대로 당하게 한 것입니다.`,
        `마지막에 옹고집이 짚단을 세워 두고 스승이라 부른 대목이 이 이야기의 끝맺음입니다. 가짜였던 것을 스승이라 부르는 사람이 되었다면, 그 사람은 정말로 달라진 것입니다.`,
        `식구들이 가짜를 고른 것은 잘못한 일일까요? 진짜를 알아보지 못한 셈입니다. 그런데 가짜 쪽이 더 잘해 주었습니다. 함께 사는 사람을 고를 때 무엇이 더 중요한지 말해 보십시오.`,
        `옹고집이 달라진 것은 뉘우쳐서일까요, 무서워서일까요? 빌어먹고 다니는 동안 겪은 일 때문에 달라졌다면, 그것도 뉘우친 것이라고 할 수 있을까요.`,
        `스님은 옹고집을 벌할 권한이 있었을까요? 문전박대를 당한 것은 사실이지만, 남의 집을 통째로 빼앗고 사람을 길바닥에 내앉힌 것도 사실입니다. 벌이 잘못보다 커도 되는지 생각해 보십시오.`
    ]
};

let AFTER_SEGS = [];

const AFTER_FOOT = () => `<p class="after-home"><a class="home-btn" href="../../../../../">${T().home}</a></p>`;

function paginateAfterword() {
    const segs = AFTER_SEGS;
    const arts = AF().art || [];
    const { usable, headHeight, artHeight } = PROBE;
    const headHtml = `<h2>${AF().title}</h2>`;
    const totalH = PROBE.measure(runHtml(segs, 0, segs.length));

    const underArt = Math.max(60, usable - artHeight);

    // 맨 끝에는 학습 허브로 가는 단추가 붙는다. 그 높이를 미리 빼 두지 않으면
    // 마지막 쪽만 넘친다.
    const footH = PROBE.measure(AFTER_FOOT());

    const capsOf = slots => {
        const caps = [];
        slots.forEach(kind => { caps.push(usable); caps.push(kind === 'img' ? underArt : usable); });
        caps[caps.length - 1] = Math.max(60, caps[caps.length - 1] - footH);
        return caps;
    };

    const minSpreads = Math.max(arts.length, 1);
    const maxSpreads = Math.max(minSpreads, Math.floor(segs.length / 2));
    let spreadCount = minSpreads;
    while (spreadCount < maxSpreads) {
        const caps = capsOf(slotPlan(arts.length, spreadCount - arts.length));
        if (caps.reduce((a, b) => a + b, 0) >= totalH + headHeight) break;
        spreadCount++;
    }

    let slots = slotPlan(arts.length, Math.max(0, spreadCount - arts.length));
    let caps = capsOf(slots);
    let ranges = fillPages(segs, caps, headHtml);
    for (let guard = 0; guard < 8; guard++) {
        const over = ranges.some(([a, b], n) =>
            PROBE.measure((n === 0 ? headHtml : '') + runHtml(segs, a, b)) > caps[n] + 0.25);
        if (!over || spreadCount >= maxSpreads) break;
        spreadCount++;
        slots = slotPlan(arts.length, Math.max(0, spreadCount - arts.length));
        caps = capsOf(slots);
        ranges = fillPages(segs, caps, headHtml);
    }

    const spreads = [];
    let pageIdx = 0;
    let artIdx = 0;
    slots.forEach((kind, s) => {
        const left = ranges[pageIdx++];
        const right = ranges[pageIdx++];
        spreads.push({
            kind: 'after', first: s === 0, last: s === slots.length - 1,
            art: kind === 'img' ? arts[artIdx++] : null, left, right
        });
    });
    return spreads;
}

function afterSpreadPage(spread) {
    const segs = AFTER_SEGS;
    const head = spread.first ? `<h2>${AF().title}</h2>` : '';
    // 학습 허브로 돌아가는 길은 맨 끝에 한 번만 둔다.
    const foot = spread.last ? AFTER_FOOT() : '';

    if (spread.art) {
        return `
            <div class="page page-story page-after">
                <div class="story-page-left">
                    ${head}
                    ${runHtml(segs, spread.left[0], spread.left[1])}
                </div>
                <div class="story-page-right story-page-right-image">
                    <div class="story-art-top">${artFrame(spread.art, AF().emoji)}</div>
                    ${runHtml(segs, spread.right[0], spread.right[1])}
                    ${foot}
                </div>
            </div>`;
    }

    return `
        <div class="page page-story page-after">
            <div class="story-page-left">
                ${head}
                ${runHtml(segs, spread.left[0], spread.left[1])}
            </div>
            <div class="story-page-right story-page-right-text">
                ${runHtml(segs, spread.right[0], spread.right[1])}
                ${foot}
            </div>
        </div>`;
}


/* ── 영어판 ────────────────────────────────────────────────────
   우리말 글과 영어 글을 나란히 두고, 단추 하나로 갈아 끼운다.
   쪽은 재어서 나누므로 말을 바꾸면 처음부터 다시 나눈다. */
/* 영어판 — 줄 단위 번역이 아니라 영어로 다시 썼다.
   읽기를 앞세운다. 줄임말을 쓰고, 옛 관용구는 쉬운 말로 바꾼다.
   artAt 닻은 영어 문장 조각으로 새로 잡았다. */
const EN = {
    lang: 'en',
    cover: {
        emoji: '🌾',
        title: 'The Tale of Onggojip',
        intro: [
            "The Tale of Onggojip is an old Korean story with no known author. It was once sung as pansori, but that song has been lost.",
            "Only five of the twelve pansori pieces are still sung. This is one of the seven whose music is gone.",
            "One day a second Onggojip turns up, and both swear they are the real one. Which is it?",
            "Onggojip means a stubborn man of the Ong family. The name says what he is before the story starts."
        ]
    },
    chapters: [
        {
            num: 1,
            title: "Onggojip of Ongdang Village",
            art: ["story-01-a.webp", "story-01-b.webp", "story-01-c.webp"],
            artAt: ["six storehouses", "How many measures", "no fire was lit in that room"],
            paras: [
                "Long ago, in a village called Ongdang in the district of Ongjin, there lived a man called Onggojip. There was no richer man in that district. It took a good while just to walk from his gate to his storehouses. He had a hundred plots of paddy and twice as much dry field, and six storehouses.",
                "But the man was worth less than his money. Or rather, the more the money grew the less the man was. His hands got quicker at counting coins and his eyes got dimmer at seeing people.",
                "Onggojip never gave anybody anything. Rice could rot in his storehouse and he would not lend one measure to a starving neighbour. If it spoiled, he threw it into the stream instead. He watched the white grains float away down the stream without blinking.<br>\"Better thrown away than given. Give once and they keep coming back.\"",
                "He worked his servants from before dawn until night. And he grudged them even a bowl at their midday break and had water brought instead. The backs of their hands were cracked in every season. If one of them fell ill, far from getting medicine, his food was stopped first.<br>\"Why should food go into a mouth that isn't working?\" At mealtimes the servants glanced at one another and picked up nothing but their water bowls.",
                "If a traveller asked for one night's lodging, he came out with a club. If a beggar stood at the gate, he set the dogs on him. The dogs of Ongdang were raised to bite people. Among travellers, Ongdang was known as a village to walk straight past.",
                "When people from the village had to pass Onggojip's house they went the long way round on purpose.<br>\"They say it's bad luck to walk under that wall.\"<br>\"What use is a rich house that not one grain of rice comes out of?\" They told the children not to play in front of it either.",
                "It was not that Onggojip was ashamed. The more people spoke ill of him, the more he took it as proof he was doing well. In fact he was quietly proud of the talk.<br>\"If I were soft like that lot, would I have put this much by?\"",
                "Onggojip had a wife and a son and a daughter. But there was no laughter inside the house either. The children stopped in the middle of a sentence at the sound of their father coming into the yard. It was because a second helping at the table got them a hard look.",
                "If his wife ever tried to send rice to her own family, he fetched the scales first.<br>\"How many measures are you sending? Count them before you send them.\"",
                "When his son said he wanted to go to the village school, he snorted.<br>\"Does reading books put rice on the table, or cake? Go and water the paddies in that time.\" After that his son never mentioned school again.",
                "So Onggojip's storehouses swelled year by year. And the wall round that house grew higher year by year. The higher the wall grew, the quieter it was inside.",
                "But inside that high wall, in the furthest corner room of the inner house, Onggojip's old mother lay. It was a room that did not get a hand's breadth of sunlight all day.",
                "Onggojip's mother was over eighty. For some years now her legs had failed and she only lay there. When she was young she had raised Onggojip by taking in sewing.",
                "And no fire was lit in that room even in the depth of winter.<br>\"What does someone who only lies there want with firewood? Let her pull up a quilt.\" Even the servants walked faster when they passed that door.",
                "Her meals went in twice a day. Cold rice and one small dish of soy sauce, and that was all. A servant set it down and came out and that was the end of it. There was no soup. In summer the rice sometimes went in already sour.",
                "One night his mother coughed badly. His wife spoke carefully to Onggojip.<br>\"Mother has been coughing all night. Shall I call the doctor?\"",
                "Onggojip did not lift his eyes from his ledger.<br>\"Do you know what a doctor costs? That is what old age is.\" Every coin spent that day was written in that ledger.",
                "\"Then at least a fire in her room...\"<br>\"You are talkative today.\"",
                "The next morning his mother called her son. Onggojip went into the room unwillingly. His breath showed white. The air in the room was colder than the air outside.",
                "\"My son.\"<br>\"What is it?\"<br>\"I am sorry I have lived so long.\" Her voice was as thin as wind.",
                "For a moment Onggojip had nothing to say. But then he answered shortly,<br>\"What a thing to say.\" And he quickly changed the subject.",
                "\"I ask only one thing of you. Do not send away a person who comes to your gate. Give them a bowl of water at least. Your father lived so.\" When she had said it she lay getting her breath for a long time.",
                "Onggojip left the room without answering. His hand was a little slow closing the door, and he did not notice it. Then out in the yard he called a servant and scolded him.<br>\"Who lit a warming fire in my mother's room! It's more than I can bear.\"",
                "The servant hesitated.<br>\"Nobody lit one, sir.\"<br>\"Then why was the chimney warm this morning?\"<br>\"That would be the kitchen fire coming through the wall, sir.\"<br>Onggojip told them to halve the kitchen fire as well. That night his mother's room was colder than the night before."
            ]
        },
        {
            num: 2,
            title: "Turned from the Gate, and the Night at Chwiamsa",
            art: ["story-02-a.webp", "story-02-b.webp", "story-02-c.webp"],
            artAt: ["The club came down on the monk's shoulder", "began to weave the straw", "went down the mountain"],
            paras: [
                "It was the autumn of that year. A monk came down from Chwiamsa temple on Wolchulbong to Ongdang village to ask for alms<span class=\"gloss\">(rice or money given to a temple)</span>. There was already frost on the mountain.",
                "The monk went round the village striking his wooden gong. People gave him a handful of rice, as much as they could. In poor houses they gave a handful of barley and said they were sorry. Whether he was given much or little the monk bowed just the same.",
                "Last of all the monk stood in front of Onggojip's house. The wall was so high that you could hardly see the roof. The monk struck his gong. There was no sound at all from inside.",
                "After a long while the gate opened and Onggojip came out. He looked the monk up and down and asked straight out,<br>\"What do you want?\" There was not a trace of welcome in his voice.<br>\"This poor monk comes from Chwiamsa on Wolchulbong. The temple is old and we mean to mend the roof, so I ask for a little alms.\"",
                "Onggojip snorted.<br>\"If the temple is old, let the monks mend it. Why go round begging other men's rice?\" Inside the gate a dog began to bark.",
                "\"We are carrying the timber ourselves. Only we have no money for tiles...\"<br>\"Then don't put tiles on it. Cover it with straw.\" Onggojip was already closing the gate.",
                "The monk did not lose his temper.<br>\"I hear you have six storehouses. One measure of rice and this poor monk will go away.\" The monk's voice was still low and calm.",
                "At that Onggojip's face went red.<br>\"So you have been counting my storehouses! This fellow has come to rob me, that's plain!\" He spat as he spoke.",
                "Onggojip picked up a club from the yard. The servants had no time to stop him. Nor did they dare to stand in his way.",
                "\"You dog of a monk!\"<br>The club came down on the monk's shoulder. The monk staggered back. The dull sound went over the wall and into the lane. The wooden gong fell and rolled away on the ground.",
                "Onggojip crushed that gong under his foot, took the monk's pack<span class=\"gloss\">(the bag a monk carries on his back)</span> and threw it over the wall.<br>\"Come again and I'll set the dogs on you!\" The alms rice spilled out of the pack and mixed with the dirt.",
                "The monk stood a long while, covered in dirt. Then he picked up the broken pieces of the gong one by one, and quietly put his palms together toward Onggojip.<br>\"A guest will come to your house before long.\"<br>He said only that and went up the mountain. The hands picking up the pieces shook a little.",
                "That night the monks of Chwiamsa sat together. There was a livid mark on the shoulder of the monk who had been beaten. He winced with every breath, as if the shoulder caught.",
                "\"Let us report it to the town office.\"<br>\"Reporting it will do no good. They say that man drinks with the magistrate.\" A heaviness settled over the temple.",
                "The young monks raised their voices.<br>\"A man like that needs a fright.\"<br>\"We should put a fire in his storehouse...\" For once the temple was loud.",
                "Then the oldest monk in the temple opened his eyes. He had been sitting a long time without a word.<br>\"Set a fire and the servants of that house burn first.\"",
                "The monks fell silent. The old monk went on.<br>\"And burning his goods only makes him grieve for his goods. He will never once see his own wrong.\" The young monks looked at one another.",
                "\"Then what shall we do?\"<br>\"Let him go through, himself, exactly what he has done to others.\" The old monk's voice never rose at all.",
                "The old monk went down to the yard and brought back an armful of straw. And then he began to weave the straw, all through the night. Nobody dared ask what he meant by it; they only watched.",
                "Arms appeared, and legs, and a body. Last of all he rolled straw into a ball and set it on for a head, and there was a straw figure the size of a man. His hands moved so fast that the straw seemed to weave itself.",
                "The old monk took a brush and wrote on a sheet of yellow paper. Then he stuck that charm on the figure's forehead. The ink was not even dry.",
                "The old monk murmured something low, and the straw of the figure turned softly into skin and its eyes opened. The charm on its forehead sank in and disappeared. The lamp in the room swayed once, hard.",
                "The thing made of straw sat up. Its face was not a hair's breadth different from Onggojip's. One young monk stepped backward without knowing he did. Even its breathing was the same as Onggojip's.",
                "\"Go down,\" said the old monk. His voice was low but it rang clearly through the room. \"Only, do not harm anyone. Keep the house, open the storehouses, and look after the old woman in it. That is your work.\"<br>The false Onggojip bowed his head and went down the mountain."
            ]
        },
        {
            num: 3,
            title: "Another Onggojip",
            art: ["story-03-a.webp", "story-03-b.webp", "story-03-c.webp"],
            artAt: ["wearing his clothes and walking his walk", "His wife came running out", "The magistrate looked at the two of them"],
            paras: [
                "It was the middle of the next day. Onggojip was in his study looking over his ledger. Then there was a commotion in the yard. He heard servants running across it.",
                "\"The master is coming in!\"<br>Onggojip lifted his head. He wondered what they meant. He had been sitting in this room since morning. The brush stopped on the page.",
                "The moment he opened the door and looked out into the yard, Onggojip froze where he stood. The brush fell out of his hand onto the floor.",
                "There was a man wearing his clothes and walking his walk, coming in at the gate. The face and the height and the voice were all his own. Even the mole at the end of the left eyebrow was the same. Even the way he walked was Onggojip's.",
                "\"You, you dog! Who are you!\"<br>Onggojip ran out in his stocking feet. He could not even get his shoes on properly.",
                "The false Onggojip turned round slowly. And then he asked back, perfectly calm,<br>\"That is a question I should be asking. Who are you, who have come into another man's house and put on another man's clothes?\" There was not a trace of surprise or alarm in him.",
                "\"What! This house is mine!\"<br>\"This house is mine.\" The two voices came together so that you could not tell which was which.",
                "The servants gathered, one by one. They looked from one to the other and did not know what to do.<br>\"Which one is our master...\"<br>\"It might be this one, or it might be that one.\" Not one of them would go to either side.",
                "His wife came running out. Onggojip was delighted.<br>\"Wife! Which one is me! Say it!\" His wife's hand had a tight hold of her apron.",
                "His wife stood between the two of them and studied them a long while. She looked at their faces, at their hands, and listened to their voices. Then she went white and stepped backward.<br>\"...I don't know.\" She very nearly sat down where she stood.",
                "His son came. His daughter came. Not one of them could tell. They were a family that had lived thirty years in one house.",
                "Onggojip stamped his foot.<br>\"Look at my face! Can you not know the face of a man you have lived with for thirty years!\"<br>The false Onggojip said quietly,<br>\"It is not that they cannot know your face. It is that there is nothing about you they know except your face.\" At that the real Onggojip had nothing to say.",
                "Since it could not be settled in the house, the two Onggojips went to the town office. The whole village came along to watch. The yard of the office filled until there was no room to put a foot down.",
                "The magistrate looked at the two of them and rubbed his eyes several times.<br>\"Well. I have never seen the like of this in my life.\" He looked from one to the other and put his fan to his forehead.",
                "The magistrate asked,<br>\"Are you Onggojip?\"<br>\"I am.\" The two of them answered at the same moment. Even the voices were the same. The magistrate cleared his throat.",
                "The magistrate thought for a long time and then struck his knee.<br>\"Good. If we cannot tell by the face, let us tell by the household. The man who knows his own house is the master of it.\" The crowd held its breath.",
                "The magistrate asked first,<br>\"How many storehouses have you, and how much of what is in them?\" The clerk took up his brush to write it down.",
                "The real Onggojip answered at once.<br>\"Six storehouses, sir, and in them three hundred sacks of rice and a hundred of barley.\"<br>The false Onggojip shook his head.<br>\"Six storehouses is right, but the fifth one leaked last summer and half of it spoiled. There are two hundred and forty sacks of rice now, and after sorting out the spoiled grain I gave twenty sacks to the village.\"",
                "The people watching began to murmur. One of the villagers called out,<br>\"That's true, sir! We had rice from him last month!\" Heads nodded here and there.",
                "The real Onggojip's face went white. He had never ordered any such thing. That the storehouse had leaked, and that rice had been given away, were both news to him.",
                "The magistrate asked again,<br>\"How many servants are in your house? Name them.\"<br>The real Onggojip mumbled.<br>\"Twelve, no, about fourteen, sir, and the names... Dolsoe, and Samwol, and...\"<br>There he stuck. Sweat stood on his forehead.",
                "The false Onggojip named all fourteen without missing one. He added their ages and their home villages and their ailments.<br>\"Makdong hurt his left shoulder and cannot carry heavy loads, so I have moved him to kitchen work.\" Nobody could have known it in such detail.",
                "Last of all the magistrate asked,<br>\"And what is your mother eating?\" The yard went as quiet as if water had been thrown over it.",
                "The real Onggojip could not open his mouth. He had never once seen what went onto his mother's tray.<br>The false Onggojip answered,<br>\"Her teeth are bad, so we send in a soft porridge. And a warming fire has been lit in her room these three days.\" The magistrate nodded slowly."
            ]
        },
        {
            num: 4,
            title: "Driven Out and Begging",
            art: ["story-04-a.webp", "story-04-b.webp", "story-04-c.webp"],
            artAt: ["threw him down in the road", "curled up under the eaves", "looked down at his own house"],
            paras: [
                "The magistrate gave his judgement.<br>\"This one is the true Onggojip. The other has tried to take another man's house. Beat him and drive him out of this district.\" There was not the least hesitation in the magistrate's voice.",
                "\"No! I am Onggojip! I am!\"<br>The real Onggojip struggled. But the runners had him by both arms. The more he shouted the more the people pitied him.",
                "Onggojip was beaten in the yard of the town office. All his life he had raised a stick at others and had never been struck himself. He could not even count the strokes.",
                "When the beating was over the runners dragged him to the edge of the district and threw him down in the road.<br>\"Set foot in this district again and next time you go to prison.\" The runners went back without looking round.",
                "For a long time Onggojip could not get up. People passing by glanced at him and walked on. They were the faces that used to bow and scrape in front of his storehouses. Among them were villagers he knew by sight, and not one of them helped him up.",
                "When the sun went down it turned cold. Onggojip walked with a limp. He had nowhere to go. The wind came straight through his clothes.",
                "He knocked at the first house.<br>\"Let me sleep here one night.\"<br>An answer came from inside.<br>\"We have no room either.\" And there was lamplight coming through the crack of the door.",
                "At the second house they did not even open the door. At the third they set the dogs on him. Onggojip was chased by the dogs and rolled down a paddy bank. His clothes were thick with dirt.",
                "That night Onggojip slept curled up under the eaves of somebody's barn. His teeth chattered all night. It was the first time he had known that one wisp of straw could be so warm.",
                "When he opened his eyes at dawn his whole body was frozen. He had no feeling in his fingers. He tried to stand and his legs would not obey him.",
                "In that moment his mother's room came into his mind. That room with no fire in it in the depth of winter. An old woman past eighty who had got through year after year with one quilt.",
                "Onggojip stayed curled under the eaves and could not move for a long time. Only then did he begin to see what kind of nights his mother had passed in that room.",
                "From then on Onggojip wandered from village to village. His clothes wore out and his shoes fell apart until his feet showed through. When he gave his name nobody believed him.",
                "When he was too hungry to bear it he stood at somebody's gate and held out his hand. At first he would rather have died than do it. It took three days without food before the hand went out by itself. Whenever he held it out he bowed his head.",
                "At some houses they wrapped up a lump of rice for him. At some they slammed the door. At some they threw water over him. He went through all three.",
                "Turning away with the water running off him, Onggojip thought it for the first time.<br>'I did that.' The water dripped from his clothes.",
                "He had never given one bowl of water to a person at his gate. He had set the dogs on them and picked up a club. Those people must have gone three days without food, just as he had now. And those people must have had mothers too.",
                "Winter came. Onggojip limped along the snowy roads. His toes froze and went numb. He wrapped rags round his feet instead of straw shoes.",
                "Once he stood outside the wall of a house where there was a feast, smelling the food, and a servant of that house drove him off. The servant pushed him and said,<br>\"Get away. It's bad luck on a feast day.\" Inside the wall the laughing did not stop.",
                "Onggojip stepped back without a word in reply. Once he would have picked up a club. Now he had no club and no strength. That night he stood outside the wall and listened to the laughter all night.",
                "Then one day Onggojip's feet turned toward his own district. He went even knowing that if he entered it he would be put in prison. He only wanted to know whether his mother was still alive.",
                "In the night he climbed the hill behind the village and looked down at his own house. It was bright inside the wall. Seen from far off, his house was very large.",
                "And astonishingly, there was light coming from the corner room of the inner house. Smoke went straight up from the chimney. It was his mother's room. He had never seen a fire in that room.",
                "Onggojip sat down where he was. The one who had lit that fire was a thing made of straw, and the one who had stopped it was her son. Onggojip covered his face with his sleeve. And he sat there the whole night."
            ]
        },
        {
            num: 5,
            title: "The Old Monk in the Snow",
            art: ["story-05-a.webp", "story-05-b.webp", "story-05-c.webp"],
            artAt: ["crossing a snow-covered mountain path", "took a rice ball out of his robe", "stood in front of his own gate"],
            paras: [
                "That winter was unusually long. Onggojip was crossing a snow-covered mountain path when he went down. The snow was up to his knees and it was hard to take one step.",
                "He had gone days without food, and his feet were frozen, and he could go no further. The snow settled on his face. His body seemed to be growing warmer. He did not know that this was the more dangerous thing.",
                "'So it ends here.'<br>Onggojip closed his eyes. Strangely, he did not feel wronged. He did not miss the money or the house at all. Only one thing weighed on him.",
                "It was that he had never once said sorry to his mother. That one thing kept coming up before his eyes.",
                "How long it was he did not know. Someone shook his shoulder.<br>\"Get up.\"",
                "Onggojip barely opened his eyes. On the white snow stood an old monk in a grey robe. There was a staff in his hand. Through the falling snow only the sound of the staff came clearly.",
                "The old monk took a rice ball out of his robe and put it into Onggojip's hand. Onggojip ate it in a rush. When something warm went down his throat the tears came. Only when he had finished did his throat close up.",
                "\"Reverend... why would you do this for such a one as me...\"<br>\"Does giving food to a man fallen in the road need a reason?\" The old monk sat down beside him.",
                "Onggojip could not lift his head at that. All his life he had asked for reasons. Before he gave anyone anything he had reckoned first whether it would come back. If nothing would come back, he did not give.",
                "\"Reverend, I am a man who deserves punishment. I once beat a monk from a temple with a club and drove him away.\" Having said it, he felt lighter.<br>\"I know.\"",
                "Onggojip looked up in surprise. There was not the least anger in the old monk's face. It was rather the face of someone who had waited a long time.",
                "\"It has taken one whole winter for you to say that yourself.\"<br>The old monk took a sheet of yellow paper out of his robe. It was a charm.<br>\"Go home. And throw this at him.\" He cupped it in his hand so the snow would not wet it.",
                "\"Reverend, who on earth is that man?\"<br>The old monk said it plainly.<br>\"He is woven out of straw. He is only playing at being a person on the strength of one charm.\"",
                "Onggojip's eyes went wide.<br>\"Straw? And that thing rules my house and looks after my family...\"<br>\"Yes. What a thing of straw does, you did not do for thirty years.\" Onggojip could not lift his head.",
                "Those words hurt worse than the club. Onggojip took the charm in both hands. One sheet of paper had never been so heavy.",
                "\"Reverend, one thing more. I am afraid that when I go home I shall go back to what I was. Does a person change so easily?\"",
                "The old monk smiled for the first time.<br>\"That you have learned to be afraid of it is the change.\" And then he took his staff and stood up.",
                "When Onggojip raised his head the old monk was already gone. There were only a few marks of a staff on the snow. Even those were covered over and gone in a moment.",
                "Onggojip went down the mountain. His feet were blistered but he walked faster than before. It was because now he had somewhere to go.",
                "When he reached the edge of the district he stopped for a moment. If the runners caught him he would go to prison. Still he did not turn back.",
                "Onggojip walked in by the main road. He did not want to creep in. He walked with his head up.",
                "The villagers knew him and whispered. But strangely, nobody called the runners. It was Onggojip who was surprised. An old man came up and asked,<br>\"Had a hard time of it, begging?\"<br>Onggojip nodded.<br>\"Yes. A hard time.\"",
                "The old man clicked his tongue.<br>\"All the same, that house has become a house people live in. He opened the storehouses and got us through the winter. My grandchild lived on that house's rice.\" The old man's eyes were wet.",
                "Onggojip could make no answer to that. And then he stood in front of his own gate. The wall was as high as ever. But the gate was open."
            ]
        },
        {
            num: 6,
            title: "Back to Straw",
            art: ["story-06-a.webp", "story-06-b.webp", "story-06-c.webp"],
            artAt: ["The servants were at work in the yard", "And then he threw the charm", "knelt in front of his mother"],
            paras: [
                "It was a gate that had always been barred before. The bar had been taken right out and stood against the wall.",
                "The servants were at work in the yard. But there were bowls set out for their midday break, and there was laughter. In the old days it could never have happened.",
                "Somebody knew Onggojip and shouted,<br>\"Oh, the master has come again!\" The servants left their work and came crowding out.",
                "The false Onggojip walked out of the inner house. The two of them stood face to face in the middle of the yard. Only their clothes were different; the face was still one face.",
                "The family came crowding out. His wife came, and his son, and his daughter. This time too, nobody could tell which was the real one. Only, one was in silk and one was in rags.",
                "But this time Onggojip did not argue it either. He took the charm out of his coat. He had no wish at all to argue.",
                "\"I have not come to insist that I am the master of this house.\"<br>The false Onggojip looked at him quietly.<br>\"Then what have you come for?\" There was neither anger nor welcome in his voice.",
                "\"I have come to say thank you.\"<br>The yard went silent. Something moved for a moment in the false Onggojip's eyes.",
                "\"What I did not do in thirty years, you have done in half a year. You lit the fire in my mother's room and you opened the storehouses. There is no way for me to repay it.\" His throat kept closing as he spoke.",
                "Onggojip held the charm up in both hands. His hands were shaking.<br>\"Only, from now on I will do it.\" His wife started to say something and shut her mouth.",
                "And then he threw the charm. The moment it touched the false Onggojip's chest, the man's body sank softly down. The false Onggojip did not move aside.",
                "The clothes collapsed empty, and dry straw came pouring out of them. One gust of wind went through and a few wisps of straw lifted over the yard. What had been a man a moment before was a handful of straw.",
                "The family cried out and stepped back. Only Onggojip knelt down in front of that heap of straw. And he took up a handful and held it to his chest. There seemed still to be a person's warmth left in it.",
                "Onggojip got to his feet. His family stood round him not knowing what to do. Nobody would speak first.",
                "But Onggojip did not go to the storehouses or to his study. He went round to the back and came out with an armful of firewood. It was heavy and he had to shift it in his arms several times.",
                "\"Master, let a servant do that.\"<br>\"I will do it.\"",
                "Onggojip crouched at the stove mouth of his mother's room and lit the fire. It was the first time in his life he had done it, and it only made bitter smoke. His eyes stung and watered. Onggojip wiped his eyes with his sleeve and kept pushing the fire in. The servants watched him from a distance.",
                "At last the fire caught and the smoke went straight up from the chimney. The floor of the room began, little by little, to grow warm.",
                "Onggojip opened the door, went in and knelt in front of his mother. Her eyes were too dim to know her son's face. For the first time in a long while the room was warm.",
                "\"Is it my son?\"<br>\"Yes, mother.\"<br>\"Your voice is different today.\" His mother felt for his face with her hand.",
                "Onggojip took his mother's dry hand. And for a long time he could not say anything. The hand was dry as a twig.",
                "\"Mother, I have done wrong.\"<br>His mother was not even surprised. She only stroked the back of his hand slowly.<br>\"It has taken you a long time to say it.\"",
                "After that Onggojip was a changed man. He hung a measuring cup on the storehouse door instead of a bar, and anyone who came to his gate was given at least a bowl of water. He had the wall lowered to shoulder height as well.",
                "He gave the servants their midday break, and if one of them was ill he let him rest three days. His son went to the village school. The storehouse door stood open in every season.",
                "But Onggojip did get one habit that people thought strange. He stood a bundle of straw at one side of the yard and let nobody touch it. When it rained he covered it with a mat himself.",
                "If anyone asked why, Onggojip only answered,<br>\"He is my teacher.\" And then he changed the subject so they could not ask again.",
                "And that autumn new tiles went onto the roof of Chwiamsa on Wolchulbong. Who gave for them, they say, the temple never told. Only, from that year on there was never a time when sacks of rice were not standing in the temple yard."
            ]
        }
    ],
    /* 단어장 — 그림책은 펼침면마다 묶지만, 소설은 장마다 묶는다.
       쪽은 재어서 나누므로 미리 알 수 없기 때문이다.
       화면에는 그 쪽에 실제로 나온 낱말만 골라 보여 준다(vocabFor). */
    words: {
        "cover": [
            { w: "with no known author", k: "지은이가 알려지지 않은", s: "an old Korean story with no known author" },
            { w: "has been lost (lose)", k: "전하지 않는다", s: "but that song has been lost" },
            { w: "are still sung (sing)", k: "아직 불린다", s: "Only five of the twelve pansori pieces are still sung" },
            { w: "turns up (turn up)", k: "나타난다", s: "One day a second Onggojip turns up" },
            { w: "swear (swear)", k: "맹세하듯 우긴다", s: "both swear they are the real one" },
            { w: "stubborn", k: "고집 센", s: "Onggojip means a stubborn man of the Ong family" }
        ],
        "ch1": [
            { w: "was worth less than ~ (be worth)", k: "~만 못했다", s: "But the man was worth less than his money" },
            { w: "the more ~ the less ...", k: "~할수록 …해졌다", s: "the more the money grew the less the man was" },
            { w: "dimmer (dim)", k: "흐려진", s: "his eyes got dimmer at seeing people" },
            { w: "lend one measure (lend)", k: "한 되를 꾸어 주다", s: "would not lend one measure to a starving neighbour" },
            { w: "without blinking (blink)", k: "눈 하나 깜짝 않고", s: "He watched the white grains float away down the stream without blinking" },
            { w: "grudged (grudge)", k: "아까워했다", s: "he grudged them even a bowl at their midday break" },
            { w: "cracked (crack)", k: "갈라졌다", s: "The backs of their hands were cracked in every season" },
            { w: "far from ~ing", k: "~하기는커녕", s: "far from getting medicine, his food was stopped first" },
            { w: "lodging", k: "잠자리", s: "If a traveller asked for one night's lodging" },
            { w: "set the dogs on ~ (set)", k: "개를 풀었다", s: "he set the dogs on him" },
            { w: "walk straight past", k: "그냥 지나치다", s: "Ongdang was known as a village to walk straight past" },
            { w: "the long way round", k: "먼 길로 돌아서", s: "they went the long way round on purpose" },
            { w: "spoke ill of ~ (speak ill)", k: "흉을 보았다", s: "The more people spoke ill of him" },
            { w: "took it as proof (take)", k: "증거로 여겼다", s: "the more he took it as proof he was doing well" },
            { w: "put by (put by)", k: "모아 두다", s: "would I have put this much by" },
            { w: "a hard look", k: "눈총", s: "a second helping at the table got them a hard look" },
            { w: "scales", k: "저울", s: "he fetched the scales first" },
            { w: "snorted (snort)", k: "코웃음을 쳤다", s: "he snorted" },
            { w: "swelled (swell)", k: "불어났다", s: "Onggojip's storehouses swelled year by year" },
            { w: "her legs had failed (fail)", k: "다리를 못 쓰게 되었다", s: "For some years now her legs had failed" },
            { w: "taking in sewing (take in)", k: "삯바느질을 하며", s: "she had raised Onggojip by taking in sewing" },
            { w: "in the depth of winter", k: "한겨울에도", s: "no fire was lit in that room even in the depth of winter" },
            { w: "pull up a quilt (pull up)", k: "이불을 덮다", s: "Let her pull up a quilt" },
            { w: "went in already sour (go in)", k: "쉰 채로 들어갔다", s: "In summer the rice sometimes went in already sour" },
            { w: "did not lift his eyes (lift)", k: "눈도 떼지 않았다", s: "Onggojip did not lift his eyes from his ledger" },
            { w: "That is what old age is", k: "늙으면 다 그런 것이다", s: "That is what old age is" },
            { w: "talkative", k: "말이 많은", s: "You are talkative today" },
            { w: "unwillingly", k: "마지못해", s: "Onggojip went into the room unwillingly" },
            { w: "as thin as wind", k: "바람처럼 가는", s: "Her voice was as thin as wind" },
            { w: "changed the subject (change)", k: "화제를 돌렸다", s: "And he quickly changed the subject" },
            { w: "Do not send away ~ (send away)", k: "그냥 돌려보내지 마라", s: "Do not send away a person who comes to your gate" },
            { w: "getting her breath (get)", k: "숨을 고르며", s: "she lay getting her breath for a long time" },
            { w: "scolded (scold)", k: "야단을 쳤다", s: "he called a servant and scolded him" },
            { w: "hesitated (hesitate)", k: "우물쭈물했다", s: "The servant hesitated" },
            { w: "halve (halve)", k: "반으로 줄이다", s: "Onggojip told them to halve the kitchen fire as well" }
        ],
        "ch2": [
            { w: "alms", k: "시주", s: "to ask for alms" },
            { w: "frost", k: "서리", s: "There was already frost on the mountain" },
            { w: "wooden gong", k: "목탁", s: "The monk went round the village striking his wooden gong" },
            { w: "as much as they could", k: "형편대로", s: "People gave him a handful of rice, as much as they could" },
            { w: "just the same", k: "똑같이", s: "the monk bowed just the same" },
            { w: "you could hardly see ~", k: "보이지 않을 지경이었다", s: "The wall was so high that you could hardly see the roof" },
            { w: "looked ~ up and down (look up and down)", k: "위아래로 훑어보았다", s: "He looked the monk up and down" },
            { w: "not a trace of welcome", k: "반가운 기색 하나 없이", s: "There was not a trace of welcome in his voice" },
            { w: "mend (mend)", k: "고치다", s: "The temple is old and we mean to mend the roof" },
            { w: "go round begging (go round)", k: "얻으러 다니다", s: "Why go round begging other men's rice" },
            { w: "did not lose his temper (lose one's temper)", k: "화를 내지 않았다", s: "The monk did not lose his temper" },
            { w: "go away (go away)", k: "물러가다", s: "One measure of rice and this poor monk will go away" },
            { w: "spat (spit)", k: "침이 튀었다", s: "He spat as he spoke" },
            { w: "had no time to ~ (have time)", k: "~할 새도 없었다", s: "The servants had no time to stop him" },
            { w: "did not dare (dare)", k: "감히 ~하지 못했다", s: "Nor did they dare to stand in his way" },
            { w: "came down on ~ (come down)", k: "후려쳤다", s: "The club came down on the monk's shoulder" },
            { w: "staggered back (stagger)", k: "비틀거리며 물러섰다", s: "The monk staggered back" },
            { w: "dull sound", k: "둔탁한 소리", s: "The dull sound went over the wall" },
            { w: "crushed ~ under his foot (crush)", k: "발로 밟아 부수었다", s: "Onggojip crushed that gong under his foot" },
            { w: "spilled out (spill out)", k: "쏟아졌다", s: "The alms rice spilled out of the pack" },
            { w: "put his palms together (put together)", k: "합장했다", s: "quietly put his palms together toward Onggojip" },
            { w: "before long", k: "곧", s: "A guest will come to your house before long" },
            { w: "livid", k: "시퍼런", s: "There was a livid mark on the shoulder" },
            { w: "winced (wince)", k: "얼굴을 찡그렸다", s: "He winced with every breath" },
            { w: "will do no good", k: "소용없다", s: "Reporting it will do no good" },
            { w: "settled over ~ (settle)", k: "무겁게 가라앉았다", s: "A heaviness settled over the temple" },
            { w: "needs a fright", k: "혼쭐이 나야 한다", s: "A man like that needs a fright" },
            { w: "burn first (burn)", k: "먼저 탄다", s: "Set a fire and the servants of that house burn first" },
            { w: "grieve for ~ (grieve)", k: "아까워하다", s: "burning his goods only makes him grieve for his goods" },
            { w: "go through ~ (go through)", k: "겪다", s: "Let him go through, himself, exactly what he has done to others" },
            { w: "an armful of ~", k: "한 아름의", s: "brought back an armful of straw" },
            { w: "weave (weave)", k: "엮다", s: "he began to weave the straw" },
            { w: "seemed to weave itself", k: "저절로 엮이는 것 같았다", s: "the straw seemed to weave itself" },
            { w: "charm", k: "부적", s: "Then he stuck that charm on the figure's forehead" },
            { w: "murmured (murmur)", k: "낮게 읊조렸다", s: "The old monk murmured something low" },
            { w: "sank in (sink in)", k: "스며들었다", s: "The charm on its forehead sank in and disappeared" },
            { w: "not a hair's breadth", k: "털끝 하나도", s: "Its face was not a hair's breadth different from Onggojip's" },
            { w: "look after ~ (look after)", k: "잘 모시다", s: "and look after the old woman in it" }
        ],
        "ch3": [
            { w: "commotion", k: "소란", s: "Then there was a commotion in the yard" },
            { w: "froze (freeze)", k: "얼어붙었다", s: "Onggojip froze where he stood" },
            { w: "mole", k: "점", s: "Even the mole at the end of the left eyebrow was the same" },
            { w: "in his stocking feet", k: "버선발로", s: "Onggojip ran out in his stocking feet" },
            { w: "perfectly calm", k: "아주 태연하게", s: "he asked back, perfectly calm" },
            { w: "came together (come together)", k: "겹쳤다", s: "The two voices came together" },
            { w: "which was which", k: "어느 쪽인지", s: "so that you could not tell which was which" },
            { w: "would go to either side", k: "어느 한쪽으로도 가지 못했다", s: "Not one of them would go to either side" },
            { w: "was delighted (delight)", k: "반색을 했다", s: "Onggojip was delighted" },
            { w: "studied (study)", k: "살폈다", s: "studied them a long while" },
            { w: "went white (go white)", k: "새파랗게 질렸다", s: "Then she went white and stepped backward" },
            { w: "very nearly ~", k: "~할 뻔했다", s: "She very nearly sat down where she stood" },
            { w: "stamped his foot (stamp)", k: "발을 굴렀다", s: "Onggojip stamped his foot" },
            { w: "except your face", k: "얼굴 말고는", s: "there is nothing about you they know except your face" },
            { w: "could not be settled (settle)", k: "결판이 나지 않았다", s: "Since it could not be settled in the house" },
            { w: "no room to put a foot down (put)", k: "발 디딜 틈 없이", s: "until there was no room to put a foot down" },
            { w: "rubbed his eyes (rub)", k: "눈을 비볐다", s: "rubbed his eyes several times" },
            { w: "the like of this", k: "이런 일", s: "I have never seen the like of this in my life" },
            { w: "cleared his throat (clear)", k: "헛기침을 했다", s: "The magistrate cleared his throat" },
            { w: "struck his knee (strike)", k: "무릎을 쳤다", s: "thought for a long time and then struck his knee" },
            { w: "held its breath (hold one's breath)", k: "숨을 죽였다", s: "The crowd held its breath" },
            { w: "spoiled (spoil)", k: "상했다", s: "the fifth one leaked last summer and half of it spoiled" },
            { w: "sorting out ~ (sort out)", k: "골라내며", s: "after sorting out the spoiled grain" },
            { w: "murmur (murmur)", k: "웅성거리다", s: "The people watching began to murmur" },
            { w: "were both news to him", k: "처음 듣는 이야기였다", s: "were both news to him" },
            { w: "mumbled (mumble)", k: "우물거렸다", s: "The real Onggojip mumbled" },
            { w: "he stuck (stick)", k: "말이 막혔다", s: "There he stuck" },
            { w: "without missing one (miss)", k: "하나도 빠짐없이", s: "named all fourteen without missing one" },
            { w: "ailment", k: "병", s: "He added their ages and their home villages and their ailments" },
            { w: "in such detail", k: "그렇게 소상히", s: "Nobody could have known it in such detail" },
            { w: "went onto ~'s tray (go)", k: "밥상에 올랐다", s: "He had never once seen what went onto his mother's tray" },
            { w: "a warming fire", k: "군불", s: "a warming fire has been lit in her room these three days" }
        ],
        "ch4": [
            { w: "gave his judgement (give)", k: "판결을 내렸다", s: "The magistrate gave his judgement" },
            { w: "not the least hesitation", k: "조금도 망설임 없이", s: "There was not the least hesitation in the magistrate's voice" },
            { w: "struggled (struggle)", k: "발버둥을 쳤다", s: "The real Onggojip struggled" },
            { w: "the more ~ the more ...", k: "~할수록 …했다", s: "The more he shouted the more the people pitied him" },
            { w: "count the strokes (count)", k: "매를 세다", s: "He could not even count the strokes" },
            { w: "threw him down (throw down)", k: "길바닥에 던졌다", s: "threw him down in the road" },
            { w: "bow and scrape", k: "굽신거리다", s: "the faces that used to bow and scrape in front of his storehouses" },
            { w: "helped him up (help up)", k: "부축했다", s: "not one of them helped him up" },
            { w: "with a limp", k: "다리를 절며", s: "Onggojip walked with a limp" },
            { w: "came straight through ~ (come through)", k: "그대로 파고들었다", s: "The wind came straight through his clothes" },
            { w: "knocked at ~ (knock)", k: "문을 두드렸다", s: "He knocked at the first house" },
            { w: "rolled down ~ (roll down)", k: "굴러떨어졌다", s: "Onggojip was chased by the dogs and rolled down a paddy bank" },
            { w: "curled up (curl up)", k: "웅크렸다", s: "Onggojip slept curled up under the eaves of somebody's barn" },
            { w: "chattered (chatter)", k: "딱딱 부딪쳤다", s: "His teeth chattered all night" },
            { w: "a wisp of straw", k: "짚 한 오라기", s: "one wisp of straw could be so warm" },
            { w: "would not obey him (obey)", k: "말을 듣지 않았다", s: "his legs would not obey him" },
            { w: "came into his mind (come)", k: "떠올랐다", s: "his mother's room came into his mind" },
            { w: "get through ~ (get through)", k: "나다, 견디다", s: "who had got through year after year with one quilt" },
            { w: "wandered (wander)", k: "떠돌았다", s: "Onggojip wandered from village to village" },
            { w: "wore out (wear out)", k: "해졌다", s: "His clothes wore out" },
            { w: "would rather have died", k: "죽기보다 싫었다", s: "At first he would rather have died than do it" },
            { w: "by itself", k: "저절로", s: "before the hand went out by itself" },
            { w: "slammed the door (slam)", k: "문을 쾅 닫았다", s: "At some they slammed the door" },
            { w: "threw water over ~ (throw)", k: "물을 끼얹었다", s: "At some they threw water over him" },
            { w: "went numb (go numb)", k: "감각이 없어졌다", s: "His toes froze and went numb" },
            { w: "wrapped rags round ~ (wrap)", k: "천을 감았다", s: "He wrapped rags round his feet" },
            { w: "drove him off (drive off)", k: "쫓아냈다", s: "a servant of that house drove him off" },
            { w: "It's bad luck", k: "재수 없다", s: "It's bad luck on a feast day" },
            { w: "without a word in reply", k: "대꾸도 못 하고", s: "Onggojip stepped back without a word in reply" },
            { w: "even knowing that ~", k: "~인 줄 알면서도", s: "He went even knowing that if he entered it he would be put in prison" },
            { w: "looked down at ~ (look down)", k: "내려다보았다", s: "looked down at his own house" },
            { w: "astonishingly", k: "놀랍게도", s: "And astonishingly, there was light coming from the corner room" },
            { w: "covered his face (cover)", k: "얼굴을 감쌌다", s: "Onggojip covered his face with his sleeve" }
        ],
        "ch5": [
            { w: "unusually long", k: "유난히 긴", s: "That winter was unusually long" },
            { w: "went down (go down)", k: "쓰러졌다", s: "crossing a snow-covered mountain path when he went down" },
            { w: "settled on ~ (settle)", k: "내려앉았다", s: "The snow settled on his face" },
            { w: "the more dangerous thing", k: "더 위험한 것", s: "He did not know that this was the more dangerous thing" },
            { w: "did not feel wronged (feel)", k: "억울하지 않았다", s: "he did not feel wronged" },
            { w: "weighed on ~ (weigh)", k: "마음에 걸렸다", s: "Only one thing weighed on him" },
            { w: "kept coming up (come up)", k: "자꾸 어른거렸다", s: "That one thing kept coming up before his eyes" },
            { w: "shook his shoulder (shake)", k: "어깨를 흔들었다", s: "Someone shook his shoulder" },
            { w: "barely opened (open)", k: "겨우 떴다", s: "Onggojip barely opened his eyes" },
            { w: "staff", k: "지팡이", s: "There was a staff in his hand" },
            { w: "rice ball", k: "주먹밥", s: "took a rice ball out of his robe" },
            { w: "in a rush", k: "허겁지겁", s: "Onggojip ate it in a rush" },
            { w: "his throat close up (close up)", k: "목이 메다", s: "Only when he had finished did his throat close up" },
            { w: "need a reason", k: "까닭이 필요하다", s: "Does giving food to a man fallen in the road need a reason" },
            { w: "reckoned (reckon)", k: "셈했다", s: "he had reckoned first whether it would come back" },
            { w: "deserves punishment (deserve)", k: "벌을 받아 마땅하다", s: "I am a man who deserves punishment" },
            { w: "felt lighter (feel)", k: "속이 후련했다", s: "Having said it, he felt lighter" },
            { w: "not the least anger", k: "성난 기색이 조금도 없는", s: "There was not the least anger in the old monk's face" },
            { w: "one whole winter", k: "겨울 하나", s: "It has taken one whole winter for you to say that yourself" },
            { w: "cupped ~ in his hand (cup)", k: "손으로 감쌌다", s: "He cupped it in his hand so the snow would not wet it" },
            { w: "playing at being ~ (play)", k: "~ 노릇을 하는", s: "He is only playing at being a person" },
            { w: "on the strength of ~", k: "~ 하나로", s: "on the strength of one charm" },
            { w: "hurt worse than ~ (hurt)", k: "~보다 아팠다", s: "Those words hurt worse than the club" },
            { w: "had never been so heavy", k: "그렇게 무거울 수 없었다", s: "One sheet of paper had never been so heavy" },
            { w: "go back to what I was", k: "예전으로 돌아가다", s: "I shall go back to what I was" },
            { w: "so easily", k: "그렇게 쉽게", s: "Does a person change so easily" },
            { w: "smiled for the first time (smile)", k: "처음으로 웃었다", s: "The old monk smiled for the first time" },
            { w: "be afraid of it (be afraid)", k: "그것을 두려워하다", s: "That you have learned to be afraid of it is the change" },
            { w: "were covered over (cover over)", k: "눈에 덮였다", s: "Even those were covered over and gone in a moment" },
            { w: "blistered (blister)", k: "부르텄다", s: "His feet were blistered" },
            { w: "somewhere to go", k: "가야 할 데", s: "It was because now he had somewhere to go" },
            { w: "did not turn back (turn back)", k: "발길을 돌리지 않았다", s: "Still he did not turn back" },
            { w: "creep in (creep)", k: "숨어 들어가다", s: "He did not want to creep in" },
            { w: "whispered (whisper)", k: "수군거렸다", s: "The villagers knew him and whispered" },
            { w: "clicked his tongue (click)", k: "혀를 찼다", s: "The old man clicked his tongue" },
            { w: "got us through ~ (get through)", k: "겨울을 나게 해 주었다", s: "He opened the storehouses and got us through the winter" }
        ],
        "ch6": [
            { w: "was always barred (bar)", k: "늘 빗장이 걸려 있었다", s: "It was a gate that had always been barred before" },
            { w: "at work (be at work)", k: "일하고 있는", s: "The servants were at work in the yard" },
            { w: "midday break", k: "새참", s: "there were bowls set out for their midday break" },
            { w: "could never have happened (happen)", k: "있을 수 없는 일이었다", s: "In the old days it could never have happened" },
            { w: "came crowding out (crowd)", k: "몰려나왔다", s: "The servants left their work and came crowding out" },
            { w: "face to face", k: "마주 서서", s: "The two of them stood face to face" },
            { w: "in rags", k: "누더기 차림으로", s: "one was in silk and one was in rags" },
            { w: "insist that ~ (insist)", k: "우기다", s: "I have not come to insist that I am the master of this house" },
            { w: "neither ~ nor ...", k: "~도 …도 아닌", s: "There was neither anger nor welcome in his voice" },
            { w: "say thank you", k: "고맙다는 말을 하다", s: "I have come to say thank you" },
            { w: "in half a year", k: "반년 만에", s: "you have done in half a year" },
            { w: "no way to repay it (repay)", k: "갚을 길이 없다", s: "There is no way for me to repay it" },
            { w: "from now on", k: "이제부터는", s: "Only, from now on I will do it" },
            { w: "sank softly down (sink)", k: "스르르 무너져 내렸다", s: "the man's body sank softly down" },
            { w: "did not move aside (move aside)", k: "피하지 않았다", s: "The false Onggojip did not move aside" },
            { w: "collapsed empty (collapse)", k: "힘없이 주저앉았다", s: "The clothes collapsed empty" },
            { w: "a gust of wind", k: "한 줄기 바람", s: "One gust of wind went through" },
            { w: "a handful of straw", k: "한 줌 짚", s: "was a handful of straw" },
            { w: "held it to his chest (hold)", k: "가슴에 안았다", s: "took up a handful and held it to his chest" },
            { w: "would speak first (speak)", k: "먼저 입을 열었다", s: "Nobody would speak first" },
            { w: "shift ~ in his arms (shift)", k: "고쳐 안다", s: "he had to shift it in his arms several times" },
            { w: "crouched (crouch)", k: "쪼그리고 앉았다", s: "Onggojip crouched at the stove mouth" },
            { w: "bitter smoke", k: "매캐한 연기", s: "it only made bitter smoke" },
            { w: "stung and watered (sting)", k: "시리고 눈물이 났다", s: "His eyes stung and watered" },
            { w: "the fire caught (catch)", k: "불길이 잡혔다", s: "At last the fire caught" },
            { w: "too dim to ~ (dim)", k: "눈이 어두워 ~하지 못하다", s: "Her eyes were too dim to know her son's face" },
            { w: "felt for ~ (feel for)", k: "손으로 더듬었다", s: "His mother felt for his face with her hand" },
            { w: "stroked (stroke)", k: "쓰다듬었다", s: "She only stroked the back of his hand slowly" },
            { w: "a changed man", k: "달라진 사람", s: "After that Onggojip was a changed man" },
            { w: "measuring cup", k: "됫박", s: "He hung a measuring cup on the storehouse door" },
            { w: "shoulder height", k: "어깨높이", s: "He had the wall lowered to shoulder height as well" },
            { w: "let nobody touch ~ (let)", k: "아무도 손대지 못하게 했다", s: "and let nobody touch it" },
            { w: "so they could not ask again", k: "더 묻지 못하게", s: "so they could not ask again" },
            { w: "never told (tell)", k: "끝내 말하지 않았다", s: "the temple never told" }
        ],
        "after": [
            { w: "stands in ~ (stand)", k: "~에 놓여 있다", s: "This story stands in a rather unusual place" },
            { w: "died out (die out)", k: "끊겼다", s: "the singers died out and the music was lost" },
            { w: "no longer know (know)", k: "이제 알 수 없다", s: "we can no longer know" },
            { w: "nail clippings", k: "손톱 조각", s: "a man throws his nail clippings away" },
            { w: "takes his place (take)", k: "주인 자리를 차지하다", s: "turns into him and takes his place" },
            { w: "sets ~ on top of ... (set)", k: "~을 …에 얹다", s: "sets a temple and a monk on top of that frame" },
            { w: "carried ~ away (carry away)", k: "대신 지고 갔다", s: "something that carried a person's bad luck away for them" },
            { w: "runs the house (run)", k: "살림을 다스리다", s: "the false one runs the house better than the real one" },
            { w: "the heart of ~", k: "~의 핵심", s: "That is the heart of this story" },
            { w: "better to live with", k: "함께 살기에 나은", s: "because he was better to live with" },
            { w: "could do without (do without)", k: "없어도 되는", s: "he was a man they could do without" },
            { w: "storehouse", k: "곳간", s: "They ask about the storehouses" },
            { w: "settled it (settle)", k: "가려냈다", s: "Neither knowledge nor appearance settled it" },
            { w: "hoarded (hoard)", k: "아껴 쌓아 두었다", s: "is not that he hoarded his money" },
            { w: "count ~ as people (count)", k: "사람으로 여기다", s: "refusing to count other people as people" },
            { w: "wears ~ clothes (wear)", k: "~의 옷을 입고 있다", s: "That is also why the story wears Buddhist clothes" },
            { w: "barely holding on (hold on)", k: "겨우 버티는", s: "temples were barely holding on" },
            { w: "looked down on ~ (look down on)", k: "낮추어 보았다", s: "a world that looked down on monks" },
            { w: "on his own feet", k: "제 발로", s: "to walk out of his own house on his own feet" },
            { w: "the thing that replaced him (replace)", k: "제 자리를 대신한 것", s: "call the thing that replaced him his teacher" },
            { w: "failed to know ~ (fail)", k: "알아보지 못했다", s: "It means they failed to know the real one" },
            { w: "may be bigger than ~", k: "~보다 커도 되는가", s: "whether a punishment may be bigger than the wrong" }
        ]
    },
    quiz: [
        { q: "What kind of man was Onggojip?", choices: ["Poor but generous", "Rich but very mean", "Well read but timid"], answer: 1 },
        { q: "How did Onggojip treat his mother?", choices: ["He left her in a room with no fire", "He called a physician to care for her", "He greeted her every morning"], answer: 0 },
        { q: "What did Onggojip do to the monk who came for alms?", choices: ["He beat him and drove him off", "He gave him a measure of rice", "He pretended not to see him"], answer: 0 },
        { q: "What did the old monk of Chwiamsa make the false Onggojip out of?", choices: ["A doll carved from wood", "A figure moulded from clay", "A straw figure"], answer: 2 },
        { q: "Why could the family not tell the two Onggojips apart?", choices: ["They were alike to the last hair", "Both of them had their faces covered", "It was too dark to see"], answer: 0 },
        { q: "How did the magistrate try to find the real one?", choices: ["By making them write the same characters", "By asking about the household", "By making them try their strength"], answer: 1 },
        { q: "Why did the real Onggojip lose at the hearing?", choices: ["He knew nothing about his own household", "He was frightened and stammered", "He had no witness to speak for him"], answer: 0 },
        { q: "What happened to Onggojip after he was driven out?", choices: ["He was caught and shut in the town prison", "He went into a mountain temple", "He wandered about begging"], answer: 2 },
        { q: "What did Onggojip understand at other people's gates?", choices: ["That he had driven the monk off just so", "That his own house was the best in the world", "That wealth is all empty"], answer: 0 },
        { q: "What did the old monk give Onggojip?", choices: ["A sack of rice", "A staff", "A paper charm"], answer: 2 },
        { q: "What happened to the false Onggojip when the charm was thrown?", choices: ["He turned to straw and scattered", "He barred the gate and ran", "He hid himself in the storehouse"], answer: 0 },
        { q: "What was the first thing Onggojip did when he came home?", choices: ["He opened the storehouses to check them", "He fetched firewood from the back", "He called the servants into the yard"], answer: 1 },
        {
            q: "Which reaction to this book does NOT fit?",
            wide: true,
            choices: [
                "He lost because he did not know his own household, so having a great deal is not owning it.",
                "Only after begging on the road did he think of the monk, so some things are learned by going through them.",
                "A straw figure did his part exactly, so the self other people see can be made of husks.",
                "Back home he went to the storehouse first, so the state of his property was still what mattered most."
            ],
            answer: 3
        }
    ],
    afterword: {
        title: 'After Reading',
        emoji: '🌾',
        art: ['end.webp'],
        paras: [
            "This story stands in a rather unusual place. It was sung as pansori, and the song no longer survives.",
            "Pansori is said to have had twelve pieces originally. Of those, five are still sung today: Chunhyang-ga, Simcheong-ga, Heungbo-ga, Sugung-ga and Jeokbyeok-ga. For the other seven the singers died out and the music was lost. The Song of Onggojip is one of those seven.",
            "So we cannot hear this story as a song; we can only read it. Where the singer raised his voice, and where the listeners laughed, we can no longer know.",
            "There are several Korean stories in which a false person appears and argues that he is the real one. The best known is the one where a man throws his nail clippings away, a mouse eats them and turns into him and takes his place. The Onggojip story sets a temple and a monk on top of that frame.",
            "The straw figure was originally something that carried a person's bad luck away for them. People made one in the first month of the year and threw it out on the road. So a person made of straw was nothing strange to the people listening. What was strange was what this one does.",
            "This story uses that straw figure quite differently. It does not carry the bad luck away; it takes the master's place. And what is more surprising, the false one runs the house better than the real one and treats people better.",
            "That is the heart of this story. The false one was better. The family chose the false one not because their eyes were dim, but because he was better to live with. The real reason Onggojip was driven out is not that a man with his face appeared, but that he was a man they could do without.",
            "The hearing at the town office is worth looking at again. They ask about the storehouses, the servants' names, and what his mother eats. And the one made of straw knows it all. It is a scene that asks what it is that makes me me. Neither knowledge nor appearance settled it.",
            "Of all Onggojip's doings, the one this story treats most heavily is not that he hoarded his money. It is that he turned people away from his gate. That he left his old mother in a cold room, and gave his servants no food at their break. It is a story that punishes not meanness but refusing to count other people as people.",
            "That is also why the story wears Buddhist clothes. It begins with a monk turned away from a gate and ends with a monk lifting the punishment. In the Joseon period temples were barely holding on in a world that looked down on monks. Stories like this come out of a place like that.",
            "Look at the way the punishment is given, too. He was not beaten. He was not shut up. He was made to walk out of his own house on his own feet and to stand at other people's gates outside. He was made to go through exactly what he had done to others.",
            "The end of the story is the part where Onggojip stands a bundle of straw in his yard and calls it his teacher. If a man can come to call the thing that replaced him his teacher, then he really has changed.",
            "Was the family wrong to choose the false one? It means they failed to know the real one. And yet the false one treated them better. Say what matters more when you are choosing the person you live with.",
            "Did Onggojip change because he was sorry, or because he was frightened? If he changed because of what he went through while he was begging, can that be called being sorry?",
            "Did the monk have the right to punish Onggojip? It is true he was turned from the gate, but it is also true that a man's whole house was taken from him and he was put out on the road. Think about whether a punishment may be bigger than the wrong."
        ]
    }
};

const UI = {
    ko: {
        toc: '차례', quiz: '이야기 문제', after: '읽고 나서', folio: '쪽',
        home: '학습 허브로 돌아가기', other: 'EN', otherAria: 'Read in English',
        done: (n, all) => `${n} / 총 ${all}문항 완료`
    },
    en: {
        toc: 'Contents', quiz: 'Story Questions', after: 'After Reading', folio: '',
        home: 'Back to the learning hub', other: '한국어', otherAria: '한국어로 읽기',
        wordsDown: 'Words ⌄',
        done: (n, all) => `${n} of ${all} answered`
    }
};

const LANG_KEY = 'korea-tales-lang';
const HAS_EN = typeof EN !== 'undefined';
const readLang = () => { try { return localStorage.getItem(LANG_KEY); } catch (e) { return null; } };
const saveLang = v => { try { localStorage.setItem(LANG_KEY, v); } catch (e) { /* 저장이 막힌 곳도 있다 */ } };

let LANG = (HAS_EN && readLang() === 'en') ? 'en' : 'ko';
// 글꼴 규칙이 html[lang] 에 걸려 있다. 쪽을 재기 전에 미리 걸어 두어야
// 영어 글을 영어 글꼴로 잰다. 늦게 걸면 첫 쪽나눔이 통째로 어긋난다.
document.documentElement.lang = LANG;

const T  = () => UI[LANG];
const CH = () => (LANG === 'en' ? EN.chapters  : CHAPTERS);
const QZ = () => (LANG === 'en' ? EN.quiz      : QUIZ);
const AF = () => (LANG === 'en' ? EN.afterword : AFTERWORD);
const CV = () => (LANG === 'en' ? EN.cover     : COVER);

const TWO_PAGE_KINDS = new Set(['chapter', 'toc', 'cover', 'after']);

let PAGES = [];
let FOLIOS = [];

function buildPages() {
    CHAPTER_SEGS = CH().map(ch => segsOf(ch.paras));
    AFTER_SEGS = segsOf(AF().paras);
    TOC_GROUPS = [];
    for (let i = 0; i < CH().length; i += TOC_PER_SPREAD) {
        TOC_GROUPS.push(CH().slice(i, i + TOC_PER_SPREAD));
    }

    PROBE = makeProbe();
    PAGES = [
        { kind: 'cover' },
        ...TOC_GROUPS.map((_, i) => ({ kind: 'toc', part: i })),
        ...CH().flatMap(paginateChapter),
        ...QUIZ_GROUPS.map((_, i) => ({ kind: 'quiz', part: i })),
        ...paginateAfterword()
    ];
    PROBE.close();   // 쪽을 다 나눴으니 재는 데 쓰던 숨은 쪽은 치운다

    let folioCounter = 0;
    FOLIOS = PAGES.map(p => {
        const width = TWO_PAGE_KINDS.has(p.kind) ? 2 : 1;
        const start = folioCounter + 1;
        folioCounter += width;
        return { start, width };
    });
}

buildPages();

function renderPage(page) {
    switch (page.kind) {
        case 'cover': return coverPage();
        case 'toc': return tocPage(page.part);
        case 'chapter': return chapterSpreadPage(page);
        case 'quiz': return quizPage(page.part);
        case 'after': return afterSpreadPage(page);
        default: return '';
    }
}

let current = 0;
let animating = false;

const spreadEl = document.getElementById('spread');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorEl = document.getElementById('pageIndicator');
const folioLeftEl = document.getElementById('folioLeft');
const folioRightEl = document.getElementById('folioRight');

function paint() {
    spreadEl.innerHTML = renderPage(PAGES[current]);
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === PAGES.length - 1;
    indicatorEl.textContent = `${current + 1} / ${PAGES.length}`;

    const folio = FOLIOS[current];
    folioLeftEl.classList.toggle('folio-center', folio.width === 1);
    folioLeftEl.textContent = folio.start;
    folioLeftEl.hidden = false;
    if (folio.width === 2) {
        folioRightEl.textContent = folio.start + 1;
        folioRightEl.hidden = false;
    } else {
        folioRightEl.hidden = true;
    }

    spreadEl.querySelectorAll('[data-goto]').forEach(btn => {
        btn.addEventListener('click', () => {
            const num = Number(btn.dataset.goto);
            const idx = PAGES.findIndex(p => p.kind === 'chapter' && p.first && p.ch.num === num);
            if (idx >= 0) goTo(idx);
        });
    });
    spreadEl.querySelectorAll('[data-goto-kind]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = PAGES.findIndex(p => p.kind === btn.dataset.gotoKind);
            if (idx >= 0) goTo(idx);
        });
    });

    if (PAGES[current].kind === 'quiz') initQuiz();

    paintReadBtn();
    // 읽는 중일 때만 문단을 눌러 그 자리로 옮긴다.
    // 그냥 눌렀다고 소리가 나면 곤란하니, 스피커 단추를 누른 뒤에만 먹는다.
    if (LANG === 'en' && CAN_SPEAK) {
        spreadEl.querySelectorAll('[data-say]').forEach(el => {
            el.addEventListener('click', () => {
                if (!reading) return;
                readPage(Number(el.dataset.say));
            });
        });
    }

    renderVocab();
    fitVocabScreen();
}

function initQuiz() {
    const progressEl = document.getElementById('quizProgress');

    spreadEl.querySelectorAll('.quiz-item').forEach(item => {
        const qi = Number(item.dataset.qindex);
        const q = QZ()[qi];
        item.querySelectorAll('.quiz-choice').forEach(btn => {
            btn.addEventListener('click', () => {
                if (item.classList.contains('graded')) return;
                const chosen = Number(btn.dataset.choice);
                /* 틀리면 그 보기만 빨갛게 남기고, 맞는 것을 고를 때까지 다시 고르게 한다.
                   답을 미리 보여 주면 아이가 생각할 자리가 사라진다. */
                if (chosen !== q.answer) {
                    btn.classList.add('incorrect');
                    QUIZ_WRONG[qi].add(chosen);
                    return;
                }
                btn.classList.add('correct');
                item.classList.add('graded');
                QUIZ_PICKED[qi] = chosen;
                const done = QUIZ_PICKED.filter(v => v !== null).length;
                progressEl.textContent = T().done(done, QZ().length);
            });
        });
    });
}

function goTo(index) {
    if (animating || index === current || index < 0 || index >= PAGES.length) return;
    stopReading();
    animating = true;
    const dir = index > current ? 'flip-next' : 'flip-prev';
    spreadEl.classList.add(dir);
    setTimeout(() => {
        current = index;
        paint();
    }, 230);
    setTimeout(() => {
        spreadEl.classList.remove('flip-next', 'flip-prev');
        animating = false;
    }, 480);
}

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

document.getElementById('tocLink').addEventListener('click', () => {
    const idx = PAGES.findIndex(p => p.kind === 'toc');
    if (idx >= 0) goTo(idx);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft') goTo(current - 1);
});



/* ── 읽어 주기 ─────────────────────────────────────────────────
   소설은 한 문단 안에 서술과 대사가 섞여 있다. 그림책처럼 말하는 이를
   따로 적어 둘 수가 없으므로, 큰따옴표 안팎으로만 목소리를 가른다.
   속도는 둘 다 같다. 대사에서 갑자기 빨라지면 귀에 턱턱 걸린다. */
const CAN_SPEAK = typeof speechSynthesis !== 'undefined';

const SAY_RATE = 0.85;
const SAY_AS = {
    narration: { pitch: 1.00, rate: SAY_RATE },
    speech:    { pitch: 1.24, rate: SAY_RATE },
    speech2:   { pitch: 0.78, rate: SAY_RATE }
};

let SAY_VOICE = null;

function pickVoices() {
    if (typeof speechSynthesis === 'undefined') return;
    const vs = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
    if (!vs.length) return;
    SAY_VOICE = vs.find(v => /^en[-_]US/i.test(v.lang)) || vs[0];
}

if (typeof speechSynthesis !== 'undefined') {
    pickVoices();
    speechSynthesis.onvoiceschanged = pickVoices;
}

function dressVoice(u, role) {
    const a = SAY_AS[role] || SAY_AS.narration;
    u.pitch = a.pitch;
    u.rate = a.rate;
    if (SAY_VOICE) u.voice = SAY_VOICE;
}

/* 낱말 뜻풀이는 소리 내어 읽지 않는다. 나머지 표시는 떼고 글자만 남긴다. */
const plainText = h => h
    .replace(/<span class="gloss">[\s\S]*?<\/span>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/* 큰따옴표 안은 대사다. 서술과 목소리를 가른다.
   한 문단 안에서 따옴표가 잇달아 나오면 대개 두 사람이 주고받는 자리다.
   그래서 두 번째 대사부터 목소리를 번갈아 바꾼다. 말하는 이를 일일이
   적어 둘 수 없는 소설틀에서 낼 수 있는 가장 가까운 흉내다. */
function sayChunks(text) {
    const out = [];
    const re = /"([^"]*)"/g;
    let last = 0, q = 0, m;
    while ((m = re.exec(text)) !== null) {
        if (m.index > last) out.push({ t: text.slice(last, m.index), v: 'narration' });
        out.push({ t: m[1], v: (q++ % 2) ? 'speech2' : 'speech' });
        last = re.lastIndex;
    }
    if (last < text.length) out.push({ t: text.slice(last), v: 'narration' });
    return out.filter(c => /\S/.test(c.t));
}

/* 그 쪽에 있는 문단들. 쪽에 걸쳐 잘린 문단은 한 번만 센다. */
function pageParts(page) {
    if (!page) return [];
    if (page.kind === 'cover') {
        return [CV().title].concat(CV().intro).map((t, i) => ({ i, raw: t }));
    }
    const segs = page.kind === 'chapter' ? CHAPTER_SEGS[page.chIndex]
        : page.kind === 'after' ? AFTER_SEGS : null;
    if (!segs) return [];
    const src = page.kind === 'chapter' ? CH()[page.chIndex].paras : AF().paras;
    const seen = {};
    const out = [];
    [page.left, page.right].forEach(r => {
        if (!r) return;
        for (let k = r[0]; k < r[1]; k++) {
            const pi = segs[k].paraIdx;
            if (seen[pi]) continue;
            seen[pi] = 1;
            out.push({ i: pi, raw: src[pi] });
        }
    });
    return out;
}

/* 읽기 단추는 책틀에 붙박이로 있다. 영어로 읽을 때만 보인다. */
const readBtnEl = document.getElementById('readBtn');
let reading = false;
let readToken = 0;

function paintReadBtn() {
    if (!readBtnEl) return;
    readBtnEl.hidden = !(LANG === 'en' && CAN_SPEAK);
    readBtnEl.textContent = reading ? '■' : '▶';
}

function stopReading() {
    reading = false;
    if (spreadEl) spreadEl.classList.remove('is-reading');
    readToken++;
    if (CAN_SPEAK) { try { speechSynthesis.cancel(); } catch (e) {} }
    document.querySelectorAll('.saying').forEach(el => el.classList.remove('saying'));
    paintReadBtn();
}

function readPage(fromParaIdx) {
    const page = PAGES[current];
    if (!CAN_SPEAK || !page) return;
    const parts = pageParts(page);
    if (!parts.length) return;
    // 읽던 것이 있으면 끊는다. 안 그러면 새 글이 뒤에 줄을 선다.
    try { speechSynthesis.cancel(); } catch (e) {}
    reading = true;
    if (spreadEl) spreadEl.classList.add('is-reading');
    paintReadBtn();
    const mine = ++readToken;

    let start = parts.findIndex(p => p.i === fromParaIdx);
    if (start < 0) start = 0;

    const step = (k) => {
        if (mine !== readToken) return;
        document.querySelectorAll('.saying').forEach(el => el.classList.remove('saying'));
        if (k >= parts.length) { stopReading(); return; }
        const here = spreadEl.querySelector(`[data-say="${parts[k].i}"]`);
        if (here) {
            here.classList.add('saying');
            here.scrollIntoView({ block: 'nearest' });
        }
        const chunks = sayChunks(plainText(parts[k].raw));
        const go = (c) => {
            if (mine !== readToken) return;
            if (c >= chunks.length) { step(k + 1); return; }
            const u = new SpeechSynthesisUtterance(chunks[c].t);
            u.lang = 'en-US';
            dressVoice(u, chunks[c].v);
            u.onend = () => go(c + 1);
            u.onerror = () => go(c + 1);
            try { speechSynthesis.speak(u); } catch (e) { stopReading(); }
        };
        go(0);
    };
    step(start);
}

if (readBtnEl) {
    readBtnEl.addEventListener('click', () => (reading ? stopReading() : readPage(-1)));
}

/* ── 단어장 ────────────────────────────────────────────────────
   책 아래에 있는 또 한 장의 화면이다. 책은 손대지 않는다.
   낱말은 장마다 묶어 두었고, 그 쪽에 실제로 나온 것만 골라 보여 준다. */
const vocabScreenEl = document.getElementById('vocabScreen');
const vocabPanelEl = document.getElementById('vocabPanel');
const scrollDownEl = document.getElementById('scrollDown');
const HAS_WORDS = HAS_EN && EN.words && Object.keys(EN.words).length > 0;
let VOCAB_NOW = [];

function vocabFor() {
    const all = (HAS_WORDS && EN.words) || {};
    const page = PAGES[current];
    if (!page) return { list: [] };
    if (page.kind === 'cover') return { list: all.cover || [] };
    if (page.kind === 'chapter' || page.kind === 'after') {
        const pool = page.kind === 'chapter' ? (all['ch' + page.ch.num] || []) : (all.after || []);
        const text = pageParts(page).map(p => p.raw).join(' ');
        return { list: pool.filter(w => text.indexOf(w.s) >= 0) };
    }
    // 문제 쪽에는 글이 없다. 답을 고르기 전에 훑어볼 수 있게 책에 나온 낱말을 다 보여 준다.
    // 차례에는 볼 글이 없으므로 단어장을 아예 열지 않는다.
    if (page.kind !== 'quiz') return { list: [] };
    const list = [];
    Object.keys(all).forEach(k => all[k].forEach(w => list.push(w)));
    return { list };
}

function renderVocab() {
    const { list } = (HAS_WORDS && LANG === 'en') ? vocabFor() : { list: [] };
    // 볼 낱말이 없는 쪽에서는 아래 화면을 아예 열지 않는다.
    const on = list.length > 0;
    if (vocabScreenEl) vocabScreenEl.hidden = !on;
    if (scrollDownEl) {
        scrollDownEl.hidden = !on;
        scrollDownEl.textContent = T().wordsDown || 'Words ⌄';
    }
    if (!on) {
        if (window.scrollY) window.scrollTo({ top: 0 });
        return;
    }
    VOCAB_NOW = list;
    vocabPanelEl.innerHTML = `
        <ul class="vocab-list">
            ${list.map((w, i) => `
            <li>
                <div class="vocab-top">
                    <p class="vocab-word">${w.w}</p>
                    ${(CAN_SPEAK && LANG === 'en') ? `<button type="button" class="vocab-say" data-i="${i}" aria-label="Listen">🔊</button>` : ''}
                </div>
                <p class="vocab-mean">${w.k}</p>
                <p class="vocab-sent">${w.s}</p>
            </li>`).join('')}
        </ul>`;
}

/* 듣기 — 낱말을 먼저 읽고, 이어서 그 낱말이 나온 구절을 읽는다. */
function sayWord(item) {
    if (!CAN_SPEAK || !item) return;
    try {
        speechSynthesis.cancel();
        // 「went without (go without)」처럼 괄호로 적어 둔 기본형은 읽지 않는다.
        const bare = item.w.replace(/\s*\([^)]*\)/g, '').replace(/~/g, '').trim();
        const word = new SpeechSynthesisUtterance(bare);
        word.lang = 'en-US';
        dressVoice(word, 'narration');
        word.rate = 0.75;
        const sent = new SpeechSynthesisUtterance(item.s);
        sent.lang = 'en-US';
        dressVoice(sent, 'narration');
        speechSynthesis.speak(word);
        speechSynthesis.speak(sent);
    } catch (e) { /* 소리를 못 내는 기기도 있다 */ }
}

if (vocabPanelEl) {
    vocabPanelEl.addEventListener('click', e => {
        const btn = e.target.closest('.vocab-say');
        if (btn) sayWord(VOCAB_NOW[Number(btn.dataset.i)]);
    });
}

/* 그림선 — 그림 칸이 끝나는 자리다. 여기까지만 내려가면 글과 단어장이 함께 보인다.
   소설은 그림 없는 펼침면이 더 많다. 그때는 책 아랫부분만 남기고 멈춘다. */
function artLine() {
    const page = PAGES[current];
    if (!page) return 0;
    const book = document.querySelector('.book');
    const bookBox = book ? book.getBoundingClientRect() : null;
    const capLine = () => (bookBox
        ? Math.max(0, Math.round(bookBox.bottom + window.scrollY - Math.round(window.innerHeight * 0.45)))
        : 0);
    const el = page.kind === 'cover'
        ? document.querySelector('.page-cover .story-page-left-full')
        : spreadEl.querySelector('.story-art-top');
    if (!el) return capLine();
    const box = el.getBoundingClientRect();
    const line = Math.max(0, Math.round(box.bottom + window.scrollY));
    // 표지처럼 그림이 책 높이를 거의 다 차지하면 경계선이 곧 책 밑이라
    // 책이 통째로 사라진다. 그때만 책이 절반쯤 남도록 붙든다.
    if (!bookBox || box.height < bookBox.height * 0.8) return line;
    return Math.max(0, Math.min(line, capLine()));
}

/* 쪽을 다시 나눌 때는 단어장을 먼저 접는다.
   아래 화면이 펼쳐진 채로 재면 문서가 길어져 세로 막대가 생기고,
   그만큼 칸이 좁아져 쪽이 잘못 나뉜다. 세로 화면에서 두 쪽이 어긋났다. */
function rebuildPages() {
    if (vocabScreenEl) vocabScreenEl.hidden = true;
    window.scrollTo(0, 0);
    buildPages();
}

function fitVocabScreen() {
    if (!vocabScreenEl || vocabScreenEl.hidden) return;
    const line = artLine();
    vocabScreenEl.style.minHeight = line ? line + 'px' : '';
}

if (scrollDownEl) {
    scrollDownEl.addEventListener('click', () => {
        fitVocabScreen();
        const line = artLine();
        window.scrollTo({ top: line || document.documentElement.scrollHeight, behavior: 'smooth' });
    });
}

window.addEventListener('resize', () => { window.scrollTo(0, 0); fitVocabScreen(); });

/* ── 말 바꾸기 ─────────────────────────────────────────────────
   쪽은 재어서 나누므로 글을 갈아 끼우면 처음부터 다시 나눈다.
   보던 장으로 돌아간다. 쪽 수는 말마다 다르다. */
const langBtn = document.getElementById('langLink');

function applyLang() {
    stopReading();
    document.documentElement.lang = LANG;
    document.title = CV().title;
    if (langBtn) {
        langBtn.hidden = !HAS_EN;
        langBtn.textContent = T().other;
        langBtn.setAttribute('aria-label', T().otherAria);
    }
}

if (langBtn && HAS_EN) {
    langBtn.addEventListener('click', () => {
        LANG = LANG === 'en' ? 'ko' : 'en';
        saveLang(LANG);
        const here = PAGES[current];
        // 글꼴 규칙(html[lang])을 먼저 바꾸고 나서 재야 한다. 순서를 바꾸면
        // 영어 글을 한글 글꼴 규칙으로 재게 되어 쪽 수가 열 쪽 넘게 어긋난다.
        applyLang();
        rebuildPages();
        current = Math.min(current, PAGES.length - 1);
        if (here && here.kind === 'chapter') {
            const i = PAGES.findIndex(p => p.kind === 'chapter' && p.first && p.ch.num === here.ch.num);
            if (i >= 0) current = i;
        } else if (here) {
            const i = PAGES.findIndex(p => p.kind === here.kind);
            if (i >= 0) current = i;
        }
        paint();
    });
}

applyLang();
paint();

// 본문 글꼴은 늦게 내려온다. 글꼴이 바뀌면 한 줄에 들어가는 글자 수가 달라져서
// 먼저 나눠 둔 쪽이 넘치게 된다. 그래서 글꼴을 다 받은 뒤에 한 번 다시 나눈다.
if (document.fonts && document.fonts.status !== 'loaded') {
    document.fonts.ready.then(() => {
        const here = PAGES[current];
        rebuildPages();
        current = Math.min(current, PAGES.length - 1);
        if (here && here.kind === 'chapter') {
            const idx = PAGES.findIndex(p => p.kind === 'chapter' && p.first && p.ch.num === here.ch.num);
            if (idx >= 0) current = idx;
        }
        paint();
    });
}
