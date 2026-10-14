import ast
import csv
import io
import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SCRIPT_DIR = ROOT / 'scripts'
GRADE_CSV = ROOT / 'references/dictionaries/hanja-grade-dataset' / 'hanja.csv'
KRDICT_DIR = ROOT / 'references/dictionaries/korean-dict-nikl-sparse' / 'krdict'
CANDIDATE_OUT = SCRIPT_DIR / 'hanja-csat-expansion-candidates.json'
LESSON_OUT = SCRIPT_DIR / 'hanja-v2-lessons-06.json'
STANDARD_OUT = SCRIPT_DIR / 'hanja-csat-expansion-selection.json'
OVERRIDE_OUT = SCRIPT_DIR / 'hanja-example-overrides.json'

LEVELS = {'8급', '7급Ⅱ', '7급', '6급Ⅱ', '6급', '5급Ⅱ', '5급'}
EXCLUDED = set()
HANGUL = re.compile(r'^[가-힣]{2,6}$')
CJK = re.compile(r'^[\u3400-\u9fff\uf900-\ufaff]+$')
INVALID_XML = re.compile(rb'[\x00-\x08\x0b\x0c\x0e-\x1f]')
BAD_SENTENCE = re.compile(
    r'(?:나는|내가|우리는|우리 가족|아버지|어머니|할머니|할아버지|남편|아내|'
    r'언니|오빠|누나|형부|동생|사촌|여자 친구|남자 친구|친구가|친구에게|'
    r'선생님께서|교수님|사모님|민수|민준|지수|승규|유민|영수|수지|지민|'
    r'그는|그녀|그 사람|김 [가-힣]+|김씨|형은|엄마|맞아요|있대요|심하네요|'
    r'그랬다|했지요|했어요|할까요|이죠\.|거예요|겁니다\.|“|”|"|\?)'
)
MANUAL_ENTRIES = [
    {'term':'혁혁','hanja':'赫赫','origin':'赫赫','definition':'공로나 업적이 매우 뚜렷하다.','sentence':'그 독립운동가는 국권 회복에 혁혁한 공을 세워 역사에 이름을 남겼습니다.','sentenceScore':4},
    {'term':'정렬','hanja':'整列','origin':'整列','definition':'가지런히 줄지어 늘어섬.','sentence':'수집한 측정값을 작은 수부터 정렬하자 자료의 분포를 비교하기 쉬워졌습니다.','sentenceScore':0},
    {'term':'참기름','hanja':'고유어·외래어','origin':'','definition':'참깨로 짠 기름.','sentence':'참기름은 불포화 지방산과 고소한 향을 지녀 나물이나 비빔밥에 널리 쓰입니다.','sentenceScore':0},
    {'term':'능히','hanja':'고유어·외래어','origin':'','definition':'능력이 있어서 쉽게.','sentence':'충분한 근거와 일관된 논리를 갖춘 설명은 반대 의견에도 능히 답할 수 있습니다.','sentenceScore':0},
    {'term':'설거지','hanja':'고유어·외래어','origin':'','definition':'먹고 난 뒤 그릇을 씻어 정리하는 일.','sentence':'급식실에서는 물 사용량을 줄이기 위해 설거지 전에 음식물 찌꺼기를 따로 모읍니다.','sentenceScore':0},
    {'term':'이메일','hanja':'고유어·외래어','origin':'','definition':'컴퓨터 통신망으로 주고받는 편지.','sentence':'연구자는 설문 참여자에게 이메일을 보내 조사 목적과 개인정보 처리 방침을 알렸습니다.','sentenceScore':0},
    {'term':'법석','hanja':'고유어·외래어','origin':'','definition':'소란스럽게 떠드는 모양.','sentence':'갑작스러운 정전으로 공연장이 한동안 법석이었지만 안내 방송 뒤 질서를 되찾았습니다.','sentenceScore':0},
    {'term':'건조','hanja':'乾燥','origin':'乾燥','definition':'물기나 습기가 말라 없어짐.','sentence':'목재는 충분히 건조하지 않으면 수분이 빠지는 과정에서 뒤틀리거나 갈라질 수 있습니다.','sentenceScore':0},
    {'term':'증류','hanja':'蒸溜','origin':'蒸溜','definition':'끓는점 차이를 이용해 혼합물을 분리함.','sentence':'증류는 혼합물을 가열한 뒤 생긴 증기를 다시 식혀 성분을 분리하는 방법입니다.','sentenceScore':0},
    {'term':'접시','hanja':'고유어·외래어','origin':'','definition':'음식을 담는 납작한 그릇.','sentence':'실험에서는 배지에 미생물을 배양하므로 접시의 뚜껑을 오래 열어 두지 않습니다.','sentenceScore':0},
    {'term':'산악','hanja':'山岳','origin':'山岳','definition':'높고 험한 산들.','sentence':'산악 지역은 고도와 경사에 따라 기온과 식생의 분포가 뚜렷하게 달라집니다.','sentenceScore':0},
    {'term':'단추','hanja':'고유어·외래어','origin':'','definition':'옷을 여미는 작은 물건.','sentence':'출토된 금속 단추의 무늬와 제작 방식은 당시 복식 문화를 추정하는 단서가 됩니다.','sentenceScore':0},
    {'term':'품앗이','hanja':'고유어·외래어','origin':'','definition':'서로 힘을 보태 일을 거드는 관습.','sentence':'농촌의 품앗이는 노동력을 교환하여 바쁜 농사철의 일손 부족을 해결한 공동체 관습입니다.','sentenceScore':0},
    {'term':'바큇살','hanja':'고유어·외래어','origin':'','definition':'바퀴 중심에서 테두리로 뻗은 가는 살.','sentence':'자전거의 바큇살은 하중을 여러 방향으로 나누어 바퀴의 둥근 형태를 유지합니다.','sentenceScore':0},
    {'term':'보름달','hanja':'고유어·외래어','origin':'','definition':'음력 보름 무렵 둥글게 보이는 달.','sentence':'보름달은 달이 지구를 사이에 두고 태양의 반대편에 놓일 때 관측됩니다.','sentenceScore':0},
    {'term':'차림','hanja':'고유어·외래어','origin':'','definition':'옷이나 물건을 갖추어 꾸민 모양.','sentence':'인물의 차림과 소지품은 소설의 시대적 배경과 사회적 지위를 짐작하게 합니다.','sentenceScore':0},
    {'term':'쉼표','hanja':'고유어·외래어','origin':'','definition':'문장 안에서 잠시 끊음을 나타내는 부호.','sentence':'쉼표의 위치가 달라지면 수식 관계나 문장의 의미가 달라질 수 있습니다.','sentenceScore':0},
    {'term':'존댓말','hanja':'尊待말','origin':'尊待','definition':'사람이나 대상을 높여 이르는 말.','sentence':'존댓말은 화자와 청자의 관계뿐 아니라 대화가 이루어지는 공식성도 드러냅니다.','sentenceScore':0},
    {'term':'꼬투리','hanja':'고유어·외래어','origin':'','definition':'잘못이나 흠을 잡아낼 만한 실마리.','sentence':'토론에서는 표현의 작은 꼬투리보다 주장 전체를 뒷받침하는 근거를 먼저 따져야 합니다.','sentenceScore':0},
    {'term':'변두리','hanja':'고유어·외래어','origin':'','definition':'어떤 지역의 가장자리.','sentence':'도시가 팽창하면서 과거의 변두리가 주거와 상업의 새로운 중심지로 바뀌기도 합니다.','sentenceScore':0},
    {'term':'빚쟁이','hanja':'고유어·외래어','origin':'','definition':'빚을 진 사람을 낮잡아 이르는 말.','sentence':'작품 속 인물이 빚쟁이에게 쫓기는 상황은 빈곤과 불평등의 현실을 압축해 보여 줍니다.','sentenceScore':0},
    {'term':'담뱃대','hanja':'고유어·외래어','origin':'','definition':'담배를 피우는 데 쓰던 긴 관.','sentence':'조선 후기 풍속화에 그려진 담뱃대는 당시의 생활상과 신분 문화를 보여 줍니다.','sentenceScore':0},
    {'term':'득실','hanja':'고유어·외래어','origin':'','definition':'많은 것이 한곳에 모여 있는 모양.','sentence':'고인 물에 모기 유충이 득실하면 감염병을 옮기는 모기의 개체 수가 늘 수 있습니다.','sentenceScore':0},
    {'term':'꼼수','hanja':'고유어·외래어','origin':'','definition':'정당하지 않은 잔꾀.','sentence':'규정의 빈틈을 이용한 꼼수는 단기 이익을 줄 수 있어도 제도의 신뢰를 떨어뜨립니다.','sentenceScore':0},
    {'term':'꽃대','hanja':'고유어·외래어','origin':'','definition':'꽃이 달리는 줄기.','sentence':'식물은 꽃대를 높이 뻗어 꽃가루가 바람이나 곤충에 더 쉽게 전달되도록 합니다.','sentenceScore':0},
    {'term':'반딧불이','hanja':'고유어·외래어','origin':'','definition':'배 끝에서 빛을 내는 곤충.','sentence':'반딧불이는 배의 발광 기관에서 일어나는 화학 반응으로 열이 거의 없는 빛을 냅니다.','sentenceScore':0},
    {'term':'배추','hanja':'고유어·외래어','origin':'','definition':'잎이 여러 겹으로 포개지는 채소.','sentence':'배추는 서늘한 기후에서 잘 자라며 김치의 주재료로 널리 재배됩니다.','sentenceScore':0},
    {'term':'칙칙함','hanja':'고유어·외래어','origin':'','definition':'빛깔이나 분위기가 산뜻하지 못한 상태.','sentence':'회색 안료를 지나치게 섞으면 색의 대비가 줄어 화면의 칙칙함이 두드러집니다.','sentenceScore':0},
    {'term':'착각','hanja':'錯覺','origin':'錯覺','definition':'사실과 다르게 느끼거나 생각함.','sentence':'같은 길이의 선도 주변 도형의 방향에 따라 서로 다르게 보이는 착각이 일어납니다.','sentenceScore':0},
    {'term':'흥얼흥얼','hanja':'고유어·외래어','origin':'','definition':'노래를 낮은 목소리로 자꾸 부르는 모양.','sentence':'일정한 가락을 흥얼흥얼 부르면 음의 높낮이와 반복되는 리듬을 쉽게 기억할 수 있습니다.','sentenceScore':0},
    {'term':'찜질','hanja':'고유어·외래어','origin':'','definition':'온기나 냉기로 몸의 한 부분을 덥히거나 식힘.','sentence':'운동 직후 부은 관절에는 온찜질보다 냉찜질이 통증과 부기를 줄이는 데 알맞습니다.','sentenceScore':0},
    {'term':'아이스크림','hanja':'고유어·외래어','origin':'','definition':'우유 등에 당과 향료를 섞어 얼린 식품.','sentence':'아이스크림은 온도가 높아지면 얼음 결정이 녹아 질감과 형태가 빠르게 달라집니다.','sentenceScore':0},
    {'term':'이모티콘','hanja':'고유어·외래어','origin':'','definition':'감정이나 뜻을 나타내는 그림 기호.','sentence':'이모티콘은 문자만으로 전달하기 어려운 감정과 말투를 시각적으로 보충합니다.','sentenceScore':0},
    {'term':'살균','hanja':'殺菌','origin':'殺菌','definition':'세균을 죽여 없앰.','sentence':'자외선 살균은 미생물의 유전 물질을 손상시켜 증식을 억제하는 방식입니다.','sentenceScore':0},
    {'term':'살충','hanja':'殺蟲','origin':'殺蟲','definition':'해로운 벌레를 죽임.','sentence':'살충제를 지나치게 사용하면 해충뿐 아니라 꽃가루를 옮기는 곤충도 줄어들 수 있습니다.','sentenceScore':0},
    {'term':'상쇄','hanja':'相殺','origin':'相殺','definition':'서로 영향을 주어 효과가 없어짐.','sentence':'서로 반대 방향으로 작용하는 두 힘의 크기가 같으면 두 효과가 상쇄됩니다.','sentenceScore':0},
    {'term':'말살','hanja':'抹殺','origin':'抹殺','definition':'존재나 흔적을 완전히 없앰.','sentence':'식민 권력의 언어 말살 정책은 피지배 집단의 정체성과 기억을 약화하려는 수단이었습니다.','sentenceScore':0},
    {'term':'결정','hanja':'決定','origin':'決定','definition':'행동이나 태도를 분명하게 정함.','sentence':'공공 정책의 결정 과정에서는 비용뿐 아니라 사회적 형평성과 장기 효과도 따져야 합니다.','sentenceScore':0},
    {'term':'해결','hanja':'解決','origin':'解決','definition':'문제나 갈등을 풀어 없앰.','sentence':'환경 문제의 해결에는 과학 기술과 제도 개선뿐 아니라 시민의 행동 변화도 필요합니다.','sentenceScore':0},
    {'term':'판결','hanja':'判決','origin':'判決','definition':'법원이 사건에 대하여 내리는 판단.','sentence':'법원의 판결은 법률 조항과 제출된 증거를 바탕으로 사건의 책임을 가립니다.','sentenceScore':0},
    {'term':'결의','hanja':'決議','origin':'決議','definition':'회의에서 의논하여 결정함.','sentence':'국제기구의 결의는 회원국의 공동 입장과 앞으로 취할 행동 원칙을 밝힙니다.','sentenceScore':0},
    {'term':'참여','hanja':'參與','origin':'參與','definition':'어떤 일에 끼어 함께함.','sentence':'시민의 정책 참여가 활발할수록 다양한 이해관계가 의사 결정 과정에 반영될 수 있습니다.','sentenceScore':0},
    {'term':'기여','hanja':'寄與','origin':'寄與','definition':'도움이 되도록 이바지함.','sentence':'백신 보급과 위생 환경의 개선은 감염병 사망률을 낮추는 데 크게 기여했습니다.','sentenceScore':0},
    {'term':'부여','hanja':'附與','origin':'附與','definition':'가치나 자격 등을 붙여 줌.','sentence':'법은 일정한 요건을 갖춘 사람에게 권리를 부여하는 동시에 책임도 요구합니다.','sentenceScore':0},
    {'term':'여부','hanja':'與否','origin':'與否','definition':'그러함과 그러하지 아니함.','sentence':'연구자는 통계 결과가 우연인지 여부를 판단하기 위해 유의 확률을 검토합니다.','sentenceScore':0},
    {'term':'가정','hanja':'假定','origin':'假定','definition':'사실이 아니거나 불분명한 것을 임시로 정함.','sentence':'과학적 추론에서는 특정 조건이 성립한다고 가정한 뒤 예상되는 결과를 검토합니다.','sentenceScore':0},
    {'term':'가상','hanja':'假想','origin':'假想','definition':'실제로 없는 것을 있다고 상상함.','sentence':'가상 실험은 실제로 재현하기 위험하거나 비용이 큰 상황을 모형으로 탐구하게 합니다.','sentenceScore':0},
    {'term':'가설','hanja':'假說','origin':'假說','definition':'현상을 설명하기 위해 세운 잠정적 주장.','sentence':'가설은 관찰과 실험으로 검증할 수 있어야 과학적 설명으로 발전할 수 있습니다.','sentenceScore':0},
    {'term':'가장','hanja':'假裝','origin':'假裝','definition':'태도나 모습 등을 거짓으로 꾸밈.','sentence':'동물의 가장 행동은 천적의 눈을 피하거나 먹이에 접근하는 생존 전략이 되기도 합니다.','sentenceScore':0},
    {'term':'예술','hanja':'藝術','origin':'藝術','definition':'아름다움을 표현하는 인간의 창조 활동.','sentence':'예술은 감각적 형식을 통해 개인의 경험뿐 아니라 시대의 가치와 갈등도 드러냅니다.','sentenceScore':0},
    {'term':'예능','hanja':'藝能','origin':'藝能','definition':'연기와 음악 등 사람을 즐겁게 하는 재주.','sentence':'전통 예능은 노래와 춤, 연기가 결합된 공연을 통해 공동체의 기억을 전승합니다.','sentenceScore':0},
    {'term':'문예','hanja':'文藝','origin':'文藝','definition':'문학과 예술을 아울러 이르는 말.','sentence':'개화기 문예 운동은 새로운 문체와 사상을 소개하며 근대 문학의 형성에 영향을 주었습니다.','sentenceScore':0},
    {'term':'공예','hanja':'工藝','origin':'工藝','definition':'재료를 가공하여 실용적이고 아름다운 물건을 만드는 기술.','sentence':'전통 공예는 재료의 성질을 살린 제작 기술과 지역의 미적 감각을 함께 보여 줍니다.','sentenceScore':0},
    {'term':'악화','hanja':'惡化','origin':'惡化','definition':'상태가 나빠짐.','sentence':'토양 침식이 악화되면 농업 생산성이 낮아지고 하천으로 유입되는 흙도 늘어납니다.','sentenceScore':0},
    {'term':'악성','hanja':'惡性','origin':'惡性','definition':'성질이 나쁘거나 치료가 어려운 상태.','sentence':'악성 종양은 주변 조직을 침범하거나 다른 기관으로 퍼질 수 있어 조기 진단이 중요합니다.','sentenceScore':0},
    {'term':'혐오','hanja':'嫌惡','origin':'嫌惡','definition':'싫어하고 미워함.','sentence':'특정 집단에 대한 혐오 표현은 편견을 강화하고 구성원의 동등한 참여를 막을 수 있습니다.','sentenceScore':0},
    {'term':'최악','hanja':'最惡','origin':'最惡','definition':'가장 나쁨.','sentence':'재난 대응은 최악의 상황까지 가정하여 대피 경로와 통신 수단을 미리 마련해야 합니다.','sentenceScore':0},
]
PREFERRED_TARGETS = {
    '殺': [('살균', '殺菌'), ('살충', '殺蟲'), ('상쇄', '相殺'), ('말살', '抹殺')],
    '惡': [('악화', '惡化'), ('악성', '惡性'), ('혐오', '嫌惡'), ('최악', '最惡')],
    '藝': [('예술', '藝術'), ('예능', '藝能'), ('문예', '文藝'), ('공예', '工藝')],
    '假': [('가정', '假定'), ('가상', '假想'), ('가설', '假說'), ('가장', '假裝')],
    '與': [('참여', '參與'), ('기여', '寄與'), ('부여', '附與'), ('여부', '與否')],
    '決': [('결정', '決定'), ('해결', '解決'), ('판결', '判決'), ('결의', '決議')],
}
MANUAL_DISTRACTOR_TARGETS = {
    '혁혁': {'革'}, '정렬': set(), '참기름': {'參'}, '능히': {'能'}, '설거지': {'去'},
    '이메일': {'以'}, '아이스크림': {'移'}, '이모티콘': {'異'}, '법석': {'法'}, '건조': {'件'},
    '증류': {'證'}, '접시': {'接'}, '산악': {'産', '惡'}, '단추': {'單'}, '품앗이': {'品'},
    '바큇살': {'殺'}, '보름달': {'達'}, '차림': {'次'}, '쉼표': {'標'}, '존댓말': {'存'},
    '꼬투리': {'投'}, '변두리': {'變'}, '빚쟁이': {'爭'}, '담뱃대': {'談'}, '득실': {'得'},
    '꼼수': {'收'}, '꽃대': {'隊'}, '반딧불이': {'盤'}, '배추': {'配'}, '칙칙함': {'則'},
    '착각': {'着'}, '흥얼흥얼': {'興'}, '찜질': {'質'},
}


