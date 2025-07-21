# 🏆 Proof of Escape 🗝️

Welcome to the **Proof of Escape** repository! This project is designed to help students learn blockchain concepts through **interactive, on-chain quizzes and rewards**.

---

## 🚀 Overview

**Proof of Escape (PoE)** is a blockchain-based educational game where participants:

- Answer quiz questions 🤔
- Compute cryptographic hashes 🔑
- Submit their answers on-chain 🔗
- Earn **ESCAPE tokens** as proof of completion 🎁

You do **not** need to deploy any smart contracts yourself — the game is pre-deployed on a custom QBFT Education Network based on **Hyperledger Besu**, and ready to use!

---

## 🎯 Learning Objectives

This game-based activity aims to help students achieve the following learning objectives:

- 🦊 **Create and manage a wallet address** using MetaMask or a similar browser extension.
- 🌐 **Interact with a live blockchain network**, understanding the role of testnets and gas.
- 🧩 **Engage with a Web3 application and faucet**, observing how smart contracts are called via the frontend.
- 🔐 **Get introduced to cryptographic concepts** such as keccak256 hashing and their role in blockchain security.
- 🧠 **Enrich blockchain knowledge** by solving quiz challenges based on real blockchain concepts and block data exploration.

---

## 🧰 Getting Started

Follow these steps to play the game:

### 1. 🌐 Launch the App via GitHub Pages

Visit the live version of the app here: [https://dimikog.github.io/proof-of-escape/](https://dimikog.github.io/proof-of-escape/)

### 2. 🌐 Connect Your Wallet

You can:
- Open MetaMask and **add the custom QBFT Education Network** (details in the guides section [connect metamask](https://github.com/DimiKog/proof-of-escape/blob/main/guides/besu-setup-metamask.md) )
- Optionally, get test ESCAPE tokens from the in-app [faucet](https://github.com/DimiKog/proof-of-escape/blob/main/guides/info-for-besu-faucet.md)
- On the page, click **“Connect Wallet”**
- Once connected, click **“Register”** to begin

### 3. 🧠 Choose and Solve a Quiz

Once registered and connected:

- 🧠 Use the “Choose a Quiz” dropdown to select one of the unlocked quizzes.
- You must answer each quiz **in order** — you can only access the next one after answering the current one **correctly**.
- Read the quiz instructions that appear on screen. These provide clues and explain how to format your answer.

### 4. ✏️ Use the Built-in Hash Tool

- ✏️ Use the built-in hash generator located just below the quiz section to compute your keccak256 hash.
- This tool is required for formatting and hashing your answer correctly before submitting it on-chain.

### 5. ✅ Submit Your Answer

Use the on-page form to submit your response:
1. Enter the quiz ID and your keccak256 hash of the answer
- Your hash must begin with 0x and be exactly 66 characters long.
- Make sure you’ve followed the quiz instructions to format your input correctly before hashing.
2. The app will:
- Validate the hash format
- Call the smart contract’s `checkQuizAnswer(...)` function with your hash
3. If your answer is correct:
- ✅ You’ll see a success message
- 📌 Your completion will be recorded on-chain

⚠️ You can only complete each quiz once per wallet.

---

### 💰 Rewards

Each time you successfully complete a quiz:
- 🎁 You receive 10 ESCAPE tokens minted directly to your wallet
- 👛 You can view your token balance in MetaMask by adding the ESCAPE token address manually

---

### 👛 How to View ESCAPE Tokens in MetaMask

To see your tokens in MetaMask:
1. Open MetaMask and switch to the QBFT Education Network.
2. Click “Import tokens” at the bottom of the Assets tab.
3. Paste the ESCAPE token contract address: 0xb62C4826BfF365827c923a14CCB5137eA0360402
4. Click “Next”, then “Add Custom Token.”

✅ You will now see your ESCAPE balance in MetaMask.

🔎 If you ever forget the token address, it is displayed on the frontend after registration or can be found in the `meta/` folder if you're running locally.

### 📊 Quiz Completion Tracking

The smart contract tracks how many users have solved each quiz.
Access to these stats will be provided through the front-end (feature under development for now).

---

### 📂 Repository Structure

The repository’s structure is as follows:

```
proof-of-escape/
├── docs/              # Frontend code served via GitHub Pages
├── contracts/         # Solidity contracts: ProofOfEscape, EscapeToken
├── guides/            # Setup guides (MetaMask, faucet, Besu, etc.)
├── .archive/lib/      # Deprecated libraries or early versions
├── meta/              # Project metadata (remappings, .txt info, etc.)
├── node_modules/      # Local development dependencies (gitignored)
├── .gitignore         # Ignores build, cache, node_modules, etc.
├── README.md          # Project overview and usage instructions
```


⚠️ **Note:** Do not commit `node_modules/` or other auto-generated files — they are excluded via `.gitignore`.  
Project-related `.txt` files are now located in the `meta/` folder; all others are ignored.

---

### 📜 License

This project is licensed under the MIT License.
See the LICENSE file for details.

---

Happy learning and escaping! 🔐
