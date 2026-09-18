(() => {
    "use strict";
    // g02 차시의 다시 쓴 문항. 같은 번호가 여럿이면 뒤엣것이 살아남는다.
    (window.COMPUTER_REVIEWED_QUESTIONS = window.COMPUTER_REVIEWED_QUESTIONS || []).push(
        ["g02", 3, {
            text: "클라우드에 빈 공간이 64GB 있습니다. 7GB짜리 영상을 넣되 최소 8GB는 남기려고 합니다. 영상은 최대 몇 개까지 넣을 수 있습니까?",
            options: ["7개", "9개", "8개", "10개"],
            answer: 2, concept: "Capacity Calculation",
            explanation: "사용 가능한 공간은 64−8=56GB이고, 56÷7=8이므로 7GB 영상은 최대 8개를 넣을 수 있습니다."
        }],
        ["g02", 5, {
            text: "표시 용량이 128GB인 기기에서 사용 가능한 공간은 그보다 작게 보입니다. 가장 알맞은 설명은 무엇입니까?",
            options: ["운영체제와 이미 저장된 파일이 공간 일부를 쓰기 때문이다", "128GB는 RAM 크기이고 저장 공간은 따로 정해지기 때문이다", "빈 공간은 인터넷에 연결된 뒤에야 계산되기 때문이다", "저장 장치는 쓸수록 전체 용량이 조금씩 닳기 때문이다"],
            answer: 0, concept: "Usable Storage",
            explanation: "전체 저장 공간 중 일부는 운영체제와 기기 관리 정보, 기존 파일이 사용합니다. 제조사와 운영체제의 단위 표시 기준도 차이를 만들 수 있습니다."
        }],
        ["g02", 4, {
            text: "A 기록은 24 byte이고 B 기록은 128 bit입니다. 1 byte가 8 bit일 때 어느 기록이 얼마나 더 큽니까?",
            options: ["A가 8 byte 더 크다", "B가 104 byte 더 크다", "A가 16 byte 더 크다", "두 기록의 크기가 같다"],
            answer: 0, concept: "Bit and Byte Comparison",
            explanation: "B의 128 bit를 byte로 바꾸면 128 ÷ 8 = 16 byte입니다. A는 24 byte이므로 B보다 24 − 16 = 8 byte 더 큽니다."
        }],
    );
})();
