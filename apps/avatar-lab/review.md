# 아바타 수정·재검수 기록 · 2026-11-08

**152종 전체 제작은 미완료이며, 기하 검사 통과와 외형 합격을 구분합니다.**

## 현재 수정

- 20차(2026-11-09)는 악어·드래곤·레오파드 게코·크레스티드 게코의 흐린 원본을 이미지 편집 도구로 정리하고 무손실 WebP와 GLB에 반영했습니다. 악어의 비대칭 주둥이·몸·팔다리와 꼬리, 용의 후드·주둥이·벌린 팔, 게코의 머리 윤곽·눈 돌기·짧은 몸·두꺼운 꼬리를 별도 입체로 수정했습니다. `batch20.json`은 두 장의 동일 배율 원본/정면 비교, `batch20-geometry.json`은 네 파일의 검사 근거입니다. 정면 주요 특징 검토는 기존 범위 152종 중 37종이며 전체 외형 합격은 아닙니다. 악어의 확대 화면 목 경계와 그림 가장자리 마감은 미해결이며 옆·뒤·이동·미술관 검수도 남아 있습니다. 배경 잡티가 생긴 첫 악어 생성본은 적용하지 않았습니다.
- 사용자가 별도 추가 중인 2D 아바타는 기존 152종과 구분합니다. 현재 발견한 `animal-capybara.webp`는 카탈로그의 `not_started` 추가 원본이며, 기존 모델 검수 수나 완료 수에 포함하지 않습니다. 추가 원본을 임의로 기존 캐릭터에 덮어쓰거나 미검수 3D로 완료 처리하지 않습니다.

- 19차(2026-11-09)는 사용자가 지적한 펭귄·늑대의 원본 결함을 먼저 수정했습니다. 이미지 편집 도구로 펭귄의 끊긴 왼쪽 날개, 늑대 꼬리의 네모난 색 조각과 귀·볼·손의 흐린 마감을 정리하고 기존 그림을 보관한 채 무손실 WebP로 반영했습니다. 늑대 3D의 귀 뿌리, 짧은 몸·손·발과 꼬리 윤곽도 새 원본에 맞췄습니다. `batch19.json`에는 동일 배율 원본/정면 비교 한 장과 현재 해시를, `batch19-geometry.json`에는 두 모델의 파일 검사를 보존했습니다. 기존 33종 중 두 종을 재검수한 것이며 검수 종수 증가나 전체 완료를 뜻하지 않습니다. 옆·뒤·동작·미술관 검수는 아직 남아 있습니다.

- 18차(2026-11-09)는 생쥐·나무늘보·거북이·유니콘 4종의 정면을 수정했습니다. 큰 귀와 전체 후드, 치즈를 잡는 손, 비대칭으로 막대를 잡는 팔, 정면에 보이는 큰 등껍질과 작은 꼬리, 유니콘의 귀·뿔·갈기·꼬리를 원본 윤곽에 맞췄습니다. 2장의 동일 배율 비교를 `batch18.json`의 현재 해시에 연결했고, 4종 파일 검사는 `batch18-geometry.json`에 보존했습니다. 생쥐 귀·치즈 및 유니콘 갈기·눈 주변의 원본 얼룩은 미해결 보정 항목입니다. 원본/정면 주요 특징 확인은 총 33종이며, 옆·뒤·동작·미술관과 전체 완료 판정은 여전히 남아 있습니다.

- 17차(2026-11-09)는 돌고래·펭귄·물개·고래·상어·독수리·부엉이 7종의 정면을 수정했습니다. 잘린 머리, 높은 지느러미, 어긋난 얼굴 중심, 좁은 부리·날개와 짧은 몸·발·꼬리를 원본에 맞췄습니다. 상어의 머리/꼬리 빈틈도 메웠습니다. 4장의 동일 배율 원본/정면 캡처를 현재 해시와 연결한 `batch17.json`에 기록했고, 7종 기하·내보내기 검사는 `batch17-geometry.json`에 보존했습니다. 고래 물줄기 형상은 기존 부가 애니메이션에 연결되지만 새 형상의 동작 시각 검수는 아직 진행 전입니다. 펭귄 원본의 왼쪽 날개 투명도 누락, 상어 원본의 흐린 마감도 미해결 항목으로 남겼습니다. 전체 152종의 정면 및 옆·뒤·이동·미술관 검수는 여전히 미완료입니다.

- 16차(2026-11-09)는 병아리·사슴·오리·토끼·코끼리·하마·캥거루·원숭이 8종의 정면을 원본과 같은 배율로 비교했습니다. 깃털·뿔·귀·넓은 날개·짧은 몸을 복원하고 원숭이 바나나와 꼬리를 별도로 만들었습니다. 코끼리는 원본의 앉은 자세와 옷자락을 유지하도록 다시 만들었고 옷자락을 두 다리로 취급하던 걷기 대신 통통 뛰는 이동을 연결했습니다. 현재 정면 근거는 `batch16.json`의 네 장 캡처이며, 코끼리의 새 이동을 포함한 시각 동작 검수는 아직 남아 있습니다. 146종 전체 기하·바닥·내보내기 검사는 통과했고 그 결과를 `batch16-geometry.json`에 별도로 보존했습니다. 원본 자체의 흐린 마감과 전체 옆·뒤·이동·미술관 검수는 완료 선언에 포함하지 않았습니다.
- 15차는 곰·강아지·코알라·양·미어캣·코뿔소·다람쥐·고슴도치 8종의 정면을 수정했습니다. 원본의 머리·귀·뿔·가시·꼬리 윤곽과 짧은 몸을 다시 만들고, 잘린 팔·몸 가림·꼬리 빈틈을 수정했습니다. `compact-animal-suits.cjs`는 각 원본에서 따로 측정한 몸·팔·발 윤곽을 사용합니다. 원본/정면 두 칸의 동일 배율 비교를 직접 확인해 현재 해시와 네 장의 WebP 캡처를 `batch15.json`에 기록했습니다. 15종 대상 기하·내보내기 검사는 통과했지만 이번 8종의 옆·뒤·보행·미술관 시각 검수는 아직 진행 전입니다. 전체 152종 완료로 간주하지 않습니다.
- 14차는 정면 우선으로 여우·늑대·판다·사자·기린·호랑이 6종을 수정했습니다. 원본과 같은 배율로 비교해 귀·볼·갈기 윤곽, 얼굴 누락, 짧은 소매·발, 꼬리 모양을 복원했습니다. 세 장의 2종 비교 캡처에 현재 모델 해시를 연결했으며 정면 주요 특징 일치만 작업자 검수했습니다. 옆·뒤·보행·미술관의 최종 시각 합격은 여전히 미완료입니다. `batch14.json`과 별도 보존한 `batch14-geometry.json`이 이 단계의 근거입니다. 같은 파일에서 반복 덮어쓰는 기하 검사 결과를 최종 외형 합격으로 사용하지 않습니다.
- **검수 순서 수정:** 사용자가 12차 튤립의 정면부터 원본과 다르므로 옆·뒤·걷기 검수는 시간 낭비라고 지적했습니다. 이 지적을 반영해 원본과 정면의 모양·얼굴·색·비율을 먼저 맞추고, 정면이 통과한 모델만 옆·뒤·이동 검수로 진행합니다. 12차 튤립은 정면 불합격 이력이며 합격 모델이 아닙니다.
- 13차 튤립은 앞 꽃잎의 위치와 폭, 원본의 중앙 꽃잎과 두 앞 꽃잎의 선·색을 복원했습니다. 원본에서 측정한 잎 윤곽과 짧은 몸·팔·발로 정면을 수정했습니다. 그림을 별도 격자 면에 놓는 대신 실제 꽃잎 표면에 맞춰 꽃잎 사이와 얼굴 둘레의 누락을 줄였습니다. `collection-review.html?ids=theme-tulip&front=1`은 동일 배율의 원본/정면만 표시합니다. 최신 캡처는 `repairs13-tulip-front-final.webp`이며 미세한 테두리·표면 이음새는 추가 정리가 필요합니다. 이번 파일의 옆·뒤·걷기는 정면 승인 전 단계이므로 검수하지 않았습니다.
- 12차에서는 튤립 앞 꽃잎을 두 장이 가운데로 포개지는 구조로 고치고, 옆·뒤까지 같은 분홍/노랑 그라데이션을 이어 붙였습니다. 최신 GLB의 원본·정면·양옆·뒤와 보행 0/25/50/75%를 비교했고 실제 미술관에서도 정면·양옆·뒤를 확인했습니다. 원본 테두리 두께와 잎 마감의 일치는 계속 다듬어야 합니다.
- 다람쥐의 원본에서 왼쪽으로 치우친 머리·몸 중심과 판다 후드의 높이를 바로잡았습니다. 고슴도치 가시를 뒤통수 전체에 배치하고, 이 세 종과 양·여우·사자·늑대의 팔다리를 짧은 입체 소매·손·발로 교체했습니다. 7종의 원본·앞·양옆·뒤와 보행 네 구간을 확인했습니다. 양 몸통의 털, 다람쥐 꼬리 뒷무늬, 여우·사자·늑대의 옆면 경계는 아직 남아 있습니다.
- 미술관 검수 화면은 152종 모두 선택하거나 4종씩 38묶음으로 불러올 수 있습니다. 앞·양옆·뒤와 보행 구간 조절, 파일 버전별 재로딩, 전환 시 이전 모델 메모리 해제, 촛불 등 부가 동작을 연결했습니다. 실제로 튤립·판다·생일 케이크와 처음 두 묶음의 로딩·전환·재생을 확인했습니다. 이 PC의 표시값은 약 60 FPS였으며, 152종 미술관 전수 검수나 학급 전체 동시 접속 시험을 완료했다는 뜻은 아닙니다. 판다 측면 그림 경계와 케이크 크림의 거친 마감을 추가로 확인했습니다.
- 12차 이후 146종 및 별도 6종의 기하·동작·내보내기 검사를 다시 통과했습니다. `outputs/qa/avatar-lab/rebuild-20261108/batch12.json`에 최신 모델 해시와 무손실 WebP 캡처를 연결했습니다. 모든 시각 합격 상태는 여전히 보류입니다.
- 11차에서 사용자가 튤립의 옆모습이 부풀린 정면 그림처럼 보인다고 지적했습니다. 이 지적은 타당합니다. 10차 튤립의 단일 윤곽 볼륨은 폐기하고, 둘레를 감싸는 닫힌 꽃잎 6장·안쪽 면·겹침·곡면 꽃받침·짧은 몸과 팔다리로 다시 제작했습니다. `tulip-costume.cjs`가 해당 구조를 담당합니다. 얼굴은 실제 앞 꽃잎 표면을 촘촘히 따라가도록 투영해 겹침 얼룩을 줄였습니다. 정면·양옆·뒤·이동 0/25/50/75% 화면을 다시 확인했지만 원본 꽃잎의 색/윤곽 일치와 미술관 검수는 남아 있으므로 최종 합격 상태가 아닙니다.
- 동물 24종은 주둥이 가장자리를 후드 곡면에 붙이거나 귀 안쪽을 실제 귀 표면에 맞추도록 재생성했습니다. 여우·늑대의 볼 털은 곡면으로, 사자의 갈기는 뒤통수까지 이어지는 덩어리로 바꿨습니다. 양은 이마 높이를 복원하고 뒤쪽 양털을 추가했습니다. 곰·강아지·물개·코알라의 코도 후드 표면에 연결했습니다. 24종 현재 파일의 앞·양옆·뒤·이동 25%를 확인했으며 다른 보행 구간과 잔여 마감은 계속 검수 중입니다.
- 이번 동물 화면에서 고슴도치 뒤쪽 가시 부족, 판다 귀의 가는 연결부, 다람쥐 팔다리의 꼬리 그림 잔여물, 기린·호랑이의 측면 그림 경계, 게코 꼬리의 규칙적인 무늬를 추가 수정 항목으로 확인했습니다. `batch11.json`은 이런 미완료 항목과 현재 모델 해시를 함께 기록합니다. 이전 파일 캡처는 별도 이력으로 이동했으며 현재 완료 근거로 쓰지 않습니다.
- 10차 수정에서 음식 6종(붕어빵·핫도그·떡볶이·빙수·생일 케이크·김밥)과 꽃/선인장 5종을 수정했습니다. 연필의 최신 흑연 끝도 확인했습니다. 12종의 현재 파일을 원본·정면·양옆·뒤 및 이동 0/25/50/75%에서 비교했으며 `outputs/qa/avatar-lab/rebuild-20261108/batch10.json`에 파일 해시와 캡처를 연결했습니다. 이는 전체 외형 합격 기록이 아닙니다.
- 핫도그 소스는 얼굴 위·아래에서 끊고 소시지 곡면에 붙였습니다. 붕어빵의 납작한 목 조각을 없애고 몸·팔·발·꼬리·등지느러미를 보완했습니다. 떡볶이는 기울어진 그릇과 고명, 그릇 안에 연결된 둥근 얼굴로 바꾸고 중복 투영 줄무늬를 제거했습니다.
- 빙수는 팥 덩어리와 낱알을 연결했고, 케이크는 옆면까지 이어지는 크림·물결·띠와 줄무늬 초를 만들었습니다. 김밥은 둥근 밑면·밥·속재료를 정리했습니다. 김밥의 수평 윗면이 보이도록 검수 카메라를 원본의 내려다보는 각도에 가깝게 조정했으며, 모델 윗면은 수평으로 유지했습니다.
- 벚꽃·해바라기 꽃잎을 둥근 곡면으로 만들고, 해바라기·장미의 뒤 꽃받침을 꽃의 뒷면에 붙였습니다. 튤립은 얼굴을 받치는 하나의 입체 꽃봉오리와 곡면 잎으로 바꿨습니다. 선인장에는 비대칭 가지·둥근 가지 끝·연결된 발을 만들고 중복 사람 팔을 없앴습니다. 뒤 무늬, 그림의 측면 경계, 고명·크림의 세부 마감, 미술관 검수는 계속 남아 있습니다.
- 전체 152종의 원본·앞·양옆·뒤·이동 25% 구간을 다시 화면으로 확인했습니다. `outputs/qa/avatar-lab/rebuild-20261108/full-collection-audit.json`은 수정 전 모델 해시에 연결된 전수 검토 기록이며, 최종 합격표가 아닙니다.
- 이번 검토에서 강아지·물개의 떠 있던 코, 달팽이 눈동자와 등껍질 곡선, 일부 동물의 판 모양 귀를 수정했습니다. 해양 동물 5종의 팔다리에 남은 꼬리 조각도 별도 지느러미·발로 교체했습니다.
- 선물 리본과 소방차 창문이 얼굴을 가르는 문제, 연필 육각면이 얼굴을 자르는 문제를 수정했습니다. 초밥은 원본 윤곽에 맞춘 연어와 넓은 밥을 연결했고 달걀프라이 후드 윗부분의 관통을 줄였습니다. 연필 흑연 끝은 10차 검수에서 화면으로 다시 확인했습니다.
- 146종 및 별도 대표 6종의 기하·내보내기·동작 검사를 통과했습니다. 현재 남은 시각 결함을 고치는 작업은 계속 진행 중입니다.
- 과일 6종(사과·망고·복숭아·감·파인애플·딸기)과 토마토·가지의 열매 높이·윤곽·잎 연결을 수정했습니다. 파인애플 윗부분 누락을 복원하고 망고는 비대칭 윤곽을 별도 제작했습니다. 과일 몸에 남은 넓은 띠를 없애고 짧은 몸통·연결된 양팔·발로 교체했습니다. 정면·양옆·뒤·이동 구간을 비교했지만 그림의 측면 경계, 잎 두께, 파인애플 뒷무늬는 추가 수정 대상입니다. 공통 잎 변경이 적용되는 오렌지도 재생성했습니다. 전체 146종 기하 검사를 다시 통과했습니다.
- 원본 31종을 깨끗한 표정·선·짧은 몸통 비율로 수정하고 실제 WebP와 GLB에 반영했습니다. 파일별 원본/모델 해시와 남은 검토 상태는 `source-review.json`에 기록합니다.
- 살모사 사람 눈은 짙고 부드러운 눈동자로 바꿨습니다. 두 뱀은 감긴 몸·연결된 꼬리·팔다리 없는 미끄러짐 동작으로 만들었습니다.
- 눈사람의 사람 얼굴에 겹친 당근 코와 양쪽 사람 팔을 제거했습니다. 3D는 두 눈덩이와 단추, 바닥을 기준으로 한 통통 뛰기 동작입니다.
- 호랑이 팔에 남은 꼬리 조각을 제거하고, 호랑이 줄무늬와 기린 반점을 실제 후드 곡면에 붙였습니다. 정면 그림과 옆면의 마감 경계는 추가 수정 대상입니다.
- 기타 소품과 번개 끝의 바닥 관통을 수정했습니다. 146종 검사 및 기존 대표 6종 검사를 통과했으며, 이후 변경한 모델은 별도로 재검사했습니다. 외형 합격을 뜻하지 않습니다.
- 기린의 팔다리에 남은 꼬리 조각을 없애고 연결된 꼬리·술·발굽으로 교체했습니다. 풍선 캐릭터에는 끈을 잡는 두 손과 짧은 몸통을 만들고 걷는 동안 양팔 위치를 유지합니다.
- 벙어리장갑의 외곽·엄지·손목·짧은 몸과 발을 다시 만들고, TV의 화면·케이스 비율을 수정했습니다. 얇은 상자의 모서리 두께가 본체 깊이를 넘어 면이 뒤집히던 공통 오류를 고쳤습니다.
- 소방차 사다리는 막힌 덩어리에서 연결된 양쪽 레일과 다섯 가로대로 바꿨습니다. 배는 곡면 선체·붉은 띠·테두리를 만들고 얼굴을 선실에 직접 붙였습니다. 선실의 옆모습은 여전히 너무 각집니다.
- 이 여섯 모델의 앞·양옆·뒤·이동 구간을 비교했습니다. 공통 변경 후 146종을 다시 만들었으며 검사 기록과 현재 파일 해시가 모두 일치합니다. 여섯 모델도 외형 최종 합격 상태는 아닙니다.

