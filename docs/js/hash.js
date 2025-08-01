// hash.js

/**
 * Generates the keccak256 hash from a UTF-8 string input.
 * @param {string} answer - The answer to hash.
 * @returns {string} The keccak256 hash.
 */
function generateHash(answer) {
    if (!answer) return '';
    try {
        return window.ethers.keccak256(window.ethers.toUtf8Bytes(answer));
    } catch (error) {
        console.error('Error generating hash:', error);
        return '';
    }
}

/**
 * Handles hash generation from input field and sets up copy logic.
 */
function handleHashGeneration() {
    const input = document.getElementById('hashTestInput').value.trim();
    const resultElement = document.getElementById('hashResult');
    const copyButton = document.getElementById('copyHashButton');

    if (!input) {
        resultElement.textContent = '⚠️ Please enter an answer to hash.';
        return;
    }

    const hash = generateHash(input);
    resultElement.textContent = hash;

    // Attach the copy function
    copyButton.onclick = () => copyHash(hash, copyButton);
}

/**
 * Copies a hash string to clipboard and gives UI feedback.
 */
async function copyHash(hash, button) {
    if (!navigator.clipboard) {
        console.warn('Clipboard API not available');
        return;
    }

    try {
        button.disabled = true;
        button.textContent = 'Copying...';
        await navigator.clipboard.writeText(hash);
        button.textContent = '✅ Copied!';
        setTimeout(() => {
            button.textContent = '📋 Copy & Paste Hash';
            button.disabled = false;
        }, 1500);
    } catch (err) {
        console.error('Copy failed:', err);
        button.textContent = '❌ Copy failed';
        setTimeout(() => {
            button.textContent = '📋 Copy & Paste Hash';
            button.disabled = false;
        }, 1500);
    }
}

window.generateHash = generateHash;
window.handleHashGeneration = handleHashGeneration;
window.copyHash = copyHash;