const axios = require('axios');
require('dotenv').config();

const exchangeCodeForToken = async (code) => {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error('GitHub Client ID or Secret not configured in backend .env');
  }

  // GitHub endpoint for exchanging temporary code for a permanent access token
  const response = await axios.post('https://github.com/login/oauth/access_token', {
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    code: code
  }, {
    headers: { 'Accept': 'application/json' } // GitHub returns URL-encoded format by default, we want JSON
  });

  if (response.data.error) {
    throw new Error(`GitHub Auth Error: ${response.data.error_description || response.data.error}`);
  }

  return response.data.access_token;
};

const fetchGithubUser = async (accessToken) => {
  // Fetch user profile from GitHub API
  const response = await axios.get('https://api.github.com/user', {
    headers: { 'Authorization': `token ${accessToken}` }
  });
  return response.data;
};

const fetchGithubUserEmails = async (accessToken) => {
  // Optional: Fetch user emails (useful if primary email is private)
  const response = await axios.get('https://api.github.com/user/emails', {
    headers: { 'Authorization': `token ${accessToken}` }
  });
  return response.data;
};

module.exports = { exchangeCodeForToken, fetchGithubUser, fetchGithubUserEmails };