def norm(value):
    return unicodedata.normalize('NFKC', value or '').replace(' ', '').replace('^', '')


def feat_value(element, att):
    for feat in element.findall('feat'):
        if feat.get('att') == att:
            return feat.get('val', '')
    return ''


def nested_feat_value(element, path, att):
    child = element.find(path)
    return feat_value(child, att) if child is not None else ''


def clean_hun(value):
    return re.sub(r'\[.*?\]|\(.*?\)', '', value).strip()


def initial_variants(sound):
    variants = {sound}
    swaps = {
        '녀':'여','뇨':'요','뉴':'유','니':'이','랭':'냉',
        '라':'나','래':'내','로':'노','뢰':'뇌','루':'누',
        '락':'낙','란':'난','람':'남','랑':'낭','략':'약','량':'양','려':'여','력':'역','련':'연','렬':'열','령':'영','례':'예','료':'요','류':'유','륙':'육','률':'율','리':'이',
    }
    if sound in swaps:
        variants.add(swaps[sound])
    return variants


def sentence_score(sentence):
    score = abs(len(sentence) - 48)
    if not re.search(r'[다요]\.$', sentence): score += 100
    if re.search(r'[?？!！]', sentence): score += 100
    if re.search(r'[“”\"\']', sentence): score += 35
    if re.search(r'민준|지수|승규|유민|김 과장|김 기자|김 대리|그녀는|나는 |우리 가족|남편|아내|어머니께서|아버지께서', sentence): score += 60
    if len(sentence) < 24: score += 80
    if len(sentence) > 95: score += 45
    return score


