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
bold clean outlines, saturated storybook colors, warm firelight against cool
stone, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a miller's cottage, castle store rooms
full of straw, a forest hut and a throne room, expressive comic faces, wide
panoramic composition, funny and never frightening.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The miller's daughter: a girl about 16 with braided hair and a plain grey dress,
frightened at first, steady later. The miller: a boastful red-faced man in a
floury apron. The king: a young man in a fur-trimmed cloak, greedy for gold. The
little man: a tiny wiry figure in a pointed cap and green coat with a wispy beard,
drawn as comical and sly, never scary. A messenger: a lanky man with muddy boots.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a dim tower room piled with golden thread on spindles, a small spinning wheel turning by itself and a tiny cloaked figure dancing in the corner shadows, moonlight through a barred window, mysterious and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 방앗간 주인의 허풍

| 파일명 | 장면 |
|---|---|
| `images/01-boast.webp` | A castle audience hall where a floury-aproned miller gestures grandly while a young king leans forward with gleaming eyes, the miller's face already turning sheepish, comic. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 방앗간 주인은 가난하기는 해도 허풍 하나는 대단했습니다. 어디를 가나 제 자랑을 늘어놓았지요. 듣는 사람이 고개를 절레절레 흔들 정도였습니다. 그에게는 딸이 하나 있었습니다. 손끝이 야무진 아이였지요. 어느 날 방앗간 주인이 임금님을 만났습니다. / 오른쪽: 큰 인물 앞에 서니 입이 근질거렸지요. 무슨 말이든 하고 싶어졌습니다. 그러다 그만 큰소리를 치고 말았지요. 제 딸은 짚으로 금실을 자을 줄 압니다!〕 |
| `images/01-boast-2.webp` | A miller telling his pale daughter the news in a poor cottage, and the girl being led through a great castle gate that closes behind her, sombre and tense. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그것 참 놀라운 재주로구나. 당장 그 딸을 데려오너라. 방앗간 주인은 등에 식은땀이 났습니다. 이제 와서 거짓말이라고 할 수도 없었지요. 집으로 돌아가 딸에게 사정을 말했습니다. / 오른쪽: 아버지, 저는 그런 재주가 없어요. 어쩌겠느냐. 임금님 말씀인데. 이튿날 아침 딸은 성으로 끌려갔지요. 성문이 등 뒤에서 쿵 하고 닫혔습니다.〕 |

## 2장 · 짚이 가득한 방

| 파일명 | 장면 |
|---|---|
| `images/02-straw.webp` | A stone store room piled to the ceiling with straw, a single spinning wheel in the middle and a weeping girl beside it, a locked door behind, tense and lonely. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 딸은 어느 방으로 안내되었습니다. 문을 열자 짚이 산더미처럼 쌓여 있었지요. 천장까지 닿을 지경이었습니다. 한가운데에 물레가 하나 놓여 있었지요. 임금님이 문을 닫으며 말했습니다. 아침까지 이 짚을 모두 금실로 자아 놓아라. / 오른쪽: 못 하면 목숨을 내놓아야 할 것이다. 문이 밖에서 잠겼습니다. 딸은 물레 앞에 털썩 주저앉았지요. 짚으로 금실을 잣는 법을 알 리가 없었습니다. 아무리 애를 써도 짚은 짚일 뿐이었지요.〕 |
| `images/02-straw-2.webp` | A tiny man in a pointed cap and green coat slipping in through a door crack into a straw-filled room, tilting his head at a weeping girl, comic and curious. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 얼마나 울었을까요. 문틈에서 무언가가 스르륵 들어왔지요. 딸은 놀라 눈물을 닦았지요. 아주 작은 남자였습니다. 뾰족한 모자에 초록 웃옷을 입었지요. 수염이 바람에 흔들리는 실 같았습니다. 남자가 고개를 갸웃하며 물었지요. / 오른쪽: 왜 그렇게 울고 있나요? 딸은 훌쩍이며 사정을 이야기했습니다. 저는 이 짚을 금실로 자을 수가 없어요.〕 |

## 3장 · 작은 남자

