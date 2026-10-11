# -*- coding: utf-8 -*-
"""수집해 둔 초등 수학 평가 자료에서 한 단원을 뽑아 유형 분석에 쓸 집계를 만든다(로컬 전용).

    python tools/question-bank/analyze_unit.py 3 1 2          3학년 1학기 2단원
    python tools/question-bank/analyze_unit.py 3 1 2 --top 80  지시문을 80개까지 찍는다

하는 일
  1. references/textbooks/수학/01_자료 에서 그 학년·학기·단원의 hwp·pdf 를 찾아 글과 수식을 뽑는다.
     → references/textbooks/수학/_분석/<학년>-<학기>-<단원>/추출/…txt, 목록.json
  2. 지시문(묻는 문장)을 모아 수와 수식을 #·⟨식⟩으로 바꾼 뒤, 교과서 몇 종·문서 몇 건에 나오는지 센다.
     → 지시문_집계.tsv, 화면에는 위에서부터 찍는다.
  3. 문서 유형별 분량과 '기본/실력' 표시를 함께 보여 준다.
뽑은 글은 출판사 저작물이다. _분석 폴더는 깃에 올라가지 않는다(.gitignore 의 /references/textbooks/).
"""
import collections
import io
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hwp_text import hwp_to_text  # noqa: E402

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = os.path.join(ROOT, 'references', 'textbooks', '수학', '01_자료')
# 문항이 아닌 문서(채점 기준표, 앞 학년 내용을 묻는 진단평가 등)
SKIP_KINDS = {'평가체크리스트', '진단평가', '포트폴리오평가'}
ASK = re.compile(r'(세요|시오|까요|입니까|나요|일까요|인가요|는가요)[.?]?\s*(\(.*\))?$')


def unit_files(grade, semester, unit):
    term = '%d학년 %d학기' % (grade, semester)
    pattern = re.compile(r'(?<!\d)0?%d단원|%d-%d-%d(?!\d)' % (unit, grade, semester, unit))
    for publisher in sorted(os.listdir(SRC)):
        base = os.path.join(SRC, publisher, term)
        for folder, _dirs, files in os.walk(base):
            for name in files:
                path = os.path.join(folder, name)
                if not pattern.search(path.replace(os.sep, '/')):
                    continue
                parts = os.path.relpath(path, base).split(os.sep)
                yield publisher, parts[0], (parts[1] if len(parts) > 2 else '?'), path


def read_text(path):
    ext = os.path.splitext(path)[1].lower()
    if ext == '.hwp':
        text = hwp_to_text(path)
    elif ext == '.pdf':
        import pymupdf
        doc = pymupdf.open(path)
        text = '\n'.join(page.get_text() for page in doc)
        doc.close()
    else:
        return None
    return text.encode('utf-8', 'ignore').decode('utf-8')


def level_of(name):
    if re.search(r'실력|심화|B형|도전|응용', name):
        return '실력'
    if re.search(r'기본|기초|A형', name):
        return '기본'
    return '?'


def normalize(line):
    def equation(match):
        body = match.group(1)
        return '#' if re.fullmatch(r'[\d\s,.]+', body) else '⟨식⟩'
    line = re.sub(r'\[수식: ([^\]]*)\]', equation, line)
    line = re.sub(r'\[수식\]', '⟨식⟩', line)
    line = re.sub(r'\d[\d,.]*', '#', line)
    return re.sub(r'\s+', ' ', line).strip()


def main(argv):
    if len(argv) < 4:
        print(__doc__)
        return 2
    grade, semester, unit = int(argv[1]), int(argv[2]), int(argv[3])
    top = int(argv[argv.index('--top') + 1]) if '--top' in argv else 60
    out = os.path.join(ROOT, 'references', 'textbooks', '수학', '_분석', '%d-%d-%d' % (grade, semester, unit))
    rows, failed = [], 0
    for publisher, author, kind, path in unit_files(grade, semester, unit):
        try:
            text = read_text(path)
        except Exception:  # 못 읽는 문서는 세기만 한다.
            failed += 1
            continue
        if text is None:
            continue
        target = os.path.join(out, '추출', publisher, author, kind, os.path.splitext(os.path.basename(path))[0] + '.txt')
        os.makedirs(os.path.dirname(target), exist_ok=True)
        with io.open(target, 'w', encoding='utf-8') as handle:
            handle.write(text)
        rows.append({'pub': publisher, 'author': author, 'kind': kind, 'file': os.path.basename(path), 'chars': len(text), 'txt': target})
    os.makedirs(out, exist_ok=True)
    with io.open(os.path.join(out, '목록.json'), 'w', encoding='utf-8') as handle:
        json.dump(rows, handle, ensure_ascii=False, indent=0)

    kinds = collections.Counter()
    for row in rows:
        kinds[row['kind']] += 1
    print('%d학년 %d학기 %d단원: 문서 %d개(못 읽음 %d), 교과서 %d종, 글자 %d' % (
        grade, semester, unit, len(rows), failed, len({r['author'] for r in rows}), sum(r['chars'] for r in rows)))
    print('문서 유형: ' + ', '.join('%s %d' % kv for kv in kinds.most_common()))

    stems = {}
    for row in rows:
        if row['kind'] in SKIP_KINDS:
            continue
        level = level_of(row['file'])
        with io.open(row['txt'], encoding='utf-8') as handle:
            for line in handle.read().split('\n'):
                line = line.strip()
                if not (8 <= len(line) <= 170) or not ASK.search(line):
                    continue
                key = normalize(line)
                entry = stems.setdefault(key, {'books': set(), 'docs': set(), 'levels': collections.Counter(), 'example': line})
                entry['books'].add(row['author'])
                entry['docs'].add(row['txt'])
                entry['levels'][level] += 1
    ranked = sorted(stems.items(), key=lambda kv: (-len(kv[1]['books']), -len(kv[1]['docs'])))
    with io.open(os.path.join(out, '지시문_집계.tsv'), 'w', encoding='utf-8') as handle:
        for key, entry in ranked:
            handle.write('%d\t%d\t%s\t%s\t%s\n' % (len(entry['books']), len(entry['docs']), dict(entry['levels']), key, entry['example']))
    print('지시문 %d가지. 위에서부터:' % len(ranked))
    for key, entry in ranked[:top]:
        levels = ' '.join('%s%d' % kv for kv in entry['levels'].most_common())
        print('%d종 %3d건 %s | %s' % (len(entry['books']), len(entry['docs']), levels, key))
    return 0


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.exit(main(sys.argv))
