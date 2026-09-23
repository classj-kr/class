const BOOK_TITLE = "전우치전";

const CHAPTER_LABEL = n => (LANG === 'en' ? `Chapter ${n} · ` : `${n}장 · `);

const CHAPTERS = [
    {
        num: 1,
        emoji: "🦊",
        title: "여우 구슬",
        art: ["story-01-a.webp", "story-01-b.webp", "story-01-c.webp"],
        artAt: ["처녀가 입에서 구슬 하나를 꺼냈습니다", "노인이 붓을 들고 있었습니다", "우치는 처음으로 구름을 탔습니다"],
        paras: [
            "조선 중종 임금 때 송도에 전우치라는 젊은이가 살았습니다. 송도는 고려의 서울이었던 곳으로, 지금의 개성입니다. 우치는 어려서 아버지를 잃고 어머니와 둘이 살았습니다.",
            "우치는 글이 빨랐습니다. 한 번 읽으면 잊지 않았고 스승이 묻기 전에 먼저 답했습니다. 그런데 글만 빠른 것이 아니라 장난도 빨랐습니다. 서당 훈장의 갓을 감나무 꼭대기에 걸어 놓은 것도 우치였습니다.",
            "훈장이 감나무 아래서 소리쳤습니다.<br>\"누가 내 갓을 저기 올렸느냐!\"<br>\"바람이 그랬나 봅니다.\"<br>\"바람이 갓끈까지 매어 놓더냐.\"<br>아이들이 웃음을 터뜨렸고 훈장도 끝내 웃고 말았습니다. 우치의 장난은 늘 그랬습니다. 누구를 다치게 하는 법이 없었습니다.",
            "열여섯 되던 해 봄, 우치는 산 너머 서당에 다니느라 날마다 고개를 넘었습니다. 어느 저녁 고개 마루에서 한 처녀가 우치를 불렀습니다. 흰 저고리에 붉은 치마를 입었고 눈이 유난히 길었습니다.",
            "\"도련님, 날이 저물었는데 어디로 가십니까.\"<br>\"집에 가오.\"<br>\"저도 그쪽입니다. 같이 가시지요.\"",
            "처녀는 고개 아래 갈림길까지 함께 걷다가 사라졌습니다. 이튿날도 그 이튿날도 처녀는 같은 자리에 서 있었습니다. 우치는 처녀와 걷는 것이 좋아졌습니다. 그런데 이상하게도 집에 오면 몸이 나른하고 밥맛이 없었습니다.",
            "어머니가 아들의 얼굴을 보고 놀랐습니다.<br>\"네 얼굴이 왜 이렇게 누렇게 떴느냐.\"<br>우치는 처녀 이야기를 했습니다. 어머니의 얼굴이 하얘졌습니다.",
            "어머니는 서당 훈장을 찾아갔습니다. 훈장은 이야기를 다 듣고 나서 말했습니다.<br>\"그것은 사람이 아닐세. 오래 묵은 여우일세. 여우는 입속에 구슬을 물고 사람의 기운을 빨아먹지.\"",
            "\"그 구슬을 여우가 입에서 꺼내 보일 때가 있을 걸세. 그때 그것을 삼키게. 삼키고 나서 먼저 하늘을 보면 하늘의 일을 알게 되고, 땅을 보면 땅의 일을 알게 되네.\"",
            "이튿날 저녁, 우치는 고개에서 처녀를 만났습니다. 처녀가 다가와 웃으며 말했습니다.<br>\"도련님, 오늘은 제가 재미난 것을 보여 드릴게요.\"<br>처녀가 입에서 구슬 하나를 꺼냈습니다. 밤톨만 한 구슬이 저녁 빛을 받아 파랗게 빛났습니다.",
            "\"이것을 입에 물고 있으면 무엇이든 보인답니다. 한번 물어 보시겠어요?\"<br>처녀가 구슬을 우치의 입에 넣어 주었습니다. 우치는 그것을 꿀꺽 삼켜 버렸습니다.",
            "처녀가 비명을 질렀습니다. 그 소리는 사람 소리가 아니었습니다. 흰 저고리가 흰 털로 변하고 붉은 치마가 아홉 갈래 꼬리로 변했습니다. 커다란 흰 여우가 우치를 노려보다가 숲으로 달아났습니다.",
            "우치는 너무 놀라 그만 땅부터 보고 말았습니다. 훈장의 말이 떠올랐을 때는 이미 늦었습니다. 하늘의 일은 모르게 되었지만, 땅 위의 일은 훤히 알게 되었습니다. 산 너머 마을에서 누가 무엇을 하는지가 눈앞에 보이듯 떠올랐습니다.",
            "그날 밤 우치는 잠을 자지 못했습니다. 눈을 감아도 온 세상이 보였습니다. 새벽에 우치는 뒷산에 올라가 바위 위에 앉았습니다. 그때 누가 곁에 와 앉았습니다.",
            "흰 수염이 허리까지 내려온 노인이었습니다. 노인이 붓을 들고 있었습니다.<br>\"여우 구슬을 삼켰구나. 그것은 재주지 도가 아니다. 재주만 있고 도가 없으면 사람을 해친다.\"",
            "\"저는 누구를 해칠 마음이 없습니다.\"<br>\"지금은 그렇겠지. 내가 한 가지만 가르쳐 주마. 나머지는 네가 살면서 배워라.\"",
            "노인은 붓으로 허공에 무언가를 그렸습니다. 구름 한 조각이 바위 앞에 내려앉았습니다.<br>\"올라타 보아라.\"<br>우치는 처음으로 구름을 탔습니다. 발밑에 송도가 손바닥만 하게 보였습니다.",
            "구름에서 내려왔을 때 노인은 없었습니다. 바위 위에 붓 한 자루만 놓여 있었습니다. 우치는 그 붓을 소매에 넣었습니다. 그 뒤로 우치는 그 붓으로 그린 것은 무엇이든 진짜로 만들 수 있게 되었습니다.",
            "우치는 혼자서 구름을 다시 불러 보았습니다. 붓으로 허공에 구름을 그리자 정말로 구름이 내려왔습니다. 올라탔더니 구름이 기우뚱하며 우치를 논바닥에 떨어뜨렸습니다. 우치는 흙투성이가 되어 웃었습니다. 열 번을 떨어지고 나서야 구름이 말을 들었습니다.",
            "우치는 어머니에게만 이 일을 이야기했습니다. 어머니는 오래 아무 말이 없다가 한마디 했습니다.<br>\"그 재주로 남 울리지 마라. 웃기는 것은 괜찮다.\"<br>우치는 그 말을 평생 기억했습니다."
        ]
    },
    {
        num: 2,
        emoji: "✨",
        title: "하늘에서 내려온 선관",
        art: ["story-02-a.webp", "story-02-b.webp", "story-02-c.webp"],
        artAt: ["구름 위에 선 사람은 온몸이 빛났습니다", "황금 들보가 대궐 마당에 놓였습니다", "마을마다 쌀가마니가 쌓였습니다"],
        paras: [
            "그해부터 세 해 내리 흉년이 들었습니다. 봄에는 가물고 여름에는 물난리가 났습니다. 논에 벼가 서지 못했습니다. 백성들은 나무껍질을 벗겨 먹고 풀뿌리를 캐 먹었습니다.",
            "우치는 땅 위의 일이 다 보이는 사람이었습니다. 어느 집에서 아이가 굶어 우는지, 어느 고을 곳간에 쌀이 썩어 가는지 다 알았습니다. 그런데 나라 곳간은 굳게 잠겨 있었습니다.",
            "우치는 이웃 마을에 가 보았습니다. 한 집에서 아이 셋이 소나무 껍질을 삶은 물을 마시고 있었습니다. 어머니는 제 몫을 아이들 그릇에 부어 주고 빈 그릇을 들고 있었습니다. 우치는 소매에 든 붓을 만졌다가 놓았습니다. 붓으로 그린 밥은 배를 채우지 못했습니다.",
            "벼슬아치들은 임금께 흉년을 제대로 아뢰지 않았습니다. 아뢰면 제 잘못이 될까 두려웠기 때문입니다. 임금은 대궐 안에서 백성이 그럭저럭 산다고만 알고 있었습니다.",
            "우치가 어머니에게 말했습니다.<br>\"어머니, 제가 임금님을 한 번 속여야겠습니다.\"<br>\"임금을 속이면 목이 달아난다.\"<br>\"속여서 백성이 살면 그 목은 아깝지 않습니다.\"",
            "정월 초하루 새벽이었습니다. 임금이 신하들과 함께 대궐 뜰에서 하늘에 제사를 올리고 있었습니다. 그때 동쪽 하늘에서 오색구름이 내려왔습니다. 풍악 소리가 구름 속에서 울렸습니다.",
            "구름 위에 선 사람은 온몸이 빛났습니다. 머리에는 금관을 쓰고 손에는 옥으로 만든 홀<span class=\"gloss\">(벼슬아치가 임금 앞에서 손에 쥐던 길쭉한 패)</span>을 들었습니다. 신하들이 놀라 땅에 엎드렸습니다. 임금도 무릎을 꿇었습니다.",
            "\"나는 옥황상제의 명을 받고 내려온 선관<span class=\"gloss\">(하늘나라의 벼슬아치)</span>이다. 옥황상제께서 하늘에 새 궁궐을 지으시는데 황금 들보 하나가 모자란다. 조선 임금은 황금 들보를 만들어 바치라.\"",
            "\"그 크기는 길이 열 자, 굵기 한 아름이다. 보름 뒤 오늘 이 자리로 가지러 오겠다.\"<br>선관은 그 말을 남기고 구름과 함께 하늘로 올라갔습니다. 풍악 소리가 멀어졌습니다.",
            "임금은 곧바로 온 나라의 금을 모으라 했습니다. 대궐 곳간의 금이 나오고 벼슬아치들이 감추어 둔 금이 나왔습니다. 대장장이 백 명이 밤낮으로 금을 녹였습니다.",
            "벼슬아치들은 금을 내놓으며 울상이었습니다. 어떤 이는 흉년에 백성한테서 거둔 금을 내놓았고, 어떤 이는 뇌물로 받은 금비녀를 내놓았습니다. 우치는 구름 위에서 그것을 다 보고 있었습니다.<br>\"저 금이 어디서 났는지 저들이 제일 잘 알겠지.\"",
            "보름 뒤 새벽, 황금 들보가 대궐 마당에 놓였습니다. 햇빛을 받아 온 마당이 노랬습니다. 오색구름이 다시 내려왔고, 선관이 들보를 구름에 실어 하늘로 올라갔습니다. 임금과 신하들은 다시 한 번 엎드렸습니다.",
            "구름은 하늘로 올라가는 척하다가 서쪽으로 방향을 틀었습니다. 구름 위에서 우치는 금관을 벗어 던졌습니다. 그것은 종이에 금물을 칠한 것이었습니다.",
            "우치는 황금 들보를 잘라 중국 상인들에게 팔았습니다. 그 돈으로 쌀을 샀습니다. 쌀은 배 열 척에 실려 조선으로 들어왔습니다.",
            "며칠 뒤 새벽, 흉년이 가장 심한 여덟 고을에 이상한 일이 벌어졌습니다. 마을마다 쌀가마니가 쌓였습니다. 집집이 문 앞에 쌀 한 가마니씩 놓여 있었습니다. 누가 가져다 놓았는지 본 사람은 없었습니다.",
            "가마니 위에는 종이 한 장씩이 붙어 있었습니다.<br>\"이 쌀은 임금님의 황금 들보를 팔아 산 것이다. 하늘의 선관은 없다. 전우치가 한 일이다. 배부르게 먹고 봄에 씨를 뿌려라.\"",
            "온 나라가 발칵 뒤집혔습니다. 백성들은 밥을 지으며 웃었고 대궐에서는 임금이 상을 내리쳤습니다.<br>\"전우치가 누구냐. 당장 잡아들여라!\"",
            "그런데 종이에 한 줄이 더 있었습니다.<br>\"임금님, 벼슬아치들이 흉년을 아뢰지 않았습니다. 곳간을 여십시오. 그러면 저는 다시 나타나지 않겠습니다.\"",
            "임금은 그 줄을 읽고 오래 말이 없었습니다. 그러고는 신하들을 돌아보았습니다. 신하들은 아무도 고개를 들지 못했습니다. 그날 나라 곳간이 열렸습니다. 그러나 전우치를 잡으라는 명은 거두지 않았습니다."
        ]
    },
    {
        num: 3,
        emoji: "🖼️",
        title: "그림 속으로",
        art: ["story-03-a.webp", "story-03-b.webp", "story-03-c.webp"],
        artAt: ["족자 속 나귀가 눈을 껌벅였습니다", "관군들은 병 하나를 붙들고 서 있었습니다", "우치는 밥상을 받은 채로 이야기했습니다"],
        paras: [
            "전우치를 잡으라는 방이 온 나라에 붙었습니다. 상금이 천 냥이었습니다. 우치는 그 방 앞에서 태연히 방을 읽었습니다. 아무도 그가 전우치인 줄 몰랐습니다. 우치는 얼굴을 바꾸는 재주가 있었습니다.",
            "그러나 어머니는 걱정이었습니다.<br>\"너 때문에 내가 편히 잠을 못 잔다.\"<br>우치는 어머니를 먼 산골 외가로 모셔다 놓았습니다. 그러고는 다시 한양으로 돌아왔습니다. 아직 할 일이 남아 있었습니다.",
            "한양의 포도대장<span class=\"gloss\">(도둑을 잡는 벼슬아치의 우두머리)</span>은 이름난 사람이었습니다. 그는 전우치가 송도 사람이라는 것을 알아냈고, 송도 사람들을 하나하나 뒤졌습니다. 마침내 우치가 묵는 주막을 알아냈습니다.",
            "관군 오십 명이 주막을 에워쌌습니다. 포도대장이 문을 박차고 들어갔습니다. 방 안에는 젊은이 하나가 벽에 걸린 족자<span class=\"gloss\">(벽에 거는 두루마리 그림)</span>를 보고 앉아 있었습니다. 족자에는 나귀 한 마리가 그려져 있었습니다.",
            "\"네가 전우치냐.\"<br>\"그렇소. 잘 오셨소. 마침 떠나려던 참이오.\"<br>우치가 족자를 향해 손을 뻗었습니다. 족자 속 나귀가 눈을 껌벅였습니다.",
            "우치는 그림 속으로 걸어 들어갔습니다. 발이 종이 속으로 들어가고 몸이 들어가고 머리가 들어갔습니다. 그림 속 우치가 나귀에 올라탔습니다. 나귀가 그림 안쪽으로 걸어가더니 점점 작아지다가 사라졌습니다.",
            "포도대장이 족자를 뜯어 발로 밟고 칼로 그었습니다. 종이만 찢어졌습니다. 관군들은 빈 방에서 서로 얼굴만 쳐다보았습니다.",
            "그런데 주막 뒷마당에 나귀 발자국이 나 있었습니다. 관군들이 발자국을 따라갔습니다. 발자국은 골목을 돌고 개천을 건너 성벽 앞에서 끝났습니다. 성벽에는 나귀 한 마리가 그려져 있었습니다. 먹이 아직 마르지 않았습니다.",
            "그날 저녁 포도대장이 씩씩거리며 집에 돌아왔습니다. 마루에 웬 나귀 한 마리가 매어 있었습니다. 나귀 등에 종이가 붙어 있었습니다.<br>\"오늘 고생하셨소. 다음에는 좀 더 일찍 오시오. 전우치.\"",
            "포도대장은 이를 갈았습니다. 이번에는 도사를 데려왔습니다. 도술에는 도술로 맞서겠다는 것이었습니다. 도사는 부적을 붙이고 주문을 외워 우치가 있는 곳을 알아냈습니다. 남산 아래 작은 집이었습니다.",
            "관군이 집을 덮쳤습니다. 우치는 마루에 앉아 병에 술을 따르고 있었습니다.<br>\"또 오셨구려. 이번에는 도사까지 모셔 왔소? 그럼 내가 이 병에 들어가 숨을 테니 잡아 보시오.\"",
            "우치가 병 속으로 쏙 들어갔습니다. 도사가 얼른 병마개를 막았습니다.<br>\"잡았다!\"<br>관군들이 환호했습니다. 포도대장이 병을 안고 대궐로 달려갔습니다.",
            "임금 앞에서 병마개를 열었습니다. 병에서 나온 것은 파리 한 마리였습니다. 파리는 임금의 코끝에 한 번 앉았다가 멀리 날아갔습니다. 마당에서 관군들은 병 하나를 붙들고 서 있었습니다. 그 병에서 웃음소리가 났습니다.",
            "임금이 화를 내다 말고 물었습니다.<br>\"전우치가 나를 해치려 한 적이 있느냐.\"<br>포도대장은 대답하지 못했습니다. 없었습니다. 우치는 늘 놀리기만 했지 다치게 한 사람이 없었습니다.",
            "\"그럼 그자가 훔쳐간 재물은 있느냐.\"<br>\"황금 들보뿐입니다. 그것도 쌀이 되어 백성한테 갔습니다.\"<br>임금은 턱을 괴었습니다. 포도대장은 그 뒤로 전우치를 잡으러 다닐 때 예전만큼 열을 내지 않았습니다.",
            "며칠 뒤 임금이 혼자 밤에 글을 읽고 있는데 창밖에서 누가 불렀습니다.<br>\"임금님, 전우치입니다. 이야기 하나 해 드리러 왔습니다.\"",
            "임금은 소리를 지르려다 참았습니다.<br>\"들어와서 해라.\"<br>우치가 들어와 절을 했습니다. 임금이 밥상을 내오게 했습니다. 우치는 밥상을 받은 채로 이야기했습니다.",
            "\"경상도 어느 고을에 원님이 있는데, 백성한테 세금을 두 번 걷어 한 번은 나라에 보내고 한 번은 제가 먹습니다. 전라도 어느 고을에는 남의 논을 빼앗고 주인을 도둑으로 몰아 옥에 넣은 양반이 있습니다.\"",
            "우치는 이름을 하나하나 댔습니다. 임금은 붓을 들어 받아 적었습니다. 다 적고 나서 임금이 물었습니다.<br>\"이런 것을 왜 나한테 직접 아뢰지 않고 도술을 부렸느냐.\"<br>\"아뢰어도 임금님께 닿지 않으니까요. 오늘은 닿았습니다.\"",
            "우치가 일어서며 말했습니다.<br>\"저를 잡으라는 명은 거두지 마십시오. 그래야 벼슬아치들이 저를 무서워합니다.\"<br>임금은 웃어야 할지 화를 내야 할지 몰랐습니다."
        ]
    },
    {
        num: 4,
        emoji: "⚖️",
        title: "억울한 사람들",
        art: ["story-04-a.webp", "story-04-b.webp", "story-04-c.webp"],
        artAt: ["옥문이 저절로 열렸습니다", "원님의 머리 위에 돼지 귀가 돋아 있었습니다", "노인은 논문서를 품에 안고 울었습니다"],
        paras: [
            "우치는 그 뒤로 몇 해를 떠돌았습니다. 한곳에 오래 머물지 않았습니다. 가는 곳마다 억울한 사람이 있었고, 우치는 그것이 다 보였습니다.",
            "전라도 어느 고을에 논 서 마지기를 빼앗긴 노인이 있었습니다. 고을 양반이 논문서를 가짜로 만들어 제 것이라 우겼고, 노인이 따지자 도리어 도둑으로 몰아 옥에 넣었습니다. 노인의 손자가 날마다 옥 앞에서 울었습니다.",
            "우치는 나그네 차림으로 그 고을에 들어갔습니다. 밤에 옥 앞으로 가서 손자에게 말했습니다.<br>\"울지 마라. 할아버지는 내일 나오신다.\"<br>\"누구세요.\"<br>\"지나가는 사람이다.\"",
            "이튿날 아침 옥문이 저절로 열렸습니다. 자물쇠가 풀린 것이 아니라 문짝이 통째로 없어졌습니다. 옥지기가 아무리 찾아도 문짝은 나오지 않았습니다. 노인은 손자의 손을 잡고 집으로 걸어갔습니다.",
            "문짝은 사흘 뒤에 나왔습니다. 원님 안방 천장에 딱 붙어 있었습니다. 원님이 아침에 눈을 뜨자 머리 위에 옥문 창살이 보였습니다. 원님은 그것을 떼어 내느라 하루를 다 썼습니다.",
            "원님이 노발대발하여 노인을 다시 잡아 오라 했습니다. 그런데 관군이 노인의 집에 가 보니 집 둘레에 물이 차 있었습니다. 집 한 채가 호수 한가운데 섬처럼 떠 있었습니다. 배도 없었습니다.",
            "그날 저녁 원님이 밥상을 받았습니다. 밥그릇 뚜껑을 여니 밥 대신 종이가 들어 있었습니다.<br>\"논문서 진짜는 양반 집 다락 셋째 궤짝에 있소. 내일 아침까지 노인에게 돌려주지 않으면 원님 얼굴이 좀 달라질 것이오.\"",
            "원님은 종이를 구겨 던졌습니다. 이튿날 아침 원님이 세수를 하다가 물에 비친 제 얼굴을 보고 소리를 질렀습니다. 원님의 머리 위에 돼지 귀가 돋아 있었습니다. 분홍빛 큼직한 귀가 팔랑거렸습니다.",
            "갓을 눌러써도 귀가 삐죽 나왔습니다. 관아 사람들이 웃음을 참느라 얼굴이 벌게졌습니다. 원님은 그날 안으로 양반 집 다락을 뒤지게 했습니다. 셋째 궤짝에서 진짜 논문서가 나왔습니다.",
            "노인은 논문서를 품에 안고 울었습니다. 논문서를 돌려준 저녁, 원님의 귀는 도로 사람 귀가 되었습니다. 원님은 그 뒤로 밥상을 받을 때마다 뚜껑을 열기 전에 한숨을 쉬었습니다.",
            "충청도 어느 고을에는 세금을 두 번 걷는 원님이 있었습니다. 우치는 그 고을 창고에 들어가 세금으로 걷은 쌀가마니에 붓으로 글자를 하나씩 썼습니다. 이튿날 원님이 쌀을 팔러 장에 내갔는데 가마니마다 글자가 떠올랐습니다.<br>\"도둑 쌀.\"",
            "원님이 소리쳤습니다.<br>\"누가 이런 짓을 했느냐! 당장 가마니를 뒤집어라!\"<br>하인들이 가마니를 뒤집었습니다. 뒤집은 쪽에도 같은 글자가 떠올랐습니다. 장에 모인 사람들 사이에서 누가 킥킥 웃기 시작했고, 웃음은 장터 끝까지 번졌습니다.",
            "지우려 해도 지워지지 않았습니다. 장에 온 사람들이 다 보았습니다. 원님은 쌀을 도로 창고에 넣었고, 그 소문은 한양까지 올라갔습니다. 임금이 받아 적어 두었던 이름 가운데 하나였습니다. 그 원님은 벼슬을 잃었습니다.",
            "그런데 우치가 늘 옳기만 한 것은 아니었습니다. 어느 고을에서 우치는 부잣집 곳간을 열어 마을 사람들에게 나누어 주었습니다. 그런데 그 부자는 제 손으로 농사지어 모은 사람이었고, 흉년에 이미 곡식을 풀었던 사람이었습니다.",
            "우치는 뒤늦게 그것을 알았습니다. 땅 위의 일은 다 보였지만 사람의 마음속까지 보이는 것은 아니었습니다. 우치는 밤에 그 부자를 찾아가 사과하고 곳간을 도로 채워 놓았습니다. 부자는 아무 말 없이 우치에게 술 한 잔을 따라 주었습니다.",
            "\"자네 재주는 좋네. 그런데 자네는 보이는 것만 믿는군.\"<br>우치는 그 말이 오래 남았습니다. 산에서 만난 노인이 한 말과 같은 말이었습니다. 재주지 도가 아니다.",
            "떠돌아다니는 동안 우치는 이름난 사람들을 많이 만났습니다. 그런데 어디를 가나 한 사람 이야기를 들었습니다. 송도에 사는 서화담이라는 선비였습니다. 벼슬도 없이 초가에 살면서 도가 깊기로 온 나라에 이름이 났다고 했습니다.",
            "우치는 코웃음을 쳤습니다.<br>\"도가 깊다니. 구름은 탈 줄 아는가.\"<br>우치는 송도로 발길을 돌렸습니다. 제 고향이기도 했습니다. 어머니가 보고 싶기도 했습니다."
        ]
    },
    {
        num: 5,
        emoji: "🍵",
        title: "서화담",
        art: ["story-05-a.webp", "story-05-b.webp", "story-05-c.webp"],
        artAt: ["초가 마루에 늙은 선비가 앉아 있었습니다", "우치의 호랑이가 서화담 앞에서 강아지가 되었습니다", "우치는 처음으로 무릎을 꿇었습니다"],
        paras: [
            "송도 화담 골짜기에 서경덕이라는 선비가 살았습니다. 사람들은 골짜기 이름을 따서 서화담이라 불렀습니다. 벼슬을 마다하고 평생 글을 읽고 제자를 가르치며 살았습니다. 이것은 지어낸 사람이 아니라 실제로 살았던 사람입니다.",
            "우치는 화담 골짜기로 들어갔습니다. 초가 마루에 늙은 선비가 앉아 있었습니다. 베옷을 입고 책을 읽고 있었는데, 우치가 문 앞에 서자 고개도 들지 않고 말했습니다.<br>\"전우치가 왔구나.\"",
            "우치는 흠칫했습니다. 얼굴을 바꾸고 왔기 때문입니다.<br>\"어떻게 아셨습니까.\"<br>\"자네 얼굴이 아니라 자네를 보았네.\"",
            "우치는 마루에 올라앉았습니다.<br>\"선생의 도가 깊다기에 뵈러 왔습니다.\"<br>\"도는 깊고 얕은 것이 없네. 있고 없는 것이지.\"<br>우치는 그 말이 무슨 뜻인지 몰랐습니다.",
            "서화담이 차를 내왔습니다. 김이 오르는 찻잔을 우치 앞에 놓고 아무 말이 없었습니다. 우치는 뜨거워서 마시지 못하고 기다렸습니다. 마당 저쪽에서 제자 몇이 책을 읽다가 힐끔힐끔 이쪽을 보았습니다. 차가 식을 때까지 서화담은 책만 읽었습니다.",
            "우치가 시험을 해 보기로 했습니다. 마루 앞 감나무를 가리키자 감나무가 꽃을 피우고 열매를 맺고 감이 붉게 익어 뚝뚝 떨어졌습니다. 봄에 가을을 만든 것입니다.<br>\"어떻습니까.\"",
            "서화담은 떨어진 감 하나를 집어 들었습니다.<br>\"먹어 보게.\"<br>우치가 한 입 베어 물었습니다. 맛이 없었습니다. 그림처럼 생겼을 뿐 감이 아니었습니다.",
            "\"자네 감은 보이기만 하네. 진짜 감은 비를 맞고 볕을 쬐고 서리를 견뎌야 단맛이 드네. 자네는 그 시간을 건너뛰었지. 건너뛴 것에는 맛이 없네.\"",
            "우치는 오기가 났습니다. 이번에는 붓으로 호랑이를 그렸습니다. 호랑이가 종이에서 뛰어나와 마당에 섰습니다. 집채만 한 호랑이가 서화담을 향해 으르렁거렸습니다.",
            "서화담은 책장을 넘겼습니다. 호랑이가 한 걸음씩 다가올 때마다 그 몸이 점점 줄어들었습니다. 마루 앞에 이르렀을 때 우치의 호랑이가 서화담 앞에서 강아지가 되었습니다. 강아지는 꼬리를 흔들며 서화담의 발등을 핥았습니다.",
            "우치는 얼굴이 뜨거워졌습니다. 이번에는 몸을 날려 구름을 탔습니다. 하늘 높이 올라가 내려다보니 초가는 손톱만 했습니다.<br>\"선생, 여기까지 올라오실 수 있습니까.\"",
            "대답이 바로 옆에서 들렸습니다.<br>\"자네 옆에 있네.\"<br>돌아보니 서화담이 마루에 앉은 그대로 구름 옆에 앉아 있었습니다. 책을 든 채였습니다. 우치는 놀라 구름에서 떨어질 뻔했습니다.",
            "\"어떻게 올라오셨습니까.\"<br>\"올라온 적 없네. 자네가 내려온 적도 없고. 자네는 지금 내 마루에 앉아 있네.\"<br>우치가 눈을 깜박이자 정말로 마루에 앉아 있었습니다. 구름은 처음부터 없었습니다.",
            "우치는 등에서 식은땀이 났습니다. 태어나서 처음으로 저보다 높은 재주를 보았습니다. 아니, 그것은 재주가 아니었습니다. 우치가 하는 것은 남의 눈을 속이는 것이었고, 서화담이 한 것은 우치의 눈을 뜨게 한 것이었습니다.",
            "마당의 제자들은 아무것도 보지 못했습니다. 감나무는 그대로였고 호랑이도 구름도 없었습니다. 그들 눈에는 젊은 나그네가 마루에 앉아 혼자 얼굴이 붉어졌다 하얘졌다 한 것뿐이었습니다. 우치는 그것을 알고 더 부끄러워졌습니다.",
            "\"선생, 저는 그동안 무엇을 한 것입니까.\"<br>\"착한 장난을 했네. 굶는 사람을 먹였고 억울한 사람을 풀어 주었지. 그것은 좋은 일이네.\"",
            "\"그런데 자네는 늘 남을 놀렸지. 놀림을 당한 사람은 고쳐지지 않네. 창피를 당한 사람은 자네를 미워할 뿐이네. 원님 귀에 돼지 귀를 붙였다지. 그 원님이 자네 덕에 착해졌는가.\"",
            "우치는 대답하지 못했습니다. 그 원님은 논문서를 돌려주었지만, 그 뒤로 다른 사람을 괴롭히지 않았다는 이야기는 듣지 못했습니다.",
            "\"세상을 고치고 싶으면 먼저 자네를 고치게. 자네는 아직 자네를 모르네. 여우 구슬을 삼키고 땅부터 보았다지. 그래서 땅의 일은 다 보이는데 정작 제 속은 안 보이는 걸세.\"",
            "우치는 처음으로 무릎을 꿇었습니다. 임금 앞에서도 꿇지 않은 무릎이었습니다.<br>\"저를 제자로 받아 주십시오.\"<br>서화담이 책을 덮었습니다.<br>\"내일 새벽에 오게. 붓은 두고 오게.\""
        ]
    },
    {
        num: 6,
        emoji: "⛰️",
        title: "산으로",
        art: ["story-06-a.webp", "story-06-b.webp", "story-06-c.webp"],
        artAt: ["붓을 감나무 아래 묻었습니다", "임금이 내민 벼슬 첩지를 우치는 받지 않았습니다", "두 사람은 안개 속으로 걸어 들어갔습니다"],
        paras: [
            "이튿날 새벽 우치는 화담 골짜기로 갔습니다. 가기 전에 붓을 감나무 아래 묻었습니다. 산에서 만난 노인이 준 붓이었습니다. 그것 없이는 그림을 진짜로 만들 수 없었습니다. 우치는 흙을 덮으며 손이 떨렸습니다.",
            "서화담은 우치에게 도술을 가르치지 않았습니다. 새벽에 물을 긷게 하고 낮에 책을 읽게 하고 저녁에 마당을 쓸게 했습니다. 우치가 물었습니다.<br>\"선생, 저는 언제 도를 배웁니까.\"<br>\"지금 배우고 있네.\"",
            "우치는 답답했습니다. 물 한 동이 긷는 데 반나절이 걸렸습니다. 예전에는 손짓 한 번이면 우물물이 저절로 항아리에 들어왔습니다. 우치는 몇 번이나 붓을 묻은 자리를 돌아보았습니다.",
            "한번은 참지 못하고 우물을 향해 손짓을 해 보았습니다. 물은 꿈쩍도 하지 않았습니다. 붓이 없으니 구슬의 재주도 반은 죽은 것이었습니다. 우치는 두레박을 도로 집어 들었습니다. 손바닥에 물집이 잡혔다가 굳은살이 되었습니다.",
            "석 달이 지난 어느 날, 물을 긷던 우치가 우물에 비친 제 얼굴을 보았습니다. 여우 구슬을 삼킨 뒤로 처음이었습니다. 그동안은 남의 얼굴로만 살았습니다. 우치는 한참 동안 제 얼굴을 들여다보았습니다.",
            "그날 저녁 서화담이 말했습니다.<br>\"오늘 자네 얼굴을 보았지?\"<br>\"예.\"<br>\"이제 시작이네.\"",
            "한 해가 지났습니다. 그 사이 임금이 사람을 보내왔습니다. 우치가 화담 골짜기에 있다는 소문이 대궐까지 간 것입니다. 임금의 사신이 임금이 내린 벼슬 첩지<span class=\"gloss\">(벼슬을 내린다는 임금의 문서)</span>를 들고 왔습니다.",
            "\"임금님께서 전우치의 죄를 다 용서하시고, 벼슬을 내리셨다. 대궐에 들어와 임금님 곁에서 나랏일을 도우라 하신다.\"<br>임금은 우치가 적어 준 이름들을 하나하나 조사하여 벼슬을 뗀 뒤였습니다. 그 뒤로 임금은 우치를 미워하지 않게 되었습니다.",
            "우치는 오래 생각했습니다. 벼슬을 하면 도술 없이도 억울한 사람을 도울 수 있었습니다. 임금 곁에서 아뢰면 되었습니다. 그것은 어릴 적부터 바라던 일이기도 했습니다.",
            "그러나 임금이 내민 벼슬 첩지를 우치는 받지 않았습니다.<br>\"임금님께 전해 주십시오. 전우치는 아직 제 속도 못 보는 사람이라 남의 일을 볼 자격이 없다고요. 다 보게 되면 그때 찾아뵙겠다고요.\"",
            "사신이 돌아간 뒤 서화담이 물었습니다.<br>\"아깝지 않은가?\"<br>\"아깝습니다.\"<br>\"아까운 줄 알면서 놓았으니 되었네.\"",
            "그 뒤로 몇 해가 더 흘렀습니다. 우치의 어머니가 세상을 떠났습니다. 우치는 어머니를 고향 뒷산에 모셨습니다. 어릴 적 노인을 만났던 바위가 보이는 자리였습니다.",
            "돌아가시기 한 해 전, 어머니가 화담 골짜기를 찾아온 적이 있었습니다. 아들이 물지게를 지고 오는 것을 보고 어머니는 한참 서 있었습니다.<br>\"구름 타던 애가 물을 긷네.\"<br>\"구름보다 이게 낫습니다.\"<br>어머니는 그 말에 고개를 끄덕이고 돌아갔습니다.",
            "어머니가 남긴 말은 하나였습니다.<br>\"웃기는 것은 괜찮다.\"<br>우치는 무덤 앞에서 오래 앉아 있다가 웃었습니다. 어머니는 처음부터 알고 있었던 것입니다. 우치가 남을 울리지는 않을 사람이라는 것을.",
            "어느 봄날 서화담이 우치를 불렀습니다.<br>\"나는 이제 산으로 들어가려 하네. 자네는 어쩌겠는가.\"<br>\"따라가겠습니다!\"<br>\"산에는 억울한 사람이 없네. 자네가 할 일이 없을 텐데.\"<br>\"제가 할 일이 하나 남았습니다. 저를 보는 일입니다.\"",
            "두 사람은 안개 속으로 걸어 들어갔습니다. 화담 골짜기 위쪽으로 난 산길이었습니다. 우치는 감나무 아래 묻은 붓을 파내지 않았습니다. 뒤도 돌아보지 않았습니다.",
            "그 뒤로 전우치를 본 사람은 없습니다. 다만 이런 이야기가 남았습니다. 어느 흉년에 산골 마을에 쌀가마니가 놓여 있었는데 종이 한 장 붙어 있지 않았다는 것입니다. 사람들은 그것을 누가 한 일인지 알 것 같았습니다.",
            "송도 화담 골짜기 감나무는 지금도 봄에 꽃을 피우고 가을에 열매를 맺습니다. 그 아래 붓이 묻혀 있다는 이야기를 아는 사람은 이제 없습니다. 감은 비를 맞고 볕을 쬐고 서리를 견뎌야 맛이 답니다."
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
    emoji: '🦊',
    title: '전우치전',
    intro: [
        "전우치전은 지은이가 알려지지 않은 조선 후기 소설이에요. 홍길동전과 나란히 놓이는 도술 소설인데, 주인공 전우치는 실제로 중종 임금 때 살았던 사람이랍니다.",
        "여우 구슬을 삼켜 도술을 얻은 젊은이가 온 나라를 떠도는 이야기예요. 그림 속으로 걸어 들어가는 대목이 가장 이름났지요.",
        "도술로 못 할 일이 없어 보이는 전우치는 이 책의 끝에서 어떤 길을 고를까요?",
        "황금 들보, 족자 속 나귀, 서화담은 시험에 자주 나오는 이름이에요. 홍길동과 무엇이 같고 무엇이 다른지 견주어 보세요."
    ]
};

/* ── 그리기 ───────────────────────────────────────── */

function artFrame(src, emoji) {
    return `
        <div class="art-frame">
            <img src="images/${src}?v=20260918" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
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
    { q: "우치는 여우 구슬을 어떻게 삼키게 되었습니까?", choices: ["훈장이 여우를 잡아 구슬을 꺼내 주었다", "여우가 잠든 사이 입에서 꺼내 삼켰다", "처녀가 입에 넣어 주자 꿀꺽 삼켰다"], answer: 2 },
    { q: "구슬을 삼킨 뒤 우치가 먼저 본 것은 무엇입니까?", choices: ["하늘", "땅", "물"], answer: 1 },
    { q: "우치가 선관으로 꾸미고 내려왔을 때 임금은 무엇을 하고 있었습니까?", choices: ["대궐 뜰에서 하늘에 제사를 올리고 있었다", "신하들과 흉년 걱정을 의논하고 있었다", "혼자 밤에 글을 읽고 있었다"], answer: 0 },
    { q: "황금 들보를 판 돈으로 우치는 무엇을 했습니까?", choices: ["굶는 고을의 세금을 대신 내 주었다", "쌀을 사서 여덟 고을에 나누었다", "어머니를 위해 송도에 집을 지었다"], answer: 1 },
    { q: "포도대장이 주막을 덮쳤을 때 우치는 어디로 사라졌습니까?", choices: ["족자 속 그림으로", "지붕 위 구름으로", "마루 밑 땅속으로"], answer: 0 },
    { q: "병 속에 들어간 우치를 임금 앞에서 열었더니 무엇이 나왔습니까?", choices: ["파리 한 마리", "연기 한 줄기", "참새 한 마리"], answer: 0 },
    { q: "우치가 밤에 임금을 찾아가 한 일은 무엇입니까?", choices: ["저를 잡으라는 명을 거두어 달라고 청했다", "나쁜 벼슬아치 이름을 일러 주었다", "벼슬을 내려 달라고 청했다"], answer: 1 },
    { q: "논문서를 돌려주지 않은 원님에게 생긴 일은 무엇입니까?", choices: ["머리에 돼지 귀가 돋았다", "관아가 물에 잠겨 섬이 되었다", "밥상이 통째로 사라졌다"], answer: 0 },
    { q: "우치가 어느 집 곳간을 열어 나누어 주고 나서 뉘우친 까닭은 무엇입니까?", choices: ["그 집 주인이 흉년에 이미 곡식을 풀었던 사람이어서", "관군에게 들켜 밤새 쫓기게 되어서", "마을 사람들이 나눈 곡식을 도로 갖다 바쳐서"], answer: 0 },
    { q: "우치가 만든 감을 두고 서화담은 무어라 했습니까?", choices: ["보이기만 하고 맛이 없다", "꿀보다 달고 향이 좋다", "덜 익어 떫기만 하다"], answer: 0 },
    { q: "우치가 그린 호랑이는 서화담 앞에서 무엇이 되었습니까?", choices: ["강아지", "고양이", "종이"], answer: 0 },
    { q: "임금이 보낸 벼슬을 우치는 어떻게 했습니까?", choices: ["받아서 대궐로 갔다", "받지 않고 산으로 갔다", "받되 화담 골짜기에 그대로 머물렀다"], answer: 1 },
    {
        q: "이 책을 읽고 난 반응으로 알맞지 않은 것은 무엇인가요?",
        wide: true,
        choices: [
            "우치가 제 이름을 적은 종이를 일부러 남긴 것을 보면, 임금이 곳간을 열게 하려고 일부러 들킨 거였어.",
            "서화담이 놀림당한 사람은 고쳐지지 않는다고 한 것을 보면, 원님 골탕 먹인 이야기는 통쾌하기만 한 게 아니었네.",
            "우치가 붓을 묻고 물을 긷는 것을 보면, 서화담은 재주보다 시간을 견디는 법을 가르쳤구나.",
            "우치가 마지막에 벼슬을 받고 대궐에 들어간 것을 보면, 결국 도술보다 벼슬이 백성을 돕는 길이었나 봐."
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
    emoji: '🦊',
    art: ['end.webp'],
    paras: [
        `이 이야기는 지은이가 없습니다. 조선 후기에 한글로 적혀 널리 읽혔고, 남아 있는 책마다 내용이 조금씩 다릅니다. 이 책은 그 가운데 널리 알려진 줄거리를 골라 엮은 것입니다.`,
        `전우치는 지어낸 사람이 아닙니다. 중종 임금 때 실제로 살았던 사람으로, 글을 잘 지었고 도술을 부린다는 소문이 있었으며, 나라에서 잡아 가두었다는 기록이 남아 있습니다. 옥에서 죽었다고도 하고, 죽은 뒤에 관을 열어 보니 비어 있었다고도 합니다.`,
        `서화담도 실제 사람입니다. 이름은 서경덕이고, 송도 화담 골짜기에 살아 서화담이라 불렸습니다. 벼슬을 마다하고 평생 글을 읽었으며 조선에서 손꼽히는 학자였습니다. 황진이가 스승으로 모셨다는 이야기로도 이름납니다.`,
        `그러니 이 소설은 실제로 있던 두 사람을 데려다 만나게 한 것입니다. 실제로 두 사람이 만났는지는 알 수 없습니다. 그러나 사람들은 도술 부리는 전우치가 도 깊은 서화담에게 지는 이야기를 만들어 냈습니다. 거기에 이 소설이 하고 싶은 말이 있습니다.`,
        `전우치전은 흔히 홍길동전과 나란히 놓입니다. 둘 다 도술을 부리고, 둘 다 나쁜 벼슬아치를 혼내고, 둘 다 백성 편에 섭니다. 그러나 끝이 다릅니다. 홍길동은 율도국의 임금이 됩니다. 전우치는 산으로 들어갑니다.`,
        `홍길동은 세상을 바꾸려 했고, 세상 밖에 새 나라를 만들었습니다. 전우치는 세상을 고치려다가 먼저 저를 고쳐야 한다는 것을 알았습니다. 어느 쪽이 옳은지는 정해져 있지 않습니다. 다만 두 이야기가 같은 물음에 다른 답을 낸 것입니다.`,
        `여우 구슬을 삼키고 땅부터 보았다는 대목을 다시 보십시오. 그래서 우치는 땅 위의 일은 다 보이는데 하늘의 일은 모릅니다. 서화담은 그것을 「제 속을 못 본다」는 말로 바꾸어 말합니다. 밖은 다 보이고 안은 안 보이는 사람, 그것이 전우치입니다.`,
        `황금 들보 이야기는 이 소설에서 가장 이름난 대목입니다. 임금을 속인 것이지만 그 돈이 굶는 사람에게 갔습니다. 그리고 우치는 제 이름을 밝힙니다. 몰래 하지 않고 「전우치가 한 일이다」라고 씁니다. 그것은 임금에게 곳간을 열라고 하는 말이기도 했습니다.`,
        `그림 속으로 걸어 들어가는 대목도 눈여겨보십시오. 이 소설의 도술은 대개 「눈속임」입니다. 감은 보이기만 하고 맛이 없습니다. 호랑이는 종이에서 나왔습니다. 서화담이 한 일은 그것과 다릅니다. 서화담은 아무것도 만들지 않고 우치가 보는 것을 바꾸었습니다.`,
        `이 책에서는 우치가 부잣집 곳간을 잘못 연 대목을 넣었습니다. 남아 있는 책들에는 없는 것도 있고 비슷한 것이 있는 것도 있습니다. 우치가 늘 옳지는 않았다는 것을 보여 주려고 넣었습니다. 보이는 것만 믿는 사람은 잘못 볼 때가 있습니다.`,
        `원님 머리에 돼지 귀를 붙인 대목은 읽으면 통쾌합니다. 그런데 서화담은 그것을 두고 묻습니다. 그 원님이 착해졌는가. 놀림은 재미있지만 사람을 고치지는 못한다는 말입니다. 통쾌한 것과 옳은 것이 늘 같지는 않습니다.`,
        `우치가 붓을 묻고 물을 긷는 대목은 이 소설의 끝을 미리 보여 줍니다. 서화담은 도술을 가르치지 않습니다. 시간을 건너뛰지 않는 법을 가르칩니다. 감이 달려면 비와 볕과 서리가 있어야 합니다.`,
        `우치는 마지막에 벼슬을 마다합니다. 벼슬을 하면 도술 없이도 억울한 사람을 도울 수 있었습니다. 그런데도 받지 않은 까닭을 우치는 「아직 제 속도 못 본다」고 말합니다. 아깝다고 하면서 놓았습니다. 여러분이라면 어떻게 했겠습니까.`,
        `실제 전우치는 나라에서 잡혀 죽었습니다. 소설은 그를 산으로 보냅니다. 박씨전이 진 싸움을 이기게 쓴 것처럼, 전우치전은 죽은 사람을 살려 산으로 보낸 것입니다. 옛사람들이 왜 그렇게 썼을지 생각해 보십시오.`,
        `홍길동과 전우치 가운데 누구의 길이 더 옳다고 생각합니까. 세상을 바꾸러 나가는 것과 저를 먼저 고치러 들어가는 것, 둘 다 답이 될 수 있습니다. 여러분의 답을 말해 보십시오.`
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
