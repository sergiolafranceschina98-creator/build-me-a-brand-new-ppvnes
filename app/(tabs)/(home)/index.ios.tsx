
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';

const BACKEND_URL =
  (Constants.expoConfig?.extra?.backendUrl as string) ||
  'https://nkn5cez75xgu5asaygkf9t536w43m4z9.app.specular.dev';

async function apiGet<T>(path: string): Promise<T> {
  const url = `${BACKEND_URL}${path}`;
  console.log(`[API] GET ${url}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try { const d = await response.json(); msg = d?.error || d?.message || msg; } catch {}
    throw new Error(msg);
  }
  const data = await response.json();
  console.log(`[API] GET ${url} response:`, data);
  return data as T;
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
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme ?? 'dark'];
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      console.log('HomeScreen focused - fetching clients');
      loadClients();
    }, [])
  );

  const loadClients = async () => {
    try {
      setLoading(true);
      console.log('Fetching clients from API');
      const data = await apiGet<Client[]>('/api/clients');
      setClients(data);
    } catch (error: any) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = () => {
    console.log('User tapped Create New Client button');
    router.push('/create-client');
  };

  const handleClientPress = (clientId: string) => {
    console.log('User tapped client:', clientId);
    router.push(`/client/${clientId}`);
  };

  const emptyStateView = (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIconContainer, { backgroundColor: theme.highlight }]}>
        <IconSymbol
          ios_icon_name="person.3.fill"
          android_material_icon_name="group"
          size={64}
          color={theme.primary}
        />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        No Clients Yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        Create your first client profile to generate AI-powered workout programs in under 60 seconds
      </Text>
    </View>
  );

  const clientsList = (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {clients.map((client) => {
        const goalText = client.goals;
        const frequencyText = `${client.training_frequency}x/week`;
        
        return (
          <TouchableOpacity
            key={client.id}
            style={[styles.clientCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => handleClientPress(client.id)}
            activeOpacity={0.8}
          >
            <View style={styles.clientHeader}>
              <LinearGradient
                colors={[theme.primary, theme.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {client.name.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
              <View style={styles.clientInfo}>
                <Text style={[styles.clientName, { color: theme.text }]}>
                  {client.name}
                </Text>
                <Text style={[styles.clientMeta, { color: theme.textSecondary }]}>
                  {client.age} years old
                </Text>
              </View>
              <View style={[styles.chevronContainer, { backgroundColor: theme.highlight }]}>
                <IconSymbol
                  ios_icon_name="chevron.right"
                  android_material_icon_name="arrow-forward"
                  size={18}
                  color={theme.primary}
                />
              </View>
            </View>
            <View style={styles.clientDetails}>
              <View style={[styles.badge, { backgroundColor: theme.highlight, borderColor: theme.primary }]}>
                <Text style={[styles.badgeText, { color: theme.primary }]}>
                  {goalText}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: theme.highlight, borderColor: theme.primary }]}>
                <Text style={[styles.badgeText, { color: theme.primary }]}>
                  {frequencyText}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'AI Workout Builder',
          headerStyle: { backgroundColor: theme.backgroundSecondary },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Your Clients
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Create personalized workout programs in under 60 seconds
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : clients.length === 0 ? (
        emptyStateView
      ) : (
        clientsList
      )}

      <TouchableOpacity
        style={styles.fabContainer}
        onPress={handleCreateClient}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
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
    paddingTop: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
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
