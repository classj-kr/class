# 컴퓨터 이론 진도표

주차를 정하지 않는다. 학습자는 차시별 활동과 문제를 통과한 뒤 다음 차시로 이동한다. 모든 차시는 한국어 개념명과 영어 원어를 함께 표시한다.

## 수업 구조

기존 36차시의 제목과 순서를 유지하고, 각 차시의 설명 범위와 과제를 조정했다. 초등 고학년 입문자를 대상으로 한다.

1. 본문: 한 상황을 통해 역할과 관계를 설명하고 필수 용어의 영어 원어를 병기한다.
2. 실습: 실제로 조건을 바꾸고 결과를 관찰한다. 조작 모형과 실제 기기의 차이는 표시한다.
3. 적용: 앞 실습과 다른 상황의 기록을 읽어 원인과 예상 결과를 판단한다.
4. 확인: 선택한 답을 제출한 뒤 근거를 읽고 다시 판단한다. 오답을 제거하지 않으며 첫 답과 재시도를 구별한다.

1차시는 그림 변환·숫자 처리 실습과 4문항을 사용한다. 나머지 차시는 실습 확인 1문항, 새 상황 적용 2문항, 확인 2문항을 사용한다. 차시 방문만으로 완료하지 않는다.

범위 조정과 완료 기준은 [전체 개편 계획](textbook/PLAN.md), 구현과 검증 기록은 [교재 안내](textbook/README.md)를 따른다.

## 전체 36차시

### A. 컴퓨터의 기본 원리 / Computer Principles

| 차시 | 제목 | 핵심 관계 |
| --- | --- | --- |
| A01 | 컴퓨터는 무슨 일을 할까? / What Does a Computer Do? | 입력 → 처리 → 출력·저장 |
| A02 | 하드웨어와 소프트웨어는 어떻게 다를까? / Hardware and Software | 물리 장치 ↔ 실행 명령 |
| A03 | 기기·운영체제·앱은 무엇이 다를까? / Device, Operating System, and App | 기기 → 운영체제 → 앱 |
| A04 | 아날로그와 디지털은 무엇이 다를까? / Analog and Digital | 연속 값 → 측정 순간 → ADC → 숫자 단계 |
| A05 | 현실의 소리는 어떻게 숫자 데이터가 될까? / From Sound to Digital Data | 파형 → 샘플링 레이트 → 양자화 → 비트 깊이·부호화 |

### B. 하드웨어와 기기 / Hardware and Devices

| 차시 | 제목 | 핵심 관계 |
| --- | --- | --- |
| B01 | 본체 안에는 어떤 부품이 있을까? / Inside a Desktop Computer | CPU·GPU·RAM·SSD·메인보드·전원·냉각 |
| B02 | 휴대전화와 태블릿 안에도 컴퓨터가 있을까? / Inside Phones and Tablets | SoC·RAM·플래시·센서·통신·배터리 |
| B03 | 주변 기기와 단자는 어떻게 연결될까? / Peripherals, Ports, and Connections | 주변 기기·단자·규격·드라이버 |

### C. 운영체제와 앱 / Operating Systems and Apps

| 차시 | 제목 | 핵심 관계 |
| --- | --- | --- |
| C01 | 하드웨어·운영체제·앱은 어떻게 이어질까? / Hardware, Operating System, and Apps | 사용자 → 앱 → OS → 하드웨어 |
| C02 | Windows·ChromeOS·Android·iOS·iPadOS는 무엇이 다를까? / Comparing Operating Systems | 같은 역할, 다른 인터페이스와 호환 환경 |
| C03 | 앱·프로그램·프로세스·창은 같은 말일까? / Apps, Programs, Processes, and Windows | 저장된 프로그램 → 실행 프로세스 → 창·탭 |
| C04 | 설정에서 무엇을 바꾸고 관리할까? / What Can You Change and Manage in Settings? | 설정·제어판·권한·관리자·업데이트·전원 상태 |

### D. 포인터·터치·키보드 / Pointer, Touch, and Keyboard

| 차시 | 제목 | 핵심 관계 |
| --- | --- | --- |
| D01 | 포인터·텍스트 커서·클릭·드래그는 어떻게 다를까? / Pointer, Text Cursor, Click, and Drag | 가리키기·선택·실행·이동 |
| D02 | 터치·탭·길게 누르기·스크롤·확대는 어떻게 작동할까? / Touch Gestures | 접촉 위치·시간·이동·손가락 수 |
| D03 | 키보드·단축키·클립보드는 어떻게 이어질까? / Keyboard, Shortcuts, and Clipboard | 문자·기능 키·단축키·임시 데이터 |

### E. 파일과 저장 공간 / Files and Storage

| 차시 | 제목 | 핵심 관계 |
| --- | --- | --- |
| E01 | 드라이브·폴더·파일·경로는 어떤 관계일까? / Drives, Folders, Files, and Paths | 저장 공간의 계층과 주소 |
| E02 | 파일 이름·확장자·형식·앱은 어떻게 연결될까? / File Names, Extensions, Formats, and Apps | 이름의 표시 ↔ 실제 데이터 형식 ↔ 연결 앱 |
| E03 | 저장·다른 이름으로 저장·복사·이동·삭제는 무엇이 다를까? / Save, Save As, Copy, Move, and Delete | 원본 위치·개수·복구 가능성 |
| E04 | 아이콘·원본·바로가기·북마크·즐겨찾기는 같은 것일까? / Icons, Originals, Shortcuts, and Bookmarks | 보이는 표지 ↔ 실제 대상 ↔ 위치 연결 |
| E05 | USB·클라우드·동기화·백업·ZIP은 어떻게 다를까? / USB, Cloud, Sync, Backup, and ZIP | 저장 위치·상태 맞춤·복구 사본·묶음 |