| 파일명 | 장면 |
|---|---|
| `images/03-little-man.webp` | A tiny man in a pointed cap sitting at a spinning wheel, straw feeding in one side and glittering golden thread winding out the other, the girl watching wide-eyed, magical. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 제가 해 드리지요. 딸이 숨을 삼켰습니다. 정말요? 할 수 있어요? / 오른쪽: 이 목걸이라도 드릴게요. 남자는 그것을 받아 주머니에 넣었습니다. 그러고는 물레 앞에 앉았지요. 작은 발로 발판을 굴렀습니다. 드르륵드르륵 소리가 나기 시작했지요.〕 |
| `images/03-little-man-2.webp` | Dawn light on a room stacked with glittering golden thread and no straw left, a girl asleep by the wheel and a king staring open-mouthed in the doorway, dazzling. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 남자는 밤새 물레를 돌렸습니다. 실패가 하나하나 금빛으로 가득 찼지요. 딸은 그 옆에서 깜박 잠이 들었습니다. 눈을 떠 보니 창이 훤했지요. 방에는 짚이 한 오라기도 남지 않았습니다. 작은 남자도 사라지고 없었지요. / 오른쪽: 아침에 문을 연 임금님은 그 자리에 멈춰 섰습니다. 금실이 벽을 따라 산더미처럼 쌓여 있었거든요. 이럴 수가! 그런데 임금님은 고마워하지 않았습니다. 오히려 더 큰 욕심이 났지요. 이만한 금을 매일 얻을 수 있다면 좋겠다고 생각했습니다.〕 |

## 4장 · 더 큰 방

| 파일명 | 장면 |
|---|---|
| `images/04-bigger.webp` | A much larger store room heaped with straw at dusk, a girl handing a small ring to a tiny man who is already rolling up his sleeves at the wheel, resigned and comic. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그날 저녁 임금님이 딸을 다른 방으로 데려갔습니다. 어제보다 두 배는 넓은 방이었지요. 역시 짚이 가득 쌓여 있었습니다. 오늘 밤에는 이 방을 채워라. 문이 또 잠겼습니다. 딸은 물레 앞에 앉아 한숨을 쉬었지요. 오늘 밤에도 그 남자가 와 줄까 싶었습니다. / 오른쪽: 그런데 얼마 지나지 않아서였습니다. 문틈으로 또 그 작은 남자가 들어왔지요. 이번에는 무엇을 주시겠습니까? 딸은 손가락에 낀 반지를 빼 주었습니다.〕 |
| `images/04-bigger-2.webp` | A king running his hands through heaps of golden thread and grinning greedily, then a vast warehouse-sized hall filled with straw and a small figure alone in it, dramatic. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이번에도 밤새 드르륵 소리가 났습니다. 아침이 되자 방은 금실로 가득 찼지요. 임금님은 얼굴이 발갛게 달아올랐습니다. 금실을 손으로 쓸어 보며 웃었지요. 그러고도 만족하지 않았습니다. / 오른쪽: 이번에 해내면 너를 왕비로 삼겠다. 딸은 손끝이 떨렸습니다. 셋째 날 밤에 끌려간 방은 창고만큼 넓었지요. 짚이 그야말로 산을 이루고 있었습니다. 문이 닫히고 딸은 혼자 남았습니다. 짚 냄새가 방 안에 가득했지요.〕 |

## 5장 · 줄 것이 없어서

| 파일명 | 장면 |
|---|---|
| `images/05-promise.webp` | A vast straw-filled hall at night where a tiny man holds out his hand slyly and a girl hesitates with her own hand half raised, torchlight and long shadows, heavy and quiet. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 작은 남자가 또 나타났습니다. 이번에는 여느 때보다 느긋해 보였지요. 남자가 손을 척 내밀었습니다. 이번에는 무엇을 주시겠습니까? / 오른쪽: 남자는 턱을 쓰다듬으며 생각했습니다. 그러고는 눈을 반짝였지요. 그럼 이렇게 하지요. 왕비가 된 뒤 첫아이를 주십시오.〕 |
| `images/05-promise-2.webp` | MUST MATCH the authentic 1980s cel-animation storybook style. Left: A wedding celebration in a castle courtyard with banners and crowds. Right: A sunlit royal medieval nursery where the queen holds a newborn baby beside an ornate cradle and neat antique wooden bookcases filled with leather-bound period books and scrolls. STRICTLY NO modern toys (NO plastic rainbow stacking rings, NO modern toy cars/trucks/tractors, NO modern plush teddy bears). All furniture and shelves must be crisp, sharp, period-appropriate medieval woodwork. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 작은 남자는 밤새 물레를 돌렸습니다. 아침이 되자 창고가 온통 금빛이었지요. 임금님은 약속한 대로 딸을 왕비로 삼았습니다. 온 나라에 잔치가 벌어졌지요. 방앗간 주인은 어깨가 으쓱했습니다. 왕비는 겉으로는 웃었지만 마음이 무거웠지요. / 오른쪽: 그날 밤 한 약속이 자꾸 떠올랐습니다. 그래도 시간이 지나자 차츰 잊고 지냈지요. 한 해가 가고 또 한 해가 갔습니다. 왕비는 예쁜 아이를 낳았습니다. 온 궁궐이 들썩였지요. 요람 곁에 꽃이 가득 놓였습니다.〕 |

