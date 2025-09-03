// js/network.js

export async function addBesuNetwork() {
    const chainId = '0x67b66a'; // 424242 in hex

    try {
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId,
                chainName: 'PoE Besu QBFT',
                nativeCurrency: {
                    name: 'Besu Fantoken',
                    symbol: 'BFT',
                    decimals: 18,
                },
                rpcUrls: ['https://rpc.dimikog.org'],
                blockExplorerUrls: ['https://blockexplorer.dimikog.org'],
            }],
        });
    } catch (err) {
        console.error("🛑 Failed to add Besu network:", err);
    }
}