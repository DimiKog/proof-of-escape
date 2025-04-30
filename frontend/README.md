# 🖥️ Proof of Escape – Frontend Interface

This is the web-based interface for the **Proof of Escape** educational blockchain game.  
It allows students to connect their wallet, register, submit quiz answers, and earn reward tokens upon success.

---

## ⚙️ Prerequisites

- 🦊 MetaMask (or other Web3-compatible wallet)
- 🌐 Sepolia Testnet selected in your wallet
- 💰 Sepolia ETH (for transaction fees – see `guides/` folder for faucet info)

---

## 🚀 Getting Started Locally

To run the frontend in your browser:

```bash
cd frontend
python3 -m http.server 8000
http://localhost:8000
```

## 🔐 Features

## ✅ Connect Wallet

Click “Connect Wallet” to link your MetaMask.
Your wallet address will appear on the page.

⸻

## 👤 Register

You must register before answering any quizzes.
Click the “Register” button once your wallet is connected.

⸻

## 🧩 Submit Quiz Answer
	1.	Enter the quiz ID and your answer in the form.
	2.	The frontend will:
	•	Convert the answer to lowercase and trim whitespace
	•	Hash the answer using keccak256
	•	Submit it to the smart contract
	3.	If your answer is correct:
	•	✅ A success message will appear
	•	🎁 You’ll receive 10 ESCAPE tokens
	•	📌 Your completion will be stored on-chain

You may only complete each quiz once.

⸻

🧪 Try keccak256 Hash Yourself

At the bottom of the page, there’s a hash generator for self-testing.

Use it to:
	•	Experiment with how input formatting affects the hash
	•	Learn how Solidity’s keccak256 behaves
	•	Confirm your answer before submission (if working in Remix)

## 🧾 Reward Tokens

This interface interacts with the EscapeToken ERC-20 contract.
	•	Each correct quiz answer mints 10 ESCAPE to the user
	•	Token balance can be viewed in MetaMask by adding the token address

## 📜 License

MIT – see root LICENSE file.

⸻

Happy escaping! 🧠🔐