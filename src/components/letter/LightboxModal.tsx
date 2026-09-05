'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface LightboxModalProps {
  imageUrl: string | null;
  caption?: string;
  onClose: () => void;
}

export default function LightboxModal({ imageUrl, caption, onClose }: LightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (imageUrl) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all shadow-lg z-50 focus:outline-none"
        aria-label="Close photo"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-h-[80vh] flex items-center justify-center p-2 bg-white rounded-lg shadow-2xl">
          <Image
            src={imageUrl}
            alt={caption || 'Enlarged Memory Photo'}
            width={1600}
            height={1200}
            unoptimized
            className="max-h-[75vh] w-auto object-contain rounded"
          />
        </div>
        {caption && (
          <p className="mt-3 text-white/90 text-sm font-medium tracking-wide bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
