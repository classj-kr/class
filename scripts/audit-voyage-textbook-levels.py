"""Compare the live voyage discovery filters against locally held textbooks.

This is a read-only audit of application catalogs. Matches are evidence for review,
not an automatic decision that every textbook label needs a new discovery.
"""
import gzip
import html
import json
import re
import subprocess
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
BOOK_BASE = ROOT / 'references/textbooks'
WORK = ROOT / 'tmp/voyage-textbook-audit'
OUT = ROOT / 'output/voyage-textbook-audit'
WORK.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)

ALIASES = {
    'giza-pyramids': ['기자 피라미드', '기자의 피라미드', '이집트의 피라미드', '이집트 피라미드', '스핑크스'],
    'great-wall-badaling': ['만리장성'],
    'lm-hagia-sophia': ['아야 소피아', '성 소피아 성당', '성 소피아 대성당', '소피아 성당', '하기아 소피아'],
    'lm-guilin-karst': ['구이린', '계림'],
    'mogao-caves': ['막고굴', '둔황 석굴', '모가오굴'],
    'longmen-grottoes': ['룽먼 석굴', '용문 석굴'],
    'yungang-grottoes': ['윈강 석굴', '운강 석굴'],
    'taj-mahal-later': ['타지마할', '타지 마할'],
    'lm-potala-later': ['포탈라궁'],
    'lm-saint-basil-later': ['성 바실리 대성당', '성 바실리 성당'],
    'lm-blue-mosque-later': ['블루 모스크', '술탄 아흐메트 모스크'],
    'lm-versailles-later': ['베르사유 궁전'],
    'bulguksa-seokguram': ['불국사', '석굴암'],
    'haeinsa-tripitaka': ['해인사 장경판전', '장경판전'],
    'lm-kaaba': ['카바 신전', '카바 성전', '카바 성소'],
    'lm-parthenon': ['파르테논'],
    'lm-notre-dame': ['노트르담'],
    'lm-florence-duomo': ['피렌체 대성당', '산타 마리아 델 피오레'],
    'lm-pisa-tower': ['피사의 사탑', '피사 사탑'],
    'lm-prague-castle': ['프라하성', '카를교'],
    'lm-moscow-kremlin': ['크렘린'],
    'lm-samarkand-madrasa': ['울루그베그', '비비하눔'],
    'lm-djenne-mosque': ['젠네'],
    'lm-great-zimbabwe': ['그레이트 짐바브웨', '짐바브웨 유적'],
    'lm-coricancha': ['코리칸차'],
    'lm-nazca-lines': ['나스카 지상', '나스카 그림'],
    'lm-rome-st-peters': ['성 베드로 성당', '성 베드로 대성당'],
    'lm-rome-forum': ['포로 로마노', '로마 포룸'],
    'lm-jerusalem-western-wall': ['통곡의 벽'],
    'lm-kiyomizudera': ['기요미즈데라', '청수사'],
    'prayag-confluence': ['갠지스강'],
    'amazon-rainforest': ['아마존 열대 우림', '아마존 우림'],
    'congo-river-mouth': ['콩고강 하구'],
    'sognefjord': ['송네 피오르', '송네피오르'],
    'great-plains-bison': ['그레이트플레인스', '대평원 들소'],
    'baekdu-mountain': ['백두산', '천지'],
    'yellow-river': ['황허', '황하', '황허강', '황하강'],
    'sanchi-stupa': ['산치 대탑', '산치 불탑', '산치 스투파'],
    'mahabodhi-bodhgaya': ['마하보디', '보드가야'],
    'borobudur': ['보로부두르', '보로부드르', '보로부두르 사원'],
    'chichen-itza': ['치첸이트사', '치첸이차'],
    'teotihuacan': ['테오티우아칸', '테오티와칸'],
    'easter-island-moai': ['모아이', '이스터섬'],
    'palawan-underground-river': ['팔라완 지하강', '푸에르토 프린세사'],
    'great-barrier-reef': ['그레이트배리어리프', '대보초'],
    'cape_good_hope': ['희망봉'],
}

