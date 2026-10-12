# -*- coding: utf-8 -*-
"""중학교 수학 수집본(references/textbooks/중고등)에서 한 단원의 문서를 골라 문제 글만 모은다(로컬 전용).

    python tools/question-bank/dump_middle.py 7-1-2            → _분석/7-1-2/기본문서_N.txt, 심화문서_모음.txt, 목록.json
    python tools/question-bank/dump_middle.py 7-1-2 --list     고른 문서 이름만 찍는다

단원 번호는 「학년-학기-단원」이고 중학교 1·2·3학년은 7·8·9로 적는다(7-1-2 = 중1 1학기 2단원).
교과서마다 단원을 묶는 법과 파일 이름이 달라, 단원마다 「어느 교과서의 어떤 이름」을 고를지 아래 UNITS에 적어 둔다.
한글 파일의 수식은 hwp_text가 「[수식: -4 over 3]」 꼴 글로 뽑는다. 같은 내용의 문서(쪽 번호만 다른 사본, pdf 사본)는 한 번만 싣는다.
뽑은 글은 출판사 저작물이다. _분석 폴더는 깃에 올라가지 않는다(.gitignore 의 /references/textbooks/).
"""
import csv
import hashlib
import io
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hwp_text import hwp_to_text  # noqa: E402
from dump_problems import clean, cut_at  # noqa: E402

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = os.path.join(ROOT, 'references', 'textbooks', '중고등')
OUT = os.path.join(ROOT, 'references', 'textbooks', '수학', '_분석')
PART = 150000  # 기본 덩이 하나의 크기(바이트쯤)

# 단원: [(교과서, 파일 이름 정규식, 수준)] — 수준은 'basic' | 'hard'. 위에서부터 먼저 맞는 줄을 쓴다. None이면 싣지 않는다.
UNITS = {
    '7-1-2': {
        'title': '정수와 유리수',
        'pick': [
            # 천재(김동재): Ⅰ. 수와 연산 — 2. 정수와 유리수(교과서 26쪽부터)
            ('수학1(김동재)', r'^1-2-\d 실력 up', 'hard'),
            ('수학1(김동재)', r'^1-2-\d (기초력 up|소단원 평가)', 'basic'),
            ('수학1(김동재)', r'^1-2 중단원 평가', 'basic'),
            ('수학1(김동재)', r'^1단원 대단원 평가', 'basic'),
            ('수학1(김동재)', r'^1단원 차시별 (학습지-)?형성 평가_(2[6-9]|[3-5]\d)쪽', 'basic'),
            # 천재(김화경): Ⅰ. 수와 연산 — 3~7(정수와 유리수의 뜻과 대소 관계, 덧셈, 뺄셈, 곱셈, 나눗셈)
            ('수학1(김화경)', r'^Ⅰ-[3-7]_', 'basic'),
            ('수학1(김화경)', r'^Ⅰ_대단원 도전', 'hard'),
            ('수학1(김화경)', r'^Ⅰ_대단원 평가', 'basic'),
            # 미래엔(황선욱) 2022: Ⅱ. 정수와 유리수
            ('수학1_황선욱_2022_평가자료', r'^\[출제대비문제은행\].*2단원', 'hard'),
            ('수학1_황선욱_2022_평가자료', r'^\[(소단원마무리|소단원수준별문제|대단원마무리|대단원평가문제)\] ?Ⅱ', 'basic'),
            # 미래엔(황선욱) 2015: Ⅰ-2. 정수와 유리수
            ('수학1 (황선욱)_2015', r'수준별문제은행_(발전)_1_2_|수준별문제은행_최상위_1_', 'hard'),
            ('수학1 (황선욱)_2015', r'수준별문제은행_(기본|표준)_1_2_|중단원수준별문제_1_2_', 'basic'),
        ],
    },
}


def chosen(unit_id):
    rules = UNITS[unit_id]['pick']
    rows = list(csv.DictReader(io.open(os.path.join(SRC, '전체파일목록.csv'), encoding='utf-8-sig')))
    out = []
    for row in rows:
        if not row['파일명'].lower().endswith('.hwp'):
            continue
        for book, pattern, level in rules:
            if row['교과서'] == book and re.search(pattern, row['파일명']):
                out.append((level, row))
                break
    return out


def main(argv):
    unit_id = argv[1]
    picked = chosen(unit_id)
    if '--list' in argv:
        for level, row in picked:
            print(level, row['출판사'], row['교과서'], row['파일명'])
        return 0
    folder = os.path.join(OUT, unit_id)
    os.makedirs(folder, exist_ok=True)
    seen, docs, listing = set(), {'basic': [], 'hard': []}, []
    for level, row in sorted(picked, key=lambda p: (p[1]['교과서'], p[1]['파일명'])):
        try:
            raw = hwp_to_text(row['경로'])
        except Exception as error:  # 깨진 파일은 건너뛰고 적어 둔다
            listing.append({'file': row['파일명'], 'skipped': str(error)})
            continue
        # 한글 파일의 특수 글자 가운데 짝이 깨진 것(서로게이트)은 버린다.
        text = clean(raw.encode('utf-8', 'ignore').decode('utf-8'))
        # 답지 파일(해답)은 통째로, 기본 문서는 정답·해설 앞에서 자른다. 심화 문서는 풀이가 있어야 그림 속 수를 알 수 있어 자르지 않는다.
        body = text if level == 'hard' or '해답' in row['파일명'] else text[:cut_at(text)]
        body = body.strip()
        key = hashlib.md5(re.sub(r'\s+', '', body).encode('utf-8')).hexdigest()
        if len(body) < 80 or key in seen:
            continue
        seen.add(key)
        name = re.sub(r'__[0-9a-f]{8,10}(?=\.hwp$)', '', row['파일명'])
        head = '===== %s %s | %s =====' % (row['출판사'], row['교과서'], name)
        docs[level].append(head + '\n' + body + '\n')
        listing.append({'level': level, 'publisher': row['출판사'], 'book': row['교과서'], 'file': name, 'chars': len(body)})
    json.dump(listing, io.open(os.path.join(folder, '목록.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    hard = '\n'.join(docs['hard'])
    io.open(os.path.join(folder, '심화문서_모음.txt'), 'w', encoding='utf-8').write(hard)
    # 덩이 크기를 고르게: 덩이 수를 먼저 정하고 그 수로 나눈 크기에서 끊는다.
    total = sum(len(doc.encode('utf-8')) for doc in docs['basic'])
    limit = total / max(1, -(-total // PART))
    parts, size = [[]], 0
    for doc in docs['basic']:
        weight = len(doc.encode('utf-8'))
        if size and size + weight > limit * 1.05:
            parts.append([])
            size = 0
        parts[-1].append(doc)
        size += weight
    for old in os.listdir(folder):
        if re.match(r'기본문서_\d+\.txt$', old):
            os.remove(os.path.join(folder, old))
    for i, part in enumerate(parts, 1):
        io.open(os.path.join(folder, '기본문서_%d.txt' % i), 'w', encoding='utf-8').write('\n'.join(part))
    print('%s %s: 기본 %d문서 %d덩이(%s), 심화 %d문서 %dKB' % (
        unit_id, UNITS[unit_id]['title'], len(docs['basic']), len(parts),
        ', '.join('%dKB' % (len('\n'.join(p).encode('utf-8')) // 1024) for p in parts), len(docs['hard']), len(hard.encode('utf-8')) // 1024))
    return 0


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.exit(main(sys.argv))
