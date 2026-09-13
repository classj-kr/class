# 제미나이 그림 프롬프트 — 아라비안나이트

아홉 편에 여는 이야기와 맺는 이야기를 더해 열 꼭지로 담았고, 꼭지마다 그림이 두 장씩 들어갑니다.
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
proportions with expressive faces; the medieval Islamic world — Baghdad,
Persia, Cairo — with muqarnas vaulting, carved wooden screens, tiled
courtyards with fountains, arcaded markets, palm and cypress, camel caravans
and lateen-sailed dhows; deep indigo night skies, lamplight, turquoise tiles.
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

**이 지역 사람들을 우스꽝스럽게 그리지 마세요.**
옷차림과 건물과 물건을 그 시대 그 지역의 것으로 정확하게 그려 주세요.
이 이야기들은 세계에서 가장 앞서 있던 도시에서 나온 것입니다.
바그다드는 그 시절 세상에서 가장 큰 도서관이 있던 곳입니다.
가난한 사람이 나오는 장면에서도 배경의 건축과 문양은 정교해야 합니다.

**마신은 커다랗게, 그러나 사람 형상으로 그려 주세요.** 연기가 뭉쳐 만들어진 거대한 사람 모습입니다.
뿔이나 짐승 얼굴 같은 것은 넣지 마세요.

**셰에라자드를 애원하는 모습으로 그리지 마세요.** 등을 곧게 펴고 이야기하는 사람으로 그려 주세요.

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Scheherazade: a young woman of about twenty with a calm, alert face; fine but
not gaudy robes; she is always mid-speech, hands describing something.
King Shahriyar: a strong man of about thirty-five, richly dressed, a closed
guarded face that gradually opens across the book.
The fisherman: a thin weathered man in a patched robe, bare feet, a net.
The jinni: an enormous human figure made of gathering smoke, head level with
the clouds — no horns, no animal features.
Aladdin: a boy of about fifteen in poor clothes, later in fine ones.
Ali Baba: a middle-aged woodcutter with three donkeys.
Morgiana: a quick, watchful young woman in a servant's plain dress — draw her
as the most capable person in every scene she is in.
Sindbad the sailor: a stout prosperous man of fifty telling stories.
Sindbad the porter: a lean man the same age with a carrying rope.
Harun al-Rashid: a dignified man in a plain travelling cloak by night and in
state robes by day.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a young woman seated upright on cushions in a lamplit palace chamber, speaking, one hand raised; a king listening from the shadows; and behind and above them, painted faint like a tapestry, the shapes of the stories — a jinni of smoke, a great bird, a wooden horse, a cave mouth. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | A window of a palace at dawn with the last lamp still burning inside and the sky going pale outside, a stack of story-worn cushions on the floor. |

## 1편 · 천 하룻밤을 벌다

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A grand vizier standing in his own doorway with his hands over his face, his elder daughter facing him steadily, a younger girl in the background. |
| `images/story-01-b.webp` | A palace chamber at night: a young woman seated and talking, a young girl beside her listening, and a king propped on one elbow, plainly caught up in it. |

## 2편 · 항아리 속의 마신

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A poor fisherman on a beach at dawn hauling up a sealed brass jar in his net, three failed casts' worth of rubbish beside him. |
| `images/story-02-b.webp` | An enormous human figure of smoke towering over a tiny man on the shore, its head in the clouds; the man holding the little jar up and pointing at it. |

## 3편 · 알라딘과 요술 램프

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | An underground garden by lamplight: trees hung with fruit that are cut jewels, a boy filling his sleeves, a plain old lamp on a ledge. |
| `images/story-03-b.webp` | A city street: a man calling out with a rack of shining new lamps, and at a palace window above, a young woman holding out a battered old one. |

## 4편 · 알리바바와 사십 인의 도적

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A rock face in a wooded gorge splitting open, forty mounted men with loaded saddlebags before it, and high in a tree one small figure watching. |
| `images/story-04-b.webp` | A courtyard by night lined with thirty-seven big oil jars, and a young woman standing very still beside one of them, listening, a lamp shaded in her hand. |

## 5편 · 신드바드와 로크 새

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | A vast white egg the size of a house on an empty island, a man standing beside it for scale, and the sky darkening as something enormous descends. |
| `images/story-05-b.webp` | A deep valley floor glittering with cut stones, huge snakes among the rocks, chunks of meat lying where they have fallen from above, and eagles stooping. |

## 6편 · 바다의 노인

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | A young man walking bent under an old man riding on his shoulders, the old man's legs locked round his neck, both of them on a jungle path. |
| `images/story-06-b.webp` | The old man sprawled loose-limbed on the grass with an emptied gourd beside him, the young man standing straight for the first time in months, both hands at his freed throat. |

## 7편 · 하늘을 나는 나무 말

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A new year's court: a carved ebony horse standing on the marble floor before a throne, courtiers laughing, one man beside it with his hand on a small peg in its neck. |
| `images/story-07-b.webp` | A boy on the wooden horse far above the clouds at night, groping along the horse's shoulder for a second peg, the earth invisible below. |

## 8편 · 하룻밤의 왕

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | A modest house at night: a young man and a plainly dressed stranger eating together on the floor and talking, a single lamp between them. |
| `images/story-08-b.webp` | A throne room: the same young man on the throne in state robes, leaning forward and pointing at four men kneeling before him; and among the courtiers at the side, one man watching him with great interest. |

## 9편 · 검은 섬의 왕자

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | A still lake in a valley with fish of four colours — white, red, blue, yellow — clearly visible in it, and a palace on the far shore. |
| `images/story-09-b.webp` | A throne room with every lamp lit and no one in it but one young man on the throne, his lower half plainly stone, a king standing frozen in the doorway. |

## 10편 · 이야기의 값

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | A caravan halted for the night in the desert: one trader telling a story with both hands raised, the others leaning in around the fire, laden camels and a moored ship dark behind them. |
| `images/story-10-b.webp` | Dawn in the palace chamber: a young woman standing with three children beside her, a king rising from his seat, the lamp guttering out. |
