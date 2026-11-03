"""Build a local, searchable reading index from verified textbook bodies.

Original publisher files are never modified. One-page samples and teacher material
are excluded. PDF page links use file page numbers rather than printed folios.
"""
import hashlib
import html
import json
import re
from pathlib import Path
from urllib.parse import quote

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'references/textbooks'
OUT = BASE / '세계사-세계지리'
OUT.mkdir(exist_ok=True)
TOPICS = {
    '세계지리': ['위도', '경도', '기후', '열대 우림', '사바나', '몬순', '사막',
               '지중해성', '빙하', '아시아', '유럽', '아프리카', '아메리카',
               '오세아니아', '인구', '도시화', '이주', '종교', '자원', '무역'],
    '세계사': ['메소포타미아', '이집트', '그리스', '로마', '중국', '인도',
             '불교', '이슬람', '크리스트교', '몽골', '신항로', '르네상스',
             '종교 개혁', '프랑스 혁명', '산업 혁명', '제국주의',
             '제1차 세계 대전', '제2차 세계 대전', '냉전', '탈식민'],
}
BOOKS = []
EXCLUDED = []
CACHE_PATH = OUT / 'PDF색인캐시.json'
CACHE = json.loads(CACHE_PATH.read_text(encoding='utf8')) if CACHE_PATH.exists() else {}


def natural(path):
    text = path.name
    roman = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ']
    for i, token in enumerate(roman, 1):
        text = text.replace(token, f'{i:02}')
    return [int(x) if x.isdigit() else x for x in re.split(r'(\d+)', text)]


def inspect(path, theme):
    rel = path.relative_to(BASE).as_posix()
    stat = path.stat()
    cached = CACHE.get(rel)
    if cached and cached['bytes'] == stat.st_size and cached['mtimeNs'] == stat.st_mtime_ns:
        return cached
    with pymupdf.open(path) as doc:
        first_text = re.sub(r'\s+', '', doc[0].get_text()) if len(doc) else ''
        if not len(doc) or (len(doc) <= 2 and re.search(r'PDF샘플|PDFsample|서비스준비중|오픈예정', first_text, re.I)):
            EXCLUDED.append({'path': rel, 'pages': len(doc), 'reason': 'explicit sample/placeholder'})
            return None
        terms = list(dict.fromkeys(TOPICS['세계지리'] + TOPICS['세계사']))
        hits = {term: [] for term in terms}
        for i, page in enumerate(doc):
            # Full books: skip preliminary pages when constructing term shortcuts.
            if len(doc) > 100 and i < 10:
                continue
            text = re.sub(r'\s+', '', page.get_text())
            for term in terms:
                if len(hits[term]) < 3 and re.sub(r'\s+', '', term) in text:
                    hits[term].append(i + 1)
        row = {'path': rel, 'bytes': stat.st_size, 'mtimeNs': stat.st_mtime_ns,
               'pages': len(doc), 'topics': {k: v for k, v in hits.items() if v},
               'toc': doc.get_toc()[:100]}
    CACHE[rel] = row
    CACHE_PATH.write_text(json.dumps(CACHE, ensure_ascii=False), encoding='utf8')
    return row


def add(publisher, level, title, revision, theme, folder, pattern='*.pdf',
        exclude=None, expected=None, full=False, source=''):
    candidates = sorted((BASE / folder).rglob(pattern), key=natural)
    files, seen = [], set()
    for path in candidates:
        if exclude and re.search(exclude, path.name):
            continue
        row = inspect(path, theme)
        if not row:
            continue
        with path.open('rb') as stream:
            digest = hashlib.file_digest(stream, 'sha256').hexdigest()
        if digest in seen:
            continue
        seen.add(digest)
        files.append({**row, 'sha256': digest, 'name': path.name})
    if full and files:
        # Prefer the largest page count among duplicate full-book variants.
        files = [max(files, key=lambda f: (f['pages'], f['bytes']))]
    if not files:
        return
    status = '본문 보유'
    if expected:
        status = f'{len(files)}/{expected}개 단원 본문' if not full else '전체 본문 파일'
    elif full:
        status = '전체 본문 파일'
    BOOKS.append({'publisher': publisher, 'level': level, 'title': title,
                  'revision': revision, 'theme': theme, 'status': status,
                  'expectedChapters': expected, 'sourceUrl': source, 'files': files})
    print(f'{level} {publisher} {title}: {len(files)} PDF / {sum(f["pages"] for f in files)}p', flush=True)


