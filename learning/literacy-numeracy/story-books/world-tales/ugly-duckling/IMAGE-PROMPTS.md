# 제미나이 그림 프롬프트

이 책은 하나의 이야기를 7개의 장(챕터)으로 나눠 담았고, 펼침면은 모두
14개예요. 펼침면 하나에 그림이 한 장씩 들어갑니다.
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
bold clean outlines, saturated storybook colors, soft Danish farm light through
four seasons, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a reedy farm pond and duck yard,
open marshes, a peasant cottage interior, a frozen lake and a spring garden pond,
expressive animal faces, wide panoramic composition, tender and never cruel.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The ugly duckling: a large grey gawky bird with an over-long neck and clumsy
feet, growing whiter through the story. The mother duck: a round brown duck who
tries to be fair. The yard ducks and hens: plump, smug, comically snooty. The old
farm woman: a squinting woman in a headscarf with thick spectacles. The swans:
tall serene white birds with wide wings.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a large grey gawky duckling standing alone at the edge of a reedy pond, its reflection in the still water showing a white swan, autumn light and drifting leaves, tender and beautiful. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 마지막에 깨어난 알

| 파일명 | 장면 |
|---|---|
| `images/01-hatching.webp` | A reedy pond bank in summer where a brown mother duck sits on a nest as fluffy yellow ducklings break out of their shells, one noticeably larger egg still whole beside them, warm and charming. 〔이 쪽에 실린 글 (1/14) — 그림에 글자는 넣지 마세요. 왼쪽: 여름 농장의 연못가였습니다. 엄마 오리가 둥지에 앉아 알을 품고 있었지요. 햇볕이 등을 따끈하게 데우고 갈대가 사각사각 흔들렸습니다. 드디어 알이 조금씩 흔들리기 시작했지요. 톡, 톡. / 오른쪽: 삐악! 삐악! 엄마 오리는 아기들을 하나씩 세어 보았지요. 하나, 둘, 셋, 넷, 다섯…〕 |
| `images/01-hatching-2.webp` | A nest where a large grey gawky duckling with a long neck stumbles out of a broken shell beside five small yellow siblings, the mother duck tilting her head then drawing it close, tender. 〔이 쪽에 실린 글 (2/14) — 그림에 글자는 넣지 마세요. 왼쪽: 엄마 오리는 그 알을 하루 더 품었습니다. 이튿날 아침 드디어 그 알도 쩍 갈라졌지요. 안에서 부리 하나가 쑥 나왔지요. 아기 하나가 뒤뚱거리며 걸어 나왔습니다. / 오른쪽: 목도 유난히 길고 발이 커서 자꾸 제 발에 걸렸지요. 소리도 삐악이 아니라 꽥에 가까웠습니다. 어머, 이게 무슨 일이니? 엄마 오리는 고개를 몇 번이나 갸웃했습니다.〕 |

## 2장 · 미운 오리라고 불렀어요

| 파일명 | 장면 |
|---|---|
| `images/02-teased.webp` | A busy farm duck yard where plump ducks and hens crowd around a large grey duckling, pecking and jeering while its yellow siblings turn away, the mother duck looking weary, sad but not brutal. 〔이 쪽에 실린 글 (3/14) — 그림에 글자는 넣지 마세요. 왼쪽: 다음 날 엄마 오리는 아기들을 데리고 농장 마당으로 나섰습니다. 마당에 있던 오리들이 우르르 모여들었지요. 어머, 저건 뭐야? / 오른쪽: 그런데 누군가 다가와 목덜미를 콕 쪼았지요. 저리 가! 미운 오리야! 형제들까지 등을 돌렸습니다.〕 |
| `images/02-teased-2.webp` | A grey duckling huddled among reeds staring at its reflection with a tear falling, and at dusk squeezing under a farmyard fence into open fields, lonely and resolute. 〔이 쪽에 실린 글 (4/14) — 그림에 글자는 넣지 마세요. 왼쪽: 아기 오리는 마당 구석으로 갔습니다. 갈대 사이에 몸을 웅크렸지요. 물에 제 모습을 비춰 보았습니다. 정말 다르게 생겼더군요. '나는 왜 이럴까.' / 오른쪽: 날마다 같은 일이 되풀이됐습니다. 쪼이고 밀리고 놀림을 받았지요. 밥 먹을 때도 늘 맨 끝이었습니다. 그러던 어느 저녁 아기 오리는 마음을 정했지요.〕 |

## 3장 · 혼자 떠난 길

