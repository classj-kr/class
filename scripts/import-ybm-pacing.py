"""Normalize reviewed PDF table layouts; retain exact page/table/row provenance.

Only explicitly reviewed page ranges are imported. Broken font encoding in the
5-2 mathematics source is recovered using a rendered-page transcription.
"""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'game-hub-server/data/textbooks'
CATALOG = json.loads((OUT / 'catalog-2022.json').read_text(encoding='utf-8'))
MANIFEST = json.loads((ROOT / 'references/textbooks/ybm-public-sources.json').read_text(encoding='utf-8'))
MUSIC_UNITS = ['음악으로 시작하는 봄', '음악으로 자라나는 여름', '음악으로 열매 맺는 가을', '음악으로 하나 되는 겨울']

def clean(value):
    return re.sub(r'\s+', ' ', (value or '').replace('\x07', ' ').replace('\x08', ' ')).strip()

def period_numbers(value):
    match = re.fullmatch(r'(\d+)(?:\s*[~–-]\s*(\d+))?', clean(value))
    if not match:
        return None
    start, end = int(match[1]), int(match[2] or match[1])
    if not 0 < start <= end < 200:
        raise ValueError(f'Invalid period range: {value}')
    return list(range(start, end + 1))

def new_plan(source, grade, semester):
    editions = [e for e in CATALOG['editions'] if e['publisher'] == '와이비엠'
                and e['leadAuthor'] == source['author'] and e['subject'] == source['subject'] and grade in e['grades']]
    assert len(editions) == 1, (source, grade)
    return {'id': f"ybm-{source['contentId']}-{grade}-{semester or 'annual'}", 'editionId': editions[0]['id'],
            'curriculum': '2022', 'publisher': '와이비엠', 'subject': source['subject'],
            'grade': grade, 'semester': semester, 'sourceId': source['contentId'],
            'sourceUrl': source['sourceUrl'], 'sourceFile': f"ybm-{source['contentId']}.pdf",
            'sha256': source['sha256'], 'sourceLabel': '공식 교과서 전시관 교수·학습 계획',
            'curriculumVerification': 'publisher-2022-exhibition', 'format': 'pdf-teaching-plan',
            'lessons': []}

def lesson(plan, page, table_no, row_no, raw, unit, topic, periods, pages, **extra):
    numbers = period_numbers(periods)
    result = {'id': f"{plan['id']}-p{page}-t{table_no}-r{row_no}", 'sourcePage': page,
              'sourceTable': table_no, 'sourceRow': row_no, 'sequence': len(plan['lessons']) + 1,
              'semester': plan['semester'], 'unit': clean(unit), 'domain': None, 'topic': clean(topic),
              'periodText': clean(periods), 'periodNumbers': numbers,
              'suggestedPeriods': len(numbers) if numbers else None, 'unitPeriodsText': '',
              'pages': clean(pages) or None, 'supplementaryPages': None,
              'standardCodes': [], 'activities': None, 'materials': None, 'sourceCells': raw, **extra}
    assert result['unit'] and result['topic'] and '(cid:' not in result['topic'], result
    plan['lessons'].append(result)
    return result

def music(data):
    source, plans = data['source'], []
    start_grade = int(source['gradeBand'][0])
    for grade, offset in [(start_grade, 0), (start_grade + 1, 4)]:
        plan = new_plan(source, grade, None)
        unit_number = None
        for page in data['pages'][offset:offset + 4]:
            for ti, table in enumerate(page['tables'], 1):
                if table[0][:3] != ['단원', '제재', '차시']:
                    continue
                for ri, row in enumerate(table[1:], 2):
                    if clean(row[0]):
                        unit_number = int(re.match(r'\d+', row[0])[0])
                    # These unit cells cross PDF page boundaries. Verified against
                    # the coloured unit cells in the rendered original pages.
                    if grade == 4 and page['page'] == 5 and ri >= 10:
                        unit_number = 2
                    if grade == 4 and page['page'] == 7 and ri >= 10:
                        unit_number = 4
                    assert unit_number in (1, 2, 3, 4)
                    assert clean(row[2]).isdigit(), row
                    hours = int(clean(row[2]))
                    lesson(plan, page['page'], ti, ri, row, f'{unit_number}. {MUSIC_UNITS[unit_number-1]}',
                           row[1], '', row[5], granularity='topic', periodText=f'{hours}차시 배정',
                           suggestedPeriods=hours, periodNumbers=None,
                           standardCodes=re.findall(r'\[([^\]]+)\]', row[4] or ''))
        assert sum(l['suggestedPeriods'] for l in plan['lessons']) == 68, grade
        plans.append(plan)
    return plans

