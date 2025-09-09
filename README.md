# 🏆 Proof of Escape — Learn Blockchain by Escaping!

[🇬🇧 English](#-proof-of-escape--learn-blockchain-by-escaping) | [🇬🇷 Ελληνικά](#-proof-of-escape---μάθε-blockchain-μέσα-από-την-απόδραση)

---

## 🇬🇧 Proof of Escape — Learn Blockchain by Escaping!

### 🔍 What is Proof of Escape?

Proof of Escape is a gamified Web3 quiz challenge where students interact with a real blockchain network powered by Besu QBFT to:  
- Solve quizzes and puzzles  
- Submit answers hashed with keccak256  
- Earn on-chain rewards as ESCAPE tokens  
- Claim a limited NFT upon full completion  

No smart contract deployment needed — just connect your wallet and start solving.

### 📚 Learning Outcomes

This project helps you:  
- Understand wallets and testnet tokens  
- Interact with deployed smart contracts via a Web3 frontend  
- Use keccak256 hashing in practice  
- Explore smart contract transactions and on-chain state  
- Learn fundamental blockchain concepts through guided quizzes  

### 🚀 Quick Start

1. Visit the app: [https://dimikog.github.io/proof-of-escape/](https://dimikog.github.io/proof-of-escape/)  
2. Connect your MetaMask wallet to the QBFT Education Network  
2a. [Set up MetaMask for QBFT_Besu_EduNet](./guides/besu-setup-metamask.md) if you haven’t already.  
3. Register and start solving quizzes  
4. Use the built-in hash tool to compute keccak256 hashes  
5. Submit answers and claim ESCAPE tokens  
6. After completing all quizzes, claim your NFT!  

✅ All progress is tracked on-chain.

### 🧭 How to Use the App

The app consists of several sections, each guiding your learning journey:

- **Connect Wallet**: Use MetaMask to connect to the QBFT Education Network.  
- **Register**: Click “Register” to participate. Your wallet will be recorded on-chain.  
- **Quizzes**: Complete a series of interactive quizzes.  
  - Use the built-in **Hash Generator** to compute the keccak256 hash of your answer.  
  - Submit the hash to the blockchain to mark your quiz as completed.  
- **Progress Tracking**: The app tracks your progress on-chain.  
- **Leaderboard**: View registered users and track completions.  
- **Claim NFT**: After completing all quizzes, unlock and mint a special Proof of Escape NFT.  

### 👛 View ESCAPE Tokens in MetaMask

- Network: QBFT Education Network  
- Token Contract: `0xb62C4826BfF365827c923a14CCB5137eA0360402`  
- Add this token manually in MetaMask to see your ESCAPE balance.  

### 💧 Request EDU-D Tokens

To interact with the Proof of Escape dApp, you’ll need test tokens (EDU-D) on the QBFT_Besu_EduNet network. These cover transaction fees.  

🔗 Faucet: [https://faucet.dimikog.org/](https://faucet.dimikog.org/)  

👉 See [Token Request Instructions](./guides/info-for-besu-faucet.md) for detailed steps and limitations.  

### 🖼️ View Your PoE NFT in MetaMask

After completing all quizzes, you can mint a special Proof of Escape NFT. This NFT is a badge of your achievement and will also be used in future game phases.  

To view the NFT in MetaMask:  

1. Open MetaMask and switch to the **QBFT Education Network**.  
2. Go to the **NFTs** tab (available in the mobile app or MetaMask Portfolio).  
3. Click **Import NFT**.  
4. Enter the following:  
   - **NFT Contract Address**: `0x095dbc84D218695B09Ab6Ac662C11C8312621ed5`  
   - **Token ID**: Use the ID shown after minting (usually `1` if it's your first).  

📌 **Keep this NFT** — it will unlock access to the next phase of the Proof of Escape experience, coming soon.  

### 📂 Project Structure

```
proof-of-escape/
├── docs/        # Frontend app (served via GitHub Pages)
├── contracts/   # Solidity contracts (PoE, ESCAPE token, NFT)
├── guides/      # Wallet, faucet, and network setup guides
├── meta/        # Metadata (ABI, token info, remappings)
├── .archive/    # Archived files and older smart contract versions
└── README.md    # This file
```

⚠️ Auto-generated files (e.g., node_modules, cache, out) are gitignored.

### 🛠️ Requirements (Dev Only)

- [Foundry](https://getfoundry.sh/) for contract deployment and testing  
- MetaMask browser extension  

### 📄 License

MIT License — see LICENSE file for details.

---

💡 Created with ❤️ for blockchain education

---

## 🇬🇷 Proof of Escape — Μάθε για το Blockchain βρίσκοντας τις απαντήσεις και φτάνοντας στην Απόδραση!

### 🔍 Τι είναι το Proof of Escape;

Το **Proof of Escape** είναι μια παιγνιοποιημένη πρόκληση Web3, όπου οι χρήστες αλληλεπιδρούν με ένα πραγματικό blockchain δίκτυο (Besu QBFT, Ethereum) για να:  
- Λύσουν κουίζ και γρίφους  
- Υποβάλουν απαντήσεις με keccak256 hash  
- Κερδίσουν on-chain ανταμοιβές ως ESCAPE tokens  
- Διεκδικήσουν ένα περιορισμένο NFT μετά την πλήρη ολοκλήρωση όλων των ερωτήσεων

Δεν απαιτείται ανάπτυξη smart contract — απλώς συνδέστε το πορτοφόλι σας και ξεκινήστε!

### 📚 Μαθησιακά Αποτελέσματα

Με αυτό το έργο θα μάθετε να:  
- Κατανοείτε τα πορτοφόλια και τα testnet tokens  
- Αλληλεπιδράτε με ήδη αναπτυγμένα smart contracts μέσω Web3 frontend  
- Χρησιμοποιείτε το keccak256 hashing στην πράξη  
- Εξερευνάτε συναλλαγές smart contracts και on-chain καταστάσεις  
- Μάθετε θεμελιώδεις έννοιες blockchain μέσα από καθοδηγούμενα κουίζ  

### 🚀 Γρήγορη Εκκίνηση

1. Επισκεφθείτε την εφαρμογή: [https://dimikog.github.io/proof-of-escape/](https://dimikog.github.io/proof-of-escape/)  
2. Συνδέστε το πορτοφόλι MetaMask σας στο δίκτυο QBFT Education Network  
2α. [Ρυθμίστε το MetaMask για το QBFT_Besu_EduNet](./guides/besu-setup-metamask.md) αν δεν το έχετε ήδη κάνει.  
3. Κάντε εγγραφή και ξεκινήστε να λύνετε τα κουίζ  
4. Χρησιμοποιήστε το ενσωματωμένο εργαλείο υπολογισμού hash για keccak256 υπολογισμούς  
5. Υποβάλετε τις απαντήσεις και διεκδικήστε ESCAPE tokens  
6. Αφού ολοκληρώσετε όλα τα κουίζ, διεκδικήστε το NFT σας!  

✅ Όλη η πρόοδός σας αποθηκεύεται στο blockchain.

### 🧭 Πώς να Χρησιμοποιήσετε την Εφαρμογή

Η εφαρμογή αποτελείται από διάφορες ενότητες που καθοδηγούν τη μαθησιακή σας πορεία:  

- **Connect Wallet**: Χρησιμοποιήστε το MetaMask για να συνδεθείτε στο QBFT Education Network.  
- **Register**: Πατήστε “Register” για συμμετοχή. Το πορτοφόλι σας θα καταγραφεί στο blockchain.  
- **Quizzes**: Ολοκληρώστε μια σειρά διαδραστικών κουίζ.  
  - Χρησιμοποιήστε το ενσωματωμένο **Hash Generator** για keccak256 hash της απάντησής σας.  
  - Υποβάλετε το hash στο blockchain για να σημειωθεί ως ολοκληρωμένο το κουίζ.  
- **Progress Tracking**: Η πρόοδός σας καταγράφεται στο blockchain.  
- **Leaderboard**: Δείτε τους εγγεγραμμένους χρήστες και την πρόοδό τους.  
- **Claim NFT**: Μετά την ολοκλήρωση όλων των κουίζ, ξεκλειδώστε και κάντε mint το ειδικό Proof of Escape NFT.  

### 👛 Προβολή ESCAPE Tokens στο MetaMask

- Δίκτυο: QBFT Education Network  
- Συμβόλαιο Token: `0xb62C4826BfF365827c923a14CCB5137eA0360402`  
- Προσθέστε αυτό το token χειροκίνητα στο MetaMask για να δείτε το υπόλοιπό σας.  

### 💧 Αίτηση EDU-D Tokens

Για να αλληλεπιδράσετε με την εφαρμογή Proof of Escape, θα χρειαστείτε δοκιμαστικά tokens (EDU-D) στο δίκτυο QBFT_Besu_EduNet. Αυτά καλύπτουν τα έξοδα συναλλαγών. Μπορείτε να αποκτήσετε τέτοια tokens χρησιμοποιώντας το faucet που έχει δημιουργηθεί για τον λόγο αυτό.

🔗 Faucet: [https://faucet.dimikog.org/](https://faucet.dimikog.org/)  

👉 Δείτε [Οδηγίες Αίτησης Tokens](./guides/info-for-besu-faucet.md) για λεπτομέρειες και περιορισμούς.  

### 🖼️ Προβολή του PoE NFT στο MetaMask

Μετά την ολοκλήρωση όλων των κουίζ, μπορείτε να κάνετε mint ένα ειδικό Proof of Escape NFT. Αυτό αποτελεί ένα σήμα διάκρισης το οποίο όμως, παράλληλα, θα χρησιμοποιηθεί σε μελλοντικές φάσεις του παιχνιδιού που θα δημιουργηθούν σύντομα.  

Για να δείτε το NFT στο MetaMask:  

1. Ανοίξτε το MetaMask και συνδεθείτε στο **QBFT Education Network**.  
2. Μεταβείτε στην καρτέλα **NFTs** (διαθέσιμη στο mobile app ή στο MetaMask Portfolio).  
3. Κάντε κλικ στο **Import NFT**.  
4. Εισάγετε τα παρακάτω:  
   - **Διεύθυνση Συμβολαίου NFT**: `0x095dbc84D218695B09Ab6Ac662C11C8312621ed5`  
   - **Token ID**: Χρησιμοποιήστε το ID που θα εμφανιστεί μετά το minting (συνήθως `1` αν είναι το πρώτο σας).  

📌 **Κρατήστε αυτό το NFT** — θα ξεκλειδώσει πρόσβαση στην επόμενη φάση του Proof of Escape, σύντομα διαθέσιμη.  

### 📂 Δομή Έργου

```
proof-of-escape/
├── docs/        # Frontend εφαρμογή (GitHub Pages)
├── contracts/   # Συμβόλαια Solidity (PoE, ESCAPE token, NFT)
├── guides/      # Οδηγοί για πορτοφόλι, faucet, και ρυθμίσεις δικτύου
├── meta/        # MMetadata (ABI, πληροφορίες token, remappings)
├── .archive/    # AΑρχειοθετημένα αρχεία και παλαιότερες εκδόσεις συμβολαίων
└── README.md    # Αυτό το αρχείο
```

⚠️ Αυτόματα παραγόμενα αρχεία (π.χ. node_modules, cache, out) αγνοούνται από το git.  

### 🛠️ Απαιτήσεις (μόνο για ανάπτυξη)

- [Foundry](https://getfoundry.sh/) για ανάπτυξη και δοκιμή συμβολαίων  
- Επέκταση MetaMask στον browser  

### 📄 Άδεια

MIT License — δείτε το αρχείο LICENSE για λεπτομέρειες.

---

💡 Δημιουργήθηκε με ❤️ για εκπαίδευση στο blockchain