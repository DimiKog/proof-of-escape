// hash.js

/**
 * Handles the generation of a keccak256 hash from a string input.
 * It reads the user's answer and pastes the hash into the submission field.
 */
function handleHashGeneration() {
    const answerInput = document.getElementById('hashTestInput');
    const hashResultDisplay = document.getElementById('hashResult');
    const submissionField = document.getElementById('answer');

    if (!answerInput || !hashResultDisplay || !submissionField) {
        console.error('Required elements not found for hash generation.');
        return;
    }

    const answer = answerInput.value;
    if (answer.trim() === '') {
        window.showTempMessage('walletStatus', 'Please enter an answer to generate the hash.', 3000, true);
        return;
    }

    // Convert the answer to bytes and then compute the keccak256 hash
    const hash = ethers.keccak256(ethers.toUtf8Bytes(answer));

    // Display the hash in the dedicated <pre> tag for the user to see
    hashResultDisplay.textContent = hash;

    // Place the hash into the submission field ready for submission
    submissionField.value = hash;

    // Also copy the hash to the clipboard for convenience
    // This uses the copyToClipboard function from utils.js
    window.copyToClipboard(hash, 'copyHashButton');

    window.showTempMessage('walletStatus', 'Hash generated and placed in submission field.', 3000, false);
}

// Expose function to the global scope
window.handleHashGeneration = handleHashGeneration;