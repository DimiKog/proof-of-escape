// utils.js

/**
 * Displays a temporary status message inside a given element.
 * @param {string} elementId - ID of the element to show the message in.
 * @param {string} message - The message to display.
 * @param {number} duration - How long to show it (ms).
 * @param {boolean} isError - Whether it's an error message.
 * @param {string} [cssClass] - Optional CSS class to apply.
 */
function showTempMessage(elementId, message, duration = 3000, isError = false, cssClass = '') {
    const el = document.getElementById(elementId);
    if (!el) {
        console.warn(`Element with ID "${elementId}" not found for showTempMessage.`);
        return;
    }

    el.textContent = message;
    el.style.color = isError ? 'red' : 'green';
    if (cssClass) el.classList.add(cssClass);
    el.style.display = 'block'; // Ensure it's visible

    setTimeout(() => {
        el.textContent = '';
        el.style.color = '';
        if (cssClass) el.classList.remove(cssClass);
        el.style.display = 'none'; // Hide it again
    }, duration);
}

/**
 * Shortens an Ethereum address for display (e.g., 0xabc...123).
 * @param {string} address 
 * @returns {string}
 */
function shortenAddress(address) {
    if (!address) return '';
    return address.slice(0, 6) + '...' + address.slice(-4);
}

/**
 * Copies text to clipboard and shows feedback.
 * @param {string} text 
 * @param {string} feedbackElementId 
 */
function copyToClipboard(text, feedbackElementId) {
    navigator.clipboard.writeText(text).then(() => {
        showTempMessage(feedbackElementId, 'Copied to clipboard ✅', 2000, false);
    }).catch(() => {
        showTempMessage(feedbackElementId, 'Failed to copy ❌', 2000, true);
    });
}

/**
 * Converts a Unix timestamp to a human-readable date and time.
 * @param {number} timestamp - Unix timestamp in seconds or milliseconds.
 * @returns {string}
 */
function formatTimestamp(timestamp) {
    const ts = String(timestamp).length === 10 ? timestamp * 1000 : timestamp;
    const date = new Date(ts);
    return date.toLocaleString();
}

/**
 * Validates if a string is a valid Ethereum address.
 * @param {string} address
 * @returns {boolean}
 */
function isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Converts a string to Title Case.
 * @param {string} str
 * @returns {string}
 */
function toTitleCase(str) {
    return str.replace(/\w\S*/g, txt =>
        txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    );
}

/**
 * Handles the generation of a keccak256 hash from a string input.
 * It reads the user's answer and pastes the hash into the submission field.
 */
function handleHashGeneration() {
    const answerInput = document.getElementById('hashTestInput');
    const hashResultDisplay = document.getElementById('hashResult');
    const submissionField = document.getElementById('answer');

    if (!answerInput || !hashResultDisplay || !submissionField) {
        console.error('Required elements not found for hash generation.');
        return;
    }

    const answer = answerInput.value;
    if (answer.trim() === '') {
        window.showTempMessage('walletStatus', 'Please enter an answer to generate the hash.', 3000, true);
        return;
    }

    // Convert the answer to bytes and then compute the keccak256 hash
    const hash = ethers.keccak256(ethers.toUtf8Bytes(answer));

    // Display the hash in the dedicated <pre> tag for the user to see
    hashResultDisplay.textContent = hash;

    // Place the hash into the submission field ready for submission
    submissionField.value = hash;

    // --- NEW DEBUGGING LINE ---
    console.log("Submission field value set to:", submissionField.value);


    // Also copy the hash to the clipboard for convenience
    window.copyToClipboard(hash, 'copyHashButton');

    window.showTempMessage('walletStatus', 'Hash generated and placed in submission field.', 3000, false);
}

// Expose functions to the global scope for other scripts to use
window.showTempMessage = showTempMessage;
window.shortenAddress = shortenAddress;
window.copyToClipboard = copyToClipboard;
window.formatTimestamp = formatTimestamp;
window.isValidAddress = isValidAddress;
window.toTitleCase = toTitleCase;
window.handleHashGeneration = handleHashGeneration;