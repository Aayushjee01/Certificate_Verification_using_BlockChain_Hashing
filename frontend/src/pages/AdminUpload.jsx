import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Upload, FileText, User, Hash, Send, CheckCircle2, Loader2, AlertCircle, X, ShieldCheck, Github } from 'lucide-react';
import { generateHash, storeOnBlockchain } from '../utils/blockchain';

export default function AdminUpload({ account, user }) {
  const [formData, setFormData] = useState({
    studentName: '',
    certificateId: '',
    file: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [txStatus, setTxStatus] = useState({ success: false, hash: null, error: null });
  const [filePreview, setFilePreview] = useState(null);

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
      }
      setFormData(prev => ({ ...prev, file }));
      setFilePreview(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file || !formData.studentName || !formData.certificateId) {
      alert('All fields are required!');
      return;
    }

    setIsUploading(true);
    setTxStatus({ success: false, hash: null, error: null });

    try {
      // Use the Backend API to handle the upload and signing
      const uploadData = new FormData();
      uploadData.append('certificate', formData.file);
      uploadData.append('studentName', formData.studentName);
      uploadData.append('certificateId', formData.certificateId);

      const response = await fetch('http://localhost:5050/api/certificates/upload', {
        method: 'POST',
        body: uploadData,
      });

      const result = await response.json();

      if (result.success) {
        setTxStatus({ 
          success: true, 
          hash: result.data.transactionHash, 
          error: null 
        });
        setFormData({ studentName: '', certificateId: '', file: null });
        setFilePreview(null);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error(err);
      setTxStatus({ 
        success: false, 
        hash: null, 
        error: err.message || 'The server failed to process the blockchain transaction.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  const statusVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Page header */}
      <motion.div initial="hidden" animate="visible" variants={formVariants} className="mb-12">
        <span className="brutal-tag">Admin Access Hub</span>
        <h1 className="text-4xl md:text-6xl font-black mt-4 mb-4 uppercase tracking-tighter">
          Issue Credentials
        </h1>
        <p className="font-bold text-gray-600 max-w-xl">
          Securely register official documents on the public ledger. Permanent. Transparent. Brutal.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ── Form ── */}
        <motion.div initial="hidden" animate="visible" variants={formVariants} className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="brutal-card p-8 md:p-10 space-y-7 bg-white">

            {/* GitHub login nudge */}
            {!user && (
              <div className="flex items-center justify-between gap-4 p-4 bg-neub-secondary/30 border-[3px] border-black rounded-xl shadow-[4px_4px_0_0_#000]">
                <p className="text-xs font-black uppercase tracking-tight">
                  🔐 Login via GitHub for full admin access
                </p>
                <Link
                  to="/login"
                  className="shrink-0 flex items-center gap-2 px-4 py-2 bg-black text-white border-[3px] border-black font-black text-xs uppercase tracking-widest rounded-xl shadow-[3px_3px_0_0_#D9FF00] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <Github className="w-4 h-4" />
                  Login
                </Link>
              </div>
            )}

            {/* Wallet status (Information only) */}
            <div className="flex items-start gap-3 p-4 bg-neub-primary/20 border-[3px] border-black shadow-[4px_4px_0_0_#000] rounded-xl">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5 text-black" />
              <p className="text-xs font-black uppercase tracking-tight">
                Backend-Signing Active: Certificates will be permanently sealed via the secure organization wallet.
              </p>
            </div>

            {/* ── Student Name + Serial ID side by side ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Student Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="studentName"
                  className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400"
                >
                  Student Name
                </label>
                <div className="relative">
                  <span className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                    <User className="w-4 h-4 text-gray-600" />
                  </span>
                  <input
                    id="studentName"
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                    style={{ height: '52px' }}
                    className="brutal-input pl-11 font-bold placeholder:font-normal placeholder:text-gray-400 text-sm"
                  />
                </div>
              </div>

              {/* Certificate / Serial ID */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="certificateId"
                  className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400"
                >
                  Certificate Serial ID
                </label>
                <div className="relative">
                  <span className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                    <Hash className="w-4 h-4 text-gray-600" />
                  </span>
                  <input
                    id="certificateId"
                    type="text"
                    name="certificateId"
                    value={formData.certificateId}
                    onChange={handleInputChange}
                    placeholder="CERT-2026-XXX"
                    required
                    style={{ height: '52px' }}
                    className="brutal-input pl-11 font-bold placeholder:font-normal placeholder:text-gray-400 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* ── File upload ── */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">
                Source Document (PDF)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-[3px] border-black rounded-xl p-10 transition-all cursor-pointer flex flex-col items-center justify-center text-center shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 ${
                  filePreview ? 'bg-neub-primary/20' : 'bg-white hover:bg-neub-accent/10'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />
                {filePreview ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-neub-primary border-[3px] border-black flex items-center justify-center rounded-2xl mb-4 shadow-[4px_4px_0_0_#000]">
                      <FileText size={32} className="text-black" />
                    </div>
                    <span className="text-black font-black uppercase tracking-tight text-sm mb-3 break-all max-w-xs text-center">
                      {filePreview}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilePreview(null);
                        setFormData(p => ({ ...p, file: null }));
                      }}
                      className="text-[10px] bg-red-500 text-white px-3 py-1 border-2 border-black font-black uppercase tracking-widest shadow-[2px_2px_0_0_#000] rounded"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-neub-secondary border-[3px] border-black flex items-center justify-center rounded-2xl mb-4 shadow-[4px_4px_0_0_#000]">
                      <Upload size={30} className="text-black" />
                    </div>
                    <p className="text-black font-black uppercase text-sm mb-1">Click to Upload PDF</p>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Official certificates only</p>
                  </>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full btn-brutal-primary py-5 text-base ${isUploading ? 'opacity-70' : ''}`}
            >
              {isUploading ? (
                <><Loader2 className="animate-spin w-5 h-5" /> Sealing on Chain...</>
              ) : (
                <><Send className="w-5 h-5" /> Finalize Issuance</>
              )}
            </button>
          </form>
        </motion.div>

        {/* ── Sidebar ── */}
        <div className="space-y-8">
          <AnimatePresence>
            {(txStatus.success || txStatus.error) && (
              <motion.div
                initial="hidden" animate="visible" exit="hidden"
                variants={statusVariants}
                className={`brutal-card p-8 border-t-8 ${txStatus.success ? 'bg-neub-primary border-t-black' : 'bg-red-400 text-white border-t-black'}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  {txStatus.success
                    ? <CheckCircle2 className="text-black w-9 h-9" />
                    : <X className="text-white w-9 h-9" />}
                  <h3 className="text-2xl font-black uppercase italic">
                    {txStatus.success ? 'Sealed!' : 'Failed'}
                  </h3>
                </div>
                <p className={`text-sm font-bold mb-7 leading-tight ${txStatus.success ? 'text-black' : 'text-white'}`}>
                  {txStatus.success
                    ? 'Certificate hash is now permanently part of the global ledger.'
                    : txStatus.error}
                </p>
                {txStatus.success && (
                  <div className="space-y-5">
                    <div className="p-4 bg-white border-[3px] border-black rounded-xl shadow-[4px_4px_0_0_#000]">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Tx Hash</p>
                      <p className="text-xs font-mono text-black break-all select-all">{txStatus.hash}</p>
                    </div>
                    <button
                      onClick={() => setTxStatus({ success: false, hash: null, error: null })}
                      className="w-full py-3 text-xs font-black uppercase tracking-widest text-black bg-white border-[3px] border-black shadow-brutal hover:shadow-none transition-all rounded-xl"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rulebook */}
          <div className="brutal-card p-8 bg-white">
            <div className="flex items-center gap-3 mb-7">
              <ShieldCheck className="text-black w-7 h-7" />
              <h3 className="font-black text-lg uppercase tracking-tighter italic">Rulebook</h3>
            </div>
            <ul className="space-y-6">
              {[
                { title: 'Immutable', desc: 'Hashes cannot be reverted. Double-check all data before issuing.' },
                { title: 'Network',   desc: 'Use Sepolia testnet for development, Mainnet for production.' },
                { title: 'Gas Fees',  desc: 'Each transaction requires ETH. Ensure your wallet has funds.' },
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-3.5 h-3.5 bg-neub-primary border-2 border-black rotate-45 mt-1 shrink-0 rounded-sm" />
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight mb-1">{item.title}</h4>
                    <p className="text-[11px] text-gray-500 font-bold leading-snug">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

