# -*- coding: utf-8 -*-
"""단원 파일 하나(units/<단원><갈래>.js)를 index.html에 넣고, 캐시 번호(?v=)와 단원 version을 올린다.

    python tools/question-bank/add_part.py 3-1-3 c 20261012-28      3-1-3b.js 다음 줄에 3-1-3c.js를 넣는다
    python tools/question-bank/add_part.py 4-1-1 ab 20261012-29     새 단원: 마지막 단원 줄 뒤에 a.js, b.js를 넣는다(version은 그대로)
    python tools/question-bank/add_part.py 3-2-3 - 20261012-30      줄은 넣지 않고 번호와 version만 올린다

index.html의 모든 ?v= 를 같은 번호로 맞춘다(로컬 js·css는 24시간 캐시라 번호를 안 올리면 옛 파일이 남는다).
"""
import io
import os
import re
import sys

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
APP = os.path.join(ROOT, 'learning', 'literacy-numeracy', 'math-bank')


def main(argv):
    unit, parts, version = argv[1], argv[2].replace('-', ''), argv[3]
    path = os.path.join(APP, 'index.html')
    html = io.open(path, encoding='utf-8').read()
    old = re.search(r'\?v=([0-9-]+)', html).group(1)
    assert old != version, '번호가 그대로다: ' + old
    html = html.replace('?v=' + old, '?v=' + version)
    line = '  <script src="units/%s.js?v=' + version + '"></script>\n'
    for part in parts:
        name = unit + part
        if 'units/%s.js' % name in html:
            continue
        assert os.path.exists(os.path.join(APP, 'units', name + '.js')), name + '.js 가 없다'
        # 같은 단원의 앞 갈래 뒤에, 없으면 마지막 단원 줄 뒤에 넣는다.
        before = [m for m in re.finditer(r'  <script src="units/([0-9-]+[a-z])\.js\?v=[0-9-]+"></script>\n', html) if m.group(1) < name]
        assert before, '단원 줄을 찾지 못했다'
        at = before[-1].end()
        html = html[:at] + line % name + html[at:]
    io.open(path, 'w', encoding='utf-8', newline='\n').write(html)
    shell = os.path.join(APP, 'units', unit + 'a.js')
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
