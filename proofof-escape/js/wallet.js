import { showTempMessage } from './utils.js';
// wallet.js

let provider;
let signer;
let userAddress;

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

export async function connectWallet() {
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
        const el = document.getElementById('walletAddress');
        if (el) el.textContent = truncateAddress(userAddress);
        const network = await provider.getNetwork();
        if (network.chainId !== parseInt(networkParams.chainId, 16)) {
            await switchToBesuNetwork();
        }
        showTempMessage('walletStatus', '✅ Wallet connected!', 3000);
        addDisconnectButton();
    } catch (err) {
        console.error('Wallet connection failed:', err);
    }
}

export async function switchToBesuNetwork() {
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

export function truncateAddress(address) {
    if (!address) return 'Not connected';
    return address.substring(0, 6) + '...' + address.slice(-4);
}

export function getProvider() {
    if (!provider) throw new Error('Wallet not connected');
    return provider;
}

export function getSigner() {
    if (!signer) throw new Error('Wallet not connected');
    return signer;
}

export function getUserAddress() {
    return userAddress;
}

export function disconnectWallet() {
    provider = null;
    signer = null;
    userAddress = null;
    const el = document.getElementById('walletAddress');
    if (el) el.textContent = 'Not connected';
}

export function addDisconnectButton() {
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
// Register wallet function to interact with the smart contract
export async function registerWallet(contractInstance) {
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