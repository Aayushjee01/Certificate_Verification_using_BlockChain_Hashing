const { contract } = require('../config/blockchain');
const { generateSHA256Hash } = require('../utils/hashing');

/**
 * Handle certificate upload and hash storage on blockchain
 */
const uploadCertificate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded",
        data: {}
      });
    }

    // 1. Generate Hash from the uploaded file buffer
    const fileHash = generateSHA256Hash(req.file.buffer);
    console.log("Generated hash for upload:", fileHash);

    // 2. Call Smart Contract Function: storeCertificateHash(string)
    // The backend uses its own signer (defined in blockchain.config) to pay for gas
    const tx = await contract.storeCertificateHash(fileHash);
    console.log("Transaction sent:", tx.hash);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt.hash);

    // 3. Return JSON Response as requested
    return res.status(200).json({
      success: true,
      message: "Certificate uploaded and hash stored on blockchain successfully",
      data: {
        certificateHash: fileHash,
        transactionHash: receipt.hash
      }
    });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Blockchain transaction failed: " + (error.reason || error.message),
      data: {}
    });
  }
};

/**
 * Handle certificate verification against blockchain
 */
const verifyCertificate = async (req, res) => {
  try {
    let hashToVerify = req.body.hash;

    // If file is uploaded, generate hash from it
    if (req.file) {
      hashToVerify = generateSHA256Hash(req.file.buffer);
    }

    if (!hashToVerify) {
      return res.status(400).json({
        success: false,
        message: "No file or hash provided for verification",
        data: {}
      });
    }

    console.log("Verifying hash:", hashToVerify);

    // Call Smart Contract Function: verifyCertificateHash(string) returns (bool)
    const isValid = await contract.verifyCertificateHash(hashToVerify);

    return res.status(200).json({
      success: true,
      message: isValid ? "Certificate is valid" : "Certificate is NOT valid / Not found",
      data: {
        isValid,
        hash: hashToVerify
      }
    });

  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Blockchain verification failed: " + (error.reason || error.message),
      data: {}
    });
  }
};

module.exports = {
  uploadCertificate,
  verifyCertificate
};
