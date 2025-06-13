# 🖥️ Proof of Escape – Frontend Interface

This is the web-based interface for the **Proof of Escape** educational blockchain game.  
It allows students to connect their wallet, register, submit quiz answers, and earn reward tokens upon success.

---

## ⚙️ Prerequisites

- 🦊 MetaMask (or other Web3-compatible wallet)
- 📡 Access to the Besu EduNet RPC (default: http://195.251.92.200)

---

## 🚀 Getting Started Locally

To run the frontend in your browser using a static server:

```bash
cd frontend
python3 -m http.server 8000
```

Then open:
```
http://localhost:8000
```

---

## ⚙️ Configuration

Make sure `config.js` exists in the `frontend/` directory with contents like:

```js
const CONFIG = {
  RPC_URL: "http://195.251.92.200",
  CONTRACT_ADDRESS: "0x874205E778d2b3E5F2B8c1eDfBFa619e6fF0c9aF",
  TOKEN_ADDRESS: "0xb62C4826BfF365827c923a14CCB5137eA0360402"
};
```

Ensure this file is included in `index.html` before `app.js`:

```html
<script src="config.js"></script>
<script src="app.js" type="module"></script>
```

---

## 🔐 Features

### ✅ Connect Wallet

Click “Connect Wallet” to link your MetaMask.
Your wallet address will appear on the page.

---

### 👤 Register

Click the “Register” button once your wallet is connected.  
Registration is required before submitting quiz answers.

---

### 🧩 Submit Quiz Answer

1. Enter the quiz ID and your answer in the form.
2. The frontend will:
   - Convert the answer to lowercase and trim whitespace
   - Hash the answer using keccak256
   - Submit the hash to the smart contract
3. If your answer is correct:
   - ✅ A success message will appear
   - 🎁 You’ll receive 10 ESCAPE tokens
   - 📌 Your completion will be stored on-chain

Note: Each quiz can be completed only once.

---

### 🧪 Hash Tester

At the bottom of the page, you’ll find a keccak256 hash generator.

Use it to:
- Test how input formatting affects the hash
- Confirm your answer hash before submitting
- Learn how Solidity’s keccak256 behaves

---

## 🧾 Reward Tokens

This interface interacts with the EscapeToken ERC-20 contract.
- Each correct quiz answer mints 10 ESCAPE tokens to the user's address
- You can add the token address to MetaMask to view your balance

---

## 📜 License

MIT – see root LICENSE file.

---

Happy escaping! 🧠🔐