- 원본 테두리의 측면 투영을 법선 방향으로 감쇠하고 윤곽의 들쭉날쭉한 명암을 완화했습니다. 기존 윤곽 초안의 납작한 구조 자체를 해결한 것은 아닙니다.
- 돌출 얼굴 판을 제거하고 케이크·햄버거·마카롱 등은 실제 회전체 표면에 얼굴을 투영했습니다. 스탠드는 갓에 이마 부분의 아치를 만들어 얼굴을 앞으로 밀지 않고 눈이 보이게 했습니다.
- 무는 흰 뿌리 회전체와 얇은 초록 잎으로 분리했습니다. 버섯 반점은 실제 갓 표면에 부착했습니다.
- 나비 더듬이, 플라밍고 목·부리, 개구리 손·손가락을 별도 입체로 제작했습니다.
- 고양이 귀 안쪽 뿌리를 후드 앞·뒤 표면까지 확장해 깊게 파인 연결부를 줄였습니다.
- 꿀벌의 날개·더듬이·꿀봉을 다시 연결했고, 게코의 규칙적인 원형 반점 배열을 제거했습니다. 게코 뒷면은 정면 의상의 주황 무늬에서 해석한 것이며 실제 뒷모습 참고 자료를 확보한 상태는 아닙니다.
- 공 3종은 구체와 실제 곡면 무늬, 볼링은 독립된 핀·공으로 구성했습니다.
- GLB와 현재 제작 코드의 위치·법선·UV·색상 배열을 직접 대조합니다. 파일 변경 시 알려진 외형 실패 상태를 자동으로 해제하지 않습니다.

## 2026-11-09 추가 수정: batch21–22

- 플라밍고·타조·개구리·공작의 주요 정면 형상을 다시 제작했습니다. 타조·공작·개구리 원본 마감을 다듬고, 짧은 몸과 원본 표정을 유지했습니다. 각 모델의 윤곽 마감 차이는 아직 남아 있습니다.
- 오목한 볏에서 단일 법선으로 앞뒤를 판단하던 공통 오류를 전체 투영 면적으로 교정했습니다. 타조의 뒤쪽 꼬리가 얼굴을 뚫고 보이던 현상이 사라졌습니다. 회귀 검사 `tests/avatar-volume-facing.cjs`, 전체 146종 및 별도 6종 기술 검사를 통과했고, 이 수정으로 과거 정면 검수 모델의 파일 해시가 달라지지는 않았습니다.
- 잠자리·무당벌레 원본은 내장 이미지 생성 도구로 마감을 다듬었습니다. 원본 백업과 정확한 프롬프트는 `outputs/avatar-lab/source-edits/`의 `batch22-generated.json` 및 각 `*-clean-prompt.txt`에 있습니다. 프로젝트에는 알파를 유지한 무손실 WebP로 반영했습니다.
- 두 곤충의 잘린 날개와 가는 더듬이를 개별 닫힌 입체로 바꾸고, 날개 뿌리를 몸에 연결했습니다. 옆면으로 늘어난 검은 테두리, 뒷면 몸통 줄무늬의 삼각형 경계도 수정했습니다.
- 현재 파일로 두 곤충의 정면·양옆·뒤와 걷기 0/25/50/75%를 직접 확인했습니다. 증거는 `outputs/qa/avatar-lab/rebuild-20261108/batch22.json`에 있습니다. 이 기록은 모델 비교 화면 검사이며 실제 미술관 이동 검증은 아닙니다.
- 현재 정면 주요 특징 비교 기록은 43종입니다. 전체 152종의 최종 시각 합격은 여전히 미완료입니다. 날개와 팔의 그림 경계, 일부 원본 가장자리 잔여물, 머리 이음선·발 윤곽, 실제 미술관 이동과 성능 검수를 계속해야 합니다.

## 2026-11-09 추가 수정: batch23

- 꿀벌·나비·사마귀·달팽이 원본의 흐린 선, 더듬이 주변 잔여물과 입 안의 얼룩을 내장 이미지 도구로 정리했습니다. 원본 백업을 보존하고 알파가 있는 무손실 WebP로 반영했습니다. 수정 프롬프트와 선택 파일은 `outputs/avatar-lab/source-edits/batch23-generated.json`에 있습니다.
- 네 모델을 개별 닫힌 형태로 다시 제작했습니다. 꿀벌은 새 제작 경로로 연결하고 꿀봉을 손에 부착했습니다. 나비 날개 무늬와 무지개 몸통은 뒤에서도 이어집니다. 사마귀 눈·목 겹침을 제거했고, 달팽이는 눈자루 끝과 껍데기·발의 연결, 얼굴을 가리던 껍데기 위치를 수정했습니다.
- 정면 비교 후 양옆·뒤·이동 0/25/50/75%를 확인했습니다. 꿀벌·나비·사마귀는 인물 전시실, 달팽이는 자연 전시실에서 실제 이동·회전·정지를 확인했습니다. 검수 화면의 모델 revision과 저장된 모델 해시를 맞췄습니다.
- 이번 미술관 시험은 로컬 선택 시험 모드에서 한 종씩 표시한 결과이며 화면에는 60 FPS가 관찰됐습니다. 학급 동시 접속이나 저사양 기기 성능 합격을 의미하지 않습니다. 네 모델의 기하·동작·내보내기 검사도 통과했습니다.
- 현재 정면 주요 특징 비교 기록은 47종입니다. 사마귀 눈 표면과 앞다리, 꿀벌 줄무늬·날개 뿌리, 나비 날개/팔 경계, 달팽이 껍데기·발의 그림 경계 등 세부 마감은 남아 있으며, 이번 네 모델도 최종 완료 상태가 아닙니다. 현재 파일의 검수 범위와 증거는 `outputs/qa/avatar-lab/rebuild-20261108/batch23.json` 및 `review.json`에 기록했습니다.

## 남아 있는 결함

이전의 나머지 103종에도 별도 구조를 넣었으나 재제작은 완료되지 않았습니다. 곰·기린·미어캣 등의 귀와 그림 경계, 장갑 손목 가장자리, 풍선 끈의 그림 잔여물, 차량 측면 깊이와 그림 경계, 음식 고명·비율, 여러 과일의 몸통 연결을 추가 수정해야 합니다. 원본 31종 교체와 기하 검사 통과를 전체 외형 합격으로 보고하지 않습니다. 최신 비교 화면도 합격 목록이 아닙니다.

이번 원본 교체 이후 비교와 동작 구간은 `outputs/qa/avatar-lab/rebuild-20261108/`에 저장합니다. 모델 해시와 확인 범위는 같은 폴더의 `review.json`에 기록합니다. 전체 152종의 시각 합격 수를 보고하지 않습니다.

## 이전 대표 6종 작업 기록

아래는 앞선 시제품 작업 당시의 기록입니다. 이후 모델이 변경되었으므로 이전 캡처나 통과 기록을 현재 파일의 완료 근거로 사용할 수 없습니다.

| 모델 | 이번 수정 | 확인한 부분 |
|---|---|---|
| 고양이 | 더 깊은 둥근 후드와 독립된 귀, 몸통 깊이, 꼬리의 입체 줄무늬, 그림 경계 완화, 손 흔들기 어깨 위치 수정 | 웃는 표정, 양쪽 귀, 뒤통수와 꼬리 연결, 걷기·손 흔들기 중 팔다리 연결 |
| 라멘 | 얼굴의 가로·세로 비율, 반쪽 삶은 달걀의 깊이, 고기 높이·기울기, 중성 도자기 색 | 원형 그릇의 열린 윗면과 바닥, 얼굴 비율, 국물에 놓인 고명, 몸통과 발 |
| 도넛 | 고리 깊이 55% 확대, 얼굴 뒤의 머리 깊이, 초콜릿·몸통 색감 통일 | 앞의 얼굴 구멍과 뒤의 막힌 머리, 옆의 도넛 두께, 코팅·스프링클 |
| 바나나 | 과육과 속껍질을 서로 다른 크림색으로 분리, 중성 명암, 머리와 몸 사이 틈 연결 | 밝은 화면과 미술관에서 색, 네 껍질의 안팎, 휜 노란 몸체, 보행 중 연결 |
| 헬리콥터 | 조종석의 원본 광택 그림을 실제 표면에 맞춤, 후드·몸통 재질 통일 | 얼굴과 조종석의 표면 겹침, 수평 회전날개, 뒤의 꼬리와 날개 |
| 우산 | 원본 얼굴·우비·입체 천의 밝기 통일, 공통 보행 교정 | 8개 닫힌 천 패널, 옆·뒤 우비, 기둥·손잡이·왼손 연결 |

## 공통 보행과 재질

- 조명이 원본 얼굴 그림과 입체 면에 서로 다르게 적용되던 문제를 수정했습니다. 중성 명암을 정점 색으로 저장하고 GLB에도 같은 재질을 포함했습니다.
- 발을 딛는 구간과 들어서 앞으로 가져오는 구간을 나눴습니다. 산책 화면과 미술관의 이동 속도에 GLB 보폭을 맞춰 재생합니다.
- 미리보기 방향 버튼이 귀와 회전날개를 가리지 않도록 캔버스 위 별도 줄에 배치했습니다.

## 검증 증거

- 여섯 GLB 모두 원본 WebP와 Idle/Walk/Wave 동작 포함. 실제 내보낸 파일의 동작 값과 모델 소스도 비교함.
- `node tests/avatar-model-geometry.cjs`: 6종 통과. 닫힌 몸체, 한 쌍의 팔다리, 얼굴 곡면 접촉, 어깨 이동 한계, 고양이 꼬리 연결, 동작별 바닥 접촉, 직선 보행의 딛는 발 위치, GLB 재질 검사.
- 실제 GLB를 포함한 브라우저 화면에서 30개 방향 캡처, 24개 걷기 프레임, 6개 손 흔들기 캡처 확인. 캡처는 무손실 WebP이며 모델 전체가 화면 안에 들어오는지 확인했습니다.
- 기존 미술관의 인물·자연 전시실에서 6종 로딩·이동·회전·정지·재생 확인. 이 PC에서 관찰한 표시값은 약 60 FPS. 낮은 사양 기기나 학급 전체 인원에 대한 보장은 아님.

