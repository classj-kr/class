# 제미나이 그림 프롬프트

이 책은 하나의 이야기를 7개의 장(챕터)으로 나눠 담았고, 펼침면은 모두
14개예요. 펼침면 하나에 그림이 한 장씩 들어갑니다.
그림이 펼침면 전체 폭을 가득 채우고, 그 아래에 이야기가 왼쪽·오른쪽으로 나뉘어 들어갑니다.

아래 프롬프트를 제미나이에 그대로 넣어서 생성한 뒤, 파일명을 정확히 맞춰서
`images/` 폴더에 저장하면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보여요.)

> **⚠️ 다시 그려 주실 것 (2026-09-03)**
> - `05-eyes-2` — 동상이 받침대에서 **떨어져 공중에 떠 있습니다.** 게다가 마을에 견줘
>   터무니없이 큽니다. 받침대 위에 발을 딛고 선 보통 크기의 동상으로.
> - `06-snow` — 이때 왕자는 **두 눈을 다 내주어 앞을 못 봅니다.** 그런데 눈동자가 또렷한
>   뜬 눈으로 그려져 있어요. 같은 책 `06-snow-2`·`07-ending`은 제대로 빈 눈이라 서로 어긋납니다.
>   빈 눈구멍으로 다시.
>
> **동상의 단계표** — 그림마다 이 상태를 지켜 주세요.
>
> | 파일 | 금박 | 두 눈 | 칼자루 루비 |
> |---|---|---|---|
> | `01-statue` ~ `03-ruby` | 금빛 | 파란 사파이어 | 있음 |
> | `03-ruby-2` | 금빛 | 파란 사파이어 | **없음** |
> | `04-sapphire`, `04-sapphire-2`, `05-eyes` | 금빛 | **한쪽만 빔** | 없음 |
> | `05-eyes-2` | 금빛 | **둘 다 빔** | 없음 |
> | `06-snow` | **벗겨져 잿빛 납** | 둘 다 빔 | 없음 |
> | `06-snow-2`, `07-ending` | 잿빛 납 | 둘 다 빔 | 없음 |
>
> 본문 13번째 펼침면에 시장이 "루비도 없고 눈도 없구먼" 하고 말합니다. 그림이 그걸 받쳐 줘야 합니다.

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
bold clean outlines, saturated storybook colors, warm lamplight against cold blue
city dusk, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a European city of rooftops and
squares, a tall column with a gilded statue, poor attic rooms and grand houses,
and a snowy street, expressive faces, wide panoramic composition, tender and
never grim.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The happy prince: a tall statue of a young prince standing on a stone column.
He gives his jewels away one at a time, so HIS STATE CHANGES BY STAGE and every
picture must match its own stage (see the table below). His empty eye sockets are
a FACT OF THE STORY, not a mark of anything bad - once the sapphires are gone he
is blind and must be drawn with plain hollow sockets or closed lids, never with
seeing eyes. Always show him standing ON his column, joined to it, at the scale
of a real statue in a small town square - never floating free of the pedestal. The swallow: a small
sleek bird with a white throat and quick bright eyes. The seamstress: a tired
woman sewing by candlelight. Her son: a small boy with a fever. The young writer:
a thin man at a desk in a cold attic. The match girl: a small child in a thin
dress. The mayor and councillors: pompous men in gold chains.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a gilded statue of a young prince on a tall column above a wintry city at dusk, a small swallow perched on its shoulder, the sapphire eyes catching the last light, lamps coming on in the streets below, beautiful and moving. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 도시를 내려다보는 동상

