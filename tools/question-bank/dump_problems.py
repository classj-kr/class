# -*- coding: utf-8 -*-
"""한 단원의 뽑아 둔 글에서 문제 부분만 모아 한 파일로 만든다(로컬 전용).

    python tools/question-bank/dump_problems.py 3-1-1 hard     심화·실력·서술형 문서만 → 심화문서_모음.txt
    python tools/question-bank/dump_problems.py 3-1-1 basic    그 밖의 문서 → 기본문서_모음.txt
    python tools/question-bank/dump_problems.py 3-1-1 basic --split 3    모음을 문서 경계에서 세 덩이로도 나눈다
    python tools/question-bank/dump_problems.py 3-1-2 hard --keep-answers    정답·풀이를 자르지 않는다(그림이 중심인 단원)
    python tools/question-bank/dump_problems.py 3-1-2 basic --without 박만구 --also 3-1-1:박만구
        단원 차례가 다른 교과서: 그 저자를 빼고, 내용이 맞는 다른 단원 폴더에서 그 저자의 문서를 가져온다
    python tools/question-bank/dump_problems.py 3-1-1 all --only 3-1-2:박만구 --name 보충
        다른 단원 폴더에 있는 한 저자의 문서만 모은다(수준을 가르지 않고 → 보충문서_모음.txt)

정답·해설이 시작되는 곳에서 자르고, 같은 내용의 문서(학생용·교사용, 재수록)는 한 번만 싣는다.
이 파일을 처음부터 끝까지 읽어 "서로 다른 문제 꼴" 목록(기본꼴_N.md, 심화꼴.md)을 만든다. 숫자나 말만 다른 문제는 한 꼴이다.
문제은행의 유형은 그 목록에 있는 꼴에서만 가져온다. 기본 문서는 길어서 덩이로 나누어 하나씩 읽는다.
"""
import io
import json
import os
import re
import sys

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
HARD = re.compile(r'심화|실력|도전|응용|독해|오개념|서술|서·논술|문장제')
NOT_PROBLEMS = re.compile(r'체크리스트|진단평가|포트폴리오|정답|교사용|선생님용|예시답안|문항카드')


def clean(text):
    text = re.sub(r'\[수식: ([^\]]*)\]', r'\1', text)
    text = re.sub(r'\[표\]|\[그림\]', '', text)
    text = text.replace('`', '').replace('rm ', '').replace(chr(92), '')
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n+', '\n', text)
    # 세로셈처럼 한 글자씩 끊긴 줄은 한 줄로 붙인다.
    return re.sub(r'(?m)^(\S)\n(?=\S(\n|$))', r'\1 ', text)


def main(argv):
    unit, which = argv[1], argv[2]
    analysis = os.path.join(ROOT, 'references', 'textbooks', '수학', '_분석')
    base = os.path.join(analysis, unit)

    def listed(unit_id):
        with io.open(os.path.join(analysis, unit_id, '목록.json'), encoding='utf-8') as handle:
            return json.load(handle)

    def option(name):
        return argv[argv.index(name) + 1] if name in argv else ''

    # 교과서마다 단원 차례가 다르다(천재 박만구 3-1은 1단원이 평면도형, 2단원이 덧셈과 뺄셈).
    # 그런 책은 --without 으로 빼고, 내용이 맞는 다른 단원 폴더의 문서를 --also 로 가져온다.
    rows = [row for row in listed(unit) if not option('--without') or option('--without') not in row['author']]
    if option('--also'):
        other, author = option('--also').split(':')
        rows += [row for row in listed(other) if author in row['author']]
    if option('--only'):
        other, author = option('--only').split(':')
        rows = [row for row in listed(other) if author in row['author']]
    seen, count, size, bodies = set(), 0, 0, []
    target = os.path.join(base, (option('--name') or ('심화' if which == 'hard' else '기본')) + '문서_모음.txt')
    with io.open(target, 'w', encoding='utf-8') as out:
        for row in rows:
            label = row['file'] + ' ' + row['kind']
            if NOT_PROBLEMS.search(label) or (which != 'all' and bool(HARD.search(label)) != (which == 'hard')):
                continue
            with io.open(row['txt'], encoding='utf-8') as handle:
                text = clean(handle.read())
            cuts = [m.start() for m in re.finditer(r'\n문항 ?\n?번호|\n정답\s*\n|\n정답과 풀이|\n정답 및 풀이|\n풀이\n', text)]
            # 도형 단원처럼 그림이 빠지면 정답·풀이가 그림 속 조건을 알려 준다. 그럴 때는 --keep-answers 로 자르지 않는다.
            body = text[:min(cuts)] if cuts and '--keep-answers' not in argv else text
            key = re.sub(r'\s+', '', body)[60:360]
            if len(body) < 80 or key in seen:
                continue
            seen.add(key)
            bodies.append('===== %s %s %s | %s\n%s\n\n' % (row['pub'], row['author'], row['kind'], row['file'], body.strip()))
            out.write(bodies[-1])
            count += 1
            size += len(body)
    print('%s: 문서 %d개, %d자 → %s' % (which, count, size, os.path.relpath(target, ROOT)))
    if '--split' in argv:
        # 길어서 한 번에 못 읽는 모음을 문서 경계에서 고르게 나눈다(기본문서_1.txt …).
        parts, index, chunk, filled = int(argv[argv.index('--split') + 1]), 1, [], 0
        for body in bodies:
            chunk.append(body)
            filled += len(body)
            if filled >= size / parts and index < parts:
                with io.open(target.replace('_모음.txt', '_%d.txt' % index), 'w', encoding='utf-8') as handle:
                    handle.write(''.join(chunk))
                index, chunk, filled = index + 1, [], 0
        with io.open(target.replace('_모음.txt', '_%d.txt' % index), 'w', encoding='utf-8') as handle:
            handle.write(''.join(chunk))
        print('  %d덩이로 나눔' % index)
    return 0


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.exit(main(sys.argv))