## 이번 검수의 범위

현재 결과는 고정 6종 시제품과 미술관 시험 화면입니다. 실제 학급 접속자의 아바타 선택·동기화, 저사양 기기와 학급 전체 동시 표시 검증은 별도입니다. 원본에 없는 옆·뒤는 새로 설계한 형상입니다. 애니메이션은 팔다리 노드의 이동·회전 방식이며 스킨·본 리그나 곡선 경로의 발 접점을 고정하는 IK는 포함하지 않습니다.

최신 검수 증거는 `../../outputs/qa/avatar-lab/refined-six/`에 있습니다. `review.json`에 모델 해시와 검증 범위를 함께 기록합니다. `representative-six` 폴더는 이전 수정 단계의 기록입니다.


## Batch 24 — crab, octopus, ratsnake and viper (2026-11-09)

Rebuilt four current models and compared each with its original at equal front scale. The review camera now uses zero pitch for front, left, right and back; only the moving three-quarter view retains the illustrative pitch. Previously the snake front comparison was inadvertently tilted down by 0.18 radians.

- Crab: full-size closed claws, rounded eyes/stalks, six costume side appendages, short torso and source-shaped green back. Corrected mirrored arm pivots; Wave no longer rotates a sleeve around the opposite shoulder.
- Octopus: six source-shaped rounded front arms, two rear arms, attached mantle, and independently phased yaw of all eight arms during locomotion.
- Snakes: smooth closed hood contours, short limbless necks, closed resting coil mass and connected tails. Current source expressions remain unchanged. Glide maintains floor contact.
- Inspected original/front, both sides, back and movement at 0/25/50/75%. Loaded matching revisions in the actual local museum preview and observed movement, turning and stopping for each; UI reported 60 FPS with one avatar. This is not multiuser or class-scale performance acceptance.
- Targeted geometry checks passed for all four, including finite meshes/animation, floor contact, current export/source bytes, crab sleeve pivot containment and eight animated octopus arms. Existing manifold checks cover meshes named Solid, not every authored surface.

Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch24.json` and `batch24-geometry.json`. Front major-feature records now total 51; all 152 overall visual acceptances remain pending. Fine outlines, suction-cup relief, hood eye-bulge relief and coil/back finishing are explicitly still open. No new Gemini source files were changed.

## Batch 25 — cat, donut, fried egg and ramen (2026-11-09)

Four original sources were preserved. Cat side stripes were narrowed and rear torso stripes attached to the actual suit. Donut's duplicate front sprinkles were removed and the rear coating received sprinkles. Fried egg received a draped white with a distinct underside, a smooth yolk and surface-based artwork projection. Ramen received a continuously shaped bowl, dense supported face, separated toppings and a smoothed front wall that reduces face foreshortening in the museum.

The current revisions were compared with their originals, both sides, back and movement at 0/25/50/75%. Each was loaded, moved, turned and stopped in the local museum preview; the observed single-avatar rate was 60 FPS. This does not establish class-scale performance. Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch25.json` with 18 lossless WebP captures. Current technical evidence covers all 152 original models; the custom-six test now compares exported geometry attributes with current source geometry and checks ramen face triangle interiors against the ceramic wall. All six custom checks and the targeted fried-egg check passed.

Front major-feature records total 55. All 152 overall visual acceptances remain pending; remaining issues include cat ear seams, donut rear/glaze finish, egg cap contour and ramen topping detail/outline weights. Six new Gemini 2D avatars are separate and were not modified or included in these 152 model records.

## Batch 26 — octopus lower-body regression (2026-11-09)

The user correctly identified that the previous front review missed the lower-body silhouette. Six narrow separate shapes and a protruding mantle collar had replaced the original broad joined skirt and short central arms. Replaced the collar with a shallow shared mantle, widened the two central arm contours to the source cleft and rounded tips, and preserved eight independently animated arms. Added ray/surface probes at six original lower-body landmarks; the former arm-count-only check could not detect this defect.

Current revision `537ae9210d9f` was inspected against the original in front, left, right, back and movement at 0/25/50/75%. The same revision was observed loading, moving, turning and stopping in the local museum (single avatar, UI 60 FPS). Seven captures are lossless WebP. Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch26.json`. Targeted tests passed; overall acceptance remains pending because the head side seam and suction-cup relief still need finishing.

Interrupted work is explicitly preserved as drafts: bubble tea, bingsu and birthday cake now have new closed container meshes in `dessert-costumes.cjs`, but these are **not visually accepted**. Their previous proof hashes remain historical, and `unreviewedCurrentModelSha256` identifies the current unreviewed files. Cake face-edge/icing finish, the middle candle's projected remnant, and all three side/back/museum checks remain open. Do not use their passing geometry tests as visual approval. The original 152-model scope is unchanged; the catalog currently contains eight additional Gemini source-only avatars that were not edited here.

## Batch 27 — bubble tea, bingsu and birthday cake (2026-11-09)

Resolved the three interrupted dessert drafts. Original WebP files were unchanged. The new dessert module provides closed containers and source-sized faces: supported, staggered rear tea pearls; an ice base contained within the bingsu bowl; and a continuous two-tier cake surface with a single painted face. Removed cake candle remnants and replaced angular/doubled flame accents with smooth flames and surface-attached pale cores. Rear cake icing/filling outlines now continue around the volume.

Targeted technical checks passed for all three, including current exported geometry/artwork bytes, closed named solids, floor/anatomy checks, rear pearl spread and contact, below-rim ice containment, and candle/flame-core attachment. Compared all current originals/fronts, both sides, back and 0/25/50/75% hop phases. Matching revisions loaded, moved, turned and stopped in the local museum, showing 60 FPS for one avatar. The movement review camera now frames sampled whole-cycle bounds, avoiding clipped candle tips at the hop apex without changing the front comparison scale.

Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch27.json`, 11 lossless WebP captures, and targeted geometry archive. Front major-feature records total 58; all 152 overall acceptances remain pending. Lid highlights, rear ice/bean finishing and cake side paint/pattern transitions remain listed for finishing, together with class-scale performance. Catalog has 160 source avatars; the eight newly added Gemini 2D sources remain outside the original 152-model work scope.

## Batch 28 — gimbap, hamburger, ice cream and macaron (2026-11-09)

Kept all four original WebP sources. Gimbap now has a rounded lower contour, a pitched cut end with attached fillings, and one face painted directly on the roll. Hamburger has supported rear sesame and no duplicate face edge. Ice cream rear waffle ridges and cream strokes now touch the actual surface. Macaron has direct face painting, rear shell foot lines, and an overlapping neck that closes the observed head/torso gap.

Current exports passed four targeted checks, including closed principal solids, supported fillings/seeds/waffle ridges, macaron neck overlap, finite motion and export/source consistency. Inspected current originals/fronts, both sides, backs and four movement phases, plus local museum load/move/turn/stop (one avatar, observed 60 FPS). Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch28.json`, 18 lossless WebP captures. Front records total 62; overall acceptance remains pending for all 152. In particular, cream and macaron line endings on the sides remain visibly discontinuous and need another pass. No class-scale claim or Gemini source changes.

## Batch 29 — dessert side finishing follow-up (2026-11-09)

Followed up the defects found in batch28 rather than treating those captures as final approval. Ice cream rear curves now reach the side transition with tapered ends. Macaron shell/cream bands continue around the real surface using a costume-only strip of the unchanged source texture; no human face is copied to the rear. Fading the upper edge projection removes the dark top patch. The short connected neck remains.

Both current revisions passed targeted geometry/export tests and were inspected in equal-scale front comparisons, both sides, back, four movement phases and local museum load/move/turn/stop. Nine new lossless WebP proofs are in `outputs/qa/avatar-lab/rebuild-20261108/batch29.json`. Front records remain 62; all 152 overall visual acceptances remain pending. Fine side blending, cream relief and waffle spacing are still open, as is class-scale performance. The original 152 scope and eight separate Gemini source-only files are unchanged.

## Batch 30 — candy, cookie, dumpling and pudding (2026-11-09)

Added `snack-costumes.cjs` for four source-specific closed forms, preserving the four original WebP files. Candy now uses source-sized head dimensions, a short connected torso and sleeves, and only one wrapper per side. Removed the overlapping legacy wrapper geometry discovered in side view. Cookie has a source-shaped irregular contour without the thick double rim and nine surface-attached rear chips. Dumpling has a closed pinched crown, rear pleats and a broad shoulder connection. Pudding has rounded custard, an attached caramel cap and a continuous closed rear coating replacing disconnected oval drips.

The geometry checker now handles non-indexed closed meshes and checks candy wrapper duplication/head attachment, cookie chip contact and pudding coating contact/outward orientation. Four targeted tests passed with the current exported files. Original/front, both sides, back and four gait phases were visually inspected. The same revisions loaded, moved, turned and stopped in the local museum; single-avatar UI rate was 60 FPS. Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch30.json`, 18 lossless WebP captures and the current geometry archive.

Front major-feature records now total 66; all 152 overall visual acceptances remain pending. Open issues explicitly include wrapper side-edge outlines, cookie rear/suit shading, dumpling lower side paint patches and crown detail, pudding top highlights and side transitions, and class-scale performance. Original 152 scope retained; eight additional Gemini 2D source files remain untouched.

## Batch 31 — cheese, chocolate, popcorn and sushi (2026-11-09)

Preserved the four original images and rebuilt their closed costume forms in `packed-food-costumes.cjs`. Cheese now has a tapered wedge, geometric bite-outs, sloping top and supported rear dimples; its wearer and short neck meet the actual underside. Chocolate has a closed bar, attached rear tiles and continuous wrapper/foil. Popcorn has source-height packaging, a scalloped rim and irregular rear clusters. Sushi uses smooth rice with rim scallops, supported grains and surface-attached salmon strokes instead of radial rice ribs and floating marks.

Four current export/geometry tests passed. Source/front, both sides, back and four gait phases were inspected, with matching hashes loaded, moved, turned and stopped in the local museum. Eighteen captures were converted to lossless WebP with exact decoded RGBA verification. The single-avatar UI reported 60 FPS; class-scale performance is still unverified. Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch31.json` and its geometry archive.

Front major-feature records total 70; all 152 overall acceptances remain pending. Visible defects remain: popcorn's stretched side paint and weak rear kernel definition, sushi's pale hair/fillet seam and simplified rear rice, chocolate wrapper side flange, and cheese outline/shading. Popcorn also needs geometry optimization. These observations are explicitly not final visual approval. The eight additional Gemini source-only avatars remain outside this original-152 scope and were not changed.

## Batch 32 — popcorn crown and geometry follow-up (2026-11-09)

The first attempted shoulder-kernel arrangement flattened the front crown and was rejected after visual inspection. The retained model uses the original image's measured crown profile and fits actual kernel vertices inside that silhouette. Front-surface curvature and per-surface artwork falloff reduce the broad stretched lines. Small lobes use shared lower-density geometry, and the bucket/mound use reduced sampling. Exported geometry fell from 103,026 to 60,183 triangles (41.6%). The source image and short wearer are unchanged.

Current revision `c2d8e78af125` passed targeted geometry/export, crown-envelope, kernel-contact and small-lobe density checks. Original/front, left/right/back, four gait phases and local museum load/move/turn/stop were inspected. Seven exact-decoded lossless WebP captures are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch32.json`. The single-avatar museum displayed 60 FPS; this is not class-scale acceptance.

Overall acceptance remains pending. The enlarged front still loses some dark outlines at the crown's edges; side shoulders have a plain smooth region and a narrow paint transition; rear clusters still need stronger popcorn definition. These remaining defects are recorded rather than passed. Front records remain 70 and all 152 overall visual acceptances remain pending.

## Batch 33 — hot dog, pizza, rice ball and sandwich (2026-11-09)

Added source-specific closed forms in `filled-food-costumes.cjs`, keeping all four original WebP sources. Hot dog has a rounded costume volume and surface-attached rear sausage color instead of an angular extrusion and jagged vertex-color boundary. Pizza retains source slice/crust proportions and now has both attached small hands. Rice ball restores the original broad triangle and a continuous nori wrap; its upper edge follows the chin, fixing the mouth-crossing line seen in the museum. Sandwich uses two thin lettuce layers, tomato filling and contacting bread; occlusion prevents a second human face from appearing on the covered filling surfaces. Hot dog and sandwich no longer advertise waving with absent independent arms.

