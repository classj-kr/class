// 크롬 웹스토어에 올릴 zip 을 만든다.  실행: node classtools/neis-fill/pack.mjs [내보낼 폴더]
// 확장에 필요한 파일만 넣고(모의 화면·설명서·이 대본은 뺀다), manifest.json 이 zip 맨 위에 오게 한다.
// 윈도의 Compress-Archive 는 경로에 역슬래시를 써서 웹스토어가 manifest 를 못 찾는 일이 있어 직접 만든다.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';
import { homedir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const FILES = ['manifest.json', 'popup.html', 'popup.js', 'parse.js', 'page.js', 'icon16.png', 'icon48.png', 'icon128.png'];

const manifest = JSON.parse(readFileSync(join(here, 'manifest.json'), 'utf8'));
const pageVersion = (readFileSync(join(here, 'page.js'), 'utf8').match(/const VERSION = '([^']+)'/) || [])[1];
if (!pageVersion) console.warn('page.js 에서 VERSION 을 못 읽었습니다.');
else if (pageVersion !== manifest.version) console.warn(`주의: manifest ${manifest.version} 과 page.js VERSION ${pageVersion} 이 다릅니다. page.js 를 고쳤다면 둘을 같이 올리세요.`);

function crc32(buf) {
    let crc = 0xffffffff;
    for (let n = 0; n < buf.length; n += 1) {
        let c = (crc ^ buf[n]) & 0xff;
        for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        crc = (crc >>> 8) ^ c;
    }
    return (crc ^ 0xffffffff) >>> 0;
}

// DOS 시각(zip 규격). 초는 2초 단위.
function dosTime(d) {
    const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
    const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    return { time, date };
}

function u16(n) { const b = Buffer.alloc(2); b.writeUInt16LE(n); return b; }
function u32(n) { const b = Buffer.alloc(4); b.writeUInt32LE(n >>> 0); return b; }

const now = dosTime(new Date());
const locals = [];
const centrals = [];
let offset = 0;
for (const name of FILES) {
    const data = readFileSync(join(here, name));
    const packed = deflateRawSync(data, { level: 9 });
    const useDeflate = packed.length < data.length;
    const body = useDeflate ? packed : data;
    const method = useDeflate ? 8 : 0;
    const crc = crc32(data);
    const fname = Buffer.from(name, 'utf8');
    const flags = 0x0800;   // 이름은 UTF-8
    const local = Buffer.concat([u32(0x04034b50), u16(20), u16(flags), u16(method), u16(now.time), u16(now.date), u32(crc), u32(body.length), u32(data.length), u16(fname.length), u16(0), fname, body]);
    const central = Buffer.concat([u32(0x02014b50), u16(20), u16(20), u16(flags), u16(method), u16(now.time), u16(now.date), u32(crc), u32(body.length), u32(data.length), u16(fname.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), fname]);
    locals.push(local);
    centrals.push(central);
    offset += local.length;
}
const centralStart = offset;
const centralBuf = Buffer.concat(centrals);
const end = Buffer.concat([u32(0x06054b50), u16(0), u16(0), u16(FILES.length), u16(FILES.length), u32(centralBuf.length), u32(centralStart), u16(0)]);
const zip = Buffer.concat([...locals, centralBuf, end]);

const outDir = process.argv[2] || join(homedir(), 'Downloads');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, `neis-paste-classj-${manifest.version}.zip`);
writeFileSync(outPath, zip);
console.log(`만들었습니다: ${outPath} (${zip.length} 바이트, 파일 ${FILES.length}개, 판 ${manifest.version})`);
