const BOOK_TITLE = "토끼전";

const CHAPTER_LABEL = n => (LANG === 'en' ? `Chapter ${n} · ` : `${n}장 · `);

const CHAPTERS = [
    {
        num: 1,
        title: "용왕의 병",
        art: ["story-01-a.webp", "story-01-b.webp", "story-01-c.webp"],
        artAt: ["남해 바다 깊은 곳에 수정으로 지은 궁궐", "잉어 의원이 맥을 짚어 보고", "누가 가겠느냐"],
        paras: [
            "남해 바다 깊은 곳에 수정으로 지은 궁궐이 하나 있었습니다. 기둥은 산호요 지붕은 자개라, 물살이 지날 때마다 온 궁이 무지갯빛으로 일렁였습니다. 그곳을 다스리는 이가 남해 용왕이었습니다. 물고기들이 그 앞을 지날 때면 지느러미를 모으고 고개를 숙였습니다.",
            "그해 봄, 용왕은 큰 잔치를 열었습니다. 동해와 서해와 북해의 용왕들까지 불러 모아 사흘 밤낮을 놀았습니다. 풍악이 그치지 않았고 술잔이 마를 새가 없었습니다. 상에 오른 음식만 백 가지가 넘었습니다.",
            "나흘째 되던 날 아침이었습니다. 용왕이 자리에서 일어나려다 그대로 주저앉고 말았습니다.<br>\"어, 어지럽구나.\" 곁에 있던 시녀들이 놀라 달려들었습니다.",
            "그날부터 용왕은 자리에 누웠습니다. 밥을 넘기지 못하고 물조차 겨우 축였습니다. 온몸이 불덩이처럼 달아올랐다가 이내 얼음장처럼 식었습니다. 밤이면 헛소리를 하기도 했습니다.",
            "수궁이 발칵 뒤집혔습니다. 이름난 의원이란 의원은 다 불려 왔습니다. 잉어 의원이 맥을 짚어 보고, 문어 의원이 온몸을 주물러 보고, 해마 의원이 침을 놓아 보았습니다. 그러나 아무 소용이 없었습니다. 의원들은 하나같이 고개를 젓고 물러났습니다.",
            "약도 지어 보았습니다. 미역과 다시마를 달여 보고, 진주를 갈아 넣어 보고, 천 년 묵은 조개의 살을 고아 보았습니다. 용왕은 한 모금 넘기고는 도로 고개를 저었습니다. 약 냄새만 궁 안에 가득했습니다.",
            "달이 두 번 바뀌었습니다. 그사이 용왕의 얼굴에서 살이 다 빠지고 비늘에서 빛이 사라졌습니다. 신하들은 궁 앞에 모여 서서 발만 굴렀습니다. 궁 안에서 웃음소리가 사라진 지 오래였습니다.",
            "\"이러다 큰일 나겠소.\"<br>\"천하의 명의를 다 데려왔는데 어쩌란 말이오.\"<br>\"바다에 없으면 육지에서라도 찾아야지요.\"",
            "그러나 아무도 육지 이야기를 크게 하지는 못했습니다. 바다에 사는 것들에게 육지란 숨을 쉴 수 없는 무서운 곳이었기 때문입니다. 숨이 막히고 몸이 마르는 곳이라 들었습니다.",
            "그러던 어느 날 밤이었습니다. 잠결에 용왕이 눈을 떠 보니, 침상 곁에 흰 옷을 입은 노인이 서 있었습니다. 수염이 가슴까지 내려오고 손에는 지팡이를 들고 있었습니다. 문은 잠겨 있었고 지키던 군사도 그대로였습니다.",
            "\"뉘, 뉘시오?\"<br>\"나는 이 바다를 오래 지켜본 사람이오. 대왕의 병을 고칠 약을 하나 알고 있어 왔소.\"",
            "용왕이 겨우 몸을 일으켰습니다.<br>\"말씀해 주시오. 무엇이든 구해 오겠소.\"",
            "노인은 한참 동안 용왕을 내려다보았습니다. 그러고는 천천히 입을 열었습니다.<br>\"대왕의 병은 물에서 난 병이 아니오. 그러니 물에서 난 약으로는 낫지 않소.\" 목소리가 물결처럼 낮게 울렸습니다.",
            "\"그럼 어찌해야 합니까?\"<br>\"뭍에 사는 짐승 가운데 토끼라는 것이 있소. 그 토끼의 간을 얻어 잡수시면 씻은 듯이 나을 것이오.\"",
            "\"토끼라…….\" 용왕이 되뇌었습니다. 처음 들어 보는 이름이었습니다. \"그것이 어떻게 생긴 짐승입니까?\"<br>\"귀가 길고 눈이 붉고 뒷다리가 앞다리보다 긴 짐승이오. 산속을 뛰어다니며 풀을 뜯어 먹고 사는데, 겁이 아주 많고 꾀도 아주 많소.\"",
            "\"꾀가 많다니요?\"<br>노인이 처음으로 웃었습니다.<br>\"세상 짐승 가운데 제 목숨을 지키는 재주로 그만한 것이 없소. 그러니 데려오려거든 힘으로 될 일이 아니라는 것만은 알아 두시오.\"",
            "용왕이 무어라 물으려는데 노인의 모습이 스르르 흐려졌습니다. 정신을 차려 보니 침상 곁에는 아무도 없었습니다. 다만 방 안에 낯선 풀 냄새가 남아 있었습니다. 코끝에 오래 남는 냄새였습니다.",
            "이튿날 아침, 용왕은 신하들을 모두 불러들였습니다. 목소리에 오랜만에 힘이 실려 있었습니다.<br>\"간밤에 신선이 다녀갔다. 내 병에는 토끼의 간이 약이라 하더구나.\" 신하들이 서로 눈치를 살폈습니다.",
            "수궁 대신들이 서로 얼굴을 마주 보았습니다.<br>\"토끼라 하면 육지 짐승이 아닙니까.\"<br>\"그렇다. 그러니 누군가 육지로 나가야 한다.\"",
            "순간 넓은 조정이 물속처럼 조용해졌습니다. 아니, 물속이었지만 그보다 더 조용했습니다. 기침 소리 하나 나지 않았습니다.",
            "용왕이 신하들의 얼굴을 하나하나 훑어보았습니다.<br>\"누가 가겠느냐?\"",
            "아무도 대답하지 않았습니다. 문어 승상<span class=\"gloss\">(승상·대감·장군은 모두 높은 벼슬 이름)</span>은 다리 여덟 개를 슬그머니 몸 아래로 말아 넣었고, 상어 장군은 갑자기 천장을 올려다보았습니다. 조기 대감은 눈을 껌뻑껌뻑하기만 했습니다. 다들 제 발끝만 내려다보았습니다.",
            "\"어허, 대답이 없구나.\"<br>용왕의 목소리가 조금 높아졌습니다. 그제야 신하들이 하나둘 입을 열었습니다. 그런데 그것이 하나같이 남에게 미루는 말이었습니다. 듣고 있던 용왕의 손이 떨렸습니다."
        ]
    },
    {
        num: 2,
        title: "누가 뭍에 오르겠느냐",
        art: ["story-02-a.webp", "story-02-b.webp", "story-02-c.webp"],
        artAt: ["먼저 문어 승상이 나섰습니다", "내가 그동안 너희를 어떻게 대접하였느냐", "늙은 어머니에게 절을 올렸습니다"],
        paras: [
            "먼저 문어 승상이 나섰습니다.<br>\"신은 다리가 여덟이라 헤엄은 잘 칩니다만, 뭍에 오르면 다리가 하나도 소용이 없습니다. 바싹 말라붙고 말 것이니 아무래도 상어 장군이 마땅할 듯합니다.\" 말끝에 슬쩍 남을 끌어들였습니다.",
            "상어 장군이 펄쩍 뛰었습니다.<br>\"신이 뭍에 오르면 어찌 되겠습니까. 이 큰 몸이 모래밭에 얹히면 그대로 끝입니다. 게다가 신은 생김새가 험해서 토끼가 보기만 해도 달아날 것입니다. 조기 대감이 어떻겠습니까.\" 말하면서도 눈은 조기 대감을 보고 있었습니다.",
            "조기 대감이 지느러미를 홰홰 저었습니다.<br>\"신은 뭍에 오르면 곧바로 소금에 절여져 굴비가 되고 맙니다. 그것은 신 하나 죽는 일로 끝나지 않고 나라의 체면이 걸린 일입니다.\" 말은 그럴듯했지만 결국 못 가겠다는 소리였습니다.",
            "듣고 있던 용왕의 얼굴이 붉어졌다 푸르러졌다 했습니다.<br>\"그러면 게 대감은 어떠한가.\"<br>\"신은 옆으로만 걷습니다. 곧장 가야 할 길을 옆으로만 가서야 언제 산에 닿겠습니까.\" 게 대감이 집게를 들었다 놓았습니다.",
            "\"고래 장군은?\"<br>\"신은 몸이 너무 커서 갯가에 닿기도 전에 배가 땅에 걸립니다.\"",
            "\"새우 대감은?\"<br>\"신은 몸이 너무 작아 산길에서 밟혀 죽습니다.\"",
            "크면 커서 못 가고, 작으면 작아서 못 가고, 험하게 생겨서 못 가고, 옆으로 걸어서 못 갔습니다. 온 조정이 못 간다는 말로만 가득 찼습니다. 핑계는 저마다 달랐지만 뜻은 하나였습니다.",
            "용왕이 마침내 자리에서 몸을 일으켰습니다. 야윈 손이 부들부들 떨렸습니다.<br>\"내가 그동안 너희를 어떻게 대접하였느냐. 좋은 자리에 앉히고 좋은 것을 먹였다. 그런데 이 나라에 나를 위해 뭍에 오를 자가 하나도 없단 말이냐.\" 말끝이 자꾸 흔들렸습니다.",
            "그 말에 신하들이 일제히 고개를 숙였습니다. 그러나 여전히 나서는 이는 없었습니다. 숨소리마저 죽인 채였습니다.",
            "그때 조정 맨 끝자리에서 목소리 하나가 들려왔습니다. 크지도 않고 떨리지도 않는 목소리였습니다.<br>\"신이 다녀오겠습니다.\" 조정 안이 술렁였습니다.",
            "모두가 소리 나는 쪽을 돌아보았습니다. 기둥 아래 자리에 자라 한 마리가 엎드려 있었습니다. 벼슬이 높지 않아 평소에는 말할 차례조차 오지 않던 별주부<span class=\"gloss\">(자라를 이르던 옛말이자 벼슬 이름)</span>였습니다. 등딱지에 이끼가 앉은, 나이 든 자라였습니다.",
            "대신들이 웅성거렸습니다.<br>\"저 작은 것이 무슨 수로.\"<br>\"헤엄이 느리기로는 수궁에서 으뜸인데.\" 뒤에서 웃음을 참는 소리도 났습니다.",
            "자라는 그 말들을 못 들은 척하고 앞으로 걸어 나왔습니다. 걸음이 정말로 느렸습니다. 조정을 가로지르는 데만 한참이 걸렸습니다. 그래도 한 번도 멈추지 않았습니다.",
            "용왕 앞에 이르자 자라가 고개를 조아렸습니다.<br>\"신은 큰 벼슬을 한 적도 없고 이렇다 할 공을 세운 적도 없습니다. 그러나 신에게는 남들에게 없는 것이 두 가지 있습니다.\"",
            "\"무엇이냐?\"<br>\"하나는 등딱지입니다. 뭍에 올라도 몸이 마르지 않고, 위험을 만나면 머리와 다리를 안으로 넣을 수 있습니다. 다른 하나는 물과 뭍을 모두 다닐 수 있는 발입니다.\"",
            "용왕이 자라를 오래 내려다보았습니다.<br>\"그동안 내가 너를 몰라보았구나.\"<br>\"신을 알아보고 말고 할 것이 무엇 있겠습니까. 다만 갈 수 있는 자가 가는 것이 마땅할 뿐입니다.\" 자라의 목소리는 처음부터 끝까지 한결같았습니다.",
            "그러자 아까까지 못 간다던 대신들이 갑자기 말이 많아졌습니다.<br>\"과연 별주부요!\"<br>\"내 진작부터 저 사람이 보통이 아니라 생각했소.\"<br>자라는 고개를 돌리지 않았습니다. 누구도 자라와 눈을 마주치지 못했습니다.",
            "용왕이 물었습니다.<br>\"그래, 무엇이 필요하냐. 군사를 붙여 주랴? 보물을 지워 주랴?\"",
            "\"군사는 소용없습니다. 여럿이 가면 토끼가 먼저 달아납니다. 보물도 무겁기만 합니다.\"<br>\"그러면 무엇이 필요하냐.\"<br>\"토끼의 생김새를 그린 그림 한 장이면 됩니다.\" 자라가 잠시 생각하더니 대답했습니다.",
            "\"그림이라?\"<br>\"신은 평생 바닷속에서만 살아 토끼라는 것을 본 적이 없습니다. 산에 올라가서 아무나 붙들고 물을 수도 없는 노릇이니, 눈으로 알아볼 수 있어야 합니다.\"",
            "용왕이 무릎을 쳤습니다.<br>\"과연 생각이 깊구나. 화공<span class=\"gloss\">(그림 그리는 사람)</span>을 부르라.\" 그날로 수궁에서 제일가는 화공이 불려 왔습니다.",
            "그날 밤 자라는 제 집으로 돌아가 늙은 어머니에게 절을 올렸습니다.<br>\"먼 길을 다녀오겠습니다.\"<br>어머니 자라가 아들의 등딱지를 오래 쓰다듬었습니다.<br>\"몸조심하여라. 그리고 무슨 일이 있어도 거짓말은 하지 마라.\"<br>자라는 그 말에 얼른 대답하지 못했습니다. 어머니는 눈이 어두워 아들의 얼굴을 손으로 더듬었습니다."
        ]
    },
    {
        num: 3,
        title: "그림 한 장 들고 뭍으로",
        art: ["story-03-a.webp", "story-03-b.webp", "story-03-c.webp"],
        artAt: ["수궁에서 가장 그림을 잘 그린다는 화공이 불려 왔습니다", "자라가 처음으로 물 밖에 머리를 내밀었습니다", "넓은 풀밭에 온갖 짐승이 모여 있었습니다"],
        paras: [
            "이튿날 아침, 수궁에서 가장 그림을 잘 그린다는 화공이 불려 왔습니다. 화공은 붓과 벼루를 갖추어 놓고 자리에 앉았습니다. 종이도 수궁에서 가장 좋은 것으로 내왔습니다.",
            "그러나 곧 난처한 얼굴이 되었습니다.<br>\"신도 토끼를 본 적이 없습니다.\" 붓을 든 손이 허공에서 멈추었습니다.",
            "조정이 다시 술렁였습니다. 그때 늙은 거북 하나가 앞으로 나왔습니다. 젊었을 적에 갯가에 여러 번 올라가 보았다는 거북이었습니다. 나이가 하도 많아 등딱지에 조개가 붙어 있었습니다.<br>\"내가 말하는 대로 그려 보시오.\"",
            "거북이 눈을 감고 옛 기억을 더듬으며 말했습니다.<br>\"먼저 몸은 어른 주먹 두 개를 붙여 놓은 만하게 그리시오. 털은 잿빛이 도는 갈색이고, 배 쪽은 희끗하오.\" 화공이 붓을 놀리기 시작했습니다.",
            "붓이 종이 위를 스윽 지나갔습니다.<br>\"귀를 그리시오. 아주 길게. 그 몸에 어울리지 않을 만큼 길게 그려야 하오. 끝은 검은빛이 도오.\" 종이 위에 귀 두 개가 쭉 올라갔습니다.",
            "\"눈은 어떠하오?\"<br>\"눈은 붉소. 놀란 것처럼 늘 동그랗게 뜨고 있소. 코는 작고 늘 실룩거리며, 입술은 위쪽이 셋으로 갈라져 있소.\"",
            "\"다리는?\"<br>\"앞다리는 짧고 뒷다리가 아주 기오. 그래서 걷는 것이 아니라 뛰오. 앉아 있을 때는 뒷다리를 접고 앞다리로 몸을 세우오. 꼬리는 짧고 동그랗소.\" 신하들이 목을 빼고 들여다보았습니다.",
            "화공의 붓이 마지막으로 한 번 지나가자, 종이 위에 없던 짐승 한 마리가 나타났습니다. 귀가 길고 눈이 붉고 뒷다리가 긴 짐승이었습니다.",
            "수궁 신하들이 그림을 빙 둘러싸고 들여다보았습니다.<br>\"거참 우습게도 생겼구나.\"<br>\"저것의 간이 그렇게 좋다는 말이지.\" 누구는 손가락으로 그림을 가리키며 웃었습니다.",
            "용왕이 그림을 자라에게 내주었습니다. 자라는 그림을 곱게 말아 등딱지 밑에 단단히 끼워 넣었습니다. 행여 젖을까 기름 먹인 종이로 한 번 더 쌌습니다.",
            "\"별주부야.\"<br>\"예, 대왕.\"<br>\"살아서 돌아오너라. 토끼를 못 데려와도 좋다.\"<br>자라가 처음으로 고개를 들어 용왕을 마주 보았습니다. 그러고는 아무 말 없이 절을 올렸습니다.",
            "수궁의 온 신하가 궁문 밖까지 나와 자라를 배웅했습니다. 자라는 뒤를 한 번도 돌아보지 않고 물살을 헤치며 위로, 위로 올라갔습니다. 궁문이 닫히는 소리가 등 뒤에서 났습니다.",
            "물빛이 점점 밝아지더니 어느 순간 머리 위가 환해졌습니다. 자라가 처음으로 물 밖에 머리를 내밀었습니다. 머리 위로 흰 것이 일렁였습니다. 그것이 하늘이었습니다.",
            "숨이 턱 막혔습니다. 공기라는 것이 이렇게 가볍고 마른 것인 줄 몰랐습니다. 햇빛이 어찌나 밝은지 눈을 제대로 뜰 수가 없었습니다. 숨을 쉴 때마다 목이 따가웠습니다.",
            "자라는 모래밭을 기어올라 갔습니다. 물속에서는 몸이 저절로 떠올랐는데 뭍에서는 등딱지가 바위처럼 무거웠습니다. 백 걸음을 가고 한 번 쉬고, 백 걸음을 가고 또 쉬었습니다.",
            "그렇게 사흘을 기어 마침내 산자락에 닿았습니다. 소나무가 늘어서고 시냇물이 흐르는 곳이었습니다. 자라는 바위 그늘에 엎드려 숨을 골랐습니다. 등딱지가 햇볕에 달아올라 뜨거웠습니다.",
            "그때 산 위쪽에서 왁자한 소리가 들려왔습니다. 자라가 조심조심 다가가 보니, 넓은 풀밭에 온갖 짐승이 모여 있었습니다. 노루도 있고 멧돼지도 있고 여우도 있었습니다.",
            "무슨 잔치가 열렸는데 누가 윗자리에 앉을지를 두고 다투는 중이었습니다.<br>\"나이로 치면 내가 위요.\" 노루가 말했습니다.<br>\"나이가 무슨 소용이오. 힘으로 쳐야지.\" 멧돼지가 코를 킁킁거렸습니다.",
            "여우가 꼬리를 살랑거리며 끼어들었습니다.<br>\"힘도 나이도 아니오. 세상은 슬기로운 자가 위에 앉는 법이오.\"<br>\"그럼 슬기는 어찌 재느냐?\" 오소리가 물었습니다.<br>\"그거야…….\" 여우가 말끝을 흐렸습니다.",
            "그때 뒤쪽에서 조그만 목소리가 튀어나왔습니다.<br>\"그러지 말고 이렇게 합시다. 여기 있는 이들 가운데 아침 해를 가장 먼저 본 이가 윗자리에 앉기로.\" 다투던 소리가 뚝 그쳤습니다.",
            "짐승들이 일제히 그쪽을 돌아보았습니다. 뒷다리를 접고 앉은 작은 짐승 하나가 앞발을 들고 있었습니다. 귀가 길고 눈이 붉었습니다. 몸집은 그 자리에서 가장 작았습니다.",
            "자라의 가슴이 쿵 내려앉았습니다. 얼른 등딱지 밑에서 그림을 꺼내 펼쳐 보았습니다. 그림 속 짐승과 저 짐승이 꼭 같았습니다. 귀 끝의 검은 빛깔까지 그대로였습니다.",
            "\"찾았다.\"<br>자라는 숨을 죽이고 바위 뒤에 몸을 낮추었습니다.",
            "풀밭에서는 다툼이 계속되고 있었습니다. 결국 아무도 윗자리에 앉지 못했고, 짐승들은 저마다 투덜거리며 흩어졌습니다. 토끼는 마지막까지 남아 남이 흘린 밤톨을 주워 먹고 있었습니다. 아무도 그 작은 짐승을 눈여겨보지 않았습니다."
        ]
    },
    {
        num: 4,
        title: "벼슬을 준다는 말",
        art: ["story-04-a.webp", "story-04-b.webp", "story-04-c.webp"],
        artAt: ["나는 남해 수궁에서 온 별주부라 하오", "수궁에는 사냥꾼이 없소", "토끼가 자라의 등딱지 위에 올라앉았습니다"],
        paras: [
            "자라가 슬금슬금 걸어 나갔습니다. 토끼가 먼저 알아채고 뒷다리에 힘을 주었습니다.<br>\"거 누구요?\" 귀가 자라 쪽으로 쫑긋 섰습니다.",
            "\"놀라지 마시오. 나는 남해 수궁에서 온 별주부라 하오.\"<br>토끼가 자라의 등딱지를 위아래로 훑어보았습니다.<br>\"수궁? 물속에 있다는 그 궁궐 말이오?\"<br>\"그렇소.\" 토끼가 한 걸음 다가왔습니다.",
            "토끼가 코를 실룩거렸습니다.<br>\"그런 데서 여기까지는 왜 왔소.\"<br>\"인재<span class=\"gloss\">(재주 있는 사람)</span>를 찾으러 왔소.\" 자라는 서두르지 않았습니다.",
            "\"인재?\"<br>\"우리 대왕께서 뭍에 슬기로운 짐승이 하나 있다는 말을 들으셨소. 데려다 벼슬을 내리고 싶어 하시오. 아까 그 자리싸움에서 나서는 것을 보니, 과연 그 말이 헛말이 아니었소.\"",
            "토끼의 두 귀가 쫑긋 섰습니다.<br>\"내가……. 그렇소? 하기야 이 산중에서 나만한 머리가 어디 있겠소.\" 아까 다투던 일이 떠올랐던 것입니다.",
            "자라는 속으로만 웃고 겉으로는 정색을 했습니다.<br>\"그런데 산중 살림이 어떠하오?\"",
            "그 말에 토끼의 얼굴이 대번에 어두워졌습니다.<br>\"말도 마시오. 봄에는 굶주린 짐승들이 눈에 불을 켜고 다니고, 여름에는 뱀이 들끓고, 가을에는 사냥꾼이 덫을 놓고, 겨울에는 먹을 것이 없어 나무껍질을 갉아 먹소. 하루도 마음 놓고 잠들어 본 적이 없소.\" 말하는 동안 토끼의 목소리가 떨렸습니다.",
            "\"그럴 것이오.\" 자라가 고개를 끄덕였습니다. \"그러니 수궁 이야기를 좀 들어 보시오.\"",
            "자라가 목소리를 낮추었습니다.<br>\"수궁에는 사냥꾼이 없소. 덫도 없고 독수리도 없소. 궁궐은 수정으로 지어 기둥이 산호요 지붕이 자개라, 물살이 지날 때마다 무지개가 이오. 상에는 진주가 굴러다니고, 먹을 것은 사철 넘치오.\" 토끼가 저도 모르게 몸을 앞으로 기울였습니다.",
            "토끼의 붉은 눈이 점점 커졌습니다.<br>\"게다가 대왕께서 그대에게 벼슬을 내리겠다 하셨소. 관<span class=\"gloss\">(벼슬아치가 쓰는 모자)</span>을 쓰고 옥대<span class=\"gloss\">(옥으로 꾸민 허리띠)</span>를 두르고 높은 자리에 앉게 되는 것이오.\"",
            "\"벼, 벼슬을…….\" 토끼가 침을 꿀꺽 삼켰습니다. 산에서 벼슬이라는 말을 들어 본 적이 없었습니다.<br>\"어떻소, 나와 함께 가지 않겠소?\"",
            "토끼는 얼른 대답하지 못했습니다. 그러나 두 귀는 이미 자라 쪽으로 바짝 기울어 있었습니다. 가슴이 두근거려 말이 나오지 않았습니다.",
            "그때 머리 위 소나무 가지에서 까마귀 한 마리가 깍 하고 울었습니다.<br>\"토끼야, 가지 마라.\" 온 산이 울릴 만큼 큰 소리였습니다.",
            "토끼가 위를 올려다보았습니다.<br>\"너는 또 왜 참견이냐.\"<br>\"내가 그 바닷가에서 오래 살았다. 물에 사는 것들이 뭍에 올라오는 일은 없다. 하물며 벼슬을 주겠다고 기어 올라오는 일은 더더욱 없다.\"",
            "자라의 등딱지 밑에서 식은땀이 흘렀습니다. 그러나 겉으로는 껄껄 웃었습니다.<br>\"저 새가 나를 시기하는 모양이오. 남이 잘되는 꼴을 못 보는 것이지.\" 말은 그렇게 했지만 목소리가 조금 높아졌습니다.",
            "까마귀가 다시 울었습니다.<br>\"토끼야, 잘 생각해라. 저 짐승이 너에게 무엇을 얻으려 하는지 물어보아라. 세상에 까닭 없이 좋은 것을 주는 이는 없다.\" 까마귀는 가지 끝까지 내려와 앉았습니다.",
            "토끼가 잠시 망설였습니다. 그 순간 자라가 한 걸음 물러섰습니다.<br>\"정 그러면 그만두시오. 나도 여기까지 오느라 사흘을 기었소. 그대가 싫다면 다른 이를 찾아보겠소. 이 산에 슬기로운 짐승이 그대 하나뿐이겠소.\"",
            "그러고는 정말로 몸을 돌려 내려가기 시작했습니다. 걸음이 어찌나 느린지 열 걸음을 가는 데도 한참이 걸렸습니다. 일부러 그러는 것이었습니다.",
            "토끼가 그 뒷모습을 보았습니다. 그러자 다른 짐승이 관을 쓰고 옥대를 두르고 높은 자리에 앉아 있는 모습이 눈앞에 어른거렸습니다. 아까 풀밭에서 제 말을 흘려듣던 여우의 얼굴도 떠올랐습니다. 그 생각을 하자 발이 저절로 움직였습니다.",
            "\"자, 잠깐!\"<br>토끼가 껑충 뛰어 자라를 앞질렀습니다.<br>\"가겠소. 내가 가겠소.\"",
            "까마귀가 가지 위에서 몇 번이나 더 울었습니다. 토끼는 한 번도 위를 올려다보지 않았습니다. 나중에는 그 소리가 성가시게만 들렸습니다.",
            "자라가 물었습니다.<br>\"헤엄은 칠 줄 아오?\"<br>\"그건 못 하오.\"<br>\"그러면 내 등에 타시오. 눈을 감고 있으면 물이 코로 들어오지 않소.\"",
            "토끼가 자라의 등딱지 위에 올라앉았습니다. 등딱지는 넓고 단단해서 앉기에 꼭 알맞았습니다. 토끼는 앞발로 등딱지 가장자리를 꼭 붙들었습니다.",
            "모래밭을 지나 물가에 이르렀습니다. 자라가 물속으로 몸을 들이밀자 토끼는 두 눈을 꼭 감았습니다. 마지막으로 산 쪽에서 까마귀 우는 소리가 아득하게 들려왔습니다. 물이 목까지 차오르자 토끼가 몸을 움츠렸습니다."
        ]
    },
    {
        num: 5,
        title: "수궁에서 생긴 일",
        art: ["story-05-a.webp", "story-05-b.webp", "story-05-c.webp"],
        artAt: ["토끼가 눈을 뜬 순간 숨이 멎는 줄 알았습니다", "저 토끼의 배를 갈라 간을 꺼내어라", "소인의 간은 지금 뱃속에 없습니다"],
        paras: [
            "얼마쯤 갔을까요. 자라가 말했습니다.<br>\"이제 눈을 떠도 되오.\" 물살이 한결 부드러워져 있었습니다.",
            "토끼가 눈을 뜬 순간 숨이 멎는 줄 알았습니다. 사방이 푸른 빛으로 가득했습니다. 물고기 떼가 무리 지어 지나가고, 산호가 숲처럼 자라 있고, 바닥에서는 조개가 입을 벌렸다 오므렸다 했습니다. 산에서는 본 적 없는 빛깔들이었습니다.",
            "그리고 저 앞에 궁궐이 있었습니다. 자라가 말한 그대로였습니다. 기둥은 산호요 지붕은 자개라, 물살이 지날 때마다 온 궁이 무지갯빛으로 일렁였습니다. 토끼는 입을 다물지 못했습니다.",
            "\"과연!\" 토끼가 감탄했습니다. \"내 평생 이런 것은 처음 보오.\"",
            "궁문이 열리고 신하들이 죽 늘어서 있었습니다. 그런데 토끼를 보는 눈들이 어쩐지 이상했습니다. 반가워하는 것도 아니고 놀라는 것도 아닌, 무언가를 아까워하는 듯한 눈이었습니다. 누구도 먼저 인사를 건네지 않았습니다.",
            "토끼는 잠깐 걸음을 멈추었습니다. 그러나 곧 스스로를 다독였습니다. 새로 온 자를 처음부터 반겨 주는 자리가 어디 있겠느냐고 말입니다. 그래도 자꾸 뒤가 서늘했습니다.",
            "너른 대궐 안으로 들어서니 높은 자리에 용왕이 앉아 있었습니다. 야윈 얼굴이었지만 두 눈만은 무섭게 빛나고 있었습니다. 숨소리가 방 안까지 들릴 만큼 가빴습니다.",
            "\"저것이 토끼렷다.\"<br>\"그러하옵니다.\" 자라가 엎드려 아뢰었습니다.<br>\"수고했다. 물러가 쉬어라.\"",
            "자라가 물러났습니다. 그런데 물러나면서 토끼 쪽을 한 번도 보지 않았습니다. 등딱지가 유난히 무거워 보였습니다.",
            "토끼가 앞으로 나아가 절을 올렸습니다.<br>\"산중에 사는 보잘것없는 것이 대왕을 뵈옵니다. 벼슬을 내리신다는 말씀을 듣고 왔사옵니다.\" 목소리에 자랑스러운 기색이 묻어났습니다.",
            "그 말에 대궐 안이 잠시 조용해졌습니다. 그러고는 여기저기서 킥킥거리는 소리가 났습니다. 토끼는 그 웃음의 뜻을 알지 못했습니다.",
            "용왕이 손을 들어 조용히 시켰습니다. 그러고는 아주 천천히 입을 열었습니다.<br>\"벼슬이라……. 그래, 벼슬보다 더 큰 것을 주마. 네 이름이 이 바다에 길이 남을 것이다.\" 말끝이 이상하게 차가웠습니다.",
            "\"여봐라.\"<br>용왕의 목소리가 대궐을 울렸습니다.<br>\"저 토끼의 배를 갈라 간을 꺼내어라.\"",
            "토끼의 온몸이 얼음이 되었습니다.<br>\"예? 지, 지금 무어라 하셨습니까?\" 귀가 저절로 뒤로 눕혀졌습니다.",
            "\"내 병에는 산 토끼의 간이 약이라 하였다. 네가 여기까지 온 것은 그 때문이다.\"<br>군사들이 창을 들고 다가왔습니다. 창끝이 등불을 받아 번들거렸습니다.",
            "토끼의 머릿속이 새하얘졌습니다. 소나무 가지에서 울던 까마귀 소리가 그제야 또렷하게 되살아났습니다. 세상에 까닭 없이 좋은 것을 주는 이는 없다던 그 말이었습니다.",
            "그러나 토끼는 산중에서 제 목숨을 지키며 살아온 짐승이었습니다. 다리가 후들거리는 그 순간에도 머리만은 무섭게 돌아갔습니다. 숨을 크게 한 번 골랐습니다.",
            "창끝이 목에 닿기 직전, 토끼가 갑자기 무릎을 치며 큰 소리로 웃었습니다.<br>\"아이고, 이런 낭패가 있나!\" 웃음소리가 대궐 안에 울렸습니다.",
            "용왕이 손을 들어 군사를 멈춰 세웠습니다.<br>\"무엇이 낭패란 말이냐.\"",
            "\"대왕이시여, 진작 말씀을 하셨더라면 좋았을 것을. 소인의 간이 필요하셨다면 그저 그렇게 말씀하시면 될 일이 아니었습니까. 무엇하러 벼슬이니 무어니 하는 거짓말로 사람을 데려오셨습니까.\" 말하는 목소리가 조금도 떨리지 않았습니다.",
            "\"그게 무슨 말이냐.\"<br>\"소인의 간은 지금 뱃속에 없습니다.\"",
            "대궐 안이 술렁였습니다. 용왕의 눈썹이 꿈틀했습니다.<br>\"간이 없다니. 그런 짐승이 어디 있느냐.\" 대신들이 서로 얼굴을 쳐다보았습니다.",
            "\"다른 짐승은 그렇지 않으나 토끼만은 다릅니다.\" 토끼가 태연하게 말을 이었습니다. \"저희 간은 예로부터 온갖 짐승이 탐을 냅니다. 그래서 몸에 지니고 다니다가는 언제 배를 갈릴지 모릅니다. 하여 저희는 보름마다 간을 꺼내어 맑은 물에 씻어 바위틈에 감춰 두고, 필요할 때만 도로 넣습니다.\"",
            "\"그러면 지금은?\"<br>\"마침 어제가 씻는 날이었습니다. 지금 소인의 간은 산속 바위틈에 볕을 쬐고 있습니다. 배를 가르셔도 헛수고이십니다. 못 믿으시겠거든 어디 갈라 보십시오.\" 그러고는 배를 쭉 내밀었습니다. 아무도 선뜻 칼을 들지 못했습니다."
        ]
    },
    {
        num: 6,
        title: "뭍에 닿은 뒤",
        art: ["story-06-a.webp", "story-06-b.webp", "story-06-c.webp"],
        artAt: ["용왕이 한참 동안 토끼를 노려보았습니다", "세상에 간을 꺼내 놓고 사는 짐승이 어디 있소", "그 모래밭에 그대로 엎드려 있었습니다"],
        paras: [
            "용왕이 한참 동안 토끼를 노려보았습니다. 토끼는 눈 하나 깜짝하지 않았습니다. 대궐 안이 숨소리도 나지 않았습니다.",
            "문어 승상이 조심스레 아뢰었습니다.<br>\"대왕이시여, 배를 갈랐다가 정말로 간이 없으면 저것도 잃고 약도 잃습니다.\"<br>다른 대신들도 용왕의 눈치를 살피며 고개를 끄덕였습니다.",
            "그때 자라가 앞으로 나섰습니다.<br>\"대왕이시여, 저 말은 거짓입니다. 짐승이 어찌 간을 꺼내 두고 삽니까.\" 목소리가 저도 모르게 높아졌습니다.",
            "토끼가 자라를 돌아보았습니다. 그리고 아주 서운한 얼굴을 지어 보였습니다.<br>\"별주부, 그대야말로 나에게 벼슬을 준다 하지 않았소. 그 말은 참이었소?\" 귀를 축 늘어뜨리기까지 했습니다.",
            "자라가 말문이 막혔습니다. 대궐 안이 조용해졌습니다. 거짓말을 한 쪽은 자라였고, 그것을 모두가 보고 있었습니다. 자라는 고개를 들지 못했습니다.",
            "용왕이 길게 숨을 내쉬었습니다.<br>\"토끼야, 네 말이 참이라면 어찌하겠느냐.\"<br>\"소인을 뭍에 데려다주십시오. 반나절이면 간을 찾아 돌아오겠습니다. 대왕의 병을 고치고 큰 상까지 받을 일을 무엇하러 마다하겠습니까.\"",
            "그 말이 그럴듯하게 들렸습니다. 용왕은 마침내 고개를 끄덕였습니다.<br>\"그리하여라. 다만 오늘 저지른 무례는 잊어 주마. 네 간을 가져오면 그때는 정말로 벼슬을 내리겠다.\" 토끼가 넙죽 절을 올렸습니다.",
            "그날 저녁 수궁에서는 큰 잔치가 열렸습니다. 토끼는 윗자리에 앉아 진귀한 음식을 배가 터지도록 먹었습니다. 다만 술만은 한 방울도 입에 대지 않았습니다. 취하면 말이 헛나올 것을 알고 있었기 때문입니다.",
            "이튿날 새벽, 자라가 토끼를 등에 태우고 다시 물길을 올랐습니다. 둘 다 아무 말이 없었습니다. 물살을 가르는 소리만 났습니다.",
            "모래밭에 닿자 토끼가 등딱지에서 폴짝 뛰어내렸습니다. 그러고는 앞발로 흙을 몇 번 긁어 보고, 코를 실룩거려 풀 냄새를 맡아 보았습니다. 오랜만에 맡는 흙냄새였습니다.",
            "\"별주부.\"<br>\"어서 가서 간을 가져오시오.\"<br>토끼가 씩 웃었습니다.<br>\"세상에 간을 꺼내 놓고 사는 짐승이 어디 있소.\"",
            "자라가 그 자리에 굳어 버렸습니다. 토끼는 이미 열 걸음 밖에 있었습니다.<br>\"그대가 나를 속였으니 나도 그대를 속인 것이오. 이만하면 셈이 맞지 않소?\"<br>그러고는 산 쪽으로 껑충껑충 뛰어 사라졌습니다. 자라는 한 걸음도 쫓아가지 못했습니다.",
            "자라는 한나절이 넘도록 그 모래밭에 그대로 엎드려 있었습니다. 해가 기울고 물이 발끝까지 밀려와도 움직이지 않았습니다. 파도가 등딱지를 몇 번이나 넘어갔습니다.",
            "무슨 낯으로 수궁에 돌아간단 말입니까. 대왕은 여전히 자리에 누워 계신데 저는 빈손이었습니다. 게다가 대궐 한복판에서 거짓말쟁이가 되었습니다. 돌아갈 길이 물속에 있는데도 아득했습니다.",
            "자라의 눈에서 눈물이 뚝뚝 떨어져 모래에 스몄습니다.<br>\"어머니께서 무슨 일이 있어도 거짓말은 하지 말라 하셨는데.\"",
            "그때 등 뒤에서 목소리가 들려왔습니다.<br>\"울지 마라.\" 낮고 느린 목소리였습니다.",
            "돌아보니 흰 옷을 입은 노인이 서 있었습니다. 수염이 가슴까지 내려오고 손에는 지팡이를 들고 있었습니다. 자라는 그 노인을 본 적이 없었지만, 어쩐지 낯설지가 않았습니다.",
            "\"뉘시옵니까.\"<br>\"네 임금의 침상에 한 번 다녀간 사람이다.\"",
            "자라가 얼른 엎드렸습니다.<br>\"어르신, 소인은 토끼를 놓쳤습니다. 대왕을 살릴 길이 없어졌습니다.\" 모래에 이마가 닿도록 엎드렸습니다.",
            "노인이 지팡이로 모래를 짚으며 말했습니다.<br>\"내가 토끼의 간을 말한 것은 약을 알려 준 것이 아니었다. 이 넓은 나라에 임금을 위해 뭍에 오를 자가 하나라도 있는지 보고자 한 것이다.\" 자라가 눈을 크게 떴습니다.",
            "\"예?\"<br>\"큰 벼슬을 한 자들은 모두 못 간다 하였고, 아무 벼슬도 없던 네가 가겠다 하였다. 그것으로 되었다.\"",
            "노인이 품에서 조그만 뿌리 하나를 꺼내 자라 앞에 놓았습니다. 흙빛이 도는 늙은 산삼이었습니다.<br>\"이것을 달여 드시게 하여라. 사흘이면 일어나실 것이다.\" 잔뿌리에 흙이 그대로 묻어 있었습니다.",
            "자라가 고개를 들었을 때 노인은 이미 없었습니다. 모래밭에는 지팡이 자국만 몇 개 남아 있었습니다.",
            "자라가 산삼을 등딱지 밑에 끼우고 물로 들어갔습니다. 사흘 뒤, 남해 용왕은 자리를 털고 일어났습니다. 궁 안이 오랜만에 웃음소리로 찼습니다.",
            "용왕은 자라에게 높은 벼슬을 내리려 했습니다. 그러나 자라는 사양했습니다.<br>\"신은 거짓말로 남을 속여 데려온 자입니다. 상을 받을 낯이 없습니다.\"<br>\"그 거짓말은 나를 위한 것이 아니었느냐.\"<br>\"그래도 거짓말은 거짓말입니다.\"",
            "용왕은 한참 만에 고개를 끄덕였습니다. 그러고는 자라를 조정 맨 앞자리에 앉히되 벼슬 이름은 붙이지 않았습니다. 벼슬 없이 앞자리에 앉은 신하는 수궁이 생긴 이래 처음이었습니다. 그 자리는 지금도 별주부 자리라 불린답니다.",
            "한편 산속의 토끼는 그 뒤로 물가에 얼씬도 하지 않았다고 합니다. 다만 누가 벼슬을 준다는 말을 꺼내기만 하면 귀를 착 눕히고 먼저 뒷걸음질을 쳤다지요."
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
    emoji: '🐢',
    title: '토끼전',
    intro: [
        "토끼전은 지은이가 알려지지 않은 조선 시대 소설이에요. 별주부전, 토생원전, 수궁가 같은 여러 이름으로 불린답니다.",
        "이 이야기는 원래 판소리로 불리던 것이 글로 옮겨진 것이에요. 판소리 다섯 마당 가운데 수궁가가 바로 이 이야기지요. 그래서 문장에 노래하듯 늘어놓는 대목이 유난히 많답니다.",
        "뿌리는 훨씬 오래되었어요. 삼국사기에 실린 구토 설화가 그것인데, 고구려에 붙잡힌 신라의 김춘추가 이 이야기를 들었다고 적혀 있답니다.",
        "조선 후기에는 같은 이야기의 끝이 수십 가지로 갈렸어요. 부르는 소리꾼마다, 듣는 사람마다 바라는 것이 달랐기 때문이지요. 그래서 토끼전은 어느 책을 펴느냐에 따라 마지막 쪽이 다르답니다."
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
    { q: "용왕이 병을 얻은 까닭은 무엇입니까?", choices: ["싸움을 하다 크게 다쳐서", "사흘 밤낮 이어진 잔치 끝에", "차가운 물살에 오래 있어서"], answer: 1 },
    { q: "용왕의 병을 고칠 약을 일러 준 것은 누구입니까?", choices: ["문어 승상", "잉어 대신", "지나던 신선"], answer: 2 },
    { q: "육지로 가겠다고 나선 것은 누구입니까?", choices: ["별주부 자라", "문어 승상", "잉어 대신"], answer: 0 },
    { q: "자라가 육지로 가면서 챙겨 간 것은 무엇입니까?", choices: ["용왕이 준 구슬", "토끼 그림 한 장", "바다에서 난 약초"], answer: 1 },
    { q: "자라가 토끼를 꾈 때 내세운 것은 무엇입니까?", choices: ["수궁의 벼슬자리", "금은보화 한 자루", "산속의 넓은 땅"], answer: 0 },
    { q: "토끼에게 가지 말라고 말린 것은 누구입니까?", choices: ["여우", "까마귀", "노루"], answer: 1 },
    { q: "토끼가 용왕 앞에서 한 말은 무엇입니까?", choices: ["간이 원래 없다고 했다", "간을 바위틈에 두고 왔다", "간을 줄 수 없다고 했다"], answer: 1 },
    { q: "용왕은 토끼의 말을 듣고 어떻게 했습니까?", choices: ["그 자리에서 가두었다", "믿지 않고 화를 냈다", "큰 상을 차려 대접했다"], answer: 2 },
    { q: "육지에 닿은 토끼는 무엇을 했습니까?", choices: ["껑충 뛰어 달아났다", "간을 찾아다 주었다", "자라를 물에 밀었다"], answer: 0 },
    { q: "용왕의 병은 끝내 무엇으로 나았습니까?", choices: ["토끼가 보낸 간", "수궁 의원의 침", "신선이 준 산삼"], answer: 2 },
    { q: "자라는 상을 사양하며 무어라 했습니까?", choices: ["거짓말을 한 낯이 없다고", "이미 충분히 받았다고", "고향으로 가겠다고"], answer: 0 },
    { q: "자라는 수궁에서 어떤 자리에 앉게 되었습니까?", choices: ["가장 높은 벼슬자리", "벼슬 없는 맨 앞자리", "궁 밖 모래밭 한쪽"], answer: 1 },
    {
        q: "이 책을 읽고 난 반응으로 알맞지 않은 것은 무엇인가요?",
        wide: true,
        choices: [
            "용왕이 잔치 끝에 병을 얻고 남의 간을 찾은 것을 보면, 윗자리의 병을 아랫것이 갚는 셈이구나.",
            "자라가 벼슬자리를 내세워 토끼를 꾄 것을 보면, 누구나 솔깃한 자리가 하나쯤 있네.",
            "자라가 상을 사양하며 거짓말한 낯이 없다고 한 것을 보면, 시킨 일을 했어도 마음은 남는 거야.",
            "용왕이 토끼를 큰 상으로 대접한 것을 보면, 간을 받기 전에 먼저 예를 갖춘 거였겠다."
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
    emoji: '🐢',
    art: ['end.webp'],
    paras: [
        `이 이야기는 책이 되기 전에 노래였고, 노래가 되기 전에는 아주 짧은 옛이야기였습니다. 지금까지 확인되는 가장 오래된 자리는 『삼국사기』입니다.`,
        `그 대목을 다시 보면 이야기를 들려준 쪽은 고구려 사람입니다. 가둔 나라 사람이 갇힌 나라 사람에게 빠져나가는 법을 일러 준 것이지요. 그러니 이 이야기는 처음부터 재미로만 하는 이야기가 아니었습니다. 갇힌 사람에게 빠져나가는 법을 알려 주는 이야기였습니다.`,
        `더 멀리 가면 인도까지 닿습니다. 인도의 옛이야기 모음에는 악어가 원숭이의 심장을 노리는 이야기가 있습니다. 원숭이는 심장을 나무에 걸어 두고 왔다고 말해 살아납니다. 짐승만 바뀌었을 뿐 뼈대가 같습니다. 이야기가 인도에서 중국을 거쳐 우리 땅까지 건너온 것으로 봅니다.`,
        `그 짧은 이야기가 조선에 와서 판소리 「수궁가」가 되었습니다. 부르는 사람마다 살을 붙이다 보니 용궁 신하들이 서로 안 가겠다고 다투는 대목이 생기고, 토끼가 뭍에서 만난 짐승들 이야기가 생기고, 자라가 그림 한 장을 들고 헤매는 대목이 생겼습니다. 원래는 몇 줄이던 것이 몇 시간짜리가 된 것입니다.`,
        `책 이름도 여럿입니다. 토끼전, 별주부전, 토의 간. 무엇을 앞에 놓느냐에 따라 이야기의 주인이 달라집니다. 토끼전이라 하면 꾀로 살아난 토끼 이야기가 되고, 별주부전이라 하면 임금을 위해 목숨 걸고 뭍에 오른 자라 이야기가 됩니다.`,
        `별주부의 별(鼈)은 자라라는 뜻입니다. 그런데 자라는 강과 늪에 사는 짐승이라 바닷물에서는 오래 살지 못합니다. 몸에 들어온 소금을 밖으로 내보내는 재주가 없기 때문입니다. 바다에 사는 것은 자라가 아니라 바다거북입니다. 그러니 남해 용궁에서 자라가 벼슬을 하고 있다는 것은 앞뒤가 맞지 않는 이야기입니다.`,
        `『삼국사기』에 실린 원래 이야기에는 자라가 아니라 거북이 나옵니다. 옛사람이 몰라서 틀린 것이 아니라, 판소리로 불리는 동안 벼슬 이름이던 별주부가 그대로 짐승 이름이 되면서 자라로 굳은 것입니다. 이 책에도 자라와 늙은 거북이 따로 나옵니다. 이름은 갈라 두었으면서 사는 곳까지는 따지지 않은 셈입니다.`,
        `이 이야기가 겨눈 곳은 분명합니다. 용왕은 제 병을 고치자고 남의 배를 가르려 합니다. 신하들은 서로 미루기만 합니다. 자라 하나만 나섭니다. 그리고 그 자라도 결국 남을 속여야 임금을 살릴 수 있습니다. 위쪽 사람들이 하는 일이 대개 그렇다고 말하는 이야기입니다.`,
        `토끼가 이기는 방식도 눈여겨볼 만합니다. 힘으로 이기지 않습니다. 발이 빨라서 이기지도 않습니다. 말로 이깁니다. 간을 꺼내 놓고 다닌다는, 조금만 생각해 보면 말이 안 되는 소리를 온 수궁이 믿어 버립니다.`,
        `왜 믿었을까요. 믿고 싶었기 때문입니다. 용왕은 살고 싶었고, 신하들은 이 일이 어서 끝나기를 바랐습니다. 사람이 속는 것은 속이는 사람이 똑똑해서가 아니라 속는 쪽이 바라는 것이 있기 때문이라는 것을, 이 이야기가 웃으며 짚어 줍니다.`,
        `토끼가 뭍으로 나가겠다고 마음먹은 대목도 다시 볼 만합니다. 애초에 토끼를 물로 끌어들인 것은 벼슬을 준다는 말이었습니다. 산속에서 잘 살던 토끼가 높은 자리를 준다는 말 한마디에 물속까지 따라 들어갔습니다. 속은 쪽에도 빌미가 있었던 셈입니다.`,
        `끝맺음은 책마다 다릅니다. 자라가 빈손으로 돌아가 벌을 받는 것도 있고, 바다에 뛰어드는 것도 있고, 이 책처럼 신선이 나타나 약을 주는 것도 있습니다. 부르는 사람이 듣는 사람의 얼굴을 보고 정했기 때문입니다. 어느 것이 원래 결말인지는 정할 수 없습니다.`,
        `이 책이 신선을 부른 데는 까닭이 있습니다. 자라를 벌하기가 마땅치 않았기 때문입니다. 이 사람은 거짓말을 했지만 그 거짓말로 제 이익을 챙기지 않았습니다. 그렇다고 상을 주기도 어렵습니다. 그래서 벼슬 이름 없이 앞자리에 앉히는 것으로 끝냈습니다.`,
        `자라가 한 거짓말은 용서받을 만한 것일까요? 남을 죽이러 가면서 한 거짓말입니다. 그런데 제 임금을 살리려고 한 것이기도 합니다. 자라 스스로는 상을 받을 낯이 없다고 했습니다. 여러분 생각은 어떻습니까.`,
        `토끼가 한 거짓말은 어떻습니까? 자라의 거짓말과 무엇이 다른지, 아니면 다를 것이 없는지 견주어 보십시오. 둘 다 살자고 한 거짓말입니다.`,
        `용왕은 아무 벌도 받지 않았습니다. 남의 목숨을 가져다 제 병을 고치려 한 사람인데 그렇습니다. 이야기가 용왕을 벌하지 않은 까닭이 무엇일지, 그리고 벌했다면 이야기가 어떻게 달라졌을지 생각해 보십시오.`
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
        emoji: '🐢',
        title: 'The Tale of the Rabbit',
        intro: [
            "The Tale of the Rabbit is a Joseon novel with no known author. It is also called The Tale of Byeoljubu and Sugung-ga.",
            "It was sung as pansori before it was written down, which is why the sentences so often run on in lists.",
            "Its roots are older still: the History of the Three Kingdoms carries a short tale of a turtle and a rabbit.",
            "By the late Joseon period it had dozens of endings, so the last page depends on which book you open."
        ]
    },
    chapters: [
        {
            num: 1,
            title: "The Dragon King's Illness",
            art: ["story-01-a.webp", "story-01-b.webp", "story-01-c.webp"],
            artAt: ["a palace built of crystal", "The whole sea palace was turned upside down", "Who will go?"],
            paras: [
                "Deep in the South Sea there stood a palace built of crystal. The pillars were coral and the roof was mother-of-pearl, so that whenever a current went by the whole palace shimmered like a rainbow. The one who ruled there was the Dragon King of the South Sea. When fish passed in front of him they folded their fins and bowed their heads.",
                "That spring the Dragon King held a great feast. He called the Dragon Kings of the East Sea, the West Sea and the North Sea, and they made merry for three days and nights. The music never stopped and no cup was ever allowed to run dry. More than a hundred kinds of food were set on the tables.",
                "It was the morning of the fourth day. The Dragon King started to get up from his seat and sat straight back down.<br>\"I... I am dizzy.\" The waiting women beside him ran to him in alarm.",
                "From that day the Dragon King kept to his bed. He could not get food down and barely wetted his lips with water. His whole body would burn like a coal and then go cold as ice. At night he talked out of his head.",
                "The whole sea palace was turned upside down. Every physician of any name was sent for. The carp physician felt his pulse, the octopus physician rubbed him all over, and the seahorse physician tried his needles. But none of it was any use. Every one of them shook his head and stepped back.",
                "They tried medicines too. They boiled down seaweed and kelp, they ground pearls into it, they stewed the flesh of a clam a thousand years old. The Dragon King would swallow one mouthful and then turn his head away again. Only the smell of medicine filled the palace.",
                "The moon changed twice. In that time the flesh went from the Dragon King's face and the light went out of his scales. The ministers stood about in front of the palace stamping their feet. It was long since anyone had laughed inside those walls.",
                "\"This will end badly.\"<br>\"We have brought every famous doctor under heaven. What would you have us do?\"<br>\"If it is not in the sea, then we must look for it on land.\"",
                "But nobody said much about the land out loud. To things that live in the sea, the land was a fearful place where you could not breathe. They had heard it was a place where the breath stops and the body dries out.",
                "Then one night, half asleep, the Dragon King opened his eyes and saw an old man in white robes standing beside his bed. His beard came down to his chest and he held a staff in his hand. The door was barred and the guards were where they had been.",
                "\"Who... who are you?\"<br>\"I am one who has watched this sea a long time. I know a medicine that will cure Your Majesty, and I have come.\"",
                "The Dragon King barely raised himself.<br>\"Tell me. I will get it, whatever it is.\"",
                "The old man looked down at him for a long while. Then he opened his mouth slowly.<br>\"Your Majesty's illness did not come out of the water. So it will not be cured by anything that came out of the water.\" His voice rolled low, like a wave.",
                "\"Then what am I to do?\"<br>\"Among the beasts that live on land there is one called the rabbit. Eat the liver of that rabbit and you will be well as if it had been washed away.\"",
                "\"A rabbit...\" The Dragon King said it over. He had never heard the name. \"What does such a beast look like?\"<br>\"Long ears, red eyes, hind legs longer than its front legs. It runs about the hills eating grass. It is very timid and very cunning.\"",
                "\"Very cunning?\"<br>The old man smiled for the first time.<br>\"Of all the beasts in the world there is none with such a gift for keeping its own life. So if you mean to bring it here, know at least this much: it is not a thing that will be done by force.\"",
                "The Dragon King was about to ask something more when the old man's figure blurred and faded. When he came to himself there was nobody beside the bed. Only a strange smell of grass was left in the room. It was a smell that stays at the end of the nose a long time.",
                "The next morning the Dragon King called in every one of his ministers. For the first time in a long while there was strength in his voice.<br>\"An immortal came here in the night. He says that for my illness the medicine is a rabbit's liver.\" The ministers glanced at one another.",
                "The great officers of the sea palace looked into each other's faces.<br>\"A rabbit is a land beast, is it not.\"<br>\"It is. So somebody must go up on land.\"",
                "In that moment the wide court went as quiet as under water. Or rather, it was under water, and it went quieter than that. Not one cough was heard.",
                "The Dragon King looked over the faces of his ministers one by one.<br>\"Who will go?\"",
                "Nobody answered. Minister Octopus quietly curled all eight of his legs up under him, and General Shark suddenly found something to look at on the ceiling. Lord Croaker only blinked and blinked. Every one of them studied the ends of their own feet.",
                "\"Come now. There is no answer.\"<br>The Dragon King's voice rose a little. Only then did the ministers begin to speak, one after another. And every word of it was a word passing the thing on to somebody else. As he listened the Dragon King's hand shook."
            ]
        },
        {
            num: 2,
            title: "Who Will Go Up on Land?",
            art: ["story-02-a.webp", "story-02-b.webp", "story-02-c.webp"],
            artAt: ["Minister Octopus was the first to come forward", "how have I treated you all this while", "bowed to his old mother"],
            paras: [
                "Minister Octopus was the first to come forward.<br>\"Your servant has eight legs and swims well enough, but on land not one of them is any use. I should dry up altogether. General Shark would surely be the fitting choice.\" At the end of it he quietly pulled somebody else in.",
                "General Shark jumped.<br>\"And what would become of your servant on land? Once this great body is up on the sand it is finished there and then. Besides, your servant is fearsome to look at, and the rabbit would run at the sight of me. What about Lord Croaker?\" Even as he spoke his eyes were on Lord Croaker.",
                "Lord Croaker waved his fins about.<br>\"Your servant, once on land, is salted at once and becomes dried croaker. That is not the end of one servant only; the standing of the whole country hangs on it.\" It sounded well enough, but in the end it meant he would not go.",
                "As he listened the Dragon King's face went red and then went blue.<br>\"Then what about Lord Crab?\"<br>\"Your servant walks only sideways. Going sideways along a road that must be gone straight, when should I ever reach the hills?\" Lord Crab raised his claws and put them down.",
                "\"General Whale?\"<br>\"Your servant is so big that his belly grounds before he ever gets near the shore.\"",
                "\"Lord Shrimp?\"<br>\"Your servant is so small that he is trodden to death on a hill path.\"",
                "Big ones could not go for being big, small ones for being small, one for being fearsome to look at, one for walking sideways. The whole court was full of nothing but reasons why not. The excuses were all different and the meaning was one.",
                "At last the Dragon King raised himself from his seat. His thin hand trembled.<br>\"Tell me, how have I treated you all this while. I gave you good places and I fed you well. And is there not one in this whole country who will go up on land for me?\" The end of the words kept shaking.",
                "At that the ministers all bowed their heads together. But still nobody stepped forward. They held even the sound of their breathing.",
                "Then from the very last place in the court a voice was heard. It was neither loud nor shaking.<br>\"Your servant will go.\" A stir went round the court.",
                "Everybody turned to where the sound came from. Below a pillar a soft-shelled turtle lay flat. His rank was so low that in the ordinary way his turn to speak never came round: it was Byeoljubu. He was an old turtle with moss grown on his shell.",
                "The great officers muttered.<br>\"What can a small thing like that do?\"<br>\"He is the slowest swimmer in the whole sea palace.\" From the back came the sound of somebody swallowing a laugh.",
                "The turtle acted as though he had not heard, and walked forward. His step really was slow. Crossing the court alone took him a long while. Even so he never once stopped.",
                "When he reached the Dragon King the turtle bowed his head low.<br>\"Your servant has never held high rank and has never done anything that could be called a service. But your servant has two things that others have not.\"",
                "\"And what are they?\"<br>\"One is this shell. On land my body will not dry, and if danger comes I can draw my head and legs inside. The other is feet that can go both in the water and on land.\"",
                "The Dragon King looked down at him for a long time.<br>\"All this while I never knew you.\"<br>\"There is nothing to know or not know about your servant. Only, the one who can go is the one who ought to go.\" The turtle's voice was the same from the beginning to the end.",
                "At that the officers who had all just said they could not go suddenly had a great deal to say.<br>\"Byeoljubu indeed!\"<br>\"I always thought there was something out of the common about that fellow.\"<br>The turtle did not turn his head. Not one of them could meet his eye.",
                "The Dragon King asked,<br>\"Well then, what do you need? Shall I send soldiers with you? Shall I load you with treasure?\"",
                "\"Soldiers are no use. If we go in numbers the rabbit runs first. Treasure is only heavy.\"<br>\"Then what do you need?\"<br>\"One picture with the rabbit's likeness drawn on it will do.\" The turtle thought a moment and then answered.",
                "\"A picture?\"<br>\"Your servant has lived his whole life in the sea and has never seen the thing called a rabbit. I can hardly climb the hills and stop the first passer-by to ask. I must be able to know it by my eyes.\"",
                "The Dragon King struck his knee.<br>\"Deeply thought indeed. Send for a painter.\" That same day the best painter in the sea palace was called in.",
                "That night the turtle went home and bowed to his old mother.<br>\"I am going a long way.\"<br>The mother turtle stroked her son's shell for a long time.<br>\"Take care of yourself. And whatever happens, tell no lies.\"<br>The turtle could not answer that at once. His mother's eyes were dim, and she felt over her son's face with her hands."
            ]
        },
        {
            num: 3,
            title: "Up on Land with One Picture",
            art: ["story-03-a.webp", "story-03-b.webp", "story-03-c.webp"],
            artAt: ["the best painter in the sea palace was called in", "the turtle put his head out of the water", "beasts of every kind were gathered"],
            paras: [
                "The next morning the best painter in the sea palace was called in. The painter set out his brush and inkstone and sat down. They brought out the finest paper in the palace for him too.",
                "But his face was soon at a loss.<br>\"Your servant has never seen a rabbit either.\" The hand holding the brush stopped in mid-air.",
                "The court stirred again. Then an old turtle of the hard-shelled sort came forward. He was a turtle who said he had gone up on the shore several times when he was young. He was so old that shells had grown on his back.<br>\"Draw as I tell you.\"",
                "The old turtle shut his eyes and felt back through his memory as he spoke.<br>\"First, make the body about the size of two grown men's fists put together. The fur is a brown with grey in it, and the belly is whitish.\" The painter began to work the brush.",
                "The brush swept across the paper.<br>\"Now the ears. Very long. You must draw them longer than suits that body. The tips go black.\" Two ears went straight up on the paper.",
                "\"And the eyes?\"<br>\"The eyes are red. They are always round and open, as if it had just been startled. The nose is small and always twitching, and the upper lip is split into three.\"",
                "\"The legs?\"<br>\"The front legs are short and the hind legs very long. So it does not walk, it jumps. When it sits it folds the hind legs and holds itself up on the front ones. The tail is short and round.\" The ministers craned their necks to look.",
                "The painter's brush went across one last time, and there on the paper was a beast that had not been there before. A beast with long ears and red eyes and long hind legs.",
                "The ministers of the sea palace crowded round the picture and looked at it.<br>\"What a funny-looking thing.\"<br>\"And that is what has such a fine liver in it.\" One of them pointed at the picture with a finger and laughed.",
                "The Dragon King handed the picture to the turtle. The turtle rolled it up carefully and pushed it tight in under his shell. In case it got wet he wrapped it once more in oiled paper.",
                "\"Byeoljubu.\"<br>\"Yes, Your Majesty.\"<br>\"Come back alive. It does not matter if you cannot bring the rabbit.\"<br>For the first time the turtle raised his head and looked the Dragon King in the face. Then, without a word, he made his bow.",
                "Every minister of the sea palace came out as far as the palace gate to see the turtle off. The turtle never once looked back, and pushed up through the water, up and up. Behind him he heard the gate close.",
                "The colour of the water grew brighter and brighter, and then all at once it was bright above his head. For the first time the turtle put his head out of the water. Something white was moving over him. It was the sky.",
                "His breath caught. He had not known that this thing called air was so light and so dry. The sunlight was so bright that he could not properly open his eyes. Every breath stung his throat.",
                "The turtle crawled up the sand. In the water his body had floated of itself; on land his shell was heavy as a rock. A hundred steps and a rest, a hundred steps and another rest.",
                "So he crawled for three days and came at last to the foot of a hill. It was a place of pine trees in rows and a stream running through. The turtle lay flat in the shade of a rock and got his breath. His shell had heated in the sun and was hot to the touch.",
                "Then a great noise came down from up the hill. The turtle crept up to look, and in a wide meadow beasts of every kind were gathered. There were roe deer and wild pigs and foxes.",
                "Some sort of feast was going on, and they were arguing over who should sit at the head of it.<br>\"By years I am the eldest,\" said the roe deer.<br>\"What have years to do with it? It should go by strength.\" The wild pig snuffled.",
                "The fox came in, swinging his tail.<br>\"Neither strength nor years. In this world it is the clever one who sits at the top.\"<br>\"And how do you measure clever?\" asked the badger.<br>\"Well, that is...\" The fox let the end of it trail off.",
                "Just then a small voice came from behind them.<br>\"Never mind all that. Let us do it this way. Whoever here saw this morning's sun first shall sit at the head.\" The arguing stopped dead.",
                "The beasts all turned to look. A small beast sitting with its hind legs folded had a front paw in the air. It had long ears and red eyes. It was the smallest body there.",
                "The turtle's heart gave a thump. He pulled the picture out from under his shell and opened it. The beast in the picture and that beast were exactly the same. Even the black at the tips of the ears was the same.",
                "\"Found him.\"<br>The turtle held his breath and lowered himself behind the rock.",
                "In the meadow the argument was still going on. In the end nobody got the head place, and the beasts scattered, each of them grumbling. The rabbit stayed to the last, picking up chestnuts that others had dropped. Nobody paid the small beast any attention."
            ]
        },
        {
            num: 4,
            title: "The Promise of an Office",
            art: ["story-04-a.webp", "story-04-b.webp", "story-04-c.webp"],
            artAt: ["I am called Byeoljubu", "There are no hunters in the sea palace", "The rabbit climbed up on the turtle's shell"],
            paras: [
                "The turtle came slowly out. The rabbit noticed him first and put his weight on his hind legs.<br>\"Who is that?\" His ears pricked round toward the turtle.",
                "\"Do not be startled. I come from the sea palace of the South Sea, and I am called Byeoljubu.\"<br>The rabbit looked the turtle's shell over, up and down.<br>\"The sea palace? That palace they say is under the water?\"<br>\"The same.\" The rabbit came a step closer.",
                "The rabbit's nose twitched.<br>\"And what brings you all the way here from a place like that?\"<br>\"I have come looking for a man of parts.\" The turtle was in no hurry.",
                "\"A man of parts?\"<br>\"Our king has heard there is a clever beast on land. He would like to bring him down and give him an office. And having seen you speak up just now in that quarrel over places, I find the report was no idle one.\"",
                "Both the rabbit's ears stood up.<br>\"Me... is that so? Well, to be sure, where in these hills is there a head to match mine?\" He was thinking of the quarrel he had just had.",
                "The turtle laughed to himself and kept a straight face outside.<br>\"And how is life in the hills?\"",
                "At that the rabbit's face darkened at once.<br>\"Don't speak of it. In spring the hungry beasts go about with their eyes alight, in summer the snakes swarm, in autumn the hunters set their traps, and in winter there is nothing to eat and we gnaw the bark off trees. I have never once slept easy in my life.\" As he spoke the rabbit's voice shook.",
                "\"I dare say.\" The turtle nodded. \"So let me tell you something about the sea palace.\"",
                "The turtle lowered his voice.<br>\"There are no hunters in the sea palace. No traps and no eagles. The palace is built of crystal, the pillars are coral and the roof is mother-of-pearl, so that a rainbow rises whenever a current goes by. Pearls roll about on the tables, and there is food to spare in all four seasons.\" Without knowing it the rabbit leaned forward.",
                "The rabbit's red eyes got bigger and bigger.<br>\"And what is more, His Majesty has said he will give you an office. You would wear a cap and a jade belt and sit in a high place.\"",
                "\"An... an office...\" The rabbit swallowed hard. In the hills he had never heard the word office spoken.<br>\"Well? Will you not come with me?\"",
                "The rabbit did not answer at once. But both ears were already leaning right over toward the turtle. His heart was going so that no words came.",
                "Just then a crow on a pine branch overhead gave a caw.<br>\"Rabbit, don't go.\" It was loud enough to ring round the whole hill.",
                "The rabbit looked up.<br>\"And what business is it of yours?\"<br>\"I lived a long time down by that shore. Things that live in the water do not come up on land. And they certainly do not crawl up to hand out offices.\"",
                "Under the turtle's shell a cold sweat broke out. Outside he laughed heartily.<br>\"That bird is jealous of me, I think. Some cannot bear to see another do well.\" He said it so, but his voice had risen a little.",
                "The crow called again.<br>\"Rabbit, think it over. Ask that beast what he wants to get out of you. There is nobody in this world who gives good things for nothing.\" The crow came down to the very end of the branch.",
                "The rabbit hesitated a moment. In that instant the turtle took a step back.<br>\"If that is how it is, then let it be. I crawled three days to get here. If you will not, I shall look for somebody else. Surely you are not the only clever beast in these hills.\"",
                "And he really did turn round and start back down. His step was so slow that even ten paces took him a long while. He was doing it on purpose.",
                "The rabbit watched him go. And then he saw, before his eyes, some other beast wearing the cap and the jade belt and sitting in the high place. He remembered the face of the fox who had let his words go by in the meadow. At that thought his feet moved of themselves.",
                "\"Wait! Wait a moment!\"<br>The rabbit sprang and got ahead of the turtle.<br>\"I'll go. I'll go.\"",
                "The crow called several times more from the branch. The rabbit never once looked up. After a while the sound was only a nuisance to him.",
                "The turtle asked,<br>\"Can you swim?\"<br>\"That I cannot.\"<br>\"Then get on my back. If you keep your eyes shut the water will not go up your nose.\"",
                "The rabbit climbed up on the turtle's shell. The shell was broad and hard and exactly right to sit on. The rabbit held tight to the rim of it with his front paws.",
                "They crossed the sand and came to the water's edge. As the turtle pushed himself under, the rabbit shut both eyes tight. The last thing he heard was the crow calling far off from the hill. When the water came up to his throat the rabbit drew himself in small."
            ]
        },
        {
            num: 5,
            title: "What Happened in the Sea Palace",
            art: ["story-05-a.webp", "story-05-b.webp", "story-05-c.webp"],
            artAt: ["he thought his breath would stop", "Cut that rabbit open and take out the liver", "my liver is not in my belly"],
            paras: [
                "They had gone some way when the turtle said,<br>\"You may open your eyes now.\" The current had grown much softer.",
                "The moment the rabbit opened his eyes he thought his breath would stop. Everything around him was full of blue light. Shoals of fish went by in crowds, coral grew like a wood, and on the bottom the clams opened and closed their mouths. They were colours he had never seen in the hills.",
                "And there ahead of him was the palace. It was exactly as the turtle had said. The pillars were coral and the roof was mother-of-pearl, so that whenever a current went by the whole palace shimmered like a rainbow. The rabbit could not shut his mouth.",
                "\"It is true!\" said the rabbit in wonder. \"Never in my life have I seen the like of this.\"",
                "The palace gate opened and the ministers stood in a long row. But there was something odd in the way their eyes looked at the rabbit. It was not glad and it was not surprised; it was the look of somebody grudging something. Not one of them spoke first.",
                "The rabbit stopped for a moment. But he soon told himself it was nothing. Where is the place, he thought, that welcomes a newcomer from the first? All the same his back kept feeling cold.",
                "Inside the great hall the Dragon King sat in a high place. His face was thin, but his two eyes alone burned frighteningly. His breath came so short that it could be heard across the room.",
                "\"That is the rabbit, then.\"<br>\"It is, Your Majesty.\" The turtle bowed low as he spoke.<br>\"You have done well. Withdraw and rest.\"",
                "The turtle withdrew. But as he went he never once looked toward the rabbit. His shell seemed unusually heavy.",
                "The rabbit stepped forward and bowed.<br>\"A humble thing out of the hills greets Your Majesty. I came on hearing that Your Majesty would grant me an office.\" There was a proud note in his voice.",
                "At those words the hall went quiet for a moment. And then there was a sound of sniggering here and there. The rabbit did not know what the laughing meant.",
                "The Dragon King raised his hand for silence. Then he opened his mouth very slowly.<br>\"An office... Yes. I shall give you something greater than an office. Your name will stay in this sea for ever.\" The end of it was oddly cold.",
                "\"You there.\"<br>The Dragon King's voice rang through the hall.<br>\"Cut that rabbit open and take out the liver.\"",
                "The rabbit's whole body turned to ice.<br>\"What? What... what did Your Majesty say?\" His ears went flat back of themselves.",
                "\"I was told that for my illness a live rabbit's liver is the medicine. That is why you were brought here.\"<br>Soldiers came up with their spears. The spear points glittered in the lamplight.",
                "The rabbit's head went white. Only now did the crow's calling from the pine branch come back to him, clear as anything. There is nobody in this world who gives good things for nothing — that was what it had said.",
                "But the rabbit was a beast that had kept its own life in the hills. Even with his legs shaking under him his head was working furiously. He drew one long breath.",
                "Just before the spear point touched his throat the rabbit suddenly struck his knee and laughed out loud.<br>\"Oh, what a mess this is!\" The laugh rang through the hall.",
                "The Dragon King raised his hand and halted the soldiers.<br>\"And what is the mess?\"",
                "\"Your Majesty, if only you had said so sooner. If it was my liver you wanted, was it not enough simply to say it? Why go to the trouble of lies about offices and the rest of it to bring a fellow down here?\" His voice did not shake in the least.",
                "\"What are you talking about?\"<br>\"At this moment my liver is not in my belly.\"",
                "The hall stirred. The Dragon King's brows twitched.<br>\"No liver? Where is there such a beast?\" The officers looked at one another.",
                "\"Other beasts are not so, but the rabbit alone is different.\" The rabbit went on quite calmly. \"From of old every kind of beast has coveted our livers. So if we carried them about in us we should never know when our bellies would be cut open. Therefore every fifteen days we take the liver out, wash it in clean water, hide it in a cleft of rock, and put it back only when we need it.\"",
                "\"Then where is it now?\"<br>\"It happens that yesterday was the washing day. At this moment my liver is up in the hills airing in a cleft of rock. Cut me open and it will be labour wasted. If Your Majesty does not believe me, cut away.\" And he pushed his belly out. Nobody was willing to take up a knife."
            ]
        },
        {
            num: 6,
            title: "After They Reached Land",
            art: ["story-06-a.webp", "story-06-b.webp", "story-06-c.webp"],
            artAt: ["glared at the rabbit for a long while", "Where is there a beast that lives with its liver taken out", "still lying flat on that sand"],
            paras: [
                "The Dragon King glared at the rabbit for a long while. The rabbit did not blink once. In the hall there was not even the sound of breathing.",
                "Minister Octopus spoke up carefully.<br>\"Your Majesty, if we cut him open and there truly is no liver, we lose the beast and the medicine both.\"<br>The other officers watched the Dragon King's face and nodded too.",
                "Then the turtle came forward.<br>\"Your Majesty, what he says is a lie. How should a beast live with its liver put away somewhere?\" His voice rose without his meaning it to.",
                "The rabbit turned to look at the turtle. And he put on a deeply injured face.<br>\"Byeoljubu, was it not you who told me I should be given an office? Was that true?\" He even let his ears droop.",
                "The turtle had nothing to say. The hall went quiet. The one who had lied was the turtle, and everybody had seen it. The turtle could not lift his head.",
                "The Dragon King let out a long breath.<br>\"Rabbit, if what you say is true, what would you have me do?\"<br>\"Take me back to the land. In half a day I shall find the liver and return. Why should I refuse a thing that cures Your Majesty and earns me a great reward besides?\"",
                "It sounded reasonable enough. At last the Dragon King nodded.<br>\"Let it be so. I shall forget the rudeness of today. And when you bring your liver, then I shall truly grant you an office.\" The rabbit made a low bow.",
                "That evening there was a great feast in the sea palace. The rabbit sat at the head of the table and ate rare food until he was fit to burst. Only of the wine he did not touch one drop. He knew that a drunk man's words go astray.",
                "Before dawn the next day the turtle took the rabbit on his back and went up the water road again. Neither of them said anything. There was only the sound of the water parting.",
                "When they reached the sand the rabbit jumped down off the shell. Then he scratched at the earth a few times with his front paws and twitched his nose to smell the grass. It was a long time since he had smelled earth.",
                "\"Byeoljubu.\"<br>\"Go quickly and fetch the liver.\"<br>The rabbit grinned.<br>\"Where is there a beast that lives with its liver taken out?\"",
                "The turtle froze where he stood. The rabbit was already ten paces off.<br>\"You deceived me, so I have deceived you. Does that not make us even?\"<br>And then he went bounding off toward the hills and was gone. The turtle could not follow one step.",
                "For more than half a day the turtle was still lying flat on that sand. The sun went down and the water came up to his feet and he did not move. The waves went over his shell again and again.",
                "With what face was he to go back to the sea palace? His king was still lying in his bed and he was empty-handed. And on top of that he had been made a liar in the middle of the court. The road back was under the water, and still it seemed far away.",
                "The tears fell from the turtle's eyes drop by drop and soaked into the sand.<br>\"My mother told me that whatever happened I was to tell no lies.\"",
                "Then a voice came from behind him.<br>\"Do not cry.\" It was a low, slow voice.",
                "He turned and there stood an old man in white robes. His beard came down to his chest and he held a staff in his hand. The turtle had never seen the old man before, and somehow he did not seem a stranger.",
                "\"Who are you, sir?\"<br>\"One who called once at your king's bedside.\"",
                "The turtle threw himself down at once.<br>\"Sir, I have lost the rabbit. There is no way left to save His Majesty.\" He lay with his forehead down against the sand.",
                "The old man planted his staff in the sand and said,<br>\"When I spoke of a rabbit's liver I was not telling him a medicine. I wanted to see whether in all this wide country there was even one who would go up on land for his king.\" The turtle's eyes went wide.",
                "\"What?\"<br>\"Those in high office all said they could not go, and you, who held no office at all, said you would. That was enough.\"",
                "The old man took a small root out of his coat and set it down in front of the turtle. It was an old wild ginseng, earth-coloured.<br>\"Boil this and have him drink it. In three days he will be up.\" The soil was still on the fine roots.",
                "When the turtle raised his head the old man was already gone. On the sand there were only a few marks left by a staff.",
                "The turtle pushed the ginseng in under his shell and went into the water. Three days later the Dragon King of the South Sea got up from his bed. For the first time in a long while the palace was full of the sound of laughing.",
                "The Dragon King meant to give the turtle a high office. But the turtle declined it.<br>\"Your servant is one who lied to another and brought him here by deceit. I have no face to take a reward.\"<br>\"Was that lie not told for my sake?\"<br>\"A lie is a lie all the same.\"",
                "It was a long while before the Dragon King nodded. Then he seated the turtle at the very front of the court, but gave him no name of office. A minister sitting at the front with no office was the first such since the sea palace began. They say that place is still called Byeoljubu's place.",
                "As for the rabbit in the hills, they say he never went near the water again. Only, they say that if anybody so much as brought up the word office, he would lay his ears flat and start backing away first."
            ]
        }
    ],
    /* 단어장 — 그림책은 펼침면마다 묶지만, 소설은 장마다 묶는다.
       쪽은 재어서 나누므로 미리 알 수 없기 때문이다.
       화면에는 그 쪽에 실제로 나온 낱말만 골라 보여 준다(vocabFor). */
    words: {
        "cover": [
            { w: "with no known author", k: "지은이가 알려지지 않은", s: "a Joseon novel with no known author" },
            { w: "is also called (call)", k: "~라고도 불린다", s: "It is also called The Tale of Byeoljubu and Sugung-ga." },
            { w: "was sung as pansori (sing)", k: "판소리로 불렸다", s: "It was sung as pansori before it was written down" },
            { w: "run on in lists (run on)", k: "늘어놓는다", s: "the sentences so often run on in lists" },
            { w: "older still", k: "훨씬 더 오래된", s: "Its roots are older still" },
            { w: "depends on ~ (depend)", k: "~에 따라 다르다", s: "the last page depends on which book you open" },
            { w: "dozens of endings", k: "수십 가지로 갈린 끝", s: "dozens of endings" }
        ],
        "ch1": [
            { w: "shimmered like a rainbow (shimmer)", k: "무지갯빛으로 일렁였다", s: "the whole palace shimmered like a rainbow" },
            { w: "folded their fins (fold)", k: "지느러미를 모았다", s: "they folded their fins and bowed their heads" },
            { w: "made merry (make merry)", k: "놀았다", s: "they made merry for three days and nights" },
            { w: "run dry (run)", k: "마르다", s: "no cup was ever allowed to run dry" },
            { w: "sat straight back down (sit)", k: "그대로 주저앉았다", s: "started to get up from his seat and sat straight back down" },
            { w: "kept to his bed (keep)", k: "자리에 누웠다", s: "the Dragon King kept to his bed" },
            { w: "wetted his lips (wet)", k: "겨우 축였다", s: "barely wetted his lips with water" },
            { w: "talked out of his head (talk)", k: "헛소리를 했다", s: "At night he talked out of his head" },
            { w: "was turned upside down (turn)", k: "발칵 뒤집혔다", s: "The whole sea palace was turned upside down" },
            { w: "felt his pulse (feel)", k: "맥을 짚었다", s: "The carp physician felt his pulse" },
            { w: "boiled down (boil down)", k: "달였다", s: "They boiled down seaweed and kelp" },
            { w: "The moon changed twice (change)", k: "달이 두 번 바뀌었다", s: "The moon changed twice" },
            { w: "stamping their feet (stamp)", k: "발만 굴렀다", s: "stood about in front of the palace stamping their feet" },
            { w: "under heaven", k: "천하의", s: "every famous doctor under heaven" },
            { w: "out loud", k: "크게 소리 내어", s: "nobody said much about the land out loud" },
            { w: "the breath stops (stop)", k: "숨이 막힌다", s: "a place where the breath stops" },
            { w: "half asleep", k: "잠결에", s: "half asleep, the Dragon King opened his eyes" },
            { w: "was barred (bar)", k: "잠겨 있었다", s: "The door was barred" },
            { w: "as if it had been washed away (wash)", k: "씻은 듯이", s: "you will be well as if it had been washed away" },
            { w: "said it over (say)", k: "되뇌었다", s: "The Dragon King said it over" },
            { w: "timid", k: "겁이 많은", s: "It is very timid and very cunning" },
            { w: "blurred and faded (blur)", k: "스르르 흐려졌다", s: "the old man's figure blurred and faded" },
            { w: "came to himself (come to)", k: "정신을 차렸다", s: "When he came to himself there was nobody beside the bed" },
            { w: "glanced at one another (glance)", k: "서로 눈치를 살폈다", s: "The ministers glanced at one another" },
            { w: "curled up under him (curl)", k: "몸 아래로 말아 넣었다", s: "quietly curled all eight of his legs up under him" },
            { w: "passing the thing on to somebody else (pass on)", k: "남에게 미루는", s: "a word passing the thing on to somebody else" }
        ],
        "ch2": [
            { w: "come forward (come)", k: "앞으로 나서다", s: "Minister Octopus was the first to come forward" },
            { w: "dry up (dry)", k: "바싹 말라붙다", s: "I should dry up altogether" },
            { w: "the fitting choice", k: "마땅한 사람", s: "would surely be the fitting choice" },
            { w: "General Shark jumped (jump)", k: "상어 장군이 펄쩍 뛰었다", s: "General Shark jumped" },
            { w: "fearsome to look at", k: "생김새가 험한", s: "your servant is fearsome to look at" },
            { w: "waved his fins about (wave)", k: "지느러미를 홰홰 저었다", s: "Lord Croaker waved his fins about" },
            { w: "is salted at once (salt)", k: "곧바로 소금에 절여진다", s: "once on land, is salted at once" },
            { w: "the standing of the whole country", k: "나라의 체면", s: "the standing of the whole country hangs on it" },
            { w: "went red and then went blue (go)", k: "붉어졌다 푸르러졌다", s: "the Dragon King's face went red and then went blue" },
            { w: "walks only sideways (walk)", k: "옆으로만 걷는다", s: "Your servant walks only sideways" },
            { w: "grounds (ground)", k: "땅에 걸린다", s: "his belly grounds before he ever gets near the shore" },
            { w: "trodden to death (tread)", k: "밟혀 죽는다", s: "he is trodden to death on a hill path" },
            { w: "reasons why not", k: "못 간다는 핑계", s: "full of nothing but reasons why not" },
            { w: "His thin hand trembled (tremble)", k: "야윈 손이 떨렸다", s: "His thin hand trembled" },
            { w: "bowed their heads together (bow)", k: "일제히 고개를 숙였다", s: "the ministers all bowed their heads together" },
            { w: "stepped forward (step)", k: "나서다", s: "still nobody stepped forward" },
            { w: "a stir went round (go)", k: "술렁였다", s: "A stir went round the court" },
            { w: "lay flat (lie)", k: "엎드려 있었다", s: "a soft-shelled turtle lay flat" },
            { w: "never came round (come round)", k: "차례가 오지 않았다", s: "his turn to speak never came round" },
            { w: "moss grown on his shell (grow)", k: "등딱지에 이끼가 앉은", s: "an old turtle with moss grown on his shell" },
            { w: "swallowing a laugh (swallow)", k: "웃음을 참는", s: "the sound of somebody swallowing a laugh" },
            { w: "draw my head and legs inside (draw)", k: "머리와 다리를 안으로 넣다", s: "I can draw my head and legs inside" },
            { w: "the one who ought to go (ought)", k: "가야 마땅한 자", s: "the one who can go is the one who ought to go" },
            { w: "out of the common", k: "보통이 아닌", s: "there was something out of the common about that fellow" },
            { w: "meet his eye (meet)", k: "눈을 마주치다", s: "Not one of them could meet his eye" },
            { w: "load you with treasure (load)", k: "보물을 지워 주다", s: "Shall I load you with treasure?" },
            { w: "struck his knee (strike)", k: "무릎을 쳤다", s: "The Dragon King struck his knee" },
            { w: "stroked his shell (stroke)", k: "등딱지를 쓰다듬었다", s: "stroked her son's shell for a long time" },
            { w: "tell no lies (tell)", k: "거짓말은 하지 마라", s: "whatever happens, tell no lies" },
            { w: "felt over ~ with her hands (feel over)", k: "손으로 더듬었다", s: "felt over her son's face with her hands" }
        ],
        "ch3": [
            { w: "at a loss", k: "난처한", s: "his face was soon at a loss" },
            { w: "stopped in mid-air (stop)", k: "허공에서 멈추었다", s: "The hand holding the brush stopped in mid-air" },
            { w: "felt back through his memory (feel back)", k: "옛 기억을 더듬었다", s: "felt back through his memory as he spoke" },
            { w: "put together (put)", k: "붙여 놓은", s: "the size of two grown men's fists put together" },
            { w: "whitish", k: "희끗한", s: "the belly is whitish" },
            { w: "swept across (sweep)", k: "스윽 지나갔다", s: "The brush swept across the paper" },
            { w: "as if it had just been startled (startle)", k: "놀란 것처럼", s: "as if it had just been startled" },
            { w: "twitching (twitch)", k: "실룩거리는", s: "The nose is small and always twitching" },
            { w: "is split into three (split)", k: "셋으로 갈라져 있다", s: "the upper lip is split into three" },
            { w: "craned their necks (crane)", k: "목을 뺐다", s: "The ministers craned their necks to look" },
            { w: "crowded round ~ (crowd)", k: "빙 둘러쌌다", s: "crowded round the picture and looked at it" },
            { w: "rolled it up carefully (roll up)", k: "곱게 말았다", s: "The turtle rolled it up carefully" },
            { w: "in case it got wet (get)", k: "행여 젖을까", s: "In case it got wet he wrapped it once more in oiled paper" },
            { w: "Come back alive (come back)", k: "살아서 돌아오너라", s: "Come back alive" },
            { w: "see ~ off (see off)", k: "배웅하다", s: "came out as far as the palace gate to see the turtle off" },
            { w: "put his head out of the water (put out)", k: "물 밖에 머리를 내밀었다", s: "the turtle put his head out of the water" },
            { w: "His breath caught (catch)", k: "숨이 턱 막혔다", s: "His breath caught" },
            { w: "stung his throat (sting)", k: "목이 따가웠다", s: "Every breath stung his throat" },
            { w: "heavy as a rock", k: "바위처럼 무거운", s: "on land his shell was heavy as a rock" },
            { w: "got his breath (get)", k: "숨을 골랐다", s: "lay flat in the shade of a rock and got his breath" },
            { w: "hot to the touch", k: "만지면 뜨거운", s: "had heated in the sun and was hot to the touch" },
            { w: "crept up to look (creep)", k: "조심조심 다가갔다", s: "The turtle crept up to look" },
            { w: "let the end of it trail off (trail off)", k: "말끝을 흐렸다", s: "The fox let the end of it trail off" },
            { w: "stopped dead (stop)", k: "뚝 그쳤다", s: "The arguing stopped dead" },
            { w: "gave a thump (give)", k: "쿵 내려앉았다", s: "The turtle's heart gave a thump" },
            { w: "held his breath (hold)", k: "숨을 죽였다", s: "The turtle held his breath" },
            { w: "scattered (scatter)", k: "흩어졌다", s: "the beasts scattered, each of them grumbling" },
            { w: "paid ~ any attention (pay)", k: "눈여겨보았다", s: "Nobody paid the small beast any attention" }
        ],
        "ch4": [
            { w: "put his weight on ~ (put)", k: "힘을 주었다", s: "put his weight on his hind legs" },
            { w: "pricked round (prick)", k: "쫑긋 섰다", s: "His ears pricked round toward the turtle" },
            { w: "looked ~ over, up and down (look over)", k: "위아래로 훑어보았다", s: "looked the turtle's shell over, up and down" },
            { w: "twitched (twitch)", k: "실룩거렸다", s: "The rabbit's nose twitched" },
            { w: "a man of parts", k: "인재", s: "I have come looking for a man of parts" },
            { w: "no idle one", k: "헛말이 아닌", s: "I find the report was no idle one" },
            { w: "kept a straight face (keep)", k: "정색을 했다", s: "kept a straight face outside" },
            { w: "darkened at once (darken)", k: "대번에 어두워졌다", s: "the rabbit's face darkened at once" },
            { w: "with their eyes alight", k: "눈에 불을 켜고", s: "the hungry beasts go about with their eyes alight" },
            { w: "swarm", k: "들끓다", s: "in summer the snakes swarm" },
            { w: "set their traps (set)", k: "덫을 놓는다", s: "the hunters set their traps" },
            { w: "gnaw the bark off trees (gnaw)", k: "나무껍질을 갉아 먹다", s: "we gnaw the bark off trees" },
            { w: "slept easy (sleep)", k: "마음 놓고 잠들었다", s: "I have never once slept easy in my life" },
            { w: "leaned forward (lean)", k: "몸을 앞으로 기울였다", s: "the rabbit leaned forward" },
            { w: "swallowed hard (swallow)", k: "침을 꿀꺽 삼켰다", s: "The rabbit swallowed hard" },
            { w: "gave a caw (give)", k: "깍 하고 울었다", s: "a crow on a pine branch overhead gave a caw" },
            { w: "what business is it of yours", k: "너는 또 왜 참견이냐", s: "And what business is it of yours?" },
            { w: "hand out offices (hand out)", k: "벼슬을 주다", s: "they certainly do not crawl up to hand out offices" },
            { w: "a cold sweat broke out (break out)", k: "식은땀이 흘렀다", s: "a cold sweat broke out" },
            { w: "laughed heartily (laugh)", k: "껄껄 웃었다", s: "Outside he laughed heartily" },
            { w: "is jealous of ~", k: "시기한다", s: "That bird is jealous of me" },
            { w: "for nothing", k: "까닭 없이", s: "who gives good things for nothing" },
            { w: "took a step back (take)", k: "한 걸음 물러섰다", s: "the turtle took a step back" },
            { w: "on purpose", k: "일부러", s: "He was doing it on purpose" },
            { w: "let his words go by (let go by)", k: "제 말을 흘려들었다", s: "the fox who had let his words go by in the meadow" },
            { w: "moved of themselves (move)", k: "저절로 움직였다", s: "his feet moved of themselves" },
            { w: "sprang and got ahead of ~ (spring)", k: "껑충 뛰어 앞질렀다", s: "The rabbit sprang and got ahead of the turtle" },
            { w: "only a nuisance", k: "성가시기만 한", s: "the sound was only a nuisance to him" },
            { w: "go up your nose (go)", k: "코로 들어가다", s: "the water will not go up your nose" },
            { w: "held tight to ~ (hold)", k: "꼭 붙들었다", s: "The rabbit held tight to the rim of it" },
            { w: "drew himself in small (draw)", k: "몸을 움츠렸다", s: "the rabbit drew himself in small" }
        ],
        "ch5": [
            { w: "had grown much softer (grow)", k: "한결 부드러워졌다", s: "The current had grown much softer" },
            { w: "Shoals of fish", k: "물고기 떼", s: "Shoals of fish went by in crowds" },
            { w: "could not shut his mouth (shut)", k: "입을 다물지 못했다", s: "The rabbit could not shut his mouth" },
            { w: "in wonder", k: "감탄하며", s: "said the rabbit in wonder" },
            { w: "grudging something (grudge)", k: "아까워하는", s: "it was the look of somebody grudging something" },
            { w: "told himself it was nothing (tell)", k: "스스로를 다독였다", s: "he soon told himself it was nothing" },
            { w: "his back kept feeling cold (keep)", k: "자꾸 뒤가 서늘했다", s: "his back kept feeling cold" },
            { w: "burned frighteningly (burn)", k: "무섭게 빛났다", s: "his two eyes alone burned frighteningly" },
            { w: "came so short (come)", k: "몹시 가빴다", s: "His breath came so short" },
            { w: "Withdraw and rest (withdraw)", k: "물러가 쉬어라", s: "Withdraw and rest" },
            { w: "a proud note", k: "자랑스러운 기색", s: "There was a proud note in his voice" },
            { w: "sniggering (snigger)", k: "킥킥거리는", s: "a sound of sniggering here and there" },
            { w: "raised his hand for silence (raise)", k: "손을 들어 조용히 시켰다", s: "The Dragon King raised his hand for silence" },
            { w: "rang through the hall (ring)", k: "대궐을 울렸다", s: "voice rang through the hall" },
            { w: "turned to ice (turn)", k: "얼음이 되었다", s: "The rabbit's whole body turned to ice" },
            { w: "went flat back (go)", k: "뒤로 눕혀졌다", s: "His ears went flat back of themselves" },
            { w: "glittered in the lamplight (glitter)", k: "등불을 받아 번들거렸다", s: "The spear points glittered in the lamplight" },
            { w: "went white (go)", k: "새하얘졌다", s: "The rabbit's head went white" },
            { w: "came back to him (come back)", k: "되살아났다", s: "come back to him, clear as anything" },
            { w: "was working furiously (work)", k: "무섭게 돌아갔다", s: "his head was working furiously" },
            { w: "drew one long breath (draw)", k: "숨을 크게 골랐다", s: "He drew one long breath" },
            { w: "struck his knee (strike)", k: "무릎을 쳤다", s: "the rabbit suddenly struck his knee and laughed out loud" },
            { w: "halted the soldiers (halt)", k: "군사를 멈춰 세웠다", s: "raised his hand and halted the soldiers" },
            { w: "go to the trouble of ~ (go)", k: "무엇하러 ~하다", s: "Why go to the trouble of lies about offices" },
            { w: "brows twitched (twitch)", k: "눈썹이 꿈틀했다", s: "The Dragon King's brows twitched" },
            { w: "have coveted ~ (covet)", k: "탐을 냈다", s: "every kind of beast has coveted our livers" },
            { w: "a cleft of rock", k: "바위틈", s: "hide it in a cleft of rock" },
            { w: "labour wasted (waste)", k: "헛수고", s: "Cut me open and it will be labour wasted" },
            { w: "pushed his belly out (push out)", k: "배를 쭉 내밀었다", s: "he pushed his belly out" },
            { w: "was willing to ~ (be willing)", k: "선뜻 ~했다", s: "Nobody was willing to take up a knife" }
        ],
        "ch6": [
            { w: "glared at ~ (glare)", k: "노려보았다", s: "glared at the rabbit for a long while" },
            { w: "did not blink once (blink)", k: "눈 하나 깜짝하지 않았다", s: "The rabbit did not blink once" },
            { w: "spoke up carefully (speak up)", k: "조심스레 아뢰었다", s: "Minister Octopus spoke up carefully" },
            { w: "rose without his meaning it to (rise)", k: "저도 모르게 높아졌다", s: "His voice rose without his meaning it to" },
            { w: "a deeply injured face", k: "아주 서운한 얼굴", s: "he put on a deeply injured face" },
            { w: "let his ears droop (let)", k: "귀를 축 늘어뜨렸다", s: "He even let his ears droop" },
            { w: "had nothing to say", k: "말문이 막혔다", s: "The turtle had nothing to say" },
            { w: "could not lift his head (lift)", k: "고개를 들지 못했다", s: "The turtle could not lift his head" },
            { w: "let out a long breath (let out)", k: "길게 숨을 내쉬었다", s: "The Dragon King let out a long breath" },
            { w: "earns me a great reward (earn)", k: "큰 상을 받는다", s: "earns me a great reward besides" },
            { w: "sounded reasonable enough (sound)", k: "그럴듯하게 들렸다", s: "It sounded reasonable enough" },
            { w: "the rudeness of today", k: "오늘 저지른 무례", s: "I shall forget the rudeness of today" },
            { w: "fit to burst (burst)", k: "배가 터지도록", s: "ate rare food until he was fit to burst" },
            { w: "go astray (go)", k: "헛나온다", s: "a drunk man's words go astray" },
            { w: "Before dawn", k: "새벽에", s: "Before dawn the next day" },
            { w: "jumped down off ~ (jump)", k: "폴짝 뛰어내렸다", s: "the rabbit jumped down off the shell" },
            { w: "scratched at the earth (scratch)", k: "흙을 긁어 보았다", s: "he scratched at the earth a few times" },
            { w: "grinned (grin)", k: "씩 웃었다", s: "The rabbit grinned" },
            { w: "froze where he stood (freeze)", k: "그 자리에 굳었다", s: "The turtle froze where he stood" },
            { w: "make us even (make)", k: "셈이 맞다", s: "Does that not make us even?" },
            { w: "went bounding off (go)", k: "껑충껑충 뛰어 사라졌다", s: "he went bounding off toward the hills" },
            { w: "empty-handed (hand)", k: "빈손인", s: "he was empty-handed" },
            { w: "was made a liar (make)", k: "거짓말쟁이가 되었다", s: "he had been made a liar in the middle of the court" },
            { w: "soaked into the sand (soak)", k: "모래에 스몄다", s: "drop by drop and soaked into the sand" },
            { w: "did not seem a stranger (seem)", k: "낯설지 않았다", s: "somehow he did not seem a stranger" },
            { w: "threw himself down (throw)", k: "얼른 엎드렸다", s: "The turtle threw himself down at once" },
            { w: "planted his staff in the sand (plant)", k: "지팡이로 모래를 짚었다", s: "The old man planted his staff in the sand" },
            { w: "went wide (go)", k: "눈을 크게 떴다", s: "The turtle's eyes went wide" },
            { w: "held no office at all (hold)", k: "아무 벼슬도 없던", s: "you, who held no office at all" },
            { w: "declined it (decline)", k: "사양했다", s: "But the turtle declined it" },
            { w: "by deceit", k: "속여서", s: "brought him here by deceit" },
            { w: "no face to take a reward", k: "상을 받을 낯이 없다", s: "I have no face to take a reward" },
            { w: "the first such since ~", k: "~이래 처음", s: "was the first such since the sea palace began" },
            { w: "lay his ears flat (lay)", k: "귀를 착 눕히다", s: "he would lay his ears flat" }
        ]
    },
    quiz: [
        { q: "How did the Dragon King fall ill?", choices: ["He was badly hurt in a fight", "After a feast that ran three days and nights", "He stayed too long in a cold current"], answer: 1 },
        { q: "Who told him what medicine would cure him?", choices: ["Minister Octopus", "The carp minister", "An immortal who was passing"], answer: 2 },
        { q: "Who offered to go up on land?", choices: ["Byeoljubu the turtle", "Minister Octopus", "The carp minister"], answer: 0 },
        { q: "What did the turtle take with him to the land?", choices: ["A bead the Dragon King gave him", "A picture of the rabbit", "A sea herb for medicine"], answer: 1 },
        { q: "What did the turtle hold out to tempt the rabbit?", choices: ["An office in the sea palace", "A sack of gold and silver", "A wide piece of land in the hills"], answer: 0 },
        { q: "Who tried to stop the rabbit from going?", choices: ["The fox", "The crow", "The roe deer"], answer: 1 },
        { q: "What did the rabbit tell the Dragon King?", choices: ["That he had never had a liver at all", "That he had left his liver in a cleft of rock", "That he would not give up his liver"], answer: 1 },
        { q: "What did the Dragon King do when he heard it?", choices: ["He shut him up on the spot", "He did not believe him and grew angry", "He laid on a great feast for him"], answer: 2 },
        { q: "What did the rabbit do once he was back on land?", choices: ["He bounded off and away", "He fetched the liver and gave it up", "He pushed the turtle into the water"], answer: 0 },
        { q: "What cured the Dragon King's illness in the end?", choices: ["The liver the rabbit sent", "The needles of the palace physician", "The ginseng the immortal gave"], answer: 2 },
        { q: "What did the turtle say when he refused the reward?", choices: ["That he had no face for it, having lied", "That he had been given enough already", "That he wanted to go home"], answer: 0 },
        { q: "What place did the turtle end up with in the sea palace?", choices: ["The highest office of all", "The front seat with no office", "A corner of the sand outside the palace"], answer: 1 },
        {
            q: "Which reaction to this book does NOT fit?",
            wide: true,
            choices: [
                "The Dragon King fell ill after a feast and went looking for another's liver, so those below pay for what those above do.",
                "The turtle tempted the rabbit with a post at court, so everyone has one offer that turns their head.",
                "The turtle refused his reward, saying he had no face after lying, so doing as you are told still leaves something behind.",
                "The Dragon King laid on a great table for the rabbit, so he meant to treat his guest properly before asking."
            ],
            answer: 3
        }
    ],
    afterword: {
        title: 'After Reading',
        emoji: '🐢',
        art: ['end.webp'],
        paras: [
            "This story was a song before it was a book, and before it was a song it was a very short old tale. The oldest place it can be traced to is the History of the Three Kingdoms.",
            "Look at that passage again and the one who tells the tale is a man of Goguryeo. A man of the country that was holding him told the prisoner how to get out. So this story was never only for amusement. It was a story that told a shut-in man how to get out.",
            "Go further back and it reaches India. An old Indian story collection has a crocodile after a monkey's heart. The monkey saves himself by saying he left his heart hanging in a tree. Only the animals have changed; the bones are the same. The story is thought to have come from India through China and across to our country.",
            "That short tale came to Joseon and became the pansori Sugung-ga. Singer after singer put flesh on it, and so we got the scene of the palace ministers arguing over which of them will not go, the beasts the rabbit meets on land, and the turtle wandering about with his picture. What had been a few lines became something hours long.",
            "The book has several names too: The Tale of the Rabbit, The Tale of Byeoljubu, The Rabbit's Liver. Which you put first changes whose story it is. Call it The Tale of the Rabbit and it is about a rabbit who got out by his wits. Call it The Tale of Byeoljubu and it is about a turtle who went up on land at the risk of his life for his king.",
            "The byeol in Byeoljubu means soft-shelled turtle. But the soft-shelled turtle lives in rivers and marshes and cannot last long in sea water. It has no way of getting the salt back out of its body. What lives in the sea is not the soft-shelled turtle but the sea turtle. So a soft-shelled turtle holding office in the Dragon Palace of the South Sea does not add up.",
            "In the original story in the History of the Three Kingdoms it is not a soft-shelled turtle but a hard-shelled one. It is not that people long ago had it wrong. While the story was being sung, Byeoljubu, which was the name of an office, became the name of the animal itself, and it set as the soft-shelled turtle. In this book the turtle and the old hard-shelled turtle appear separately. The names were kept apart; where each of them lives was never worked out.",
            "What this story is aiming at is plain. The Dragon King would cut open somebody else's body to cure his own illness. The ministers do nothing but pass it along to each other. Only the turtle steps forward. And even that turtle can save his king only by deceiving somebody. It is a story that says this is mostly how the business of those at the top is done.",
            "The way the rabbit wins is worth noticing too. He does not win by strength. He does not win by being quick on his feet. He wins by talking. A claim that will not stand a moment's thought — that rabbits carry their livers about outside them — and the whole sea palace swallows it.",
            "Why did they believe it? Because they wanted to. The Dragon King wanted to live, and the ministers wanted the business over with. People are taken in not because the one deceiving them is clever but because the ones being deceived want something — and this story points that out with a laugh.",
            "The place where the rabbit makes up his mind to leave is worth another look as well. What drew the rabbit into the water in the first place was the promise of an office. A rabbit living well enough in the hills followed a stranger under water at one word about a high place. There was something in the one deceived that gave the lie its hold.",
            "The endings differ from book to book. In some the turtle goes back empty-handed and is punished, in some he throws himself into the sea, and in some, as here, an immortal appears and hands over a medicine. The singer decided by the faces in front of him. There is no settling which was the original ending.",
            "There is a reason this book called in an immortal. It was awkward to punish the turtle. He told a lie, but he took nothing for himself by it. And it is hard to reward him either. So it ends by seating him at the front with no name of office.",
            "Was the turtle's lie the kind that can be forgiven? It was a lie told on his way to kill somebody. And it was also told to save his king. The turtle himself said he had no face to take a reward. What do you think?",
            "And the rabbit's lie? Set it beside the turtle's and see what is different about it, or whether there is nothing different at all. Both were lies told to stay alive.",
            "The Dragon King was never punished at all — a man who tried to take another's life to cure his own illness. Think about why the story does not punish him, and how the story would be different if it had."
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
    .replace(/<span class=\"gloss\">[\s\S]*?<\/span>/g, '')
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
