# Using Remix to Interact with Proof of Escape

1. Go to [Remix](https://remix.ethereum.org).
2. In the "Deploy & Run Transactions" tab, select the "Injected Provider - MetaMask" environment.
3. Connect your MetaMask wallet and ensure it is set to the Sepolia network.
4. Copy the contract address from `contract-info/contract-address.txt`.
5. Paste the contract address into the "At Address" field and click "At Address" to load the contract.
6. Open the contract’s functions and call `checkQuizAnswer` with the correct quiz ID and your answer.
