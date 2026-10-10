"""Organize actual browser downloads and audit elementary textbook PDFs."""
import collections, hashlib, html, json, re, shutil, zipfile, logging
from pathlib import Path
from pypdf import PdfReader
logging.getLogger('pypdf').setLevel(logging.ERROR)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'references/textbooks/초등'
def clean(s): return re.sub(r'[<>:"/\\|?*]', '_', s)
def read(p): return json.loads(p.read_text(encoding='utf-8-sig'))

saved = ROOT / 'references/textbooks/elementary-douclass-saved.json'
rows = read(saved) if saved.exists() else []
didim_manifest = ROOT/'references/textbooks/elementary-didim-textbook-downloads.json'
if didim_manifest.exists():
    grouped = collections.defaultdict(list)
    for row in read(didim_manifest):
        grouped[row['book']].append(row)
    for title, items in grouped.items():
        folder = OUT/'디딤돌'/'수학'/clean(title+'_2022')
        folder.mkdir(parents=True, exist_ok=True)
        receipt = {'source': {'publisher':'디딤돌','subject':'수학','title':title+'_2022','sourceUrl':items[0]['sourcePage']}, 'status':'complete' if len(items)==2 else 'partial', 'files':[dict(i,status='verified',member=i['title']) for i in items]}
        (folder/'수집기록.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2),encoding='utf8')
for title, name, filename in [
    ('수학 3-2 (나귀수)', '수학 3-2 PDF', '(동아출판) 22개정_초등_수학 3-2 PDF.pdf'),
    ('수학 6-2 (나귀수)', '수학 6-2 PDF', '(동아출판) 초등_수학 6-2 PDF.pdf'),
    ('과학 3-1 (장신호)', '과학 3-1 PDF', '[동아출판] 22개정_초등_과학3-1PDF.pdf'),
    ('과학 3-2 (장신호)', '과학 3-2 PDF', '(동아출판) 22개정_초등_과학 3-2 PDF.pdf'),
]:
    menu = next(x for x in read(ROOT/'references/textbooks/elementary-douclass-book-menu.json') if x['title']==title)
    rows.append(dict(menu, name=name, path=str(Path('D:/Downloads')/filename), sourceUrl=menu['url']))
for row in rows:
    original = Path(row['path'])
    if not original.is_file(): continue
    subject = '사회과부도' if '부도' in row['title'] else row['title'][:2]
    publisher = '국정(동아 제공)' if re.match(r'수학 [12]-', row['title']) else '동아'
    title = row['title']+'_2022'
    folder = OUT/publisher/subject/clean(title)
    folder.mkdir(parents=True,exist_ok=True)
    target = folder/(clean(row['name'])+'.pdf')
    if not target.exists() or target.stat().st_size != original.stat().st_size: shutil.copy2(original,target)
    receipt = folder/'수집기록.json'
    current = read(receipt) if receipt.exists() else {'source':{'publisher':publisher,'subject':subject,'title':title,'sourceUrl':row['sourceUrl']},'files':[]}
    with target.open('rb') as f: digest=hashlib.file_digest(f,'sha256').hexdigest()
    current['files']=[x for x in current['files'] if x['path']!=str(target)]
    current['files'].append({'path':str(target),'member':row['name'],'status':'verified','bytes':target.stat().st_size,'sha256':digest,'originalDownload':str(original)})
    current['status']='complete'
    receipt.write_text(json.dumps(current,ensure_ascii=False,indent=2),encoding='utf8')

# Import the completed official ebook download, preserving its original ZIP.
download=Path('D:/Downloads/(5-1)수학PDF.zip')
if download.is_file():
    source=next(s for s in read(ROOT/'references/textbooks/elementary-tsherpa-archives.json') if s['title']=='수학_5-1_수학(박만구)_2022')
    folder=OUT/source['publisher']/source['subject']/clean(source['title'])
    folder.mkdir(parents=True,exist_ok=True)
    receipt={'source':source,'status':'complete','files':[],'method':'official ebook 자료실 download','originalDownload':str(download)}
    with zipfile.ZipFile(download) as z:
        for info in z.infolist():
            if not info.filename.lower().endswith('.pdf'):continue
            target=folder/clean(Path(info.filename).name)
            if not target.exists() or target.stat().st_size!=info.file_size:
                data=z.read(info)
                if not data.startswith(b'%PDF-'):raise ValueError(info.filename)
                target.write_bytes(data)
            with target.open('rb') as f:digest=hashlib.file_digest(f,'sha256').hexdigest()
            receipt['files'].append({'path':str(target),'member':info.filename,'bytes':info.file_size,'sha256':digest,'status':'verified','crc':info.CRC})
    (folder/'수집기록.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2),encoding='utf8')

cachepath=OUT/'PDF검사.json'
cache={r['path']:r for r in read(cachepath)} if cachepath.exists() else {}
books=[]; pdfs=[]
for p in sorted(OUT.rglob('*수집기록.json')):
    receipt=read(p)
    if 'source' not in receipt:
        if receipt.get('publisher')=='미래엔' and receipt.get('subject')=='사회과부도':
            receipt={'source':dict(publisher=receipt['publisher'],subject=receipt['subject'],title=receipt['book'],sourceUrl=receipt['sourceUrl']),'status':'complete','files':[receipt]}
        else:continue
    s=receipt['source']; files=receipt.get('files',[])
    if s['publisher']=='천재' and s['subject']=='사회과부도' and not files:
        atlas_title=re.sub(r'_[56]-[12]_2022$', '_5-6_2022', s['title'])
        if any(b['title']==atlas_title for b in books):continue
        s=dict(s,title=atlas_title)
        receipt=dict(receipt,status='pending',error='로그인 확인 후 공식 교과서 다운로드를 실행했으나 파일 다운로드가 시작되지 않음. 공개 묶음 링크도 제공되지 않음.')
    book={'publisher':s['publisher'],'subject':s['subject'],'title':s['title'],'sourceUrl':s.get('sourceUrl',''),'collectionStatus':receipt['status'],'files':[],'error':receipt.get('error','')}
    for f in files:
        path=Path(f['path'])
        if not path.is_file():continue
        old=cache.get(str(path));size=path.stat().st_size
        check=old if old and old['bytes']==size else {'path':str(path),'bytes':size}
        if 'pages' not in check:
            try:
                reader=PdfReader(path);check['pages']=len(reader.pages)
                check['status']='valid' if check['pages'] else 'empty'
            except Exception as exc:check.update(status='invalid',error=str(exc)[:250])
        entry=dict(check,filename=path.name,relativePath=path.relative_to(OUT).as_posix(),member=f.get('member',path.name))
        book['files'].append(entry);pdfs.append(check)
    books.append(book)
cachepath.write_text(json.dumps(pdfs,ensure_ascii=False,indent=2),encoding='utf8')
(OUT/'교과서목록.json').write_text(json.dumps(books,ensure_ascii=False,indent=2),encoding='utf8')
coverage={'scope':'2022 개정 초등 국어·수학·사회·과학. 국정 교과서 및 미래엔·동아·천재·디딤돌 제공 목록 기준. 부교재 전체 완비를 뜻하지 않음.',
    'bodySets':sum(b['subject']!='사회과부도' and b['collectionStatus']=='complete' for b in books),
    'atlasTitles':sum(b['subject']=='사회과부도' and b['collectionStatus']=='complete' for b in books),
    'pdfFiles':len(pdfs),'bytes':sum(f['bytes'] for f in pdfs),
    'pending':[dict(publisher=b['publisher'],title=b['title'],reason=b['error'],sourceUrl=b['sourceUrl']) for b in books if b['collectionStatus']!='complete'],
    'notes':['본문은 전체 PDF 또는 출판사가 제공한 단원별 PDF 묶음으로 저장함. 표지·판권·정답·부록 완전성은 단원 파일 제공 범위에 따름.','국어 가·나를 한 학년·학기 자료 묶음으로 계산함. 국정 1~2학년 수학은 동아 제공본을 저장함.','수학익힘·실험관찰·교과서 활동 자료는 함께 확보된 파일만 포함. 국어활동 등 부교재 전체 수집은 별도 대상.','PDF 헤더·파일 크기·페이지 구조를 검사함. 전체 페이지의 육안 검수는 수행하지 않음.']}
(OUT/'수집현황.json').write_text(json.dumps(coverage,ensure_ascii=False,indent=2),encoding='utf8')
payload=json.dumps(books,ensure_ascii=False).replace('</','<\\/')
page='''<!doctype html><html lang="ko"><meta charset="utf-8"><title>초등 교과서 수집 자료</title>
<style>body{font:16px system-ui;margin:32px;background:#f5f7fa;color:#173047}h1{margin-bottom:8px}input,select{padding:12px;margin:4px;border:1px solid #bbc8d2;border-radius:8px}article{background:white;padding:20px;margin:14px 0;border:1px solid #dbe2e9;border-radius:12px}a{color:#14609b}li{margin:8px 0}.muted{color:#5c6c7b}.warn{color:#9b5220}h2{font-size:18px}#summary{padding:16px 0}</style>
<h1>초등 국어·수학·사회·과학 교과서</h1><p class="muted">2022 개정 · 국정 및 미래엔·동아·천재 제공 목록 기준 · 전체 PDF와 단원별 PDF 묶음. 국어 가·나는 한 학년·학기로 계산합니다. 부교재 전체 완비를 뜻하지 않습니다.</p><p><a href="수집현황.json">수집 범위·미확보 목록</a></p>
<input id="q" placeholder="학년·학기·저자 검색"><select id="pub"><option value="">모든 출판사</option></select><select id="sub"><option value="">모든 과목</option></select><div id="summary"></div><main id="books"></main>
<script>const data=PAYLOAD;const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const [id,key]of [['pub','publisher'],['sub','subject']]){for(const v of [...new Set(data.map(x=>x[key]))]){const o=document.createElement('option');o.value=v;o.textContent=v;document.getElementById(id).append(o)}}
function render(){const rows=data.filter(b=>(!pub.value||b.publisher===pub.value)&&(!sub.value||b.subject===sub.value)&&JSON.stringify([b.title,b.publisher,b.subject]).includes(q.value));const files=rows.flatMap(b=>b.files);summary.textContent=`자료 묶음 ${rows.length}개 · 저장 PDF ${files.length}개 · 검사 통과 ${files.filter(x=>x.status==='valid').length}개`;books.innerHTML=rows.map(b=>`<article><h2>${esc(b.publisher)} · ${esc(b.title)}</h2><p class="muted">${b.collectionStatus==='complete'?'선택한 파일 저장 완료':'확인·수집 필요'} · PDF ${b.files.length}개</p>${b.error?`<p class="warn">${esc(b.error)}</p>`:''}<ul>${b.files.map(f=>`<li><a href="${f.relativePath.split('/').map(encodeURIComponent).join('/')}">${esc(f.filename)}</a> <span class="muted">${f.pages||'?'}쪽 · ${(f.bytes/1048576).toFixed(1)}MB · ${f.status==='valid'?'PDF 검사 통과':esc(f.status)}</span></li>`).join('')}</ul></article>`).join('')};for(const el of[q,pub,sub])el.addEventListener('input',render);render();</script></html>'''.replace('PAYLOAD',payload)
(OUT/'자료찾기.html').write_text(page,encoding='utf8')
print(json.dumps({'books':len(books),'pdfFiles':len(pdfs),'validPDFs':sum(x['status']=='valid' for x in pdfs),'invalid':[x for x in pdfs if x['status']!='valid'],'byPublisher':dict(collections.Counter(b['publisher'] for b in books))},ensure_ascii=False))
