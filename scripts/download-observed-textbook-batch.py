"""Save an exact observed document manifest, reporting completions immediately."""
import argparse, concurrent.futures, importlib.util, json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser()
p.add_argument('manifest')
p.add_argument('--workers',type=int,default=6)
args=p.parse_args()
spec=importlib.util.spec_from_file_location('publisher_files',ROOT/'scripts/collect-publisher-files.py')
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
sources=json.loads(Path(args.manifest).read_text(encoding='utf8'))
with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
    jobs={pool.submit(module.collect,s):s for s in sources}
    for job in concurrent.futures.as_completed(jobs):
        try:
            row=job.result()
        except Exception as e:
            row={'title':jobs[job]['title'],'status':'failed','error':str(e)}
        print(json.dumps(row,ensure_ascii=False),flush=True)
