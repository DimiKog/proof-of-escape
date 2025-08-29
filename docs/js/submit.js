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

    // A valid keccak256 hash is 0x followed by 64 hex characters.
    if (!answerHash || !answerHash.startsWith('0x') || answerHash.length !== 66) {
        window.showTempMessage('walletStatus', 'Please provide a valid keccak256 hash.', 3000, true);
        return;
    }

    try {
        resultMessage.textContent = 'Submitting answer... Please confirm the transaction in your wallet.';
        resultMessage.style.color = 'orange';

        // Connect the contract to the signer to send a transaction
        const signer = await window.getSigner();
        const contractWithSigner = contract.connect(signer);

        const tx = await contractWithSigner.checkQuizAnswer(quizId, answerHash);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log("📦 Transaction hash:", tx.hash);

        // Check for success or failure from the transaction receipt
        if (receipt.status === 1) { // Transaction was successful
            resultMessage.textContent = '✅ Answer submitted successfully! Checking for rewards...';
            resultMessage.textContent += `\n📦 Tx Hash: ${tx.hash}`;
            resultMessage.style.color = 'green';
            window.showTempMessage('walletStatus', 'Answer submitted successfully!', 3000, false);
        } else { // Transaction failed (e.g., reverted)
            const errorMessage = '❌ Transaction failed. Please check the blockchain explorer.';
            resultMessage.textContent = errorMessage;
            resultMessage.style.color = 'red';
            window.showTempMessage('walletStatus', errorMessage, 5000, true);
        }

    } catch (error) {
        console.error("❌ Failed to submit answer:", error);
        let errorMessage = 'Failed to submit answer. Check the console for details.';

        // Check for specific revert reasons from the error object
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

// Expose submitAnswer globally for main.js to call
window.submitAnswer = submitAnswer;