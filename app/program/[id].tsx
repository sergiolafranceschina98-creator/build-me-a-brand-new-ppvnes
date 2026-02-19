
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
  console.log(`[PROGRAM] GET ${url}`);
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
  console.log(`[PROGRAM] GET ${url} response received, structure keys:`, Object.keys(data.program_structure || {}));
  console.log(`[PROGRAM] Full program data:`, JSON.stringify(data, null, 2));
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
    console.log('[PROGRAM] ProgramDetailScreen mounted for program:', programId);
    loadProgramData();
  }, [programId]);

  const loadProgramData = async () => {
    try {
      setLoading(true);
      console.log('[PROGRAM] Fetching program details for:', programId);
      const data = await apiGet<ProgramDetails>(`/api/programs/${programId}`);
      console.log('[PROGRAM] Program loaded successfully');
      console.log('[PROGRAM] Program structure type:', typeof data.program_structure);
      console.log('[PROGRAM] Program structure is array?', Array.isArray(data.program_structure));
      const structureKeys = data.program_structure ? Object.keys(data.program_structure) : [];
      console.log('[PROGRAM] Program structure keys:', structureKeys);
      console.log('[PROGRAM] Program structure has content?', structureKeys.length > 0 ? 'YES' : 'NO - empty object, program may need regeneration');
      setProgram(data);
    } catch (error: any) {
      console.error('[PROGRAM] Error loading program data:', error);
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
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading program...</Text>
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

  console.log('[PROGRAM] Rendering program structure, ps:', ps ? 'exists' : 'null');
  console.log('[PROGRAM] ps.phases exists?', ps?.phases ? 'yes' : 'no');

  // Helper to render exercises in a day
  const renderExercises = (exercises: any[]) => {
    console.log('[PROGRAM] renderExercises called with:', exercises?.length || 0, 'exercises');
    if (!exercises || exercises.length === 0) {
      console.log('[PROGRAM] No exercises to render');
      return (
        <Text style={[styles.noExercisesText, { color: theme.textSecondary }]}>
          No exercises defined for this day
        </Text>
      );
    }
    return exercises.map((ex: any, idx: number) => {
      const exerciseName = ex.exerciseName || ex.name || ex.exercise_name || ex.exercise || 'Exercise';
      const sets = ex.sets || '';
      const reps = ex.reps || '';
      const rest = ex.restSeconds ? `${ex.restSeconds}s` : (ex.rest || '');
      const tempo = ex.tempo || '';
      const rpe = ex.rpeOrIntensity || ex.rpe || ex.intensity || '';
      const muscleGroup = ex.muscle_group || ex.muscleGroup || '';
      const notes = ex.notes || '';
      
      console.log('[PROGRAM] Rendering exercise:', exerciseName);
      
      return (
        <View key={idx} style={[styles.exerciseRow, { borderBottomColor: theme.border }]}>
          <View style={styles.exerciseHeader}>
            <Text style={[styles.exerciseName, { color: theme.text }]}>
              {idx + 1}. {exerciseName}
            </Text>
            {muscleGroup && (
              <View style={[styles.muscleBadge, { backgroundColor: theme.highlight }]}>
                <Text style={[styles.muscleBadgeText, { color: theme.primary }]}>{muscleGroup}</Text>
              </View>
            )}
          </View>
          <View style={styles.exerciseDetails}>
            {sets && (
              <Text style={[styles.exerciseDetail, { color: theme.textSecondary }]}>
                Sets: <Text style={{ color: theme.text, fontWeight: '600' }}>{sets}</Text>
              </Text>
            )}
            {reps && (
              <Text style={[styles.exerciseDetail, { color: theme.textSecondary }]}>
                Reps: <Text style={{ color: theme.text, fontWeight: '600' }}>{reps}</Text>
              </Text>
            )}
            {rest && (
              <Text style={[styles.exerciseDetail, { color: theme.textSecondary }]}>
                Rest: <Text style={{ color: theme.text, fontWeight: '600' }}>{rest}</Text>
              </Text>
            )}
            {tempo && (
              <Text style={[styles.exerciseDetail, { color: theme.textSecondary }]}>
                Tempo: <Text style={{ color: theme.text, fontWeight: '600' }}>{tempo}</Text>
              </Text>
            )}
            {rpe && (
              <Text style={[styles.exerciseDetail, { color: theme.textSecondary }]}>
                RPE: <Text style={{ color: theme.text, fontWeight: '600' }}>{rpe}</Text>
              </Text>
            )}
            {notes && (
              <Text style={[styles.exerciseNotes, { color: theme.textSecondary }]}>{notes}</Text>
            )}
          </View>
        </View>
      );
    });
  };

  // Helper to render weeks/phases
  const renderProgramStructure = () => {
    console.log('[PROGRAM] renderProgramStructure called');
    
    // Check if program_structure is empty or null
    if (!ps || Object.keys(ps).length === 0) {
      console.log('[PROGRAM] Program structure is empty or null');
      return (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>⚠️ Program Data Unavailable</Text>
          <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
            This program was generated before a recent update and its workout details could not be retrieved.
          </Text>
          <Text style={[styles.placeholderText, { color: theme.textSecondary, marginTop: 10 }]}>
            Please go back to the client profile and tap <Text style={{ color: theme.primary, fontWeight: '700' }}>"Generate AI Program"</Text> to create a new program with full workout details.
          </Text>
        </View>
      );
    }

    console.log('[PROGRAM] Program structure exists, checking for phases...');
    
    // Try different structures the AI might return
    const phases = ps.phases || ps.weeks || ps.program || ps.schedule || null;

    console.log('[PROGRAM] Phases found?', phases ? 'yes' : 'no');
    console.log('[PROGRAM] Phases is array?', Array.isArray(phases));
    console.log('[PROGRAM] Phases length:', phases?.length || 0);

    if (Array.isArray(phases) && phases.length > 0) {
      console.log('[PROGRAM] Rendering', phases.length, 'phases');
      return phases.map((phase: any, phaseIdx: number) => {
        const phaseName = phase.phaseName || phase.phase || phase.name || phase.week_range || `Phase ${phaseIdx + 1}`;
        const phaseGoal = phase.goal || phase.focus || phase.description || '';
        
        console.log('[PROGRAM] Rendering phase:', phaseName);
        
        // Handle nested weeks structure
        const weeks = phase.weeks || [];
        
        console.log('[PROGRAM] Phase has', weeks.length, 'weeks');
        
        return (
          <View key={phaseIdx} style={styles.phaseSection}>
            <View style={[styles.phaseHeader, { backgroundColor: theme.primary }]}>
              <Text style={styles.phaseName}>{phaseName}</Text>
              {weeks.length > 0 && (
                <Text style={styles.phaseWeeks}>{weeks.length} weeks</Text>
              )}
              {phaseGoal && <Text style={styles.phaseGoal}>{phaseGoal}</Text>}
            </View>
            
            {/* Render weeks */}
            {weeks.map((week: any, weekIdx: number) => {
              const weekNumber = week.weekNumber || weekIdx + 1;
              const weekPhase = week.phase || '';
              const weekFocus = week.weeklyFocus || week.focus || '';
              const workoutDays = week.workoutDays || week.days || week.sessions || [];
              
              console.log('[PROGRAM] Rendering week', weekNumber, 'with', workoutDays.length, 'days');
              
              return (
                <View key={weekIdx} style={styles.weekSection}>
                  <View style={[styles.weekHeader, { backgroundColor: theme.backgroundSecondary }]}>
                    <Text style={[styles.weekTitle, { color: theme.text }]}>Week {weekNumber}</Text>
                    {weekPhase && <Text style={[styles.weekPhase, { color: theme.primary }]}>{weekPhase}</Text>}
                  </View>
                  {weekFocus && (
                    <Text style={[styles.weekFocus, { color: theme.textSecondary }]}>{weekFocus}</Text>
                  )}
                  
                  {/* Render workout days */}
                  {Array.isArray(workoutDays) && workoutDays.map((day: any, dayIdx: number) => {
                    const dayNumber = dayIdx + 1;
                    const dayLabel = `Day ${dayNumber}`;
                    const focus = day.focus || day.muscle_focus || day.type || '';
                    const exercises = day.exercises || day.workout || [];
                    
                    console.log('[PROGRAM] Rendering day:', dayLabel, 'with', exercises.length, 'exercises');
                    
                    return (
                      <View key={dayIdx} style={[styles.dayCard, { backgroundColor: theme.card }]}>
                        <View style={styles.dayHeader}>
                          <Text style={[styles.dayTitle, { color: theme.text }]}>{dayLabel}</Text>
                          {focus && <Text style={[styles.dayFocus, { color: theme.primary }]}>{focus}</Text>}
                        </View>
                        {renderExercises(exercises)}
                        {day.notes && <Text style={[styles.dayNotes, { color: theme.textSecondary }]}>{day.notes}</Text>}
                      </View>
                    );
                  })}
                </View>
              );
            })}
            
            {phase.notes && (
              <View style={[styles.card, { backgroundColor: theme.card }]}>
                <Text style={[styles.phaseNotes, { color: theme.textSecondary }]}>{phase.notes}</Text>
              </View>
            )}
          </View>
        );
      });
    }

    console.log('[PROGRAM] No phases array found, checking for direct days...');

    // If it's a flat structure with days directly
    const directDays = ps.days || ps.sessions || ps.workouts || [];
    if (Array.isArray(directDays) && directDays.length > 0) {
      console.log('[PROGRAM] Rendering', directDays.length, 'direct days');
      return directDays.map((day: any, dayIdx: number) => {
        const dayNumber = dayIdx + 1;
        const dayLabel = `Day ${dayNumber}`;
        const focus = day.focus || day.muscle_focus || day.type || '';
        const exercises = day.exercises || day.workout || [];
        return (
          <View key={dayIdx} style={[styles.dayCard, { backgroundColor: theme.card }]}>
            <View style={styles.dayHeader}>
              <Text style={[styles.dayTitle, { color: theme.text }]}>{dayLabel}</Text>
              {focus ? <Text style={[styles.dayFocus, { color: theme.primary }]}>{focus}</Text> : null}
            </View>
            {renderExercises(exercises)}
            {day.notes && <Text style={[styles.dayNotes, { color: theme.textSecondary }]}>{day.notes}</Text>}
          </View>
        );
      });
    }

    console.log('[PROGRAM] No recognizable structure found, showing raw JSON');

    // Fallback: show raw JSON in a readable format
    return (
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Program Details (Raw)</Text>
        <Text style={[styles.debugText, { color: theme.error }]}>
          Unable to parse program structure. Showing raw data:
        </Text>
        <ScrollView horizontal style={styles.rawJsonScroll}>
          <Text style={[styles.rawJson, { color: theme.textSecondary }]}>
            {JSON.stringify(ps, null, 2)}
          </Text>
        </ScrollView>
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
          headerRight: () => (
            <TouchableOpacity
              onPress={loadProgramData}
              style={{ marginRight: 12, padding: 8 }}
              activeOpacity={0.7}
            >
              <Text style={{ color: theme.primary, fontSize: 14, fontWeight: '600' }}>Refresh</Text>
            </TouchableOpacity>
          ),
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
          {ps?.progressionStrategy && (
            <View style={[styles.strategyBox, { backgroundColor: theme.highlight, borderColor: theme.primary }]}>
              <Text style={[styles.strategyLabel, { color: theme.primary }]}>📈 Progression Strategy</Text>
              <Text style={[styles.strategyText, { color: theme.textSecondary }]}>{ps.progressionStrategy}</Text>
            </View>
          )}
          {ps?.volumeDistribution && (
            <View style={[styles.strategyBox, { backgroundColor: theme.highlight, borderColor: theme.primary }]}>
              <Text style={[styles.strategyLabel, { color: theme.primary }]}>⚖️ Volume Distribution</Text>
              <Text style={[styles.strategyText, { color: theme.textSecondary }]}>{ps.volumeDistribution}</Text>
            </View>
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
  loadingText: {
    marginTop: 12,
    fontSize: 14,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 14,
    lineHeight: 20,
  },
  debugText: {
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
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
  weekSection: {
    marginBottom: 12,
  },
  weekHeader: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  weekPhase: {
    fontSize: 13,
    fontWeight: '600',
  },
  weekFocus: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
    paddingHorizontal: 12,
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
  noExercisesText: {
    fontSize: 13,
    fontStyle: 'italic',
    paddingVertical: 8,
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
  rawJsonScroll: {
    maxHeight: 400,
  },
  rawJson: {
    fontSize: 11,
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
    lineHeight: 16,
  },
  strategyBox: {
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
  },
  strategyLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  strategyText: {
    fontSize: 13,
    lineHeight: 20,
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
