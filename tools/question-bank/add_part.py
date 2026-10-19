# -*- coding: utf-8 -*-
"""단원 파일 하나(units/<단원><갈래>.js)를 index.html에 넣고, 캐시 번호(?v=)와 단원 version을 올린다.

    python tools/question-bank/add_part.py 3-1-3 c 20261012-28      3-1-3b.js 다음 줄에 3-1-3c.js를 넣는다
    python tools/question-bank/add_part.py 4-1-1 ab 20261012-29     새 단원: 마지막 단원 줄 뒤에 a.js, b.js를 넣는다(version은 그대로)
    python tools/question-bank/add_part.py 3-2-3 - 20261012-30      줄은 넣지 않고 번호와 version만 올린다
    python tools/question-bank/add_part.py - - 20261012-31          번호만 올린다(엔진·화면만 고쳤을 때)

index.html의 모든 ?v= 를 같은 번호로 맞춘다(로컬 js·css는 24시간 캐시라 번호를 안 올리면 옛 파일이 남는다).
"""
import collections
import io
import os
import re
import sys

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
APP = os.path.join(ROOT, 'learning', 'literacy-numeracy', 'math-bank')


def sync_terms(html, version):
    """맨 위 드롭다운의 학기 목록(terms.js)을 index.html 에 실린 단원에 맞춘다. 목록이 바뀌면 기출 화면(csat-math)이 이 파일을 읽는 번호도 올린다."""
    terms = sorted({m.group(1) for m in re.finditer(r'units/(\d+-\d+)-\d+[a-z]\.js', html)}, key=lambda t: [int(x) for x in t.split('-')])
    path = os.path.join(APP, 'terms.js')
    text = io.open(path, encoding='utf-8', newline='').read()
    found = re.search(r'const TERMS = \[[^\]]*\];', text)
    assert found, 'terms.js 에서 TERMS 를 찾지 못했다'
    line = 'const TERMS = [%s];' % ', '.join("'%s'" % t for t in terms)
    if found.group(0) == line:
        return
    io.open(path, 'w', encoding='utf-8', newline='').write(text.replace(found.group(0), line))
    past = os.path.join(APP, '..', 'csat-math', 'index.html')
    page = io.open(past, encoding='utf-8', newline='').read()
    assert re.search(r'\.\./math-bank/terms\.js\?v=[0-9-]+', page), '기출 화면이 terms.js 를 읽지 않는다'
    io.open(past, 'w', encoding='utf-8', newline='').write(re.sub(r'(\.\./math-bank/terms\.js\?v=)[0-9-]+', lambda m: m.group(1) + version, page))
    print('학기 목록: ' + ', '.join(terms))


def main(argv):
    unit, parts, version = argv[1], argv[2].replace('-', ''), argv[3]
    path = os.path.join(APP, 'index.html')
    html = io.open(path, encoding='utf-8').read()
    # 버전은 「날짜-번호」 꼴 가운데 가장 많이 쓰인 것이다. 맨 처음 나오는 ?v= 를 잡으면, 옆방이 작업 중에 붙인 「20261019-hints-1」 같은
    # 글자의 앞부분만 잡아 그쪽 줄만 바뀌고 나머지는 그대로 남는다(2026-10-19). 바꿀 때도 그 꼴 그대로인 것만 바꾼다.
    old = collections.Counter(re.findall(r'\?v=(\d{8}-\d+)"', html)).most_common(1)[0][0]
    assert old != version, '번호가 그대로다: ' + old
    html = html.replace('?v=' + old + '"', '?v=' + version + '"')
    # 단원 줄은 type="text/plain" data-unit — 브라우저가 받지 않는 목록이고, app.js 가 고른 학기의 파일만 불러온다.
    line = '  <script src="units/%s.js?v=' + version + '" type="text/plain" data-unit></script>\n'
    for part in parts:
        name = unit + part
        if 'units/%s.js' % name in html:
            continue
        assert os.path.exists(os.path.join(APP, 'units', name + '.js')), name + '.js 가 없다'
        # 같은 단원의 앞 갈래 뒤에, 없으면 이름 차례로 바로 앞 단원 줄 뒤에 넣는다. 가장 앞선 단원이면 첫 단원 줄 앞에 넣는다.
        lines = list(re.finditer(r'  <script src="units/([0-9-]+[a-z])\.js\?v=[0-9-]+"[^>]*></script>\n', html))
        assert lines, '단원 줄을 찾지 못했다'
        # 단원 번호는 수 차례로 견준다(글자로 견주면 10-1-1a 가 1-2-6b 와 2-1-1a 사이에 든다).
        num = lambda f: [int(x) for x in f[:-1].split('-')] + [f[-1]]
        before = [m for m in lines if num(m.group(1)) < num(name)]
        at = before[-1].end() if before else lines[0].start()
        html = html[:at] + line % name + html[at:]
    io.open(path, 'w', encoding='utf-8', newline='\n').write(html)
    sync_terms(html, version)
    if unit == '-':
        print('%s → %s' % (old, version))
        return 0
    shell =os.path.join(APP, 'units', unit + 'a.js')
    text = io.open(shell, encoding='utf-8').read()
    found = re.search(r"(id: '%s',[^\n]*?version: )(\d+)" % re.escape(unit), text)
    assert found, 'version 을 찾지 못했다'
    if 'a' not in parts:
        text = text[:found.start(2)] + str(int(found.group(2)) + 1) + text[found.end(2):]
        io.open(shell, 'w', encoding='utf-8', newline='\n').write(text)
    print('%s → %s, %s version %s' % (old, version, unit, found.group(2) if 'a' in parts else int(found.group(2)) + 1))
    return 0


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.exit(main(sys.argv))
