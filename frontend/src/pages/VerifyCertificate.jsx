import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Upload, FileCheck, ShieldAlert, CheckCircle2, XCircle, Loader2, Info, ArrowUpRight } from 'lucide-react';
import { generateHash, verifyOnBlockchain } from '../utils/blockchain';

export default function VerifyCertificate() {
  const [verificationId, setVerificationId] = useState('');
  const [file, setFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFilePreview(uploadedFile.name);
      setVerificationId('');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!file && !verificationId) {
      alert("Please upload a file or enter a Certificate ID.");
      return;
    }

    setIsVerifying(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('certificate', file);
      } else {
        formData.append('hash', verificationId);
      }

      const response = await fetch('http://localhost:5050/api/certificates/verify', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult({ isValid: data.data.isValid, error: null });
      } else {
        setResult({ isValid: false, error: data.message });
      }
    } catch (err) {
      console.error(err);
      setResult({
        isValid: false,
        error: "Could not connect to verification server. Ensure backend is running."
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center mb-16"
      >
        <span className="brutal-tag">Global Authenticator</span>
        <h1 className="text-4xl md:text-6xl font-black mt-4 mb-4 uppercase tracking-tighter italic">Proof of Legitimacy</h1>
        <p className="font-bold text-gray-700 max-w-xl mx-auto">
          Scan the ledger for cryptographic proof. No middleman. No lies. Just the truth.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="brutal-card p-10 bg-white shadow-brutal-lg"
        >
          <form onSubmit={handleVerify} className="space-y-10">
            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-gray-400 ml-1">Drop Certificate (PDF)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-[3px] border-black border-dashed rounded-xl p-10 transition-all cursor-pointer flex flex-col items-center justify-center text-center shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 ${filePreview ? 'bg-neub-primary/20' : 'bg-white hover:bg-neub-secondary/10'
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
                    <div className="w-14 h-14 bg-neub-secondary border-[3px] border-black flex items-center justify-center rounded-2xl mb-4 text-black shadow-[4px_4px_0_0_#000]">
                      <FileCheck size={28} />
                    </div>
                    <span className="text-black font-black uppercase tracking-tight text-xs underline decoration-2">{filePreview}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilePreview(null);
                        setFile(null);
                      }}
                      className="text-[10px] bg-black text-white px-2 py-0.5 mt-4 font-black uppercase"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 bg-neub-primary border-[3px] border-black flex items-center justify-center rounded-2xl mb-4 text-black shadow-[4px_4px_0_0_#000]">
                      <Upload size={28} />
                    </div>
                    <p className="text-black font-black uppercase text-xs">Verify DOC</p>
                  </>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t-[3px] border-black"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white border-[3px] border-black text-[10px] font-black uppercase tracking-widest -rotate-2">Or Hash</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-gray-400 ml-1">Manual ID Entry</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="text-black w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={verificationId}
                  onChange={(e) => {
                    setVerificationId(e.target.value);
                    setFile(null);
                    setFilePreview(null);
                  }}
                  className="brutal-input pl-12"
                  placeholder="SHA-256 HASH"
                  disabled={!!file}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying || (!file && !verificationId)}
              className="w-full btn-brutal-secondary py-5 text-xl"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="animate-spin w-6 h-6 mr-2" />
                  Analyzing Ledger...
                </>
              ) : (
                <>
                  <FileCheck className="w-6 h-6 mr-2" />
                  AUTHENTICATE
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Results / Help Sidebar */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="brutal-card p-12 bg-white flex flex-col items-center justify-center text-center min-h-[400px]"
              >
                <div className="w-20 h-20 bg-gray-100 border-[3px] border-black flex items-center justify-center mb-8 rotate-3 shadow-[6px_6px_0_0_#000]">
                  <Info className="text-black w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">Awaiting Proof</h3>
                <p className="font-bold text-gray-500 text-sm leading-tight max-w-xs">
                  Upload a certificate or its unique hash to verify against the global immutable ledger.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`brutal-card p-12 border-t-8 flex flex-col items-center text-center min-h-[400px] shadow-brutal-lg ${result.isValid
                  ? '!bg-neub-primary border-t-black'
                  : '!bg-red-50 border-t-red-600'
                  }`}
              >
                <div className={`w-24 h-24 rounded-2xl border-4 border-black flex items-center justify-center mb-10 shadow-[8px_8px_0_0_#000] bg-white ${result.isValid ? 'text-black' : 'text-red-600'
                  }`}>
                  {result.isValid ? <CheckCircle2 size={56} /> : <ShieldAlert size={56} />}
                </div>

                <h3 className={`text-3xl font-black mb-6 uppercase tracking-tight italic leading-none ${result.isValid ? 'text-black' : 'text-red-700'}`}>
                  {result.isValid ? 'VALID ✅' : 'FORGERY ❌'}
                </h3>

                <p className={`text-lg font-bold mb-12 leading-tight ${result.isValid ? 'text-black' : 'text-red-900'}`}>
                  {result.isValid
                    ? "Cryptographic proof confirmed. This document is part of the chain."
                    : result.error || "No record found on blockchain. This document appears to be fake or modified."}
                </p>

                {result.isValid && (
                  <a
                    href="#"
                    className="flex items-center gap-2 bg-white px-5 py-2 border-[3px] border-black text-xs font-black uppercase tracking-widest shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    View Ledger
                    <ArrowUpRight size={16} />
                  </a>
                )}

                <button
                  onClick={() => setResult(null)}
                  className={`mt-10 text-[10px] font-black uppercase tracking-widest underline decoration-2 ${result.isValid ? 'text-black' : 'text-black opacity-60'}`}
                >
                  Restart Validation
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
