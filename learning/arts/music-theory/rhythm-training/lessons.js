(function () {
    "use strict";
    window.RhythmLessons = {
        id: "rhythm",
        name: "Rhythm​(리듬)",
        lessons: [
            {
                id: "values",
                title: "Note Values​(음표의 길이)",
                body: [
                    "4/4 박자는 한 마디를 4분음표 넷으로 세는 박자입니다. 위의 4는 마디마다 세는 박의 수, 아래의 4는 한 박이 4분음표라는 뜻입니다.",
                    "온음표는 네 박, 2분음표는 두 박, 4분음표는 한 박입니다. 음표마다 같은 길이의 쉼표가 있습니다."
                ],
                examples: [
                    { pattern: "w", caption: "Whole Note​(온음표) · 네 박" },
                    { pattern: "h h", caption: "Half Notes​(2분음표) · 두 박씩" },
                    { pattern: "q q q q", caption: "Quarter Notes​(4분음표) · 한 박씩" }
                ],
                level: 0
            },
            {
                id: "eighths",
                title: "Eighth Notes​(8분음표)",
                body: [
                    "4분음표를 반으로 자르면 8분음표입니다. 한 박에 둘이 들어가고, 대에 꼬리 하나가 붙습니다.",
                    "같은 박 안에 있는 8분음표는 꼬리 대신 대로 이어 적습니다."
                ],
                examples: [
                    { pattern: "e e q q q", caption: "첫째 박이 8분음표 둘" },
                    { pattern: "q e e q q", caption: "둘째 박이 8분음표 둘" },
                    { pattern: "e e e e q q", caption: "8분음표가 두 박" }
                ],
                level: 2
            },
            {
                id: "rests",
                title: "Rests​(쉼표)",
                body: [
                    "8분쉼표는 반 박을 쉽니다. 박의 앞을 쉬고 뒤를 치면 소리가 박에서 반 박 밀려 나옵니다.",
                    "쉼표는 치지 않는 자리이므로, 소리로는 그 앞 음표가 길어진 것과 구별되지 않습니다. 악보에서는 다르게 적히지만 귀에 들어오는 자리는 같습니다."
                ],
                examples: [
                    { pattern: "e -e q q q", caption: "박의 앞만 치기" },
                    { pattern: "-e e q q q", caption: "박의 뒤만 치기" },
                    { pattern: "q -q q -q", caption: "한 박씩 쉬기" }
                ],
                level: 1
            },
            {
                id: "syncopation",
                title: "Syncopation​(당김음)",
                body: [
                    "한 박보다 긴 음표는 박을 넘어 이어집니다. 2분음표를 둘째 박에서 시작하면 셋째 박에는 새로 치는 소리가 없습니다.",
                    "센 박이 아닌 자리에서 시작한 소리가 센 박을 넘겨 이어지는 것을 Syncopation​(당김음)이라고 합니다."
                ],
                examples: [
                    { pattern: "q h q", caption: "2분음표가 둘째 박에서 시작" },
                    { pattern: "e q q q e", caption: "반 박 밀린 당김음" },
                    { pattern: "e h qd", caption: "8분음표 뒤로 긴 음표가 이어짐" }
                ],
                level: 4
            },
            {
                id: "dotted",
                title: "Dotted Notes​(점음표)",
                body: [
                    "음표 오른쪽의 점은 그 음표 길이의 반을 더합니다. 점4분음표는 한 박 반, 점2분음표는 세 박입니다.",
                    "점8분음표와 16분음표가 짝을 이루면 한 박이 3 대 1로 나뉩니다."
                ],
                examples: [
                    { pattern: "qd e q q", caption: "점4분음표와 8분음표" },
                    { pattern: "ed s q q q", caption: "점8분음표와 16분음표" },
                    { pattern: "hd q", caption: "점2분음표와 4분음표" }
                ],
                level: 5
            },
            {
                id: "sixteenths",
                title: "Sixteenth Notes​(16분음표)",
                body: [
                    "8분음표를 다시 반으로 자르면 16분음표입니다. 한 박에 넷이 들어가고 꼬리가 둘입니다.",
                    "한 박을 16분음표 넷으로 세면 8분음표는 두 칸, 4분음표는 네 칸을 차지합니다. 한 박 안에서 16분음표와 8분음표를 섞으면 2+1+1, 1+1+2, 1+2+1 같은 모양이 나옵니다."
                ],
                examples: [
                    { pattern: "s s s s q q q", caption: "16분음표 넷" },
                    { pattern: "s s e q q q", caption: "16분음표 둘 뒤에 8분음표" },
                    { pattern: "e s s q q q", caption: "8분음표 뒤에 16분음표 둘" }
                ],
                level: 3
            },
            {
                id: "triplets",
                title: "Triplets​(셋잇단음표)",
                body: [
                    "한 박을 셋으로 똑같이 나눈 것이 Triplet​(셋잇단음표)입니다. 8분음표 셋을 대로 묶고 위에 3을 적습니다.",
                    "8분음표 둘은 한 박을 반씩 나누고, 셋잇단음표는 3분의 1씩 나눕니다. 16분음표 넷과는 개수도, 치는 자리도 다릅니다.",
                    "4·8·16칸으로는 3분의 1 자리를 적을 수 없으므로, 여기서부터는 악보를 골라 답합니다."
                ],
                examples: [
                    { pattern: "te te te q q q", caption: "첫째 박이 셋잇단음표" },
                    { pattern: "te te -te q q q", caption: "셋잇단음표의 셋째 자리를 쉬기" },
                    { pattern: "e e te te te q q", caption: "8분음표 둘과 셋잇단음표를 잇따라" }
                ],
                level: 6
            }
        ]
    };

})();
