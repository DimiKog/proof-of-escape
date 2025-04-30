## 🔍 Question 2 – A Message in the Genesis

The first Bitcoin block — known as the *Genesis Block* — was mined on January 3rd, 2009. Its creator embedded a message inside the **coinbase transaction input** that referenced a real-world headline related to the financial crisis.

**Question:**  
Inside the coinbase transaction of Bitcoin's Genesis Block, there is a message.  
Find the word used to refer to a political position/title in that message (hint: it's a role, not a name, and not "prime").

Your goal is to:
- Extract the correct word.
- Format it properly.
- Hash it using `keccak256` (as used in Solidity).
- Submit the resulting hash to the smart contract.

---

### 🌐 Useful Links:

You can explore the Genesis Block here:  
🔗 [https://www.blockchain.com/explorer/blocks/btc/0](https://www.blockchain.com/explorer/blocks/btc/0)

Or go directly to the first transaction (coinbase transaction):  
🔗 [https://www.blockchain.com/btc/tx/4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b](https://www.blockchain.com/btc/tx/4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b)

---

### 🔍 How to Extract the Message

1. Scroll to the **"JSON** section of the representation of the transaction.
2. You'll see a long hexadecimal string in the sigscript section of the transaction (a string like this: 04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e207468652…)
3. Decode this hex string to ASCII using one of the following:
- Online: [https://www.rapidtables.com/convert/number/hex-to-ascii.html](https://www.rapidtables.com/convert/number/hex-to-ascii.html)
- Terminal (Linux/macOS):
  ```bash
  echo "04ffff001..." | xxd -r -p
  ```
4. Ιdentify the **political title** in the sentence.
  - It's not "prime".
  - It's not a proper name.
  - It's the title of the person mentioned in the headline.

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
