document.addEventListener('DOMContentLoaded', () => { // Ensure the DOM is fully loaded before running the script
    const form = document.getElementById('quiz-form'); // Get the quiz form element
    const resultsEl = document.getElementById('results'); // Get the results container element

    const answerKey = { // Defines the answer key for the quiz
        1: { type: 'text', answer: 'GET' },
        2: { type: 'radio', answer: '200' },
        3: { type: 'radio', answer: 'Content-Type' },
        4: { type: 'radio', answer: 'POST' },
        5: { type: 'checkbox', answer: ['GET',  'PUT','POST'] }
    };

    form.addEventListener('submit', (e) => { // Handles form submission
        e.preventDefault(); // Prevents the default form submission behavior
        const formData = new FormData(form); // Creates a FormData object to easily access form values
        let score = 0;
        let htmlOutput = '';

        Object.keys(answerKey).forEach((key) => {  // Loops through each question in the answer key
            const q = answerKey[key];
            const userResponse = q.type === 'checkbox' ? formData.getAll(`q${key}`) : (formData.get(`q${key}`) || '').trim();

            let qScore = 0;
            let statusText = 'Incorrect';

            if (q.type === 'checkbox') { // For checkbox questions, we need to check if the user's selected options match the correct answers
                const correctSet = new Set(q.answer);
                const isCorrect = userResponse.length === q.answer.length && userResponse.every(val => correctSet.has(val));
                const isPartial = !isCorrect && userResponse.length > 0 && userResponse.every(val => correctSet.has(val));

                qScore = isCorrect ? 1 : (isPartial ? 0.5 : 0); // Full point for correct, half point for partially correct, and no points for incorrect
                statusText = isCorrect ? 'Correct' : (isPartial ? 'Partially Correct' : 'Incorrect');
            } else {
                qScore = userResponse.toUpperCase() === q.answer.toUpperCase() ? 1 : 0;
                statusText = qScore === 1 ? 'Correct' : 'Incorrect';
            }

            score += qScore;
            htmlOutput += `
                <div class="per-question-item"> <!-- Compares user answer to correct answers -->
                    <strong>Question ${key}:</strong> ${statusText}<br>
                    Your answer: ${Array.isArray(userResponse) ? userResponse.join(', ') : userResponse || '(no answer)'}<br>
                    Correct: ${Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}
                </div><hr>`;
        });

        const percent = Math.round((score / Object.keys(answerKey).length) * 100); // Calculates the percentage score
        resultsEl.innerHTML = `
            <h2>${percent >= 60 ? 'PASS' : 'FAIL'}</h2> 
            <p><strong>Score:</strong> ${score} / 5 (${percent}%)</p> 
            ${htmlOutput}`;
        resultsEl.hidden = false; // Show the results container
        resultsEl.scrollIntoView({ behavior: 'smooth' }); // Scroll to the results section smoothly
    });
// Handles reset button click to clear the form and hide results
    document.getElementById('reset-btn').addEventListener('click', () => {
        form.reset();
        resultsEl.hidden = true;
        resultsEl.innerHTML = '';
    });
});