// main.js

let contract;

/**
 * Main function to handle all Dapp initialization logic after a successful connection.
 * This combines and expands upon the original controlVisibility logic.
 */
async function initializeDapp() {
    // A quick check to see if the contract instance is available.
    // The `contract` variable is set by `window.connectWallet()`.
    if (!contract) {
        console.error("Contract instance not found. Dapp cannot be initialized.");
        // Hide all Dapp sections as there's no connection.
        document.getElementById('quizSection').style.display = 'none';
        document.getElementById('adminSection').style.display = 'none';
        document.getElementById('registerPrompt').style.display = 'block';
        document.getElementById('registerButton').style.display = 'none';
        return;
    }

    const userAddress = window.getUserAddress();
    if (!userAddress) {
        // If wallet is not connected, hide everything.
        document.getElementById('quizSection').style.display = 'none';
        document.getElementById('adminSection').style.display = 'none';
        document.getElementById('registerPrompt').style.display = 'block';
        return;
    }

    try {
        const isRegistered = await contract.registeredUsers(userAddress);
        const owner = await contract.owner();
        const isAdmin = userAddress.toLowerCase() === owner.toLowerCase();

        // Handle visibility for registered vs. unregistered users
        if (!isRegistered) {
            document.getElementById('quizSection').style.display = 'none';
            document.getElementById('registerPrompt').style.display = 'block';
            document.getElementById('registerButton').style.display = 'inline-block';
            // Disable quiz dropdown for unregistered users
            document.getElementById('quizDropdown').disabled = true;
            document.getElementById('registrationNotice').style.display = 'block';
        } else {
            document.getElementById('quizSection').style.display = 'block';
            document.getElementById('registerPrompt').style.display = 'none';
            document.getElementById('registerButton').style.display = 'none';
            // Enable quiz dropdown and populate quizzes
            document.getElementById('quizDropdown').disabled = false;
            document.getElementById('registrationNotice').style.display = 'none';
            // Call the function from quiz.js to load the quizzes.
            window.initializeQuizDropdown(contract);
        }

        // Handle admin panel visibility
        if (isAdmin) {
            document.getElementById('adminSection').style.display = 'block';
        } else {
            document.getElementById('adminSection').style.display = 'none';
        }

    } catch (error) {
        console.error("Error during Dapp initialization:", error);
        // Show an error message to the user
        // Note: The `window.showTempMessage` is from `utils.js`
        window.showTempMessage('walletStatus', '⚠️ Error initializing Dapp. Please check console.', 5000, true);
        // Fallback to hiding everything if there's an error
        document.getElementById('quizSection').style.display = 'none';
        document.getElementById('adminSection').style.display = 'none';
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    // Attempt to connect the wallet on page load.
    contract = await window.connectWallet();

    // Initialize the Dapp based on the connection status.
    await initializeDapp();

    // Event listener for the "Connect Wallet" button
    document.getElementById('connectButton')?.addEventListener('click', async () => {
        contract = await window.connectWallet();
        await initializeDapp();
    });

    // Event listener for the "Register" button
    document.getElementById('registerButton')?.addEventListener('click', async () => {
        await window.registerWallet(contract);
        await initializeDapp();
    });

    // Event listener for the "Generate Hash" button
    document.getElementById('generateHashButton')?.addEventListener('click', window.handleHashGeneration);

    // Event listener for the "Copy Hash" button
    document.getElementById('copyHashButton')?.addEventListener('click', () => {
        const hash = document.getElementById('hashResult').textContent;
        // Call the utility function to copy the hash
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
});