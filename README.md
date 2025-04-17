# Proof of Escape: Quizzes and Smart Contracts

Welcome to the **Proof of Escape** repository! This repository contains the quiz questions and smart contract code for the Proof of Escape blockchain-based game.

## Getting Started

Follow the steps below to set up and participate in the quizzes:

1. **Clone the repository:**  
   To start, you need to download the repository to your local machine. Run:

   This will create a local copy of the repository.

2. **Explore the directory structure:**  
- **`questions/`**: This folder contains the quiz questions. Each quiz is stored in a separate file, such as `quiz1.md`, `quiz2.md`, and so on.  
- **`contracts/`**: This folder holds the smart contract code. You can load this code into Remix or any Solidity-compatible IDE to interact with the quizzes.  
- **`README.md`**: You’re reading this file! It provides an overview and instructions.

3. **Read the quiz questions:**  
Navigate to the `questions/` folder and open the markdown file for the quiz you want to attempt. For example: **questions/quiz1.md**
Inside, you’ll find the question, hints, and instructions on how to calculate the hash.

4. **Open the smart contract:**  
Go to the `contracts/` folder and open the `ProofOfEscape.sol` contract in Remix or your chosen IDE.  
If you’re using Remix, follow these steps:  
- Open [Remix](https://remix.ethereum.org).  
- Load the contract from the `contracts/ProofOfEscape.sol` file.  
- Deploy it on the **Sepolia testnet** (make sure you’re connected to Sepolia in Remix’s environment settings).

5. **Submit your answer:**  
Once you have the correct hash (based on the question), call the contract’s function (e.g., `checkQuizAnswer`) with the hash to see if it’s correct.  
If you receive a `true` response, you’ve completed the quiz!

## Adding New Quizzes

If you’re an administrator or contributor, you can add new quizzes as follows:
- Create a new markdown file in `questions/`. For example, `questions/quiz3.md`.  
- Write the new question and include any hints or context.  
- Make sure the corresponding hash is set in the smart contract.

## License

This repository is licensed under the MIT License. See the `LICENSE` file for more details.

---

**Feel free to edit this README.md to add more details as the project grows!**
