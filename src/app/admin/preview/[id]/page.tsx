'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ScrapbookLetter from '@/components/letter/ScrapbookLetter';
import { GeneratedLetter, Submission } from '@/types';
import { THEMES } from '@/lib/themes';
import {
  ArrowLeft,
  Wand2,
  Globe,
  ExternalLink,
  CheckCircle2,
  Loader2,
  Palette,
  Smartphone,
  Monitor,
} from 'lucide-react';

export default function AdminPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const letterId = params.id as string;

  const [letter, setLetter] = useState<GeneratedLetter | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('vintage-scrapbook');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch letter and submission
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/submissions');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        const sub = data.submissions.find(
          (s: Submission) => s.generatedLetter?.id === letterId
        );
        if (sub && sub.generatedLetter) {
          setSubmission(sub);
          setLetter(sub.generatedLetter);
          setSelectedTheme(sub.generatedLetter.themeId);
        } else {
          alert('Letter not found');
          router.push('/admin');
        }
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (letterId) {
      loadData();
    }
  }, [letterId]);

  // Regenerate layout with selected theme and new seed
  const handleRegenerate = async (themeToUse?: string) => {
    if (!submission) return;
    const theme = themeToUse || selectedTheme;
    const seed = Math.floor(Math.random() * 1000000) + 1;
    setIsUpdating(true);

    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: submission.id,
          themeId: theme,
          seed,
        }),
      });

      const data = await res.json();
      if (data.success && data.letter) {
        setLetter(data.letter);
      } else {
        alert(data.error || 'Failed to regenerate layout');
      }
    } catch {
      alert('Error connecting to generator.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle Publish Status
  const handleTogglePublish = async () => {
    if (!letter || !submission) return;
    setIsUpdating(true);

    try {
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letterId: letter.id,
          published: !letter.published,
        }),
      });

      const data = await res.json();
      if (data.success && data.letter) {
        setLetter(data.letter);
      } else {
        alert(data.error || 'Failed to update publish state');
      }
    } catch {
      alert('Error updating publish state.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading || !letter || !submission) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-white p-4">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
        <p className="text-stone-400 text-sm font-medium">Loading scrapbook preview...</p>
      </div>
    );
  }

  const isPublished = letter.published;

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col">
      {/* Top Admin Controls Bar */}
      <header className="sticky top-0 z-50 w-full bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-white px-4 py-2.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back to Dashboard & Info */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-white">
                  Preview: {submission.contributorName}
                </span>
                {isPublished ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Live
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                    Draft
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center: Theme Selector & Regenerate */}
          <div className="flex items-center gap-2">
            {/* Theme Dropdown */}
            <div className="flex items-center gap-1.5 bg-stone-800 px-2.5 py-1.5 rounded-xl border border-stone-700 text-xs">
              <Palette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <select
                value={selectedTheme}
                onChange={(e) => {
                  setSelectedTheme(e.target.value);
                  handleRegenerate(e.target.value);
                }}
                disabled={isUpdating}
                className="bg-transparent text-stone-200 focus:outline-none cursor-pointer pr-2 font-medium"
              >
                {Object.values(THEMES).map((t) => (
                  <option key={t.id} value={t.id} className="bg-stone-900 text-white">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Regenerate Button */}
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleRegenerate()}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
              title="Generate a fresh layout composition"
            >
              {isUpdating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Wand2 className="w-3.5 h-3.5" />
              )}
              <span>Regenerate Layout 🎲</span>
            </button>
          </div>

          {/* Right: Viewport toggle & Publish / Public Link */}
          <div className="flex items-center gap-2">
            {/* Viewport switch */}
            <div className="hidden sm:flex items-center bg-stone-800 p-0.5 rounded-lg border border-stone-700">
              <button
                type="button"
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  previewMode === 'desktop'
                    ? 'bg-stone-700 text-white'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Desktop Canvas"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  previewMode === 'mobile'
                    ? 'bg-stone-700 text-white'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Mobile Viewport"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Publish Toggle Button */}
            <button
              type="button"
              disabled={isUpdating}
              onClick={handleTogglePublish}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
                isPublished
                  ? 'bg-stone-800 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isPublished ? 'Unpublish' : 'Publish Letter 🚀'}</span>
            </button>

            {/* Public Link button */}
            {isPublished && (
              <Link
                href={`/letters/${letter.id}`}
                target="_blank"
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1 border border-stone-700"
              >
                <span>Live View</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Preview Viewport Canvas */}
      <main className="flex-1 w-full flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
        <div
          className={`transition-all duration-300 ${
            previewMode === 'mobile'
              ? 'w-full max-w-sm my-6 rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-800'
              : 'w-full min-h-full'
          }`}
        >
          <ScrapbookLetter
            contributorName={submission.contributorName}
            letterContent={submission.letterContent}
            layoutConfig={letter.layoutConfig}
            publishedAt={letter.publishedAt}
            isPreview={true}
          />
        </div>
      </main>
    </div>
  );
}
