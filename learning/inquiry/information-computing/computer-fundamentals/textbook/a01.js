(() => {
'use strict';
const M = window.A01Model;
const $ = (id) => document.getElementById(id);
const KEY = 'classj:textbook:a01:v1';
const photoNames = { cat: '고양이', dog: '강아지' };
const ruleNames = { color: '색 그대로', gray: '흑백', bright: '밝게' };
const questions = [
    {
        prompt: '날씨 앱에서 ① 지역 이름을 누르자 ② 그 지역의 날씨 자료를 찾아 비 예보가 있는지 비교한 뒤 ③ 우산 그림을 보여 주었습니다. 처리에 해당하는 것은?',
        options: [
            ['① 지역 이름을 누르는 일', '누른 지역을 앱에 알려 주는 것은 입력입니다. 앱이 받은 자료를 찾아 비교하는 부분을 보세요.'],
            ['② 자료를 찾아 비 예보가 있는지 비교하는 일', '받은 입력을 이용해 자료를 찾고 비교하는 일이 처리입니다. 지역 선택은 입력, 우산 그림 표시는 출력입니다.'],
            ['③ 우산 그림을 화면에 보여 주는 일', '그림을 보여 주는 것은 출력입니다. 그 그림을 고르기 위해 앱이 먼저 자료에 어떤 일을 했는지 보세요.']
        ], answer: 1
    },
    {
        prompt: '카메라 앱 화면에 교실 모습이 보입니다. 사진이 저장되었는지는 아직 확인하지 않았습니다. 지금 관찰한 사실로 판단할 수 있는 것은?',
        options: [
            ['교실 모습이 출력되었다. 사진 저장 여부는 따로 확인해야 한다.', '화면에 보인 것은 출력의 증거입니다. 나중에 다시 열 수 있게 기록되었는지는 저장된 사진을 확인해야 알 수 있습니다.'],
            ['교실 모습이 출력되었으므로 같은 사진도 저장되어 있다.', '출력과 저장을 같은 일로 판단했습니다. 화면에 보이더라도 사진 파일이 만들어졌는지는 이 관찰만으로 알 수 없습니다.'],
            ['저장 여부를 모르므로 화면 출력 여부도 아직 판단할 수 없다.', '지금 화면에 교실 모습이 보인다는 관찰이 있습니다. 저장 여부를 몰라도 출력이 일어났다는 사실은 확인할 수 있습니다.']
        ], answer: 0
    },
    {
        prompt: '두 프로그램에 똑같이 4를 입력했습니다. A는 5를 더해 9를, B는 2배로 만들어 8을 보여 주었습니다. 결과가 다른 까닭은?',
        options: [
            ['A와 B가 서로 다른 수를 입력받았기 때문이다.', '두 프로그램이 받은 수는 모두 4입니다. 입력 이후에 적용한 규칙을 비교하세요.'],
            ['A는 저장을 했고 B는 저장을 하지 않았기 때문이다.', '저장 여부는 이 상황에 나와 있지 않습니다. 4에서 9와 8을 만드는 계산에 차이가 있습니다.'],
            ['같은 입력에 서로 다른 처리 규칙을 적용했기 때문이다.', '4에 5를 더하는 규칙과 4를 2배로 만드는 규칙은 다릅니다. 입력이 같아도 처리 규칙이 달라지면 결과가 달라질 수 있습니다.']
        ], answer: 2
    },
    {
        prompt: '태블릿 화면의 건반을 손가락으로 눌렀더니, 누른 위치가 앱에 전달되고 해당 건반이 파랗게 보였습니다. 이때 터치 화면이 맡은 두 역할은?',
        options: [
            ['누른 위치를 받는 입력 / 파란 건반을 보여 주는 저장', '누른 위치를 받는 것은 입력입니다. 파란색을 화면에 보여 주는 일은 나중을 위한 기록과 구별해야 합니다.'],
            ['누른 위치를 받는 입력 / 파란 건반을 보여 주는 출력', '하나의 화면도 터치를 받을 때는 입력, 그림을 보여 줄 때는 출력을 맡습니다. 네 역할은 기기의 개수가 아니라 하는 일을 구분한 것입니다.'],
            ['누른 위치를 받는 처리 / 파란 건반을 보여 주는 출력', '파란 건반 표시는 출력입니다. 손가락이 누른 위치를 받아들이는 일과 받은 위치를 판단하는 처리를 구별하세요.']
        ], answer: 1
    }
];
function freshProgress() { return { photo: false, transfer: false, answers: questions.map(() => ({ solved: false, attempts: 0, selected: null, firstCorrect: false })) }; }
let progress = freshProgress();
let storageAvailable = true;
try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw && raw.version === 1 && Array.isArray(raw.answers)) {
        progress.photo = raw.photo === true;
        progress.transfer = raw.transfer === true;
        progress.answers = questions.map((q, i) => {
            const a = raw.answers[i];
            if (!a || !Number.isInteger(a.selected) || a.selected < 0 || a.selected >= q.options.length) return freshProgress().answers[i];
            const attempts = Number.isInteger(a.attempts) && a.attempts > 0 ? Math.min(a.attempts, 10000) : 0;
            return { selected: a.selected, solved: a.solved === true && a.selected === q.answer && attempts > 0, attempts, firstCorrect: a.firstCorrect === true && a.selected === q.answer && attempts > 0 };
        });
    }
} catch { /* A broken record is ignored; storage support is checked on write. */ }
function persist() {
    try { localStorage.setItem(KEY, JSON.stringify({ ...progress, version: 1 })); storageAvailable = true; }
    catch { storageAvailable = false; }
    updateProgress();
}
function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
}
function feedback(id, text, kind = '') {
    $(id).textContent = text;
    $(id).dataset.kind = kind;
}
const pages = ['read', 'photo', 'transfer', 'check'];
function showPage(name, focus = true) {
    if (!pages.includes(name)) name = 'read';
    for (const id of pages) $('page-' + id).hidden = id !== name;
    document.querySelectorAll('[data-page]').forEach((button) => {
        if (button.dataset.page === name) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
    });
    if (location.hash !== '#' + name) history.replaceState(null, '', '#' + name);
    if (focus) {
        const title = $('page-' + name).querySelector('h2');
        title.focus({ preventScroll: true });
        document.querySelector('.section-nav').scrollIntoView({ block: 'start' });
    }
}
document.querySelectorAll('[data-page]').forEach((b) => b.addEventListener('click', () => showPage(b.dataset.page)));
document.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => showPage(b.dataset.go)));
window.addEventListener('hashchange', () => showPage(location.hash.slice(1)));

