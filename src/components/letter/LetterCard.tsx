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

export default function LetterCard({
  contributorName,
  letterContent,
  cardConfig,
  theme,
  publishedAt,
  onTriggerCelebration,
}: LetterCardProps) {
  const { rotationDeg, paperStyle, waxSeal, postageStamp } = cardConfig;

  // Compute paper background and text styling based on theme paper style
  const getPaperClasses = () => {
    switch (paperStyle) {
      case 'pastel-rose':
        return 'bg-[#fff5f7] border-rose-200/90 text-stone-800 shadow-[0_15px_35px_-5px_rgba(244,114,182,0.18)]';
      case 'cream-cardstock':
        return 'bg-[#fdfbf7] border-amber-200/90 text-stone-800 shadow-[0_15px_35px_-5px_rgba(217,119,6,0.15)]';
      case 'midnight-velvet':
        return 'bg-[#181a2f]/95 border-indigo-500/30 text-indigo-50 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.5)] backdrop-blur-md';
      case 'kraft-pressed':
        return 'bg-[#f5efe6] border-emerald-900/20 text-stone-800 shadow-[0_15px_35px_-5px_rgba(45,106,79,0.15)]';
      case 'antique-parchment':
      default:
        return 'bg-[#fcf8f0] border-amber-800/20 text-stone-800 shadow-[0_15px_35px_-5px_rgba(120,53,15,0.15)]';
    }
  };

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : postageStamp.date || 'Special Day';

  return (
    <div
      style={{
        transform: `rotate(${rotationDeg}deg)`,
      }}
      className={`relative w-full max-w-xl mx-auto rounded-xl p-7 sm:p-10 border-2 transition-all duration-300 z-20 ${getPaperClasses()}`}
    >
      {/* Top Header Row: Postage Stamp & Wax Seal / Greeting */}
      <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-stone-200/60">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-800/70 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Birthday Letter Keepsake
          </span>
          <h2 className={`text-2xl sm:text-3xl font-bold mt-1 ${theme.fontClassHeading}`}>
            Dear Birthday Star,
          </h2>
        </div>

        {/* Vintage Stamp */}
        {postageStamp.show && (
          <div className="postage-stamp shrink-0 transform rotate-2">
            <p className="font-bold text-[10px] tracking-widest">{postageStamp.label}</p>
            <p className="text-[9px] opacity-75">{formattedDate}</p>
          </div>
        )}
      </div>

      {/* Letter Message Body */}
      <div className="relative my-6">
        <p
          className={`text-base sm:text-lg leading-relaxed whitespace-pre-line font-medium ${
            paperStyle === 'midnight-velvet' ? 'text-indigo-100' : 'text-stone-700'
          }`}
          style={{
            lineHeight: '1.85',
          }}
        >
          {letterContent}
        </p>
      </div>

      {/* Letter Footer: Contributor Signature & Wax Seal */}
      <div className="pt-6 border-t border-stone-200/60 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
            With Love &amp; Warmest Wishes,
          </p>
          <p className={`text-2xl sm:text-3xl font-bold mt-1 ${theme.fontClassHeading}`}>
            {contributorName}
          </p>
        </div>

        {/* Wax Seal Badge with Interactive Tap */}
        {waxSeal.show && (
          <button
            type="button"
            onClick={onTriggerCelebration}
            title="Click for celebration sparkle!"
            className="group wax-seal w-13 h-13 sm:w-14 sm:h-14 shrink-0 transition-transform hover:scale-110 active:scale-95 cursor-pointer p-2 flex flex-col items-center justify-center text-center select-none"
          >
            <span className="text-xl sm:text-2xl drop-shadow filter transform group-hover:scale-110 transition-transform">
              {waxSeal.emoji || '💌'}
            </span>
            <span className="text-[8px] font-bold text-white tracking-widest uppercase opacity-90">
              SEAL
            </span>
          </button>
        )}
      </div>

      {/* Decorative Corner Tabs */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-stone-400/40 rounded-tl" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-stone-400/40 rounded-tr" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-stone-400/40 rounded-bl" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-stone-400/40 rounded-br" />
    </div>
  );
}
