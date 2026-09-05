'use client';

import React from 'react';
import { Heart, CheckCircle2, RotateCcw } from 'lucide-react';

interface SuccessCardProps {
  contributorName: string;
  onReset: () => void;
}

export default function SuccessCard({ contributorName, onReset }: SuccessCardProps) {
  return (
    <div className="w-full max-w-lg mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-8 sm:p-10 shadow-xl border border-stone-200/80 text-center animate-fadeIn">
      <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-rose-50/50">
        <Heart className="w-8 h-8 fill-rose-500 animate-pulse" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-serif text-stone-800 font-semibold mb-3">
        Your message has been received 💌
      </h2>

      <p className="text-stone-600 leading-relaxed mb-6">
        Thank you <span className="font-medium text-stone-800">{contributorName}</span> for sharing
        your warm memories and photos. We will take care of the rest!
      </p>

      <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-full text-xs text-stone-600 font-medium mb-8">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        Saved securely for the birthday reveal
      </div>

      <div className="pt-4 border-t border-stone-100">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors py-2 px-4 rounded-lg hover:bg-stone-100 font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Submit another message or photo
        </button>
      </div>
    </div>
  );
}
