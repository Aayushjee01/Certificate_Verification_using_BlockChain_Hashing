const express = require('express');
const { handleGithubCallback } = require('../controllers/authController');

const router = express.Router();

/**
 * Endpoint called from the frontend callback page after receiving standard GitHub OAuth code.
 * POST /api/auth/github/callback
 */
router.post('/github/callback', handleGithubCallback);

module.exports = router;
