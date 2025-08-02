// main.js

let contract;

window.addEventListener('DOMContentLoaded', async () => {
    const connectButton = document.getElementById('connectButton');
    const registerPrompt = document.getElementById('registerPrompt');
    const quizSection = document.getElementById('quizSection');
    const adminSection = document.getElementById('adminSection');

    async function handleConnectionAndInitialization() {
        contract = await window.connectWallet();
        await initializeDapp();
    }

    // Initial check on page load
    //await handleConnectionAndInitialization();

    // Event listener for the "Connect Wallet" button
    connectButton?.addEventListener('click', handleConnectionAndInitialization);

    // Event listener for the "Register" button
    document.getElementById('registerButton')?.addEventListener('click', async () => {
        await window.registerWallet(contract);
        await initializeDapp(); // Re-initialize after registration
    });

    // Event listener for the "Generate Hash" button
    document.getElementById('generateHashButton')?.addEventListener('click', window.handleHashGeneration);

    // Event listener for the "Copy Hash" button
    document.getElementById('copyHashButton')?.addEventListener('click', () => {
        const hash = document.getElementById('hashResult').textContent;
        window.copyToClipboard(hash, 'copyHashButton');
    });

    // Event listener for the "Submit Answer" button
    document.getElementById('submitAnswer')?.addEventListener('click', () => {
        window.submitAnswer(contract);
    });

    // Event listener for the "Upload Hash" button (admin)
    document.getElementById('uploadHashButton')?.addEventListener('click', () => {
        window.handleAdminUpload(contract);
    });

    // Add listeners for MetaMask events
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('chainChanged', () => {
            console.log("Chain changed. Reloading page.");
            window.location.reload();
        });
        window.ethereum.on('accountsChanged', () => {
            console.log("Accounts changed. Reloading page.");
            window.location.reload();
        });
    }

    /**
     * Main function to handle all Dapp initialization logic.
     * This function now properly manages the UI visibility based on connection and registration status.
     */
    async function initializeDapp() {
        if (contract) {
            connectButton.style.display = 'none';
            const userAddress = window.getUserAddress();
            const isRegistered = await contract.registeredUsers(userAddress);
            const owner = await contract.owner();
            const isAdmin = userAddress.toLowerCase() === owner.toLowerCase();

            if (!isRegistered) {
                // User is connected but not registered
                quizSection.style.display = 'none';
                registerPrompt.style.display = 'block';
            } else {
                // User is connected and registered
                registerPrompt.style.display = 'none';
                quizSection.style.display = 'block';
                window.initializeQuizDropdown(contract);
            }

            if (isAdmin) {
                adminSection.style.display = 'block';
            } else {
                adminSection.style.display = 'none';
            }

        } else {
            // Unconnected state: show the connect button and hide everything else
            connectButton.style.display = 'block';
            registerPrompt.style.display = 'none';
            quizSection.style.display = 'none';
            adminSection.style.display = 'none';
        }
    }
});