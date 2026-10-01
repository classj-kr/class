# -*- coding: utf-8 -*-
"""그림책 틀 app.js 에 우리말 읽어 주기(미리 만든 소리 재생)를 붙인다.

    python _tools/say-patch.py            전권(그림책 틀만)
    python _tools/say-patch.py dangun     한 권

영어 읽기(기기 목소리)는 그대로 두고, 우리말일 때는 audio/ko.json 에 적힌 쪽 소리를 튼다.
ko.json 이 없는 책에는 단추가 안 생기므로 미리 붙여 두어도 해가 없다.
이미 붙은 책은 건너뛴다. 닻 문구 하나라도 못 찾으면 그 책은 손대지 않고 알린다.
"""
import io
import os
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

A1_OLD = """    return (LANG === 'en' && CAN_SPEAK)
        ? `<button type="button" class="read-btn" id="readBtn">${reading ? '■' : '▶'}</button>`
        : '';"""
A1_NEW = """    return canRead()
        ? `<button type="button" class="read-btn" id="readBtn">${reading ? '■' : '▶'}</button>`
        : '';"""

A2_OLD = """    if (LANG === 'en' && CAN_SPEAK) {
        spreadEl.querySelectorAll('[data-say]').forEach(el => {"""
A2_NEW = """    if (canRead()) {
        spreadEl.querySelectorAll('[data-say]').forEach(el => {"""

A3_OLD = """    if (CAN_SPEAK) { try { speechSynthesis.cancel(); } catch (e) {} }
    document.querySelectorAll('.saying').forEach(el => el.classList.remove('saying'));"""
A3_NEW = """    if (CAN_SPEAK) { try { speechSynthesis.cancel(); } catch (e) {} }
    stopKoAudio();
    document.querySelectorAll('.saying').forEach(el => el.classList.remove('saying'));"""

A4_OLD = """function readPage(from) {
    const page = PAGES[current];
    if (!CAN_SPEAK || !page) return;"""
A4_NEW = """function readPage(from) {
    const page = PAGES[current];
    if (LANG === 'ko') { readPageKo(from); return; }
    if (!CAN_SPEAK || !page) return;"""

A5_ANCHOR = "/* ── 단어장 ─"
A5_BLOCK = r"""/* ── 우리말 읽어 주기 ──────────────────────────────────────────
   기기에 든 한국어 목소리는 쓸 만한 것이 없어서, 우리말은 미리 만들어 둔 소리를 튼다.
   audio/ko.json 에 쪽마다 소리 파일과 문단 시작 시각이 적혀 있다(_tools/say-build.py).
   영어와 같은 단추·같은 표시를 쓴다. 파일이 없는 책에는 단추가 안 생긴다. */
const KO_AUDIO_V = '0';
let KO_AUDIO = null;
let koAudio = null;
let koAudioKey = '';

if (typeof fetch === 'function') {
    fetch(`audio/ko.json?v=${KO_AUDIO_V}`)
        .then(r => (r && r.ok && typeof r.json === 'function') ? r.json() : null)
        .then(j => {
            if (!j || !j.pages) return;
            KO_AUDIO = j;
            if (LANG === 'ko' && !reading && typeof paint === 'function') paint();
        })
        .catch(() => {});
}

function koPageKey(page) {
    if (!page) return '';
    if (page.kind === 'spread') return page.beat.art;
    if (page.kind === 'cover') return 'cover';
    if (page.kind === 'after') return 'after:' + (page.spread.art || String(PAGES.indexOf(page)));
    return '';
}

function koAudioFor(page) {
    if (!KO_AUDIO) return null;
    return KO_AUDIO.pages[koPageKey(page)] || null;
}

function canRead() {
    if (LANG === 'en') return CAN_SPEAK;
    return !!koAudioFor(PAGES[current]);
}

function stopKoAudio() {
    if (!koAudio) return;
    try { koAudio.pause(); } catch (e) {}
    koAudio.removeAttribute('src');
    koAudio = null;
    koAudioKey = '';
}

function readPageKo(from) {
    const page = PAGES[current];
    const entry = koAudioFor(page);
    if (!entry || typeof Audio === 'undefined') return;
    const cues = entry.c;
    const start = Math.max(0, Math.min(from | 0, cues.length - 1));
    const key = koPageKey(page);

    const mark = (i) => {
        document.querySelectorAll('.saying').forEach(el => el.classList.remove('saying'));
        const here = document.querySelector(`[data-say="${i}"]`);
        if (here) {
            here.classList.add('saying');
            here.scrollIntoView({ block: 'nearest' });
        }
    };

    // 같은 쪽을 읽는 중이면 그 자리로 건너뛰기만 한다.
    if (reading && koAudio && koAudioKey === key) {
        koAudio.currentTime = cues[start];
        mark(start);
        return;
    }

    stopReading();
    reading = true;
    if (spreadEl) spreadEl.classList.add('is-reading');
    const mine = ++readToken;
    const btn = document.getElementById('readBtn');
    if (btn) btn.textContent = '■';

    const a = new Audio(`audio/ko/${entry.f}`);
    a.preload = 'auto';
    koAudio = a;
    koAudioKey = key;
    let cur = -1;
    a.addEventListener('timeupdate', () => {
        if (mine !== readToken) return;
        const t = a.currentTime;
        let i = 0;
        while (i + 1 < cues.length && t >= cues[i + 1] - 0.05) i++;
        if (i !== cur) { cur = i; mark(i); }
    });
    a.addEventListener('ended', () => { if (mine === readToken) stopReading(); });
    a.addEventListener('error', () => { if (mine === readToken) stopReading(); });
    a.addEventListener('loadedmetadata', () => {
        if (mine !== readToken) return;
        if (start > 0) a.currentTime = cues[start];
        a.play().catch(() => { if (mine === readToken) stopReading(); });
    });
    mark(start);
    a.load();
}

"""


