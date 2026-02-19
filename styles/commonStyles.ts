
import { StyleSheet } from 'react-native';

// Premium Dark Theme with Vibrant Orange Accents
export const colors = {
  // Light mode (keeping for compatibility, but focusing on dark)
  light: {
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    primary: '#FF6B35', // Vibrant Orange
    secondary: '#FF8C42',
    accent: '#FFA500',
    highlight: '#FFF5F0',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
  },
  // Premium Dark mode - Sophisticated with vibrant orange
  dark: {
    background: '#0A0A0F', // Deep dark background
    backgroundSecondary: '#12121A', // Slightly lighter for depth
    card: '#1A1A24', // Dark card with subtle purple tint
    cardElevated: '#20202E', // Elevated cards
    text: '#FFFFFF', // Pure white for maximum contrast
    textSecondary: '#A0A0B0', // Soft gray-blue for secondary text
    textTertiary: '#6B6B7F', // Muted for tertiary info
    primary: '#FF6B35', // Vibrant orange - main accent
    primaryDark: '#E55A2B', // Darker orange for pressed states
    primaryLight: '#FF8C5A', // Lighter orange for highlights
    secondary: '#FF8C42', // Warm orange gradient
    accent: '#FFA500', // Bright orange accent
    highlight: 'rgba(255, 107, 53, 0.12)', // Orange tint for highlights
    border: '#2A2A38', // Subtle borders
    borderLight: '#35354A', // Lighter borders for emphasis
    error: '#FF4757',
    success: '#2ECC71',
    warning: '#FFA502',
    // Gradient colors
    gradientStart: '#FF6B35',
    gradientEnd: '#FF8C42',
    // Overlay colors
    overlay: 'rgba(10, 10, 15, 0.85)',
    overlayLight: 'rgba(10, 10, 15, 0.6)',
  },
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  button: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  input: {
    borderRadius: 14,
    padding: 18,
    fontSize: 16,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
