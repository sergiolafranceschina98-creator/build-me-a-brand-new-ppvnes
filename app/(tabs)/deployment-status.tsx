
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import React from 'react';
import { colors } from '@/styles/commonStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  warningCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  codeBlock: {
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 13,
  },
  linkButton: {
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  linkButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
});

export default function DeploymentStatusScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const backgroundColor = isDark ? colors.backgroundDark : colors.backgroundLight;
  const textColor = isDark ? colors.textDark : colors.textLight;
  const cardBackground = isDark ? '#1c1c1e' : '#f2f2f7';
  const warningBackground = isDark ? '#3a2a1a' : '#fff3cd';
  const warningBorder = isDark ? '#ffc107' : '#ffc107';
  const warningText = isDark ? '#ffc107' : '#856404';
  const successColor = '#34c759';
  const processingColor = '#007aff';
  const codeBackground = isDark ? '#2c2c2e' : '#e5e5ea';

  const handleOpenAppStoreConnect = () => {
    Linking.openURL('https://appstoreconnect.apple.com/apps');
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{
          title: 'Deployment Status',
          headerStyle: { backgroundColor },
          headerTintColor: textColor,
        }}
      />
      <ScrollView style={styles.scrollContent}>
        <Text style={[styles.header, { color: textColor }]}>
          TestFlight Processing
        </Text>
        <Text style={[styles.subtitle, { color: textColor }]}>
          Understanding Apple's build processing timeline
        </Text>

        <View style={styles.warningCard}>
          <View style={{ borderColor: warningBorder, backgroundColor: warningBackground, borderRadius: 12, padding: 16 }}>
            <Text style={[styles.warningTitle, { color: warningText }]}>
              ⏳ This is Normal!
            </Text>
            <Text style={[styles.warningText, { color: warningText }]}>
              Your build was successfully uploaded to App Store Connect. Apple is now processing it on their servers. This can take 10 minutes to 24 hours.
            </Text>
            <Text style={[styles.warningText, { color: warningText }]}>
              You will receive a TestFlight email ONLY AFTER Apple finishes processing.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            What's Happening Now
          </Text>
          
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: successColor }]} />
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, { color: textColor }]}>
                ✅ Build Uploaded
              </Text>
              <Text style={[styles.timelineDescription, { color: textColor }]}>
                Your .ipa file was successfully uploaded to App Store Connect
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: processingColor }]} />
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, { color: textColor }]}>
                ⏳ Apple Processing (Current Step)
              </Text>
              <Text style={[styles.timelineDescription, { color: textColor }]}>
                Apple is validating your app, checking entitlements, and preparing it for TestFlight. This is outside our control.
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: '#8e8e93' }]} />
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, { color: textColor }]}>
                📧 TestFlight Email (Waiting)
              </Text>
              <Text style={[styles.timelineDescription, { color: textColor }]}>
                You'll receive an email when processing completes and your build is ready for testing
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Common Issues & Solutions
          </Text>

          <View style={[styles.card, { backgroundColor: cardBackground }]}>
            <View style={styles.stepContainer}>
              <View style={styles.iconContainer}>
                <IconSymbol
                  ios_icon_name="number"
                  android_material_icon_name="looks-one"
                  size={24}
                  color={textColor}
                />
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: textColor }]}>
                  Build Number Not Incremented
                </Text>
                <Text style={[styles.stepDescription, { color: textColor }]}>
                  Each new upload MUST have a unique buildNumber. If you uploaded twice with the same buildNumber, Apple will reject the second one silently.
                </Text>
                <View style={[styles.codeBlock, { backgroundColor: codeBackground }]}>
                  <Text style={[styles.codeText, { color: textColor }]}>
                    {`// app.json\n"ios": {\n  "buildNumber": "1.0.1" // ← Increment this\n}`}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: cardBackground }]}>
            <View style={styles.stepContainer}>
              <View style={styles.iconContainer}>
                <IconSymbol
                  ios_icon_name="clock"
                  android_material_icon_name="schedule"
                  size={24}
                  color={textColor}
                />
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: textColor }]}>
                  First-Time App Delays
                </Text>
                <Text style={[styles.stepDescription, { color: textColor }]}>
                  First submissions can take longer (up to 24 hours) as Apple performs additional validation checks.
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: cardBackground }]}>
            <View style={styles.stepContainer}>
              <View style={styles.iconContainer}>
                <IconSymbol
                  ios_icon_name="exclamationmark.triangle"
                  android_material_icon_name="warning"
                  size={24}
                  color={textColor}
                />
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: textColor }]}>
                  Validation Failures
                </Text>
                <Text style={[styles.stepDescription, { color: textColor }]}>
                  If Apple finds issues (missing privacy manifest, incorrect entitlements), they'll send an email to your developer account. Check your email spam folder.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            What To Do Now
          </Text>

          <View style={[styles.card, { backgroundColor: cardBackground }]}>
            <Text style={[styles.stepDescription, { color: textColor }]}>
              1. Wait 30-60 minutes for initial processing
            </Text>
            <Text style={[styles.stepDescription, { color: textColor, marginTop: 8 }]}>
              2. Check your email (including spam) for messages from Apple
            </Text>
            <Text style={[styles.stepDescription, { color: textColor, marginTop: 8 }]}>
              3. Log into App Store Connect to check build status
            </Text>
            <Text style={[styles.stepDescription, { color: textColor, marginTop: 8 }]}>
              4. If no email after 24 hours, increment buildNumber and submit again
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.linkButton, { backgroundColor: processingColor }]}
            onPress={handleOpenAppStoreConnect}
          >
            <Text style={[styles.linkButtonText, { color: '#ffffff' }]}>
              Open App Store Connect
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Next Build Checklist
          </Text>

          <View style={[styles.card, { backgroundColor: cardBackground }]}>
            <Text style={[styles.stepDescription, { color: textColor }]}>
              ✓ Increment buildNumber in app.json
            </Text>
            <Text style={[styles.stepDescription, { color: textColor, marginTop: 8 }]}>
              ✓ Ensure all required privacy descriptions are in Info.plist
            </Text>
            <Text style={[styles.stepDescription, { color: textColor, marginTop: 8 }]}>
              ✓ Verify bundle identifier matches App Store Connect
            </Text>
            <Text style={[styles.stepDescription, { color: textColor, marginTop: 8 }]}>
              ✓ Check that ITSAppUsesNonExemptEncryption is set correctly
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