def best_sentence(sentences):
    clean = sorted({re.sub(r'\s{2,}', ' ', value).strip() for value in sentences})
    usable = [
        value for value in clean
        if 24 <= len(value) <= 110
        and re.search(r'[다요]\.$', value)
        and not re.search(r'[?？!！]', value)
        and not BAD_SENTENCE.search(value)
    ]
    return min(usable, key=lambda value: (sentence_score(value), value), default='')


def load_metadata():
    current = set()
    for number in range(1, 6):
        lessons = json.loads((SCRIPT_DIR / f'hanja-v2-lessons-{number:02d}.json').read_text(encoding='utf-8'))
        current.update(norm(character['character']) for lesson in lessons for character in lesson['characters'])
    ranking = json.loads((SCRIPT_DIR / 'hanja-csat-expansion-ranking.json').read_text(encoding='utf-8'))['all']
    selected = [item for item in ranking if item['thirdFrequency'] >= 0.00002]
    metadata = {item['character']: {
        'character': item['character'],
        'level': item['level'],
        'mainSound': item['mainSound'],
        'forms': item['forms'],
        'strokes': item['strokes'],
        'importance': {
            'thirdFrequency': item['thirdFrequency'],
            'productiveFrequency': item['productiveFrequency'],
            'topTerms': item['topTerms'][:8],
        },
    } for item in selected}
    targets = [item['character'] for item in selected]
    if current & set(targets):
        raise RuntimeError('Selected expansion includes an existing character')
    return current, metadata, targets, targets
