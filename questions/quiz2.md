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

### 🌐 Useful Link:

You can explore the Genesis Block here:  
🔗 [https://www.blockchain.com/explorer/blocks/btc/0](https://www.blockchain.com/explorer/blocks/btc/0)

Look at the **first transaction** (coinbase input) — it contains a human-readable message.

---

### 🛠️ Instructions:

1. Locate the human-readable message in the coinbase transaction of Block 0.
2. Extract the **word that refers to a political title**.
3. Use the word in **all lowercase**. No punctuation. No extra characters.
4. Compute the `keccak256` hash of the word (as a UTF-8 string).
5. Submit the resulting hash to the smart contract.

> ⚠️ Note: Do NOT include any whitespace or quotes in the string before hashing.

---
