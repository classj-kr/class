# 오방색과 사신

국립중앙박물관 외규장각 의궤의 실제 그림을 보고 색·방위·오행·계절과 사신의 관계를 살펴보는 검토본입니다. 포털에 등록하거나 배포하지 않았습니다.

## 화면

- 청룡·주작·백호·현무를 선택하면 원본 그림, 형태 설명, 관계 표와 방위도가 함께 바뀝니다.
- 그림 전체를 확대하거나 머리·비늘·날개·거북과 뱀 등의 특징을 확대해 봅니다. 확대 창에서는 스크롤로 다른 부분을 보고, +/−로 배율을 바꿉니다. 닫기 버튼과 Esc를 지원합니다.
- 1674년과 1757년의 두 의궤를 비교합니다. 특정 자료에 나타난 형태를 모든 시대의 고정된 모습으로 일반화하지 않습니다.
- 중앙의 황색·토(土)는 별도로 설명합니다. 사신은 네 존재이며 중앙에 다섯째 사신을 만들어 넣지 않습니다.
- 북쪽이 위인 방위도를 사용합니다. 전통 사상과 상징을 설명하며 과학적 인과 모형으로 다루지 않습니다.
- 본문과 조작부 16px, 소제목 18px, 제목 22px. 출처는 하단의 접힌 ‘그림과 자료 정보’에서 확인합니다.

## 도식의 색

- 방위도·선택 버튼의 색 견본·관계 표의 색 견본·중앙의 다섯 색 띠는 `data.js`의 같은 색 값을 사용합니다.
- 청은 파랑, 적은 빨강, 황은 노랑, 백은 흰색, 흑은 검정으로 식별되는 대표색을 사용합니다. 방위도 자체를 옅은 배경색으로 바꾸지 않습니다.
- 이 화면의 sRGB 값은 다섯 색을 구분하기 위한 표시용 값이며, 역사적 오방색의 유일한 표준값이나 원본 유물의 측색값으로 제시하지 않습니다. 의궤 원본의 색에는 적용하지 않습니다.
- 방위도에서 청·적·흑 바탕은 흰 글자, 황·백 바탕은 어두운 글자를 사용합니다. 선택 여부는 테두리로 표시하여 견본 색을 유지합니다.

## 자료와 이용 조건

그림 제공: **국립중앙박물관, 외규장각 의궤**. 아래 여덟 파일은 박물관이 제공하는 원본 JPEG를 그대로 보관했습니다. 색 보정·잘라내기·재인코딩을 하지 않았습니다. 화면에 맞춰 표시하며 확대 창에서도 같은 원본을 사용합니다.

박물관 도설 페이지의 **공공누리 제4유형(출처 표시·상업적 이용 금지·변경 금지)** 조건이 적용됩니다. 앱의 코드와 별도로 이 조건과 출처 표시를 유지해야 합니다.

각 원본은 약 6–8MB이며 모두 합쳐 약 57MB입니다. 처음에는 선택한 사신의 1674년 그림 하나를 불러오고, 다른 그림은 선택하거나 시대 비교를 켤 때 불러옵니다. 불러오는 동안 상태를 표시하며, 디코딩이 끝나면 그림을 표시합니다.