| 파일명 | 장면 |
|---|---|
| `images/03-leaving.webp` | A wide marshland at dawn where a grey duckling walks alone past wild ducks, and then flattening itself among reeds as gunshots crack and birds burst into the sky, tense but not gory. 〔이 쪽에 실린 글 (5/14) — 그림에 글자는 넣지 마세요. 왼쪽: 들판은 생각보다 아주 넓었습니다. 아기 오리는 밤새도록 걸었지요. 풀숲에 몸을 묻고 자다가 아침이면 또 걸었습니다. 며칠 만에 늪지에 사는 오리들을 만났지요. 넌 참 못생겼구나. / 오른쪽: 아기 오리는 그곳에서 며칠을 지냈습니다. 그러던 어느 아침이었지요. 탕!〕 |
| `images/03-leaving-2.webp` | A storm-lashed field where a grey duckling squeezes under a cottage door, and inside a dim room with a squinting old woman, a smug cat and a hen looking the duckling up and down, comic and sad. 〔이 쪽에 실린 글 (6/14) — 그림에 글자는 넣지 마세요. 왼쪽: 아기 오리는 해가 질 때까지 숨을 죽이고 있었지요. 어두워지고 나서야 다시 길을 나섰습니다. 그런데 비바람이 세차게 몰아쳤지요. 겨우 낡은 오두막 하나를 찾아 문틈으로 몸을 밀어 넣었습니다. 안은 훈훈하고 조용했지요. 젖은 깃털에서 물이 뚝뚝 떨어졌습니다. / 오른쪽: 눈이 어두운 할머니가 고양이와 암탉과 함께 살고 있었습니다. 너는 알을 낳을 줄 아니? 등을 세워 소리를 낼 줄은 아니?〕 |

## 4장 · 가을이 오고

| 파일명 | 장면 |
|---|---|
| `images/04-swans.webp` | An autumn lake at dusk where a grey duckling gazes up at a flock of great white swans crossing a golden sky with wide wings, its neck stretched high, awestruck and beautiful. 〔이 쪽에 실린 글 (7/14) — 그림에 글자는 넣지 마세요. 왼쪽: 가을이 되어 잎이 노랗게 물들었습니다. 아기 오리는 어느 호수에 머물렀지요. 물이 차가워지고 바람도 서늘해졌습니다. 아기 오리는 혼자 물 위를 떠다녔지요. 어느 저녁이었지요. 하늘이 갑자기 소란해졌습니다. 아기 오리가 고개를 들어 보았지요. / 오른쪽: 하얀 새 떼가 줄지어 날아가고 있었습니다. 목이 길고 날개가 아주 넓었지요. 어찌나 아름답던지 숨이 멎는 것 같았습니다. 아기 오리는 저도 모르게 소리를 냈지요. 처음 들어 보는 제 목소리였습니다. 그러나 새들은 저 멀리 사라져 버렸습니다. 아기 오리는 한참 동안 빈 하늘을 올려다봤지요.〕 |
| `images/04-swans-2.webp` | A darkening lake where a grey duckling spreads its weak wings and beats them a few times, only ripples spreading, the last light fading from the water, wistful and quiet. 〔이 쪽에 실린 글 (8/14) — 그림에 글자는 넣지 마세요. 왼쪽: '저 새들은 뭘까.' '어디로 가는 걸까.' 이름조차 알지 못했습니다. / 오른쪽: 아기 오리는 물에 몸을 담그고 날개를 펴 보았지요. 아직 힘이 없어 몇 번 퍼덕이다 말았습니다. 물결만 잔잔하게 일렁였지요. 나도 언젠가는…… 말끝을 흐리는 사이 해가 완전히 넘어갔습니다. 호수가 어두워졌지요.〕 |

## 5장 · 길고 추운 겨울

