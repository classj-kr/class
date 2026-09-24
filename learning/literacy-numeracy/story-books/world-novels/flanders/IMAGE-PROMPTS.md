# 제미나이 그림 프롬프트 — 플랜더스의 개

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
child proportions with expressive faces; rural Flanders around 1870 — flat
open country to the horizon, windmills, canals, poplars in rows, a tumbledown
mud-and-thatch cottage; and the city of Antwerp with its enormous cathedral
spire visible from everywhere in the landscape; no text or letters in the image.
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

**개를 사람처럼 그리지 마세요.** 파트라슈는 크고 무거운 플랑드르 짐수레 개입니다.
사람 표정을 짓게 하지 말고, 개가 개로서 곁에 있는 것으로 그려 주세요.

**빛으로 이야기를 나눠 주세요.** 1장부터 6장까지는 낮고 따뜻한 빛,
7장부터는 점점 차고 어둡게, 11장은 오직 달빛만으로 그려 주세요.

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Nello: a thin fair-haired boy, six years old in the first chapter and twelve
afterwards, patched clothes, wooden shoes, always a little too thin.
Jehan Daas: a very old man, bent, lame in one leg, a shabby coat and a hat he
has worn thirty years.
Patrasche: a large heavy draught dog, tawny with a broad head and blunt muzzle,
scarred bare patches on his neck from a harness; powerful, never cute.
Alois (Aloa): a round-cheeked fair-haired girl the same age as Nello, in a
clean red dress and apron.
Baas Cogez: a solid prosperous miller in his forties, thick arms, a kind
enough face held carefully closed; it opens only at the very end.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a boy and a big tawny dog walking a milk cart along a flat empty road at dawn, poplars on both sides, and far off on the horizon the enormous cathedral spire of Antwerp catching the first light. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | The interior of a vast dark cathedral at dawn, one great painting on the far wall, and the empty stone floor in front of it. |

## 1장 · 안트베르펜 가는 길

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A tiny mud-walled cottage at the edge of a village, flat fields stretching away behind it, a small boy waiting at the gate in the evening. |
| `images/story-01-b.webp` | An old lame man pulling a small milk cart along a road with a boy walking beside him, the cathedral spire tiny and far away against a wide sky. |

## 2장 · 길가에 쓰러진 개

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A big dog collapsed in the dust by a roadside ditch in blazing heat, its harness ropes cut into its neck, an overloaded cart abandoned further along the road. |
| `images/story-02-b.webp` | Inside the cottage: the dog lying on straw, a boy kneeling beside it dripping water into its mouth from a spoon, the old man holding a candle. |

## 3장 · 다시 일어선 개

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | The dog deliberately planting itself between the shafts of the milk cart, blocking the old man, who has both hands raised in protest. |
| `images/story-03-b.webp` | The cart on the road at dawn with the dog pulling steadily and no whip anywhere in the picture, the boy walking at its shoulder with a hand on its back. |

## 4장 · 알로아

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A prosperous brick mill house with an apple tree in the yard, seen from outside a low wall where two children are talking over it. |
| `images/story-04-b.webp` | A rough plank of wood propped on a wall with a charcoal drawing of a dog on it, startlingly good; a heavy-set man staring at it with his jaw set. |

## 5장 · 그림 그리는 아이

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | A boy sitting on the frozen bank of a canal drawing on a flat stone with a stick of charcoal, the dog lying against his legs for warmth. |
| `images/story-05-b.webp` | Inside the cottage at night: an old man in bed, a boy quietly moving food from his own bowl to the old man's, the dog watching from the floor. |

## 6장 · 가려진 그림

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | The inside of an immense gothic cathedral, mostly darkness, one shaft of light slanting down; a very small boy standing alone before a great curtained frame. |
| `images/story-06-b.webp` | The same boy at the sacristan's door being turned away, a coin box visible beside them. |

## 7장 · 할아버지

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A snowbound cottage interior with almost no fire: an old man's hand in a boy's, the dog's head on the edge of the bed. |
| `images/story-07-b.webp` | A small village funeral in the snow, a handful of people already turning to leave, a boy and a dog remaining at the grave. |

## 8장 · 방앗간에 난 불

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | A mill burning at night, sparks streaming sideways in the wind, villagers passing buckets in a line; a boy in the line carrying a pail too big for him. |
| `images/story-08-b.webp` | Morning after: villagers standing in a knot in the lane, talking, all of them with their backs turned toward a boy holding an empty milk cart handle. |

## 9장 · 그림 대회

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | A boy carrying a large flat board wrapped in sacking through falling snow along an endless flat road, the dog beside him. |
| `images/story-09-b.webp` | A crowd in front of a notice board in a city square, and at the edge of it a boy turning away, his face perfectly still. |

## 10장 · 눈길에서 주운 것

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | A dog digging in deep snow at the roadside and a fat leather wallet coming up out of it, a boy crouching to look. |
| `images/story-10-b.webp` | A lit doorway of the mill house at night: a woman taking a wallet from a boy's hand, the dog being pushed inside past her, the boy already stepping back into the dark. |

## 11장 · 성탄절 밤

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A huge dark cathedral interior at night with a boy sitting small on the stone floor, and a dog coming toward him up the empty nave. |
| `images/story-11-b.webp` | Moonlight flooding through a high window and the covering falling back from a great painting; a boy standing and looking up at it, the dog beside him. |

## 12장 · 이튿날 아침

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | A man with a lantern searching a snow-covered road at night, his face stricken, a girl running after him. |
| `images/story-12-b.webp` | The cathedral floor at first light seen from a distance, a boy and a dog lying together beneath the great painting, and people stopped in the doorway, not going closer. |