| 파일명 | 장면 |
|---|---|
| `images/01-statue.webp` | A city square at dusk with a tall column bearing a gilded prince statue with sapphire eyes, townspeople below pointing up admiringly, lamps beginning to glow, beautiful and lofty. 〔이 쪽에 실린 글 (1/14) — 그림에 글자는 넣지 마세요. 왼쪽: 도시 한복판에 아주 높은 기둥이 서 있었습니다. 그 꼭대기에 동상이 올라앉아 있었지요. 온몸이 금박으로 덮여 해가 뜨면 눈이 부셨습니다. 두 눈에는 새파란 사파이어가 박혀 있었지요. 칼자루의 붉은 루비는 저녁놀이 비치면 불씨처럼 타올랐습니다. 기둥 아래를 지나는 아이들은 고개를 한껏 젖히곤 했지요. / 오른쪽: 저기까지 어떻게 올라갔을까? 사람들은 그 동상을 행복한 왕자라고 불렀습니다. 저 동상처럼 곱구나.〕 |
| `images/01-statue-2.webp` | A memory of a walled palace garden full of music, and the same prince now as a statue high on a column seeing narrow lamplit alleys of hardship below, a tear on his gilded cheek, moving. 〔이 쪽에 실린 글 (2/14) — 그림에 글자는 넣지 마세요. 왼쪽: 왕자는 살아 있을 때를 가끔 떠올렸습니다. 그때는 높은 담 안에서만 지냈지요. 뜰에는 늘 음악이 흐르고 꽃이 피어 있었습니다. 슬픈 것이라고는 본 적이 없었지요. 그래서 다들 나를 행복한 왕자라고 불렀단다. / 오른쪽: 담 밖에 무엇이 있는지 나는 몰랐거든. 그런데 동상이 되고 나니 이제는 다 보였습니다. 기둥이 아주 높았으니까요. 누가 굶는지, 누가 우는지가 골목마다 훤히 보였지요. 어느 날 왕자의 눈에서 무언가 뚝 떨어졌습니다. 금빛 뺨을 타고 또르르 흘러내린 것은 눈물이었지요.〕 |

## 2장 · 하룻밤만 묵어가는 제비

| 파일명 | 장면 |
|---|---|
| `images/02-swallow.webp` | A statue's stone feet where a small swallow settles for the night and a drop falls on it, the bird looking up in surprise at the weeping gilded face above, clear stars overhead, tender. 〔이 쪽에 실린 글 (3/14) — 그림에 글자는 넣지 마세요. 왼쪽: 그 무렵 제비 한 마리가 도시로 날아왔습니다. 동무들은 벌써 따뜻한 나라로 떠난 뒤였지요. 갈대와 놀다가 그만 한참 늦고 만 것입니다. 날개가 무겁고 배도 고팠지요. 오늘은 여기서 하룻밤만 자고 가야겠다. / 오른쪽: 머리를 날개에 파묻고 막 눈을 감으려는 참이었습니다. 툭. 물방울 하나가 등에 떨어졌지요.〕 |
| `images/02-swallow-2.webp` | A swallow perched on a statue looking down into an open attic window where a weary seamstress sews by candlelight and a feverish boy tosses on a bed, warm and sad. 〔이 쪽에 실린 글 (4/14) — 그림에 글자는 넣지 마세요. 왼쪽: 왜 우세요? 제비가 깜짝 놀라서 물었습니다. 저 아래 골목이 보이니? / 오른쪽: 창가 침대에는 아이가 열이 나서 뒤척였습니다. 엄마, 목말라요. 오렌지 주세요. 조금만 참으렴.〕 |

## 3장 · 첫 번째 심부름

| 파일명 | 장면 |
|---|---|
| `images/03-ruby.webp` | A swallow prising a ruby from a sword hilt and carrying it over moonlit rooftops into an attic window, laying it beside a thimble as the sleeping seamstress rests her head, gentle. 〔이 쪽에 실린 글 (5/14) — 그림에 글자는 넣지 마세요. 왼쪽: 저는 내일 아침에 떠나야 해요. 동무들이 기다리거든요. 제비는 그렇게 말하고 고개를 돌렸습니다. 밤바람이 차가워 부리가 다 시렸지요. 그러고는 한참 뒤에 슬그머니 물었습니다. …어느 골목이라고 하셨죠? / 오른쪽: 왕자가 빙그레 웃었지요. 제비는 부리로 루비를 톡 뽑아 물고 힘껏 날아올랐습니다. 지붕들이 발밑으로 지나갔지요. 굴뚝에서 하얀 김이 몽글몽글 올라왔습니다. 제비는 열린 창으로 쏙 들어가 루비를 골무 옆에 놓았지요. 아주머니는 바느질감을 안은 채 잠들어 있었습니다.〕 |
| `images/03-ruby-2.webp` | A swallow fanning a feverish boy with its wings until he sleeps peacefully, then returning to the statue at dawn, warm morning light on the gilded face, tender. 〔이 쪽에 실린 글 (6/14) — 그림에 글자는 넣지 마세요. 왼쪽: 제비는 아이 곁을 맴돌며 날개로 부채질을 해 주었습니다. 후, 후. 뜨겁던 이마가 조금씩 시원해졌지요. / 오른쪽: 내일이면 오렌지를 살 수 있을 거야. 제비는 잠든 아주머니를 한 번 더 보고 창을 빠져나왔지요. 참 이상해요. 날이 이렇게 추운데 몸이 따뜻해요.〕 |

