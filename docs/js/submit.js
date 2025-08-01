// submit.js

/**
 * Handles the submission of a quiz answer to the smart contract.
 * @param {ethers.Contract} contractInstance The connected ethers.js Contract instance.
 */
async function submitAnswer(contractInstance) {
    const quizId = document.getElementById('quizId').value;
    const answer = document.getElementById('answer').value;
    const resultElem = document.getElementById('result');
    const submitButton = document.getElementById('submitAnswer');

    // Clear previous feedback
    resultElem.textContent = '';
    resultElem.style.color = 'black'; // Reset color

    if (!contractInstance) {
        resultElem.textContent = '❌ Wallet not connected or contract not loaded.';
        resultElem.style.color = 'red';
        return;
    }

    if (!quizId || !answer) {
        resultElem.textContent = 'Please fill in both the Quiz ID and the Answer fields.';
        resultElem.style.color = 'red';
        return;
    }

    // A simple validation for a keccak256 hash.
    // The length should be 66 characters (0x + 64 hex chars).
    if (!answer.startsWith('0x') || answer.length !== 66) {
        resultElem.textContent = 'Answer must be a valid keccak256 hash (e.g., 0x...).';
        resultElem.style.color = 'red';
        return;
    }

    try {
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting... ⏳';
        }

        // Use the connected contract instance directly.
        // It's already associated with the signer.
        const tx = await contractInstance.submitAnswer(quizId, answer);
        await tx.wait();

        resultElem.textContent = `✅ Answer submitted successfully! Transaction hash: ${tx.hash}`;
        resultElem.style.color = 'green';
    } catch (error) {
        console.error('❌ Failed to submit answer:', error);
        resultElem.textContent = `❌ Failed to submit answer: ${error.message}`;
        resultElem.style.color = 'red';
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Answer';
        }
    }
}

// Event listener for updating the quiz ID display
// This can be kept separate from the main submit logic.
document.getElementById('quizId').addEventListener('input', function () {
    document.getElementById('quizIdDisplay').textContent = this.value || 'None';
});

// Expose the function to the global scope
window.submitAnswer = submitAnswer;