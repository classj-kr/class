# -*- coding: utf-8 -*-
"""우리말 읽어 주기 소리 만들기 (전래동화 그림책 틀).

    python _tools/say-build.py cast   [책 ...]   배역표(audio/cast.json)를 만든다. 있으면 건드리지 않는다.
    python _tools/say-build.py report [책 ...]   글자 수와 아직 안 만든 문단 수를 센다 (돈 셈용).
    python _tools/say-build.py render [책 ...]   소리를 뽑아 쪽마다 한 파일로 묶고 audio/ko.json 을 쓴다.

흐름
  1. tools-say-dump.mjs 로 책을 실제로 돌려 쪽마다 읽을 문단을 뽑는다(우리말·영어).
  2. 우리말 대사(따옴표로 시작하는 문단)에 영어판의 말하는 이 표시(v)를 차례대로 옮겨 붙인다.
     수가 안 맞는 쪽은 맞는 데까지만 붙이고 나머지는 해설이 읽는다.
  3. 책마다 배역표: 해설 하나 + 역할(man/old/boy/girl/woman/mother/granny/beast)마다 목소리 하나.
     책 차례에 따라 돌려 가며 배정해서 이웃 책끼리 겹치지 않게 한다. 손으로 고치려면 audio/cast.json 을 고친다.
  4. 문단마다 타입캐스트(ssfm-v30, 스마트 이모션, 앞뒤 문장 같이 넘김)로 소리를 뽑아
     저장소 밖 캐시(E:/webprojects/tts-cache)에 둔다. 열쇠는 글+목소리+빠르기라서 글이 바뀐 문단만 다시 뽑힌다.
  5. 쪽마다 문단 소리를 0.4초 틈으로 이어 m4a 하나로 만들고, 문단 시작 시각(cues)을 audio/ko.json 에 적는다.
     파일 이름은 내용 지문이라 서버의 1년 캐시와 부딪히지 않는다. app.js 의 KO_AUDIO_V 도 같이 올린다.
"""
import hashlib
import io
import json
import os
import re
import subprocess
import sys
import time
import urllib.request
import wave

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CACHE = os.environ.get('TTS_CACHE', 'E:/webprojects/tts-cache/korea-tales')
KEY_FILE = 'E:/webprojects/typecast-key.txt'
VOICES_FILE = os.path.join(HERE, 'say-voices.json')
MODEL = 'ssfm-v30'
TEMPO = 0.95
GAP = 0.4           # 문단 사이 틈(초)
AAC_KBPS = 48

# ── 배역 묶음 (타입캐스트 한국어 이름) ─────────────────────────────
NARR_F = ['연화', '지선', '인화', '경애', '순이', '정순', '주하']
NARR_M = ['송진섭 스토리텔러', '명주', '최석', '성호', '건석', '대진']
POOLS = {
    'man':    ['태우', '이겸', '원호', '치호', '호선', '정민', '주호', '호영', '근영', '근혁', '근우', '제찬',
               '진우', '태섭', '시원', '현민', '세진', '김건', '한준', '노을', '윤성', '성규', '준상', '윤빈', '세우'],
    'old':    ['권일', '종대', '덕환', '학철', '명일', '중현', '일호', '창배', '영길', '덕춘', '훈'],
    'boy':    ['준우', '주완', '창희', '시우', '태지', '유성', '예준', '민수', '건우', '머루', '하준', '호빈이', '우주', '덕구'],
    'girl':   ['옥지', '몽실이', '소이', '다빈', '영지', '서윤', '수아', '하율', '새론', '다솜', '류은', '지안', '하영', '채아', '하은', '다희', '지우'],
    'woman':  ['한영', '민정', '소진', '한솔', '진서', '유진', '유민', '유빈', '한나', '유라', '가을', '민지'],
    'mother': ['혜진', '정숙', '재선', '미소', '유리', '인선', '윤정', '연자', '미선', '혜지', '혜원', '미경',
               '혜정', '현경', '경숙', '나진', '선영', '국희', '금희', '소영', '정원', '명희', '애란', '도희'],
    'granny': ['경애', '숙희', '순이', '정순', '주하'],
    'beast':  ['하데스', '웨이드', '빅토르', '러스티', '홍설록', '스모크', '이카루스', '에드워드', '듀크', '잭'],
}
ROLE_ORDER = ['man', 'old', 'boy', 'girl', 'woman', 'mother', 'granny', 'beast']
QUOTE_START = ('"', "'", '\u201c', '\u2018')


