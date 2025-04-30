let provider, signer, contract;

const contractAddress = "0x8b08da6119a27ffeacb0e0c65493705a4b113367"; // <- Replace this after deployment
let abi;

// Load ABI dynamically
fetch("abi/ProofOfEscape.json")
    .then((res) => res.json())
    .then((loadedAbi) => {
        abi = loadedAbi;
        initialize();
    });

function initialize() {
    document.getElementById("connectButton").onclick = connectWallet;
    document.getElementById("registerButton").onclick = register;
    document.getElementById("submitAnswer").onclick = submitAnswer;
}

function generateHash() {
    const input = document.getElementById("hashTestInput").value.trim().toLowerCase();
    const hash = ethers.keccak256(ethers.toUtf8Bytes(input));
    document.getElementById("hashResult").textContent = hash;
}

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();

        const address = await signer.getAddress(); // 👈 force signer resolution
        document.getElementById("walletAddress").textContent = address;

        // 👇 THIS is the magic line: treat address as literal, not ENS!
        const resolvedAddress = ethers.getAddress(contractAddress);

        // 🛠 construct contract object safely
        contract = new ethers.Contract(resolvedAddress, abi, signer);
    } else {
        alert("Please install MetaMask");
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
            alert("❌ Transaction was rejected by the user.");
        } else {
            alert("⚠️ Registration failed: " + (err?.reason || err?.message));
        }
        console.error("Register failed:", err);
    }
}

async function submitAnswer() {
    if (!contract) return alert("Connect wallet first");

    const quizId = document.getElementById("quizId").value;
    const answer = document.getElementById("answer").value.toLowerCase().trim();

    if (!answer) return alert("Please enter an answer");

    const hash = ethers.keccak256(ethers.toUtf8Bytes(answer));

    try {
        const tx = await contract.checkQuizAnswer(quizId, hash);
        const receipt = await tx.wait();
        const event = receipt.logs.find(log =>
            log.topics[0] === ethers.id("QuizCompleted(address,uint256,string)")
        );
        if (event) {
            document.getElementById("result").textContent = "✅ Correct answer! Token reward sent!";
        } else {
            document.getElementById("result").textContent = "❌ Answer submitted but was incorrect.";
        }
    } catch (err) {
        console.error(err);
        document.getElementById("result").textContent = "⚠️ Error submitting answer.";
    }
}