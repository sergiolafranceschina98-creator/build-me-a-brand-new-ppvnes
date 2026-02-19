
import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  const theme = colors.dark;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'About',
          headerStyle: { backgroundColor: theme.backgroundSecondary },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          headerLargeTitle: true,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
            <IconSymbol
              ios_icon_name="sparkles"
              android_material_icon_name="auto-awesome"
              size={48}
              color="#FFFFFF"
            />
          </View>
          <Text style={[styles.appName, { color: theme.text }]}>
            AI Workout Builder
          </Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>
            For Personal Trainers
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Core Promise
          </Text>
          <Text style={[styles.cardText, { color: theme.textSecondary }]}>
            Create fully personalized, periodized workout programs for your clients in under 60 seconds.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Features
          </Text>
          <View style={styles.featureItem}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={20}
              color={theme.success}
              style={styles.featureIcon}
            />
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              AI-powered program generation
            </Text>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={20}
              color={theme.success}
              style={styles.featureIcon}
            />
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              4-12 week periodized plans
            </Text>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={20}
              color={theme.success}
              style={styles.featureIcon}
            />
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              Progressive overload built-in
            </Text>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={20}
              color={theme.success}
              style={styles.featureIcon}
            />
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              Injury-aware exercise selection
            </Text>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={20}
              color={theme.success}
              style={styles.featureIcon}
            />
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              Equipment-based customization
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Target Users
          </Text>
          <Text style={[styles.cardText, { color: theme.textSecondary }]}>
            - Personal trainers{'\n'}
            - Online fitness coaches{'\n'}
            - Small gym owners{'\n'}
            - Hybrid (in-person + online) coaches
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Version 1.0.0
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 12,
  },
});