def key():
    return io.open(KEY_FILE, encoding='utf-8').read().strip()


# ── 목소리 목록 ──────────────────────────────────────────────────
def voices():
    if os.path.exists(VOICES_FILE):
        return json.load(io.open(VOICES_FILE, encoding='utf-8'))
    req = urllib.request.Request(f'https://api.typecast.ai/v3/voices?model={MODEL}', headers={'X-API-KEY': key()})
    data = json.load(urllib.request.urlopen(req, timeout=60))
    table = {}
    for v in data:
        name = v['voice_name']['kor']
        table.setdefault(name, v['voice_id'])
    io.open(VOICES_FILE, 'w', encoding='utf-8').write(json.dumps(table, ensure_ascii=False, indent=1))
    return table


def resolve(table, name):
    if name not in table:
        raise SystemExit(f'목소리 이름을 못 찾음: {name}')
    return table[name]


# ── 책 목록·문단 뽑기 ─────────────────────────────────────────────
def picture_books():
    out = []
    for b in sorted(os.listdir(ROOT)):
        p = os.path.join(ROOT, b, 'app.js')
        if b.startswith('_') or not os.path.exists(p):
            continue
        src = io.open(p, encoding='utf-8').read()
        if 'function readBtnHtml' in src and 'const roleOf' in src:
            out.append(b)
    return out


def dump(book):
    r = subprocess.run(['node', os.path.join(HERE, 'tools-say-dump.mjs'), book], capture_output=True)
    if r.returncode:
        raise SystemExit(f'{book}: 문단 뽑기 실패\n{r.stderr.decode("utf-8", "ignore")[:500]}')
    return json.loads(r.stdout.decode('utf-8'))


def is_quote(t):
    return t.startswith(QUOTE_START)


def page_key(p):
    if p['kind'] == 'spread':
        return p['art']
    if p['kind'] == 'cover':
        return 'cover'
    if p['kind'] == 'after':
        return 'after:' + (p['art'] or str(p['idx']))
    return p['kind'] + ':' + str(p['idx'])


def runs_of(flags):
    """잇달아 참인 자리들을 묶음으로. [(시작, 끝+1)]"""
    out, i = [], 0
    while i < len(flags):
        if flags[i]:
            j = i
            while j < len(flags) and flags[j]:
                j += 1
            out.append((i, j))
            i = j
        else:
            i += 1
    return out


def spread_roles(en_roles, n):
    """영어 묶음의 역할을 우리말 묶음 n줄에 편다. 줄 수가 같으면 그대로,
    우리말이 더 길면 영어 쪽이 두 사람이 번갈아 말한 것일 때 그 번갈음을 잇고
    아니면 마지막 역할을 되풀이한다. 우리말이 더 짧으면 앞에서부터 쓴다."""
    if not en_roles:
        return ['narration'] * n
    if n <= len(en_roles):
        return en_roles[:n]
    out = list(en_roles)
    pair = list(dict.fromkeys(en_roles))
    while len(out) < n:
        if len(pair) == 2 and all(en_roles[i] != en_roles[i + 1] for i in range(len(en_roles) - 1)):
            out.append(pair[0] if out[-1] == pair[1] else pair[1])
        else:
            out.append(en_roles[-1])
    return out


