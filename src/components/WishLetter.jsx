import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollText, Heart, Sparkles, Copy, Check } from 'lucide-react';

export default function WishLetter({ title, body, recipientName, senderName }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${title}\n\n${body}\n\n${senderName}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="letter-section" className="py-16 px-4 max-w-3xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-panel-glow p-8 sm:p-14 relative rounded-3xl border border-rose-400/40 shadow-2xl overflow-hidden"
      >
        {/* Subtle Background Glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Top Header Badge */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-rose-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
              <ScrollText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-rose-300 font-semibold">
                Personal Birthday Note
              </span>
              <h3 className="text-lg font-bold text-white">For {recipientName}</h3>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="btn-secondary text-xs py-1.5 px-3 border-rose-400/30 text-rose-200"
            title="Copy Wish Letter"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Letter</span>
              </>
            )}
          </button>
        </div>

        {/* Letter Title */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-6 text-gradient-rose glow-text">
          {title}
        </h2>

        {/* Letter Body - Handwritten Cursive Style */}
        <div className="text-rose-100/90 text-lg sm:text-2xl font-cursive leading-relaxed whitespace-pre-line mb-8 p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10">
          {body}
        </div>

        {/* Letter Footer / Signature */}
        <div className="flex items-center justify-between pt-6 border-t border-rose-500/20">
          <div className="flex items-center gap-2 text-rose-300 text-sm font-medium">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
            <span>Always & Forever</span>
          </div>

          <div className="text-right">
            <p className="text-xs text-rose-300/70">With Endless Love,</p>
            <p className="text-xl font-bold font-cursive text-gradient-gold">
              {senderName || 'Your Favorite Developer'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
