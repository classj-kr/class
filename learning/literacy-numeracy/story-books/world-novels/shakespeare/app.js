const BOOK_TITLE = "셰익스피어 이야기";

const CHAPTER_LABEL = () => '';

const CHAPTERS = [
    {
        num: 1,
        title: "극장을 짓던 사람",
        emoji: "🎭",
        art: ["story-01-a.webp", "story-01-b.webp"],
        paras: [
            `사백 년쯤 전, 영국에 윌리엄 셰익스피어라는 사람이 살았습니다. 런던에서 극단에 들어가 배우 노릇을 하다가, 나중에는 희곡을 썼습니다. 처음에는 남이 쓴 것을 무대에 올리는 일부터 했습니다. 배우로는 크게 이름을 얻지 못했다고 합니다. 시골에서 올라온 젊은이였습니다. 대학을 나오지도 않았고 집안이 좋지도 않았습니다. 그런 사람이 그 시절 런던에서 이름을 얻는 것은 드문 일이었습니다. 스트랫퍼드라는 작은 마을에서 왔습니다. 아버지는 장갑을 만들어 파는 사람이었습니다. 그 집안에 글을 쓰는 사람은 없었습니다. 희곡이란 무대에서 하는 연극의 대본입니다. 누가 무슨 말을 하는지가 죽 적혀 있는 글입니다. 읽으라고 쓴 것이 아니라 무대에 올리라고 쓴 것입니다. 그래서 소설과는 읽는 법이 조금 다릅니다.`,
            `셰익스피어는 평생 서른일곱 편을 썼습니다. 슬프게 끝나는 것과 웃으며 끝나는 것과 옛 임금 이야기로 나뉩니다. 첫째를 비극, 둘째를 희극이라고 부릅니다. 이 책에 담은 일곱 편은 비극과 희극에서 골랐습니다. 서른일곱 편을 이십오 년쯤에 걸쳐 썼습니다. 한 해에 한두 편씩 쓴 셈입니다. 그동안 배우 노릇도 함께 했습니다. 그런데 그 작품을 읽기 전에 알아 두어야 할 것이 하나 있습니다. 그 시절 연극은 지금과 아주 달랐습니다. 그것을 모르고 읽으면 이상해 보이는 대목이 많습니다. 왜 인물이 혼잣말을 길게 하는지도 그래서입니다.`,
            `극장은 지붕이 없는 둥근 건물이었습니다. 가운데가 뻥 뚫려 있어서 해가 있어야만 공연을 했습니다. 그래서 공연은 대개 오후에 했습니다. 비가 오면 그날 공연이 없었습니다. 겨울에는 해가 짧아 공연이 줄었습니다. 둥글게 삼 층으로 자리가 있었고, 삼천 명쯤 들어갔습니다. 런던 사람 열 사람 가운데 하나가 한 달에 한 번은 연극을 보러 갔다고 합니다. 그때 런던에서 연극은 지금의 영화 같은 것이었습니다. 셰익스피어가 몸담은 극단은 나중에 자기들 극장을 지었습니다. 이름이 지구본이라는 뜻의 극장이었습니다. 그 극장은 뒷날 불에 타 없어졌다가 사백 년 만에 같은 자리에 다시 지어졌습니다. 무대에는 배경 그림이 거의 없었습니다. 막도 없었습니다. 장면이 바뀌어도 무대는 그대로였습니다. 그러니 여기가 어디인지를 말로 알려 주어야 했습니다. 그래서 대사에 그 자리의 모습이 자꾸 나옵니다. 달이 어떻고 바람이 어떻다는 말이 그냥 나오는 것이 아닙니다. 그것이 그날의 배경 그림이었습니다.`,
            `숲이면 배우가 "이 숲은 어둡구나" 하고 말했습니다. 그러면 그것이 숲이 되었습니다. 보는 사람이 머릿속으로 숲을 만들어야 했습니다. 그래서 말이 그렇게 중요했던 것입니다. 조명도 없었습니다. 해가 그대로 비치고 있었습니다. 그런데도 밤 장면을 해야 했습니다.`,
            `밤 장면이면 배우가 횃불을 들고 나왔습니다. 환한 대낮에 횃불을 들고 나오면 그것이 밤이 되었습니다. 보는 사람도 그렇게 받아들였습니다. 지금 우리가 무대를 보는 것과는 아주 달랐습니다. 그리고 여자 역은 소년 배우가 했습니다. 그 시절 영국에서는 여자가 무대에 서는 것이 금지되어 있었기 때문입니다. 여자가 무대에 서게 된 것은 그 뒤로 오십 년쯤 지나서였습니다. 그러니 셰익스피어는 여자 배우를 한 번도 보지 못하고 여자 인물을 쓴 것입니다.`,
            `그러니 줄리엣도 소년이 연기했습니다. 목소리가 아직 변하지 않은 아이를 골랐습니다. 목소리가 변하면 그 배역을 못 하게 되었습니다.`,
            `관객도 지금과 달랐습니다. 제일 싼 자리는 무대 앞의 맨바닥이었습니다. 의자가 없어서 서서 보았습니다. 값은 한 푼이었는데, 그것이 그 시절 빵 한 덩이 값쯤이었습니다. 그래서 일하는 사람도 연극을 볼 수 있었습니다. 위층 지붕 있는 자리는 값이 몇 곱절이었습니다. 같은 연극을 보면서도 앉는 자리가 그렇게 갈렸습니다.`,
            `거기 서서 보는 사람들을 '한 푼짜리'라고 불렀습니다. 그 사람들은 마음에 안 들면 야유하고 물건을 던졌습니다. 먹던 사과를 던지는 사람도 있었습니다. 서서 보니 다리가 아파 오래 못 참았습니다. 지루하면 바로 소리가 나왔습니다. 그러니까 셰익스피어는 아주 까다로운 관객을 앞에 두고 쓴 사람입니다. 재미없으면 그 자리에서 표가 났습니다. 다음 날 사람이 줄었습니다. 그러니 재미와 뜻을 함께 담아야 했습니다.`,
            `그 사람들을 두 시간 동안 붙들어 두어야 했습니다. 앞에서 말한 그 맨바닥 사람들 말입니다. 그 사람들이 표를 제일 많이 샀습니다. 그래서 그의 작품에는 늘 무언가가 벌어집니다. 칼싸움, 유령, 변장, 뒤바뀐 편지, 잘못 전해진 소식. 이 책에 담은 일곱 편에도 그런 것이 여럿 나옵니다. 유령이 나오는 편이 있고, 여자가 남자 옷을 입는 편도 있습니다. 편지가 늦게 닿아 사람이 죽는 편도 있습니다. 그 시절에는 편지를 사람이 들고 걸어서 갔습니다. 그러니 편지가 늦는 것은 흔한 일이었습니다. 지금 읽으면 답답한 대목이 그때는 아주 있을 법한 일이었습니다. 그런데 그 사이사이에 사람의 마음을 파고드는 말이 들어 있습니다.`,
            `그것이 사백 년 동안 남은 까닭입니다. 재미만 있었으면 그때 웃고 끝났을 것입니다. 그 사이사이의 말 때문에 남은 것입니다.`,
            `이 책에는 그 가운데 일곱 편을 담았습니다. 제일 널리 알려진 것들로 골랐습니다. 웃으며 끝나는 것 셋과 슬프게 끝나는 것 넷입니다. 슬프게 끝나는 것을 먼저 읽어도 되고 나중에 읽어도 됩니다. 다만 한 편을 읽고 나서 바로 다음 편으로 넘어가지는 마십시오. 한 편이 끝나면 잠깐 덮어 두는 편이 낫습니다. 연극을 이야기로 바꾸어 옮긴 것입니다. 무대에서 보면 두 시간이 걸리는 것을 몇 쪽으로 줄인 셈입니다. 그러니 이 책을 읽고 나서 언젠가 무대에서 보게 되거든, 그것이 진짜라고 여기십시오. 이 책은 그리로 가는 길을 알려 주는 것입니다. 언젠가 무대에서 배우가 그 대사를 말하는 것을 들으면, 여기서 읽은 것과 아주 다르게 들릴 것입니다.`,
            `이런 일을 이백 년 전에 처음 한 사람들이 있습니다. 찰스 램과 메리 램이라는 남매입니다. 두 사람이 아이들이 읽을 수 있게 셰익스피어를 이야기로 바꿔 썼습니다. 이백 년 전 일입니다. 그때까지 아이들이 읽을 만한 셰익스피어가 없었습니다. 남매가 나누어 썼는데, 슬프게 끝나는 것은 오빠가, 웃으며 끝나는 것은 누이가 맡았다고 합니다. 그런데 책이 나올 때는 오빠 이름만 적혔습니다. 그 시절에는 여자 이름으로 책을 내기가 어려웠기 때문입니다. 메리 램의 이름이 표지에 오른 것은 한참 뒤였습니다. 그 책이 지금도 읽히고 있습니다. 이백 년 동안 한 번도 절판되지 않았습니다. 셰익스피어를 처음 만나는 아이들이 아직도 그 책으로 만납니다. 이 책도 그 자리에 놓이려고 만든 것입니다. 여기서 만나고 나중에 원래 것으로 가면 됩니다. 이 책도 그 방식을 따랐습니다. 다만 유명한 대사는 되도록 그대로 옮겼습니다. 그 말이 그 작품의 알맹이이기 때문입니다.`
        ]
    },
    {
        num: 2,
        title: "한여름 밤의 꿈",
        emoji: "🧚",
        art: ["story-02-a.webp", "story-02-b.webp"],
        paras: [
            `아테네에 헤르미아라는 아가씨가 있었습니다. 라이샌더라는 젊은이를 좋아했습니다. 그런데 아버지는 데메트리우스라는 다른 젊은이와 혼인시키려고 했습니다. 헤르미아는 그 사람이 싫었습니다.`,
            `그 시절 아테네 법으로는 아버지가 정한 대로 하지 않으면 큰 벌을 받았습니다. 딸이 고를 수 있는 것이 없었습니다. 따르지 않으면 목숨을 잃거나 평생 갇혀 지내야 했습니다. 그래서 헤르미아와 라이샌더는 도망치기로 했습니다. 숲에서 만나 다른 나라로 가기로 한 것입니다. 밤에 아무도 모르게 떠나기로 했습니다. 숲 어귀의 큰 나무 아래에서 만나기로 했습니다. 그 숲이 어떤 숲인지는 몰랐습니다.`,
            `헤르미아가 그 계획을 친구 헬레나에게 말했습니다. 그런데 헬레나는 데메트리우스를 좋아하고 있었습니다. 헬레나는 그 이야기를 데메트리우스에게 알려 주었습니다. 잘 보이고 싶어서 그런 것입니다. 알려 주면 고마워할 줄 알았던 것입니다. 그런데 데메트리우스는 그길로 헤르미아를 붙잡으러 숲으로 뛰어갔습니다. 헬레나도 그 뒤를 쫓아갔습니다.`,
            `그래서 그날 밤 네 사람이 다 숲으로 들어갔습니다. 그런데 그 숲에는 요정들이 살고 있었습니다.`,
            `요정의 왕 오베론과 왕비 티타니아가 그날 크게 다투고 있었습니다. 왕비가 데리고 있는 어린아이를 서로 곁에 두겠다고 다툰 것입니다. 두 사람이 다투면 날씨까지 사나워진다고 했습니다. 그해에는 비가 그치지 않고 곡식이 여물지 않았습니다. 사람들은 그 까닭을 몰랐습니다. 오베론은 아랫사람 퍽에게 심부름을 시켰습니다. 어떤 꽃의 즙을 가져오라고 한 것입니다. 퍽은 눈 깜짝할 사이에 그것을 구해 왔습니다. 땅을 한 바퀴 도는 데 사십 분이면 된다고 했습니다. 그런 아랫사람이었습니다.`,
            `그 즙을 자는 사람의 눈에 바르면, 깨어나서 처음 본 것을 사랑하게 되는 꽃이었습니다. 오베론은 그것을 왕비에게 쓸 생각이었습니다. 왕비가 엉뚱한 것에 정신이 팔린 사이에 그 아이를 데려오려는 것이었습니다.`,
            `그러다 오베론은 숲에서 헬레나가 데메트리우스에게 매달렸다가 밀쳐지는 것을 보았습니다. 오베론이 딱하게 여겨 퍽에게 말했습니다.<br>"아테네 옷을 입은 젊은이가 있다. 그 눈에도 이것을 발라라."`,
            `그런데 그날 밤 그 숲에는 아테네 옷을 입은 젊은이가 둘이었습니다. 오베론은 그것을 모르고 시킨 것입니다. 아테네 옷을 입은 젊은이라고만 말한 것이 화근이었습니다. 심부름은 그렇게 어긋납니다. 퍽은 숲에서 헤매다 지쳐 잠든 라이샌더를 그 젊은이로 알고 그 눈에 발랐습니다. 라이샌더가 깨어나서 처음 본 것이 헬레나였습니다. 마침 헬레나가 그 옆을 지나가고 있었습니다. 그래서 라이샌더가 헬레나를 쫓아다니기 시작했습니다.`,
            `오베론이 그것을 알고 다시 시켰습니다. 이번에는 데메트리우스에게 발랐습니다. 데메트리우스도 깨어나 헬레나를 보았습니다. 그래서 두 젊은이가 다 헬레나를 쫓아다니게 되었습니다.`,
            `헬레나는 두 사람이 자기를 놀리는 줄 알고 화를 냈습니다. 여태 아무도 자기를 안 보다가 갑자기 둘이 쫓아오니 그럴 만했습니다. 헬레나는 그때까지 데메트리우스에게 밀쳐지기만 하던 사람이었습니다. 그러니 믿을 수가 없었던 것입니다. 헤르미아는 하루아침에 아무도 자기를 안 보게 되어 울었습니다. 네 사람은 그 밤 내내 숲을 뛰어다니며 다투었습니다. 퍽이 그것을 나무 위에서 보며 웃었습니다. 자기가 잘못 발라서 벌어진 일이었습니다. 그런데도 재미있어했습니다.`,
            `한편 그 숲에서는 다른 일도 벌어지고 있었습니다. 마을의 일꾼 몇이 연극 연습을 하러 숲에 와 있었습니다. 공작의 혼례에서 보일 연극이었습니다. 퍽이 장난삼아 그 가운데 하나의 머리를 나귀 머리로 바꿔 놓았습니다. 그 가까이에는 오베론이 꽃즙을 발라 둔 티타니아가 잠들어 있었습니다. 그리고 그때 마침 티타니아가 깨어났습니다.`,
            `그래서 요정의 왕비가 나귀 머리를 한 일꾼에게 반했습니다. 오베론은 그 틈에 티타니아에게서 그 아이를 넘겨받았습니다. 그리고 새벽이 되자 다 되돌려 놓았습니다.`,
            `아침에 네 사람이 숲에서 깨어났습니다. 그리고 그 밤에 있었던 일을 다 꿈이라고 여겼습니다.`,
            `다만 한 가지가 남았습니다. 데메트리우스가 헬레나를 좋아하게 된 것은 그대로 남았습니다. 오베론이 일부러 그것만 풀지 않은 것입니다. 데메트리우스가 이제 헤르미아를 바라지 않으니, 공작이 헤르미아 아버지의 뜻을 누르고 혼인을 허락했습니다. 그래서 두 쌍이 다 혼인했습니다. 공작의 혼례와 함께 세 쌍이 한자리에서 혼인했습니다. 그리고 그 자리에서 일꾼들의 연극이 올려졌습니다. 나귀 머리를 썼던 그 사람이 주역이었습니다.`
        ]
    },
    {
        num: 3,
        title: "베니스의 상인",
        emoji: "⚖️",
        art: ["story-03-a.webp", "story-03-b.webp"],
        paras: [
            `베니스에 안토니오라는 상인이 있었습니다. 배를 여러 척 부리는 사람이었습니다. 친구 바사니오가 돈을 빌리러 왔습니다. 벨몬트의 포샤라는 아가씨에게 청혼하러 가려면 차림새를 갖추어야 했기 때문입니다. 빈손으로 갈 수는 없었습니다. 그 시절에는 청혼하러 갈 때 사람과 짐을 갖추어 갔습니다. 초라하게 가면 만나 주지도 않았습니다.`,
            `안토니오는 돈이 다 배에 실려 나가 있었습니다. 배가 돌아와야 손에 돈이 들어왔습니다. 그래서 샤일록이라는 사람에게 빌리기로 했습니다. 샤일록은 돈을 빌려주고 이자를 받는 일을 했습니다. 베니스에서 손꼽히는 사람이었습니다. 베니스는 장사로 먹고사는 도시였습니다. 그러니 돈을 빌려주는 일이 도시를 돌아가게 했습니다.`,
            `그 시절 베니스에서 유대인은 다른 일을 할 수 없었습니다. 법으로 직업이 제한되어 있었고, 정해진 구역 밖에서 살 수 없었고, 밖에 나갈 때는 표시가 있는 모자를 써야 했습니다. 멀리서도 누구인지 알아보게 하려는 것이었습니다. 밤에는 그 구역의 문이 밖에서 잠겼습니다.`,
            `그리고 안토니오는 그동안 샤일록을 여러 번 모욕했습니다. 길에서 침을 뱉은 적도 있었습니다. 그러고도 돈을 빌리러 간 것이었습니다. 안토니오는 그것을 이상하게 여기지 않았습니다. 그 시절에는 그것이 이상한 일이 아니었기 때문입니다.`,
            `샤일록이 말했습니다.<br>"이번에는 이자를 안 받겠소. 그 대신 재미로 조건을 하나 걸읍시다. 갚지 못하면 당신 살 한 근을 주시오."`,
            `안토니오는 그것을 농담으로 여기고 서명했습니다. 배가 곧 돌아올 것이라고 믿었기 때문입니다. 배 여섯 척이 다 가라앉는 일은 없다고 여겼습니다. 그런데 그 일이 일어났습니다.`,
            `바사니오는 그 돈으로 벨몬트에 가서 포샤와 혼인했습니다. 그런데 그때 소식이 왔습니다.`,
            `안토니오의 배가 다 가라앉았다는 것이었습니다. 한 척도 돌아오지 않았습니다. 돈을 갚기로 한 날이 지나자 샤일록이 재판을 걸었습니다. 문서대로 하겠다는 것이었습니다. 재판이 열렸습니다.`,
            `공작이 샤일록에게 사정했습니다.<br>"돈을 세 배로 받고 물러서시오."`,
            `샤일록은 거절했습니다. 그리고 이렇게 말했습니다.<br>"유대인에게는 눈이 없습니까? 손이 없습니까? 찔리면 피가 안 납니까? 웃기면 안 웃습니까? 독을 먹이면 안 죽습니까? 당신들이 우리에게 하는 대로 우리가 배운 것입니다."<br>이 말은 자기가 옳다는 말이 아닙니다. 당신들도 나와 같은 것을 했다는 말입니다.`,
            `이것이 이 작품에서 가장 유명한 대사입니다.`,
            `그때 젊은 법률가가 하나 들어왔습니다. 사실은 포샤가 남자 옷을 입고 온 것이었습니다. 법을 아는 친척에게 미리 배워 온 것이었습니다. 그 시절 여자는 법정에 설 수 없었습니다. 그래서 남자 옷을 입어야 했습니다.`,
            `포샤가 말했습니다.<br>"이 문서는 유효합니다. 살 한 근을 가져가십시오."`,
            `샤일록이 칼을 들었습니다. 그때 포샤가 다시 말했습니다.<br>"다만 이 문서에는 살이라고만 적혀 있습니다. 피는 적혀 있지 않습니다. 그러니 피는 한 방울도 흘리지 마십시오. 한 방울이라도 흘리면 당신 재산을 다 몰수합니다."`,
            `샤일록은 그 자리에 굳었습니다. 들었던 칼이 손에서 내려왔습니다. 그리고 물러서겠다고 했습니다. 그런데 재판은 거기서 끝나지 않았습니다.`,
            `법정은 베니스 사람의 목숨을 노린 죄를 물어 샤일록에게 재산의 절반을 빼앗고, 나머지도 마음대로 못 쓰게 했습니다. 그리고 종교를 바꾸라고 했습니다. 샤일록은 그것을 받아들이고 법정을 나갔습니다. 아무 말도 하지 않고 나갔습니다. 그 자리에 있던 사람들은 그것을 통쾌하게 여겼습니다. 지금 읽는 사람은 대개 그렇지 않습니다.`,
            `그 뒤로 그 사람은 이 작품에 다시 나오지 않습니다.`,
            `이 작품은 원래 희극으로 쓰였습니다. 그런데 요즘은 이것을 웃으며 보는 사람이 거의 없습니다. 사백 년 사이에 보는 사람이 달라진 것입니다. 작품은 그대로인데 읽는 사람이 바뀐 것입니다. 오래된 작품을 읽을 때는 그 차이도 함께 보아야 합니다.`
        ]
    },
    {
        num: 4,
        title: "로미오와 줄리엣",
        emoji: "🌹",
        art: ["story-04-a.webp", "story-04-b.webp"],
        paras: [
            `이탈리아 베로나에 두 집안이 있었습니다. 몬터규 집안과 캐풀렛 집안이었습니다. 두 집안은 아주 오래 원수로 지냈습니다. 할아버지의 할아버지 때부터 그랬습니다.`,
            `왜 그렇게 되었는지는 그 집안 사람들도 몰랐습니다. 너무 오래되었기 때문입니다. 길에서 만나면 하인들끼리도 칼을 뽑았습니다. 베로나 사람들은 그 다툼에 지쳐 있었습니다. 길에서 싸움이 나면 장이 파했습니다. 영주가 여러 번 금했는데도 그치지 않았습니다.`,
            `어느 날 캐풀렛 집에서 큰 잔치가 열렸습니다. 몬터규 집안의 로미오가 친구들과 함께 가면을 쓰고 몰래 들어갔습니다. 들키면 큰일 날 짓이었습니다. 원수 집안의 잔치에 들어간 것이었습니다. 가면을 쓴 손님이 많은 잔치라 그럴 수 있었습니다. 그리고 거기서 줄리엣을 보았습니다.`,
            `줄리엣은 캐풀렛 집안의 딸이었습니다. 열세 살이었습니다. 로미오는 열여섯쯤이었습니다. 둘 다 아직 아이였습니다. 그 시절에는 그 나이에 혼인하는 일이 있었습니다. 그래도 어린 나이였습니다.`,
            `두 사람은 그 자리에서 서로에게 마음이 갔습니다. 말 몇 마디를 나눈 것이 다였습니다. 그리고 서로가 누구인지 알고 나서 얼어붙었습니다. 하필 원수 집안이었습니다. 두 사람 다 그 자리에서 아무 말도 하지 못했습니다.`,
            `그날 밤 로미오는 담을 넘어 캐풀렛 집 정원으로 들어갔습니다. 줄리엣이 발코니에 나와 혼잣말을 하고 있었습니다. 달빛이 환한 밤이었습니다.`,
            `"로미오, 당신은 왜 로미오인가요."<br>"이름이 무엇입니까. 장미를 다른 이름으로 불러도 향기는 그대로인데요."`,
            `그 말을 로미오가 아래에서 들었습니다. 나무 그늘에 서 있었던 것입니다. 들으려고 숨은 것은 아니었습니다. 나서지 못하고 있다가 듣게 된 것입니다.`,
            `이튿날 두 사람은 로렌스 신부에게 가서 몰래 혼인했습니다. 신부가 그것을 도운 까닭이 있습니다. 이 혼인으로 두 집안이 화해할지도 모른다고 생각한 것입니다. 좋은 뜻으로 한 일이었습니다. 그 좋은 뜻이 뒤에 어떻게 되는지가 이 작품의 무서운 데입니다.`,
            `그런데 그날 오후에 일이 났습니다. 길에서 줄리엣의 사촌 티볼트와 로미오의 친구 머큐시오가 부딪쳤습니다. 로미오가 말리려고 두 사람 사이에 들어갔습니다. 그리고 그 틈에 머큐시오가 찔렸습니다. 티볼트의 칼이 로미오의 팔 아래로 들어간 것입니다. 말리려던 것이 오히려 칼이 들어갈 틈을 만들어 준 꼴이 되었습니다.`,
            `머큐시오는 죽어 가면서 이렇게 말했습니다.<br>"두 집안 다 망해 버려라."`,
            `로미오는 그때 이성을 잃었습니다. 그리고 티볼트를 찔렀습니다. 그날 로미오는 베로나에서 추방되었습니다. 해가 지기 전에 성을 나가야 했습니다.`,
            `한편 줄리엣의 아버지는 딸을 파리스라는 사람과 혼인시키기로 했습니다. 혼례가 사흘 뒤였습니다.`,
            `줄리엣은 로렌스 신부에게 달려갔습니다. 다른 데는 갈 데가 없었습니다. 신부가 약을 하나 주었습니다. 그것을 마시면 마흔두 시간 동안 죽은 것처럼 보이는 약이었습니다. 숨도 맥도 멎은 것처럼 보인다고 했습니다. 그 시절에는 그런 약이 있다고 믿었습니다. 신부는 약초를 다루는 사람이었습니다.`,
            `계획은 이랬습니다. 줄리엣이 그것을 마시고 무덤에 옮겨지면, 로미오가 그리로 와서 깨어난 줄리엣을 데리고 떠나는 것이었습니다. 신부는 그 계획을 적은 편지를 로미오에게 보냈습니다.`,
            `그런데 그 편지를 든 사람이 가는 길에 붙잡혔습니다.`,
            `그 지방에 돌림병이 돌아서 오가는 사람을 가두어 두었기 때문입니다. 편지는 그 사람 품에 든 채로 있었습니다. 그 사람도 갇혀서 나올 수 없었습니다. 편지를 대신 보낼 사람도 없었습니다. 그래서 로미오는 그 편지를 받지 못했습니다. 대신 다른 소식을 들었습니다.`,
            `줄리엣이 죽었다는 소식이었습니다. 그사이 줄리엣은 계획대로 약을 마셨고, 집안사람들은 줄리엣이 죽은 줄 알고 무덤에 눕혔던 것입니다. 이 이야기의 마지막에 벌어진 일은 잘 알려져 있습니다. 로미오는 무덤으로 달려가 잠든 줄리엣 곁에서 목숨을 끊었고, 깨어난 줄리엣이 그것을 보고 뒤를 따랐습니다. 편지가 하루만 일찍 닿았어도 없었을 일이었습니다.`,
            `그 뒤에 두 집안이 무덤 앞에서 만났습니다. 그리고 그날 화해했습니다. 이 작품에서 제일 무서운 것은 원수도 독약도 아닙니다. 편지 한 통이 늦은 것입니다. 막을 수 있었던 일이었습니다. 그것이 이 작품을 더 아프게 합니다.`
        ]
    },
    {
        num: 5,
        title: "햄릿",
        emoji: "💀",
        art: ["story-05-a.webp", "story-05-b.webp"],
        paras: [
            `덴마크의 왕이 갑자기 세상을 떠났습니다. 뜰에서 낮잠을 자다가 뱀에 물렸다고 했습니다. 그렇게 알려졌을 뿐이었습니다. 그리고 두 달 만에 왕비가 왕의 동생 클로디어스와 혼인했습니다. 장례에 썼던 그릇을 잔칫상에 그대로 썼다는 말이 돌았습니다. 두 달 사이에 그렇게 된 것입니다. 성 안 사람들은 그 이야기를 입 밖에 내지 않았습니다.`,
            `클로디어스가 새 왕이 되었습니다. 왕자 햄릿은 그것을 견디지 못했습니다. 상복을 벗지 않고 지냈습니다. 아버지가 돌아가신 지 두 달이었습니다. 다들 상복을 벗은 뒤였습니다. 그 자리에서 검은 옷을 입은 사람은 햄릿뿐이었습니다.`,
            `어느 밤, 성벽을 지키던 병사들이 이상한 것을 보았습니다. 죽은 왕의 모습을 한 것이 성벽을 걷고 있었던 것입니다. 갑옷까지 그대로였습니다. 햄릿이 그 이야기를 듣고 밤에 그리로 갔습니다. 병사들이 말렸는데도 갔습니다. 위험하다고 했습니다. 그런데 햄릿은 그 말을 듣지 않았습니다. 그리고 그것을 만났습니다.`,
            `그것이 이렇게 말했습니다.<br>"나는 뱀에 물려 죽은 것이 아니다. 네 삼촌이 내 귀에 독을 부었다. 복수해 다오."`,
            `햄릿은 그 말을 듣고 그 자리에 주저앉았습니다. 들은 것이 사실이면 삼촌이 아버지를 죽인 것이었습니다. 그리고 어머니는 그 사람과 혼인한 것이었습니다.`,
            `그런데 여기서 이 작품이 다른 복수 이야기와 갈립니다. 보통 이런 이야기에서는 주인공이 곧바로 복수하러 갑니다. 햄릿은 그러지 않았습니다.`,
            `햄릿은 이렇게 생각했습니다. 저것이 정말 아버지일까. 아니면 나를 속여 삼촌을 죽이게 하려는 것일까. 내가 확인하지 않고 사람을 죽이면, 나는 삼촌과 무엇이 다른가. 확인하지 않고 사람을 죽이는 것은 삼촌이 한 일과 같습니다. 햄릿은 그 자리에서 그것을 셈했습니다.`,
            `그래서 햄릿은 확인하기로 했습니다. 마침 떠돌이 극단이 성에 왔습니다. 햄릿이 전부터 알던 배우들이었습니다. 성에 오면 늘 반가워하던 사람들이었습니다. 그래서 부탁을 들어주었습니다. 햄릿은 그 배우들에게 어떤 연극을 시켰습니다. 왕의 귀에 독을 붓는 장면이 나오는 연극이었습니다. 그리고 그 장면에서 삼촌의 얼굴을 지켜보았습니다.`,
            `클로디어스는 그 장면에서 자리를 박차고 나갔습니다. 얼굴이 하얘져 있었습니다. 햄릿은 그것으로 알았습니다. 그런데 그 뒤로도 햄릿은 오래 미루었습니다. 칼을 뽑았다가 도로 넣은 적도 있었습니다. 삼촌이 기도하는 것을 보고 그만둔 것이었습니다. 기도하다 죽으면 벌을 못 받는다고 여겼기 때문입니다.`,
            `사백 년 동안 사람들이 이것을 두고 다퉜습니다. 왜 미루었는가 하는 것입니다. 겁이 많아서라고 하는 사람도 있고, 생각이 너무 많아서라고 하는 사람도 있습니다. 어느 쪽도 딱 맞아떨어지지는 않습니다.`,
            `이런 말도 있습니다. 햄릿은 사람을 죽이는 일이 옳은지를 계속 묻고 있었다는 것입니다. 그 사이에 여러 사람이 죽었습니다. 미룬 값을 다른 사람들이 치른 셈입니다. 햄릿이 좋아하던 아가씨와 그 아버지도 그 값에 들어 있었습니다. 그것이 이 작품을 무겁게 만듭니다.`,
            `햄릿이 커튼 뒤에 숨은 사람을 삼촌인 줄 알고 찌른 일이 있었습니다. 그 사람은 폴로니어스라는 대신이었고, 햄릿이 좋아하던 오필리아의 아버지였습니다. 확인하지 않고 찌른 것이었습니다. 확인하지 않고 죽이지 않겠다던 사람이 그렇게 한 것입니다. 햄릿은 그 뒤로 그 일을 안고 갑니다.`,
            `오필리아는 그 뒤로 정신이 흐려졌습니다. 궁전 복도를 돌아다니며 노래를 불렀습니다. 들꽃을 꺾어 만나는 사람에게 한 송이씩 나누어 주었습니다. 이 꽃은 누구 것, 저 꽃은 누구 것 하면서요. 아버지를 잃고, 좋아하던 사람에게서 모진 말을 들은 아이였습니다. 그러고 얼마 뒤 강가에서 세상을 떠났습니다. 셰익스피어는 그 장면을 무대에 올리지 않았습니다. 왕비가 전하는 말로만 들려줍니다.`,
            `마지막 장면에서 여러 사람이 한꺼번에 죽습니다. 오필리아의 오빠 레어티즈가 아버지와 누이의 일로 햄릿에게 칼싸움을 걸었는데, 클로디어스가 그 칼끝과 술잔에 몰래 독을 준비해 두었기 때문입니다. 왕비가 그 술을 마시고, 햄릿과 레어티즈가 그 칼에 다쳤습니다. 햄릿은 그제야 모든 것을 알고 클로디어스를 찔렀습니다. 그리고 햄릿도 죽습니다. 햄릿이 죽기 전에 마지막으로 한 부탁은 이것이었습니다. 친구 호레이쇼에게, 자기 이야기를 사람들에게 제대로 전해 달라는 것이었습니다. 그래서 이 이야기가 남은 것으로 되어 있습니다.`,
            `이 작품에서 제일 유명한 대사는 이것입니다.<br>"사느냐 죽느냐, 그것이 문제로다."`,
            `그런데 그 말은 죽고 싶다는 말이 아닙니다. 견디는 것과 맞서는 것 가운데 어느 쪽이 옳으냐를 묻는 말입니다. 햄릿은 그 물음을 끝까지 놓지 않았습니다. 답을 얻지는 못했습니다. 그런데 묻기를 그만두지도 않았습니다.`
        ]
    },
    {
        num: 6,
        title: "리어 왕",
        emoji: "👑",
        art: ["story-06-a.webp", "story-06-b.webp"],
        paras: [
            `옛 브리튼에 리어라는 늙은 왕이 있었습니다. 딸이 셋이었습니다. 고너릴, 리건, 코딜리아였습니다.`,
            `리어는 나이가 들자 나라를 셋으로 나누어 주기로 했습니다. 그런데 나누기 전에 이런 것을 시켰습니다.<br>"너희가 나를 얼마나 사랑하는지 말해 보아라. 제일 잘 말하는 아이에게 제일 좋은 땅을 주겠다."<br>땅은 이미 셋으로 나누어 놓은 뒤였습니다. 그러니 그 자리는 시험이 아니라 듣고 싶은 말을 듣는 자리였습니다.`,
            `첫째 고너릴이 말했습니다.<br>"저는 아버지를 눈보다, 목숨보다, 자유보다 사랑합니다."<br>둘째 리건이 말했습니다.<br>"언니가 말한 것으로는 모자랍니다. 저는 아버지 말고는 아무것도 기쁘지 않습니다."<br>두 딸 다 미리 준비해 온 말이었습니다. 그것을 리어는 알아채지 못했습니다.`,
            `리어는 흡족했습니다. 그리고 막내 코딜리아를 보았습니다. 코딜리아는 아버지가 제일 아끼는 딸이었습니다. 리어가 물었습니다.<br>"너는 무엇이라고 하겠느냐."<br>코딜리아가 말했습니다.<br>"드릴 말씀이 없습니다."<br>"뭐라고?"<br>"저는 자식으로서 마땅한 만큼 아버지를 사랑합니다. 그 이상도 그 이하도 아닙니다. 저에게 남편이 생기면 그 사람에게도 마음의 절반을 줄 것입니다. 언니들처럼 아버지가 전부라고 말한다면, 그럼 언니들은 왜 혼인을 했겠습니까."<br>그 자리에서 그 말을 한 사람은 코딜리아뿐이었습니다. 그래서 그 말이 제일 아프게 들렸습니다.`,
            `그 말은 사실 아주 정직한 말이었습니다. 그런데 리어는 그 말을 듣고 화가 났습니다. 그리고 코딜리아를 내쫓았습니다. 땅도 주지 않았습니다. 제일 아끼던 딸에게 그렇게 했습니다. 참말을 들은 자리에서 그렇게 된 것입니다.`,
            `그 자리에 프랑스 왕이 와 있었습니다. 프랑스 왕이 말했습니다.<br>"저는 저 아가씨를 아내로 맞겠습니다. 땅이 없어도 좋습니다."<br>그 자리에 있던 다른 구혼자는 땅이 없다는 말을 듣고 물러섰습니다. 그 둘이 그 자리에서 갈렸습니다.`,
            `코딜리아는 프랑스로 갔습니다. 리어는 나라를 두 딸에게 나누어 주었습니다. 그리고 자기는 기사 백 명을 데리고 두 딸 집에 번갈아 지내기로 했습니다. 그런데 땅을 받고 나자 두 딸이 달라졌습니다.`,
            `첫째 집에서는 기사를 오십 명으로 줄이라고 했습니다. 그래서 둘째 집으로 갔습니다. 둘째는 스물다섯 명으로 줄이라고 했습니다. 그래서 다시 첫째에게 갔습니다.`,
            `이번에는 한 명도 안 된다고 했습니다. 백 명이 오십이 되고 스물다섯이 되고 하나도 안 된 것입니다. 그렇게 줄어드는 데 몇 달이 걸리지 않았습니다. 리어는 그날 밤 두 딸의 집에서 다 쫓겨났습니다. 그리고 폭풍이 치는 벌판으로 나갔습니다.`,
            `그 벌판에서 리어가 미쳐 갑니다. 그런데 이 작품에서 이상한 것이 있습니다. 리어는 미쳐 가면서 처음으로 옳은 말을 하기 시작합니다.`,
            `벌판에서 리어가 이런 말을 합니다.<br>"헐벗은 자들아, 너희는 어디에 있느냐. 이런 밤을 어떻게 견디느냐. 나는 이것을 너무 늦게 알았다. 왕이었을 때 나는 이런 것을 한 번도 생각한 적이 없다."<br>지붕 아래에서만 살면 비 맞는 사람이 보이지 않습니다. 리어는 그것을 벌판에서야 알았습니다.`,
            `마지막에 코딜리아가 프랑스에서 군대를 이끌고 아버지를 구하러 옵니다. 그리고 두 사람이 만납니다. 그런데 그 뒤가 좋게 끝나지 않습니다.`,
            `코딜리아의 군대는 그 싸움에서 지고, 코딜리아는 붙잡혀 옥에서 목숨을 잃습니다. 리어도 딸을 안은 채 세상을 떠납니다.`,
            `셰익스피어가 이 작품을 쓸 때, 원래 전해 오던 이야기에서는 결말이 좋았습니다. 코딜리아가 아버지를 구하고 다 잘되는 것이었습니다.`,
            `셰익스피어가 그것을 일부러 바꿨습니다. 그리고 그 뒤 백오십 년 동안, 영국 극장에서는 그 결말이 너무 견디기 어려워서 다시 고쳐 올렸습니다. 원래대로 올리기 시작한 것은 그 뒤의 일입니다. 백오십 해 동안 사람들은 고친 결말만 보았던 것입니다. 견디기 어려운 것을 견디게 하는 것이 이 작품이 하려는 일이었습니다.`
        ]
    },
    {
        num: 7,
        title: "맥베스",
        emoji: "🗡️",
        art: ["story-07-a.webp", "story-07-b.webp"],
        paras: [
            `스코틀랜드에 맥베스라는 장군이 있었습니다. 던컨 왕이 아끼는 사람이었습니다. 싸움에서 크게 이기고 돌아오는 길이었습니다. 나라를 구한 장수였습니다. 황야에서 세 여자를 만났습니다. 함께 있던 뱅쿠오도 그것을 다 보았습니다. 그들이 이렇게 말했습니다. 셋이 한마디씩 이어서 말했습니다.<br>"글래미스의 영주 만세."<br>"코더의 영주 만세."<br>"장차 왕이 되실 분 만세."`,
            `세 여자는 뱅쿠오에게도, 자신은 왕이 못 되어도 자손이 왕이 되리라고 말했습니다. 그리고 말을 마치자 그 자리에서 사라졌습니다. 맥베스는 그때 글래미스의 영주였습니다. 그것은 누구나 아는 일이었습니다. 코더의 영주는 아니었습니다. 그 자리에는 다른 사람이 있었습니다. 그런데 성에 닿기도 전에 소식이 왔습니다. 말을 탄 사람이 달려와 알렸습니다. 싸움터에서 곧바로 온 전령이었습니다. 맥베스는 그 말을 듣고 한참 서 있었습니다.`,
            `왕이 맥베스를 코더의 영주로 삼았다는 것이었습니다. 그러니까 두 번째 말이 맞은 것입니다. 첫 번째 말도 맞은 셈이었습니다. 맥베스는 그때부터 세 번째 말을 생각하기 시작했습니다. 자다가도 그 생각이 났습니다. 둘이 맞았으니 셋째도 맞을 것 같았습니다. 그 생각이 그때부터 떠나지 않았습니다.`,
            `맥베스는 그 이야기를 아내에게 편지로 알렸습니다. 싸움터에서 바로 부친 편지였습니다. 기쁜 소식을 먼저 알리고 싶었던 것입니다. 그 편지가 어떻게 될지는 몰랐습니다. 맥베스 부인은 그 편지를 읽고 곧바로 마음을 정했습니다. 왕을 없애고 남편을 왕으로 만들겠다는 마음이었습니다.`,
            `며칠 뒤 던컨 왕이 맥베스의 성에 묵으러 왔습니다. 싸움에서 이긴 것을 치하하러 온 것이었습니다. 제 발로 걸어 들어온 것이었습니다. 그만큼 맥베스를 믿었습니다. 그날 밤 맥베스는 여러 번 망설였습니다.<br>"그분은 나를 믿고 여기 오셨소. 나는 그분의 장수이고 친척이오. 손님을 지켜야 하는데 오히려 내가······."`,
            `맥베스 부인이 말했습니다.<br>"그럼 그만두시오. 다만 앞으로 평생 자기가 겁쟁이인 줄 알고 사시오."<br>그 한마디가 맥베스를 움직였습니다. 무서운 것보다 겁쟁이 소리가 더 견디기 어려웠던 것입니다.`,
            `그날 밤 던컨 왕이 맥베스의 손에 세상을 떠났습니다. 그리고 그 죄가 잠든 하인들에게 씌워졌습니다. 던컨 왕의 두 아들은 자기들도 해를 입을까 두려워 그 밤에 나라를 떠났습니다. 그러자 맥베스가 왕이 되었습니다. 그런데 그때부터가 이 작품의 본론입니다.`,
            `맥베스는 왕이 되고 나서 잠을 자지 못했습니다. 눈을 감으면 그날 밤이 떠올랐습니다. 그리고 자기가 한 일을 아는 사람이 있을까 봐 무서워졌습니다. 신하들의 눈길 하나에도 놀랐습니다. 아무도 모르는데 다들 아는 것 같았습니다. 그것이 잠을 못 자게 했습니다. 그래서 뱅쿠오라는 친구를 없앴습니다. 그 사람도 그 예언을 함께 들었기 때문입니다.`,
            `그리고 그 뒤로 계속 사람을 없앴습니다. 뱅쿠오의 아들까지 쫓았습니다. 한 번 시작하면 멈출 수가 없었습니다. 하나를 없애면 그것을 아는 사람이 또 생겼기 때문입니다. 없애는 일마다 아는 사람이 늘었습니다. 그래서 갈수록 빨라졌습니다.`,
            `맥베스가 이런 말을 합니다.<br>"나는 피 속에 너무 깊이 들어와서, 이제 돌아가는 것이 건너가는 것만큼 힘들다."`,
            `맥베스 부인도 무너졌습니다. 처음에 마음을 정한 사람이 먼저 무너진 것입니다. 밀어붙일 때는 아무렇지 않아 보였습니다. 그런데 그 사람이 먼저 갔습니다. 밤마다 자면서 걸어 다니고, 손을 계속 씻었습니다.<br>"이 손에서 냄새가 안 없어져."`,
            `그러다 세상을 떠났습니다. 그 소식을 들었을 때 맥베스가 한 말이 이 작품에서 가장 유명합니다.<br>"인생은 걸어 다니는 그림자, 무대에서 한동안 뽐내다가 사라지는 서투른 배우, 아무 뜻도 없는 이야기."`,
            `마지막에 맬컴이 군대를 이끌고 옵니다. 던컨 왕의 아들이었습니다. 그리고 맥베스는 그 싸움에서 끝납니다. 성문 앞에서였습니다.`,
            `이 작품이 무서운 까닭은 괴물이 나와서가 아닙니다. 무서운 것이 사람 안에 있기 때문입니다.`,
            `맥베스가 처음부터 못된 사람이 아니었기 때문입니다. 첫 장면에서 맥베스는 나라를 구한 장수였습니다. 거기서 여기까지 오는 데 몇 걸음이면 되었던 것입니다. 한 번 넘고 나면 그다음은 쉬워집니다. 이 작품은 그 몇 걸음을 아주 자세히 보여 줍니다.`
        ]
    },
    {
        num: 8,
        title: "폭풍우",
        emoji: "🌪️",
        art: ["story-08-a.webp", "story-08-b.webp"],
        paras: [
            `밀라노의 공작 프로스페로는 책 읽는 것을 좋아했습니다. 나라 일은 동생 안토니오에게 맡기고 서재에서 지냈습니다. 책이 방을 가득 채우고 있었습니다. 그러다 안토니오가 형의 자리를 빼앗았습니다. 밤사이에 벌어진 일이었습니다. 나라 일을 맡긴 사람이 그 나라를 가져간 것입니다. 프로스페로는 그것을 그날 새벽에야 알았습니다.`,
            `안토니오는 프로스페로와 세 살짜리 딸 미란다를 낡은 배에 태워 바다에 띄워 보냈습니다. 두 사람은 어느 섬에 닿았습니다. 사람이 거의 살지 않는 섬이었습니다. 그리고 그 섬에서 열두 해를 살았습니다. 미란다는 그동안 열다섯 살이 되었습니다. 세 살 때 일이라 밀라노를 기억하지 못했습니다. 아버지에게 들은 것이 전부였습니다.`,
            `프로스페로는 그 섬에서 마법을 배웠습니다. 배에 싣고 온 책으로 익힌 것이었습니다. 쫓겨날 때 어느 신하가 몰래 실어 준 책이었습니다. 그 책이 없었으면 이 이야기가 없었습니다. 그 섬에는 원래 사는 것이 둘 있었습니다. 공기의 정령 에어리얼과, 캘리번이라는 이였습니다.`,
            `캘리번은 그 섬에서 태어난 이였습니다. 프로스페로가 처음 왔을 때 캘리번은 그에게 섬을 안내해 주었습니다. 물이 어디 있고 무엇을 먹어도 되는지 다 알려 주었습니다. 그 섬에서 나고 자란 사람만 아는 것이었습니다. 물이 어느 바위 밑에서 나는지, 어느 열매가 사람을 앓게 하는지 다 알려 주었습니다. 프로스페로는 그것으로 그 섬에서 살아남았습니다. 그런데 나중에 프로스페로는 캘리번을 부리게 되었습니다. 섬의 주인이 바뀐 셈이었습니다.`,
            `캘리번이 이렇게 말하는 대목이 있습니다.<br>"이 섬은 원래 내 것이었소. 당신이 처음 왔을 때 나는 당신에게 물이 어디 있는지 알려 주었소. 그런데 지금 나는 이 섬에서 당신의 종이오."`,
            `이 대사 때문에 이 작품은 사백 년 뒤에 아주 다르게 읽히게 되었습니다. 배를 타고 와서 원래 살던 사람을 부리게 되는 이야기가, 그 뒤 실제로 세계 곳곳에서 일어났기 때문입니다. 그래서 요즘은 이 작품을 캘리번 쪽에서 읽는 사람도 많습니다. 사백 년 전에는 아무도 그렇게 읽지 않았습니다. 읽는 자리가 바뀌면 같은 대사가 다르게 들립니다.`,
            `그해에 프로스페로는 기회를 잡았습니다. 동생 안토니오가 탄 배가 그 섬 근처를 지나게 된 것입니다. 열두 해를 기다린 끝이었습니다. 프로스페로는 폭풍을 일으켜 그 배를 섬에 밀어붙였습니다. 아무도 다치지 않게 했습니다. 배는 부서진 것처럼 보이게 해 두었습니다. 옷 한 자락도 젖지 않게 했습니다.`,
            `사람들이 섬 여기저기에 흩어져 내렸습니다. 그 가운데 나폴리 왕의 아들 페르디난드가 있었습니다. 혼자 바닷가에 내렸습니다.`,
            `페르디난드는 미란다를 만났습니다. 두 사람은 곧 서로에게 마음이 갔습니다. 미란다는 열두 해 동안 아버지와 캘리번 말고는 사람을 본 적이 없었습니다. 그래서 뒷날 배에서 내린 사람들을 한꺼번에 보았을 때 이렇게 말했습니다.<br>"오, 놀라워라. 이런 것들이 여기 있었구나. 사람이 이렇게 아름답구나. 이런 사람들이 있는 세상이라니, 그 세상은 얼마나 멋질까."`,
            `그 말은 이 작품에서 아주 유명한 대사입니다. 그런데 그 말을 하는 순간, 미란다가 보고 있는 사람들 가운데는 자기 아버지를 배신한 자도 있었습니다. 미란다는 그것을 몰랐습니다. 세상을 처음 본 사람의 말이었기 때문입니다. 그 말이 아름다운 만큼 위태롭기도 합니다. 아무것도 겪지 않은 사람만 그렇게 말할 수 있습니다.`,
            `마지막에 프로스페로는 모두를 한자리에 불러 모읍니다. 열두 해 만에 형제가 마주 선 것이었습니다. 동생은 형이 죽은 줄 알고 있었습니다. 그 자리에서 아무 말도 하지 못했습니다. 프로스페로는 그런 동생을 용서합니다. 그리고 이렇게 말합니다.<br>"복수보다 용서가 더 귀한 일이다."`,
            `그러고는 마법을 버립니다. 더는 쓰지 않겠다는 것이었습니다. 지팡이를 부러뜨려 땅에 묻고, 책을 바다에 던집니다. 열두 해 동안 익힌 것을 그 자리에서 버린 것입니다. 되찾을 길이 없게 했습니다.`,
            `이것이 셰익스피어가 혼자 쓴 마지막 작품입니다. 그래서 사람들은 프로스페로가 마법을 버리는 대목을 셰익스피어 자신의 작별로 읽기도 합니다.`,
            `이 작품의 마지막 대사는 이렇습니다. 프로스페로가 관객 쪽으로 돌아서서 이렇게 말합니다.<br>"이제 제 마법은 다 사라졌습니다. 저를 여기서 놓아 주십시오. 여러분의 손으로요."`,
            `그것은 박수를 쳐 달라는 말입니다. 연극을 끝내는 인사인 셈입니다. 무대에서 마법을 부리던 사람이 마지막에는 보는 사람에게 손을 내미는 것입니다. 셰익스피어가 마지막으로 남긴 말이 그것이었습니다.`
        ]
    }
];
/* ── 쪽 나누기 ─────────────────────────────────────────
   그림은 쪽 위쪽에 가로로 꽉 차게 얹고 그 아래를 글로 채운다.
   그러니 그림이 있는 펼침면에도 양쪽 쪽에 다 글이 들어간다.
   다만 그림이 얹힌 쪽은 그림 높이만큼 글이 적게 들어간다.
   진짜 책이 그렇듯 문단 한가운데에서도 쪽을 넘긴다. 그래야 쪽마다 글이 고르게 찬다.
   글자 수로 어림잡으면 대사가 많은 문단은 실제로 차지하는 줄이 훨씬 많아 어긋나므로,
   보이지 않는 쪽을 하나 만들어 실제 높이를 재어 가며 나눈다. */

