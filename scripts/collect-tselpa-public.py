"""Archive public T셀파 curriculum HTML by following links printed in source HTML.

No cookies, login sessions, download endpoints, or invented curriculum identifiers.
"""
import concurrent.futures
import hashlib
import json
import re
import time
import urllib.request
from pathlib import Path
from urllib.parse import urljoin,urlparse,parse_qs
from lxml import html

ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';RAW=REF/'raw'
SEED='https://ele.tsherpa.co.kr/curri/E-curri_list.html?semester=2&grade=3&curri=E-curri03-math-H_2025'
records={}
def fetch(url):
    parsed=urlparse(url)
    assert parsed.hostname=='ele.tsherpa.co.kr' and parsed.path in ['/curri/E-curri_list.html','/curri/unit_detail_2026.html']
    key=hashlib.sha256(url.encode()).hexdigest()[:20];p=RAW/f'tselpa-public-{key}.html'
    if not p.exists():
        for attempt in range(3):
            try:
                with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=30) as r:
                    assert urlparse(r.url).hostname=='ele.tsherpa.co.kr';data=r.read()
                assert len(data)>300 and b'<html' in data.lower() or b'<div' in data.lower()
                p.write_bytes(data);break
            except Exception:
                if attempt==2:raise
                time.sleep(1)
    data=p.read_bytes();records[url]=dict(url=url,sourceFile=p.name,sha256=hashlib.sha256(data).hexdigest())
    return html.fromstring(data.decode('utf-8-sig'))
def links(tree):
    return [(' '.join(a.itertext()).strip(),urljoin(SEED,a.get('href'))) for a in tree.xpath('//a[contains(@href,"E-curri_list.html")]')]
def main():
    seed=fetch(SEED);landings=[]
    for title,url in links(seed):
        if title in ['1','2','3','4','5','6']:
            tree=fetch(url);landings.append((url,tree))
            first=next(u for t,u in links(tree) if t=='1학기')
            landings.append((first,fetch(first)))
    entries={}
    for landing,tree in landings:
        args=parse_qs(urlparse(landing).query);grade=int(args['grade'][0]);semester=int(args['semester'][0])
        for title,url in links(tree):
            q=parse_qs(urlparse(url).query)
            if q.get('grade')!=[str(grade)] or q.get('semester')!=[str(semester)]:continue
            if not re.match(r'^(국어|수학|사회|과학|도덕|영어|음악|미술|체육|실과|통합|봄|여름|가을|겨울|학교|사람들|우리나라|탐험|하루|약속|상상|이야기|나|자연|마을|세계|계절|인물|물건|기억)',title):continue
            curri=q.get('curri',[''])[0]
            if not re.search(r'_202[456]$',curri):continue
            entries[url]=dict(grade=grade,semester=semester,title=title,curri=curri,url=url)
    print('Discovered',len(entries),'textbook pages',flush=True)
    def acquire(item):
        tree=fetch(item['url']);badge=''.join(tree.xpath('//div[contains(@class,"yearType")]/text()'))
        assert re.search(r'2022\s*개정',badge),(item,'revision badge missing')
        groups=[]
        for node in tree.xpath('//*[@data-ajax="Y"]'):
            url=urljoin(item['url'],node.get('href',''));unit=fetch(url)
            groups.append(dict(unit=node.get('data-name'),url=url,**{k:v for k,v in records[url].items() if k!='url'}))
        return dict(**item,source=records[item['url']],groups=groups)
    sources=[];failures=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        futures={pool.submit(acquire,e):e for e in entries.values()}
        for f in concurrent.futures.as_completed(futures):
            try:
                s=f.result();sources.append(s);print(s['grade'],s['semester'],s['title'],len(s['groups']),flush=True)
            except Exception as e:failures.append(dict(entry=futures[f],error=str(e)));print('FAILED',str(e),flush=True)
    out=dict(schemaVersion=1,asOf='2026-10-09',method='unauthenticated-public-html-links',sources=sorted(sources,key=lambda s:(s['grade'],s['semester'],s['curri'])),failures=failures)
    (REF/'tselpa-public-sources.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Saved',len(sources),'pages;',sum(len(s['groups']) for s in sources),'units;',len(failures),'failures',flush=True)
if __name__=='__main__':main()
