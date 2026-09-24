# 제미나이 그림 프롬프트 — 장발장

하나의 이야기를 열여섯 장으로 나눠 담았고, 장마다 그림이 두 장씩(마지막 16장만 세 장) 들어갑니다.
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
children's classics were painted: gouache and watercolor, bold clean outlines, saturated
but slightly muted colors, realistic human proportions with expressive faces,
19th-century French setting (1815-1833), strong light-and-shadow with lantern
and candlelight, restrained and serious mood, no text or letters in the image.
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
Jean Valjean: a very powerfully built man; in early chapters aged 46, close
cropped grey hair, weathered hard face, ragged brown coat; later as Monsieur
Madeleine he is neatly dressed in a plain dark coat with white hair, calm and
grave; at the end a frail old man.
Bishop Myriel: a small serene old bishop in a simple purple cassock, white
hair, gentle eyes, plain room behind him.
Javert: a tall gaunt police inspector, long grey side-whiskers, buttoned dark
blue greatcoat, low top hat, never smiling, always standing rigidly upright.
Fantine: a young woman, at first with long beautiful blonde hair and a modest
dress, later gaunt with cropped hair and a thin shawl.
Cosette (child): a thin barefoot-in-clogs girl of eight, tangled hair, torn
sackcloth dress, always carrying something too heavy for her.
Cosette (grown): a graceful young woman of seventeen in a simple pale dress.
The Thenardiers: a neat, plausible innkeeper with a ready smile, and his
brisk capable wife; both perfectly presentable people. What is wrong with
them is in what they do — the padded bill, the child sent out in the snow.
Marius: a slim serious young man of twenty in a shabby black coat.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format book cover: a powerfully built grey-haired man in a plain dark coat standing in a narrow 19th-century Paris street at night, holding a pair of silver candlesticks whose two flames are the only light, a small child's silhouette beside him, tall shuttered houses rising into darkness behind. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | Two silver candlesticks on a bare mantelpiece, the candles burnt low, warm quiet light, an empty chair in shadow beside them. |

## 1장 · 빵 한 조각

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A young woodcutter in a snowy French village at night smashing a baker's shop window with his bare fist, one loaf of bread already clutched under his arm, warm light spilling from the window onto the snow. |
| `images/story-01-b.webp` | The deck of a prison hulk: chained convicts in red caps hauling stone under a grey sky, one huge man among them staring straight ahead, an armed guard on the gangway above. |

## 2장 · 아무도 문을 열어 주지 않았다

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A ragged traveller turned away at a lit inn doorway in the rain, the innkeeper's arm barring the way, other guests staring from inside; the man's yellow passport crumpled in his fist. |
| `images/story-02-b.webp` | A small plain dining room by candlelight: a serene old bishop gesturing warmly to an extra place set at the table, silver plate and a pair of silver candlesticks laid out, the huge ragged stranger standing frozen in the doorway. |

## 3장 · 은촛대

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | Early morning at the bishop's door: three gendarmes gripping a rough-looking man's arms while the small old bishop steps forward holding out a pair of silver candlesticks to him, the gendarmes' faces bewildered. |
| `images/story-03-b.webp` | A man on his knees alone in an empty field at dusk, head bowed, a silver candlestick lying in the grass beside him, a long empty road stretching away behind. |

## 4장 · 마들렌 씨

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A busy small French factory town workshop, workers at benches making black glass beads, a plainly dressed white-haired man walking through and speaking with them, bright and orderly. |
| `images/story-04-b.webp` | A town hall corridor: a rigid tall police inspector in a dark greatcoat standing motionless, watching the back of a departing white-haired gentleman, one hand half-raised. |

## 5장 · 팡틴

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | A young woman sitting on a bed in a bare attic room having her long blonde hair cut off by a wigmaker, coins on the table, her face turned away toward a small window. |
| `images/story-05-b.webp` | A snowy street at night: a police inspector gripping a thin shawl-wrapped woman's arm as she pleads, a crowd watching, a shadowed figure stepping forward from the corner. |

## 6장 · 자베르의 눈

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | A heavily loaded cart sunk in deep mud in a town street, an old carter pinned beneath it, townspeople crowding helplessly around, a white-haired gentleman removing his coat in the foreground. |
| `images/story-06-b.webp` | Seen low and close: a white-haired man on his back under the cart, straining upward with his shoulders, the cart lifted a hand's width, every tendon in his neck standing out; a police inspector watching him with fixed intensity. |