/* 영어판. 우리말 원고와 장·문단 수를 맞춘다. 대사 줄은 <br>로 나눈다. */
const EN = {
    title: 'Tales from Shakespeare',
    cover: {
        title: 'Tales from Shakespeare',
        tag: 'after William Shakespeare',
        intro: [
            `London, four hundred years ago: plays acted in a round theatre with no roof and no lights, only while the sun was up. Boys played the women's parts, and if the crowd did not like what it saw, it threw things.`,
            `Of the thirty-seven plays written for that hard-to-please crowd, seven are retold here as stories.`
        ]
    },
    chapters: [
        {
            title: 'The Man Who Built a Theatre',
            paras: [
                `About four hundred years ago there lived in England a man called William Shakespeare. He joined a company of players in London and worked as an actor, and later he wrote plays. At first his job was putting other people's plays on the stage. As an actor, they say, he never made much of a name. He was a young man up from the country. He had not been to university, and his family was nothing special. For such a man to make a name in the London of those days was a rare thing. He came from a small town called Stratford. His father made and sold gloves. There was not a writer in the family. A play is the script for what is acted on a stage. It is a piece of writing that sets down who says what. It was not written to be read; it was written to be put on. So it is read a little differently from a novel.`,
                `Shakespeare wrote thirty-seven plays in his life. They fall into the ones that end sadly, the ones that end in laughter, and the ones about kings of old. The first kind is called tragedy and the second comedy. The seven plays in this book include all three. He wrote the thirty-seven over about twenty-five years — one or two a year. All that while he went on acting as well. But there is one thing to know before reading them. The theatre of those days was very different from ours. Read without knowing that, and a great deal looks strange. It is also why the characters talk to themselves at such length.`,
                `The theatre was a round building with no roof. The middle was open to the sky, so plays could only be given while there was daylight. The seats went round in three tiers, and about two thousand people fitted in. One Londoner in ten, they say, went to a play at least once a month. In the London of that time, a play was what a film is to us. The company Shakespeare belonged to later built a theatre of its own. Its name meant the globe. That theatre burned down afterwards, and four hundred years later it was rebuilt on the same spot. So performances were usually in the afternoon. If it rained, there was no play that day. In winter the days were short and there were fewer plays. There was hardly any painted scenery on the stage. There was no curtain either. When the scene changed, the stage stayed as it was. So where we were had to be told in words. That is why the lines keep describing the place. When somebody mentions the moon or the wind, it is not idle talk. That was the scenery for the day.`,
                `If the scene was a wood, an actor would say, "How dark this wood is." And that made it a wood. The audience had to build the wood in their heads. That is why the words mattered so much. There were no lights either. The sun shone straight down. And yet night scenes had to be played.`,
                `For a night scene an actor came out carrying a torch. A torch carried out in broad daylight made it night. The audience accepted it that way. It was very unlike the way we watch a stage now. And the women's parts were played by boys. In the England of those days, women were forbidden to appear on the stage. Women did not act on stage until about fifty years later. So Shakespeare wrote his women without ever once having seen an actress.`,
                `So Juliet, too, was played by a boy. They chose a boy whose voice had not yet broken. Once his voice broke, he could not play the part any more.`,
                `The audience was different too. The cheapest place was the bare ground in front of the stage. There were no seats; people stood. The price was a penny, which was about the price of a loaf of bread in those days. So working people could see a play too. The covered seats in the upper tiers cost several times as much. Watching the same play, people were sorted by where they sat.`,
                `The people standing down there were called the penny crowd. If they did not like what they saw, they jeered and threw things. Some threw the apples they were eating. Standing makes the legs ache, and they could not bear much. If a play was dull, the noise began at once. So Shakespeare wrote for a very hard-to-please audience. If it was not entertaining, it showed on the spot. The next day there were fewer people. So he had to put entertainment and meaning together.`,
                `He had to hold those people for two hours — the ones standing on the bare ground, I mean. They bought the most tickets. That is why something is always happening in his plays. Sword fights, ghosts, disguises, letters that go astray, news that arrives wrong. All of it is in the seven plays in this book. There is one with a ghost, and two in which a woman dresses as a man. There is one in which a letter arrives late and people die. In those days a letter was carried on foot. So a letter being late was an everyday thing. What seems maddening to us now was quite likely then. And in between all of it are words that reach into the heart.`,
                `That is why they have lasted four hundred years. If they had only been entertaining, the laughing would have stopped there. It is the words in between that have kept them alive.`,
                `This book holds seven of them. They were chosen because they are the best known. Three end in laughter and four end in sorrow. You may read the sad ones first or last. Only, do not go straight from one into the next. When one is finished, it is better to close the book for a while. The plays have been turned into stories here. What takes two hours on the stage has been shortened to a few pages. So if you ever see one of them on a stage after reading this, take that as the real thing. This book only shows the way there. When one day you hear an actor speak those lines, they will sound very different from what you read here.`,
                `The first people to do this were a brother and sister, two hundred years ago: Charles Lamb and Mary Lamb. The two of them rewrote Shakespeare as stories that children could read. That was two hundred years ago. Until then there was no Shakespeare a child could read. They divided the work between them: the sad ones went to the brother, they say, and the ones that end in laughter to the sister. But when the book came out, only the brother's name was on it. In those days it was hard to publish a book under a woman's name. Mary Lamb's name did not reach the cover until long afterwards. That book is still read today. In two hundred years it has never once gone out of print. Children meeting Shakespeare for the first time still meet him there. This book was made to stand in the same place. Meet the plays here, and go on to the real ones later. This book follows the same method. Only, the famous lines have been kept as they are, as far as possible. Because those lines are the heart of each play.`
            ]
        },
        {
            title: "A Midsummer Night's Dream",
            paras: [
                `In Athens there was a young lady called Hermia. This whole story happens in a single night. She loved a young man called Lysander. But her father meant to marry her to another young man, Demetrius. Hermia could not bear him.`,
                `By the law of Athens in those days, a daughter who did not do as her father decided was severely punished. A daughter had no choice at all. If she refused, she lost her life or was shut away for the rest of it. Hermia knew that, and decided to run away all the same. So Hermia and Lysander agreed to run away together. They would meet in the wood and go to another country. They would leave at night, without anybody knowing. They would meet under a great tree at the edge of the wood. What kind of wood it was, they did not know.`,
                `Hermia told her plan to her friend Helena. But Helena was in love with Demetrius. Helena told Demetrius what was afoot. She did it to please him. She thought he would be grateful. Instead, Demetrius ran straight off to the wood.`,
                `So that night all four of them went into the wood. And in that wood lived fairies.`,
                `Oberon, the king of the fairies, and his queen Titania were having a great quarrel that day. When those two quarrelled, they said, even the weather turned bad. That year the rain would not stop and the grain did not ripen. People did not know why. Oberon sent his servant Puck on an errand: fetch the juice of a certain flower. Puck had it back in the blink of an eye. He could go once round the earth in forty minutes, he said. That was the kind of servant he was.`,
                `Rub that juice on the eyes of somebody sleeping, and they fall in love with the first thing they see on waking. Oberon meant to use it on his queen.`,
                `Then, in the wood, he saw Helena clinging to Demetrius and being pushed away. Oberon felt sorry for her and said to Puck,<br>"There is a young man here in Athenian clothes. Put this on his eyes as well."`,
                `But that night there were two young men in Athenian clothes in that wood. Oberon gave the order without knowing it. Saying only "a young man in Athenian clothes" was the root of the trouble. That is how errands go wrong. Puck put the juice on the wrong man. The first thing Lysander saw on waking was Helena. As it happened, she was just passing by. So Lysander began to chase after Helena.`,
                `When Oberon found out, he sent Puck again. This time the juice went on Demetrius. Demetrius woke and saw Helena too. So now both young men were chasing Helena.`,
                `Helena thought the two of them were making fun of her, and grew angry. Nobody had so much as looked at her before, and now two men were after her at once; no wonder she thought so. Until then she had been a girl Demetrius only ever pushed away. So she could not believe it. Hermia, who overnight had nobody looking at her at all, wept. The four of them ran about the wood all night, quarrelling. Puck watched from a tree and laughed. It was his own mistake that had caused it all. He enjoyed it even so.`,
                `Meanwhile something else was going on in that wood. Some workmen from the town had come there to rehearse a play. It was for the Duke's wedding. Puck, for a joke, changed one of their heads into a donkey's head. And just then Titania woke.`,
                `So the queen of the fairies fell in love with a workman with a donkey's head. When dawn came, Oberon put everything right again.`,
                `In the morning the four young people woke in the wood. And they took everything that had happened that night for a dream.`,
                `Only one thing remained. Demetrius went on loving Helena. Oberon had left that one on purpose. So both couples married. Together with the Duke's wedding, three couples were married in one ceremony. And at the feast the workmen's play was performed. The man who had worn the donkey's head had the leading part.`
            ]
        },
        {
            title: 'The Merchant of Venice',
            paras: [
                `In Venice there was a merchant called Antonio. He had several ships. His friend Bassanio came to borrow money. He wanted to go and ask for the hand of a lady called Portia, of Belmont, and for that he needed to look the part. He could not go empty-handed. In those days a man went courting with attendants and baggage. If he arrived looking shabby, he would not even be received.`,
                `All Antonio's money was out at sea in his ships. He would have cash in hand only when the ships came home. So he decided to borrow from a man called Shylock. Shylock lent money and charged interest for it. He was one of the leading men in that trade in Venice. Venice was a city that lived by trade. So lending money was what kept the city turning.`,
                `In the Venice of those days a Jew was not allowed to do any other work. The law limited what trades they could follow; they could not live outside a fixed quarter; and when they went out they had to wear a hat with a mark on it. That was so they could be recognised from a distance. At night the gates of the quarter were locked from outside.`,
                `And Antonio had insulted Shylock many times. He had once spat at him in the street. And now he was coming to borrow money. Antonio saw nothing strange in that. In those days it was not thought strange.`,
                `Shylock said,<br>"This time I shall take no interest. Instead, for sport, let us make one condition. If you cannot pay, you give me a pound of your flesh."`,
                `Antonio took it as a joke and signed. He was sure his ships would soon be home. Six ships could not all sink, he thought. But that is what happened.`,
                `Bassanio took the money to Belmont and married Portia. And just then the news came.`,
                `Antonio's ships had all gone down. Not one came home. And Shylock went to law. He would have what the paper said. The court sat.`,
                `The Duke pleaded with Shylock.<br>"Take three times the money, and step back."`,
                `Shylock refused. And he said this:<br>"Hath not a Jew eyes? Hath not a Jew hands? If you prick us, do we not bleed? If you tickle us, do we not laugh? If you poison us, do we not die?"<br>"The villainy you teach me I will execute."<br>He was not saying that he was right. He was saying: you have done the same to me.`,
                `That is the most famous speech in the play.`,
                `Then a young lawyer came into the court. In truth it was Portia, dressed as a man. She had learned the law beforehand from a relation who knew it. In those days a woman could not stand in a court. So she had to wear a man's clothes.`,
                `Portia said,<br>"This bond is good. Take your pound of flesh."`,
                `Shylock raised his knife. Then Portia spoke again.<br>"But this bond says flesh only. It says nothing of blood."<br>"So shed not one drop of blood. Shed one drop, and all your goods are forfeit."`,
                `Shylock stood frozen where he was. The knife he had raised came down. He said he would withdraw. But the trial did not end there.`,
                `The court took half of Shylock's property and put the rest out of his control. And it ordered him to change his religion. Shylock accepted it and left the court. He went without a word. The people there found it a fine victory. Most people reading it today do not.`,
                `After that he does not appear in the play again.`,
                `The play was written as a comedy. But hardly anybody watches it laughing now. In four hundred years the watchers have changed. The play is the same; the readers are different. When you read an old work, you have to look at that difference too.`
            ]
        },
        {
            title: 'Romeo and Juliet',
            paras: [
                `In Verona, in Italy, there were two families: the Montagues and the Capulets. The two houses had been enemies for a very long time. It had been so since the days of their grandfathers' grandfathers.`,
                `Why it had begun, even the families themselves did not know. It was too long ago. If they met in the street, even the servants drew their swords. The people of Verona were worn out by the feud. When a fight broke out in the street, the market broke up. The Prince had forbidden it many times, and still it went on.`,
                `One day a great feast was held at the Capulets' house. Romeo of the Montagues put on a mask and slipped in with his friends. It was a dangerous thing to do. He had gone into the feast of his family's enemies. It was possible only because so many of the guests wore masks. And there he saw Juliet.`,
                `Juliet was the daughter of the Capulets. She was thirteen. Romeo was about sixteen. Both of them were still children. In those days people did sometimes marry at that age. Even so, it was very young.`,
                `The two of them lost their hearts to each other on the spot. They exchanged only a few words. And then they learned who the other was, and froze. Of all people, an enemy. Neither could say a word.`,
                `That night Romeo climbed the wall into the Capulets' garden. Juliet came out onto her balcony and was talking to herself. It was a night of bright moonlight.`,
                `"O Romeo, Romeo, wherefore art thou Romeo?"<br>"What's in a name? That which we call a rose by any other name would smell as sweet."`,
                `Romeo heard it from below. He was standing in the shadow of a tree. He had not hidden there to listen. He had been unable to step forward, and so had come to hear it.`,
                `Next day the two of them went to Friar Laurence and were secretly married. The friar had a reason for helping. He thought this marriage might reconcile the two families. It was done with the best of intentions. What becomes of that good intention is the frightening part of this play.`,
                `But that afternoon something happened. In the street, Juliet's cousin Tybalt ran into Romeo's friend Mercutio. Romeo stepped between them to stop the fight. And in that moment Mercutio was stabbed. Trying to part them, Romeo had only got in the way. The blade went in under Romeo's arm.`,
                `Mercutio said, as he died,<br>"A plague on both your houses."`,
                `Romeo lost his head then. And he ran Tybalt through. That same day Romeo was banished from Verona. He had to be out of the city before sunset.`,
                `Meanwhile Juliet's father decided to marry her to a man called Paris. The wedding was three days off.`,
                `Juliet ran to Friar Laurence. There was nowhere else to go. The friar gave her a potion. Whoever drank it would seem dead for forty-two hours. Breath and pulse would seem to have stopped, he said. In those days people believed such potions existed. The friar was a man who worked with herbs.`,
                `The plan was this. Juliet would drink it and be carried to the tomb; Romeo would come there and take her away when she woke. The friar sent a letter to Romeo setting out the plan.`,
                `But the man carrying the letter was stopped on the road.`,
                `A plague was going about that district, and travellers were being shut up. The letter stayed in the man's coat. He was shut in and could not get out. There was nobody to send in his place. So Romeo never received the letter. Instead he received other news.`,
                `The news that Juliet was dead. What happens at the end of this story is well known. Romeo ran to the tomb and took his own life beside the sleeping Juliet, and Juliet, waking to find him, followed him. Had the letter come one day earlier, none of it would have happened.`,
                `Afterwards the two families met before the tomb. And that day they made peace. The most frightening thing in this play is neither the feud nor the poison. It is one letter arriving late. It could have been prevented. That is what makes the play hurt more.`
            ]
        },
        {
            title: 'Hamlet',
            paras: [
                `The King of Denmark died suddenly. He had been bitten by a snake, they said, while he slept in his orchard. That was all anybody was told. And within two months the Queen married the King's brother, Claudius. People said the dishes from the funeral were set out again for the wedding feast. In two months it had come to that. Nobody in the castle spoke of it out loud.`,
                `Claudius became the new king. Prince Hamlet could not bear it. He would not put off his mourning clothes. It was two months since his father's death. Everybody else had put off mourning. In that hall, the only man in black was Hamlet.`,
                `One night the soldiers keeping watch on the walls saw a strange thing. Something in the shape of the dead king was walking on the battlements. It wore his very armour. Hamlet heard of it and went there at night. The soldiers tried to stop him, and he went all the same. It was dangerous, they said. But Hamlet would not listen. And he met the thing.`,
                `It said this:<br>"I did not die of a snake's bite. Your uncle poured poison into my ear."<br>"Revenge me."`,
                `Hamlet heard it and sank to the ground. If what he had heard was true, his uncle had killed his father. And his mother had married that man.`,
                `But here this play parts company with other revenge stories. In such stories the hero usually goes straight off to take his revenge. Hamlet did not.`,
                `Hamlet thought like this. Is that really my father? Or is it something sent to trick me into killing my uncle? If I kill a man without making sure, how am I different from my uncle? Killing without making sure is exactly what his uncle had done. Hamlet reckoned that out on the spot.`,
                `So Hamlet decided to make sure. As it happened, a travelling company of players came to the castle. They were actors Hamlet had known for years. Whenever they came, he had been glad to see them. So they did what he asked. Hamlet had them put on a certain play. It was a play with a scene in which poison is poured into a king's ear. And in that scene he watched his uncle's face.`,
                `At that scene Claudius sprang up and left the hall. His face had gone white. That told Hamlet what he wanted to know. And yet after that Hamlet went on putting it off for a long time. Once he drew his sword and put it back again. He had found his uncle at prayer and stopped. A man killed while praying, he believed, would escape punishment.`,
                `For four hundred years people have argued about this. Why did he delay? Some say he was a coward; some say he thought too much. Neither answer quite fits.`,
                `There is another way of putting it. Hamlet kept on asking whether killing a man was right. And while he asked, a number of people died. Other people paid the price of his delay. Polonius and Ophelia were part of that price. That is what makes the play so heavy.`,
                `There was a time when Hamlet stabbed somebody hiding behind a curtain, thinking it was his uncle. The man was a councillor called Polonius, the father of Ophelia, the girl Hamlet loved. He had struck without making sure. The man who had said he would not kill without making sure had done exactly that. Hamlet carries that with him from then on.`,
                `After that, Ophelia's mind clouded over. She wandered the corridors of the palace singing. She picked wild flowers and gave one to everybody she met — this flower for you, that one for you. She was a girl who had lost her father and been spoken to cruelly by the man she loved. Not long afterwards she died by the river. Shakespeare did not put that scene on the stage. We hear it only in the Queen's telling.`,
                `In the last scene several people die at once. There was poison laid ready as well as swords for the duel. Hamlet dies too. The last thing Hamlet asked before he died was this: that his friend Horatio should tell his story to the world truly. And that, we are told, is why the story has come down to us.`,
                `The most famous line in the play is this:<br>"To be, or not to be, that is the question."`,
                `But those words do not mean that he wants to die. They ask which is right — to endure, or to fight back. Hamlet never let go of that question. He never found an answer. But he never stopped asking either.`
            ]
        },
        {
            title: 'King Lear',
            paras: [
                `In ancient Britain there was an old king called Lear. He had three daughters: Goneril, Regan and Cordelia.`,
                `When Lear grew old he decided to divide his kingdom among the three of them. But before dividing it, he set them this task:<br>"Tell me how much you love me. The one who says it best shall have the best land."<br>The land had already been divided into three. So the occasion was not a test at all. It was a chance to hear what he wanted to hear.`,
                `Goneril, the eldest, spoke first.<br>"I love you more than eyesight, more than life, more than liberty."<br>Regan, the second, spoke next.<br>"What my sister has said is not enough. Nothing gives me joy but you, Father."<br>Both daughters had prepared their speeches beforehand. Lear did not notice.`,
                `Lear was satisfied. And he turned to Cordelia, the youngest. Cordelia was the daughter he loved best. Lear asked,<br>"And what will you say?"<br>Cordelia said,<br>"Nothing, my lord."<br>"Nothing?"<br>"I love you as a child should love a father. No more, and no less."<br>"When I have a husband, half my heart will go to him. If, like my sisters, I said that you were everything to me — then why did my sisters ever marry?"<br>She was the only one in that hall who said such a thing. And so it was the one that hurt most to hear.`,
                `It was, in fact, a very honest answer. But Lear heard it and flew into a rage. And he cast Cordelia out. He gave her no land at all. That is what he did to the daughter he loved best. It happened at the moment he was told the truth.`,
                `The King of France was there in the hall. The King of France said,<br>"I will take that lady for my wife. Land or no land."<br>The other suitor who was present drew back as soon as he heard there was no land. The two of them were sorted out in that instant.`,
                `Cordelia went to France. Lear divided the kingdom between his two other daughters. He himself would keep a hundred knights and live by turns in each daughter's house. But once they had the land, the two daughters changed.`,
                `At the elder daughter's house he was told to cut his knights to fifty. So he went to the second daughter's house. She told him to cut them to twenty-five. So he went back to the first.`,
                `This time it was not one. A hundred became fifty, fifty became twenty-five, and twenty-five became none. It took only a few months to come down that far. That night Lear was turned out of both his daughters' houses. And he went out onto the heath in a storm.`,
                `On that heath Lear goes mad. But there is something strange in this play. As Lear goes mad, he begins for the first time to say what is true.`,
                `On the heath Lear says this:<br>"Poor naked wretches, wheresoever you are, how do you bear a night like this?"<br>"I have taken too little care of this. When I was king, I never once thought of such things. Live only under a roof, and you never see the people in the rain."<br>Lear learned that only on the heath.`,
                `At the end, Cordelia comes from France with an army to rescue her father. And the two of them meet. But what follows does not end well.`,
                `Cordelia loses her life in that war, and Lear dies with his daughter in his arms.`,
                `When Shakespeare wrote this play, the old story it came from had a happy ending. Cordelia rescued her father and all went well.`,
                `Shakespeare changed that on purpose. And for a hundred and fifty years afterwards, the English theatre found that ending too hard to bear and changed it back. Only later did they begin to stage it as written. For a hundred and fifty years people saw only the softened ending. Making us bear what is hard to bear is what this play sets out to do.`
            ]
        },
        {
            title: 'Macbeth',
            paras: [
                `In Scotland there was a general called Macbeth. He was a favourite of King Duncan. He was on his way home from a great victory in battle. He was the soldier who had saved the country. On a heath he met three women. They spoke to him like this, one after another, a line each. When they had finished they vanished on the spot. Banquo, who was with him, saw all of it too.<br>"All hail, Thane of Glamis."<br>"All hail, Thane of Cawdor."<br>"All hail, Macbeth, that shalt be king hereafter."`,
                `Macbeth was Thane of Glamis at the time. Everybody knew that. He was not Thane of Cawdor. Another man held that title. But before he reached his castle, news came. A rider galloped up to tell him. It was a messenger straight from the battlefield. Macbeth heard it and stood a long while.`,
                `The King had made Macbeth Thane of Cawdor. So the second greeting had come true. The first had been true already. From then on Macbeth began to think about the third. He thought of it even in his sleep. Two had come true, so the third would too, it seemed. From that moment the thought never left him.`,
                `Macbeth told his wife about it in a letter. He sent it straight from the battlefield. He wanted her to have the good news first. What that letter would lead to, he did not know. Lady Macbeth read it and made up her mind at once.`,
                `A few days later King Duncan came to stay at Macbeth's castle. He had come to honour him for the victory. He walked in on his own two feet. That was how much he trusted Macbeth. That night Macbeth hesitated again and again.<br>"He came here trusting me. I am his general and his kinsman. I should be protecting my guest, and instead I..."`,
                `Lady Macbeth said,<br>"Then give it up. Only, live the rest of your life knowing you are a coward."<br>That one sentence moved Macbeth. Being called a coward was harder to bear than fear.`,
                `That night King Duncan died. And the blame was laid on the sleeping servants. Macbeth became king. Duncan's two sons fled the country that night. But it is from here that the real play begins.`,
                `Once he was king, Macbeth could not sleep. When he shut his eyes he saw that night. And he grew afraid that somebody knew what he had done. A single glance from a courtier made him start. Nobody knew, and yet everybody seemed to know. That was what kept him awake. So he had his friend Banquo killed. Because Banquo had heard the prophecy too.`,
                `And after that he went on killing. He hunted Banquo's son as well. Once begun, it could not be stopped. Each killing made somebody else who knew. Every time he removed one, the number who knew grew. So it went faster and faster.`,
                `Macbeth says this:<br>"I am in blood stepped in so far that, should I wade no more, returning were as tedious as go o'er."`,
                `Lady Macbeth broke too. The one who had made up her mind first was the first to fall. When she was driving him on, nothing seemed to touch her. And yet she went first. Night after night she walked in her sleep, washing her hands over and over.<br>"All the perfumes of Arabia will not sweeten this little hand."`,
                `And then she died. What Macbeth said when he heard the news is the most famous speech in the play.<br>"Life's but a walking shadow, a poor player that struts and frets his hour upon the stage, and then is heard no more. It is a tale told by an idiot, full of sound and fury, signifying nothing."`,
                `At the end Malcolm comes with an army. He was Duncan's son. And Macbeth ends in that battle. It was before the castle gate.`,
                `What makes this play frightening is not a monster. It is that the frightening thing is inside a man.`,
                `Because Macbeth was not a bad man to begin with. In the first scene he is the soldier who saved his country. From there to here took only a few steps. Once the first line is crossed, the rest comes easily. This play shows those few steps very closely.`
            ]
        },
        {
            title: 'The Tempest',
            paras: [
                `Prospero, Duke of Milan, loved reading. He left the running of the state to his brother Antonio and lived in his library. Books filled the room. Then Antonio took his brother's place. It was done in a single night. The man he had trusted with the state took the state. Prospero learned of it only at dawn that day.`,
                `Prospero and his three-year-old daughter Miranda were put into a rotten boat and set adrift on the sea. The two of them came ashore on an island. It was an island where hardly anybody lived. And they lived there for twelve years. In that time Miranda grew to fifteen. She had been three at the time, so she did not remember Milan. All she knew was what her father had told her.`,
                `On that island Prospero learned magic. He learned it from books he had brought in the boat. A courtier had secretly loaded them when he was cast out. Without those books there would be no story. There were two creatures already living on the island: Ariel, a spirit of the air, and one called Caliban.`,
                `Caliban had been born on the island. When Prospero first came, Caliban showed him about it. Where the water was, what could be eaten — he told him all of it. Only somebody born and bred there knew such things. Which rock the spring ran under, which fruit made you sick. Prospero survived on that island because of it. But later Prospero came to make Caliban his servant. The island had changed masters.`,
                `There is a passage where Caliban says this:<br>"This island's mine. When thou camest first, I showed thee where the water was."<br>"And now I am thy slave on this island."`,
                `Because of those lines, four hundred years later this play came to be read very differently. Stories of people who arrived by ship and made servants of those already living there afterwards really happened, all over the world. So nowadays many people read this play from Caliban's side. Four hundred years ago nobody read it that way. Change where you stand, and the same lines sound different.`,
                `That year Prospero saw his chance. A ship carrying his brother Antonio was to pass near the island. It was the end of twelve years' waiting. Prospero raised a storm and drove the ship onto the island. He saw to it that nobody was hurt. He made the ship look wrecked. Not a hem of a garment got wet.`,
                `The people came ashore scattered about the island. Among them was Ferdinand, the son of the King of Naples. He came ashore alone on the beach.`,
                `Ferdinand met Miranda. The two of them were soon in love. In twelve years Miranda had seen nobody but her father and Caliban. So she said this:<br>"O, wonder! How many goodly creatures are there here! How beauteous mankind is!"<br>"O brave new world, that has such people in it."`,
                `Those are among the most famous lines in the play. But at the very moment she says them, among the people Miranda is looking at is the man who betrayed her father. Miranda did not know that. They were the words of somebody seeing the world for the first time. As lovely as the words are, they are just as dangerous. Only somebody who has been through nothing can speak like that.`,
                `At the end Prospero calls everybody together in one place. The brothers stood face to face for the first time in twelve years. The younger had believed the elder dead. He could not say a word. And Prospero forgave his brother. And he says this:<br>"The rarer action is in virtue than in vengeance."`,
                `And then he gives up his magic. He would use it no more. He breaks his staff and buries it in the earth, and drowns his book in the sea. What he had spent twelve years learning, he threw away on the spot. He made sure there was no getting it back.`,
                `This is the last play Shakespeare wrote on his own. So people often read the scene where Prospero gives up his magic as Shakespeare's own farewell.`,
                `The last lines of the play are these. Prospero turns to the audience and says:<br>"Now my charms are all o'erthrown. Release me from my bands, with the help of your good hands."`,
                `That is a request for applause. It is the bow that ends the play. The man who has worked magic on the stage holds out his hand, at the very end, to the people watching. Those were the last words Shakespeare left.`
            ]
        }
    ],
    afterword: {
        title: 'After Reading',
        paras: [
            `What this book holds is not a novel. It is a set of plays retold as stories. What Shakespeare wrote was nothing but the lines the actors speak on the stage.`,
            `So the original has none of the things you find here — what face somebody made, what they were thinking at the time. Those were for the actor to make on the stage.`,
            `The writer was William Shakespeare of England. He was born about four hundred and sixty years ago in a small town called Stratford-upon-Avon.`,
            `He was the son of a glove-maker. He did not go to university. He went, we are told, no further than the grammar school.`,
            `Because of that, some people have doubted whether he really wrote all those plays. How could a man from the country with only a grammar-school education know so much about courts and law and foreign lands? Scholars today mostly agree that he did write them.`,
            `At about twenty he went to London. What he did for the next few years, there is no record. People call that time the lost years.`,
            `Very little record of Shakespeare survives at all. The day he was baptised, the day he married, the days his children were born, papers about property he bought and sold, and his will. Nothing at all that sets down what he thought.`,
            `In London he began as an actor. Then he wrote plays, became a shareholder in the company, and put money into building a theatre. So he was not only a writer; he was a man who ran a theatre.`,
            `And so he made money. He bought a large house in his home town, and land as well. Among the playwrights of the day, few managed that.`,
            `The theatre he built was called the Globe. That means the earth. It later burned down because of a cannon fired as a stage effect.`,
            `He left about thirty-seven plays. He left a great many poems as well. What is here is a selection of the best-known seven, retold.`,
            `Seven years after his death, two fellow actors gathered his plays into a book. Without that book, about half of them would have been lost. In those days a script was the property of the company, and it was not usual to print it.`,
            `That book is called the First Folio. About two hundred and thirty copies survive, and a single copy has sold for a sum in the tens of billions of won.`,
            `Now let us pick out some places worth a second look.`,
            `First, look again at A Midsummer Night's Dream. In the wood, a fairy puts a potion on people's eyes and makes them love the wrong person. And in the morning it all comes undone.`,
            `But this story asks one question. If love can be changed by a single potion, then what is love when there is no potion?`,
            `The play ends in laughter. But when the laughing is over, the question remains. Shakespeare's comedies are mostly like that.`,
            `And at the end of the play, one of the fairies speaks to the audience. If you did not like this, he says, take it that you have been dreaming. The play crosses back and forth between the stage and the seats like that.`,
            `And inside the play there are people preparing a play of their own. It is the scene where the townsmen put on their clumsy performance. Shakespeare uses this device of a play inside a play more than once.`,
            `It makes the audience see double. The people on the stage watch a play, and we watch them. And that reminds us, for a moment, that what we are watching is a play too.`,
            `Second, read The Merchant of Venice again. There is a contract with a pound of flesh as the security. And in court, that contract is turned upside down.`,
            `Take the flesh, but shed not one drop of blood. Because the paper said flesh only. It is won through a gap in the words.`,
            `But there is something uncomfortable in reading this play today. Shylock's being a Jew is used to paint him as wicked. In the England of that time, prejudice against Jews was severe.`,
            `And what Shylock receives at the end is the loss of his property and an order to change his faith. The audience of that day found it satisfying. We do not see it that way now.`,
            `Yet Shakespeare gives that man words. It is the passage where he asks whether a Jew has not eyes, has not hands, does not bleed when pricked. Because of that passage, the play is still staged today.`,
            `Giving a villain words like that is the peculiar thing about Shakespeare. Because of that one passage, the play cannot become a play that mocks Jews.`,
            `Third, look again at Romeo and Juliet. From the moment they meet to the moment they part is four days. In that short time they meet, marry and die.`,
            `If you read it only as a love story, you have read only half. Why the two houses became enemies is never told in the play.`,
            `It is the story of two children who die because of a hatred that nobody can even explain. And at the end the two houses make peace. Count what that peace is paid for with.`,
            `And the play is full of haste. Had a single letter arrived in time, the two of them would have lived. The man carrying it is held up on the road because of the plague.`,
            `In the Europe of those days plague came round often. Shakespeare's own theatre was closed by it several times. So that scene was a situation the audience knew only too well.`,
            `Fourth, read Hamlet again. The hero of this play knows who killed his father. And through five acts he cannot decide.`,
            `People often call Hamlet indecisive. But the reasons for his hesitation are worth a look. He wanted to make sure whether what the ghost had said could be believed.`,
            `So he stages a play and shows it to the king. He means to judge by the king's reaction. So it was hesitation, but it was an investigation at the same time.`,
            `And this play holds the line more people know than any other: to be or not to be. Look again at where that line comes, and you find that it is not only about death.`,
            `What follows it is the question whether it is better to endure or to fight back. So it is a question about how to live.`,
            `And Hamlet talks a great deal in this play. He has more lines than any other character in Shakespeare. A man who thinks a lot talks a lot.`,
            `Fifth, look again at King Lear. A king divides his kingdom among his three daughters, and asks which of them loves him most.`,
            `Two of them speak prettily and the youngest cannot. So the youngest gets nothing and is sent away. What happens after that is the play.`,
            `It is the darkest of Shakespeare's plays. And at the end, even the good people do not survive. It was so sad that for a hundred and fifty years it was performed with a different ending.`,
            `In that version the youngest daughter lived and King Lear went back to his throne. People preferred it. The original ending returned to the stage only about a hundred and ninety years ago.`,
            `And there is a fool in this play. He is the man who makes jokes at the king's side, and he is the one who tells the plainest truth in the play. There were things that only a man who made people laugh was allowed to say.`,
            `Sixth, look again at Macbeth. The witches tell him he will be king. And because of what they say, he begins to move toward being king.`,
            `So we cannot tell whether the prophecy foretold what would happen, or whether the prophecy made it happen. The play does not separate the two.`,
            `And this play is very short. It is the shortest of Shakespeare's tragedies. It is made as if to say that it does not take long for a man to fall.`,
            `And there is a custom in theatres of not saying this play's name aloud. There is a superstition that saying it brings bad luck. So actors call it the Scottish play instead.`,
            `There was a real king of Scotland behind this play. But the real king, we are told, reigned for seventeen years and was not a bad king at all. Shakespeare drew him as he did partly with an eye to the king of his own day.`,
            `The king of England just then had come from Scotland, and he had even written a book about witches. So there was a reckoning behind putting witches in and painting that king's ancestor kindly.`,
            `It helps to know something of the times. Shakespeare's theatre had no roof. Plays were given by daylight, in the afternoon.`,
            `There was hardly any scenery or lighting. So whether it was night or day, whether this was a wood or a palace, had to be told in the lines. That is why Shakespeare's lines are so full of pictures.`,
            `And the women's parts were played by boys. In the England of that time, women could not appear on the stage. Juliet, too, was played by a boy.`,
            `The theatre held about three thousand people. There were seats and there was standing room, and the standing room was very cheap. The people there were noisy.`,
            `So Shakespeare had to write so that those people would enjoy it too. That is why there are funny passages mixed into his tragedies.`,
            `He made a great many words as well. Among the words and expressions used in English today, several thousand are counted as first appearing in his work.`,
            `When he needed a word that did not exist, he simply made one. He used nouns as verbs and joined two words into a new one. A good many of those are still in English today.`,
            `And he made a great many expressions. People who speak English use them without knowing they are quoting Shakespeare.`,
            `These plays hold on to two things.`,
            `One is how words move people. King Lear divides his kingdom on the strength of his daughters' words. Macbeth moves because of the witches' words. Othello, too, is destroyed by what he is told.`,
            `Shakespeare's characters mostly fall because of words. Since a play is made of words, that fits.`,
            `The other is whether a person knows himself. The characters in these plays learn what they are doing only at the very end. And by then it is too late.`,
            `There is one thing to know when reading Shakespeare. He invented almost none of his stories. Most of the plots he took from old tales or history books.`,
            `Romeo and Juliet was a story already told in Italy, and Hamlet an old tale from Denmark. So his gift was not in making new stories.`,
            `It was in putting people into the stories that existed. The plot was the same, but once what those people were thinking went in, it became something else.`,
            `And he had his characters stand alone on the stage and speak their inmost thoughts. Then the audience hears what is inside a person's head. That device changed the theatre greatly.`,
            `Until then, a character on the stage only spoke to others. Once a character stood alone and spoke to himself, a way of showing the inside of a person opened up.`,
            `If you ever meet these plays again, see them on a stage if you possibly can. They were written not to be read but to be watched.`,
            `And on the stage you will find this out: the lines are the same, but a different actor makes a different person. That is why, staged again and again for four hundred years, they are always new.`,
            `Lastly, here are some things to think about. I shall not write down the answers.`,
            `Was King Lear wrong to make his daughters put their love into words? What happens when we try to measure a heart with words?`,
            `Was Hamlet's hesitation a flaw, or was it the best thing about him?`,
            `And how should we look today at the sentence passed on Shylock? That question is not easy to answer even when you read these stories again as a grown-up.`
        ]
    },
    quiz: [
        { q: "Which of these was NOT a feature of the theatre in Shakespeare's day?", choices: ['There was cheap standing room', 'It had no roof, so plays were given by day', 'Women actors played the leading parts'], answer: 2 },
        { q: 'Who first retold Shakespeare as stories for children?', choices: ['Charles Dickens and his son', 'John Milton and his two daughters', 'Charles Lamb and his sister Mary'], answer: 2 },
        { q: "Why did things go wrong in A Midsummer Night's Dream?", choices: ['Because the fairy king and queen had a great quarrel', 'Because Puck put the flower juice on the wrong man', 'Because of the workmen rehearsing their play'], answer: 1 },
        { q: 'In The Merchant of Venice, what did Shylock ask for instead of interest?', choices: ["One of Antonio's ships", "A pound of Antonio's flesh", "Antonio's house and land"], answer: 1 },
        { q: 'On what grounds did Portia overturn the case?', choices: ['Somebody came forward offering to pay the debt', 'The bond mentioned flesh but not blood', 'The bond had no date written on it'], answer: 1 },
        { q: 'What else does this book tell us about Shylock?', choices: ['Shylock was copied exactly from a real person', 'In those days the law limited where Jews could work and live', 'In the original, Shylock is forgiven and set free at the end'], answer: 1 },
        { q: 'Why did the plan in Romeo and Juliet go wrong?', choices: ['The man carrying the letter was held on the road because of the plague', 'Juliet forgot to drink the potion', 'Romeo misunderstood what the friar had said'], answer: 0 },
        { q: 'Why did Hamlet make sure before taking his revenge?', choices: ['Because his mother held him back', 'Because killing without making sure would make him no different from his uncle', 'Because he thought he could not beat his uncle alone'], answer: 1 },
        { q: 'How did Hamlet test his uncle?', choices: ['He had a play performed with the same scene and watched his face', 'He secretly searched the room where his uncle slept', 'He bribed one of his uncle’s servants to talk'], answer: 0 },
        { q: 'In King Lear, what was Cordelia’s answer?', choices: ['I love you as much as a child should', 'I love you more than words can say', 'I love you more than anything in the world'], answer: 0 },
        { q: 'What did Lear think of for the first time on the heath?', choices: ['How the poor and naked bear a night like this', 'That dividing the kingdom between two daughters was a mistake', 'That he should go to Cordelia and beg her pardon'], answer: 0 },
        { q: 'What did Shakespeare do with the ending of King Lear?', choices: ['He kept the ending of the old story as it was', 'He turned the old tragedy into a happy ending', 'He deliberately turned the old happy ending into a tragedy'], answer: 2 },
        { q: 'Why is Macbeth frightening?', choices: ['Because he was a man who had never lost a battle', 'Because he believed the witches from the very start', 'Because he was not wicked to begin with, but the soldier who saved his country'], answer: 2 },
        { q: 'How did Macbeth himself explain why he could not stop?', choices: ['He was in blood so deep that going back was as hard as going on', 'A man who has worn the crown can never come down', 'What the witches say always comes true'], answer: 0 },
        { q: 'In The Tempest, what did Caliban say?', choices: ['This island was mine, and I showed you where the water was', 'I have always been ashamed of being born on this island', 'The letters you taught me have made me a new man'], answer: 0 },
        { q: 'What did Prospero do at the end?', choices: ['Handed his magic to his daughter and stayed on the island', 'Imprisoned his brother on the island and went to Milan', 'Forgave his brother and gave up his magic'], answer: 2 },
        { q: 'Which of these is NOT a fair thing to say after reading this book?', wide: true, choices: ['Seeing how Portia said to cut the flesh but shed not a drop of blood, she was keeping the contract on Shylock’s behalf.', 'Seeing how The Merchant of Venice was a comedy but hardly anyone laughs at it now, the play is the same and it is the watchers who have changed.', 'Seeing how some people now read The Tempest from Caliban’s side, stories of people arriving by ship and making servants of those already there really happened all over the world afterwards.', 'Seeing how all Shakespeare wrote was the lines, what face anyone made was something the actors had to make on the stage.'], answer: 0 }
    ]
};

