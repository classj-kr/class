"""Extract factual coordinates/scores, not executable VlabON code.
Run explicitly to update the archived comparison set. Scores/poses are matched by
the source's protein, molecule and pose indices. They are not trajectories.
"""
import csv, hashlib, io, json, pathlib, urllib.request, xml.etree.ElementTree as ET
ROOT=pathlib.Path(__file__).resolve().parents[1]
DEST=ROOT/'learning/inquiry/science-lab/protein-interaction/data'
DEST.mkdir(parents=True,exist_ok=True)
BASE='https://vlabon.re.kr/play/contents/protein_interaction/resources4/'
provenance=[]
def get(url):
    b=urllib.request.urlopen(url,timeout=40).read()
    provenance.append(dict(url=url,sha256=hashlib.sha256(b).hexdigest(),bytes=len(b)))
    return b
energies=ET.fromstring(get(BASE+'content4_protein.xml'))
csvrows=list(csv.reader(io.StringIO(get(BASE+'content4_molelist.csv').decode('utf-8-sig'))))
ids=[6,17,34,47,48,59]
names={6:'아픽사반',17:'비포나졸',34:'플루코나졸',47:'이부프로펜',48:'이마티닙',59:'미노사이클린'}
compounds=[dict(id=int(r[0]),name=names[int(r[0])],english=r[2],formula=r[3].strip())for r in csvrows[1:] if r and r[0].isdigit() and int(r[0]) in ids]
targets=[dict(id=1,pdb='4EY7',name='아세틸콜린에스터레이스',role='아세틸콜린을 분해하여 신경 신호 전달을 조절하는 효소',context='알츠하이머병 관련 연구'),dict(id=5,pdb='1T46',name='KIT 키네이스',role='단백질을 인산화하여 세포의 성장 신호를 전달하는 효소',context='세포 증식과 종양 관련 연구'),dict(id=8,pdb='4J3J',name='DPP-4',role='인크레틴을 비롯한 펩타이드를 분해하는 효소',context='혈당 조절 관련 연구')]
for t in targets:
    text=get(f'https://files.rcsb.org/download/{t["pdb"]}.pdb').decode('ascii')
    chains={};atoms=[];previous={}
    for line in text.splitlines():
        if not line.startswith('ATOM  ') or line[16] not in (' ','A'):continue
        xyz=[float(line[30:38]),float(line[38:46]),float(line[46:54])]
        atoms.append(xyz)
        if line[12:16].strip()=='CA':
            chain=line[21];seq=int(line[22:26]);parts=chains.setdefault(chain,[[]])
            if chain in previous and (seq-previous[chain][0]>1 or sum((xyz[i]-previous[chain][1][i])**2 for i in range(3))>25):parts.append([])
            parts[-1].append(xyz);previous[chain]=(seq,xyz)
    poses={}
    for cid in ids:
        frames=json.loads(get(BASE+f'moleAni/pdb_{t["id"]}_{cid}.json'))
        scores=[float(k.get('value'))for k in energies.find(f'i[@index="{t["id"]}"]/j[@index="{cid}"]')]
        assert len(frames)==len(scores)==20
        pose=[]
        for frame,score in zip(frames,scores):
            m=frame['mole'];idmap={a['id']:i for i,a in enumerate(m['atom'])}
            pose.append(dict(score=score,atoms=[[a['defID'],*a['position']]for a in m['atom']],bonds=[[idmap[b['atomA']],idmap[b['atomB']],b['type']]for b in m['bond']]))
        poses[str(cid)]=pose
    out=dict(target=t,chains=chains,compounds=compounds,poses=poses)
    raw=json.dumps(out,ensure_ascii=False,separators=(',',':')).encode('utf8')
    (DEST/f'{t["id"]}.json').write_bytes(raw)
    t['file']=f'{t["id"]}.json';t['sha256']=hashlib.sha256(raw).hexdigest()
    print(t['name'],len(raw),'bytes',sum(len(part)for chain in chains.values()for part in chain),'CA positions')
meta=dict(targets=targets,compounds=compounds,scoreKind='Source-provided relative docking energies; unit not specified by the original UI. Do not label as measured binding free energy or clinical efficacy.',method='20 precomputed poses per pair, in original index order. No interpolation between poses, no client-side docking, no arbitrary generated energies. Protein display uses PDB C-alpha trace; crystallographic ligands and waters omitted.',sources=provenance,sourcePage='https://vlabon.re.kr/contents/protein_interaction')
(DEST/'provenance.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(DEST.parent.parent/'docking-data.js').write_text('(function(r){const data='+json.dumps(dict(targets=targets,compounds=compounds),ensure_ascii=False,separators=(',',':'))+';if(typeof module!=="undefined")module.exports=data;else r.DockingData=data;})(typeof window==="undefined"?globalThis:window);\n',encoding='utf8')