def extract_entries(targets, metadata):
    readings_by_character = {}
    all_readings = set()
    for character in targets:
        readings = set()
        for form in metadata[character]['forms']:
            readings.update(initial_variants(form['eum']))
        readings_by_character[character] = readings
        all_readings.update(readings)

    entries = []
    for xml_path in sorted(KRDICT_DIR.glob('*.xml')):
        clean_xml = INVALID_XML.sub(b'', xml_path.read_bytes())
        for _event, entry in ET.iterparse(io.BytesIO(clean_xml), events=('end',)):
            if entry.tag != 'LexicalEntry':
                continue
            term = nested_feat_value(entry, 'Lemma', 'writtenForm').strip()
            if not HANGUL.fullmatch(term):
                entry.clear(); continue
            origin = norm(feat_value(entry, 'origin'))
            relevant_term = any(reading in term for reading in all_readings)
            relevant_origin = bool(origin and any(character in origin for character in targets))
            if not relevant_term and not relevant_origin:
                entry.clear(); continue
            if origin and not CJK.fullmatch(origin):
                origin = ''
            definitions, sentences = [], []
            for sense in entry.findall('Sense'):
                definition = feat_value(sense, 'definition')
                if definition:
                    definitions.append(definition)
                for example in sense.findall('SenseExample'):
                    for feat in example.findall('feat'):
                        if feat.get('att') == 'example':
                            sentence = feat.get('val', '').strip()
                            if term in sentence:
                                sentences.append(sentence)
            chosen = best_sentence(sentences)
            if chosen:
                entries.append({
                    'term': term,
                    'hanja': origin or '고유어·외래어',
                    'origin': origin,
                    'definition': definitions[0] if definitions else '',
                    'sentence': chosen,
                    'sentenceScore': sentence_score(chosen),
                })
            entry.clear()
    return entries, readings_by_character


