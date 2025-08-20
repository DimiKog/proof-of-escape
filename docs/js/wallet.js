// wallet.js

let provider;
let signer;
let userAddress;
let isConnecting = false;

// Local fallback if utils.js didn't define one
function _short(addr) {
    if (!addr) return 'Not connected';
    return addr.slice(0, 6) + '...' + addr.slice(-4);
}

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
 * Ensure the ProofOfEscape ABI is loaded into memory.
 * Tries (1) window.POE_ABI if set by config.js, (2) waits for window.ABIS_READY,
 * (3) falls back to fetching ./abi/ProofOfEscape.json and normalizing.
 */
async function loadPoEAbi() {
    // Already present from config.js preloading?
    if (window.POE_ABI && Array.isArray(window.POE_ABI)) return window.POE_ABI;

    // If config.js exposed a promise, await it
    try {
        if (window.ABIS_READY) {
            await window.ABIS_READY;
            if (window.POE_ABI && Array.isArray(window.POE_ABI)) return window.POE_ABI;
        }
    } catch { /* ignore and fall through */ }

    // Fallback: fetch artifact and normalize
    try {
        const artifact = await (await fetch('./abi/ProofOfEscape.json')).json();
        const arr = toAbiArray(artifact);
        if (arr && Array.isArray(arr)) {
            window.POE_ABI = arr; // cache for future calls
            return arr;
        }
    } catch (e) {
        console.warn('Failed to fetch local ProofOfEscape ABI:', e);
    }
    return null;
}

/**
 * Backward/forward-compatible registration checker.
 * Supports old `registeredUsers(address)` and new `isRegistered(address)`.
 */
async function checkRegistered(contract, addr) {
    if (!contract || !addr) return false;
    try {
        console.log("Checking registration for", addr);
        console.log("Contract methods:", Object.keys(contract));
        if (typeof contract.isRegistered === 'function') {
            const result = await contract.isRegistered(addr);
            console.log("isRegistered result:", result);
            return result;
        }
        if (typeof contract.registeredUsers === 'function') {
            const result = await contract.registeredUsers(addr);
            console.log("registeredUsers result:", result);
            return result;
        }
    } catch (e) {
        console.warn('checkRegistered failed:', e);
    }
    return false;
}

/**
 * Refresh Register button, quiz gating, and admin panel.
 * - Always show the quiz section.
 * - If not registered => show Register button, disable dropdown, show hint.
 * - If registered => hide Register button, enable dropdown, hide hint.
 */
