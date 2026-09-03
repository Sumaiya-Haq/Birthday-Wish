import React from 'react';
import { motion } from 'framer-motion';

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

export default function BirthdayCard({ data, onClickHere, onFromLove }) {
  const prettyDate = formatDate(data.date);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="card-hearts">
        <span>♥</span><span>✦</span><span>♥</span><span>✦</span><span>♥</span>
      </div>

      <h1 className="bday-heading">
        <span className="happy">Happy</span>
        <span className="birthday">Birthday</span>
      </h1>

      {prettyDate && <div className="date-pill">{prettyDate}</div>}

      <div className="photo-wrap">
        <div className="party-hat" aria-hidden="true">
          <span className="hat-pom" />
        </div>
        <div className="photo-frame">
          <span className="frame-deco tl">🎈</span>
          <span className="frame-deco tr">✨</span>
          <span className="frame-deco bl">🎀</span>
          <span className="frame-deco br">🎉</span>
          {data.photoUrl ? (
            <img src={data.photoUrl || "/placeholder.svg"} alt={`${data.name}`} />
          ) : (
            <div className="no-photo">🎂</div>
          )}
        </div>
      </div>

      <div className="name-pill">Dear {data.name}</div>

      <div className="card-buttons">
        <button className="click-here" onClick={onClickHere}>
          Click Here {data.name}
        </button>
        <button className="from-love" onClick={onFromLove}>
          ✉ From Love
        </button>
      </div>
    </motion.div>
  );
}