def mathematics(data):
    source, plans = data['source'], []
    for grade, semester, first, last in [(3, 1, 1, 3), (3, 2, 4, 6), (4, 1, 7, 8), (4, 2, 9, 10)]:
        plan = new_plan(source, grade, semester)
        domain = unit = None
        previous = 0
        for page in data['pages'][first-1:last]:
            for ti, table in enumerate(page['tables'], 1):
                if '차시명' not in table[0]:
                    continue
                for ri, row in enumerate(table[2:], 3):
                    if clean(row[0]):
                        domain = clean(row[0])
                    if clean(row[1]):
                        unit = clean(row[1])
                    if not clean(row[2]):
                        continue
                    topic = clean(row[2]).replace('Ö', '÷').replace('_', '×')
                    item = lesson(plan, page['page'], ti, ri, row, unit, topic, row[4], row[5],
                                  domain=domain, supplementaryPages=clean(row[6]) or None,
                                  periodBasis='semester-cumulative', granularity='lesson')
                    if item['periodNumbers']:
                        assert item['periodNumbers'][0] == previous + 1, (grade, semester, previous, row)
                        previous = item['periodNumbers'][-1]
                    elif row[4] is None:
                        # A merged allocation spans these topics; avoid counting it twice.
                        prior = plan['lessons'][-2]
                        item.update({'sharedPeriodWith': prior['id'], 'periodText': f'{previous}차시 공동 배정'})
                    # Source enrichment rows have no allocated period: leave null.
        assert previous == 64, (grade, semester, previous)
        plans.append(plan)
    return plans