## 6장 · 찾아온 약속

| 파일명 | 장면 |
|---|---|
| `images/06-baby.webp` | A nursery at night where a queen clutches her baby as a tiny man stands on the windowsill, moonlight and gauzy curtains, tense but gentle. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 왕비는 아이를 끔찍이 아꼈습니다. 하루 종일 곁을 떠나지 않았지요. 작은 남자와의 약속은 까맣게 잊었습니다. 그러던 어느 날 밤이었지요. 방 안 촛불이 갑자기 흔들렸습니다. 창문이 저절로 열렸지요. 왕비가 고개를 들었습니다. 창턱에 그 작은 남자가 서 있었지요. / 오른쪽: 뾰족한 모자도 초록 웃옷도 그대로였습니다. 약속한 것을 받으러 왔습니다. 왕비는 아이를 끌어안았습니다.〕 |
| `images/06-baby-2.webp` | A tiny man holding up three fingers on a windowsill while a kneeling queen weeps with her baby, moonlit nursery, tense and moving. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 나라의 보물을 다 드릴게요. 아이만은 안 돼요. 남자는 고개를 저었습니다. / 오른쪽: 그러더니 손가락 세 개를 펴 보였지요. 그럼 사흘 말미를 드리겠습니다. 사흘 안에 제 이름을 맞히면 없던 일로 하지요.〕 |

## 7장 · 온 나라의 이름

| 파일명 | 장면 |
|---|---|
| `images/07-names.webp` | A throne room where a queen reads from a long unrolled scroll of names while a tiny man shakes his head smugly, courtiers crowding the doorway, comic tension. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이튿날 왕비는 심부름꾼들을 사방으로 보냈습니다. 나라 안의 이름을 모조리 모아 오게 했지요. 두루마리가 방바닥까지 늘어졌습니다. 그날 밤 작은 남자가 다시 나타났지요. 왕비는 이름을 하나하나 불렀습니다. 카스파르? 멜히오르? 발타자르? / 오른쪽: 아닙니다. 아니고말고요. 왕비는 밤이 새도록 이름을 불렀지요. 그래도 맞는 이름은 나오지 않았습니다. 남자는 낄낄 웃으며 돌아갔습니다.〕 |
| `images/07-names-2.webp` | A queen despairing over lists of odd names, and then a mud-booted messenger bursting into the throne room breathless as she leaps up, comic urgency. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이튿날에는 별난 이름을 모았습니다. 갈비씨? 양다리? 끈쟁이? 남자는 여전히 고개를 저었지요. / 오른쪽: 마지막 날 낮이었습니다. 심부름꾼 하나가 헐레벌떡 뛰어 들어왔지요. 진흙 묻은 장화를 신은 채였습니다. 왕비님! 이상한 것을 보았습니다!〕 |

## 8장 · 숲속의 노래

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | A forest clearing at night where a tiny man capers on one leg around a bonfire singing, seen from behind a bush by a mud-booted messenger, comic and secretive. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 깊은 숲속을 지나는 길이었습니다. 산 밑 오두막 앞에 불이 피워져 있었지요. 그 앞에서 아주 작은 남자가 껑충껑충 뛰고 있었습니다. / 오른쪽: 이제 곧 왕비의 아이를 받는다! 내 이름이 룸펠슈틸츠헨인 줄 아무도 모르지! 왕비는 그 이름을 몇 번이나 되뇌었습니다. 심부름꾼에게 큰 상을 내렸지요. 그러고는 밤이 오기를 기다렸습니다.〕 |
| `images/08-ending-2.webp` | A lit palace nursery where a calm queen names the tiny man who leaps in shock with his cap flying off, then dashes out the door, comic and triumphant. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 밤이 되자 작은 남자가 나타났습니다. 자, 이름을 대 보시지요. 왕비는 시치미를 뚝 뗐습니다. / 오른쪽: 그것도 아닙니다. 남자는 벌써 아이 쪽으로 손을 뻗었지요. 그때 왕비가 조용히 말했습니다.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
