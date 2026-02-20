
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';

const BACKEND_URL =
  (Constants.expoConfig?.extra?.backendUrl as string) ||
  (Constants.manifest?.extra?.backendUrl as string) ||
  'https://nkn5cez75xgu5asaygkf9t536w43m4z9.app.specular.dev';

console.log('🔗 Home screen (iOS) backend URL:', BACKEND_URL);

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_TABLET = SCREEN_WIDTH >= 768;
const MAX_CONTENT_WIDTH = 800;

async function apiGet<T>(path: string): Promise<T> {
  const url = `${BACKEND_URL}${path}`;
  console.log(`📡 GET ${url}`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      let msg = `HTTP ${response.status}`;
      try { 
        const d = await response.json(); 
        msg = d?.error || d?.message || msg; 
      } catch (e) {
        console.error('❌ Error parsing response:', e);
      }
      throw new Error(msg);
    }
    const data = await response.json();
    console.log(`✅ GET ${url} success:`, data);
    return data as T;
  } catch (error: any) {
    console.error(`❌ GET ${url} failed:`, error);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

interface Client {
  id: string;
  name: string;
  age: number;
  goals: string;
  training_frequency: number;
  created_at: string;
}

export default function HomeScreen() {
  console.log('🏠 HomeScreen (iOS) rendering - iPad optimized, DARK THEME');
  
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      console.log('🎯 HomeScreen (iOS) focused - Loading clients');
      loadClients();
    }, [])
  );

  const loadClients = async () => {
    console.log('📥 Loading clients...');
    try {
      setLoading(true);
      setError('');
      const data = await apiGet<Client[]>('/api/clients');
      console.log('✅ Clients loaded:', data.length);
      setClients(data);
    } catch (err: any) {
      console.error('❌ Load clients error:', err);
      setError(err?.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = () => {
    console.log('➕ Create client tapped');
    router.push('/create-client');
  };

  const handleClientPress = (clientId: string) => {
    console.log('👤 Client tapped:', clientId);
    router.push(`/client/${clientId}`);
  };

  const bgColor = colors.dark.background;
  const cardColor = colors.dark.card;
  const textColor = colors.dark.text;
  const textSecondaryColor = colors.dark.textSecondary;
  const primaryColor = colors.dark.primary;
  const secondaryColor = colors.dark.secondary;
  const highlightColor = colors.dark.highlight;
  const borderColor = colors.dark.border;
  const errorColor = colors.dark.error;

  const loadingView = (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={primaryColor} />
      <Text style={[styles.statusText, { color: textSecondaryColor }]}>
        Loading clients...
      </Text>
    </View>
  );

  const errorView = (
    <View style={styles.centerContainer}>
      <View style={[styles.iconContainer, { backgroundColor: highlightColor }]}>
        <IconSymbol
          ios_icon_name="exclamationmark.triangle.fill"
          android_material_icon_name="error"
          size={64}
          color={errorColor}
        />
      </View>
      <Text style={[styles.errorTitle, { color: textColor }]}>
        Connection Error
      </Text>
      <Text style={[styles.errorMessage, { color: textSecondaryColor }]}>
        {error}
      </Text>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: primaryColor }]}
        onPress={loadClients}
        activeOpacity={0.8}
      >
        <IconSymbol
          ios_icon_name="arrow.clockwise"
          android_material_icon_name="refresh"
          size={20}
          color="#FFFFFF"
        />
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const emptyView = (
    <View style={styles.centerContainer}>
      <View style={[styles.iconContainer, { backgroundColor: highlightColor }]}>
        <IconSymbol
          ios_icon_name="person.3.fill"
          android_material_icon_name="group"
          size={64}
          color={primaryColor}
        />
      </View>
      <Text style={[styles.emptyTitle, { color: textColor }]}>
        No Clients Yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: textSecondaryColor }]}>
        Create your first client to generate AI-powered workout programs
      </Text>
    </View>
  );

  const clientsView = (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        IS_TABLET && styles.scrollContentTablet,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[IS_TABLET && styles.contentWrapper]}>
        {clients.map((client, index) => {
          const goalText = client.goals;
          const frequencyText = `${client.training_frequency}x/week`;
          
          return (
            <TouchableOpacity
              key={client.id || `client-${index}`}
              style={[styles.clientCard, { backgroundColor: cardColor, borderColor: borderColor }]}
              onPress={() => handleClientPress(client.id)}
              activeOpacity={0.8}
            >
              <View style={styles.clientHeader}>
                <LinearGradient
                  colors={[primaryColor, secondaryColor]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>
                    {client.name.charAt(0).toUpperCase()}
                  </Text>
                </LinearGradient>
                <View style={styles.clientInfo}>
                  <Text style={[styles.clientName, { color: textColor }]}>
                    {client.name}
                  </Text>
                  <Text style={[styles.clientMeta, { color: textSecondaryColor }]}>
                    {client.age} years old
                  </Text>
                </View>
                <View style={[styles.chevronContainer, { backgroundColor: highlightColor }]}>
                  <IconSymbol
                    ios_icon_name="chevron.right"
                    android_material_icon_name="arrow-forward"
                    size={18}
                    color={primaryColor}
                  />
                </View>
              </View>
              <View style={styles.clientDetails}>
                <View style={[styles.badge, { backgroundColor: highlightColor, borderColor: primaryColor }]}>
                  <Text style={[styles.badgeText, { color: primaryColor }]}>
                    {goalText}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: highlightColor, borderColor: primaryColor }]}>
                  <Text style={[styles.badgeText, { color: primaryColor }]}>
                    {frequencyText}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  let contentView;
  if (loading) {
    contentView = loadingView;
  } else if (error) {
    contentView = errorView;
  } else if (clients.length === 0) {
    contentView = emptyView;
  } else {
    contentView = clientsView;
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[
        styles.header,
        IS_TABLET && styles.headerTablet,
      ]}>
        <View style={[IS_TABLET && styles.contentWrapper]}>
          <Text style={[styles.title, { color: textColor }, IS_TABLET && styles.titleTablet]}>
            Your Clients
          </Text>
          <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
            Create personalized workout programs in 60 seconds
          </Text>
        </View>
      </View>

      {contentView}

      <TouchableOpacity
        style={[
          styles.fabContainer,
          IS_TABLET && styles.fabContainerTablet,
        ]}
        onPress={handleCreateClient}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[primaryColor, secondaryColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fab}
        >
          <IconSymbol
            ios_icon_name="plus"
            android_material_icon_name="add"
            size={32}
            color="#FFFFFF"
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTablet: {
    paddingHorizontal: 40,
    paddingTop: 80,
    paddingBottom: 32,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  titleTablet: {
    fontSize: 48,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  statusText: {
    marginTop: 16,
    fontSize: 16,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  scrollContentTablet: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  clientCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  clientMeta: {
    fontSize: 14,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 100,
    right: 24,
  },
  fabContainerTablet: {
    right: Math.max(24, (SCREEN_WIDTH - MAX_CONTENT_WIDTH) / 2 + 24),
  },
  fab: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
});
