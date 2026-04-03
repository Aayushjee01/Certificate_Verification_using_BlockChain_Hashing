const express = require('express');
const multer = require('multer');
const { uploadCertificate, verifyCertificate } = require('../controllers/certificateController');

const router = express.Router();

// Multer Storage Configuration
// Using memory storage for PDF processing without saving it to disk
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB Max file size
  fileFilter: (req, file, cb) => {
    // Only accept PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

/**
 * POST /api/certificates/upload
 * Accept PDF file -> Hash -> Store on Blockchain
 */
router.post('/upload', upload.single('certificate'), uploadCertificate);

/**
 * POST /api/certificates/verify
 * Accept PDF file OR hash string -> Verify on Blockchain
 */
router.post('/verify', upload.single('certificate'), verifyCertificate);

module.exports = router;