def mathematics_upper(data):
    # The following labels were checked against rendered pages. Math glyphs can
    # migrate into adjacent rows during PDF extraction, so keep explicit fixes.
    fixes = {
        (1,4):'1. 덧셈과 뺄셈이 섞여 있는 식을 계산해요',
        (1,21):'1. 두 양 사이의 대응 관계를 알아봐요',
        (2,17):'2. 1cm²를 알아봐요',
        (2,18):'3. 직사각형과 정사각형의 넓이를 구해요',
        (2,19):'4. 1cm²보다 더 큰 넓이의 단위를 알아봐요',
        (9,4):'1. (자연수)÷(자연수)의 몫을 분수로 나타내요(1)',
        (9,5):'2. (자연수)÷(자연수)의 몫을 분수로 나타내요(2)',
        (9,6):'3. (분수)÷(자연수)를 계산해요',
        (9,7):'4. (분수)÷(자연수)를 분수의 곱셈으로 나타내어 계산해요',
        (9,22):'1. (소수)÷(자연수)를 알아봐요(1)',
        (9,23):'2. (소수)÷(자연수)를 알아봐요(2)',
        (9,24):'3. (소수)÷(자연수)를 계산해요(1)',
        (9,25):'4. (소수)÷(자연수)를 계산해요(2)',
        (9,26):'5. (소수)÷(자연수)를 계산해요(3)',
        (9,27):'6. (소수)÷(자연수)를 계산해요(4)',
        (9,28):'7. (자연수)÷(자연수)를 계산해요',
        (9,29):'척척 문제를 풀어요',
        (10,25):'3. 부피의 단위 1m³를 알아봐요',
        (10,26):'4. 직육면체의 겉넓이를 구해요',
        (10,30):'도입 / 준비해요 - 안전한 학교생활을 알아봐요',
        (13,4):'1. (분수)÷(분수)를 계산해요(1)',
        (13,5):'2. (분수)÷(분수)를 계산해요(2)',
        (13,6):'3. (분수)÷(분수)를 계산해요(3)',
        (13,7):'4. (자연수)÷(단위분수)를 계산해요',
        (13,8):'5. (자연수)÷(분수)를 계산해요',
        (13,9):'6. (분수)÷(분수)를 (분수)×(분수)로 나타내요',
        (13,20):'6. 위, 앞, 옆에서 본 모양으로 만든 입체도형을 알아봐요',
        (13,25):'1. (소수)÷(소수)를 알아봐요',
        (13,27):'2. (소수)÷(소수)를 계산해요(1)',
        (13,28):'3. (소수)÷(소수)를 계산해요(2)',
        (13,29):'4. (자연수)÷(소수)를 계산해요',
        (13,30):'5. 몫을 반올림하여 나타내요',
    }
    units = {
        (5,1):['자연수의 혼합 계산','약수와 배수','대응 관계','약분과 통분','분수의 덧셈과 뺄셈','다각형의 둘레와 넓이','수학 콘텐츠를 만들어요'],
        (6,1):['분수의 나눗셈','각기둥과 각뿔','소수의 나눗셈','비와 비율','띠그래프와 원그래프','직육면체의 부피와 겉넓이','안전한 학교생활, 우리가 만들어요'],
        (6,2):['분수의 나눗셈','공간과 입체','소수의 나눗셈','원의 둘레와 넓이','비례식과 비례배분','원기둥, 원뿔, 구','세계 인구 박람회를 열어요'],
    }
    plans=[]
    for grade,semester,pages in [(5,1,[1,2]),(6,1,[9,10]),(6,2,[13,14])]:
        plan=new_plan(data['source'],grade,semester)
        ui=-1;domain=None;previous=0
        for pn in pages:
            table=data['pages'][pn-1]['tables'][2]
            assert '차시명' in table[0]
            for rn,row in enumerate(table[2:],3):
                if clean(row[1]):ui+=1
                if clean(row[0]):domain=re.sub(r'^\d+\s*','',clean(row[0])).replace('프로 젝트','프로젝트')
                if not clean(row[2]):continue
                unit=(f'{ui+1}. ' if ui<6 else '')+units[(grade,semester)][ui]
                topic=fixes.get((pn,rn),clean(row[2]))
                item=lesson(plan,pn,3,rn,row,unit,topic,row[4],row[5],domain=domain,
                    supplementaryPages=clean(row[6]) or None,periodBasis='semester-cumulative',granularity='lesson')
                assert item['periodNumbers'] and item['periodNumbers'][0]==previous+1,(grade,semester,pn,rn)
                previous=item['periodNumbers'][-1]
                item['sourceCorrections']=[dict(field='unit',value=unit,basis='rendered-original-unit-heading')]
                if (pn,rn) in fixes:
                    item['sourceCorrections'].append(dict(field='topic',original=row[2],value=topic,basis='rendered-original-math-glyph-and-line-order'))
        assert previous==64 and ui==6,(grade,semester,previous,ui)
        plans.append(plan)
    plans.append(mathematics_52_transcription(data))
    return plans

