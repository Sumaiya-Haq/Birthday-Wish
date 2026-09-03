import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ChevronLeft, ChevronRight, Heart, Calendar } from 'lucide-react';

export default function PhotoGallery({ photos, recipientName }) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  const activePhoto = activePhotoIndex !== null ? photos[activePhotoIndex] : null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div id="gallery-section" className="py-16 px-4 max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-medium mb-3">
          <Camera className="w-4 h-4 text-rose-400" />
          <span>Memory Lane & Photo Gallery</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
          Moments That Carry <span className="text-gradient-rose glow-text">Love</span>
        </h2>
        <p className="text-rose-200/80 text-sm sm:text-base mt-2">
          Click any polaroid to view photo details & full memories!
        </p>
      </div>

      {/* Polaroid Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id || index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            onClick={() => setActivePhotoIndex(index)}
            className="polaroid-card cursor-pointer group"
            style={{ transform: `rotate(${photo.rotation || '0deg'})` }}
          >
            {/* Polaroid Tape */}
            <div className="polaroid-tape" />

            {/* Photo Container */}
            <div className="overflow-hidden rounded-sm bg-gray-100 aspect-square mb-4 relative">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-white text-xs font-medium flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" /> Tap to expand
                </span>
              </div>
            </div>

            {/* Caption & Info */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-bold text-gray-800 text-base sm:text-lg group-hover:text-rose-600 transition-colors">
                  {photo.title}
                </h3>
                {photo.date && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {photo.date}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 font-serif italic line-clamp-2 leading-relaxed">
                "{photo.caption}"
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhotoIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full text-gray-900 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePhotoIndex(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo View */}
              <div className="relative bg-black flex items-center justify-center max-h-[60vh]">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.title}
                  className="max-h-[60vh] w-auto object-contain"
                />

                {/* Navigation Arrows */}
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Info Details */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                    <span>{activePhoto.title}</span>
                  </h3>
                  {activePhoto.date && (
                    <span className="text-xs text-rose-600 bg-rose-50 px-3 py-1 rounded-full font-semibold">
                      {activePhoto.date}
                    </span>
                  )}
                </div>
                <p className="text-gray-700 text-sm font-serif italic leading-relaxed">
                  "{activePhoto.caption}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