def build_inventory():
    elementary = json.loads((BASE / '초등/교과서목록.json').read_text(encoding='utf8'))
    for row in elementary:
        if not row.get('files'):
            continue
        if row['subject'] == '사회' and re.search(r'6[ -][12]|_6-[12]', row['title']):
            folder = Path(row['files'][0]['path']).parent.relative_to(BASE).as_posix()
            add(row['publisher'], '초6', row['title'], '2022', '세계지리', folder,
                exclude=r'활동|부록|특별', expected=3 if row['publisher']=='천재' and '김정인' in row['title'] else None,
                full=not(row['publisher']=='천재' and '김정인' in row['title']), source=row.get('sourceUrl', ''))
        elif row['subject'] == '사회과부도':
            folder = Path(row['files'][0]['path']).parent.relative_to(BASE).as_posix()
            add(row['publisher'], '초5~6', row['title'], '2022', '지도·부도', folder,
                exclude=r'활동|부록|5학년', source=row.get('sourceUrl', ''))

    for number, glyph in [(1, '①'), (2, '②')]:
        add('동아', '중학', f'사회 {glyph} (설규주)', '2022', '세계지리',
            f'중고등/두클래스/중등/사회/사회 {glyph} (설규주)_2022/교과서', expected=12,
            source=f'https://mh.douclass.com/textbooks/danwon/0_{528+number}')
        add('천재교과서', '중학', f'사회 {glyph} (허수미)', '2022', '세계지리',
            f'중고등/T셀파/중학/사회/사회{glyph}(허수미)', f'사회{number}_*단원_교과서__*.pdf', expected=12)
        add('미래엔', '중학', f'사회 {glyph} (손영찬)', '2022', '세계지리',
            '중고등/미래엔/중학/사회/사회1_2_손영찬_2022_교과서', f'미래엔_사회{number}_교과서_2022.pdf', full=True)
        add('동아', '중학', f'사회 {number} (김영순)', '2015', '세계지리',
            f'중고등/두클래스/중등/사회/사회 {number} (김영순)_2015/교과서', expected=12)
        add('미래엔', '중학', f'사회 {number} (김진수)', '2015', '세계지리',
            f'중고등/미래엔/중학/사회/사회{number} (김진수)_2015', '*교과서PDF*.pdf', expected=12,
            exclude=r'교사용|지도서')

    add('동아', '중학', '사회과 부도 (조동연)', '2022', '지도·부도',
        '중고등/두클래스/중등/사회/사회과 부도 (조동연)_2022/교과서', '교과서_주제도*.pdf', expected=12)
    add('미래엔', '중학', '사회과부도 (조성호)', '2022', '지도·부도',
        '중고등/미래엔/중학/사회/사회과부도_조성호_2022', full=True)
    add('미래엔', '중학', '사회과부도 (문대영)', '2015', '지도·부도',
        '중고등/미래엔/중학/사회/사회과부도 (문대영)_2015', '*교과서*.pdf', exclude=r'교사용|지도서')

    add('동아', '중학', '역사 ① (홍성구)', '2022', '세계사',
        '중고등/두클래스/중등/사회/역사 ① (홍성구)_2022/교과서', expected=7,
        source='https://mh.douclass.com/textbooks/danwon/0_532')
    add('천재교과서', '중학', '역사 ① (이종관)', '2022', '세계사',
        '중고등/T셀파/중학/사회/역사①(이종관)', '*_교과서 PDF__*.pdf', expected=7)
    add('미래엔', '중학', '역사 ① (이종대)', '2022', '세계사',
        '중고등/미래엔/중학/사회/역사1_이종대_2022_교과서평가', '미래엔_역사1_교과서_2022.pdf', full=True)
    add('미래엔', '중학', '역사 1 (김태웅)', '2015', '세계사',
        '중고등/미래엔/중학/사회/역사1 (김태웅)_2015', '역사1_교과서PDF*.pdf', expected=6)
    add('동아', '중학', '역사 부도 (서인원)', '2022', '지도·부도',
        '중고등/두클래스/중등/사회/역사 부도 (서인원)_2022/교과서', exclude=r'부록')
    add('미래엔', '중학', '역사부도 (이종대)', '2022', '지도·부도',
        '중고등/미래엔/중학/사회/역사부도_이종대_2022', '*교과서*.pdf', full=True)

    for title, pattern in [('세계사(김덕수)', '교과서__*.pdf'),
                           ('세계시민과지리(김민성)', '고등 세계시민과 지리 본문*.pdf')]:
        add('천재교과서', '고등', title, '2022', '세계사' if '세계사(' in title else '세계지리',
            f'중고등/T셀파/고등/사회/{title}', pattern, full=True)
    for title in ['세계사 (남궁원)_2022', '세계시민과 지리 (조성호)_2022',
                  '역사 부도 (강승호)_2022', '지리 부도 (조성호)_2022']:
        add('미래엔', '고등', title.replace('_2022',''), '2022',
            '지도·부도' if '부도' in title else '세계사' if title.startswith('세계사 ') else '세계지리',
            f'중고등/미래엔/고등/사회/{title}/교과서', exclude=r'통계', full=True)
    for title, chapters in [('세계지리 (박철웅)_2015',8), ('세계사 (최준채)_2015',6)]:
        add('미래엔', '고등', title.replace('_2015',''), '2015',
            '세계지리' if title.startswith('세계지리') else '세계사',
            f'중고등/미래엔/고등/사회/{title}', '*교과서*.pdf', exclude=r'교사용|지도서', expected=chapters)


