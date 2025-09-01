// main.js

let contract;

window.addEventListener('DOMContentLoaded', async () => {
    const connectButton = document.getElementById('connectButton');
    const registerPrompt = document.getElementById('registerPrompt');
    const quizSection = document.getElementById('quizSection');
    const adminSection = document.getElementById('adminSection');

    // Single source of truth for UI updates
    async function updateUI() {
        try {
            const userAddress = window.getUserAddress?.();
            const poeContract = window.POE?.contract;
            const nftContract = window.POE_NFT?.contract; // Use a more reliable way to get the NFT contract if needed

            if (!userAddress || !poeContract) {
                connectButton.style.display = 'block';
                registerPrompt.style.display = 'none';
                quizSection.style.display = 'none';
                adminSection.style.display = 'none';
                return;
            }

            connectButton.style.display = 'none';
            quizSection.style.display = 'block';

            // Check if registered
            const isRegistered = await poeContract.isRegistered(userAddress);
            registerPrompt.style.display = isRegistered ? 'none' : 'block';
            window.initializeQuizDropdown?.(poeContract);

            // Check if admin
            const owner = await poeContract.owner();
            const isAdmin = userAddress.toLowerCase() === String(owner).toLowerCase();
            adminSection.style.display = isAdmin ? 'block' : 'none';

            // Now, and only now, call the NFT check function
            window.checkAndShowMintButton?.();

        } catch (err) {
            console.error('updateUI error:', err);
            // Fallback UI state
            connectButton.style.display = 'block';
            registerPrompt.style.display = 'none';
            quizSection.style.display = 'none';
            adminSection.style.display = 'none';
        }
    }

    // Wire up event listeners
    connectButton?.addEventListener('click', async () => {
        await window.connectWallet();
        updateUI();
    });

    document.getElementById('registerButton')?.addEventListener('click', async () => {
        if (window.POE?.contract) {
            await window.registerWallet(window.POE.contract);
            updateUI();
        }
    });

    document.getElementById('submitAnswer')?.addEventListener('click', () => {
        if (window.POE?.contract) {
            window.submitAnswer(window.POE.contract);
        }
    });

    document.getElementById('uploadHashButton')?.addEventListener('click', () => {
        if (window.POE?.contract) {
            window.handleAdminUpload(window.POE.contract);
        }
    });

    document.getElementById('generateHashButton')?.addEventListener('click', window.handleHashGeneration);
    // You can remove the separate copy button listener if it's handled in `handleHashGeneration`

    // Listen for events that change the UI state
    window.addEventListener('poe:walletChanged', updateUI);
    window.addEventListener('poe:registered', updateUI);
    window.addEventListener('poe:quizCompleted', updateUI);

    // Initial setup on page load
    await window.connectWallet();
    await window.loadABIs?.();
    window.ABIS_READY = Promise.resolve();
    updateUI();
});