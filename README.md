# 🏆 Proof of Escape 🗝️

Welcome to the **Proof of Escape** repository! This project is designed to help students learn blockchain concepts through **interactive, on-chain quizzes and rewards**.

---

## 🚀 Overview

**Proof of Escape** is a blockchain-based educational game where participants:

- Answer quiz questions 🤔
- Compute cryptographic hashes 🔑
- Submit their answers on-chain 🔗
- Earn **ESCAPE tokens** as proof of completion 🎁

The smart contract is **pre-deployed on the Sepolia testnet**, so you don't need to deploy anything yourself. Just connect your wallet and start playing.

---

## 📂 Repository Structure

Here's how the project is organized:

- **`questions/`**: ❓ Quiz instructions and questions. Each quiz lives in its own Markdown file (e.g., `quiz1.md`, `quiz2.md`).
- **`guides/`**: 📚 Helpful resources including:
  - How to connect to Sepolia 🌐
  - How to get Sepolia ETH from faucets 💧
  - Using Remix to interact with smart contracts 🛠️
- **`contract-info/`**: 📜 Deployment info:
  - `contract-address.txt`: The deployed **ProofOfEscape** contract address on Sepolia
  - `abi.json`: The contract's ABI for frontend or Remix use
  - `etherscan-link.md`: Direct link to the verified smart contract on Sepolia Etherscan 🔎
- **`frontend/`**: 🖥️ A ready-to-use interface for submitting answers and testing hashes
- **`README.md`**: 📖 This file, containing general project information
- **`LICENSE`**: 📄 MIT License for content usage

---

## 🧑‍🎓 How to Participate

Follow these steps to test your blockchain knowledge:

### 1. 📄 Get the Quiz Instructions

- Navigate to the `questions/` folder
- Pick a quiz file (e.g., `quiz1.md`)
- Read the question and formatting rules carefully

### 2. 🌐 Connect to Sepolia

- Open MetaMask and switch to the **Sepolia testnet**
- Get test ETH using one of the faucet links in `guides/info-for-sepolia-faucets.md`

### 3. 💻 Interact with the Contract

You can use **Remix** or the **frontend web app**:

#### ✅ Remix Option:

- Open [Remix IDE](https://remix.ethereum.org)
- Go to the "Deploy & Run" tab and choose "Injected Provider - MetaMask"
- Paste the contract address from `contract-info/contract-address.txt`
- Click "At Address" to load the deployed contract

#### ✅ Frontend Option:

- Run the app locally (see `frontend/README.md`)
- Connect your wallet
- Register and submit your answers through the interface

---

## 📝 Submit Your Answer

1. **Check the quiz file** to see what format is expected (e.g., hash).
2. If required, compute the answer’s keccak256 hash (you can use the hash tool on the site).
3. Call the `checkQuizAnswer(quizId, answerHash)` function.
4. If your answer is correct:
   - ✅ You'll see a success message
   - 🎁 You'll automatically receive **10 ESCAPE tokens**
   - 🧾 Your completion will be stored on-chain

> ⚠️ Each quiz can only be completed **once per wallet**. Further submissions will be rejected.

---

## 🎁 Token Rewards

Each correct answer earns you:
- **10 ESCAPE tokens**
- Distributed automatically from the contract to your wallet

You can view your balance directly in MetaMask or by checking the ESCAPE token address.

---

## 📊 Quiz Completion Tracking

The contract tracks how many users have completed each quiz.

---

## 📜 License

This project is licensed under the MIT License.
See the LICENSE file for details.

---