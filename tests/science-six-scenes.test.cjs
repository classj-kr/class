const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const root = path.resolve(__dirname, '../learning/inquiry/science-lab');
const output = path.resolve(process.env.SCIENCE_TEST_ARTIFACTS || path.resolve(__dirname, '../docs/science-lab-audit-2026-09-20'), 'six-redesign');
for (const engine of ['chromium', 'webkit']) test(`${engine}: six refined scenes preserve controls, process direction and visible state`, {timeout:180000}, async () => {
    const server = http.createServer((req, res) => {
        let f = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
        if (!f.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
        if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
        fs.readFile(f, (e, b) => { if (e) { res.writeHead(404).end(); return; } res.setHeader('Content-Type', {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[path.extname(f)] || 'application/octet-stream'); res.end(b); });
    });
    await new Promise(r => server.listen(0, '127.0.0.1', r));
    let browser; const errors = [], counts = {distill:0,weather:0,rock:0,earth:0,engine:0,fusion:0,layouts:0};
    fs.mkdirSync(output, {recursive:true});
    try {
        browser = await require('playwright')[engine].launch({headless:true, ...(engine === 'chromium' ? {executablePath:process.env.SCIENCE_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe'} : {})});
        const page = await browser.newPage({viewport:{width:1024,height:768},hasTouch:true});
        await page.route('**/*', r => new URL(r.request().url()).hostname === '127.0.0.1' ? r.continue() : r.abort());
        page.on('pageerror', e => errors.push(e.message));
        const open = slug => page.goto('http://127.0.0.1:' + server.address().port + '/' + slug + '/');
        const snap = name => page.locator('.experiment-layout').first().screenshot({path:path.join(output, 'verified-' + name + '-' + engine + '.png')});
        async function layout() {
            for (const width of [1366,1024,820,768]) {
                await page.setViewportSize({width,height:width>=1024?768:1024});
                await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
                const failures = await page.evaluate(() => {
                    const out = [];
                    if (document.documentElement.scrollWidth > innerWidth + 1) out.push('page overflow');
                    document.querySelectorAll('[data-scene-refined] text').forEach(e => {
                        const b = e.getBoundingClientRect(), s = e.ownerSVGElement.getBoundingClientRect();
                        if (!b.width || !b.height) return;
                        if (b.left < s.left - 2 || b.right > s.right + 2 || b.top < s.top - 2 || b.bottom > s.bottom + 2) out.push(e.textContent);
                    });
                    return out;
                });
                assert.deepEqual(failures, [], 'scene bounds at ' + width);
                counts.layouts++;
            }
            await page.setViewportSize({width:1024,height:768});
        }

        await open('separation-methods');
        await page.locator('[data-mode="distill"]').tap();
        for (const mix of ['saltWater','waterEthanol','seaWater']) for (const p of [0,20,50,100]) {
            await page.evaluate(([mix,p]) => { __sepModel.setMix(mix); __sepModel.setProgress(p); }, [mix,p]);
            const s = await page.evaluate(() => ({
                parts:[...document.querySelectorAll('[data-apparatus]')].map(e => e.dataset.apparatus),
                fill:+document.querySelector('[data-liquid="collected"]').getAttribute('height'),
                remaining:+document.querySelector('[data-liquid="remaining"]').getAttribute('y'),
                inlet:document.querySelector('[data-flow="coolant-in"] path').getAttribute('d'),
                outlet:document.querySelector('[data-flow="coolant-out"] path').getAttribute('d')
            }));
            assert.deepEqual(s.parts, ['flask','condenser','receiver']);
            assert.equal(s.fill > 0, p > 40, 'collection follows vaporization and cooling');
            assert.ok(s.remaining <= 145, 'do not depict boiling dry');
            assert.match(s.inlet, /^M307 163/); assert.match(s.outlet, /^M151 64/);
            counts.distill++;
        }
        await snap('distill'); await layout();

        await open('weather-watch');
        for (const sky of ['clear','part','cloud']) for (const hour of [0,5,9.5,14,19,24]) {
            const s = await page.evaluate(([sky,hour]) => {
                __weatherModel.setSky(sky); __weatherModel.setHour(hour);
                const a = __weatherModel.analyse(), group = document.querySelector('[data-scene-refined]');
                return {a,text:group.textContent,arrow:group.querySelector('[data-wind]')?.dataset.wind || 'calm',outlines:[...group.querySelectorAll('text')].map(e => getComputedStyle(e).stroke)};
            }, [sky,hour]);
            assert.equal(s.arrow, s.a.wind.dir);
            assert.ok(s.text.includes(s.a.sea.toFixed(1) + ' ℃') && s.text.includes(s.a.land.toFixed(1) + ' ℃'));
            assert.ok(s.outlines.every(x => x === 'none'), 'no white text outlines over sky');
            counts.weather++;
        }
        await snap('weather-night'); await page.evaluate(() => __weatherModel.setHour(14)); await snap('weather-day'); await layout();

        await open('minerals-rocks'); await page.locator('[data-mode="rock"]').tap();
        for (const silica of [45,60,75]) for (const time of [0,25,50,75,100]) {
            const s = await page.evaluate(([silica,time]) => {
                __rockModel.set('silica',silica); __rockModel.set('logT',time);
                const field = document.querySelector('[data-rock-field]'), grains = [...field.querySelectorAll('[data-crystal]')], uncovered = [];
                for(let y=48;y<162;y+=19) for(let x=271;x<439;x+=21) {
                    if(!grains.some(g=>g.isPointInFill(new DOMPoint(x,y)))) uncovered.push([x,y]);
                }
                return {uncovered,outline:getComputedStyle(document.querySelector('[data-field-outline]')).fill,mm:__rockModel.analyse().mm,field:+field.dataset.fieldMm,grains:grains.length};
            }, [silica,time]);
            assert.deepEqual(s.uncovered, [], 'crystals tile every part of the view');
            assert.equal(s.outline, 'none', 'border must not paint over crystals');
            assert.ok(s.field >= s.mm * 3, 'large crystals use a labelled wider field');
            counts.rock++;
        }
        await snap('rock-coarse'); await page.evaluate(() => __rockModel.set('logT',35)); await snap('rock-fine'); await layout();

        await open('earth-system');
        const phenomena = await page.evaluate(() => Object.keys(__earthModel.PHENOMENA));
        for (const id of phenomena) {
            const s = await page.evaluate(id => {
                __earthModel.set('phenomenon',id); __earthModel.runToEnd(.25);
                const a = __earthModel.analyse();
                return {expected:[a.ph.from,a.ph.to],shown:[...document.querySelectorAll('[data-sphere]')].map(e=>e.dataset.sphere),note:document.getElementById('dataNote').textContent};
            }, id);
            assert.deepEqual(s.shown, s.expected); assert.ok(!s.note.includes('체류 시간은 평균적'));
            counts.earth++;
        }
        await snap('earth'); await layout();

        await open('heat-engine');
        for (const mode of ['carnot','flow','pump']) {
            await page.locator('[data-mode="'+mode+'"]').tap();
            // Read actual available keys, not guessed values for temperature presets.
            const available = await page.locator('[data-pick] button').evaluateAll(es => es.map(e=>[e.closest('[data-pick]').dataset.pick,e.dataset.value]));
            for (const [key,value] of available) {
                await page.evaluate(([key,value]) => __engineModel.set(key,value), [key,value]);
                const tops = [];
                for (const p of [0,.25,.5,.75,1]) {
                    const s = await page.evaluate(p => {
                        __engineModel.setProgress(p); const a = __engineModel.analyse();
                        return {kind:a.kind,eta:a.eta,cop:a.cop,verdict:a.verdict,shares:[...document.querySelectorAll('[data-energy]')].map(e=>+e.dataset.share),valid:document.querySelector('[data-engine-valid]').dataset.engineValid,top:document.querySelector('[data-piston]')?.getAttribute('y')};
                    }, p);
                    assert.ok(Math.abs(s.shares[0]+s.shares[1]-1)<1e-10);
                    assert.ok(Math.abs(s.shares[0]-(mode==='pump'?1/s.cop:s.eta))<1e-10);
                    assert.equal(s.valid === 'false', mode === 'flow' && s.verdict !== 'ok');
                    tops.push(s.top); counts.engine++;
                }
                if (mode === 'carnot') assert.ok(new Set(tops).size > 2, 'piston follows expansion and compression');
                if (mode === 'flow' && value === 'e100') assert.equal(new Set(tops).size,1,'impossible engine must not run');
            }
            await snap('engine-'+mode); await layout();
        }

        await open('star-elements');
        for (const step of ['h','he']) for (const p of [0,.25,.6,1]) {
            const s = await page.evaluate(([step,p]) => {
                __starModel.set('step',step); __starModel.setProgress(p);
                const before=[...document.querySelectorAll('[data-fusion-side="before"]')], after=document.querySelector('[data-fusion-side="after"]');
                return {before:before.reduce((n,e)=>n+e.querySelectorAll('[data-nucleon]').length,0),after:after.querySelectorAll('[data-nucleon]').length,protons:after.querySelectorAll('[data-nucleon="proton"]').length,opacity:+after.getAttribute('opacity'),energy:!!document.querySelector('[data-fusion-energy]')};
            }, [step,p]);
            assert.equal(s.before,step==='h'?4:12); assert.equal(s.after,s.before); assert.equal(s.protons,step==='h'?2:6);
            assert.equal(s.opacity>0,p>.45); assert.equal(s.energy,p>.45);
            counts.fusion++;
        }
        await snap('fusion-he'); await page.evaluate(()=>{__starModel.set('step','h');__starModel.setProgress(1);}); await snap('fusion-h'); await layout();
        await page.locator('#resetBtn').tap(); assert.equal(await page.locator('[data-fusion-energy]').count(),0);
        assert.deepEqual(errors, []);
        fs.writeFileSync(path.join(output,'regression-'+engine+'.json'),JSON.stringify({engine,counts,errors},null,2));
    } finally { await browser?.close(); await new Promise(r=>server.close(r)); }
});
