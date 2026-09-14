const BOOK_TITLE = "아라비안나이트";

const CHAPTER_LABEL = () => '';

const CHAPTERS = [
    {
        num: 1,
        title: "천 하룻밤을 벌다",
        emoji: "🌙",
        art: ["story-01-a.webp", "story-01-b.webp"],
        paras: [
            `아주 오랜 옛날, 페르시아에 샤리아르라는 왕이 있었습니다. 젊고, 힘이 세고, 나라를 잘 다스리던 왕이었습니다. 백성이 그 왕을 따랐습니다. 그런데 어느 해에 왕은 크게 배신을 당했습니다. 그 일로 왕의 마음이 아주 상했습니다. 상한 마음을 어디에도 털어놓지 않았습니다. 왕이라 털어놓을 사람이 없었습니다. 높은 자리에 앉으면 옆에 사람이 많아도 말할 데가 없어집니다. 다들 왕이 듣고 싶어 하는 말만 하기 때문입니다.`,
            `가장 가까운 사람에게 속은 것입니다. 믿었던 만큼 크게 무너졌습니다. 작게 믿었으면 작게 무너졌을 것입니다. 그런데 크게 믿지 않고 사는 방법도 없습니다. 그 뒤로 왕이 달라졌습니다. 왕은 이렇게 생각했습니다.`,
            `'사람은 아무도 믿을 수 없다. 그러니 정을 붙이기 전에 끝내면 된다.' 그때부터 왕은 무서운 일을 시작했습니다. 날마다 새로 혼인을 하고, 이튿날 아침이면 그 사람의 목숨을 빼앗았습니다.`,
            `삼 년이 지났습니다. 그 세 해 동안 목숨을 잃은 사람이 천 명이 넘었습니다. 나라 안에 딸을 가진 집이 남지 않았습니다. 다들 딸을 데리고 다른 나라로 달아났기 때문입니다. 밤에 짐을 싸서 성문을 빠져나갔습니다. 낮에 나가면 눈에 띄기 때문입니다. 그렇게 빠져나간 집이 하루에 몇 집씩이었습니다. 장이 서던 자리가 비고 가게가 문을 닫았습니다.`,
            `그 일을 맡아 하던 것은 재상<span class="gloss">(왕을 돕는 가장 높은 신하)</span>이었습니다. 재상은 날마다 왕에게 사람을 데려가야 했습니다. 그 일을 세 해 동안 했습니다. 밤마다 잠을 이루지 못하는 사람이 되었습니다. 그 재상에게 딸이 둘 있었습니다. 큰딸은 셰에라자드, 작은딸은 두냐자드였습니다.`,
            `셰에라자드는 책을 아주 많이 읽은 사람이었습니다. 재상의 집에 모아 둔 책을 다 읽었습니다. 역사와 시와 옛이야기를 천 가지도 넘게 알고 있었습니다. 한 번 읽은 것은 잊지 않았습니다. 어느 대목에서 끊어야 사람이 궁금해하는지도 알고 있었습니다. 그것은 책에 적혀 있지 않은 것이었습니다. 이야기를 많이 아는 것과 이야기를 잘하는 것은 다릅니다. 셰에라자드는 그 둘을 다 가진 사람이었습니다.`,
            `어느 날 셰에라자드가 아버지에게 말했습니다.<br>"아버지, 저를 왕께 보내 주십시오."`,
            `재상은 그 말을 듣고 자리에서 일어섰습니다.<br>"무슨 소리를 하는 거냐."<br>"이 일을 끝내야 합니다."<br>"너까지 잃으라는 말이냐."<br>"아버지, 지금까지 몇 사람이 갔습니까."`,
            `재상은 대답하지 못했습니다.<br>셰에라자드가 말했습니다.<br>"저는 방법이 있습니다."`,
            `재상은 여러 날 말렸습니다. 울면서도 말리고 화를 내면서도 말렸습니다. 그런데 딸은 뜻을 굽히지 않았습니다. 밥을 먹으면서도 그 말만 했습니다. 딸이 무엇을 하려는지 재상은 그때 알지 못했습니다. 알았더라도 말렸을 것입니다. 재상은 딸에게 옛이야기를 하나 들려주며 말리기도 했습니다. 소 이야기와 나귀 이야기였습니다. 그런데 딸은 그 이야기의 뜻까지 되받아쳤습니다. 결국 셰에라자드가 궁으로 갔습니다.`,
            `가기 전에 동생에게 이렇게 일러 두었습니다.<br>"밤이 깊거든 나에게 이야기를 하나 해 달라고 해라."`,
            `그날 밤, 동생 두냐자드가 그렇게 했습니다.<br>"언니, 이야기를 하나 해 주세요."<br>셰에라자드가 왕에게 물었습니다.<br>"허락해 주시겠습니까."`,
            `왕은 그러라고 했습니다. 어차피 아침이면 끝날 일이라고 생각했습니다. 이야기 하나쯤 듣는다고 달라질 것이 없었습니다. 그것이 왕의 셈이었습니다. 그 셈이 그날 밤 처음으로 어긋났습니다. 어긋난 것을 왕 자신도 알아채지 못했습니다.`,
            `셰에라자드는 이야기를 시작했습니다. 그리고 이야기가 가장 재미있어지는 대목에서 멈췄습니다.<br>"날이 밝았습니다. 나머지는 다음에 하겠습니다."`,
            `왕은 그 뒷이야기가 궁금했습니다. 이야기가 하필 제일 궁금한 데서 끊겼기 때문입니다. 그래서 하루를 미루었습니다. 하루만 미루는 것이라고 스스로에게 말했습니다. 그 하루가 천 하룻밤이 됩니다.`,
            `이튿날 밤 셰에라자드는 그 이야기를 마쳤습니다. 왕은 끝까지 한마디도 하지 않고 들었습니다. 셰에라자드는 곧바로 다음 이야기를 시작했습니다. 그리고 또 재미있어지는 데서 멈췄습니다.`,
            `그렇게 하루가 이틀이 되고, 이틀이 열흘이 되고, 열흘이 한 해가 되었습니다. 그동안 궁 안에서는 아무도 그 이야기를 입에 올리지 않았습니다. 입에 올리면 왕이 정신을 차릴까 봐서였습니다. 다들 그 밤이 하루라도 더 이어지기를 바랐습니다. 그동안 나라 안에서 목숨을 잃은 사람이 하나도 없었습니다. 이야기 하나가 그 일을 한 것입니다. 그 밤들에 셰에라자드가 들려준 이야기는 이런 것들이었습니다.`
        ]
    },
    {
        num: 2,
        title: "항아리 속의 마신",
        emoji: "🏺",
        art: ["story-02-a.webp", "story-02-b.webp"],
        paras: [
            `가난한 어부가 하나 있었습니다. 그 어부에게는 규칙이 하나 있었습니다. 하루에 그물을 네 번만 던지는 것이었습니다. 네 번을 넘겨 욕심을 부리지 않겠다는 다짐이었습니다. 많이 던진다고 많이 잡히는 것도 아니었습니다. 잡히든 안 잡히든 그물을 걷어 어깨에 메고 돌아갔습니다. 그 규칙을 여러 해 지켰습니다. 바그다드 가까이의 바닷가에서 그물을 던졌습니다. 그날 잡은 것을 그날 장에 내다 팔았습니다.`,
            `어느 날 첫 번째 그물에 죽은 나귀가 걸려 올라왔습니다. 두 번째에는 모래가 가득 든 항아리가 올라왔습니다. 모래를 쏟아 내는 데만 한참이 걸렸습니다. 그물이 무거워 팔이 저렸습니다. 세 번째에는 깨진 그릇과 유리 조각이 올라왔습니다. 바닷가에 사람이 버린 것들이었습니다. 값나가는 것은 하나도 없었습니다. 그물만 여기저기 찢어졌습니다. 찢어진 데를 그 자리에서 기웠습니다. 손이 굳어 매듭이 잘 지어지지 않았습니다. 세 번을 던지고도 빈손이면 하루가 다 간 것입니다. 해가 벌써 기울고 있었습니다.`,
            `어부는 하늘을 보고 한숨을 쉬었습니다. 세 번을 헛되게 던진 날은 오랜만이었습니다. 그래도 규칙은 규칙이었습니다. 그리고 네 번째 그물을 던졌습니다. 멀리 던지려고 몸을 크게 돌렸습니다. 그물이 물에 닿는 소리가 났습니다. 이것마저 비면 빈손으로 돌아가야 했습니다. 집에서 아이들이 기다리고 있었습니다.`,
            `이번에는 놋쇠 항아리가 올라왔습니다. 입구가 납으로 막혀 있었고, 그 위에 도장이 찍혀 있었습니다. 놋쇠는 그것만으로도 값이 나갔습니다. 그러니 그날은 헛걸음이 아니었습니다. 어부는 '이 안에 무언가 값나가는 것이 들었겠지' 하고 막아 둔 납을 뜯었습니다. 그러자 안에서 연기가 쏟아져 나왔습니다.`,
            `연기가 하늘로 올라가 뭉치더니, 어마어마하게 큰 마신이 되었습니다. 머리가 구름에 닿고 발이 땅에 닿았습니다. 눈이 화로만 했습니다. 이가 바위 같았고 콧구멍에서 김이 났습니다. 그 김이 어부의 얼굴에 닿았습니다. 입을 열자 동굴 같았습니다. 목소리가 땅을 울렸습니다. 바닷가의 갈대가 다 누웠습니다. 물결이 뒤로 밀렸습니다. 어부는 다리에 힘이 빠졌습니다.`,
            `마신이 소리쳤습니다.<br>"준비해라. 나는 너를 죽이겠다."<br>"제가 당신을 꺼내 드렸는데요."<br>"그러니까 죽이겠다는 것이다."<br>어부는 그 말을 알아듣지 못했습니다. 구해 준 사람을 죽이겠다는 말이었기 때문입니다.`,
            `그리고 마신이 이런 이야기를 했습니다. 그는 옛날에 어느 왕의 명령을 어겨 그 항아리에 갇혔습니다. 납으로 봉하고 도장을 찍어 바다에 던진 것이었습니다. 그 왕은 마신도 다스릴 줄 아는 사람이었다고 합니다. 그 도장은 아무나 뜯을 수 없는 것이었습니다. 그 도장에는 힘 있는 왕의 이름이 새겨져 있었습니다. 그래서 사백 년을 그 안에 있었습니다. 항아리 안은 캄캄하고 좁았습니다. 몸을 연기로 바꾸어야 겨우 들어갈 자리였습니다. 첫 백 해 동안 그는 이렇게 생각했습니다.`,
            `'나를 꺼내 주는 자에게 세상의 모든 재물을 주겠다.' 아무도 오지 않았습니다. 두 번째 백 해 동안은 이렇게 생각했습니다. '나를 꺼내 주는 자에게 땅속의 보물을 다 알려 주겠다.' 아무도 오지 않았습니다. 세 번째 백 해 동안은 이렇게 생각했습니다.`,
            `'나를 꺼내 주는 자에게 소원을 세 가지 들어주겠다.' 아무도 오지 않았습니다. 백 년마다 마음이 한 번씩 내려앉은 셈입니다. 그리고 마지막 백 년에 그 마음이 뒤집혔습니다. 사백 년째에 그는 이렇게 생각했습니다. '이제 누가 나를 꺼내 주든, 나는 그자를 죽이겠다.'`,
            `어부는 그 이야기를 다 들었습니다. 그리고 벌벌 떨면서 이렇게 말했습니다.<br>"한 가지만 여쭙겠습니다. 정말 그렇게 큰 분이 이 작은 항아리에 들어가 계셨습니까?"<br>"그렇다."<br>"저는 못 믿겠습니다. 발 하나도 안 들어갈 것 같은데요."<br>어부는 그 말을 하면서 항아리를 슬쩍 발치로 당겼습니다. 손이 떨리는 것을 숨기려고 뒷짐을 졌습니다.`,
            `마신이 화를 냈습니다.<br>"내가 보여 주지."`,
            `그리고 다시 연기가 되어 항아리 속으로 들어갔습니다. 연기가 소용돌이치며 빨려 들어갔습니다. 머리가 먼저 들어가고 어깨가 들어갔습니다. 그러고도 한참이 남아 있었습니다. 어부는 그동안 뚜껑을 손에 쥐고 있었습니다. 처음부터 그것을 놓지 않고 있었던 것입니다. 어부는 그 순간 뚜껑을 눌러 닫았습니다.`,
            `"이제 도로 바다에 던지겠습니다."<br>안에서 마신이 사정했습니다.<br>"내가 잘못했다. 꺼내 주면 너를 부자로 만들어 주겠다."<br>"사백 년 동안 마음이 세 번 바뀌신 분을 제가 어떻게 믿습니까."`,
            `그런데 어부는 결국 그를 꺼내 주었습니다. 마신이 그 은혜를 갚겠다고 맹세했기 때문입니다. 이번에는 정말이라고 여러 번 말했습니다. 그리고 이번에는 이름을 걸고 맹세했습니다. 이름을 건 맹세는 마신도 어길 수 없었습니다. 어부는 그 말을 다 믿지는 않았습니다. 그래도 항아리를 다시 열어 주었습니다. 그리고 그 마신은 정말로 약속을 지켰습니다. 마신은 어부를 산 너머 호수로 데려가 빛깔이 고운 물고기를 잡게 했습니다. 어부는 그 물고기를 왕에게 바쳐 큰 상을 받았습니다.`,
            `어부는 그 뒤로 잘살았습니다. 다만 그물은 그대로 던졌다고 합니다. 하루에 네 번씩만 던졌습니다.`,
            `셰에라자드는 이 이야기를 마치고 왕을 보았습니다. 왕은 아무 말도 하지 않았습니다. 그런데 이 이야기가 무슨 이야기인지는 알아들었습니다. 항아리에 갇힌 것이 마신만은 아니었기 때문입니다. 왕도 삼 년째 무엇인가에 갇혀 있었습니다.`,
            `오래 미움에 잠겨 있으면 마음이 그렇게 바뀐다는 이야기였습니다. 기다리던 것이 오지 않으면 사람은 마음을 접습니다. 접다 보면 나중에는 반대쪽으로 갑니다. 왕이 세 해 동안 한 일이 바로 그것이었습니다. 셰에라자드는 그 말을 입 밖에 내지 않고 이야기로만 놓아 두었습니다.`
        ]
    },
    {
        num: 3,
        title: "알라딘과 요술 램프",
        emoji: "🪔",
        art: ["story-03-a.webp", "story-03-b.webp"],
        paras: [
            `어느 도시에 알라딘이라는 아이가 살았습니다. 아버지는 재봉사였는데 일찍 세상을 떠났습니다. 알라딘은 일을 배우지 않고 골목에서 놀기만 했습니다.`,
            `어머니가 실을 자아 팔아 겨우 먹고살았습니다. 밤이 늦도록 물레를 돌렸습니다. 그 소리를 들으며 알라딘은 잠들었습니다. 실을 하루 종일 자아야 밀가루를 조금 살 수 있었습니다. 어머니의 손끝이 늘 갈라져 있었습니다.`,
            `어느 날 낯선 사람이 알라딘을 찾아왔습니다.<br>"내가 네 아버지의 동생이다."`,
            `알라딘도 어머니도 그런 사람이 있다는 말을 들어 본 적이 없었습니다. 그런데 그 사람은 돈을 잘 썼습니다. 그리고 알라딘에게 좋은 옷을 사 주고, 가게를 차려 주겠다고 했습니다. 처음 보는 사람이 그렇게까지 하는 것이 이상한 일이었습니다. 그런데 가난한 집에서는 그런 것을 따져 볼 겨를이 없었습니다. 고맙다는 말이 먼저 나오게 되어 있습니다. 그것을 아는 사람이 그 사람이었습니다.`,
            `며칠 뒤 그 사람이 알라딘을 데리고 도시 밖으로 나갔습니다. 한참을 걸어 산 밑에 이르렀습니다. 그 사람이 땅에 무언가를 뿌리고 주문을 외웠습니다. 그러자 땅이 갈라지고 돌문이 나왔습니다. 알라딘은 그때 처음으로 무서워했습니다. 그런데 돌아갈 수도 없었습니다.`,
            `그 사람은 마법을 쓰는 사람이었습니다. 아주 멀리서 땅속에 숨겨진 낡은 램프 하나를 찾아 여기까지 온 것이었습니다. 그 문은 정해진 아이만 열 수 있었습니다. 그 사람에게 알라딘은 조카가 아니라 문을 여는 열쇠였습니다. 그러니 문만 열리면 그다음은 필요가 없었습니다. 그 램프를 얻으려고 여러 해를 준비한 사람이었습니다. 아이 하나를 속이는 것쯤은 아무것도 아니었습니다.`,
            `그 사람이 알라딘에게 일렀습니다.<br>"들어가라. 안에 뜰이 있고 나무가 있다. 아무것도 만지지 말고, 벽에 걸린 낡은 램프만 가지고 나와라."`,
            `그리고 반지를 하나 끼워 주었습니다.<br>"이건 지키는 반지다."`,
            `알라딘은 계단을 내려갔습니다. 안에는 정말로 뜰이 있었습니다. 나무에 열매가 달려 있었는데, 그 열매가 다 보석이었습니다. 빨간 것과 파란 것과 초록 것이 가지마다 달려 있었습니다. 알라딘은 그것이 유리인 줄 알았습니다. 보석을 본 적이 없는 아이였기 때문입니다. 그저 예뻐서 주머니에 넣은 것이었습니다.`,
            `알라딘은 그것을 주머니에 잔뜩 넣었습니다. 그리고 램프를 들고 계단으로 올라왔습니다. 그런데 짐이 무거워 마지막 계단을 오르지 못했습니다.`,
            `"손 좀 잡아 주십시오."<br>"램프를 먼저 던져라."<br>"손부터 잡아 주십시오. 저 혼자 못 올라갑니다."<br>"램프를 먼저 던지라니까!"`,
            `두 사람은 그렇게 실랑이를 했습니다. 그러다 그 사람이 화가 나서 주문을 외웠습니다. 조카라고 부르던 입으로 그렇게 했습니다. 램프를 못 받을 바에는 아이째 묻어 버리기로 한 것입니다. 그리고 문을 닫아 버렸습니다.`,
            `알라딘은 어둠 속에 갇혔습니다. 이틀 동안 알라딘은 그 안에서 울었습니다. 소리를 질러도 위에서는 들리지 않았습니다. 물도 없고 빛도 없었습니다. 이틀이면 사람이 견딜 수 있는 마지막쯤입니다. 그러다 손을 비비다가 반지를 문질렀습니다. 그러자 반지에서 무언가가 나왔습니다.<br>"주인님, 무엇을 원하십니까."`,
            `알라딘이 집에 가고 싶다고 하자, 반지에서 나온 마신이 알라딘을 땅 위로 올려 주었습니다. 집에 돌아와 그 낡은 램프를 어머니에게 보여 주었습니다. 어머니가 그것을 팔려고 닦았습니다. 그리고 그때 램프의 마신이 나왔습니다.`,
            `알라딘은 램프의 마신 덕분에 부자가 되었고, 그 나라 공주와 혼인했습니다. 마신은 하룻밤 사이에 두 사람이 살 궁전도 지어 주었습니다.`,
            `여러 해 뒤에 그 마법사가 알라딘이 잘사는 것을 알고 다시 왔습니다.`,
            `그리고 거리에서 이렇게 외쳤습니다.<br>"헌 램프를 새 램프로 바꿔 드립니다!"`,
            `그때 알라딘은 사냥을 나가 있었습니다. 공주가 그 소리를 듣고, 창고에 굴러다니는 낡은 램프를 내주었습니다. 그 램프가 무엇인지 몰랐기 때문입니다. 알라딘은 그것을 아내에게도 말하지 않았던 것입니다. 감춘 것이 지켜 준 것이 아니라 오히려 잃게 한 것입니다. 몰랐으니 잘못이라고 하기도 어렵습니다.`,
            `마법사가 그 램프를 문지르자 마신이 나왔습니다. 마법사는 공주가 있는 궁전을 통째로 먼 나라로 옮기게 했습니다. 알라딘은 반지의 마신에게 부탁해 공주가 있는 곳을 찾아갔고, 공주와 꾀를 내어 램프를 되찾았습니다. 그렇게 되찾기까지 아주 오래 걸렸습니다. 그리고 되찾은 뒤에 이렇게 말했다고 합니다.<br>"내가 이 램프 이야기를 미리 했더라면 이런 일은 없었을 것이오."`
        ]
    },
    {
        num: 4,
        title: "알리바바와 사십 인의 도적",
        emoji: "🗝️",
        art: ["story-04-a.webp", "story-04-b.webp"],
        paras: [
            `페르시아의 어느 마을에 형제가 살았습니다. 형 카심은 부자와 혼인해서 잘살았습니다. 장에 큰 가게를 하나 두고 있었습니다. 그러니 형제인데도 사는 자리가 아주 달랐습니다. 동생 알리바바는 나귀 세 마리로 나무를 해다 팔았습니다. 나무 한 짐을 지고 나가면 하루 먹을 것이 되었습니다. 그러니 나귀 세 마리가 그 집 재산의 전부였습니다.`,
            `어느 날 알리바바가 숲에서 나무를 하고 있는데 말발굽 소리가 났습니다. 알리바바는 나무 위로 올라가 숨었습니다. 말 탄 사람이 마흔 명이었습니다. 그 무리가 오는 소리를 알리바바가 먼저 들었습니다. 숲에서는 소리가 멀리서부터 옵니다. 하나하나 칼을 차고 있었습니다. 다들 짐을 잔뜩 싣고 있었습니다. 자루가 무거워 말이 힘들어했습니다. 자루 하나를 두 사람이 내려놓았습니다. 어디서 가져온 것인지는 물어보나 마나였습니다. 알리바바는 나뭇가지 사이로 숨을 죽이고 있었습니다. 나뭇잎이 흔들리기만 해도 들킬 자리였습니다.`,
            `그 무리의 우두머리가 바위 앞에 서서 말했습니다.<br>"열려라, 참깨."`,
            `그러자 바위가 갈라졌습니다. 바위에 문이 있었던 것이 아닙니다. 통째로 갈라졌다가 다시 붙는 것이었습니다. 사람들이 짐을 지고 안으로 들어갔습니다. 그리고 한참 뒤에 빈손으로 나왔습니다. 안에 무엇을 두고 나오는지는 보이지 않았습니다.`,
            `우두머리가 말했습니다.<br>"닫혀라, 참깨."`,
            `바위가 닫혔고, 무리가 떠났습니다. 말발굽 소리가 멀어지고도 알리바바는 한참을 더 있었습니다. 되돌아올까 봐서였습니다. 알리바바는 나무에서 내려왔습니다. 그리고 그 바위 앞에 서서 말해 보았습니다.<br>"열려라, 참깨."`,
            `바위가 갈라졌습니다. 안에는 굴이 있었습니다. 그 굴에 금과 은과 비단이 산더미처럼 쌓여 있었습니다. 천장이 높고 안이 넓었습니다. 등불도 없는데 어딘가에서 빛이 들어왔습니다. 수십 년 동안 모아 놓은 것이었습니다. 비단은 접힌 자리가 삭아 있었습니다. 오래 쌓아 두기만 하고 쓰지 않은 것이었습니다. 빼앗은 것은 쓰기가 어렵습니다. 값나가는 것을 장에 내놓으면 어디서 났느냐고 묻기 때문입니다.`,
            `알리바바는 금화를 자루에 담아 나귀에 실었습니다. 그런데 다 가져가지 않았습니다. 나귀 세 마리에 실을 만큼만 가져갔습니다. 더 실으면 나귀가 힘들고, 남이 보면 이상하게 여길 것이었습니다. 그것이 알리바바가 살아남은 까닭입니다. 그 굴에 들어갔다가 살아 나오지 못한 사람도 있었습니다.`,
            `집에 와서 아내가 그 금을 되<span class="gloss">(곡식의 양을 재는 그릇)</span>로 재려고 했습니다. 그런데 되가 없어서 형수네 집에서 빌려 왔습니다. 금화가 하도 많아 세는 것을 그만두고 되로 재기로 한 것입니다. 그것이 그 집이 저지른 하나뿐인 실수였습니다.`,
            `형수는 그 되에 몰래 밀랍<span class="gloss">(벌집에서 얻는 말랑한 덩어리)</span>을 발라 두었습니다. 바닥에 얇게 발라 두었습니다. 동생네가 무엇을 재는지 궁금했기 때문입니다. 가난한 집에서 되를 빌려 가는 것이 이상했던 것입니다. 곡식은 그 집에 있을 리가 없었습니다. 그러니 되를 빌려 간다는 것은 곡식이 생겼다는 뜻이었습니다. 되를 돌려받아 보니 밀랍에 금화가 하나 붙어 있었습니다. 형수는 그것을 손에 들고 한참을 보았습니다. 그러고는 남편에게 달려갔습니다.`,
            `형 카심이 동생을 불렀습니다.<br>"그 금이 어디서 났느냐."`,
            `알리바바는 사실대로 다 말했습니다. 그리고 그 굴을 함께 쓰자고 했습니다. 그것이 알리바바라는 사람이었습니다. 그런데 카심은 이튿날 새벽에 혼자 나귀 열 마리를 끌고 그리로 갔습니다.<br>"열려라, 참깨."`,
            `바위가 열렸습니다. 카심은 안에 들어가 자루에 금을 채웠습니다. 그리고 나오려는데 주문이 생각나지 않았습니다.<br>"열려라, 보리."<br>"열려라, 콩."`,
            `금을 눈앞에 두고 있는 동안 참깨라는 말이 머리에서 지워진 것입니다. 자루를 채우는 데 마음을 다 쓴 탓이었습니다. 나가는 길을 생각한 사람은 동생뿐이었습니다. 알리바바는 굴에 들어가면서 주문을 몇 번이나 되뇌었습니다. 형은 그것을 한 번도 되뇌지 않았습니다.`,
            `그날 도적들이 돌아왔습니다. 굴 앞에 나귀 열 마리가 매여 있었습니다. 그러니 안에 사람이 있다는 것을 모를 수가 없었습니다. 카심은 그 굴에서 나오지 못했습니다.`,
            `알리바바는 형이 돌아오지 않자 굴로 찾아가 형을 거두어 왔습니다. 도적들은 굴에 있던 사람이 사라진 것을 보고, 비밀을 아는 사람이 또 있다는 것을 알아챘습니다. 그 뒤 도적들은 그 마을을 뒤져 알리바바를 찾아냈습니다. 그리고 여러 번 그를 없애려고 했습니다. 그때마다 그것을 알아채고 막아 낸 사람이 있었습니다. 알리바바의 집에서 일하는 모르지아나라는 여자였습니다. 그 집에서 밥을 짓고 물을 긷던 사람입니다. 제일 눈이 밝은 사람이기도 했습니다.`,
            `도적들이 기름 항아리 서른일곱 개를 실은 장사꾼 행세를 하고 그 집에 들었을 때, 모르지아나는 기름을 뜨러 갔다가 항아리 안에서 사람 숨소리를 들었습니다. 모르지아나는 소리를 지르지 않았습니다. 소리를 질렀으면 그 자리에서 서른일곱이 쏟아져 나왔을 것입니다. 그것을 그 짧은 사이에 셈한 것입니다. 기름을 뜨러 간 것이 그날 밤 그 집을 살렸습니다. 등잔에 기름이 떨어져서 나간 걸음이었습니다.`,
            `그 대신 아무도 모르게 도적들을 막아 낼 방법을 썼습니다. 그날 밤 서른일곱 항아리에서는 아무도 나오지 못했습니다. 그리고 그날 밤 그 집에서는 아무 일도 일어나지 않았습니다.`,
            `그 집 사람들을 살린 것은 알리바바가 아니라 모르지아나였습니다. 알리바바는 나중에 그 사실을 알고, 모르지아나를 자기 아들과 혼인시키고 집안의 가족으로 삼았습니다. 그 무렵에 부리던 사람이 집안 식구가 되는 일은 흔하지 않았습니다. 그 소식을 듣고 마을 사람들이 제 일처럼 좋아했습니다. 그 사람들도 남의 집에서 일하는 사람이었기 때문입니다.`
        ]
    },
    {
        num: 5,
        title: "신드바드와 로크 새",
        emoji: "🥚",
        art: ["story-05-a.webp", "story-05-b.webp"],
        paras: [
            `바그다드에 신드바드라는 짐꾼이 살았습니다. 무거운 짐을 지고 다니며 먹고살았습니다. 등이 짐 모양대로 굽어 있었습니다. 바그다드는 그 시절 세계에서 제일 큰 도시였습니다. 장에 나갈 짐이 끝없이 오갔고, 그것을 지고 나르는 사람이 아주 많았습니다. 어느 더운 날, 그는 어느 큰 집 대문 앞에서 짐을 내려놓고 쉬었습니다. 안에서 음악 소리와 웃음소리가 났습니다. 고기 냄새도 담을 넘어왔습니다. 짐꾼은 아침부터 아무것도 먹지 못한 참이었습니다. 담벼락에 등을 대고 앉아 그 냄새를 맡았습니다.`,
            `짐꾼은 이렇게 중얼거렸습니다.<br>"어떤 이는 저 안에 있고 어떤 이는 이 밖에 있구나."`,
            `그 소리를 그 집 주인이 들었습니다. 주인은 그를 안으로 불러 밥을 먹이고 이름을 물었습니다. 그 집 주인의 이름도 신드바드였습니다. 일곱 번 바다에 나갔다가 돌아온 뱃사람 신드바드였습니다. 일곱 번 다 큰일을 겪고 돌아왔습니다. 그때마다 다시는 안 나가겠다고 했습니다.`,
            `주인이 말했습니다.<br>"자네 이름이 나와 같군. 그럼 내 이야기를 들어 보게."`,
            `그리고 그는 이런 이야기를 했습니다. 두 번째 항해 때의 일일세. 배가 어느 섬에 들렀네.`,
            `나는 뭍에 내려 나무 그늘에서 쉬다가 잠이 들었네. 깨어 보니 배가 없었네. 수평선까지 아무것도 없었네. 사람들이 나를 두고 떠난 것이네. 내가 없어진 것을 아무도 세어 보지 않은 것이네.`,
            `나는 섬을 돌아다녔네. 사람이 살던 자취는 하나도 없었네. 그러다 흰 둥근 것을 하나 보았네. 지붕만큼 컸네. 매끈하고 흠이 없었네. 두드려 보니 속이 빈 소리가 났네. 돌인가 하고 발로 차 보았네. 꿈쩍도 하지 않았네.`,
            `나는 그것이 무엇인지 한참 몰랐네. 그런데 해가 갑자기 어두워졌네. 한낮인데 그늘이 졌네. 하늘을 보니 새가 한 마리 내려오고 있었네.`,
            `구름을 가릴 만큼 큰 새였네. 로크라는 새라고 하네. 그 흰 것은 그 새의 알이었네. 그러니 그 새가 얼마나 큰지 알 만하지 않은가. 나는 그때 나무 뒤로 몸을 숨겼네. 다리 하나가 나무 둥치만 했네.`,
            `새가 알 위에 내려앉아 날개를 접었네. 나는 그때 이렇게 생각했네. 이 섬에 있으면 나는 굶어 죽네. 그래서 나는 터번을 풀어 그 새의 다리에 내 몸을 묶었네.`,
            `아침이 되자 새가 날아올랐네. 날개 소리가 천둥 같았네. 나는 구름 위로 올라갔네. 한참 뒤에 새가 어느 골짜기에 내려앉았네.`,
            `나는 줄을 풀고 뛰어내렸네. 그 골짜기 바닥에 무엇이 깔려 있었는지 아나. 다이아몬드였네. 그런데 그 골짜기에는 큰 뱀들이 살고 있었네. 몸통이 나무 둥치만 했네. 낮에는 굴에 들어가 있고 밤에 나왔네. 그래서 나는 밤에 바위 틈에 숨어 있었네. 나는 해가 있는 동안에만 움직였네.`,
            `그리고 절벽이 너무 높아 올라갈 수도 없었네. 나는 그 다이아몬드 위에 앉아 이렇게 생각했네. 세상에서 가장 값진 것 위에 앉아서 굶어 죽는구나. 그때 알았네. 값나가는 것과 쓸모 있는 것은 다르네.`,
            `그때 위에서 무언가가 떨어졌네. 커다란 고깃덩이였네. 그리고 또 하나 떨어졌네. 고깃덩이가 골짜기 여기저기에 떨어졌네. 위에서 던지는 것이었네.`,
            `나는 그것을 보고 알아챘네. 절벽 위의 사람들이 고기를 던져 넣고 있었네. 고기에 다이아몬드가 박히면, 독수리가 그것을 물고 올라가네. 그러면 위에서 그 고기를 빼앗는 것이네. 그렇게 하지 않으면 그 골짜기에 내려갈 길이 없기 때문이네. 그것을 생각해 낸 사람이 누구인지는 나도 모르네.`,
            `그래서 나는 자루에 다이아몬드를 담고, 그 고깃덩이에 내 몸을 묶었네. 그리고 독수리가 나를 물고 올라갔네.`,
            `절벽 위에서 사람들이 소리를 지르며 달려왔다가, 고기에 사람이 매달려 있는 것을 보고 얼어붙었네. 그 사람들은 여러 해 그 일을 했지만 그런 것은 처음이었네. 나는 그 자리에서 자루를 열어 보였네.`,
            `이야기가 끝나자 짐꾼 신드바드가 물었습니다.<br>"그렇게 무서운 일을 겪고 왜 또 나가셨습니까?"`,
            `뱃사람 신드바드가 웃었습니다.<br>"그러게 말일세. 그런데 뭍에 있으면 또 바다가 생각나네."<br>짐꾼은 그 말을 오래 생각했습니다. 그리고 그날부터 그 집에 자주 드나들게 되었다고 합니다.`
        ]
    },
    {
        num: 6,
        title: "바다의 노인",
        emoji: "🌊",
        art: ["story-06-a.webp", "story-06-b.webp"],
        paras: [
            `짐꾼 신드바드가 다시 찾아간 날, 뱃사람 신드바드는 또 이런 이야기를 했습니다. 다섯 번째 항해 때의 일일세. 이번에는 배가 폭풍에 부딪쳤네. 배가 부서져서 나 혼자 어느 섬에 닿았네. 널빤지 하나에 매달려 떠밀려 온 것이네. 함께 탄 사람들은 어디로 갔는지 모르네. 그 섬에는 물이 있고 열매가 있었네. 바나나 비슷한 것이 열려 있었네. 그래서 굶지는 않았네. 다만 사람이 하나도 없었네. 발자국 하나 없었네. 사람이 없는 데서 며칠을 지내 보면 알게 되네. 굶는 것보다 그것이 더 견디기 어렵네.`,
            `며칠 뒤 시냇가에서 노인을 하나 보았네. 사람을 보고 어찌나 반가웠는지 모르네. 아주 늙은 사람이었네. 수염이 하얗고 다리가 가늘었네. 그 노인이 손짓으로 나를 불렀네. 목소리는 내지 않았네. 그리고 자기를 업어서 저 개울을 건네 달라고 했네. 손짓만으로 그렇게 말했네. 말을 못 하는 사람인 줄 알았네. 나중에 보니 말을 안 한 것이었네.`,
            `나는 딱하게 여겨 그 사람을 업었네. 뼈만 남은 것처럼 가벼웠네. 개울을 건너 내려놓으려고 했네. 그런데 내려오지 않았네. 물이 무릎까지밖에 오지 않는 개울이었네. 업어 줄 것도 없는 개울이었네. 그러니 그 노인은 처음부터 개울을 건너려던 것이 아니었네. 업힐 자리를 찾고 있었던 것이네. 그것을 그때는 생각하지 못했네.`,
            `두 다리로 내 목을 감고 놓지 않았네. 그 다리에 힘이 어찌나 센지 목이 졸릴 지경이었네. 쇠고리를 채운 것 같았네. 떼어 내려고 손을 넣어 보았지만 손가락도 들어가지 않았네. 그때 나는 알았네. 그 다리는 늙은 다리가 아니었네. 그 가벼운 몸 어디에 그런 힘이 있었는지 모르네.`,
            `그때부터 그 노인은 내 등에서 내려오지 않았네. 내가 자면 등에서 자고, 내가 걸으면 발로 옆구리를 차서 방향을 시켰네. 내 등이 그 사람의 집이 된 것이네. 먹을 것도 내가 따야 했네. 그러면 그 사람이 위에서 손을 뻗어 가져갔네. 열매를 따라고 하면 따야 했고, 물을 뜨라고 하면 떠야 했네. 조금이라도 굼뜨면 옆구리를 걷어찼네. 나는 앉아서 자는 법을 배웠네.`,
            `그렇게 여러 달이 지났네. 날을 세는 것도 그만두었네. 나는 등이 굽고 다리가 떨렸네. 거울이 있었다면 나도 나를 못 알아보았을 걸세. 짐을 오래 지면 사람이 짐 모양으로 굽네. 자네도 짐을 져 보았으니 알 걸세. 목소리도 나오지 않게 되었네. 말을 할 일이 없었기 때문이네. 그러다 어느 날 나는 방법을 하나 생각해 냈네. 힘으로는 안 되니 다른 길을 찾은 것이네.`,
            `그 섬에는 커다란 조롱박이 열려 있었네. 나는 그것을 따서 속을 파냈네. 어른 머리만 한 조롱박이었네. 그리고 그 안에 포도를 짜 넣고 며칠 놓아두었네. 그 섬에는 포도가 아주 많았네. 골짜기마다 덩굴이 뻗어 있었네. 아무도 따 가지 않으니 그대로 익어 떨어졌네.`,
            `그것이 익어 술이 되었네. 며칠 지나니 냄새가 났네. 나는 그것을 마시고 기운이 난 척했네. 일부러 크게 웃었네. 노래를 부르고 춤을 추었네. 등에 사람을 업은 채로 그렇게 했네. 목이 졸리는데도 웃었네. 그것이 제일 힘든 일이었네. 업힌 사람이 흔들리도록 일부러 크게 움직였네. 그래야 무엇을 마셨는지 궁금해질 것이었네.`,
            `등에 업힌 노인이 그것을 보고 그 조롱박을 빼앗았네. 자기도 마시고 싶었던 것이네. 그리고 다 마셨네. 단숨에 들이켰네. 조금 뒤 그 다리에서 힘이 빠졌네. 목을 죄던 것이 스르르 풀렸네.`,
            `나는 그를 등에서 내려놓았네. 목이 그제야 펴졌네. 그리고 그 자리를 벗어났네. 뒤도 돌아보지 않고 바닷가로 갔네. 며칠 뒤 지나가는 배가 나를 건져 주었네. 바닷가에서 옷을 흔들어 신호를 보낸 것이네. 그 배가 지나가지 않았으면 나는 그 섬에서 늙었을 걸세. 그때 일을 생각하면 지금도 목이 뻐근하네. 그 배 사람들이 내 이야기를 듣고 이렇게 말했네.<br>"그자를 바다의 노인이라고 부릅니다. 그 등에 업힌 사람 가운데 살아 돌아온 사람은 당신이 처음입니다."`,
            `이야기가 끝나자 짐꾼 신드바드가 이렇게 물었습니다.<br>"그 노인은 왜 그렇게 합니까?"<br>"모르네."<br>"그럼 왜 업어 주셨습니까?"`,
            `뱃사람 신드바드는 잠깐 아무 말도 하지 않았습니다. 그러고는 이렇게 말했습니다.<br>"딱해 보였으니까."<br>"후회하십니까?"<br>"아니."<br>"왜요?"<br>"그때 모른 척했으면 다음에도 모른 척했을 걸세. 그러면 정말로 딱한 사람을 만났을 때도 안 업었을 걸세."<br>그러고는 이렇게 덧붙였습니다.<br>"다만 다음부터는 내려놓는 방법을 먼저 생각해 두네."`
        ]
    },
    {
        num: 7,
        title: "하늘을 나는 나무 말",
        emoji: "🐎",
        art: ["story-07-a.webp", "story-07-b.webp"],
        paras: [
            `페르시아의 어느 왕이 새해 잔치를 열었습니다. 그 자리에 세 사람이 신기한 것을 가지고 왔습니다. 새해 잔치에는 나라 안팎에서 사람이 모였습니다. 왕에게 신기한 것을 바치고 상을 받으려는 사람들이었습니다.`,
            `첫 번째 사람은 금으로 만든 공작을 가져왔습니다. 한 시간마다 날개를 치고 소리를 내는 것이었습니다. 두 번째 사람은 놋쇠 나팔수를 가져왔습니다. 성문 위에 세워 두면 적이 오는 것을 보고 나팔을 부는 것이었습니다. 성을 지키는 사람이 잠들어도 그것은 잠들지 않는다는 것이었습니다. 왕이 그것을 마음에 들어 했습니다.`,
            `세 번째 사람은 검은 나무로 만든 말을 가져왔습니다. 보기에는 그냥 말 조각이었습니다. 칠도 하지 않은 검은 나무였습니다. 사람들이 보고 시시하게 여겼습니다. 앞의 두 가지가 금과 놋쇠로 번쩍였기 때문입니다. 그 사람이 말했습니다.<br>"이것은 하늘을 납니다."`,
            `사람들이 웃었습니다. 그 사람이 말에 올라 목 아래의 손잡이를 돌렸습니다. 그러자 말이 떠올랐습니다. 발굽이 땅에서 한 뼘쯤 뜨더니 쑥 올라갔습니다. 그리고 성 위로 한 바퀴 돌고 내려왔습니다. 내려앉을 때 소리도 나지 않았습니다. 그제야 아무도 웃지 않았습니다.`,
            `왕이 크게 놀랐습니다.<br>"무엇을 원하는가."<br>"공주님을 아내로 주십시오."`,
            `왕은 대답을 미루었습니다. 딸을 그렇게 내줄 수는 없었기 때문입니다. 그런데 그 자리에 왕자 카마르가 있었습니다. 왕자는 그 말을 타 보고 싶어 견딜 수가 없었습니다. 아버지가 대답을 미루는 사이에 마당으로 내려갔습니다. 그리고 말을 만든 사람에게 말했습니다.<br>"제가 한번 타 보겠습니다."`,
            `왕자는 말에 올라 손잡이를 돌렸습니다. 말이 떠올랐습니다. 그리고 계속 올라갔습니다. 왕자는 내리는 방법을 묻지 않았던 것입니다. 올라가는 손잡이만 보고 올라탄 것입니다. 만든 사람이 알려 주려던 참이었습니다. 그런데 왕자가 그것을 기다리지 않았습니다. 신기한 것을 보면 사람은 대개 그렇게 합니다.`,
            `말은 구름을 뚫고 올라갔습니다. 왕자는 숨이 막혔습니다. 높이 올라갈수록 바람이 찼습니다. 아래를 보니 성이 손톱만 했습니다. 소리쳐도 들릴 데가 없었습니다. 그제야 왕자는 말의 목과 어깨를 손으로 더듬었습니다. 무서워지고 나서야 살펴본 것입니다.`,
            `어깨 쪽에 손잡이가 하나 더 있었습니다. 그것을 돌리자 말이 내려가기 시작했습니다.`,
            `왕자는 그날 밤 아주 먼 나라의 궁전 지붕에 내렸습니다.`,
            `그 나라는 벵골이라는 곳이었습니다. 왕자가 이름도 들어 본 적 없는 나라였습니다. 말도 통하지 않았습니다. 그런데도 이야기가 되었습니다. 손짓과 눈짓으로 며칠을 지냈습니다. 그리고 거기서 공주를 만났습니다. 두 사람은 서로 마음이 맞았습니다.`,
            `왕자는 공주를 말에 태우고 자기 나라로 돌아왔습니다.`,
            `그런데 그 나무 말을 만든 사람이 그것을 되찾으러 왔습니다. 그 사람은 왕자가 없는 사이에 공주를 속여 말에 태우고 날아가 버렸습니다.`,
            `왕자는 온 세상을 돌아다니며 공주를 찾았습니다. 그리고 마침내 어느 나라에서 찾아냈습니다.`,
            `나무 말을 만든 사람이 그 나라에 내려앉았다가 붙잡혀, 공주와 나무 말이 그 나라 왕의 손에 들어간 것이었습니다. 그 왕은 공주를 아내로 삼으려 했습니다. 공주는 그것이 싫어 아무 말도 하지 않고 아무것도 먹지 않았습니다. 왕은 공주가 병이 난 줄 알고 걱정하고 있었습니다. 왕자는 의사 행세를 하고 그 궁에 들어갔습니다. 약상자를 하나 들고 들어갔습니다. 의사 옷을 구해 입고 수염을 붙였습니다. 그 궁에서 아무도 알아보지 못했습니다.`,
            `그리고 공주에게 몰래 말했습니다.<br>"그 나무 말이 이 궁 어디에 있는지 아십니까."<br>"압니다."`,
            `왕자는 왕에게, 공주의 병을 고치려면 공주를 나무 말 곁에 데려가야 한다고 말했습니다. 공주가 말 곁에 오자 두 사람은 그 말을 타고 날아 떠났습니다.`,
        ]
    },
    {
        num: 8,
        title: "하룻밤의 왕",
        emoji: "👑",
        art: ["story-08-a.webp", "story-08-b.webp"],
        paras: [
            `바그다드에 하룬 알라시드라는 칼리프가 있었습니다. 칼리프는 그 나라에서 가장 높은 사람입니다. 하룬은 밤이면 옷을 바꿔 입고 시내를 걸어 다녔습니다. 장사꾼 차림을 할 때가 많았습니다. 신하 한둘만 데리고 나갔습니다. 궁 밖에서는 이름도 다르게 댔습니다.`,
            `백성이 실제로 어떻게 사는지 보려는 것이었습니다.`,
            `어느 밤, 다리 위에서 젊은이를 하나 만났습니다. 이름은 아부 하산이었습니다. 아버지가 남긴 재산이 있어서 넉넉히 사는 사람이었습니다. 아부 하산은 낯선 나그네인 하룬을 집에 데려가 밥을 먹였습니다. 누구인지 묻지도 않았습니다. 밥상에 있는 것을 다 내놓았습니다. 그 시절 그 지방에서는 나그네를 그렇게 대접했습니다.`,
            `두 사람이 이야기를 나누다가 아부 하산이 이렇게 말했습니다.<br>"저에게 소원이 하나 있습니다."<br>"무엇이오."<br>"딱 하루만 칼리프가 되어 보고 싶습니다."<br>"왜 그렇소?"<br>"우리 동네에 못된 사람이 넷 있습니다. 그 사람들을 제가 하루만 다스릴 수 있으면 좋겠습니다."`,
            `하룬은 그 말을 듣고 웃었습니다. 그리고 그날 밤 아부 하산의 잔에 잠드는 약을 조금 탔습니다. 아부 하산은 그것을 눈치채지 못했습니다. 밤이 깊었고 이야기가 한창이었기 때문입니다. 잔이 몇 번이나 오갔습니다. 잔을 비우고 나서 곧 말이 느려졌습니다. 그러고는 그 자리에서 엎드려 잠들었습니다.`,
            `하룬은 그를 궁으로 옮기게 했습니다. 그리고 신하들에게 이렇게 일러 두었습니다.<br>"내일 이 사람이 깨거든, 하루 동안 이 사람을 칼리프로 대하라."`,
            `이튿날 아침, 아부 하산이 깼습니다. 비단 침대에 누워 있었고, 사람들이 엎드려 있었습니다.<br>"칼리프시여, 일어나셨습니까."`,
            `아부 하산은 자기가 꿈을 꾸는 줄 알았습니다. 손등을 물어 보았습니다. 꿈이면 아프지 않을 줄 알았던 것입니다. 아팠습니다. 그래서 더 어리둥절해졌습니다. 꿈이 아니면 무엇인지 알 수 없었기 때문입니다.`,
            `그날 아부 하산은 칼리프 노릇을 했습니다. 그리고 제일 먼저 한 일이 있습니다. 그 동네의 못된 사람 넷을 잡아들이라고 한 것입니다.`,
            `그 사람들이 끌려왔습니다. 아부 하산은 그 사람들의 죄를 하나하나 말했습니다. 누가 누구의 밭을 빼앗았는지, 누가 과부의 돈을 떼먹었는지, 누가 아이들을 때렸는지. 날짜까지 짚어 냈습니다. 잡혀 온 넷은 아무 말도 하지 못했습니다.`,
            `아부 하산은 그 일을 아주 자세히 알고 있었습니다. 그 동네에서 오래 살았기 때문입니다. 높은 자리에 앉은 사람은 그런 것을 모릅니다. 아래에서 살아 본 사람만 압니다. 칼리프는 궁 안에서 보고를 받습니다. 그 보고에 그런 일은 올라오지 않습니다. 아부 하산은 넷에게 벌을 내렸습니다. 그다음에는 어머니와 이웃들에게 돈을 보내라고 했습니다.`,
            `아부 하산이 이렇게 말했습니다.<br>"그 과부네 집 지붕이 새는데 아무도 고쳐 주지 않았소. 사람을 보내시오."`,
            `옆에서 하룬이 그것을 다 지켜보고 있었습니다. 그날 밤 아부 하산은 다시 잠들었고, 깨어 보니 자기 집이었습니다. 하룬이 다시 잠드는 약을 먹이고 집으로 옮겨 놓게 한 것이었습니다. 아부 하산은 그것이 꿈인지 아닌지 몰라 여러 날을 앓았습니다. 사람들에게 말하면 다들 웃었습니다. 그래서 나중에는 말하지 않게 되었습니다.`,
            `그러다 얼마 뒤 그 나그네가 다시 찾아왔습니다.`,
            `아부 하산이 그 이야기를 했습니다. 나그네가 웃으면서 두건을 벗었습니다. 아부 하산은 그 자리에 엎드렸습니다. 하룬이 그를 일으켜 세웠습니다.<br>"그대가 하루 동안 한 일을 내가 다 보았소."<br>"용서해 주십시오."<br>"용서할 것이 없소. 그대는 그 하루 동안 나보다 그 동네를 잘 알고 있었소."`,
            `그리고 하룬은 아부 하산을 곁에 두었습니다. 그 뒤로 아부 하산은 칼리프에게 바깥 이야기를 전하는 사람이 되었습니다. 궁 안에서는 들을 수 없는 이야기였습니다. 하루 동안 왕 노릇을 시켜 주고 평생 쓸 귀를 얻은 셈입니다. 높은 사람에게 올라가는 말은 올라가는 동안 다듬어집니다. 다듬어지지 않은 말을 전할 사람이 필요했던 것입니다.`
        ]
    },
    {
        num: 9,
        title: "검은 섬의 왕자",
        emoji: "🪨",
        art: ["story-09-a.webp", "story-09-b.webp"],
        paras: [
            `어느 왕이 사냥을 나갔다가 길을 잃었습니다. 사슴을 쫓다가 일행과 떨어진 것이었습니다. 해가 기울도록 사람을 찾지 못했습니다. 뿔피리를 불어도 대답이 없었습니다. 그러다 큰 호수를 하나 발견했습니다. 바닥의 돌이 다 보일 만큼 맑았습니다. 그런데 물가에 사람 자취가 하나도 없었습니다. 그 호수에는 물고기가 네 가지 빛깔로 헤엄치고 있었습니다. 흰 것과 붉은 것과 파란 것과 노란 것이었습니다. 수가 고르게 섞여 있었습니다. 헤엄치는 모양도 빛깔마다 달랐습니다. 왕은 그것을 한참 들여다보았습니다.`,
            `그리고 호수 건너편에 궁전이 하나 있었습니다. 왕은 그 궁전으로 갔습니다. 대문이 활짝 열려 있었습니다. 지키는 사람도 없었습니다.`,
            `안에 들어가 보니 사람이 하나도 없었습니다. 방마다 등이 켜져 있고, 상에 밥이 차려져 있었습니다. 뜰에 물이 흐르고 나무가 잘 다듬어져 있었습니다. 누군가 돌보고 있는 집이었습니다. 밥에서 김이 오르고 있었습니다. 방금까지 사람이 있었던 것처럼 보였습니다. 그런데 아무 소리도 나지 않았습니다. 발소리도 말소리도 없었습니다.`,
            `왕이 큰 소리로 불렀습니다. 소리가 빈 방들을 돌아 되울렸습니다. 자기 목소리가 되돌아오는 것을 왕이 처음 들었습니다. 아무 대답이 없었습니다. 그러다 안쪽 방에서 우는 소리가 났습니다. 아주 낮게 흐느끼는 소리였습니다. 소리가 나는 쪽으로 가는 동안 왕은 여러 번 멈췄습니다. 그 궁전이 아주 컸기 때문입니다. 참다가 새어 나오는 소리였습니다.`,
            `왕이 그 방에 들어갔습니다. 젊은 남자가 하나 왕의 자리에 앉아 있었습니다. 잘생긴 사람이었는데 얼굴이 몹시 슬펐습니다. 옷차림이 임금의 것이었습니다. 그런데 자리에서 일어나지 않았습니다. 그 사람이 말했습니다.<br>"어서 오십시오. 일어나 맞지 못하는 것을 용서하십시오."<br>"괜찮소."<br>"제가 일어날 수 없어서 그럽니다."`,
            `그리고 그 사람이 옷자락을 걷었습니다. 왕이 그쪽으로 몸을 숙였습니다. 허리 아래가 돌이었습니다. 발끝까지 새까만 돌이었습니다. 만져 보니 차가웠습니다. 그리고 아무 느낌이 없다고 했습니다. 왕은 그 자리에 굳었습니다. 그 사람은 반은 사람이고 반은 돌이었습니다.`,
            `젊은이가 이야기를 시작했습니다. 그는 검은 섬이라는 나라의 왕이었습니다. 섬 넷을 다스리던 나라였습니다. 여러 해 전, 그 나라 안에서 큰 배신이 있었습니다. 제일 가까운 데 있던 사람이 한 일이었습니다.`,
            `그 일을 꾸민 사람은 마법을 쓸 줄 알았습니다. 아주 오래 마법을 익힌 사람이었습니다. 그동안 아무도 눈치채지 못했습니다. 그 사람은 왕을 이렇게 만들어 놓고, 나라 전체에도 마법을 걸었습니다. 하룻밤 사이에 벌어진 일이었습니다. 저녁에 자리에 든 사람들이 아침에 물속에 있었던 것입니다. 무슨 일이 일어났는지 아무도 알지 못했습니다. 그 나라의 도시가 통째로 호수가 되었습니다. 집도 길도 다 물속에 잠겼습니다. 그리고 그 도시 사람들이 물고기가 되었습니다. 네 가지 빛깔은 그 나라의 네 부족이었습니다.`,
            `"저는 날마다 여기 앉아서 그 호수를 봅니다."<br>그 호수가 원래 자기 나라였기 때문입니다. 백성이 다 그 물속에 있었습니다.<br>왕은 그 이야기를 다 듣고 이렇게 물었습니다.<br>"그 마법을 푸는 방법이 있소?"<br>"있습니다. 그런데 그것을 하려면 목숨을 걸어야 합니다."`,
            `왕은 그것을 하기로 했습니다. 남의 나라 일에 목숨을 건 것입니다. 마법을 건 사람은 밤마다 궁전 안쪽의 한 방을 찾아왔습니다. 왕은 그 방에 숨어 있다가, 그 사람이 믿고 기대던 사람의 목소리를 흉내 냈습니다. 그리고 물고기가 된 백성들이 밤마다 우는 소리에 잠을 못 자겠으니 마법을 풀어 달라고 했습니다. 들키면 그 자리에서 목숨을 잃을 일이었습니다. 마법을 건 사람은 속은 줄 모르고 호숫가로 나가 주문을 외웠습니다.`,
            `왕이 그것을 해냈고, 마법이 풀렸습니다. 땅이 크게 울렸습니다. 물이 빠지는 소리가 한참 났습니다. 그리고 젖은 지붕들이 하나씩 드러났습니다. 호수가 사라지고 그 자리에 도시가 다시 나타났습니다. 집과 길과 우물이 그대로 있었습니다. 여러 해 물속에 있었는데도 그대로였습니다. 마법으로 된 일이라 그런 모양이었습니다. 물고기들이 사람이 되었습니다. 젊은 왕의 몸도 돌에서 풀려났습니다. 물이 빠진 자리에서 사람들이 일어섰습니다.`,
            `장에서 물건을 팔던 사람은 물건을 팔던 자리에 서 있었고, 밥을 짓던 사람은 부뚜막 앞에 서 있었습니다. 불이 그대로 붙어 있었습니다. 솥에서 김이 올랐습니다. 여러 해가 지난 줄도 모르고 있었습니다. 자기가 물고기였던 것도 몰랐습니다. 그 사람들만 그 세월을 겪지 않은 셈입니다.`,
            `그런데 젊은 왕은 자기 나라로 돌아가지 않았습니다. 그 도시가 있던 자리가 너무 외진 곳이라 사람이 살기 어려워졌기 때문입니다. 물길이 끊기고 밭이 다 삭아 있었습니다.`,
            `사냥 나왔던 왕이 이렇게 말했습니다.<br>"내 나라로 갑시다. 내게는 아들이 없소."<br>그 말을 하는 데 오래 걸리지 않았습니다. 두 사람은 그 하루 사이에 그렇게 되었습니다.`,
            `그래서 검은 섬 사람들이 그 왕의 나라로 옮겨 가 살았습니다. 나라 하나가 통째로 옮겨 가는 일이었습니다. 사람과 짐승과 수레가 줄지어 갔습니다. 사냥 나온 왕이 하루 만에 닿은 곳이었는데, 돌아가는 길은 한 해가 걸렸습니다. 마법이 두 나라 사이를 가깝게 당겨 놓았다가, 마법이 풀리자 거리도 본디대로 멀어진 것입니다. 길에서 아이가 태어나기도 했습니다. 그 아이는 두 나라 어디에도 속하지 않은 데서 태어난 셈입니다. 그런 아이가 그 해에 여럿이었다고 합니다.`
        ]
    },
    {
        num: 10,
        title: "이야기의 값",
        emoji: "📖",
        art: ["story-10-a.webp", "story-10-b.webp"],
        paras: [
            `셰에라자드가 들려준 이야기는 그뿐이 아니었습니다. 한 편이 끝나기도 전에 그 안에서 다른 이야기가 시작되기도 했습니다. 인도에서 온 이야기도 있고, 페르시아와 이집트에서 온 이야기도 있었습니다. 장사꾼들이 낙타를 타고 오가며 옮겨 온 이야기들이었습니다. 셰에라자드는 그것을 다 기억해 두었다가 밤마다 하나씩 꺼냈습니다.`,
            `셰에라자드는 천 하룻밤 동안 이야기를 했습니다. 햇수로 거의 세 해였습니다. 그동안 한 밤도 거르지 않았습니다. 이야기를 하면서 아이를 셋 낳고 길렀습니다.`,
            `천 하룻날 밤, 셰에라자드가 이야기를 마치고 이렇게 말했습니다.<br>"임금님, 이제 제가 아는 이야기가 다 떨어졌습니다."`,
            `그리고 아이 셋을 데려오게 했습니다.<br>"이 아이들을 어미 없이 두지는 마십시오."`,
            `왕은 한참 아무 말도 하지 않았습니다. 그러다 이렇게 말했습니다.<br>"나는 그대를 죽이지 않겠소."<br>"고맙습니다."<br>"그런데 그것은 오늘 정한 것이 아니오."<br>"언제 정하셨습니까."<br>왕이 말했습니다.<br>"아주 오래되었소. 나도 정확히 언제인지는 모르겠소."`,
            `셰에라자드가 목숨을 건 방법은 싸움이 아니었습니다. 그리고 애원도 아니었습니다. 살려 달라고 빈 적이 한 번도 없었습니다. 빌었으면 그 밤에 끝났을 것입니다. 그것을 아는 사람이었습니다.`,
            `그 사람은 이야기를 했습니다. 날마다 다른 사람의 인생을 하나씩 왕 앞에 가져다 놓은 것입니다. 천 밤 동안 천 사람이 왕 앞을 지나간 셈입니다. 어부 이야기, 짐꾼 이야기, 도둑 이야기, 왕자 이야기. 왕이 여태 만나 본 적 없는 사람들이었습니다. 궁 안에는 그런 사람이 오지 않기 때문입니다.`,
            `그 이야기들을 천 밤 동안 듣는 동안, 왕은 사람이라는 것을 다시 보게 되었습니다. 자기도 모르는 사이에 그렇게 되었습니다. 사람을 미워하기는 쉽습니다. 얼굴 한 번 안 보고도 미워할 수 있습니다. 그런데 그 사람의 이야기를 끝까지 듣고 나서도 미워하기는 어렵습니다. 셰에라자드는 그것을 알고 있었습니다. 천 밤을 걸고 그것에 기댄 것입니다. 싸워서 이긴 것이 아니라 듣게 해서 이긴 것입니다.`
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
    title: 'The Arabian Nights',
    cover: {
        title: 'The Arabian Nights',
        tag: 'tales gathered from many lands',
        intro: [
            `Before a king who can no longer trust anyone, Scheherazade keeps a story going for a thousand and one nights. She always stops just where it gets interesting.`,
            `Eight of the tales she told are gathered here.`
        ]
    },
    chapters: [
        {
            title: 'A Thousand and One Nights, Earned',
            paras: [
                `Very long ago, in Persia, there was a king called Shahriyar. He was young and strong and ruled his country well. The people followed him. Then one year the king was badly betrayed. It wounded him deeply. He told nobody how he felt. Being a king, he had nobody to tell. Sit in a high place and, however many people stand beside you, there is nobody to talk to. Because they all say only what the king wants to hear.`,
                `He had been deceived by the person closest to him. He fell as far as he had trusted. Had he trusted a little, he would have fallen a little. And yet there is no way to live without trusting greatly. After that the king changed. He thought like this.`,
                `'No one can be trusted. So end it before any affection can grow.' From then on the king began a terrible thing. Every day he married anew, and the next morning he took that person's life.`,
                `Three years passed. In those three years more than a thousand people lost their lives. Not a house with a daughter was left in the land. They had all fled with their daughters to other countries. They packed at night and slipped out of the city gate. In daylight they would have been seen. Several houses emptied every day. The marketplace stood empty and the shops closed.`,
                `The one who had to carry out that work was the vizier. Every day the vizier had to bring somebody to the king. He did it for three years. He became a man who could not sleep at night. That vizier had two daughters. The elder was Scheherazade, and the younger was Dunyazad.`,
                `Scheherazade had read a very great deal. She had read every book in the vizier's library. She knew more than a thousand histories and poems and old tales. What she had read once, she never forgot. She also knew at what point to stop so that people wanted more. That was something not written in any book. Knowing many stories and telling stories well are different things. Scheherazade had both.`,
                `One day Scheherazade said to her father,<br>"Father, send me to the king."`,
                `The vizier rose from his seat at the words.<br>"What are you saying?"<br>"This has to be ended."<br>"You mean I should lose you too?"<br>"Father, how many have gone already?"`,
                `The vizier could not answer.<br>Scheherazade said,<br>"I have a way."`,
                `The vizier argued with her for many days. He argued weeping and he argued in anger. But his daughter would not bend. Even at meals she spoke of nothing else. What she meant to do, the vizier did not know then. Had he known, he would have argued still. He even told her an old tale to dissuade her. It was the tale of the ox and the donkey. But his daughter turned even the meaning of that tale back on him. In the end Scheherazade went to the palace.`,
                `Before she went, she told her sister this:<br>"When the night is deep, ask me to tell you a story."`,
                `That night her sister Dunyazad did so.<br>"Sister, tell me a story."<br>Scheherazade asked the king,<br>"Will you allow it?"`,
                `The king said she might. It would all be over by morning anyway, he thought. Listening to one story would change nothing. That was the king's reckoning. That night, for the first time, the reckoning went wrong. The king himself did not notice it go wrong.`,
                `Scheherazade began her story. And at the point where the story grew most interesting, she stopped.<br>"Day has broken. I will tell the rest another time."`,
                `The king wanted to know what came next. Because the story had broken off at exactly the most tantalising point. So he put it off for one day. Only one day, he told himself. That one day became a thousand and one nights.`,
                `The next night Scheherazade finished the story. The king listened to the end without a word. And she began the next story at once. And again she stopped just where it grew interesting.`,
                `So one day became two, two became ten, and ten became a year. In all that time nobody in the palace spoke of the stories. If they spoke of them, the king might come to his senses. Everybody hoped those nights would go on one day longer. And in that time not one person in the land lost their life. One story did that. These were the kinds of stories Scheherazade told on those nights.`
            ]
        },
        {
            title: 'The Genie in the Jar',
            paras: [
                `There was once a poor fisherman. He had one rule. He cast his net only four times a day. It was a vow not to be greedy beyond four. Casting more did not mean catching more. Whether he had caught anything or not, he gathered his net onto his shoulder and went home. He had kept that rule for many years. He cast his net on the seashore near Baghdad. What he caught that day, he sold at market that day.`,
                `One day the first net came up with a dead donkey in it. The second brought up a jar full of sand. Just tipping out the sand took a long while. His arms ached from the weight. The third brought up broken pots and shards of glass. Things people had thrown away on the shore. Not one thing of value. Only his net was torn here and there. He mended the tears on the spot. His hands were stiff and the knots would not hold. Three casts and still empty-handed, and the day was as good as gone. The sun was already sinking.`,
                `The fisherman looked at the sky and sighed. It had been a long time since three casts had come up empty. Still, a rule is a rule. And he made his fourth cast. He swung his whole body to throw it far. He heard the net strike the water. If this one came up empty too, he would go home with nothing. His children were waiting at home.`,
                `This time a brass jar came up. Its mouth was sealed with lead, and a seal was stamped on the lead. Brass was worth something by itself. So the day was not wasted after all. The fisherman thought, 'There must be something valuable inside,' and he broke the seal. And smoke poured out.`,
                `The smoke rose into the sky and gathered, and became an enormous genie. His head touched the clouds and his feet touched the ground. His eyes were as big as braziers. His teeth were like boulders and steam came from his nostrils. The steam touched the fisherman's face. When he opened his mouth it was like a cave. His voice shook the earth. The reeds along the shore all lay flat. The waves were pushed back. The fisherman's legs went weak.`,
                `The genie roared,<br>"Prepare yourself. I am going to kill you."<br>"But I let you out."<br>"That is why I am going to kill you."<br>The fisherman could not understand it. Because it meant killing the one who had rescued him.`,
                `Then the genie told him this story. Long ago he had disobeyed a certain king, and had been shut in that jar. Sealed with lead, stamped, and thrown into the sea. That king, they say, was a man who could command even genies. That seal was not something anyone could break. On it was carved the name of a powerful king. So he had been inside for four hundred years. Inside the jar it was dark and cramped. Only by turning himself to smoke could he fit at all. For the first hundred years he thought like this.`,
                `'Whoever lets me out, I shall give all the riches of the world.' Nobody came. For the second hundred years he thought like this. 'Whoever lets me out, I shall show every treasure under the earth.' Nobody came. For the third hundred years he thought like this.`,
                `'Whoever lets me out, I shall grant three wishes.' Nobody came. Every hundred years his heart had sunk one step lower. And in the last hundred it turned right over. In the four hundredth year he thought like this. 'Now whoever lets me out, I shall kill him.'`,
                `The fisherman heard the whole story. And, shaking all over, he said this:<br>"May I ask one thing? Was a person as great as you really inside this little jar?"<br>"I was."<br>"I cannot believe it. Not even one foot would fit."<br>As he said it, the fisherman quietly drew the jar toward his feet. He put his hands behind his back to hide their trembling.`,
                `The genie grew angry.<br>"I will show you."`,
                `And he became smoke again and went into the jar. The smoke swirled and was sucked in. His head went in first, then his shoulders. And still a great deal remained. All that time the fisherman held the lid in his hand. He had never let go of it from the start. At that instant the fisherman pressed the lid shut.`,
                `"Now I will throw you back into the sea."<br>From inside, the genie pleaded.<br>"I was wrong. Let me out and I will make you rich."<br>"How can I trust a person whose mind changed three times in four hundred years?"`,
                `And yet, in the end, the fisherman let him out. Because the genie swore to repay the kindness. This time it was true, he said, over and over. And this time he swore on his name. An oath on a name was one that even a genie could not break. The fisherman did not believe all of it. Still, he opened the jar again. And that genie really did keep his word. He led the fisherman to a lake beyond the hills and had him catch fish of beautiful colours. The fisherman gave the fish to the king and received a great reward.`,
                `The fisherman lived well after that. Only, they say, he cast his net just as before. Four times a day, no more.`,
                `Scheherazade finished the story and looked at the king. The king said nothing. But he had understood what the story was about. It was not only the genie who had been shut in a jar. The king, too, had been shut in something for three years.`,
                `It was a story about how a heart changes when it sits too long in hatred. When what you wait for does not come, you fold your heart away. Fold it long enough and it turns to the other side. That was exactly what the king had done for three years. Scheherazade never said so aloud. She only left it there, as a story.`
            ]
        },
        {
            title: 'Aladdin and the Magic Lamp',
            paras: [
                `In a certain city lived a boy called Aladdin. His father had been a tailor, and had died young. Aladdin learned no trade and only played in the alleys.`,
                `His mother spun thread and sold it, and they barely lived. She turned the spinning wheel late into the night. Aladdin fell asleep to the sound. A whole day's spinning bought a little flour. His mother's fingertips were always cracked.`,
                `One day a stranger came looking for Aladdin.<br>"I am your father's younger brother."`,
                `Neither Aladdin nor his mother had ever heard of such a person. But the man spent money freely. And he bought Aladdin fine clothes and promised to set him up in a shop. It was strange for a man they had never seen to do so much. But in a poor house there is no time to weigh such things. Thank you comes out first. And that was exactly what the man knew.`,
                `A few days later the man took Aladdin out of the city. They walked a long way and came to the foot of a mountain. The man scattered something on the ground and spoke a spell. The earth split open and a stone door appeared. Aladdin was frightened then for the first time. But there was no going back.`,
                `The man was a sorcerer. He had come all this way from very far off in search of an old lamp hidden under the earth. Only one particular boy could open that door. To him, Aladdin was not a nephew but the key to a door. Once the door was open, nothing more was needed. He had spent years preparing to get that lamp. Deceiving one boy was nothing to him.`,
                `The man told Aladdin,<br>"Go in. There is a garden inside, and trees. Touch nothing, and bring out only the old lamp hanging on the wall."`,
                `And he put a ring on the boy's finger.<br>"This ring will protect you."`,
                `Aladdin went down the steps. Inside there really was a garden. There was fruit on the trees, and all the fruit was jewels. Red ones and blue ones and green ones hung on every branch. Aladdin thought they were glass. He was a boy who had never seen a jewel. He put them in his pockets only because they were pretty.`,
                `Aladdin stuffed his pockets full. Then he took the lamp and climbed back up the steps. But his load was so heavy he could not climb the last step.`,
                `"Give me your hand."<br>"Throw up the lamp first."<br>"Take my hand first. I cannot get up by myself."<br>"I said throw up the lamp!"`,
                `So the two of them struggled. Then the man lost his temper and spoke a spell. He did it with the same mouth that had called the boy nephew. If he could not have the lamp, he would bury the boy with it. And he shut the door.`,
                `Aladdin was shut in the dark. For two days he wept in there. He shouted, but nothing could be heard above. There was no water and no light. Two days is about the last a person can bear. Then, wringing his hands, he rubbed the ring. And something came out of it.<br>"Master, what do you wish?"`,
                `When Aladdin said he wanted to go home, the genie of the ring lifted him up out of the earth. He went home and showed the old lamp to his mother. She polished it to sell it. And that was when the genie of the lamp came out.`,
                `Thanks to the genie of the lamp, Aladdin became rich and married the princess of that country. In a single night the genie even built the two of them a palace to live in.`,
                `Years later, the sorcerer learned that Aladdin was living well, and came back.`,
                `And in the street he cried,<br>"New lamps for old!"`,
                `Aladdin was away hunting that day. The princess heard the cry and handed over an old lamp that was lying about in a storeroom. She did not know what it was. Aladdin had never told even his wife. What he hid did not protect him. It lost him everything. Not knowing, she can hardly be called at fault.`,
                `The sorcerer rubbed the lamp, and the genie came out. The sorcerer had the genie carry the whole palace, with the princess inside, off to a faraway land. Aladdin asked the genie of the ring to take him to the princess, and together with her he thought up a trick and got the lamp back. It took a very long time to get it back. And after he got it back, he is said to have said this:<br>"Had I told you about this lamp sooner, none of this would have happened."`
            ]
        },
        {
            title: 'Ali Baba and the Forty Thieves',
            paras: [
                `In a village in Persia lived two brothers. The elder, Kasim, had married into money and lived well. He kept a big shop in the market. So, brothers though they were, they lived in very different places. The younger, Ali Baba, cut firewood and sold it with three donkeys. One load of wood bought a day's food. So those three donkeys were the whole of what that house owned.`,
                `One day Ali Baba was cutting wood in the forest when he heard hooves. He climbed a tree and hid. There were forty riders. Ali Baba heard them coming before he saw them. In a forest, sounds arrive from far away. Every one of them wore a sword. They were all heavily loaded. The sacks were so heavy the horses laboured. It took two men to lift one sack down. Where the sacks had come from, there was no need to ask. Ali Baba held his breath among the branches. One trembling leaf would have given him away.`,
                `The leader of the band stood before a rock and said,<br>"Open, sesame."`,
                `And the rock split. It was not that the rock had a door. It split right through and closed again. The men carried their loads inside. And a long while later they came out empty-handed. What they left inside could not be seen.`,
                `The leader said,<br>"Close, sesame."`,
                `The rock closed, and the band rode away. Long after the hooves had faded, Ali Baba stayed where he was. In case they came back. Then he climbed down. And he stood before the rock and tried it.<br>"Open, sesame."`,
                `The rock split. Inside was a cave. Gold and silver and silk were piled in it like hills. The roof was high and the space was wide. There was no lamp, and yet light came from somewhere. It had been gathered over dozens of years. The silk had rotted along its folds. It had only been piled up, never used. What is stolen is hard to use. Because put something valuable up for sale and people ask where it came from.`,
                `Ali Baba filled sacks with gold coins and loaded them on his donkeys. But he did not take it all. He took only as much as three donkeys could carry. More would tire the donkeys, and anyone who saw would think it strange. That is why Ali Baba survived. There was also one who went into that cave and never came out alive.`,
                `At home, his wife wanted to measure the gold in a grain measure. She had none, so she borrowed one from her sister-in-law's house. There were so many coins that she gave up counting and decided to measure them. That was the one mistake that house made.`,
                `The sister-in-law had secretly smeared wax in the measure. A thin layer on the bottom. Because she wanted to know what her poor relations were measuring. It was strange for a poor house to borrow a grain measure. There could be no grain in that house. So borrowing one meant grain had come from somewhere. When the measure came back, one gold coin was stuck to the wax. The sister-in-law held it in her hand and looked at it a long while. Then she ran to her husband.`,
                `Kasim called his brother.<br>"Where did that gold come from?"`,
                `Ali Baba told him everything, just as it was. And he offered to share the cave. That was the kind of man Ali Baba was. But the next morning at dawn Kasim went there alone with ten donkeys.<br>"Open, sesame."`,
                `The rock opened. Kasim went in and filled his sacks with gold. Then, when he made to leave, he could not remember the word.<br>"Open, barley."<br>"Open, beans."`,
                `While he stared at the gold, the word sesame had been wiped from his head. He had spent all his mind on filling the sacks. The only one who thought about the way out was the younger brother. Ali Baba had repeated the word to himself again and again as he went in. His brother had not repeated it once.`,
                `That day the thieves came back. Ten donkeys were tethered in front of the cave. So they could not fail to know that somebody was inside. Kasim never came out of that cave.`,
                `When his brother did not come back, Ali Baba went to the cave and brought him home. Seeing that the man in the cave was gone, the thieves realised that somebody else knew their secret. After that the thieves searched the village and found Ali Baba. And several times they tried to get rid of him. Each time somebody noticed and stopped it. It was a woman called Morgiana, who worked in Ali Baba's house. She cooked the meals and drew the water. She was also the sharpest-eyed person in that house.`,
                `When the thieves came to the house dressed as an oil merchant with thirty-seven oil jars, Morgiana went to draw some oil and heard a man breathing inside a jar. Morgiana did not scream. Had she screamed, thirty-seven men would have poured out on the spot. She worked that out in that one short moment. Going to fetch oil saved the house that night. She had gone because the lamp had run dry.`,
                `Instead, she used a way to stop the thieves without anyone knowing. That night not one man came out of the thirty-seven jars. And nothing at all happened in that house that night.`,
                `The one who saved the people of that house was not Ali Baba but Morgiana. When Ali Baba learned it later, he married her to his son and made her one of the family. In those days, a servant becoming family was not a common thing. When they heard the news, the people of the village were as glad as if it had happened to them. Because they too worked in other people's houses.`
            ]
        },
        {
            title: 'Sindbad and the Roc',
            paras: [
                `In Baghdad lived a porter called Sindbad. He made his living carrying heavy loads. His back was bent to the shape of them. Baghdad in those days was the biggest city in the world. Goods for the markets flowed endlessly, and a great many men carried them. One hot day he set down his load at the gate of a great house and rested. From inside came music and laughter. The smell of roasting meat drifted over the wall. The porter had eaten nothing since morning. He sat with his back against the wall and breathed in the smell.`,
                `The porter muttered to himself,<br>"Some are inside there, and some are out here."`,
                `The master of the house heard him. He called him in, fed him and asked his name. The master's name was also Sindbad. It was Sindbad the sailor, who had gone to sea seven times and come home. All seven times he had met with great trouble and come back. Each time he had sworn never to go again.`,
                `The master said,<br>"You have my name. Then hear my story."`,
                `And he told him this. It was on my second voyage. The ship put in at an island.`,
                `I went ashore and rested in the shade of a tree, and fell asleep. When I woke, the ship was gone. There was nothing to the horizon. They had sailed without me. Nobody had counted and found me missing.`,
                `I wandered the island. There was not a trace of anyone living there. Then I saw a great white round thing. As big as a roof. Smooth, without a mark. When I knocked on it, it rang hollow. I thought it was a stone and kicked it. It did not budge.`,
                `For a long while I did not know what it was. Then the sun suddenly darkened. It was midday, and a shadow fell. I looked up, and a bird was coming down.`,
                `A bird big enough to hide the clouds. They call it the roc. That white thing was its egg. So you can judge how big the bird was. I hid behind a tree then. One of its legs was as thick as a tree trunk.`,
                `The bird settled on the egg and folded its wings. And I thought this: if I stay on this island, I starve. So I unwound my turban and tied myself to the bird's leg.`,
                `In the morning the bird rose. The sound of its wings was like thunder. I went up above the clouds. A long while later the bird came down in a valley.`,
                `I untied myself and jumped down. Do you know what lay on the floor of that valley? Diamonds. But great snakes lived in that valley. Their bodies were as thick as tree trunks. By day they stayed in their holes and came out at night. So at night I hid in a crack in the rocks. So I moved only while there was daylight.`,
                `And the cliffs were far too high to climb. I sat on those diamonds and thought this: I am going to starve sitting on the most precious thing in the world. That is when I learned it. What is valuable and what is useful are different things.`,
                `Then something fell from above. A great lump of meat. And then another. Lumps of meat fell here and there across the valley. Somebody was throwing them from above.`,
                `I saw it and understood. Men on the clifftop were throwing meat down. When diamonds stick to the meat, eagles carry it up. Then, up on top, they take the meat from the eagles. Because there is no other way down into that valley. Who first thought of it, even I do not know.`,
                `So I filled a sack with diamonds and tied myself to a lump of meat. And an eagle carried me up.`,
                `On the clifftop the men came running and shouting, and then froze when they saw a man hanging from the meat. They had done that work for years, and never seen such a thing. I opened my sack there and then and showed them.`,
                `When the story ended, Sindbad the porter asked,<br>"After such a terrible thing, why did you go out again?"`,
                `Sindbad the sailor laughed.<br>"True enough. But on land, you start thinking of the sea again."<br>The porter thought about those words for a long time. And from that day, they say, he came often to that house.`
            ]
        },
        {
            title: 'The Old Man of the Sea',
            paras: [
                `On the day Sindbad the porter came again, Sindbad the sailor told him another story. It was on my fifth voyage. This time the ship met a storm. It broke up, and I alone came ashore on an island. I had clung to a plank and been washed there. Where the others went, I do not know. There was water on that island, and fruit. Something like bananas grew there. So I did not starve. Only, there was not a single person. Not one footprint. Spend a few days where there is nobody and you learn it. That is harder to bear than hunger.`,
                `A few days later I saw an old man by a stream. You cannot imagine how glad I was to see a human being. He was very old. His beard was white and his legs were thin. The old man beckoned me with his hand. He made no sound. And he asked me to carry him across the stream on my back. He asked it with gestures alone. I thought he could not speak. Later I saw that he simply had not.`,
                `I pitied him and took him on my back. He was as light as if he were nothing but bones. I crossed the stream and made to set him down. But he would not get down. The water came only to my knees. There was no need to carry anyone across it. So the old man had never meant to cross the stream at all. He had been looking for a back to ride. I did not think of that then.`,
                `He wound both legs round my neck and would not let go. The strength in those legs was enough to choke me. It was like an iron collar. I tried to work my fingers in and could not get even one finger under. Then I knew. Those were not an old man's legs. Where such strength lived in that light body, I do not know.`,
                `From then on the old man never came down off my back. When I slept, he slept on my back; when I walked, he kicked my sides to steer me. My back had become his house. I had to pick the food, too. Then he reached down from above and took it. If he wanted fruit picked, I picked it; if he wanted water drawn, I drew it. Be even a little slow, and he kicked my ribs. I learned to sleep sitting up.`,
                `So many months passed. I gave up counting the days. My back bent and my legs shook. Had there been a mirror, I would not have known myself. Carry a load long enough and you bend to its shape. You have carried loads yourself, so you know. My voice stopped coming, too. Because there was nothing to say it for. Then one day I thought of a way. Since strength would not do it, I looked for another road.`,
                `Great gourds grew on that island. I picked one and hollowed it out. A gourd the size of a grown man's head. And I squeezed grapes into it and left it a few days. There were a great many grapes on that island. Vines ran through every valley. Nobody picked them, so they ripened and fell where they were.`,
                `The juice fermented and became wine. After a few days there was the smell of it. I drank it and pretended to feel wonderful. I laughed loudly on purpose. I sang and danced. I did it with a man on my back. I laughed while he was choking me. That was the hardest part. I made big movements on purpose so the one on my back was jolted. Only then would he wonder what I had been drinking.`,
                `The old man on my back saw it and snatched the gourd. He wanted to drink too. And he drank it all. Down in one go. A little later the strength went out of those legs. What had been choking my neck slid loose.`,
                `I set him down off my back. Only then did my neck straighten. And I got away from that place. I went to the shore without looking back. A few days later a passing ship picked me up. I had waved my clothes from the beach as a signal. Had that ship not passed, I would have grown old on that island. When I think of it, even now my neck aches. The men on that ship heard my story and said this:<br>"They call him the Old Man of the Sea. Of all who have carried him on their backs, you are the first to come home alive."`,
                `When the story ended, Sindbad the porter asked this:<br>"Why does that old man do it?"<br>"I do not know."<br>"Then why did you carry him?"`,
                `Sindbad the sailor said nothing for a moment. Then he said this:<br>"Because he looked pitiful."<br>"Do you regret it?"<br>"No."<br>"Why not?"<br>"If I had turned away then, I would have turned away the next time too. And then, when I met somebody truly pitiful, I would not have carried them either."<br>And then he added,<br>"Only, from now on, I think first about how to set them down."`
            ]
        },
        {
            title: 'The Flying Wooden Horse',
            paras: [
                `A certain king of Persia held a New Year feast. Three men came to it bringing marvels. People came from inside the country and beyond for the New Year feast. They came hoping to offer the king some marvel and receive a reward.`,
                `The first man brought a peacock made of gold. Every hour it beat its wings and cried. The second brought a brass trumpeter. Set on the city gate, it would see an enemy coming and blow its trumpet. The guards might fall asleep, but it never would. The king was pleased with that.`,
                `The third man brought a horse made of black wood. To look at, it was just a carving of a horse. Unpainted black wood. People thought it a poor thing. Because the first two had gleamed with gold and brass. The man said,<br>"This one flies."`,
                `People laughed. The man mounted the horse and turned a peg below its neck. And the horse rose. Its hooves lifted a foot off the ground and then it shot upward. It circled once above the citadel and came down. It made no sound as it landed. After that, nobody laughed.`,
                `The king was greatly astonished.<br>"What do you want?"<br>"Give me the princess as my wife."`,
                `The king put off his answer. He could not hand over his daughter like that. But Prince Kamar was there. The prince was dying to ride that horse. While his father delayed his answer, he went down into the courtyard. And he said to the maker of the horse,<br>"Let me try it once."`,
                `The prince mounted the horse and turned the peg. The horse rose. And kept rising. The prince had not asked how to come down. He had seen only the peg that went up, and climbed on. The maker had been about to tell him. But the prince had not waited. When people see a marvel, that is usually what they do.`,
                `The horse climbed through the clouds. The prince could hardly breathe. The higher he went, the colder the wind. Below, the citadel was the size of a fingernail. Shout as he might, nobody could hear. Only then did the prince feel over the horse's neck and shoulders. He looked only once he was afraid.`,
                `There was one more peg on the shoulder. When he turned it, the horse began to descend.`,
                `That night the prince came down on the palace roof of a very distant country.`,
                `The country was called Bengal. The prince had never heard even its name. He did not know the language. And yet things worked out. For several days he got by on gestures and looks. And there he met the princess. The two of them took to each other.`,
                `The prince put the princess on the horse and flew home.`,
                `The man who made the wooden horse came to take it back. While the prince was away, he tricked the princess onto the horse and flew off with her.`,
                `The prince searched the whole world for the princess. And at last he found her in a certain country.`,
                `The man who made the wooden horse had come down in that country and been caught, and so the princess and the wooden horse had fallen into the hands of its king. The king wanted to make the princess his wife. She hated the thought, so she would not speak and would not eat. The king believed she had fallen ill, and was worried. The prince went into that palace pretending to be a physician. He carried a box of medicines. He had found a physician's robe and stuck on a beard. Nobody in that palace knew him.`,
                `And he said quietly to the princess,<br>"Do you know where the wooden horse is in this palace?"<br>"I do."`,
                `The prince told the king that to cure the princess, she must be brought beside the wooden horse. Once she was beside the horse, the two of them mounted it and flew away.`
            ]
        },
        {
            title: 'Caliph for a Night',
            paras: [
                `In Baghdad there was a caliph called Harun al-Rashid. The caliph is the highest person in that land. At night Harun would change his clothes and walk about the city. He often dressed as a merchant. He took only one or two attendants. Outside the palace he gave a different name.`,
                `He wanted to see how the people really lived.`,
                `One night, on a bridge, he met a young man. His name was Abu Hasan. He lived comfortably on what his father had left him. Abu Hasan took Harun, a stranger to him, home and gave him a meal. He did not even ask who he was. He put everything on the table. In that country in those days, that was how a traveller was treated.`,
                `As the two of them talked, Abu Hasan said this:<br>"I have one wish."<br>"What is it?"<br>"I would like to be caliph for just one day."<br>"And why is that?"<br>"There are four wicked men in my quarter. I would like to rule over them for just one day."`,
                `Harun laughed at that. And that night he put a little sleeping draught into Abu Hasan's cup. Abu Hasan did not notice. The night was late and the talk was in full flow. The cup had gone round several times. Soon after he emptied it, his speech slowed. Then he slumped forward where he sat and slept.`,
                `Harun had him carried to the palace. And he told his attendants this:<br>"When this man wakes tomorrow, treat him as caliph for one day."`,
                `The next morning Abu Hasan woke. He was lying in a silken bed, and people were bowing to the floor.<br>"Commander of the Faithful, you are awake."`,
                `Abu Hasan thought he was dreaming. He bit the back of his hand. If it was a dream, he thought, it would not hurt. It hurt. That confused him even more. Because if it was not a dream, he could not tell what it was.`,
                `That day Abu Hasan played the caliph. And there was one thing he did first. He ordered the four wicked men of his quarter to be arrested.`,
                `They were brought in. Abu Hasan named their crimes one by one. Who had seized whose field, who had cheated a widow of her money, who had beaten children. He gave the very dates. The four who had been brought in could not say a word.`,
                `Abu Hasan knew it all in great detail. Because he had lived in that quarter a long time. A person in a high place does not know such things. Only somebody who has lived down below knows. The caliph receives reports inside the palace. Such things never reach those reports. Abu Hasan punished the four. After that he ordered money sent to his mother and his neighbours.`,
                `Abu Hasan said this:<br>"That widow's roof leaks and nobody has mended it. Send somebody."`,
                `Beside him, Harun watched all of it. That night Abu Hasan fell asleep again, and when he woke he was in his own house. Harun had given him the sleeping draught again and had him carried home. He did not know whether it had been a dream or not, and was ill for many days over it. When he told people, they all laughed. So in the end he stopped telling.`,
                `Then, some time later, the traveller came again.`,
                `Abu Hasan told him the story. The traveller smiled and took off his hood. Abu Hasan fell to the floor. Harun raised him to his feet.<br>"I saw everything you did that day."<br>"Forgive me."<br>"There is nothing to forgive. For that one day, you knew that quarter better than I did."`,
                `And Harun kept Abu Hasan beside him. From then on Abu Hasan was the one who brought the caliph news from outside. News that could not be heard inside the palace. For one day of playing king, he got a pair of ears for life. Words that travel up to a high person are polished on the way up. He had needed somebody to bring him the unpolished ones.`
            ]
        },
        {
            title: 'The Prince of the Black Islands',
            paras: [
                `A certain king went hunting and lost his way. He had followed a deer and become separated from his party. The sun sank and still he found nobody. He blew his horn and nobody answered. Then he came upon a great lake. It was so clear that every stone on the bottom could be seen. But there was not a trace of anyone along the shore. In that lake swam fish of four colours. White ones and red ones and blue ones and yellow ones. They were mixed in equal numbers. Each colour swam in its own way. The king watched them a long while.`,
                `And across the lake there stood a palace. The king went to it. The great gate stood wide open. There was nobody guarding it.`,
                `Inside there was not a single person. Lamps burned in every room, and a meal was laid on the table. Water ran in the courtyard and the trees were neatly trimmed. Somebody was looking after this house. Steam was rising from the food. It looked as if people had been there a moment ago. But there was no sound at all. No footstep, no voice.`,
                `The king called out loudly. His voice went round the empty rooms and came back. It was the first time the king had heard his own voice return to him. There was no answer. Then, from an inner room, came a sound of weeping. A very low sobbing. On the way toward the sound the king stopped several times. Because the palace was so large. It was the sound of someone holding back and failing.`,
                `The king entered the room. A young man sat on a throne. He was handsome, but his face was full of sorrow. He was dressed as a king. But he did not rise from his seat. He said,<br>"Welcome. Forgive me for not rising to greet you."<br>"It is no matter."<br>"It is that I cannot rise."`,
                `And he drew back the hem of his robe. The king bent toward him. From the waist down he was stone. Black stone to the tips of his toes. It was cold to the touch. And he said he felt nothing there. The king stood frozen. The man was half human and half stone.`,
                `The young man began his story. He had been the king of a country called the Black Islands. A country of four islands. Years before, there had been a great betrayal in that country. It was done by the one closest to him.`,
                `The one who plotted it knew sorcery. A person who had studied it for a very long time. In all that time nobody noticed. That person turned the king into this, and cast a spell on the whole country as well. It happened in a single night. People who went to bed in the evening were under water by morning. Nobody knew what had happened. The whole city of that country became a lake. Houses and roads all sank under the water. And the people of the city became fish. The four colours were the four tribes of that land.`,
                `"I sit here every day and look at that lake."<br>Because the lake had been his country. All his people were in that water.<br>The king heard the whole story and asked this:<br>"Is there a way to break the spell?"<br>"There is. But to do it, one must risk one's life."`,
                `The king decided to do it. He risked his life for another country's trouble. The one who had cast the spell came every night to a certain room deep inside the palace. The king hid in that room and imitated the voice of the one the sorcerer trusted and leaned on. He said that the weeping of the people who had become fish kept him awake every night, and asked for the spell to be lifted. Had he been found out, he would have lost his life on the spot. Not knowing it was a trick, the sorcerer went out to the lakeshore and spoke the spell.`,
                `The king did it, and the spell broke. The earth shook hard. For a long while there was the sound of water draining away. And the wet roofs appeared one by one. The lake vanished and the city stood in its place again. The houses and roads and wells were all as they had been. Years under water, and yet unchanged. Being done by magic, it seems, it was so. The fish became people. The young king's body, too, was freed from the stone. Where the water had drained, people stood up.`,
                `The one who had been selling in the market stood where he had sold, and the one who had been cooking stood before her stove. The fire was still burning. Steam rose from the pot. They did not know that years had passed. They did not know they had been fish. Only those people had not lived through them.`,
                `But the young king did not go back to his own country. The place where the city had stood was so remote that it had become hard to live in. The waterways were cut and the fields had all gone to ruin.`,
                `The king who had come hunting said this:<br>"Come to my country. I have no son."<br>It did not take long to say. In that one day the two of them became that to each other.`,
                `So the people of the Black Islands moved to that king's country to live. It was a whole country moving. People and animals and carts went in a long line. The hunting king had reached that place in a single day, yet the journey back took a whole year. The magic had drawn the two countries close together, and when it was broken the distance went back to what it had been. Children were born on the way. Those children were born in a place that belonged to neither country. There were several such children that year, they say.`
            ]
        },
        {
            title: 'The Price of a Story',
            paras: [
                `Scheherazade's stories did not end there. Sometimes, before one tale was finished, another began inside it. There were stories from India, and stories from Persia and Egypt. Merchants travelling by camel had carried them from place to place. Scheherazade kept them all in her memory and brought out one each night.`,
                `Scheherazade told stories for a thousand and one nights. Nearly three years. In all that time she did not miss a single night. She bore three children and raised them while she told her stories.`,
                `On the thousand and first night, Scheherazade finished her story and said this:<br>"My lord, now I have run out of stories."`,
                `And she had the three children brought in.<br>"Do not leave these children without a mother."`,
                `The king said nothing for a long while. Then he said this:<br>"I will not kill you."<br>"Thank you."<br>"But that is not something I decided today."<br>"When did you decide it?"<br>The king said,<br>"Very long ago. Even I do not know exactly when."`,
                `The way Scheherazade risked her life was not a fight. Nor was it pleading. Not once did she beg for her life. Had she begged, it would have ended that first night. She was a person who knew that.`,
                `She told stories. Every day she set one more person's life before the king. Over a thousand nights, a thousand people passed before him. A fisherman, a porter, a thief, a prince. People the king had never met. Because such people do not come inside a palace.`,
                `Listening to those stories for a thousand nights, the king came to see people afresh. It happened without his knowing. Hating people is easy. You can hate a person without once seeing their face. But having heard a person's story to the end, hating them is hard. Scheherazade knew that. She staked a thousand nights on it. She did not win by fighting. She won by making him listen.`
            ]
        }
    ],
    afterword: {
        title: 'After Reading',
        paras: [
            `The title of this book is The Arabian Nights. But its original title is The Thousand and One Nights.`,
            `Why a thousand and one nights is told in the first chapter. Scheherazade tells one story each night, and the king, wanting to know what happens next, puts off that day's execution. That goes on for a thousand and one nights.`,
            `So this is a book of stories inside a story. And that frame itself is the meaning of the book. A story saved a life.`,
            `This book has no author. Stories from many countries and many ages gathered into it over several hundred years.`,
            `There are stories from India, stories from Persia, and stories added in Arabia and Egypt. So it is not the book of one country but a book gathered along an old road. So there are places where the tales disagree. In one the genie wants to kill a man; in another the genie runs errands.`,
            `That road is the Silk Road. Not only goods travelled it; stories travelled it too. Because when you drive camels for months, there is nothing to do at night but tell stories.`,
            `The oldest fragment is reckoned to be about twelve hundred years old. And about five hundred years ago it was bound into something like its present shape.`,
            `It became known in Europe about three hundred years ago. It began when a Frenchman called Antoine Galland translated an Arabic manuscript into French.`,
            `And here is an interesting fact. The tales of Aladdin and Ali Baba, which you know so well, were not in the Arabic manuscript.`,
            `Galland heard them from a storyteller who had come from Syria, and wrote them in. The man's name, it is said, was Hanna Diyab. So the two most famous stories in this book came in later.`,
            `The diary of that man, Hanna Diyab, was found later. In it he tells of meeting Galland. So the name of the person who made up Aladdin is, in a sense, still with us.`,
            `In Galland's version, the Aladdin story is set in China. To the people of Arabia, China was a very distant country, a country where anything could happen.`,
            `Set a story in a distant land and it becomes free. Because nobody knows how things are there. Storytellers have used that trick for a very long time.`,
            `What is gathered here are well-known tales, chosen and retold. The original holds hundreds of such tales, and one sometimes begins inside another, so a full translation runs to many volumes.`,
            `The original also has many passages not fit for children. There are cruel passages and grown-up stories. Those have not been carried over here, and what the king in the first chapter did is set down only briefly.`,
            `Now let us pick out some places worth a second look.`,
            `First, read the frame of the first chapter again. Deceived by the person closest to him, the king could no longer trust anyone. So every day he marries anew, and the next day he takes that person's life.`,
            `Scheherazade walks into that place of her own will. She goes though her father forbids it. And she carries no weapon at all. She goes with nothing but stories.`,
            `And she takes her sister Dunyazad with her. So that each night can begin with the sister begging for a story. Even that she had planned in advance.`,
            `So what Scheherazade did was not only to know stories. It was to plan how to begin them and where to stop.`,
            `So the hero of this book is neither Aladdin nor Sindbad. It is Scheherazade. What she does for a thousand and one nights is the whole book.`,
            `Second, count the places where the stories break off. Scheherazade always stops just before daybreak. At the most tantalising point.`,
            `That was how she stayed alive. And it is also the trick that storytellers still use today. Think of how a serial always ends.`,
            `A thousand and one nights is a little short of three years. In all that time Scheherazade never missed a night. So she was a person who knew a very great many stories.`,
            `Third, look again at the genie in the jar. The fisherman hauls up the jar and opens the lid. The genie who comes out says he will kill him.`,
            `He will kill the one who rescued him. Asked why, he gives his answer. For the first hundred years he meant to reward whoever freed him richly, but nobody came, and his heart changed.`,
            `That passage is funny and frightening at once. It shows, very briefly, what happens to a heart that waits too long.`,
            `And look at how the fisherman beats the genie. Not by strength. By wit. The stories in this book mostly turn out that way.`,
            `The fisherman asks the genie a question. How did so big a body fit into this little jar? The genie goes back in to show him. And the fisherman shuts the lid.`,
            `And this time the fisherman sets the terms. When the strong one is in the jar, the weak one does the reckoning.`,
            `Fourth, read Aladdin again. At the start Aladdin is a lazy boy who does nothing. His mother spins thread and they barely eat.`,
            `That boy gets the lamp. But the story does not end when he gets it. Losing the lamp is half the story.`,
            `And what wins the lamp back is not magic but Aladdin's own wit. Between the two, he has changed.`,
            `When he first got the lamp, Aladdin knew nothing. He went into the cave only because the sorcerer told him to. But once the lamp is stolen, he does his own reckoning.`,
            `Fifth, look again at Ali Baba. The one who actually gets things done in this story is not Ali Baba. It is the servant Morgiana.`,
            `It is she who notices the thieves hiding in the jars, and she who deals with them. Ali Baba knows nothing of it all along, and learns the truth only later.`,
            `So there are several places in this book where a person of low station solves the story. Scheherazade, Morgiana, and the fisherman all do.`,
            `And in these stories a price is always paid. At the end Morgiana marries Ali Baba's son and becomes one of the family. Going from servant to family: that was the reward she received.`,
            `Sixth, look again at the flying wooden horse. The biggest problem in that story is not flying but landing. The prince climbs on having seen only the peg that goes up, and looks for the peg that brings him down only once he is afraid.`,
            `People have dreamed of flying in stories for a very long time. When people really did build aeroplanes, steering and landing safely were every bit as hard as getting off the ground.`,
            `It helps to know something of the times. These stories gathered in cities like Baghdad and Cairo. A thousand years ago, those were the biggest cities in the world.`,
            `In Baghdad there was a place called the House of Wisdom. There, books from many lands were gathered and translated into Arabic. The learning of Greece and India and Persia was carried on from there.`,
            `That is why the figures we write are called Arabic numerals. They came originally from India, and the Arabs refined them and passed them to Europe.`,
            `And those cities were the centres of trade. The story of Sindbad setting out by ship is not simply invented. In those days Arab merchants really did sail as far as India and China.`,
            `The stories heard along those sea roads became the Sindbad tales. The roc and the Old Man of the Sea probably came from such rumours.`,
            `That Sindbad sails seven times is worth noticing too. Each time he meets great trouble and swears never to go again, yet after a while he goes out again. Why did he keep going?`,
            `There are two Sindbads in the story. Sindbad the sailor and Sindbad the porter. The two of them sitting face to face, trading stories, is the frame of that tale.`,
            `So this book is also a map of the old world. How far people went and what they heard has survived as stories.`,
            `This book holds on to two things.`,
            `One is what a story can do. The frame of this book is itself the answer. Scheherazade guards her own life with stories, and guards the lives of those who would have come after her.`,
            `And when the thousand and one nights have passed, the king is changed. A person who has heard more than a thousand stories could not be the same as before.`,
            `The other is what people use to escape a tight place. In this book's stories, winning by force is rare. They are mostly solved by wit and words.`,
            `That is probably one reason this book has been loved so long. Because in these stories, the powerless can win too.`,
            `After this book reached Europe, countless writers were influenced by it. Many learned the trick of putting stories inside stories from here.`,
            `And Aladdin's lamp, open sesame, and the flying carpet are now words the whole world knows.`,
            `Only, as Europeans translated this book, they fell into the habit of painting Arabia as nothing but a mysterious and exotic place. That picture differs from the real land and its people. That is worth knowing too.`,
            `If you ever read this book again, this time count where Scheherazade stops each story. The skill of choosing that place is this book's real art.`,
            `Lastly, here are some things to think about. I shall not write down the answers.`,
            `Was Scheherazade right to walk into that place of her own will? She risked her life. Was there no other way?`,
            `How should we see the genie in the jar changing his mind? Is a heart that changes after long waiting something only that genie has?`,
            `And what if Aladdin had never got the lamp? This story begins with luck and ends by his own doing. Which of the two matters more? That question is not easy to answer even when you read the book again as a grown-up.`
        ]
    },
    quiz: [
        { q: 'Why did Scheherazade stop each story partway through every night?', choices: ['Because her throat hurt late at night', 'So the king would want to know what happened next', 'Because she had not yet made up the next story'], answer: 1 },
        { q: 'What did the genie in the jar resolve during his last hundred years?', choices: ['To make whoever freed him a king', 'To kill whoever freed him', 'To make whoever freed him his slave'], answer: 1 },
        { q: 'How did the fisherman get the genie back into the jar?', choices: ['By saying he could not believe so big a body had fitted inside', 'By reading aloud the letters carved on the jar', 'By using one of his three wishes on it'], answer: 0 },
        { q: 'Who took Aladdin to the cave?', choices: ['A neighbour his mother had asked', 'A merchant from a neighbouring country', 'A sorcerer pretending to be his uncle'], answer: 2 },
        { q: 'Why was Aladdin shut in the cave?', choices: ['Because he would not throw up the lamp first', 'Because he touched the jewels in the cave', 'Because he said the spell backwards'], answer: 0 },
        { q: 'Why did Aladdin lose his palace?', choices: ['Because he never told his wife what the lamp was', 'Because he opened the palace gate to the sorcerer', 'Because he left the lamp on a windowsill and went hunting'], answer: 0 },
        { q: 'Ali Baba did not take all the gold from the cave. Who did the opposite?', choices: ['The thieves, who refilled it every year', 'Morgiana, who never touched it at all', 'His brother Kasim, who went with ten donkeys'], answer: 2 },
        { q: 'Why could Kasim not get out of the cave?', choices: ['Because the thieves came back first', 'Because, looking at the gold, he forgot the word', 'Because his donkeys took fright and ran away'], answer: 1 },
        { q: "Who saved Ali Baba's house again and again?", choices: ['Morgiana, who did the housework', 'The oil seller who lived next door', "Ali Baba's wife"], answer: 0 },
        { q: "Why did Sindbad tie himself to the roc's leg?", choices: ['Because he wanted to take its egg', 'Because he wanted to see the far side of the island', 'Because he would starve if he stayed on that island'], answer: 2 },
        { q: 'How did Sindbad get out of the valley of diamonds?', choices: ['He tied himself to a lump of meat thrown from above', 'He climbed the valley wall hand over hand', 'He walked out along the path the snakes used'], answer: 0 },
        { q: 'How did Sindbad get the Old Man of the Sea off his back?', choices: ['By going into the water and washing him off', 'By getting him to drink wine from a gourd', 'By rubbing against a tree to scrape him off'], answer: 1 },
        { q: 'What trouble did the prince meet the first time he rode the wooden horse?', choices: ['He had not asked beforehand how to come down', 'The horse broke apart in flight', 'He had learned the wrong way to mount'], answer: 0 },
        { q: 'What was the first thing Abu Hasan did as caliph for a day?', choices: ['He cancelled a whole year of taxes for the country', 'He had a big house built for his mother', 'He had the four wicked men of his quarter arrested'], answer: 2 },
        { q: 'What does this book reveal about the tales of Aladdin and Ali Baba?', choices: ['They were in the oldest manuscript from the start', 'They are not in the Arabic original and were added later', 'They are written as tales Scheherazade made up'], answer: 1 },
        { q: 'How did Scheherazade stake her life?', choices: ['By confessing her fault to the king and begging forgiveness for years', 'By winning over the king’s ministers one by one', 'By telling other people’s stories for a thousand nights'], answer: 2 },
        { q: 'Which of these is NOT a fair thing to say after reading this book?', wide: true, choices: ['Seeing how Scheherazade stopped every night at the most exciting point, curiosity can keep a person alive one more day.', 'Seeing how the one who guarded Ali Baba’s house was Morgiana, who cooked and drew water, it was not the master who protected the house but the servant.', 'Seeing how the princess traded the old lamp for a new one, she must have known what that lamp was.', 'Seeing how Sindbad carried the Old Man out of pity and still did not regret it, even after being tricked he did not take back the pity.'], answer: 2 }
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
    emoji: '🪔',
    art: ['end.webp'],
    paras: [
        `이 책의 제목은 『아라비안나이트』입니다. 아라비아의 밤이라는 뜻입니다. 그런데 원래 제목은 『천 하고도 하룻밤』입니다. 우리말로는 『천일야화』라고도 합니다.`,
        `왜 천 하룻밤인지는 첫 장에 나옵니다. 셰에라자드가 밤마다 이야기를 하나씩 하고, 다음 이야기가 궁금해서 왕이 그날의 처형을 미룹니다. 그것이 천 하룻밤 이어집니다.`,
        `그러니 이 책은 이야기 안에 이야기가 든 책입니다. 그리고 그 틀 자체가 이 책의 뜻입니다. 이야기가 사람을 살린 것입니다.`,
        `이 책에는 지은이가 없습니다. 여러 나라와 여러 시대의 이야기가 몇백 년에 걸쳐 모여든 것입니다.`,
        `인도에서 온 이야기가 있고, 페르시아에서 온 이야기가 있고, 아라비아와 이집트에서 붙은 이야기가 있습니다. 그러니 이것은 한 나라의 책이 아니라 오래된 길 위에서 모인 책입니다. 그래서 서로 어긋나는 대목도 있습니다. 어떤 편에서는 마신이 사람을 죽이려 들고, 어떤 편에서는 마신이 심부름을 합니다.`,
        `그 길이 바로 비단길입니다. 물건만 오간 것이 아니라 이야기도 함께 오갔습니다. 낙타를 몰고 몇 달을 가는 동안 밤마다 할 일이 이야기밖에 없었기 때문입니다.`,
        `제일 오래된 조각은 천이백 년쯤 전 것으로 헤아려집니다. 그리고 오백 년 전쯤에 지금과 비슷한 모양으로 묶였습니다.`,
        `유럽에 알려진 것은 삼백 년쯤 전입니다. 프랑스의 앙투안 갈랑이라는 사람이 아랍 원고를 프랑스말로 옮기면서부터입니다.`,
        `그런데 여기에 재미있는 사실이 있습니다. 여러분이 잘 아는 알라딘과 알리바바 이야기는 아랍 원고에 없었습니다.`,
        `갈랑이 시리아에서 온 한 이야기꾼에게 들은 것을 적어 넣은 것입니다. 그 사람의 이름은 한나 디아브라고 전합니다. 그러니 이 책에서 제일 유명한 두 이야기는 나중에 들어온 것입니다.`,
        `한나 디아브라는 그 사람의 일기가 나중에 발견되었습니다. 그 안에 갈랑을 만난 이야기가 적혀 있습니다. 그러니 알라딘을 지은 사람의 이름이 이제는 남아 있는 셈입니다.`,
        `갈랑이 옮긴 알라딘 이야기는 배경이 중국으로 되어 있습니다. 아라비아 사람들에게 중국은 아주 먼 나라, 무슨 일이든 일어날 수 있는 나라였습니다.`,
        `먼 나라를 배경으로 삼으면 이야기가 자유로워집니다. 그 나라 사정을 아는 사람이 없기 때문입니다. 이야기꾼들이 오래 써 온 방법입니다.`,
        `여기 실린 것은 널리 알려진 이야기들을 골라 옮긴 것입니다. 원작에는 이런 이야기가 수백 편 들어 있고, 한 편 안에서 다른 편이 시작되기도 해서 다 옮기면 여러 권이 됩니다.`,
        `원작에는 아이가 읽기에 맞지 않는 대목도 많습니다. 잔인한 대목도 있고 어른의 이야기도 있습니다. 여기서는 그런 대목을 옮기지 않았고, 첫 장의 왕이 하던 일도 짧게만 적어 두었습니다.`,
        `이제 다시 볼 대목을 짚어 봅시다.`,
        `첫째, 첫 장의 틀을 다시 읽어 보십시오. 왕은 가장 가까운 사람에게 속은 뒤로 아무도 믿지 못하게 되었습니다. 그래서 날마다 새로 혼인하고 이튿날 그 사람의 목숨을 빼앗습니다.`,
        `셰에라자드는 스스로 그 자리에 들어갑니다. 아버지가 말리는데도 갑니다. 그리고 무기를 하나도 들고 가지 않습니다. 이야기 말고는 아무것도 없이 갑니다.`,
        `그리고 동생 두냐자드를 함께 데려갑니다. 밤마다 동생이 언니에게 이야기를 해 달라고 조르는 것으로 시작하기 위해서입니다. 그것까지 미리 짜 두었던 것입니다.`,
        `그러니 셰에라자드가 한 일은 이야기를 아는 것만이 아니었습니다. 그 이야기를 어떻게 시작하고 어디서 끊을지를 짠 것입니다.`,
        `그러니 이 책의 주인공은 알라딘도 신드바드도 아닙니다. 셰에라자드입니다. 그 사람이 천 하룻밤 동안 하는 일이 이 책 전체입니다.`,
        `둘째, 이야기가 끊기는 자리를 세어 보십시오. 셰에라자드는 늘 날이 밝기 직전에 이야기를 멈춥니다. 제일 궁금한 데서 멈춥니다.`,
        `그것이 그 사람이 살아남는 방법이었습니다. 그리고 이야기를 만드는 사람들이 지금도 쓰는 방법이기도 합니다. 연속극이 늘 그렇게 끝나는 것을 떠올려 보십시오.`,
        `천 하룻밤이면 세 해가 조금 못 됩니다. 그동안 셰에라자드는 하룻밤도 거르지 않았습니다. 그러니 이 사람은 이야기를 아주 많이 아는 사람이었습니다.`,
        `셋째, 항아리 속의 마신을 다시 보십시오. 어부가 항아리를 건져 올려 뚜껑을 엽니다. 그 안에서 나온 마신이 어부를 죽이겠다고 합니다.`,
        `구해 준 사람을 죽이겠다는 것입니다. 왜냐고 물으니 답이 나옵니다. 처음 백 해 동안은 꺼내 주는 사람에게 큰 상을 주겠다고 마음먹었는데, 아무도 오지 않아서 마음이 바뀌었다는 것입니다.`,
        `그 대목은 웃기면서 무섭습니다. 오래 기다린 마음이 어떻게 되는지를 아주 짧게 보여 줍니다.`,
        `그리고 어부가 그 마신을 이기는 방법을 보십시오. 힘으로 이기지 않습니다. 꾀로 이깁니다. 이 책의 이야기들은 대개 그렇게 풀립니다.`,
        `어부는 마신에게 되묻습니다. 그렇게 큰 몸이 이 작은 항아리에 어떻게 들어갔느냐고요. 마신이 보여 주려고 다시 들어갑니다. 그러자 어부가 뚜껑을 닫습니다.`,
        `그리고 이번에는 어부가 조건을 겁니다. 힘이 센 쪽이 항아리 안에 있으면 힘없는 쪽이 셈을 하게 됩니다.`,
        `넷째, 알라딘을 다시 읽어 보십시오. 알라딘은 처음에 게으르고 아무것도 하지 않는 아이로 나옵니다. 어머니가 실을 자아 겨우 먹고삽니다.`,
        `그런 아이가 램프를 얻습니다. 그런데 이 이야기는 램프를 얻고 끝나지 않습니다. 램프를 빼앗기고 나서가 이야기의 절반입니다.`,
        `그리고 램프를 되찾는 것은 마술이 아니라 알라딘 자신의 꾀입니다. 그 사이에 그 사람이 달라진 것입니다.`,
        `처음에 램프를 얻을 때 알라딘은 아무것도 몰랐습니다. 마법사가 시키는 대로 굴에 들어갔을 뿐입니다. 그런데 램프를 빼앗기고 나서는 스스로 셈을 합니다.`,
        `다섯째, 알리바바를 다시 보십시오. 이 이야기에서 실제로 일을 해내는 사람은 알리바바가 아닙니다. 하녀 모르지아나입니다.`,
        `도둑들이 항아리에 숨은 것을 알아채는 것도, 그것을 처리하는 것도 그 사람입니다. 알리바바는 그동안 아무것도 모르고 있다가 나중에야 그 사실을 압니다.`,
        `그러니 이 책에는 낮은 자리에 있는 사람이 이야기를 푸는 대목이 여럿 있습니다. 셰에라자드도, 모르지아나도, 어부도 그렇습니다.`,
        `그리고 이 이야기들에는 값을 치르는 대목이 늘 따라옵니다. 모르지아나는 마지막에 알리바바의 아들과 혼인해 그 집 식구가 됩니다. 부리던 사람에서 식구가 된 것, 그것이 그 사람이 받은 상이었습니다.`,
        `여섯째, 하늘을 나는 나무 말을 다시 보십시오. 이 이야기에서 제일 큰 문제는 나는 것이 아니라 내리는 것입니다. 왕자는 오르는 손잡이만 보고 올라탔다가, 무서워지고 나서야 내리는 손잡이를 찾습니다.`,
        `사람은 이렇게 오래전부터 하늘을 나는 꿈을 이야기로 꾸었습니다. 실제로 비행기를 만들 때도 뜨는 것 못지않게 방향을 틀고 무사히 내려앉는 일이 어려웠습니다.`,
        `그 시절 사정도 알아 두면 좋습니다. 이 이야기들이 모인 곳은 바그다드와 카이로 같은 도시입니다. 천 년쯤 전 그 도시들은 세계에서 가장 큰 도시였습니다.`,
        `바그다드에는 지혜의 집이라는 곳이 있었습니다. 여러 나라 책을 모아 아랍말로 옮기던 곳입니다. 그리스와 인도와 페르시아의 학문이 거기서 이어졌습니다.`,
        `우리가 쓰는 숫자를 아라비아 숫자라고 부르는 것도 그 때문입니다. 본디 인도에서 나온 것을 아라비아 사람들이 다듬어 유럽에 전한 것입니다.`,
        `그리고 그 도시들은 장사의 중심이었습니다. 신드바드가 배를 타고 나가는 이야기는 그냥 지어낸 것이 아닙니다. 실제로 그 시절 아라비아 상인들이 인도와 중국까지 배를 타고 다녔습니다.`,
        `그 뱃길에서 들은 이야기들이 신드바드 이야기가 되었습니다. 로크 새도, 바다의 노인도, 그런 소문에서 왔을 것입니다.`,
        `신드바드가 일곱 번 배를 타는 것도 눈여겨볼 만합니다. 그때마다 큰일을 겪고 다시는 안 나가겠다고 하는데, 얼마 지나면 또 나갑니다. 그 사람은 왜 자꾸 나갔을까요.`,
        `이야기 안에는 신드바드가 둘 나옵니다. 배를 타는 신드바드와 짐을 나르는 신드바드입니다. 두 사람이 마주 앉아 이야기를 주고받는 것이 그 이야기의 틀입니다.`,
        `그러니 이 책은 옛 세계 지도이기도 합니다. 어디까지 가 보았고 무엇을 들었는지가 이야기로 남은 것입니다.`,
        `이 책이 붙들고 있는 것은 두 가지입니다.`,
        `하나는 이야기가 무엇을 할 수 있느냐는 것입니다. 이 책의 틀 자체가 그 답입니다. 셰에라자드는 이야기로 자기 목숨을 지키고, 다음 사람들의 목숨도 지킵니다.`,
        `그리고 천 하룻밤이 지났을 때 왕이 달라져 있습니다. 이야기를 천 개 넘게 들은 사람이 그 전과 같을 수는 없었던 것입니다.`,
        `다른 하나는 사람이 무엇으로 곤경을 벗어나느냐는 것입니다. 이 책의 이야기들에서 힘으로 이기는 경우는 드뭅니다. 대개 꾀와 말로 풉니다.`,
        `그것이 이 책이 오래 사랑받은 까닭 가운데 하나일 것입니다. 힘이 없는 사람도 이길 수 있는 이야기이기 때문입니다.`,
        `이 책이 유럽에 전해진 뒤 수많은 작가들이 그 영향을 받았습니다. 이야기 안에 이야기를 넣는 방식도 여기서 배운 사람이 많습니다.`,
        `그리고 알라딘의 램프, 열려라 참깨, 하늘을 나는 양탄자 같은 것은 이제 온 세계 사람이 아는 말이 되었습니다.`,
        `다만 유럽 사람들이 이 책을 옮기면서 아라비아를 신비하고 야릇한 곳으로만 그리는 버릇이 생겼습니다. 실제 그 땅과 사람들과는 다른 그림입니다. 그것도 알아 두는 것이 좋습니다.`,
        `언젠가 이 책을 다시 읽게 되거든, 이번에는 셰에라자드가 어느 자리에서 이야기를 멈추는지 세어 보십시오. 그 자리를 고르는 솜씨가 이 책의 진짜 재주입니다.`,
        `마지막으로 생각해 볼 것을 남겨 둡니다. 답은 적어 두지 않겠습니다.`,
        `셰에라자드가 스스로 그 자리에 들어간 것은 잘한 일이었을까요? 그 사람은 자기 목숨을 걸었습니다. 다른 방법은 없었을까요?`,
        `항아리 속의 마신이 마음을 바꾼 것을 우리는 어떻게 보아야 할까요? 오래 기다리다 마음이 바뀌는 것은 그 마신만의 일일까요?`,
        `그리고 알라딘이 램프를 얻지 못했다면 어떻게 되었을까요. 이 이야기는 요행으로 시작해서 스스로 끝냅니다. 그 둘 가운데 무엇이 더 중요할까요. 이 물음은 어른이 되어 다시 읽어도 답하기가 쉽지 않습니다.`
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
    title: `아라비안나이트`,
    tag: `여러 나라에서 전해 온 이야기`,
    intro: [
        `사람을 믿지 못하게 된 왕 앞에서, 셰에라자드가 천 하룻밤 동안 이야기를 이어 갑니다. 재미있어지는 대목에서 늘 멈춥니다.`,
        `그 안에서 나온 이야기 가운데 여덟 편을 골라 담았습니다.`
    ]
};

function coverPage() {
    const cv = CV();
    return `<div class="page page-cover">
 <div class="story-page-left story-page-left-full">
 ${artFrame('cover.webp', '🌙')}
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
    { q: "셰에라자드가 이야기를 밤마다 중간에서 멈춘 까닭은 무엇입니까?", choices: ["밤이 깊어 목이 아팠기 때문에", "왕이 뒷이야기를 궁금해하게 하려고", "다음 이야기를 아직 못 지어서"], answer: 1 },
    { q: "항아리 속 마신이 마지막 백 해 동안 한 결심은 무엇입니까?", choices: ["꺼내 준 이를 왕으로 만들겠다", "꺼내 준 이를 죽이겠다", "꺼내 준 이를 종으로 삼겠다"], answer: 1 },
    { q: "어부가 마신을 다시 항아리에 넣은 방법은 무엇입니까?", choices: ["그 큰 몸이 들어갔다는 것을 못 믿겠다고 해서", "항아리에 새긴 글자를 소리 내어 읽어서", "소원 세 가지 가운데 하나로 그것을 빌어서"], answer: 0 },
    { q: "알라딘을 굴로 데려간 사람은 누구입니까?", choices: ["어머니가 부탁한 이웃", "이웃 나라에서 온 상인", "삼촌 행세를 한 마법사"], answer: 2 },
    { q: "알라딘이 굴에 갇힌 까닭은 무엇입니까?", choices: ["램프를 먼저 던져 올리지 않아서", "굴 안의 보석에 손을 대어서", "주문을 거꾸로 외웠기 때문에"], answer: 0 },
    { q: "알라딘이 궁전을 빼앗긴 까닭은 무엇입니까?", choices: ["램프가 무엇인지 아내에게 말하지 않아서", "마법사에게 궁전 문을 열어 주어서", "램프를 창가에 놓아둔 채 사냥을 나가서"], answer: 0 },
    { q: "알리바바가 굴에서 금을 다 가져가지 않은 것은 무엇과 견주어 다릅니까?", choices: ["도둑들은 해마다 다시 채워 넣었다", "모르지아나는 아예 손을 대지 않았다", "형 카심은 나귀 열 마리를 끌고 갔다"], answer: 2 },
    { q: "카심이 굴에서 나오지 못한 까닭은 무엇입니까?", choices: ["도둑들이 먼저 돌아왔기 때문에", "금을 보는 동안 주문이 생각나지 않아서", "나귀가 놀라 달아나 버렸기 때문에"], answer: 1 },
    { q: "알리바바의 집을 여러 번 구한 사람은 누구입니까?", choices: ["집안일을 하던 모르지아나", "이웃에 살던 기름 장수", "알리바바의 아내"], answer: 0 },
    { q: "신드바드가 로크 새의 다리에 몸을 묶은 까닭은 무엇입니까?", choices: ["그 새의 알을 가져가고 싶어서", "섬 건너편을 보고 싶었기 때문에", "그 섬에 그대로 있으면 굶어 죽어서"], answer: 2 },
    { q: "다이아몬드 골짜기에서 신드바드가 빠져나온 방법은 무엇입니까?", choices: ["위에서 던져진 고깃덩이에 몸을 묶었다", "골짜기 벽을 손으로 짚고 기어올랐다", "뱀들이 다니는 길을 따라 걸어 나왔다"], answer: 0 },
    { q: "바다의 노인을 등에서 내려놓은 방법은 무엇입니까?", choices: ["물속으로 들어가 씻어 내려서", "조롱박에 담근 술을 마시게 해서", "나무에 몸을 비벼 떼어 내서"], answer: 1 },
    { q: "나무 말을 처음 탄 왕자가 겪은 문제는 무엇입니까?", choices: ["내리는 방법을 미리 묻지 않은 것", "말이 날다가 부서져 버린 것", "타는 방법을 잘못 배운 것"], answer: 0 },
    { q: "아부 하산이 하루 동안 칼리프가 되어 제일 먼저 한 일은 무엇입니까?", choices: ["온 나라의 세금을 한 해 없앴다", "어머니에게 큰 집을 지어 주었다", "동네의 못된 사람 넷을 잡아들였다"], answer: 2 },
    { q: "알라딘과 알리바바 이야기에 대해 이 책이 밝힌 사실은 무엇입니까?", choices: ["가장 오래된 사본에 처음부터 들어 있었다", "아랍어 원본에 없고 나중에 실린 이야기다", "셰에라자드가 지어낸 것으로 적혀 있다"], answer: 1 },
    { q: "셰에라자드가 목숨을 건 방법은 무엇입니까?", choices: ["왕에게 잘못을 빌고 오래 용서를 구한 것", "왕의 신하들을 하나씩 자기 편으로 만든 것", "천 밤 동안 남의 이야기를 들려준 것"], answer: 2 },
    { q: "이 책을 읽고 난 반응으로 알맞지 않은 것은 무엇인가요?", wide: true, choices: ["셰에라자드가 밤마다 이야기를 제일 재미있어지는 데서 멈춘 것을 보면, 궁금함이 사람을 하루 더 살리기도 하네.", "알리바바네 집을 지킨 사람이 밥 짓고 물 긷던 모르지아나였던 것을 보면, 집을 지킨 건 주인이 아니라 부리던 사람이었어.", "공주가 헌 램프를 새 램프로 바꿔 준 것을 보면, 공주도 그 램프가 무엇인지 알고 있었던 거야.", "신드바드가 바다의 노인을 딱해서 업어 주고도 후회하지 않는 것을 보면, 당한 뒤에도 딱하게 여긴 마음까지 물리지는 않는구나."], answer: 2 }
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
