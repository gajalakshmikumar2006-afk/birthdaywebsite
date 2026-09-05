'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { LetterLayoutConfig } from '@/types';
import PolaroidPhoto from './PolaroidPhoto';
import LetterCard from './LetterCard';
import DecorativeElements from './DecorativeElements';
import LightboxModal from './LightboxModal';
import { Sparkles, Heart, Share2, Check, PartyPopper } from 'lucide-react';

interface ScrapbookLetterProps {
  contributorName: string;
  letterContent: string;
  layoutConfig: LetterLayoutConfig;
  publishedAt?: string | null;
  isPreview?: boolean;
}

export default function ScrapbookLetter({
  contributorName,
  letterContent,
  layoutConfig,
  publishedAt,
  isPreview = false,
}: ScrapbookLetterProps) {
  const [activeLightboxImage, setActiveLightboxImage] = useState<{
    url: string;
    caption?: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const { theme, photos, letterCard, decorations } = layoutConfig;

  // Trigger colorful confetti celebration
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#3b82f6'],
      });
    } catch {
      // Ignore if confetti not supported
    }
  };

  useEffect(() => {
    // Initial gentle celebration entrance
    const timer = setTimeout(() => {
      triggerCelebration();
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Compute background pattern class
  const getPatternClass = () => {
    switch (theme.bgPattern) {
      case 'dots':
        return 'scrapbook-dots';
      case 'grid':
        return 'scrapbook-grid';
      case 'stars':
        return theme.id === 'midnight-confetti' ? 'scrapbook-midnight' : 'scrapbook-stars';
      case 'subtle-lines':
        return 'scrapbook-botanical';
      case 'grain':
      default:
        return 'scrapbook-texture';
    }
  };

  return (
    <div
      className={`min-h-screen w-full relative overflow-x-hidden transition-colors duration-500 ${theme.bgGradient} ${getPatternClass()}`}
    >
      {/* Lightbox for high-res photo inspection */}
      <LightboxModal
        imageUrl={activeLightboxImage?.url || null}
        caption={activeLightboxImage?.caption}
        onClose={() => setActiveLightboxImage(null)}
      />

      {/* Floating Header Bar */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3 flex items-center justify-between bg-white/60 dark:bg-stone-900/60 backdrop-blur-md border-b border-stone-300/40 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-rose-300/40">
            💌
          </div>
          <div>
            <span className="text-[10.5px] uppercase tracking-wider text-stone-500 font-bold block">
              Birthday Memory From
            </span>
            <h1 className="text-sm sm:text-base font-bold text-stone-900 leading-tight">
              {contributorName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Confetti Celebration Button */}
          <button
            type="button"
            onClick={triggerCelebration}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-rose-600 border border-rose-300 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105 active:scale-95"
            title="Celebrate!"
          >
            <PartyPopper className="w-4 h-4 text-rose-500" />
            <span>Celebrate 🎉</span>
          </button>

          {/* Share Button */}
          {!isPreview && (
            <button
              type="button"
              onClick={handleShareLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* ========================================================= */}
      {/* DESKTOP VIEW: Vibrant Scrapbook Memory Canvas (lg screens) */}
      {/* ========================================================= */}
      <main className="hidden lg:block relative w-full min-h-[calc(100vh-65px)] px-6 py-10">
        <div className="relative max-w-7xl mx-auto min-h-[880px] flex items-center justify-center">
          {/* Decorative Stamps and Stickers */}
          <DecorativeElements decorations={decorations} />

          {/* Scattered Polaroids */}
          {photos.map((photo, idx) => (
            <PolaroidPhoto
              key={photo.imageId || idx}
              config={photo}
              index={idx}
              onOpenLightbox={(url, cap) => setActiveLightboxImage({ url, caption: cap })}
              isDesktopLayout={true}
            />
          ))}

          {/* Central Reading Card */}
          <div className="relative z-30 max-w-2xl w-full px-4">
            <LetterCard
              contributorName={contributorName}
              letterContent={letterContent}
              cardConfig={letterCard}
              theme={theme}
              publishedAt={publishedAt}
              onTriggerCelebration={triggerCelebration}
            />
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* MOBILE & TABLET VIEW: Aesthetic Scrapbook Feed (<lg screens) */}
      {/* ========================================================= */}
      <main className="block lg:hidden w-full px-4 py-8 max-w-2xl mx-auto space-y-7">
        {/* Top Featured Photo (if photos available) */}
        {photos.length > 0 && (
          <div className="py-2">
            <PolaroidPhoto
              config={photos[0]}
              index={0}
              onOpenLightbox={(url, cap) => setActiveLightboxImage({ url, caption: cap })}
              isDesktopLayout={false}
            />
          </div>
        )}

        {/* Central Reading Card */}
        <div className="w-full">
          <LetterCard
            contributorName={contributorName}
            letterContent={letterContent}
            cardConfig={letterCard}
            theme={theme}
            publishedAt={publishedAt}
            onTriggerCelebration={triggerCelebration}
          />
        </div>

        {/* Remaining Photos Grid (Scrapbook Gallery) */}
        {photos.length > 1 && (
          <div className="pt-3">
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-stone-700 font-bold bg-white/80 px-4 py-1.5 rounded-full border border-stone-300/80 shadow-md inline-flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                Photo Memories ({photos.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-8 justify-items-center">
              {photos.slice(1).map((photo, idx) => (
                <PolaroidPhoto
                  key={photo.imageId || idx + 1}
                  config={photo}
                  index={idx + 1}
                  onOpenLightbox={(url, cap) =>
                    setActiveLightboxImage({ url, caption: cap })
                  }
                  isDesktopLayout={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mobile Footer Message */}
        <footer className="text-center pt-8 pb-10 text-xs text-stone-600 font-medium">
          <p>Created with love for a wonderful birthday celebration 🎂✨</p>
        </footer>
      </main>
    </div>
  );
}
