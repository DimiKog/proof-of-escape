// js/mint.js

import confetti from 'https://cdn.skypack.dev/canvas-confetti';

let mintInProgress = false;

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
    const sound = new Audio('../assets/sounds/success.mp3'); // Make sure this file exists
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

// Expose the function to the global scope so it can be called from main.js
window.claimNFTReward = claimNFTReward;