def mathematics_52_transcription(data):
    file=ROOT/'references/textbooks/ybm-math52-reviewed-transcription.json'
    reviewed=json.loads(file.read_text(encoding='utf-8'))
    assert reviewed['sourceId']==data['source']['contentId']
    plan=new_plan(data['source'],5,2)
    units=[(1,'수와 연산','1. 수의 범위와 어림하기'),(11,'수와 연산','2. 분수의 곱셈'),
           (21,'도형과 측정','3. 합동과 대칭'),(31,'수와 연산','4. 소수의 곱셈'),
           (42,'도형과 측정','5. 직육면체와 정육면체'),(51,'자료와 가능성','6. 평균과 가능성'),
           (61,'프로젝트','건강한 식사를 해요')]
    for pg in reviewed['pages']:
        pn=pg['sourcePage'];table=data['pages'][pn-1]['tables'][pg['sourceTable']-1]
        assert len(pg['rows'])==len(table)-2
        for rn,(topic,pages,exercise) in enumerate(pg['rows'],pg['firstSourceRow']):
            n=len(plan['lessons'])+1
            _,domain,unit=next(u for u in reversed(units) if n>=u[0])
            item=lesson(plan,pn,pg['sourceTable'],rn,table[rn-1],unit,topic,str(n),pages,
                domain=domain,supplementaryPages=exercise or None,periodBasis='semester-cumulative',granularity='lesson')
            item['sourceCorrections']=[dict(fields=['unit','topic','periodText','pages','supplementaryPages'],
                basis='visually-transcribed-original-pdf-broken-font-encoding',reviewFile=file.name)]
    assert len(plan['lessons'])==64
    return plan

SOCIAL_UNITS = {
    (5, 1): ['우리나라 국토 여행', '우리나라 지리 탐구', '법과 인권의 보장'],
    (5, 2): ['유적과 유물로 살펴본 옛 사람들의 생활', '달라지는 시대, 변화하는 생활 모습', '식민 통치와 저항, 전쟁이 바꾼 사회와 생활'],
    (6, 1): ['평화 통일을 위한 노력, 민주화와 산업화', '민주주의와 시민의 참여', '지구, 대륙 그리고 국가들'],
    (6, 2): ['세계의 자연환경', '시장경제와 국가 간 거래', '지구촌 사람들']
}

def social_lower(data):
    # The exhibition's file covers 3-1 only (not the whole advertised band).
    # Both rendered pages were checked, including blank intro allocations.
    plan=new_plan(data['source'],3,1)
    units=['우리가 사는 곳','일상에서 만나는 과거']
    for page in data['pages']:
        subunit=None
        for ti,table in enumerate(page['tables'],1):
            if table[0]!=['주제','차시','차시명','교과서\n쪽수']:continue
            for ri,row in enumerate(table[1:],2):
                if clean(row[0]):subunit=clean(row[0])
                lesson(plan,page['page'],ti,ri,row,f"{page['page']}. {units[page['page']-1]}",
                       row[2].replace('\n',''),row[1],row[3],subunit=subunit,periodBasis='unit',
                       granularity='lesson',reviewStatus='source-period-blank' if not clean(row[1]) else None)
    assert len(plan['lessons'])==36
    assert sum(l['suggestedPeriods'] or 0 for l in plan['lessons'])==48
    plan['allocationNote']='단원 도입 두 행의 차시 칸은 공란이므로 별도 시수를 추가하지 않음. 원본은 사회 3-1만 수록.'
    return [plan]

def social(data):
    plans = []
    for grade, semester, first in [(5, 1, 1), (5, 2, 3), (6, 1, 5), (6, 2, 7)]:
        plan = new_plan(data['source'], grade, semester)
        unit_number, subunit = None, None
        for page in data['pages'][first-1:first+1]:
            for ti, table in enumerate(page['tables'], 1):
                if len(table) < 10 or not any('차시명' in row for row in table[:2]):
                    continue
                for ri, row in enumerate(table[2:], 3):
                    unit_match = re.match(r'^(\d)\.', clean(row[0]))
                    if unit_match:
                        unit_number = int(unit_match[1])
                    if clean(row[1]):
                        subunit = clean(row[1])
                    if not clean(row[3]):
                        continue
                    assert unit_number in (1, 2, 3), row
                    lesson(plan, page['page'], ti, ri, row,
                           f'{unit_number}. {SOCIAL_UNITS[(grade, semester)][unit_number-1]}',
                           row[3], row[2], row[4], subunit=subunit, granularity='lesson', periodBasis='unit')
        assert sum(l['suggestedPeriods'] or 0 for l in plan['lessons']) == 48, (grade, semester)
        plans.append(plan)
    return plans

