# 제미나이 그림 프롬프트 — 소공자

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
children's classics were painted: gouache and watercolor, bold clean outlines, warm
saturated colors, realistic proportions with expressive faces, the 1880s:
a cramped New York side street on one side and an old English castle and
green estate on the other, firelight and lamplight indoors, warm and
good-humoured mood, no text or letters in the image.
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
Cedric: a sturdy boy of seven with shoulder-length golden curls and large
brown eyes, straight-backed and completely unafraid, in a black velvet suit
with a lace collar once he reaches England.
Mrs Errol ("Dearest"): a young widow in a plain black dress, quiet and
composed, gentle eyes.
The Earl of Dorincourt: a tall gaunt old aristocrat with white hair, a high
nose and heavy brows, one bandaged foot on a stool, a gold-headed cane, a
severe mouth that is not as severe as it looks.
Mr Hobbs: a large heavy New York grocer in shirtsleeves and an apron, always
with a newspaper, a booming voice.
Dick: a wiry teenage shoeshine boy in patched clothes with a shoeblack box.
Mr Havisham: a thin precise old lawyer in black with a leather case.
Dougal: a huge deerhound that follows the Earl everywhere.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a small golden-haired boy in a velvet suit standing beside a huge armchair holding the hand of a gaunt white-haired old man who is seated with a bandaged foot; a great hound at their feet, a firelit library rising into shadow behind them, tall windows above. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | A firelit library at night with two empty chairs drawn close together, a footstool between them, a large sleeping hound on the rug, one lamp still burning. |

## 1장 · 뉴욕의 골목

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A crowded narrow New York street in the 1880s: laundry lines, stoops, barrels; a small golden-haired boy walking through it greeted by everyone he passes. |
| `images/story-01-b.webp` | A grocery store front: a big man in an apron reading a newspaper in a chair, a small boy sitting solemnly on a crate beside him, both talking like equals. |

## 2장 · 낯선 손님

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A carriage entirely out of place at the mouth of a poor street, neighbours staring, a thin lawyer in black stepping down with a leather case. |
| `images/story-02-b.webp` | A small plain parlour: the lawyer explaining with papers on his knee, a young widow gone pale, a boy standing in the doorway not understanding a word of it. |

## 3장 · 골목과의 작별

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | The grocery store: the big grocer with his hat off fanning himself in shock, a boy on the crate explaining something very seriously. |
| `images/story-03-b.webp` | A ship pulling away from a New York pier: a boy at the rail waving hard, and on the dock a huge man in an apron and a shoeshine boy waving back. |

## 4장 · 도린코트 성

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A carriage on a long drive through ancient oaks, a great grey castle with ivy on its walls appearing ahead, deer on the grass. |
| `images/story-04-b.webp` | A castle entrance hall: a line of servants standing stiffly, a small boy walking down the line greeting each one, a butler entirely at a loss. |

## 5장 · 할아버지

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | A vast dim library: a gaunt old man in a great chair with a bandaged foot on a stool, a huge hound rising, a small golden-haired boy walking in and putting out his hand without a trace of fear. |
| `images/story-05-b.webp` | A very long dining table: the old man at one end and the small boy at the other, the boy talking happily, the old man leaning forward to hear despite himself. |

## 6장 · 날마다 가는 길

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | A boy on a small pony trotting down a tree-lined lane with a groom riding behind, morning light, the castle small in the distance behind them. |
| `images/story-06-b.webp` | A modest cottage parlour: a young widow and her son sitting close together on a settle, an hour's visit almost over, the boy's cap already in his hand. |

## 7장 · 언쇼 마을

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A poor tenant village: sagging roofs with holes, standing water in the lane, barefoot children in doorways, a small well-dressed boy standing among them looking up at a broken roof. |
| `images/story-07-b.webp` | The library: the boy standing before the old man's chair speaking earnestly, the old man's face closed and hard, the fire low. |

## 8장 · 지붕이 고쳐지다

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | The same village under repair: scaffolding, workmen on new roofs, fresh timber and stone, a small boy in the middle of it carrying a bucket of water to the men. |
| `images/story-08-b.webp` | An estate office: a stunned land agent with his hat in his hands, the old earl at a desk giving an order he has never given before. |

## 9장 · 교회에서

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | An old village church: the earl walking up the aisle leaning on a boy's shoulder, the whole congregation turned to watch, sunlight through the windows. |
| `images/story-09-b.webp` | Outside the church after the service: an old tenant with his hat off thanking the earl, the earl gruff and looking away, the boy beaming beside him. |

## 10장 · 낯선 여자

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | The library: an overdressed woman standing before the earl holding a paper out, a loud sullen child at her side, the earl half risen from his chair. |
| `images/story-10-b.webp` | A cottage room: a mother and son sitting on the hearthrug, the boy asking a question, the mother holding both his hands. |

## 11장 · 뉴욕에서 온 사람들

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A New York street corner: the grocer, still in his apron, thrusting an English newspaper at a shoeshine boy who has half risen from his box in astonishment. |
| `images/story-11-b.webp` | A ship's deck crossing the Atlantic: the big grocer in an ill-fitting travelling coat gripping the rail, the shoeshine boy beside him, grey water. |

## 12장 · 밝혀지다

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | An inn room: a door thrown open, a lawyer and several men in the doorway, and behind them a weather-beaten man from the west whom the woman inside has clearly recognised. |
| `images/story-12-b.webp` | The library at night: the earl standing at a dark window with his back to the room, the lawyer waiting at the door with his hat in his hands. |

## 13장 · 성으로 오시오

| 파일명 | 장면 |
|---|---|
| `images/story-13-a.webp` | A small cottage parlour: the tall old earl seated stiffly with both hands on his cane, a young widow across from him, a workbasket on the table between them, firelight. |
| `images/story-13-b.webp` | The cottage doorway: the old man about to step out into the night, the young woman's hand on his arm, and he does not pull away. |

## 14장 · 여덟 번째 생일

| 파일명 | 장면 |
|---|---|
| `images/story-14-a.webp` | A great garden party on castle lawns: marquees, long tables, village families in their best clothes, children running; on the steps the earl, the boy and his mother receiving them together. |
| `images/story-14-b.webp` | The earl shaking hands with a large embarrassed American grocer in a brand-new suit, the boy between them delighted, guests looking on. |

## 15장 · 서재의 불빛

| 파일명 | 장면 |
|---|---|
| `images/story-15-a.webp` | The library late at night: the old man in his chair and the boy sitting on the footstool leaning against his knee, the hound asleep between them, the fire burnt low. |
| `images/story-15-b.webp` | The castle seen from the dark park outside: warm light now in windows all along the great house instead of the library alone, stars above. |
