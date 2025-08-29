// docs/js/config.js

// Expose config globally
window.CONFIG = {
    RPC_URL: "https://rpc.dimikog.org/rpc/",
    CONTRACT_ADDRESS: "0xBD42717b03Ab29ecCb67A953aaaB95b2fCa64f1A",
    TOKEN_ADDRESS: "0x951b0eAEB6F46FA0B3cc97Fbbf0BE3947a6AfE3b",

    // helpful extras (used by wallet switching, etc.)
    CHAIN_ID: 424242,
    CHAIN_ID_HEX: "0x67932", // 424242 in hex (double-check this is the correct hex for your chain)
    NETWORK_NAME: "QBFT_Besu_EduNet",
    CURRENCY_SYMBOL: "EDU-D",
    EXPLORER_URL: "https://blockexplorer.dimikog.org/",
    API_BASE: "https://poe-api.duckdns.org",

    // New
    ADMIN_ADDRESS: "0x5E3a74f09D490F854e12A293E1d6abCBbEad6B60",


    // NEW: NFT reward contract
    NFT_CONTRACT_ADDRESS: "0x095dbc84D218695B09Ab6Ac662C11C8312621ed5",
    NFT_ABI_PATH: "./abi/PoEQuizRewardNFT.json"
};

// Load ABIs once and store the *array* on window.*
window.loadABIs = async function loadABIs() {
    const poeJson = await fetch('./abi/ProofOfEscape.json').then(r => r.json());
    const tokenJson = await fetch('./abi/EscapeToken.json').then(r => r.json());
    const nftJson = await fetch(window.CONFIG.NFT_ABI_PATH).then(r => r.json());

    // expose arrays (handle either {abi:[...]} or [...] shapes)
    window.POE_ABI = Array.isArray(poeJson) ? poeJson : poeJson.abi;
    window.TOKEN_ABI = Array.isArray(tokenJson) ? tokenJson : tokenJson.abi;
    window.NFT_ABI = Array.isArray(nftJson) ? nftJson : nftJson.abi;
};

// Set global contract addresses
window.POE_ADDRESS = window.CONFIG.CONTRACT_ADDRESS;
window.TOKEN_ADDRESS = window.CONFIG.TOKEN_ADDRESS;
window.NFT_ADDRESS = window.CONFIG.NFT_CONTRACT_ADDRESS;