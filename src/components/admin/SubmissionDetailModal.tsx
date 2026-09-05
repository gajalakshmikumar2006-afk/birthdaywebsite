'use client';

import React from 'react';
import Image from 'next/image';
import { Submission } from '@/types';
import { X, Calendar, FileText, Image as ImageIcon } from 'lucide-react';

interface SubmissionDetailModalProps {
  submission: Submission | null;
  onClose: () => void;
  onGenerate: (subId: string) => void;
}

export default function SubmissionDetailModal({
  submission,
  onClose,
  onGenerate,
}: SubmissionDetailModalProps) {
  if (!submission) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
              Raw Contributor Submission
            </span>
            <h3 className="text-xl font-bold text-stone-900">{submission.contributorName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-stone-800 text-sm">
          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full text-xs text-stone-600 font-medium">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              {new Date(submission.createdAt).toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full text-xs text-stone-600 font-medium">
              <FileText className="w-3.5 h-3.5 text-stone-500" />
              {submission.wordCount} words
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full text-xs text-stone-600 font-medium">
              <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
              {submission.images.length} photos
            </span>
          </div>

          {/* Raw Message Text */}
          <div>
            <h4 className="font-semibold text-stone-900 mb-2 flex items-center gap-1.5">
              <span>Original Message Content</span>
            </h4>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 whitespace-pre-line text-stone-700 leading-relaxed font-sans">
              {submission.letterContent}
            </div>
          </div>

          {/* Uploaded Photos Gallery */}
          <div>
            <h4 className="font-semibold text-stone-900 mb-2">
              Uploaded Photos ({submission.images.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {submission.images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm"
                >
                  <Image
                    src={img.storagePath}
                    alt={`Uploaded photo ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onGenerate(submission.id);
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow transition-all active:scale-95"
          >
            {submission.generatedLetter ? 'Regenerate Design 🎨' : 'Generate Letter Design ⚡'}
          </button>
        </div>
      </div>
    </div>
  );
}
