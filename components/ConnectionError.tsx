
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from './IconSymbol';
import Constants from 'expo-constants';

interface ConnectionErrorProps {
  message: string;
  onRetry: () => void;
  theme: any;
}

export function ConnectionError({ message, onRetry, theme }: ConnectionErrorProps) {
  const backendUrl = Constants.expoConfig?.extra?.backendUrl || 'Not configured';
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.error + '20' }]}>
        <IconSymbol
          ios_icon_name="wifi.slash"
          android_material_icon_name="wifi-off"
          size={64}
          color={theme.error}
        />
      </View>
      
      <Text style={[styles.title, { color: theme.text }]}>
        Connection Error
      </Text>
      
      <Text style={[styles.message, { color: theme.textSecondary }]}>
        {message}
      </Text>
      
      <View style={[styles.infoBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>
          Backend URL:
        </Text>
        <Text style={[styles.infoValue, { color: theme.text }]} numberOfLines={2}>
          {backendUrl}
        </Text>
      </View>
      
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: theme.primary }]}
        onPress={onRetry}
        activeOpacity={0.8}
      >
        <View style={styles.buttonIcon}>
          <IconSymbol
            ios_icon_name="arrow.clockwise"
            android_material_icon_name="refresh"
            size={20}
            color="#FFFFFF"
          />
        </View>
        <Text style={styles.retryButtonText}>Retry Connection</Text>
      </TouchableOpacity>
      
      <Text style={[styles.helpText, { color: theme.textTertiary }]}>
        If this problem persists, the backend server may be offline or restarting.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  infoBox: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 13,
    fontFamily: 'monospace',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  helpText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
