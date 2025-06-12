import { ethers } from "ethers";
import fs from "fs";
import abi from "./frontend/abi/EscapeToken.json" assert { type: "json" };

// Set up provider & wallet (use private key only in a secure/test setting)
const provider = new ethers.JsonRpcProvider("http://195.251.92.200");
const signer = new ethers.Wallet("0x51128a67767eb4e2282074561f9488c8f2ac97bac1a55c340460f4da16efaf2c", provider);

// Contract address (replace with actual)
const tokenAddress = "0xb62C4826BfF365827c923a14CCB5137eA0360402"; // deployed EscapeToken address
const token = new ethers.Contract(tokenAddress, abi, signer);

const recipient = "0x0E66db7d115B8F392eB7DFb8BaCb23675dAEB59E";
const amount = ethers.parseUnits("100", 18); // 100 ESCAPE

const tx = await token.transfer(recipient, amount);
await tx.wait();
console.log(`✅ Sent 100 ESCAPE to ${recipient}`);

async function testToken() {
  console.log("✅ Starting test...");

  try {
    const name = await token.name();
    const symbol = await token.symbol();
    const supply = await token.totalSupply();
    const balance = await token.balanceOf(await signer.getAddress());

    console.log("Token name:", name);
    console.log("Symbol:", symbol);
    console.log("Total supply:", ethers.formatUnits(supply, 18));
    console.log("Your balance:", ethers.formatUnits(balance, 18));
  } catch (err) {
    console.error("🔥 Failed to interact with token:", err);
  }
}

testToken().catch(console.error);