const BOOK_TITLE = "괴도 뤼팽";

const CHAPTER_LABEL = () => '';

const CHAPTERS = [
    {
        num: 1,
        title: "대서양 위의 도둑",
        emoji: "🚢",
        art: ["story-01-a.webp", "story-01-b.webp"],
        paras: [
            `프로방스 호는 프랑스에서 미국으로 가는 큰 여객선이었습니다. 배는 이레째 바다 위에 있었고, 승객들은 서로 낯이 익어 있었습니다. 저녁마다 같은 사람들이 같은 자리에 앉았습니다. 누가 어느 자리에 앉는지 다들 알고 있었습니다. 배 위에서는 그런 것이 금방 정해집니다.`,
            `그날 오후, 배에 전보가 하나 들어왔습니다. 무선 전신이라는 것이 막 쓰이기 시작한 때였습니다. 바다 한가운데로 소식이 날아온다는 것 자체가 신기한 일이었습니다. 그전에는 배가 뜨면 뭍과 아주 끊겼습니다. 항구에 닿아야 소식을 들었습니다. 전보에는 이렇게 적혀 있었습니다.<br>"아르센 뤼팽이 그 배에 타고 있음. 일등실 승객. 금발. 오른팔에 부상. 이름은 R로 시작함."`,
            `그 소식이 퍼지자 배 안이 발칵 뒤집혔습니다. 아르센 뤼팽은 그 무렵 프랑스에서 모르는 사람이 없는 이름이었습니다. 귀족의 저택을 털고, 은행 금고를 열고, 경찰을 여러 번 놀렸습니다. 붙잡히고도 빠져나간 적이 여러 번이었습니다. 그럴 때마다 신문이 크게 실었습니다.`,
            `그런데 사람을 다치게 한 적은 한 번도 없었습니다. 그리고 가난한 집은 건드리지 않았습니다. 그래서 신문마다 그 이야기를 실었고, 사람들은 그것을 재미있어했습니다. 도둑을 두고 사람들이 편을 든 것입니다. 그런 일은 흔치 않습니다.`,
            `배 안의 일등실 승객은 마흔 명쯤이었습니다. 그날부터 사람들은 서로를 훑어보기 시작했습니다. 금발이고, 오른팔이 불편해 보이고, 이름이 R로 시작하는 사람. 그런 사람이 여럿이었습니다. 팔에 붕대를 감은 사람만 셋이었습니다.`,
            `이 이야기를 적는 저도 그 배에 타고 있었습니다. 저는 그 항해에서 로장 후작이라는 젊은이와 친해졌습니다. 말이 재미있고, 아는 것이 많고, 카드를 아주 잘 치는 사람이었습니다. 어느 이야기를 꺼내도 막히는 데가 없었습니다. 그런데 자기 이야기는 하지 않았습니다.`,
            `그리고 넬리 언더다운이라는 아가씨가 있었습니다. 배에서 제일 눈에 띄는 사람이었습니다. 로장 후작은 그 아가씨 옆에 늘 붙어 있었습니다. 갑판을 걸을 때도 함께 걸었습니다. 사람들이 그것을 보고 웃었습니다.`,
            `그런데 로장의 머리는 금발이었습니다. 그리고 이름이 R로 시작했습니다. 사람들이 그것을 두고 수군거렸습니다.`,
            `로장은 그 이야기를 듣고 크게 웃었습니다.<br>"제가 뤼팽이라면 좋겠군요. 그러면 여러분 지갑이 벌써 다 비었을 겁니다."`,
            `그날 밤 일이 났습니다. 배 안에서 도난 사건이 여러 건 일어난 것입니다. 보석과 시계와 지갑이 사라졌습니다. 잠긴 가방 속에서 없어진 것도 있었습니다. 자물쇠는 그대로였습니다. 부순 자국도 없었습니다.`,
            `이튿날 아침 승객들이 모여 소리를 질렀습니다. 선장이 배를 다 뒤졌지만 아무것도 나오지 않았습니다.`,
            `그리고 이틀 뒤 배가 뉴욕에 닿았습니다.`,
            `부두에 프랑스 경찰의 가니마르 형사가 나와 있었습니다. 가니마르는 뤼팽을 여러 번 잡으려다 놓친 사람이었습니다. 그 이름만 들어도 얼굴이 굳는 사람이었습니다. 뉴욕까지 온 것도 그 때문이었습니다. 배가 닿기를 며칠 전부터 기다렸습니다. 승객들이 하나씩 내렸습니다.`,
            `가니마르는 트랩 아래 서서 얼굴을 하나하나 보았습니다. 그러다 한 사람 앞에서 손을 들었습니다.<br>"아르센 뤼팽 씨."`,
            `사람들이 돌아보았습니다. 가니마르가 붙잡은 사람은 로장 후작이었습니다. 로장은 잠깐 아무 말도 하지 않았습니다. 그러다 가볍게 어깨를 으쓱했습니다.<br>"들켰군요."`,
            `그리고 넬리 아가씨 쪽을 보았습니다. 넬리는 얼굴이 하얘져서 서 있었습니다. 두 사람의 눈이 잠깐 마주쳤습니다. 뤼팽이 아주 작게 고개를 저었습니다. 말하지 말라는 뜻이었습니다. 그 손에 뤼팽이 몇 시간 전에 건네준 사진기가 들려 있었습니다.`,
            `그 안에 훔친 보석이 다 들어 있었습니다. 넬리는 그것을 알고 있었습니다.`,
            `세관 앞에서 넬리는 그 사진기를 손에 든 채 한참 서 있었습니다. 그리고 검사대를 그냥 지나쳤습니다. 손이 떨렸습니다. 아무도 그것을 알아채지 못했습니다.`,
            `배에서 내려 사람들이 다 흩어진 뒤, 넬리는 부두 끝으로 가서 그 사진기를 바다에 던졌습니다. 뤼팽은 경찰차 창으로 그것을 보았습니다. 그리고 웃었습니다. 보석은 물에 빠졌고 넬리도 죄를 짓지 않았습니다. 뤼팽이 웃은 것은 그 때문이었습니다.`
        ]
    },
    {
        num: 2,
        title: "감옥에서 성을 털다",
        emoji: "🏰",
        art: ["story-02-a.webp", "story-02-b.webp"],
        paras: [
            `노르망디에 말라키 성이라는 오래된 성이 있었습니다. 강 한가운데 바위섬 위에 세워진 성이었습니다. 물이 성벽 밑까지 차 있었습니다. 뭍과는 다리 하나로만 이어져 있었습니다. 그 다리를 막으면 아무도 드나들 수 없었습니다. 그러라고 그렇게 지은 성이었습니다.`,
            `그 성의 주인은 카오른 남작이라는 사람이었습니다. 아주 인색한 사람이었습니다. 하인도 몇 두지 않았습니다. 불도 아껴 켰습니다. 그 큰 성에 사람이 다섯도 되지 않았습니다. 그런데 그 성 안에는 대단한 것들이 있었습니다.`,
            `루벤스의 그림 넉 점, 유명한 화가가 만든 벽걸이 천, 그리고 옛날 은그릇과 보석들이었습니다. 루벤스는 삼백 년쯤 전 사람입니다. 그 그림 한 점이면 성 하나를 살 수 있었습니다.`,
            `어느 날 남작에게 편지가 왔습니다.<br>"남작께. 귀댁의 화랑에 있는 루벤스 넉 점과 벽걸이 천, 그리고 은그릇 일체를 보내 주시기 바랍니다. 구월 이십칠 일 밤에 가지러 가겠습니다. 아르센 뤼팽 올림."`,
            `남작은 그 편지를 보고 웃었습니다. 왜냐하면 그때 아르센 뤼팽은 감옥에 있었기 때문입니다. 상테 감옥에 갇혀 재판을 기다리고 있었습니다. 신문에도 그렇게 나 있었습니다. 그러니 웃을 만도 했습니다. 그런데 며칠 뒤 다시 편지가 왔습니다.<br>"남작께. 아직 짐을 싸지 않으셨더군요. 서두르십시오."`,
            `남작은 그제야 무서워졌습니다. 그는 경찰에 알렸습니다. 그런데 지방 경찰은 대수롭지 않게 여겼습니다. 장난 편지로 여긴 것입니다. 그런 편지가 그 무렵에 흔했습니다. <br>"뤼팽은 감옥에 있습니다."`,
            `남작은 파리로 편지를 썼습니다. 가니마르 형사에게 보낸 것이었습니다. 가니마르는 그때 일을 쉬고 있었는데, 그 편지를 받고 짐을 쌌습니다. 뤼팽이라는 이름이 적혀 있었기 때문입니다. 그 이름 앞에서는 쉬지 못하는 사람이었습니다.`,
            `구월 이십칠 일 저녁, 가니마르가 부하 둘을 데리고 성에 왔습니다. 세 사람은 성 안을 다 살폈습니다. 지하실까지 내려가 보았습니다. 다리에 보초를 세우고, 창을 잠그고, 화랑 문에 봉인을 붙였습니다. 봉인에 도장까지 찍었습니다. 그리고 밤새 화랑 앞에 앉아 지켰습니다. 셋이 번갈아 눈을 붙였습니다. 한 사람은 늘 깨어 있었습니다. 발소리 하나 나지 않았습니다.`,
            `아무 일도 없었습니다. 아침이 되어 세 사람이 봉인을 뜯고 화랑에 들어갔습니다. 벽이 비어 있었습니다. 못 자국만 남아 있었습니다. 벽지에 그림 자리가 네모나게 남아 있었습니다. 그 자리만 색이 덜 바래 있었습니다.`,
            `루벤스 넉 점도, 벽걸이 천도, 은그릇도 다 사라졌습니다. 문은 봉인된 채였고, 창은 잠긴 채였습니다. 가니마르는 그 자리에 주저앉을 뻔했습니다. 밤새 문 앞에 앉아 있었기 때문입니다. 자기 눈으로 봉인을 붙이고 자기 손으로 도장을 찍었습니다. 그런데 안이 비어 있었습니다.`,
            `수사는 여러 날 이어졌습니다. 그러다 이런 것이 밝혀졌습니다. 사건이 나기 두 달 전에, 남작이 하인 둘을 새로 들였습니다. 그 두 사람은 소개장이 아주 훌륭했습니다. 그리고 그 두 사람은 사건 다음 날 사라졌습니다. 소개장에 적힌 집을 찾아가 보니 그런 집이 없었습니다. 두 달 전부터 짜 놓은 일이었습니다.`,
            `또 한 가지가 있었습니다. 그 성에는 지하로 이어지는 옛날 통로가 있었습니다. 수백 년 전에 만든 것인데, 그 성 사람들도 잊고 있었습니다. 그것을 어떻게 알아냈을까요. 성의 옛 도면이 어느 도서관에 남아 있었습니다. 찾아보려고만 하면 볼 수 있는 것이었습니다.`,
            `가니마르가 상테 감옥으로 뤼팽을 찾아갔습니다.`,
            `"당신이 한 짓이오?"<br>"저는 여기 있었습니다."<br>"그건 아오. 그러니까 묻는 거요."`,
            `뤼팽이 웃었습니다.<br>"형사님, 어떤 일은 그 자리에 있으면 오히려 못 합니다."<br>그러고는 이렇게 덧붙였습니다.<br>"그런데 그 남작님 말입니다. 그 성에 사는 마을 사람들에게 소작료를 얼마나 받는지 한번 알아보시지요."`,
            `가니마르는 그 말을 흘려들었습니다. 그런데 나중에 알아보았습니다. 마을 사람들을 하나씩 만나 물어보았습니다. 그리고 아무에게도 그 이야기를 하지 않았습니다. 들은 것을 수첩에 적지도 않았습니다. 그것으로 무엇을 할 수 있는 것도 아니었습니다.`
        ]
    },
    {
        num: 3,
        title: "탈옥",
        emoji: "🔓",
        art: ["story-03-a.webp", "story-03-b.webp"],
        paras: [
            `아르센 뤼팽은 감옥에서 신문에 나는 사람이 되었습니다. 기자들이 그 이야기를 날마다 실었습니다. 뤼팽이 무엇을 먹었는지까지 기사가 되었습니다. 감옥 앞에 기자들이 죽 서 있었습니다. 신문이 그만큼 팔렸기 때문입니다. 그런데 뤼팽이 어느 날 이런 말을 흘렸습니다.<br>"저는 재판을 받으러 나가지 않을 겁니다."`,
            `그 말이 신문에 실렸습니다. 감옥이 발칵 뒤집혔습니다. 간수를 두 배로 늘리고, 방을 옮기고, 하루에 몇 번씩 몸수색을 했습니다. 면회도 못 하게 했습니다. 편지도 다 뜯어 보았습니다. 그래도 마음을 놓지 못했습니다.`,
            `그런데 이상한 일이 벌어졌습니다. 뤼팽이 앓기 시작한 것입니다. 밥을 먹지 못했고, 살이 빠졌고, 얼굴이 창백해졌습니다. 한 달 만에 아주 다른 사람이 되었습니다. 옷이 헐렁해졌습니다. 간수들이 부축해야 걸었습니다.`,
            `의사가 여러 번 다녀갔습니다.<br>"이대로 두면 재판까지 못 갑니다."`,
            `재판 날이 왔습니다. 뤼팽은 들것에 실려 법정으로 갔습니다. 혼자 앉아 있지도 못했습니다. 사람들이 그 몰골을 보고 놀랐습니다. 신문에서 보던 얼굴이 아니었습니다. 방청석에서 한숨 소리가 났습니다. 저 사람이 그 뤼팽이냐고 수군거렸습니다.`,
            `재판장이 물었습니다.<br>"이름을 대시오."<br>"보드뤼입니다. 데지레 보드뤼."`,
            `법정이 술렁였습니다.<br>"당신은 아르센 뤼팽 아니오?"<br>"저는 뤼팽이 누군지도 모릅니다."`,
            `그 남자는 자기가 잡혀 온 이유를 모르겠다고 했습니다. 배가 고파서 빵을 훔쳤는데 갑자기 이런 데 와 있다는 것이었습니다. 말투도 배운 데 없는 사람의 말투였습니다. 글자도 못 읽는다고 했습니다. 재판장이 몇 번을 다시 물었습니다. 법정에서는 그 말을 믿지 않았습니다. 그런데 문제가 하나 있었습니다.`,
            `그 사람의 몸을 재어 보니 뤼팽의 기록과 맞지 않았습니다. 키가 달랐고, 귀 모양이 달랐고, 손가락 길이가 달랐습니다. 그때는 사람의 몸을 재서 신원을 확인하는 방법을 쓰던 시절이었습니다. 지문을 쓰기 전의 일입니다. 키와 팔 길이와 귀 모양을 재어 적어 두었습니다.`,
            `가니마르가 불려 나왔습니다.<br>"이 사람이 뤼팽입니까?"<br>가니마르는 그 얼굴을 한참 보았습니다. 그리고 이렇게 말했습니다.<br>"······모르겠습니다."`,
            `그것이 가니마르가 평생 한 말 가운데 가장 아픈 말이었습니다. 그 한마디로 재판이 무너졌습니다. 제일 오래 뤼팽을 쫓은 사람이 모른다고 한 것입니다. 다른 증인이 무슨 말을 해도 소용없었습니다. 재판은 미뤄졌습니다. 그리고 데지레 보드뤼는 증거 부족으로 풀려났습니다.`,
            `그날 그 사람은 감옥 문을 나섰습니다. 가니마르가 뒤를 밟았습니다. 보드뤼는 하루 종일 파리 시내를 걸었습니다. 갈 데가 없는 사람처럼 걸었습니다. 어디로 가는지 정해 놓지 않은 걸음이었습니다. 가니마르가 그것을 놓치지 않고 뒤따랐습니다.`,
            `빵집 앞에서 서성이고, 벤치에 앉아 졸았습니다. 밤이 되자 어느 다리 아래로 들어가 잤습니다. 신문지를 덮고 잤습니다. 가니마르는 그 위 다리에서 밤을 지새웠습니다.`,
            `가니마르는 사흘을 따라다녔습니다. 그러다 나흘째 되는 날, 보드뤼가 갑자기 사라졌습니다. 골목 하나를 도는 사이였습니다. 그 골목 끝에는 아무도 없었습니다.`,
            `그날 저녁 가니마르의 집에 편지가 왔습니다.<br>"형사님, 사흘 동안 고생하셨습니다. 다리 아래는 참 춥더군요. 그리고 한 가지 알려 드리겠습니다. 감옥에서 앓는 척하는 것은 어렵지 않습니다. 어려운 것은 한 달 동안 밥을 안 먹는 것입니다. 저는 그 한 달 동안 정말로 굶었습니다. 앓는 얼굴은 꾸밀 수 있어도 몸의 치수는 꾸밀 수 없습니다. 그래서 몸을 줄이는 수밖에 없었습니다. 몸을 줄여 놓지 않으면 재는 것이 맞아떨어지니까요. 아르센 뤼팽 올림."`,
            `가니마르는 그 편지를 읽고 오래 앉아 있었습니다. 그리고 이렇게 중얼거렸습니다.<br>"저놈은 한 달을 굶었구나. 화가 나기보다 기가 막혔습니다."<br>거기까지 하는 사람은 처음이었습니다.`
        ]
    },
    {
        num: 4,
        title: "기차 안의 사람",
        emoji: "🚂",
        art: ["story-04-a.webp", "story-04-b.webp"],
        paras: [
            `어느 여름날 아침, 저는 파리에서 루앙으로 가는 기차를 탔습니다. 그때 그 노선의 객차는 칸마다 따로 떨어져 있었습니다. 한번 타면 다음 역까지 밖으로 나갈 수 없었습니다. 옆 칸으로 넘어갈 수도 없었습니다. 복도가 없었기 때문입니다. 칸마다 밖으로 난 문만 있었습니다.`,
            `제가 탄 칸에는 저 혼자였습니다. 기차가 막 떠나려는데 사람이 하나 뛰어들어 왔습니다. 키가 크고, 옷차림이 좋고, 나이는 마흔쯤 되어 보였습니다. 짐은 작은 가방 하나뿐이었습니다. 먼 길을 가는 사람의 짐이 아니었습니다. 저는 그것부터 눈여겨보았습니다.`,
            `그 사람은 자리에 앉아 신문을 폈습니다. 그런데 자꾸 창밖을 보았습니다. 그리고 제가 볼 때마다 눈을 피했습니다. 신문은 한 쪽도 넘기지 않았습니다. 펴 들고만 있었습니다. 읽는 사람의 눈이 아니었습니다.`,
            `저는 그날 아침 신문에서 읽은 기사가 생각났습니다. 이레 전에 이 노선에서 사건이 하나 있었습니다. 기차 칸 안에서 사람이 하나 세상을 떠났고, 그 사람의 돈이 사라졌습니다. 칸이 따로 떨어져 있어서 아무도 몰랐습니다. 다음 역에 닿아서야 알려졌습니다.`,
            `범인은 잡히지 않았습니다. 그런데 그날 신문에는 이런 것이 실려 있었습니다. 그 범인의 인상착의였습니다. 키가 크고, 마흔쯤 되었고, 갈색 눈에 옷차림이 좋다고 했습니다. 그런 사람은 파리에 수천 명 있습니다. 그런데 앞에 앉아 있으면 사정이 다릅니다.`,
            `저는 앞에 앉은 사람을 보았습니다. 그리고 등에 땀이 났습니다.`,
            `다음 역까지 두 시간이었습니다. 그 두 시간 동안 저는 여러 가지를 생각했습니다. 비상 줄을 당길까. 그런데 잘못 당기면 벌금을 물고 망신을 당합니다. 기차를 세우는 일이었습니다. 사람이 가득 탄 기차였습니다.`,
            `그리고 제가 착각한 것일 수도 있었습니다. 저는 그 사람을 계속 지켜보았습니다. 그러다 그 사람이 잠든 것 같았습니다. 고개가 창 쪽으로 기울었습니다. 숨소리가 고르게 났습니다.`,
            `저는 아주 천천히 일어나 짐칸에서 제 가방을 내렸습니다. 그리고 그 안에서 무엇이든 꺼내려고 했습니다.`,
            `그때 그 사람이 눈을 떴습니다. 저는 그 사람과 눈이 마주쳤습니다. 그리고 그 순간 그 사람이 웃었습니다. 놀라는 기색이 하나도 없었습니다. 제가 무엇을 하려는지 이미 알고 있는 얼굴이었습니다. 저는 손에 든 것을 놓았습니다.`,
            `"선생, 저를 어떻게 하실 생각입니까."<br>"······."<br>"신문을 읽으셨군요."`,
            `저는 아무 말도 하지 못했습니다.`,
            `그 사람이 말했습니다.<br>"제 사정을 말씀드리지요. 저는 그 사람이 아닙니다. 그런데 지금 경찰에 붙잡히면 곤란한 사람입니다."<br>"그럼 누구십니까."<br>"이름은 말씀 안 드리겠습니다."`,
            `기차가 다음 역에 가까워졌습니다. 그 사람이 이렇게 말했습니다.<br>"선생께 부탁이 하나 있습니다. 역에 내리시거든 저를 못 봤다고 해 주십시오."<br>"왜 그래야 합니까."<br>"이유는 없습니다. 그냥 부탁입니다."<br>목소리가 낮았습니다. 조르는 말투가 아니었습니다.`,
            `기차가 섰습니다. 그리고 승강장에 경찰이 서 있었습니다. 저는 내렸습니다.`,
            `경찰이 물었습니다.<br>"그 칸에 누가 있었습니까?"`,
            `저는 잠깐 아무 말도 하지 못했습니다. 그러다 이렇게 말했습니다.<br>"저 혼자였습니다."`,
            `왜 그렇게 말했는지는 저도 지금까지 모르겠습니다. 거짓말을 해 본 적이 없는 사람이었습니다. 그런데 그날은 그 말이 저절로 나왔습니다.`,
            `그런데 그 뒤에 이런 일이 있었습니다. 기차가 떠난 뒤, 그 다음 역에서 진짜 범인이 붙잡혔습니다.`,
            `제가 탄 칸의 그 사람이 그자를 묶어서 짐칸에 밀어 넣어 두었던 것입니다. 제가 자리에서 일어나 있던 그 잠깐 사이에 한 일이었습니다. 저는 아무 소리도 듣지 못했습니다. 등을 돌리고 있었기 때문입니다. 그리고 좌석 위에 명함이 한 장 놓여 있었습니다. 아르센 뤼팽이라고 적혀 있었습니다.`
        ]
    },
    {
        num: 5,
        title: "하트 일곱",
        emoji: "🃏",
        art: ["story-05-a.webp", "story-05-b.webp"],
        paras: [
            `어느 밤 저는 집에 돌아와 서재에 들어갔다가 걸음을 멈췄습니다. 제 책상 위에 카드가 한 장 놓여 있었습니다. 하트 일곱이었습니다. 놀이용 카드 한 장이었습니다. 그런데 그 카드에 이상한 것이 있었습니다.`,
            `일곱 개의 하트 무늬 가운데 일곱 군데에 바늘로 구멍이 뚫려 있었습니다. 불빛에 비춰야 겨우 보이는 구멍이었습니다. 바늘 끝으로 뚫은 것이었습니다. 무늬 안쪽에 있어서 그냥 보면 몰랐습니다. 저는 그것을 서랍에 넣어 두었습니다. 그리고 잊어버렸습니다. 누가 장난을 한 것으로 여겼습니다. 그 서랍을 여러 달 열지 않았습니다.`,
            `그런데 여러 달 뒤에 사건이 하나 났습니다.`,
            `어느 발명가가 사라진 것입니다. 온 신문이 그 이야기로 시끄러웠습니다. 이름은 루이 라콩브라고 했습니다. 그 사람은 잠수함의 설계도를 만들고 있었습니다. 물속으로 다니는 배였습니다. 그 무렵에는 아직 만들어진 것이 없었습니다. 그림으로만 있던 것입니다.`,
            `그때는 나라마다 그런 것을 몹시 탐내던 시절이었습니다. 먼저 가지는 나라가 바다를 쥐게 되기 때문입니다. 큰 배도 물속에서 오는 것은 막지 못합니다. 그래서 다들 그것을 노렸습니다. 라콩브는 어느 부자의 집에서 지내며 연구했습니다. 방 하나를 통째로 실험실로 쓰고 있었습니다. 그 부자가 돈을 대 주었기 때문입니다. 돈을 대 주는 사람과 만드는 사람이 다르면 일이 어렵게 됩니다. 만든 것이 누구 것이냐는 문제가 남기 때문입니다. 그런데 어느 날 라콩브가 사라졌습니다.`,
            `설계도도 함께 사라졌습니다. 종이 한 장 남지 않았습니다. 그리고 그 부자는 얼마 뒤 큰돈을 벌었습니다. 어디서 난 돈인지는 밝히지 않았습니다. 묻는 사람도 없었습니다.`,
            `저는 그 사건 기사를 읽다가 무언가 생각이 났습니다.`,
            `서랍을 열어 그 카드를 꺼냈습니다. 여러 달 만에 다시 든 것이었습니다. 구멍이 일곱 개였습니다. 저는 그 카드를 불빛에 비춰 보았습니다. 그리고 종이에 대고 구멍 자리를 찍어 보았습니다. 연필 끝으로 하나씩 찍었습니다.`,
            `점 일곱 개가 나왔습니다. 그 점들을 이어 보았습니다. 자를 대고 이어도 보았습니다. 아무것도 아니었습니다.`,
            `저는 그것을 며칠 들여다보았습니다. 밥을 먹으면서도 들여다보았습니다. 그러다 어느 날 밤, 그 카드를 뒤집어 보았습니다. 앞뒤가 뒤집히면 자리도 뒤집힙니다. 카드는 앞에서 뚫었으니 뒤에서 보아야 맞았습니다. 그것을 알아내는 데 며칠이 걸린 것입니다. 그리고 알았습니다.`,
            `그 점들은 어떤 방의 벽에 있는 무늬 자리를 표시한 것이었습니다. 그 방은 라콩브가 연구하던 방이었습니다.`,
            `저는 그날 밤 그 집으로 갔습니다. 그리고 담을 넘었습니다.`,
            `이 이야기를 적는 저는 도둑이 아닙니다. 평생 남의 담을 넘어 본 적이 없었습니다. 손바닥이 다 까졌습니다. 내려서서 한참 숨을 골랐습니다. 그런데 그날은 그렇게 했습니다. 그 방에 들어가 벽의 무늬를 찾았습니다. 벽지에 같은 무늬가 죽 늘어서 있었습니다.`,
            `일곱 번째 자리를 눌렀습니다. 손끝에 딱 하는 느낌이 왔습니다. 벽이 열렸습니다. 손바닥만 한 문이 안쪽으로 밀려 들어갔습니다. 그 안에 서류 뭉치가 들어 있었습니다. 먼지가 앉아 있었습니다. 두 해 동안 아무도 손대지 않은 것이었습니다. 종이가 누렇게 바래 있었습니다.`,
            `라콩브의 설계도였습니다. 그리고 그 위에 종이가 한 장 얹혀 있었습니다.<br>"저는 이것을 두 해 전에 찾아냈습니다. 그런데 가져가지 않았습니다. 이것을 가져가면 어느 나라가 이것으로 배를 만들 것이고, 그러면 사람이 많이 죽습니다. 저는 도둑이지 그런 사람은 아닙니다. 이 한 줄이 이 이야기의 알맹이입니다. 뤼팽이 무엇을 가져가고 무엇을 두고 오는지가 여기 나옵니다. 선생이 이것을 찾아내시면 정부에 넘기지 마시고 태우십시오. 아르센 뤼팽."`,
            `저는 그 종이를 오래 들여다보았습니다. 그리고 그 설계도를 어떻게 했는지는 여기 적지 않겠습니다. 다만 한 가지는 적어 두겠습니다.`,
            `라콩브라는 사람은 끝내 돌아오지 않았습니다. 어디로 갔는지 아무도 모릅니다. 그리고 그 부자는 그 뒤에 벌을 받았습니다. 라콩브를 어떻게 했는지가 밝혀진 것입니다. 뤼팽이 그렇게 만들었습니다. 어떻게 했는지는 아무도 모릅니다. 다만 그 부자가 스스로 털어놓았습니다.`
        ]
    },
    {
        num: 6,
        title: "검은 진주",
        emoji: "⚫",
        art: ["story-06-a.webp", "story-06-b.webp"],
        paras: [
            `파리의 어느 낡은 아파트 이층에, 앙드리요 백작 부인이라는 노부인이 살았습니다. 젊었을 때는 궁전에 드나들던 사람이었습니다. 그런데 이제는 늙고 가난했습니다. 난방도 제대로 못 하고 지냈습니다. 겨울에는 외투를 입고 앉아 있었습니다. 그래도 사람을 부르는 일은 없었습니다.`,
            `남은 것은 하나뿐이었습니다. 검은 진주였습니다. 아주 크고 귀한 것이라 값을 매길 수 없다고 했습니다. 그런 진주가 세상에 몇 개 없다고 했습니다. 검은빛이 도는 진주는 아주 드물게 납니다. 그래서 값이 그렇게 나갔습니다.`,
            `부인은 그것을 팔지 않았습니다. 그 진주를 볼 때마다 젊었을 때가 생각났기 때문입니다. 부인은 그것을 아주 잘 숨겨 두었습니다. 어디에 두었는지는 아무에게도 말하지 않았습니다. 그것이 뒤에 일을 어렵게 만들었습니다.`,
            `어느 겨울 아침, 그 집에서 부인이 세상을 떠난 채 발견되었습니다. 그리고 검은 진주가 없어졌습니다. 경찰이 조사에 나섰습니다.`,
            `그 집은 아주 이상했습니다. 문이 안에서 잠겨 있었습니다. 그런데 방 안이 뒤집혀 있었습니다. 옷장이 다 열려 있고, 서랍이 바닥에 쏟아져 있었습니다. 찾다가 못 찾은 자리였습니다. 서두른 손이 지나간 자리였습니다.`,
            `경찰은 그 집 하녀를 의심했습니다. 그런데 하녀는 그날 밤 다른 데 있었습니다. 그리고 아래층 사람들도 조사를 받았습니다.`,
            `아래층에는 젊은 남자가 하나 살았습니다. 그 사람이 며칠 뒤 이사를 갔습니다. 경찰이 그 집을 찾아갔을 때는 비어 있었습니다. 짐도 남기지 않았습니다.`,
            `그 뒤로 여섯 달이 지났습니다. 그러다 어느 날 가니마르 형사가 저를 찾아왔습니다.<br>"그 검은 진주 사건 기억하시오?"<br>"기억합니다."<br>"오늘 그 진주가 어느 보석상에 나왔소."`,
            `경찰이 그 보석상을 지켰습니다. 가게 안팎에 사람을 심어 두었습니다. 손님인 척하고 앉아 있었습니다. 여섯 달을 기다린 참이었습니다. 그리고 진주를 팔러 온 사람을 붙잡았습니다. 평범하게 생긴 남자였습니다. 이름은 다니그레라고 했습니다.`,
            `그런데 그 사람이 이렇게 말했습니다.<br>"저는 훔치지 않았습니다. 저는 그 방에 들어갔을 때 부인이 이미······."`,
            `그리고 이런 이야기를 했습니다. 그날 밤 그 사람은 그 집에 도둑질을 하러 들어갔습니다. 그런데 방에 들어가 보니 부인이 이미 세상을 떠나 있었습니다. 그리고 방이 이미 뒤집혀 있었습니다. 서랍이 다 열려 있었습니다. 자기가 하려던 일을 누가 먼저 해 놓은 것이었습니다. 다니그레는 그 자리에서 얼어붙었습니다.`,
            `자기보다 먼저 누가 다녀간 것이었습니다. 그 사람은 무서워서 나가려다가, 나가기 전에 방을 한 번 둘러보았습니다. 그리고 침대 밑을 보았습니다.`,
            `거기에 진주가 떨어져 있었습니다. 먼저 다녀간 사람이 못 찾은 것을, 나중에 온 사람이 우연히 찾은 것이었습니다. 부인이 손에 쥐고 있다가 떨어뜨린 것이었습니다. 그래서 어디에도 숨겨져 있지 않았습니다.`,
            `경찰은 그 말을 믿지 않았습니다. 도둑이 하는 말이었기 때문입니다. 그런 말은 아무도 믿어 주지 않습니다. 그런데 그 뒤에 이상한 일이 있었습니다. 재판을 앞두고 신문에 편지가 하나 실렸습니다.<br>"그날 밤 그 방을 먼저 뒤진 것은 저입니다. 저는 진주를 못 찾고 나왔습니다.<br>그리고 부인께서 그 전에 이미 돌아가셨다는 것도 밝혀 둡니다.<br>저는 그날 아무도 해치지 않았습니다. 다니그레도 마찬가지입니다. 그 사람은 도둑이지 그 이상은 아닙니다. 아르센 뤼팽 올림."`,
            `그 편지 때문에 다니그레는 도둑질에 대해서만 벌을 받았습니다.`,
            `가니마르는 그 신문을 접으면서 이렇게 말했습니다.<br>"저놈은 자기가 못 훔친 것까지 편지를 쓰는군."<br>그러고는 이렇게 덧붙였습니다.<br>"그런데 저 편지가 없었으면 그 사람은 훨씬 무거운 벌을 받았을 거요. 편지 한 장이 사람 하나를 살린 것입니다."<br>가니마르는 그것을 인정하지 않을 수 없었습니다.`
        ]
    },
    {
        num: 7,
        title: "왕비의 목걸이",
        emoji: "💎",
        art: ["story-07-a.webp", "story-07-b.webp"],
        paras: [
            `드뢰수비즈 백작 집안에는 대대로 내려오는 목걸이가 있었습니다. 백여 년 전 왕비의 것이었다고 전해지는 목걸이였습니다. 온 나라가 아는 이야기가 붙어 있는 물건이었습니다. 왕비가 그 목걸이 때문에 곤경에 빠졌다는 이야기였습니다. 어린아이도 아는 이야기였습니다.`,
            `실제로는 그 목걸이가 조각조각 팔려 나갔고, 이 집에 남은 것은 그 가운데 일부를 다시 엮은 것이었습니다. 그래도 대단한 것이었습니다. 값을 매기기 어려운 물건이었습니다. 돌 하나하나가 값이 나갔습니다. 그런데 붙어 있는 이야기가 더 값이 나갔습니다.`,
            `그 집에는 아이가 하나 있었습니다. 앙리에트라는 여자의 아들이었습니다. 앙리에트는 백작 부인과 어릴 때 함께 자란 사람이었는데, 형편이 어려워져 그 집 다락방에 얹혀살고 있었습니다. 그 아이의 이름은 라울이었습니다. 집 안을 마음대로 뛰어다니던 아이였습니다. 여섯 살이었습니다. 어른들이 있는 자리에도 아무렇지 않게 드나들었습니다. 아무도 그 아이를 눈여겨보지 않았습니다.`,
            `어느 무도회 날 밤, 백작 부인이 그 목걸이를 걸었습니다. 그날 그 목걸이를 본 사람이 수십 명이었습니다. 그리고 밤에 돌아와 목걸이를 벗어 화장대 위에 두었습니다. 문을 안에서 잠그고 잤습니다. 열쇠는 베개 밑에 두었습니다. 늘 그렇게 했습니다.`,
            `이튿날 아침, 목걸이가 없어졌습니다. 방은 잠겨 있었습니다. 창은 안에서 걸려 있었고, 밖은 삼층 높이였습니다. 굴뚝은 사람이 들어갈 수 없을 만큼 좁았습니다. 경찰이 손을 넣어 보고 그렇게 적었습니다. 어른의 어깨로는 들어갈 수 없었습니다.`,
            `아무리 조사해도 답이 나오지 않았습니다. 경찰도 손을 들었습니다. 백작은 집안 사람들을 다 의심했습니다. 하인들을 하나씩 불러 캐물었습니다. 특히 다락방에 사는 앙리에트를 의심했습니다. 그 사람이 가난했기 때문입니다. 그것 말고 다른 까닭은 없었습니다. 가난한 것이 곧 증거처럼 쓰인 것입니다.`,
            `증거는 하나도 없었습니다. 그런데 백작은 앙리에트와 라울을 집에서 내보냈습니다. 앙리에트는 아무 말도 하지 않고 아들을 데리고 나갔습니다. 짐이라고는 보따리 하나였습니다. 변명도 하지 않았습니다. 변명해도 소용없다는 것을 알았기 때문입니다.`,
            `그 뒤로 여러 해가 지났습니다. 백작 부인은 해마다 앙리에트에게 돈을 조금씩 보냈습니다. 미안한 마음이 있었기 때문입니다. 그런데 남편에게는 그 말을 하지 못했습니다. 돈만 몰래 부쳤습니다. 그런데 어느 해부터 앙리에트가 그 돈을 사양했습니다.`,
            `그러면서 편지에 이렇게 적었습니다.<br>"이제 형편이 폈습니다. 제 아들이 벌어 옵니다."`,
            `그리고 그 뒤로 소식이 끊겼습니다. 주소를 남기지 않았습니다. 찾을 길이 없었습니다.`,
            `이십 년쯤 지난 어느 날, 백작 부인에게 소포가 하나 왔습니다. 그 안에 그 목걸이가 들어 있었습니다. 잃어버렸던 그 목걸이였습니다. 그리고 쪽지가 하나 있었습니다.<br>"부인. 이것을 돌려드립니다. 그리고 앙리에트는 이 일과 아무 상관이 없었다는 것을 밝힙니다. 그 사람은 스무 해 동안 도둑으로 몰린 채 살았고, 그것을 자기 아들에게도 말하지 않았습니다."<br>"그날 밤 그 방에 들어간 것은 여섯 살짜리 아이였습니다. 굴뚝이 좁아서 어른은 못 들어가지만 여섯 살은 들어갑니다. 그 아이는 그것이 무슨 짓인지도 몰랐습니다."<br>"제가 그 아이입니다. 아르센 뤼팽 올림."`,
            `백작 부인은 그 쪽지를 오래 들고 있었습니다. 몇 번을 다시 읽었습니다. 손끝으로 글자를 짚어 가며 읽었습니다. 읽을 때마다 같은 자리에서 멈췄습니다. 그리고 백작에게 보여 주었습니다. 백작은 그것을 읽고 아무 말도 하지 못했습니다. 쪽지를 든 손이 떨렸습니다.`,
            `그 사람은 스무 해 전에 증거 하나 없이 사람을 내쫓았던 것입니다. 그 뒤로 스무 해 동안 한 번도 그 일을 다시 생각해 보지 않았습니다. 내쫓은 쪽은 잊고 살았습니다. 쫓겨난 쪽만 이십 년을 지고 살았습니다. 앙리에트는 그보다 몇 해 전에 세상을 떠난 뒤였습니다.`,
            `쪽지의 마지막에는 이런 줄이 있었습니다.<br>"저는 그 목걸이를 스무 해 동안 팔지 않았습니다."<br>팔면 어머니가 정말로 도둑의 어머니가 되기 때문입니다. 스무 해 동안 값비싼 것을 손에 쥐고도 그랬습니다.`
        ]
    },
    {
        num: 8,
        title: "숄메스 선생, 한발 늦다",
        emoji: "🕵️",
        art: ["story-08-a.webp", "story-08-b.webp"],
        paras: [
            `이번에는 뤼팽 앞에 만만치 않은 상대가 나섭니다. 영국에서 온 에를로크 숄메스라는 탐정입니다. 어려운 일만 골라 맡는 사람이었습니다. 한번 맡으면 놓친 적이 없다고 했습니다. 조수 윌슨이 늘 옆에 붙어 다녔습니다. 프랑스에서도 그 이름을 모르는 사람이 없었습니다.`,
            `이야기는 이렇습니다. 파리 근처 크로종이라는 곳에 오래된 성이 하나 있었습니다. 몇백 해 된 성이었습니다. 그 성의 새 주인이 수리를 하다가, 이상한 것을 발견했습니다. 벽을 헐다가 나온 것이었습니다. 낡은 벽 안에 딴 벽이 하나 더 있었습니다. 그 사이에 든 것이었습니다.`,
            `옛날 유물이 잔뜩 나온 것입니다. 그리고 며칠 뒤 그 유물이 몽땅 사라졌습니다. 사라진 방법이 이상했습니다. 방문은 잠겨 있었고, 창밖은 절벽이었습니다. 밑을 내려다보면 강이었습니다. 밧줄을 걸 자리도 없었습니다.`,
            `주인은 영국에서 에를로크 숄메스 선생을 불렀습니다. 숄메스는 조수 윌슨과 함께 왔습니다. 숄메스는 그 방에 들어가 삼십 분을 있었습니다. 그리고 나와서 이렇게 말했습니다.<br>"저는 이 일을 맡겠습니다. 다만 조건이 있습니다. 아무도 저를 따라다니지 마십시오."<br>주인이 그러겠다고 했습니다. 숄메스는 그 길로 나갔습니다.`,
            `숄메스는 이틀 동안 그 고장을 돌아다녔습니다. 그리고 사흘째 되는 날 아침, 이렇게 말했습니다.<br>"물건은 오늘 오후 세 시에 파리 북역에서 짐칸에 실려 나갑니다. 상자에는 다른 이름이 적혀 있을 겁니다."`,
            `사람들이 놀랐습니다. 숄메스는 그것을 어떻게 알아냈는지 말하지 않았습니다. 묻는 사람에게 대답도 하지 않았습니다. 수첩만 덮어 두었습니다. 알아낸 것을 말하지 않는 것이 그 사람의 버릇이었습니다.`,
            `그날 오후, 경찰이 파리 북역을 지켰습니다. 그리고 세 시에 그 상자를 찾아냈습니다. 상자를 열자 안에 유물이 다 들어 있었습니다. 하나도 빠지지 않았습니다. 깨진 것도 없었습니다. 옮기면서 하나하나 천에 싼 것이었습니다. 그리고 그 위에 종이가 한 장 있었습니다.`,
            `"숄메스 선생께. 선생이 도착하신 날 저녁, 저는 선생이 무엇을 볼지 다 알았습니다. 그래서 선생이 알아내실 자리에 물건을 두었습니다. 선생이 아니었으면 이 물건들은 개인 수집가에게 팔려 나갔을 겁니다. 저는 그것이 싫었습니다. 개인이 사 가면 그 물건은 다시 볼 수 없게 됩니다."<br>땅에서 나온 것이 창고로 들어가는 셈입니다.<br>"이것은 이 나라 땅에서 나온 것이니 박물관에 있어야 합니다. 그런데 제가 그렇게 하면 아무도 믿지 않습니다. 그래서 선생이 찾아내신 것으로 해 주십시오."<br>"선생과 겨루어 보고 싶었는데 그러지 못해 아쉽습니다. 다음에는 제대로 하지요. 아르센 뤼팽 올림."`,
            `숄메스는 그 종이를 다 읽고 접었습니다.<br>윌슨이 물었습니다.<br>"선생님, 저희가 진 겁니까?"<br>"물건은 찾았네."<br>"그래도 저 사람이 시킨 대로 한 것 아닙니까."`,
            `숄메스는 잠깐 아무 말도 하지 않았습니다. 그리고 이렇게 말했습니다.<br>"윌슨, 나는 저 사람을 좋아하지 않네. 남의 것을 가져가는 사람은 도둑일세. 그건 어떤 이유를 대도 마찬가지일세."<br>"그런데요?"<br>"그런데 오늘 저 물건들이 박물관으로 가네."<br>윌슨은 그 말에 대꾸하지 못했습니다. 옳고 그름이 한 줄로 서지 않는 자리였습니다.<br>그러고는 모자를 썼습니다.<br>"윌슨, 세상은 우리가 배운 것보다 조금 더 복잡하네."`,
            `그 뒤로 두 사람은 여러 번 다시 부딪쳤습니다. 이긴 적도 있고 진 적도 있습니다. 그런데 두 사람이 처음 마주친 것은 이날이었습니다. 그 뒤로 여러 편에 걸쳐 두 사람이 겨룹니다. 그리고 이날 두 사람은 얼굴도 보지 못했습니다. 한 사람은 종이를 남기고 갔고 한 사람은 그것을 읽었을 뿐입니다. 그런데도 겨룬 것이나 마찬가지였습니다.`
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
    title: 'Arsène Lupin, Gentleman Thief',
    cover: {
        title: 'Arsène Lupin, Gentleman Thief',
        tag: 'after Maurice Leblanc',
        intro: [
            `A thief who empties the mansions of the rich and the vaults of banks, and who has never once hurt anybody, and never touches a poor house. While all France finds his name amusing, only Inspector Ganimard loses sleep over it.`,
            `Eight stories are gathered here. Some of them are a pleasure from start to finish. Some leave the heart a little heavy at the end.`
        ]
    },
    chapters: [
        {
            title: 'A Thief on the Atlantic',
            paras: [
                `The Provence was a great liner sailing from France to America. She had been seven days at sea, and the passengers had grown used to one another's faces. Every evening the same people sat in the same places. Everybody knew who belonged where. On board a ship, that sort of thing settles itself very quickly.`,
                `That afternoon a telegram came to the ship. Wireless telegraphy had only just come into use. That news could fly out to the middle of the ocean at all was a wonder in itself. Before that, once a ship sailed, she was cut off from the land entirely. You heard nothing until you reached a port. The telegram said this:<br>"Arsène Lupin is aboard your ship. First-class passenger. Fair hair. Wound on the right arm. Name begins with R."`,
                `When the news got about, the whole ship was turned upside down. In those days there was nobody in France who did not know the name of Arsène Lupin. He had emptied the houses of the nobility, opened the vaults of banks and made fools of the police more than once. He had been caught, and had got away again, more than once. And every time, the newspapers made a great deal of it.`,
                `But he had never once hurt anybody. And he never touched a poor house. So the papers all printed his story, and people enjoyed reading it. People had taken the side of a thief. That does not happen often.`,
                `There were about forty first-class passengers on board. From that day they began to look one another over. Fair hair, a right arm that seemed to trouble him, a name beginning with R. There were several such people. Three of them alone had a bandaged arm.`,
                `I, who am writing this down, was on that ship myself. On that crossing I made friends with a young man called the Marquis de Rozaine. He was amusing to talk to, he knew a great deal, and he played cards very well. Whatever subject came up, he was never at a loss. But he never spoke about himself.`,
                `And there was a young lady called Nelly Underdown. She was the person everybody on the ship noticed. The Marquis de Rozaine was always at her side. When she walked the deck, he walked with her. People saw it and smiled.`,
                `But Rozaine had fair hair. And his name began with R. People began to whisper about it.`,
                `Rozaine heard the talk and laughed out loud.<br>"I only wish I were Lupin. Your purses would all be empty by now."`,
                `That night it happened. There were several thefts on board. Jewels and watches and purses disappeared. Some things went missing out of locked luggage. The locks were untouched. There was not a mark of anything being forced.`,
                `Next morning the passengers gathered and shouted at one another. The captain searched the whole ship, and nothing turned up.`,
                `And two days later the ship reached New York.`,
                `On the quay stood Inspector Ganimard of the French police. Ganimard was the man who had tried to catch Lupin many times and lost him every time. The very name made his face go hard. That was why he had come all the way to New York. He had waited several days for the ship to come in. The passengers came down one by one.`,
                `Ganimard stood at the foot of the gangway and looked at every face. Then, in front of one man, he raised his hand.<br>"Monsieur Arsène Lupin."`,
                `People turned round. The man Ganimard had taken hold of was the Marquis de Rozaine. For a moment Rozaine said nothing at all. Then he gave a light shrug.<br>"So I am found out."`,
                `And he looked toward Miss Nelly. Nelly was standing there with her face gone white. For a moment their eyes met. Lupin shook his head, very slightly. It meant: say nothing. In her hand was the camera Lupin had handed her a few hours before.`,
                `Inside it were all the stolen jewels. Nelly knew it.`,
                `In front of the customs desk Nelly stood a long while with the camera in her hand. And then she walked straight past the inspection table. Her hand was shaking. Nobody noticed a thing.`,
                `After the passengers had come ashore and scattered, Nelly walked to the end of the quay and threw the camera into the sea. Lupin saw it through the window of the police car. And he smiled. The jewels had gone into the water, and Nelly had committed no crime. That was why Lupin smiled.`
            ]
        },
        {
            title: 'Robbing a Castle from Prison',
            paras: [
                `In Normandy there was an old castle called Malaquis. It was built on a rocky island in the middle of a river. The water came right up to the foot of the walls. It was joined to the land by a single bridge. Block that bridge, and nobody could come or go. The castle had been built that way on purpose.`,
                `The master of the castle was a man called the Baron Cahorn. He was a very mean man. He kept hardly any servants. He was careful even with the lamps. In that great castle there were not five people. And yet there were remarkable things inside it.`,
                `Four paintings by Rubens, a tapestry by a famous artist, and old silver and jewels. Rubens lived about three hundred years ago. One of his paintings would buy a castle by itself.`,
                `One day a letter came to the baron.<br>"Monsieur le Baron. Kindly send me the four Rubens in your gallery, the tapestry, and the whole of the silver. I shall come for them on the night of the twenty-seventh of September. Arsène Lupin."`,
                `The baron read the letter and laughed. Because at that time Arsène Lupin was in prison. He was locked up in the Santé, waiting for his trial. It had been in all the papers. So the baron had reason to laugh. But a few days later another letter came.<br>"Monsieur le Baron. I see you have not yet packed. Do hurry."`,
                `Now the baron was frightened. He went to the police. But the local police did not take it seriously. They thought it was a joke. Letters like that were common at the time.<br>"Lupin is in prison."`,
                `The baron wrote to Paris. He wrote to Inspector Ganimard. Ganimard was on leave just then, but when he read the letter he packed his bag. Because the name Lupin was in it. He was a man who could not rest when he saw that name.`,
                `On the evening of the twenty-seventh of September, Ganimard came to the castle with two of his men. The three of them went over the whole place. They went down into the cellars. They put a guard on the bridge, locked the windows, and sealed the door of the gallery. They even stamped the seal. Then they sat in front of the gallery all night and kept watch. The three took turns to sleep. One of them was always awake. Not one footstep was heard.`,
                `Nothing happened. In the morning the three of them broke the seal and went into the gallery. The walls were bare. Only the nail holes were left. On the wallpaper were four square patches where the pictures had hung. Only those patches had kept their colour.`,
                `The four Rubens, the tapestry and the silver were all gone. The door was still sealed and the windows were still locked. Ganimard very nearly sat down on the floor. He had sat in front of that door all night. He had put on the seal with his own eyes and stamped it with his own hand. And the room was empty.`,
                `The investigation went on for many days. And this came out. Two months before, the baron had taken on two new servants. Their letters of reference were excellent. And the day after the theft, those two men vanished. When the police went to the addresses on the references, no such houses existed. The whole thing had been set up two months in advance.`,
                `There was one thing more. The castle had an old passage running underground. It had been dug hundreds of years before, and even the people of the castle had forgotten it. How had anybody found out about it? The old plans of the castle were still kept in a library somewhere. Anybody who took the trouble to look could see them.`,
                `Ganimard went to the Santé to see Lupin.`,
                `"Was it you?"<br>"I was here."<br>"I know that. That is why I am asking."`,
                `Lupin laughed.<br>"Inspector, there are some things you cannot do if you are on the spot."<br>And then he added this:<br>"By the way, that baron. You might find out how much rent he takes from the villagers who live on his land."`,
                `Ganimard let the remark pass. But later he did find out. He went to the villagers one by one and asked. And he told nobody what he heard. He did not even write it in his notebook. There was nothing he could have done with it anyway.`
            ]
        },
        {
            title: 'The Escape',
            paras: [
                `In prison, Arsène Lupin became a man the newspapers wrote about every day. The reporters printed his story daily. Even what Lupin had eaten became news. Reporters stood in a row outside the prison gate. The papers sold that well. And then one day Lupin let something drop.<br>"I shall not be going to my trial."`,
                `That went into the papers. The prison was turned upside down. They doubled the guards, moved him to another cell, and searched him several times a day. Visitors were stopped. Every letter was opened. And still they could not feel easy.`,
                `Then something strange happened. Lupin began to be ill. He could not eat, he lost weight, and his face went pale. In a month he was a different man. His clothes hung loose on him. The guards had to hold him up when he walked.`,
                `The doctor came several times.<br>"If this goes on, he will not live to see his trial."`,
                `The day of the trial came. Lupin was carried into the court on a stretcher. He could not even sit up by himself. People were shocked at the sight of him. It was not the face they had seen in the papers. There were sighs from the public gallery. People whispered, asking whether that could really be Lupin.`,
                `The judge asked,<br>"State your name."<br>"Baudru. Désiré Baudru."`,
                `The courtroom stirred.<br>"Are you not Arsène Lupin?"<br>"I do not even know who Lupin is."`,
                `The man said he did not know why he had been arrested. He had been hungry and stolen a loaf of bread, he said, and suddenly here he was. His way of speaking was that of a man with no schooling. He said he could not read. The judge asked again several times. The court did not believe him. But there was one problem.`,
                `When they measured the man's body, it did not match Lupin's record. The height was different, the shape of the ears was different, the length of the fingers was different. In those days a person's identity was checked by measuring the body. That was before fingerprints. They measured the height and the length of the arms and the shape of the ears and wrote it all down.`,
                `Ganimard was called.<br>"Is this man Lupin?"<br>Ganimard looked at the face for a long while. And then he said this:<br>"...I do not know."`,
                `Those were the most painful words Ganimard said in his life. That one sentence brought the trial down. The man who had chased Lupin longest had said he did not know. Whatever the other witnesses said made no difference. The trial was put off. And Désiré Baudru was released for lack of evidence.`,
                `That day the man walked out of the prison gate. Ganimard followed him. Baudru walked about Paris all day. He walked like a man with nowhere to go. There was no direction in his steps. Ganimard did not lose him once.`,
                `He hung about outside a bakery, and dozed on a bench. When night came he went under a bridge and slept there. He slept under a covering of newspaper. Ganimard spent the night on the bridge above him.`,
                `Ganimard followed him for three days. And on the fourth day Baudru suddenly disappeared. It happened while he was turning a corner. At the end of that alley there was nobody at all.`,
                `That evening a letter came to Ganimard's house.<br>"Inspector, you have had three hard days. It is very cold under that bridge. And let me tell you one thing. Pretending to be ill in prison is not difficult. What is difficult is not eating for a month. For that month I really did starve. You can put on a sick face, but you cannot put on the measurements of a body. So there was nothing for it but to make the body smaller. Unless I shrank it, the measurements would have matched. Arsène Lupin."`,
                `Ganimard read the letter and sat a long time. Then he muttered,<br>"The fellow starved himself for a month."<br>He was less angry than dumbfounded. He had never met anybody who would go that far.`
            ]
        },
        {
            title: 'The Man in the Railway Carriage',
            paras: [
                `One summer morning I took the train from Paris to Rouen. In those days the carriages on that line were divided into separate compartments. Once you got in, you could not get out until the next station. You could not move to the next compartment either. There was no corridor. Each compartment had only its own door to the outside.`,
                `I was alone in mine. Just as the train was about to leave, a man jumped in. He was tall, well dressed, and looked about forty. His only luggage was one small bag. It was not the luggage of a man going a long way. That was the first thing I noticed.`,
                `He sat down and opened a newspaper. But he kept looking out of the window. And every time I looked at him he looked away. He never turned a page of the paper. He only held it open. They were not the eyes of a man reading.`,
                `I remembered something I had read in that morning's paper. A week before, there had been a crime on this line. A man had died in a railway compartment, and his money had gone. Because the compartments were shut off from one another, nobody had known. It only came out at the next station.`,
                `The criminal had not been caught. But that day's paper had printed this: a description of him. Tall, about forty, brown eyes, well dressed. There are thousands of such men in Paris. But when one is sitting opposite you, it is another matter.`,
                `I looked at the man opposite me. And the sweat came out on my back.`,
                `It was two hours to the next station. In those two hours I thought of a great many things. Should I pull the alarm cord? But if you pull it for nothing, you are fined and made a fool of. It would mean stopping the train. A train full of people.`,
                `And I might be mistaken. I went on watching him. Then he seemed to fall asleep. His head tilted toward the window. His breathing came evenly.`,
                `Very slowly I stood up and took my bag down from the rack. And I tried to get something out of it — anything.`,
                `At that moment the man opened his eyes. Our eyes met. And in that instant he smiled. There was not a trace of surprise in it. It was the face of a man who already knew what I was about to do. I let go of the thing in my hand.`,
                `"Monsieur, what do you mean to do with me?"<br>"..."<br>"You have read the newspaper, I see."`,
                `I could not say a word.`,
                `The man spoke.<br>"Let me tell you how things stand. I am not that man. But I am a man who would be in difficulty if the police took me just now."<br>"Then who are you?"<br>"I shall not tell you my name."`,
                `The train was coming near the next station. The man said this:<br>"I have a favour to ask of you. When you get down at the station, say that you did not see me."<br>"Why should I do that?"<br>"There is no reason. It is simply a favour."<br>His voice was low. It was not the voice of a man pleading.`,
                `The train stopped. And there were policemen standing on the platform. I got down.`,
                `A policeman asked me,<br>"Who was in that compartment?"`,
                `For a moment I could not answer. Then I said,<br>"I was alone."`,
                `Why I said that, I do not know to this day. I was a man who had never told a lie. But that day the words came out by themselves.`,
                `And then this happened. After the train had gone on, the real criminal was caught at the next station.`,
                `The man in my compartment had tied him up and pushed him into the luggage van. He had done it in the short moment while I was on my feet. I had heard nothing. My back had been turned. And on the seat lay a visiting card. It said Arsène Lupin.`
            ]
        },
        {
            title: 'The Seven of Hearts',
            paras: [
                `One night I came home, went into my study, and stopped. There was a playing card lying on my desk. It was the seven of hearts. One ordinary playing card. But there was something odd about it.`,
                `In the seven heart shapes, seven small holes had been pricked with a needle. You could only just see them if you held the card up to the light. They had been made with the point of a needle. They were inside the heart shapes, so you would never notice them at a glance. I put the card in a drawer. And I forgot about it. I took it for somebody's joke. I did not open that drawer for many months.`,
                `But many months later, something happened.`,
                `An inventor disappeared. All the papers were full of it. His name was Louis Lacombe. He had been making the plans for a submarine. A boat that travels under the water. At that time none had yet been built. It existed only on paper.`,
                `In those days every country wanted such a thing very badly. Whichever country had it first would hold the sea. Even a great ship cannot stop what comes from under the water. So everybody was after it. Lacombe lived and worked in the house of a rich man. He used a whole room as a laboratory. The rich man was paying for it all. When the man who pays and the man who makes are two different people, things become difficult. The question remains of whom the thing belongs to. And then one day Lacombe disappeared.`,
                `The plans disappeared with him. Not one sheet of paper was left. And a little while later the rich man came into a great deal of money. He did not say where it came from. Nobody asked.`,
                `Reading about the case, something came back to me.`,
                `I opened the drawer and took out the card. It was the first time I had held it in months. There were seven holes. I held the card to the light. Then I laid it on a sheet of paper and marked where the holes were. I marked them one by one with the point of a pencil.`,
                `That gave me seven dots. I joined them up. I tried joining them with a ruler. They meant nothing at all.`,
                `I stared at it for days. I stared at it while I ate. And then one night I turned the card over. When the front and back are reversed, the positions are reversed too. The holes had been pricked from the front, so they had to be read from the back. It took me days to see that. And then I understood.`,
                `The dots marked places in the pattern on the wall of a certain room. The room was the one where Lacombe had worked.`,
                `That night I went to the house. And I climbed the wall.`,
                `I, who am writing this, am not a thief. I had never in my life climbed another man's wall. My palms were scraped raw. When I got down I stood a long while getting my breath. But that night I did it. I went into the room and looked for the pattern on the wall. The wallpaper had the same pattern all along it.`,
                `I pressed the seventh place. There was a small click under my fingertip. The wall opened. A door no bigger than a hand swung inward. Inside was a bundle of papers. Dust had settled on them. Nobody had touched them for two years. The paper had gone yellow.`,
                `They were Lacombe's plans. And on top of them lay a sheet of paper.<br>"I found this two years ago. But I did not take it. If I took it, some country would build a boat from it, and then a great many people would die. I am a thief, but I am not that kind of man. That one line is the heart of this story. It tells you what Lupin takes and what he leaves behind. If you find this, monsieur, do not hand it to the government. Burn it. Arsène Lupin."`,
                `I looked at that paper for a long time. What I did with the plans I shall not write here. But one thing I will set down.`,
                `The man Lacombe never came back. Nobody knows where he went. And the rich man was punished afterwards. What he had done to Lacombe came out. Lupin arranged it. How he arranged it, nobody knows. Only that the rich man confessed it himself.`
            ]
        },
        {
            title: 'The Black Pearl',
            paras: [
                `On the second floor of an old apartment house in Paris lived an old lady, the Countess d'Andillot. When she was young she had gone in and out of palaces. But now she was old and poor. She could not even heat her rooms properly. In winter she sat in her overcoat. Even so, she never asked anybody for anything.`,
                `She had one thing left. A black pearl. It was so large and so fine that people said no price could be put on it. There were only a few such pearls in the world, they said. A pearl with a black sheen is a very rare thing. That was why it was worth so much.`,
                `The countess would not sell it. Every time she looked at the pearl, she remembered when she was young. She had hidden it very well. She never told anybody where. And that made things difficult later.`,
                `One winter morning the countess was found dead in that apartment. And the black pearl was gone. The police began their inquiry.`,
                `The apartment was very strange. The door had been locked from inside. Yet the room had been turned upside down. Every wardrobe stood open, and the drawers had been tipped out onto the floor. It was the mark of somebody who had searched and not found. A hurried hand had been through it.`,
                `The police suspected the maid. But the maid had been elsewhere that night. The people on the floor below were questioned too.`,
                `On the floor below lived a young man. A few days later he moved away. When the police went to his rooms, they were empty. He had not even left his luggage.`,
                `Six months went by. Then one day Inspector Ganimard came to see me.<br>"Do you remember the black pearl case?"<br>"I remember it."<br>"Today that pearl turned up at a jeweller's."`,
                `The police watched the jeweller's shop. They put men inside and outside. They sat there pretending to be customers. They had waited six months. And they arrested the man who came to sell the pearl. He was an ordinary-looking man. His name was Danègre.`,
                `But the man said this:<br>"I did not steal it. When I went into that room, the countess was already..."`,
                `And he told this story. That night he had gone into the apartment to rob it. But when he got into the room, the countess was already dead. And the room had already been ransacked. All the drawers were open. Somebody had done before him what he had come to do. Danègre froze where he stood.`,
                `Somebody had been there before him. He was frightened and turned to go, but before he went he looked round the room once. And he looked under the bed.`,
                `The pearl was lying there. What the first visitor had failed to find, the second had found by chance. The countess had been holding it in her hand and let it fall. So it had not been hidden anywhere at all.`,
                `The police did not believe him. It was a thief's story. Nobody believes a story like that. But then something strange happened. Just before the trial, a letter was printed in the newspaper.<br>"It was I who searched that room first that night. I came out without finding the pearl.<br>And I state also that the countess had already died before that.<br>I harmed nobody that night. Nor did Danègre. The man is a thief and nothing more. Arsène Lupin."`,
                `Because of that letter, Danègre was punished for the theft alone.`,
                `Ganimard folded the newspaper and said,<br>"The fellow writes letters even about what he failed to steal."<br>And then he added,<br>"But without that letter the man would have had a far heavier sentence. One letter saved a man."<br>Ganimard could not help admitting it.`
            ]
        },
        {
            title: "The Queen's Necklace",
            paras: [
                `In the family of the Count de Dreux-Soubise there was a necklace that had come down through the generations. It was said to have belonged to a queen a hundred years before. It was a thing with a story attached that the whole country knew. The queen had come to grief over that necklace, the story went. Even small children knew it.`,
                `In truth the necklace had been broken up and sold off piece by piece, and what this family had was a few of the pieces strung together again. Even so, it was a remarkable thing. It was hard to put a price on. Every single stone was worth money. But the story attached to it was worth more.`,
                `There was a child in that house. He was the son of a woman called Henriette. Henriette had grown up with the countess as a girl, and when times went hard for her she had come to live in an attic room of the house. The boy's name was Raoul. He was a child who ran about the house as he pleased. He was six years old. He wandered in and out among the grown-ups without a thought. Nobody paid him any attention.`,
                `One night, on the night of a ball, the countess wore the necklace. Dozens of people saw it that night. When she came home she took it off and laid it on her dressing table. She locked the door from inside and slept. She kept the key under her pillow. She always did.`,
                `Next morning the necklace was gone. The room had been locked. The window was fastened from inside, and outside was a drop of three floors. The chimney was too narrow for a person to get into. The police put an arm up it and wrote that down. A grown man's shoulders would not go through.`,
                `However they looked into it, there was no answer. Even the police gave up. The count suspected everybody in the house. He called the servants in one by one and questioned them. Above all he suspected Henriette in the attic. Because she was poor. There was no other reason. Being poor was used as if it were proof.`,
                `There was not one piece of evidence. But the count put Henriette and Raoul out of the house. Henriette said nothing, and took her son and went. All her belongings made one bundle. She did not try to explain. She knew that explaining would do no good.`,
                `Many years went by after that. Every year the countess sent Henriette a little money. Because she felt she had done wrong. But she could not tell her husband. She only sent the money in secret. Then one year Henriette began to refuse it.`,
                `And she wrote in her letter,<br>"Things are easier for us now. My son brings money home."`,
                `And after that the letters stopped. She left no address. There was no way to find her.`,
                `About twenty years later, a parcel came to the countess. Inside it was the necklace. The very necklace that had been lost. And there was a note.<br>"Madame. I return this to you. And I state that Henriette had nothing whatever to do with the matter. That woman lived for twenty years under the name of a thief, and she never told even her own son."<br>"The one who went into that room that night was a six-year-old child. The chimney is too narrow for a grown person, but a six-year-old goes through. That child did not even know what he was doing."<br>"I am that child. Arsène Lupin."`,
                `The countess held the note for a long time. She read it over several times. She read it with her fingertip on the words. Every time she stopped at the same place. Then she showed it to the count. The count read it and could not say a word. The hand holding the note shook.`,
                `Twenty years before, without one piece of evidence, he had put a person out of his house. And in the twenty years since, he had not once thought about it again. The one who did the sending away had forgotten and lived on. Only the one sent away had carried it for twenty years. Henriette had died some years before.`,
                `At the end of the note there was this line:<br>"For twenty years I did not sell that necklace."<br>Because if he sold it, his mother would really have been the mother of a thief. For twenty years he had held a thing of great value in his hand, and had not.`
            ]
        },
        {
            title: 'Mr Sholmès Arrives a Step Too Late',
            paras: [
                `Sherlock Holmes became Herlock Sholmès, and Watson became Wilson. The names were only slightly twisted. Read out loud, they are nearly the same. Readers of the time knew perfectly well who was meant. The altered names became, if anything, more amusing. They are still printed that way today.`,
                `This is the story. Near Paris, in a place called Crozon, there was an old castle. It was several hundred years old. The new owner was having it repaired when he found something strange. It came to light when a wall was being knocked down. Inside the old wall there was another wall. The thing was between the two.`,
                `A great hoard of ancient relics came out. And a few days later every one of them vanished. The manner of their vanishing was strange. The door of the room was locked, and outside the window was a cliff. Look down, and there was the river. There was nowhere to fix a rope.`,
                `The owner sent to England for Mr Herlock Sholmès. Sholmès came with his assistant Wilson. Sholmès went into the room and stayed there thirty minutes. Then he came out and said,<br>"I shall take this case. But on one condition. Nobody is to follow me about."<br>The owner agreed. Sholmès went straight out.`,
                `For two days Sholmès went about the district. And on the morning of the third day he said,<br>"The goods will leave Paris this afternoon at three o'clock, in the luggage van from the Gare du Nord. The crate will have another name on it."`,
                `People were astonished. Sholmès did not say how he had found it out. He did not answer those who asked. He only closed his notebook. Not saying what he had found out was a habit of his.`,
                `That afternoon the police watched the Gare du Nord. And at three o'clock they found the crate. When they opened it, all the relics were inside. Not one was missing. Not one was broken. Each had been wrapped in cloth for the journey. And on top lay a sheet of paper.`,
                `"To Mr Sholmès. On the evening you arrived, I already knew everything you would see. So I put the goods where you would find them. Had it not been for you, these things would have been sold to a private collector. I did not like that. When a private person buys such things, they are never seen again."<br>What came out of the ground would only go into a storeroom.<br>"These came out of the soil of this country and belong in a museum. But if I do it myself, nobody will believe it. So let it be that you found them."<br>"I had hoped to match myself against you, and I am sorry it could not be. Next time we shall do it properly. Arsène Lupin."`,
                `Sholmès read the paper through and folded it.<br>Wilson asked,<br>"Sir, have we lost?"<br>"We have the goods."<br>"But we did exactly what that man told us to."`,
                `For a moment Sholmès said nothing. Then he said this:<br>"Wilson, I do not like that man. A man who takes what belongs to others is a thief. That is so whatever reasons he gives."<br>"And yet?"<br>"And yet today those things are going to a museum."<br>Wilson had no answer to that.<br>It was a place where right and wrong would not stand in a single line.<br>Then Sholmès put on his hat.<br>"Wilson, the world is a little more complicated than we were taught."`,
                `After that the two of them crossed paths many times. Sometimes one won and sometimes the other. But the first time they met was this day. Their contests go on through many stories after this. And on this day they never even saw each other's faces. One left a sheet of paper, and the other read it. And yet it was a contest all the same.`
            ]
        }
    ],
    afterword: {
        title: 'After Reading',
        paras: [
            `What this book holds is not one long story but several short ones. That is how the Lupin stories first appeared. They were printed one at a time in a magazine and gathered into a book afterwards.`,
            `The writer was Maurice Leblanc of France. What he really wanted was to write serious novels. But those novels did not sell.`,
            `Then a magazine asked him for something. England had Sherlock Holmes, they said; would he make a character like that for France?`,
            `Instead of a detective, Leblanc made a thief. That was Arsène Lupin. It was the year 1905.`,
            `And for the rest of his life he wrote Lupin stories. There are more than twenty books. The man who had wanted to write serious novels made his name with tales of a thief.`,
            `In his last years, it is said, he felt that Lupin was following him about. As though the man were always standing just behind him.`,
            `It happens now and then that a maker is weighed down by what he has made. Conan Doyle felt the same about Holmes. Both of them tried to kill their creation off.`,
            `What is here is a selection of the best-known stories, retold.`,
            `Now let us pick out some places worth a second look.`,
            `First, read the opening story again. A telegram comes to a ship crossing the Atlantic: Lupin is on board. But apart from a name, nobody knows anything.`,
            `So the people on the ship begin to suspect one another. Is it that man? Is it this one? Those few days are the whole story.`,
            `And at the end it comes out who Lupin was. Read it again, and you will find the clues laid down earlier.`,
            `Second, look again at the castle robbed from prison. Lupin is locked up. And in the meantime the whole contents of a castle disappear.`,
            `How a man in prison could do it is the riddle of the story. The answer is that he had done it all before he was locked up.`,
            `So Lupin's whole way of working is here. He is not a man who steals things. He is a man who sets the board up beforehand.`,
            `Third, count what Lupin steals. He does not take from the poor. He goes after the rich, the nobility, and fortunes made by wrongdoing.`,
            `And now and then he gives back what he has taken. He does it once he has learned the story behind it. That is why he is called the gentleman thief.`,
            `But you must not take that at face value. He is a thief. He takes what belongs to others. It is only that the stories paint him kindly.`,
            `Fourth, count the times Lupin is in disguise. In these stories he always appears as somebody else.`,
            `He becomes an old gentleman, a policeman, a Russian prince, and even the very inspector who is hunting him. And nobody recognises him.`,
            `So Lupin has no real face. Right to the end of these stories, what he actually looks like is never shown.`,
            `Fifth, look again at the story with Mr Sholmès in it. He is the famous detective from England.`,
            `You can tell from the name. It is Sherlock Holmes with the letters of his name shuffled about. At first the name was used as it was; then Conan Doyle's side objected, and it was changed.`,
            `And in that contest Lupin wins. The story was appearing in a French magazine, so that was only to be expected.`,
            `But Leblanc did not make Sholmès look foolish. He drew him as a very able man, and then had him beaten. Only then is the victory worth anything.`,
            `And once, Sholmès wins. He gets the goods back. Only, Lupin escapes on the spot.`,
            `The characters are worth noting too.`,
            `Look again at Inspector Ganimard. He is the man who chases Lupin all his life. And loses him again and again.`,
            `But the two of them are not simply hunter and hunted. Sometimes it is Lupin who sends for him, and sometimes Lupin who helps him.`,
            `And Lupin behaves almost as if he liked being caught by Ganimard. Because without a capture, there is no story.`,
            `It helps to know something of the times. These stories are set in France about a hundred and twenty years ago. It was a time when Paris was very grand.`,
            `In those days Paris had great fortunes, and the castles and mansions were full of valuable things. And it was also a time when people had begun to wonder where those fortunes came from.`,
            `So the popularity of a thief who robbed the rich has something to do with that. People took Lupin's side.`,
            `And it was a time when newspapers and magazines sold in great numbers. They printed a story in each issue to keep their readers. Sherlock Holmes and Lupin both came out that way.`,
            `These stories hold on to two things.`,
            `One is the question of why we come to like a thief. Lupin breaks the law. And yet the reader hopes he will not be caught.`,
            `The reason lies in whom he beats. The boastful rich, fortunes made by wrongdoing, and the slow-witted police. The things people disliked.`,
            `The other is that what is known and what is seen are two different things. Lupin's gift is not in his hands. It is in knowing what people believe.`,
            `So, before he steals anything, he usually arranges for people to be looking in the wrong place. That is the method these stories use every time.`,
            `But there is one thing to keep in mind when reading them. These are stories made up to entertain. Nobody in real life steals so gracefully.`,
            `And real theft is taking something that belongs to somebody. In the stories that somebody is painted as unpleasant, and so our conscience stays comfortable.`,
            `Lupin went on to become a much-loved figure in France. He has been made into films and comics and television series without end.`,
            `In Japan a comic was made about his grandson, and it became very well known. So a character printed in a magazine a hundred and twenty years ago is still alive.`,
            `If you ever read these stories again, look this time for the moment Lupin first appears. Usually he is already there near the beginning. Under another name.`,
            `Lastly, here are some things to think about. I shall not write down the answers.`,
            `Does the fact that Lupin steals only from the rich make him right? Stealing is stealing.`,
            `Why did Ganimard chase him all his life? Was catching him the point, or was there something else?`,
            `And why do we enjoy stories about thieves? That question is not easy to answer even when you read these stories again as a grown-up.`
        ]
    },
    quiz: [
        { q: 'Which of these was NOT in the telegram as a clue for finding Lupin on the ship?', choices: ['A name beginning with R', 'Fair hair and a wound on the right arm', 'Round spectacles with steel rims'], answer: 2 },
        { q: 'What did Miss Nelly do with the camera that held the jewels?', choices: ['Threw it into the sea without a word', 'Handed it straight to the police', 'Gave it back to Lupin'], answer: 0 },
        { q: 'Where was Lupin when Malaquis Castle was robbed?', choices: ['In the prison where he was locked up', 'On a night train to Paris', 'At a small inn near the castle'], answer: 0 },
        { q: 'What did Lupin make use of in the Malaquis affair?', choices: ['A newspaper advertisement placed by the baron', 'The two newly hired servants', 'A forgotten old underground passage'], answer: 2 },
        { q: 'Why was Lupin able to pass for somebody else at his trial?', choices: ['He had found a double beforehand', 'He had bribed one of the guards', 'He had starved for a month and changed his measurements'], answer: 2 },
        { q: 'What did Ganimard say in court?', choices: ['I shall look into it again', 'I do not know', 'That is the man'], answer: 1 },
        { q: 'What did Lupin do in the railway carriage?', choices: ['Gave the police his name and got off', 'Took the purse of the gentleman beside him', 'Tied up the real criminal and put him in the luggage van'], answer: 2 },
        { q: 'What did the holes in the seven of hearts point to?', choices: ['The name of somebody hidden in the house', 'The place to press in the pattern on the wall', 'The seven numbers that opened a safe'], answer: 1 },
        { q: 'Why did Lupin not take the submarine plans?', choices: ['Because a boat built from them would kill a great many people', 'Because they had already been sold to another country', 'Because he saw that the plans were fakes'], answer: 0 },
        { q: 'Who found the black pearl under the bed?', choices: ['The maid who worked in the house', 'Danègre, who went into the room later', 'Ganimard, who was the first to arrive'], answer: 1 },
        { q: 'Why did Lupin have a letter printed in the newspaper?', choices: ["So that Danègre would not be blamed for what he had not done", 'Because he wanted to boast of what he had done', 'To warn Ganimard of his next move'], answer: 0 },
        { q: "Who took the queen's necklace?", choices: ['Raoul, who was six years old at the time', 'A count who had come as a guest', 'The mother who worked in the house'], answer: 0 },
        { q: 'How did the six-year-old get into that room?', choices: ['Along the window ledge from the second floor', 'Down the chimney, too narrow for a grown person', 'Through an unlocked back door'], answer: 1 },
        { q: 'Why did Lupin not sell the necklace for twenty years?', choices: ['It was too well known to be sold', 'He was waiting for the price to rise', 'If he sold it, his mother would really be the mother of a thief'], answer: 2 },
        { q: 'Why was the name Sholmès used?', choices: ["Because the creator of Sherlock Holmes objected, so the name was twisted", 'Because the name was hard to read in France', 'To make clear that this was a different person'], answer: 0 },
        { q: 'What did Sholmès say to Wilson at the end?', choices: ['I shall never set foot in France again', 'The world is a little more complicated than we were taught', 'A man like that will end up in my hands one day'], answer: 1 },
        { q: 'Which of these is NOT a fair thing to say after reading this book?', wide: true, choices: ['Seeing how one telegram saying Lupin was aboard set everyone suspecting each other, a single name shook a whole ship.', 'Seeing how Lupin told Ganimard in prison that he had been there all along, the castle robbery had nothing to do with him.', 'Seeing how Lupin never touched a poor house, even his stealing had a line it did not cross.', 'Seeing how his mother never sold the necklace in twenty years, selling it really would have made her the mother of a thief.'], answer: 1 }
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
    emoji: '🎩',
    art: ['end.webp'],
    paras: [
        `이 책에 실린 것은 한 편의 긴 이야기가 아니라 여러 편의 짧은 이야기입니다. 뤼팽 이야기는 원래 그렇게 나왔습니다. 잡지에 한 편씩 실린 것을 나중에 묶은 것입니다.`,
        `쓴 사람은 프랑스의 모리스 르블랑입니다. 그는 원래 진지한 소설을 쓰고 싶어 했습니다. 그런데 그 소설들이 팔리지 않았습니다.`,
        `그러다 어느 잡지사에서 부탁을 받았습니다. 영국에 셜록 홈스가 있으니 프랑스에도 그런 인물을 하나 만들어 달라는 것이었습니다.`,
        `르블랑은 탐정 대신 도둑을 만들었습니다. 그것이 아르센 뤼팽입니다. 1905년의 일입니다.`,
        `그리고 그 뒤로 평생 뤼팽 이야기를 쓰게 됩니다. 스무 권이 넘습니다. 진지한 소설을 쓰고 싶어 하던 사람이 도둑 이야기로 이름을 얻은 것입니다.`,
        `말년에 그는 뤼팽이 자기를 따라다닌다고 여겼다고 합니다. 자기 뒤에 늘 그 사람이 서 있는 것 같다고요.`,
        `만든 사람이 만든 것에 눌리는 일이 이따금 있습니다. 코넌 도일도 홈스에게 그랬습니다. 두 사람 다 그 인물을 죽이려 해 보았습니다.`,
        `여기 실린 것은 그 가운데 널리 알려진 몇 편을 골라 옮긴 것입니다.`,
        `이제 다시 볼 대목을 짚어 봅시다.`,
        `첫째, 첫 이야기를 다시 읽어 보십시오. 대서양을 건너는 배 안에 뤼팽이 타고 있다는 전보가 옵니다. 그런데 이름 말고는 아무것도 모릅니다.`,
        `그러니 배 안의 사람들이 서로를 의심하기 시작합니다. 저 사람이 뤼팽인가, 이 사람이 뤼팽인가 하고요. 그 며칠이 이 이야기의 전부입니다.`,
        `그리고 마지막에 뤼팽이 누구였는지가 밝혀집니다. 다시 읽어 보면 앞에 실마리가 놓여 있습니다.`,
        `둘째, 감옥에서 성을 터는 이야기를 다시 보십시오. 뤼팽은 감옥에 갇혀 있습니다. 그런데 그 사이에 어느 성의 물건이 통째로 없어집니다.`,
        `갇힌 사람이 어떻게 그렇게 했는지가 이 이야기의 수수께끼입니다. 답은 그가 갇히기 전에 다 해 두었다는 것입니다.`,
        `그러니 뤼팽의 방식이 여기 다 나옵니다. 그는 물건을 훔치는 사람이 아니라 판을 짜 두는 사람입니다.`,
        `셋째, 뤼팽이 훔치는 대상을 세어 보십시오. 그는 가난한 사람의 것을 훔치지 않습니다. 부자와 귀족과 나쁜 짓으로 모은 재산을 노립니다.`,
        `그리고 이따금 훔친 것을 돌려주기도 합니다. 사연을 알고 나서 그렇게 합니다. 그래서 그를 신사 도둑이라고 부릅니다.`,
        `그런데 그것을 그대로 믿으면 안 됩니다. 그는 도둑입니다. 남의 것을 가져갑니다. 이야기가 그를 좋게 그릴 뿐입니다.`,
        `넷째, 뤼팽이 변장하는 대목을 세어 보십시오. 이 이야기들에서 뤼팽은 늘 다른 사람으로 나타납니다.`,
        `늙은 신사가 되고, 경찰이 되고, 러시아 왕자가 되고, 심지어 자기를 쫓는 형사가 되기도 합니다. 그리고 아무도 알아보지 못합니다.`,
        `그러니 뤼팽에게는 진짜 얼굴이 없습니다. 이 이야기들이 끝날 때까지 그 사람의 본모습이 어떤지는 나오지 않습니다.`,
        `다섯째, 숄메스 선생이 나오는 이야기를 다시 보십시오. 영국에서 온 이름난 탐정입니다.`,
        `그 이름을 보면 알 수 있습니다. 셜록 홈스를 가져다 이름의 글자를 뒤섞어 놓은 것입니다. 처음에는 이름을 그대로 썼다가, 코넌 도일 쪽에서 항의를 받고 바꾸었습니다.`,
        `그리고 그 대결에서 뤼팽이 이깁니다. 프랑스 잡지에 실리는 이야기였으니 당연한 셈입니다.`,
        `다만 르블랑은 숄메스를 우습게 그리지 않았습니다. 아주 뛰어난 사람으로 그려 놓고, 그 사람을 이기게 만들었습니다. 그래야 이긴 것이 값이 나가기 때문입니다.`,
        `그리고 한 번은 숄메스가 이깁니다. 물건을 되찾아 갑니다. 다만 뤼팽은 그 자리에서 달아납니다.`,
        `인물도 짚어 둘 만합니다.`,
        `가니마르 형사를 다시 보십시오. 뤼팽을 평생 쫓는 사람입니다. 그리고 여러 번 놓칩니다.`,
        `그런데 두 사람 사이가 그냥 쫓고 쫓기는 사이가 아닙니다. 뤼팽이 먼저 그를 부르기도 하고, 도와주기도 합니다.`,
        `그리고 뤼팽은 가니마르에게 잡히는 것을 오히려 좋아하는 것처럼 굽니다. 잡히지 않으면 이야기가 되지 않기 때문입니다.`,
        `그 시절 사정도 알아 두면 좋습니다. 이 이야기들의 배경은 백이십 년쯤 전 프랑스입니다. 파리가 아주 화려하던 시절입니다.`,
        `그때 파리에는 큰 부자들이 있었고, 성과 저택에 값나가는 물건이 가득했습니다. 그리고 그 재산이 어디서 온 것인지를 사람들이 궁금해하던 때이기도 합니다.`,
        `그러니 부자의 것을 훔치는 도둑이 인기가 있었던 것도 그런 사정과 이어집니다. 사람들은 뤼팽 편을 들었습니다.`,
        `그리고 그 무렵은 신문과 잡지가 아주 많이 팔리던 때입니다. 소설을 한 편씩 실어 사람들을 붙잡아 두었습니다. 셜록 홈스도 뤼팽도 그렇게 나왔습니다.`,
        `이 이야기들이 붙들고 있는 것은 두 가지입니다.`,
        `하나는 도둑을 왜 좋아하게 되느냐는 것입니다. 뤼팽은 법을 어깁니다. 그런데 읽는 사람은 그가 잡히지 않기를 바랍니다.`,
        `그 까닭은 그가 이기는 상대에 있습니다. 잘난 척하는 부자, 나쁜 짓으로 모은 재산, 그리고 어리숙한 경찰입니다. 사람들이 밉게 여기던 것들입니다.`,
        `다른 하나는 아는 것과 보이는 것이 다르다는 것입니다. 뤼팽의 재주는 손재주가 아닙니다. 사람이 무엇을 믿는지를 아는 것입니다.`,
        `그래서 그는 대개 물건을 훔치기 전에 사람들이 엉뚱한 데를 보게 만들어 둡니다. 그것이 이 이야기들이 늘 쓰는 방법입니다.`,
        `다만 이 이야기들을 읽을 때 알아 둘 것이 있습니다. 이것은 재미있게 지어낸 이야기입니다. 실제로 도둑질을 그렇게 멋있게 하는 사람은 없습니다.`,
        `그리고 실제 도둑질은 누군가의 것을 빼앗는 일입니다. 이야기에서는 그 사람이 밉게 그려지니 마음이 편할 뿐입니다.`,
        `뤼팽은 그 뒤로 프랑스에서 아주 사랑받는 인물이 되었습니다. 영화와 만화와 연속극으로 끝없이 만들어졌습니다.`,
        `일본에서는 뤼팽의 손자라는 설정으로 만화가 만들어져 크게 알려지기도 했습니다. 그러니 백이십 년 전 잡지에 실린 인물이 아직도 살아 있는 셈입니다.`,
        `언젠가 이 이야기들을 다시 읽게 되거든, 이번에는 뤼팽이 언제 처음 나타나는지를 찾아보십시오. 대개 앞쪽에 이미 나와 있습니다. 다른 이름으로요.`,
        `마지막으로 생각해 볼 것을 남겨 둡니다. 답은 적어 두지 않겠습니다.`,
        `뤼팽이 부자의 것만 훔친다는 것이 그 사람을 옳게 만들까요? 훔치는 것은 훔치는 것입니다.`,
        `가니마르는 왜 평생 그를 쫓았을까요? 잡는 것이 목적이었을까요, 아니면 다른 것이 있었을까요?`,
        `그리고 우리가 도둑 이야기를 재미있게 읽는 까닭은 무엇일까요. 이 물음은 어른이 되어 다시 읽어도 답하기가 쉽지 않습니다.`
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
    title: `괴도 뤼팽`,
    tag: `모리스 르블랑 원작`,
    intro: [
        `귀족의 저택과 은행 금고를 털면서도 사람을 다치게 한 적이 없고 가난한 집은 건드리지 않는 도둑. 프랑스가 그 이름을 재미있어하는 동안 가니마르 형사만 잠을 못 잡니다.`,
        `여덟 편을 골라 담았습니다. 통쾌한 편도 있고, 마지막에 마음이 무거워지는 편도 있습니다.`
    ]
};

function coverPage() {
    const cv = CV();
    return `<div class="page page-cover">
 <div class="story-page-left story-page-left-full">
 ${artFrame('cover.webp', '🎩')}
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
    { q: "배 안에서 뤼팽을 찾을 단서로 전보에 적힌 것이 아닌 것은 무엇입니까?", choices: ["이름은 R로 시작한다는 것", "금발에 오른팔의 상처", "쇠테를 두른 둥근 안경"], answer: 2 },
    { q: "넬리 아가씨가 보석이 든 사진기를 어떻게 했습니까?", choices: ["아무 말 없이 바다에 던졌다", "경찰에게 곧바로 넘겨주었다", "뤼팽에게 도로 돌려주었다"], answer: 0 },
    { q: "말라키 성이 털렸을 때 뤼팽은 어디 있었습니까?", choices: ["갇혀 있던 감옥 안", "파리로 가는 밤 기차", "성 근처의 작은 여관"], answer: 0 },
    { q: "말라키 성 사건에서 뤼팽이 이용한 것은 무엇입니까?", choices: ["성주가 낸 신문 광고 하나", "새로 들인 하인 두 사람", "잊혀 있던 옛날 지하 통로"], answer: 2 },
    { q: "뤼팽이 재판에서 다른 사람 행세를 할 수 있었던 까닭은 무엇입니까?", choices: ["닮은 사람을 미리 구해 두어서", "간수 하나를 돈으로 사서", "한 달을 굶어 몸 치수를 바꿔서"], answer: 2 },
    { q: "가니마르가 법정에서 한 말은 무엇입니까?", choices: ["다시 조사하겠다", "모르겠다", "저 사람이 맞다"], answer: 1 },
    { q: "기차 안에서 뤼팽이 한 일은 무엇입니까?", choices: ["경찰에게 제 이름을 대고 내렸다", "옆자리 신사의 지갑을 가져갔다", "진짜 범인을 묶어 짐칸에 넣었다"], answer: 2 },
    { q: "하트 일곱 카드에 뚫린 구멍이 가리킨 것은 무엇입니까?", choices: ["그 집에 숨은 사람의 이름", "벽 무늬에서 눌러야 할 자리", "금고 문을 여는 숫자 일곱 개"], answer: 1 },
    { q: "뤼팽이 잠수함 설계도를 가져가지 않은 까닭은 무엇입니까?", choices: ["그것으로 배를 만들면 사람이 많이 죽어서", "이미 다른 나라에 팔린 뒤였기 때문에", "설계도가 가짜라는 것을 알아채서"], answer: 0 },
    { q: "검은 진주를 침대 밑에서 찾은 사람은 누구입니까?", choices: ["그 집에서 일하던 하녀 하나", "나중에 그 방에 들어간 다니그레", "제일 먼저 달려온 가니마르"], answer: 1 },
    { q: "뤼팽이 신문에 편지를 실은 까닭은 무엇입니까?", choices: ["다니그레가 안 한 일까지 쓰지 않게", "자기가 한 일임을 자랑하고 싶어서", "가니마르에게 다음 일을 예고하려고"], answer: 0 },
    { q: "왕비의 목걸이를 가져간 사람은 누구입니까?", choices: ["그때 여섯 살이던 라울", "손님으로 왔던 백작 하나", "그 집에서 일하던 어머니"], answer: 0 },
    { q: "여섯 살 아이가 그 방에 들어간 길은 어디입니까?", choices: ["이층으로 이어진 창틀", "사람이 못 지나는 좁은 굴뚝", "잠기지 않은 뒤쪽 쪽문"], answer: 1 },
    { q: "뤼팽이 그 목걸이를 스무 해 동안 팔지 않은 까닭은 무엇입니까?", choices: ["너무 알려진 물건이라 팔 수가 없어서", "값이 더 오를 때를 기다리고 있어서", "팔면 어머니가 정말 도둑의 어머니가 되어서"], answer: 2 },
    { q: "숄메스라는 이름이 쓰인 까닭은 무엇입니까?", choices: ["셜록 홈스를 만든 작가가 항의해서 비튼 것", "프랑스에서는 그 이름이 읽기 어려워서", "다른 사람이라는 것을 밝히고 싶어서"], answer: 0 },
    { q: "숄메스가 마지막에 윌슨에게 한 말은 무엇입니까?", choices: ["다시는 프랑스 땅을 밟지 않을 것이다", "세상은 우리가 배운 것보다 조금 더 복잡하다", "저런 자는 언젠가 반드시 제 손에 잡힌다"], answer: 1 },
    { q: "이 책을 읽고 난 반응으로 알맞지 않은 것은 무엇인가요?", wide: true, choices: ["배 안에 뤼팽이 탔다는 전보 하나에 사람들이 서로를 의심한 것을 보면, 이름 하나가 배 한 척을 흔들어 놓았네.", "뤼팽이 감옥에서 가니마르에게 저는 여기 있었다고 한 것을 보면, 성의 도둑질은 뤼팽과 상관없는 일이었어.", "뤼팽이 가난한 집 것은 건드리지 않은 것을 보면, 훔치는 데도 제 나름의 금이 있었구나.", "어머니가 목걸이를 스무 해 동안 팔지 않은 것을 보면, 팔면 정말로 도둑의 어머니가 되는 거였지."], answer: 1 }
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
