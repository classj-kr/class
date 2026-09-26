(() => {
    "use strict";
    const asset = window.COMPUTER_IMAGE_ASSET;
    (window.COMPUTER_DETAILED_LESSONS = window.COMPUTER_DETAILED_LESSONS || []).push(
        {
            id: "a01",
            code: "A01",
            number: 1,
            domain: "컴퓨터의 기본 원리",
            title: "컴퓨터의 역할",
            english: "Functions of a Computer",
            conceptTitle: "컴퓨터는 정보를 받아 계산하고, 결과를 보여 주거나 저장합니다.",
            visual: `
                <section class="foundation-direct-lab a01-signal-lab" data-a01-lab data-input="camera" data-route="preview" data-run-state="idle" aria-labelledby="a01LabTitle">
                    <header class="foundation-lab-heading has-context">
                        <div><span>신호 추적 실험 <small>Signal Tracing Lab</small></span><h3 id="a01LabTitle">하나의 입력이 처리된 뒤 출력과 저장 중 어디로 가는지 실행해 보세요.</h3></div>
                        <button type="button" class="foundation-reset" data-a01-reset>처음 상태 <small>Reset</small></button>
                        <figure class="foundation-context-figure">
                            <img src="${asset("a01-input-process-output-storage-illustration-v1-768.webp")}" srcset="${asset("a01-input-process-output-storage-illustration-v1-768.webp")} 768w, ${asset("a01-input-process-output-storage-illustration-v1-1536.webp")} 1536w" sizes="(max-width: 620px) 244px, (max-width: 820px) 144px, (max-width: 1180px) 16vw, 190px" width="1536" height="1024" loading="eager" decoding="async" alt="바람개비에서 온 빛이 태블릿 카메라로 들어가 처리 칩을 거친 뒤 화면에 보이고 사진 파일로 저장되는 흐름">
                            <figcaption>출력·저장 두 경로<small>Output &amp; Storage</small></figcaption>
                        </figure>
                    </header>
                    <div class="a01-controls">
                        <fieldset><legend>1. 입력 고르기 <small>Choose Input</small></legend><div class="foundation-choice-row" role="group" aria-label="추적할 입력 선택">
                            <button type="button" data-a01-input="camera" aria-pressed="true"><span aria-hidden="true">▣</span>카메라 <small>Camera</small></button>
                            <button type="button" data-a01-input="keyboard" aria-pressed="false"><span aria-hidden="true">⌨</span>키보드 <small>Keyboard</small></button>
                            <button type="button" data-a01-input="microphone" aria-pressed="false"><span aria-hidden="true">◉</span>마이크 <small>Microphone</small></button>
                        </div></fieldset>
                        <fieldset><legend>2. 처리 뒤 보낼 길 <small>Choose Route</small></legend><div class="foundation-choice-row a01-route-row" role="group" aria-label="처리한 데이터의 경로 선택">
                            <button type="button" data-a01-route="preview" aria-pressed="true">출력만 <small>Output Only</small></button>
                            <button type="button" data-a01-route="save" aria-pressed="false">출력 + 파일 저장 <small>Output + Save</small></button>
                        </div></fieldset>
                        <button type="button" class="foundation-run" data-a01-run>신호 보내기 <small>Run Signal</small></button>
                    </div>
                    <div class="a01-signal-stage" aria-label="입력 데이터가 처리된 뒤 출력과 저장으로 갈라지는 경로">
                        <article class="a01-node a01-input-node" data-a01-node="input"><span>입력 <small>Input</small></span><strong data-a01-input-title>카메라</strong><p data-a01-input-data>센서가 빛의 밝기와 색을 측정</p></article>
                        <span class="a01-arrow" aria-hidden="true">→</span>
                        <article class="a01-node a01-process-node" data-a01-node="process"><span>처리 <small>Processing</small></span><strong data-a01-process-title>사진 데이터 만들기</strong><p data-a01-process-data>빛 값을 픽셀로 배열하고 색을 보정</p></article>
                        <span class="a01-branch" aria-hidden="true"><i></i><b></b></span>
                        <div class="a01-destinations">
                            <article class="a01-node a01-output-node" data-a01-node="output"><span>출력 <small>Output</small></span><strong data-a01-output-title>화면 미리보기</strong><p data-a01-output-data>픽셀이 장면을 바로 보여 줌</p><em data-a01-output-state>아직 실행하지 않음</em></article>
                            <article class="a01-node a01-storage-node" data-a01-node="storage"><span>저장 <small>Storage</small></span><strong data-a01-storage-title>photo.jpg</strong><p data-a01-storage-data>저장 장치에 사진 파일 기록</p><em data-a01-storage-state>경로를 선택하지 않음</em></article>
                        </div>
                    </div>
                    <div class="foundation-evidence a01-evidence" aria-live="polite"><strong>실행 증거 <small>Run Evidence</small></strong><p data-a01-status>입력과 경로를 고른 뒤 신호를 보내세요.</p><dl><div><dt>화면·소리</dt><dd data-a01-output-proof>대기 중</dd></div><div><dt>저장 장치</dt><dd data-a01-storage-proof>대기 중</dd></div></dl></div>
                </section>`,
            details: [
                ["입력", "Input", "사람의 조작이나 센서의 측정값을 컴퓨터 안으로 받는 역할입니다. 스마트폰의 터치 좌표, 카메라 센서가 측정한 빛, 키보드가 보낸 키 신호가 입력 데이터가 됩니다."],
                ["처리", "Processing", "CPU·GPU와 실행 중인 앱이 명령에 따라 데이터를 계산·비교·변환합니다. 카메라 앱은 센서 값을 픽셀로 배열하고 밝기와 색을 보정합니다."],
                ["출력", "Output", "처리 결과를 사람이 확인할 수 있게 나타냅니다. 디스플레이의 픽셀, 스피커의 소리, 프린터의 종이 출력이 서로 다른 출력 방식입니다."],
                ["저장", "Storage", "나중에 다시 사용할 데이터를 파일로 기록합니다. 화면에 잠깐 보이는 것과 SSD나 모바일 플래시 저장 장치에 기록되어 전원을 꺼도 남는 것은 다릅니다."]
            ],
            deviceComparison: {
                title: "같은 네 역할이 기기마다 어디에서 일어날까?",
                english: "One Principle Across Four Devices",
                intro: "모양은 달라도 입력–처리–출력–저장 관계는 같습니다. 아래 그림은 각 기기의 대표적인 내부 구조입니다.",
                cards: [
                    { title: "데스크톱 PC", english: "Desktop PC", image: asset("desktop-hardware-cutaway-768.webp"), alt: "열린 데스크톱 본체의 대표적인 내부 구조", relation: "마우스·키보드 → CPU·GPU → 모니터 / SSD·HDD", note: "처리와 저장 부품을 따로 교체할 수 있는 경우가 많습니다." },
                    { title: "Chromebook", english: "Chromebook", image: asset("chromebook-internals-exploded-768.webp"), alt: "화면과 키보드 아래 메인 기판, 배터리, 스피커가 분리된 Chromebook형 노트북의 대표 내부 구조", relation: "키보드·트랙패드 → 프로세서 → 화면 / 플래시 저장 장치", note: "노트북 본체 안에 화면·입력·배터리가 함께 들어 있습니다." },
                    { title: "태블릿·iPad", english: "Tablet / iPad", image: asset("tablet-internals-exploded-768.webp"), alt: "터치 디스플레이, 배터리 두 장, 로직 보드와 스피커가 분리된 태블릿의 대표 내부 구조", relation: "터치·카메라 → SoC → 화면·스피커 / 플래시 저장 장치", note: "터치스크린이 입력 장치와 출력 장치 역할을 함께 합니다." },
                    { title: "스마트폰", english: "Smartphone", image: asset("smartphone-internals-exploded-768.webp"), alt: "화면, 배터리, 로직 보드, 카메라와 작은 부품이 층별로 분리된 스마트폰의 대표 내부 구조", relation: "터치·센서 → SoC → 화면·진동 / 플래시 저장 장치", note: "작은 공간에 처리·통신·저장 부품이 촘촘하게 결합됩니다." }
                ]
            },
            workedExample: {
                title: "입력부터 저장까지의 처리 과정",
                english: "From Input to Storage",
                intro: "카메라로 들어온 데이터는 처리된 뒤 화면에 출력되고 파일로 저장됩니다.",
                steps: [
                    ["촬영 입력", "Capture Input", "손가락의 터치 좌표와 이미지 센서가 측정한 빛이 입력 데이터로 들어옵니다."],
                    ["RAM에 작업 준비", "Working in RAM", "카메라 앱과 센서 데이터가 CPU가 빠르게 사용할 수 있도록 RAM에 놓입니다."],
                    ["사진 처리", "Image Processing", "CPU와 영상 처리 장치가 픽셀 배열, 밝기, 색, 흔들림 보정을 계산합니다."],
                    ["화면 출력", "Display Output", "처리된 픽셀값에 따라 디스플레이의 작은 빛점들이 색과 밝기를 나타냅니다."],
                    ["파일 만들기", "File Encoding", "이 예시에서는 사진 데이터와 촬영 정보를 JPG 파일 규칙으로 묶습니다. 기기에 따라 HEIC 같은 다른 형식도 씁니다."],
                    ["저장 장치 기록", "Storage Write", "완성된 파일을 플래시 저장 장치에 기록해 화면을 끄거나 전원을 꺼도 다시 열 수 있게 합니다."]
                ]
            },
            comparisons: {
                title: "화면에 보이는 것과 저장된 것을 구별하기",
                english: "Display Is Not Storage",
                cards: [
                    ["카메라 미리보기", "Live Preview", "센서 입력을 계속 처리해 화면에 출력하는 중", "아직 촬영 파일이 만들어지지 않을 수 있음"],
                    ["저장된 사진", "Saved Photo", "정해진 파일 형식으로 저장 장치에 기록된 데이터", "전원을 껐다 켜도 사진 앱에서 다시 열 수 있음"],
                    ["앱 실행 중 작업", "Working Data", "현재 필요한 명령과 데이터가 RAM에 펼쳐진 상태", "일반적인 RAM 내용은 전원이 끊기면 유지되지 않음"],
                    ["사진 파일", "Photo File", "이름·형식·위치를 가진 데이터 묶음", "앱이 파일을 읽어 다시 화면에 출력할 수 있음"]
                ]
            },
            analogy: {
                title: "비유: 방송 제작실",
                english: "Broadcast Studio Analogy",
                text: "카메라와 마이크는 입력, 편집실은 처리, 방송 화면과 스피커는 출력, 녹화 보관실은 저장에 비유할 수 있습니다.",
                limit: "컴퓨터 데이터는 실제 방송 장비 사이를 한 번만 이동하는 물건이 아닙니다. 같은 데이터를 복사해 화면에 보여 주면서 파일로도 기록할 수 있습니다.",
                teachback: "사진이 화면에는 보이지만 파일로 저장되지 않은 상황을 입력·처리·출력·저장 중 어떤 역할이 끝나지 않은 것인지 설명해 보세요."
            },
            activity: { type: "none" },
            questions: [
                { text: "태블릿 카메라 화면에는 장면이 계속 보이지만 촬영 버튼을 누르지 않았습니다. 현재 일어난 역할의 조합으로 가장 알맞은 것은 무엇입니까?", options: ["센서 입력–영상 처리–화면 출력", "센서 입력–영상 처리–파일 저장", "화면 입력–센서 처리–영상 출력", "센서 입력–파일 저장–화면 출력"], answer: 0, concept: "입력·처리·출력 · Input, Processing, and Output", explanation: "미리보기는 센서가 빛을 입력하고 앱과 처리 장치가 계산한 결과를 화면에 출력한 상태입니다. 촬영 파일 저장은 아직 일어나지 않을 수 있습니다." },
                { text: "사진을 찍은 뒤 기기를 완전히 종료했다가 다시 켰는데도 사진 앱에서 열 수 있었습니다. 이 사실을 가장 직접적으로 뒷받침하는 것은 무엇입니까?", options: ["사진 데이터가 저장 장치에 파일로 기록되었다", "사진 앱이 카메라 센서에서 이전 장면을 다시 측정했다", "디스플레이 회로가 꺼지기 전 픽셀 빛을 보존했다", "프로세서가 원본 데이터 없이 같은 사진을 다시 계산했다"], answer: 0, concept: "저장 · Storage", explanation: "전원을 끈 뒤에도 다시 열 수 있으려면 사진 데이터가 비휘발성 저장 장치에 파일로 기록되어 있어야 합니다." },
                { text: "Chromebook에서 키를 눌렀더니 문서 앱이 글자가 들어갈 위치를 계산했습니다. 키 신호와 위치 계산의 역할을 순서대로 고르면 무엇입니까?", options: ["입력–처리", "처리–저장", "저장–출력", "출력–입력"], answer: 0, concept: "입력과 처리 · Input and Processing", explanation: "키보드는 눌린 키를 입력으로 보내고, 앱과 CPU는 현재 커서 위치와 입력 규칙을 처리합니다." },
                { text: "스마트폰에서 음악 파일을 열자 CPU가 파일 형식을 해석하고 스피커가 소리를 냈습니다. CPU와 스피커의 역할을 순서대로 고르면 무엇입니까?", options: ["처리–출력", "입력–저장", "저장–처리", "출력–입력"], answer: 0, concept: "처리와 출력 · Processing and Output", explanation: "파일 데이터를 해석하는 것은 처리이고, 전기 신호를 실제 소리로 나타내는 스피커는 출력 장치입니다." },
                { text: "그림 앱에서 선을 그린 직후 저장하지 않고 앱을 강제로 종료했습니다. 다시 열었을 때 선이 사라질 수 있는 이유는 무엇입니까?", options: ["선 데이터가 RAM에 있었고 아직 파일로 기록되지 않았기 때문이다", "강제 종료가 저장 장치에 있던 그림 파일까지 지웠기 때문이다", "선 데이터가 CPU 안에 보관되다가 앱 종료와 함께 지워졌기 때문이다", "터치 센서가 선을 그린 좌표를 기록하지 못했기 때문이다"], answer: 0, concept: "작업 데이터와 파일 · Working Data and Saved Files", explanation: "실행 중 작업이 RAM에 있고 저장 장치의 파일에 기록되지 않았다면 앱 종료 뒤 변경 내용이 남지 않을 수 있습니다." },
                { text: "PC, Chromebook, 태블릿, 스마트폰에서 공통으로 찾아야 할 관계는 무엇입니까?", options: ["입력을 받고 명령에 따라 처리한 뒤 결과를 출력하거나 저장한다", "처리 장치의 모양과 운영체제 이름이 일치해야 앱을 실행한다", "키보드나 터치 신호가 처리 장치를 거치지 않고 화면에 표시된다", "저장 장치가 앱 명령을 해석하고 CPU가 파일을 장기 보관한다"], answer: 0, concept: "공통 원리 · Common Computing Principle", explanation: "부품의 모양과 운영체제는 달라도 데이터를 입력받아 처리하고 출력하거나 저장하는 기본 관계는 공통입니다." }
            ]
        }
    );
})();
