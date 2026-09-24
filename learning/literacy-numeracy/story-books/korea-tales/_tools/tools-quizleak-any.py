# -*- coding: utf-8 -*-
"""어느 트랙이든 문제 새어 나감을 잰다.  python tools-quizleak-any.py <트랙폴더> [show]
   물음에 답·전제(뒤에도 따위)·다른 문항에 답, 세 가지만 기계로 본다. 후보만 낸다."""
import io,os,re,json,sys
def quiz_of(path):
    s=io.open(path,encoding='utf-8').read()
    i=s.find('const QUIZ = [')
    if i<0: return None
    j=s.find('\n];',i); blk=s[i+len('const QUIZ = '):j+2]
    blk=re.sub(r'(\{|,)\s*\n?\s*(q|choices|answer|wide)\s*:', lambda m:m.group(1)+'"'+m.group(2)+'":', blk)
    blk=re.sub(r',\s*([\]\}])', r'\1', blk)
    try: return json.loads(blk)
    except Exception as e: return ('ERR',str(e)[:60])
TAIL=re.compile(u'(을|를|이|가|은|는|에|에서|으로|로|와|과|도|만|의|께|한테|에게)$')
HEDGE=[u'뒤에도',u'여전히',u'그래도',u'아직도',u'그런데도',u'끝내',u'결국',u'계속']
def chunks(t):
    return {TAIL.sub('',w) for w in re.split(r'[\s,·?]+',t) if len(TAIL.sub('',w))>=2}
track=sys.argv[1]; show=len(sys.argv)>2
books=0; qs_total=0; bad=0; per=[]; kinds={}
for b in sorted(os.listdir(track)):
    p=os.path.join(track,b,'app.js')
    if not os.path.isfile(p): continue
    q=quiz_of(p)
    if q is None: continue
    if isinstance(q,tuple): print('parse fail',b,q); continue
    books+=1; n=0
    for a,x in enumerate(q):
        qs_total+=1; ans=x['choices'][x['answer']]; wrong=' '.join(c for k,c in enumerate(x['choices']) if k!=x['answer'])
        parts={p for p in chunks(ans) if p not in wrong and len(p)>=len(ans.replace(' ',''))*0.6}
        flag=None
        if any(p in x['q'] for p in parts): flag='물음에 답'
        elif any(h in x['q'] for h in HEDGE): flag='전제'
        else:
            for bb,y in enumerate(q):
                if bb==a: continue
                if any(p in y['q'] for p in parts) or (len(ans)>=3 and ans in ' '.join(y['choices'])): flag='다른 문항'; break
        if flag:
            n+=1; bad+=1; kinds[flag]=kinds.get(flag,0)+1
            if show: print(f'  {b} Q{a+1} [{flag}] {x["q"]} → {ans}')
    per.append((n,len(q),b))
per.sort(reverse=True)
print(track,'books',books,'questions',qs_total,'machine-flagged',bad,kinds)
print('  worst:',[(f"{n}/{t}",b) for n,t,b in per[:8]])