GAPS = [
    ('초6 사회', '비상 설규주 6-1·6-2', '공식 공개 뷰어 확보. 본문 PDF 다운로드 미확인', 'https://text.vivasam.com/detail/85'),
    ('초6 사회', '지학사 이간용 6-1·6-2', '공식 미리보기의 원본 다운로드 제한 확인. 본문 미수집', 'https://textbook.jihak.co.kr/book-pr-sahui56.php'),
    ('초6 사회', 'YBM 남상준 6-1·6-2', '공개 교과서 목록 확인. 뷰어 요청은 302 순환 오류. 본문 미수집', 'https://www.ybmcloud.com/prcenter/ybmtextbook/textbookId?grade=ele14'),
    ('초5~6 부도', '천재 박기범 사회과 부도', '기존 교과서 목록에 미수집 상태로 남음', 'https://ele.tsherpa.co.kr/'),
    ('중학 사회', '비상 강창숙 ①·②', '공식 공개 뷰어 확보. 본문 PDF 다운로드 미확인', 'https://text.vivasam.com/detail/113'),
    ('중학 사회', '지학사 은지용 ①·②', '공식 소개·전자책 링크 확보. 원본 PDF 미수집', 'https://textbook.jihak.co.kr/book-mi-soc.php'),
    ('중학 역사', '비상 이병인 ①', '공식 공개 뷰어 안내 확보. 본문 PDF 미수집', 'https://text.vivasam.com/detail/115'),
    ('중학 역사', '해냄에듀 이성호 ①', '공식 미리보기는 20쪽, 저장 불가 안내. 전체 본문 미수집', 'https://www.hnedu.co.kr/textbook/view.php?prdcode=2405200003'),
    ('중학 역사', '지학사 노경덕 ①', '공식 소개·미리보기 확보. 원본 다운로드 제한으로 본문 미수집', 'https://textbook.jihak.co.kr/book-mi-his.php'),
    ('중학 역사', '리베르스쿨 ①', '공식 사이트의 사람 확인 보안 절차로 접근 중단. 본문 미수집', 'https://textbook.liber.site/'),
]


