// submit.js

const submitButton = document.getElementById('submitAnswer');
const quizIdInput = document.getElementById('quizId');
const answerInput = document.getElementById('answer');
const resultMessage = document.getElementById('result');

let isSubmitting = false;

// Add global event listeners here
window.addEventListener('poe:quizCompleted', (e) => {
    const { message } = e.detail;
    window.showTempMessage('walletStatus', `✅ ${message}`, 3000, false);
});

window.addEventListener('poe:rewardMinted', (e) => {
    const { amount, event } = e.detail;
    const explorerLink = `https://blockexplorer.dimikog.org/tx/${event.log.transactionHash}`;

    resultMessage.innerHTML = `✅ Answer submitted successfully! You received ${amount} ESCAPE tokens.<br>📦 <a href="${explorerLink}" target="_blank">View Transaction</a>`;
    resultMessage.style.color = 'green';
    submitButton.disabled = false;
    submitButton.textContent = "Submit Answer";
    isSubmitting = false; // Reset the state here
});


async function submitAnswer() {
    if (isSubmitting) return; // Prevent double-clicking
    isSubmitting = true;

    // Get the contract instance from the global scope
    const contract = window.getCachedContract?.();
    if (!contract) {
        window.showTempMessage('walletStatus', 'Wallet not connected.', 3000, true);
        isSubmitting = false;
        return;
    }

    const quizId = parseInt(quizIdInput.value);
    const answerHash = answerInput.value.trim(); // directly use the user's input hash without re-hashing

    if (isNaN(quizId) || quizId <= 0) {
        window.showTempMessage('walletStatus', 'Please select a valid Quiz ID.', 3000, true);
        isSubmitting = false;
        return;
    }

    if (!answerHash || !answerHash.startsWith('0x') || answerHash.length !== 66) {
        window.showTempMessage('walletStatus', 'Please provide a valid keccak256 hash.', 3000, true);
        isSubmitting = false;
        return;
    }

    try {
        resultMessage.innerHTML = '';
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
        resultMessage.textContent = 'Submitting answer... Please confirm the transaction in your wallet.';
        resultMessage.style.color = 'orange';

        const contractWithSigner = contract.connect(window.POE.signer);
        const tx = await contractWithSigner.checkQuizAnswer(quizId, answerHash);

        // Await the transaction receipt. If it reverts, the next line will throw an error.
        const receipt = await tx.wait();
        console.log("📦 Transaction hash:", receipt.hash);

        // The UI will be updated by the event listeners after the transaction is mined.
        // We can display an initial success message here
        resultMessage.textContent = '✅ Transaction sent. Waiting for confirmation...';
        resultMessage.style.color = 'green';

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
        isSubmitting = false;
    }
}

// Expose submitAnswer globally for main.js to call
window.submitAnswer = submitAnswer;