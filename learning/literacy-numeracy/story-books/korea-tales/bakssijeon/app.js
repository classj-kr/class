const BOOK_TITLE = "박씨전";

const CHAPTER_LABEL = n => (LANG === 'en' ? `Chapter ${n} · ` : `${n}장 · `);

const CHAPTERS = [
    {
        num: 1,
        emoji: "🏠",
        title: "금강산에서 온 혼인",
        art: ["story-01-a.webp", "story-01-b.webp", "story-01-c.webp"],
        artAt: ["삿갓을 쓴 노인이 대문 앞에 서 있었습니다", "가마에서 내린 신부", "시백은 밤새 등을 돌리고 앉아 있었습니다"],
        paras: [
            "조선 인조 임금 때 한양에 이득춘이라는 벼슬아치가 살았습니다. 사람들은 그를 이 상공<span class=\"gloss\">(높은 벼슬아치를 부르던 말)</span>이라 불렀습니다. 집안은 대대로 이름이 높았고 사람됨도 너그러웠습니다.",
            "이 상공에게는 시백이라는 아들이 하나 있었습니다. 글을 잘하고 얼굴도 훤해 한양에서 모르는 이가 없었습니다. 열여섯이 되자 혼인 이야기가 줄을 이었습니다.",
            "그러나 이 상공은 서두르지 않았습니다.<br>\"사람은 얼굴로 고르는 것이 아니다. 때가 되면 인연이 온다.\"",
            "어느 봄날 아침이었습니다. 삿갓을 쓴 노인이 대문 앞에 서 있었습니다. 베옷에 짚신 차림이었지만 눈빛이 맑고 걸음에 흐트러짐이 없었습니다.",
            "\"금강산에 사는 박 처사<span class=\"gloss\">(벼슬을 하지 않고 산에 사는 선비)</span>라 하오. 상공을 뵈러 왔소.\"",
            "이 상공은 노인을 사랑으로 모셨습니다. 두 사람은 바둑을 두고 글 이야기를 나누었습니다. 노인의 말은 한마디 한마디가 깊었습니다. 이 상공은 밤이 깊는 줄도 몰랐습니다.",
            "사흘째 되던 밤, 박 처사가 바둑돌을 내려놓았습니다.<br>\"상공, 내게 딸이 하나 있소. 댁의 아드님과 짝을 지어 주고 싶어 왔소.\"",
            "이 상공은 놀랐습니다. 처음 보는 사람이었고 집안도 알 수 없었습니다. 그러나 사흘 동안 본 노인의 됨됨이가 마음에 남았습니다.<br>\"따님은 어떤 분입니까.\"<br>\"재주는 있소. 얼굴은 보잘것없소.\"",
            "노인은 숨기지 않았습니다. 이 상공은 한참을 생각한 끝에 고개를 끄덕였습니다.<br>\"재주가 있다면 그것으로 되었습니다.\"",
            "집안이 뒤집혔습니다. 부인은 얼굴도 모르는 산골 처녀를 며느리로 들이느냐며 울었고, 친척들은 혀를 찼습니다. 시백은 아무 말도 하지 않았습니다. 아버지의 뜻을 거스를 수 없었기 때문입니다.",
            "글벗들이 시백을 놀렸습니다.<br>\"한양 제일 신랑이 산골 처녀를 얻는다지?\"<br>\"얼굴도 못 보고 장가를 드나.\"<br>시백은 웃어넘겼지만 밤에는 잠을 이루지 못했습니다.",
            "혼인날이 왔습니다. 신부 집이 금강산이라 혼례는 이 상공 댁에서 치렀습니다. 박 처사가 딸을 가마에 태워 데려왔습니다. 온 동네가 담 너머로 구경했습니다.",
            "가마에서 내린 신부는 얼굴을 너울로 가리고 있었습니다. 혼례가 끝나고 신방에 들어 너울을 벗었을 때, 시백은 숨을 멈추었습니다.",
            "얼굴이 검은 데다 피부는 옴퉁옴퉁 파였고, 눈은 짝짝이였습니다. 코는 납작하고 입은 비뚤어져 있었습니다. 한양에서 제일가는 신랑이 평생 본 적 없는 얼굴이었습니다.",
            "시백은 아무 말 없이 촛불을 등지고 돌아앉았습니다. 신부도 아무 말이 없었습니다. 시백은 밤새 등을 돌리고 앉아 있었습니다.",
            "이튿날 아침 시백은 사랑으로 나가 버렸습니다. 그날부터 신방에 들지 않았습니다. 집안 사람들은 며느리를 보고 수군거렸고, 부인은 며느리 앞에서 한숨을 쉬었습니다.",
            "며느리는 시부모께 아침저녁 문안을 드리고 제 방으로 돌아갔습니다. 누가 흉을 보아도 대꾸하지 않았습니다. 다만 밤이면 방에 불이 늦도록 켜져 있었습니다.",
            "부인은 며느리에게 부엌일을 시켰습니다. 얼굴이 그러니 손이라도 부지런해야 한다는 것이었습니다. 며느리는 군말 없이 물을 긷고 불을 지폈습니다. 그런데 며느리가 지은 밥은 이상하게 맛이 좋았습니다. 종들이 먼저 알아채고 수군거렸습니다.",
            "이 상공만은 달랐습니다. 며느리가 올리는 문안 인사의 말씨와 걸음을 유심히 보았습니다.<br>\"저 아이는 보통 사람이 아니다. 너희가 보는 것은 껍데기일 뿐이다.\"",
            "아무도 그 말을 귀담아듣지 않았습니다. 시백도 마찬가지였습니다. 혼인한 지 한 달이 지나도록 시백은 아내의 얼굴을 두 번 다시 보지 않았습니다.",
            "박 처사는 혼례 다음 날 금강산으로 돌아가며 딸에게 한마디만 남겼습니다.<br>\"삼 년이다. 삼 년만 참아라.\"<br>딸은 고개를 숙였습니다."
        ]
    },
    {
        num: 2,
        emoji: "🐎",
        title: "피화당",
        art: ["story-02-a.webp", "story-02-b.webp", "story-02-c.webp"],
        artAt: ["뒤뜰 한쪽에 작은 집을 지어 주십시오", "하룻밤 사이에 지은 조복", "비루먹은 말 한 마리"],
        paras: [
            "어느 날 며느리가 이 상공 앞에 나아가 청했습니다.<br>\"뒤뜰 한쪽에 작은 집을 지어 주십시오. 제가 거기서 지내겠습니다.\"",
            "이 상공은 까닭을 묻지 않고 그리하라 했습니다. 부인이 펄쩍 뛰었지만 소용없었습니다. 뒤뜰 대나무 숲 옆에 방 한 칸짜리 집이 섰습니다.",
            "며느리는 그 집에 피화당(避禍堂)이라는 이름을 붙였습니다. 화를 피하는 집이라는 뜻이었습니다. 사람들은 그 이름을 이상하게 여겼지만 곧 잊었습니다.",
            "피화당에는 몸종 계화가 함께 들어갔습니다. 열다섯 살 계화는 처음에는 무서워했습니다. 그러나 며칠 지나지 않아 마님을 따르게 되었습니다. 마님은 한 번도 큰소리를 내지 않았고, 무엇이든 먼저 해 보이고 나서 시켰습니다.",
            "계화는 마님이 밤마다 무엇을 하는지 보았습니다. 책을 읽고 별을 보고 뜰의 나무를 하나하나 손으로 만졌습니다. 나무를 심는 자리도 마님이 직접 정했습니다.<br>\"이 나무는 동쪽, 저 나무는 북쪽. 자리가 있단다.\"",
            "그해 겨울, 이 상공이 임금 앞에 나아갈 일이 생겼습니다. 조복<span class=\"gloss\">(벼슬아치가 임금 앞에 나갈 때 입는 옷)</span>을 새로 지어야 했는데 날이 사흘밖에 남지 않았습니다. 바느질 잘하는 이를 다 불러도 열흘은 걸린다고 했습니다.",
            "그날 밤 계화가 사랑으로 왔습니다.<br>\"마님께서 옷감을 보내 달라 하십니다.\"<br>부인이 코웃음을 쳤습니다.<br>\"그 얼굴로 바느질인들 제대로 하겠느냐.\"",
            "이 상공은 옷감을 보냈습니다. 이튿날 새벽 계화가 보자기를 안고 왔습니다. 펼쳐 보니 조복이었습니다. 하룻밤 사이에 지은 조복이었습니다.",
            "바늘땀이 어찌나 고른지 어디서 시작해 어디서 끝났는지 알 수 없었습니다. 소매에는 학이 수놓여 있었는데 금방이라도 날아오를 듯했습니다. 이 상공은 오래도록 옷을 들여다보았습니다.",
            "임금 앞에 나간 날, 여러 벼슬아치가 이 상공의 옷을 보고 물었습니다.<br>\"그 조복은 어디서 지으셨습니까.\"<br>이 상공은 웃기만 했습니다.",
            "봄이 되자 며느리가 다시 청했습니다.<br>\"돈 삼백 냥만 주십시오. 곧 갚겠습니다.\"<br>큰돈이었습니다. 부인은 이번에도 반대했지만 이 상공은 내주었습니다.",
            "며느리는 계화를 장에 보냈습니다.<br>\"제일 못난 말을 사 오너라. 비루먹고 뼈만 남은 놈으로.\"<br>계화는 영문을 몰랐지만 시키는 대로 했습니다.",
            "장에 가는 길에 계화가 물었습니다.<br>\"마님, 삼백 냥이면 좋은 말을 살 수 있는데 왜 못난 말을 사라 하십니까.\"<br>\"좋은 말은 누구나 알아본단다. 값도 그만큼 비싸지. 아직 아무도 못 알아본 말을 찾는 거야.\"",
            "계화가 끌고 온 것은 비루먹은 말 한 마리였습니다. 털이 군데군데 빠지고 갈비뼈가 다 드러났습니다. 장사꾼이 오히려 미안해할 정도였습니다. 집안 사람들이 그 말을 보고 웃음을 터뜨렸습니다.<br>\"삼백 냥으로 저걸 샀다고?\"",
            "며느리는 그 말을 피화당 곁에 매어 두고 손수 돌보았습니다. 날마다 정해진 때에 정해진 만큼 먹였습니다. 콩을 삶아 먹이고 좋은 물을 길어다 먹였습니다. 아침저녁으로 손으로 다리를 주물렀습니다.",
            "한 달이 지나자 털에 윤이 돌았습니다. 석 달이 지나자 갈비뼈에 살이 올랐습니다. 반년이 지나자 아무도 그 말을 보고 웃지 않았습니다. 뜰에서 한 바퀴만 돌아도 발굽 소리가 달랐습니다.",
            "부인이 담 너머로 그 말을 보고 하인에게 물었습니다.<br>\"저 말이 그 비루먹은 놈이냐.\"<br>\"예, 마님.\"<br>부인은 한참 말을 바라보다가 아무 말 없이 돌아섰습니다. 그날 저녁 부인은 며느리 흉을 보지 않았습니다.",
            "한 해가 되던 날 며느리가 말했습니다.<br>\"이 말을 장에 내가십시오. 값은 삼만 냥입니다. 한 푼도 깎지 마십시오.\"",
            "삼백 냥에 산 말을 삼만 냥에 팔라니 다들 미쳤다고 했습니다. 그런데 장에 나간 지 하루 만에 사겠다는 사람이 나타났습니다. 중국에서 온 사신이었습니다.",
            "\"이런 말은 우리나라에도 없소. 하늘이 낸 말이오.\"<br>사신은 삼만 냥을 세어 주고 말을 끌고 갔습니다. 온 한양이 그 이야기로 떠들썩했습니다.",
            "이 상공이 피화당으로 며느리를 찾아갔습니다.<br>\"네가 그 말이 명마인 줄 어찌 알았느냐.\"<br>\"말은 뼈를 봅니다. 털을 보지 않습니다.\"",
            "이 상공은 그 말을 오래 곱씹었습니다. 그러고는 아들을 불러 같은 말을 들려주었습니다. 시백은 듣고도 고개를 돌렸습니다. 아직은 아니었습니다."
        ]
    },
    {
        num: 3,
        emoji: "🌕",
        title: "허물을 벗다",
        art: ["story-03-a.webp", "story-03-b.webp", "story-03-c.webp"],
        artAt: ["푸른빛이 도는 돌로 만든 것이었습니다", "박 처사가 딸의 손을 잡고 뜰로 나갔습니다", "시백이 피화당 문 앞에 무릎을 꿇었습니다"],
        paras: [
            "그해 가을 나라에서 과거<span class=\"gloss\">(벼슬아치를 뽑던 나라 시험)</span>가 열렸습니다. 시백도 시험을 보러 가게 되었습니다. 떠나기 전날 밤, 계화가 시백에게 왔습니다.",
            "\"마님께서 이것을 드리라 하셨습니다.\"<br>계화가 연적<span class=\"gloss\">(벼루에 물을 붓는 작은 그릇)</span> 하나를 내밀었습니다. 푸른빛이 도는 돌로 만든 것이었습니다.",
            "시백은 받고 싶지 않았습니다. 그러나 계화가 물러가지 않고 서 있어 마지못해 받았습니다.<br>\"시험장에서 이 연적의 물로 먹을 가시라 하셨습니다.\"",
            "시험 날, 시백이 연적을 기울이자 물이 나오는데 먹 냄새가 향긋했습니다. 붓을 대니 글이 절로 흘렀습니다. 평소 제 글보다 한결 힘이 있었습니다. 시백은 붓을 멈추지 못하고 단숨에 써 내려갔습니다.",
            "시백은 장원<span class=\"gloss\">(과거에서 첫째로 뽑히는 것)</span>으로 뽑혔습니다. 임금이 친히 불러 글을 칭찬했습니다. 한양이 다시 이 상공 댁 이야기로 떠들썩했습니다.",
            "집에 돌아온 시백은 연적을 오래 들여다보았습니다. 그러고는 피화당 쪽을 한 번 바라보았습니다. 그러나 발이 그쪽으로 가지는 않았습니다.",
            "잔치가 벌어졌습니다. 친척과 글벗들이 몰려와 시백을 치켜세웠습니다. 그 자리에 박씨는 없었습니다. 아무도 박씨를 부르지 않았고, 박씨도 나오지 않았습니다. 계화만 뒤뜰에서 잔치 소리를 들었습니다.",
            "혼인한 지 세 해가 되던 봄이었습니다. 삿갓을 쓴 노인이 다시 대문 앞에 섰습니다. 박 처사였습니다. 이 상공이 버선발로 뛰어나왔습니다.",
            "\"삼 년이 찼소. 딸을 좀 보러 왔소.\"<br>박 처사는 곧장 피화당으로 갔습니다. 딸이 문 앞에 서 있었습니다. 부녀는 아무 말 없이 서로를 보았습니다.",
            "그날 밤 박 처사가 딸의 손을 잡고 뜰로 나갔습니다. 달이 밝았습니다. 노인이 낮은 소리로 무어라 외웠습니다. 계화가 문틈으로 그것을 보았습니다.",
            "마님의 얼굴에서 무언가가 벗겨졌습니다. 얇은 껍질 같은 것이 스르르 떨어져 발밑에 놓였습니다. 검고 얽은 껍질이었습니다.",
            "그 아래에서 나온 얼굴을 계화는 평생 잊지 못했습니다. 달빛을 받은 얼굴이 옥처럼 희고 눈이 맑았습니다. 세상에 그런 얼굴이 있는 줄 몰랐습니다. 계화는 그만 소리를 지르고 말았습니다.",
            "박 처사가 껍질을 주워 소매에 넣었습니다.<br>\"너는 태어날 때부터 하늘의 기운을 타고났다. 그 기운이 너무 커서 액운이 따랐지. 그래서 삼 년 동안 이 껍질로 가려 둔 것이다.\"",
            "\"이제 액운이 다했다. 앞으로 큰일이 있을 것이니 네 재주를 아끼지 마라.\"<br>박 처사는 그 말을 남기고 새벽에 떠났습니다. 배웅도 받지 않았습니다.",
            "이튿날 아침 온 집안이 뒤집혔습니다. 문안을 드리러 온 며느리를 아무도 알아보지 못했습니다. 부인은 낯선 여인이 들어온 줄 알고 소리를 질렀습니다.",
            "\"어머님, 접니다.\"<br>목소리는 그대로였습니다. 이 상공이 먼저 알아보고 껄껄 웃었습니다.<br>\"내가 뭐라 하더냐. 껍데기라 하지 않았느냐.\"",
            "시백은 그 소식을 사랑에서 들었습니다. 한참을 앉아 있다가 일어섰습니다. 뒤뜰로 가는 걸음이 무거웠습니다. 삼 년 동안 한 번도 가지 않은 길이었습니다.",
            "이 상공이 아들을 불러 세웠습니다.<br>\"얼굴이 고와졌다고 가는 것이냐.\"<br>시백은 대답하지 못했습니다.<br>\"그렇다면 가지 마라. 그 아이가 더 아플 것이다.\"<br>시백은 그 자리에 오래 서 있다가 천천히 걸음을 옮겼습니다.",
            "시백이 피화당 문 앞에 무릎을 꿇었습니다.<br>\"내가 사람을 얼굴로만 보았소. 삼 년 동안 그대에게 한 일을 어찌 갚아야 할지 모르겠소.\"",
            "문이 열리고 박씨가 나왔습니다. 시백은 고개를 들지 못했습니다.<br>\"서방님이 미워한 것은 제가 아니라 제 껍질이었습니다. 그 껍질은 이제 없습니다.\"",
            "\"다만 하나만 아셔야 합니다. 껍질이 벗겨졌다고 제가 달라진 것은 아닙니다. 조복을 지은 것도, 말을 기른 것도, 연적을 보낸 것도 그때의 저입니다.\"",
            "시백은 그 말에 얼굴이 뜨거워졌습니다.<br>\"압니다. 이제야 압니다.\"<br>박씨가 시백을 일으켜 세웠습니다. 계화가 문 뒤에서 눈물을 닦았습니다.",
            "그날부터 시백은 피화당에 들었습니다. 두 사람은 밤마다 책을 읽고 이야기를 나누었습니다. 시백은 아내가 저보다 아는 것이 많다는 것을 알았습니다. 그것이 부끄럽지 않고 든든했습니다."
        ]
    },
    {
        num: 4,
        emoji: "🎵",
        title: "북쪽에서 오는 구름",
        art: ["story-04-a.webp", "story-04-b.webp", "story-04-c.webp"],
        artAt: ["북쪽 하늘에 검은 기운이 서렸습니다", "기홍대라는 여인이었습니다", "계화가 술상을 들고 들어갔습니다"],
        paras: [
            "박씨는 별을 보는 사람이었습니다. 밤이면 피화당 뜰에 나가 하늘을 오래 올려다보았습니다. 시백은 그 곁에 앉아 아내가 무엇을 보는지 물었습니다.",
            "어느 밤 박씨의 얼굴이 굳었습니다. 북쪽 하늘에 검은 기운이 서렸습니다.<br>\"북쪽에서 큰일이 옵니다. 청나라가 군사를 일으킬 것입니다.\"",
            "그 무렵 조선 조정은 청나라를 오랑캐라 낮잡아 보았습니다. 명나라만 섬기고 청나라 사신은 홀대했습니다. 청나라 임금이 몇 번이나 경고를 보냈지만 조정은 듣지 않았습니다.",
            "박씨가 시백에게 말했습니다.<br>\"임금께 아뢰십시오. 청나라는 곧 쳐들어옵니다. 먼저 사신을 보내 달래고, 성을 고치고 군사를 기르셔야 합니다.\"",
            "시백은 그 말을 그대로 조정에 올렸습니다. 벼슬아치들이 비웃었습니다.<br>\"아녀자의 말을 어찌 나랏일에 올리시오.\"<br>\"오랑캐가 감히 쳐들어오겠소.\"",
            "임금도 귀담아듣지 않았습니다. 시백은 물러 나와 아내에게 그 말을 전했습니다. 박씨는 고개만 끄덕였습니다.<br>\"들을 사람이 없으면 저희라도 준비해야지요.\"",
            "그 뒤로도 시백은 세 번 더 글을 올렸습니다. 세 번 다 돌아오지 않았습니다. 어떤 벼슬아치는 시백이 집안에서 아내에게 눌려 산다고 놀렸습니다. 시백은 그 말에 화를 내지 않았습니다.<br>\"눌려 사는 것이 아니라 배우며 삽니다.\"",
            "박씨는 피화당 둘레에 나무를 더 심었습니다. 동서남북으로 자리를 잡아 심고, 계화에게 나무마다 이름을 외우게 했습니다. 시백은 뜻을 몰랐지만 묻지 않았습니다.",
            "그해 가을, 한양에 낯선 여인이 들어왔습니다. 미인이었고 노래와 춤이 뛰어났습니다. 벼슬아치들의 잔치마다 불려 다녔습니다. 기홍대라는 여인이었습니다.",
            "박씨가 그 이름을 듣고 시백을 불렀습니다.<br>\"그 여인은 청나라에서 보낸 자객<span class=\"gloss\">(몰래 사람을 해치러 온 사람)</span>입니다. 나라의 인재를 미리 없애러 왔습니다. 오늘 밤 우리 집에 올 것입니다.\"",
            "\"어찌 아시오.\"<br>\"별이 그렇게 말합니다. 그리고 청나라가 먼저 없애고 싶은 사람이 누구겠습니까. 임금께 청나라를 막으라 아뢴 사람이지요.\"",
            "시백의 얼굴이 하얘졌습니다. 박씨는 차분했습니다.<br>\"서방님은 오늘 밤 사랑에 계시지 마십시오. 손님은 제가 맞겠습니다.\"",
            "밤이 되자 정말로 기홍대가 찾아왔습니다. 비단옷을 입고 거문고를 안고 있었습니다.<br>\"이 댁 어른께서 글을 잘하신다기에 한 곡 들려 드리러 왔습니다.\"",
            "계화가 여인을 피화당으로 안내했습니다. 박씨가 방 안에 앉아 있었습니다. 기홍대는 방에 들어서다 잠깐 멈칫했습니다. 여인의 눈빛이 예사롭지 않았기 때문입니다.",
            "기홍대가 거문고를 탔습니다. 소리가 맑고 슬펐습니다. 계화는 문밖에서 그 소리에 홀려 하마터면 졸 뻔했습니다. 박씨는 눈을 감고 끝까지 들었습니다.<br>\"솜씨가 좋습니다. 그런데 곡이 북쪽 곡이군요.\"<br>기홍대의 손이 잠깐 멈추었습니다.",
            "\"먼 길 오셨습니다. 술 한 잔 드시지요.\"<br>계화가 술상을 들고 들어갔습니다. 박씨가 손수 술을 따랐습니다. 기홍대는 사양하다가 한 잔을 받았습니다.",
            "한 잔이 두 잔이 되고 석 잔이 되었습니다. 박씨는 마시지 않고 따르기만 했습니다. 기홍대의 눈이 점점 감겼습니다. 거문고 위로 고개가 떨어졌습니다.",
            "박씨가 기홍대의 소매를 뒤졌습니다. 소매 속에서 날이 시퍼런 단검이 나왔습니다. 박씨는 그것을 상 위에 올려놓고 기홍대가 깨기를 기다렸습니다.",
            "새벽에 기홍대가 눈을 떴습니다. 눈앞에 제 단검이 놓여 있었고, 그 앞에 박씨가 그대로 앉아 있었습니다. 기홍대의 얼굴이 흙빛이 되었습니다.",
            "\"네가 누구인지, 무엇 하러 왔는지 다 안다. 돌아가서 너를 보낸 이에게 전하여라. 조선에도 사람이 있다고.\"",
            "박씨는 단검을 기홍대에게 도로 쥐여 주고 문을 열어 주었습니다. 기홍대는 뒤도 돌아보지 않고 달아났습니다. 그 뒤로 한양에서 그 여인을 본 사람은 없었습니다.",
            "이튿날 시백이 물었습니다.<br>\"어찌 살려 보냈소.\"<br>\"칼을 든 사람 하나를 없앤다고 전쟁이 안 오는 것은 아닙니다. 대신 저쪽이 알게 되었지요. 이 집은 만만치 않다는 것을.\""
        ]
    },
    {
        num: 5,
        emoji: "🌲",
        title: "병자호란",
        art: ["story-05-a.webp", "story-05-b.webp", "story-05-c.webp"],
        artAt: ["임금은 남한산성으로 피란을 갔습니다", "나무들이 일제히 흔들렸습니다", "용골대가 이를 갈았습니다"],
        paras: [
            "그해 겨울, 박씨가 말한 대로 되었습니다. 청나라 군사 십만이 압록강을 건넜습니다. 말발굽이 얼어붙은 강을 울렸습니다. 이 싸움을 병자호란<span class=\"gloss\">(병자년에 청나라가 쳐들어온 싸움)</span>이라 합니다.",
            "청나라 군사는 무섭게 빨랐습니다. 열흘도 안 되어 한양 코앞까지 왔습니다. 조정은 그제야 허둥댔습니다. 성을 고칠 틈도 군사를 모을 틈도 없었습니다.",
            "임금은 남한산성으로 피란을 갔습니다. 눈 덮인 산길을 급히 오르느라 신하들이 넘어지고 말이 미끄러졌습니다. 한양은 텅 비었습니다.",
            "한양 사람들은 보따리를 이고 남으로 남으로 달아났습니다. 길에는 버린 세간이 널렸고 아이 우는 소리가 끊이지 않았습니다. 이 상공 댁 문 앞으로도 피란 행렬이 지나갔습니다.",
            "박씨는 피란을 가지 않았습니다. 집안 식구와 이웃 사람들을 피화당으로 불러 모았습니다.<br>\"이 집 안에만 계시면 됩니다. 담 밖으로 한 발짝도 나가지 마십시오.\"<br>수십 명이 그 작은 집 둘레에 모여 앉았습니다.",
            "청나라 군사를 이끄는 장수는 용골대와 용울대 형제였습니다. 용골대가 형이고 용울대가 아우였습니다. 둘 다 키가 크고 힘이 세기로 청나라에서 으뜸이었습니다.",
            "용울대가 군사 오백을 이끌고 한양을 뒤졌습니다. 텅 빈 집들 사이에서 유독 사람이 모여 있는 집이 눈에 띄었습니다. 뒤뜰에 나무가 빽빽한 집이었습니다.",
            "그 전날 밤 박씨가 계화를 불러 칼 한 자루를 주었습니다.<br>\"내일 손님이 온다. 무서우면 방에 있어도 된다.\"<br>계화가 칼을 받아 안았습니다.<br>\"마님이 뜰에 계시면 저도 뜰에 있겠습니다.\"",
            "\"저 집에 사람이 있다. 다 끌어내라.\"<br>군사들이 담을 넘었습니다. 그 순간 박씨가 뜰에 서서 손을 들었습니다.",
            "나무들이 일제히 흔들렸습니다. 바람 한 점 없는데 가지가 휘고 잎이 쏟아졌습니다. 그러더니 나무 하나하나가 갑옷 입은 군사로 변했습니다. 동쪽 나무는 푸른 군사, 서쪽 나무는 흰 군사, 남쪽은 붉은 군사, 북쪽은 검은 군사였습니다.",
            "청나라 군사들이 비명을 지르며 달아났습니다. 담을 넘던 자는 담에서 떨어지고 문을 부수던 자는 문에 깔렸습니다. 용울대만 홀로 남아 칼을 뽑았습니다.",
            "\"요사스러운 계집이 무슨 수작이냐!\"<br>용울대가 박씨를 향해 달려들었습니다. 그러자 계화가 앞을 막아섰습니다. 열여덟 살 계화가 마님이 준 칼 한 자루를 들고 있었습니다.",
            "\"마님 앞에는 못 갑니다.\"<br>용울대가 비웃으며 칼을 휘둘렀습니다. 그런데 칼이 계화에게 닿지 않았습니다. 나무 군사들이 사방에서 용울대를 에워쌌습니다.",
            "용울대는 있는 힘을 다해 싸웠지만 나무 군사는 베어도 베어도 다시 일어섰습니다. 마침내 용울대가 무릎을 꿇고 쓰러졌습니다. 그 큰 몸이 뜰 한복판에 길게 누웠습니다.",
            "소식을 들은 용골대가 군사 삼천을 이끌고 달려왔습니다. 아우가 쓰러진 것을 보고 용골대가 이를 갈았습니다.<br>\"저 집을 흙더미로 만들어라!\"",
            "군사 삼천이 피화당을 에워쌌습니다. 화살이 비 오듯 날았습니다. 그러나 화살은 나무에 닿기 전에 힘을 잃고 떨어졌습니다. 불을 놓아도 나무는 타지 않았습니다.",
            "박씨가 뜰 한가운데 서서 용골대를 불렀습니다.<br>\"장군, 아우의 시신을 거두어 가시오. 더 다치지 마시오.\"",
            "용골대는 그 말에 더 노했습니다.<br>\"조선 임금도 내 앞에 무릎을 꿇었다. 한낱 아녀자가 감히!\"<br>그러고는 몸소 말을 몰아 담을 뛰어넘었습니다.",
            "담 안에 들어선 순간 말이 우뚝 섰습니다. 사방이 안개였습니다. 앞도 뒤도 보이지 않았습니다. 용골대가 아무리 말을 몰아도 제자리였습니다. 밖에서는 군사들이 장군의 이름만 불렀습니다.",
            "안개 속에서 박씨의 목소리가 들렸습니다.<br>\"장군은 지금 제 뜰 안에 계십니다. 나가는 길은 제가 열어야 열립니다.\"",
            "용골대는 밤새 안개 속을 헤맸습니다. 새벽이 되어 지쳐 말에서 내렸을 때, 눈앞에 박씨가 서 있었습니다. 용골대는 처음으로 두려움을 느꼈습니다. 이 여인은 죽일 수도 이길 수도 없는 사람이었습니다."
        ]
    },
    {
        num: 6,
        emoji: "🌊",
        title: "충렬부인",
        art: ["story-06-a.webp", "story-06-b.webp", "story-06-c.webp"],
        artAt: ["끌려가던 사람들이 줄지어 서 있었습니다", "용골대가 말에서 내려 절을 했습니다", "충렬부인이라는 이름을 내렸습니다"],
        paras: [
            "그 무렵 남한산성에서는 임금이 성문을 열었습니다. 청나라 군사에게 둘러싸인 채 마흔여섯 날을 버텼지만 먹을 것이 떨어졌습니다. 조선 임금은 청나라 임금 앞에 나아가 세 번 무릎을 꿇고 아홉 번 머리를 조아리는 굴욕을 당해야 했습니다. 조선이 진 것입니다.",
            "청나라는 군사를 거두어 돌아가기로 했습니다. 그러면서 조선 사람 수만 명을 끌고 가려 했습니다. 왕비와 세자, 벼슬아치의 부인들, 백성들이 밧줄에 묶였습니다.",
            "박씨가 그 소식을 들었습니다.<br>\"사람은 못 데려갑니다.\"<br>박씨는 계화를 데리고 청나라 군사가 모인 강가로 갔습니다.",
            "강가에는 끌려가던 사람들이 줄지어 서 있었습니다. 울음소리가 강을 덮었습니다. 청나라 군사들이 채찍을 들고 줄을 세우고 있었습니다.",
            "줄 가운데 어린아이 하나가 어머니 치마를 붙들고 울고 있었습니다. 군사가 아이를 떼어 놓으려 하자 어머니가 아이를 안고 주저앉았습니다. 박씨가 그 모습을 오래 보았습니다.",
            "박씨가 줄 앞으로 걸어 나갔습니다. 군사들이 막으려다 얼굴을 보고 물러섰습니다. 안개 속에서 장군을 가둔 여인이라는 소문이 벌써 퍼져 있었습니다.",
            "용골대가 말을 타고 나왔습니다. 안개에서 풀려난 뒤 처음 보는 얼굴이었습니다.<br>\"또 그대인가.\"<br>\"이 사람들을 두고 가십시오.\"",
            "\"이것은 우리 임금의 명이다. 그대가 아무리 재주가 있어도 나라와 나라의 일이다.\"<br>\"그러면 저도 저의 일을 하겠습니다.\"",
            "박씨가 소매에서 부채를 꺼내 한 번 부쳤습니다. 그러자 강물이 얼어붙었습니다. 한겨울인데도 흐르던 강이 그 자리에서 멈추었습니다. 배가 얼음에 갇혔습니다.",
            "두 번 부치자 하늘에서 우박이 쏟아졌습니다. 주먹만 한 우박이 청나라 군사들 머리 위로만 떨어졌습니다. 묶인 사람들 위로는 한 알도 떨어지지 않았습니다.",
            "세 번째 부채를 들자 용골대가 소리쳤습니다.<br>\"그만! 그만하시오!\"",
            "용골대가 말에서 내려 절을 했습니다. 청나라 으뜸가는 장수가 조선 여인 앞에 머리를 숙인 것입니다. 군사들이 놀라 무기를 떨어뜨렸습니다.",
            "\"사람은 두고 가겠소. 다만 우리 임금께 돌아가 무어라 아뢰어야 하오.\"<br>\"조선에 박씨라는 여인이 있어 막았다고 하십시오. 그러면 다시는 이 땅에 사람을 끌어가려 하지 않을 것입니다.\"",
            "밧줄이 풀렸습니다. 왕비와 세자가 풀려나고 백성들이 풀려났습니다. 강가에 있던 사람들이 박씨를 향해 엎드렸습니다. 박씨는 그들을 일으켜 세우고 계화와 함께 돌아섰습니다.",
            "아까 울던 아이가 어머니 손을 잡고 박씨 뒤를 따라왔습니다. 박씨가 돌아보자 아이가 물었습니다.<br>\"아주머니는 누구세요.\"<br>\"뒤뜰에 사는 사람이란다.\"<br>박씨는 아이의 머리를 한 번 쓰다듬고 걸음을 옮겼습니다.",
            "청나라 군사가 압록강을 넘어 돌아간 뒤, 임금이 한양으로 돌아왔습니다. 임금은 박씨를 대궐로 불렀습니다. 임금은 여인 앞에서 한참 동안 말을 잇지 못했습니다.",
            "\"내가 그대의 말을 진작 들었더라면 이 나라가 이 꼴이 되지 않았을 것이오.\"<br>박씨가 고개를 숙였습니다.<br>\"지난 일입니다. 다음이 있습니다.\"",
            "임금은 박씨에게 충렬부인이라는 이름을 내렸습니다. 나라에 충성하고 뜻이 굳센 부인이라는 뜻이었습니다. 여인에게 그런 이름을 내린 것은 처음이었습니다. 시백에게도 큰 벼슬을 내렸습니다.",
            "시백이 아내에게 말했습니다.<br>\"이 벼슬은 내 것이 아니오. 그대의 것이오.\"<br>박씨가 웃었습니다.<br>\"벼슬은 서방님이 하십시오. 저는 피화당이 좋습니다.\"",
            "박씨는 그 뒤로도 피화당에서 살았습니다. 나무 군사들은 다시 나무로 돌아갔습니다. 계화는 나이가 들어서도 마님 곁을 떠나지 않았습니다.",
            "이 상공은 늙어서 손주들을 무릎에 앉히고 이렇게 말하곤 했습니다.<br>\"너희 할머니를 처음 보던 날, 온 집안이 울었단다. 그때 나만 웃었지.\"<br>손주들은 그 이야기를 몇 번이고 듣고 싶어 했습니다."
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
    emoji: '🌳',
    title: '박씨전',
    intro: [
        "박씨전은 지은이가 알려지지 않은 조선 후기 소설이에요. 병자호란이라는 진짜 있었던 싸움을 바탕으로 지었지만, 이야기의 주인공은 역사에 없는 사람이랍니다.",
        "얼굴이 몹시 못생겼다고 남편에게 버림받은 여인 박씨가 주인공이에요. 조선 소설에서 여자가 이야기 한가운데에 서는 일은 아주 드물지요.",
        "실제 병자호란에서 조선은 졌어요. 그 싸움이 닥쳤을 때 뒤뜰에 숨어 살던 박씨는 무엇을 할까요?",
        "박씨가 사는 뒤뜰 집 피화당, 몸종 계화, 청나라 장수 용골대는 시험에 자주 나오는 이름이랍니다."
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
    { q: "박 처사는 어디에서 온 사람입니까?", choices: ["금강산", "한양", "청나라"], answer: 0 },
    { q: "시백이 혼인 첫날 밤 등을 돌리고 앉은 까닭은 무엇입니까?", choices: ["신부가 말을 하지 않아서", "신부의 얼굴이 몹시 못생겨서", "신부가 먼저 잠들어서"], answer: 1 },
    { q: "집안에서 유일하게 며느리의 재주를 알아본 사람은 누구입니까?", choices: ["시어머니", "남편 시백", "시아버지"], answer: 2 },
    { q: "박씨가 뒤뜰에 지은 집의 이름은 무엇입니까?", choices: ["피화당", "낙산당", "금강당"], answer: 0 },
    { q: "박씨 곁을 끝까지 지킨 몸종의 이름은 무엇입니까?", choices: ["기홍대", "계화", "춘섬"], answer: 1 },
    { q: "박씨는 삼백 냥에 산 비루먹은 말을 어떻게 했습니까?", choices: ["한 해를 길러 비싸게 팔았다", "시아버지께 선물로 드렸다", "곧바로 되팔아 손해를 보았다"], answer: 0 },
    { q: "삼 년이 차던 날 박씨에게 일어난 일은 무엇입니까?", choices: ["아버지를 따라 산속으로 떠났다", "허물을 벗고 고운 얼굴이 되었다", "시백과 갈라서서 친정으로 갔다"], answer: 1 },
    { q: "박씨가 조정에 먼저 알린 것은 무엇입니까?", choices: ["명나라가 망한다는 것", "청나라가 쳐들어온다는 것", "큰 흉년이 든다는 것"], answer: 1 },
    { q: "기홍대는 어떤 사람이었습니까?", choices: ["청나라에서 보낸 자객", "박 처사의 다른 딸", "한양의 이름난 의원"], answer: 0 },
    { q: "피화당에 들어온 용울대는 어떻게 되었습니까?", choices: ["박씨를 사로잡아 청나라로 갔다", "나무 군사에 둘러싸여 쓰러졌다", "불을 놓고 군사와 함께 달아났다"], answer: 1 },
    { q: "박씨가 강가에서 용골대에게 지켜 낸 것은 무엇입니까?", choices: ["나라의 곳간", "끌려가던 사람들", "남한산성"], answer: 1 },
    { q: "임금이 박씨에게 내린 이름은 무엇입니까?", choices: ["충렬부인", "정경부인", "효열부인"], answer: 0 },
    {
        q: "이 책을 읽고 난 반응으로 알맞지 않은 것은 무엇인가요?",
        wide: true,
        choices: [
            "이 상공만 며느리를 알아본 것을 보면, 사람을 보는 눈은 얼굴이 아니라 말씨와 걸음에 있구나.",
            "박씨가 껍질이 벗겨졌다고 제가 달라진 것은 아니라고 한 것을 보면, 시백이 뒤늦게 사랑한 것이 무엇인지 묻는 말이었어.",
            "조정이 아녀자의 말이라며 웃어넘긴 것을 보면, 나라가 진 까닭이 청나라 군사 수만은 아니었네.",
            "박씨가 임금의 벼슬을 받아 조정에 나간 것을 보면, 끝내 피화당보다 대궐을 골랐나 봐."
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
    emoji: '🌳',
    art: ['end.webp'],
    paras: [
        `이 이야기는 지은이가 없습니다. 조선 후기에 한글로 적혀 널리 읽혔고, 남아 있는 책만 수십 가지입니다. 박씨부인전이라고도 합니다.`,
        `바탕이 된 것은 병자호란입니다. 병자년, 그러니까 천육백삼십육 년 겨울에 청나라가 쳐들어와 이듬해 정월에 조선 임금이 남한산성에서 나와 항복한 싸움입니다. 이것은 지어낸 것이 아니라 실제로 있었던 일입니다.`,
        `그런데 그 뒤가 다릅니다. 실제로는 세자와 세자빈을 비롯한 수만 명이 청나라로 끌려갔습니다. 소설에서는 박씨가 강가에서 그들을 지켜 냅니다. 실제로는 진 싸움을 소설에서는 한 여인이 되돌려 놓은 것입니다.`,
        `왜 그렇게 썼을까요. 병자호란은 조선 사람들에게 너무 부끄러운 일이었습니다. 그 부끄러움을 견디려고 사람들은 이야기 속에서라도 이기고 싶어 했습니다. 임진왜란 뒤에 임경업전이 나온 것과 같은 까닭입니다.`,
        `그런데 이기는 사람이 남자 장수가 아니라 여자입니다. 그것도 못생겼다고 남편에게 버림받은 여자입니다. 조정의 벼슬아치들은 청나라를 얕보다 나라를 망쳤고, 아녀자의 말이라고 비웃었던 그 여인이 나라를 건집니다. 이야기가 누구를 겨누는지 분명합니다.`,
        `박씨가 못생긴 얼굴로 삼 년을 보내는 대목을 다시 보십시오. 그 삼 년 동안 박씨는 조복을 짓고 말을 기르고 연적을 보냅니다. 재주는 처음부터 있었습니다. 달라진 것은 박씨가 아니라 박씨를 보는 사람들의 눈입니다.`,
        `허물을 벗는 이야기는 우리 옛이야기에 여럿 있습니다. 구렁덩덩 신선비가 그렇고 우렁이 색시가 그렇습니다. 다만 박씨전은 허물을 벗은 뒤에 이야기가 끝나지 않습니다. 거기서부터 진짜 이야기가 시작됩니다.`,
        `피화당은 화를 피하는 집이라는 뜻입니다. 박씨는 집안에서 밀려나 뒤뜰로 갔는데, 나중에는 온 집안이 그 뒤뜰로 피해 들어옵니다. 밀려난 자리가 모두를 살리는 자리가 된 것입니다.`,
        `계화도 눈여겨볼 사람입니다. 열다섯에 피화당에 들어와 마님 곁을 떠나지 않습니다. 용울대 앞을 막아선 것도 계화입니다. 이 이야기에서 무기를 들고 나선 사람은 남자가 아니라 이 몸종입니다.`,
        `용골대는 지어낸 사람이 아닙니다. 실제로 병자호란 때 청나라 군사를 이끈 장수 가운데 그 이름이 있습니다. 소설은 진짜 있던 사람을 데려다 진짜 있던 싸움에서 지게 만든 것입니다.`,
        `그래서 이 책을 읽을 때는 두 가지를 같이 보아야 합니다. 이야기 속에서 박씨가 무엇을 했는지, 그리고 실제 역사에서는 무슨 일이 있었는지. 둘 사이의 거리가 이 소설이 하고 싶었던 말입니다.`,
        `박씨가 마지막에 벼슬을 마다하고 피화당에 남은 것도 그렇습니다. 이겼다고 자리를 차지하지 않습니다. 처음부터 자리를 바란 사람이 아니었기 때문입니다.`,
        `시백은 삼 년 동안 아내의 얼굴을 보지 않았습니다. 허물이 벗겨진 뒤에야 무릎을 꿇었지요. 시백이 뉘우친 것은 진심이었을까요, 아니면 고운 얼굴 앞에서만 나온 말이었을까요. 박씨가 그에게 껍질이 벗겨졌다고 달라진 것은 아니라고 한 까닭을 생각해 보십시오.`,
        `실제로는 진 싸움을 소설에서 이기게 쓰는 것은 옳은 일일까요? 부끄러운 역사를 이야기로 되돌려 놓으면 위로가 되지만, 진 까닭을 잊게 만들 수도 있습니다. 여러분 생각은 어떻습니까.`,
        `조정 벼슬아치들은 박씨의 말을 아녀자의 말이라며 듣지 않았습니다. 지금 우리 곁에도 누구의 말이라는 까닭으로 듣지 않는 말이 있는지 돌아보십시오.`
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
