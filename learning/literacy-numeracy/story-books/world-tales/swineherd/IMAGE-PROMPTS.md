# 제미나이 그림 프롬프트

이 책은 하나의 이야기를 8개의 장(챕터)으로 나눠 담았고, 펼침면은 모두
16개예요. 펼침면 하나에 그림이 한 장씩 들어갑니다.
그림이 펼침면 전체 폭을 가득 채우고, 그 아래에 이야기가 왼쪽·오른쪽으로 나뉘어 들어갑니다.

아래 프롬프트를 제미나이에 그대로 넣어서 생성한 뒤, 파일명을 정확히 맞춰서
`images/` 폴더에 저장하면 자동으로 책에 나타납니다.
(그림이 없어도 책은 정상적으로 열리고, 이모지 자리표시자가 대신 보여요.)

> **한 파일 = 한 장면입니다. 앞질러 가지 마세요.**
> 파일마다 뒤에 〔이 쪽에 실린 글〕을 붙여 두었습니다. 그 쪽에 실제로 실리는 글이에요.
> 그림은 **그 글에 나오는 장면만** 그려 주세요. 다음 쪽 이야기를 미리 그리면
> 그림이 글보다 한 칸씩 밀려서 책 전체가 어긋납니다. 실제로 그런 일이 있었어요.
> 장면이 둘 적혀 있으면 둘을 **한 그림 안에** 담아 주세요. 하나만 골라 그리면 안 됩니다.

권장 크기: **본문 그림은 가로 2 : 세로 1 비율**(가로로 아주 길쭉한 모양)로 만들어 주세요, WebP. 펼침면 전체 폭을 채우는 자리라 이렇게 길어야 잘리지 않아요. **표지(`cover.webp`)는 세로 2 : 3 비율**, 마무리(`end.webp`)는 가로 3 : 세로 2 정도면 됩니다.

> **마무리 그림(`end`)은 이제 「읽고 나서」 쪽 오른쪽 위 한 자리에만 쓰입니다.** 따로 있던 마지막 쪽은 없앴어요.
> 칸은 **가로 3 : 세로 2** 그대로입니다. 적어 둔 비율대로 그리면 잘리지 않고 그대로 들어갑니다.


본문 그림칸은 마지막 장까지 모두 같은 비율입니다. 어느 장이든 똑같이
2:1로 만들면 되고, 따로 신경 쓸 것이 없어요.

## 공통 스타일 지시문 (모든 프롬프트 앞에 붙여서 사용하세요)

```
Children's picture book illustration, bright cheerful cartoon-animation style,
bold clean outlines, saturated storybook colors, crisp northern light, ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE - no letters, no words, no speech bubbles, no captions, no subtitles (the story text below is only to tell you what the scene is; never draw it), a small tidy kingdom, a grand palace with balconies, a
muddy pig yard and a windswept road, expressive comic faces, wide panoramic
composition, funny and never mean.
```

## 인물 설명 (일관성을 위해 매번 붙여 넣으세요)

```
The prince: a cheerful young man with dark hair, first in a plain travelling
cloak, later disguised as a soot-smudged swineherd in a brown smock. The
princess: a haughty girl in an enormous glittering gown who is easily bored. The
emperor: a small round man with a huge crown that keeps slipping. The ladies in
waiting: a flock of identically dressed girls who move as one.
```

## 표지 · 마무리

| 파일명 | 장면 |
|---|---|
| `images/cover.webp` (세로 2:3 비율) | A tall portrait-format cover: a young man in a rough brown smock standing among pigs in a castle yard, holding a small clay pot hung with tiny bells, a glittering princess and her ladies peering down from a balcony above, comic and inviting. |
| `images/end.webp` | A closed storybook resting under a starry night sky with soft golden sparkles rising from its pages, peaceful and warm closing scene. |

## 1장 · 작은 나라의 왕자

