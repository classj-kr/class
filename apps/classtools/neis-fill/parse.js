// 생활기록부 도우미(record-ai)의 「전체 복사」 글을 학생 목록으로 바꾼다.
//   1번 홍길동
//   문장…
//
//   2번 김철수
//   문장…
// 머리줄은 "번호번 이름" 꼴이고, 바로 앞 줄이 비어 있거나 첫 줄이어야 한다(본문 안의 "3번 문제…" 와 헷갈리지 않게).
// 그 아래 빈 줄 전까지가 그 학생의 문장이다. 첫 머리줄 앞의 "과목: 국어" 같은 표시줄은 meta 로 돌려준다.
(function (root) {
    const HEAD = /^\s*(\d{1,3})\s*번(?:\s+(.{1,24}))?\s*$/;
    // 첫 머리줄 앞에 오는 표시줄. 도우미의 「전체 복사」가 붙인다: "칸: 과목별 학기말 종합의견", "학기: 2학기", "과목: 국어".
    // 확장이 나이스 화면의 과목·학기와 대조해 다른 과목 칸에 넣는 실수를 막는 데 쓴다.
    const META = /^\s*(칸|학기|과목|영역)\s*[:：]\s*(.+?)\s*$/;
    const META_KEY = { '칸': 'area', '학기': 'semester', '과목': 'subject', '영역': 'subject' };

    function parseStudents(raw) {
        const lines = String(raw || '').replace(/\r\n?/g, '\n').split('\n');
        const out = [];
        const problems = [];
        const meta = {};
        let cur = null;
        let prevBlank = true;
        for (const line of lines) {
            const blank = !line.trim();
            const m = line.match(HEAD);
            const nameOk = m && (!m[2] || !/[.,!?。]/.test(m[2]));
            const mm = !cur && line.match(META);
            if (mm) {
                meta[META_KEY[mm[1]]] = mm[2];
                prevBlank = true;      // 표시줄 바로 다음에 머리줄이 와도 된다
                continue;
            }
            if (m && nameOk && prevBlank) {
                const name = (m[2] || '').trim();
                cur = { number: m[1], name, lines: [] };
                if (!name) problems.push(m[1] + '번: 이름이 없어 넣지 않습니다');
                out.push(cur);
            } else if (m && nameOk && cur && cur.lines.every(l => !l.trim())) {
                // 앞 줄이 빈 줄은 아니지만 바로 앞이 머리줄뿐이라면(글이 없는 학생) 새 머리줄로 본다.
                const name = (m[2] || '').trim();
                cur = { number: m[1], name, lines: [] };
                if (!name) problems.push(m[1] + '번: 이름이 없어 넣지 않습니다');
                out.push(cur);
            } else if (!blank && !cur) {
                problems.push('머리줄 앞의 글을 건너뜀: ' + line.trim().slice(0, 30));
            } else if (cur) {
                cur.lines.push(line);
            }
            prevBlank = blank;
        }
        const students = out.map(s => ({ number: s.number, name: s.name, text: cleanText(s.lines.join('\n')) }));
        students.forEach(s => { if (s.name && !s.text) problems.push(s.number + '번 ' + s.name + ': 문장이 없어 넣지 않습니다'); });
        return { students: students.filter(s => s.name && s.text), problems, meta };
    }

    // 나이스에 넣기 전 다듬기: 그림 글자(이모지) 제거, 줄 끝 공백 제거, 빈 줄은 하나로.
    function cleanText(text) {
        return String(text || '')
            .replace(/\p{Extended_Pictographic}️?/gu, '')
            .replace(/[ \t]+$/gm, '')
            .replace(/[ \t]{2,}/g, ' ')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    // 나이스 셈법: 한글 3바이트, 줄바꿈은 넉넉히 2바이트, 나머지는 UTF-8 길이.
    function neisBytes(text) {
        let n = 0;
        const enc = new TextEncoder();
        for (const ch of String(text || '')) n += ch === '\n' ? 2 : (ch === '\r' ? 0 : enc.encode(ch).length);
        return n;
    }

    const api = { parseStudents, neisBytes, cleanText };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    root.ClassjNeisParse = api;
})(typeof window !== 'undefined' ? window : globalThis);
