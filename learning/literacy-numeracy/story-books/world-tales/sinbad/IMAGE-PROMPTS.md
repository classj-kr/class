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

> **마무리 그림(`end`)은 이제 「읽고 나서」 쪽 오른쪽 위 한 자리에만 쓰입니다.** 따로 있던 마지막 쪽은 없앴어요.
> 칸은 **가로 3 : 세로 2** 그대로입니다. 적어 둔 비율대로 그리면 잘리지 않고 그대로 들어갑니다.


본문 그림칸은 마지막 장까지 모두 같은 비율입니다. 어느 장이든 똑같이
2:1로 만들면 되고, 따로 신경 쓸 것이 없어요.

## 공통 스타일 지시문 (모든 프롬프트 앞에 붙여서 사용하세요)

```
Children's picture book illustration, bright cheerful cartoon-animation style,
bold clean outlines, saturated storybook colors, brilliant sea light and warm
desert gold, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), Arabian ports, wooden dhows, open
ocean, strange islands and a valley of gems, expressive faces, wide panoramic
composition, adventurous and never gruesome.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Sinbad: a wiry cheerful sailor with a short beard, a striped sash and a
sun-faded turban. The captain: a broad weathered man with a brass spyglass. The
roc: a colossal white bird, drawn as majestic rather than menacing. Merchants:
various robed traders with beards and bundles of goods.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a wooden sailing dhow riding a huge turquoise wave under a golden sky, an enormous bird circling far above and a rocky island on the horizon, adventurous and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 바다로 나가다

| 파일명 | 장면 |
|---|---|
| `images/01-port.webp` | A rich Baghdad house where a young man feasts with friends, then stands alone before an empty storeroom realising his fortune is gone, warm lamplight, sobering. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 옛날 바그다드에 신드바드라는 젊은이가 살았습니다. 아버지가 큰 장사꾼이어서 물려받은 재산이 많았지요. 신드바드는 그 돈으로 날마다 잔치를 벌였습니다. 친구들을 불러 좋은 음식을 대접했지요. 그러다 어느 날 곳간을 열어 보았습니다. 구석에 자루 몇 개만 굴러다녔지요. 신드바드는 그 앞에 한참을 서 있었습니다. / 오른쪽: 남은 것이 거의 없었습니다. 신드바드는 그제야 정신이 번쩍 들었지요. 이대로는 안 되겠구나. 집에 있는 물건을 팔아 돈을 마련했습니다. 그 돈으로 장사할 물건을 사들였지요. 먼 나라에 가면 값이 몇 곱절이 된다고 했습니다.〕 |
| `images/01-port-2.webp` | A bustling Arabian port at sunrise crowded with wooden dhows and porters carrying bales, a young sailor aboard as the ship sails out into open turquoise sea, golden and lively. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 신드바드는 물건을 지고 항구로 나갔습니다. 항구에는 돛대가 숲처럼 빽빽했지요. 짐꾼들이 커다란 짐을 지고 오갔습니다. 여기저기서 낯선 말소리가 들렸지요. 신드바드는 큰 배 한 척에 올랐습니다. 뱃사람들이 돛을 활짝 폈지요. / 오른쪽: 배는 천천히 항구를 빠져나갔습니다. 집들이 점점 작아지더니 사라졌습니다. 앞에는 끝없는 바다뿐이었지요. 바다 끝에는 무엇이 있을까? 신드바드는 뱃머리에 서서 중얼거렸습니다.〕 |

## 2장 · 섬이 아니었다

| 파일명 | 장면 |
|---|---|
| `images/02-whale.webp` | Sailors landing on a low grassy island, spreading laundry and lighting a cooking fire, their wooden dhow anchored nearby on a bright turquoise sea, cheerful. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 배는 여러 날을 나아갔습니다. 어느 아침 망보던 사람이 소리쳤지요. 섬이다! 앞에 섬이 있다! / 오른쪽: 모두 배에서 내려 땅을 밟았지요. 빨래를 널고 나뭇가지를 모았습니다. 며칠 만에 밟아 보는 땅이었지요. 그러고는 불을 피워 밥을 지었습니다. 연기가 하늘로 곧게 올라갔지요. 오랜만에 웃음소리가 났습니다. 신드바드도 신이 나서 이리저리 뛰어다녔지요.〕 |
| `images/02-whale-2.webp` | Sailors tumbling as the grassy island heaves and reveals itself as the back of an enormous whale sinking into the sea, one man clinging to a floating barrel, thrilling. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그런데 땅이 갑자기 출렁 흔들렸습니다. 사람들이 넘어지고 냄비가 굴러갔지요. 빨래도 물에 휩쓸려 갔습니다. 선장이 배 위에서 소리쳤습니다. 섬이 아니다! 커다란 물고기 등이다! / 오른쪽: 불에 놀란 물고기가 몸을 뒤척인 것이었습니다. 섬은 그대로 물속으로 쑥 가라앉았지요. 사람들은 바다에 빠지고 말았습니다. 신드바드는 나무통 하나를 붙잡았습니다. 배는 어느새 저 멀리 사라졌지요. 아무리 소리쳐도 들리지 않았습니다.〕 |

## 3장 · 거대한 새

| 파일명 | 장면 |
|---|---|
| `images/03-roc.webp` | A castaway walking inland on a rocky island and stopping before a gigantic smooth white egg taller than a house, tiny beside it, awe-inspiring scale. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 신드바드는 나무통을 붙잡고 밤새 떠다녔습니다. 이튿날 물결이 그를 어느 섬으로 밀어 주었지요. 기운을 차리고 섬 안으로 들어가 보았습니다. 사람이라고는 그림자도 없었지요. 나무 열매를 따 먹고 샘물을 마셨습니다. 그러고 나니 겨우 살 것 같았지요. / 오른쪽: 한참을 걷다가 신드바드는 걸음을 멈췄습니다. 섬 한가운데 하얗고 둥근 것이 우뚝 서 있었거든요. 처음에는 커다란 지붕인 줄 알았습니다. 그런데 창문도 문도 없었지요. 가까이 가 보니 어마어마하게 큰 알이었습니다. 신드바드는 그것을 한 바퀴 돌아보았습니다.〕 |
| `images/03-roc-2.webp` | The sky darkening as a colossal white bird descends onto a giant egg, a tiny man lashing himself to its tree-thick leg with a turban cloth, dramatic and awesome. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그때 하늘이 갑자기 어두워졌습니다. 해가 무언가에 가려진 것이었지요. 고개를 들자 커다란 그림자가 내려오고 있었습니다. 날개가 구름처럼 큰 새였습니다. 옛이야기에서 듣던 로크라는 새가 틀림없었지요. 신드바드는 알 뒤에 숨었습니다. / 오른쪽: 새는 알 위에 조용히 내려앉았지요. 다리가 나무 기둥만큼 굵었지요. 신드바드는 터번을 풀어 그 다리에 몸을 묶었습니다. 어디로든 데려다만 다오!〕 |

## 4장 · 나갈 길 없는 골짜기

| 파일명 | 장면 |
|---|---|
| `images/04-valley.webp` | A tiny man dangling from a colossal white bird high above ocean and islands, then untying himself in a deep narrow canyon with sheer cliffs, dramatic scale. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아침이 되자 새가 날개를 폈습니다. 신드바드의 몸이 붕 떠올랐지요. 바다도 섬도 발밑에서 자꾸 작아졌습니다. 바람이 얼굴을 세게 때렸습니다. 신드바드는 눈을 꼭 감았지요. 터번이 끊어질까 봐 겁이 났습니다. 한참 만에 새가 어딘가에 내려앉았지요. / 오른쪽: 신드바드는 얼른 터번을 풀었습니다. 새는 그를 보지도 못하고 다시 날아갔지요. 둘러보니 깊고 좁은 골짜기였습니다. 양쪽 절벽이 하늘까지 솟아 있었지요. 하늘이 좁다란 띠처럼 보였습니다. 바닥에 반짝이는 것이 잔뜩 깔려 있었지요. 모두 다이아몬드였습니다.〕 |
| `images/04-valley-2.webp` | A canyon floor glittering with scattered diamonds where a man fills his hands with gems then stops, staring up at impossibly high cliffs with no way out, dramatic light. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 신드바드는 바닥을 내려다보았습니다. 땅바닥이 온통 반짝이고 있었지요. 허리를 굽혀 하나를 주워 보았습니다. 주먹만 한 금강석이었습니다. 발밑에 깔린 것이 모두 보석이었지요. 금강석에 홍옥에 푸른 옥까지 있었습니다. / 오른쪽: 이걸 다 가져가면…… 신드바드는 정신없이 보석을 주웠습니다. 그러다 문득 손을 멈췄지요. 나갈 길이 어디에도 없었던 것입니다. 신드바드는 주저앉아 한참을 생각했습니다.〕 |

## 5장 · 고깃덩이를 타고

| 파일명 | 장면 |
|---|---|
| `images/05-meat.webp` | Huge slabs of meat thudding onto a gem-strewn canyon floor with diamonds sticking to them, great eagles swooping to carry them up to cliff-top nests, inventive. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그때 위에서 무언가가 툭 떨어졌습니다. 커다란 고깃덩이였지요. 이어서 또 하나가 떨어졌습니다. 신드바드는 절벽 위를 올려다보았습니다. 사람 그림자가 어른거렸지요. / 오른쪽: 고기가 떨어지면 보석이 척척 달라붙었지요. 그러면 독수리가 고기를 물고 올라갔습니다. 상인들은 보석만 골라 가졌지요. 신드바드는 무릎을 탁 쳤습니다. 저 고기를 타면 되겠구나!〕 |
| `images/05-meat-2.webp` | A man lashing himself beneath a huge slab of meat with a turban as a great eagle seizes it and lifts him up past sheer canyon walls, exciting and vertiginous. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 신드바드는 자루에 보석을 가득 담았습니다. 허리에 단단히 묶었지요. 그러고는 제일 큰 고깃덩이 밑으로 들어갔습니다. 터번을 풀어 제 몸을 고기에 붙들어 맸습니다. 그리고 숨을 죽이고 기다렸지요. 이윽고 큰 날갯짓 소리가 들렸습니다. / 오른쪽: 독수리가 내려와 고기를 덥석 물었지요. 몸이 붕 떠올랐습니다. 절벽이 눈앞에서 쭉쭉 지나갔습니다. 신드바드는 이를 악물고 매달렸지요. 손이 저리고 팔이 빠질 것 같았습니다. 바람이 귓가에서 쌩쌩 울었지요. 아래를 보니 골짜기가 실금처럼 가늘었습니다.〕 |

## 6장 · 다시 바다로

| 파일명 | 장면 |
|---|---|
| `images/06-sea.webp` | Astonished robed merchants crowding round a man untying himself from a slab of meat at a cliff-top eagle nest, gems spilling from his sack, humorous and warm. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 독수리는 절벽 위 둥지에 고기를 내려놓았습니다. 상인들이 소리를 지르며 달려왔지요. 그런데 고기에 사람이 붙어 있었습니다. 상인들은 눈이 휘둥그레졌지요. 고기에 사람이 붙어 나온 건 처음 보네! 상인들이 껄껄 웃었습니다. / 오른쪽: 신드바드는 그동안 있었던 일을 이야기했습니다. 상인들은 서로 얼굴만 마주 봤지요. 신드바드는 보석을 나누어 주었습니다. 길을 알려 주신 값입니다. 상인들은 그를 배까지 데려다주었습니다. 덕분에 신드바드는 무사히 집으로 향할 수 있었지요.〕 |
| `images/06-sea-2.webp` | A rich Baghdad courtyard where a merchant tells his tale to a crowd, and beside it the same man shouldering a bundle and boarding a ship again at a golden port. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 바그다드로 돌아온 신드바드는 큰 부자가 되었습니다. 넓은 집을 사고 좋은 옷을 지어 입었지요. 사람들이 그의 이야기를 들으러 몰려왔습니다. 물고기 섬 이야기에 다들 놀랐지요. 한동안은 그렇게 지냈습니다. 아침마다 좋은 것을 먹고 늦도록 잤지요. / 오른쪽: 그런데 몇 달이 지나자 또 좀이 쑤셨습니다. 밤이면 파도 소리가 귀에 맴돌았지요. 잠자리가 자꾸 답답했습니다. 신드바드는 밤마다 창을 열어 두었지요. 파도 소리가 자꾸 생각나는구나.〕 |

## 7장 · 어깨에 올라탄 노인

| 파일명 | 장면 |
|---|---|
| `images/07-old-man.webp` | A lush island stream where a shipwrecked sailor kneels to let a thin wizened old man climb onto his shoulders, green shade and clear water, kindly. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이번 항해에서도 신드바드는 배를 잃었습니다. 겨우 헤엄쳐 어느 섬에 닿았지요. 섬에는 나무가 우거지고 개울이 흘렀습니다. 개울가에 늙은 사람이 하나 앉아 있었지요. 이런 외딴섬에 사람이 있다니 뜻밖이었습니다. 몸이 마르고 다리가 가늘었습니다. 혼자서는 개울을 못 건널 듯했지요. / 오른쪽: 노인이 건너편을 손짓해 가리켰습니다. 업어 달라는 뜻 같았지요. 말은 한마디도 하지 않았습니다. 신드바드는 딱한 마음이 들었지요. 선뜻 등을 내주었습니다.〕 |
| `images/07-old-man-2.webp` | A wiry sailor staggering through a green island as a wizened old man rides his shoulders with legs locked around his neck, grinning slyly and kicking his sides, comic distress. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 신드바드는 노인을 업고 개울을 건넜습니다. 자, 다 왔습니다. 내리십시오. 그런데 노인이 내려오지 않았습니다. 두 다리로 목을 꽉 감아 버린 것이었지요. 힘이 어찌나 센지 꼼짝할 수가 없었습니다. / 오른쪽: 노인은 낄낄 웃기만 했습니다. 발뒤꿈치로 옆구리를 툭툭 차기까지 했지요. 이리 가라 저리 가라 하는 시늉이었지요. 신드바드는 그제야 속은 것을 알았습니다. 그렇게 며칠을 끌려다녔습니다. 밤에도 노인은 내려오지 않았지요.〕 |

## 8장 · 마지막 항해

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | A sunlit island vineyard where a burdened sailor fills a hollow gourd with grapes, then hands it to the old man on his shoulders who drinks it all and slumps, clever and funny. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 어느 날 신드바드는 포도밭을 지나게 되었습니다. 그때 좋은 생각이 떠올랐지요. 신드바드는 잘 익은 포도를 잔뜩 땄습니다. 그것을 속을 파낸 조롱박에 담아 두었지요. 며칠이 지나자 달콤한 즙이 되었습니다. 냄새만 맡아도 어질어질했지요. / 오른쪽: 신드바드는 그것을 맛있게 마시는 시늉을 했습니다. 노인이 손을 내밀며 달라고 했지요. 신드바드는 조롱박을 건네주었습니다. 노인은 그것을 한 방울도 남기지 않고 마셨습니다. 얼마 뒤 몸이 스르르 늘어졌지요. 목을 감고 있던 다리에서 힘이 빠졌습니다.〕 |
| `images/08-ending-2.webp` | A sailor running free along a shore toward a passing ship that stops for him, then lying on the deck looking at the sky as the coast slips away, triumphant and warm. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 신드바드는 얼른 어깨에서 노인을 내려놓았습니다. 그러고는 뒤도 돌아보지 않고 달아났지요. 바닷가까지 단숨에 뛰었습니다. 마침 지나가던 배가 그를 보고 멈춰 주었습니다. 손을 흔드는 사람이 보였지요. 뱃사람들이 그를 끌어 올려 주었습니다. / 오른쪽: 신드바드는 갑판에 누워 하늘을 보았습니다. 어깨가 아직도 뻐근했지요. 구름이 천천히 흘러갔습니다. 이제 정말 그만두어야겠구나. 신드바드는 그렇게 바그다드로 돌아왔습니다.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
