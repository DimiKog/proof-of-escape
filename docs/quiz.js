// quiz.js

import { getQuizById, loadQuizList } from './quizData.js';

const quizDropdown = document.getElementById('quizDropdown');
const quizDescription = document.getElementById('quizDescription');
const quizDetails = document.getElementById('quizDetails');
const quizDetailsContent = document.getElementById('quizDetailsContent');
const quizHint = document.getElementById('quizHint');
const quizReward = document.getElementById('quizReward');
const startQuizBtn = document.getElementById('startQuizBtn');
const quizIdDisplay = document.getElementById('quizIdDisplay');

export async function initializeQuizDropdown() {
    const quizzes = await loadQuizList();
    quizzes.forEach(quiz => {
        const option = document.createElement('option');
        option.value = quiz.id;
        option.textContent = `Quiz ${quiz.id}: ${quiz.title}`;
        quizDropdown.appendChild(option);
    });
}

// Event listener for quiz selection change with validation and error handling
quizDropdown.addEventListener('change', async () => {
    const selectedId = parseInt(quizDropdown.value);
    if (!selectedId) {
        quizDescription.textContent = '';
        quizDetails.style.display = 'none';
        quizHint.textContent = '';
        quizReward.textContent = '';
        quizIdDisplay.textContent = 'None';
        return;
    }

    try {
        const quiz = await getQuizById(selectedId);
        if (!quiz) {
            quizDescription.textContent = '⚠️ Quiz data not found.';
            quizDetails.style.display = 'none';
            quizHint.textContent = '';
            quizReward.textContent = '';
            quizIdDisplay.textContent = 'None';
            return;
        }

        quizDescription.textContent = quiz.description;
        quizDetailsContent.textContent = quiz.details;
        quizDetails.style.display = 'block';
        quizHint.textContent = `Hint: ${quiz.hashHint}`;
        quizReward.textContent = `🏆 Reward: ${quiz.reward} tokens`;
        quizIdDisplay.textContent = selectedId;
    } catch (error) {
        console.error('Error loading quiz:', error);
        quizDescription.textContent = '⚠️ Error loading quiz.';
        quizDetails.style.display = 'none';
        quizHint.textContent = '';
        quizReward.textContent = '';
        quizIdDisplay.textContent = 'None';
    }
});

startQuizBtn.addEventListener('click', () => {
    const selectedId = quizDropdown.value;
    document.getElementById('quizId').value = selectedId;
    quizIdDisplay.textContent = selectedId;
});