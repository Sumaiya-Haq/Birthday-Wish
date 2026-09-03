import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star, Gift, Smile } from 'lucide-react';

export default function PictureNotesDeck({ pictureNotes }) {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const icons = [Star, Heart, Gift, Smile];

  return (
    <div id="notes-section" className="py-16 px-4 max-w-5xl mx-auto relative z-10">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-sm font-medium mb-3">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Secret Wish Notes</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
          Good Wishes & <span className="text-gradient-gold glow-text-gold">Little Notes</span>
        </h2>
        <p className="text-rose-200/80 text-sm sm:text-base mt-2">
          Tap each note to flip & reveal the hidden birthday message!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pictureNotes.map((note, index) => {
          const isFlipped = flippedCards[note.id || index];
          const IconComponent = icons[index % icons.length];

          return (
            <motion.div
              key={note.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => toggleFlip(note.id || index)}
              className="cursor-pointer perspective-1000 min-h-[220px]"
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, cubicBezier: [0.4, 0, 0.2, 1] }}
                className="w-full h-full relative preserve-3d"
              >
                {/* Front Side */}
                <div className="glass-panel p-6 h-full flex flex-col items-center justify-center text-center border-amber-400/30 hover:border-amber-400/60 transition-colors rounded-2xl backface-hidden shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-4 shadow-inner">
                    <IconComponent className="w-6 h-6 animate-pulse" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-1">
                    {note.tag || `Note #${index + 1}`}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">{note.title}</h3>
                  <span className="text-xs text-rose-300 flex items-center gap-1 mt-2">
                    Tap to Flip <Sparkles className="w-3 h-3 text-amber-300" />
                  </span>
                </div>

                {/* Back Side (Message) */}
                <div
                  className="glass-panel-glow p-6 h-full flex flex-col items-center justify-center text-center border-rose-400/50 rounded-2xl backface-hidden absolute inset-0 rotate-y-180 shadow-2xl bg-gradient-to-br from-rose-950/80 to-purple-950/80"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <p className="text-rose-100 font-serif italic text-sm sm:text-base leading-relaxed mb-3">
                    "{note.text}"
                  </p>
                  <span className="text-[11px] px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30">
                    {note.tag || 'Forever Wish'}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
