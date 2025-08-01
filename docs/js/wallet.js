// wallet.js

let provider;
let signer;
let userAddress;
const ADMIN_ADDRESS = '0x5E3a74f09D490F854e12A293E1d6abCBbEad6B60';

const networkParams = {
    chainId: '0x67676', // 424242 in hex
    chainName: 'QBFT_Besu_EduNet',
    nativeCurrency: {
        name: 'EDU-D',
        symbol: 'EDU-D',
        decimals: 18
    },
    rpcUrls: ['http://195.251.92.200/rpc/'],
    blockExplorerUrls: ['http://83.212.76.39']
};

/**
 * Connects the user's wallet and returns a contract instance.
 * @returns {Promise<ethers.Contract|null>} The contract instance on success, or null on failure.
 */
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed!');
        return null;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
            alert('No accounts found in MetaMask.');
            return null;
        }

        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        userAddress = accounts[0];

        const el = document.getElementById('walletAddress');
        // Use the shortenAddress utility function from utils.js
        if (el) el.textContent = window.shortenAddress(userAddress);

        // Check if the user is on the correct network
        const network = await provider.getNetwork();
        const expectedChainId = parseInt(networkParams.chainId, 16);

        console.log('Dapp Detected Chain ID:', network.chainId);
        console.log('Expected Chain ID:', expectedChainId);

        if (network.chainId !== expectedChainId) {
            document.getElementById('networkWarning').style.display = 'block';
            document.getElementById('networkStatus').style.display = 'none';
            // Use showTempMessage from utils.js with the correct signature
            window.showTempMessage('walletStatus', '⚠️ Please manually switch to QBFT_Besu_EduNet.', 5000, true);
            return null;
        }

        // If the network is correct, proceed
        document.getElementById('networkWarning').style.display = 'none';
        document.getElementById('networkStatus').style.display = 'block';
        window.showTempMessage('walletStatus', '✅ Wallet connected!', 3000);

        const contractAddress = '0x874205E778d2b3E5F2B8c1eDfBFa619e6fF0c9aF';
        const contractABI = await (await fetch('./abi/ProofOfEscape.json')).json();
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);

        addDisconnectButton();

        return contractInstance;
    } catch (err) {
        console.error('Wallet connection failed:', err);
        return null;
    }
}

/**
 * Gets the current provider instance.
 * @returns {ethers.Provider} The provider.
 */
function getProvider() {
    if (!provider) throw new Error('Wallet not connected');
    return provider;
}

/**
 * Gets the current signer instance.
 * @returns {ethers.Signer} The signer.
 */
function getSigner() {
    if (!signer) throw new Error('Wallet not connected');
    return signer;
}

/**
 * Gets the user's connected address.
 * @returns {string|null} The user's address or null if not connected.
 */
function getUserAddress() {
    return userAddress;
}

/**
 * Disconnects the wallet and resets state.
 */
function disconnectWallet() {
    provider = null;
    signer = null;
    userAddress = null;
    const el = document.getElementById('walletAddress');
    if (el) el.textContent = 'Not connected';
    window.location.reload();
}

/**
 * Adds a disconnect button to the page.
 */
function addDisconnectButton() {
    const walletContainer = document.getElementById('walletAddress');
    if (!walletContainer || document.getElementById('disconnectButton')) return;

    const button = document.createElement('button');
    button.id = 'disconnectButton';
    button.textContent = 'Disconnect Wallet';
    button.onclick = disconnectWallet;
    button.style.marginLeft = '10px';
    button.style.padding = '5px 10px';
    button.style.cursor = 'pointer';

    walletContainer.insertAdjacentElement('afterend', button);
}

/**
 * Checks if the current user is the admin.
 * @returns {boolean} True if the user is the admin.
 */
function isAdmin() {
    return userAddress?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
}

/**
 * Registers the user's wallet with the smart contract.
 * @param {ethers.Contract} contractInstance The contract instance.
 */
async function registerWallet(contractInstance) {
    try {
        const address = getUserAddress();
        if (!address) throw new Error('Wallet not connected');

        const isRegistered = await contractInstance.registeredUsers(address);
        if (isRegistered) {
            console.log('User already registered');
            return;
        }

        const tx = await contractInstance.connect(getSigner()).register();
        await tx.wait();
        console.log('Registration successful');
        window.showTempMessage('walletStatus', '✅ Registration successful!', 3000);
    } catch (err) {
        console.error('Failed to register wallet:', err);
        window.showTempMessage('walletStatus', '⚠️ Registration failed. Check console.', 3000, true);
    }
}

// Expose functions to the global scope
window.connectWallet = connectWallet;
window.getProvider = getProvider;
window.getSigner = getSigner;
window.getUserAddress = getUserAddress;
window.disconnectWallet = disconnectWallet;
window.addDisconnectButton = addDisconnectButton;
window.isAdmin = isAdmin;
window.registerWallet = registerWallet;