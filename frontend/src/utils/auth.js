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

const GITHUB_CLIENT_ID = 'Ov23li7YGnviee5NN9bS'; // Replace with your real client ID
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
 * Exchanges authorization code for a session and user data via our backend.
 */
export const exchangeCodeForSession = async (code) => {
  const res = await fetch('http://localhost:5000/api/auth/github/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Authentication failed');
  }

  return data.data; // { user, accessToken }
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
