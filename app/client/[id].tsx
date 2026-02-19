
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
  const theme = colors[colorScheme ?? 'light'];
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
      setSuccessModal({ visible: true, message: `"${newProgram.program_name}" has been generated successfully! It's a ${newProgram.duration_weeks}-week ${newProgram.split_type} program.` });
      // Reload programs after generation
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
            headerStyle: { backgroundColor: theme.card },
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
            headerStyle: { backgroundColor: theme.card },
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
          headerStyle: { backgroundColor: theme.card },
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
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
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
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
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
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <Text style={styles.avatarText}>
                {client.name.charAt(0).toUpperCase()}
              </Text>
            </View>
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
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Height</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>{weightText}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Weight</Text>
            </View>
            {client.body_fat_percentage && (
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.text }]}>
                  {client.body_fat_percentage}%
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Body Fat</Text>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Training Profile</Text>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Experience</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{experienceText}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Goal</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{client.goals}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Frequency</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{frequencyText}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Session Duration</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{durationText}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Equipment</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{client.equipment}</Text>
          </View>

          {client.injuries && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Injuries</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{client.injuries}</Text>
            </View>
          )}

          {client.preferred_exercises && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Preferred Exercises</Text>
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
              style={[styles.generateButton, { backgroundColor: theme.primary }]}
              onPress={handleGenerateProgram}
              disabled={generating}
              activeOpacity={0.8}
            >
              {generating ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <React.Fragment>
                  <IconSymbol
                    ios_icon_name="sparkles"
                    android_material_icon_name="auto-awesome"
                    size={18}
                    color="#FFFFFF"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.generateButtonText}>Generate AI Program</Text>
                </React.Fragment>
              )}
            </TouchableOpacity>
          </View>

          {programs.length === 0 ? (
            <View style={[styles.emptyProgramsCard, { backgroundColor: theme.card }]}>
              <IconSymbol
                ios_icon_name="doc.text"
                android_material_icon_name="description"
                size={48}
                color={theme.textSecondary}
                style={styles.emptyIcon}
              />
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
                  style={[styles.programCard, { backgroundColor: theme.card }]}
                  onPress={() => handleProgramPress(program.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.programHeader}>
                    <View style={styles.programInfo}>
                      <Text style={[styles.programName, { color: theme.text }]}>
                        {program.program_name}
                      </Text>
                      <Text style={[styles.programMeta, { color: theme.textSecondary }]}>
                        {program.split_type}
                      </Text>
                      <Text style={[styles.programMeta, { color: theme.textSecondary }]}>
                        {weeksText}
                      </Text>
                    </View>
                    <IconSymbol
                      ios_icon_name="chevron.right"
                      android_material_icon_name="arrow-forward"
                      size={20}
                      color={theme.textSecondary}
                    />
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  scrollContentAndroid: {
    paddingTop: 48,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  cardHeaderInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clientMeta: {
    fontSize: 14,
    marginBottom: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoLabel: {
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  programsSection: {
    marginTop: 8,
  },
  programsHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyProgramsCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyProgramsText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  programCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  programHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  programInfo: {
    flex: 1,
  },
  programName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  programMeta: {
    fontSize: 13,
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalBox: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  modalButton: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
