
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Platform,
  Modal,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
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

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = `${BACKEND_URL}${path}`;
  console.log(`[API] POST ${url}`, body);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try { const d = await response.json(); msg = d?.error || d?.message || msg; } catch {}
    throw new Error(msg);
  }
  const data = await response.json();
  console.log(`[API] POST ${url} response:`, data);
  return data as T;
}

interface ClientDetails {
  id: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  experience: string;
  goals: string;
  training_frequency: number;
  equipment: string;
  injuries?: string;
  preferred_exercises?: string;
  session_duration: number;
  body_fat_percentage?: number;
  created_at: string;
}

interface WorkoutProgram {
  id: string;
  program_name: string;
  duration_weeks: number;
  split_type: string;
  created_at: string;
}

export default function ClientDetailScreen() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme ?? 'dark'];
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const clientId = Array.isArray(id) ? id[0] : id;
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [errorModal, setErrorModal] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });
  const [successModal, setSuccessModal] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  useEffect(() => {
    console.log('ClientDetailScreen mounted for client:', clientId);
    loadClientData();
  }, [clientId]);

  const loadClientData = async () => {
    try {
      setLoading(true);
      console.log('Fetching client details for:', clientId);
      const [clientData, programsData] = await Promise.all([
        apiGet<ClientDetails>(`/api/clients/${clientId}`),
        apiGet<WorkoutProgram[]>(`/api/clients/${clientId}/programs`),
      ]);
      setClient(clientData);
      setPrograms(programsData);
    } catch (error: any) {
      console.error('Error loading client data:', error);
      setErrorModal({ visible: true, message: error?.message || 'Failed to load client data. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateProgram = async () => {
    console.log('User tapped Generate AI Program button');
    
    try {
      setGenerating(true);
      console.log('Generating AI program for client:', clientId);
      const newProgram = await apiPost<{ id: string; program_name: string; duration_weeks: number; split_type: string; created_at: string }>(
        `/api/clients/${clientId}/generate-program`,
        {}
      );
      console.log('Program generated successfully:', newProgram);
      const successMessage = `"${newProgram.program_name}" has been generated successfully! It's a ${newProgram.duration_weeks}-week ${newProgram.split_type} program.`;
      setSuccessModal({ visible: true, message: successMessage });
      const programsData = await apiGet<WorkoutProgram[]>(`/api/clients/${clientId}/programs`);
      setPrograms(programsData);
    } catch (error: any) {
      console.error('Error generating program:', error);
      setErrorModal({ visible: true, message: error?.message || 'Failed to generate program. Please try again.' });
    } finally {
      setGenerating(false);
    }
  };

  const handleProgramPress = (programId: string) => {
    console.log('User tapped program:', programId);
    router.push(`/program/${programId}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Client Details',
            headerStyle: { backgroundColor: theme.backgroundSecondary },
            headerTintColor: theme.text,
            headerShadowVisible: false,
            headerBackTitle: 'Back',
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  if (!client) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Client Details',
            headerStyle: { backgroundColor: theme.backgroundSecondary },
            headerTintColor: theme.text,
            headerShadowVisible: false,
            headerBackTitle: 'Back',
          }}
        />
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Client not found
          </Text>
        </View>
      </View>
    );
  }

  const experienceText = client.experience.charAt(0).toUpperCase() + client.experience.slice(1);
  const genderText = client.gender.charAt(0).toUpperCase() + client.gender.slice(1);
  const heightText = `${client.height} cm`;
  const weightText = `${client.weight} kg`;
  const frequencyText = `${client.training_frequency}x/week`;
  const durationText = `${client.session_duration} min`;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: client.name,
          headerStyle: { backgroundColor: theme.backgroundSecondary },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          headerBackTitle: 'Back',
        }}
      />

      {/* Error Modal */}
      <Modal
        visible={errorModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setErrorModal({ visible: false, message: '' })}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalBox, { backgroundColor: theme.cardElevated, borderColor: theme.borderLight }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Error</Text>
            <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>
              {errorModal.message}
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.error }]}
              onPress={() => setErrorModal({ visible: false, message: '' })}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={successModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessModal({ visible: false, message: '' })}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalBox, { backgroundColor: theme.cardElevated, borderColor: theme.borderLight }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>🎉 Program Generated!</Text>
            <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>
              {successModal.message}
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.primary }]}
              onPress={() => setSuccessModal({ visible: false, message: '' })}
            >
              <Text style={styles.modalButtonText}>View Programs</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, Platform.OS === 'android' && styles.scrollContentAndroid]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
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
            <View style={styles.cardHeaderInfo}>
              <Text style={[styles.clientName, { color: theme.text }]}>
                {client.name}
              </Text>
              <Text style={[styles.clientMeta, { color: theme.textSecondary }]}>
                {client.age} years old
              </Text>
              <Text style={[styles.clientMeta, { color: theme.textSecondary }]}>
                {genderText}
              </Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>{heightText}</Text>
              <Text style={[styles.statLabel, { color: theme.textTertiary }]}>HEIGHT</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>{weightText}</Text>
              <Text style={[styles.statLabel, { color: theme.textTertiary }]}>WEIGHT</Text>
            </View>
            {client.body_fat_percentage && (
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.text }]}>
                  {client.body_fat_percentage}%
                </Text>
                <Text style={[styles.statLabel, { color: theme.textTertiary }]}>BODY FAT</Text>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Training Profile</Text>
          
          <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>EXPERIENCE</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{experienceText}</Text>
          </View>
          
          <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>GOAL</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{client.goals}</Text>
          </View>
          
          <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>FREQUENCY</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{frequencyText}</Text>
          </View>
          
          <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>SESSION</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{durationText}</Text>
          </View>
          
          <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>EQUIPMENT</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{client.equipment}</Text>
          </View>

          {client.injuries && (
            <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>INJURIES</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{client.injuries}</Text>
            </View>
          )}

          {client.preferred_exercises && (
            <View style={[styles.infoRow, { borderBottomColor: 'transparent' }]}>
              <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>PREFERRED</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{client.preferred_exercises}</Text>
            </View>
          )}
        </View>

        <View style={styles.programsSection}>
          <View style={styles.programsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Workout Programs
            </Text>
            <TouchableOpacity
              onPress={handleGenerateProgram}
              disabled={generating}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[theme.primary, theme.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.generateButton}
              >
                {generating ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <React.Fragment>
                    <IconSymbol
                      ios_icon_name="sparkles"
                      android_material_icon_name="auto-awesome"
                      size={20}
                      color="#FFFFFF"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.generateButtonText}>Generate AI Program</Text>
                  </React.Fragment>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {programs.length === 0 ? (
            <View style={[styles.emptyProgramsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.emptyIconContainer, { backgroundColor: theme.highlight }]}>
                <IconSymbol
                  ios_icon_name="doc.text"
                  android_material_icon_name="description"
                  size={48}
                  color={theme.primary}
                />
              </View>
              <Text style={[styles.emptyProgramsText, { color: theme.textSecondary }]}>
                No programs yet. Generate an AI-powered workout program to get started.
              </Text>
            </View>
          ) : (
            programs.map((program) => {
              const weeksText = `${program.duration_weeks} weeks`;
              
              return (
                <TouchableOpacity
                  key={program.id}
                  style={[styles.programCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                  onPress={() => handleProgramPress(program.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.programHeader}>
                    <View style={styles.programInfo}>
                      <Text style={[styles.programName, { color: theme.text }]}>
                        {program.program_name}
                      </Text>
                      <View style={styles.programMetaRow}>
                        <View style={[styles.programBadge, { backgroundColor: theme.highlight, borderColor: theme.primary }]}>
                          <Text style={[styles.programBadgeText, { color: theme.primary }]}>
                            {program.split_type}
                          </Text>
                        </View>
                        <View style={[styles.programBadge, { backgroundColor: theme.highlight, borderColor: theme.primary }]}>
                          <Text style={[styles.programBadgeText, { color: theme.primary }]}>
                            {weeksText}
                          </Text>
                        </View>
                      </View>
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
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  emptyText: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  scrollContentAndroid: {
    paddingTop: 48,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  cardHeaderInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  clientMeta: {
    fontSize: 15,
    marginBottom: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  programsSection: {
    marginTop: 8,
  },
  programsHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 10,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emptyProgramsCard: {
    borderRadius: 20,
    padding: 36,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyProgramsText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  programCard: {
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
  programHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  programInfo: {
    flex: 1,
  },
  programName: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  programMetaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  programBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  programBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalBox: {
    borderRadius: 24,
    padding: 28,
    width: '100%',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
