# 🏆 Proof of Escape 🗝️

Welcome to the **Proof of Escape** repository! This project is designed to help students learn blockchain concepts through **interactive, on-chain quizzes and rewards**.

---

## 🚀 Overview

**Proof of Escape** is a blockchain-based educational game where participants:

- Answer quiz questions 🤔
- Compute cryptographic hashes 🔑
- Submit their answers on-chain 🔗
- Earn **ESCAPE tokens** as proof of completion 🎁

You do **not** need to deploy any smart contracts yourself — the game is pre-deployed on the **Sepolia testnet**, and ready to use!

---

## 🧰 Getting Started

Follow these steps to play the game locally:

### 1. 📦 Clone the Repository

```bash
git clone https://github.com/DimiKog/proof-of-escape.git
cd proof-of-escape
```

⸻ 

## 2. 🖥️ Launch the Frontend Locally

From the frontend/ folder, start a local web server:
```bash 
cd frontend
python3 -m http.server 8000
```
Then visit http://localhost:8000 in your browser.

⸻ 

## 3. 🌐 Connect Your Wallet

You can:

	- Open MetaMask and switch to the Sepolia Testnet
	- Get free test ETH from a faucet (see guides/info-for-sepolia-faucets.md)
	- On the page, click “Connect Wallet”
	- Once connected, click “Register” to begin

⸻

## 4. 📄 Read the Quiz Instructions

- Navigate to the `questions/` folder in the repository
- Open any quiz file (e.g., `quiz1.md`)
- Read the instructions carefully to understand what format your answer should be in (e.g., raw string or keccak256 hash)

⸻ 

## 5. 🧪 Try the Hash Tool (Optional)

If the quiz requires a `keccak256` hash, you can:

- 🧪 Use the built-in hash tester at the bottom of the homepage
- 💻 Or generate the hash using Remix or any Solidity-based hashing tool

⸻ ----------------------------------------------------

### 6. ✅ Submit Your Answer

Use the on-page form:

1. Enter the **quiz ID** and your **answer**
2. The app will:
   - Compute the keccak256 hash of your answer (if required)
   - Call the smart contract’s `checkQuizAnswer(...)` function
3. If your answer is correct:
   - ✅ You’ll see a success message
   - 🎁 You’ll automatically receive **10 ESCAPE tokens**
   - 📌 Your completion will be recorded on-chain

> ⚠️ **You can only complete each quiz once per wallet.**

⸻ 

## 💰 Rewards

Each time you successfully complete a quiz:

- 🎁 You receive **10 ESCAPE tokens** minted directly to your wallet
- 👛 You can view your token balance in MetaMask by adding the ESCAPE token address manually

⸻ 

## 👛 How to View ESCAPE Tokens in MetaMask

After answering a quiz correctly, you’ll automatically receive 10 ESCAPE tokens to your wallet.

To see your tokens in MetaMask:
1.	Open MetaMask and switch to the Sepolia network.
2.	Click “Import tokens” at the bottom of the Assets tab.
3.	Paste the ESCAPE token contract address: 0xcec3f1b99ec152cc3ddb920ceea15fcc2213c12b
4.	Click “Next”, then “Add Custom Token.”

✅ You will now see your ESCAPE balance in MetaMask.
	
🔎 If you ever forget the token address, you can also find it in contract-info/contract-address.txt.

## 📊 Quiz Completion Tracking

The smart contract tracks how many users have solved each quiz.
(You can view these stats via the frontend or in Remix with quizCompletions(quizId).)

⸻ 

## 📂 Repository Structure

The repository's structure is as follows:

	•	questions/ – Markdown files with quiz instructions
	•	guides/ – How to connect to Sepolia, get test ETH, and use Remix
	•	frontend/ – The local HTML/JS-based interface
	•	contract-info/ – ABI, contract address, and Etherscan link
	•	contracts/ – Solidity source code (ProofOfEscape.sol, EscapeToken.sol)
	•	README.md – This file
	•	LICENSE – Project license (MIT)

⸻ 

## 📜 License

This project is licensed under the MIT License.
See the LICENSE file for details.

⸻

Happy learning and escaping! 🔐