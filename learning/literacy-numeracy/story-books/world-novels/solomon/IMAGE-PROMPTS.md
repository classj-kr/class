# 제미나이 그림 프롬프트 — 솔로몬의 동굴

하나의 이야기를 열두 장으로 나눠 담았고, 장마다 그림이 두 장씩 들어갑니다.
그림이 있는 펼침면은 오른쪽 쪽에 그림 한 장이 들어가고, 그림이 없는 펼침면은 양쪽 쪽에 글만 들어갑니다.
아래 프롬프트를 제미나이에 넣어 생성한 뒤 파일명을 정확히 맞춰 `images/` 폴더에 넣으면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보입니다.)

권장 크기: **가로 4 : 세로 3** 비율, PNG.
그림이 칸을 꽉 채워야 하니 가장자리에 흰 여백이나 테두리를 두지 마세요. 그림이 네 변 끝까지 닿아야 합니다.

**단 표지(`cover.webp`)만 예외 — 세로 2 : 3 비율입니다.**

## 이 책은 그림 지시를 특히 조심해서 쓰세요

이 소설은 유럽이 아프리카를 나눠 가지던 시절에 나왔고, 그 시선이 그대로 들어 있습니다.
본문에서 그것을 밝히고 고쳐 옮겼으니, **그림도 그 시절 삽화의 계보를 따라가면 안 됩니다.**

지켜야 할 것:

- **아프리카 인물을 백인 인물과 똑같은 사실성과 개별성으로 그릴 것.** 이목구비를 과장하지 말고,
  얼굴을 하나하나 다르게, 나이와 성격이 드러나게 그리세요.
- **백인을 화면 가운데 위쪽에 두고 아프리카 사람들이 올려다보는 구도를 쓰지 마세요.**
  9장·10장·12장에서는 **이그노시가 화면의 중심**이고 백인 셋은 옆이나 뒤에 있습니다.
- **쿠쿠아나를 원시적으로 그리지 마세요.** 본문에 나오듯 이 나라에는 돌로 포장한 큰길과
  물길과 수천 채의 집이 있습니다. 잘 지어진 도시로 그려 주세요.
- **옷과 물건을 남부 아프리카의 것으로 정확하게** — 소가죽 방패, 짧은 찌르는 창,
  구슬 장식, 표범 가죽. 서아프리카나 상상 속 '정글' 차림을 섞지 마세요.
- 폭력 장면은 직접 그리지 말고 그 앞이나 뒤의 순간으로 그려 주세요.

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
proportions, individual and dignified faces for every character regardless of
origin; southern Africa in the 1880s — thorn scrub and open veld, a waterless
desert of red sand, two snow-capped peaks, a broad ancient stone-paved road
cut through rock, and beyond it a green highland kingdom with a large
well-built city of thousands of houses, watercourses and open squares.
Southern African dress: cowhide shields, short stabbing spears, beadwork,
leopard skin for rank. No blood or wounds shown. No text or letters.
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
Allan Quatermain: a small wiry white hunter of fifty-five, grey-bearded,
weather-beaten, worn practical clothes, a heavy rifle. Cautious, never heroic
in posture.
Sir Henry Curtis: a very large white man of about thirty-five with a yellow
beard, quiet.
Captain John Good: a short round white man with a monocle, fussily neat.
Umbopa / Ignosi: a tall, powerfully built Kukuana man of about thirty, upright,
a calm commanding face; a plain cloak as a porter, later the dress of a king.
He is the centre of every scene he is in from chapter 9 onward.
Ventvögel: an experienced San tracker, small and sharp-eyed; the most competent
person in the desert chapters.
Infadoos: an older Kukuana commander, grey-haired, scarred, dignified.
Twala: the reigning king, a big powerfully built man, richly dressed, an old
wound over one eye under a worked leather patch; imposing and handsome. His
cruelty is in his orders, never in his looks.
Gagool: an extremely old woman, tiny, hooded — draw her small and still, not
grotesque.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: an ancient stone-paved road running down out of snow-capped mountains toward a green highland, cut into the cliff face and bridged across a gorge; five small travellers on it, the tallest of them ahead of the others looking down at the country below. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | An old hand-drawn map on a scrap of cloth lying on a table with a lamp beside it, one corner of the route deliberately smudged out. |

