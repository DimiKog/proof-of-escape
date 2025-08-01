// submit.js

async function submitAnswer() {
    const quizId = document.getElementById('quizId').value;
    const answer = document.getElementById('answer').value;
    const resultElem = document.getElementById('result');

    resultElem.textContent = '';

    if (!quizId || !answer) {
        resultElem.textContent = 'Please fill in both the Quiz ID and the Answer fields.';
        return;
    }

    if (!answer.startsWith('0x') || answer.length !== 66) {
        resultElem.textContent = 'Answer must be a valid keccak256 hash (0x + 64 hex chars).';
        return;
    }

    try {
        const signer = getSigner();
        if (!signer) throw new Error('Wallet not connected');

        const contract = window.quizContract;
        if (!contract) throw new Error('Quiz contract not loaded');

        resultElem.textContent = 'Submitting... ⏳';

        const tx = await contract.submitAnswer(quizId, answer);
        await tx.wait();

        resultElem.textContent = `✅ Answer submitted successfully in transaction ${tx.hash}`;
    } catch (error) {
        console.error('❌ Failed to submit answer:', error);
        resultElem.textContent = `❌ Failed to submit answer: ${error.message}`;
    }
}

function initSubmitHandlers() {
    document.getElementById('submitAnswer').addEventListener('click', submitAnswer);
    document.getElementById('quizId').addEventListener('input', function () {
        document.getElementById('quizIdDisplay').textContent = this.value || 'None';
    });
}

// Make sure this function is globally accessible
window.initSubmitHandlers = initSubmitHandlers;