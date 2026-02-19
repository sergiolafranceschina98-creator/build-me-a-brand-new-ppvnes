
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Platform,
  Modal,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import Constants from 'expo-constants';

const BACKEND_URL =
  (Constants.expoConfig?.extra?.backendUrl as string) ||
  'https://nkn5cez75xgu5asaygkf9t536w43m4z9.app.specular.dev';

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

export default function CreateClientScreen() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [validationModal, setValidationModal] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });
  const [errorModal, setErrorModal] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [experience, setExperience] = useState('beginner');
  const [goals, setGoals] = useState('hypertrophy');
  const [trainingFrequency, setTrainingFrequency] = useState('3');
  const [equipment, setEquipment] = useState('commercial gym');
  const [injuries, setInjuries] = useState('');
  const [preferredExercises, setPreferredExercises] = useState('');
  const [sessionDuration, setSessionDuration] = useState('60');
  const [bodyFat, setBodyFat] = useState('');

  const handleSubmit = async () => {
    console.log('User tapped Create Client button');
    
    if (!name.trim()) {
      setValidationModal({ visible: true, message: 'Please enter the client\'s name.' });
      return;
    }
    if (!age || isNaN(parseInt(age)) || parseInt(age) < 1 || parseInt(age) > 120) {
      setValidationModal({ visible: true, message: 'Please enter a valid age (1–120).' });
      return;
    }
    if (!height || isNaN(parseInt(height)) || parseInt(height) < 50 || parseInt(height) > 300) {
      setValidationModal({ visible: true, message: 'Please enter a valid height in cm (50–300).' });
      return;
    }
    if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) < 20 || parseFloat(weight) > 500) {
      setValidationModal({ visible: true, message: 'Please enter a valid weight in kg (20–500).' });
      return;
    }

    const payload: Record<string, unknown> = {
      name: name.trim(),
      age: parseInt(age),
      gender,
      height: parseInt(height),
      weight: parseFloat(weight),
      experience,
      goals,
      training_frequency: parseInt(trainingFrequency),
      equipment,
      session_duration: parseInt(sessionDuration),
    };

    if (injuries.trim()) payload.injuries = injuries.trim();
    if (preferredExercises.trim()) payload.preferred_exercises = preferredExercises.trim();
    if (bodyFat.trim() && !isNaN(parseFloat(bodyFat))) {
      payload.body_fat_percentage = parseFloat(bodyFat);
    }

    try {
      setLoading(true);
      console.log('Creating client with data:', payload);
      const newClient = await apiPost<{ id: string; name: string }>('/api/clients', payload);
      console.log('Client created successfully:', newClient);
      // Navigate back to home after successful creation
      router.back();
    } catch (error: any) {
      console.error('Error creating client:', error);
      setErrorModal({ visible: true, message: error?.message || 'Failed to create client. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderSelector = (
    label: string,
    options: { value: string; label: string }[],
    selectedValue: string,
    onSelect: (value: string) => void
  ) => (
    <View style={styles.selectorContainer}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View style={styles.optionsRow}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                { borderColor: theme.border },
                isSelected && { backgroundColor: theme.primary, borderColor: theme.primary },
              ]}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: theme.text },
                  isSelected && { color: '#FFFFFF' },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'New Client',
          headerStyle: { backgroundColor: theme.card },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          headerBackTitle: 'Back',
        }}
      />

      {/* Validation Modal */}
      <Modal
        visible={validationModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setValidationModal({ visible: false, message: '' })}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Missing Information</Text>
            <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>
              {validationModal.message}
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.primary }]}
              onPress={() => setValidationModal({ visible: false, message: '' })}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, Platform.OS === 'android' && styles.scrollContentAndroid]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Basic Information
          </Text>

          <Text style={[styles.label, { color: theme.text }]}>Name *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
            placeholder="Client name"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={[styles.label, { color: theme.text }]}>Age *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                placeholder="25"
                placeholderTextColor={theme.textSecondary}
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.halfWidth}>
              {renderSelector('Gender', [
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ], gender, setGender)}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={[styles.label, { color: theme.text }]}>Height (cm) *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                placeholder="175"
                placeholderTextColor={theme.textSecondary}
                value={height}
                onChangeText={setHeight}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={[styles.label, { color: theme.text }]}>Weight (kg) *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                placeholder="75"
                placeholderTextColor={theme.textSecondary}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <Text style={[styles.label, { color: theme.text }]}>Body Fat % (optional)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
            placeholder="15"
            placeholderTextColor={theme.textSecondary}
            value={bodyFat}
            onChangeText={setBodyFat}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Training Profile
          </Text>

          {renderSelector('Experience Level', [
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced' },
          ], experience, setExperience)}

          {renderSelector('Primary Goal', [
            { value: 'fat loss', label: 'Fat Loss' },
            { value: 'hypertrophy', label: 'Muscle Gain' },
            { value: 'strength', label: 'Strength' },
          ], goals, setGoals)}

          {renderSelector('Training Frequency', [
            { value: '2', label: '2x/week' },
            { value: '3', label: '3x/week' },
            { value: '4', label: '4x/week' },
            { value: '5', label: '5x/week' },
            { value: '6', label: '6x/week' },
          ], trainingFrequency, setTrainingFrequency)}

          {renderSelector('Session Duration', [
            { value: '45', label: '45 min' },
            { value: '60', label: '60 min' },
            { value: '90', label: '90 min' },
          ], sessionDuration, setSessionDuration)}

          {renderSelector('Equipment', [
            { value: 'commercial gym', label: 'Commercial Gym' },
            { value: 'home gym', label: 'Home Gym' },
            { value: 'dumbbells only', label: 'Dumbbells Only' },
          ], equipment, setEquipment)}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Additional Details
          </Text>

          <Text style={[styles.label, { color: theme.text }]}>Injuries or Limitations</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
            placeholder="e.g., Lower back pain, shoulder impingement"
            placeholderTextColor={theme.textSecondary}
            value={injuries}
            onChangeText={setInjuries}
            multiline
            numberOfLines={3}
          />

          <Text style={[styles.label, { color: theme.text }]}>Preferred Exercises</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
            placeholder="e.g., Squats, deadlifts, bench press"
            placeholderTextColor={theme.textSecondary}
            value={preferredExercises}
            onChangeText={setPreferredExercises}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.primary }]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <React.Fragment>
              <IconSymbol
                ios_icon_name="checkmark"
                android_material_icon_name="check"
                size={20}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
              <Text style={styles.submitButtonText}>Create Client</Text>
            </React.Fragment>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  textArea: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  selectorContainer: {
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 18,
    marginTop: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
