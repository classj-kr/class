# 제미나이 그림 프롬프트 — 올리버 트위스트

하나의 이야기를 열다섯 장으로 나눠 담았고, 장마다 그림이 두 장씩 들어갑니다.
그림이 있는 펼침면은 오른쪽 쪽에 그림 한 장이 들어가고, 그림이 없는 펼침면은 양쪽 쪽에 글만 들어갑니다.
아래 프롬프트를 제미나이에 넣어 생성한 뒤 파일명을 정확히 맞춰 `images/` 폴더에 넣으면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보입니다.)

권장 크기: **가로 4 : 세로 3** 비율, PNG.
그림이 칸을 꽉 채워야 하니 가장자리에 흰 여백이나 테두리를 두지 마세요. 그림이 네 변 끝까지 닿아야 합니다.

**단 표지(`cover.webp`)만 예외 — 세로 2 : 3 비율입니다.**

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
children's classics were painted: gouache and watercolor, bold clean outlines, realistic
proportions with expressive faces; England in the 1830s — a bare brick
workhouse hall, muddy country roads, and the crowded soot-black lanes of east
London with leaning timber houses and boarded windows; also, by contrast, warm
panelled rooms with firelight and books. No blood or wounds shown.
No text or letters in the image.
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

**페이긴을 인종으로 그리지 마세요.** 이 판본에서 페이긴은 그저 아이들을 부려 먹는
늙은 범죄자 한 사람입니다. 원작에 붙어 있던 인종 묘사는 이 책에서 전부 걷어 냈으니,
그림에서도 특정 민족을 가리키는 이목구비나 옷차림을 절대 넣지 마세요.
헝클어진 머리에 낡은 가운을 걸친 노인으로만 그려 주세요.

**가난을 예쁘게 그리지 마세요.** 구빈원과 뒷골목은 실제로 춥고 더럽고 어두운 곳입니다.
다만 다치거나 죽는 장면은 직접 그리지 말고, 그 앞이나 뒤의 순간으로 그려 주세요.

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Oliver Twist: a small thin fair-haired boy, nine years old at the start and
about eleven at the end; workhouse grey at first, then black undertaker's
clothes, then rags, then good clothes that fit.
Mr Bumble: a stout self-important parish officer in a cocked hat and a coat
with a wide collar, a cane.
The Artful Dodger (Jack Dawkins): a boy Oliver's age in a man's coat with the
sleeves turned back and a tall hat pushed onto the back of his head.
Fagin: a mild-looking old man with untidy grey hair and a worn dressing gown,
a toasting fork in his hand; a pleasant host's face — that is exactly how he
keeps the boys. No ethnic markers of any kind.
Nancy: a young woman of about twenty-two, a shawl, hair pinned untidily, a
worn but not squalid dress; draw her face with sympathy at all times.
Bill Sikes: a big strong man in a black coat, an ordinary face, a white dog
at his heel; the danger is in his stillness and his hands, never in his looks.
Mr Brownlow: a kindly stout old gentleman in a bottle-green coat and
spectacles.
Rose Maylie: a girl of seventeen, fair and gentle-faced.
Monks: a tall pale man with dark eyes, always in a heavy cloak.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a very small boy standing alone in the middle of a huge bare workhouse hall holding out an empty bowl in both hands, rows of seated boys stretching away behind him, a master with a ladle towering over him; harsh light from a high window. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | A plain white marble tablet set into the wall of a small country church, a shaft of afternoon light on it, one name's worth of space and nothing else. |

## 1장 · 이름을 받다

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A bare workhouse room at night with one candle: an old nurse holding a newborn, and an empty narrow bed. |
| `images/story-01-b.webp` | A stout parish officer in a cocked hat leading a small boy of nine down a country lane by the wrist, the boy looking back over his shoulder. |

## 2장 · 조금만 더 주세요

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | Long tables of boys scraping empty bowls with their spoons in a cold stone hall. |
| `images/story-02-b.webp` | The moment itself: a small boy standing with his bowl held out, the whole hall gone still, the master frozen with the ladle in the air. |