# These are candidates to check, not a list of required textbook place names.
NEW_CANDIDATES = {
    '나일강': ['나일강'], '티그리스강': ['티그리스강'], '유프라테스강': ['유프라테스강'],
    '메소포타미아 평원': ['메소포타미아'], '우르의 지구라트': ['지구라트'],
    '모헨조다로': ['모헨조다로'], '하라파': ['하라파'], '아잔타 석굴': ['아잔타 석굴'],
    '호류사': ['호류사', '호류지', '법륭사'], '도다이사': ['도다이사', '도다이지', '동대사'],
    '창장강': ['창장강', '양쯔강'], '그린란드': ['그린란드'], '사하라 이남 사바나': ['세렝게티', '마사이마라'],
    '폼페이': ['폼페이'], '베수비오산': ['베수비오'], '폼페이 원형극장': ['폼페이 원형'],
    '산타 소피아 성당': ['산타 소피아'], '에펠탑': ['에펠탑'], '자유의 여신상': ['자유의 여신상'],
    '시드니 오페라 하우스': ['오페라 하우스', '오페라하우스'], '빅벤': ['빅벤'],
    '브란덴부르크문': ['브란덴부르크문'], '아우슈비츠': ['아우슈비츠'], '베를린 장벽': ['베를린 장벽'],
    '크리스투 헤덴토르': ['예수상', '거대 예수'], '부르즈 할리파': ['부르즈 할리파'],
    '아스완 하이댐': ['아스완'], '수에즈 운하': ['수에즈 운하'], '파나마 운하': ['파나마 운하'],
    '파르테논 신전': ['파르테논'], '불국사': ['불국사'], '수원 화성': ['수원 화성'],
    '세렝게티': ['세렝게티'], '로키산맥': ['로키산맥'], '킬리만자로산': ['킬리만자로'],
    '브라이스캐니언': ['브라이스캐니언', '브라이스 캐니언'], '엔젤 폭포': ['앙헬 폭포', '엔젤 폭포'],
    '와이토모 동굴': ['와이토모'], '파묵칼레': ['파묵칼레'], '파타고니아 빙하': ['페리토모레노'],
    '우유니 소금사막': ['우유니'], '울루루': ['울루루'], '히말라야산맥': ['히말라야'],
    '파르세나트 자이나 사원': ['자이나교 사원', '자이나 사원'],
    '타이산': ['타이산', '태산'], '황산': ['황산'],
    '사헬 지대': ['사헬 지대', '사헬 지역', '사헬 지방', '사헬'],
    '바덴해 갯벌': ['바덴해', '와덴해'],
    '포트캠벨 국립공원': ['포트캠벨', '그레이트 오션 로드', '그레이트오션로드'],
    '코파카바나 해변': ['코파카바나'], '와이키키 해변': ['와이키키'],
    '에트르타 해안': ['에트르타'], '마이애미 해변': ['마이애미 해변'],
    '그리니치 천문대': ['그리니치 천문대', '그리니치 왕립 천문대'],
}


def norm(text):
    return re.sub(r'\s+', '', text)


def load_runtime():
    code = "const C=require('./learning/inquiry/age-of-exploration/lib/mission-catalog');const P=require('./learning/inquiry/age-of-exploration/public/js/study-catalog');const catalog=C.publicCatalog();console.log(JSON.stringify({catalog,choices:P.choices(catalog)}))"
    result = subprocess.run(['node', '-e', code], cwd=ROOT, capture_output=True, check=True, encoding='utf8')
    return json.loads(result.stdout)


def load_pages():
    library = json.loads((BOOK_BASE/'세계사-세계지리/수집현황.json').read_text(encoding='utf8'))
    pages = []
    for book in library['books']:
        if book['level'] not in ['초6', '초5~6', '중학']:
            continue
        for file in book['files']:
            path = BOOK_BASE/file['path']
            cache = WORK/(file['sha256']+'.json.gz')
            if cache.exists():
                with gzip.open(cache,'rt',encoding='utf8') as stream:
                    texts = json.load(stream)
            else:
                with pymupdf.open(path) as doc:
                    texts = [page.get_text() for page in doc]
                with gzip.open(cache,'wt',encoding='utf8') as stream:
                    json.dump(texts, stream, ensure_ascii=False)
            for i,text in enumerate(texts):
                reference=bool(re.search(r'인용및참고자료|참고문헌및출처|사진출처|자료출처|찾아보기',norm(text[:200])))
                pages.append({'book':book['title'], 'publisher':book['publisher'],
                              'level':'elementary' if book['level'].startswith('초') else 'middle',
                              'revision':book['revision'], 'atlas':book['theme']=='지도·부도',
                              'referencePage':reference,
                              'path':str(path.resolve()),'pdfPage':i+1,'text':text,'normalized':norm(text)})
        print(f'Indexed {book["level"]} {book["publisher"]} {book["title"]}',flush=True)
    return pages


def variants(place):
    name = re.sub(r'\([^)]*\)', '', place['name']).replace('이 설 자리','').replace('가 설 자리','')
    return list(dict.fromkeys([name, *ALIASES.get(place['id'], [])]))


