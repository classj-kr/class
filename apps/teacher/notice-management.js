(function () {
    const dialog = document.getElementById('noticeEditDialog');
    const form = document.getElementById('noticeEditForm');
    const title = document.getElementById('noticeEditTitle');
    const body = document.getElementById('noticeEditBody');
    const error = document.getElementById('noticeEditError');
    const listError = document.getElementById('noticeManageError');
    const save = document.getElementById('noticeEditSave');
    const cancel = document.getElementById('noticeEditCancel');
    let notices = new Map();
    let editing = null;
    let request = 0;
    let saving = false;

    async function api(id, options = {}) {
        const res = await fetch(`/api/teacher/notices/${encodeURIComponent(id)}`, { cache: 'no-store', ...options });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || '처리하지 못했습니다. 다시 시도해 주세요.');
        return data;
    }

    async function openEditor(id) {
        const token = ++request;
        editing = null;
        error.textContent = '불러오는 중…';
        form.reset();
        title.disabled = body.disabled = save.disabled = true;
        body.required = true;
        dialog.showModal();
        try {
            const data = await api(id);
            if (token !== request || !dialog.open) return;
            editing = data.notice;
            title.value = editing.title;
            title.disabled = false;
            body.value = editing.contentBody;
            body.disabled = editing.contentType !== 'text';
            body.required = !body.disabled;
            save.disabled = false;
            error.textContent = '';
            title.focus();
        } catch (err) {
            if (token === request && dialog.open) error.textContent = err.message;
        }
    }

    cancel.addEventListener('click', () => dialog.close());
    dialog.addEventListener('cancel', event => { if (saving) event.preventDefault(); });
    dialog.addEventListener('close', () => { request++; editing = null; });

    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (!editing || saving) return;
        const current = editing;
        const contentBody = current.contentType === 'text' ? body.value.trim() : current.contentBody;
        if (!title.value.trim() || !contentBody.trim()) {
            error.textContent = '제목과 내용을 입력하세요.';
            return;
        }
        saving = true;
        save.disabled = cancel.disabled = true;
        save.textContent = '저장 중…';
        error.textContent = '';
        try {
            await api(current.id, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title.value.trim(), contentBody, version: current.version })
            });
            dialog.close();
            await window.loadNoticeReplies();
        } catch (err) { error.textContent = err.message; }
        finally {
            saving = false;
            save.disabled = cancel.disabled = false;
            save.textContent = '수정 저장';
        }
    });

    document.getElementById('noticeReplyList').addEventListener('click', async event => {
        const button = event.target.closest('[data-notice-action]');
        if (!button || button.disabled) return;
        const id = button.closest('[data-notice-id]')?.dataset.noticeId;
        const notice = notices.get(id);
        if (!notice?.canManage) return;
        listError.textContent = '';
        if (button.dataset.noticeAction === 'edit') return openEditor(id);
        if (!confirm(`“${notice.title}”을 삭제할까요?\n학생·학부모 알림장에서도 사라지며, 수집된 회신과 설문 응답도 함께 삭제됩니다.`)) return;
        button.disabled = true;
        try {
            await api(id, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ version: notice.version }) });
            await window.loadNoticeReplies();
        } catch (err) { listError.textContent = err.message; }
        finally { button.disabled = false; }
    });

    window.NoticeManagement = { setNotices(items) { notices = new Map(items.map(item => [String(item.id), item])); } };
})();
