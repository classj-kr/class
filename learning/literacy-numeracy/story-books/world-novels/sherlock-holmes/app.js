const BOOK_TITLE = "명탐정 셜록 홈스";

// 한 편으로 이어지는 소설이 아니라 머리글 하나에 사건 일곱 편을 묶은 책이라, 제목 앞에 "N장"을 붙이지 않는다.
const CHAPTER_LABEL = () => '';

const CHAPTERS = [
    {
        num: 1,
        title: "베이커가 221B",
        emoji: "🔍",
        art: ["story-01-a.webp", "story-01-b.webp"],
        paras: [
            `내 이름은 존 왓슨입니다. 군의관<span class="gloss">(군대의 의사)</span>으로 아프가니스탄에 나갔다가 어깨에 총을 맞고 영국으로 돌아왔습니다. 몸은 상했고 아는 사람은 없었으며, 하루에 쓸 수 있는 돈은 정해져 있었습니다. 런던의 하숙비는 그 돈으로 감당이 되지 않았습니다. 그 무렵 영국은 아프가니스탄에서 싸우고 있었습니다. 다친 군인이 배로 실려 돌아왔습니다.`,
            `1881년 어느 날, 나는 옛 동료 스탬퍼드를 우연히 만났습니다. 거리에서 어깨를 부딪친 것이 인연이었습니다. 런던은 그때 사람이 사백만 명이 넘는 도시였습니다. 세상에서 제일 큰 도시였습니다. 함께 방을 쓸 사람을 찾고 있다고 했더니 그가 말했습니다.<br>"오늘 아침에도 같은 말을 한 사람이 있었습니다. 다만 그 사람과 함께 지내려면 각오를 좀 해야 할 겁니다."<br>"어떤 사람인데요?"<br>"나쁜 사람은 아닙니다. 다만 좀……. 직접 보시는 게 낫겠습니다."<br>스탬퍼드는 그 사람과 같은 병원에서 일한 적이 있었습니다.`,
            `스탬퍼드는 나를 병원 실험실로 데려갔습니다. 약 냄새가 코를 찔렀습니다. 긴 탁자 앞에 키가 크고 몹시 마른 사람이 등을 구부리고 있었습니다. 시험관과 병이 탁자에 가득했습니다. 그 시절 병원 실험실은 아무나 들어갈 수 있었습니다. 그래서 그 사람이 거기서 지냈습니다. 그는 우리를 보자마자 시험관을 들고 벌떡 일어났습니다.`,
            `"찾았습니다! 핏자국을 알아내는 방법을 찾았어요!" 그는 내 손을 덥석 잡았습니다. 손가락에 잉크와 약품 자국이 가득했습니다. 핏자국을 가려내는 방법은 그때까지 없었습니다. 그래서 재판에서 다투는 일이 많았습니다. <br>"아프가니스탄에 계셨군요."`,
            `나는 놀라서 그를 쳐다보았습니다.<br>"어떻게 아셨습니까?"<br>"아무것도 아닙니다. 볕에 탄 얼굴에 손목만 하얗다는 것, 왼팔을 조심스럽게 쓴다는 것." 그는 웃었습니다.`,
            `그 사람이 셜록 홈스였습니다. 그때 그는 스물일곱쯤이었습니다. 우리는 그 주에 베이커가 221B의 방 두 개짜리 하숙집으로 함께 옮겼습니다. 창이 크고 볕이 잘 드는 방이었습니다. 집주인은 허드슨 부인이라는 사람이었습니다. 베이커가는 런던 서쪽의 조용한 거리였습니다.`,
            `며칠 지내고 보니 그는 정말로 이상한 사람이었습니다. 함께 사는 사람이 아니면 모를 일들이었습니다. 어떤 날은 새벽까지 실험을 했고, 어떤 날은 소파에 누워 한마디도 하지 않았습니다. 그런 날은 사흘씩 이어지기도 했습니다. 밥도 잘 먹지 않았습니다. 바이올린을 켰는데, 곡을 켤 때는 훌륭했지만 대개는 줄을 아무렇게나 긁었습니다. 생각을 할 때 그렇게 한다고 했습니다.`,
            `아는 것도 이상했습니다. 그는 런던 흙의 종류를 색만 보고 구별했고, 담뱃재 백사십 종을 알아보았으며, 옛 범죄 사건이라면 무엇이든 외우고 있었습니다. 신문에 난 사건은 열 해 전 것도 날짜까지 기억했습니다. 신문을 오려 붙인 공책이 여러 권 있었습니다. 그것을 죽 늘어놓고 찾아보았습니다. 그런데 지구가 태양을 돈다는 것은 몰랐습니다. 나는 그 말을 듣고 한참 아무 말도 하지 못했습니다. 학교에 다닌 아이도 아는 것이었습니다.`,
            `"그게 나에게 무슨 소용입니까." 내가 알려 주자 그는 오히려 짜증을 냈습니다.<br>"사람의 머리는 다락방 같은 것입니다. 넣을 수 있는 양이 정해져 있어요. 쓸데없는 것을 넣으면 쓸 것이 밀려납니다."<br>그 말이 맞는 말인지는 알 수 없습니다. 다만 그 사람은 그렇게 믿고 살았습니다.`,
            `그의 방에는 온갖 사람이 찾아왔습니다. 어떤 날은 잘 차려입은 신사가, 어떤 날은 옷이 다 해진 노인이, 어떤 날은 경찰이 왔습니다. 오는 시각도 제각각이었습니다. 새벽에 초인종이 울리는 날도 있었습니다. 그때마다 그는 나에게 잠깐 자리를 비켜 달라고 했습니다. 나는 그때마다 내 방으로 물러났습니다. 무슨 이야기를 하는지 들리지 않았습니다.`,
            `참다못해 나는 물었습니다.<br>"대체 무슨 일을 하십니까?"<br>그가 말했습니다.<br>"세상에 하나뿐인 직업입니다."<br>그 사람이 그 직업을 스스로 만든 것이었습니다.<br>"나는 자문 탐정입니다. 런던에는 관청의 탐정도 있고 개인 탐정도 많지요. 그 사람들이 막히면 나를 찾아옵니다. 나는 사건을 듣고 답을 알려 줍니다. 대개는 이 의자에서 일어나지도 않고요."`,
            `나는 웃음이 나오려는 것을 참았습니다. 그런 말을 하는 사람을 그때까지 본 적이 없었습니다. 그러니 허풍으로 들렸습니다. 그가 창밖을 내다보며 말했습니다.<br>"저기 길 건너로 걸어오는 사람이 보이십니까? 봉투를 들고 있는 사람 말입니다."<br>"보입니다."<br>"저 사람은 퇴역<span class="gloss">(군대에서 물러남)</span>한 해병 하사입니다."`,
            `나는 속으로 허풍이라고 생각했습니다. 잠시 뒤 그 사람이 우리 집 초인종을 눌렀고, 나는 그에게 직접 물었습니다. 봉투를 전하러 온 사람이었습니다. 손등에 파란 문신이 있었고, 턱을 든 채 발을 맞추듯 걸었습니다. 길 건너에서 여기까지 오는 데 삼 분쯤 걸렸습니다. 그동안 나는 창밖을 보고 있었습니다. <br>"실례지만 전에 무슨 일을 하셨습니까?"<br>"해병에 있었습니다, 선생님. 하사로 제대했습니다."`,
            `내가 돌아보자 홈스는 이미 다른 곳을 보고 있었습니다.<br>그가 말했습니다.<br>"손등의 문신과 걸음걸이, 그리고 턱을 든 각도입니다."<br>해군 문신은 그 시절 뱃사람들이 다 했습니다. 그리고 문양이 부대마다 달랐습니다.<br>"보는 것과 관찰하는 것은 다릅니다, 왓슨. 당신은 날마다 이 계단을 오르내리지만, 계단이 몇 개인지는 모르시지요."`,
            `나는 대답하지 못했습니다. 열일곱 개였습니다. 열일곱 해를 오르내려도 셀 생각을 안 하는 사람이 있습니다. 그날 나는 계단을 내려가면서 하나씩 세어 보았습니다. 그때부터 나는 그의 사건을 기록하기 시작했습니다. 공책을 한 권 사서 날짜부터 적었습니다. 여기 적은 이야기는 그중 몇 가지입니다. 고르는 데도 한참이 걸렸습니다. 그 사람이 맡은 사건이 수백 건이었습니다.`
        ]
    },
    {
        num: 2,
        title: "보헤미아 왕국의 사진",
        emoji: "🎭",
        art: ["story-02-a.webp", "story-02-b.webp"],
        paras: [
            `1888년 3월, 나는 오랜만에 베이커가에 들렀습니다. 나는 그 사이에 결혼해서 따로 살고 있었습니다. 홈스는 편지 한 장을 나에게 내밀었습니다. 봉투가 아주 두꺼웠습니다. 날짜도 이름도 없었습니다. 편지에 이름이 없다는 것부터 이상한 일이었습니다. 그것을 숨겨야 할 사람이라는 뜻이었습니다. <br>"오늘 밤 여덟 시 십오 분에 찾아가겠소. 가면을 쓰고 있더라도 놀라지 마시오."<br>내가 물었습니다.<br>"여기서 뭘 알 수 있겠습니까?"<br>"종이가 두껍고 값이 비쌉니다. 종이에는 만든 데의 표시가 들어 있습니다. 불에 비추면 그것이 보입니다. 불빛에 비추면 글자가 보이지요. 보헤미아에서 만든 종이입니다. 그리고 이 문장을 쓴 사람은 독일 사람입니다. 영어를 잘하지만 독일식으로 말을 놓았거든요."<br>보헤미아는 지금의 체코 서쪽에 있던 나라입니다. 그 무렵 독일 말을 쓰는 사람이 많았습니다.`,
            `여덟 시 십오 분, 마차 소리가 멈추고 아주 키가 큰 사람이 들어왔습니다. 말 두 마리가 끄는 마차였습니다. 그런 마차는 그 거리에 잘 오지 않았습니다. 얼굴 위쪽을 검은 가면으로 가리고 있었습니다. 키가 이 미터 가까이 되었습니다. 문을 지날 때 몸을 숙여야 했습니다. <br>"나는 폰 크람 백작이라고 하오. 보헤미아 왕실의 일로 왔소."<br>홈스가 조용히 말했습니다.<br>"전하. 가면을 벗으셔도 좋습니다. 저는 보헤미아의 왕과 이야기하고 있는 편이 일하기 편합니다."<br>편지지와 말투와 키로 알아낸 것이었습니다. 그런데 그것을 그 자리에서 말했습니다.`,
            `사내는 잠깐 굳어 있다가 가면을 벗어 던졌습니다. 들키고 나면 감출 까닭이 없어집니다. 그것도 홈스가 셈한 것이었습니다.`,
            `왕이 말했습니다.<br>"다섯 해 전 나는 바르샤바에 있었소."<br>바르샤바는 지금의 폴란드 수도입니다. 그 무렵 유럽의 왕족들이 서로 오가던 도시였습니다.<br>"그때 아이린 애들러라는 여자를 알게 되었소. 오페라 가수였지요."<br>그 시절 오페라 가수는 이름이 널리 알려진 사람들이었습니다. 나라를 옮겨 다니며 무대에 섰습니다.<br>"나와 함께 찍은 사진이 한 장 있소."<br>그 시절 사진은 아주 드문 것이었습니다. 한 장을 찍으려면 오래 앉아 있어야 했습니다.<br>"그 사진이 그 여자에게 있소."<br>"돌려 달라고 하셨습니까?"<br>"다섯 번 사람을 보냈소. 집을 두 번 뒤졌고, 여행 가방을 가로챘고, 길에서 두 번 몸을 뒤졌소. 아무 데도 없었소."<br>그러니 감춘 자리가 남달랐다는 뜻이었습니다.`,
            `왕은 사흘 뒤 다른 나라 공주와 약혼할 예정이었습니다. 왕실끼리 하는 혼인은 나라 사이의 약속이기도 했습니다. 그 사진이 공개되면 혼담은 깨집니다. 아이린 애들러는 약혼 발표 날 사진을 보내겠다고 했습니다. 그러니 사진 한 장에 그것이 걸려 있었습니다.`,
            `이튿날 아침, 술 취한 마부 차림의 사내가 방으로 들어왔습니다. 나는 하마터면 소리를 지를 뻔했습니다. 옷차림만 바꾼 것이 아니었습니다. 홈스였습니다.`,
            `그가 웃으며 말했습니다.<br>"그 집 마구간에서 반나절을 보냈습니다. 마부 차림을 하면 마부들이 말을 걸어 줍니다. 신사 차림으로 가면 아무도 말하지 않습니다. 마부들에게 담배를 나눠 주고 이야기를 들었지요. 마부는 그 집 사람이 어디로 가는지 다 압니다. 그러니 그 사람들에게 물어보면 됩니다. 그리고 뜻밖의 일도 하나 보았습니다. 아이린 애들러가 오늘 아침 어떤 변호사와 결혼했습니다. 제가 그 결혼식의 증인이 되었고요."<br>증인이 하나 모자랐던 것이었습니다. 그래서 지나가던 사람을 붙잡은 것입니다.<br>"결혼을요?"<br>"놀랄 일은 아닙니다. 그 결혼이 오히려 다행이었습니다. 그 사진을 쓸 까닭이 없어지기 때문입니다. 그보다 우리는 오늘 저녁 그 사진이 어디 있는지 알아내야 합니다. 왓슨, 도와주시겠습니까? 법을 조금 어기게 될 수도 있습니다."<br>"기꺼이 하겠습니다."<br>남의 집에 들어가는 일이었습니다. 그런데 나는 그것을 묻지 않았습니다.`,
            `그날 저녁 홈스는 이번에는 시골 목사로 변장했습니다. 목사 차림이면 아무도 의심하지 않습니다. 그것이 그 시절 영국이었습니다. 아이린 애들러의 집 앞에서 그는 부랑자<span class="gloss">(집 없이 떠도는 사람)</span>들 사이의 싸움에 휘말린 척하며 얼굴에 붉은 물감을 묻히고 쓰러졌습니다. 사람들이 그를 집 안으로 옮겼습니다. 다친 사람을 길에 두고 갈 수는 없습니다. 그것을 노린 것이었습니다.`,
            `내 몫은 미리 정해져 있었습니다. 나는 골목 건너편에 서 있었습니다. 창이 잘 보이는 자리였습니다. 홈스가 창가에서 손을 들면, 나는 연기가 나는 통을 창으로 던져 넣고 "불이야" 하고 외치는 것이었습니다. 불이 난 것처럼 보이기만 하면 되었습니다.`,
            `신호가 왔습니다. 나는 그대로 했습니다. 집 안에서 비명이 터지고 사람들이 뛰어다녔습니다. 연기만 나고 불은 없었습니다. 그런데 아무도 그것을 확인할 겨를이 없었습니다. 십 분 뒤 홈스가 골목에서 나를 따라잡았습니다. 소란한 틈에 걸어 나온 것이었습니다. 아무도 그것을 눈여겨보지 않았습니다.`,
            `그가 말했습니다.<br>"찾았습니다. 불이 났다고 생각하면 사람은 가장 소중한 것을 먼저 챙깁니다. 생각할 겨를이 없으면 몸이 먼저 움직입니다. 그것이 어디에 있는지를 그대로 알려 줍니다. 그 부인은 곧장 응접실 벽으로 가서 미닫이 판을 열었습니다. 사진은 그 안에 있습니다."<br>어디 있는지 물어서 알아낼 수는 없었습니다. 그러니 스스로 가게 만든 것이었습니다.<br>"지금 가져오지 그러셨습니까?"<br>"마부가 방에 있었습니다. 그 자리에서 가져오면 도둑질이 됩니다. 그리고 보는 사람이 있었습니다. 내일 아침 왕과 함께 가서 정식으로 받으면 됩니다."`,
            `골목을 나설 때 지나가던 젊은 남자가 인사를 했습니다.<br>"안녕히 가세요, 셜록 홈스 씨."<br>우리는 돌아보았지만 그 사람은 이미 사라진 뒤였습니다. 그 목소리가 젊은 남자 목소리였습니다. 그래서 아무도 이상하게 여기지 않았습니다.`,
            `이튿날 아침, 셋이 그 집에 갔을 때 집은 비어 있었습니다. 하녀가 웃으며 말했습니다. 주인 부부는 새벽 다섯 시 십오 분 기차로 영국을 떠났다고요. 밤새 짐을 싼 것이었습니다.`,
            `미닫이 판 안에는 사진 대신 편지 한 통과 다른 사진 한 장이 있었습니다. 아이린 애들러가 혼자 찍은 사진이었습니다. 편지는 왕에게 남긴 것이 아니었습니다. 홈스에게 남긴 것이었습니다.`,
            `편지는 이렇게 시작했습니다. 밤새 쓴 편지였습니다. <br>"셜록 홈스 씨께. 정말 훌륭하게 속으셨습니다. 불이 났다는 소리를 듣기 전까지 저는 아무것도 몰랐습니다. 그러나 창가에서 손을 드시는 것을 보고 그제야 알았지요. 신호를 보내는 사람이 있으면 짜고 하는 일이니까요. 저도 변장에는 자신이 있습니다. 어젯밤 골목에서 인사를 드린 젊은이가 저였습니다. 사진은 제가 가져갑니다. 다만 저를 지키기 위한 것일 뿐, 결코 쓰지 않겠습니다. 저는 저를 사랑하는 사람과 결혼했으니까요."`,
            `왕은 어이없어하면서도 안심했습니다. 사진을 되찾지는 못했습니다. 그런데 쓰지 않겠다는 말을 받았습니다. <br>"저 여자가 남자였다면 참 훌륭한 왕이 되었을 텐데."<br>홈스는 차갑게 대답했습니다.<br>"저 부인은 전하와는 아주 다른 분입니다."<br>왕이 그 말을 알아들었는지는 알 수 없습니다. 홈스는 그 말을 하고 돌아섰습니다.`,
            `왕이 보답으로 반지를 주겠다고 하자 홈스는 사양했습니다. 그는 그 사진 한 장만을 받아 갔습니다.`,
            `그 뒤로 홈스는 아이린 애들러의 이름을 부르지 않았습니다. 그저 "그 여자"라고만 했습니다. 그 사람이 홈스를 이긴 유일한 사람이었습니다. 그것도 한 번이 아니라 두 번이었습니다.`
        ]
    },
    {
        num: 3,
        title: "빨간 머리 연맹",
        emoji: "🟥",
        art: ["story-03-a.webp", "story-03-b.webp"],
        paras: [
            `어느 가을날, 내가 베이커가에 들렀더니 몸집이 크고 얼굴이 붉은 노신사가 앉아 있었습니다. 머리카락이 불붙은 것처럼 새빨갰습니다. 그런 머리 색을 나는 그때까지 본 적이 없었습니다.`,
            `홈스가 말했습니다.<br>"왓슨, 마침 잘 오셨습니다. 윌슨 씨, 처음부터 다시 한번 들려주시겠습니까?"`,
            `윌슨 씨는 신문 조각을 꺼내 놓았습니다.<br>"빨간 머리 연맹. 회원 한 자리가 비었음. 주급 4파운드. 하는 일은 아주 쉬움. 월요일 열한 시, 플리트가 7번지로 올 것."<br>윌슨 씨가 말했습니다.<br>"저는 시내에서 작은 전당포<span class="gloss">(물건을 맡기면 돈을 빌려주는 가게)</span>를 합니다. 손님이 많지 않아 살림이 빠듯하지요. 그런데 두 달쯤 전에 새로 온 점원 스폴딩이 이 광고를 가져왔습니다. 주인님 머리 색이면 뽑힐 거라면서요."<br>"그 점원은 어떤 사람입니까?"<br>"일은 잘합니다. 품삯도 남들 절반만 받겠다고 했고요. 다만 사진에 미쳐서 툭하면 지하실로 내려가 필름을 만집니다."<br>"계속하시지요."<br>"가 보니 빨간 머리가 골목을 가득 메우고 있었습니다. 그런데 저를 보더니 담당자가 제 머리를 손으로 잡아당겨 보고는 바로 뽑겠다고 하더군요."<br>"하는 일은 무엇이었습니까?"<br>"매일 열 시부터 두 시까지 사무실에 앉아 백과사전을 베끼는 것이었습니다. 그동안 자리를 비우면 안 된다는 조건이 붙었지요. 저는 여덟 주 동안 A로 시작하는 낱말을 다 베꼈습니다."<br>"그런데요?"<br>"오늘 아침에 가 보니 문이 잠겨 있고 이런 쪽지가 붙어 있었습니다. 빨간 머리 연맹은 해산되었음."`,
            `홈스는 한참 눈을 감고 있다가 물었습니다. 손끝을 맞대고 앉은 채였습니다. <br>"그 점원 스폴딩은 귀에 구멍이 뚫려 있습니까?"<br>"네, 어릴 때 뚫었다고 하더군요."`,
            `윌슨 씨가 돌아간 뒤 홈스가 말했습니다.<br>"왓슨, 오늘 저녁 시간이 있으십니까? 조금 위험할지도 모릅니다. 권총을 가져오십시오."`,
            `우리는 먼저 전당포에 들렀습니다. 작고 낡은 가게였습니다. 홈스는 길을 묻는 척하며 문을 두드렸고, 젊은 점원이 나왔습니다. 홈스는 인사를 하고 돌아섰습니다. 그러고는 갑자기 지팡이로 가게 앞 보도를 두어 번 두드렸습니다. 소리를 듣고 있었던 것입니다.`,
            `"왓슨, 저 사람의 무릎을 보셨습니까?"<br>"무릎이라니요?"<br>"바지 무릎이 닳아서 반들거렸습니다. 그리고 흙이 묻어 있었지요. 저 사람은 요즘 무릎을 꿇고 무언가를 하고 있습니다. 그것도 아주 오랫동안."`,
            `홈스는 전당포 뒤편 큰길로 돌아 나갔습니다. 전당포 건물의 바로 뒤에 무엇이 있는지 확인한 것입니다. 그곳에는 시티 은행의 지점이 있었습니다. 전당포 지하실과 벽 하나를 사이에 두고 있었습니다.`,
            `홈스가 말했습니다.<br>"이제 알겠습니까? 저 사람들은 윌슨 씨를 여덟 주 동안 하루 네 시간씩 집에서 떼어 놓았습니다. 무엇 때문에? 지하실에서 땅을 파기 위해서입니다. 은행 금고까지. 게다가 귀에 구멍을 뚫은 젊은 점원이라면 짐작 가는 도둑이 하나 있습니다."<br>"오늘 밤이라고 어떻게 확신하십니까?"<br>"연맹이 오늘 해산했기 때문입니다. 굴이 다 뚫렸다는 뜻이지요. 그리고 내일은 토요일입니다. 이틀 동안 아무도 눈치채지 못합니다."`,
            `그날 밤 열 시, 우리는 은행 지하 금고실에 있었습니다. 은행장과 런던 경찰의 존스 형사도 함께였습니다. 등불을 가리고 상자 뒤에 몸을 숨겼습니다. 금고실에는 프랑스에서 들여온 금화 상자가 쌓여 있었습니다.`,
            `한 시간이 지나고 두 시간이 지났습니다. 어둠 속에서는 시간이 아주 느리게 갔습니다. 그때 바닥 돌 틈에서 희미한 빛이 새어 나왔습니다. 돌 하나가 옆으로 밀리더니 사람 손이 올라왔고, 이어서 머리가 나왔습니다. 얼굴에 흙이 묻어 있었습니다.`,
            `아래쪽에 대고 그가 말했습니다.<br>"됐어, 자루를 던져."`,
            `그 순간 홈스가 뛰어나가 그의 목덜미를 잡았습니다. 존스 형사가 손목에 쇠고랑을 채웠습니다. 아래쪽에 있던 한 사람은 반대쪽으로 달아났지만 밖에서 기다리던 경관에게 붙잡혔습니다.`,
            `붙잡힌 사내가 태연하게 말했습니다.<br>"손을 대지 마시오. 그리고 나에게 말할 때는 '님'을 붙이시오. 내 핏줄에는 왕가의 피가 흐르고 있소."<br>존스 형사가 말했습니다.<br>"존 클레이입니다. 도둑이고 위조범<span class="gloss">(가짜 돈이나 서류를 만드는 사람)</span>이지요. 세 해 동안 쫓았는데 얼굴 한 번을 못 봤습니다."`,
            `돌아오는 길에 홈스가 말했습니다.<br>"이 사건은 나를 심심하지 않게 해 주었습니다. 그거면 충분합니다."`
        ]
    },
    {
        num: 4,
        title: "얼룩 끈",
        emoji: "🐍",
        art: ["story-04-a.webp", "story-04-b.webp"],
        paras: [
            `1883년 4월 어느 이른 아침, 홈스가 나를 흔들어 깨웠습니다. 일곱 시가 조금 넘은 시각이었습니다. <br>"손님이 오셨습니다. 몹시 겁에 질린 분입니다."`,
            `응접실에는 검은 옷을 입고 얼굴을 가린 젊은 여자가 앉아 있었습니다. 얼굴을 드러내자 놀랍게도 아직 서른이 되지 않았는데 머리카락이 희끗희끗했습니다. 손도 계속 떨고 있었습니다.`,
            `"저는 헬렌 스토너라고 합니다. 스토크 모런의 로일롯 박사 집에 살고 있습니다. 그분은 제 새아버지입니다."<br>홈스가 말했습니다.<br>"먼저 몸을 좀 녹이시지요. 그런데 손목의 그 자국은 무엇입니까?"`,
            `여자는 얼른 소매를 내렸습니다. 손목에 검푸른 손가락 자국이 다섯 개 나 있었습니다. 며칠 지난 자국이었습니다. <br>"새아버지는……. 힘이 세신 분입니다. 자기 힘을 잘 모르십니다."`,
            `헬렌은 이야기를 시작했습니다. 로일롯 박사는 인도에서 의사로 일하다 하인을 때려 죽음에 이르게 해 감옥살이를 했고, 돌아온 뒤로는 아무와도 어울리지 않고 낡은 저택에 틀어박혀 살았습니다. 인도에서 데려온 표범과 개코원숭이가 마당을 돌아다녔습니다. 마을 사람들은 그 집 앞을 지나가지 않았습니다. 어머니가 남긴 재산은 새아버지가 맡아 쓰고 있었는데, 두 딸이 결혼하면 저마다 몫을 떼어 주어야 했습니다.`,
            `헬렌이 말했습니다.<br>"두 해 전에 언니가 죽었습니다. 언니는 결혼을 앞두고 있었습니다. 죽기 며칠 전부터 언니는 밤마다 낮은 휘파람 소리가 들린다고 했습니다. 그날 밤 저는 언니 방 쪽에서 비명을 들었습니다. 뛰어나가 보니 언니가 문을 붙잡고 서 있다가 쓰러졌습니다. 언니는 '얼룩 끈, 얼룩 끈'이라고 말하고 숨을 거두었습니다. 방은 안에서 잠겨 있었습니다. 창문의 덧문도 걸려 있었고요. 사람이 들어간 흔적은 없었습니다."<br>홈스가 물었습니다.<br>"그런데 왜 지금 오셨습니까?"<br>"저도 결혼을 하게 되었습니다. 그리고 집을 고친다며 제 방을 못 쓰게 해서, 지난주부터 언니가 쓰던 방에서 자고 있습니다."`,
            `헬렌의 목소리가 떨렸습니다.<br>"어젯밤에 그 휘파람 소리를 들었습니다."`,
            `헬렌이 돌아간 직후, 문이 부서질 듯 열리며 거인 같은 사내가 들어왔습니다. 로일롯 박사였습니다.`,
            `"내 딸이 여기 왔었지. 무슨 말을 했나?"<br>홈스가 대답했습니다.<br>"올봄은 춥군요."<br>사내는 벽난로의 쇠 부지깽이를 집어 두 손으로 구부려 버렸습니다.<br>"나에게 참견하지 마라." 그러고는 나가 버렸습니다.`,
            `홈스는 구부러진 부지깽이를 집어 아무렇지 않게 도로 폈습니다.<br>"이만한 힘이면 다행입니다. 힘으로만 덤비는 사람은 다루기 쉽지요."`,
            `그날 오후 우리는 스토크 모런으로 갔습니다. 저택은 절반이 무너져 가고 있었고, 사람이 사는 곳은 한쪽 끝뿐이었습니다. 창유리가 깨진 채로 남아 있는 방도 있었습니다. 홈스는 헬렌이 옮겨 간 방을 살폈습니다. 바닥부터 천장까지 손으로 짚어 가며 살폈습니다. 그리고 세 가지를 찾아냈습니다.`,
            `첫째, 침대 머리맡에 종을 부르는 줄이 늘어져 있었는데 그것은 가짜였습니다. 어디에도 연결되어 있지 않았습니다.<br>둘째, 침대는 바닥에 못으로 고정되어 있었습니다. 옮길 수가 없었습니다.<br>셋째, 그 줄 바로 위쪽 벽에 작은 환기구가 하나 뚫려 있었습니다. 바깥이 아니라 옆방으로 통하는 환기구였습니다.`,
            `옆방은 로일롯 박사의 방이었습니다. 그 방에는 커다란 쇠 금고가 있었고, 그 위에 우유가 담긴 작은 접시가 놓여 있었습니다. 금고에는 서류 한 장 들어 있지 않았습니다. 그리고 의자에는 개 끈처럼 생긴 끈이 하나 걸려 있었는데, 끝이 고리 모양으로 묶여 있었습니다.`,
            `홈스가 말했습니다.<br>"왓슨, 오늘 밤 저 방에서 지내야겠습니다."`,
            `밤이 되어 헬렌이 창에 등불로 신호를 보냈습니다. 약속한 대로였습니다. 우리는 어둠 속에서 담을 넘어 그 방으로 들어갔습니다. 불을 끄고, 홈스는 지팡이를 손에 쥔 채 침대 곁에 앉았습니다. 나도 권총을 무릎에 올려놓고 앉았습니다.`,
            `우리는 세 시간 동안 어둠 속에 앉아 있었습니다. 마당에서 무언가가 지나가는 소리, 멀리서 시계 치는 소리 말고는 아무 소리도 없었습니다. 눈을 떠도 감아도 똑같이 캄캄했습니다. 새벽 세 시가 조금 지났을 때, 환기구 쪽에서 아주 희미한 빛이 새어 나왔습니다. 그리고 무언가 부드러운 것이 미끄러지는 소리가 들렸습니다.`,
            `홈스가 성냥을 그었습니다. 그리고 지팡이로 종줄을 사납게 내리쳤습니다. 여러 번 내리쳤습니다.`,
            `"보셨습니까, 왓슨?"<br>나는 아무것도 보지 못했습니다. 다만 홈스의 얼굴이 하얗게 질려 있었습니다.`,
            `그때 옆방에서 소리가 났습니다. 사람이 지르는 것 같기도 하고 짐승이 우는 것 같기도 한 소리였습니다. 소리는 곧 끊겼습니다.`,
            `우리는 옆방으로 갔습니다. 로일롯 박사가 의자에 앉은 채 고개를 뒤로 젖히고 있었습니다. 머리에는 노란 바탕에 갈색 얼룩이 있는 띠가 감겨 있었습니다. 헬렌의 언니가 남긴 말 그대로였습니다.`,
            `그 띠가 움직였습니다. 뱀이었습니다.`,
            `홈스가 말했습니다.<br>"인도에서 가장 무서운 뱀입니다." 그는 개 끈을 집어 뱀의 목에 걸고 금고 안에 던져 넣은 뒤 문을 닫았습니다.`,
            `돌아오는 기차에서 홈스가 설명했습니다.<br>"언니가 남긴 '얼룩 끈'이라는 말이 열쇠였습니다. 저 사람은 밤마다 환기구로 뱀을 들여보냈습니다. 가짜 종줄은 뱀이 침대로 내려오는 사다리였고, 침대를 못 박아 둔 것은 자리를 옮기지 못하게 하려는 것이었습니다. 우유는 뱀을 부르는 미끼였고, 휘파람은 돌아오라는 신호였지요. 간밤에 내가 지팡이로 내리치자 뱀은 환기구로 되돌아가 성이 난 채 저 사람을 문 것입니다. 두 딸이 결혼하면 재산을 나눠 줘야 했습니다. 그것이 이유의 전부였습니다."`,
            `홈스는 창밖을 보며 덧붙였습니다.<br>"내가 저 사람의 죽음에 책임이 있다고 해도, 그 때문에 잠을 설치지는 않을 것 같군요."`
        ]
    },
    {
        num: 5,
        title: "푸른 보석",
        emoji: "💎",
        art: ["story-05-a.webp", "story-05-b.webp"],
        paras: [
            `성탄절 이틀 뒤 아침, 홈스는 낡은 중절모 하나를 들여다보고 있었습니다. 여기저기 찢어지고 색이 바랜 모자였습니다. 그 시절 신사는 밖에 나갈 때 반드시 모자를 썼습니다. 모자를 안 쓰면 옷을 덜 입은 것으로 여겼습니다.`,
            `홈스가 말했습니다.<br>"경비원 피터슨이 가져온 것입니다."<br>피터슨은 그 거리를 지키는 사람이었습니다. 밤에 등불을 들고 다녔습니다.<br>"성탄절 새벽에 어떤 사람이 거위를 들고 가다가 불량배들과 시비가 붙었답니다. 도망치면서 거위와 모자를 떨어뜨렸고요. 거위는 상하기 전에 먹으라고 피터슨에게 도로 들려 보냈습니다."<br>그 무렵 런던 뒷골목은 밤에 위험했습니다. 가로등이 드문 데가 많았습니다. 거위는 그 시절 영국의 성탄절 밥상에 올리는 것이었습니다. 살림이 넉넉하지 않으면 그것 하나가 큰 것이었습니다.<br>"모자에서 뭘 알 수 있습니까?"<br>"이 사람은 머리가 좋고 세 해 전만 해도 형편이 넉넉했지만 지금은 어렵습니다. 아내가 있었는데 지금은 사랑을 받지 못하고 있고요."<br>모자 하나에 그 사람의 여러 해가 들어 있었습니다.<br>"그걸 다 모자로 아셨다고요?"<br>"모자가 크니 머리도 큽니다. 세 해 전 유행하던 비싼 모자인데 그 뒤로 새것을 못 샀지요. 먼지가 이만큼 앉을 때까지 아무도 솔질을 해 주지 않았고요."<br>모자 안쪽에 이름을 적어 두는 사람이 많았습니다. 그런데 그 모자에는 없었습니다. 모자 안쪽에 머릿기름 자국이 있었습니다. 그리고 끈을 새로 달았다가 그것도 떨어져 있었습니다.`,
            `그때 피터슨이 얼굴이 새파래져서 뛰어 들어왔습니다. 거위를 집에 가져가 배를 가른 참이었습니다. 성탄절 밥상에 올리려던 것이었습니다. <br>"홈스 선생님! 이걸 좀 보십시오! 거위 배 속에서 나왔습니다!"`,
            `손바닥 위에 푸른빛이 나는 돌 하나가 있었습니다. 별처럼 빛났습니다. 카벙클은 붉은 보석을 부르던 말입니다. 그런데 이것은 푸른빛이라 더 드문 것이었습니다.`,
            `홈스가 나직이 말했습니다.<br>"푸른 카벙클이군요. 닷새 전 코스모폴리탄 호텔에서 모카 백작 부인이 잃어버린 보석입니다. 신문에 났지요. 현상금이 천 파운드인데, 값은 그 스무 배는 될 겁니다."<br>그 무렵 런던의 큰 호텔에는 외국의 귀족들이 묵었습니다. 보석을 지니고 다니는 사람이 많았습니다. 그 시절 천 파운드는 사람이 여러 해를 벌어야 만지는 돈이었습니다.`,
            `신문 기사에 따르면 호텔의 배관공 존 호너가 범인으로 잡혀 있었습니다. 그날 그 방에 들어간 사람이 그 사람이었습니다. 물이 새서 부른 것이었습니다. 전에도 도둑질을 한 적이 있어 의심을 샀고, 방을 안내한 호텔 직원 라이더가 증언을 했습니다. 한 번 죄를 지은 사람은 다음에도 먼저 의심을 받았습니다. 그 시절에는 더 그랬습니다.`,
            `홈스가 말했습니다.<br>"호너는 끝까지 아니라고 했지만 아무도 믿지 않았습니다."<br>증인이 하나 있고 전과<span class="gloss">(전에 죄를 지어 벌받은 기록)</span>가 있으면 그것으로 끝이었습니다.<br>"그런데 그 보석이 왜 거위 배 속에 있을까요? 보석이 저절로 거위 배 속에 들어가지는 않습니다. 그러니 넣은 사람이 있습니다."`,
            `홈스는 신문에 광고를 냈습니다. 그 시절 신문 광고는 사람을 찾는 데 자주 썼습니다. 저녁 신문이면 그날 밤에 봅니다. 거위와 모자를 찾아가라는 광고였습니다.`,
            `그날 저녁, 목도리로 얼굴을 반쯤 가린 사내가 찾아왔습니다. 헨리 베이커라는 사람이었습니다. 목도리로 얼굴을 가린 것은 옷깃이 다 해졌기 때문이었습니다. 그것을 홈스가 알아보았습니다. 그는 모자를 받고 반가워했지만, 거위는 이미 먹어 버렸다는 말에는 손을 저었습니다. 모자를 잃은 것이 더 아까웠던 것입니다. 그만큼 형편이 어려웠습니다. <br>"이미 다 드셨다면 어쩔 수 없지요. 그 거위는 어디로 갔는지도 모르겠습니다."<br>"어디서 얻으셨습니까?"<br>"박물관 근처 알파 술집입니다. 거위 모임에 다달이 돈을 조금씩 붓고 성탄절에 한 마리씩 받는 모임이지요."<br>그런 모임이 그 시절 술집마다 있었습니다. 한 번에 낼 수 없는 사람들이 그렇게 모았습니다.`,
            `우리는 알파 술집으로 갔습니다. 박물관 옆의 작은 술집이었습니다. 동네 사람들만 오는 데였습니다. 주인은 코벤트 가든 시장의 브레킨리지라는 상인에게서 거위 스물네 마리를 샀다고 했습니다. 코벤트 가든은 런던에서 제일 큰 청과 시장이었습니다. 새벽마다 사람이 가득했습니다.`,
            `브레킨리지는 성질이 사나웠습니다. 새벽부터 일한 사람이었습니다. 그러니 저녁이면 성이 나 있었습니다. 거위가 어디서 왔느냐고 묻자 버럭 화를 냈습니다.<br>"온종일 그놈의 거위 이야기뿐이군! 다들 왜 그러는 거요!"<br>그날 그 거위를 찾는 사람이 이미 여럿 다녀갔던 것입니다. 그것부터 이상한 일이었습니다.`,
            `홈스는 슬쩍 말을 바꾸었습니다.<br>"그 거위들은 시골에서 온 게 아니라 시내에서 기른 것이지요. 내기를 걸어도 좋습니다."<br>"허, 내가 이기겠군."<br>성이 난 사람에게는 묻는 것보다 우기는 것이 낫습니다. 홈스는 그것을 알고 있었습니다. 상인은 장부를 꺼내 왔습니다. 내기에 이기려고 스스로 꺼낸 것이었습니다. <br>"여기 보시오. 브릭스턴 거리 117번지, 오크숏 부인. 시내요."<br>"고맙습니다." 홈스가 돈을 건네고 돌아섰습니다.`,
            `그때 등 뒤에서 다투는 소리가 났습니다. 자그마한 사내가 상인에게 매달려 거위의 행방을 묻고 있었습니다. 상인은 그를 쫓아 버렸습니다. 홈스는 그 사람이 올 줄 알고, 돌아서고도 그 자리를 떠나지 않고 있었습니다.`,
            `홈스가 그 사내를 따라가 어깨를 짚었습니다.<br>"거위를 찾으십니까? 저는 어디 있는지 압니다."<br>사내는 온몸을 떨었습니다. <br>"선생님은……. 누구십니까?"<br>"라이더 씨, 우리 집에서 이야기하시지요."<br>이름을 불리자 사내는 더 떨었습니다. 아무도 자기를 모를 줄 알았기 때문입니다.`,
            `방에 들어서자마자 홈스는 보석을 탁자에 올려놓았습니다. 라이더는 얼굴이 하얘져 의자를 붙잡았습니다. 그 보석을 다시 볼 줄 몰랐던 것입니다. 그러니 아무 말도 못 했습니다.`,
            `그가 털어놓은 이야기는 이랬습니다. 그는 백작 부인의 보석을 훔치고 전과가 있는 배관공에게 죄를 씌웠습니다. 그러고는 누나 오크숏 부인의 집으로 도망쳤습니다. 누나가 거위를 길러 시장에 내다 팔았습니다. 그것이 그 집 벌이였습니다. 몸수색을 당할까 두려워 마당의 거위 한 마리를 붙잡아 목구멍에 보석을 밀어 넣었습니다.`,
            `"제가 표시해 둔 거위를 안고 나왔는데, 집에 가서 배를 갈라 보니 아무것도 없었습니다." 라이더는 울음을 터뜨렸습니다. <br>"누나 마당에 꼬리에 줄무늬가 있는 거위가 두 마리였던 겁니다. 다른 한 마리는 이미 시장으로 팔려 나간 뒤였고요."<br>그것이 그 사람이 셈하지 못한 것이었습니다.`,
            `홈스는 한참 말이 없다가 문을 가리켰습니다. 그 사이에 무엇을 셈했는지는 알 수 없습니다. <br>"나가시오."<br>"선생님!"<br>"한마디도 더 하지 마시오. 나가시오."<br>경찰을 부르지 않았습니다. 이름도 적어 두지 않았습니다.`,
            `사내가 뛰쳐나간 뒤 내가 물었습니다.<br>"저래도 됩니까? 죄 없는 사람이 갇혀 있는데요."<br>홈스가 말했습니다.<br>"호너는 곧 풀려납니다. 유일한 증인이 사라졌으니 재판이 될 리 없지요. 라이더가 증언을 안 하면 남는 것이 없습니다. 그러니 재판이 서지 않습니다. 저 사람은 다시는 이런 짓을 못 합니다. 오늘 너무 크게 겁을 먹었으니까요. 지금 감옥에 보내면 평생 감옥을 드나드는 사람이 됩니다. 감옥에 한 번 다녀오면 일자리를 얻지 못합니다. 그러면 다시 도둑질을 하게 되지요. 게다가 왓슨, 지금은 성탄절 무렵 아니겠습니까. 사람을 하나 살리는 셈 치지요."<br>라이더는 그날 밤을 평생 잊지 못할 것입니다. 그것이 벌이기도 했습니다.`
        ]
    },
    {
        num: 6,
        title: "짖지 않은 개",
        emoji: "🐎",
        art: ["story-06-a.webp", "story-06-b.webp"],
        paras: [
            `"왓슨, 다트무어에 가야겠습니다."<br>아침 식탁에서 홈스가 말했습니다. 신문마다 같은 사건이 실려 있었습니다. 다트무어는 영국 남서쪽의 넓은 벌판입니다. 바위와 늪이 섞여 있는 데였습니다.`,
            `사흘 전 밤, 다트무어의 킹스 파일랜드 마구간에서 두 가지 일이 한꺼번에 일어났습니다. 이번 경마의 우승 후보인 명마 실버 블레이즈가 사라졌고, 조련사 스트레이커가 벌판에서 죽은 채 발견되었습니다. 머리를 무언가에 세게 맞았고, 손에는 작은 칼이 쥐어져 있었습니다. 경마는 그 시절 영국에서 아주 큰 일이었습니다. 이름난 말이면 온 나라가 그 이름을 알았습니다.`,
            `경찰은 이미 사람을 하나 잡아 두었습니다. 피츠로이 심프슨이라는 노름꾼이었습니다. 그날 밤 마구간 근처를 서성였고, 그의 넥타이가 시체 옆에 떨어져 있었으며, 무거운 지팡이를 들고 있었습니다. 노름꾼은 그 말이 지기를 바랄 만한 사람이었습니다. 그러니 의심하기 좋았습니다. 우리는 다트무어로 내려가 경찰의 그레고리 경위와 말 주인 로스 대령을 만났습니다.`,
            `그날 밤의 일은 이랬습니다. 마구간 하인 헌터가 야식으로 양고기 카레를 먹고 곯아떨어졌습니다. 나중에 조사해 보니 카레에 아편이 섞여 있었습니다. 그 시절 아편은 약국에서 팔았습니다. 잠을 재우는 약으로 썼습니다.`,
            `홈스가 말했습니다.<br>"카레라는 게 재미있습니다. 아편은 맛이 씁니다. 그런데 카레는 그 쓴맛을 완전히 덮어 버리지요. 국이나 죽에 섞으면 곧 알아차립니다. 카레라야 모릅니다. 그날 저녁 메뉴를 미리 알고 있던 사람이어야 합니다."<br>경위가 말했습니다.<br>"심프슨이 부엌에 들렀을 수도 있지 않습니까?"<br>"저녁 메뉴를 정한 것은 그 집 사람들입니다. 지나가던 사람이 어떻게 알겠습니까."<br>그날 카레가 나온다는 것을 아는 사람이 몇 없었습니다. 그것이 첫 번째 단서였습니다.`,
            `홈스는 마구간 관리인에게 물었습니다.<br>"그날 밤 마구간에 개가 있었습니까?"<br>"네, 있었습니다."<br>"그 개가 짖었습니까?"<br>"아니요."<br>아무도 짖는 소리를 못 들었습니다. 그 개는 마구간을 지키는 개였습니다. 낯선 사람이 오면 짖게 되어 있었습니다.`,
            `그레고리 경위가 물었습니다.<br>"제가 눈여겨봐야 할 점이 또 있습니까?"<br>"그날 밤 개가 보인 이상한 행동입니다."<br>"개는 아무것도 하지 않았는데요."<br>홈스가 말했습니다.<br>"그게 이상한 점입니다. 일어난 일만 보면 안 됩니다. 일어나야 하는데 안 일어난 것도 보아야 합니다."`,
            `그 말의 뜻은 분명했습니다. 개가 짖지 않았다면, 한밤중에 말을 끌어낸 사람은 그 개가 잘 아는 사람이었습니다. 홈스는 스트레이커의 주머니에서 나온 물건들을 살폈습니다. 촛농, 파이프, 담배, 그리고 작은 칼 한 자루.`,
            `"왓슨, 이 칼은 무엇에 쓰는 것입니까?"<br>나는 그것을 받아 들고 놀랐습니다.<br>"수술용 칼입니다. 아주 섬세한 수술에 쓰는 것이지요. 이런 걸 밤에 벌판으로 들고 나가는 사람은 없습니다. 몸을 지키려면 다른 것을 듭니다."`,
            `주머니에서는 옷값 청구서도 한 장 나왔습니다. 아주 비싼 여자 옷값이었습니다. 스트레이커의 아내는 그런 옷을 받은 적이 없다고 했습니다. 조련사의 한 달 삯보다 비싼 옷이었습니다. 그러니 셈이 맞지 않았습니다.`,
            `우리는 벌판으로 나갔습니다. 가는 길에 홈스는 풀밭의 양 떼를 한참 보더니, 관리인에게 요즘 양들에게 별일이 없느냐고 물었습니다. 관리인은 얼마 전부터 세 마리가 다리를 전다고 했습니다. 홈스는 한참을 웅크린 채 땅만 들여다보다가, 이윽고 말발굽 자국을 따라가기 시작했습니다. 비가 온 뒤라 자국이 잘 남았습니다. 그것이 그날의 다행이었습니다.`,
            `자국은 이웃 마구간인 메이플턴 쪽으로 이어졌습니다. 그곳에서 우리는 실버 블레이즈를 찾아냈습니다. 이마의 흰 무늬가 검게 칠해져 있었습니다. 그 말은 이마의 흰 무늬로 알아보는 말이었습니다. 그것만 가리면 다른 말이 됩니다.`,
            `그러나 홈스는 그 마구간 주인을 잡지 않았습니다.<br>"말이 제 발로 이 근처까지 왔고, 이 사람은 욕심이 나서 감춰 두었을 뿐입니다. 사람을 해친 것은 다른 이야기입니다. 말을 감춘 것과 사람을 해친 것은 다릅니다."`,
            `홈스는 대령에게 말이 경마에 나올 것이라고만 하고 다른 것은 말해 주지 않았습니다. 나흘 뒤 경마가 열렸습니다. 출발선에는 대령의 기수 옷을 입은 기수가 말에 올라 있었지만, 로스 대령은 그 말이 자기 말이 아니라며 애를 태웠습니다. 이마에 흰 무늬가 없었기 때문입니다. 그런데 그 말이 쏜살같이 앞으로 나가더니 여섯 마리 몸길이 차이로 우승했습니다.`,
            `홈스가 말했습니다.<br>"이마를 술로 닦아 보십시오. 실버 블레이즈가 틀림없습니다. 다만 대령님, 다음부터는 말을 조금 더 믿으셔도 좋겠습니다. 그 말이 제 발로 이웃 마구간까지 갔습니다."<br>그리고 사흘을 거기 있었습니다.`,
            `런던으로 돌아오는 기차에서 홈스는 로스 대령에게 처음부터 설명했습니다.`,
            `"스트레이커는 빚에 쫓기고 있었습니다. 다른 이름으로 살림을 하나 더 꾸리고 있었고, 그 옷값 청구서가 그 증거입니다."<br>그래서 그는 자기 말이 지지 않으면 안 되는 처지가 되었습니다. 그 말이 이기면 그 사람이 망합니다.<br>"그는 말을 죽일 생각은 없었습니다. 다리 힘줄을 아주 조금만 상하게 해서 절게 만들 생각이었지요. 그러면 사고로 보입니다. 그 수술용 칼은 그것을 위한 것이었습니다. 연습도 했습니다. 근처 양 떼 가운데 다리를 저는 양이 세 마리 있더군요. 관리인에게 물어보니 얼마 전부터 그렇다고 했습니다. 처음 하는 사람이 말 다리에 칼을 댈 수는 없습니다."<br>"그날 밤 그는 말을 조용히 끌고 벌판으로 나갔습니다. 개는 짖지 않았지요. 자기 집 사람이었으니까요. 그런데 칼을 대려는 순간, 말이 뒷발로 그를 찼습니다."<br>대령이 물었습니다.<br>"그럼 심프슨의 넥타이는요?"<br>"스트레이커가 주운 것입니다. 말의 다리를 묶는 데 쓰려고요. 그 사람에게는 운이 나빴고, 우리에게는 다행이었습니다. 넥타이 하나로 사람이 붙잡혔습니다. 그런데 그것이 오히려 실마리가 되었습니다. 덕분에 그 자리에 다른 사람이 있었다는 것을 알 수 있었으니까요."`
        ]
    },
    {
        num: 7,
        title: "춤추는 인형",
        emoji: "🕺",
        art: ["story-07-a.webp", "story-07-b.webp"],
        paras: [
            `어느 날 힐턴 큐빗이라는 시골 신사가 종이 한 장을 들고 찾아왔습니다. 키가 크고 얼굴이 붉은 사람이었습니다. 종이에는 아이 낙서 같은 그림이 그려져 있었습니다. 연필로 서툴게 베낀 것이었습니다. 팔다리를 벌린 사람 모양이 줄지어 서 있었습니다. 열댓 개가 한 줄로 늘어서 있었습니다.`,
            `그가 말했습니다.<br>"저는 노퍽에서 농장을 합니다. 한 해 전 런던에서 미국 사람인 엘시라는 여자를 만나 결혼했습니다. 좋은 사람입니다. 다만 결혼하기 전에 저에게 한 가지를 부탁했습니다."<br>"무엇을요?"<br>"자기 지난 일은 묻지 말아 달라는 것이었습니다. 부끄러운 일은 하나도 없지만 떠올리고 싶지 않은 일이 있다고요. 저는 그러겠다고 했고, 지금까지 물은 적이 없습니다."<br>"그런데 한 달쯤 전에 미국에서 편지가 한 통 왔습니다. 아내는 그것을 읽고 불에 던져 버렸습니다. 그 뒤로 며칠 뒤 마당 해시계 위에 이 그림이 분필로 그려져 있었습니다. 아내에게 보여 주었더니 얼굴이 하얗게 질렸습니다. 그리고 이런 게 또 나오면 자기에게 보여 달라고 했습니다."`,
            `홈스는 그림을 오래 들여다보았습니다. 돋보기를 대고 하나씩 보았습니다. <br>"큐빗 씨, 그림이 더 있으면 모두 베껴 보내 주십시오. 지금 이것만으로는 글자가 너무 적습니다."`,
            `그 뒤 두 주 동안 큐빗은 세 번 더 그림을 보냈습니다. 올 때마다 그림이 조금씩 길어졌습니다. 창틀에 그려진 것, 종이에 그려져 문 밑으로 들어온 것, 다시 해시계에 그려진 것이었습니다. 셋 다 새벽에 생긴 것이었습니다. 홈스는 며칠 동안 그 그림들 앞에 앉아 있었습니다. 인형을 하나씩 오려 늘어놓기도 했습니다. 종이 여러 장에 글자를 적었다 지웠다 했습니다. 밥도 거른 채 앉아 있었습니다.`,
            `그가 말했습니다.<br>"왓슨, 이건 암호입니다. 사람 모양 하나가 글자 하나입니다. 그리고 손에 깃발을 든 인형은 낱말이 끝나는 자리를 뜻하지요."<br>"어떻게 푸십니까?"<br>"영어에서 가장 많이 쓰이는 글자는 E입니다. 이 그림에서도 가장 자주 나오는 인형이 하나 있지요. 그것을 E라고 놓고 시작하면 됩니다. 그리고 여기, 다섯 글자짜리 낱말에 E가 처음과 마지막에 하나씩 있습니다. 이건 아마 사람 이름일 겁니다. ELSIE."`,
            `한 글자씩 자리를 잡아 가면서 문장이 드러났습니다. 자리를 하나 맞히면 다음 자리가 저절로 풀렸습니다. <br>"엘시, 준비해." "나는 여기 있다. 에이브 슬레이니." "엘시, 신을 만날 준비를 해."`,
            `홈스의 얼굴이 굳었습니다. 그 자리에서 벌떡 일어섰습니다. <br>"왓슨, 지금 당장 노퍽으로 가야 합니다."`,
            `그러나 우리가 역에 닿았을 때는 이미 늦은 뒤였습니다. 기차가 한 번 더 갈아타야 하는 길이었습니다. 기차에서 내리자 그 지역 경관이 우리를 기다리고 있었습니다.`,
            `경관이 말했습니다.<br>"어젯밤 큐빗 씨 댁에서 총소리가 났습니다. 큐빗 씨는 돌아가셨고, 부인은 크게 다쳐 아직 깨어나지 못하고 있습니다. 부인이 남편을 쏘고 스스로 목숨을 끊으려 한 것으로 보입니다."<br>홈스가 말했습니다.<br>"방에 다른 사람이 있었는지부터 보아야겠습니다."`,
            `그는 서재를 살폈습니다. 경관들이 이미 여러 번 들여다본 방이었습니다. 총알은 두 발이 나갔는데, 창틀에 세 번째 총알 구멍이 있었습니다. 구멍이 바깥에서 안쪽으로 뚫려 있었습니다. <br>"세 발이 나갔다면 사람이 셋입니다."`,
            `창밖 화단에는 발자국이 있었고, 담장 밖에는 탄피가 하나 떨어져 있었습니다. 발자국은 남자의 것이었고, 신발 밑창이 두꺼웠습니다. 홈스는 그것을 주워 주머니에 넣었습니다.`,
            `"그 사람이 어디 묵고 있는지 알아내야 합니다. 근처에 미국 사람이 묵을 만한 곳이 있습니까?"<br>"엘리지 농장에 미국 사람이 하나 와 있다고 들었습니다."`,
            `홈스는 종이에 춤추는 인형을 그리기 시작했습니다. 이번에는 홈스가 그 글자로 쓴 것이었습니다. 그리고 그것을 심부름꾼에게 주어 엘리지 농장으로 보냈습니다.`,
            `"뭐라고 쓰셨습니까?"<br>"아주 짧게 썼습니다. '지금 곧 와라.'"`,
            `한 시간 뒤 마차 소리가 났습니다. 우리는 문 옆에 나란히 앉아 기다리고 있었습니다. 몸집이 크고 얼굴이 검게 그을린 사내가 성큼성큼 들어왔습니다. 모자도 벗지 않고 들어왔습니다. 그는 방 안에 앉아 있는 우리를 보고 걸음을 멈췄습니다.`,
            `홈스가 조용히 말했습니다.<br>"에이브 슬레이니 씨군요. 큐빗 부인이 부른 줄 아셨겠지요. 그 글자를 쓸 줄 아는 사람이 세상에 몇이나 됩니까."`,
            `사내는 그 자리에서 붙잡혔습니다. 손목에 쇠고랑이 채워졌습니다. 그는 시카고에서 온 사람이었습니다. 엘시는 그곳 어느 무리의 우두머리의 딸이었고, 슬레이니는 그 무리의 사람이었으며, 춤추는 인형은 그들끼리 쓰던 글자였습니다. 엘시는 그 세계가 싫어 혼자 영국으로 건너온 것이었습니다. 아버지에게도 알리지 않고 떠났습니다.`,
            `슬레이니가 말했습니다.<br>"저는 그 사람을 쏠 생각이 없었습니다. 창밖에서 이야기를 하다가 그 사람이 총을 들었고, 저도 들었습니다."<br>"부인은요?"<br>"엘시는 저에게 돌아가라고 했습니다. 끝까지요."`,
            `엘시 큐빗은 오래 앓다가 겨우 살아났습니다. 그 뒤로 그녀는 남편의 농장에서 마을 사람들을 돌보며 지냈다고 합니다. 그 농장을 팔지 않고 끝까지 지켰습니다.`,
            `홈스는 나중에 이렇게 말했습니다.<br>"왓슨, 저 그림을 처음 보았을 때 아이 장난이라고 넘겼다면 어땠을까요. 나는 그날 사흘을 더 앉아 있었어야 했습니다."`
        ]
    },
    {
        num: 8,
        title: "폭포에서",
        emoji: "🌊",
        art: ["story-08-a.webp", "story-08-b.webp", "story-08-c.webp"],
        paras: [
            `1891년 4월 어느 저녁, 홈스가 예고도 없이 내 진료실로 들어왔습니다. 얼굴이 창백했고 손등에 상처가 나 있었습니다. 손가락 마디가 까져 있었습니다. 그는 들어오자마자 덧문을 닫았습니다. 창가에는 서지도 않았습니다.`,
            `"모리아티 교수라는 이름을 들어 보셨습니까?"<br>"처음 듣습니다."<br>홈스가 말했습니다.<br>"들어 보셨을 리가 없지요. 그 사람은 이름이 알려지지 않은 것이 가장 큰 재산이니까요. 수학 교수였습니다. 스물한 살에 책을 한 권 썼는데 유럽에서 그것을 이해한 사람이 몇 없었지요. 런던에서 일어나는 큰 범죄의 절반은 저 사람이 뒤에 있습니다. 그런데 저 사람은 아무 일도 하지 않습니다. 계획만 세우고, 사람을 붙여 주고, 몫을 받아 갑니다. 저 사람 손에는 아무 자국도 남지 않지요. 나는 세 해 동안 그 줄을 따라 들어갔습니다. 이제 그물이 다 짜였습니다. 월요일이면 저 사람과 그 무리 마흔 명이 한꺼번에 잡힙니다. 그런데 오늘 아침 저 사람이 나를 찾아왔습니다."`,
            `홈스는 그 대화를 그대로 들려주었습니다.<br>"당신은 생각보다 머리가 좋군요. 물러서시오. 그러지 않으면 나도 물러서지 않겠소." 모리아티가 말했다고 합니다.<br>홈스가 대답했습니다.<br>"나도 마찬가지입니다."<br>"그렇다면 당신은 파멸할 것이오."<br>"당신을 잡을 수 있다면 나도 기꺼이 함께 가겠습니다."`,
            `그날 하루 동안 홈스는 세 번 죽을 뻔했습니다. 아침과 낮과 저녁에 한 번씩이었습니다. 마차가 그를 향해 달려들었고, 지붕에서 벽돌이 떨어졌으며, 골목에서 몽둥이를 든 사내가 덤벼들었습니다.`,
            `"왓슨, 한 주만 영국을 떠나 있으려고 합니다. 함께 가시겠습니까?"<br>"기꺼이 가겠습니다."`,
            `이튿날 아침 우리는 유럽으로 건너갔습니다. 짐은 각자 가방 하나뿐이었습니다. 홈스는 몇 번이나 길을 바꾸고 짐을 다른 곳으로 보냈습니다. 기차를 타고 가다가 중간역에서 내리기도 했습니다. 그러나 사흘째 되던 날 신문에서 그는 짧은 기사를 찾아냈습니다. 런던에서 무리는 모두 잡혔지만 우두머리 한 사람이 빠져나갔다는 기사였습니다.`,
            `홈스가 조용히 말했습니다.<br>"이제 저 사람에게 남은 일은 하나뿐입니다."`,
            `우리는 스위스의 산길을 걸었습니다. 5월 초의 알프스는 눈이 아직 녹지 않았고, 아래쪽 골짜기에는 봄꽃이 피어 있었습니다. 길에서 마주치는 사람이 거의 없었습니다. 홈스는 자꾸 뒤를 돌아보았습니다. 길에 아무도 없는데도 그랬습니다.`,
            `5월 4일, 우리는 마이링겐이라는 마을에 묵었습니다. 여관 주인이 근처의 라이헨바흐 폭포를 꼭 보고 가라고 했습니다. 그 지방에서 제일 이름난 곳이라고 했습니다.`,
            `그 폭포는 무서운 곳이었습니다. 눈 녹은 물이 새까만 바위 틈으로 쏟아져 들어가는데, 바닥이 보이지 않았습니다. 물보라가 끝없이 올라왔고, 소리 때문에 서로의 말이 들리지 않았습니다. 난간을 붙잡지 않으면 서 있기도 어려웠습니다. 그곳으로 가는 길은 하나뿐이라 들어갔던 길로 되돌아 나와야 했습니다.`,
            `우리가 폭포 앞에 서 있을 때, 여관에서 온 소년이 나에게 쪽지를 건넸습니다. 여관에 영국인 부인이 위독하니 의사를 보내 달라는 내용이었습니다.`,
            `홈스가 말했습니다.<br>"저는 여기 조금 더 있겠습니다. 다녀오십시오."`,
            `나는 한 시간을 걸어 여관으로 돌아갔습니다. 내려가는 길이라 그나마 빨랐습니다. 그런데 여관에는 아픈 영국인 부인이 없었습니다. 그날 여관에 든 영국 사람은 우리 둘뿐이었습니다. 그런 쪽지를 쓴 사람도 없었습니다. 나는 온 길을 되돌아 달렸습니다.`,
            `폭포 앞 길 끝에 홈스의 지팡이가 바위에 기대어 서 있었습니다. 그 앞의 진흙에는 발자국 두 사람 몫이 폭포 쪽으로 나 있었고, 돌아 나온 자국은 하나도 없었습니다. 벼랑 끝의 풀은 짓밟혀 있었습니다. 두 사람이 그 자리에서 오래 버틴 자국이었습니다.`,
            `지팡이 밑에는 담뱃갑으로 눌러 놓은 종이 세 장이 있었습니다. 홈스가 나에게 쓴 편지였습니다.`,
            `"왓슨. 모리아티 씨가 나에게 몇 마디 할 시간을 주었기에 이 글을 씁니다. 나는 이렇게 끝나는 것이 나쁘지 않다고 생각합니다. 저 사람을 세상에서 치울 수 있다면 그것으로 내가 한 일은 값을 다한 셈입니다. 부디 잘 지내시기 바랍니다."`,
            `나는 그 자리에 오래 서 있었습니다. 물소리 말고는 아무 소리도 나지 않았습니다. 영국으로 돌아온 뒤 나는 그의 이야기를 정리해 세상에 내놓았습니다. 쓰는 동안 여러 번 손을 놓았습니다. 그것이 마지막이라고 생각했습니다.`,
            `그로부터 삼 년이 지난 1894년 봄, 런던에서 로널드 어데어라는 청년이 잠긴 방에서 총에 맞아 죽은 사건이 일어났습니다. 창문은 이 층이었고, 방문은 안에서 잠겨 있었습니다. 총소리를 들은 사람도 없었습니다. 나는 그 기사를 오려 두고 옛 버릇대로 혼자 궁리를 하곤 했습니다. 그럴 때마다 그 사람이 옆에 있었으면 하고 생각했습니다.`,
            `어느 날 저녁 길에서 늙은 책 장수와 부딪쳤습니다. 허리가 굽고 책을 한 아름 안은 노인이었습니다. 그가 떨어뜨린 책을 주워 주었더니 그는 투덜거리며 갔습니다. 그런데 잠시 뒤 그 노인이 내 진료실로 찾아왔습니다.`,
            `노인이 등을 구부린 채 말했습니다.<br>"손님께 책을 몇 권 권하려고 왔습니다. 저 책장의 빈자리에 딱 맞을 겁니다."`,
            `내가 책장 쪽으로 고개를 돌렸다가 다시 보았을 때, 노인은 사라지고 셜록 홈스가 웃으며 서 있었습니다. 나는 그날 태어나서 처음으로 정신을 잃었습니다. 군의관으로 전쟁터에 있으면서도 없던 일이었습니다.`,
            `그가 나에게 물을 건네며 말했습니다.<br>"미안합니다, 왓슨. 이렇게까지 할 생각은 아니었습니다."<br>"살아 계셨군요. 대체 어떻게……."<br>홈스가 말했습니다.<br>"폭포 끝에서 나는 모리아티와 맞붙었습니다. 그 사람은 떨어졌고 나는 남았습니다. 그때 문득 생각이 들었습니다. 저 사람의 부하들이 아직 남아 있는데, 내가 죽었다고 믿게 하면 그자들이 마음을 놓겠구나 하고요. 그래서 벼랑을 기어 올라가 바위 뒤에 숨었습니다. 실제로 그때 위에서 누가 돌을 굴려 떨어뜨렸습니다. 나는 세 해 동안 티베트와 페르시아와 프랑스를 떠돌았습니다."<br>"세 해 동안 왜 저에게조차 알리지 않으셨습니까?"<br>홈스는 잠깐 말이 없었습니다.<br>"당신은 거짓말을 못 하는 사람이기 때문입니다. 당신이 알았다면 내 글에도 표가 났을 겁니다. 그 점은 정말 미안합니다."<br>"이제 다 끝났습니까?"<br>"한 사람이 남았습니다. 모리아티의 오른팔이었던 자입니다. 어데어 청년을 쏜 사람도 그자입니다." 홈스가 모자를 집었습니다.<br>"왓슨, 오늘 밤에 시간이 있으십니까? 권총을 가져오십시오."`,
            `나는 세 해 만에 그 말을 다시 들었습니다. 권총을 가져오라는 그 말이었습니다. 그리고 세 해 만에 서랍에서 권총을 꺼냈습니다.`
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
    title: 'The Adventures of Sherlock Holmes',
    cover: {
        title: 'The Adventures of Sherlock Holmes',
        tag: 'after Arthur Conan Doyle',
        intro: [
            `A little over a hundred years ago, at 221B Baker Street in London, there lived a man called Sherlock Holmes. His rooms were the last place a case came to after the police had given it up.`,
            `This book holds seven of those cases, as set down by Dr Watson, who shared those rooms with him.`
        ]
    },
    chapters: [
        {
            title: '221B Baker Street',
            paras: [
                `My name is John Watson. I went out to Afghanistan as an army surgeon, was shot in the shoulder, and came home to England. My health was broken, I knew nobody, and the money I could spend each day was fixed. London lodgings could not be met on that sum. Britain was fighting in Afghanistan in those years. Wounded soldiers were shipped home.`,
                `One day in 1881 I ran into an old colleague, Stamford. We bumped shoulders in the street, and that was the start of it. London then was a city of more than four million people. The biggest city in the world. When I said I was looking for somebody to share rooms with, he said,<br>"Somebody said the very same thing to me this morning. Only, to live with that man you will need to brace yourself a little."<br>"What sort of man is he?"<br>"Not a bad one. Only rather... You had better see for yourself."<br>Stamford had worked in the same hospital as the man.`,
                `Stamford took me to the hospital laboratory. The smell of chemicals caught in my nose. At a long bench a tall, very thin man was bent over his work. Test tubes and bottles covered the bench. In those days anybody could walk into a hospital laboratory. So that was where the man spent his time. The moment he saw us, he sprang up with a test tube in his hand.`,
                `"I have found it! I have found a way to detect bloodstains!" He seized my hand. His fingers were covered in ink and chemical stains. Until then there had been no way to tell a bloodstain from any other. So it was often argued over in court. <br>"You have been in Afghanistan, I see."`,
                `I stared at him in astonishment.<br>"How did you know?"<br>"It is nothing. A face tanned by the sun with the wrists still white, and a left arm held carefully." He laughed.`,
                `The man was Sherlock Holmes. He was about twenty-seven then. That week we moved together into a two-room lodging at 221B Baker Street. The rooms had big windows and plenty of sun. The landlady was a Mrs Hudson. Baker Street was a quiet street in the west of London.`,
                `After a few days I saw that he really was a strange man. They were things you would not know unless you lived with him. Some days he experimented until dawn, and some days he lay on the sofa without a word. Such days could run to three in a row. He hardly ate. He played the violin, and when he played a piece he was superb, but mostly he simply scraped at the strings. He said he did that when he was thinking.`,
                `What he knew was strange too. He could tell the kinds of London soil by colour alone, he knew a hundred and forty kinds of tobacco ash, and he had every old criminal case by heart. A case from the newspapers ten years back, he remembered to the date. He had several scrapbooks of cuttings. He laid them out in a row and searched through them. And yet he did not know that the earth goes round the sun. When I heard that, I could not speak for some time. It was a thing any schoolchild knew.`,
                `"What use is that to me?" When I told him, he was irritated rather than grateful.<br>"A man's brain is like an attic. There is only so much room. Put in useless things and the useful ones are pushed out."<br>Whether that is true, I cannot say. Only, that was how he lived.`,
                `All sorts of people came to his rooms. Some days a well-dressed gentleman, some days an old man in rags, some days a policeman. They came at all hours. Some days the bell rang before dawn. Each time, he asked me to leave the room for a while. Each time, I withdrew to my own room. I could not hear what was said.`,
                `At last I could bear it no longer and asked.<br>"What on earth do you do?"<br>He said,<br>"The only profession of its kind in the world."<br>He had invented that profession himself.<br>"I am a consulting detective. London has government detectives and plenty of private ones. When they get stuck, they come to me. I hear the case and give them the answer. Mostly without getting up from this chair."`,
                `I held back a laugh. I had never met anyone who talked like that. So it sounded like boasting. He looked out of the window and said,<br>"Do you see that man walking across the street? The one with the envelope."<br>"I see him."<br>"He is a retired sergeant of marines."`,
                `Boasting, I thought to myself. A moment later the man rang our bell, and I asked him myself. He had come to deliver the envelope. He had a blue tattoo on the back of his hand, and he walked with his chin up, as if keeping step. It took him about three minutes to cross from the other side. All that time I was watching from the window. <br>"Excuse me, but what did you do before this?"<br>"I was in the marines, sir. Discharged a sergeant."`,
                `When I turned round, Holmes was already looking elsewhere.<br>He said,<br>"The tattoo on the back of his hand, his walk, and the angle he holds his chin."<br>Every seaman had a navy tattoo in those days. And the design differed from unit to unit.<br>"Seeing and observing are different things, Watson. You go up and down these stairs every day, but you do not know how many there are."`,
                `I could not answer. There were seventeen. There are people who climb a staircase for seventeen years and never think to count. That day I went down counting them one by one. From then on I began to keep a record of his cases. I bought a notebook and started with the date. The stories in this book are a few of them. Even choosing took a long time. He handled hundreds of cases.`
            ]
        },
        {
            title: 'A Photograph from Bohemia',
            paras: [
                `In March 1888 I called at Baker Street for the first time in a long while. I had married in the meantime and lived elsewhere. Holmes held out a letter to me. The envelope was very thick. There was no date and no name. That a letter had no name was strange to begin with. It meant somebody who had to hide it. <br>"I shall call on you tonight at a quarter past eight. Do not be alarmed if I am wearing a mask."<br>I asked,<br>"What can you tell from this?"<br>"The paper is thick and expensive. Paper carries the mark of the place it was made. Hold it to the light and you can see it. Hold it to the flame and the letters show. It was made in Bohemia. And the man who wrote this sentence is German. His English is good, but he arranges his words the German way."<br>Bohemia was a country in the west of what is now the Czech lands. Many people spoke German there in those days.`,
                `At a quarter past eight a carriage stopped, and a very tall man came in. It was a carriage drawn by two horses. Such carriages seldom came to that street. The upper half of his face was hidden by a black mask. He was nearly two metres tall. He had to stoop to pass the door. <br>"I am Count von Kramm. I come on the business of the royal house of Bohemia."<br>Holmes said quietly,<br>"Your Majesty. You may take off the mask. I find it easier to work if I am speaking with the King of Bohemia."<br>He had worked it out from the paper, the speech and the height. And he said so on the spot.`,
                `The man stood frozen a moment, then tore off the mask and threw it down. Once found out, there is no reason left to hide. Holmes had reckoned on that too.`,
                `The King said,<br>"Five years ago I was in Warsaw."<br>Warsaw is now the capital of Poland. In those days it was a city where the royal families of Europe came and went.<br>"There I came to know a woman called Irene Adler. An opera singer."<br>Opera singers in those days were widely known by name. They moved from country to country and stood on its stages.<br>"There is a photograph of the two of us together."<br>Photographs were very rare then. To have one taken, you had to sit still a long time.<br>"That photograph is in her hands."<br>"Have you asked for it back?"<br>"I have sent people five times. Her house has been searched twice, her luggage seized, and she has been searched in the street twice. It was nowhere."<br>So the hiding place was out of the ordinary.`,
                `In three days the King was to be engaged to the princess of another country. A marriage between royal houses was also a promise between countries. If the photograph came out, the match was off. Irene Adler had said she would send it on the day the engagement was announced. So it all hung on one photograph.`,
                `The next morning a man dressed as a drunken groom walked into the room. I very nearly cried out. It was not only the clothes that had changed. It was Holmes.`,
                `He laughed and said,<br>"I spent half a day in the stables of that house. Dress as a groom and the grooms will talk to you. Go as a gentleman and nobody says a word. I handed out tobacco and listened. Grooms know where everyone in the house goes. So you have only to ask them. And I saw one unexpected thing. Irene Adler married a lawyer this morning. And I was the witness at the wedding."<br>They had been one witness short. So they had grabbed a passer-by.<br>"Married?"<br>"It is no cause for alarm. If anything, that marriage is good luck. It takes away her reason for using the photograph. What matters more is that this evening we must find out where it is. Watson, will you help me? We may have to bend the law a little."<br>"Gladly."<br>It meant going into somebody else's house. And I did not ask about that.`,
                `That evening Holmes disguised himself as a country clergyman. In a clergyman's dress, nobody suspects you. That was England in those days. In front of Irene Adler's house he pretended to be caught up in a brawl among loafers, smeared red paint on his face, and fell. People carried him into the house. You cannot leave an injured man in the street. That was exactly what he had counted on.`,
                `My part had been settled beforehand. I stood across the lane. It was a spot with a good view of the window. When Holmes raised his hand at the window, I was to throw a smoke canister through it and shout "Fire!" It only had to look like a fire.`,
                `The signal came. I did as arranged. Screams broke out in the house and people ran about. There was smoke and no flame. But nobody had time to check that. Ten minutes later Holmes caught up with me in the lane. He had walked out in the confusion. Nobody had paid him any attention.`,
                `He said,<br>"I have found it. When people think there is a fire, they snatch up what is most precious to them first. With no time to think, the body moves before the mind. It shows you exactly where the thing is. The lady went straight to the drawing-room wall and slid back a panel. The photograph is in there."<br>Asking where it was could never have found it. So he had made her go to it herself.<br>"Why did you not take it then and there?"<br>"The coachman was in the room. Take it on the spot and it becomes theft. And there was somebody watching. Tomorrow morning I shall go with the King and receive it properly."`,
                `As we left the lane, a young man passing by greeted us.<br>"Good night, Mr Sherlock Holmes."<br>We turned, but he had already vanished. It had been a young man's voice. So nobody thought anything of it.`,
                `The next morning, when the three of us went to the house, it was empty. The maid smiled and told us the master and mistress had left England by the 5.15 train. They had packed through the night.`,
                `Behind the sliding panel, instead of the photograph, was a letter and a different photograph. A photograph of Irene Adler alone. It was not left for the King. It was left for Holmes.`,
                `The letter began like this. It had been written through the night. <br>"My dear Mr Sherlock Holmes. You really did it very well. Until the cry of fire, I suspected nothing. But when I saw you raise your hand at the window, I knew. Where there is somebody to signal to, the thing is arranged. I too am rather good at disguise. The young man who wished you good night in the lane last night was myself. I am taking the photograph with me. But only to protect myself. I shall never use it. I have married a man who loves me."`,
                `The King was dumbfounded, and yet relieved. The photograph was not recovered. But he had her word that it would never be used. <br>"What a queen she would have made, had she been a man."<br>Holmes answered coldly,<br>"That lady is of a very different kind from Your Majesty."<br>Whether the King understood, I cannot say. Holmes said it and turned away.`,
                `When the King offered a ring as a reward, Holmes declined. He took away only that one photograph.`,
                `After that, Holmes never spoke Irene Adler's name. He called her only "the woman". She was the only person who had ever beaten him. And not once, but twice.`
            ]
        },
        {
            title: 'The Red-Headed League',
            paras: [
                `One autumn day, a stout old gentleman with a red face sat in Baker Street. His hair was as red as if it were on fire. I had never seen hair of that colour in my life.`,
                `Holmes said,<br>"Watson, you have come at just the right moment. Mr Wilson, would you tell it once more from the beginning?"`,
                `Mr Wilson took out a scrap of newspaper.<br>"The Red-Headed League. One vacancy. Four pounds a week. The work is very light. Apply Monday at eleven, 7 Fleet Street."<br>Mr Wilson said,<br>"I keep a small pawnshop in the City. Not many customers, so things are tight. About two months ago my new assistant, Spaulding, brought me this advertisement. With hair my colour, he said, I was sure to be chosen."<br>"What sort of man is this assistant?"<br>"A good worker. He offered to take half the usual wages, too. Only, he is mad about photography, and forever going down to the cellar to fiddle with his plates."<br>"Go on."<br>"When I got there, red heads filled the street. But the man in charge took one look at me, tugged my hair with his hand, and said I was chosen on the spot."<br>"And what was the work?"<br>"To sit in an office from ten to two every day copying out the encyclopaedia. On condition that I never left the room. In eight weeks I copied every word beginning with A."<br>"And then?"<br>"This morning I found the door locked, with this notice on it. The Red-Headed League is dissolved."`,
                `Holmes sat with his eyes shut a long while, then asked. He sat with his fingertips pressed together. <br>"This assistant Spaulding, are his ears pierced?"<br>"Yes, he said he had it done as a boy."`,
                `After Mr Wilson had gone, Holmes said,<br>"Watson, are you free this evening? It may be a little dangerous. Bring your revolver."`,
                `We went first to the pawnshop. A small, shabby place. Holmes knocked, pretending to ask the way, and a young assistant came out. Holmes thanked him and turned away. Then, suddenly, he struck the pavement in front of the shop two or three times with his stick. He was listening to the sound.`,
                `"Watson, did you see that man's knees?"<br>"His knees?"<br>"The knees of his trousers were worn shiny. And there was earth on them. That man has lately been on his knees doing something. And for a very long time."`,
                `Holmes went round to the main road behind the pawnshop. He was checking what stood directly behind the building. There was a branch of the City Bank. Only one wall stood between it and the pawnshop cellar.`,
                `Holmes said,<br>"Do you see it now? Those men kept Mr Wilson away from his house four hours a day for eight weeks. For what? To dig in the cellar, as far as the bank vault. And a young assistant with pierced ears puts me in mind of a certain thief."<br>"How can you be sure it is tonight?"<br>"Because the League dissolved today. That means the tunnel is finished. And tomorrow is Saturday. For two days nobody will notice."`,
                `At ten that night we were in the bank's underground vault. The bank director and Inspector Jones of the London police were with us. We shaded the lantern and hid behind the crates. The vault was stacked with boxes of gold coin brought over from France.`,
                `An hour passed, and then two. In the dark, time went very slowly. Then a faint light leaked between the flagstones. One stone slid aside, a hand came up, and then a head. There was earth on the face.`,
                `He spoke down into the hole.<br>"All clear. Pass up the bags."`,
                `At that instant Holmes sprang out and seized him by the collar. Inspector Jones snapped the handcuffs on his wrists. The man below ran the other way, but was caught by the constable waiting outside.`,
                `The captured man said calmly,<br>"Keep your hands off me. And when you speak to me, say sir. There is royal blood in my veins."<br>Inspector Jones said,<br>"John Clay. Thief and forger. Three years I have been after him and never once seen his face."`,
                `On the way home Holmes said,<br>"This case has saved me from boredom. That is enough."`
            ]
        },
        {
            title: 'The Speckled Band',
            paras: [
                `Early one morning in April 1883, Holmes shook me awake. It was a little past seven. <br>"A client has come. A badly frightened one."`,
                `In the sitting room sat a young woman in black, her face veiled. When she lifted the veil, to my surprise, though she was not yet thirty her hair was streaked with grey. Her hands kept trembling.`,
                `"My name is Helen Stoner. I live at Stoke Moran, in the house of Dr Roylott. He is my stepfather."<br>Holmes said,<br>"Warm yourself first. But what are those marks on your wrist?"`,
                `The woman quickly pulled down her sleeve. On her wrist were five bruised finger marks. They were some days old. <br>"My stepfather is... a strong man. He does not know his own strength."`,
                `Helen began her story. Dr Roylott had worked as a doctor in India, had beaten a servant to death there and gone to prison for it, and since coming home had shut himself away in an old mansion, mixing with nobody. A leopard and a baboon brought from India roamed the grounds. The villagers would not pass the house. The fortune their mother had left was in their stepfather's hands, and whenever either daughter married, he had to give her share to her.`,
                `Helen said,<br>"Two years ago my sister died. She was about to be married. For some days before she died, she said she heard a low whistle every night. That night I heard a scream from her room. I ran out and found her holding the door, and then she fell. She said 'the speckled band, the speckled band', and died. The room was locked from inside. The shutters were fastened too. There was no sign of anyone having entered."<br>Holmes asked,<br>"Then why have you come now?"<br>"I am to be married too. And saying the house is being repaired, he has shut up my room, so since last week I have been sleeping in the room my sister used."`,
                `Helen's voice shook.<br>"Last night I heard that whistle."`,
                `Just after Helen left, the door burst open and a man like a giant came in. It was Dr Roylott.`,
                `"My daughter has been here. What did she tell you?"<br>Holmes answered,<br>"It is a cold spring."<br>The man picked up the iron poker from the fireplace and bent it double in his two hands.<br>"Do not meddle with me." And he went out.`,
                `Holmes picked up the bent poker and straightened it again as if it were nothing.<br>"It is as well he has only that much strength. A man who relies on force alone is easy to handle."`,
                `That afternoon we went to Stoke Moran. Half the mansion was falling into ruin, and only one end was lived in. Some rooms still had broken window panes. Holmes examined the room Helen had moved into. He went over it with his hands from floor to ceiling. And he found three things.`,
                `First, a bell-rope hung by the head of the bed, and it was a dummy. It was connected to nothing.<br>Second, the bed was nailed to the floor. It could not be moved.<br>Third, in the wall just above that rope was a small ventilator. It opened not to the outside but into the next room.`,
                `The next room was Dr Roylott's. In it stood a large iron safe, and on top of the safe a small saucer of milk. There was not a single paper in the safe. And over a chair hung a cord like a dog leash, its end tied in a loop.`,
                `Holmes said,<br>"Watson, we must spend tonight in that room."`,
                `When night came, Helen signalled from her window with a lamp. As arranged. We climbed the wall in the dark and went into the room. We put out the light, and Holmes sat by the bed with his stick in his hand. I sat with my revolver on my knee.`,
                `For three hours we sat in the dark. Apart from something moving in the grounds and a distant clock striking, there was no sound. Eyes open or shut, it was equally black. A little after three in the morning, a very faint light showed at the ventilator. And there was a sound of something soft sliding.`,
                `Holmes struck a match. And he lashed at the bell-rope with his stick. Again and again.`,
                `"Did you see it, Watson?"<br>I had seen nothing. Only, Holmes's face was white.`,
                `Then a sound came from the next room. It might have been a man's cry or an animal's howl. It stopped almost at once.`,
                `We went into the next room. Dr Roylott sat in his chair with his head thrown back. Round his head was wound a band, yellow with brown speckles. Exactly the words Helen's sister had left.`,
                `The band moved. It was a snake.`,
                `Holmes said,<br>"The deadliest snake in India." He picked up the leash, slipped it round the snake's neck, threw it into the safe and shut the door.`,
                `On the train home, Holmes explained.<br>"The words the sister left, 'the speckled band', were the key. That man sent the snake through the ventilator every night. The dummy bell-rope was the snake's ladder down to the bed, and the bed was nailed so that it could not be moved. The milk was the bait that called the snake, and the whistle was the signal to come back. Last night, when I struck at it with my stick, the snake went back through the ventilator in a rage and bit him. If both daughters married, he would have to give up part of the fortune. That was the whole of the reason."`,
                `Holmes looked out of the window and added,<br>"Even if I am responsible for that man's death, I do not think it will cost me any sleep."`
            ]
        },
        {
            title: 'The Blue Carbuncle',
            paras: [
                `On the morning two days after Christmas, Holmes was studying a battered old felt hat. It was torn here and there and faded. In those days a gentleman never went out without a hat. Without one he was thought half dressed.`,
                `Holmes said,<br>"Peterson the commissionaire brought it."<br>Peterson was the man who watched over that street. He walked it at night with a lantern.<br>"Early on Christmas morning a man carrying a goose got into a scuffle with some roughs. He dropped the goose and the hat as he ran. I sent the goose home with Peterson, to be eaten before it spoiled."<br>The back streets of London were dangerous at night in those days. Street lamps were scarce in many places. A goose was what went on an English Christmas table then. For a family not well off, that one bird was a great thing.<br>"What can you tell from the hat?"<br>"This man is clever, was well off three years ago, and is now hard up. He has a wife, and she no longer loves him."<br>One hat held several years of the man's life.<br>"You got all that from a hat?"<br>"A big hat means a big head. It was an expensive hat in the fashion of three years ago, and he has not bought a new one since. And nobody has brushed it for him in all the time it took this much dust to settle."<br>Many men wrote their name inside their hat. This one had none. Inside the hat were marks of hair oil. And a new elastic had been fitted, and that too had come off.`,
                `Then Peterson ran in, his face white. He had taken the goose home and just cut it open. It was to have gone on his Christmas table. <br>"Mr Holmes! Look at this! It came out of the goose!"`,
                `On his palm lay a stone with a blue light in it. It shone like a star. Carbuncle was the old name for a red gem. This one was blue, and so rarer still.`,
                `Holmes said softly,<br>"The blue carbuncle. The jewel the Countess of Morcar lost at the Hotel Cosmopolitan five days ago. It was in the papers. The reward is a thousand pounds, and its value must be twenty times that."<br>In those days the great London hotels were full of foreign nobility. Many carried jewels about with them. A thousand pounds then was money a man would work years to touch.`,
                `According to the newspaper, a plumber at the hotel, John Horner, had been arrested for it. He was the man who had been in the room that day. He had been called in for a leak. He had a previous conviction for theft, which drew suspicion, and the hotel attendant who had shown him to the room, Ryder, had given evidence. A man who had once done wrong was the first suspected the next time. It was more so in those days.`,
                `Holmes said,<br>"Horner denied it to the last, but nobody believed him."<br>One witness and a record, and that was the end of it.<br>"But why is the jewel in a goose? A jewel does not get into a goose by itself. So somebody put it there."`,
                `Holmes put an advertisement in the paper. Newspaper advertisements were often used to find people in those days. An evening paper was read that same night. It said the goose and the hat could be claimed.`,
                `That evening a man came with a scarf hiding half his face. His name was Henry Baker. The scarf hid his face because his collar was worn through. Holmes had spotted that. He was glad to get the hat back, but when the goose was mentioned he waved his hand. Losing the hat had grieved him more. That is how hard up he was. <br>"If it has all been eaten, it cannot be helped. I have no idea where that goose came from anyway."<br>"Where did you get it?"<br>"The Alpha inn, near the museum. A goose club. You pay in a little each month and get a bird at Christmas."<br>Every inn had such a club in those days. People who could not pay all at once saved that way.`,
                `We went to the Alpha inn. A small inn beside the museum. Only local people went there. The landlord said he had bought two dozen geese from a dealer called Breckinridge at Covent Garden market. Covent Garden was the biggest fruit and vegetable market in London. Every dawn it was crowded.`,
                `Breckinridge had a fierce temper. He had been working since dawn. So by evening he was in a bad mood. When asked where the geese came from, he exploded.<br>"Geese, geese, all day long nothing but that confounded goose! What is the matter with everybody?"<br>Several people had already come that day asking after that goose. That alone was strange.`,
                `Holmes slipped into a different tack.<br>"Those geese were town-bred, not country-bred. I would bet on it."<br>"Ha, then I win."<br>With an angry man, insisting works better than asking. Holmes knew that. The dealer fetched his ledger. He brought it out himself, to win the bet. <br>"See here. 117 Brixton Road, Mrs Oakshott. Town."<br>"Thank you." Holmes handed over the money and turned away.`,
                `Then behind us came the sound of an argument. A small man was clinging to the dealer, asking where the goose had gone. The dealer drove him off. Holmes had known the man would come, and even after turning away he had not left the spot.`,
                `Holmes followed the man and laid a hand on his shoulder.<br>"Looking for the goose? I know where it is."<br>The man shook from head to foot.<br>"Who... who are you, sir?"<br>"Mr Ryder, let us talk at my rooms."<br>Being called by name made the man shake all the more. He had thought nobody knew him.`,
                `The moment we entered, Holmes set the jewel on the table. Ryder went white and clutched at the chair. He had never expected to see that stone again. So he could not say a word.`,
                `The story he told was this. He had stolen the Countess's jewel and thrown the blame on the plumber with the record. Then he had fled to the house of his sister, Mrs Oakshott. She raised geese and sold them at market. That was how the house lived. Afraid of being searched, he had caught a goose in the yard and forced the stone down its throat.`,
                `"I carried out the goose I had marked, but when I got home and cut it open, there was nothing." Ryder burst into tears. <br>"There were two geese with barred tails in my sister's yard. And the other had already gone to market."<br>That was what he had failed to reckon.`,
                `Holmes was silent a long while, then pointed to the door. What he reckoned in that time, I cannot say. <br>"Get out."<br>"Sir!"<br>"Not another word. Get out."<br>He did not call the police. He did not even write down the name.`,
                `After the man had fled, I asked,<br>"Is that right? An innocent man is in custody."<br>Holmes said,<br>"Horner will be released soon. The only witness has vanished, so there can be no trial. If Ryder does not testify, there is nothing left. So the case collapses. That man will never do such a thing again. He was far too badly frightened today. Send him to prison now and he becomes a man who is in and out of prison all his life. A man who has been to prison once cannot get work. And then he steals again. Besides, Watson, it is the season of forgiveness. Let us say we have saved a soul."<br>Ryder will never forget that night as long as he lives. That, too, was a punishment.`
            ]
        },
        {
            title: 'The Dog That Did Not Bark',
            paras: [
                `"Watson, we must go to Dartmoor."<br>Holmes said it at the breakfast table. Every newspaper carried the same case. Dartmoor is a wide moor in the south-west of England. A place of rock and bog.`,
                `Three nights before, at the King's Pyland stables on Dartmoor, two things had happened at once. Silver Blaze, the famous horse favoured to win the coming race, had vanished, and the trainer, Straker, had been found dead on the moor. He had been struck hard on the head, and a small knife was in his hand. Racing was a very big thing in England then. The whole country knew the name of a famous horse.`,
                `The police had already arrested somebody. A gambler called Fitzroy Simpson. He had been hanging about the stables that night, his cravat had been found beside the body, and he carried a heavy stick. A gambler was a man who might well want that horse to lose. So he was easy to suspect. We went down to Dartmoor and met Inspector Gregory of the police and Colonel Ross, the horse's owner.`,
                `What had happened that night was this. The stable boy, Hunter, had eaten a supper of curried mutton and fallen into a dead sleep. It was found later that the curry contained opium. In those days opium was sold at the chemist's. It was used as a sleeping draught.`,
                `Holmes said,<br>"The curry is interesting. Opium is bitter. But curry covers that bitterness completely. Put it in soup or porridge and you notice at once. Only curry hides it. It had to be somebody who knew in advance what that evening's supper would be."<br>The inspector said,<br>"Could Simpson not have stopped by the kitchen?"<br>"The supper was chosen by the people of that house. How could a passing stranger know?"<br>Very few knew there would be curry that night. That was the first clue.`,
                `Holmes asked the stable manager,<br>"Was there a dog in the stables that night?"<br>"Yes, there was."<br>"Did it bark?"<br>"No."<br>Nobody had heard it bark. That dog was there to guard the stables. It was there to bark when a stranger came.`,
                `Inspector Gregory asked,<br>"Is there any other point to which you would draw my attention?"<br>"To the curious behaviour of the dog that night."<br>"The dog did nothing."<br>Holmes said,<br>"That was the curious point. You must not look only at what happened. You must also look at what should have happened and did not."`,
                `The meaning was plain. If the dog had not barked, the person who led the horse out in the middle of the night was somebody the dog knew well. Holmes examined the things from Straker's pockets. Candle wax, a pipe, tobacco, and a small knife.`,
                `"Watson, what is this knife for?"<br>I took it and was startled.<br>"It is a surgical knife. For very delicate operations. Nobody carries a thing like this out onto a moor at night. To defend yourself, you take something else."`,
                `A bill for clothes also came out of the pocket. For very expensive women's clothes. Straker's wife said she had never received such clothes. The dress cost more than a trainer's monthly wage. So the sums did not add up.`,
                `We went out onto the moor. On the way, Holmes watched a flock of sheep in the pasture for some time, then asked the stable manager whether anything had been wrong with the sheep lately. The manager said three of them had begun to go lame not long ago. Holmes crouched a long while looking only at the ground, then at last began to follow hoofprints. After rain, the prints held well. That was the day's good luck.`,
                `The prints led toward the neighbouring stables at Mapleton. There we found Silver Blaze. The white blaze on his forehead had been painted black. That horse was known by the white mark on his forehead. Cover that, and he became another horse.`,
                `But Holmes did not have the owner of those stables arrested.<br>"The horse came this way on its own legs, and this man was greedy and hid it. Harming a man is another matter. Hiding a horse and harming a man are different things."`,
                `Holmes told the Colonel only that the horse would run, and told him nothing more. Four days later the race was run. At the starting line a jockey in the Colonel's colours sat on a horse, but Colonel Ross fretted that it was not his horse, because it had no white mark on its forehead. Then that horse shot forward and won by six lengths.`,
                `Holmes said,<br>"Wash his forehead with spirits of wine. It is Silver Blaze, beyond doubt. Only, Colonel, next time you might trust your horse a little more. He went to the neighbouring stables on his own legs."<br>And stayed there three days.`,
                `On the train back to London, Holmes explained it all to Colonel Ross from the beginning.`,
                `"Straker was being hounded by debts. He was keeping a second household under another name, and that clothes bill is the proof."<br>So he was in a position where his own horse must not win. If the horse won, he was ruined.<br>"He had no intention of killing the horse. He meant to nick a tendon in the leg, very slightly, to make it lame. Then it would look like an accident. The surgical knife was for that. He practised, too. Among the sheep nearby there were three that limped. The shepherd said it had begun not long ago. Nobody puts a knife to a horse's leg on the first try."<br>"That night he led the horse quietly out onto the moor. The dog did not bark. It was one of its own household. But the instant he put the knife to the leg, the horse kicked him with its hind feet."<br>The Colonel asked,<br>"Then Simpson's cravat?"<br>"Straker had picked it up. To tie the horse's legs. Bad luck for that man, and good luck for us. A cravat got a man arrested. But it was also the thread. Thanks to it, we knew somebody else had been at that spot."`
            ]
        },
        {
            title: 'The Dancing Men',
            paras: [
                `One day a country gentleman called Hilton Cubitt came with a sheet of paper. A tall man with a red face. On the paper was a drawing like a child's scribble. It had been copied clumsily in pencil. Figures of men with arms and legs spread stood in a row. About fifteen of them in a line.`,
                `He said,<br>"I farm in Norfolk. A year ago in London I met an American woman called Elsie, and married her. A good woman. Only, before we married she asked one thing of me."<br>"What was it?"<br>"Never to ask about her past. There was nothing shameful in it, she said, but there were things she did not wish to remember. I promised, and I have never asked."<br>"Then about a month ago a letter came from America. My wife read it and threw it in the fire. A few days after that, this drawing appeared in chalk on the sundial in the garden. When I showed it to my wife, she went white. And she asked me to show her if any more appeared."`,
                `Holmes studied the drawing a long time. He went over it figure by figure with a lens. <br>"Mr Cubitt, if more of these appear, copy them all and send them to me. With this alone there are too few letters."`,
                `Over the next two weeks Cubitt sent three more drawings. Each time they were a little longer. One was drawn on a window sill, one on paper pushed under the door, and one again on the sundial. All three had appeared before dawn. For days Holmes sat before those drawings. He cut out the figures one by one and laid them in rows. He wrote letters on sheet after sheet and rubbed them out. He sat without eating.`,
                `He said,<br>"Watson, this is a cipher. Each figure is one letter. And a figure holding a flag marks the end of a word."<br>"How do you solve it?"<br>"The commonest letter in English is E. In these drawings, too, there is one figure that appears most often. Set that as E and begin. And here, a five-letter word with an E first and last. That is probably a name. ELSIE."`,
                `As one letter after another fell into place, the sentences appeared. Fix one letter and the next solved itself. <br>"Elsie, prepare." "I am here. Abe Slaney." "Elsie, prepare to meet thy God."`,
                `Holmes's face hardened. He sprang to his feet. <br>"Watson, we must go to Norfolk this instant."`,
                `But by the time we reached the station it was already too late. The journey needed one change of train. When we got down, the local constable was waiting for us.`,
                `The constable said,<br>"There were shots at Mr Cubitt's house last night. Mr Cubitt is dead, and his wife is badly wounded and has not come round. It looks as though the wife shot her husband and then tried to take her own life."<br>Holmes said,<br>"First I must see whether anybody else was in the room."`,
                `He examined the study. A room the police had already been through several times. Two shots had been fired, but there was a third bullet hole in the window frame. It went from outside inward. <br>"If three shots were fired, there were three people."`,
                `In the flower bed under the window were footprints, and outside the fence lay a cartridge case. The prints were a man's, with thick soles. Holmes picked up the case and put it in his pocket.`,
                `"We must find out where that man is staying. Is there anywhere nearby an American might lodge?"<br>"I hear there is an American at Elrige's farm."`,
                `Holmes began to draw dancing men on a sheet of paper. This time it was Holmes writing in that alphabet. And he gave it to a messenger to take to Elrige's farm.`,
                `"What did you write?"<br>"Very briefly. 'Come here at once.'"`,
                `An hour later there was the sound of a carriage. We sat side by side beside the door and waited. A big man with a sunburned face strode in. He came in without taking off his hat. When he saw us sitting in the room, he stopped.`,
                `Holmes said quietly,<br>"Mr Abe Slaney. You thought Mrs Cubitt had sent for you. How many people in the world can write in that alphabet?"`,
                `The man was seized where he stood. Handcuffs went on his wrists. He was from Chicago. Elsie was the daughter of the boss of a certain gang there, Slaney had been one of the gang, and the dancing men were the alphabet they used among themselves. Elsie had hated that world and crossed to England alone. She had left without telling even her father.`,
                `Slaney said,<br>"I never meant to shoot him. We were talking through the window, and he raised a gun, and so did I."<br>"And his wife?"<br>"Elsie told me to go back. To the very end."`,
                `Elsie Cubitt was ill a long time and barely lived. Afterward, they say, she stayed on her husband's farm and looked after the village people. She never sold the farm, and kept it to the end.`,
                `Holmes said later,<br>"Watson, what if I had dismissed that drawing as a child's game when I first saw it? I should have sat over it three days sooner than I did."`
            ]
        },
        {
            title: 'At the Falls',
            paras: [
                `One evening in April 1891, Holmes walked into my consulting room without warning. His face was pale and the back of his hand was cut. His knuckles were grazed. The first thing he did was close the shutters. He did not go near the window.`,
                `"Have you heard the name Professor Moriarty?"<br>"Never."<br>Holmes said,<br>"Of course you have not. That his name is unknown is his greatest asset. He was a professor of mathematics. At twenty-one he wrote a book that few in Europe could understand. Half the great crimes in London have that man behind them. And he does nothing himself. He plans, he supplies the men, and he takes his share. Not a mark is left on his hands. For three years I have followed that thread inward. Now the net is woven. On Monday he and forty of his gang will be taken together. But this morning, he came to see me."`,
                `Holmes repeated the conversation word for word.<br>"You are cleverer than I expected. Stand aside. If you do not, neither shall I." Moriarty had said.<br>Holmes had answered,<br>"Nor shall I."<br>"Then you will be destroyed."<br>"If I can bring you down, I shall gladly go with you."`,
                `In that one day Holmes nearly died three times. Once in the morning, once at noon and once in the evening. A carriage drove at him, a brick fell from a roof, and a man with a cudgel set on him in an alley.`,
                `"Watson, I mean to leave England for a week. Will you come?"<br>"Gladly."`,
                `The next morning we crossed to the Continent. Each of us had one bag. Holmes changed our route several times and sent our luggage elsewhere. Sometimes we got off the train at a station in the middle of nowhere. But on the third day he found a short item in a newspaper. In London the whole gang had been taken, but one man, the leader, had slipped away.`,
                `Holmes said quietly,<br>"Now there is only one thing left for that man to do."`,
                `We walked the mountain roads of Switzerland. In early May the snow had not yet melted on the Alps, and in the valleys below the spring flowers were out. We met almost nobody on the road. Holmes kept looking back. Even when there was nobody on the road.`,
                `On the fourth of May we stayed in a village called Meiringen. The innkeeper told us we must see the Reichenbach Falls nearby. The most famous spot in the district, he said.`,
                `The falls were a terrible place. Snow-melt poured into a black cleft of rock, and the bottom could not be seen. Spray rose endlessly, and the roar made speech impossible. Without holding the rail you could hardly stand. There was only one path to it, so you had to go back the way you came.`,
                `As we stood before the falls, a boy from the inn handed me a note. An English lady at the inn was gravely ill, it said, and a doctor was needed.`,
                `Holmes said,<br>"I shall stay here a little longer. Go on."`,
                `I walked an hour back to the inn. Being downhill, at least it was quick. But at the inn there was no sick English lady. We two were the only English guests that day. Nobody had written any such note. I ran back the way I had come.`,
                `At the end of the path before the falls, Holmes's stick stood propped against a rock. In the mud ahead of it, two sets of footprints led toward the falls, and none came back. The grass at the edge of the drop was trampled. The marks of two men who had struggled there a long time.`,
                `Under the stick, weighted with a cigarette case, were three sheets of paper. It was a letter Holmes had written to me.`,
                `"My dear Watson. Mr Moriarty has allowed me a few words, so I write this. I do not think it a bad way to end. If I can rid the world of that man, what I have done has paid for itself. I hope you will be well."`,
                `I stood there a long time. There was no sound but the water. After I came back to England, I put his stories in order and gave them to the world. Many times while writing I had to put down my pen. I thought that was the end.`,
                `Three years later, in the spring of 1894, a young man called Ronald Adair was shot dead in a locked room in London. The window was on the second floor, and the door was locked from inside. Nobody had heard a shot. I cut out the article and, by old habit, puzzled over it alone. Each time, I wished that man were beside me.`,
                `One evening in the street I collided with an old bookseller. A bent old man with an armful of books. When I picked up the books he had dropped, he went off grumbling. But a little later that old man came to my consulting room.`,
                `The old man said, with his back bent,<br>"I have come to offer you a few books, sir. They would just fill that gap on your shelf."`,
                `I turned my head toward the shelf, and when I looked back the old man was gone and Sherlock Holmes stood there smiling. For the first time in my life, I fainted. It had never happened even on the battlefield as an army surgeon.`,
                `He handed me water and said,<br>"I am sorry, Watson. I did not mean to go that far."<br>"You are alive. How on earth..."<br>Holmes said,<br>"At the edge of the falls I grappled with Moriarty. He went over, and I remained. And then it came to me. His men were still at large, and if I let them believe I was dead, they would drop their guard. So I climbed the cliff and hid behind a rock. Somebody up there really did roll stones down at me. For three years I wandered Tibet and Persia and France."<br>"Three years, and you did not tell even me?"<br>Holmes was silent a moment.<br>"Because you are a man who cannot lie. Had you known, it would have shown in your writing. For that I am truly sorry."<br>"Is it all over now?"<br>"One man remains. Moriarty's right hand. He is the one who shot young Adair." Holmes picked up his hat.<br>"Watson, are you free tonight? Bring your revolver."`,
                `Three years on, I heard those words again. Bring your revolver. And three years on, I took the revolver out of the drawer.`
            ]
        }
    ],
    afterword: {
        title: 'After Reading',
        paras: [
            `What this book holds is not one long story but several short ones. The Sherlock Holmes stories first appeared that way. They ran in a magazine, one a month, and were collected later.`,
            `The writer was Arthur Conan Doyle of Britain. He was originally a doctor. He opened a practice, and no patients came, so he sat in the empty consulting room and wrote stories. And Holmes came out of that.`,
            `Holmes had a real man behind him: Joseph Bell, a surgeon who taught Doyle when he studied medicine in Edinburgh. That man could tell where a patient came from and what work they did the moment they sat down.`,
            `He told it from their walk, the calluses on their hands, the colour of the mud on their clothes. So what Holmes does is really the way a doctor finds a disease.`,
            `Doyle carried that method over into fiction. When Bell learned of it later, he wrote in a letter that he was not nearly so remarkable as Holmes.`,
            `Holmes first appeared in 1887. But he attracted little notice then. He became famous four years later, when the short stories began to run one after another in a magazine.`,
            `On the day that magazine came out, they say, queues formed at the news-stands. People were waiting for the next story.`,
            `Because one story ended and another began, it did not matter if you started in the middle. That is one reason the Holmes stories are still so widely read.`,
            `What is here is a few of the best-known, chosen and retold. There are fifty-six short Holmes stories and four long ones. Reading them all takes a very long time.`,
            `Now let us pick out some places worth a second look.`,
            `First, think again about the scene where Holmes first meets Watson. Before even a greeting, Holmes asks whether he has come from Afghanistan. He has joined together a sunburned face, white wrists, and a left arm held carefully.`,
            `That is the whole of what these stories do. Joining together small things that nobody else looks at.`,
            `And when Holmes has guessed right like that, he says it is nothing. He has only joined together things anyone could see, like a sunburned face and white wrists.`,
            `Second, look again at the dog that did not bark. That passage is one of the most famous in all detective fiction. What Holmes noticed was not what the dog did, but that it did nothing.`,
            `Had a stranger come in the night, the dog would have barked. It did not bark, so the one who came was no stranger. This passage teaches how to use what is absent as evidence.`,
            `That method is still used in many places. Do not look only at what happened. Count up what should have happened and did not.`,
            `Third, read the Red-Headed League again. A post appears that pays money for doing something utterly useless. It is strange, and the man himself is delighted.`,
            `What Holmes saw was not that the job was strange, but that it kept the man away from his shop. It was done not to put him somewhere, but to keep him from being somewhere.`,
            `Fourth, count the places where Holmes is wrong. Holmes does not always win. In the Bohemian story, Irene Adler gets the better of him. And Holmes is not ashamed of it; he keeps her photograph.`,
            `Watson notes that when Holmes refers to her, he does not use her name but calls her the woman. Holmes spoke of somebody that way only that once.`,
            `There are characters worth a second look as well.`,
            `If you read Watson only as the man standing beside Holmes, you have read half. All these stories are written by Watson. What we know of Holmes, we know through Watson's eyes.`,
            `And Watson is shown as a man who does not follow what Holmes says. That is so that Holmes will explain, and the reader will hear the explanation too. Watson is also the device that keeps the story moving.`,
            `But Watson is no fool. He is a man who went to war as an army surgeon, shoots well, and is not afraid. Wherever there is danger, he goes too.`,
            `Holmes himself is worth a second look. Holmes is a man who cannot bear to be without a case. He lies on the sofa for days, plays the violin all night, and even shoots letters into the wall with a pistol. Doyle drew him as a very strange man.`,
            `Holmes will not even learn what is of no use to him. He did not know the earth goes round the sun, and when Watson tells him, he says he will try to forget it. The mind is a small attic, he says, and only what is needed should go in.`,
            `It helps to know something of the times. These stories are set in London about a hundred and thirty years ago. London then had more than four million people, and was the biggest city in the world.`,
            `And yet in that city there was no way of reading fingerprints, and no way of telling human blood from an animal's. Such things came into real use only after these stories appeared.`,
            `So when Holmes studies the mud on a floor or tobacco ash, that was something quite new in those days. It is said that real police read these stories and learned the methods from them.`,
            `Doyle also took up real cases. He stepped in for two men wrongly imprisoned, re-examined the evidence and wrote about it, and both were freed. One was a solicitor imprisoned for maiming horses, the other a German man who had been made to carry a murder charge.`,
            `That led to the founding in Britain of a court of criminal appeal. Perhaps that, and not the fiction, was the greatest thing Doyle ever did.`,
            `The fog and the gas lamps are the London of that time, just as it was. With hundreds of thousands of coal fires, the city sank into yellow fog every winter. Sometimes you could not see ahead even by day.`,
            `Neither telephones nor motor cars were yet common. What Holmes used in a hurry was the telegram. That was the fastest news of those days.`,
            `The post came several times a day. A letter sent in the morning arrived that evening. That is why Holmes can settle things so quickly by telegram and letter.`,
            `These stories hold on to two things.`,
            `One is that seeing and observing are different. Holmes says it to Watson several times. You saw, but you did not observe. It is like going up and down a staircase every day without knowing how many steps it has.`,
            `The other is that the answer is always in front of you. Everything Holmes finds out is already there in the story. It is not hidden and produced at the end. So when you read again, you see what you missed the first time.`,
            `People usually call Holmes's method deduction. But strictly it is a little different. Holmes chooses the likeliest of several possibilities; he does not prove it is the only one. That is why Holmes is sometimes wrong.`,
            `Later Doyle grew tired of Holmes. He wanted to write other things, and people asked only for Holmes. So he killed Holmes at the falls.`,
            `Then there was uproar. Some people went about in black, and more than twenty thousand cancelled their magazine subscriptions. Ten years later Doyle had to bring Holmes back.`,
            `In bringing him back, Doyle wrote that Holmes had not died but gone into hiding. He even wrote down where Holmes had been all that time. Wandering Tibet and Persia, it says.`,
            `In between, Doyle published several novels without Holmes. They were historical novels, and he treasured them most. Almost nobody reads them today.`,
            `It is common for what a writer treasures and what people read to be different things. Doyle regretted it all his life.`,
            `Today there is a Holmes museum at 221 Baker Street. Letters asking for Holmes's help still come. The museum, they say, writes the replies on his behalf. A man invented a hundred and thirty years ago, and still it goes on.`,
            `If you ever read these stories again, this time try to find the answer before Holmes explains. Everything you need is written down beforehand.`,
            `Lastly, here are some things to think about. I shall not write down the answers.`,
            `Several times Holmes lets a culprit go instead of handing him to the police. Because he judged there was reason enough. May one person decide that?`,
            `There are also several places where Holmes breaks into houses and deceives people. How should we see using a wrong method to do a right thing?`,
            `And what would have become of Holmes without Watson? That question is not easy to answer even when you read the book again as a grown-up.`
        ]
    },
    quiz: [
        { q: 'What did Holmes guess about Watson at first sight?', choices: ['That he had one brother', 'That he had been in Afghanistan', 'That he had worked as a doctor'], answer: 1 },
        { q: 'What did Holmes say his profession was?', choices: ['The only consulting detective in the world', 'A scholar of chemistry', 'An investigator for the London police'], answer: 0 },
        { q: 'What did the King of Bohemia want back?', choices: ['A ring he had given', 'A photograph taken together', 'A bundle of letters'], answer: 1 },
        { q: 'How did Holmes find where the photograph was hidden?', choices: ['He bribed a servant', 'He searched the house secretly at night', 'He made her believe there was a fire'], answer: 2 },
        { q: 'What work did the Red-Headed League give Mr Wilson?', choices: ['Copying out the encyclopaedia', 'Keeping the ledgers every day', 'Keeping the shop open late'], answer: 0 },
        { q: "What did Holmes learn from the assistant's knees?", choices: ['That he had walked a long way', 'That he had hurt his knees', 'That he was digging'], answer: 2 },
        { q: "What were Helen's sister's last words?", choices: ['The whistle', 'The speckled band', 'The iron bar'], answer: 1 },
        { q: 'Why was the bell-rope a dummy?', choices: ['It was a ladder for the snake to climb down', 'It was hung only to decorate the room', 'It was old and had already broken'], answer: 0 },
        { q: 'Where did the blue carbuncle come from?', choices: ["The hat's lining", 'The ashes of the fireplace', "The goose's crop"], answer: 2 },
        { q: 'Why did Holmes let Ryder go?', choices: ['Because Horner had already been released', 'Because he looked like a man who would never do it again', 'Because the evidence was not enough'], answer: 1 },
        { q: 'In the Silver Blaze case, what did Holmes take note of?', choices: ['That the dog did not bark that night', 'That the hoofprints had been wiped out', 'That the stable door had been left open'], answer: 0 },
        { q: 'What did the trainer take out onto the moor?', choices: ['A bottle of sleeping draught for the horse', 'A small surgical knife', 'A leather wallet full of money'], answer: 1 },
        { q: 'What were the dancing men?', choices: ['A cipher standing for letters', "Children's scribbles", 'An old ornament carved on the sundial'], answer: 0 },
        { q: 'Which letter did Holmes look for first when solving the cipher?', choices: ['The one that appeared most often', 'The one drawn largest', 'The one that came first'], answer: 0 },
        { q: 'What sort of man was Professor Moriarty?', choices: ['The richest man in London', "Holmes's old teacher", 'A scholar who planned crimes'], answer: 2 },
        { q: 'Why did Holmes not tell even Watson for three years?', choices: ['For fear Watson would be in danger too', 'Because there was no way to send word', 'Because Watson would not be able to hide it'], answer: 2 },
        { q: 'Which of these is NOT a fair thing to say after reading this book?', wide: true, choices: ['Seeing how Holmes asked about Afghanistan before even saying hello, a sunburned face and a carefully held left arm spoke to him before words did.', 'Seeing how Watson did not know the number of stairs he had climbed for seventeen years, seeing and counting are different things.', 'Seeing the two sets of footprints leading toward the falls, Holmes and Moriarty must have crossed the mountain together by that path.', 'Seeing how Holmes compared the mind to an attic, he lived believing that useless things push out useful ones.'], answer: 2 }
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
    emoji: '🔎',
    art: ['end.webp'],
    paras: [
        `이 책에 실린 것은 한 편의 긴 이야기가 아니라 여러 편의 짧은 이야기입니다. 셜록 홈스 이야기는 원래 그렇게 나왔습니다. 잡지에 한 달에 한 편씩 실린 것을 나중에 묶은 것입니다.`,
        `쓴 사람은 영국의 아서 코넌 도일입니다. 본디 의사였습니다. 병원을 열었는데 환자가 오지 않아서, 빈 진료실에 앉아 이야기를 썼습니다. 그러다 홈스가 나왔습니다.`,
        `홈스에게는 바탕이 된 실제 사람이 있습니다. 도일이 에든버러에서 의학을 배울 때 가르치던 외과 의사 조지프 벨입니다. 그 사람은 환자가 방에 들어와 앉기만 해도 어디서 왔고 무슨 일을 하는지를 알아맞혔습니다.`,
        `걸음걸이, 손의 굳은살, 옷에 묻은 흙빛을 보고 알아낸 것입니다. 그러니 홈스가 하는 일은 사실 의사가 병을 알아내는 방법입니다.`,
        `도일이 그 방법을 소설로 옮긴 것입니다. 벨은 뒤에 그것을 알고, 자기는 홈스만큼 대단하지 않다고 편지에 적었습니다.`,
        `홈스가 처음 나온 것은 1887년입니다. 그런데 그때는 별로 알려지지 않았습니다. 크게 알려진 것은 네 해 뒤부터 잡지에 짧은 이야기가 이어 실리면서입니다.`,
        `그 잡지가 나오는 날이면 가판대 앞에 줄이 섰다고 합니다. 사람들이 다음 이야기를 기다린 것입니다.`,
        `한 편이 끝나면 다음 한 편이 이어졌기 때문에, 중간부터 읽어도 상관이 없었습니다. 홈스 이야기가 지금까지 널리 읽히는 데는 그런 까닭도 있습니다.`,
        `여기 실린 것은 그 가운데 널리 읽히는 몇 편을 골라 옮긴 것입니다. 홈스 이야기는 짧은 것이 쉰여섯 편, 긴 것이 네 편입니다. 다 읽으려면 아주 오래 걸립니다.`,
        `이제 다시 볼 대목을 짚어 봅시다.`,
        `첫째, 홈스가 처음 왓슨을 만나는 장면을 다시 떠올려 보십시오. 홈스는 인사를 하기도 전에 아프가니스탄에서 돌아왔느냐고 묻습니다. 얼굴이 볕에 그은 것, 손목만 흰 것, 왼팔을 조심스럽게 쓰는 것을 이어 붙인 것입니다.`,
        `그것이 이 이야기들이 하는 일의 전부입니다. 아무도 눈여겨보지 않는 작은 것을 이어 붙이는 것입니다.`,
        `그리고 홈스는 그렇게 알아맞히고도 아무것도 아니라고 말합니다. 볕에 탄 얼굴과 흰 손목처럼, 누구 눈에나 보이던 것을 이어 붙였을 뿐이라는 것입니다.`,
        `둘째, 짖지 않은 개를 다시 보십시오. 이 대목은 추리 이야기에서 가장 유명한 자리 가운데 하나입니다. 홈스가 눈여겨본 것은 개가 무엇을 했느냐가 아니라 아무것도 하지 않았다는 것이었습니다.`,
        `밤에 낯선 사람이 왔다면 개가 짖었을 것입니다. 짖지 않았으니 온 사람이 낯선 사람이 아니었던 것입니다. 없는 것을 증거로 삼는 법을 이 대목이 알려 줍니다.`,
        `이 방법은 지금도 여러 자리에서 쓰입니다. 무슨 일이 일어났는지만 보지 말고, 일어났어야 하는데 일어나지 않은 것이 무엇인지도 세어 보라는 것입니다.`,
        `셋째, 빨간 머리 연맹을 다시 읽어 보십시오. 아무 쓸모도 없는 일을 시키면서 돈을 주는 자리가 나옵니다. 이상한 일인데 당사자는 좋아합니다.`,
        `홈스가 본 것은 그 일이 이상하다는 것이 아니라, 그 일이 그 사람을 가게에서 떼어 놓는다는 것이었습니다. 사람을 어디에 있게 하려고 그런 것이 아니라 어디에 없게 하려고 그런 것이었습니다.`,
        `넷째, 홈스가 틀리는 대목도 세어 보십시오. 홈스는 늘 이기지 않습니다. 보헤미아 왕국 이야기에서는 아이린 애들러에게 한 수 집니다. 그리고 홈스는 그것을 부끄러워하지 않고 그 사람의 사진을 간직합니다.`,
        `왓슨은 홈스가 그 사람을 부를 때 이름을 부르지 않고 그 여자라고 부른다고 적어 두었습니다. 홈스가 누군가를 그렇게 부른 것은 그때 한 번뿐입니다.`,
        `인물도 다시 보아야 할 사람이 있습니다.`,
        `왓슨을 그저 옆에 있는 사람으로 읽으면 절반만 읽은 것이 됩니다. 이 이야기들은 다 왓슨이 적은 글입니다. 우리가 홈스를 아는 것은 왓슨의 눈으로 본 것입니다.`,
        `그리고 왓슨은 홈스가 하는 말을 알아듣지 못하는 사람으로 나옵니다. 그래야 홈스가 설명을 하고, 그 설명을 읽는 사람이 함께 듣게 됩니다. 왓슨은 이야기를 굴러가게 하는 장치이기도 합니다.`,
        `그런데 왓슨은 바보가 아닙니다. 군의관으로 전쟁에 나갔다 온 사람이고, 총을 잘 쏘고, 겁이 없습니다. 위험한 자리에는 늘 함께 갑니다.`,
        `홈스도 다시 볼 만합니다. 홈스는 사건이 없으면 견디지 못하는 사람입니다. 며칠씩 소파에 누워 있고, 바이올린을 밤새 켜고, 벽에 총을 쏘아 글자를 새기기도 합니다. 도일은 그 사람을 아주 이상한 사람으로 그려 놓았습니다.`,
        `홈스는 자기에게 쓸모없는 것은 아예 알려고 하지 않습니다. 지구가 해를 돈다는 것도 몰랐다가, 왓슨에게 듣고는 잊어버리겠다고 합니다. 머릿속은 좁은 다락이라 쓸 것만 넣어야 한다는 것입니다.`,
        `그 시절 사정도 알아 두면 좋습니다. 이 이야기들의 배경은 백삼십 년쯤 전 런던입니다. 그때 런던에는 사람이 사백만 명 넘게 살았고, 세계에서 제일 큰 도시였습니다.`,
        `그런데 그 도시에 지문을 보는 법도 없었고, 피가 사람 것인지 짐승 것인지 가리는 법도 없었습니다. 그런 것이 실제로 쓰이게 된 것은 이 이야기들이 나온 뒤입니다.`,
        `그러니 홈스가 바닥의 흙과 담뱃재를 들여다보는 것은 그 시절에는 아주 새로운 일이었습니다. 실제 경찰이 이 소설을 읽고 그 방법을 배웠다는 이야기도 있습니다.`,
        `도일은 실제 사건에도 나섰습니다. 억울하게 갇힌 사람 둘을 위해 나서서 증거를 다시 살피고 글을 썼고, 두 사람 다 풀려났습니다. 한 사람은 말을 다치게 했다는 죄로 갇혔던 변호사였고, 다른 하나는 살인 죄를 뒤집어쓴 독일 사람이었습니다.`,
        `그 일이 계기가 되어 영국에 형사 사건을 다시 살피는 항소 법원이 생겼습니다. 소설이 아니라 그 일이 도일이 한 일 가운데 제일 큰 것인지도 모릅니다.`,
        `안개와 가스등도 그 시절 런던 그대로입니다. 석탄을 때는 집이 몇십만 채라 겨울이면 도시가 누런 안개에 잠겼습니다. 낮에도 앞이 안 보일 때가 있었습니다.`,
        `전화도 자동차도 아직 흔하지 않았습니다. 홈스가 급할 때 쓰는 것은 전보였습니다. 그것이 그 시절 제일 빠른 소식이었습니다.`,
        `우편은 하루에 여러 번 왔습니다. 아침에 부친 편지가 그날 저녁에 닿았습니다. 홈스가 전보와 편지로 그렇게 빨리 일을 처리하는 것이 그래서 가능합니다.`,
        `이 이야기들이 붙들고 있는 것은 두 가지입니다.`,
        `하나는 보는 것과 눈여겨보는 것이 다르다는 것입니다. 홈스는 왓슨에게 몇 번이나 그 말을 합니다. 보기만 하고 눈여겨보지 않는다고요. 계단을 날마다 오르내리면서 계단이 몇 개인지 모르는 것과 같습니다.`,
        `다른 하나는 답이 늘 앞에 있다는 것입니다. 홈스가 알아낸 것은 다 이야기 안에 이미 나온 것들입니다. 숨겨 두었다가 마지막에 꺼내는 것이 아닙니다. 그래서 다시 읽으면 처음에 놓친 것이 보입니다.`,
        `홈스가 쓰는 방법을 사람들은 흔히 추리라고 부릅니다. 그런데 정확히는 조금 다릅니다. 홈스는 여러 갈래 가운데 제일 그럴듯한 것을 고르는 것이지, 반드시 그것뿐이라고 밝히는 것이 아닙니다. 그래서 홈스도 이따금 틀립니다.`,
        `도일은 나중에 홈스가 지겨워졌습니다. 다른 글을 쓰고 싶은데 사람들이 홈스만 찾았기 때문입니다. 그래서 폭포에서 홈스를 죽였습니다.`,
        `그러자 난리가 났습니다. 검은 옷을 입고 다니는 사람이 생겼고, 잡지 구독을 끊는 사람이 이만 명이 넘었습니다. 도일은 열 해 뒤에 홈스를 되살려야 했습니다.`,
        `되살리면서 도일은 홈스가 죽지 않고 몸을 숨기고 있었다고 적었습니다. 그동안 어디에 있었는지도 적어 두었습니다. 티베트와 페르시아를 돌아다녔다고 합니다.`,
        `그 사이에 도일은 홈스가 나오지 않는 소설을 여러 권 냈습니다. 역사 소설이었고, 본인은 그것을 제일 아꼈습니다. 그런데 지금 읽는 사람이 거의 없습니다.`,
        `쓴 사람이 아끼는 것과 사람들이 읽는 것이 다른 일은 흔합니다. 도일은 그것을 평생 아쉬워했습니다.`,
        `지금 베이커가 이백이십일 번지에는 홈스 박물관이 있습니다. 홈스에게 도움을 청하는 편지가 지금도 옵니다. 박물관에서 답장을 대신 써 준다고 합니다. 백삼십 년 전에 지어낸 사람인데 아직도 그렇습니다.`,
        `언젠가 이 이야기들을 다시 읽게 되거든, 이번에는 홈스가 설명하기 전에 먼저 답을 맞혀 보십시오. 필요한 것은 다 앞에 적혀 있습니다.`,
        `마지막으로 생각해 볼 것을 남겨 둡니다. 답은 적어 두지 않겠습니다.`,
        `홈스는 몇 번인가 범인을 경찰에 넘기지 않고 그냥 보냅니다. 그럴 만한 사정이 있다고 여겼기 때문입니다. 사람 하나가 그것을 정해도 되는 것일까요?`,
        `홈스가 남의 집에 몰래 들어가고 남을 속이는 대목도 여러 번 나옵니다. 옳은 일을 하려고 그른 방법을 쓰는 것을 어떻게 보아야 할까요?`,
        `그리고 왓슨이 없었다면 홈스는 어떻게 되었을까요. 이 물음은 어른이 되어 다시 읽어도 답하기가 쉽지 않습니다.`
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
    title: `명탐정 셜록 홈스`,
    tag: `아서 코넌 도일 원작`,
    intro: [
        `백여 년 전 런던의 베이커가 221B에 셜록 홈스라는 사람이 살았습니다. 경찰이 손을 든 사건이 마지막으로 찾아오는 곳이었습니다.`,
        `이 책에는 그의 곁에서 함께 지낸 왓슨 박사가 적어 둔 사건 일곱 편이 실려 있습니다.`
    ]
};

function coverPage() {
    const cv = CV();
    return `<div class="page page-cover">
 <div class="story-page-left story-page-left-full">
 ${artFrame('cover.webp', '🔍')}
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
    { q: "홈스가 왓슨을 처음 보고 알아맞힌 것은 무엇입니까?", choices: ["형이 하나 있다는 것", "아프가니스탄에 있었다는 것", "의사로 일해 왔다는 것"], answer: 1 },
    { q: "홈스가 스스로 밝힌 자기 직업은 무엇입니까?", choices: ["세상에 하나뿐인 자문 탐정", "화학을 연구하는 학자", "런던 경찰청의 조사관"], answer: 0 },
    { q: "보헤미아 왕이 되찾으려 한 것은 무엇입니까?", choices: ["선물한 반지 하나", "함께 찍은 사진 한 장", "주고받은 편지 뭉치"], answer: 1 },
    { q: "홈스가 사진이 숨겨진 곳을 알아낸 방법은 무엇입니까?", choices: ["하인을 돈으로 사 두었다", "집을 밤에 몰래 뒤졌다", "불이 났다고 속여 보았다"], answer: 2 },
    { q: "빨간 머리 연맹이 윌슨 씨에게 시킨 일은 무엇입니까?", choices: ["백과사전을 베껴 쓰는 일", "장부를 날마다 정리하는 일", "가게 문을 늦게까지 여는 일"], answer: 0 },
    { q: "점원의 무릎을 보고 홈스가 알아낸 것은 무엇입니까?", choices: ["먼 길을 걸었다는 것", "무릎을 다쳤다는 것", "땅을 파고 있다는 것"], answer: 2 },
    { q: "헬렌의 언니가 남긴 마지막 말은 무엇입니까?", choices: ["휘파람", "얼룩 끈", "쇠막대"], answer: 1 },
    { q: "종줄이 가짜였던 까닭은 무엇입니까?", choices: ["뱀이 타고 내려오는 길이라서", "방을 꾸미려고 달아 둔 것이라서", "오래되어 이미 끊겼기 때문에"], answer: 0 },
    { q: "푸른 보석은 어디에서 나왔습니까?", choices: ["모자 안감", "벽난로 재 속", "거위 배 속"], answer: 2 },
    { q: "홈스가 라이더를 놓아준 까닭은 무엇입니까?", choices: ["호너가 이미 풀려났기 때문에", "다시는 안 할 사람으로 보여서", "증거가 넉넉하지 않아서"], answer: 1 },
    { q: "실버 블레이즈 사건에서 홈스가 눈여겨본 것은 무엇입니까?", choices: ["그날 밤 개가 짖지 않은 것", "말발굽 자국이 지워진 것", "마구간 문이 열려 있던 것"], answer: 0 },
    { q: "조련사가 벌판에 들고 나간 것은 무엇입니까?", choices: ["말을 재우는 약병", "수술에 쓰는 작은 칼", "돈이 든 가죽 지갑"], answer: 1 },
    { q: "춤추는 인형은 무엇이었습니까?", choices: ["글자를 대신한 암호", "아이들이 그린 낙서", "해시계에 새긴 옛 장식"], answer: 0 },
    { q: "홈스가 암호를 풀 때 가장 먼저 찾은 글자는 무엇입니까?", choices: ["가장 자주 나오는 글자", "가장 크게 그린 글자", "맨 앞에 오는 글자"], answer: 0 },
    { q: "모리아티 교수는 어떤 사람이었습니까?", choices: ["런던에서 제일 큰 부자", "홈스를 가르친 옛 스승", "범죄를 계획해 주는 학자"], answer: 2 },
    { q: "홈스가 세 해 동안 왓슨에게도 알리지 않은 까닭은 무엇입니까?", choices: ["왓슨까지 위험해질까 봐서", "연락할 방법이 없었기 때문에", "왓슨이 숨기지 못할 것 같아서"], answer: 2 },
    { q: "이 책을 읽고 난 반응으로 알맞지 않은 것은 무엇인가요?", wide: true, choices: ["홈스가 인사도 하기 전에 아프가니스탄에서 돌아왔느냐고 물은 것을 보면, 볕에 탄 얼굴과 조심스럽게 쓰는 왼팔이 홈스에게는 말보다 먼저였어.", "왓슨이 열일곱 해를 오르내린 계단이 몇 개인지 몰랐던 것을 보면, 보는 것과 세는 것은 다른 일이네.", "폭포 쪽으로 난 두 사람 몫의 발자국을 보면, 홈스와 모리아티는 그 길로 함께 산을 넘어간 거야.", "홈스가 사람의 머리를 다락방에 빗댄 것을 보면, 쓸데없는 걸 넣으면 쓸 것이 밀려난다고 믿고 산 사람이구나."], answer: 2 }
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
