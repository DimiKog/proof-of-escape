// wallet.js

function showTempMessage(id, message, duration = 3000, isError = false) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.style.color = isError ? 'red' : 'green';
    el.style.display = 'block';
    setTimeout(() => {
        el.style.display = 'none';
    }, duration);
}

let provider;
let signer;
let userAddress;
const ADMIN_ADDRESS = '0x5E3a74f09D490F854e12A293E1d6abCBbEad6B60'; // Update if needed

const networkParams = {
    chainId: '0x67932A', // 424242 in hex
    chainName: 'QBFT_Besu_EduNet',
    nativeCurrency: {
        name: 'EDU-D',
        symbol: 'EDU-D',
        decimals: 18
    },
    rpcUrls: ['http://195.251.92.200/rpc/'],
    blockExplorerUrls: ['http://83.212.76.39']
};

async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed!');
        return;
    }

    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
            alert('No accounts found in MetaMask.');
            return;
        }
        signer = await provider.getSigner();
        userAddress = accounts[0];

        const contractAddress = '0x874205E778d2b3E5F2B8c1eDfBFa619e6fF0c9aF';
        const contractABI = await (await fetch('./abi/ProofOfEscape.json')).json();
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);

        const el = document.getElementById('walletAddress');
        if (el) el.textContent = truncateAddress(userAddress);
        const network = await provider.getNetwork();
        if (network.chainId !== parseInt(networkParams.chainId, 16)) {
            await switchToBesuNetwork();
        }
        showTempMessage('walletStatus', '✅ Wallet connected!', 3000);

        const registerBtn = document.getElementById('registerButton');
        if (registerBtn) {
            const isRegistered = await contractInstance.registeredUsers(userAddress);
            if (!isRegistered) {
                registerBtn.style.display = 'block';
                registerBtn.onclick = async () => {
                    await registerWallet(contractInstance);
                    registerBtn.style.display = 'none';
                };
            } else {
                registerBtn.style.display = 'none';
            }
        }

        addDisconnectButton();

        // Disable quiz selector for unregistered users
        const quizSelect = document.getElementById('quizSelect');
        if (quizSelect) {
            const isRegistered = await contractInstance.registeredUsers(userAddress);
            quizSelect.disabled = !isRegistered;
            // Optionally, add a tooltip if disabled
            if (!isRegistered) {
                quizSelect.title = 'You must register before selecting a quiz.';
            } else {
                quizSelect.title = '';
            }
            const registrationNotice = document.getElementById('registrationNotice');
            if (registrationNotice) {
                registrationNotice.style.display = isRegistered ? 'none' : 'block';
            }
            const adminSection = document.getElementById('adminSection');
            if (adminSection && isAdmin()) {
                adminSection.style.display = 'block';
            }
        }
        // You can now use the contract instance elsewhere
        return contractInstance;
    } catch (err) {
        console.error('Wallet connection failed:', err);
    }
}

async function switchToBesuNetwork() {
    try {
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkParams]
        });
    } catch (error) {
        console.error('⚠️ Failed to switch to QBFT_Besu_EduNet:', error);
        showTempMessage('walletStatus', '⚠️ Failed to switch to QBFT_Besu_EduNet. Please add it manually in MetaMask.', 4000, true);
    }
}

function truncateAddress(address) {
    if (!address) return 'Not connected';
    return address.substring(0, 6) + '...' + address.slice(-4);
}

function getProvider() {
    if (!provider) throw new Error('Wallet not connected');
    return provider;
}

function getSigner() {
    if (!signer) throw new Error('Wallet not connected');
    return signer;
}

function getUserAddress() {
    return userAddress;
}

function disconnectWallet() {
    provider = null;
    signer = null;
    userAddress = null;
    const el = document.getElementById('walletAddress');
    if (el) el.textContent = 'Not connected';
}

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
function isAdmin() {
    return userAddress?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
}
// Register wallet function to interact with the smart contract
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
        showTempMessage('walletStatus', '✅ Registration successful!', 3000);
    } catch (err) {
        console.error('Failed to register wallet:', err);
        showTempMessage('walletStatus', '⚠️ Registration failed. Check console.', 3000);
    }
}

window.connectWallet = connectWallet;
window.switchToBesuNetwork = switchToBesuNetwork;
window.truncateAddress = truncateAddress;
window.getProvider = getProvider;
window.getSigner = getSigner;
window.getUserAddress = getUserAddress;
window.disconnectWallet = disconnectWallet;
window.addDisconnectButton = addDisconnectButton;
window.isAdmin = isAdmin;
window.registerWallet = registerWallet;