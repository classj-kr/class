(() => {
    "use strict";
    // e01 차시의 다시 쓴 문항. 같은 번호가 여럿이면 뒤엣것이 살아남는다.
    (window.COMPUTER_REVIEWED_QUESTIONS = window.COMPUTER_REVIEWED_QUESTIONS || []).push(
        ["e01", 3, {
            text: "USB를 연결하기 전 C: 드라이브 용량은 120GB였습니다. 32GB USB를 연결하자 E: 드라이브가 새로 나타났고 C:는 120GB로 표시됩니다. 알맞은 해석은 무엇입니까?",
            options: ["USB 공간이 C:에 합쳐져 C:가 152GB가 되었다", "USB 공간이 RAM에 더해져 실행 메모리가 32GB 늘었다", "C:의 파일 일부가 E:로 이동해 C:가 88GB가 되었다", "E:라는 별도 저장 공간이 생기고 C: 용량은 그대로다"],
            answer: 3, concept: "Separate Drive",
            explanation: "USB는 내장 C:와 구별되는 E: 저장 위치로 인식되었습니다. 연결했다는 이유로 C:의 용량이나 RAM의 용량이 합쳐지지는 않습니다."
        }],
        ["e01", 4, {
            text: "과학 폴더 안에 식물·곤충 폴더를 만들고 파일들을 나누어 옮겼습니다. 달라진 것은 무엇입니까?",
            options: ["파일 형식은 같고 폴더 계층과 경로가 달라졌다", "폴더 계층은 같고 파일 형식과 내용이 달라졌다", "파일 경로는 같고 저장 드라이브의 용량이 줄었다", "파일 내용은 같고 두 하위 폴더가 별도 드라이브가 되었다"],
            answer: 0, concept: "Folder Hierarchy",
            explanation: "하위 폴더를 만들고 파일을 옮기면 드라이브 안의 계층과 파일 경로가 달라집니다. 파일의 내용·형식·크기를 바꾸는 작업은 아닙니다."
        }],
    );
})();
