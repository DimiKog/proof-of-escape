// hash.js

import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@6.10.0/+esm';

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

    try {
        const hash = ethers.keccak256(ethers.toUtf8Bytes(answer));
        hashResultDisplay.textContent = hash;
        submissionField.value = hash;
        window.copyToClipboard(hash, 'walletStatus');
        window.showTempMessage('walletStatus', 'Hash generated and placed in submission field.', 3000, false);
    } catch (err) {
        console.error('Error generating hash:', err);
        window.showTempMessage('walletStatus', '⚠️ Hash generation failed. Check console.', 3000, true);
    }
}

// Expose function to the global scope
window.handleHashGeneration = handleHashGeneration;