def practical(data):
    plans = []
    for grade, page in zip((5, 6), data['pages']):
        plan = new_plan(data['source'], grade, None)
        unit = allocation = None
        assert len(page['tables']) == 1
        for ri, row in enumerate(page['tables'][0][2:], 3):
            if clean(row[0]):
                unit = clean(row[0])
                allocation = None
            assert clean(row[1]) and clean(row[3]), row
            hours = int(row[2]) if clean(row[2]) else None
            item = lesson(plan, page['page'], 1, ri, row, unit, row[1], '', row[3],
                          granularity='subunit', suggestedPeriods=hours,
                          periodText=f'{hours}차시 배정' if hours else '', periodBasis='allocation')
            if hours is not None:
                allocation = item
            else:
                # Visually verified merged cells include enrichment and closing
                # rows in the preceding subunit's allocation, not extra hours.
                assert allocation is not None
                item.update(sharedPeriodWith=allocation['id'],
                            periodText=f"{allocation['suggestedPeriods']}차시 공동 배정")
        assert sum(l['suggestedPeriods'] or 0 for l in plan['lessons']) == 64
        plans.append(plan)
    return plans


def physical_education(data):
    plans = []
    start_grade = int(data['source']['gradeBand'][0])
    expected = {3: (55, 47), 4: (52, 50), 5: (53, 49), 6: (52, 50)}
    # The first unit titles on these pages sit across broken PDF cell borders.
    # Transcribed from the rendered originals; original extracted cells retained.
    repaired_units = {3: '02. 나에게 맞는 체력 운동을 해요',
                      4: '02. 운동을 규칙적으로 실천해요'}
    for index, page in enumerate(data['pages']):
        grade, semester = start_grade + index // 2, index % 2 + 1
        plan = new_plan(data['source'], grade, semester)
        plan['isPublisherExample'] = True
        unit = domain = None
        for ti, table in enumerate(page['tables'], 1):
            if len(table[0]) not in (8, 10):
                continue
            malformed = len(table[0]) == 10
            for ri, raw in enumerate(table, 1):
                row = list(raw)
                corrections = []
                related_rows = []
                if grade == 3 and semester == 1 and ri == 4:
                    # One visual row was split into two extracted rows.
                    row[6:8] = table[4][6:8]
                    related_rows = [{'sourceRow': 5, 'sourceCells': table[4]}]
                    corrections.append({'fields': ['suggestedPeriods', 'pages'],
                                        'basis': 'rendered-original-page-and-following-extracted-row'})
                if (grade, semester, ri) in ((3, 1, 6), (4, 1, 7)):
                    row[3] = '스포츠'
                    row[4] = ('01. 이동하며 움직여요' if grade == 3 else
                              '01. 기술형 스포츠의 움직임을 익혀요')
                    corrections.append({'fields': ['domain', 'unit'],
                                        'basis': 'rendered-original-merged-cell-start'})
                domain_index, unit_index, topic_index, hours_index, pages_index = (
                    (4, 5, 7, 8, 9) if malformed else (3, 4, 5, 6, 7))
                if not clean(row[topic_index]) or not clean(row[hours_index]).isdigit():
                    continue
                if clean(row[domain_index]):
                    domain = clean(row[domain_index])
                if clean(row[unit_index]):
                    unit = clean(row[unit_index])
                    if malformed and unit == '02.':
                        unit = repaired_units[grade]
                        corrections.append({'field': 'unit', 'original': row[unit_index],
                                            'value': unit, 'basis': 'rendered-original-page'})
                hours = int(row[hours_index])
                item = lesson(plan, page['page'], ti, ri, raw, unit, row[topic_index], '', row[pages_index],
                              domain=domain, granularity='activity-group', periodBasis='allocation',
                              suggestedPeriods=hours, periodText=f'{hours}차시 배정')
                if corrections:
                    item['sourceCorrections'] = corrections
                if related_rows:
                    item['relatedSourceRows'] = related_rows
        total = sum(l['suggestedPeriods'] for l in plan['lessons'])
        assert total == expected[grade][semester-1], (grade, semester, total)
        plans.append(plan)
    return plans

