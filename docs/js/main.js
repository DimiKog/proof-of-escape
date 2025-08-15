// main.js

let contract;

window.addEventListener('DOMContentLoaded', async () => {
    const connectButton = document.getElementById('connectButton');
    const registerPrompt = document.getElementById('registerPrompt');
    const quizSection = document.getElementById('quizSection');
    const adminSection = document.getElementById('adminSection');

    async function initializeDapp() {
        try {
            if (!contract) contract = window.POE?.contract || null;

            if (contract) {
                connectButton && (connectButton.style.display = 'none');

                const userAddress = window.getUserAddress?.();
                if (!userAddress) {
                    connectButton && (connectButton.style.display = 'block');
                    registerPrompt && (registerPrompt.style.display = 'none');
                    quizSection && (quizSection.style.display = 'none');
                    adminSection && (adminSection.style.display = 'none');
                    return;
                }

                const isRegistered = await contract.isRegistered(userAddress);
                const owner = await contract.owner();
                const isAdmin = owner && userAddress.toLowerCase() === String(owner).toLowerCase();

                // Always show the quiz section when a wallet is connected.
                // Show/hide registration prompt based on registration status.
                // Let quiz.js handle enabling/disabling the dropdown based on registration.
                quizSection && (quizSection.style.display = 'block');

                if (!isRegistered) {
                    registerPrompt && (registerPrompt.style.display = 'block');
                } else {
                    registerPrompt && (registerPrompt.style.display = 'none');
                }

                // Reinitialize the quiz UI either way; quiz.js should no-op or disable when unregistered.
                window.initializeQuizDropdown?.(contract);

                adminSection && (adminSection.style.display = isAdmin ? 'block' : 'none');
            } else {
                connectButton && (connectButton.style.display = 'block');
                registerPrompt && (registerPrompt.style.display = 'none');
                quizSection && (quizSection.style.display = 'none');
                adminSection && (adminSection.style.display = 'none');
            }
        } catch (err) {
            console.error('initializeDapp error:', err);
            connectButton && (connectButton.style.display = 'block');
            registerPrompt && (registerPrompt.style.display = 'none');
            quizSection && (quizSection.style.display = 'none');
            adminSection && (adminSection.style.display = 'none');
        }
    }

    async function handleConnectionAndInitialization() {
        // ✅ Ensure ABIs are loaded BEFORE connecting / building contracts
        if (typeof window.loadABIs === 'function') {
            await window.loadABIs();
            if (!Array.isArray(window.POE_ABI)) {
                throw new Error('POE_ABI did not load as an array');
            }
        }

        // Try to connect
        const c = await window.connectWallet();
        contract = c || window.POE?.contract || null;
        await initializeDapp();
    }

    // Call once on load (safe-guarded)
    try {
        await handleConnectionAndInitialization();
    } catch (err) {
        console.error('Error during initial connection and initialization:', err);
    }

    // Buttons
    connectButton?.addEventListener('click', handleConnectionAndInitialization);

    document.getElementById('registerButton')?.addEventListener('click', async () => {
        if (!contract) contract = window.POE?.contract || null;
        if (!contract) return;
        await window.registerWallet(contract);
        await initializeDapp();
    });

    document.getElementById('generateHashButton')?.addEventListener('click', window.handleHashGeneration);
    document.getElementById('copyHashButton')?.addEventListener('click', () => {
        const hash = document.getElementById('hashResult')?.textContent || '';
        window.copyToClipboard(hash, 'copyHashButton');
    });

    document.getElementById('submitAnswer')?.addEventListener('click', () => {
        if (!contract) contract = window.POE?.contract || null;
        if (contract) window.submitAnswer(contract);
    });

    document.getElementById('uploadHashButton')?.addEventListener('click', () => {
        if (!contract) contract = window.POE?.contract || null;
        if (contract) window.handleAdminUpload(contract);
    });

    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('chainChanged', () => window.location.reload());
        window.ethereum.on('accountsChanged', () => window.location.reload());
    }

    window.addEventListener('poe:registered', initializeDapp);
    window.addEventListener('poe:walletChanged', initializeDapp);
});