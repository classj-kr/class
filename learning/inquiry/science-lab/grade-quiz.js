// Shared only by the grade-aligned lever and stimulus-response lessons.
document.addEventListener('DOMContentLoaded', () => {
    const cards = [...document.querySelectorAll('.quiz-card')];
    window.resetGradeQuiz = () => cards.forEach(card => {
        delete card.dataset.state;
        card.querySelectorAll('input').forEach(input => { input.checked = false; input.disabled = false; });
        card.querySelector('.answer-result').textContent = '';
        card.querySelector('.answer-explanation').hidden = true;
    });
    cards.forEach(card => {
        const group = card.querySelector('.quiz-options');
        const options = [...group.children];
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        group.append(...options);
        card.querySelector('.answer-button').addEventListener('click', () => {
            const selected = card.querySelector('input:checked');
            const result = card.querySelector('.answer-result');
            if (!selected) { result.textContent = '답을 먼저 선택하세요.'; return; }
            const correct = selected.value === card.dataset.answer;
            card.dataset.state = correct ? 'correct' : 'incorrect';
            result.textContent = correct ? '맞았습니다.' : '다시 생각하고 다른 답을 골라보세요.';
            card.querySelector('.answer-explanation').hidden = !correct;
            if (!correct) { selected.checked = false; selected.disabled = true; }
        });
    });
});