## 7장 · 대신 붙잡힌 사람

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A man alone in a plain room at night, pacing before a fireplace, half-burnt papers curling in the fire, a pair of silver candlesticks glinting on the mantel, one candle nearly gone. |
| `images/story-07-b.webp` | A carriage stopped on a country road at dawn with a broken wheel, the driver crouched at the axle, a white-haired passenger standing apart looking down the road toward a distant town. |

## 8장 · 내가 장 발장이오

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | A crowded 19th-century French courtroom, a bewildered white-haired old peasant in the dock, judge and prosecutor at their bench, packed public gallery. |
| `images/story-08-b.webp` | The same courtroom in total silence: a white-haired gentleman standing in the central aisle facing three stunned convict witnesses, everyone turned toward him, the judge half risen. |

## 9장 · 팡틴과의 약속

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | A bare hospital ward: a gaunt young woman propped on pillows smiling and pointing toward a curtain, a white-haired man seated holding her hand, a nun in the background. |
| `images/story-09-b.webp` | The same ward an instant later: a tall inspector's hand clamped on the seated man's shoulder, the woman fallen back on the pillow, the man turning his head with a terrible calm. |

## 10장 · 코제트

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | A crowded warm inn on Christmas Eve: two well-dressed girls playing with a large doll by the fire, and under the table a thin ragged girl in clogs clutching a doll made of rags and twigs. |
| `images/story-10-b.webp` | A tiny girl alone at night in a black winter forest, dragging an enormous water bucket with both hands, water slopping over her legs, bare trees looming like figures around her. |

## 11장 · 어둠 속에서 내민 손

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A huge man walking beside a small ragged girl on a dark forest road, carrying her heavy bucket in one hand; the child looking up at him, snow beginning to fall. |
| `images/story-11-b.webp` | Inside the inn: the child staring at a large beautiful doll set down in front of her, not daring to touch it, the innkeeper and his wife watching greedily from behind. |

## 12장 · 담을 넘어

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | Night in a Paris dead-end alley: a man with a small girl tied to his back climbing a high wall on a rope, a lantern's light swinging into the alley mouth behind him. |
| `images/story-12-b.webp` | A convent garden at dawn: an old gardener with a lantern staring open-mouthed at the man and sleeping child crouched under a tree, stone cloister arches behind. |

## 13장 · 마리우스

| 파일명 | 장면 |
|---|---|
| `images/story-13-a.webp` | A Paris public garden in summer: a white-haired man and a young woman on a bench under chestnut trees, a young man in a shabby black coat walking past, eyes turned toward her. |
| `images/story-13-b.webp` | A Paris street at night in June 1832: people dragging paving stones, barrels and an overturned cart to build a barricade across a narrow street, torchlight. |

## 14장 · 바리케이드

| 파일명 | 장면 |
|---|---|
| `images/story-14-a.webp` | Behind the barricade at night: young men firing over piled stones and furniture, powder smoke, a grey-haired man climbing the pile to drag a wounded boy down. |
| `images/story-14-b.webp` | A narrow lane behind the barricade: a grey-haired man cutting the ropes binding a rigid police inspector, the inspector staring at him without understanding, a knife in the man's hand. |

## 15장 · 마리우스를 업고

| 파일명 | 장면 |
|---|---|
| `images/story-15-a.webp` | Deep in the Paris sewers: a man wading chest-deep in mud through a stone tunnel, holding an unconscious young man up above his head with both arms, near total darkness. |
| `images/story-15-b.webp` | A locked iron grating at a sewer mouth opening onto the river at dawn; a shabby innkeeper holding out a key from the shadows, the exhausted man with the body on his back facing him. |

## 16장 · 마지막 밤

| 파일명 | 장면 |
|---|---|
| `images/story-16-a.webp` | A tall gaunt inspector standing alone on a stone bridge parapet over the dark river before dawn, city rooftops behind him, his hat in his hand. |
| `images/story-16-b.webp` | A shabby man laying a torn scrap of coat cloth on a table before a shocked young gentleman in a fine drawing room, the young man recognising the cloth. |
| `images/story-16-c.webp` | A bare room at night: a frail old man in a chair holding the hands of a young woman kneeling and weeping and a young man standing behind her, two silver candlesticks burning low on the mantel, all the light in the picture coming from those two candles. |
