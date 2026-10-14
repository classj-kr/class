// 가정통신문 카드.
//
// 알림장(학급 게시판 글)과 가정통신문은 원래 다른 페이지에 있었다. 그런데 학부모도
// 알림장을 봐야 하고 학생도 가정통신문을 봐야 해서, 한 흐름에 나란히 세운다.
// 여기서 만드는 건 그 흐름에 끼는 가정통신문 한 장이다.
//
// 보는 사람이 누구냐에 따라 '보이는 것'이 아니라 '누를 수 있는 것'만 달라진다.
// 회신·동의·설문은 보호자만 한다. 학생에게는 단추 대신 "보호자 회신 필요"만 뜬다.
// (서버도 같은 규칙을 지킨다. 화면만 감추면 막은 게 아니다.)
(function (global) {
    const REPLY_LABELS = {
        confirmed: '확인함',
        agree: '동의',
        disagree: '미동의',
        submitted: '제출함'
    };

    const KIND_LABELS = {
        none: '가정통신문',
        confirm: '확인 회신',
        agree: '동의서',
        survey: '설문·신청'
    };

    function hasQuestions(notice) {
        return Array.isArray(notice.questions) && notice.questions.length > 0;
    }

    // 회신 방법과 문항은 따로 붙는다. 동의를 받으면서 문항까지 묻는 글이 있으므로
    // 딱지도 둘을 합쳐 보여 준다.
    function kindLabel(notice) {
        const asked = hasQuestions(notice);
        if (notice.replyType === 'none' || !notice.replyType) {
            return asked ? '설문·신청' : '가정통신문';
        }
        const base = KIND_LABELS[notice.replyType] || '가정통신문';
        return asked ? `${base} · 문항` : base;
    }

    // 이 사람이 무엇이든 답해야 하는 글인지.
    function wantsAnswer(notice) {
        return (notice.replyType && notice.replyType !== 'none') || hasQuestions(notice);
    }

    function esc(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatWhen(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return '';
        return d.toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    // 이 사람이 이 통신문에 대해 아직 할 일이 남았는지. '할 일' 거르개가 이걸 쓴다.
    function needsAction(notice, viewerRole) {
        return viewerRole === 'guardian' && wantsAnswer(notice) && !notice.myReply;
    }

    function surveyFormHtml(notice) {
        const questions = notice.questions || [];
        if (questions.length === 0) {
            return '<p class="notice-hint">문항이 없습니다.</p>';
        }
        const body = questions.map((q, index) => {
            const mine = q.myAnswer;
            const head = `<p class="survey-q-title">${index + 1}. ${esc(q.text)}`
                + (q.required ? ' <span class="survey-required">*필수</span>' : '')
                + (q.type === 'multiple' ? ' <span class="notice-hint">(복수 선택)</span>' : '')
                + '</p>';

            if (q.type === 'text') {
                return `<div class="survey-q" data-question-id="${esc(q.id)}" data-type="text">
                    ${head}
                    <textarea class="survey-text" rows="2" placeholder="답변을 적어 주세요">${esc(mine ? mine.text : '')}</textarea>
                </div>`;
            }

            const inputType = q.type === 'multiple' ? 'checkbox' : 'radio';
            const chosen = mine ? (mine.choiceIndexes || []) : [];
            const options = (q.options || []).map((label, i) => `
                <label class="survey-option">
                    <input type="${inputType}" name="q_${esc(q.id)}" value="${i}"${chosen.includes(i) ? ' checked' : ''}>
                    <span>${esc(label)}</span>
                </label>`).join('');

            return `<div class="survey-q" data-question-id="${esc(q.id)}" data-type="${esc(q.type)}">
                ${head}
                ${options}
            </div>`;
        }).join('');

        return body;
    }

    // 무엇을 물어보는 글인지 한 줄로. 조각을 이어 붙이면 '여부과' 같은 말이 나와서
    // 경우마다 문장을 그대로 적는다.
    function askLine(notice) {
        const asked = hasQuestions(notice);
        if (notice.replyType === 'confirm') {
            return asked ? '확인 회신과 아래 문항에 답해 주세요.' : '읽으셨는지 확인 회신을 해 주세요.';
        }
        if (notice.replyType === 'agree') {
            return asked ? '동의 여부와 아래 문항에 답해 주세요.' : '보호자 동의 여부를 회신해 주세요.';
        }
        return '아래 문항에 답해 주세요.';
    }

    // 회신 칸. 보호자에게는 답하는 자리, 학생에게는 안내만.
    //
    // 회신 방법과 문항은 따로 붙는다 -- 동의를 받으면서 알레르기를 묻는 글이 있다.
    // 그래서 단추와 문항을 함께 그리고, 한 번에 보낸다.
    function replyBoxHtml(notice, viewerRole) {
        if (!wantsAnswer(notice)) return '';

        if (viewerRole !== 'guardian') {
            const done = notice.myReply
                ? `<span class="reply-done">보호자가 ${esc(REPLY_LABELS[notice.myReply.choice] || notice.myReply.choice)}</span>`
                : '<span class="reply-waiting">보호자 회신이 아직 없습니다</span>';
            // 집에 가서 말하라는 신호가 된다.
            return `<div class="reply-box">${done}</div>`;
        }

        // 이미 답했으면 요약만. 고치려면 다시 열어야 한다.
        if (notice.myReply) {
            return `<div class="reply-box replied">
                <span class="reply-done">${esc(REPLY_LABELS[notice.myReply.choice] || notice.myReply.choice)}</span>
                <span class="notice-hint">${esc(formatWhen(notice.myReply.repliedAt))} 회신함</span>
                <button type="button" class="btn-secondary" data-act="redo">회신 바꾸기</button>
            </div>`;
        }

        const buttons = notice.replyType === 'confirm'
            ? '<button type="button" class="btn" data-act="reply" data-choice="confirmed">확인했습니다</button>'
            : notice.replyType === 'agree'
                ? '<button type="button" class="btn" data-act="reply" data-choice="agree">동의합니다</button>'
                  + '<button type="button" class="btn-secondary" data-act="reply" data-choice="disagree">동의하지 않습니다</button>'
                : '<button type="button" class="btn" data-act="reply" data-choice="submitted">제출하기</button>';

        return `<div class="reply-box">
            <p class="reply-need">${esc(askLine(notice))}</p>
            ${hasQuestions(notice) ? surveyFormHtml(notice) : ''}
            <div class="reply-actions">${buttons}</div>
        </div>`;
    }

    // ctx: { viewerRole, child, onChanged }
    // child 는 학부모가 자녀 여럿일 때 어느 아이 것인지 서버에 알리는 값이다.
    function render(notice, ctx) {
        const article = document.createElement('article');
        article.className = 'post-card notice-card';
        article.dataset.noticeId = String(notice.id);

        const kind = kindLabel(notice);
        article.innerHTML = `
            <header class="post-header">
                <div class="post-author-info">
                    <div class="avatar teacher">${esc(String(notice.senderName || '학교').charAt(0))}</div>
                    <div>
                        <div class="author-name">
                            <span>${esc(notice.senderName || '학교')}</span>
                            <span class="author-role notice-kind">${esc(kind)}</span>
                        </div>
                        <div class="post-date">${esc(formatWhen(notice.createdAt))}</div>
                    </div>
                </div>
            </header>
            <div class="post-content notice-content">
                <p class="notice-title">${esc(notice.title)}</p>
                <div class="notice-body">${esc(notice.contentBody || '')}</div>
            </div>
            <div class="reply-slot">${replyBoxHtml(notice, ctx.viewerRole)}</div>`;

        bind(article, notice, ctx);
        return article;
    }

    function bind(article, notice, ctx) {
        const slot = article.querySelector('.reply-slot');
        if (!slot) return;

        slot.addEventListener('click', async (event) => {
            const button = event.target.closest('button[data-act]');
            if (!button) return;
            const act = button.dataset.act;

            if (act === 'redo') {
                // 다시 답하는 건 그냥 한 번 더 보내는 것이다. 서버가 덮어쓴다.
                slot.innerHTML = replyBoxHtml({ ...notice, myReply: null }, ctx.viewerRole);
                return;
            }

            if (act !== 'reply') return;

            // 고른 것과 문항 답을 한 번에 보낸다. 회신만 있는 글이면 답이 빈 채로,
            // 문항만 있는 글이면 choice 가 'submitted' 로 간다.
            const payload = { noticeId: notice.id, ...(ctx.child || {}) };
            payload.choice = button.dataset.choice;
            const boxes = Array.from(article.querySelectorAll('.survey-q'));
            if (boxes.length > 0) {
                payload.answers = boxes.map(box => {
                    const questionId = box.dataset.questionId;
                    if (box.dataset.type === 'text') {
                        return { questionId, text: box.querySelector('.survey-text').value.trim() };
                    }
                    return {
                        questionId,
                        choiceIndexes: Array.from(box.querySelectorAll('input:checked')).map(i => Number(i.value))
                    };
                });
            }

            button.disabled = true;
            try {
                const res = await fetch('/api/notice/replies', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.message || '회신을 보내지 못했습니다.');
                if (typeof ctx.onChanged === 'function') await ctx.onChanged();
            } catch (error) {
                button.disabled = false;
                alert(error.message || '회신을 보내지 못했습니다.');
            }
        });
    }

    global.NoticeCard = { render, needsAction, KIND_LABELS };
})(window);
