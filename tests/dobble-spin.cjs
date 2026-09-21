// 도블 판이 돌 때 그림이 뒤집히지 않는지 재 본다.
// 판 겹이 돈 각도 + 그림이 돈 각도 = 처음 기울기 여야 한다.
const fs = require('fs');
const http = require('http');
const path = require('path');
const assert = require('assert/strict');
const pp = require('puppeteer-core');

const ROOT = path.join(__dirname, '..');
const PAGE = fs.readFileSync(path.join(ROOT, 'learning/games/dobble/dobble.html'), 'utf8');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const AVATARS = fs.readdirSync(path.join(ROOT, 'classtools/assets/avatars')).filter(f => f.endsWith('.webp'));
const CENTER = AVATARS.slice(0, 8);
const MINE = [AVATARS[0]].concat(AVATARS.slice(20, 27));

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/learning/games/dobble/dobble.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(PAGE);
  }
  // 아바타 그림은 진짜로 내어 준다. 눈으로도 확인해야 하니까.
  if (req.url.startsWith('/assets/avatars/')) {
    const file = path.join(ROOT, 'classtools/assets/avatars', decodeURIComponent(req.url.split('/').pop()));
    if (fs.existsSync(file)) {
      res.writeHead(200, { 'Content-Type': 'image/webp' });
      return res.end(fs.readFileSync(file));
    }
  }
  // 나머지(스크립트·소리)는 빈 것으로 돌려준다.
  res.writeHead(200, { 'Content-Type': 'application/javascript' });
  res.end('');
});

