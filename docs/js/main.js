// main.js

let contract;

window.addEventListener('DOMContentLoaded', async () => {
    const connectButton = document.getElementById('connectButton');
    const registerPrompt = document.getElementById('registerPrompt');
    const quizSection = document.getElementById('quizSection');
    const adminSection = document.getElementById('adminSection');

    // The single, authoritative function to update the UI
    async function updateUI() {
        try {
            const userAddress = window.getUserAddress?.();
            const poeContract = window.POE?.contract;

            // This check is crucial and is the primary gatekeeper for the UI.
            if (!userAddress || !poeContract) {
                connectButton.style.display = 'block';
                registerPrompt.style.display = 'none';
                quizSection.style.display = 'none';
                adminSection.style.display = 'none';
                document.getElementById('nftClaimSection').style.display = 'none';
                return;
            }

            connectButton.style.display = 'none';
            quizSection.style.display = 'block';

            const isRegistered = await poeContract.isRegistered(userAddress);
            registerPrompt.style.display = isRegistered ? 'none' : 'block';

            // Ensure quiz dropdown is always initialized with the current contract
            window.initializeQuizDropdown?.(poeContract);

            const owner = await poeContract.owner();
            const isAdmin = userAddress.toLowerCase() === String(owner).toLowerCase();
            adminSection.style.display = isAdmin ? 'block' : 'none';

            // --- NFT Logic (Check for required data before proceeding) ---
            const nftAddress = window.CONFIG?.POE_QUIZ_REWARD_NFT_ADDRESS;
            const nftAbi = window.ABIS?.PoEQuizRewardNFT;

            if (nftAddress && nftAbi) {
                const nftContractInstance = new ethers.Contract(
                    nftAddress,
                    nftAbi,
                    window.getProvider()
                );

                const alreadyMinted = await nftContractInstance.balanceOf(userAddress);
                if (alreadyMinted > 0n) {
                    document.getElementById("nftClaimSection").style.display = "block";
                    document.getElementById("claimNFTButton").style.display = "none";
                    document.getElementById("mintStatus").textContent = "You have already claimed your NFT reward.";
                } else {
                    const totalQuizzes = 10;
                    let completedCount = 0;
                    for (let i = 1; i <= totalQuizzes; i++) {
                        const isCompleted = await poeContract.completedQuizzes(userAddress, i);
                        if (isCompleted) {
                            completedCount++;
                        }
                    }

                    if (completedCount === totalQuizzes) {
                        document.getElementById("nftClaimSection").style.display = "block";
                        document.getElementById("claimNFTButton").style.display = "block";
                        document.getElementById("mintStatus").textContent = `Congratulations! You have completed all ${totalQuizzes} quizzes. Click the button to claim your NFT.`;
                    } else {
                        document.getElementById("nftClaimSection").style.display = "block";
                        document.getElementById("claimNFTButton").style.display = "none";
                        document.getElementById("mintStatus").textContent = `You have completed ${completedCount} of ${totalQuizzes} quizzes. Keep going!`;
                    }
                }
            } else {
                console.error("NFT contract address or ABI is missing.");
                document.getElementById("nftClaimSection").style.display = "none";
            }

        } catch (err) {
            console.error('updateUI error:', err);
            connectButton.style.display = 'block';
            registerPrompt.style.display = 'none';
            quizSection.style.display = 'none';
            adminSection.style.display = 'none';
        }
    }

    // Event Listeners
    connectButton?.addEventListener('click', async () => {
        await window.connectWallet();
        updateUI(); // Call updateUI only after connecting
    });

    document.getElementById('registerButton')?.addEventListener('click', async () => {
        if (window.POE?.contract) {
            await window.registerWallet(window.POE.contract);
            updateUI(); // Call updateUI after registering
        }
    });

    document.getElementById('submitAnswer')?.addEventListener('click', async () => {
        if (window.POE?.contract) {
            await window.submitAnswer(window.POE.contract);
            updateUI(); // Call updateUI after submitting an answer
        }
    });

    // Hash generation button
    document.getElementById('generateHashButton')?.addEventListener('click', () => {
        window.handleHashGeneration?.();
    });

    // Listen for events that change the UI state
    window.addEventListener('poe:walletChanged', updateUI);
    window.addEventListener('poe:registered', updateUI);
    window.addEventListener('poe:quizCompleted', updateUI);

    // Initial setup on page load
    await window.connectWallet();
    updateUI();
});