| 파일 | 자료 | 연도 | 원문 |
|---|---|---|---|
| `dragon.jpg` | 인선왕후영릉산릉도감의궤 | 1674 | [도설](https://www.museum.go.kr/uigwe/dosul/dosulView?dataType=n&kind=%EC%B2%AD%EB%A3%A1_%E9%9D%91%E9%BE%8D&lmenuType=a_1) · [이미지](https://www.museum.go.kr/uigwe/data/dosul/imgOrigin/uig_di_031_0008_1.jpg) |
| `dragon-late.jpg` | 인원왕후명릉산릉도감의궤 | 1757 | [도설](https://www.museum.go.kr/uigwe/dosul/dosulView?dataType=n&kind=%EC%B2%AD%EB%A3%A1_%E9%9D%91%E9%BE%8D&lmenuType=a_1) · [이미지](https://www.museum.go.kr/uigwe/data/dosul/imgOrigin/uig_di_196_0007_1.jpg) |
| `tiger.jpg` | 인선왕후영릉산릉도감의궤 | 1674 | [도설](https://www.museum.go.kr/uigwe/dosul/dosulView?dataType=n&kind=%EB%B0%B1%ED%98%B8_%E7%99%BD%E8%99%8E&lmenuType=a_1) · [이미지](https://www.museum.go.kr/uigwe/data/dosul/imgOrigin/uig_di_031_0009_1.jpg) |
| `tiger-late.jpg` | 인원왕후명릉산릉도감의궤 | 1757 | [도설](https://www.museum.go.kr/uigwe/dosul/dosulView?dataType=n&kind=%EB%B0%B1%ED%98%B8_%E7%99%BD%E8%99%8E&lmenuType=a_1) · [이미지](https://www.museum.go.kr/uigwe/data/dosul/imgOrigin/uig_di_196_0008_1.jpg) |
| `bird.jpg` | 인선왕후영릉산릉도감의궤 | 1674 | [도설](https://www.museum.go.kr/uigwe/dosul/dosulView?dataType=n&kind=%EC%A3%BC%EC%9E%91_%E6%9C%B1%E9%9B%80&lmenuType=a_1) · [이미지](https://www.museum.go.kr/uigwe/data/dosul/imgOrigin/uig_di_031_0010_1.jpg) |
| `bird-late.jpg` | 인원왕후명릉산릉도감의궤 | 1757 | [도설](https://www.museum.go.kr/uigwe/dosul/dosulView?dataType=n&kind=%EC%A3%BC%EC%9E%91_%E6%9C%B1%E9%9B%80&lmenuType=a_1) · [이미지](https://www.museum.go.kr/uigwe/data/dosul/imgOrigin/uig_di_196_0009_1.jpg) |
| `tortoise.jpg` | 인선왕후영릉산릉도감의궤 | 1674 | [도설](https://www.museum.go.kr/uigwe/dosul/dosulView?dataType=n&kind=%ED%98%84%EB%AC%B4_%E7%8E%84%E6%AD%A6&lmenuType=a_1) · [이미지](https://www.museum.go.kr/uigwe/data/dosul/imgOrigin/uig_di_031_0011_1.jpg) |
| `tortoise-late.jpg` | 인원왕후명릉산릉도감의궤 | 1757 | [도설](https://www.museum.go.kr/uigwe/dosul/dosulView?dataType=n&kind=%ED%98%84%EB%AC%B4_%E7%8E%84%E6%AD%A6&lmenuType=a_1) · [이미지](https://www.museum.go.kr/uigwe/data/dosul/imgOrigin/uig_di_196_0010_1.jpg) |

개별 파일의 URL·연도·원본 크기·이용 조건은 `assets/sources.json`에도 기록했습니다.

연도는 개별 도설의 서지정보를 따릅니다. ‘사수도란?’ 이야기 페이지의 일부 그림 설명에 표기된 1725년을 그대로 옮기지 않고, 인원왕후명릉산릉도감의궤의 서지정보인 **1757년**을 사용했습니다.

## 설명의 근거

- [국립중앙박물관: 사수도란?](https://www.museum.go.kr/uigwe/story/story) — 사신의 위치·형태 변화, 고분벽화와 왕실 장례의 사신 그림.
- 위 표의 개별 도설 해설 — 사신과 방위·오행·계절의 대응, 그림의 연도.
- [국립국악원 국악사전: 처용무](https://www.gugak.go.kr/ency/topic/view/450) — 다섯 색의 복식과 방위, 중앙 토와 사계절의 연결. 국악원의 사진·영상은 사용하지 않았습니다.
- [한국복식사전: 오방색](https://dh.aks.ac.kr/~katd/wiki/index.php/%EB%B3%B5%EC%8B%9D%EC%82%AC%EC%A0%84:%EC%98%A4%EB%B0%A9%EC%83%89) — 오방정색과 색·방위의 관계.

## 검사

저장소 루트에서 `node tests/obangsaek-browser-smoke.cjs`를 실행합니다. Chrome 또는 Edge가 필요합니다. `OBANGSAEK_SCREENSHOTS`를 지정하면 1440·390·320px 화면을 저장합니다.

선택과 방위도·표의 동기화, 두 시대 원본 불러오기, 확대와 특징 위치 이동, Esc로 닫기, 중앙의 별도 설명, 모바일 넘침과 선택 항목 가시성을 검사합니다.
