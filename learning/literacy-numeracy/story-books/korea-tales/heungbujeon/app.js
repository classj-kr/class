const BOOK_TITLE = "흥부전";

const CHAPTER_LABEL = n => (LANG === 'en' ? `Chapter ${n} · ` : `${n}장 · `);

const CHAPTERS = [
    {
        num: 1,
        title: "쫓겨난 아우",
        art: ["story-01-a.webp", "story-01-b.webp", "story-01-c.webp"],
        artAt: ["오늘부터 나가 살아라", "흥부가 무릎을 꿇었습니다", "이쪽도 한 번만 때려 주십시오"],
        paras: [
            "옛날 전라도 어느 고을에 형제가 살았습니다. 형은 놀부요 아우는 흥부였습니다. 집안은 논밭이 제법 되어 먹고살 걱정은 없었습니다.",
            "한배에서 났는데도 두 사람은 물과 불처럼 달랐습니다. 흥부는 마음이 여려서 남의 일에 먼저 소매를 걷었고, 놀부는 제 것 아니면 눈길도 주지 않았습니다. 한 사람은 주려고 태어났고 한 사람은 받으려고 태어난 듯했습니다.",
            "놀부의 심술은 온 고을이 다 알았습니다. 남의 논에 물꼬를 트고, 잘 자란 호박에 말뚝을 박고, 애호박에 침을 놓고, 초상난 집에 가서 춤을 추었습니다. 심술을 부리지 않으면 밥이 넘어가지 않는 사람이었습니다. 그러고도 부끄러운 줄을 몰랐습니다. 동네 아이들도 놀부가 지나가면 골목으로 숨었습니다.",
            "아버지가 세상을 떠나던 날, 두 형제를 머리맡에 불러 앉히고 말했습니다.<br>\"재산은 둘이 똑같이 나누어라. 그리고 서로 등지지 마라.\" 숨이 가빠 말이 자꾸 끊겼습니다.",
            "그러나 아버지가 눈을 감자마자 놀부는 그 말을 잊었습니다. 아니, 잊은 척했습니다. 곳간 열쇠부터 제 허리춤에 찼습니다.",
            "삼우제<span class=\"gloss\">(장사 지낸 뒤 세 번째 날에 지내는 제사)</span>가 끝난 날 저녁, 놀부가 흥부를 마당으로 불러냈습니다.<br>\"오늘부터 나가 살아라.\" 목소리에 미안한 기색이라고는 없었습니다. 삼우제 상도 아직 물리기 전이었습니다.",
            "흥부가 어리둥절해했습니다.<br>\"형님, 그게 무슨 말씀입니까.\"<br>\"장자<span class=\"gloss\">(맏아들)</span>가 집을 잇는 것이 법도<span class=\"gloss\">(정해진 규칙)</span>다. 너는 나가서 네 살림을 차려라.\" 흥부는 제 귀를 의심했습니다.",
            "\"아버님께서는 똑같이 나누라 하셨습니다.\"<br>\"죽은 사람 말을 누가 들었느냐. 나는 못 들었다.\" 흥부는 더 조르지 못했습니다.",
            "흥부는 그날 밤으로 아내와 아이들을 데리고 집을 나왔습니다. 손에 든 것이라고는 헌 옷가지 한 보따리뿐이었습니다. 막내는 아직 걸음마도 떼지 못한 나이였습니다.",
            "형수는 문간까지도 나오지 않았습니다. 담 안에서 이런 소리만 들려왔습니다.<br>\"저것들 먹일 쌀이 아까웠지.\" 그 말이 담을 넘어 골목까지 들렸습니다.",
            "흥부네 식구는 마을에서 한참 떨어진 산자락에 자리를 잡았습니다. 수숫대를 얽고 흙을 발라 겨우 방 한 칸을 들였습니다. 지붕은 짚을 얹었는데 그것도 겨우 한 겹이었습니다.",
            "방이 어찌나 좁은지 다리를 뻗으면 발이 밖으로 나갔습니다. 흥부가 웃으며 말했습니다.<br>\"여보, 우리 집은 방 안에서 발끝으로 봄바람을 쐬는 집이오.\"<br>아내는 웃지 못했습니다. 아이가 열둘이었기 때문입니다. 그래도 아이들은 그 방에서 잘 잤습니다.",
            "흥부는 부지런했습니다. 남의 논을 매 주고, 산에서 나무를 하고, 짚신을 만들어 장에 내다 팔았습니다. 새벽에 나가 별을 보고 돌아왔습니다.",
            "그래도 열두 아이의 입을 채우기에는 턱없이 모자랐습니다. 아이들은 하나같이 배를 곯았습니다. 젖먹이는 젖이 나오지 않아 밤새 보챘습니다.",
            "그해 흉년이 들었습니다. 사흘을 물만 먹은 날, 셋째가 흥부의 옷자락을 잡고 말했습니다.<br>\"아버지, 밥 냄새만이라도 맡아 보면 안 될까요.\" 셋째의 목소리가 아주 작았습니다.",
            "흥부는 그 말에 밤새 잠을 이루지 못했습니다. 이튿날 새벽, 그는 옷을 갈아입고 길을 나섰습니다. 문밖에 서서 한참을 망설였습니다.",
            "\"어디 가시오?\" 아내가 물었습니다.<br>\"형님 댁에 좀 다녀오겠소.\"<br>아내가 그의 소매를 잡았습니다.<br>\"가지 마세요. 무슨 봉변을 당하시려고.\"<br>\"그래도 형님인데요.\" 아내는 문밖까지 따라 나왔습니다.",
            "놀부네 집 대문 앞에 서니 안에서 밥 짓는 냄새가 담을 넘어왔습니다. 흥부는 침을 삼키고 문을 두드렸습니다. 담 안에서 웃음소리도 들려왔습니다.",
            "놀부가 나왔습니다. 흥부를 보더니 인상부터 찌푸렸습니다.<br>\"네가 어인 일이냐.\" 대문을 반만 열어 놓은 채였습니다.",
            "흥부가 무릎을 꿇었습니다.<br>\"형님, 아이들이 사흘을 굶었습니다. 쌀 한 되만 꾸어 주십시오. 가을에 품을 팔아서라도 갚겠습니다.\" 땅바닥에 이마가 닿도록 숙였습니다.",
            "놀부의 눈이 가늘어졌습니다.<br>\"쌀? 우리 집에 쌀이 어디 있느냐. 있어도 너 줄 쌀은 없다.\"<br>그러고는 문을 닫으려 했습니다. 흥부는 문틈에 손을 넣었습니다.",
            "그때 부엌에서 형수가 나왔습니다. 손에는 밥주걱이 들려 있었습니다. 방금 뜬 밥알이 주걱에 하얗게 붙어 있었습니다. 김이 모락모락 오르고 있었습니다. 형수의 손가락에는 은가락지가 두 개나 끼워져 있었습니다.",
            "\"형수님, 한 되만…….\"<br>말이 끝나기도 전이었습니다. 철썩! 주걱이 흥부의 뺨을 후려쳤습니다. 소리가 어찌나 큰지 담 밖까지 들렸습니다.",
            "흥부는 얼굴을 감쌌습니다. 볼이 금세 벌겋게 부어올랐습니다. 그런데 손바닥에 무언가 붙어 있었습니다. 주걱에서 떨어진 밥알이었습니다.<br>흥부는 그 밥알을 손바닥에서 조심조심 떼어 품에 넣었습니다. 그러고는 반대쪽 뺨을 내밀었습니다.<br>\"형수님, 이쪽도 한 번만 때려 주십시오.\""
        ]
    },
    {
        num: 2,
        title: "처마 밑의 제비",
        art: ["story-02-a.webp", "story-02-b.webp", "story-02-c.webp"],
        artAt: ["제비 한 쌍이 날아들었습니다", "실로 조심조심 감았습니다", "흥부의 발 앞에 무언가를 떨어뜨렸습니다"],
        paras: [
            "이듬해 봄이 왔습니다. 흥부네 오두막 처마 밑에 제비 한 쌍이 날아들었습니다. 지지배배 우는 소리가 마당에 가득했습니다.",
            "아이들이 손뼉을 쳤습니다.<br>\"아버지, 제비가 우리 집에 집을 지어요!\"<br>\"그렇구나. 우리 집이 마음에 들었나 보다.\" 막내는 하루에도 몇 번씩 처마를 올려다보았습니다.",
            "제비 부부는 젖은 흙과 마른 풀을 물어다 부지런히 집을 지었습니다. 얼마 뒤 새끼 다섯 마리가 알을 깨고 나왔습니다. 노란 입을 짝짝 벌리는 소리가 온종일 그치지 않았습니다. 새끼들이 자라는 것을 보는 것이 흥부네 낙이었습니다.",
            "흥부는 아침마다 그 아래에 서서 새끼들을 올려다보았습니다. 어미 제비는 쉴 새 없이 벌레를 물어 날랐습니다. 아이들도 마당에서 벌레를 잡아 처마 아래에 놓아 주었습니다.",
            "그러던 어느 날이었습니다. 흥부가 나무를 하고 돌아오는데 마당이 소란스러웠습니다. 아이들이 발을 동동 구르고 있었습니다. 아이들의 얼굴이 새하얬습니다.",
            "처마 밑 제비집 아래에 커다란 구렁이가 몸을 감고 있었습니다. 새끼 제비들이 자지러지게 울었습니다. 어른 팔뚝만 한 놈이었습니다.",
            "흥부가 지게 작대기를 들고 뛰어들었습니다.<br>\"이놈! 저리 가라!\"<br>작대기로 땅을 요란하게 두드리자 아이들이 귀를 막았습니다. 구렁이가 스르르 담 밖으로 빠져나가다 담 위에서 한 번 뒤를 돌아보았습니다. 흥부의 등에서 식은땀이 흘렀습니다.",
            "그런데 그 소동에 새끼 한 마리가 둥지에서 떨어지고 말았습니다. 흥부가 얼른 주워 보니 다리 하나가 힘없이 꺾여 있었습니다. 작은 몸이 마당 흙바닥에 나동그라져 있었습니다.",
            "\"아이고, 이를 어쩌나.\"<br>흥부는 새끼 제비를 손바닥에 올려놓고 방으로 들어갔습니다. 새끼는 눈도 제대로 뜨지 못했습니다.",
            "아내가 반짇고리<span class=\"gloss\">(바느질 도구를 담는 상자)</span>에서 실을 꺼냈습니다. 흥부는 부러진 다리에 얇은 나뭇조각을 대고 실로 조심조심 감았습니다. 손이 커서 몇 번이나 놓칠 뻔했습니다. 아이들이 숨을 죽이고 둘러앉았습니다. 나뭇조각은 흥부가 손톱으로 다듬어 얇게 깎은 것이었습니다.",
            "\"살겠소?\" 아내가 물었습니다.<br>\"살아야지요.\" 아내가 등잔을 가까이 대 주었습니다.",
            "흥부는 며칠 동안 그 새끼를 방 안에 두고 돌보았습니다. 아이들이 벌레를 잡아다 먹였습니다. 열흘쯤 지나자 새끼 제비가 다리를 짚고 일어섰고, 보름째 되던 날 마당을 낮게 한 바퀴 돌아 처마로 올라갔습니다. 그 자리에서 몇 번이나 미끄러졌지만 다시 일어섰습니다. 아이들은 날마다 방문을 열어 보았고, 벌레를 잡아 손바닥에 올려 두고 기다렸습니다. 마침내 흥부네 식구가 모두 마당에 나와 손뼉을 쳤습니다.",
            "가을이 되자 제비들은 강남으로 떠났습니다. 다리를 다쳤던 새끼도 무리를 따라 같이 떠났습니다. 처마 밑이 갑자기 조용해졌습니다.",
            "겨울은 여느 해보다 길었습니다. 흥부네는 나무껍질을 벗겨 죽을 쑤어 먹으며 겨우 넘겼습니다. 아이들은 배고픈 것도 잊고 제비 이야기를 했습니다.",
            "이듬해 음력 삼월 삼짇날이었습니다. 마당에서 아이들이 소리쳤습니다.<br>\"제비다! 제비가 왔어요!\" 아이들이 마당으로 우르르 뛰어나갔습니다.",
            "제비 한 마리가 마당 위를 몇 바퀴 돌더니 흥부의 발 앞에 무언가를 떨어뜨렸습니다. 그러고는 처마 위에 앉아 지지배배 울었습니다. 온 식구가 마당으로 뛰어나와 하늘을 올려다보았습니다.",
            "흥부가 주워 보니 하얗게 빛나는 씨앗 하나였습니다. 여느 씨앗보다 훨씬 크고, 겉에 무슨 글씨 같은 무늬가 있었습니다. 손바닥에 올려놓으니 제법 묵직했습니다.",
            "아내가 들여다보았습니다.<br>\"박씨 같은데요.\"<br>\"저 제비가 작년에 다리를 다쳤던 그놈이오. 저 걸음걸이를 보시오.\" 아내가 씨앗을 손바닥에 올려 보았습니다.",
            "과연 제비는 한쪽 다리를 조금 절었습니다. 흥부는 한참 동안 그 제비를 올려다보았습니다. 흥부가 손을 내밀자 제비가 손끝에 앉았습니다.",
            "\"고맙구나. 그런데 나는 너에게 해 준 것이 없다.\" 제비는 대답 대신 지지배배 울었습니다. 그 제비는 다시 흥부네 처마 밑에 집을 짓고, 새끼를 길러 둥지를 떠났습니다.",
            "흥부는 그 씨앗을 지붕 옆 흙벽 아래에 심었습니다. 물을 주고 흙을 다독였습니다. 아침저녁으로 물을 길어다 주었습니다. 아이들이 돌아가며 물을 주겠다고 다투었습니다.",
            "싹이 트더니 덩굴이 무섭게 뻗었습니다. 사흘 만에 지붕에 올라가고, 열흘 만에 지붕을 다 덮었습니다. 잎이 어른 손바닥보다 컸습니다.",
            "그리고 그 덩굴에 박이 열렸습니다. 하나, 둘, 셋, 넷. 모두 네 통이었습니다. 그런데 그 크기가 사람 키만 했습니다. 지붕이 그 무게에 삐걱거렸습니다. 아이들이 그 아래에서 올려다보며 입을 벌렸습니다.",
            "이웃들이 구경을 왔습니다.<br>\"이런 박은 난생처음 보네.\"<br>\"저걸 타서 바가지를 만들면 온 마을이 다 쓰겠소.\"<br>흥부는 아내와 마주 보았습니다. 사실 그 집에는 그날 저녁 먹을 것이 없었습니다.<br>\"여보, 저거라도 타서 속을 끓여 먹읍시다.\" 흥부는 얼른 대답하지 못했습니다."
        ]
    },
    {
        num: 3,
        title: "박을 타다",
        art: ["story-03-a.webp", "story-03-b.webp", "story-03-c.webp"],
        artAt: ["긴 톱을 마주 잡았습니다", "배가 터지도록 밥을 먹었습니다", "기둥을 세우고 대들보를 올리고"],
        paras: [
            "흥부 부부는 지붕에서 박 하나를 내려 마당에 놓았습니다. 그러고는 긴 톱을 마주 잡았습니다. 박이 얼마나 무거운지 둘이서 겨우 굴려 내렸습니다.",
            "\"슬근슬근 톱질하세.\"<br>흥부가 장단을 넣자 아내가 받았습니다.<br>\"이 박을 타서 속일랑 끓여 먹고 바가지는 팔아 봅세.\" 톱날이 박 껍질에 스윽 걸렸습니다. 톱질 소리가 마당에 울렸습니다.",
            "아이들이 둘러앉아 구경했습니다. 톱날이 반쯤 들어갔을 때였습니다. 톱날이 박 속으로 들어갈수록 소리가 달라졌습니다. 그러더니 박 속에서 눈이 부실 만큼 환한 빛이 새어 나왔습니다.",
            "\"어어?\"<br>흥부 부부가 손을 놓자 박이 저절로 쩍 갈라졌습니다. 톱이 손에서 떨어졌습니다.",
            "그 속에서 무언가 스르르 올라왔습니다. 흰 옷을 입은 아이 하나가 상을 받쳐 들고 나왔습니다. 아이의 옷자락에서 은은한 빛이 났습니다.",
            "상 위에는 김이 오르는 흰쌀밥이 고봉으로 담겨 있었습니다. 그 옆에는 고깃국과 나물과 김치가 놓여 있었습니다. 난생처음 보는 상이었습니다. 아이들이 침을 삼키는 소리가 났습니다.",
            "아이가 상을 마당에 내려놓고 말했습니다.<br>\"많이 드십시오.\"<br>그러고는 연기처럼 사라졌습니다. 김이 마당 가득 퍼졌습니다. 아이들이 숟가락을 쥔 채 어른들 눈치를 보았습니다.",
            "흥부네 식구는 한참 동안 아무도 움직이지 못했습니다. 막내가 먼저 밥그릇에 손을 뻗었습니다. 아무도 그것이 참인지 꿈인지 알 수 없었습니다.",
            "그날 흥부네 열네 식구는 배가 터지도록 밥을 먹었습니다. 아이들이 밥알을 씹으며 울었습니다. 흥부 내외도 울었습니다. 막내는 먹으면서도 울음을 그치지 못했습니다.",
            "그런데 이상한 일이었습니다. 상을 다 비우고 나면 그릇에 밥이 도로 그득 차 있었습니다. 아무리 먹어도 줄지 않았습니다. 흥부 내외는 서로 얼굴만 쳐다보았습니다. 흥부가 그릇을 들었다 놓았다 하며 몇 번이나 확인했습니다.",
            "\"여보.\" 아내가 말했습니다. \"저 박이 아직 세 통 남았어요.\" 아내의 목소리가 떨렸습니다.",
            "이튿날 아침, 흥부 부부는 다시 톱을 잡았습니다. 이번에는 손이 떨렸습니다. 아이들도 숨을 죽이고 지켜보았습니다.",
            "두 번째 박이 갈라지자 그 속에서 비단이 쏟아져 나왔습니다.",
            "붉은 비단, 푸른 비단, 노란 비단이 파도처럼 밀려 나와 마당을 덮었습니다. 아이들이 그 위에서 뒹굴었습니다. 빛깔이 어찌나 고운지 눈이 다 부셨습니다. 비단이 마당을 넘어 담까지 흘러넘쳤습니다.",
            "비단이 끝나자 무명과 삼베가 나왔고, 그다음에는 솜이 나왔습니다. 흥부네 열두 아이가 그해 처음으로 솜옷을 입었습니다. 아이들이 서로 옷을 만져 보았습니다.",
            "세 번째 박에서는 목수들이 나왔습니다. 톱과 자귀<span class=\"gloss\">(나무를 깎는 연장)</span>를 든 사람들이 줄줄이 걸어 나오더니 흥부에게 절을 했습니다.<br>\"집을 지으러 왔습니다.\" 열 사람도 넘었습니다.",
            "목수들은 그 자리에서 낡은 오두막을 헐고 새 집을 짓기 시작했습니다. 기둥을 세우고 대들보를 올리고 기와를 얹는 데 사흘이 걸렸습니다. 톱질 소리와 망치 소리가 밤낮으로 온 산자락에 울렸습니다.",
            "사흘째 저녁, 산자락에 커다란 기와집 한 채가 서 있었습니다. 방이 열두 칸이요 곳간이 세 채였습니다. 기와가 저녁놀을 받아 붉게 빛났습니다.",
            "마지막 네 번째 박이 남았습니다. 흥부가 톱을 잡으며 아내에게 말했습니다.<br>\"이제 그만 탈까요. 너무 과합니다.\"<br>\"열어는 봐야지요.\" 아내가 흥부의 손을 잡았습니다.",
            "네 번째 박이 갈라지자 금은보화가 쏟아졌습니다. 금덩이와 은덩이가 마당에 산처럼 쌓였습니다. 햇빛에 눈을 뜰 수가 없었습니다. 금덩이가 굴러 흥부의 발등에 닿았습니다.",
            "흥부는 그 앞에 한참을 서 있었습니다. 그러고는 이상하게도 기뻐하지 않았습니다. 오히려 얼굴이 어두워졌습니다.",
            "\"여보, 왜 그러세요.\"<br>\"내가 한 일이라고는 제비 다리 하나 싸매 준 것뿐인데, 이것이 다 내 것이 되어도 되는 것인지 모르겠소.\" 흥부는 마당을 오래 내려다보았습니다.",
            "이튿날 흥부는 마을로 내려갔습니다. 그러고는 굶는 집을 찾아다니며 쌀을 나누어 주었습니다. 빚에 눌린 집의 빚을 대신 갚아 주었습니다. 누가 시킨 것이 아니었습니다. 도움을 받은 사람들은 어쩔 줄 몰라 했습니다.",
            "한 달이 지나자 그 고을에 굶는 사람이 없어졌습니다. 사람들은 흥부네 집을 지날 때마다 담 너머로 인사를 했습니다. 그래도 흥부는 늘 먼저 고개를 숙였습니다. 흥부는 누구에게도 갚으라는 말을 하지 않았습니다.",
            "그리고 그 소문은 곧 놀부의 귀에 들어갔습니다."
        ]
    },
    {
        num: 4,
        title: "놀부의 제비",
        art: ["story-04-a.webp", "story-04-b.webp", "story-04-c.webp"],
        artAt: ["제비라니", "새끼 한 마리를 꺼냈습니다", "놀부다!"],
        paras: [
            "놀부는 소문을 듣고도 처음에는 믿지 않았습니다.<br>\"그 거지 같은 것이 부자가 됐다고? 헛소리다.\" 듣고도 코웃음을 쳤습니다.",
            "그러나 사흘이 지나도 소문이 잦아들지 않았습니다. 놀부는 결국 아우의 집으로 향했습니다. 장에 다녀온 종까지 같은 말을 했기 때문입니다.",
            "산자락에 이르러 놀부는 걸음을 멈추었습니다. 예전에 수숫대 오두막이 있던 자리에 커다란 기와집이 서 있었습니다. 기와가 햇빛을 받아 번쩍였습니다.",
            "놀부는 대문을 걷어차듯 열고 들어갔습니다.<br>\"흥부야! 어디 있느냐!\" 대문 돌쩌귀가 떨어져 나갈 뻔했습니다.",
            "흥부가 버선발로 뛰어나왔습니다.<br>\"형님! 어서 오십시오!\"<br>흥부의 얼굴에는 반가움뿐이었습니다. 뺨을 맞은 일은 입에도 올리지 않았습니다. 손을 잡고 마루로 이끌었습니다. 흥부의 아이들이 큰아버지에게 인사를 했습니다.",
            "놀부는 인사도 받지 않고 집 안을 휘휘 둘러보았습니다. 곳간 문을 열어 보고, 방마다 문을 열어 보았습니다. 쌀가마를 세어 보고는 아무 말도 하지 못했습니다.",
            "\"바른대로 말해라. 도둑질을 했느냐.\"<br>\"형님도 참. 제비 덕입니다.\" 흥부는 조금도 성내지 않았습니다.",
            "놀부의 눈이 번쩍 뜨였습니다.<br>\"제비라니.\" 놀부의 목소리가 갈라졌습니다.",
            "흥부는 있었던 일을 하나도 빼지 않고 이야기했습니다. 처마 밑 제비집, 구렁이, 부러진 다리, 실로 싸매 준 일, 봄에 물어다 준 박씨. 말하는 내내 흥부의 얼굴이 환했습니다. 흥부는 형수의 주걱 이야기만은 끝내 하지 않았습니다.",
            "놀부는 이야기를 들으며 손가락을 꼽았습니다. 그러고는 벌떡 일어섰습니다. 아우의 이야기는 귀에 들어오지도 않았습니다.",
            "\"형님, 진지라도 잡숫고 가시지요.\"<br>\"됐다.\"<br>놀부는 뒤도 돌아보지 않고 나갔습니다. 흥부가 대문 밖까지 따라 나와 인사를 했지만 놀부는 손을 내저었습니다. 흥부는 대문 밖에서 오래 서 있었습니다.",
            "집으로 돌아가는 길에 놀부는 침을 꿀꺽꿀꺽 삼켰습니다. 아주 좋은 생각이 떠올랐기 때문입니다.<br>'제비 다리만 부러뜨리면 되는구나!' 벌써 부자가 다 된 것 같았습니다.",
            "그러나 다시 생각해 보니 제비들은 벌써 따뜻한 강남으로 다 떠나고 한 마리도 남아 있지 않았습니다. 그날부터 놀부에게는 하루가 삼 년 같았습니다. 얼른 봄이 와야 하는데 봄은 좀처럼 오지 않았습니다.",
            "놀부는 종들을 시켜 처마 밑에 미리 제비집을 지어 놓게 했습니다. 종들은 이게 무슨 일인지 궁금해했습니다.",
            "드디어 기다리던 봄이 왔습니다. 놀부는 장대를 들고 마을을 돌아다니며 남의 집 제비집을 헐어 냈습니다. 마을 사람들은 놀부가 하는 짓이 수상했지만 말리지는 않았습니다.",
            "마침내 제비 한 쌍이 놀부네 처마 밑으로 날아들었습니다.<br>\"오냐, 어서 오너라!\" 놀부는 그날 밤 잠도 오지 않았습니다.",
            "제비 부부가 새끼를 쳤습니다. 새끼 다섯 마리가 노란 입을 벌렸습니다. 놀부는 하루에도 몇 번씩 사다리를 놓고 올라가 들여다보았습니다. 사다리가 삐걱거려도 아랑곳하지 않았습니다. 어미 제비가 놀부의 머리 위를 맴돌았습니다. 놀부는 새끼들이 자라는 것을 손가락으로 세었습니다.",
            "\"아직 다리가 가늘구나. 조금만 더 굵어지면…….\"",
            "보름이 지나자 새끼들의 다리에 힘이 붙었습니다. 놀부는 사다리를 놓고 올라가 새끼 한 마리를 꺼냈습니다. 둥지 안에서 어미 제비가 자지러지게 울었습니다.",
            "새끼 제비가 손안에서 파닥거렸습니다. 놀부는 잠깐 망설였습니다. 새끼는 놀부의 손가락을 꼭 붙들었습니다. 작은 심장이 손바닥에서 빠르게 뛰었습니다.",
            "그러나 곧 눈을 질끈 감았습니다.<br>\"조금만 참아라. 곧 고쳐 줄 테니.\"<br>뚝, 하고 소리가 났습니다. 새끼가 짧게 울었습니다.",
            "놀부는 실과 나뭇조각을 가져다 다리를 감았습니다. 손놀림이 어찌나 급했는지 매듭이 제대로 지어지지 않았습니다. 실이 자꾸 미끄러졌습니다.",
            "놀부는 새끼를 도로 둥지에 올려놓고 두 손을 모았습니다.<br>\"내가 네 다리를 고쳐 주었다. 잊지 마라. 내년 봄에 꼭 갚아야 한다.\" 둥지 안이 조용했습니다.",
            "가을이 되어 모든 제비들이 떠났습니다. 놀부는 마당에 서서 하늘을 올려다보며 몇 번이나 소리쳤습니다.<br>\"잊지 마라! 나다! 놀부다!\" 하늘에는 아무 대답도 없었습니다."
        ]
    },
    {
        num: 5,
        title: "열두 통의 박",
        art: ["story-05-a.webp", "story-05-b.webp", "story-05-c.webp"],
        artAt: ["세다 보니 열두 통이었습니다", "두 번째 박에서는 사당패", "흙더미만 남아 있었습니다"],
        paras: [
            "그해 겨울, 놀부는 밤마다 박 꿈을 꾸었습니다. 금덩이가 쏟아지는 꿈이었습니다. 아침에 깨면 그 꿈 이야기부터 했습니다.",
            "이듬해 음력 삼월 삼짇날, 놀부는 아침부터 마당에 나와 하늘을 살폈습니다. 아침을 거르고 하늘만 보았습니다.",
            "해가 기울 무렵 제비 한 마리가 날아들었습니다. 한쪽 다리를 심하게 절었습니다. 놀부는 두 팔을 벌리고 뛰어나갔습니다. 온 식구가 마당으로 뛰어나왔습니다.",
            "제비가 무언가를 떨어뜨리고 곧바로 하늘로 솟아올랐습니다. 놀부가 얼른 주웠습니다. 흥부가 받았다는 것보다 더 큰 박씨였습니다. 어른 두 손으로 겨우 쥘 만했습니다.",
            "\"됐다! 됐어!\"<br>놀부는 그 자리에서 덩실덩실 춤을 추었습니다.",
            "놀부는 마당 한복판을 파고 박씨를 심었습니다. 그러고는 하루에 열 번씩 물을 주었습니다. 종들에게는 밤새 지키게 했습니다. 행여 누가 파 갈까 담까지 높였습니다. 종 하나가 밤새 마당을 지키다 졸다 매를 맞았습니다.",
            "싹이 트더니 덩굴이 무섭게 뻗었습니다. 지붕을 덮고 담을 넘고 이웃집 지붕까지 올라갔습니다. 잎이 어찌나 무성한지 낮에도 마당이 어두웠습니다. 담이 덩굴 무게에 기울었습니다.",
            "박이 열렸습니다. 하나, 둘, 셋…… 세다 보니 열두 통이었습니다. 흥부네보다 세 배가 많았습니다. 하나하나가 사람 키를 넘었습니다.",
            "\"열두 통! 열두 통이면 흥부네 세 곱절이 아니냐!\"<br>놀부는 밤에도 마당에 나와 박을 쓰다듬었습니다. 밤마다 등불을 들고 나가 세어 보았습니다.",
            "아내가 조심스레 말했습니다.<br>\"영감, 아무래도 좀 이상합니다. 박이 너무 커요.\"<br>\"이 사람이 복이 굴러 들어오는데 무슨 소리를 하는가.\" 아내는 며칠째 잠을 설치고 있었습니다.",
            "드디어 박을 타는 날이 왔습니다. 놀부는 마을 사람들까지 불러 모았습니다. 제 부자 되는 것을 구경시키고 싶었던 것입니다. 마당에 멍석까지 깔았습니다.",
            "놀부가 톱을 잡고 목청을 돋우었습니다.<br>\"슬근슬근 톱질하세! 이 박을 타서 금은보화 쏟아지면 온 나라 제일가는 부자가 되어 보세!\" 구경꾼들이 담 위까지 올라앉았습니다.",
            "첫 번째 박이 쩍 갈라졌습니다. 그런데 빛이 나오지 않았습니다. 구경꾼들이 목을 빼고 들여다보았습니다.",
            "대신 사람들이 우르르 쏟아져 나왔습니다. 손에 장부를 든 사람들이었습니다.<br>\"놀부 있느냐! 빚을 갚아라!\" 옷차림이 하나같이 관가 아전<span class=\"gloss\">(관가에서 일하던 낮은 벼슬아치)</span> 같았습니다. 장부가 열 권도 넘었습니다.",
            "놀부가 어리둥절해했습니다.<br>\"내가 무슨 빚이 있다고!\"<br>\"네가 남의 논에 물꼬를 터서 망친 벼 값, 남의 호박에 말뚝 박아 못 쓰게 한 값, 다 여기 적혀 있다.\" 장부가 마당에 척 펼쳐졌습니다.",
            "장부에는 놀부가 평생 부린 심술이 하나도 빠짐없이 적혀 있었습니다. 놀부는 곳간에서 엽전 궤짝을 내주어야 했습니다. 구경꾼들이 술렁였습니다. 장부를 든 사람들이 곳간에서 궤짝을 지고 나갔습니다.",
            "두 번째 박에서는 사당패<span class=\"gloss\">(떠돌며 노래와 춤을 팔던 무리)</span>가 나왔습니다. 마당 한복판에서 밤새 놀고는 놀아 준 값을 받아 갔습니다. 꽹과리 소리가 밤새 그치지 않았습니다.",
            "세 번째 박에서는 무당이 나와 굿을 하고 굿값을 받아 갔고, 네 번째 박에서는 노승이 나와 시주를 받아 갔습니다. 곳간이 하루가 다르게 비어 갔습니다.",
            "놀부는 박이 하나 갈라질 때마다 곳간 문을 열어야 했습니다.<br>\"그만! 그만 타자!\"<br>그런데 손이 말을 듣지 않았습니다. 팔이 저절로 움직였습니다.",
            "다섯 번째, 여섯 번째, 일곱 번째. 박은 계속 갈라졌습니다. 그때마다 무언가가 나와 놀부의 재산을 한 짐씩 지고 나갔습니다. 놀부의 얼굴이 점점 하얘졌습니다. 놀부의 옷이 땀에 흠뻑 젖었습니다.",
            "여덟 번째 박에서는 흙탕물이 쏟아져 나와 마당을 뒤덮었습니다. 아홉 번째 박에서는 똥이 쏟아져 나왔습니다. 냄새가 어찌나 지독한지 구경꾼들이 다 달아났습니다.",
            "열 번째 박에서는 온갖 벌레가 쏟아져 나와 곳간의 곡식을 다 갉아 먹었습니다. 열한 번째 박에서는 커다란 구렁이가 나와 마당을 한 바퀴 돌고 담을 넘어갔습니다.",
            "마지막 열두 번째 박이 남았습니다. 놀부는 그 앞에 주저앉아 있었습니다. 이미 곳간은 텅 비었고 종들은 다 달아난 뒤였습니다. 아내는 아이들을 데리고 담 밖에 나가 있었습니다.",
            "열두 번째 박이 갈라지자 갑옷을 입은 장수들이 걸어 나왔습니다. 장수들은 아무 말도 하지 않고 연장을 들었습니다. 그러고는 놀부의 집을 헐기 시작했습니다. 아무도 말리지 못했습니다.",
            "기와가 떨어지고 기둥이 넘어갔습니다. 담이 무너지고 곳간이 주저앉았습니다. 해가 질 무렵, 놀부네 집이 있던 자리에는 흙더미만 남아 있었습니다. 기둥 하나 성한 것이 없었습니다."
        ]
    },
    {
        num: 6,
        title: "다시 심은 박씨",
        art: ["story-06-a.webp", "story-06-b.webp", "story-06-c.webp"],
        artAt: ["무너진 집터에 서 있었습니다", "담 밖에 그냥 서 있었습니다", "흰쌀밥에 고깃국이었습니다"],
        paras: [
            "놀부와 그 식구는 무너진 집터에 서 있었습니다. 비가 내리기 시작했습니다. 아무도 비 가리개 하나 걸쳐 주지 않았습니다.",
            "구경하던 마을 사람들이 하나둘 돌아갔습니다. 아무도 놀부에게 자기 집으로 가자는 말을 하지 않았습니다. 놀부는 그동안 마을에서 그런 말을 들을 만한 일을 한 적이 없었습니다. 비가 옷 속까지 스몄습니다.",
            "밤이 되자 비가 더 굵어졌습니다. 놀부네 식구는 무너진 담 밑에 웅크리고 앉았습니다. 담이라고 해 봐야 어른 무릎 높이였습니다.",
            "아내가 흐느꼈습니다.<br>\"이제 어디로 갑니까.\"<br>놀부는 대답하지 못했습니다. 아이들이 어미 치맛자락을 붙들었습니다.",
            "새벽녘, 놀부가 자리에서 일어섰습니다. 그러고는 산자락 쪽으로 걸음을 옮겼습니다. 옷에서 물이 뚝뚝 떨어졌습니다.",
            "\"어디 가세요.\"<br>\"…흥부한테.\"<br>아내가 놀부의 소매를 잡았습니다.<br>\"무슨 낯으로요.\"<br>\"낯이 없으니까 가는 것이오.\" 빗소리에 목소리가 묻혔습니다.",
            "놀부는 비를 맞으며 걸었습니다. 걸으면서 흥부가 전에 저에게 했던 말들이 자꾸 떠올랐습니다. 빗물이 눈으로 자꾸 들어왔습니다.",
            "형님, 어서 오십시오. 형님, 진지라도 잡숫고 가시지요. 그때 흥부의 얼굴에는 원망이 한 점도 없었습니다. 그 얼굴이 자꾸 눈앞에 어른거렸습니다.",
            "놀부는 걸음을 멈추었습니다. 그러고는 처음으로 스스로에게 물었습니다.<br>'나는 저 사람에게 무엇을 해 주었던가.' 처음 해 보는 물음이었습니다.",
            "아무것도 없었습니다. 아버지 재산을 혼자 차지했고, 삼우제가 끝나던 날 저녁에 열두 아이와 함께 내쫓았고, 쌀 한 되를 얻으러 온 아우가 주걱으로 맞는 것을 문간에서 보고만 있었습니다. 생각할수록 낯이 뜨거웠습니다.",
            "놀부는 그 자리에 주저앉았습니다. 빗물인지 눈물인지 모를 것이 얼굴을 타고 흘렀습니다. 한참을 그렇게 있었습니다.",
            "해가 뜰 무렵, 놀부는 흥부네 대문 앞에 이르렀습니다. 문을 두드릴 용기가 나지 않아 담 밖에 그냥 서 있었습니다. 대문 안에서 사람 소리가 났습니다.",
            "그때 대문이 열렸습니다. 흥부가 맨발로 뛰어나왔습니다. 문지방을 넘는 소리가 급했습니다.",
            "\"형님!\"<br>흥부는 놀부를 보자마자 그 젖은 어깨를 끌어안았습니다. 옷이 젖는 것도 아랑곳하지 않았습니다.",
            "\"소, 소식을 들었습니다. 밤새 사람을 보내 찾았는데 어디 계셨습니까.\"<br>놀부는 아무 말도 하지 못했습니다. 흥부의 목소리가 떨렸습니다.",
            "흥부는 놀부네 식구를 모두 집 안으로 들였습니다. 아궁이에 불을 지피게 하고, 마른 옷을 내오게 하고, 밥상을 차리게 했습니다. 아이들에게는 마른 수건과 따뜻한 물부터 내주었습니다.",
            "상이 들어왔습니다. 흰쌀밥에 고깃국이었습니다. 놀부는 숟가락을 들지 못하고 상만 내려다보았습니다. 손이 자꾸 떨렸습니다.",
            "\"형님, 식습니다.\"<br>\"…흥부야.\"<br>\"예.\"<br>\"내가 너에게 이런 밥상을 한 번이라도 차려 준 적이 있느냐.\" 방 안이 조용해졌습니다.",
            "흥부가 웃었습니다.<br>\"어릴 적에 형님이 저에게 홍시를 주신 적이 있습니다. 감나무에 올라가서 따다 주셨지요.\"<br>\"그런 일이 있었느냐.\"<br>\"저는 그것만 기억하기로 했습니다.\"",
            "놀부가 상 위로 얼굴을 묻었습니다. 어깨가 크게 흔들렸습니다. 흥부는 아무 말 없이 형의 등에 손을 얹었습니다. 숟가락이 상 위에 그대로 놓여 있었습니다.",
            "그날부터 놀부네 식구는 흥부네 집에서 지냈습니다. 흥부는 형에게 곳간 열쇠를 내밀었습니다.<br>\"형님이 맡아 주십시오.\"<br>놀부는 그 열쇠를 받지 않았습니다.<br>\"아니다. 나는 그것부터 다시 배워야 한다.\" 흥부는 더 권하지 않았습니다.",
            "놀부는 그해 봄부터 흥부네 논에 나가 일을 했습니다. 평생 남을 부리기만 하던 사람이 처음으로 제 손에 흙을 묻혔습니다. 손바닥이 터지고 아물기를 여러 번 했습니다. 아침마다 제일 먼저 들에 나갔습니다.",
            "놀부는 뒤꼍 한 귀퉁이를 파고 무언가를 심었습니다. 흥부가 물었습니다.<br>\"형님, 그게 무엇입니까.\"<br>\"박씨다.\" 흙 묻은 손이 그대로였습니다.",
            "흥부가 놀랐습니다.<br>\"형님, 또…….\"<br>놀부가 고개를 저었습니다.<br>\"이번에는 바가지를 만들려고 심는 것이다. 우리 마을 우물에도 바가지를 놓아 두어야겠다.\"",
            "그 덩굴에서는 아주 평범한 박이 세 통 열렸습니다. 놀부는 그것을 타서 속을 파내고 볕에 말려 바가지를 만들었습니다. 금도 은도 나오지 않았습니다.",
            "그러고는 그 가운데 하나를 마을 우물가에 걸어 두었습니다. 지나가는 사람 누구나 물을 떠 마실 수 있게 말입니다. 놀부가 평생 처음으로 남에게 그냥 내준 물건이었습니다. 바가지는 여러 해가 지나도록 그 자리에 걸려 있었다고 합니다."
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
    emoji: '🐦',
    title: '흥부전',
    intro: [
        "흥부전은 지은이가 알려지지 않은 조선 후기 소설이에요. 판소리 흥보가로 불리던 것이 글로 옮겨진 것이지요.",
        "판소리 다섯 마당은 춘향가, 심청가, 흥보가, 수궁가, 적벽가예요. 흥보가는 그 가운데 웃음이 가장 많은 마당이랍니다.",
        "박은 옛날 집집마다 심던 덩굴 열매예요. 다 자라 속을 파내고 말리면 바가지가 되어 물을 뜨고 쌀을 담는 그릇이 되었지요. 이렇게 흔한 박이 이 이야기에서는 어떤 일을 벌일까요?",
        "제비는 봄에 왔다가 가을에 강남으로 떠나는 새예요. 옛사람들은 제비가 처마 밑에 집을 지으면 그 집에 복이 온다고 여겼답니다."
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
    { q: "놀부가 흥부를 집에서 내보낸 까닭은 무엇입니까?", choices: ["흥부가 잘못을 저질러서", "재산을 혼자 차지하려고", "아버지가 그리 이르셔서"], answer: 1 },
    { q: "흥부가 형의 집에 쌀을 얻으러 갔을 때 받은 것은 무엇입니까?", choices: ["쌀 한 되를 얻었다", "문도 열어 주지 않았다", "주걱으로 뺨을 맞았다"], answer: 2 },
    { q: "흥부는 부러진 다리를 무엇으로 감았습니까?", choices: ["나뭇조각과 실", "짚과 흙 한 줌", "지게 작대기 하나"], answer: 0 },
    { q: "이듬해 봄에 제비가 물어다 준 것은 무엇입니까?", choices: ["금덩이 하나", "박씨 하나", "밥알 한 알"], answer: 1 },
    { q: "첫 번째 박에서 나온 것은 무엇입니까?", choices: ["쏟아져 나온 비단", "집 지으러 온 목수들", "흰쌀밥이 담긴 상"], answer: 2 },
    { q: "놀부가 흥부를 찾아온 까닭은 무엇입니까?", choices: ["그동안 저지른 일을 사과하려고", "어떻게 부자가 됐는지 캐물으려고", "쌀을 조금 나눠 주려고"], answer: 1 },
    { q: "놀부는 제비 다리를 부러뜨린 뒤 무엇을 했습니까?", choices: ["실과 나뭇조각으로 감았다", "둥지에 도로 올려만 두었다", "마당에 내려놓고 지켜보았다"], answer: 0 },
    { q: "놀부의 박에서 처음 나온 것은 누구입니까?", choices: ["장부를 든 사람들", "굿을 하는 무당", "곳간을 갉는 벌레 떼"], answer: 0 },
    { q: "놀부의 박에서 마지막에 나온 것은 무엇입니까?", choices: ["갑옷을 입은 장수들", "커다란 구렁이 한 마리", "끝없이 쏟아진 흙탕물"], answer: 0 },
    { q: "박이 하나씩 갈라질 때마다 놀부는 무엇을 했습니까?", choices: ["톱을 손에서 놓았다", "구경꾼들을 불러 모았다", "곳간 문을 열어야 했다"], answer: 2 },
    { q: "흥부는 찾아온 형을 어떻게 대했습니까?", choices: ["버선발로 뛰어나와 맞았다", "지난 일을 먼저 따졌다", "새 집을 지어 주었다"], answer: 0 },
    { q: "놀부는 마지막에 박을 타서 무엇을 만들었습니까?", choices: ["멍석", "비 가리개", "바가지"], answer: 2 },
    {
        q: "이 책을 읽고 난 반응으로 알맞지 않은 것은 무엇인가요?",
        wide: true,
        choices: [
            "놀부가 제비를 기다리다 남의 집 제비집까지 헌 것을 보면, 욕심은 남의 것부터 부수는구나.",
            "흥부가 형수의 주걱 이야기만은 끝내 하지 않은 것을 보면, 말하지 않는 것도 지키는 방법이야.",
            "박이 갈라질 때마다 놀부가 곳간 문을 열어야 했던 것을 보면, 쌓아 둔 것에는 갚을 몫이 따라오네.",
            "놀부가 흥부가 내민 곳간 열쇠를 받아 살림을 도로 맡은 것을 보면, 형 노릇을 다시 하게 됐나 봐."
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
    emoji: '🐦',
    art: ['end.webp'],
    paras: [
        `이 이야기도 노래가 먼저였습니다. 판소리 「흥보가」를 글로 옮긴 것이 『흥부전』입니다. 지금도 판소리로 부르는 다섯 마당 가운데 하나입니다.`,
        `「흥보가」에서 가장 이름난 대목이 박을 켜는 대목입니다. 톱질하는 소리에 맞춰 부르기 때문에 「박타령」이라고 따로 부르기도 합니다. 슬근슬근 톱질하세 하는 그 소리입니다. 이 책에서 박을 켜는 대목이 유난히 길고 되풀이가 많은 것은 노래였던 흔적입니다.`,
        `형제가 하나는 착하고 하나는 못됐다가 결국 뒤집히는 이야기는 우리나라에만 있는 것이 아닙니다. 신라 사람 방이 이야기가 중국 책에 실려 전하는데, 형제가 나오고 씨앗이 나오고 금은보화가 나옵니다. 몽골에도 비슷한 이야기가 있습니다. 아주 오래되고 널리 퍼진 이야기 틀입니다.`,
        `박은 지어낸 물건이 아닙니다. 옛날에는 마당가에 박을 심어 열매를 켜서 바가지를 만들었습니다. 가난한 집이면 어디나 있던 것입니다. 이 이야기가 하필 박에서 보물이 나오게 한 것은, 가장 흔하고 값없는 것에서 뜻밖의 것이 나오게 하려던 것입니다.`,
        `제비가 강남으로 간다는 말도 자주 나옵니다. 강남은 중국 양쯔강 남쪽을 가리키던 말입니다. 옛사람들이 아는 가장 먼 남쪽이 거기였기 때문입니다. 실제 제비는 그보다 훨씬 멀리 동남아시아까지 날아가 겨울을 나고, 이듬해 봄에 같은 처마로 돌아옵니다. 해마다 같은 집을 찾아온다는 것도 지어낸 말이 아닙니다.`,
        `제비가 은혜를 갚는 대목도 흔한 틀입니다. 다친 짐승을 살려 주었더니 갚으러 오는 이야기는 세계 어디에나 있습니다. 다만 여기서는 갚는 방법이 씨앗 하나입니다. 갚기는 갚되 당장 손에 쥐여 주지 않고, 심고 기르고 켜야 얻게 만든 것입니다.`,
        `놀부가 제비 다리를 일부러 부러뜨린 대목은 이 이야기에서 가장 서늘한 자리입니다. 흥부가 한 일을 그대로 흉내 냈는데 결과가 반대입니다. 같은 일을 했는데 왜 달랐는지, 그 답이 이 이야기 전체입니다.`,
        `원래 이야기에서 놀부의 박에서는 더 많은 것이 나옵니다. 빚쟁이와 상여꾼과 무당과 사당패가 줄줄이 나와 재물을 뜯어 갑니다. 하나가 나올 때마다 놀부가 남은 것을 헐어 갚고, 그러고도 다음 박을 켭니다. 그만두지 못하는 것이 이 사람의 병입니다.`,
        `이 이야기는 돈 이야기이기도 합니다. 놀부는 논밭을 물려받았고 흥부는 빈손으로 나갔습니다. 흥부가 게을러서 가난한 것이 아닙니다. 새벽에 나가 별을 보고 돌아왔는데도 가난했습니다. 부지런하면 잘살게 된다는 말이 언제나 맞는 말은 아니라는 것을 이 이야기가 조용히 보여 줍니다.`,
        `이 이야기가 만들어지던 조선 후기는 그런 일이 실제로 흔하던 때였습니다. 맏이가 재산을 다 받고 아우들은 빈손으로 나가는 집이 늘었습니다. 흥부 같은 사람이 마을마다 있었습니다. 그런 사람들이 이 이야기를 들으며 웃었습니다.`,
        `형수가 주걱으로 뺨을 친 대목을 다시 보십시오. 흥부가 반대쪽 뺨을 내민 것은 착해서가 아닙니다. 뺨에 붙은 밥알 때문입니다. 한 대 더 맞으면 밥알이 하나 더 붙기 때문입니다. 웃긴 대목인데 웃고 나면 마음이 좋지 않습니다. 판소리는 이런 자리를 잘 만듭니다.`,
        `끝에서 놀부를 죽이지 않은 것도 눈여겨볼 만합니다. 벌은 받았지만 목숨은 붙어 있고, 흥부가 그를 거두어들입니다. 옛이야기가 못된 사람을 다루는 방식은 대개 둘입니다. 아주 없애 버리거나, 빈털터리로 만들어 다시 시작하게 하거나. 이 이야기는 뒤쪽을 골랐습니다.`,
        `다만 이 결말을 두고는 예부터 말이 많았습니다. 놀부가 정말 뉘우친 것인지, 아니면 가진 것이 없어져서 어쩔 수 없이 고개를 숙인 것인지는 이야기가 밝혀 주지 않습니다.`,
        `흥부가 제비를 고쳐 준 것은 갚음을 바라서가 아니었습니다. 그런데 갚음을 받았습니다. 만약 아무 일도 일어나지 않았다면, 흥부가 한 일은 헛일이 되는 것일까요.`,
        `놀부가 벌을 받은 까닭은 무엇일까요? 제비 다리를 부러뜨려서일까요, 아우를 내쫓아서일까요, 아니면 갚음을 바라고 흉내 냈기 때문일까요. 셋 가운데 어느 것이 가장 큰 잘못인지 정해 보십시오.`,
        `흥부가 부자가 되지 않았어도 이 이야기가 남았을까요? 착한 사람이 반드시 잘살게 된다고 이야기가 말해 주면 마음이 놓입니다. 그러나 정말 그런지는 다른 문제입니다. 이야기가 우리에게 그렇게 말해 주는 까닭이 무엇일지 생각해 보십시오.`
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
        emoji: '🐦',
        title: 'The Tale of Heungbu',
        intro: [
            "The Tale of Heungbu is an old Korean story with no known author. It began as a song.",
            "Singers performed it as pansori, a kind of story-singing, under the name Heungbo-ga. It is the funniest of the five great pansori songs.",
            "A gourd is a big round fruit. People grew them by the yard, sawed them in half, and dried the shells to make water dippers. Every poor house had one."
        ]
    },
    chapters: [
        {
            num: 1,
            title: "The Brother Turned Out",
            art: ["story-01-a.webp", "story-01-b.webp", "story-01-c.webp"],
            artAt: ["From today you live somewhere else", "Heungbu went down on his knees", "hit this side too"],
            paras: [
                "Long ago, in a village in Jeolla, there lived two brothers. The elder was Nolbu and the younger was Heungbu. The family had a fair bit of land, so there was no worry about food.",
                "They came from the same mother, and yet the two were as different as water and fire. Heungbu was soft-hearted and rolled up his sleeves for other people first. Nolbu never even glanced at anything that wasn't his. One was born to give and one was born to take.",
                "The whole village knew how mean Nolbu was. He broke open other people's paddy banks, drove stakes into good pumpkins, stuck needles into the young ones, and danced at houses in mourning. If he didn't do something mean, his food wouldn't go down. And he was never ashamed of it. Even the village children hid in the alleys when he passed.",
                "On the day their father died, he called both brothers to his bedside.<br>\"Share the property equally between you. And never turn your backs on each other.\" His breath was short, and the words kept breaking off.",
                "But the moment their father closed his eyes, Nolbu forgot those words. Or rather, he pretended to. The first thing he did was hang the storehouse key on his own belt.",
                "On the evening of the third-day rite<span class=\"gloss\">(a memorial held on the third day after the burial)</span>, Nolbu called Heungbu out into the yard.<br>\"From today you live somewhere else.\" There wasn't a trace of apology in his voice. The rite table hadn't even been cleared away.",
                "Heungbu could not take it in.<br>\"Brother, what do you mean?\"<br>\"It's the rule that the eldest keeps the house. You go out and set up your own.\" Heungbu could not believe his ears.",
                "\"Father told us to share it equally.\"<br>\"Who listens to a dead man? I didn't hear it.\" Heungbu could not press him any further.",
                "That very night Heungbu took his wife and children and left the house. All he carried was one bundle of worn-out clothes. The youngest was not even walking yet.",
                "His brother's wife did not so much as come to the gate. Only her voice came over the wall.<br>\"I grudged them the rice they'd eat.\" The words carried over the wall and down the alley.",
                "Heungbu's family settled on a hillside far from the village. They wove millet stalks together, plastered them with mud, and just managed one room. They laid straw on the roof, and only one layer of it.",
                "The room was so small that if you stretched your legs your feet went outside. Heungbu laughed and said,<br>\"My dear, ours is a house where you can feel the spring wind on your toes from inside the room.\"<br>His wife could not laugh. There were twelve children. Even so, the children slept well in that room.",
                "Heungbu worked hard. He weeded other people's paddies, cut wood in the hills, wove straw shoes and sold them at the market. He left before dawn and came home under the stars.",
                "Even so it was nowhere near enough for twelve mouths. Every one of the children went hungry. The baby cried all night because there was no milk.",
                "That year the harvest failed. On a day when they had lived three days on water alone, the third child caught Heungbu's sleeve.<br>\"Father, couldn't I at least smell the smell of rice?\" The child's voice was very small.",
                "Heungbu lay awake all that night. At dawn he changed his clothes and set out. He stood outside the door a long while, hesitating.",
                "\"Where are you going?\" his wife asked.<br>\"I'll go over to my brother's house.\"<br>She caught his sleeve.<br>\"Don't go. You'll only be shamed.\"<br>\"He is still my brother.\" She followed him out past the door.",
                "Standing at Nolbu's gate, he could smell rice cooking over the wall. Heungbu swallowed and knocked. Laughter came over the wall too.",
                "Nolbu came out. The moment he saw Heungbu he screwed up his face.<br>\"What brings you here?\" He had opened the gate only halfway.",
                "Heungbu went down on his knees.<br>\"Brother, the children haven't eaten for three days. Lend me just one measure of rice. I'll pay it back in autumn even if I have to hire myself out.\" He bowed until his forehead touched the ground.",
                "Nolbu's eyes narrowed.<br>\"Rice? Where would we get rice? And if we had it, there's none for you.\"<br>Then he started to shut the gate. Heungbu put his hand in the gap.",
                "Just then his brother's wife came out of the kitchen. She had a rice paddle in her hand. Fresh grains of rice were still stuck white to it. Steam was rising off it. There were two silver rings on her fingers.",
                "\"Sister, just one measure...\"<br>He never finished. Smack! The rice paddle struck Heungbu on the cheek. The sound was so loud it was heard outside the wall.",
                "Heungbu covered his face. His cheek swelled red at once. But there was something stuck to his palm. A grain of rice, fallen from the paddle.<br>Heungbu carefully peeled that grain off his palm and tucked it inside his coat. Then he turned the other cheek toward her.<br>\"Sister, please hit this side too.\""
            ]
        },
        {
            num: 2,
            title: "The Swallows Under the Eaves",
            art: ["story-02-a.webp", "story-02-b.webp", "story-02-c.webp"],
            artAt: ["a pair of swallows flew in", "wound the thread around it", "dropped something in front of Heungbu"],
            paras: [
                "The next spring came. Under the eaves of Heungbu's hut a pair of swallows flew in. Their chirping filled the yard.",
                "The children clapped their hands.<br>\"Father, the swallows are building a house at our house!\"<br>\"So they are. They must like it here.\" The youngest looked up at the eaves a dozen times a day.",
                "The swallow couple carried wet mud and dry grass and built busily. Before long five chicks broke out of their eggs. The sound of yellow beaks opening wide never stopped all day. Watching those chicks grow was the joy of Heungbu's house.",
                "Every morning Heungbu stood underneath and looked up at them. The parent swallows flew in and out all day carrying insects. The children caught insects in the yard too and left them under the eaves.",
                "Then one day it happened. Heungbu was coming back from cutting wood when he found the yard in an uproar. The children were stamping their feet. Their faces were white.",
                "Under the eaves, wrapped around below the swallows' nest, was a huge snake. The chicks were shrieking. It was as thick as a grown man's arm.",
                "Heungbu ran in with the pole from his carrying frame.<br>\"You there! Get away!\"<br>He beat the ground with the pole so loudly that the children covered their ears. The snake slid out over the wall, and on top of the wall it looked back once. Cold sweat ran down Heungbu's back.",
                "But in all that commotion one chick had fallen from the nest. Heungbu picked it up at once and saw that one leg hung broken. The small body lay sprawled on the bare earth of the yard.",
                "\"Oh no. What do we do.\"<br>Heungbu laid the chick on his palm and carried it into the room. It could not even open its eyes properly.",
                "His wife took thread out of her sewing basket. Heungbu set a thin splinter of wood against the broken leg and carefully wound the thread around it. His hands were big and he nearly dropped it several times. The children sat around holding their breath. He had shaved that splinter thin with his own fingernail.",
                "\"Will it live?\" his wife asked.<br>\"It has to.\" She held the lamp closer for him.",
                "For several days Heungbu kept the chick in the room and looked after it. The children caught insects and fed it. After about ten days the chick stood on its leg, and on the fifteenth day it flew one low circle of the yard and up to the eaves. It slipped off that ledge more than once and got up again. The children opened the door to look every day and waited with insects they had caught on their palms. In the end the whole family came out into the yard and clapped.",
                "When autumn came the swallows left for the south. The chick with the hurt leg went along with the flock. Under the eaves it went suddenly quiet.",
                "That winter was longer than usual. Heungbu's family got through it by peeling bark and boiling it into porridge. The children forgot they were hungry and talked about the swallows.",
                "The next year, on the third day of the third lunar month, the children shouted from the yard.<br>\"Swallows! The swallows are back!\" They came pouring out into the yard.",
                "One swallow circled over the yard a few times and dropped something in front of Heungbu. Then it settled on the eaves and chirped. The whole family ran out and looked up at the sky.",
                "Heungbu picked it up and found a seed that shone white. It was far bigger than any ordinary seed, and there was a pattern on it like writing. On his palm it felt surprisingly heavy.",
                "His wife looked at it closely.<br>\"It looks like a gourd seed.\"<br>\"That swallow is the one that hurt its leg last year. Look at the way it walks.\" She put the seed on her own palm.",
                "Sure enough, the swallow limped a little on one leg. Heungbu looked up at it for a long time. When he held out his hand the swallow landed on his fingertip.",
                "\"Thank you. But I never did anything for you.\" Instead of answering, the swallow chirped. The swallow built its nest under Heungbu's eaves again, raised its chicks, and left.",
                "Heungbu planted the seed at the foot of the mud wall beside the roof. He watered it and patted the earth down. He carried water to it morning and evening. The children argued over whose turn it was to water it.",
                "A shoot came up and the vine ran wild. In three days it was on the roof, and in ten days it covered the roof completely. The leaves were bigger than a grown man's hand.",
                "And gourds grew on that vine. One, two, three, four. Four of them in all. And each was as big as a person. The roof creaked under the weight. The children stood underneath, looking up with their mouths open.",
                "The neighbours came to see.<br>\"I've never seen gourds like these in my life.\"<br>\"Saw those open for dippers and the whole village could use them.\"<br>Heungbu and his wife looked at each other. The truth was there was nothing in that house to eat that evening.<br>\"My dear, let's saw one open at least and boil the inside.\" Heungbu could not answer at once."
            ]
        },
        {
            num: 3,
            title: "Sawing the Gourds",
            art: ["story-03-a.webp", "story-03-b.webp", "story-03-c.webp"],
            artAt: ["took hold of a long saw", "ate until they could not eat any more", "Raising the posts, setting the main beam"],
            paras: [
                "Heungbu and his wife brought one gourd down from the roof and set it in the yard. Then they took hold of a long saw, one at each end. It was so heavy the two of them barely managed to roll it down.",
                "\"Saw away, saw away.\"<br>Heungbu set the rhythm and his wife answered.<br>\"Let's saw this gourd, boil the inside, and sell the shell for a dipper.\" The blade caught on the skin of the gourd. The sound of sawing rang round the yard.",
                "The children sat around watching. The blade was halfway in. As it went deeper into the gourd the sound changed. And then a light came out of it so bright it hurt their eyes.",
                "\"What? What is it?\"<br>The moment they let go, the gourd split open on its own. The saw dropped out of their hands.",
                "Something rose slowly out of it. A child dressed in white came out carrying a table. There was a faint light coming off the child's clothes.",
                "On the table was white rice heaped up with steam coming off it. Beside it were meat soup and vegetables and kimchi. They had never seen such a table in their lives. You could hear the children swallowing.",
                "The child set the table down in the yard and said,<br>\"Please eat your fill.\"<br>Then it vanished like smoke. Steam spread all across the yard. The children held their spoons and watched the grown-ups' faces.",
                "For a long moment not one of Heungbu's family could move. The youngest reached for a bowl first. Nobody could tell whether it was real or a dream.",
                "That day all fourteen of Heungbu's family ate until they could not eat any more. The children cried as they chewed. Heungbu and his wife cried too. The youngest could not stop crying even while eating.",
                "And then a strange thing. Every time they emptied the table the bowls were full again. However much they ate, it never went down. Heungbu and his wife could only look at each other. Heungbu picked a bowl up and put it down again, checking it over and over.",
                "\"My dear,\" said his wife. \"There are still three gourds left.\" Her voice was shaking.",
                "The next morning Heungbu and his wife took up the saw again. This time their hands trembled. The children watched, holding their breath.",
                "When the second gourd split, silk came pouring out of it.",
                "Red silk, blue silk, yellow silk rolled out like waves and covered the yard. The children tumbled about on top of it. The colours were so lovely they dazzled the eyes. The silk spilled over the yard and up to the wall.",
                "After the silk came cotton cloth and hemp, and after that raw cotton. That year Heungbu's twelve children wore padded clothes for the first time. They kept touching each other's clothes.",
                "Out of the third gourd came carpenters. Men with saws and adzes walked out one after another and bowed to Heungbu.<br>\"We've come to build a house.\" There were more than ten of them.",
                "The carpenters pulled down the old hut on the spot and began building a new house. Raising the posts, setting the main beam and laying the tiles took three days. The sound of sawing and hammering rang round the hillside day and night.",
                "On the evening of the third day a great tiled house stood on the hillside. It had twelve rooms and three storehouses. The tiles shone red in the evening glow.",
                "The last gourd, the fourth, was left. Heungbu took up the saw and said to his wife,<br>\"Shall we stop now? This is too much.\"<br>\"We ought to open it at least.\" She took his hand.",
                "When the fourth gourd split, gold and silver came pouring out. Lumps of gold and silver piled up in the yard like a hill. The sunlight off them was too bright to look at. A lump of gold rolled against Heungbu's foot.",
                "Heungbu stood in front of it for a long time. And strangely, he did not look glad. If anything his face darkened.",
                "\"My dear, what is it?\"<br>\"All I ever did was bind up one swallow's leg. I don't know whether all this should become mine.\" Heungbu looked down at the yard for a long while.",
                "The next day Heungbu went down into the village. He went from house to house where people were hungry and shared out rice. Where a house was crushed by debt he paid the debt for them. Nobody had told him to. The people he helped did not know what to do with themselves.",
                "Within a month there was nobody hungry in that district. People bowed over the wall whenever they passed Heungbu's house. Even so, Heungbu always bowed first. He never once told anyone to pay him back.",
                "And soon the story reached Nolbu's ears."
            ]
        },
        {
            num: 4,
            title: "Nolbu's Swallow",
            art: ["story-04-a.webp", "story-04-b.webp", "story-04-c.webp"],
            artAt: ["Swallows?", "took out one chick", "It's Nolbu!"],
            paras: [
                "At first Nolbu did not believe the story.<br>\"That beggar has got rich? Nonsense.\" He heard it and snorted.",
                "But three days went by and the story did not die down. In the end Nolbu set off for his brother's house. Even the servant back from the market was saying the same thing.",
                "When he reached the hillside Nolbu stopped walking. Where the millet-stalk hut had stood there was now a great tiled house. The tiles flashed in the sunlight.",
                "Nolbu kicked the gate open and walked in.<br>\"Heungbu! Where are you!\" The gate hinges nearly came off.",
                "Heungbu ran out in his stocking feet.<br>\"Brother! Come in, come in!\"<br>There was nothing but gladness on his face. He never once brought up being struck on the cheek. He took his brother's hand and led him to the floor. Heungbu's children bowed to their uncle.",
                "Nolbu did not even return the greeting. He looked around the house, opened the storehouse door, opened the door of every room. He counted the sacks of rice and then could not say a word.",
                "\"Tell me straight. Did you steal it?\"<br>\"Brother, really. It was the swallows.\" Heungbu did not get angry in the least.",
                "Nolbu's eyes flew open.<br>\"Swallows?\" His voice cracked.",
                "Heungbu told him everything without leaving anything out. The nest under the eaves, the snake, the broken leg, binding it with thread, the gourd seed brought back in spring. His face was bright the whole time he was telling it. The one thing he never told was the story of his sister-in-law's rice paddle.",
                "Nolbu counted on his fingers while he listened. Then he stood up abruptly. His brother's story was no longer going into his ears.",
                "\"Brother, at least stay and eat.\"<br>\"No need.\"<br>Nolbu went out without looking back. Heungbu followed him out past the gate and bowed, but Nolbu waved him off. Heungbu stood outside the gate for a long time.",
                "On the way home Nolbu kept swallowing hard. A fine idea had come to him.<br>'So all I have to do is break a swallow's leg!' He felt as if he were rich already.",
                "But then he remembered that the swallows had all gone to the warm south long ago, and not one was left. From that day each day felt like three years to Nolbu. He wanted spring to come at once, but spring would not hurry.",
                "Nolbu had his servants build swallows' nests under the eaves in advance. The servants wondered what on earth it was for.",
                "At last the spring he had waited for came. Nolbu went round the village with a pole and knocked down the swallow nests at other people's houses. The villagers thought it was strange, but nobody stopped him.",
                "In the end a pair of swallows flew in under Nolbu's eaves.<br>\"That's it! Come along in!\" Nolbu could not sleep that night.",
                "The swallow couple raised chicks. Five chicks opened their yellow beaks. Nolbu put up a ladder and climbed to look in a dozen times a day. He did not care that the ladder creaked. The mother swallow circled over his head. Nolbu counted the chicks' growing on his fingers.",
                "\"The legs are still thin. Just a little thicker and...\"",
                "After fifteen days the chicks' legs grew strong. Nolbu put up the ladder, climbed, and took out one chick. Inside the nest the mother swallow shrieked.",
                "The chick fluttered in his hand. Nolbu hesitated for a moment. The chick gripped his finger tight. The small heart beat fast against his palm.",
                "But then he shut his eyes hard.<br>\"Bear it a moment. I'll mend it right away.\" There was a snap. The chick gave a short cry.",
                "Nolbu fetched thread and a splinter of wood and wound the leg. His hands were in such a hurry that the knot would not tie properly. The thread kept slipping.",
                "Nolbu put the chick back in the nest and pressed his hands together.<br>\"I mended your leg. Don't forget it. You must pay me back next spring.\" Inside the nest it was quiet.",
                "When autumn came all the swallows left. Nolbu stood in the yard looking up at the sky and shouted after them again and again.<br>\"Don't forget! It's me! It's Nolbu!\" There was no answer from the sky."
            ]
        },
        {
            num: 5,
            title: "Twelve Gourds",
            art: ["story-05-a.webp", "story-05-b.webp", "story-05-c.webp"],
            artAt: ["twelve of them", "Out of the second gourd came a troupe", "only a heap of earth"],
            paras: [
                "That winter Nolbu dreamed about gourds every night. They were dreams of gold pouring out. In the morning when he woke, that dream was the first thing he talked about.",
                "On the third day of the third lunar month the next year, Nolbu was out in the yard from morning watching the sky. He skipped breakfast and only watched the sky.",
                "As the sun was going down one swallow flew in. It limped badly on one leg. Nolbu ran out with both arms open. The whole household came running into the yard.",
                "The swallow dropped something and shot straight up into the sky. Nolbu snatched it up. It was a bigger gourd seed than the one Heungbu had been given. It barely fitted in two hands.",
                "\"That's it! That's it!\"<br>Nolbu danced on the spot.",
                "Nolbu dug the middle of the yard and planted the seed. Then he watered it ten times a day. He had the servants guard it all night. He even raised the wall in case somebody dug it up. One servant fell asleep on watch and was beaten for it.",
                "A shoot came up and the vine ran wild. It covered the roof, went over the wall and up onto the neighbour's roof. The leaves were so thick the yard was dark even at noon. The wall tilted under the weight of the vine.",
                "Gourds grew. One, two, three... he counted and there were twelve of them. Three times as many as Heungbu's. Every one of them was taller than a person.",
                "\"Twelve! Twelve is three times what Heungbu had!\"<br>Nolbu went out at night as well and stroked the gourds. Every night he carried a lamp out and counted them.",
                "His wife said carefully,<br>\"Husband, something is not right about this. The gourds are too big.\"<br>\"Woman, good fortune is rolling in and you talk like that.\" She had not slept properly for days.",
                "At last the day came to saw the gourds. Nolbu called the villagers together as well. He wanted them to watch him getting rich. He even laid mats out in the yard.",
                "Nolbu took up the saw and raised his voice.<br>\"Saw away, saw away! Saw this gourd, let the gold pour out, and let me be the richest man in the land!\" The onlookers climbed up and sat on the wall.",
                "The first gourd split open. But no light came out. The onlookers craned their necks to see.",
                "Instead, people came pouring out. They had ledgers in their hands.<br>\"Where's Nolbu! Pay your debts!\" Every one of them was dressed like a clerk from the government office. There were more than ten ledgers.",
                "Nolbu was bewildered.<br>\"What debts have I got!\"<br>\"The rice you ruined by breaking open other people's paddy banks, the pumpkins you spoiled with stakes, it's all written down here.\" The ledgers were spread open in the yard.",
                "Every mean thing Nolbu had done in his life was written in those ledgers, and not one was missing. Nolbu had to hand over a chest of coins from his storehouse. The onlookers murmured. The men with the ledgers carried the chest out of the storehouse on their backs.",
                "Out of the second gourd came a troupe of players. They played in the middle of the yard all night and then took payment for playing. The gongs did not stop all night.",
                "Out of the third gourd came a shaman who held a rite and took payment for the rite, and out of the fourth came an old monk who took an offering. The storehouse emptied by the day.",
                "Every time a gourd split Nolbu had to open the storehouse door.<br>\"Stop! Let's stop sawing!\"<br>But his hands would not listen to him. His arms moved by themselves.",
                "The fifth, the sixth, the seventh. The gourds kept splitting. Each time, something came out and carried off a load of Nolbu's property. Nolbu's face grew paler and paler. His clothes were soaked through with sweat.",
                "Out of the eighth gourd came muddy water that flooded the yard. Out of the ninth came dung. The smell was so bad that all the onlookers ran away.",
                "Out of the tenth gourd came all sorts of insects that ate up every grain in the storehouse. Out of the eleventh came a huge snake that went once round the yard and over the wall.",
                "The last one, the twelfth, was left. Nolbu was sitting on the ground in front of it. The storehouse was already empty and the servants had all run off. His wife had taken the children outside the wall.",
                "When the twelfth gourd split, soldiers in armour walked out. The soldiers said nothing at all and took up their tools. Then they began pulling Nolbu's house down. Nobody could stop them.",
                "Tiles came down and posts fell over. The wall crumbled and the storehouse caved in. By sundown, where Nolbu's house had stood, there was only a heap of earth. Not one post was left standing."
            ]
        },
        {
            num: 6,
            title: "The Seed Planted Again",
            art: ["story-06-a.webp", "story-06-b.webp", "story-06-c.webp"],
            artAt: ["standing on the ruins", "just stood outside the wall", "white rice and meat soup"],
            paras: [
                "Nolbu and his family were standing on the ruins of their house. It began to rain. Nobody put so much as a straw cape over their shoulders.",
                "The villagers who had come to watch went home one by one. Not one of them said come to my house. Nolbu had never done anything in that village that would earn him such a word. The rain soaked through his clothes.",
                "At night the rain came down harder. Nolbu's family crouched under the broken wall. The wall was only knee-high.",
                "His wife sobbed.<br>\"Where do we go now?\"<br>Nolbu could not answer. The children clung to their mother's skirt.",
                "Towards dawn Nolbu got up. Then he turned his steps towards the hillside. Water dripped from his clothes.",
                "\"Where are you going?\"<br>\"...To Heungbu.\"<br>His wife caught his sleeve.<br>\"With what face?\"<br>\"It's because I have no face that I'm going.\" His voice was lost in the sound of the rain.",
                "Nolbu walked through the rain. As he walked, the things Heungbu had said to him kept coming back. The rain kept running into his eyes.",
                "Brother, come in. Brother, at least stay and eat. There had not been a speck of resentment in Heungbu's face that day. That face kept coming up in front of him.",
                "Nolbu stopped walking. And for the first time he asked himself a question.<br>'What did I ever do for that man?' It was the first time he had ever asked it.",
                "There was nothing. He had taken his father's property for himself, he had turned his brother out in midwinter with twelve children, and he had let his own wife strike the cheek of a brother who came to borrow one measure of rice. The more he thought, the more his face burned.",
                "Nolbu sat down where he was. Something ran down his face, rain or tears, he could not tell. He stayed like that for a long time.",
                "As the sun came up Nolbu reached Heungbu's gate. He could not find the courage to knock, so he just stood outside the wall. Inside the gate he could hear voices.",
                "Then the gate opened. Heungbu came running out barefoot. The sound of him crossing the threshold was quick.",
                "\"Brother!\"<br>The moment Heungbu saw him he threw his arms around those wet shoulders. He did not care that his own clothes got soaked.",
                "\"I, I heard. I sent people out all night looking. Where have you been?\"<br>Nolbu could not say a word. Heungbu's voice was shaking.",
                "Heungbu brought Nolbu's whole family inside. He had the fire lit, dry clothes brought out, and a meal laid. For the children he brought dry towels and warm water first.",
                "The table came in. It was white rice and meat soup. Nolbu could not pick up his spoon and only looked down at the table. His hands kept shaking.",
                "\"Brother, it's going cold.\"<br>\"...Heungbu.\"<br>\"Yes.\"<br>\"Did I ever once set a table like this for you?\" The room went quiet.",
                "Heungbu smiled.<br>\"When we were small you gave me a ripe persimmon once. You climbed the tree and picked it for me.\"<br>\"Did I do that?\"<br>\"I decided to remember only that.\"",
                "Nolbu buried his face on the table. His shoulders shook hard. Heungbu said nothing and laid a hand on his brother's back. The spoon lay untouched on the table.",
                "From that day Nolbu's family lived at Heungbu's house. Heungbu held out the storehouse key to his brother.<br>\"You keep it.\"<br>Nolbu would not take the key.<br>\"No. That is the very thing I have to learn again.\" Heungbu did not press him.",
                "From that spring Nolbu went out to work in Heungbu's paddies. A man who had spent his life ordering others about put his own hands in the earth for the first time. His palms split and healed over and over. He was first out to the fields every morning.",
                "Nolbu dug a corner of the back yard and planted something. Heungbu asked,<br>\"Brother, what is that?\"<br>\"A gourd seed.\" His hands were still muddy.",
                "Heungbu was startled.<br>\"Brother, not again...\"<br>Nolbu shook his head.<br>\"This time I'm planting it to make dippers. Our village well ought to have a dipper too.\"",
                "Three perfectly ordinary gourds grew on that vine. Nolbu sawed them open, scooped out the insides, dried them in the sun and made dippers. No gold came out, and no silver.",
                "Then he hung one of them by the village well, so that anyone passing could scoop a drink. It was the first thing Nolbu had ever given away for nothing. They say that dipper hung there for many years."
            ]
        }
    ],
    quiz: [
        { q: "Why did Nolbu turn Heungbu out of the house?", choices: ["Heungbu had done something wrong", "He wanted the property for himself", "Their father had told him to"], answer: 1 },
        { q: "What did Heungbu get when he went to ask his brother for rice?", choices: ["One measure of rice", "The gate shut in his face", "A blow on the cheek with a rice paddle"], answer: 2 },
        { q: "What did Heungbu wind the broken leg with?", choices: ["Thread and a splinter of wood", "Straw and a handful of mud", "The pole from his carrying frame"], answer: 0 },
        { q: "What did the swallow bring back the next spring?", choices: ["A lump of gold", "A gourd seed", "A grain of rice"], answer: 1 },
        { q: "What came out of the first gourd?", choices: ["Silk pouring out", "Carpenters to build a house", "A table of white rice"], answer: 2 },
        { q: "Why did Nolbu come to Heungbu's house?", choices: ["To say sorry for what he had done", "To find out how he got rich", "To share some rice with him"], answer: 1 },
        { q: "What did Nolbu do after he broke the swallow's leg?", choices: ["He wound it with thread and a splinter", "He only put it back in the nest", "He set it down in the yard and watched"], answer: 0 },
        { q: "Who came out of Nolbu's first gourd?", choices: ["People with ledgers", "A shaman holding a rite", "Insects eating the grain"], answer: 0 },
        { q: "What came out of Nolbu's last gourd?", choices: ["Soldiers in armour", "A huge snake", "Muddy water"], answer: 0 },
        { q: "What did Nolbu have to do each time a gourd split?", choices: ["Put down the saw", "Call the onlookers together", "Open the storehouse door"], answer: 2 },
        { q: "How did Heungbu treat the brother who came to him?", choices: ["He ran out in his stocking feet to meet him", "He brought up the past first", "He built him a new house"], answer: 0 },
        { q: "What did Nolbu make out of the gourds at the end?", choices: ["A mat", "A straw cape", "Water dippers"], answer: 2 },
        {
            q: "Which reaction to this book does NOT fit?",
            wide: true,
            choices: [
                "Nolbu waited for swallows and then pulled down other people's nests, so greed breaks what belongs to others first.",
                "Heungbu never once mentioned the rice paddle, so keeping quiet can be a way of keeping something safe.",
                "Each time a gourd split Nolbu had to open his storehouse, so what you pile up brings its own bill.",
                "Nolbu took the storehouse key Heungbu held out, so he was the elder brother of that house again."
            ],
            answer: 3
        }
    ],
    /* 단어장 — 그림책은 펼침면마다 묶지만, 소설은 장마다 묶는다.
       쪽은 재어서 나누므로 미리 알 수 없기 때문이다.
       화면에는 그 쪽에 실제로 나온 낱말만 골라 보여 준다(vocabFor). */
    words: {
        "cover": [
            { w: "with no known author", k: "지은이가 알려지지 않은", s: "an old Korean story with no known author" },
            { w: "performed (perform)", k: "공연했다, 불렀다", s: "Singers performed it as pansori" },
            { w: "pansori", k: "판소리", s: "a kind of story-singing" },
            { w: "funniest (funny)", k: "가장 웃긴", s: "It is the funniest of the five great pansori songs." },
            { w: "gourd", k: "박", s: "A gourd is a big round fruit" },
            { w: "by the yard", k: "마당가에", s: "People grew them by the yard" },
            { w: "shell", k: "껍질", s: "dried the shells to make water dippers" },
            { w: "dipper", k: "바가지", s: "dried the shells to make water dippers" }
        ],
        "ch1": [
            { w: "a fair bit of ~", k: "꽤 되는", s: "The family had a fair bit of land" },
            { w: "soft-hearted", k: "마음이 여린", s: "Heungbu was soft-hearted" },
            { w: "rolled up his sleeves (roll up one's sleeves)", k: "팔을 걷어붙였다", s: "rolled up his sleeves for other people first" },
            { w: "mean", k: "못된, 심술궂은", s: "The whole village knew how mean Nolbu was" },
            { w: "paddy bank", k: "논둑", s: "He broke open other people's paddy banks" },
            { w: "drove stakes into ~ (drive a stake)", k: "말뚝을 박았다", s: "drove stakes into good pumpkins" },
            { w: "in mourning", k: "상을 당한", s: "danced at houses in mourning" },
            { w: "ashamed", k: "부끄러운", s: "he was never ashamed of it" },
            { w: "alley", k: "골목", s: "hid in the alleys when he passed" },
            { w: "bedside", k: "머리맡", s: "he called both brothers to his bedside" },
            { w: "share ~ equally", k: "똑같이 나누다", s: "Share the property equally between you" },
            { w: "turn one's back on ~", k: "등을 돌리다", s: "never turn your backs on each other" },
            { w: "break off", k: "말이 끊기다", s: "the words kept breaking off" },
            { w: "closed his eyes (close one's eyes)", k: "눈을 감았다, 숨을 거두었다", s: "the moment their father closed his eyes" },
            { w: "pretended to (pretend)", k: "그런 척했다", s: "Or rather, he pretended to" },
            { w: "storehouse", k: "곳간", s: "hang the storehouse key on his own belt" },
            { w: "a trace of ~", k: "~의 기색", s: "There wasn't a trace of apology in his voice" },
            { w: "take ~ in", k: "알아듣다", s: "Heungbu could not take it in" },
            { w: "the eldest", k: "맏이", s: "the eldest keeps the house" },
            { w: "set up your own (set up)", k: "따로 살림을 차리다", s: "You go out and set up your own" },
            { w: "press ~ any further", k: "더 캐묻다", s: "Heungbu could not press him any further" },
            { w: "worn-out", k: "다 해진", s: "one bundle of worn-out clothes" },
            { w: "not so much as ~", k: "~조차 하지 않다", s: "did not so much as come to the gate" },
            { w: "grudged (grudge)", k: "아까워했다", s: "I grudged them the rice they'd eat" },
            { w: "hillside", k: "산비탈", s: "settled on a hillside far from the village" },
            { w: "millet stalk", k: "수숫대", s: "They wove millet stalks together" },
            { w: "plastered ~ with mud (plaster)", k: "흙을 발랐다", s: "plastered them with mud" },
            { w: "stretch your legs (stretch)", k: "다리를 뻗다", s: "if you stretched your legs your feet went outside" },
            { w: "weeded (weed)", k: "김을 맸다", s: "He weeded other people's paddies" },
            { w: "straw shoes", k: "짚신", s: "wove straw shoes and sold them at the market" },
            { w: "before dawn", k: "동트기 전에", s: "He left before dawn and came home under the stars" },
            { w: "nowhere near enough", k: "어림도 없는", s: "it was nowhere near enough for twelve mouths" },
            { w: "the harvest failed (fail)", k: "흉년이 들었다", s: "That year the harvest failed" },
            { w: "lay awake (lie awake)", k: "뜬눈으로 지새웠다", s: "Heungbu lay awake all that night" },
            { w: "hesitating (hesitate)", k: "망설이며", s: "He stood outside the door a long while, hesitating" },
            { w: "be shamed", k: "창피를 당하다", s: "You'll only be shamed" },
            { w: "swallowed (swallow)", k: "침을 삼켰다", s: "Heungbu swallowed and knocked" },
            { w: "screwed up his face (screw up one's face)", k: "인상을 찌푸렸다", s: "he screwed up his face" },
            { w: "went down on his knees (go down on one's knees)", k: "무릎을 꿇었다", s: "Heungbu went down on his knees" },
            { w: "a measure of rice", k: "쌀 한 되", s: "Lend me just one measure of rice" },
            { w: "hire myself out (hire oneself out)", k: "품을 팔다", s: "even if I have to hire myself out" },
            { w: "eyes narrowed (narrow)", k: "눈이 가늘어졌다", s: "Nolbu's eyes narrowed" },
            { w: "rice paddle", k: "주걱", s: "She had a rice paddle in her hand" },
            { w: "stuck to ~ (stick to)", k: "들러붙었다", s: "Fresh grains of rice were still stuck white to it" },
            { w: "struck ~ on the cheek (strike)", k: "뺨을 후려쳤다", s: "The rice paddle struck Heungbu on the cheek" },
            { w: "peeled ~ off (peel off)", k: "떼어 냈다", s: "peeled that grain off his palm" },
            { w: "tucked ~ inside (tuck)", k: "품에 넣었다", s: "tucked it inside his coat" },
            { w: "turned the other cheek (turn the other cheek)", k: "다른 뺨을 내밀었다", s: "he turned the other cheek toward her" }
        ],
        "ch2": [
            { w: "eaves", k: "처마", s: "Under the eaves of Heungbu's hut a pair of swallows flew in" },
            { w: "chirping (chirp)", k: "지저귀는 소리", s: "Their chirping filled the yard" },
            { w: "clapped their hands (clap)", k: "손뼉을 쳤다", s: "The children clapped their hands" },
            { w: "broke out of (break out of)", k: "깨고 나왔다", s: "five chicks broke out of their eggs" },
            { w: "beak", k: "부리", s: "The sound of yellow beaks opening wide" },
            { w: "insect", k: "벌레", s: "The parent swallows flew in and out all day carrying insects" },
            { w: "left (leave)", k: "놓아 두었다", s: "left them under the eaves" },
            { w: "in an uproar", k: "발칵 뒤집힌", s: "he found the yard in an uproar" },
            { w: "stamping their feet (stamp)", k: "발을 동동 굴렀다", s: "The children were stamping their feet" },
            { w: "wrapped around ~ (wrap around)", k: "칭칭 감겨 있었다", s: "wrapped around below the swallows' nest" },
            { w: "shrieking (shriek)", k: "비명을 질렀다", s: "The chicks were shrieking" },
            { w: "as thick as ~", k: "~만큼 굵은", s: "It was as thick as a grown man's arm" },
            { w: "carrying frame", k: "지게", s: "the pole from his carrying frame" },
            { w: "slid out (slide out)", k: "미끄러져 나갔다", s: "The snake slid out over the wall" },
            { w: "cold sweat", k: "식은땀", s: "Cold sweat ran down Heungbu's back" },
            { w: "commotion", k: "소동", s: "in all that commotion one chick had fallen" },
            { w: "hung broken (hang)", k: "부러진 채 늘어져 있었다", s: "one leg hung broken" },
            { w: "sprawled (sprawl)", k: "널브러졌다", s: "The small body lay sprawled on the bare earth" },
            { w: "sewing basket", k: "반짇고리", s: "took thread out of her sewing basket" },
            { w: "splinter of wood", k: "나뭇조각", s: "a thin splinter of wood against the broken leg" },
            { w: "wound ~ around (wind around)", k: "감았다", s: "carefully wound the thread around it" },
            { w: "holding their breath (hold one's breath)", k: "숨을 죽이고", s: "The children sat around holding their breath" },
            { w: "shaved (shave)", k: "깎았다", s: "He had shaved that splinter thin with his own fingernail" },
            { w: "looked after (look after)", k: "돌보았다", s: "kept the chick in the room and looked after it" },
            { w: "fed (feed)", k: "먹였다", s: "The children caught insects and fed it" },
            { w: "slipped off (slip off)", k: "미끄러져 떨어졌다", s: "It slipped off that ledge more than once" },
            { w: "flock", k: "무리", s: "went along with the flock" },
            { w: "quiet", k: "조용한", s: "Under the eaves it went suddenly quiet" },
            { w: "got through it (get through)", k: "견뎌 냈다", s: "got through it by peeling bark" },
            { w: "bark", k: "나무껍질", s: "by peeling bark and boiling it into porridge" },
            { w: "came pouring out (pour out)", k: "우르르 몰려나왔다", s: "They came pouring out into the yard" },
            { w: "circled (circle)", k: "맴돌았다", s: "One swallow circled over the yard a few times" },
            { w: "dropped (drop)", k: "떨어뜨렸다", s: "dropped something in front of Heungbu" },
            { w: "settled on ~ (settle)", k: "내려앉았다", s: "it settled on the eaves and chirped" },
            { w: "ordinary", k: "보통의", s: "far bigger than any ordinary seed" },
            { w: "limped (limp)", k: "절뚝거렸다", s: "the swallow limped a little on one leg" },
            { w: "fingertip", k: "손가락 끝", s: "the swallow landed on his fingertip" },
            { w: "patted ~ down (pat down)", k: "다독여 눌렀다", s: "He watered it and patted the earth down" },
            { w: "shoot", k: "싹", s: "A shoot came up and the vine ran wild" },
            { w: "ran wild (run wild)", k: "마구 뻗었다", s: "the vine ran wild" },
            { w: "creaked (creak)", k: "삐걱거렸다", s: "The roof creaked under the weight" },
            { w: "saw ~ open (saw)", k: "톱으로 켜다", s: "Saw those open for dippers" }
        ],
        "ch3": [
            { w: "took hold of ~ (take hold of)", k: "마주 잡았다", s: "they took hold of a long saw" },
            { w: "barely managed to ~", k: "겨우 ~했다", s: "the two of them barely managed to roll it down" },
            { w: "set the rhythm (set)", k: "장단을 맞추었다", s: "Heungbu set the rhythm and his wife answered" },
            { w: "boil the inside (boil)", k: "속을 삶다", s: "boil the inside, and sell the shell for a dipper" },
            { w: "caught on ~ (catch on)", k: "~에 걸렸다", s: "The blade caught on the skin of the gourd" },
            { w: "blade", k: "톱날", s: "The blade was halfway in" },
            { w: "halfway in", k: "절반쯤 들어간", s: "The blade was halfway in" },
            { w: "hurt their eyes (hurt)", k: "눈이 부셨다", s: "a light came out of it so bright it hurt their eyes" },
            { w: "let go", k: "손을 놓다", s: "The moment they let go" },
            { w: "split open (split)", k: "쩍 갈라졌다", s: "the gourd split open on its own" },
            { w: "on its own", k: "저절로", s: "the gourd split open on its own" },
            { w: "heaped up (heap up)", k: "수북이 쌓인", s: "white rice heaped up with steam coming off it" },
            { w: "steam", k: "김", s: "with steam coming off it" },
            { w: "swallowing (swallow)", k: "침을 삼키는", s: "You could hear the children swallowing" },
            { w: "eat your fill (eat one's fill)", k: "배불리 먹다", s: "Please eat your fill" },
            { w: "vanished (vanish)", k: "사라졌다", s: "Then it vanished like smoke" },
            { w: "reached for ~ (reach for)", k: "손을 뻗었다", s: "The youngest reached for a bowl first" },
            { w: "until they could not eat any more", k: "배가 터지도록", s: "ate until they could not eat any more" },
            { w: "chewed (chew)", k: "씹었다", s: "The children cried as they chewed" },
            { w: "however much ~", k: "아무리 ~해도", s: "However much they ate, it never went down" },
            { w: "trembled (tremble)", k: "떨렸다", s: "This time their hands trembled" },
            { w: "came pouring out (pour out)", k: "쏟아져 나왔다", s: "silk came pouring out of it" },
            { w: "silk", k: "비단", s: "Red silk, blue silk, yellow silk" },
            { w: "rolled out (roll out)", k: "굴러 펼쳐졌다", s: "rolled out like waves and covered the yard" },
            { w: "tumbled about (tumble)", k: "뒹굴었다", s: "The children tumbled about on top of it" },
            { w: "dazzled (dazzle)", k: "눈이 부시게 했다", s: "The colours were so lovely they dazzled the eyes" },
            { w: "hemp", k: "삼베", s: "After the silk came cotton cloth and hemp" },
            { w: "padded clothes", k: "솜옷", s: "wore padded clothes for the first time" },
            { w: "carpenter", k: "목수", s: "Out of the third gourd came carpenters" },
            { w: "adze", k: "자귀", s: "Men with saws and adzes walked out" },
            { w: "bowed (bow)", k: "절했다", s: "walked out one after another and bowed to Heungbu" },
            { w: "pulled down (pull down)", k: "헐었다", s: "The carpenters pulled down the old hut on the spot" },
            { w: "on the spot", k: "그 자리에서", s: "pulled down the old hut on the spot" },
            { w: "raising the posts (raise)", k: "기둥을 세우기", s: "Raising the posts, setting the main beam" },
            { w: "main beam", k: "대들보", s: "setting the main beam and laying the tiles" },
            { w: "tile", k: "기와", s: "laying the tiles took three days" },
            { w: "evening glow", k: "노을", s: "The tiles shone red in the evening glow" },
            { w: "too bright to look at", k: "눈이 부셔 볼 수 없는", s: "The sunlight off them was too bright to look at" },
            { w: "darkened (darken)", k: "어두워졌다", s: "If anything his face darkened" },
            { w: "bind up ~", k: "싸매다", s: "All I ever did was bind up one swallow's leg" },
            { w: "shared out (share out)", k: "나눠 주었다", s: "where people were hungry and shared out rice" },
            { w: "crushed by debt (crush)", k: "빚에 짓눌린", s: "Where a house was crushed by debt" },
            { w: "did not know what to do with themselves", k: "어쩔 줄 몰라 했다", s: "The people he helped did not know what to do with themselves" },
            { w: "pay ~ back (pay back)", k: "갚다", s: "He never once told anyone to pay him back" }
        ],
        "ch4": [
            { w: "snorted (snort)", k: "코웃음 쳤다", s: "He heard it and snorted" },
            { w: "die down", k: "잦아들다", s: "the story did not die down" },
            { w: "in the end", k: "결국", s: "In the end Nolbu set off for his brother's house" },
            { w: "set off (set off)", k: "길을 나섰다", s: "Nolbu set off for his brother's house" },
            { w: "flashed (flash)", k: "번쩍였다", s: "The tiles flashed in the sunlight" },
            { w: "kicked ~ open (kick open)", k: "발로 차서 열었다", s: "Nolbu kicked the gate open" },
            { w: "hinge", k: "돌쩌귀", s: "The gate hinges nearly came off" },
            { w: "in his stocking feet", k: "버선발로", s: "Heungbu ran out in his stocking feet" },
            { w: "brought up (bring up)", k: "꺼냈다", s: "He never once brought up being struck on the cheek" },
            { w: "return the greeting", k: "인사를 받다", s: "Nolbu did not even return the greeting" },
            { w: "sack", k: "가마니", s: "He counted the sacks of rice" },
            { w: "tell me straight", k: "바른대로 말해라", s: "Tell me straight" },
            { w: "steal", k: "훔치다", s: "Did you steal it" },
            { w: "flew open (fly open)", k: "휘둥그레졌다", s: "Nolbu's eyes flew open" },
            { w: "cracked (crack)", k: "갈라졌다", s: "His voice cracked" },
            { w: "without leaving anything out (leave out)", k: "하나도 빼지 않고", s: "Heungbu told him everything without leaving anything out" },
            { w: "counted on his fingers (count on one's fingers)", k: "손가락으로 꼽았다", s: "Nolbu counted on his fingers while he listened" },
            { w: "abruptly", k: "벌떡", s: "Then he stood up abruptly" },
            { w: "no longer", k: "더 이상 ~않다", s: "was no longer going into his ears" },
            { w: "swallowing hard (swallow)", k: "침을 꿀꺽 삼키며", s: "Nolbu kept swallowing hard" },
            { w: "gone to the warm south (go)", k: "따뜻한 강남으로 떠났다", s: "the swallows had all gone to the warm south long ago" },
            { w: "felt like three years (feel)", k: "삼 년 같았다", s: "each day felt like three years to Nolbu" },
            { w: "in advance", k: "미리", s: "build swallows' nests under the eaves in advance" },
            { w: "wondered (wonder)", k: "궁금해했다", s: "The servants wondered what on earth it was for" },
            { w: "knocked down (knock down)", k: "헐어 냈다", s: "knocked down the swallow nests at other people's houses" },
            { w: "strange", k: "수상한", s: "The villagers thought it was strange" },
            { w: "raised chicks (raise)", k: "새끼를 길렀다", s: "The swallow couple raised chicks" },
            { w: "a dozen times a day", k: "하루에도 열두 번", s: "climbed to look in a dozen times a day" },
            { w: "creaked (creak)", k: "삐걱거렸다", s: "He did not care that the ladder creaked" },
            { w: "fluttered (flutter)", k: "파닥거렸다", s: "The chick fluttered in his hand" },
            { w: "hesitated (hesitate)", k: "망설였다", s: "Nolbu hesitated for a moment" },
            { w: "gripped (grip)", k: "꽉 쥐었다", s: "The chick gripped his finger tight" },
            { w: "shut his eyes hard (shut)", k: "눈을 질끈 감았다", s: "But then he shut his eyes hard" },
            { w: "bear it (bear)", k: "참아라", s: "Bear it a moment" },
            { w: "a snap", k: "뚝 하는 소리", s: "There was a snap" },
            { w: "in such a hurry", k: "너무 서둘러서", s: "His hands were in such a hurry" },
            { w: "knot", k: "매듭", s: "the knot would not tie properly" },
            { w: "slipping (slip)", k: "자꾸 미끄러졌다", s: "The thread kept slipping" },
            { w: "pressed his hands together (press together)", k: "두 손을 모았다", s: "put the chick back in the nest and pressed his hands together" },
            { w: "pay me back (pay back)", k: "갚아라", s: "You must pay me back next spring" },
            { w: "shouted after them (shout after)", k: "뒤에 대고 소리쳤다", s: "looking up at the sky and shouted after them" }
        ],
        "ch5": [
            { w: "pouring out (pour out)", k: "쏟아져 나오는", s: "They were dreams of gold pouring out" },
            { w: "skipped breakfast (skip)", k: "아침을 걸렀다", s: "He skipped breakfast and only watched the sky" },
            { w: "limped badly (limp)", k: "심하게 절뚝거렸다", s: "It limped badly on one leg" },
            { w: "shot straight up (shoot up)", k: "쏜살같이 솟구쳤다", s: "shot straight up into the sky" },
            { w: "snatched ~ up (snatch up)", k: "냉큼 집었다", s: "Nolbu snatched it up" },
            { w: "barely fitted (fit)", k: "겨우 들어갔다", s: "It barely fitted in two hands" },
            { w: "danced on the spot (dance)", k: "그 자리에서 춤췄다", s: "Nolbu danced on the spot" },
            { w: "dug (dig)", k: "팠다", s: "Nolbu dug the middle of the yard" },
            { w: "guard", k: "지키다", s: "He had the servants guard it all night" },
            { w: "in case ~", k: "~할까 봐", s: "He even raised the wall in case somebody dug it up" },
            { w: "fell asleep on watch (fall asleep)", k: "지키다 잠들었다", s: "One servant fell asleep on watch" },
            { w: "was beaten for it (beat)", k: "매를 맞았다", s: "fell asleep on watch and was beaten for it" },
            { w: "went over the wall (go over)", k: "담을 넘었다", s: "It covered the roof, went over the wall" },
            { w: "so thick that ~", k: "너무 우거져서", s: "The leaves were so thick the yard was dark even at noon" },
            { w: "tilted (tilt)", k: "기울었다", s: "The wall tilted under the weight of the vine" },
            { w: "three times as many", k: "세 배나 되는", s: "Three times as many as Heungbu's" },
            { w: "taller than a person", k: "사람 키보다 큰", s: "Every one of them was taller than a person" },
            { w: "stroked (stroke)", k: "쓰다듬었다", s: "went out at night as well and stroked the gourds" },
            { w: "carried a lamp out (carry out)", k: "등불을 들고 나갔다", s: "Every night he carried a lamp out and counted them" },
            { w: "something is not right", k: "어딘가 이상하다", s: "something is not right about this" },
            { w: "good fortune", k: "복", s: "good fortune is rolling in and you talk like that" },
            { w: "at last", k: "드디어", s: "At last the day came to saw the gourds" },
            { w: "called ~ together (call together)", k: "불러 모았다", s: "Nolbu called the villagers together as well" },
            { w: "laid mats out (lay out)", k: "자리를 깔았다", s: "He even laid mats out in the yard" },
            { w: "raised his voice (raise one's voice)", k: "목청을 높였다", s: "Nolbu took up the saw and raised his voice" },
            { w: "the richest man in the land", k: "천하 제일의 부자", s: "let me be the richest man in the land" },
            { w: "onlooker", k: "구경꾼", s: "The onlookers climbed up and sat on the wall" },
            { w: "craned their necks (crane one's neck)", k: "목을 뺐다", s: "The onlookers craned their necks to see" },
            { w: "came pouring out (pour out)", k: "쏟아져 나왔다", s: "people came pouring out" },
            { w: "ledger", k: "장부", s: "They had ledgers in their hands" },
            { w: "pay your debts (pay)", k: "빚을 갚아라", s: "Pay your debts" },
            { w: "clerk", k: "아전, 관아 서리", s: "dressed like a clerk from the government office" },
            { w: "spoiled (spoil)", k: "못 쓰게 만들었다", s: "the pumpkins you spoiled with stakes" },
            { w: "hand over", k: "내주다", s: "Nolbu had to hand over a chest of coins" },
            { w: "murmured (murmur)", k: "웅성거렸다", s: "The onlookers murmured" },
            { w: "troupe of players", k: "사당패", s: "Out of the second gourd came a troupe of players" },
            { w: "took payment (take payment)", k: "삯을 받았다", s: "then took payment for playing" },
            { w: "gong", k: "꽹과리, 징", s: "The gongs did not stop all night" },
            { w: "shaman", k: "무당", s: "came a shaman who held a rite" },
            { w: "rite", k: "굿", s: "who held a rite and took payment for the rite" },
            { w: "offering", k: "시주", s: "came an old monk who took an offering" },
            { w: "by the day", k: "나날이", s: "The storehouse emptied by the day" },
            { w: "would not listen to him", k: "말을 듣지 않았다", s: "But his hands would not listen to him" },
            { w: "by themselves", k: "저절로", s: "His arms moved by themselves" },
            { w: "carried off (carry off)", k: "실어 갔다", s: "something came out and carried off a load" },
            { w: "soaked through (soak through)", k: "흠뻑 젖었다", s: "His clothes were soaked through with sweat" },
            { w: "flooded (flood)", k: "잠기게 했다", s: "muddy water that flooded the yard" },
            { w: "dung", k: "똥거름", s: "Out of the ninth came dung" },
            { w: "ate up (eat up)", k: "다 먹어 치웠다", s: "insects that ate up every grain" },
            { w: "sitting on the ground (sit)", k: "주저앉아 있었다", s: "Nolbu was sitting on the ground in front of it" },
            { w: "run off (ran off)", k: "달아났다", s: "the servants had all run off" },
            { w: "armour", k: "갑옷", s: "soldiers in armour walked out" },
            { w: "took up their tools (take up)", k: "연장을 들었다", s: "The soldiers said nothing at all and took up their tools" },
            { w: "caved in (cave in)", k: "무너져 내렸다", s: "the storehouse caved in" },
            { w: "a heap of earth", k: "흙더미", s: "there was only a heap of earth" }
        ],
        "ch6": [
            { w: "the ruins", k: "무너진 자리, 폐허", s: "standing on the ruins of their house" },
            { w: "straw cape", k: "도롱이", s: "put so much as a straw cape over their shoulders" },
            { w: "one by one", k: "하나둘씩", s: "went home one by one" },
            { w: "earn", k: "얻다", s: "anything in that village that would earn him such a word" },
            { w: "soaked through (soak through)", k: "흠뻑 적셨다", s: "The rain soaked through his clothes" },
            { w: "crouched (crouch)", k: "웅크렸다", s: "Nolbu's family crouched under the broken wall" },
            { w: "knee-high", k: "무릎 높이의", s: "The wall was only knee-high" },
            { w: "sobbed (sob)", k: "흐느꼈다", s: "His wife sobbed" },
            { w: "clung to ~ (cling to)", k: "매달렸다", s: "The children clung to their mother's skirt" },
            { w: "towards dawn", k: "새벽녘에", s: "Towards dawn Nolbu got up" },
            { w: "turned his steps (turn one's steps)", k: "발길을 옮겼다", s: "he turned his steps towards the hillside" },
            { w: "caught his sleeve (catch)", k: "소매를 붙잡았다", s: "His wife caught his sleeve" },
            { w: "with what face", k: "무슨 낯으로", s: "With what face" },
            { w: "kept coming back (keep coming back)", k: "자꾸 떠올랐다", s: "the things Heungbu had said to him kept coming back" },
            { w: "a speck of ~", k: "티끌만큼의", s: "There had not been a speck of resentment" },
            { w: "resentment", k: "원망", s: "a speck of resentment in Heungbu's face" },
            { w: "for the first time", k: "난생처음", s: "for the first time he asked himself a question" },
            { w: "turned ~ out (turn out)", k: "내쫓았다", s: "he had turned his brother out in midwinter" },
            { w: "midwinter", k: "한겨울", s: "turned his brother out in midwinter" },
            { w: "borrow", k: "빌리다", s: "a brother who came to borrow one measure of rice" },
            { w: "burned (burn)", k: "화끈거렸다", s: "the more his face burned" },
            { w: "where he was", k: "그 자리에", s: "Nolbu sat down where he was" },
            { w: "ran down his face (run down)", k: "흘러내렸다", s: "Something ran down his face" },
            { w: "find the courage", k: "용기를 내다", s: "He could not find the courage to knock" },
            { w: "barefoot", k: "맨발로", s: "Heungbu came running out barefoot" },
            { w: "threshold", k: "문지방", s: "The sound of him crossing the threshold was quick" },
            { w: "threw his arms around ~ (throw one's arms around)", k: "와락 껴안았다", s: "he threw his arms around those wet shoulders" },
            { w: "did not care that ~", k: "개의치 않았다", s: "He did not care that his own clothes got soaked" },
            { w: "sent people out (send out)", k: "사람을 풀었다", s: "I sent people out all night looking" },
            { w: "shaking (shake)", k: "떨렸다", s: "Heungbu's voice was shaking" },
            { w: "had the fire lit", k: "불을 지피게 했다", s: "He had the fire lit, dry clothes brought out" },
            { w: "a meal laid (lay)", k: "차려진 밥상", s: "dry clothes brought out, and a meal laid" },
            { w: "going cold (go cold)", k: "식어 가는", s: "it's going cold" },
            { w: "set a table (set)", k: "상을 차렸다", s: "Did I ever once set a table like this for you" },
            { w: "ripe persimmon", k: "홍시", s: "you gave me a ripe persimmon once" },
            { w: "decided to remember (decide)", k: "기억하기로 했다", s: "I decided to remember only that" },
            { w: "buried his face (bury)", k: "얼굴을 묻었다", s: "Nolbu buried his face on the table" },
            { w: "held out (hold out)", k: "내밀었다", s: "Heungbu held out the storehouse key" },
            { w: "press him (press)", k: "다그쳤다", s: "Heungbu did not press him" },
            { w: "ordering others about (order about)", k: "남을 부리는", s: "A man who had spent his life ordering others about" },
            { w: "split and healed (split)", k: "터지고 아물었다", s: "His palms split and healed over and over" },
            { w: "back yard", k: "뒤꼍", s: "Nolbu dug a corner of the back yard" },
            { w: "scooped out (scoop out)", k: "속을 파냈다", s: "sawed them open, scooped out the insides" },
            { w: "for nothing", k: "거저", s: "the first thing Nolbu had ever given away for nothing" },
            { w: "scoop a drink (scoop)", k: "물을 떠 마시다", s: "so that anyone passing could scoop a drink" }
        ],
        "after": [
            { w: "was written down (write down)", k: "글로 옮겨졌다", s: "was written down as The Tale of Heungbu" },
            { w: "in time with ~", k: "~에 맞춰", s: "it is sung in time with the sawing" },
            { w: "on its own", k: "따로", s: "it is also called the Gourd Song on its own" },
            { w: "runs so long (run)", k: "유난히 길다", s: "the gourd-sawing runs so long in this book" },
            { w: "turned upside down (turn upside down)", k: "뒤집힌", s: "with the ending turned upside down" },
            { w: "survives (survive)", k: "전해진다", s: "A tale about a man of Silla called Bangi survives" },
            { w: "story shape", k: "이야기 틀", s: "It is a very old story shape" },
            { w: "invented (invent)", k: "지어낸", s: "The gourd is not invented" },
            { w: "the commonest, cheapest thing", k: "가장 흔하고 값없는 것", s: "out of the commonest, cheapest thing there was" },
            { w: "paying back a kindness (pay back)", k: "은혜를 갚는", s: "A swallow paying back a kindness" },
            { w: "on purpose", k: "일부러", s: "breaks the swallow's leg on purpose" },
            { w: "the coldest place", k: "가장 서늘한 대목", s: "is the coldest place in this story" },
            { w: "strip him of everything (strip)", k: "모조리 빼앗다", s: "strip him of everything" },
            { w: "with empty hands", k: "빈손으로", s: "Heungbu went out with empty hands" },
            { w: "quietly shows (show)", k: "조용히 보여 준다", s: "This story quietly shows" },
            { w: "wipe him out (wipe out)", k: "없애 버리다", s: "Wipe him out, or strip him bare" },
            { w: "start again (start)", k: "다시 시작하다", s: "strip him bare and let him start again" },
            { w: "bowed his head (bow one's head)", k: "고개를 숙였다", s: "he only bowed his head because he had nothing left" },
            { w: "for nothing", k: "헛된 일", s: "would what Heungbu did have been for nothing" },
            { w: "a comfort", k: "위안", s: "It is a comfort to be told" }
        ]
    },
    afterword: {
        title: 'After Reading',
        emoji: '🐦',
        art: ['end.webp'],
        paras: [
            "This story began as a song too. Heungbo-ga, sung as pansori, was written down as The Tale of Heungbu. It is still one of the five pansori pieces sung today.",
            "The best-known part of Heungbo-ga is the sawing of the gourds. Because it is sung in time with the sawing, it is also called the Gourd Song on its own. That is the \"saw away, saw away\" you heard. The reason the gourd-sawing runs so long in this book, with so much repeating, is that it was once a song.",
            "A story about two brothers, one good and one bad, with the ending turned upside down, is not only ours. A tale about a man of Silla called Bangi survives in a Chinese book, and it has brothers in it, and a seed, and gold and silver. Mongolia has a close one too. It is a very old story shape, and it went a long way.",
            "The gourd is not invented. In the old days people grew gourds by the yard, sawed the fruit and made dippers out of the shells. Every poor house had one. The reason this story has treasure come out of a gourd is that it wanted the treasure to come out of the commonest, cheapest thing there was.",
            "The story says the swallows go to Gangnam. Gangnam means the land south of the Yangtze River in China, which was as far south as the old storytellers knew. Real swallows go much further, all the way to Southeast Asia, and come back to the same eaves the next spring. That part is not invented.",
            "A swallow paying back a kindness is a common shape as well. Stories where you save a hurt animal and it comes back to repay you are everywhere in the world. What is different here is how it pays. It gives one seed. It does pay you back, but it does not put the thing in your hand. You have to plant it, grow it and saw it open before you get anything.",
            "The part where Nolbu breaks the swallow's leg on purpose is the coldest place in this story. He copied exactly what Heungbu did and got the opposite result. Why the same act came out differently is what the whole story is about.",
            "In the older version far more comes out of Nolbu's gourds. Debt collectors and pallbearers and shamans and troupes of players come out one after another and strip him of everything. Each time one comes out, Nolbu tears something down to pay, and then he saws the next gourd anyway. Not being able to stop is this man's sickness.",
            "This is a story about money as well. Nolbu was left the fields and Heungbu went out with empty hands. Heungbu is not poor because he is lazy. He went out before dawn and came home under the stars and he was still poor. This story quietly shows that \"work hard and you will do well\" is not always true.",
            "In the late Joseon period, when this story was being made, that happened all the time. More and more households gave everything to the eldest son and sent the younger ones out empty-handed. There was a Heungbu in every village. Those were the people who laughed while they listened to this.",
            "Look again at the part where the sister-in-law strikes him with the rice paddle. Heungbu turns the other cheek not because he is good. It is because of the grain of rice stuck to it. One more blow means one more grain. It is a funny part, and after you laugh you do not feel good. Pansori is very good at making places like that.",
            "It is worth noticing that the ending does not kill Nolbu. He is punished, but he is alive, and Heungbu takes him in. Old stories usually deal with a bad person in one of two ways. Wipe him out, or strip him bare and let him start again. This story chose the second.",
            "Even so, people have argued about that ending for a long time. Whether Nolbu was truly sorry, or whether he only bowed his head because he had nothing left, the story does not tell us.",
            "Heungbu did not mend the swallow's leg hoping to be paid. And he was paid. If nothing at all had happened, would what Heungbu did have been for nothing?",
            "Why was Nolbu punished? For breaking the swallow's leg, for turning his brother out, or for copying a kindness while hoping to be paid? Decide which of the three is the worst.",
            "Would this story have lasted if Heungbu had not become rich? It is a comfort to be told that a good person is bound to do well. Whether that is really so is another matter. Think about why the story tells us so."
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
