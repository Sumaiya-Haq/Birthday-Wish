import React from 'react';
import { motion } from 'framer-motion';

export default function IntroScene({ onReveal, data }) {
  const pronoun = data?.gender === 'girl' ? 'her' : 'him';
  const LINES = [
    'No cake. 🎂',
    'No flowers. 🌹',
    'Just a developer who',
    'stayed up all night...',
    `for ${pronoun}. 🤍`,
  ];

  return (
    <div className="intro">
      <div className="intro-lines">
        {LINES.map((line, i) => (
          <motion.span
            key={line}
            className={`intro-line${i === LINES.length - 1 ? ' strong' : ''}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.9, duration: 0.7, ease: 'easeOut' }}
          >
            {line}
          </motion.span>
        ))}
      </div>

      <motion.button
        className="reveal-btn"
        onClick={onReveal}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 + LINES.length * 0.9 + 0.3, duration: 0.6 }}
      >
        Reveal Birthday Surprise
      </motion.button>
    </div>
  );
}
