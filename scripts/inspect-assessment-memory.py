"""Inspect table structure in an authorized official document; never persist payloads."""
import sys,io,json,urllib.request,xml.etree.ElementTree as ET,logging
logging.disable(logging.CRITICAL)
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'references/textbooks/수집작업/python-packages'))
from hwp5.xmlmodel import Hwp5File
from hwp5.storage.ole import OleStorage
m=json.loads((ROOT/'references/textbooks/icream-browser-assessments/6-2.json').read_text(encoding='utf-8'))
f=next(r for r in m['rows'] if r['subject']=='수학')['files'][0]
payload=urllib.request.urlopen(f['url'],timeout=45).read()
doc=Hwp5File(OleStorage(io.BytesIO(payload))); out=io.BytesIO()
try:doc.xmlevents().dump(out)
finally:doc.close()
root=ET.fromstring(out.getvalue())
for ti,t in enumerate(root.findall('.//TableBody')[:1]):
 print('TABLE',ti,t.attrib)
 for r in t.findall('./TableRow')[2:5]:
  print([(c.get('row'),c.get('col'),c.get('colspan'),' '.join(''.join(p.itertext()) for p in c.findall('./Paragraph'))[:80]) for c in r.findall('./TableCell')])
