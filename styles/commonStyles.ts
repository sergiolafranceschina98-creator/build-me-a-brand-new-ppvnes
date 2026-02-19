
import { StyleSheet } from 'react-native';

// AI Workout Builder Color Theme - Professional fitness app colors
export const colors = {
  // Light mode
  light: {
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    primary: '#3B82F6', // Blue - trust and professionalism
    secondary: '#10B981', // Green - health and growth
    accent: '#F59E0B', // Amber - energy and motivation
    highlight: '#EFF6FF', // Light blue highlight
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
  },
  // Dark mode
  dark: {
    background: '#0F172A',
    card: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    primary: '#60A5FA',
    secondary: '#34D399',
    accent: '#FBBF24',
    highlight: '#1E3A8A',
    border: '#334155',
    error: '#F87171',
    success: '#34D399',
  },
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
});
