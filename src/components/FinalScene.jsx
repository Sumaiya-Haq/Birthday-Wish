import React from 'react';
import { motion } from 'framer-motion';

export default function FinalScene({ onRestart }) {
  return (
    <div className="final">
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        The reveal hit different
        <br />
        at 3AM. 🌙
      </motion.p>

      <motion.button
        className="again"
        onClick={onRestart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        Make another
      </motion.button>
    </div>
  );
}
