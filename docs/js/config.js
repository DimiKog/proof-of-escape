// docs/js/config.js

// Expose config globally
window.CONFIG = {
    RPC_URL: "http://195.251.92.200/rpc/",
    CONTRACT_ADDRESS: "0x5B4c07DeaA3967e806A0C97Adc9432AEBA40B845",
    TOKEN_ADDRESS: "0x540d398ab66EEB6AfcD4c8BECB75E1D25643A32B",

    // helpful extras (used by wallet switching, etc.)
    CHAIN_ID: 424242,
    CHAIN_ID_HEX: "0x67932", // 424242 in hex (double-check this is the correct hex for your chain)
    NETWORK_NAME: "QBFT_Besu_EduNet",
    CURRENCY_SYMBOL: "EDU-D",
    EXPLORER_URL: "http://83.212.76.39",
    API_BASE: "https://poe-api.duckdns.org"
};

// Load ABIs once and store the *array* on window.*
window.loadABIs = async function loadABIs() {
    const poeJson = await fetch('./abi/ProofOfEscape.json').then(r => r.json());
    const tokenJson = await fetch('./abi/EscapeToken.json').then(r => r.json());

    // expose arrays (handle either {abi:[...]} or [...] shapes)
    window.POE_ABI = Array.isArray(poeJson) ? poeJson : poeJson.abi;
    window.TOKEN_ABI = Array.isArray(tokenJson) ? tokenJson : tokenJson.abi;
};