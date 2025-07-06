export const COLORS = {
  primary: '#000000',           // 純黒
  secondary: '#666666',         // ダークグレー
  background: '#FAFAFA',        // オフホワイト背景
  surface: '#FFFFFF',           // 純白カード
  text: '#212121',              // チャコール文字
  textSecondary: '#9E9E9E',     // ライトグレー文字
  border: '#E0E0E0',            // ライトグレー境界線
  rating: '#FFB000',            // ゴールド星
  error: '#424242',             // ダークグレーエラー
  success: '#757575',           // グレー成功
  shadow: 'rgba(0, 0, 0, 0.08)' // 繊細なシャドウ
};

export const FONTS = {
  regular: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  bold: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  light: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const BORDER_RADIUS = {
  sm: 2,
  md: 6,
  lg: 12,
  xl: 16,
  full: 999
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  }
};