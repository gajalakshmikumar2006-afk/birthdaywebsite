import { LetterThemeConfig, TapeStyle } from '@/types';

export const THEMES: Record<string, LetterThemeConfig> = {
  'vintage-scrapbook': {
    id: 'vintage-scrapbook',
    name: 'Vintage Memory Scrapbook',
    description: 'Warm aged parchment, rustic kraft tape, antique postal stamps, and nostalgic warmth.',
    bgGradient: 'bg-gradient-to-br from-[#f6efe2] via-[#eddcc4] to-[#e4cbab]',
    bgPattern: 'grain',
    ambientParticles: 'sparkles',
    cardPaperStyle: 'antique-parchment',
    accentColor: '#8c593b',
    fontClassHeading: 'font-script text-[#5a3a29]',
    fontClassBody: 'font-serif text-[#3e2c22]',
    tapeStyleDefault: 'kraft',
    stampLabels: ['AIR MAIL', 'SPECIAL DELIVERY', 'BIRTHDAY EDITION', 'WITH LOVE', 'MEMORIES 1990s'],
    stickers: ['💌', '✨', '🎂', '🕯️', '🕊️', '📜', '🎞️', '🕰️'],
  },
  'pastel-birthday': {
    id: 'pastel-birthday',
    name: 'Pastel Birthday Dream',
    description: 'Soft joyful pastel hues, washi tape ribbons, cute birthday stickers, and playful celebration.',
    bgGradient: 'bg-gradient-to-br from-[#fff0f5] via-[#ffe4e1] to-[#e6e6fa]',
    bgPattern: 'dots',
    ambientParticles: 'confetti',
    cardPaperStyle: 'pastel-rose',
    accentColor: '#db2777',
    fontClassHeading: 'font-handwritten text-[#9d174d]',
    fontClassBody: 'font-sans text-[#4c1d35]',
    tapeStyleDefault: 'pink-washi',
    stampLabels: ['SWEET WISHES', 'HAPPY BIRTHDAY', 'MAKE A WISH', 'CELEBRATE', 'BEST DAY EVER'],
    stickers: ['🎉', '🧁', '💖', '🎈', '🎁', '🍰', '🌸', '🎀'],
  },
  'golden-nostalgia': {
    id: 'golden-nostalgia',
    name: 'Golden Glow & Candlelight',
    description: 'Rich warm ivory and golden candlelight tones with metallic accents and starbursts.',
    bgGradient: 'bg-gradient-to-br from-[#fefbf3] via-[#fbf3d5] to-[#f4e29f]',
    bgPattern: 'stars',
    ambientParticles: 'sparkles',
    cardPaperStyle: 'cream-cardstock',
    accentColor: '#b45309',
    fontClassHeading: 'font-serif text-[#78350f]',
    fontClassBody: 'font-serif text-[#451a03]',
    tapeStyleDefault: 'gold-foil',
    stampLabels: ['GOLDEN YEAR', 'CHERISHED', 'LIFETIME OF JOY', 'PRICELESS', 'SHINE ON'],
    stickers: ['⭐', '🌟', '🥂', '👑', '✨', '⚜️', '☀️', '💛'],
  },
  'midnight-confetti': {
    id: 'midnight-confetti',
    name: 'Midnight Starlight Celebration',
    description: 'Deep midnight twilight backdrop making bright polaroid memories and confetti glow.',
    bgGradient: 'bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#311042]',
    bgPattern: 'stars',
    ambientParticles: 'confetti',
    cardPaperStyle: 'midnight-velvet',
    accentColor: '#ec4899',
    fontClassHeading: 'font-script text-[#f472b6]',
    fontClassBody: 'font-sans text-[#f1f5f9]',
    tapeStyleDefault: 'lavender-washi',
    stampLabels: ['MIDNIGHT MAGIC', 'PARTY TIME', 'FOREVER YOUNG', 'NIGHT TO REMEMBER', 'NEON VIBES'],
    stickers: ['✨', '🎆', '🌙', '💫', '🎉', '🍸', '💜', '⚡'],
  },
  'botanical-journal': {
    id: 'botanical-journal',
    name: 'Botanical Pressed Florals',
    description: 'Earthy sage green, pressed petals, botanical stamps, and gentle garden nostalgia.',
    bgGradient: 'bg-gradient-to-br from-[#f4f7f4] via-[#e2ebe2] to-[#cbdcd0]',
    bgPattern: 'subtle-lines',
    ambientParticles: 'sparkles',
    cardPaperStyle: 'kraft-pressed',
    accentColor: '#2d6a4f',
    fontClassHeading: 'font-serif text-[#1b4332]',
    fontClassBody: 'font-serif text-[#2d3748]',
    tapeStyleDefault: 'mint-washi',
    stampLabels: ['BLOOM & GROW', 'NATURE NOTES', 'IN FULL BLOOM', 'ORGANIC WISHES', 'EARTHLY JOY'],
    stickers: ['🌿', '🌸', '🍃', '🌻', '🌼', '🦋', '🌱', '🌷'],
  },
  'retro-polaroid': {
    id: 'retro-polaroid',
    name: '90s Retro Memory Board',
    description: 'Classic photo-card collage with colorful washi tape strips, doodle stickers, and pins.',
    bgGradient: 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]',
    bgPattern: 'grid',
    ambientParticles: 'sparkles',
    cardPaperStyle: 'cream-cardstock',
    accentColor: '#0284c7',
    fontClassHeading: 'font-handwritten text-[#0369a1]',
    fontClassBody: 'font-sans text-[#1e293b]',
    tapeStyleDefault: 'kraft',
    stampLabels: ['PHOTO LOG', 'GOOD TIMES', 'SNAP & KEEP', 'MEMORY LANE', 'CLASSIC SHOT'],
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
