const BOOK_TITLE = "콩쥐 팥쥐";

const CHAPTER_LABEL = n => (LANG === 'en' ? `Chapter ${n} · ` : `${n}장 · `);

const CHAPTERS = [
    {
        num: 1,
        title: "새어머니와 검은 소",
        art: ["story-01-a.webp", "story-01-b.webp", "story-01-c.webp"],
        artAt: ["밥상이 두 개 차려졌습니다", "콩쥐는 자갈밭에 엎드려 나무 괭이를 내리찍었습니다", "산 쪽에서 무언가 걸어 내려왔습니다"],
        paras: [
            "옛날 전라도 전주 고을에 최만춘이라는 사람이 살았습니다. 늦게 얻은 딸이 하나 있었는데 이름을 콩쥐라 하였습니다. 집은 넉넉하지 않았지만 부부 사이가 좋았습니다.",
            "콩쥐가 태어난 지 백일 만에 어머니가 세상을 떠났습니다. 아버지는 딸을 업고 다니며 젖동냥을 하여 길렀습니다. 동네 아낙들이 번갈아 젖을 물려 주었습니다.",
            "콩쥐는 손끝이 야무지고 마음이 고왔습니다. 예닐곱 살에 벌써 밥을 짓고 빨래를 했습니다. 이웃들이 혀를 내둘렀습니다.<br>\"어미 없이 자란 아이가 저리 반듯하기도 어렵지.\" 칭찬을 들어도 콩쥐는 늘 고개를 숙였습니다.",
            "콩쥐가 열 살이 되던 해, 아버지가 새 아내를 맞았습니다. 배 씨라는 여인이었는데, 앞서 낳은 딸 하나를 데리고 들어왔습니다. 그 아이의 이름이 팥쥐였습니다. 팥쥐는 콩쥐보다 한 살이 아래였습니다.",
            "혼례를 올리던 날, 배 씨는 콩쥐의 손을 잡고 눈물까지 흘렸습니다.<br>\"이제 내가 네 어미다. 서럽게 하지 않으마.\"<br>콩쥐는 그 말이 고마워 밤새 잠을 이루지 못했습니다. 배 씨의 손이 어찌나 따뜻하던지요.",
            "그러나 그 말은 아버지가 듣는 자리에서만 살아 있었습니다. 아버지만 그것을 끝내 알지 못했습니다.",
            "아버지가 장에 나간 첫날부터 배 씨의 얼굴이 달라졌습니다. 콩쥐에게 부엌일을 몽땅 맡기고, 팥쥐에게는 손끝 하나 까딱하지 않게 했습니다. 문지방을 넘는 소리부터 달랐습니다. 팥쥐는 해가 중천에 뜨도록 이불 속에 있었습니다.",
            "\"콩쥐야, 물 길어라.\"<br>\"콩쥐야, 불 때라.\"<br>\"콩쥐야, 빨래하고 나서 마당도 쓸어라.\"<br>부르는 소리가 하루에도 백 번은 되었습니다. 콩쥐는 한 번도 대답을 미룬 적이 없었습니다.",
            "밥상이 두 개 차려졌습니다. 안방에는 흰쌀밥과 고깃국이 들어가고, 부엌에는 식은 보리밥 한 그릇이 남았습니다. 콩쥐는 그 밥을 부뚜막에 서서 먹었습니다.",
            "팥쥐는 어미보다 더했습니다. 일부러 마당에 물을 엎지르고는 콩쥐를 불렀습니다.<br>\"이것 좀 봐라. 네가 흘렸지?\"<br>\"내가 흘리지 않았어.\"<br>\"어머니! 콩쥐가 물을 엎지르고 거짓말해요!\" 팥쥐는 그때마다 뒤에서 웃었습니다.",
            "그때마다 배 씨는 콩쥐의 종아리를 때렸습니다. 콩쥐는 울지 않았습니다. 울면 아버지가 아실까 봐 걱정되었기 때문입니다. 종아리에 자국이 가실 날이 없었습니다. 아버지가 돌아오는 날이면 종아리 자국을 치마로 가렸습니다.",
            "아버지가 돌아오면 배 씨는 다시 다정한 얼굴이 되었습니다.<br>\"우리 콩쥐가 오늘도 어찌나 부지런한지요.\"<br>아버지는 그 말에 흐뭇해했고, 콩쥐는 아무 말도 하지 않았습니다. 아버지는 장에 다니느라 집을 자주 비웠습니다.",
            "콩쥐가 열두 살이 되던 봄이었습니다. 배 씨가 두 아이를 마당에 세워 놓고 괭이를 하나씩 내주었습니다. 아직 아침 이슬도 마르지 않은 때였습니다.",
            "\"오늘은 밭을 갈고 오너라. 다 갈기 전에는 들어올 생각 마라.\" 해가 아직 산머리에 걸려 있었습니다.",
            "팥쥐가 받은 것은 날이 시퍼렇게 선 쇠 괭이였습니다. 콩쥐가 받은 것은 나무를 깎아 만든 괭이였습니다. 자루도 팥쥐 것은 매끈했고 콩쥐 것은 거칠었습니다.",
            "밭도 달랐습니다. 팥쥐에게 준 것은 집 앞 모래밭이었습니다. 콩쥐에게 준 것은 산 밑 자갈밭이었습니다. 어른도 하루에 절반을 갈지 못하는 밭이었습니다. 돌이 어른 주먹만 했습니다.",
            "팥쥐는 모래밭을 한 시간 만에 다 갈고 돌아와 낮잠을 잤습니다. 돌아오면서 콩쥐 밭 쪽을 힐끔 보고 웃었습니다.",
            "콩쥐는 자갈밭에 엎드려 나무 괭이를 내리찍었습니다. 자갈에 부딪힐 때마다 손아귀가 울렸습니다. 몇 고랑 못 가서 괭이 날이 뚝 부러지고 말았습니다. 손바닥이 금세 부르텄습니다.",
            "콩쥐는 부러진 괭이를 들고 밭 가운데 주저앉았습니다. 그제야 눈물이 났습니다. 해는 벌써 머리 위에 있었습니다.",
            "\"이걸로 어떻게 저 밭을 다 갈아내나?\" 밭은 아직 반의반도 갈지 못했습니다.",
            "그때 산 쪽에서 무언가 걸어 내려왔습니다. 콩쥐가 고개를 들어 보니 검은 소 한 마리였습니다. 목에 고삐도 없고 코뚜레<span class=\"gloss\">(소의 코에 꿰어 끄는 고리)</span>도 없는 소였습니다. 털이 윤이 나고 뿔이 반듯한 소였습니다.",
            "소는 콩쥐 앞으로 와서 크고 검은 눈으로 한참을 들여다보았습니다. 그러고는 밭으로 들어가 앞발로 땅을 갈기 시작했습니다. 콩쥐는 무섭다는 생각이 들지 않았습니다. 숨소리가 따뜻했습니다.",
            "자갈이 튀어 오르고 흙이 뒤집혔습니다. 소가 한 바퀴를 돌 때마다 밭 한 고랑이 반듯하게 갈렸습니다. 해가 기울기 전에 밭이 다 갈렸습니다. 콩쥐는 밭둑에 서서 그 모습을 지켜보았습니다.",
            "콩쥐가 일어나 소에게 절을 했습니다.<br>\"고맙습니다. 그런데 어느 댁 소인지요.\"<br>소는 대답 대신 입에 물고 온 과일 몇 알을 콩쥐 앞에 떨어뜨렸습니다. 처음 보는 붉은 과일이었습니다. 소의 발자국이 밭둑에 또렷했습니다. 콩쥐가 그것을 주워 드는 사이에 소는 산으로 돌아갔습니다."
        ]
    },
    {
        num: 2,
        title: "밑 빠진 독과 참새 떼",
        art: ["story-02-a.webp", "story-02-b.webp", "story-02-c.webp"],
        artAt: ["독 밑바닥에 주먹만 한 구멍이 뚫려 있었습니다", "두꺼비는 독 안으로 기어 들어가", "수백 마리가 마당으로 내려앉았습니다"],
        paras: [
            "그해 가을, 마을 큰집에서 잔치가 열렸습니다. 온 마을 사람이 초대를 받았습니다. 떡을 치는 소리가 마을 어귀까지 들렸습니다.",
            "배 씨는 팥쥐에게 새 옷을 입히고 머리를 곱게 땋아 주었습니다. 콩쥐는 부엌에 서서 그 모습을 보고 있었습니다. 팥쥐는 거울 앞에서 몇 번이나 돌아보았습니다. 콩쥐의 옷은 소매가 짧아져 있었습니다.",
            "\"어머니, 저도 가고 싶습니다.\"<br>배 씨가 돌아보았습니다.<br>\"가고 싶으면 가려무나. 다만 집안일은 다 하고 가야지.\" 배 씨의 입가에 웃음이 스쳤습니다. 콩쥐의 손에는 아직 물기가 마르지 않았습니다.",
            "\"무엇을 하면 됩니까.\"<br>\"마당의 저 독에 물을 가득 채워 놓아라. 그것만 하면 된다.\" 마당 한쪽에 커다란 독이 놓여 있었습니다.",
            "콩쥐는 얼른 물동이를 이었습니다. 우물을 열 번이나 오갔습니다. 그런데 아무리 부어도 독이 차지 않았습니다. 물동이가 어깨를 짓눌렀습니다.",
            "이상해서 손을 넣어 보니 독 밑바닥에 주먹만 한 구멍이 뚫려 있었습니다. 물은 붓는 족족 땅으로 새어 나갔습니다. 구멍 둘레의 흙이 파여 있었습니다. 누가 손을 댄 자국이 그대로 남아 있었습니다.",
            "콩쥐는 그 자리에 주저앉았습니다. 대문 밖에서 배 씨와 팥쥐가 웃는 소리가 들려왔습니다. 두 사람은 이미 잔칫집으로 떠난 뒤였습니다. 마당에 물이 흥건했습니다.",
            "해가 뉘엿뉘엿 기울었습니다. 콩쥐는 그래도 물동이를 다시 이었습니다. 붓고 새고, 붓고 새고를 되풀이했습니다. 팔이 저리고 다리가 후들거렸습니다. 치맛자락이 다 젖고 어깨에 붉은 자국이 났습니다.",
            "그때 담 밑에서 무언가 뒤뚱뒤뚱 기어 나왔습니다. 커다란 두꺼비 한 마리였습니다. 등이 울퉁불퉁한 늙은 두꺼비였습니다.",
            "두꺼비가 콩쥐를 올려다보며 말했습니다.<br>\"내가 저 구멍을 막아 주마.\" 목소리가 낮고 느렸습니다.",
            "두꺼비는 독 안으로 기어 들어가 밑바닥 구멍 위에 배를 딱 붙이고 엎드렸습니다.<br>\"이제 부어라.\" 몸으로 구멍을 꽉 막은 것이었습니다.",
            "콩쥐가 물을 붓자 이번에는 새지 않았습니다. 열 동이를 붓자 독이 가득 찼습니다. 두꺼비의 등이 차가웠습니다. 콩쥐가 두꺼비를 꺼내 주며 물었습니다.<br>\"어찌 저를 도우십니까.\"<br>\"지난여름 네가 나를 마당에서 밟지 않고 비켜 갔다.\"",
            "콩쥐가 옷을 갈아입고 나서려는데 대문이 열렸습니다. 배 씨가 되돌아온 것입니다. 콩쥐의 가슴이 철렁했습니다.",
            "독이 가득 찬 것을 본 배 씨의 얼굴이 굳었습니다. 그러나 곧 아무렇지 않은 척 말했습니다.<br>\"참, 한 가지를 깜빡했구나. 곳간에 벼 석 섬<span class=\"gloss\">(한 섬은 어른이 지기 힘든 만큼의 곡식)</span>이 있다. 그것을 다 찧어 놓고 오너라.\" 말끝이 유난히 부드러웠습니다. 배 씨는 콩쥐의 얼굴을 보지 않고 말했습니다.",
            "\"석 섬을요? 오늘 안에요?\"<br>\"그럼 하지 말든가. 대신 잔치에도 오지 마라.\" 배 씨는 뒤도 돌아보지 않았습니다.",
            "배 씨는 그 말만 남기고 다시 나갔습니다.",
            "곳간 문을 열어 보니 벼가 산더미처럼 쌓여 있었습니다. 혼자서는 사흘이 걸려도 못 할 일이었습니다. 문턱에 발을 들여놓기도 어려울 지경이었습니다.",
            "콩쥐는 절구를 끌어다 놓고 벼를 한 바가지 부었습니다. 절굿공이<span class=\"gloss\">(절구에 넣은 곡식을 찧는 방망이)</span>가 어찌나 무거운지 두 손으로 겨우 들었습니다. 절구가 콩쥐 키만 했습니다.",
            "쿵. 쿵. 쿵.<br>스무 번을 찧고 나니 팔이 떨어져 나갈 것 같았습니다. 그런데 껍질을 벗긴 쌀은 겨우 한 줌이었습니다. 이마에서 땀이 뚝뚝 떨어졌습니다. 절굿공이가 손에서 자꾸 미끄러졌습니다. 콩쥐는 두 손에 침을 뱉어 다시 잡았습니다.",
            "콩쥐는 절굿공이를 놓고 마당에 주저앉았습니다.<br>\"안 되겠구나.\" 손바닥이 다 까졌습니다.",
            "그때 하늘이 갑자기 어두워졌습니다. 콩쥐가 올려다보니 구름이 아니었습니다. 참새 떼였습니다. 짹짹거리는 소리가 온 하늘을 덮었습니다.",
            "수백 마리가 마당으로 내려앉았습니다. 참새들은 벼 무더기 위에 앉아 부리로 껍질을 벗기기 시작했습니다. 마당이 참새로 온통 덮였습니다.",
            "짹짹거리는 소리와 부리 소리가 뒤섞여 온 마당이 시끄러웠습니다. 참새들은 껍질만 골라 벗기고 쌀은 한 톨도 물어 가지 않았습니다. 콩쥐는 그 자리에 서서 보고만 있었습니다.",
            "한 시간이 채 못 되어 벼 석 섬이 하얀 쌀이 되었습니다. 참새들이 한꺼번에 날아오르며 지붕 위를 한 바퀴 돌았습니다.<br>콩쥐가 마당 한가운데에 서서 손을 흔들었습니다.<br>\"고맙습니다! 고맙습니다!\""
        ]
    },
    {
        num: 3,
        title: "잃어버린 꽃신",
        art: ["story-03-a.webp", "story-03-b.webp", "story-03-c.webp"],
        artAt: ["한쪽 발이 물에 빠졌습니다", "팥쥐의 발에 참기름을 바르고", "그을음 묻은 얼굴의 처녀 하나가 서 있었습니다"],
        paras: [
            "일은 다 끝났지만 콩쥐에게는 입고 갈 옷이 없었습니다. 저고리는 소매가 해지고 치마는 무릎이 나가 있었습니다. 신도 짚신 한 켤레가 전부였습니다.",
            "콩쥐가 우물가에서 얼굴을 씻고 있는데, 물 위에 무언가가 비쳤습니다. 돌아보니 하늘에서 무엇이 내려오고 있었습니다. 햇빛이 아닌 다른 빛이었습니다. 물빛이 잔잔했습니다.",
            "연둣빛 저고리와 다홍치마가 마당에 사뿐 내려앉았습니다. 그 위에는 곱게 수를 놓은 꽃신 한 켤레가 놓여 있었습니다. 옷감에서 은은한 향이 났습니다. 손끝에 닿는 감촉이 물처럼 부드러웠습니다.",
            "콩쥐는 한참 동안 그것을 만지지 못했습니다. 그러다 문득 검은 소가 떠올랐습니다. 두꺼비가, 참새 떼가 떠올랐습니다. 모두 아무 말 없이 도와준 것들이었습니다.",
            "콩쥐는 옷을 갈아입고 꽃신을 신었습니다. 발에 꼭 맞았습니다. 신코에 수놓은 꽃이 살아 있는 듯했습니다.",
            "잔칫집으로 가는 길에 개울이 하나 있었습니다. 다리라고는 통나무 하나뿐이었습니다. 콩쥐가 조심조심 건너기 시작했습니다. 물살이 제법 셌습니다. 통나무가 이끼에 덮여 미끄러웠습니다. 콩쥐는 두 팔을 벌리고 한 걸음씩 옮겼습니다.",
            "개울 한복판에 이르렀을 때였습니다. 저쪽 길에서 요란한 소리가 났습니다.<br>\"물렀거라! 감사<span class=\"gloss\">(한 도를 다스리던 가장 높은 벼슬)</span> 나리 행차시다!\" 말발굽 소리가 땅을 울렸습니다.",
            "말을 탄 행렬이 다가왔습니다. 징 소리가 귀를 울렸습니다. 콩쥐는 놀라서 서두르다가 그만 발을 헛디뎠습니다.",
            "첨벙— 하고 한쪽 발이 물에 빠졌습니다. 그 바람에 꽃신 한 짝이 발에서 벗겨져 물살에 떠내려갔습니다. 잡으려 손을 뻗었지만 이미 늦었습니다.",
            "콩쥐는 급히 개울을 건너 길가 나무 뒤에 몸을 숨겼습니다. 한 짝만 신은 발이 부끄러워 치마를 끌어당겼습니다.",
            "행렬이 개울가에 이르렀을 때, 감사가 말을 세웠습니다. 물가 풀숲에 무언가 걸려 있었기 때문입니다. 햇빛에 무언가 반짝였습니다.",
            "하인이 건져 올린 것은 수를 놓은 꽃신 한 짝이었습니다. 감사는 그것을 한참 들여다보았습니다.<br>\"이런 신을 지을 사람이 이 고을에 있었더냐.\"<br>그러고는 하인에게 일렀습니다.<br>\"이 신의 임자를 찾아라.\" 수가 어찌나 고운지 손이 다 떨렸습니다.",
            "이튿날부터 고을에 방<span class=\"gloss\">(사람들에게 알리려고 써 붙인 글)</span>이 붙었습니다. 꽃신 한 짝의 임자를 찾는다는 것이었습니다. 장터에도 우물가에도 같은 방이 붙었습니다.",
            "집집마다 처녀들이 나와 신을 신어 보았습니다. 그러나 발에 맞는 사람이 하나도 없었습니다. 큰 발은 억지로 밀어 넣다 신코가 터질 듯했고, 작은 발은 신이 벗겨져 굴렀습니다. 하인들이 고을을 사흘이나 돌았습니다.",
            "사흘째 되던 날, 하인들이 최만춘의 집 앞에 이르렀습니다. 대문 앞에 사람이 몰려들었습니다.",
            "배 씨는 소식을 듣자마자 팥쥐를 안방으로 끌고 들어갔습니다.<br>\"이건 하늘이 준 기회다.\" 문을 닫고 목소리를 낮추었습니다.",
            "배 씨는 팥쥐의 발에 참기름을 바르고 억지로 신을 밀어 넣었습니다. 팥쥐의 발은 콩쥐보다 훨씬 컸습니다. 발가락이 접혀 들어갔습니다. 팥쥐가 비명을 지르며 발을 뺐습니다. 배 씨는 그 발을 붙들고 다시 밀어 넣었습니다.",
            "\"아파요! 어머니!\"<br>\"참아라! 조금만 참으면 감사 댁 마님이 된다!\" 팥쥐의 얼굴이 일그러졌습니다.",
            "발뒤꿈치가 반이나 밖으로 나와 있었습니다. 배 씨는 치마를 길게 늘어뜨려 발을 가렸습니다. 걸을 때마다 신이 벗겨지려 했습니다.",
            "팥쥐가 절뚝거리며 마당으로 나갔습니다.<br>\"제 신입니다.\" 목소리가 기어들어 갔습니다.",
            "하인이 치마를 걷어 보라 하였습니다. 팥쥐가 뒷걸음질을 쳤습니다. 그 바람에 신이 툭 벗겨지고 말았습니다. 마당이 조용해졌습니다.",
            "배 씨는 진작 콩쥐를 부엌에 가두고 밖에서 빗장을 질러 놓았습니다. 부엌에는 창도 없었습니다. 콩쥐는 문틈으로 마당을 내다볼 뿐 소리를 내지 못했습니다.",
            "그런데 마당의 감나무에서 까치가 요란하게 울었습니다.<br>\"깍깍! 부엌이다! 부엌!\" 까치는 지붕 위를 몇 바퀴나 돌았습니다.",
            "하인이 이상히 여겨 부엌 문을 열었습니다. 그을음 묻은 얼굴의 처녀 하나가 서 있었습니다. 발에는 꽃신 한 짝이 신겨 있었습니다.<br>하인이 들고 온 다른 한 짝을 내밀자, 콩쥐의 발이 그 안에 꼭 들어갔습니다."
        ]
    },
    {
        num: 4,
        title: "감사 댁과 연못",
        art: ["story-04-a.webp", "story-04-b.webp", "story-04-c.webp"],
        artAt: ["아버지 최만춘은 딸의 손을 잡고 한참을 놓지 못했습니다", "검은 소 한 마리를 찾아 주십시오", "등 뒤에서 두 손이 콩쥐를 힘껏 밀었습니다"],
        paras: [
            "콩쥐는 감사 댁으로 가게 되었습니다. 아버지 최만춘은 딸의 손을 잡고 한참을 놓지 못했습니다. 가마가 대문을 나설 때까지 손을 흔들었습니다.",
            "\"내가 못난 아비였구나. 네가 그리 고생하는 줄을 여태 몰랐다.\"<br>\"아닙니다, 아버지.\" 아버지의 손이 거칠어져 있었습니다.",
            "혼례를 올리던 날, 배 씨와 팥쥐도 자리에 앉았습니다. 두 사람의 얼굴은 웃고 있었지만 눈은 웃지 않았습니다. 잔칫상이 마당 가득 차려졌습니다.",
            "감사 댁에서의 나날은 콩쥐에게 낯설었습니다. 아침에 눈을 뜨면 누군가 이미 물을 길어다 놓았고, 밥상이 차려져 있었습니다. 방이 하도 넓어 잠이 오지 않았습니다.",
            "콩쥐는 그것이 도무지 익숙해지지 않아 새벽마다 몰래 일어나 마당을 쓸었습니다. 하인들이 놀라 말렸습니다.<br>\"마님, 그런 일은 저희가 합니다.\"<br>\"손이 심심해서요.\" 하인들이 그 말에 서로 얼굴을 쳐다보았습니다.",
            "감사가 그 말을 듣고 웃었습니다.<br>\"부인은 아직도 그 집 부엌에 있는 모양이오.\" 콩쥐는 그 말에 얼굴을 붉혔습니다.",
            "어느 날 감사가 물었습니다.<br>\"부인, 무엇이든 가지고 싶은 것을 말해 보시오. 다 들어주겠소.\" 비단이든 패물이든 무엇이든 좋다고 했습니다.",
            "콩쥐는 한참을 생각하다 대답했습니다.<br>\"검은 소 한 마리를 찾아 주십시오.\" 감사가 눈을 껌뻑였습니다.",
            "\"검은 소라니요.\"<br>\"제가 어려울 때 자갈밭을 갈아 준 소가 있습니다. 목에 고삐도 코뚜레도 없었습니다. 이제는 제가 그 소를 먹여 주고 싶습니다.\" 감사가 눈을 크게 떴습니다.",
            "감사는 사람을 풀어 온 고을을 뒤졌습니다. 그러나 그런 소를 보았다는 사람은 아무도 없었습니다. 장마당에도 사람을 보내 알아보게 했습니다.",
            "대신 이상한 일이 있었습니다. 감사 댁 뒤뜰 연못가에 어느 날부터 두꺼비 한 마리가 나와 앉아 있게 된 것입니다. 하인들이 아무리 쫓아도 이튿날이면 그 자리에 다시 와 있었습니다. 콩쥐는 날마다 그 앞에 밥알을 놓아 주었습니다. 두꺼비는 사람이 다가가도 달아나지 않았습니다.",
            "그리고 처마에는 참새들이 유난히 많이 모여들었습니다. 하인들이 쫓으려 하면 콩쥐가 말렸습니다.<br>\"그냥 두세요. 저 새들은 제 손님입니다.\" 처마 밑이 늘 소란스러웠습니다.",
            "몇 달이 지난 어느 날, 배 씨와 팥쥐가 감사 댁을 찾아왔습니다. 손에 무엇 하나 들지 않은 채였습니다.",
            "팥쥐는 예전과 딴판으로 다정했습니다.<br>\"언니, 그동안 내가 못되게 굴었어. 미안해.\"<br>콩쥐는 그 말에 눈물이 났습니다.<br>\"괜찮아. 다 지난 일인걸.\" 팥쥐의 눈은 웃지 않았습니다.",
            "그날부터 팥쥐는 자주 드나들었습니다. 콩쥐는 올 때마다 반가워하며 밥을 차리고 옷감을 내주었습니다. 감사도 처제<span class=\"gloss\">(아내의 여동생)</span>라 하여 잘 대접했습니다. 콩쥐는 그것을 조금도 아까워하지 않았습니다. 감사는 처제가 자주 오는 것을 좋은 일이라 여겼습니다.",
            "그러던 어느 여름날이었습니다. 감사가 나랏일로 한양에 올라가 여러 날 집을 비우게 되었습니다. 콩쥐가 대문까지 나와 배웅했습니다.",
            "팥쥐가 찾아와 말했습니다.<br>\"언니, 날이 덥지? 뒤뜰 연못에서 몸이나 씻자.\" 팥쥐의 목소리가 유난히 다정했습니다.",
            "두 사람이 연못가로 갔습니다. 물이 맑고 연잎이 넓게 깔려 있었습니다. 매미 소리가 요란했습니다.",
            "\"언니가 먼저 들어가 봐. 물이 시원한지?\"<br>콩쥐가 옷을 걷고 물가에 앉았습니다. 발을 담그니 정말로 시원했습니다. 물이 무릎까지 찼습니다. 연못 가장자리에 이끼가 파랗게 끼어 있었습니다.",
            "\"언니, 저기 봐. 연꽃이 폈어.\"<br>콩쥐가 팥쥐가 가리키는 쪽으로 고개를 돌렸습니다. 연잎 사이로 아무것도 보이지 않았습니다.",
            "바로 그 순간이었습니다. 등 뒤에서 두 손이 콩쥐를 힘껏 밀었습니다.",
            "첨벙— 하는 소리가 났습니다. 물결이 몇 번 크게 일었다가 이내 잔잔해졌습니다. 연잎 몇 장이 뒤집혔다가 다시 가라앉았습니다.",
            "팥쥐는 한참 동안 연못을 내려다보았습니다. 그러고는 콩쥐가 벗어 놓은 옷을 주워 입고, 콩쥐의 방으로 들어가 문을 걸어 잠갔습니다. 손끝이 잘게 떨렸습니다. 콩쥐의 신 한 켤레가 연못가에 그대로 놓여 있었습니다.",
            "그날 밤 연못가에서는 두꺼비 한 마리가 물가를 오래도록 맴돌았습니다. 그리고 지붕에서는 참새들이 밤새 잠들지 못하고 짹짹거렸습니다. 아무도 그 뜻을 알지 못했습니다."
        ]
    },
    {
        num: 5,
        title: "붉은 연꽃",
        art: ["story-05-a.webp", "story-05-b.webp", "story-05-c.webp"],
        artAt: ["연꽃 줄기가 휘어 부인의 머리채를 후려쳤습니다", "할멈은 그 구슬을 주워 치마 주머니에 넣었습니다", "젓가락 한 쌍을 놓았습니다"],
        paras: [
            "감사가 한양에서 돌아왔습니다. 말에서 내리자마자 안채로 걸음을 옮겼습니다.",
            "방문을 열자 부인이 이불을 뒤집어쓰고 누워 있었습니다.<br>\"부인, 어디 편찮으시오?\"<br>\"…얼굴에 종기가 나서 뵐 수가 없습니다.\"",
            "목소리가 이상했습니다. 평소보다 한결 낮고 걸걸했습니다. 그러나 감사는 병 때문이려니 하였습니다.",
            "며칠이 지나 부인이 자리에서 일어났습니다. 얼굴이 달라져 있었습니다. 감사가 놀라 물었습니다.<br>\"어찌 이리 얼굴이 상하셨소.\"<br>\"병을 앓고 나서 그렇습니다.\" 목소리마저 굵어져 있었습니다.",
            "감사는 고개를 갸웃했습니다. 얼굴만 달라진 것이 아니었습니다. 부인은 더 이상 새벽에 마당을 쓸지 않았고, 두꺼비에게 밥알을 놓아 주지 않았습니다. 웃는 소리도, 걷는 걸음도 예전 부인이 아니었습니다.",
            "오히려 하인을 시켜 처마의 참새 둥지를 다 헐어 버리게 했습니다. 새끼 참새들이 마당에 떨어져 울었습니다.",
            "그 무렵 뒤뜰 연못에 붉은 연꽃 한 송이가 피었습니다. 다른 연꽃은 아직 봉오리도 맺히지 않았는데 그 한 송이만 활짝 피었습니다. 빛깔이 어찌나 붉은지 멀리서도 눈에 띄었습니다.",
            "감사는 그 꽃이 마음에 들어 날마다 연못가에 나가 보았습니다. 그런데 이상한 일이 있었습니다. 감사가 지나가면 연꽃이 고개를 들었고, 부인이 지나가면 꽃잎이 오므라들었습니다. 감사는 그것이 이상해 몇 번이나 다시 나가 보았습니다.",
            "한번은 부인이 연못가를 지나는데, 연꽃 줄기가 휘어 부인의 머리채를 후려쳤습니다. 바람 한 점 없는 날이었습니다.",
            "부인이 비명을 지르며 하인을 불렀습니다.<br>\"저 꽃을 당장 꺾어서 아궁이에 넣어라!\"",
            "연꽃은 아궁이에 던져졌습니다. 그런데 불에 타지 않았습니다. 아무리 불을 지펴도 꽃잎이 그대로였습니다. 이윽고 잿더미 속에서 붉은 구슬 하나가 반짝이고 있었습니다.",
            "그것을 발견한 것은 부엌일을 하던 늙은 할멈이었습니다. 할멈은 그 구슬을 주워 치마 주머니에 넣었습니다. 어쩐지 버릴 수가 없었습니다. 잿더미 속에서 그것만 뜨겁지 않았습니다.",
            "할멈은 그 구슬을 제 방 문갑<span class=\"gloss\">(작은 서랍장)</span> 위에 올려 두었습니다. 구슬에서 은은한 빛이 났습니다.",
            "그날 밤이었습니다. 할멈이 잠결에 눈을 떴는데, 방 안에 사람이 앉아 있었습니다. 등잔불도 켜지 않은 캄캄한 방이었습니다.",
            "젊은 여인이었습니다. 할멈이 소스라쳐 일어나려는데, 여인이 조용히 말했습니다.<br>\"할머니, 접니다. 콩쥐입니다.\" 얼굴이 낯익은데도 한참을 알아보지 못했습니다.",
            "할멈이 입을 틀어막았습니다.<br>\"마, 마님……. 마님은 방에 계신데.\" 다리가 후들거려 일어설 수가 없었습니다.",
            "\"저 방에 있는 것은 제 아우 팥쥐입니다. 저는 지난여름 연못에서 그 아이의 손에 밀렸습니다.\" 할멈의 손이 떨렸습니다.",
            "할멈은 그제야 그동안의 일이 하나로 꿰어졌습니다. 달라진 얼굴, 달라진 목소리, 헐린 참새 둥지. 할멈의 등에 소름이 돋았습니다.",
            "\"어찌하면 좋습니까.\"<br>\"영감마님께 아뢰어 주십시오. 다만 말로만 하면 믿지 않으실 겁니다.\" 할멈은 두 손을 맞잡았습니다.",
            "콩쥐가 방법을 일러 주었습니다. 그러고는 스르르 사라졌습니다.",
            "이튿날, 할멈은 감사를 제 방으로 청했습니다. 감사가 무슨 일인가 하여 따라 들어갔습니다. 방문을 조심스레 닫았습니다.",
            "할멈은 상 위에 젓가락 한 쌍을 놓았습니다. 그런데 한 짝은 길고 한 짝은 짧았습니다. 감사가 눈살을 찌푸렸습니다.",
            "\"이런 젓가락으로 어찌 밥을 먹으라는 것이냐.\"<br>할멈이 고개를 숙였습니다.<br>\"영감마님께서는 짝이 안 맞는 젓가락은 금방 알아보시면서, 짝이 바뀐 사람은 어찌 모르십니까.\" 감사가 젓가락을 들었다가 도로 내려놓았습니다.",
            "감사의 얼굴이 굳었습니다. 바로 그때 문갑 위의 붉은 구슬이 데굴데굴 굴러 감사의 발 앞에 멈춰 섰습니다. 구슬에서 붉은빛이 피어올랐습니다. 그러고는 방 안 가득 낮은 목소리가 번졌습니다.<br>\"나리, 저를 좀 보십시오.\""
        ]
    },
    {
        num: 6,
        title: "연못을 치다",
        art: ["story-06-a.webp", "story-06-b.webp", "story-06-c.webp"],
        artAt: ["뒤뜰 연못의 물을 다 퍼내라", "팥쥐와 배 씨가 마당에 끌려 나왔습니다", "검고 늙은 소였습니다"],
        paras: [
            "이튿날 새벽, 감사는 하인들을 모두 불러 모았습니다.<br>\"뒤뜰 연못의 물을 다 퍼내라.\" 아직 해도 뜨지 않은 때였습니다.",
            "두레박과 물통이 총동원되었습니다. 반나절이 지나자 연못 바닥이 드러났습니다. 물이 줄어들수록 하인들의 손이 빨라졌습니다.",
            "진흙 속에 무언가 있었습니다. 하인들이 조심조심 진흙을 걷어 냈습니다. 아무도 숨을 쉬지 못했습니다. 진흙이 무릎까지 왔습니다.",
            "콩쥐가 잠든 듯이 누워 있었습니다. 그런데 얼굴빛이 산 사람과 다르지 않았고, 몸이 조금도 상하지 않았습니다. 몇 달 동안 두꺼비가 그 곁을 지킨 것이었습니다. 옷자락에 진흙이 묻었을 뿐 얼굴은 잠든 사람 같았습니다.",
            "감사가 콩쥐를 안아 올려 마른 자리에 눕혔습니다. 할멈이 붉은 구슬을 콩쥐의 손에 쥐여 주었습니다. 옷자락에서 물이 뚝뚝 떨어졌습니다.",
            "구슬이 스르르 스며들 듯 사라지자, 콩쥐가 크게 숨을 들이켰습니다. 그러고는 눈을 떴습니다. 온 마당이 조용해졌습니다.",
            "\"…나리.\"<br>감사가 아무 말도 하지 못하고 콩쥐의 손을 잡았습니다. 콩쥐의 손이 아직 차가웠습니다.",
            "그 소식이 안채에 닿았습니다. 팥쥐는 옷도 제대로 갖춰 입지 못한 채 담을 넘어 달아나려 했습니다. 담을 넘다가 치마가 걸려 그대로 굴러떨어졌습니다. 그러고는 마당에서 붙들리고 말았습니다.",
            "팥쥐와 배 씨가 마당에 끌려 나왔습니다. 감사가 호령했습니다.<br>\"이 죄가 어떤 죄인지 아느냐. 너희를 국법대로 다스리겠다.\"",
            "그때 콩쥐가 감사의 소매를 잡았습니다.<br>\"나리, 잠깐만요.\" 마당에 있던 사람들이 모두 콩쥐를 보았습니다.",
            "콩쥐는 마당으로 내려가 두 사람 앞에 섰습니다. 팥쥐가 고개를 들지 못했습니다.",
            "\"팥쥐야.\"<br>\"…언니.\"<br>\"나는 네가 왜 나를 밀었는지 안다. 어릴 적부터 어머니가 너에게 나보다 앞서라고만 하셨지.\"<br>배 씨가 그 말에 얼굴을 감쌌습니다. 콩쥐의 목소리에는 미움이 없었습니다. 팥쥐의 어깨가 잘게 떨렸습니다. 배 씨는 그 자리에 주저앉았습니다.",
            "콩쥐가 감사를 돌아보았습니다.<br>\"나리, 이 사람들을 옥에 가두지 말아 주십시오.\"",
            "감사가 어이없어했습니다.<br>\"부인, 이자들이 부인을 물에 밀어 넣었소.\"<br>\"압니다. 그래도 옥은 아니 됩니다.\" 감사의 목소리가 높아졌습니다.",
            "\"그러면 어찌하란 말이오.\"<br>\"이 고을 밖으로 내보내 주십시오. 다시는 이 땅에 들이지 마십시오.\" 감사가 한참을 생각했습니다.",
            "\"그것이 벌이 되겠소?\"<br>콩쥐가 조용히 말했습니다.<br>\"저 사람들이 평생 바란 것이 이 집 안방이었습니다. 그 문 밖으로 내보내는 것보다 아픈 벌이 있겠습니까.\" 감사가 한참 만에 고개를 끄덕였습니다.",
            "배 씨와 팥쥐는 그날로 고을 밖으로 쫓겨났습니다. 대문을 나서면서 팥쥐가 딱 한 번 뒤를 돌아보았습니다. 콩쥐는 그 자리에 서서 끝까지 지켜보았습니다. 아무 말도 하지 않았습니다.",
            "아버지 최만춘은 그 뒤 딸의 집 가까이로 옮겨 와 살았습니다. 아버지는 딸을 볼 때마다 미안하다는 말을 했고, 콩쥐는 그때마다 밥상을 한 번 더 차렸습니다.",
            "그해 가을, 감사가 콩쥐를 데리고 산자락으로 나갔습니다.<br>\"부인이 찾던 소를 보았다는 사람이 나타났소.\" 가을볕이 좋은 날이었습니다.",
            "산 밑 자갈밭에 소 한 마리가 서 있었습니다. 검고 늙은 소였습니다. 목에는 고삐도 코뚜레도 없었습니다. 소의 등에 흙이 묻어 있었습니다.",
            "콩쥐가 다가가자 소가 고개를 들었습니다. 크고 검은 눈이 그때와 똑같았습니다. 콩쥐의 눈에 눈물이 고였습니다. 소가 콩쥐의 어깨에 코를 대고 킁킁거렸습니다.",
            "콩쥐는 소의 목을 끌어안았습니다. 오래도록 놓지 않았습니다.<br>\"이제 밭은 안 갈아도 됩니다.\"",
            "검은 소는 감사 댁 뒤뜰에서 여생을 보냈습니다. 그 곁에는 두꺼비가 늘 앉아 있었고, 처마에는 참새들이 다시 둥지를 틀었습니다. 뒤뜰이 늘 부산했습니다.",
            "사람들은 콩쥐를 두고 복이 많은 사람이라고 했습니다. 그러나 콩쥐는 그 말을 들을 때마다 고개를 저었습니다. 콩쥐는 그 말이 부끄러웠습니다.",
            "\"복이 아닙니다. 제가 어려울 때 저를 도와준 것들이 있었을 뿐입니다. 소도, 두꺼비도, 참새도, 할머니도요.\" 말하면서 콩쥐는 뒤뜰 쪽을 보았습니다.",
            "그러고는 이렇게 덧붙였습니다.<br>\"그것들이 왜 나를 도왔는지는 나도 몰랐습니다. 나중에 알고 보니, 내가 언젠가 밟지 않고 비켜 간 것들이더군요.\""
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
    emoji: '👟',
    title: '콩쥐 팥쥐',
    intro: [
        "콩쥐 팥쥐는 지은이가 알려지지 않은 조선 후기 소설이에요. 전라도 전주 지방을 무대로 삼고 있답니다.",
        "이 이야기는 세계 곳곳에 퍼져 있는 신데렐라형 이야기 가운데 하나예요. 어머니를 여읜 딸과 새어머니가 나오는 뼈대가 서로 닮았답니다.",
        "그 가운데 가장 오래된 것은 중국 당나라 때 책 유양잡조에 실린 섭한 이야기예요. 천이백 년쯤 전에 적힌 글이니 유럽의 신데렐라보다 팔백 년이나 앞선 셈이지요.",
        "그런데 콩쥐 이야기는 신데렐라와 똑같이 흘러가지는 않아요. 어디서부터 달라지는지 눈여겨보며 읽어 보세요."
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
    { q: "계모가 콩쥐에게 준 괭이는 어떤 것이었습니까?", choices: ["쇠로 만든 새 괭이", "나무로 만든 괭이", "날이 아주 무딘 괭이"], answer: 1 },
    { q: "자갈밭을 대신 갈아 준 것은 무엇입니까?", choices: ["이웃집 머슴", "지나가던 나그네", "검은 소 한 마리"], answer: 2 },
    { q: "밑 빠진 독을 막아 준 것은 무엇입니까?", choices: ["두꺼비 한 마리", "커다란 자라", "구렁이 한 마리"], answer: 0 },
    { q: "참새 떼가 콩쥐에게 해 준 일은 무엇입니까?", choices: ["밑 빠진 독을 막아 주었다", "자갈밭을 갈아 주었다", "벼 석 섬을 다 찧어 주었다"], answer: 2 },
    { q: "콩쥐가 잔치에 가면서 잃어버린 것은 무엇입니까?", choices: ["꽃신 한 짝", "옥비녀 하나", "비단 손수건"], answer: 0 },
    { q: "꽃신을 주운 사람은 누구입니까?", choices: ["잔칫집 주인", "그 고을 감사", "장터의 장사꾼"], answer: 1 },
    { q: "팥쥐는 꽃신을 신으려고 무엇을 했습니까?", choices: ["신을 몰래 늘렸다", "발을 억지로 밀어 넣었다", "다른 신을 대신 내놓았다"], answer: 1 },
    { q: "팥쥐는 연못에서 콩쥐에게 무엇을 했습니까?", choices: ["함께 물에 들어갔다", "먼저 집으로 돌아갔다", "등 뒤에서 힘껏 밀었다"], answer: 2 },
    { q: "연못가에서 피어난 것은 무엇입니까?", choices: ["붉은 연꽃 한 송이", "하얀 매화 한 그루", "노란 국화 한 무더기"], answer: 0 },
    { q: "할멈이 감사 앞에 내놓은 것은 무엇입니까?", choices: ["콩쥐가 쓰던 나무 빗", "연못에서 건진 꽃신", "짝이 안 맞는 젓가락"], answer: 2 },
    { q: "달아나려던 팥쥐는 어떻게 되었습니까?", choices: ["담을 넘다 굴러떨어졌다", "마당에서 무릎을 꿇었다", "곧장 달아나 버렸다"], answer: 0 },
    { q: "콩쥐가 감사에게 부탁한 것은 무엇입니까?", choices: ["꽃신을 돌려 달라고", "검은 소를 찾아 달라고", "연못을 메워 달라고"], answer: 1 },
    {
        q: "이 책을 읽고 난 반응으로 알맞지 않은 것은 무엇인가요?",
        wide: true,
        choices: [
            "나무 괭이로 자갈밭을 갈라고 한 것을 보면, 못 할 일을 시켜 놓고 흠을 잡으려는 것이었구나.",
            "검은 소와 두꺼비와 참새가 차례로 도운 것을 보면, 혼자 감당 못 할 일에는 손이 모이네.",
            "짝이 안 맞는 젓가락을 내놓아 가려낸 것을 보면, 큰 것보다 사소한 것이 사람을 밝히는 거야.",
            "밑 빠진 독을 두꺼비가 들어가 막아 준 것을 보면, 콩쥐가 미리 길러 둔 두꺼비였나 봐."
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
    emoji: '🌺',
    art: ['end.webp'],
    paras: [
        `이 이야기를 읽으면서 어디서 들어 본 것 같다고 느꼈다면 맞습니다. 어머니를 여읜 딸, 새로 온 어머니와 그 딸, 궂은일, 잃어버린 신 한 짝, 그 신으로 사람을 찾는 일. 신데렐라와 뼈대가 같습니다.`,
        `이런 뼈대의 이야기는 세계에 수백 가지가 있습니다. 학자들이 하나하나 모아 세어 보았더니 대륙마다 나왔습니다. 서로 만난 적 없는 곳에서 같은 이야기가 나온 것이 아니라, 아주 오래전부터 사람에서 사람으로 건너다닌 이야기로 봅니다.`,
        `「섭한」에서 딸을 돕는 것은 물고기 한 마리입니다. 유럽에서는 요정이나 나무이고요. 뼈대는 그대로인데 돕는 쪽만 그 땅에서 가장 가까운 것으로 바뀝니다.`,
        `우리 이야기가 그 이야기들과 뚜렷하게 다른 데가 한 군데 있습니다. 결혼에서 끝나지 않는다는 것입니다. 서양 신데렐라는 신발이 맞고 나면 행복하게 살았다는 말로 끝납니다. 콩쥐 팥쥐는 거기가 절반입니다. 제4장부터가 진짜입니다.`,
        `뒷부분은 콩쥐가 연못에 빠진 뒤부터입니다. 콩쥐는 붉은 연꽃으로, 구슬로 모습을 바꾸어 가며 자기가 여기 있다고 알립니다. 사라진 사람이 사라진 채로 끝나지 않고 기어이 제 자리를 되찾는 이야기입니다. 서양 신데렐라에는 이런 대목이 아예 없습니다.`,
        `그래서 콩쥐 팥쥐는 책마다 끝나는 자리가 다릅니다. 신발이 맞는 데서 덮는 책도 있고 연못까지 가는 책도 있습니다. 이 책은 연못까지 갑니다. 그 뒤가 있어야 이 이야기가 우리 이야기가 되기 때문입니다.`,
        `콩쥐를 도운 것이 무엇이었는지 한번 세어 보십시오. 검은 소, 두꺼비, 참새 떼입니다. 요정 대모도 마법 지팡이도 없습니다. 밭 갈던 소와 마당의 두꺼비와 처마의 참새입니다. 옛사람들이 날마다 보던 것들이 그대로 돕는 편이 된 것입니다.`,
        `밑 빠진 독 대목은 특히 눈여겨볼 만합니다. 두꺼비가 한 일은 물을 길어 준 것이 아닙니다. 제 몸으로 구멍을 막았을 뿐입니다. 콩쥐는 그대로 제 힘으로 물을 길어 부었습니다. 도움이란 대신 해 주는 것이 아니라 할 수 있게 해 주는 것이라는 말을, 이 대목이 말없이 하고 있습니다.`,
        `신 한 짝으로 사람을 찾는다는 것도 생각해 보면 이상한 일입니다. 발 크기가 같은 사람은 얼마든지 있습니다. 그런데도 이런 이야기가 세계 곳곳에 있는 까닭은, 신이란 것이 본래 그 사람이 어디를 어떻게 걸어왔는지를 담은 물건이기 때문일 것입니다.`,
        `팥쥐도 다시 보아야 할 사람입니다. 이 아이가 태어날 때부터 못됐던 것은 아닙니다. 어머니가 시키는 대로 했고, 어머니가 하는 것을 보고 배웠습니다. 마지막에 무너져 앉은 사람이 팥쥐가 아니라 배 씨였던 것도 그래서입니다.`,
        `아버지 이야기도 빼놓을 수 없습니다. 이 사람은 아무 잘못도 하지 않았습니다. 다만 집에 없었습니다. 장에 다니느라 딸의 종아리를 한 번도 보지 못했습니다. 나쁜 일이 벌어지는 데 나쁜 사람만 필요한 것은 아니라는 것을 이 사람이 보여 줍니다.`,
        `마지막 쪽에서 콩쥐가 복이 많다는 말을 부끄러워한 대목을 기억하십시오. 이 이야기가 끝내 하고 싶었던 말이 거기 있습니다.`,
        `콩쥐가 도움을 받은 것은 착해서였을까요, 운이 좋아서였을까요? 콩쥐 자신은 언젠가 밟지 않고 비켜 간 것들이었다고 했습니다. 그렇다면 착한 것과 운이 좋은 것은 다른 일일까요, 같은 일일까요.`,
        `콩쥐는 왜 연꽃으로, 구슬로 모습을 바꾸어 가며 자기를 알렸을까요? 곧바로 나서서 말하면 될 일인데 그러지 않았습니다. 말해도 믿어 주지 않을 사람들 앞에서 무엇을 할 수 있을지 생각해 보십시오.`,
        `배 씨는 왜 콩쥐를 미워했을까요? 콩쥐가 배 씨에게 잘못한 일은 하나도 없습니다. 아무 잘못도 하지 않은 사람을 미워하게 되는 일이 어떻게 생기는지, 이 물음에는 이야기가 답해 주지 않습니다.`
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
        emoji: '👟',
        title: 'Kongjwi and Patjwi',
        intro: [
            "Kongjwi and Patjwi is an old Korean story with no known author. It has been told in this country for a very long time.",
            "If it feels familiar, you are right. A girl who loses her mother, a new mother and her daughter. Stories built this way are found all over the world.",
            "But ours does not go quite the same way. Watch for where it turns.",
            "Kongjwi means bean and Patjwi means red bean. The names of two ordinary things people grew in the yard."
        ]
    },
    chapters: [
        {
            num: 1,
            title: "The New Mother and the Black Ox",
            art: ["story-01-a.webp", "story-01-b.webp", "story-01-c.webp"],
            artAt: ["Two tables were set", "brought the wooden hoe down", "something came walking down"],
            paras: [
                "Long ago in the town of Jeonju, in Jeolla province, there lived a man called Choe Manchun. He had one daughter, born to him late, and her name was Kongjwi. The house was not well off, but the husband and wife were happy together.",
                "A hundred days after Kongjwi was born her mother died. Her father carried her on his back and begged milk for her from house to house. The women of the village took turns to feed her.",
                "Kongjwi was quick with her hands and gentle in her heart. By six or seven she was already cooking rice and doing the washing. The neighbours clicked their tongues.<br>\"It's not easy for a child who grew up without a mother to turn out so straight.\" Even when she was praised Kongjwi always looked down.",
                "In the year Kongjwi turned ten, her father took a new wife. Her name was Lady Bae, and she came into the house with a daughter of her own. That child's name was Patjwi. Patjwi was a year younger than Kongjwi.",
                "On the wedding day Lady Bae took Kongjwi's hand and even shed tears.<br>\"I am your mother now. I will never make you sad.\"<br>Kongjwi was so grateful for those words that she could not sleep all night. Lady Bae's hand was so warm.",
                "But those words were only alive when her father was listening. He was the one who never found it out.",
                "From the first day her father went off to market, Lady Bae's face changed. She gave Kongjwi every scrap of the kitchen work and would not let Patjwi lift a finger. Even the sound of her step over the threshold was different. Patjwi stayed under her quilt until the sun was high.",
                "\"Kongjwi, draw water.\"<br>\"Kongjwi, light the fire.\"<br>\"Kongjwi, when you've done the washing, sweep the yard as well.\"<br>She was called a hundred times a day. Kongjwi never once put off answering.",
                "Two tables were set for meals. White rice and meat soup went into the inner room, and one bowl of cold barley was left in the kitchen. Kongjwi ate it standing at the stove.",
                "Patjwi was worse than her mother. She would spill water in the yard on purpose and then call Kongjwi.<br>\"Look at this. You spilled it, didn't you?\"<br>\"I did not spill it.\"<br>\"Mother! Kongjwi spilled the water and now she's lying!\" Patjwi laughed behind her every time.",
                "Every time, Lady Bae struck Kongjwi across the shins. Kongjwi did not cry. She was afraid that if she cried her father would find out. There was never a day without marks on her shins. On the days her father came home she covered them with her skirt.",
                "When her father came home Lady Bae had her kind face on again.<br>\"Our Kongjwi has worked so hard again today.\"<br>Her father was pleased to hear it, and Kongjwi said nothing at all. He was often away at the markets.",
                "It was the spring Kongjwi turned twelve. Lady Bae stood the two girls in the yard and handed each of them a hoe. The morning dew had not even dried yet.",
                "\"Today you will till the fields. Don't think of coming home before it is done.\" The sun was still sitting on the ridge of the hill.",
                "What Patjwi got was an iron hoe with a keen blue edge. What Kongjwi got was a hoe whittled out of wood. Patjwi's handle was smooth and Kongjwi's was rough.",
                "The fields were different too. Patjwi was given the sandy plot in front of the house. Kongjwi was given the stony plot at the foot of the hill. It was a field a grown man could not till half of in a day. The stones were the size of a man's fist.",
                "Patjwi finished the sandy plot in an hour and came back and had a nap. On her way she glanced over at Kongjwi's field and smiled.",
                "Kongjwi crouched in the stony field and brought the wooden hoe down again and again. Every time it struck a stone the shock ran up her wrist. Before she had done a few rows the blade snapped clean off. Her palms blistered at once.",
                "Kongjwi sat down in the middle of the field with the broken hoe in her hand. Only then did the tears come. The sun was already overhead.",
                "\"How am I ever to till that field with this?\" And she had not done a quarter of it.",
                "Then something came walking down from the hill. Kongjwi looked up and saw a black ox. It had no halter round its neck and no ring through its nose. Its coat shone and its horns were straight.",
                "The ox came up to Kongjwi and looked at her a long while with its big dark eyes. Then it walked into the field and began to turn the earth with its forefeet. It never crossed Kongjwi's mind to be afraid. Its breath was warm.",
                "Stones flew up and the soil turned over. Every time the ox went round, one row of the field lay straight and clean. The whole field was turned before the sun went down. Kongjwi stood on the bank and watched.",
                "Kongjwi got up and bowed to the ox.<br>\"Thank you. But whose ox are you?\"<br>Instead of answering, the ox dropped a few fruits in front of her that it had carried in its mouth. They were red fruits she had never seen. The ox's hoofprints stood clear on the bank. While she was picking them up, the ox went back to the hill."
            ]
        },
        {
            num: 2,
            title: "The Bottomless Jar and the Sparrows",
            art: ["story-02-a.webp", "story-02-b.webp", "story-02-c.webp"],
            artAt: ["a hole the size of a fist", "The toad crawled into the jar", "came down into the yard"],
            paras: [
                "That autumn there was a feast at the big house in the village. Everyone in the village was invited. You could hear the rice cakes being pounded from the mouth of the village.",
                "Lady Bae put new clothes on Patjwi and braided her hair beautifully. Kongjwi stood in the kitchen and watched. Patjwi turned round in front of the mirror again and again. Kongjwi's sleeves had grown too short for her.",
                "\"Mother, I should like to go too.\"<br>Lady Bae looked round.<br>\"Go if you want to. Only, the housework must be done first.\" A smile went over Lady Bae's mouth. The water was still not dry on Kongjwi's hands.",
                "\"What must I do?\"<br>\"Fill that jar in the yard with water. That is all.\" A great jar stood at one side of the yard.",
                "Kongjwi lifted a water pot onto her head at once. She went to the well and back ten times. But however much she poured in, the jar did not fill. The pot pressed down on her shoulder.",
                "It was so strange that she put a hand inside, and there was a hole the size of a fist in the bottom of the jar. The water ran out into the ground as fast as she poured it. The earth was dug away round the hole. The marks of a hand were still there.",
                "Kongjwi sat down where she stood. Beyond the gate she could hear Lady Bae and Patjwi laughing. The two of them had already gone off to the feast. The yard was swimming with water.",
                "The sun went slowly down. Still Kongjwi lifted the pot again. She poured and it leaked, and she poured and it leaked. Her arms went numb and her legs shook. Her skirt was soaked and there was a red mark on her shoulder.",
                "Then something came waddling out from under the wall. It was a great toad. It was an old toad with a lumpy back.",
                "The toad looked up at Kongjwi and said,<br>\"I will stop that hole for you.\" Its voice was low and slow.",
                "The toad crawled into the jar and lay down flat with its belly right over the hole in the bottom.<br>\"Now pour.\" It had blocked the hole with its own body.",
                "When Kongjwi poured, this time nothing leaked. Ten potfuls and the jar was full. The toad's back was cold. Kongjwi lifted it out and asked,<br>\"Why do you help me?\"<br>\"Last summer you stepped round me in the yard instead of on me.\"",
                "Kongjwi had changed her clothes and was about to go out when the gate opened. Lady Bae had come back. Kongjwi's heart dropped.",
                "Lady Bae's face stiffened when she saw the jar full. But at once she spoke as if nothing were the matter.<br>\"Ah, there is one thing I forgot. There are three sacks of unhulled rice in the storeroom. Pound them all and then come.\" The end of it was oddly soft. Lady Bae said it without looking at Kongjwi's face.",
                "\"Three sacks? By today?\"<br>\"Then don't do it. Only, don't come to the feast either.\" Lady Bae did not look back.",
                "Lady Bae said only that and went out again.",
                "When Kongjwi opened the storeroom the rice was piled up like a mountain. Alone she could not have done it in three days. She could hardly get her foot over the threshold.",
                "Kongjwi dragged the mortar over and poured in a measure of rice. The pestle was so heavy that she could barely lift it in both hands. The mortar came up as high as she was.",
                "Thump. Thump. Thump.<br>After twenty strokes her arms felt ready to fall off. And the hulled rice was barely a handful. The sweat ran off her forehead. The pestle kept slipping in her hands. Kongjwi spat on both palms and took hold again.",
                "Kongjwi put down the pestle and sat down in the yard.<br>\"It can't be done.\" The skin was off both her palms.",
                "Then the sky went suddenly dark. Kongjwi looked up and it was not cloud. It was sparrows. The sound of their chirping covered the whole sky.",
                "Hundreds of them came down into the yard. The sparrows settled on the heaps of rice and began to strip the husks with their beaks. The whole yard was covered with sparrows.",
                "The chirping and the sound of beaks together filled the whole yard with noise. The sparrows took only the husks and did not carry off one single grain. Kongjwi stood where she was and watched.",
                "In less than an hour three sacks of rice stood white and clean. The sparrows rose all at once and went once round over the roof.<br>Kongjwi stood in the middle of the yard and waved her hand.<br>\"Thank you! Thank you!\""
            ]
        },
        {
            num: 3,
            title: "The Lost Flower Shoe",
            art: ["story-03-a.webp", "story-03-b.webp", "story-03-c.webp"],
            artAt: ["one foot went into the water", "rubbed sesame oil on Patjwi's foot", "A girl with soot on her face"],
            paras: [
                "The work was done, but Kongjwi had nothing to wear. The sleeves of her jacket were worn through and her skirt was gone at the knees. For shoes she had one pair of straw sandals.",
                "Kongjwi was washing her face at the well when something showed on the water. She turned round and something was coming down out of the sky. It was a light that was not sunlight. The water lay still.",
                "A pale green jacket and a deep red skirt came softly down into the yard. On top of them lay a pair of flower shoes with fine embroidery. There was a faint scent in the cloth. Under her fingers it felt as soft as water.",
                "For a long while Kongjwi could not bring herself to touch them. Then all at once she thought of the black ox. She thought of the toad, and of the sparrows. Every one of them had helped her without a word.",
                "Kongjwi changed her clothes and put on the flower shoes. They fitted exactly. The flowers embroidered on the toes looked alive.",
                "There was a stream on the way to the feast. For a bridge there was only one log. Kongjwi began to cross it very carefully. The water was running quite hard. The log was slippery with moss. Kongjwi spread both arms and moved one step at a time.",
                "She was in the middle of the stream when it happened. There was a great noise on the road ahead.<br>\"Make way! The governor<span class=\"gloss\">(the highest official in charge of a whole province)</span> is passing!\" The hooves shook the ground.",
                "A mounted procession came up. The gongs rang in her ears. Kongjwi was startled and hurried, and her foot slipped.",
                "There was a splash, and one foot went into the water. With that, one of the flower shoes came off and was carried away by the current. She put out a hand to catch it but it was already too late.",
                "Kongjwi crossed the stream quickly and hid herself behind a tree by the road. She was ashamed of the foot with only one shoe on it and pulled her skirt down over it.",
                "When the procession reached the stream the governor stopped his horse. Something was caught in the grass at the water's edge. Something had flashed in the sun.",
                "What the servant fished out was one embroidered flower shoe. The governor looked at it a long while.<br>\"Is there anyone in this town who could make a shoe like this?\"<br>Then he told his servant,<br>\"Find whoever owns this shoe.\" The embroidery was so fine that his hand shook.",
                "From the next day notices went up round the town. They were looking for the owner of one flower shoe. The same notice was up in the market and at the well.",
                "In house after house the young women came out and tried the shoe on. But it fitted nobody. Big feet nearly split the toe of it being forced in; small feet let it slip off and roll away. The servants went round the town for three whole days.",
                "On the third day the servants came to the gate of Choe Manchun's house. People crowded in front of the gate.",
                "The moment Lady Bae heard, she dragged Patjwi into the inner room.<br>\"This is a chance from heaven.\" She shut the door and dropped her voice.",
                "Lady Bae rubbed sesame oil on Patjwi's foot and forced the shoe on. Patjwi's foot was far bigger than Kongjwi's. Her toes folded up inside it. Patjwi screamed and pulled her foot out. Lady Bae took hold of that foot and pushed it in again.",
                "\"It hurts! Mother!\"<br>\"Bear it! Bear it a little and you will be the governor's lady!\" Patjwi's face twisted.",
                "Half her heel was hanging out of the shoe. Lady Bae let the skirt hang down long to hide the foot. The shoe tried to come off at every step.",
                "Patjwi went limping out into the yard.<br>\"It is my shoe.\" Her voice crawled out of her.",
                "The servant asked her to lift her skirt. Patjwi backed away, and with that the shoe came off. The yard went silent.",
                "Lady Bae had already shut Kongjwi in the kitchen and barred it from outside. The kitchen had no window. Kongjwi could only look out at the yard through the crack of the door and could not make a sound.",
                "But in the persimmon tree in the yard a magpie began to call and call.<br>\"Kak, kak! The kitchen! The kitchen!\" The magpie went round over the roof several times.",
                "The servant thought it strange and opened the kitchen door. A girl with soot on her face was standing there. On one foot was a flower shoe.<br>When the servant held out the other one, Kongjwi's foot went into it exactly."
            ]
        },
        {
            num: 4,
            title: "The Governor's House and the Pond",
            art: ["story-04-a.webp", "story-04-b.webp", "story-04-c.webp"],
            artAt: ["could not let go of it for a long while", "Find me one black ox", "two hands pushed Kongjwi hard"],
            paras: [
                "Kongjwi was to go to the governor's house. Her father Choe Manchun held his daughter's hand and could not let go of it for a long while. He waved until the palanquin was out of the gate.",
                "\"I was a poor father to you. All this time I never knew you were having such a hard time.\"<br>\"No, father.\" Her father's hands had grown rough.",
                "On the wedding day Lady Bae and Patjwi sat there too. Their faces were smiling but their eyes were not. The feast tables filled the whole yard.",
                "The days at the governor's house were strange to Kongjwi. When she opened her eyes in the morning somebody had already drawn the water and set the table. The room was so wide that she could not sleep.",
                "She could not get used to it at all, so she got up in secret every dawn and swept the yard. The servants were shocked and tried to stop her.<br>\"My lady, that is our work.\"<br>\"My hands get bored.\" The servants looked at one another at that.",
                "The governor heard of it and laughed.<br>\"It seems my wife is still in that kitchen of hers.\" Kongjwi went red at that.",
                "One day the governor asked her,<br>\"Wife, tell me anything you want to have. I will give you whatever it is.\" Silk or jewels, anything at all, he said.",
                "Kongjwi thought for a long while and answered,<br>\"Find me one black ox.\" The governor blinked.",
                "\"A black ox?\"<br>\"There is an ox that ploughed a stony field for me when I was in trouble. It had no halter on its neck and no ring in its nose. Now I should like to feed that ox myself.\" The governor's eyes widened.",
                "The governor sent men out and had the whole district searched. But there was nobody who had seen such an ox. He even sent men to the markets to find out.",
                "Instead, a strange thing happened. From one day on, a toad came and sat at the edge of the pond in the back garden of the governor's house. However often the servants drove it off, the next day it was back in the same place. Kongjwi put grains of rice down in front of it every day. The toad did not run away even when people came near.",
                "And a great many sparrows gathered under the eaves. When the servants tried to drive them off Kongjwi stopped them.<br>\"Leave them. Those birds are my guests.\" It was always noisy under the eaves.",
                "One day some months later, Lady Bae and Patjwi came to the governor's house. They came with nothing at all in their hands.",
                "Patjwi was kind, quite unlike before.<br>\"Sister, I was cruel to you all that time. I am sorry.\"<br>Tears came to Kongjwi's eyes at that.<br>\"It's all right. It's all past now.\" Patjwi's eyes were not smiling.",
                "From that day Patjwi came often. Kongjwi was glad every time and set out food and gave her cloth. The governor treated her well too, as his wife's sister. Kongjwi did not grudge her any of it. The governor thought it a good thing that her sister came so often.",
                "Then one summer day the governor had to go up to Hanyang on state business and be away for many days. Kongjwi came out to the gate to see him off.",
                "Patjwi came and said,<br>\"Sister, it's hot, isn't it? Let's wash in the pond in the back garden.\" Patjwi's voice was unusually kind.",
                "The two of them went to the pond. The water was clear and lotus leaves lay broad across it. The cicadas were loud.",
                "\"You go in first, sister. See if the water's cool.\"<br>Kongjwi turned up her clothes and sat at the edge. She put her feet in and it really was cool. The water came up to her knees. Green moss grew round the rim of the pond.",
                "\"Sister, look over there. A lotus has opened.\"<br>Kongjwi turned her head the way Patjwi was pointing. There was nothing to be seen among the lotus leaves.",
                "That was the moment. From behind her, two hands pushed Kongjwi hard.",
                "There was a splash. The water heaved a few times and then went smooth again. A few lotus leaves turned over and settled back.",
                "Patjwi stood looking down into the pond for a long while. Then she picked up the clothes Kongjwi had taken off and put them on, and went into Kongjwi's room and barred the door. Her fingertips shook a little. Kongjwi's pair of shoes still lay at the edge of the pond.",
                "That night a toad went round and round the water's edge for a long time. And on the roof the sparrows could not sleep and chirped all night. Nobody knew what it meant."
            ]
        },
        {
            num: 5,
            title: "The Red Lotus",
            art: ["story-05-a.webp", "story-05-b.webp", "story-05-c.webp"],
            artAt: ["the lotus stem bent over and struck", "picked up the bead and put it in the pocket", "laid down a pair of chopsticks"],
            paras: [
                "The governor came home from Hanyang. The moment he was off his horse he went through to the inner rooms.",
                "He opened the door and his wife was lying with the quilt pulled over her.<br>\"Wife, are you ill?\"<br>\"...I have a boil on my face and cannot be seen.\"",
                "The voice was strange. It was lower and rougher than usual. But the governor thought it must be the illness.",
                "A few days later his wife got up. Her face had changed. The governor was startled and asked,<br>\"How has your face got into such a state?\"<br>\"It is from being ill.\" Even the voice had gone deeper.",
                "The governor tipped his head. It was not only her face that had changed. His wife no longer swept the yard at dawn, and she no longer put grains of rice down for the toad. The way she laughed and the way she walked were not the same woman's.",
                "Instead she had the servants pull down every sparrow's nest under the eaves. The young sparrows fell into the yard and cried.",
                "About that time one red lotus flower opened in the pond in the back garden. The other lotuses had not even put out buds, and that one was wide open. The colour was so red that you could see it from a long way off.",
                "The governor liked that flower and went out to the pond to look at it every day. But a strange thing happened. When the governor went past, the lotus lifted its head; when his wife went past, the petals closed up. He thought it so strange that he went out again and again to see.",
                "Once, as his wife was passing the pond, the lotus stem bent over and struck her across the hair. There was not a breath of wind that day.",
                "His wife screamed and called the servants.<br>\"Cut that flower down and put it in the stove this minute!\"",
                "The lotus was thrown into the stove. But it would not burn. However hard they built the fire, the petals stayed as they were. And then in the ashes one red bead lay shining.",
                "The one who found it was the old woman who worked in the kitchen. The old woman picked up the bead and put it in the pocket of her skirt. Somehow she could not throw it away. In all those ashes it was the one thing that was not hot.",
                "The old woman set the bead on the little chest in her room. A faint light came from it.",
                "It was that night. The old woman half woke and there was someone sitting in her room. The room was pitch dark with no lamp lit.",
                "It was a young woman. The old woman started up in fright, and the young woman said quietly,<br>\"Grandmother, it is me. It is Kongjwi.\" The face was familiar and still it took her a long time to know it.",
                "The old woman clapped a hand over her mouth.<br>\"My... my lady... My lady is in her room.\" Her legs shook so that she could not stand.",
                "\"The one in that room is my sister Patjwi. Last summer she pushed me into the pond with her own hands.\" The old woman's hands shook.",
                "Only then did the whole of it come together for her. The changed face, the changed voice, the pulled-down sparrows' nests. The hair rose on the old woman's back.",
                "\"What am I to do?\"<br>\"Tell the master. Only, he will not believe you if you only say it.\" The old woman clasped her two hands together.",
                "Kongjwi told her how. And then she faded away.",
                "The next day the old woman asked the governor to come to her room. Wondering what it could be, he followed her in. She shut the door carefully.",
                "The old woman laid down a pair of chopsticks on the table. But one was long and one was short. The governor frowned.",
                "\"How am I to eat with chopsticks like these?\"<br>The old woman bowed her head.<br>\"My lord knows at once when a pair of chopsticks does not match. How is it that you do not know when a person has been swapped?\" The governor picked up the chopsticks and put them down again.",
                "The governor's face went hard. At that very moment the red bead rolled off the chest and stopped at his feet. A red light rose out of it. And then a low voice spread through the room.<br>\"My lord, look at me.\""
            ]
        },
        {
            num: 6,
            title: "Draining the Pond",
            art: ["story-06-a.webp", "story-06-b.webp", "story-06-c.webp"],
            artAt: ["Bail out every drop", "were dragged out into the yard", "It was a black ox, and an old one"],
            paras: [
                "At dawn the next day the governor called all the servants together.<br>\"Bail out every drop of water in the pond in the back garden.\" The sun was not up yet.",
                "Every bucket and pail in the house was brought out. By midday the bottom of the pond showed. The lower the water went, the faster the servants' hands worked.",
                "There was something in the mud. The servants lifted the mud away very carefully. Nobody could breathe. The mud came up to their knees.",
                "Kongjwi lay there as if asleep. And the colour of her face was no different from a living person's, and her body was not harmed at all. They said a toad had kept watch beside her for months. There was mud on the hem of her clothes and her face was like a sleeper's.",
                "The governor lifted Kongjwi up and laid her on dry ground. The old woman put the red bead into Kongjwi's hand. Water dripped from the hem of her clothes.",
                "The bead sank away as if soaking in, and Kongjwi drew a great breath. And then she opened her eyes. The whole yard went silent.",
                "\"...My lord.\"<br>The governor could not say a word and took Kongjwi's hand. Her hand was still cold.",
                "The news reached the inner rooms. Patjwi tried to go over the wall to run, without even getting her clothes on properly. Her skirt caught as she climbed and she came straight down. And then she was caught in the yard.",
                "Patjwi and Lady Bae were dragged out into the yard. The governor thundered at them.<br>\"Do you know what kind of crime this is? I shall deal with you by the law of the land.\"",
                "Then Kongjwi took hold of the governor's sleeve.<br>\"My lord, one moment.\" Everyone in the yard looked at Kongjwi.",
                "Kongjwi went down into the yard and stood in front of the two of them. Patjwi could not lift her head.",
                "\"Patjwi.\"<br>\"...Sister.\"<br>\"I know why you pushed me. From the time we were small your mother told you only to get ahead of me.\"<br>Lady Bae covered her face at that. There was no hatred in Kongjwi's voice. Patjwi's shoulders shook. Lady Bae sank down where she stood.",
                "Kongjwi turned to the governor.<br>\"My lord, please do not shut these people in prison.\"",
                "The governor could not believe it.<br>\"Wife, these people pushed you into the water.\"<br>\"I know. Even so, not prison.\" The governor's voice rose.",
                "\"Then what am I to do with them?\"<br>\"Send them out of this district. Never let them into this land again.\" The governor thought for a long while.",
                "\"Would that be a punishment?\"<br>Kongjwi said quietly,<br>\"What those two wanted all their lives was the inner room of this house. Is there a sharper punishment than putting them outside that door?\" After a long moment the governor nodded.",
                "Lady Bae and Patjwi were put out of the district that same day. As she went through the gate Patjwi looked back exactly once. Kongjwi stood where she was and watched to the end. She said nothing at all.",
                "Her father Choe Manchun came to live near his daughter's house after that. Every time he saw her he said he was sorry, and every time, Kongjwi set the table once more.",
                "That autumn the governor took Kongjwi out to the foot of the hill.<br>\"Someone has turned up who says he has seen the ox you were looking for.\" It was a fine autumn day.",
                "In the stony field at the foot of the hill an ox was standing. It was a black ox, and an old one. There was no halter on its neck and no ring in its nose. There was earth on its back.",
                "When Kongjwi came near, the ox lifted its head. The big dark eyes were exactly as they had been. Tears came into Kongjwi's eyes. The ox put its nose to Kongjwi's shoulder and snuffed at her.",
                "Kongjwi put her arms round the ox's neck. She held on a long time.<br>\"You don't have to plough any more.\"",
                "The black ox spent the rest of its life in the back garden of the governor's house. The toad was always sitting beside it, and the sparrows built their nests under the eaves again. The back garden was always busy.",
                "People said that Kongjwi was a woman with a great deal of luck. But every time she heard it Kongjwi shook her head. The word made her ashamed.",
                "\"It is not luck. It is only that there were some who helped me when things were hard. The ox, and the toad, and the sparrows, and the grandmother too.\" As she said it Kongjwi looked toward the back garden.",
                "And then she added this.<br>\"Why they helped me I did not know either. When I found out later, they turned out to be the ones I had once stepped round instead of on.\""
            ]
        }
    ],
    /* 단어장 — 그림책은 펼침면마다 묶지만, 소설은 장마다 묶는다.
       쪽은 재어서 나누므로 미리 알 수 없기 때문이다.
       화면에는 그 쪽에 실제로 나온 낱말만 골라 보여 준다(vocabFor). */
    words: {
        "cover": [
            { w: "with no known author", k: "지은이가 알려지지 않은", s: "an old Korean story with no known author" },
            { w: "familiar", k: "어디서 들어 본 듯한", s: "If it feels familiar, you are right" },
            { w: "are found (find)", k: "발견된다", s: "Stories built this way are found all over the world" },
            { w: "quite the same", k: "똑같이", s: "But ours does not go quite the same way." },
            { w: "Watch for ~", k: "~을 눈여겨보다", s: "Watch for where it turns." },
            { w: "turns (turn)", k: "달라지다, 방향이 바뀌다", s: "Watch for where it turns." },
            { w: "red bean", k: "팥", s: "Patjwi means red bean" }
        ],
        "ch1": [
            { w: "born to him late", k: "늦게 얻은", s: "He had one daughter, born to him late" },
            { w: "not well off", k: "넉넉하지 않은", s: "The house was not well off" },
            { w: "begged milk (beg)", k: "젖동냥을 했다", s: "begged milk for her from house to house" },
            { w: "took turns (take turns)", k: "번갈아 했다", s: "The women of the village took turns to feed her" },
            { w: "quick with her hands", k: "손끝이 야무진", s: "Kongjwi was quick with her hands" },
            { w: "clicked their tongues (click)", k: "혀를 내둘렀다", s: "The neighbours clicked their tongues" },
            { w: "turn out so straight (turn out)", k: "저리 반듯하다", s: "to turn out so straight" },
            { w: "shed tears (shed)", k: "눈물을 흘렸다", s: "took Kongjwi's hand and even shed tears" },
            { w: "were only alive when ~", k: "~할 때만 살아 있었다", s: "those words were only alive when her father was listening" },
            { w: "every scrap of ~", k: "몽땅", s: "She gave Kongjwi every scrap of the kitchen work" },
            { w: "lift a finger", k: "손끝 하나 까딱하다", s: "would not let Patjwi lift a finger" },
            { w: "until the sun was high", k: "해가 중천에 뜨도록", s: "Patjwi stayed under her quilt until the sun was high" },
            { w: "put off answering (put off)", k: "대답을 미루었다", s: "Kongjwi never once put off answering" },
            { w: "on purpose", k: "일부러", s: "She would spill water in the yard on purpose" },
            { w: "struck ~ across the shins (strike)", k: "종아리를 때렸다", s: "Lady Bae struck Kongjwi across the shins" },
            { w: "find out (find out)", k: "알게 되다", s: "She was afraid that if she cried her father would find out" },
            { w: "had her kind face on (have on)", k: "다정한 얼굴이 되었다", s: "Lady Bae had her kind face on again" },
            { w: "The morning dew had not dried (dry)", k: "아침 이슬도 마르지 않았다", s: "The morning dew had not even dried yet" },
            { w: "a keen blue edge", k: "시퍼렇게 선 날", s: "an iron hoe with a keen blue edge" },
            { w: "whittled out of wood (whittle)", k: "나무를 깎아 만든", s: "a hoe whittled out of wood" },
            { w: "the size of a man's fist", k: "어른 주먹만 한", s: "The stones were the size of a man's fist" },
            { w: "glanced over at ~ (glance)", k: "힐끔 보았다", s: "she glanced over at Kongjwi's field" },
            { w: "crouched (crouch)", k: "엎드렸다", s: "Kongjwi crouched in the stony field" },
            { w: "ran up her wrist (run up)", k: "손아귀가 울렸다", s: "the shock ran up her wrist" },
            { w: "snapped clean off (snap off)", k: "뚝 부러졌다", s: "the blade snapped clean off" },
            { w: "blistered (blister)", k: "부르텄다", s: "Her palms blistered at once" },
            { w: "a quarter of it", k: "반의반", s: "And she had not done a quarter of it" },
            { w: "halter", k: "고삐", s: "It had no halter round its neck" },
            { w: "a ring through its nose", k: "코뚜레", s: "no ring through its nose" },
            { w: "It never crossed her mind (cross one's mind)", k: "그런 생각이 들지 않았다", s: "It never crossed Kongjwi's mind to be afraid" },
            { w: "turned over (turn over)", k: "뒤집혔다", s: "Stones flew up and the soil turned over" },
            { w: "bank", k: "밭둑", s: "Kongjwi stood on the bank and watched" },
            { w: "hoofprint", k: "발자국", s: "The ox's hoofprints stood clear on the bank" }
        ],
        "ch2": [
            { w: "was invited (invite)", k: "초대받았다", s: "Everyone in the village was invited" },
            { w: "pounded (pound)", k: "쳤다, 찧었다", s: "You could hear the rice cakes being pounded" },
            { w: "braided (braid)", k: "땋았다", s: "braided her hair beautifully" },
            { w: "had grown too short (grow)", k: "짧아졌다", s: "Kongjwi's sleeves had grown too short for her" },
            { w: "went over her mouth (go over)", k: "입가에 스쳤다", s: "A smile went over Lady Bae's mouth" },
            { w: "however much ~", k: "아무리 ~해도", s: "But however much she poured in, the jar did not fill" },
            { w: "pressed down on ~ (press down)", k: "짓눌렀다", s: "The pot pressed down on her shoulder" },
            { w: "the size of a fist", k: "주먹만 한", s: "a hole the size of a fist" },
            { w: "as fast as ~", k: "~하는 족족", s: "The water ran out into the ground as fast as she poured it" },
            { w: "dug away (dig away)", k: "파여 있었다", s: "The earth was dug away round the hole" },
            { w: "swimming with water", k: "물이 흥건한", s: "The yard was swimming with water" },
            { w: "went numb (go numb)", k: "저렸다", s: "Her arms went numb and her legs shook" },
            { w: "soaked (soak)", k: "다 젖었다", s: "Her skirt was soaked" },
            { w: "waddling (waddle)", k: "뒤뚱뒤뚱 걷는", s: "something came waddling out from under the wall" },
            { w: "lumpy", k: "울퉁불퉁한", s: "It was an old toad with a lumpy back" },
            { w: "stop that hole (stop)", k: "구멍을 막다", s: "I will stop that hole for you" },
            { w: "lay down flat (lie down)", k: "납작 엎드렸다", s: "crawled into the jar and lay down flat" },
            { w: "with its own body", k: "제 몸으로", s: "It had blocked the hole with its own body" },
            { w: "stepped round ~ instead of on ... (step round)", k: "밟지 않고 비켜 갔다", s: "you stepped round me in the yard instead of on me" },
            { w: "was about to ~ (be about to)", k: "막 ~하려던 참이었다", s: "Kongjwi had changed her clothes and was about to go out" },
            { w: "Her heart dropped (drop)", k: "가슴이 철렁했다", s: "Kongjwi's heart dropped" },
            { w: "stiffened (stiffen)", k: "굳었다", s: "Lady Bae's face stiffened when she saw the jar full" },
            { w: "as if nothing were the matter", k: "아무렇지 않은 척", s: "she spoke as if nothing were the matter" },
            { w: "unhulled rice", k: "벼", s: "There are three sacks of unhulled rice in the storeroom" },
            { w: "oddly soft", k: "유난히 부드러운", s: "The end of it was oddly soft" },
            { w: "piled up like a mountain (pile up)", k: "산더미처럼 쌓였다", s: "the rice was piled up like a mountain" },
            { w: "could hardly ~", k: "겨우 ~할 정도였다", s: "She could hardly get her foot over the threshold" },
            { w: "mortar", k: "절구", s: "Kongjwi dragged the mortar over" },
            { w: "pestle", k: "절굿공이", s: "The pestle was so heavy that she could barely lift it" },
            { w: "ready to fall off (fall off)", k: "떨어져 나갈 것 같은", s: "her arms felt ready to fall off" },
            { w: "barely a handful", k: "겨우 한 줌", s: "And the hulled rice was barely a handful" },
            { w: "kept slipping (slip)", k: "자꾸 미끄러졌다", s: "The pestle kept slipping in her hands" },
            { w: "The skin was off ~", k: "다 까졌다", s: "The skin was off both her palms" },
            { w: "settled on ~ (settle)", k: "내려앉았다", s: "The sparrows settled on the heaps of rice" },
            { w: "strip the husks (strip)", k: "껍질을 벗기다", s: "began to strip the husks with their beaks" },
            { w: "not one single grain", k: "한 톨도", s: "did not carry off one single grain" },
            { w: "In less than an hour", k: "한 시간이 채 못 되어", s: "In less than an hour three sacks of rice stood white and clean" }
        ],
        "ch3": [
            { w: "worn through (wear through)", k: "해졌다", s: "The sleeves of her jacket were worn through" },
            { w: "straw sandals", k: "짚신", s: "For shoes she had one pair of straw sandals" },
            { w: "showed on the water (show)", k: "물 위에 비쳤다", s: "something showed on the water" },
            { w: "came softly down (come down)", k: "사뿐 내려앉았다", s: "A pale green jacket and a deep red skirt came softly down into the yard" },
            { w: "embroidery", k: "수", s: "a pair of flower shoes with fine embroidery" },
            { w: "faint scent", k: "은은한 향", s: "There was a faint scent in the cloth" },
            { w: "could not bring herself to ~ (bring oneself)", k: "차마 ~하지 못했다", s: "Kongjwi could not bring herself to touch them" },
            { w: "fitted exactly (fit)", k: "꼭 맞았다", s: "They fitted exactly" },
            { w: "slippery with moss", k: "이끼에 덮여 미끄러운", s: "The log was slippery with moss" },
            { w: "one step at a time", k: "한 걸음씩", s: "moved one step at a time" },
            { w: "Make way", k: "물렀거라", s: "Make way" },
            { w: "procession", k: "행차", s: "A mounted procession came up" },
            { w: "her foot slipped (slip)", k: "발을 헛디뎠다", s: "Kongjwi was startled and hurried, and her foot slipped" },
            { w: "current", k: "물살", s: "was carried away by the current" },
            { w: "was ashamed of ~ (be ashamed)", k: "부끄러워했다", s: "She was ashamed of the foot with only one shoe on it" },
            { w: "was caught in ~ (catch)", k: "걸려 있었다", s: "Something was caught in the grass at the water's edge" },
            { w: "fished out (fish out)", k: "건져 올렸다", s: "What the servant fished out was one embroidered flower shoe" },
            { w: "notice", k: "방", s: "From the next day notices went up round the town" },
            { w: "fitted nobody (fit)", k: "아무에게도 맞지 않았다", s: "But it fitted nobody" },
            { w: "being forced in (force)", k: "억지로 밀어 넣어서", s: "Big feet split the toe of it being forced in" },
            { w: "dragged (drag)", k: "끌고 갔다", s: "she dragged Patjwi into the inner room" },
            { w: "a chance from heaven", k: "하늘이 준 기회", s: "This is a chance from heaven" },
            { w: "dropped her voice (drop)", k: "목소리를 낮췄다", s: "She shut the door and dropped her voice" },
            { w: "sesame oil", k: "참기름", s: "rubbed sesame oil on Patjwi's foot" },
            { w: "folded up (fold up)", k: "접혔다", s: "Her toes folded up inside it" },
            { w: "Bear it (bear)", k: "참아라", s: "Bear it a little and you will be the governor's lady" },
            { w: "twisted (twist)", k: "일그러졌다", s: "Patjwi's face twisted" },
            { w: "hanging out of ~ (hang out)", k: "밖으로 나와 있었다", s: "Half her heel was hanging out of the shoe" },
            { w: "limping (limp)", k: "절뚝거리며", s: "Patjwi went limping out into the yard" },
            { w: "crawled out of her (crawl)", k: "기어들어 갔다", s: "Her voice crawled out of her" },
            { w: "backed away (back away)", k: "뒷걸음질 쳤다", s: "Patjwi backed away" },
            { w: "barred it from outside (bar)", k: "밖에서 빗장을 질렀다", s: "barred it from outside" },
            { w: "soot", k: "그을음", s: "A girl with soot on her face was standing there" }
        ],
        "ch4": [
            { w: "could not let go (let go)", k: "놓지 못했다", s: "could not let go of it for a long while" },
            { w: "palanquin", k: "가마", s: "He waved until the palanquin was out of the gate" },
            { w: "a poor father", k: "못난 아비", s: "I was a poor father to you" },
            { w: "had grown rough (grow)", k: "거칠어졌다", s: "Her father's hands had grown rough" },
            { w: "their eyes were not (be)", k: "눈은 웃지 않았다", s: "Their faces were smiling but their eyes were not" },
            { w: "get used to ~ (get used)", k: "익숙해지다", s: "She could not get used to it at all" },
            { w: "in secret", k: "몰래", s: "she got up in secret every dawn and swept the yard" },
            { w: "My hands get bored", k: "손이 심심해서요", s: "My hands get bored" },
            { w: "went red (go red)", k: "얼굴을 붉혔다", s: "Kongjwi went red at that" },
            { w: "whatever it is", k: "무엇이든", s: "I will give you whatever it is" },
            { w: "blinked (blink)", k: "눈을 껌뻑였다", s: "The governor blinked" },
            { w: "when I was in trouble", k: "어려울 때", s: "an ox that ploughed a stony field for me when I was in trouble" },
            { w: "had ~ searched (have)", k: "뒤지게 했다", s: "The governor sent men out and had the whole district searched" },
            { w: "drove it off (drive off)", k: "쫓아냈다", s: "However often the servants drove it off" },
            { w: "did not run away (run away)", k: "달아나지 않았다", s: "The toad did not run away even when people came near" },
            { w: "my guests", k: "제 손님", s: "Those birds are my guests" },
            { w: "quite unlike before", k: "예전과 딴판으로", s: "Patjwi was kind, quite unlike before" },
            { w: "It's all past now", k: "다 지난 일이다", s: "It's all past now" },
            { w: "did not grudge ~ (grudge)", k: "아까워하지 않았다", s: "Kongjwi did not grudge her any of it" },
            { w: "on state business", k: "나랏일로", s: "the governor had to go up to Hanyang on state business" },
            { w: "see him off (see off)", k: "배웅하다", s: "Kongjwi came out to the gate to see him off" },
            { w: "unusually", k: "유난히", s: "Patjwi's voice was unusually kind" },
            { w: "lay broad across ~ (lie)", k: "넓게 깔려 있었다", s: "lotus leaves lay broad across it" },
            { w: "turned up her clothes (turn up)", k: "옷을 걷었다", s: "Kongjwi turned up her clothes and sat at the edge" },
            { w: "the way ~ was pointing (point)", k: "가리키는 쪽으로", s: "Kongjwi turned her head the way Patjwi was pointing" },
            { w: "pushed ~ hard (push)", k: "힘껏 밀었다", s: "two hands pushed Kongjwi hard" },
            { w: "heaved (heave)", k: "크게 일었다", s: "The water heaved a few times" },
            { w: "went smooth (go smooth)", k: "잔잔해졌다", s: "and then went smooth again" },
            { w: "barred the door (bar)", k: "문을 걸어 잠갔다", s: "went into Kongjwi's room and barred the door" },
            { w: "could not sleep (sleep)", k: "잠들지 못했다", s: "the sparrows could not sleep and chirped all night" }
        ],
        "ch5": [
            { w: "The moment ~", k: "~하자마자", s: "The moment he was off his horse" },
            { w: "boil", k: "종기", s: "I have a boil on my face" },
            { w: "rougher (rough)", k: "걸걸한", s: "It was lower and rougher than usual" },
            { w: "must be ~ (must)", k: "~ 때문이려니 했다", s: "the governor thought it must be the illness" },
            { w: "in such a state", k: "이리 상한", s: "How has your face got into such a state" },
            { w: "gone deeper (go deep)", k: "굵어졌다", s: "Even the voice had gone deeper" },
            { w: "tipped his head (tip)", k: "고개를 갸웃했다", s: "The governor tipped his head" },
            { w: "no longer ~", k: "더 이상 ~하지 않았다", s: "His wife no longer swept the yard at dawn" },
            { w: "pull down (pull down)", k: "헐어 버리다", s: "she had the servants pull down every sparrow's nest" },
            { w: "put out buds (put out)", k: "봉오리를 맺었다", s: "The other lotuses had not even put out buds" },
            { w: "from a long way off", k: "멀리서도", s: "you could see it from a long way off" },
            { w: "closed up (close up)", k: "오므라들었다", s: "when his wife went past, the petals closed up" },
            { w: "bent over (bend)", k: "휘었다", s: "the lotus stem bent over and struck her across the hair" },
            { w: "this minute", k: "당장", s: "Cut that flower down and put it in the stove this minute" },
            { w: "would not burn (burn)", k: "타지 않았다", s: "But it would not burn" },
            { w: "however hard ~", k: "아무리 ~해도", s: "However hard they built the fire" },
            { w: "ashes", k: "잿더미", s: "And then in the ashes one red bead lay shining" },
            { w: "somehow", k: "어쩐지", s: "Somehow she could not throw it away" },
            { w: "the one thing that ~", k: "그것만", s: "it was the one thing that was not hot" },
            { w: "half woke (wake)", k: "잠결에 깼다", s: "The old woman half woke" },
            { w: "pitch dark", k: "캄캄한", s: "The room was pitch dark with no lamp lit" },
            { w: "started up in fright (start up)", k: "소스라쳐 일어났다", s: "The old woman started up in fright" },
            { w: "clapped a hand over her mouth (clap)", k: "입을 틀어막았다", s: "The old woman clapped a hand over her mouth" },
            { w: "with her own hands", k: "제 손으로", s: "she pushed me into the pond with her own hands" },
            { w: "come together (come together)", k: "하나로 꿰어지다", s: "did the whole of it come together for her" },
            { w: "The hair rose (rise)", k: "소름이 돋았다", s: "The hair rose on the old woman's back" },
            { w: "if you only say it (say)", k: "말로만 하면", s: "he will not believe you if you only say it" },
            { w: "faded away (fade away)", k: "스르르 사라졌다", s: "And then she faded away" },
            { w: "Wondering what ~ (wonder)", k: "무슨 일인가 하여", s: "Wondering what it could be, he followed her in" },
            { w: "a pair of chopsticks", k: "젓가락 한 쌍", s: "laid down a pair of chopsticks on the table" },
            { w: "frowned (frown)", k: "눈살을 찌푸렸다", s: "The governor frowned" },
            { w: "has been swapped (swap)", k: "짝이 바뀌었다", s: "when a person has been swapped" },
            { w: "went hard (go hard)", k: "굳었다", s: "The governor's face went hard" },
            { w: "rolled off ~ (roll off)", k: "굴러 떨어졌다", s: "the red bead rolled off the chest" }
        ],
        "ch6": [
            { w: "Bail out ~ (bail out)", k: "퍼내다", s: "Bail out every drop of water in the pond" },
            { w: "showed (show)", k: "드러났다", s: "By midday the bottom of the pond showed" },
            { w: "lifted ~ away (lift away)", k: "걷어 냈다", s: "The servants lifted the mud away very carefully" },
            { w: "as if asleep", k: "잠든 듯이", s: "Kongjwi lay there as if asleep" },
            { w: "was not harmed (harm)", k: "상하지 않았다", s: "her body was not harmed at all" },
            { w: "kept watch (keep watch)", k: "곁을 지켰다", s: "a toad had kept watch beside her for months" },
            { w: "sank away (sink)", k: "스며들 듯 사라졌다", s: "The bead sank away as if soaking in" },
            { w: "drew a great breath (draw)", k: "크게 숨을 들이켰다", s: "Kongjwi drew a great breath" },
            { w: "reached ~ (reach)", k: "~에 닿았다", s: "The news reached the inner rooms" },
            { w: "caught (catch)", k: "붙들렸다", s: "And then she was caught in the yard" },
            { w: "thundered at ~ (thunder)", k: "호령했다", s: "The governor thundered at them" },
            { w: "by the law of the land", k: "국법대로", s: "deal with you by the law of the land" },
            { w: "took hold of ~ (take hold)", k: "붙잡았다", s: "Then Kongjwi took hold of the governor's sleeve" },
            { w: "get ahead of ~ (get ahead)", k: "앞서다", s: "your mother told you only to get ahead of me" },
            { w: "covered her face (cover)", k: "얼굴을 감쌌다", s: "Lady Bae covered her face at that" },
            { w: "sank down (sink down)", k: "주저앉았다", s: "Lady Bae sank down where she stood" },
            { w: "Even so", k: "그래도", s: "Even so, not prison" },
            { w: "Never let ~ into ... (let)", k: "다시는 들이지 마라", s: "Never let them into this land again" },
            { w: "Would that be a punishment?", k: "그것이 벌이 되겠소?", s: "Would that be a punishment" },
            { w: "sharper (sharp)", k: "더 아픈", s: "Is there a sharper punishment" },
            { w: "nodded (nod)", k: "고개를 끄덕였다", s: "After a long moment the governor nodded" },
            { w: "were put out of ~ (put out)", k: "쫓겨났다", s: "Lady Bae and Patjwi were put out of the district that same day" },
            { w: "exactly once", k: "딱 한 번", s: "As she went through the gate Patjwi looked back exactly once" },
            { w: "to the end", k: "끝까지", s: "Kongjwi stood where she was and watched to the end" },
            { w: "once more", k: "한 번 더", s: "every time, Kongjwi set the table once more" },
            { w: "has turned up (turn up)", k: "나타났다", s: "Someone has turned up who says he has seen the ox" },
            { w: "snuffed at ~ (snuff)", k: "킁킁거렸다", s: "The ox put its nose to Kongjwi's shoulder and snuffed at her" },
            { w: "put her arms round ~ (put)", k: "끌어안았다", s: "Kongjwi put her arms round the ox's neck" },
            { w: "the rest of its life", k: "여생", s: "The black ox spent the rest of its life in the back garden" },
            { w: "shook her head (shake)", k: "고개를 저었다", s: "every time she heard it Kongjwi shook her head" },
            { w: "made her ashamed (make)", k: "부끄럽게 했다", s: "The word made her ashamed" },
            { w: "when things were hard", k: "어려울 때", s: "there were some who helped me when things were hard" },
            { w: "turned out to be ~ (turn out)", k: "알고 보니 ~이었다", s: "they turned out to be the ones I had once stepped round" }
        ],
        "after": [
            { w: "the same bones as ~", k: "~과 뼈대가 같은", s: "It has the same bones as Cinderella" },
            { w: "sprang up (spring up)", k: "생겨났다", s: "It is not that the same story sprang up in places that had never met" },
            { w: "carried from person to person (carry)", k: "사람에서 사람으로 건너다녔다", s: "carried from person to person for a very long time" },
            { w: "nearest to hand", k: "가장 가까운", s: "into whatever is nearest to hand in that country" },
            { w: "only halfway", k: "겨우 절반", s: "In Kongjwi and Patjwi that is only halfway" },
            { w: "takes her own place back (take back)", k: "제 자리를 되찾다", s: "does not stay disappeared but takes her own place back" },
            { w: "Count up ~ (count up)", k: "세어 보다", s: "Count up what helped Kongjwi" },
            { w: "fairy godmother", k: "요정 대모", s: "There is no fairy godmother and no magic wand" },
            { w: "came over to her side (come over)", k: "돕는 편이 되었다", s: "are exactly the things that came over to her side" },
            { w: "with its own body", k: "제 몸으로", s: "It only stopped the hole with its own body" },
            { w: "making it possible for ~ (make possible)", k: "할 수 있게 해 주는 것", s: "but making it possible for them to do it" },
            { w: "any number of ~", k: "얼마든지", s: "There are any number of people with the same size feet" },
            { w: "holds where a person has walked (hold)", k: "어디를 걸었는지를 담고 있다", s: "a shoe is a thing that holds where a person has walked" },
            { w: "was not born unkind (bear)", k: "태어날 때부터 못되지는 않았다", s: "This child was not born unkind" },
            { w: "by watching ~ (watch)", k: "보고 배웠다", s: "she learned by watching what her mother did" },
            { w: "must not be left out (leave out)", k: "빼놓을 수 없다", s: "The father must not be left out either" },
            { w: "simply was not there", k: "다만 집에 없었다", s: "He simply was not there" },
            { w: "do not need only ~", k: "~만 필요한 것은 아니다", s: "bad things do not need only bad people to happen" },
            { w: "is ashamed to be told (be ashamed)", k: "그 말을 부끄러워하다", s: "where Kongjwi is ashamed to be told that she has a great deal of luck" },
            { w: "two different things", k: "다른 일", s: "are being good and being lucky two different things" },
            { w: "come forward (come forward)", k: "나서다", s: "She could have simply come forward and said so" },
            { w: "gives no answer (give)", k: "답해 주지 않는다", s: "to that question the story gives no answer" }
        ]
    },
    quiz: [
        { q: "What kind of hoe did the stepmother give Kongjwi?", choices: ["A new iron one", "One made of wood", "One with a very blunt edge"], answer: 1 },
        { q: "What ploughed the stony field for her?", choices: ["A farmhand from next door", "A traveller passing by", "A black ox"], answer: 2 },
        { q: "What stopped the hole in the bottomless jar?", choices: ["A toad", "A big soft-shelled turtle", "A snake"], answer: 0 },
        { q: "What did the sparrows do for Kongjwi?", choices: ["They stopped the hole in the jar", "They ploughed the stony field", "They hulled all three sacks of rice"], answer: 2 },
        { q: "What did Kongjwi lose on her way to the feast?", choices: ["One flower shoe", "A jade hairpin", "A silk handkerchief"], answer: 0 },
        { q: "Who picked up the flower shoe?", choices: ["The master of the feast house", "The governor of that province", "A trader in the market"], answer: 1 },
        { q: "What did Patjwi do to get the flower shoe on?", choices: ["She stretched the shoe in secret", "She forced her foot into it", "She put out a different shoe instead"], answer: 1 },
        { q: "What did Patjwi do to Kongjwi at the pond?", choices: ["She went into the water with her", "She went home ahead of her", "She pushed her hard from behind"], answer: 2 },
        { q: "What opened at the edge of the pond?", choices: ["One red lotus", "A white plum tree", "A bunch of yellow chrysanthemums"], answer: 0 },
        { q: "What did the old woman put in front of the governor?", choices: ["Kongjwi's wooden comb", "The flower shoe from the pond", "A pair of chopsticks that did not match"], answer: 2 },
        { q: "What happened to Patjwi when she tried to run?", choices: ["She fell climbing the wall", "She knelt down in the yard", "She got away at once"], answer: 0 },
        { q: "What did Kongjwi ask the governor for?", choices: ["To give her back the flower shoe", "To find her the black ox", "To fill in the pond"], answer: 1 },
        {
            q: "Which reaction to this book does NOT fit?",
            wide: true,
            choices: [
                "She was given a wooden hoe for a stony field, so it was set up so she could not do it.",
                "A black ox, a toad and sparrows helped in turn, so hands gather for what one person cannot carry.",
                "A pair of odd chopsticks settled it, so small things tell people apart better than large ones.",
                "A toad climbed in and plugged the broken jar, so it must have been a toad Kongjwi had kept."
            ],
            answer: 3
        }
    ],
    afterword: {
        title: 'After Reading',
        emoji: '🌺',
        art: ['end.webp'],
        paras: [
            "If this story felt familiar as you read it, you were right. A daughter who has lost her mother, a new mother and her daughter, the hard work, one lost shoe, and finding a person by that shoe. It has the same bones as Cinderella.",
            "There are several hundred stories built on these bones around the world. Scholars have gathered them up and counted, and they turn up on every continent. It is not that the same story sprang up in places that had never met; it is a story that has been carried from person to person for a very long time.",
            "In the Chinese Ye Xian, what helps the daughter is a fish. In Europe it is a fairy or a tree. The bones stay the same and only the helper changes into whatever is nearest to hand in that country.",
            "There is one place where our story is clearly different from the others. It does not end at the wedding. The western Cinderella ends when the shoe fits, with a line about living happily. In Kongjwi and Patjwi that is only halfway. Chapter four is where the real story starts.",
            "The second half begins after Kongjwi falls into the pond. She changes her shape, into a red lotus and then into a bead, to tell them she is here. It is a story in which the person who disappeared does not stay disappeared but takes her own place back. The western Cinderella has no such part at all.",
            "That is why Kongjwi and Patjwi ends in a different place in every book. Some close it when the shoe fits; some go on to the pond. This book goes to the pond. It needs that second half to be our story.",
            "Count up what helped Kongjwi. A black ox, a toad, and sparrows. There is no fairy godmother and no magic wand. There is a ploughing ox, a toad in the yard, sparrows under the eaves. The things people saw every day are exactly the things that came over to her side.",
            "The bottomless jar is worth looking at closely. What the toad did was not to carry the water. It only stopped the hole with its own body. Kongjwi still drew and poured the water with her own strength. That part says, without saying it, that helping is not doing a thing for someone but making it possible for them to do it.",
            "Finding a person by one shoe is strange when you think about it. There are any number of people with the same size feet. Perhaps the reason such stories exist all over the world is that a shoe is a thing that holds where a person has walked and how.",
            "Patjwi is worth looking at again too. This child was not born unkind. She did what her mother told her, and she learned by watching what her mother did. That is why it is Lady Bae and not Patjwi who sinks to the ground at the end.",
            "The father must not be left out either. This man did nothing wrong. He simply was not there. He was away at the markets and never once saw the marks on his daughter's shins. He shows that bad things do not need only bad people to happen.",
            "Remember the last page, where Kongjwi is ashamed to be told that she has a great deal of luck. What this story finally wanted to say is there.",
            "Was Kongjwi helped because she was good, or because she was lucky? She herself said they were the ones she had once stepped round instead of on. If that is so, are being good and being lucky two different things, or the same thing?",
            "Why did Kongjwi tell them she was there by turning into a lotus and a bead? She could have simply come forward and said so, and she did not. Think about what a person can do in front of people who would not believe them anyway.",
            "Why did Lady Bae hate Kongjwi? Kongjwi never did her one wrong thing. How it comes about that a person is hated who has done nothing wrong — to that question the story gives no answer."
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
