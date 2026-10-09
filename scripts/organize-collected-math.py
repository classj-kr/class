"""Make a readable local-only copy of collected math documents and their inventories."""
import csv
import hashlib
import html
import json
from collections import Counter
from datetime import datetime
from pathlib import Path
import re
import shutil
from urllib.parse import parse_qs, unquote, urlsplit
from zipfile import ZipFile, is_zipfile

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'references/textbooks'
OUT = ROOT / 'tmp/수학자료_정리본'
OUT.mkdir(parents=True, exist_ok=True)
rows, errors, aliases = [], [], []
seen, destinations = {}, {}
PUBS = {'T셀파': '천재교육·천재교과서', 'YBM': 'YBM', '아이스크림': '아이스크림미디어',
        '디딤돌': '디딤돌교육'}

def read(name, default=None):
    p = REF / name
    return json.loads(p.read_text(encoding='utf8')) if p.exists() else default

def clean(value, limit=110):
    text = re.sub(r'[<>:"/\\|?*\x00-\x1f]', '_', str(value))
    text = re.sub(r'\s+', ' ', text).strip(' ._')
    return text[:limit].rstrip(' .') or '자료'

def category(text):
    compact = re.sub(r'\s+', '', text)
    rules = [('평가계획|수업및평가', '평가계획'), ('평가자료소스', '평가편집용_소스'),
             ('누적평가', '누적평가'), ('익힘평가', '수학익힘_평가'),
             ('단원(?:기본|보충|심화)평가', '단원평가'), ('프로젝트평가', '프로젝트평가'),
             ('수학독해', '수학독해'), ('(?<!기초)개념문제', '개념문제'), ('포트폴리오', '포트폴리오평가'),
             ('쌍둥이', '수학익힘_쌍둥이문제'), ('오개념', '오개념문제'),
             ('형성', '형성평가'), ('진단', '진단평가'), ('기말|학기말|학기끝', '기말평가'),
             ('중간|중간말', '중간평가'), ('단원평가|단원총괄', '단원평가'),
             ('서술형|논술형', '서술형평가'), ('기초개념', '차시별_기초문제'),
             ('심화문제', '차시별_심화문제'), ('기초연산|연산|기초학습|기초플러스|10분학습', '기초학습_연산'),
             ('체크리스트', '평가체크리스트'), ('수행|과정중심|관찰|평가지|자기평가|동료평가', '수행평가'),
             ('활동지|학습지', '학습활동지'), ('수학익힘', '수학익힘'),
             ('지도서', '지도서'), ('지도안|과정안', '수업지도안'), ('차시.*평가자료', '차시별평가')]
    return next((label for pattern, label in rules if re.search(pattern, compact)), '기타_수학자료')

def metadata(row, name, member=''):
    pub = PUBS.get(row.get('publisher', ''), row.get('publisher', '비상교육'))
    book = row.get('book') or row.get('course', '')
    evidence = book + ' ' + member + ' ' + name
    match = re.search(r'([1-6])\s*학년\s*([12])\s*학기', evidence)
    if not match:
        match = re.search(r'(?<!\d)([1-6])\s*[-_]\s*([12])(?=\D|$)', evidence)
    grade, term = match.groups() if match else ('', '')
    author = next((a for a in ['박만구', '한대희', '나귀수', '강문봉', '류희찬', '장혜원', '방정숙', '최수일', '김성여']
                   if a in (book + ' ' + str(row.get('author', '')))), '')
    if not author and grade and int(grade) >= 3:
        author = {'동아출판': '나귀수', '지학사': '강문봉', 'YBM': '류희찬', '미래엔': '장혜원',
                  '비상교육': '방정숙', '디딤돌교육': '최수일', '아이스크림미디어': '김성여'}.get(pub, '')
    if pub == '천재교육·천재교과서' and not author:
        source = row.get('ebookUrl', '') + row.get('sourceUrl', '') + row.get('archiveUrl', '')
        if re.search(r'math-P|MM_\d\dP', source): author = '박만구'
        elif re.search(r'math-H|MM_\d\dH', source): author = '한대희'
    unit = ''
    match = re.search(r'(\d+)\s*단원', name)
    if not match: match = re.search(r'\([1-6]-[12]-(\d+)\)|/[1-6]-[12]-(\d+)/', member + '/' + name)
    if match: unit = next(v for v in match.groups() if v is not None)
    if not unit and re.match(r'^\d+', str(row.get('unit', ''))):
        unit = re.match(r'^\d+', row['unit']).group()
    if not unit and pub == '비상교육':
        match = re.search(r'수학\s*[1-6]-[12]_(\d+)_', name)
        if match: unit = match.group(1)
    if not unit and pub == '미래엔':
        match = re.match(r'([1-6])([12])([0-9])_', name)
        if match: unit = match.group(3)
    if not unit and pub == 'YBM':
        match = re.search(r'\)_(\d{2})_', name)
        if match: unit = str(int(match.group(1)))
    cat = category(name + ' ' + str(row.get('category', '')) + ' ' + str(row.get('title', '')))
    return pub, grade, term, author, unit, cat

