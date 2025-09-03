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

            // --- NFT Logic now centralized here ---
            await updateNFTSection();

        } catch (err) {
            console.error('updateUI error:', err);
            connectButton.style.display = 'block';
            registerPrompt.style.display = 'none';
            quizSection.style.display = 'none';
            adminSection.style.display = 'none';
        }
    }

    // New function to handle all NFT section logic
    async function updateNFTSection() {
        const userAddress = window.getUserAddress?.();
        const poeContract = window.POE?.contract;

        if (!userAddress || !poeContract) {
            document.getElementById("nftClaimSection").style.display = "none";
            return;
        }

        const nftAddress = window.CONFIG?.POE_QUIZ_REWARD_NFT_ADDRESS;
        const nftAbi = window.ABIS?.PoEQuizRewardNFT;

        if (!nftAddress || !nftAbi) {
            console.error("NFT contract address or ABI is missing.");
            document.getElementById("nftClaimSection").style.display = "none";
            return;
        }

        try {
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
                return;
            }

            const totalQuizzes = 10;
            const completionChecks = [];
            for (let i = 1; i <= totalQuizzes; i++) {
                completionChecks.push(poeContract.completedQuizzes(userAddress, i));
            }

            const completionResults = await Promise.all(completionChecks);
            let completedCount = 0;
            completionResults.forEach(isCompleted => {
                if (isCompleted) {
                    completedCount++;
                }
            });

            if (completedCount === totalQuizzes) {
                document.getElementById("nftClaimSection").style.display = "block";
                document.getElementById("claimNFTButton").style.display = "block";
                document.getElementById("mintStatus").textContent = `Congratulations! You have completed all ${totalQuizzes} quizzes. Click the button to claim your NFT.`;
            } else {
                document.getElementById("nftClaimSection").style.display = "block";
                document.getElementById("claimNFTButton").style.display = "none";
                document.getElementById("mintStatus").textContent = `You have completed ${completedCount} of ${totalQuizzes} quizzes. Keep going!`;
            }

        } catch (err) {
            console.error("Error checking NFT minting status:", err);
            document.getElementById("nftClaimSection").style.display = "block";
            document.getElementById("claimNFTButton").style.display = "none";
            document.getElementById("mintStatus").textContent = "Error checking completion status. See console for details.";
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

    // --- Add the NFT Claim Button Listener Here ---
    const claimNFTBtn = document.getElementById('claimNFTButton');
    if (claimNFTBtn) {
        claimNFTBtn.addEventListener('click', async () => {
            await window.claimNFTReward?.();
        });
    }

    // Listen for events that change the UI state
    window.addEventListener('poe:walletChanged', updateUI);
    window.addEventListener('poe:registered', updateUI);
    window.addEventListener('poe:quizCompleted', updateUI);

    // Initial setup on page load
    await window.connectWallet();
    updateUI();
});