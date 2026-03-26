import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Upload, Search, Menu, X, Wallet, Github, ExternalLink, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import AdminUpload from './pages/AdminUpload';
import VerifyCertificate from './pages/VerifyCertificate';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthCallback from './pages/AuthCallback';
import { getSession, clearSession } from './utils/auth';

// ─── Navbar ─────────────────────────────────────────────────────────────────
const Navbar = ({ account, connectWallet, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Don't show navbar on auth pages
  if (['/login', '/signup', '/auth/callback'].includes(location.pathname)) return null;

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/verify', label: 'Verify' },
    { path: '/upload', label: 'Admin' },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] md:w-[80%] z-50 bg-white border-[3px] border-black shadow-brutal rounded-2xl overflow-hidden">
      <div className="px-5">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-neub-primary border-2 border-black rounded-lg">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black tracking-tighter text-black">BloCert</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 text-sm font-black uppercase tracking-widest rounded-lg border-2 transition-all ${
                  isActive(path)
                    ? 'bg-neub-primary border-black'
                    : 'border-transparent hover:border-black hover:bg-neub-primary/20 text-gray-600'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Wallet */}
            {account ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-neub-secondary border-[3px] border-black shadow-brutal rounded-xl">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black font-mono">{account.slice(0, 6)}...{account.slice(-4)}</span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="flex items-center gap-2 px-4 py-2.5 bg-neub-accent border-[3px] border-black shadow-brutal hover:shadow-brutal-active hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-black text-xs font-black uppercase tracking-widest rounded-xl"
              >
                <Wallet className="w-4 h-4" />
                Wallet
              </button>
            )}

            {/* GitHub User or Auth buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl border-[3px] border-black shadow-brutal" />
                <button
                  onClick={onLogout}
                  className="p-2.5 bg-white border-[3px] border-black shadow-brutal hover:shadow-brutal-active hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4 text-black" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2.5 bg-black text-white border-[3px] border-black shadow-[4px_4px_0_0_#D9FF00] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-xs font-black uppercase tracking-widest rounded-xl"
              >
                <Github className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 border-2 border-transparent hover:border-black rounded-lg"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t-[3px] border-black overflow-hidden"
          >
            <div className="px-5 py-6 space-y-4">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`block text-lg font-black uppercase tracking-tight ${isActive(path) ? 'text-black underline decoration-4 decoration-neub-primary' : 'text-gray-600'}`}
                >
                  {label}
                </Link>
              ))}

              <div className="pt-4 border-t-[2px] border-black space-y-3">
                {!account && (
                  <button onClick={() => { connectWallet(); setIsOpen(false); }} className="w-full btn-brutal-primary py-4">
                    <Wallet size={18} /> Connect Wallet
                  </button>
                )}
                {!user ? (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full bg-black text-white border-[3px] border-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 shadow-[4px_4px_0_0_#D9FF00]">
                    <Github size={18} /> Login with GitHub
                  </Link>
                ) : (
                  <button onClick={onLogout} className="w-full btn-brutal-outline py-4">
                    <LogOut size={18} /> Log Out ({user.name})
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ─── Footer ──────────────────────────────────────────────────────────────────
const Footer = () => {
  const location = useLocation();
  if (['/login', '/signup', '/auth/callback'].includes(location.pathname)) return null;

  return (
    <footer className="py-16 border-t-4 border-black mt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="bg-black p-2 rounded-lg">
              <Shield className="w-5 h-5 text-neub-primary" />
            </div>
            <span className="font-black text-2xl uppercase tracking-tighter">BloCert</span>
          </div>
          <p className="text-sm font-bold text-gray-600 text-center">
            © {new Date().getFullYear()} BloCert · Built on Ethereum · Neubrutalism UI
          </p>
          <div className="flex items-center gap-8">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-black hover:scale-125 transition-transform"><Github size={22} /></a>
            <a href="#" className="text-black hover:scale-125 transition-transform"><ExternalLink size={22} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [account, setAccount] = useState(null);
  const [user, setUser] = useState(() => getSession());

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (err) {
        console.error('Wallet connection failed', err);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-neub-bg text-black selection:bg-neub-primary selection:text-black">
        <Navbar account={account} connectWallet={connectWallet} user={user} onLogout={handleLogout} />

        <main className="pt-32 md:pt-40">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/"               element={<Home connectWallet={connectWallet} />} />
              <Route path="/upload"         element={<AdminUpload account={account} user={user} />} />
              <Route path="/verify"         element={<VerifyCertificate />} />
              <Route path="/login"          element={<Login />} />
              <Route path="/signup"         element={<Signup />} />
              <Route path="/auth/callback"  element={<AuthCallback onLogin={setUser} />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
