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
          style={{ width: '95px' }}
        />
      );
    }
    if (tapePosition === 'top-left' || tapePosition === 'corner-left') {
      return (
        <div
          className={`washi-tape ${getTapeClass()} -top-3.5 -left-5 -rotate-45`}
          style={{ width: '85px' }}
        />
      );
    }
    if (tapePosition === 'top-right' || tapePosition === 'corner-right') {
      return (
        <div
          className={`washi-tape ${getTapeClass()} -top-3.5 -right-5 rotate-45`}
          style={{ width: '85px' }}
        />
      );
    }
    if (tapePosition === 'double-corner') {
      return (
        <>
          <div
            className={`washi-tape ${getTapeClass()} -top-3.5 -left-5 -rotate-45`}
            style={{ width: '80px' }}
          />
          <div
            className={`washi-tape ${getTapeClass()} -bottom-3.5 -right-5 -rotate-45`}
            style={{ width: '80px' }}
          />
        </>
      );
    }
    return (
      <div
        className={`washi-tape ${getTapeClass()} -top-3.5 left-1/2 -translate-x-1/2`}
        style={{ width: '95px' }}
      />
    );
  };

  // Render 3D realistic pin decoration
  const renderPin = () => {
    if (pinStyle === 'gold-pin') {
      return (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center filter drop-shadow-md">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-700 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-100 shadow" />
          </div>
        </div>
      );
    }
    if (pinStyle === 'silver-pin') {
      return (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center filter drop-shadow-md">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500 border border-slate-600 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow" />
          </div>
        </div>
      );
    }
    if (pinStyle === 'rose-gold-clip') {
      return (
        <div className="absolute -top-4 right-4 z-40 w-4.5 h-7.5 border-2 border-rose-400 rounded-t-full shadow-md bg-rose-200/50 backdrop-blur-sm" />
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
        isDesktopLayout
          ? 'hover:scale-108 hover:!rotate-0 hover:z-50'
          : 'w-full max-w-[290px] mx-auto hover:scale-105'
      }`}
      onClick={() => onOpenLightbox(imageUrl, caption || `Memory #${index + 1}`)}
    >
      <div className="relative polaroid-card">
        {/* Tape & Pin decorations */}
        {renderTape()}
        {renderPin()}

        {/* Photo Image Container with Gloss Sheen */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 rounded-[2px] shadow-inner photo-gloss">
          <Image
            src={imageUrl}
            alt={caption || `Memory Photo ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Hover Zoom Overlay Button */}
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white text-stone-900 flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform font-bold">
              <ZoomIn className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Polaroid Bottom Caption & Timestamp */}
        <div className="mt-2.5 flex items-center justify-between px-1">
          <div className="flex flex-col">
            <span className="text-[13px] font-handwritten text-stone-600 font-bold tracking-wide">
              {caption || `Memory #${index + 1}`}
            </span>
            <span className="text-[8.5px] uppercase tracking-widest text-stone-400 font-mono -mt-0.5">
              INSTAX • 05/09
            </span>
          </div>
          {stickerEmoji && (
            <span className="text-base select-none transform group-hover:scale-125 transition-transform filter drop-shadow-sm">
              {stickerEmoji}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
