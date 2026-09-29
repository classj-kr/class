/* 글 넘침 검사 — 브라우저에서 돌린다 (node 로는 글자 폭을 잴 수 없다).
   1280x800 창에서 world-tales 아무 쪽이나 연 뒤, 이 파일 내용을 콘솔에 붙이고
   await overflowScan(['aladdin', 'bambi'])  처럼 부른다. 책 이름을 비우면 전권.

   goTo() 로 넘기면 안 된다. 쪽 넘김은 0.48초 동안 잠겨 있어서 빨리 부르면 그 사이 부른
   쪽을 통째로 건너뛰고, 건너뛴 쪽은 잰 것처럼 보인다(2026-09-30 이 잘못으로 영어판 일곱 권의
   넘침을 놓쳤다). 그래서 current 를 직접 바꾸고 paint() 로 그린 뒤, 그림이 다 들어와
   칸 높이가 정해지고 나서 잰다. 그림이 들어오기 전에 재면 칸이 길어 넘침이 안 보인다. */
async function overflowScan(books) {
    if (!books || !books.length) {
        books = ['aesop-tales', 'aladdin', 'ali-baba', 'bambi', 'beauty-beast', 'bluebird', 'bremen',
            'caliph-stork', 'cinderella', 'donkey-traveler', 'elves-shoemaker', 'emperor-clothes', 'fir-tree',
            'flying-trunk', 'frog-prince', 'golden-deer', 'golden-goose', 'goldilocks', 'goose-girl',
            'hansel-gretel', 'happy-prince', 'humpbacked-horse', 'jack-beanstalk', 'little-mermaid',
            'magic-cloth', 'marco', 'match-girl', 'maya-bee', 'midas-ears', 'mother-holle', 'nightingale',
            'nobody-boy', 'nutcracker', 'oz-wizard', 'peter-rabbit', 'pied-piper', 'princess-pea',
            'puss-in-boots', 'rapunzel', 'red-hood', 'red-shoes', 'reynard', 'rumpelstiltskin', 'sinbad',
            'sleeping-beauty', 'snow-queen', 'snow-white', 'swan-lake', 'swineherd', 'three-pigs',
            'three-wishes', 'thumbelina', 'tin-soldier', 'tinderbox', 'twelve-dancing', 'ugly-duckling',
            'wild-swans', 'wolf-seven-kids'];
    }
    const base = location.pathname.replace(/world-tales\/.*$/, 'world-tales/');
    const out = {};
    for (const b of books) {
        const f = document.createElement('iframe');
        f.style.cssText = 'position:fixed;left:0;top:0;width:1280px;height:800px;border:0;z-index:99999';
        document.body.appendChild(f);
        f.src = base + b + '/index.html?t=' + Date.now();
        await new Promise(r => { f.onload = r; });
        const w = f.contentWindow;
        await w.document.fonts.ready;
        const res = {};
        for (const lang of ['ko', 'en']) {
            if (w.eval('LANG') !== lang) w.eval('langBtn.click()');
            const n = w.eval('PAGES.length');
            const bad = [];
            let cols = 0;
            for (let i = 0; i < n; i++) {
                w.eval('current = ' + i + '; paint();');
                const imgs = [...w.document.querySelectorAll('img')].filter(im => !im.complete);
                await Promise.all(imgs.map(im => new Promise(r => { im.onload = im.onerror = r; })));
                await new Promise(r => setTimeout(r, 0));
                for (const el of w.document.querySelectorAll('.spread-text-left,.spread-text-right,.after-col')) {
                    if (!el.offsetParent) continue;
                    cols++;
                    const d = el.scrollHeight - el.clientHeight;
                    if (d > 2) bad.push(i + ':' + el.className.split(' ')[0] + ':' + d + 'px:' + el.textContent.trim().slice(0, 18));
                }
            }
            res[lang] = bad.length ? bad : 'ok (' + n + '쪽, 칸 ' + cols + ')';
        }
        if (w.eval('LANG') !== 'ko') w.eval('langBtn.click()');
        out[b] = res;
        f.remove();
    }
    return out;
}
