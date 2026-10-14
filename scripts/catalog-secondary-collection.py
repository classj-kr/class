"""Maintain a local searchable catalog while the existing download jobs run.

This program performs no network requests. Downloads are verified against their
recorded CRC/SHA256; incomplete jobs and missing members stay explicitly listed.
"""
import argparse, csv, hashlib, json, os, time, zlib
from collections import Counter
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'references/textbooks/중고등'
MANIFESTS = [ROOT/'references/textbooks'/n for n in (
    'secondary-tselpa-high-korean-archives.json', 'secondary-tselpa-more-archives.json',
    'secondary-miraen-mid-archives.json', 'secondary-miraen-mid-more.json',
    'secondary-miraen-history1.json', 'secondary-miraen-history2.json',
    'secondary-miraen-atlas.json', 'secondary-miraen-maps-more.json',
    'secondary-miraen-history2-evals.json', 'secondary-miraen-social-atlas.json',
    'secondary-miraen-mid-2022-extra.json', 'secondary-miraen-history1-evals.json',
    'secondary-miraen-social.json', 'secondary-miraen-mid-evaluations-observed.json',
    'secondary-miraen-map-page1.json')]
CACHE = {}

def load(path):
    try: return json.loads(path.read_text(encoding='utf-8-sig'))
    except (OSError, ValueError): return None

def save(path, data):
    temp = path.with_name(path.name+'.tmp')
    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf8')
    os.replace(temp, path)

def verify(path, row):
    if not path.is_file(): return '파일 없음'
    stat = path.stat()
    if stat.st_size != row.get('bytes', stat.st_size): return '크기 불일치'
    key = (str(path), stat.st_mtime_ns, stat.st_size, row.get('crc32'), row.get('sha256'))
    if key in CACHE: return CACHE[key]
    crc, sha = 0, hashlib.sha256()
    with path.open('rb') as stream:
        while block := stream.read(4*1024*1024):
            crc = zlib.crc32(block, crc); sha.update(block)
    result = '정상'
    if 'crc32' in row and (crc & 0xffffffff) != row['crc32']: result = 'CRC 불일치'
    if row.get('sha256') and sha.hexdigest() != row['sha256']: result = '해시 불일치'
    CACHE[key] = result
    return result

def csv_write(name, rows, fields):
    temp = BASE/(name+'.tmp')
    with temp.open('w', encoding='utf-8-sig', newline='') as out:
        writer = csv.DictWriter(out, fieldnames=fields, extrasaction='ignore')
        writer.writeheader(); writer.writerows(rows)
    os.replace(temp, BASE/name)

def catalog():
    files, jobs, missing, seen = [], [], [], set()
    for receipt in BASE.rglob('수집기록.json'):
        record = load(receipt)
        if not record: continue
        source = record.get('source', {})
        if not isinstance(source, dict): continue
        job = {'출판사':source.get('publisher',''), '학교급':source.get('level',''),
                     '과목':source.get('subject',''), '교과서':source.get('title',''),
                     '상태':record.get('status',''), '대상파일':record.get('selected',0),
                     '처리파일':len(record.get('files',[]))}
        if not record.get('localArchive'): jobs.append(job)
        seen.add(source.get('url'))
        processed = set()
        for item in record.get('files', []):
            processed.add(item.get('member'))
            path = Path(item['path'])
            state = verify(path, item) if item.get('status') in {'existing','downloaded'} else '다운로드 실패'
            row = {'출판사':source.get('publisher',''), '학교급':source.get('level',''),
                   '과목':source.get('subject',''), '교과서':source.get('title',''),
                   '파일명':path.name, '원본경로':item.get('member',''), '크기':item.get('bytes',0),
                   '검사':state, '경로':str(path), '링크':path.relative_to(BASE).as_posix()}
            files.append(row)
            if state != '정상': missing.append({**row,'사유':item.get('error',state)})
        if record.get('status') != 'complete':
            missing.append({**job, '파일명':'', '사유':record.get('error') or '묶음 수집 진행 중 또는 미완료'})
    for receipt in BASE.rglob('*.수집기록.json'):
        record = load(receipt)
        if not record: continue
        seen.add(record.get('url'))
        path = Path(record['path']) if record.get('path') else None
        state = verify(path, record) if path and record.get('status') == 'downloaded' else '다운로드 실패'
        row = {'출판사':record.get('publisher',''), '학교급':record.get('level',''),
               '과목':record.get('subject',''), '교과서':record.get('category',''),
               '파일명':path.name if path else record.get('title',''), '원본경로':record.get('title',''),
               '크기':record.get('bytes',0), '검사':state, '경로':str(path) if path else '',
               '링크':path.relative_to(BASE).as_posix() if path else ''}
        if path: files.append(row)
        if state != '정상': missing.append({**row, '사유':record.get('error',state)})
    for manifest in MANIFESTS:
        for source in load(manifest) or []:
            if source['url'] not in seen:
                missing.append({'출판사':source['publisher'],'학교급':source['level'],
                                '과목':source['subject'],'교과서':source['title'],'사유':'수집기록 아직 없음'})
    known = {row['경로'] for row in files}
    for path in BASE.rglob('*'):
        if path.suffix.lower() not in {'.pdf','.hwp','.hwpx','.doc','.docx','.zip','.jpg','.jpeg','.png'} or str(path) in known: continue
        parts = path.relative_to(BASE).parts
        files.append({'출판사':parts[0], '학교급':parts[1] if len(parts)>1 else '',
            '과목':parts[2] if len(parts)>2 else '', '교과서':parts[3] if len(parts)>3 else '',
            '파일명':path.name,'원본경로':'','크기':path.stat().st_size,
            '검사':'기존 보관 파일 / 별도 기록', '경로':str(path),'링크':path.relative_to(BASE).as_posix()})
    missing.append({'출판사':'미래엔','사유':'중등 다운로드 재개. 고등 및 중등 교과서별 전체 자료 범위 대조는 진행 중'})
    for publisher in ('두클래스','T셀파'):
        missing.append({'출판사':publisher, '사유':'추가 브라우저 탐색 권한 거부. 확인된 목록 외 자료의 전체 범위 대조 미완료'})
    stats = {'갱신시각':datetime.now().isoformat(timespec='seconds'),'파일수':len(files),
             '검증정상':sum(r['검사']=='정상' for r in files),'바이트':sum(r['크기'] for r in files),
             '묶음상태':dict(Counter(j['상태'] for j in jobs)), '전체수집완료':False}
    save(BASE/'정리현황.json',stats)
    save(BASE/'미수집목록.json',missing)
    csv_write('전체파일목록.csv',files,['출판사','학교급','과목','교과서','파일명','크기','검사','경로','원본경로'])
    csv_write('묶음진행현황.csv',jobs,['출판사','학교급','과목','교과서','상태','대상파일','처리파일'])
    csv_write('미수집목록.csv',missing,['출판사','학교급','과목','교과서','파일명','사유'])
    (BASE/'목록데이터.js').write_text('window.COLLECTION='+json.dumps({'stats':stats,'files':files},ensure_ascii=False)+';',encoding='utf8')
    print(json.dumps(stats,ensure_ascii=False),flush=True)
    return stats

