# -*- coding: utf-8 -*-
"""중학교 수학 수집본(references/textbooks/중고등)에서 한 단원의 문서를 골라 문제 글만 모은다(로컬 전용).

    python tools/question-bank/dump_middle.py 7-1-2            → _분석/7-1-2/기본문서_N.txt, 심화문서_모음.txt, 목록.json
    python tools/question-bank/dump_middle.py 7-1-2 --list     고른 문서 이름만 찍는다

단원 번호는 「학년-학기-단원」이고 중학교 1·2·3학년은 7·8·9로 적는다(7-1-2 = 중1 1학기 2단원, 8-2-5 = 중2 2학기 5단원).
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
PART = 120000  # 기본 덩이 하나의 크기(바이트쯤)

# 단원: [(교과서, 파일 이름 정규식, 수준)] — 수준은 'basic' | 'hard'. 위에서부터 먼저 맞는 줄을 쓴다.
def grade7(dong, pages, hwa, mirae, bank, old=None):
    """중1 한 단원의 고르는 표.

    dong: 천재(김동재)의 중단원 번호 'a-b' / pages: 그 중단원의 차시별 형성 평가 쪽수 정규식
    hwa: 천재(김화경) (대단원 로마 숫자, 소단원 번호 글자 모음) / mirae: 미래엔 2022 (대단원 로마 숫자, 소단원 번호 글자 모음)
    bank: 미래엔 2022 출제대비 문제은행의 단원 번호 / old: 미래엔 2015의 'a_b'(주지 않으면 dong 과 같다)
    대단원 평가·대단원 마무리·문제은행은 대단원에 든 중단원이 함께 쓰므로, 꼴 목록을 만들 때 그 단원 것만 센다.
    """
    big = dong.split('-')[0]
    old = old or dong.replace('-', '_')
    return [
        ('수학1(김동재)', r'^%s-\d 실력 up' % dong, 'hard'),
        ('수학1(김동재)', r'^%s-\d (기초력 up|소단원 평가)' % dong, 'basic'),
        ('수학1(김동재)', r'^%s 중단원 평가' % dong, 'basic'),
        ('수학1(김동재)', r'^%s단원 대단원 평가' % big, 'basic'),
        ('수학1(김동재)', r'^%s단원 차시별 (학습지-)?형성 평가_(%s)쪽' % (big, pages), 'basic'),
        ('수학1(김화경)', r'^%s-[%s]_' % hwa, 'basic'),
        ('수학1(김화경)', r'^%s_대단원 도전' % hwa[0], 'hard'),
        ('수학1(김화경)', r'^%s_대단원 평가' % hwa[0], 'basic'),
        ('수학1_황선욱_2022_평가자료', r'^\[출제대비문제은행\].*_%s단원_' % bank, 'hard'),
        ('수학1_황선욱_2022_평가자료', r'^\[(소단원마무리|소단원수준별문제)\] ?%s-[%s]\.' % mirae, 'basic'),
        ('수학1_황선욱_2022_평가자료', r'^\[(대단원마무리|대단원평가문제)\] ?%s\.' % mirae[0], 'basic'),
        ('수학1 (황선욱)_2015', r'수준별문제은행_(발전)_%s_|수준별문제은행_최상위_%s_' % (old, old.split('_')[0]), 'hard'),
        ('수학1 (황선욱)_2015', r'수준별문제은행_(기본|표준)_%s_|중단원수준별문제_%s_' % (old, old), 'basic'),
    ]


def grade8(dong, subs, pages, hwa, mirae, bank, old):
    """중2 한 단원의 고르는 표. 중1(grade7)과 같되, 천재(김동재)의 중단원 하나를 소단원으로 갈라 두 단원에 나눠 줄 수 있다.

    dong: 천재(김동재)의 중단원 번호 'a-b' / subs: 그 가운데 이 단원이 쓰는 소단원 번호 글자 모음('12', '1-3')
    pages: 차시별 형성 평가 쪽수 정규식 / hwa, mirae: (대단원 로마 숫자, 소단원 번호 글자 모음) / bank: 미래엔 2022 문제은행의 단원 번호
    old: 미래엔 2015의 중단원 번호 정규식('1_1', '1_[23]')
    중단원 평가·대단원 평가·대단원 마무리·문제은행·2015 자료는 갈라 준 두 단원이 함께 쓰므로, 꼴 목록을 만들 때 그 단원 것만 센다.
    """
    big = dong.split('-')[0]
    return [
        ('수학2(김동재)', r'(?i)^%s-[%s] 실력 up' % (dong, subs), 'hard'),
        ('수학2(김동재)', r'(?i)^%s-[%s] (기초력 up|소단원 평가)' % (dong, subs), 'basic'),
        ('수학2(김동재)', r'^%s 중단원 평가' % dong, 'basic'),
        ('수학2(김동재)', r'^%s단원 대단원 평가' % big, 'basic'),
        ('수학2(김동재)', r'^%s단원 차시별 (학습지-)?형성 평가_(%s)쪽' % (big, pages), 'basic'),
        ('수학2(김화경)', r'^%s-[%s]_' % hwa, 'basic'),
        ('수학2(김화경)', r'^%s_대단원 도전' % hwa[0], 'hard'),
        ('수학2(김화경)', r'^%s_대단원 평가' % hwa[0], 'basic'),
        ('수학2_황선욱_2022_평가자료', r'^\[출제대비문제은행\].*_%s단원_' % bank, 'hard'),
        ('수학2_황선욱_2022_평가자료', r'^\[(소단원마무리|소단원수준별문제)\] ?%s-[%s]\.' % mirae, 'basic'),
        ('수학2_황선욱_2022_평가자료', r'^\[(대단원마무리|대단원평가문제)\] ?%s\.' % mirae[0], 'basic'),
        ('수학2 (황선욱)_2015', r'수준별문제은행_발전_(%s)_|수준별문제은행_최상위_%s_' % (old, old[0]), 'hard'),
        ('수학2 (황선욱)_2015', r'수준별문제은행_(기본|표준)_(%s)_|중단원수준별문제_(%s)_|중단원마무리_(%s)_' % (old, old, old), 'basic'),
    ]


def grade9(old):
    """중3 한 단원의 고르는 표. 중3은 2022 개정 자료가 없어 미래엔 2015(황선욱) 한 종만 쓴다.

    old: 미래엔 2015의 중단원 번호 'a_b'. 대단원 마무리·최상위 문제은행은 대단원에 든 두 중단원이 함께 쓰므로, 꼴 목록을 만들 때 그 단원 것만 센다.
    교과서 본문(교과서HWP)은 문제와 함께 설명이 길지만, 자료가 한 종뿐이라 교과서의 문제·스스로 확인하기도 꼴의 출처로 쓴다.
    """
    big = old.split('_')[0]
    book = '수학3 (황선욱)_2015'
    return [
        (book, r'수준별문제은행_발전_%s_|수준별문제은행_최상위_%s_' % (old, big), 'hard'),
        (book, r'수준별문제은행_(기본|표준)_%s_|중단원수준별문제_%s_|중단원마무리_%s_' % (old, old, old), 'basic'),
        (book, r'소단원마무리_%s_|소단원확인문제_%s_' % (old, old), 'basic'),
        (book, r'^중_수학3_대단원마무리_%s_|대단원_마무리_문제_%s_' % (big, big), 'basic'),
        (book, r'교과서HWP_%s_(?!정답)' % old, 'basic'),
        (book, r'교과서HWP_%s_정답' % big, 'basic'),
    ]


# 중1(2022 개정). 은행의 단원 차례는 천재(김동재)의 중단원 차례를 따른다: 1학기 여섯 단원, 2학기 다섯 단원.
UNITS = {
    '7-1-1': {'title': '소인수분해', 'pick': grade7('1-1', r'1\d|2[0-5]', ('Ⅰ', '12'), ('Ⅰ', '1-3'), 1)},
    '7-1-2': {'title': '정수와 유리수', 'pick': grade7('1-2', r'2[6-9]|[3-5]\d', ('Ⅰ', '3-7'), ('Ⅱ', '1-6'), 2)},
    '7-1-3': {'title': '문자의 사용과 식', 'pick': grade7('2-1', r'6\d|7\d|8[0-3]', ('Ⅱ', '1-3'), ('Ⅲ', '1-3'), 3)},
    '7-1-4': {'title': '일차방정식', 'pick': grade7('2-2', r'8[4-9]|9\d', ('Ⅱ', '45'), ('Ⅲ', '45'), 3)},
    '7-1-5': {'title': '좌표평면과 그래프', 'pick': grade7('3-1', r'10\d|11\d', ('Ⅲ', '12'), ('Ⅳ', '12'), 4)},
    '7-1-6': {'title': '정비례와 반비례', 'pick': grade7('3-2', r'12\d|13\d', ('Ⅲ', '34'), ('Ⅳ', '34'), 4)},
    '7-2-1': {'title': '기본 도형', 'pick': grade7('4-1', r'14\d|15\d|16\d', ('Ⅳ', '1-4'), ('Ⅴ', '1-4'), 5)},
    '7-2-2': {'title': '작도와 합동', 'pick': grade7('4-2', r'17\d|18\d', ('Ⅳ', '56'), ('Ⅴ', '5-7'), 5)},
    '7-2-3': {'title': '평면도형의 성질', 'pick': grade7('5-1', r'19\d|20\d|21[0-3]', ('Ⅴ', '1-3'), ('Ⅵ', '1-5'), 6)},
    '7-2-4': {'title': '입체도형의 성질', 'pick': grade7('5-2', r'21[4-9]|22\d|23\d', ('Ⅴ', '4-7'), ('Ⅶ', '1-5'), 7)},
    '7-2-5': {'title': '자료의 정리와 해석', 'pick': grade7('6-1', r'24\d|25\d|26\d', ('Ⅵ', '1-4'), ('Ⅷ', '1-4'), 8)},
    # 중2(2022 개정): 1학기 여섯 단원, 2학기 일곱 단원. 천재(김동재)의 중단원 2-2·5-1·6-1은 커서 소단원으로 갈랐다.
    '8-1-1': {'title': '유리수와 순환소수', 'pick': grade8('1-1', '12', r'1[3-9]', ('Ⅰ', '12'), ('Ⅰ', '1-3'), 1, '1_1')},
    '8-1-2': {'title': '식의 계산', 'pick': grade8('2-1', '1-3', r'3[4-9]|4[0-5]', ('Ⅰ', '3-6'), ('Ⅱ', '1-5'), 2, '1_[23]')},
    '8-1-3': {'title': '일차부등식', 'pick': grade8('2-2', '12', r'5[3-9]|6[01]', ('Ⅱ', '1-3'), ('Ⅲ', '1-3'), 3, '2_1')},
    '8-1-4': {'title': '연립일차방정식', 'pick': grade8('2-2', '34', r'6[3-9]|7[0-3]', ('Ⅱ', '45'), ('Ⅳ', '12'), 4, '2_2')},
    '8-1-5': {'title': '일차함수와 그 그래프', 'pick': grade8('3-1', '1-3', r'8[7-9]|9\d|10\d', ('Ⅲ', '1-5'), ('Ⅴ', '1-5'), 5, '3_1')},
    '8-1-6': {'title': '일차함수와 일차방정식의 관계', 'pick': grade8('3-2', '12', r'11[7-9]|12[0-3]', ('Ⅲ', '67'), ('Ⅴ', '67'), 5, '3_2')},
    '8-2-1': {'title': '삼각형의 성질', 'pick': grade8('4-1', '1-3', r'14\d|15[01]', ('Ⅳ', '1-3'), ('Ⅵ', '1-4'), 6, '4_1')},
    '8-2-2': {'title': '사각형의 성질', 'pick': grade8('4-2', '12', r'159|16\d|17[01]', ('Ⅳ', '4-6'), ('Ⅵ', '5-7'), 6, '4_2')},
    '8-2-3': {'title': '도형의 닮음', 'pick': grade8('5-1', '12', r'18[5-9]|19[0-3]', ('Ⅴ', '12'), ('Ⅶ', '12'), 7, '5_1')},
    '8-2-4': {'title': '평행선과 선분의 길이의 비', 'pick': grade8('5-1', '34', r'19[5-9]|20[01]', ('Ⅴ', '34'), ('Ⅶ', '34'), 7, '5_1')},
    '8-2-5': {'title': '피타고라스 정리', 'pick': grade8('5-2', '1', r'21[13]', ('Ⅴ', '5'), ('Ⅶ', '5'), 7, '5_2')},
    '8-2-6': {'title': '경우의 수', 'pick': grade8('6-1', '1', r'22[79]|231', ('Ⅵ', '1'), ('Ⅷ', '1'), 8, '6_1')},
    '8-2-7': {'title': '확률', 'pick': grade8('6-1', '23', r'234|237|239|241', ('Ⅵ', '2-4'), ('Ⅷ', '2-4'), 8, '6_2')},
    # 중3(2022 개정 성취기준, 자료는 2015판 한 종): 1학기 여섯 단원은 미래엔 2015의 중단원 차례(1_1 ~ 3_2)를 따른다.
    '9-1-1': {'title': '제곱근과 실수', 'pick': grade9('1_1')},
    '9-1-2': {'title': '근호를 포함한 식의 계산', 'pick': grade9('1_2')},
    '9-1-3': {'title': '다항식의 곱셈과 인수분해', 'pick': grade9('2_1')},
    '9-1-4': {'title': '이차방정식', 'pick': grade9('2_2')},
    '9-1-5': {'title': '이차함수와 그 그래프', 'pick': grade9('3_1')},
    '9-1-6': {'title': '이차함수 y = ax² + bx + c의 그래프', 'pick': grade9('3_2')},
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