### F. 화면과 디지털 미디어 / Displays and Digital Media

| 차시 | 제목 | 핵심 관계 |
| --- | --- | --- |
| F01 | 픽셀·해상도·화면 크기·배율은 어떻게 다를까? / Pixels, Resolution, Screen Size, and Scaling | 픽셀 수·물리 크기·밀도·표시 크기 |
| F02 | RGB 색과 래스터·벡터·JPG·PNG·WebP는 어떤 관계일까? / Color, Raster, Vector, and Image Formats | 색 표현·그림 구조·파일 형식 |
| F03 | 소리 샘플·영상 프레임·스크린샷·화면 녹화는 무엇일까? / Audio Samples, Video Frames, Screenshots, and Screen Recording | 순간 측정·시간 순서·한 장·연속 기록 |

### G. 0과 1·데이터 크기 / Binary and Data Size

| 차시 | 제목 | 핵심 관계 |
| --- | --- | --- |
| G01 | 아날로그와 디지털, 0과 1은 어떤 관계일까? / Analog, Digital, and Binary | 물리 변화 → 측정 → 이진 상태 |
| G02 | bit·byte·KB·MB·GB·TB는 어떻게 커질까? / Bits, Bytes, KB, MB, GB, and TB | 8 bit = 1 byte, 데이터 크기 단위 |
| G03 | 인코딩·압축·파일 크기·전송 속도는 어떤 관계일까? / Encoding, Compression, File Size, and Transfer Speed | 표현 규칙 → 압축 → 크기 ÷ 속도 |

### H. 네트워크와 웹 / Networks and the Web

| 차시 | 제목 | 핵심 관계 |
| --- | --- | --- |
| H01 | 네트워크·Wi-Fi·공유기·인터넷은 어떻게 이어질까? / Networks, Wi-Fi, Routers, and the Internet | 기기 → Wi-Fi → 공유기 → 인터넷 |
| H02 | 클라이언트·서버·요청·응답·URL·DNS는 어떻게 이어질까? / Clients, Servers, Requests, Responses, URLs, and DNS | URL → DNS → 서버 요청·응답 |
| H03 | 브라우저·검색 엔진·웹사이트·탭·링크는 무엇이 다를까? / Browsers, Search Engines, Websites, Tabs, and Links | 여는 앱·찾는 서비스·문서·이동 요소 |
| H04 | 온라인 문제를 제출하면 어디에서 채점할까? / What Happens After You Submit an Online Answer? | 답 선택 → 제출 → 서버 채점 → 점수 저장 → 결과 표시 |
| H05 | 다운로드·업로드·쿠키·캐시·배포는 어떤 역할일까? / Downloads, Uploads, Cookies, Caches, and Deployment | 데이터 이동·상태·임시 저장·공개 버전 |

### I. 계정·보안·디지털 시민성 / Accounts, Security, and Digital Citizenship

| 차시 | 제목 | 핵심 관계 |
| --- | --- | --- |
| I01 | 계정·프로필·로그인·권한·2단계 인증은 어떻게 이어질까? / Accounts, Profiles, Permissions, and Two-Factor Authentication | 식별 → 인증 → 추가 증거 → 권한 |
| I02 | 피싱·개인정보·저작권·디지털 발자국·기기 건강은 어떻게 판단할까? / Phishing, Privacy, Copyright, Digital Footprints, and Digital Well-being | 주소·요구 행동·공개 범위·사용 허락·사용 환경의 증거 |

### J. 알고리즘과 코딩 논리 / Algorithms and Coding Logic

| 차시 | 제목 | 핵심 관계 |
| --- | --- | --- |
| J01 | 문제를 분해하고 순서가 분명한 알고리즘으로 만들려면? / Decomposition, Sequences, and Algorithms | 분해 → 순서 → 절차 → 검증 |
| J02 | 이벤트·조건·반복은 프로그램의 흐름을 어떻게 바꿀까? / Events, Conditions, and Loops | 사건 → 판단 → 분기 → 반복 |
| J03 | 사진이 보이지 않는 프로그램을 입력·처리·출력·저장으로 점검하려면? / Debugging a Photo Program with Input, Processing, Output, and Storage | 재현 → 관찰 → 수정 → 재시험 |

## 구현·검수 기준

- 첫 화면에서 현재 차시와 시작 동작이 보이고 긴 소개 문구를 두지 않는다.
- 진도표는 10개 영역을 접어 보여 주고 현재 영역만 펼친다.
- 모든 직접 조작은 터치, 트랙패드, 마우스, 키보드로 수행할 수 있다.
- 정답은 명시적인 제출 뒤에만 판정한다. 오답 문항에는 개념 근거를 제시하고 재시도 경로를 둔다.
- 물리 부품은 실제·제작 사진을 사용하고, 관계·흐름은 읽을 수 있는 HTML/CSS 도식으로 표시한다.
- 1024×768, 1180×820 가로 화면을 먼저 검수하고 768×1024 세로 화면을 이어서 검수한다.
- 학생이 누르는 대상은 44×44 CSS px 이상을 유지한다.
