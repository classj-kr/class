# 제미나이 그림 프롬프트 — 돈키호테

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
proportions with expressive faces; central Spain around 1600 — the bare
sunbaked plain of La Mancha, rows of white windmills on low ridges, dusty
cart roads, whitewashed inns with a courtyard and a well, olive trees, sheep;
and by contrast a rich ducal palace with tapestries and liveried servants.
Warm ochre, dust, hard shadows. No text or letters in the image.
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

**돈키호테를 우스꽝스러운 캐리커처로 그리지 마세요.**
비쩍 마르고 나이 든 사람인 것은 맞지만, 얼굴은 늘 진지하고 위엄이 있어야 합니다.
우스운 것은 그 사람의 얼굴이 아니라 그 사람이 처한 상황입니다.
특히 12장 이후에는 그 얼굴에 지친 기색이 보여야 합니다.

**12장 공작의 성 장면은 웃기게만 그리지 마세요.**
장난을 꾸미는 사람들의 얼굴에서 즐거움이 보이되, 그림 전체는 조금 차갑게 그려 주세요.
이 대목부터 독자가 웃다가 멈추게 되는 것이 이 책의 핵심입니다.

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
Don Quixote (Alonso Quijano): a very tall, very thin gentleman of about fifty,
long face, grey pointed beard, deep-set serious eyes; a patched, mismatched
suit of rusty hundred-year-old armour and a cardboard-reinforced helmet;
later a brass barber's basin worn as a helmet; a long lance.
Rocinante: an old bony horse, ribs showing, standing with its head low.
Sancho Panza: a short broad peasant of about forty with a round belly, a
weather-brown face and small shrewd eyes; a grey donkey, a leather bag,
a wineskin. Draw him as a competent working man, not a fool.
The niece: a young woman of about twenty in plain household dress.
The priest and the barber: two ordinary middle-aged village men.
The Duke and Duchess: a handsome bored pair in expensive black and silver.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a gaunt armoured figure on a bony horse with lance couched, charging up a bare ridge toward a row of white windmills against an enormous evening sky; far behind him a short round man on a donkey, one arm raised, shouting after him. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | An empty bedroom at evening: a made bed, a rusty helmet on a chair, and a single lance leaning in the corner by a window that looks out on the plain. |

## 1장 · 책을 너무 많이 읽은 사람

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A study by candlelight crammed with a hundred books, an open book on the table, and a thin middle-aged man reading with his face very close to the page, dawn already at the window behind him. |
| `images/story-01-b.webp` | The same man in an attic scouring an ancient suit of armour with a cloth, pieces of it laid out around him, a half-made cardboard visor on the floor. |

## 2장 · 둘시네아

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A whitewashed roadside inn at dusk drawn realistically, and beside it — smaller, ghosted, as the man imagines it — the same building as a castle with towers and a drawbridge. |
| `images/story-02-b.webp` | An inn courtyard at night: a thin armoured man standing sentry over a pile of armour beside a stone water trough, moonlight, a mule driver approaching with a bucket. |

## 3장 · 첫 번째 출정

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | A boy tied to an oak in a wood, a farmer with a belt, and an armoured horseman levelling a lance at him from the path. |
| `images/story-03-b.webp` | The same clearing after the horseman has gone: the boy tied to the tree again, the farmer standing over him. |

## 4장 · 책을 태우다

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A courtyard bonfire of books, a housekeeper throwing armfuls in, and a priest standing to one side quietly slipping two volumes under his arm. |
| `images/story-04-b.webp` | A farmyard: a tall thin gentleman in armour talking earnestly to a short round peasant who is scratching his head, a donkey behind them. |

## 5장 · 풍차

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | Thirty white windmills along a ridge under a huge sky, sails turning, two small figures on the road below. |
| `images/story-05-b.webp` | The instant of impact: a lance jammed into a turning sail, horse and rider lifted off the ground, the lance splintering. |

## 6장 · 양 떼

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | A great cloud of dust on the plain, and inside it — nothing but sheep and two shepherds. |
| `images/story-06-b.webp` | An armoured man on the ground among scattering sheep, shepherds with slings on a low rise, a peasant running toward him. |

## 7장 · 황금 투구

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A rainy road: a barber on a donkey with a brass basin upside down on his head, and an armoured horseman bearing down on him. |
| `images/story-07-b.webp` | The gentleman riding on wearing the brass basin as a helmet with total dignity, village children running behind him laughing, and the peasant walking a little ahead of him, not looking back. |

## 8장 · 죄수들

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | A chain gang of twelve men linked at the neck on a country road, two guards with muskets, an armoured horseman blocking the way. |
| `images/story-08-b.webp` | The road afterwards: two men sitting in the dust stripped of their outer clothes, stones scattered around them, the freed prisoners already far off. |

## 9장 · 산속의 편지

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | A rocky sierra: a half-dressed thin man turning cartwheels among the boulders, entirely serious about it, while a peasant watches from a rock with a letter in his hand. |
| `images/story-09-b.webp` | An inn parlour: a priest and a barber leaning over a table talking to a worried peasant, a bundle of borrowed women's clothes on the bench beside them. |

## 10장 · 우리에 실려 돌아오다

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | An inn room at night: slashed wineskins on the floor, red wine everywhere, a man in a nightshirt standing with a sword, still asleep on his feet, guests crowding the doorway. |
| `images/story-10-b.webp` | An ox cart on a village road carrying a wooden cage with a calm armoured man sitting inside it, villagers lining the road to look. |

## 11장 · 두 번째 출정

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A dusty road outside a village: three sunburnt farm girls on donkeys riding past, and an armoured man on his knees in the road with his helmet off, bowing to them. |
| `images/story-11-b.webp` | The same man rising and looking after them with a puzzled expression while the peasant beside him keeps insisting, gesturing after the girls. |

## 12장 · 공작의 성

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | A great hall: liveried servants bowing deeply to a thin armoured man who is receiving it with grave dignity, while at the far end a Duke and Duchess exchange a look. |
| `images/story-12-b.webp` | A blindfolded man and a blindfolded peasant sitting astride a wooden horse in a courtyard, servants working bellows at them from both sides, the whole court doubled over laughing behind them. |

## 13장 · 산초의 섬

| 파일명 | 장면 |
|---|---|
| `images/story-13-a.webp` | A village hall set up as a court: a short round peasant seated in the governor's chair, leaning forward to listen to a woman, the onlookers who came to laugh now leaning in. |
| `images/story-13-b.webp` | The same man riding out of the village gate on his own grey donkey in his own old clothes, everything he came with and nothing more. |

## 14장 · 흰 달의 기사

| 파일명 | 장면 |
|---|---|
| `images/story-14-a.webp` | A beach at Barcelona at dawn: a young knight in bright armour with a white moon on his shield facing a thin man in rusty armour, the sea behind them. |
| `images/story-14-b.webp` | An old thin man on his back in the sand with a lance point at his throat, his helmet knocked askew, still speaking. |

## 15장 · 알론소 키하노

| 파일명 | 장면 |
|---|---|
| `images/story-15-a.webp` | A bedroom with the shutters half open: a thin old man propped up in bed dictating to a notary, a priest and a young woman standing by. |
| `images/story-15-b.webp` | A short round peasant on a stool at the bedside, in stockinged feet, crushing his hat in both hands as he leans forward crying and saying something to the old man. |
