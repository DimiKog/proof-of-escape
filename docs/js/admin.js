// admin.js

(function () {
    /**
     * Handles the process of an admin uploading a new quiz answer hash.
     * @param {object} contractInstance The ethers.js Contract instance.
     */
    async function handleAdminUpload(contractInstance) {
        // Ensure a valid contract instance is provided
        if (!contractInstance) {
            console.error('❌ Contract not connected. Cannot upload hash.');
            window.showTempMessage('uploadStatus', '❌ Wallet not connected or on the wrong network.', 5000, true);
            return;
        }

        const quizId = Number(document.getElementById('adminQuizId').value);
        // Use a more robust regex to handle various non-alphanumeric characters.
        const plainAnswer = document.getElementById('adminPlainAnswer')
            .value.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
        const uploadStatusId = 'uploadStatus';
        const button = document.getElementById('uploadHashButton');

        if (!Number.isInteger(quizId) || quizId <= 0 || !plainAnswer) {
            // Corrected showTempMessage call
            window.showTempMessage(uploadStatusId, 'Please enter a valid Quiz ID and Answer.', 3000, true);
            return;
        }

        // Calculate the hash using the standard keccak256 function
        const hash = ethers.keccak256(ethers.toUtf8Bytes(plainAnswer));

        try {
            if (button) {
                button.disabled = true;
                button.textContent = 'Uploading...';
            }

            if (typeof contractInstance.uploadAnswer !== 'function') {
                console.error('❌ The connected contract does not have an uploadAnswer function.');
                window.showTempMessage(uploadStatusId, '❌ Contract missing uploadAnswer function.', 5000, true);
                return;
            }

            // Use the provided contract instance.
            // Connect to the signer to send the transaction.
            let signer;
            try {
                signer = await window.getSigner();
            } catch (err) {
                console.error('❌ Could not get signer:', err);
                window.showTempMessage(uploadStatusId, '❌ Wallet not connected. Please connect first.', 5000, true);
                return;
            }

            const tx = await contractInstance.connect(signer).uploadAnswer(quizId, hash);
            await tx.wait();

            // Corrected showTempMessage call
            window.showTempMessage(uploadStatusId, '✅ Hash uploaded successfully!', 3000, false);
        } catch (error) {
            console.error('❌ Failed to upload hash:', error);
            // Corrected showTempMessage call
            window.showTempMessage(uploadStatusId, '❌ Failed to upload hash. Check console for details.', 5000, true);
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = '📤 Upload Hash';
            }
        }
    }

    // Expose the function globally, but with a parameter for the contract instance.
    window.handleAdminUpload = handleAdminUpload;
})();