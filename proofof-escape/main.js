// main.js (Vite entry point)

import { connectWallet, registerWallet } from './js/wallet.js';
import { initializeQuizDropdown } from './js/quiz.js';
import { generateHash, copyHash } from './js/hash.js';
import { submitAnswer } from './js/submit.js';
import { handleAdminUpload } from './js/admin.js';
const contract = window.contract;

async function controlVisibility() {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    const userAddress = accounts[0];
    if (!userAddress) return;

    const isRegistered = await contract.registeredUsers(userAddress);
    const owner = await contract.owner();

    if (!isRegistered) {
        document.getElementById('quizSection').style.display = 'none';
        document.getElementById('registerPrompt').style.display = 'block';
        document.getElementById('registerButton').style.display = 'inline-block'; // Show register button
    } else {
        document.getElementById('quizSection').style.display = 'block';
        document.getElementById('registerPrompt').style.display = 'none';
        document.getElementById('registerButton').style.display = 'none'; // Hide register button
    }

    if (userAddress.toLowerCase() === owner.toLowerCase()) {
        document.getElementById('adminPanel').style.display = 'block';
    } else {
        document.getElementById('adminPanel').style.display = 'none';
    }
}

// Setup DOM event bindings after DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    connectWallet(); // ← automatically connects wallet and shows register button if needed
    controlVisibility();

    document.getElementById('connectButton')?.addEventListener('click', connectWallet);
    document.getElementById('registerButton')?.addEventListener('click', registerWallet);

    document.getElementById('generateHashButton')?.addEventListener('click', generateHash);
    document.getElementById('copyHashButton')?.addEventListener('click', copyHash);

    document.getElementById('submitAnswer')?.addEventListener('click', submitAnswer);
    document.getElementById('uploadHashButton')?.addEventListener('click', handleAdminUpload);

    initializeQuizDropdown(); // Populate quiz list on load
});