/* ── 말 바꾸기 ─────────────────────────────────────────
   영어 원고(const EN)가 있는 책은 위쪽 단추로 영어 쪽을 갈아 끼운다.
   소설틀은 글을 재서 쪽을 나누므로, 말을 바꾸면 쪽을 통째로 다시 잰다.
   영어 원고가 없는 책은 단추가 아예 뜨지 않는다. */
const UI = {
    ko: {
        toc: '차례', quiz: '이야기 문제', after: '읽고 나서', home: '학습 허브로 돌아가기',
        page: n => `${n}쪽`, done: (n, all) => `${n} / 총 ${all}문항 완료`,
        label: CHAPTER_LABEL, other: 'EN', otherAria: 'Read in English'
    },
    en: {
        toc: 'Contents', quiz: 'Story Questions', after: 'After Reading', home: 'Back to the learning hub',
        page: n => `p. ${n}`, done: (n, all) => `${n} of ${all} answered`,
        // 「n장 ·」 꼴이면 Chapter n · 로, 「n. 」 꼴이면 그대로, 없으면 없는 대로.
        label: n => { const k = CHAPTER_LABEL(n); return !k ? '' : /장/.test(k) ? `Chapter ${n} · ` : k; },
        other: '한국어', otherAria: '한국어로 읽기'
    }
};
const LANG_KEY = 'world-novels-lang';
const HAS_EN = typeof EN !== 'undefined';
const readLang = () => { try { return localStorage.getItem(LANG_KEY); } catch (e) { return null; } };
const saveLang = v => { try { localStorage.setItem(LANG_KEY, v); } catch (e) { /* 저장 못 하는 기기도 있다 */ } };
let LANG = (HAS_EN && readLang() === 'en') ? 'en' : 'ko';
const T = () => UI[LANG];
/* 영어 장은 제목과 문단만 다르고, 그림·번호·이모지는 우리말 장의 것을 그대로 쓴다. */
const CHS = () => LANG === 'en'
    ? CHAPTERS.map((ch, i) => ({ ...ch, title: EN.chapters[i].title, paras: EN.chapters[i].paras }))
    : CHAPTERS;
