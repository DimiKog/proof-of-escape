// submit.js

const submitButton = document.getElementById('submitAnswer');
const quizIdInput = document.getElementById('quizId');
const answerInput = document.getElementById('answer');
const resultMessage = document.getElementById('result');

// Add global event listeners here
window.addEventListener('poe:quizCompleted', (e) => {
    const { message } = e.detail;
    window.showTempMessage('walletStatus', `✅ ${message}`, 3000, false);
});

window.addEventListener('poe:rewardMinted', (e) => {
    const { amount } = e.detail;
    resultMessage.innerHTML = `✅ Answer submitted successfully! You received ${amount} ESCAPE tokens.`;
    resultMessage.style.color = 'green';
    submitButton.disabled = false;
    submitButton.textContent = "Submit Answer";
});

/**
 * Submits a quiz answer to the smart contract.
 */
async function submitAnswer() {
    // Get the contract instance from the global scope
    const contract = window.getCachedContract?.();
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

    if (!answerHash || !answerHash.startsWith('0x') || answerHash.length !== 66) {
        window.showTempMessage('walletStatus', 'Please provide a valid keccak256 hash.', 3000, true);
        return;
    }

    try {
        resultMessage.innerHTML = '';
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
        resultMessage.textContent = 'Submitting answer... Please confirm the transaction in your wallet.';
        resultMessage.style.color = 'orange';

        if (!contract) {
            throw new Error("Smart contract not accessible. Please connect wallet or try again later.");
        }

        // Connect the contract to the signer to send a transaction
        const contractWithSigner = contract.connect(window.POE.signer);
        const tx = await contractWithSigner.checkQuizAnswer(quizId, answerHash);

        // No need to wait for tx.wait() or check receipt status here.
        // The event listeners will handle the UI update once the transaction is mined.

    } catch (error) {
        console.error("❌ Failed to submit answer:", error);
        let errorMessage = 'Failed to submit answer. Check the console for details.';

        if (error.reason) {
            errorMessage = `❌ Failed to submit answer: ${error.reason}`;
        } else if (error.code === 'ACTION_REJECTED') {
            errorMessage = 'Transaction was rejected by the user.';
        }

        resultMessage.textContent = errorMessage;
        resultMessage.style.color = 'red';
        window.showTempMessage('walletStatus', errorMessage, 5000, true);
        submitButton.disabled = false;
        submitButton.textContent = "Submit Answer";
    }
}

// Expose submitAnswer globally for main.js to call
window.submitAnswer = submitAnswer;