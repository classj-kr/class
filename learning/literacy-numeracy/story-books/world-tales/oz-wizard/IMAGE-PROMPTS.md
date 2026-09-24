# 제미나이 그림 프롬프트

이 책은 하나의 이야기를 8개의 장(챕터)으로 나눠 담았고, 펼침면은 모두
16개예요. 펼침면 하나에 그림이 한 장씩 들어갑니다.
그림이 펼침면 전체 폭을 가득 채우고, 그 아래에 이야기가 왼쪽·오른쪽으로 나뉘어 들어갑니다.

아래 프롬프트를 제미나이에 그대로 넣어서 생성한 뒤, 파일명을 정확히 맞춰서
`images/` 폴더에 저장하면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보여요.)

> **한 파일 = 한 장면입니다. 앞질러 가지 마세요.**
> 파일마다 뒤에 〔이 쪽에 실린 글〕을 붙여 두었습니다. 그 쪽에 실제로 실리는 글이에요.
> 그림은 **그 글에 나오는 장면만** 그려 주세요. 다음 쪽 이야기를 미리 그리면
> 그림이 글보다 한 칸씩 밀려서 책 전체가 어긋납니다. 실제로 그런 일이 있었어요.
> 장면이 둘 적혀 있으면 둘을 **한 그림 안에** 담아 주세요. 하나만 골라 그리면 안 됩니다.

권장 크기: **본문 그림은 가로 2 : 세로 1 비율**(가로로 아주 길쭉한 모양)로 만들어 주세요, WebP. 펼침면 전체 폭을 채우는 자리라 이렇게 길어야 잘리지 않아요. **표지(`cover.webp`)는 세로 2 : 3 비율**, 마무리(`end.webp`)는 가로 3 : 세로 2 정도면 됩니다.

> **마무리 그림(`end`)은 「읽고 나서」 쪽 오른쪽 위 한 자리에만 쓰입니다.**
> 칸은 **가로 3 : 세로 2** 그대로입니다. 적어 둔 비율대로 그리면 잘리지 않고 그대로 들어갑니다.

본문 그림칸은 열여섯 장이 모두 같은 비율입니다. 마지막 장도 앞쪽과 똑같으니
따로 신경 쓸 것이 없어요.

## 공통 스타일 지시문 (모든 프롬프트 앞에 붙여서 사용하세요)

