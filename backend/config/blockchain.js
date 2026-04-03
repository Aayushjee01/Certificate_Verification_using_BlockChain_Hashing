const { ethers } = require('ethers');
require('dotenv').config();

// Initialize provider and signer
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Smart Contract details (imported from src/utils/blockchain.js format)
const CONTRACT_ABI = [
  "function storeCertificateHash(string hash) public",
  "function verifyCertificateHash(string hash) public view returns (bool)",
  "event CertificateStored(string hash, address indexed owner, uint256 timestamp)"
];

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, CONTRACT_ABI, signer);

module.exports = { provider, signer, contract };
