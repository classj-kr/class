from pathlib import Path
from tempfile import NamedTemporaryFile
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parent.parent


def original_font(assets, name):
    return ROOT / 'references/fonts' / assets.name / name


def write_install_zip(ttf, assets):
    archive = assets / ttf.with_suffix('.zip').name
    original = ttf.read_bytes()
    with NamedTemporaryFile(dir=assets, suffix='.zip.tmp', delete=False) as stream:
        temporary = Path(stream.name)
    try:
        with ZipFile(temporary, 'w') as bundle:
            bundle.writestr(ZipInfo(ttf.name), original, compress_type=ZIP_DEFLATED, compresslevel=9)
        with ZipFile(temporary) as bundle:
            assert bundle.read(ttf.name) == original
        temporary.replace(archive)
    finally:
        temporary.unlink(missing_ok=True)
    return archive


def load_install_font(assets, name):
    original = original_font(assets, name)
    if not original.is_file():
        with ZipFile(assets / Path(name).with_suffix('.zip')) as bundle:
            data = bundle.read(name)
        original.parent.mkdir(parents=True, exist_ok=True)
        with original.open('xb') as stream:
            stream.write(data)
    return original