| 파일명 | 장면 |
|---|---|
| `images/01-prince.webp` | A modest castle garden where a young prince stands between a rose bush bearing one perfect bloom and a small nightingale on a branch, morning light, warm and hopeful. 〔이 쪽에 실린 글 (1/16) — 그림에 글자는 넣지 마세요. 왼쪽: 아주 작은 나라에 젊은 왕자가 살았습니다. 나라가 어찌나 작은지 지도에 겨우 점만 했지요. 그래도 왕자는 마음이 넉넉했습니다. 온 나라 사람들이 왕자를 좋아했지요. 어느덧 왕자도 혼인할 나이가 되었습니다. 왕자는 이웃 나라 공주에게 청혼하기로 했지요. / 오른쪽: 왕자에게는 세상에 둘도 없는 보물이 있었습니다. 아버지 무덤가에 자란 장미 나무였지요. 오 년에 딱 한 번 꽃이 피었습니다. 그 향기를 맡으면 슬픈 일도 잊혔지요. 또 하나는 작은 밤꾀꼬리였습니다. 온갖 노래를 다 부를 줄 알았지요. 왕자는 이 둘을 아주 아꼈습니다.〕 |
| `images/01-prince-2.webp` | A prince sealing a rose and a nightingale into two silver caskets, and a vast glittering palace where a bored princess yawns among her ladies, contrast. 〔이 쪽에 실린 글 (2/16) — 그림에 글자는 넣지 마세요. 왼쪽: 왕자는 장미를 은 상자에 담았습니다. 밤꾀꼬리도 은 상자에 담았지요. 이만한 선물이면 부족하지 않겠지. 사람을 시켜 이웃 나라로 보냈습니다. 그러고는 대답을 기다렸지요. / 오른쪽: 기둥이 몇 개인지 세기도 어려웠지요. 거기 공주가 하나 살았습니다. 무엇을 봐도 금방 싫증을 냈지요. 시시해. 또 시시해.〕 |

## 2장 · 시큰둥한 공주

| 파일명 | 장면 |
|---|---|
| `images/02-gifts.webp` | A glittering palace hall where a princess claps at an open silver casket holding a rose, then her face falling when told it is real, ladies in waiting fanning, comic. 〔이 쪽에 실린 글 (3/16) — 그림에 글자는 넣지 마세요. 왼쪽: 선물이 궁궐에 도착했습니다. 공주가 반가워서 달려 나왔지요. 선물이라니! 큰 것이었으면 좋겠어. 시녀가 은 상자를 열었습니다. 안에는 장미 한 송이가 들어 있었지요. / 오른쪽: 어머, 예쁘게 만들었네! 심부름꾼이 얼른 말했지요. 만든 게 아니라 진짜 꽃입니다, 공주님.〕 |
| `images/02-gifts-2.webp` | A nightingale singing beautifully from a silver casket while ladies listen enraptured but a princess turns away bored, ornate palace hall, comic disdain. 〔이 쪽에 실린 글 (4/16) — 그림에 글자는 넣지 마세요. 왼쪽: 공주는 상자를 밀어냈습니다. 진짜 꽃은 금방 시들잖아. 시녀가 두 번째 상자를 열었지요. 밤꾀꼬리가 고개를 내밀고 노래를 불렀습니다. 방 안이 온통 고운 소리로 찼지요. / 오른쪽: 이것도 진짜 새예요? 그렇습니다, 공주님. 살아 있는 새라니, 시시해.〕 |

## 3장 · 돼지치기가 되어

| 파일명 | 장면 |
|---|---|
| `images/03-disguise.webp` | A young prince rubbing soot on his cheeks and pulling on a rough smock, then being hired at a palace back gate among grunting pigs, comic and clever. 〔이 쪽에 실린 글 (5/16) — 그림에 글자는 넣지 마세요. 왼쪽: 소식은 곧 왕자에게 전해졌습니다. 왕자는 화가 나기보다 궁금해졌지요. 저 공주는 대체 무엇을 좋아하는 걸까? 왕자는 직접 가 보기로 했습니다. 다만 왕자로 가지는 않았지요. / 오른쪽: 얼굴에는 검댕을 문질러 발랐지요. 그러고는 궁궐 문을 두드렸습니다. 일자리를 구하러 왔습니다. 문지기가 위아래를 훑어봤지요.〕 |
| `images/03-disguise-2.webp` | A muddy pig yard by day and a tiny attic room by candlelight where a soot-smudged young man moulds clay and carves tiny bells, cosy and comic. 〔이 쪽에 실린 글 (6/16) — 그림에 글자는 넣지 마세요. 왼쪽: 왕자는 궁궐 뒷마당에서 지내게 되었습니다. 방은 좁고 천장이 낮았지요. 낮에는 돼지를 돌보았습니다. 돼지들은 금세 왕자를 따랐지요. 먹이를 줄 때마다 꿀꿀거리며 몰려왔습니다. 꿀꿀, 꿀꿀! / 오른쪽: 해가 지면 왕자는 방으로 돌아왔지요. 그러고는 촛불을 켜고 앉았습니다. 진흙을 반죽하고 방울을 깎았지요. 밤마다 무언가를 만들었습니다. 며칠이 지나자 물건 하나가 완성되었지요. 왕자는 그것을 들고 빙그레 웃었습니다.〕 |

## 4장 · 노래하는 냄비

