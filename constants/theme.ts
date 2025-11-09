/**
 * Enhanced theme with glassmorphism, modern colors, and transparent card styles
 */

import { Platform } from 'react-native';

const tintColorLight = '#6366F1';
const tintColorDark = '#A5F3FC';
const accentColorLight = '#EC4899';
const accentColorDark = '#F472B6';

export const Colors = {
  light: {
    text: '#1F2937',
    textSecondary: '#6B7280',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceHover: '#F3F4F6',
    tint: tintColorLight,
    accent: accentColorLight,
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    error: '#DC2626',
    success: '#10B981',
    warning: '#F59E0B',
    glass: 'rgba(255, 255, 255, 0.7)',
    glassLight: 'rgba(255, 255, 255, 0.5)',
  },
  dark: {
    text: '#F3F4F6',
    textSecondary: '#D1D5DB',
    background: '#111827',
    surface: '#1F2937',
    surfaceHover: '#374151',
    tint: tintColorDark,
    accent: accentColorDark,
    icon: '#D1D5DB',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorDark,
    error: '#EF4444',
    success: '#34D399',
    warning: '#FBBF24',
    glass: 'rgba(31, 41, 55, 0.7)',
    glassLight: 'rgba(31, 41, 55, 0.5)',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
