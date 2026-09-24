# 제미나이 그림 프롬프트 — 명탐정 셜록 홈스

사건 여덟 편을 묶은 책입니다. 편마다 그림이 두 장씩(마지막 8편만 세 장) 들어갑니다.
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
late Victorian London 1881-1894, gaslight and fog, hansom cabs and brick
terraces, mysterious but not gruesome, no text or letters in the image.
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
Sherlock Holmes: very tall and thin, sharp hawk-like nose, dark hair swept
back, piercing grey eyes, usually in a dark frock coat and waistcoat indoors,
long travelling cape and deerstalker cap outdoors, pipe often in hand.
Dr John Watson: a solid, moustached man of middle height in a neat brown suit,
kind steady face, slight stiffness in one shoulder.
Mrs Hudson: a plump elderly landlady in a dark dress and white apron.
Inspector Lestrade / police: a small brisk detective in a bowler hat, an
ordinary capable face, and uniformed constables in tall helmets.
The Baker Street sitting room: cluttered with papers, chemical apparatus on a
side table, two armchairs by a coal fire, a bay window onto a foggy street.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a very tall thin man in a long caped coat and deerstalker standing under a gas lamp in a foggy Victorian London street at night, holding up a magnifying glass, his long shadow thrown across wet cobbles, a sturdy moustached companion a step behind him. The picture must bleed to all four edges: no white margin, no white border, no frame, no matting around the artwork. |
| `images/end.webp` | A quiet Baker Street sitting room at night seen from the doorway: an empty armchair by the dying fire, a violin and bow laid across it, a pipe on the mantel, one lamp still burning. |

## 1편 · 베이커가 221B

| 파일명 | 장면 |
|---|---|
| `images/story-01-a.webp` | A Victorian hospital laboratory: a tall thin young man springing up from a bench of glass tubes and burners holding a test tube aloft in triumph, grasping the hand of a startled moustached ex-army doctor, a third man watching amused. |
| `images/story-01-b.webp` | The Baker Street sitting room by firelight: the thin man sprawled in an armchair scraping a violin, papers and chemical bottles everywhere, the doctor reading a newspaper opposite him with a long-suffering expression. |

## 2편 · 보헤미아 왕국의 사진

| 파일명 | 장면 |
|---|---|
| `images/story-02-a.webp` | A very tall broad man in a rich fur-trimmed travelling coat standing in a lamplit sitting room, a black mask just pulled away from his face in his hand, two seated men watching him calmly. |
| `images/story-02-b.webp` | Night outside an elegant villa: smoke pouring from a window, people rushing about shouting, a shabby country clergyman being helped inside while glancing sharply back over his shoulder toward a drawing-room wall. |

## 3편 · 빨간 머리 연맹

| 파일명 | 장면 |
|---|---|
| `images/story-03-a.webp` | A narrow London street packed shoulder to shoulder with men who all have flaming red hair, queuing at a small office door, a stout red-haired shopkeeper among them looking bewildered. |
| `images/story-03-b.webp` | A dark bank vault: crates stacked around, a paving stone pushed aside from below and a man's head and shoulders emerging with a lantern, while a tall figure lunges from behind the crates and a constable steps forward with handcuffs. |

## 4편 · 스토크 모런

| 파일명 | 장면 |
|---|---|
| `images/story-04-a.webp` | A gloomy half-ruined country manor at dusk with a wing still lived in; a caged cheetah's eyes in the shrubbery, ivy over broken windows, a young woman in black hurrying up the drive. |
| `images/story-04-b.webp` | A dark bedroom lit only by a struck match: a tall man striking upward at a dangling bell-rope with a cane, a small ventilator high on the wall above the bed, the seated doctor half risen with a pistol. |

## 5편 · 푸른 보석

| 파일명 | 장면 |
|---|---|
| `images/story-05-a.webp` | A Baker Street table on a winter morning: a battered old felt hat under a magnifying glass, and a uniformed commissionaire holding out his open palm with a brilliant blue gem blazing in it, the two men staring. |
| `images/story-05-b.webp` | A crowded Covent Garden poultry market by gaslight at night: rows of hanging geese, a burly angry salesman with a ledger, a small frightened man hovering at the edge of the stall. |

## 6편 · 사라진 경주마

| 파일명 | 장면 |
|---|---|
| `images/story-06-a.webp` | Bleak windswept Dartmoor moorland after rain: a tall thin man crouched low examining hoofprints in the soft ground, three other men waiting behind him, distant tors under a grey sky. |
| `images/story-06-b.webp` | A racecourse: a dark bay racehorse with a white blaze thundering past the post two lengths clear, crowds cheering along the rail, a delighted colonel in the foreground. |

## 7편 · 춤추는 인형

| 파일명 | 장면 |
|---|---|
| `images/story-07-a.webp` | Close on a garden sundial in morning light: a row of chalked stick figures with arms and legs flung out drawn across its face, a country gentleman and his pale wife staring down at them. |
| `images/story-07-b.webp` | A country study: a tall thin detective seated calmly with a paper of stick-figure symbols on the desk, and a big sunburnt American stopping dead in the doorway as he sees who is waiting. |

## 8편 · 폭포에서

| 파일명 | 장면 |
|---|---|
| `images/story-08-a.webp` | A dim study: a very tall stooping older man with a domed forehead and hooded eyes standing across the desk from a seated detective, both perfectly still, lamplight between them. |
| `images/story-08-b.webp` | The Reichenbach Falls: a huge torrent plunging into a black chasm, spray rising, a narrow path ending at the cliff edge where the detective's walking stick leans against a rock with a sealed letter under a cigarette case on top of it. The only person is Dr Watson arriving alone down the path - a solid moustached man in a brown suit and bowler hat, NOT the detective and NOT wearing a deerstalker. Two sets of footprints lead toward the falls in the mud and none come back. |
| `images/story-08-c.webp` | A doctor's consulting room: an old stooped bookseller straightening up and throwing off his disguise to reveal the tall thin detective smiling, while the doctor staggers back against a bookcase in shock. The white wig is in the detective's raised hand and his own hair underneath is DARK, NOT grey and NOT white - he is not an old man. The posters on the wall and the labels on the bottles are completely blank, no lettering. |
