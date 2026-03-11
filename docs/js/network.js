// js/network.js

function normalizeChainId(value) {
    if (value == null) return null;
    if (typeof value === "bigint") return value;
    if (typeof value === "number") return BigInt(value);
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith("0x") || trimmed.startsWith("0X")) return BigInt(trimmed);
        return BigInt(Number(trimmed));
    }
    return null;
}

export async function addBesuNetwork() {
    if (!window.ethereum?.request) return false;
    const chainId = window.CONFIG?.CHAIN_ID_HEX || '0x67932'; // 424242 in hex
    const targetChain = normalizeChainId(chainId);

    try {
        const currentHex = await window.ethereum.request({ method: 'eth_chainId' });
        const currentChain = normalizeChainId(currentHex);
        if (currentChain != null && targetChain != null && currentChain === targetChain) {
            return true; // already on Besu, avoid noisy mobile errors
        }
    } catch (err) {
        console.warn("Unable to read current chain via eth_chainId:", err);
    }

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }]
        });
        return true;
    } catch (err) {
        // 4902 = chain not added in wallet yet
        if (err?.code !== 4902) {
            console.error("🛑 Failed to switch to Besu network:", err);
            return false;
        }
    }

    try {
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId,
                chainName: window.CONFIG?.NETWORK_NAME || 'QBFT_Besu_EduNet',
                nativeCurrency: {
                    name: window.CONFIG?.CURRENCY_SYMBOL || 'EDU-D',
                    symbol: window.CONFIG?.CURRENCY_SYMBOL || 'EDU-D',
                    decimals: 18,
                },
                rpcUrls: [window.CONFIG?.RPC_URL || 'https://rpc.dimikog.org/rpc/'],
                blockExplorerUrls: [window.CONFIG?.EXPLORER_URL || 'https://blockexplorer.dimikog.org/'],
            }],
        });
        return true;
    } catch (err) {
        console.error("🛑 Failed to add Besu network:", err);
        return false;
    }
}
