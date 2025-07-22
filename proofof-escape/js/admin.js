// admin.js

import { getSigner } from './wallet.js';
import { keccak256, toUtf8Bytes } from 'ethers';
import ProofOfEscape from '../abi/ProofOfEscape.json' assert { type: 'json' };
import { showTempMessage } from './utils.js';

const contractAddress = '0x874205E778d2b3E5F2B8c1eDfBFa619e6fF0c9aF';

export async function handleAdminUpload() {
    const quizId = Number(document.getElementById('adminQuizId').value);
    const plainAnswer = document.getElementById('adminPlainAnswer')
        .value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const uploadStatusId = 'uploadStatus';
    const button = document.getElementById('uploadHashButton');

    if (!Number.isInteger(quizId) || quizId <= 0 || !plainAnswer) {
        showTempMessage('Please enter a valid Quiz ID and Answer.', uploadStatusId, 'error');
        return;
    }

    const hash = keccak256(toUtf8Bytes(plainAnswer));
    const signer = getSigner();
    const contract = new ethers.Contract(contractAddress, ProofOfEscape.abi, signer);

    try {
        if (button) {
            button.disabled = true;
            button.textContent = 'Uploading...';
        }

        const tx = await contract.uploadAnswer(quizId, hash);
        await tx.wait();

        showTempMessage('✅ Hash uploaded successfully!', uploadStatusId, 'success');
    } catch (error) {
        console.error('❌ Failed to upload hash:', error);
        showTempMessage('❌ Failed to upload hash.', uploadStatusId, 'error');
    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = '📤 Upload Hash';
        }
    }
}