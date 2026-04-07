
import { addBesuNetwork } from './network.js';
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
        const returnBase = "https://web3edu.dimikog.org/#/labs/proof-of-escape";
        const buildReturnUrl = async (tokenId) => {
            const POE_CONTRACT_ADDRESS = window.POE_ADDRESS || window.CONFIG?.CONTRACT_ADDRESS || "";
            let chainId = window.CONFIG?.CHAIN_ID;
            if (!chainId && window.POE?.provider?.getNetwork) {
                const net = await window.POE.provider.getNetwork();
                chainId = Number(net.chainId);
            }

            const params = new URLSearchParams({
                source: "poe",
                contract: POE_CONTRACT_ADDRESS,
                chainId: chainId ? chainId.toString() : "",
                tokenId: tokenId ? tokenId.toString() : ""
            });

            return `${returnBase}?${params.toString()}`;
        };
        const showReturnLink = async (tokenId) => {
            const returnWrapper = document.getElementById("returnToWeb3Edu");
            const link = document.getElementById("returnLink");
            if (!returnWrapper || !link) return;
            const storedReturn = (() => {
                try {
                    return localStorage.getItem("poeReturnUrl");
                } catch (err) {
                    return "";
                }
            })();
            try {
                link.href = tokenId || storedReturn ? await buildReturnUrl(tokenId) : returnBase;
            } catch (err) {
                link.href = storedReturn || returnBase;
            }
            returnWrapper.style.display = "block";
        };

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
                const claimButton = document.getElementById("claimNFTButton");
                claimButton.style.display = "inline-block";
                claimButton.disabled = true;
                claimButton.classList.add("disabled");
                claimButton.dataset.mode = "claimed";
                claimButton.textContent = "NFT Reward Claimed";
                document.getElementById("mintIntro").textContent = "You have already claimed your NFT reward.";
                let tokenId = "";
                try {
                    tokenId = localStorage.getItem("poeTokenId") || "";
                } catch (err) {
                    tokenId = "";
                }

                if (!tokenId) {
                    try {
                        const filter = nftContractInstance.filters.Transfer(ethers.ZeroAddress, userAddress);
                        const logs = await nftContractInstance.queryFilter(filter, 0, "latest");
                        if (logs && logs.length > 0) {
                            const minted = logs[0]?.args?.tokenId;
                            if (minted != null) {
                                tokenId = minted.toString();
                                try {
                                    localStorage.setItem("poeTokenId", tokenId);
                                } catch (err) {
                                    // Ignore localStorage failures
                                }
                            }
                        }
                    } catch (err) {
                        console.warn("Unable to resolve tokenId from logs.", err);
                    }
                }

                document.getElementById("mintStatus").textContent = tokenId
                    ? `You have already claimed your NFT reward. Token ID: ${tokenId}`
                    : "You have already claimed your NFT reward.";
                await showReturnLink(tokenId);
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
                const claimButton = document.getElementById("claimNFTButton");
                claimButton.style.display = "inline-block";
                claimButton.disabled = false;
                claimButton.classList.remove("disabled");
                claimButton.dataset.mode = "claim";
                claimButton.textContent = "Claim NFT Reward";
                document.getElementById("mintIntro").textContent = `Congratulations on solving all ${totalQuizzes} quizzes! Click the button below to claim your NFT reward.`;
                document.getElementById("mintStatus").textContent = `Congratulations! You have completed all ${totalQuizzes} quizzes. Click the button to claim your NFT.`;
                const returnWrapper = document.getElementById("returnToWeb3Edu");
                if (returnWrapper) returnWrapper.style.display = "none";
            } else {
                document.getElementById("nftClaimSection").style.display = "block";
                const claimButton = document.getElementById("claimNFTButton");
                claimButton.style.display = "inline-block";
                claimButton.disabled = true;
                claimButton.classList.add("disabled");
                claimButton.dataset.mode = "locked";
                claimButton.textContent = "🔒 Claim NFT Reward (Locked)";
                document.getElementById("mintIntro").textContent = `Complete all ${totalQuizzes} quizzes to unlock your NFT reward.`;
                document.getElementById("mintStatus").textContent = `You have completed ${completedCount} of ${totalQuizzes} quizzes. Keep going!`;
                const returnWrapper = document.getElementById("returnToWeb3Edu");
                if (returnWrapper) returnWrapper.style.display = "none";
            }

        } catch (err) {
            console.error("Error checking NFT minting status:", err);
            document.getElementById("nftClaimSection").style.display = "block";
            const claimButton = document.getElementById("claimNFTButton");
            claimButton.style.display = "inline-block";
            // Do NOT permanently lock on a transient RPC error — let the user retry.
            claimButton.disabled = false;
            claimButton.classList.remove("disabled");
            claimButton.dataset.mode = "retry-status";
            claimButton.textContent = "Retry: Check NFT Status";
            document.getElementById("mintIntro").textContent = "Could not verify quiz completion. Check your connection and try again.";
            document.getElementById("mintStatus").textContent = `⚠️ RPC error while checking status: ${err?.shortMessage || err?.message || "unknown error"}`;
            const returnWrapper = document.getElementById("returnToWeb3Edu");
            if (returnWrapper) returnWrapper.style.display = "none";
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
            try {
                const mode = claimNFTBtn.dataset.mode || "claim";
                if (mode === "retry-status") {
                    claimNFTBtn.disabled = true;
                    claimNFTBtn.classList.add("disabled");
                    document.getElementById("mintStatus").textContent = "⏳ Re-checking NFT eligibility...";
                    await updateUI();
                    return;
                }
                if (mode === "locked" || mode === "claimed") {
                    return;
                }
                await window.claimNFTReward?.();
            } catch (error) {
                console.error('An error occurred during the NFT claim process:', error);
                document.getElementById("mintStatus").textContent = "❌ Minting failed. See console for details.";
                // Re-enable the button in case of an error
                claimNFTBtn.disabled = false;
                claimNFTBtn.classList.remove("disabled");
            }
        });
    }

    // Listen for events that change the UI state
    window.addEventListener('poe:walletChanged', updateUI);
    window.addEventListener('poe:registered', updateUI);
    window.addEventListener('poe:quizCompleted', updateUI);

    // Initial setup on page load

    // --- Handle Dark Theme Toggle ---
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    await addBesuNetwork();
    await window.connectWallet();
    updateUI();
});
