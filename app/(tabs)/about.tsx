
import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.highlight }]}>
            <IconSymbol
              ios_icon_name="dumbbell.fill"
              android_material_icon_name="fitness-center"
              size={64}
              color={theme.primary}
            />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            AI Workout Builder
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            For Personal Trainers
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Core Promise
          </Text>
          <Text style={[styles.cardText, { color: theme.textSecondary }]}>
            Create fully personalized, periodized workout programs for your clients in under 60 seconds.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Target Users
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
              <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                Personal trainers
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
              <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                Online fitness coaches
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
              <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                Small gym owners
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
              <Text style={[styles.bulletText, { color: theme.textSecondary }]}>
                Hybrid (in-person + online) coaches
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Key Features
          </Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: theme.highlight }]}>
                <IconSymbol
                  ios_icon_name="person.fill"
                  android_material_icon_name="person"
                  size={24}
                  color={theme.primary}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: theme.text }]}>
                  Client Profiles
                </Text>
                <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                  Comprehensive client data including age, goals, experience, and limitations
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: theme.highlight }]}>
                <IconSymbol
                  ios_icon_name="sparkles"
                  android_material_icon_name="auto-awesome"
                  size={24}
                  color={theme.primary}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: theme.text }]}>
                  AI Program Generator
                </Text>
                <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                  4-12 week periodized plans with progressive overload built-in
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: theme.highlight }]}>
                <IconSymbol
                  ios_icon_name="chart.bar.fill"
                  android_material_icon_name="bar-chart"
                  size={24}
                  color={theme.primary}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: theme.text }]}>
                  Smart Progression
                </Text>
                <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                  Automatic adjustments based on client performance and feedback
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: theme.highlight }]}>
                <IconSymbol
                  ios_icon_name="list.bullet"
                  android_material_icon_name="list"
                  size={24}
                  color={theme.primary}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: theme.text }]}>
                  Exercise Database
                </Text>
                <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                  Curated library with exercises categorized by muscle group and equipment
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Version
          </Text>
          <Text style={[styles.cardText, { color: theme.textSecondary }]}>
            1.0.2
          </Text>
        </View>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
  },
  bulletList: {
    gap: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 20,
    marginRight: 12,
    fontWeight: 'bold',
  },
  bulletText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  featureList: {
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