The first candidates were not accepted: side/front inspection exposed missing pizza hands, block-like hot-dog bread, an overly thick lettuce block, the nori/face intersection and duplicate face paint inside the sandwich. Each was corrected before current-hash evidence was recorded. Added checks for sausage-surface contact, pizza-hand attachment, nori underside continuity and face clearance, thin lettuce, rear-bread/filling contact and hidden-face suppression. Four targeted geometry/export/motion tests passed.

Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch33.json`, 18 exact-decoded lossless WebP captures. All four were inspected against their originals, in both side views, rear and four gait phases, then loaded/moved/turned/stopped at matching revisions in the museum. Single-avatar UI showed 60 FPS, not class-scale acceptance. Front major-feature records now total 74; all 152 overall visual acceptances remain pending. Explicit open issues include bun relief/side paint, pizza extrusion bands, uniform rice sides/rear grain placement and planar lettuce/plain rear bread. Original 152 scope retained and eight Gemini source-only additions untouched.

## Batch 34 — fish pastry, toast and tteokbokki (2026-11-09)

Added source-specific closed forms in `bakery-bowl-costumes.cjs` without changing the three original images. Fish pastry has rounded source contours, contacting fins and tail, rear scales, a short torso and raised hands joined through shoulders. Toast retains its source slice contour, with contacting rear crumb and original short limbs. Tteokbokki has a closed bowl and exposed sauce surface; reversing an inward-facing top fixed the missing face in the first candidate. It uses bodyless hopping.

Three targeted geometry/export/movement checks passed, including raised-hand attachment, rear crumb contact and outward food surface visibility through the rim. Source/front, left/right/back and four movement phases were inspected, followed by current-revision load/move/turn/stop in the museum. Eleven captures were converted to exact-decoded lossless WebP; evidence is `outputs/qa/avatar-lab/rebuild-20261108/batch34.json`. Single-avatar UI was 60 FPS; class-scale performance remains pending.

Front major-feature records total 77, with all 152 overall visual acceptances pending. Fish rear scales/side finish, toast side bands/plain rear and bowl lower paint/strong incline remain open. The museum perspective stretches the tteokbokki face; a separate rounded-face trial reduced that distortion but produced an unacceptable upright face protrusion in side view. That trial was rejected and the previously recorded model hash restored. No final acceptance is claimed. Eight Gemini source-only additions remain untouched.

## Batch 35 — apple, avocado, blueberry and orange (2026-11-09)

Added `orchard-costumes.cjs`, preserving all four original images. Apple retains its lobed source contour, full-size brown stalk/leaf and short wearer. Avocado now has the broad original cut face and rounded rear half; the invented torso and legs were removed, and its movement is a bodyless hop. Blueberry restores the large fruit and broad scalloped crown. Orange restores the round fruit, full-size leaf/stalk and rear pores attached to its curved surface. The first visual pass exposed crown paint overlap and a buried orange calyx; bending those parts over the fruit surface and applying occlusion corrected both.

Four targeted geometry/export/movement checks passed, including leaf/stalk contact and scale, blueberry crown contact/width, and avocado anatomy/half-fruit proportions. Source/front, both sides, back and four movement phases were inspected. The same four revisions loaded, moved, turned and stopped in the local museum at a displayed single-avatar 60 FPS. Eighteen exact-decoded lossless WebP captures are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch35.json`.

Front major-feature records total 81; all 152 overall visual acceptances remain pending. Open issues include outer ink fading, plain rear skin/leaf/suit shading, blueberry crown looking too plate-like from the side, soft calyx edges and class-scale performance. No final approval is implied by the geometry tests or front records. Eight additional Gemini source-only avatars are unchanged and outside the original-152 scope.

## Batch 36 — grape, mango, melon and peach (2026-11-09)

Added `bunch-soft-fruit.cjs` for four source-specific fruit models. Grape and melon source illustrations were edited with built-in image generation: the muddy melon eye/frown and grape's unhappy expression/stray fragment were cleaned, keeping the characteristic costumes, colors, short bodies and poses. A grape edit with background haze was rejected and a clean-alpha follow-up selected. Original backups, full prompts and lossless WebP candidates are in `outputs/avatar-lab/source-edits/`; selected 640px assets were integrated and their mesh source data rebuilt. Mango and peach source files were not changed.

Grape now has a source-arranged bunch, rear berries, attached stalk, short torso and held hands. Side inspection rejected excessive face/hand protrusion and rectangular hand sections; these were corrected, and duplicate face paint on berries suppressed. Mango preserves its asymmetry and full-size leaf with rounded short limbs; the buried leaf was moved over its supporting fruit. Melon has an irregular connected rind network sampled onto the actual fruit surface. A regular honeycomb candidate was rejected; low-density capped tubes replaced excessive detail. Peach preserves the pointed/lobed contour, attached collar leaves, rear crease/veins and small rounded hands without moving duplicate leaf fragments.

Four targeted geometry/export/movement checks passed, including grape face-depth/hand attachment and paint suppression, mango leaf/sleeve contact, melon net contact/density and peach leaf/arm separation. Equal-scale source/front, left/right/back and four movement phases were inspected, followed by matching-revision load/move/turn/stop in the local museum. Eighteen exact-decoded lossless WebP captures are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch36.json`. Single-avatar UI was 60 FPS; class-scale performance is still unverified.

Front major-feature records total 85; all 152 overall visual acceptances remain pending. Remaining defects include grape berry intersections/hand-chin finishing, mango leaf side shape and rear vein, melon net transition/rear wearer pattern, peach collar transition/flat leaves, and outer-ink/rear shading. These are explicit unfinished items, not final acceptance. The original-152 scope and eight Gemini source-only additions are unchanged.


## Batch 37 — remaining fruit silhouettes and connected suits (2026-11-09)

Rebuilt cherry, persimmon, pineapple, strawberry and watermelon in `remaining-fruit-costumes.cjs`. Sources are unchanged. Cherry retains its original legless hopping anatomy and attached animated sprig. Persimmon and strawberry calyces now wrap front and rear. Strawberry hood, short suit, sleeves and feet were reconnected after visual review exposed a neck gap and traced waist fragments. Watermelon cut flesh was trimmed inside the curved rind after side inspection exposed overlapping red stripes. Pineapple crown and surface-attached rear diamond pattern were rebuilt.

Current revisions: cherry `2257fe1a4ea9`, persimmon `7d07a07f8e60`, pineapple `babe9e12b65d`, strawberry `62127c6c3584`, watermelon `bfb6a924db38`. All five were directly compared to originals in front, left, right, rear and movement at 0/25/50/75%, then loaded, moved, turned and stopped in the actual local museum preview. Single-avatar UI observed 55–57 FPS; this does not establish class-scale performance. Twenty captures were saved as lossless WebP with exact decoded RGBA checks. Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch37.json`.

Targeted geometry/export/animation checks pass, including cherry anatomy and sprig attachment, front/rear calyx contact, strawberry suit connections, and side rays proving watermelon flesh stays inside its rind. All 152 current hashes match their technical records. The 90 front major-feature records are not finished-model approvals: overall acceptance remains pending. Remaining issues include faint front contour ink, paint-to-side transitions, thin/flat rear foliage, rear suit detail, pineapple grid continuity and strawberry seed spacing. Original 152 scope is unchanged; eight concurrent Gemini additions are untouched.

## Batch 38 — camera, eraser, key, lock and sneaker (2026-11-09)

Added `source-object-costumes.cjs`. Camera has source-sized case/lens/flash and connected short suit; eraser keeps its tall sleeve and tiny wearer. Key has an actual open bow, attached teeth and hands with legless hopping. Lock has a continuous open shackle and short connected suit. Sneaker uses a single closed upper and varying-width sole, supported laces and connected shoulder joins. Visual review rejected intersecting dome surfaces, flat slab sole ends, jagged rear toe colors and floating lace/hand tips; the current model repairs those defects.

Current revisions: camera `10b5a076f243`, eraser `2a11078ee63a`, key `ab14ec422c07`, lock `7854acac2c6b`, sneaker `743f8abf2fb9`. Equal-scale original/front, left/right/rear and 0/25/50/75% movement were inspected, followed by matching-revision load/move/turn/stop in the actual local museum. UI displayed 56–57 FPS for one model, not class-scale proof. Twenty-five captures were converted to lossless WebP with exact decoded RGBA/dimension checks. Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch38.json`.

All five targeted checks pass, including case/lens/flash attachment, visible eraser torso proportion, actual key/shackle holes, shoe lace support and shoulder contact, finite animation and export/source identity. All 152 current model hashes match technical records. Ninety-five front major-feature comparisons are recorded, but all overall acceptances remain pending. Rear materials/ink, sleeve/foot finishing, shoe collar/tongue and sole edges, and shoe geometry cost remain unfinished. Original source assets and eight Gemini additions were not edited.

## Batch 39 — gift, lamp and newspaper (2026-11-09)

Extended the object module with a source-sized gift box/lid, attached bow/knot and short green wearer; hollow lamp shade, supported head and connected short brown suit; thin newspaper with shaped folded corner and attached rear print. All three source images remain unchanged. The first lamp draft failed side inspection with an overprojecting face and collar. It was rejected, the head was moved underneath the shade, and the shade hem was opened around the forehead. Fixed inverted shade winding, duplicate front seams and exposed skin-colored hair edges. Museum perspective revealed a vertical face split caused by the gift's raised ribbon; removing the front ribbon overlay restored a continuous painted face, and all affected captures were replaced.

Current revisions: gift `989d5d26f519`, lamp `3ba7f80aaa6e`, newspaper `7475e136c078`. Current source/front, both sides, rear and four movement phases were directly inspected, followed by load/move/turn/stop in the actual local museum. Single-avatar UI was 56–57 FPS; class-scale performance is not established. Twelve captures were converted to lossless WebP and decoded pixel/dimension identity checked. Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch39.json`.

Three targeted checks pass, including continuous gift face support and lid/knot/bow attachment, lamp head/collar/body contact and eye/forehead visibility without excess forward projection, and newspaper corner silhouette/fold attachment. The original 152 current model hashes and technical records match. Ninety-eight front major-feature comparisons are recorded; none of these counts represents final visual acceptance. Remaining issues include the gift's simplified rear bow folds and wrapping highlights; lamp top opening, hem arch/ink and side face transition; newspaper edge/fold curvature and original eye styling; rear suit shading and foot contours. These remain explicit unfinished work. Eight concurrent Gemini additions and unrelated work were untouched.

## Batch 40 — pencil, radio, television and watch (2026-11-09)

Extended the object module with a hexagonal pencil barrel, scalloped wood/graphite, tilted circular ferrule and rounded eraser; source-sized radio case, speakers/tuner and supported antenna; TV screen/case, controls and antenna ears; and a round watch case, crown, separate straps and four contacting lugs. All four source images remain unchanged. Pencil artwork rejection at shared rings was corrected. Watch rear inspection rejected a full-length strap and long gold lugs covering the back; splitting those parts exposes the actual rear cover.

Current revisions: pencil `e1a2991aabe0`, radio `d94eecac53e6`, television `8efdc942762f`, watch `3f78d4ab29c8`. Equal-scale source/front, left/right/rear and four movement phases were inspected. Matching revisions loaded, moved, turned and stopped in the local museum. Watch uses legless hopping. Single-avatar UI displayed 56–59 FPS; this is not class-scale performance evidence. Eighteen captures were converted to lossless WebP with exact decoded RGBA/dimension identity. Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch40.json`.

Four targeted geometry/export/movement checks pass, including pencil ring and limb contacts, radio antenna/knob/speaker contact, TV screen/antenna contact, watch crown/strap contact and rear rays proving the cover remains exposed. All 152 current model hashes match technical records. The 102 front major-feature records remain partial reviews; all overall visual acceptances are pending. Pencil ferrule stippling and eraser edges, radio antenna/side materials, TV rear profile/screen side edge, watch strap/lug curvature, contour ink and rear shading still need work. No source edits, Gemini additions, unrelated files, commit or deployment were made in this batch.

## Batch 41 — mitten, lucky pouch and umbrella (2026-11-09)

Rebuilt the mitten/thumb and scalloped cuff with a short hidden waist, contacting feet and reverse knit details. Replaced the pouch's bowl-like cut top with the source scalloped gathered cloth, short wearer and a supported tie/bow. Side inspection exposed a floating drawstring; its centerline now follows the actual cloth surface, and the knot, loops and hanging ribbon follow their supporting cloth. Umbrella retains eight closed panels and its original pose, with corrected canopy hem/top, original painted highlights, restored tip, continuous face/hood front and a sleeve in front of the handle. Original images were not changed.

Current revisions: mitten `ccf360f55e94`, pouch `274416f8ea93`, umbrella `1cb3d108e301`. Source/front, both sides, rear and four movement phases were directly inspected. The same revisions loaded, moved, turned and stopped in the actual local museum at a displayed single-avatar 56–57 FPS. Twelve screenshots were saved as exact-decoded lossless WebP. Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch41.json`.

Two targeted collection checks and all six custom-model checks pass. Added meaningful checks for mitten thumb/cuff/feet contact and stitch geometry cost, source pouch-top landmarks and drawstring-center contact, and umbrella tip support plus hand-over-handle ordering. The first drawstring test sampled tube outer vertices along steep cloth folds; radial distance there was not a valid separation measure. It now checks the tube centerline against the support, with a tighter threshold smaller than the cord radius. The final line is approximately 0.011 world units from cloth. Mitten geometry was reduced from 135,192 to 49,744 triangles after replacing excessive small-thread geometry.

All 152 current model hashes match technical records. Front major-feature comparisons remain partial rather than finished-model approvals. All overall visual acceptances remain pending. Cuff stippling and thumb pattern continuity, pouch bow/outer ink and gathered-top depth, umbrella doubled rim/hood edge/hook finish, and rear material shading remain open. Class-scale performance is unverified. Eight Gemini source-only additions and unrelated work were untouched; no commit or deployment was made.

## Batch 42 — baseball, basketball, bowling and soccer (2026-11-09)

Revised the spherical sports costumes with actual outline shells and vertex toon shading. An initially attractive full-head source projection was rejected after side views exposed zipper-like smearing. The final models project only the original face onto supporting surfaces; seams and panels remain real three-dimensional geometry. Sources were not edited.

Baseball has a continuous red seam and 64 larger stylized stitches (not a regulation stitch-count claim). Basketball uses original front seam landmarks, a continuous rear path and two perpendicular great circles; intersections preserve eight panels. Its highlight follows the spherical surface. Soccer retains 12 pentagons and 20 hexagons, with the face supported by ball/panel surfaces instead of jagged panel clipping. Replacing duplicated borders with 90 shared edges reduced its triangles from 92,440 to 53,976. Bowling has curved, surface-fitting red bands, a continuous hood, a short source-shaped suit and foot, and legless hopping.

