// quiz.js

const quizDropdown = document.getElementById('quizDropdown');
const quizDescription = document.getElementById('quizDescription');
const quizDetails = document.getElementById('quizDetails');
const quizDetailsContent = document.getElementById('quizDetailsContent');
const quizHint = document.getElementById('quizHint');
const quizReward = document.getElementById('quizReward');
const startQuizBtn = document.getElementById('startQuizBtn');
const quizIdDisplay = document.getElementById('quizIdDisplay');

// Cache the quizzes data once loaded to avoid re-fetching
let cachedQuizzes = [];

/**
 * Loads the quizzes data from the JSON file.
 * @returns {Promise<Array>} A promise that resolves with the quizzes array.
 */
async function loadQuizList() {
    if (cachedQuizzes.length === 0) {
        const response = await fetch('./data/quizzes.json');
        cachedQuizzes = await response.json();
    }
    return cachedQuizzes;
}

/**
 * Finds a quiz by its ID from the cached list.
 * @param {number} id The ID of the quiz to find.
 * @returns {object|null} The quiz object or null if not found.
 */
async function getQuizById(id) {
    const quizzes = await loadQuizList();
    return quizzes.find(q => q.id === id);
}

/**
 * Initializes the quiz dropdown menu based on the user's registration status.
 * @param {ethers.Contract} contractInstance The connected contract instance.
 */
async function initializeQuizDropdown(contractInstance) {
    // This function no longer connects the wallet. It uses the provided instance.
    if (!contractInstance) {
        // If contract is not connected, disable the dropdown and show a message.
        quizDropdown.disabled = true;
        quizDescription.textContent = '⚠️ Please connect your wallet first.';
        quizIdDisplay.textContent = 'None';
        return;
    }

    try {
        const userAddress = window.getUserAddress(); // Get the address from wallet.js
        const registered = await contractInstance.registeredUsers(userAddress);

        if (!registered) {
            quizDropdown.disabled = true;
            quizDescription.textContent = '⚠️ Please register your wallet first.';
            quizIdDisplay.textContent = 'None';
            return;
        }

        // If registered, enable the dropdown and populate the list.
        quizDropdown.disabled = false;
        const quizzes = await loadQuizList();

        // Clear existing options
        quizDropdown.innerHTML = '<option value="">-- Select Quiz --</option>';

        quizzes.forEach(quiz => {
            const option = document.createElement('option');
            option.value = quiz.id;
            option.textContent = `Quiz ${quiz.id}: ${quiz.title}`;
            quizDropdown.appendChild(option);
        });

        quizDescription.textContent = 'Select a quiz to view details.';

    } catch (error) {
        console.error('Error initializing quiz dropdown:', error);
        quizDescription.textContent = '⚠️ Error loading quizzes. Check console.';
        quizIdDisplay.textContent = 'None';
    }
}

// Event listener for quiz selection change
quizDropdown.addEventListener('change', async () => {
    const selectedId = parseInt(quizDropdown.value);
    if (!selectedId) {
        quizDescription.textContent = 'Select a quiz to view details.';
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

// Event listener for the "Start Quiz" button
startQuizBtn.addEventListener('click', () => {
    const selectedId = quizDropdown.value;
    if (selectedId) {
        document.getElementById('quizId').value = selectedId;
        quizIdDisplay.textContent = selectedId;
        // Optionally, scroll to the submission section
        const submissionSection = document.getElementById('answerSection');
        if (submissionSection) {
            submissionSection.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        window.showTempMessage('walletStatus', 'Please select a quiz first.', 3000, true);
    }
});

// Expose the function to the global scope
window.initializeQuizDropdown = initializeQuizDropdown;