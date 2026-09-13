# 제미나이 그림 프롬프트 — 로빈슨 크루소

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
proportions with expressive faces; a Caribbean island in the 1660s — white
sand, dense green forest, a rock cliff with a palisade of stakes in front of
it, goats, a wide empty sea on every horizon; strong tropical light and deep
shade; no text or letters in the image.
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

**프라이데이를 반드시 존엄하게 그려 주세요.** 이 지시문을 그 인물이 나오는 모든 프롬프트에 넣으세요.

```
Friday: a Carib man of about twenty-six, tall and straight, well-proportioned,
long straight black hair, an open intelligent face. Draw him as an equal —
never crouching at Crusoe's feet after chapter 11, never in servant's posture,
never comic, never half-dressed as a curiosity. In working scenes he is doing
the skilled work and Crusoe is watching. He wears practical clothing of his
own making.
```

**크루소도 미화하지 마세요.** 후반부의 크루소는 잘 차려입은 신사가 아니라
염소 가죽을 걸치고 수염이 허리까지 내려온 사람입니다.

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Robinson Crusoe: nineteen at the start — an ordinary English youth; from
chapter 5 onward a bearded man in a goatskin jerkin and knee breeches with the
fur outward, a tall goatskin cap with a long flap at the back, a goatskin
parasol, a musket over each shoulder; by the end his beard reaches his chest.
Friday: as described above — an equal, never a servant.
Friday's father: a gaunt elderly man, dignified, weak from captivity.
The parrot: a green parrot that appears from chapter 8 on.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a bearded man in goatskins with a tall flapped cap standing on a headland with a musket and a goatskin parasol, looking out over an empty ocean; behind and below him the palisade, the goat pen and the forest of his island. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | A ship's rail at sea at evening, and a low green island shrinking on the horizon behind it. |

## 1장 · 집을 나가다

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A panelled English room in 1651: an old father seated, gripping the arms of his chair and weeping, a restless young man standing before him unable to meet his eyes. |
| `images/story-01-b.webp` | A ship going down off a grey coast, its masts already leaning, seen from the shore where a soaked young man stands among the rescued crew. |

## 2장 · 노예가 되다

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A sea fight: a low fast corsair coming alongside a merchant ship, grappling hooks in the air, smoke. |
| `images/story-02-b.webp` | A small fishing boat far out at dawn, two figures aboard, the African coast a thin line behind them. |

## 3장 · 난파

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | A ship driven hard onto a sandbar in a storm, her deck awash, a boat capsizing in the surf beside her. |
| `images/story-03-b.webp` | A man lying face down on wet sand at dawn, the beach otherwise completely empty in both directions. |

## 4장 · 배에서 실어 온 것들

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A crude raft of ship's planks piled with chests, barrels, tools and rolled canvas, poled toward a beach by one man. |
| `images/story-04-b.webp` | An open drawer of gold and silver coins in a flooded cabin, and a man's hand hesitating over it. |

## 5장 · 집을 짓다

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | A double palisade of driven stakes in front of a rock face, a tent inside it, a ladder leaning against the wall from the inside. |
| `images/story-05-b.webp` | A post with hundreds of knife-cut notches on it, some longer than others, a man's hand cutting a fresh one. |

## 6장 · 장부를 적다

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | A man at a rough handmade table by candlelight, ruling a line down a sheet of paper and writing in two columns. |
| `images/story-06-b.webp` | The same man very ill on a bed of ropes, alone, a gourd of water just out of reach on the floor. |

## 7장 · 보리와 빵

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | Green barley shoots growing improbably out of bare ground outside a palisade, a man on his knees in front of them. |
| `images/story-07-b.webp` | A hollowed tree-stump mortar, clay pots standing in the embers of a fire, and a single small dark loaf on a board. |

## 8장 · 염소와 앵무새

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | A fenced enclosure of goats on a hillside, a man milking one, tame kids crowding his legs. |
| `images/story-08-b.webp` | The full goatskin outfit: jerkin with the fur outward, tall cap with a long flap, a goatskin parasol open overhead, a green parrot on his shoulder. |

## 9장 · 모래밭의 발자국

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | A single bare human footprint pressed into smooth wet sand, and a man's own foot placed beside it for comparison; no other marks anywhere. |
| `images/story-09-b.webp` | A man crouched behind his palisade with the ladder pulled up, both hands on a musket, staring at nothing. |

## 10장 · 쫓기는 사람

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | Seen from a wooded ridge: canoes drawn up on a distant beach and a fire, small figures around it. |
| `images/story-10-b.webp` | A man running full speed along the shore toward the viewer, three pursuers well behind him, a creek ahead. |

## 11장 · 프라이데이

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A bearded man in goatskins lowering his musket and reaching out an open hand to raise a kneeling man to his feet; the kneeling man already half standing. Draw both men the same height and give both faces equal weight. |
| `images/story-11-b.webp` | Early morning on the beach: the rescued man digging with his bare hands to bury the men who came to kill him, the bearded man in goatskins standing a few steps away, saying nothing. |

## 12장 · 말을 나누다

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | A large canoe being hollowed by controlled fire on a beach: the Carib man directing the work with a shell scraper, the bearded man watching and clearly learning. |
| `images/story-12-b.webp` | The two men working a field side by side with equal effort, talking; neither one giving orders. |

## 13장 · 프라이데이의 아버지

| 파일명 | 장면 |
|---|---|
| `images/story-13-a.webp` | A young man cutting the bonds from an exhausted elderly prisoner and then stopping dead, recognising him; the older man reaching up. |
| `images/story-13-b.webp` | Four men of three different origins sitting around a fire in the evening, all talking at once, entirely at ease with one another. |

## 14장 · 영국 배

| 파일명 | 장면 |
|---|---|
| `images/story-14-a.webp` | A ship's boat drawn up on a beach with a group of sailors, three of them bound; a wild-looking bearded figure in goatskins watching from the treeline. |
| `images/story-14-b.webp` | Night in the forest: sailors laying down their weapons in a clearing, voices coming from several directions at once out of the dark. |

## 15장 · 이십팔 년 만에

| 파일명 | 장면 |
|---|---|
| `images/story-15-a.webp` | A man taking a last walk round his own works — the mortar, the pots, the goat pen, the notched post — with the notched post reading a very great many years. |
| `images/story-15-b.webp` | The deck of a departing ship: the bearded man at the rail in his goatskin cap with his island behind him, and beside him at the same rail, standing level with him, the Carib man and his father. |
