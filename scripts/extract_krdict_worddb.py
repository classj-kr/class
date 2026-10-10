"""기초사전 XML에서 한자어 낱말집을 뽑아 references/dictionaries/worddb.json에 적는다.

한 낱말마다 한자 표기·뜻풀이·예문을 모아 두어, 차시를 만들 때 예문을 골라 쓴다.
원본(references/dictionaries/korean-dict-nikl-sparse)은 크기가 커서 저장소에 두지 않는다.
"""
import glob
import io
import json
import os
import re
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 사적인 대화체 예문은 학습지에 어울리지 않아 걸러 낸다
CHATTY = re.compile(r'나는|내가|우리는|우리 가족|아버지|어머니|할머니|할아버지|남편|아내|엄마|아빠|언니|오빠|누나|'
                    r'형부|동생|사촌|여자 친구|남자 친구|친구가|친구에게|선생님께서|교수님|사모님|민수|민준|지수|'
                    r'승규|유민|영수|수지|지민|그는|그녀|그 사람|김 [가-힣]+|김씨|형은|맞아요|있대요|심하네요|'
                    r'“|”|"|\?|!|네,|아뇨|저는|제가|나의|우리 집')
ENTRY = re.compile(r'<LexicalEntry.*?</LexicalEntry>', re.S)
LEMMA = re.compile(r'<Lemma>\s*<feat att="writtenForm" val="([^"]*)"')
ORIGIN = re.compile(r'<feat att="origin" val="([^"]*)"')
POS = re.compile(r'<feat att="partOfSpeech" val="([^"]*)"')
LEVEL = re.compile(r'<feat att="vocabularyLevel" val="([^"]*)"')
DEFINITION = re.compile(r'<feat att="definition" val="([^"]*)"')
SENTENCE = re.compile(r'<SenseExample>\s*<feat att="type" val="문장" />\s*<feat att="example" val="([^"]*)"')

UNESCAPE = [('&quot;', '"'), ('&amp;', '&'), ('&lt;', '<'), ('&gt;', '>'), ('&apos;', "'")]


def plain(value):
    for old, new in UNESCAPE:
        value = value.replace(old, new)
    return value


def main():
    sources = sorted(glob.glob(os.path.join(ROOT, 'references/dictionaries/korean-dict-nikl-sparse/krdict/*.xml')))
    if not sources:
        raise SystemExit('references/dictionaries/korean-dict-nikl-sparse/krdict/*.xml 이 없습니다.')
    words = {}
    for path in sources:
        text = open(path, encoding='utf-8').read()
        for match in ENTRY.finditer(text):
            entry = match.group(0)
            lemma, origin = LEMMA.search(entry), ORIGIN.search(entry)
            if not lemma or not origin:
                continue
            word = re.sub(r'[-^ ]', '', plain(lemma.group(1)))
            hanja = re.sub(r'[-^ ]', '', plain(origin.group(1)))
            if not re.fullmatch(r'[\u4e00-\u9fff]+', hanja) or len(word) != len(hanja):
                continue
            examples = [plain(item) for item in SENTENCE.findall(entry)]
            examples = [item for item in examples
                        if not CHATTY.search(item) and word in item and 12 <= len(item) <= 80]
            definition = DEFINITION.search(entry)
            words.setdefault(word, []).append({
                'term': word,
                'hanja': hanja,
                'pos': POS.search(entry).group(1) if POS.search(entry) else '',
                'level': LEVEL.search(entry).group(1) if LEVEL.search(entry) else '',
                'def': plain(definition.group(1)) if definition else '',
                'ex': examples[:4],
            })
    out = os.path.join(ROOT, 'references/dictionaries/worddb.json')
    with open(out, 'w', encoding='utf-8') as stream:
        json.dump(words, stream, ensure_ascii=False)
    withExample = sum(1 for records in words.values() for record in records if record['ex'])
    print(f'표제어 {len(words)}개, 뜻풀이 {sum(len(v) for v in words.values())}개, 예문 있는 것 {withExample}개')


if __name__ == '__main__':
    main()
