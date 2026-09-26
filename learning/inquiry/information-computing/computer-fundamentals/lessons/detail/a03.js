(() => {
    "use strict";
    const asset = window.COMPUTER_IMAGE_ASSET;
    (window.COMPUTER_DETAILED_LESSONS = window.COMPUTER_DETAILED_LESSONS || []).push(
        {
            id: "a03",
            number: 3,
            title: "기기·운영체제·앱",
            english: "Device, Operating System, and App",
            conceptTitle: "기기는 실제 물건이고, 운영체제는 기기를 관리하며, 앱은 필요한 일을 합니다.",
            visual: `
                <section class="foundation-direct-lab a03-compatibility-lab" data-a03-lab data-device="pc" data-os="windows" data-app="paint" data-outcome="pending" aria-labelledby="a03LabTitle">
                    <header class="foundation-lab-heading has-context">
                        <div><span>층 조합 실험 <small>Compatibility Layer Lab</small></span><h3 id="a03LabTitle">기기–운영체제–앱을 바꿔 쌓고, 어디에서 실행이 멈추는지 증거로 확인하세요.</h3></div>
                        <button type="button" class="foundation-reset" data-a03-reset>처음 상태 <small>Reset</small></button>
                        <figure class="foundation-context-figure">
                            <img src="${asset("a03-device-os-app-layers-illustration-v1-768.webp")}" srcset="${asset("a03-device-os-app-layers-illustration-v1-768.webp")} 768w, ${asset("a03-device-os-app-layers-illustration-v1-1536.webp")} 1536w" sizes="(max-width: 620px) 244px, (max-width: 820px) 144px, (max-width: 1180px) 16vw, 190px" width="1536" height="1024" loading="eager" decoding="async" alt="태블릿의 물리 부품 위에 운영체제가 장치를 관리하는 층과 그림 앱을 사용하는 화면 층이 겹쳐 있는 모습">
                            <figcaption>기기·OS·앱 세 층<small>Device · OS · App</small></figcaption>
                        </figure>
                    </header>
                    <div class="a03-selector-bank">
                        <fieldset><legend>1. 기기 <small>Device</small></legend><div class="foundation-choice-row" role="group" aria-label="기기 선택"><button type="button" data-a03-device="pc" aria-pressed="true">PC <small>Personal Computer</small></button><button type="button" data-a03-device="chromebook" aria-pressed="false">Chromebook</button><button type="button" data-a03-device="ipad" aria-pressed="false">iPad <small>Tablet</small></button><button type="button" data-a03-device="phone" aria-pressed="false">Phone <small>Android형</small></button></div></fieldset>
                        <fieldset><legend>2. 운영체제 <small>Operating System</small></legend><div class="foundation-choice-row" role="group" aria-label="운영체제 선택"><button type="button" data-a03-os="windows" aria-pressed="true">Windows</button><button type="button" data-a03-os="chromeos" aria-pressed="false">ChromeOS</button><button type="button" data-a03-os="ipados" aria-pressed="false">iPadOS</button><button type="button" data-a03-os="android" aria-pressed="false">Android</button></div></fieldset>
                        <fieldset><legend>3. 앱 <small>Application</small></legend><div class="foundation-choice-row" role="group" aria-label="앱 선택"><button type="button" data-a03-app="paint" aria-pressed="true">PC 그림판 <small>Windows App</small></button><button type="button" data-a03-app="chrome-files" aria-pressed="false">파일 앱 <small>ChromeOS App</small></button><button type="button" data-a03-app="ipad-sketch" aria-pressed="false">iPad 스케치 <small>iPadOS App</small></button><button type="button" data-a03-app="android-camera" aria-pressed="false">카메라 <small>Android App</small></button></div></fieldset>
                    </div>
                    <div class="a03-workbench">
                        <div class="a03-layer-machine" aria-label="선택한 기기 운영체제 앱의 층 구조"><article class="a03-layer app-layer" data-a03-layer="app"><span>앱 <small>App</small></span><strong data-a03-current-app>PC 그림판</strong><p data-a03-app-package>Windows용 .exe와 Windows API 요청</p></article><span class="a03-layer-link" aria-hidden="true">↕</span><article class="a03-layer os-layer" data-a03-layer="os"><span>운영체제 <small>Operating System</small></span><strong data-a03-current-os>Windows</strong><p data-a03-os-job>PC 장치 드라이버와 Windows API 제공</p></article><span class="a03-layer-link" aria-hidden="true">↕</span><article class="a03-layer device-layer" data-a03-layer="device"><span>기기 <small>Device</small></span><strong data-a03-current-device>PC</strong><p data-a03-device-hardware>PC 펌웨어·CPU·메모리·화면</p></article></div>
                        <aside class="a03-proof-panel" aria-live="polite"><div class="a03-app-preview" data-a03-preview><span aria-hidden="true"></span><strong data-a03-preview-title>실행 확인 전</strong><p data-a03-preview-copy>세 층을 고른 뒤 호환성을 확인하세요.</p></div><ol><li data-a03-proof="boot"><b>① 기기 ↔ OS</b><span data-a03-boot-proof>확인 전</span></li><li data-a03-proof="api"><b>② OS ↔ 앱</b><span data-a03-api-proof>확인 전</span></li><li data-a03-proof="run"><b>③ 실행 결과</b><span data-a03-run-proof>확인 전</span></li></ol><button type="button" class="foundation-run" data-a03-run>호환성 확인 <small>Check &amp; Run</small></button></aside>
                    </div>
                </section>`,
            details: [
                ["기기", "Device", "iPad · Chromebook · 스마트폰 · PC처럼 실제 부품으로 이루어진 제품입니다. 제조사와 제품명은 운영체제 이름과 같지 않을 수 있습니다."],
                ["운영체제", "Operating System / OS", "Windows · Android · iOS · iPadOS · macOS · ChromeOS · Linux처럼 앱 실행, 파일, 화면, 입력 장치와 권한을 관리하는 기본 소프트웨어입니다."],
                ["앱", "Application / App", "브라우저 · 카메라 · 문서 편집기처럼 특정 작업을 수행하는 소프트웨어입니다. 같은 앱도 여러 운영체제용 버전이 따로 있을 수 있습니다."],
                ["층 사이의 요청", "Requests Between Layers", "앱은 운영체제에 파일 저장이나 카메라 사용을 요청하고, 운영체제는 드라이버를 통해 하드웨어를 제어합니다."]
            ],
            deviceComparison: {
                title: "제품 이름·운영체제·앱을 층으로 나누기",
                english: "Device, OS, and App Layers",
                intro: "내부 사진은 기기 하드웨어를 보여 줍니다. 그 위에서 운영체제가 부품을 관리하고, 앱은 운영체제에 작업을 요청합니다.",
                cards: [
                    { title: "PC", english: "Device", image: asset("desktop-hardware-cutaway-768.webp"), alt: "데스크톱 PC의 대표 내부 하드웨어", relation: "PC → Windows·Linux → Edge·그림 앱", note: "PC는 제품 종류이고 Windows는 운영체제입니다." },
                    { title: "Chromebook", english: "Device Family", image: asset("chromebook-internals-exploded-768.webp"), alt: "Chromebook형 노트북의 대표 내부 하드웨어", relation: "Chromebook → ChromeOS → Chrome·파일 앱", note: "Chromebook과 ChromeOS와 Chrome은 비슷하게 들리지만 서로 다른 층입니다." },
                    { title: "iPad", english: "Tablet Device", image: asset("tablet-internals-exploded-768.webp"), alt: "iPad와 비슷한 태블릿의 대표 내부 하드웨어", relation: "iPad → iPadOS → Safari·그림 앱", note: "iPad는 기기, iPadOS는 운영체제, Safari는 앱입니다." },
                    { title: "스마트폰", english: "Smartphone Device", image: asset("smartphone-internals-exploded-768.webp"), alt: "스마트폰의 대표 내부 하드웨어", relation: "Galaxy 등 → Android → 카메라·브라우저 앱 / iPhone → iOS → Safari", note: "회사·제품 계열·운영체제·앱을 한 이름처럼 섞지 않습니다." }
                ]
            },
            workedExample: {
                title: "카메라 앱으로 사진을 찍을 때",
                english: "A Photo Request Through Three Layers",
                intro: "앱이 카메라를 직접 마음대로 움직이는 것이 아니라 운영체제에 요청하고 결과를 돌려받습니다.",
                steps: [
                    ["앱의 요청", "App Request", "카메라 앱이 운영체제에 카메라 사용과 촬영을 요청합니다."],
                    ["권한 확인", "Permission Check", "운영체제가 이 앱에 카메라 권한이 있는지 확인합니다."],
                    ["장치 제어", "Device Control", "운영체제와 드라이버가 이미지 센서 하드웨어를 켜고 빛을 측정하게 합니다."],
                    ["데이터 전달", "Data Return", "센서 데이터가 RAM으로 들어오고 앱이 미리보기와 보정을 처리합니다."],
                    ["파일 저장", "File Save", "앱이 저장을 요청하면 운영체제가 파일 이름·위치·접근 권한을 관리해 저장 장치에 기록합니다."]
                ]
            },
            comparisons: {
                title: "같이 불려도 층은 다르다",
                english: "Name the Correct Layer",
                cards: [
                    ["iPad·Chromebook·PC", "Device", "CPU·메모리·화면이 들어 있는 실제 제품", "손에 들거나 책상에 놓을 수 있음"],
                    ["iPadOS·ChromeOS·Windows", "Operating System", "앱·파일·장치·권한을 관리", "기기를 켜면 기본 환경을 제공"],
                    ["Safari·Chrome·그림 앱", "Application", "사용자가 고른 특정 작업을 수행", "웹 보기·그리기·촬영 같은 목적"],
                    ["Google 검색·학교 홈페이지", "Service / Website", "앱을 통해 접속하는 인터넷상의 대상", "브라우저 자체와 웹사이트는 서로 다름"]
                ]
            },
            analogy: {
                title: "비유: 학교 건물·운영 규칙·동아리",
                english: "School Analogy",
                text: "학교 건물과 교실은 기기, 교실 배정과 출입을 관리하는 운영 규칙은 운영체제, 미술부·방송부처럼 특정 활동을 하는 모임은 앱에 비유할 수 있습니다.",
                limit: "운영체제는 교장 선생님처럼 생각하는 사람이 아닙니다. 미리 작성된 규칙과 프로그램으로 메모리·파일·장치 사용을 배분합니다.",
                teachback: "‘Chromebook에서 Chrome으로 웹사이트를 연다’는 문장에서 기기·운영체제·앱·웹사이트를 나누어 말해 보세요."
            },
            activity: { type: "none" },
            questions: [
                {
                    text: "Chromebook에서 Chrome을 열어 학교 사이트를 보았습니다. 기기–운영체제–앱 순서로 올바르게 배열한 것은 무엇입니까?",
                    options: ["Chrome–ChromeOS–Chromebook", "Chromebook–ChromeOS–Chrome", "ChromeOS–Chromebook–Chrome", "Chromebook–Chrome–ChromeOS"],
                    answer: 1,
                    concept: "세 층 · Three Layers",
                    explanation: "Chromebook은 기기, ChromeOS는 기기를 관리하는 운영체제, Chrome은 웹을 여는 앱입니다."
                },
                {
                    text: "iPad의 그림 앱이 사진 보관함을 열려고 하자 접근 허용 창이 나타났습니다. 이 허용을 관리하는 층은 무엇입니까?",
                    options: ["그림 앱이 자신의 접근 범위를 직접 결정한다", "iPadOS 운영체제가 앱별 접근 권한을 관리한다", "iPad 기기가 앱 종류가 달라도 이전에 정한 권한을 그대로 적용한다", "사진 보관함의 첫 번째 파일이 다른 앱의 권한을 정한다"],
                    answer: 1,
                    concept: "운영체제 · Operating System",
                    explanation: "앱의 사진·카메라·마이크 접근 권한은 운영체제가 관리합니다."
                },
                {
                    text: "Android 스마트폰에 설치하려던 앱이 현재 Android 버전을 지원하지 않습니다. 가장 직접적인 관계는 무엇입니까?",
                    options: ["앱과 운영체제의 호환성", "화면 크기와 배터리 색상", "파일 이름과 스피커 크기", "키보드와 카메라 렌즈"],
                    answer: 0,
                    concept: "호환성 · Compatibility",
                    explanation: "앱은 특정 운영체제가 제공하는 기능과 규칙에 맞게 만들어지므로 지원 버전이 맞아야 합니다."
                },
                {
                    text: "같은 웹 서비스를 Windows PC에서는 Edge로, iPad에서는 Safari로 열었습니다. 달라진 앱과 운영체제의 조합은 무엇입니까?",
                    options: ["Edge–Windows와 Safari–iPadOS", "Windows–Edge와 iPad–Safari", "PC–Windows와 iPad–iPadOS", "웹사이트–PC와 인터넷–iPad"],
                    answer: 0,
                    concept: "플랫폼 · Platform",
                    explanation: "Edge와 Safari는 앱이고, Windows와 iPadOS는 각각의 운영체제입니다."
                },
                {
                    text: "카메라 앱의 촬영 요청이 실제 카메라 부품까지 전달되는 순서로 알맞은 것은 무엇입니까?",
                    options: ["앱 → 운영체제 → 장치 드라이버 → 카메라 센서", "앱 → 카메라 센서 → 장치 드라이버 → 운영체제", "운영체제 → 앱 → 카메라 센서 → 장치 드라이버", "장치 드라이버 → 앱 → 운영체제 → 카메라 센서"],
                    answer: 0,
                    concept: "층 사이 요청 · Requests Between Layers",
                    explanation: "앱은 운영체제에 요청하고, 운영체제는 장치 드라이버를 거쳐 카메라 센서가 이해할 신호를 전달합니다."
                },
{
                    text: "iPhone에서 Safari로 학교 웹사이트를 열었습니다. 회사·기기·운영체제·앱을 순서대로 올바르게 연결한 것은 무엇입니까?",
                    options: ["Apple–iPhone–iOS–Safari", "iPhone–Apple–Safari–iOS", "Apple–iOS–iPhone–Safari", "Safari–iPhone–Apple–iOS"],
                    answer: 0,
                    concept: "회사·기기·운영체제·앱 · Company, Device, Operating System, and App",
                    explanation: "Apple은 회사, iPhone은 기기 제품 계열, iOS는 운영체제, Safari는 웹 브라우저 앱입니다."
                }
            ]
        }
    );
})();
