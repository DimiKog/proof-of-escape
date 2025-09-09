# 🏆 Proof of Escape — Learn Blockchain by Escaping!

## 🔍 What is Proof of Escape?

Proof of Escape is a gamified Web3 quiz challenge where students interact with a real blockchain network powered by Besu QBFT to:  
- Solve quizzes and puzzles  
- Submit answers hashed with keccak256  
- Earn on-chain rewards as ESCAPE tokens  
- Claim a limited NFT upon full completion  

No smart contract deployment needed — just connect your wallet and start solving.

## 📚 Learning Outcomes

This project helps you:  
- Understand wallets and testnet tokens  
- Interact with deployed smart contracts via a Web3 frontend  
- Use keccak256 hashing in practice  
- Explore smart contract transactions and on-chain state  
- Learn fundamental blockchain concepts through guided quizzes  

## 🚀 Quick Start

1. Visit the app: [https://dimikog.github.io/proof-of-escape/](https://dimikog.github.io/proof-of-escape/)  
2. Connect your MetaMask wallet to the QBFT Education Network  
2a. [Set up MetaMask for QBFT_Besu_EduNet](./guides/setup-metamask.md) if you haven’t already.  
3. Register and start solving quizzes  
4. Use the built-in hash tool to compute keccak256 hashes  
5. Submit answers and claim ESCAPE tokens  
6. After completing all quizzes, claim your NFT!  

✅ All progress is tracked on-chain.

## 🧭 How to Use the App

The app consists of several sections, each guiding your learning journey:

- **Connect Wallet**: Use MetaMask to connect to the QBFT Education Network.
- **Register**: Click “Register” to participate. Your wallet will be recorded on-chain.
- **Quizzes**: Complete a series of interactive quizzes.
  - Use the built-in **Hash Generator** to compute the keccak256 hash of your answer.
  - Submit the hash to the blockchain to mark your quiz as completed.
- **Progress Tracking**: The app tracks your progress on-chain.
- **Leaderboard**: View registered users and track completions.
- **Claim NFT**: After completing all quizzes, unlock and mint a special Proof of Escape NFT.


## 👛 View ESCAPE Tokens in MetaMask

- Network: QBFT Education Network  
- Token Contract: `0xb62C4826BfF365827c923a14CCB5137eA0360402`  
- Add this token manually in MetaMask to see your ESCAPE balance.

## 💧 Request EDU-D Tokens

To interact with the Proof of Escape dApp, you’ll need test tokens (EDU-D) on the QBFT_Besu_EduNet network. These cover transaction fees.

🔗 Faucet: [https://faucet.dimikog.org/](https://faucet.dimikog.org/)

👉 See [Token Request Instructions](./guides/info-for-besu-faucet.md) for detailed steps and limitations.

## 🖼️ View Your PoE NFT in MetaMask

After completing all quizzes, you can mint a special Proof of Escape NFT. This NFT is a badge of your achievement and will also be used in future game phases.

To view the NFT in MetaMask:

1. Open MetaMask and switch to the **QBFT Education Network**.
2. Go to the **NFTs** tab (available in the mobile app or MetaMask Portfolio).
3. Click **Import NFT**.
4. Enter the following:
   - **NFT Contract Address**: `0x095dbc84D218695B09Ab6Ac662C11C8312621ed5`
   - **Token ID**: Use the ID shown after minting (usually `1` if it's your first).

📌 **Keep this NFT** — it will unlock access to the next phase of the Proof of Escape experience, coming soon. You can import it in MetaMask via the “NFTs” tab (available in MetaMask Mobile or MetaMask Portfolio) using the contract and token ID shown upon minting.

## 📂 Project Structure

```
proof-of-escape/
├── docs/        # Frontend app (served via GitHub Pages)
├── contracts/   # Solidity contracts (PoE, ESCAPE token, NFT)
├── guides/      # Wallet, faucet, and network setup guides
├── meta/        # Metadata (ABI, token info, remappings)
├── .archive/    # Archived files and older smart contract versions
└── README.md    # This file
```

⚠️ Auto-generated files (e.g., node_modules, cache, out) are gitignored.

## 🛠️ Requirements (Dev Only)

- [Foundry](https://getfoundry.sh/) for contract deployment and testing  
- MetaMask browser extension  

## 📄 License

MIT License — see LICENSE file for details.

---

💡 Created with ❤️ for blockchain education
