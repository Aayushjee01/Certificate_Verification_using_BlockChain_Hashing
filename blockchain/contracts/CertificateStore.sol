// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CertificateStore
 * @dev Simple contract to store and verify certificate hashes on a public ledger.
 */
contract CertificateStore {
    // Mapping of hash (SHA-256) to its existance on the chain
    mapping(string => bool) private certificates;
    
    // Event emitted when a new certificate is issued/stored
    event CertificateStored(string hash, address indexed issuer, uint256 timestamp);

    /**
     * @dev Store a certificate hash on the blockchain.
     * @param _hash The SHA-256 hash string of the certificate file.
     */
    function storeCertificateHash(string memory _hash) public {
        require(!certificates[_hash], "Certificate hash is already stored on-chain.");
        
        certificates[_hash] = true;
        emit CertificateStored(_hash, msg.sender, block.timestamp);
    }

    /**
     * @dev Verify if a certificate hash exists on the blockchain.
     * @param _hash The hash string to check.
     * @return bool True if valid (exists on chain), false otherwise.
     */
    function verifyCertificateHash(string memory _hash) public view returns (bool) {
        return certificates[_hash];
    }
}
