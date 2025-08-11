// wallet.js

let provider;
let signer;
let userAddress;
let isConnecting = false;

const ADMIN_ADDRESS = '0x5E3a74f09D490F854e12A293E1d6abCBbEad6B60';

// Not used for switching (MetaMask rejects http), but keep for reference
const networkParams = {
    chainId: '0x67932', // 424242
    chainName: 'QBFT_Besu_EduNet',
    nativeCurrency: { name: 'EDU-D', symbol: 'EDU-D', decimals: 18 },
    rpcUrls: ['http://195.251.92.200/rpc/'],
    blockExplorerUrls: ['http://83.212.76.39']
};

/**
 * Connects wallet, checks network, builds/stashes contract, wires disconnect.
 * Returns the contract instance (or null on failure).
 */
async function connectWallet() {
    if (isConnecting) return null;
    isConnecting = true;

    if (!window.ethereum) {
        alert('MetaMask is not installed!');
        isConnecting = false;
        return null;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || !accounts.length) {
            window.showTempMessage?.('walletStatus', 'No accounts found in MetaMask.', 3000, true);
            isConnecting = false;
            return null;
        }

        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        userAddress = accounts[0];

        // Show short address
        const wa = document.getElementById('walletAddress');
        if (wa) wa.textContent = (window.shortenAddress?.(userAddress)) || userAddress;

        // Network check (no switching here to avoid HTTPS requirement)
        const net = await provider.getNetwork();
        const onBesu = net?.chainId === BigInt(424242);
        const ns = document.getElementById('networkStatus');
        const nw = document.getElementById('networkWarning');
        if (ns) ns.style.display = onBesu ? 'block' : 'none';
        if (nw) nw.style.display = onBesu ? 'none' : 'block';

        if (!onBesu) {
            window.showTempMessage?.('walletStatus', '⚠️ Please switch MetaMask to QBFT_Besu_EduNet.', 5000, true);
            isConnecting = false;
            return null;
        }

        // Build contract (prefer CONFIG from config.js if present)
        const abi = await (await fetch('./abi/ProofOfEscape.json')).json();
        const contractAddress =
            (window.CONFIG && window.CONFIG.CONTRACT_ADDRESS) ||
            '0x874205E778d2b3E5F2B8c1eDfBFa619e6fF0c9aF'; // fallback, but try to avoid hardcoding
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // Stash globally for other modules
        window.POE = { provider, signer, address: userAddress, contract };

        // Wire (or create) disconnect button
        addDisconnectButton();

        // Listen to account changes (refresh signer/contract and UI)
        if (window.ethereum?.on) {
            window.ethereum.removeAllListeners?.('accountsChanged');
            window.ethereum.on('accountsChanged', async (accts) => {
                if (!accts || !accts.length) return;
                userAddress = accts[0];
                const wa2 = document.getElementById('walletAddress');
                if (wa2) wa2.textContent = (window.shortenAddress?.(userAddress)) || userAddress;

                signer = await provider.getSigner();
                window.POE = {
                    provider,
                    signer,
                    address: userAddress,
                    contract: new ethers.Contract(contractAddress, abi, signer)
                };

                // Let other parts refresh (if they hooked into this)
                window.dispatchEvent(new CustomEvent('poe:walletChanged', { detail: { address: userAddress } }));
            });
        }

        window.showTempMessage?.('walletStatus', '✅ Wallet connected!', 2500);
        return contract;

    } catch (err) {
        console.error('Wallet connection failed:', err);
        window.showTempMessage?.('walletStatus', '⚠️ Could not connect wallet. See console.', 4000, true);
        return null;
    } finally {
        isConnecting = false;
    }
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
    return userAddress || null;
}

function disconnectWallet() {
    provider = null;
    signer = null;
    userAddress = null;
    window.POE = undefined;
    const wa = document.getElementById('walletAddress');
    if (wa) wa.textContent = 'Not connected';
    // Don’t hard reload; let page stay. If you prefer reload: window.location.reload();
}

function addDisconnectButton() {
    // If a static button exists, just wire it
    let btn = document.getElementById('disconnectButton');
    if (btn) {
        btn.style.display = 'inline-block';
        if (!btn._wired) {
            btn.addEventListener('click', disconnectWallet);
            btn._wired = true;
        }
        return;
    }

    // Otherwise, create one after the walletAddress span
    const walletSpan = document.getElementById('walletAddress');
    if (!walletSpan || document.getElementById('disconnectButton')) return;

    btn = document.createElement('button');
    btn.id = 'disconnectButton';
    btn.textContent = 'Disconnect Wallet';
    btn.addEventListener('click', disconnectWallet);
    btn.style.marginLeft = '10px';
    btn.style.padding = '5px 10px';
    btn.style.cursor = 'pointer';
    walletSpan.insertAdjacentElement('afterend', btn);
}

function isAdmin() {
    return userAddress?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
}

async function registerWallet(contract) {
    if (!contract && window.POE?.contract) contract = window.POE.contract;
    if (!contract) {
        window.showTempMessage?.('walletStatus', 'Wallet not connected.', 3000, true);
        return;
    }
    try {
        const tx = await contract.register();
        await tx.wait();
        window.showTempMessage?.('walletStatus', '✅ Registration successful!', 3000);
        window.dispatchEvent(new CustomEvent('poe:registered', { detail: { address: userAddress } }));
    } catch (error) {
        console.error('Failed to register wallet:', error);
        let msg = 'Failed to register. Check console.';
        if (error?.reason?.includes('Already registered')) msg = 'You are already registered.';
        if (error?.code === 'ACTION_REJECTED') msg = 'Registration was rejected.';
        window.showTempMessage?.('walletStatus', `⚠️ ${msg}`, 4500, true);
    }
}

// Expose to window (used by main.js and others)
window.connectWallet = connectWallet;
window.getProvider = getProvider;
window.getSigner = getSigner;
window.getUserAddress = getUserAddress;
window.disconnectWallet = disconnectWallet;
window.addDisconnectButton = addDisconnectButton;
window.isAdmin = isAdmin;
window.registerWallet = registerWallet;