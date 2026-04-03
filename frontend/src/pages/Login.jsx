import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Github, LogIn, ArrowRight, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { redirectToGithub } from '../utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGithubLogin = () => {
    setIsLoading(true);
    setError(null);
    try {
      redirectToGithub('login');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-neub-bg flex items-center justify-center px-4 py-20">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div variants={fadeIn} className="flex items-center gap-3 mb-12">
          <div className="p-3 bg-neub-primary border-[3px] border-black shadow-[4px_4px_0_0_#000] rounded-xl">
            <Shield className="w-7 h-7 text-black" />
          </div>
          <span className="text-3xl font-black uppercase tracking-tighter">BloCert</span>
        </motion.div>

        {/* Card */}
        <motion.div variants={fadeIn} className="brutal-card p-10 bg-white">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 italic leading-none">
            Welcome<br />Back.
          </h1>
          <p className="text-gray-500 font-bold text-sm mb-10">
            Sign in to access the Admin portal and manage blockchain credentials.
          </p>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-start gap-3 p-4 bg-red-100 border-[3px] border-red-500 rounded-xl mb-8 shadow-[4px_4px_0_0_rgba(239,68,68,1)]"
            >
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <p className="text-red-700 font-bold text-xs uppercase tracking-tight">{error}</p>
            </motion.div>
          )}

          {/* GitHub Login Button */}
          <button
            id="github-login-btn"
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-4 py-5 bg-black text-white font-black text-lg uppercase tracking-widest rounded-xl border-[3px] border-black shadow-[6px_6px_0_0_#D9FF00] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Github className="w-6 h-6" />
            )}
            {isLoading ? 'Redirecting...' : 'Continue with GitHub'}
          </button>

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-[3px] bg-black"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">OR</span>
            <div className="flex-1 h-[3px] bg-black"></div>
          </div>

          {/* Info Block */}
          <div className="p-5 bg-neub-primary border-[3px] border-black shadow-[4px_4px_0_0_#000] rounded-xl mb-8">
            <p className="text-[11px] font-black uppercase tracking-wide text-black leading-relaxed">
              🔐 Only authorized admin accounts can issue certificates. Your identity is verified via GitHub OAuth.
            </p>
          </div>

          <p className="text-center text-sm font-bold text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-black text-black underline decoration-2 hover:decoration-neub-accent transition-all">
              Sign Up
            </Link>
          </p>
        </motion.div>

        {/* Back to home */}
        <motion.div variants={fadeIn} className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