let pendingReset = null;
function requestReset(description, callback) {
    $('resetDescription').textContent = description;
    pendingReset = callback;
    $('resetDialog').returnValue = '';
    $('resetDialog').showModal();
}
$('resetDialog').addEventListener('close', () => {
    const action = pendingReset;
    pendingReset = null;
    if ($('resetDialog').returnValue === 'confirm' && action) action();
});

let photo = M.photoSession();
let chosenPhoto = 'cat';
let chosenRule = 'color';
let recentPhotos = [];
const processedPhotos = {};
function photoLabel(record) { return photoNames[record.input] + ' · ' + ruleNames[record.rule]; }
function photoImage(record) {
    const img = document.createElement('img');
    img.src = record.image;
    img.alt = photoLabel(record) + ' 처리 결과';
    img.width = 224;
    img.height = 224;
    return img;
}
function renderPhoto() {
    const out = $('photoOutput');
    out.replaceChildren(photo.current ? photoImage(photo.current) : node('p', '출력한 그림이 없습니다.'));
    $('photoDescription').textContent = photo.current ? photoLabel(photo.current) + (photo.saved?.id === photo.current.id ? ' · 저장된 결과와 같음' : ' · 이 결과는 아직 저장하지 않음') : (photo.closed ? '작업을 닫아 현재 출력이 사라졌습니다.' : '입력과 규칙을 고른 뒤 실행하세요.');
    $('savePhoto').disabled = !photo.current;
    $('closePhoto').disabled = !photo.current;
    $('openPhoto').disabled = !photo.saved;
    const saved = $('savedPhoto');
    saved.replaceChildren();
    if (photo.saved) saved.append(photoImage(photo.saved), node('p', photoLabel(photo.saved)));
    else {
        const icon = node('span', undefined, 'file-outline');
        icon.setAttribute('aria-hidden', 'true');
        saved.append(icon, node('p', '저장된 그림 없음'));
    }
    $('taskCompare').classList.toggle('done', photo.compared);
    $('taskUnsaved').classList.toggle('done', photo.unsavedClosed);
    $('taskReopen').classList.toggle('done', photo.reopened);
    $('photoComplete').textContent = M.photoComplete(photo) ? '그림 실습의 세 가지 관찰을 마쳤습니다.' : (progress.photo ? '이 실습을 완료한 기록이 있습니다.' : '');
    $('comparison').hidden = recentPhotos.length < 2;
    $('comparisonItems').replaceChildren();
    if (recentPhotos.length === 2) {
        recentPhotos.forEach((record) => {
            const figure = node('figure');
            figure.append(photoImage(record), node('figcaption', photoLabel(record)));
            $('comparisonItems').append(figure);
        });
        const [a, b] = recentPhotos;
        $('comparisonText').textContent = a.input === b.input
            ? a.rule === b.rule ? '입력과 규칙이 모두 같아 결과도 같습니다.' : '입력한 그림은 같고 처리 규칙은 다릅니다. 그림의 색과 밝기가 어떻게 달라졌는지 비교하세요.'
            : a.rule === b.rule ? '처리 규칙은 같지만 입력한 그림이 다릅니다.' : '입력과 규칙을 모두 바꿨습니다. 규칙의 영향만 비교하려면 그림은 같게 두세요.';
    }
    if (M.photoComplete(photo) && !progress.photo) { progress.photo = true; persist(); }
}
function updatePhotoChoice() {
    document.querySelectorAll('[data-photo]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.photo === chosenPhoto)));
    document.querySelectorAll('[data-rule]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.rule === chosenRule)));
}
document.querySelectorAll('[data-photo]').forEach((b) => b.addEventListener('click', () => {
    chosenPhoto = b.dataset.photo; updatePhotoChoice();
    feedback('photoFeedback', '입력을 ' + photoNames[chosenPhoto] + ' 그림으로 골랐습니다. 실행해야 현재 출력이 바뀝니다.');
}));
document.querySelectorAll('[data-rule]').forEach((b) => b.addEventListener('click', () => {
    chosenRule = b.dataset.rule; updatePhotoChoice();
    feedback('photoFeedback', '처리 규칙을 ‘' + ruleNames[chosenRule] + '’로 골랐습니다. 실행해야 현재 출력이 바뀝니다.');
}));
$('runPhoto').addEventListener('click', () => {
    const image = processedPhotos[chosenPhoto + ':' + chosenRule];
    if (!image) return;
    const result = M.processPhoto(photo, chosenPhoto, chosenRule, image);
    recentPhotos = [...recentPhotos, { ...result }].slice(-2);
    renderPhoto();
    feedback('photoFeedback', photoLabel(result) + ' 결과를 출력했습니다. 보관한 결과는 저장 단추를 누르기 전까지 바뀌지 않습니다.');
});
$('savePhoto').addEventListener('click', () => {
    if (!M.savePhoto(photo)) return;
    renderPhoto();
    feedback('photoFeedback', photoLabel(photo.saved) + ' 결과를 기록했습니다. 작업을 닫아도 보관한 결과는 남습니다.');
});
$('closePhoto').addEventListener('click', () => {
    const unsaved = photo.current && photo.current.id !== photo.saved?.id;
    if (!M.closePhoto(photo)) return;
    recentPhotos = [];
    renderPhoto();
    feedback('photoFeedback', photo.saved
        ? (unsaved ? '새로 출력한 그림은 닫혔습니다. 보관함에는 마지막으로 저장했던 ' + photoLabel(photo.saved) + ' 결과가 남아 있습니다.' : '현재 출력은 닫혔지만 저장한 그림은 남아 있습니다.')
        : '현재 출력이 사라졌고 저장된 그림도 없습니다. 화면에 보였던 결과가 저장까지 된 것은 아닙니다.');
    $('runPhoto').focus();
});
$('openPhoto').addEventListener('click', () => {
    if (!M.openPhoto(photo)) return;
    chosenPhoto = photo.saved.input; chosenRule = photo.saved.rule;
    updatePhotoChoice(); renderPhoto();
    feedback('photoFeedback', '저장한 ' + photoLabel(photo.saved) + ' 결과를 다시 읽어 화면에 출력했습니다.');
});
function resetPhoto() {
    photo = M.photoSession(); chosenPhoto = 'cat'; chosenRule = 'color'; recentPhotos = [];
    progress.photo = false;
    updatePhotoChoice(); renderPhoto(); persist();
    feedback('photoFeedback', '그림 실습을 초기화했습니다. 입력 그림과 처리 규칙을 고르세요.');
}
$('resetPhoto').addEventListener('click', () => requestReset('그림의 현재 출력·저장본·실습 완료 기록을 지웁니다. 다른 과제와 문제의 기록은 유지합니다.', resetPhoto));

let numbers = M.numberSession();
function numberTrace(record) { return record.input + ' → ' + M.operations[record.operation].label + ' → ' + record.value; }
function renderNumber() {
    $('numberOutput').textContent = numbers.current ? String(numbers.current.value) : '—';
    $('numberTrace').textContent = numbers.current ? numberTrace(numbers.current) : '현재 출력 없음';
    $('savedNumber').textContent = numbers.saved ? String(numbers.saved.value) : '없음';
    $('savedNumberTrace').textContent = numbers.saved ? numberTrace(numbers.saved) : '아직 저장하지 않았습니다.';
    $('saveNumber').disabled = !numbers.current;
    $('closeNumber').disabled = !numbers.current;
    $('openNumber').disabled = !numbers.saved;
}
$('runNumber').addEventListener('click', () => {
    const result = M.processNumber(numbers, $('numberInput').value, $('numberRule').value);
    if (!result) {
        feedback('numberFeedback', '0부터 20까지의 정수를 입력하세요.', 'wrong');
        $('numberInput').focus(); return;
    }
    renderNumber();
    feedback('numberFeedback', numberTrace(result) + '. 현재 출력이 바뀌었습니다.');
});
['numberInput', 'numberRule'].forEach((id) => $(id).addEventListener('input', () => {
    feedback('numberFeedback', '설정을 바꿨습니다. 아직 실행하지 않았으므로 출력과 저장된 결과는 그대로입니다.');
}));
$('saveNumber').addEventListener('click', () => {
    if (!M.saveNumber(numbers)) return;
    renderNumber(); feedback('numberFeedback', '현재 출력 ' + numbers.saved.value + '을 저장했습니다.');
});
$('closeNumber').addEventListener('click', () => {
    if (!M.closeNumber(numbers)) return;
    renderNumber();
    feedback('numberFeedback', numbers.saved ? '현재 출력을 닫았습니다. 저장된 기록은 남아 있습니다.' : '현재 출력을 닫았습니다. 저장된 기록이 없습니다.');
    $('runNumber').focus();
});
$('openNumber').addEventListener('click', () => {
    if (!M.openNumber(numbers)) return;
    $('numberInput').value = numbers.saved.input;
    $('numberRule').value = numbers.saved.operation;
    renderNumber(); feedback('numberFeedback', '저장된 기록을 읽었습니다. ' + numberTrace(numbers.saved) + '.');
});
$('submitNumber').addEventListener('click', () => {
    const result = M.checkNumber(numbers);
    feedback('numberFeedback', result.text, result.ok ? 'success' : 'wrong');
    if (result.ok) { progress.transfer = true; persist(); }
});
function resetNumber() {
    numbers = M.numberSession(); progress.transfer = false;
    $('numberInput').value = 4; $('numberRule').value = 'add3';
    renderNumber(); persist(); feedback('numberFeedback', '독립 과제의 작업과 완료 기록을 초기화했습니다.');
}
$('resetNumber').addEventListener('click', () => requestReset('숫자의 현재 출력·저장본·과제 완료 기록을 지웁니다. 그림 실습과 문제의 기록은 유지합니다.', resetNumber));

function renderQuestions() {
    $('questions').replaceChildren();
    questions.forEach((q, i) => {
        const record = progress.answers[i];
        const section = node('section', undefined, 'question');
        section.dataset.question = i; section.dataset.solved = String(record.solved);
        const fieldset = node('fieldset');
        const legend = node('legend');
        legend.append(node('span', '문제 ' + (i + 1), 'question-label'), document.createTextNode(q.prompt));
        fieldset.append(legend);
        q.options.forEach((option, index) => {
            const label = node('label', undefined, 'option');
            const radio = document.createElement('input');
            radio.type = 'radio'; radio.name = 'question-' + i; radio.value = index;
            radio.checked = record.selected === index;
            radio.disabled = record.solved;
            label.append(radio, node('span', option[0])); fieldset.append(label);
        });
        const response = node('p', '', 'feedback');
        response.id = 'feedback-q' + i; response.setAttribute('role', 'status');
        const button = node('button', record.solved ? '답 확인됨' : '답 확인', 'answer-check');
        button.type = 'button'; button.disabled = record.solved;
        if (record.selected !== null && record.attempts > 0) {
            response.textContent = (record.solved ? '맞습니다. ' : '') + q.options[record.selected][1];
            response.dataset.kind = record.solved ? 'success' : 'wrong';
        }
        button.addEventListener('click', () => {
            const selected = fieldset.querySelector('input:checked');
            if (!selected) { response.textContent = '답 하나를 선택하세요.'; response.dataset.kind = 'wrong'; fieldset.querySelector('input').focus(); return; }
            const choice = Number(selected.value);
            record.selected = choice; record.attempts += 1;
            record.solved = choice === q.answer;
            if (record.attempts === 1) record.firstCorrect = record.solved;
            response.textContent = (record.solved ? '맞습니다. ' : '') + q.options[choice][1];
            response.dataset.kind = record.solved ? 'success' : 'wrong';
            section.dataset.solved = String(record.solved);
            if (record.solved) {
                fieldset.querySelectorAll('input').forEach((input) => input.disabled = true);
                button.disabled = true; button.textContent = '답 확인됨';
                response.tabIndex = -1; response.focus({ preventScroll: true });
            }
            persist();
        });
        section.append(fieldset, response, button); $('questions').append(section);
    });
}
function updateProgress() {
    const solved = progress.answers.filter((a) => a.solved).length;
    const count = Number(progress.photo) + Number(progress.transfer) + Number(solved === questions.length);
    $('progressText').textContent = count + ' / 3 완료';
    $('questionCount').textContent = solved + ' / ' + questions.length + ' 해결';
    const items = [
        [progress.photo, '그림: 처리 규칙 비교 · 저장 전후 확인'],
        [progress.transfer, '숫자: 계산 · 저장 · 다시 열기'],
        [solved === questions.length, '확인 문제: ' + solved + ' / ' + questions.length + ' 해결']
    ];
    $('completionList').replaceChildren(...items.map(([done, label]) => {
        const item = node('li'); item.append(node('span', done ? '완료' : '미완료'), document.createTextNode(label)); return item;
    }));
    const first = progress.answers.filter((a) => a.firstCorrect).length;
    $('completionMessage').textContent = count === 3
        ? '1차시를 마쳤습니다. 확인 문제 ' + questions.length + '개 중 ' + first + '개는 첫 응답에서 맞혔습니다.'
        : '남은 항목은 위의 학습 순서에서 다시 열 수 있습니다.';
    $('storageNotice').textContent = storageAvailable
        ? '완료한 항목은 이 브라우저에 기록됩니다. 그림·숫자의 작업 화면은 새로고침하면 초기화됩니다.'
        : '브라우저가 학습 기록 저장을 허용하지 않아, 페이지를 닫으면 완료 기록이 유지되지 않습니다.';
}
$('resetProgress').addEventListener('click', () => requestReset('이 1차시의 실습·과제·문제 기록을 모두 지웁니다. 기존 교재의 진도는 바뀌지 않습니다.', () => {
    progress = freshProgress(); resetPhoto(); resetNumber(); renderQuestions(); persist();
}));
function loadPhoto(name) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Photo load failed: ' + name));
        img.src = '../assets/images/j03-' + name + '-file.webp';
    });
}
async function prepareImages() {
    try {
        const images = await Promise.all(['cat', 'dog'].map(loadPhoto));
        for (let i = 0; i < images.length; i += 1) {
            for (const rule of Object.keys(ruleNames)) {
                const canvas = document.createElement('canvas');
                canvas.width = 224; canvas.height = 224;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(images[i], 0, 0, 224, 224);
                if (rule !== 'color') {
                    const bitmap = ctx.getImageData(0, 0, 224, 224);
                    for (let p = 0; p < bitmap.data.length; p += 4) {
                        if (rule === 'gray') {
                            const value = Math.round(bitmap.data[p] * .299 + bitmap.data[p + 1] * .587 + bitmap.data[p + 2] * .114);
                            bitmap.data[p] = value; bitmap.data[p + 1] = value; bitmap.data[p + 2] = value;
                        } else {
                            for (let c = 0; c < 3; c += 1) bitmap.data[p + c] = Math.min(255, bitmap.data[p + c] + 45);
                        }
                    }
                    ctx.putImageData(bitmap, 0, 0);
                }
                processedPhotos[['cat', 'dog'][i] + ':' + rule] = canvas.toDataURL('image/png');
            }
        }
        $('runPhoto').disabled = false;
        feedback('photoFeedback', '입력 그림과 처리 규칙을 고른 뒤 실행하세요.');
    } catch {
        feedback('photoFeedback', '그림을 불러오지 못했습니다. 페이지를 다시 열어 주세요. 그림 실습은 완료로 기록되지 않았습니다.', 'wrong');
    }
}
renderPhoto(); renderNumber(); renderQuestions();
persist();
showPage(location.hash.slice(1), false);
prepareImages();
})();


