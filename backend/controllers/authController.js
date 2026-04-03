const githubService = require('../services/githubService');

/**
 * Handle the GitHub OAuth callback after the user is redirected back to the frontend
 * @param {Request} req - The standard Express request
 * @param {Response} res - The JSON response
 */
const handleGithubCallback = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code query parameter is missing from the GitHub callback",
        data: {}
      });
    }

    console.log("Exchanging GitHub OAuth code for a token...");

    // 1. Swap the temporary authorization code for a permanent access token
    const accessToken = await githubService.exchangeCodeForToken(code);

    // 2. Use the token to fetch the user's GitHub profile information
    const userProfile = await githubService.fetchGithubUser(accessToken);

    // 3. Optional: Map GitHub user to your database here if necessary.
    // For now, we return the user and token to the frontend manage its state.
    return res.status(200).json({
      success: true,
      message: "GitHub authentication successful",
      data: {
        user: {
          id: userProfile.id,
          username: userProfile.login,
          name: userProfile.name,
          avatar: userProfile.avatar_url,
          email: userProfile.email,
          bio: userProfile.bio
        },
        accessToken: accessToken
      }
    });

  } catch (error) {
    console.error("Authentication Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "GitHub Authentication failed: " + error.message,
      data: {}
    });
  }
};

module.exports = {
  handleGithubCallback
};
