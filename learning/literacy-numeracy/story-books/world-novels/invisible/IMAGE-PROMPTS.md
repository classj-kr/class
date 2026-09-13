# 제미나이 그림 프롬프트 — 투명 인간

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
proportions with expressive faces; southern England around 1897 — a snowy
village of brick and flint with a coaching inn, a village street, downland and
hedgerows; and a hilltop villa with a study full of books.
Winter light, wet roads, coal smoke. No blood or wounds shown.
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

**보이지 않는 사람을 그리는 방법이 이 책의 전부입니다.**
그를 그리려 하지 말고, **그가 있다는 표시**를 그려 주세요.
움직이는 빈 옷, 저 혼자 밀려나는 의자, 눌린 침대보, 진흙에 찍히는 발자국,
공중에 떠 있는 붕대, 저절로 열리는 문. 사람 모양의 흐릿한 그림자 같은 것은 넣지 마세요.

**딱 두 장면에서만 사람이 보입니다.** 8장의 가운을 입은 형체(머리가 없는 사람처럼)와,
12장 마지막에 드러난 얼굴입니다. 12장의 얼굴은 **괴물이 아니라 서른 살쯤 된 젊은 사람**,
머리와 눈썹이 하얗고 살갗이 아주 흰 얼굴로 그려 주세요. 그 대비가 이 책의 마지막 한 방입니다.

**폭력은 직접 그리지 마세요.** 7장과 12장은 사람들이 둘러싼 바깥쪽에서, 그 앞이나 뒤의 순간으로 그려 주세요.

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The stranger (Griffin): in chapters 1-4, a figure entirely wrapped — wide-brimmed
hat pulled low, muffler up over the nose, coat collar turned up, huge blue
goggles, white bandages, gloves. After chapter 5 he is not drawn at all except
as effects. In chapter 8 he wears a dressing gown, which makes a headless
seated shape. In chapter 12 he is finally seen: a young man of about thirty,
white hair and eyebrows, very pale skin, an ordinary face.
Mrs Hall: a stout kindly innkeeper in an apron.
Thomas Marvel: a fat shabby tramp with a battered silk hat, worn boots.
Dr Kemp: a slim fair young scientist in shirtsleeves, a well-lit study.
Colonel Adye: a police officer in a dark uniform coat.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a figure in a wide hat, blue goggles and white bandages standing in a doorway with snow blowing in behind him — and one bandage on the cheek just beginning to come loose, showing that there is nothing underneath. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | A small inn parlour at night, the lamps out, three thick notebooks open on a table and a fat man in a silk hat bent over them, unable to read a word. |

## 1장 · 눈 오는 날의 손님

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A snowbound village street at dusk, an inn sign swinging, and a heavily wrapped figure with a small case walking toward it out of the blizzard. |
| `images/story-01-b.webp` | An inn parlour with a big fire: the wrapped figure sitting with hat and coat still on, water dripping off him onto the floor, an innkeeper's wife in the doorway with a tray. |

## 2장 · 유리병 상자

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A parlour turned into a laboratory: dozens of bottles of every size crowding the table, curtains drawn in the middle of the day, papers everywhere. |
| `images/story-02-b.webp` | A doctor recoiling from an empty coat sleeve that is unmistakably reaching toward him, the wrapped figure seated calmly. |

## 3장 · 도둑

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | A vicarage kitchen before dawn: an open cash box, an open window too small for a person, and untouched snow in the yard beyond it. |
| `images/story-03-b.webp` | An inn bedroom: a chair standing up by itself and moving toward the doorway, bedclothes flung about, two people backing out in terror. |

## 4장 · 밥값을 셈합시다

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A crowded parlour: the wrapped figure holding up a wax nose he has just removed, everyone staring. |
| `images/story-04-b.webp` | The unwrapping: a coat, a collar and a shirt in the shape of a seated man, and above the collar nothing at all — the wallpaper behind showing straight through. |

## 5장 · 마을을 빠져나가다

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | A room in uproar: a policeman grappling with a shirt and a pair of trousers that are visibly empty, other clothes already on the floor. |
| `images/story-05-b.webp` | A muddy village lane: fresh bare footprints pressing themselves into the mud one after another, and villagers frozen at their doors watching them come. |

## 6장 · 마블 씨

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | A fat tramp in a battered silk hat sitting on a bank at the roadside with two odd boots in front of him, talking to nobody. |
| `images/story-06-b.webp` | The same tramp trudging along a road loaded with bundles and three thick notebooks, hunched, looking back over his shoulder at nothing. |

## 7장 · 마블의 도망

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | A country inn door being barricaded from the inside by half a dozen men while the latch rattles by itself. |
| `images/story-07-b.webp` | The road outside afterwards at dusk: a broken window, a dropped bundle, and a line of footprints leading off across a field, one of them smeared. |

## 8장 · 켐프 박사

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | A staircase at night with a smear on the banister and the bedroom door ajar, a young man in shirtsleeves holding a lamp at the bottom. |
| `images/story-08-b.webp` | A bedroom: a dressing gown seated in an armchair holding its shape as though a man were in it, a bandage floating where an arm would be, and a young doctor sitting opposite listening. |

## 9장 · 그리핀의 이야기

| 파일명 | 장면 |
|---|---|
| `images/story-09-a.webp` | A shabby lodging-house room at night crammed with apparatus, a pale young man with white hair working alone by lamplight, dark windows. |
| `images/story-09-b.webp` | A mirror in that room with nothing reflected in it, and an empty chair in front of it. |

## 10장 · 보이지 않는다는 것

| 파일명 | 장면 |
|---|---|
| `images/story-10-a.webp` | A busy London street in January seen at knee height: a gap in the crowd where people are colliding with something, a hansom swerving, and red bare footprints on the wet pavement. |
| `images/story-10-b.webp` | Snow falling in a dark alley and settling on nothing — building up the shape of a man's shoulders and head out of nowhere. |

## 11장 · 공포의 통치

| 파일명 | 장면 |
|---|---|
| `images/story-11-a.webp` | A study at night: a young doctor writing a short note very fast, glancing at the door. |
| `images/story-11-b.webp` | A hall at the foot of a staircase: a window bursting inward in a shower of glass with nobody there, while a young doctor and a police officer stop dead on the stairs above. |

## 12장 · 언덕 위

| 파일명 | 장면 |
|---|---|
| `images/story-12-a.webp` | A man running downhill toward a village on a bright morning, arms out, shouting; behind him nothing at all, but the grass laid flat in a line following him. |
| `images/story-12-b.webp` | A village street: workmen with spades standing back in a wide circle, and in the middle of the road a young man with white hair and very pale skin lying still, an ordinary young face, someone laying a coat over him. |
