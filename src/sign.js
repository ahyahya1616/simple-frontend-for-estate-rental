import { ethers } from "ethers";

const wallet = ethers.Wallet.createRandom();
console.log("Adresse :", wallet.address);
console.log("Clé privée :", wallet.privateKey);

const nonce = "abc123";
const message = `Sign this message to authenticate with your wallet: ${nonce}`;

async function signMessage() {
  const signature = await wallet.signMessage(message);
  console.log("Signature :", signature);
}

signMessage();
