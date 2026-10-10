"""Download officially observed PDF links while their manifest is being filled."""
import concurrent.futures, importlib.util, json, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('publisher_files', ROOT/'scripts/collect-publisher-files.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
manifest = ROOT/'references/textbooks/secondary-miraen-high-pdfs.json'
finished = ROOT/'references/textbooks/수집기록/기존작업/miraen-high-pdf-manifest-finished.json'
results = ROOT/'references/textbooks/수집기록/기존작업/miraen-high-pdf-queue-results.json'
seen, pending, rows = set(), {}, []
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    while True:
        try:
            sources = json.loads(manifest.read_text(encoding='utf8'))
        except (ValueError, OSError):
            sources = []
        for source in sources:
            key = (source['category'], source['title'], source['url'])
            if key not in seen:
                seen.add(key)
                pending[pool.submit(module.collect, source)] = source['title']
        for job in list(pending):
            if job.done():
                try:
                    row = job.result()
                except Exception as error:
                    row = {'title': pending[job], 'status': 'failed', 'error': str(error)}
                rows.append(row)
                print(json.dumps(row, ensure_ascii=False), flush=True)
                del pending[job]
                results.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf8')
        if finished.exists() and not pending:
            break
        time.sleep(2)
print(json.dumps({'complete': len(rows), 'failed': sum(r['status']=='failed' for r in rows)}), flush=True)
