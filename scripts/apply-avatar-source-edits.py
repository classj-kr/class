"""Apply visually selected avatar source edits, retaining originals and hashes.

Input is a JSON mapping of avatar id to the reviewed candidate suffix.
This only integrates finished art; it never grants a 3D visual approval.
"""
from pathlib import Path
import argparse
import hashlib
import json
import shutil
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / 'apps/classtools/assets/avatars'
EDITS = ROOT / 'outputs/avatar-lab/source-edits'
REVIEW = ROOT / 'apps/avatar-lab/source-review.json'

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def apply(selection):
    index = json.loads((ROOT / 'apps/avatar-lab/collection-index.json').read_text(encoding='utf-8'))
    previous = json.loads(REVIEW.read_text(encoding='utf-8')) if REVIEW.exists() else {}
    records = {row['id']: row for row in previous.get('avatars', [])}
    for row in index['avatars']:
        records.setdefault(row['id'], {'id': row['id'], 'name': row['name'],
            'sourceReview': 'contact_sheet_screened', 'detailedReview': 'pending',
            'modelReview': 'pending'})
    bounds_path = ROOT / 'apps/avatar-lab/original-bounds.json'
    bounds = json.loads(bounds_path.read_text(encoding='utf-8'))
    for key, suffix in selection.items():
        if key not in records or '/' in suffix or '\\' in suffix:
            raise ValueError(f'Unknown avatar or invalid candidate: {key}: {suffix}')
        candidate = EDITS / f'{key}-{suffix}.webp'
        target = SOURCES / f'{key}.webp'
        im = Image.open(candidate).convert('RGBA')
        if im.width != im.height or im.getchannel('A').getextrema() != (0,255):
            raise ValueError(f'Expected square transparent artwork: {candidate}')
        im = im.resize((640,640),Image.Resampling.LANCZOS)
        box = im.getchannel('A').point(lambda a: 255 if a > 120 else 0).getbbox()
        if not box or box[2]-box[0]<100 or box[3]-box[1]<200:
            raise ValueError(f'Invalid visible silhouette: {candidate}')
        temp = target.with_name(target.stem + '.source-edit.webp')
        im.save(temp,'WEBP',lossless=True,exact=True,method=6)
        decoded = Image.open(temp).convert('RGBA')
        if decoded.size != (640,640) or decoded.tobytes() != im.tobytes():
            raise ValueError(f'Lossless verification failed: {temp}')
        backup = EDITS / 'originals' / target.name
        backup.parent.mkdir(parents=True,exist_ok=True)
        if not backup.exists():
            shutil.copy2(target,backup)
        temp.replace(target)
        bounds[key] = list(box)
        records[key].update(sourceReview='revised_applied', detailedReview='reviewed_original_and_avatar_size',
            candidate=candidate.relative_to(ROOT).as_posix(),
            prompt=(EDITS/f'{key}-{suffix}-prompt.txt').relative_to(ROOT).as_posix(),
            backup=backup.relative_to(ROOT).as_posix(), originalSha256=sha(backup),
            sourceSha256=sha(target), size=[640,640], visibleBounds=list(box),
            modelReview='needs_rebuild_and_visual_review')
        print(key, 'applied', box)
    REVIEW.write_text(json.dumps({'scope':'Source illustration review; not a 3D quality approval',
        'avatars':[records[row['id']] for row in index['avatars']]},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    bounds_path.write_text(json.dumps(bounds,separators=(',',':'))+'\n',encoding='utf-8')

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('selection',type=Path)
    args=parser.parse_args()
    apply(json.loads(args.selection.read_text(encoding='utf-8')))
