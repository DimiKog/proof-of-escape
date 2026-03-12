// docs/js/config.js

// Expose config globally
window.CONFIG = {
    RPC_URL: "https://rpc.dimikog.org/rpc/",
    CONTRACT_ADDRESS: "0x4FBde5B19fE07dC913966Dd0D62838c04d3896C2",
    TOKEN_ADDRESS: "0x352f1BBc9Ef3977A5F04A67EdeFE164627e7a6E2",

    CHAIN_ID: 424242,
    CHAIN_ID_HEX: "0x67932",
    NETWORK_NAME: "QBFT_Besu_EduNet",
    CURRENCY_SYMBOL: "EDU-D",
    EXPLORER_URL: "https://blockexplorer.dimikog.org/",
    API_BASE: "https://mybackend.dimikog.org",

    ADMIN_ADDRESS: "0xe63761BFE4599AAb4a7D4CFbb2229103199b3631",

    POE_QUIZ_REWARD_NFT_ADDRESS: "0x095dbc84D218695B09Ab6Ac662C11C8312621ed5",
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

    // ✅ Set ABIS only after loading
    window.ABIS = {
        ProofOfEscape: window.POE_ABI,
        EscapeToken: window.TOKEN_ABI,
        PoEQuizRewardNFT: window.NFT_ABI
    };

    console.log("✅ All ABIs loaded:", Object.keys(window.ABIS));
};

// Set global contract addresses
window.POE_ADDRESS = window.CONFIG.CONTRACT_ADDRESS;
window.TOKEN_ADDRESS = window.CONFIG.TOKEN_ADDRESS;
window.NFT_ADDRESS = window.CONFIG.POE_QUIZ_REWARD_NFT_ADDRESS;
