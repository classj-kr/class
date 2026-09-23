const fs=require('node:fs'),p='.tmp/voyage-mission-audit/check.cjs';
let s=fs.readFileSync(p,'utf8');
s=s.replace("await page.click('#placeStudyClose');await page.click('#discoveryActionBtn');await status('1/3');","fs.writeFileSync(path.join(out,'lost-ack.json'),JSON.stringify(lostAck,null,2));await page.click('#placeStudyClose');await page.waitForFunction('!discoveryActionBtn.disabled');await page.click('#discoveryActionBtn');await status('1/3');");
fs.writeFileSync(p,s);
