# 제미나이 그림 프롬프트 — 톰 소여의 모험

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
children's classics were painted: gouache and watercolor, bold clean outlines, bright
saturated summer colors, realistic child proportions with lively expressive
faces, a small Mississippi river town in the 1840s: whitewashed fences, frame
houses, a steamboat on the wide brown river, woods and bluffs, strong
sunlight, humorous and energetic mood, no blood or wounds shown, no text or
letters in the image.
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
The artwork must bleed to all four edges of the image: no white or cream
margin, no border, no frame line, no painted paper edge, no matting.
The picture fills the whole canvas corner to corner.

Once more, so it is not missed: this is one painting with NO writing in it.
No title, no caption, no signature, no page number, no letters anywhere.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Tom Sawyer: a wiry sunburnt boy of about twelve with untidy brown hair,
straw hat, patched shirt and rolled-up trousers, always mid-scheme.
Huckleberry Finn: a boy a little older, barefoot, in a man's cast-off coat far
too big for him, a battered hat, relaxed and unbothered by anything.
Aunt Polly: a small elderly woman in spectacles pushed up on her forehead,
apron, a switch in her hand more often than she uses it.
Becky Thatcher: a girl of about twelve with golden hair in two braids and a
white summer dress.
Joe Harper: a plain sensible boy, Tom's age.
Muff Potter: a shabby harmless old man with a grey stubble beard.
Scarred Joe (the villain): a lean man with an ordinary, even good-looking
face and an old scar down one cheek, dark clothes, often half in shadow.
Draw him as a man, not a monster — the fear comes from the situation.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a barefoot boy in a straw hat sitting on top of a long whitewashed fence with a dripping brush in one hand, grinning down at the viewer; behind and below him the fence runs away toward a small river town and a steamboat on a wide brown river, tall summer sky. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | An empty raft tied at a riverbank at sunset, a straw hat and a fishing pole lying on it, the wide river going gold. |

## 1장 · 톰!

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A farmhouse kitchen: an old woman flinging open a cupboard door to find a boy crouched inside with jam around his mouth, her spectacles pushed up on her forehead. |
| `images/story-01-b.webp` | Two boys circling each other in a dusty village street at evening, fists up, one in new clothes and shoes, one barefoot; a dog watching. |

## 2장 · 토요일 아침

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A boy alone before an enormous whitewashed fence with a bucket and brush, shoulders down, the fence stretching far out of the frame; other children running toward the river in the distance. |
| `images/story-02-b.webp` | The same fence later: three or four boys busily painting while the first boy sits in the shade eating an apple, a heap of traded treasures beside him — marbles, a key, a one-eyed kitten, a dead rat on a string. |

## 3장 · 새로 온 아이

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | A boy showing off with a handstand outside a garden fence while a golden-haired girl watches from the porch, half amused; a flower just tossed over the fence. |
| `images/story-03-b.webp` | A schoolroom desk: two children with their heads together over a slate, the boy covering the writing with his hand, the girl pulling at it, both laughing. |

## 4장 · 한밤중의 묘지

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | Two boys creeping into a moonlit graveyard on a hill, crooked wooden grave markers and long grass, one boy carrying a dead cat by the tail, big elm trees. |
| `images/story-04-b.webp` | Seen from behind a tree trunk at ground level: three men with a lantern arguing over a fresh grave, their shadows huge, two small faces watching from the dark in the foreground. |

## 5장 · 두 아이의 비밀

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | The inside of a derelict tannery at night: two boys crouched over a shingle, writing on it in red chalk by moonlight, one pressing his thumb to it. |
| `images/story-05-b.webp` | A village street the next morning: a crowd, a shabby harmless old man being led away by the sheriff, looking back over his shoulder at two boys standing frozen in the crowd. |

## 6장 · 해적이 되다

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | Three boys poling a stolen raft down a wide moonlit river at midnight, a bundle of food and a frying pan aboard, the town lights small behind them. |
| `images/story-06-b.webp` | A campfire on a sandbar at dawn: bacon in a pan, three boys sprawled around it eating, an island of green trees behind, the great river beyond. |

## 7장 · 돌아온 세 아이

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A packed village church, everyone in black, the minister speaking, an old woman weeping in the front pew. |
| `images/story-07-b.webp` | The same church an instant later: the back door open and three grubby boys walking up the aisle, every head turned, the minister's mouth open in mid-word. |

## 8장 · 법정에서

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | A crowded small-town courtroom in summer, everyone fanning themselves, the shabby old man slumped in the dock, a boy standing up in the witness box looking very small. |
| `images/story-08-b.webp` | A window smashed outward, glass in the air, a dark figure already half through it, the courtroom erupting behind. |

## 9장 · 유령의 집

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | A derelict house on a hill with broken windows and a caved-in porch, two boys with a pick and shovel approaching it in bright daylight. |
| `images/story-09-b.webp` | Seen through the gaps of an upstairs floor: two men below in the ruined room, a broken chest open on the floor with gold coins spilling out, and two eyes at a crack in the boards above. |

## 10장 · 헉이 지킨 밤

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | A barefoot boy following two men up a dark hillside path at night, keeping to the shadow of a hedge, a lit house at the top of the hill. |
| `images/story-10-b.webp` | A farmhouse door thrown open at midnight, a man and his sons taking guns down from the wall, a small breathless boy in the doorway pointing up the hill. |

## 11장 · 동굴 소풍

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A picnic party of children with candles at the wide mouth of a limestone cave, names smoked onto the rock wall, laughter, bright day outside. |
| `images/story-11-b.webp` | Deep inside the cave: two children with one candle between them in a narrow passage of pale rock, the darkness closing on all sides, bats overhead. |

## 12장 · 길을 잃다

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | Total darkness broken by one small flame: two children sitting under a dripping ledge sharing a scrap of cake, the girl asleep against the boy's shoulder. |
| `images/story-12-b.webp` | A boy on his knees at a crack in the rock far up a bluff, daylight and the great brown river visible through the gap, one hand thrust out into the sunlight. |

## 13장 · 봉해진 문

| 파일명 | 장면 |
|---|---|
| `images/story-13-a.webp` | A heavy iron door set into a cave mouth, newly padlocked, men with lanterns gathered before it, a boy pulling at a judge's sleeve. |
| `images/story-13-b.webp` | Deep in the cave by candlelight: two boys digging under a smoked cross on the rock wall, a pick striking wood, the corner of a box showing in the dirt. |

## 14장 · 만이천 달러

| 파일명 | 장면 |
|---|---|
| `images/story-14-a.webp` | Two boys hauling two heavy sacks up a village street at night on a borrowed handcart, straining, the lit windows of a big house at the top of the hill. |
| `images/story-14-b.webp` | A parlour full of guests: two sacks upended on a table and gold coins pouring off the edge onto the floor, every face in the room astonished, two boys standing beside the table. |

## 15장 · 헉이 도망친 까닭

| 파일명 | 장면 |
|---|---|
| `images/story-15-a.webp` | Behind an old slaughterhouse: a boy in ragged old clothes sitting inside an empty barrel, another boy in a clean shirt crouching to look in at him. |
| `images/story-15-b.webp` | Two boys walking up a hill road away from the viewer in late afternoon light, one still barefoot, the small town and the wide river spread out below them. |
