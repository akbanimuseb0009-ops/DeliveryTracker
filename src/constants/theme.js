export const COLORS = {
  // Brand Colors
  primary: '#4F46E5', // Modern Indigo
  primaryDark: '#3730A3',
  
  // Status Colors (Premium Palette)
  success: '#10B981', // Emerald
  warning: '#F59E0B', // Amber
  purple: '#8B5CF6',  // Violet
  danger: '#EF4444',  // Rose
  info: '#3B82F6',    // Sky Blue
  
  // Neutrals (Professional Grey Scale)
  background: '#F8FAFC', // Very light blue-grey
  card: '#FFFFFF',
  textPrimary: '#1E293B', // Deep Slate
  textSecondary: '#64748B', // Muted Slate
  border: '#E2E8F0',    // Soft border
  grey: '#94A3B8',
};

export const SHADOWS = {
  small: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  }
};

export const CARD_STYLE = {
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  padding: 20,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: '#F1F5F9',
  ...SHADOWS.small
};
