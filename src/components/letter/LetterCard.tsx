'use client';

import React from 'react';
import { LetterCardConfig, LetterThemeConfig } from '@/types';
import { Sparkles, Heart } from 'lucide-react';

interface LetterCardProps {
  contributorName: string;
  letterContent: string;
  cardConfig: LetterCardConfig;
  theme: LetterThemeConfig;
  publishedAt?: string | null;
  onTriggerCelebration?: () => void;
}

function getWordCount(text: string): number {
  return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

export default function LetterCard({
  contributorName,
  letterContent,
  cardConfig,
  theme,
  publishedAt,
  onTriggerCelebration,
}: LetterCardProps) {
  const { rotationDeg, paperStyle, waxSeal, postageStamp } = cardConfig;
  const wordCount = getWordCount(letterContent);

  // Dynamic font sizing based on word count so message never overflows or spills out
  const getTextSizeClass = () => {
    if (wordCount <= 35) {
      return 'text-lg sm:text-xl leading-relaxed sm:leading-loose';
    }
    if (wordCount <= 75) {
      return 'text-base sm:text-lg leading-relaxed';
    }
    if (wordCount <= 110) {
      return 'text-sm sm:text-base leading-relaxed';
    }
    return 'text-[13.5px] sm:text-[15px] leading-normal sm:leading-relaxed';
  };

  // High-contrast, luxury textured paper styling
  const getPaperClasses = () => {
    switch (paperStyle) {
      case 'pastel-rose':
        return 'bg-gradient-to-b from-[#fff5f7] to-[#ffe4e9] border-rose-300/90 text-stone-800 shadow-[0_20px_45px_-10px_rgba(244,63,94,0.22),0_0_0_1px_rgba(244,63,94,0.15)] ring-1 ring-rose-200/50';
      case 'cream-cardstock':
        return 'bg-gradient-to-b from-[#fffdfa] to-[#fef3c7]/60 border-amber-300/90 text-stone-900 shadow-[0_20px_45px_-10px_rgba(217,119,6,0.2),0_0_0_1px_rgba(217,119,6,0.15)] ring-1 ring-amber-200/60';
      case 'midnight-velvet':
        return 'bg-gradient-to-b from-[#181630]/95 to-[#0e0c1f]/95 border-purple-500/40 text-purple-50 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7),0_0_0_1px_rgba(168,85,247,0.3)] ring-1 ring-indigo-500/30 backdrop-blur-md';
      case 'kraft-pressed':
        return 'bg-gradient-to-b from-[#f9f6f0] to-[#edf7ee] border-emerald-300/80 text-stone-800 shadow-[0_20px_45px_-10px_rgba(16,185,129,0.2),0_0_0_1px_rgba(16,185,129,0.15)] ring-1 ring-emerald-200/50';
      case 'antique-parchment':
      default:
        return 'bg-gradient-to-b from-[#fdfbf7] to-[#f5ebd8] border-[#cbb190] text-stone-900 shadow-[0_20px_45px_-10px_rgba(120,53,15,0.22),0_0_0_1px_rgba(140,85,35,0.15)] ring-1 ring-amber-200/50';
    }
  };

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : postageStamp.date || 'Special Day';

  return (
    <div
      style={{
        transform: `rotate(${rotationDeg}deg)`,
      }}
      className={`relative w-full max-w-2xl mx-auto rounded-2xl p-6 sm:p-9 border-2 transition-all duration-300 z-25 overflow-hidden ${getPaperClasses()}`}
    >
      {/* Delicate Inner Foil Inset Line */}
      <div className="absolute inset-2 sm:inset-3 border border-dashed border-stone-400/30 rounded-xl pointer-events-none" />

      {/* Top Header Row: Stamp & Title */}
      <div className="relative flex items-start justify-between gap-3 mb-5 pb-4 border-b border-stone-300/60">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-amber-800/80 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Special Birthday Letter
          </span>
          <h2 className={`text-2xl sm:text-3xl font-bold mt-0.5 tracking-tight ${theme.fontClassHeading}`}>
            Dear Birthday Star,
          </h2>
        </div>

        {/* Vintage Postmark Stamp */}
        {postageStamp.show && (
          <div className="shrink-0 flex flex-col items-end">
            <div className="postage-stamp transform rotate-1 bg-white/90">
              <p className="font-bold text-[10px] tracking-wider text-amber-900">{postageStamp.label}</p>
              <p className="text-[9px] text-stone-500 font-mono text-center">{formattedDate}</p>
            </div>
            {/* Wavy Postmark Cancellation lines */}
            <div className="text-[10px] text-stone-400 tracking-tighter select-none -mt-1 font-mono">
              〰️〰️〰️〰️
            </div>
          </div>
        )}
      </div>

      {/* Letter Message Body with Guaranteed Non-Overflow */}
      <div className="relative my-4 sm:my-6 overflow-hidden">
        <p
          className={`font-medium break-words [overflow-wrap:anywhere] whitespace-pre-line tracking-wide ${getTextSizeClass()} ${
            paperStyle === 'midnight-velvet' ? 'text-indigo-100' : 'text-stone-800'
          }`}
        >
          {letterContent}
        </p>
      </div>

      {/* Letter Footer: Contributor Signature & Wax Seal */}
      <div className="relative pt-4 sm:pt-5 border-t border-stone-300/60 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">
            With Love &amp; Warmest Wishes,
          </p>
          <p className={`text-2xl sm:text-3xl font-bold mt-0.5 tracking-tight ${theme.fontClassHeading}`}>
            {contributorName}
          </p>
        </div>

        {/* Interactive 3D Wax Seal Badge */}
        {waxSeal.show && (
          <div className="relative flex flex-col items-center">
            <button
              type="button"
              onClick={onTriggerCelebration}
              title="Click for celebration confetti!"
              className={`group ${
                paperStyle === 'cream-cardstock' ? 'wax-seal-gold' : 'wax-seal'
              } w-13 h-13 sm:w-15 sm:h-15 shrink-0 transition-transform hover:scale-115 active:scale-95 cursor-pointer p-2 flex flex-col items-center justify-center text-center select-none shadow-xl`}
            >
              <span className="text-xl sm:text-2xl drop-shadow filter transform group-hover:scale-110 transition-transform">
                {waxSeal.emoji || '💌'}
              </span>
              <span className="text-[7.5px] font-extrabold text-white tracking-widest uppercase opacity-95">
                SEAL
              </span>
            </button>
            {/* Small Wax Seal Ribbon Tails */}
            <div className="flex gap-1 -mt-1.5 select-none pointer-events-none">
              <div className="w-2.5 h-4 bg-rose-700/80 -rotate-12 rounded-b shadow-sm" />
              <div className="w-2.5 h-4 bg-rose-700/80 rotate-12 rounded-b shadow-sm" />
            </div>
          </div>
        )}
      </div>

      {/* Golden Corner Accents */}
      <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-600/50 rounded-tl pointer-events-none" />
      <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-600/50 rounded-tr pointer-events-none" />
      <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-600/50 rounded-bl pointer-events-none" />
      <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-600/50 rounded-br pointer-events-none" />
    </div>
  );
}
