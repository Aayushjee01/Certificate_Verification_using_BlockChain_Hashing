import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Upload, Search, CheckCircle, Lock, FastForward, Globe, ChevronRight } from 'lucide-react';

export default function Home({ connectWallet }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Hero Section */}
      <section className="py-20 flex flex-col items-center text-center relative">
        <motion.div 
          variants={itemVariants} 
          className="brutal-tag mb-8"
        >
          #Immutability_Check
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter italic"
        >
          Verify <span className="bg-neub-primary px-4 border-2 border-black shadow-[4px_4px_0_0_#000]">Trust</span> <br />
          <span className="text-gray-400">On The Ledger.</span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="max-w-2xl text-xl font-bold mb-12 text-gray-700"
        >
          No more fake credentials. BloCert uses cryptographic hashing to secure your legacy. 
          Unstoppable, decentralized, and brutally honest.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-8 mb-24"
        >
          <Link to="/upload" className="btn-brutal-primary h-16 text-xl">
            <Upload size={24} />
            Issue Certificate
          </Link>
          <Link to="/verify" className="btn-brutal-outline h-16 text-xl">
            <Search size={24} />
            Search Records
          </Link>
        </motion.div>

        {/* Hero Features Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          {[
            { icon: Lock, title: "Zero Fraud", desc: "Hash-based storage makes forgery impossible. What's on-chain stays on-chain.", color: 'bg-neub-primary' },
            { icon: FastForward, title: "Fast-Track", desc: "Skip the bureaucracy. Verify credentials in milliseconds, not months.", color: 'bg-neub-secondary' },
            { icon: Globe, title: "Universal", desc: "Built on Ethereum. Your certificates are recognized globally without borders.", color: 'bg-neub-accent' }
          ].map((feature, i) => (
            <div key={i} className="brutal-card p-10 text-left group">
              <div className={`w-14 h-14 ${feature.color} border-[3px] border-black flex items-center justify-center rounded-xl mb-8 -rotate-3 group-hover:rotate-0 transition-transform shadow-[4px_4px_0_0_#000]`}>
                <feature.icon className="text-black w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase">{feature.title}</h3>
              <p className="font-bold text-gray-600 text-sm leading-tight">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-16 border-y-4 border-black my-20 bg-white rotate-1 md:-rotate-1 shadow-[8px_8px_0_0_#000]">
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4">
          {[
            { label: "Secured", value: "1.2M+" },
            { label: "Universities", value: "450+" },
            { label: "Latency", value: "0.2s" },
            { label: "Rating", value: "99.9%" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-5xl font-black mb-1 uppercase tracking-tighter">
                {stat.value}
              </div>
              <div className="text-[10px] uppercase font-black tracking-widest text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <motion.div 
          variants={itemVariants}
          className="bg-black p-12 md:p-20 rounded-3xl relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-none text-white italic underline decoration-neub-primary decoration-8">
                Ready to secure your achievements?
              </h2>
              <p className="text-gray-300 mb-10 text-xl font-bold">
                Don't let your hard work be questioned. Register your credentials today on the world's most secure public ledger.
              </p>
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                <button 
                  onClick={connectWallet}
                  className="px-10 py-5 bg-neub-primary text-black font-black text-xl uppercase rounded-xl border-[3px] border-white shadow-[6px_6px_0_0_#fff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-3"
                >
                  Join the Future
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
            
            <div className="hidden lg:block shrink-0">
              <div className="p-12 bg-white border-4 border-black shadow-[12px_12px_0_0_rgba(217,255,0,1)] rounded-3xl rotate-6">
                <ShieldCheck size={160} className="text-black" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
