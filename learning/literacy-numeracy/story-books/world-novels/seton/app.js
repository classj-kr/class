const BOOK_TITLE = "시튼 동물기";

const CHAPTER_LABEL = () => '';

const CHAPTERS = [
    {
        num: 1,
        title: "늑대 왕 로보",
        emoji: "🐺",
        art: ["story-01-a.webp", "story-01-b.webp"],
        paras: [
            `미국 뉴멕시코에 쿠럼포라는 목장 지대가 있습니다. 쿠럼포는 강 이름에서 온 말입니다. 그 강을 따라 목장이 늘어서 있었습니다. 풀이 넓게 자라고 소를 많이 치는 곳입니다. 소가 수만 마리씩 풀을 뜯었습니다. 울타리가 없는 들판이었습니다. 소들은 여름 내내 그 안에서 저희끼리 지냈습니다.`,
            `1890년대에 그 지방에는 늑대 무리가 하나 있었습니다. 다섯 마리뿐이었는데, 그 다섯이 다섯 해 동안 소를 이천 마리 넘게 잡았습니다. 한 해에 사백 마리 꼴이었습니다. 소 한 마리가 그 시절 스무 달러쯤 했습니다. 다섯 해 동안 사만 달러어치를 잡은 셈입니다.`,
            `그 무리의 우두머리를 사람들은 로보라고 불렀습니다. 늙은 수컷이었고, 보통 늑대보다 몸집이 훨씬 컸습니다. 앞발 자국이 어른 손바닥만 했습니다. 보통 늑대는 몸무게가 사십 킬로그램쯤입니다. 로보는 그보다 훨씬 무거웠습니다. 보통 늑대 발자국의 두 배였습니다. 발자국이 아주 커서 그것만 보고도 로보인 줄 알았습니다. 목장 사람들은 그 자국을 보고 아침을 시작했습니다. 밤새 어디를 지나갔는지 알 수 있었기 때문입니다.`,
            `로보에게는 여러 가지가 알려져 있었습니다. 첫째, 로보는 독을 절대 먹지 않았습니다. 사람들이 고기에 독을 넣어 놓으면, 로보는 그것을 파내어 한데 모아 놓고 그 위에 표시를 하고 갔습니다. 그렇게 하고 간 자리를 시튼은 여러 번 보았습니다. 독을 넣은 고기 네 덩이가 한자리에 모여 있었습니다. 그 위에 흙과 검불이 덮여 있었습니다. 사람이 한 것처럼 가지런했습니다. 먹지 않겠다는 표시였습니다. 사람들은 그것을 놀림으로 받아들였습니다.`,
            `둘째, 로보는 덫을 알아보았습니다. 사람들이 덫을 놓으면 그 자리를 피해 갔습니다. 덫에 사람 냄새가 남아 있으면 그 자리를 멀찍이 돌아갔습니다. 쇠붙이 냄새도 알아챘습니다. 그래서 덫을 여러 날 흙에 묻어 두었다가 쓰기도 했습니다. 그래서 사냥꾼들은 덫을 피에 삶고 나서 놓았습니다. 그래도 로보는 알아챘습니다. 덫을 놓은 자리를 흙으로 덮고 그 위에 검불까지 뿌렸습니다. 그런데도 그 자리만 골라 피해 갔습니다.`,
            `셋째, 로보는 죽은 짐승을 먹지 않았습니다. 병들어 죽은 소가 널려 있어도 건드리지 않았습니다. 늑대는 대개 죽은 것을 먹습니다. 그것이 힘이 덜 들기 때문입니다. 자기가 잡은 것만 먹었습니다. 병든 고기에는 독을 넣기가 쉽습니다. 로보는 그것을 알고 있었던 것입니다.`,
            `그 지방 목장 주인들이 로보의 머리에 상금을 걸었습니다. 천 달러였습니다. 그 시절 큰돈이었습니다. 말 한 필이 스무 달러 하던 때였습니다. 목장 일꾼의 한 달 삯이 삼십 달러쯤이었습니다. 그러니 천 달러는 여러 해 치 삯이었습니다. 그 돈이면 작은 목장 하나를 살 수도 있었습니다. 목장 주인들이 돈을 모아 걸었습니다. 늑대 한 마리에 그런 돈이 걸린 적이 없었습니다. 사냥꾼들이 몰려왔습니다. 그런데 아무도 잡지 못했습니다. 두 달을 버티다 돌아가는 사람이 여럿이었습니다. 총 한 번 쏴 보지 못한 사람도 있었습니다.`,
            `1894년, 이 글을 쓰는 시튼이 그 지방에 갔습니다. 시튼은 그때 서른 몇 살이었고, 덫을 놓는 데 자신이 있었습니다. 그때까지 놓친 짐승이 별로 없었습니다. 그래서 넉 달이면 될 줄 알았습니다. 시튼은 넉 달 동안 온갖 방법을 다 썼습니다. 그동안 로보는 소를 계속 잡았습니다. 시튼이 온 뒤로 오히려 더 잡았습니다. 쫓기는 짐승이 더 많이 잡는 일은 흔치 않습니다. 시튼은 그것이 무슨 뜻인지 알 것 같았습니다.`,
            `독을 여섯 가지로 바꿔 가며 놓았습니다. 냄새가 저마다 다른 것으로 골라 놓았습니다. 고기를 다루는 손에 장갑을 끼고, 그 장갑을 소 피에 담갔습니다. 그렇게까지 했는데도 그랬습니다. 로보는 다 파냈습니다. 덫을 백서른 개 놓았습니다. 로보는 다 피했습니다. 백서른 개를 놓는 데 여러 날이 걸렸습니다. 하나도 건드려지지 않았습니다. 덫을 걷어 낼 때 시튼은 아무 말도 하지 않았습니다. 다시 놓을 자리도 남아 있지 않았습니다.`,
            `한번은 좁은 길목에 덫을 넉 줄로 늘어놓았습니다. 이튿날 가 보니 로보가 그 길로 들어와서, 덫이 없는 자리만 골라 밟고 지나갔습니다. 그리고 그 끝에서 덫을 하나 파내어 뒤집어 놓고 갔습니다. 덫이 하늘을 보고 놓여 있었습니다. 발로 뒤집을 수 있는 것이 아니었습니다. 코로 밀어 젖힌 자국이 남아 있었습니다. 시튼은 그날 하루 종일 아무 말도 하지 않았다고 적었습니다. 놀림을 받은 것 같았다고도 적었습니다. 그리고 그날부터 다른 방법을 찾기 시작했습니다.`,
            `시튼은 그해 여름에 이런 것을 알아냈습니다. 로보의 무리에 흰 늑대가 하나 있었습니다. 발자국이 작고 걸음이 가벼웠습니다. 무리 가운데 제일 작았습니다. 그리고 늘 로보 곁에 붙어 다녔습니다. 털빛이 눈처럼 희었습니다. 흰 늑대는 아주 드뭅니다. 그래서 그 무리 가운데 그것만은 멀리서도 알아볼 수 있었습니다.`,
            `사람들은 그것을 블랑카라고 불렀습니다. 그리고 로보가 그 늑대와 늘 함께 다닌다는 것을 알았습니다. 블랑카는 로보만큼 조심스럽지 않았습니다. 덫 자리에 가까이 가는 일이 있었습니다. 로보가 소리를 내어 부르면 그제야 물러섰습니다. 그것을 시튼이 여러 번 보았습니다. 시튼은 그것을 이용하기로 했습니다. 로보를 잡을 수 없으면 로보가 아끼는 것을 잡는 것입니다. 그것이 그 넉 달 끝에 찾아낸 방법이었습니다.`,
            `그 방법이 어떤 것이었는지 시튼은 나중에 아주 자세히 적었습니다. 자기가 한 일을 감추지 않으려고 그렇게 적은 것입니다. 읽는 사람이 자기를 좋게 볼 리 없다는 것도 알고 있었습니다. 그래도 그대로 적었습니다. 자기가 한 일을 좋게 꾸미지 않은 것입니다. 그 대목이 이 책에서 제일 무겁습니다.`,
            `여기서부터가 제일 아픈 일이었습니다. 시튼은 블랑카를 먼저 덫으로 잡았습니다. 그리고 그 몸을 끌고 다니면서 그 냄새를 온 들판에 묻혔습니다. 말 뒤에 매달고 몇 리를 끌었습니다. 그 자국이 들판을 가로질러 남았습니다. 바람이 부는 쪽까지 헤아려서 끌었습니다. 냄새가 멀리 퍼지게 한 것입니다.`,
            `그 냄새를 따라가면 덫이 있게 해 놓은 것입니다. 로보는 그 뒤로 이틀 동안 그 자리를 맴돌며 울었습니다. 낮에도 울었습니다. 여태 낮에 소리를 낸 적이 없는 짐승이었습니다. 그 소리를 목장 사람들이 다 들었습니다. 이틀 밤 내내 이어졌습니다. 밤에 그 소리가 나면 목장의 개들이 다 숨었습니다. 사람들도 잠을 못 잤습니다. 상금을 건 목장 주인들까지 그랬습니다. 잡히기를 바라던 사람들이었습니다.`,
            `한 사람은 나중에 이렇게 말했습니다.<br>"짐승이 그렇게 우는 것은 처음 들었습니다."<br>그 말을 한 사람은 평생 목장에서 일한 이였습니다. 늑대 소리는 수없이 들어 본 사람이었습니다.`,
            `그리고 로보는 그 냄새를 따라갔습니다. 그동안 그렇게 조심하던 짐승이, 그날은 덫을 살피지 않았습니다. 냄새만 따라 곧장 걸어갔습니다. 덫이 넉 줄로 놓인 자리였습니다. 여태 그런 자리는 백 걸음 밖에서 돌아가던 짐승이었습니다. 이틀 뒤 아침, 시튼은 덫에 걸린 로보를 발견했습니다.`,
            `네 발이 다 걸려 있었습니다. 덫 넷을 한꺼번에 밟은 것이었습니다. 그러고도 그 자리에서 버티고 있었습니다. 로보는 시튼을 보고 일어섰습니다. 기운이 다 빠졌는데도 서 있었습니다. 그리고 짖지 않았습니다. 으르렁거리지도 않았습니다. 시튼을 똑바로 보고만 있었습니다.`,
            `시튼은 그 자리에서 로보를 쏘지 못했습니다. 대신 목에 줄을 걸어 목장으로 데려갔습니다. 쏘려고 총을 들었다가 내렸습니다. 왜 그랬는지는 자기도 모르겠다고 적었습니다. 그리고 마당에 매어 두고 고기와 물을 주었습니다. 제일 좋은 고기를 잘라다 놓았습니다. 물그릇도 코앞에 놓아 주었습니다. 아무도 가까이 가지 못하게 했습니다.`,
            `로보는 그것을 먹지 않았습니다. 그리고 고개를 한 번도 돌리지 않았습니다. 사람이 다가가도 눈을 돌리지 않았습니다. 들판 쪽만 보고 있었습니다. 사람들이 이틀을 두고 보았지만 물 한 모금 마시지 않았습니다. 목장 일꾼들이 번갈아 와서 들여다보았습니다. 그러다 나중에는 아무도 오지 않았습니다.`,
            `사흘째 되는 날 아침, 로보는 그 자리에서 세상을 떠나 있었습니다. 상처는 없었습니다. 줄이 끊긴 것도 아니었습니다. 목걸이가 그대로 매여 있었습니다. 머리가 들판 쪽을 향해 있었습니다. 마지막까지 그쪽을 보고 있었던 것입니다.`,
            `사람들은 그 몸을 블랑카 옆에 놓아 주었습니다. 누가 그러자고 한 것도 아니었습니다. 목장 사람들이 저희끼리 그렇게 했습니다. 시튼은 그 뒤로 다시는 늑대를 잡지 않았습니다. 그리고 평생 야생 동물을 지키는 일을 했습니다. 넉 달 동안 쫓은 짐승 하나가 사람 하나를 바꾼 것입니다. 이 책은 그 일에서 시작합니다.`
        ]
    },
    {
        num: 2,
        title: "은점박이",
        emoji: "🐦‍⬛",
        art: ["story-02-a.webp", "story-02-b.webp"],
        paras: [
            `캐나다 토론토 가까이에 소나무 골짜기가 있었습니다. 그곳에서 해마다 겨울이면 까마귀 이백 마리가 함께 잤습니다. 까마귀는 겨울에 그렇게 한데 모여 잡니다. 여럿이 모이면 밤에 부엉이를 막기 쉽기 때문입니다. 누구 하나가 깨면 다 깨기 때문입니다. 이백 마리가 한 골짜기의 나무에 나눠 앉았습니다. 해가 지기 전에 다 모였습니다.`,
            `그 무리의 우두머리는 늙은 수컷이었습니다. 턱 아래에 은빛 반점이 하나 있어서, 시튼은 그것을 은점박이라고 불렀습니다. 시튼은 다섯 해 동안 그 무리를 지켜보았습니다. 그리고 까마귀에 대해 이런 것들을 알아냈습니다. 그때까지 아무도 적어 놓지 않은 것들이었습니다. 까마귀는 흔한 새라 눈여겨보는 사람이 없었습니다. 흔한 것은 오히려 덜 알려집니다.`,
            `첫째, 까마귀는 말을 씁니다. 소리가 스무 가지가 넘었습니다. 사람 귀에는 다 같은 까악 소리로 들립니다. 짧게 두 번은 안전, 길게 세 번은 사람, 아주 날카롭게 하나는 총이었습니다. 시튼이 총을 들고 나가면 그 소리가 났고, 총 없이 나가면 나지 않았습니다. 시튼은 그 소리를 하나하나 공책에 적어 두었습니다. 언제 어느 소리가 났고 그때 무슨 일이 있었는지를 함께 적었습니다. 다섯 해 치가 쌓이니 뜻이 드러났습니다.`,
            `둘째, 무리에 규율이 있었습니다. 아침에 골짜기를 나설 때 순서가 있었습니다. 은점박이가 맨 앞에 섰습니다. 뒤따르는 차례도 늘 같았습니다. 어린 것들은 가운데에 넣었습니다. 그리고 먹이를 찾으러 갈 때 늘 보초를 세웠습니다. 보초를 서는 까마귀는 먹지 않고 높은 데 앉아 있었습니다. 그러다 교대를 했습니다. 교대하는 차례까지 정해져 있었습니다. 제 차례가 되면 먹던 것을 두고 올라갔습니다. 미루는 것이 없었습니다. 보초가 소리를 내면 이백 마리가 한꺼번에 날아올랐습니다. 하늘이 검게 뒤덮였습니다. 한 마리도 뒤처지지 않았습니다. 소리 한 번에 그렇게 되었습니다.`,
            `셋째, 은점박이는 훈련을 시켰습니다. 여름이면 그해에 태어난 어린 까마귀들을 데리고 다니면서 하나씩 가르쳤습니다.`,
            `허수아비 앞에 데려가서 그것이 사람이 아니라는 것을 보여 주고, 총을 든 사람 앞에는 못 가게 했습니다. 긴 막대를 든 사람 앞에서도 그렇게 했습니다. 총과 막대를 구별하지 못하기 때문입니다. 그러니 둘 다 피하게 가르친 것입니다. 가르치는 일이 여름 내내 이어졌습니다. 시튼은 그것을 여러 번 보았습니다. 한 해에 나는 새끼가 서너 마리씩이었습니다. 그 어린 것들을 데리고 같은 자리를 몇 번씩 돌았습니다.`,
            `한번은 이런 일이 있었습니다. 시튼이 소나무 뒤에 숨어 있었는데 은점박이가 그것을 못 보고 지나갔습니다. 그런데 오십 걸음쯤 가서 갑자기 돌아섰습니다. 무언가가 걸렸던 것입니다. 시튼은 숨을 죽이고 있었습니다.`,
            `그리고 그 나무를 한 바퀴 돌아 시튼을 확인했습니다. 그러고 나서 경고 소리를 냈습니다. 무리가 그 소리에 다 흩어졌습니다. 무언가 이상하다고 느끼면 반드시 돌아와 확인하는 것이었습니다. 그냥 지나치는 법이 없었습니다. 그것이 스무 해를 산 까닭이었습니다.`,
            `은점박이는 아주 늙었습니다. 날개 깃이 닳아 있었고, 부리에 흠이 많았습니다. 은빛 반점도 예전만큼 또렷하지 않았습니다. 시튼은 그 나이를 스무 살이 넘었을 것으로 보았습니다. 그렇게 오래 사는 까마귀는 드뭅니다. 대개 그 절반도 못 삽니다. 겨울마다 여럿이 죽습니다. 그 겨울을 스무 번 넘긴 것입니다.`,
            `어느 해 봄, 은점박이가 무리와 함께 오지 않았습니다. 시튼은 여러 날 그 골짜기를 뒤졌습니다. 나무 밑을 하나하나 살폈습니다. 무리가 돌아온 자리를 여러 번 세어 보았습니다. 한 마리가 비어 있었습니다. 그리고 언덕 아래에서 그 몸을 찾아냈습니다.`,
            `부엉이에게 당한 것이었습니다. 부엉이는 까마귀의 오랜 적입니다. 밤에는 부엉이 쪽이 훨씬 잘 봅니다. 낮에는 그 반대입니다. 그래서 까마귀는 낮에 부엉이를 보면 떼로 몰려가 쫓습니다. 밤에는 그러지 못합니다. 늙어서 밤에 눈이 어두워진 것이 아닐까 하고 시튼은 적었습니다. 평생 조심하던 새였습니다. 그 조심으로도 안 되는 것이 나이였습니다.`,
            `그 뒤로 그 무리에는 다른 우두머리가 생겼습니다. 그런데 그 뒤로 여러 해 동안, 그 무리는 예전만큼 하지 못했습니다. 보초 서는 차례가 흐트러졌습니다. 사람 앞으로 곧장 날아드는 어린 것도 생겼습니다.`,
            `시튼은 그 대목에 이렇게 적었습니다.<br>"우리는 짐승이 그저 본능으로 산다고 배웠다. 그런데 저 무리가 잘하던 것들은 은점박이가 죽자 함께 사라졌다."<br>"그것이 본능이라면 사라질 리가 없다. 저것은 가르쳐서 이어지던 것이었다."<br>이 한 줄이 그 시절에는 아주 낯선 말이었습니다. 짐승이 서로 가르친다는 말이었기 때문입니다.`
        ]
    },
    {
        num: 3,
        title: "솜꼬리토끼 랙",
        emoji: "🐇",
        art: ["story-03-a.webp", "story-03-b.webp"],
        paras: [
            `올리팬트 늪에 솜꼬리토끼가 살았습니다. 솜꼬리토끼는 꼬리 안쪽이 하얗습니다. 달아날 때 그 하얀 것이 깜빡깜빡 보입니다. 덤불 사이에서 그것만 보였다 사라졌다 합니다. 뒤쫓는 짐승은 그것을 보고 방향을 잡습니다. 그래서 솜꼬리라는 이름이 붙었습니다. 그 하얀 것이 뒤쫓는 짐승의 눈길을 끕니다. 그래서 오히려 방향을 속이기 좋습니다.`,
            `어미 이름은 몰리, 새끼 이름은 랙이었습니다. 시튼이 그 늪을 여러 해 드나들며 지켜본 것입니다. 그 늪은 시튼의 집에서 걸어갈 수 있는 거리였습니다. 랙은 아주 어릴 때 뱀에게 귀를 물려 찢어졌습니다. 그래서 그런 이름이 붙었습니다. 랙은 찢어진 귀라는 뜻입니다. 그 귀는 끝까지 아물지 않았습니다. 그래서 시튼은 랙을 멀리서도 알아보았습니다. 토끼는 서로 아주 비슷하게 생겼습니다. 그 귀가 아니었으면 가려낼 수 없었습니다.`,
            `몰리는 랙에게 여러 가지를 가르쳤습니다. 토끼가 배워야 할 것은 아주 많았습니다. 그것을 다 배워야 한 해를 넘길 수 있었습니다. 토끼는 쫓기는 짐승입니다. 잡는 재주가 아니라 안 잡히는 재주를 익혀야 합니다. 그 늪에는 토끼를 노리는 것이 여럿이었습니다. 매와 뱀과 여우와 족제비와 개가 있었습니다.`,
            `첫째, 위험할 때는 뛰지 말고 얼어붙어야 합니다. 토끼는 털빛이 풀빛과 비슷해서, 가만히 있으면 잘 보이지 않습니다. 바로 옆을 지나가도 못 봅니다. 뛰면 그때 눈에 띕니다. 토끼가 죽는 까닭 가운데 제일 많은 것이 놀라서 뛰는 것입니다. 가만히 있으면 넘어갈 일이 그렇게 됩니다. 매는 움직이는 것만 봅니다. 매의 눈은 아주 좋지만 멈춘 것은 놓칩니다. 그러니 얼어붙는 것이 제일 나은 수입니다.`,
            `랙은 이것을 익히는 데 제일 오래 걸렸습니다. 무서우면 다리가 저절로 움직였기 때문입니다. 몸이 먼저 움직이는 것을 참기는 어렵습니다. 그것을 참는 데 여러 달이 걸렸습니다. 몰리가 옆에서 여러 번 눌러 주었습니다. 앞발로 등을 눌러 못 뛰게 했습니다. 그것을 여러 달 되풀이했습니다.`,
            `둘째, 굴 근처에서는 절대 곧장 굴로 들어가지 않습니다. 한 바퀴 돌아서, 뛰어서 건너뛰어 들어갑니다. 두 길이 넘게 건너뛰기도 합니다. 뛰기 전에 한 번 멈춰 서서 거리를 잽니다. 잘못 뛰면 발자국이 이어져 버립니다. 발자국이 굴 앞에서 끊기게 하는 것입니다. 쫓아오던 짐승은 그 자리에서 냄새를 잃습니다. 그리고 굴을 못 찾고 돌아갑니다. 발자국이 끊긴 자리에서 개는 한참 맴돕니다. 그 사이에 토끼는 굴 안에 들어가 있습니다. 굴은 하나만 파지 않습니다. 나가는 구멍을 따로 둡니다.`,
            `셋째, 개에게 쫓기면 물로 갑니다. 물에 들어가면 냄새가 끊깁니다. 개는 물가에서 냄새를 놓치고 맙니다. 물을 건너면 냄새가 이어지지 않기 때문입니다. 그래서 물가는 토끼에게 좋은 자리입니다. 다만 물에 들어가면 몸이 무거워집니다. 그래서 급할 때만 씁니다.`,
            `넷째, 가시덤불로 들어갑니다. 토끼는 낮게 지나갈 수 있지만 큰 짐승은 못 들어옵니다. 랙이 사는 늪 가운데에도 아주 두꺼운 찔레 덤불이 하나 있었습니다. 가시가 손가락만 했습니다. 토끼는 그 밑으로 난 길을 다닙니다. 몸을 낮추면 가시에 닿지 않습니다. 랙은 그 덤불에 난 길을 다 외웠습니다. 어디서 몸을 낮춰야 하는지까지 알았습니다.`,
            `랙은 이것을 하나씩 배웠습니다. 그리고 여러 번 죽을 뻔했습니다. 한 번 겪을 때마다 하나를 배웠습니다. 배우지 못하면 다음은 없었습니다. 한배에서 난 새끼가 여럿이었습니다. 그 가운데 랙만 남았습니다.`,
            `한번은 뱀에게 붙잡혔습니다. 그때 몰리가 달려와 앞발로 뱀의 머리를 밟고 물어뜯어 구했습니다. 뱀은 이미 랙의 뒷다리를 물고 있었습니다. 몰리는 망설이지 않았습니다. 토끼가 뱀에게 덤비는 일은 흔치 않습니다. 몰리도 그때 물릴 뻔했습니다. 새끼가 아니었으면 하지 않았을 일입니다. 한번은 매에게 쫓겼습니다. 그때 덤불로 들어가 살았습니다. 매가 덤불 위를 여러 번 돌았습니다. 랙은 그 안에서 반나절을 있었습니다.`,
            `한번은 사냥개에게 쫓겼습니다. 그때 몰리가 한 일이 참으로 놀라웠습니다. 몰리는 개가 랙을 쫓는 것을 보고, 일부러 개 앞으로 나갔습니다. 덤불 밖으로 몸을 다 드러냈습니다. 개가 랙의 냄새를 잡은 참이었습니다. 몰리는 그 사이로 뛰어들었습니다. 그리고 개가 자기를 쫓게 만들었습니다. 일부러 발소리를 크게 냈습니다. 개가 랙 쪽으로 가지 못하게 한 것입니다. 그러려면 자기가 더 눈에 띄어야 했습니다.`,
            `그러고는 늪 쪽으로 달렸습니다. 곧장 달리지 않고 몇 번 방향을 틀었습니다. 개가 놓치지 않을 만큼만 앞서 갔습니다. 그 늪 한가운데에는 깊은 물이 있었습니다. 토끼는 헤엄을 잘 치지 않습니다. 그런데 몰리는 칠 줄 알았습니다. 그 늪에서 나고 자랐기 때문입니다. 어디가 깊고 어디가 얕은지도 알았습니다. 어느 자리로 들어가야 건너편에 닿는지를 알았습니다. 그것도 여러 해 다니며 익힌 것이었습니다. 몰리는 그 물을 헤엄쳐 건넜습니다.`,
            `개는 그러지 못했습니다. 그 개는 그날 그 늪에서 나오지 못했습니다. 물이 생각보다 깊었습니다. 개는 물가까지는 잘 왔습니다. 그런데 그 가운데를 몰랐습니다. 몰리는 건너편 풀숲에서 그것을 보고 있었습니다. 그러고는 돌아왔습니다.`,
            `랙은 그것을 보고 자랐습니다. 한 해가 지나자 랙은 그 늪에서 제일 빠른 토끼가 되었습니다. 다른 토끼들이 랙을 따라다니게 되었습니다. 랙이 가는 길이 안전했기 때문입니다. 그리고 그 늪을 손금 보듯 알았습니다. 어느 굴에 뱀이 사는지, 어느 자리에 발이 빠지는지, 어느 덤불이 제일 두꺼운지. 눈을 감고도 다닐 수 있었습니다. 어미가 데리고 다니며 하나씩 짚어 준 것이었습니다. 그것이 한 해가 걸렸습니다.`,
            `몰리는 그해 겨울에 세상을 떠났습니다. 누가 놓은 총에 맞은 것이었습니다. 겨울에는 덤불에 잎이 없어 몸이 드러납니다. 그래서 겨울에 토끼가 제일 많이 죽습니다. 랙을 쫓던 총이었습니다. 몰리가 랙 앞으로 나갔던 것입니다. 사냥개 때 한 것과 똑같이 한 것입니다. 그때는 살아 돌아왔고 그때는 그러지 못했습니다.`,
            `랙은 그 늪에서 오래 살았습니다. 그 뒤로도 시튼은 그 찢어진 귀를 여러 해 보았습니다. 랙은 어미가 가르친 것을 하나도 잊지 않았습니다. 시튼은 랙의 이야기 끝에 이렇게 적었습니다.<br>"토끼가 오래 사는 것은 빠르기 때문이 아니다. 아는 것이 많기 때문이다."<br>"그리고 그 아는 것은 다 어미에게서 온 것이다."<br>빠르기는 타고나지만 아는 것은 그렇지 않습니다. 시튼이 두고두고 하고 싶었던 말이 그것입니다.`
        ]
    },
    {
        num: 4,
        title: "스프링필드의 여우",
        emoji: "🦊",
        art: ["story-04-a.webp", "story-04-b.webp"],
        paras: [
            `이 이야기는 시튼이 소년 때 겪은 일입니다. 열몇 살 무렵의 일이라고 했습니다. 그 무렵 마을에서 닭이 자꾸 없어졌습니다. 닭장 문이 멀쩡한데 안이 비어 있었습니다. 사람들은 여우 짓이라고 했습니다. 한 집에서 하루에 세 마리가 없어진 적도 있었습니다. 밤에 지켜도 소용이 없었습니다. 사람이 조는 사이에 일이 났습니다.`,
            `시튼과 몇 사람이 그 여우 굴을 찾아냈습니다. 언덕 비탈의 모래 굴이었습니다. 굴 입구가 어른 머리만 했습니다. 굴 앞에 뼈와 깃털이 흩어져 있었습니다. 그것을 보고 찾아낸 것입니다. 그 앞에 새끼 네 마리가 놀고 있었습니다. 서로 물고 뒹굴며 놀았습니다. 새끼들은 사람을 보고도 달아나지 않았습니다. 아직 사람이 무엇인지 몰랐던 것입니다.`,
            `시튼은 여러 날 그 굴을 지켜보았습니다. 그리고 어미 여우가 하는 것을 다 보았습니다. 어미는 밤에 나가 먹이를 물어 왔습니다. 돌아오는 시각이 늘 비슷했습니다. 해가 지고 두 시간쯤 뒤였습니다. 시튼은 그것을 날짜별로 적어 두었습니다.`,
            `그리고 새끼들에게 사냥을 가르쳤습니다. 살아 있는 쥐를 물어다 놓아주고 잡게 하는 식이었습니다. 새끼들이 우르르 달려들었습니다. 새끼가 놓치면 어미가 다시 잡아다 놓아주었습니다. 그것을 여러 번 되풀이했습니다. 처음에는 다친 쥐를 가져왔습니다. 나중에는 성한 쥐를 가져왔습니다.`,
            `한번은 어미가 새끼 하나를 발로 밀어 냈습니다. 그 새끼가 굴 밖으로 너무 멀리 나갔기 때문입니다. 여우는 새끼를 그렇게 가르쳤습니다. 굴에서 멀어지면 매에게 채입니다. 어미는 그것을 몸으로 일렀습니다.`,
            `그런데 마을 사람들이 그 굴을 파기로 했습니다. 사람들이 삽을 들고 갔습니다. 굴을 파는 데 어른 여럿이 반나절을 매달렸습니다. 굴이 언덕 속으로 깊이 뻗어 있었습니다. 갈래가 여럿이었습니다. 어디로 이어지는지 파 보고서야 알았습니다.`,
            `그날 새끼 셋이 죽고 하나가 살아남았습니다. 제일 작은 새끼였습니다. 살아남은 새끼를 사람들이 데려와 마당의 기둥에 사슬로 매어 두었습니다. 목에 쇠고리를 채웠습니다. 시튼은 그것을 보고 마음이 좋지 않았습니다. 그런데 어른들이 하는 일이라 말리지 못했습니다. 시튼은 그때 아이였습니다. 삽을 들고 함께 갔던 것도 사실입니다. 시튼은 그것도 감추지 않고 적었습니다.`,
            `그날 밤부터 이상한 일이 일어났습니다. 어미 여우가 밤마다 그 마당에 왔습니다. 발소리도 내지 않고 들어왔습니다. 울타리 밑으로 난 좁은 틈을 지나왔습니다. 그 틈에 털이 조금씩 걸려 있었습니다. 그리고 새끼에게 먹이를 물어다 주었습니다.`,
            `닭이나 쥐를 물어 왔습니다. 어떤 밤에는 두 번도 왔습니다. 새벽에 한 번 더 오는 날도 있었습니다. 개가 있고 사람이 있는 마당이었습니다. 그런데도 왔습니다. 여우에게 사람 사는 마당은 죽으러 들어가는 자리입니다. 그것을 밤마다 했습니다.`,
            `여우가 사람 사는 마당에 밤마다 들어오는 것은 있을 수 없는 일이었습니다. 시튼은 밤에 창가에 앉아 그것을 보았습니다. 불을 켜지 않고 앉아 있었습니다. 여러 밤을 그렇게 지켰습니다.`,
            `어미는 사슬을 물어뜯으려고 했습니다. 이빨이 부러질 때까지 물었습니다. 사슬에 이빨 자국이 남았습니다. 그래도 끊어지지 않았습니다. 어미는 그것을 여러 밤 되풀이했습니다. 쇠사슬이었습니다. 이빨로 될 일이 아니었습니다. 그래도 어미는 밤마다 다시 물었습니다.`,
            `그렇게 여러 밤이 지났습니다. 새끼는 그동안 사슬에 목이 쓸려 털이 벗겨져 있었습니다. 낮에는 기둥 둘레를 돌기만 했습니다. 사람이 다가가면 몸을 웅크렸습니다.`,
            `그리고 어느 날 아침, 새끼가 죽어 있었습니다. 상처는 없었습니다. 그 옆에 먹이가 놓여 있었습니다. 닭 다리 하나였습니다. 독이 있는 미끼였습니다.`,
            `사람들이 여우를 잡으려고 마을 여기저기에 놓아둔 것이었습니다. 그 미끼는 여우에게 잘 알려진 것이었습니다. 어미가 그것을 몰랐을 리 없습니다. 냄새만 맡아도 아는 것이었습니다. 어미는 그 미끼를 여러 번 피해 다녔습니다. 그 미끼가 놓인 자리를 다 알고 있었습니다. 그런데 어미가 그것을 물어다 준 것입니다.`,
            `시튼은 그것이 실수인지 아닌지를 오래 생각했습니다. 그리고 이 이야기 끝에 이렇게만 적었습니다.<br>"나는 그 뒤로 그 여우를 다시 보지 못했다."<br>"그리고 나는 그 마당의 기둥을 지날 때마다 걸음이 빨라진다."`
        ]
    },
    {
        num: 5,
        title: "내 개 빙고",
        emoji: "🐶",
        art: ["story-05-a.webp", "story-05-b.webp"],
        paras: [
            `이것은 시튼이 캐나다에서 농장 일을 할 때의 이야기입니다. 그 무렵 시튼은 스물 몇 살이었고, 그림을 그려 팔면서 농장 일을 도왔습니다. 이웃집에서 강아지를 하나 얻었습니다. 한배에서 난 새끼 가운데 제일 작은 것이었습니다. 검은 개였고, 이름을 빙고라고 지었습니다. 귀가 서고 다리가 긴 개였습니다. 제일 작은 새끼라 아무도 데려가지 않던 것이었습니다. 시튼이 그것을 골랐습니다.`,
            `빙고는 자라면서 이상한 개가 되었습니다. 집에 붙어 있지 않았습니다. 낮에는 어디로 갔는지 알 수 없었고, 저녁이면 돌아왔습니다. 며칠씩 안 오는 때도 있었습니다. 그리고 사람 곁에 오래 있지 않았습니다. 개는 사람 곁에 있으려고 하는 짐승인데 빙고는 그러지 않았습니다. 먹이를 주면 먹고는 나가 버렸습니다. 붙잡아 두려고 하면 더 나갔습니다.`,
            `쓰다듬으면 잠깐 있다가 슬쩍 빠져나갔습니다. 안기는 것을 싫어했습니다. 이름을 부르면 귀만 움직이고 오지는 않았습니다. 그래도 빙고는 시튼을 알아보았습니다. 아주 멀리서도 알아보았습니다. 들판 저쪽에서 걸어오는 것만 보고 알았습니다. 걸음걸이로 아는 것이었습니다. 다른 사람이 오면 그러지 않았습니다.`,
            `빙고에게는 한 가지 재주가 있었습니다. 소를 모는 것이었습니다. 누가 가르친 적이 없는데 아주 잘했습니다. 어느 소가 어느 우리 것인지도 알았습니다. 저녁에 소가 안 들어오면 빙고 혼자 나가서 몰고 왔습니다. 아무도 시키지 않았는데 그렇게 했습니다. 소를 몰 때만은 사람 곁에 붙었습니다. 그 일이 끝나면 또 사라졌습니다.`,
            `시튼은 나중에 그 농장을 떠났습니다. 빙고는 다른 사람에게 맡겨졌습니다. 그 농장에서 빙고를 대신할 것은 없었습니다. 소를 모는 개를 새로 들였는데 그만큼 하지 못했습니다. 사람이 따라나서야 했습니다.`,
            `여러 해가 지났습니다. 어느 겨울, 시튼이 그 지방에 다시 갔습니다. 늑대를 잡으려고 덫을 여러 개 놓아둔 참이었습니다. 그런데 밤에 덫을 살피러 가다가 시튼 자신이 덫에 걸렸습니다. 어둠 속에서 발밑을 못 본 것입니다. 눈이 덮여 있어서 덫 자리가 보이지 않았습니다. 제 손으로 놓은 덫이었습니다.`,
            `손이 걸렸습니다. 그리고 다른 손으로 그것을 벌리려다가 그 손마저 다른 덫에 걸렸습니다. 두 손이 다 묶인 것이었습니다. 소리를 질러도 들을 사람이 없었습니다. 늑대 덫은 사람 힘으로는 잘 벌어지지 않습니다. 용수철이 아주 셌습니다. 두 손을 다 써야 겨우 벌어지는 것이었습니다. 그 두 손이 다 걸려 있었습니다.`,
            `영하 이십 도가 넘는 밤이었습니다. 그리고 아무도 그가 어디 있는지 몰랐습니다. 시튼은 그 자리에서 여러 시간을 보냈습니다. 손이 얼기 시작했습니다. 그런 밤에 손이 얼면 손을 잘라 내야 합니다. 시튼은 그림으로 먹고사는 사람이었습니다. 손을 잃으면 다 잃는 것이었습니다.`,
            `그때 어둠 속에서 무언가가 다가왔습니다. 늑대인 줄 알았습니다. 그런데 개였습니다. 빙고였습니다.`,
            `빙고는 여러 해 동안 그 지방을 돌아다니고 있었던 것입니다. 여러 해 만에 만난 것인데도 알아보았습니다. 빙고는 시튼 곁에 와서 앉았습니다. 그리고 밤새 그 옆에 있었습니다. 몸을 붙이고 앉아 있었습니다. 늑대가 다가오면 짖어서 쫓았습니다. 그날 밤 늑대가 여러 번 왔습니다. 눈 위에 발자국이 여러 줄 남아 있었습니다. 아침에 그것을 세어 보았습니다.`,
            `아침에 사람들이 시튼을 찾아냈습니다. 빙고가 그 자리에서 계속 짖고 있었기 때문입니다. 그 소리를 듣고 찾아온 것이었습니다. 아침까지 그 자리를 뜨지 않았습니다. 목이 다 쉬어 있었습니다. 밤새 짖은 것이었습니다.`,
            `시튼은 손을 잃지 않았습니다. 손가락 두 개가 오래 저렸다고만 적었습니다. 그 밤 이야기를 시튼은 아주 짧게 적었습니다. 길게 적을 수 있는 일이 아니었습니다.`,
            `그 뒤로 빙고는 또 사라졌습니다. 그리고 몇 해 뒤에 세상을 떠났습니다. 독이 든 미끼를 먹은 것이었습니다. 늑대를 잡으려고 놓아둔 것이었습니다. 시튼이 젊을 때 하던 일이 그것이었습니다. 그 미끼가 개에게 갔습니다.`,
            `죽기 전에 빙고는 예전에 살던 그 농장 문 앞까지 걸어갔습니다. 먼 데서부터 걸어온 것이었습니다. 그리고 그 자리에서 발견되었습니다. 들어가려고 문을 긁은 자국이 있었습니다. 그 집에는 이미 다른 사람이 살고 있었습니다.`,
            `시튼은 이렇게 적었습니다.<br>"나는 빙고를 길들이지 못했다. 그런데 빙고는 나를 잊지 않았다."`
        ]
    },
    {
        num: 6,
        title: "회색곰 왑",
        emoji: "🐻",
        art: ["story-06-a.webp", "story-06-b.webp"],
        paras: [
            `미국 서부 산악 지대에 회색곰이 살았습니다. 회색곰은 북아메리카에서 제일 큰 짐승 가운데 하나입니다. 다 자라면 몸무게가 사람 다섯 몫이 넘습니다. 일어서면 키가 사람 키의 두 배가 됩니다. 앞발 한 번에 소의 목이 부러집니다. 사람이 맞설 수 있는 짐승이 아닙니다.`,
            `왑은 새끼 넷 가운데 하나였습니다. 왑이 아주 어릴 때, 사냥꾼이 그 굴을 찾아냈습니다. 그날 어미와 형제 셋이 죽었습니다. 왑만 덤불 속에 숨어 살아남았습니다. 사냥꾼들이 그것을 못 보고 갔습니다. 덤불이 아주 빽빽했습니다. 왑은 그 안에서 소리를 내지 않았습니다.`,
            `왑은 그때 젖도 못 뗀 새끼였습니다. 그런 새끼가 혼자 살아남는 일은 거의 없습니다. 열에 아홉은 그 겨울을 못 넘깁니다. 젖을 뗀 뒤에도 두 해는 어미와 지냅니다. 그동안 배울 것이 그만큼 많기 때문입니다.`,
            `왑은 혼자 자랐습니다. 가르쳐 주는 것이 없어서 다 스스로 알아내야 했습니다. 무엇을 먹어도 되는지, 벌집을 어떻게 여는지, 겨울을 어떻게 나는지. 먹으면 안 되는 것을 먹고 앓기도 했습니다. 어미가 있는 새끼는 두 해 동안 그것을 배웁니다. 왑은 그것을 혼자 알아냈습니다. 알아내는 동안 여러 번 죽을 뻔했습니다.`,
            `그리고 여러 번 크게 다쳤습니다. 호저의 가시가 앞발에 박혀 여러 달을 절었습니다. 발을 땅에 딛지 못했습니다. 호저의 가시는 끝이 낚싯바늘처럼 되어 있어서 한번 박히면 빠지지 않습니다. 오히려 살 속으로 더 깊이 파고듭니다. 곰이 호저를 건드리는 것은 대개 어릴 때입니다. 한 번 겪으면 다시 건드리지 않습니다. 그 발이 낫고 나서도 왼쪽 앞발 자국이 남달라서, 사람들은 그것으로 왑을 알아보았습니다. 왼쪽 앞발이 조금 안쪽으로 틀어져 있었습니다. 그 자국이 진흙에 또렷하게 남았습니다.`,
            `그런데 왑은 살아남았습니다. 그리고 아주 크게 자랐습니다. 왑은 그 골짜기에서 제일 센 짐승이 되었습니다. 어깨 높이가 사람 가슴께까지 왔습니다. 다른 곰도, 늑대도, 퓨마도 그를 피했습니다. 왑이 지나가면 다 자리를 비켰습니다. 싸울 일도 없어졌습니다. 나타나기만 하면 되었습니다.`,
            `왑에게는 자기 땅이 있었습니다. 그 땅은 골짜기 하나만 한 넓이였습니다. 그 둘레의 나무에 발톱 자국을 내어 표시했습니다. 나무껍질이 허옇게 벗겨졌습니다. 그 표시를 해마다 다시 냈습니다. 나무에 자국이 여러 겹으로 남았습니다.`,
            `곰은 나무에 서서 될 수 있는 한 높이 발톱 자국을 냅니다. 다른 곰이 와서 그 높이를 보고 물러가기 때문입니다. 왑의 자국은 아주 높았습니다. 손이 닿는 데까지 힘껏 뻗어서 냅니다. 그러니 그 자국이 몸집을 말해 줍니다.`,
            `그렇게 여러 해가 지났습니다. 왑이 늙었습니다. 이빨이 닳고 발이 아팠습니다. 호저 가시가 박혔던 자리가 겨울마다 쑤셨습니다. 젊을 때 다친 데가 늙어서 돌아옵니다.`,
            `그리고 어느 해, 젊은 곰이 그 골짜기에 들어왔습니다. 왑은 그 곰과 싸워 쫓아냈습니다. 그런데 이기고 나서 여러 날을 앓았습니다. 굴에서 나오지 못했습니다. 늙은 짐승은 이겨도 손해입니다. 몸이 낫는 데 걸리는 시간이 다르기 때문입니다. 젊은 곰은 며칠이면 일어납니다. 늙은 곰은 몇 주가 걸립니다.`,
            `그다음 해에 또 젊은 곰이 왔습니다. 그리고 그해에는 왑이 이기지 못했습니다.`,
            `왑은 자기 골짜기에서 밀려났습니다. 평생 지켜 온 땅이었습니다. 그리고 산속을 헤맸습니다. 제 땅을 잃은 곰이 갈 데는 없습니다. 어느 골짜기에나 이미 임자가 있기 때문입니다. 들어가면 또 싸워야 합니다. 이제는 이길 수 없는 싸움이었습니다.`,
            `그 산에는 '죽음의 골짜기'라고 불리는 곳이 있었습니다. 땅에서 이상한 기체가 새어 나오는 곳이었습니다. 그 안에 들어간 짐승은 나오지 못했습니다. 골짜기 바닥에 뼈가 널려 있었습니다. 땅에서 새어 나오는 기체가 바닥에 고입니다. 바람이 없는 날에는 더 짙어집니다.`,
            `왑은 그 골짜기 앞까지 갔습니다. 그리고 한참 서 있었습니다. 왑은 그 골짜기가 무엇인지 알고 있었습니다. 그 앞에서 평생 발길을 돌렸기 때문입니다. 그날은 돌리지 않았습니다. 한참을 서 있다가 안으로 걸어 들어갔습니다. 걸음이 흔들리지 않았습니다.`,
            `시튼은 그날 일을 이렇게 적었습니다.<br>"내가 저 곰의 마음을 안다고 말할 수는 없다. 그런데 나는 그날 그 골짜기 입구에 남은 발자국을 보았고, 그 발자국은 한 번도 뒤로 돌아오지 않았다."`
        ]
    },
    {
        num: 7,
        title: "붉은 목의 뇌조",
        emoji: "🌲",
        art: ["story-07-a.webp", "story-07-b.webp"],
        paras: [
            `캐나다 돈 강 골짜기에 뇌조가 살았습니다. 뇌조는 꿩과 비슷한 새입니다. 땅에서 지내는 새라 나무 위보다 낙엽 위에 있는 때가 많습니다. 낙엽 빛깔과 깃 빛깔이 거의 같습니다. 가만히 있으면 바로 앞을 지나가도 못 봅니다. 그것이 이 새가 살아남는 방법입니다.`,
            `봄이면 수컷 뇌조는 통나무 위에 올라가 날개를 칩니다. 가슴을 부풀리고 꼬리를 활짝 폅니다. 아주 빨리 쳐서 북소리 같은 소리를 냅니다. 그 소리는 아주 멀리까지 갑니다. 골짜기 건너편에서도 들립니다. 사람 귀에는 북을 두드리는 소리로 들립니다. 처음에는 느리다가 점점 빨라집니다. 그 소리로 암컷을 부르는 것입니다. 봄이면 골짜기가 그 소리로 찹니다. 아침과 저녁에 제일 자주 칩니다.`,
            `목에 붉은 깃이 도드라진 수컷이 있어서, 시튼은 그것을 붉은 목이라고 불렀습니다. 붉은 목은 그 골짜기에서 제일 좋은 통나무를 차지하고 있었습니다. 그 통나무를 두고 다른 수컷과 여러 번 싸웠습니다. 좋은 통나무가 있어야 짝을 만나기 때문입니다. 소리가 멀리 가는 자리가 좋은 통나무입니다. 골이 지고 울림이 좋은 자리입니다.`,
            `그해 봄 붉은 목은 짝을 만났습니다. 암컷은 낙엽 속에 둥지를 짓고 알을 열두 개 낳았습니다. 낙엽을 긁어모아 오목하게 판 자리였습니다. 둥지라고 할 것도 없었습니다. 그런데 그 자리를 찾아내기가 아주 어려웠습니다.`,
            `새끼가 나온 날 시튼이 그것을 보았습니다. 막 알에서 나온 새끼가 벌써 걸었습니다. 어미를 따라 낙엽 사이를 종종거렸습니다. 알에서 나온 지 몇 시간 만이었습니다. 솜털이 아직 젖어 있었습니다. 뇌조 새끼는 나오자마자 걷습니다. 둥지에 오래 있으면 도리어 위험하기 때문입니다.`,
            `그리고 어미가 소리를 내자 그 자리에서 다 얼어붙었습니다. 낙엽 위에 있으니 하나도 보이지 않았습니다. 어미가 다시 소리를 내자 다시 움직였습니다. 그 소리는 사람 귀에 거의 들리지 않을 만큼 낮았습니다. 시튼도 몸을 숙이고서야 들었습니다. 멀리 가지 않는 소리를 일부러 내는 것입니다. 멀리 가면 적도 듣기 때문입니다.`,
            `한번은 여우가 다가왔습니다. 어미가 여우 앞으로 나가서 날개가 부러진 척했습니다. 땅에 끌면서 절뚝거렸습니다. 정말로 다친 것처럼 보였습니다. 여우는 그것을 쫓아갔습니다. 다 잡았다고 여긴 것입니다. 어미는 그 사이에 새끼들과 점점 멀어졌습니다. 그것이 이 새가 쓰는 오래된 수법입니다.`,
            `어미는 잡힐 듯 말 듯한 거리를 지켰습니다. 너무 멀면 여우가 쫓지 않기 때문입니다. 충분히 멀어지자 어미가 날아올랐습니다. 여우는 빈 자리에 남았습니다. 새끼들이 있던 데로는 돌아가지 못했습니다.`,
            `그해 여름, 새끼들이 하나씩 줄었습니다. 매가 하나 물어 갔습니다. 하늘에서 곧장 내리꽂혔습니다. 족제비가 둘을 잡았습니다. 사람이 놓은 덫에 셋이 걸렸습니다. 그 덫은 뇌조를 잡으려던 것이 아니었습니다. 토끼를 잡으려고 놓은 것이었습니다. 그래도 걸렸습니다. 놓은 사람도 그럴 줄 몰랐습니다. 덫은 무엇이 걸리는지 가리지 않습니다.`,
            `가을이 되자 넷이 남았습니다. 그 넷은 다 자란 새만큼 컸습니다. 열둘 가운데 넷이면 그해에는 많이 남은 편이었습니다. 대개는 둘이 남거나 하나도 안 남습니다. 어미가 잘한 것이었습니다.`,
            `겨울에 눈이 왔습니다. 뇌조는 눈 속에서 잡니다. 눈에 구멍을 파고 들어가면 그 안이 따뜻합니다. 눈 속이 바깥보다 이십 도쯤 따뜻합니다. 눈이 이불 노릇을 하는 것입니다. 저녁에 날다가 그대로 눈 속에 박힙니다. 발자국이 남지 않으니 적도 못 찾습니다.`,
            `그런데 그해 겨울에는 비가 왔다가 얼었습니다. 그런 겨울이 몇십 해에 한 번 옵니다. 눈 위에 얼음이 두껍게 덮인 것입니다. 밤에 눈 속에 들어간 새들이 아침에 나오지 못했습니다. 얼음이 손가락 굵기로 덮여 있었습니다. 아래에서는 부리로 깰 수가 없습니다. 그 안에서 그대로 갇힙니다.`,
            `붉은 목은 발톱으로 얼음을 깨고 나왔습니다. 부리가 다 깨졌습니다. 발톱이 부러진 자리도 있었습니다. 그러고도 나온 것입니다. 그런데 그해 봄까지 살아남은 것은 붉은 목 하나였습니다.`,
            `그리고 그해 겨울 끝에 붉은 목도 덫에 걸렸습니다. 사람이 놓은 올가미였습니다. 얼음을 뚫고 나온 새였습니다. 그런데 철사 한 가닥에 걸렸습니다.`,
            `시튼은 이 이야기를 이렇게 맺었습니다.`,
            `"이 골짜기에는 그해에 뇌조가 백 마리 넘게 있었다. 봄이 되었을 때 남은 것은 없었다."<br>"우리는 이런 새를 두고 흔하다고 말한다. 흔하다는 것은 많이 죽어도 된다는 뜻이 아니다."<br>이 한 줄 때문에 이 이야기가 오래 읽힙니다. 그 시절에는 그렇게 말하는 사람이 드물었습니다.`
        ]
    },
    {
        num: 8,
        title: "시튼이라는 사람",
        emoji: "✏️",
        art: ["story-08-a.webp", "story-08-b.webp"],
        paras: [
            `어니스트 톰프슨 시튼은 1860년 영국에서 태어났습니다. 영국 북쪽의 항구 도시였습니다. 아버지는 배를 여러 척 가지고 있었습니다. 아이가 열넷인 집의 여덟째였습니다. 가운데에 낀 아이였습니다. 그러니 눈에 띄는 일도 별로 없었습니다. 형들이 아버지의 눈길을 다 받았습니다. 시튼은 혼자 밖으로 돌았습니다. 여섯 살 때 가족이 캐나다로 옮겨 갔습니다. 아버지가 하던 일이 기울어서 옮겨 간 것이었습니다. 배를 타고 여러 주일을 갔습니다. 캐나다에서는 숲을 개간해 농사를 지었습니다. 아이들도 다 일을 거들었습니다. 나무를 베고 그루터기를 파냈습니다. 시튼은 그 일을 하면서 숲을 알게 되었습니다.`,
            `아버지는 아주 엄한 사람이었습니다. 열넷이나 되는 아이를 그 사람은 회초리로 다스렸습니다. 집 안에서 웃는 소리가 나면 안 되었습니다. 아버지 앞에서는 아무도 먼저 말하지 않았습니다. 그런 집이었습니다. 아이들이 아버지 발소리를 알아들었습니다. 발소리가 나면 하던 것을 감췄습니다. 시튼도 그림을 감추었습니다.`,
            `시튼이 스물한 살이 되던 날, 아버지가 청구서를 하나 내밀었다고 합니다. 태어나서 스물한 살까지 먹이고 입힌 값이었습니다. 그 돈은 오백삼십칠 달러였습니다. 그 시절 그 돈이면 집 한 채를 살 수 있었습니다. 스물한 살짜리가 갚을 돈이 아니었습니다. 그런데 시튼은 그것을 따지지 않았습니다. 갚겠다고만 하고 나왔습니다. 시튼은 그 돈을 다 갚았습니다. 그리고 다시는 아버지를 만나지 않았습니다. 갚는 데 여러 해가 걸렸습니다. 갚고 나서 그 종이를 태웠다고 합니다. 그 이야기를 시튼은 늙어서야 적었습니다. 오래 꺼내지 못한 이야기였습니다. 평생 그 이야기를 남에게 하지 않았습니다. 마지막에 쓴 책에 한 번 적었습니다.`,
            `시튼은 어릴 때 숲에서 지냈습니다. 짐승을 보고 그림을 그리고, 본 것을 공책에 적었습니다. 아버지가 그림 그리는 것을 못마땅해했기 때문에 숨어서 그렸습니다. 헛간이나 숲에서 그렸습니다. 종이가 없으면 나무껍질에도 그렸습니다. 새를 보려고 나무 위에서 반나절씩 있었습니다. 그러다 저녁에 야단을 맞았습니다. 일을 안 하고 새를 보고 있었기 때문입니다. 그래도 이튿날 또 나갔습니다.`,
            `그 공책이 나중에 이 책들이 되었습니다. 시튼은 공책을 평생 오십 권 넘게 썼습니다. 날짜와 날씨와 시각이 늘 앞에 적혀 있었습니다. 본 것과 짐작한 것을 따로 적었습니다. 짐작한 것에는 표를 해 두었습니다. 나중에 그것이 맞았는지 다시 적었습니다. 짐승의 발자국을 실제 크기로 그려 놓은 쪽이 많습니다. 발자국은 자로 재어 적었습니다. 앞발과 뒷발을 따로 그렸습니다. 지금도 그 그림으로 발자국을 가려낼 수 있습니다. 그만큼 정확하게 그렸습니다. 발자국은 짐승이 남기는 유일한 글씨입니다. 시튼은 그것을 읽는 법을 아이들에게 가르쳤습니다.`,
            `젊을 때 시튼은 사냥꾼이었습니다. 늑대와 곰을 잡아 상금을 받는 일을 했습니다. 그것이 그 시절 서부에서 돈을 버는 방법 가운데 하나였습니다. 늑대와 곰은 목장의 골칫거리였습니다. 잡아 오면 나라와 목장에서 돈을 주었습니다. 늑대 한 마리에 얼마씩 값이 매겨져 있었습니다. 귀를 잘라 가면 값을 쳐 주었습니다. 잡은 짐승의 값을 받아 살았으니, 그 무렵의 시튼은 이 책에 나오는 사냥꾼들과 다르지 않았습니다. 그것을 부끄러워하며 감추지 않았습니다. 오히려 여러 번 적어 두었습니다.`,
            `그러다 로보를 잡은 뒤로 달라졌습니다. 로보를 잡는 데 넉 달이 걸렸고, 그 넉 달 동안 시튼은 그 짐승을 아주 잘 알게 되었습니다. 어디를 지나고 무엇을 피하는지 다 알게 되었습니다. 그것을 알아야 덫을 놓을 수 있었기 때문입니다. 그리고 알고 나니 잡을 수가 없어졌습니다. 덫을 어디에 놓을지 알려면 그 짐승을 알아야 합니다. 알면 알수록 잡기가 어려워졌습니다. 그 짐승이 무엇을 조심하고 무엇을 아끼는지 다 알게 되었기 때문입니다. 그러면 남처럼 보이지 않습니다. 시튼은 그것을 로보에게서 배웠습니다. 넉 달 만에 사람이 그렇게 바뀔 수 있습니다.`,
            `시튼은 그 뒤로 야생 동물을 지키는 일에 평생을 썼습니다. 그리고 아이들에게 숲을 가르치는 단체를 만들었습니다. 그 단체의 이름은 우드크래프트 인디언스였습니다. 그 단체가 나중에 보이스카우트가 되는 데 큰 몫을 했습니다. 처음에는 마을 아이 몇으로 시작한 모임이었습니다. 그것이 여러 나라로 퍼졌습니다. 지금 세계 곳곳에 있는 그 모임의 뿌리가 거기 있습니다. 시튼의 이름은 거기서 잘 이야기되지 않습니다.`,
            `아이들을 숲으로 데려가 불 피우는 법과 발자국 읽는 법을 가르쳤습니다. 천막 치는 법과 별 보는 법도 가르쳤습니다. 그 지방에 살던 원주민에게 배운 것들이었습니다. 시튼은 그 단체에 등수를 두지 않았습니다. 아이들끼리 견주게 하고 싶지 않았기 때문입니다. 잘한 아이에게 깃털을 주었습니다. 남보다 잘한 것이 아니라 어제보다 잘한 것에 주었습니다. 그러니 누구나 받을 수 있었습니다. 다만 아무것도 안 하면 못 받았습니다. 등수를 매기면 꼴찌가 생깁니다. 시튼은 그 아이가 어떻게 되는지 알고 있었습니다.`,
            `시튼의 이야기에는 한 가지 규칙이 있습니다. 주인공이 대개 마지막에 죽습니다. 로보도, 은점박이도, 왑도, 붉은 목도 그렇습니다. 살아서 끝나는 것은 솜꼬리토끼 랙 하나뿐입니다. 그 랙도 어미를 잃습니다. 좋게 끝나는 이야기가 하나도 없는 셈입니다. 그런데도 이 책은 백 해 넘게 읽히고 있습니다. 슬프게 끝난다고 안 읽히는 것은 아닙니다. 오히려 그 끝 때문에 남습니다. 잊히지 않기 때문입니다.`,
            `사람들이 그것을 두고 시튼을 여러 번 나무랐습니다. 아이들이 읽는 책인데 왜 그렇게 쓰느냐는 것이었습니다. 아이들이 울면서 읽는다는 편지도 왔습니다. 그래도 고치지 않았습니다. 그때마다 시튼은 물러서지 않았습니다. 출판사에서도 고치자고 한 적이 있었습니다. 시튼은 그것을 받아들이지 않았습니다. 고치면 더 팔릴 것이라는 말도 들었습니다. 그래도 그대로 두었습니다.`,
            `시튼은 이렇게 대답했습니다.<br>"야생 동물의 삶은 언제나 끝이 좋지 않다. 그것이 사실이다."<br>"내가 그것을 바꿔 쓰면, 읽는 사람은 저 짐승들이 잘 지내고 있다고 생각할 것이다."<br>"그러면 아무도 저들을 지키려고 하지 않을 것이다."<br>슬프게 쓰려고 그렇게 쓴 것이 아니었습니다. 사실이 그랬기 때문에 그렇게 쓴 것입니다. 그리고 그 사실을 바꾸려고 평생을 썼습니다. 국립 공원을 만드는 일에도 힘을 보탰습니다. 짐승이 살 자리를 남겨 두자는 것이었습니다. 글로는 사실대로 쓰고, 몸으로는 그것을 바꾸려 한 것입니다.`,
            `한번은 이름난 학자가 시튼의 글을 두고 지어낸 이야기라고 했습니다. 시튼은 그 자리에서 자기 공책을 내놓았습니다. 날짜와 자리와 잰 것이 다 적혀 있었습니다. 발자국 그림과 날씨까지 있었습니다. 그 학자는 더 말하지 못했습니다. 그 무렵에는 짐승 이야기를 지어내는 사람이 많았습니다. 그래서 그런 말이 나온 것입니다. 당시 미국 대통령까지 나서서 그 논쟁에 끼어들었습니다. 시튼의 편에 선 사람도 여럿이었습니다.`,
            `시튼의 이야기가 그전의 동물 이야기와 다른 점이 하나 더 있습니다. 그전까지 동물 이야기는 대개 사람 이야기를 짐승에 빗댄 것이었습니다. 여우가 꾀를 부리고 토끼가 게으르고 하는 식입니다. 짐승은 사람 성질을 담는 그릇이었습니다. 실제 그 짐승이 어떻게 사는지는 상관없었습니다. 여우가 정말 꾀가 많은지는 아무도 재 보지 않았습니다. 이야기에 필요한 대로 쓴 것입니다.`,
            `시튼은 그렇게 쓰지 않았습니다. 실제로 그 짐승이 무엇을 먹고 어떻게 새끼를 기르고 어떻게 위험을 피하는지를 적었습니다. 그것을 알아내려고 여러 해씩 한 짐승을 따라다녔습니다. 까마귀는 다섯 해, 뇌조는 세 해를 보았습니다. 로보는 넉 달이었지만 하루도 빠지지 않았습니다. 그래서 시튼의 책은 이야기이면서 관찰 기록입니다. 읽으면 재미있고, 읽고 나면 그 짐승을 알게 됩니다. 그런 책이 그때는 없었습니다. 그래서 이 책이 나왔을 때 아주 새로웠습니다. 지금은 그런 책이 흔합니다.`,
            `그래서 시튼의 책에 나오는 짐승에게는 다 이름이 있습니다. 이름을 붙이면 그 하나하나가 다른 짐승이 됩니다. 늑대 한 마리와 늑대 이천 마리는 읽는 사람에게 아주 다른 것입니다. 수는 셈이 되고 이름은 이야기가 됩니다. 이천 마리가 죽었다는 말은 잘 남지 않습니다. 로보가 사흘을 굶고 갔다는 말은 남습니다. 시튼은 그것을 알고 이름을 붙였습니다.`,
            `시튼은 여든여섯 살까지 살았습니다. 그리고 마지막까지 짐승을 그렸습니다. 1946년에 미국 뉴멕시코에서 세상을 떠났습니다. 로보를 잡았던 그 지방입니다. 쿠럼포에서 멀지 않은 곳이었습니다. 유해의 재를 그 지방에 뿌렸다고 합니다. 쿠럼포의 들판이 내려다보이는 자리였습니다. 로보를 묻은 데서 멀지 않았습니다.`,
            `그가 쓴 책은 마흔 권이 넘습니다. 그 가운데 여러 권이 지금도 읽히고 있습니다. 글과 그림을 다 시튼이 했습니다. 책 여백에 작은 그림이 잔뜩 그려져 있습니다. 발자국, 깃털, 나뭇잎 같은 것들입니다. 글을 읽다가 그것을 보게 되어 있습니다. 이 책에 실린 일곱 편은 시튼이 남긴 것 가운데 아주 일부입니다.`
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
    title: 'Wild Animals I Have Known',
    cover: {
        title: 'Wild Animals I Have Known',
        tag: 'after Ernest Thompson Seton',
        intro: [
            `A hunter who earned bounties for wolves caught Lobo — and after that he gave up hunting and spent the rest of his life protecting wild animals.`,
            `Seven stories are gathered here. In most of them the hero dies at the end. Why Seton wrote them that way is told here as well.`
        ]
    },
    chapters: [
        {
            title: 'Lobo, the King of Currumpaw',
            paras: [
                `In New Mexico, in the United States, there is a cattle country called Currumpaw. The name comes from a river. The ranches were strung out along that river. It is a place of wide grass where a great many cattle are kept. Cattle grazed there by the tens of thousands. It was open range without fences. The cattle lived out there among themselves all summer.`,
                `In the 1890s there was one pack of wolves in that country. There were only five of them, and in five years those five killed more than two thousand cattle. That is about four hundred a year. A cow was worth about twenty dollars in those days. In five years they had taken forty thousand dollars' worth.`,
                `The leader of the pack was called Lobo. He was an old male, far bigger than an ordinary wolf. His forepaw print was the size of a grown man's palm. An ordinary wolf weighs about forty kilograms. Lobo was much heavier. His track was twice the size of an ordinary wolf's. It was so large that you could tell it was Lobo from the print alone. The ranch people began each morning by looking at those tracks. They told where he had passed in the night.`,
                `A number of things were known about Lobo. First, Lobo never touched poison. When people put poison in meat, Lobo dug it up, piled it together, left his mark on it and went. Seton saw such places more than once. Four pieces of poisoned meat gathered in one spot. Earth and dead leaves piled over them. It was as neat as if a man had done it. It was a sign that he would not eat. People took it as mockery.`,
                `Second, Lobo knew a trap when he met one. Where traps were set, he went round. If the scent of a man was on the trap, he gave the place a wide berth. He could smell the iron too. So people buried the traps in the earth for days before using them. Hunters boiled their traps in blood before setting them. Lobo knew all the same. They covered the trap with earth and scattered dead leaves on top. And still he picked out those very spots to avoid.`,
                `Third, Lobo did not eat carrion. Cattle that had died of sickness lay all about, and he never touched them. Wolves usually do eat what is already dead. It takes less effort. He ate only what he had killed himself. Poison is easy to put into sick meat. Lobo knew that.`,
                `The ranchers of that country put a price on Lobo's head: a thousand dollars. That was a great sum in those days. A horse cost twenty dollars. A ranch hand earned about thirty dollars a month. So a thousand dollars was several years' wages. It would have bought a small ranch. The ranchers put the money up between them. No such price had ever been put on a single wolf. Hunters came flocking in. And not one of them got him. Several held out two months and went home. Some never fired a shot.`,
                `In 1894 the writer of this book, Seton, went to that country. He was a little over thirty then, and he was confident with traps. Up to then there was hardly an animal he had failed to take. So he thought four months would do it. For four months Seton tried every method he knew. All that while, Lobo went on killing cattle. After Seton came, he killed more, not fewer. It is not often that a hunted animal kills more. Seton thought he understood what that meant.`,
                `He set six different poisons in turn. He chose them so that each smelled different. He handled the meat in gloves and dipped the gloves in cow's blood. Even after all that, it was the same. Lobo dug up every one. He set a hundred and thirty traps. Lobo avoided every one. Setting a hundred and thirty traps took many days. Not one was touched. When he took the traps up, Seton said nothing. There was nowhere left to set them.`,
                `Once he laid traps in four rows across a narrow pass. Next day he found that Lobo had come in along that path, stepping only where there was no trap. And at the end he had dug up one trap, turned it over and left it. The trap lay facing the sky. It was not a thing a paw could turn. The marks showed it had been pushed over with the nose. Seton wrote that he did not say a word all that day. He wrote that he felt he had been made fun of. And from that day he began looking for another way.`,
                `That summer Seton found out this. In Lobo's pack there was one white wolf. Its tracks were small and its step was light. It was the smallest of the pack. And it was always at Lobo's side. Its coat was as white as snow. White wolves are very rare. So that one, of all the pack, could be picked out from far away.`,
                `People called her Blanca. And it was known that Lobo always went about with her. Blanca was not as careful as Lobo. There were times when she went close to a trap. Only when Lobo called out did she draw back. Seton saw that more than once. He decided to use it. If he could not catch Lobo, he would catch what Lobo cared for. That was the method he found at the end of those four months.`,
                `What that method was, Seton later wrote down in great detail. He wrote it that way so as not to hide what he had done. He knew readers would not think well of him for it. He wrote it down all the same. He did not dress up what he had done. That is the heaviest passage in this book.`,
                `From here on is the most painful part of the story. Seton trapped Blanca first. Then he dragged her body about, spreading her scent all over the range. He tied her behind his horse and dragged her for miles. The trail lay across the whole range. He even reckoned which way the wind blew as he dragged. It was to carry the scent far.`,
                `He set it so that traps lay wherever that scent led. For two days after that, Lobo circled the place, howling. He howled by day too. He was an animal that had never before made a sound in daylight. Every ranch heard him. It went on through two whole nights. When that sound came at night, every dog on the ranches hid. People could not sleep either. Even the ranchers who had put up the reward. The very people who had wanted him caught.`,
                `One man said afterwards,<br>"I never heard an animal cry like that."<br>The man who said it had worked on ranches all his life. He had heard wolves times without number.`,
                `And Lobo followed the scent. An animal that had been so careful for so long did not look for traps that day. He walked straight along the scent. It was a place where traps lay in four rows. Until then he had gone round such places from a hundred paces off. Two mornings later, Seton found Lobo in the traps.`,
                `All four feet were caught. He had stepped into four traps at once. And even so he was holding himself up. Lobo saw Seton and stood. He was drained of strength, and still he stood. And he did not bark. He did not growl. He only looked straight at Seton.`,
                `Seton could not shoot Lobo there. Instead he put a rope round his neck and took him to the ranch. He raised the gun to shoot and lowered it. Why he did that, he wrote, he did not know himself. He tied him in the yard and gave him meat and water. He cut the best meat there was and laid it down. He set the water bowl right under his nose. He let nobody come near.`,
                `Lobo did not eat it. And he never once turned his head. When a man came near, he did not turn his eyes. He looked only toward the open range. People watched for two days, and he did not take one mouthful of water. The ranch hands came by turns to look. After a while nobody came at all.`,
                `On the morning of the third day, Lobo lay dead where he was. There was no wound. The rope was not broken. The collar was still fastened. His head was turned toward the range. He had been looking that way to the last.`,
                `The people laid his body beside Blanca's. Nobody had suggested it. The ranch hands did it among themselves. Seton never trapped a wolf again. And he spent the rest of his life protecting wild animals. One animal, hunted for four months, had changed one man. This book begins with that.`
            ]
        },
        {
            title: 'Silverspot',
            paras: [
                `Near Toronto, in Canada, there was a pine valley. Every winter two hundred crows slept there together. Crows gather like that to sleep in winter. With many together, it is easier to guard against owls at night. If one wakes, all wake. Two hundred of them settled on the trees of one valley. They had all arrived before the sun went down.`,
                `The leader of that flock was an old male. He had a silver spot under his beak, and so Seton called him Silverspot. Seton watched that flock for five years. And he found out these things about crows — things nobody had written down before. The crow is such a common bird that nobody had taken the trouble to look. What is common is often the least known.`,
                `First, crows have a language. There were more than twenty different calls. To a human ear they all sound like the same caw. Two short calls meant safe, three long ones meant a man, and one very sharp one meant a gun. When Seton went out with a gun, that call came; when he went without, it did not. Seton wrote each call down in his notebook. He wrote when each call was given and what happened at the time. After five years of that, the meanings came clear.`,
                `Second, the flock had discipline. There was an order for leaving the valley in the morning. Silverspot went first. The order of those who followed was always the same. The young ones were kept in the middle. And when they went to feed, they always posted a sentry. The sentry crow did not eat but sat high up. Then there was a change of guard. Even the order of changing was fixed. When its turn came, a crow left what it was eating and went up. There was no putting it off. When the sentry called, two hundred crows rose at once. The sky went black with them. Not one was left behind. One call did that.`,
                `Third, Silverspot trained them. In summer he took the young crows hatched that year about with him and taught them one thing at a time.`,
                `He took them to a scarecrow to show them that it was not a man, and he kept them away from a man with a gun. He did the same with a man carrying a long stick. Because they could not tell a gun from a stick. So he taught them to avoid both. The teaching went on all summer. Seton saw it many times. Three or four young were hatched each year. He took those young ones round the same places again and again.`,
                `Once this happened. Seton was hiding behind a pine, and Silverspot passed without seeing him. But about fifty paces on, he suddenly turned back. Something had caught his attention. Seton held his breath.`,
                `And Silverspot went once round the tree and found Seton. Then he gave the alarm. The flock scattered at the sound. If anything seemed wrong, he always came back to make sure. He never simply passed by. That was why he had lived twenty years.`,
                `Silverspot was very old. The feathers of his wings were worn, and his beak was full of notches. The silver spot was no longer as clear as it had been. Seton judged him to be over twenty. A crow so old is rare. Most do not live half as long. Every winter several die. He had come through twenty such winters.`,
                `One spring, Silverspot did not come with the flock. Seton searched that valley for days. He looked under the trees one by one. He counted the flock at its roost again and again. One was missing. And below a hillside he found the body.`,
                `An owl had got him. The owl is the crow's old enemy. At night the owl sees far better. By day it is the other way round. So when crows see an owl by day, they mob it in a crowd and drive it off. At night they cannot. Perhaps his eyes had grown dim in the dark with age, Seton wrote. He had been a careful bird all his life. What all that care could not beat was age.`,
                `After that the flock had another leader. But for many years afterwards, that flock did not do as well as it had. The order of sentries fell apart. There were young ones that flew straight at a man.`,
                `At that point Seton wrote this:<br>"We were taught that animals live by instinct alone. But the things that flock did well vanished when Silverspot died."<br>"If it were instinct, it could not vanish. Those things were taught, and passed on."<br>In those days that was a very strange thing to say. It meant that animals teach one another.`
            ]
        },
        {
            title: 'Raggylug the Cottontail',
            paras: [
                `In Olifant's Swamp there lived cottontail rabbits. A cottontail is white on the underside of its tail. When it runs, that white flashes on and off. In the brush it shows and vanishes, shows and vanishes. Whatever is chasing takes its direction from that. That is how the cottontail got its name. That white patch draws the eye of the pursuer. And so it is all the better for throwing the pursuer off.`,
                `The mother's name was Molly and the young one's name was Raggylug. Seton watched them over several years of going in and out of that swamp. The swamp was within walking distance of his house. When Raggylug was very small, a snake caught him by the ear and tore it. That is how he got his name. Raggylug means ragged ear. The ear never healed. So Seton could tell Raggylug from far away. Rabbits look very much alike. Without that ear, he could not have picked him out.`,
                `Molly taught Raggylug many things. There is a great deal a rabbit has to learn. It has to learn all of it to live through its first year. A rabbit is a hunted animal. It must learn not the skill of catching but the skill of not being caught. In that swamp there were many things that hunted rabbits: hawks and snakes and foxes and weasels and dogs.`,
                `First, when there is danger, do not run; freeze. A rabbit's coat is so like the colour of the grass that, if it stays still, it is hard to see. The hunter can pass right beside it and not see it. It is when it runs that it is seen. The commonest cause of a rabbit's death is running in fright. What would have passed over ends that way. A hawk sees only what moves. A hawk's eyes are very good, but they miss what is still. So freezing is the best move of all.`,
                `This was the lesson Raggylug took longest to learn. When he was frightened, his legs moved by themselves. It is hard to hold back a body that moves before you do. It took months to learn to hold it back. Molly pressed him down beside her again and again. She pressed his back with her forepaw so that he could not bolt. She repeated that for months.`,
                `Second, never go straight into the burrow when you are near it. Go once round, and then jump, and go in from the jump. Sometimes the jump is more than two body-lengths. Before jumping, stop once and judge the distance. Jump wrong, and the tracks run on into the hole. The point is to make the tracks stop short in front of the burrow. The animal following loses the scent right there. And it cannot find the burrow and goes away. At the place where the tracks stop, a dog circles a long while. By then the rabbit is inside. And a rabbit never digs just one hole. It keeps a separate way out.`,
                `Third, when a dog is after you, go to water. Go into the water and the scent is cut. The dog loses the scent at the water's edge. Because the scent does not carry across water. So the waterside is a good place for a rabbit. Only, in the water the body grows heavy. So it is kept for emergencies.`,
                `Fourth, go into the thorn thicket. A rabbit can pass low underneath, but a big animal cannot get in. In the middle of Raggylug's swamp there was one very thick bramble thicket. The thorns were as long as a finger. A rabbit uses the runs under it. Keep low, and the thorns do not touch you. Raggylug learned every run in that thicket by heart. He knew even where he had to crouch.`,
                `Raggylug learned these things one at a time. And he came near death many times. Each time he went through something, he learned one thing. If he failed to learn, there was no next time. There had been several young in that litter. Of them, only Raggylug was left.`,
                `Once a snake caught him. Molly came running, stamped on the snake's head with her forepaws and bit it, and saved him. The snake already had Raggylug by the hind leg. Molly did not hesitate. It is not often that a rabbit attacks a snake. Molly nearly got bitten herself. For anything but her young she would not have done it. Once a hawk came after him. He got into the thicket and lived. The hawk circled over the thicket several times. Raggylug stayed inside half the day.`,
                `Once a hound came after him. What Molly did then is the most astonishing thing in this story. Molly saw the dog chasing Raggylug and went out in front of it on purpose. She showed her whole body outside the thicket. The dog had just picked up Raggylug's scent. Molly ran in between. And she made the dog chase her instead. She made her footfalls loud on purpose. It was to keep the dog from going toward Raggylug. For that, she had to be more visible than he was.`,
                `Then she ran toward the swamp. She did not run straight but changed direction several times. She kept just far enough ahead that the dog would not lose her. In the middle of that swamp there was deep water. Rabbits do not swim well. But Molly could. She had been born and raised in that swamp. She knew where it was deep and where it was shallow. She knew where to enter so as to reach the far side. That, too, she had learned in years of going about there. Molly swam across that water.`,
                `The dog could not. That dog never came out of the swamp that day. The water was deeper than it looked. The dog came to the water's edge easily enough. But it did not know the middle. Molly watched it from the grass on the far side. Then she came back.`,
                `Raggylug grew up watching that. After a year he was the fastest rabbit in the swamp. The other rabbits began to follow him. Because the ways he went were safe. And he knew that swamp like the palm of his hand. Which hole had a snake in it, where the ground gave way, which thicket was thickest. He could have gone about it with his eyes shut. His mother had led him round and pointed out each thing. That had taken a year.`,
                `Molly died that winter. She was shot by somebody's gun. In winter the thickets have no leaves, and the body shows. That is why more rabbits die in winter than at any other time. The gun had been aimed at Raggylug. Molly had gone out in front of him. She did exactly what she had done with the hound. That time she came back alive, and this time she did not.`,
                `Raggylug lived long in that swamp. For years afterwards Seton saw that torn ear. Raggylug never forgot one thing his mother had taught him. At the end of this story Seton wrote:<br>"A rabbit lives long not because it is fast. It is because it knows so much."<br>"And all that it knows came from its mother."<br>Speed is born in an animal; knowledge is not. That is what Seton wanted to say in this story.`
            ]
        },
        {
            title: 'The Springfield Fox',
            paras: [
                `This is something that happened to Seton as a boy. He said he was somewhere in his early teens. About that time, hens kept disappearing in the village. The henhouse door was sound, but inside it was empty. People said it was a fox. One house lost three in a single day. Watching at night did no good. It happened while the watcher dozed.`,
                `Seton and a few others found the fox's den. It was a sandy hole in a hillside. The opening was the size of a grown man's head. Bones and feathers lay scattered in front of it. That was how they found it. Four cubs were playing there. They bit one another and rolled about. The cubs saw the people and did not run. They did not yet know what a person was.`,
                `Seton watched that den for many days. And he saw everything the mother fox did. The mother went out at night and brought back food. The hour she came back was always about the same: about two hours after sunset. Seton wrote it down by the day.`,
                `And she taught the cubs to hunt. She brought a live mouse, let it go, and had them catch it. The cubs rushed at it in a bunch. If a cub let it go, the mother caught it and let it go again. She repeated that many times. At first she brought injured mice. Later she brought sound ones.`,
                `Once the mother pushed a cub away with her foot. It had gone too far from the den. That is how a fox teaches her young. Wander from the den, and a hawk takes you. The mother taught that with her body.`,
                `But the village people decided to dig the den out. They went with spades. Several grown men worked at it for half a day. The den ran deep into the hill. It had several branches. Where it led, they only found out by digging.`,
                `That day three cubs were killed and one survived. It was the smallest. The people brought the survivor home and chained it to a post in a yard. They put an iron ring round its neck. Seton saw that and did not like it. But it was grown-ups' business, and he could not stop it. Seton was a child then. It is true, too, that he had gone along with a spade. He did not hide that either.`,
                `From that night, something strange began. The mother fox came to that yard every night. She came in without a sound. She came through a narrow gap under the fence. A little fur caught in that gap each time. And she brought the cub food.`,
                `She brought hens or mice. Some nights she came twice. Some nights she came once more at dawn. It was a yard with a dog and with people in it. And still she came. To a fox, a yard with people in it is a place you go to die. She did it every night.`,
                `For a fox to come into a farmyard night after night was an impossible thing. Seton sat at the window at night and watched. He sat without a light. He kept watch that way for many nights.`,
                `The mother tried to bite through the chain. She bit until her teeth broke. There were tooth marks on the chain. Still it did not give. The mother repeated it night after night. It was an iron chain. It was not a thing teeth could do. And still the mother came back and bit again every night.`,
                `Many nights passed like that. In that time the cub's neck was rubbed raw by the chain and the fur was gone. By day it only walked round and round the post. When a person came near, it crouched down.`,
                `And then one morning the cub was dead. There was no wound. Beside it lay food. It was a chicken leg. It was a poisoned bait.`,
                `People had laid those about the village to catch the fox. The bait was well known to foxes. The mother cannot have failed to know it. She would have known it by the smell alone. The mother had avoided that bait many times. She knew every place it was laid. And yet the mother had brought it.`,
                `Seton thought for a long time about whether it was a mistake or not. And at the end of this story he wrote only this:<br>"I never saw that fox again."<br>"And whenever I pass the post in that yard, my step quickens."`
            ]
        },
        {
            title: 'Bingo, My Dog',
            paras: [
                `This is a story from the time Seton worked on a farm in Canada. He was a little over twenty, and he helped on the farm while selling drawings. He was given a puppy from a neighbour's house. It was the smallest of the litter. It was a black dog, and he named it Bingo. It was a dog with upright ears and long legs. Being the smallest, it was the one nobody would take. Seton chose that one.`,
                `As Bingo grew, he became a strange dog. He would not stay at the house. By day nobody knew where he went, and in the evening he came back. Sometimes he was gone for days. And he would not stay long beside a person. A dog is an animal that wants to be near people, but Bingo was not like that. Give him food and he ate it and went out. Try to keep him in, and he went out more.`,
                `If you stroked him, he stayed a moment and slipped away. He hated being held. Call his name, and only his ears moved; he did not come. And yet Bingo knew Seton. He knew him from very far away. He knew him only by seeing him walk across a field. He knew him by his walk. He did not do that for anybody else.`,
                `Bingo had one gift. He could herd cattle. Nobody had taught him, and he did it very well. He even knew which cow belonged to which pen. If a cow did not come in in the evening, Bingo went out alone and brought it. Nobody told him to; he did it himself. Only when he was herding did he keep close to a person. When the work was done, he vanished again.`,
                `Later Seton left that farm. Bingo was left with somebody else. On that farm there was nothing to replace Bingo. A new herding dog was brought in, and it could not do as much. A person had to go along with it.`,
                `Many years went by. One winter, Seton went back to that country. He had set a number of traps for wolves. But going out at night to look at the traps, Seton himself was caught in one. He had not seen his footing in the dark. Snow had covered the place where the trap lay. It was a trap he had set with his own hands.`,
                `His hand was caught. And reaching with the other hand to open it, he caught that hand in another trap. Both hands were held. He shouted, and there was nobody to hear. A wolf trap does not open easily to a man's strength. The spring was very strong. It took both hands to force it open. And both his hands were caught.`,
                `It was a night more than twenty degrees below freezing. And nobody knew where he was. Seton spent several hours where he stood. His hands began to freeze. On such a night, hands that freeze have to be cut off. Seton earned his living by drawing. To lose his hands was to lose everything.`,
                `Then something came toward him out of the dark. He thought it was a wolf. But it was a dog. It was Bingo.`,
                `Bingo had been wandering that country for years. Though it was years since they had met, he knew him. Bingo came and sat beside Seton. And he stayed beside him all night. He sat pressed against him. When a wolf came near, he barked and drove it off. Wolves came several times that night. There were several lines of tracks in the snow. Seton counted them in the morning.`,
                `In the morning, people found Seton. Because Bingo had gone on barking at that spot. They came to the sound. He had not left the place until morning. His voice was quite gone. He had barked all night.`,
                `Seton did not lose his hands. He wrote only that two fingers tingled for a long time. He wrote the story of that night very briefly. It was not a thing that could be written at length.`,
                `After that, Bingo vanished again. And a few years later he died. He had eaten a poisoned bait. It had been laid to kill wolves. That was the work Seton himself had done when he was young. That bait went to a dog.`,
                `Before he died, Bingo walked to the gate of the farm where he had once lived. He had walked from a long way off. And he was found there. There were marks where he had scratched at the gate to get in. Other people were living in that house by then.`,
                `Seton wrote this:<br>"I never tamed Bingo. But Bingo never forgot me."`
            ]
        },
        {
            title: 'Wahb the Grizzly',
            paras: [
                `In the mountains of the American West lived grizzly bears. The grizzly is one of the biggest animals in North America. Full grown, it weighs more than five men. Standing up, it is twice a man's height. One blow of a forepaw breaks the neck of a cow. It is not an animal a man can stand against.`,
                `Wahb was one of four cubs. When Wahb was very small, a hunter found the den. That day his mother and his three brothers were killed. Only Wahb, hidden in the brush, survived. The hunters did not see him and went away. The brush was very thick. Wahb made no sound in there.`,
                `Wahb was still a suckling cub then. Such a cub almost never survives alone. Nine out of ten do not live through the winter. Even after weaning, a cub stays with its mother for two years. Because there is that much to learn.`,
                `Wahb grew up alone. With nobody to teach him, he had to find out everything for himself. What was safe to eat, how to open a bees' nest, how to get through the winter. He ate things he should not have and was sick. A cub with a mother learns those things over two years. Wahb found them out alone. And while finding them out, he nearly died more than once.`,
                `And he was badly hurt more than once. Porcupine quills lodged in a forepaw, and he limped for months. He could not set the foot down. A porcupine's quill is barbed at the tip like a fish-hook, and once in, it does not come out. It works deeper into the flesh instead. A bear usually meets a porcupine while it is young. After one such lesson, it never touches one again. Even after the foot healed, the print of his left forepaw was unlike any other, and people knew Wahb by it. The left forepaw turned a little inward. That print showed sharp in the mud.`,
                `But Wahb survived. And he grew very big. Wahb became the strongest animal in that valley. His shoulder came up to a man's chest. Other bears, wolves, mountain lions — all kept out of his way. When Wahb passed, everything moved aside. There was no more fighting. He had only to appear.`,
                `Wahb had a country of his own. It was about the size of one valley. He marked its edges with claw marks on the trees. The bark was torn off white. He renewed those marks every year. The marks lay on the trees in layer over layer.`,
                `A bear stands up against a tree and makes its claw marks as high as it can reach. Because another bear that comes and sees the height goes away. Wahb's marks were very high. The bear reaches up as far as it can and rakes. So those marks tell its size.`,
                `Many years went by like that. Wahb grew old. His teeth were worn and his feet hurt. The place where the quills had gone in ached every winter. The hurts of youth come back in old age.`,
                `And one year a young bear came into that valley. Wahb fought him and drove him out. But after winning, he lay sick for many days. He could not come out of his den. For an old animal, even winning is a loss. Because the time it takes to mend is different. A young bear is up again in a few days. An old bear takes weeks.`,
                `The next year another young bear came. And that year Wahb did not win.`,
                `Wahb was driven out of his own valley. It was the country he had kept all his life. And he wandered the mountains. A bear that has lost its country has nowhere to go. Every valley already has a master. Go in, and there is another fight. And those were fights he could no longer win.`,
                `In those mountains there was a place called Death Gulch. Strange gases seeped out of the ground there. No animal that went in came out. The floor of the gulch was littered with bones. The gas seeping from the ground settles on the floor. On windless days it grows thicker.`,
                `Wahb went to the mouth of that gulch. And he stood there a long while. Wahb knew what the gulch was. All his life he had turned back at that spot. That day he did not turn. He stood a long time, and then walked in. His step did not falter.`,
                `At this point Seton wrote:<br>"I cannot say that I know what was in that bear's mind. But that day I saw the tracks left at the mouth of the gulch, and those tracks never once turned back."`
            ]
        },
        {
            title: 'Redruff the Partridge',
            paras: [
                `In the Don Valley, in Canada, lived partridges. The partridge is a bird something like a pheasant. It lives on the ground, so it is more often on the dead leaves than up in the trees. The colour of the leaves and the colour of its feathers are almost the same. If it keeps still, you can pass right in front of it and not see it. That is how the bird stays alive.`,
                `In spring the male partridge gets up on a log and beats his wings. He puffs out his chest and spreads his tail wide. He beats so fast that it makes a sound like a drum. That sound carries a very long way. It can be heard across the valley. To a human ear it sounds like drumming. It starts slow and grows faster and faster. With that sound he calls a mate. In spring the valley is full of it. He drums most often in the morning and the evening.`,
                `There was one male with a red ruff standing out at his throat, and Seton called him Redruff. Redruff held the best log in the valley. He had fought other males for that log many times. Because a good log is what brings a mate. A good log is one where the sound carries far — a spot that is hollow and rings well.`,
                `That spring Redruff found a mate. The hen made a nest in the dead leaves and laid twelve eggs. It was only a hollow scraped in the leaves. It was hardly a nest at all. And yet finding that spot was very hard.`,
                `Seton saw it the day the chicks hatched. Chicks just out of the egg were already walking. They scurried after their mother among the leaves. It was only hours since they had hatched. Their down was still damp. A partridge chick walks as soon as it hatches. Because staying long in the nest is the greater danger.`,
                `And when the mother gave a call, they all froze where they were. On the dead leaves, not one could be seen. When the mother called again, they moved again. That call was so low that a human ear could barely hear it. Even Seton had to bend down to hear it. It is a sound made on purpose not to carry. Because if it carries, the enemy hears it too.`,
                `Once a fox came near. The mother went out in front of the fox and pretended her wing was broken. She dragged it on the ground and limped. It looked as if she were really hurt. The fox went after her. It thought it had her. Meanwhile the mother drew further and further from her chicks. That is an old trick of this bird's.`,
                `The mother kept a distance where she seemed always just about to be caught. Because if she was too far, the fox would not follow. When she was far enough, the mother flew up. The fox was left with nothing. It could not get back to where the chicks had been.`,
                `That summer the chicks dwindled one by one. A hawk took one. It dropped straight down out of the sky. A weasel got two. Three were caught in traps set by people. Those traps had not been meant for partridges. They had been set for rabbits. The chicks were caught all the same. The man who set them had never expected it. A trap does not choose what it catches.`,
                `By autumn there were four left. Those four were as big as full-grown birds. Four out of twelve was a good year. Usually two are left, or none. The mother had done well.`,
                `In winter, snow came. Partridges sleep in the snow. Dig a hole into the snow and go in, and it is warm inside. Inside the snow it is about twenty degrees warmer than outside. The snow serves as a quilt. In the evening they fly and plunge straight into the snow. No tracks are left, so the enemy cannot find them either.`,
                `But that winter it rained and then froze. Such a winter comes once in a few decades. A thick crust of ice lay over the snow. The birds that had gone into the snow at night could not get out in the morning. The ice was a finger thick. From underneath, a beak cannot break it. They were shut in where they lay.`,
                `Redruff broke through the ice with his claws and got out. His beak was all broken. There were places where his claws had snapped. And still he got out. But the only one that lived to see that spring was Redruff.`,
                `And at the end of that winter Redruff, too, was caught in a trap. It was a snare set by a man. A bird that had broken through ice. And it was caught by a single strand of wire.`,
                `Seton ended this story like this.`,
                `"That year there were more than a hundred partridges in this valley. When spring came, none were left."<br>"We say of such a bird that it is common. Common does not mean that it is all right for many of them to die."<br>It is because of that one line that this story has been read so long. In those days there were few people who talked like that.`
            ]
        },
        {
            title: 'The Man Called Seton',
            paras: [
                `Ernest Thompson Seton was born in England in 1860. It was a port town in the north of England. His father owned several ships. He was the eighth of fourteen children. He was a child in the middle. So there was not much to make him stand out. His elder brothers had all their father's attention. Seton went off on his own out of doors. When he was six, the family moved to Canada. They moved because his father's business had failed. They went by ship, and it took many weeks. In Canada they cleared forest and farmed. The children all helped with the work. They felled trees and dug out stumps. Doing that work, Seton came to know the woods.`,
                `His father was a very stern man. With fourteen children, he ruled by the cane. There was to be no laughing in the house. In front of their father, nobody spoke first. It was that kind of house. The children knew their father's footstep. When they heard it, they hid whatever they were doing. Seton hid his drawings.`,
                `On the day Seton turned twenty-one, they say, his father handed him a bill. It was the cost of feeding and clothing him from birth to twenty-one. The sum was five hundred and thirty-seven dollars. In those days that would have bought a house. It was not a sum a twenty-one-year-old could pay. But Seton did not argue. He said only that he would pay it, and left. Seton paid every dollar of it. And he never saw his father again. Paying it took several years. When it was paid, they say, he burned the paper. Seton did not write that story down until he was old. It was a story he could not bring out for a long time. He never told it to anybody all his life. He wrote it once, in the last book he wrote.`,
                `As a boy Seton lived in the woods. He watched animals and drew them, and wrote what he saw in a notebook. Because his father disapproved of his drawing, he drew in secret. He drew in the barn or in the woods. When he had no paper, he drew on bark. He would stay half a day up a tree to watch a bird. Then in the evening he was scolded. Because he had been watching birds instead of working. And the next day he went out again.`,
                `Those notebooks became these books later. Over his life Seton filled more than fifty of them. The date, the weather and the time were always written at the top. He wrote what he saw and what he guessed separately. He marked what he had guessed. Later he wrote down whether the guess had been right. Many pages have animal tracks drawn at their real size. He measured the tracks with a ruler as he drew them. He drew forefoot and hindfoot separately. Even today you can tell tracks apart by those drawings. That is how exactly he drew them. A track is the only writing an animal leaves. Seton taught children how to read it.`,
                `When he was young, Seton was a hunter. He caught wolves and bears for the bounty. That was one of the ways of making money in the West in those days. Wolves and bears were the bane of the ranches. Bring one in, and the government and the ranches paid. Every wolf had its price. Bring the ears, and the money was paid. Since he lived on the price of animals he had killed, the Seton of those days was no different from the hunters in this book. He did not hide that out of shame. He wrote it down more than once.`,
                `Then, after he caught Lobo, he changed. Catching Lobo took four months, and in those four months Seton came to know that animal very well. He came to know where he went and what he avoided. Because he had to know that to set his traps. And once he knew, he could no longer bring himself to catch him. To know where to set a trap, you must know the animal. The more he knew, the harder it became. Because he had come to know what that animal was careful of and what it cared for. Then it no longer looks like a stranger. Seton learned that from Lobo. In four months a person can change that much.`,
                `After that Seton spent his life protecting wild animals. And he founded a group to teach children the woods. Its name was the Woodcraft Indians. That group played a large part in what later became the Boy Scouts. It began as a gathering of a few village children. It spread to many countries. The roots of the movement that is now all over the world are there. Seton's name is not often mentioned in connection with it.`,
                `He took children into the woods and taught them to make fire and read tracks. He taught them to pitch a tent and to read the stars. These were things he had learned from the native people of that country. Seton kept no ranking in the group. Because he did not want the children set against one another. He gave a feather to a child who had done well. Not for doing better than others, but for doing better than yesterday. So anybody could earn one. Only, if you did nothing, you got nothing. Rank the children, and somebody comes last. Seton knew what became of that child.`,
                `Seton's stories have one rule. The hero usually dies at the end. Lobo, Silverspot, Wahb, Redruff — all of them. The only one that ends alive is Raggylug the cottontail. And even Raggylug loses his mother. So there is not one story that ends happily. And yet this book has been read for more than a hundred years. A sad ending does not stop a book being read. It is because of that ending that it lasts. Because it is not forgotten.`,
                `People reproached Seton for that more than once. It is a book for children, they said; why write it so? Letters came saying that children read it in tears. He did not change it. Each time, Seton stood his ground. Even the publisher once suggested a change. Seton would not accept it. He was told it would sell better changed. Still he left it as it was.`,
                `Seton answered like this:<br>"The life of a wild animal always has a tragic end. That is the fact."<br>"If I rewrite it, the reader will think that those animals are doing well."<br>"And then nobody will try to protect them."<br>He did not write it sad in order to be sad. He wrote it so because that was the fact. And he spent his life trying to change that fact. He helped in the making of national parks. The point was to leave animals somewhere to live. In writing he told the truth; in deed he worked to change it.`,
                `Once a famous scholar said that Seton's writings were made up. Seton produced his notebooks on the spot. Dates, places and measurements were all there. Track drawings and the weather too. The scholar had nothing more to say. In those days there were many people making up animal stories. That is why the charge was made. Even the President of the United States joined in the argument. Several people took Seton's side.`,
                `There is one more way in which Seton's stories differ from the animal stories before them. Until then, animal stories were mostly human stories dressed as animals. The fox is cunning, the rabbit is lazy, and so on. The animal was a vessel for human qualities. How the animal really lived did not matter. Nobody had ever measured whether a fox was really cunning. It was written as the story required.`,
                `Seton did not write that way. He wrote what the animal really ate, how it raised its young, how it escaped danger. To find that out, he followed one animal for years at a time. He watched the crows for five years and the partridges for three. Lobo was four months, but not one day was missed. So Seton's books are stories and records of observation at once. They are enjoyable to read, and when you have read them, you know the animal. There were no such books then. So when this book came out, it was very new. Now such books are common.`,
                `That is why every animal in Seton's books has a name. Give an animal a name, and each one becomes a different animal. To a reader, one wolf and two thousand wolves are very different things. A number is a sum; a name is a story. That two thousand were killed does not stay with you. That Lobo starved for three days and died does. Seton knew that, and gave them names.`,
                `Seton lived to be eighty-six. And he drew animals to the end. He died in 1946 in New Mexico. It was the country where he had caught Lobo. It was not far from Currumpaw. His ashes, they say, were scattered in that country. It was a place that looked down over the plains of Currumpaw. Not far from where Lobo was buried.`,
                `He wrote more than forty books. Several of them are still read today. Seton did both the words and the pictures. The margins are full of small drawings. Tracks, feathers, leaves and the like. You come upon them as you read. The seven stories in this book are only a small part of what Seton left.`
            ]
        }
    ],
    afterword: {
        title: 'After Reading',
        paras: [
            `What is in this book is not made up. These are stories of animals the author saw and knew himself. That is why the original title is Wild Animals I Have Known.`,
            `The writer was Ernest Thompson Seton. He was born in England and went to Canada at the age of six. And he spent his life in the fields and forests of North America.`,
            `He was also a painter. So the original edition of this book is full of drawings he made himself. They are drawings of animals' tracks and bones and movements.`,
            `There are small drawings in the margin of every page. Tracks, feathers, bones, the marks of something that has passed. He let the drawings say what the words did not.`,
            `And he was a hunter too. The man who caught Lobo, in the first story of this book, was Seton himself.`,
            `A man who made his living by killing animals came to write on the animals' side. That reversal is the ground this book stands on.`,
            `The book came out in 1898. And it sold enormously. Because until then there had been no book that drew animals like this.`,
            `Before that, animal stories were of two kinds. One was the fable, in which animals talk like people; the other was the hunting story.`,
            `Seton did neither. He drew animals as animals, and gave those animals names and histories. At the time, that was new.`,
            `So after this book came out, a great many people began writing animal stories. The roots of the animal stories we read today are mostly here.`,
            `Now let us pick out some places worth a second look.`,
            `First, read the story of Lobo again. It is the most famous story in the book, and it is also Seton's own story.`,
            `A ranch owner asked him to catch the leader of a wolf pack. That wolf had defied everybody for five years. Neither trap nor poison worked on him.`,
            `And at last Seton catches him. But look at how it is done. He does not catch Lobo; he catches Lobo's mate Blanca first.`,
            `Blanca was a white wolf. In that pack she was the most careful after Lobo. But she was caught while she was away from him.`,
            `After losing Blanca, Lobo falls apart. He forgets all his caution, searches for his mate, and steps into the traps.`,
            `And look again at what became of Lobo once he was caught. Seton does not kill the wolf but brings him to the ranch. And Lobo eats nothing and makes no sound.`,
            `And the next morning he is dead where he lay. Seton wrote that passage very briefly.`,
            `And Seton wrote that he laid the wolf beside Blanca. After that he never hunted wolves again.`,
            `That event changes Seton. From then on he turns from a man who catches animals into a man who protects them. So the first story in this book is also the story of the author's own change.`,
            `Second, look again at Silverspot. It is the story of an old crow. Seton watched that crow for several years.`,
            `The crow led his flock, used many different signals, and taught the young crows. Seton wrote down every one of those calls.`,
            `In those days few people believed animals did such things. Today, how intelligent crows are has been shown by many studies. What Seton saw with his own eyes a hundred years ago turns out to have been right.`,
            `It has lately been found that crows recognise human faces and remember them for years. Some crows make and use tools. Seton found that out not by experiment but by watching.`,
            `Third, read the story of Bingo again. It is the story of a dog Seton kept. The dog would not stay at home but was always off roaming.`,
            `But when Seton was caught in a trap and had to spend the night there, that dog appears. So the dog had only not stayed; it had never forgotten.`,
            `This story is one of the very few in the book that end brightly. That makes it stand out all the more.`,
            `Fourth, count how the stories in this book end. Most of them do not end well.`,
            `Seton wrote the reason at the front of the book. The life of a wild animal always ends in tragedy, he said. Because hardly any animal dies comfortably of old age.`,
            `And he thought it was only courtesy to those animals not to hide it, but to write it down.`,
            `That is a rare attitude in a children's book. Most make things come right at the end. Seton did not.`,
            `It is worth looking again at the animals, rather than the people.`,
            `The animals in this book all have names. Lobo, Blanca, Silverspot, Raggylug, Bingo, Wahb. Giving names is something people do.`,
            `But Seton did not give them names to make pets of them. He did it to say that each was different. It means that one wolf is not the same as another.`,
            `Once you give a name, you can no longer count. You cannot say you caught some wolves; you have to say you caught Lobo. That, most likely, is what Seton was after.`,
            `It helps to know something of the times. When Seton was collecting these stories, wild animals were vanishing very fast in North America.`,
            `The bison went from tens of millions to a few hundred. Wolves, too, were hunted for government bounties on the grounds of protecting the ranches. The hunt for Lobo was part of that.`,
            `It happened as the railways were laid. There were people who shot bison from the windows of moving trains for sport. They took neither the meat nor the hide.`,
            `Seton saw that with his own eyes. That every animal in this book is a hunted animal is not a setting he invented.`,
            `Seton was in the middle of it. And he was a man who changed his mind on the spot. After this book came out, he wrote and lectured a great deal on protecting nature.`,
            `The other things he did are worth knowing too. He had a large hand in founding the Boy Scouts of America. It was a movement that took children into the woods to live.`,
            `Before that, he had first founded an outdoor group for children. It taught them how to live in the woods. That later led on to the Boy Scouts.`,
            `And he put into it a great deal of what he had learned from the Native Americans. How to live in the woods, how to read tracks, and the like.`,
            `But there was later a quarrel inside the Boy Scouts of America over his methods. In the end Seton was pushed out of the organisation. Then he started another group in his own way.`,
            `And there was an argument about this book in its own day. Animals, it was said, should not be written as if they thought and felt like that.`,
            `There is something in that. What an animal thinks, no human can know. In places Seton did write from inference.`,
            `But the other side has its problem too. In those days many people thought animals were like machines that felt nothing. That was not true either.`,
            `Today we talk somewhere in between. Little by little it is being found out what each animal feels. And a good many of the things Seton saw with his own eyes have turned out to be right.`,
            `This book holds on to two things.`,
            `One is how people ought to see animals. This book does not draw animals as people, nor does it draw them as things.`,
            `It writes them as having lives of their own, each different, with things to lose and things to keep. So this book does not put animals beneath people.`,
            `The other is whether a person can change his mind. Seton went out to kill a wolf and came back a man who protected wolves.`,
            `And that was not because of some great revelation. He had only seen a captured wolf refuse all food and die. People change that way too.`,
            `Since it came out, this book has been read around the world for more than a hundred years. It came early to Korea and has appeared many times. It is usually called Seton's Animal Stories.`,
            `And in that valley in New Mexico where Lobo was caught, there is now a marker in his memory. A marker to a wolf who died at human hands.`,
            `The name of that valley is Currumpaw. The name Seton gave Lobo was the King of Currumpaw. The man who caught him called the animal by the name of its own land.`,
            `If you ever read this book again, this time count only the passages where Seton talks about himself. What that man did, and what he regretted, is in those passages.`,
            `Lastly, here are some things to think about. I shall not write down the answers.`,
            `How should we look at Seton's catching Blanca first? It was a very clever method. And because of that method, his heart was heavy for a long time.`,
            `Is it right to give animals names? Give an animal a name, and you come to treat it like a person. Is that a help, or a mistake?`,
            `And is it all right for children to read stories that all end sadly? Seton thought that writing them so was only courtesy. That question is not easy to answer even when you read these stories again as a grown-up.`
        ]
    },
    quiz: [
        { q: 'Which of these was NOT something that set Lobo apart from other wolves?', choices: ['He kept a very small pack', 'He was friendly and came close to people', 'He never touched poisoned bait'], answer: 1 },
        { q: 'How did Seton catch Lobo?', choices: ['He tracked him night after night without sleeping', 'He caught Blanca first and used her scent as a lure', 'He set more than fifty traps across the valley'], answer: 1 },
        { q: 'What became of Lobo after he was caught?', choices: ['He would not eat, looked only at the range, and died', 'He broke his chain and escaped to the mountains', 'He was kept in a pen for many years'], answer: 0 },
        { q: 'What did Silverspot do for his flock?', choices: ['He found feeding places on his own', 'He kept away from the villages where people lived', 'He took the young crows about and taught them'], answer: 2 },
        { q: 'What changed in the flock after Silverspot died?', choices: ['They could no longer do things as well as before', 'They grew into a much larger flock', 'A new leader soon took over'], answer: 0 },
        { q: 'Which of these did Molly NOT teach Raggylug?', choices: ['To slip through the thorn thicket', 'To cross water to cut the scent when chased', 'To cry out loudly when in danger'], answer: 2 },
        { q: 'How did Molly throw off the hound?', choices: ['She ran round the field until the dog was worn out', 'She hid her young in the burrow and blocked the entrance', 'She let herself be chased and led it into deep water'], answer: 2 },
        { q: 'What did Seton write at the end of the story of Raggylug?', choices: ['Animals love their young just as people do', 'A rabbit lives long because it knows so much', 'A rabbit survives by its speed alone'], answer: 1 },
        { q: 'What did the mother fox do every night for the chained cub?', choices: ['She dug a burrow while the people slept', 'She brought food and bit at the chain', 'She watched from far off and left at dawn'], answer: 1 },
        { q: 'In what situation did Bingo save Seton?', choices: ['When both his hands were caught in traps all night', 'When he lost his way in a blizzard', 'When he was surrounded by a wolf pack'], answer: 0 },
        { q: 'Why did Bingo die?', choices: ['He ate a poisoned bait set for wolves', 'He was badly hurt fighting a wolf', 'He was too old to live through the winter'], answer: 0 },
        { q: 'Why did Wahb grow up alone?', choices: ['He lost his family to hunters when he was very small', 'He fought with his brothers and left the family', 'His mother went away to another valley'], answer: 0 },
        { q: 'Why does a bear make its claw marks high on a tree?', choices: ['So that other bears see the height and go away', 'To sharpen its claws', 'While climbing to pick the fruit'], answer: 0 },
        { q: 'What did the mother partridge do in front of the fox?', choices: ['She rushed at it, making a loud noise', 'She hid her chicks under her body and held her ground', 'She pretended her wing was broken and led it away'], answer: 2 },
        { q: "Why do Seton's stories usually end in death?", choices: ['Because sad stories stay longest in people’s hearts', 'Because otherwise nobody would try to protect the animals', 'Because that is what really happened to every one of those animals'], answer: 1 },
        { q: "How do Seton's animal stories differ from the ones before them?", choices: ['He drew the animals only through a hunter’s eyes', 'He did not make the animals talk like people', 'He wrote down what he had observed by following them for years'], answer: 2 },
        { q: 'Which of these is NOT a fair thing to say after reading this book?', wide: true, choices: ['Seeing how Seton caught Lobo’s mate Blanca first, it was the heart, not traps or poison, that brought down that wolf.', 'Seeing how Seton put a rope on Lobo and took him to the ranch alive, he did it to get a better price for a live wolf.', 'Seeing how the ranch people laid Lobo’s body beside Blanca, even the people who hunted them did not see those two as mere animals.', 'Seeing how a man who made his living by killing animals came to write on the animals’ side, this book stands on that reversal.'], answer: 1 }
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
    emoji: '🐾',
    art: ['end.webp'],
    paras: [
        `이 책에 실린 것은 지어낸 이야기가 아닙니다. 지은이가 직접 보고 겪은 짐승들의 이야기입니다. 그래서 원래 제목이 『내가 아는 야생 동물』입니다.`,
        `쓴 사람은 어니스트 톰프슨 시튼입니다. 영국에서 태어나 여섯 살에 캐나다로 건너갔습니다. 그리고 평생을 북아메리카의 들과 숲에서 보냈습니다.`,
        `그는 화가이기도 했습니다. 그래서 이 책의 원래 판에는 그가 직접 그린 그림이 아주 많이 들어 있습니다. 짐승의 발자국과 뼈와 움직임을 그린 그림입니다.`,
        `쪽마다 여백에 작은 그림이 들어 있습니다. 발자국, 깃털, 뼈, 지나간 자리 같은 것입니다. 글로 적지 않은 것을 그림이 말해 주도록 한 것입니다.`,
        `그리고 그는 사냥꾼이기도 했습니다. 이 책의 첫 이야기인 로보를 잡은 사람이 바로 시튼 자신입니다.`,
        `짐승을 잡는 일로 돈을 벌던 사람이 짐승 편에서 글을 쓰게 된 것입니다. 그 뒤집힘이 이 책의 바탕입니다.`,
        `책은 1898년에 나왔습니다. 그리고 아주 크게 팔렸습니다. 그때까지 짐승을 이렇게 그린 책이 없었기 때문입니다.`,
        `그전까지 짐승 이야기는 두 가지였습니다. 하나는 사람처럼 말하는 우화이고, 다른 하나는 사냥해서 잡은 이야기였습니다.`,
        `시튼은 그 둘을 다 하지 않았습니다. 짐승을 짐승으로 그리면서, 그 짐승에게 이름과 사연을 주었습니다. 그것이 그때는 새로운 일이었습니다.`,
        `그래서 이 책이 나온 뒤 짐승 이야기를 쓰는 사람이 아주 많아졌습니다. 지금 우리가 읽는 동물 이야기의 뿌리가 대개 여기에 있습니다.`,
        `이제 다시 볼 대목을 짚어 봅시다.`,
        `첫째, 로보 이야기를 다시 읽어 보십시오. 이 책에서 제일 유명한 이야기이고, 시튼 자신의 이야기이기도 합니다.`,
        `그는 목장 주인에게 부탁을 받고 늑대 무리의 우두머리를 잡으러 갔습니다. 그 늑대는 다섯 해 동안 아무도 못 잡던 늑대였습니다. 덫도 독도 통하지 않았습니다.`,
        `그리고 시튼이 마침내 그 늑대를 잡습니다. 그런데 잡은 방법을 보십시오. 로보를 잡은 것이 아니라 그 짝인 블랑카를 먼저 잡았습니다.`,
        `블랑카는 흰 늑대였습니다. 그 무리에서 로보 다음으로 조심스러운 늑대였습니다. 그런데 로보와 떨어진 사이에 잡혔습니다.`,
        `블랑카를 잃고 나서 로보가 무너집니다. 그동안 조심하던 것을 다 잊고 짝을 찾아다니다 덫을 밟습니다.`,
        `그리고 잡힌 로보가 어떻게 되었는지 다시 보십시오. 시튼은 그 늑대를 죽이지 않고 목장으로 데려옵니다. 그런데 로보는 아무것도 먹지 않고 아무 소리도 내지 않습니다.`,
        `그러고는 이튿날 아침 그대로 죽어 있었습니다. 이 대목을 시튼은 아주 짧게 적었습니다.`,
        `그리고 시튼은 그 늑대를 블랑카 옆에 눕혔다고 적어 두었습니다. 그 뒤로 그는 늑대를 잡는 일을 하지 않았습니다.`,
        `그 일이 시튼을 바꿉니다. 그 뒤로 그는 짐승을 잡는 사람에서 짐승을 지키는 사람이 됩니다. 그러니 이 책의 첫 이야기는 지은이 자신이 달라지는 이야기이기도 합니다.`,
        `둘째, 은점박이를 다시 보십시오. 늙은 까마귀 이야기입니다. 시튼은 그 까마귀를 여러 해 동안 지켜보았습니다.`,
        `그 까마귀는 무리를 이끌었고, 신호를 여러 가지 썼고, 어린 까마귀들을 가르쳤습니다. 시튼은 그 소리를 하나하나 적어 두었습니다.`,
        `그 시절에는 짐승이 그렇게 한다고 여기는 사람이 드물었습니다. 지금은 까마귀가 얼마나 영리한지가 여러 연구로 밝혀져 있습니다. 시튼이 백 해 전에 눈으로 본 것이 맞았던 셈입니다.`,
        `까마귀가 사람 얼굴을 알아보고 몇 해 동안 기억한다는 것도 요즘 밝혀졌습니다. 도구를 만들어 쓰는 까마귀도 있습니다. 시튼은 그것을 실험이 아니라 관찰로 알아냈습니다.`,
        `셋째, 빙고 이야기를 다시 읽어 보십시오. 시튼이 기르던 개 이야기입니다. 그 개는 집에 붙어 있지 않고 늘 밖으로 돌아다녔습니다.`,
        `그런데 시튼이 덫에 걸려 밤을 새우게 되었을 때, 그 개가 나타납니다. 그러니 그 개는 붙어 있지 않았을 뿐 잊은 적이 없었던 것입니다.`,
        `이 이야기는 이 책에서 유일하게 밝게 끝나는 축에 듭니다. 그래서 더 눈에 띕니다.`,
        `넷째, 이 책의 이야기들이 어떻게 끝나는지 세어 보십시오. 대부분 잘 끝나지 않습니다.`,
        `시튼은 그 까닭을 책 머리에 적어 두었습니다. 야생 동물의 삶은 늘 비극으로 끝난다고요. 늙어서 편안히 죽는 짐승은 거의 없기 때문입니다.`,
        `그리고 그것을 감추지 않고 적는 것이 그 짐승들에게 예의라고 여겼습니다.`,
        `이 대목은 어린이 책에서 드문 태도입니다. 대개는 마지막에 잘되게 만듭니다. 시튼은 그렇게 하지 않았습니다.`,
        `인물이 아니라 짐승들을 다시 볼 만합니다.`,
        `이 책의 짐승들에게는 다 이름이 있습니다. 로보, 블랑카, 은점박이, 랙, 빙고, 왑입니다. 이름을 붙이는 것은 사람이 하는 일입니다.`,
        `그런데 시튼이 이름을 붙인 까닭은 애완동물로 삼으려는 것이 아니었습니다. 저마다 다르다는 것을 말하려던 것입니다. 늑대가 다 같은 늑대가 아니라는 뜻입니다.`,
        `이름을 붙이면 셀 수 없게 됩니다. 늑대 몇 마리를 잡았다고 말할 수 없고, 로보를 잡았다고 말해야 합니다. 시튼이 노린 것이 그것이었을 것입니다.`,
        `그 시절 사정도 알아 두면 좋습니다. 시튼이 이 이야기들을 모으던 무렵 북아메리카에서는 야생 동물이 아주 빠르게 사라지고 있었습니다.`,
        `들소는 몇천만 마리에서 몇백 마리로 줄었습니다. 늑대도 목장을 지킨다는 이유로 정부가 상금을 걸어 잡았습니다. 로보를 잡으려던 것도 그런 일이었습니다.`,
        `철도가 놓이면서 그렇게 되었습니다. 달리는 기차 창으로 들소를 쏘는 것을 놀이로 삼는 사람들이 있었습니다. 고기도 가죽도 가져가지 않았습니다.`,
        `그 이야기를 시튼이 직접 보았습니다. 이 책의 짐승들이 다 쫓기는 처지인 것은 그가 지어낸 설정이 아닙니다.`,
        `시튼은 그 한가운데에 있었습니다. 그리고 그 자리에서 마음을 바꾼 사람입니다. 이 책이 나온 뒤 그는 자연을 지키자는 글과 강연을 아주 많이 했습니다.`,
        `그가 한 다른 일도 알아 둘 만합니다. 그는 미국 보이스카우트를 만드는 데 큰 몫을 했습니다. 아이들을 숲으로 데려가 지내게 하는 활동이었습니다.`,
        `그전에 그는 아이들을 위한 야외 활동 모임을 먼저 만들었습니다. 숲에서 지내는 법을 가르치는 모임이었습니다. 그것이 뒤에 보이스카우트로 이어집니다.`,
        `그리고 그는 아메리카 원주민들에게서 배운 것을 그 활동에 많이 넣었습니다. 숲에서 지내는 법, 자취를 읽는 법 같은 것입니다.`,
        `다만 그 방식을 두고 나중에 미국 보이스카우트 안에서 다툼이 있었습니다. 시튼은 결국 그 조직에서 밀려났습니다. 그러고 나서 자기 방식으로 다른 모임을 만들었습니다.`,
        `다만 이 책을 두고 그 시절에 논쟁이 있었습니다. 짐승이 그렇게 생각하고 느끼는 것처럼 적으면 안 된다는 것이었습니다.`,
        `그 말도 일리가 있습니다. 짐승이 무슨 생각을 하는지는 사람이 알 수 없습니다. 시튼은 본 것에서 미루어 적은 데가 있습니다.`,
        `그런데 그 반대쪽도 문제가 있습니다. 짐승은 아무것도 느끼지 못하는 기계 같은 것이라고 여기던 사람도 그 시절에 많았습니다. 그것도 사실이 아니었습니다.`,
        `지금은 그 사이 어디쯤에서 이야기합니다. 짐승마다 무엇을 느끼는지가 조금씩 밝혀지고 있습니다. 그리고 시튼이 눈으로 본 것 가운데 맞은 것이 꽤 많습니다.`,
        `이 책이 붙들고 있는 것은 두 가지입니다.`,
        `하나는 사람이 짐승을 어떻게 보아야 하느냐는 것입니다. 이 책은 짐승을 사람처럼 그리지도 않고, 그렇다고 물건처럼 그리지도 않습니다.`,
        `저마다 다른 삶이 있고, 그 삶에도 잃는 것과 지키는 것이 있다는 식으로 적습니다. 그러니 이 책은 짐승을 사람의 아래에 두지 않습니다.`,
        `다른 하나는 사람이 마음을 바꿀 수 있느냐는 것입니다. 시튼은 늑대를 잡으러 갔다가 늑대를 지키는 사람이 되어 돌아왔습니다.`,
        `그것도 무슨 큰 깨달음이 있어서가 아니었습니다. 잡아 놓은 늑대가 아무것도 먹지 않고 죽는 것을 본 것뿐이었습니다. 사람은 그렇게 바뀌기도 합니다.`,
        `이 책이 나온 뒤 백 해 넘게 세계에서 읽혔습니다. 우리나라에도 일찍 들어와 여러 번 나왔습니다. 흔히 『시튼 동물기』라고 부릅니다.`,
        `그리고 로보가 잡힌 미국 뉴멕시코의 그 골짜기에는 지금 로보를 기리는 표지가 있습니다. 사람 손에 죽은 늑대를 기리는 표지입니다.`,
        `그 골짜기 이름이 쿠럼포입니다. 시튼이 로보에게 붙인 이름도 쿠럼포의 왕이었습니다. 잡은 사람이 그 땅의 이름으로 그 짐승을 불렀습니다.`,
        `언젠가 이 책을 다시 읽게 되거든, 이번에는 시튼이 자기 이야기를 하는 대목만 세어 보십시오. 그 사람이 무엇을 했고 무엇을 뉘우쳤는지가 그 대목에 있습니다.`,
        `마지막으로 생각해 볼 것을 남겨 둡니다. 답은 적어 두지 않겠습니다.`,
        `시튼이 블랑카를 먼저 잡은 것을 우리는 어떻게 보아야 할까요? 그것은 아주 영리한 방법이었습니다. 그리고 그 방법 때문에 그는 오래 마음이 무거웠습니다.`,
        `짐승에게 이름을 붙이는 것은 옳은 일일까요? 이름을 붙이면 그 짐승을 사람처럼 여기게 됩니다. 그것이 도움이 될까요, 잘못될까요?`,
        `그리고 이 책의 이야기들이 다 슬프게 끝나는 것을 아이들이 읽어도 될까요. 시튼은 그렇게 적는 것이 예의라고 여겼습니다. 이 물음은 어른이 되어 다시 읽어도 답하기가 쉽지 않습니다.`
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

    let slots = slotPlan(arts.length, Math.max(0, spreadCount - arts.length));
    let caps = capsOf(slots);
    let ranges = fillPages(segs, caps, headHtml);
    for (let guard = 0; guard < 8; guard++) {
        // 한 쪽이라도 넘치면 펼침면을 늘려 다시 나눈다.
        // 마지막 쪽만 보면 안 된다 — 첫 쪽에는 장 제목이 얹히므로 그쪽이 먼저 넘칠 수 있다.
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
    title: `시튼 동물기`,
    tag: `어니스트 톰프슨 시튼 원작`,
    intro: [
        `늑대를 잡아 상금을 받던 사냥꾼이 로보를 잡은 뒤로 사냥을 그만두고, 평생 야생 동물을 지키는 일을 했습니다.`,
        `일곱 편을 골라 담았습니다. 대개 주인공이 마지막에 죽습니다. 시튼이 왜 그렇게 썼는지도 함께 실었습니다.`
    ]
};

function coverPage() {
    const cv = CV();
    return `<div class="page page-cover">
 <div class="story-page-left story-page-left-full">
 ${artFrame('cover.webp', '🐺')}
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
    { q: "로보가 다른 늑대와 달랐던 점이 아닌 것은 무엇입니까?", choices: ["무리를 아주 작게 데리고 다녔다", "사람을 잘 따르고 가까이 왔다", "독을 넣은 미끼를 건드리지 않았다"], answer: 1 },
    { q: "시튼이 로보를 잡은 방법은 무엇입니까?", choices: ["여러 날 밤을 새우며 뒤를 밟았다", "블랑카를 먼저 잡아 그 냄새로 이끌었다", "덫을 오십 개 넘게 골짜기에 늘어놓았다"], answer: 1 },
    { q: "잡힌 뒤 로보는 어떻게 되었습니까?", choices: ["먹지 않고 들판만 보다가 세상을 떠났다", "사슬을 끊고 산으로 달아나 버렸다", "여러 해 우리 안에서 길러졌다"], answer: 0 },
    { q: "은점박이가 무리를 위해 한 일은 무엇입니까?", choices: ["먹이가 있는 곳을 혼자 찾아 두었다", "사람 사는 마을에 가까이 가지 않았다", "어린 까마귀들을 데리고 다니며 가르쳤다"], answer: 2 },
    { q: "은점박이가 죽은 뒤 무리에 생긴 변화는 무엇입니까?", choices: ["예전만큼 잘 해내지 못하게 되었다", "더 큰 무리로 불어나게 되었다", "곧 다른 우두머리가 나와 이어받았다"], answer: 0 },
    { q: "몰리가 랙에게 가르친 것이 아닌 것은 무엇입니까?", choices: ["가시덤불 사이로 빠져나가기", "쫓길 때 물을 건너 냄새 끊기", "위험할 때 큰 소리로 울기"], answer: 2 },
    { q: "몰리가 사냥개를 따돌린 방법은 무엇입니까?", choices: ["개가 지칠 때까지 들판을 빙빙 돌았다", "새끼를 굴에 넣고 입구를 막아 두었다", "일부러 자기가 쫓기며 깊은 물로 이끌었다"], answer: 2 },
    { q: "시튼이 랙 이야기 끝에 적은 말은 무엇입니까?", choices: ["짐승도 사람처럼 자식을 아끼는 법이다", "토끼가 오래 사는 것은 아는 것이 많아서다", "토끼는 빠른 발 하나로 살아남는 짐승이다"], answer: 1 },
    { q: "사슬에 매인 새끼 여우에게 어미가 밤마다 한 일은 무엇입니까?", choices: ["사람들이 잠든 사이 굴을 파 주었다", "먹이를 물어다 주고 사슬을 물어뜯었다", "멀리서 지켜보다가 날이 밝으면 갔다"], answer: 1 },
    { q: "빙고가 시튼을 구한 상황은 무엇입니까?", choices: ["두 손이 덫에 걸려 밤새 갇혔을 때", "눈보라 속에서 길을 잃었을 때", "늑대 무리에 둘러싸였을 때"], answer: 0 },
    { q: "빙고가 죽은 까닭은 무엇입니까?", choices: ["늑대 잡으려고 놓은 독 미끼를 먹어서", "늑대와 싸우다 크게 다쳤기 때문에", "너무 늙어 겨울을 못 넘겨서"], answer: 0 },
    { q: "왑이 혼자 자란 까닭은 무엇입니까?", choices: ["아주 어릴 때 사냥꾼에게 식구를 잃어서", "형제들과 싸우고 무리에서 나와서", "어미가 다른 골짜기로 떠나 버려서"], answer: 0 },
    { q: "곰이 나무에 발톱 자국을 높이 내는 까닭은 무엇입니까?", choices: ["다른 곰이 그 높이를 보고 물러가라고", "발톱을 갈아 날카롭게 하려고", "나무 열매를 따 먹으려고 오르다가"], answer: 0 },
    { q: "어미 뇌조가 여우 앞에서 한 행동은 무엇입니까?", choices: ["큰 소리를 내며 마주 달려들었다", "새끼를 몸 아래 감추고 버텼다", "날개가 부러진 척하며 끌고 갔다"], answer: 2 },
    { q: "시튼의 이야기가 대개 죽음으로 끝나는 까닭은 무엇입니까?", choices: ["슬픈 이야기가 사람들 마음에 오래 남아서", "그렇게 안 쓰면 아무도 저들을 지키려 안 해서", "실제로 그 짐승들이 다 그렇게 되었기 때문에"], answer: 1 },
    { q: "시튼의 동물 이야기가 그전 것들과 다른 점은 무엇입니까?", choices: ["사냥꾼의 눈으로만 짐승을 그렸다", "짐승이 사람처럼 말하게 하지 않았다", "여러 해 따라다니며 관찰한 것을 적었다"], answer: 2 },
    { q: "이 책을 읽고 난 반응으로 알맞지 않은 것은 무엇인가요?", wide: true, choices: ["시튼이 로보를 잡으려고 짝 블랑카를 먼저 잡은 것을 보면, 덫도 독도 안 통하던 늑대를 무너뜨린 건 마음 쪽이었어.", "시튼이 붙잡은 로보의 목에 줄을 걸어 산 채로 목장에 데려간 것을 보면, 산 늑대 값을 더 받으려고 그런 거야.", "목장 사람들이 로보의 몸을 블랑카 옆에 놓아 준 것을 보면, 잡던 사람들도 그 둘을 짐승으로만 보지는 않았네.", "짐승을 잡아 돈을 벌던 사람이 짐승 편에서 글을 쓰게 된 것을 보면, 이 책은 그 뒤집힘 위에 서 있구나."], answer: 1 }
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
