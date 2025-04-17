# Proof of Escape

Welcome to the **Proof of Escape** repository! This project is designed to help students learn blockchain concepts through interactive quizzes and challenges.

## Overview

**Proof of Escape** is a blockchain-based educational game where participants answer quiz questions, compute cryptographic hashes, and submit their answers on-chain. The contract is pre-deployed on the Sepolia testnet, allowing students to interact with it without the need to deploy it themselves.

## Repository Structure

- **`questions/`**: Contains quiz questions and instructions. Each quiz is in a separate file, such as `quiz1.md`, `quiz2.md`, etc.  
- **`guides/`**: Contains step-by-step instructions for connecting to the Sepolia testnet, using Remix, and submitting answers.  
- **`contract-info/`**:  
  - `contract-address.txt`: The deployed contract’s address on the Sepolia testnet.  
  - `abi.json`: The contract’s ABI (Application Binary Interface) for use in Remix or other tools.  
  - `etherscan-link.md`: A link to the verified contract on Sepolia’s block explorer.  
- **`README.md`**: This file, providing an overview and instructions.  
- **`LICENSE`**: The license under which this content is provided.

## How to Participate

1. **Get the Quiz Questions:**  
   - Open the `questions/` folder and select the quiz you want to answer.  
   - Follow the instructions provided in each quiz file.

2. **Connect to Sepolia:**  
   - Use Metamask or another wallet to connect to the Sepolia testnet.  
   - Ensure you have some test ETH (details on obtaining test ETH can be found in `guides/sepolia-setup.md`).

3. **Open the Contract in Remix:**  
   - Visit [Remix](https://remix.ethereum.org).  
   - Use the contract address in `contract-info/contract-address.txt` to interact with the already deployed contract.  
   - Follow the instructions in `guides/remix-instructions.md` for step-by-step guidance.

4. **Submit Your Answer:**  
   - Compute the hash of your answer as described in the quiz file.  
   - Use Remix to call the contract’s `checkQuizAnswer` function, passing the quiz ID and the hash of your answer.  
   - If the contract returns `true`, congratulations! You’ve completed the quiz.

## Adding New Quizzes

If you’re an administrator or contributor, you can add new quizzes by:  
- Creating a new markdown file in `questions/`.  
- Writing a new question and providing any relevant hints.  
- Setting the correct hash in the contract.

## License

This repository is licensed under the MIT License. See the `LICENSE` file for details.

---

Feel free to customize the content further to meet your specific needs.  
