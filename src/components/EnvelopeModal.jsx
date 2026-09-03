import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EnvelopeModal({ recipientName, onOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Fire celebratory confetti burst
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 300);
    } catch (e) {
      console.log('Confetti error:', e);
    }

    setTimeout(() => {
      onOpen();
    }, 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
    >
      <div className="text-center max-w-md w-full relative">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-rose-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>A Special Birthday Surprise</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            For <span className="text-gradient-rose glow-text">{recipientName}</span>
          </h1>
          <p className="text-rose-200/80 text-sm">
            Someone spent time building something special just for you.
          </p>
        </motion.div>

        {/* 3D Envelope Container */}
        <motion.div
          whileHover={{ scale: isOpen ? 1 : 1.02 }}
          whileTap={{ scale: isOpen ? 1 : 0.98 }}
          onClick={handleOpenEnvelope}
          className={`cursor-pointer relative mx-auto w-72 sm:w-80 h-52 sm:h-56 glass-panel-glow flex flex-col items-center justify-center p-6 border border-rose-400/40 rounded-3xl shadow-2xl transition-all duration-500 ${
            isOpen ? 'scale-105 opacity-90' : ''
          }`}
        >
          {/* Animated Wax Seal */}
          <motion.div
            animate={isOpen ? { scale: [1, 1.4, 0], opacity: [1, 1, 0] } : { scale: [1, 1.06, 1] }}
            transition={{ duration: isOpen ? 0.6 : 2, repeat: isOpen ? 0 : Infinity }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-600/50 border-2 border-amber-200/60 mb-3 z-10"
          >
            <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
          </motion.div>

          <p className="text-white font-semibold text-lg flex items-center gap-2">
            <Gift className="w-5 h-5 text-rose-400" />
            <span>{isOpen ? 'Unsealing Surprise...' : 'Click to Open Envelope'}</span>
          </p>
          
          <p className="text-xs text-rose-200/60 mt-1">
            {isOpen ? 'Preparing your magical experience ✨' : 'Tap to reveal music, memories & birthday wishes'}
          </p>

          {/* Glowing sparkle dots */}
          <div className="absolute top-3 left-4 w-2 h-2 rounded-full bg-amber-300 animate-ping opacity-75" />
          <div className="absolute bottom-4 right-4 w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
        </motion.div>
      </div>
    </motion.div>
  );
}