## 4장 · 파란 눈을 주다

| 파일명 | 장면 |
|---|---|
| `images/04-sapphire.webp` | A cold attic where a thin young writer works by a guttering candle with no fire in the grate, seen from a statue's viewpoint across the rooftops, bleak but beautiful. 〔이 쪽에 실린 글 (7/14) — 그림에 글자는 넣지 마세요. 왼쪽: 아침이 되자 제비가 날개를 활짝 폈습니다. 오늘은 정말 떠나야 해요. 그때 왕자가 제비를 다시 불렀지요. / 오른쪽: 손가락이 곱아 글자가 삐뚤빼뚤했습니다. 난로에는 불씨 하나 없었지요. 책상 위에도 먹을 것이 보이지 않았습니다. 내 눈 하나를 빼 다오. 그러면 앞이 안 보이시잖아요.〕 |
| `images/04-sapphire-2.webp` | A swallow leaving a sapphire on a writer's desk, and the same attic next day warm with a lit fire, bread on the table and the young man writing eagerly, hopeful and warm. 〔이 쪽에 실린 글 (8/14) — 그림에 글자는 넣지 마세요. 왼쪽: 제비는 사파이어를 조심조심 물고 다락 창으로 날아갔습니다. 젊은이가 잠깐 고개를 숙인 사이에 책상 위에 살며시 내려놓았지요. 이게 어디서 났지? 젊은이는 그것을 창가에 대고 이리저리 비춰 봤습니다. 파란빛이 손바닥에 어른거렸지요. / 오른쪽: 이튿날 젊은이는 장작을 한 다발 샀습니다. 빵도 사고 새 종이도 샀지요. 난롯불이 활활 타올라 방 안이 금세 따뜻해졌습니다. 이제 겨울이 무섭지 않구나. 얼었던 손이 풀리자 글이 술술 써졌지요. 제비는 그것을 다 보고 돌아와 왕자에게 이야기해 주었습니다.〕 |

## 5장 · 제비가 본 것들

| 파일명 | 장면 |
|---|---|
| `images/05-eyes.webp` | A city square where a small match seller weeps over matches fallen in a gutter, and a swallow carrying a sapphire down to press it into her palm, her face lighting up, moving. 〔이 쪽에 실린 글 (9/14) — 그림에 글자는 넣지 마세요. 왼쪽: 며칠 뒤 광장에 아이 하나가 서 있었습니다. 성냥을 팔러 나온 아이였지요. 그런데 그만 성냥을 도랑에 다 빠뜨리고 말았습니다. 아이는 주저앉아 울음을 터뜨렸지요. 지나가는 사람마다 힐끗 보고는 그냥 갔습니다. 엄마한테 뭐라고 하지…. / 오른쪽: 왕자가 조용히 말했지요. 제비야, 남은 눈도 빼 다오. 안 됩니다. 그러면 아무것도 못 보시잖아요.〕 |
| `images/05-eyes-2.webp` | A gilded statue standing ON ITS STONE COLUMN (feet on the pedestal, ordinary statue scale, NOT floating), BLIND with two hollow eye sockets, a swallow perched on its shoulder describing the city, and the bird peeling thin sheets of gold leaf from the statue to carry away, poignant and warm. 〔이 쪽에 실린 글 (10/14) — 그림에 글자는 넣지 마세요. 왼쪽: 아이는 그것을 쥐고 웃으며 달려갔습니다. 제비는 동상으로 돌아왔지요. 이제 앞을 못 보시잖아요. 저는 안 갈래요. 제가 눈이 되어 드릴게요. / 오른쪽: 굴뚝 위에 굴뚝새가 새끼를 쳤어요. 그러던 어느 날 제비가 이렇게 말했지요. 저 골목에 사는 아이들은 날마다 굶어요.〕 |

