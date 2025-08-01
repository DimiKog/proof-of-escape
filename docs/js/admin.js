// admin.js

(function () {
    async function handleAdminUpload() {
        const quizId = Number(document.getElementById('adminQuizId').value);
        const plainAnswer = document.getElementById('adminPlainAnswer')
            .value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const uploadStatusId = 'uploadStatus';
        const button = document.getElementById('uploadHashButton');

        if (!Number.isInteger(quizId) || quizId <= 0 || !plainAnswer) {
            window.showTempMessage('Please enter a valid Quiz ID and Answer.', uploadStatusId, 'error');
            return;
        }

        const hash = ethers.keccak256(ethers.toUtf8Bytes(plainAnswer));
        const signer = window.getSigner();
        const contract = new ethers.Contract('0x874205E778d2b3E5F2B8c1eDfBFa619e6fF0c9aF', window.contractABI, signer);

        try {
            if (button) {
                button.disabled = true;
                button.textContent = 'Uploading...';
            }

            const tx = await contract.uploadAnswer(quizId, hash);
            await tx.wait();

            window.showTempMessage('✅ Hash uploaded successfully!', uploadStatusId, 'success');
        } catch (error) {
            console.error('❌ Failed to upload hash:', error);
            window.showTempMessage('❌ Failed to upload hash.', uploadStatusId, 'error');
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = '📤 Upload Hash';
            }
        }
    }

    window.handleAdminUpload = handleAdminUpload;
})();