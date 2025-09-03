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
