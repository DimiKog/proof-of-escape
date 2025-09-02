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
        if (typeof window.showTempMessage === 'function') {
            window.showTempMessage('walletStatus', 'Please enter an answer to generate the hash.', 3000, true);
        } else {
            console.warn('showTempMessage is not defined.');
        }
        return;
    }

    try {
        const hash = ethers.keccak256(ethers.toUtf8Bytes(answer));
        if (hashResultDisplay) {
            hashResultDisplay.textContent = hash;
        } else {
            console.warn('Hash result display element not found.');
        }
        submissionField.value = hash;
        if (typeof window.copyToClipboard === 'function') {
            window.copyToClipboard(hash, 'walletStatus');
        } else {
            console.warn('copyToClipboard is not defined.');
        }
        if (typeof window.showTempMessage === 'function') {
            window.showTempMessage('walletStatus', 'Hash generated and placed in submission field.', 3000, false);
        } else {
            console.warn('showTempMessage is not defined.');
        }
    } catch (err) {
        console.error('Error generating hash:', err);
        if (typeof window.showTempMessage === 'function') {
            window.showTempMessage('walletStatus', '⚠️ Hash generation failed. Check console.', 3000, true);
        } else {
            console.warn('showTempMessage is not defined.');
        }
    }
}

// Expose function to the global scope
window.handleHashGeneration = handleHashGeneration;