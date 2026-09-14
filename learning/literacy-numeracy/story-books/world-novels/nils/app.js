const BOOK_TITLE = "닐스의 이상한 여행";

const CHAPTER_LABEL = n => `${n}장 ·`;

const CHAPTERS = [
    {
        num: 1,
        title: "작아진 아이",
        emoji: "🧝",
        art: ["story-01-a.webp", "story-01-b.webp"],
        paras: [
            `스웨덴 남쪽 끝에 스코네라는 지방이 있습니다. 밭이 넓고 바다가 가까운 곳입니다. 바람이 늘 바다 쪽에서 불어옵니다. 그 지방의 어느 농가에 닐스라는 아이가 살았습니다.`,
            `스코네는 스웨덴에서 제일 남쪽입니다. 그래서 눈이 늦게 오고 일찍 녹습니다. 봄이면 북쪽으로 올라가는 새들이 그 위를 지나갑니다. 그 소리에 사람들이 봄이 온 것을 압니다. 밭에서 일하다가 고개를 듭니다. 해마다 같은 무렵에 같은 길로 지나갑니다.`,
            `닐스는 열네 살이었습니다. 그 집은 넉넉하지 않았습니다. 아버지와 어머니는 새벽부터 밭에 나갔습니다. 그래서 닐스에게 잔소리할 틈도 별로 없었습니다. 저녁에야 얼굴을 보았습니다. 저녁을 먹고 나면 아버지는 곧 잠자리에 들었습니다. 새벽에 또 나가야 했기 때문입니다.`,
            `닐스는 마을에서 손꼽히게 못된 아이였습니다. 일을 시키면 도망쳤고, 책을 펴면 잤습니다. 심부름을 보내면 반나절씩 걸렸습니다. 그리고 짐승을 괴롭혔습니다.`,
            `고양이 꼬리를 밟고, 거위를 쫓아 몰고, 새 둥지를 헐었습니다. 알을 꺼내 던지기도 했습니다. 어미 새가 소리를 지르며 따라다녔습니다. 닐스는 그것을 재미있어했습니다. 그 집 짐승들은 다 닐스를 무서워했습니다.`,
            `삼월 어느 일요일 아침이었습니다.`,
            `부모가 교회에 가면서 닐스에게 말했습니다.<br>"오늘은 성경을 열 쪽만 읽어라."<br>"네."`,
            `어머니가 책장을 펴서 표를 끼워 놓고 갔습니다. 여기서 여기까지라고 손가락으로 짚어 주었습니다. 돌아와서 물어보겠다고도 했습니다. 닐스는 알겠다고 대답만 했습니다.`,
            `두 사람이 나가자 닐스는 곧 책상에 엎드렸습니다. 그리고 졸았습니다.`,
            `창밖에서 볕이 들어왔습니다. 밖에서는 참새가 울고 있었습니다. 파리 한 마리가 유리창에 부딪히는 소리가 났습니다. 몇 번이고 같은 자리에 부딪쳤습니다. 나가는 길이 바로 옆에 열려 있는데도 그랬습니다.`,
            `닐스는 그 소리를 들으며 반쯤 잠이 들었습니다. 열 쪽은커녕 한 줄도 읽지 않았습니다.`,
            `그때 방 안에서 무언가 움직이는 소리가 났습니다. 닐스가 고개를 들어 보니, 어머니의 옷장 뚜껑이 열려 있었습니다. 그리고 그 안에서 아주 작은 사람이 무언가를 뒤지고 있었습니다.`,
            `손바닥만 한 사람이었습니다. 수염이 있고, 챙 넓은 모자를 쓰고, 무릎 아래를 여민 바지를 입고 있었습니다. 신발에 쇠붙이가 달려 있었습니다. 옷차림이 아주 옛날 사람 같았습니다. 그림책에서 본 것과 똑같았습니다. 스웨덴 시골에서 톰테라고 부르는 것이었습니다. 집을 지켜 준다는 작은 도깨비입니다.`,
            `스웨덴 시골집에서는 톰테에게 겨울마다 죽을 한 그릇 내놓는 풍습이 있었습니다. 그렇게 하면 집안이 무사하다고 여겼습니다. 닐스네 집에서도 겨울마다 그렇게 했습니다. 다만 닐스는 그것을 우습게 여겼습니다.`,
            `닐스는 벽에 걸린 잠자리채를 내려 들었습니다. 그리고 그것을 덮어씌워 잡았습니다.`,
            `톰테가 말했습니다.<br>"놓아 다오. 놓아 주면 은동전 하나를 주마."`,
            `닐스는 그 말을 듣고 욕심이 났습니다. 은동전 하나면 마을 가게에서 살 것이 여럿 있었습니다. 사탕도 사고 칼도 살 수 있었습니다. 마을 아이들에게 자랑할 수도 있었습니다. 닐스는 그 생각부터 했습니다. 톰테를 잡으면 소원을 들어준다는 이야기를 닐스도 들은 적이 있었습니다.`,
            `"동전 하나로는 안 돼요."<br>"그럼 무엇을 원하느냐."<br>"금동전 두 개하고, 은수저하고, 저 옷장 안에 있는 것 다요."`,
            `톰테는 잠깐 아무 말도 하지 않았습니다.`,
            `그러고는 이렇게 말했습니다.<br>"너는 참 못된 아이로구나."`,
            `닐스가 잠자리채를 흔들었습니다. 그때 톰테가 빠져나왔습니다. 어디서 나왔는지도 몰랐습니다. 그물코 하나가 벌어져 있었던 모양입니다. 닐스가 그물을 흔든 탓이었습니다.`,
            `톰테가 닐스의 뺨을 한 대 쳤습니다. 아주 작은 손이었는데 눈앞이 캄캄해졌습니다. 닐스는 그 자리에 쓰러졌습니다.`,
            `얼마나 그렇게 있었는지 알 수 없었습니다.`
        ]
    },
    {
        num: 2,
        title: "거위 등에 오르다",
        emoji: "🪿",
        art: ["story-02-a.webp", "story-02-b.webp"],
        paras: [
            `닐스가 눈을 떴을 때 방이 아주 이상했습니다. 천장이 까마득히 높았습니다. 고개를 젖혀야 끝이 보였습니다. 의자가 산처럼 컸습니다. 다리 하나가 나무 기둥만 했습니다. 올려다보아도 앉는 자리가 보이지 않았습니다.`,
            `책상 위의 성경책이 벽처럼 서 있었습니다. 글자 하나가 손바닥만 했습니다. 펜 하나가 통나무만 했습니다. 잉크병은 물통 같았습니다. 성경책 표를 끼워 둔 자리가 저 위에 있었습니다. 이제는 올라갈 수도 없었습니다.`,
            `닐스는 거울 앞으로 갔습니다. 거울 앞까지 가는 데도 한참이 걸렸습니다. 마룻바닥의 틈이 도랑처럼 넓었습니다. 건너뛰어야 하는 자리도 있었습니다. 발을 헛디디면 그 안으로 빠질 것 같았습니다. 닐스는 가장자리를 짚고 건넜습니다.`,
            `그리고 그 안을 보았습니다. 자기가 톰테만큼 작아져 있었습니다. 닐스는 소리를 질렀습니다. 소리도 아주 작게 나왔습니다.`,
            `그런데 그때 이상한 일이 하나 더 있었습니다. 밖에서 참새들이 하는 말이 들렸습니다. 짹짹거리는 소리가 아니라 말이었습니다.`,
            `"저것 봐! 저 못된 애가 저렇게 됐어!"<br>"쌤통이다!"`,
            `짐승의 말이 다 들렸습니다. 그동안 닐스가 짐승들에게 한 일을 짐승들은 하나도 잊지 않고 있었습니다. 그리고 그것을 그날 다 말했습니다. 한 마리도 빠지지 않고 말했습니다. 언제 어디서 무엇을 했는지까지 말했습니다. 닐스는 그것을 다 듣고 서 있었습니다.`,
            `닐스는 마당으로 나갔습니다. 고양이가 앞을 막았습니다. 닐스는 늘 하던 대로 발로 차려고 했습니다. 발이 닿지도 않았습니다. 그런데 이제 그 고양이가 닐스보다 훨씬 컸습니다. 눈이 접시만 했습니다.`,
            `고양이가 앞발로 닐스를 눌렀습니다.`,
            `그리고 이렇게 말했습니다.<br>"이제 내가 원하면 언제든 너를 혼내 줄 수 있겠구나."`,
            `그러고는 놓아 주었습니다. 닐스는 그때 처음으로 무섭다는 것이 어떤 것인지 알았습니다. 다리가 풀려서 한참 앉아 있었습니다. 여태 무섭게 하는 쪽이었습니다.`,
            `거위 우리 앞을 지나는데 거위들이 소리쳤습니다.<br>"저 애가 우리를 얼마나 괴롭혔는데!"`,
            `목을 빼고 부리를 딱딱 부딪쳤습니다. 우리 안이 온통 시끄러웠습니다. 닐스는 담 밑으로 붙어 지나갔습니다. 거위들이 그 뒤까지 따라오며 소리쳤습니다. 우리 안에 갇혀 있어서 나오지는 못했습니다. 나올 수 있었으면 어떻게 되었을지 모릅니다.`,
            `그때 하늘에서 소리가 났습니다. 기러기 떼였습니다. 북쪽으로 올라가는 길이었습니다.`,
            `기러기는 봄이면 남쪽에서 북쪽으로 올라갑니다. 스코네 위를 지나가는 것은 삼월입니다.`,
            `기러기들이 아래를 내려다보며 소리쳤습니다.<br>"올라와라! 우리와 함께 라플란드로 가자!"`,
            `그 집 거위들은 다 우리 안에서 목만 뺐습니다. 그런데 하얀 수거위 한 마리가 날개를 폈습니다. 이름은 모르텐이었습니다.`,
            `모르텐은 집거위였습니다. 그 집 거위 가운데 제일 컸고 제일 힘이 셌습니다. 집거위는 오래 날지 못합니다. 살이 쪄서 그렇습니다. 사람이 날지 못하게 길러 온 것이기도 합니다. 여러 대에 걸쳐 그렇게 되었습니다.`,
            `그래서 모르텐도 한 번도 담장 너머로 날아 본 적이 없었습니다. 그런데 늘 날고 싶어 했습니다.`,
            `모르텐이 날개를 치며 뛰었습니다. 그리고 공중으로 떠올랐습니다. 닐스는 그것을 보고 뛰어가 그 목을 붙잡았습니다.`,
            `말리려고 한 것이었습니다. 거위가 날아가면 아버지에게 크게 야단맞을 것이었습니다. 그 집에서 제일 값이 나가는 거위였습니다. 가을에 팔면 겨울 살림이 되는 거위였습니다. 닐스도 그것을 알고 있었습니다.`,
            `"안 돼! 내려와!"`,
            `그런데 모르텐은 이미 올라가고 있었습니다. 닐스는 그 목에 매달린 채 하늘로 올라갔습니다. 손을 놓으면 떨어질 높이였습니다. 아래로 자기 집이 점점 작아졌습니다.`,
            `밭과 길이 줄처럼 보였습니다. 사람은 점만 했습니다. 교회 지붕이 성냥갑 같았습니다. 어디가 어디인지 알아보기 어려웠습니다. 닐스는 그때까지 자기 마을이 그렇게 생겼는지 몰랐습니다.`
        ]
    },
    {
        num: 3,
        title: "아카",
        emoji: "🕊️",
        art: ["story-03-a.webp", "story-03-b.webp"],
        paras: [
            `기러기 떼의 우두머리는 아주 늙은 암컷이었습니다. 이름은 케브네카이세의 아카였습니다. 케브네카이세는 스웨덴에서 제일 높은 산 이름입니다. 라플란드에 있는 산입니다. 스웨덴 북쪽 끝의 눈 덮인 산입니다. 여름에도 꼭대기에 눈이 있습니다.`,
            `기러기는 무리에서 제일 늙고 길을 잘 아는 것이 앞에 섭니다. 길을 잘못 들면 무리가 다 굶습니다. 그러니 아는 것이 힘보다 중합니다.`,
            `아카는 그 산에서 태어났고, 백 살이 넘었다고 했습니다. 그해에도 아카가 무리를 이끌고 북쪽으로 가는 길이었습니다.`,
            `목에 흰 줄이 있었고, 날개 끝이 닳아 있었습니다. 몸도 다른 기러기보다 작았습니다. 그런데 나는 것은 어느 젊은 기러기보다 나았습니다. 바람을 타는 법을 알았기 때문입니다.`,
            `저녁이 되자 무리가 호수에 내려앉았습니다.`,
            `기러기는 밤에 물 위에서 잡니다. 뭍에서 자면 여우에게 물리기 때문입니다. 얼음 위에서도 물가에서 멀찍이 떨어져 잡니다. 삼월에는 아직 호수에 얼음이 남아 있었습니다. 가운데만 녹아 있었습니다. 그 가장자리에서 자면 여우가 걸어 들어올 수 있었습니다.`,
            `아카가 모르텐 앞에 왔습니다.<br>"너는 집거위구나."<br>"그렇습니다."<br>"집거위는 우리를 따라올 수 없다. 라플란드까지는 아주 멀다."<br>"저는 갈 수 있습니다."<br>"그리고 저 아이는 무엇이냐."`,
            `아카가 닐스를 보았습니다.`,
            `"사람 아니냐. 사람은 안 된다."`,
            `모르텐이 말했습니다.<br>"이 아이는 이제 사람이 아닙니다. 사람들도 이 아이를 못 알아봅니다."`,
            `아카는 한참 닐스를 보았습니다.`,
            `그러고는 이렇게 말했습니다.<br>"내일 아침까지 따라와 봐라. 못 따라오면 두고 간다."`,
            `그날 밤 여우가 하나 그 호숫가에 왔습니다. 스미레라는 여우였습니다. 여우는 물가에서 자는 기러기를 노렸습니다.`,
            `여우는 겨울을 나느라 몹시 말라 있었습니다. 갈비뼈가 드러나 있었습니다. 봄에 올라오는 기러기 떼는 여우에게 오랜만의 먹이였습니다. 겨울 내내 들쥐 몇 마리로 버틴 참이었습니다. 그러니 놓칠 수 없었습니다.`,
            `기러기들은 물 한가운데 얼음 위에서 잤습니다. 여우가 얼음 위로 살금살금 갔습니다.`,
            `닐스는 그때 얼음 가장자리에 앉아 있었습니다. 잠이 오지 않았기 때문입니다. 그래서 그것을 보았습니다. 닐스는 소리를 질렀습니다.`,
            `"아카! 여우예요!"`,
            `기러기들이 다 날아올랐습니다. 그런데 여우가 마지막에 뒤처진 한 마리를 물었습니다.`,
            `닐스는 그것을 보고 달려갔습니다. 그리고 여우 꼬리를 붙잡았습니다. 여우가 놀라 펄쩍 뛰었습니다.`,
            `닐스는 그 꼬리털을 두 팔로 껴안고 매달렸습니다. 여우가 뛰는 대로 얼음 위를 끌려다녔습니다. 얼음에 몸이 쓸려 옷이 다 젖었습니다. 그래도 손을 놓지 않았습니다. 여우가 닐스를 떨어내려고 입을 벌리고 몸을 흔들었습니다. 그 틈에 기러기가 빠져나갔습니다. 닐스는 얼음 위로 내동댕이쳐졌습니다.`,
            `여우는 그 뒤로 닐스를 미워했습니다. 그리고 그해 내내 그 무리를 쫓아다녔습니다. 쫓겨나고 나서도 그랬습니다. 그 여우에게는 그것 말고 할 일이 없어졌기 때문입니다.`,
            `이튿날 아침, 아카가 닐스에게 말했습니다.<br>"너를 데려가겠다."<br>"왜요?"<br>"어젯밤 일 때문이다."`,
            `그리고 이렇게 덧붙였습니다.<br>"그런데 하나 알아 두어라. 우리는 너를 태워 주는 것이 아니라 함께 가는 것이다."`,
            `닐스는 그 말이 무슨 뜻인지 그때는 몰랐습니다. 여덟 달 뒤에 알게 되었습니다. 태워 주는 쪽은 짐이고 함께 가는 쪽은 한 식구입니다.`
        ]
    },
    {
        num: 4,
        title: "글리밍겐 성의 황새",
        emoji: "🏰",
        art: ["story-04-a.webp", "story-04-b.webp"],
        paras: [
            `스코네에 글리밍겐이라는 오래된 돌집이 있었습니다. 벽이 아주 두꺼운 성이었습니다. 멀리서 보면 네모난 돌덩이 같았습니다. 그 지붕에 황새 부부가 둥지를 틀고 살았습니다.`,
            `오백 년쯤 전에 지은 것이었습니다. 창이 작고 벽이 두꺼웠습니다. 싸움이 잦던 시절에 지은 집은 다 그렇게 생겼습니다. 들어가는 문도 하나뿐이었습니다. 그 문을 막으면 아무도 못 들어왔습니다.`,
            `벽 두께가 사람 키만 했습니다. 창은 활을 쏘려고 낸 좁은 틈이었습니다. 안에서는 밖이 보이고 밖에서는 안이 안 보였습니다. 그래서 볕이 거의 들지 않았습니다.`,
            `수컷 황새의 이름은 에르멘리히였습니다. 어느 날 에르멘리히가 아카를 찾아왔습니다.`,
            `황새는 다리가 붉고 아주 깁니다. 날아올 때 그 다리를 뒤로 곧게 뻗고 옵니다. 목도 앞으로 길게 뺍니다. 그러면 몸이 화살처럼 곧아집니다. 멀리 나는 새는 대개 그렇게 납니다.`,
            `"큰일 났습니다. 쥐들이 몰려옵니다."`,
            `에르멘리히는 날개를 접지도 못하고 서 있었습니다. 아주 먼 데서 곧장 날아온 참이었습니다. 숨이 차서 말이 끊겼습니다. 아카가 물을 좀 마시라고 했습니다.`,
            `사람이 떠난 집에는 쥐가 듭니다. 그리고 쥐가 들면 그 집은 더 빨리 무너집니다. 기둥 밑을 파기 때문입니다.`,
            `그 성 지하에는 오래전부터 쥐가 살고 있었습니다. 검은 쥐라고 불렀습니다.`,
            `그런데 나중에 다른 쥐들이 왔습니다. 회색 쥐라고 불리는 것들이었습니다. 수가 훨씬 많았습니다. 몸집도 더 컸습니다. 먹는 것도 가리지 않았습니다. 검은 쥐가 당할 수 있는 상대가 아니었습니다. 그 회색 쥐들이 그 성을 통째로 빼앗으려고 몰려오고 있었습니다.`,
            `아카가 물었습니다.<br>"그 성에는 사람이 없느냐?"<br>"없습니다. 오래전에 비었습니다."`,
            `아카가 말했습니다.<br>"우리는 도울 수 없다. 우리에게는 이빨도 발톱도 없다."`,
            `그때 닐스가 말했습니다.<br>"저한테 방법이 있을지도 몰라요."`,
            `닐스는 에르멘리히의 등에 올라 글리밍겐 성으로 갔습니다. 그 성 지하는 캄캄했습니다. 닐스는 벽을 짚어 가며 걸었습니다. 발밑에서 무언가 바스락거렸습니다. 마른 짚과 부서진 나무였습니다. 그 위를 밟으면 소리가 크게 났습니다.`,
            `그러다 무언가를 찾았습니다. 피리였습니다. 아주 오래된 나무 피리였습니다.`,
            `닐스는 그것을 불었습니다. 제대로 부는 법도 몰랐습니다. 숨을 넣으니 그냥 소리가 났습니다. 높지도 낮지도 않은 소리였습니다. 닐스에게는 아무렇지도 않은 소리로 들렸습니다.`,
            `그런데 소리가 나자 여기저기서 발톱 긁는 소리가 났습니다. 쥐들이 그 소리를 따라오기 시작했습니다. 회색 쥐들이 다 나왔습니다.`,
            `닐스는 피리를 불며 걸었습니다. 성 밖으로, 들판을 가로질러, 호수 쪽으로. 한 번도 멈추지 않았습니다. 멈추면 소리가 끊기고, 소리가 끊기면 쥐들이 흩어질 것이었습니다. 그것을 닐스도 알고 있었습니다. 쥐들이 다 따라왔습니다.`,
            `한번 뒤를 돌아보았습니다. 들판이 다 움직이는 것처럼 보였습니다. 그리고 닐스는 그 쥐들을 아주 먼 데까지 데려갔습니다.`,
            `독일에는 오래전부터 '하멜른의 피리 부는 사나이' 이야기가 전해 옵니다. 피리를 불어 마을의 쥐를 모조리 데려간 사람 이야기입니다. 닐스가 한 일이 꼭 그것이었습니다.`,
            `다만 하멜른의 피리 부는 사나이는 값을 못 받자 아이들까지 데려갔습니다. 닐스는 아무 값도 받지 않았습니다. 같은 피리로 한 사람은 앙갚음을 했고, 한 사람은 그러지 않았습니다. 손에 든 것이 같아도 쓰는 사람이 다르면 다른 것이 됩니다.`,
            `황새 에르멘리히가 물었습니다.<br>"무엇을 드리면 되겠습니까."<br>닐스가 말했습니다.<br>"제가 언제 다시 사람이 되는지 아세요?"<br>"모릅니다."<br>"그럼 됐습니다."`,
            `황새는 한참 닐스를 내려다보았습니다. 그리고 아무 말도 하지 못했습니다. 닐스가 바란 것은 그것 하나뿐이었기 때문입니다.`
        ]
    },
    {
        num: 5,
        title: "학들의 춤",
        emoji: "🦩",
        art: ["story-05-a.webp", "story-05-b.webp"],
        paras: [
            `해마다 봄이면 쿨라베리라는 산에서 큰 모임이 열렸습니다. 짐승들의 모임이었습니다. 날짜가 정해져 있지는 않았습니다. 그런데 그날이 되면 짐승들이 다 알았습니다. 그날이 되면 아침부터 짐승들이 한 방향으로 움직였습니다. 마을 사람들은 그것을 알아채지 못했습니다.`,
            `까마귀가 먼저 알고 소문을 냈다고도 하고, 바람 냄새로 안다고도 했습니다.`,
            `쿨라베리는 스코네의 바닷가에 있는 낮은 산입니다. 사람이 잘 올라가지 않는 곳이었습니다. 길도 제대로 나 있지 않았습니다.`,
            `바위가 많고 길이 험해서 밭으로도 못 쓰고 목장으로도 못 쓰는 산이었습니다. 그래서 짐승들에게 남겨진 것입니다. 쓸모없다고 버려 둔 자리에 다른 것이 자리를 잡습니다.`,
            `그날 하루만은 서로 잡아먹지 않기로 되어 있었습니다. 사슴과 늑대가 같은 자리에 있어도 아무 일이 없었습니다. 그런 규칙이 아주 오래전부터 있었습니다. 여우가 토끼 옆에 앉아 있었고, 매가 참새 옆 가지에 앉아 있었습니다.`,
            `토끼는 그래도 귀를 뒤로 눕히고 있었습니다. 참새는 가지 끝에 앉아 있었습니다. 언제든 날 수 있는 자리였습니다. 규칙을 믿으면서도 몸은 그렇지 않았습니다. 여러 대에 걸쳐 몸에 밴 것이었습니다.`,
            `그 규칙을 누가 정했는지는 아무도 몰랐습니다. 다만 다들 지켰습니다. 지키지 않으면 어떻게 되는지도 다들 알고 있었습니다. 그날 규칙을 어긴 짐승 이야기가 오래 전해졌습니다. 어미가 새끼에게 그 이야기를 해 주었습니다. 그래서 그 규칙이 지켜진 것입니다.`,
            `기러기 무리도 그리로 갔습니다. 닐스는 모르텐의 등에 앉아 그것을 보았습니다. 내려다보니 풀밭 끝이 보이지 않았습니다. 산기슭 넓은 풀밭에 짐승이 가득했습니다.`,
            `멀리서 보면 풀밭이 얼룩덜룩했습니다. 가까이 가 보니 그것이 다 짐승이었습니다. 발 디딜 자리가 없었습니다. 짐승마다 자기 자리가 있었습니다. 누가 정해 준 것도 아닌데 그렇게 앉았습니다.`,
            `까마귀와 갈까마귀가 하늘을 덮었고, 사슴과 노루가 줄지어 서 있었습니다.`,
            `그리고 놀이가 시작되었습니다. 먼저 산토끼들이 나와 달음질을 했습니다.`,
            `토끼들이 풀밭을 가로질러 뛰었습니다. 뒤로 뛰기도 하고 옆으로 튀기도 했습니다. 흙먼지가 뽀얗게 일었습니다. 보고 있던 짐승들이 발을 굴렀습니다.`,
            `제일 빠른 토끼가 마지막에 한 번 더 돌았습니다. 그러고는 풀밭 가장자리로 들어갔습니다. 짐승들이 오래 발을 굴렀습니다. 땅이 울렸습니다. 토끼는 그 소리를 듣고 한 번 더 뛰었습니다.`,
            `그다음에 뇌조들이 나와 노래를 불렀습니다. 뇌조는 봄이면 목을 부풀리고 낮게 우는 새입니다. 그 소리가 숲 안에서 아주 멀리까지 갑니다. 그래서 봄이면 그 소리로 숲이 찹니다.`,
            `그다음에 사슴들이 뿔을 맞대고 겨루었습니다.`,
            `마지막에 학들이 나왔습니다. 학들이 춤을 추었습니다. 풀밭 한가운데에서 회색 새들이 목을 세우고, 날개를 반쯤 펴고, 뛰어올랐다가 내려앉았습니다. 아무도 소리를 내지 않았습니다.`,
            `발끝으로 돌고, 서로 마주 보고 절을 하고, 다시 뛰어올랐습니다. 여러 마리가 한꺼번에 같은 자리에서 돌았습니다. 그림자가 풀밭 위에서 함께 움직였습니다. 해가 지고 있어서 그림자가 아주 길었습니다. 풀밭 끝까지 그림자가 닿았습니다. 그림자가 새보다 크게 움직였습니다. 보고 있으면 새가 둘씩인 것 같았습니다.`,
            `모여 있던 짐승들이 다 조용해졌습니다. 까마귀도 울지 않았습니다.`,
            `학은 사람이 보는 데서는 잘 추지 않습니다. 그래서 그것을 본 사람이 드뭅니다.`,
            `닐스는 그것을 본 몇 안 되는 사람 가운데 하나였습니다. 그때는 사람이 아니었지만요. 닐스는 그것을 보다가 목이 메었습니다. 눈을 뗄 수가 없었습니다. 왜 그런지 몰랐습니다.`,
            `그때까지 닐스가 아름답다고 느껴 본 것은 아무것도 없었습니다.`,
            `그런데 그날 그 모임에서 사고가 하나 났습니다. 여우 스미레가 규칙을 어긴 것입니다. 기러기를 하나 물어 갔습니다.`,
            `짐승들이 스미레를 붙잡았습니다. 그리고 벌을 내렸습니다.`,
            `늙은 짐승들이 앞에 나와 앉았습니다. 스미레는 그 앞에 끌려 나왔습니다. 스미레는 아무 변명도 하지 않았습니다. 고개를 들지도 않았습니다. 입가에 아직 깃털이 붙어 있었습니다.`,
            `벌은 이랬습니다. 스미레는 그날부터 그 지방에서 쫓겨났습니다. 그리고 어느 짐승도 그와 말을 섞지 않기로 했습니다. 이름을 부르는 것도 하지 않기로 했습니다.`,
            `죽이지는 않았습니다. 짐승들의 규칙에는 죽이는 벌이 없었습니다. 쫓아내는 것이 제일 무거운 벌이었습니다. 혼자 남으면 겨울을 못 넘기기 때문입니다. 스미레는 혼자 산을 내려갔습니다.`,
            `닐스는 그것을 보면서 이상한 마음이 들었습니다. 그 여우는 자기를 여러 번 죽이려고 한 짐승이었습니다. 그런데 그 뒷모습을 보고 있으니 마음이 편치 않았습니다.`,
            `스미레는 한 번도 뒤를 돌아보지 않았습니다. 그것이 더 보기 어려웠습니다.`,
            `자기도 그 여우와 다르지 않았다는 것을 그때 생각한 것입니다. 얼마 전까지만 해도 닐스는 그 마을에서 쫓겨나도 할 말이 없는 아이였습니다.`,
            `그리고 실제로 쫓겨난 것이나 마찬가지였습니다. 그 집에서 닐스를 알아보는 것은 아무도 없었으니까요. 돌아가도 들어갈 데가 없었습니다.`
        ]
    },
    {
        num: 6,
        title: "비네타",
        emoji: "🌊",
        art: ["story-06-a.webp", "story-06-b.webp"],
        paras: [
            `무리는 북쪽으로 올라가면서 여러 곳을 지났습니다.`,
            `닐스가 지나가는 곳은 다 실제로 있는 곳입니다. 지금도 스웨덴에 가면 그 자리에 그대로 있습니다.`,
            `그 가운데 이런 곳이 있었습니다. 발트해는 스웨덴 동쪽 바다입니다. 그 안에 섬이 아주 많습니다. 작은 것까지 세면 수천 개가 됩니다. 섬 사이로 배가 다녔습니다. 그래서 그 바다에 항구가 많았습니다. 그 가운데 오래전에 큰 항구 도시가 바닷속으로 가라앉았다는 곳이 있었습니다.`,
            `그 섬에 낡은 성터가 있었습니다. 사람이 살지 않는 곳이었습니다. 돌담이 무너져 있었고 그 사이에 풀이 자라 있었습니다. 바닥에 깔린 돌만 그대로였습니다. 갈매기만 그 위에 앉아 있었습니다. 파도가 돌담 밑까지 들어왔습니다. 사람이 살던 자리라는 것을 알아보기 어려웠습니다.`,
            `닐스는 어느 밤 그 섬에 내렸습니다. 그리고 이상한 것을 보았습니다.`,
            `밤중에 그 성터에 도시가 나타난 것입니다. 사람들이 걸어 다니고, 가게에 물건이 쌓여 있고, 항구에 배가 들어와 있었습니다. 아주 오래전 옷을 입은 사람들이었습니다. 모자와 신발까지 옛날 것이었습니다. 말투도 지금 쓰는 말과 달랐습니다. 그런데 닐스에게는 다 알아들렸습니다.`,
            `닐스는 어느 가게로 들어갔습니다. 가게 안이 환했습니다. 사람들 목소리가 들렸습니다. 그런데 아무도 닐스를 이상하게 여기지 않았습니다.`,
            `상인이 물건을 보여 주었습니다.`,
            `"이걸 사시오. 값은 동전 하나면 되오."`,
            `닐스는 주머니를 뒤졌습니다. 주머니에는 실밥과 마른 풀잎밖에 없었습니다. 작아진 뒤로 돈을 가져 본 적이 없었습니다. 쓸 데가 없었기 때문입니다.`,
            `상인이 다른 가게로 데려갔습니다. 거기서도 값은 동전 하나였습니다. 그 도시 사람들이 다 몰려나와 닐스를 둘러쌌습니다. 다들 무언가를 팔려고 했습니다.`,
            `금잔, 비단, 가죽 신, 유리 목걸이. 사람들이 그것을 닐스 앞에 내밀었습니다. 어떤 사람은 무릎을 꿇고 매달렸습니다. 옷자락을 붙잡는 사람도 있었습니다. 닐스는 그 까닭을 그때 몰랐습니다. 물건을 팔려는 얼굴이 아니었습니다. 살려 달라는 얼굴이었습니다.`,
            `값은 다 동전 하나였습니다. 닐스는 그 동전이 없었습니다.`,
            `그러자 새벽닭이 울었습니다. 그리고 도시가 사라졌습니다.`,
            `불빛이 꺼지고, 사람이 사라지고, 배가 사라졌습니다. 소리가 한꺼번에 그쳤습니다. 바람 소리만 남았습니다. 발밑에 있던 돌바닥만 그대로였습니다. 거기 서 있던 자리가 풀밭이 되어 있었습니다. 닐스는 빈 성터에 혼자 서 있었습니다.`,
            `나중에 닐스가 아카에게 그 이야기를 했습니다.`,
            `아카가 말했습니다.<br>"그 도시는 비네타라고 한다. 오래전에 바닷속으로 가라앉은 도시다. 백 년에 한 번 그 도시가 나타난다고 한다. 그리고 그 밤에 누가 그 도시에서 물건을 하나라도 사면, 그 도시가 다시 살아난다고 한다."`,
            `닐스는 그 자리에 주저앉았습니다.`,
            `"제가 동전이 없어서······."<br>"그래."`,
            `그날 닐스는 밤새 울었습니다. 자기 때문이 아니라 그 도시 사람들 때문이었습니다. 닐스가 그런 마음을 낸 것은 그때가 처음이었습니다. 집을 떠날 때였다면 그냥 잊었을 일이었습니다. 그때의 닐스는 남이 잃은 것을 헤아려 본 적이 없었습니다. 떠난 지 얼마 되지 않았는데 그렇게 달라져 있었습니다.`
        ]
    },
    {
        num: 7,
        title: "곰의 굴",
        emoji: "🐻",
        art: ["story-07-a.webp", "story-07-b.webp"],
        paras: [
            `무리가 더 북쪽으로 올라갔습니다. 그 지방에는 광산이 있었습니다. 쇠를 캐는 광산이었습니다. 굴뚝에서 밤낮으로 연기가 올랐습니다.`,
            `스웨덴 가운데쯤에 베리슬라겐이라는 지방이 있습니다. 그 지방 땅속에 쇠가 많이 묻혀 있어서, 오래전부터 그것을 캐고 녹여 왔습니다. 스웨덴의 쇠는 질이 좋기로 이름났습니다. 그 쇠를 팔아 다른 나라 물건을 사 왔습니다.`,
            `어느 날 닐스가 무리에서 떨어졌습니다. 바람이 세게 불어 모르텐의 등에서 미끄러진 것입니다. 붙잡을 새도 없었습니다.`,
            `기러기는 바람이 세면 줄을 흩뜨렸다가 다시 모읍니다. 그날은 다시 모였을 때 닐스가 없었습니다. 모르텐이 되돌아가려고 했습니다. 그런데 바람이 세서 돌 수가 없었습니다.`,
            `닐스는 숲에 떨어졌습니다. 그리고 밤이 되었습니다. 나뭇가지에 걸려서 다치지는 않았습니다. 떨어지면서 몇 번이나 부딪혔습니다. 그래도 몸이 가벼워서 살았습니다.`,
            `추워서 굴을 찾다가 어느 굴로 들어갔습니다. 안이 따뜻했습니다. 그런데 그 굴이 곰의 굴이었습니다.`,
            `어미 곰이 새끼 둘과 함께 자고 있었습니다. 새끼들이 먼저 닐스를 찾아냈습니다. 그리고 장난감처럼 굴리며 놀았습니다. 서로 뺏으려고 다투었습니다. 그런데 그 앞발 한 번이면 뼈가 부러질 참이었습니다.`,
            `앞발로 밀었다가 물었다가 했습니다. 닐스는 소리를 내지 않으려고 이를 악물었습니다.`,
            `곰은 겨울잠에서 깨고 나면 몹시 배가 고픕니다. 그리고 새끼가 있으면 더 사나워집니다. 새끼를 지키느라 그렇습니다. 그럴 때는 사람도 피해야 합니다.`,
            `어미 곰이 깼습니다. 그리고 닐스를 앞발로 눌렀습니다.`,
            `"사람 냄새가 나는구나."<br>"저는 사람이 아니에요."<br>"사람 냄새가 난다."`,
            `그때 밖에서 소리가 났습니다. 사람 목소리와 쇠붙이 소리였습니다. 광산 사람들이 다이너마이트를 들고 그 굴을 찾아온 것이었습니다. 그 곰이 광산 근처에 나타나 골칫거리였기 때문입니다. 여러 번 쫓아냈는데도 다시 왔습니다. 먹을 것이 그쪽에 있었기 때문입니다. 곰은 그것 말고 다른 수가 없었습니다.`,
            `어미 곰이 굳었습니다. 사람들이 굴 앞에 화약을 놓았습니다. 그리고 심지에 불을 붙이려고 했습니다. 성냥 긋는 소리가 들렸습니다. 굴 안에서 그 소리가 아주 크게 들렸습니다. 새끼들이 어미 밑으로 파고들었습니다.`,
            `사람이 사는 데가 넓어지면 짐승이 살 데가 줄어듭니다. 그러면 짐승이 사람 사는 데로 내려옵니다. 그리고 그것을 짐승 탓으로 여깁니다. 그 곰도 그렇게 몰린 것이었습니다. 이것은 지금도 그대로인 일입니다.`,
            `닐스가 소리쳤습니다.<br>"저를 놓아 주세요! 제가 저걸 끄겠어요!"`,
            `어미 곰이 닐스를 놓았습니다. 닐스는 굴 밖으로 기어 나갔습니다. 그리고 이미 불이 붙은 심지를 붙잡았습니다.`,
            `심지가 지지직 소리를 내며 타들어 가고 있었습니다. 닐스는 그 앞을 두 손으로 덮쳤습니다. 불꽃이 손을 태웠습니다. 닐스는 그것을 눌러 껐습니다. 불이 꺼지고 나서야 손을 뗐습니다. 살이 타는 냄새가 났습니다. 닐스는 이를 악물고 있었습니다.`,
            `닐스는 소리를 내지 않았습니다. 소리를 내면 사람들이 알아채기 때문입니다. 사람들은 아무것도 보지 못했습니다. 닐스가 너무 작았기 때문입니다.`,
            `사람들은 화약이 불량이라고 여기고 돌아갔습니다. 닐스가 굴로 돌아왔습니다. 어미 곰이 한참 닐스를 보았습니다.`,
            `그러고는 이렇게 말했습니다.<br>"가거라."<br>"저를 안 잡아먹으시겠어요?"<br>"오늘은 안 잡아먹는다. 다음에 만나면 모른다."`,
            `닐스는 그것으로 됐다고 생각했습니다.`,
            `불에 덴 손의 자국은 오래 남았습니다. 나중에 사람으로 돌아간 뒤에도 남아 있었습니다. 손바닥에 흰 자국이 있었습니다. 그것을 보고 누가 물으면 아무 말도 하지 않았습니다.`
        ]
    },
    {
        num: 8,
        title: "청동상과 나무상",
        emoji: "🗿",
        art: ["story-08-a.webp", "story-08-b.webp"],
        paras: [
            `무리가 스웨덴 남쪽 바닷가를 지날 때의 일입니다. 닐스는 카를스크로나라는 도시에 하룻밤 내렸습니다.`,
            `카를스크로나는 바다 위 섬 여러 개에 지은 도시입니다. 옛날 스웨덴 왕이 싸움배를 두려고 세운 항구입니다. 섬과 섬 사이를 다리가 잇고 있습니다. 지금도 스웨덴 해군의 배가 드나듭니다.`,
            `밤이 깊어 거리에는 사람이 없었습니다. 닐스는 돌이 깔린 넓은 광장으로 나갔습니다. 광장 둘레의 집들은 창마다 불이 꺼져 있었습니다.`,
            `부두에는 커다란 싸움배들이 줄지어 매여 있었습니다. 낮이면 배를 만드는 망치 소리가 그치지 않는 곳이었습니다. 밤이라 물결 소리만 들렸습니다.`,
            `닐스는 광장 한가운데 서서 둘레를 둘러보았습니다. 사람도 짐승도 보이지 않았습니다. 무섭기보다 신이 났습니다. 도시 하나를 혼자 차지한 것 같았습니다.`,
            `그리고 그 밤에 닐스는 아주 이상한 일을 겪었습니다.`,
            `광장 한쪽에 커다란 청동상이 있었습니다. 이 도시를 세운 옛날 왕의 상이었습니다. 받침돌만 해도 사람 키를 넘었습니다. 닐스에게는 산 같았습니다. 올려다보아도 얼굴이 보이지 않았습니다.`,
            `그런데 그 상이 받침돌에서 내려와 걷기 시작했습니다. 발소리가 온 도시에 울렸습니다. 닐스는 무서워서 달아났습니다. 청동상이 따라왔습니다.`,
            `발밑에서 돌바닥이 울렸습니다. 창문이 덜컹거렸습니다. 뒤에서 나는 소리가 점점 가까워졌습니다. 한 걸음이 닐스의 백 걸음이었습니다. 달아나 봐야 소용없는 일이었습니다.`,
            `닐스는 해군 교회 쪽으로 달렸습니다. 거기에 다른 상이 하나 있었습니다. 나무로 만든 뱃사람 상이었습니다. 교회 앞에 오래전부터 서 있던 것이었습니다. 바닷바람에 나뭇결이 다 드러나 있었습니다. 누가 손보아 준 지 오래된 것이었습니다.`,
            `닐스가 그 뒤로 숨었습니다. 그러자 그 나무상도 움직였습니다. 그리고 청동상 앞을 막아섰습니다. 두 상이 마주 섰습니다.`,
            `닐스는 나무상 발치에 붙어 서서 위를 올려다보았습니다. 하나는 아주 크고 반짝였습니다. 하나는 작고 색이 다 벗겨져 있었습니다. 그런데 물러서지 않았습니다.`,
            `청동상이 말했습니다.<br>"비켜라."<br>나무상이 말했습니다.<br>"이 아이가 무엇을 잘못했습니까."<br>"나를 보고 달아났다."<br>"그건 무서워서 그런 것입니다."`,
            `그때 새벽닭이 울었습니다. 두 상은 그 자리에 멈췄습니다. 그리고 다시 상이 되었습니다. 청동상은 길 한가운데 서 있었고, 나무상은 그 앞을 막은 자세 그대로였습니다. 아침 볕이 그 위로 들었습니다. 자세만 보아도 무슨 일이 있었는지 알 수 있었습니다.`,
            `아침이 되자 사람들이 그것을 보고 놀랐습니다. 밤사이에 누가 옮겨 놓았다고들 했습니다.`,
            `닐스는 그 나무상 발치에 앉아 아침까지 있었습니다. 그 나무상은 한쪽 팔이 갈라져 있었습니다. 밤에 갈라진 것인지 원래 그랬는지 알 수 없었습니다. 닐스는 그 자리를 손으로 만져 보았습니다.`,
            `그리고 그 뒤로 닐스는 그 이야기를 아무에게도 하지 않았습니다. 누가 믿겠습니까.`,
            `닐스는 그 밤 일을 오래 떠올렸습니다. 청동상은 전쟁을 하던 시절의 왕이었고, 나무상은 배를 타고 일하던 보통 사람이었습니다. 그리고 아이를 지킨 것은 나무상이었습니다. 이름이 남은 쪽이 아니라 이름이 없는 쪽이었습니다.`,
            `그것이 무슨 뜻인지는 닐스도 말로 하지 못했습니다.`
        ]
    },
    {
        num: 9,
        title: "돌아가고 싶은 마음",
        emoji: "🏠",
        art: ["story-09-a.webp", "story-09-b.webp"],
        paras: [
            `여름이 되자 무리는 라플란드에 닿았습니다. 스웨덴의 제일 북쪽입니다. 여름에 해가 지지 않는 곳입니다. 여러 주 동안 해가 하늘에 떠 있습니다.`,
            `밤 열두 시에도 하늘이 밝았습니다. 닐스는 처음에 그것 때문에 잠을 못 잤습니다. 눈을 감아도 눈꺼풀 안쪽이 붉었습니다. 나중에는 익숙해졌습니다.`,
            `봄에 떠나서 여름에 닿은 것이었습니다. 스코네에서 라플란드까지는 스웨덴을 세로로 다 지나가는 길입니다. 이천 리가 넘습니다. 기러기는 그 길을 해마다 두 번 다닙니다. 봄에 한 번, 가을에 한 번입니다.`,
            `기러기들은 그곳에서 알을 낳고 새끼를 길렀습니다. 모르텐도 짝을 만났습니다. 던핀이라는 이름의 기러기였습니다.`,
            `작고 잿빛이 도는 기러기였습니다. 목소리가 가늘었습니다. 모르텐은 그 옆에서 유난히 커 보였습니다. 집거위와 들기러기가 짝이 된 것이었습니다. 무리에서도 그런 일은 드물었습니다.`,
            `라플란드의 여름은 짧습니다. 그 짧은 사이에 알에서 깨어나 날 수 있을 만큼 자라야 합니다. 그래서 새끼들은 아주 빨리 큽니다. 아침에 본 것과 저녁에 본 것이 달랐습니다. 닐스도 그것을 눈으로 보았습니다.`,
            `여름이 두 달쯤입니다. 그 안에 못 자라면 가을에 남쪽으로 갈 수가 없습니다. 못 가면 그 자리에서 겨울을 맞습니다. 그러면 살아남지 못합니다.`,
            `모르텐과 던핀 사이에 새끼가 여섯 마리 났습니다. 닐스는 그 여름 동안 그 새끼들을 돌보았습니다.`,
            `닐스는 그 여섯 마리에게 이름을 다 붙여 주었습니다. 그리고 물가에 나갈 때마다 수를 세었습니다. 하나, 둘, 셋 하고 여섯까지 세었습니다. 여섯이 안 되면 다시 세었습니다.`,
            `그해 여름에 닐스는 아주 달라졌습니다. 스스로도 그것을 알았습니다.`,
            `봄에 떠날 때 닐스는 남이 무엇을 잃든 상관하지 않는 아이였습니다. 여름이 끝날 무렵에는 새끼 한 마리가 안 보이면 밤에 잠을 못 잤습니다.`,
            `한번은 새끼 하나가 갈대밭으로 들어가 안 나온 적이 있었습니다. 닐스는 밤새 그 갈대밭을 헤매고 다녔습니다. 갈대가 키보다 훨씬 높았습니다. 발밑이 진창이었습니다. 몇 번이나 빠졌다가 기어 나왔습니다.`,
            `새벽에 찾아냈습니다. 그 새끼는 갈대 사이에서 자고 있었습니다.`,
            `어느 날 아카가 물었습니다.<br>"너는 사람으로 돌아가고 싶으냐."`,
            `닐스는 잠깐 대답하지 못했습니다.`,
            `"모르겠어요."<br>"왜 모르느냐."<br>"사람으로 돌아가면 이 말들이 안 들리잖아요."`,
            `아카는 그 말에 아무 대꾸도 하지 않았습니다. 늙은 기러기는 대답하지 않는 것으로 대답하는 일이 많았습니다. 닐스도 그것을 이제 알아들었습니다. 봄이었다면 못 알아들었을 것입니다.`,
            `그해 가을, 무리가 남쪽으로 내려가기 시작했습니다.`,
            `가는 길에 닐스는 여러 번 자기 마을 쪽을 보았습니다. 그리고 어머니와 아버지를 생각했습니다. 봄에 떠날 때는 그 생각을 하지 않았습니다. 그해 가을에는 자꾸 났습니다.`,
            `무리가 스코네 가까이 내려온 어느 날, 닐스는 모르텐의 등을 빌려 타고 자기 집에 몰래 가 보았습니다. 집이 그대로였습니다. 마당의 돌도, 문에 난 흠집도 그대로였습니다. 닐스가 낸 흠집이었습니다. 장난치다가 낸 것이었습니다. 그때는 그것이 아무것도 아니었습니다.`,
            `창으로 들여다보았습니다. 어머니가 식탁에 앉아 있었습니다. 아버지가 옆에 있었습니다. 두 사람은 아무 말도 하지 않고 있었습니다. 밥상에 그릇이 둘만 놓여 있었습니다. 셋이 앉던 상이었습니다.`,
            `닐스가 없어진 뒤로 두 사람이 어떻게 지냈는지 닐스는 그때 알았습니다.`,
            `외양간의 늙은 소가 닐스에게 다 일러 주었습니다. 두 사람은 닐스를 찾아 여기저기 다녔습니다. 그리고 못 찾았습니다. 그리고 그 집을 팔지 못하고 있었습니다. 닐스가 돌아올지도 모른다고 여겼기 때문입니다.`,
            `닐스는 그 창밑에 오래 앉아 있었습니다. 그리고 그날 돌아가기로 마음을 정했습니다. 그런데 어떻게 하면 돌아갈 수 있는지를 몰랐습니다.`
        ]
    },
    {
        num: 10,
        title: "다시 사람이 되는 값",
        emoji: "🪶",
        art: ["story-10-a.webp", "story-10-b.webp"],
        paras: [
            `그런데 어떻게 하면 사람이 되는지를 아무도 몰랐습니다. 톰테를 다시 만나면 될 것 같았는데, 그 뒤로 톰테를 본 사람이 없었습니다. 그 집 옷장도 그대로였습니다. 닐스는 여러 짐승에게 물었습니다. 까마귀에게도 묻고 다람쥐에게도 물었습니다. 다들 모른다고 했습니다. 톰테의 일은 톰테만 안다고 했습니다. 그러다 어느 날 대답을 들었습니다.`,
            `올빼미가 이런 이야기를 하는 것을 들은 것입니다. 밤에 나뭇가지 위에서 하는 말이었습니다.`,
            `"내가 톰테에게 들었는데, 그 아이가 사람이 되는 방법이 있다더군."<br>"뭔데?"<br>"자기 대신 다른 누구를 그렇게 만들면 된다더군."`,
            `닐스는 나뭇가지 뒤에 붙어서 그 말을 다 들었습니다. 그리고 그 자리에서 얼어붙었습니다. 자기 대신 누군가가 작아져야 한다는 것이었습니다.`,
            `누구를 그렇게 만들 것인가. 모르텐인가, 던핀인가, 아카인가. 새끼 여섯 마리 가운데 하나인가. 닐스는 그 생각을 하다가 그만두었습니다. 생각을 이어 갈수록 얼굴이 하나씩 떠올랐기 때문입니다. 여덟 달 동안 함께 다닌 얼굴들이었습니다. 그 가운데 하나를 고를 수가 없었습니다. 고를 수 없다는 것이 답이었습니다.`,
            `짐승이 되는 것이 어떤 것인지 닐스는 이제 알고 있었습니다. 그것을 다른 누구에게 하라고 할 수는 없었습니다. 그 뒤로 닐스는 여러 날 잠을 못 잤습니다. 물어본 것을 후회했습니다. 모르고 있었으면 그냥 지냈을 것이었습니다. 알고 나니 그것을 지고 다녀야 했습니다.`,
            `닐스는 그 일을 아무에게도 말하지 않았습니다. 모르텐에게도 아카에게도 말하지 않았습니다.`,
            `가을 기러기는 봄보다 천천히 갑니다. 새끼들이 아직 어리기 때문입니다. 자주 내려앉아 쉬어야 합니다. 어린 것이 뒤처지면 무리가 기다립니다. 그래서 가을 길이 봄 길보다 깁니다.`,
            `무리는 닐스의 마을 가까운 호숫가에서 며칠 쉬어 가고 있었습니다. 그리고 그때 일이 났습니다. 모르텐이 던핀과 새끼들을 데리고 옛집 마당에 내려앉은 것입니다. 자기가 난 집을 식구들에게 보여 주고 싶었던 것입니다. 닐스의 아버지가 마당에서 모르텐을 보았습니다. 봄에 날아간 자기 집 거위였습니다.`,
            `아버지는 그 거위를 알아보았습니다. 발에 난 흠집이 그대로였기 때문입니다. 봄에 나기 전부터 있던 흠집이었습니다. 자기 손으로 기른 거위였습니다. 아버지는 그것을 붙잡았습니다. 그리고 부엌으로 가져갔습니다. 나머지도 하나씩 붙잡았습니다.`,
            `그날 저녁 손님이 오기로 되어 있었습니다. 모르텐과 던핀과 새끼 여섯 마리가 다 붙잡혔습니다. 닐스는 그것을 창밖에서 보았습니다. 창턱에 매달려 보았습니다. 유리를 두드려도 아무도 듣지 못했습니다. 소리가 너무 작았기 때문입니다. 그리고 방법이 없었습니다.`,
            `여덟 마리가 다 부엌 구석에 묶여 있었습니다. 새끼들이 어미 밑으로 파고들었습니다. 던핀이 날개를 펴서 덮었습니다. 작은 몸으로는 아무것도 할 수 없었습니다. 어머니가 칼을 들고 있었고 아버지가 거위를 누르고 있었습니다. 두 사람에게는 그것이 여느 날의 일이었습니다. 그 거위들이 누구인지 알 수가 없었으니까요.`,
            `닐스는 그때 이렇게 생각했습니다. '내가 사람이면 저것을 막을 수 있는데.'`,
            `그리고 그 순간이었습니다. 닐스가 부엌으로 뛰어들어 갔습니다. 그리고 소리를 질렀습니다.`,
            `"안 돼요!"`,
            `그 소리가 아주 컸습니다. 작은 몸에서 날 수 있는 소리가 아니었습니다. 부엌이 울렸습니다. 그릇이 흔들렸습니다. 아버지가 손을 놓았습니다. 어머니가 돌아보았습니다. 부엌 한가운데에 열네 살짜리 아이가 서 있었습니다.`,
            `닐스였습니다. 그 순간 사람이 된 것이었습니다. 누구를 대신 작게 만들어서가 아니었습니다. 올빼미가 한 말은 틀린 말이었습니다.`,
            `자기가 사람이면 무엇을 할 수 있는지를 처음으로 생각했기 때문입니다. 그전까지 닐스는 사람인 것으로 남을 괴롭히기만 했습니다. 힘이 있는 것과 그 힘을 어디에 쓰는가는 다른 일입니다. 닐스는 그것을 여덟 달 만에 알았습니다.`,
            `그 일을 두고 길게 말할 것은 없습니다. 그 아이가 무엇을 했는지만 보면 됩니다.`
        ]
    },
    {
        num: 11,
        title: "그날 저녁",
        emoji: "🕯️",
        art: ["story-11-a.webp", "story-11-b.webp"],
        paras: [
            `어머니가 그 자리에 주저앉았습니다. 아버지는 손에 든 것을 떨어뜨렸습니다. 여덟 달 만이었습니다. 그동안 두 사람은 그 아이가 죽었다고 여기고도 있었고, 살았다고 여기고도 있었습니다. 둘 다 입 밖에 내지는 않았습니다. 그 말을 꺼내면 정말로 그렇게 될 것 같았기 때문입니다.`,
            `아버지가 물었습니다.<br>"닐스냐."<br>"저예요."<br>"어디 있었느냐."`,
            `아버지가 한 걸음 다가왔다가 멈춰 섰습니다. 손을 대면 사라질 것 같았기 때문입니다. 손이 떨리고 있었습니다. 닐스는 대답하려다가 말았습니다. 말해도 믿지 않을 것이었기 때문입니다. 믿어 달라고 조를 일도 아니었습니다.`,
            `거위 등을 타고 라플란드까지 갔다 왔다고 하면 누가 믿겠습니까. 그때 닐스가 아버지에게 제일 먼저 한 부탁은 이것이었습니다.`,
            `"저 거위들 놓아 주세요."<br>아버지가 물었습니다.<br>"왜?"<br>"제 친구예요."`,
            `아버지는 그 말이 무슨 뜻인지 몰랐습니다. 그런데 아들의 얼굴을 보고 더 묻지 않았습니다. 여덟 달 만에 돌아온 아들이 처음으로 한 부탁이었습니다. 거절할 수 없는 부탁이었습니다. 손님상에 올릴 거위였습니다. 그래도 아버지는 그 거위들을 놓아 주었습니다.`,
            `모르텐과 던핀과 새끼들이 마당으로 나갔습니다. 그리고 하늘로 올라갔습니다. 모르텐이 한 번 낮게 돌았습니다. 닐스가 손을 들었습니다. 모르텐이 그것을 보았는지는 알 수 없었습니다. 닐스는 마당에 서서 그것을 보았습니다.`,
            `그날 저녁, 마당에서 기러기 소리가 났습니다. 닐스가 나가 보았습니다. 무리가 낮게 날면서 지나가고 있었습니다. 지붕에 닿을 듯이 낮았습니다. 일부러 낮게 온 것이었습니다. 그러지 않으면 마당에 선 사람이 보이지 않기 때문입니다.`,
            `아카가 맨 앞에 있었습니다. 닐스는 손을 들었습니다. 기러기 소리가 났습니다. 그런데 그것이 무슨 말인지 알 수 없었습니다.`,
            `어제까지는 그 소리가 다 말이었습니다. 이제는 그냥 소리였습니다. 닐스는 소리쳐 부르려고 했습니다. 그런데 무슨 말로 불러야 하는지 알 수 없었습니다. 입만 벌렸다가 다물었습니다. 어제까지는 부르지 않아도 알아들었습니다.`,
            `닐스는 그 자리에 서서 그 소리를 들었습니다. 그리고 처음으로 자기가 무엇을 잃었는지 알았습니다.`,
            `무리가 지나가고 하늘이 조용해졌습니다. 닐스는 한참 마당에 서 있었습니다. 그러고는 안으로 들어갔습니다. 들어가서 문을 닫았습니다. 그날 저녁은 아무 말도 하지 않았습니다.`,
            `그날 밤 어머니가 이렇게 물었습니다.<br>"닐스야, 너 어디 아프냐? 얼굴이 달라졌다."<br>아버지가 말했습니다.<br>"컸구먼."`,
            `그 뒤로 닐스는 그 여덟 달 이야기를 아무에게도 하지 않았습니다. 다만 그 뒤로 짐승을 괴롭히지 않았습니다. 마당의 거위들이 닐스를 피하지 않게 되었습니다. 그리고 봄이 되면 하늘을 보았습니다.`,
            `삼월이 되면 마당에 나가 서 있었습니다. 어머니가 그것을 보고 무엇을 보느냐고 물으면 아무것도 아니라고 했습니다. 아무것도 아닌 것이 아니었습니다. 다만 말할 수 있는 것이 아니었습니다.`,
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
    title: 'The Wonderful Adventures of Nils',
    cover: {
        title: 'The Wonderful Adventures of Nils',
        tag: 'after Selma Lagerlöf',
        intro: [
            `Nils, fourteen, who made a habit of tormenting animals, is shrunk to the size of a hand. And clinging to the back of Morten the farm goose, he follows a flock of wild geese to the far end of Sweden.`,
            `The book began as a geography textbook for schools. Every mountain, lake and city Nils passes over is a real place.`
        ]
    },
    chapters: [
        {
            title: 'The Boy Who Shrank',
            paras: [
                `At the southern tip of Sweden there is a province called Skåne. It is a place of wide fields close to the sea. The wind always blows in from the water. On a farm in that province lived a boy called Nils.`,
                `Skåne is the southernmost part of Sweden. So the snow comes late there and melts early. In spring the birds going north pass over it. People know spring has come by the sound of them. They lift their heads from their work in the fields. Every year the birds pass at the same time, by the same road.`,
                `Nils was fourteen. The family was not well off. His father and mother went out to the fields at dawn. So they had little time even to scold Nils. They saw his face only in the evening. After supper his father went straight to bed. Because he had to be out again at dawn.`,
                `Nils was one of the worst boys in the village. Set him to work and he ran off; open a book in front of him and he slept. Send him on an errand and it took half a day. And he tormented the animals.`,
                `He trod on the cat's tail, chased and drove the geese, and pulled down birds' nests. Sometimes he took the eggs out and threw them. The mother bird followed him, screaming. Nils found that amusing. Every animal on that farm was afraid of him.`,
                `It was a Sunday morning in March.`,
                `As his parents left for church, they said to Nils,<br>"Today you are to read ten pages of the Bible."<br>"Yes."`,
                `His mother opened the book and put a marker in it before she went. From here to here, she showed him with her finger. She said she would ask him about it when she came home. Nils only said that he understood.`,
                `As soon as the two of them had gone, Nils slumped over the desk. And dozed.`,
                `Sunlight came in through the window. Outside, sparrows were chattering. A fly kept bumping against the windowpane. It hit the same spot again and again. The way out stood open right beside it, and still it did.`,
                `Listening to that sound, Nils fell half asleep. Let alone ten pages, he had not read one line.`,
                `Then there was a sound of something moving in the room. Nils lifted his head, and the lid of his mother's chest stood open. And inside it a very small person was rummaging about.`,
                `It was a person the size of a hand. It had a beard, a wide-brimmed hat, and breeches fastened below the knee. There were metal buckles on its shoes. Its clothes looked like something from very long ago. It was exactly like the pictures in the storybooks. It was what the Swedish country people call a tomte. A little house-spirit that is said to look after the home.`,
                `In Swedish farmhouses there was a custom of setting out a bowl of porridge for the tomte every winter. If you did, they believed, the house would be safe. It was done at Nils's house every winter too. Only, Nils thought it ridiculous.`,
                `Nils took down the butterfly net that hung on the wall. And he dropped it over the tomte and caught him.`,
                `The tomte said,<br>"Let me go. Let me go, and I will give you a silver coin."`,
                `Hearing that, Nils grew greedy. With one silver coin there were several things he could buy at the village shop. Sweets, and a knife too. He could show off to the village boys. That was the first thing Nils thought of. He had heard, too, that if you caught a tomte it would grant your wishes.`,
                `"One coin is not enough."<br>"Then what do you want?"<br>"Two gold coins, and a silver spoon, and everything in that chest."`,
                `For a moment the tomte said nothing.`,
                `And then he said this:<br>"What a wicked boy you are."`,
                `Nils shook the net. And at that moment the tomte slipped out. Nils did not even see where. One of the meshes must have opened. It was because Nils had shaken the net.`,
                `The tomte struck Nils on the cheek. It was a very small hand, and yet everything went dark before his eyes. Nils fell where he stood.`,
                `How long he lay there, he could not tell.`
            ]
        },
        {
            title: 'On the Back of a Goose',
            paras: [
                `When Nils opened his eyes, the room was very strange. The ceiling was dizzyingly high. He had to tip his head back to see the top. A chair was as big as a mountain. One leg was the size of a tree trunk. Look up as he might, he could not see the seat.`,
                `The Bible on the desk stood up like a wall. One letter was the size of his palm. A pen was the size of a log. The inkpot was like a water tub. The place where the marker had been put in was far above him. Now he could not even climb up to it.`,
                `Nils went to the mirror. Even getting to the mirror took a long time. The cracks between the floorboards were as wide as ditches. There were places where he had to jump. If he missed his footing he would fall in. Nils crossed them holding on to the edges.`,
                `And he looked into the glass. He had shrunk to the size of the tomte. Nils screamed. Even the scream came out very small.`,
                `And then there was one more strange thing. He could hear what the sparrows outside were saying. Not chirping — words.`,
                `"Look at that! That wicked boy has come to this!"<br>"Serves him right!"`,
                `He could hear everything the animals said. The animals had not forgotten one thing Nils had done to them. And that day they said it all. Not one of them left anything out. They said when and where and what. Nils stood and heard it all.`,
                `Nils went out into the yard. The cat blocked his way. Nils tried to kick it, as he always had. His foot did not even reach. And now the cat was far bigger than Nils. Its eyes were as big as plates.`,
                `The cat pressed Nils down with one paw.`,
                `And it said this:<br>"Now, whenever I like, I can teach you a lesson."`,
                `And then it let him go. For the first time, Nils learned what it is to be afraid. His legs gave way and he sat there a long while. Until now he had always been the one who frightened.`,
                `As he passed the goose pen, the geese shouted,<br>"That boy — how he tormented us!"`,
                `They stretched their necks and clacked their beaks. The whole pen was in an uproar. Nils crept along the foot of the wall. The geese followed him along it, shouting. Being shut in the pen, they could not get out. Had they been able to, there is no telling what would have happened.`,
                `Then there was a sound from the sky. It was a flock of wild geese. They were on their way north.`,
                `Wild geese fly from south to north in the spring. They pass over Skåne in March.`,
                `The wild geese looked down and called,<br>"Come up! Come with us to Lapland!"`,
                `The farm geese only stretched their necks inside the pen. But one big white gander spread his wings. His name was Morten.`,
                `Morten was a farm goose. He was the biggest and strongest goose on that farm. Farm geese cannot fly far. They are too fat. And people have bred them not to fly. It has come about over many generations.`,
                `So Morten had never once flown over the fence. But he had always wanted to fly.`,
                `Morten beat his wings and ran. And he rose into the air. Nils saw it and ran and caught hold of his neck.`,
                `He meant to stop him. If the goose flew away, his father would be furious. It was the most valuable goose on the farm. It was the goose that, sold in the autumn, would see them through the winter. Nils knew that too.`,
                `"No! Come down!"`,
                `But Morten was already going up. Nils, clinging to his neck, went up into the sky. It was too high now to let go. Below him his own house grew smaller and smaller.`,
                `The fields and roads looked like lines. People were dots. The church roof was like a matchbox. It was hard to tell what was what. Until then Nils had never known what his village looked like.`
            ]
        },
        {
            title: 'Akka',
            paras: [
                `The leader of the flock was a very old female. Her name was Akka of Kebnekaise. Kebnekaise is the name of the highest mountain in Sweden. It is in Lapland. It is a snow-covered mountain at the northern tip of Sweden. Even in summer there is snow on its top.`,
                `Among wild geese, the oldest and the one who knows the way best goes in front. Take a wrong road, and the whole flock starves. So knowing matters more than strength.`,
                `Akka had been born on that mountain, and she was said to be more than a hundred years old. That year, too, Akka was leading the flock north.`,
                `She had a white band at her throat, and the tips of her wings were worn. Her body, too, was smaller than the other geese. But she flew better than any young goose. Because she knew how to ride the wind.`,
                `In the evening the flock came down on a lake.`,
                `Wild geese sleep on the water at night. Sleep on land, and the fox gets you. Even on ice, they sleep well out from the shore. In March there was still ice on the lake. Only the middle had thawed. Sleep at the edge, and a fox could walk out to you.`,
                `Akka came up to Morten.<br>"You are a farm goose."<br>"Yes."<br>"A farm goose cannot follow us. It is a very long way to Lapland."<br>"I can go."<br>"And what is that child?"`,
                `Akka looked at Nils.`,
                `"That is a human. Humans are not allowed."`,
                `Morten said,<br>"This child is not a human any more. The humans do not even know him."`,
                `Akka looked at Nils a long while.`,
                `And then she said this:<br>"Keep up with us until tomorrow morning. If you cannot, we leave you behind."`,
                `That night a fox came to the lakeside. It was a fox called Smirre. The fox was after the geese sleeping on the water.`,
                `The fox was very thin from the winter. His ribs showed. The geese coming up in spring were his first real food in a long time. He had got through the winter on a few field mice. So he could not let them go.`,
                `The geese slept on the ice in the middle of the water. The fox crept out onto the ice.`,
                `Nils, just then, was sitting at the edge of the ice. Because he could not sleep. So he saw it. Nils shouted.`,
                `"Akka! A fox!"`,
                `All the geese flew up. But the fox caught the last one, the one that was slow.`,
                `Nils saw it and ran. And he grabbed the fox's tail. The fox leapt up in surprise.`,
                `Nils hugged the tail fur with both arms and hung on. He was dragged across the ice wherever the fox ran. His clothes were soaked through from the ice. Still he did not let go. To shake Nils off, the fox opened his mouth and shook himself. In that moment the goose got away. Nils was flung onto the ice.`,
                `From then on the fox hated Nils. And all that year he followed the flock. Even after he was driven out, he followed. Because that fox had nothing else left to do.`,
                `Next morning Akka said to Nils,<br>"I will take you with us."<br>"Why?"<br>"Because of last night."`,
                `And she added this:<br>"But understand one thing. We are not carrying you. We are travelling together."`,
                `At the time Nils did not know what that meant. He learned it eight months later. The one who is carried is baggage; the one who travels with you is family.`
            ]
        },
        {
            title: 'The Storks of Glimminge Castle',
            paras: [
                `In Skåne there was an old stone house called Glimminge. It was a castle with very thick walls. From far off it looked like a square block of stone. On its roof a pair of storks had built their nest.`,
                `It was built about five hundred years ago. The windows were small and the walls thick. Houses built in fighting times all look like that. There was only one door to go in by. Block that door, and nobody could get in.`,
                `The walls were as thick as a man is tall. The windows were narrow slits for shooting arrows. From inside you could see out, and from outside you could not see in. So hardly any daylight came in.`,
                `The male stork's name was Ermenrich. One day Ermenrich came to find Akka.`,
                `Storks have red legs, and very long ones. When they fly they stretch those legs straight out behind. They stretch the neck straight out in front too. Then the body is as straight as an arrow. Birds that fly far mostly fly like that.`,
                `"Something terrible has happened. The rats are coming."`,
                `Ermenrich stood without even folding his wings. He had flown straight from very far away. He was so out of breath that his words broke off. Akka told him to drink some water.`,
                `A house that people have left gets rats. And once rats get in, the house falls down faster. Because they dig under the posts.`,
                `Rats had lived in the cellars of that castle for a long time. They were called the black rats.`,
                `But later other rats came. They were called the grey rats. There were far more of them. They were bigger too. And they ate anything at all. The black rats were no match for them. Those grey rats were coming to take the whole castle.`,
                `Akka asked,<br>"Are there no people in the castle?"<br>"None. It was emptied long ago."`,
                `Akka said,<br>"We cannot help. We have neither teeth nor claws."`,
                `Then Nils said,<br>"I might have a way."`,
                `Nils climbed onto Ermenrich's back and went to Glimminge Castle. The cellar of the castle was pitch dark. Nils felt his way along the wall. Something rustled under his feet. It was dry straw and broken wood. When he trod on it, it made a loud noise.`,
                `And then he found something. It was a pipe. A very old wooden pipe.`,
                `Nils blew it. He did not even know the proper way to play it. He blew into it and it simply made a sound. It was neither high nor low. To Nils it sounded like nothing at all.`,
                `But when the sound came, there was a scratching of claws on every side. The rats began to follow the sound. Every one of the grey rats came out.`,
                `Nils walked, playing the pipe. Out of the castle, across the fields, toward the lake. He did not stop once. If he stopped, the sound would stop, and if the sound stopped, the rats would scatter. Nils knew that too. The rats all followed.`,
                `Once he looked back. The whole field seemed to be moving. And Nils led those rats a very long way off.`,
                `In Germany an old tale called 'The Pied Piper of Hamelin' has been told for a long time. It is the story of a man who played a pipe and led away every rat in a town. What Nils did was exactly that.`,
                `Only, the Pied Piper of Hamelin, when he was not paid, took the children too. Nils took no payment at all. With the same pipe, one man took revenge, and one did not. What is in the hand may be the same, but a different person makes it a different thing.`,
                `Ermenrich the stork asked,<br>"What can we give you?"<br>Nils said,<br>"Do you know when I shall be a human again?"<br>"I do not."<br>"Then never mind."`,
                `The stork looked down at Nils a long while. And he could not say a word. Because that was the only thing Nils had wanted.`
            ]
        },
        {
            title: 'The Dance of the Cranes',
            paras: [
                `Every spring a great gathering was held on a mountain called Kullaberg. It was a gathering of animals. There was no fixed date. But when the day came, all the animals knew. When the day came, from morning on, the animals all moved in one direction. The village people never noticed.`,
                `Some said the crows knew first and spread the word; some said you could tell by the smell of the wind.`,
                `Kullaberg is a low mountain on the coast of Skåne. It was a place people seldom climbed. There was not even a proper path.`,
                `It was so rocky and rough that it could not be used for fields or for pasture. So it was left to the animals. In a place left as useless, something else settles.`,
                `For that one day it was agreed that nobody would eat anybody. A deer and a wolf could be in the same place and nothing happened. That rule had existed for a very long time. A fox sat beside a hare, and a hawk sat on a branch beside a sparrow.`,
                `The hare kept its ears laid back all the same. The sparrow sat at the very end of the branch. It was a place from which it could fly at any moment. They believed in the rule, but their bodies did not. That had been bred into them over many generations.`,
                `Who had made the rule, nobody knew. But everybody kept it. And everybody knew what happened to those who did not. The story of the animal that broke the rule that day had been told for a long time. Mothers told it to their young. That was why the rule was kept.`,
                `The geese went there too. Nils sat on Morten's back and watched. Looking down, he could not see the end of the meadow. The wide meadow at the foot of the mountain was full of animals.`,
                `From far off the meadow looked mottled. Close up, it was all animals. There was nowhere to set a foot. Every animal had its own place. Nobody had assigned them, and yet that was how they sat.`,
                `Crows and jackdaws covered the sky, and deer and roe deer stood in rows.`,
                `And the games began. First the hares came out and ran races.`,
                `The hares ran across the meadow. They jumped backwards and sprang sideways. The dust rose white. The animals watching stamped their feet.`,
                `The fastest hare made one more turn at the end. Then it went into the edge of the meadow. The animals stamped for a long time. The ground shook. The hare heard it and jumped once more.`,
                `Next the grouse came out and sang. The grouse is a bird that puffs out its throat in spring and calls low. That sound carries a very long way through the forest. So in spring the forest is full of it.`,
                `Next the stags locked antlers and fought.`,
                `Last came the cranes. The cranes danced. In the middle of the meadow the grey birds raised their necks, half spread their wings, sprang up and came down. Nobody made a sound.`,
                `They turned on the tips of their toes, faced one another and bowed, and sprang up again. Several turned together in the same place. Their shadows moved together over the grass. The sun was setting, so the shadows were very long. The shadows reached to the end of the meadow. The shadows moved more than the birds did. Watching, it seemed there were two of every bird.`,
                `All the animals gathered there fell silent. Even the crows did not call.`,
                `Cranes seldom dance where people can see. So few people have seen it.`,
                `Nils was one of the few people who ever did. Though he was not a person at the time. Watching it, Nils found his throat tight. He could not take his eyes away. He did not know why.`,
                `Until then, Nils had never once felt that anything was beautiful.`,
                `But that day, at that gathering, something went wrong. The fox Smirre broke the rule. He carried off a goose.`,
                `The animals caught Smirre. And they passed sentence.`,
                `The old animals came forward and sat. Smirre was dragged before them. Smirre made no excuse. He did not lift his head. There were still feathers at the corner of his mouth.`,
                `The sentence was this. From that day Smirre was banished from the province. And no animal would speak a word to him. Nor would anybody call him by name.`,
                `They did not kill him. In the animals' rule there was no sentence of death. Banishment was the heaviest sentence. Because an animal left alone does not live through the winter. Smirre went down the mountain alone.`,
                `Watching that, Nils felt something strange. That fox was an animal that had tried to kill him many times. And yet, watching him go, Nils was not easy in his mind.`,
                `Smirre never once looked back. That was harder still to watch.`,
                `It was because he thought then that he had been no different from that fox. Until not long before, Nils had been a boy who could not have complained if he had been driven out of his village.`,
                `And in fact it was as if he had been. Nobody in that house knew him any more. Even if he went back, there was nowhere for him to go in.`
            ]
        },
        {
            title: 'Vineta',
            paras: [
                `As the flock went north it passed many places.`,
                `Every place Nils passed over was a real place. Go to Sweden today and they are all still there, just where they were.`,
                `Among them was a place like this. The Baltic is the sea to the east of Sweden. There are a great many islands in it. Counting the small ones, there are thousands. Ships sailed among the islands. So that sea had many harbours. Among them was a place where, long ago, a great port city was said to have sunk beneath the sea.`,
                `On that island there were the ruins of an old fortress. Nobody lived there. The stone walls had fallen and grass grew between the stones. Only the paving stones were as they had been. Only gulls sat on them. The waves came in to the foot of the walls. It was hard to tell that people had once lived there.`,
                `One night Nils came down on that island. And he saw a strange thing.`,
                `In the middle of the night, a city appeared among those ruins. People were walking about, goods were piled in the shops, and ships lay in the harbour. The people wore the clothes of very long ago. Even their hats and shoes were old-fashioned. Their speech was different from the speech of today. And yet Nils understood every word.`,
                `Nils went into one of the shops. Inside it was bright. He could hear people's voices. And nobody thought Nils strange.`,
                `A merchant showed him his goods.`,
                `"Buy this. The price is one coin."`,
                `Nils went through his pockets. In his pockets there were only threads and dry blades of grass. Since he had shrunk, he had never had money. Because he had no use for it.`,
                `The merchant took him to another shop. There, too, the price was one coin. Everybody in the city came pouring out and surrounded Nils. Every one of them was trying to sell him something.`,
                `Gold cups, silk, leather shoes, glass necklaces. People held them out to Nils. Some went down on their knees and begged. Some caught at his coat. Nils did not understand why at the time. They did not have the faces of people selling goods. They had the faces of people begging for their lives.`,
                `The price was one coin every time. Nils did not have that coin.`,
                `Then the cock crowed for dawn. And the city vanished.`,
                `The lights went out, the people vanished, the ships vanished. The sounds all stopped at once. Only the sound of the wind was left. Only the stone floor under his feet was as it had been. Where he had stood was a grassy meadow. Nils stood alone in the empty ruins.`,
                `Later, Nils told Akka about it.`,
                `Akka said,<br>"That city is called Vineta. It is a city that sank beneath the sea long ago. They say that once in a hundred years that city appears. And they say that if, on that night, anybody buys so much as one thing there, the city comes back to life."`,
                `Nils sat down where he was.`,
                `"Because I had no coin..."<br>"Yes."`,
                `That night Nils cried all night. Not for himself, but for the people of that city. It was the first time Nils had ever felt such a thing. Had it been when he first left home, he would simply have forgotten it. The Nils of that time had never once reckoned what somebody else had lost. He had not been gone long, and yet he had changed that much.`
            ]
        },
        {
            title: "The Bear's Den",
            paras: [
                `The flock went further north. In that country there were mines. They were iron mines. Smoke rose from the chimneys day and night.`,
                `About the middle of Sweden there is a district called Bergslagen. There is a great deal of iron under the ground there, and for a very long time it has been dug and smelted. Swedish iron is famous for its quality. That iron was sold to buy goods from other countries.`,
                `One day Nils was separated from the flock. A strong wind blew and he slipped off Morten's back. There was no time even to grab hold.`,
                `When the wind is strong, wild geese let their formation break and then gather again. That day, when they gathered, Nils was gone. Morten tried to turn back. But the wind was too strong to turn against.`,
                `Nils fell into a forest. And night came. He caught on branches and was not hurt. He struck several times as he fell. But his body was so light that he lived.`,
                `Cold, he looked for a den and went into one. Inside it was warm. But that den was a bear's den.`,
                `A mother bear was asleep with two cubs. The cubs found Nils first. And they rolled him about like a toy. They fought over him. But one blow of those paws would have broken his bones.`,
                `They pushed him with their paws and mouthed him. Nils clenched his teeth so as not to make a sound.`,
                `When a bear wakes from its winter sleep, it is terribly hungry. And with cubs it is fiercer still. Because it is guarding them. At such a time even a person must keep away.`,
                `The mother bear woke. And she pressed Nils down with one paw.`,
                `"You smell of human."<br>"I am not a human."<br>"You smell of human."`,
                `Just then there was a sound outside. Human voices and the sound of iron. The mine people had come to that den with dynamite. Because that bear had been appearing near the mine and making trouble. They had driven her off several times, and she had come back. Because the food was over there. The bear had no other way.`,
                `The mother bear went rigid. The people set the charge at the mouth of the den. And they made to light the fuse. There was the sound of a match being struck. Inside the den it sounded very loud. The cubs burrowed under their mother.`,
                `When the places people live grow, the places animals live shrink. Then the animals come down to where the people are. And people blame the animals for it. That bear had been driven there the same way. That is still how it is today.`,
                `Nils shouted,<br>"Let me go! I will put that out!"`,
                `The mother bear let Nils go. Nils crawled out of the den. And he grabbed the fuse, which was already lit.`,
                `The fuse was hissing and burning down. Nils threw himself on the front of it with both hands. The flame burned his hands. Nils pressed and smothered it. Only when the fire was out did he take his hands away. There was a smell of burning flesh. Nils was clenching his teeth.`,
                `Nils made no sound. Because if he made a sound, the people would notice. The people saw nothing at all. Because Nils was so small.`,
                `The people decided the charge was faulty and went away. Nils came back to the den. The mother bear looked at Nils a long while.`,
                `And then she said this:<br>"Go."<br>"You will not eat me?"<br>"Not today. If we meet again, I cannot say."`,
                `Nils thought that was enough.`,
                `The marks of the burn on his hands stayed a long time. They were still there after he became a person again. There were white marks on his palms. When anybody saw them and asked, he said nothing.`
            ]
        },
        {
            title: 'The Bronze Statue and the Wooden One',
            paras: [
                `This happened when the flock was passing along the south coast of Sweden. Nils came down for one night in a city called Karlskrona.`,
                `Karlskrona is a city built on a number of islands in the sea. It is a harbour that a Swedish king of long ago built to keep his warships in. Bridges join one island to the next. Ships of the Swedish navy still come and go there today.`,
                `It was late at night, and there was nobody in the streets. Nils went out into a wide square paved with stones. In the houses round the square, every window was dark.`,
                `At the docks, great warships lay moored in rows. By day the shipbuilders' hammers never stopped there. At night only the sound of the waves could be heard.`,
                `Nils stood in the middle of the square and looked all around. There was not a person or an animal to be seen. He felt more excited than afraid. It was as if he had a whole city to himself.`,
                `And that night Nils went through a very strange experience.`,
                `On one side of the square there was a great bronze statue. It was a statue of the king of long ago who had founded the city. The pedestal alone was taller than a man. To Nils it was like a mountain. Look up as he might, he could not see the face.`,
                `And then that statue stepped down from its pedestal and began to walk. Its footsteps echoed through the whole city. Nils was frightened and ran. The bronze statue followed.`,
                `The paving stones rang under its feet. Windows rattled. The sound behind him came closer and closer. One of its strides was a hundred of Nils's. Running was no use at all.`,
                `Nils ran toward the naval church. There was another statue there. It was a wooden statue of a sailor. It had stood in front of the church for a very long time. The grain of the wood showed through, worn by the sea wind. It was a long time since anybody had cared for it.`,
                `Nils hid behind it. Then that wooden statue moved too. And it stepped in front of the bronze one. The two statues stood face to face.`,
                `Nils pressed himself against the wooden statue's feet and looked up. One was very big and shining. The other was small, with all its paint peeled away. And yet it did not give way.`,
                `The bronze statue said,<br>"Stand aside."<br>The wooden statue said,<br>"What has this child done wrong?"<br>"He saw me and ran."<br>"That was because he was afraid."`,
                `Then the cock crowed for dawn. The two statues stopped where they were. And they became statues again. The bronze one stood in the middle of the road, and the wooden one stayed just as it was, blocking its way. The morning sun came down on them. From their postures alone you could tell what had happened.`,
                `In the morning people saw it and were astonished. Somebody had moved them in the night, they said.`,
                `Nils sat at the feet of the wooden statue until morning. One of its arms was split. Whether it had split in the night or had always been so, there was no telling. Nils touched the place with his hand.`,
                `And after that, Nils never told that story to anybody. Who would believe it?`,
                `Nils thought about that night for a long time. The bronze statue was a king from the time of wars, and the wooden one was an ordinary man who had worked on the ships. And it was the wooden one that protected the child. Not the one whose name is remembered, but the one with no name.`,
                `What that meant, even Nils could not put into words.`
            ]
        },
        {
            title: 'Wanting to Go Home',
            paras: [
                `When summer came, the flock reached Lapland. It is the northernmost part of Sweden. In summer the sun does not set there. For weeks the sun stays in the sky.`,
                `Even at midnight the sky was light. At first Nils could not sleep because of it. Even with his eyes shut, the insides of his eyelids were red. Later he got used to it.`,
                `They had set out in spring and arrived in summer. From Skåne to Lapland is the length of Sweden from end to end. It is more than a thousand kilometres. The wild geese fly that road twice every year. Once in spring, once in autumn.`,
                `There the geese laid their eggs and raised their young. Morten found a mate too. She was a goose called Dunfin.`,
                `She was a small goose with a greyish tint. Her voice was thin. Beside her, Morten looked unusually large. A farm goose and a wild goose had become a pair. Even in the flock, that was a rare thing.`,
                `The Lapland summer is short. In that short time the young must hatch and grow big enough to fly. So the goslings grow very fast. What he saw in the morning was different by evening. Nils saw it with his own eyes.`,
                `The summer is about two months. If they have not grown in that time, they cannot go south in the autumn. If they cannot go, they meet the winter where they are. And then they do not survive.`,
                `Morten and Dunfin had six goslings. Nils looked after those goslings all that summer.`,
                `Nils gave all six of them names. And every time they went to the water he counted them. One, two, three — up to six. If it did not come to six, he counted again.`,
                `That summer Nils changed a great deal. He knew it himself.`,
                `When he set out in the spring, Nils was a boy who did not care what anybody lost. By the end of the summer, if one gosling was missing, he could not sleep at night.`,
                `Once a gosling went into the reeds and did not come out. Nils wandered through those reeds all night. The reeds were far taller than he was. Underfoot was mud. He sank in several times and crawled out again.`,
                `He found it at dawn. The gosling was asleep among the reeds.`,
                `One day Akka asked,<br>"Do you want to go back to being a human?"`,
                `For a moment Nils could not answer.`,
                `"I do not know."<br>"Why do you not know?"<br>"If I go back to being a human, I will not be able to hear all this talk."`,
                `Akka made no reply to that. The old goose often answered by not answering. Nils understood that now. In the spring he would not have.`,
                `That autumn the flock began to go south.`,
                `On the way, Nils looked several times toward his own village. And he thought of his mother and father. When he set out in the spring, he had not thought of them. That autumn they kept coming into his mind.`,
                `One day, when the flock had come down close to Skåne, Nils borrowed Morten's back and went secretly to look at his home. The house was as it had been. The stones in the yard, the scratches on the door — all as before. The scratches were ones Nils had made. He had made them fooling about. At the time they had been nothing.`,
                `He looked in through the window. His mother sat at the table. His father sat beside her. The two of them were saying nothing. On the table there were only two bowls. It was a table where three had sat.`,
                `Nils learned then how the two of them had lived since he disappeared.`,
                `The old cow in the cowshed told Nils everything. His parents had gone here and there looking for him. And they had not found him. And they had been unable to sell the house. Because they thought Nils might come back.`,
                `Nils sat under that window a long while. And that day he made up his mind to go back. But he did not know how he could.`
            ]
        },
        {
            title: 'The Price of Being Human Again',
            paras: [
                `But nobody knew how to become a human again. It seemed it might work if he met the tomte again, but nobody had seen the tomte since. The chest in the house was as it had been. Nils asked many animals. He asked the crow and he asked the squirrel. They all said they did not know. The tomte's business, they said, only the tomte knows. Then one day he heard an answer.`,
                `He heard an owl telling it. It was said at night, up on a branch.`,
                `"I heard it from the tomte — there is a way for that boy to become human."<br>"What is it?"<br>"He has only to make somebody else that way in his place."`,
                `Nils, pressed against a branch, heard it all. And he froze where he was. Somebody else would have to shrink in his place.`,
                `Who would he make so? Morten? Dunfin? Akka? One of the six goslings? Nils began to think it through and stopped. Because the further the thought went, the faces came up one by one. They were the faces he had travelled with for eight months. He could not choose one of them. Not being able to choose was the answer.`,
                `Nils now knew what it was to become an animal. He could not ask that of anybody else. After that Nils could not sleep for many days. He regretted having asked. Had he not known, he would simply have gone on. Now that he knew, he had to carry it.`,
                `Nils told nobody about it. Not Morten, and not Akka.`,
                `In autumn the wild geese go more slowly than in spring. Because the young are still small. They have to come down often and rest. If a young one falls behind, the flock waits. So the autumn road is longer than the spring one.`,
                `The flock was resting for a few days by a lake near Nils's village. And then it happened. Morten took Dunfin and the goslings and came down in the yard of his old home. He wanted to show his family the house where he was born. Nils's father saw Morten in the yard. It was his own goose, the one that had flown off in the spring.`,
                `His father knew the goose. Because the scar on its foot was still there. It was a scar from before he had flown off in the spring. It was a goose he had raised with his own hands. His father caught him. And took him to the kitchen. Then he caught the others one by one.`,
                `Guests were expected that evening. Morten and Dunfin and the six goslings were all caught. Nils saw it from outside the window. He hung from the sill and watched. He beat on the glass, and nobody heard. Because the sound was too small. And there was nothing to be done.`,
                `All eight were tied up in a corner of the kitchen. The goslings burrowed under their mother. Dunfin spread her wings over them. With that small body there was nothing she could do. His mother was holding the knife and his father was holding the goose down. To the two of them, it was an ordinary day's work. Because they could not know who those geese were.`,
                `Nils thought then: 'If I were a human, I could stop this.'`,
                `And that was the moment. Nils ran into the kitchen. And he shouted.`,
                `"No!"`,
                `The shout was very loud. It was not a sound a small body could make. The kitchen rang with it. The dishes shook. His father let go. His mother turned round. In the middle of the kitchen stood a fourteen-year-old boy.`,
                `It was Nils. In that instant he had become a human. Not by making somebody else small in his place. What the owl had said was wrong.`,
                `It was because, for the first time, he had thought what he could do if he were human. Until then, Nils had used being human only to torment others. Having power and what you use it for are two different things. It took Nils eight months to learn that.`,
                `There is no need to say much about it. It is enough to see what the boy did.`
            ]
        },
        {
            title: 'That Evening',
            paras: [
                `His mother sat down where she stood. His father dropped what was in his hand. It was eight months. In that time the two of them had thought the boy dead, and had thought him alive. Neither of them had said either out loud. Because if they said it, it seemed it might come true.`,
                `His father asked,<br>"Is that Nils?"<br>"It is me."<br>"Where have you been?"`,
                `His father took one step toward him and stopped. Because if he touched him, it seemed he might vanish. His hand was shaking. Nils began to answer and stopped. Because even if he told them, they would not believe it. It was not something to beg to be believed.`,
                `If he said he had ridden a goose to Lapland and back, who would believe it? The first thing Nils asked of his father was this:`,
                `"Let those geese go."<br>His father asked,<br>"Why?"<br>"They are my friends."`,
                `His father did not know what that meant. But he looked at his son's face and asked no more. It was the first thing his son had asked, home after eight months. It was a request that could not be refused. Those were geese for the guests' table. Even so, his father let those geese go.`,
                `Morten and Dunfin and the goslings went out into the yard. And they rose into the sky. Morten made one low circle. Nils raised his hand. Whether Morten saw it, there was no telling. Nils stood in the yard and watched.`,
                `That evening there was a sound of wild geese over the yard. Nils went out to look. The flock was passing, flying low. So low they nearly touched the roof. They had come low on purpose. Otherwise a person standing in the yard would not have been visible.`,
                `Akka was at the very front. Nils raised his hand. The geese called. But he could not tell what they were saying.`,
                `Until yesterday that sound had all been words. Now it was only sound. Nils tried to call out to them. But he did not know what words to call in. He opened his mouth and shut it again. Until yesterday, they had understood him without being called.`,
                `Nils stood there and listened to that sound. And for the first time he knew what he had lost.`,
                `The flock passed and the sky went quiet. Nils stood in the yard a long while. Then he went inside. He went in and shut the door. He said nothing at all that evening.`,
                `That night his mother asked,<br>"Nils, are you ill? Your face has changed."<br>His father said,<br>"He has grown."`,
                `After that Nils never told anybody the story of those eight months. Only, from then on, he never tormented animals. The geese in the yard stopped avoiding him. And when spring came, he looked at the sky.`,
                `When March came, he went out and stood in the yard. When his mother saw him and asked what he was looking at, he said it was nothing. It was not nothing. Only, it was not something that could be said.`
            ]
        }
    ],
    afterword: {
        title: 'After Reading',
        paras: [
            `The original title of this book is The Wonderful Adventures of Nils Holgersson Through Sweden. The name of the country is in the title. That is bound up with the reason the book was written.`,
            `The writer was Selma Lagerlöf of Sweden. She was originally a village schoolteacher. And later she became the first woman to receive the Nobel Prize for Literature.`,
            `She made her name with her first novel, published when she was thirty-three. Until then she had taught children in a village school for more than ten years. She wrote at night.`,
            `That first novel was woven from the old tales told in her home district. So from the start she was a writer who gathered old stories. Nils was made the same way.`,
            `The story of how this book came about is unusual. An association of Swedish teachers asked her for something. They wanted a textbook to teach children the land and the regions of Sweden. So this book was made from the start as a geography textbook.`,
            `After the request came, she put it off for three years. Because she did not know how to write it. Then, they say, the idea of making a child small came to her.`,
            `By then Lagerlöf was already a famous writer. It was rare for such a person to take on a textbook at all.`,
            `And she was not trapped by the word textbook. Instead of making children memorise place names and figures, she sent one child flying over them.`,
            `For three years she travelled all over Sweden. District by district she gathered the landscape, the way of life and the old tales. And then she made this story.`,
            `As a child Lagerlöf had a bad leg and for a while could not walk. So she grew up sitting in a room, reading books and listening to old tales.`,
            `That child grew up to write a story of travelling the whole country and looking down on it from the sky. It is a travel book written by a child who could not walk.`,
            `And she made the child small and put him on a goose's back. Because only so could the whole country be seen from above. There was no better way to teach geography.`,
            `And there was another meaning in making the child small. Once he is small, he is at eye level with the animals. And then a human is no longer the centre of the world.`,
            `Seen from high up, where the rivers run and where the mountains stand comes into view at a glance. And what the people below do for a living can be seen too.`,
            `The book came out in two volumes, in 1906 and the year after. And it really was used as a textbook in Swedish schools for a long time.`,
            `For more than fifty years. So several generations of Swedes learned their own country from this book.`,
            `It is rare for a book made as a textbook to be used so long. It was because it was enjoyable. Children did not read it as homework; they simply read it.`,
            `Even now this book is special in Sweden. On the old Swedish banknotes, Lagerlöf's face and Nils on his goose were printed together.`,
            `It was the twenty-krona note. Lagerlöf was on the front, and Nils on his wild goose on the back. An invented boy had got onto the country's money.`,
            `That note is no longer in use. But Swedes still remember the picture.`,
            `And in Sweden there is a travel route that follows the book. It goes in order through the districts Nils passed over on his goose.`,
            `In school, children opened a map as they read this book. They pointed to each district the geese passed over, one by one.`,
            `And in the villages along that road stand markers carved with Nils and his goose. An invented boy has become the country's guide.`,
            `Now let us pick out some places worth a second look.`,
            `First, read the first chapter again. Nils was a lazy boy who tormented animals. Then he catches a house-spirit to make fun of it, and is shrunk.`,
            `But being shrunk is not only a punishment. Once he is small, Nils comes to understand what the animals say. And he learns what he had been doing all that time.`,
            `So the punishment in this book is a punishment and a chance at once. Lagerlöf did not separate the two.`,
            `Listen to what the farm animals say to him. The cat and the cow and the geese count up everything that happened, one by one. Nils had forgotten it all. This passage shows that only the one who suffered remembers.`,
            `And those animals are glad that Nils has shrunk. The book writes that down too, as it is.`,
            `But those animals do not really harm Nils either. Because it is also true that they lived together.`,
            `Only the cat is angry once, badly. Because its tail had been trodden on many times. But even that cat lets Nils go in the end.`,
            `Second, look again at Akka. She is the old leader of the flock of wild geese. At first she thoroughly disapproves of Nils.`,
            `She has flown that road dozens of times. So she knows where there is a place to rest and where there is a man with a gun.`,
            `That knowledge keeps the flock alive. So the most valuable thing in that flock is not strength but the memory of many journeys.`,
            `And she sets a condition. If he is useful, he may stay. So Nils is in the flock on payment, so to speak.`,
            `And Akka treats Nils with reserve to the end. Because he is human. To that flock, humans were the things with guns.`,
            `That wild geese fear humans is not something learned. It has been handed down in the flock for generations. Akka teaches it to the young geese.`,
            `Count the things Nils does in that flock. He drives off the fox, puts out the fire in front of the bear's den, and leads away the rats. Having hands and being able to reckon becomes useful in that flock.`,
            `So Nils being human was a flaw and a use at the same time. The book sets the two side by side.`,
            `The passage where the rats are driven away is taken from 'The Pied Piper of Hamelin,' a tale told in Germany. Lagerlöf knew that story well, and she used it on purpose.`,
            `The Piper of Hamelin, when he was not paid, took the children too. Nils took no payment at all. Even with the same pipe in hand, a different person makes it a different thing.`,
            `Third, read the passage about Vineta again. It is the story of an old city that sank beneath the sea and appears once in a hundred years.`,
            `And for that city to come back to life, somebody must buy one thing there. Nils has no money. So the city vanishes.`,
            `That passage is the strangest in the book and the one that stays longest. Nils did nothing wrong. Only, at that moment, he had no coin.`,
            `Some things simply happen, with no regard to right and wrong. This book shows children that too.`,
            `And look again at the faces of the people of that city who crowded round Nils. They were not the faces of people selling goods, but of people begging for their lives.`,
            `Nils understands why only later, and cries all night. He cries not for himself but for those people.`,
            `Vineta, the sunken city, is an old tale long told along the shores of the Baltic Sea. Lagerlöf took it and put it into this book.`,
            `Fourth, look again at the passage about the bear's den. Nils is caught by a bear. And the bear, about to kill him, stops.`,
            `Look at the reason. It is because Nils pressed out with his hands the fuse of the charge the people had set at the mouth of the den. So even with that fearful animal, an account could be settled.`,
            `But the bear does not thank Nils. She only lets him go.`,
            `There is hardly a thank-you or a sorry anywhere. When the account is settled, that is the end. Lagerlöf was careful not to make her animals into people.`,
            `So the animals in this book each move by their own circumstances. When they are hungry they hunt, and when they have young they guard them. That is not measured by a human yardstick.`,
            `So in this book there are no good animals and bad animals. The fox, too, has cubs to feed.`,
            `Fifth, read the last chapter again. There was a set price for Nils to become human again. And what that price was is the knot of this book.`,
            `Once he knows the price, Nils hesitates. Between wanting to be human and being unable to pay.`,
            `And look at what he does. What the book has been trying to say through eleven chapters is in that one place.`,
            `The price of Nils going back to being human was to make one of the friends he had travelled with small in his place. So Nils had to choose between being human and keeping his friends.`,
            `That choice is the last chapter of the book. And what Nils says at that moment is the shortest thing in the book.`,
            `And that last chapter is very short. A story that has run for eleven chapters ends in a few pages.`,
            `And in that last chapter Nils is standing in the farmyard again. He has come back to the place he left. But the boy standing there is not the boy who left.`,
            `There are characters worth a second look as well.`,
            `Look again at Morten the farm goose. He was a goose that did not know how to fly. But when the wild geese pass over, he flies up after them.`,
            `And he follows the flock to the far end of Sweden. A farm goose with short wings and a heavy body does that. That goose is the one who tries hardest in the whole book.`,
            `And on that journey Morten finds a mate and has young. Had he stayed a farm goose, that would never have happened. It is not only Nils who changed.`,
            `And at the end Morten takes his mate and young and rises into the sky again. He could have stayed a farm goose, and he does not. The book does not explain that choice either.`,
            `Smirre the fox is worth noting too. He is the animal on the opposite side in this book. But the book does not paint him only as wicked.`,
            `The fox chases the geese because he is hungry. It is only that this story is told from the geese's side.`,
            `It helps to know something of the times. Sweden is a very long country from north to south. The south is farming plain, and the north is snow and forest.`,
            `And at the northern tip there is a place where the sun does not set in summer. The road Nils follows with the geese runs exactly from that south to that north.`,
            `In those days Sweden was a poor country. About a hundred years ago, more than a million Swedes left for America. At that time there were only about five million Swedes in all. One person in five had left the country.`,
            `That story is in this book too. Farms left empty, people going to board the ships. It was a book meant to teach children their country, and yet she wrote that in as well. Probably because she believed that showing only the good side of a country is not teaching.`,
            `And there are the people who work in the mines and the people who fell trees in the forests. She meant to show children what the people of each district did for a living.`,
            `The district that digs iron, the district that builds ships, the district that farms — they come one after another. So when you have read this book, you know what Sweden lives on.`,
            `That the wild geese go north in spring and come south in autumn is true to life as well. This book follows that road and goes once round Sweden.`,
            `And to each district is attached one of its old tales. So this book is a geography book and, at the same time, a collection of old Swedish tales.`,
            `So when you read this book, you learn what Swedes have told one another for a long time. Knowing the land and knowing the stories of the land go together.`,
            `What Lagerlöf gathered in her three years of travelling was exactly those stories. She asked the old people of each district and wrote them down.`,
            `This book holds on to two things.`,
            `One is how a person changes. Nils does not change because he is punished. He changes by living among the animals.`,
            `So this book does not teach by scolding. It changes the place a person stands in and lets him find out for himself. That is where the book shows that a village schoolteacher wrote it.`,
            `The other is the question of what learning really is. This book was made as a geography textbook. But what children learned from it was not only place names.`,
            `Lagerlöf later said something to this effect: if you want to teach children to love their country, you must first show them what the country looks like.`,
            `After it came out, this book was translated into many languages. It is not a common thing for a book made as a geography textbook to still be read a hundred and twenty years later.`,
            `Lagerlöf published several more books afterwards, and in 1909 she received the Nobel Prize for Literature. It was the first Nobel Prize for Literature given to a woman. And the first given to a Swede. Later she also became a member of the Swedish Academy, which awards the prize. That, too, was a first for a woman.`,
            `If you ever read this book again, this time follow only Morten. Count why that goose flew up, and why he came home.`,
            `Lastly, here are some things to think about. I shall not write down the answers.`,
            `Can Nils being shrunk be called only a punishment? Had he not shrunk, what would that boy have learned?`,
            `Can Vineta's not coming back to life be called Nils's fault? He had no coin at the time.`,
            `And how should we look at what Nils did once he knew the price of being human again? That question is not easy to answer even when you read this book again as a grown-up.`
        ]
    },
    quiz: [
        { q: 'Why did Nils shrink?', choices: ['He caught the tomte and got greedy', 'He slept instead of reading ten pages of the Bible', 'He fell while chasing the geese'], answer: 0 },
        { q: 'What new ability did the shrunken Nils gain?', choices: ['His body became light enough to fly', 'He could understand what animals said', 'He could see well in the dark'], answer: 1 },
        { q: 'What was the name of the goose that carried Nils away?', choices: ['Morten', 'Akka', 'Dunfin'], answer: 0 },
        { q: 'Who was the leader of the flock of wild geese?', choices: ['Morten of Skåne', 'Akka of Kebnekaise', 'Dunfin of Lapland'], answer: 1 },
        { q: 'Why did Akka decide to take Nils along?', choices: ['Because Morten begged her to the last', 'Because he could pass on what humans said', 'Because he saved a goose the fox had caught'], answer: 2 },
        { q: 'How did Nils drive the rats out of Glimminge Castle?', choices: ['With an old wooden pipe he found in the cellar', 'By letting a cat loose in the castle', 'By opening an underground channel and flooding it'], answer: 0 },
        { q: "Which old tale was Nils's driving out of the rats exactly like?", choices: ['The Pied Piper of Hamelin', 'The animals of the Bremen Town Musicians', 'The story of Puss in Boots'], answer: 0 },
        { q: 'What is the rule of the gathering on Kullaberg?', choices: ['Only the birds come out to compete that day', 'No human climbs the mountain that day', 'For that one day nobody eats anybody'], answer: 2 },
        { q: 'What sentence did Smirre the fox receive for breaking the rule?', choices: ['Banishment, and nobody would speak to him', 'To lose his life on the spot', 'To be shut in a den for a year'], answer: 0 },
        { q: 'Why could Nils not buy anything in the city that appeared at night?', choices: ['Because he did not know the language of that city', 'Because he did not have a single coin', 'Because the shops were about to close'], answer: 1 },
        { q: "What did Nils do at the bear's den?", choices: ['Carried a bear cub outside', 'Pressed out a fuse that was already lit', 'Shouted to warn the people'], answer: 1 },
        { q: 'What protected Nils in Karlskrona?', choices: ['The bronze statue of a king of long ago', 'The old guard who kept watch over the square', 'The old wooden statue of a sailor in front of the church'], answer: 2 },
        { q: 'For what purpose was this book originally written?', choices: ['As a Swedish geography textbook for schools', 'As a collection of old tales for children', 'As a record of the roads the wild geese fly'], answer: 0 },
        { q: 'What made Nils human again?', choices: ['He met the tomte again and begged forgiveness', 'For the first time he thought what he could do as a human', 'He went to Lapland and came safely home'], answer: 1 },
        { q: 'Once he was human, what was the first thing Nils asked of his father?', choices: ['Mother, Father, I am sorry', 'Where have I been all this time', 'Let those geese go'], answer: 2 },
        { q: 'What did Nils lose once he was human again?', choices: ['The gift of flying on the clouds', 'All the memories of his childhood', 'Understanding what animals say'], answer: 2 },
        { q: 'Which of these is NOT a fair thing to say after reading this book?', wide: true, choices: ['Seeing how Nils grabbed Morten’s neck as he flew up because he was worrying about the winter, one goose counted for that much in that house.', 'Seeing how Nils told Akka he did not know whether he wanted to be human again, he had forgotten his home and his mother.', 'Seeing how the price of being human again was losing Morten, Nils had to choose between being human and keeping his friend.', 'Seeing how a boy who tormented animals rode on an animal’s back and saw his whole country, there are things you can see only once you are small.'], answer: 1 }
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
    emoji: '🦢',
    art: ['end.webp'],
    paras: [
        `이 책의 원래 제목은 『닐스 홀게르손의 신기한 스웨덴 여행』입니다. 나라 이름이 제목에 들어 있습니다. 그것이 이 책이 지어진 까닭과 이어져 있습니다.`,
        `쓴 사람은 스웨덴의 셀마 라겔뢰프입니다. 본디 시골 학교 선생이었습니다. 그리고 나중에 여자로서는 처음으로 노벨 문학상을 받았습니다.`,
        `그가 이름을 얻은 것은 서른셋에 낸 첫 소설로부터입니다. 그때까지 열 해 넘게 시골 학교에서 아이들을 가르쳤습니다. 밤에 글을 썼습니다.`,
        `그 첫 소설은 자기 고향에 전해 오던 옛이야기들을 엮은 것이었습니다. 그러니 그는 처음부터 옛이야기를 모아 쓰는 사람이었습니다. 『닐스』도 그 방식으로 지었습니다.`,
        `이 책이 나온 사연이 특이합니다. 스웨덴의 교사 모임에서 그에게 부탁을 했습니다. 아이들에게 스웨덴의 땅과 고장을 가르칠 교과서를 하나 써 달라는 것이었습니다. 그러니 이 책은 처음부터 지리 교과서로 만들어진 책입니다.`,
        `부탁을 받고 나서 삼 년을 미뤘습니다. 어떻게 써야 할지 몰라서였습니다. 그러다 아이를 작게 만드는 생각이 떠올랐다고 합니다.`,
        `그 무렵 라겔뢰프는 이미 이름난 작가였습니다. 그런 사람이 교과서를 맡은 것도 드문 일이었습니다.`,
        `그리고 그는 교과서라는 말에 갇히지 않았습니다. 지명과 숫자를 외우게 하는 대신 아이 하나를 그 위로 날려 보냈습니다.`,
        `그는 세 해 동안 스웨덴 곳곳을 돌아다녔습니다. 고장마다 다니며 지형과 살림과 옛이야기를 모았습니다. 그러고 나서 이 이야기를 지었습니다.`,
        `라겔뢰프는 어릴 때 다리를 앓아 한동안 걷지 못했습니다. 그래서 방에 앉아 책을 읽고 옛이야기를 들으며 자랐습니다.`,
        `그 아이가 자라서 나라를 다 돌아다니고 하늘에서 내려다보는 이야기를 썼습니다. 걷지 못하던 아이가 쓴 여행기인 셈입니다.`,
        `그리고 아이를 작게 만들어 거위 등에 태웠습니다. 그래야 나라 전체를 위에서 내려다볼 수 있기 때문입니다. 지리를 가르치는 데 그보다 좋은 방법이 없었습니다.`,
        `그리고 아이를 작게 만든 데는 다른 뜻도 있습니다. 작아지면 짐승들과 눈높이가 맞습니다. 그러면 사람이 세상의 가운데가 아니게 됩니다.`,
        `높은 데서 보면 강이 어디로 흐르고 산이 어디에 있는지가 한눈에 들어옵니다. 그리고 그 아래에 사람들이 무엇을 하고 사는지도 보입니다.`,
        `책은 1906년과 이듬해에 두 권으로 나왔습니다. 그리고 실제로 스웨덴 학교에서 오래 교과서로 썼습니다.`,
        `쉰 해 넘게 그랬습니다. 그러니 스웨덴 사람 여러 세대가 이 책으로 자기 나라를 배웠습니다.`,
        `교과서로 만든 책이 그렇게 오래 쓰이는 일은 드뭅니다. 재미있었기 때문입니다. 아이들이 숙제로 읽지 않고 그냥 읽었습니다.`,
        `지금도 스웨덴에서는 이 책이 특별합니다. 예전 스웨덴 돈에 라겔뢰프의 얼굴과 거위를 탄 닐스가 함께 그려져 있었습니다.`,
        `이십 크로나짜리 지폐였습니다. 앞면에 라겔뢰프가 있고 뒷면에 기러기를 탄 닐스가 있었습니다. 지어낸 아이가 나라 돈에 들어간 셈입니다.`,
        `지금은 그 지폐가 쓰이지 않습니다. 다만 스웨덴 사람들은 지금도 그 그림을 기억합니다.`,
        `그리고 스웨덴에는 이 책의 길을 따라가는 여행 코스도 있습니다. 닐스가 기러기를 타고 지난 고장들을 차례로 도는 길입니다.`,
        `학교에서는 이 책을 읽으면서 지도를 함께 폈습니다. 기러기가 지나는 고장을 하나씩 짚어 가는 식이었습니다.`,
        `그리고 그 길 위의 마을들에는 닐스와 기러기를 새긴 표지가 서 있습니다. 지어낸 아이가 그 나라의 길잡이가 된 셈입니다.`,
        `이제 다시 볼 대목을 짚어 봅시다.`,
        `첫째, 첫 장을 다시 읽어 보십시오. 닐스는 게으르고 짐승을 괴롭히는 아이였습니다. 그러다 요정을 붙잡아 놀리려다 작아집니다.`,
        `그런데 작아진 것이 벌이기만 한 것은 아닙니다. 작아지고 나서 닐스는 짐승들의 말을 알아듣게 됩니다. 그리고 그동안 자기가 무슨 짓을 했는지 알게 됩니다.`,
                `그러니 이 책의 벌은 벌이면서 동시에 기회입니다. 라겔뢰프는 그 둘을 갈라 놓지 않았습니다.`,
        `농장의 짐승들이 그에게 하는 말을 들어 보십시오. 고양이도 소도 거위도 그동안 있었던 일을 하나하나 셉니다. 닐스는 그것을 다 잊고 있었습니다. 당한 쪽만 기억한다는 것을 이 대목이 보여 줍니다.`,
        `그리고 그 짐승들은 닐스가 작아진 것을 고소해합니다. 이 책은 그것도 그대로 적습니다.`,
        `그런데 그 짐승들도 닐스를 아주 해치지는 않습니다. 그동안 함께 산 것도 사실이기 때문입니다.`,
        `고양이만 한 번 크게 화를 냅니다. 꼬리를 밟힌 일이 여러 번 있었기 때문입니다. 그런데 그 고양이도 결국 닐스를 놓아 줍니다.`,
        `둘째, 아카를 다시 보십시오. 기러기 무리를 이끄는 늙은 우두머리입니다. 닐스를 처음에는 아주 못마땅해합니다.`,
        `그 길을 몇십 번 다닌 새입니다. 그래서 어디에 쉴 데가 있고 어디에 총을 든 사람이 있는지를 다 압니다.`,
        `그 앎이 무리를 살립니다. 그러니 그 무리에서 제일 값나가는 것은 힘이 아니라 오래 다닌 기억입니다.`,
        `그리고 조건을 겁니다. 쓸모가 있으면 두겠다는 것입니다. 그러니 닐스는 무리에 값을 치르며 끼어 있는 셈입니다.`,
        `그리고 아카는 닐스를 끝까지 어렵게 대합니다. 사람이기 때문입니다. 그 무리에게 사람은 총을 든 것들이었습니다.`,
        `기러기가 사람을 무서워하는 것은 배워서 아는 것이 아닙니다. 무리에서 대대로 전해진 것입니다. 아카는 그것을 어린 기러기들에게 가르칩니다.`,
        `그 무리에서 닐스가 하는 일을 세어 보십시오. 여우를 쫓고, 곰 굴 앞의 불을 끄고, 쥐 떼를 몰아냅니다. 손이 있고 셈을 할 줄 아는 것이 그 무리에서 쓸모가 됩니다.`,
        `그러니 닐스가 사람이라는 것이 흠이면서 동시에 쓸모였습니다. 이 책은 그 둘을 나란히 놓아 둡니다.`,
        `쥐 떼를 몰아내는 대목은 독일에 전해 오는 '하멜른의 피리 부는 사나이'에서 가져온 것입니다. 라겔뢰프는 그 이야기를 잘 알고 있었고, 일부러 가져다 썼습니다.`,
        `하멜른의 사나이는 값을 못 받자 아이들까지 데려갔습니다. 닐스는 아무 값도 받지 않았습니다. 같은 피리를 들어도 쓰는 사람이 다르면 다른 것이 됩니다.`,
        `셋째, 비네타 대목을 다시 읽어 보십시오. 바닷속으로 가라앉은 옛 도시가 백 년에 한 번 나타난다는 이야기입니다.`,
        `그리고 그 도시가 다시 살아나려면 누군가 그곳에서 물건을 하나 사야 합니다. 닐스는 돈이 없습니다. 그래서 도시가 사라집니다.`,
        `그 대목은 이 책에서 제일 이상하고 제일 오래 남는 자리입니다. 닐스는 아무 잘못도 하지 않았습니다. 다만 그때 그에게 동전이 없었을 뿐입니다.`,
        `어떤 일은 옳고 그름과 상관없이 그냥 그렇게 됩니다. 이 책은 그것도 아이들에게 보여 줍니다.`,
        `그리고 닐스를 둘러싸던 그 도시 사람들의 얼굴도 다시 보십시오. 물건을 팔려는 얼굴이 아니라 살려 달라는 얼굴이었습니다.`,
        `닐스는 그 까닭을 나중에야 알고 밤새 웁니다. 자기 때문이 아니라 그 사람들 때문에 운 것입니다.`,
        `가라앉은 도시 비네타는 발트해 바닷가에 오래 전해 오던 옛이야기입니다. 라겔뢰프가 그것을 가져다 이 책에 넣은 것입니다.`,
        `넷째, 곰의 굴 대목을 다시 보십시오. 닐스가 곰에게 잡힙니다. 그리고 곰이 그를 죽이려다 그만둡니다.`,
        `그 까닭을 보십시오. 사람들이 굴 앞에 놓은 화약의 심지를 닐스가 손으로 눌러 껐기 때문입니다. 그러니 그 무서운 짐승과도 셈이 통했습니다.`,
        `다만 곰은 닐스에게 고맙다고 하지 않습니다. 그저 보내 줄 뿐입니다.`,
        `고맙다는 말도, 미안하다는 말도 거의 없습니다. 셈이 맞으면 그것으로 끝입니다. 라겔뢰프는 짐승을 사람으로 만들지 않으려고 조심했습니다.`,
        `그래서 이 책의 짐승들은 저마다 자기 사정으로 움직입니다. 배가 고프면 사냥하고, 새끼가 있으면 지킵니다. 그것을 사람의 잣대로 재지 않습니다.`,
        `그래서 이 책에는 착한 짐승과 나쁜 짐승이 따로 없습니다. 여우도 자기 새끼를 먹여야 합니다.`,
        `다섯째, 마지막 장을 다시 읽어 보십시오. 닐스가 다시 사람이 되는 값이 정해져 있었습니다. 그리고 그 값이 무엇이었는지가 이 책의 매듭입니다.`,
        `닐스는 그 값을 알고 나서 망설입니다. 사람이 되고 싶은 마음과, 그 값을 치를 수 없다는 마음 사이에서요.`,
        `그리고 그가 어떻게 하는지를 보십시오. 이 책이 열한 장을 들여 하려던 말이 그 한 자리에 있습니다.`,
        `닐스가 사람으로 돌아가는 값은 자기 대신 함께 다닌 벗 가운데 하나를 작게 만드는 것이었습니다. 그러니 닐스는 사람이 되는 것과 벗을 지키는 것 가운데 하나를 골라야 했습니다.`,
        `그 선택이 이 책의 마지막 장입니다. 그리고 그때 닐스가 하는 말이 이 책에서 제일 짧습니다.`,
                `그리고 그 마지막 장은 아주 짧습니다. 열한 장을 달려온 이야기가 몇 쪽으로 끝납니다.`,
        `그리고 그 마지막 장에서 닐스는 다시 집 마당에 서 있습니다. 떠난 자리로 돌아온 것입니다. 그런데 그 자리에 선 아이가 떠날 때의 아이가 아닙니다.`,
        `인물도 다시 보아야 할 자리가 있습니다.`,
        `모르텐이라는 집거위를 다시 보십시오. 그 거위는 날 줄 모르는 거위였습니다. 그런데 야생 기러기들이 지나가자 따라 날아오릅니다.`,
        `그리고 무리를 따라 스웨덴 끝까지 갑니다. 날개가 짧고 몸이 무거운 집거위가 그렇게 합니다. 그 거위가 이 책에서 제일 애쓰는 인물입니다.`,
        `그리고 모르텐은 그 여행에서 짝을 만나 새끼를 얻습니다. 집거위로 남았으면 없었을 일입니다. 닐스만 달라진 것이 아닙니다.`,
        `그리고 모르텐은 마지막에 짝과 새끼들을 데리고 다시 하늘로 올라갑니다. 집거위로 남을 수도 있었는데 그렇게 하지 않습니다. 그 선택도 이 책은 설명하지 않습니다.`,
        `여우 스미레도 짚어 둘 만합니다. 이 책의 반대편에 선 짐승입니다. 그런데 이 책은 그 여우를 나쁘게만 그리지 않습니다.`,
        `여우는 배가 고파서 기러기를 쫓는 것입니다. 다만 이 이야기가 기러기 쪽에서 이야기하는 것뿐입니다.`,
        `그 시절 사정도 알아 두면 좋습니다. 스웨덴은 남북으로 아주 긴 나라입니다. 남쪽은 농사짓는 평야이고 북쪽은 눈과 숲입니다.`,
        `그리고 북쪽 끝에는 여름에 해가 지지 않는 곳이 있습니다. 닐스가 기러기를 따라가는 길이 바로 그 남쪽에서 북쪽까지입니다.`,
        `그 시절 스웨덴은 가난한 나라였습니다. 백 년쯤 전에 스웨덴 사람이 백만 명 넘게 미국으로 떠났습니다. 그때 스웨덴 사람이 다 해서 오백만 명쯤이었습니다. 다섯 사람 가운데 하나가 나라를 떠난 셈입니다.`,
        `이 책에도 그 이야기가 나옵니다. 사람이 떠나 빈 농장, 배를 타러 가는 사람들이 나옵니다. 아이들에게 나라를 가르치려던 책인데 그런 것도 함께 적어 두었습니다. 나라의 좋은 데만 보여 주는 것이 가르치는 것이 아니라고 여겼기 때문일 것입니다.`,
        `그리고 광산에서 일하는 사람들, 숲에서 나무를 베는 사람들도 나옵니다. 그 고장 사람들이 무엇을 하고 사는지를 아이들에게 보여 주려던 것입니다.`,
        `쇠를 캐는 고장, 배를 만드는 고장, 농사짓는 고장이 차례로 나옵니다. 그러니 이 책을 다 읽으면 스웨덴이 무엇으로 먹고사는 나라인지를 알게 됩니다.`,
        `기러기가 봄에 북쪽으로 가고 가을에 남쪽으로 오는 것도 실제 그대로입니다. 이 책은 그 길을 따라가면서 스웨덴을 한 바퀴 돕니다.`,
        `그리고 고장마다 그 고장의 옛이야기가 하나씩 붙습니다. 그러니 이 책은 지리책이면서 동시에 스웨덴 옛이야기 모음이기도 합니다.`,
        `그래서 이 책을 읽으면 스웨덴 사람들이 무엇을 오래 이야기해 왔는지를 알게 됩니다. 땅을 아는 것과 그 땅의 이야기를 아는 것이 함께 갑니다.`,
        `라겔뢰프가 세 해 동안 돌아다니며 모은 것이 바로 그 이야기들입니다. 그 고장 노인들에게 물어 적어 온 것입니다.`,
        `이 책이 붙들고 있는 것은 두 가지입니다.`,
        `하나는 사람이 어떻게 달라지느냐는 것입니다. 닐스는 벌을 받아서 달라진 것이 아닙니다. 짐승들 사이에서 살아 보고 달라집니다.`,
        `그러니 이 책은 야단쳐서 가르치지 않습니다. 자리를 바꾸어 놓고 스스로 알게 합니다. 그것이 시골 학교 선생이 쓴 책다운 데입니다.`,
        `다른 하나는 무엇을 배우는 것이 배우는 것이냐는 것입니다. 이 책은 지리 교과서로 만들어졌습니다. 그런데 아이들이 이 책에서 배운 것은 지명만이 아니었습니다.`,
        `라겔뢰프는 나중에 이런 뜻의 말을 했습니다. 아이들에게 나라를 사랑하라고 가르치려면 그 나라가 어떻게 생겼는지부터 보여 주어야 한다고요.`,
        `이 책이 나온 뒤 여러 나라 말로 옮겨졌습니다. 지리 교과서로 만든 책이 백이십 년 뒤에도 읽히는 것은 흔한 일이 아닙니다.`,
        `라겔뢰프는 그 뒤로도 여러 권을 냈고, 1909년에 노벨 문학상을 받았습니다. 여자로서는 처음 받는 노벨 문학상이었습니다. 그리고 스웨덴 사람으로도 처음이었습니다. 뒤에는 그 상을 주는 스웨덴 학술원의 회원도 되었습니다. 그것도 여자로서는 처음이었습니다.`,
        `언젠가 이 책을 다시 읽게 되거든, 이번에는 모르텐만 따라가며 읽어 보십시오. 그 거위가 왜 날아올랐는지, 그리고 왜 돌아왔는지를 세어 보십시오.`,
        `마지막으로 생각해 볼 것을 남겨 둡니다. 답은 적어 두지 않겠습니다.`,
        `닐스가 작아진 것을 벌이라고만 할 수 있을까요? 작아지지 않았으면 그 아이는 무엇을 배웠을까요?`,
        `비네타가 다시 살아나지 못한 것을 닐스의 잘못이라고 할 수 있을까요? 그때 그에게는 동전이 없었습니다.`,
        `그리고 다시 사람이 되는 값을 알고 나서 닐스가 한 일을 우리는 어떻게 보아야 할까요. 이 물음은 어른이 되어 다시 읽어도 답하기가 쉽지 않습니다.`
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
    title: `닐스의 이상한 여행`,
    tag: `셀마 라겔뢰프 원작`,
    intro: [
        `짐승 괴롭히기를 일삼던 열네 살 닐스가 손바닥만 하게 작아집니다. 그리고 집거위 모르텐의 등에 매달려 기러기 떼를 따라 스웨덴 끝까지 올라갑니다.`,
        `학교에서 쓸 지리 교과서로 시작한 책입니다. 닐스가 지나가는 산과 호수와 도시는 다 실제로 있는 곳입니다.`
    ]
};

function coverPage() {
    const cv = CV();
    return `<div class="page page-cover">
 <div class="story-page-left story-page-left-full">
 ${artFrame('cover.webp', '🪿')}
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
    { q: "닐스가 작아진 까닭은 무엇입니까?", choices: ["톰테를 잡아 놓고 욕심을 부려서", "성경을 열 쪽 읽지 않고 자서", "거위를 쫓아 몰다가 넘어져서"], answer: 0 },
    { q: "작아진 닐스에게 생긴 능력은 무엇입니까?", choices: ["몸이 가벼워 날 수 있게 되었다", "짐승의 말을 알아듣게 되었다", "어둠 속에서도 잘 보게 되었다"], answer: 1 },
    { q: "닐스를 태우고 날아간 거위의 이름은 무엇입니까?", choices: ["모르텐", "아카", "던핀"], answer: 0 },
    { q: "기러기 무리의 우두머리는 누구입니까?", choices: ["스코네의 모르텐", "케브네카이세의 아카", "라플란드의 던핀"], answer: 1 },
    { q: "아카가 닐스를 데려가기로 한 까닭은 무엇입니까?", choices: ["모르텐이 끝까지 부탁해서", "사람 말을 옮겨 줄 수 있어서", "여우에게 물린 기러기를 구해서"], answer: 2 },
    { q: "글리밍겐 성에서 닐스가 쥐를 몰아낸 방법은 무엇입니까?", choices: ["지하에서 찾은 오래된 나무 피리", "성 안에 고양이를 풀어놓은 것", "지하 물길을 터뜨려 물을 댄 것"], answer: 0 },
    { q: "쥐를 몰아낸 닐스의 일은 어느 옛이야기와 꼭 같았습니까?", choices: ["하멜른의 피리 부는 사나이", "브레멘 음악대의 짐승들", "장화 신은 고양이 이야기"], answer: 0 },
    { q: "쿨라베리 모임의 규칙은 무엇입니까?", choices: ["그날은 새들만 나와서 겨룬다", "그날은 사람이 산에 오르지 않는다", "그날 하루는 서로 잡아먹지 않는다"], answer: 2 },
    { q: "규칙을 어긴 여우 스미레가 받은 벌은 무엇입니까?", choices: ["쫓겨나고 아무도 말을 섞지 않는 것", "그 자리에서 목숨을 잃게 되는 것", "한 해 동안 굴에 갇혀 지내는 것"], answer: 0 },
    { q: "밤에 나타난 도시에서 닐스가 물건을 사지 못한 까닭은 무엇입니까?", choices: ["그 도시 말을 몰랐기 때문에", "동전 한 닢이 없었기 때문에", "가게가 곧 문을 닫았기 때문에"], answer: 1 },
    { q: "곰의 굴에서 닐스가 한 일은 무엇입니까?", choices: ["새끼 곰을 안고 밖으로 나왔다", "이미 불붙은 심지를 눌러 껐다", "사람들에게 소리쳐서 알렸다"], answer: 1 },
    { q: "카를스크로나에서 닐스를 지켜 준 것은 무엇입니까?", choices: ["청동으로 만든 옛날 왕의 상", "광장을 지키던 늙은 경비원", "교회 앞에 선 낡은 나무 뱃사람 상"], answer: 2 },
    { q: "이 책이 원래 어떤 목적으로 쓰였습니까?", choices: ["학교에서 쓸 스웨덴 지리 교과서", "아이들에게 읽힐 옛이야기 모음", "기러기가 다니는 길을 적은 기록"], answer: 0 },
    { q: "닐스가 다시 사람이 된 계기는 무엇입니까?", choices: ["톰테를 다시 만나 잘못했다고 빌었기 때문에", "사람이면 무엇을 할 수 있는지 처음 생각해서", "라플란드까지 갔다가 무사히 돌아왔기 때문에"], answer: 1 },
    { q: "사람이 된 닐스가 아버지에게 제일 먼저 한 부탁은 무엇입니까?", choices: ["어머니 아버지 잘못했어요", "저는 그동안 어디 있었어요", "저 거위들을 놓아 주세요"], answer: 2 },
    { q: "사람이 된 뒤 닐스가 잃은 것은 무엇입니까?", choices: ["구름을 타고 나는 재주", "어릴 때의 기억 전부", "짐승의 말을 알아듣는 것"], answer: 2 },
    { q: "이 책을 읽고 난 반응으로 알맞지 않은 것은 무엇인가요?", wide: true, choices: ["닐스가 날아오르는 모르텐의 목을 붙잡은 것이 겨울 살림 걱정이었던 것을 보면, 그 집에서 거위 한 마리가 그만큼 컸어.", "닐스가 아카에게 사람으로 돌아가고 싶은지 모르겠다고 한 것을 보면, 집과 어머니를 잊어버린 거야.", "사람으로 돌아가는 값이 모르텐을 잃는 것이었던 것을 보면, 닐스는 사람이 되는 것과 벗을 지키는 것 사이에서 골라야 했네.", "짐승 괴롭히기를 일삼던 아이가 짐승 등에 얹혀 나라를 돌아본 것을 보면, 작아져야 보이는 것이 있구나."], answer: 1 }
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