async function refreshRegistrationUI(contract = (window.POE?.contract), addr = userAddress) {
    const regBtn = document.getElementById('registerButton');
    const quizWrapper = document.getElementById('quizSection');
    const quizSelect = document.getElementById('quizDropdown');
    const gateMsg = document.getElementById('quizGateHint'); // optional <p id="quizGateHint">

    try {
        // Always show the section; we gate inside it.
        if (quizWrapper) quizWrapper.style.display = 'block';

        const isReg = await checkRegistered(contract, addr);

        // Register button
        if (regBtn) regBtn.style.display = isReg ? 'none' : 'inline-block';

        // Gate the quiz select
        if (quizSelect) quizSelect.disabled = !isReg;

        // Gate message
        if (gateMsg) {
            gateMsg.textContent = isReg ? '' : '🔒 Please register to view and attempt quizzes.';
            gateMsg.style.display = isReg ? 'none' : 'block';
        }

        // Admin panel visibility
        const adminEl = document.getElementById('adminSection');
        if (adminEl) adminEl.style.display = isAdmin() ? 'block' : 'none';

    } catch (e) {
        console.warn('refreshRegistrationUI failed:', e);
        // Fail-safe defaults
        if (quizWrapper) quizWrapper.style.display = 'block';
        if (regBtn) regBtn.style.display = 'inline-block';
        if (quizSelect) quizSelect.disabled = true;
        if (gateMsg) { gateMsg.textContent = '🔒 Please register to view and attempt quizzes.'; gateMsg.style.display = 'block'; }
    }
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
        if (wa) wa.textContent = (window.shortenAddress?.(userAddress)) || _short(userAddress);

        // Network check
        const net = await provider.getNetwork();
        const onBesu = net && net.chainId && BigInt(net.chainId) === BigInt(CHAIN_ID_DEC);
        const ns = document.getElementById('networkStatus');
        const nw = document.getElementById('networkWarning');
        if (ns) ns.style.display = onBesu ? 'block' : 'none';
        if (nw) nw.style.display = onBesu ? 'none' : 'block';

        if (!onBesu) {
            window.showTempMessage?.('walletStatus', '⚠️ Please switch MetaMask to QBFT_Besu_EduNet.', 5000, true);

            // Keep the section visible but locked
            const quizWrapper = document.getElementById('quizSection');
            const quizSelect = document.getElementById('quizDropdown');
            const gateMsg = document.getElementById('quizGateHint');
            const regBtn = document.getElementById('registerButton');

            if (quizWrapper) quizWrapper.style.display = 'block';
            if (quizSelect) quizSelect.disabled = true;
            if (gateMsg) {
                gateMsg.textContent = '🌐 Switch to QBFT_Besu_EduNet to continue.';
                gateMsg.style.display = 'block';
            }
            if (regBtn) regBtn.style.display = 'inline-block';

            isConnecting = false;
            return null;
        }

        // Load ABI using robust helper
        const abi = await loadPoEAbi();

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

        // Stash globally for other modules BEFORE refreshRegistrationUI
        window.POE = { provider, signer, address: userAddress, contract };


        // 👉 ensure UI reflects registration state immediately
        await refreshRegistrationUI(window.POE.contract, userAddress);

        // Toggle Admin panel visibility if connected as admin
        try {
            const adminEl = document.getElementById('adminSection');
            if (adminEl) {
                adminEl.style.display = isAdmin() ? 'block' : 'none';
            }
        } catch (e) {
            console.warn('Admin panel toggle failed:', e);
        }

        // Wire disconnect button
        addDisconnectButton();

        // Chain change listener
        if (window.ethereum?.on) {
            window.ethereum.removeAllListeners?.('chainChanged');
            window.ethereum.on('chainChanged', async (cidHex) => {
                const ns = document.getElementById('networkStatus');
                const nw = document.getElementById('networkWarning');
                const toBigInt = (v) =>
                    (typeof v === 'string' && v.startsWith('0x')) ? BigInt(v) : BigInt(Number(v));
                const onBesuNow = (toBigInt(cidHex) === toBigInt(CHAIN_ID_DEC));
                if (ns) ns.style.display = onBesuNow ? 'block' : 'none';
                if (nw) nw.style.display = onBesuNow ? 'none' : 'block';

                if (onBesuNow) {
                    // Rebuild signer/contract and refresh UI
                    signer = await provider.getSigner();
                    window.POE = {
                        provider,
                        signer,
                        address: userAddress,
                        contract: new ethers.Contract(contractAddress, abi, signer)
                    };
                    if (window.POE?.contract) {
                        await refreshRegistrationUI(window.POE.contract, userAddress);
                    }
                } else {
                    // Not on target chain: hide quiz and show register button
                    const quizWrapper = document.getElementById('quizSection');
                    if (quizWrapper) quizWrapper.style.display = 'none';
                    const regBtn = document.getElementById('registerButton');
                    if (regBtn) regBtn.style.display = 'inline-block';
                }
            });
        }

        // Account change listener
        if (window.ethereum?.on) {
            // Remove previous handler if any
            window.ethereum.removeAllListeners?.('accountsChanged');
            window.ethereum.on('accountsChanged', async (accts) => {
                if (!accts || !accts.length) return;
                userAddress = accts[0];

                const wa2 = document.getElementById('walletAddress');
                if (wa2) wa2.textContent = (window.shortenAddress?.(userAddress)) || _short(userAddress);

                signer = await provider.getSigner();
                window.POE = {
                    provider,
                    signer,
                    address: userAddress,
                    contract: new ethers.Contract(contractAddress, abi, signer)
                };

                if (window.POE?.contract) {
                    await refreshRegistrationUI(window.POE.contract, userAddress);
                }

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
        await refreshRegistrationUI();
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