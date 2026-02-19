
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { colors } from '@/styles/commonStyles';
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

interface ProgramDetails {
  id: string;
  client_id: string;
  program_name: string;
  duration_weeks: number;
  split_type: string;
  program_structure: any;
  created_at: string;
}

export default function ProgramDetailScreen() {
  const colorScheme = useColorScheme();
  const theme = colors.dark;
  const { id } = useLocalSearchParams();
  const programId = Array.isArray(id) ? id[0] : id;
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorModal, setErrorModal] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  useEffect(() => {
    console.log('ProgramDetailScreen mounted for program:', programId);
    loadProgramData();
  }, [programId]);

  const loadProgramData = async () => {
    try {
      setLoading(true);
      console.log('Fetching program details for:', programId);
      const data = await apiGet<ProgramDetails>(`/api/programs/${programId}`);
      setProgram(data);
    } catch (error: any) {
      console.error('Error loading program data:', error);
      setErrorModal({ visible: true, message: error?.message || 'Failed to load program. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Program Details',
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

  if (!program) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Program Details',
            headerStyle: { backgroundColor: theme.backgroundSecondary },
            headerTintColor: theme.text,
            headerShadowVisible: false,
            headerBackTitle: 'Back',
          }}
        />
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Program not found
          </Text>
        </View>
      </View>
    );
  }

  const weeksText = `${program.duration_weeks} weeks`;
  const ps = program.program_structure;

  // Helper to render exercises in a day
  const renderExercises = (exercises: any[]) => {
    if (!exercises || exercises.length === 0) return null;
    return exercises.map((ex: any, idx: number) => (
      <View key={idx} style={[styles.exerciseRow, { borderBottomColor: theme.border }]}>
        <View style={styles.exerciseHeader}>
          <Text style={[styles.exerciseName, { color: theme.text }]}>
            {idx + 1}. {ex.name || ex.exercise_name || ex.exercise || 'Exercise'}
          </Text>
          {ex.muscle_group && (
            <View style={[styles.muscleBadge, { backgroundColor: theme.highlight }]}>
              <Text style={[styles.muscleBadgeText, { color: theme.primary }]}>{ex.muscle_group}</Text>
            </View>
          )}
        </View>
        <View style={styles.exerciseDetails}>
          {ex.sets && <Text style={[styles.exerciseDetail, { color: theme.textSecondary }]}>Sets: <Text style={{ color: theme.text, fontWeight: '600' }}>{ex.sets}</Text></Text>}
          {ex.reps && <Text style={[styles.exerciseDetail, { color: theme.textSecondary }]}>Reps: <Text style={{ color: theme.text, fontWeight: '600' }}>{ex.reps}</Text></Text>}
          {ex.rest && <Text style={[styles.exerciseDetail, { color: theme.textSecondary }]}>Rest: <Text style={{ color: theme.text, fontWeight: '600' }}>{ex.rest}</Text></Text>}
          {ex.tempo && <Text style={[styles.exerciseDetail, { color: theme.textSecondary }]}>Tempo: <Text style={{ color: theme.text, fontWeight: '600' }}>{ex.tempo}</Text></Text>}
          {(ex.rpe || ex.intensity) && <Text style={[styles.exerciseDetail, { color: theme.textSecondary }]}>RPE/Intensity: <Text style={{ color: theme.text, fontWeight: '600' }}>{ex.rpe || ex.intensity}</Text></Text>}
          {ex.notes && <Text style={[styles.exerciseNotes, { color: theme.textSecondary }]}>{ex.notes}</Text>}
        </View>
      </View>
    ));
  };

  // Helper to render a single day/session
  const renderDay = (day: any, dayIdx: number) => {
    const dayName = day.day || day.day_name || day.name || `Day ${dayIdx + 1}`;
    const focus = day.focus || day.muscle_focus || day.type || '';
    const exercises = day.exercises || day.workout || [];
    return (
      <View key={dayIdx} style={[styles.dayCard, { backgroundColor: theme.card }]}>
        <View style={styles.dayHeader}>
          <Text style={[styles.dayTitle, { color: theme.text }]}>{dayName}</Text>
          {focus ? <Text style={[styles.dayFocus, { color: theme.primary }]}>{focus}</Text> : null}
        </View>
        {renderExercises(exercises)}
        {day.notes && <Text style={[styles.dayNotes, { color: theme.textSecondary }]}>{day.notes}</Text>}
      </View>
    );
  };

  // Helper to render weeks/phases
  const renderProgramStructure = () => {
    if (!ps) {
      return (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
            No program structure available.
          </Text>
        </View>
      );
    }

    // Try different structures the AI might return
    const phases = ps.phases || ps.weeks || ps.program || ps.schedule || null;

    if (Array.isArray(phases)) {
      return phases.map((phase: any, phaseIdx: number) => {
        const phaseName = phase.phase || phase.name || phase.week_range || `Phase ${phaseIdx + 1}`;
        const phaseGoal = phase.goal || phase.focus || phase.description || '';
        const days = phase.days || phase.sessions || phase.workouts || [];
        const weekRange = phase.weeks || phase.week_range || phase.duration || '';

        return (
          <View key={phaseIdx} style={styles.phaseSection}>
            <View style={[styles.phaseHeader, { backgroundColor: theme.primary }]}>
              <Text style={styles.phaseName}>{phaseName}</Text>
              {weekRange ? <Text style={styles.phaseWeeks}>{weekRange}</Text> : null}
              {phaseGoal ? <Text style={styles.phaseGoal}>{phaseGoal}</Text> : null}
            </View>
            {Array.isArray(days) && days.map((day: any, dayIdx: number) => renderDay(day, dayIdx))}
            {phase.notes && (
              <View style={[styles.card, { backgroundColor: theme.card }]}>
                <Text style={[styles.phaseNotes, { color: theme.textSecondary }]}>{phase.notes}</Text>
              </View>
            )}
          </View>
        );
      });
    }

    // If it's a flat structure with days directly
    const directDays = ps.days || ps.sessions || ps.workouts || [];
    if (Array.isArray(directDays) && directDays.length > 0) {
      return directDays.map((day: any, dayIdx: number) => renderDay(day, dayIdx));
    }

    // Fallback: show raw JSON in a readable format
    return (
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Program Details</Text>
        <Text style={[styles.rawJson, { color: theme.textSecondary }]}>
          {JSON.stringify(ps, null, 2)}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: program.program_name,
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
          <View style={[styles.modalBox, { backgroundColor: theme.cardElevated }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Error</Text>
            <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>
              {errorModal.message}
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.primary }]}
              onPress={() => setErrorModal({ visible: false, message: '' })}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, Platform.OS === 'android' && styles.scrollContentAndroid]}
        showsVerticalScrollIndicator={false}
      >
        {/* Program Overview Card */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.programName, { color: theme.text }]}>
            {program.program_name}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.metaBadge, { backgroundColor: theme.highlight }]}>
              <Text style={[styles.metaBadgeText, { color: theme.primary }]}>{program.split_type}</Text>
            </View>
            <View style={[styles.metaBadge, { backgroundColor: theme.highlight }]}>
              <Text style={[styles.metaBadgeText, { color: theme.primary }]}>{weeksText}</Text>
            </View>
          </View>
          {ps?.overview && (
            <Text style={[styles.overviewText, { color: theme.textSecondary }]}>{ps.overview}</Text>
          )}
          {ps?.notes && !ps?.overview && (
            <Text style={[styles.overviewText, { color: theme.textSecondary }]}>{ps.notes}</Text>
          )}
        </View>

        {/* Program Structure */}
        {renderProgramStructure()}
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
  programName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  programMeta: {
    fontSize: 14,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  metaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  metaBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  overviewText: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
  },
  phaseSection: {
    marginBottom: 20,
  },
  phaseHeader: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  phaseName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  phaseWeeks: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginBottom: 2,
  },
  phaseGoal: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },
  phaseNotes: {
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  dayCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  dayFocus: {
    fontSize: 13,
    fontWeight: '600',
  },
  dayNotes: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    marginTop: 8,
  },
  exerciseRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  muscleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  muscleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  exerciseDetail: {
    fontSize: 13,
  },
  exerciseNotes: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    marginTop: 4,
    width: '100%',
  },
  rawJson: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
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
