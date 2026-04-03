const crypto = require('crypto');

/**
 * Generate SHA-256 hash of a file buffer
 * @param {Buffer} buffer - File content
 * @returns {string} SHA-256 hash hex string
 */
const generateSHA256Hash = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

module.exports = { generateSHA256Hash };
