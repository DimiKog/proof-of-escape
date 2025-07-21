// Use contract address from config.js
const contractAddress = CONFIG.CONTRACT_ADDRESS;
let provider, signer, contract;
let abi;

// Load ABI
fetch("abi/ProofOfEscape.json")
    .then(res => res.json())
    .then(loadedAbi => {
        abi = loadedAbi;
        initialize();

        if (window.ethereum) {
            window.ethereum.on("accountsChanged", () => {
                window.location.reload(); // Force re-init everything on account switch
            });
        }
    });

let quizzes = [];

function loadQuizzes() {
    return fetch("quizzes.json")
        .then(res => res.json())
        .then(data => {
            quizzes = data;
        })
        .catch(err => console.error("Failed to load quizzes:", err));
}

function getCompletedQuizzes() {
    return JSON.parse(localStorage.getItem("completedQuizzes") || "[]");
}

function markQuizCompleted(id) {
    const completed = getCompletedQuizzes();
    if (!completed.includes(id)) {
        completed.push(id);
        localStorage.setItem("completedQuizzes", JSON.stringify(completed));
    }
}

function renderQuizzes() {
    const dropdown = document.getElementById("quizDropdown");
    const completed = getCompletedQuizzes();
    dropdown.innerHTML = '<option value="">-- Select Quiz --</option>';

    quizzes.forEach((quiz, index) => {
        const isUnlocked = index === 0 || completed.includes(quizzes[index - 1].id);
        const isCompleted = completed.includes(quiz.id);

        if (isUnlocked && !isCompleted) {
            const option = document.createElement("option");
            option.value = quiz.id;
            option.textContent = `#${quiz.id} - ${quiz.title}`;
            dropdown.appendChild(option);
        }
    });
}

function startQuiz(id) {
    document.getElementById("quizId").value = id;
    document.getElementById("quizIdDisplay").textContent = "Quiz ID: " + id;
    document.getElementById("answer").focus();
    document.getElementById("answerSection").scrollIntoView({ behavior: "smooth" });
}

async function initialize() {
    document.getElementById("connectButton").onclick = connectWallet;
    document.getElementById("registerButton").onclick = register;
    document.getElementById("submitAnswer").onclick = submitAnswer;
    document.getElementById("generateHashButton").onclick = generateHash;
    document.getElementById("copyHashButton").onclick = copyHashToClipboard;

    await loadQuizzes(); // load quizzes after contract is ready

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
    await initAdminPanel();

    renderQuizzes();

    // Clear quiz display on load
    document.getElementById("quizDescription").textContent = "";
    document.getElementById("quizHint").innerHTML = "";
    document.getElementById("quizReward").innerHTML = "";
    document.getElementById("quizDetails").style.display = "none";
    document.getElementById("quizIdDisplay").textContent = "";

    createNetworkInstructionsToggle();
}

document.getElementById("quizDropdown").addEventListener("change", event => {
    const id = parseInt(event.target.value);
    const quiz = quizzes.find(q => q.id === id);

    if (quiz) {
        document.getElementById("quizDescription").textContent = quiz.description;
        document.getElementById("quizHint").innerHTML = `<span class="quiz-hint">Hint:</span> ${quiz.hashHint || ""}`;
        document.getElementById("quizReward").innerHTML = `<span class="quiz-reward">Reward: ${quiz.reward || "10"} ESCAPE tokens</span>`;
        if (quiz.details) {
            document.getElementById("quizDetailsContent").textContent = quiz.details;
            document.getElementById("quizDetails").style.display = "block";
        } else {
            document.getElementById("quizDetails").style.display = "none";
        }

        document.getElementById("startQuizBtn").onclick = () => startQuiz(quiz.id);
    }
});

function generateHash() {
    const input = document.getElementById("hashTestInput").value.trim().toLowerCase();
    const hash = ethers.keccak256(ethers.toUtf8Bytes(input));
    document.getElementById("hashResult").textContent = hash;
}

function copyHashToClipboard() {
    const hashText = document.getElementById("hashResult").textContent.trim();

    if (!hashText || !/^0x[0-9a-f]{64}$/.test(hashText)) {
        alert("⚠️ No valid hash to copy!");
        return;
    }

    // Paste into answer field
    document.getElementById("answer").value = hashText;

    // Also copy to clipboard
    navigator.clipboard.writeText(hashText)
        .then(() => alert("✅ Hash copied and pasted into the answer field!"))
        .catch(() => alert("❌ Failed to copy hash."));
}

const targetChainId = '0x67932'; // 424242 in hex

async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert("MetaMask is not installed!");
        return;
    }

    try {
        const currentChainId = await ethereum.request({ method: 'eth_chainId' });

        if (currentChainId !== targetChainId) {
            try {
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: targetChainId }]
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    try {
                        await ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: targetChainId,
                                chainName: 'QBFT_Besu_EduNet',
                                rpcUrls: ['http://195.251.92.200/rpc/'],
                                nativeCurrency: {
                                    name: 'EduD',
                                    symbol: 'EDU-D',
                                    decimals: 18
                                },
                                blockExplorerUrls: ['http://83.212.76.39']
                            }]
                        });
                    } catch (addError) {
                        console.error("Failed to add network", addError);
                        alert("⚠️ Failed to add QBFT_Besu_EduNet. Please add it manually in MetaMask.");
                        return;
                    }
                } else {
                    console.error("Failed to switch network", switchError);
                    alert("⚠️ Failed to switch to QBFT_Besu_EduNet. Please add it manually in MetaMask.");
                    return;
                }
            }
        }

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        document.getElementById('walletAddress').textContent = accounts[0];
    } catch (error) {
        console.error("Error during wallet connection", error);
        alert("⚠️ Could not connect wallet. Check console for details.");
    }
}

