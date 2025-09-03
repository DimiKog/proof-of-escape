import confetti from 'https://cdn.skypack.dev/canvas-confetti';
// js/mint.js

let cachedContract = null;
let mintInProgress = false;

// This function is the primary entry point to check the user's status and show the button
async function checkAndShowMintButton() {
    // Wait for the necessary contract ABIs and wallet connection
    await window.ABIS_READY;
    const poeContract = window.POE?.contract;
    const userAddress = window.getUserAddress();

    if (!poeContract || !userAddress) {
        document.getElementById("nftClaimSection").style.display = "none";
        return;
    }

    try {
        // Step 1: Check if the user has already minted an NFT
        const nftContractInstance = new ethers.Contract(
            window.CONFIG.POE_QUIZ_REWARD_NFT_ADDRESS,
            window.ABIS.PoEQuizRewardNFT,
            window.getProvider()
        );

        // Correctly check the BigInt return value
        const alreadyMinted = await nftContractInstance.balanceOf(userAddress);
        if (alreadyMinted > 0n) { // Use BigInt literal for comparison
            document.getElementById("nftClaimSection").style.display = "block";
            document.getElementById("claimNFTButton").style.display = "none";
            document.getElementById("mintStatus").textContent = "You have already claimed your NFT reward.";
            return;
        }

        // Step 2: Check the user's completion status on the Proof of Escape contract
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

        // Step 3: Show or hide the minting section based on the count
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

async function claimNFTReward() {
    const userAddress = await window.getUserAddress();
    if (mintInProgress) return;
    mintInProgress = true;
    if (!userAddress) return;

    try {
        document.getElementById("claimNFTButton").disabled = true;
        document.getElementById("claimNFTButton").classList.add("disabled");
        document.getElementById("mintStatus").textContent = "⏳ Requesting mint from backend...";

        const response = await fetch("https://mybackend.dimikog.org/mint-nft", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ to: userAddress }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            document.getElementById("mintStatus").innerHTML = `✅ NFT minted successfully!<br>Transaction Hash: <a href="https://blockexplorer.dimikog.org/tx/${data.result.transactionHash}" target="_blank">${data.result.transactionHash}</a>`;
            const btn = document.getElementById("claimNFTButton");
            btn.style.transition = "opacity 0.5s ease-out";
            btn.style.opacity = "0";
            setTimeout(() => btn.style.display = "none", 500);
            // 🎉 Trigger success animation
            triggerCelebration(data.result.transactionHash);
        } else {
            throw new Error(data.error || "Minting failed");
        }

    } catch (err) {
        console.error("❌ Minting failed:", err);
        document.getElementById("mintStatus").textContent = "❌ Minting failed. See console for details.";
        document.getElementById("claimNFTButton").classList.remove("disabled");
        document.getElementById("claimNFTButton").disabled = false;
        mintInProgress = false;
    }
}

// Attach event listeners for updates
document.addEventListener('DOMContentLoaded', checkAndShowMintButton);
document.getElementById("connectButton").addEventListener('click', checkAndShowMintButton);
document.getElementById("claimNFTButton").addEventListener('click', claimNFTReward);
window.addEventListener('poe:walletChanged', checkAndShowMintButton);
window.addEventListener('poe:registered', checkAndShowMintButton);
window.addEventListener('poe:quizCompleted', checkAndShowMintButton);

// Handles celebration animation, NFT image, and optional sound
function triggerCelebration(txHash) {
    // Optional: Add dual-side bursts confetti animation using canvas-confetti (assumes it's loaded in index.html)
    if (window.confetti) {
        confetti({
            particleCount: 200,
            angle: 60,
            spread: 100,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 200,
            angle: 120,
            spread: 100,
            origin: { x: 1 }
        });
    }

    // Optional: Play sound effect
    const sound = new Audio('/assets/sounds/success.mp3'); // Make sure this file exists
    sound.volume = 0.25;
    sound.play().catch(() => { });

    // Optional: Show NFT image
    const imgUrl = "https://bronze-secondary-catfish-124.mypinata.cloud/ipfs/bafkreifpmbtdq4c6wo6j2s3kbzlqlpohleifdfiw2bfcsbtwfzcwrvfjym"; // Replace with actual token image
    const previewHTML = `
        <div style="margin-top: 20px; text-align: center;">
            <img src="${imgUrl}" alt="Your NFT" style="max-width: 200px; border-radius: 12px; box-shadow: 0 0 15px rgba(0,0,0,0.2);" />
            <p><a href="https://blockexplorer.dimikog.org/tx/${txHash}" target="_blank" style="color: purple;">View on Explorer</a></p>
        </div>`;
    document.getElementById("mintStatus").insertAdjacentHTML('beforeend', previewHTML);
}