import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, RefreshCw, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InteractiveCake({ recipientName }) {
  const [candlesLit, setCandlesLit] = useState(true);
  const [wishMade, setWishMade] = useState(false);

  const handleBlowCandles = () => {
    if (!candlesLit) return;
    setCandlesLit(false);
    setWishMade(true);

    // Fire fireworks celebration confetti
    try {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } catch (e) {
      console.log('Confetti error:', e);
    }
  };

  const handleRelight = () => {
    setCandlesLit(true);
    setWishMade(false);
  };

  return (
    <div id="cake-section" className="py-12 px-4 max-w-3xl mx-auto text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-panel-glow p-8 sm:p-12 relative overflow-hidden"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Interactive Birthday Cake</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Make a Wish & Blow out the Candles! 🎂
        </h2>
        <p className="text-rose-200/80 text-sm sm:text-base max-w-md mx-auto mb-10">
          {candlesLit
            ? 'Close your eyes, make a secret wish, then tap the candles or click blow below!'
            : '✨ Your wish has been sent to the universe! ✨'}
        </p>

        {/* CSS Rendered Birthday Cake Container */}
        <div className="relative my-8 flex flex-col items-center justify-center min-h-[220px]">
          {/* Candles */}
          <div className="flex gap-4 sm:gap-6 mb-1 z-20">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                onClick={handleBlowCandles}
                className="relative cursor-pointer group"
                title={candlesLit ? 'Click to blow out candle!' : 'Candle blown out'}
              >
                {/* Flame or Smoke */}
                {candlesLit ? (
                  <div className="flame group-hover:scale-125 transition-transform" />
                ) : (
                  <div className="smoke" />
                )}
                {/* Candle Stick */}
                <div className="w-3.5 h-14 bg-gradient-to-b from-rose-200 via-pink-400 to-rose-500 rounded-t-sm shadow-md border-t border-white/40" />
              </div>
            ))}
          </div>

          {/* Top Layer */}
          <div className="w-48 sm:w-56 h-14 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 rounded-t-2xl shadow-lg relative border-b border-pink-500/30 flex items-center justify-center">
            {/* Frosting drips */}
            <div className="absolute top-full left-0 right-0 h-4 bg-rose-200/90 rounded-b-xl flex justify-around">
              <div className="w-6 h-4 bg-rose-200 rounded-b-full" />
              <div className="w-8 h-5 bg-rose-200 rounded-b-full" />
              <div className="w-6 h-4 bg-rose-200 rounded-b-full" />
              <div className="w-7 h-5 bg-rose-200 rounded-b-full" />
            </div>
            <span className="text-rose-900 font-bold text-xs tracking-wider uppercase z-10">
              Happy Birthday
            </span>
          </div>

          {/* Middle Layer */}
          <div className="w-60 sm:w-72 h-16 bg-gradient-to-r from-purple-800 via-rose-900 to-purple-800 shadow-xl relative border-b border-purple-950 flex items-center justify-center">
            <span className="text-amber-200 font-cursive text-2xl font-bold glow-text-gold">
              {recipientName}
            </span>
          </div>

          {/* Bottom Layer */}
          <div className="w-72 sm:w-88 h-20 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 rounded-b-3xl shadow-2xl relative border-t-2 border-white/20 flex items-center justify-around px-6">
            <Heart className="w-5 h-5 text-white/70 fill-white/50" />
            <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
            <Heart className="w-5 h-5 text-white/70 fill-white/50" />
          </div>

          {/* Cake Stand Base */}
          <div className="w-80 sm:w-96 h-4 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 rounded-full shadow-2xl mt-1 border-t border-white" />
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-center gap-4">
          {candlesLit ? (
            <button onClick={handleBlowCandles} className="btn-primary">
              <Flame className="w-5 h-5 text-amber-300" />
              <span>Blow out Candles 💨</span>
            </button>
          ) : (
            <button onClick={handleRelight} className="btn-secondary">
              <RefreshCw className="w-4 h-4 text-amber-300" />
              <span>Relight Candles 🕯️</span>
            </button>
          )}
        </div>

        {/* Wish Popup Message */}
        <AnimatePresence>
          {wishMade && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="mt-6 p-4 rounded-2xl bg-amber-400/10 border border-amber-400/40 text-amber-200 max-w-md mx-auto"
            >
              <p className="font-semibold text-base flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Wish Granted! 💫</span>
              </p>
              <p className="text-xs text-amber-100/80 mt-1">
                May your year be as sweet, bright, and magical as this cake!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