def with_roles(d):
    """우리말 문단에 역할을 붙인다. 돌려주는 것: [{key, parts:[{t, v}]}], 통계

    따옴표로 시작하는 우리말 문단이 대사다. 영어판에서 말하는 이가 적힌 문단과
    묶음(잇달은 대사) 단위로 짝을 짓는다. 묶음 수가 같으면 차례대로, 다르면 쪽 안에서
    차지하는 자리(앞·뒤 비율)가 가장 가까운 묶음끼리 짝짓고, 짝이 없는 우리말 묶음은
    해설이 읽는다. 엉뚱한 인물 목소리가 나는 것보다 해설이 읽는 쪽이 낫다."""
    en_by_key = {page_key(p): p for p in (d['en'] or [])}
    pages = []
    stat = {'pages': 0, 'aligned': 0, 'fallback': 0}
    for p in d['ko']:
        k = page_key(p)
        en = en_by_key.get(k)
        n_ko = len(p['parts'])
        roles = ['narration'] * n_ko
        ko_runs = runs_of([is_quote(x['t']) for x in p['parts']])
        en_parts = en['parts'] if en else []
        en_runs = runs_of([x['v'] != 'narration' for x in en_parts])
        stat['pages'] += 1
        if ko_runs:
            ko_cnt = sum(b - a for a, b in ko_runs)
            en_cnt = sum(b - a for a, b in en_runs)
            if len(ko_runs) == len(en_runs):
                pairs = list(zip(ko_runs, en_runs))
            else:
                # 쪽 안 자리가 가까운 것끼리. 한 번 쓴 영어 묶음은 다시 안 쓴다.
                pos = lambda r, n: ((r[0] + r[1] - 1) / 2) / max(1, n - 1)
                cands = sorted(((abs(pos(kr, n_ko) - pos(er, len(en_parts))), ki, ei)
                                for ki, kr in enumerate(ko_runs) for ei, er in enumerate(en_runs)))
                used_k, used_e, pairs = set(), set(), []
                for dist, ki, ei in cands:
                    if dist > 0.25 or ki in used_k or ei in used_e:
                        continue
                    used_k.add(ki); used_e.add(ei)
                    pairs.append((ko_runs[ki], en_runs[ei]))
            for (ka, kb), (ea, eb) in pairs:
                for off, v in enumerate(spread_roles([x['v'] for x in en_parts[ea:eb]], kb - ka)):
                    roles[ka + off] = v
            if len(ko_runs) == len(en_runs) and ko_cnt == en_cnt:
                stat['aligned'] += 1
            else:
                stat['fallback'] += 1
        pages.append({'key': k, 'kind': p['kind'],
                      'parts': [{'t': x['t'], 'v': roles[i]} for i, x in enumerate(p['parts'])]})
    return pages, stat


def apply_overrides(book, pages):
    """audio/roles.json — 기계 맞춤이 틀린 대사를 손으로 바로잡는 표.
    { "문단 글의 앞 20자": "old" } 꼴. 글이 바뀌면 표도 어긋나므로 그때 다시 적는다."""
    p = os.path.join(ROOT, book, 'audio', 'roles.json')
    if not os.path.exists(p):
        return 0
    table = json.load(io.open(p, encoding='utf-8'))
    hit = 0
    for pg in pages:
        for x in pg['parts']:
            head = x['t'][:20]
            if head in table:
                x['v'] = table[head]
                hit += 1
    missed = len(table) - hit
    if missed:
        print(f'   (주의) {book}/audio/roles.json 에서 {missed}줄이 본문과 안 맞는다')
    return hit


# ── 배역표 ───────────────────────────────────────────────────────
def cast_path(book):
    return os.path.join(ROOT, book, 'audio', 'cast.json')


def make_cast(book, idx, roles_used, table):
    narr_list = []
    for i in range(max(len(NARR_F), len(NARR_M))):
        if i < len(NARR_F):
            narr_list.append(NARR_F[i])
        if i < len(NARR_M):
            narr_list.append(NARR_M[i])
    taken = set()
    narrator = narr_list[idx % len(narr_list)]
    taken.add(narrator)
    cast = {'narration': {'name': narrator, 'id': resolve(table, narrator)}, 'roles': {}}
    for r_i, role in enumerate(ROLE_ORDER):
        if role not in roles_used:
            continue
        pool = POOLS[role]
        start = (idx * 3 + r_i * 5) % len(pool)
        pick = None
        for j in range(len(pool)):
            cand = pool[(start + j) % len(pool)]
            if cand not in taken:
                pick = cand
                break
        pick = pick or pool[start]
        taken.add(pick)
        cast['roles'][role] = {'name': pick, 'id': resolve(table, pick)}
    return cast


def load_cast(book):
    p = cast_path(book)
    return json.load(io.open(p, encoding='utf-8')) if os.path.exists(p) else None


def voice_for(cast, role):
    if role in cast['roles']:
        return cast['roles'][role]['id']
    return cast['narration']['id']


# ── 소리 뽑기 ────────────────────────────────────────────────────
def clean(t):
    t = re.sub(r'[\u201c\u201d"]', '', t)
    t = re.sub(r"^[\u2018']|[\u2019']$", '', t.strip())
    return t.strip()


def part_key(text, voice):
    return hashlib.sha1(f'{MODEL}|{voice}|{TEMPO}|{clean(text)}'.encode('utf-8')).hexdigest()