def entry_rank(item, character, readings, target=True):
    term, origin = item['term'], item['origin']
    aligned = False
    if target and origin and len(term) == len(origin):
        aligned = any(origin[index] == character and term[index] in readings for index in range(len(origin)))
    return (
        0 if item.get('manual') else 1,
        0 if aligned else 1,
        0 if len(term) in (2, 3) else 1,
        item['sentenceScore'],
        len(term),
        term,
    )


def choose_candidates(targets, metadata, entries, readings_by_character):
    result = []
    for character in targets:
        readings = readings_by_character[character]
        target_pool = [item for item in entries if item['origin'] and character in item['origin'] and any(sound in item['term'] for sound in readings)]
        preferred = PREFERRED_TARGETS.get(character, [])
        ranked_terms = preferred + [
            (word['term'], norm(word['hanja']))
            for word in metadata[character].get('importance', {}).get('topTerms', [])
            if (word['term'], norm(word['hanja'])) not in preferred
        ]
        priority = {key: index for index, key in enumerate(ranked_terms)}
        target_pool.sort(key=lambda item: (priority.get((item['term'], item['origin']), 99), entry_rank(item, character, readings, True)))
        chosen_targets, seen = [], set()
        for item in target_pool:
            if item['term'] in seen:
                continue
            chosen_targets.append(item)
            seen.add(item['term'])
            if len(chosen_targets) == 4:
                break
        distractor_pool = [item for item in entries if character not in item['origin'] and any(sound in item['term'] for sound in readings) and item['term'] not in seen and (not item.get('manual') or character in item.get('forTargets', set()))]
        distractor_pool.sort(key=lambda item: entry_rank(item, character, readings, False))
        chosen_distractors, distractor_seen = [], set()
        for item in distractor_pool:
            if item['term'] in distractor_seen:
                continue
            chosen_distractors.append(item)
            distractor_seen.add(item['term'])
            if len(chosen_distractors) == 8:
                break
        result.append({**metadata[character], 'readings': sorted(readings), 'targets': chosen_targets, 'distractors': chosen_distractors})
    return result


