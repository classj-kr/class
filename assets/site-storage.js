/* 계정별 저장 공간(서버) — 화면이 브라우저에 두던 것을 로그인한 계정에 묶어 둔다.
   쓰는 법:
     const store = await SiteStorage.open('blackboard');   // 한 번 받아 둔다
     store.get('strokes')            // 받아 둔 값(없으면 undefined), 동기
     store.set('strokes', value)     // 바로 반영, 서버에는 잠시 모아서 보냄
     store.remove('strokes')
     store.persistent                // false 면 로그인 없음(게스트) — 이 탭 안에서만 기억하고 어디에도 남기지 않는다
   브라우저 저장소(localStorage)는 쓰지 않는다. 예전 값을 옮길 때만 읽고 바로 지운다. */
(function (global) {
    'use strict';
    const API = '/api/me/storage/';
    const FLUSH_DELAY_MS = 400;

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
            const error = new Error(data?.message || '저장 공간을 쓰지 못했습니다 (' + response.status + ').');
            error.status = response.status;
            error.code = data?.error || 'STORAGE_FAILED';
            throw error;
        }
        return data;
    }

    function createStore(app, items, persistent) {
        const cache = new Map(Object.entries(items || {}));
        const pending = new Map();   // item → 'put' | 'delete'
        let timer = null, flushing = null;
        const listeners = new Set();

        async function flushNow() {
            if (!persistent || pending.size === 0) return;
            const batch = new Map(pending); pending.clear();
            for (const [item, action] of batch) {
                try {
                    if (action === 'delete') await request('DELETE', app + '/' + item);
                    else await request('PUT', app + '/' + item, { value: cache.get(item) });
                } catch (error) {
                    for (const fn of listeners) { try { fn(error, item); } catch (_) {} }
                }
            }
        }
        function schedule() {
            if (!persistent) return;
            clearTimeout(timer);
            timer = setTimeout(() => { flushing = flushNow(); }, FLUSH_DELAY_MS);
        }
        // 탭을 닫을 때 모아 둔 것을 바로 보낸다(sendBeacon 은 PUT 을 못 하므로 fetch keepalive).
        const flushOnLeave = () => {
            if (!persistent || pending.size === 0) return;
            clearTimeout(timer);
            for (const [item, action] of pending) {
                try {
                    fetch(API + app + '/' + item, {
                        method: action === 'delete' ? 'DELETE' : 'PUT', keepalive: true, credentials: 'same-origin',
                        headers: action === 'delete' ? {} : { 'Content-Type': 'application/json' },
                        body: action === 'delete' ? undefined : JSON.stringify({ value: cache.get(item) })
                    });
                } catch (_) {}
            }
            pending.clear();
        };
        global.addEventListener('pagehide', flushOnLeave);

        return Object.freeze({
            app,
            persistent,
            get(item) { return cache.get(item); },
            has(item) { return cache.has(item); },
            keys() { return [...cache.keys()]; },
            set(item, value) {
                if (value === undefined) return this.remove(item);
                cache.set(item, value); pending.set(item, 'put'); schedule();
            },
            remove(item) {
                if (!cache.has(item) && !pending.has(item)) return;
                cache.delete(item); pending.set(item, 'delete'); schedule();
            },
            async flush() { clearTimeout(timer); await flushNow(); await flushing; },
            onError(fn) { listeners.add(fn); return () => listeners.delete(fn); },
            // 예전에 브라우저에 두던 값을 한 번 옮긴다. 서버에 이미 있으면 브라우저 것은 버린다.
            // 어느 쪽이든 브라우저에서는 지운다. moves: [{ localKey, item, parse }]
            adopt(moves) {
                for (const move of moves) {
                    let raw = null;
                    try { raw = localStorage.getItem(move.localKey); } catch (_) { continue; }
                    if (raw !== null && persistent && !cache.has(move.item)) {
                        let value = raw;
                        try { value = move.parse ? move.parse(raw) : JSON.parse(raw); } catch (_) { value = undefined; }
                        if (value !== undefined && value !== null) this.set(move.item, value);
                    }
                    try { localStorage.removeItem(move.localKey); } catch (_) {}
                }
            }
        });
    }

    const opened = new Map();
    async function open(app) {
        if (opened.has(app)) return opened.get(app);
        const promise = (async () => {
            try {
                const data = await request('GET', app);
                return createStore(app, data.items, true);
            } catch (error) {
                // 로그인이 없거나(게스트) 서버 DB가 준비되지 않았으면 이 탭 안에서만 기억한다.
                if (error.status === 401 || error.status === 403 || error.status === 503) return createStore(app, {}, false);
                throw error;
            }
        })();
        opened.set(app, promise);
        return promise;
    }

    global.SiteStorage = Object.freeze({ open });
})(window);
