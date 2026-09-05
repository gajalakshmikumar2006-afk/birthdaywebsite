import { LetterThemeConfig, TapeStyle } from '@/types';

export const THEMES: Record<string, LetterThemeConfig> = {
  'vintage-scrapbook': {
    id: 'vintage-scrapbook',
    name: 'Vintage Memory Scrapbook',
    description: 'Warm antique parchment, rich rustic kraft tape, vintage postal stamps, and nostalgic sepia warmth.',
    bgGradient: 'bg-gradient-to-br from-[#f7f0e3] via-[#edd8be] to-[#dfc49f]',
    bgPattern: 'grain',
    ambientParticles: 'sparkles',
    cardPaperStyle: 'antique-parchment',
    accentColor: '#8c593b',
    fontClassHeading: 'font-script text-[#4a2a18]',
    fontClassBody: 'font-serif text-[#332219]',
    tapeStyleDefault: 'kraft',
    stampLabels: ['AIR MAIL ✈️', 'SPECIAL DELIVERY', 'BIRTHDAY EDITION', 'WITH LOVE 💌', 'MEMORIES LANE'],
    stickers: ['💌', '✨', '🎂', '🕯️', '🕊️', '📜', '🎞️', '🕰️'],
  },
  'pastel-birthday': {
    id: 'pastel-birthday',
    name: 'Pastel Birthday Dream',
    description: 'Vibrant sweet sunrise pastel gradient, joyful washi ribbons, cute birthday doodles, and celebration confetti.',
    bgGradient: 'bg-gradient-to-br from-[#ffe5ec] via-[#ffc2d1] to-[#e8dff5]',
    bgPattern: 'dots',
    ambientParticles: 'confetti',
    cardPaperStyle: 'pastel-rose',
    accentColor: '#e11d48',
    fontClassHeading: 'font-handwritten text-[#9f1239]',
    fontClassBody: 'font-sans text-[#4c0519]',
    tapeStyleDefault: 'pink-washi',
    stampLabels: ['SWEETEST WISHES ✨', 'HAPPY BIRTHDAY 🎂', 'MAKE A WISH 🌟', 'PARTY TIME 🎉', 'BEST DAY EVER 💖'],
    stickers: ['🎉', '🧁', '💖', '🎈', '🎁', '🍰', '🌸', '🎀'],
  },
  'golden-nostalgia': {
    id: 'golden-nostalgia',
    name: 'Golden Glow & Champagne',
    description: 'Luminous warm champagne ivory with shimmering gold foil accents, metallic borders, and radiant starbursts.',
    bgGradient: 'bg-gradient-to-br from-[#fffdfa] via-[#fef3c7] to-[#fde68a]',
    bgPattern: 'stars',
    ambientParticles: 'sparkles',
    cardPaperStyle: 'cream-cardstock',
    accentColor: '#d97706',
    fontClassHeading: 'font-serif text-[#78350f]',
    fontClassBody: 'font-serif text-[#451a03]',
    tapeStyleDefault: 'gold-foil',
    stampLabels: ['GOLDEN YEAR ⭐', 'CHERISHED MOMENT', 'LIFETIME OF JOY', 'PRICELESS 🥂', 'SHINE BRIGHT ✨'],
    stickers: ['⭐', '🌟', '🥂', '👑', '✨', '⚜️', '☀️', '💛'],
  },
  'midnight-confetti': {
    id: 'midnight-confetti',
    name: 'Midnight Galaxy & Starlight',
    description: 'Deep cosmic violet-indigo twilight making bright polaroids, glowing stardust, and neon confetti pop.',
    bgGradient: 'bg-gradient-to-br from-[#090a1a] via-[#1c1033] to-[#2d0b42]',
    bgPattern: 'stars',
    ambientParticles: 'confetti',
    cardPaperStyle: 'midnight-velvet',
    accentColor: '#f43f5e',
    fontClassHeading: 'font-script text-[#fb7185]',
    fontClassBody: 'font-sans text-[#f8fafc]',
    tapeStyleDefault: 'lavender-washi',
    stampLabels: ['MIDNIGHT MAGIC 🌙', 'CELEBRATE 💫', 'FOREVER YOUNG 🍸', 'NIGHT TO REMEMBER ✨', 'NEON DREAMS 🎆'],
    stickers: ['✨', '🎆', '🌙', '💫', '🎉', '🍸', '💜', '⚡'],
  },
  'botanical-journal': {
    id: 'botanical-journal',
    name: 'Botanical Pressed Florals',
    description: 'Fresh earthy sage green, pressed petals, botanical garden stamps, and organic nostalgic charm.',
    bgGradient: 'bg-gradient-to-br from-[#f0fdf4] via-[#dcfce7] to-[#bbf7d0]',
    bgPattern: 'subtle-lines',
    ambientParticles: 'sparkles',
    cardPaperStyle: 'kraft-pressed',
    accentColor: '#15803d',
    fontClassHeading: 'font-serif text-[#14532d]',
    fontClassBody: 'font-serif text-[#1e293b]',
    tapeStyleDefault: 'mint-washi',
    stampLabels: ['BLOOM & GROW 🌿', 'NATURE NOTES 🍃', 'IN FULL BLOOM 🌸', 'SPECIAL WISHES 🌼', 'GARDEN OF JOY 🌷'],
    stickers: ['🌿', '🌸', '🍃', '🌻', '🌼', '🦋', '🌱', '🌷'],
  },
  'retro-polaroid': {
    id: 'retro-polaroid',
    name: '90s Retro Memory Board',
    description: 'Vivid retro corkboard memory collage with colorful striped washi tapes, nostalgic doodles, and camera stamps.',
    bgGradient: 'bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1]',
    bgPattern: 'grid',
    ambientParticles: 'sparkles',
    cardPaperStyle: 'cream-cardstock',
    accentColor: '#0284c7',
    fontClassHeading: 'font-handwritten text-[#0369a1]',
    fontClassBody: 'font-sans text-[#0f172a]',
    tapeStyleDefault: 'kraft',
    stampLabels: ['PHOTO LOG 📸', 'GOOD VIBES ONLY ✌️', 'SNAP & KEEP 🎞️', 'MEMORY LANE 🌈', 'CLASSIC SHOT ⚡'],
    stickers: ['📸', '✌️', '🌈', '🍦', '⚡', '🎵', '🌼', '💫'],
  },
};

export const DEFAULT_THEME_ID = 'vintage-scrapbook';

export function getTheme(themeId?: string): LetterThemeConfig {
  if (themeId && THEMES[themeId]) {
    return THEMES[themeId];
  }
  return THEMES[DEFAULT_THEME_ID];
}

export function getAllThemeIds(): string[] {
  return Object.keys(THEMES);
}