def store(row, source, member='', data=None, bundle=False):
    if not source.is_file():
        errors.append({'source': str(source), 'error': '원본 파일 없음'}); return
    name = Path(member).name if member else row.get('fileName') or row.get('name') or source.name
    if not Path(name).suffix and source.suffix: name += source.suffix
    if re.fullmatch(r'[0-9a-f]{20,}\.[a-z0-9]+', name, re.I):
        name = Path(unquote(urlsplit(row.get('url', row.get('downloadUrl', ''))).path)).name or name
    if row.get('name') and row.get('publisher') == 'YBM': name = row['name'] + source.suffix
    pub, grade, term, author, unit, cat = metadata(row, name, member)
    digest = hashlib.sha256(data).hexdigest() if data is not None else row.get('sha256') or hashlib.file_digest(source.open('rb'), 'sha256').hexdigest()
    key = (pub, grade, term, author, cat, bool(bundle), digest)
    if key in seen:
        aliases.append({'organizedPath': seen[key], 'sourcePath': str(source), 'archiveMember': member,
                        'sourceTitle': row.get('label', row.get('title', name))}); return
    suspect = False
    if pub == '지학사' and member and row.get('unit'):
        actual = re.search(r'(\d+)단원', name)
        expected = re.match(r'\d+', row['unit'])
        suspect = bool(actual and expected and actual.group(1) != expected.group())
    folder = OUT / ('02_원본압축파일' if bundle else '03_검토필요' if suspect else '01_자료') / clean(pub)
    folder /= f'{grade}학년 {term}학기' if grade and term else '학년학기_확인필요'
    if author: folder /= author
    folder /= '압축묶음' if bundle else cat
    if unit and not bundle: folder /= f'{int(unit):02d}단원' if int(unit) else '00_공통·준비학습'
    prefix = f'수학{grade}-{term}_' if grade and term else ''
    if unit and not bundle: prefix += f'{int(unit):02d}단원_'
    suffix = Path(name).suffix.lower()
    stem = clean(Path(name).stem, max(30, 130 - len(prefix)))
    target = folder / (prefix + stem + suffix)
    relative = target.relative_to(OUT).as_posix()
    if relative in destinations and destinations[relative] != digest:
        target = folder / (prefix + stem[:100] + '__' + digest[:10] + suffix)
        relative = target.relative_to(OUT).as_posix()
    folder.mkdir(parents=True, exist_ok=True)
    if target.exists():
        with target.open('rb') as f: existing_digest = hashlib.file_digest(f, 'sha256').hexdigest()
        if existing_digest != digest:
            raise RuntimeError('Existing organized file differs; refusing overwrite: ' + relative)
    elif data is not None: target.write_bytes(data)
    else: shutil.copy2(source, target)
    destinations[relative] = digest; seen[key] = relative
    rows.append({'출판사': pub, '학년': grade, '학기': term, '저자': author, '단원': unit,
                 '자료유형': '원본압축파일' if bundle else cat, '파일명': target.name, '정리경로': relative,
                 '크기바이트': target.stat().st_size, 'SHA256': digest, '원본경로': str(source),
                 '압축내경로': member, '출처': row.get('sourceUrl', ''),
                 '상태': '단원 표기 불일치 확인 필요' if suspect else '저장완료'})
    if len(rows) % 1000 == 0: print(json.dumps({'organized': len(rows)}, ensure_ascii=False), flush=True)

def process(row):
    source = Path(row['path'])
    if row.get('status', 'downloaded') not in {'downloaded', 'acquired'}: return
    if source.suffix.lower() == '.zip' and source.is_file() and is_zipfile(source):
        store(row, source, bundle=True)
        with ZipFile(source) as archive:
            for info in archive.infolist():
                name = info.filename
                if not info.flag_bits & 0x800:
                    try: name = name.encode('cp437').decode('cp949')
                    except UnicodeError: pass
                if Path(name).suffix.lower() not in {'.hwp', '.hwpx', '.pdf', '.doc', '.docx', '.xlsx', '.xls', '.ppt', '.pptx'}:
                    continue
                try: store({**row, 'sha256': None}, source, member=name, data=archive.read(info))
                except Exception as e: errors.append({'source': str(source), 'member': name, 'error': str(e)[:200]})
    else:
        store(row, source, member=row.get('archiveMember', ''))

for name in ['math-direct-download-receipts.json', 'math-miraen-download-receipts.json',
             'math-tselpa-archive-download-receipts.json', 'math-visang-archive-supplement-receipts.json']:
    for row in read(name, []): process(row)