## 3장 · 소어베리 씨네

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | An undertaker's shop at night: half-built coffins standing against the walls, and a small boy asleep on the floor between them. |
| `images/story-03-b.webp` | A shop floor in uproar: a small boy on top of a much bigger youth, fists clenched, a woman rushing in from the doorway. |

## 4장 · 런던으로 가는 길

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A milestone by a muddy road at dawn, a very small figure setting off past it, empty country in every direction. |
| `images/story-04-b.webp` | A boy collapsed on a doorstep in a village street, and another boy the same age standing over him in a man's oversized coat and tall hat, offering bread. |

## 5장 · 낡은 집

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | A dark London lane where the houses lean toward each other overhead, one narrow doorway open, three flights of broken stairs visible inside. |
| `images/story-05-b.webp` | A garret by firelight: a mild old man in a worn dressing gown crouched over an open box of watches and rings, holding one up to the light; in the shadows a boy's open eye. |

## 6장 · 손수건 놀이

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | The garret in the morning: an old man walking about with things hanging from every pocket while boys creep after him, everyone laughing, one small newcomer laughing hardest. |
| `images/story-06-b.webp` | A bookstall on a street corner: an old gentleman absorbed in a book, a hand lifting a handkerchief from his coat tail, and a third boy a few steps away with his face changing as he understands. |

## 7장 · 붙잡히다

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A street crowd closing on a fallen boy, faces excited rather than angry, an officer's hand on his collar. |
| `images/story-07-b.webp` | A shabby police court: a furious magistrate on the bench, a boy slumped in the dock, and a bookseller bursting through the door with his hand raised. |

## 8장 · 그림 속의 얼굴

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | A warm bedroom with a fire: a boy sitting up in bed staring at a portrait of a young woman on the wall opposite. |
| `images/story-08-b.webp` | An old gentleman and a housekeeper looking from the portrait to the boy and back, both of them stopped dead; the two faces plainly the same. |

## 9장 · 다시 끌려가다

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | A street scene: a young woman clutching a boy and appealing to passers-by, a heavy man arriving from the other side, the crowd already convinced. |
| `images/story-09-b.webp` | The garret: an old man with a stick raised, and a young woman standing between him and the boy with her arms out. |

## 10장 · 창문

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | A country house at two in the morning: a heavy man lifting a small boy up to a very small window, another man holding a lantern low. |
| `images/story-10-b.webp` | A ditch at the edge of a field at dawn, snow beginning, a small figure lying in it with one arm awkward. |

## 11장 · 메일리 부인 댁

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A country house doorway: servants recoiling from a boy fallen on the step, and a girl of seventeen coming down the stairs with her hand raised to stop them. |
| `images/story-11-b.webp` | A summer garden: a boy and a young woman kneeling by a flower bed, she naming the flowers for him. |

## 12장 · 몽크스

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | A back room by candlelight: a tall pale man in a cloak leaning across a table toward an old man, money between them. |
| `images/story-12-b.webp` | A dark river below a bridge at night: a hand opening over the water, a small gold locket falling. |

## 13장 · 낸시가 한 일

| 파일명 | 장면 |
|---|---|
| `images/story-13-a.webp` | A quiet drawing room: a young woman in a shawl standing just inside the door, unable to sit down, and a girl of seventeen coming toward her with both hands out. |
| `images/story-13-b.webp` | The stone steps under London Bridge at midnight in fog: three figures talking low, and further up the steps a fourth pressed flat against the wall, listening. |

## 14장 · 그 밤

| 파일명 | 장면 |
|---|---|
| `images/story-14-a.webp` | A man walking alone across an empty field at dawn with his coat collar up, looking back over his shoulder at nothing. |
| `images/story-14-b.webp` | A rotting waterside slum by torchlight, a huge crowd filling the lane and the wooden bridges, every face turned up toward a rooftop. |

## 15장 · 이름을 되찾다

| 파일명 | 장면 |
|---|---|
| `images/story-15-a.webp` | A study: an old gentleman seated across a table from a pale man in a cloak, papers between them, the door shut. |
| `images/story-15-b.webp` | A girl of seventeen holding a boy of eleven, both of them crying, an old gentleman and an older lady standing behind with their hands on the back of a chair. |
