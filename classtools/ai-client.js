/* Shared teacher AI connection. Keys stay in this browser, scoped to the signed-in account. */
(function (global) {
    'use strict';
    let account = '';
    function storageName(key) {
        if (!account) throw new Error('교사 계정으로 로그인해 주세요.');
        return 'classroom_ai:' + encodeURIComponent(account) + ':' + key;
    }
    const store = {
        get(key) { try { return localStorage.getItem(storageName(key)); } catch (_) { return null; } },
        set(key, value) { localStorage.setItem(storageName(key), value); },
        remove(key) { localStorage.removeItem(storageName(key)); }
    };
    async function init() {
        account = '';
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        const me = await response.json();
        if (!response.ok || !me.signedIn || !me.isTeacher || !me.user?.email) {
            throw new Error('교사 계정으로 로그인해 주세요.');
        }
        account = me.user.email.trim().toLowerCase();
        // Keep keys saved by the former record-writing screen usable without
        // asking the teacher to move or enter them again.
        try {
            const previousKey = localStorage.getItem('gemini_api_key');
            if (previousKey) {
                if (!store.get('gemini_api_key')) store.set('gemini_api_key', previousKey);
                localStorage.removeItem('gemini_api_key');
                localStorage.removeItem('gemini_model');
            }
        } catch (_) {
            throw new Error('저장된 API 키를 읽지 못했습니다. 브라우저의 사이트 저장소 설정을 확인해 주세요.');
        }
    }
    function getKey() { return store.get('gemini_api_key') || ''; }
    function saveKey(value) {
        const key = String(value || '').trim();
        if (!key) throw new Error('저장할 API 키를 입력해 주세요.');
        try { store.set('gemini_api_key', key); store.remove('gemini_model'); }
        catch (_) { throw new Error('브라우저에 키를 저장하지 못했습니다. 사이트 저장소 설정을 확인해 주세요.'); }
    }
    function deleteKey() {
        try { store.remove('gemini_api_key'); store.remove('gemini_model'); }
        catch (_) { throw new Error('키를 삭제하지 못했습니다. 브라우저의 사이트 데이터를 확인해 주세요.'); }
    }
    async function checkConnection(value) {
        const key = String(value || '').trim();
        if (!key) throw new Error('확인할 API 키를 입력해 주세요.');
        const response = await fetch(API_ROOT + '/models', {
            headers: authHeaders(key, false), signal: AbortSignal.timeout(20000)
        });
        if (!response.ok) throwForStatus(response.status, await readError(response));
        const data = await response.json();
        if (!Array.isArray(data.models) || !data.models.length) throw new Error('이 키로 사용할 수 있는 모델이 없습니다.');
    }
    const API_ROOT = 'https://generativelanguage.googleapis.com/v1beta';
    let lastGoogleMessage = '';

    function authHeaders(apiKey, withBody) {
        // 키를 주소 뒤에 붙이면 AQ. 로 시작하는 새 키를 구글이 받지 않고,
        // 중간 기록에 키가 그대로 남기도 한다. 머리말로 보낸다.
        const headers = { 'x-goog-api-key': apiKey };
        if (withBody) headers['Content-Type'] = 'application/json';
        return headers;
    }

    async function readError(res) {
        try { return ((await res.json()) || {}).error?.message || ''; } catch (_) { return ''; }
    }

    // 429 는 대개 "하루치를 다 썼다"가 아니라 "잠깐 너무 자주 불렀다"이다.
    // 몇 초면 풀리는 것을 하루치 소진이라 적었다가 거짓말을 한 적이 있다.
    // 구글이 하루 단위라고 말할 때만 그렇게 적는다.
    function isDailyQuota(why) {
        return /per\s*day|PerDay|GenerateRequestsPerDay|daily/i.test(String(why || ''));
    }

    // 구글이 "27초 뒤에 다시" 하고 알려 주면 그만큼 기다린다.
    function retryDelayFrom(why) {
        const text = String(why || '');
        const matched = text.match(/retry(?:Delay)?["'\s:]*([\d.]+)\s*s/i)
            || text.match(/in\s+([\d.]+)\s*seconds?/i);
        if (!matched) return 0;
        return Math.min(Math.round(Number(matched[1]) * 1000) + 500, 65000);
    }

    function throwForStatus(status, why) {
        if (status === 429) {
            if (isDailyQuota(why)) {
                throw new Error('일일 API 사용 한도에 도달했습니다. 한도가 초기화된 뒤 다시 시도해 주세요.');
            }
            throw new Error('API 요청 한도에 도달했습니다. 잠시 뒤 다시 시도해 주세요.'
                + (why ? ' (구글: ' + why + ')' : ''));
        }
        if (TRANSIENT.includes(status)) {
            throw new Error('지금 구글 쪽이 붐빕니다. 잠시 뒤에 다시 눌러 주세요.'
                + (why ? ' (구글: ' + why + ')' : ''));
        }
        if (status === 401 || status === 403) {
            throw new Error('API 키 또는 접근 권한을 확인해 주세요.'
                + (why ? ' (구글: ' + why + ')' : ''));
        }
        throw new Error('구글이 요청을 받아 주지 않았습니다 (' + status + ')' + (why ? ': ' + why : ''));
    }

    // gemini-3.8-flash 처럼 이름에 박힌 판 번호를 견줄 수 있는 수로 바꾼다.
    function modelRank(name) {
        const matched = String(name).match(/gemini-(\d+)(?:\.(\d+))?/i);
        if (!matched) return -1;
        return Number(matched[1]) * 1000 + Number(matched[2] || 0);
    }

    async function pickModel(apiKey, exclude) {
        const remembered = store.get('gemini_model');
        if (remembered && remembered !== exclude) return remembered;

        const res = await fetch(API_ROOT + '/models', { headers: authHeaders(apiKey, false) });
        if (!res.ok) throwForStatus(res.status, await readError(res));

        // 어떤 주소로 부를지는 아래에서 두 가지를 다 해 보므로, 여기서는 글을
        // 다루지 못하는 모델만 걸러 낸다.
        const names = ((await res.json()).models || [])
            .map(m => String(m.name || '').replace(/^models\//, ''))
            .filter(name => name && name !== exclude
                && !/(vision|image|audio|live|embedding|tts|banana|veo|imagen)/i.test(name));
        if (names.length === 0) throw new Error('이 키로 쓸 수 있는 모델이 없습니다.');

        // 글 다듬는 데에는 가벼운 것으로 넉넉하고, 공짜로 쓸 수 있는 몫도 많다.
        const flashes = names.filter(name => /flash/i.test(name)
            && !/(preview|exp|thinking|lite)/i.test(name));
        const pool = flashes.length > 0 ? flashes : names;
        const model = pool.slice().sort((a, b) => modelRank(b) - modelRank(a) || a.length - b.length)[0];
        store.set('gemini_model', model);
        return model;
    }

    // 답의 생김새도 주소마다 다르다. 어느 쪽이든 글자가 담긴 자리를 훑어 모은다.
    function extractText(data) {
        if (typeof data?.output_text === 'string' && data.output_text.trim()) return data.output_text;
        const found = [];
        const walk = (node) => {
            if (!node || typeof node !== 'object') return;
            if (Array.isArray(node)) { node.forEach(walk); return; }
            for (const [key, value] of Object.entries(node)) {
                if (key === 'text' && typeof value === 'string') found.push(value);
                else walk(value);
            }
        };
        walk(data);
        return found.join('\n');
    }

    // 429·500·502·503·504 는 구글 쪽 사정이다. 곧 풀리는 경우가 많다.
    // 429 는 "1분에 몇 번" 한도에 걸린 것이 대부분이라 기다렸다 다시 넣으면 된다.
    const TRANSIENT = [429, 500, 502, 503, 504];
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function callOnce(url, apiKey, body) {
        const res = await fetch(url, {
            method: 'POST',
            headers: authHeaders(apiKey, true),
            body: JSON.stringify(body)
        });
        if (res.ok) return { data: await res.json() };
        return { status: res.status, why: await readError(res) };
    }

    // 붐빌 때는 기다리는 시간을 늘려 가며 다시 넣어 본다. 하루치를 다 썼다면
    // 기다려도 소용없으니 곧바로 돌려보낸다.
    async function callWithRetry(url, apiKey, body, note) {
        let wait = 2000;
        for (let attempt = 1; ; attempt += 1) {
            const result = await callOnce(url, apiKey, body);
            if (result.data || !TRANSIENT.includes(result.status) || attempt >= 5) return result;
            if (result.status === 429 && isDailyQuota(result.why)) return result;
            if (note) note();   // 다시 넣는다는 말은 굳이 하지 않는다. 도는 고리로 보인다.
            await sleep(retryDelayFrom(result.why) || wait);
            wait *= 2;
        }
    }

    async function callGemini(model, apiKey, prompt, note) {
        const attempts = [
            [API_ROOT + '/interactions', {
                model,
                input: prompt,
                generation_config: { max_output_tokens: 4096 }
            }],
            [API_ROOT + '/models/' + model + ':generateContent', {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 4096 }
            }]
        ];

        let firstWhy = '';
        for (const [url, body] of attempts) {
            const result = await callWithRetry(url, apiKey, body, note);
            if (result.data) return result.data;
            if (!firstWhy) firstWhy = result.why;
            // 404 는 그 주소가 없다는 뜻, 400 은 보내는 모양이 안 맞는다는 뜻이다.
            // 둘 다 다른 주소로는 될 수 있으니 넘어가 본다. 나머지 오류는
            // 주소를 바꾼다고 풀리지 않으므로 바로 알린다.
            if (result.status !== 404 && result.status !== 400) {
                throwForStatus(result.status, result.why);
            }
        }
        lastGoogleMessage = firstWhy;
        return null;
    }

    async function ask(apiKey, prompt, note) {
        const first = await pickModel(apiKey);
        let data;
        try {
            data = await callGemini(first, apiKey, prompt, note);
        } catch (error) {
            if (!/붐빕니다/.test(error.message)) throw error;
            // 이 모델이 붐빈다. 다른 모델로 한 번만 더.
            store.remove('gemini_model');
            const other = await pickModel(apiKey, first);
            if (other === first) throw error;
            if (note) note('다른 모델(' + other + ')로 다시 해 봅니다…');
            data = await callGemini(other, apiKey, prompt, note);
        }
        if (data === null) {
            // 구글이 "이건 그만 쓰고 이걸 쓰라"며 이름을 적어 보내기도 한다.
            // 그러면 그대로 따라가고, 아니면 목록을 다시 받아 고른다.
            const suggested = /use\s+models\/([A-Za-z0-9._-]+)/i.exec(lastGoogleMessage || '');
            store.remove('gemini_model');
            let next;
            if (suggested) {
                next = suggested[1];
                store.set('gemini_model', next);
            } else {
                next = await pickModel(apiKey);
            }
            data = await callGemini(next, apiKey, prompt, note);
            if (data === null) {
                store.remove('gemini_model');
                throw new Error('구글이 요청을 받아 주지 않았습니다.'
                    + (lastGoogleMessage ? ' 구글이 알려 온 까닭: ' + lastGoogleMessage : ''));
            }
        }
        const text = extractText(data);
        if (!text.trim()) {
            const why = data?.promptFeedback?.blockReason;
            throw new Error(why
                ? '답을 받지 못했습니다(' + why + '). 적으신 내용을 바꿔 보세요.'
                : '답이 비어 있습니다. 활동을 좀 더 자세히 적어 보세요.');
        }
        return text;
    }


    global.ClassroomAI = Object.freeze({
        init, getKey, saveKey, deleteKey, checkConnection,
        async generate(prompt, note) {
            await init();
            const key = getKey();
            if (!key) throw new Error('내 정보의 AI 설정에서 API 키를 등록해 주세요.');
            return ask(key, prompt, note);
        }
    });
})(window);
