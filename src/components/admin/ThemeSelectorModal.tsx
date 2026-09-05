'use client';

import React, { useState } from 'react';
import { THEMES } from '@/lib/themes';
import { X, Sparkles, Wand2, Check } from 'lucide-react';

interface ThemeSelectorModalProps {
  submissionId: string;
  contributorName: string;
  currentThemeId?: string;
  onClose: () => void;
  onConfirmGenerate: (subId: string, themeId: string, seed: number) => void;
}

export default function ThemeSelectorModal({
  submissionId,
  contributorName,
  currentThemeId = 'vintage-scrapbook',
  onClose,
  onConfirmGenerate,
}: ThemeSelectorModalProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentThemeId);

  const handleGenerate = () => {
    const randomSeed = Math.floor(Math.random() * 1000000) + 1;
    onConfirmGenerate(submissionId, selectedTheme, randomSeed);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-xl w-full flex flex-col bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-700 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Automatic Letter Generator
            </span>
            <h3 className="text-lg font-bold text-stone-900">
              Generate Design for {contributorName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme List Selection */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          <p className="text-xs text-stone-500 mb-2">
            Select a theme style for the automatic collage and background generation:
          </p>
          {Object.values(THEMES).map((theme) => {
            const isSelected = selectedTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-white border border-stone-200 shadow-sm">
                    {theme.stickers[0] || '💌'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">{theme.name}</h4>
                    <p className="text-xs text-stone-500 leading-snug">{theme.description}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow transition-all flex items-center gap-2 active:scale-95"
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate &amp; Preview Layout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
