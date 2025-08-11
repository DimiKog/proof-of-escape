// wallet.js

let provider;
let signer;
let userAddress;
let isConnecting = false;

const ADMIN_ADDRESS = window.CONFIG?.ADMIN_ADDRESS || '';

const CHAIN_ID_DEC = (window.CONFIG?.CHAIN_ID) ?? 424242;
const CONTRACT_ADDRESS = (window.CONFIG?.CONTRACT_ADDRESS) || '';

/**
 * Normalize a loaded ABI artifact to just the ABI array.
 */
function toAbiArray(maybeArtifact) {
    if (!maybeArtifact) return null;
    // Hardhat/Foundry artifact: { abi: [...] }
    if (Array.isArray(maybeArtifact)) return maybeArtifact;
    if (Array.isArray(maybeArtifact.abi)) return maybeArtifact.abi;
    return null;
}

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
        // Request accounts
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

        // Network check
        const net = await provider.getNetwork();
        const onBesu = net?.chainId === BigInt(CHAIN_ID_DEC);
        const ns = document.getElementById('networkStatus');
        const nw = document.getElementById('networkWarning');
        if (ns) ns.style.display = onBesu ? 'block' : 'none';
        if (nw) nw.style.display = onBesu ? 'none' : 'block';

        if (!onBesu) {
            window.showTempMessage?.('walletStatus', '⚠️ Please switch MetaMask to QBFT_Besu_EduNet.', 5000, true);
            isConnecting = false;
            return null;
        }

        // Load ABI (prefer preloaded from config.js)
        try { await window.ABIS_READY; } catch {/* ignore */ }
        let abi = window.POE_ABI || null;

        if (!abi) {
            // Fallback: fetch artifact and normalize
            const artifact = await (await fetch('./abi/ProofOfEscape.json')).json();
            abi = toAbiArray(artifact);
        }

        if (!abi || !Array.isArray(abi)) {
            console.error('Failed to obtain ABI array. Got:', abi);
            window.showTempMessage?.('walletStatus', '⚠️ ABI not loaded. See console.', 4000, true);
            isConnecting = false;
            return null;
        }

        // Contract address check
        const contractAddress = CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
        if (!CONTRACT_ADDRESS) {
            console.warn('CONFIG.CONTRACT_ADDRESS is empty. Using 0x00… placeholder will fail calls.');
        }

        // Build contract
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // Stash globally for other modules
        window.POE = { provider, signer, address: userAddress, contract };

        // Wire disconnect button
        addDisconnectButton();

        // Account change listener
        if (window.ethereum?.on) {
            // Remove previous handler if any
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

                window.dispatchEvent(new CustomEvent('poe:walletChanged', { detail: { address: userAddress } }));
            });
        }

        // Optional: show Register button if not registered yet
        try {
            const regBtn = document.getElementById('registerButton');
            if (regBtn && contract?.registeredUsers) {
                const isRegistered = await contract.registeredUsers(userAddress);
                regBtn.style.display = isRegistered ? 'none' : 'inline-block';
            }
        } catch (e) {
            console.warn('Could not check registeredUsers:', e);
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
}

function addDisconnectButton() {
    let btn = document.getElementById('disconnectButton');
    if (btn) {
        btn.style.display = 'inline-block';
        if (!btn._wired) {
            btn.addEventListener('click', disconnectWallet);
            btn._wired = true;
        }
        return;
    }
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
        const regBtn = document.getElementById('registerButton');
        if (regBtn) regBtn.style.display = 'none';
    } catch (error) {
        console.error('Failed to register wallet:', error);
        let msg = 'Failed to register. Check console.';
        if (error?.reason?.includes('Already registered')) msg = 'You are already registered.';
        if (error?.code === 'ACTION_REJECTED') msg = 'Registration was rejected.';
        window.showTempMessage?.('walletStatus', `⚠️ ${msg}`, 4500, true);
    }
}

// Expose to window
window.connectWallet = connectWallet;
window.getProvider = getProvider;
window.getSigner = getSigner;
window.getUserAddress = getUserAddress;
window.disconnectWallet = disconnectWallet;
window.addDisconnectButton = addDisconnectButton;
window.isAdmin = isAdmin;
window.registerWallet = registerWallet;