// js/submit.js
async function submitQuiz() {
    await window.ABIS_READY;

    if (!window.CORRECT_ANSWERS || window.CORRECT_ANSWERS.length !== 10) {
        alert("Quiz answers not loaded correctly.");
        return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const address = await signer.getAddress();
    const contract = new ethers.Contract(
        window.CONFIG.POE_QUIZ_REWARD_NFT_ADDRESS,
        window.ABIS.PoEQuizRewardNFT,
        signer
    );

    const alreadyMinted = (await contract.balanceOf(address)).toNumber();
    if (alreadyMinted > 0) {
        alert("You already own the NFT.");
        return;
    }

    let score = 0;
    for (let i = 1; i <= 10; i++) {
        const answer = document.querySelector(`input[name="q${i}"]:checked`);
        if (answer && answer.value === window.CORRECT_ANSWERS[i - 1]) {
            score++;
        }
    }

    if (score === 10) {
        window.NFT_CLAIM_ADDRESS = address; // store for later use
        document.getElementById("claimNFTButton").style.display = "block";
    } else {
        document.getElementById("claimNFTButton").style.display = "none";
    }

    alert(`You scored ${score} out of 10.`);
}

async function claimNFTReward() {
    await window.ABIS_READY;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
        window.CONFIG.POE_QUIZ_REWARD_NFT_ADDRESS,
        window.ABIS.PoEQuizRewardNFT,
        signer
    );

    const address = window.NFT_CLAIM_ADDRESS;
    if (!address) {
        alert("No claimable address found. Please complete the quiz first.");
        return;
    }

    try {
        document.getElementById("claimNFTButton").disabled = true;
        const tx = await contract.mintReward(address);
        const receipt = await tx.wait();

        alert(`✅ NFT minted successfully!\nTransaction Hash:\n${receipt.hash}`);
        document.getElementById("claimNFTButton").style.display = "none";
    } catch (err) {
        console.error("Minting failed:", err);
        alert("❌ Minting failed. See console for details.");
    }
}