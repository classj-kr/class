const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'digital-inquiry.js',s=>replace(s,"stopAudio('분석을 준비하고 있습니다.');const token=epoch;","stopAudio('분석을 준비하고 있습니다.');const token=epoch;at('[data-audio-stop]').disabled=false;"));
edit(lab+'exam-scope.js',s=>replace(s,'digital-inquiry.js?v=1','digital-inquiry.js?v=2'));
edit('tests/science-digital-inquiry.test.cjs',s=>replace(s,"await page.locator('[data-audio-stop]').evaluate(b=>b.click());await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));", "await page.locator('[data-audio-stop]').click();"));
apply();