def make_groups(items):
    groups, pending = [], []
    runs, index = [], 0
    while index < len(items):
        sound = items[index]['mainSound']
        end = index + 1
        while end < len(items) and items[end]['mainSound'] == sound:
            end += 1
        runs.append(items[index:end])
        index = end
    for run in runs:
        while len(run) >= 2:
            take = 2 if len(run) == 4 else min(3, len(run))
            groups.append(run[:take]); del run[:take]
        pending.extend(run)
    while len(pending) >= 3:
        groups.append(pending[:3]); del pending[:3]
    if len(pending) == 2:
        groups.append(pending)
    elif len(pending) == 1:
        if len(groups[-1]) == 2:
            groups[-1].append(pending[0])
        else:
            moved = groups[-1].pop()
            groups.append([moved, pending[0]])
    if any(len(group) not in (2, 3) for group in groups):
        raise RuntimeError('Invalid group size')
    return groups


def build_lessons(candidates):
    groups = make_groups([dict(item) for item in candidates])
    lessons = []
    for group in groups:
        characters, questions = [], []
        for item in group:
            if len(item['targets']) < 3 or not item['distractors']:
                raise RuntimeError(f"{item['character']}: insufficient targets={len(item['targets'])}, distractors={len(item['distractors'])}")
            targets = item['targets'][:4]
            meanings = '·'.join(dict.fromkeys(form['hun'] for form in item['forms']))
            readings = '·'.join(dict.fromkeys(item['readings']))
            word_list = '·'.join(f"{target['term']}({target['hanja']})" for target in targets)
            character = {
                'character': item['character'],
                'reading': readings,
                'meaning': meanings,
                'hunEum': item['forms'],
                'explanation': f"핵심 뜻은 ‘{meanings}’입니다. {word_list}에서 이 글자가 맡는 뜻과 쓰임을 예문으로 익힙니다.",
                'examples': [[target['term'], target['hanja'], target['sentence']] for target in targets],
            }
            characters.append(character)
            distractor = item['distractors'][0]
            options = [[term, hanja, sentence.replace(term, f'{{{{{term}}}}}')] for term, hanja, sentence in character['examples'][:3]]
            options.append([distractor['term'], distractor['hanja'], distractor['sentence'].replace(distractor['term'], f"{{{{{distractor['term']}}}}}")])
            questions.append({
                'target': item['character'],
                'answer': 3,
                'note': f"{'·'.join(f'{term}({hanja})' for term, hanja, _ in character['examples'])}에는 {item['character']} 글자가 쓰입니다. {distractor['term']}({distractor['hanja']})에는 쓰이지 않습니다.",
                'options': options,
            })
        lessons.append({
            'term': ''.join(character['character'] for character in characters),
            'reading': ' · '.join(character['reading'] for character in characters),
            'theme': ' · '.join(character['meaning'] for character in characters),
            'characters': characters,
            'questions': questions,
        })
    return lessons


