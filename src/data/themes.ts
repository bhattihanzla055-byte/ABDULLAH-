import { ThemeConfig, ThemePreset } from '../types/platform';

export const THEME_PRESETS: Record<ThemePreset, ThemeConfig> = {
  'classic-gold': {
    id: 'classic-gold',
    name: 'Classic Gold',
    primaryColor: '#C59B27',
    secondaryColor: '#DFBA54',
    accentColor: '#8C6D28',
    bgTone: '#FAF7F2',
    cardBg: '#FFFFFF',
    waxColor: 'from-[#871F2B] via-[#A82A3A] to-[#69141E]',
    envelopeBg: '#F7F2E8',
    description: 'Timeless Mughal elegance with warm imperial gold and ivory accents.'
  },
  'royal-burgundy': {
    id: 'royal-burgundy',
    name: 'Royal Burgundy',
    primaryColor: '#8E1624',
    secondaryColor: '#B82E3E',
    accentColor: '#D4AF37',
    bgTone: '#FDF7F7',
    cardBg: '#FFFFFF',
    waxColor: 'from-[#630E18] via-[#851926] to-[#450810]',
    envelopeBg: '#F8EFF0',
    description: 'Opulent deep crimson and velvet wine shades fit for regal celebrations.'
  },
  'emerald-luxury': {
    id: 'emerald-luxury',
    name: 'Emerald Luxury',
    primaryColor: '#1B5E43',
    secondaryColor: '#2B8361',
    accentColor: '#D4AF37',
    bgTone: '#F4F9F6',
    cardBg: '#FFFFFF',
    waxColor: 'from-[#0E3827] via-[#1B5E43] to-[#082418]',
    envelopeBg: '#EDF5F0',
    description: 'Majestic forest emerald and golden flourishes symbolizing barakah and grace.'
  },
  'soft-rose': {
    id: 'soft-rose',
    name: 'Soft Rose',
    primaryColor: '#C06B78',
    secondaryColor: '#D88A96',
    accentColor: '#B89240',
    bgTone: '#FAF4F5',
    cardBg: '#FFFFFF',
    waxColor: 'from-[#8F3E4C] via-[#B05B69] to-[#692934]',
    envelopeBg: '#F8EEF0',
    description: 'Romantic blush hues, soft peony petals, and delicate champagne accents.'
  },
  'minimal-ivory': {
    id: 'minimal-ivory',
    name: 'Minimal Ivory',
    primaryColor: '#38302B',
    secondaryColor: '#6B5E55',
    accentColor: '#C59B27',
    bgTone: '#FAF8F5',
    cardBg: '#FFFFFF',
    waxColor: 'from-[#423832] via-[#5C4F47] to-[#2B231E]',
    envelopeBg: '#F5F1EB',
    description: 'Modern sophisticated minimalism with clean serif lines and muted parchment tones.'
  }
};

export const themePresets: ThemeConfig[] = Object.values(THEME_PRESETS);
