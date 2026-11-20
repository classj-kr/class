import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const data = require("../learning/literacy-numeracy/classical-chinese-idioms/idioms-data.js");
const app = fs.readFileSync(new URL("../learning/literacy-numeracy/classical-chinese-idioms/app.js", import.meta.url), "utf8");
const assetDirectory = new URL("../learning/literacy-numeracy/classical-chinese-idioms/assets/idioms-v2/", import.meta.url);

test("모든 한자성어가 같은 이름의 새 삽화를 가진다", () => {
    const mappings = [...app.matchAll(/^\s*([a-z0-9]+): "assets\/idioms-v2\/([a-z0-9]+)\.webp"/gm)];
    const mapped = new Map(mappings.map((match) => [match[1], match[2]]));
    const files = new Set(fs.readdirSync(assetDirectory).filter((file) => file.endsWith(".webp")).map((file) => path.basename(file, ".webp")));
    const ids = new Set(data.map((idiom) => idiom.id));

    assert.equal(mapped.size, data.length);
    assert.equal(files.size, data.length);
    ids.forEach((id) => {
        assert.equal(mapped.get(id), id, `${id}의 삽화 경로가 일치해야 한다`);
        assert.ok(files.has(id), `${id}.webp 파일이 있어야 한다`);
    });
    assert.deepEqual([...files].filter((id) => !ids.has(id)), []);
});
