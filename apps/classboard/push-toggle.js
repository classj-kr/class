// 휴대폰 알림 켜기·끄기 단추. 알림장과 학부모 메인이 함께 쓴다.
//
// 알림은 알림장의 서비스 워커(/classboard/sw.js)가 받는다. 학부모 메인에서 켜도 같은
// 워커에 등록한다 -- 워커가 둘이면 알림이 두 번 오거나 한쪽만 온다.
// 아이폰·아이패드는 화면을 홈 화면에 깔아야만 알림을 받을 수 있다(사파리 탭에는 알림
// 기능 자체가 없다). 그래서 단추는 두고, 누르면 까는 법을 알려 준다.
(function (global) {
    const API_BASE = '/api';
    const SUPPORTED = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    const IS_APPLE_MOBILE = /iPad|iPhone|iPod/.test(navigator.userAgent)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // 바깥 글꼴 없이 그리는 종. 켜져 있으면 속을 채운다.
    const BELL = '<svg class="push-toggle-icon" viewBox="0 0 24 24" aria-hidden="true" fill="FILL" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>';

    function base64UrlToBytes(value) {
        const padded = (value + '==='.slice((value.length + 3) % 4)).replace(/-/g, '+').replace(/_/g, '/');
        return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
    }

    // 알림장 워커의 등록. 처음이면 설치가 끝날 때까지 기다린다.
    async function registration() {
        const reg = await navigator.serviceWorker.register('/classboard/sw.js');
        if (reg.active) return reg;
        const worker = reg.installing || reg.waiting;
        if (!worker) return reg;
        await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('워커 설치가 끝나지 않음')), 15000);
            worker.addEventListener('statechange', () => {
                if (worker.state === 'activated') { clearTimeout(timer); resolve(); }
                if (worker.state === 'redundant') { clearTimeout(timer); reject(new Error('워커 설치 실패')); }
            });
        });
        return reg;
    }

    async function sendSubscription(sub) {
        const res = await fetch(`${API_BASE}/push/subscriptions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sub)
        });
        if (!res.ok) throw new Error('구독 저장 실패');
    }

    function mount(container) {
        if (!SUPPORTED && !IS_APPLE_MOBILE) return null;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'push-toggle';
        let subscribed = false;
        const render = () => {
            btn.classList.toggle('on', subscribed);
            btn.setAttribute('aria-pressed', String(subscribed));
            const label = subscribed ? '알림 받는 중' : '알림 받기';
            btn.title = subscribed ? '이 기기로 알림장 알림을 받고 있습니다. 누르면 끕니다.' : '새 알림장이 오면 이 기기로 알려 줍니다.';
            btn.innerHTML = `${BELL.replace('FILL', subscribed ? 'currentColor' : 'none')}<span class="push-toggle-text">${label}</span>`;
            btn.setAttribute('aria-label', label);
        };
        render();
        container.appendChild(btn);

        // 이미 켜 둔 기기면 주소를 서버에 다시 알린다. 같은 기기에 다른 식구가 로그인했으면
        // 이때 받는 사람이 지금 사람으로 바뀐다.
        if (SUPPORTED && Notification.permission === 'granted') {
            registration()
                .then(reg => reg.pushManager.getSubscription())
                .then(sub => {
                    if (!sub) return;
                    subscribed = true;
                    render();
                    return sendSubscription(sub);
                })
                .catch(e => console.error('알림 상태 확인 실패', e));
        }

        btn.addEventListener('click', async () => {
            if (!SUPPORTED) {
                alert(navigator.standalone
                    // 홈 화면에서 열었는데도 없다면 iOS 가 16.4 보다 옛것이다.
                    ? '이 아이폰·아이패드는 알림을 받으려면 소프트웨어 업데이트가 필요합니다. (설정 → 일반 → 소프트웨어 업데이트)'
                    : '아이폰·아이패드는 이 화면을 홈 화면에 추가한 뒤, 홈 화면에서 연 화면에서 알림을 켤 수 있습니다.\n\n사파리 아래쪽 공유 단추 → 홈 화면에 추가');
                return;
            }
            btn.disabled = true;
            try {
                if (subscribed) {
                    if (!confirm('이 기기에서 알림장 알림을 끌까요?')) return;
                    const reg = await registration();
                    const sub = await reg.pushManager.getSubscription();
                    if (sub) {
                        await fetch(`${API_BASE}/push/subscriptions`, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ endpoint: sub.endpoint })
                        });
                        await sub.unsubscribe();
                    }
                    subscribed = false;
                    render();
                    return;
                }

                // 허락 묻기는 누른 그 순간에 해야 한다. 앞에서 다른 걸 기다리면 사파리가 막는다.
                const permission = Notification.permission === 'granted'
                    ? 'granted'
                    : await Notification.requestPermission();
                if (permission !== 'granted') {
                    alert('알림이 꺼져 있습니다. 휴대폰이나 브라우저 설정에서 이 사이트의 알림을 허용한 뒤 다시 눌러 주세요.');
                    return;
                }
                const reg = await registration();
                let sub = await reg.pushManager.getSubscription();
                if (!sub) {
                    const keyRes = await fetch(`${API_BASE}/push/key`);
                    if (!keyRes.ok) throw new Error('서버 열쇠를 받지 못함');
                    const { publicKey } = await keyRes.json();
                    sub = await reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: base64UrlToBytes(publicKey)
                    });
                }
                await sendSubscription(sub);
                subscribed = true;
                render();
            } catch (e) {
                console.error('알림 설정 실패', e);
                alert('알림을 켜지 못했습니다. 잠시 뒤 다시 눌러 주세요.');
            } finally {
                btn.disabled = false;
            }
        });
        return btn;
    }

    global.PushToggle = { mount };
})(window);