| 파일명 | 장면 |
|---|---|
| `images/04-pot.webp` | A small clay pot ringed with tiny bells steaming on a fire, musical notes rising, a swineherd holding his hand in the steam and seeing village kitchens, magical. 〔이 쪽에 실린 글 (7/16) — 그림에 글자는 넣지 마세요. 왼쪽: 왕자가 만든 것은 작은 냄비였습니다. 가장자리에 방울이 잔뜩 달려 있었지요. 냄비에 물을 붓고 불을 지폈습니다. 물이 끓기 시작하자 방울이 울렸지요. 딸랑딸랑, 노랫가락이 흘러나왔습니다. 그것만이 아니었지요. / 오른쪽: 냄비에서 나는 김에 손을 대면 신기한 일이 벌어졌습니다. 온 마을 부엌이 눈앞에 떠오르는 것이었지요. 어느 집이 무슨 음식을 하는지 다 알 수 있었습니다. 오늘 저 집은 팬케이크를 굽는군! 김에서 고소한 냄새까지 났지요. 왕자는 코를 킁킁거렸습니다. 왕자는 혼자 웃었지요.〕 |
| `images/04-pot-2.webp` | A lady in waiting hearing bell music over a wall and running to tell a princess who leaps up from her balcony chair in excitement, lively and comic. 〔이 쪽에 실린 글 (8/16) — 그림에 글자는 넣지 마세요. 왼쪽: 냄비 소리는 담을 넘어 퍼졌습니다. 지나가던 시녀가 그 소리를 들었지요. 어머, 저게 무슨 소리야? 시녀는 궁궐로 달려가 공주에게 알렸습니다. 공주는 하품을 하다 눈이 번쩍 뜨였지요. / 오른쪽: 공주는 발코니로 나가 귀를 기울였습니다. 멀리서 딸랑딸랑 소리가 들려왔지요. 공주는 그 자리에서 발을 동동 굴렀습니다. 저걸 꼭 가져야겠어! 얼른 시녀를 뒷마당으로 보냈지요.〕 |

## 5장 · 냄비의 값

| 파일명 | 장면 |
|---|---|
| `images/05-bargain.webp` | A lady in waiting bargaining across a pig-yard fence with a calm soot-smudged swineherd holding a belled pot, then walking back blushing furiously, comic. 〔이 쪽에 실린 글 (9/16) — 그림에 글자는 넣지 마세요. 왼쪽: 시녀가 돼지우리로 갔습니다. 저 냄비를 얼마에 파시겠소? 돼지치기는 잠시 생각하는 척했지요. 그러고는 태연하게 대답했습니다. / 오른쪽: 뭐, 뭐라고요? 열 번입니다. 하나도 깎아 드릴 수 없습니다. 시녀는 얼굴이 새빨개져서 돌아갔습니다. 그러고는 그대로 전했지요. 공주는 발을 굴렀습니다.〕 |
| `images/05-bargain-2.webp` | A princess slamming a door in outrage, then pacing and reopening it with a sly look while her ladies exchange alarmed glances, comic inner struggle. 〔이 쪽에 실린 글 (10/16) — 그림에 글자는 넣지 마세요. 왼쪽: 무례하기 짝이 없구나! 당장 내쫓아 버려라! 공주는 문을 쾅 닫고 들어갔습니다. / 오른쪽: 결국 다시 문을 열었지요. …딱 열 번이라고 했지? 시녀들이 서로 얼굴을 마주 보았습니다.〕 |

## 6장 · 뒷마당에서

| 파일명 | 장면 |
|---|---|
| `images/06-kisses.webp` | A pig yard where a ring of ladies in waiting hold out their wide skirts as a screen while a princess squeezes her eyes shut, pigs looking on, hilariously comic. 〔이 쪽에 실린 글 (11/16) — 그림에 글자는 넣지 마세요. 왼쪽: 공주는 시녀들을 데리고 뒷마당으로 내려갔습니다. 돼지들이 꿀꿀거리며 몰려왔지요. 공주는 코를 막았습니다. 어서 끝내 버리자. 시녀들이 빙 둘러섰지요. 그러고는 치마를 활짝 폈습니다. 치맛자락이 바람에 펄럭였지요. / 오른쪽: 돼지들만 그 안을 들여다봤습니다. 아무도 보지 못하게 담장을 만든 것이었지요. 공주는 눈을 질끈 감았습니다. 시녀들이 소리 내어 세었지요. 하나, 둘, 셋……〕 |
| `images/06-kisses-2.webp` | A princess gleefully boiling a belled pot in her chamber, holding her hand in the steam and laughing with her ladies at what she sees, warm and funny. 〔이 쪽에 실린 글 (12/16) — 그림에 글자는 넣지 마세요. 왼쪽: 그렇게 냄비는 공주의 것이 되었습니다. 공주는 냄비를 안고 방으로 뛰어갔지요. 온종일 물을 끓이며 놀았습니다. 방울 소리가 그치지 않았지요. 김에 손을 대 보기도 했습니다. 오늘 대신 집에서는 무얼 먹으려나! / 오른쪽: 어머, 저 집은 죽만 먹네. 공주는 배를 잡고 웃었습니다. 시녀들도 덩달아 웃었지요. 그날 궁궐은 온통 냄비 이야기뿐이었습니다. 한동안은 그렇게 즐거웠지요.〕 |

