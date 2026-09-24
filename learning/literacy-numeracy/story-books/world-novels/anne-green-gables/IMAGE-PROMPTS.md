# 제미나이 그림 프롬프트 — 빨간 머리 앤

하나의 이야기를 열다섯 장으로 나눠 담았고, 장마다 그림이 두 장씩 들어갑니다.
그림이 있는 펼침면은 오른쪽 쪽에 그림 한 장이 들어가고, 그림이 없는 펼침면은 양쪽 쪽에 글만 들어갑니다.
아래 프롬프트를 제미나이에 넣어 생성한 뒤 파일명을 정확히 맞춰 `images/` 폴더에 넣으면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보입니다.)

권장 크기: **가로 4 : 세로 3** 비율, PNG.
그림이 칸을 꽉 채워야 하니 가장자리에 흰 여백이나 테두리를 두지 마세요. 그림이 네 변 끝까지 닿아야 합니다.

**단 표지(`cover.webp`)만 예외 — 세로 2 : 3 비율입니다.** 표지 그림칸은 책을 펼쳤을 때 왼쪽 반쪽 전체를 채우는데,
그 칸 자체가 세로로 긴 2:3 모양입니다. 4:3 가로 그림을 넣으면 양옆이 절반 가까이 잘려 나갑니다.

## 공통 스타일 지시문 (모든 프롬프트 앞에 붙여서 쓰세요)