Current revisions: baseball `056065a1ff37`, basketball `8a527dfb6d4d`, bowling `30ee448e513d`, soccer `6ac6d35ad79c`. Source/front, both sides, rear and four movement phases were inspected, then matching revisions loaded, moved, turned and stopped in the actual local museum. Single-avatar UI displayed 56–57 FPS; class-scale performance remains unverified. Fourteen captures were converted to lossless WebP with exact decoded RGBA checks. Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch42.json`.

All four targeted geometry/export/animation checks pass. Added checks prevent full-ball source projection, verify face support, spherical scale, the outline shell, seam topology, 32 soccer panels and 90 shared edges, and bowling band/body contacts. These are technical regressions, not visual approval. Stitch finish, source panel/seam pose, highlight/ink weight, shadow faceting, bowling pin/hood transitions, surface-only finger holes and rear suit shading remain open. All overall visual acceptances remain pending. Eight Gemini source-only additions and unrelated work were untouched.

Pattern references: [NBA official eight-panel description](https://pr.nba.com/wilson-nba-global-partnership/), [Mathcurve spherical seam construction](https://mathcurve.com/courbes3d/couture/couture.shtml), [Dartmouth soccer geometry](https://math.dartmouth.edu/~doyle/docs/soccer/soccer.pdf), and [Rawlings official ball reference](https://www.rawlings.com/product/ROMLB.html).

## Batch 43 — cloud, clover and rainbow (2026-11-09)

Added `soft-theme-costumes.cjs`. Cloud is a continuous closed costume rather than visibly separate bubble meshes. Shared center/rim normals were smoothed and a surface contour replaced an outline shell that produced unwanted side loops. Clover now has four rounded leaf volumes, a supported face, a central connection that closes the gap beneath the face, and rear veins fitted onto actual leaf surfaces. Rainbow has the original tall seven-color arch, a connected shallow-front hood and a continuous costume gradient on the back. Enlarged front inspection exposed arch/face intersections; adjusting the hood surface removed the duplicate forehead/cheek fragments without projecting the face far forward. All three have rebuilt short connected suits and limbs. Source illustrations are unchanged.

Current revisions: cloud `625f8cf317eb`, clover `1689eff0ffc3`, rainbow `57d866782081`. Current original/front, both sides, rear and 0/25/50/75% movement were directly inspected, then each matching revision was loaded, moved, turned and stopped in the local museum. The UI displayed 57 FPS with one avatar; this does not establish class-scale performance. Twelve captures were converted to exact-decoded lossless WebP. Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch43.json`.

Three targeted checks pass, covering closed main surfaces, short connected wearer anatomy, source cloud lobe landmarks, the clover under-face connection, and rainbow face visibility/depth relative to the arch. The torso check initially exposed Catmull-Rom overshoot above the intended neckline; extra top contour controls and a shortened lower contour fixed the geometry instead of relaxing the limit. Triangle counts are 44,419 / 87,299 / 71,189. Sampling was reduced after the first outline draft became unnecessarily expensive.

These remain partial front reviews rather than completed-model approvals. Open items include cloud front ink and side paint transition/radial rear shading; clover central rear overlap, leaf/face outline weight and geometry cost; rainbow rectangular side section, inner color transition, plain rear hood and export size; and sleeve/foot contour finishing. All 152 overall visual acceptances remain pending. Eight concurrent Gemini additions and unrelated work were untouched; no commit or deployment was made.

## Batch 44 — moon, star and sun (2026-11-09)

Added `celestial-costumes.cjs`. Moon uses authored outer/inner curves and a rounded cross-section, restoring the cutout and missing lower horn. Star uses the original rounded five-tip silhouette with curved front/back instead of sharp extruded points. Sun uses the original irregular ray outline and a rounded face disk. A low-resolution radial ray volume left contour ends exposed; it was rejected in favor of a dense closed perimeter with small bevels. Duplicate disk-border artwork was suppressed. Short connected suits and limbs were rebuilt without changing the original illustrations.

Museum rear inspection exposed an unnecessary neck bead below the star. These three costumes already connect directly, so they now opt out of the generic neck join. Added front/back ray tests verify actual overlapping head/torso depth at the neckline, and a regression prevents the bead from returning. All affected models were rebuilt, and all front, side/rear, movement and museum captures were replaced with final-revision evidence.

Current revisions: moon `1e1d06f9f2d2`, star `7f4fd797ed52`, sun `5236427a9340`. Triangle counts: 42,401 / 30,800 / 36,110. Three targeted geometry/export/animation checks pass, including the source moon cutout/lower horn, rounded star tip landmarks, source solar ray landmarks, closed surfaces, connected short limbs and real head/torso depth overlap. Original/front, both sides, rear and 0/25/50/75% movement were directly inspected. Matching revisions loaded, moved, turned and stopped in the actual local museum at 56–57 displayed single-avatar FPS. Class-scale performance remains unverified.

Twelve exact-decoded lossless WebP captures are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch44.json`. Front major-feature review remains partial, with all overall visual acceptances pending. Moon side-depth curvature/rear shading, star side paint transition and lower-point finish, sun ray side thickness and rim weight, rear materials and sleeve/foot contours remain unfinished. Eight concurrent Gemini additions and unrelated work were untouched. No commit or deployment was made.

## Batch 45 — crown, lightning and music note (2026-11-09)

Added `symbol-costumes.cjs`. Crown now has an open wall, fitted band, five source-positioned front pearls with the center highest, supported jewels, a rounded hood and short wearer. Rear peaks were lowered so extra rear decorations do not replace the original front silhouette. Front/rear jewels were fitted to the actual wall. Physical hood/pearl outlines were added; reducing unnecessary small-gem and hood subdivisions brought the model from 103,160 to 65,998 triangles.

Lightning has the original bolt outline and gold inset, a restored short wearer behind the lower diagonal, the original single visible right sleeve and a continuous rear costume gradient. Music note has the original offset round hood, long stem, curled flag and short wearer centered under its face. Both source expressions are preserved. All three source files are unchanged.

Current revisions: crown `e614419e8127`, lightning `075fe13c779b`, music note `8b2e59257f0e`. Triangle counts: 65,998 / 19,555 / 30,231. Source/front, both sides, rear and four walking phases were directly inspected, followed by matching-revision load/move/turn/stop in the actual local museum. Single-avatar UI displayed 57 FPS, not evidence of class-scale performance. Twelve exact-decoded lossless WebP captures are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch45.json`.

Three targeted geometry/export/animation checks pass, including closed solids, short connected wearer/feet, crown wall/band/hood and front-pearl attachment, highest central crown pearl, lightning visible torso and supported face, no invented second sleeve, and music-note stem/hood attachment plus the clear flag opening. These checks do not establish visual completion. Hood/pearl ink and gem facets, bolt tip/edge weight, foot and sleeve contour finish, music-note side transition, rear materials and class-scale performance remain pending. Eight concurrent Gemini additions and unrelated work were untouched; no commit or deployment was made.

## Batch 46 — octopus surface and arm follow-up (2026-11-09)

Removed the flat hood-perimeter tube that drew a dark meridian in both side views. The closed front/back hood now shares boundary normals and uses an inverted silhouette shell; the source's outer painted border fades before the surface edge. The human face is unchanged. Bent arm meshes now sweep between the two sides of the original contour, with shared closed-curve tangents at rounded tips. This removes the folds produced by radial fans inside bent arms. Front arms curl into separate depth layers while keeping the original broad lower-body silhouette. A continuous lower-body palette replaces fragmented projected cleft marks at moving roots. Seventy-six small relief suckers are fitted to the actual six visible arm surfaces and follow their respective animation groups.

Current revision `505e835dbe76`, 62,368 model triangles. Original/front, both side views, rear and four movement phases were directly inspected. The same revision was loaded, moved, turned and stopped in the actual local museum, including separate front/left/right/rear captures. Displayed single-avatar rate was 56–57 FPS; class-scale behavior is unproven. Ten exact-decoded lossless WebP captures and matching hashes are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch46.json`.

The targeted geometry/export/animation test passes. New checks cover joined hood normals, absence of a flat meridian tube, distinct arm depth layers, 76 actual sucker/support contacts at four motion phases, and the existing eight animated arms, closed surfaces, source lower-body landmarks and floor contact. The original source image and every other model file remain unchanged in this batch. Rear head/mantle intersection, simplified lower-body highlights, regular sucker spacing and rear arm finish remain open; this is not an overall completed-model approval. All 152 overall visual acceptances remain pending. No commit or deployment was made.

## Batch 47 — cactus, maple leaf and snowman (2026-11-09)

Added `seasonal-costumes.cjs`. Cactus now follows the original tapered plant silhouette with asymmetric curved branches, separate lower ribs, six-petal flower and short feet. Rear ribs and small spines are fitted to its actual surface. A concave lower-rib notch made the first radial trunk draft fold across the human face; the trunk and lower ribs were separated to remove that defect while retaining the silhouette.

Maple leaf has the original lobe outline, a closed gently padded blade, a face directly supported by the leaf, fitted rear veins and a short wearer. Constrained polygon triangulation with shared adaptive edge splits replaces radial fan folds. A thin rounded edge and shallow central dome avoid a thick row of inflated lobes in side views. Uniformly expanded silhouette shells replaced normal-offset shells whose skinny triangles could invert at notches. Snowman uses two overlapping snowballs with no human torso, arms or legs, fitted coal ornaments/buttons, a rounded carrot root and a contour along the true snowball intersection. Its original smiling human face is preserved. Front paint occlusion by inverted silhouette shells was disabled locally after it clipped the lower face in an intermediate draft.

Current revisions: cactus `6c87c7f23bb9`, maple leaf `fe96012853d1`, snowman `c371195db958`. Model triangles: 70,930 / 67,261 / 25,805. Three targeted geometry/export/animation checks pass, including unfolded front triangles, real branch/trunk depth overlap, flower/foot contacts, original leaf lobes, short wearer, rear-vein surface contact, snowman anatomy, supported ornaments, unoccluded human-face paint and floor contact.

Original/front, left, right, rear and four motion phases were directly inspected. Each matching revision was loaded, moved, turned and stopped in the local museum at displayed single-avatar 56–57 FPS. This does not establish class-scale performance. Twelve exact-decoded lossless WebP captures are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch47.json`. Source images and unrelated models are unchanged. Cactus branch/flower/spine details and lower-rib/foot finish, maple ink/notch and limb finish, snowman coal/carrot/join finish remain pending. Overall visual acceptance remains pending for all 152 models. No commit or deployment was made.

## Batch 48 — cherry blossom, rose and sunflower (2026-11-09)

Added `blossom-costumes.cjs`. Cherry blossom now has five source-shaped notched petals, the original smiling face on an opaque support and a short pink wearer. A real hidden join fills the triangular gap below the face and overlaps both head and torso. Rose has authored layered petals, a supported face, rear calyx, collar leaves and short wearer. Concave inner petals use constrained triangulation and shared interior-edge splits so the front cannot fold across its paint or collapse against the rear along rim-to-rim diagonals.

Sunflower has sixteen source-positioned petals, a seed disk, attached rear calyx/sepals and short green wearer without invented human sleeves. The torso originally protruded through the lower petals; its geometry and leg pivots were moved together behind them. Source-painted petal borders fade before their physical edges, preventing mismatched border fragments. All three original source files remain unchanged.

Current revisions: cherry blossom `84c4d0065458`, rose `f97a9cef7439`, sunflower `fe7821f1a59c`. Model triangles: 69,591 / 103,969 / 106,608. Three targeted geometry/export/animation checks pass. Added checks cover non-folding petal surfaces, closed shells, short connected wearer/feet, cherry blossom's actual head-to-body depth overlap, rose calyx/collar attachment, all sixteen sunflower petal contacts and eight sepal-root contacts, lower petals covering the green wearer and absence of human sleeves.

Original/front, both sides, rear and four motion phases were directly inspected. Matching revisions were loaded, moved, turned and stopped in the actual local museum, displaying 56–57 single-avatar FPS. Twelve exact-decoded lossless WebP captures are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch48.json`. Petal contour/highlight transitions, sleeve/foot paint boundaries, simplified rear flower structures and class-scale performance remain pending. This is partial front-feature progress, not overall visual approval. Eight Gemini additions and unrelated changes were untouched; no commit or deployment was made.

## Batch 49 — folded paper airplane (2026-11-09)

Compared balloons, guitar and paper airplane against their sources; paper airplane had the largest immediate front mismatch and was rebuilt first. Added `paper-plane-costume.cjs` with four thin closed panels sharing physical 3D fold vertices, front/rear rounded edge strips, the original hood placement and source face. The short wearer and leg pivots sit behind the front wing. A tapered hidden support joins hood and torso without the initial round neck bead. Front paper colors are explicit and do not inherit the dark side shading of averaged panel normals. Source images, balloons and guitar remain unchanged in this batch.

Current paper airplane revision `5940ee579a31`, 61,340 model triangles. The targeted geometry/export/animation check passes, including real hood/support/torso depth overlaps, thin closed panels, folded depth, source wing/tail/hood landmarks and front wing covering the wearer. Source/front, both sides, rear and four motion phases were directly inspected. Matching revision load/move/turn/stop was verified in the actual museum at displayed single-avatar 56–57 FPS. Seven exact-decoded lossless WebP captures are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch49.json`.

Hood rim weight, sleeve/foot contours and rear hood/neck finish remain open, as does class-scale performance. This is partial front-feature progress; all overall visual approvals remain pending. Eight Gemini additions and unrelated work were untouched; no commit or deployment was made.

## Batch 50 — balloons and guitar (2026-11-09)

Added `handheld-theme-costumes.cjs`. Balloons now has eight physical balloons, knots and cords, a joined blue hood, short wearer and red boots. Original painted highlights are restricted to forward-facing balloon surfaces so neighboring colors do not stretch across the sides. The upper hood fills the gap above the human forehead without the initial rear bubble. Head and holding arms follow the body together to keep all cords inside the palms throughout idle, walking and wave clips.

Guitar now has a source-shaped wooden costume, front/rear binding, short feet, connected playing arms and a separate held instrument with a real open soundhole, bridge, nut, six strings and tuning pegs. Shared-edge surface refinement fixes corner-interpolated paint masks that initially faded the original human face. Tapered arm depth connects shoulders to the costume and hands to the instrument. Source images remain unchanged.

