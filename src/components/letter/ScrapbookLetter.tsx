'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { LetterLayoutConfig } from '@/types';
import PolaroidPhoto from './PolaroidPhoto';
import LetterCard from './LetterCard';
import DecorativeElements from './DecorativeElements';
import LightboxModal from './LightboxModal';
import { Sparkles, Heart, Share2, Check } from 'lucide-react';

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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981'],
      });
    } catch {
      // Ignore if confetti not supported
    }
  };

  useEffect(() => {
    // Initial gentle celebration entrance
    const timer = setTimeout(() => {
      triggerCelebration();
    }, 400);
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
        return 'scrapbook-stars';
      case 'grain':
      default:
        return 'scrapbook-texture';
    }
  };

  return (
    <div
      className={`min-h-screen w-full relative overflow-hidden transition-colors duration-500 ${theme.bgGradient} ${getPatternClass()}`}
    >
      {/* Lightbox for high-res photo inspection */}
      <LightboxModal
        imageUrl={activeLightboxImage?.url || null}
        caption={activeLightboxImage?.caption}
        onClose={() => setActiveLightboxImage(null)}
      />

      {/* Floating Header Bar (Share / Celebration actions) */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3 flex items-center justify-between bg-white/40 backdrop-blur-md border-b border-stone-200/50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold text-sm">
            💌
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
              Birthday Memory From
            </span>
            <h1 className="text-sm sm:text-base font-bold text-stone-800 leading-tight">
              {contributorName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Confetti Celebration Button */}
          <button
            type="button"
            onClick={triggerCelebration}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-rose-600 border border-rose-200 text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
            title="Celebrate!"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celebrate 🎉</span>
          </button>

          {/* Share Button */}
          {!isPreview && (
            <button
              type="button"
              onClick={handleShareLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-medium shadow-sm transition-all active:scale-95"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Link Copied!</span>
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
      {/* DESKTOP VIEW: Organic Scattered Memory Canvas (lg screens) */}
      {/* ========================================================= */}
      <main className="hidden lg:block relative w-full min-h-[calc(100vh-60px)] px-8 py-12">
        <div className="relative max-w-7xl mx-auto min-h-[850px] flex items-center justify-center">
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
          <div className="relative z-25 max-w-xl w-full px-4">
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
      {/* MOBILE & TABLET VIEW: Responsive Scrapbook Stream (<lg screens) */}
      {/* ========================================================= */}
      <main className="block lg:hidden w-full px-4 py-8 max-w-2xl mx-auto space-y-8">
        {/* Top Feature Photo (if photos available) */}
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
          <div className="pt-4">
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-stone-500 font-bold bg-white/60 px-3 py-1 rounded-full border border-stone-200/60 shadow-sm inline-flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                Photo Memories ({photos.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 justify-items-center">
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
        <footer className="text-center pt-8 pb-12 text-xs text-stone-500 font-medium">
          <p>Created with love for a wonderful birthday celebration 🎂</p>
        </footer>
      </main>
    </div>
  );
}
