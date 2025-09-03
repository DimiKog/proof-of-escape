// js/network.js

export async function addBesuNetwork() {
    const chainId = '0x67932'; // 424242 in hex

    try {
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId,
                chainName: 'QBFT_Besu_EduNet',
                nativeCurrency: {
                    name: 'EDU-D',
                    symbol: 'EDU-D',
                    decimals: 18,
                },
                rpcUrls: ['https://rpc.dimikog.org/rpc/'],
                blockExplorerUrls: ['https://blockexplorer.dimikog.org/'],
            }],
        });
    } catch (err) {
        console.error("🛑 Failed to add Besu network:", err);
    }
}