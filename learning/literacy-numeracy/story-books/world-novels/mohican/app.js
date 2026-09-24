const BOOK_TITLE = "모히컨 족의 최후";

const CHAPTER_LABEL = n => `${n}장 ·`;

const CHAPTERS = [
    {
        num: 1,
        title: "이 이야기를 읽기 전에",
        emoji: "🗺️",
        art: ["story-01-a.webp", "story-01-b.webp"],
        paras: [
            `이 이야기는 이백칠십 년쯤 전 북아메리카에서 벌어진 전쟁을 배경으로 합니다. 영국과 프랑스가 그 땅을 놓고 아홉 해 동안 싸운 전쟁이었습니다. 아메리카에서 시작해 유럽까지 번졌습니다. 유럽에서는 일곱 해를 싸웠기 때문에 그 전쟁을 칠년 전쟁이라고 부릅니다. 미국에서는 프렌치 인디언 전쟁이라고 부릅니다.`,
            `그런데 그 땅은 원래 두 나라 것이 아니었습니다. 두 나라 다 배를 타고 몇 달을 건너온 나라였습니다. 바다 건너에서 온 사람들이 그 땅을 나누어 가지려고 싸운 것입니다. 그 땅에 살던 사람들에게는 묻지 않았습니다. 영국은 동쪽 바닷가에 마을을 두고 있었습니다. 프랑스는 북쪽 캐나다 쪽에 있었습니다.`,
            `수천 년 전부터 그곳에 살던 사람들이 있었습니다. 콜럼버스가 오기 훨씬 전부터요. 모히컨, 델라웨어, 휴런, 이로쿼이, 모호크······ 지금 미국 땅에만 오백 갈래가 넘었다고 합니다. 북쪽 캐나다와 남쪽까지 세면 더 많았습니다. 다 세어 본 사람도 없습니다.`,
            `저마다 말이 달랐고, 살아온 방식이 달랐고, 이웃과 사이가 좋기도 하고 나쁘기도 했습니다. 바닷가에 사는 부족과 큰 호수 가에 사는 부족은 사는 모양이 아주 달랐습니다. 농사를 짓는 부족도 있고 사냥으로 사는 부족도 있었습니다. 말만 백 가지가 넘었습니다. 유럽에 여러 나라가 있는 것과 마찬가지였습니다. 영국 사람과 프랑스 사람을 한 덩어리로 부르지는 않습니다. 그런데 그 땅 사람들에게는 그렇게 했습니다. 그러니 그것을 한 덩어리로 묶어 부르는 것부터가 잘못입니다.`,
            `이것부터 짚어 두어야 합니다. '인디언'이라는 말은 그 사람들이 스스로 쓰던 말이 아닙니다. 남이 붙인 이름이었습니다. 콜럼버스가 그 땅을 인도인 줄 알고 그렇게 불렀고, 그 말이 그대로 굳었습니다. 인도까지 가는 뱃길을 찾다가 엉뚱한 데에 닿은 것이었습니다. 콜럼버스는 죽을 때까지 자기가 인도에 닿은 줄 알았습니다. 그러니 고칠 사람도 없었습니다.`,
            `잘못 부른 이름이 오백 년을 간 것입니다. 지금은 그 말을 쓰지 않으려는 사람이 많습니다. 그 사람들에게는 저마다 자기 이름이 있었습니다. 지금은 아메리카 원주민이라고 부르는 일이 많은데, 그것도 남이 붙인 이름이기는 합니다.`,
            `모히컨, 델라웨어, 휴런 같은 부족 이름이 그 사람들이 자기를 부르던 이름에 더 가깝습니다. 부족 이름은 대개 그 말로 사람이라는 뜻이었습니다. 델라웨어라는 이름도 남이 붙인 것입니다. 그 사람들이 스스로 부른 이름은 레나페였습니다. 유럽 사람들이 배를 타고 오면서 그 땅이 백 해 사이에 다 달라졌습니다.`,
            `먼저 퍼진 것은 병이었습니다. 천연두 같은 병이었습니다. 사람보다 병이 먼저 퍼져 나가서, 백인을 한 번도 못 본 마을에도 병이 먼저 닿았습니다. 물건을 주고받는 길을 따라 퍼졌습니다.`,
            `유럽에서는 오래 앓아 온 병이라 어느 정도 견뎠는데, 그 땅에는 없던 병이라 저항력이 없었습니다. 어떤 지방에서는 열에 아홉이 세상을 떠났고, 마을이 통째로 비는 일이 흔했습니다. 싸움이 나기도 전에 그렇게 되었습니다. 그래서 나중에 온 사람들은 그 땅이 원래 비어 있었다고 여겼습니다. 밭이 있고 길이 있는데 사람이 없었습니다. 그것을 보고 신이 비워 두었다고 하는 사람도 있었습니다.`,
            `그다음에 땅을 빼앗겼습니다. 조약을 맺고 빼앗기고, 다시 맺고 또 빼앗겼습니다. 글을 모르는 쪽이 늘 손해를 보았습니다. 적힌 것과 들은 것이 다른 일도 많았습니다. 조약을 읽어 주는 사람이 통역하는 사람이었습니다. 그 사람이 어느 편인지가 문제였습니다.`,
            `그리고 영국과 프랑스가 싸울 때, 각 부족은 어느 한쪽 편에 서야 했습니다. 어느 쪽에도 안 서면 양쪽에서 다 적으로 여겼기 때문에 그것이 제일 위험했습니다. 그러니 고르는 것이 아니라 떠밀린 것이었습니다. 영국 쪽에 서면 프랑스와 싸워야 하고, 프랑스 쪽에 서면 영국과 싸워야 했습니다.`,
            `그래서 그 땅 사람들끼리 서로 싸우게 되었습니다. 그것이 그 시절에 벌어진 일 가운데 제일 슬픈 일이었고, 두고두고 남은 일이었습니다. 그것이 이 이야기의 배경입니다. 그것을 만든 것은 바다 건너에서 온 나라들이었습니다.`
        ]
    },
    {
        num: 2,
        title: "숲으로 들어간 일행",
        emoji: "🌲",
        art: ["story-02-a.webp", "story-02-b.webp"],
        paras: [
            `1757년 여름, 전쟁이 시작된 지 세 해째였습니다. 끝이 보이지 않는 전쟁이었습니다. 그 전쟁은 그 뒤로 여섯 해를 더 갔습니다. 지금의 뉴욕주 북쪽 숲이었습니다. 호수와 강이 많아서 배로 다니는 것이 걸어 다니는 것보다 빨랐습니다. 자작나무 껍질로 만든 배를 썼습니다. 아주 가벼워서 한 사람이 어깨에 메고 옮겼습니다.`,
            `그 숲 한가운데, 호숫가에 윌리엄 헨리라는 영국군 요새가 있었습니다. 요새라고 해도 돌로 지은 것이 아니라 통나무로 지은 것이었습니다. 병사가 이천 명쯤 있었습니다. 통나무를 세우고 그 사이에 흙을 채워 쌓았습니다. 대포를 맞으면 오래 버티지 못하는 벽이었습니다.`,
            `그 요새의 사령관은 먼로 대령이었습니다. 예순이 넘은 스코틀랜드 사람이었습니다. 군인으로 산 지 사십 년이 넘었습니다. 그 사이에 여러 나라에서 싸웠습니다.`,
            `먼로 대령에게 딸이 둘 있었습니다. 언니 코라와 동생 앨리스였습니다. 아내를 여의고 혼자 키운 딸들이라 더 아꼈습니다. 딸들을 남쪽 요새에 두고 지냈습니다. 전쟁터에 둘 수는 없었기 때문입니다.`,
            `코라는 검은 머리에 눈이 깊었고, 앨리스는 금발에 얼굴이 하얬습니다. 어머니가 서로 달랐습니다. 코라의 어머니는 서인도 제도 사람이었는데, 그 시절 그것은 큰 흠으로 여겨졌습니다. 서인도 제도는 아메리카 남쪽 바다의 섬들입니다. 그곳에는 아프리카에서 끌려온 사람들이 많았습니다.`,
            `두 사람은 남쪽 에드워드 요새에 있다가 아버지가 있는 곳으로 가는 길이었습니다. 아버지가 위험하다는 말을 들었기 때문입니다. 가지 말라고 말리는 사람이 있었습니다. 코라가 가겠다고 했습니다.`,
            `일행은 다섯이었습니다. 말을 타고 갔고 짐은 거의 없었습니다. 숲길이라 실을 수가 없었습니다. 말이 지나가기도 어려운 길이었습니다. 나뭇가지가 얼굴에 닿았습니다.`,
            `코라와 앨리스, 두 사람을 데려다주는 던컨 헤이워드라는 젊은 소령, 노래 선생 데이비드 가무트, 그리고 길잡이였습니다. 길잡이의 이름은 마과였습니다. 휴런 부족 사람이라고 했는데, 영국군에서 일하고 있었습니다. 헤이워드는 그 사람을 믿었습니다. 군에서 오래 일한 사람이었기 때문입니다. 헤이워드는 그 사람의 지난 일을 몰랐습니다. 군에서 길잡이를 여럿 썼습니다. 그 사람들의 지난 일을 다 알아보지는 않았습니다.`,
            `일행은 큰길로 가지 않고 숲길로 갔습니다. 큰길은 프랑스군이 지키고 있으니 숲길로 가는 편이 안전하고 빠르다고 마과가 말했기 때문입니다. 거짓말에는 대개 참말이 섞여 있습니다. 큰길에 프랑스군이 있는 것은 사실이었습니다. 그래서 헤이워드가 그 말을 따른 것이었습니다.`,
            `그것이 첫 번째 잘못이었습니다.`,
            `그 무렵 그 숲은 사람이 다니기 아주 어려운 곳이었습니다. 나무가 빽빽해서 한낮에도 어두웠고, 길이라고 할 만한 것이 거의 없었습니다. 길을 아는 사람 없이 들어가면 나오지 못했습니다. 그래서 길잡이가 반드시 필요했습니다. 그 숲은 남북으로 며칠 길이었습니다. 가운데로 들어가면 마을이 하나도 없었습니다.`,
            `나침반도 소용이 없었고 나무 때문에 해도 잘 보이지 않았습니다. 길잡이가 마음을 바꾸면 그것으로 끝이었습니다. 그리고 그 일이 벌어지고 있었습니다. 나침반이 있어도 길이 없으면 소용이 없습니다.`,
            `반나절이 지나자 헤이워드는 이상하다고 느꼈습니다. 길이 자꾸 깊어졌고, 요새 쪽이 아니라 반대쪽으로 가는 것 같았습니다. 나무 사이로 보이는 해가 엉뚱한 쪽에 있었습니다.`,
            `그런데 헤이워드는 그것을 말하지 못했습니다. 잘못 보았을까 봐서요. 길잡이를 의심하는 것은 큰일이었습니다. 잘못 의심하면 그 사람이 손을 뗍니다. 저녁 무렵 일행은 사람 셋을 만났습니다.`,
            `한 사람은 백인이었습니다. 사슴 가죽옷을 입고 긴 총을 들고 있었습니다. 나이는 마흔쯤 되어 보였고 얼굴이 볕에 타 있었습니다. 말투가 무뚝뚝했습니다. 백인이라고 했는데 옷차림이 백인 것이 아니었습니다. 발에 신은 것도 가죽신이었습니다.`,
            `이름은 내티 범포라고 했는데, 사람들은 매의 눈이라고 불렀습니다. 숲에서 나고 자란 사람이라 글은 못 읽었지만 숲은 다 읽었습니다. 발자국만 보고 며칠 전 일을 알아냈고, 몇 사람이 지나갔는지도 알았습니다. 눌린 풀이 일어난 정도로 시각을 알았습니다. 이슬이 마른 자리도 보았습니다.`,
            `그 옆에 두 사람이 있었습니다. 늙은 사람은 칭가치국, 젊은 사람은 그 아들 웅카스였습니다. 웅카스는 스무 살쯤 되어 보였습니다. 칭가치국은 예순이 넘었습니다. 아들이 늦게 태어난 것이었습니다.`,
            `두 사람은 모히컨 사람이었습니다. 부족에서 남은 사람이 그 둘, 아버지와 아들뿐이라고 했습니다. 매의 눈은 백인이었지만 백인 마을에서 살지 않았습니다. 마을에 내려가는 것은 한 해에 몇 번뿐이었습니다. 화약과 소금을 사러 갔습니다.`,
            `어릴 때부터 숲에서 지냈고, 델라웨어 사람들에게 사냥을 배웠습니다. 칭가치국과는 스무 해 넘게 함께 다녔습니다. 말이 없어도 서로 다 알았습니다. 손짓 하나로 뜻이 통했습니다. 함께 사냥하고 함께 잤습니다.`,
            `그래서 두 세계를 다 알았습니다. 그런데 어느 쪽에도 온전히 속하지 못했습니다. 백인들은 그를 야인<span class="gloss">(마을 밖에서 거칠게 사는 사람)</span>이라고 했고, 부족들은 그를 백인이라고 했습니다.`,
            `그래서 그는 숲에서만 편했습니다. 매의 눈은 자기가 '피가 섞이지 않은 백인'이라는 말을 여러 번 했는데, 그것은 그 사람이 늘 자기 자리를 확인해야 했다는 뜻이기도 했습니다. 말하지 않으면 아무도 알아주지 않기 때문입니다. 그 말이 나올 때마다 칭가치국은 아무 말도 하지 않았습니다. 그 말이 무슨 뜻인지 알고 있었기 때문입니다. 그리고 나무라지도 않았습니다.`,
            `헤이워드가 길을 물었습니다. 그리고 마과의 이야기를 했습니다. 휴런 사람 하나가 길잡이를 하고 있는데 이름이 마과라고요.`,
            `그 이름이 나오자 셋이 다 움직임을 멈췄습니다. 매의 눈의 얼굴빛이 달라졌고, 칭가치국과 눈짓을 주고받았습니다. 그 숲에서 그 이름을 모르는 사람이 없었습니다. 다만 백인 군대에서는 몰랐습니다.`,
            `매의 눈이 물었습니다.<br>"그 사람이 지금 어디 있소?"<br>헤이워드가 대답했습니다.<br>"저기 나무 아래에 있습니다."<br>매의 눈이 아주 낮은 소리로 말했습니다.<br>"저 사람은 당신들을 엉뚱한 데로 데려가고 있소."`,
            `헤이워드는 그 말을 얼른 믿지 못했습니다. 처음 만난 사람의 말이었기 때문입니다. 마과는 군에서 오래 일한 사람이었습니다.`
        ]
    },
    {
        num: 3,
        title: "마과",
        emoji: "🔥",
        art: ["story-03-a.webp", "story-03-b.webp"],
        paras: [
            `그래도 헤이워드는 나무 사이로 보이던 해가 엉뚱한 쪽에 있던 것을 떠올리고 마과를 붙잡아 보기로 했습니다. 그런데 사람들이 다가가자 마과는 눈치를 채고 그 자리에서 달아났습니다. 매의 눈이 그 뒤를 쫓았지만 놓쳤습니다. 마과는 그 숲을 아주 잘 알았습니다. 어두워도 길을 잃지 않았습니다. 쫓기는 사람은 아는 길로 갑니다. 쫓는 사람은 그 길을 모릅니다.`,
            `총소리가 한 번 났는데 맞지 않았습니다. 숲이 어두웠기 때문입니다. 그날 밤 매의 눈이 헤이워드에게 마과 이야기를 했습니다. 불을 피우지 않고 이야기했습니다. 불빛이 멀리서 보이기 때문입니다.`,
            `마과는 원래 휴런 부족 사람이었습니다. 젊어서는 이름난 사냥꾼이었고 부족에서 앞자리에 앉던 사람이었다고 합니다. 그런데 몇 해 전에 부족에서 쫓겨났습니다. 술 때문이었다고 했습니다. 휴런 부족은 지금의 캐나다 남쪽에 살던 사람들이었습니다. 프랑스 쪽과 오래 물건을 주고받았습니다.`,
            `그 술도 원래 그 땅에 없던 것이었습니다. 백인들이 물건을 바꿀 때 술을 얹어 주고 가죽과 땅을 가져갔습니다. 그것을 마시고 나면 셈이 흐려졌습니다. 그렇게 잃은 땅이 아주 넓었습니다. 쫓겨난 마과는 모호크 부족에게 갔다가 다시 영국군에서 일하게 되었습니다. 부족에도, 백인 쪽에도 자기 자리가 없는 사람이었습니다.`,
            `그 사이에 이런 일이 있었습니다. 마과가 영국군 진영에서 술에 취해 소란을 피운 적이 있었습니다. 그때 사령관이 마과를 병사들 앞에서 채찍으로 때리게 했습니다. 그 사령관이 먼로 대령이었습니다. 코라와 앨리스의 아버지였습니다. 그는 그 일을 곧 잊었습니다. 그에게는 흔한 일이었기 때문입니다. 영국 병사들도 그렇게 맞았습니다.`,
            `그 시절 그 땅의 부족들에게 벌은 부끄러움을 주는 것이 아니었습니다. 잘못을 하면 값을 물게 하거나 무리에서 내보냈습니다. 때리는 벌은 없었습니다.`,
            `부족에 따라 다르기는 했지만 대개 그랬습니다. 다친 쪽 집안에 물건을 주었습니다. 몸을 상하게 하는 것보다 무리에서 내보내는 것이 더 무거운 벌이었습니다. 혼자서는 살 수 없었기 때문입니다. 겨울에 혼자 사냥해서 살아남기는 어려웠습니다.`,
            `그런데 사람을 묶어 놓고 여럿이 보는 앞에서 때리는 것은 그 사람을 사람으로 안 본다는 뜻이었습니다. 마과에게는 목숨을 잃는 것보다 무거운 일이었습니다. 아프고 말 일이 아니었습니다.`,
            `매를 맞은 뒤로 마과는 달라졌습니다. 그 뒤로 웃지 않았다고 합니다. 그리고 그 자리를 떠났습니다. 돌아갈 데도 없었습니다. 그 뒤로 여러 해를 이 편 저 편에서 일했습니다. 어느 편도 그를 식구로 받지 않았습니다.`,
            `먼로 대령은 그것을 몰랐습니다. 그리고 알아보려고 하지도 않았습니다. 모르는 것도 잘못이 될 때가 있습니다. 특히 힘을 가진 쪽이 모를 때 그렇습니다. 몰라서 한 일이 그렇게 오래갔습니다. 먼로 대령은 그 사람 이름도 기억하지 못했습니다. 그런데 그 사람은 그 이름을 잊지 않았습니다.`,
            `마과는 그것을 잊지 않고 몇 해를 벼르고 있었습니다. 그런데 먼로 대령의 딸들이 그 숲으로 들어온 것이었습니다. 마과에게는 기다리던 날이었습니다. 군에서 길잡이를 맡은 것도 그 때문이었습니다. 그 자리에 있으면 언젠가 기회가 옵니다.`,
            `마과가 하는 일은 잔인했습니다. 사람을 붙잡고 죽이고 겁을 주었습니다. 그것을 좋게 볼 수는 없습니다. 다만 그 사람 하나만 나쁜 사람이었던 것은 아니었습니다.`,
            `나쁜 일에는 대개 그 앞이 있습니다. 그 앞을 보지 않으면 같은 일이 또 일어납니다. 마과가 그렇게 되기까지 있었던 일이 그러했습니다. 남는 것이 사람 하나에 대한 미움뿐이면 안 됩니다. 그날 밤 일행은 강 한가운데 바위섬의 동굴에 숨었습니다. 매의 눈이 물가에 숨겨 두었던 자작나무 껍질 배를 꺼내 일행을 태워 건넸습니다.`,
            `폭포 뒤쪽의 굴이었습니다. 물소리가 커서 말소리가 들리지 않았습니다. 숨기에는 좋은 데였습니다. 강 한가운데라 배가 없으면 닿지 못했습니다. 위아래로 물이 세게 흘렀습니다. 글렌스 폭포라는 데였습니다.`,
            `그런데 새벽에 마과가 무리를 데리고 왔습니다. 싸움이 벌어졌습니다. 좁은 바위 위에서였습니다. 뒤로 물러설 데가 없었습니다.`,
            `아래는 폭포였습니다. 매의 눈과 두 모히컨 사람은 화약이 다 떨어졌습니다. 칼과 도끼만 남았습니다. 마과 쪽은 열이 넘었습니다. 바위 위로 하나씩 기어 올라오고 있었습니다. 바위가 젖어 있어서 미끄러웠습니다.`,
            `그것으로는 오래 버티지 못합니다. 셋이 열을 상대하는 셈이었습니다.`,
            `매의 눈이 말했습니다.<br>"우리가 남아 있어도 소용이 없소. 우리가 빠져나가서 사람을 데려오겠소."<br>코라가 말했습니다.<br>"가세요. 그것이 낫습니다."`,
            `코라가 이렇게 덧붙였습니다.<br>"우리 아버지에게 전해 주세요. 저희가 겁내지 않았다고요."<br>매의 눈이 말했습니다.<br>"내가 반드시 돌아오겠소."`,
            `코라가 아버지에게 남긴 말은 그것뿐이었습니다. 동생을 뒤에 두고 그 말을 했습니다. 앨리스는 그 말을 알아듣지 못했습니다. 세 사람은 강물로 뛰어들었습니다. 물살이 아주 세서 마과의 무리는 그 물로 뛰어들지 못했습니다. 그래서 세 사람은 살아 나갔습니다.`,
            `그리고 나머지 사람들은 붙잡혔습니다. 매의 눈의 그 약속은 나중에 지켜집니다. 그는 약속을 어기는 사람이 아니었습니다. 숲에서는 약속이 종이보다 무거웠습니다. 적어 둘 종이가 없기 때문입니다.`
        ]
    },
    {
        num: 4,
        title: "구출",
        emoji: "🌊",
        art: ["story-04-a.webp", "story-04-b.webp"],
        paras: [
            `마과는 붙잡은 사람들을 데리고 숲으로 갔습니다. 하루를 꼬박 걸었습니다. 아무것도 먹이지 않았습니다. 앨리스는 걷다가 몇 번이나 주저앉았습니다. 그때마다 코라가 일으켜 세웠습니다. 동생을 업고 걸은 데도 있었습니다. 앨리스는 그때까지 그렇게 걸어 본 적이 없었습니다. 요새 안에서만 지낸 아이였습니다.`,
            `어느 언덕에서 마과가 코라에게 이렇게 말했습니다.<br>"네가 나와 함께 살겠다고 하면 나머지를 다 놓아 주겠다."<br>코라가 물었습니다.<br>"왜 그런 것을 원합니까."<br>마과가 말했습니다.<br>"네 아버지가 나를 사람들 앞에서 때렸다. 그 사람 딸이 내 오두막에서 물을 긷고 옥수수를 빻으면, 그 사람이 그것을 알게 될 것이다."`,
            `딸에게 갚겠다는 말이었습니다. 아버지에게 갚을 수는 없었기 때문입니다. 먼로 대령은 요새 안에 있었습니다. 병사 이천 명이 그 둘레를 지키고 있었습니다. 몇 해를 벼르고도 손이 닿지 않았습니다. 코라는 거절했습니다.`,
            `잠깐도 망설이지 않았습니다. 동생을 살릴 수 있는 길이었는데도 그랬습니다. 자기가 그렇게 하면 앨리스는 아버지에게 돌아갑니다. 그것을 셈해 보고 나서 거절한 것이었습니다.`,
            `코라가 이렇게 말했습니다.<br>"제 아버지가 당신에게 한 일이 잘못이라는 것은 압니다. 그런데 그것을 저에게 갚으라고 하는 것도 잘못입니다."`,
            `마과가 코라를 오래 보았습니다. 그런 대답을 들은 적이 없었기 때문입니다. 대개는 울거나 빌었습니다. 자기가 한 일이 잘못이라고 먼저 말한 사람도 없었습니다. 백인 쪽에서는 더욱 그랬습니다. 마과는 그 대답을 듣고 아무 말도 하지 않았습니다. 그리고 돌아섰습니다.`,
            `코라는 그 자리에서 겁난 얼굴을 보이지 않았습니다. 동생을 뒤에 두고 앞에 섰습니다. 앨리스는 열일곱이었고 코라는 스물이 넘었습니다. 앨리스는 무서우면 울었습니다. 코라는 울지 않았습니다.`,
            `코라는 아주 강한 사람이었습니다. 동생 앨리스가 무서워서 울면 코라가 안아 주었고, 결정을 해야 할 때는 늘 코라가 했습니다. 자기도 무서웠는데 그랬습니다. 동생이 보고 있었기 때문입니다.`,
            `헤이워드보다 코라가 먼저 정했습니다. 헤이워드도 그것을 알고 있었습니다. 그래서 코라를 어려워했습니다. 헤이워드는 앨리스를 마음에 두고 있었습니다. 그런데 정할 일이 생기면 코라를 보았습니다.`,
            `여자가 앞에 나서면 다들 이상하게 여기던 때였습니다. 코라는 그러거나 말거나 스스로 정하고 스스로 말했습니다. 그리고 그 값을 자기가 치렀습니다. 코라는 그 일행 가운데 가장 어려운 자리에 있었습니다. 그런데 그것을 알아주는 사람이 없었습니다. 그때 숲에서 총소리가 났습니다.`,
            `코라가 고개를 들었습니다. 숲에서 사람이 뛰어나왔습니다. 매의 눈이 앞장서고 있었습니다.`,
            `매의 눈과 칭가치국과 웅카스가 돌아온 것이었습니다. 싸움 끝에 사람들이 풀려났습니다. 매의 눈이 먼저 총을 쏘고 두 사람이 뒤로 돌아 들어갔습니다. 셋이 미리 정해 둔 방식이었습니다. 말을 나누지 않고도 그대로 했습니다. 앨리스가 코라의 팔에 매달렸습니다. 매의 눈이 약속을 지킨 것이었습니다. 동굴에서 한 그 약속이었습니다.`,
            `이틀 만에 지켰습니다. 이틀 동안 밤에도 걸었습니다. 자국을 놓치지 않으려고 그랬습니다. 마과는 또 달아났습니다. 일행은 다시 요새로 향했습니다. 이번에는 매의 눈이 길잡이였습니다.`,
            `가는 길에 코라가 웅카스와 이야기를 나누게 되었습니다. 웅카스는 말이 아주 적은 사람이었습니다. 하루에 열 마디를 하지 않았고, 웃는 것을 본 사람도 드물었습니다. 그런데 코라 앞에서는 달랐습니다. 먼저 말을 걸기도 했습니다. 아버지가 그것을 보고 있었습니다.`,
            `웅카스가 먼저 물었습니다.<br>"당신들은 왜 이 숲으로 왔습니까."<br>"아버지를 뵈러 갑니다."<br>"이 숲은 당신들이 다닐 데가 아닙니다."<br>"압니다."<br>그러고는 코라가 이렇게 물었습니다.<br>"당신 부족은 몇 사람입니까?"<br>웅카스가 대답했습니다.<br>"저희 아버지와 저입니다."`,
            `웅카스가 이 숲은 다닐 데가 아니라고 한 것은 나무라는 말이 아니었습니다. 걱정해서 한 말이었습니다. 부족이 몇 사람이냐는 물음에는 아주 담담하게 대답했습니다. 자랑도 아니고 원망도 아니었습니다. 코라는 그다음 말을 잇지 못했습니다.`,
            `부족이 둘이라는 말을 그때 처음 들었습니다. 나라 하나가 두 사람인 것이었습니다. 코라는 그 뒤로 웅카스를 다르게 보았습니다. 부족이 둘이면 그 사람이 없어지면 하나가 됩니다. 코라는 그것을 그 자리에서 셈해 보았습니다.`,
            `그날 밤 헤이워드가 매의 눈에게 물었습니다.<br>"저 두 분은 왜 우리를 돕습니까."<br>매의 눈이 말했습니다.<br>"당신들을 돕는 게 아니오."<br>"그럼 무엇입니까."<br>"저 사람들은 자기가 옳다고 여기는 것을 하는 거요. 그건 당신들과 상관이 없소."`,
            `매의 눈은 그 말을 아주 짧게 했습니다. 헤이워드는 그 말을 오래 생각했습니다. 그때까지 그는 그 두 사람이 자기들을 위해 나선 줄 알았습니다. 그런데 아니었습니다.`,
            `그 두 사람에게는 자기들만의 까닭이 있었습니다. 헤이워드는 그 까닭이 무엇인지 끝내 묻지 못했습니다. 물어도 대답을 듣지 못했을 것입니다. 매의 눈도 스무 해 만에 겨우 알았습니다.`
        ]
    },
    {
        num: 5,
        title: "칭가치국의 이야기",
        emoji: "🌅",
        art: ["story-05-a.webp", "story-05-b.webp"],
        paras: [
            `그날 밤 불가에서 칭가치국이 이런 이야기를 했습니다. 묻지도 않았는데 시작했습니다. 그런 이야기를 하는 것은 처음이라고 했습니다. 웅카스도 그날 처음 들은 것이었습니다.`,
            `"내 부족은 원래 저 아래 바다 쪽에 살았소. 우리는 그곳을 흐르는 물의 땅이라고 불렀소. 거기서 우리는 오래 살았소. 마을이 여럿이었고, 강마다 우리 사람이 있었소. 그러다 큰 배가 왔소. 처음에는 사이가 나쁘지 않았소. 우리가 그 사람들에게 먹을 것을 주었고, 그 사람들이 우리에게 물건을 주었소. 그런데 그 사람들이 자꾸 늘었소. 그리고 우리는 자꾸 줄었소. 병이 먼저 왔소. 한 마을이 한 달 만에 비었소. 그다음에 땅이 갔소. 우리는 서쪽으로 옮겼고, 또 옮겼고, 또 옮겼소. 옮길 때마다 조약을 맺었소. 여기까지가 너희 땅이라고 종이에 적었소. 그리고 그 종이가 몇 해를 못 갔소. 나는 그런 종이를 여러 장 보았소."`,
            `헤이워드가 물었습니다.<br>"지금은 몇 분이나 남으셨습니까."`,
            `칭가치국이 불을 오래 보았습니다. 대답하는 데 한참이 걸렸습니다. 세어 볼 것도 없는 수였습니다. 둘이었습니다.`,
            `칭가치국이 이렇게 말했습니다.<br>"나와 내 아들이오. 그리고 내 아들이 마지막이오."`,
            `그 말 뒤에 불 타는 소리만 났습니다. 웅카스는 고개를 숙이고 있었습니다. 웅카스는 그 말이 자기 이야기라는 것을 알았습니다.`,
            `헤이워드도 코라도 아무 말도 하지 못했습니다. 미안하다는 말도 나오지 않았습니다. 미안하다고 하면 자기가 한 일이 됩니다. 헤이워드는 그것을 한 적이 없었습니다.`
        ]
    },
    {
        num: 6,
        title: "요새에 닿다",
        emoji: "🏰",
        art: ["story-06-a.webp", "story-06-b.webp"],
        paras: [
            `일행은 마침내 윌리엄 헨리 요새에 닿았습니다. 처음에 사흘이면 될 길이라고 했는데 여러 날이 걸렸습니다. 마과가 길을 돌린 데다 붙잡혔다 풀려나기까지 했습니다. 그런데 그 요새는 이미 프랑스군에 포위되어 있었습니다. 둘레에 프랑스군 천막이 가득했고 대포도 여러 문이었습니다. 프랑스군은 팔천 명이 넘었습니다. 안에 있는 사람의 네 배였습니다.`,
            `안개 낀 새벽에 매의 눈이 앞장서서 일행이 몰래 들어갔습니다. 안개가 없었으면 못 들어갔을 것입니다. 그 호수 둘레는 아침마다 안개가 짙었습니다. 물이 차고 공기가 따뜻하면 그렇게 됩니다.`,
            `먼로 대령이 두 딸을 맞았습니다. 딸들을 안고 한참 아무 말도 하지 못했습니다. 오지 말라고 사람을 보낸 참이었습니다. 그 사람이 중간에 붙잡혔던 것입니다. 여러 달 만에 보는 딸들이었습니다. 딸들이 그 안으로 들어온 것이 반가운 일만은 아니었습니다. 나갈 길이 이미 막혀 있었습니다.`,
            `요새 안 사정은 아주 나빴습니다. 프랑스군이 대포를 계속 쏘았고, 성벽이 무너져 가고 있었습니다. 대포는 하루에 몇백 발씩 날아왔습니다. 밤에도 그쳤다 이어졌다 했습니다. 안에 있는 대포는 몇 문 되지 않았습니다. 그것도 여러 문이 터져서 못 쓰게 되어 있었습니다. 화약도 얼마 남지 않았습니다. 대포알이 통나무 벽에 박히면 나무가 쪼개졌습니다. 그것을 밤새 고쳤습니다.`,
            `먼로 대령은 남쪽 에드워드 요새에 여러 번 사람을 보내 도움을 청했습니다. 걸어서 사흘 거리였고 거기에는 군대가 있었습니다. 오천 명이 넘는 군대였습니다. 그러니 오기만 하면 될 일이었습니다. 그런데 답이 오지 않았습니다. 보낸 사람이 돌아오지 않은 적도 있었습니다. 길에서 붙잡힌 것이었습니다.`,
            `그러던 어느 날, 프랑스군이 편지를 하나 보내왔습니다. 에드워드 요새의 사령관이 쓴 편지였습니다. 먼로 대령의 부탁으로 그 요새에 다녀오던 매의 눈이 길에서 프랑스군에 붙잡혔고, 프랑스군이 그 편지를 가로챈 것이었습니다. 읽지 않고 태울 수도 있었습니다. 그런데 편지를 봉한 자리가 이미 뜯겨 있었습니다.`,
            `항복을 받아 내려던 것이었습니다. 기다릴 것이 없다는 것을 알려 주면 버티지 못합니다. 프랑스군 사령관 몽칼름은 그것을 노렸습니다. 그 편지에는 이렇게 적혀 있었습니다.<br>"보낼 군대가 없다. 알아서 하라."`,
            `그것이 전부였습니다. 먼로 대령은 그 편지를 읽고 오래 앉아 있었습니다. 그 편지가 진짜인지 아닌지도 알 수 없었습니다. 요새 안에는 이천 명이 있었고, 병사만 있는 것이 아니었습니다. 병사들의 식구도 함께 있었습니다. 요새 안에 아이도 있었습니다.`,
            `그때 프랑스군 사령관 몽칼름 장군이 회담을 청했습니다.<br>"요새를 넘기십시오. 그 대신 여러분은 무기를 들고 남쪽으로 걸어 나가도 좋습니다. 아무도 건드리지 않겠습니다."`,
            `몽칼름은 그 시절 프랑스군에서 가장 이름난 장수였습니다. 나중에 퀘벡에서 세상을 떠나는 그 사람인데, 두 해 뒤의 일입니다. 그 싸움에서 영국이 이겼습니다. 그것으로 그 땅의 주인이 바뀌었습니다.`,
            `그는 규칙을 지키는 사람으로 알려져 있었고, 요새를 부수고 사람을 다 없애는 방식을 좋아하지 않았습니다. 그래서 유럽식 규칙대로 그런 조건을 낸 것입니다. 그런데 그 규칙은 유럽에서 만든 규칙이었습니다. 그 땅 사람들에게는 물어본 적이 없었습니다.`,
            `먼로 대령은 그 말을 오래 생각했습니다. 항복하면 요새를 잃습니다. 버티면 사람을 잃습니다. 믿어도 되는 말인지 알 수 없었습니다. 몽칼름이 규칙을 지킨다는 이름 하나를 믿는 수밖에 없었습니다. 그 시절 전쟁에서는 그런 방식이 있었습니다. 싸움을 끝내는 대신 진 쪽이 안전하게 물러가게 해 주는 것이었습니다. 그렇게 하면 서로 사람을 덜 잃습니다. 다음에 또 싸울 사람들이었기 때문입니다.`,
            `명예로운 항복이라고 불렀습니다. 깃발을 내리지 않고 나가게 해 주기도 했습니다. 그것이 그 시절 군인들이 지키던 것이었습니다. 무기를 들고 나가게 해 주는 것이 그 표시였습니다. 먼로 대령은 그것을 받아들였습니다. 다른 수가 없었기 때문입니다.`,
            `더 버티면 다 죽습니다. 먼로 대령은 그것을 여러 번 보아 온 사람이었습니다. 물도 떨어져 가고 있었습니다. 앓는 사람도 늘었습니다. 이튿날 아침, 안개가 짙은 가운데 그 사람들이 요새를 나섰습니다. 줄이 아주 길었습니다. 그러니 줄의 앞뒤가 서로를 보지 못했습니다.`,
            `그런데 몽칼름이 미처 생각하지 못한 것이 있었습니다. 프랑스군과 함께 싸운 여러 부족 사람들이었습니다. 그 사람들은 그 조건에 동의한 적이 없었습니다. 회담 자리에 부르지도 않았습니다. 프랑스군은 그 사람들을 셈에 넣지 않았습니다. 함께 싸운 사람들이었는데도 그랬습니다. 천오백 명이 넘었다고 합니다.`,
            `그리고 그 사람들에게 프랑스군이 약속한 것을 주지 않았습니다. 싸움에 이기면 얻을 것이 있다고 하고 데려온 것이었습니다.`,
            `그 사람들은 먼 데서 여러 달을 걸어와 싸웠습니다. 그런데 아무것도 받지 못한 채 돌아가게 되어 있었습니다. 그 일이 그날 아침의 배경입니다. 겨울에 먹을 것을 마련하러 온 사람도 있었습니다. 그날 그 길에서 큰일이 났습니다. 약속을 지키지 않은 쪽이 먼저 있었습니다.`,
            `몽칼름은 그 뒤로 오랫동안 그 일로 비난을 받았습니다. 그리고 그 사람 자신도 그 일을 무겁게 여겼다는 기록이 있습니다. 막지 못한 것도 잘못이라고 했습니다.`
        ]
    },
    {
        num: 7,
        title: "그날 아침",
        emoji: "🌫️",
        art: ["story-07-a.webp", "story-07-b.webp"],
        paras: [
            `1757년 팔월, 윌리엄 헨리 요새에서 물러나던 사람들이 요새를 나선 지 얼마 되지 않아 길에서 습격을 받았습니다. 그날 그 혼란 속에서 마과가 코라와 앨리스를 데려갔습니다. 그리고 북쪽으로 갔습니다. 아무도 그것을 보지 못했습니다. 다들 제 목숨을 챙기고 있었고, 헤이워드는 긴 줄의 다른 쪽에 있어서 그것을 보지 못했습니다.`,
            `며칠 뒤 프랑스군에게서 풀려난 매의 눈이 칭가치국과 웅카스를 다시 만나, 헤이워드와 함께 그 자리에 도착했습니다. 아무도 없었습니다.`,
            `요새는 이미 불타 있었습니다. 프랑스군이 태우고 물러간 것이었습니다. 잿더미만 남아 있었습니다. 통나무 벽이 검게 그을려 쓰러져 있었습니다. 타다 만 기둥에서 아직 연기가 났습니다.`,
            `웅카스가 무릎을 꿇고 풀을 헤치며 땅을 살폈습니다. 한참을 그러고 있었습니다. 그리고 발자국을 찾아냈습니다. 아무도 말을 걸지 않았습니다.`,
            `"이쪽입니다."`,
            `다른 사람들 눈에는 아무것도 보이지 않았습니다. 그냥 풀밭이었습니다. 풀이 한쪽으로 눕는 방향이 달랐던 것입니다. 웅카스는 그것을 손끝으로 짚어 보였습니다.`,
            `네 사람은 그 자국을 따라 북쪽으로 갔습니다. 밤에도 걸었고, 그 추적이 여러 날 이어졌습니다. 땅에 남은 발자국, 꺾인 나뭇가지, 눌린 이끼, 물가의 자국. 그것이 다 글자였고, 웅카스는 그것을 다 읽었습니다.`,
            `헤이워드는 그것을 옆에서 보면서 아무것도 알아보지 못했습니다. 소령이었고 배운 사람이었는데도 그랬습니다. 여기서는 그것이 아무 소용이 없었고, 숲에서는 다른 것을 알아야 했습니다. 이 숲에서는 자기가 아무것도 아니라는 생각을 헤이워드는 그 며칠 사이에 처음 했습니다.`
        ]
    },
    {
        num: 8,
        title: "델라웨어 마을",
        emoji: "🛖",
        art: ["story-08-a.webp", "story-08-b.webp"],
        paras: [
            `자국을 따라가니 두 갈래로 나뉘어 있었습니다. 일부러 그렇게 한 것이었습니다. 둘을 함께 두면 쫓기 쉽기 때문입니다. 마과는 그런 것을 잘 알았습니다. 쫓기며 사는 데 익숙한 사람이었습니다. 부족에서 쫓겨난 뒤로 늘 그렇게 살았습니다.`,
            `마과가 두 사람을 따로 떼어 놓은 것이었습니다. 앨리스는 휴런 마을에, 코라는 그 근처 델라웨어 마을에 맡겨져 있었습니다. 두 마을은 골짜기 하나를 사이에 두고 있었습니다. 사이가 좋지 않았습니다. 골짜기 아래로 냇물이 흘렀습니다. 양쪽 마을에서 그 물을 길어다 썼습니다.`,
            `한쪽은 프랑스 편이고 한쪽은 아니었습니다. 네 사람은 나뉘어 두 마을에 들어갔습니다. 들키면 그것으로 끝이었습니다. 돌아 나올 길도 정해 두지 못했습니다. 들어가고 나서 생각하기로 했습니다.`,
            `힘으로는 될 일이 아니었습니다. 넷이서 마을 둘을 상대할 수는 없었습니다. 마을마다 사람이 백 명이 넘었습니다.`,
            `그래서 여러 가지 방법을 썼습니다. 헤이워드는 얼굴에 색을 칠하고 병 고치는 사람 행세를 하며 휴런 마을에 들어갔습니다. 그 마을에 앓는 사람이 있었기 때문입니다. 헤이워드는 의술을 몰랐습니다.`,
            `그 마을 사람들은 앓는 사람이 있으면 낯선 이라도 들여보내 주었습니다. 그것만은 어느 부족이나 같았습니다. 고치는 사람은 어느 편이든 손님으로 들였습니다. 그것이 그 사람들의 규칙이었습니다.`,
            `헤이워드는 그것을 이용한 것입니다. 나중에 그는 그 일을 오래 마음에 두었습니다. 남의 규칙을 이용한 것이었기 때문입니다.`,
            `좋은 규칙일수록 이용하기 쉽습니다. 믿는 사람이 손해를 봅니다. 매의 눈은 곰 가죽을 뒤집어쓰고 들어갔습니다. 숲에서 오래 산 사람이라 곰이 걷는 모양을 그대로 냈습니다. 어깨를 흔들며 네 발로 걸었습니다. 마을 개들이 짖다가 그쳤습니다. 곰 가죽을 쓴 매의 눈이 헤이워드를 앨리스가 갇힌 굴로 이끌었고, 헤이워드는 앨리스를 데리고 휴런 마을을 빠져나와 코라가 있는 델라웨어 마을로 몸을 피했습니다.`,
            `그리고 웅카스는 붙잡혔습니다. 일부러 붙잡힌 것인지도 모릅니다. 다만 그 덕에 마을 한가운데로 들어가게 되었습니다.`,
            `마을 한가운데에서 재판이 열렸습니다. 그날 그 자리에서 모든 것이 정해졌습니다.`,
            `델라웨어 마을에는 타메눈드라는 아주 늙은 사람이 있었습니다. 백 살이 넘었다고 했고 앞을 잘 보지 못했습니다. 그래도 그 마을의 일을 정하는 사람, 제일 무거운 말을 하는 사람이었습니다. 그 말 한마디로 사람의 목숨이 오갔습니다.`,
            `마과가 그 앞에 나와 코라를 자기에게 달라고 했습니다. 손님으로 온 것이니 법을 지키라고 했습니다. 그 법이 자기를 지켜 준다는 것도 알고 있었습니다. 그래서 겁 없이 걸어 들어온 것이었습니다.`,
            `붙잡힌 웅카스도 그 앞에 끌려 나왔습니다. 타메눈드가 웅카스를 가까이 오라고 했습니다. 눈이 어두워 잘 보이지 않았기 때문입니다.`,
            `그리고 이렇게 물었습니다.<br>"너는 누구냐."`,
            `웅카스는 대답하지 않았습니다. 대신 묶인 채로 앞으로 걸어 나가 타메눈드 앞에 섰습니다. 곁에 있던 사람 하나가 그 웃옷을 벗겨 냈습니다.`,
            `그 가슴에 문신이 있었습니다. 푸른 물감으로 새긴 거북이었습니다. 그 집안에서는 아이가 태어나면 그것을 새겼습니다.`,
            `타메눈드가 손으로 그 자국을 더듬어 보고는 자리에서 일어섰습니다. 백 살이 넘은 사람이 혼자 일어섰습니다. 아무도 부축하지 않았고, 아무도 그러지 못했습니다. 마을이 물을 끼얹은 듯했습니다. 불 옆에 앉아 있던 사람들이 하나씩 일어섰습니다.`,
            `델라웨어와 모히컨은 아주 먼 옛날 한 갈래에서 갈라진 사람들이었습니다. 말도 서로 통했습니다. 그리고 그 거북을 쓰는 집안은 그 갈래에서 가장 오래된 집안이었습니다.`,
            `타메눈드는 그 집안이 끊어진 줄 알고 있었습니다. 여든 해 동안 못 본 표시였습니다.`,
            `타메눈드가 말했습니다.<br>"나는 어릴 때 이 표시를 가진 사람을 보았다. 그것이 여든 해 전이다. 그 집안이 아직 남아 있느냐."<br>웅카스가 말했습니다.<br>"저와 제 아버지입니다."`,
            `그 말이 두 번째였습니다. 아버지가 한 말을 아들이 그대로 했습니다. 마을이 조용해졌습니다. 백 살 노인이 그 아이의 어깨에 손을 얹었습니다. 손이 아주 오래 그 자리에 있었습니다.`
        ]
    },
    {
        num: 9,
        title: "타메눈드의 판단",
        emoji: "⚖️",
        art: ["story-09-a.webp", "story-09-b.webp"],
        paras: [
            `타메눈드는 웅카스를 풀어 주었습니다. 칼을 가져오라고 해서 자기 앞에서 밧줄을 끊게 했습니다. 마을 사람들이 둘러서서 그것을 지켜보았습니다. 웅카스는 그 자리에 그대로 서 있었습니다. 손목에 밧줄 자국이 붉게 나 있었습니다. 웅카스는 그것을 문지르지도 않았습니다. 아무도 그것을 보지 못한 척했습니다.`,
            `타메눈드는 마과에게 이렇게 말했습니다.<br>"너는 이 마을에 손님으로 왔다. 손님은 자기 것을 가지고 간다. 그것이 우리 법이다. 그 여자는 네 것이라고 했으니 데려가라."<br>헤이워드가 소리쳤습니다.<br>"사람을 물건처럼 말씀하십니까!"<br>타메눈드가 말했습니다.<br>"나는 그렇게 말한 적이 없다. 나는 우리 법을 말했다. 그리고 그 법을 만든 것은 우리가 아니다. 그 법은 우리가 너희에게서 배운 것이다."`,
            `타메눈드의 목소리가 낮았습니다. 백 살이 넘은 사람의 목소리였습니다. 그런데 그 자리에서 제일 잘 들렸습니다. 헤이워드의 얼굴이 굳었습니다.`,
            `헤이워드는 그 말에 아무 대답도 하지 못했습니다. 그 말이 맞았기 때문입니다. 낮은 목소리로 한 말이 더 무거웠습니다. 그 시절 유럽 사람들이 그 땅에서 사람을 잡아다 팔고 있었습니다. 아프리카에서 아메리카로 사람을 실어 나르는 배가 해마다 여러 척이었습니다. 그것이 그 무렵 큰 장사였습니다.`,
            `사람을 물건으로 셈한 것은 그쪽이 먼저였습니다. 배 밑창에 사람을 눕혀 실었습니다. 그 배에서 살아 닿지 못한 사람이 아주 많았습니다.`,
            `그리고 부족들 사이의 오래된 규칙도 그것 때문에 뒤틀려 있었습니다. 그 전에는 사로잡은 사람을 식구로 들이는 일이 흔했습니다. 싸움에서 잃은 사람 자리를 그렇게 채웠으니, 사로잡힌 사람이 그 집안 사람이 되었습니다. 아이를 낳고 그 마을에서 늙었습니다.`,
            `타메눈드가 마과에게 물었습니다.<br>"너는 그 여자만 데려가겠느냐, 나머지도 원하느냐."<br>마과가 대답했습니다.<br>"그 여자만 데려가겠다."<br>타메눈드가 말했습니다.<br>"그럼 가거라. 다만 해가 질 때까지는 아무도 너를 쫓지 못한다. 그것도 우리 법이다. 해가 지고 나면 나는 막지 않겠다."`,
            `손님을 해치지 않는다는, 그 마을의 아주 오래된 법이었습니다. 그 법이 없으면 어느 마을에도 들어갈 수 없었습니다. 그래서 다들 그 법만은 지켰습니다. 손님을 해치면 그 마을에는 소식도 물건도 오지 않게 됩니다. 그러면 그 마을이 굶습니다. 나머지에는 관심이 없어서 앨리스도 헤이워드도 놓아두었습니다. 마과는 코라를 데리고 마을을 나갔고, 아무도 막지 않았습니다. 헤이워드가 앞으로 나서려다 붙들렸습니다. 델라웨어 사람들이 말린 것이었습니다.`,
            `웅카스도 주먹을 쥐고 그 자리에 서 있었습니다. 해가 어디까지 내려왔는지 몇 번이나 보았습니다. 골짜기 건너 산등성이에 걸린 해였습니다. 여름이라 해가 늦게 졌습니다. 그 반나절이 아주 길었습니다. 해가 지자 웅카스가 일어섰습니다. 델라웨어 사람들이 함께 일어섰습니다.`,
            `법은 법이고 그다음은 그다음이었습니다. 법을 어긴 것이 아니었습니다. 골짜기에 그늘이 다 내린 뒤, 델라웨어 사람들이 소리 없이 골짜기로 내려갔습니다.`,
            `그날 저녁 그 골짜기에서 싸움이 벌어졌습니다. 휴런 쪽 사람이 더 많았습니다. 그런데 델라웨어 쪽은 자기 땅에서 싸웠습니다. 그것이 큰 차이였습니다.`,
            `한나절도 걸리지 않았습니다. 그리고 여러 사람이 그 자리에서 목숨을 잃었습니다. 골짜기 아래에서 냇물 소리만 그대로 났습니다. 싸움이 시작될 때도 끝날 때도 같은 소리였습니다. 그 냇물은 양쪽 마을이 함께 쓰던 물이었습니다.`
        ]
    },
    {
        num: 10,
        title: "벼랑 위",
        emoji: "⛰️",
        art: ["story-10-a.webp", "story-10-b.webp"],
        paras: [
            `마과는 코라를 데리고 벼랑 쪽으로 달아났습니다. 무리 둘이 함께 갔습니다. 코라는 걸어서 갔습니다. 손목이 묶이지 않은 채였습니다. 마과는 그 여자가 달아나지 않으리라는 것을 알고 있었습니다. 코라는 뒤를 한 번도 돌아보지 않았습니다. 돌아보면 쫓아오는 사람이 보입니다. 그러면 마과도 그것을 압니다.`,
            `웅카스가 그 뒤를 쫓았습니다. 델라웨어 사람들이 그 뒤를 따랐습니다. 웅카스가 제일 빨랐습니다. 뒤따르던 사람들이 따라잡지 못했습니다.`,
            `벼랑 위 좁은 바위 길에서 마과가 걸음을 멈췄습니다. 아래는 낭떠러지였습니다. 바위 길이 한 사람 폭이었습니다. 옆으로 비켜설 데가 없었습니다.`,
            `그리고 코라에게 말했습니다.<br>"함께 가겠느냐, 여기 남겠느냐."<br>코라가 말했습니다.<br>"저는 가지 않겠습니다."`,
            `코라는 그 자리에 섰습니다. 바위 끝에서 한 걸음도 물러서지 않았습니다. 아래는 사람 키의 여러 배였습니다. 발을 조금만 옮기면 떨어지는 자리였습니다. 코라는 그것을 알고 서 있었습니다.`,
            `마과가 칼을 들었습니다. 그런데 내리치지 못했습니다. 코라가 그 얼굴을 똑바로 보고 있었습니다. 눈을 감지도 않았습니다. 한참 그대로 서 있었습니다. 몇 해를 벼른 자리였습니다.`,
            `그 몇 초가 아주 길었습니다. 그때 칼을 든 마과의 손이 떨리고 있었습니다. 코라도 그것을 보았습니다.`,
            `손이 떨렸다는 것이 그 자리에서 제일 중요한 일이었는지도 모릅니다. 그 떨림 하나로 마과도 사람이 됩니다. 괴물은 손이 떨리지 않습니다.`,
            `마과는 그때까지 누구에게나 무서운 사람이었습니다. 한 번도 마음이 흔들리는 것을 보인 적이 없었습니다. 그런데 마지막 순간에 그 손이 떨린 것이었습니다.`,
            `손이 왜 떨렸는지는 마과 자신도 말하지 않았습니다. 그 까닭을 한마디만 했더라면 그날이 달라졌을지도 모릅니다. 그런데 마과는 끝내 아무 말도 하지 않았습니다. 그때 마과의 무리 가운데 하나가 뒤에서 나섰습니다. 그리고 그 일을 했습니다. 마과가 못 한 일이었습니다.`,
            `코라가 그 자리에서 세상을 떠났습니다. 마과는 그것을 보고 그 사람에게 달려들었습니다. 자기가 하지 못한 일을 남이 했다고 화를 낸 것입니다. 몇 해를 벼른 일이 남의 손에 끝난 것이었습니다. 그 화가 무엇이었는지는 아무도 모릅니다.`,
            `마과 자신도 몰랐을 것입니다. 그 순간 웅카스가 사람 키의 두 배쯤 되는 벼랑 위에서 뛰어내려 마과와 부딪쳤습니다. 둘이 좁은 바위 위에서 엉켰습니다.`,
            `그 자리에서 웅카스가 마과의 손에 쓰러졌습니다. 아주 빠르게 벌어진 일이라 아래에서는 손을 쓸 수 없었습니다.`,
            `매의 눈이 바위 아래에서 그것을 보았습니다. 그리고 마과가 벼랑을 건너뛰려는 순간에 총을 쏘았습니다. 아주 먼 거리였습니다. 매의 눈은 그런 거리에서도 맞혔습니다. 총을 든 손이 조금도 흔들리지 않았습니다. 그 총에는 이름이 있었습니다. 사슴 잡이라고 불렀습니다.`,
            `마과는 그 자리에서 떨어졌습니다. 그날 그 벼랑에서 코라와 웅카스가 세상을 떠났습니다. 그리고 마과도요. 쫓던 사람과 쫓기던 사람이 함께 끝났습니다.`
        ]
    },
    {
        num: 11,
        title: "장례",
        emoji: "🍂",
        art: ["story-11-a.webp", "story-11-b.webp"],
        paras: [
            `이튿날 델라웨어 마을에서 장례가 치러졌습니다. 온 마을 사람이 다 나왔습니다. 매의 눈과 헤이워드와 먼로 대령도 왔습니다. 먼로 대령은 밤새 걸어서 온 참이었습니다. 딸이 어디 있는지 듣고 그길로 나선 것이었습니다. 아무도 말리지 못했습니다.`,
            `코라와 웅카스를 나란히 묻었습니다. 살빛이 다른 두 사람을 나란히 묻는 일이었습니다. 백인 마을에서는 있을 수 없는 일이었습니다. 마을의 여자들이 돌아가며 오래된 노래를 불렀습니다. 한 사람이 한 소절을 부르면 다음 사람이 받았습니다. 해가 다 뜨도록 그 노래가 이어졌습니다. 누가 지었는지 아는 사람이 없었습니다. 두 사람이 저세상에서 함께 지낼 것이라는, 부부가 되는 노래였습니다.`,
            `먼로 대령이 그 노래를 듣고 헤이워드에게 물었습니다.<br>"저 사람들이 무어라고 하는가."`,
            `먼로 대령은 그 말을 알아듣지 못했습니다. 델라웨어 말이었기 때문입니다. 헤이워드는 매의 눈에게 그 뜻을 물어서 알았지만, 그 노래를 그대로 옮기지 못했습니다. 그 시절 백인 사회에서는 그런 말을 그대로 옮기기가 어려웠기 때문입니다. 옮기면 먼로 대령이 어떻게 나올지 몰랐습니다.`,
            `헤이워드는 그 노래를 다른 말로 바꿔서 옮겼습니다. 먼로 대령은 그것을 눈치채지 못했습니다. 델라웨어 말을 아는 사람이 그 자리에 여럿 있었습니다. 그 사람들은 알고 있었습니다.`,
            `먼로 대령이 이렇게 말했습니다.<br>"저 사람들에게 전해 주게. 언젠가 우리가 다 같은 자리에 설 날이 온다고. 그때는 살빛이 아무 상관도 없을 것이라고."`,
            `먼로 대령이 사람들 앞에서 그런 말을 한 것은 그날이 처음이었습니다. 딸을 묻고 나서였습니다. 코라의 어머니 일로 여러 해 동안 속에만 품어 온 말이었습니다.`,
            `헤이워드는 그 말도 그대로 옮기지 못했습니다. 옮길지 말지를 한참 망설였습니다. 옮기는 사람이 망설이면 말은 건너가지 않습니다. 먼로 대령은 자기 말이 건너간 줄 알았습니다. 그래서 마음이 조금 편해졌습니다.`,
            `그리고 칭가치국이 마지막으로 일어섰습니다. 아들의 무덤 앞이었습니다. 아무도 그를 붙잡지 못했습니다. 칭가치국은 그날 하루 종일 한마디도 하지 않았습니다. 그러다 해가 기울 때 일어선 것이었습니다. 아들의 무덤 위에 흙이 아직 젖어 있었습니다. 그 앞에 서서 한참 있었습니다.`,
            `그 사람은 아들의 무덤 앞에서 이렇게 말했습니다.<br>"나는 이제 혼자다. 내 부족의 마을이 있던 자리에 지금은 다른 사람들의 마을이 있다. 내 아버지의 무덤이 어디 있는지 나는 안다. 그런데 그 자리에 지금은 밭이 있다. 나는 마지막 모히컨이다."`,
            `그때 매의 눈이 칭가치국 곁으로 가서 그 손을 잡았습니다.<br>"아니오, 당신은 혼자가 아니오. 우리는 살빛이 다르지만 같은 길을 걷게 되었소. 나는 당신 곁에 있겠소."<br>그 자리에 있던 사람들은 칭가치국이 마지막 모히컨이라고 한 말을 그대로 믿었습니다. 그리고 오래도록 사실로 여겨졌습니다. 그때 타메눈드가 일어섰습니다. 백 살이 넘은 그 늙은 사람 앞을 사람들이 비켰습니다.`,
            `타메눈드가 이렇게 말했습니다.<br>"나는 너무 오래 살았다. 나는 우리가 이 땅의 주인이던 때를 보았다. 그리고 오늘 우리 가운데 마지막 한 사람이 자기 아들을 묻는 것을 본다."`,
            `그러고는 자리에 앉았습니다. 더는 말하지 않았습니다. 그 사람도 자기가 보아 온 것을 다 말할 수 없었습니다. 그것으로 그날이 끝났습니다. 사람들이 하나씩 흩어졌습니다. 칭가치국만 그 자리에 남았습니다. 해가 다 진 뒤에도 그 자리에 있었습니다. 아무도 부르지 않았습니다.`,
            `혼자 남은 그 모습을 사람들은 오래 기억했습니다. 늙은 사람 하나가 빈 자리에 서 있던 밤이었습니다. 바람이 불고 나뭇잎이 떨어졌습니다. 그 뒤로도 숲은 그 자리에 그대로 있었습니다.`,
            `그런데 칭가치국은 마지막 사람이 아니었습니다. 그날 밤에 그렇게 보였을 뿐입니다. 모히컨 사람들은 수가 크게 줄고 여러 번 쫓겨 다녔지만 끊기지 않고 살아남았습니다.`
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
    title: 'The Last of the Mohicans',
    cover: {
        title: 'The Last of the Mohicans',
        tag: 'after James Fenimore Cooper',
        intro: [
            `Two hundred and seventy years ago, Britain and France fought over the land of North America. That land belonged to neither of them.`,
            `Alongside the story, this book shows how the picture the novel painted differs from what really happened. The title itself is not true.`
        ]
    },
    chapters: [
        {
            title: 'Before You Read This Story',
            paras: [
                `This story is set against a war fought in North America about two hundred and seventy years ago. Britain and France fought over that land for nine years. The war began in America and spread to Europe. Because the fighting in Europe lasted seven years, it is called the Seven Years' War there. In America it is called the French and Indian War.`,
                `But that land belonged to neither country. Both had come by ship, a voyage of months. People from across the sea fought to divide that land between them. Nobody asked the people who lived there. Britain had its settlements along the eastern coast. France was to the north, toward Canada.`,
                `There were people who had lived there for thousands of years. Long before Columbus came. Mohican, Delaware, Huron, Iroquois, Mohawk... In what is now the United States alone there were said to be more than five hundred nations. Counting Canada to the north and the lands to the south, there were more. Nobody has ever counted them all.`,
                `Each had its own language, its own way of life, and neighbours it got on with or did not. A nation on the coast and a nation by the great lakes lived very differently. Some farmed and some lived by hunting. There were more than a hundred languages alone. It was just like Europe having many countries. Nobody lumps the English and the French together as one. But that is what was done to the people of that land. So calling them by one name is the first mistake.`,
                `This must be said first. The word Indian was not a word those people used for themselves. It was a name others gave them. Columbus thought that land was India and called them so, and the word stuck. He had been looking for a sea route to India and landed somewhere else entirely. Columbus believed until his death that he had reached India. So there was nobody to correct it.`,
                `A wrong name lasted five hundred years. Today many people try not to use that word. Those people each had their own name. Today they are often called Native Americans, but that too is a name others gave them.`,
                `The names of nations such as Mohican, Delaware and Huron are closer to what those people called themselves. The name of a nation usually meant simply people in that language. Even the name Delaware was given by others. What those people called themselves was Lenape. As the Europeans arrived by ship, that whole land changed within a hundred years.`,
                `What spread first was disease. Diseases like smallpox. The disease ran ahead of the people, so that it reached villages that had never seen a white person. It spread along the routes by which goods were traded.`,
                `In Europe these were old diseases and people had some resistance, but in that land they were unknown and there was none. In some regions nine in ten died, and whole villages emptied. It happened before any fighting began. So the people who came later believed the land had always been empty. There were fields and roads and no people. Some said that God had emptied it for them.`,
                `Then the land was taken. A treaty was made and the land taken, another made and taken again. The side that could not read always lost. Often what was written and what was heard were different. The one who read the treaty aloud was the interpreter. Whose side he was on was the question.`,
                `And when Britain and France fought, each nation had to take one side. Taking neither meant being counted an enemy by both, and that was the most dangerous of all. So it was not a choice but a push. Side with Britain and you fought France; side with France and you fought Britain.`,
                `So the people of that land came to fight one another. That was the saddest thing that happened in those days, and it left its mark for a long time. That is the background to this story. What made it so were the countries from across the sea.`
            ]
        },
        {
            title: 'The Party That Went into the Forest',
            paras: [
                `In the summer of 1757, the war was in its third year. A war with no end in sight. It would go on for six more years. This was the forest in the north of what is now New York State. There were so many lakes and rivers that travelling by boat was faster than walking. They used canoes of birch bark. So light that one man could carry one on his shoulder.`,
                `In the middle of that forest, on a lakeshore, stood a British fort called William Henry. A fort, but built not of stone but of logs. There were about two thousand soldiers. Logs were set upright and earth packed between them. A wall that could not hold long against cannon.`,
                `The commander of the fort was Colonel Munro. A Scotsman past sixty. He had been a soldier for more than forty years. In that time he had fought in several countries.`,
                `Colonel Munro had two daughters. Cora the elder and Alice the younger. He had lost his wife and raised them alone, so he cherished them all the more. He kept them at a fort to the south. Because he could not keep them on a battlefield.`,
                `Cora had dark hair and deep eyes; Alice was fair, with a pale face. They had different mothers. Cora's mother was from the West Indies, and in those days that was counted a great flaw. The West Indies are the islands of the sea to the south of America. Many people carried off from Africa lived there.`,
                `The two were on their way from Fort Edward in the south to where their father was. Because they had heard he was in danger. Some tried to stop them going. Cora said she would go.`,
                `The party was five. They rode, with almost no baggage. On a forest track there was no room to carry any. It was a track hard even for a horse to pass. Branches brushed their faces.`,
                `Cora and Alice, a young major called Duncan Heyward who was escorting them, a singing master called David Gamut, and a guide. The guide's name was Magua. He was said to be a Huron, and he worked for the British army. Heyward trusted him. Because he had worked for the army a long time. Heyward did not know the man's past. The army used many guides. It did not look into all of their pasts.`,
                `The party did not take the main road but a forest path. Because Magua said the main road was held by the French, and the forest path was safer and quicker. A lie usually has some truth mixed in. It was a fact that the French were on the main road. That was why Heyward followed his advice.`,
                `That was the first mistake.`,
                `In those days that forest was very hard for people to travel. The trees were so dense it was dark at midday, and there was hardly anything that could be called a path. Go in without somebody who knew the way, and you did not come out. So a guide was essential. That forest was days across from north to south. Go into the middle and there was not a single village.`,
                `A compass was no use, and the trees hid the sun. If the guide changed his mind, that was the end. And that was what was happening. Even with a compass, you cannot go anywhere without a path.`,
                `After half a day Heyward felt something was wrong. The path kept going deeper, and they seemed to be heading away from the fort rather than toward it. The sun glimpsed between the trees was on the wrong side.`,
                `But Heyward could not say so. In case he had misjudged. To doubt a guide was a serious thing. Doubt him wrongly and he walks away. Toward evening the party met three men.`,
                `One was a white man. He wore deerskin and carried a long rifle. He looked about forty, with a face burned by the sun. His manner was blunt. A white man, they said, but his clothes were not a white man's. Even his shoes were moccasins.`,
                `His name was Natty Bumppo, but people called him Hawkeye. Born and raised in the forest, he could not read letters, but he could read the whole forest. From a footprint alone he knew what had happened days before, and how many had passed. From how far the trodden grass had risen he knew the hour. He saw where the dew had dried.`,
                `Beside him were two men. The older was Chingachgook, the younger his son Uncas. Uncas looked about twenty. Chingachgook was past sixty. The son had been born late.`,
                `The two were Mohicans. The only ones left of their nation, they said, were those two, father and son. Hawkeye was white, but he did not live in the white settlements. He went down to a settlement only a few times a year. To buy powder and salt.`,
                `He had lived in the forest since childhood, and learned hunting from the Delaware people. He had travelled with Chingachgook for more than twenty years. Without words, each knew the other's mind. One gesture was enough. They hunted together and slept together.`,
                `So he knew both worlds. But he belonged wholly to neither. The whites called him a wild man, and the nations called him a white man.`,
                `So he was at ease only in the forest. Hawkeye said more than once that he was "a white man without a cross in his blood", and that meant he always had to confirm where he stood. Because unless he said it, nobody would grant it. Whenever those words came, Chingachgook said nothing. Because he knew what they meant. And he did not reproach him either.`,
                `Heyward asked the way. And he mentioned Magua. A Huron was guiding them, he said, and his name was Magua.`,
                `At that name, all three went still. Hawkeye's face changed, and he exchanged a glance with Chingachgook. Nobody in that forest did not know that name. Only the white army did not.`,
                `Hawkeye asked,<br>"Where is he now?"<br>Heyward answered,<br>"Over there, under that tree."<br>Hawkeye said, very low,<br>"That man is leading you the wrong way."`,
                `Heyward could not readily believe it. Because it came from a man he had just met. Magua had worked for the army a long time.`
            ]
        },
        {
            title: 'Magua',
            paras: [
                `Still, Heyward remembered the sun on the wrong side between the trees, and decided to seize Magua. But as the men came near, Magua sensed it and fled on the spot. Hawkeye went after him but lost him. Magua knew that forest very well. Even in the dark he did not lose his way. The hunted takes the paths he knows. The hunter does not know them.`,
                `One shot was fired, and missed. Because the forest was dark. That night Hawkeye told Heyward about Magua. They talked without lighting a fire. Because firelight can be seen from far off.`,
                `Magua had originally been a Huron. In his youth he had been a famous hunter, they said, and sat in the front rank of his nation. But some years before, he had been driven out. It was because of drink, they said. The Hurons were a people who lived in what is now southern Canada. They had long traded with the French.`,
                `That drink, too, had not existed in that land. When the whites traded, they added drink and took furs and land in return. After drinking it, a man's reckoning clouded. A great deal of land was lost that way. Driven out, Magua went to the Mohawks, and then came to work for the British army. He was a man with no place among his own nation or among the whites.`,
                `In the meantime this had happened. Magua had once got drunk in the British camp and made a disturbance. The commander had him flogged in front of the soldiers. That commander was Colonel Munro. Cora and Alice's father. He soon forgot it. Because to him it was a common thing. British soldiers were flogged the same way.`,
                `To the nations of that land in those days, punishment was not a matter of shaming. When somebody did wrong, they were made to pay, or sent out of the group. There was no punishment by beating.`,
                `It differed from nation to nation, but mostly it was so. Goods were given to the injured family. Being sent out of the group was a heavier punishment than being hurt in the body. Because alone, nobody could live. Hunting alone through a winter and surviving was hard.`,
                `But tying a man up and beating him where many could see meant not counting him as a person. To Magua it was heavier than losing his life. It was not a matter of the pain.`,
                `After the flogging Magua changed. He never laughed again, they said. And he left that place. There was nowhere to go back to. For years after, he worked for this side and that. Neither side took him in as one of their own.`,
                `Colonel Munro did not know that. Nor did he try to find out. Not knowing can be a fault too. Especially when the one who does not know is the one with the power. A thing done in ignorance lasted that long. Colonel Munro did not even remember the man's name. But the man never forgot his.`,
                `Magua did not forget, and for years he waited his chance. And then Colonel Munro's daughters walked into that forest. For Magua it was the day he had waited for. Taking work as an army guide had been for that. Stay in that place, and one day the chance comes.`,
                `What Magua did was cruel. He seized people, killed them and terrified them. It cannot be thought well of. Only, he was not the only one who was bad.`,
                `A bad deed usually has something before it. Look away from what came before, and the same thing happens again. So it was with what happened before Magua became what he was. What remains must not be hatred for one man alone. That night the party hid in a cave on a rocky island in the middle of the river. Hawkeye brought out a birch-bark canoe he had hidden at the water's edge and ferried them across.`,
                `A cave behind a waterfall. The water was so loud that voices could not be heard. It was a good place to hide. Being midstream, it could not be reached without a boat. Above and below the water ran fast. The place was called Glens Falls.`,
                `But at dawn Magua brought his band. There was a fight. On the narrow rock. There was nowhere to fall back to.`,
                `Below was the waterfall. Hawkeye and the two Mohicans ran out of powder. Only knives and hatchets were left. Magua's side numbered more than ten. They were climbing onto the rock one by one. The rock was wet and slippery.`,
                `That would not hold for long. Three against ten, as it were.`,
                `Hawkeye said,<br>"It does no good for us to stay. We will get out and bring help."<br>Cora said,<br>"Go. That is better."`,
                `And she added,<br>"Tell our father that we were not afraid."<br>Hawkeye said,<br>"I will come back. That I promise."`,
                `Cora left only those words for her father. She said them with her sister behind her. Alice did not understand them. The three men leapt into the river. The current was so strong that Magua's band did not dare follow into that water. So the three got out alive.`,
                `And the rest were taken. That promise of Hawkeye's is kept later. He was not a man who broke a promise. In the forest a promise weighed more than paper. Because there was no paper to write it on.`
            ]
        },
        {
            title: 'The Rescue',
            paras: [
                `Magua took his captives into the forest. They walked a whole day. He gave them nothing to eat. Alice sank down several times as they walked. Each time Cora lifted her up. In places she carried her sister on her back. Alice had never walked like that in her life. She was a girl who had lived only inside forts.`,
                `And on a certain hill he said this to Cora:<br>"If you agree to live with me, I will let the rest go."<br>Cora asked,<br>"Why do you want such a thing?"<br>Magua said,<br>"Your father had me beaten before the men. When his daughter draws water and grinds corn in my lodge, he will come to know it."`,
                `He meant to repay it on the daughter. Because he could not repay it on the father. Colonel Munro was inside the fort. Two thousand soldiers guarded him. Years of waiting and he had never come within reach. Cora refused.`,
                `She did not hesitate for a moment. Though it was a way to save her sister. If she agreed, Alice would go back to their father. She reckoned that and then refused.`,
                `Cora said this:<br>"I know that what my father did to you was wrong. But to make me pay for it is wrong as well."`,
                `Magua looked at Cora a long time. Because he had never heard such an answer. Mostly people wept or begged. Nobody had ever said first that what had been done was wrong. Least of all from the white side. Magua heard that answer and said nothing. And he turned away.`,
                `Cora did not let her fear show there. She stood in front with her sister behind her. Alice was seventeen and Cora past twenty. When Alice was frightened she cried. Cora did not cry.`,
                `Cora was a very strong person. When her sister Alice cried in fear, Cora held her, and when a decision had to be made, it was always Cora who made it. She did it though she was afraid herself. Because her sister was watching.`,
                `Cora decided before Heyward did. Heyward knew it too. So he was a little in awe of her. Heyward had his heart set on Alice. But when something had to be decided, he looked to Cora.`,
                `It was a time when people thought it strange for a woman to step forward. Cora, whatever they thought, decided for herself and spoke for herself. And she paid the price herself. Cora was in the hardest place of anyone in that party. Yet nobody recognised it. Then a shot rang out in the forest.`,
                `Cora lifted her head. Men burst out of the forest. Hawkeye was in the lead.`,
                `Hawkeye and Chingachgook and Uncas had come back. After a fight, the captives were freed. Hawkeye fired first and the two others circled round behind. It was the way the three had settled beforehand. Without a word exchanged, they did it just so. Alice clung to Cora's arm. Hawkeye had kept his promise. The promise made in the cave.`,
                `He kept it in two days. For two days they had walked through the nights. So as not to lose the trail. Magua escaped again. The party set out for the fort once more. This time Hawkeye was the guide.`,
                `On the way, Cora came to talk with Uncas. Uncas was a man of very few words. He did not say ten words in a day, and few had ever seen him smile. But before Cora he was different. Sometimes he even spoke first. His father was watching.`,
                `Uncas asked first,<br>"Why did you come into this forest?"<br>"We are going to our father."<br>"This forest is no place for you to travel."<br>"I know."<br>Then Cora asked this:<br>"How many are your people?"<br>Uncas answered,<br>"My father and I."`,
                `When Uncas said this forest was no place for them, it was not a reproach. He said it out of concern. To the question of how many his people were, he answered very calmly. Neither boast nor complaint. Cora could not find her next words.`,
                `It was the first time she had heard that a nation was two people. A whole nation was two people. After that Cora saw Uncas differently. If a nation is two, then when one is gone it becomes one. Cora did that sum where she stood.`,
                `That night Heyward asked Hawkeye,<br>"Why do those two help us?"<br>Hawkeye said,<br>"They are not helping you."<br>"Then what is it?"<br>"Those men do what they hold to be right. That has nothing to do with you."`,
                `Hawkeye said it very briefly. Heyward thought about it a long time. Until then he had believed the two had come forward for their sake. But it was not so.`,
                `Those two had reasons of their own. What those reasons were, Heyward never managed to ask. Had he asked, he would not have been answered. Even Hawkeye had learned them only after twenty years.`
            ]
        },
        {
            title: 'Chingachgook\'s Story',
            paras: [
                `That night by the fire, Chingachgook told this story. He began without being asked. It was the first time, he said, that he had told it. Even Uncas heard it that day for the first time.`,
                `"My people once lived down there, toward the sea."<br>"We called it the land of flowing waters."<br>"There we lived a long time. We had many villages, and on every river were our people."<br>"Then the great ships came."<br>"At first things were not bad between us. We gave them food, and they gave us goods."<br>"But they kept growing more."<br>"And we kept growing fewer."<br>"The sickness came first. One village emptied in a month."<br>"Then the land went."<br>"We moved west, and moved again, and moved again."<br>"Each time we moved, we made a treaty."<br>"This far is your land, they wrote on paper."<br>"And the paper did not last a few years."<br>"I have seen many such papers."`,
                `Heyward asked,<br>"How many of you remain now?"`,
                `Chingachgook looked at the fire a long time. It took him a long while to answer. It was a number that needed no counting. Two.`,
                `Chingachgook said this:<br>"I and my son."<br>"And my son is the last."`,
                `After those words there was only the sound of the fire. Uncas kept his head bowed. Uncas knew those words were about him.`,
                `Heyward and Cora could say nothing either. Not even sorry would come. Say sorry, and it becomes something you did. Heyward had never done any of it.`
            ]
        },
        {
            title: 'Reaching the Fort',
            paras: [
                `At last the party reached Fort William Henry. A journey that should have taken three days had taken many. Magua had turned them aside, and then they had been taken and freed. The fort was already surrounded by the French. French tents filled the ground around it, and there were several cannon. The French numbered more than eight thousand. Four times those inside.`,
                `In a foggy dawn, with Hawkeye leading, the party slipped in. Without the fog they could not have. Around that lake the fog was thick every morning. When the water is cold and the air warm, it comes.`,
                `Colonel Munro received his two daughters. He held them and could say nothing for a long while. He had just sent a messenger to tell them not to come. That messenger had been caught on the way. It was months since he had seen his daughters. That they had come inside was not only a joy. The way out was already closed.`,
                `Conditions inside the fort were very bad. The French cannon kept firing, and the walls were crumbling. Several hundred shots came in each day. Even at night they stopped and started again. The fort had only a few cannon of its own. And several of those had burst and could not be used. Little powder was left. When a cannonball struck the log wall, the wood split. They mended it through the nights.`,
                `Colonel Munro had sent several times to Fort Edward in the south asking for help. It was three days' walk, and there was an army there. More than five thousand men. So they had only to come. But no answer came. Some of the messengers never returned. They had been caught on the road.`,
                `Then one day the French sent over a letter. A letter written by the commander of Fort Edward. Hawkeye, coming back from that fort on Colonel Munro's errand, had been caught by the French on the road, and the French had taken the letter. He could have burned it unread. But the seal was already broken.`,
                `It was meant to bring about surrender. Show a man there is nothing to wait for, and he cannot hold out. Montcalm, the French commander, counted on that. The letter said this:<br>"There is no army to send. Do as you think best."`,
                `That was all. Colonel Munro read the letter and sat a long time. He could not even tell whether it was genuine. There were two thousand people in the fort, and not only soldiers. The soldiers' families were there too. There were children in the fort.`,
                `Then the French commander, General Montcalm, asked for a parley.<br>"Hand over the fort. In return, you may walk out southward with your arms. Nobody will touch you."`,
                `Montcalm was the most famous general in the French army of that time. He is the man who later died at Quebec, two years afterward. Britain won that battle. And with it the ownership of that land changed.`,
                `He was known as a man who kept the rules, and did not favour destroying a fort and killing everyone in it. So he offered those terms according to the European rules. But those rules had been made in Europe. The people of that land had never been asked.`,
                `Colonel Munro thought long about it. Surrender, and he lost the fort. Hold out, and he lost his people. He could not tell whether the word could be trusted. All he could trust was Montcalm's name for keeping the rules. In the wars of those days there was such a way. Instead of fighting to the end, the losing side was allowed to withdraw safely. Then both sides lost fewer men. Because they would fight again another day.`,
                `It was called an honourable surrender. Sometimes they were allowed to march out without lowering their colours. It was what the soldiers of that time held to. Being allowed to carry out their arms was the sign of it. Colonel Munro accepted. Because there was nothing else to do.`,
                `Hold out longer and all would die. Colonel Munro had seen it many times. Water was running out too. The sick were growing more. The next morning, in thick fog, those people left the fort. The column was very long. So the front and back of the column could not see each other.`,
                `But there was something Montcalm had failed to think of. The people of the several nations who had fought alongside the French. They had never agreed to those terms. They had not even been called to the parley. The French had not counted them in. Though they had fought together. There were said to be more than fifteen hundred.`,
                `And the French had not given those people what they had promised. They had been brought with the promise that there would be something to gain if the battle was won.`,
                `Those people had walked for months from far away to fight. And now they were to go home with nothing. That is the background to that morning. Some had come to get provisions for the winter. That day, on that road, a terrible thing happened. The side that broke its promise came first.`,
                `Montcalm was blamed for that day for a long time afterward. And there are records that he himself took it heavily. Not preventing it, he said, was also a fault.`
            ]
        },
        {
            title: 'That Morning',
            paras: [
                `In August 1757, the people withdrawing from Fort William Henry were attacked on the road not long after they left the fort. In the confusion of that day, Magua took Cora and Alice. And he went north. Nobody saw it. Everyone was saving their own life, and Heyward was at the other end of the long column, so he did not see it either.`,
                `Some days later Hawkeye, freed by the French, met Chingachgook and Uncas again, and arrived at the spot with Heyward. There was nobody.`,
                `The fort had already burned. The French had burned it and withdrawn. Only ashes remained. The log walls lay charred and fallen. Smoke still rose from the half-burned posts.`,
                `Uncas knelt and parted the grass, searching the ground. He stayed so a long while. And he found the footprints. Nobody spoke to him.`,
                `"This way."`,
                `To the others' eyes there was nothing. Only grass. The direction in which the grass lay flattened was different. Uncas traced it for them with his fingertip.`,
                `The four followed the trail north. They walked by night too, and the pursuit went on for days. Footprints in the earth, a snapped twig, pressed moss, a mark at the water's edge. All of it was writing, and Uncas read it all.`,
                `Heyward watched from beside him and recognised none of it. Though he was a major and an educated man. Here that was no use at all, and in the forest other things had to be known. That in this forest he was nothing, Heyward thought for the first time in those few days.`
            ]
        },
        {
            title: 'The Delaware Village',
            paras: [
                `Following the trail, they found it split in two. It had been done on purpose. Keep two together and they are easy to follow. Magua knew such things well. He was a man used to living hunted. Since being driven from his nation he had always lived so.`,
                `Magua had separated the two sisters. Alice had been left in a Huron village, and Cora in a Delaware village nearby. The two villages lay on either side of a valley. They were not on good terms. A stream ran along the valley floor. Both villages drew their water from it.`,
                `One was on the French side and one was not. The four divided and went into the two villages. If discovered, that was the end. They could not even settle a way out. They decided to think of that once inside.`,
                `It was not a thing to be done by force. Four could not take on two villages. Each village had more than a hundred people.`,
                `So they used various methods. Heyward painted his face and went into the Huron village pretending to be a healer. Because there was a sick person in that village. Heyward knew nothing of medicine.`,
                `The people of that village let in even a stranger if there was somebody sick. That one thing was the same in every nation. A healer was received as a guest whichever side he came from. That was their rule.`,
                `Heyward made use of that. Later he carried the memory of it a long time. Because he had used another people's rule.`,
                `The better the rule, the easier it is to exploit. The one who trusts is the one who loses. Hawkeye went in wearing a bearskin. A man who had lived so long in the forest could copy exactly the way a bear walks. He swayed his shoulders and went on all fours. The village dogs barked and then stopped. Hawkeye, in the bearskin, led Heyward to the cave where Alice was held, and Heyward took Alice out of the Huron village and fled with her to the Delaware village where Cora was.`,
                `And Uncas was captured. Perhaps he let himself be captured on purpose. Only, because of it, he came into the very centre of the village.`,
                `In the middle of the village a judgment was held. That day, in that place, everything was decided.`,
                `In the Delaware village there was a very old man called Tamenund. He was said to be more than a hundred, and he could hardly see. Even so, he was the one who decided the village's affairs, the one whose word weighed most. On his one word a life turned.`,
                `Magua came before him and asked that Cora be given to him. He had come as a guest, he said, so let the law be kept. He knew that the law protected him. That was why he had walked in without fear.`,
                `The captured Uncas was brought before him too. Tamenund told Uncas to come near. Because his eyes were dim and he could not see well.`,
                `And he asked this:<br>"Who are you?"`,
                `Uncas did not answer. Instead, bound as he was, he walked forward and stood before Tamenund. A man standing by pulled off his shirt.`,
                `On his chest was a tattoo. A turtle, marked in blue. In that family, when a child was born, it was marked so.`,
                `Tamenund felt the mark with his hand, and rose from his seat. A man past a hundred rose by himself. Nobody supported him, and nobody could have. The village was as if doused with water. The people sitting by the fires rose one by one.`,
                `The Delaware and the Mohican were peoples who had parted from one root in the very distant past. Their languages could be understood by each other. And the family that bore the turtle was the oldest family of that root.`,
                `Tamenund had believed that family ended. It was a mark he had not seen for eighty years.`,
                `Tamenund said,<br>"As a child I saw a man who bore this mark. That was eighty years ago."<br>"Does that family still remain?"<br>Uncas said,<br>"My father and I."`,
                `That was the second time those words were said. The son said just what the father had said. The village fell silent. The hundred-year-old man laid his hand on the young man's shoulder. The hand stayed there a very long time.`
            ]
        },
        {
            title: 'Tamenund\'s Judgment',
            paras: [
                `Tamenund had Uncas freed. He called for a knife and had the rope cut before him. The villagers stood round and watched. Uncas stood just where he was. The rope had left red marks on his wrists. Uncas did not even rub them. Everyone pretended not to see.`,
                `And to Magua he said this:<br>"You came to this village as a guest. A guest takes his own with him. That is our law."<br>"You said that woman is yours, so take her."<br>Heyward shouted,<br>"You speak of a person as if she were a thing!"<br>Tamenund said,<br>"I never said so. I spoke our law."<br>"And it was not we who made that law. That law we learned from you."`,
                `Tamenund's voice was low. The voice of a man past a hundred. And yet it was the clearest voice in that place. Heyward's face set.`,
                `Heyward could make no answer to that. Because it was true. Said low, the words were heavier. In those days Europeans were seizing people and selling them. Every year several ships carried people from Africa to America. It was a great trade in those days.`,
                `It was that side that first counted people as goods. They laid them in the holds of the ships. Very many never reached the far shore alive.`,
                `And the old rules among the nations had been twisted by it too. Before that, taking a captive into the family had been common. The place of somebody lost in a fight was filled that way, so the captive became one of that household. They had children and grew old in that village.`,
                `Tamenund asked Magua,<br>"Will you take only the woman, or do you want the rest as well?"<br>Magua answered,<br>"Only the woman."<br>Tamenund said,<br>"Then go. But until the sun sets, nobody may follow you. That too is our law. After the sun sets, I will not hold them back."`,
                `It was that village's very old law, that a guest is not harmed. Without that law nobody could enter any village. So everyone kept that law at least. Harm a guest, and neither news nor goods come to that village any more. Then the village starves. Magua cared nothing for the rest, so he left Alice and Heyward. Magua took Cora and left the village, and nobody stopped him. Heyward started forward and was held back. The Delaware people restrained him.`,
                `Uncas too stood there with clenched fists. Several times he looked to see how far the sun had gone down. The sun hung on the ridge across the valley. It was summer, and the sun set late. That half day was very long. When the sun set, Uncas rose. The Delaware people rose with him.`,
                `The law was the law, and what came after was what came after. They had not broken the law. When the shadow had fully covered the valley, the Delaware people went down into it without a sound.`,
                `That evening a fight broke out in that valley. The Huron side had more men. But the Delaware side fought on its own ground. That made a great difference.`,
                `It did not take half a day. And many people lost their lives there. At the valley floor the stream went on sounding as before. The same sound when the fight began and when it ended. That stream was the water both villages had shared.`
            ]
        },
        {
            title: 'On the Cliff',
            paras: [
                `Magua fled with Cora toward the cliff. Two of his band went with him. Cora walked. Her wrists were not bound. Magua knew the woman would not run. Cora did not once look back. Look back, and you see who is following. Then Magua knows it too.`,
                `Uncas went after them. The Delaware people followed behind. Uncas was the fastest. Those behind could not catch up.`,
                `On a narrow rock path high on the cliff, Magua stopped. Below was a precipice. The path was one person wide. There was nowhere to step aside.`,
                `And he said to Cora,<br>"Will you come with me, or will you stay here?"<br>Cora said,<br>"I will not go."`,
                `Cora stood where she was. She did not step back one pace from the rock's edge. The drop was many times a person's height. One step, and she would fall. Cora stood knowing it.`,
                `Magua raised his knife. But he could not bring it down. Cora was looking him straight in the face. She did not even close her eyes. For a long moment they stood so. It was a moment he had waited years for.`,
                `Those few seconds were very long. Then the hand in which Magua held the knife was trembling. Cora saw it too.`,
                `That the hand trembled may have been the most important thing in that place. With that one trembling, Magua too becomes a person. A monster's hand does not tremble.`,
                `Until then Magua had been a man everyone feared. Never once had he let his heart be seen to waver. And yet at the last moment that hand trembled.`,
                `Why the hand trembled, Magua himself never said. Had he said one word about why, that day might have been different. But Magua said nothing to the end. Then one of Magua's band stepped forward from behind. And did the thing. The thing Magua could not do.`,
                `Cora died there. Magua saw it and flew at the man. He raged that another had done what he himself could not. A thing he had waited years for had ended at another's hand. What that rage was, nobody knows.`,
                `Magua himself probably did not know. At that instant Uncas leapt down from a cliff about twice a man's height and struck Magua. The two tangled on the narrow rock.`,
                `There Uncas fell by Magua's hand. It happened so fast that nobody below could do anything.`,
                `Hawkeye saw it from below the rock. And at the instant Magua tried to leap across the cliff, he fired. It was a very long shot. Hawkeye could hit at such a distance. The hand holding the rifle did not shake in the least. The rifle had a name. It was called Killdeer.`,
                `Magua fell from that place. That day, on that cliff, Cora and Uncas died. And Magua too. The pursuer and the pursued ended together.`
            ]
        },
        {
            title: 'The Burial',
            paras: [
                `The next day the burial was held in the Delaware village. The whole village came out. Hawkeye and Heyward and Colonel Munro came too. Colonel Munro had walked through the night to get there. He had set out the moment he heard where his daughter was. Nobody could stop him.`,
                `Cora and Uncas were buried side by side. Two people of different colour laid side by side. In a white settlement it could not have happened. The women of the village took turns singing an old song. When one sang a verse, the next took it up. The song went on until the sun was fully up. Nobody knew who had made it. A song of two people who would be together in the next world, a marriage song.`,
                `Colonel Munro heard the song and asked Heyward,<br>"What are they saying?"`,
                `Colonel Munro could not understand. Because it was the Delaware tongue. Heyward learned its meaning by asking Hawkeye, but he could not carry the song over as it was. Because in the white society of that time such words were hard to carry over as they were. If he did, there was no telling how Colonel Munro would take it.`,
                `Heyward carried the song over in other words. Colonel Munro did not notice. Several there knew the Delaware tongue. They knew.`,
                `Colonel Munro said this:<br>"Tell those people this. That one day we shall all stand in the same place. And that then the colour of our skin will not matter at all."`,
                `It was the first time Colonel Munro had said such a thing in front of others. After burying his daughter. Because of Cora's mother, he had kept those words inside him for many years.`,
                `Heyward could not carry those words over either. He hesitated a long while over whether to translate them. When the one who carries the words hesitates, the words do not cross. Colonel Munro believed his words had crossed. So his heart was a little eased.`,
                `And Chingachgook rose last. Before his son's grave. Nobody could hold him. Chingachgook had not said one word all that day. Then, as the sun sank, he rose. The earth on his son's grave was still damp. He stood before it a long while.`,
                `Before his son's grave, that man said this:<br>"Now I am alone."<br>"Where my people's village stood, now stands the village of others."<br>"I know where my father's grave is. But on that spot now there is a field."<br>"I am the last of the Mohicans."`,
                `Then Hawkeye went to Chingachgook's side and took his hand.<br>"No, you are not alone. Our skins are of different colours, but we have come to walk the same road. I will stay beside you."<br>The people there believed Chingachgook's words, that he was the last of the Mohicans, just as he said them. And for a long time they were taken as true. Then Tamenund rose. The people made way for that old man of more than a hundred years.`,
                `Tamenund said this:<br>"I have lived too long."<br>"I saw the days when we were the masters of this land."<br>"And today I see the last of us bury his son."`,
                `And he sat down. He said no more. Even he could not say all that he had seen. With that the day ended. The people drifted away one by one. Only Chingachgook remained there. Even after the sun had fully set, he stayed. Nobody called him.`,
                `People long remembered him standing there alone. It was a night when one old man stood in an empty place. The wind blew and the leaves fell. After that the forest stayed just where it was.`,
                `But Chingachgook was not the last. It only seemed so that night. The Mohican people's numbers fell greatly and they were driven from place to place many times, but they were not cut off. They survived.`
            ]
        }
    ],
    afterword: {
        title: 'After Reading',
        paras: [
            `The title of this book is The Last of the Mohicans. The word last is in the title. So from the start this book tells you what is going to end.`,
            `The writer was James Fenimore Cooper of America. Cooper wrote five books in a row about a man called Hawkeye, from his youth until he died in old age. This book is one of the five, and the most widely read.`,
            `The book came out in 1826. A book two hundred years old. It is one of the first novels to be widely read in America, and schools taught it for a long time.`,
            `Until then Americans had mostly read English novels. Few had written American stories set in America. Cooper did that.`,
            `The order of writing and the order of the story differ. Cooper wrote the old Hawkeye first and the young one later.`,
            `The story is set about seventy years before it was written. The time when Britain and France were fighting over the land of North America. It is called the French and Indian War.`,
            `In that war the native nations took part on both sides. Which side they stood on decided a nation's future.`,
            `France had long traded with the native peoples in furs, while Britain spread its settlements and pushed villages aside. So many nations sided with France. It was a war in which neither choice held anything good.`,
            `What happened on the road the morning the people left the fort is written at length and in detail in the original, but it has not been told in detail here. The more such things are described, the more they become a spectacle, and the descendants of the people who were there that day are living still.`,
            `Now let us pick out some places worth a second look.`,
            `First, count again who the title points to. It is easy to confuse Chingachgook with Uncas.`,
            `The end of the book tells you. Because the son goes first, the one who remains becomes the last.`,
            `So the title does not point to one person. It means that a nation is cut off.`,
            `Second, look at Hawkeye again. He is a white man who grew up among the native peoples. So he speaks both languages and knows both ways.`,
            `And yet he says several times that he belongs wholly to neither side. He even goes out of his way to say that he is a white man without a cross in his blood.`,
            `Notice how many times that is said. That he has to keep saying it shows, in itself, where that man stands.`,
            `Third, look at Magua again. He is the man on the opposite side of this story. But why he became so is also in this book.`,
            `He is a man driven out of his nation. And he was once flogged by a white commander. In front of the men.`,
            `So this book has in it a man who nursed a grudge for years over a flogging. Why such a figure appears in so many stories is worth thinking about too. And at the last moment the book says only that his hand trembled, not why. With one line more there, it would have been a different book.`,
            `Fourth, read the last chapter again. The Delaware people sing as they send Uncas on his way. And Chingachgook is silent all day, and speaks only as the sun is going down.`,
            `There Hawkeye takes Chingachgook's hand. And he says he will stay beside him. A white man and a native man taking hands is set at the very end of this book.`,
            `Think about why Cooper ended it so. And think, too, about what really happened afterward.`,
            `Cooper wrote this book in the middle of a writing life he began at twenty-six. He grew up in a village his father had founded, and that land too had been native land. He could not have failed to know it.`,
            `There are characters worth a second look as well.`,
            `Look again at the character of Cora. She is the bravest person in this book. She steps forward in danger, shows no fear, and judges for herself. In the novels of that time, women mostly waited to be rescued. So she is a very rare character.`,
            `And this book tells us that, through her mother, she had mixed blood. In the America of that time, that was a great matter.`,
            `So the passage where Cora and Uncas recognise each other is a quietly important place in this book. And the book lays the two of them side by side at the end.`,
            `That Cooper did not let those two live is still argued over today. Some say the readers of that time could not have accepted such an ending.`,
            `It helps to know something of the times. The Mohican nation really existed. They were people who lived along the Hudson River in the north-east of what is now the United States.`,
            `And they did not all vanish, as the title says. Their descendants are living today. Only, they were driven from their land many times and moved very far away. They moved four times: from Massachusetts to New York, from New York to Indiana, from Indiana to Wisconsin. That is more than two thousand kilometres from where they first lived. Each time they moved, their numbers fell.`,
            `The name Mohican is in fact a blend of two nations' names. There were the Mahican of the Hudson and the Mohegan of Connecticut, and Cooper made the two into one.`,
            `So after this book's title became famous, the two living nations had trouble reclaiming their own names. When a story grows bigger than the facts, such things happen.`,
            `The word last in the title holds what the white people of that time wanted to believe. Say those people are all gone, and the land becomes empty land, and empty land becomes land one may take.`,
            `So the title of this book differs from the facts. Writing that they vanished and writing that they were driven out are very different things. Today in Wisconsin those people have a self-governing community called Stockbridge-Munsee. More than fifteen hundred people live there, with a school, a library, and classes that teach again the language they had lost. On their own website they have written, "We are still here." It is an answer to the title.`,
            `The attack on the road on the people leaving the fort really happened, in August 1757, and a marker stands on the spot today. But how many lost their lives differs from record to record, and nobody knows exactly even now. Some records say fewer than a hundred, some say far more.`,
            `But Cooper wrote that day as if a great many people had lost their lives at once, far larger than it really was. Scholars studied the records and counted again more than a hundred years later, and by then what remained in people's heads was the novel.`,
            `A story settles in the heart longer than a number. That is why one must look at who wrote a story, and from what place. A picture that paints only one side as cruel lasts a hundred years, and erasing it takes longer still.`,
            `Around the time Cooper wrote this book, the driving of the native peoples westward was in full swing in America. Four years after the book appeared, it was made into law outright.`,
            `In the few years after that, several nations of the south-east were moved west on foot. More than ten thousand lost their lives on the road. It is called the Trail of Tears. The five nations of the Cherokee, Choctaw, Creek, Chickasaw and Seminole alone were more than sixty thousand people, and they walked a road of more than sixteen hundred kilometres. That name was not given by others; those people gave it themselves.`,
            `So at the very time this book was sadly picturing a vanishing nation, those people were in fact being driven out.`,
            `That is what must be known when reading this book. This book pities the native peoples. But pitying people and protecting their place are different things.`,
            `And there is a problem in how the book draws the native peoples too. It divides good natives from bad, and draws the good as if fated to vanish. It draws the nations on the British side well and those on the French side badly, so good and bad are decided by which side one stood on. In reality both sides took a side in order to survive.`,
            `The way it draws Chingachgook's sorrow, too, rests on the thought that "those people are bound to disappear". The white people of that time believed that, as the sun sets, so those people were setting; newspapers printed such words and schools taught them.`,
            `Draw it that way and vanishing looks like a natural thing. In fact people made it so. Carrying the sickness, taking the land, breaking the treaties were all things people did. Say they vanished by themselves, and nobody has to take responsibility. Grieving costs nothing, but repaying costs.`,
            `This book holds on to two things.`,
            `One is what becomes of a person who stands between two worlds. Hawkeye and Cora are both such people. Neither belongs wholly to either side.`,
            `The other is what it is that ends. This book does not end with the death of one person. It ends with one line being cut off.`,
            `That is what the old chief Tamenund says in the last chapter. That he has lived too long, and so has come to see such a thing.`,
            `That one sentence is the heaviest in the book.`,
            `Because its chase runs on through forests and rivers and over cliffs to the very end, this book was widely read after it appeared, in America and in Europe too. And it gave Europeans a picture of America. A land of forests and rivers and native peoples and hunters.`,
            `It has been filmed many times. Each time a little differently. In some versions Cora is allowed to live.`,
            `The films mostly enlarge the story of Cora and Uncas and cut Tamenund's words. The heaviest place in the original is the first to be cut away.`,
            `An old book should be read doing two things together: enjoying the story, and knowing from what place it was written. Look only at the fun and you inherit whole what the people of that time believed; only pick holes and it cannot be read.`,
            `If you ever read this book again, this time read only Magua's words, strung together. What that man lost and what he tried to win back are in those words.`,
            `Lastly, here are some things to think about. I shall not write down the answers.`,
            `Why did Hawkeye keep saying he was a white man? He says it when nobody asks.`,
            `How should we see Magua? What he did was not right. But what happened to bring him to that was not right either.`,
            `And how should we read the title of this book? Think about what writing the word last does to those people. That question is not easy to answer even when you read the book again as a grown-up.`
        ]
    },
    quiz: [
        { q: "What does this book point out about the name 'Indian'?", choices: ['It was a name the nations agreed on together', 'It was a name wrongly given by others, not by the people themselves', 'It was the word for "people" in the languages of that land'], answer: 1 },
        { q: 'Why did the nations side with either Britain or France?', choices: ['Because they had long been close to one of them', 'Because taking no side was the most dangerous of all', 'Because they were promised land if they joined the winner'], answer: 1 },
        { q: 'In the cave behind the falls, what did Cora ask to be told to her father?', choices: ['That Alice should be rescued first', 'That they would surely return, so he should wait', 'That they had not been afraid'], answer: 2 },
        { q: 'Which of these is true of the man called Hawkeye?', choices: ['He could not read books, but he could read the whole forest', 'He lived in a white settlement and came into the woods a few times a year', 'He had long served the British army as a guide'], answer: 0 },
        { q: 'Why did Magua come to hate Colonel Munro?', choices: ["Because his nation's land was taken", 'Because he was flogged in front of the men', 'Because he never received the pay he was promised'], answer: 1 },
        { q: "What did Cora say when she refused Magua's demand?", choices: ['That he should go and settle it with her father directly', "That her father's wrong was real, but making her pay for it was wrong too", "That what her father did had nothing to do with her"], answer: 1 },
        { q: 'In what order did Chingachgook say his people were reduced?', choices: ['First the land was lost, then the fighting came', 'First the fighting came, then the sickness', 'First the sickness came, then the land was lost'], answer: 2 },
        { q: "What problem does this book find in Cooper's sorrow?", choices: ['That the fight scenes are drawn out too long', 'That the idea of being bound to disappear lies beneath it', 'That the real names of the nations are written wrongly'], answer: 1 },
        { q: 'What were the terms for handing over the fort?', choices: ['To lay down all arms and leave by ship', 'For only the officers to stay and the rest to go home', 'To walk out safely to the south, carrying their arms'], answer: 2 },
        { q: 'Why were those terms not kept?', choices: ['Because the nations who fought alongside had never agreed to them', 'Because the British soldiers smuggled out hidden weapons', 'Because the French never meant to keep them from the start'], answer: 0 },
        { q: "What does this book say about the number who died that day?", choices: ['The novel greatly inflated it, and the novel is what stayed in people’s heads', 'The novel actually wrote it smaller than it was', 'When scholars counted again, it matched the number in the novel'], answer: 0 },
        { q: 'What did Uncas show before Tamenund?', choices: ['A necklace given by his father', "An old sash bearing the nation's sign", 'A blue turtle tattooed on his chest'], answer: 2 },
        { q: 'What did Tamenund add when he told Magua to take Cora?', choices: ['That law we learned from you', 'That law ends today', 'That law has been ours since our ancestors'], answer: 0 },
        { q: "Why could Heyward not carry over Colonel Munro's last words as they were?", choices: ['Because he could not hear them clearly there', 'Because they were words hard to carry over in the white society of that time', 'Because Munro forbade him to translate them'], answer: 1 },
        { q: 'What law was made in America in 1830?', choices: ['A law to move the eastern nations west of the Mississippi', "A law requiring the nations' children to attend school", 'A law to give the nations title deeds to land'], answer: 0 },
        { q: "What do the Mohican people say today about this novel's title?", choices: ['It is not worth arguing about now', 'That name is not ours', 'We are still here'], answer: 2 },
        { q: 'Which of these is NOT a fair thing to say after reading this book?', wide: true, choices: ['Seeing how chapter three tells why Magua became what he was, calling Magua alone bad is a story with no before.', 'Seeing how Hawkeye was a white man raised among the native peoples, he spoke both languages and belonged wholly to neither.', 'Seeing how Cora refused Magua’s demand on the hill without a moment’s hesitation, she must not have cared what became of her sister.', 'Seeing how Tamenund let Magua go and yet said he would not hold anyone back after sunset, he kept the law and kept what came after it apart.'], answer: 2 }
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
    emoji: '🏹',
    art: ['story-12-a.webp', 'end.webp'],
    paras: [
        `이 책의 제목은 『모히컨 족의 최후』입니다. 마지막이라는 말이 제목에 있습니다. 그러니 이 책은 처음부터 무엇이 끝나는 이야기인지를 알려 주고 시작합니다.`,
        `쓴 사람은 미국의 제임스 페니모어 쿠퍼입니다. 쿠퍼는 매의 눈이라는 사람이 젊을 때부터 늙어 죽을 때까지를 다섯 권으로 이어 썼습니다. 이 책은 그 가운데 한 권인데, 다섯 권 중 제일 널리 읽힙니다.`,
        `책은 1826년에 나왔습니다. 이백 년 전 책입니다. 그리고 미국에서 크게 읽힌 첫 소설 가운데 하나이고, 학교에서도 오래 가르쳤습니다.`,
        `그때까지 미국 사람들은 대개 영국 소설을 읽었습니다. 미국을 배경으로 미국 이야기를 쓴 사람이 드물었습니다. 쿠퍼가 그것을 했습니다.`,
        `쓴 순서와 이야기 순서가 다릅니다. 쿠퍼는 늙은 매의 눈을 먼저 쓰고 젊은 시절을 나중에 썼습니다.`,
        `이야기의 배경은 그보다 칠십 년쯤 전입니다. 영국과 프랑스가 북아메리카 땅을 두고 싸우던 때입니다. 그것을 프렌치 인디언 전쟁이라고 부릅니다.`,
        `그 싸움에 원주민 부족들이 양쪽으로 갈려 참여했습니다. 어느 쪽에 서느냐로 부족의 앞날이 갈렸습니다.`,
        `프랑스는 모피 장사로 원주민들과 오래 거래해 왔고, 영국은 땅을 넓히며 마을을 밀어냈습니다. 그래서 많은 부족이 프랑스 편에 섰습니다. 어느 쪽을 골라도 좋을 것이 없는 싸움이었습니다.`,
        `요새를 나서던 날 아침 길에서 벌어진 일은 원작에 길고 자세하게 적혀 있지만, 여기서는 자세히 옮기지 않았습니다. 자세히 적을수록 구경거리가 되고, 그날 그 자리에 있던 사람들의 후손이 지금도 살고 있기 때문입니다.`,
        `이제 다시 볼 대목을 짚어 봅시다.`,
        `첫째, 제목이 가리키는 사람이 누구인지 다시 세어 보십시오. 칭가치국인지 웅카스인지 헷갈립니다.`,
        `이 책의 마지막을 보면 알 수 있습니다. 아들이 먼저 갔기 때문에, 남은 사람이 마지막 사람이 됩니다.`,
        `그러니 이 책의 제목은 사람 하나를 가리키는 것이 아니라 한 부족이 끊긴다는 뜻입니다.`,
        `둘째, 매의 눈을 다시 보십시오. 그는 백인인데 원주민들 사이에서 자랐습니다. 그래서 양쪽 말을 다 하고 양쪽 방식을 다 압니다.`,
        `그런데 그는 자기가 어느 쪽에도 온전히 속하지 않는다는 것을 여러 번 말합니다. 자기는 피가 섞이지 않은 백인이라고 굳이 말하기도 합니다.`,
        `그 말이 여러 번 나오는 것을 눈여겨보십시오. 그렇게 자꾸 말해야 한다는 것 자체가 그 사람의 자리를 보여 줍니다.`,
        `셋째, 마과를 다시 보십시오. 이 이야기의 반대편에 선 사람입니다. 그런데 그 사람이 왜 그렇게 되었는지도 이 책에 나옵니다.`,
        `그는 부족에서 쫓겨난 사람입니다. 그리고 백인 지휘관에게 매를 맞은 일이 있습니다. 사람들 앞에서요.`,
        `그러니 이 책에는 매를 맞은 것 때문에 오래 벼른 사람이 나옵니다. 그런 인물이 여러 이야기에 나오는 까닭도 생각해 볼 만합니다. 그리고 마지막 순간에 그 손이 떨렸다고만 적혀 있고, 왜 떨렸는지는 적혀 있지 않습니다. 거기에 한 줄만 더 있었다면 다른 책이 되었을 것입니다.`,
        `넷째, 마지막 장을 다시 읽어 보십시오. 델라웨어 사람들이 웅카스를 보내며 노래를 부릅니다. 그리고 칭가치국이 하루 종일 말이 없다가 해가 기울 무렵에야 입을 엽니다.`,
        `그 자리에서 매의 눈이 칭가치국의 손을 잡습니다. 그리고 자기가 곁에 있겠다고 합니다. 백인과 원주민이 손을 잡는 장면이 이 책의 끝자락에 놓여 있습니다.`,
        `쿠퍼가 그렇게 끝낸 것을 생각해 보십시오. 그리고 그 뒤에 실제로 일어난 일도 함께 생각해 보십시오.`,
        `쿠퍼는 이 책을 스물여섯 살에 시작한 작가 인생의 한가운데에서 썼습니다. 아버지가 세운 마을에서 자랐는데, 그 땅도 원래 원주민의 땅이었습니다. 그것을 그가 몰랐을 리 없습니다.`,
        `인물도 다시 보아야 할 사람이 있습니다.`,
        `코라라는 인물을 다시 보십시오. 이 책에서 제일 씩씩한 사람입니다. 위험한 자리에서 나서고, 겁을 내지 않고, 스스로 판단합니다. 그 시절 소설에서 여자 인물은 대개 구해지기만 했습니다. 그러니 아주 드문 인물입니다.`,
        `그리고 이 책은 그 사람에게 어머니 쪽 피가 섞여 있다는 것을 알려 줍니다. 그 시절 미국에서 그것은 큰일이었습니다.`,
        `그러니 코라와 웅카스가 서로를 알아보는 대목이 이 책에서 조용히 중요한 자리입니다. 그리고 이 책은 그 둘을 마지막에 나란히 눕힙니다.`,
        `쿠퍼가 그 둘을 살려 두지 않은 것을 두고 지금도 말이 많습니다. 그 시절 독자들이 그 결말을 받아들이지 못했을 것이라는 이야기도 있습니다.`,
        `그 시절 사정도 알아 두면 좋습니다. 모히컨이라는 부족은 실제로 있었습니다. 지금 미국 동북쪽 허드슨강 유역에 살던 사람들입니다.`,
        `그리고 이 책의 제목처럼 다 사라진 것은 아닙니다. 지금도 그 후손들이 살고 있습니다. 다만 살던 땅에서 여러 번 쫓겨나 아주 멀리 옮겨 갔습니다. 매사추세츠에서 뉴욕으로, 뉴욕에서 인디애나로, 인디애나에서 위스콘신으로 네 번을 옮겼습니다. 처음 살던 데에서 이천 킬로미터가 넘는 곳입니다. 옮길 때마다 사람이 줄었습니다.`,
        `모히컨이라는 이름은 사실 두 부족의 이름이 섞인 것입니다. 허드슨강 쪽의 마히칸과 코네티컷 쪽의 모히건이 있었는데, 쿠퍼가 둘을 하나로 만들어 썼습니다.`,
        `그래서 이 책의 제목이 널리 알려진 뒤로, 실제로 살아 있는 두 부족이 자기 이름을 되찾는 데 애를 먹었습니다. 이야기가 사실보다 크면 그런 일이 생깁니다.`,
        `'최후'라는 제목에는 그 시절 백인들이 믿고 싶어 한 것이 들어 있습니다. 그 사람들이 다 없어졌다고 하면 그 땅은 빈 땅이 되고, 빈 땅은 가져도 되는 땅이 됩니다.`,
        `그러니 이 책의 제목은 사실과 다릅니다. 사라졌다고 적는 것과 쫓겨났다고 적는 것은 아주 다릅니다. 지금 위스콘신주에는 스톡브리지 먼시라는 그 사람들의 자치 구역이 있습니다. 천오백 명이 넘게 살고, 학교와 도서관이 있고, 잃었던 자기들 말을 다시 가르치는 수업이 있습니다. 그 사람들은 자기 누리집에 '우리는 아직 여기 있습니다'라고 적어 두었습니다. 제목에 대한 대답입니다.`,
        `요새를 나서던 사람들이 길에서 습격을 받은 일은 1757년 팔월에 실제로 있었던 일이고, 지금도 그 자리에 표지가 서 있습니다. 다만 몇 사람이 목숨을 잃었는지는 기록마다 달라 지금도 정확히 모릅니다. 백 명이 안 된다는 기록도 있고, 훨씬 많다는 기록도 있습니다.`,
        `그런데 쿠퍼는 그날 아주 많은 사람이 한꺼번에 목숨을 잃은 것처럼 실제보다 훨씬 크게 적었습니다. 학자들이 기록을 조사해 수를 다시 셈한 것은 백 년도 더 지나서였고, 그때 사람들 머릿속에 남아 있던 것은 소설이었습니다.`,
        `이야기는 숫자보다 마음에 오래 앉습니다. 그래서 누가 어느 자리에서 쓴 이야기인지를 보아야 합니다. 한쪽만 잔인하게 그려 놓은 그림은 백 년을 가고, 그것을 지우는 데는 그보다 더 오래 걸립니다.`,
        `쿠퍼가 이 책을 쓸 무렵 미국에서는 원주민을 서쪽으로 몰아내는 일이 한창이었습니다. 이 책이 나오고 네 해 뒤에 그것을 아예 법으로 만들었습니다.`,
        `그 뒤 몇 해 사이에 동남부의 여러 부족이 걸어서 서쪽으로 옮겨졌습니다. 만 명 넘게 길에서 목숨을 잃었습니다. 그것을 눈물의 길이라고 부릅니다. 체로키, 촉토, 크리크, 치카소, 세미놀 다섯 부족만으로도 육만 명이 넘었고, 천육백 킬로미터가 넘는 길을 걸었습니다. 그 이름은 남이 붙인 것이 아니라 그 사람들이 스스로 붙인 것입니다.`,
        `그러니 이 책이 사라지는 부족을 슬프게 그리고 있던 그 무렵에, 실제로는 그 사람들을 몰아내고 있었던 것입니다.`,
        `그것이 이 책을 읽을 때 알아 두어야 할 것입니다. 이 책은 원주민을 딱하게 여깁니다. 그런데 딱하게 여기는 것과 그 사람들의 자리를 지키는 것은 다른 일입니다.`,
        `그리고 이 책이 원주민을 그리는 방식에도 문제가 있습니다. 좋은 원주민과 나쁜 원주민을 갈라 놓고, 좋은 쪽은 사라질 운명인 것처럼 그립니다. 영국 편에 선 부족은 좋게, 프랑스 편에 선 부족은 나쁘게 그렸으니 좋고 나쁨이 어느 편에 섰느냐로 정해진 셈입니다. 실제로는 양쪽 다 살아남으려고 어느 편엔가 선 것이었습니다.`,
        `칭가치국의 슬픔을 그리는 데에도 '저 사람들은 사라지게 되어 있다'는 생각이 깔려 있습니다. 그 시절 백인들은 해가 지듯이 저 사람들도 지는 것이라고 여겼고, 신문에도 그런 말이 실리고 학교에서도 그렇게 가르쳤습니다.`,
        `그렇게 그리면 사라지는 것이 자연스러운 일처럼 됩니다. 실제로는 사람들이 그렇게 만든 것이었습니다. 병을 옮긴 것도, 땅을 가져간 것도, 조약을 어긴 것도 사람이 한 일이었습니다. 저절로 사라지는 것이라고 하면 아무도 책임을 지지 않아도 됩니다. 슬퍼하는 것은 값이 들지 않지만 갚는 것은 값이 듭니다.`,
        `이 책이 붙들고 있는 것은 두 가지입니다.`,
        `하나는 두 세계 사이에 선 사람이 어떻게 되느냐는 것입니다. 매의 눈도 코라도 그런 사람입니다. 어느 쪽에도 온전히 속하지 못합니다.`,
        `다른 하나는 무엇이 끝나는가 하는 것입니다. 이 책은 사람 하나가 죽는 것으로 끝나지 않습니다. 한 줄기가 끊기는 것으로 끝납니다.`,
        `마지막 장에서 늙은 추장 타메눈드가 하는 말이 그것입니다. 자기가 너무 오래 살아서 이런 것을 보게 되었다는 말입니다.`,
        `그 한마디가 이 책에서 제일 무겁습니다.`,
        `쫓고 쫓기는 이야기가 숲과 강과 벼랑을 지나 끝까지 이어져서, 이 책은 나온 뒤 미국에서도 유럽에서도 크게 읽혔습니다. 그리고 미국에 대한 그림을 유럽 사람들에게 만들어 주었습니다. 숲과 강과 원주민과 사냥꾼이 있는 땅이라는 그림입니다.`,
        `영화로도 여러 번 만들어졌습니다. 그때마다 조금씩 다르게 만들어졌습니다. 코라를 살려 두는 판도 있습니다.`,
        `영화들은 대개 코라와 웅카스 이야기를 크게 만들고 타메눈드의 말을 줄입니다. 원작에서 제일 무거운 자리가 제일 먼저 잘려 나가는 셈입니다.`,
        `옛날 책은 두 가지를 함께 하며 읽어야 합니다. 이야기를 재미있게 읽는 것과, 그 이야기가 어느 자리에서 쓰였는지를 아는 것입니다. 재미만 보면 그 시절 사람들이 믿던 것을 그대로 물려받고, 따지기만 하면 읽히지 않습니다.`,
        `언젠가 이 책을 다시 읽게 되거든, 이번에는 마과가 하는 말만 이어 붙여 읽어 보십시오. 그 사람이 무엇을 잃었고 무엇을 되찾으려 하는지가 그 말들에 있습니다.`,
        `마지막으로 생각해 볼 것을 남겨 둡니다. 답은 적어 두지 않겠습니다.`,
        `매의 눈이 자꾸 자기가 백인이라고 말하는 까닭은 무엇이었을까요? 아무도 묻지 않는데 그렇게 말합니다.`,
        `마과를 우리는 어떻게 보아야 할까요? 그 사람이 한 일은 옳지 않습니다. 그런데 그렇게 되기까지 있었던 일도 옳지 않았습니다.`,
        `그리고 이 책의 제목을 우리는 어떻게 읽어야 할까요. 마지막이라고 적는 것이 그 사람들에게 무엇을 하는 일인지 생각해 보십시오. 이 물음은 어른이 되어 다시 읽어도 답하기가 쉽지 않습니다.`
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
    title: `모히컨 족의 최후`,
    tag: `제임스 페니모어 쿠퍼 원작`,
    intro: [
        `이백칠십 년 전, 영국과 프랑스가 북아메리카의 땅을 놓고 싸웁니다. 그 땅은 원래 두 나라 것이 아니었습니다.`,
        `이 소설이 만들어 놓은 그림과 실제로 있었던 일이 어떻게 다른지도 함께 실었습니다. 제목부터가 사실이 아닙니다.`
    ]
};

function coverPage() {
    const cv = CV();
    return `<div class="page page-cover">
 <div class="story-page-left story-page-left-full">
 ${artFrame('cover.webp', '🌲')}
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
    { q: "'인디언'이라는 이름에 대해 이 책이 짚은 것은 무엇입니까?", choices: ["여러 부족이 모여서 함께 정한 이름이다", "그 사람들이 아니라 남이 잘못 붙인 이름이다", "그 땅에서 사람이라는 뜻으로 쓰던 말이다"], answer: 1 },
    { q: "부족들이 영국이나 프랑스 한쪽 편에 선 까닭은 무엇입니까?", choices: ["어느 한쪽과 오래전부터 가까이 지내서", "어느 쪽에도 안 서는 것이 제일 위험해서", "이기는 쪽에 서면 땅을 준다고 해서"], answer: 1 },
    { q: "폭포 뒤 동굴에서 코라가 아버지에게 전해 달라고 한 말은 무엇입니까?", choices: ["앨리스부터 먼저 구해 달라고요", "꼭 돌아올 테니 기다리라고요", "저희가 겁내지 않았다고요"], answer: 2 },
    { q: "매의 눈이라 불린 사람에 대해 맞는 것은 무엇입니까?", choices: ["글은 못 읽었지만 숲은 다 읽었다", "백인 마을에 살면서 한 해에 몇 번 숲에 들어왔다", "영국군에서 길잡이로 오래 일했다"], answer: 0 },
    { q: "마과가 먼로 대령을 미워하게 된 까닭은 무엇입니까?", choices: ["제 부족 땅을 빼앗겼기 때문에", "사람들 앞에서 채찍으로 맞았기 때문에", "약속한 삯을 끝내 받지 못했기 때문에"], answer: 1 },
    { q: "코라가 마과의 요구를 거절하며 한 말은 무엇입니까?", choices: ["그 일은 아버지에게 직접 가서 따지는 것이 옳다", "아버지 잘못은 알지만 나에게 갚으라는 것도 잘못이다", "아버지가 한 일은 나와 아무 상관이 없는 일이다"], answer: 1 },
    { q: "칭가치국이 부족이 줄어든 순서로 말한 것은 무엇입니까?", choices: ["먼저 땅을 잃었고 그다음에 싸움이 났다", "먼저 싸움이 났고 그다음에 병이 왔다", "먼저 병이 왔고 그다음에 땅을 잃었다"], answer: 2 },
    { q: "이 책이 쿠퍼의 슬픔에 대해 짚은 문제는 무엇입니까?", choices: ["싸움 장면을 너무 길게 늘여 썼다는 것", "사라지게 되어 있다는 생각이 깔려 있다는 것", "실제 부족 이름을 잘못 적어 놓았다는 것"], answer: 1 },
    { q: "요새를 넘기는 조건은 무엇이었습니까?", choices: ["무기를 다 내려놓고 배를 타고 떠나는 것", "장교만 남고 나머지는 그대로 돌아가는 것", "무기를 들고 안전하게 남쪽으로 걸어 나가는 것"], answer: 2 },
    { q: "그 조건이 지켜지지 않은 까닭은 무엇입니까?", choices: ["함께 싸운 부족들이 그 조건에 동의한 적이 없어서", "영국 군사들이 무기를 몰래 숨겨 나갔기 때문에", "프랑스 쪽이 처음부터 지킬 생각이 없었기 때문에"], answer: 0 },
    { q: "그날 희생자 수에 대해 이 책이 밝힌 것은 무엇입니까?", choices: ["소설이 크게 부풀렸고 사람들 머리에는 소설이 남았다", "소설이 오히려 실제보다 적게 적어 놓았다", "학자들이 다시 세어 보니 소설에 적힌 수와 같았다"], answer: 0 },
    { q: "웅카스가 타메눈드 앞에서 보인 것은 무엇입니까?", choices: ["아버지에게 받은 목걸이", "부족의 표시가 든 낡은 띠", "가슴에 새긴 푸른 거북 문신"], answer: 2 },
    { q: "타메눈드가 마과에게 코라를 데려가라고 하며 덧붙인 말은 무엇입니까?", choices: ["그 법은 우리가 너희에게서 배운 것이다", "그 법은 오늘로 마지막이 될 것이다", "그 법은 우리 조상 때부터 있던 것이다"], answer: 0 },
    { q: "먼로 대령의 마지막 말을 헤이워드가 그대로 옮기지 못한 까닭은 무엇입니까?", choices: ["그 자리에서 말소리를 잘 알아듣지 못해서", "그 시절 백인 사회에서 옮기기 어려운 말이라서", "먼로가 옮기지 말라고 못을 박았기 때문에"], answer: 1 },
    { q: "1830년에 미국에서 만들어진 법은 무엇입니까?", choices: ["동쪽 부족들을 미시시피강 서쪽으로 옮기게 한 법", "부족 아이들을 학교에 보내게 정한 법", "부족들에게 땅문서를 나눠 주도록 정한 법"], answer: 0 },
    { q: "오늘날 모히컨 사람들이 이 소설 제목에 대해 하는 말은 무엇입니까?", choices: ["이제 와서 따질 일은 아닙니다", "그 이름은 우리 것이 아닙니다", "우리는 아직 여기 있습니다"], answer: 2 },
    { q: "이 책을 읽고 난 반응으로 알맞지 않은 것은 무엇인가요?", wide: true, choices: ["마과가 왜 그렇게 되었는지 3장에 나오는 것을 보면, 마과만 나쁘다고 하면 앞이 안 보이는 이야기야.", "매의 눈이 백인인데 원주민 사이에서 자란 것을 보면, 양쪽 말을 다 하면서 어느 쪽에도 온전히 못 속한 사람이네.", "코라가 언덕에서 마과의 요구를 잠깐도 망설이지 않고 거절한 것을 보면, 동생이 어떻게 되든 상관없다고 여긴 거야.", "타메눈드가 마과를 보내 주고도 해가 진 뒤에는 막지 않겠다고 한 것을 보면, 법은 지키되 그다음은 따로 두었던 거지."], answer: 2 }
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