## 6장 · 첫눈이 내리던 밤

| 파일명 | 장면 |
|---|---|
| `images/06-snow.webp` | Children in narrow streets eating bread and laughing as a swallow flits away, and the statue above now stripped to dull grey lead, BLIND with two plain hollow eye sockets (the sapphires are long gone - do NOT give him seeing eyes), no ruby on his sword hilt, standing firmly on his stone column, passersby frowning up at it, bittersweet. 〔이 쪽에 실린 글 (11/14) — 그림에 글자는 넣지 마세요. 왼쪽: 제비는 금박을 한 장씩 떼어 날랐습니다. 굶는 집마다 찾아가 창턱에 놓아 주었지요. 아이들 얼굴이 하루가 다르게 밝아졌습니다. 빵을 배불리 먹고 골목으로 뛰어나왔지요. 이제 배가 안 고파! / 오른쪽: 거리에 아이들 웃음소리가 돌아왔습니다. 저 집 아이는 오늘 처음 웃었어요. 제비가 그렇게 전하면 왕자는 조용히 웃었지요. 그러는 사이 금박이 한 장도 남지 않아 잿빛 납덩이가 드러났습니다.〕 |
| `images/06-snow-2.webp` | A dull grey lead statue in falling snow, BLIND with hollow eye sockets and not a scrap of gold left on him, a small swallow huddled at his feet reaching up to touch his bare grey cheek one last time, quiet snowfall, deeply tender. 〔이 쪽에 실린 글 (12/14) — 그림에 글자는 넣지 마세요. 왼쪽: 겨울이 깊어졌습니다. 어느 밤 첫눈이 소복소복 내렸지요. 제비는 몸이 몹시 추웠습니다. 날개가 무거워 잘 펴지지도 않았지요. 그래도 제비는 떠나지 않고 왕자의 발치에 가만히 앉아 있었습니다. 도시의 불빛이 눈앞에서 하나씩 흐려졌지요. / 오른쪽: 이제 정말 가야겠어요. 따뜻한 나라로 가는 게냐? 아니요. 아주 먼 곳이요.〕 |

## 7장 · 가장 귀한 것 둘

| 파일명 | 장면 |
|---|---|
| `images/07-ending.webp` | A snowy square in morning light where a pompous mayor and councillors in gold chains stare up at a dull stripped statue - BLIND with hollow eye sockets, no gold, no ruby on the sword hilt - standing on its column with a small dead swallow at its feet, cold and ironic. 〔이 쪽에 실린 글 (13/14) — 그림에 글자는 넣지 마세요. 왼쪽: 납으로 된 심장이 두 쪽으로 갈라진 것이었습니다. 그만큼 추운 밤이었지요. 이튿날 아침 시장이 신하들을 데리고 광장을 지나갔습니다. 기둥을 올려다보던 시장이 걸음을 뚝 멈췄지요. 저게 무슨 꼴인가! 루비도 없고 눈도 없구먼. / 오른쪽: 이래서야 거지나 다름없지. 녹여서 다른 동상을 세우지요. 신하들이 서로 눈치를 보며 고개를 끄덕였습니다.〕 |
| `images/07-ending-2.webp` | A foundry where a cracked lead heart refuses to melt and is tossed onto a rubbish heap beside a small dead swallow, and later children in bright warm clothes playing in the same street, quietly redemptive. 〔이 쪽에 실린 글 (14/14) — 그림에 글자는 넣지 마세요. 왼쪽: 동상은 용광로에 넣어졌습니다. 쇳물이 부글부글 끓고 쇠망치 소리가 쨍쨍 울렸지요. 그런데 납으로 된 심장만은 아무리 넣어도 녹지 않았습니다. 이건 왜 안 녹지? 참 이상한 납덩이일세. / 오른쪽: 하필 죽은 제비가 놓인 자리였습니다. 그 도시에서 가장 귀한 것 둘이 그렇게 나란히 놓이게 된 것이지요. 세월이 한참 흐른 뒤에도 이야기는 그대로 전해졌습니다. 그 많던 금박은 다 어디 갔을까? 저 골목 아이들 손으로 갔지.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
