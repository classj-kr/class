# -*- coding: utf-8 -*-
"""뽑아 둔 단원 글에서 조건에 맞는 문서를 골라 읽기 좋게 찍는다(로컬 전용, 유형 분석용).

    python tools/question-bank/show_docs.py 3-1-1 심화 --limit 3000 --max 4
    python tools/question-bank/show_docs.py 3-1-1 서술형 --pub 디딤돌

파일 이름이나 자료 유형에 낱말이 들어 있는 문서를 찾는다. 수식 표시와 그림 표시는 걷어 내고 보여 준다.
"""
import io
import json
import os
import re
import sys

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))


def clean(text):
    text = re.sub(r'\[수식: ([^\]]*)\]', r'\1', text)
    text = re.sub(r'\[표\]|\[그림\]', '', text)
    text = text.replace('`', '').replace('rm ', '').replace('\\', '')
    text = re.sub(r'[ \t]+', ' ', text)
    return re.sub(r'\n\s*\n+', '\n', text)


def main(argv):
    if len(argv) < 3:
        print(__doc__)
        return 2
    unit, word = argv[1], argv[2]
    limit = int(argv[argv.index('--limit') + 1]) if '--limit' in argv else 2500
    most = int(argv[argv.index('--max') + 1]) if '--max' in argv else 3
    pub = argv[argv.index('--pub') + 1] if '--pub' in argv else ''
    skip = int(argv[argv.index('--skip') + 1]) if '--skip' in argv else 0
    base = os.path.join(ROOT, 'references', 'textbooks', '수학', '_분석', unit)
    with io.open(os.path.join(base, '목록.json'), encoding='utf-8') as handle:
        rows = json.load(handle)
    hits = [r for r in rows if word in (r['file'] + ' ' + r['kind']) and pub in r['pub'] and not re.search(r'정답|교사용|선생님용|예시답안', r['file'])]
    print('찾은 문서 %d개' % len(hits))
    for row in hits[skip:skip + most]:
        with io.open(row['txt'], encoding='utf-8') as handle:
            print('===== %s %s %s | %s' % (row['pub'], row['author'], row['kind'], row['file'][:80]))
            print(clean(handle.read())[:limit])
            print()
    return 0


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.exit(main(sys.argv))