def find_hits(terms, pages):
    search = []
    for term in terms:
        compact=norm(term)
        if len(compact)<2:
            continue
        pattern=r'\s*'.join(re.escape(char) for char in compact)
        if len(compact)<=3:
            # Do not mistake 조사해 for 사해, 코파카바나 for 카바, or 온라인강의
            # for 라인강. Permit normal Korean topic/object/location particles.
            pattern=r'(?<![가-힣A-Za-z])'+pattern+r'(?=$|[\s\d\W]|[은는이가을를의와과로에])'
        search.append((term,compact,re.compile(pattern)))
    hits = []
    for page in pages:
        found = next(((t,regex.search(page['text'])) for t,n,regex in search
                      if n in page['normalized'] and regex.search(page['text'])), None)
        if not found:
            continue
        matched,match=found
        # A snippet with whitespace flattened for human review; PDF page is authoritative.
        start = match.start()
        snippet = re.sub(r'\s+',' ',page['text'][max(0,start-80):start+len(matched)+200])
        hits.append({k:v for k,v in page.items() if k not in ['text','normalized']}
                    | {'matched':matched,'snippet':snippet})
    # Prefer current body evidence over atlases and legacy editions; retain up to
    # three pages for each school/curriculum/body combination and publisher.
    hits.sort(key=lambda h:(h['atlas'], h['revision']!='2022',h['publisher'],h['pdfPage']))
    kept,groups=[],{}
    for hit in hits:
        key=(hit['level'],hit['revision'],hit['atlas'],hit['publisher'],hit['book'],hit['path'])
        if groups.get(key,0)<3:
            kept.append(hit);groups[key]=groups.get(key,0)+1
    return kept


def main():
    runtime=load_runtime();pages=load_pages()
    all_places=runtime['catalog']['discoveries']+runtime['catalog']['cityLandmarks']
    findings=[]
    for place in all_places:
        if place['learning']['alias']:
            continue
        hits=find_hits(variants(place),pages)
        level_misses=sorted({h['level'] for h in hits if h['revision']=='2022' and not h['atlas'] and not h['referencePage']
                            and h['level'] not in place['learning']['levels']})
        hidden=not place['learning']['recommended'] and any(h['revision']=='2022' and not h['atlas'] and not h['referencePage'] for h in hits)
        findings.append({'id':place['id'],'name':place['name'],'learning':place['learning'],
                         'missingLevels':level_misses,'hiddenFromDefault':hidden,'hits':hits})
    new=[]
    candidates={name:list(terms) for name,terms in NEW_CANDIDATES.items()}
    geography=json.loads((ROOT/'learning/inquiry/globe/data/info.json').read_text(encoding='utf8'))
    for key in geography:
        kind,name=key.split(':',1)
        if kind not in ['country','city'] and len(norm(name))>=3:
            candidates.setdefault(name,[name])
    for name,terms in candidates.items():
        hits=find_hits(terms,pages)
        if hits:
            def name_matches(term,place_name):
                left,right=norm(term),norm(place_name)
                return left==right or (min(len(left),len(right))>=3 and (left in right or right in left))
            matches=[p['id'] for p in all_places if any(name_matches(term,p['name']) for term in terms)]
            text_matches=[p['id'] for p in all_places if any(norm(term) in norm(p.get('text','')) for term in terms)]
            city_matches=[p['name'] for p in runtime['catalog']['places'] if p.get('isOriginalCity') and any(norm(term) in norm(p['name']) for term in terms)]
            new.append({'name':name,'hits':hits,'matchingDiscoveryIds':matches,
                        'coveredInDiscoveryText':text_matches,'matchingCities':city_matches})
    report={'checkedAt':'2026-11-02','scope':'Local 2022 elementary grade 6 social studies and middle social/history bodies; 2015 and atlases separately marked',
            'checkedPlaces':len(all_places),'uniquePlaces':len(findings),'textbookPages':len(pages),
            'mechanism':'levels inherited from topic; default recommendation filter also applies',
            'findings':findings,'newCandidates':new,
            'limits':['Text matches need semantic/visual review; map labels and bibliographies do not establish a required lesson.',
                      'Missing publisher bodies prevent an exhaustive textbook claim.','App catalog was not edited.']}
    (OUT/'자동대조후보.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
    print(json.dumps({'places':len(all_places),'unique':len(findings),'pages':len(pages),
                      'levelMisses':sum(bool(x['missingLevels']) for x in findings),
                      'defaultHiddenMatches':sum(x['hiddenFromDefault'] for x in findings)},ensure_ascii=False))


if __name__=='__main__':
    main()
