// js/mint.js

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
    if (!userAddress) return;

    try {
        document.getElementById("claimNFTButton").disabled = true;
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
            document.getElementById("claimNFTButton").style.display = "none";
        } else {
            throw new Error(data.error || "Minting failed");
        }

    } catch (err) {
        console.error("❌ Minting failed:", err);
        document.getElementById("mintStatus").textContent = "❌ Minting failed. See console for details.";
        document.getElementById("claimNFTButton").disabled = false;
    }
}

// Attach event listeners for updates
document.addEventListener('DOMContentLoaded', checkAndShowMintButton);
document.getElementById("connectButton").addEventListener('click', checkAndShowMintButton);
document.getElementById("claimNFTButton").addEventListener('click', claimNFTReward);
window.addEventListener('poe:walletChanged', checkAndShowMintButton);
window.addEventListener('poe:registered', checkAndShowMintButton);
window.addEventListener('poe:quizCompleted', checkAndShowMintButton);