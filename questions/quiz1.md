## 🔍 Question 1 – Blockchain Fundamentals

Blockchain technology is the foundation of many decentralized systems. It enables distributed ledgers, secure transactions, and transparent data sharing.

**Question:**  
What is the core technology you are learning in this course?

Your goal is to:
- Identify the correct term.
- Format it properly.
- Hash it using `keccak256` (as used in Solidity).
- Submit the resulting hash to the smart contract.

---

### 🌐 Helpful Hint:

The answer refers to the core concept that powers distributed ledgers.

---

## ✅ What to Do

To complete this quiz, follow these steps carefully:

### 1. Find the Correct Answer
- Think about the question.
- Your answer should be a **single word** unless otherwise noted.

### 2. Prepare the Answer
- Convert it to **all lowercase**
- Remove **any punctuation, quotes, or whitespace**
- For example:
  - `"Ledger "` → `ledger`
  - `"Smart-Contract"` → `smartcontract`

### 3. Compute the `keccak256` Hash

You have two options:

#### 🧪 Option A – Use the In-App Hash Tool
1. Visit the Proof of Escape homepage.
2. Scroll down to the **"🧪 Try keccak256 Hash Yourself"** section.
3. Enter your answer and copy the generated hash.

#### 🔗 Option B – Use the Online Tool
1. Visit: [https://emn178.github.io/online-tools/keccak_256.html](https://emn178.github.io/online-tools/keccak_256.html)
2. Type your answer exactly as specified (all lowercase, no spaces).
3. Copy the resulting hash.
4. Add `0x` to the beginning of it, like this:
    0xhash
> ⚠️ Do **not** use SHA256 — make sure it says `keccak_256`.

---

### 4. Submit the Answer

You must interact with the smart contract deployed on the Sepolia testnet.

You can submit your answer using either:
- The **Remix IDE**, or
- The official **Proof of Escape frontend**.

#### In Remix:
1. Paste the contract address in the **"At Address"** field and click “At Address.”
2. Call the `register()` function if you haven’t already.
3. Call `checkQuizAnswer(quizId, answerHash)` with:
- `quizId = X` (replace with the correct quiz number)
- `answerHash = 0x...` (the hash you computed)

---

### 🏆 Completion

If your answer is correct:
- You will see a success message or event
- You will be awarded 10 ESCAPE Tokens 🎉
- Your quiz completion will be recorded


If not:
- You will receive an error or failure message
- Try again and check your formatting or hash input

---

Good luck! 🧠🔐
