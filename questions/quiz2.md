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

1. Scroll to the **"Input Scripts"** or **"Coinbase"** section of the transaction.
2. You'll see a long hexadecimal string like this: 04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e207468652…
3. Decode this hex string to ASCII using one of the following:
- Online: [https://www.rapidtables.com/convert/number/hex-to-ascii.html](https://www.rapidtables.com/convert/number/hex-to-ascii.html)
- Terminal (Linux/macOS):
  ```bash
  echo "546865..." | xxd -r -p
  ```
4. Ιdentify the **political title** in the sentence.
  - It's not "prime".
  - It's not a proper name.
  - It's the title of the person mentioned in the headline.

---

### 🛠️ Final Instructions:

1. Take the word and convert it to **lowercase**.
2. Do not include punctuation, quotes, or spaces.
3. Compute the keccak256 hash of the word using Solidity-style encoding
4. Submit the resulting hash to the smart contract.

> ⚠️ Note: Make sure the word is clean, no invisible characters or accidental spaces.

---
