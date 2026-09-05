'use client';

import React from 'react';
import Image from 'next/image';
import { PlacedPhotoConfig } from '@/types';
import { ZoomIn } from 'lucide-react';

interface PolaroidPhotoProps {
  config: PlacedPhotoConfig;
  index: number;
  onOpenLightbox: (url: string, caption?: string) => void;
  isDesktopLayout?: boolean;
}

export default function PolaroidPhoto({
  config,
  index,
  onOpenLightbox,
  isDesktopLayout = true,
}: PolaroidPhotoProps) {
  const {
    imageUrl,
    rotationDeg,
    desktopPos,
    mobileRotationDeg,
    tapeStyle,
    tapePosition,
    pinStyle,
    stickerEmoji,
    caption,
  } = config;

  // Compute tape classes
  const getTapeClass = () => {
    switch (tapeStyle) {
      case 'pink-washi':
        return 'washi-pink';
      case 'gold-foil':
        return 'washi-gold';
      case 'mint-washi':
        return 'washi-mint';
      case 'lavender-washi':
        return 'washi-lavender';
      case 'kraft':
      default:
        return 'washi-kraft';
    }
  };

  // Compute tape positioning styles
  const renderTape = () => {
    if (tapeStyle === 'none') return null;

    if (tapePosition === 'top-center') {
      return (
        <div
          className={`washi-tape ${getTapeClass()} -top-3.5 left-1/2 -translate-x-1/2 -rotate-1`}
          style={{ width: '90px' }}
        />
      );
    }
    if (tapePosition === 'top-left' || tapePosition === 'corner-left') {
      return (
        <div
          className={`washi-tape ${getTapeClass()} -top-3 -left-4 -rotate-45`}
          style={{ width: '80px' }}
        />
      );
    }
    if (tapePosition === 'top-right' || tapePosition === 'corner-right') {
      return (
        <div
          className={`washi-tape ${getTapeClass()} -top-3 -right-4 rotate-45`}
          style={{ width: '80px' }}
        />
      );
    }
    if (tapePosition === 'double-corner') {
      return (
        <>
          <div
            className={`washi-tape ${getTapeClass()} -top-3 -left-4 -rotate-45`}
            style={{ width: '75px' }}
          />
          <div
            className={`washi-tape ${getTapeClass()} -bottom-3 -right-4 -rotate-45`}
            style={{ width: '75px' }}
          />
        </>
      );
    }
    return (
      <div
        className={`washi-tape ${getTapeClass()} -top-3.5 left-1/2 -translate-x-1/2`}
        style={{ width: '90px' }}
      />
    );
  };

  // Render pin decoration
  const renderPin = () => {
    if (pinStyle === 'gold-pin') {
      return (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-5 h-5 rounded-full bg-amber-400 shadow-md border-2 border-amber-600 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-200" />
        </div>
      );
    }
    if (pinStyle === 'silver-pin') {
      return (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-5 h-5 rounded-full bg-stone-300 shadow-md border-2 border-stone-500 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
      );
    }
    if (pinStyle === 'rose-gold-clip') {
      return (
        <div className="absolute -top-4 right-4 z-30 w-4 h-7 border-2 border-rose-400 rounded-t-full shadow-sm bg-rose-200/40" />
      );
    }
    return null;
  };

  // Desktop absolute styling
  const desktopStyle: React.CSSProperties = isDesktopLayout
    ? {
        position: 'absolute',
        ...(desktopPos.topPct !== undefined ? { top: `${desktopPos.topPct}%` } : {}),
        ...(desktopPos.bottomPct !== undefined ? { bottom: `${desktopPos.bottomPct}%` } : {}),
        ...(desktopPos.leftPct !== undefined ? { left: `${desktopPos.leftPct}%` } : {}),
        ...(desktopPos.rightPct !== undefined ? { right: `${desktopPos.rightPct}%` } : {}),
        width: `${desktopPos.widthPx}px`,
        zIndex: desktopPos.zIndex,
        transform: `rotate(${rotationDeg}deg)`,
      }
    : {
        transform: `rotate(${mobileRotationDeg}deg)`,
      };

  return (
    <div
      style={desktopStyle}
      className={`group cursor-pointer select-none transition-all duration-300 ${
        isDesktopLayout ? 'hover:scale-105 hover:!rotate-0' : 'w-full max-w-[280px] mx-auto hover:scale-105'
      }`}
      onClick={() => onOpenLightbox(imageUrl, caption || `Memory #${index + 1}`)}
    >
      <div className="relative polaroid-card">
        {/* Tape & Pin decorations */}
        {renderTape()}
        {renderPin()}

        {/* Photo Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 rounded-sm shadow-inner">
          <Image
            src={imageUrl}
            alt={caption || `Memory Photo ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Hover Zoom Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-white/90 text-stone-800 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
              <ZoomIn className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Polaroid Bottom Caption / Number */}
        <div className="mt-2.5 flex items-center justify-between px-1">
          <span className="text-[12px] font-handwritten text-stone-500 tracking-wide">
            {caption || `Memory #${index + 1}`}
          </span>
          {stickerEmoji && (
            <span className="text-sm select-none transform group-hover:scale-125 transition-transform">
              {stickerEmoji}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