Current revisions: balloons `6c492d8a326e`, guitar `c4dfda06f202`. Model triangles: 72,629 / 107,762. Two targeted geometry/export/animation checks pass, including actual cord/palm contact across all clips, upper-hood overlap, short connected wearer, shoulder/hand attachment, six string endpoints, open soundhole and opaque original facial paint. Source/front, both sides, rear and four walking phases were directly inspected; matching revisions loaded, moved, turned and stopped in the actual museum at displayed single-avatar 56–57 FPS. Ten exact-decoded lossless WebP captures are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch50.json`.

Balloon contour/highlight and overlap edges, cuff/suit/boot boundaries, guitar arm-root paint and binding, simplified instrument details and rear finish remain pending. Class-scale performance is unproven. This is partial front-feature progress, not overall visual approval. All 152 overall visual acceptances remain pending. Eight Gemini additions and unrelated changes were untouched; no commit or deployment was made.

## Batch 51 — tulip source silhouette (2026-11-09)

Added `source-tulip-costume.cjs`. Four closed petal patches form a rounded cup with the source's two tall lateral tips, low front opening and highest rear central tip. Original facial paint stays directly on the supported cup. Analytic cup normals prevent end-cap normal averages from pulling front paint onto the side seam. Broad leaves, a short yellow wearer and feet follow the source contours. The calyx was moved behind the lower petals and reduced after enlarged front and side inspection revealed a protruding green triangle and rear bump.

A complete inverted thick-wall shell initially put its inner wall in front of the lower illustration, creating dark wedges. The silhouette shell now uses outer cup surfaces only; a ray-based regression check protects the lower front artwork. Leaf and limb paint fades before the physical perimeter to reduce doubled outlines. The original source image remains unchanged.

Current revision `ae76c0b91494`, 100,340 model triangles. The targeted geometry/export/animation test passes, including source tip/contour landmarks, actual cup depth, analytic side normals, calyx/cup contact without frontal intrusion, short connected wearer and lower-front artwork unobstructed by ink. Final source/front, both sides, rear and four movement phases were directly inspected. Matching-revision museum load/move/turn/stop displayed 60 single-avatar FPS. Seven exact-decoded lossless WebP captures are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch51.json`.

Upper rim thickness, side paint transitions, limb/leaf edge weights, simplified rear petals/calyx and class-scale performance remain pending. All overall visual acceptances remain pending; this is partial front-feature progress. Eight Gemini additions and unrelated work were untouched; no commit or deployment was made.

## Batch 52 — bell pepper, pumpkin and tomato (2026-11-09)

Added `round-vegetable-costumes.cjs`. Pepper and pumpkin now retain their original top silhouettes and thick curved stalks instead of truncated tops with thin stems. Tomato has its original asymmetric rounded outline, winking face and a surface-fitted pointed calyx. All three have short source-shaped wearers and feet; arm roots enter the torso. Pepper/pumpkin side and rear surfaces have longitudinal recesses, with three/five rear groove lines fitted to the actual solid. Original facial artwork and source files remain unchanged.

The first stem/calyx draft used radial fans, which folded inside concave contours. New `rounded-contour-solid.cjs` uses constrained triangulation with shared interior edge splits and closed rounded surfaces. These folds are now covered by a regression check. Surface contact checks also caught and fixed the pumpkin stalk's shallow attachment. Horizontal-normal paint falloff restores upper/lower frontal rib details while fading toward the sides; perimeter fading reduces doubled source outlines.

Current revisions: pepper `859eb0d2cc1f`, pumpkin `2aa40f1ba4cc`, tomato `f78e58c5050c`. Model triangles: 59,052 / 62,552 / 54,996. Three targeted geometry/export/animation tests pass, including non-folding stem/calyx fronts, source top landmarks, actual head/torso/stalk/arm depth overlaps, short wearer, foot contact and rear-groove surface contact. Final source/front, both sides, rear and four walking phases were inspected; matching-revision load/move/turn/stop was verified in the actual museum at displayed single-avatar 56–57 FPS. Thirteen exact-decoded lossless WebP captures are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch52.json`.

Stem/calyx edge shading and side profiles, limb outline weights, side paint transitions, rear detail and class-scale performance remain pending. This is partial front-feature progress, not overall visual approval. Eight Gemini additions and unrelated work were untouched; no commit or deployment was made.

## Batch 53 — carrot, radish and eggplant (2026-11-09)

Added `root-produce-costumes.cjs`. Carrot and radish now use their complete original tapered costume outlines, three scalloped leaves with curved depth and rear midribs, connected small sleeves and short feet. Eggplant now retains the original asymmetric purple silhouette, thick curved stem, three-pointed front calyx, two surface-fitted rear leaves and small feet. Generic torsos and neck joins were removed; the vegetables themselves are the costume. Original faces and source files remain unchanged.

Arm pivots and roots enter the costume so waving cannot peel the sleeves away. Closed constrained leaf/calyx solids avoid folded surfaces, and head rotation is coupled to the body to keep the short limbs attached. New regression checks cover source contour/crown landmarks, rounded depth, absence of extra torsos, crown folds and actual limb-surface overlap in Idle/Walk/Wave at four phases.

Current revisions: carrot `ad57613538d1`, radish `b81e7fb00941`, eggplant `7be47a5adf54`. Model triangles: 70,881 / 76,059 / 46,657. All three targeted geometry/export/animation tests pass. Enlarged source/front, both sides, rear and four walking phases were directly inspected. Matching-revision load/move/turn/stop was verified in the museum at displayed single-avatar 56–57 FPS. Thirteen exact-decoded lossless WebP captures are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch53.json`.

Leaf/calyx perimeter shading, limb edge weights, side paint transitions, simplified rear skin detail and class-scale performance remain pending. This is partial front-feature progress, not overall visual approval. Eight Gemini additions and unrelated changes were untouched; no commit or deployment was made.

## Batch 54 — potato, sweet potato and mushroom (2026-11-09)

Extended `root-produce-costumes.cjs` with original potato and sweet-potato silhouettes, original facial expressions, attached small limbs and no extra torso. Eight/seven irregular rear skin marks are fitted patches on the actual solids. The prior carrot/radish/eggplant GLBs were rebuilt and verified byte-identical to batch 53 after the shared module extension.

Added `mushroom-costume.cjs`: a tilted rotational dome, cream underside, 16 radial gills, six rear spots and rounded face hood with a short wearer. Rear patch winding was corrected after visual inspection found invisible spots. A Catmull-Rom undersurface overshoot was clamped to keep the cream liner outside the red solid. Face paint is excluded from the cap. Museum inspection revealed that an intermediate tapered chin flattened the mouth from the actual viewing angle; the final hood keeps its rounded depth, with the torso, arms and feet aligned beneath it. Original source images remain unchanged.

Current revisions: potato `4351d238ed40`, sweet potato `e0521fb0e1d0`, mushroom `0d602d72b78c`. Model triangles: 34,251 / 55,645 / 132,162. Three targeted tests pass, including source landmarks, cap/hood/body contacts, unobstructed forehead, short body, rear patch direction/contact and actual limb overlap through all clips at four phases. Final source/front, both sides, rear and four walking phases were inspected. Matching-revision museum load/move/turn/stop was observed at single-avatar 56–57 FPS. Thirteen exact-decoded lossless WebP proofs are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch54.json`.

Mushroom cap-rim/forehead seam and model density, limb outline weights, side paint transitions, simplified rear details and class-scale performance remain pending. All overall visual acceptances remain pending. The catalog now contains 163 sources because three more source-only additions arrived during this work; the original 152-model scope is unchanged. New source additions and unrelated work were untouched. No commit or deployment was made.
## Batch 55 — broccoli and corn (2026-11-09)

Added `vegetable-canopies.cjs`. Broccoli uses three original scalloped crowns, a rounded branch hood and internal bridge, short suit and attached small limbs. Corn uses one continuous kernel-relief cob carrying the original face, four closed curved husk leaves fitted to the cob/cup surface and short feet, without a generic torso. Leaf depth smoothing removes sharp depth jumps while keeping paired closed surfaces. Source images are unchanged.

Revisions: broccoli `3ac1c310aeae` (115,063 triangles), corn `218a9e72b4a4` (118,054). Both targeted geometry/export/animation tests pass. Source/front, both sides, rear and four walking phases were inspected, followed by matching-revision museum load/move/turn/stop at displayed single-avatar 56–57 FPS. Ten exact-decoded lossless WebP proofs are in `outputs/qa/avatar-lab/rebuild-20261108/batch55.json`.

Broccoli branch/face ridges and rear transitions, corn side husk bulge and perimeter waviness, side artwork transitions, density and class-scale performance remain pending. This records major-feature progress only; neither model has final visual approval. The original 152-model scope and 11 source-only additions remain separate. No commit or deployment was made.

## Batch 56 — dice (2026-11-09)

Added `dice-costume.cjs`: a continuous rounded box whose three-dimensional faces match the source illustration's stylized perspective, replacing a square block with an apparent top/right face painted on its front. Original expression and top-five/right-four pips remain on those actual surfaces; rear-six, left-three and bottom-two pips are outward, surface-fitted patches. The short source-shaped wearer and limbs are positioned beneath the tilted cube. Source image unchanged.

The cube's single convex surface does not use the low-resolution overlap mask, which produced stripes on its steep top plane. Exported outlines use inverted triangle winding. Regression tests verify original face/pip/silhouette landmarks, true depth, short torso, cube/body physical overlap, hidden pip counts and attachment, and limb contacts through Idle/Walk/Wave at four phases. The initial contact sample was outside the rounded cube's silhouette; an actual junction sample at source (300,423) verifies the overlapping depth intervals.

Revision `57a3eb463da9`, 56,864 triangles. Targeted geometry/export/animation test passes. Source/front, both sides, rear and four walking phases were directly inspected; matching-revision museum load/move/turn/stop was observed at single-avatar 56–57 FPS. Seven exact-decoded lossless WebP proofs are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch56.json`.

Sleeve/foot outline weights and neck seam, oblique softness of source-painted pips, final visual acceptance and class-scale performance remain pending. No original source, new Gemini source-only addition or unrelated work was changed. No commit or deployment was made.

## Batch 57 — trophy (2026-11-09)

Added `trophy-costume.cjs`: original curved cup and thick rolled rim, curved handles with rounded ends, short pedestal, bent sleeves, wood base and small feet. The original face remains on the actual cup surface; source image unchanged. Bent sleeves use constrained closed triangulation rather than a radial fan across the concave contour. Exported outlines use reversed winding, including a sequential index for the nonindexed wood-base mesh.

Revision `46aefdcb6bf7`, 157,428 triangles. Targeted geometry/export/animation test passes, including source face/cup landmarks, cup/rim/stem/base overlap, handle contact and limb attachment throughout Idle/Walk/Wave at four phases. Source/front, both sides, rear, four walking phases and matching-revision museum load/move/turn/stop were directly inspected at displayed single-avatar 56–57 FPS. Seven exact-decoded lossless WebP proofs are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch57.json`.

Arm inner-edge shading, handle/rim artwork transitions and contour weights, simplified rear finish, model density and class-scale performance remain pending. This is major-feature progress, not final visual approval. Original sources, new Gemini additions and unrelated work were untouched. No commit or deployment was made.

## Batch 58 — banana (2026-11-09)

Reworked `banana-model.cjs` around the original curved fruit silhouette and four broad folded peel contours. Closed constrained peel solids have ivory linings and yellow outer surfaces, curved depth and warm perimeter lines. The original face now shares the crown's projected surface; removing the overlapping face decal eliminated the jagged hair boundary. The pale fruit/ivory lining color distinction remains unchanged. Front peel roots were moved inward to physically enter the crown/lower costume, and the hidden right-foot root was extended for reliable contact during the planted gait. Source image unchanged.

Revision `4120c630b3fb`, 79,091 triangles. All six custom-model geometry/export/animation tests pass. Banana checks now verify nonfolding peel fronts, actual neck-to-crown/body contact, all four peel roots and limb contacts across Idle/Walk/Wave. Facial support checks sample the human-face region of the now whole-crown artwork mesh. Source/front, both sides, rear, four walking phases and matching-revision museum load/move/turn/stop were inspected at displayed single-avatar 56–57 FPS. Seven exact-decoded lossless WebP proofs are in `outputs/qa/avatar-lab/rebuild-20261108/batch58.json`.

Rear neck junction, peel perimeter shading, source outline weights, simplified rear/lower-tip transitions and class-scale performance remain pending. This is major-feature progress only; all overall visual acceptance remains pending. New source-only additions and unrelated work were untouched. No commit or deployment was made.

## Batch 59 — rocket (2026-11-09)

Added the rocket branch of `flight-costumes.cjs`: one continuous closed hull includes the red nose and blue lower bands, four physically connected curved fins and a volumetric flame with a fitted rear yellow core. Original face and front artwork remain on the actual surfaces. Exhaust scales about its anchored nozzle while the body floats; no human limbs were added. Indexed hull geometry reduces the export to 3.2 MB without reducing its shape.

Revision `dbe588bf3bd0`, 99,773 triangles. Targeted geometry/export/animation tests pass, including source hull/face landmarks, four fin contacts, axial fin depth, rear flame-core support, and exhaust contact across animation phases. Source/front, both sides, rear, four movement phases and matching-revision museum load/move/turn/stop were directly inspected at displayed single-avatar 56–57 FPS. Seven exact-decoded lossless WebP proofs are in `outputs/qa/avatar-lab/rebuild-20261108/batch59.json`.

Source outline weights, side-fin tip shape, side/back color transitions, rear flame finish, final visual acceptance and class-scale performance remain pending. Hot-air balloon was inspected but is not changed in this batch. Sources and unrelated work were untouched. No commit or deployment was made.


## Batch 60 — hot-air balloon (2026-11-09)

Extended `flight-costumes.cjs` with a source-shaped closed striped envelope, short collar, rounded basket and rolled rim, surface-fitted rear weave, small mittens and boots. A single envelope artwork carrier removes the duplicated face and dangling painted lines. Eight colored gores share welded seam positions. Collar, basket and envelope remain rigidly connected while the short boots use a planted gait; mitten waving and head counter-rotation are disabled to keep contact.

Revision `b86519ef8797`, 175,313 triangles. Targeted geometry/export/animation tests pass, including original silhouette/face landmarks, real round depth, short basket height, collar/basket/rim overlap and mitten/boot contact across Idle/Walk/Wave. Palette verification compares normalized color ratios because neutral baked shading varies brightness. Source/front, both sides, rear, four walking phases and matching-revision museum load/move/turn/stop were directly inspected at displayed single-avatar 56–57 FPS. Seven exact-decoded lossless WebP proofs are in `outputs/qa/avatar-lab/rebuild-20261108/batch60.json`.

Side/rear painted-to-solid transitions, rim highlights, outline weights, model density and class-scale performance still need review. Overall visual acceptance remains pending. Original sources, new Gemini source-only additions and unrelated work were untouched. No commit or deployment was made.

## Batch 61 — submarine (2026-11-09)

Added `submarine-costume.cjs`: source-shaped horizontal hull with actual round depth, conforming closed window frames, rear glass and rivets, bow glass cap, connected tower/periscope/tail fins, short boots and two side flippers. The two-blade propeller rotates about its attached shaft during travel. A mask removes the duplicate painted flipper from the hull. Small rear marks use lower mesh density without changing their outline.

Revision `8fafbe325f25`, 178,496 triangles. Targeted geometry/export/animation tests pass, including source face/contour landmarks, window-frame surface distances, tower/periscope/shaft/tail contacts and both flippers, boots and propeller blades throughout Idle/Walk/Wave. Source/front, both sides, rear, four walking phases and matching-revision museum load/move/turn/stop were directly inspected at displayed single-avatar 56–57 FPS. Seven exact-decoded lossless WebP proofs are in `outputs/qa/avatar-lab/rebuild-20261108/batch61.json`.

Bow-glass color transition, tower/flipper outline weights, painted-to-solid transitions, model density and class-scale performance remain pending. Original source and unrelated work were unchanged. Overall visual acceptance is not claimed. No commit or deployment was made.

## Batch 62 — train (2026-11-09)

Added `train-costume.cjs`: source-shaped curved cab/roof, connected cylindrical boiler and face door, chimney, six recessed grille slots, lamps and guards. Front-cap-only adaptive subdivision preserves the original windows and face exclusion without subdividing every side. Side windows conform to the actual curved cab. Four attached wheels rotate around their axles with circumference-matched travel; no human limbs.

Revision `eff1386eb141`, 116,733 model triangles. Targeted geometry/export/animation tests pass, including source facial/window landmarks, physical part contacts, open grille recesses, fitted windows, guards, axle mounts and four rotating grounded wheels. Source/front, both sides, rear and four motion phases were inspected. Matching-revision museum load/move/turn/stop was observed at displayed 56–57 FPS. Seven exact-decoded lossless WebP proofs are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch62.json`.

