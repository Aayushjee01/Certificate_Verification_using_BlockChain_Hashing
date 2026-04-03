import { ethers } from 'ethers';

// Contract Address and ABI (Placeholders)
// In a real scenario, these would be exported from a hardhat/forge deployment
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Localhost default

export const CONTRACT_ABI = [
  "function storeCertificateHash(string hash) public",
  "function verifyCertificateHash(string hash) public view returns (bool)",
  "event CertificateStored(string hash, address indexed owner, uint256 timestamp)"
];

/**
 * Connect to MetaMask and return provider and signer
 */
export const getWeb3Provider = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed! Please install it to interact with the blockchain.");
  }
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
  } catch (error) {
    console.error("User denied account access", error);
    throw error;
  }
};

/**
 * Get the contract instance
 */
export const getContractInstance = async () => {
  const { signer } = await getWeb3Provider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

/**
 * Generate a SHA-256 hash of a file or string
 */
export const generateHash = async (content) => {
  // Simple hash for demonstration purposes
  // In a real app, use crypto.subtle.digest('SHA-256', ...) for PDF content
  if (typeof content === 'string') {
    const msgUint8 = new TextEncoder().encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // For File objects
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target.result;
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      resolve(hashHex);
    };
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(content);
  });
};

/**
 * Store a certificate hash on the blockchain
 */
export const storeOnBlockchain = async (hash) => {
  const contract = await getContractInstance();
  const tx = await contract.storeCertificateHash(hash);
  console.log("Transaction sent:", tx.hash);
  const receipt = await tx.wait();
  console.log("Transaction confirmed:", receipt.hash);
  return receipt.hash;
};

/**
 * Verify a certificate hash on the blockchain
 */
export const verifyOnBlockchain = async (hash) => {
  const contract = await getContractInstance();
  return await contract.verifyCertificateHash(hash);
};
