import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EnvelopeLetter({ data, onFinish }) {
  // stages: 'closed' -> 'open' (flap up + letter rises) -> 'letter'
  const [stage, setStage] = useState('closed');
  const [typed, setTyped] = useState('');

  // Auto-open sequence.
  useEffect(() => {
    const t1 = setTimeout(() => setStage('open'), 700);
    const t2 = setTimeout(() => setStage('letter'), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Typewriter for the custom message once the letter is visible.
  useEffect(() => {
    if (stage !== 'letter') return;
    setTyped('');
    let i = 0;
    const msg = data.message;
    const id = setInterval(() => {
      i += 1;
      setTyped(msg.slice(0, i));
      if (i >= msg.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [stage, data.message]);

  return (
    <div className="envelope-scene">
      <AnimatePresence mode="wait">
        {stage !== 'letter' ? (
          <motion.div
            key="envelope"
            className="envelope"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
          >
            <div className="env-base" />
            <div className="env-pocket" />
            <motion.div
              className="env-flap"
              initial={{ rotateX: 0 }}
              animate={{ rotateX: stage === 'open' ? -170 : 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
            />
            <motion.div
              className="env-heart"
              animate={{ scale: stage === 'open' ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.6 }}
            >
              💌
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            className="letter"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h3>Dear {data.name},</h3>
            <p>{typed}</p>
            <div className="sign">
              With love,
              <br />
              {data.sender} ❤️
            </div>
            <button className="close-hint" onClick={onFinish}>
              Close 🤍
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
