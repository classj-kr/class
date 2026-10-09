"""Normalize archived T셀파 public outlines, retaining unknown hours and errors."""
import hashlib,json,re,subprocess
from collections import Counter,defaultdict
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';OUT=ROOT/'game-hub-server/data/textbooks'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def signature(s):return [(g['unit'],[l['raw'] for l in g['lessons']]) for g in s['groups']]
def run():
    src=REF/'tselpa-outline-extracted.json';doc=read(src);sha=hashlib.sha256(src.read_bytes()).hexdigest()
    catalog=read(OUT/'catalog-2022.json')['editions'];by=defaultdict(list)
    for i,s in enumerate(doc['sources']):by[s['curri']].append((i,s))
    plans=[];reviews=[];excluded=[]
    for curri,versions in by.items():
        sample=versions[0][1];title=sample['title'];grade=sample['grade']
        if title.startswith('사회과 부도'):
            excluded.append(dict(curri=curri,title=title,reason='supplementary-atlas'));continue
        m=re.fullmatch(r'(수학|사회|과학|영어|음악|미술|체육|실과)\((.+)\)',title)
        if m:
            subject,author=m.groups()
            matches=[e for e in catalog if (e['publisher'] or '').startswith('천재') and e['subject']==subject and e['leadAuthor']==author and grade in e['grades']]
        else:
            subject='국어' if title.startswith('국어') else title if title in ['도덕','수학'] else '통합교과'
            matches=[e for e in catalog if e['approvalType']=='국정' and e['subject']==subject and grade in e['grades']]
        assert len(matches)==1,(title,grade,matches);edition=matches[0]
        annual=subject in ['영어','음악','미술','체육','실과']
        if annual:
            assert len(versions)==2 and signature(versions[0][1])==signature(versions[1][1]),('annual mismatch',curri)
            selected=[versions[0]]
        else:selected=versions
        for si,s in selected:
            semester=None if annual else s['semester'];pid='tselpa-'+curri+('' if annual else '-s'+str(semester))
            lessons=[];supplements=[];issues=[];source_row=0
            for gi,g in enumerate(s['groups']):
                if '[보완]' in g['unit'] or '학습 보완' in g['unit']:
                    supplements.append(dict(unit=g['unit'],rows=len(g['lessons']),sourceFile=g['sourceFile']));source_row+=len(g['lessons']);continue
                group_lessons=[]
                for li,l in enumerate(g['lessons']):
                    raw=l['raw'];source_row+=1;pm=re.match(r'^\[(\d+)(?:\s*[~～-]\s*(\d+))?차시\]\s*',raw)
                    numbers=list(range(int(pm[1]),int(pm[2] or pm[1])+1)) if pm else None
                    if pm:assert numbers,(pid,raw)
                    topic=raw[pm.end():] if pm else raw
                    pages_match=re.search(r'\(([^()]*(?:쪽|p))\)\s*$',topic)
                    pages=pages_match[1].strip() if pages_match else None
                    if pages_match:topic=topic[:pages_match.start()].strip()
                    group_lessons.append(dict(id=f'{pid}-c{l["id"]}' if l['id'] else f'{pid}-g{gi+1}-r{li+1}',
                        sourceRow=source_row,sourcePointer=f'/sources/{si}/groups/{gi}/lessons/{li}/raw',
                        sourceCells=[g['unit'],raw],originalSourceFile=g['sourceFile'],originalSha256=g['sha256'],sourceUrl=g['url'],
                        sequence=len(lessons)+len(group_lessons)+1,semester=semester,unit=g['unit'].strip(),subunit=None,
                        topic=topic,periodText=pm[0].strip() if pm else None,periodNumbers=numbers,
                        suggestedPeriods=len(numbers) if numbers else None,periodBasis='unit' if numbers else 'unspecified',
                        pages=pages,supplementaryPages=None,materials=None,activities=None,standardCodes=[],
                        reviewStatus='source-period-unspecified' if numbers is None else None))
                count=Counter(n for l in group_lessons for n in l['periodNumbers'] or [])
                overlaps={n for n,c in count.items() if c>1}
                if overlaps:
                    issues.append(dict(unit=g['unit'],type='source-period-overlap',periods=sorted(overlaps)))
                    for l in group_lessons:
                        if overlaps.intersection(l['periodNumbers'] or []):l['suggestedPeriods']=None;l['reviewStatus']='source-period-overlap'
                if count:
                    gaps=sorted(set(range(1,max(count)+1))-set(count))
                    if gaps:issues.append(dict(unit=g['unit'],type='source-period-gaps',periods=gaps))
                lessons.extend(group_lessons)
            plans.append(dict(id=pid,editionId=edition['id'],curriculum='2022',publisher=edition['publisher'] or '천재교육',
                sourcePublisher='T셀파',grade=grade,semester=semester,subject=subject,bookTitle=title,
                sourceId=curri,sourceUrl=s['url'],sourceFile=src.name,sha256=sha,originalSourceFile=s['source']['sourceFile'],
                originalSha256=s['source']['sha256'],alternateSources=[v['source'] for _,v in versions[1:]] if annual else [],
                format='official-online-outline',curriculumVerification='official-page-2022-badge-and-catalog',
                coverageScope='listed-core-online-lessons-excludes-explicit-supplements',scheduleCompleteness='annual-file-comparison-pending',lessons=lessons))
            reviews.append(dict(planId=pid,grade=grade,subject=subject,title=title,semester=semester,
                rows=len(lessons),observedPeriods=sum(l['suggestedPeriods'] or 0 for l in lessons),
                unknownPeriodRows=sum(l['suggestedPeriods'] is None for l in lessons),issues=issues,supplementaryGroups=supplements,
                annualDeduplicated=annual))
    assert len({p['id'] for p in plans})==len(plans)
    ids=[l['id'] for p in plans for l in p['lessons']];assert len(set(ids))==len(ids)
    write(OUT/'pacing-tselpa-2022.json',dict(schemaVersion=1,plans=plans))
    write(REF/'tselpa-normalization-review.json',dict(schemaVersion=1,reviews=reviews,excluded=excluded))
    subprocess.run(['node',str(ROOT/'scripts/build-textbook-coverage.cjs')],check=True)
    print(json.dumps(dict(plans=len(plans),rows=len(ids),issues=sum(len(r['issues']) for r in reviews),unknownPeriodRows=sum(r['unknownPeriodRows'] for r in reviews))))
if __name__=='__main__':run()