## 1장 · 이 책을 읽기 전에

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A conference room in 1880s Berlin: European men in frock coats around a huge map of Africa on a table, drawing straight lines across it; nobody from Africa present. |
| `images/story-01-b.webp` | An English quayside in the 1880s: a boy of about nineteen with one trunk climbing the gangway of a ship bound south, his family already turning back toward the town. |

## 2장 · 앨런 쿼터메인

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | The deck of a coastal steamer: a small weather-beaten hunter with a pipe talking to a very large bearded man and a short neat man with a monocle. |
| `images/story-02-b.webp` | A veld camp at night: a fire, a rifle propped against a wagon wheel, an old hunter writing in a notebook. |

## 3장 · 삼백 년 된 지도

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | A tattered piece of cloth on a table with a crude map drawn on it in faded ink — mountains, a road, a cross — a lamp and three heads bent over it. |
| `images/story-03-b.webp` | A hunter's camp at dusk: a ragged stranger with cracked lips stumbling in out of the thorn scrub, the old hunter catching him as a folded scrap of cloth slips from his shirt. |

## 4장 · 움보파

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A hiring line of porters outside a trading post, and one tall man standing apart from the line, not carrying anything, looking north. |
| `images/story-04-b.webp` | The same man at a campfire speaking, the three white men listening; he is the one standing and they are the ones seated. |

## 5장 · 사막

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | A red sand desert at dusk with five tiny figures crossing it, shadows enormously long, no landmark anywhere. |
| `images/story-05-b.webp` | A San tracker pointing at birds flying low across the evening sky while the others look at him rather than at the birds. |

## 6장 · 솔로몬의 큰길

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | A broad, beautifully engineered stone road descending from a mountain pass, cut through solid rock in one place and carried on a stone bridge in another, green country far below. |
| `images/story-06-b.webp` | A ring of Kukuana warriors with cowhide shields and short spears around four travellers on the road — the warriors drawn as a disciplined army, faces individual and unafraid. |

## 7장 · 트왈라

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A large well-built city seen from above: thousands of houses in neat rings, open squares, watercourses running between them, cultivated fields beyond. |
| `images/story-07-b.webp` | A great open square filled with silent people, a one-eyed king seated above them, a tiny hooded old woman moving slowly along the ranks; three foreigners seated at the side, one of them gripping his own knees. |

## 8장 · 속임수

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | A naval almanac open on a knee in lamplight, a finger on a date, three faces close over it. |
| `images/story-08-b.webp` | A total eclipse at midday over the city: the sun a black disc with a ring of light, the whole square in shadow, thousands of people on the ground, four figures standing. |

## 9장 · 이그노시

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | A cave by firelight: a tall man with his cloak off showing a great snake tattoo round his waist, an old commander on one knee before him, the three foreigners standing well back at the edge of the light. |
| `images/story-09-b.webp` | A night meeting of village headmen: the tall man standing at the centre speaking and counting three points on his fingers, dozens of men listening; the foreigners not in the picture at all. |

## 10장 · 싸움

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | A narrow neck of ground between two hills at dawn, one regiment of grey-haired veterans formed up across it with shields locked, and a vast army coming on beyond. |
| `images/story-10-b.webp` | The morning after: a king standing before a great crowd making a proclamation, an old commander beside him with a doubtful face. |

## 11장 · 동굴

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A vast rock-cut chamber with carved stone figures along the walls and an enormous slab door standing raised on stone pillars. |
| `images/story-11-b.webp` | Complete darkness with one guttering candle: three men among chests of gold and boxes of uncut stones, one of them with his hand flat against a sealed stone wall. |

## 12장 · 돌아가는 길

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | A farewell at the head of a pass: a king and his commanders on one side, three travellers with packs on the other, the green highland behind the king. |
| `images/story-12-b.webp` | A small oasis with a hut: a very large bearded man standing frozen, and a thin lame man coming out of the doorway shading his eyes. |
