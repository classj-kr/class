import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

assert.match(
    html,
    /const hubLinks = Array\.from\(hubContent\.querySelectorAll\(['"]a\[href\]['"]\)\);/,
    'Every destination inside the hub must be included in the access gate.',
);
assert.match(
    html,
    /function setHubLocked\(locked\)/,
    'The hub must expose a single lock state for all of its links.',
);
assert.match(
    html,
    /link\.dataset\.lockedHref = link\.getAttribute\(['"]href['"]\);\s*link\.removeAttribute\(['"]href['"]\);/,
    'Locked destinations must lose their href so they cannot be opened in another tab.',
);
assert.match(
    html,
    /link\.setAttribute\(['"]href['"], link\.dataset\.lockedHref\);/,
    'Unlocking the hub must restore each destination.',
);
assert.match(
    html,
    /hubContent\.addEventListener\(['"]click['"][\s\S]*event\.preventDefault\(\);[\s\S]*guestNameInput\.focus\(\);[\s\S]*}, true\);/,
    'Locked hub clicks must be cancelled before navigation and return focus to the name field.',
);
assert.match(
    html,
    /updatePlayerLearningLinks\(guest\.name\);\s*setHubLocked\(false\);\s*restrictedPreview = false;\s*setStatus\(''\);/,
    'Submitting a valid player name must unlock the hub.',
);
assert.match(
    html,
    /if \(!openAccess \|\| isValidPlayerName\(currentPlayerName\)\) return;\s*const link = event\.target\.closest\('a, summary'\);\s*if \(link && hubContent\.contains\(link\)\) \{\s*event\.preventDefault\(\);\s*setStatus\('Enter a Korean player name before opening a game\.', true\);\s*guestNameInput\.focus\(\);/,
    'Open access without a valid saved name must lock the hub, including submenu-opening buttons.',
);
assert.match(
    html,
    /const baseHref = link\.dataset\.baseHref\s*\|\| link\.dataset\.lockedHref\s*\|\| link\.getAttribute\(['"]href['"]\);/,
    'Player handoff links must preserve their destination while the hub is locked.',
);
assert.match(
    html,
    /worksheetGroupSummaries\.forEach\(\(summary\) => \{\s*summary\.classList\.toggle\('is-class-locked', locked\);\s*if \(locked\) \{\s*summary\.setAttribute\('aria-disabled', 'true'\);\s*\} else if \(summary\.dataset\.classLocked !== 'true'\) \{\s*summary\.removeAttribute\('aria-disabled'\);\s*\}\s*\}\);/,
    'Locking the hub must also visually lock submenu-opening buttons, not just links.',
);
assert.match(
    html,
    /if \(link\.hasAttribute\(['"]href['"]\)\) \{\s*link\.setAttribute\(['"]href['"], nextHref\);\s*\} else \{\s*link\.dataset\.lockedHref = nextHref;/,
    'Updating a locked player link must update its saved destination without unlocking it early.',
);

class FakeLink {
    constructor(href) {
        this.attributes = new Map([['href', href]]);
        this.dataset = { playerHandoff: 'query' };
        this.id = 'cds95GameLink';
        this.classList = { toggle() {} };
    }

    hasAttribute(name) {
        return this.attributes.has(name);
    }

    getAttribute(name) {
        return this.attributes.get(name) ?? null;
    }

    setAttribute(name, value) {
        this.attributes.set(name, String(value));
    }

    removeAttribute(name) {
        this.attributes.delete(name);
    }
}

class FakeSummary {
    constructor() {
        this.classes = new Set();
        this.classList = { toggle: (name, force) => {
            const on = force === undefined ? !this.classes.has(name) : Boolean(force);
            if (on) this.classes.add(name); else this.classes.delete(name);
        } };
        this.attributes = new Map();
        this.dataset = {};
    }

    hasAttribute(name) {
        return this.attributes.has(name);
    }

    setAttribute(name, value) {
        this.attributes.set(name, String(value));
    }

    removeAttribute(name) {
        this.attributes.delete(name);
    }
}

const functionStart = html.indexOf('function setHubLocked(locked)');
const functionEnd = html.indexOf('async function api(', functionStart);
assert.ok(functionStart >= 0 && functionEnd > functionStart, 'The player-link functions must be extractable.');
const playerLinkFunctions = html.slice(functionStart, functionEnd);
const voyageLink = new FakeLink('/learn/world-voyage/');
const groupSummary = new FakeSummary();
const createRuntime = new Function(
    'hubLinks',
    'playerLearningLinks',
    'worksheetGroupSummaries',
    'window',
    'KOREAN_NAME_PATTERN',
    `
        function isValidPlayerName(value) {
            return KOREAN_NAME_PATTERN.test(String(value || ''));
        }
        ${playerLinkFunctions}
        return { setHubLocked, updatePlayerLearningLinks };
    `,
);
const runtime = createRuntime(
    [voyageLink],
    [voyageLink],
    [groupSummary],
    { location: { href: 'https://classj.kr/' } },
    /^[가-힣]{2,6}$/,
);

runtime.setHubLocked(true);
assert.equal(voyageLink.hasAttribute('href'), false, 'The link must remain disabled during guest setup.');
assert.equal(groupSummary.classes.has('is-class-locked'), true, 'A submenu-opening button must look locked while the hub is locked.');
runtime.updatePlayerLearningLinks('아아');
assert.equal(voyageLink.hasAttribute('href'), false, 'Adding the name must not unlock the link early.');
runtime.setHubLocked(false);
assert.equal(groupSummary.classes.has('is-class-locked'), false, 'Unlocking the hub must restore the submenu-opening button.');

const restoredVoyageUrl = new URL(voyageLink.getAttribute('href'));
assert.equal(restoredVoyageUrl.pathname, '/learn/world-voyage/');
assert.equal(restoredVoyageUrl.searchParams.get('name'), '아아');

console.log('Index access gate contract passed.');