def synth(text, voice, prev, nxt, out):
    body = {
        'voice_id': voice, 'text': clean(text), 'model': MODEL, 'language': 'kor',
        'prompt': {'emotion_type': 'smart', 'previous_text': clean(prev)[-300:], 'next_text': clean(nxt)[:300]},
        'output': {'audio_format': 'wav', 'audio_tempo': TEMPO},
    }
    req = urllib.request.Request('https://api.typecast.ai/v1/text-to-speech',
                                 data=json.dumps(body, ensure_ascii=False).encode('utf-8'),
                                 headers={'X-API-KEY': key(), 'Content-Type': 'application/json'})
    for attempt in range(5):
        try:
            r = urllib.request.urlopen(req, timeout=300)
            data = r.read()
            if data[:4] != b'RIFF':
                raise SystemExit('wav 가 아닌 응답')
            tmp = out + '.part'
            open(tmp, 'wb').write(data)
            os.replace(tmp, out)
            return
        except urllib.error.HTTPError as e:
            msg = e.read().decode('utf-8', 'ignore')
            if e.code in (401, 402, 403):
                raise SystemExit(f'타입캐스트 거절 {e.code}: {msg[:300]}')
            print(f'   다시 시도 {e.code}: {msg[:120]}')
            time.sleep(5 * (attempt + 1))
        except (urllib.error.URLError, TimeoutError) as e:
            print(f'   다시 시도 (연결): {e}')
            time.sleep(5 * (attempt + 1))
    raise SystemExit('다섯 번 실패')


def wav_info(path):
    with wave.open(path, 'rb') as w:
        return w.getframerate(), w.getnchannels(), w.getsampwidth(), w.getnframes() / w.getframerate()


def gap_file(rate, ch, width):
    p = os.path.join(CACHE, f'gap-{rate}-{ch}-{width}.wav')
    if not os.path.exists(p):
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'lavfi', '-i', f'anullsrc=r={rate}:cl={"mono" if ch == 1 else "stereo"}',
                        '-t', str(GAP), '-c:a', f'pcm_s{width * 8}le', p], check=True)
    return p


def build_page(wavs, out_m4a):
    """문단 소리를 틈을 두고 이어 붙인다. 돌려주는 것: 문단 시작 시각 목록, 전체 길이"""
    rate, ch, width, _ = wav_info(wavs[0])
    gap = gap_file(rate, ch, width)
    cues, t = [], 0.0
    lines = []
    for i, w in enumerate(wavs):
        r2, c2, w2, dur = wav_info(w)
        if (r2, c2, w2) != (rate, ch, width):
            raise SystemExit(f'소리 규격이 다름: {w}')
        cues.append(round(t, 3))
        lines.append(f"file '{w.replace(os.sep, '/')}'")
        t += dur
        if i + 1 < len(wavs):
            lines.append(f"file '{gap.replace(os.sep, '/')}'")
            t += GAP
    lst = out_m4a + '.txt'
    io.open(lst, 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst,
                    '-c:a', 'aac', '-b:a', f'{AAC_KBPS}k', '-ac', '1', '-ar', '24000', '-movflags', '+faststart', out_m4a], check=True)
    os.remove(lst)
    return cues, round(t, 3)


def bump_version(book, ver):
    p = os.path.join(ROOT, book, 'app.js')
    src = io.open(p, encoding='utf-8', newline='').read()
    new = re.sub(r"const KO_AUDIO_V = '[^']*';", f"const KO_AUDIO_V = '{ver}';", src)
    if new == src and 'KO_AUDIO_V' not in src:
        print(f'   (주의) {book}/app.js 에 KO_AUDIO_V 가 없다 — say-patch.py 를 먼저 돌릴 것')
    elif new != src:
        io.open(p, 'w', encoding='utf-8', newline='').write(new)


# ── 명령 ─────────────────────────────────────────────────────────
def cmd_cast(books, table):
    all_books = picture_books()
    for b in books:
        d = dump(b)
        pages, stat = with_roles(d)
        apply_overrides(b, pages)
        used = {x['v'] for p in pages for x in p['parts']} - {'narration'}
        existing = load_cast(b)
        if existing:
            cast = existing
            mark = '(있음)'
        else:
            cast = make_cast(b, all_books.index(b), used, table)
            os.makedirs(os.path.dirname(cast_path(b)), exist_ok=True)
            io.open(cast_path(b), 'w', encoding='utf-8').write(json.dumps(cast, ensure_ascii=False, indent=1))
            mark = '(새로)'
        roles = ', '.join(f"{r}={cast['roles'][r]['name']}" for r in ROLE_ORDER if r in cast['roles'])
        print(f"{b:24s} 해설={cast['narration']['name']:10s} {roles}  {mark}  대사 맞춤 {stat['aligned']}/{stat['aligned'] + stat['fallback']}쪽")


