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

The answer refers to the **core concept that powers distributed ledgers**.  
It is **one word**, all lowercase, and contains **no spaces or punctuation**.

---

## ✅ What to Do

To complete this quiz, follow the steps below:

---

### 1. Find the Correct Answer

- Think about what technology this course is about.
- The answer should be **a single word**, with **no extra characters**.

---

### 2. Format the Answer

- Convert the word to **all lowercase**
- Remove **punctuation**, **quotes**, and **whitespace**

**Examples:**

- `"Blockchain "` → `blockchain`
- `"Distributed Ledger"` → `distributedledger`

---

### 3. Compute the `keccak256` Hash

You can use either of the following methods:

#### 🧪 Option A – Built-in Hash Tool (Recommended)

1. Open the Proof of Escape homepage.
2. Scroll down to the **"🧪 Try keccak256 Hash Yourself"** section.
3. Enter your formatted answer.
4. Copy the generated hash (it will begin with `0x...`).

#### 🔗 Option B – External Tool

1. Visit: [https://emn178.github.io/online-tools/keccak_256.html](https://emn178.github.io/online-tools/keccak_256.html)
2. Paste your formatted answer into the input field.
3. Copy the resulting hash.
4. Manually prepend `0x` to the hash (if not already included).

> ⚠️ **Do not use SHA256** — ensure the tool says `keccak_256`

---

### 4. Submit Your Answer

You can submit your answer using:

- 🧪 **Remix IDE**, or  
- 🖥️ **Proof of Escape frontend** (`index.html`)

#### 💻 In Remix:

1. Paste the contract address into the **"At Address"** field and click “At Address”
2. Call the `register()` function (only once)
3. Call `checkQuizAnswer(quizId, answerHash)` with:
   - `quizId = 1`
   - `answerHash = 0x...` (your computed hash)

#### 🌐 In the Frontend:

1. Launch the frontend (`http://localhost:8000`)
2. Click **Connect Wallet**
3. Click **Register**
4. Enter `Quiz ID = 1` and paste the correct answer
5. The system will hash your input and submit it

---

## 🏆 What Happens on Completion?

If your answer is correct:

- ✅ You’ll see a success message
- 🎁 You’ll automatically receive **10 ESCAPE tokens**
- 📌 Your quiz completion will be permanently recorded on-chain

If incorrect:

- ❌ You’ll receive a failure message
- 🔁 Check your formatting and hash carefully and try again

> ⚠️ **You can only complete each quiz once per wallet.**

---

Good luck! 🧠🔐