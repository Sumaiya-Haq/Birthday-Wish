import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Confetti from './components/Confetti';
import SetupScreen from './components/SetupScreen';
import IntroScene from './components/IntroScene';
import BirthdayCard from './components/BirthdayCard';
import EnvelopeLetter from './components/EnvelopeLetter';
import FinalScene from './components/FinalScene';

// phases: setup -> intro -> card -> letter -> final
export default function App() {
  const [phase, setPhase] = useState('setup');
  const [data, setData] = useState(null);

  const handleCreate = (formData) => {
    setData(formData);
    setPhase('intro');
  };

  const handleRestart = () => {
    setPhase('setup');
    setData(null);
  };

  // Confetti only appears once we're past the intro (around the card onward).
  const showConfetti = phase === 'card' || phase === 'letter';

  return (
    <div className="stage">
      {showConfetti && <Confetti />}

      <div className="portrait">
        <AnimatePresence mode="wait">
          {phase === 'setup' && (
            <motion.div
              key="setup"
              style={{ width: '100%', height: '100%' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <SetupScreen onCreate={handleCreate} />
            </motion.div>
          )}

          {phase === 'intro' && (
            <motion.div
              key="intro"
              style={{ width: '100%', height: '100%' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <IntroScene onReveal={() => setPhase('card')} />
            </motion.div>
          )}

          {phase === 'card' && (
            <motion.div
              key="card"
              style={{ width: '100%', height: '100%' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BirthdayCard
                data={data}
                onClickHere={() => setPhase('letter')}
                onFromLove={() => setPhase('letter')}
              />
            </motion.div>
          )}

          {phase === 'letter' && (
            <motion.div
              key="letter"
              style={{ width: '100%', height: '100%' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <EnvelopeLetter data={data} onFinish={() => setPhase('final')} />
            </motion.div>
          )}

          {phase === 'final' && (
            <motion.div
              key="final"
              style={{ width: '100%', height: '100%' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <FinalScene onRestart={handleRestart} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
