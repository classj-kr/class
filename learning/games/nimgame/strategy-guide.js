(function () {
    'use strict';

    const names = ['첫째', '둘째', '셋째'];
    const token = (coin, taken = false, animate = false) => `<span aria-hidden="true" class="guide-token${coin ? ' is-coin' : ''}${taken ? ' is-taken' : ''}${taken && animate ? ' is-entering' : ''}"></span>`;
    const remaining = (rows, move) => rows.map((count, i) => count - (move?.row === i ? move.take : 0));

    function objectBoard(rows, move, coin = false, animate = false) {
        const after = remaining(rows, move);
        const description = rows.map((count, i) => `${coin ? '동전' : names[i] + ' 더미'} ${count}개${count !== after[i] ? `에서 ${after[i]}개로 줄어요` : ''}`).join(', ');
        return `<div class="guide-board" role="img" aria-label="${description}">
            ${rows.map((count, i) => `<div class="guide-object-row"><span class="guide-row-name">${coin ? '동전' : names[i]}<span class="guide-row-count">${count === after[i] ? count : `${count}→${after[i]}`}개</span></span><div class="guide-objects">${count
                ? Array.from({ length: count }, (_, n) => token(coin, n >= after[i], animate)).join('')
                : '<span>없음</span>'}</div></div>`).join('')}
            ${move ? '<p class="guide-legend">흐려진 것은 이번에 가져간 것이에요.</p>' : ''}
        </div>`;
    }

    function bundleCounts(rows) {
        return [4, 2, 1].map((size) => rows.filter((count) => count & size).length);
    }

    function bundleBoard(rows) {
        const counts = bundleCounts(rows);
        return `<div class="guide-bundles"><p>남은 보석을 묶음으로 나눠 볼까요?</p>
            <table><thead><tr><th scope="col">더미</th>${[4, 2, 1].map((n) => `<th scope="col">${n}개<br>묶음</th>`).join('')}</tr></thead>
            <tbody>${rows.map((count, i) => `<tr><th scope="row">${names[i]}<br>${count}개</th>${[4, 2, 1].map((size) => `<td>${count & size ? `<div class="guide-bundle" aria-label="${size}개짜리 묶음 하나">${token(false).repeat(size)}</div>` : '—'}</td>`).join('')}</tr>`).join('')}</tbody>
            <tfoot><tr><th scope="row">모두<br>세면</th>${counts.map((n) => `<td class="${n % 2 ? 'guide-unpaired' : 'guide-paired'}">${n}묶음<span class="guide-pair-status">${n % 2 ? '하나 남아요' : n ? '짝이 맞아요' : '없어도 괜찮아요'}</span></td>`).join('')}</tr></tfoot></table></div>`;
    }

    function nimScenes(misere) {
        const scenes = [
            { title: '1. 보석 세 더미로 배워 봐요', text: '첫째는 3개, 둘째는 5개, 셋째는 7개예요. 내 차례에는 한 더미에서만 가져갈 수 있어요. 여기서는 연습용 보석으로 배워요.', rows: [3, 5, 7] },
            { title: '2. 큰 묶음부터 나눠요', text: '7개는 4+2+1, 5개는 4+1, 3개는 2+1로 나눠 생각해요. 한 더미에서 같은 크기 묶음을 두 번 쓰지는 않아요. 8개 이상인 더미라면 8개 묶음도 써요.', groups: [3, 5, 7], result: '같은 세로줄을 세어 보세요. 4개 묶음은 둘, 2개 묶음도 둘이에요. 그런데 1개 묶음은 셋이라 하나가 짝이 없어요.' },
            { title: '3. 첫째 더미에서 1개를 가져가요', text: '첫째 더미의 오른쪽 보석 1개를 가져가요. 3개가 2개로 줄어들었어요.', rows: [3, 5, 7], move: { row: 0, take: 1 }, result: '이제 남은 보석은 2·5·7개예요. 다음에서 묶음을 다시 세어 볼게요.' },
            { title: '4. 모든 묶음에 짝이 생겼어요', text: '같은 세로줄의 묶음을 둘씩 짝지어 보세요. 1개 묶음도 이제 둘이에요.', groups: [2, 5, 7], success: true, result: '이렇게 모든 크기의 묶음에 짝을 맞춘 뒤 상대 차례로 넘기는 것이 비결이에요.' },
            { title: '5. 상대가 3개를 가져갔어요', text: '이번에는 상대가 셋째 더미에서 3개를 가져갔다고 해 볼게요. 7개가 4개로 줄었어요.', rows: [2, 5, 7], move: { row: 2, take: 3 }, result: '남은 보석은 2·5·4개예요. 묶음의 짝은 어떻게 되었을까요?' },
            { title: '6. 어떤 짝이 깨졌을까요?', text: '4개 묶음은 둘이지만, 2개 묶음과 1개 묶음은 하나씩이에요. 두 세로줄에 짝이 없네요.', groups: [2, 5, 4], result: '내 차례에는 보석을 가져가서 이 짝들을 다시 맞춰요.' },
            { title: '7. 나는 첫째 더미에서 1개를 가져가요', text: '첫째 더미의 보석을 2개에서 1개로 줄여요. 남은 수를 기준으로 묶음을 새로 나누어야 해요.', rows: [2, 5, 4], move: { row: 0, take: 1 } },
            { title: '8. 다시 짝이 맞았어요', text: '4개 묶음은 둘, 1개 묶음도 둘이에요. 2개 묶음은 없으니 짝이 남지 않아요.', groups: [1, 5, 4], success: true, result: '상대가 짝을 깨면 나는 다시 맞춰요. 실제로 가져갈 때는 늘 한 더미에서만 가져가요.' },
        ];
        if (misere) scenes.push(
            { title: '9. 끝부분은 따로 연습해 봐요', text: '이번에는 1·1·3개가 남은 다른 연습 장면이에요. 2개 이상인 더미가 딱 하나 남았다면, 마지막 것을 가져가면 지는 규칙에서는 방법을 바꿔요.', rows: [1, 1, 3], result: '상대에게 1개짜리 더미를 홀수 개 남겨야 해요.' },
            { title: '10. 2개를 가져가서 하나씩 남겨요', text: '셋째 더미에서 2개를 가져가요. 상대에게 1개짜리 더미 세 개를 남겼어요.', rows: [1, 1, 3], move: { row: 2, take: 2 }, result: '한 더미에서만 가져갈 수 있으므로, 이제 한 차례에 딱 하나씩만 가져갈 수 있어요.' },
            { title: '11. 상대가 하나 가져가요', text: '상대가 어느 더미를 골라도 두 더미가 남아요.', rows: [1, 1, 1], move: { row: 2, take: 1 } },
            { title: '12. 나도 하나 가져가요', text: '상대에게 보석 하나만 남겨요.', rows: [1, 1, 0], move: { row: 1, take: 1 } },
            { title: '13. 상대가 마지막 것을 가져가요', text: '상대는 마지막 보석을 가져갈 수밖에 없어요. 마지막 것을 가져간 상대가 지고 내가 이겼어요!', rows: [1, 0, 0], move: { row: 0, take: 1 }, success: true, result: '끝부분의 비결: 1개짜리 더미를 상대에게 홀수 개 남겨요. 다른 장면에서는 큰 더미를 모두 없애야 할 수도 있어요.' },
            { title: '14. 1·3개라면 어떻게 할까요?', text: '다른 끝부분도 볼게요. 하나씩 남기면 더미가 두 개라서 상대가 이겨요. 이번에는 큰 더미를 모두 없애야 해요.', rows: [1, 3], result: '목표는 하나씩 남기는 것 자체가 아니라, 상대에게 1개짜리 더미를 홀수 개 남기는 거예요.' },
            { title: '15. 이번에는 3개를 모두 가져가요', text: '둘째 더미를 모두 가져가면 상대에게 보석 하나만 남아요. 상대가 마지막 것을 가져가서 져요.', rows: [1, 3], move: { row: 1, take: 3 }, success: true, result: '1·1·3에서는 2개 가져가기, 1·3에서는 3개 가져가기. 남길 더미 수가 홀수가 되도록 생각해요.' },
        );
        else scenes.push(
            { title: '9. 끝까지 짝 맞추기를 해요', text: '이번에는 2·2개가 남은 다른 연습 장면이에요. 마지막 것을 가져가면 이기는 규칙에서는 계속 짝을 맞추면 돼요.', rows: [2, 2] },
            { title: '10. 상대가 한 더미를 가져갔어요', text: '상대가 둘째 더미의 2개를 모두 가져갔어요.', rows: [2, 2], move: { row: 1, take: 2 } },
            { title: '11. 내가 마지막 보석을 가져가요', text: '나도 첫째 더미의 2개를 모두 가져가요. 마지막 보석을 가져간 내가 이겼어요!', rows: [2, 0], move: { row: 0, take: 2 }, success: true, result: '이번 규칙에서는 마지막까지 묶음의 짝을 맞추면 돼요.' },
        );
        return scenes;
    }

    function coinScenes(limit, misere) {
        const pair = limit + 1;
        const start = pair * 2 + (misere ? 2 : 1);
        const goal = start - 1;
        const first = goal - 1;
        const next = goal - pair;
        const second = next - 2;
        return [
            { title: '1. 먼저 남길 개수를 정해요', text: `지금은 한 번에 1~${limit}개를 가져가요. 이 연습은 동전 ${start}개로 시작해요. ${misere ? '상대에게 마지막 동전 하나를 남기는 것이 목표예요.' : '내가 마지막 동전을 가져가는 것이 목표예요.'}`, rows: [start], result: `상대에게 남길 목표는 ${misere ? [1, pair + 1, pair * 2 + 1].join('개, ') : [pair, pair * 2].join('개, ')}개예요. 목표 사이의 간격은 ${pair}개예요.` },
            { title: '2. 내가 먼저 1개를 가져가요', text: `동전 1개를 가져가서 상대에게 ${goal}개를 남겨요. 이제부터 상대가 가져간 수와 내가 가져갈 수를 합쳐 ${pair}개로 맞출 거예요.`, rows: [start], move: { row: 0, take: 1 } },
            { title: '3. 상대가 1개를 가져갔어요', text: `상대가 1개를 가져가서 ${first}개가 남았어요. 나는 몇 개를 가져가야 둘이 합쳐 ${pair}개가 될까요?`, rows: [goal], move: { row: 0, take: 1 }, result: `1 + ? = ${pair}. 다음을 눌러 확인해 보세요.` },
            { title: `4. 나는 ${limit}개를 가져가요`, text: `상대의 1개와 나의 ${limit}개를 합치면 ${pair}개예요. 상대에게 남는 동전이 ${goal}개에서 ${next}개로 줄었어요.`, rows: [first], move: { row: 0, take: limit }, success: true, result: `1 + ${limit} = ${pair}. 상대에게 목표 개수를 남겼어요!` },
            { title: '5. 이번에는 상대가 2개를 가져갔어요', text: `상대가 2개를 가져가서 ${second}개가 남았어요. 이번에도 두 차례의 합을 ${pair}개로 맞춰요.`, rows: [next], move: { row: 0, take: 2 }, result: `2 + ? = ${pair}. 앞에서 본 것과 다른 수를 가져가야겠지요?` },
            { title: `6. 나는 ${pair - 2}개를 가져가요`, text: `2 + ${pair - 2} = ${pair}예요. ${misere ? '상대에게 동전 하나만 남았어요.' : '내가 마지막 동전까지 가져갔어요!'}`, rows: [second], move: { row: 0, take: pair - 2 }, success: true, result: misere ? '이제 상대 차례예요. 남은 동전은 하나뿐이에요.' : '마지막 동전을 가져간 내가 이겼어요!' },
            ...(misere ? [{ title: '7. 상대가 마지막 동전을 가져가요', text: '상대는 동전 하나를 가져갈 수밖에 없어요. 마지막 동전을 가져간 상대가 지고 내가 이겼어요!', rows: [1], move: { row: 0, take: 1 }, success: true, result: `비결은 두 차례의 합을 ${pair}개로 맞추면서, 상대에게 남기는 수를 ${goal}개 → ${next}개 → 1개로 줄이는 거예요.` }] : []),
        ];
    }

    function nimPractice(misere) {
        return [
            { title: '연습 1. 첫째 더미에서 몇 개 가져갈까요?', text: '3·5·7개로 시작해요. 첫째 더미에서 가져가서 모든 크기의 묶음에 짝을 맞춰 보세요.', rows: [3, 5, 7], row: 0, kind: 'pair' },
            { title: '연습 2. 상대가 짝을 깨뜨렸어요', text: '상대가 가져간 뒤 2·5·4개가 남았어요. 첫째 더미에서 가져가서 짝을 다시 맞춰 보세요.', rows: [2, 5, 4], row: 0, kind: 'pair' },
            misere
                ? { title: '연습 3. 마지막 보석을 상대에게!', text: '1·1·3개가 남았어요. 셋째 더미에서 몇 개 가져가야 상대에게 1개짜리 더미를 홀수 개 남길까요?', rows: [1, 1, 3], row: 2, kind: 'misere' }
                : { title: '연습 3. 마지막 보석을 내가!', text: '상대가 가져간 뒤 첫째 더미에 2개만 남았어요. 마지막 것을 가져가면 이기는 규칙이에요.', rows: [2, 0], row: 0, kind: 'finish' },
            ...(misere ? [{ title: '연습 4. 이번에도 하나씩 남길까요?', text: '이번에는 1·3개가 남았어요. 둘째 더미에서 가져가서 상대에게 1개짜리 더미를 홀수 개 남겨 보세요.', rows: [1, 3], row: 1, kind: 'misere' }] : []),
        ];
    }

    function mount(root, options) {
        const coin = options.mode === 'coin';
        const misere = options.winRule === 'misere';
        const limit = Math.max(2, Math.min(4, Number(options.coinLimit) || 3));
        const pair = limit + 1;
        const scenes = coin ? coinScenes(limit, misere) : nimScenes(misere);
        const exercises = nimPractice(misere);
        const lastPractice = coin ? 1 : exercises.length - 1;
        let step = 0;
        let round = 0;
        let choice = null;
        let correct = false;
        let completed = false;
        root.classList.add('nim-guide');
        root.innerHTML = `<p class="guide-announcement" role="status" aria-live="polite" aria-atomic="true"></p><div class="guide-heading"><h3>그림으로 배우고 직접 해 봐요</h3><p>${coin ? `동전 빼기 · 한 번에 1~${limit}개` : '기본 님 · 한 번에 한 더미에서 가져가기'}<br><strong>마지막 것을 가져가면 ${misere ? '져요' : '이겨요'}.</strong></p></div>
            <div class="guide-tabs" role="tablist" aria-label="전략 배우기">
                <button type="button" role="tab" id="guide-demo-tab" aria-controls="guide-demo" aria-selected="true">시범 보기</button>
                <button type="button" role="tab" id="guide-practice-tab" aria-controls="guide-practice" aria-selected="false" tabindex="-1">직접 해 보기</button>
            </div>
            <div class="guide-panel" id="guide-demo" role="tabpanel" aria-labelledby="guide-demo-tab">
                <div class="guide-controls"><button type="button" data-guide-action="previous">이전</button><span class="guide-step-count"></span><button type="button" data-guide-action="next">다음</button></div>
                <div class="guide-scene"></div>
            </div>
            <div class="guide-panel" id="guide-practice" role="tabpanel" aria-labelledby="guide-practice-tab" hidden><div class="guide-practice-content"></div></div>`;

        const demo = root.querySelector('#guide-demo');
        const practice = root.querySelector('#guide-practice');
        const content = root.querySelector('.guide-practice-content');
        const announcement = root.querySelector('.guide-announcement');

        function showScene(animate = false) {
            const scene = scenes[step];
            root.querySelector('.guide-step-count').textContent = `${step + 1} / ${scenes.length}`;
            root.querySelector('[data-guide-action="previous"]').disabled = step === 0;
            root.querySelector('[data-guide-action="next"]').textContent = step === scenes.length - 1 ? '연습하기' : '다음';
            root.querySelector('.guide-scene').innerHTML = `<h4>${scene.title}</h4><p class="guide-explanation">${scene.text}</p>
                ${scene.groups ? bundleBoard(scene.groups) : objectBoard(scene.rows, scene.move, coin, animate)}
                ${scene.result ? `<p class="guide-result${scene.success ? ' is-success' : ''}">${scene.result}</p>` : ''}`;
            announcement.textContent = scene.title + ' ' + scene.text;
        }

        function showPractice(animate = false) {
            let title, text, rows, row, allowed, feedback, result = '';
            const opponent = round === 0 ? 1 : 2;
            const beforeTarget = (2 - round) * pair + (misere ? 1 : 0);
            const target = beforeTarget - pair;
            if (coin) {
                title = `연습 ${round + 1}. 나는 몇 개 가져갈까요?`;
                text = `상대에게 ${beforeTarget}개를 남겼는데 상대가 ${opponent}개를 가져갔어요. 두 차례의 합이 ${pair}개가 되게 골라 보세요.`;
                rows = [beforeTarget - opponent]; row = 0; allowed = limit;
                feedback = `상대 ${opponent}개 + 나 ?개 = ${pair}개로 맞춰요.`;
            } else {
                const exercise = exercises[round];
                ({ title, text, rows, row } = exercise);
                allowed = rows[row];
                feedback = exercise.kind === 'pair' ? '개수를 고르면 보석과 묶음이 어떻게 달라지는지 볼 수 있어요.' : misere ? '상대에게 남길 1개짜리 더미를 세어 보세요.' : '마지막 보석을 가져가는 쪽이 이겨요.';
            }
            const move = choice === null ? null : { row, take: choice };
            const after = remaining(rows, move);
            if (choice !== null) {
                if (coin) {
                    correct = opponent + choice === pair;
                    feedback = correct ? `맞았어요! ${opponent} + ${choice} = ${pair}. ${after[0] === 0 ? '마지막 동전을 내가 가져가서 이겼어요!' : `상대에게 목표인 ${after[0]}개를 남겼어요.`}`
                        : `${choice}개를 가져가면 ${after[0]}개가 남아요. ${opponent} + ${choice} = ${opponent + choice}이네요. 합이 ${pair}개가 되도록 다시 골라 볼까요?`;
                } else {
                    const kind = exercises[round].kind;
                    const odd = bundleCounts(after).map((n, i) => n % 2 ? [4, 2, 1][i] : 0).filter(Boolean);
                    correct = kind === 'pair' ? odd.length === 0 : kind === 'misere' ? after.every((n) => n <= 1) && after.filter(Boolean).length % 2 === 1 : after.every((n) => n === 0);
                    feedback = correct ? kind === 'pair' ? '맞았어요! 아래 표에서 모든 크기의 묶음이 둘씩 짝을 이루는지 확인해 보세요.' : kind === 'misere' ? after.filter(Boolean).length === 1 ? '맞았어요! 큰 더미를 모두 없애서 상대에게 하나만 남겼어요. 상대가 마지막 보석을 가져가서 져요.' : '맞았어요! 하나씩 남은 더미가 세 개예요. 상대 하나 → 나 하나 → 상대가 마지막 하나를 가져가서 져요.' : '맞았어요! 마지막 보석을 내가 가져가서 이겼어요!'
                        : kind === 'pair' ? `${odd.join('개 묶음과 ')}개 묶음에 짝이 없는 묶음이 있어요. 아래 표를 보고 다른 개수를 골라 보세요.` : kind === 'misere' ? '이렇게 남기면 상대가 이길 수 있어요. 1개짜리 더미가 홀수 개 남도록 다른 개수를 골라 보세요.' : '아직 보석이 남아서 상대가 마지막 것을 가져갈 수 있어요. 다시 골라 보세요.';
                }
                result = correct ? 'correct' : 'retry';
            }
            if (completed) {
                content.innerHTML = `<div class="guide-scene"><h4 tabindex="-1">연습을 끝냈어요!</h4><p class="guide-explanation">${coin ? misere ? '이제 상대가 마지막 동전 하나를 가져가서 내가 이겼어요.' : '내가 마지막 동전을 가져가서 이겼어요.' : '첫 수, 상대의 응수, 마지막 장면까지 직접 골라 봤어요.'}</p>
                    ${coin ? objectBoard(misere ? [1] : [0], misere ? { row: 0, take: 1 } : null, true, animate) : '<p class="guide-result is-success">같은 설정으로 선공을 바꿔 가며, 방금 배운 방법을 실제 게임에서도 찾아보세요.</p>'}
                    <button type="button" class="guide-continue" data-guide-action="restart">처음부터 연습하기</button></div>`;
                announcement.textContent = '연습을 끝냈어요!';
                return;
            }
            announcement.textContent = choice === null ? title + ' ' + text : feedback;
            content.innerHTML = `<div class="guide-scene"><h4 tabindex="-1">${title}</h4><p>${text}</p>
                <div class="guide-choices" aria-label="가져갈 개수">${Array.from({ length: allowed }, (_, i) => `<button class="guide-choice" type="button" data-guide-take="${i + 1}" aria-label="${i + 1}개 가져가기" aria-pressed="${choice === i + 1}"${correct ? ' disabled' : ''}><strong>${i + 1}개</strong><span>가져가기</span></button>`).join('')}</div>
                <p class="guide-feedback" tabindex="-1" data-result="${result}">${feedback}</p>
                ${objectBoard(rows, move, coin, animate)}${!coin && exercises[round].kind === 'pair' ? bundleBoard(after) : ''}
                ${correct ? `<button type="button" class="guide-continue" data-guide-action="continue">${round === lastPractice ? coin && misere ? '상대의 마지막 차례 보기' : '연습 마치기' : '다음 연습'}</button>` : ''}
                <button type="button" class="guide-reset" data-guide-action="restart">연습 처음으로</button></div>`;
        }

        function selectTab(isPractice, focus = false) {
            demo.hidden = isPractice;
            practice.hidden = !isPractice;
            root.querySelectorAll('[role="tab"]').forEach((tab, i) => {
                const selected = Boolean(i) === isPractice;
                tab.setAttribute('aria-selected', String(selected));
                tab.tabIndex = selected ? 0 : -1;
                if (focus && selected) tab.focus({ preventScroll: true });
            });
            if (isPractice) showPractice();
            else announcement.textContent = scenes[step].title + ' ' + scenes[step].text;
        }

        root.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button || !root.contains(button)) return;
            if (button.id === 'guide-demo-tab' || button.id === 'guide-practice-tab') {
                selectTab(button.id === 'guide-practice-tab');
                return;
            }
            if (button.dataset.guideTake) {
                choice = Number(button.dataset.guideTake);
                showPractice(true);
                const next = content.querySelector(correct ? '.guide-feedback' : `[data-guide-take="${choice}"]`);
                next?.focus({ preventScroll: true });
                return;
            }
            switch (button.dataset.guideAction) {
                case 'previous': step = Math.max(0, step - 1); showScene(); break;
                case 'next':
                    if (step === scenes.length - 1) selectTab(true, true);
                    else { step++; showScene(true); }
                    break;
                case 'continue':
                    if (round === lastPractice) completed = true;
                    else round++;
                    choice = null; correct = false; showPractice(true);
                    content.querySelector('h4')?.focus({ preventScroll: true });
                    break;
                case 'restart':
                    round = 0; choice = null; correct = false; completed = false; showPractice();
                    content.querySelector('h4')?.focus({ preventScroll: true });
                    break;
            }
        });
        root.querySelector('[role="tablist"]').addEventListener('keydown', (event) => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            selectTab(event.key === 'End' || (event.key !== 'Home' && practice.hidden), true);
        });
        showScene();
    }

    window.NimStrategyGuide = { mount };
})();
