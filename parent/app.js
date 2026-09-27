// 학부모 메인. 첫 화면의 '보호자' 프로필 카드가 여기로 온다.
//
// 교사에게 교사 메인(classtools)이 있듯, 학부모가 할 일을 한자리에 모은다. 알림장과
// 가정통신문은 알림장 화면으로, 출결·서류는 서류 화면의 그 칸으로 보낸다.
// 교사이면서 학부모인 사람도 여기서 들어가면 학부모로 보이도록 as=guardian 을 붙인다.
const API_BASE = '/api';

function setMarks(tile, marks) {
    const box = tile.querySelector('.tile-marks');
    box.replaceChildren(...marks.filter(m => m.count > 0).map(m => {
        const el = document.createElement('span');
        el.className = `mark ${m.className}`;
        el.textContent = m.text(m.count);
        el.title = m.title(m.count);
        return el;
    }));
}

async function getJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} ${res.status}`);
    return res.json();
}

// 이 아이 앞으로 온 가정통신문 가운데 아직 회신하지 않은 것.
async function repliesDue(child) {
    const params = new URLSearchParams({
        grade: child.grade,
        classNumber: child.classNumber,
        studentNumber: child.studentNumber
    });
    const data = await getJson(`${API_BASE}/notice/list?${params}`).catch(() => ({ notices: [] }));
    return (data.notices || []).filter(n => NoticeCard.needsAction(n, 'guardian')).length;
}

async function init() {
    const me = await getJson(`${API_BASE}/auth/me`).catch(() => null);
    const children = Array.isArray(me?.guardianChildren) ? me.guardianChildren : [];
    // 보호자로 걸린 아이가 없으면 여기서 볼 것이 없다. 프로필 고르는 첫 화면으로.
    if (!me?.signedIn || children.length === 0) {
        location.replace('/');
        return;
    }

    document.getElementById('children').textContent = children
        .map(c => `${c.grade}학년 ${c.classNumber}반 ${c.studentName}`)
        .join(' · ');
    PushToggle.mount(document.getElementById('pushSlot'));

    const { boards = [] } = await getJson(`${API_BASE}/classboard/boards?as=guardian`).catch(() => ({}));
    const link = key => `/classboard/?as=guardian&board=${encodeURIComponent(key)}`;

    // 알림장: 학급·동아리 게시판. 새 글 수는 그 게시판들을 합친다.
    const postBoards = boards.filter(b => b.kind !== 'notice');
    const tileBoard = document.getElementById('tileBoard');
    if (postBoards.length > 0) {
        const withNew = postBoards.find(b => b.unreadCount > 0) || postBoards[0];
        tileBoard.href = link(withNew.key);
    }
    setMarks(tileBoard, [{
        count: postBoards.reduce((sum, b) => sum + (b.unreadCount || 0), 0),
        className: 'mark-new',
        text: n => (n > 99 ? '99+' : String(n)),
        title: n => `새 글 ${n}개`
    }]);

    // 가정통신문: 아이마다 한 칸. 새로 온 것과 회신할 것을 따로 센다.
    const noticeBoards = boards.filter(b => b.kind === 'notice');
    const tileNotice = document.getElementById('tileNotice');
    if (noticeBoards.length > 0) {
        const due = await Promise.all(noticeBoards.map(b => (b.child ? repliesDue(b.child) : 0)));
        const first = noticeBoards.find((b, i) => due[i] > 0) || noticeBoards.find(b => b.unreadCount > 0) || noticeBoards[0];
        tileNotice.href = link(first.key);
        setMarks(tileNotice, [
            {
                count: due.reduce((a, b) => a + b, 0),
                className: 'mark-reply',
                text: n => `회신 ${n}`,
                title: n => `아직 회신하지 않은 가정통신문 ${n}개`
            },
            {
                count: noticeBoards.reduce((sum, b) => sum + (b.unreadCount || 0), 0),
                className: 'mark-new',
                text: n => (n > 99 ? '99+' : String(n)),
                title: n => `새 가정통신문 ${n}개`
            }
        ]);
    }
}

init();