for row in read('math-download-receipts.json', []):
    if row.get('publisher') != '지학사': process(row)
repairs = {}
for row in read('math-jihak-repair-receipts.json', []):
    repairs[(row['book'], row['category'], re.sub(r'\s+', '', row['unit']))] = row
for row in repairs.values(): process(row)
for name in ['visang-public-bank-acquired.json', *[f'visang-math{k}-archive-acquired.json' for k in ['31', '32', '41', '42']]]:
    for row in read(name, {}).get('sources', []):
        if row.get('course', '').startswith('수학'):
            process({**row, 'publisher': '비상교육',
                     'fileName': Path(unquote(urlsplit(row['downloadUrl']).path)).name if row.get('downloadUrl') else row['sourceFile'],
                     'path': str(REF / 'raw' / row['sourceFile'])})
for path in sorted((REF / 'tselpa-browser-assessments').glob('*math*.json')):
    d = json.loads(path.read_text(encoding='utf8')); q = parse_qs(urlsplit(d['url']).query)
    for group in d.get('groups', []):
        for item in group.get('lessons', []):
            if item.get('downloadPath'):
                process({'publisher': 'T셀파', 'book': f"수학{q['g'][0]}-{q['semester'][0]}",
                         'category': '수행평가', 'unit': group['title'], 'name': Path(item['downloadPath']).name,
                         'sourceUrl': d['url'], 'path': item['downloadPath']})

