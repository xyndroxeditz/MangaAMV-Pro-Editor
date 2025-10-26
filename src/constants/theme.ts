// Color Palette
export const COLORS = {
  // Primary
  PRIMARY: '#FF2D95', // Hot Pink
  PRIMARY_DARK: '#D91C73',
  PRIMARY_LIGHT: '#FF5CAD',
  
  // Background
  BACKGROUND: '#000000',
  BACKGROUND_SECONDARY: '#121212',
  BACKGROUND_TERTIARY: '#1E1E1E',
  
  // Surface
  SURFACE: '#2A2A2A',
  SURFACE_LIGHT: '#3A3A3A',
  
  // Text
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#B0B0B0',
  TEXT_DISABLED: '#666666',
  
  // Accent Colors
  CYAN: '#00D9FF',
  PURPLE: '#9D4EDD',
  YELLOW: '#FFD60A',
  GREEN: '#06FFA5',
  ORANGE: '#FF6B35',
  RED: '#FF0054',
  
  // UI Elements
  BORDER: '#3A3A3A',
  DIVIDER: '#2A2A2A',
  OVERLAY: 'rgba(0, 0, 0, 0.7)',
  
  // Status
  SUCCESS: '#06FFA5',
  WARNING: '#FFD60A',
  ERROR: '#FF0054',
  INFO: '#00D9FF',
};

// Typography
export const TYPOGRAPHY = {
  FONT_FAMILY: {
    REGULAR: 'System',
    MEDIUM: 'System',
    BOLD: 'System',
  },
  FONT_SIZE: {
    XS: 10,
    SM: 12,
    MD: 14,
    LG: 16,
    XL: 20,
    XXL: 24,
    XXXL: 32,
  },
  LINE_HEIGHT: {
    SM: 16,
    MD: 20,
    LG: 24,
    XL: 28,
  },
};

// Spacing
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
};

// Border Radius
export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  ROUND: 999,
};

// Shadow
export const SHADOW = {
  SMALL: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  LARGE: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 8,
  },
};

// Layout
export const LAYOUT = {
  TOOLBAR_HEIGHT: 56,
  BOTTOM_NAV_HEIGHT: 60,
  TIMELINE_HEIGHT: 200,
  HEADER_HEIGHT: 56,
};

// Animation
export const ANIMATION = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
};

// Aspect Ratios
export const ASPECT_RATIOS = {
  '16:9': { width: 16, height: 9 },
  '9:16': { width: 9, height: 16 },
  '1:1': { width: 1, height: 1 },
  '4:3': { width: 4, height: 3 },
  '21:9': { width: 21, height: 9 },
};

// Export Presets
export const EXPORT_PRESETS = {
  DRAFT: { width: 1280, height: 720, fps: 30, bitrate: '3M' },
  HD: { width: 1920, height: 1080, fps: 60, bitrate: '8M' },
  '4K': { width: 3840, height: 2160, fps: 60, bitrate: '20M' },
  VERTICAL: { width: 1080, height: 1920, fps: 60, bitrate: '8M' },
};
