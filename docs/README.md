# 🖥️ Proof of Escape – Frontend Interface

This is the user-facing interface for the Proof of Escape educational blockchain game. It allows students to connect their wallet, register, and submit quiz answers on the blockchain to earn reward tokens.

---

## ⚙️ Prerequisites

- 🦊 MetaMask (or other Web3-compatible wallet)
- 📡 Access to the QBFT_Besu_EduNet

---

## 🎮 How It Works

1. Connect your wallet using the “Connect Wallet” button.  
2. Register your address via the “Register” button.  
3. Select a quiz from the homepage and enter your answer.  
4. If correct, you will receive 10 ESCAPE tokens and the quiz will be marked as completed.

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

1. Enter the quiz ID in the form.  
2. Use the **Hash Tester** tool at the bottom of the page to convert your answer into a keccak256 hash.  
3. Copy the generated hash and paste it into the answer field. You can use the respective button to perform the action automatically.  
4. The frontend will submit the hash to the smart contract.  
5. If your hash matches the one registered on-chain:  
   - ✅ A success message will appear  
   - 🎁 You’ll receive 10 ESCAPE tokens  
   - 📌 Your completion will be stored on-chain  

⚠️ You must submit the **hash** of the answer, not the plain text.

Note: Each quiz can be completed only once.

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