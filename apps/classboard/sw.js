// 알림장 서비스 워커.
//
// 이 앱은 화면마다 서버에 물어봐야 하는 것뿐이라 오프라인으로 쓸 수는 없다.
// 그래도 껍데기를 캐시에 넣어 두면, 지하철에서 앱을 열었을 때 흰 화면 대신
// 최소한 틀이라도 뜬다. 늘 서버 것을 먼저 쓰고 실패할 때만 캐시를 꺼낸다.
const CACHE_NAME = 'classboard-v4';
const SHELL = [
  '/classboard/',
  '/classboard/index.html',
  '/classboard/style.css',
  '/classboard/app.js',
  '/classboard/notice-card.js',
  '/classboard/push-toggle.js',
  '/classboard/manifest.json',
  '/assets/icons/favicon.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    // 하나라도 없으면 addAll 이 통째로 실패해 설치가 안 된다. 한 장씩 넣는다.
    caches.open(CACHE_NAME).then((cache) => Promise.all(
      SHELL.map((url) => cache.add(url).catch(() => null))
    ))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // 서버에 물어보는 것은 캐시하지 않는다. 지난 알림장을 새 것인 양 보여 주면
  // 안 읽은 표시도, 회신 여부도 다 어긋난다.
  if (new URL(event.request.url).pathname.startsWith('/api/')) return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

// ── 휴대폰 알림 ──
// 서버가 보낸 알림을 띄우고, 누르면 그 게시판을 연다.
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : '' };
  }
  event.waitUntil(self.registration.showNotification(data.title || '알림장', {
    body: data.body || '새 글이 올라왔습니다.',
    icon: '/assets/icons/favicon.webp',
    badge: '/assets/icons/favicon.webp',
    data: { url: data.url || '/classboard/' }
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const wanted = (event.notification.data && event.notification.data.url) || '/classboard/';
  const target = new URL(wanted, self.location.origin);
  // 우리 사이트 밖으로는 열지 않는다.
  const href = target.origin === self.location.origin ? target.href : new URL('/classboard/', self.location.origin).href;
  event.waitUntil((async () => {
    // 알림장이 이미 열려 있으면 새 창을 또 띄우지 않고 그 창을 그 게시판으로 옮긴다.
    const windows = await clients.matchAll({ type: 'window' });
    for (const client of windows) {
      if (new URL(client.url).pathname.startsWith('/classboard/')) {
        try {
          await client.focus();
          await client.navigate(href);
          return;
        } catch (e) {
          break;
        }
      }
    }
    await clients.openWindow(href);
  })());
});

// 브라우저가 받는 주소를 바꿔 버리면(오래되어 만료 등) 새 주소를 서버에 다시 알린다.
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil((async () => {
    const keyRes = await fetch('/api/push/key');
    if (!keyRes.ok) return;
    const { publicKey } = await keyRes.json();
    const padded = (publicKey + '==='.slice((publicKey.length + 3) % 4)).replace(/-/g, '+').replace(/_/g, '/');
    const applicationServerKey = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
    const sub = await self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });
    await fetch('/api/push/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub)
    });
  })());
});
