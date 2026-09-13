# 제미나이 그림 프롬프트 — 폼페이 최후의 날

하나의 이야기를 열두 장으로 나눠 담았고, 장마다 그림이 두 장씩 들어갑니다.
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
proportions with expressive faces; Pompeii in 79 CE, reconstructed from the
actual excavation — narrow basalt-paved streets with deep cart ruts and raised
stepping stones at the crossings, painted red and ochre house walls, atrium
houses with a pool open to the sky, a forum with columns, an amphitheatre,
public baths, and Vesuvius green with vineyards behind the town.
Roman dress: tunics, togas, stolas, sandals. Mediterranean light.
No blood or wounds shown. No text or letters in the image.
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

**폼페이를 실제 발굴 자료대로 그려 주세요.** 이 책은 발굴에서 나온 것들을 본문에
그대로 적었습니다. 길의 바퀴 자국, 건널목의 디딤돌, 벽의 낙서와 선거 벽보,
빵집 화덕, 집 현관의 개 모자이크 — 이런 것들을 그림에 실제로 넣어 주세요.

**니디아를 딱한 사람으로만 그리지 마세요.** 앞을 보지 못하지만 이 이야기에서
가장 유능한 인물입니다. 눈을 감고 있거나 초점 없는 눈으로 그리되, 자세는 늘
곧고 확신에 차 있어야 합니다. 특히 10장에서는 니디아가 앞장서고 두 사람이
끌려가는 구도로 그려 주세요.

**폭력 장면은 직접 그리지 마세요.** 8장 경기장은 사자가 도로 들어가는 순간까지만,
9장과 10장은 사람들이 달아나는 모습으로만 그려 주세요.

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Glaucus: a handsome, easy-going Greek man of about twenty-five, a fine tunic
and a wreath at parties; in the trial and arena scenes, dazed and dishevelled.
Ione: a Greek woman of about twenty, dark hair bound up, a fine stola.
Nydia: a slight girl of about fifteen, fair hair, a plain worn tunic, always a
basket of flowers; her eyes closed or unfocused but her posture upright and
purposeful. Never drawn as pitiable.
Arbaces: a tall Egyptian man of about fifty in dark linen with Egyptian
jewellery, a composed and watchful face — dignified, not a leering villain.
Apaecides: Ione's younger brother, a thin uncertain young man in white
priest's linen.
Olinthus: a plain-dressed man of about forty, calm.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: an ordinary Pompeii street at midday — stepping stones, cart ruts, painted walls, an awning, people shopping — and filling the whole upper half of the picture behind the rooftops, Vesuvius with a thin thread of smoke just starting from its summit that nobody in the street has noticed. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | A modern excavation trench: a plaster cast of a figure lying in the ash on one side, and on the other a low wall with faded painted letters still on it, a rope barrier and daylight. |

## 1장 · 이 도시가 어떻게 남았나

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | An excavated bakery: a stone oven with round carbonised loaves still inside it, grain mills of dark stone standing in the room. |
| `images/story-01-b.webp` | A plaster cast being lifted out of the ash — the shape of a person with an arm over the face — archaeologists and brushes around it. |

## 2장 · 글라우쿠스

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A Pompeian atrium house at midday: a square pool open to the sky, painted red walls, a mosaic floor, guests reclining at a low table. |
| `images/story-02-b.webp` | The inside of the Temple of Isis: a statue in a niche, a narrow dark passage behind it visible from the side, a tall Egyptian priest standing before the altar. |

## 3장 · 니디아

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | A street outside a tavern: a slight girl with a spilled basket of flowers on the paving, people around her, one young man stepping in with his hand up. |
| `images/story-03-b.webp` | The same girl walking a crowded street alone with her basket, one hand trailing along a wall, moving confidently while everyone else jostles. |

## 4장 · 베수비오

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | Vineyards climbing the green slopes of Vesuvius, workers among the vines, the town spread below. |
| `images/story-04-b.webp` | A street where a building is still under repair seventeen years after an earthquake — scaffolding, new stone against old, workmen — and a crack running across a wall nobody is looking at. |

## 5장 · 신전의 비밀

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | A young priest in white linen standing frozen in a temple passage, having just seen the speaking-tube behind the statue. |
| `images/story-05-b.webp` | A dim room where an old woman hands a small flask to a blind girl, a fire and strange bundles behind them. |

## 6장 · 그날 밤

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | A night street near a temple: a crowd with torches converging on one spot, a young man standing in the middle of it plainly not knowing where he is. |
| `images/story-06-b.webp` | A trial held in the open colonnaded forum: magistrates on a raised platform, the square packed with shouting townspeople and more watching from the rooftops, two accused men standing below — one bewildered, one calm. |

## 7장 · 니디아가 알아낸 것

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A blind girl standing very still in a dark corridor of a large house with her head tilted, listening to something below the floor. |
| `images/story-07-b.webp` | A blind girl crouched at a barred cellar door whispering through the grating to a gaunt face on the other side, while a tall man in dark linen stops at the top of the stairs behind her. |

## 8장 · 원형 경기장

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | The Pompeii amphitheatre packed with twenty thousand people, awnings rigged over part of the seating, families with food, a bright morning. |
| `images/story-08-b.webp` | The sand of the arena: a man standing alone, and a lion halfway out of its opened cage turning back toward the dark of the tunnel; the crowd beginning to stand up. |

## 9장 · 산이 열리다

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | Vesuvius from across the bay: a single enormous column of ash rising and spreading at the top into the shape of a pine tree, seen from a boat. |
| `images/story-09-b.webp` | A Pompeii street in the middle of the day gone completely black, people with small lamps that light nothing, ash falling like snow, pumice stones on the paving. |

## 10장 · 어둠 속의 길잡이

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | In the darkness: a slight girl walking ahead with a hand out to the wall, leading two adults who are stumbling and holding on to her — she is the only one moving normally. |
| `images/story-10-b.webp` | A harbour crowded with people trying to board boats, ash on every shoulder, the sea black, one small boat pulling away. |

## 11장 · 바다 위에서

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A small boat on dark water at night with a handful of exhausted people aboard, and on the shore behind them a whole town going under grey. |
| `images/story-11-b.webp` | Dawn on the same boat: a young man and a young woman just waking and staring at the empty place beside them, where a blanket lies neatly folded on the boards by the gunwale. |

## 12장 · 천칠백 년 뒤

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | An excavated Pompeii street today: cart ruts worn deep in the basalt, stepping stones at a crossing, a house doorway with a mosaic of a chained dog set into the threshold. |
| `images/story-12-b.webp` | A wall of a Pompeian house with its painted fresco still bright — a garden scene with birds — and a modern visitor standing small in front of it. |
