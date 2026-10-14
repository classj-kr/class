"""고등 사회·과학 글에서 한자어를 세어, 지금 가르치는 글자로 몇 낱말이 읽히는지 잰다.

재료
  references/dictionaries/korean-dict-nikl-sparse/krdict/*.xml  국립국어원 한국어기초사전 (한글 표제어 ↔ 원어 한자)
  learning/inquiry/<과목 앱>                실제로 아이가 읽는 교과 글
내놓는 것
  scripts/hanja-subject-word-weights.json   낱말 → {한자 표기, 과목별로 고른 무게}
  표준 출력                                 지금 글자로 읽히는 비율과, 더 배울 글자의 차례
"""
import glob
import io
import json
import os
import re
import sys
from collections import Counter, defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 잣대의 뼈대: 2022 개정 교육과정 성취기준·성취수준 원문 (fetch_curriculum_standards.py로 받는다)
CURRICULUM_DIR = 'references/moe/local-source'
# 보조: 아이가 실제로 읽는 이 사이트의 교과 글
SUBJECT_DIRS = ['science-lab', 'periodic-table', 'human-body', 'space',
                'korean-history', 'korea-geography', 'world-geography', 'age-of-exploration']

# 한자어처럼 걸려들지만 실제로는 우리말인 것들
# 성취수준 문서에만 잔뜩 나오는 평가 사무용 말. 교과 내용어가 아니라 빼고 센다.
BOILERPLATE = set('평가 예시 답안 채점 문항 수행 도구 과목 학생 교육과정 영역 성취 기준 수준 서술 제시 활용 '
                  '방안 내용 요소 사례 자료 이해 분석 파악 조사 탐구 해결 문제 고등학교 학교 학습 수업 교사 '
                  '배점 정답 오답 유의 참고 진술 관련 다음 경우 대상 결과 과정 방법 능력 태도 개념 지식 소개 '
                  '설명 작성 판단 선택 구성 제작 발표 토론 활동 실험 관찰 측정 계획 정리 확인 적용 평가지 답지'.split())

STOP = set('가장 대로 하지 대한 가운 일어 이지 지고 동안 위해 남아 이의 이루 이면 지가 도록 물의 수록 '
           '그만 아니 부터 만큼 이나 어느 무리 어서 오는 되어 에서 으로 하나 이는 이를 이와 이때 아래 사이'.split())

ENTRY = re.compile(r'<LexicalEntry.*?</LexicalEntry>', re.S)
LEMMA = re.compile(r'<Lemma>\s*<feat att="writtenForm" val="([^"]*)"')
ORIGIN = re.compile(r'<feat att="origin" val="([^"]*)"')


def load_dictionary():
    """한글 표제어 → 한자 표기 후보들."""
    words = defaultdict(set)
    for path in sorted(glob.glob(os.path.join(ROOT, 'references/dictionaries/korean-dict-nikl-sparse/krdict/*.xml'))):
        text = open(path, encoding='utf-8').read()
        for match in ENTRY.finditer(text):
            entry = match.group(0)
            lemma, origin = LEMMA.search(entry), ORIGIN.search(entry)
            if not lemma or not origin:
                continue
            word = re.sub(r'[-^ ]', '', lemma.group(1))
            hanja = re.sub(r'[-^ ]', '', origin.group(1))
            if re.fullmatch(r'[\u4e00-\u9fff]+', hanja) and len(word) == len(hanja):
                words[word].add(hanja)
    return {word: sorted(forms) for word, forms in words.items()}


def read_subject_text(name):
    chunks = []
    for base, _, files in os.walk(os.path.join(ROOT, 'learning/inquiry', name)):
        if 'node_modules' in base:
            continue
        for filename in files:
            if filename.endswith(('.js', '.html', '.json', '.mjs')):
                chunks.append(open(os.path.join(base, filename), encoding='utf-8', errors='ignore').read())
    return re.findall(r'[가-힣]{2,}', '\n'.join(chunks))


def count_words(runs, dictionary, longest):
    """가장 긴 것부터 맞춰 가며 한자어를 센다."""
    counted = Counter()
    for run in runs:
        i = 0
        while i < len(run):
            hit = None
            for size in range(min(longest, len(run) - i), 1, -1):
                if run[i:i + size] in dictionary:
                    hit = run[i:i + size]
                    break
            if hit:
                counted[hit] += 1
                i += len(hit)
            else:
                i += 1
    return counted