Front outline weights, gold/window transitions, simplified side/rear finish, density and class-scale performance remain pending. Overall acceptance is not claimed. Source and unrelated work unchanged. No commit or deployment.

## Batch 63 — airplane (2026-11-09)

Added `airplane-costume.cjs`: original rounded nose/cockpit/face silhouette, swept closed wings, hollow annular nacelles and recessed intakes, rear tail and stabilizers, short wearer and attached arms/boots. Side inspection exposed a floating tail root; it now enters the fuselage. Original perimeter ink is faded off curved sides and replaced by silhouette shells. Museum inspection exposed duplicated source paint on the tail; the tail uses its plain source color instead. Adaptive part sampling reduced geometry from 122k to 72,778 triangles.

Revision `170840e2db1d`, 2,522 KiB. Targeted geometry/export/animation checks pass, including source face/cockpit and outline landmarks, tail/wing/engine/stabilizer contacts, actual intake holes, short torso and limb contact through every clip at five phases. Source/front, both sides, rear and four walking phases were directly inspected. Matching-revision museum load/move/turn/stop was observed at 57 FPS. Seven exact-decoded lossless WebP proofs are recorded in `outputs/qa/avatar-lab/rebuild-20261108/batch63.json`.

Neck/limb highlights and outline weights, rear stabilizer integration, engine side shading, painted-to-solid transitions and class-scale performance remain pending. Source unchanged. Overall acceptance is not claimed; no commit or deployment.

## Batch 64 — airship (2026-11-09)

Added `airship-costume.cjs`: horizontal rounded envelope matched to source outline samples, continuous red top/nose colors, original face, fitted front/rear porthole frames and rear glass, connected vertical/horizontal tail fins, short gondola and hips, attached sleeves/boots, and a separate volumetric gondola engine with physical rings. Source hull-border paint is excluded from tail roots. Rear cabin glass is ray-fitted to the rounded cabin with additional subdivision.

Revision `f445a993798c`, 110,536 model triangles, 3,797 KiB. Targeted geometry/export/animation checks pass, including original contour/expression landmarks, real depth, fitted windows, tail/cabin/hips/engine/ring contacts and limbs throughout all clips at five phases. Source/front, both sides, rear and four walking phases were directly inspected. Matching-revision museum front/rear/load/move/turn/stop was observed at 56–57 FPS. Eight exact-decoded lossless WebP proofs are in `outputs/qa/avatar-lab/rebuild-20261108/batch64.json`.

Rear tail stripe edge stepping, rear cabin glass edge waviness, lower tail artwork blend, outline weights and side palette transitions remain open. Class-scale performance and overall visual acceptance remain pending. Source unchanged. No commit/deployment. The consistency audit confirms all 152 current model/source hashes and geometry evidence, with 148 major-front reviews and four remaining: ambulance, boat, fire truck and helicopter. This count is not final acceptance; all 152 overall reviews remain pending.

## Batch 65 — ambulance (2026-11-09)

Added `ambulance-costume.cjs`: a beveled vehicle body, attached original face window, roof/cab beacons, four actual tires and axles, surface-fitted X-facing windshield/rear doors, opposite patient window/cross, and short jacket/hips with moving trousers and connected sleeves/hands. A padded slab draft produced roof streaks; the final body uses planar caps, small bevels and adaptive front-cap subdivision. Source image unchanged.

Revision `2b7c6c874cf7`, 129,810 triangles, 4,756 KiB. Targeted geometry/export/animation tests pass. Checks cover source silhouette/expression, true body depth, face-window and beacon contacts, four tires and axles, window fitting, short jacket, and limb contacts across all clips at five phases. The contact sampler was corrected to avoid repeatedly selecting the same lathe-profile vertex; axle/body contact now checks their actual depth intervals. Source/front, both sides, rear, four walking phases and matching-revision museum load/move/turn/stop were directly inspected at 57 FPS. Seven exact-decoded lossless WebP proofs are in `outputs/qa/avatar-lab/rebuild-20261108/batch65.json`.

Uniform cuff/collar and trouser shading, source outline weights, simplified rear-window/door finish, side palette transitions and class-scale performance remain pending. Overall acceptance is not claimed. No commit/deployment.


## Batch 66 — boat (2026-11-09)

Added `boat-costume.cjs`: a closed hollow banded hull, source-face cabin and internal cabin base, roof and chimney/cap, continuous rounded wooden gunwale, fitted front/back portholes, rear cabin window and one deep closed wake. The initial duplicate water disk was removed. Surface-fitted crest lines and a continuous blue gradient replace stretched water artwork. A failed wake outline caused side streaks and was removed. The original human face and source image are unchanged. No human limbs were added; gentle gliding bob is used.

Revision `8ac20fcc6eef`, 63,488 model triangles, 2,998 KiB. Geometry/export/animation tests pass, including source expression and hull landmarks, true depth, roof/chimney/rail and porthole attachment, cabin-base contact and keel/wake contact throughout all three clips at five phases. The contact test found a disconnected internal cabin; the final hidden base now joins the cabin to the hull floor. Source/front, both sides, rear and four movement phases were directly inspected. Matching-revision museum load/move/turn/stop and front/rear views were inspected at 57 FPS. Eight exact-decoded lossless WebP proofs and evidence hashes are recorded in `batch66.json`.

Fine source outline weights, simplified rear window and end-facing cabin finish still need final collection consistency review. This is not overall visual acceptance. All 152 current model/source hashes, geometry evidence and recorded museum revisions match; 150 major-front reviews are recorded, leaving fire truck and helicopter for major rebuilding. All 152 overall visual acceptances remain pending. New source-only Gemini additions are untouched. No commit or deployment.


## Batch 67 — fire truck (2026-11-09)

Added `fire-truck-costume.cjs`: a closed rounded cab with unchanged original face, bumper, mirrors/stays, actual sloping ladder with five rungs/supports, roof beacon, rear equipment door, side windows/reflectors and short firefighter jacket/hips/gloves/trousers/boots. A hidden neck bridge joins the wearer to the cab. Fixed sleeve stripe loss, chin mottling from coarse artwork occlusion, inward-facing rear reflective strips and a side reflector hidden inside the cab bevel. Source image unchanged.

Revision `330f393138bb`, 101,912 model triangles, 5,148 KiB. Targeted geometry/export/animation checks pass. These include original expression landmarks, true cab depth, short torso, ladder/rung/mirror/beacon contacts, neck and limb/boot contacts throughout all clips at five phases, rear-strip winding and actual side-reflector visibility. Source/front, both sides, rear and four gait phases were directly inspected. Matching-revision museum load/walk/turn/stop and front/rear were observed at 57 FPS. Eight current-hash lossless WebP proofs are recorded in `batch67.json`.

Fine outline weights, simple mirror backs and rectangular side windows, ladder shading and uniform side/rear transitions remain for final collection consistency review. No overall visual acceptance is claimed. All 152 actual model/source hashes, current geometry evidence and recorded museum revisions match. There are 151 major-front reviews; helicopter remains for major rebuilding. All 152 overall acceptances remain pending. The source catalog now contains 167 entries: 152 model subjects and 15 concurrent source-only additions, which were not edited. No commit/deployment.


## Batch 68 — helicopter (2026-11-09)

Rebuilt the source-shaped closed red hood, curved blue cockpit, supported original face, connected tail/fin and two animated rotors with a short wearer. Revision `52271bede3ea`, 76,793 triangles. The six-model custom geometry/export suite passed, including closed structures, face support, all attachment contacts and rotor clearance across six animation phases. Original/front, both sides, back, four gait phases, live rotors and matching-revision museum movement/turn/stop were directly inspected at 56–57 FPS. Nine lossless WebP proofs and exact hashes are in `batch68.json`.

This individual model passed final review: `final-review-vehicle-helicopter.json`. Completion applies only to that exact model/source pair; other avatars and classroom-scale/multiuser deployment are not covered.

## Batch 69 — octopus attachment finish and completion tracking (2026-11-09)

The supplied older screenshot showed separated thin central arms. The current source-shaped front had already corrected that silhouette; the recheck found exposed attachment seams in profile/rear. Extended six closed arm roots inside the hood, thickened the rear mantle, fitted all eight roots beneath both actual hood surfaces and faded internal outline offsets. Subtle normal shading preserves arm volume. A trial symmetric mantle covered the lower face rim; the final asymmetric mantle and surface-fitting repair preserve that rim. Extra hood tessellation did not solve the interference and was removed. Source image unchanged.

Final revision `b441643f03f3`, 66,208 triangles, approximately 2,361 KiB. The targeted closed-geometry/export/animation suite passes. New checks require every arm root to overlap actual mantle/hood volume, six caps to remain buried and all 76 suckers to remain attached in four motion phases. The depth-layer test now measures exposed arm surfaces rather than their new hidden attachment sleeves. Source/front, both sides, back and four movement phases were directly inspected. Matching-revision museum movement/turn/stop and front/rear passed at 56–57 FPS. Eight exact-decoded lossless WebP proofs are recorded in `batch69.json`. This individual final review is `final-review-animal-octopus.json`.

The generated collection now publishes complete status only when current source/model hashes, all six catalog checks and the final report agree and proof files exist. Missing or stale evidence falls back to draft status. Completion tests reject changed source/model bytes, missing checks/proofs, wrong model IDs and unresolved defects. The viewer includes reviewed avatars alongside legacy prototypes and labels each individually. Review manifests are fetched without caching and the inspected revision is exposed in the DOM.

Two of the original 152 models are individually accepted; 150 still require final closure. This is not overall completion. Concurrent source-only additions remain untouched. No commit or deployment.


## Batch 70 — cat final review (2026-11-09)

Replaced overlapping padded ear/hood skins with `cat-hood.cjs`, a single closed front/back surface using the original full silhouette and blended authored depth fields. Shared-boundary normals are smoothed; original source artwork stays unchanged. Closed both tail ends, extended hidden boot roots and moved the wave shoulder pivot into the suit without translating it forward. Reduced side stripe offsets to avoid raised edges.

Revision `c55744b785f7`, 67,400 triangles, approximately 2,219 KiB. The six custom models pass geometry/export/animation checks. New cat checks cover ear/expression landmarks and actual head/suit/limb/tail contacts across all clips at five phases. They initially found a disconnected right boot in Walk and right sleeve in Wave; both were corrected before recording. Original/front, both profiles, back, four gait phases and live wave were directly inspected. Current-revision museum load/walk/turn/stop passed at 56 FPS. Nine lossless WebP proofs, including the 1265x712 studio wave screenshot and 1280x720 review/museum captures, are recorded with exact dimensions in the final report.

`final-review-animal-cat.json` records individual acceptance for this source/model pair. Three of the 152 models are individually accepted; 149 still require final closure. Class-scale/multiuser deployment and overall completion are not claimed. No source-only additions were edited; no commit/deployment.


## 2026-11-09 — batch71: donut and ramen individual completion

Original sources unchanged. Donut rear decorations now follow the coating surface and remain embedded. Ramen has closed noodle/marbling tubes, supported broth/ingredients, an attached scallion cluster, fitted ceramic reflections and a broader source-like bowl band. Actual animation-contact tests found and resolved detached sleeves; shoulder pivots/bridges remain connected throughout Idle, Walk and Wave. Source/front, both profiles, rear, four gait phases, Wave and exact-revision museum load/move/turn/stop directly inspected.

