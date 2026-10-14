/* 교사용 AI 연결. 키는 서버가 계정별로 암호화해 보관하고 구글에도 서버가 대신 요청한다.
   브라우저에는 아무것도 남기지 않는다(2026-10-06 — 교무실 공용 컴퓨터에 키가 남지 않게). */
(function (global) {
    'use strict';
    const API = '/api/teacher-ai';
    let account = '';
    let status = { registered: false, last4: '' };

    async function request(method, path, body) {
        const response = await fetch(API + path, {
            method,
            cache: 'no-store',
            credentials: 'same-origin',
            headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
            body: body === undefined ? undefined : JSON.stringify(body)
        });
        let data = null;
        try { data = await response.json(); } catch (_) { data = null; }
        if (!response.ok) {
            const error = new Error(data?.message || '서버가 요청을 처리하지 못했습니다 (' + response.status + ').');
            error.code = data?.error || 'REQUEST_FAILED';
            error.status = response.status;
            throw error;
        }
        return data;
    }

    // 예전 화면이 브라우저에 남겨 둔 키가 있으면 서버로 옮기고 지운다. 한 번만 일어난다.
    async function moveBrowserKeyToServer() {
        let legacy = '';
        const names = ['classroom_ai:' + encodeURIComponent(account) + ':gemini_api_key', 'gemini_api_key'];
        try { for (const name of names) legacy = legacy || String(localStorage.getItem(name) || '').trim(); } catch (_) { return; }
        if (!legacy) return;
        try {
            if (!status.registered) status = await request('PUT', '/key', { key: legacy });
        } catch (_) {
            // 서버가 안 받아 준 키(틀린 키 등)는 어차피 쓸 수 없으니 그냥 지운다.
        }
        try {
            for (const name of names) localStorage.removeItem(name);
            localStorage.removeItem('classroom_ai:' + encodeURIComponent(account) + ':gemini_model');
            localStorage.removeItem('gemini_model');
        } catch (_) {}
    }

    async function init() {
        account = '';
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        const me = await response.json();
        if (!response.ok || !me.signedIn || !me.isTeacher || !me.user?.email) {
            throw new Error('교사 계정으로 로그인해 주세요.');
        }
        account = me.user.email.trim().toLowerCase();
        status = await request('GET', '/key');
        await moveBrowserKeyToServer();
        return status;
    }

    function hasKey() { return status.registered; }
    // 키 자체는 브라우저로 오지 않는다. 등록 여부와 끝 네 자리만 안다.
    function getKey() { return status.registered ? '…' + status.last4 : ''; }
    function keyStatus() { return { ...status }; }

    async function saveKey(value) {
        const key = String(value || '').trim();
        if (!key) throw new Error('저장할 API 키를 입력해 주세요.');
        status = await request('PUT', '/key', { key });
        return status;
    }

    async function deleteKey() {
        status = await request('DELETE', '/key');
        return status;
    }

    async function checkConnection(value) {
        const key = String(value || '').trim();
        if (!key && !status.registered) throw new Error('확인할 API 키를 입력해 주세요.');
        return request('POST', '/check', key ? { key } : {});
    }

    global.ClassroomAI = Object.freeze({
        init, hasKey, getKey, keyStatus, saveKey, deleteKey, checkConnection,
        async generate(prompt, note) {
            if (!account) await init();
            if (!status.registered) throw new Error('내 정보의 AI 설정에서 API 키를 등록해 주세요.');
            if (note) note();
            const data = await request('POST', '/generate', { prompt: String(prompt || '') });
            return data.text;
        }
    });
})(window);
