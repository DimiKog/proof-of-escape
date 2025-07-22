// hash.js

import { keccak256, toUtf8Bytes } from 'ethers';

/**
 * Generates the keccak256 hash from a UTF-8 string input.
 * @param {string} answer - The answer to hash.
 * @returns {string} The keccak256 hash.
 */
export function generateHash(answer) {
    if (!answer) return '';
    try {
        return keccak256(toUtf8Bytes(answer));
    } catch (error) {
        console.error('Error generating hash:', error);
        return '';
    }
}

/**
 * Handles hash generation from input field and sets up copy logic.
 * Called typically on a button click for UI hash generation.
 */
export function handleHashGeneration() {
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
 * Copies a hash string to clipboard and gives UI feedback on the button.
 * @param {string} hash - The hash string to copy.
 * @param {HTMLElement} button - The button that triggered the copy.
 */
export async function copyHash(hash, button) {
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