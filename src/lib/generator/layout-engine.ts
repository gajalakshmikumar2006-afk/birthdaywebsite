import {
  DecorationItem,
  LetterCardConfig,
  LetterLayoutConfig,
  LetterThemeConfig,
  PinStyle,
  PlacedPhotoConfig,
  SubmissionImage,
  TapePosition,
  TapeStyle,
} from '@/types';
import { getTheme, THEMES } from '../themes';

// Seeded PRNG (Linear Congruential Generator)
function createRng(seed: number) {
  let state = Math.abs(seed) || 123456789;
  return function next(): number {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const TAPE_POSITIONS: TapePosition[] = [
  'top-center',
  'top-left',
  'top-right',
  'double-corner',
  'corner-left',
  'corner-right',
];

const PIN_STYLES: PinStyle[] = ['gold-pin', 'silver-pin', 'rose-gold-clip', 'none'];

const TAPE_STYLES: TapeStyle[] = ['kraft', 'pink-washi', 'gold-foil', 'mint-washi', 'lavender-washi'];

export function generateLetterLayout(
  images: SubmissionImage[],
  themeId: string = 'vintage-scrapbook',
  seed?: number
): LetterLayoutConfig {
  const actualSeed = seed ?? Math.floor(Math.random() * 1000000) + 1;
  const rng = createRng(actualSeed);
  const theme: LetterThemeConfig = getTheme(themeId);

  const numImages = images.length;
  const photos: PlacedPhotoConfig[] = [];

  // Generate layouts based on image count with guaranteed central card clearance
  if (numImages === 1) {
    const isLeft = rng() > 0.5;
    photos.push({
      imageId: images[0].id,
      imageUrl: images[0].storagePath,
      rotationDeg: (rng() * 10 - 5),
      zone: isLeft ? 'top-left' : 'top-right',
      desktopPos: {
        ...(isLeft ? { leftPct: 4 } : { rightPct: 4 }),
        topPct: 15,
        widthPx: 250,
        zIndex: 10,
      },
      mobileOrder: 1,
      mobileRotationDeg: rng() * 6 - 3,
      tapeStyle: theme.tapeStyleDefault,
      tapePosition: 'top-center',
      pinStyle: 'gold-pin',
      stickerEmoji: theme.stickers[Math.floor(rng() * theme.stickers.length)],
    });
  } else if (numImages === 2) {
    photos.push({
      imageId: images[0].id,
      imageUrl: images[0].storagePath,
      rotationDeg: -5 + rng() * 3,
      zone: 'top-left',
      desktopPos: {
        leftPct: 3,
        topPct: 10,
        widthPx: 240,
        zIndex: 10,
      },
      mobileOrder: 1,
      mobileRotationDeg: -3,
      tapeStyle: theme.tapeStyleDefault,
      tapePosition: 'top-left',
      pinStyle: 'gold-pin',
      stickerEmoji: theme.stickers[0] || '💌',
    });
    photos.push({
      imageId: images[1].id,
      imageUrl: images[1].storagePath,
      rotationDeg: 5 + rng() * 3,
      zone: 'bottom-right',
      desktopPos: {
        rightPct: 3,
        bottomPct: 10,
        widthPx: 240,
        zIndex: 10,
      },
      mobileOrder: 2,
      mobileRotationDeg: 3,
      tapeStyle: theme.tapeStyleDefault,
      tapePosition: 'top-right',
      pinStyle: 'rose-gold-clip',
      stickerEmoji: theme.stickers[1] || '✨',
    });
  } else if (numImages === 3) {
    photos.push({
      imageId: images[0].id,
      imageUrl: images[0].storagePath,
      rotationDeg: -5 + rng() * 2,
      zone: 'top-left',
      desktopPos: { leftPct: 2, topPct: 8, widthPx: 230, zIndex: 10 },
      mobileOrder: 1,
      mobileRotationDeg: -3,
      tapeStyle: theme.tapeStyleDefault,
      tapePosition: 'top-left',
      pinStyle: 'gold-pin',
      stickerEmoji: theme.stickers[0] || '💌',
    });
    photos.push({
      imageId: images[1].id,
      imageUrl: images[1].storagePath,
      rotationDeg: 5 + rng() * 2,
      zone: 'top-right',
      desktopPos: { rightPct: 2, topPct: 10, widthPx: 230, zIndex: 10 },
      mobileOrder: 2,
      mobileRotationDeg: 3,
      tapeStyle: TAPE_STYLES[Math.floor(rng() * TAPE_STYLES.length)],
      tapePosition: 'top-right',
      pinStyle: 'silver-pin',
      stickerEmoji: theme.stickers[1] || '🎂',
    });
    photos.push({
      imageId: images[2].id,
      imageUrl: images[2].storagePath,
      rotationDeg: -4 + rng() * 4,
      zone: 'bottom-left',
      desktopPos: { leftPct: 3, bottomPct: 8, widthPx: 230, zIndex: 10 },
      mobileOrder: 3,
      mobileRotationDeg: 2,
      tapeStyle: theme.tapeStyleDefault,
      tapePosition: 'double-corner',
      pinStyle: 'rose-gold-clip',
      stickerEmoji: theme.stickers[2] || '✨',
    });
  } else if (numImages === 4) {
    const quadrants = [
      { zone: 'top-left' as const, pos: { leftPct: 2, topPct: 6, widthPx: 220, zIndex: 10 }, baseRot: -5 },
      { zone: 'top-right' as const, pos: { rightPct: 2, topPct: 7, widthPx: 220, zIndex: 10 }, baseRot: 5 },
      { zone: 'bottom-left' as const, pos: { leftPct: 3, bottomPct: 7, widthPx: 220, zIndex: 10 }, baseRot: 4 },
      { zone: 'bottom-right' as const, pos: { rightPct: 3, bottomPct: 8, widthPx: 220, zIndex: 10 }, baseRot: -4 },
    ];
    images.forEach((img, idx) => {
      const q = quadrants[idx];
      photos.push({
        imageId: img.id,
        imageUrl: img.storagePath,
        rotationDeg: q.baseRot + (rng() * 4 - 2),
        zone: q.zone,
        desktopPos: q.pos,
        mobileOrder: idx + 1,
        mobileRotationDeg: (idx % 2 === 0 ? -3 : 3) + (rng() * 2 - 1),
        tapeStyle: TAPE_STYLES[Math.floor(rng() * TAPE_STYLES.length)],
        tapePosition: TAPE_POSITIONS[Math.floor(rng() * TAPE_POSITIONS.length)],
        pinStyle: PIN_STYLES[Math.floor(rng() * PIN_STYLES.length)],
        stickerEmoji: theme.stickers[idx % theme.stickers.length],
      });
    });
  } else if (numImages <= 6) {
    const slots = [
      { zone: 'left-flank' as const, pos: { leftPct: 2, topPct: 4, widthPx: 210, zIndex: 10 }, baseRot: -6 },
      { zone: 'left-flank' as const, pos: { leftPct: 4, topPct: 45, widthPx: 200, zIndex: 11 }, baseRot: 4 },
      { zone: 'left-flank' as const, pos: { leftPct: 2, bottomPct: 4, widthPx: 200, zIndex: 10 }, baseRot: -4 },
      { zone: 'right-flank' as const, pos: { rightPct: 2, topPct: 5, widthPx: 210, zIndex: 10 }, baseRot: 5 },
      { zone: 'right-flank' as const, pos: { rightPct: 4, topPct: 46, widthPx: 200, zIndex: 11 }, baseRot: -5 },
      { zone: 'right-flank' as const, pos: { rightPct: 2, bottomPct: 5, widthPx: 200, zIndex: 10 }, baseRot: 4 },
    ];

    images.forEach((img, idx) => {
      const slot = slots[idx];
      photos.push({
        imageId: img.id,
        imageUrl: img.storagePath,
        rotationDeg: slot.baseRot + (rng() * 4 - 2),
        zone: slot.zone,
        desktopPos: slot.pos,
        mobileOrder: idx + 1,
        mobileRotationDeg: (idx % 2 === 0 ? -3 : 3) + (rng() * 2 - 1),
        tapeStyle: TAPE_STYLES[Math.floor(rng() * TAPE_STYLES.length)],
        tapePosition: TAPE_POSITIONS[Math.floor(rng() * TAPE_POSITIONS.length)],
        pinStyle: PIN_STYLES[Math.floor(rng() * PIN_STYLES.length)],
        stickerEmoji: theme.stickers[idx % theme.stickers.length],
      });
    });
  } else {
    // 7 - 15 photos: Flank stacks with clean central corridor
    const zones = [
      // Left Flank
      { leftPct: 1, topPct: 2, widthPx: 195, zIndex: 10, rot: -6 },
      { leftPct: 4, topPct: 27, widthPx: 185, zIndex: 12, rot: 5 },
      { leftPct: 2, topPct: 52, widthPx: 190, zIndex: 10, rot: -5 },
      { leftPct: 4, bottomPct: 2, widthPx: 185, zIndex: 11, rot: 6 },
      // Right Flank
      { rightPct: 1, topPct: 3, widthPx: 195, zIndex: 10, rot: 5 },
      { rightPct: 4, topPct: 28, widthPx: 185, zIndex: 12, rot: -5 },
      { rightPct: 2, topPct: 54, widthPx: 190, zIndex: 10, rot: 4 },
      { rightPct: 4, bottomPct: 3, widthPx: 185, zIndex: 11, rot: -6 },
      // Corner Overlays
      { leftPct: 6, topPct: 14, widthPx: 175, zIndex: 14, rot: 7 },
      { rightPct: 6, topPct: 16, widthPx: 175, zIndex: 14, rot: -7 },
      { leftPct: 5, bottomPct: 16, widthPx: 175, zIndex: 14, rot: -5 },
      { rightPct: 5, bottomPct: 18, widthPx: 175, zIndex: 14, rot: 6 },
      { leftPct: 2, topPct: 75, widthPx: 170, zIndex: 9, rot: 4 },
      { rightPct: 2, topPct: 77, widthPx: 170, zIndex: 9, rot: -4 },
      { leftPct: 3, topPct: 38, widthPx: 175, zIndex: 15, rot: -8 },
    ];

    images.forEach((img, idx) => {
      const slot = zones[idx % zones.length];
      const jitterX = rng() * 1.5 - 0.75;
      const jitterY = rng() * 1.5 - 0.75;
      photos.push({
        imageId: img.id,
        imageUrl: img.storagePath,
        rotationDeg: slot.rot + (rng() * 4 - 2),
        zone: 'orbit',
        desktopPos: {
          ...(slot.leftPct !== undefined ? { leftPct: Math.max(0.5, slot.leftPct + jitterX) } : {}),
          ...(slot.rightPct !== undefined ? { rightPct: Math.max(0.5, slot.rightPct + jitterX) } : {}),
          ...(slot.topPct !== undefined ? { topPct: Math.max(1, slot.topPct + jitterY) } : {}),
          ...(slot.bottomPct !== undefined ? { bottomPct: Math.max(1, slot.bottomPct + jitterY) } : {}),
          widthPx: slot.widthPx,
          zIndex: slot.zIndex,
        },
        mobileOrder: idx + 1,
        mobileRotationDeg: (idx % 2 === 0 ? -3.5 : 3.5) + (rng() * 2 - 1),
        tapeStyle: TAPE_STYLES[Math.floor(rng() * TAPE_STYLES.length)],
        tapePosition: TAPE_POSITIONS[Math.floor(rng() * TAPE_POSITIONS.length)],
        pinStyle: PIN_STYLES[Math.floor(rng() * PIN_STYLES.length)],
        stickerEmoji: theme.stickers[idx % theme.stickers.length],
      });
    });
  }

  // Generate Letter Card Config
  const letterCard: LetterCardConfig = {
    rotationDeg: (rng() * 1.6 - 0.8), // subtle tilt
    paperStyle: theme.cardPaperStyle,
    waxSeal: {
      show: true,
      emoji: theme.stickers[0] || '💌',
      label: 'SEAL OF LOVE',
    },
    postageStamp: {
      show: true,
      location: rng() > 0.5 ? 'top-right' : 'top-left',
      label: theme.stampLabels[Math.floor(rng() * theme.stampLabels.length)],
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    },
  };

  // Generate Decorative Elements in outer margins
  const decorations: DecorationItem[] = [
    {
      id: 'dec-stamp-1',
      type: 'stamp',
      content: theme.stampLabels[0] || 'AIR MAIL ✈️',
      desktopPos: { leftPct: 20, topPct: 3, zIndex: 5 },
      rotationDeg: -10 + rng() * 6,
      scale: 0.95,
      opacity: 0.85,
    },
    {
      id: 'dec-sticker-1',
      type: 'sticker',
      content: theme.stickers[1] || '✨',
      desktopPos: { rightPct: 20, topPct: 4, zIndex: 15 },
      rotationDeg: 15 + rng() * 10,
      scale: 1.25,
      opacity: 0.95,
    },
    {
      id: 'dec-sticker-2',
      type: 'heart',
      content: '💖',
      desktopPos: { leftPct: 21, bottomPct: 5, zIndex: 15 },
      rotationDeg: -10 + rng() * 8,
      scale: 1.2,
      opacity: 0.9,
    },
    {
      id: 'dec-sticker-3',
      type: 'cake',
      content: '🎂',
      desktopPos: { rightPct: 21, bottomPct: 5, zIndex: 15 },
      rotationDeg: 8 + rng() * 10,
      scale: 1.2,
      opacity: 0.9,
    },
  ];

  return {
    seed: actualSeed,
    themeId: theme.id,
    theme,
    photos,
    letterCard,
    decorations,
    generatedAt: new Date().toISOString(),
  };
}