// 화면에 그려진 것에서 실제로 돌아간 각도를 읽는다.
const ANGLE_OF = `(el) => {
  const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
  return Math.round(Math.atan2(m.b, m.a) * 180 / Math.PI * 10) / 10;
}`;

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  let browser;
  try {
    browser = await pp.launch({
      executablePath: CHROME,
      headless: true,
      args: ['--no-first-run', '--no-default-browser-check']
    });
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}/learning/games/dobble/dobble.html`, { waitUntil: 'domcontentloaded' });

    // 두 판에 카드를 얹는다.
    await page.evaluate((c, m) => { window.__center = c; window.__mine = m; }, CENTER, MINE);
    await page.evaluate(() => {
      document.getElementById('entry').classList.add('hidden');
      // 카드가 실제로 자리를 차지해야 돌아간 자리를 잴 수 있다. 위로 올라가며 감춘 것을 다 연다.
      for (let el = document.getElementById('centerCard'); el; el = el.parentElement) {
        el.classList.remove('hidden');
        if (el.hasAttribute('hidden')) el.removeAttribute('hidden');
      }
      document.querySelector('.boards').style.width = '600px';
      const center = window.__center;
      const mine = window.__mine;
      const centerSpin = spinStyle(center, false);
      renderCard(document.getElementById('centerCard'), center, false, centerSpin);
      renderCard(document.getElementById('myCard'), mine, true, spinStyle(mine, !centerSpin.ccw));
    });

    const layers = await page.$$eval('.spinLayer', els => els.length);
    assert.equal(layers, 2, '도는 겹이 두 판에 다 생기지 않음: ' + layers);

    // 두 판이 서로 반대로 돌아야 한다.
    const dirs = await page.evaluate(() => Array.from(document.querySelectorAll('.spinLayer'))
      .map(el => el.classList.contains('ccw')));
    assert.notEqual(dirs[0], dirs[1], '두 판이 같은 쪽으로 돈다: ' + JSON.stringify(dirs));

    const read = async () => page.evaluate((angleOf) => {
      const at = eval(angleOf);
      const layer = document.querySelector('#centerCard .spinLayer');
      const img = document.querySelector('#centerCard .symbol img');
      const box = img.getBoundingClientRect();
      return {
        layer: at(layer),
        img: at(img),
        x: Math.round(box.left + box.width / 2),
        y: Math.round(box.top + box.height / 2)
      };
    }, ANGLE_OF);

    // 시작 자리
    await page.evaluate(() => document.getAnimations().forEach(a => { a.currentTime = 0; a.pause(); }));
    const first = await read();

    // 한 바퀴의 1/4 지점으로 시간을 옮긴다.
    const quarter = await page.evaluate(() => {
      const seconds = Number(getComputedStyle(document.querySelector('#centerCard .spinLayer'))
        .animationDuration.replace('s', ''));
      const t = seconds * 1000 / 4;
      document.getAnimations().forEach(a => { a.currentTime = t; });
      return seconds;
    });
    const later = await read();

    assert.ok(quarter >= 42 && quarter <= 68, '도는 시간이 42~68초 밖임: ' + quarter);

    // 1) 자리는 돌아야 한다
    const moved = Math.hypot(later.x - first.x, later.y - first.y);
    assert.ok(moved > 20, '그림이 제자리에 있음(돌지 않음). 움직인 거리: ' + moved + ' / 처음 ' + JSON.stringify(first) + ' 나중 ' + JSON.stringify(later));

    // 2) 그림이 선 각도는 그대로여야 한다
    const uprightFirst = ((first.layer + first.img) % 360 + 360) % 360;
    const uprightLater = ((later.layer + later.img) % 360 + 360) % 360;
    const drift = Math.min(Math.abs(uprightFirst - uprightLater), 360 - Math.abs(uprightFirst - uprightLater));
    assert.ok(drift < 1.5,
      '그림이 기울어짐(뒤집힘). 처음 ' + uprightFirst + '도 → 나중 ' + uprightLater + '도');

    console.log('도블 판 돌리기: 통과');
    console.log('  한 바퀴 ' + quarter + '초, 1/4 지점에서 그림이 ' + Math.round(moved) + 'px 옮겨 감');
    // 가운데 그림은 도는 축 위라 자리가 안 바뀐다. 대신 좌우로 기울며 왔다 갔다 해야 한다.
    const rock = await page.evaluate((angleOf) => {
      const at = eval(angleOf);
      const el = document.querySelector('#centerCard .rock');
      if (!el) return null;
      const anim = el.getAnimations()[0];
      if (!anim) return { missing: 'animation' };
      const duration = anim.effect.getTiming().duration;
      anim.currentTime = 0;
      const from = at(el);
      anim.currentTime = duration;
      const to = at(el);
      anim.currentTime = 0;
      return { from, to, seconds: duration / 1000 };
    }, ANGLE_OF);

    assert.ok(rock && !rock.missing, '가운데 그림이 기울며 움직이지 않음: ' + JSON.stringify(rock));
    assert.ok(Math.abs(rock.to - rock.from) >= 30,
      '기우는 폭이 너무 좁음: ' + rock.from + '도 ~ ' + rock.to + '도');
    assert.ok(Math.abs(rock.from) <= 35 && Math.abs(rock.to) <= 35,
      '다른 그림이 기운 만큼(35도)을 넘어섬: ' + rock.from + '도 ~ ' + rock.to + '도');
    assert.ok(rock.seconds >= 2.8 && rock.seconds <= 4.4,
      '왔다 갔다 하는 시간이 2.8~4.4초 밖임: ' + rock.seconds);

    if (process.env.SPIN_SHOT) {
      const shot = async (name) => {
        const boards = await page.$('.boards');
        await boards.screenshot({ path: process.env.SPIN_SHOT.replace('.png', '-' + name + '.png') });
      };
      await page.evaluate(() => document.getAnimations().forEach(a => { a.currentTime = 0; }));
      await shot('start');
      await page.evaluate(() => {
        const seconds = Number(getComputedStyle(document.querySelector('#centerCard .spinLayer')).animationDuration.replace('s', ''));
        document.getAnimations().forEach(a => { a.currentTime = seconds * 1000 / 4; });
      });
      await shot('quarter');
      // 가운데 그림이 가장 왼쪽으로, 가장 오른쪽으로 기운 순간
      for (const [name, at] of [['rock-left', 0], ['rock-right', 1]]) {
        await page.evaluate((ratio) => {
          document.querySelectorAll('.rock').forEach(el => {
            const anim = el.getAnimations()[0];
            if (anim) anim.currentTime = anim.effect.getTiming().duration * ratio;
          });
        }, at);
        await shot(name);
      }
    }
    console.log('  가운데 그림은 ' + rock.from + '도 ~ ' + rock.to + '도로 ' + rock.seconds.toFixed(1) + '초에 한 번 왕복');
    console.log('  그림이 선 각도 ' + uprightFirst + '도 → ' + uprightLater + '도 (차이 ' + drift.toFixed(2) + '도)');
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(e => { console.error('실패:', e.message); process.exit(1); });
