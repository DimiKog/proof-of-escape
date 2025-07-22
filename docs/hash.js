// hash.js

import { keccak256, toUtf8Bytes } from 'ethers';

export function generateHash(answer) {
    if (!answer) return '';
    try {
        return keccak256(toUtf8Bytes(answer));
    } catch (error) {
        console.error('Error generating hash:', error);
        return '';
    }
}

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

    copyButton.onclick = async () => {
        try {
            copyButton.disabled = true;
            copyButton.textContent = 'Copying...';
            await navigator.clipboard.writeText(hash);
            copyButton.textContent = '✅ Copied!';
            setTimeout(() => {
                copyButton.textContent = '📋 Copy & Paste Hash';
                copyButton.disabled = false;
            }, 1500);
        } catch (err) {
            console.error('Copy failed:', err);
            copyButton.textContent = '❌ Copy failed';
            setTimeout(() => {
                copyButton.textContent = '📋 Copy & Paste Hash';
                copyButton.disabled = false;
            }, 1500);
        }
    };
}