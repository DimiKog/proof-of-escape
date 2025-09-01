// main.js

let contract;

window.addEventListener('DOMContentLoaded', async () => {
    const connectButton = document.getElementById('connectButton');
    const registerPrompt = document.getElementById('registerPrompt');
    const quizSection = document.getElementById('quizSection');
    const adminSection = document.getElementById('adminSection');

    // Ensure ABIs are loaded first
    await window.loadABIs?.();
    window.ABIS_READY = Promise.resolve();

    async function updateUI() {
        try {
            const userAddress = window.getUserAddress?.();
            const poeContract = window.POE?.contract;

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
            window.initializeQuizDropdown?.(poeContract);

            const owner = await poeContract.owner();
            const isAdmin = userAddress.toLowerCase() === String(owner).toLowerCase();
            adminSection.style.display = isAdmin ? 'block' : 'none';

            console.log("✅ NFT Address:", window.CONFIG.POE_QUIZ_REWARD_NFT_ADDRESS);
            console.log("✅ NFT ABI:", window.ABIS?.PoEQuizRewardNFT);

            // --- NFT Logic (Now integrated) ---
            const nftContractInstance = new ethers.Contract(
                window.CONFIG.POE_QUIZ_REWARD_NFT_ADDRESS,
                window.ABIS.PoEQuizRewardNFT,
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

    // ... (other event listeners)

    window.addEventListener('poe:walletChanged', updateUI);
    window.addEventListener('poe:registered', updateUI);
    window.addEventListener('poe:quizCompleted', updateUI);

    // Initial setup on page load
    await window.connectWallet();
    updateUI();
});