import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RotateCcw, User, Image, Sparkles, ScrollText, Plus, Trash2 } from 'lucide-react';

export default function CustomizerModal({
  isOpen,
  onClose,
  currentData,
  onSave,
  onReset
}) {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(currentData)));

  if (!isOpen) return null;

  const handleChangeGeneral = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (index, field, value) => {
    setFormData((prev) => {
      const newPhotos = [...prev.photos];
      newPhotos[index] = { ...newPhotos[index], [field]: value };
      return { ...prev, photos: newPhotos };
    });
  };

  const handleAddPhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photos: [
        ...prev.photos,
        {
          id: `photo-${Date.now()}`,
          title: 'New Memory ✨',
          caption: 'Add your custom story caption here!',
          date: 'Special Day',
          url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
          rotation: '2deg'
        }
      ]
    }));
  };

  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleNoteChange = (index, field, value) => {
    setFormData((prev) => {
      const newNotes = [...prev.pictureNotes];
      newNotes[index] = { ...newNotes[index], [field]: value };
      return { ...prev, pictureNotes: newNotes };
    });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 border border-rose-500/30 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-white"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-rose-500/20 flex items-center justify-between bg-rose-950/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Customize Birthday App</h3>
                <p className="text-xs text-rose-200/70">Personalize names, wishes, photos & notes</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-white/10 bg-gray-900/60 px-6 gap-4 text-sm font-medium">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'general'
                  ? 'border-rose-400 text-rose-300'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Details & Letter</span>
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'photos'
                  ? 'border-rose-400 text-rose-300'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>Photos ({formData.photos.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-rose-400 text-rose-300'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <ScrollText className="w-4 h-4" />
              <span>Wish Notes</span>
            </button>
          </div>

          {/* Form Content Area */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2">
                    Birthday Person's Name
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => handleChangeGeneral('recipientName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400"
                    placeholder="e.g. Sumaiya"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2">
                    Subtitle Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleChangeGeneral('subtitle', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2">
                    Letter Title
                  </label>
                  <input
                    type="text"
                    value={formData.letterTitle}
                    onChange={(e) => handleChangeGeneral('letterTitle', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2">
                    Birthday Wish Letter Body
                  </label>
                  <textarea
                    rows={6}
                    value={formData.letterBody}
                    onChange={(e) => handleChangeGeneral('letterBody', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400 font-serif leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2">
                    Sender Signature Name
                  </label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => handleChangeGeneral('senderName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-rose-200/70">
                    Add or modify memory polaroid cards. You can paste image URLs or use preset links!
                  </p>
                  <button
                    onClick={handleAddPhoto}
                    className="btn-secondary text-xs py-1.5 px-3 border-rose-400/40 text-rose-300"
                  >
                    <Plus className="w-4 h-4" /> Add Photo
                  </button>
                </div>

                {formData.photos.map((photo, index) => (
                  <div
                    key={photo.id || index}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative"
                  >
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-gray-400">Photo Title</label>
                        <input
                          type="text"
                          value={photo.title}
                          onChange={(e) => handlePhotoChange(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-400">Date / Tag</label>
                        <input
                          type="text"
                          value={photo.date}
                          onChange={(e) => handlePhotoChange(index, 'date', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-400">Image URL</label>
                      <input
                        type="text"
                        value={photo.url}
                        onChange={(e) => handlePhotoChange(index, 'url', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-400">Caption Story</label>
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => handlePhotoChange(index, 'caption', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                {formData.pictureNotes.map((note, index) => (
                  <div
                    key={note.id || index}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-gray-400">Note Title</label>
                        <input
                          type="text"
                          value={note.title}
                          onChange={(e) => handleNoteChange(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-400">Badge Tag</label>
                        <input
                          type="text"
                          value={note.tag || ''}
                          onChange={(e) => handleNoteChange(index, 'tag', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-400">Secret Message</label>
                      <textarea
                        rows={2}
                        value={note.text}
                        onChange={(e) => handleNoteChange(index, 'text', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer Buttons */}
          <div className="p-6 border-t border-rose-500/20 bg-gray-950 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                onReset();
                onClose();
              }}
              className="btn-secondary text-xs text-rose-300 border-rose-500/30"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>

            <div className="flex gap-3">
              <button onClick={onClose} className="btn-secondary text-xs">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary text-xs py-2 px-5">
                <Save className="w-4 h-4" /> Save & Update App
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
