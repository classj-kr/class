# -*- coding: utf-8 -*-
"""교과서마다 단원 차례가 다르다. 한 학기의 여섯 폴더가 저자마다 무슨 단원인지 짐작해 찍는다(로컬 전용).

    python tools/question-bank/unit_order.py 5 1

`_분석/<학년>-<학기>-<단원>/목록.json`의 파일 이름과 글 앞머리에서 단원 이름 낱말을 세어 가장 많이 나온 것을 고른다.
먼저 `analyze_unit.py 학년 학기 단원`을 여섯 번 돌려 두어야 한다.
"""
import io
import json
import os
import re
import sys

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
TITLES = {
    '1-1': ['9까지의 수', '여러 가지 모양', '덧셈과 뺄셈', '비교하기', '50까지의 수'],
    '1-2': ['100까지의 수', '덧셈과 뺄셈', '모양과 시각', '여러 가지 모양', '시계 보기와 규칙 찾기', '규칙 찾기'],
    '2-1': ['세 자리 수', '여러 가지 도형', '덧셈과 뺄셈', '길이 재기', '분류하기', '곱셈'],
    '2-2': ['네 자리 수', '곱셈구구', '길이 재기', '시각과 시간', '표와 그래프', '규칙 찾기'],
    '5-1': ['자연수의 혼합 계산', '약수와 배수', '규칙과 대응', '대응 관계', '약분과 통분', '분수의 덧셈과 뺄셈', '다각형의 둘레와 넓이'],
    '5-2': ['수의 범위와 어림하기', '분수의 곱셈', '합동과 대칭', '소수의 곱셈', '직육면체', '평균과 가능성'],
    '6-1': ['분수의 나눗셈', '각기둥과 각뿔', '소수의 나눗셈', '비와 비율', '여러 가지 그래프', '직육면체의 부피와 겉넓이'],
    '6-2': ['분수의 나눗셈', '소수의 나눗셈', '공간과 입체', '비례식과 비례배분', '원의 넓이', '원주율과 원의 넓이', '원기둥, 원뿔, 구'],
}


def main(argv):
    grade, semester = argv[1], argv[2]
    titles = TITLES[grade + '-' + semester]
    table = {}
    for unit in range(1, 7):
        path = os.path.join(ROOT, 'references', 'textbooks', '수학', '_분석', '%s-%s-%d' % (grade, semester, unit), '목록.json')
        if not os.path.exists(path):
            continue
        rows = json.load(io.open(path, encoding='utf-8'))
        for author in sorted(set(row['author'] for row in rows)):
            mine = [row for row in rows if row['author'] == author]
            text = ' '.join(row['file'] for row in mine)
            for row in mine[:40]:
                try:
                    text += ' ' + io.open(row['txt'], encoding='utf-8').read()[:400]
                except OSError:
                    pass
            text = re.sub(r'\s+', ' ', text)
            counts = sorted(((text.count(title), title) for title in titles), reverse=True)
            table.setdefault(author, {})[unit] = '%s(%d)' % (counts[0][1] if counts[0][0] else '?', len(mine))
    for author, units in sorted(table.items()):
        print('%s: %s' % (author, ' | '.join('%s-%s-%d=%s' % (grade, semester, unit, units.get(unit, '-')) for unit in range(1, 7))))
    return 0


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.exit(main(sys.argv))