Accepted revisions: food-donut `606ad6e160de`, food-ramen `c8d9a93cdd4b`. Museum preview observed 56–57 FPS per individual. This is not class-scale/multiuser certification. Reports/proofs: `outputs/qa/avatar-lab/rebuild-20261108/final-review-food-{donut,ramen}.json`. Five of 152 models individually accepted; 147 remain pending. All 152 current source/model/geometry records and index revisions audited; 17 source-only additions preserved.


## 2026-11-09 — batch72: banana and umbrella individual completion

Original sources unchanged. Actual-volume tests found an umbrella held sleeve detached from the torso. Buried shoulder bridges and an inward right pivot repaired the connection. All ribs, hems, pole, handle and rear hood seam now have closed ends. Front/profile/rear/four gait phases and live Wave inspection found raised hands disappearing behind the costumes; revised short-arm gestures keep banana hand below the peel and umbrella hand below the hood. All six custom geometry suites pass, including actual hood/suit/limb/pole/hook/grip contact checks through five phases of every umbrella clip.

Accepted revisions: fruit-banana `e8a1872213d8`, object-umbrella `65e089108f9b`. Exact files loaded, moved, turned and stopped in the museum at 56–57 FPS per individual. Proofs and individual reports are under `outputs/qa/avatar-lab/rebuild-20261108/repairs72-*` and `final-review-{fruit-banana,object-umbrella}.json`. Seven of 152 models individually accepted; 145 remain pending. All 152 model/source/geometry/index records audited. Seventeen source-only additions preserved. This remains an active full-collection task, not an overall completion.


## 2026-11-09 — batch73: bear and chick individual completion

Original WebP sources unchanged. Removed full-surface artwork opacity that stretched dark outlines into flank zipper marks; shared boundary normals and actual silhouette shells preserve the front outline with smooth sides. Chick hood feather scallops are confined to the hem instead of radiating across the cranium; the reverse feet now retain the original orange color. Tests found the chick right wing detaching during the old overhead Wave; it now makes an attached small wing greeting. Bear greeting angle now keeps the short hand visible below the hood.

Added meaningful closed-pair/rim-normal/paint-flank/feature-support and actual animated head/body/limb contact checks. Targeted geometry/export tests passed. Added Walk/Idle/Wave selection and an all-views animated-pose toggle to collection review, and clamped initial frame time to zero. The toggle and Wave/Walk switching were directly exercised, then four Walk phases were inspected across front, left, right, rear and three-quarter views. Both exact revisions were loaded, moved, turned and stopped in the museum at 57 FPS.

Accepted: animal-bear `fbe85aabed29`, animal-chick `3a54a9b978e1`. Proofs: `repairs73-*`; reports: `final-review-animal-{bear,chick}.json`. Full 152 source/model/geometry/index audit passed; nine individually accepted, 143 pending. Seventeen source-only additions preserved. Next unfinished priorities: bee and butterfly (front preview seen, detailed side/back/animation and finishing remain). Overall collection goal remains active.

## 2026-11-09 — Batch 74: bee and butterfly

Removed the hood meridian and sleeve/boot foreground texture contamination, welded rim normals, fitted honey-dipper grooves, retained the bee holding-arm connection during gestures and widened hidden butterfly upper-wing roots. Original source assets unchanged. Source/front and all animated views at four Walk phases plus Wave directly inspected. Exact current revisions loaded, moved, turned and stopped in the museum (56–57 FPS). Closed solids and actual volume-contact tests through all clips passed. Individual final reports and nine proof images per model recorded. **11/152 individually accepted; 141 remain pending.** Full collection is not complete.

## 2026-11-09 — Batch 75: crab and crested gecko

Removed hood meridian and flank artwork streaks; smoothed/welded paired surfaces. Localized gecko crest scallops to the perimeter and refitted eye/muzzle volumes, including the muzzle base colour. Corrected crab sleeve pivot/greeting angle and gecko greeting hand penetration. Current source/front, all four animated Walk phases, Wave and museum load/move/turn/stop directly inspected at 56–57 FPS. Closed surfaces, actual feature/body/limb/tail contacts and gecko wrist exclusion passed. Sources unchanged. Nine proof images per model and individual final reports recorded. **13/152 individually accepted; 139 remain pending.** The collection is not complete.

## 2026-11-09 — Batch 76: crocodile and deer

Removed flank artwork streaks and split rim shading while retaining original expressions and short bodies. Crocodile head and tail scallops were localized to the edge, eliminating radial back folds. Added a closed back support that contacts the torso, all three dorsal crests and tail. Reduced both greeting angles after wrist-exclusion checks found hand/head overlap. Closed solids, actual species-feature/body/limb/tail contact, current exported clips and all five tested animation phases passed. Original/front, all animated directions at four Walk phases, Wave and exact-revision museum load/move/turn/stop directly inspected (56–57 FPS). Sources unchanged; nine proof images per model and individual final reports recorded. **15/152 individually accepted; 137 remain pending.** The full collection is not complete.

## 2026-11-09 batch77 — 강아지·돌고래

원본 정면과 짧은 몸 비율을 유지하며 측면 외곽선 번짐, 분리된 표면 음영 및 머리에 가려지는 인사 각도를 수정했다. 양쪽 옆·뒤, 걷기 네 구간, 인사를 직접 검수하고, 현재 GLB로 미술관 이동·회전·정지를 확인했다. 닫힌 표면 및 귀·지느러미·주둥이·꼬리·팔다리의 실제 접촉 검사가 통과했다. batch77-consistency-audit.json 기준 개별 완료 17/152, 나머지 135종 미완료. 추가 17종 원본은 유지했다.

## 2026-11-09 batch78 — 드래곤·잠자리

드래곤의 측면 외곽선 번짐과 겹친 이마 외곽선을 제거하고, 머리·꼬리의 굴곡 음영을 정리했다. 꼬리 돌기는 연결된 입체로 제작했다. 잠자리의 고정 머리 테두리를 제거하고 네 날개의 무늬, 원본 표정과 몸통 마디를 유지했다. 두 모델 모두 인사 손 가림을 수정했다. 원본 정면, 양쪽 옆·뒤, 걷기 네 구간, 인사를 직접 검수하고 최신 해시로 미술관 이동·회전·정지를 확인했다. 실제 부품 접촉과 닫힌 표면 검사 통과. 개별 완료 19/152, 나머지 133종 미완료.

## 2026-11-09 batch79 — 오리·독수리

두 모델의 측면 외곽선 번짐을 제거하고 원본 표정·부리와 짧은 몸을 유지했다. 오리 주황 발과 독수리 노랑 발을 입체 전체에 적용했다. 독수리 머리의 깃털 끝은 유지하고 뒤통수 주름을 제거했으며 부리를 다시 맞췄다. 어깨가 떨어지는 인사는 붙어 있는 작은 날개 인사로 교체했다. 앞·양쪽 옆·뒤, 걷기 네 구간·인사를 직접 확인하고 최신 해시로 미술관 이동·회전·정지 검수를 마쳤다. 실제 부품 접촉 및 닫힌 표면 검사 통과. 개별 완료 21/152, 나머지 131종 미완료.

## 2026-11-09 batch80 — 코끼리·플라밍고

원본 표정과 짧은 비율을 유지하며 두 모델의 측면 번짐과 분리된 표면 음영을 수정했다. 코끼리의 앉은 자세·손발 및 튀는 이동을 유지하고, 플라밍고 부리 끝 색을 입체 전체에 적용했다. 겹치는 코·목 외곽선을 정리했다. 실제 귀·코·목·부리·손발·몸통 연결 및 닫힌 표면 검사가 통과했다. 원본·앞·양쪽 옆·뒤와 이동 네 구간·인사를 직접 검수하고 최신 파일로 미술관 이동·회전·정지를 확인했다. batch80 감사 기준 개별 완료 23/152, 나머지 129종 미완료. 추가 17종 원본 유지.

2026-11-09 batch84: koala and ladybug original/front, both sides, rear, four Walk phases, Wave and exact-revision single-model museum load/move/turn/stop directly inspected. Geometry and current hashes verified. 31/152 individually accepted; 121 pending. See batch84-consistency-audit.json. Overall objective remains incomplete.

2026-11-09 batch85: leopard gecko and lion rebuilt and individually inspected against original/front, both profiles, back, four Walk phases and Wave. Gecko rear head/body/tail spots fitted to actual surfaces; lion mane/body overlap and shoulder outline artifacts corrected. Exact-revision single-model museum load/move/turn/stop inspected at 56-57 FPS. Current hashes and geometry verified. 33/152 individually accepted; 119 pending; 17 source-only additions preserved. See batch85-consistency-audit.json. Overall objective remains incomplete.

2026-11-09 batch86: sheep (legacy animal-llama id) and meerkat individually inspected against original/front, both profiles, back, four Walk phases, and greeting/held-hands clips. Rebuilt continuous sheep fleece, removed flank source-outline streaks, continued rear hand/hoof/paw/tail colours, and kept meerkat hands folded in Wave. Exact-revision single-model museum load/move/turn/stop inspected at 56-57 FPS. All current source/model/geometry hashes match. 35/152 individually accepted; 117 pending. See batch86-consistency-audit.json. Overall objective remains incomplete.


2026-11-09 batch90: panda and peacock individually inspected against original/front, both profiles, rear, four Walk phases and Wave. Panda upper sleeve roots repaired after contact test found a detached waving shoulder; white hood and black limbs continued around rear. Peacock hood and feathers smoothed, beak refitted, fan moved behind head and connected to body, rear feather eyes and fitted shafts added with human projection and black mask-edge debris removed. Exact-revision single-model museum load/move/turn/stop inspected at 56-57 FPS. Current files pass contact, closed paired surfaces, source/export/animation and floor checks. batch90-consistency-audit.json: 41/152 individually accepted, 111 pending; 17 source-only additions preserved. Overall goal remains active and incomplete.


2026-11-09 batch91: penguin and praying mantis original/front, both profiles, rear, four Walk phases and Wave directly inspected. Smoothed both hood volumes and removed flank projection streaks; penguin feet now yellow all round. Mantis hood piping removed, compound eyes reconstructed as closed tilted volumes, antenna and limb ink streaks removed. Current contact tests cover eyes, antennae, beak, body, moving limbs and mantis grasping blades/side legs. Latest exact-hash GLBs inspected for load/move/turn/stop in the museum at 56-57 FPS. batch91-consistency-audit.json verifies 43/152 individually accepted and 109 pending, with 17 source-only additions preserved. Overall objective remains active and incomplete.


2026-11-09 batch92: rabbit and ratsnake original/front, both profiles, rear, four movement phases and greeting selection directly inspected. Smoothed closed hood/ear surfaces and removed limb projection streaks. Rebuilt snake coil as a connected closed annular tube; retained limbless gliding, attached curl and short throat. Corrected outward yellow belly after front comparison showed excessive green. Current exact hashes: rabbit 1298caeca32a, ratsnake 822ba6e6f916. Single-model museum load/move/turn/stop verified; source/export, topology, contact and animation checks pass. 45/152 individually accepted, 107 pending; all 17 Gemini source-only additions preserved.

2026-11-09 batch93: revisited octopus after the user highlighted a different lower-body silhouette in an earlier screenshot. The current broad connected tentacles were retained; sucker paths moved to source lower-edge arcs, rims brightened and hood radial surface refined. All 76 relief cups remain on their actual moving support surfaces and all eight roots remain embedded at four phases. Exact revision 084b8494d01a directly inspected against original/front, both profiles, rear, four movement phases, greeting selection and museum load/move/turn/stop at 56-57 FPS. Nine current WebP proofs recorded. batch93-consistency-audit.json: 45/152 accepted, 107 pending; all current model/source/geometry records agree. Overall objective remains active and incomplete.


2026-11-09 batch94: rhinoceros and seal original/front, both profiles, rear, four Walk phases and gentle greetings directly inspected. Smoothed hood and rhino ear/horn volumes, removed projected flank/limb outlines, and replaced rhino painted claw streaks with ten fitted solid claws. Seal tail/body contact failed all checked phases; extended its root into the torso and reran the unchanged intersection tests successfully. All closed paired surfaces, joined normals, muzzle/horn/ear/nose contacts, moving limb/claw/tail contacts, original artwork, exact GLB export and floor checks passed. Exact revisions d1d0fcbe183b and 5a0fc9bdbc9b inspected for single-model museum load/move/turn/stop. Nine current WebP proofs each. batch94-consistency-audit.json: 47/152 individually accepted, 105 pending, 17 source-only additions preserved. Overall objective remains active and incomplete.


### Batch 100 — trophy and bubble tea

Trophy curved arm solids and embedded roots, reduced flank stretch and small visible greeting. Bubble tea pupil/source cleanup and continuous molded lid. Equal-scale front, both profiles, rear, four movement phases and greeting directly inspected. Exact GLBs pass geometry/contact/export checks; each loaded, moved, turned and stopped in Portrait gallery. 59/152 individually accepted; 93 remain pending. Single-model preview only. Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch100-input.json`.


### Batch 101 — bingsu and birthday cake

Both source faces cleaned with built-in image_gen. Bingsu: compact topping, attached beans around front/rear/sides, no ice piercing topping or white pixels on red beans; faint irregular snow and bowl outlines. Refresh geometry mask after source changes with `python scripts/prepare-bingsu-bean-mask.py`. Cake: continuous color-boundary rings around both tiers, surface-fitted original face, wider candle stripes and outlined flickering flames. Exact revisions inspected in original/front/both profiles/rear/four movement phases/greeting and museum load/move/turn/stop. Technical contacts and exports pass. 61/152 individually accepted; 91 pending. Single-model preview only; classroom scale is not claimed. Evidence: `outputs/qa/avatar-lab/rebuild-20261108/batch101-input.json`.