| 파일명 | 장면 |
|---|---|
| `images/05-winter.webp` | A freezing lake where a grey duckling paddles in a shrinking patch of open water, then held fast in ice at dawn as a farmer approaches across the white expanse, stark and moving. 〔이 쪽에 실린 글 (9/14) — 그림에 글자는 넣지 마세요. 왼쪽: 겨울이 찾아왔습니다. 바람이 살을 에듯 불었지요. 호수가 가장자리부터 조금씩 얼어붙었습니다. 발이 시려 자꾸 물속에서 발을 바꿔 디뎠지요. 아기 오리는 얼지 않으려고 밤새 헤엄을 쳤지요. 그래도 얼음은 자꾸자꾸 좁혀 왔습니다. / 오른쪽: 어느 새벽이었지요. 아기 오리는 몸이 꼼짝도 하지 않았습니다. 얼음에 갇혀 버린 것이었지요. 아기 오리는 그만 눈을 감았습니다. '여기까지구나.'〕 |
| `images/05-winter-2.webp` | A farm kitchen where a rescued duckling thaws by the hearth, then panics as children reach for it, flapping into a milk pail and sending flour and milk flying, comic chaos, warm colours. 〔이 쪽에 실린 글 (10/14) — 그림에 글자는 넣지 마세요. 왼쪽: 농부는 얼음을 깨고 아기 오리를 품에 안았습니다. 그러고는 서둘러 집으로 데려갔지요. 난롯가에 눕히자 언 몸이 조금씩 녹았습니다. 아기 오리는 겨우 눈을 떴지요. 그런데 아이들이 만져 보겠다며 우르르 몰려왔습니다. / 오른쪽: 이리 와 봐! 아기 오리는 겁이 덜컥 났지요. 푸드덕 날아오르다 우유통에 빠지고 말았습니다. 어머나!〕 |

## 6장 · 물에 비친 모습

| 파일명 | 장면 |
|---|---|
| `images/06-reflection.webp` | A thawing spring lakeside where a large white-feathered bird spreads unexpectedly broad wings and lifts off the water for the first time, reeds and new green everywhere, exhilarating. 〔이 쪽에 실린 글 (11/14) — 그림에 글자는 넣지 마세요. 왼쪽: 겨울은 길고 길었습니다. 아기 오리는 갈대밭에서 그 겨울을 버텼지요. 먹을 것이 없어 마른 풀뿌리를 씹기도 했습니다. 그래도 아기 오리는 하루하루를 견뎌 냈습니다. 그러던 어느 날 바람의 냄새가 달라졌지요. 얼음이 쩌억 소리를 내며 갈라지기 시작했습니다. / 오른쪽: 봄이 온 것이었지요. 물가에 파릇한 싹이 돋기 시작했습니다. 아기 오리는 물가로 나와 오랜만에 날개를 펴 보았습니다. 그러고는 깜짝 놀랐지요. 날개가 아주 넓어져 있었거든요. 한 번 힘껏 치자 몸이 둥실 떠올랐습니다. 아기 오리는 그대로 하늘로 날아올랐지요.〕 |
| `images/06-reflection-2.webp` | A garden pond where a white bird lands among great swans and bows its head expecting rejection, then sees its own reflection — a graceful white swan — in the still water, moving and radiant. 〔이 쪽에 실린 글 (12/14) — 그림에 글자는 넣지 마세요. 왼쪽: 아래로 넓은 정원이 내려다보였습니다. 연못에 하얀 새들이 떠 있었지요. 지난가을에 본 바로 그 새들이었습니다. 아기 오리는 조심조심 물 위에 내려앉았지요. 가슴이 쿵쿵 뛰었습니다. 백조들이 이쪽을 바라보고 있었거든요. / 오른쪽: '또 쫓겨나겠지.' 아기 오리는 고개를 푹 숙였지요. 그 순간 물에 제 얼굴이 비쳤습니다. 거기에 잿빛 오리는 없었지요. 길고 흰 목과 눈처럼 흰 깃털이 있었습니다.〕 |

## 7장 · 백조가 되어

| 파일명 | 장면 |
|---|---|
| `images/07-swan.webp` | A sunlit garden pond where great white swans bow their necks in greeting to a newly grown swan, who stands overwhelmed with tears, all of them then gliding together, deeply warm. 〔이 쪽에 실린 글 (13/14) — 그림에 글자는 넣지 마세요. 왼쪽: 큰 백조들이 천천히 다가왔습니다. 아기 오리는 몸을 잔뜩 움츠렸지요. 그런데 백조들은 쪼지 않았습니다. 오히려 목을 굽혀 인사했지요. 어서 와요. / 오른쪽: 아기 오리는 아무 말도 나오지 않았습니다. 눈물만 자꾸 났지요. 저는… 미운 오리인데요. 누가 그런 말을 하던가요?〕 |
| `images/07-swan-2.webp` | A spring garden pond where children toss bread and point in delight at a new white swan among the others, the swan shyly tucking its head then spreading its wings wide in the sunlight, joyful. 〔이 쪽에 실린 글 (14/14) — 그림에 글자는 넣지 마세요. 왼쪽: 아이들이 연못가로 몰려나왔습니다. 빵을 뜯어 물 위에 던져 주었지요. 저것 봐, 새 백조가 왔어! 제일 예쁘다! / 오른쪽: 그러다 문득 이런 생각이 들었습니다. '미운 오리였을 때도……' '나는 나였는데.'〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