def main():
    dictionary = load_dictionary()
    longest = max(len(word) for word in dictionary)
    print(f'사전 표제어 {len(dictionary)}개')

    per_subject = {}
    for path in sorted(glob.glob(os.path.join(ROOT, CURRICULUM_DIR, '*.txt'))):
        runs = re.findall(r'[가-힣]{2,}', open(path, encoding='utf-8').read())
        counted = count_words(runs, dictionary, longest)
        for word in STOP | BOILERPLATE:
            counted.pop(word, None)
        name = '성취기준:' + os.path.basename(path)[:-4]
        per_subject[name] = counted
        print(f'  {name:28s} 한자어 {sum(counted.values())}번')
    if not per_subject:
        print('  (성취기준 원문이 없습니다. scripts/fetch_curriculum_standards.py를 먼저 돌리세요.)')
    for name in SUBJECT_DIRS:
        counted = count_words(read_subject_text(name), dictionary, longest)
        for word in STOP:
            counted.pop(word, None)
        per_subject['사이트:' + name] = counted
        print(f'  사이트:{name:22s} 한자어 {sum(counted.values())}번')

    # 과목마다 같은 무게(1000점)를 주어 한 과목 글이 많다고 치우치지 않게 한다
    weight, raw = Counter(), Counter()
    for counted in per_subject.values():
        total = sum(counted.values())
        for word, n in counted.items():
            weight[word] += n / total * 1000
            raw[word] += n
    words = [word for word in weight if raw[word] >= 3]

    # 표기가 여럿인 낱말은, 홑후보 낱말로 먼저 잰 글자 점수가 높은 쪽을 고른다
    char_score = Counter()
    for word in words:
        if len(dictionary[word]) == 1:
            for character in dictionary[word][0]:
                char_score[character] += weight[word]
    chosen = {}
    for word in words:
        chosen[word] = max(dictionary[word], key=lambda form: sum(char_score[c] for c in form) / len(form))

    overrides = json.load(open(os.path.join(ROOT, 'scripts/hanja-word-hanja-overrides.json'), encoding='utf-8'))
    for word, form in overrides.items():
        if word in chosen:
            chosen[word] = form

    out = {word: {'hanja': chosen[word], 'weight': round(weight[word], 2)} for word in words}

    # 정치·법·경제·사회문화는 이 저장소에 앱이 없어 글 표본에 안 잡힌다. 한 과목 몫을 따로 얹는다.
    social = json.load(open(os.path.join(ROOT, 'scripts/hanja-social-studies-terms.json'), encoding='utf-8'))['terms']
    share = 2000 / len(social)
    for term in social:
        form = overrides.get(term) or chosen.get(term) or (dictionary[term][0] if term in dictionary else None)
        if not form:
            print(f'  사전에 없어 건너뜀: {term}')
            continue
        entry = out.setdefault(term, {'hanja': form, 'weight': 0})
        entry['hanja'] = form
        entry['weight'] = round(entry['weight'] + share, 2)
    with open(os.path.join(ROOT, 'scripts/hanja-subject-word-weights.json'), 'w', encoding='utf-8') as stream:
        json.dump(out, stream, ensure_ascii=False)
    print(f'낱말 {len(out)}개를 scripts/hanja-subject-word-weights.json에 적었습니다.')

    taught = set(re.findall(r'[\u4e00-\u9fff]', open(
        os.path.join(ROOT, 'learning/literacy-numeracy/hanja-meaning/v2/index.html'), encoding='utf-8').read()))
    readable = [w for w in out if all(c in taught for c in out[w]['hanja'])]
    total_weight = sum(v['weight'] for v in out.values())
    print(f'지금 {len(taught)}자로 통째로 읽히는 낱말 {len(readable)}/{len(out)} '
          f'({100 * len(readable) / len(out):.0f}%), 글에 나온 횟수로는 '
          f'{100 * sum(out[w]["weight"] for w in readable) / total_weight:.0f}%')


if __name__ == '__main__':
    main()
