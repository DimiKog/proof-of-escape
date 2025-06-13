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
    });

const quizzes = [
    { id: 1, title: "🔍 Blockchain Fundamentals", description: "What is the core technology you are learning in this course?", reward: 10 },
    { id: 2, title: "🔍 Message in the Genesis", description: "Find the political title mentioned in the Genesis Block message.", reward: 10 }
];

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
    const container = document.getElementById("quizzesContainer");
    if (!container) return;

    container.innerHTML = "";
    const completed = getCompletedQuizzes();

    quizzes.forEach((quiz, index) => {
        const shouldDisplay = index === 0 || completed.includes(quizzes[index - 1].id);
        if (shouldDisplay && !completed.includes(quiz.id)) {
            const card = document.createElement("div");
            card.className = "quiz-card";
            card.innerHTML = `
                <h3>${quiz.title}</h3>
                <p>${quiz.description}</p>
                <p><strong>Reward:</strong> ${quiz.reward} ESCAPE tokens</p>
                <p><em>Use Quiz ID: ${quiz.id}</em></p>
            `;
            container.appendChild(card);
        }
    });
}

function initialize() {
    document.getElementById("connectButton").onclick = connectWallet;
    document.getElementById("registerButton").onclick = register;
    document.getElementById("submitAnswer").onclick = submitAnswer;
    document.getElementById("generateHashButton").onclick = generateHash;
    document.getElementById("copyHashButton").onclick = copyHashToClipboard;
    renderQuizzes();
}

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

async function connectWallet() {
    if (!window.ethereum) return alert("Please install MetaMask.");

    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();

    const address = await signer.getAddress();
    document.getElementById("walletAddress").textContent = address;

    contract = new ethers.Contract(contractAddress, abi, signer);
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
    if (!contract) return alert("Connect wallet first");

    const quizId = document.getElementById("quizId").value.trim();
    const userHash = document.getElementById("answer").value.trim().toLowerCase();

    if (!/^0x[0-9a-f]{64}$/.test(userHash)) {
        alert("❌ Invalid hash format.");
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
        } else {
            document.getElementById("result").textContent = "❌ Hash submitted but was incorrect.";
        }
    } catch (err) {
        console.error(err);
        document.getElementById("result").textContent = "⚠️ " + (err?.reason || err?.message);
    }
}