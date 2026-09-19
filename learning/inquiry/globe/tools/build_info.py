"""설명 창 자료(data/info.json)와 사진(photos/<id>.webp)을 만든다.

    python tools/build_info.py                 # art-source/photos 의 원본으로 사진만 다시 만든다
    python tools/build_info.py --merge <폴더>   # <폴더>/out-*.json 의 글을 info.json 에 합치고(check-*.json 의 고친 글을 그 위에 덮고) 사진을 만든다

info.json 이 설명 글의 원본이다(글을 고칠 땐 이 파일을 고친다).
사진 원본은 위키미디어 공용에서 받은 것으로, 앱 폴더 art-source/photos/<id>.jpg|png 에 둔다(저장소에는 올리지 않음).
설명 창 사진 틀은 3:2. 가로로 넓은 사진은 3:2로 자르되 위쪽 1/3에 무게를 두고,
가로세로 비가 1.2보다 좁은 사진은 자르지 않고 통째로 담은 뒤 남는 자리를 흐린 같은 사진으로 메운다.
"""

import argparse
import json
import pathlib
import urllib.parse

from PIL import Image, ImageFilter, ImageOps

ROOT = pathlib.Path(__file__).resolve().parents[1]
INFO = ROOT / "data/info.json"
SOURCE = ROOT / "art-source/photos"
PHOTOS = ROOT / "photos"
SIZE = (720, 480)
QUALITY = 72
FREE = ("CC0", "PUBLIC DOMAIN", "PD", "CC BY", "CC-BY", "ATTRIBUTION", "FAL", "FREE ART")
NOT_FREE = ("NC", "ND", "FAIR USE")


def free_license(name):
    upper = (name or "").upper()
    return upper.startswith(FREE) and not any(bad in upper.replace("-", " ").split() for bad in NOT_FREE)


def fit(image):
    image = ImageOps.exif_transpose(image).convert("RGB")
    width, height = image.size
    target = SIZE[0] / SIZE[1]
    if width / height >= 1.2:
        # 3:2로 자른다. 세로로 남으면 위쪽 1/3 지점을 중심으로.
        if width / height > target:
            new_width = round(height * target)
            left = (width - new_width) // 2
            box = (left, 0, left + new_width, height)
        else:
            new_height = round(width / target)
            top = max(0, min(height - new_height, round(height / 3 - new_height / 3)))
            box = (0, top, width, top + new_height)
        return image.crop(box).resize(SIZE, Image.LANCZOS)
    # 세로 사진: 흐린 배경 위에 통째로.
    back = ImageOps.fit(image, SIZE, Image.LANCZOS).filter(ImageFilter.GaussianBlur(18))
    back = Image.blend(back, Image.new("RGB", SIZE, (12, 20, 32)), 0.35)
    scale = SIZE[1] / height
    front = image.resize((max(1, round(width * scale)), SIZE[1]), Image.LANCZOS)
    back.paste(front, ((SIZE[0] - front.width) // 2, 0))
    return back


def source_of(entry_id):
    for ext in (".jpg", ".jpeg", ".png", ".webp", ".JPG", ".PNG"):
        file = SOURCE / f"{entry_id}{ext}"
        if file.exists():
            return file
    return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--merge")
    args = parser.parse_args()

    info = json.loads(INFO.read_text(encoding="utf-8")) if INFO.exists() else {}
    if args.merge:
        for file in sorted(pathlib.Path(args.merge).glob("out-*.json")):
            try:
                entries = json.loads(file.read_text(encoding="utf-8"))
            except json.JSONDecodeError as error:
                print(f"  건너뜀(깨진 JSON): {file.name} {error}")
                continue
            for entry in entries:
                key = entry.pop("key")
                old = info.get(key, {})
                info[key] = {**old, **entry}
            print(f"  합침: {file.name} {len(entries)}개")
        # 사실 확인에서 고친 글(check-*.json)을 글쓴이 원본 위에 덮는다. 사진은 그대로.
        for file in sorted(pathlib.Path(args.merge).glob("check-*.json")):
            try:
                fixes = json.loads(file.read_text(encoding="utf-8"))
            except json.JSONDecodeError as error:
                print(f"  건너뜀(깨진 JSON): {file.name} {error}")
                continue
            for fix in fixes:
                if fix.get("key") in info:
                    info[fix["key"]].update({field: fix[field] for field in ("where", "text", "exam") if fix.get(field)})
            print(f"  사실 확인 반영: {file.name} {len(fixes)}개")

    PHOTOS.mkdir(exist_ok=True)
    made = missing = refused = 0
    for key, entry in info.items():
        photo = entry.get("photo")
        if not photo:
            continue
        if not free_license(photo.get("license")):
            print(f"  이용 조건이 자유롭지 않아 뺌: {key} ({photo.get('license')})")
            entry["photo"] = None
            refused += 1
            continue
        out = PHOTOS / f"{entry['id']}.webp"
        source = source_of(entry["id"])
        if source and (not out.exists() or out.stat().st_mtime < source.stat().st_mtime):
            fit(Image.open(source)).save(out, "WEBP", quality=QUALITY, method=6)
            made += 1
        if not out.exists():
            print(f"  사진 원본 없음: {key}")
            entry["photo"] = None
            missing += 1
            continue
        photo["src"] = f"photos/{entry['id']}.webp"
        photo["page"] = "https://commons.wikimedia.org/wiki/File:" + urllib.parse.quote(photo["file"].replace(" ", "_"))

    # 어느 설명에도 쓰이지 않는 사진은 지운다.
    used = {entry["photo"]["src"].split("/")[-1] for entry in info.values() if entry.get("photo")}
    for file in PHOTOS.glob("*.webp"):
        if file.name not in used:
            file.unlink()

    INFO.write_text(json.dumps(info, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    total = sum(f.stat().st_size for f in PHOTOS.glob("*.webp"))
    with_photo = sum(1 for e in info.values() if e.get("photo"))
    print(f"설명 {len(info)}개(사진 {with_photo}장, 새로 만든 사진 {made}장, 원본 없음 {missing}, 조건 탈락 {refused}), 사진 {total / 1024 / 1024:.1f}MB, info.json {INFO.stat().st_size / 1024:.0f}KB")


if __name__ == "__main__":
    main()