def write_output():
    report = {'checkedAt': '2026-11-02', 'scope': '초6 사회·중학 사회/역사①, 보유 고등 세계사·세계지리 관련 교과서',
              'newDownloads': 3, 'books': BOOKS, 'excludedSamples': EXCLUDED,
              'pending': [dict(zip(['scope','title','reason','sourceUrl'], x)) for x in GAPS]}
    (OUT/'수집현황.json').write_text(json.dumps(report, ensure_ascii=False, indent=2),encoding='utf8')
    CACHE_PATH.write_text(json.dumps(CACHE, ensure_ascii=False),encoding='utf8')
    cards = []
    for book in BOOKS:
        links = []
        for file in book['files']:
            href = '../' + quote(file['path'], safe='/')
            terms = TOPICS.get(book['theme'], TOPICS['세계지리'])
            shortcuts = ' '.join(f'<a class="term" href="{href}#page={file["topics"][t][0]}" target="_blank">{html.escape(t)} · PDF {file["topics"][t][0]}쪽</a>'
                                 for t in terms if t in file['topics'])
            links.append(f'<div class="file"><a href="{href}" target="_blank">{html.escape(re.sub(r"__[a-f0-9]+(?=\.pdf)", "", file["name"]))}</a>'
                         f'<small>{file["pages"]}쪽 · {file["bytes"]/1024/1024:.1f} MB</small><details><summary>내용 찾기</summary>{shortcuts or "텍스트 색인 없음"}</details></div>')
        search = html.escape(' '.join([book['title'],book['publisher'],book['theme'],book['level'],book['revision']] + [t for f in book['files'] for t in f['topics']]), quote=True)
        cards.append(f'<article data-search="{search}" data-theme="{book["theme"]}"><div class="meta">{book["level"]} · {book["publisher"]} · {book["revision"]} 개정</div>'
                     f'<h2>{html.escape(book["title"])}</h2><p>{book["status"]}</p>{"".join(links)}</article>')
    gaprows = ''.join(f'<tr><td>{s}</td><td>{t}</td><td>{r}</td><td><a href="{u}" target="_blank">공식 안내</a></td></tr>' for s,t,r,u in GAPS)
    page = '''<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>세계사·세계지리 교과서 열람 목록</title><style>
*{box-sizing:border-box}body{margin:0;background:#f4f5f1;color:#21392e;font-family:system-ui,'Malgun Gothic',sans-serif;line-height:1.6}main{max-width:1200px;margin:auto;padding:42px 24px}h1{font-size:32px;letter-spacing:-1px;margin:6px 0 12px}h2{font-size:19px;margin:6px 0}.intro{max-width:850px;color:#526057}.guide{background:#e3eddf;border-radius:14px;padding:22px;margin:28px 0}.guide ol{padding-left:22px}.controls{position:sticky;top:0;background:#f4f5f1ed;padding:14px 0;display:flex;gap:8px;flex-wrap:wrap;z-index:1}input,select,button{border:1px solid #b8c8bc;border-radius:8px;padding:11px;font:inherit;background:white}input{flex:1;min-width:200px}button{cursor:pointer}#books{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:18px}article{background:white;border:1px solid #dce2d8;padding:22px;border-radius:13px;min-width:0}article[hidden]{display:none}.meta,small{font-size:12px;color:#63786b}small{display:block}.file{border-top:1px solid #e4e9e0;padding:12px 0;overflow-wrap:anywhere}a{color:#186548;text-decoration-thickness:1px;text-underline-offset:3px}summary{cursor:pointer;color:#526057;font-size:13px}.term{display:inline-block;font-size:12px;border:1px solid #e1e8dc;border-radius:5px;padding:3px 6px;margin:4px 2px;text-decoration:none}table{border-collapse:collapse;width:100%;font-size:13px}td,th{text-align:left;border-bottom:1px solid #d9e0d5;padding:10px;vertical-align:top}.scroll{overflow:auto}.note{font-size:13px;color:#63786b}footer{margin-top:24px}</style>
<main><div class="meta">LOCAL TEXTBOOK LIBRARY · 2026.11.02</div><h1>세계사와 세계지리, 교과서로 자세히 보기</h1>
<p class="intro">초6 사회에서 출발해 중학교 사회·역사①, 고등학교 세계사·세계지리 관련 교과서까지 비교해서 읽을 수 있습니다. 아래 파일은 프로젝트에 저장된 교과서 본문입니다. 단원별 PDF는 각각 열 수 있으며, 평가자료와 교사용 지도서는 열람 목록에서 제외했습니다.</p>
<section class="guide"><strong>이 순서로 읽으면 연결이 잘 보입니다</strong><ol>
<li><b>세계지리의 기초:</b> 아이스크림 사회 6-1 「지구, 대륙 그리고 국가들」 → 6-2 「세계의 자연환경」·「지구촌 사람들」. 지구본·위경도에서 지형·기후·인구로 넘어갑니다.</li>
<li><b>대륙별 비교:</b> 2022 개정 중학 사회①의 1~6단원. 세계화와 지리의 힘 → 아시아 → 유럽 → 아프리카 → 아메리카 → 오세아니아와 극지방 순으로 같은 지역을 출판사별로 비교하세요.</li>
<li><b>세계사의 흐름:</b> 중학 역사①의 문명 발생 → 종교와 지역 문화 → 교류와 변화 → 제국주의와 국민 국가 → 세계 대전 → 현대 세계. 지도·부도를 함께 열어 영역과 교역로 변화를 확인하세요.</li>
<li><b>더 깊게:</b> 고등 세계사의 교역망·국민 국가·현대 세계와, 세계시민과 지리의 기후·지형·종교·인구·자원·공간 격차를 함께 보세요. 2015 개정 세계지리는 지역별 서술을 비교하는 보조 자료로 묶었습니다.</li>
</ol></section><div class="controls"><input id="search" aria-label="교과서와 주제 검색" placeholder="아시아, 몽골, 산업 혁명, 출판사, 2022…"><select id="theme" aria-label="분야"><option value="">모든 분야</option><option>세계지리</option><option>세계사</option><option>지도·부도</option></select><button id="reset">초기화</button></div>
<p class="note" id="count"></p><p class="note">‘내용 찾기’는 용어가 등장하는 PDF 쪽으로 이동합니다. 인쇄 쪽수와 다르며, 차례·활동·참고 설명이 검색될 수도 있습니다. 교과서별 파일 수가 곧 교과서 권수는 아닙니다.</p><div id="books">__CARDS__</div>
<h2 style="margin-top:40px">아직 본문이 확보되지 않은 교과서</h2><p class="note">현재 전체 출판사 수집 완료 상태는 아닙니다. 공개 뷰어와 다운로드 가능한 본문은 구분했습니다. 교사 로그인 자료 확인은 Work의 로컬 브라우저 사용 설정이 꺼져 있어 진행하지 못했습니다. 고등 교과서는 기존 보유분이며 전체 출판사 전수조사를 마친 범위가 아닙니다.</p><div class="scroll"><table><thead><tr><th>범위</th><th>교과서</th><th>현황</th><th>출처</th></tr></thead><tbody>__GAPS__</tbody></table></div><footer class="note">원본 PDF는 기존 출판사 폴더에 그대로 보관합니다. 새로 받은 아이스크림 사회 6-1·6-2·사회과부도는 페이지 수·해시·표본 렌더링을 확인했습니다. 표본 확인은 모든 지면을 대조한 검사가 아닙니다.</footer></main>
<script>const q=document.querySelector('#search'),t=document.querySelector('#theme'),cards=[...document.querySelectorAll('article')];function filter(){let n=0;const s=q.value.replace(/\\s+/g,'').toLowerCase();for(const c of cards){c.hidden=!(c.dataset.search.replace(/\\s+/g,'').toLowerCase().includes(s)&&(!t.value||c.dataset.theme===t.value));if(!c.hidden)n++}document.querySelector('#count').textContent=`${n}개 교과서·부도 묶음 표시 / 전체 ${cards.length}개`}q.addEventListener('input',filter);t.addEventListener('change',filter);document.querySelector('#reset').onclick=()=>{q.value='';t.value='';filter()};filter();</script></html>'''
    (OUT/'교과서-열람.html').write_text(page.replace('__CARDS__',''.join(cards)).replace('__GAPS__',gaprows),encoding='utf8')
    print(json.dumps({'bookSets':len(BOOKS),'pdfFiles':sum(len(b['files']) for b in BOOKS),'excludedSamples':len(EXCLUDED)},ensure_ascii=False))


if __name__ == '__main__':
    build_inventory()
    write_output()
