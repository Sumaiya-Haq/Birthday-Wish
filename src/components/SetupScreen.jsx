import React, { useRef, useState } from 'react';

export default function SetupScreen({ onCreate }) {
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [date, setDate] = useState('');
  const [gender, setGender] = useState('boy');
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');
  const fileRef = useRef(null);

  const handlePhoto = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // Local-only preview, never uploaded to a server.
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalMessage =
      message.trim() ||
      "Another year of you lighting up every room you walk into.\nHere's to more laughter, more dreams, and more of everything you love.";
    // Each non-empty line becomes its own flip card in the letter deck.
    const cards = finalMessage
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    onCreate({
      name: name.trim() || 'You',
      photoUrl,
      date,
      gender,
      message: finalMessage,
      cards: cards.length ? cards : [finalMessage],
      sender: sender.trim() || 'Me',
    });
  };

  return (
    <form className="setup" onSubmit={handleSubmit}>
      <h1>Make a birthday surprise</h1>
      <p className="sub">Fill this in, then watch it come to life.</p>

      <div className="field">
        <label htmlFor="name">Birthday person&apos;s name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sumaiya"
          maxLength={30}
        />
      </div>

      <div className="field">
        <label>Their photo</label>
        <div className="photo-drop" onClick={() => fileRef.current?.click()}>
          <div className="preview">
            {photoUrl ? <img src={photoUrl || "/placeholder.svg"} alt="Selected preview" /> : <span>📷</span>}
          </div>
          <div className="txt">
            <span>{photoUrl ? 'Change photo' : 'Upload a photo'}</span>
            <small>Stays on your device — nothing is uploaded.</small>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="date">Birthday date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Who is this for?</label>
        <div className="gender-row">
          <button
            type="button"
            className={`gender-opt${gender === 'boy' ? ' active' : ''}`}
            onClick={() => setGender('boy')}
          >
            🎩 Boy
          </button>
          <button
            type="button"
            className={`gender-opt${gender === 'girl' ? ' active' : ''}`}
            onClick={() => setGender('girl')}
          >
            🎀 Girl
          </button>
        </div>
      </div>

      <div className="field">
        <label htmlFor="message">Birthday message</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write something from the heart... (each new line becomes its own card)"
          maxLength={500}
        />
        <small className="hint">Tip: press Enter between lines to create multiple flip cards.</small>
      </div>

      <div className="field">
        <label htmlFor="sender">Your name (sender)</label>
        <input
          id="sender"
          type="text"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder="e.g. Your secret developer"
          maxLength={30}
        />
      </div>

      <button type="submit" className="create-btn">Create Surprise ❤️</button>
    </form>
  );
}