```
Children's picture book illustration, bright cheerful cartoon-animation style,
bold clean outlines, saturated storybook colors, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it),
American prairie and a fantastical land of blue, green and yellow countries,
expressive faces, wide panoramic composition, beautiful and never frightening.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Dorothy: a cheerful girl about 10 with brown braided hair, a blue-and-white
checked gingham dress and silver shoes. Toto: a small shaggy black terrier.
The Scarecrow: a straw-stuffed man in worn blue farm clothes and a pointed hat,
with a painted burlap face and a friendly crooked smile, always a little floppy.
The Tin Woodman: a man made entirely of shiny tin with a funnel-shaped hat and
an axe. The Cowardly Lion: an enormous lion with a huge mane and big worried
watery eyes. The Wizard: a small bald old man in a rumpled suit. Munchkins:
small cheerful people in blue clothes and bell-trimmed pointed hats. The Good
Witch of the North: a small white-haired woman in a white gown and pointed hat.
The Witch of the West: a thin comical old woman in a dark gown with a golden
cap, funny rather than scary. Glinda: a beautiful red-haired witch in a white gown.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a girl in a blue checked dress with a small black dog, a straw scarecrow, a tin man and a big lion walking away from us along a winding yellow brick road toward a shining emerald city far ahead, wide sky with a faint rainbow, joyful and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 회오리바람

| 파일명 | 장면 |
|---|---|
| `images/01-twister.webp` | A small grey farmhouse standing alone on a vast flat grey Kansas prairie under a heavy sky, everything drained of colour, while a girl in a blue checked dress laughs as a small black dog spins around her feet — the only bright thing in the picture. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 캔자스 벌판 한가운데에 작은 집이 있었습니다. 둘레가 온통 잿빛이었지요. 도로시는 엠 아주머니, 헨리 아저씨와 그 집에 살았습니다. 웃고 뛰노는 것은 강아지 토토뿐이었지요. / 오른쪽: 그때 헨리 아저씨가 하늘을 보고 소리쳤습니다. 회오리바람이다! 엠 아주머니는 지하실 뚜껑을 열고 뛰어내려 갔지요.〕 |
| `images/01-twister-2.webp` | A wooden farmhouse tumbling and spinning high inside a towering whirlwind, roofs and trees and a very startled cow drifting past in the air, a girl hugging her little dog at the window, dramatic and wondrous but not frightening. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 집은 회오리 한가운데에서 빙글빙글 돌았습니다. 창밖으로 지붕이며 나무며 소가 둥둥 떠다녔지요. 토토야, 우리 어디로 가는 걸까? / 오른쪽: 얼마나 지났을까요. 도로시는 그만 잠이 들었지요. 쿵! 요란한 소리에 눈을 떴습니다. 집이 땅에 내려앉은 것이었지요.〕 |

## 2장 · 먼치킨 마을

| 파일명 | 장면 |
|---|---|
| `images/02-munchkin.webp` | A crowd of small cheerful people in blue clothes and bell-trimmed pointed hats gathering around a girl outside a fallen farmhouse in a bright flower-filled valley, a small white-haired witch in a white gown standing behind them, warm and colourful. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 키가 도로시만 한 사람들이 다가왔습니다. 모두 파란 옷에 파란 모자를 썼지요. 모자에 달린 방울이 딸랑딸랑 울렸습니다. 그 뒤에 하얀 옷을 입은 할머니가 서 있었지요. / 오른쪽: 제가요? 저는 아무것도 안 했는데요. 네 집이 하늘에서 떨어졌잖니. 할머니는 북쪽 마녀였습니다. 파란 옷 사람들은 먼치킨이라 했지요.〕 |
| `images/02-munchkin-2.webp` | A small witch balancing her pointed hat on her nose where it has turned into a writing slate, a girl beside her admiring a pair of silver shoes on her feet, delighted munchkins pointing, and a yellow brick road glittering away toward the horizon. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 도로시는 은구두를 신었습니다. 발에 꼭 맞았지요. 저는 캔자스로 돌아가고 싶어요. 그건 나도 할 수 없단다. / 오른쪽: 에메랄드 시로 가거라. 거기 오즈라는 마법사가 있다. 무엇이든 들어준단다. 길은 하나뿐이야. 노란 벽돌길만 따라가면 돼.〕 |

## 3장 · 허수아비와 양철 나무꾼

| 파일명 | 장면 |
|---|---|
| `images/03-scarecrow.webp` | A straw-stuffed scarecrow on a pole in a sunny cornfield winking one painted eye at an astonished girl, and beside that the same scarecrow flopping over into a comical heap of straw the moment she lifts him down, funny and warm. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 옥수수밭을 지날 때였습니다. 장대에 매달린 허수아비가 한쪽 눈을 찡긋했지요. 도로시는 눈을 비볐습니다. 안녕? 나 좀 내려 줄래? / 오른쪽: 허수아비는 일어서다 또 넘어졌습니다. 다리가 짚이라 흐물흐물했거든요. 괜찮아. 아파도 아픈 줄을 모르니까. 나는 머리에 짚만 들었어. 지혜를 얻고 싶어.〕 |
| `images/03-tinman.webp` | A man made entirely of tin standing rusted stiff in a green forest with his axe raised over his head and his mouth barely open, a girl squeezing an oil can onto his neck while her little dog watches, dappled sunlight through the leaves. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 숲 안쪽에서 이상한 소리가 났습니다. 끼익… 끼익… 온몸이 양철로 된 사람이 도끼를 든 채 굳어 있었지요. 비를 맞고 녹이 슬어 꼼짝을 못 했습니다. / 오른쪽: 양철 나무꾼은 팔을 번쩍 들었습니다. 목을 이리저리 돌려 보았지요. 아이고, 일 년 만이에요! 나는 요술에 걸려 몸이 죄다 양철로 바뀌었어요.〕 |

## 4장 · 겁쟁이 사자

| 파일명 | 장면 |
|---|---|
| `images/04-lion.webp` | A huge lion bursting out of the forest and sending a straw scarecrow tumbling head over heels, while a small girl plants herself in front of her little dog and smacks the enormous lion smartly on the nose, very comic and lively. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 어흥! 숲이 쩌렁쩌렁 울렸습니다. 커다란 사자가 뛰어나왔지요. 사자는 허수아비를 후려쳐 데굴데굴 굴렸습니다. / 오른쪽: 부끄러운 줄 알아! 저보다 작은 것만 괴롭히고! 사자는 코를 문지르더니 눈물을 뚝뚝 흘렸습니다. 맞아요… 나는 사실 겁쟁이예요.〕 |
| `images/04-poppy.webp` | A great lion leaping a wide ravine with a girl on his back, and beyond it an endless field of scarlet poppies where the girl and the lion have fallen asleep while a scarecrow and a tin man carry them out between them, dreamlike and glowing. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 네 친구는 함께 길을 나섰습니다. 가는 길에 폭이 아주 넓은 구덩이가 나왔지요. 건너뛸 수가 없었습니다. 사자가 하나씩 등에 태우고 껑충껑충 뛰어넘었습니다. / 오른쪽: 이윽고 빨간 꽃이 가득한 들판이 나왔습니다. 향기가 어찌나 진한지 도로시가 하품을 했지요. 조금만… 자고…〕 |

## 5장 · 에메랄드 시

| 파일명 | 장면 |
|---|---|
| `images/05-emerald.webp` | A dazzling green city gate where a gatekeeper fits green spectacles onto four wide-eyed travellers, and beyond the gate every street, roof and coat shines emerald green, splendid and slightly funny. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 멀리 초록빛 성이 반짝였습니다. 문지기가 상자에서 초록 안경을 꺼내 하나씩 씌워 주었지요. 안 쓰면 눈이 부셔서 못 다녀요. / 오른쪽: 오즈는 하루에 한 사람씩만 만나 주었습니다. 도로시 앞에 나타난 것은 커다란 얼굴 하나였지요. 몸도 팔도 없이 둥실 떠 있었습니다.〕 |
| `images/05-order.webp` | A vast throne room shown as four glowing visions side by side: an enormous floating head, a beautiful winged lady, a strange shaggy beast and a ball of flame, with four astonished travellers small below them. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 오즈는 넷에게 똑같은 말을 했습니다. 서쪽 마녀를 물리치고 오너라. 그러면 소원을 들어주마. / 오른쪽: 서쪽 마녀는 눈이 하나뿐이었습니다. 그 눈으로 멀리까지 다 보았지요. 마녀는 늑대 떼를 보냈습니다. 나무꾼이 도끼로 막았지요. 까마귀 떼를 보냈습니다. 허수아비가 두 팔을 휘저어 쫓았지요.〕 |

## 6장 · 황금 모자

| 파일명 | 장면 |
|---|---|
| `images/06-monkeys.webp` | A sky full of winged monkeys swooping down over a rocky yellow wasteland, scattering a scarecrow's straw in a cloud and carrying a tin man away by his arms, a girl shielding her little dog, adventurous and never frightening. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 마녀는 황금 모자를 꺼내 썼습니다. 에페, 페페, 카케! 하늘이 캄캄해지더니 날개 달린 원숭이 떼가 몰려왔지요. / 오른쪽: 도로시와 사자는 마녀의 성으로 끌려갔습니다. 마녀는 도로시에게 부엌일을 시켰지요. 저 은구두만 뺏으면 되는데.〕 |
| `images/06-water.webp` | A comic castle kitchen where a girl flings a bucket of water and a thin old witch in a dark gown melts away like a sugar lump, leaving only a brown pointed hat on the flagstones, freed servants cheering in the doorway. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 돌려줘요! 그건 제 거예요! 어림없다. 나머지 한 짝도 곧 내 것이 될걸. 도로시는 너무 분해서 옆에 있던 물통을 번쩍 들었습니다. / 오른쪽: 물이라니! 물은 안 돼! 마녀의 몸이 설탕처럼 스르르 녹아내렸습니다. 이윽고 갈색 모자만 바닥에 남았지요.〕 |

## 7장 · 커튼 뒤의 사람

| 파일명 | 장면 |
|---|---|
| `images/07-curtain.webp` | A small black dog tugging a green curtain aside in a great throne room to reveal a small bald old man crouching beside a speaking trumpet and a giant papier-mâché head, four travellers staring with their mouths open, very comic. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 넷은 에메랄드 시로 돌아왔습니다. 약속을 지켜 주세요! 그런데 커다란 얼굴도 여인도 나타나지 않았지요. / 오른쪽: 당신 누구예요? 내가… 오즈요. 할아버지는 커다란 얼굴 인형과 나팔을 내보였습니다.〕 |
| `images/07-gifts.webp` | A small old man solemnly spooning bran and pins into a scarecrow's open head, fitting a silk heart into a tin man's chest, and handing a bowl of green liquid to a lion who gulps it down and puffs out his chest proudly, funny and warm. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그럼 우리 소원은요? 할아버지는 허수아비 머리에 겨와 바늘과 핀을 섞어 넣었습니다. 이제 바늘같이 날카로운 생각이 날 거요. / 오른쪽: 사자에게는 초록빛 물약을 한 사발 따라 주었습니다. 쭉 들이켜시오. 이것이 용기요. 사자는 벌컥벌컥 마시고 가슴을 쭉 폈지요.〕 |

## 8장 · 집으로

| 파일명 | 장면 |
|---|---|
| `images/08-balloon.webp` | An enormous striped silk balloon lifting above a green city square packed with cheering people, a small old man alone in the basket, and a girl below turning back with her dog in her arms as the mooring rope snaps, lively and bittersweet. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 나는 어떡하죠? 저는 캔자스로 가야 해요. 내 열기구를 고쳐 봅시다. 나도 고향에 가고 싶소. 둘은 비단을 이어 붙여 커다란 기구를 만들었습니다. / 오른쪽: 허수아비를 임금으로 삼으시오! 할아버지가 바구니에 올라탔습니다. 도로시도 타려는데— 토토가 왁자한 소리에 놀라 품에서 뛰쳐나갔지요.〕 |
| `images/08-home.webp` | A beautiful red-haired witch in a white gown smiling in a rose-filled palace hall as a girl in silver shoes hugs a scarecrow, a tin man and a lion goodbye one by one, tender and glowing. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 도로시는 그만 주저앉아 울었습니다. 허수아비가 옆에 쪼그려 앉았지요. 울지 마. 남쪽에 글린다라는 착한 마녀가 산대. / 오른쪽: 그 구두가 너를 어디든 데려다준단다. 처음부터요? 그럼 이 고생을 안 해도 됐잖아요! 그랬다면 좋은 친구 셋을 못 만났겠지.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
