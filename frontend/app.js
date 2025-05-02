let provider, signer, contract;
const contractAddress = "0x8b08da6119a27ffeacb0e0c65493705a4b113367";
let abi;

// Load ABI
fetch("abi/ProofOfEscape.json")
    .then(res => res.json())
    .then(loadedAbi => {
        abi = loadedAbi;
        initialize();
    });

function initialize() {
    document.getElementById("connectButton").onclick = connectWallet;
    document.getElementById("registerButton").onclick = register;
    document.getElementById("submitAnswer").onclick = submitAnswer;
    document.getElementById("generateHashButton").onclick = generateHash;
    document.getElementById("copyHashButton").onclick = copyHashToClipboard;
}

function generateHash() {
    const input = document.getElementById("hashTestInput").value.trim().toLowerCase();
    const hash = ethers.keccak256(ethers.toUtf8Bytes(input));
    document.getElementById("hashResult").textContent = hash;
}

function copyHashToClipboard() {
    const hashText = document.getElementById("hashResult").textContent.trim();

    if (!/^0x[0-9a-f]{64}$/i.test(hashText)) {
        alert("⚠️ No valid hash to copy.");
        return;
    }

    // Set the value in the answer input field
    document.getElementById("answer").value = hashText;

    // Also copy to clipboard
    navigator.clipboard.writeText(hashText)
        .then(() => alert("✅ Hash copied and pasted into the answer field!"))
        .catch(err => {
            console.error("Clipboard write failed:", err);
            alert("❌ Clipboard copy failed.");
        });
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
        } else {
            document.getElementById("result").textContent = "❌ Hash submitted but was incorrect.";
        }
    } catch (err) {
        console.error(err);
        document.getElementById("result").textContent = "⚠️ " + (err?.reason || err?.message);
    }
}