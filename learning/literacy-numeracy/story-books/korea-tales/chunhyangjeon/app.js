const BOOK_TITLE = "춘향전";

const CHAPTER_LABEL = n => (LANG === 'en' ? `Chapter ${n} · ` : `${n}장 · `);

const CHAPTERS = [
    {
        num: 1,
        title: "광한루에서",
        art: ["story-01-a.webp", "story-01-b.webp", "story-01-c.webp"],
        artAt: ["그네였습니다", "부르면 가는 사람은 아니라고", "성은 성이요, 이름은 춘향이라 합니다"],
        paras: [
            "전라도 남원 땅에 광한루라는 누각이 있었습니다. 앞으로는 맑은 물이 흐르고 둘레에는 버드나무가 늘어져, 남원에서 경치 좋기로 으뜸가는 자리였습니다. 봄이면 꽃구경 온 사람으로 난간이 비좁았습니다. 난간에 기대면 남원 성안이 한눈에 들어왔습니다.",
            "그해 단오였습니다. 단오는 음력 오월 초닷샛날로, 여자들은 창포물에 머리를 감고 그네를 뛰고 남자들은 씨름을 하는 큰 명절이었습니다. 아침부터 강가에 사람이 그득했습니다.",
            "남원 사또의 아들 이몽룡은 그날 방자<span class=\"gloss\">(관가에서 심부름하던 남자 하인)</span>를 데리고 광한루에 올랐습니다. 나이 열여섯, 글은 잘 읽었으나 아직 세상 구경은 못 해 본 도령이었습니다. 아버지가 글만 읽으라 하여 바깥출입이 드물었습니다. 광한루에 오른 것도 그날이 처음이었습니다.",
            "\"방자야, 저 아래가 다 보이는구나.\"<br>\"그럼입쇼. 남원 바닥에서 여기보다 높은 데가 어디 있습니까.\"",
            "이몽룡이 난간에 기대어 사방을 둘러보는데, 문득 저 건너 버드나무 숲이 눈에 들어왔습니다. 버들가지가 물 위까지 늘어져 있었습니다. 그 사이로 무언가 오르락내리락했습니다.",
            "다홍치마 자락이 바람을 안고 하늘로 솟았다가 다시 내려오고, 또 솟았다가 내려왔습니다. 그네였습니다. 댕기 끝이 하늘에 닿을 듯했습니다.",
            "\"방자야. 저기 저것이 무엇이냐.\"<br>\"그네입지요.\"<br>\"그네 말고, 그네 탄 사람 말이다.\" 이몽룡이 난간에서 몸을 앞으로 내밀었습니다.",
            "방자가 눈을 가늘게 뜨더니 대수롭지 않게 대답했습니다.<br>\"아, 저건 춘향이올시다. 월매라는 이의 딸인데, 남원에서 글도 잘하고 인물도 곱기로 소문났습지요.\" 말끝에 슬쩍 도련님의 눈치를 살폈습니다.",
            "이몽룡은 한참 동안 아무 말도 하지 못했습니다. 그러다 겨우 입을 열었습니다.<br>\"…불러 오너라.\" 방자가 눈을 동그랗게 떴습니다.",
            "방자가 펄쩍 뛰었습니다.<br>\"도련님, 그 댁 아가씨가 오라 한다고 올 사람이 아닙니다.\"<br>\"그래도 가 보아라.\" 방자가 발을 동동 굴렀습니다.",
            "방자가 버드나무 숲으로 건너갔습니다. 한참 뒤에 혼자 돌아와 머리를 긁적였습니다.<br>\"뭐라 하더냐.\"<br>\"…제가 기생<span class=\"gloss\">(잔치에서 노래와 춤으로 손님을 모시던 여자)</span>의 딸이기는 하나 부르면 가는 사람은 아니라고, 하실 말씀이 있으면 직접 오시라고 하옵니다.\" 방자의 목소리가 점점 작아졌습니다.",
            "이몽룡의 얼굴이 붉어졌습니다. 그러나 화가 난 것은 아니었습니다.<br>\"…옳은 말이다.\"",
            "이몽룡은 스스로 걸어서 버드나무 숲으로 갔습니다. 춘향이 그네에서 내려 옷매무새를 고치고 서 있었습니다. 숲 안이 서늘하고 조용했습니다. 물소리만 멀리서 들려왔습니다.",
            "\"내가 아까 사람을 보낸 것은 무례였소. 용서하시오.\"<br>춘향이 그제야 고개를 들었습니다. 두 사람의 눈이 마주쳤습니다. 이몽룡이 먼저 고개를 숙였습니다.",
            "\"성함이 어찌 되시오.\"<br>\"성은 성이요, 이름은 춘향이라 합니다.\"<br>\"봄 향기라는 뜻이오?\"<br>\"예.\"",
            "이몽룡이 저도 모르게 웃었습니다.<br>\"오늘 광한루에 봄이 왜 이리 짙은가 했더니 까닭이 있었구려.\"",
            "춘향은 대꾸하지 않았습니다. 다만 귀 끝이 발갛게 물들었습니다. 멀리서 그네 줄이 흔들리는 소리가 났습니다.",
            "\"오늘 저녁에 댁으로 찾아가도 되겠소?\"<br>\"저희 어머니께 여쭈어 보십시오. 저 혼자 정할 일이 아닙니다.\"",
            "그러고는 그네 줄을 걷어 어깨에 걸치고 돌아섰습니다. 이몽룡은 그 뒷모습이 버드나무 사이로 사라질 때까지 그 자리에 서 있었습니다. 그네 줄이 어깨에서 흔들렸습니다. 버들잎이 그 자리를 덮었습니다.",
            "돌아오는 길에 방자가 슬쩍 물었습니다.<br>\"도련님, 무슨 이야기를 그리 오래 하셨습니까.\"<br>\"…책에 없는 것을 하나 배웠다.\"",
            "그날 밤 이몽룡은 글이 눈에 들어오지 않았습니다. 책장을 넘겨도 그네가 오르내리고, 붓을 들어도 다홍치마가 어른거렸습니다. 등잔 심지가 다 타도록 그러고 있었습니다.",
            "마침내 이몽룡은 책을 덮고 일어섰습니다.<br>\"방자야. 등불을 들어라.\" 방자가 눈을 비비며 등불을 챙겼습니다."
        ]
    },
    {
        num: 2,
        title: "백년가약",
        art: ["story-02-a.webp", "story-02-b.webp", "story-02-c.webp"],
        artAt: ["문을 열어 준 것은 춘향의 어머니 월매였습니다", "끝에 제 이름을 적고 손도장을 찍었습니다", "마루에 나란히 앉아 이야기를 했습니다"],
        paras: [
            "춘향의 집은 남원 성 밖 조용한 골목에 있었습니다. 담 안에 대나무가 서 있고 마당에는 국화 화분이 줄지어 놓여 있었습니다. 대나무 잎이 바람에 서걱거렸습니다.",
            "문을 열어 준 것은 춘향의 어머니 월매였습니다. 월매는 젊은 시절 기생이었다가 이제는 딸 하나를 키우며 조용히 사는 사람이었습니다. 손끝에 굳은살이 박여 있었습니다.",
            "\"사또 댁 도련님이 이 밤중에 어인 일이십니까.\"<br>\"춘향과 백년가약<span class=\"gloss\">(평생을 함께하기로 맺는 약속)</span>을 맺고 싶어 왔습니다.\"",
            "월매의 얼굴이 굳었습니다. 방 안에 한참 동안 아무 소리도 나지 않았습니다. 이윽고 입을 열었는데 목소리가 낮았습니다.",
            "\"도련님, 저는 기생이었습니다. 그러니 제 딸도 세상 눈에는 기생의 딸입니다.\"<br>\"압니다.\"",
            "\"사또께서 아시면 어찌 되겠습니까. 도련님은 언젠가 한양으로 올라가실 분입니다. 그때 우리 아이는 무엇이 됩니까.\" 월매의 눈이 젖어 있었습니다.",
            "이몽룡은 한동안 아무 말도 하지 못했습니다. 월매의 말이 하나도 틀리지 않았기 때문입니다.",
            "\"…어머님 말씀이 다 옳습니다. 그래서 종이에 적어 드리려 합니다.\"",
            "이몽룡은 붓을 청해 종이에 글을 썼습니다. 춘향을 아내로 맞아 평생 저버리지 않겠다는 글이었습니다. 그리고 끝에 제 이름을 적고 손도장을 찍었습니다. 붓을 쥔 손이 조금도 떨리지 않았습니다.",
            "\"도련님, 이런 종이가 무슨 힘이 있겠습니까?\"<br>\"힘이 없으면 없는 대로 두십시오. 다만 제가 스스로에게 한 약속입니다.\"",
            "월매는 그 종이를 한참 들여다보다가 접어서 품에 넣었습니다. 그러고는 방문 쪽을 돌아보았습니다.<br>\"춘향아, 나오너라.\" 종이가 손안에서 바스락거렸습니다.",
            "그해 가을 두 사람은 혼례를 올렸습니다. 큰 잔치는 아니었습니다. 월매와 방자와 이웃 몇이 모인 조촐한 자리였습니다. 국화가 마당 가득 피어 있었습니다.",
            "그 뒤로 이몽룡은 낮에는 글을 읽고 저녁이면 춘향의 집으로 갔습니다.",
            "둘은 마루에 나란히 앉아 이야기를 했습니다. 이몽룡이 책에서 읽은 것을 이야기하면 춘향이 되물었습니다. 달이 마루 끝까지 들어왔습니다.",
            "\"도련님, 그 책에는 백성 이야기가 나옵니까?\"<br>\"…나오지 않는구려.\"<br>\"그럼 그 책은 반쪽이네요.\"",
            "이몽룡은 그 말에 한참을 웃었습니다. 그러고는 진지해졌습니다.<br>\"그대는 어디서 그런 것을 배웠소.\"<br>\"저잣거리에서요. 거기 앉아 있으면 다 들립니다.\" 춘향의 목소리가 담담했습니다.",
            "겨울이 되자 춘향이 이몽룡에게 글씨를 가르쳐 달라 했습니다. 이몽룡이 붓을 잡아 주었습니다. 벼루에 먹을 갈아 놓고 기다렸습니다.",
            "\"무슨 글자부터 쓰고 싶소?\"<br>\"사람 인 자요.\"<br>\"어찌 그 글자요?\"<br>\"제일 어려운 글자라고 들었습니다.\"",
            "그렇게 한 해가 갔습니다. 두 사람은 그 시절이 그냥 이어질 줄로만 알았습니다. 봄이 가고 여름이 가고 가을이 갔습니다.",
            "그러나 이듬해 봄, 한양에서 사람이 내려왔습니다. 남원 사또가 벼슬이 올라 한양으로 가게 되었다는 기별이었습니다. 관가가 하루아침에 부산해졌습니다.",
            "이몽룡이 그 소식을 들은 것은 아버지의 방에서였습니다.<br>\"짐을 꾸려라. 사흘 뒤에 떠난다.\"<br>\"아버님, 저는…\"<br>\"너도 함께 간다. 과거<span class=\"gloss\">(벼슬아치를 뽑던 나라 시험)</span>를 보아야지.\"",
            "이몽룡은 그 자리에 한참을 서 있다가 밖으로 나왔습니다. 마당에 봄볕이 환했습니다. 광한루에서 그네를 처음 본 날과 꼭 같은 볕이었습니다. 담 밖에서 새소리가 요란했습니다."
        ]
    },
    {
        num: 3,
        title: "이별",
        art: ["story-03-a.webp", "story-03-b.webp", "story-03-c.webp"],
        artAt: ["손바닥만 한 거울이었습니다", "제 손가락에서 옥가락지를 빼어", "성 밖 오리정"],
        paras: [
            "그날 저녁 이몽룡은 춘향의 집으로 갔습니다. 대문 앞에서 몇 번이나 걸음을 돌렸다가 다시 섰습니다. 손에 아무것도 들지 않은 채였습니다.",
            "방으로 들어서자 춘향이 먼저 알아보았습니다.<br>\"…무슨 일이 있으셨군요.\" 얼굴빛만 보고 알아챈 것이었습니다.",
            "이몽룡은 그 자리에 앉아 이야기를 다 했습니다. 아버지의 벼슬, 사흘 뒤의 출발, 한양의 과거. 말하는 동안 고개를 들지 못했습니다.",
            "말이 끝나고도 한참 동안 방 안이 조용했습니다. 등잔불만 흔들렸습니다. 창밖에서 소쩍새 울음소리가 났습니다.",
            "\"언제 돌아오십니까.\"<br>\"…모르겠소.\"",
            "춘향이 고개를 끄덕였습니다. 울지 않았습니다. 다만 손끝이 떨렸습니다. 무릎 위에 놓인 손이었습니다.",
            "\"도련님. 한 가지만 여쭙겠습니다.\"<br>\"말하시오.\"<br>\"한양에 가시면 저를 잊으십니까?\"",
            "이몽룡이 벌떡 일어났습니다.<br>\"그 무슨 말이오!\" 목소리가 저도 모르게 높아졌습니다.<br>\"화내지 마십시오. 저는 답을 들으려는 것이 아닙니다.\"",
            "춘향이 조용히 말을 이었습니다.<br>\"사람 마음은 사람이 어찌하지 못하는 것입니다. 다만 저는 제 마음을 압니다. 그것만 말씀드리려는 것입니다.\"",
            "그러고는 반짇고리에서 무언가를 꺼냈습니다. 손바닥만 한 거울이었습니다. 오래 닦아 테가 반들반들했습니다.",
            "\"이것을 가져가십시오. 거울은 있는 그대로를 비추지요. 도련님이 어떤 사람이 되시든 이 거울은 그것을 그대로 비출 겁니다.\"",
            "이몽룡은 그 거울을 두 손으로 받았습니다. 그러고는 제 손가락에서 옥가락지를 빼어 춘향에게 주었습니다. 가락지가 등잔불을 받아 반짝였습니다.",
            "\"이것은 우리 어머니가 주신 것이오. 이 가락지가 내 손에 없는 동안, 나는 아직 남원에 있는 것이오.\"",
            "이튿날 새벽, 사또 일행이 남원을 떠났습니다. 관속들이 늘어서고 짐수레가 줄지어 섰습니다. 새벽안개가 자욱했습니다.",
            "춘향은 성 밖 오리정<span class=\"gloss\">(고을에서 오 리쯤 떨어진 곳에 세워, 오가는 사람을 보내고 맞던 정자)</span>까지 따라 나왔습니다. 월매도 뒤에 서 있었습니다. 오리정에는 떠나는 사람과 보내는 사람이 여럿 서 있었습니다.",
            "\"몸조심하시오.\"<br>\"도련님도요.\"<br>더 할 말이 있었지만 두 사람 다 하지 못했습니다. 말고삐를 잡은 손에 힘이 들어갔습니다.",
            "말이 움직이기 시작했습니다. 이몽룡은 몇 번이나 뒤를 돌아보았습니다. 춘향은 그 자리에 그대로 서 있었습니다.",
            "고갯마루에서 이몽룡이 말을 세웠습니다. 이몽룡의 눈에 춘향이 점점 작아졌습니다. 마침내 점이 되었다가 사라졌습니다.",
            "춘향은 해가 다 기울도록 오리정에 서 있었습니다. 월매가 몇 번이나 소매를 잡아끌었습니다. 치맛자락이 이슬에 다 젖었습니다.",
            "\"들어가자. 남들이 본다.\"<br>\"조금만 더요.\"",
            "그날 밤 춘향은 옥가락지를 실에 꿰어 목에 걸었습니다. 그러고는 등잔불 아래에서 사람 인 자를 쓰고 또 썼습니다. 가락지가 가슴께에서 서늘했습니다.",
            "한양에서는 이몽룡이 밤새 책을 읽었습니다. 거울은 책상 위에 세워 두었습니다. 고개를 들 때마다 제 얼굴이 보였습니다. 글자가 눈에 들어오지 않는 밤도 있었습니다."
        ]
    },
    {
        num: 4,
        title: "새로 온 사또",
        art: ["story-04-a.webp", "story-04-b.webp", "story-04-c.webp"],
        artAt: ["행차부터 요란했습니다", "사령들이 춘향의 집으로 갔습니다", "오늘부터 네 이름을 기생 명부에 올리겠다"],
        paras: [
            "이몽룡이 남원을 떠난 지 세 해째 되던 봄, 남원에 새 사또가 왔습니다. 이름은 변학도라 했습니다. 남원 사람들이 길가에 나와 구경했습니다.",
            "부임<span class=\"gloss\">(새 벼슬자리로 오는 것)</span> 행차부터 요란했습니다. 가마 뒤로 짐수레가 열 대나 따라왔고, 그 안에는 비단이며 그릇이며 세간이 그득했습니다. 구경하던 사람들이 서로 얼굴을 쳐다보았습니다.",
            "변학도는 자리에 앉자마자 관속들을 불러 모았습니다. 관속들이 문서를 안고 줄지어 섰습니다. 그런데 묻는 것이 이상했습니다.",
            "\"이 고을 창고에 곡식이 얼마나 있느냐.\"<br>\"예, 그것이…\"<br>\"됐다. 그건 나중에 보고. 이 고을에 이름난 기생이 몇이나 되느냐?\"",
            "관속들이 서로 눈치를 보았습니다. 누구도 선뜻 입을 열지 못했습니다.",
            "\"어허, 귀가 먹었느냐. 기생 명부를 가져오너라.\"",
            "그날부터 남원 관가에서는 날마다 잔치가 벌어졌습니다. 풍악 소리가 담을 넘어 저잣거리까지 들렸습니다. 밤이 깊어도 불이 꺼지지 않았습니다.",
            "잔치에 드는 것은 다 고을 창고에서 나갔습니다. 그해 봄에 걷은 세금이 석 달 만에 바닥났습니다. 곳간 문이 활짝 열린 채였습니다.",
            "그러자 변학도는 아직 걷지 않은 이듬해 세금까지 미리 걷으라 했습니다. 못 내는 집에서는 솥을 떼어 갔습니다. 아이들 밥그릇까지 가져갔습니다.",
            "그러던 어느 날, 변학도가 기생 명부를 넘기다가 손을 멈췄습니다.<br>\"이 고을에 춘향이라는 아이가 있다지?\"",
            "옆에 있던 아전<span class=\"gloss\">(관가에서 실무를 보던 하급 관리)</span>이 조심스레 아뢰었습니다.<br>\"있사옵니다. 그런데 그 아이는 기생이 아니옵니다.\" 아전의 이마에 땀이 맺혔습니다.",
            "\"기생의 딸이 어찌 기생이 아니냐.\"<br>\"이미 지아비가 있는 몸이라 하옵니다. 전 사또 댁 도련님과…\"",
            "변학도가 껄껄 웃었습니다.<br>\"그 도련님이 지금 어디 있느냐? 한양에 있지 않느냐? 한양이 여기서 몇 리인고?\" 웃음소리가 마당까지 울렸습니다.",
            "\"…칠백 리쯤 되옵니다.\"<br>\"칠백 리 밖의 사내가 무슨 지아비냐. 데려오너라.\"",
            "사령들이 춘향의 집으로 갔습니다. 월매가 대문을 막고 섰습니다.<br>\"우리 아이는 기생이 아닙니다!\"<br>\"사또 분부요. 비키시오.\" 사령들의 발소리가 골목을 울렸습니다.",
            "춘향이 방에서 나왔습니다. 옷매무새를 단정히 하고 머리를 곱게 빗은 채였습니다.<br>\"어머니, 괜찮습니다. 다녀오겠습니다.\" 떨리는 기색이 조금도 없었습니다.",
            "\"춘향아!\"<br>\"불려 가는 것을 안 갈 수는 없지요. 다만 갔다가 그냥 돌아오면 됩니다.\"",
            "관가 마당에는 이미 사람이 그득했습니다. 무슨 구경이라도 난 듯 담 밖까지 사람이 늘어섰습니다. 담장 위에까지 아이들이 올라앉아 목을 뺐습니다.",
            "변학도가 대청에 앉아 춘향을 내려다보았습니다. 한참을 보더니 흡족한 얼굴이 되었습니다.",
            "\"과연 소문대로구나. 오늘부터 네 이름을 기생 명부에 올리겠다. 관가에 들어와 내 곁에서 시중을 들어라.\" 말끝에 부채를 접었습니다.",
            "마당이 조용해졌습니다. 사람들이 숨을 죽이고 춘향의 입을 보았습니다. 바람 소리마저 멎은 것 같았습니다.",
            "춘향이 고개를 들었습니다. 목소리는 크지 않았지만 마당 끝까지 또렷하게 들렸습니다.<br>\"사또, 저는 이미 지아비가 있는 사람입니다.\""
        ]
    },
    {
        num: 5,
        title: "옥에 갇히다",
        art: ["story-05-a.webp", "story-05-b.webp", "story-05-c.webp"],
        artAt: ["매를 맞으면서도 소리를 지르지 않았습니다", "그날로 남원 옥에 갇혔습니다", "어느 고을로 가겠느냐"],
        paras: [
            "변학도의 얼굴에서 웃음이 사라졌습니다.<br>\"지아비라니. 혼서<span class=\"gloss\">(혼인을 약속하며 주고받던 문서)</span>가 있느냐? 나라에 올린 문서가 있느냐?\" 부채를 쥔 손에 힘이 들어갔습니다.",
            "\"종이는 있습니다.\"<br>\"기생의 딸이 도령과 주고받은 종이 쪼가리가 무슨 문서란 말이냐!\"",
            "\"사또께서 문서가 아니라 하시면 문서가 아니겠지요.\"<br>춘향이 담담하게 말했습니다.<br>\"그래도 제 마음은 제 것입니다. 그것까지 사또께서 정하실 수는 없습니다.\" 마당에 있던 사람들이 서로 얼굴을 쳐다보았습니다.",
            "변학도가 상을 내리쳤습니다.<br>\"저것이 사또를 능멸하는구나! 매를 들어라!\" 상 위의 잔이 넘어졌습니다.",
            "사령들이 머뭇거렸습니다. 남원 사람이라면 춘향을 모르는 이가 없었기 때문입니다.<br>\"무엇들 하느냐!\" 매를 든 손이 자꾸 내려갔습니다.",
            "춘향은 매를 맞으면서도 소리를 지르지 않았습니다. 대신 매 한 대에 한마디씩 말을 했습니다. 목소리가 갈라졌지만 또렷했습니다.",
            "\"하나. 한 지아비를 섬기는 것이 무슨 죄입니까?\"<br>\"둘. 두 마음을 품지 않는 것이 무슨 죄입니까?\"",
            "\"셋. 세상이 뒤집혀도 저는 이 말을 바꾸지 않습니다.\"<br>매질하던 사령의 손이 떨렸습니다. 끝내 매를 놓고 물러선 사령도 있었습니다.",
            "담 밖에서 사람들이 울기 시작했습니다. 어떤 이는 돌아섰고 어떤 이는 주먹을 쥐었습니다. 담 위에 올라앉았던 아이들이 울음을 터뜨렸습니다.",
            "\"옥에 가두어라! 제 입으로 그러겠다 할 때까지 내보내지 마라!\"",
            "춘향은 그날로 남원 옥에 갇혔습니다. 옥은 어둡고 축축했습니다. 쥐가 다니고 벽에서 물이 배어 나왔습니다. 햇빛이 하루에 한 뼘도 들지 않았습니다.",
            "월매가 날마다 옥 앞으로 왔습니다. 창살 사이로 밥을 넣어 주며 울었습니다.<br>\"내가 그때 그 종이를 받지 말았어야 했다.\" 창살을 붙든 손이 하얗게 질렸습니다.",
            "\"어머니, 그런 말씀 마세요.\"<br>\"네가 무슨 죄가 있다고…\"<br>\"제가 죄가 없으니까 여기 있는 겁니다.\"",
            "달이 바뀌고 또 바뀌었습니다. 춘향의 얼굴에서 살이 빠지고 손목이 가늘어졌습니다. 옥졸들도 그 모습을 차마 보지 못했습니다.",
            "그래도 춘향은 날마다 옥 바닥에 손가락으로 글씨를 썼습니다. 사람 인 자였습니다. 흙바닥이 반들반들해지도록 썼습니다.",
            "남원을 떠난 지 삼 년째 되던 해, 한양에서 과거가 열렸습니다. 이몽룡이 그 시험을 보았습니다.",
            "시험 문제는 백성을 다스리는 법에 관한 것이었습니다. 이몽룡은 붓을 들고 한참을 생각했습니다. 붓끝이 한참 동안 종이에 닿지 않았습니다.",
            "그러다 문득 오래전에 들은 말이 떠올랐습니다. 그 책에는 백성 이야기가 나옵니까? 그럼 그 책은 반쪽이네요. 춘향의 목소리가 그대로 들리는 것 같았습니다.",
            "이몽룡은 그날 장원으로 뽑혔습니다. 임금이 그를 불러 물었습니다.<br>\"무슨 벼슬을 하고 싶으냐?\"",
            "\"전하, 저를 암행어사<span class=\"gloss\">(임금이 몰래 보내 고을을 살피게 한 벼슬아치)</span>로 보내 주십시오.\"<br>\"어느 고을로 가겠느냐?\"<br>\"…전라도 남원이옵니다.\" 임금이 눈을 크게 떴습니다.",
            "임금이 마패<span class=\"gloss\">(암행어사임을 증명하던 둥근 쇠패. 말 그림이 새겨져 있다)</span>를 내렸습니다.",
            "이몽룡은 그 마패를 품에 넣고, 책상 위의 거울도 함께 챙겼습니다. 그러고는 남쪽으로 길을 잡았습니다. 뒤도 돌아보지 않았습니다."
        ]
    },
    {
        num: 6,
        title: "거지가 되어 온 사람",
        art: ["story-06-a.webp", "story-06-b.webp", "story-06-c.webp"],
        artAt: ["얼굴에 일부러 흙을 묻혔습니다", "옆자리 사람들이 나누는 이야기가 그대로 들렸습니다", "옥 앞에 이르자 이몽룡이 창살에 얼굴을 붙였습니다"],
        paras: [
            "남원에 가까워지자 이몽룡은 옷을 갈아입었습니다. 다 해진 옷에 짚신을 신고, 갓은 챙이 부러진 것을 썼습니다. 얼굴에 일부러 흙을 묻혔습니다.",
            "암행어사는 그렇게 다녔습니다. 아무도 알아보지 못해야 그 고을의 진짜 모습을 볼 수 있기 때문입니다.",
            "남원 땅에 들어서자마자 이몽룡은 걸음을 멈췄습니다. 논에 물이 말라 있었습니다. 사람이 다니지 않아 길에 풀이 자랐습니다. 장터에 사람이 열도 되지 않았습니다.",
            "주막에 들어가 국밥 한 그릇을 시켰습니다. 옆자리 사람들이 나누는 이야기가 그대로 들렸습니다. 국밥에 건더기가 거의 없었습니다.",
            "\"올해는 세금을 두 번 걷는다지?\"<br>\"작년 것도 아직 못 냈는데.\"<br>\"그 양반은 밤마다 잔치라던데.\"",
            "이몽룡의 숟가락이 멈췄습니다. 국이 다 식도록 그러고 있었습니다.",
            "\"그건 그렇고, 춘향이는 아직도 옥에 있나?\"<br>\"석 달째지. 이제 사람 꼴이 아니라던데.\" 이몽룡의 손이 상 밑에서 떨렸습니다.",
            "이몽룡이 그 자리에서 일어섰습니다. 국밥은 반도 못 먹었습니다.",
            "해가 진 뒤 이몽룡은 춘향의 집을 찾아갔습니다. 담이 무너지고 마당의 국화 화분이 다 말라 있었습니다. 대나무만 예전 그대로 서 있었습니다.",
            "월매가 등불을 들고 나왔습니다. 그러고는 이몽룡을 보고 한참을 알아보지 못했습니다. 등불을 든 손이 흔들렸습니다.",
            "\"…도련님?\"<br>\"예, 접니다.\"<br>월매의 눈이 이몽룡의 행색을 훑었습니다. 해진 옷, 부러진 갓, 흙투성이 짚신.",
            "월매가 그 자리에 주저앉았습니다.<br>\"아이고… 아이고, 우리 춘향이…\" 울음이 골목까지 새어 나갔습니다.",
            "\"어머님.\"<br>\"우리 애가 저 지경이 되도록 기다린 사람이 겨우… 겨우 이 꼴로 왔단 말입니까.\"",
            "이몽룡은 아무 변명도 하지 않았습니다. 다만 이렇게 말했습니다.<br>\"옥으로 데려다주십시오.\" 목소리가 아주 낮았습니다.",
            "옥 앞에 이르자 이몽룡이 창살에 얼굴을 붙였습니다. 안은 캄캄했습니다.<br>\"춘향아!\"",
            "어둠 속에서 무언가 움직였습니다. 그러고는 아주 낮은 목소리가 들려왔습니다.<br>\"…도련님이십니까.\" 쇠사슬 끄는 소리가 났습니다.",
            "\"어찌 알았소? 얼굴도 안 보일 텐데.\"<br>\"목소리는 안 변했습니다.\"",
            "달빛이 들어와 춘향의 얼굴을 비췄습니다. 이몽룡은 그 얼굴을 보고 숨이 막혔습니다. 뺨이 홀쭉하고 손목이 뼈만 남아 있었습니다.",
            "춘향도 이몽룡의 행색을 보았습니다. 한참을 보다가 조용히 물었습니다.<br>\"…한양에서 뜻을 못 이루셨군요!\"",
            "이몽룡은 대답하지 않았습니다. 사실을 말해 버리면 춘향이 옥 안에서 티를 낼 것이고, 그러면 일이 어그러질 것이었습니다. 말이 목구멍에서 자꾸 걸렸습니다.",
            "그런데 춘향이 창살 사이로 손을 내밀었습니다. 그 손에 옥가락지가 들려 있었습니다.<br>\"이건 도로 가져가십시오. 제가 지니고 있다가 잃을까 겁납니다.\" 가락지가 손가락에서 헐거워져 있었습니다.",
            "\"춘향아!\"<br>\"그리고 도련님. 어머니를 부탁드립니다. 그분 혼자 남으면 못 견딥니다.\"<br>이몽룡은 그 창살을 붙잡고 오래도록 고개를 들지 못했습니다."
        ]
    },
    {
        num: 7,
        title: "암행어사 출두야",
        art: ["story-07-a.webp", "story-07-b.webp", "story-07-c.webp"],
        artAt: ["이웃 고을 수령들까지 불려 와 대청에 늘어앉았습니다", "금 술잔에 담긴 좋은 술은 천 사람의 피요", "대문이 부서지듯 열리고 역졸들이 쏟아져 들어왔습니다"],
        paras: [
            "이튿날은 변학도의 생일이었습니다. 관가에서는 아침부터 큰 잔치가 벌어졌습니다. 새벽부터 풍악 소리가 났습니다.",
            "이웃 고을 수령들까지 불려 와 대청에 늘어앉았습니다. 상마다 고기와 술이 그득했습니다. 광에서 곡식이 자루째 실려 나갔습니다. 기생과 악공이 스무 명도 넘게 불려 왔습니다.",
            "그때 다 해진 옷을 입은 사내 하나가 슬그머니 마당으로 들어섰습니다.<br>\"어허, 웬 거지가 잔칫상에 끼어드느냐!\"",
            "사령들이 밀어내려 하자 옆 고을 수령 하나가 손을 저었습니다.<br>\"두어라. 잔칫날에 사람 쫓는 것도 흉하다. 저 끝에 상 하나 내주어라.\" 사령들이 못마땅한 얼굴로 물러섰습니다.",
            "이몽룡은 마당 끝 구석에 앉았습니다. 상에는 식은 국 한 그릇과 나물 한 접시가 놓였습니다. 나물은 다 식어 있었습니다. 이몽룡은 숟가락을 들지 않았습니다.",
            "술이 몇 순배 돌자 변학도가 흥이 올랐습니다.<br>\"오늘같이 좋은 날에 시가 없어서 되겠는가. 누가 한 수 지어 보게.\" 부채로 상을 두드리며 흥얼거렸습니다.",
            "그때 마당 끝의 거지가 일어섰습니다.<br>\"소인이 한 수 지어 올려도 되겠습니까?\" 좌중이 그쪽을 돌아보았습니다.",
            "좌중이 웃음바다가 되었습니다.<br>\"거지가 시를 짓는다!\"<br>\"어디 들어나 보자!\" 누구도 그 말을 곧이듣지 않았습니다.",
            "이몽룡이 붓을 청해 종이에 글을 썼습니다. 그러고는 소리 내어 읽었습니다. 붓을 쥔 손이 조금도 떨리지 않았습니다.",
            "\"금 술잔에 담긴 좋은 술은 천 사람의 피요,\"<br>\"옥쟁반에 놓인 좋은 안주는 만백성의 기름이라.\" 글을 읽는 목소리가 낮았는데도 대청 끝까지 들렸습니다.",
            "대청이 조용해졌습니다. 젓가락 소리마저 멎었습니다.",
            "\"촛농이 떨어질 때 백성의 눈물이 떨어지고,\"<br>\"노랫소리 높은 곳에 원망 소리 또한 높더라.\"",
            "잔을 들고 있던 수령 하나가 슬그머니 잔을 내려놓았습니다. 다른 하나는 자리에서 일어나 뒷걸음질을 쳤습니다. 누군가는 갓을 챙겨 슬그머니 마당으로 내려섰습니다.",
            "변학도의 얼굴이 붉으락푸르락해졌습니다.<br>\"이, 이놈이 어디서 무엄한 소리를! 당장 끌어내라!\"",
            "사령들이 달려들었습니다. 그 순간 이몽룡이 품에서 무언가를 꺼내 높이 들었습니다. 마당의 사람들이 일제히 그쪽을 보았습니다.",
            "둥근 쇠붙이에 말이 새겨져 있었습니다. 마패였습니다. 햇빛을 받아 쇠붙이가 번쩍였습니다.",
            "동시에 담 밖에서 우렁찬 소리가 터졌습니다.<br>\"암행어사 출두야!\"",
            "대문이 부서지듯 열리고 역졸들이 쏟아져 들어왔습니다. 상이 뒤집히고 술병이 굴렀습니다. 수령들이 갓도 못 챙기고 담을 넘었습니다. 담이 무너지고 발자국이 어지러웠습니다.",
            "변학도가 자리에서 굴러떨어졌습니다.<br>\"어, 어사또… 소인은 그저…\"<br>\"남원 사또는 인장<span class=\"gloss\">(벼슬의 도장)</span>을 내놓으시오. 오늘로 그 자리에서 물러나시오!\" 인장을 내미는 손이 사시나무처럼 떨렸습니다.",
            "이몽룡은 곧바로 옥 문을 열게 했습니다. 옥문이 삐걱거리며 열렸습니다. 춘향이 부축을 받으며 걸어 나왔습니다. 햇빛이 눈부셔 한참을 눈을 뜨지 못했습니다.",
            "겨우 눈을 뜬 춘향 앞에, 어사 관복을 입은 이몽룡이 서 있었습니다. 춘향은 놀라지 않았습니다. 다만 이렇게 말했습니다.<br>\"…어젯밤에 말씀하시지 그러셨어요?\"<br>\"말했으면 그대가 티를 냈을 것이오.\"<br>\"그건 그렇습니다.\"",
            "춘향은 그러고는 이몽룡을 지나쳐 걸었습니다. 담 밖에 월매가 서 있었습니다. 월매가 딸의 이름을 부르며 달려와 딸의 얼굴을 두 손으로 감쌌습니다. 춘향은 어머니를 끌어안고 그제야 소리 내어 울었습니다.",
            "그해 가을 두 사람은 한양으로 올라갔습니다. 월매도 함께 갔습니다.",
            "떠나기 전날, 춘향이 광한루에 올랐습니다. 이몽룡이 뒤따라 올라왔습니다.<br>\"여기서 처음 보았지요.\"<br>\"그때 내가 방자를 시켜 그대를 불렀소. 참으로 무례한 짓이었소.\" 버드나무가 그때보다 훨씬 굵어져 있었습니다.",
            "\"그때 제가 뭐라 했는지 기억하십니까?\"<br>\"하실 말씀이 있으면 직접 오시라고 했지.\"<br>\"예. 그 말을 들어주셔서 제가 여기 있는 겁니다.\" 광한루 아래로 물이 그때처럼 흘렀습니다.",
            "이몽룡이 품에서 거울을 꺼냈습니다. 거울에 두 사람의 얼굴이 함께 비쳤습니다. 삼 년을 지니고 다녀 테두리가 다 닳아 있었습니다.<br>\"이건 도로 주겠소. 이제 내가 어떤 사람이 되었는지는 그대가 보아 주시오.\""
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
    emoji: '🌸',
    title: '춘향전',
    intro: [
        "춘향전은 지은이가 알려지지 않은 조선 후기 소설이에요. 판소리 춘향가로 불리던 것이 글로 옮겨진 것이지요.",
        "판소리 다섯 마당 가운데 가장 널리 불리고 가장 많이 읽힌 것이 춘향가예요. 조금씩 다른 이본이 백 가지가 넘어서, 하나의 작품이라기보다 춘향전 무리라고 부르기도 한답니다.",
        "이야기의 무대는 전라도 남원이에요. 두 사람이 처음 만나는 광한루는 지금도 남원에 남아 있고, 해마다 봄이면 그곳에서 춘향제가 열린답니다."
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
    { q: "두 사람이 처음 만난 곳은 어디입니까?", choices: ["한양의 궁궐 앞", "남원 광한루", "남원 관가"], answer: 1 },
    { q: "이몽룡이 춘향을 처음 본 것은 무엇을 할 때입니까?", choices: ["글을 읽고 있을 때", "옥에 갇혀 있을 때", "그네를 타고 있을 때"], answer: 2 },
    { q: "두 사람이 헤어진 까닭은 무엇입니까?", choices: ["아버지가 한양으로 가게 되어서", "춘향이 멀리 이사를 가게 되어서", "변 사또가 두 사람을 갈라놓아서"], answer: 0 },
    { q: "헤어질 때 춘향이 건넨 것은 무엇입니까?", choices: ["비단 손수건", "옥으로 만든 붓", "거울 하나"], answer: 2 },
    { q: "새로 온 사또 변학도가 춘향에게 시킨 것은 무엇입니까?", choices: ["기생 명부에 이름을 올리라고", "관가에 들어와 밥을 지으라고", "남원 땅을 떠나 멀리 가라고"], answer: 0 },
    { q: "춘향은 무엇이라고 대답했습니까?", choices: ["저는 이미 지아비가 있다고", "조금만 기다려 달라고", "아무 말도 하지 않았다고"], answer: 0 },
    { q: "춘향은 어떻게 되었습니까?", choices: ["남원에서 쫓겨났다", "매를 맞고 옥에 갇혔다", "관가의 종이 되었다"], answer: 1 },
    { q: "한양으로 간 이몽룡은 무엇을 했습니까?", choices: ["과거를 보아 어사가 되었다", "변학도 밑에서 일했다", "남원으로 곧장 돌아왔다"], answer: 0 },
    { q: "이몽룡이 남원에 나타났을 때 차림은 어떠했습니까?", choices: ["비단옷 차림이었다", "거지꼴이었다", "마패를 들고 있었다"], answer: 1 },
    { q: "옥에서 춘향은 이몽룡에게 무어라 했습니까?", choices: ["왜 이제 왔느냐고", "다시는 오지 말라고", "어머니를 잘 부탁한다고"], answer: 2 },
    { q: "이몽룡이 잔치에서 지은 시는 무엇에 대한 것입니까?", choices: ["좋은 술이 백성의 피라는 것", "봄날 광한루의 아름다운 경치", "고향을 그리워하는 나그네 마음"], answer: 0 },
    { q: "이몽룡이 잔치에서 높이 들어 보인 것은 무엇입니까?", choices: ["임금의 편지", "마패", "옥으로 만든 도장"], answer: 1 },
    { q: "변학도는 어떻게 되었습니까?", choices: ["한양으로 끌려가 갇혔다", "그 자리에서 벼슬을 잃었다", "스스로 벼슬을 내놓았다"], answer: 1 },
    { q: "춘향이 옥에서 나와 가장 먼저 한 일은 무엇입니까?", choices: ["변학도를 꾸짖었다", "광한루로 달려갔다", "어머니를 끌어안았다"], answer: 2 },
    {
        q: "이 책을 읽고 난 반응으로 알맞지 않은 것은 무엇인가요?",
        wide: true,
        choices: [
            "변 사또가 기생 명부에 이름을 올리라 한 것을 보면, 그때 벼슬아치가 백성을 어떻게 다루었는지 보인다.",
            "춘향이 이미 지아비가 있다고만 하고 물러서지 않은 것을 보면, 지킨 것이 사랑만은 아니었구나.",
            "이몽룡이 거지꼴로 나타나 사람들 속을 먼저 본 것을 보면, 벼슬이란 이렇게 쓰는 것이구나.",
            "춘향이 옥에서 왜 이제 왔느냐고 물은 것을 보면, 기다린 마음이 그만큼 애가 탔구나."
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
    emoji: '🌸',
    art: ['end.webp'],
    paras: [
        `먼저 이 이야기가 어디서 왔는지부터입니다. 『춘향전』은 판소리 「춘향가」를 글로 옮긴 것입니다. 소리꾼 한 사람이 북 치는 사람만 데리고 여덟 시간을 부르기도 하는 긴 노래였습니다.`,
        `지은이는 없습니다. 한 사람이 앉아서 지은 것이 아니라 여럿이 부르고 고치며 만들어 온 이야기이기 때문입니다. 그래서 남아 있는 책이 백 가지가 넘고, 그 백 가지가 저마다 조금씩 다릅니다. 어떤 책에서는 춘향이 양반의 딸이고, 어떤 책에서는 끝까지 기생의 딸입니다.`,
        `우리나라 옛이야기 가운데 가장 많이 읽히고 가장 많이 불린 이야기가 이것입니다. 조선 후기에 이 이야기를 모르는 사람은 거의 없었습니다.`,
        `이 이야기의 뿌리에는 신분이 있습니다. 춘향은 퇴기 월매의 딸입니다. 어머니가 기생이면 딸도 기생 명부에 이름이 오르던 시절이었습니다. 그래서 이몽룡과 아무리 마음이 맞아도 정식으로 혼인할 수가 없었습니다.`,
        `이 대목을 잘 보아야 삼 장의 이별이 이해됩니다. 이몽룡이 춘향을 데려가지 못한 것은 마음이 식어서가 아닙니다. 데려갈 자리가 없었기 때문입니다. 양반집 아들이 기생의 딸을 서울로 데려가는 일은 그 시절 법도 안에서는 있을 수 없는 일이었습니다.`,
        `그러니 춘향이 변학도에게 맞선 것도 사랑 하나만은 아닙니다. 기생 명부에 이름이 있으면 사또가 부르면 가야 했습니다. 춘향은 그 명부를 부정한 것입니다. 나는 그런 사람이 아니라고 말한 셈입니다. 매를 맞은 까닭이 거기에 있습니다.`,
        `변학도를 그냥 나쁜 사또로만 읽으면 아깝습니다. 이 사람은 법을 어긴 것이 없습니다. 그 시절 법으로는 사또가 관기를 부를 수 있었습니다. 법대로 했는데 사람이 부서진 것입니다. 이야기가 정말 겨눈 것은 변학도 한 사람이 아니라 그런 법이었습니다.`,
        `칠 장에서 이몽룡이 잔칫상에서 읊은 시는 실제로 널리 알려진 시입니다. 금 술잔의 좋은 술은 천 사람의 피요, 옥쟁반의 좋은 안주는 만백성의 기름이라는 구절입니다. 촛농이 떨어질 때 백성의 눈물이 떨어지고, 노랫소리 높은 곳에 원망 소리 높다는 말이 뒤에 이어집니다.`,
        `그 자리에 있던 사람들이 슬금슬금 빠져나간 것도 그래서입니다. 무슨 뜻인지 알아들었기 때문입니다.`,
        `암행어사는 지어낸 벼슬이 아닙니다. 임금이 몰래 보내는 관리로, 조선 시대에 실제로 있던 제도입니다. 마패는 말을 빌리는 표였고, 함께 지니고 다니는 유척이라는 자로 고을에서 쓰는 되와 자가 제대로 된 것인지 재어 보았습니다. 세금을 속여 걷는 것을 잡아내려는 것이었습니다.`,
        `남원에 가면 광한루가 실제로 서 있습니다. 조선 초에 지은 누각인데, 이 이야기 때문에 유명해졌습니다. 그 옆에는 춘향을 모신 사당도 있고 해마다 춘향제도 열립니다. 이야기 속 사람인데 제사를 받는 셈입니다.`,
        `춘향이 실제로 있었던 사람인지는 아무도 모릅니다. 남원에 그런 처녀가 있었다는 말도 전해 오지만 그것도 이야기입니다. 확인할 길이 없습니다. 다만 사람들이 그토록 오래 있었던 일로 여기고 싶어 했다는 것만은 분명합니다.`,
        `이 이야기가 그토록 오래 사랑받은 까닭 가운데 하나는 뒤집기입니다. 제일 낮은 자리에 있던 사람이 제일 높은 자리에 있던 사람을 이깁니다. 그것도 힘으로가 아니라 버티기로 이깁니다. 듣는 사람들이 대개 낮은 자리에 있었으니 그 대목에서 속이 시원했을 것입니다.`,
        `다시 읽게 되거든 이번에는 월매만 따라가며 읽어 보십시오. 딸을 기생으로 만들지 않으려고 애쓴 사람입니다. 이몽룡이 떠날 때 가장 크게 화를 낸 사람도, 옥바라지를 한 사람도, 거지꼴로 돌아온 사위를 보고 주저앉은 사람도 월매입니다. 이 이야기에서 제일 고생한 사람은 어쩌면 이 사람입니다.`,
        `이몽룡이 끝내 돌아오지 않았다면 춘향이 한 일은 무엇이 되었을까요? 이야기는 돌아오게 만들어 주었지만, 돌아오지 않았을 수도 있습니다. 그래도 춘향의 버팀은 옳은 일이었을까요.`,
        `이몽룡이 거지 차림 그대로 옥을 찾아간 대목은 어떻습니까? 밝히지 않은 까닭을 본문은 춘향이 티를 낼까 봐라고 적어 두었습니다. 그래도 옥에 갇힌 사람을 하룻밤 더 그대로 두었습니다. 미리 밝혔다면 무엇이 달라졌을지 생각해 보십시오.`,
        `춘향이 기생의 딸이 아니라 양반의 딸이었다면 이 이야기가 남았을까요? 매를 맞을 일도, 옥에 갇힐 일도 없었을 것입니다. 이야기가 되려면 누군가 그 자리에 있어야 했다는 것이 무슨 뜻인지 생각해 볼 만합니다.`
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
        emoji: '🌸',
        title: 'The Tale of Chunhyang',
        intro: [
            "The Tale of Chunhyang is an old Korean story with no known author. It began as a song.",
            "Singers performed it as pansori, a kind of story-singing, under the name Chunhyang-ga. Of all the old Korean stories, this is the one people have loved best.",
            "It is set in Namwon, a real town in the south. The pavilion where the two young people first see each other, Gwanghallu, is still standing there today.",
            "In those days people were born into ranks, and a girl born to a courtesan was written into the register as one herself. That single line in a book is what the whole story turns on."
        ]
    },
    chapters: [
        {
            num: 1,
            title: "At Gwanghallu",
            art: ["story-01-a.webp", "story-01-b.webp", "story-01-c.webp"],
            artAt: ["It was a swing", "I am a courtesan's daughter", "My family name is Seong"],
            paras: [
                "In the town of Namwon, in Jeolla province, there stood a pavilion called Gwanghallu. Clear water ran in front of it and willows trailed down all around, and there was no finer view in Namwon. In spring the railing was crowded with people who had come to look at the blossom. Lean on that railing and you could see the whole town inside the walls.",
                "That year it was Dano<span class=\"gloss\">(the fifth day of the fifth month by the old calendar)</span>. On Dano the women washed their hair in sweet-flag water and rode the swings, and the men wrestled. It was one of the great holidays. From early morning the riverside was full of people.",
                "The son of the magistrate of Namwon, Yi Mongnyong, went up to Gwanghallu that day with Bangja<span class=\"gloss\">(a manservant who ran errands for the town office)</span>. He was sixteen. He read his books well but had seen nothing of the world. His father had told him to do nothing but read, so he hardly ever went out. That day was the first time he had ever climbed up to Gwanghallu.",
                "\"Bangja, you can see everything from here.\"<br>\"Of course, sir. There's nowhere higher in all Namwon.\"",
                "Yi Mongnyong leaned on the railing and looked around, and then his eye caught the willow grove across the water. The willow branches hung right down to the water. Something was going up and down between them.",
                "The hem of a deep red skirt caught the wind and rose into the sky, and came down, and rose again. It was a swing. The ends of the ribbon looked as if they would touch the sky.",
                "\"Bangja. What is that over there?\"<br>\"That's a swing, sir.\"<br>\"Not the swing. The person on it.\" Yi Mongnyong leaned further out over the railing.",
                "Bangja narrowed his eyes and answered as if it were nothing much.<br>\"Oh, that's Chunhyang. Daughter of a woman called Wolmae. Known all over Namwon for her learning and her looks.\" At the end of it he stole a look at his young master's face.",
                "For a long moment Yi Mongnyong could not say anything. Then at last he got it out.<br>\"...Go and bring her here.\" Bangja's eyes went round.",
                "Bangja jumped.<br>\"Sir, that is not a girl who comes because she is sent for.\"<br>\"Go anyway.\" Bangja stamped his feet.",
                "Bangja went across to the willow grove. A long while later he came back alone, scratching his head.<br>\"What did she say?\"<br>\"...She says, I am a courtesan's daughter, yes, but I am not someone who comes when called. If he has something to say to me, he may come himself.\" Bangja's voice got smaller and smaller.",
                "Yi Mongnyong's face went red. But he was not angry.<br>\"...She is right.\"",
                "Yi Mongnyong walked to the willow grove himself. Chunhyang had come down from the swing and was straightening her clothes. It was cool and quiet inside the grove. Only the cicadas sounded, far off.",
                "\"It was rude of me to send a man just now. Forgive me.\"<br>Chunhyang lifted her head then. Their eyes met. It was Yi Mongnyong who looked down first.",
                "\"What is your name?\"<br>\"My family name is Seong, and my given name is Chunhyang.\"<br>\"That means the scent of spring, doesn't it?\"<br>\"Yes.\"",
                "Yi Mongnyong laughed before he could stop himself.<br>\"I was wondering why the spring was so thick at Gwanghallu today. Now I know the reason.\"",
                "Chunhyang did not answer. Only the tips of her ears turned pink. Away behind her the swing ropes creaked as they swung.",
                "\"May I call at your house this evening?\"<br>\"Ask my mother. That is not for me to decide alone.\"",
                "Then she gathered up the swing ropes over her shoulder and turned away. Yi Mongnyong stood where he was until her back disappeared among the willows. The ropes swung against her shoulder. The willow leaves closed over the place where she had been.",
                "On the way back Bangja asked carefully,<br>\"Sir, what did you talk about for so long?\"<br>\"...I learned one thing that isn't in any book.\"",
                "That night Yi Mongnyong could not take in a word he read. He turned the pages and saw a swing going up and down; he picked up his brush and saw a deep red skirt. He sat like that until the lamp wick had burned all the way down.",
                "At last Yi Mongnyong shut the book and stood up.<br>\"Bangja. Bring a lantern.\" Bangja rubbed his eyes and went for the lantern."
            ]
        },
        {
            num: 2,
            title: "A Promise for a Hundred Years",
            art: ["story-02-a.webp", "story-02-b.webp", "story-02-c.webp"],
            artAt: ["The one who opened the gate", "pressed his thumbprint", "side by side on the wooden floor"],
            paras: [
                "Chunhyang's house stood in a quiet lane outside the walls of Namwon. Bamboo grew inside the wall and rows of chrysanthemum pots stood in the yard. The bamboo leaves rustled in the wind.",
                "The one who opened the gate was Chunhyang's mother, Wolmae. Wolmae had been a courtesan when she was young, and now she lived quietly and raised her one daughter. There were hard calluses on her fingertips.",
                "\"What brings the magistrate's son here at this hour of the night?\"<br>\"I have come because I want to make a promise for a hundred years<span class=\"gloss\">(the old way of saying a promise to be husband and wife for life)</span> with Chunhyang.\"",
                "Wolmae's face went stiff. For a long moment there was no sound at all in the room. When at last she spoke, her voice was low.",
                "\"Sir, I was a courtesan. So in the eyes of the world my daughter is a courtesan's daughter too.\"<br>\"I know that.\"",
                "\"And what happens when your father hears of it? You will go up to Hanyang one day. What becomes of my child then?\" Wolmae's eyes were wet.",
                "For a while Yi Mongnyong could say nothing. There was not one thing in what Wolmae had said that was wrong.",
                "\"...Everything you say is true, madam. That is why I mean to put it on paper.\"",
                "Yi Mongnyong asked for a brush and wrote on a sheet of paper. He wrote that he would take Chunhyang as his wife and would never abandon her as long as he lived. And he signed his own name at the end and pressed his thumbprint on it. The hand that held the brush did not shake at all.",
                "\"Sir, what strength is there in a piece of paper like this?\"<br>\"If it has no strength, then let it have none. It is a promise I have made to myself.\"",
                "Wolmae looked at the paper for a long time, then folded it and put it inside her jacket. Then she turned toward the door of the room.<br>\"Chunhyang. Come out.\" The paper rustled in her hand.",
                "That autumn the two of them were married. It was not a great feast. It was a small gathering with Wolmae and Bangja and a few neighbours. Chrysanthemums were in flower all over the yard.",
                "After that Yi Mongnyong read his books by day and went to Chunhyang's house in the evening.",
                "The two of them sat side by side on the wooden floor and talked. When Yi Mongnyong told her what he had read, Chunhyang asked him about it. The moon came in as far as the edge of the floor.",
                "\"Sir, do the common people come into that book of yours?\"<br>\"...No. They don't.\"<br>\"Then it's only half a book.\"",
                "Yi Mongnyong laughed at that for a long while. Then he grew serious.<br>\"Where did you learn to think like that?\"<br>\"In the market street. Sit there and you hear everything.\" Chunhyang said it quite calmly.",
                "When winter came Chunhyang asked Yi Mongnyong to teach her to write. Yi Mongnyong put the brush into her hand. She had already ground the ink on the stone and was waiting.",
                "\"Which character shall we write first?\"<br>\"The one that means person.\"<br>\"Why that one?\"<br>\"I heard it is the hardest of them all.\"",
                "So a year went by. The two of them thought that time would simply go on. Spring went, and summer went, and autumn went.",
                "But the next spring a man came down from Hanyang. Word had come that the magistrate of Namwon had been raised to a higher post and was to go up to the capital. The town office was in an uproar overnight.",
                "Yi Mongnyong heard the news in his father's room.<br>\"Pack your things. We leave in three days.\"<br>\"Father, I...\"<br>\"You come too. You have an examination to sit.\"",
                "Yi Mongnyong stood there a long while, then went outside. The spring sun was bright in the yard. It was exactly the same light as on the day he first saw the swing at Gwanghallu. Outside the wall the cicadas were loud."
            ]
        },
        {
            num: 3,
            title: "Parting",
            art: ["story-03-a.webp", "story-03-b.webp", "story-03-c.webp"],
            artAt: ["a mirror the size of a palm", "took the jade ring off his own finger", "as far as Origeong"],
            paras: [
                "That evening Yi Mongnyong went to Chunhyang's house. He turned away from the gate several times and then stood there again. He had nothing at all in his hands.",
                "The moment he stepped into the room Chunhyang knew.<br>\"...Something has happened.\" She had read it in his face alone.",
                "Yi Mongnyong sat down and told her all of it. His father's new post, the departure in three days, the examination in Hanyang. He could not lift his head the whole time he was speaking.",
                "Even after he had finished the room stayed quiet for a long while. Only the lamp flame moved. Outside the window a scops owl was calling.",
                "\"When will you come back?\"<br>\"...I don't know.\"",
                "Chunhyang nodded. She did not cry. Only her fingertips shook. Her hands were lying in her lap.",
                "\"Sir. Let me ask you one thing.\"<br>\"Ask.\"<br>\"When you are in Hanyang, will you forget me?\"",
                "Yi Mongnyong sprang to his feet.<br>\"What are you saying!\" His voice rose before he could help it.<br>\"Don't be angry. I am not asking for an answer.\"",
                "Chunhyang went on quietly.<br>\"A person cannot do as they like with their own heart. All I know is my own. That is the only thing I meant to tell you.\"",
                "Then she took something out of her sewing basket. It was a mirror the size of a palm. It had been polished so long that the rim was smooth and shining.",
                "\"Take this with you. A mirror shows a thing just as it is. Whatever kind of man you become, this mirror will show it just as it is.\"",
                "Yi Mongnyong took the mirror in both hands. Then he took the jade ring off his own finger and gave it to Chunhyang. The ring caught the lamplight and gleamed.",
                "\"My mother gave me this. As long as this ring is not on my hand, I am still in Namwon.\"",
                "At dawn the next day the magistrate's party left Namwon. The town officers lined up and the baggage carts stood in a row. The morning mist was thick.",
                "Chunhyang went with him as far as Origeong<span class=\"gloss\">(a pavilion built about two miles outside a town, where people saw travellers off and welcomed them home)</span> outside the wall. Wolmae stood behind her. There were several people at Origeong, some leaving and some seeing others off.",
                "\"Take care of yourself.\"<br>\"And you.\"<br>They both had more to say and neither of them said it. The hand on the bridle tightened.",
                "The horse began to move. Yi Mongnyong looked back again and again. Chunhyang was standing exactly where she had been.",
                "At the top of the pass Yi Mongnyong stopped his horse. Chunhyang grew smaller and smaller in his eyes. At last she was a dot, and then she was gone.",
                "Chunhyang stood at Origeong until the sun had gone right down. Wolmae pulled at her sleeve several times. The hem of her skirt was soaked with dew.",
                "\"Come inside. People are watching.\"<br>\"A little longer.\"",
                "That night Chunhyang threaded the jade ring on a string and hung it round her neck. Then she sat under the lamp and wrote the character for person, and wrote it again. The ring lay cool against her breast.",
                "In Hanyang Yi Mongnyong read all night. He stood the mirror up on his desk. Every time he raised his head he saw his own face. There were nights when not one word would go in."
            ]
        },
        {
            num: 4,
            title: "The New Magistrate",
            art: ["story-04-a.webp", "story-04-b.webp", "story-04-c.webp"],
            artAt: ["His arrival was loud from the start", "The runners went to Chunhyang's house", "enter your name in the courtesan register"],
            paras: [
                "Two years went by, and the following spring a new magistrate came to Namwon. His name was Byeon Hakdo. The people of Namwon came out to the roadside to watch.",
                "His arrival was loud from the start. Ten baggage carts followed behind the palanquin, packed with silk and dishes and household goods. The people watching looked at one another.",
                "Byeon Hakdo called the town officers together the moment he sat down. They lined up with their ledgers in their arms. But the questions he asked were strange.",
                "\"How much grain is there in this town's storehouse?\"<br>\"Yes, well, that is...\"<br>\"Never mind. That can wait. How many well-known courtesans are there in this town?\"",
                "The officers glanced at one another. Not one of them was willing to open his mouth.",
                "\"What, are you all deaf? Bring me the courtesan register.\"",
                "From that day there was a feast every day at the Namwon town office. The sound of the music went over the wall and out into the market street. The lamps did not go out however late it got.",
                "Everything the feasts used came out of the town storehouse. The taxes gathered that spring were gone in three months. The storehouse door stood wide open.",
                "So Byeon Hakdo ordered next year's taxes to be collected in advance, before they were due. From the houses that could not pay, they carried off the cooking pots. They took the children's rice bowls too.",
                "Then one day Byeon Hakdo was turning the pages of the courtesan register and his hand stopped.<br>\"They tell me there is a girl called Chunhyang in this town.\"",
                "The clerk<span class=\"gloss\">(a junior official who did the day-to-day work of a town office)</span> beside him spoke carefully.<br>\"There is, sir. But that girl is not a courtesan.\" Sweat stood on the clerk's forehead.",
                "\"How is a courtesan's daughter not a courtesan?\"<br>\"They say she already has a husband. The son of the last magistrate...\"",
                "Byeon Hakdo laughed out loud.<br>\"And where is that young gentleman now? In Hanyang, is he not? How far is Hanyang from here?\" His laughter carried across the yard.",
                "\"...About seven hundred li, sir.\"<br>\"What sort of husband is a man seven hundred li away? Bring her.\"",
                "The runners went to Chunhyang's house. Wolmae stood blocking the gate.<br>\"My child is not a courtesan!\"<br>\"Magistrate's order. Stand aside.\" The runners' footsteps rang in the lane.",
                "Chunhyang came out of the room. Her clothes were straight and her hair was neatly combed.<br>\"Mother, it is all right. I will go and come back.\" There was not a trace of trembling in her.",
                "\"Chunhyang!\"<br>\"You cannot refuse to go when you are called. I shall simply go, and come home again.\"",
                "The yard of the town office was already full of people. They were lined up even outside the wall, as though it were a show. Children had climbed onto the top of the wall and were craning their necks.",
                "Byeon Hakdo sat on the raised floor and looked down at Chunhyang. He looked for a long while, and then his face turned pleased.",
                "\"Just as they say, then. From today I will enter your name in the courtesan register. Come into the office and wait upon me.\" At the end of it he snapped his fan shut.",
                "The yard went silent. People held their breath and watched Chunhyang's mouth. Even the wind seemed to have stopped.",
                "Chunhyang lifted her head. Her voice was not loud, but it carried clearly to the far end of the yard.<br>\"Sir, I am a woman who already has a husband.\""
            ]
        },
        {
            num: 5,
            title: "Thrown into the Prison",
            art: ["story-05-a.webp", "story-05-b.webp", "story-05-c.webp"],
            artAt: ["she did not cry out", "shut in the Namwon prison", "send me as a secret inspector"],
            paras: [
                "The smile went off Byeon Hakdo's face.<br>\"A husband, is it. Have you a marriage paper<span class=\"gloss\">(the document exchanged when a marriage was agreed)</span>? Have you anything filed with the state?\" His hand tightened on the fan.",
                "\"I have a paper.\"<br>\"And what sort of document is a scrap of paper passed between a courtesan's daughter and a young gentleman!\"",
                "\"If you say it is not a document, sir, then it is not a document.\"<br>Chunhyang said it quite calmly.<br>\"Even so, my own heart is mine. That much is not for you to decide.\" The people in the yard looked at one another.",
                "Byeon Hakdo struck the table.<br>\"The creature is making a fool of the magistrate! Fetch the rod!\" A cup went over on the table.",
                "The runners hesitated. There was nobody in Namwon who did not know Chunhyang.<br>\"What are you waiting for!\" The hands holding the rod kept dropping.",
                "Even while she was being beaten she did not cry out. Instead she said one thing for every stroke. Her voice cracked, but it was clear.",
                "\"One. What crime is it to keep faith with one husband?\"<br>\"Two. What crime is it to hold no second heart?\"",
                "\"Three. If the world turns upside down I will not change these words.\"<br>The hand of the runner striking her shook. In the end one of them put down the rod and stepped back.",
                "Outside the wall people began to weep. Some of them turned away and some of them clenched their fists. The children up on the wall burst into tears.",
                "\"Shut her in the prison! Do not let her out until she says it with her own mouth!\"",
                "That same day Chunhyang was shut in the Namwon prison. The prison was dark and damp. Rats ran about and water seeped from the walls. Not a hand's breadth of sunlight came in all day.",
                "Wolmae came to the prison every day. She pushed food through the bars and wept.<br>\"I should never have taken that paper.\" Her hands went white where they gripped the bars.",
                "\"Mother, don't say such things.\"<br>\"What crime have you ever done...\"<br>\"It is because I have done none that I am here.\"",
                "A month passed, and another. The flesh went from Chunhyang's face and her wrists grew thin. Even the gaolers could not bear to look.",
                "Still, every day Chunhyang wrote on the floor of the prison with her finger. It was the character for person. She wrote it until the earth floor was worn smooth.",
                "In the third year since he had left Namwon, an examination was held in Hanyang. Yi Mongnyong sat it.",
                "The question was on how a country's people should be governed. Yi Mongnyong picked up his brush and thought for a long time. For a long while the tip of it did not touch the paper.",
                "Then all at once he remembered something he had heard long before. Do the common people come into that book of yours? Then it's only half a book. It was as though he could hear Chunhyang's voice.",
                "That day Yi Mongnyong came first of them all. The king called him and asked,<br>\"What post do you want?\"",
                "\"Your Majesty, send me as a secret inspector.\"<br>\"To which town would you go?\"<br>\"...To Namwon, in Jeolla.\" The king's eyes widened.",
                "The king gave him the mapae<span class=\"gloss\">(a round iron badge with horses engraved on it, which proved a man was a secret inspector)</span>.",
                "Yi Mongnyong put the badge inside his coat, and took the mirror from his desk as well. Then he set out south. He did not look back."
            ]
        },
        {
            num: 6,
            title: "The Man Who Came as a Beggar",
            art: ["story-06-a.webp", "story-06-b.webp", "story-06-c.webp"],
            artAt: ["rubbed dirt into his face", "the people at the next table", "pressed his face to the bars"],
            paras: [
                "As he came near Namwon, Yi Mongnyong changed his clothes. He put on rags and straw sandals, and a hat with a broken brim. He rubbed dirt into his face on purpose.",
                "That was how secret inspectors travelled. Only if nobody knew him could he see what a town was really like.",
                "The moment he crossed into Namwon land Yi Mongnyong stopped walking. The water had dried out of the paddies. Grass had grown over the road because nobody used it. There were not ten people in the market.",
                "He went into an inn and ordered a bowl of soup and rice. He could hear every word the people at the next table were saying. There was almost nothing in the soup.",
                "\"They say he's collecting the tax twice again this year.\"<br>\"We haven't even paid last year's.\"<br>\"And that gentleman feasts every night, they say.\"",
                "Yi Mongnyong's spoon stopped. He sat like that until the soup was stone cold.",
                "\"That aside. Is Chunhyang still in the prison?\"<br>\"Three months now. They say she hardly looks like a person any more.\" Under the table Yi Mongnyong's hands shook.",
                "Yi Mongnyong stood up where he was. He had not eaten half the bowl.",
                "After the sun went down Yi Mongnyong went to Chunhyang's house. The wall had fallen in and the chrysanthemum pots in the yard had all dried up. Only the bamboo stood as it always had.",
                "Wolmae came out with a lamp. Then she looked at Yi Mongnyong and for a long moment did not know him. The hand holding the lamp shook.",
                "\"...Sir?\"<br>\"Yes. It's me.\"<br>Wolmae's eyes went over him. The worn-out clothes, the broken hat, the sandals thick with dirt.",
                "Wolmae sat straight down on the ground.<br>\"Oh no... oh no, my Chunhyang...\" Her crying carried out into the lane.",
                "\"Madam.\"<br>\"My child has come to that, waiting, and the man she waited for comes back... comes back looking like this?\"",
                "Yi Mongnyong made no excuse at all. He only said,<br>\"Take me to the prison.\" His voice was very low.",
                "When they reached the prison Yi Mongnyong pressed his face to the bars. Inside it was pitch dark.<br>\"Chunhyang.\"",
                "Something moved in the darkness. Then a very low voice came.<br>\"...Is it you, sir?\" There was a sound of chains dragging.",
                "\"How did you know? You can't even see my face.\"<br>\"Your voice has not changed.\"",
                "The moonlight came in and lit Chunhyang's face. Yi Mongnyong saw it and his breath stopped. Her cheeks were hollow and there was nothing but bone at her wrists.",
                "Chunhyang looked at the state of him too. She looked for a long while, and then asked quietly,<br>\"...You did not get what you went for in Hanyang.\"",
                "Yi Mongnyong did not answer. If he told her the truth she would show it in the prison, and then the whole thing would come apart. The words kept catching in his throat.",
                "Then Chunhyang put her hand out between the bars. The jade ring was in it.<br>\"Take this back. I am afraid I shall lose it if I keep it.\" The ring had grown loose on her finger.",
                "\"Chunhyang.\"<br>\"And sir. Please look after my mother. If she is left on her own she will not bear it.\"<br>Yi Mongnyong held on to those bars and could not lift his head for a long time."
            ]
        },
        {
            num: 7,
            title: "The Secret Inspector Is Here",
            art: ["story-07-a.webp", "story-07-b.webp", "story-07-c.webp"],
            artAt: ["magistrates of the neighbouring towns", "the blood of a thousand people", "The gate burst open"],
            paras: [
                "The next day was Byeon Hakdo's birthday. A great feast began at the town office from the morning. The music started before dawn.",
                "Even the magistrates of the neighbouring towns had been called in, and they sat in rows on the raised floor. Every table was piled with meat and wine. Sacks of grain were carried out of the storehouse. More than twenty courtesans and musicians had been sent for.",
                "Just then a man in worn-out clothes slipped quietly into the yard.<br>\"Here now, what beggar is pushing in at a feast!\"",
                "The runners moved to throw him out, but one of the visiting magistrates waved a hand.<br>\"Leave him. It's an ill thing to drive a man off on a feast day. Give him a table down at the end.\" The runners stepped back, not liking it.",
                "Yi Mongnyong sat down in the corner at the end of the yard. On his table were one bowl of cold soup and one dish of greens. The greens had gone quite cold. Yi Mongnyong did not pick up his spoon.",
                "After the wine had gone round a few times Byeon Hakdo grew merry.<br>\"On a fine day like this, are we to have no poem? Somebody make one.\" He beat the table with his fan and hummed.",
                "Then the beggar at the end of the yard stood up.<br>\"Might this humble man make one and offer it?\" The whole company turned to look.",
                "The company burst out laughing.<br>\"The beggar is going to write a poem!\"<br>\"Let's hear it, then!\" Not one of them took him seriously.",
                "Yi Mongnyong asked for a brush and wrote on a sheet of paper. Then he read it out. The hand that held the brush did not shake at all.",
                "\"The good wine in the golden cup is the blood of a thousand people,\"<br>\"and the fine food on the jade dish is the fat of ten thousand.\" His voice was low as he read, and yet it carried to the far end of the hall.",
                "The hall went quiet. Even the chopsticks stopped.",
                "\"Where the candle wax falls, the people's tears are falling,\"<br>\"and where the singing is loudest, the bitter voices are loudest too.\"",
                "One of the magistrates who was holding a cup quietly put it down. Another got up and began backing away. Somebody picked up his hat and slipped down into the yard.",
                "Byeon Hakdo's face went red and then went pale.<br>\"You, you dog, what insolence is this! Drag him out at once!\"",
                "The runners rushed at him. At that moment Yi Mongnyong took something out of his coat and held it up high. Every person in the yard looked at it at once.",
                "It was a round piece of iron with horses engraved on it. It was the mapae. The metal flashed in the sunlight.",
                "At the same moment a great shout broke out beyond the wall.<br>\"The secret inspector is here!\"",
                "The gate burst open and the inspector's men came pouring in. Tables went over and wine bottles rolled. The visiting magistrates went over the wall without even picking up their hats. The wall came down and the footprints were all in a muddle.",
                "Byeon Hakdo tumbled off his seat.<br>\"In... Inspector, sir, this humble man only...\"<br>\"The magistrate of Namwon will hand over his seal. You leave that seat today.\" The hand that held out the seal shook like a leaf.",
                "Yi Mongnyong had the prison door opened at once. The door creaked as it swung. Chunhyang came walking out with people holding her up. The sunlight was so bright that for a long while she could not open her eyes.",
                "When at last she opened them, Yi Mongnyong was standing in front of her in an inspector's robes. Chunhyang was not surprised. She only said,<br>\"...You might have told me last night.\"<br>\"If I had, you would have shown it.\"<br>\"That is true.\"",
                "Then Chunhyang walked past him. Wolmae was standing beyond the wall. Wolmae came running, calling her daughter's name, and took her daughter's face in both hands. Chunhyang held her mother, and only then did she cry out loud.",
                "That autumn the two of them went up to Hanyang. Wolmae went with them.",
                "On the day before they left, Chunhyang climbed up to Gwanghallu. Yi Mongnyong came up after her.<br>\"This is where we first saw each other.\"<br>\"And I sent Bangja to call you. It was a truly rude thing to do.\" The willows had grown much thicker than they were then.",
                "\"Do you remember what I said that day?\"<br>\"That if I had something to say I should come myself.\"<br>\"Yes. It is because you listened to that that I am here.\" Below Gwanghallu the water ran as it had run then.",
                "Yi Mongnyong took the mirror out of his coat. Both their faces showed in it together. He had carried it three years and the rim was quite worn away.<br>\"I give it back to you. From now on it is for you to look and see what kind of man I have become.\""
            ]
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
            { w: "pavilion", k: "누각", s: "The pavilion where the two young people first see each other" },
            { w: "is still standing (stand)", k: "아직 서 있다", s: "is still standing there today" },
            { w: "rank", k: "신분", s: "people were born into ranks" },
            { w: "courtesan", k: "기생", s: "a girl born to a courtesan" },
            { w: "register", k: "명부", s: "was written into the register as one herself" },
            { w: "turns on ~ (turn on)", k: "~에 달려 있다", s: "is what the whole story turns on" }
        ],
        "ch1": [
            { w: "trailed down (trail)", k: "늘어져 있었다", s: "willows trailed down all around" },
            { w: "there was no finer view", k: "경치가 으뜸이었다", s: "there was no finer view in Namwon" },
            { w: "railing", k: "난간", s: "the railing was crowded with people" },
            { w: "blossom", k: "꽃", s: "come to look at the blossom" },
            { w: "lean on ~", k: "~에 기대다", s: "Lean on that railing" },
            { w: "sweet-flag water", k: "창포물", s: "washed their hair in sweet-flag water" },
            { w: "wrestled (wrestle)", k: "씨름했다", s: "and the men wrestled" },
            { w: "ran errands (run errands)", k: "심부름을 했다", s: "a manservant who ran errands for the town office" },
            { w: "hardly ever", k: "거의 ~하지 않다", s: "so he hardly ever went out" },
            { w: "his eye caught ~ (catch)", k: "눈에 들어왔다", s: "then his eye caught the willow grove" },
            { w: "hem", k: "옷자락", s: "The hem of a deep red skirt caught the wind" },
            { w: "leaned further out (lean out)", k: "몸을 더 내밀었다", s: "leaned further out over the railing" },
            { w: "narrowed his eyes (narrow)", k: "눈을 가늘게 떴다", s: "Bangja narrowed his eyes" },
            { w: "as if it were nothing much", k: "대수롭지 않게", s: "answered as if it were nothing much" },
            { w: "stole a look (steal a look)", k: "슬쩍 살폈다", s: "he stole a look at his young master's face" },
            { w: "got it out (get out)", k: "겨우 말을 꺼냈다", s: "Then at last he got it out" },
            { w: "went round (go round)", k: "휘둥그레졌다", s: "Bangja's eyes went round" },
            { w: "jumped (jump)", k: "펄쩍 뛰었다", s: "Bangja jumped" },
            { w: "is sent for (send for)", k: "부름을 받다", s: "that is not a girl who comes because she is sent for" },
            { w: "stamped his feet (stamp)", k: "발을 동동 굴렀다", s: "Bangja stamped his feet" },
            { w: "scratching his head (scratch)", k: "머리를 긁적이며", s: "came back alone, scratching his head" },
            { w: "when called (call)", k: "부르면", s: "but I am not someone who comes when called" },
            { w: "straightening her clothes (straighten)", k: "옷매무새를 고치고 있었다", s: "was straightening her clothes" },
            { w: "far off", k: "멀리서", s: "Only the cicadas sounded, far off" },
            { w: "It was rude of me to ~", k: "~한 것은 무례였다", s: "It was rude of me to send a man just now" },
            { w: "Forgive me", k: "용서하십시오", s: "Forgive me" },
            { w: "their eyes met (meet)", k: "눈이 마주쳤다", s: "Their eyes met" },
            { w: "before he could stop himself", k: "저도 모르게", s: "Yi Mongnyong laughed before he could stop himself" },
            { w: "the tips of her ears", k: "귀 끝", s: "Only the tips of her ears turned pink" },
            { w: "creaked (creak)", k: "삐걱거렸다", s: "the swing ropes creaked as they swung" },
            { w: "That is not for me to decide alone", k: "저 혼자 정할 일이 아닙니다", s: "That is not for me to decide alone" },
            { w: "gathered up (gather up)", k: "걷어 올렸다", s: "she gathered up the swing ropes over her shoulder" },
            { w: "closed over ~ (close over)", k: "덮었다", s: "The willow leaves closed over the place where she had been" },
            { w: "take in a word (take in)", k: "한 글자도 눈에 안 들어오다", s: "could not take in a word he read" },
            { w: "burned all the way down (burn down)", k: "다 타 내려갔다", s: "until the lamp wick had burned all the way down" },
            { w: "rubbed his eyes (rub)", k: "눈을 비볐다", s: "Bangja rubbed his eyes" }
        ],
        "ch2": [
            { w: "lane", k: "골목", s: "in a quiet lane outside the walls of Namwon" },
            { w: "rustled (rustle)", k: "서걱거렸다", s: "The bamboo leaves rustled in the wind" },
            { w: "callus", k: "굳은살", s: "There were hard calluses on her fingertips" },
            { w: "at this hour of the night", k: "이 밤중에", s: "at this hour of the night" },
            { w: "a promise for a hundred years", k: "백년가약", s: "a promise for a hundred years" },
            { w: "went stiff (go stiff)", k: "굳었다", s: "Wolmae's face went stiff" },
            { w: "in the eyes of the world", k: "세상 눈에는", s: "in the eyes of the world my daughter is a courtesan's daughter too" },
            { w: "What becomes of ~?", k: "~은 어찌 됩니까?", s: "What becomes of my child then?" },
            { w: "wet", k: "젖은", s: "Wolmae's eyes were wet" },
            { w: "There was not one thing wrong", k: "하나도 틀리지 않았다", s: "There was not one thing in what Wolmae had said that was wrong" },
            { w: "put it on paper (put)", k: "종이에 적다", s: "That is why I mean to put it on paper" },
            { w: "abandon", k: "저버리다", s: "would never abandon her as long as he lived" },
            { w: "pressed his thumbprint (press)", k: "손도장을 찍었다", s: "pressed his thumbprint on it" },
            { w: "did not shake at all (shake)", k: "조금도 떨리지 않았다", s: "The hand that held the brush did not shake at all" },
            { w: "What strength is there in ~?", k: "~에 무슨 힘이 있습니까?", s: "what strength is there in a piece of paper like this" },
            { w: "let it have none (let)", k: "없는 대로 두다", s: "then let it have none" },
            { w: "folded (fold)", k: "접었다", s: "then folded it and put it inside her jacket" },
            { w: "rustled in her hand (rustle)", k: "손안에서 바스락거렸다", s: "The paper rustled in her hand" },
            { w: "feast", k: "잔치", s: "It was not a great feast" },
            { w: "gathering", k: "모임, 자리", s: "It was a small gathering with Wolmae and Bangja" },
            { w: "side by side", k: "나란히", s: "sat side by side on the wooden floor and talked" },
            { w: "as far as ~", k: "~까지", s: "The moon came in as far as the edge of the floor" },
            { w: "the common people", k: "백성", s: "do the common people come into that book of yours" },
            { w: "half a book", k: "반쪽짜리 책", s: "Then it's only half a book" },
            { w: "grew serious (grow serious)", k: "진지해졌다", s: "Then he grew serious" },
            { w: "market street", k: "저잣거리", s: "In the market street" },
            { w: "quite calmly", k: "담담하게", s: "Chunhyang said it quite calmly" },
            { w: "ground the ink (grind)", k: "먹을 갈았다", s: "She had already ground the ink on the stone" },
            { w: "character", k: "글자", s: "Which character shall we write first" },
            { w: "the hardest of them all", k: "제일 어려운 것", s: "I heard it is the hardest of them all" },
            { w: "simply go on (go on)", k: "그냥 이어지다", s: "thought that time would simply go on" },
            { w: "was raised to ~ (raise)", k: "벼슬이 올랐다", s: "had been raised to a higher post" },
            { w: "in an uproar", k: "발칵 뒤집힌", s: "The town office was in an uproar overnight" },
            { w: "Pack your things (pack)", k: "짐을 꾸려라", s: "Pack your things" },
            { w: "sit an examination (sit)", k: "과거를 보다", s: "You have an examination to sit" }
        ],
        "ch3": [
            { w: "turned away from ~ (turn away)", k: "발길을 돌렸다", s: "He turned away from the gate several times" },
            { w: "the moment ~", k: "~하자마자", s: "The moment he stepped into the room Chunhyang knew" },
            { w: "read it in his face (read)", k: "얼굴빛으로 알아챘다", s: "She had read it in his face alone" },
            { w: "departure", k: "떠남, 출발", s: "the departure in three days" },
            { w: "could not lift his head (lift)", k: "고개를 들지 못했다", s: "He could not lift his head the whole time he was speaking" },
            { w: "nodded (nod)", k: "고개를 끄덕였다", s: "Chunhyang nodded" },
            { w: "fingertips", k: "손끝", s: "Only her fingertips shook" },
            { w: "in her lap", k: "무릎 위에", s: "Her hands were lying in her lap" },
            { w: "sprang to his feet (spring)", k: "벌떡 일어났다", s: "Yi Mongnyong sprang to his feet" },
            { w: "before he could help it", k: "저도 모르게", s: "His voice rose before he could help it" },
            { w: "cannot do as they like with ~", k: "어찌하지 못하다", s: "A person cannot do as they like with their own heart" },
            { w: "sewing basket", k: "반짇고리", s: "she took something out of her sewing basket" },
            { w: "the size of a palm", k: "손바닥만 한", s: "It was a mirror the size of a palm" },
            { w: "rim", k: "테두리", s: "the rim was smooth and shining" },
            { w: "just as it is", k: "있는 그대로", s: "A mirror shows a thing just as it is" },
            { w: "whatever kind of ~", k: "어떤 ~이든", s: "Whatever kind of man you become" },
            { w: "took ~ off his finger (take off)", k: "손가락에서 빼었다", s: "took the jade ring off his own finger" },
            { w: "gleamed (gleam)", k: "반짝였다", s: "The ring caught the lamplight and gleamed" },
            { w: "as long as ~", k: "~하는 동안은", s: "As long as this ring is not on my hand" },
            { w: "at dawn", k: "새벽에", s: "At dawn the next day the magistrate's party left Namwon" },
            { w: "baggage cart", k: "짐수레", s: "the baggage carts stood in a row" },
            { w: "mist", k: "안개", s: "The morning mist was thick" },
            { w: "see ~ off (see off)", k: "배웅하다", s: "where people saw travellers off and welcomed them home" },
            { w: "bridle", k: "말고삐", s: "The hand on the bridle tightened" },
            { w: "again and again", k: "몇 번이나", s: "Yi Mongnyong looked back again and again" },
            { w: "exactly where she had been", k: "그 자리 그대로", s: "Chunhyang was standing exactly where she had been" },
            { w: "the top of the pass", k: "고갯마루", s: "At the top of the pass Yi Mongnyong stopped his horse" },
            { w: "a dot", k: "점 하나", s: "At last she was a dot, and then she was gone" },
            { w: "gone right down (go down)", k: "다 기울었다", s: "until the sun had gone right down" },
            { w: "pulled at her sleeve (pull)", k: "소매를 잡아끌었다", s: "Wolmae pulled at her sleeve several times" },
            { w: "soaked with dew (soak)", k: "이슬에 젖었다", s: "The hem of her skirt was soaked with dew" },
            { w: "threaded ~ on a string (thread)", k: "실에 꿰었다", s: "Chunhyang threaded the jade ring on a string" },
            { w: "lay cool (lie)", k: "서늘하게 놓여 있었다", s: "The ring lay cool against her breast" },
            { w: "not one word would go in", k: "한 글자도 안 들어왔다", s: "There were nights when not one word would go in" }
        ],
        "ch4": [
            { w: "the following spring", k: "이듬해 봄", s: "the following spring a new magistrate came to Namwon" },
            { w: "loud from the start", k: "처음부터 요란한", s: "His arrival was loud from the start" },
            { w: "palanquin", k: "가마", s: "Ten baggage carts followed behind the palanquin" },
            { w: "household goods", k: "세간", s: "packed with silk and dishes and household goods" },
            { w: "looked at one another (look)", k: "서로 얼굴을 쳐다보았다", s: "The people watching looked at one another" },
            { w: "ledger", k: "문서, 장부", s: "They lined up with their ledgers in their arms" },
            { w: "storehouse", k: "창고, 곳간", s: "How much grain is there in this town's storehouse" },
            { w: "That can wait", k: "그건 나중에", s: "That can wait" },
            { w: "glanced at one another (glance)", k: "서로 눈치를 보았다", s: "The officers glanced at one another" },
            { w: "not one of them was willing", k: "아무도 선뜻 나서지 않았다", s: "Not one of them was willing to open his mouth" },
            { w: "went over the wall (go over)", k: "담을 넘어갔다", s: "The sound of the music went over the wall" },
            { w: "however late it got", k: "밤이 깊어도", s: "The lamps did not go out however late it got" },
            { w: "in advance", k: "미리", s: "collected in advance, before they were due" },
            { w: "carried off (carry off)", k: "떼어 갔다", s: "they carried off the cooking pots" },
            { w: "his hand stopped (stop)", k: "손을 멈췄다", s: "was turning the pages of the courtesan register and his hand stopped" },
            { w: "clerk", k: "아전", s: "a junior official who did the day-to-day work of a town office" },
            { w: "carefully", k: "조심스레", s: "beside him spoke carefully" },
            { w: "Sweat stood on ~ (stand)", k: "땀이 맺혔다", s: "Sweat stood on the clerk's forehead" },
            { w: "laughed out loud (laugh out loud)", k: "껄껄 웃었다", s: "Byeon Hakdo laughed out loud" },
            { w: "carried across ~ (carry)", k: "울려 퍼졌다", s: "His laughter carried across the yard" },
            { w: "What sort of ~ is ...?", k: "무슨 ~란 말이냐?", s: "What sort of husband is a man seven hundred li away" },
            { w: "runner", k: "사령", s: "The runners went to Chunhyang's house" },
            { w: "blocking the gate (block)", k: "대문을 막고", s: "Wolmae stood blocking the gate" },
            { w: "Stand aside", k: "비키시오", s: "Stand aside" },
            { w: "rang in the lane (ring)", k: "골목을 울렸다", s: "The runners' footsteps rang in the lane" },
            { w: "neatly combed (comb)", k: "곱게 빗은", s: "her hair was neatly combed" },
            { w: "not a trace of ~", k: "~한 기색이 조금도 없는", s: "There was not a trace of trembling in her" },
            { w: "You cannot refuse to go", k: "안 갈 수는 없다", s: "You cannot refuse to go when you are called" },
            { w: "as though it were a show", k: "무슨 구경이라도 난 듯", s: "as though it were a show" },
            { w: "craning their necks (crane)", k: "목을 빼고", s: "were craning their necks" },
            { w: "looked down at ~ (look down)", k: "내려다보았다", s: "sat on the raised floor and looked down at Chunhyang" },
            { w: "pleased", k: "흡족한", s: "and then his face turned pleased" },
            { w: "wait upon ~ (wait upon)", k: "시중을 들다", s: "Come into the office and wait upon me" },
            { w: "snapped ~ shut (snap shut)", k: "탁 접었다", s: "he snapped his fan shut" },
            { w: "held their breath (hold one's breath)", k: "숨을 죽였다", s: "People held their breath and watched Chunhyang's mouth" },
            { w: "carried clearly (carry)", k: "또렷하게 들렸다", s: "it carried clearly to the far end of the yard" }
        ],
        "ch5": [
            { w: "went off ~ (go off)", k: "사라졌다", s: "The smile went off Byeon Hakdo's face" },
            { w: "marriage paper", k: "혼서", s: "Have you a marriage paper" },
            { w: "tightened (tighten)", k: "힘이 들어갔다", s: "His hand tightened on the fan" },
            { w: "a scrap of paper", k: "종이 쪼가리", s: "a scrap of paper passed between a courtesan's daughter" },
            { w: "That much is not for you to decide", k: "그것까지 정하실 수는 없다", s: "That much is not for you to decide" },
            { w: "struck the table (strike)", k: "상을 내리쳤다", s: "Byeon Hakdo struck the table" },
            { w: "making a fool of ~ (make a fool of)", k: "능멸하다", s: "The creature is making a fool of the magistrate" },
            { w: "went over (go over)", k: "넘어졌다", s: "A cup went over on the table" },
            { w: "hesitated (hesitate)", k: "머뭇거렸다", s: "The runners hesitated" },
            { w: "did not cry out (cry out)", k: "소리를 지르지 않았다", s: "she did not cry out" },
            { w: "for every stroke", k: "한 대에 한 번씩", s: "she said one thing for every stroke" },
            { w: "cracked (crack)", k: "갈라졌다", s: "Her voice cracked, but it was clear" },
            { w: "keep faith with ~", k: "~를 섬기다", s: "What crime is it to keep faith with one husband" },
            { w: "hold no second heart", k: "두 마음을 품지 않다", s: "What crime is it to hold no second heart" },
            { w: "turns upside down (turn upside down)", k: "뒤집히다", s: "If the world turns upside down I will not change these words" },
            { w: "stepped back (step back)", k: "물러섰다", s: "one of them put down the rod and stepped back" },
            { w: "clenched their fists (clench)", k: "주먹을 쥐었다", s: "some of them clenched their fists" },
            { w: "burst into tears (burst)", k: "울음을 터뜨렸다", s: "The children up on the wall burst into tears" },
            { w: "with her own mouth", k: "제 입으로", s: "until she says it with her own mouth" },
            { w: "damp", k: "축축한", s: "The prison was dark and damp" },
            { w: "seeped (seep)", k: "배어 나왔다", s: "water seeped from the walls" },
            { w: "a hand's breadth", k: "한 뼘", s: "Not a hand's breadth of sunlight came in all day" },
            { w: "pushed ~ through the bars (push)", k: "창살 사이로 넣었다", s: "She pushed food through the bars and wept" },
            { w: "went white (go white)", k: "하얗게 질렸다", s: "Her hands went white where they gripped the bars" },
            { w: "It is because I have done none", k: "죄가 없으니까", s: "It is because I have done none that I am here" },
            { w: "The flesh went from ~ (go)", k: "살이 빠졌다", s: "The flesh went from Chunhyang's face" },
            { w: "could not bear to look (bear)", k: "차마 보지 못했다", s: "Even the gaolers could not bear to look" },
            { w: "worn smooth (wear)", k: "반들반들해졌다", s: "She wrote it until the earth floor was worn smooth" },
            { w: "be governed (govern)", k: "다스려지다", s: "how a country's people should be governed" },
            { w: "did not touch the paper (touch)", k: "종이에 닿지 않았다", s: "the tip of it did not touch the paper" },
            { w: "all at once", k: "문득", s: "Then all at once he remembered something he had heard long before" },
            { w: "came first of them all (come first)", k: "장원으로 뽑혔다", s: "That day Yi Mongnyong came first of them all" },
            { w: "secret inspector", k: "암행어사", s: "send me as a secret inspector" },
            { w: "widened (widen)", k: "커졌다", s: "The king's eyes widened" },
            { w: "engraved (engrave)", k: "새겨진", s: "a round iron badge with horses engraved on it" },
            { w: "set out (set out)", k: "길을 나섰다", s: "Then he set out south" }
        ],
        "ch6": [
            { w: "rags", k: "다 해진 옷", s: "He put on rags and straw sandals" },
            { w: "brim", k: "갓의 챙", s: "a hat with a broken brim" },
            { w: "on purpose", k: "일부러", s: "He rubbed dirt into his face on purpose" },
            { w: "Only if ~", k: "~해야만", s: "Only if nobody knew him could he see what a town was really like" },
            { w: "crossed into ~ (cross)", k: "~에 들어섰다", s: "The moment he crossed into Namwon land" },
            { w: "paddy", k: "논", s: "The water had dried out of the paddies" },
            { w: "grown over ~ (grow over)", k: "덮여 자랐다", s: "Grass had grown over the road" },
            { w: "inn", k: "주막", s: "He went into an inn and ordered a bowl of soup and rice" },
            { w: "at the next table", k: "옆자리에서", s: "the people at the next table were saying" },
            { w: "stone cold", k: "다 식은", s: "He sat like that until the soup was stone cold" },
            { w: "hardly looks like ~", k: "~의 꼴이 아니다", s: "she hardly looks like a person any more" },
            { w: "had fallen in (fall in)", k: "무너졌다", s: "The wall had fallen in" },
            { w: "dried up (dry up)", k: "말라 버렸다", s: "the chrysanthemum pots in the yard had all dried up" },
            { w: "as it always had", k: "예전 그대로", s: "Only the bamboo stood as it always had" },
            { w: "did not know him (know)", k: "알아보지 못했다", s: "for a long moment did not know him" },
            { w: "went over him (go over)", k: "행색을 훑었다", s: "Wolmae's eyes went over him" },
            { w: "sat straight down on the ground (sit down)", k: "그 자리에 주저앉았다", s: "Wolmae sat straight down on the ground" },
            { w: "carried out into ~ (carry)", k: "새어 나갔다", s: "Her crying carried out into the lane" },
            { w: "has come to that (come to)", k: "그 지경이 되었다", s: "My child has come to that, waiting" },
            { w: "made no excuse (make an excuse)", k: "변명하지 않았다", s: "Yi Mongnyong made no excuse at all" },
            { w: "pressed his face to ~ (press)", k: "얼굴을 붙였다", s: "Yi Mongnyong pressed his face to the bars" },
            { w: "pitch dark", k: "캄캄한", s: "Inside it was pitch dark" },
            { w: "chains dragging (drag)", k: "쇠사슬 끄는", s: "There was a sound of chains dragging" },
            { w: "has not changed (change)", k: "변하지 않았다", s: "Your voice has not changed" },
            { w: "his breath stopped (stop)", k: "숨이 막혔다", s: "Yi Mongnyong saw it and his breath stopped" },
            { w: "hollow", k: "홀쭉한", s: "Her cheeks were hollow" },
            { w: "nothing but bone", k: "뼈만 남은", s: "there was nothing but bone at her wrists" },
            { w: "the state of him", k: "그 행색", s: "Chunhyang looked at the state of him too" },
            { w: "show it (show)", k: "티를 내다", s: "she would show it in the prison" },
            { w: "come apart (come apart)", k: "어그러지다", s: "then the whole thing would come apart" },
            { w: "kept catching (catch)", k: "자꾸 걸렸다", s: "The words kept catching in his throat" },
            { w: "grown loose (grow loose)", k: "헐거워졌다", s: "The ring had grown loose on her finger" },
            { w: "look after ~ (look after)", k: "돌보다", s: "Please look after my mother" },
            { w: "will not bear it (bear)", k: "못 견딜 것이다", s: "If she is left on her own she will not bear it" }
        ],
        "ch7": [
            { w: "before dawn", k: "새벽부터", s: "The music started before dawn" },
            { w: "in rows", k: "줄지어", s: "they sat in rows on the raised floor" },
            { w: "piled with ~ (pile)", k: "그득했다", s: "Every table was piled with meat and wine" },
            { w: "sent for (send for)", k: "불려 왔다", s: "More than twenty courtesans and musicians had been sent for" },
            { w: "slipped quietly into ~ (slip)", k: "슬그머니 들어섰다", s: "a man in worn-out clothes slipped quietly into the yard" },
            { w: "pushing in (push in)", k: "끼어드는", s: "what beggar is pushing in at a feast" },
            { w: "waved a hand (wave)", k: "손을 저었다", s: "one of the visiting magistrates waved a hand" },
            { w: "an ill thing to ~", k: "흉한 일", s: "It's an ill thing to drive a man off on a feast day" },
            { w: "not liking it (like)", k: "못마땅해하며", s: "The runners stepped back, not liking it" },
            { w: "grew merry (grow merry)", k: "흥이 올랐다", s: "Byeon Hakdo grew merry" },
            { w: "beat the table (beat)", k: "상을 두드렸다", s: "He beat the table with his fan and hummed" },
            { w: "the whole company", k: "좌중", s: "The whole company turned to look" },
            { w: "burst out laughing (burst out)", k: "웃음바다가 되었다", s: "The company burst out laughing" },
            { w: "took him seriously (take seriously)", k: "곧이들었다", s: "Not one of them took him seriously" },
            { w: "read it out (read out)", k: "소리 내어 읽었다", s: "Then he read it out" },
            { w: "carried to ~ (carry)", k: "~까지 들렸다", s: "it carried to the far end of the hall" },
            { w: "candle wax", k: "촛농", s: "Where the candle wax falls" },
            { w: "bitter voices", k: "원망 소리", s: "the bitter voices are loudest too" },
            { w: "backing away (back away)", k: "뒷걸음질 쳤다", s: "Another got up and began backing away" },
            { w: "insolence", k: "무엄함", s: "what insolence is this" },
            { w: "Drag him out (drag)", k: "끌어내라", s: "Drag him out at once" },
            { w: "rushed at ~ (rush)", k: "달려들었다", s: "The runners rushed at him" },
            { w: "held it up high (hold up)", k: "높이 들었다", s: "took something out of his coat and held it up high" },
            { w: "flashed (flash)", k: "번쩍였다", s: "The metal flashed in the sunlight" },
            { w: "broke out (break out)", k: "터졌다", s: "a great shout broke out beyond the wall" },
            { w: "burst open (burst)", k: "부서지듯 열렸다", s: "The gate burst open" },
            { w: "came pouring in (pour in)", k: "쏟아져 들어왔다", s: "the inspector's men came pouring in" },
            { w: "went over (go over)", k: "뒤집혔다", s: "Tables went over and wine bottles rolled" },
            { w: "all in a muddle", k: "어지러운", s: "the footprints were all in a muddle" },
            { w: "tumbled off ~ (tumble)", k: "굴러떨어졌다", s: "Byeon Hakdo tumbled off his seat" },
            { w: "hand over ~ (hand over)", k: "내놓다", s: "The magistrate of Namwon will hand over his seal" },
            { w: "shook like a leaf (shake)", k: "사시나무처럼 떨렸다", s: "The hand that held out the seal shook like a leaf" },
            { w: "holding her up (hold up)", k: "부축하며", s: "Chunhyang came walking out with people holding her up" },
            { w: "was not surprised (surprise)", k: "놀라지 않았다", s: "Chunhyang was not surprised" },
            { w: "might have told me (might have)", k: "말씀하시지 그러셨어요", s: "You might have told me last night" },
            { w: "walked past ~ (walk past)", k: "지나쳐 걸었다", s: "Then Chunhyang walked past him" },
            { w: "cried out loud (cry)", k: "소리 내어 울었다", s: "and only then did she cry out loud" },
            { w: "much thicker (thick)", k: "훨씬 굵어진", s: "The willows had grown much thicker than they were then" },
            { w: "quite worn away (wear away)", k: "다 닳았다", s: "the rim was quite worn away" }
        ],
        "after": [
            { w: "written down (write down)", k: "글로 옮겨진", s: "the pansori song Chunhyang-ga written down" },
            { w: "drummer", k: "북 치는 사람", s: "one singer with only a drummer beside him" },
            { w: "survive (survive)", k: "남아 전하다", s: "more than a hundred old copies survive" },
            { w: "to the end", k: "끝까지", s: "she is a courtesan's daughter to the end" },
            { w: "hardly anyone", k: "거의 아무도 ~않다", s: "there was hardly anyone who did not know it" },
            { w: "at the root of ~", k: "~의 뿌리에", s: "At the root of this story is rank" },
            { w: "however well ~", k: "아무리 ~해도", s: "So however well she and Yi Mongnyong suited each other" },
            { w: "nowhere to take her to", k: "데려갈 자리가 없는", s: "It was because there was nowhere to take her to" },
            { w: "under the rules of that time", k: "그 시절 법도 안에서는", s: "was simply not possible under the rules of that time" },
            { w: "stood up to ~ (stand up to)", k: "맞섰다", s: "So Chunhyang standing up to Byeon Hakdo is not only about love" },
            { w: "refused (refuse)", k: "부정했다", s: "Chunhyang refused that register" },
            { w: "It would be a pity to ~", k: "~하면 아깝다", s: "It would be a pity to read Byeon Hakdo as nothing but a bad magistrate" },
            { w: "by the book", k: "법대로", s: "He did it by the book, and a person was broken" },
            { w: "is aiming at ~ (aim at)", k: "겨누고 있다", s: "What the story is really aiming at is not one man but that law" },
            { w: "slipping away (slip away)", k: "슬금슬금 빠져나가는", s: "That is why the people at that feast began slipping away" },
            { w: "an invented office", k: "지어낸 벼슬", s: "The secret inspector is not an invented office" },
            { w: "cheated on ~ (cheat)", k: "속여 걷었다", s: "a way of catching towns that cheated on the tax" },
            { w: "receives offerings (receive)", k: "제사를 받는다", s: "and she receives offerings" },
            { w: "no way to check it", k: "확인할 길이 없다", s: "There is no way to check it" },
            { w: "the turning over", k: "뒤집기", s: "One reason this story has been loved so long is the turning over" },
            { w: "by holding out (hold out)", k: "버티기로", s: "And not by force, but by holding out" },
            { w: "kept ~ fed (keep fed)", k: "옥바라지를 했다", s: "the one who kept her daughter fed in prison" },
            { w: "in rags", k: "거지꼴로", s: "at the sight of a son-in-law come home in rags" },
            { w: "may well be ~", k: "어쩌면 ~일 것이다", s: "The person who suffered most in this story may well be her" },
            { w: "even then", k: "그때도", s: "Would what she did have been right even then" },
            { w: "what it means that ~", k: "~라는 것이 무슨 뜻인지", s: "what it means that somebody had to be standing in that place" }
        ]
    },
    quiz: [
        { q: "Where did the two of them first meet?", choices: ["In front of the palace in Hanyang", "At Gwanghallu in Namwon", "At the Namwon town office"], answer: 1 },
        { q: "What was Chunhyang doing when Yi Mongnyong first saw her?", choices: ["Reading a book", "Sitting in the prison", "Riding a swing"], answer: 2 },
        { q: "Why did the two of them have to part?", choices: ["His father was moved to Hanyang", "Chunhyang was moving far away", "The new magistrate separated them"], answer: 0 },
        { q: "What did Chunhyang give him when they parted?", choices: ["A silk handkerchief", "A brush made of jade", "A mirror"], answer: 2 },
        { q: "What did the new magistrate Byeon Hakdo order Chunhyang to do?", choices: ["To have her name entered in the courtesan register", "To come and cook at the town office", "To leave Namwon and go far away"], answer: 0 },
        { q: "What did Chunhyang answer?", choices: ["That she already had a husband", "That she needed a little more time", "Nothing at all"], answer: 0 },
        { q: "What happened to Chunhyang?", choices: ["She was driven out of Namwon", "She was beaten and shut in the prison", "She was made a servant at the town office"], answer: 1 },
        { q: "What did Yi Mongnyong do in Hanyang?", choices: ["Sat the examination and became an inspector", "Worked under Byeon Hakdo", "Went straight back to Namwon"], answer: 0 },
        { q: "How was Yi Mongnyong dressed when he came back to Namwon?", choices: ["In silk clothes", "Like a beggar", "Holding up the mapae"], answer: 1 },
        { q: "What did Chunhyang say to him at the prison?", choices: ["That he should have come sooner", "That he should never come again", "That he should look after her mother"], answer: 2 },
        { q: "What was the poem Yi Mongnyong made at the feast about?", choices: ["That the good wine is the people's blood", "The spring view from Gwanghallu", "A traveller missing his home"], answer: 0 },
        { q: "What did Yi Mongnyong hold up at the feast?", choices: ["A letter from the king", "The mapae", "A seal made of jade"], answer: 1 },
        { q: "What happened to Byeon Hakdo?", choices: ["He was dragged to Hanyang and shut up", "He lost his post on the spot", "He gave up his post himself"], answer: 1 },
        { q: "What was the first thing Chunhyang did when she came out of the prison?", choices: ["She scolded Byeon Hakdo", "She ran to Gwanghallu", "She held her mother"], answer: 2 },
        {
            q: "Which reaction to this book does NOT fit?",
            wide: true,
            choices: [
                "The new governor ordered her name onto the register, so we can see how an official treated ordinary people then.",
                "She only said she already had a husband and would not step back, so what she kept was more than love.",
                "Mongryong came back in rags and looked around before showing the tablet, so that is what an office is for.",
                "In the prison she asked him why he had taken so long, so we can feel how hard the waiting had been."
            ],
            answer: 3
        }
    ],
    afterword: {
        title: 'After Reading',
        emoji: '🌸',
        art: ['end.webp'],
        paras: [
            "First, where this story came from. The Tale of Chunhyang is the pansori song Chunhyang-ga written down. It was a long song; one singer with only a drummer beside him would sometimes sing it for eight hours.",
            "There is no author. It was not made by one person sitting down to write it, but by many people singing it and changing it. So more than a hundred old copies survive, and every one of them is a little different. In some of them Chunhyang is a nobleman's daughter; in others she is a courtesan's daughter to the end.",
            "Of all our old stories this is the one that has been read most and sung most. In the late Joseon period there was hardly anyone who did not know it.",
            "At the root of this story is rank. Chunhyang is the daughter of Wolmae, a retired courtesan. In those days if the mother was a courtesan the daughter's name went into the courtesan register too. So however well she and Yi Mongnyong suited each other, they could not be properly married.",
            "You have to see that clearly to understand the parting in chapter three. Yi Mongnyong did not fail to take her with him because his feeling had cooled. It was because there was nowhere to take her to. For a nobleman's son to bring a courtesan's daughter up to the capital was simply not possible under the rules of that time.",
            "So Chunhyang standing up to Byeon Hakdo is not only about love. If your name was in the courtesan register you had to go when the magistrate called. Chunhyang refused that register. She was saying, I am not that. That is why she was beaten.",
            "It would be a pity to read Byeon Hakdo as nothing but a bad magistrate. He broke no law. Under the law of that time a magistrate could send for a registered courtesan. He did it by the book, and a person was broken. What the story is really aiming at is not one man but that law.",
            "The poem Yi Mongnyong reads at the feast in chapter seven is a real poem, and a famous one. The good wine in the golden cup is the blood of a thousand people; the fine food on the jade dish is the fat of ten thousand. And then: where the candle wax falls, the people's tears are falling, and where the singing is loudest, the bitter voices are loudest too.",
            "That is why the people at that feast began slipping away. They had understood it.",
            "The secret inspector is not an invented office. He was an official the king sent out in secret, and it really existed in the Joseon period. The mapae was a warrant for hiring post horses, and inspectors also carried a measuring rod called a yucheok, to check whether a town's measures and rulers were honest. It was a way of catching towns that cheated on the tax.",
            "Gwanghallu really stands in Namwon. It was built early in the Joseon period, and this story made it famous. Beside it there is a shrine to Chunhyang, and a Chunhyang festival is held every year. She is a person out of a story, and she receives offerings.",
            "Whether there ever was a real Chunhyang, nobody knows. There is a tradition that such a girl lived in Namwon, but that is a story too. There is no way to check it. What is certain is only that people wanted so much to believe it had happened.",
            "One reason this story has been loved so long is the turning over. The person in the lowest place beats the person in the highest place. And not by force, but by holding out. Most of the people listening were in low places themselves, so that part must have felt very good.",
            "If you read it again, try following only Wolmae. She is the one who tried to keep her daughter from becoming a courtesan. She is the one who was angriest when Yi Mongnyong left, the one who kept her daughter fed in prison, and the one who sat down in the dirt at the sight of a son-in-law come home in rags. The person who suffered most in this story may well be her.",
            "If Yi Mongnyong had never come back, what would Chunhyang's holding out have been? The story brings him back, but he might not have come. Would what she did have been right even then?",
            "And what about his going to the prison still dressed as a beggar? The book says why he kept it back: she would have shown it on her face. Still, he left her one more night in there. Think about what would have been different if he had told her.",
            "Would this story have survived if Chunhyang had been a nobleman's daughter instead of a courtesan's? There would have been no beating and no prison. It is worth thinking about what it means that somebody had to be standing in that place for there to be a story at all."
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