C1_OLD = ".spread-text p.saying {"
C1_NEW = ".spread-text p.saying,\n.page-cover .saying,\n.after-col .saying {"
C2_OLD = 'html[lang="en"] .is-reading [data-say] { cursor: pointer; }\nhtml[lang="en"] .is-reading [data-say]:hover {'
C2_NEW = '.is-reading [data-say] { cursor: pointer; }\n.is-reading [data-say]:hover {'


def patch_css(book):
    """표지·읽고 나서 쪽에도 읽는 문단 표시가 보이게 하고, 손 모양을 우리말에도 준다."""
    p = os.path.join(ROOT, book, 'styles.css')
    if not os.path.exists(p):
        return 'styles.css 없음'
    src = io.open(p, encoding='utf-8', newline='').read()
    nl = '\r\n' if '\r\n' in src else '\n'
    body = src.replace('\r\n', '\n')
    if '.page-cover .saying' in body:
        return '이미 붙음'
    if body.count(C1_OLD) != 1 or body.count(C2_OLD) != 1:
        return f'닻 문구를 못 찾음 ({body.count(C1_OLD)}, {body.count(C2_OLD)})'
    body = body.replace(C1_OLD, C1_NEW).replace(C2_OLD, C2_NEW)
    io.open(p, 'w', encoding='utf-8', newline='').write(body.replace('\n', nl))
    return '붙임'


def patch(book):
    p = os.path.join(ROOT, book, 'app.js')
    src = io.open(p, encoding='utf-8', newline='').read()
    if 'KO_AUDIO_V' in src:
        return '이미 붙음'
    nl = '\r\n' if '\r\n' in src else '\n'
    body = src.replace('\r\n', '\n')
    for old in (A1_OLD, A2_OLD, A3_OLD, A4_OLD):
        if body.count(old) != 1:
            return f'닻 문구를 못 찾음 ({body.count(old)}개): {old.splitlines()[0][:50]}'
    if body.count(A5_ANCHOR) != 1:
        return '단어장 머리 주석을 못 찾음'
    body = body.replace(A1_OLD, A1_NEW).replace(A2_OLD, A2_NEW).replace(A3_OLD, A3_NEW).replace(A4_OLD, A4_NEW)
    body = body.replace(A5_ANCHOR, A5_BLOCK + A5_ANCHOR)
    io.open(p, 'w', encoding='utf-8', newline='').write(body.replace('\n', nl))
    return '붙임'


def main():
    only = sys.argv[1:]
    books = [b for b in sorted(os.listdir(ROOT)) if not b.startswith('_') and os.path.exists(os.path.join(ROOT, b, 'app.js'))]
    if only:
        books = [b for b in books if b in only]
    for b in books:
        src = io.open(os.path.join(ROOT, b, 'app.js'), encoding='utf-8').read()
        if 'function readBtnHtml' not in src or 'const roleOf' not in src:
            print(f'{b:24s} 소설틀 — 건너뜀')
            continue
        print(f'{b:24s} app.js {patch(b)} / styles.css {patch_css(b)}')


if __name__ == '__main__':
    main()
