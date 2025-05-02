## 🔍 Question 2 – A Message in the Genesis

The first Bitcoin block — known as the *Genesis Block* — was mined on January 3rd, 2009.  
Its creator embedded a message inside the **coinbase transaction input** that referenced a real-world headline from the financial crisis.

**Question:**  
Find the **political title** mentioned in that embedded message.  
(Hint: It’s a **role**, not a name. It is **not** “prime.”)

Your goal is to:

- Extract the correct word.
- Format it properly.
- Hash it using `keccak256` (as used in Solidity).
- Submit the resulting hash to the smart contract.

---

### 🌐 Useful Links

- 🔗 [Genesis Block](https://www.blockchain.com/explorer/blocks/btc/0)
- 🔗 [Coinbase Transaction](https://www.blockchain.com/btc/tx/4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b)

---

### 🔍 How to Extract the Message

1. Open the **coinbase transaction** linked above.
2. Scroll to the **“JSON”** view of the transaction.
3. Find the `sigscript` (a long hexadecimal string).
4. Decode it to ASCII using:
   - Online: [https://www.rapidtables.com/convert/number/hex-to-ascii.html](https://www.rapidtables.com/convert/number/hex-to-ascii.html)
   - Or in the terminal:
     ```bash
     echo "04ffff001d..." | xxd -r -p
     ```
5. Look at the decoded message.  
   Identify the **political title** in the sentence (not a name, and not “prime”).

---

## ✅ What to Do

Follow the steps below to complete the quiz:

---

### 1. Find the Correct Answer

- Think about the question and extract the correct word.
- Your answer must be a **single word**, no spaces or punctuation.

---

### 2. Format the Answer

- Convert to **all lowercase**
- Remove **punctuation, whitespace, and quotes**

**Examples:**
- `" Chancellor "` → `chancellor`
- `"Prime-Minister"` → `primeminister`

---

### 3. Compute the `keccak256` Hash

#### 🧪 Option A – Use the In-App Hash Tool (Recommended)

1. Open the Proof of Escape homepage.
2. Scroll down to the **“🧪 Try keccak256 Hash Yourself”** section.
3. Enter your formatted answer.
4. Copy the generated hash (should begin with `0x...`).

#### 🔗 Option B – Use the Online Tool

1. Visit: [https://emn178.github.io/online-tools/keccak_256.html](https://emn178.github.io/online-tools/keccak_256.html)
2. Type your answer exactly as required (lowercase, no punctuation).
3. Copy the resulting hash.
4. Manually prefix the hash with `0x` (if not already present)

> ⚠️ **Use `keccak256`, not SHA256**

---

### 4. Submit Your Answer

You can submit via either:

- 🧪 **Remix IDE**, or  
- 🖥️ **Proof of Escape frontend**

#### 💻 In Remix:

1. Paste the contract address in the **"At Address"** field and click “At Address.”
2. Call the `register()` function (only once per wallet).
3. Call `checkQuizAnswer(quizId, answerHash)` with:
   - `quizId = 2`
   - `answerHash = 0x...` (your computed hash)

#### 🌐 In the Frontend:

1. Visit `http://localhost:8000`
2. Connect your wallet and click **Register**
3. Enter `Quiz ID = 2` and **paste the full keccak256 hash** of your answer
4. Submit it through the form

---

## 🏆 What Happens on Completion?

If your answer is correct:

- ✅ You’ll receive a success message
- 🎁 You’ll be awarded **10 ESCAPE tokens**
- 📌 Your quiz completion will be stored on-chain

If incorrect:

- ❌ You’ll see an error or rejection message
- 🔁 Re-check your formatting and hash, and try again

> ⚠️ **You can only complete each quiz once per wallet.**

---

Good luck, and trust the Genesis message! 🧠🔐