async function checkNetworkMismatch() {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== "0x67932") {
        alert("⚠️ You are connected to the wrong network. Please switch to QBFT_Besu_EduNet.");
    }
}

async function register() {
    if (!contract) return alert("Connect wallet first");

    try {
        const tx = await contract.register();
        await tx.wait();
        alert("✅ You are now registered!");
    } catch (err) {
        if (err?.code === 4001) {
            alert("❌ Transaction rejected.");
        } else {
            alert("⚠️ Registration failed: " + (err?.reason || err?.message));
        }
        console.error(err);
    }
}

async function submitAnswer() {
    const submitBtn = document.getElementById("submitAnswer");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    if (!contract) {
        alert("Connect wallet first");
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
        return;
    }

    const quizId = document.getElementById("quizId").value.trim();
    const userHash = document.getElementById("answer").value.trim().toLowerCase();

    if (!/^0x[0-9a-f]{64}$/.test(userHash)) {
        alert("❌ Invalid hash format.");
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
        return;
    }

    try {
        const tx = await contract.checkQuizAnswer(quizId, userHash);
        const receipt = await tx.wait();
        const event = receipt.logs.find(log =>
            log.topics[0] === ethers.id("QuizCompleted(address,uint256,string)")
        );
        if (event) {
            document.getElementById("result").textContent = "✅ Correct hash submitted! Token reward sent!";
            markQuizCompleted(parseInt(quizId));
            renderQuizzes();
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit";
        } else {
            document.getElementById("result").textContent = "❌ Hash submitted but was incorrect.";
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit";
        }
    } catch (err) {
        console.error(err);
        document.getElementById("result").textContent = "⚠️ " + (err?.reason || err?.message);
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
    }
}

async function initAdminPanel() {
    const adminSection = document.getElementById("adminSection");
    const uploadButton = document.getElementById("uploadHashButton");
    const uploadStatus = document.getElementById("uploadStatus");

    if (!signer || !contract) return;

    try {
        const currentUser = await signer.getAddress();
        const owner = await contract.owner();

        if (currentUser.toLowerCase() === owner.toLowerCase()) {
            adminSection.style.display = "block";
            console.log("🛡️ Admin wallet connected.");

            uploadButton.onclick = async () => {
                const quizId = parseInt(document.getElementById("adminQuizId").value.trim());
                const plainAnswer = document.getElementById("adminPlainAnswer").value.trim().toLowerCase();

                if (!quizId || !plainAnswer) {
                    uploadStatus.textContent = "❌ Please fill in both fields.";
                    return;
                }

                try {
                    const hash = ethers.keccak256(ethers.toUtf8Bytes(plainAnswer));
                    const tx = await contract.setQuizHash(quizId, hash);
                    await tx.wait();
                    uploadStatus.textContent = `✅ Uploaded hash for Quiz ${quizId}: ${hash}`;
                    document.getElementById("adminPlainAnswer").value = ""; // Clear the plain answer for security
                } catch (err) {
                    console.error(err);
                    uploadStatus.textContent = `❌ Error uploading hash: ${err.message}`;
                }
            };
        } else {
            adminSection.style.display = "none"; // ensure it is hidden
        }
    } catch (err) {
        console.error("Error checking admin:", err);
    }
}

function createNetworkInstructionsToggle() {
    const container = document.getElementById("networkInstructionsContainer");
    if (!container) return;

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "ℹ️ Show Network Instructions";
    toggleBtn.className = "toggle-instructions-btn";

    const instructionsDiv = document.createElement("div");
    instructionsDiv.style.display = "none";
    instructionsDiv.innerHTML = `
        <h3>🌐 Add Besu Network to MetaMask</h3>
        <table class="network-instructions">
            <tr><td><b>Network Name</b></td><td>QBFT_Besu_EduNet</td></tr>
            <tr><td><b>New RPC URL</b></td><td><code>http://195.251.92.200/rpc/</code></td></tr>
            <tr><td><b>Chain ID</b></td><td>424242</td></tr>
            <tr><td><b>Currency Symbol</b></td><td>EDU-D</td></tr>
            <tr><td><b>Block Explorer URL</b></td><td><code>http://83.212.76.39</code></td></tr>
        </table>
    `;

    toggleBtn.onclick = () => {
        if (instructionsDiv.style.display === "none") {
            instructionsDiv.style.display = "block";
            toggleBtn.textContent = "❌ Hide Network Instructions";
        } else {
            instructionsDiv.style.display = "none";
            toggleBtn.textContent = "ℹ️ Show Network Instructions";
        }
    };

    container.appendChild(toggleBtn);
    container.appendChild(instructionsDiv);
}