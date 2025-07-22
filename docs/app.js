// app.js

import { connectWallet, registerWallet } from './wallet.js';
import { initializeQuizDropdown } from './quiz.js';
import { generateHash, copyHash } from './hash.js';
import { submitAnswer } from './submit.js';
import { handleAdminUpload } from './admin.js';

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