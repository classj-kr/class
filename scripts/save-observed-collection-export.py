"""Save only marked publisher DOM records already returned by this chat's browser tool.

No browser profile, credentials, hidden state, or network is accessed.
"""
import json, re, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
TRANSCRIPT=Path('C:/Users/A/.codex/sessions/2026/10/08/rollout-2026-10-08T22-44-25-01a11bc2-10e8-71a0-9c27-9c2df578c4e9.jsonl')
MARKER='COLLECTION_DOM_EXPORT:'
calls=set(); books={}
for line in TRANSCRIPT.open(encoding='utf8'):
    record=json.loads(line).get('payload',{})
    if record.get('type')=='function_call' and record.get('name')=='js':
        calls.add(record.get('call_id'))
    if record.get('type')!='function_call_output' or record.get('call_id') not in calls: continue
    output=record.get('output','')
    if isinstance(output,list): output='\n'.join(x.get('text','') for x in output if isinstance(x,dict))
    if MARKER not in output: continue
    try: rows,_=json.JSONDecoder().raw_decode(output.split(MARKER,1)[1].lstrip())
    except ValueError: continue
    for book in rows:
        if not isinstance(book,dict) or not isinstance(book.get('refs'),list):continue
        books[book['seq']]=book
sources=[]
for book in books.values():
    for ref in book['refs']:
        params=ref.get('params','')
        if not params or not re.fullmatch(r'[a-zA-Z0-9%+/_=-]+',params):continue
        title=ref.get('title')
        if not title or title=='undefined':
            title=next((s for s in ref.get('display','').splitlines() if s.startswith('[')),ref.get('display','').splitlines()[0])
        sources.append({'publisher':'미래엔','level':'중학','subject':book['subject'],
                        'category':book['title']+'_평가자료','title':title+'__'+ref['seq'],
                        'displayTitle':ref.get('display',''), 'bookSeq':book['seq'],
                        'url':'https://api-cms.mirae-n.com/down_content?service=mteacher&params='+params})
target=ROOT/'references/textbooks/secondary-miraen-mid-evaluations-observed.json'
target.write_text(json.dumps(sources,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'books':{b['title']:len(b['refs']) for b in books.values()},'files':len(sources),'manifest':str(target)},ensure_ascii=False))
