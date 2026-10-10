"""Regression checks for Windows collection paths and URL escaping."""
import importlib.util
import json
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location(
    'collection_migration', Path(__file__).resolve().parents[1]
    / 'scripts/archive/maintenance/consolidate-textbook-storage.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def rewrite(text, old, new):
    for left, right in sorted(module.variants(old, new), key=lambda pair: -len(pair[0])):
        text = text.replace(left, right)
    return text


class CollectionPaths(unittest.TestCase):
    def test_ascii_source_keeps_plain_filesystem_destination(self):
        old, new = 'tmp/textbook-research', 'references/textbooks/수집작업'
        self.assertEqual(rewrite(old + '/file.pdf', old, new), new + '/file.pdf')

    def test_windows_json_paths_remain_valid(self):
        for old, new in (module.MAPPINGS | module.OTHER_SOURCES).items():
            old_path = 'E:\\webprojects\\class\\' + old.replace('/', '\\') + '\\file.pdf'
            expected = 'E:\\webprojects\\class\\' + new.replace('/', '\\') + '\\file.pdf'
            for ascii_only in (True, False):
                encoded = json.dumps({'path': old_path}, ensure_ascii=ascii_only)
                self.assertEqual(json.loads(rewrite(encoded, old, new))['path'], expected)

    def test_encoded_korean_url_keeps_url_encoding(self):
        old, new = 'tmp/초등교과서_수집', 'references/textbooks/초등'
        self.assertEqual(rewrite(module.quote(old) + '/file.pdf', old, new),
                         module.quote(new) + '/file.pdf')


if __name__ == '__main__':
    unittest.main()
