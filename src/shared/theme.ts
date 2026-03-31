export const theme = {
  colors: {
    primary: '#0D9488', // Deep Teal
    secondary: '#D97706', // Golden Amber
    surface: '#FFFFFF',
    background: '#F8FAFC',
    text: '#0F172A',
    textSecondary: '#64728C',
    accent: '#14B8A6',
    danger: '#EF4444',
    success: '#22C55E',
    glass: 'rgba(255, 255, 255, 0.8)',
    glassDark: 'rgba(15, 23, 42, 0.8)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  roundness: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 32,
    full: 9999,
  },
  fonts: {
    regular: 'System',
    bold: 'System-Bold',
    quran: 'Me Quran', // Proposed Arabic font
  }
};

export type AppTheme = typeof theme;
