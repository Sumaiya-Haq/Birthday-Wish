import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Music, VolumeX, Sparkles, Settings, Cake, ScrollText } from 'lucide-react';

export default function HeroHeader({
  recipientName,
  subtitle,
  isPlayingAudio,
  onToggleAudio,
  onOpenCustomizer,
  onScrollToCake,
  onScrollToLetter
}) {
  return (
    <div className="relative pt-12 pb-16 px-4 text-center max-w-4xl mx-auto z-10">
      {/* Top Bar with Audio Control & Customizer Button */}
      <div className="flex items-center justify-between gap-3 mb-8 max-w-2xl mx-auto">
        <button
          onClick={onToggleAudio}
          className="btn-secondary text-xs sm:text-sm shadow-lg border-rose-500/30 hover:border-rose-400"
          title={isPlayingAudio ? 'Mute Background Music' : 'Play Background Music'}
        >
          {isPlayingAudio ? (
            <>
              <Music className="w-4 h-4 text-rose-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Playing Music</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-gray-400" />
              <span>Play Music</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenCustomizer}
          className="btn-secondary text-xs sm:text-sm border-amber-400/30 hover:border-amber-300 text-amber-200"
          title="Customize Name, Photos & Wishes"
        >
          <Settings className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '10s' }} />
          <span>Edit & Customize</span>
        </button>
      </div>

      {/* Hero Badge */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-300 text-sm font-semibold mb-6 shadow-inner"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-bounce" />
        <span>HAPPY BIRTHDAY SURPRISE</span>
        <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
      </motion.div>

      {/* Recipient Name Heading */}
      <motion.h1
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight mb-4 leading-tight"
      >
        Happy Birthday, <br />
        <span className="text-gradient-rose glow-text font-cursive font-bold text-5xl sm:text-7xl md:text-8xl">
          {recipientName}!
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-lg sm:text-2xl text-rose-100/90 font-light max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        {subtitle}
      </motion.p>

      {/* Quick Action Navigation Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <button onClick={onScrollToCake} className="btn-primary">
          <Cake className="w-5 h-5 text-white" />
          <span>Blow Birthday Candles</span>
        </button>

        <button onClick={onScrollToLetter} className="btn-secondary">
          <ScrollText className="w-5 h-5 text-rose-300" />
          <span>Read Special Letter</span>
        </button>
      </motion.div>

      {/* Floating Animated Balloons Visuals */}
      <div className="absolute top-10 left-4 hidden md:block pointer-events-none floating-balloon" style={{ animationDelay: '0s' }}>
        <div className="w-10 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 opacity-70 shadow-lg relative">
          <div className="w-0.5 h-16 bg-rose-200/40 absolute top-full left-1/2 -translate-x-1/2" />
        </div>
      </div>
      <div className="absolute top-16 right-6 hidden md:block pointer-events-none floating-balloon" style={{ animationDelay: '2s' }}>
        <div className="w-12 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 opacity-70 shadow-lg relative">
          <div className="w-0.5 h-20 bg-amber-200/40 absolute top-full left-1/2 -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}
