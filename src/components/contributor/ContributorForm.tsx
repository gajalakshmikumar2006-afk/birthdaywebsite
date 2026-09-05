'use client';

import React, { useState, useRef, useTransition } from 'react';
import Image from 'next/image';
import { UploadCloud, X, AlertCircle, Loader2, ImagePlus } from 'lucide-react';
import SuccessCard from './SuccessCard';

const MAX_WORDS = 150;
const MAX_IMAGES = 15;
const MAX_FILE_SIZE_MB = 15;

function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

interface ImageFilePreview {
  id: string;
  file: File;
  previewUrl: string;
}

export default function ContributorForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<ImageFilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = countWords(message);
  const isOverLimit = wordCount > MAX_WORDS;

  // Handle message change with word cap validation
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const words = countWords(val);

    // If user tries to paste or type far above 150 words, truncate or warn
    if (words > MAX_WORDS + 20) {
      const wordsArr = val.trim().split(/\s+/);
      const truncated = wordsArr.slice(0, MAX_WORDS).join(' ');
      setMessage(truncated);
      setError(`Message truncated to ${MAX_WORDS} words maximum.`);
    } else {
      setMessage(val);
      if (words <= MAX_WORDS && error?.includes('words')) {
        setError(null);
      }
    }
  };

  // Validate and add files
  const handleAddFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const validFiles: ImageFilePreview[] = [];
    let fileLimitHit = false;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (images.length + validFiles.length >= MAX_IMAGES) {
        fileLimitHit = true;
        break;
      }

      if (!file.type.startsWith('image/')) {
        setError(`"${file.name}" is not an image file. Supported: JPG, PNG, WEBP.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`"${file.name}" is larger than ${MAX_FILE_SIZE_MB}MB.`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      validFiles.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl,
      });
    }

    if (fileLimitHit) {
      setError(`Maximum ${MAX_IMAGES} photos allowed per contribution.`);
    }

    setImages((prev) => [...prev, ...validFiles]);
  };

  // Remove individual photo preview
  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleAddFiles(e.dataTransfer.files);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!message.trim()) {
      setError('Please write your personal letter/message.');
      return;
    }

    if (wordCount > MAX_WORDS) {
      setError(`Your letter is ${wordCount} words. Please shorten to ${MAX_WORDS} words or fewer.`);
      return;
    }

    if (images.length === 0) {
      setError('Please upload at least 1 photo.');
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('name', name.trim());
        formData.append('message', message.trim());

        images.forEach((img) => {
          formData.append('images', img.file);
        });

        const res = await fetch('/api/contributions', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error || 'Failed to submit. Please try again.');
          return;
        }

        // Clean up object URLs
        images.forEach((img) => URL.revokeObjectURL(img.previewUrl));

        setIsSubmitted(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Network error occurred.';
        setError(msg);
      }
    });
  };

  const handleReset = () => {
    setName('');
    setMessage('');
    setImages([]);
    setError(null);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return <SuccessCard contributorName={name} onReset={handleReset} />;
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-xl border border-stone-200/90 transition-all">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-widest text-amber-700/80 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 inline-block mb-3">
          Birthday Keepsake
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 tracking-tight mb-2">
          Write Something Special 💌
        </h1>
        <p className="text-sm sm:text-base text-stone-600">
          Leave a message and a few photos. We&apos;ll take care of the rest.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200/80 flex items-start gap-3 text-rose-800 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="leading-snug">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contributor Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-stone-700 mb-1.5">
            Your Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Arun, Priya, Rahul"
            className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50/50 text-stone-800 text-sm sm:text-base placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all shadow-sm"
          />
        </div>

        {/* Letter / Message Textarea with Live Counter */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="message" className="block text-sm font-semibold text-stone-700">
              Your Personal Letter <span className="text-rose-500">*</span>
            </label>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ${
                isOverLimit
                  ? 'bg-rose-100 text-rose-700 font-bold ring-1 ring-rose-300'
                  : wordCount > 130
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {wordCount} / {MAX_WORDS} words
            </span>
          </div>

          <textarea
            id="message"
            rows={5}
            required
            value={message}
            onChange={handleMessageChange}
            placeholder="Write your birthday wishes, heartfelt memories, inside jokes, or blessings..."
            className={`w-full px-4 py-3 rounded-xl border bg-stone-50/50 text-stone-800 text-sm sm:text-base placeholder-stone-400 focus:outline-none transition-all shadow-sm resize-y leading-relaxed ${
              isOverLimit
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-stone-300 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600'
            }`}
          />
          <div className="flex items-center justify-between mt-1 text-xs text-stone-500">
            <span>Keep it warm and heartfelt (Max {MAX_WORDS} words)</span>
            {isOverLimit && (
              <span className="text-rose-600 font-medium">Please remove {wordCount - MAX_WORDS} word(s)</span>
            )}
          </div>
        </div>

        {/* Multi-Photo Uploader */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-stone-700">
              Add Photos <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-stone-500 font-medium">
              {images.length} / {MAX_IMAGES} photos
            </span>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              isDragging
                ? 'border-amber-500 bg-amber-50/60 scale-[1.01]'
                : 'border-stone-300 bg-stone-50/40 hover:bg-stone-100/60 hover:border-stone-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={(e) => {
                handleAddFiles(e.target.files);
                e.target.value = '';
              }}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-2 text-stone-600">
              <div className="w-12 h-12 rounded-full bg-amber-100/70 text-amber-700 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-700">
                  Click to upload or drag &amp; drop photos
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  JPG, PNG, WEBP (Up to {MAX_IMAGES} photos, max {MAX_FILE_SIZE_MB}MB each)
                </p>
              </div>
            </div>
          </div>

          {/* Image Previews (Only to verify selected photos) */}
          {images.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-stone-500 mb-2">
                Selected photos ({images.length}):
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-56 overflow-y-auto p-1 bg-stone-50 rounded-xl border border-stone-200">
                {images.map((item, idx) => (
                  <div
                    key={item.id}
                    className="relative group aspect-square rounded-lg overflow-hidden border border-stone-200 shadow-sm bg-stone-200"
                  >
                    <Image
                      src={item.previewUrl}
                      alt={`Preview ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(item.id);
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-stone-900/80 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-all opacity-90 group-hover:opacity-100 shadow"
                      title="Remove photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded font-medium">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
                {images.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-stone-300 hover:border-amber-500 hover:bg-amber-50/50 flex flex-col items-center justify-center gap-1 text-stone-500 hover:text-amber-700 transition-colors"
                  >
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-[10px] font-semibold">Add more</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isOverLimit || images.length === 0}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white text-base shadow-md transition-all flex items-center justify-center gap-2 ${
            isSubmitting || isOverLimit || images.length === 0
              ? 'bg-stone-400 cursor-not-allowed opacity-75'
              : 'bg-stone-900 hover:bg-stone-800 active:scale-[0.99] shadow-stone-900/10'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending your memory...</span>
            </>
          ) : (
            <span>Send Contribution 💌</span>
          )}
        </button>
      </form>
    </div>
  );
}
