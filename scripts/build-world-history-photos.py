"""Build reviewed textbook images and short source excerpts for map learning."""
import hashlib
import io
import json
import re
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SPECS = ROOT / 'scripts/world-history-photos.json'
OUT = ROOT / 'learning/inquiry/globe/history/photos'


def build():
    specs = json.loads(SPECS.read_text(encoding='utf-8'))
    audit = json.loads((ROOT / 'docs/world-history-content-audit.json').read_text(encoding='utf-8'))
    sources = {s['id']: s for s in audit['sources']}
    documents = {}
    OUT.mkdir(parents=True, exist_ok=True)
    report, published = [], []
    for spec in specs:
        # Every material selects its reviewed source explicitly. Never silently
        # extract a same-numbered page/object from a default publisher's PDF.
        source = sources[spec['sourceId']]
        if source['id'] not in documents:
            source_path = ROOT / source['path']
            digest = hashlib.sha256(source_path.read_bytes()).hexdigest()
            assert digest == source['sha256'], f"Source changed; review objects again: {source['id']}"
            documents[source['id']] = pymupdf.open(source_path)
        doc = documents[source['id']]
        source_hash = source['sha256']
        page = doc[spec['page'] - 1]
        if spec.get('type') == 'document':
            normalize = lambda value: re.sub(r'[\s\x00-\x1f]+', '', value)
            source_text = normalize(page.get_text())
            assert spec.get('excerpts'), f"Missing excerpt: {spec['id']}"
            for excerpt in spec['excerpts']:
                assert normalize(excerpt['text']) in source_text, f"Excerpt differs from source: {spec['id']}"
            entry = {k: v for k, v in spec.items() if k not in ['page', 'sourceId']}
            entry['credit'] = f"{source['creditTitle']}, PDF {spec['page']}쪽 수록 사료"
            published.append(entry)
            report.append(dict(id=spec['id'], type='document', sourceId=source['id'], source=source['path'],
                               pdfPage=spec['page'], sourceSha256=source_hash,
                               excerpts=spec['excerpts'], exactNormalizedExcerptMatch=True))
            print(spec['id'], 'source excerpt verified', flush=True)
            continue
        info = next(i for i in page.get_image_info(xrefs=True) if i['xref'] == spec['xref'])
        extracted = doc.extract_image(spec['xref'])
        pix = pymupdf.Pixmap(doc, spec['xref'])
        if pix.colorspace.n != 3:
            pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
        image = Image.frombytes('RGBA' if pix.alpha else 'RGB', (pix.width, pix.height), pix.samples)
        mask_size = None
        if extracted.get('smask', 0):
            mask = pymupdf.Pixmap(doc, extracted['smask'])
            mask_size = [mask.width, mask.height]
            # PDF soft masks can use a different resolution from the color
            # image; they occupy the same bounds when the PDF is rendered.
            if (mask.width, mask.height) == image.size:
                masked = pymupdf.Pixmap(pix, mask)
                image = Image.frombytes('RGBA', (masked.width, masked.height), masked.samples)
            else:
                alpha = Image.frombytes('L', (mask.width, mask.height), mask.samples)
                alpha = alpha.resize(image.size, Image.Resampling.LANCZOS)
                image.putalpha(alpha)
        image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        target = OUT / f"{spec['id']}.webp"
        image.save(target, 'WEBP', lossless=True, exact=True, method=6)
        decoded = Image.open(io.BytesIO(target.read_bytes())).convert(image.mode)
        assert decoded.size == image.size and decoded.tobytes() == image.tobytes()
        entry = {k: v for k, v in spec.items() if k not in ['page', 'xref', 'sourceId']}
        entry.update(src=f"photos/{spec['id']}.webp", width=image.width, height=image.height,
                     credit=f"{source['creditTitle']}, PDF {spec['page']}쪽")
        published.append(entry)
        report.append(dict(id=spec['id'], sourceId=source['id'], source=source['path'], pdfPage=spec['page'], xref=spec['xref'],
                           sourceBBox=list(info['bbox']), sourceSha256=source_hash,
                           sourcePixels=[info['width'], info['height']], pixels=list(image.size),
                           alpha=image.mode == 'RGBA', sourceMaskPixels=mask_size,
                           imageSha256=hashlib.sha256(target.read_bytes()).hexdigest(),
                           losslessDecodedEqual=True))
        print(spec['id'], image.size, flush=True)
    for doc in documents.values():
        doc.close()
    (OUT.parent / 'photos.mjs').write_text(
        '// Reviewed textbook images and primary-source excerpts. Built by scripts/build-world-history-photos.py.\n'
        'export const PHOTOS = ' + json.dumps(published, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    (ROOT / 'docs/world-history-photo-sources.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


if __name__ == '__main__':
    build()