def english(data):
    source = data['source']
    first_grade = int(source['gradeBand'][0])
    plans = [new_plan(source, first_grade + i, None) for i in range(2)]
    kim = source['author'] == '김혜리'
    for page in data['pages']:
        plan = plans[(page['page'] - 1) // 2]
        for ti, table in enumerate(page['tables'], 1):
            if len(table[0]) not in (6, 8):
                continue
            for ri, row in enumerate(table, 1):
                title = clean(row[0])
                if not re.match(r'(Lesson|Leson|Special|Review|Hello,)', title):
                    continue
                if kim:
                    # The open right border excludes this column from PDF table
                    # extraction. All 8 rendered pages were checked individually.
                    hours = (4 if first_grade == 3 else 6) if title.startswith('Lesson') else 2
                else:
                    assert clean(row[-1]).isdigit(), row
                    hours = int(row[-1])
                item = lesson(plan, page['page'], ti, ri, row, title, title, '', '',
                              granularity='unit', periodBasis='allocation',
                              suggestedPeriods=hours, periodText=f'{hours}차시 배정')
                if kim:
                    item['sourceCorrections'] = [{'field': 'suggestedPeriods', 'original': row[-1],
                        'value': hours, 'basis': 'rendered-original-rightmost-allocation-column'}]
    expected = ([58, 58] if kim else [58, 60]) if first_grade == 3 else [84, 84]
    for plan, hours in zip(plans, expected):
        assert sum(l['suggestedPeriods'] for l in plan['lessons']) == hours
        plan['allocationNote'] = '출판사 원본의 단원별 배정 시간 합계이며 연간 법정 시수나 학교 편성 시수로 보정하지 않음'
    return plans

def run():
    parsers = {'C20240816014628qL0rN': mathematics, 'C20250807032905hlklU': mathematics_upper, 'C20240816022554GR1qu': music,
               'C20250807032906uqzmm': music, 'C20250807032904RULhs': social, 'C20240816020127AMS2V': social_lower,
               'C2025080703290511OI8': practical,
               'C20240816024016ZENyp': physical_education,
               'C20250807032907wIt5H': physical_education,
               'C20240816121044UDjce': english, 'C20250807032906jLbXE': english,
               'C20240816122043uSZ0q': english, 'C20250807032906yzWN0': english}
    plans = []
    for cid, parser in parsers.items():
        data = json.loads((ROOT / 'references/textbooks/extracted/ybm' / f'{cid}.json').read_text(encoding='utf-8'))
        plans.extend(parser(data))
    (OUT / 'pacing-ybm-2022.json').write_text(json.dumps({'schemaVersion': 1, 'publisher': '와이비엠',
            'plans': plans}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    report = {'reviewedOn': '2026-10-09', 'plans': [{k: p[k] for k in ('id', 'sourceId', 'grade', 'semester', 'subject')} |
             {'sourcePages': sorted({l['sourcePage'] for l in p['lessons']}), 'lessonRows': len(p['lessons'])} for p in plans],
             'remaining': [{'contentId': s['contentId'], 'subject': s['subject'], 'status': 'unreviewed-pages-remain'}
                           for s in MANIFEST['sources'] if s['contentId'] not in parsers or s['contentId']=='C20250807032904RULhs']}
    (ROOT / 'references/textbooks/ybm-normalization-review.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    subprocess.run(['node', str(ROOT / 'scripts/build-textbook-coverage.cjs')], check=True)
    print(json.dumps({'plans': len(plans), 'lessonRows': sum(len(p['lessons']) for p in plans)}))

if __name__ == '__main__':
    run()
