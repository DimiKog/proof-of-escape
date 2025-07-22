// quiz.js

import { ethers } from "ethers";
import ProofOfEscape from '../abi/ProofOfEscape.json' assert { type: "json" };
const ProofOfEscapeAddress = "0x874205E778d2b3E5F2B8c1eDfBFa619e6fF0c9aF"; // Adjust if different

const quizDropdown = document.getElementById('quizDropdown');
const quizDescription = document.getElementById('quizDescription');
const quizDetails = document.getElementById('quizDetails');
const quizDetailsContent = document.getElementById('quizDetailsContent');
const quizHint = document.getElementById('quizHint');
const quizReward = document.getElementById('quizReward');
const startQuizBtn = document.getElementById('startQuizBtn');
const quizIdDisplay = document.getElementById('quizIdDisplay');

async function loadQuizList() {
    const response = await fetch('/proof-of-escape/quizzes.json');
    return await response.json();
}

async function isUserRegistered() {
    if (!window.ethereum) return false;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    const contract = new ethers.Contract(
        ProofOfEscapeAddress,
        ProofOfEscape,
        signer
    );

    return await contract.registeredUsers(userAddress);
}

export async function initializeQuizDropdown() {
    const registered = await isUserRegistered();
    if (!registered) {
        quizDropdown.disabled = true;
        quizDescription.textContent = '⚠️ Please register your wallet first.';
        quizIdDisplay.textContent = 'None';
        return;
    }

    const quizzes = await loadQuizList();
    quizzes.forEach(quiz => {
        const option = document.createElement('option');
        option.value = quiz.id;
        option.textContent = `Quiz ${quiz.id}: ${quiz.title}`;
        quizDropdown.appendChild(option);
    });
}

// Event listener for quiz selection change with validation and error handling
quizDropdown.addEventListener('change', async () => {
    const selectedId = parseInt(quizDropdown.value);
    if (!selectedId) {
        quizDescription.textContent = '';
        quizDetails.style.display = 'none';
        quizHint.textContent = '';
        quizReward.textContent = '';
        quizIdDisplay.textContent = 'None';
        return;
    }

    try {
        const quiz = await getQuizById(selectedId);
        if (!quiz) {
            quizDescription.textContent = '⚠️ Quiz data not found.';
            quizDetails.style.display = 'none';
            quizHint.textContent = '';
            quizReward.textContent = '';
            quizIdDisplay.textContent = 'None';
            return;
        }

        quizDescription.textContent = quiz.description;
        quizDetailsContent.textContent = quiz.details;
        quizDetails.style.display = 'block';
        quizHint.textContent = `Hint: ${quiz.hashHint}`;
        quizReward.textContent = `🏆 Reward: ${quiz.reward} tokens`;
        quizIdDisplay.textContent = selectedId;
    } catch (error) {
        console.error('Error loading quiz:', error);
        quizDescription.textContent = '⚠️ Error loading quiz.';
        quizDetails.style.display = 'none';
        quizHint.textContent = '';
        quizReward.textContent = '';
        quizIdDisplay.textContent = 'None';
    }
});

startQuizBtn.addEventListener('click', () => {
    const selectedId = quizDropdown.value;
    document.getElementById('quizId').value = selectedId;
    quizIdDisplay.textContent = selectedId;
});