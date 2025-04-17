# 🏆 Proof of Escape 🗝️

Welcome to the **Proof of Escape** repository! This project is designed to help students learn blockchain concepts through **interactive quizzes and challenges**.

## 🚀 Overview

**Proof of Escape** is a **blockchain-based educational game** where participants:

- Answer quiz questions 🤔
- Compute cryptographic hashes 🔑
- Submit their answers **on-chain** 🔗

The smart contract is **pre-deployed on the Sepolia testnet**, allowing students to interact with it directly without the complexities of deployment.

## 📂 Repository Structure

Here's a breakdown of the project's organization:

- **`questions/`**: ❓ Quiz questions and instructions. Each quiz resides in its own Markdown file (e.g., `quiz1.md`, `quiz2.md`).
- **`guides/`**: 📚 Step-by-step guides for:
    - Connecting to the Sepolia testnet 🌐
    - Getting Sepolia ETH from faucets  💧
    - Using the Remix IDE 🛠️
    - Submitting your answers ✍️
- **`contract-info/`**: 📜 Important contract details:
    - `contract-address.txt`: The **deployed contract address** on the Sepolia testnet. 📍
    - `abi.json`: The **Application Binary Interface (ABI)** for interacting with the contract in Remix or other tools. ⚙️
    - `etherscan-link.md`: A direct link to the **verified contract on the Sepolia block explorer**. <0xF0><0x9F><0xAA><0x9E>🔎
- **`README.md`**: 📖 This file you're currently reading, providing a project overview and participation instructions.
- **`LICENSE`**: 📄 The **license** under which this content is distributed.

## 🧑‍🎓 How to Participate

Follow these steps to test your blockchain knowledge:

1. **Get the Quiz Questions:** 🧐
   - Navigate to the `questions/` folder.
   - Select the quiz file you wish to attempt.
   - Carefully read and understand the instructions within the quiz file.

2. **Connect to Sepolia:** 🔗
   - Use **Metamask** or another compatible wallet to connect to the **Sepolia testnet**.
   - Ensure you have some **test ETH** to pay for transaction fees (instructions on obtaining test ETH can be found in `guides/info-for-sepolia-faucets.md`). 💰

3. **Open the Contract in Remix:** 💻
   - Go to the **Remix IDE**: [https://remix.ethereum.org](https://remix.ethereum.org).
   - Utilize the contract address found in `contract-info/contract-address.txt` to interact with the pre-deployed contract.
   - Consult the step-by-step instructions in `guides/remix-instructions.md` for guidance.

4. **Submit Your Answer:** ✅
   - **Compute the cryptographic hash** of your answer as specified in the respective quiz file. 🔑
   - In Remix, call the contract's `checkQuizAnswer` function.
   - Pass the **quiz ID** and the **hash of your answer** as arguments.
   - If the contract returns `true`, **Congratulations!** 🎉 You have successfully completed the quiz.

## ➕ Adding New Quizzes (For Administrators/Contributors)

If you have the necessary permissions, you can contribute new learning material:

- Create a new Markdown file within the `questions/` directory.
- Formulate a new quiz question and include any relevant hints for students.
- Ensure the corresponding correct answer hash is set within the smart contract.

## 📜 License

This project is licensed under the **MIT License**. For complete details, please refer to the `LICENSE` file.

---