HTML = '''<!doctype html><html lang="ko"><meta charset="utf-8"><title>중고등 자료찾기</title>
<style>body{font:15px system-ui;margin:32px;color:#183040}input,select{font:inherit;padding:9px;margin:4px}table{border-collapse:collapse;width:100%}td,th{padding:9px;border-bottom:1px solid #dde;text-align:left}a{color:#1264ac}.note{background:#fff2ce;padding:14px}</style>
<h1>중고등 수집 자료</h1><p class="note">현재 확보한 파일 목록입니다. 전체 수집 완료가 아닙니다. 누락·진행 상태는 미수집목록.csv와 묶음진행현황.csv에서 확인하세요.</p>
<p id="status"></p><select id="pub"><option value="">전체 출판사</option></select><select id="level"><option value="">전체 학교급</option></select><select id="subject"><option value="">전체 과목</option></select><input id="q" placeholder="교과서·파일명 검색" size="36"><p id="count"></p><table><thead><tr><th>출판사</th><th>학교급</th><th>과목</th><th>교과서</th><th>파일</th><th>검사</th></tr></thead><tbody id="rows"></tbody></table>
<script src="목록데이터.js"></script><script>
const d=window.COLLECTION;document.querySelector('#status').textContent='갱신 '+d.stats.갱신시각+' / '+d.stats.파일수+'개 파일 / '+(d.stats.바이트/1e9).toFixed(2)+' GB (문항 수 아님)';
for(const [id,k] of [['pub','출판사'],['level','학교급'],['subject','과목']])for(const v of [...new Set(d.files.map(x=>x[k]))].sort()){const o=document.createElement('option');o.value=o.textContent=v;document.getElementById(id).append(o)}
function render(){let list=d.files.filter(x=>(!pub.value||x.출판사===pub.value)&&(!level.value||x.학교급===level.value)&&(!subject.value||x.과목===subject.value)&&(!q.value||(x.교과서+' '+x.파일명).toLowerCase().includes(q.value.toLowerCase())));document.getElementById('count').textContent=list.length+'개';const body=document.getElementById('rows');body.replaceChildren();for(const x of list.slice(0,800)){const tr=document.createElement('tr');for(const k of ['출판사','학교급','과목','교과서','파일명','검사']){const td=document.createElement('td');if(k==='파일명'){const a=document.createElement('a');a.href=x.링크.split('/').map(encodeURIComponent).join('/');a.textContent=x[k];td.append(a)}else td.textContent=x[k];tr.append(td)}body.append(tr)}}
for(const id of ['pub','level','subject','q'])document.getElementById(id).addEventListener('input',render);render();</script></html>'''

if __name__ == '__main__':
    p=argparse.ArgumentParser();p.add_argument('--watch',action='store_true');args=p.parse_args()
    BASE.mkdir(parents=True,exist_ok=True)
    (BASE/'자료찾기.html').write_text(HTML,encoding='utf8')
    deadline=time.monotonic()+24*3600
    while True:
        state=catalog()
        if not args.watch or time.monotonic()>deadline: break
        active=state['묶음상태']
        if not active.get('downloading') and not active.get('indexed') and not active.get('indexing'): break
        time.sleep(30)
