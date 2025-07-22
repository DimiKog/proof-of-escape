// main.js (Vite entry point)

import { connectWallet, registerWallet } from './js/wallet.js';
import { initializeQuizDropdown } from './js/quiz.js';
import { generateHash, copyHash } from './js/hash.js';
import { submitAnswer } from './js/submit.js';
import { handleAdminUpload } from './js/admin.js';

// Setup DOM event bindings after DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('connectButton')?.addEventListener('click', connectWallet);
    document.getElementById('registerButton')?.addEventListener('click', registerWallet);

    document.getElementById('generateHashButton')?.addEventListener('click', generateHash);
    document.getElementById('copyHashButton')?.addEventListener('click', copyHash);

    document.getElementById('submitAnswer')?.addEventListener('click', submitAnswer);
    document.getElementById('uploadHashButton')?.addEventListener('click', handleAdminUpload);

    initializeQuizDropdown(); // Populate quiz list on load
});