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
    document.getElementById("copyHashButton").onclick = copyHashToClipboard;
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

    const quizId = document.getElementById("quizId").value.trim();
    const userHash = document.getElementById("answer").value.trim().toLowerCase();

    if (!userHash) return alert("Please enter a hash");

    // Validate format: must be 66 characters and start with 0x
    if (!/^0x[0-9a-f]{64}$/.test(userHash)) {
        alert("❌ Invalid hash format. Please paste a valid keccak256 hash starting with 0x.");
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
        } else {
            document.getElementById("result").textContent = "❌ Hash submitted but answer was incorrect.";
        }
    } catch (err) {
        console.error(err);
        document.getElementById("result").textContent = "⚠️ " + (err?.reason || err?.message);
    }
}

function copyHashToClipboard() {
    const hashElement = document.getElementById("hashResult");
    const answerInput = document.getElementById("answer");

    const hashText = hashElement?.textContent.trim();

    if (!hashText || !/^0x[0-9a-f]{64}$/i.test(hashText)) {
        alert("⚠️ No valid hash found to copy!");
        return;
    }

    try {
        // Paste hash into the answer input field
        answerInput.value = hashText;

        // Copy to clipboard
        navigator.clipboard.writeText(hashText)
            .then(() => alert("✅ Hash copied and pasted into the answer field!"))
            .catch(() => alert("❌ Failed to copy hash to clipboard."));
    } catch (e) {
        console.error("Clipboard/paste error:", e);
        alert("❌ Unexpected error occurred.");
    }
}