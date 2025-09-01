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

                console.log("Contract:", contract);
                console.log("Available contract functions:", Object.keys(contract));
                console.log("Contract.interface.fragments:", contract.interface.fragments.map(f => f.name));

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
        try {
            // ✅ Ensure ABIs are loaded BEFORE connecting / building contracts
            if (typeof window.loadABIs === 'function') {
                await window.loadABIs();
                console.log("✅ ABIs loaded:", {
                    POE_ABI: window.POE_ABI,
                    NFT_ABI: window.NFT_ABI
                });
                if (!Array.isArray(window.POE_ABI)) {
                    throw new Error('POE_ABI did not load as an array');
                }
            }

            // Correct way to connect the wallet and get the global state
            await window.connectWallet();
            const poeContract = window.POE?.contract;
            const nftContract = window.NFT?.contract;

            if (!poeContract) {
                throw new Error('POE contract not initialized');
            }

            contract = poeContract;
            console.log("✅ Contract set:", contract);

            // 🔔 Add this block to forward the event to quiz.js
            contract.on('RewardMinted', (quizId, user, amount, event) => {
                const detail = { user, quizId, amount, event };
                console.log("🎉 RewardMinted event fired", detail);
                window.dispatchEvent(new CustomEvent('poe:rewardMinted', { detail }));
            });

            await initializeDapp();

        } catch (err) {
            console.error("Wallet connection or contract initialization failed:", err);
            connectButton && (connectButton.style.display = 'block');
            registerPrompt && (registerPrompt.style.display = 'none');
            quizSection && (quizSection.style.display = 'none');
            adminSection && (adminSection.style.display = 'none');
        }
    }

    // Buttons
    connectButton?.addEventListener('click', async () => {
        try {
            await window.connectWallet();
            const poeContract = window.POE?.contract;
            const nftContract = window.NFT?.contract;

            if (!poeContract) {
                throw new Error('POE contract not initialized');
            }

            contract = poeContract;
            await initializeDapp();
        } catch (err) {
            console.error("Wallet connection failed:", err);
        }
    });

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
        const poe = window.POE?.contract;
        if (poe) window.handleAdminUpload(poe);
    });

    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('chainChanged', () => window.location.reload());
        window.ethereum.on('accountsChanged', () => window.location.reload());
    }

    window.addEventListener('poe:registered', initializeDapp);
    window.addEventListener('poe:walletChanged', initializeDapp);
    // Optional sanity check
    if (!window.POE_ADDRESS || !window.NFT_ADDRESS) {
        console.error("❌ Contract address missing in config.js!");
    }
});