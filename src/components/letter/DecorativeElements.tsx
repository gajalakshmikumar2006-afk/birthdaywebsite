'use client';

import React from 'react';
import { DecorationItem } from '@/types';

interface DecorativeElementsProps {
  decorations: DecorationItem[];
}

export default function DecorativeElements({ decorations }: DecorativeElementsProps) {
  if (!decorations || decorations.length === 0) return null;

  return (
    <div className="hidden lg:block pointer-events-none select-none">
      {decorations.map((item) => {
        const style: React.CSSProperties = {
          position: 'absolute',
          ...(item.desktopPos.topPct !== undefined ? { top: `${item.desktopPos.topPct}%` } : {}),
          ...(item.desktopPos.bottomPct !== undefined ? { bottom: `${item.desktopPos.bottomPct}%` } : {}),
          ...(item.desktopPos.leftPct !== undefined ? { left: `${item.desktopPos.leftPct}%` } : {}),
          ...(item.desktopPos.rightPct !== undefined ? { right: `${item.desktopPos.rightPct}%` } : {}),
          zIndex: item.desktopPos.zIndex,
          transform: `rotate(${item.rotationDeg}deg) scale(${item.scale})`,
          opacity: item.opacity,
        };

        if (item.type === 'stamp') {
          return (
            <div key={item.id} style={style} className="postage-stamp">
              {item.content}
            </div>
          );
        }

        return (
          <div
            key={item.id}
            style={style}
            className="text-3xl filter drop-shadow-md transition-transform"
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
