// js/mint.js

import confetti from 'https://cdn.skypack.dev/canvas-confetti';

let mintInProgress = false;
const MINT_REQUEST_TIMEOUT_MS = 45000;

function hideReturnToWeb3EduLink() {
    const wrapper = document.getElementById("returnToWeb3Edu");
    if (wrapper) wrapper.style.display = "none";
}

async function parseBodySafe(response) {
    const raw = await response.text();
    if (!raw) return { data: null, raw: "" };
    try {
        return { data: JSON.parse(raw), raw };
    } catch (err) {
        return { data: null, raw };
    }
}

async function requestMintFromBackend(userAddress) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), MINT_REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch("https://mybackend.dimikog.org/mint-nft", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ to: userAddress }),
            signal: controller.signal
        });

        const { data, raw } = await parseBodySafe(response);
        return { response, data, raw };
    } catch (err) {
        if (err?.name === "AbortError") {
            throw new Error("Mint request timed out. Please try again.");
        }
        throw err;
    } finally {
        clearTimeout(timeoutId);
    }
}

async function claimNFTReward() {
    const userAddress = await window.getUserAddress();
    if (mintInProgress) return;
    if (!userAddress) return;
    mintInProgress = true;

    try {
        document.getElementById("claimNFTButton").disabled = true;
        document.getElementById("claimNFTButton").classList.add("disabled");
        document.getElementById("mintStatus").textContent = "⏳ Requesting mint from backend (up to 45s)...";

        const { response, data, raw } = await requestMintFromBackend(userAddress);

        const txHash = data?.result?.transactionHash;

        if (response.ok && data.success && txHash) {
            document.getElementById("mintStatus").innerHTML = `✅ NFT minted successfully!<br>Transaction Hash: <a href="https://blockexplorer.dimikog.org/tx/${txHash}" target="_blank">${txHash}</a>`;
            const btn = document.getElementById("claimNFTButton");
            btn.style.opacity = "1";
            btn.style.display = "inline-block";
            btn.disabled = true;
            btn.classList.add("disabled");
            btn.textContent = "NFT Reward Claimed";
            // 🎉 Trigger success animation
            triggerCelebration(txHash);
            const tokenId = resolveTokenId(data.result);
            await showReturnToWeb3EduLink(tokenId);
        } else {
            const backendMessage = data?.error || data?.message;
            const htmlLikeResponse = typeof raw === "string" && raw.trim().startsWith("<");
            const fallbackMessage = response.ok
                ? "Minting failed"
                : `Backend request failed (${response.status})`;
            const detail = backendMessage
                ? `${fallbackMessage}: ${backendMessage}`
                : htmlLikeResponse
                    ? `${fallbackMessage}: server returned non-JSON error page`
                    : fallbackMessage;
            throw new Error(detail);
        }

    } catch (err) {
        console.error("❌ Minting failed:", err);
        document.getElementById("mintStatus").textContent = `❌ ${err?.message || "Minting failed. See console for details."}`;
        hideReturnToWeb3EduLink();
        const btn = document.getElementById("claimNFTButton");
        btn.style.opacity = "1";
        btn.style.display = "inline-block";
        btn.classList.remove("disabled");
        btn.disabled = false;
    } finally {
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
    const sound = new Audio('https://dimikog.github.io/proof-of-escape/assets/sounds/success.mp3');// Make sure this file exists
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

function resolveTokenId(mintResult) {
    if (!mintResult || typeof mintResult !== "object") return "";

    if (mintResult.tokenId != null) return mintResult.tokenId;

    if (mintResult.token_id != null || mintResult.tokenID != null) {
        console.warn('Mint response uses non-standard tokenId key. Expected "tokenId".', {
            keys: Object.keys(mintResult)
        });
        return mintResult.token_id ?? mintResult.tokenID;
    }

    console.warn('Mint response missing "tokenId".', { keys: Object.keys(mintResult) });
    return "";
}

async function showReturnToWeb3EduLink(tokenId) {
    const returnBase = "https://web3edu.dimikog.org/#/labs/proof-of-escape";
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
        tokenId: tokenId?.toString() || ""
    });

    const returnUrl = `${returnBase}?${params.toString()}`;
    try {
        localStorage.setItem("poeReturnUrl", returnUrl);
        if (tokenId != null && tokenId !== "") {
            localStorage.setItem("poeTokenId", tokenId.toString());
        }
    } catch (err) {
        console.warn("Unable to persist return URL.", err);
    }

    const link = document.getElementById("returnLink");
    if (!link) return;
    link.href = returnUrl;
    document.getElementById("returnToWeb3Edu").style.display = "block";
}

// Expose the function to the global scope so it can be called from main.js
window.claimNFTReward = claimNFTReward;