const QZ = () => (LANG === 'en' ? EN.quiz : QUIZ);
const AFW = () => (LANG === 'en' ? { ...AFTERWORD, title: EN.afterword.title, paras: EN.afterword.paras } : AFTERWORD);
const CV = () => (LANG === 'en' ? EN.cover : COVER);

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

function segsOf(paras) {
    const segs = [];
    paras.forEach((html, paraIdx) => {
        splitSegments(html).forEach((piece, k) => {
            segs.push({ paraIdx, html: piece, start: k === 0 });
        });
    });
    return segs;
}
let CHAPTER_SEGS = CHS().map(ch => segsOf(ch.paras));

// 읽고 나서 — 책마다 내용이 다르다. 장과 같은 방식으로 재서 나눈다.
const AFTERWORD = {
    title: '읽고 나서',
    emoji: '🎭',
    art: ['end.webp'],
    paras: [
        `이 책에 실린 것은 소설이 아닙니다. 연극 대본을 이야기로 풀어 옮긴 것입니다. 셰익스피어가 쓴 것은 무대에서 배우가 말하는 대사뿐입니다.`,
        `그러니 원작에는 이런 대목이 없습니다. 누가 어떤 표정을 지었는지, 그때 무슨 생각을 했는지 같은 것 말입니다. 그것은 배우가 무대에서 만들어야 하는 것이었습니다.`,
        `쓴 사람은 영국의 윌리엄 셰익스피어입니다. 사백육십 년쯤 전 스트랫퍼드어폰에이번이라는 작은 도시에서 태어났습니다.`,
        `장갑 만드는 사람의 아들이었습니다. 대학에 가지 않았습니다. 문법 학교까지만 다녔다고 전합니다.`,
        `그래서 그가 정말 그 작품들을 다 썼는지를 의심하는 사람도 있었습니다. 시골에서 문법 학교만 다닌 사람이 궁정과 법과 여러 나라 이야기를 어떻게 그렇게 잘 아느냐는 것입니다. 지금 학자들은 대개 그가 썼다고 봅니다.`,
        `그리고 스무 살 무렵 런던으로 갑니다. 그 뒤 몇 해 동안 무엇을 했는지는 기록이 없습니다. 사람들이 그 시기를 잃어버린 세월이라고 부릅니다.`,
        `셰익스피어에 대해 남아 있는 기록은 아주 적습니다. 세례를 받은 날, 결혼한 날, 아이가 태어난 날, 재산을 사고판 문서, 유언장 정도입니다. 그가 무슨 생각을 했는지를 적어 둔 것은 하나도 없습니다.`,
        `런던에서 그는 배우로 시작했습니다. 그리고 대본을 쓰고, 극단의 주주가 되고, 극장을 짓는 데 돈을 댔습니다. 그러니 그는 글만 쓴 사람이 아니라 극장을 경영한 사람이었습니다.`,
        `그래서 그는 돈을 벌었습니다. 고향에 큰 집을 사고, 땅도 샀습니다. 그 시절 극작가 가운데 그렇게 된 사람은 드물었습니다.`,
        `그리고 그가 지은 극장의 이름이 글로브였습니다. 지구라는 뜻입니다. 그 극장은 나중에 대포를 쏘는 무대 효과 때문에 불이 나 타 버렸습니다.`,
        `그가 남긴 희곡이 서른일곱 편쯤입니다. 그리고 시도 많이 남겼습니다. 여기 실린 것은 그 가운데 널리 알려진 일곱 편을 골라 옮긴 것입니다.`,
        `그가 세상을 떠나고 일곱 해 뒤에 동료 배우 둘이 그의 희곡을 모아 책으로 냈습니다. 그 책이 없었으면 절반쯤은 사라졌을 것입니다. 그 시절 대본은 극단의 재산이라 책으로 내지 않는 것이 보통이었기 때문입니다.`,
        `그 책을 첫 이절판이라고 부릅니다. 지금 남아 있는 것이 이백서른 권쯤인데, 한 권에 몇백억 원에 팔리기도 합니다.`,
        `이제 다시 볼 대목을 짚어 봅시다.`,
        `첫째, 『한여름 밤의 꿈』을 다시 보십시오. 숲에서 요정이 사람에게 약을 발라 엉뚱한 사람을 사랑하게 만듭니다. 그리고 그것이 아침에 다 풀립니다.`,
        `그런데 이 이야기가 묻는 것이 하나 있습니다. 사랑이 그렇게 약 하나로 바뀌는 것이라면, 약이 없을 때의 사랑은 무엇이냐는 것입니다.`,
        `이 연극은 웃고 끝납니다. 그런데 웃고 나면 그 물음이 남습니다. 셰익스피어의 희극은 대개 그렇습니다.`,
        `그리고 이 연극의 마지막에 요정 하나가 관객에게 말을 겁니다. 이것이 마음에 들지 않았다면 꿈을 꾼 것으로 여기라고요. 무대와 객석 사이를 그렇게 넘나듭니다.`,
        `그리고 이 연극 안에는 연극을 준비하는 사람들이 또 나옵니다. 마을 사람들이 서툰 연극을 올리는 대목입니다. 연극 안에 연극을 넣는 장치를 셰익스피어는 여러 번 씁니다.`,
        `그러면 보는 사람이 두 겹으로 보게 됩니다. 무대 위 사람들이 연극을 보고, 우리가 그것을 봅니다. 그러다 보면 우리가 보고 있는 것도 연극이라는 것을 잠깐 떠올리게 됩니다.`,
        `둘째, 『베니스의 상인』을 다시 읽어 보십시오. 살 한 파운드를 담보로 잡는 계약이 나옵니다. 그리고 재판에서 그 계약이 뒤집힙니다.`,
        `살은 주되 피는 한 방울도 흘리지 말라는 것입니다. 계약서에 살이라고만 적혀 있었기 때문입니다. 말의 틈으로 이기는 것입니다.`,
        `그런데 이 연극은 지금 읽기에 불편한 데가 있습니다. 샤일록이 유대인이라는 것이 그 사람을 나쁘게 그리는 데 쓰입니다. 그 시절 영국에 유대인에 대한 편견이 심했습니다.`,
        `그리고 마지막에 샤일록이 받는 것은 재산을 잃고 믿음까지 바꾸라는 것입니다. 그것을 그 시절 관객은 통쾌하게 여겼습니다. 지금은 그렇게 보지 않습니다.`,
        `다만 셰익스피어는 그 사람에게 말을 줍니다. 유대인에게는 눈이 없느냐, 손이 없느냐, 찔리면 피가 나지 않느냐고 묻는 대목입니다. 그 대목 때문에 이 연극은 지금도 무대에 오릅니다.`,
        `악당에게 그런 말을 준다는 것이 셰익스피어의 특이한 데입니다. 그 말 한 대목 때문에 이 연극은 유대인을 놀리는 연극이 되지 못합니다.`,
        `셋째, 『로미오와 줄리엣』을 다시 보십시오. 두 사람이 만나서 헤어지기까지가 나흘입니다. 그 짧은 시간에 만나고 결혼하고 죽습니다.`,
        `이 이야기를 사랑 이야기로만 읽으면 절반만 읽은 것입니다. 두 집안이 왜 원수가 되었는지는 이 연극에 나오지 않습니다.`,
        `까닭도 모르는 채 이어진 미움 때문에 아이 둘이 죽는 이야기입니다. 그리고 마지막에 두 집안이 화해합니다. 그것을 무엇으로 사고 있는지 세어 보십시오.`,
        `그리고 이 연극에는 서두름이 가득합니다. 편지 한 장이 제때 닿기만 했어도 두 사람은 살았습니다. 그 편지를 든 사람이 돌림병 때문에 길에 막힙니다.`,
        `그 시절 유럽에는 돌림병이 자주 돌았습니다. 셰익스피어의 극장도 그것 때문에 여러 번 문을 닫았습니다. 그러니 그 대목은 관객들이 아주 잘 아는 사정이었습니다.`,
        `넷째, 『햄릿』을 다시 읽어 보십시오. 이 연극의 주인공은 아버지를 죽인 사람을 알고 있습니다. 그런데 다섯 막 내내 결정하지 못합니다.`,
        `사람들이 흔히 햄릿을 우유부단하다고 합니다. 그런데 그 사람이 망설이는 까닭도 살펴볼 만합니다. 유령이 한 말을 그대로 믿어도 되는지 확인하고 싶었던 것입니다.`,
        `그래서 연극을 한 편 꾸며 왕에게 보입니다. 그 반응을 보고 판단하려던 것입니다. 그러니 그것은 망설임이면서 동시에 조사이기도 했습니다.`,
        `그리고 이 연극에는 사람들이 제일 많이 아는 대사가 들어 있습니다. 사느냐 죽느냐 하는 그 말입니다. 그 말이 나오는 자리가 어디인지 다시 보면, 그것이 죽음만 이야기하는 말이 아니라는 것을 알게 됩니다.`,
        `그 말 뒤에 이어지는 것은 견디는 것과 맞서는 것 가운데 무엇이 나으냐는 물음입니다. 그러니 그것은 사는 방식에 대한 물음입니다.`,
        `그리고 햄릿은 이 연극에서 말을 아주 많이 합니다. 대사가 셰익스피어의 인물 가운데 제일 많습니다. 생각이 많은 사람은 말도 많습니다.`,
        `다섯째, 『리어 왕』을 다시 보십시오. 왕이 딸 셋에게 나라를 나누어 주면서, 누가 나를 제일 사랑하느냐고 묻습니다.`,
        `두 딸은 잘 꾸며 말하고 막내는 잘 말하지 못합니다. 그래서 막내가 아무것도 못 받고 쫓겨납니다. 그러고 나서 벌어지는 일이 이 연극입니다.`,
        `이 연극은 셰익스피어의 작품 가운데 가장 어둡습니다. 그리고 마지막에 좋은 사람들도 살아남지 못합니다. 너무 슬퍼서 백오십 년 동안 결말을 바꾸어 공연한 적도 있습니다.`,
        `막내딸이 살아나고 리어 왕도 왕좌로 돌아가는 결말이었습니다. 그것을 사람들이 더 좋아했습니다. 원래 결말이 다시 무대에 오른 것은 백구십 년쯤 전부터입니다.`,
        `그리고 이 연극에는 광대가 하나 나옵니다. 왕 곁에서 농담을 하는 사람인데, 이 연극에서 제일 바른말을 하는 사람이 그 사람입니다. 웃기는 사람에게만 허락된 말이 있었기 때문입니다.`,
        `여섯째, 『맥베스』를 다시 보십시오. 마녀들이 그가 왕이 될 것이라고 말합니다. 그리고 그 말 때문에 그가 왕이 되려고 움직입니다.`,
        `그러니 예언이 앞일을 알려 준 것인지, 아니면 그 예언이 그 일을 만든 것인지 알 수 없습니다. 이 연극은 그것을 갈라 놓지 않습니다.`,
        `그리고 이 연극은 아주 짧습니다. 셰익스피어의 비극 가운데 제일 짧습니다. 사람 하나가 무너지는 데 오래 걸리지 않는다는 듯이 되어 있습니다.`,
        `그리고 이 연극은 극장에서 이름을 그대로 부르지 않는 관습이 있습니다. 부르면 나쁜 일이 생긴다는 미신 때문입니다. 그래서 배우들은 그 스코틀랜드 연극이라고 돌려 말합니다.`,
        `이 연극에는 실제 스코틀랜드 왕이 바탕에 있습니다. 다만 실제 그 왕은 열일곱 해를 다스렸고 나쁜 왕도 아니었다고 전합니다. 셰익스피어가 그렇게 그린 데는 그 시절 왕의 눈치를 본 까닭도 있었습니다.`,
        `그 무렵 영국 왕이 스코틀랜드에서 온 사람이었고, 마녀에 관한 책까지 쓴 사람이었습니다. 그러니 마녀를 넣고 그 왕의 조상을 좋게 그린 데는 그런 셈이 있었습니다.`,
        `그 시절 사정도 알아 두면 좋습니다. 셰익스피어의 극장은 지붕이 없었습니다. 낮에 햇빛을 받으며 공연했습니다.`,
        `무대에는 배경도 조명도 거의 없었습니다. 그러니 지금이 밤인지 낮인지, 여기가 숲인지 궁전인지를 대사로 알려 주어야 했습니다. 셰익스피어의 대사가 그렇게 그림 같은 까닭이 그것입니다.`,
        `그리고 여자 역을 남자아이가 맡았습니다. 그 시절 영국에서는 여자가 무대에 서지 못했습니다. 줄리엣도 남자아이가 연기했습니다.`,
        `관객은 삼천 명쯤 들어갔습니다. 앉는 자리가 있고 서서 보는 자리가 있었는데, 서서 보는 자리는 값이 아주 쌌습니다. 그 자리 사람들이 시끄럽게 굴었습니다.`,
        `그러니 셰익스피어는 그 사람들도 재미있게 볼 수 있게 써야 했습니다. 그의 비극에 웃긴 대목이 섞여 있는 까닭이 그것입니다.`,
        `그가 만든 말도 아주 많습니다. 지금 영어에서 쓰는 낱말과 표현 가운데 그의 작품에 처음 나온 것이 몇천 개로 헤아려집니다.`,
        `없는 말이 필요하면 그는 그냥 만들어 썼습니다. 명사를 동사로 쓰고, 말 두 개를 붙여 새 말을 만들었습니다. 그 가운데 상당수가 지금 영어에 남아 있습니다.`,
        `그리고 그가 만든 표현도 아주 많습니다. 영어를 쓰는 사람들은 자기가 셰익스피어를 인용하고 있는 줄도 모르고 그 말들을 씁니다.`,
        `이 작품들이 붙들고 있는 것은 두 가지입니다.`,
        `하나는 말이 사람을 어떻게 움직이느냐는 것입니다. 리어 왕은 딸들의 말을 듣고 나라를 나눕니다. 맥베스는 마녀의 말을 듣고 움직입니다. 오셀로도 남의 말을 듣고 무너집니다.`,
        `셰익스피어의 인물들은 대개 말 때문에 무너집니다. 연극이라는 것이 말로 되어 있으니 어울리는 셈입니다.`,
        `다른 하나는 사람이 자기를 아느냐는 것입니다. 이 작품들의 인물은 자기가 무엇을 하고 있는지를 마지막에야 압니다. 그리고 그때는 늦어 있습니다.`,
        `셰익스피어를 읽을 때 알아 둘 것이 있습니다. 그가 지어낸 이야기는 거의 없습니다. 대부분 옛이야기나 역사책에서 줄거리를 가져왔습니다.`,
        `로미오와 줄리엣도 이탈리아에 있던 이야기이고, 햄릿도 덴마크의 옛이야기입니다. 그러니 그의 재주는 새 이야기를 만드는 데 있지 않았습니다.`,
        `있는 이야기에 사람을 넣는 데 있었습니다. 같은 줄거리인데 그 사람들이 무슨 생각을 하는지가 들어가자 다른 것이 된 것입니다.`,
        `그리고 그는 인물이 혼자 무대에 서서 속마음을 말하게 했습니다. 그러면 관객이 그 사람의 머릿속을 듣게 됩니다. 그 장치가 연극을 크게 바꾸어 놓았습니다.`,
        `그 전까지 무대의 인물은 남에게 말을 걸 뿐이었습니다. 혼자 서서 자기에게 말하는 인물이 나오자, 사람의 속을 보여 주는 길이 열렸습니다.`,
        `언젠가 이 작품들을 다시 만나게 되거든, 되도록 무대에서 보십시오. 이것은 읽으라고 쓴 것이 아니라 보라고 쓴 것입니다.`,
        `그리고 무대에서 보면 알게 됩니다. 같은 대사인데 배우가 다르면 다른 사람이 됩니다. 그래서 사백 년 동안 계속 올려도 늘 새롭습니다.`,
        `마지막으로 생각해 볼 것을 남겨 둡니다. 답은 적어 두지 않겠습니다.`,
        `리어 왕이 딸들에게 사랑을 말로 하라고 시킨 것이 잘못이었을까요? 마음을 말로 재려고 하면 무슨 일이 생길까요?`,
        `햄릿이 망설인 것은 흠이었을까요, 아니면 그것이 그 사람의 옳은 데였을까요?`,
        `그리고 샤일록이 받은 판결을 지금 우리는 어떻게 보아야 할까요. 이 물음은 어른이 되어 다시 읽어도 답하기가 쉽지 않습니다.`
    ]
};

