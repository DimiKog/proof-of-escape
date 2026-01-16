// submit.js

const submitButton = document.getElementById('submitAnswer');
const quizIdInput = document.getElementById('quizId');
const answerInput = document.getElementById('answer');
const resultMessage = document.getElementById('result');

let isSubmitting = false;

async function submitAnswer() {
    if (isSubmitting) return;
    isSubmitting = true;

    // Get the contract instance from the global scope
    const contract = window.getCachedContract?.();
    if (!contract) {
        window.showTempMessage('walletStatus', 'Wallet not connected.', 3000, true);
        isSubmitting = false;
        return;
    }

    const quizId = parseInt(quizIdInput.value);
    const answerHash = answerInput.value;

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

        // Await the transaction receipt
        const receipt = await tx.wait();
        console.log("📦 Transaction hash:", receipt.hash);

        if (receipt.status === 1) { // Transaction was successful
            if (answerInput) answerInput.value = '';

            // Find the RewardMinted event in the receipt
            const mintedEvent = receipt.logs.find(log => {
                try {
                    // Try to parse the log; if it fails, it's not our event
                    const parsed = contract.interface.parseLog(log);
                    return parsed && parsed.name === 'RewardMinted';
                } catch {
                    return false;
                }
            });

            if (mintedEvent) {
                const parsedArgs = contract.interface.parseLog(mintedEvent).args;
                const amount = ethers.formatUnits(parsedArgs.amount, 18);
                const explorerLink = `https://blockexplorer.dimikog.org/tx/${receipt.hash}`;

                resultMessage.innerHTML = `✅ Answer submitted successfully! You received ${amount} ESCAPE tokens.<br>📦 <a href="${explorerLink}" target="_blank">View Transaction</a>`;
                resultMessage.style.color = 'green';
            } else {
                resultMessage.textContent = '✅ Transaction successful, but no reward event found.';
                resultMessage.style.color = 'orange';
            }

            window.showTempMessage('walletStatus', 'Answer submitted successfully!', 3000, false);

        } else { // Transaction failed
            const errorMessage = '❌ Transaction failed. Please check the blockchain explorer.';
            resultMessage.textContent = errorMessage;
            resultMessage.style.color = 'red';
            window.showTempMessage('walletStatus', errorMessage, 5000, true);
        }

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

    } finally {
        // Always reset button state
        submitButton.disabled = false;
        submitButton.textContent = "Submit Answer";
        isSubmitting = false;
    }
}

window.submitAnswer = submitAnswer;