def main():
    current, metadata, targets, standard = load_metadata()
    entries, readings = extract_entries(targets, metadata)
    entries.extend({**entry, 'manual': True, 'forTargets': sorted(MANUAL_DISTRACTOR_TARGETS.get(entry['term'], set()))} for entry in MANUAL_ENTRIES)
    overrides = json.loads(OVERRIDE_OUT.read_text(encoding='utf-8'))
    for entry in entries:
        override = overrides.get(f"{entry['term']}|{norm(entry['hanja'])}")
        if override:
            entry['sentence'] = override
            entry['sentenceScore'] = 0
    candidates = choose_candidates(targets, metadata, entries, readings)
    shortages = [{'character': item['character'], 'targets': len(item['targets']), 'distractors': len(item['distractors'])} for item in candidates if len(item['targets']) < 3 or not item['distractors']]
    CANDIDATE_OUT.write_text(json.dumps({'characters': candidates, 'shortages': shortages}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    if shortages:
        print(json.dumps({'entries': len(entries), 'targets': len(targets), 'shortages': shortages}, ensure_ascii=False, indent=2))
        raise SystemExit(1)
    lessons = build_lessons(candidates)
    LESSON_OUT.write_text(json.dumps(lessons, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    final_characters = list(current) + targets
    STANDARD_OUT.write_text(json.dumps({
        'source': '한국어 학술 어휘 빈도와 파생 어휘 생산성에 따른 수능 대비 확장',
        'selectionRule': '동음이의어를 사전 뜻·예문 비중으로 보정한 뒤 세 번째 핵심 어휘 빈도 0.00002 이상',
        'sourceUrl': 'https://www.hanja.re.kr/kccpt/exam/levelConfirm.do',
        'uniqueCharacterCount': len(set(final_characters)),
        'characters': ''.join(targets),
    }, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'dictionaryEntries': len(entries), 'additions': len(targets), 'lessons': len(lessons), 'questions': sum(len(lesson['questions']) for lesson in lessons), 'finalUnique': len(set(final_characters))}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()