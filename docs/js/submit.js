// submit.js

const submitButton = document.getElementById('submitAnswer');
const quizIdInput = document.getElementById('quizId');
const answerInput = document.getElementById('answer');
const resultMessage = document.getElementById('result');

/**
 * Submits a quiz answer to the smart contract.
 * @param {ethers.Contract} contract The contract instance.
 */
async function submitAnswer(contract) {
    if (!contract) {
        window.showTempMessage('walletStatus', 'Wallet not connected.', 3000, true);
        return;
    }

    const quizId = parseInt(quizIdInput.value);
    const answerHash = answerInput.value;

    if (isNaN(quizId) || quizId <= 0) {
        window.showTempMessage('walletStatus', 'Please select a valid Quiz ID.', 3000, true);
        return;
    }

    if (!answerHash || answerHash.length !== 66) { // Check for a valid keccak256 hash length (0x + 64 chars)
        window.showTempMessage('walletStatus', 'Please provide a valid keccak256 hash.', 3000, true);
        return;
    }

    try {
        resultMessage.textContent = 'Submitting answer... Please wait for confirmation.';
        resultMessage.style.color = 'orange';

        // Correct function name: checkQuizAnswer
        const tx = await contract.checkQuizAnswer(quizId, answerHash);
        await tx.wait();

        resultMessage.textContent = '✅ Answer submitted successfully! Checking for rewards...';
        resultMessage.style.color = 'green';
        window.showTempMessage('walletStatus', 'Answer submitted successfully!', 3000, false);

    } catch (error) {
        console.error("❌ Failed to submit answer:", error);
        let errorMessage = 'Failed to submit answer. Check the console for details.';

        // Check for specific revert reasons
        if (error.reason) {
            errorMessage = `❌ Failed to submit answer: ${error.reason}`;
        } else if (error.code === 'ACTION_REJECTED') {
            errorMessage = 'Transaction was rejected by the user.';
        }

        resultMessage.textContent = errorMessage;
        resultMessage.style.color = 'red';
        window.showTempMessage('walletStatus', errorMessage, 5000, true);
    }
}