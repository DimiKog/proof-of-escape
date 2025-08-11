// main.js

let contract;

window.addEventListener('DOMContentLoaded', async () => {
    const connectButton = document.getElementById('connectButton');
    const registerPrompt = document.getElementById('registerPrompt'); // may be null; handled below
    const quizSection = document.getElementById('quizSection');       // may be null; handled below
    const adminSection = document.getElementById('adminSection');     // may be null; handled below

    async function handleConnectionAndInitialization() {
        // Try to connect
        const c = await window.connectWallet();
        // Prefer the contract returned, else grab from global stash (set by wallet.js)
        contract = c || window.POE?.contract || null;
        await initializeDapp();
    }

    // THIS IS THE CRITICAL MISSING PIECE
    try {
        await handleConnectionAndInitialization();
    } catch (error) {
        console.error('Error during initial connection and initialization:', error);
    }

    // Button: Connect
    connectButton?.addEventListener('click', handleConnectionAndInitialization);

    // Button: Register
    document.getElementById('registerButton')?.addEventListener('click', async () => {
        if (!contract) {
            // Attempt to recover a contract from POE if we have it
            contract = window.POE?.contract || null;
            if (!contract) return;
        }
        await window.registerWallet(contract);
        await initializeDapp(); // Re-init after successful registration
    });

    // Hash tools
    document.getElementById('generateHashButton')?.addEventListener('click', window.handleHashGeneration);
    document.getElementById('copyHashButton')?.addEventListener('click', () => {
        const hash = document.getElementById('hashResult')?.textContent || '';
        window.copyToClipboard(hash, 'copyHashButton');
    });

    // Submit answer
    document.getElementById('submitAnswer')?.addEventListener('click', () => {
        if (!contract) contract = window.POE?.contract || null;
        if (contract) window.submitAnswer(contract);
    });

    // Admin upload
    document.getElementById('uploadHashButton')?.addEventListener('click', () => {
        if (!contract) contract = window.POE?.contract || null;
        if (contract) window.handleAdminUpload(contract);
    });

    // MetaMask events
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('chainChanged', () => window.location.reload());
        window.ethereum.on('accountsChanged', () => window.location.reload());
    }

    // Also respond to our own app events (from wallet.js)
    window.addEventListener('poe:registered', initializeDapp);
    window.addEventListener('poe:walletChanged', initializeDapp);

    async function initializeDapp() {
        try {
            // Refresh local reference just in case wallet.js updated it
            if (!contract) contract = window.POE?.contract || null;

            if (contract) {
                // Connected state
                connectButton && (connectButton.style.display = 'none');

                const userAddress = window.getUserAddress?.();
                if (!userAddress) {
                    // No address yet; show connect button
                    connectButton && (connectButton.style.display = 'block');
                    registerPrompt && (registerPrompt.style.display = 'none');
                    quizSection && (quizSection.style.display = 'none');
                    adminSection && (adminSection.style.display = 'none');
                    return;
                }

                // NOTE: new contract uses `isRegistered`, not `registeredUsers`
                const isRegistered = await contract.isRegistered(userAddress);

                // Owner getter exists for public immutable
                const owner = await contract.owner();
                const isAdmin = owner && userAddress.toLowerCase() === String(owner).toLowerCase();

                if (!isRegistered) {
                    // Connected but not registered
                    quizSection && (quizSection.style.display = 'none');
                    registerPrompt && (registerPrompt.style.display = 'block');
                } else {
                    // Registered: show quizzes and hydrate dropdown
                    registerPrompt && (registerPrompt.style.display = 'none');
                    quizSection && (quizSection.style.display = 'block');
                    window.initializeQuizDropdown?.(contract);
                }

                adminSection && (adminSection.style.display = isAdmin ? 'block' : 'none');
            } else {
                // Unconnected
                connectButton && (connectButton.style.display = 'block');
                registerPrompt && (registerPrompt.style.display = 'none');
                quizSection && (quizSection.style.display = 'none');
                adminSection && (adminSection.style.display = 'none');
            }
        } catch (err) {
            console.error('initializeDapp error:', err);
            // Fail-safe UI: keep connect visible
            connectButton && (connectButton.style.display = 'block');
            registerPrompt && (registerPrompt.style.display = 'none');
            quizSection && (quizSection.style.display = 'none');
            adminSection && (adminSection.style.display = 'none');
        }
    }
});