def cmd_report(books, table):
    tot_chars = tot_parts = todo = 0
    for b in books:
        d = dump(b)
        pages, stat = with_roles(d)
        apply_overrides(b, pages)
        cast = load_cast(b)
        chars = sum(len(x['t']) for p in pages for x in p['parts'])
        parts = sum(len(p['parts']) for p in pages)
        missing = 0
        if cast:
            for p in pages:
                for x in p['parts']:
                    if not os.path.exists(os.path.join(CACHE, part_key(x['t'], voice_for(cast, x['v'])) + '.wav')):
                        missing += 1
        else:
            missing = parts
        tot_chars += chars
        tot_parts += parts
        todo += missing
        print(f'{b:24s} {chars:6d}자 {parts:4d}문단  아직 {missing:4d}  대사 맞춤 {stat["aligned"]}/{stat["aligned"] + stat["fallback"]}쪽')
    print(f'합계 {tot_chars}자 {tot_parts}문단, 아직 안 만든 문단 {todo}')


def cmd_render(books, table):
    os.makedirs(CACHE, exist_ok=True)
    for b in books:
        d = dump(b)
        pages, stat = with_roles(d)
        apply_overrides(b, pages)
        cast = load_cast(b)
        if not cast:
            cmd_cast([b], table)
            cast = load_cast(b)
        out_dir = os.path.join(ROOT, b, 'audio', 'ko')
        os.makedirs(out_dir, exist_ok=True)
        index = {'v': 1, 'pages': {}}
        made = 0
        for p in pages:
            wavs = []
            parts = p['parts']
            for i, x in enumerate(parts):
                voice = voice_for(cast, x['v'])
                k = part_key(x['t'], voice)
                wav = os.path.join(CACHE, k + '.wav')
                if not os.path.exists(wav):
                    prev = parts[i - 1]['t'] if i > 0 else ''
                    nxt = parts[i + 1]['t'] if i + 1 < len(parts) else ''
                    synth(x['t'], voice, prev, nxt, wav)
                    made += 1
                wavs.append(wav)
            page_hash = hashlib.sha1(('|'.join(os.path.basename(w) for w in wavs) + f'|{GAP}|{AAC_KBPS}').encode()).hexdigest()[:16]
            m4a = os.path.join(out_dir, page_hash + '.m4a')
            if not os.path.exists(m4a):
                cues, total = build_page(wavs, m4a)
            else:
                cues, total = None, None
            if cues is None:
                # 이미 있는 파일: 시각만 다시 센다
                cues, t = [], 0.0
                for i, w in enumerate(wavs):
                    cues.append(round(t, 3))
                    t += wav_info(w)[3] + (GAP if i + 1 < len(wavs) else 0)
                total = round(t, 3)
            index['pages'][p['key']] = {'f': page_hash + '.m4a', 'c': cues, 'd': total}
        keep = {v['f'] for v in index['pages'].values()}
        for f in os.listdir(out_dir):
            if f.endswith('.m4a') and f not in keep:
                os.remove(os.path.join(out_dir, f))
        text = json.dumps(index, ensure_ascii=False, separators=(',', ':'))
        io.open(os.path.join(ROOT, b, 'audio', 'ko.json'), 'w', encoding='utf-8').write(text)
        bump_version(b, hashlib.sha1(text.encode('utf-8')).hexdigest()[:10])
        size = sum(os.path.getsize(os.path.join(out_dir, f)) for f in os.listdir(out_dir)) / 1e6
        print(f'{b:24s} 쪽 {len(pages):3d}  새로 뽑은 문단 {made:4d}  소리 {size:5.1f}MB  대사 맞춤 {stat["aligned"]}/{stat["aligned"] + stat["fallback"]}쪽')


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ('cast', 'report', 'render'):
        print(__doc__)
        return
    cmd = sys.argv[1]
    books = sys.argv[2:] or picture_books()
    table = voices()
    {'cast': cmd_cast, 'report': cmd_report, 'render': cmd_render}[cmd](books, table)


if __name__ == '__main__':
    main()