```
A SINGLE PAINTING ONLY. This is one picture, not a page from a book.
Every surface in it is blank: no title, no caption, no signature, no page
number, no speech balloon, no sign, no label, no writing on any book, map,
paper, banner or wall. There are no letters of any alphabet anywhere in the
picture, and no borders or panels around it. The picture fills the whole
canvas edge to edge.

MEDIUM - this matters as much as the scene: a hand-painted illustration in
gouache and watercolour on textured paper. Visible brush strokes, washes that
pool and dry unevenly, soft painterly edges where one colour meets another,
ink line work over the paint, the grain of the paper showing through. The look
of a painted plate in an old hardbound children's classic. This is paint on
paper, not a drawing made on a screen: no flat cel shading, no even digital
fills, no glossy highlights, no animation-still look.

Every picture in this book must look as if one person painted them all on the
same day with the same brushes and the same paints: the same line weight, the
same palette, the same way of drawing a face. A character keeps the same face,
the same build, the same age and the same clothes from one picture to the
next, so a child turning the page knows at once that it is the same person.

Classic children's literature illustration painted the way the old Korean
children's classics were painted: gouache and watercolor, bold clean outlines, luminous
natural colors, realistic child proportions with expressive faces, Prince
Edward Island around 1890: red dirt roads, white farmhouses with green roofs,
apple and cherry blossom, birch woods, ponds and long low hills, warm and
open-air mood, no text or letters in the image.
Every person in this book has a clear, even, good-looking face: smooth skin,
straight teeth, calm bright eyes, a mouth at rest - the ordinary face of a
neighbour. This holds for the cruel ones too. Draw the cruel ones as handsome,
well-kept people you would trust on sight; what is frightening about them is
only what their hands are doing and how they stand. When one of them is angry,
the mouth is open in a shout and the brows are down, and that is all.
A person's body is drawn only as the story describes it and never as a sign of
character: beauty is not goodness here, and plainness is not badness.
Draw the moment in motion, not a posed portrait: catch people mid-stride,
mid-swing, mid-turn, mid-shout, cloth and hair and dust still moving. Faces
are big and expressive. Pick the most interesting instant in the scene and
stage it so a child wants to look at it for a while.
No blood, no wounds and no cruelty shown: when something violent happens,
draw the moment just before or just after it instead.
The artwork must bleed to all four edges of the image: no white or cream
margin, no border, no frame line, no painted paper edge, no matting.
The picture fills the whole canvas corner to corner.

Once more, so it is not missed: this is one painting with NO writing in it.
No title, no caption, no signature, no page number, no letters anywhere.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Anne Shirley: a thin freckled girl of eleven with very bright red hair in two
braids and large grey-green eyes; at first in a tight drab brown-grey wincey
dress, later in plain neat dresses, at sixteen taller and calmer but still
red-haired and freckled.
Matthew Cuthbert: a stooped shy old farmer of sixty with long iron-grey hair
and a full grey beard, brown homespun suit, gentle eyes, never comfortable
being looked at.
Marilla Cuthbert: an angular grey-haired woman with her hair in a hard knot,
plain dark dress and apron, severe mouth, kind eyes she does not show.
Diana Barry: a pretty black-haired rosy-cheeked girl the same age as Anne.
Gilbert Blythe: a tall good-looking boy with curly brown hair and a teasing
grin.
Mrs Rachel Lynde: a stout busy woman always with knitting in her hands.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a thin red-haired freckled girl standing on a red dirt road at sunset with an old carpet bag at her feet, arms flung wide as she looks up at an arch of white blossoming trees above her; a white farmhouse with a green roof small in the distance below. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | A lamplit window of a green-roofed farmhouse seen from the yard at dusk, an apple tree beside it, a road curving away into the hills. |

## 1장 · 역에 서 있던 아이

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | An empty country railway platform in late afternoon: a small red-haired girl in a too-tight brown dress sitting bolt upright on a pile of shingles hugging an old carpet bag, the track running away into green fields. |
| `images/story-01-b.webp` | A shy stooped old farmer taking off his hat, awkward and speechless, as the girl marches up to him with her hand already stuck out to shake. |

## 2장 · 초록 지붕 집으로 가는 길

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A buggy passing under a long arch of apple and cherry trees in full white bloom, petals in the air, the girl standing half up in the seat with her hands clasped, the old farmer watching her instead of the road. |
| `images/story-02-b.webp` | A pond below a bridge glowing red and gold with sunset, the buggy stopped on the bridge, two small figures looking down at the water. |

## 3장 · 돌려보내야 한다

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | A plain farm kitchen: an angular woman standing rigid with a spoon still in her hand, the shy farmer in the doorway, and a red-haired girl between them realising she is not wanted. |
| `images/story-03-b.webp` | A bare little gable bedroom at sunrise: the girl kneeling on the window seat in her nightgown looking out at a cherry tree in full bloom and the orchard and brook beyond. |

## 4장 · 마릴라의 마음

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A neighbour's parlour: a sharp-faced woman looking a small girl up and down like livestock, the girl gone white and silent, the grey-haired woman watching the girl's face and deciding something. |
| `images/story-04-b.webp` | The buggy going home along a red road in the evening light, the girl gripping the older woman's sleeve and talking, the older woman looking straight ahead but not pulling away. |

## 5장 · 린드 아주머니

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | A farm kitchen: a stout visitor seated with her knitting mid-sentence, and a small red-haired girl standing in the middle of the floor stamping her foot, face scarlet with fury. |
| `images/story-05-b.webp` | A neighbour's front room: the girl kneeling with her hands clasped delivering an enormously dramatic apology, the stout woman softening despite herself, the grey-haired woman turned away hiding her face. |

## 6장 · 마음의 친구

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | Two girls facing each other in a sunlit orchard, hands solemnly clasped, one red-haired and one black-haired, both very serious. |
| `images/story-06-b.webp` | A playhouse in a birch grove: boards laid on stones, chipped cups and bits of broken china set out, two girls kneeling in the moss arranging them. |

## 7장 · 석판이 부러진 날

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A one-room country schoolhouse: a boy leaning across the aisle tugging a red braid with a grin, the girl already rising out of her seat, other children turning to look. |
| `images/story-07-b.webp` | The same room a second later: a slate broken clean in two, the boy sitting stunned, the girl standing over him breathing hard, the teacher rising at the front. |

## 8장 · 다이애나를 초대한 날

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | Two girls playing at being grown-up ladies at a kitchen table, a red bottle and two glasses between them, everything very carefully arranged. |
| `images/story-08-b.webp` | A doorstep: a stern mother barring the door with her arm, a red-haired girl on the step below with her hands at her sides, a black-haired girl's face at an upstairs window. |

## 9장 · 한밤중의 눈길

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | Two girls running through deep snow at night with a lantern, shawls over their heads, a farmhouse light far ahead. |
| `images/story-09-b.webp` | A lamplit bedroom before dawn: the red-haired girl holding a small child upright against her shoulder and spooning medicine, steam rising from a kettle, an exhausted old servant asleep in a chair. |

## 10장 · 지붕 위에서

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | A girl in a sun hat walking along the ridgepole of a kitchen roof with her arms out for balance, a cluster of girls below in the yard looking up, one of them smirking. |
| `images/story-10-b.webp` | A bedroom in summer: the girl in bed with her ankle bound, the room crowded with visiting children, flowers on every surface, the grey-haired woman standing in the doorway with a tray. |

## 11장 · 여왕 학원

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A schoolroom after hours in winter: a small group of older pupils working at their desks by lamplight, a woman teacher moving between them, a red-haired girl and a brown-haired boy at opposite sides of the room. |
| `images/story-11-b.webp` | A girl running up a farm lane at dusk waving a newspaper over her head, another girl coming out onto the porch to meet her. |

## 12장 · 매슈의 선물

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | A country general store: a bashful old farmer at the counter surrounded by bolts of cloth, holding a garden rake he has just bought instead, the shopkeeper baffled. |
| `images/story-12-b.webp` | A farmhouse kitchen on Christmas morning: a soft brown dress with full puffed sleeves hanging by the door, a girl stopped halfway down the stairs with both hands at her mouth. |

## 13장 · 그날 아침

| 파일명 | 장면 |
|---|---|
| `images/story-13-a.webp` | A farmyard in August: an old farmer standing very still in the doorway with a fallen newspaper at his feet, the light behind him, a woman running toward him from the kitchen. |
| `images/story-13-b.webp` | A dim upstairs room at night: the grey-haired woman sitting on the bed holding the girl for the first time, both of them crying, one candle on the sill. |

## 14장 · 길모퉁이

| 파일명 | 장면 |
|---|---|
| `images/story-14-a.webp` | A red road on a hillside at sunset: a girl and a boy stopped a few steps apart, the boy with his hat in his hand, both of them awkward and about to speak. |
| `images/story-14-b.webp` | The same two walking down the hill together deep in conversation, long shadows, the sea and the hills behind them. |

## 15장 · 굽어진 길

| 파일명 | 장면 |
|---|---|
| `images/story-15-a.webp` | A young teacher walking to school on a red road on an autumn morning, books under her arm, maples turning red on both sides. |
| `images/story-15-b.webp` | A gable window at night seen from inside: a young woman sitting on the window seat looking out at a road that curves away out of sight over the hills, a lamp beside her. |
