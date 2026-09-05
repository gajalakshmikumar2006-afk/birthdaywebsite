'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Submission } from '@/types';
import SubmissionDetailModal from '@/components/admin/SubmissionDetailModal';
import ThemeSelectorModal from '@/components/admin/ThemeSelectorModal';
import {
  Wand2,
  Eye,
  Globe,
  Trash2,
  LogOut,
  Calendar,
  FileText,
  ImageIcon,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'generated' | 'published'>('all');
  const [selectedForDetail, setSelectedForDetail] = useState<Submission | null>(null);
  const [selectedForTheme, setSelectedForTheme] = useState<{
    id: string;
    name: string;
    themeId?: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Load submissions
  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/submissions');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  // Generate / Regenerate letter design
  const handleGenerateLetter = async (submissionId: string, themeId: string, seed: number) => {
    setActionLoading(`generate-${submissionId}`);
    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, themeId, seed }),
      });

      const data = await res.json();
      if (data.success && data.letter) {
        // Navigate to live preview page
        router.push(`/admin/preview/${data.letter.id}`);
      } else {
        alert(data.error || 'Generation failed');
      }
    } catch {
      alert('Error generating letter layout.');
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (letterId: string, currentPublished: boolean) => {
    setActionLoading(`publish-${letterId}`);
    try {
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letterId, published: !currentPublished }),
      });
      const data = await res.json();
      if (data.success) {
        await loadSubmissions();
      } else {
        alert(data.error || 'Failed to update publish state');
      }
    } catch {
      alert('Network error updating publish state.');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete submission
  const handleDeleteSubmission = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the submission from "${name}"? This will delete all uploaded photos.`)) {
      return;
    }

    setActionLoading(`delete-${id}`);
    try {
      const res = await fetch(`/api/admin/submissions?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch {
      alert('Error deleting submission.');
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered submissions
  const filteredSubmissions = submissions.filter((sub) => {
    if (activeTab === 'all') return true;
    return sub.status === activeTab;
  });

  // Calculate metrics
  const totalCount = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const generatedCount = submissions.filter((s) => s.status === 'generated').length;
  const publishedCount = submissions.filter((s) => s.status === 'published').length;
  const totalPhotos = submissions.reduce((acc, s) => acc + s.images.length, 0);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-16">
      {/* Detail Modal */}
      <SubmissionDetailModal
        submission={selectedForDetail}
        onClose={() => setSelectedForDetail(null)}
        onGenerate={(id) => {
          const sub = submissions.find((s) => s.id === id);
          if (sub) {
            setSelectedForTheme({
              id: sub.id,
              name: sub.contributorName,
              themeId: sub.generatedLetter?.themeId,
            });
          }
        }}
      />

      {/* Theme Selector Modal */}
      {selectedForTheme && (
        <ThemeSelectorModal
          submissionId={selectedForTheme.id}
          contributorName={selectedForTheme.name}
          currentThemeId={selectedForTheme.themeId}
          onClose={() => setSelectedForTheme(null)}
          onConfirmGenerate={handleGenerateLetter}
        />
      )}

      {/* Header Bar */}
      <header className="bg-stone-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              💌
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-tight">Admin Dashboard</h1>
              <p className="text-[11px] text-stone-400 -mt-0.5">
                Birthday Letter Management &amp; Collage Generator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-medium transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Contributor Form</span>
            </Link>

            <button
              onClick={loadSubmissions}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title="Refresh submissions"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-medium transition-colors border border-rose-500/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
              Total Received
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold font-serif text-stone-900">{totalCount}</span>
              <span className="text-xs font-medium text-stone-500">letters</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Published
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold font-serif text-emerald-700">{publishedCount}</span>
              <span className="text-xs font-medium text-emerald-600">live in API</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-amber-700 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Pending Review
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold font-serif text-amber-700">{pendingCount}</span>
              <span className="text-xs font-medium text-amber-600">need layout</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-indigo-700 font-semibold flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" /> Total Photos
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold font-serif text-indigo-900">{totalPhotos}</span>
              <span className="text-xs font-medium text-indigo-600">stored &amp; optimized</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Content Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/80 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'pending'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('generated')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'generated'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Generated ({generatedCount})
            </button>
            <button
              onClick={() => setActiveTab('published')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'published'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Published ({publishedCount})
            </button>
          </div>

          <div className="text-xs text-stone-500">
            Showing <span className="font-semibold text-stone-800">{filteredSubmissions.length}</span> submissions
          </div>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="py-20 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500 mb-3" />
            <p className="font-medium text-sm">Loading submissions...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="py-20 text-center text-stone-500 bg-white rounded-2xl border border-stone-200 p-8">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-stone-800 text-base mb-1">No submissions found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {activeTab === 'all'
                ? 'No contributors have submitted letters yet. Share the contributor form link!'
                : `There are currently no submissions matching "${activeTab}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((sub) => {
              const letter = sub.generatedLetter;
              const isPublished = letter?.published || false;
              const hasGenerated = !!letter;

              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm hover:shadow transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Left: Info & Photos Stack */}
                  <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
                    {/* First Photo Thumbnail Stack */}
                    <div
                      className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer shadow-sm group"
                      onClick={() => setSelectedForDetail(sub)}
                    >
                      {sub.images.length > 0 ? (
                        <Image
                          src={sub.images[0].storagePath}
                          alt={sub.contributorName}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                      {sub.images.length > 1 && (
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/75 text-white text-[10px] font-bold rounded">
                          +{sub.images.length - 1}
                        </span>
                      )}
                    </div>

                    {/* Submission Metadata & Snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-serif font-bold text-lg text-stone-900 truncate">
                          {sub.contributorName}
                        </h3>

                        {/* Status Badge */}
                        {isPublished ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Published
                          </span>
                        ) : hasGenerated ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-semibold">
                            <Sparkles className="w-3 h-3" /> Layout Generated
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold">
                            <Clock className="w-3 h-3" /> Pending Design
                          </span>
                        )}
                      </div>

                      {/* Snippet */}
                      <p
                        className="text-stone-600 text-xs sm:text-sm line-clamp-2 leading-relaxed cursor-pointer hover:text-stone-900"
                        onClick={() => setSelectedForDetail(sub)}
                      >
                        {sub.letterContent}
                      </p>

                      {/* Meta stats */}
                      <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-stone-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {new Date(sub.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-stone-400" />
                          {sub.wordCount} words
                        </span>
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-stone-400" />
                          {sub.images.length} photos
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                    {/* View Details Modal */}
                    <button
                      type="button"
                      onClick={() => setSelectedForDetail(sub)}
                      className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    {/* Generate / Regenerate Layout */}
                    <button
                      type="button"
                      disabled={actionLoading === `generate-${sub.id}`}
                      onClick={() =>
                        setSelectedForTheme({
                          id: sub.id,
                          name: sub.contributorName,
                          themeId: letter?.themeId,
                        })
                      }
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                    >
                      {actionLoading === `generate-${sub.id}` ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="w-3.5 h-3.5" />
                      )}
                      <span>{hasGenerated ? 'Regenerate 🎨' : 'Generate ⚡'}</span>
                    </button>

                    {/* Preview Generated Letter (if generated) */}
                    {hasGenerated && (
                      <Link
                        href={`/admin/preview/${letter.id}`}
                        className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-indigo-200/60"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </Link>
                    )}

                    {/* Publish / Unpublish Toggle */}
                    {hasGenerated && (
                      <button
                        type="button"
                        disabled={actionLoading === `publish-${letter.id}`}
                        onClick={() => handleTogglePublish(letter.id, isPublished)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border shadow-sm ${
                          isPublished
                            ? 'bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border-stone-300'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-700'
                        }`}
                      >
                        {actionLoading === `publish-${letter.id}` ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Globe className="w-3.5 h-3.5" />
                        )}
                        <span>{isPublished ? 'Unpublish' : 'Publish 🚀'}</span>
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      type="button"
                      disabled={actionLoading === `delete-${sub.id}`}
                      onClick={() => handleDeleteSubmission(sub.id, sub.contributorName)}
                      className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete submission"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
