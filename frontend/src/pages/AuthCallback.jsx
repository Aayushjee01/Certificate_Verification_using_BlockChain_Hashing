import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { parseGithubCallback, exchangeCodeForToken, fetchGithubUser, saveSession } from '../utils/auth';

export default function AuthCallback({ onLogin }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('Verifying GitHub identity...');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 1. Parse the code from URL
        setMessage('Reading authorization code...');
        const { code } = parseGithubCallback();

        // 2. Exchange code for token (needs backend in production)
        setMessage('Exchanging code for access token...');
        const token = await exchangeCodeForToken(code);

        // 3. Fetch user profile
        setMessage('Fetching your GitHub profile...');
        const githubUser = await fetchGithubUser(token);

        // 4. Save session
        const sessionUser = {
          login: githubUser.login,
          name: githubUser.name || githubUser.login,
          email: githubUser.email,
          avatar: githubUser.avatar_url,
          bio: githubUser.bio,
          repos: githubUser.public_repos,
          followers: githubUser.followers,
        };
        saveSession(sessionUser);
        setUser(sessionUser);

        // 5. Notify App level
        if (onLogin) onLogin(sessionUser);

        setStatus('success');
        setMessage(`Welcome, ${sessionUser.name}!`);

        // Clean the URL
        window.history.replaceState({}, document.title, '/auth/callback');

        // Redirect to admin after 2s
        setTimeout(() => navigate('/upload'), 2000);
      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage(err.message || 'Authentication failed. Please try again.');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-neub-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="brutal-card p-14 bg-white text-center max-w-md w-full"
      >
        {/* Icon */}
        <div className={`w-20 h-20 mx-auto mb-8 border-[3px] border-black flex items-center justify-center rounded-2xl shadow-[6px_6px_0_0_#000] ${
          status === 'success' ? 'bg-neub-primary' :
          status === 'error'   ? 'bg-red-400' :
          'bg-neub-secondary'
        }`}>
          {status === 'loading' && <Shield className="text-black w-10 h-10 animate-pulse" />}
          {status === 'success' && <CheckCircle2 className="text-black w-10 h-10" />}
          {status === 'error'   && <XCircle className="text-white w-10 h-10" />}
        </div>

        {/* Spinner (loading only) */}
        {status === 'loading' && (
          <Loader2 className="mx-auto w-8 h-8 animate-spin mb-6 text-black" />
        )}

        {/* User avatar (success) */}
        {status === 'success' && user?.avatar && (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full border-[3px] border-black shadow-[4px_4px_0_0_#000] mx-auto mb-6"
          />
        )}

        <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-4 leading-none">
          {status === 'loading' && 'Authenticating'}
          {status === 'success' && 'Access Granted!'}
          {status === 'error'   && 'Auth Failed'}
        </h2>

        <p className="font-bold text-gray-600 text-sm mb-6 leading-relaxed">{message}</p>

        {status === 'success' && (
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Redirecting to Admin Portal...
          </p>
        )}

        {status === 'error' && (
          <button
            onClick={() => navigate('/login')}
            className="mt-6 w-full py-4 bg-black text-white font-black uppercase tracking-widest border-[3px] border-black shadow-[4px_4px_0_0_#D9FF00] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl text-sm"
          >
            Try Again
          </button>
        )}
      </motion.div>
    </div>
  );
}
