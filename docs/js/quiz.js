// quiz.js

const quizDropdown = document.getElementById('quizDropdown');
const quizDescription = document.getElementById('quizDescription');
const quizDetails = document.getElementById('quizDetails');
const quizDetailsContent = document.getElementById('quizDetailsContent');
const quizHint = document.getElementById('quizHint');
const quizReward = document.getElementById('quizReward');
const startQuizBtn = document.getElementById('startQuizBtn');
const quizIdDisplay = document.getElementById('quizIdDisplay');
const registrationNotice = document.getElementById('registrationNotice');
const quizGateHint = document.getElementById('quizGateHint');

// If you ever need an absolute path (e.g., GitHub Pages), set window.QUIZZES_URL in index.html.
// Otherwise this falls back to the local relative path.
const QUIZZES_URL = window.QUIZZES_URL || 'data/quizzes.json';

// Cache the quizzes to avoid re-fetching
let cachedQuizzes = [];
let cachedContract = null;

/** Load quizzes (cached, deduplicated by id). */
async function loadQuizList() {
    if (cachedQuizzes.length === 0) {
        const res = await fetch(QUIZZES_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to load quizzes.json (${res.status})`);
        const quizzes = await res.json();
        // Ensure uniqueness by quiz ID
        const seen = new Set();
        cachedQuizzes = quizzes.filter(q => {
            if (seen.has(q.id)) return false;
            seen.add(q.id);
            return true;
        });
        // Sort quizzes by ID ascending
        cachedQuizzes.sort((a, b) => Number(a.id) - Number(b.id));
    }
    return cachedQuizzes;
}

/** Get a quiz by id. */
async function getQuizById(id) {
    const quizzes = await loadQuizList();
    return quizzes.find((q) => Number(q.id) === Number(id));
}

/**
 * Initialize dropdown based on registration.
 * @param {ethers.Contract|null} contractInstance
 */
async function initializeQuizDropdown(contractInstance) {
    try {
        // Clear and disable by default
        if (quizDropdown) {
            while (quizDropdown.firstChild) {
                quizDropdown.removeChild(quizDropdown.firstChild);
            }
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- Select Quiz --';
            quizDropdown.appendChild(defaultOption);
            quizDropdown.disabled = true;
        }

        // Detect connected address (wallet.js should expose this)
        const getAddr = typeof window.getUserAddress === 'function' ? window.getUserAddress : null;
        const userAddress = getAddr ? getAddr() : null;

        // Assume not registered unless we can prove otherwise
        let registered = false;
        cachedContract = contractInstance;

        if (contractInstance && userAddress) {
            try {
                if (typeof contractInstance.isRegistered === 'function') {
                    registered = await contractInstance.isRegistered(userAddress);
                } else if (typeof contractInstance.registeredUsers === 'function') {
                    // Back-compat if old contract exposed registeredUsers(address) → bool
                    registered = await contractInstance.registeredUsers(userAddress);
                } else {
                    console.warn('No registration method found on contract (isRegistered / registeredUsers).');
                }
            } catch (err) {
                console.warn('Registration check failed (non-blocking):', err);
            }
        }

        // Not registered → keep section visible, dropdown disabled, show notice
        if (!registered) {
            if (quizDescription) quizDescription.textContent = '⚠️ Please register your wallet to see available quizzes.';
            if (quizDetails) quizDetails.style.display = 'none';
            if (quizHint) quizHint.textContent = '';
            if (quizReward) quizReward.textContent = '';
            if (quizIdDisplay) quizIdDisplay.textContent = 'None';
            if (registrationNotice) registrationNotice.style.display = 'block';
            if (quizGateHint) quizGateHint.textContent = 'You need to register before you can take quizzes.';
            return; // Do not fetch quizzes.json until registered
        }

        // Registered → enable & populate dropdown, hide notice
        if (registrationNotice) registrationNotice.style.display = 'none';
        if (quizDropdown) quizDropdown.disabled = false;

        const quizzes = await loadQuizList();

        // Find the next uncompleted quiz for the user
        let nextQuiz = null;
        if (contractInstance && userAddress) {
            for (const quiz of quizzes) {
                try {
                    if (typeof contractInstance.completedQuizzes === 'function') {
                        const completed = await contractInstance.completedQuizzes(userAddress, quiz.id);
                        if (!completed) {
                            nextQuiz = quiz;
                            break;
                        }
                    } else {
                        // If no completedQuizzes method, fallback to first quiz
                        nextQuiz = quiz;
                        break;
                    }
                } catch (err) {
                    console.warn('Error checking quiz completion:', err);
                    // Fallback: treat as not completed
                    nextQuiz = quiz;
                    break;
                }
            }
        } else {
            // If no contract or userAddress, fallback to first quiz
            nextQuiz = quizzes.length > 0 ? quizzes[0] : null;
        }

        if (quizDropdown) {
            if (nextQuiz) {
                const opt = document.createElement('option');
                opt.value = nextQuiz.id;
                opt.textContent = `Quiz ${nextQuiz.id}: ${nextQuiz.title}`;
                quizDropdown.appendChild(opt);
                quizDropdown.value = nextQuiz.id;

                // Trigger change event manually to display quiz details
                quizDropdown.dispatchEvent(new Event('change'));
            } else {
                // All quizzes completed
                const opt = document.createElement('option');
                opt.value = '';
                opt.textContent = 'All quizzes completed!';
                quizDropdown.appendChild(opt);
                quizDropdown.disabled = true;
                if (quizDescription) quizDescription.textContent = '🎉 You have completed all available quizzes.';
                if (quizDetails) quizDetails.style.display = 'none';
                if (quizHint) quizHint.textContent = '';
                if (quizReward) quizReward.textContent = '';
                if (quizIdDisplay) quizIdDisplay.textContent = 'None';
            }
        }

        if (quizDescription && nextQuiz) quizDescription.textContent = 'Select a quiz to view details.';
    } catch (error) {
        console.error('Error initializing quiz dropdown:', error);
        if (quizDescription) quizDescription.textContent = '⚠️ Error loading quizzes. Check console.';
        if (quizIdDisplay) quizIdDisplay.textContent = 'None';
    }
}

// Handle dropdown changes
if (quizDropdown) {
    quizDropdown.addEventListener('change', async () => {
        const selectedId = parseInt(quizDropdown.value, 10);
        if (!selectedId) {
            if (quizDescription) quizDescription.textContent = 'Select a quiz to view details.';
            if (quizDetails) quizDetails.style.display = 'none';
            if (quizHint) quizHint.textContent = '';
            if (quizReward) quizReward.textContent = '';
            if (quizIdDisplay) quizIdDisplay.textContent = 'None';
            return;
        }

        try {
            const quiz = await getQuizById(selectedId);
            if (!quiz) {
                if (quizDescription) quizDescription.textContent = '⚠️ Quiz data not found.';
                if (quizDetails) quizDetails.style.display = 'none';
                if (quizHint) quizHint.textContent = '';
                if (quizReward) quizReward.textContent = '';
                if (quizIdDisplay) quizIdDisplay.textContent = 'None';
                return;
            }

            if (quizDescription) quizDescription.textContent = quiz.description || '';
            if (quizDetailsContent) quizDetailsContent.textContent = quiz.details || '';
            if (quizDetails) quizDetails.style.display = quiz.details ? 'block' : 'none';
            if (quizHint) quizHint.textContent = quiz.hashHint ? `Hint: ${quiz.hashHint}` : '';
            if (quizReward) quizReward.textContent = `🏆 Reward: ${quiz.reward ?? 10} tokens`;
            if (quizIdDisplay) quizIdDisplay.textContent = String(selectedId);
        } catch (err) {
            console.error('Error loading quiz:', err);
            if (quizDescription) quizDescription.textContent = '⚠️ Error loading quiz.';
            if (quizDetails) quizDetails.style.display = 'none';
            if (quizHint) quizHint.textContent = '';
            if (quizReward) quizReward.textContent = '';
            if (quizIdDisplay) quizIdDisplay.textContent = 'None';
        }
    });
}

// Start Quiz button
if (startQuizBtn) {
    startQuizBtn.addEventListener('click', () => {
        const selectedId = quizDropdown ? quizDropdown.value : '';
        if (selectedId) {
            const input = document.getElementById('quizId');
            if (input) input.value = selectedId;
            if (quizIdDisplay) quizIdDisplay.textContent = String(selectedId);

            const submissionSection = document.getElementById('answerSection');
            if (submissionSection) submissionSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            if (typeof window.showTempMessage === 'function') {
                window.showTempMessage('walletStatus', 'Please select a quiz first.', 3000, true);
            } else {
                alert('Please select a quiz first.');
            }
        }
    });
}

// Expose for main.js
window.initializeQuizDropdown = initializeQuizDropdown;
window.getCachedContract = () => cachedContract;

// Listen for reward events and display confirmation
//window.addEventListener('poe:rewardMinted', (e) => {
//    const { user, quizId, amount, event } = e.detail;
//    const txHash = event?.log?.transactionHash;
//    const explorerBase = "https://blockexplorer.dimikog.org"; // Replace with your actual explorer URL
//    const txUrl = `${explorerBase}/tx/${txHash}`;

//   if (typeof window.showTempMessage === 'function') {
//       window.showTempMessage(
//           'walletStatus',
//           `🎉 Correct! Reward minted for Quiz ${quizId}. <a href="${txUrl}" target="_blank">View on explorer</a>`,
//           7000
//       );
//   }
//});