## 7장 · 이번엔 딸랑이

| 파일명 | 장면 |
|---|---|
| `images/07-rattle.webp` | A swineherd spinning a rattle that trails swirling ribbons of dance music over a wall while a princess leans eagerly from a balcony, lively and funny. 〔이 쪽에 실린 글 (13/16) — 그림에 글자는 넣지 마세요. 왼쪽: 며칠이 지나자 공주는 또 심심해졌습니다. 그 무렵 돼지치기가 새 물건을 만들었지요. 이번에는 딸랑이였습니다. 돌리면 온갖 춤곡이 흘러나왔지요. 왈츠도 나오고 폴카도 나왔지요. / 오른쪽: 공주는 얼른 발을 감췄습니다. 저건 또 뭐야! 시녀를 얼른 내려보냈지요.〕 |
| `images/07-rattle-2.webp` | A princess hurrying down to the pig yard where ladies form their skirt-screen again and counting begins, pigs tilting their heads, comic. 〔이 쪽에 실린 글 (14/16) — 그림에 글자는 넣지 마세요. 왼쪽: 이번에는 백 번입니다. 시녀가 그대로 전했지요. 백 번? 그건 너무하잖아! / 오른쪽: 하나, 둘, 셋…… 세는 소리가 이어졌습니다. 돼지들이 고개를 갸웃했지요. …여든여덟, 여든아홉.〕 |

## 8장 · 성문 밖에서

| 파일명 | 장면 |
|---|---|
| `images/08-ending.webp` | An emperor with a slipping crown bursting into a pig yard in slippers as ladies scatter, leaving a princess and a swineherd exposed, hilariously dramatic. 〔이 쪽에 실린 글 (15/16) — 그림에 글자는 넣지 마세요. 왼쪽: 하필 임금님이 창밖을 내다보았습니다. 뒷마당에 웬 사람들이 잔뜩 모여 있었지요. 임금님은 안경을 고쳐 썼습니다. 치마 담장 사이로 벌어지는 일이 보였지요. 임금님의 얼굴이 새빨개졌습니다. 슬리퍼를 신은 채 계단을 뛰어 내려갔지요. / 오른쪽: 이게 무슨 짓이냐! 시녀들이 화들짝 놀라 흩어졌습니다. 공주와 돼지치기만 덩그러니 남았지요. 임금님은 손을 부들부들 떨었습니다. 둘 다 이 나라에서 나가거라! 임금님은 그길로 성문을 닫아걸었습니다.〕 |
| `images/08-ending-2.webp` | A rainy road outside a castle gate where a bedraggled princess sits weeping while a young man washes soot from his face revealing a prince, dramatic sky. 〔이 쪽에 실린 글 (16/16) — 그림에 글자는 넣지 마세요. 왼쪽: 성문이 등 뒤에서 쿵 닫혔습니다. 마침 비가 내리기 시작했지요. 공주는 성문 밖에 주저앉아 울었습니다. 나는 이제 어떡하지. / 오른쪽: 그때 돼지치기가 우물가로 갔지요. 얼굴의 검댕을 깨끗이 씻었습니다. 그러고는 고운 옷으로 갈아입었지요. 눈앞에 젊은 왕자가 서 있었습니다. 진짜 장미와 진짜 새는 마다하시더니요.〕 |

## 사용 팁

- 이미지가 준비되기 전에도 페이지는 이모지로 예쁘게 보여요. 준비되는 대로 하나씩 교체하면 됩니다.
- 그림체를 통일하려면 공통 스타일 지시문을 매번 그대로 붙여넣는 게 중요해요.
- 파일명이 정확히 일치해야 자동으로 표시됩니다 (대소문자 포함).
- 이미지를 다 저장하고 나면 파일 형식은 신경 쓰지 마세요 — 용량을 줄이는 webp 변환은 Claude가 알아서 처리해줍니다.
