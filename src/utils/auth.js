// ─────────────────────────────────────────────────────────────────────────────
// GitHub OAuth Config
// To make this work for real:
//  1. Go to https://github.com/settings/applications/new
//  2. Set "Homepage URL" to http://localhost:5173
//  3. Set "Authorization callback URL" to http://localhost:5173/auth/callback
//  4. Replace GITHUB_CLIENT_ID with your App's Client ID
//
// NOTE: The token exchange step (code → access_token) REQUIRES a backend 
//       because GitHub does not support CORS on the token endpoint.
//       This file handles the redirect/callback flow and simulates the 
//       token exchange for demo purposes.
// ─────────────────────────────────────────────────────────────────────────────

const GITHUB_CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID'; // Replace with your real client ID
const REDIRECT_URI = `${window.location.origin}/auth/callback`;
const SCOPE = 'read:user user:email';

/**
 * Builds a GitHub OAuth authorization URL and redirects the user.
 * @param {'login'|'signup'} mode - Controls prompt/signup hints
 */
export const redirectToGithub = (mode = 'login') => {
  const state = btoa(JSON.stringify({ mode, nonce: crypto.randomUUID() }));
  sessionStorage.setItem('github_oauth_state', state);
  sessionStorage.setItem('github_oauth_mode', mode);

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    state,
    allow_signup: mode === 'signup' ? 'true' : 'false',
  });

  window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
};

/**
 * Parses the callback URL after GitHub redirects back.
 * Returns { code, state } from query params.
 */
export const parseGithubCallback = () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');
  const error = params.get('error');
  const storedState = sessionStorage.getItem('github_oauth_state');

  if (error) throw new Error(`GitHub auth error: ${error}`);
  if (!code) throw new Error('No authorization code received');
  if (state !== storedState) throw new Error('State mismatch – possible CSRF attack');

  return { code, state };
};

/**
 * Exchanges authorization code for an access token.
 * ⚠️  In a production app, this MUST happen on a backend server.
 *     GitHub blocks the token endpoint from browsers (CORS).
 *     Use a Next.js API route, Express server, or serverless function.
 *
 * For local dev/demo: set up a CORS proxy or serverless function.
 */
export const exchangeCodeForToken = async (code) => {
  // PRODUCTION: call YOUR backend, which calls GitHub's token endpoint
  // const res = await fetch('/api/auth/github', { method: 'POST', body: JSON.stringify({ code }) });
  // const { access_token } = await res.json();
  // return access_token;

  // DEMO SIMULATION (remove when connecting a real backend):
  console.warn('Demo mode: Simulating token exchange. Attach a backend to make this real.');
  return 'demo_access_token_' + code.slice(0, 8);
};

/**
 * Fetches the GitHub user profile using a valid access token.
 */
export const fetchGithubUser = async (accessToken) => {
  if (accessToken.startsWith('demo_access_token_')) {
    // Return mock user in demo mode
    return {
      login: 'demo_user',
      name: 'Demo User',
      email: 'demo@blocert.io',
      avatar_url: `https://avatars.githubusercontent.com/u/0?v=4`,
      bio: 'Blockchain enthusiast',
      public_repos: 12,
      followers: 34,
    };
  }

  const res = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to fetch GitHub user profile');
  return res.json();
};

/**
 * Stores auth user in localStorage for session persistence.
 */
export const saveSession = (user) => {
  localStorage.setItem('blocert_user', JSON.stringify(user));
};

/**
 * Retrieves the saved session (if any).
 */
export const getSession = () => {
  try {
    const raw = localStorage.getItem('blocert_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Clears the session (logout).
 */
export const clearSession = () => {
  localStorage.removeItem('blocert_user');
  sessionStorage.removeItem('github_oauth_state');
  sessionStorage.removeItem('github_oauth_mode');
};