let AFTER_SEGS = segsOf(AFW().paras);

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
        out += `<p${contd ? ' class="cont"' : ''}>${inner}</p>`;
        i = j;
    }
    return out;
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

function paginateChapter(ch, chIndex) {
    const segs = CHAPTER_SEGS[chIndex];
    const arts = (ch.art && ch.art.length) ? ch.art : [];
    // artAt: 그림마다 "몇째 문단 옆에 붙는다"를 적어 둔 것. 없으면 예전처럼 고르게 뿌린다.
    const artAt = (ch.artAt && ch.artAt.length) ? ch.artAt : null;
    const { usable, headHeight, artHeight } = PROBE;
    const headHtml = `<h2>${T().label(ch.num)}${ch.title}</h2>`;
    const totalH = PROBE.measure(runHtml(segs, 0, segs.length));

    // 그림이 얹힌 쪽에도 그 아래에 글이 들어간다. 그래서 담을 수 있는 높이가 쪽마다 다르다.
    const underArt = Math.max(60, usable - artHeight);
    const capsOf = slots => {
        const caps = [];
        slots.forEach(kind => { caps.push(usable); caps.push(kind === 'img' ? underArt : usable); });
        return caps;
    };

    // 그 문단이 어느 펼침면에 놓였는지 찾는다.
    const spreadOfPara = (p, ranges, n) => {
        for (let s = 0; s < n; s++) {
            const L = ranges[2 * s], R = ranges[2 * s + 1];
            const a = L ? L[0] : (R ? R[0] : null);
            const b = R ? R[1] : (L ? L[1] : null);
            if (a == null || b == null) continue;
            for (let i = a; i < b; i++) if (segs[i] && segs[i].paraIdx === p) return s;
        }
        return -1;
    };

    // 바라는 자리에 그림을 놓되, 겹치지 않고 차례가 뒤집히지 않게 민다.
    const placeArts = (desired, n) => {
        const pos = desired.slice();
        for (let k = 0; k < pos.length; k++) {
            let p = Math.max(0, Math.min(n - 1, pos[k]));
            if (k > 0 && p <= pos[k - 1]) p = pos[k - 1] + 1;
            pos[k] = p;
        }
        for (let k = pos.length - 1; k >= 0; k--) {
            const cap = n - 1 - (pos.length - 1 - k);
            if (pos[k] > cap) pos[k] = cap;
            if (k > 0 && pos[k] <= pos[k - 1]) pos[k - 1] = pos[k] - 1;
        }
        const slots = new Array(n).fill('text');
        pos.forEach(p => { if (p >= 0 && p < n) slots[p] = 'img'; });
        return slots;
    };

    // 펼침면 수를 정해 놓고, 그 안에서 그림 자리를 잡는다.
    // 그림을 옮기면 글이 다시 나뉘고, 그러면 문단이 놓인 쪽도 달라진다. 그래서 몇 번 되풀이한다.
    const planFor = spreadCount => {
        let slots = slotPlan(arts.length, Math.max(0, spreadCount - arts.length));
        let caps = capsOf(slots);
        let ranges = fillPages(segs, caps, headHtml);
        if (artAt) {
            for (let round = 0; round < 5; round++) {
                const desired = arts.map((_, k) => {
                    const p = artAt[k];
                    const s = (p == null) ? -1 : spreadOfPara(p, ranges, spreadCount);
                    return s < 0
                        ? Math.min(spreadCount - 1, Math.round((k + 0.5) * spreadCount / arts.length))
                        : s;
                });
                const next = placeArts(desired, spreadCount);
                if (next.join() === slots.join()) break;
                slots = next;
                caps = capsOf(slots);
                ranges = fillPages(segs, caps, headHtml);
            }
        }
        return { slots, caps, ranges };
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

    let { slots, caps, ranges } = planFor(spreadCount);
    for (let guard = 0; guard < 8; guard++) {
        // 한 쪽이라도 넘치면 펼침면을 늘려 다시 나눈다.
        // 마지막 쪽만 보면 안 된다 — 첫 쪽에는 장 제목이 얹히므로 그쪽이 먼저 넘칠 수 있다.
        const over = ranges.some(([a, b], n) =>
            PROBE.measure((n === 0 ? headHtml : '') + runHtml(segs, a, b)) > caps[n] + 0.25);
        if (!over || spreadCount >= maxSpreads) break;
        spreadCount++;
        ({ slots, caps, ranges } = planFor(spreadCount));
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
/* ── 그리기 ───────────────────────────────────────── */

function artFrame(src, emoji) {
    return `<div class="art-frame">
 <img src="images/${src}" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
 <div class="art-fallback" style="display:none">${emoji}</div>
 </div>`;
}

/* 표지 글. 영어판이 있으면 CV()가 그쪽을 준다. */
const COVER = {
    title: `셰익스피어 이야기`,
    tag: `윌리엄 셰익스피어 원작`,
    intro: [
        `사백 년 전 런던, 지붕도 조명도 없는 둥근 극장에서 해가 있는 동안만 하던 연극입니다. 여자 역은 소년 배우가 했고, 관객은 마음에 안 들면 물건을 던졌습니다.`,
        `그 까다로운 관객 앞에서 쓴 서른일곱 편 가운데 일곱 편을 이야기로 옮겼습니다.`
    ]
};

function coverPage() {
    const cv = CV();
    return `<div class="page page-cover">
 <div class="story-page-left story-page-left-full">
 ${artFrame('cover.webp', '🎭')}
 </div>
 <div class="story-page-right">
 <h1>${cv.title}</h1>
 <p class="cover-tag">${cv.tag}</p>
 ${cv.intro.map(p => `<p>${p}</p>`).join('')}
 </div>
 </div>`;
}

function tocPage(part) {
    // 한 편으로 이어지는 이야기라 차례는 장 번호와 제목만 둔다.
    // 줄거리 한 줄을 붙이면 차례가 두 펼침면으로 늘어나고, 앞으로 읽을 대목을 미리 알려 주는 셈도 된다.
    // 쪽수는 화면 아래에 뜨는 그 번호(FOLIOS)를 그대로 가져다 쓴다.
    const folioOf = idx => (idx >= 0 ? FOLIOS[idx].start : '');
    const pageOfChapter = num => folioOf(PAGES.findIndex(p => p.kind === 'chapter' && p.first && p.ch.num === num));
    const pageOfKind = kind => folioOf(PAGES.findIndex(p => p.kind === kind));
    const rowHtml = (attr, mark, title, page) => `<li>
 <button type="button" ${attr}>
 <span class="toc-num">${mark}</span>
 <span><strong>${title}</strong><small>${T().page(page)}</small></span>
 </button>
 </li>`;
    const itemHtml = ch => rowHtml(`data-goto="${ch.num}"`, ch.num, ch.title, pageOfChapter(ch.num));
    // 낱낱의 <li>로 두어야 좌우 나누기 셈이 맞는다. 한 덩어리로 이으면 한쪽으로 쏠린다.
    const extraItems = [
        rowHtml('data-goto-kind="quiz"', '?', T().quiz, pageOfKind('quiz')),
        rowHtml('data-goto-kind="after"', '★', T().after, pageOfKind('after')),
    ];
    const group = TOC_GROUPS[part];
    const last = part === TOC_GROUPS.length - 1;
    const items = group.map(itemHtml).concat(last ? extraItems : []);
    const half = Math.ceil(items.length / 2);
    return `<div class="page page-toc">
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
function buildTocGroups() {
    TOC_GROUPS = [];
    const chs = CHS();
    for (let i = 0; i < chs.length; i += TOC_PER_SPREAD) TOC_GROUPS.push(chs.slice(i, i + TOC_PER_SPREAD));
}
buildTocGroups();

function chapterSpreadPage(spread) {
    const ch = spread.ch;
    const segs = CHAPTER_SEGS[spread.chIndex];
    const head = spread.first ? `<h2>${T().label(ch.num)}${ch.title}</h2>` : '';

    if (spread.art) {
        return `<div class="page page-story">
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

    return `<div class="page page-story">
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
    { q: "셰익스피어 시대 극장의 특징이 아닌 것은 무엇입니까?", choices: ["서서 보는 값싼 자리가 따로 있었다", "지붕이 없어 낮에만 공연을 했다", "여자 배우가 주역을 맡아 연기했다"], answer: 2 },
    { q: "셰익스피어를 처음 아이들이 읽을 이야기로 옮긴 사람들은 누구입니까?", choices: ["찰스 디킨스와 그 아들", "존 밀턴과 그의 두 딸", "찰스 램과 메리 램 남매"], answer: 2 },
    { q: "한여름 밤의 꿈에서 일이 꼬인 까닭은 무엇입니까?", choices: ["요정 왕과 왕비가 크게 다투어서", "퍽이 엉뚱한 사람에게 꽃즙을 발라서", "연극 연습을 하던 일꾼들 탓에"], answer: 1 },
    { q: "베니스의 상인에서 샤일록이 이자 대신 건 조건은 무엇입니까?", choices: ["안토니오의 배 한 척", "안토니오의 살 한 근", "안토니오의 집과 땅"], answer: 1 },
    { q: "포샤가 재판을 뒤집은 근거는 무엇입니까?", choices: ["돈을 갚겠다는 사람이 나서서", "문서에 살은 있고 피는 없어서", "문서에 날짜가 적혀 있지 않아서"], answer: 1 },
    { q: "이 책이 샤일록에 대해 함께 밝힌 것은 무엇입니까?", choices: ["샤일록은 실제로 있었던 사람을 그대로 옮긴 것이다", "그 시절 유대인은 직업과 사는 곳이 법으로 막혀 있었다", "원작에서는 샤일록이 마지막에 용서를 받고 풀려난다"], answer: 1 },
    { q: "로미오와 줄리엣에서 계획이 어긋난 까닭은 무엇입니까?", choices: ["편지를 든 사람이 돌림병 때문에 길에 붙잡혀서", "줄리엣이 약을 마시는 것을 잊어버렸기 때문에", "로미오가 신부의 말을 잘못 알아들어서"], answer: 0 },
    { q: "햄릿이 복수를 곧바로 하지 않고 확인부터 한 까닭은 무엇입니까?", choices: ["어머니가 말리며 붙잡았기 때문에", "확인 없이 죽이면 삼촌과 다를 것이 없어서", "혼자서는 삼촌을 당할 수 없다고 여겨서"], answer: 1 },
    { q: "햄릿이 삼촌을 확인한 방법은 무엇입니까?", choices: ["같은 장면이 나오는 연극을 시켜 얼굴을 봤다", "삼촌이 잠든 방을 몰래 뒤져 보았다", "삼촌의 신하를 매수해 이야기를 들었다"], answer: 0 },
    { q: "리어 왕에서 코딜리아가 한 대답은 무엇입니까?", choices: ["자식으로서 마땅한 만큼 사랑합니다", "말로는 다 할 수 없을 만큼 사랑합니다", "세상 그 무엇보다 아버지를 사랑합니다"], answer: 0 },
    { q: "리어가 벌판에서 처음으로 생각한 것은 무엇입니까?", choices: ["헐벗은 사람들은 이런 밤을 어떻게 견디는가", "두 딸에게 나라를 나눠 준 것이 잘못이었다", "코딜리아를 찾아가 잘못을 빌어야겠다"], answer: 0 },
    { q: "셰익스피어가 리어 왕의 결말을 어떻게 했습니까?", choices: ["전해 오던 이야기의 결말을 그대로 두었다", "전해 오던 비극을 좋은 결말로 고쳐 놓았다", "전해 오던 좋은 결말을 일부러 비극으로 바꿨다"], answer: 2 },
    { q: "맥베스가 무서운 까닭은 무엇입니까?", choices: ["싸움에서 한 번도 진 적이 없는 사람이라서", "마녀들의 말을 처음부터 그대로 믿었기 때문에", "처음부터 못된 사람이 아니라 나라를 구한 장수여서"], answer: 2 },
    { q: "맥베스가 멈추지 못한 까닭을 스스로 뭐라고 말했습니까?", choices: ["피 속에 너무 깊이 들어와 돌아가기가 더 힘들다", "왕관을 쓴 사람은 내려올 수가 없는 법이다", "마녀들이 말한 것은 반드시 그대로 된다"], answer: 0 },
    { q: "폭풍우에서 캘리번이 한 말은 무엇입니까?", choices: ["이 섬은 원래 내 것이었고 물이 어디 있는지 알려 주었다", "나는 이 섬에서 태어난 것을 늘 부끄럽게 여겨 왔다", "당신이 가르쳐 준 글로 나는 새 사람이 되었다"], answer: 0 },
    { q: "프로스페로가 마지막에 한 일은 무엇입니까?", choices: ["마법을 딸에게 물려주고 섬에 남았다", "동생을 섬에 가두고 밀라노로 갔다", "동생을 용서하고 마법을 버렸다"], answer: 2 },
    { q: "이 책을 읽고 난 반응으로 알맞지 않은 것은 무엇인가요?", wide: true, choices: ["포샤가 살은 베되 피는 한 방울도 흘리지 말라고 한 것을 보면, 포샤는 샤일록 편에서 계약을 지켜 준 거야.", "베니스의 상인이 원래 희극이었는데 지금은 웃으며 보는 사람이 드문 것을 보면, 작품은 그대로인데 보는 사람이 바뀐 거지.", "폭풍우를 요즘은 캘리번 쪽에서 읽는 사람도 있는 것을 보면, 배를 타고 와서 원래 살던 사람을 부리는 이야기가 그 뒤 세상 곳곳에서 일어났기 때문이네.", "셰익스피어가 쓴 것이 대사뿐인 것을 보면, 누가 어떤 표정을 지었는지는 배우가 무대에서 만들어야 했구나."], answer: 0 }
];

// 선지를 세로로 쌓으니 한 쪽에 열여섯 문항이 다 들어가지 않는다. 몇 개씩 나눠 싣는다.
// 문제는 한 쪽에 다 넣고 스크롤해서 푼다.
// 쪽을 쪼개 놓으면 쪽마다 절반이 비고, 답을 고르려고 여러 번 넘겨야 한다.
const QUIZ_GROUPS = [{ from: 0, items: QUIZ }];

// 쪽을 넘겼다 돌아와도 이미 푼 문항은 풀린 채로 있어야 한다.
/* 한글 문제와 영어 문제는 따로 낸 것일 수 있어 자취도 말별로 따로 적는다.
   한 자리에 같이 적으면 말을 바꿨을 때 누른 적 없는 보기에 표시가 앉는다. */
const QUIZ_PICKED = {};
const QK = i => LANG + ':' + i;
const pickedOf = i => (QK(i) in QUIZ_PICKED ? QUIZ_PICKED[QK(i)] : null);
const quizDone = () => QZ().filter((_, i) => pickedOf(i) !== null).length;
// 틀리게 고른 보기도 기억해 두어, 돌아와도 빨간 채로 남는다.
const QUIZ_WRONG = {};
const wrongOf = i => (QUIZ_WRONG[QK(i)] = QUIZ_WRONG[QK(i)] || new Set());

// 보기 차례는 책을 열 때마다 섞는다. 몇 번째가 답인지 외우지 못하게 하려는 것이다.
function shuffledOrder(n) {
    const a = [...Array(n).keys()];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
const QUIZ_ORDER = {};
const orderOf = (i, n) => (QUIZ_ORDER[QK(i)] = QUIZ_ORDER[QK(i)] || shuffledOrder(n));

function quizPage(part) {
    const list = QZ();
    const items = list.map((item, i) => {
        const graded = pickedOf(i) !== null;
        const wrong = wrongOf(i);
        const cls = ci => (graded && ci === item.answer) ? ' correct'
            : (wrong.has(ci) ? ' incorrect' : '');
        return `<div class="quiz-item${graded ? ' graded' : ''}" data-qindex="${i}">
 <p class="quiz-question">${i + 1}. ${item.q}</p>
 <div class="quiz-choices${item.wide ? ' quiz-choices-stack' : ''}">
 ${orderOf(i, item.choices.length).map(ci => `<button type="button" class="quiz-choice${cls(ci)}" data-choice="${ci}">${item.choices[ci]}</button>`).join('')}
 </div>
 </div>`;
    }).join('');
    return `<div class="page page-quiz">
 ${part === 0 ? `<h2>${T().quiz}</h2>` : ''}
 <p class="quiz-intro-text" id="quizProgress">${T().done(quizDone(), list.length)}</p>
 <div class="quiz-list">${items}</div>
 </div>`;
}

/* 읽고 나서 — 장과 같은 방식으로 쪽을 나눈다. 그림은 오른쪽 위에 얹힌다. */
const AFTER_FOOT = () => `<p class="after-home"><a class="home-btn" href="../../../../../">${T().home}</a></p>`;

function paginateAfterword() {
    const segs = AFTER_SEGS;
    const arts = AFTERWORD.art || [];
    const { usable, headHeight, artHeight } = PROBE;
    const headHtml = `<h2>${AFW().title}</h2>`;
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
            PROBE.measure((n === 0 ? headHtml : '') + runHtml(segs, a, b)) > caps[n] + 1);
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
    const head = spread.first ? `<h2>${AFW().title}</h2>` : '';
    // 학습 허브로 돌아가는 길은 맨 끝에 한 번만 둔다.
    const foot = spread.last ? AFTER_FOOT() : '';

    if (spread.art) {
        return `<div class="page page-story page-after">
 <div class="story-page-left">
 ${head}
 ${runHtml(segs, spread.left[0], spread.left[1])}
 </div>
 <div class="story-page-right story-page-right-image">
 <div class="story-art-top">${artFrame(spread.art, AFTERWORD.emoji)}</div>
 ${runHtml(segs, spread.right[0], spread.right[1])}
 ${foot}
 </div>
 </div>`;
    }

    return `<div class="page page-story page-after">
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

const TWO_PAGE_KINDS = new Set(['chapter', 'toc', 'cover', 'after']);

let PAGES = [];
let FOLIOS = [];

function buildPages() {
    CHAPTER_SEGS = CHS().map(ch => segsOf(ch.paras));
    AFTER_SEGS = segsOf(AFW().paras);
    buildTocGroups();
    PROBE = makeProbe();
    PAGES = [
        { kind: 'cover' },
        ...TOC_GROUPS.map((_, i) => ({ kind: 'toc', part: i })),
        ...CHS().flatMap(paginateChapter),
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
}

function initQuiz() {
    const progressEl = document.getElementById('quizProgress');

    const list = QZ();
    spreadEl.querySelectorAll('.quiz-item').forEach(item => {
        const qi = Number(item.dataset.qindex);
        const q = list[qi];
        item.querySelectorAll('.quiz-choice').forEach(btn => {
            btn.addEventListener('click', () => {
                if (item.classList.contains('graded')) return;
                const chosen = Number(btn.dataset.choice);
                // 틀리면 그 보기만 빨갛게 남기고, 맞는 것을 고를 때까지 다시 고르게 한다.
                if (chosen !== q.answer) {
                    btn.classList.add('incorrect');
                    wrongOf(qi).add(chosen);
                    return;
                }
                btn.classList.add('correct');
                item.classList.add('graded');
                QUIZ_PICKED[QK(qi)] = chosen;
                progressEl.textContent = T().done(quizDone(), list.length);
            });
        });
    });
}

function goTo(index) {
    if (animating || index === current || index < 0 || index >= PAGES.length) return;
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

paint();

/* 위쪽 말 바꾸기 단추 — 영어 원고가 있을 때만 뜬다. */
const langBtn = document.getElementById('langLink');
function applyLangUi() {
    document.documentElement.lang = LANG;
    document.title = LANG === 'en' && EN.title ? EN.title : BOOK_TITLE;
    if (langBtn) {
        langBtn.hidden = !HAS_EN;
        langBtn.textContent = T().other;
        langBtn.setAttribute('aria-label', T().otherAria);
    }
}
if (HAS_EN) applyLangUi();
if (langBtn && HAS_EN) {
    langBtn.addEventListener('click', () => {
        if (animating) return;
        const here = PAGES[current];
        LANG = LANG === 'en' ? 'ko' : 'en';
        saveLang(LANG);
        buildPages();
        current = Math.min(current, PAGES.length - 1);
        // 읽던 자리로 돌아간다. 장은 그 장의 첫 쪽으로, 차례·문제·해설은 그 첫 쪽으로.
        if (here && here.kind === 'chapter') {
            const idx = PAGES.findIndex(p => p.kind === 'chapter' && p.first && p.ch.num === here.ch.num);
            if (idx >= 0) current = idx;
        } else if (here && here.kind !== 'cover') {
            const idx = PAGES.findIndex(p => p.kind === here.kind);
            if (idx >= 0) current = idx;
        }
        applyLangUi();
        paint();
    });
}

// 본문 글꼴은 늦게 내려온다. 글꼴이 바뀌면 한 줄에 들어가는 글자 수가 달라져서
// 먼저 나눠 둔 쪽이 넘치게 된다. 그래서 글꼴을 다 받은 뒤에 한 번 다시 나눈다.
if (document.fonts && document.fonts.status !== 'loaded') {
    document.fonts.ready.then(() => {
        const here = PAGES[current];
        buildPages();
        current = Math.min(current, PAGES.length - 1);
        if (here && here.kind === 'chapter') {
            const idx = PAGES.findIndex(p => p.kind === 'chapter' && p.first && p.ch.num === here.ch.num);
            if (idx >= 0) current = idx;
        }
        paint();
    });
}
