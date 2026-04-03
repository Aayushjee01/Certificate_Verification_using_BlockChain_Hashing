import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, UserPlus, Shield, AlertCircle, Loader2, Star } from 'lucide-react';
import { redirectToGithub } from '../utils/auth';

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGithubSignup = () => {
    setIsLoading(true);
    setError(null);
    try {
      redirectToGithub('signup');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const perks = [
    { icon: '🔏', title: 'Issue Certificates', desc: 'Store official hashes on-chain with a single click.' },
    { icon: '⚡', title: 'Instant Verification', desc: 'Let anyone verify your issued certs in seconds.' },
    { icon: '🌍', title: 'Global Ledger', desc: 'Ethereum-backed, borderless, permanent records.' },
  ];

  return (
    <div className="min-h-screen bg-neub-bg flex items-center justify-center px-4 py-20">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-10"
      >
        {/* Left – Perks panel */}
        <motion.div variants={fadeIn} className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-black border-[3px] border-black shadow-[4px_4px_0_0_#D9FF00] rounded-xl">
              <Shield className="w-7 h-7 text-neub-primary" />
            </div>
            <span className="text-3xl font-black uppercase tracking-tighter">BloCert</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic leading-none mb-8">
            Join the<br /><span className="bg-neub-primary px-3 border-[3px] border-black">Future</span><br />of Trust.
          </h2>

          <p className="text-gray-600 font-bold mb-12 leading-relaxed">
            Create your admin account and start issuing tamper-proof certificates secured by Ethereum blockchain.
          </p>

          <div className="space-y-6">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-start gap-5 p-5 bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] rounded-2xl hover:-translate-y-1 hover:shadow-[4px_8px_0_0_#000] transition-all">
                <span className="text-3xl">{perk.icon}</span>
                <div>
                  <h4 className="font-black uppercase tracking-tight text-base mb-1">{perk.title}</h4>
                  <p className="text-gray-500 font-bold text-xs leading-tight">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right – Signup Card */}
        <motion.div variants={fadeIn} className="brutal-card p-10 bg-white self-start">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 italic leading-none">
            Create<br />Account.
          </h1>
          <p className="text-gray-500 font-bold text-sm mb-10">
            Connect via GitHub to get instant admin access.
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

          {/* GitHub Signup Button */}
          <button
            id="github-signup-btn"
            onClick={handleGithubSignup}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-4 py-5 bg-black text-white font-black text-lg uppercase tracking-widest rounded-xl border-[3px] border-black shadow-[6px_6px_0_0_#D9FF00] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-6"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Github className="w-6 h-6" />
            )}
            {isLoading ? 'Redirecting to GitHub...' : 'Sign Up with GitHub'}
          </button>

          {/* Terms note */}
          <div className="p-4 bg-neub-secondary/30 border-[3px] border-black rounded-xl mb-8 shadow-[4px_4px_0_0_#000]">
            <p className="text-[11px] font-black uppercase tracking-wide text-black leading-relaxed">
              📋 By signing up, you agree to only use BloCert for legitimate certificate issuance. Misuse of the admin portal will result in account revocation.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-[3px] bg-black"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Already registered?</span>
            <div className="flex-1 h-[3px] bg-black"></div>
          </div>

          <Link
            to="/login"
            id="go-to-login-btn"
            className="w-full flex items-center justify-center gap-3 py-4 bg-neub-primary border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all font-black text-sm uppercase tracking-widest rounded-xl"
          >
            Log In Instead
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
