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

// Expose functions to the global scope for other scripts to use
window.showTempMessage = showTempMessage;
window.shortenAddress = shortenAddress;
window.copyToClipboard = copyToClipboard;
window.formatTimestamp = formatTimestamp;
window.isValidAddress = isValidAddress;
window.toTitleCase = toTitleCase;