rows.sort(key=lambda r: (r['출판사'], r['학년'], r['학기'], r['저자'], r['자료유형'], r['단원'].zfill(2), r['파일명']))
with (OUT / '전체파일목록.csv').open('w', encoding='utf-8-sig', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
for name, value in [('정리목록.json', rows), ('중복출처목록.json', aliases), ('정리오류.json', errors)]:
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf8')
pending = read('math-tselpa-pending-coverage.json', {})
pending_rows = []
for path in sorted((REF / 'tselpa-math-pending-lists').glob('*.json')):
    d = json.loads(path.read_text(encoding='utf8')); q = parse_qs(urlsplit(d['url']).query)
    for group in d['groups']:
        for item in group['files']:
            pending_rows.append({'출판사': '천재교육·천재교과서', '학년': q['g'][0], '학기': q['semester'][0],
                                 '단원': group['title'], '자료명': item['title'], '자료ID': item['resourceId'],
                                 '상태': '미수집_공식 다운로드 미완료', '목록출처': d['url']})
with (OUT / '미수집목록.csv').open('w', encoding='utf-8-sig', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(pending_rows[0])); w.writeheader(); w.writerows(pending_rows)
summary = {'updatedAt': datetime.now().isoformat(), 'outputRoot': str(OUT), 'organizedFiles': len(rows),
           'documents': sum(r['자료유형'] != '원본압축파일' for r in rows),
           'bundles': sum(r['자료유형'] == '원본압축파일' for r in rows), 'duplicateAliases': len(aliases),
           'byPublisher': dict(Counter(r['출판사'] for r in rows if r['자료유형'] != '원본압축파일')),
           'unclassifiedGradeTerm': sum(not r['학년'] or not r['학기'] for r in rows),
           'pendingListedFiles': len(pending_rows), 'errors': len(errors),
           'reviewRequired': sum(r['상태'] != '저장완료' for r in rows)}
(OUT / '정리결과.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf8')
(REF / 'math-local-organization-status.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf8')
(OUT / '먼저읽기.txt').write_text(
    '초등 수학 수집 자료 정리본\n\n'
    '수집 전체 완료 상태는 아닙니다. 확보한 자료의 정리본입니다.\n'
    '01_자료: 출판사 → 학년·학기 → 저자(필요시) → 자료유형 → 단원\n'
    '02_원본압축파일: 받은 ZIP 원본. 문서는 01_자료에 별도로 풀어 정리했습니다.\n'
    '03_검토필요: 공식 자료명과 실제 파일의 단원이 다른 자료\n'
    '전체파일목록.csv: 엑셀에서 열어 필터·정렬 가능한 원본 대응 목록\n'
    '자료찾기.html: 인터넷 연결 없이 파일명 검색·분류 및 열기\n'
    '미수집목록.csv: 천재 1~2학년 평가 701건의 아직 받지 못한 원본 목록\n\n'
    '추가 미확보: 천재 박만구 5-1 공식 ZIP 404 및 폴더형 단원평가 자료.\n'
    '미래엔 6학년 비활성 항목 4건과 아이스크림 일부 미공개 학기말 자료도 확보하지 못했습니다.\n'
    '기존 지학사 오수집 묶음은 제외하고 다시 수집한 묶음을 사용했습니다.\n'
    '파일 내용은 바꾸지 않았으며 기존 원본은 원래 위치에 보존했습니다.\n'
    '중복은 출판사·학년학기·저자·유형 안에서 같은 내용인 경우 통합했습니다.\n'
    '파일 수는 문항 수가 아닙니다. 평가기준·정답·체크리스트 등이 포함됩니다.\n\n'
    + f"정리 문서: {summary['documents']:,}개\n원본 압축파일: {summary['bundles']:,}개\n"
    + f"중복 통합: {summary['duplicateAliases']:,}건\n검토 필요: {summary['reviewRequired']}건\n"
    + '\n출판사별 문서 수\n' + '\n'.join(f'{pub}: {count:,}개' for pub, count in summary['byPublisher'].items()),
    encoding='utf-8-sig')
data = [{k: r[k] for k in ['출판사', '학년', '학기', '저자', '단원', '자료유형', '파일명', '정리경로', '상태']} for r in rows]
(OUT / '목록데이터.js').write_text('const FILES=' + json.dumps(data, ensure_ascii=False).replace('</', '<\\/') + ';', encoding='utf8')
(OUT / '자료찾기.html').write_text('''<!doctype html><html lang="ko"><meta charset="utf-8"><title>초등 수학 자료찾기</title>
<style>body{font:15px system-ui;margin:32px;background:#f5f7fa;color:#172334}h1{margin-bottom:8px}input,select{padding:10px;margin:6px;border:1px solid #bbc5d0;border-radius:6px}input{width:330px}table{border-collapse:collapse;width:100%;background:white}td,th{padding:10px;text-align:left;border-bottom:1px solid #dde4eb}th{background:#eaf0f6}a{color:#175eaf}#count{margin:18px 0}.note{color:#535f70}button{padding:9px;margin:12px}</style>
<h1>초등 수학 수집 자료</h1><p class="note">확보한 원본의 로컬 정리본입니다. 아직 못 받은 자료는 <a href="미수집목록.csv">미수집목록</a>에서 확인하세요.</p>
<input id="q" placeholder="자료명·단원·저자 검색"><select id="pub"><option value="">모든 출판사</option></select><select id="grade"><option value="">모든 학년</option></select><select id="term"><option value="">모든 학기</option><option value="1">1학기</option><option value="2">2학기</option></select><select id="cat"><option value="">모든 자료유형</option></select>
<p><a href="전체파일목록.csv">전체 파일 목록(CSV)</a> · <a href="먼저읽기.txt">정리 안내</a></p><div id="count"></div><table><thead><tr><th>출판사</th><th>학년·학기</th><th>저자</th><th>유형</th><th>파일명</th></tr></thead><tbody id="list"></tbody></table><button id="prev">이전</button><span id="page"></span><button id="next">다음</button>
<script src="목록데이터.js"></script><script>
const el=id=>document.getElementById(id);let page=0,matched=[];const size=100;
for(const [id,key] of [['pub','출판사'],['grade','학년'],['cat','자료유형']])for(const v of [...new Set(FILES.map(r=>r[key]))].filter(Boolean).sort()){const o=document.createElement('option');o.value=v;o.textContent=id==='grade'?v+'학년':v;el(id).append(o)}
function render(){el('list').replaceChildren();for(const r of matched.slice(page*size,(page+1)*size)){const tr=document.createElement('tr');for(const v of [r.출판사,r.학년+'학년 '+r.학기+'학기',r.저자,r.자료유형]){const td=document.createElement('td');td.textContent=v;tr.append(td)}const td=document.createElement('td'),a=document.createElement('a');a.textContent=r.파일명+(r.상태==='저장완료'?'':' [검토 필요]');a.href=r.정리경로.split('/').map(encodeURIComponent).join('/');td.append(a);tr.append(td);el('list').append(tr)}el('count').textContent='전체 '+FILES.length.toLocaleString()+'개 파일 · 검색 결과 '+matched.length.toLocaleString()+'개';el('page').textContent=(page+1)+' / '+Math.max(1,Math.ceil(matched.length/size));el('prev').disabled=page===0;el('next').disabled=(page+1)*size>=matched.length}
function filter(){const q=el('q').value.toLowerCase().trim();matched=FILES.filter(r=>(!el('pub').value||r.출판사===el('pub').value)&&(!el('grade').value||r.학년===el('grade').value)&&(!el('term').value||r.학기===el('term').value)&&(!el('cat').value||r.자료유형===el('cat').value)&&(!q||Object.values(r).join(' ').toLowerCase().includes(q)));page=0;render()}
for(const id of ['q','pub','grade','term','cat'])el(id).addEventListener('input',filter);el('prev').onclick=()=>{page--;render()};el('next').onclick=()=>{page++;render()};filter();</script></html>''', encoding='utf8')
print(json.dumps(summary, ensure_ascii=False), flush=True)
