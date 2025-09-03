# 🧠 Proof of Escape – Smart Contracts

This folder contains the smart contracts for the **Proof of Escape** project, a blockchain-based quiz challenge with NFT and token rewards deployed on a private Ethereum (Besu QBFT) network.

---

## 📁 Folder Structure

```
contracts/
├── src/                  # Source contracts
│   ├── EscapeToken.sol             – ERC-20 reward token
│   ├── PoEQuizRewardNFT.sol       – ERC-721 NFT for quiz completion
│   ├── ProofOfEscapev3.sol          – Main contract: quiz logic, registration, reward tracking
│   └── ProofOfEscape.sol + ProofOfEscapev2.sol     – Older versions (archived)
├── script/              # Forge/Foundry deployment scripts
├── test/                # Foundry test contracts
├── out/, cache/, broadcast/       # Ignored auto-generated folders
└── foundry.toml         # Foundry project config
```

---

## 🔐 Contracts Overview

| Contract                | Description                                                                       |
|------------------------|------------------------------------------------------------------------------------|
| `ProofOfEscapev3.sol`             | Main contract managing registration, quiz completions, and rewards      |
| `EscapeToken.sol`                 | ERC-20 token awarded upon quiz completion                               |
| `PoEQuizRewardNFT.sol`            | ERC-721 NFT issued to users who complete all quizzes                    |
| `ProofOfEscape+ProofOfEscapev2`   | Older versions archived for reference                                   |

---

## ⚙️ Deployment

Deployment scripts use [Foundry](https://book.getfoundry.sh/). Common commands:

```bash
forge script script/DeployProofOfEscape.s.sol --broadcast --rpc-url $RPC_URL
forge script script/MintPoEQuizReward.s.sol --broadcast --rpc-url $RPC_URL
```

Set your private key and `RPC_URL` via `.env` or CLI options.

---

## 🧪 Testing

```bash
forge test
```

To run a specific test:

```bash
forge test --match-path test/Counter.t.sol
```

---

## 🗃️ Notes

- Contracts are deployed to a private **Besu QBFT** chain (chain ID: `424242`)
- Ownership transfers are handled via `TransferOwnershipScript.s.sol`
- Verified ABIs are under `/docs/abi/`
- Older contract versions are kept for reference but excluded from active deployment

---

## 🧠 Author

**Dimitris G. Kogias** – 