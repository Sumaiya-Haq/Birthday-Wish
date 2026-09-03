import React, { useState, useEffect, useRef } from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import EnvelopeModal from './components/EnvelopeModal';
import HeroHeader from './components/HeroHeader';
import InteractiveCake from './components/InteractiveCake';
import PhotoGallery from './components/PhotoGallery';
import PictureNotesDeck from './components/PictureNotesDeck';
import WishLetter from './components/WishLetter';
import CustomizerModal from './components/CustomizerModal';
import { DEFAULT_BIRTHDAY_DATA } from './utils/defaultData';
import { Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Load state from LocalStorage or fall back to DEFAULT_BIRTHDAY_DATA
  const [birthdayData, setBirthdayData] = useState(() => {
    try {
      const saved = localStorage.getItem('birthday_wish_data');
      return saved ? JSON.parse(saved) : DEFAULT_BIRTHDAY_DATA;
    } catch (e) {
      return DEFAULT_BIRTHDAY_DATA;
    }
  });

  const audioRef = useRef(null);

  useEffect(() => {
    // Create audio instance
    const audio = new Audio(birthdayData.audioTrackUrl || DEFAULT_BIRTHDAY_DATA.audioTrackUrl);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [birthdayData.audioTrackUrl]);

  const handleToggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => console.log('Audio autoplay error:', err));
    }
  };

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpen(true);
    // Start background music automatically on unseal if browser permits
    if (audioRef.current && !isPlayingAudio) {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((e) => console.log('Autoplay prevented:', e));
    }
  };

  const handleSaveCustomData = (newData) => {
    setBirthdayData(newData);
    try {
      localStorage.setItem('birthday_wish_data', JSON.stringify(newData));
    } catch (e) {
      console.log('Error saving to localStorage:', e);
    }
  };

  const handleResetDefaults = () => {
    setBirthdayData(DEFAULT_BIRTHDAY_DATA);
    try {
      localStorage.removeItem('birthday_wish_data');
    } catch (e) {
      console.log('Error clearing localStorage:', e);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative text-white selection:bg-rose-500 selection:text-white">
      {/* Floating Canvas Particles */}
      <ParticleCanvas />

      {/* Opening Envelope Experience */}
      {!isEnvelopeOpen && (
        <EnvelopeModal
          recipientName={birthdayData.recipientName}
          onOpen={handleOpenEnvelope}
        />
      )}

      {/* Main Experience Content */}
      <main className={`transition-opacity duration-1000 ${isEnvelopeOpen ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
        <HeroHeader
          recipientName={birthdayData.recipientName}
          subtitle={birthdayData.subtitle}
          isPlayingAudio={isPlayingAudio}
          onToggleAudio={handleToggleAudio}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onScrollToCake={() => scrollToSection('cake-section')}
          onScrollToLetter={() => scrollToSection('letter-section')}
        />

        <InteractiveCake recipientName={birthdayData.recipientName} />

        <PhotoGallery
          photos={birthdayData.photos}
          recipientName={birthdayData.recipientName}
        />

        <PictureNotesDeck pictureNotes={birthdayData.pictureNotes} />

        <WishLetter
          title={birthdayData.letterTitle}
          body={birthdayData.letterBody}
          recipientName={birthdayData.recipientName}
          senderName={birthdayData.senderName}
        />
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-rose-200/60 text-xs relative z-10 border-t border-white/5 mt-16">
        <div className="flex items-center justify-center gap-1.5 font-medium mb-1">
          <span>Created with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          <span>for {birthdayData.recipientName}</span>
        </div>
        <p className="text-white/40">Code carrying love & unforgettable memories • Happy Birthday ✨</p>
      </footer>

      {/* Customizer Drawer */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentData={birthdayData}
        onSave={handleSaveCustomData}
        onReset={handleResetDefaults}
      />
    </div>
  );
}
